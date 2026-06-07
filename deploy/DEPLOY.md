# Деплой Неумошки на боевой сервер

## Текущий статус (2026-05-10)

- **Что готово:**
  - Next.js 16 SSR-каркас в `web-next/` (Phase 1: VK ID auth + share-to-download)
  - Node 20 на сервере `pavel@130.193.35.199`
  - PM2 6.0.14 на сервере
  - VK ID app зарегистрирован: `app_id=54586483`, redirect `https://neumoshka.ru/api/auth/vk/callback`

- **Что блокирует выкатку:**
  - DNS `neumoshka.ru` не пропагирован — `Non-existent domain` на Google/Cloudflare/Yandex.

## Когда DNS заработает (примерные команды для меня)

```bash
# 1) Пересобрать локально
cd web-next
npm run build         # prebuild автоматически прогонит sync; в .next/standalone/ — сервер

# 2) Залить на сервер: standalone + static + public + .env + ecosystem
ssh -i ~/.ssh/pavel_yandex pavel@130.193.35.199 'sudo mkdir -p /opt/neumoshka-web && sudo chown pavel:pavel /opt/neumoshka-web'

# tar+ssh передача (стрим, без rsync на Windows)
cd web-next
tar czf - .next/standalone .next/static public package.json ecosystem.config.cjs .env.local | \
  ssh -i ~/.ssh/pavel_yandex pavel@130.193.35.199 'tar xzf - -C /opt/neumoshka-web/'

# 3) Поднять PM2
ssh -i ~/.ssh/pavel_yandex pavel@130.193.35.199 'cd /opt/neumoshka-web && cp .env.local .next/standalone/.env.local && pm2 start ecosystem.config.cjs && pm2 save'

# 4) nginx-конфиг (см. deploy/nginx-neumoshka.ru.conf)
scp -i ~/.ssh/pavel_yandex deploy/nginx-neumoshka.ru.conf pavel@130.193.35.199:/tmp/
ssh -i ~/.ssh/pavel_yandex pavel@130.193.35.199 'sudo mv /tmp/nginx-neumoshka.ru.conf /etc/nginx/sites-available/neumoshka && sudo ln -sf /etc/nginx/sites-available/neumoshka /etc/nginx/sites-enabled/ && sudo nginx -t && sudo nginx -s reload'

# 5) Let's Encrypt (после того как DNS пропагирован, обязательно!)
ssh -i ~/.ssh/pavel_yandex pavel@130.193.35.199 'sudo certbot --nginx -d neumoshka.ru -d www.neumoshka.ru --agree-tos -m hello@neumoshka.ru --non-interactive'

# 6) Проверка
curl -I https://neumoshka.ru/api/auth/me
curl -I https://neumoshka.ru/library/algebra-10-formuly-privedeniya/preview.png
```

## Старый /neumoshka/ (статический)

После выкатки SSR на корне `neumoshka.ru` старый location `/neumoshka/` в конфиге `rabochiilist` остаётся, чтобы временные ссылки не ломались. Когда уверены что не нужен — убрать вместе с `/var/www/neumoshka.backup-2026-05-10/`.

## Структура на сервере

```
/opt/neumoshka-web/
├── .env.local                  # секреты VK (НЕ коммитить)
├── .next/
│   ├── standalone/             # PM2 запускает server.js отсюда
│   │   ├── server.js
│   │   └── .env.local         # копия для PM2 (PM2 читает env из cwd)
│   └── static/                 # nginx отдаёт напрямую
├── public/                     # nginx отдаёт PNG, /api/file/ отдаёт PDF
│   └── library/{slug}/
└── ecosystem.config.cjs        # PM2 config
```

## Что нужно от Павла перед выкаткой

1. **A-запись DNS** `@` и `www` → `130.193.35.199` в личном кабинете регистратора `neumoshka.ru`. Проверить через `nslookup neumoshka.ru 8.8.8.8` — должно вернуть IP, не `Non-existent domain`.
2. (опционально) Сменить `VK_SECURE_KEY` и `VK_SERVICE_TOKEN` в настройках VK app после первого боевого теста — в чате они уже засветились.
