'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { hubStops, isHashCurrent, jumpHash } from '@/content/nav';
import { useHubSectionHash } from './useHubSectionHash';
import styles from './LandingNav.module.css';

/** Round control on hub landings. Hover (or tap) opens a compact section list
 *  in the same spirit as the Sites / VPN·AI header menus. */
export function LandingNav() {
  const pathname = usePathname();
  const hash = useHubSectionHash(pathname);
  const stops = hubStops(pathname);
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openNow = () => {
    cancelClose();
    setOpen(true);
  };

  const closeSoon = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 200);
  };

  useEffect(() => cancelClose, []);
  useEffect(() => {
    cancelClose();
    setOpen(false);
  }, [pathname]);

  if (!stops || stops.length < 2) return null;

  const go = (href: string) => {
    if (jumpHash(href, pathname)) return;
    window.location.assign(href);
  };

  return (
    <div
      ref={wrapRef}
      className={styles.wrap}
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
      onFocus={openNow}
      onBlur={(event) => {
        if (!wrapRef.current?.contains(event.relatedTarget as Node | null)) {
          cancelClose();
          setOpen(false);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          cancelClose();
          setOpen(false);
          triggerRef.current?.focus();
        }
      }}
    >
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
