// Таблица версий файлов из public: путь -> восемь знаков от хеша содержимого.
//
// Запускается сам перед dev и сборкой (predev, prebuild в package.json).
// Результат - content/assetVersions.ts, его читает lib/assets.ts. Править
// таблицу руками незачем: она целиком выводится из файлов.
//
// Зачем версия вообще нужна - в комментарии lib/assets.ts.

import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.join(import.meta.dirname, '..');
const publicDir = path.join(root, 'public');
const target = path.join(root, 'content', 'assetVersions.ts');

// Версия нужна тому, что показывается на странице и может смениться под тем же
// именем. Шрифты и прочее Next раздает сам с хешем в имени.
const tracked = new Set(['.webp', '.avif', '.png', '.jpg', '.jpeg', '.svg', '.gif', '.ico', '.mp4']);

/** Пути всех отслеживаемых файлов в виде, в каком их просит браузер. */
async function collect(dir, prefix = '') {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const url = `${prefix}/${entry.name}`;
    if (entry.isDirectory()) {
      found.push(...(await collect(full, url)));
    } else if (tracked.has(path.extname(entry.name).toLowerCase())) {
      found.push([url, full]);
    }
  }
  return found;
}

const files = (await collect(publicDir)).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));

const rows = [];
for (const [url, full] of files) {
  const hash = createHash('sha1').update(await readFile(full)).digest('hex').slice(0, 8);
  rows.push(`  '${url}': '${hash}',`);
}

const body = [
  '/** Версии файлов из public: путь -> хеш содержимого.',
  ' *',
  ' *  Файл собирает scripts/assetVersions.mjs перед dev и сборкой. Руками не',
  ' *  править: любая правка пропадет при следующем запуске. */',
  'export const assetVersions: Record<string, string> = {',
  ...rows,
  '};',
  '',
].join('\n');

// Перезапись без изменений дергала бы горячую перезагрузку на каждом запуске.
const before = await readFile(target, 'utf8').catch(() => '');
if (before === body) {
  console.log(`assetVersions: без изменений, файлов ${rows.length}`);
} else {
  await writeFile(target, body, 'utf8');
  console.log(`assetVersions: обновлено, файлов ${rows.length}`);
}
