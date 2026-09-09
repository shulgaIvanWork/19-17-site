import Link from 'next/link';

type Props = { href: string; label: string; active: boolean };

/** 32px nav control. Active route: cloud ground, carbon ink. Inactive: pewter. */
export function NavButton({ href, label, active }: Props) {
  return (
    <Link
      href={href}
      className={['navbtn', active ? 'navbtn-active' : ''].filter(Boolean).join(' ')}
      aria-current={active ? 'page' : undefined}
    >
      {label}
    </Link>
  );
}
