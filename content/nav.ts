/** Маршруты и навигация.
 *
 *  Шапка: Главная · Сайты ▾ · VPN · AI · О нас. Шесть услуг по сайтам собраны
 *  в выпадающую панель. «Цены» намеренно нет в шапке — на страницу ведут
 *  кнопки в героях и футер.
 *
 *  Мобильное меню и футер остаются плоскими: все маршруты, без группировки. */

export type NavItem = { href: string; label: string };

/** Все маршруты, в порядке мобильного меню и футера. */
export const nav: NavItem[] = [
  { href: '/', label: 'Главная' },
  { href: '/websites', label: 'Создание сайта' },
  { href: '/online-store', label: 'Интернет-магазин' },
  { href: '/website-redesign', label: 'Обновление сайта' },
  { href: '/support', label: 'Техническая поддержка' },
  { href: '/integrations/crm', label: 'Интеграции с CRM' },
  { href: '/integrations/1c', label: 'Интеграции с 1С' },
  { href: '/vpn', label: 'Корпоративный VPN' },
  { href: '/ai', label: 'Локальный AI' },
  { href: '/pricing', label: 'Цены' },
  { href: '/about', label: 'О нас' },
];

/** Шесть услуг за вкладкой «Сайты», с подписями для панели. */
export const siteServices: (NavItem & { note: string })[] = [
  {
    href: '/websites',
    label: 'Создание сайта',
    note: 'Под ключ: дизайн, разработка, запуск.',
  },
  {
    href: '/online-store',
    label: 'Интернет-магазин',
    note: 'Каталог, оплата и остатки в связке с учётом.',
  },
  {
    href: '/website-redesign',
    label: 'Обновление сайта',
    note: 'Существующий сайт приводим в порядок, а не переписываем с нуля.',
  },
  {
    href: '/support',
    label: 'Техническая поддержка',
    note: 'Названный контакт и часы разработки каждый месяц.',
  },
  {
    href: '/integrations/crm',
    label: 'Интеграции с CRM',
    note: 'Битрикс24, amoCRM и другие — заявка сразу становится сделкой.',
  },
  {
    href: '/integrations/1c',
    label: 'Интеграции с 1С',
    note: 'Номенклатура, цены, остатки и заказы без ручного переноса.',
  },
];

export const siteServiceHrefs = siteServices.map((item) => item.href);

/** Клик по самой вкладке «Сайты» ведёт на первую услугу. */
export const sitesTabHref = '/websites';

/** Вкладки шапки. «Сайты» разворачивается панелью, остальные — обычные ссылки. */
export const headerTabs: NavItem[] = [
  { href: '/', label: 'Главная' },
  { href: '/vpn', label: 'VPN' },
  { href: '/ai', label: 'AI' },
  { href: '/about', label: 'О нас' },
];

/** Правовые ссылки. Живут отдельно от навигации: это не разделы сайта. */
export const legalLinks: NavItem[] = [
  { href: '/privacy', label: 'Политика обработки персональных данных' },
];

/** Ссылки только в мобильном меню. Пунктов назначения пока нет. */
export const drawerLinks = ['Поддержка', 'Личный кабинет', 'Россия'];

export const wordmark = '19×17';
