import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1600],
    imageSizes: [256, 384, 640],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  /** Старые адреса отдельных услуг ведут на разделы хабов.
   *
   *  Серверный редирект, а не страница с JS: поисковик и браузер без JS сразу
   *  получают перенаправление, а не пустую страницу со статусом 200.
   *  permanent: false (307), пока структура может меняться: 308 браузеры
   *  кешируют жестко. Перед запуском сайта перевести на permanent: true.
   *  У /integrations и /maintenance в назначении намеренно нет якоря: браузер
   *  сам переносит якорь исходного адреса, и /integrations#crm попадает в #crm. */
  async redirects() {
    return [
      { source: '/vpn', destination: '/vpn-ai#vpn', permanent: false },
      { source: '/ai', destination: '/vpn-ai#ai', permanent: false },
      { source: '/support', destination: '/websites#support', permanent: false },
      { source: '/website-redesign', destination: '/websites#redesign', permanent: false },
      { source: '/online-store', destination: '/websites#marketplace', permanent: false },
      { source: '/integrations/crm', destination: '/websites#crm', permanent: false },
      { source: '/integrations/1c', destination: '/websites#onec', permanent: false },
      { source: '/integrations', destination: '/websites', permanent: false },
      { source: '/maintenance', destination: '/websites', permanent: false },
    ];
  },
};

export default nextConfig;
