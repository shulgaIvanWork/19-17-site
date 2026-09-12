/** Разделы хабов: какие они и какой сейчас активен.
 *
 *  Чистые функции без обращения к браузеру. Механика прыжков - в hubScroll.ts
 *  рядом, состояние раздела на экране - в useHubSectionHash.ts.
 *  content/ по правилу проекта хранит только данные, поэтому разбор адресов
 *  живет здесь. */

import { hashFallbacks, infraMenuGroups, siteServices, type NavItem } from '@/content/nav';
import { interestBySection } from '@/content/site';

/** Активен ли пункт меню. Без якоря в адресе активным считается первый раздел хаба. */
export function isHashCurrent(pathname: string, hash: string, href: string) {
  const [path, id] = href.split('#');
  if (pathname !== path) return false;
  const have = hash.replace(/^#/, '');
  const want = id ?? '';
  if (!want) return true;
  if (!have) return hashFallbacks[pathname] === want;
  return have === want;
}

/** Разделы хаба в порядке страницы; null, если страница не хаб. */
export function hubStops(pathname: string): NavItem[] | null {
  if (pathname === '/websites') return siteServices;
  if (pathname === '/vpn-ai') return infraMenuGroups.flatMap((group) => group.items);
  return null;
}

/** Направление заявки по текущей странице и якорю раздела. */
export function interestFromLocation(pathname: string, hash: string): string | undefined {
  const id = hash.replace(/^#/, '') || hashFallbacks[pathname] || '';
  return interestBySection[id];
}
