---
marp: true
theme: worksheet
paginate: false
---

<div class="sheet-head">
<img class="bip-sheet" src="../../assets/bip-head.svg">
<div class="kicker">Ответы · Урок 2.2</div>

# Магазин спрашивает ✅
</div>

<div class="note"><strong>Версия для учителя.</strong> Готовые решения к рабочему листу 2.2. У учеников могут быть свои варианты — это нормально.</div>

## 1 · cin или cout

<div class="solution">Спросить число у покупателя — <strong>std::cin</strong> (ввод). Напечатать «Здравствуйте!» — <strong>std::cout</strong> (вывод). Прочитать имя с клавиатуры — <strong>std::cin</strong> (ввод).</div>

## 2 · Куда смотрят стрелки

```cpp
std::cout << "Сколько товаров? ";
std::cin  >> count;
```

<div class="solution">У вывода <strong>cout</strong> стрелки смотрят к экрану — <strong>&lt;&lt;</strong>. У ввода <strong>cin</strong> стрелки смотрят в переменную — <strong>&gt;&gt;</strong>.</div>

## 3 · Почини диалог

```cpp
std::cout << "Ваш возраст? ";
std::cin >> age;
```

<div class="solution">Что было не так: у <strong>std::cin</strong> стояли стрелки вывода <strong>&lt;&lt;</strong>, а нужны стрелки ввода <strong>&gt;&gt;</strong> — данные идут с клавиатуры в переменную age.</div>

---

## 4 · Знакомство

```cpp
#include <iostream>
#include <string>

int main() {
    std::string name;
    std::cout << "Как вас зовут? ";
    std::cin >> name;
    std::cout << "Здравствуйте, " << name << "!";
    return 0;
}
```

## 5 · Анкета покупателя

```cpp
#include <iostream>
#include <string>

int main() {
    std::string name;
    int age;
    std::cout << "Как вас зовут? ";
    std::cin >> name;
    std::cout << "Сколько вам лет? ";
    std::cin >> age;
    std::cout << name << ", вам " << age << " лет";
    return 0;
}
```

<div class="solution">Перед каждым вводом печатаем вопрос, чтобы покупатель понимал, что от него хотят.</div>

## 6 · Карта лояльности ★

```cpp
#include <iostream>
#include <string>

int main() {
    std::string name;
    std::string item;
    int count;

    std::cout << "Как вас зовут? ";
    std::cin >> name;
    std::cout << "Какой товар берёте? ";
    std::cin >> item;
    std::cout << "Сколько штук? ";
    std::cin >> count;

    std::cout << name << ", ваш заказ: " << item << " — " << count << " шт.\n";
    std::cout << "Спасибо за покупку!";
    return 0;
}
```

<div class="solution">Принимаем любой вежливый вариант: важно, что спросили три вещи (имя, товар, количество) и вывели заказ с благодарностью.</div>
