/** Маршруты и навигация.
 *
 *  Сами услуги перечислены не здесь, а в `content/services.ts`: реестр нужен
 *  и текстам, и знакам, и форме заявки, а не только меню. Отсюда собираются
 *  панель под вкладкой «Главная», мобильное меню и подвал.
 *
 *  Каждая услуга - своя страница /services/<slug>. До сентября 2026 они жили
 *  якорями на двух длинных страницах, /websites и /vpn-ai; разбор перехода - в
 *  README. */

import { serviceGroupTitles, serviceHref, services, type ServiceGroupId } from './services';

export type NavItem = {
  href: string;
  label: string;
  /** Метка рядом с пунктом меню, например «ХИТ» у корпоративного VPN. */
  badge?: string;
};

export type NavGroup = { title: string; href: string; items: NavItem[] };

function itemsOf(group: ServiceGroupId): NavItem[] {
  return services
    .filter((service) => service.group === group)
    .map(({ slug, label, badge }) => ({ href: serviceHref(slug), label, badge }));
}

/** Группы для панели услуг и подвала. Порядок задан ключами объекта. */
export const serviceMenuGroups: NavGroup[] = (
  Object.keys(serviceGroupTitles) as ServiceGroupId[]
).map((group) => {
  const items = itemsOf(group);
  return { title: serviceGroupTitles[group], href: items[0].href, items };
});

export const phoneHref = 'tel:+79959009404';
export const phoneLabel = '+7 (995) 900-94-04';

/** Страницы компании. Услуги сюда не входят: у них свой реестр. */
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

/** Подвал показывает услуги двумя колонками: сайты и интеграции в одной,
 *  инфраструктура в другой. Деление берется из групп реестра. */
const siteServices = services.filter((service) => service.group !== 'infra');
const infraServices = services.filter((service) => service.group === 'infra');

function linksOf(list: typeof services): NavItem[] {
  return list.map(({ slug, label, badge }) => ({ href: serviceHref(slug), label, badge }));
}

export const footerGroups: { title: string; items: NavItem[] }[] = [
  { title: 'Сайты и интеграции', items: linksOf(siteServices) },
  { title: 'Инфраструктура', items: linksOf(infraServices) },
  { title: 'Компания', items: companyLinks },
  { title: 'Документы', items: legalLinks },
];

export const wordmark = '19×17';
