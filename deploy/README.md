# Деплой

## Текущая схема (preview)

Дизайн-превью статически раздаётся nginx-ом сервера РабочийЛист.ai:

- Сервер: `pavel@130.193.35.199` (SSH-host `sono` в `~/.ssh/config` устарел — IP сменился)
- Путь: `/var/www/neumoshka/`
- Конфиг: `/etc/nginx/sites-enabled/rabochiilist` — добавлен блок `location /neumoshka/`
- URL: **http://130.193.35.199/neumoshka/**

## Как обновить превью

```bash
scp -r -i ~/.ssh/pavel_yandex web/* pavel@130.193.35.199:/tmp/neumoshka/
ssh -i ~/.ssh/pavel_yandex pavel@130.193.35.199 'sudo rsync -a --delete /tmp/neumoshka/ /var/www/neumoshka/'
```

## Будущая схема (продакшн Next.js)

Когда придёт время кода:
1. Регистрируем домен `neumoshka.ru`
2. Деплой Next.js-приложения через PM2 или systemd на новый порт (3011)
3. Свой server-block в nginx с `server_name neumoshka.ru`
4. Let's Encrypt через `certbot`
5. PostgreSQL на этом же сервере или Yandex Managed Postgres
