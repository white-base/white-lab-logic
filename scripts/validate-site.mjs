import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, relative } from 'node:path';

const root = resolve(import.meta.dirname, '../docs');
async function htmlFiles(directory) {
  const output = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) output.push(...await htmlFiles(path));
    else if (entry.name.endsWith('.html')) output.push(path);
  }
  return output;
}
const pages = await htmlFiles(root);
assert.ok(pages.includes(resolve(root, 'index.html')), 'docs/index.html must exist');
assert.equal((await readFile(resolve(root, 'CNAME'), 'utf8')).trim(), 'logic.bindmodel.com');
assert.ok((await stat(resolve(root, '.nojekyll'))).isFile());
const problems = [];
let localLinks = 0;
for (const page of pages) {
  const html = await readFile(page, 'utf8');
  const path = relative(root, page).split('\\').join('/');
  assert.match(html, /<!doctype html>/i, `Missing HTML doctype: ${path}`);
  assert.match(html, /<html lang="ko">/, `Missing language: ${path}`);
  assert.match(html, /<meta name="viewport"/, `Missing viewport: ${path}`);
  assert.doesNotMatch(html, /(?:vitepress|@vite|<LogicHome|<ModuleCatalog|<ContractCatalog|data-v-[a-z0-9]+|\.vue(?:["'?<\s]))/i, `Framework markup remains: ${path}`);
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const value = match[1].replaceAll('&amp;', '&');
    if (/^(?:https?:|mailto:|#)/.test(value)) continue;
    const url = new URL(value, `https://example.test/${path}`);
    let target = decodeURIComponent(url.pathname).slice(1);
    if (!target || target.endsWith('/')) target += 'index.html';
    try { assert.ok((await stat(resolve(root, target))).isFile()); localLinks++; }
    catch { problems.push(`${path}: ${value}`); }
  }
}
assert.deepEqual(problems, [], 'Broken HTML links or assets');
const { items } = JSON.parse(await readFile(resolve(root, 'data/search-index.json'), 'utf8'));
assert.equal(new Set(items.map((item) => item.path)).size, items.length, 'Duplicate search paths');
for (const item of items) {
  assert.ok(pages.includes(resolve(root, item.path.slice(1))), `Unknown indexed page: ${item.path}`);
  assert.ok(item.title && item.text, 'Empty indexed document');
}
const articleCount = (await Promise.all(pages.map(async (page) => (await readFile(page, 'utf8')).includes('<article class="doc-article">')))).filter(Boolean).length;
assert.equal(items.length, articleCount, 'Search index does not cover the HTML documents');
console.log(`Static HTML validation passed: ${pages.length} pages, ${localLinks} local links/assets, ${items.length} indexed documents.`);
