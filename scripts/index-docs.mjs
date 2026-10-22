import { readFile, writeFile, readdir } from 'node:fs/promises';
import { resolve, relative } from 'node:path';

const root = resolve(import.meta.dirname, '../docs');
async function files(directory) {
  const output = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) output.push(...await files(path));
    else if (entry.name.endsWith('.html')) output.push(path);
  }
  return output;
}
const decode = (text) => text.replace(/&(#\d+|#x[a-f0-9]+|amp|lt|gt|quot|apos|nbsp);/gi, (full, value) => {
  if (value.startsWith('#x')) return String.fromCodePoint(parseInt(value.slice(2), 16));
  if (value.startsWith('#')) return String.fromCodePoint(Number(value.slice(1)));
  return ({ amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' })[value] ?? full;
});
const textOf = (html) => decode(html.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim().normalize('NFC');
const items = [];
for (const path of await files(root)) {
  const html = await readFile(path, 'utf8');
  const article = html.match(/<article\b[^>]*class="doc-article"[^>]*>([\s\S]*?)<\/article>/)?.[1];
  if (!article) continue;
  const title = textOf(html.match(/<title>(.*?)<\/title>/s)?.[1] ?? '').replace(/ · Logic$/, '');
  items.push({ path: '/' + relative(root, path).split('\\').join('/'), title, text: textOf(article) });
}
items.sort((a, b) => a.path.localeCompare(b.path));
await writeFile(resolve(root, 'data/search-index.json'), JSON.stringify({ items }, null, 2) + '\n');
console.log(`Indexed ${items.length} static HTML documents.`);
