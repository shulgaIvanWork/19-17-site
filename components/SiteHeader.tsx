'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ContactSalesButton } from './ContactSalesButton';
import { MobileMenu } from './MobileMenu';
import { NavButton } from './NavButton';
import { SitesMenu } from './SitesMenu';
import { wordmark } from '@/content/nav';
import styles from './SiteHeader.module.css';

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Смена маршрута закрывает мобильное меню.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.row}>
          <Link href="/" className={styles.wordmark}>
            {wordmark}
          </Link>

          {/* Пять вкладок; шесть услуг по сайтам — за панелью «Сайты».
              «Цены» в шапке намеренно нет: на страницу ведут кнопки героев и футер. */}
          <nav className={styles.links} aria-label="Основная навигация">
            <NavButton href="/" label="Главная" active={pathname === '/'} />
            <SitesMenu pathname={pathname} />
            <NavButton href="/vpn" label="VPN" active={pathname === '/vpn'} />
            <NavButton href="/ai" label="AI" active={pathname === '/ai'} />
            <NavButton href="/about" label="О нас" active={pathname === '/about'} />
          </nav>

          <div className={styles.right}>
            <ContactSalesButton />
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
      </header>

      {menuOpen && <MobileMenu pathname={pathname} onNavigate={() => setMenuOpen(false)} />}
    </>
  );
}
