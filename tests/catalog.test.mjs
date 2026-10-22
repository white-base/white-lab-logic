import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { filterPackages, filterPatterns, filterProviders, filterContracts, packageLink, patternLink, usageLink, paginate } from '../docs/assets/js/catalog.mjs';
import { searchDocuments, escapeHTML } from '../docs/assets/js/shared.mjs';
import { validateSnapshot } from '../scripts/validate-data.mjs';
const read = async (file) => JSON.parse(await readFile(new URL(`../docs/data/${file}.json`, import.meta.url), 'utf8')).items;
const [packages, contracts, patterns, providers] = await Promise.all(['packages', 'contracts', 'patterns', 'providers'].map(read));

test('snapshot references, exact owner keys and counts agree with collected API declarations', async () => {
  const counts = await validateSnapshot();
  assert.ok(counts.packages > 0 && counts.contracts > 0 && counts.patterns > 0);
});
test('Korean search and DB/UI/kind/domain filters combine without dropping matching records', () => {
  const matches = filterPackages(packages, { q: '블로그', kind: 'ui', domain: 'blog' });
  assert.ok(matches.some((p) => p.name === '@ghost/ui-blog-cms'));
  assert.ok(matches.every((p) => p.kind.startsWith('ui_') && p.domain === 'blog'));
  assert.equal(filterPackages(packages, { kind: 'db_module' }).some((p) => p.kind !== 'db_module'), false);
  assert.equal(filterPackages(packages, { q: 'nonexistent-조회-模块-9876' }).length, 0);
  assert.deepEqual(filterPackages(packages).map((p) => p.name), packages.map((p) => p.name).sort((a, b) => a.localeCompare(b)));
});
test('exact contract groups keep owner identity while UI patterns can collect multiple owners', () => {
  const local = contracts.filter((g) => g.contract.scope === 'local');
  assert.ok(local.length);
  assert.ok(local.every((g) => g.contract.owner && g.consumers.every((c) => c.expect.every((e) => e.key === g.contract.key))));
  assert.ok(filterContracts(contracts, { kind: 'db' }).every((g) => g.category === 'db'));
  const multi = patterns.find((g) => new Set(g.consumers.flatMap((c) => c.expect.map((e) => e.owner))).size > 1);
  assert.ok(multi, 'Snapshot should demonstrate repeated UI names with distinct owners');
  assert.ok(filterPatterns(patterns, { q: multi.pattern, scope: multi.scope }).includes(multi));
});
test('provider query is a declaration search and owner/channel filters stay independent', () => {
  const p = providers.find((p) => p.contract.scope === 'local');
  assert.ok(p);
  const matches = filterProviders(providers, { owner: p.contract.owner ?? p.name, channel: p.channel, q: p.contract.path });
  assert.ok(matches.includes(p));
  assert.ok(matches.every((candidate) => candidate.channel === p.channel && (candidate.contract.owner ?? candidate.name) === (p.contract.owner ?? p.name)));
});
test('deep links preserve scoped package names, owner delimiters, Unicode and exact version', () => {
  for (const link of [packageLink('@scope/한글-name', '1.2.3'), patternLink('page.title', 'local'), usageLink('pkg:@scope/a#page.title', 'ui')]) {
    const url = new URL(link, 'https://logic.bindmodel.com');
    assert.ok(url.pathname.endsWith('/'));
  }
  const url = new URL(packageLink('@scope/한글-name', '1.2.3'), 'https://logic.bindmodel.com');
  assert.equal(url.searchParams.get('name'), '@scope/한글-name');
  assert.equal(url.searchParams.get('version'), '1.2.3');
  assert.equal(new URL(packageLink('@scope/a', '1.0.0', '/catalog/?q=블로그&kind=ui'), url).searchParams.get('from'), '/catalog/?q=블로그&kind=ui');
  assert.equal(new URL(usageLink('pkg:@scope/a#page.title', 'ui'), url).searchParams.get('key'), 'pkg:@scope/a#page.title');
});
test('invalid and out-of-range pages cannot silently masquerade as another page', () => {
  assert.equal(paginate(packages, 'NaN').page, 1);
  assert.equal(paginate(packages, '-2').page, 1);
  assert.equal(paginate(packages, 999).items.length, 0);
  const first = paginate(packages, 1), second = paginate(packages, 2);
  assert.ok(first.items.every((p) => !second.items.includes(p)));
});

test('static document search finds Korean headings and commands without indexing planning files', async () => {
  const items = await read('search-index');
  assert.ok(searchDocuments(items, '교체').some((item) => item.path === '/guide/replacement.html'));
  assert.ok(searchDocuments(items, 'logic validate').some((item) => item.path === '/guide/validation.html'));
  assert.ok(items.every((item) => item.path.endsWith('.html') && !item.path.includes('site-plan')));
  assert.equal(searchDocuments(items, '不存在的完全없는문자987654321').length, 0);
});
test('HTML rendering escapes package metadata and user-entered markup', () => {
  assert.equal(escapeHTML('<img src=x onerror="alert(1)"> & \'quoted\''), '&lt;img src=x onerror=&quot;alert(1)&quot;&gt; &amp; &#39;quoted&#39;');
});
