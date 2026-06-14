---
marp: true
theme: worksheet
paginate: false
---

<div class="sheet-head">
<img class="bip-sheet" src="../../assets/bip-head.svg">
<div class="kicker">Рабочий лист · Урок 3.3</div>

# Собираем викторину 🎮

<div class="fields"><span>Имя:</span><span>Класс:</span><span>Дата:</span></div>
</div>

## 1 · Заполни таблицу «И» и «ИЛИ»

Впиши `true` или `false` в пустые клетки.

| A | B | `A && B` | `A \|\| B` |
|---|---|---|---|
| true | true | ___ | ___ |
| true | false | ___ | ___ |
| false | false | ___ | ___ |

## 2 · Что выведет программа

Очков 80, жизней 0. Что напечатается (0 или 1)?

```cpp
int score = 80, lives = 0;
std::cout << (score >= 50 && lives > 0);
```

<div class="lines sm"></div>

## 3 · Почини код 🔧

Здесь должна быть логика «И», но знаки написаны неверно. Найди и исправь.

```cpp
if (coins >= 100 & level >= 3) {
    std::cout << "Меч куплен";
}
```

<div class="lines sm"></div>

---

## 4 · Бонус-уровень 🌟

Напиши программу: бонус открыт, если очков **90 и больше И** жизней больше нуля. Заведи `score` и `lives`, проверь условие через `&&` и выведи результат.

<div class="box lg" data-label="game.cpp"></div>

## 5 · Один вопрос викторины ❓

Напиши викторину на **один** вопрос: выведи вопрос через `cout`, прочитай ответ через `cin` и сравни с правильным через `if`. Выведи «Верно!» или «Неверно».

<div class="box lg" data-label="game.cpp"></div>

## 6 · Своя викторина из 2 вопросов <span class="star">★ со звёздочкой</span>

Собери викторину на **два** вопроса. Заведи `int score = 0;`, за каждый верный ответ прибавляй 1, в конце выведи число набранных очков.

<div class="box lg" data-label="game.cpp"></div>
