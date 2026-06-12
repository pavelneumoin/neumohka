# Презентация «C++ с нуля»

Слайды для курса по C++ базового школьного уровня. Написаны на **Markdown** и собираются в **PDF** через [Marp](https://marp.app/) — без PowerPoint.

Стиль: минимализм в духе macOS (светлый софт-фон, типографика Inter, код в окошках-«терминалах» со светофорными точками).

## Файлы

| Файл | Что |
|---|---|
| `deck.md` | вступительная презентация курса (исходник) |
| `templates.md` | библиотека макетов слайдов — справочник |
| `theme.css` | macOS-тема для слайдов |
| `worksheet.css` | печатная A4-тема для рабочих листов |
| `lessons/NN-slug/` | уроки: `lesson.md` (слайды) + `worksheet.md` (рабочий лист) |
| `PLAN.md` · `course-plan.md` | план реализации и учебный план |
| `scripts/pdf-to-png.mjs` | PDF-точный рендер (pdf.js) для проверки артефактов |
| `package.json` | команды сборки |

## Команды

```bash
npm run build       # собрать всё: вступление + шаблоны + все уроки и листы
npm run lessons     # только уроки и рабочие листы (lessons/**)
npm run templates   # библиотека шаблонов → templates.pdf
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
  - `<!-- _class: dark -->` — тёмный слайд
  - `<!-- _paginate: false -->` — скрыть номер страницы
