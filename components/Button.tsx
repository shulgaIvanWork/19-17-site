import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

type Variant = 'blue' | 'white' | 'ash';

const variantClass: Record<Variant, string> = {
  blue: 'btn-blue',
  white: 'btn-white',
  ash: 'btn-ash',
};

type BaseProps = {
  variant?: Variant;
  /** Hero buttons carry the canonical 200px minimum width. */
  hero?: boolean;
  className?: string;
  children: ReactNode;
};

type ButtonProps = BaseProps & Omit<ComponentProps<'button'>, 'className' | 'children'>;
type LinkProps = BaseProps & { href: string } & Omit<ComponentProps<typeof Link>, 'className' | 'children' | 'href'>;

function classes({ variant = 'blue', hero, className }: BaseProps) {
  return ['btn', variantClass[variant], hero ? 'btn-hero' : '', className ?? '']
    .filter(Boolean)
    .join(' ');
}

/** The system's only button. Three variants, no border, no shadow, colour-only hover. */
export function Button({ variant, hero, className, children, ...rest }: ButtonProps) {
  return (
    <button type="button" className={classes({ variant, hero, className, children })} {...rest}>
      {children}
    </button>
  );
}

/** The same control rendered as a route link. */
export function ButtonLink({ variant, hero, className, children, href, ...rest }: LinkProps) {
  return (
    <Link href={href} className={classes({ variant, hero, className, children })} {...rest}>
      {children}
    </Link>
  );
}
