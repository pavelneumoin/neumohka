---
marp: true
theme: worksheet
paginate: false
---

<div class="sheet-head">
<img class="bip-sheet" src="../../assets/bip-head.svg">
<div class="kicker">Ответы · Урок 2.3</div>

# Касса считает ✅
</div>

<div class="note"><strong>Версия для учителя.</strong> Готовые решения к рабочему листу 2.3. У учеников могут быть свои варианты — это нормально.</div>

## 1 · Посчитай в уме

<div class="solution">60 + 35 = <strong>95</strong>. 50 * 3 = <strong>150</strong>. 200 − 180 = <strong>20</strong>. 2 + 3 * 4 = <strong>14</strong> (сначала умножение). 7 / 2 для int = <strong>3</strong> (целое деление отбрасывает дробную часть).</div>

## 2 · Что выведет программа

```text
Итого: 120 руб.
```

<div class="solution">total = price * count = 30 * 4 = 120.</div>

## 3 · Хитрое деление

```cpp
double a = 5.0 / 2;
```

<div class="solution">Почему было 2: когда делятся два целых числа (<strong>5 / 2</strong>), результат тоже целый — дробная часть отбрасывается, получается 2. Чтобы вышло 2.5, хотя бы одно число должно быть дробным (<strong>5.0</strong>), и переменную берём типа <strong>double</strong>.</div>

---

## 4 · Стоимость заказа

```cpp
#include <iostream>

int main() {
    int price = 30;
    int count = 4;
    int total = price * count;
    std::cout << "Итого: " << total << " руб.";
    return 0;
}
```

```text
Итого: 120 руб.
```

## 5 · Сколько сдачи

```cpp
#include <iostream>

int main() {
    int total = 180;
    int paid = 200;
    int change = paid - total;
    std::cout << "Сдача: " << change << " руб.";
    return 0;
}
```

```text
Сдача: 20 руб.
```

<div class="solution">Сдача = сколько дали − стоимость заказа. Числа можно взять любые.</div>

## 6 · Касса со сдачей ★

```cpp
#include <iostream>

int main() {
    int price;
    int count;
    int paid;

    std::cout << "Цена товара? ";
    std::cin >> price;
    std::cout << "Сколько штук? ";
    std::cin >> count;
    std::cout << "Сколько денег дали? ";
    std::cin >> paid;

    int total = price * count;
    int change = paid - total;

    std::cout << "Итого: " << total << " руб.\n";
    std::cout << "Сдача: " << change << " руб.";
    return 0;
}
```

<div class="solution">Стоимость = цена * количество, сдача = дали − стоимость. Принимаем любой аккуратный вариант с двумя строками вывода.</div>
