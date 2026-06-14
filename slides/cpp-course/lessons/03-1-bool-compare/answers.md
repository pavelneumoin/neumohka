---
marp: true
theme: worksheet
paginate: false
---

<div class="sheet-head">
<img class="bip-sheet" src="../../assets/bip-head.svg">
<div class="kicker">Ответы · Урок 3.1</div>

# Игра задаёт вопросы ✅
</div>

<div class="note"><strong>Версия для учителя.</strong> Готовые решения к рабочему листу 3.1. У учеников могут быть свои варианты — это нормально.</div>

## 1 · Правда или ложь

<div class="solution">
90 > 50 → 1 (true)<br>
7 == 7 → 1 (true)<br>
3 < 1 → 0 (false)<br>
10 != 10 → 0 (false)<br>
50 >= 50 → 1 (true)
</div>

## 2 · Что выведет программа

```text
0
```

<div class="solution">80 не больше и не равно 100, поэтому score >= 100 даёт false, то есть <strong>0</strong>.</div>

## 3 · Почини код

```cpp
int hp = 0;
std::cout << (hp == 0);
```

<div class="solution">Что было не так: стоял один знак <strong>=</strong> (присваивание), а для проверки равенства нужно два — <strong>==</strong> (сравнение).</div>

## 4 · Хватает ли монет

```cpp
#include <iostream>

int main() {
    int coins = 120;
    std::cout << (coins >= 100);
    return 0;
}
```

## 5 · Открыт ли уровень

```cpp
#include <iostream>

int main() {
    int stars;
    std::cin >> stars;
    std::cout << (stars >= 3);
    return 0;
}
```

## 6 · Рекорд побит?

```cpp
#include <iostream>

int main() {
    int result;
    std::cin >> result;
    std::cout << (result > 250) << "\n";
    std::cout << (result == 250) << "\n";
    return 0;
}
```

<div class="solution">Первая проверка — рекорд побит (новый строго больше 250), вторая — рекорд повторён (новый равен 250).</div>
