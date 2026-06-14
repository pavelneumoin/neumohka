---
marp: true
theme: macos
paginate: true
---

<!-- _class: cover -->
<!-- _paginate: false -->

<div class="kicker">Библиотека макетов</div>

# Компоненты <mark>слайдов</mark>

### Готовые «кирпичики» для всех уроков. Копируй нужный — наполняй своим.

<img class="hero-bot" src="assets/bip.svg">

---

<!-- _class: section -->

<div class="bignum">РАЗДЕЛИТЕЛЬ</div>

# Тёмный раздел модуля

### Объявляем новый блок. `Класс: section`

<img class="hero-bot" src="assets/bip.svg">

---

## Реплика Бипа

<div class="bubble"><img class="bip-head" src="assets/bip-head.svg"><span>Привет! Я объясняю тему от первого лица — так живее. Внутри меня только текст и <strong>жирный</strong>, без эмодзи.</span></div>

`Компонент: .bubble`

---

## Цветные подсказки

<div class="tip">Важное правило, которое нельзя забывать.</div>

<div class="try">Мини-задание: сделай прямо сейчас и проверь.</div>

<div class="fact">Интересный факт или связь с реальной жизнью.</div>

`Компоненты: .tip · .try · .fact`

---

## Конвейер со стрелками

<div class="flow">

<div class="step">
<span class="ico">📝</span>

**Код** <small>robot.cpp</small>

</div>

<div class="step">
<span class="ico">⚙️</span>

**Компилятор** <small>g++</small>

</div>

<div class="step">
<span class="ico">🤖</span>

**Программа** <small>робот говорит</small>

</div>

</div>

`Компонент: .flow + .step`

---

## Карточки (2–4 шт.)

<div class="grid">

<div class="card">
<span class="ico">⚡</span>

### Скорость
Один из самых быстрых языков.

</div>

<div class="card">
<span class="ico">🧱</span>

### Фундамент
Понимаешь компьютер изнутри.

</div>

<div class="card">
<span class="ico">🎮</span>

### Игры
Игры, системы, олимпиады.

</div>

</div>

`Компонент: .grid + .card`

---

## Код и результат

<div class="cols">

<div>

**Код:**

```cpp
std::cout << "Привет!";
```

</div>

<div>

**Результат:**

<span class="out">Привет!</span>

</div>

</div>

`Компоненты: .cols · код · .out`

---

## Таблица

| Тип | Что хранит | Пример |
|---|---|---|
| `int` | целые числа | `42` |
| `double` | дробные | `3.14` |
| `string` | текст | `"Привет"` |

`Компонент: table`

---

<!-- _class: center -->

# Крупный <mark>тезис</mark> по центру

### Когда одна мысль должна заполнить весь экран. `Класс: center`

---

<!-- _class: task -->

# Задача · Угадай результат <span class="pill">★ со звёздочкой</span>

```cpp
int x = 5;
std::cout << x * 2 + 1;
```

- Что выведет программа?
- Проверь, запустив код

`Класс: task · бейдж .pill`

---

## Картинка / схема

<div class="placeholder">сюда вставляем скриншот кода или схему</div>

`Компонент: .placeholder`

---

<!-- _class: dark -->
<!-- _paginate: false -->

# Тёмный финал 🎉

### Итог урока, мотивация, домашнее задание. `Класс: dark`
