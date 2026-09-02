# Деплой Неумошки на боевой сервер

Инструкция не выполняется автоматически. Перед выкаткой проверить DNS,
резервную копию и содержимое пакета. `data/store/` — постоянные пользовательские
данные, а `private/library/` — защищённые материалы; их нельзя оставлять в
публичной статике или случайно потерять при обновлении.

## 1. Подготовка и полная локальная проверка

В `.env.local` должны быть production-адрес и постоянный каталог данных:

```dotenv
NEXT_PUBLIC_SITE_URL=https://neumoshka.ru
NEUMOSHKA_STORAGE_ROOT=/opt/neumoshka-web
```

```bash
cd web-next
npm ci
npm run check
npm run test:data
npm run build
npm run start
# в другом терминале:
npm run test:smoke
```

`npm run build` намеренно не запускает синхронизацию библиотеки. Не применять
план `npm run sync`, если он добавляет или удаляет неожиданные slug.

## 2. Создание и проверка staging-пакета

Пакет обязательно содержит корневую `private/`: API ищет PDF в
`/opt/neumoshka-web/private/library`, а не в `public/`.

```bash
# однократная подготовка каталогов с правами пользователя деплоя
ssh -i ~/.ssh/pavel_yandex pavel@130.193.35.199 'sudo install -d -o pavel -g pavel /opt/neumoshka-web /opt/neumoshka-stage'

cd web-next
tar czf - .next/standalone .next/static public private package.json ecosystem.config.cjs .env.local | \
  ssh -i ~/.ssh/pavel_yandex pavel@130.193.35.199 '
    set -eu
    stamp=$(date +%Y%m%d-%H%M%S)
    stage=/opt/neumoshka-stage/$stamp
    mkdir -p "$stage"
    tar xzf - -C "$stage"
    test -f "$stage/.next/standalone/server.js"
    test -f "$stage/public/og.png"
    test -d "$stage/private/library"
    test "$(find "$stage/private/library" -type f -name "*.pdf" | wc -l)" -gt 0
    if find "$stage/public" -type f -iname "*.pdf" | grep -q .; then
      echo "ERROR: public PDF detected" >&2
      exit 1
    fi
    printf "%s\n" "$stage"
  '
```

Записать напечатанный абсолютный путь `stage`: он нужен на следующем шаге.

## 3. Обновление с восстановимой резервной копией

Подставить проверенный путь вместо `<STAGE>`. Команды заменяют только сборку,
публичные файлы и защищённую библиотеку. `/opt/neumoshka-web/data/store` не
перемещается и не очищается.

```bash
ssh -i ~/.ssh/pavel_yandex pavel@130.193.35.199 '
  set -eu
  stage=<STAGE>
  root=/opt/neumoshka-web
  stamp=$(basename "$stage")
  backup="$root/.deploy-backups/$stamp"

  mkdir -p "$root/.next" "$root/data/store" "$backup/.next"
  pm2 stop neumoshka-web 2>/dev/null || true

  test -f "$stage/.next/standalone/server.js"
  test -d "$stage/private/library"

  test ! -e "$root/.next/standalone" || mv "$root/.next/standalone" "$backup/.next/standalone"
  test ! -e "$root/.next/static" || mv "$root/.next/static" "$backup/.next/static"
  test ! -e "$root/public" || mv "$root/public" "$backup/public"
  test ! -e "$root/private" || mv "$root/private" "$backup/private"

  mv "$stage/.next/standalone" "$root/.next/standalone"
  mv "$stage/.next/static" "$root/.next/static"
  mv "$stage/public" "$root/public"
  mv "$stage/private" "$root/private"
  cp "$stage/package.json" "$root/package.json"
  cp "$stage/ecosystem.config.cjs" "$root/ecosystem.config.cjs"
  cp "$stage/.env.local" "$root/.env.local"
  cp "$root/.env.local" "$root/.next/standalone/.env.local"

  cd "$root"
  pm2 startOrReload ecosystem.config.cjs --update-env
  pm2 save
'
```

При ошибке новую версию не считать готовой. Предыдущие каталоги остаются в
`/opt/neumoshka-web/.deploy-backups/<stamp>/` и могут быть возвращены вручную.

## 4. nginx и TLS

```bash
scp -i ~/.ssh/pavel_yandex deploy/nginx-neumoshka.ru.conf pavel@130.193.35.199:/tmp/
ssh -i ~/.ssh/pavel_yandex pavel@130.193.35.199 'sudo cp /tmp/nginx-neumoshka.ru.conf /etc/nginx/sites-available/neumoshka && sudo ln -sf /etc/nginx/sites-available/neumoshka /etc/nginx/sites-enabled/neumoshka && sudo nginx -t && sudo nginx -s reload'
ssh -i ~/.ssh/pavel_yandex pavel@130.193.35.199 'sudo certbot --nginx --redirect -d neumoshka.ru -d www.neumoshka.ru --agree-tos -m hello@neumoshka.ru --non-interactive'
```

TLS выпускать только после того, как A-записи `@` и `www` указывают на сервер.

## 5. Проверка после запуска

```bash
curl -fsSI https://neumoshka.ru/
curl -fsSI https://neumoshka.ru/og.png
curl -fsSI https://neumoshka.ru/api/auth/me
curl -fsSI https://neumoshka.ru/library/algebra-10-formuly-privedeniya/preview.png
curl -fsSI https://neumoshka.ru/api/file/algebra-10-formuly-privedeniya/presentation

# прямой публичный PDF обязан дать 404:
test "$(curl -s -o /dev/null -w "%{http_code}" https://neumoshka.ru/library/algebra-10-formuly-privedeniya/presentation.pdf)" = 404
```

После автоматических проверок вручную проверить вход по логину и паролю,
избранное, мобильное меню, умный поиск и просмотр/скачивание PDF.

## Структура на сервере

```text
/opt/neumoshka-web/
├── .env.local
├── .next/
│   ├── standalone/             # PM2 запускает server.js
│   └── static/                 # nginx отдаёт напрямую
├── public/                     # только публичные PNG и прочая статика
├── private/library/{slug}/     # защищённые PDF для /api/file
├── data/store/                 # постоянные users/sessions/favorites/unlocks
└── ecosystem.config.cjs
```

## Перед публикацией репозитория

Старые PDF уже присутствуют в истории Git, даже если удалены из текущего
`public/`. Перед переводом репозитория в публичный режим нужна отдельная очистка
истории либо новый чистый репозиторий. Не выполнять переписывание истории без
проверенной резервной копии и согласованного окна миграции.
