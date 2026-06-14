---
marp: true
theme: worksheet
paginate: false
---

<div class="sheet-head">
<img class="bip-sheet" src="../../assets/bip-head.svg">
<div class="kicker">Ответы · Урок 3.3</div>

# Собираем викторину ✅
</div>

<div class="note"><strong>Версия для учителя.</strong> Готовые решения к рабочему листу 3.3. У учеников могут быть свои варианты — это нормально.</div>

## 1 · Заполни таблицу «И» и «ИЛИ»

<div class="solution">
A=true, B=true → A &amp;&amp; B = true, A || B = true<br>
A=true, B=false → A &amp;&amp; B = false, A || B = true<br>
A=false, B=false → A &amp;&amp; B = false, A || B = false
</div>

## 2 · Что выведет программа

```text
0
```

<div class="solution">score >= 50 истинно, но lives > 0 ложно (жизней 0). Для «И» нужны обе части истинными, поэтому результат — <strong>0</strong>.</div>

## 3 · Почини код

```cpp
if (coins >= 100 && level >= 3) {
    std::cout << "Меч куплен";
}
```

<div class="solution">Что было не так: стоял один знак <strong>&amp;</strong>, а логическое «И» пишется двумя — <strong>&amp;&amp;</strong>.</div>

## 4 · Бонус-уровень

```cpp
#include <iostream>

int main() {
    int score = 95, lives = 2;
    std::cout << (score >= 90 && lives > 0);
    return 0;
}
```

## 5 · Один вопрос викторины

```cpp
#include <iostream>

int main() {
    int answer;
    std::cout << "Сколько будет 2 + 2? ";
    std::cin >> answer;
    if (answer == 4) {
        std::cout << "Верно!";
    } else {
        std::cout << "Неверно";
    }
    return 0;
}
```

## 6 · Своя викторина из 2 вопросов

```cpp
#include <iostream>

int main() {
    int score = 0;
    int answer;

    std::cout << "Сколько дней в неделе? ";
    std::cin >> answer;
    if (answer == 7) {
        score = score + 1;
    }

    std::cout << "Сколько будет 5 * 2? ";
    std::cin >> answer;
    if (answer == 10) {
        score = score + 1;
    }

    std::cout << "Набрано очков: " << score;
    return 0;
}
```
