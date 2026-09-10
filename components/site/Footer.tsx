import { HashLink } from '@/components/nav/HashLink';
import { EnquireLink } from '@/components/contact/ContactSalesButton';
import { footerGroups, phoneHref, phoneLabel, wordmark } from '@/content/nav';
import { footerNote } from '@/content/site';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={['wrap', styles.grid].join(' ')}>
        <div className={styles.brand}>
          <HashLink href="/" className={styles.wordmark}>
            {wordmark}
          </HashLink>
          <p className={styles.note}>{footerNote}</p>
          <a className={styles.phone} href={phoneHref}>
            {phoneLabel}
          </a>
          <EnquireLink label="Обсудить задачу" className="actionlink" />
        </div>

        <nav className={styles.navigation} aria-label="Навигация в подвале">
          {footerGroups.map((group) => (
            <div className={styles.group} key={group.title}>
              <h2 className={styles.heading}>{group.title}</h2>
              <div className={styles.links}>
                {group.items.map((item) => (
                  <HashLink key={item.href} href={item.href} className={['tlink', styles.link].join(' ')}>
                    {item.label}
                  </HashLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </footer>
  );
}
