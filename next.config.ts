import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Ключевая настройка: превращает Next.js в статический сайт (папка 'out')
  basePath: '/ebpro-showcase', // Обязательно: имя вашего репозитория на GitHub
  images: {
    unoptimized: true, // Обязательно: отключает оптимизацию изображений на сервере (для статики)
  },
 webpack: (config, { isServer }) => {
    if (!isServer) {
      config.watchOptions = {
        ignored: ['**/System Volume Information/**', '**/$Recycle.Bin/**'],
      };
    }
    return config;
 },
turbopack: {},
};

export default nextConfig;