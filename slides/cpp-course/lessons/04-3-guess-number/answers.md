---
marp: true
theme: worksheet
paginate: false
---

<div class="sheet-head">
<img class="bip-sheet" src="../../assets/bip-head.svg">
<div class="kicker">Ответы · Урок 4.3</div>

# Игра «Угадай число» 🎯 ✅
</div>

<div class="note"><strong>Версия для учителя.</strong> Готовые решения к рабочему листу 4.3. У учеников могут быть свои варианты — это нормально.</div>

## 1 · Кто за что отвечает

<div class="solution"><strong>rand() % 100</strong> — Б (случайное число 0–99).<br>
<strong>break</strong> — А (выйти из цикла досрочно).<br>
<strong>continue</strong> — В (пропустить один шаг цикла).</div>

## 2 · Что выведет программа

```text
1 2 4 5 
```

<div class="solution">Когда i равно 3, срабатывает continue и шаг пропускается, поэтому тройка не выводится.</div>

## 3 · break или continue?

<div class="solution">Чтобы <strong>выйти</strong> из цикла, когда число угадано → break.<br>
Чтобы <strong>пропустить</strong> один шаг и продолжить → continue.</div>

## 4 · Игра сломалась — почини код

```cpp
while (true) {
    std::cin >> guess;
    if (guess == secret) {
        std::cout << "Угадал!\n";
        break;
    }
}
```

<div class="solution">Что было не так: в цикле <strong>while (true)</strong> не хватало <strong>break</strong>, поэтому после правильного ответа программа всё равно продолжала спрашивать. Добавили <strong>break;</strong> внутри if — теперь после «Угадал!» цикл завершается.</div>

## 5 · Своя игра «Угадай число»

```cpp
#include <iostream>
#include <cstdlib>

int main() {
    int secret = rand() % 100;
    int guess;
    while (true) {
        std::cin >> guess;
        if (guess == secret) {
            std::cout << "Угадал!\n";
            break;
        } else if (guess < secret) {
            std::cout << "Больше!\n";
        } else {
            std::cout << "Меньше!\n";
        }
    }
}
```

## 6 · Считаем попытки ★

```cpp
#include <iostream>
#include <cstdlib>

int main() {
    int secret = rand() % 100;
    int guess;
    int tries = 0;
    while (true) {
        std::cin >> guess;
        tries = tries + 1;
        if (guess == secret) {
            std::cout << "Готово за " << tries << " попыток!\n";
            break;
        } else if (guess < secret) {
            std::cout << "Больше!\n";
        } else {
            std::cout << "Меньше!\n";
        }
    }
}
```

<div class="solution">Счётчик <strong>tries</strong> заводим до цикла со значением 0 и увеличиваем на 1 на каждом шаге — сразу после ввода числа. Когда игрок угадал, в <strong>tries</strong> уже лежит число попыток, и его печатаем перед break.</div>
