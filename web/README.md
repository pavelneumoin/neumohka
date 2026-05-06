# uroki-podpiska — handoff для Claude Code

Готовый hi-fi прототип сайта подписки на готовые уроки математики и информатики для учителей 8–11 классов.

## Что в папке

```
site/
├── index.html        # Лендинг
├── catalog.html      # Каталог с фильтрами
├── lesson.html       # Карточка урока с превью
├── pricing.html      # Тарифы
├── account.html      # Личный кабинет
├── signup.html       # Регистрация
├── login.html        # Вход
├── faq.html          # Вопросы и ответы
├── contacts.html     # Контакты + реквизиты
├── oferta.html       # Публичная оферта
├── privacy.html      # Политика обработки ПДн
├── styles.css        # Дизайн-система (CSS-переменные)
└── script.js         # Интерактив (FAQ, фильтры, тогглы)
```

Открыть `site/index.html` в браузере — всё работает офлайн без сборки.

## Дизайн-система — что брать в Next.js / shadcn

### Цвета (`styles.css` → `:root`)
```css
--bg: #FAFAF7;            /* off-white фон */
--bg-soft: #F2EFE8;       /* секции, hover */
--bg-card: #FFFFFF;       /* карточки */
--ink: #2A2A2A;           /* основной текст */
--ink-2: #6B6B6B;         /* вторичный */
--ink-3: #9A968D;         /* приглушённый */
--line: #EAEAE5;          /* границы */
--accent: #3D5A40;        /* тёмно-зелёный CTA */
--accent-soft: #E5EAE3;   /* фон чипа */
--accent-ink: #243A26;    /* hover акцента */
```

В Tailwind config:
```ts
colors: {
  bg: { DEFAULT: '#FAFAF7', soft: '#F2EFE8', card: '#FFFFFF' },
  ink: { DEFAULT: '#2A2A2A', muted: '#6B6B6B', faded: '#9A968D' },
  accent: { DEFAULT: '#3D5A40', soft: '#E5EAE3', ink: '#243A26' },
  line: '#EAEAE5',
}
```

### Шрифты
- **Inter** (400/500/600/700) — UI
- **Fraunces** (variable, 400–600) — дисплейный H1, акценты курсивом
- **JetBrains Mono** (400/500) — eyebrow, чипы, счётчики

### Типографика
- H1 — 56px / 38px mobile, weight 600, letter-spacing −0.02em
- H2 — 36px / 28px mobile
- Body — 17px, line-height 1.6
- `.eyebrow` — 12px моноширинный, uppercase, letter-spacing 0.06em

### Радиусы и отступы
- `--radius` 10px (поля, чипы), `--radius-lg` 16px (карточки, plan)
- Секции — 112px / 72px mobile вертикально
- Контейнер `.wrap` — max-width 1180px, padding 32px / 20px mobile

## Компоненты для shadcn-миграции

| HTML-класс | shadcn-аналог | Заметки |
|---|---|---|
| `.btn`, `.btn.primary`, `.btn.ghost` | `<Button variant="default \| secondary \| ghost">` | Радиус 999px, без shadow |
| `.card` | `<Card>` | border-radius 16px, padding 28px |
| `.chip` | `<Badge>` | `variant="outline"` + `accent` мод |
| `.faq-item` | `<Accordion>` | максимальный паттерн в `script.js` |
| `.input`, `.select` | `<Input>`, `<Select>` | focus-ring через `--accent` 0.12 |
| `.checkbox`, `.radio` | `<Checkbox>`, `<RadioGroup>` | accent-фон при checked |
| `.toggle` | `<Switch>` | accent при `on` |
| `.plan` | `<Card>` + featured вариант | featured = `bg-soft` + border-strong |
| `.lesson-card` | свой компонент | preview + title + chips |
| `.slide-preview` | свой компонент | aspect-ratio 4/3, обёртка `.sp-inner` |
| `.side-nav a.active` | `<Link>` со стилями | `bg-accent-soft`, `color: accent-ink` |

## Карта страниц и связи

```
index.html ──→ catalog.html ──→ lesson.html ──┐
       │                                       ├─→ signup.html → account.html
       └──→ pricing.html ──────────────────────┘
                │
                ├─→ login.html → account.html
                ├─→ faq.html
                └─→ oferta / privacy / contacts (footer)
```

## Что мы добавили поверх брифа

1. **Trust-row под героем** — 5 цифр (42 урока, +6 в месяц, 18 авторов, 44 минуты, PDF+LaTeX) на тёплой бежевой ленте. Без хвалебных слов — только факты.
2. **Лендинг с реальными слайдами** — карусель содержит мок-слайды с формулами (Виета, производная, while-цикл, логарифмы), а не просто картинки. Это должны заменить настоящие скриншоты в проде.
3. **Sticky CTA в карточке урока** — мета-блок справа залипает при скролле, кнопка «Скачать PDF» всегда видна.
4. **Лента миниатюр на детальной странице** — пользователь видит структуру урока (разогрев → теория → примеры) до скачивания.
5. **«Лучшая цена» через фон, не масштаб** — год выделен бежевым фоном и `chip −30%`. Не задирается scale (как у Skillbox), смотрится спокойнее.
6. **Сайт-блок «активные фильтры»** — чипы с × в каталоге, кликабельны.
7. **Кабинет: блок «оплачено уроков 42/42» + сертификат** — мелочь, но даёт ощущение, что подписка — реальный продукт.
8. **Watermark-тоггл в настройках** — учитель должен знать, что watermark есть и им управляет.
9. **Раздельный FAQ по разделам** (О материалах / Об оплате) — короче и легче сканировать.
10. **Полные тексты оферты и политики ПДн** — не lorem ipsum, а реальная структура с разделами 1–6.

## Стек для миграции (рекомендация)

```bash
npx create-next-app@latest uroki-podpiska --typescript --tailwind --app
cd uroki-podpiska
npx shadcn@latest init
npx shadcn@latest add button card badge accordion input select checkbox switch
```

Дальше переносить страницы 1-в-1, заменяя HTML-классы на shadcn-компоненты. Дизайн-токены — в `tailwind.config.ts` из секции выше.

### Что точно стоит вынести в server components / API
- Каталог уроков — Server Component с фильтрацией через searchParams
- Детальная страница — динамический роут `/lesson/[slug]`
- Кабинет — приватный route group `(auth)` + middleware на сессию
- Оплата — API route, интеграция с ЮKassa
- Watermarking PDF — на бэке при скачивании, не на фронте

## Что НЕ переносить буквально

- Inline-стили в HTML — это для скорости прототипа, в Next.js всё через классы Tailwind
- Mock-слайды (формулы прямо в HTML) — заменить на реальные превью PDF (pdf.js или картинки первых страниц)
- `.lesson-card[data-lesson-link]` JS-обработчик — в Next.js это `<Link>`
- Footer/header дублируются в каждой странице — вынести в `app/layout.tsx`

## Что не сделано (намеренно)

- Поиск — есть инпут, но без реальной фильтрации
- Бэкенд — нужен Supabase / своя Postgres + auth
- Платежи — нужна интеграция ЮKassa
- Email-рассылки — Mailgun / Resend
- Загрузка авторами — отдельная админка

Удачи с переносом.
