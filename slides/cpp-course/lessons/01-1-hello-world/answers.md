---
marp: true
theme: worksheet
paginate: false
---

<div class="sheet-head">
<img class="bip-sheet" src="../../assets/bip-head.svg">
<div class="kicker">Ответы · Урок 1.1</div>

# Оживляем робота ✅
</div>

<div class="note"><strong>Версия для учителя.</strong> Готовые решения к рабочему листу 1.1. У учеников могут быть свои варианты — это нормально.</div>

## 1 · Кто за что отвечает

| Строка | Ответ | Что делает |
|---|---|---|
| `#include <iostream>` | **Б** | даёт роботу «рот», чтобы говорить |
| `int main()` | **В** | отсюда робот начинает работу |
| `std::cout << "Привет!";` | **А** | печатает текст на экран |

## 2 · Робот сломался — почини его

```cpp
int main() {
    std::cout << "Доброе утро!";
    return 0;
}
```

<div class="solution">Что было не так: текст нужно взять в кавычки — <strong>"Доброе утро!"</strong>; и после <strong>return 0</strong> пропущена точка с запятой.</div>

## 3 · Робот-сторож

```cpp
#include <iostream>

int main() {
    std::cout << "Стой! Кто идёт?";
    return 0;
}
```

## 4 · Робот знакомится

```cpp
#include <iostream>

int main() {
    std::cout << "Меня зовут Робот Бип.\n";
    std::cout << "Я умею считать и говорить.\n";
    return 0;
}
```

## 5 · Робот-зазывала ★

```cpp
#include <iostream>

int main() {
    std::cout << "Привет, прохожий!\n";
    std::cout << "У нас вкусное мороженое!\n";
    std::cout << "Заходи скорее к нам!\n";
    return 0;
}
```

## 6 · Подумай

<div class="solution">Без <strong>\n</strong> текст двух команд напечатается слитно, в одну строку, без перехода на новую. Например, получится <strong>ПриветПока</strong>.</div>
