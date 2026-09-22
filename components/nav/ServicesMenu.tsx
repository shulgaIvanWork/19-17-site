'use client';

import Link from 'next/link';
import type { MouseEvent } from 'react';
import { isServicePath, serviceMenuGroups, servicesHref, servicesLabel } from '@/content/nav';
import { useHoverMenu } from './useHoverMenu';
import styles from './ServicesMenu.module.css';

/** Вкладка «Услуги» и большая панель с группами.
 *
 *  Одна вкладка вместо прежних «Сайты» и «VPN / AI»: у услуг теперь по своей
 *  странице, и делить их на две вкладки по признаку «сайт или не сайт» было
 *  нечестно по отношению к VPN и локальному AI.
 *
 *  Сама вкладка ведет на блок услуг главной. Когда главная уже открыта, Next к
 *  якорю не прокручивает - страница не меняется, - поэтому прокрутка тут своя.
 *
 *  Отступ 10px под кнопкой - это прозрачный padding ВНУТРИ `.menupanel`, а не
 *  margin: с margin между кнопкой и панелью остается мертвая полоса, и меню
 *  закрывается раньше, чем курсор дойдет. Открытие, задержку закрытия, Esc и
 *  потерю фокуса дает useHoverMenu; строки меню - настоящие ссылки. */
export function ServicesMenu({ pathname }: { pathname: string }) {
  const { open, wrapProps, triggerRef } = useHoverMenu<HTMLAnchorElement>(pathname);
  const active = isServicePath(pathname);

  const goBlock = (event: MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== '/') return;
    const block = document.getElementById('services');
    if (!block) return;
    event.preventDefault();
    block.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className={styles.wrap} {...wrapProps}>
      <Link
        ref={triggerRef}
        href={servicesHref}
        className={['navbtn', active ? 'navbtn-active' : ''].filter(Boolean).join(' ')}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={goBlock}
      >
        {servicesLabel}
      </Link>

      <div
        className={['menupanel', styles.panel, open ? styles.open : ''].filter(Boolean).join(' ')}
        aria-hidden={!open}
      >
        <div className={['menuinner', styles.board].join(' ')}>
          {serviceMenuGroups.map((group) => (
            <div key={group.title} className={styles.group}>
              <div className={styles.heading}>{group.title}</div>
              <ul className={styles.items} aria-label={group.title}>
                {group.items.map((item) => {
                  const current = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={['menurow', styles.row, current ? styles.active : ''].filter(Boolean).join(' ')}
                        aria-current={current ? 'page' : undefined}
                        tabIndex={open ? undefined : -1}
                      >
                        <span className={[styles.name, current ? styles.current : ''].filter(Boolean).join(' ')}>
                          {item.label}
                          {item.badge ? (
                            <span className="hitbadge" aria-hidden="true">
                              {item.badge}
                            </span>
                          ) : null}
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
