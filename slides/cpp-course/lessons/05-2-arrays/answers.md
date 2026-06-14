---
marp: true
theme: worksheet
paginate: false
---

<div class="sheet-head">
<img class="bip-sheet" src="../../assets/bip-head.svg">
<div class="kicker">Ответы · Урок 5.2</div>

# Журнал оценок ✅
</div>

<div class="note"><strong>Версия для учителя.</strong> Готовые решения к рабочему листу 5.2. У учеников могут быть свои варианты — это нормально.</div>

## 1 · Что делает команда

<div class="solution"><strong>std::vector&lt;int&gt; v;</strong> — Б (создаёт пустой список чисел). <strong>v.push_back(5);</strong> — А (добавляет число в конец). <strong>v.size()</strong> — Г (сколько элементов в списке). <strong>v[0]</strong> — В (берёт элемент по номеру).</div>

## 2 · Что выведет программа

```text
2 8
```

<div class="solution">В списке два элемента, поэтому <strong>v.size()</strong> равно 2. Элемент <strong>v[1]</strong> — это второй элемент, то есть 8.</div>

## 3 · Журнал сломался — почини его

```cpp
std::vector<int> ocenki;
ocenki.push_back(5);
std::cout << ocenki[0];   // оценка в журнале только одна
```

<div class="solution">Что было не так: у <strong>push_back</strong> аргумент пишется в скобках — push_back(5). И оценка одна, значит её номер 0, поэтому нужно <strong>ocenki[0]</strong>, а не ocenki[1].</div>

## 4 · Заводим журнал

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> ocenki;
    ocenki.push_back(5);
    ocenki.push_back(4);
    ocenki.push_back(5);
    std::cout << ocenki.size();
}
```

<div class="solution">В журнале три оценки, поэтому программа выведет 3.</div>

## 5 · Печатаем все оценки

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> ocenki;
    ocenki.push_back(5);
    ocenki.push_back(4);
    ocenki.push_back(5);
    for (int i = 0; i < ocenki.size(); i++) {
        std::cout << ocenki[i] << " ";
    }
}
```

<div class="solution">Программа выведет 5 4 5.</div>

## 6 · Средний балл класса ★

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> ocenki;
    ocenki.push_back(5);
    ocenki.push_back(4);
    ocenki.push_back(5);

    int summa = 0;
    for (int i = 0; i < ocenki.size(); i++) {
        summa += ocenki[i];
    }
    double srednee = (double)summa / ocenki.size();
    std::cout << srednee;
}
```

<div class="solution">Сумма 14, делим на 3 — получаем примерно 4.66667. Деление на (double) нужно, чтобы остался дробный результат, а не целый.</div>
