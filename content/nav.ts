/** Маршруты и навигация. */

export type NavItem = { href: string; label: string };

export type NavGroup = { title: string; href: string; items: NavItem[] };

/** Все маршруты, в порядке мобильного меню и футера. */
export const nav: NavItem[] = [
  { href: '/', label: 'Главная' },
  { href: '/websites#landing', label: 'Лендинг' },
  { href: '/websites#multipage', label: 'Многостраничный сайт' },
  { href: '/websites#marketplace', label: 'Маркетплейс' },
  { href: '/websites#redesign', label: 'Обновление дизайна' },
  { href: '/websites#support', label: 'Поддержка сайта' },
  { href: '/websites#onec', label: 'Интеграция 1С' },
  { href: '/websites#crm', label: 'Интеграция CRM' },
  { href: '/vpn-ai#vpn', label: 'Корпоративный VPN' },
  { href: '/vpn-ai#ai', label: 'Локальный AI' },
  { href: '/pricing', label: 'Цены' },
  { href: '/about', label: 'О нас' },
];

/** Группы панели «Сайты»: подпункты, обслуживание, интеграции. */
export const siteMenuGroups: NavGroup[] = [
  {
    title: 'Разработка с нуля',
    href: '/websites#landing',
    items: [
      { href: '/websites#landing', label: 'Лендинг' },
      { href: '/websites#multipage', label: 'Многостраничный сайт' },
      { href: '/websites#marketplace', label: 'Маркетплейс' },
    ],
  },
  {
    title: 'Обслуживание сайтов',
    href: '/websites#redesign',
    items: [
      { href: '/websites#redesign', label: 'Обновление дизайна' },
      { href: '/websites#support', label: 'Поддержка сайта' },
    ],
  },
  {
    title: 'Интеграции',
    href: '/websites#onec',
    items: [
      { href: '/websites#onec', label: 'Интеграция 1С' },
      { href: '/websites#crm', label: 'Интеграция CRM' },
    ],
  },
];

/** Уникальные услуги для футера — один пункт на маршрут-якорь. */
export const siteServices: NavItem[] = siteMenuGroups.flatMap((group) => group.items);

export const siteHubPaths = ['/websites'];

export const infraMenuGroups: NavGroup[] = [
  {
    title: 'Инфраструктура',
    href: '/vpn-ai#vpn',
    items: [
      { href: '/vpn-ai#vpn', label: 'Корпоративный VPN' },
      { href: '/vpn-ai#ai', label: 'Локальный AI' },
    ],
  },
];

export const infraHubPaths = ['/vpn-ai'];

export const infraTabHref = '/vpn-ai';

export const infraServiceHrefs = infraHubPaths;

export const siteServiceHrefs = siteHubPaths;

/** Если якоря нет, считаем активным первый раздел хаба. */
export const hashFallbacks: Record<string, string> = {
  '/websites': 'landing',
  '/vpn-ai': 'vpn',
};

export function isHashCurrent(pathname: string, hash: string, href: string) {
  const [path, id] = href.split('#');
  if (pathname !== path) return false;
  const have = hash.replace(/^#/, '');
  const want = id ?? '';
  if (!want) return true;
  if (!have) return hashFallbacks[pathname] === want;
  return have === want;
}

/** Same-page hash click: native Next navigation often will not scroll. */
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

/** Клик по самой вкладке «Сайты» ведёт на первую услугу. */
export const sitesTabHref = '/websites';

/** Thin spaces around the slash — words themselves stay tight. */
export const infraTabLabel = 'VPN\u2009/\u2009AI';

/** Hero ids on a combined landing, in page order. */
export function hubStops(pathname: string): NavItem[] | null {
  if (pathname === '/websites') return siteServices;
  if (pathname === '/vpn-ai') return infraMenuGroups.flatMap((group) => group.items);
  return null;
}

export const phoneHref = 'tel:+79959009404';
export const phoneLabel = '+7 (995) 900-94-04';

/** Вкладки шапки. «Сайты» разворачивается панелью, остальные — обычные ссылки. */
export const headerTabs: NavItem[] = [
  { href: '/', label: 'Главная' },
  { href: '/about', label: 'О нас' },
];

/** Правовые ссылки. Живут отдельно от навигации: это не разделы сайта. */
export const legalLinks: NavItem[] = [
  { href: '/privacy', label: 'Политика обработки персональных данных' },
];

export const footerGroups: { title: string; items: NavItem[] }[] = [
  {
    title: 'Сайты и интеграции',
    items: siteServices,
  },
  {
    title: 'Инфраструктура',
    items: infraMenuGroups.flatMap((group) => group.items),
  },
  {
    title: 'Компания',
    items: nav.filter(({ href }) => href === '/pricing' || href === '/about'),
  },
  {
    title: 'Документы',
    items: legalLinks,
  },
];

/** Служебные ссылки можно добавить сюда, когда у них появятся маршруты. */
export const drawerLinks: string[] = [];

export const wordmark = '19×17';
