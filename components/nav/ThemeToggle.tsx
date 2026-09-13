'use client';

import { useEffect, useSyncExternalStore } from 'react';
import styles from './ThemeToggle.module.css';

function Moon() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
      <path className={styles.line} d="M15.2 3.3A9 9 0 1 0 20.7 14 7.2 7.2 0 0 1 15.2 3.3Z" />
    </svg>
  );
}

function Sun() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
      <circle className={styles.fill} cx="12" cy="12" r="4.2" />
      <path className={styles.rays} d="M12 3.2v1.8M12 19v1.8M4.2 12H6M18 12h1.8M6.4 6.4l1.3 1.3M16.3 16.3l1.3 1.3M17.6 6.4l-1.3 1.3M7.7 16.3l-1.3 1.3" />
    </svg>
  );
}

function syncThemeColor(dark: boolean) {
  const color = dark ? '#12141a' : '#ffffff';
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', color);
}

/** Тему на <html> ставит встроенный скрипт до первой отрисовки, поэтому она
 *  живет в DOM, а не в состоянии React. Читаем ее подпиской: на сервере тема
 *  светлая, на клиенте берется из атрибута. Раньше значение клали в состояние
 *  эффектом, и React предупреждал о лишней перерисовке. */
function subscribeTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}

function readTheme() {
  return document.documentElement.dataset.theme === 'dark';
}

function readThemeOnServer() {
  return false;
}

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribeTheme, readTheme, readThemeOnServer);

  // Цвет полосы браузера - внешняя система, ее эффект обновлять и должен.
  useEffect(() => {
    syncThemeColor(dark);
  }, [dark]);

  const toggle = () => {
    const next = !dark;
    const apply = () => {
      if (next) document.documentElement.dataset.theme = 'dark';
      else delete document.documentElement.dataset.theme;
      syncThemeColor(next);
      try {
        localStorage.setItem('theme', next ? 'dark' : 'light');
      } catch {
        /* private mode */
      }
    };
    if (typeof document.startViewTransition === 'function') {
      document.startViewTransition(apply);
    } else {
      apply();
    }
  };

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggle}
      aria-label={dark ? 'Светлая тема' : 'Темная тема'}
      aria-pressed={dark}
    >
      <span className={styles.glass} aria-hidden="true" />
      {dark ? <Sun /> : <Moon />}
    </button>
  );
}
