/** Реестр услуг: одна запись на услугу и один идентификатор у нее - `slug`.
 *
 *  По этому же slug называются адрес страницы, знак карточки (`CardMark`),
 *  фигура героя (`HeroShape`), тексты героя и сноска в `content/site.ts`.
 *  Раньше у одной услуги было до семи разных имен: лендинг звался `landing`
 *  в адресе, `websites` в текстах героя, `sites` в фигуре, `web` в префиксах
 *  переменных. Связь держалась глазами, и компилятор промаха не замечал
 *  (аудит 2026-09-22).
 *
 *  Тема заявки (`interest`) - union, а не строка. Тот же набор значений
 *  показывает чипами форма, и строковый литерал разъезжался с ним молча:
 *  заявка уходила с направлением, которого в форме нет. */

/** Все услуги сайта. Добавили услугу - добавьте сюда, дальше компилятор
 *  проведет по остальным местам: тексты, знак, фигуру, страницу. */
export type ServiceSlug =
  | 'landing'
  | 'multipage'
  | 'marketplace'
  | 'redesign'
  | 'support'
  | 'onec'
  | 'crm'
  | 'vpn'
  | 'ai';

/** Тема заявки. Форма показывает этот же список чипами, а маршрут API
 *  принимает только значения отсюда. У лендинга и многостраничного она
 *  общая, поэтому тем восемь, а услуг девять. */
export type Interest =
  | 'Создание сайта'
  | 'Интернет-магазин'
  | 'Обновление сайта'
  | 'Поддержка сайта'
  | 'Интеграция с 1С'
  | 'Интеграция с CRM'
  | 'Корпоративный VPN'
  | 'Локальный AI';

/** Группы услуг в порядке показа в меню и подвале. */
export type ServiceGroupId = 'build' | 'care' | 'integrations' | 'infra';

export const serviceGroupTitles: Record<ServiceGroupId, string> = {
  build: 'Разработка с нуля',
  care: 'Обслуживание сайтов',
  integrations: 'Интеграции',
  infra: 'Инфраструктура',
};

/** Метка «хит» у строки «Корпоративный VPN». */
const hitBadge = 'ХИТ';

export type Service = {
  slug: ServiceSlug;
  /** Одно название на все места: панель меню, карточка главной, подвал.
   *  До аудита 2026-09-22 меню и карточка называли услугу по-разному
   *  («Маркетплейс» против «Интернет-магазина»), и это видел посетитель. */
  label: string;
  group: ServiceGroupId;
  interest: Interest;
  badge?: string;
};

export const services: Service[] = [
  { slug: 'landing', label: 'Лендинг', group: 'build', interest: 'Создание сайта' },
  { slug: 'multipage', label: 'Многостраничный сайт', group: 'build', interest: 'Создание сайта' },
  { slug: 'marketplace', label: 'Интернет-магазин', group: 'build', interest: 'Интернет-магазин' },
  { slug: 'redesign', label: 'Обновление сайта', group: 'care', interest: 'Обновление сайта' },
  { slug: 'support', label: 'Поддержка сайта', group: 'care', interest: 'Поддержка сайта' },
  { slug: 'onec', label: 'Интеграция с 1С', group: 'integrations', interest: 'Интеграция с 1С' },
  { slug: 'crm', label: 'Интеграция с CRM', group: 'integrations', interest: 'Интеграция с CRM' },
  { slug: 'vpn', label: 'Корпоративный VPN', group: 'infra', interest: 'Корпоративный VPN', badge: hitBadge },
  { slug: 'ai', label: 'Локальный AI', group: 'infra', interest: 'Локальный AI' },
];

/** Общее начало адресов услуг. */
const servicePrefix = '/services';

export function serviceHref(slug: ServiceSlug) {
  return `${servicePrefix}/${slug}`;
}

export const serviceBySlug = new Map<ServiceSlug, Service>(
  services.map((service) => [service.slug, service]),
);

/** Проверка строки из адреса или якоря: это slug услуги или что-то чужое. */
export function isServiceSlug(raw: string): raw is ServiceSlug {
  return serviceBySlug.has(raw as ServiceSlug);
}

/** Услуга по адресу страницы. Нужна форме заявки: она предвыбирает тему. */
export function serviceByPath(pathname: string): Service | undefined {
  const raw = pathname.startsWith(`${servicePrefix}/`) ? pathname.slice(servicePrefix.length + 1) : '';
  return isServiceSlug(raw) ? serviceBySlug.get(raw) : undefined;
}

/** Открыта ли сейчас страница услуги. Подсвечивает вкладку в шапке. */
export function isServicePath(pathname: string) {
  return pathname.startsWith(`${servicePrefix}/`);
}

/** Темы заявки в порядке услуг, без повторов. Список чипов формы строится
 *  отсюда, поэтому разойтись с реестром он не может. */
export const interests: Interest[] = [...new Set(services.map((service) => service.interest))];

/** Проверка темы, пришедшей строкой: из формы, из адреса, из тела запроса. */
export function isInterest(raw: string): raw is Interest {
  return (interests as string[]).includes(raw);
}
