'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentProps } from 'react';
import { jumpHash } from './hubNav';

/** Next.js will not scroll to a hash on the page you are already on. */
export function HashLink({
  href,
  onClick,
  ...rest
}: ComponentProps<typeof Link> & { href: string }) {
  const pathname = usePathname();
  return (
    <Link
      href={href}
      {...rest}
      onClick={(event) => {
        if (jumpHash(href, pathname)) event.preventDefault();
        onClick?.(event);
      }}
    />
  );
}
