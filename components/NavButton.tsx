import Link from 'next/link';
import styles from './NavButton.module.css';

type Props = { href: string; label: string; active: boolean; badge?: string };

/** 32px nav control. Active route: cloud ground, carbon ink. Inactive: pewter. */
export function NavButton({ href, label, active, badge }: Props) {
  return (
    <Link
      href={href}
      className={['navbtn', active ? 'navbtn-active' : '', badge ? styles.withBadge : '']
        .filter(Boolean)
        .join(' ')}
      aria-current={active ? 'page' : undefined}
      aria-label={badge ? `${label}, ${badge}` : undefined}
    >
      {label}
      {badge ? (
        <span className="hitbadge" aria-hidden="true">
          {badge}
        </span>
      ) : null}
    </Link>
  );
}
