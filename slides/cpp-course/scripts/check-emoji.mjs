// Страж эмодзи: проверяет, что для каждого эмодзи во всех .md есть локальный
// SVG в @twemoji/svg. Иначе Marp потянет картинку с CDN и в PDF будет «битая».
// Запуск: node scripts/check-emoji.mjs   (выходит с кодом 1, если что-то не так)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const svgDir = path.join(root, 'node_modules', '@twemoji', 'svg');

const walk = (d) =>
  fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory()
      ? e.name === 'node_modules'
        ? []
        : walk(path.join(d, e.name))
      : e.name.endsWith('.md')
        ? [path.join(d, e.name)]
        : [],
  );

const emojiRe = /(\p{Extended_Pictographic})/gu;
const missing = new Map();
let okCount = 0;

for (const f of walk(root)) {
  for (const m of fs.readFileSync(f, 'utf8').matchAll(emojiRe)) {
    const cps = [...m[1]].map((c) => c.codePointAt(0)).filter((c) => c !== 0xfe0f);
    const name = cps.map((c) => c.toString(16)).join('-');
    if (fs.existsSync(path.join(svgDir, `${name}.svg`))) okCount++;
    else (missing.get(m[1]) ?? missing.set(m[1], new Set()).get(m[1])).add(path.relative(root, f));
  }
}

if (missing.size === 0) {
  console.log(`✅ Эмодзи: ${okCount} вхождений, у всех есть локальный SVG.`);
} else {
  console.error('❌ Нет локального SVG для эмодзи (в PDF будет «битая картинка»):');
  for (const [ch, files] of missing) console.error(`   ${ch} → ${[...files].join(', ')}`);
  process.exit(1);
}
