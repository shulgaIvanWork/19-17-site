/** Маршруты и навигация.
 *
 *  Услуги перечислены здесь ОДИН раз, списком `services`. Из него собираются
 *  панель «Услуги» в шапке, мобильное меню, подвал, витрина /services, карточки
 *  главной и предвыбор темы в форме заявки. Раньше те же девять услуг были
 *  выписаны в пяти местах отдельно, и списки разъезжались.
 *
 *  Каждая услуга - своя страница /services/<slug>. До сентября 2026 они жили
 *  якорями на двух длинных страницах, /websites и /vpn-ai; разбор перехода - в
 *  README. */

export type NavItem = {
  href: string;
  label: string;
  /** Метка рядом с пунктом меню. Текст метки - hitBadge ниже. */
  badge?: string;
};

export type NavGroup = { title: string; href: string; items: NavItem[] };

/** Метка «хит» у строки «Корпоративный VPN». */
export const hitBadge = 'ХИТ';

/** Группы услуг в порядке показа в меню и подвале. */
export type ServiceGroupId = 'build' | 'care' | 'integrations' | 'infra';

export const serviceGroupTitles: Record<ServiceGroupId, string> = {
  build: 'Разработка с нуля',
  care: 'Обслуживание сайтов',
  integrations: 'Интеграции',
  infra: 'Инфраструктура',
};

export type Service = {
  /** Часть адреса: /services/<slug>. Совпадает с прежним якорем раздела,
   *  поэтому старые ссылки вида /websites#crm переводятся один к одному. */
  slug: string;
  label: string;
  group: ServiceGroupId;
  /** Тема, которую форма заявки выбирает заранее. */
  interest: string;
  badge?: string;
};

export const services: Service[] = [
  { slug: 'landing', label: 'Лендинг', group: 'build', interest: 'Создание сайта' },
  { slug: 'multipage', label: 'Многостраничный сайт', group: 'build', interest: 'Создание сайта' },
  { slug: 'marketplace', label: 'Маркетплейс', group: 'build', interest: 'Интернет-магазин' },
  { slug: 'redesign', label: 'Обновление дизайна', group: 'care', interest: 'Обновление сайта' },
  { slug: 'support', label: 'Поддержка сайта', group: 'care', interest: 'Поддержка сайта' },
  { slug: 'onec', label: 'Интеграция 1С', group: 'integrations', interest: 'Интеграция с 1С' },
  { slug: 'crm', label: 'Интеграция CRM', group: 'integrations', interest: 'Интеграция с CRM' },
  { slug: 'vpn', label: 'Корпоративный VPN', group: 'infra', interest: 'Корпоративный VPN', badge: hitBadge },
  { slug: 'ai', label: 'Локальный AI', group: 'infra', interest: 'Локальный AI' },
];

/** Витрина услуг. Сюда ведет сама вкладка в шапке. */
export const servicesHref = '/services';
export const servicesLabel = 'Услуги';

export function serviceHref(slug: string) {
  return `${servicesHref}/${slug}`;
}

export const serviceBySlug = new Map(services.map((service) => [service.slug, service]));

/** Услуга по адресу страницы. Нужна форме заявки и блоку «Другие услуги». */
export function serviceByPath(pathname: string): Service | undefined {
  const slug = pathname.startsWith(`${servicesHref}/`) ? pathname.slice(servicesHref.length + 1) : '';
  return slug ? serviceBySlug.get(slug) : undefined;
}

function itemsOf(group: ServiceGroupId): NavItem[] {
  return services
    .filter((service) => service.group === group)
    .map(({ slug, label, badge }) => ({ href: serviceHref(slug), label, badge }));
}

/** Группы для панели «Услуги» и подвала. Порядок задан ключами объекта. */
export const serviceMenuGroups: NavGroup[] = (
  Object.keys(serviceGroupTitles) as ServiceGroupId[]
).map((group) => {
  const items = itemsOf(group);
  return { title: serviceGroupTitles[group], href: items[0].href, items };
});

/** Все услуги одним списком, в порядке групп. */
export const serviceLinks: NavItem[] = serviceMenuGroups.flatMap((group) => group.items);

export const phoneHref = 'tel:+79959009404';
export const phoneLabel = '+7 (995) 900-94-04';

/** Страницы компании. Услуги сюда не входят: у них свой список выше. */
const companyLinks: NavItem[] = [
  { href: '/works', label: 'Работы' },
  { href: '/pricing', label: 'Цены' },
  { href: '/about', label: 'О нас' },
];

export const mainNav: NavItem[] = [{ href: '/', label: 'Главная' }, ...companyLinks];

/** Правовые ссылки. Живут отдельно от навигации: это не разделы сайта. */
const legalLinks: NavItem[] = [
  { href: '/privacy', label: 'Политика обработки персональных данных' },
];

export const footerGroups: { title: string; items: NavItem[] }[] = [
  { title: 'Сайты и интеграции', items: serviceLinks.filter((item) => !isInfra(item.href)) },
  { title: 'Инфраструктура', items: serviceLinks.filter((item) => isInfra(item.href)) },
  { title: 'Компания', items: companyLinks },
  { title: 'Документы', items: legalLinks },
];

function isInfra(href: string) {
  const slug = href.slice(servicesHref.length + 1);
  return serviceBySlug.get(slug)?.group === 'infra';
}

export const wordmark = '19×17';
