# neumoshka/web-next

Next.js-сайт **«Неумошка»** — библиотека готовых уроков математики и
информатики Павла Неумоина.

## Что уже работает

- каталог из 62 уроков с фильтрами по разделам;
- умный поиск с опечатками, сокращениями и исправлением раскладки;
- просмотр презентаций, рабочих листов и ответов в PDF-карусели;
- регистрация и вход по логину и паролю;
- личный кабинет и серверное избранное;
- защищённая выдача PDF из `private/library`;
- адаптивная вёрстка и доступная клавиатурная навигация.

## Стек

- Next.js 16 (App Router) + React 19;
- TypeScript;
- Tailwind CSS v4 и собственная дизайн-система в `app/globals.css`;
- Inter, Lora и JetBrains Mono через `next/font`;
- атомарный JSON-store для однопроцессного локального запуска.

## Основная структура

```text
app/
  api/auth/              # регистрация, вход, выход, текущая сессия
  api/favorites/         # добавить/удалить избранное
  api/file/              # защищённая выдача и inline-просмотр PDF
  account/               # личный кабинет
  catalog/               # каталог и умный поиск
  lesson/[slug]/         # урок и карусель материалов
components/
  account-dashboard.tsx
  auth-form.tsx
  favorite-button.tsx
  materials-carousel.tsx
  session-provider.tsx
lib/
  auth.ts                # сессии и сценарии авторизации
  password.ts            # scrypt-хеширование и проверка пароля
  search.ts              # ранжирование умного поиска
  store.ts               # пользователи, сессии, избранное
data/catalog.json        # сгенерированный каталог
private/library/{slug}/  # PDF вне публичной статики
public/library/{slug}/   # только preview.png
```

## Запуск и проверки

```bash
npm install
npm run dev
npm run check
npm run test:search
npm run test:auth-core
npm run test:data
npm run test:smoke
npm run build
npm run start
```

`test:smoke` проверяет запущенный сайт на `http://localhost:3000`. Другой адрес
можно передать через `TEST_BASE_URL`.

## Синхронизация материалов

Синхронизация отделена от сборки и сначала создаёт неизменяющий файлы план:

```bash
npm run sync
# после ручной проверки состава:
npm run sync -- --apply --confirm=<plan-hash>
```

Если уроки добавляются или исчезают, применение блокируется до ручной проверки.
Не обходите защиту `--accept-catalog-delta`, пока не сверены источники и
`NEUMOSHKA_LIBRARY_SOURCE`.

PDF хранятся в `private/library` и никогда не должны попадать в `public` или
Git. `data/store` тоже исключён из Git: это постоянные аккаунты, хеши паролей,
сессии и избранное, поэтому каталог нужно резервировать отдельно от исходников.

## Ограничения текущего локального хранилища

JSON-store рассчитан строго на один процесс (`instances: 1`). Перед
масштабированием нужен SQLite/Postgres, распределённый rate limit, резервное
копирование и восстановление пароля. Старый прототип в `web/` остаётся только
референсом и не участвует в сборке.
