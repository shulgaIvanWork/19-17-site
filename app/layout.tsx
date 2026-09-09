import type { Metadata } from 'next';
import { Manrope, Unbounded } from 'next/font/google';
import { ContactProvider } from '@/components/ContactContext';
import { HeroCursorHighlight } from '@/components/HeroCursorHighlight';
import { Footer } from '@/components/Footer';
import { SiteHeader } from '@/components/SiteHeader';
import { settings } from '@/content/settings';
import './globals.css';

/** Both faces are self-hosted at build time by next/font — no request ever
 *  reaches Google, which a financial-services site needs anyway.
 *  Both carry the Cyrillic subset: the site is Russian-language. */
const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500'],
  variable: '--font-manrope',
  display: 'swap',
});

/** The display face for .h1 / .h2 and the product-card names.
 *
 *  Replaces Universal Sans Display, which had zero Cyrillic glyphs (0 of 66) —
 *  every Russian heading would have fallen through to Manrope — and was in any
 *  case a personal-use licence that could not ship. Unbounded is OFL, keeps the
 *  wide geometric character, and unlike the old face has lowercase and real
 *  digits. Headings are therefore set in sentence case, exactly as the design
 *  system says to author them. */
const unbounded = Unbounded({
  subsets: ['latin', 'cyrillic'],
  weight: ['500'],
  variable: '--font-unbounded',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: '19×17 — сайты, которые проходят проверку',
    template: '%s — 19×17',
  },
  description:
    'Сайты и интернет-магазины под ключ, поддержка, интеграции с Битрикс24 и 1С, корпоративный VPN и нейросеть на вашем железе. Для компаний, которым есть перед кем отчитываться.',
  // На сайте пока стоят тексты-заготовки и нет цен. Снять этот блок перед запуском.
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${manrope.variable} ${unbounded.variable}`}>
      <body>
        <HeroCursorHighlight enabled={settings.cursorHighlight} />
        <ContactProvider>
          <SiteHeader />
          <main>{children}</main>
          <Footer />
        </ContactProvider>
      </body>
    </html>
  );
}
