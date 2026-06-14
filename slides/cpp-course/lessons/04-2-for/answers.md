---
marp: true
theme: worksheet
paginate: false
---

<div class="sheet-head">
<img class="bip-sheet" src="../../assets/bip-head.svg">
<div class="kicker">Ответы · Урок 4.2</div>

# Цикл for ⭐ ✅
</div>

<div class="note"><strong>Версия для учителя.</strong> Готовые решения к рабочему листу 4.2. У учеников могут быть свои варианты — это нормально.</div>

## 1 · Три части for

<div class="solution"><strong>int i = 1</strong> — Б (старт счётчика).<br>
<strong>i &lt;= 5</strong> — В (условие повтора).<br>
<strong>i++</strong> — А (шаг: увеличить счётчик).</div>

## 2 · Что выведет программа

```text
2 4 6 8 
```

<div class="solution">i идёт 1, 2, 3, 4, а выводим i * 2: значит 2, 4, 6, 8.</div>

## 3 · Трассировка копилки

| Шаг | `i` | `sum` было | `sum` стало |
|---|---|---|---|
| 1 | 1 | 0 | 1 |
| 2 | 2 | 1 | 3 |
| 3 | 3 | 3 | 6 |
| 4 | 4 | 6 | 10 |

<div class="solution">На каждом шаге к копилке прибавляется текущее i. Итог суммы 1 + 2 + 3 + 4 = 10.</div>

## 4 · Копилка сломалась — почини код

```cpp
int sum = 0;
for (int i = 1; i <= 5; i++) {
    sum = sum + i;
}
std::cout << sum;
```

<div class="solution">Что было не так: строка <strong>int sum = 0;</strong> стояла внутри цикла, поэтому копилка обнулялась на каждом шаге. Завели <strong>sum</strong> до цикла — тогда сумма копится и в конце выводится 15.</div>

## 5 · Считаем звёзды

```cpp
#include <iostream>

int main() {
    for (int i = 1; i <= 8; i++) {
        std::cout << "Звезда №" << i << "\n";
    }
}
```

## 6 · Очки за полёт ★

```cpp
#include <iostream>

int main() {
    int sum = 0;
    for (int i = 1; i <= 10; i++) {
        sum = sum + i;
    }
    std::cout << "Очки: " << sum << "\n";
}
```

<div class="solution">Сумма чисел от 1 до 10 равна 55, поэтому программа печатает «Очки: 55».</div>
