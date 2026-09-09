import Link from 'next/link';
import { legalLinks, nav } from '@/content/nav';
import { footerNote } from '@/content/site';
import styles from './Footer.module.css';

/** Линия 1px и одна переносящаяся строка. Без колонок, иконок и подписки. */
export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={['wrap', styles.row].join(' ')}>
        <span className={styles.note}>{footerNote}</span>
        {[...nav, ...legalLinks].map((item) => (
          <Link key={item.href} href={item.href} className={['tlink', styles.link].join(' ')}>
            {item.label}
          </Link>
        ))}
      </div>
    </footer>
  );
}
