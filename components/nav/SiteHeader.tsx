'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ContactSalesButton } from '@/components/contact/ContactSalesButton';
import { ThemeToggle } from './ThemeToggle';
import { HubMenu } from './SitesMenu';
import { MobileMenu } from './MobileMenu';
import { NavButton } from './NavButton';
import { useHubSectionHash } from '@/components/hub/useHubSectionHash';
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
import { interestFromLocation } from '@/components/hub/hubLinks';
import styles from './SiteHeader.module.css';

const MENU_MS = 380;

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuMounted, setMenuMounted] = useState(false);
  const [menuEntered, setMenuEntered] = useState(false);
  const hash = useHubSectionHash(pathname);

  // Три правки состояния во время отрисовки вместо эффектов: смена маршрута
  // закрывает меню, открытие монтирует ящик, закрытие снимает класс входа.
  // В эффекте те же строки давали каскадную перерисовку и лишний кадр.
  const [seenPath, setSeenPath] = useState(pathname);
  if (seenPath !== pathname) {
    setSeenPath(pathname);
    setMenuOpen(false);
  }
  if (menuOpen && !menuMounted) setMenuMounted(true);
  if (!menuOpen && menuEntered) setMenuEntered(false);

  useEffect(() => {
    if (!menuMounted || !menuOpen) return;
    // Класс входа ставится следующим кадром, иначе переход не запустится:
    // браузер применит конечное состояние сразу. При сокращенных анимациях
    // переход выключен стилями, и лишний кадр незаметен.
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setMenuEntered(true));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [menuOpen, menuMounted]);

  useEffect(() => {
    if (menuOpen || !menuMounted) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setTimeout(() => setMenuMounted(false), reduced ? 0 : MENU_MS);
    return () => window.clearTimeout(timer);
  }, [menuOpen, menuMounted]);

  useEffect(() => {
    if (!menuMounted) return;
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };
  }, [menuMounted]);

  return (
    <>
      <header className={styles.header} data-header-glow data-menu-open={menuMounted ? '' : undefined}>
        <div className={styles.row}>
          <div className={styles.brand}>
            <Link href="/" className={styles.wordmark}>
              {wordmark}
            </Link>
          </div>

          {/* «Сайты» и «VPN/AI» раскрываются группами. «Цены» - обычная вкладка. */}
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
            <NavButton href="/pricing" label="Цены" active={pathname === '/pricing'} />
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
              {menuMounted ? '×' : '≡'}
            </button>
          </div>
        </div>
        <div className={styles.progress} aria-hidden="true">
          <span className={styles.progressFill} />
        </div>
      </header>

      {menuMounted
        ? createPortal(
            <>
              <button
                type="button"
                className={[styles.scrim, menuEntered ? styles.scrimOpen : ''].filter(Boolean).join(' ')}
                aria-label="Закрыть меню"
                onClick={() => setMenuOpen(false)}
              />
              <MobileMenu
                pathname={pathname}
                hash={hash}
                open={menuEntered}
                onNavigate={() => setMenuOpen(false)}
              />
            </>,
            document.body,
          )
        : null}
    </>
  );
}
