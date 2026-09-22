import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

type Props = { children: ReactNode; className?: string };

/** 14/400 pewter, underlines on hover at 3px offset. Used as a route link. */
export function TextLink({
  href,
  children,
  className,
  ...rest
}: Props & { href: string } & Omit<ComponentProps<typeof Link>, 'className' | 'children' | 'href'>) {
  return (
    <Link href={href} className={['tlink', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </Link>
  );
}

/** Та же ссылка там, где действие не переход, а открытие окна заявки. */
export function TextButton({
  children,
  className,
  ...rest
}: Props & Omit<ComponentProps<'button'>, 'className' | 'children'>) {
  return (
    <button type="button" className={['tlink', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </button>
  );
}
