// globals.css - первым импортом. Turbopack (Next 16) подключает CSS строго в порядке
// импортов: если модули шапки и футера импортированы раньше, глобальный класс
// (.menurow, .btn) перекрывает модульный той же специфичности.
import './globals.css';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Manrope, Unbounded } from 'next/font/google';
import { ClientDecor } from '@/components/site/ClientDecor';
import { ContactProvider } from '@/components/contact/ContactContext';
import { EdgeDecor } from '@/components/site/EdgeDecor';
import { Footer } from '@/components/site/Footer';
import { SiteHeader } from '@/components/nav/SiteHeader';
import { settings } from '@/content/settings';

/** Обе гарнитуры next/font забирает к себе на сборке - ни одного запроса к
 *  Google из браузера посетителя. Обе с кириллическим набором: сайт
 *  русскоязычный. */
const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500'],
  variable: '--font-manrope',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
});

/** Дисплейная гарнитура для .h1 / .h2 и названий услуг на карточках.
 *
 *  Заменяет Universal Sans Display: кириллических знаков там не было вовсе
 *  (0 из 66), каждый русский заголовок проваливался в Manrope, да и лицензия
 *  была на личное использование и до сайта не доезжала. У Unbounded лицензия
 *  OFL, широкий геометрический характер сохранен, а в отличие от прежней
 *  гарнитуры есть строчные и настоящие цифры. Поэтому заголовки набираются
 *  как обычное предложение - ровно так, как предписывает дизайн-система. */
const unbounded = Unbounded({
  subsets: ['latin', 'cyrillic'],
  weight: ['500'],
  variable: '--font-unbounded',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
});

/** theme-color здесь не объявляется. Тема сайта выбирается кнопкой, а не
 *  системой, и тег должен быть один: его создает и перекрашивает скрипт
 *  theme-boot ниже, а после переключения темы - ThemeToggle. Next рисовал свой
 *  тег #ffffff рядом, и в темной теме на странице было два разных theme-color
 *  (проверено 2026-09-13): какой из них возьмет браузер, не гарантировано. */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: {
    default: '19×17 — разработка и поддержка цифровых сервисов',
    template: '%s — 19×17',
  },
  description:
    'Создание и обновление сайтов, техническая поддержка, интеграции с CRM и 1С, корпоративный VPN и локальный AI на базе Qwen3-8B.',
  // Снять запрет на индексацию перед публикацией сайта.
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // data-scroll-behavior: в globals.css плавная прокрутка для якорей. С Next 16 роутер
  // сбрасывает ее на время перехода между страницами только при этом атрибуте,
  // иначе каждый переход прокручивал бы новую страницу к началу плавно.
  return (
    <html
      lang="ru"
      className={`${manrope.variable} ${unbounded.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <Script id="theme-boot" strategy="beforeInteractive">
          {`(function(){try{var d=localStorage.getItem('theme')==='dark';if(d)document.documentElement.dataset.theme='dark';var m=document.querySelector('meta[name="theme-color"]');if(!m){m=document.createElement('meta');m.setAttribute('name','theme-color');document.head.appendChild(m);}m.setAttribute('content',d?'#12141a':'#ffffff');}catch(e){}})();`}
        </Script>
      </head>
      <body>
        <ClientDecor cursorHighlight={settings.cursorHighlight} />
        <EdgeDecor />
        <ContactProvider>
          <SiteHeader />
          <main>{children}</main>
          <Footer />
        </ContactProvider>
      </body>
    </html>
  );
}
