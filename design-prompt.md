# Промт для дизайна — Неумошка

Готовый бриф для **v0.dev / Galileo AI / Figma AI / Uizard**.
Внизу — копи-пастабельный однобоксовый промт.

---

## 1. Контекст

Сайт-подписка для российских школьных учителей математики и информатики (8–11 класс). Учитель платит 590 ₽/мес и получает доступ к **личной библиотеке автора** — готовым урокам (презентация PDF + рабочий лист PDF). Главная боль аудитории — нет времени каждый день делать слайды с нуля.

**Бренд = личность.** «Неумошка» — это домашнее уменьшительное от фамилии автора (Павел Неумоин). Сайт строится не как безликий каталог, а как **личная библиотека одного учителя для других учителей**. Ближайшая модель — Substack автора, а не EdTech-маркетплейс.

## 2. Аудитория

- Учительница 30–55 лет
- Не любит сложные интерфейсы
- Хочет: спокойствие, ясность, доверие конкретному человеку
- Не любит: яркие баннеры, поп-апы, kid-friendly иллюстрации, EdTech-стиль вроде Skyeng

## 3. Настроение и референсы

- Тёплый, спокойный, профессиональный, **личностный**
- ✅ Близкие референсы: **Substack (страница автора), Notion, Things, Reading.app, Ghost.org, gwern.net**
- ✅ Дальние: Stepik (но менее «технологично»), Yandex Practicum (но мягче, личнее)
- ❌ НЕ как: Skillbox, Skyeng, Учи.ру, Infourok, инфоцыганские лендинги

## 4. Цветовая палитра

| Назначение | Цвет |
|---|---|
| Фон страницы | Тёплый off-white `#FAFAF7` |
| Текст основной | Графит `#2A2A2A` |
| Текст вторичный | Серый `#6B6B6B` |
| Акцент | Тёмно-зелёный `#3D5A40` (или индиго `#3F4D9C`) |
| Карточки | Белый `#FFFFFF` с границей `#EAEAE5` |
| Hover | Тёплый бежевый `#F2EFE8` |

❌ Никаких градиентов
❌ Никаких ярких CTA-цветов

## 5. Типографика

- Основной шрифт интерфейса: **Inter, Manrope или Onest**
- H1: 48–56 px, жирный
- H2: 32–40 px, semibold
- Текст: 16–18 px, line-height 1.6
- Большие отступы между секциями: 96–128 px

**Опция:** для логотипа «Неумошка» можно использовать рукописный или сериф-шрифт (Lora, Fraunces, Caveat) — чтобы подчеркнуть авторство и тёплость бренда.

## 6. Layout

- Контентная ширина: **1100–1200 px**
- Каталог: 3 колонки на десктопе → 2 на планшете → 1 на мобильном
- Карточка урока: квадратное превью первого слайда + название + класс + теги

## 7. Экраны для дизайна

### 7.1. Лендинг (главная) — личностный

Секции сверху вниз:

1. **Hero (личностный)** — фото автора в нейтральном кабинете слева (или сверху на мобильном), справа:
   - Заголовок: «Готовые уроки математики и информатики. От учителя — учителю.»
   - Подзаголовок (от первого лица): «Привет, я Павел. Учу математике и информатике 8 лет. Здесь — все уроки, которые я делаю к своим занятиям: презентации, рабочие листы, ответы. Открыл, провёл, забыл про вечерние слайды.»
   - Две кнопки: **«Посмотреть бесплатно»** (ведёт на открытый раздел) и **«Подписаться за 590 ₽»**

2. **Что внутри** — 3 колонки: Презентации / Рабочие листы / Ответы (простые иконки в одну линию)

3. **Скриншоты урока** — горизонтальная карусель из 4–5 первых слайдов реальных уроков ★ (КЛЮЧ — показать качество)

4. **Как работает** — 3 шага: открыл сайт → выбрал урок → провёл

