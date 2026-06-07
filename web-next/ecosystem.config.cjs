/**
 * PM2 ecosystem для standalone Next.js на сервере.
 * Запуск: pm2 start ecosystem.config.cjs
 *
 * Структура на сервере: /opt/neumoshka-web/
 *   .next/standalone/server.js  — Next.js standalone сервер
 *   .next/static/               — статика (рядом со standalone)
 *   public/                     — public-папка с PDF
 *   .env.local                  — env с VK_SERVICE_TOKEN и т.д.
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
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
    },
  ],
};
