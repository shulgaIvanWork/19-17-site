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
  /** У кнопок героя минимальная ширина 200px по дизайн-системе. */
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

/** Единственная кнопка системы. Три вида, без рамки и тени, при наведении
 *  меняется только цвет. */
export function Button({ variant, hero, className, children, ...rest }: ButtonProps) {
  return (
    <button type="button" className={classes({ variant, hero, className, children })} {...rest}>
      {children}
    </button>
  );
}

/** Та же кнопка в виде ссылки на маршрут. */
export function ButtonLink({ variant, hero, className, children, href, ...rest }: LinkProps) {
  return (
    <Link href={href} className={classes({ variant, hero, className, children })} {...rest}>
      {children}
    </Link>
  );
}