5. **Бесплатный раздел** — отдельный блок «Один раздел открыт навсегда — попробуйте до подписки», 3 карточки уроков + кнопка «Смотреть весь раздел»

6. **Тарифы** — 3 карточки (Месяц 590 ₽ / Квартал 1490 ₽ / Год 4990 ₽), посередине выделить «Год» как «лучшая цена»

7. **Обо мне** — фото покрупнее, 3–4 предложения от первого лица: где работаю, какой стаж, почему делаю эти уроки и почему делюсь

8. **FAQ** — accordion, 6–8 вопросов: «можно ли скачивать?», «есть ли возврат?», «откуда уроки?», «нужна ли регистрация?», «работает ли на телефоне?»

9. **Футер** — оферта, политика, контакты, ИНН (как самозанятый/ИП)

### 7.2. Каталог уроков

- Левая колонка (250 px): фильтры — класс (8–11), предмет (мат/инф), тема (древо), тип (новая тема / закрепление / контрольная)
- Основная зона: сетка карточек 3×N
- Карточка: превью слайда → название → теги (`8 класс · алгебра · теорема Виета`) → длительность (`45 мин`)
- **Бесплатные уроки** в каталоге выделены лёгкой тёплой плашкой «бесплатно»

### 7.3. Карточка урока

- Слева: большой preview PDF (можно листать слайды стрелками)
- Справа: название, описание (из `post.txt`), теги, что внутри (`презентация 18 слайдов · рабочий лист A4 · ответы`), кнопка «Скачать PDF» (для подписчиков и для уроков из бесплатного раздела) или «Оформить подписку» (для гостей)

### 7.4. Тарифы (отдельная страница)

3 карточки в ряд:
- Месяц — 590 ₽
- Квартал — 1490 ₽ «−16 %»
- Год — 4990 ₽ «лучшая цена · −30 %»

Под ними список фич («Все уроки», «Watermark с email», «Доступ навсегда после оплаты года», «Email с новинками», «Один раздел открыт без подписки»).

### 7.5. Бесплатный раздел (важная страница!)

- Шапка: «Этот раздел открыт навсегда. Если понравится — посмотрите весь каталог.»
- Сетка тех же карточек уроков (как в каталоге)
- Внизу — баннер «Понравилось? Подпишитесь за 590 ₽/мес — 50+ уроков»

### 7.6. Личный кабинет

Sidebar из 3 пунктов:
- **Мои уроки** — список последних скачанных, можно переоткрыть
- **Подписка** — статус, дата следующего списания, кнопка отмены
- **Настройки** — email, уведомления

### 7.7. Мобильная версия

- Каталог: 1 колонка
- Фильтры: снизу выезжает шторка
- Hero: фото вверху, текст под ним

## 8. Тон копирайта

- **От первого лица** — «я делаю», «у меня готово», «мои ученики», «вы экономите время»
- На «вы», уважительный, конкретный, тёплый
- ❌ НЕ использовать: «уникальный», «эксклюзивный», «революционный», «лучший», «премиум», «комьюнити», «инсайты», «контент», «эффективный»
- ✅ Использовать: «42 урока», «PDF + LaTeX», «44 минуты на урок», «по теме теоремы Виета»
- ❌ Никаких восклицательных знаков
- ✅ Можно небольшие житейские детали: «после школы», «на перемене», «к завтрашнему уроку»

## 9. Что точно НЕ делать

- ❌ Иллюстрации со школьниками-стоковиками
- ❌ Градиенты и неоновые цвета
- ❌ Анимации, отвлекающие от чтения
- ❌ Поп-ап «Не уходи, скидка 30 %!»
- ❌ Всплывающий чат-бот
- ❌ Карусели на главной с фотками довольных учителей-стоковиков
- ❌ Большие эмодзи в заголовках

---

## 10. ⚡ Готовый промт для v0.dev (одним блоком)

Скопируй блок ниже целиком и вставь в **v0.dev** или **galileo.ai**:

