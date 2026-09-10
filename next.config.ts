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
};

export default nextConfig;
