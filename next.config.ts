import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Только для next dev. Next 16 не пускает к служебным ресурсам dev-сервера страницу,
  // открытую не с localhost: на http://127.0.0.1:3000 не работал весь клиентский JS
  // (3D, тема, сцены, форма). На production-сборку не влияет.
  allowedDevOrigins: ['127.0.0.1'],
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1600],
    imageSizes: [256, 384, 640],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // С Next 16 разрешено только качество из этого списка (по умолчанию [75]),
    // остальное молча приводится к ближайшему. Photo запрашивает 82.
    qualities: [82],
  },
  /** Старые адреса услуг.
   *
   *  Серверный редирект, а не страница с JS: поисковик и браузер без JS сразу
   *  получают перенаправление, а не пустую страницу со статусом 200.
   *  permanent: false (307), пока структура может меняться: 308 браузеры
   *  кешируют жестко. Перед запуском сайта перевести на permanent: true.
   *
   *  До сентября 2026 девять услуг жили якорями на /websites и /vpn-ai. Якорь
   *  браузер серверу не отправляет, поэтому /websites#crm сюда приходит как
   *  /websites: редирект ведет на витрину, а якорь браузер переносит сам, и
   *  дальше его разбирает LegacyHashRedirect на самой витрине. */
  async redirects() {
    return [
      { source: '/websites', destination: '/services', permanent: false },
      { source: '/vpn-ai', destination: '/services', permanent: false },
      { source: '/vpn', destination: '/services/vpn', permanent: false },
      { source: '/ai', destination: '/services/ai', permanent: false },
      { source: '/support', destination: '/services/support', permanent: false },
      { source: '/website-redesign', destination: '/services/redesign', permanent: false },
      { source: '/online-store', destination: '/services/marketplace', permanent: false },
      { source: '/integrations/crm', destination: '/services/crm', permanent: false },
      { source: '/integrations/1c', destination: '/services/onec', permanent: false },
      { source: '/integrations', destination: '/services', permanent: false },
      { source: '/maintenance', destination: '/services', permanent: false },
    ];
  },
};

export default nextConfig;
