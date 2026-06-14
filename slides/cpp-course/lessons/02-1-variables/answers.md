---
marp: true
theme: worksheet
paginate: false
---

<div class="sheet-head">
<img class="bip-sheet" src="../../assets/bip-head.svg">
<div class="kicker">Ответы · Урок 2.1</div>

# Заводим переменные ✅
</div>

<div class="note"><strong>Версия для учителя.</strong> Готовые решения к рабочему листу 2.1. У учеников могут быть свои варианты — это нормально.</div>

## 1 · Какой нужен тип

<div class="solution">Цена <strong>60</strong> (целое) — <strong>В</strong> (int). Цена <strong>49.90</strong> (с копейками) — <strong>А</strong> (double). Название «Молоко» — <strong>Б</strong> (std::string).</div>

## 2 · Что выведет программа

```text
Сыр — 250 руб.
```

## 3 · Почини ценник

```cpp
int price = 75;
std::cout << "Цена: " << price << " руб.";
```

<div class="solution">Что было не так: цену писали в кавычках (<strong>"75"</strong> — это текст, а не число), а имя переменной <strong>price</strong> тоже взяли в кавычки, и вместо значения печаталось слово price. Кавычки у обоих лишние.</div>

## 4 · Первый ценник

```cpp
#include <iostream>
#include <string>

int main() {
    std::string name = "Молоко";
    int price = 60;
    std::cout << name << " — " << price << " руб.";
    return 0;
}
```

```text
Молоко — 60 руб.
```

---

## 5 · Карточка товара

```cpp
#include <iostream>
#include <string>

int main() {
    std::string name = "Молоко";
    int price = 60;
    bool inStock = true;
    std::cout << "Товар: " << name << "\n";
    std::cout << "Цена: " << price << " руб.\n";
    std::cout << "В наличии: " << inStock << "\n";
    return 0;
}
```

```text
Товар: Молоко
Цена: 60 руб.
В наличии: 1
```

<div class="solution">Тип <strong>bool</strong> печатается как 1 (правда) или 0 (ложь). Это нормально — ученики ещё не знают про слова true/false на экране.</div>

## 6 · Витрина магазина ★

```cpp
#include <iostream>
#include <string>

int main() {
    std::string item1 = "Молоко";
    int price1 = 60;
    std::string item2 = "Хлеб";
    int price2 = 35;
    std::string item3 = "Сыр";
    int price3 = 250;

    std::cout << item1 << " — " << price1 << " руб.\n";
    std::cout << item2 << " — " << price2 << " руб.\n";
    std::cout << item3 << " — " << price3 << " руб.\n";
    return 0;
}
```

<div class="solution">Принимаем любые три товара с ценами. Главное — у каждого товара свои переменные и аккуратный вывод по строкам.</div>
