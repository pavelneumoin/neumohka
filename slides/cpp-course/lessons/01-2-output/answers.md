---
marp: true
theme: worksheet
paginate: false
---

<div class="sheet-head">
<img class="bip-sheet" src="../../assets/bip-head.svg">
<div class="kicker">Ответы · Урок 1.2</div>

# Рисуем вывески ✅
</div>

<div class="note"><strong>Версия для учителя.</strong> Готовые решения к рабочему листу 1.2. У учеников могут быть свои варианты — это нормально.</div>

## 1 · Что увидит прохожий

```text
ПИЦЦЕРИЯ
Открыто!
Заходи
```

<div class="solution">После слова <strong>Заходи</strong> нет <strong>\n</strong>, поэтому переноса в конце не будет — курсор останется в той же строке.</div>

## 2 · Расставь переносы

```cpp
std::cout << "Ракета\n";
std::cout << "Старт\n";
std::cout << "Готов\n";
```

<div class="solution">Можно и одной командой: std::cout &lt;&lt; "Ракета\nСтарт\nГотов\n"; — результат тот же.</div>

## 3 · Секретные символы

| Символ | Что делает |
|---|---|
| `\n` | переносит текст на новую строку |
| `\t` | делает отступ (табуляцию) |
| `\\` | печатает одну обратную косую черту `\` |

## 4 · Вывеска кафе

```cpp
#include <iostream>

int main() {
    std::cout << "********************\n";
    std::cout << "Кафе \"Робот\"\n";
    std::cout << "Открыто с утра!\n";
    std::cout << "********************\n";
    return 0;
}
```

## 5 · Лесенка из звёздочек

```cpp
#include <iostream>

int main() {
    std::cout << "*\n";
    std::cout << "**\n";
    std::cout << "***\n";
    std::cout << "****\n";
    return 0;
}
```

## 6 · Нарисуй ракету ★

```cpp
#include <iostream>

int main() {
    std::cout << "  /\\\n";
    std::cout << " /  \\\n";
    std::cout << "|    |\n";
    std::cout << "|    |\n";
    std::cout << " /\\/\\\n";
    return 0;
}
```

<div class="solution">Чтобы напечатать обратную косую черту в рисунке, нужно писать её дважды — <strong>\\</strong>. Любой аккуратный рисунок из символов засчитывается.</div>
