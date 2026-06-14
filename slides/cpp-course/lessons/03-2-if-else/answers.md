---
marp: true
theme: worksheet
paginate: false
---

<div class="sheet-head">
<img class="bip-sheet" src="../../assets/bip-head.svg">
<div class="kicker">Ответы · Урок 3.2</div>

# Игра принимает решения ✅
</div>

<div class="note"><strong>Версия для учителя.</strong> Готовые решения к рабочему листу 3.2. У учеников могут быть свои варианты — это нормально.</div>

## 1 · Какая ветка выполнится

```text
Оценка 4
```

<div class="solution">65 не больше и не равно 90, значит первая ветка пропускается. Но 65 >= 60 — истина, поэтому выполняется ветка else if с выводом <strong>Оценка 4</strong>.</div>

## 2 · Что выведет программа

```text
Игра окончена
```

<div class="solution">hp равно 0, условие hp > 0 ложно, поэтому выполняется ветка else.</div>

## 3 · Почини код

```cpp
if (score == 100) {
    std::cout << "Максимум!";
}
```

<div class="solution">Что было не так: в условии стоял один знак <strong>=</strong> (присваивание). Для проверки равенства нужно два — <strong>==</strong>.</div>

## 4 · Пройти уровень

```cpp
#include <iostream>

int main() {
    int score;
    std::cin >> score;
    if (score >= 50) {
        std::cout << "Уровень пройден!";
    } else {
        std::cout << "Попробуй ещё";
    }
    return 0;
}
```

## 5 · Чётное или нечётное

```cpp
#include <iostream>

int main() {
    int n;
    std::cin >> n;
    if (n % 2 == 0) {
        std::cout << "Чётное";
    } else {
        std::cout << "Нечётное";
    }
    return 0;
}
```

## 6 · Светофор в гонке

```cpp
#include <iostream>

int main() {
    int color;
    std::cin >> color;
    if (color == 1) {
        std::cout << "Красный";
    } else if (color == 2) {
        std::cout << "Жёлтый";
    } else if (color == 3) {
        std::cout << "Зелёный";
    } else {
        std::cout << "Нет такого сигнала";
    }
    return 0;
}
```
