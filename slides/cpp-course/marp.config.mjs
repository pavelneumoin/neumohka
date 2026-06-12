// Marp-конфиг: эмодзи берём ЛОКАЛЬНО из @twemoji/svg, а не с CDN.
// Иначе Marp тянет каждую картинку эмодзи по сети, и при сбое сети
// в PDF появляются «битые картинки». Локальный путь = детерминированно и офлайн.
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
// Marp строит URL как `${base}svg/<код>.svg`, поэтому base указывает на папку @twemoji.
const base = pathToFileURL(join(here, 'node_modules', '@twemoji')).href + '/';

export default {
  allowLocalFiles: true,
  options: {
    emoji: {
      twemoji: { base, ext: 'svg' },
    },
  },
};
