'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ContactSalesButton } from '@/components/contact/ContactSalesButton';
import { isHubJumping, onHubJumpStart } from '@/components/hub/hubScroll';
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
/** Сдвиг за кадр, после которого шапка прячется или возвращается. */
const HEADER_STEP_PX = 2;
/** Сколько после касания, колеса или клавиши прокрутка считается делом посетителя:
 *  на телефоне страница еще катится по инерции после того, как палец убран. */
const USER_SCROLL_MS = 1500;

export function SiteHeader() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
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

  // Узкий экран: шапка уезжает вверх при прокрутке вниз и возвращается при
  // прокрутке вверх. Атрибут ставится прямо на DOM, без состояния React: решение
  // принимается на каждом кадре прокрутки. Прячется шапка только от прокрутки
  // посетителя. Прыжок по разделам, посадка на якорь и переход на страницу
  // считают место с учетом высоты шапки (hubScroll, yOf), и спрятанная шапка
  // оставила бы над разделом пустую полосу. У верха страницы и при открытом
  // меню шапка всегда на месте.
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const narrow = window.matchMedia('(max-width: 900px)');
    let lastY = window.scrollY;
    let userAt = -Infinity;
    let frame: number | null = null;

    const setHidden = (hidden: boolean) => header.toggleAttribute('data-scroll-hidden', hidden);
    const update = () => {
      frame = null;
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      if (!narrow.matches || y <= header.offsetHeight || header.hasAttribute('data-menu-open') || isHubJumping()) {
        setHidden(false);
        return;
      }
      if (performance.now() - userAt > USER_SCROLL_MS) return;
      if (dy > HEADER_STEP_PX) setHidden(true);
      else if (dy < -HEADER_STEP_PX) setHidden(false);
    };
    const onScroll = () => {
      if (frame === null) frame = window.requestAnimationFrame(update);
    };
    const onInput = () => {
      userAt = performance.now();
    };
    const stopJump = onHubJumpStart(() => setHidden(false));
    const inputs = ['touchstart', 'touchmove', 'wheel', 'keydown'] as const;

    window.addEventListener('scroll', onScroll, { passive: true });
    for (const type of inputs) window.addEventListener(type, onInput, { passive: true });
    narrow.addEventListener('change', onScroll);
    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      stopJump();
      window.removeEventListener('scroll', onScroll);
      for (const type of inputs) window.removeEventListener(type, onInput);
      narrow.removeEventListener('change', onScroll);
    };
  }, []);

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
      <header
        ref={headerRef}
        className={styles.header}
        data-header-glow
        data-menu-open={menuMounted ? '' : undefined}
      >
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
