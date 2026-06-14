---
marp: true
theme: worksheet
paginate: false
---

<div class="sheet-head">
<img class="bip-sheet" src="../../assets/bip-head.svg">
<div class="kicker">Ответы · Урок 5.3</div>

# Список дел школьника ✅
</div>

<div class="note"><strong>Версия для учителя.</strong> Готовые решения к рабочему листу 5.3. У учеников могут быть свои варианты — это нормально.</div>

## 1 · Что делает операция

<div class="solution"><strong>delo.length()</strong> — Б (длина строки в символах). <strong>"Привет, " + imya</strong> — А (склеивает строки в одну). <strong>a == b</strong> — Г (сравнивает две строки). <strong>std::getline(std::cin, s)</strong> — В (читает всю строку целиком).</div>

## 2 · Что выведет программа

```text
Домашка 7
```

<div class="solution">Строки склеиваются в Домашка. В этом слове 7 букв, поэтому length() равно 7.</div>

## 3 · Список сломался — почини его

```cpp
std::vector<std::string> dela;
dela.push_back("Сделать уроки");
if (dela[0] == "Погулять") std::cout << "Гуляем";
```

<div class="solution">Что было не так: после push_back(...) забыли точку с запятой. И в условии нужно сравнение <strong>==</strong>, а не присваивание = (один знак равно меняет значение вместо проверки).</div>

## 4 · Длина дела

```cpp
#include <iostream>
#include <string>

int main() {
    std::string delo;
    std::getline(std::cin, delo);
    std::cout << delo.length();
}
```

## 5 · Печатаем список с номерами

```cpp
#include <iostream>
#include <vector>
#include <string>

int main() {
    std::vector<std::string> dela;
    dela.push_back("Сделать уроки");
    dela.push_back("Погулять");
    dela.push_back("Помыть посуду");
    for (int i = 0; i < dela.size(); i++) {
        std::cout << (i + 1) << ". " << dela[i] << "\n";
    }
}
```

<div class="solution">Номер берём как i + 1, потому что счёт элементов начинается с 0, а ученикам показываем 1, 2, 3.</div>

## 6 · Список дел с вводом ★

```cpp
#include <iostream>
#include <vector>
#include <string>

int main() {
    std::vector<std::string> dela;
    for (int i = 0; i < 3; i++) {
        std::string delo;
        std::getline(std::cin, delo);
        dela.push_back(delo);
    }
    std::cout << "Мои дела на сегодня\n";
    for (int i = 0; i < dela.size(); i++) {
        std::cout << (i + 1) << ". " << dela[i] << "\n";
    }
}
```

<div class="solution">Сначала три раза читаем дело через getline и кладём в список, потом выводим заголовок и весь список с номерами.</div>
