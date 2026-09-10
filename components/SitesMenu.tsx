'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { NavGroup } from '@/content/nav';
import { isHashCurrent, jumpHash } from '@/lib/hubNav';
import { useHoverMenu } from '@/lib/useHoverMenu';
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
 *  Отступ 10px под кнопкой - это прозрачный padding ВНУТРИ `.menupanel`, а не
 *  margin: с margin между кнопкой и панелью остается мертвая полоса, и меню
 *  закрывается раньше, чем курсор дойдет. Открытие, задержку закрытия, Esc и
 *  потерю фокуса дает useHoverMenu; строки меню - настоящие ссылки. */
export function HubMenu({ pathname, hash, label, tabHref, groups, hubPaths, badge }: Props) {
  const { open, close, wrapProps, triggerRef } = useHoverMenu<HTMLAnchorElement>(pathname);
  const active = hubPaths.includes(pathname);
  const router = useRouter();

  const goGroup = (href: string) => {
    if (jumpHash(href, pathname)) {
      close();
      return;
    }
    router.push(href);
  };

  return (
    <div className={styles.wrap} {...wrapProps}>
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
                  close();
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
                          close();
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
