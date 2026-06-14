---
marp: true
theme: worksheet
paginate: false
---

<div class="sheet-head">
<img class="bip-sheet" src="../../assets/bip-head.svg">
<div class="kicker">Шпаргалка · Урок 5.2</div>

# Журнал оценок 📓
</div>

## Создать список чисел

```cpp
#include <vector>

std::vector<int> ocenki;
```

В угловых скобках `<int>` — что внутри: целые числа. Не забудь `#include <vector>`.

## Добавить и узнать размер

```cpp
ocenki.push_back(5);   // добавить в конец
ocenki.push_back(4);
std::cout << ocenki.size();   // сколько элементов
```

## Взять элемент по номеру

```cpp
ocenki[0];   // первый (счёт с нуля!)
ocenki[1];   // второй
```

## Перебрать весь список

```cpp
for (int i = 0; i < ocenki.size(); i++) {
    std::cout << ocenki[i] << " ";
}
```

## Сумма и средний балл

```cpp
int summa = 0;
for (int i = 0; i < ocenki.size(); i++) summa += ocenki[i];
double sredniy = (double)summa / ocenki.size();
```

## Запомни ✅

- Счёт элементов идёт **с нуля**: первый — `[0]`
- `.size()` удобно ставить в условие цикла
- Для `vector` нужен `#include <vector>`

## Частые ошибки ⚠️

| Ошибка | Как правильно |
|---|---|
| `v.push_back 5;` | `v.push_back(5);` |
| `v[1]` при одном элементе | `v[0]` |
| `summa / v.size()` без `(double)` | `(double)summa / v.size()` |

## Словарик 📖

- **`vector`** — список, в который можно добавлять элементы
- **`push_back`** — добавить элемент в конец списка
- **Индекс** — номер элемента, счёт с нуля
- **`.size()`** — количество элементов в списке
