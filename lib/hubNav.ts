/** Навигация по хабам: /websites и /vpn-ai собраны из разделов с якорями.
 *
 *  Вся логика прыжков по якорям живет здесь. Раньше она была размазана по
 *  content/nav.ts, content/site.ts и компонентам, а content/ по правилу
 *  проекта хранит только данные.
 *
 *  - isHashCurrent, hubStops, interestFromLocation - чистые функции;
 *  - jumpHash - прыжок по якорю на той же странице;
 *  - scrollToLocationHash - прокрутка к якорю из адреса после смены маршрута.
 *  Какой раздел сейчас на экране, отслеживает хук useHubSectionHash. */

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

/** Прыжок по якорю на текущей странице: Next не прокручивает к якорю, если
 *  страница не меняется. Возвращает false, если ссылка ведет на другую
 *  страницу или якоря нет, - тогда работает обычная навигация.
 *  pushState не порождает hashchange, поэтому событие отправляется вручную:
 *  на него подписаны useHubSectionHash и ScrollToHash. */
export function jumpHash(href: string, pathname: string) {
  const [path, id] = href.split('#');
  if (!id || path !== pathname) return false;
  const node = document.getElementById(id);
  if (!node) return false;
  node.scrollIntoView({ behavior: 'instant', block: 'start' });
  history.pushState(null, '', href);
  window.dispatchEvent(new HashChangeEvent('hashchange'));
  return true;
}

/** Прокрутка к якорю из адреса. Возвращает функцию отмены.
 *
 *  Если раздел еще не в DOM, одна попытка на следующем кадре. Второй проход -
 *  после загрузки шрифтов: подмена шрифта сдвигает блоки, и цель уезжает.
 *  Повтор делается, только если посетитель за это время не прокручивал сам,
 *  иначе он выдернул бы человека обратно. */
export function scrollToLocationHash(): () => void {
  let cancelled = false;
  let frame: number | null = null;

  const go = () => {
    const id = window.location.hash.replace(/^#/, '');
    const node = id ? document.getElementById(id) : null;
    if (!node) return false;
    node.scrollIntoView({ behavior: 'instant', block: 'start' });
    return true;
  };

  const settle = () => {
    const landed = window.scrollY;
    document.fonts?.ready.then(() => {
      if (!cancelled && Math.abs(window.scrollY - landed) < 2) go();
    });
  };

  if (go()) {
    settle();
  } else if (window.location.hash) {
    frame = window.requestAnimationFrame(() => {
      frame = null;
      if (!cancelled && go()) settle();
    });
  }

  return () => {
    cancelled = true;
    if (frame !== null) window.cancelAnimationFrame(frame);
  };
}
