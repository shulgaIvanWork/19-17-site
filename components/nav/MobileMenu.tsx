'use client';

import Link from 'next/link';
import { ContactSalesButton } from '@/components/contact/ContactSalesButton';
import { drawerLinks, hitBadge, infraTabHref, phoneHref, phoneLabel, sitesTabHref } from '@/content/nav';
import { interestFromLocation } from '@/components/hub/hubLinks';
import styles from './MobileMenu.module.css';

type Props = { pathname: string; hash: string; open?: boolean; onNavigate: () => void };

const links: { href: string; label: string; badge?: string }[] = [
  { href: '/', label: 'Главная' },
  { href: sitesTabHref, label: 'Сайты' },
  { href: infraTabHref, label: 'VPN / AI', badge: hitBadge },
  { href: '/pricing', label: 'Цены' },
  { href: '/about', label: 'О нас' },
];

function pathOf(href: string) {
  return href.split('#')[0] || href;
}

/** Страницы сайта. Якоря разделов хаба — в нижнем пейджере, не здесь. */
export function MobileMenu({ pathname, hash, open = true, onNavigate }: Props) {
  return (
    <div className={[styles.drawer, open ? styles.open : ''].filter(Boolean).join(' ')} id="mobile-menu">
      <div className={styles.cta} onClick={onNavigate}>
        <ContactSalesButton interest={interestFromLocation(pathname, hash)} />
      </div>
      {links.map((item) => {
        const active = pathname === pathOf(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={[styles.row, active ? styles.active : ''].filter(Boolean).join(' ')}
            onClick={onNavigate}
            aria-label={item.badge ? `${item.label}, ${item.badge}` : undefined}
          >
            <span className={styles.label}>
              {item.label}
              {item.badge ? (
                <span className="hitbadge" aria-hidden="true">
                  {item.badge}
                </span>
              ) : null}
            </span>
            <span className="label" aria-hidden="true">
              ›
            </span>
          </Link>
        );
      })}
      <div className={styles.call}>
        <div className="label">Телефон</div>
        <a href={phoneHref} className={styles.phone} onClick={onNavigate}>
          {phoneLabel}
        </a>
      </div>
      {drawerLinks.length > 0 && (
        <div className={styles.utility}>
          {drawerLinks.map((label) => (
            <span key={label} className="tlink">
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
