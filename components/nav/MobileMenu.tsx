'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ContactSalesButton } from '@/components/contact/ContactSalesButton';
import { drawerLinks, infraMenuGroups, siteMenuGroups } from '@/content/nav';
import { interestFromLocation, isHashCurrent, jumpHash } from './hubNav';
import styles from './MobileMenu.module.css';

type Props = { pathname: string; hash: string; onNavigate: () => void };

const rest: { href: string; label: string; badge?: string }[] = [
  { href: '/about', label: 'О нас' },
  { href: '/pricing', label: 'Цены' },
];

/** Те же группы, что у вкладок «Сайты» и «VPN/AI». */
const groups = [...siteMenuGroups, ...infraMenuGroups];

/** Меню: те же группы, что у вкладок «Сайты» и «VPN/AI», затем служебные. */
export function MobileMenu({ pathname, hash, onNavigate }: Props) {
  const router = useRouter();
  const goGroup = (href: string) => {
    if (!jumpHash(href, pathname)) router.push(href);
    onNavigate();
  };

  return (
    <div className={styles.drawer} id="mobile-menu">
      <div className={styles.cta} onClick={onNavigate}>
        <ContactSalesButton interest={interestFromLocation(pathname, hash)} />
      </div>
      <Link
        href="/"
        className={[styles.row, pathname === '/' ? styles.active : ''].filter(Boolean).join(' ')}
        onClick={onNavigate}
      >
        Главная
        <span className="label" aria-hidden="true">
          ›
        </span>
      </Link>
      {groups.map((group) => {
        // Группа с меткой оборачивает подписи всех своих пунктов - так было и
        // в разметке до слияния двух одинаковых блоков.
        const wrapLabels = group.items.some((entry) => entry.badge);
        return (
          <div
            key={group.title}
            className={styles.group}
            onClick={(event) => {
              if ((event.target as HTMLElement).closest('a')) return;
              goGroup(group.href);
            }}
          >
            <Link
              href={group.href}
              className={styles.heading}
              onClick={(event) => {
                if (jumpHash(group.href, pathname)) event.preventDefault();
                onNavigate();
              }}
            >
              {group.title}
            </Link>
            {group.items.map((item) => (
              <Link
                key={`${item.href}:${item.label}`}
                href={item.href}
                className={[styles.row, styles.sub, isHashCurrent(pathname, hash, item.href) ? styles.current : '']
                  .filter(Boolean)
                  .join(' ')}
                onClick={(event) => {
                  if (jumpHash(item.href, pathname)) event.preventDefault();
                  onNavigate();
                }}
                aria-label={item.badge ? `${item.label}, ${item.badge}` : undefined}
              >
                {wrapLabels ? (
                  <span className={styles.label}>
                    {item.label}
                    {item.badge ? (
                      <span className="hitbadge" aria-hidden="true">
                        {item.badge}
                      </span>
                    ) : null}
                  </span>
                ) : (
                  item.label
                )}
                <span className="label" aria-hidden="true">
                  ›
                </span>
              </Link>
            ))}
          </div>
        );
      })}
      {rest.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={[styles.row, pathname === item.href ? styles.active : ''].filter(Boolean).join(' ')}
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
      ))}
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
