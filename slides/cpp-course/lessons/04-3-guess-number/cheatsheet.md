---
marp: true
theme: worksheet
paginate: false
---

<div class="sheet-head">
<img class="bip-sheet" src="../../assets/bip-head.svg">
<div class="kicker">Шпаргалка · Урок 4.3</div>

# Игра «Угадай число» 🎯
</div>

## Случайное число

```cpp
#include <cstdlib>
#include <ctime>

srand(time(0));            // один раз в начале main
int secret = rand() % 100; // число 0–99
```

`% 100` оставляет остаток 0–99. Хочешь 0–9 — пиши `% 10`.

## break и continue

```cpp
break;     // полностью выйти из цикла
continue;  // пропустить шаг, цикл продолжится
```

```cpp
while (true) {        // выйти можно только через break
    std::cin >> guess;
    if (guess == secret) break;
}
```

## Игра целиком

```cpp
srand(time(0));
int secret = rand() % 100, guess;
while (true) {
    std::cin >> guess;
    if (guess < secret) std::cout << "Больше!\n";
    else if (guess > secret) std::cout << "Меньше!\n";
    else { std::cout << "Угадал!\n"; break; }
}
```

## Запомни ✅

- `srand(time(0))` — один раз в начале, иначе число всегда одно
- В `while (true)` обязательно нужен `break`
- `break` — стоп всему циклу, `continue` — пропуск шага
- Игра собрана из `while` + `if` + `cin` — всё уже знакомое

## Частые ошибки ⚠️

| Ошибка | Что будет |
|---|---|
| забыл `break` | игра не кончается ♾️ |
| забыл `srand` | число всегда одинаковое |
| перепутал `<` и `>` | подсказки «врут» |

## Словарик 📖

- **`rand()`** — выдаёт случайное число
- **`srand`** — «перемешивает» генератор по часам
- **`break`** — выйти из цикла
- **`continue`** — пропустить шаг цикла
