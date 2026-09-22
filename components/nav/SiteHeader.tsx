'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ContactSalesButton } from '@/components/contact/ContactSalesButton';
import { ThemeToggle } from './ThemeToggle';
import { HomeMenu } from './HomeMenu';
import { MobileMenu } from './MobileMenu';
import { NavButton } from './NavButton';
import { wordmark } from '@/content/nav';
import { serviceByPath } from '@/content/services';
import styles from './SiteHeader.module.css';

const MENU_MS = 380;

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuMounted, setMenuMounted] = useState(false);
  const [menuEntered, setMenuEntered] = useState(false);

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

  // Прокрутку при открытом меню держит только <html>. С overflow: hidden еще и
  // на <body> тот становился контейнером прокрутки, sticky-шапка уезжала вместе
  // со страницей, и ее переводили в position: fixed. Шапка выпадала из потока,
  // страница прыгала вверх на ее высоту (правка заказчика 2026-09-13).
  useEffect(() => {
    if (!menuMounted) return;
    const html = document.documentElement;
    const prevHtml = html.style.overflow;
    html.style.overflow = 'hidden';
    return () => {
      html.style.overflow = prevHtml;
    };
  }, [menuMounted]);

  const interest = serviceByPath(pathname)?.interest;

  return (
    <>
      <header className={styles.header} data-header-glow data-menu-open={menuMounted ? '' : undefined}>
        <div className={styles.row}>
          <div className={styles.brand}>
            <Link href="/" className={styles.wordmark}>
              {wordmark}
            </Link>
          </div>

          {/* Услуги раскрываются панелью под «Главной»: отдельной вкладки у них
              нет, список услуг живет блоком на самой главной. */}
          <nav className={styles.links} aria-label="Основная навигация">
            <HomeMenu pathname={pathname} />
            <NavButton href="/works" label="Работы" active={pathname === '/works'} />
            <NavButton href="/pricing" label="Цены" active={pathname === '/pricing'} />
            <NavButton href="/about" label="О нас" active={pathname === '/about'} />
          </nav>

          <div className={styles.right}>
            <span className={styles.deskCta}>
              <ContactSalesButton interest={interest} />
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
              {/* Одни и те же три полосы: при открытом меню повернуты на 90°. */}
              <svg className={styles.burgerIcon} viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
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
                className={styles.scrim}
                aria-label="Закрыть меню"
                onClick={() => setMenuOpen(false)}
              />
              <MobileMenu pathname={pathname} open={menuEntered} onNavigate={() => setMenuOpen(false)} />
            </>,
            document.body,
          )
        : null}
    </>
  );
}
