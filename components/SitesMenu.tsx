'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { jumpHash, isHashCurrent, type NavGroup } from '@/content/nav';
import navStyles from './NavButton.module.css';
import styles from './SitesMenu.module.css';

type Props = {
  pathname: string;
  hash: string;
  label: string;
  tabHref: string;
  groups: NavGroup[];
  hubPaths: string[];
  badge?: string;
};

/** Вкладка хаба и выпадающая панель с группами услуг.
 *
 *  Отступ 10px под кнопкой — это прозрачный padding ВНУТРИ `.menupanel`, а не
 *  margin: с margin между кнопкой и панелью остаётся мёртвая полоса, и меню
 *  закрывается раньше, чем курсор дойдёт. Закрытие отложено на 200 мс и
 *  отменяется, если курсор вернулся.
 *
 *  В прототипе панель работает только по наведению. Здесь добавлено то, что
 *  нужно в продакшене: открытие по фокусу, строки — настоящие ссылки, Esc
 *  закрывает и возвращает фокус на кнопку, уход фокуса из группы закрывает. */
export function HubMenu({ pathname, hash, label, tabHref, groups, hubPaths, badge }: Props) {
  const [open, setOpen] = useState(false);
  const active = hubPaths.includes(pathname);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const router = useRouter();

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const goGroup = (href: string) => {
    if (jumpHash(href, pathname)) {
      cancelClose();
      setOpen(false);
      return;
    }
    router.push(href);
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
        href={tabHref}
        className={['navbtn', active ? 'navbtn-active' : '', badge ? navStyles.withBadge : '']
          .filter(Boolean)
          .join(' ')}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={badge ? `${label.replace(/\u2009/g, ' ')}, ${badge}` : undefined}
      >
        {label}
        {badge ? (
          <span className="hitbadge" aria-hidden="true">
            {badge}
          </span>
        ) : null}
      </Link>

      <div
        className={['menupanel', styles.panel, open ? styles.open : ''].filter(Boolean).join(' ')}
        aria-hidden={!open}
      >
        <div className={['menuinner', styles.list].join(' ')}>
          {groups.map((group) => (
            <div
              key={group.title}
              className={styles.group}
              onClick={(event) => {
                if ((event.target as HTMLElement).closest('a')) return;
                event.preventDefault();
                goGroup(group.href);
              }}
            >
              <Link
                href={group.href}
                className={styles.heading}
                tabIndex={open ? undefined : -1}
                onClick={(event) => {
                  if (!jumpHash(group.href, pathname)) return;
                  event.preventDefault();
                  cancelClose();
                  setOpen(false);
                }}
              >
                {group.title}
              </Link>
              <ul className={styles.items} aria-label={group.title}>
                {group.items.map((item) => {
                  const current = isHashCurrent(pathname, hash, item.href);
                  return (
                    <li key={`${item.href}:${item.label}`}>
                      <Link
                        href={item.href}
                        className={['menurow', styles.row, current ? styles.active : ''].filter(Boolean).join(' ')}
                        aria-current={current ? 'page' : undefined}
                        tabIndex={open ? undefined : -1}
                        onClick={(event) => {
                          if (!jumpHash(item.href, pathname)) return;
                          event.preventDefault();
                          cancelClose();
                          setOpen(false);
                        }}
                      >
                        <span className={[styles.name, current ? styles.current : ''].filter(Boolean).join(' ')}>
                          {item.label}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
