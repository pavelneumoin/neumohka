---
marp: true
theme: worksheet
paginate: false
---

<div class="sheet-head">
<img class="bip-sheet" src="../../assets/bip-head.svg">
<div class="kicker">Рабочий лист · Урок 3.2</div>

# Игра принимает решения 🎮

<div class="fields"><span>Имя:</span><span>Класс:</span><span>Дата:</span></div>
</div>

## 1 · Какая ветка выполнится

Очков 65. Обведи строку, которую напечатает программа.

```cpp
int score = 65;
if (score >= 90) {
    std::cout << "Оценка 5";
} else if (score >= 60) {
    std::cout << "Оценка 4";
} else {
    std::cout << "Учись ещё";
}
```

<div class="lines sm"></div>

## 2 · Что выведет программа

Здоровья 0. Что напечатается?

```cpp
int hp = 0;
if (hp > 0) {
    std::cout << "Жив";
} else {
    std::cout << "Игра окончена";
}
```

<div class="lines sm"></div>

## 3 · Почини код 🔧

Программа должна проверить, **равны ли** очки 100. В условии ошибка — найди и исправь.

```cpp
if (score = 100) {
    std::cout << "Максимум!";
}
```

<div class="lines sm"></div>

---

## 4 · Пройти уровень 🏁

Уровень пройден, если очков **50 и больше**. Напиши программу: спроси очки через `std::cin` и выведи «Уровень пройден!» или «Попробуй ещё».

<div class="box lg" data-label="game.cpp"></div>

## 5 · Чётное или нечётное 🔢

Напиши программу: спроси число и выведи «Чётное» или «Нечётное». Подсказка: используй остаток `n % 2 == 0`.

<div class="box lg" data-label="game.cpp"></div>

## 6 · Светофор в гонке <span class="star">★ со звёздочкой</span>

Цвет задаётся числом: `1` — красный, `2` — жёлтый, `3` — зелёный. Спроси число и через `if / else if / else` выведи название цвета, а на лишнее число — «Нет такого сигнала».

<div class="box lg" data-label="game.cpp"></div>
