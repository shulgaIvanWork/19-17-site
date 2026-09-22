'use client';

import Link from 'next/link';
import { serviceMenuGroups } from '@/content/nav';
import { isServicePath } from '@/content/services';
import { useHoverMenu } from './useHoverMenu';
import styles from './HomeMenu.module.css';

/** Вкладка «Главная» и большая панель со всеми услугами.
 *
 *  Отдельной вкладки «Услуги» в шапке нет (решение заказчика 2026-09-22):
 *  услуги раскрываются при наведении на «Главную», а сам список услуг живет
 *  блоком на главной странице. Стрелка у названия - единственный знак, что
 *  вкладка раскрывается: пункт «Главная» этого обычно не делает, и без метки
 *  панель легко не заметить.
 *
 *  Отступ 10px под кнопкой - это прозрачный padding ВНУТРИ `.menupanel`, а не
 *  margin: с margin между кнопкой и панелью остается мертвая полоса, и меню
 *  закрывается раньше, чем курсор дойдет. Открытие, задержку закрытия, Esc и
 *  потерю фокуса дает useHoverMenu; строки меню - настоящие ссылки. */
export function HomeMenu({ pathname }: { pathname: string }) {
  const { open, wrapProps, triggerRef } = useHoverMenu<HTMLAnchorElement>(pathname);
  const active = pathname === '/' || isServicePath(pathname);

  return (
    <div className={styles.wrap} {...wrapProps}>
      <Link
        ref={triggerRef}
        href="/"
        className={['navbtn', styles.trigger, active ? 'navbtn-active' : ''].filter(Boolean).join(' ')}
        aria-expanded={open}
        aria-haspopup="true"
      >
        Главная
        <svg className={styles.chevron} viewBox="0 0 12 12" aria-hidden="true">
          <path d="M3 4.5L6 7.5L9 4.5" />
        </svg>
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