```
Design a calm, personal subscription website for a Russian school teacher (Pavel Neumoin) selling his own ready-to-use lesson materials to other math and CS teachers (grades 8-11). Brand name: "Неумошка" (a familiar diminutive of his last name). 590 RUB/month for access to his personal library of lesson PDFs (presentation + worksheet).

This is NOT a marketplace or EdTech platform — it's one teacher's library, framed like a personal Substack. The brand is the person.

Audience: women teachers aged 30-55, low tolerance for flashy EdTech, want to trust a real person.

Mood: warm, quiet, trustworthy, personal. References: Substack author pages, Notion, Reading.app, Ghost, gwern.net. NOT Skillbox/Skyeng/Coursera/Infourok.

Palette: off-white background #FAFAF7, graphite text #2A2A2A, secondary text #6B6B6B, dark green accent #3D5A40, white cards with #EAEAE5 borders. Warm beige hover #F2EFE8. No gradients. No bright CTAs.

Typography: Inter or Manrope for UI; optional warm serif (Lora, Fraunces) or handwritten (Caveat) for the "Неумошка" wordmark to emphasize authorship. H1 48-56px bold, H2 32-40px semibold, body 16-18px with 1.6 line-height. Generous 96-128px section spacing. Content width 1100-1200px.

Generate these screens:

1. Landing page with sections in this order:
   - Hero (personal): author photo on the left, on the right H1 "Готовые уроки математики и информатики. От учителя — учителю.", subheadline written in first person ("Привет, я Павел. Учу математике и информатике 8 лет. Здесь — все мои уроки..."), two buttons "Посмотреть бесплатно" and "Подписаться за 590 ₽"
   - Three-column features: Презентации / Рабочие листы / Ответы (simple line icons)
   - Horizontal carousel of 4-5 lesson slide previews
   - Three-step "Как работает" section
   - Free section block: "Один раздел открыт навсегда" with 3 sample lesson cards
   - Pricing cards: Месяц 590₽, Квартал 1490₽ (-16%), Год 4990₽ (-30%, highlighted as best value)
   - About me section: larger author photo + 3-4 first-person sentences about who I am and why I make these lessons
   - FAQ accordion with 6-8 questions
   - Footer with legal links and tax ID

2. Catalog page:
   - Left sidebar 250px wide with filters: class (8-11), subject (math/CS), topic (tree), lesson type
   - Main area: 3-column grid of lesson cards on desktop
   - Each card: square slide thumbnail + lesson title + grade and subject tags + duration
   - Free-section lessons have a soft warm "бесплатно" tag

3. Lesson detail page:
   - Left: large PDF slide preview with arrow navigation
   - Right: title, description, content tags, "what's inside" list, primary button "Скачать PDF" (for subscribers / free section) or "Оформить подписку" (for guests)

4. Free section page (very important): header "Этот раздел открыт навсегда. Если понравится — посмотрите весь каталог.", grid of lesson cards, conversion banner at bottom "Понравилось? Подпишитесь за 590 ₽/мес"

5. Pricing page with three plan cards in a row, year plan visually emphasized as best value, feature list below cards

6. Account page: left sidebar nav (Мои уроки / Подписка / Настройки), main content shows recent downloads as a list

Mobile responsive: single column on mobile, filter drawer slides up from bottom on catalog, hero photo on top with text below.

Russian language UI throughout. Tone: first-person, formal "вы", concrete numbers, no exclamation marks, no marketing buzzwords.
```

---

## 11. Что делать после генерации визуала

1. Сохрани результат в `E:\YA\YandexDisk\neumoshka\design\` (скриншоты, Figma-ссылка, экспорт)
2. Покажи мне (Claude) — обсудим, что менять
3. Дальше переходим к коду (Next.js + shadcn/ui повторят этот стиль за вечер)
4. Параллельно: подготовь фото для блока «обо мне» и короткий текст 3–4 предложения от первого лица
