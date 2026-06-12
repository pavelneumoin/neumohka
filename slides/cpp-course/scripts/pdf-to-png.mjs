// Рендер страниц PDF в PNG движком pdf.js (Firefox) — для PDF-точной визуальной проверки.
// Использование: node scripts/pdf-to-png.mjs <file.pdf> [pages] [scale]
//   pages: "12" | "3,12" | "all" (по умолчанию all), scale по умолчанию 1.5
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { createCanvas } from '@napi-rs/canvas';
import { readFileSync, writeFileSync } from 'node:fs';
import { basename } from 'node:path';

const [file, pagesArg = 'all', scaleArg = '1.5'] = process.argv.slice(2);
if (!file) { console.error('usage: node scripts/pdf-to-png.mjs <file.pdf> [pages] [scale]'); process.exit(1); }
const scale = parseFloat(scaleArg);
const data = new Uint8Array(readFileSync(file));
const doc = await getDocument({ data, disableFontFace: false }).promise;
const want = pagesArg === 'all'
  ? [...Array(doc.numPages)].map((_, i) => i + 1)
  : pagesArg.split(',').map(n => parseInt(n, 10));
const stem = basename(file).replace(/\.pdf$/i, '');
for (const p of want) {
  const page = await doc.getPage(p);
  const vp = page.getViewport({ scale });
  const canvas = createCanvas(Math.ceil(vp.width), Math.ceil(vp.height));
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: ctx, viewport: vp, canvasFactory: {
    create: (w, h) => { const c = createCanvas(w, h); return { canvas: c, context: c.getContext('2d') }; },
    reset: (c, w, h) => { c.canvas.width = w; c.canvas.height = h; },
    destroy: (c) => { c.canvas.width = 0; c.canvas.height = 0; },
  }}).promise;
  const out = `${stem}.pdfjs.${String(p).padStart(3, '0')}.png`;
  writeFileSync(out, canvas.toBuffer('image/png'));
  console.log('wrote', out);
}
