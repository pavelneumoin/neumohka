/**
 * PM2 ecosystem для standalone Next.js на сервере.
 * Запуск: pm2 start ecosystem.config.cjs
 *
 * Структура на сервере: /opt/neumoshka-web/
 *   .next/standalone/server.js  — Next.js standalone сервер
 *   .next/static/               — статика (рядом со standalone)
 *   public/library/             — только публичные PNG-превью
 *   private/library/            — PDF вне web-статики
 *   data/store/                 — постоянные сессии и доступы
 *   .env.local                  — переменные окружения
 */
module.exports = {
  apps: [
    {
      name: "neumoshka-web",
      cwd: "/opt/neumoshka-web/.next/standalone",
      script: "server.js",
      env: {
        NODE_ENV: "production",
        PORT: "3030",
        HOSTNAME: "127.0.0.1",
        NEUMOSHKA_STORAGE_ROOT: "/opt/neumoshka-web",
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
    },
  ],
};
