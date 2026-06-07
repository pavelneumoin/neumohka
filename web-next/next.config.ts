import type { NextConfig } from "next";

// SSR-режим (Node + PM2 за nginx-прокси). Для Phase 1 нужны API routes
// и middleware-блокировка PDF — со static export это невозможно.
// `output: "standalone"` собирает минимальный self-contained сервер в .next/standalone.
const nextConfig: NextConfig = {
  output: "standalone",
  // basePath намеренно убран — будем стоять на корне neumoshka.ru
  images: { unoptimized: true },
};

export default nextConfig;
