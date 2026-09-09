'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { siteServiceHrefs, siteServices, sitesTabHref } from '@/content/nav';
import styles from './SitesMenu.module.css';

/** Вкладка «Сайты» и её выпадающая панель на шесть услуг.
 *
 *  Отступ 10px под кнопкой — это прозрачный padding ВНУТРИ `.menupanel`, а не
 *  margin: с margin между кнопкой и панелью остаётся мёртвая полоса, и меню
 *  закрывается раньше, чем курсор дойдёт. Закрытие отложено на 140 мс и
 *  отменяется, если курсор вернулся.
 *
 *  В прототипе панель работает только по наведению. Здесь добавлено то, что
 *  нужно в продакшене: открытие по фокусу, строки — настоящие ссылки, Esc
 *  закрывает и возвращает фокус на кнопку, уход фокуса из группы закрывает. */
export function SitesMenu({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLAnchorElement>(null);

  const active = siteServiceHrefs.includes(pathname);

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
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  };

  useEffect(() => cancelClose, []);

  // Смена маршрута закрывает панель.
  useEffect(() => {
    cancelClose();
    setOpen(false);
  }, [pathname]);

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
      <Link
        ref={triggerRef}
        href={sitesTabHref}
        className={['navbtn', active ? 'navbtn-active' : ''].filter(Boolean).join(' ')}
        aria-expanded={open}
        aria-haspopup="true"
      >
        Сайты
      </Link>

      {open && (
        <div className="menupanel">
          <ul className={['menuinner', styles.list].join(' ')} aria-label="Услуги по сайтам">
            {siteServices.map((item) => {
              const current = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="menurow"
                    aria-current={current ? 'page' : undefined}
                  >
                    <span className={[styles.name, current ? styles.current : ''].filter(Boolean).join(' ')}>
                      {item.label}
                    </span>
                    <span className={styles.note}>{item.note}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
