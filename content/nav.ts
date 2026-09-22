/** Маршруты и навигация. */

export type NavItem = {
  href: string;
  label: string;
  /** Метка рядом с пунктом меню. Текст метки - hitBadge ниже. */
  badge?: string;
};

export type NavGroup = { title: string; href: string; items: NavItem[] };

/** Метка «хит» у вкладки VPN/AI в шапке и у пункта VPN в мобильном меню. */
export const hitBadge = 'ХИТ';

/** Все маршруты, в порядке мобильного меню и футера. */
const nav: NavItem[] = [
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
  { href: '/works', label: 'Работы' },
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

/** Уникальные услуги для футера - один пункт на маршрут-якорь. */
export const siteServices: NavItem[] = siteMenuGroups.flatMap((group) => group.items);

export const siteHubPaths = ['/websites'];

export const infraMenuGroups: NavGroup[] = [
  {
    title: 'Инфраструктура',
    href: '/vpn-ai#vpn',
    items: [
      { href: '/vpn-ai#vpn', label: 'Корпоративный VPN', badge: hitBadge },
      { href: '/vpn-ai#ai', label: 'Локальный AI' },
    ],
  },
];

export const infraHubPaths = ['/vpn-ai'];

export const infraTabHref = '/vpn-ai';

/** Если якоря нет, считаем активным первый раздел хаба. */
export const hashFallbacks: Record<string, string> = {
  '/websites': 'landing',
  '/vpn-ai': 'vpn',
};

/** Клик по самой вкладке «Сайты» ведет на первую услугу. */
export const sitesTabHref = '/websites';

/** Thin spaces around the slash - words themselves stay tight. */
export const infraTabLabel = 'VPN\u2009/\u2009AI';

export const phoneHref = 'tel:+79959009404';
export const phoneLabel = '+7 (995) 900-94-04';

/** Правовые ссылки. Живут отдельно от навигации: это не разделы сайта. */
const legalLinks: NavItem[] = [
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
    items: nav.filter(({ href }) => href === '/works' || href === '/pricing' || href === '/about'),
  },
  {
    title: 'Документы',
    items: legalLinks,
  },
];

/** Служебные ссылки можно добавить сюда, когда у них появятся маршруты. */
export const drawerLinks: string[] = [];

export const wordmark = '19×17';
