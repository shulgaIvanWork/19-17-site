'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ContactSalesButton } from './ContactSalesButton';
import { ThemeToggle } from './ThemeToggle';
import { HubMenu } from './SitesMenu';
import { MobileMenu } from './MobileMenu';
import { NavButton } from './NavButton';
import { useHubSectionHash } from './useHubSectionHash';
import {
  infraHubPaths,
  infraMenuGroups,
  infraTabHref,
  infraTabLabel,
  hitBadge,
  siteHubPaths,
  siteMenuGroups,
  sitesTabHref,
  wordmark,
} from '@/content/nav';
import { interestFromLocation } from '@/lib/hubNav';
import styles from './SiteHeader.module.css';

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const hash = useHubSectionHash(pathname);

  // Смена маршрута закрывает мобильное меню.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header className={styles.header} data-header-glow>
        <div className={styles.row}>
          <div className={styles.brand}>
            <Link href="/" className={styles.wordmark}>
              {wordmark}
            </Link>
          </div>

          {/* «Сайты» и «VPN/AI» раскрываются группами.
              «Цены» в шапке намеренно нет: на страницу ведут кнопки героев и футер. */}
          <nav className={styles.links} aria-label="Основная навигация">
            <NavButton href="/" label="Главная" active={pathname === '/'} />
            <HubMenu
              pathname={pathname}
              hash={hash}
              label="Сайты"
              tabHref={sitesTabHref}
              groups={siteMenuGroups}
              hubPaths={siteHubPaths}
            />
            <HubMenu
              pathname={pathname}
              hash={hash}
              label={infraTabLabel}
              tabHref={infraTabHref}
              groups={infraMenuGroups}
              hubPaths={infraHubPaths}
              badge={hitBadge}
            />
            <NavButton href="/about" label="О нас" active={pathname === '/about'} />
          </nav>

          <div className={styles.right}>
            <span className={styles.deskCta}>
              <ContactSalesButton interest={interestFromLocation(pathname, hash)} />
            </span>
            <ThemeToggle />
            <button
              type="button"
              className={['navbtn', styles.burger].join(' ')}
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Меню"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              {menuOpen ? '×' : '≡'}
            </button>
          </div>
        </div>
        <div className={styles.progress} aria-hidden="true">
          <span className={styles.progressFill} />
        </div>
      </header>

      {menuOpen && <MobileMenu pathname={pathname} hash={hash} onNavigate={() => setMenuOpen(false)} />}
    </>
  );
}
