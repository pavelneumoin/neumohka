---
marp: true
theme: worksheet
paginate: false
---

<div class="sheet-head">
<img class="bip-sheet" src="../../assets/bip-head.svg">
<div class="kicker">Ответы · Урок 4.1</div>

# Цикл while 🚀 ✅
</div>

<div class="note"><strong>Версия для учителя.</strong> Готовые решения к рабочему листу 4.1. У учеников могут быть свои варианты — это нормально.</div>

## 1 · Три части цикла

<div class="solution"><strong>int n = 5;</strong> — Б (стартовое значение счётчика).<br>
<strong>while (n > 0)</strong> — А (повторяем, пока оно верно).<br>
<strong>n = n - 1;</strong> — В (двигает счётчик к выходу).</div>

## 2 · Что выведет программа

```text
4 3 2 1 
```

<div class="solution">n идёт 4, 3, 2, 1; при n = 0 условие <strong>n > 0</strong> ложно, цикл останавливается.</div>

## 3 · Трассировка цикла

| Шаг | `n` | `n > 0`? | Вывод |
|---|---|---|---|
| 1 | 3 | да | 3 |
| 2 | 2 | да | 2 |
| 3 | 1 | да | 1 |
| 4 | 0 | нет | — |

<div class="solution">На шаге 4 условие уже ложно, поэтому ничего не выводится и цикл завершается.</div>

## 4 · Ракета сломалась — почини код

```cpp
int n = 5;
while (n > 0) {
    std::cout << n << "\n";
    n = n - 1;
}
std::cout << "ПУСК!\n";
```

<div class="solution">Что было не так: внутри цикла счётчик не уменьшался, поэтому <strong>n</strong> всегда оставался 5 и условие никогда не становилось ложным. Добавили строку <strong>n = n - 1;</strong>.</div>

## 5 · Обратный отсчёт

```cpp
#include <iostream>

int main() {
    int n = 5;
    while (n > 0) {
        std::cout << n << "\n";
        n = n - 1;
    }
    std::cout << "ПУСК!\n";
}
```

## 6 · Проверка ступеней ★

```cpp
#include <iostream>

int main() {
    int i = 1;
    while (i <= 5) {
        std::cout << "Ступень " << i << " готова\n";
        i = i + 1;
    }
}
```
