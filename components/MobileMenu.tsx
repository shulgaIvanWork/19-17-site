'use client';

import Link from 'next/link';
import { drawerLinks, nav } from '@/content/nav';
import styles from './MobileMenu.module.css';

type Props = { pathname: string; onNavigate: () => void };

/** Мобильное меню: строки во всю ширину под шапкой, затем служебные ссылки.
 *  У этих трёх пунктов пока нет назначения — они неактивны, пока оно не появится. */
export function MobileMenu({ pathname, onNavigate }: Props) {
  return (
    <div className={styles.drawer} id="mobile-menu">
      {nav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={[styles.row, pathname === item.href ? styles.active : ''].filter(Boolean).join(' ')}
          onClick={onNavigate}
        >
          {item.label}
          <span className="label" aria-hidden="true">
            ›
          </span>
        </Link>
      ))}
      <div className={styles.utility}>
        {drawerLinks.map((label) => (
          <span key={label} className="tlink">
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
