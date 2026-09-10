'use client';

import { usePathname } from 'next/navigation';
import { hubStops, isHashCurrent, jumpHash } from '@/lib/hubNav';
import { useHoverMenu } from '@/lib/useHoverMenu';
import { useHubSectionHash } from './useHubSectionHash';
import styles from './LandingNav.module.css';

/** Круглая кнопка на хабах. Наведение (или касание) открывает короткий список
 *  разделов - в том же духе, что меню «Сайты» и «VPN/AI» в шапке. */
export function LandingNav() {
  const pathname = usePathname();
  const hash = useHubSectionHash(pathname);
  const stops = hubStops(pathname);
  const { open, setOpen, wrapProps, triggerRef } = useHoverMenu<HTMLButtonElement>(pathname);

  if (!stops || stops.length < 2) return null;

  const go = (href: string) => {
    if (jumpHash(href, pathname)) return;
    window.location.assign(href);
  };

  return (
    <div className={styles.wrap} {...wrapProps}>
      <button
        ref={triggerRef}
        type="button"
        className={styles.button}
        aria-label="Навигация по разделам"
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls="landing-nav-panel"
        onClick={() => {
          if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
          setOpen((value) => !value);
        }}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 7h14M5 12h14M5 17h10" />
        </svg>
      </button>

      <div
        id="landing-nav-panel"
        className={[styles.panel, open ? styles.open : ''].filter(Boolean).join(' ')}
        aria-hidden={!open}
      >
        <div className={styles.inner} data-cursor-glow="soft">
          <nav className={styles.list} aria-label="Разделы страницы">
            {stops.map((item) => {
              const active = isHashCurrent(pathname, hash, item.href);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={[styles.row, active ? styles.active : ''].filter(Boolean).join(' ')}
                  aria-current={active ? 'page' : undefined}
                  tabIndex={open ? undefined : -1}
                  onClick={(event) => {
                    event.preventDefault();
                    go(item.href);
                  }}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
