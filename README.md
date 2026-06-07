# Неумошка

Сайт-подписка для учителей: каталог готовых уроков (презентация + рабочий лист) от автора Павла Неумоина за 590 ₽/мес.

## Что в репозитории

| Папка / файл | Что |
|---|---|
| [`RDP.md`](RDP.md) | План проекта, бизнес-модель, открытые вопросы |
| [`design-prompt.md`](design-prompt.md) | Бриф для AI-дизайнера (v0/Galileo/Figma AI) |
| [`web/`](web/) | Hi-fi прототип на vanilla HTML/CSS/JS — **только как референс**, не дорабатывается |
| [`web-next/`](web-next/) | **Боевой Next.js 16 + React 19**: лендинг, каталог из 62 уроков, карточка урока, тарифы, FAQ, бесплатный раздел. См. [`web-next/README.md`](web-next/README.md) |
| [`deploy/`](deploy/) | nginx-конфиг для статического превью (старый); под `web-next` потребует переписать |

## Запустить локально

Боевой стек:

```bash
cd web-next
npm install            # уже сделано
npm run sync           # подтянуть уроки из E:/YA/YandexDisk/Lessons/library/
npm run dev            # http://localhost:3000
```

Старый прототип (только как референс):

```bash
cd web
python -m http.server 8000
# → http://localhost:8000/
```

## Деплой на сервер

См. [`deploy/README.md`](deploy/README.md). Сейчас превью лежит на сервере РабочийЛист.ai по пути `/neumoshka/`.

## Стек (план)

- Next.js 14 + TypeScript
- Prisma + PostgreSQL
- ЮKassa (платежи)
- Yandex Object Storage (PDF-файлы)
- Nginx + Linux-сервер (Yandex Cloud)

## Статус

- ✅ 2026-05-05 — RDP, ключевые решения (название, цена, триал, архитектура)
- ✅ 2026-05-06 — wireframes V1/V2/V3 → hi-fi прототип со всеми страницами и дизайн-системой
- ✅ 2026-05-10 — **Спринт 1 готов**: Next.js-каркас в `web-next/`, дизайн-токены, лендинг, каталог из 62 реальных уроков с фильтрами, карточка урока с описанием из post.txt, 5 бесплатных уроков (тригонометрия 10 кл) с реальной выдачей PDF. Sync-скрипт `npm run sync` тащит из `Lessons/library/` 62 урока, копирует PDF в `public/library/{slug}/`
- ⏳ Спринт 2 — Auth (NextAuth/magic link), ЮKassa-интеграция, кабинет, watermark с email на PDF
- ⏳ Спринт 3 — деплой (PDF на S3/Yandex Object Storage), SEO, telegram-бот для уведомлений
