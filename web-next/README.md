# neumoshka/web-next

Next.js-фронтенд сайта подписки **Неумошка** — личной библиотеки уроков Павла Неумоина.

## Стек

- Next.js 16 (App Router) + React 19
- TypeScript
- Tailwind CSS v4 (токены через `@theme inline` в `app/globals.css`)
- Шрифты: Inter, Fraunces, JetBrains Mono (через `next/font/google`, поддержка кириллицы)
- Без shadcn/ui — кастомные классы из дизайн-системы перенесены в `globals.css`

## Структура

```
app/
  layout.tsx              # Root layout: шрифты, Header, Footer
  page.tsx                # Лендинг
  catalog/page.tsx        # Каталог с фильтрами
  lesson/[slug]/page.tsx  # Карточка урока
  pricing/page.tsx        # Тарифы
  faq/page.tsx            # FAQ
  contacts/page.tsx       # Контакты
  oferta/page.tsx         # Публичная оферта
  privacy/page.tsx        # Политика ПДн
  login/, signup/, account/  # Заглушки до спринта 2
components/
  site-header.tsx         # Шапка с подсветкой активного пункта
  site-footer.tsx         # Подвал
  lesson-card.tsx         # Карточка урока в каталоге
  catalog-filters.tsx     # Сайдбар фильтров (client-component)
  faq-item.tsx            # Раскрывающийся вопрос FAQ
lib/
  catalog.ts              # Типы Lesson/Section + хелперы
data/
  catalog.json            # Сгенерирован sync-скриптом
  free-lessons.json       # Список slug-ов уроков, открытых бесплатно
public/
  library/{slug}/         # Скопированные PDF и preview.png
scripts/
  sync-library.mjs        # Синк из E:/YA/YandexDisk/Lessons/library/
```

## Запуск

```bash
npm install         # уже сделано
npm run sync        # синк уроков из Lessons/library/
npm run dev         # dev-server на :3000 (или :3020 через .claude/launch.json)
```

`npm run build` автоматически прогоняет `sync` перед билдом (через `prebuild`-хук).

## Синк уроков

Скрипт `scripts/sync-library.mjs`:

1. Рекурсивно ищет `presentation.pdf` в `E:/YA/YandexDisk/Lessons/library/` (маркер «это урок»).
2. Парсит верхнюю папку секции и достаёт `subject` / `grade` / `exam`.
3. Для каждого урока копирует `presentation.pdf` / `worksheet.pdf` / `answers.pdf` / первый `pres-N.png` в `public/library/{slug}/`.
4. Подтягивает описание из `Telegram_Public_Post.txt`.
5. Помечает уроки из `data/free-lessons.json` как `free: true`.
6. Удаляет папки в `public/library/`, которые больше не упомянуты в каталоге.

Инкрементально — повторно копируется только то, что изменилось по `mtime/size`.

## Бесплатный раздел

Список slug-ов в `data/free-lessons.json`. Сейчас — 5 уроков из тригонометрии 10 класса:

- Арктангенс и арккотангенс
- График арктангенса и арккотангенса
- Формулы Приведения
- Тангенс и котангенс
- Решение уравнений. Часть 2

На карточке урока для платных показывается «Открыть по подписке» (ведёт в `/pricing`); для бесплатных — рабочая ссылка `download` на PDF.

В каталоге есть фильтр «Только бесплатные» (`?free=1`).

## Что осталось (за пределами спринта 1)

- Auth (NextAuth с magic link)
- ЮKassa: webhook + страница оплаты + кабинет с историей
- Watermark с email на скачиваемых PDF (на бэке, не статика)
- SEO: sitemap.xml, robots.txt, OG-картинки
- Деплой: на проде нет доступа к `Lessons/library/` — нужен либо S3-хранилище, либо синк по rsync с локальной машины
- Поправить сложные названия уроков в `informatics-ege` (двухуровневая структура «N задание ЕГЭ. Информатика/Урок 1») — сейчас название урока теряет префикс задания
- Старый прототип в `web/` — не трогать, оставить как референс
