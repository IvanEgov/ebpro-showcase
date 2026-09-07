import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Обязательно для GitHub Pages (создает статический HTML)
  basePath: '/ebpro-showcase', // Имя вашего репозитория (обязательно с слэшем в начале)
  images: {
    unoptimized: true, // Обязательно для static export, так как оптимизация требует Node.js сервера
  },
};

export default nextConfig;