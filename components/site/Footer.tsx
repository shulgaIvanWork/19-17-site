import Link from 'next/link';
import { EnquireLink } from '@/components/contact/ContactSalesButton';
import { footerGroups, mailHref, mailLabel, phoneHref, phoneLabel, wordmark } from '@/content/nav';
import { footerNote } from '@/content/site';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={['wrap', styles.grid].join(' ')}>
        <div className={styles.brand}>
          <Link href="/" className={styles.wordmark}>
            {wordmark}
          </Link>
          <p className={styles.note}>{footerNote}</p>
          <a className={styles.phone} href={phoneHref}>
            {phoneLabel}
          </a>
          <a className={styles.mail} href={mailHref}>
            {mailLabel}
          </a>
          <EnquireLink label="Обсудить задачу" className="actionlink" />
        </div>

        <nav className={styles.navigation} aria-label="Навигация в подвале">
          {footerGroups.map((group) => (
            <div className={styles.group} key={group.title}>
              <h2 className={styles.heading}>{group.title}</h2>
              <div className={styles.links}>
                {group.items.map((item) => (
                  <Link key={item.href} href={item.href} className={['tlink', styles.link].join(' ')}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </footer>
  );
}
