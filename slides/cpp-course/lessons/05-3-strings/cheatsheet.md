---
marp: true
theme: worksheet
paginate: false
---

<div class="sheet-head">
<div class="kicker">Шпаргалка · Урок 5.3</div>

# Список дел школьника 📋
</div>

## Строка текста

```cpp
#include <string>

std::string delo = "Сделать уроки";
```

Строка хранит любой текст. Не забудь `#include <string>`.

## Длина и склейка

```cpp
delo.length();            // сколько символов
"Привет, " + imya + "!"   // склеить строки через +
```

## Сравнение строк

```cpp
if (otvet == "да") { ... }   // строки сравнивают через ==
```

«да» и «Да» — разные строки: большая буква важна.

## Ввод строки целиком

```cpp
std::string delo;
std::getline(std::cin, delo);   // вся строка с пробелами
```

`std::cin >>` читает только одно слово — до пробела. Для дел нужен `getline`.

## Список дел

```cpp
#include <vector>
#include <string>

std::vector<std::string> dela;
dela.push_back("Погулять");
for (int i = 0; i < dela.size(); i++)
    std::cout << i + 1 << ". " << dela[i] << "\n";
```

## Запомни ✅

- Для строк — `#include <string>`, для списка — `#include <vector>`
- `getline` читает строку с пробелами целиком
- Сравнение — `==`, а не один `=`
- `i + 1` нумерует список для человека с 1

## Частые ошибки ⚠️

| Ошибка | Как правильно |
|---|---|
| `if (s = "да")` | `if (s == "да")` |
| `std::cin >> delo` (с пробелами) | `std::getline(std::cin, delo)` |
| `dela.push_back("...")` без `;` | добавь `;` в конце |

## Словарик 📖

- **`string`** — строка, хранит текст
- **`.length()`** — длина строки в символах
- **`getline`** — читает всю строку целиком
- **`vector<string>`** — список строк (дел)
