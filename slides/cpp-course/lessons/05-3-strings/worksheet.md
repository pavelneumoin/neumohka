---
marp: true
theme: worksheet
paginate: false
---

<div class="sheet-head">
<img class="bip-sheet" src="../../assets/bip-head.svg">
<div class="kicker">Рабочий лист · Урок 5.3</div>

# Список дел школьника 📋

<div class="fields"><span>Имя:</span><span>Класс:</span><span>Дата:</span></div>
</div>

## 1 · Что делает операция

Соедини операцию со строками с тем, что она делает (впиши букву справа).

| Операция | | Что делает |
|---|---|---|
| `delo.length()` | ___ | **А** — склеивает строки в одну |
| `"Привет, " + imya` | ___ | **Б** — длина строки в символах |
| `a == b` | ___ | **В** — читает всю строку целиком |
| `std::getline(std::cin, s)` | ___ | **Г** — сравнивает две строки |

## 2 · Что выведет программа

Запиши, что появится на экране.

```cpp
std::string a = "Дом";
std::string b = "ашка";
std::cout << (a + b) << " " << (a + b).length();
```

<div class="lines sm"></div>

## 3 · Список сломался — почини его 🔧

В коде **две ошибки**. Найди их и запиши исправленные строки.

```cpp
std::vector<std::string> dela;
dela.push_back("Сделать уроки")
if (dela[0] = "Погулять") std::cout << "Гуляем";
```

<div class="lines sm"></div>
<div class="lines sm"></div>

---

## 4 · Длина дела 📝

Напиши программу: прочитай дело через `std::getline` и выведи его **длину** в символах.

<div class="box lg" data-label="todo.cpp"></div>

## 5 · Печатаем список с номерами 📋

Заведи список дел, добавь в него три дела и выведи их **с номерами** (1, 2, 3) циклом `for`.

<div class="box lg" data-label="todo.cpp"></div>

## 6 · Список дел с вводом <span class="star">★ со звёздочкой</span>

Напиши программу: пользователь вводит три дела с клавиатуры (через `std::getline`), они кладутся в `vector<std::string>`, а в конце выводится весь список с номерами и заголовком «Мои дела на сегодня».

<div class="box lg" data-label="todo.cpp"></div>
