'use client';

import Link from 'next/link';
import { ContactSalesButton } from '@/components/contact/ContactSalesButton';
import { mainNav, phoneHref, phoneLabel, serviceMenuGroups } from '@/content/nav';
import { serviceByPath } from '@/content/services';
import styles from './MobileMenu.module.css';

type Props = { pathname: string; open?: boolean; onNavigate: () => void };

/** Страницы сайта на узком экране. Услуги показаны списком по группам: на
 *  телефоне выпадающая панель шапки недоступна, а услуг девять, и прятать их
 *  за одну строку «Услуги» значит спрятать половину сайта. Отдельной строки
 *  «Услуги» нет: она вела бы на блок главной, который тут же и расписан. */
export function MobileMenu({ pathname, open = true, onNavigate }: Props) {
  const [home, ...company] = mainNav;

  return (
    <div className={[styles.drawer, open ? styles.open : ''].filter(Boolean).join(' ')} id="mobile-menu">
      <Row item={home} pathname={pathname} onNavigate={onNavigate} />

      {serviceMenuGroups.map((group) => (
        <div key={group.title} className={styles.group}>
          <div className={styles.groupName}>{group.title}</div>
          {group.items.map((item) => (
            <Row key={item.href} item={item} pathname={pathname} onNavigate={onNavigate} nested />
          ))}
        </div>
      ))}

      {company.map((item) => (
        <Row key={item.href} item={item} pathname={pathname} onNavigate={onNavigate} />
      ))}

      <div className={styles.cta} onClick={onNavigate}>
        <ContactSalesButton interest={serviceByPath(pathname)?.interest} />
      </div>
      <div className={styles.call}>
        <div className="label">Телефон</div>
        <a href={phoneHref} className={styles.phone} onClick={onNavigate}>
          {phoneLabel}
        </a>
      </div>
    </div>
  );
}

function Row({
  item,
  pathname,
  onNavigate,
  nested = false,
}: {
  item: { href: string; label: string; badge?: string };
  pathname: string;
  onNavigate: () => void;
  nested?: boolean;
}) {
  const active = pathname === item.href;

  return (
    <Link
      href={item.href}
      className={[styles.row, nested ? styles.nested : '', active ? styles.active : ''].filter(Boolean).join(' ')}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
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
}
