# Презентация «C++ с нуля»

Слайды для курса по C++ базового школьного уровня. Написаны на **Markdown** и собираются в **PDF** через [Marp](https://marp.app/) — без PowerPoint.

Стиль: тёплый дружелюбный дизайн для школьников — палитра «крем + фиолетовый/коралл/мята», шрифт Nunito, подсветка кода в тёмных окошках-«терминалах», маскот-робот **Бип** ведёт уроки, цветные подсказки.

## Файлы

| Файл | Что |
|---|---|
| `deck.md` | вступительная презентация курса (исходник) |
| `templates.md` | библиотека макетов слайдов — справочник |
| `theme.css` | macOS-тема для слайдов |
| `worksheet.css` | печатная A4-тема для рабочих листов |
| `lessons/NN-slug/` | уроки: `lesson.md` (слайды) + `worksheet.md` (рабочий лист) |
| `PLAN.md` · `course-plan.md` | план реализации и учебный план |
| `marp.config.mjs` | конфиг Marp: эмодзи берутся локально (`@twemoji/svg`), не с CDN |
| `scripts/pdf-to-png.mjs` · `scripts/check-emoji.mjs` | PDF-точный рендер (pdf.js) и страж эмодзи |
| `package.json` | команды сборки |

## Команды

```bash
npm run build       # собрать всё: вступление + шаблоны + все уроки и листы
npm run lessons     # только уроки и рабочие листы (lessons/**)
npm run templates   # библиотека шаблонов → templates.pdf
npm run check:emoji # проверить, что у всех эмодзи есть локальный SVG
npm run check -- templates.pdf 12 2   # отрендерить страницу PDF через pdf.js
```

## Как собрать

Один раз — поставить зависимости (Marp + Chromium для экспорта в PDF):

```bash
cd slides/cpp-course
npm install
npx puppeteer browsers install chrome
```

Затем сборка. На Linux браузеру нужно указать путь — задаём `CHROME_PATH`:

```bash
export CHROME_PATH="$(node -e "console.log(require('puppeteer').executablePath())")"

npm run pdf     # → cpp-course.pdf
npm run html    # → cpp-course.html
npm run watch   # живой предпросмотр на localhost
```

## Как редактировать слайды

- Новый слайд — отделяется строкой `---`
- `# Заголовок`, `## Подзаголовок`, обычный текст и списки — как в любом Markdown
- `<mark>текст</mark>` — акцентный градиентный текст
- Блок ```` ```cpp ... ``` ```` — рисуется как окно с кодом
- Таблицы и `> цитаты` оформляются автоматически
- Спец-классы слайда задаются комментарием в начале слайда:
  - `<!-- _class: cover -->` — обложка
  - `<!-- _class: center -->` — крупный текст по центру
  - `<!-- _class: section -->` — тёмный разделитель модуля/блока
  - `<!-- _class: dark -->` — тёмный слайд (домашка/финал)
  - `<!-- _class: task -->` — слайд-задание (метка «✦ ЗАДАЧА»)
  - `<!-- _paginate: false -->` — скрыть номер страницы

## Дизайн-система и компоненты

Эталон живого урока — `lessons/01-1-hello-world/lesson.md`. Стиль задаёт `theme.css`
(раздел «Компоненты»). Все цвета — в `:root` (`--violet`, `--coral`, `--mint`, `--amber`).

**Маскот-робот Бип** (`assets/bip.svg`, `assets/bip-head.svg`) — добавляется картинкой,
путь из урока всегда `../../assets/`:

```html
<!-- большой робот: на обложке и слайде-разделе «Практика» -->
<img class="hero-bot" src="../../assets/bip.svg">

<!-- реплика Бипа (без эмодзи внутри) -->
<div class="bubble"><img class="bip-head" src="../../assets/bip-head.svg"><span>Текст реплики.</span></div>
```

**Цветные подсказки** (метка с эмодзи уже встроена; внутри только текст и `<strong>`):

```html
<div class="tip">…</div>    <!-- 💡 Совет — важное правило -->
<div class="try">…</div>    <!-- 🚀 Попробуй — мини-задание -->
<div class="fact">…</div>   <!-- ✨ А знаешь что? — интересный факт -->
```

**Прочее:**
- `<div class="flow"><div class="step">…</div>…</div>` — конвейер шагов со стрелками
- `<div class="grid"><div class="card">…</div>…</div>` — 2–4 карточки (цветной верх)
- `<div class="cols"><div>…</div><div>…</div></div>` — колонки
- `<span class="out">Привет!</span>` — чип «вывод программы»
- `<span class="pill">★ со звёздочкой</span>` — бейдж в заголовке

> Внутри `<div>` markdown-содержимое отделяй **пустыми строками** (см. эталон).
> Тени (`box-shadow`) не используем — глубину держат рамки.
