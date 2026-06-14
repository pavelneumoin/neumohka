---
marp: true
theme: worksheet
paginate: false
---

<div class="sheet-head">
<img class="bip-sheet" src="../../assets/bip-head.svg">
<div class="kicker">Ответы · Урок 5.1</div>

# Помощники-функции ✅
</div>

<div class="note"><strong>Версия для учителя.</strong> Готовые решения к рабочему листу 5.1. У учеников могут быть свои варианты — это нормально.</div>

## 1 · Из чего состоит функция

<div class="solution"><strong>void</strong> или <strong>int</strong> перед именем — Б (тип ответа). <strong>privet</strong> — В (имя функции). <strong>(std::string imya)</strong> — А (параметры). <strong>return a * b;</strong> — Г (возвращает ответ наружу).</div>

## 2 · Что выведет программа

```text
12
```

<div class="solution">Функция <strong>trojnoy(4)</strong> возвращает 4 умножить на 3, то есть 12.</div>

## 3 · Помощник сломался — почини его

```cpp
int ploshad(int a, int b) {
    return a * b;
}
int main() {
    std::cout << ploshad(4, 3);
}
```

<div class="solution">Что было не так: в функции забыли <strong>return</strong> — она ничего не возвращала. И при вызове аргументы нужно писать в скобках: <strong>ploshad(4, 3)</strong>.</div>

## 4 · Функция-приветствие

```cpp
#include <iostream>
#include <string>

void privet(std::string imya) {
    std::cout << "Привет, " << imya << "!\n";
}
int main() {
    privet("Аня");
    privet("Боря");
}
```

## 5 · Площадь и периметр

```cpp
#include <iostream>

int ploshad(int a, int b) {
    return a * b;
}
int main() {
    std::cout << ploshad(2, 5);
}
```

<div class="solution">Площадь окна 2 умножить на 5 равна 10.</div>

## 6 · Сумма трёх оценок ★

```cpp
#include <iostream>

int summa3(int a, int b, int c) {
    return a + b + c;
}
int main() {
    std::cout << summa3(5, 4, 5);
}
```

<div class="solution">Сумма оценок 5 + 4 + 5 равна 14.</div>
