---
marp: true
theme: worksheet
paginate: false
---

<div class="sheet-head">
<img class="bip-sheet" src="../../assets/bip-head.svg">
<div class="kicker">Рабочий лист · Урок 5.1</div>

# Помощники-функции 🧑‍🏫

<div class="fields"><span>Имя:</span><span>Класс:</span><span>Дата:</span></div>
</div>

## 1 · Из чего состоит функция

Соедини часть функции с её названием (впиши букву справа).

| Часть | | Что это |
|---|---|---|
| `void` или `int` перед именем | ___ | **А** — параметры, данные для функции |
| `privet` | ___ | **Б** — тип ответа (или `void`) |
| `(std::string imya)` | ___ | **В** — имя функции |
| `return a * b;` | ___ | **Г** — возвращает ответ наружу |

## 2 · Что выведет программа

Запиши, что появится на экране.

```cpp
int trojnoy(int x) {
    return x * 3;
}
int main() {
    std::cout << trojnoy(4);
}
```

<div class="lines sm"></div>

## 3 · Помощник сломался — почини его 🔧

В коде **две ошибки**. Найди их и запиши исправленные строки.

```cpp
int ploshad(int a, int b) {
    a * b;
}
int main() {
    std::cout << ploshad 4, 3;
}
```

<div class="lines sm"></div>
<div class="lines sm"></div>

---

## 4 · Функция-приветствие 👋

Напиши функцию `privet(imya)`, которая выводит **«Привет, имя!»**, и позови её для двух одноклассников.

<div class="box lg" data-label="school.cpp"></div>

## 5 · Площадь и периметр 📐

Напиши функцию `ploshad(a, b)`, которая возвращает площадь прямоугольника, и выведи площадь окна `2 × 5`.

<div class="box lg" data-label="school.cpp"></div>

## 6 · Сумма трёх оценок <span class="star">★ со звёздочкой</span>

Напиши функцию `summa3(a, b, c)`, которая возвращает сумму трёх оценок. В `main` посчитай сумму оценок `5 4 5` и выведи её.

<div class="box lg" data-label="school.cpp"></div>
