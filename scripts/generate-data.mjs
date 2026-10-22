import { mkdtemp, mkdir, rename, rm, readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve, join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';

// Source is only needed for regeneration. Site builds use the committed snapshot.
const source = resolve(process.argv[2] ?? '../logic-runtime-workspace');
const root = resolve(import.meta.dirname, '..');
const load = (file) => import(pathToFileURL(join(source, file)).href);
const [{ createDb }, { readGhostCatalog, seedGhostCatalog }, { buildApp }, { loadConfig }] = await Promise.all([
  load('packages/logic-server/src/db/client.js'),
  load('packages/logic-server/scripts/lib/ghost-catalog-store.js'),
  load('packages/logic-server/src/app.js'),
  load('packages/logic-server/src/config.js')
]);
const sourceRef = execFileSync('git', ['-C', source, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const sourceDirty = Boolean(execFileSync('git', ['-C', source, 'status', '--porcelain', '--', 'packages/logic-server/ghost', 'packages/logic-server/src'], { encoding: 'utf8' }).trim());
const sourceRepo = 'https://github.com/white-base/logic-runtime-workspace';
const { db } = createDb(':memory:');
let app;
try {
  const catalog = readGhostCatalog();
  await seedGhostCatalog(db, { catalog });
  app = await buildApp({ db, config: loadConfig({ LOGIC_SERVER_DOCS: 'false', LOGIC_SERVER_LOG_LEVEL: 'silent' }) });
  async function get(path, params = {}) {
    const result = await app.inject({ method: 'GET', url: `${path}?${new URLSearchParams(params)}` });
    const body = result.json();
    if (result.statusCode !== 200 || !body.ok) throw new Error(`${path}: ${JSON.stringify(body.error)}`);
    return body.data;
  }
  async function all(path, params = {}) {
    const items = [];
    for (let page = 1; ; page++) {
      const result = await get(path, { ...params, page, limit: 100 });
      items.push(...result.items);
      if (page >= result.pageCount) {
        if (items.length !== result.total) throw new Error(`Incomplete collection: ${path}`);
        return items;
      }
    }
  }
  const summaries = await all('/v1/packages');
  const packages = [];
  const providers = [];
  for (const summary of summaries) {
    const endpoint = `/v1/packages/${encodeURIComponent(summary.name)}`;
    const info = await get(endpoint);
    const versions = [];
    for (const { version } of info.versions) {
      const detail = await get(`${endpoint}/versions/${encodeURIComponent(version)}`);
      // Keep only public package metadata, never account or administrative records.
      const { name, kind, family, namespace, engine, type, domain, impl, render, instance, description, keywords, manifest, expect, provide, tables } = detail;
      versions.push({ name, version, kind, family, namespace, engine, type, domain, impl, render, instance, description, keywords, manifest, expect, provide, tables,
        deps: detail.deps.map(({ edgeType, channel, pkg, kind, range, alias, owner, path, instanceId, resolved }) => ({ edgeType, channel, pkg, kind, range, alias, owner, path, instanceId, resolvedVersion: resolved?.version ?? null }))
      });
      if (version === summary.latestVersion) for (const declaration of provide) providers.push({ name, version, kind, description, ...declaration });
    }
    const catalogEntry = catalog.find((item) => item.pkg.name === summary.name);
    const sourcePath = relative(source, catalogEntry.dir).split('\\').join('/');
    packages.push({ name: summary.name, latestVersion: summary.latestVersion, kind: summary.kind, family: summary.family, namespace: summary.namespace, domain: summary.domain,
      description: summary.description, keywords: summary.keywords, tables: summary.tables, versions,
      sourceUrl: `${sourceRepo}/tree/${sourceRef}/${sourcePath}`, sample: true });
  }
  const contracts = await all('/v1/contracts/expects');
  for (const group of contracts) group.consumers = await all('/v1/contracts/expects/consumers', { kind: group.category, key: group.contract.key });
  const patternKeys = new Map();
  for (const pkg of packages.filter((pkg) => pkg.kind === 'ui_bundle')) {
    for (const declaration of pkg.versions.find((v) => v.version === pkg.latestVersion).expect) {
      const { scope, path, wildcard } = declaration.contract;
      const pattern = path + (wildcard ? (declaration.contract.source.endsWith('.**') ? '.**' : '.*') : '');
      patternKeys.set(JSON.stringify([scope, pattern]), { scope, pattern });
    }
  }
  const patterns = [];
  for (const { scope, pattern } of patternKeys.values()) {
    const groups = await all('/v1/contracts/expect-patterns', { kind: 'ui_bundle', scope, pattern });
    for (const group of groups) {
      group.consumers = await all('/v1/contracts/expect-patterns/consumers', { kind: 'ui_bundle', scope, pattern });
      patterns.push(group);
    }
  }
  patterns.sort((a, b) => b.usageCount - a.usageCount || a.pattern.localeCompare(b.pattern));
  const meta = { schemaVersion: 1, generatedAt: new Date().toISOString(), sourceRepo, sourceRef, sourceDirty,
    dataset: 'ghost', isSample: true, complete: true, scope: 'All non-private Ghost packages and their registered versions; direct latest-version expect declarations.',
    counts: { packages: packages.length, versions: packages.reduce((n, p) => n + p.versions.length, 0), contracts: contracts.length, patterns: patterns.length, providers: providers.length } };
  const output = join(root, 'docs/data');
  const temporary = await mkdtemp(join(root, '.snapshot-'));
  try {
    for (const [file, value] of Object.entries({ meta, packages: { items: packages }, contracts: { items: contracts }, patterns: { items: patterns }, providers: { items: providers } })) {
      await writeFile(join(temporary, `${file}.json`), `${JSON.stringify(value, null, 2)}\n`);
    }
    // The document index is managed from HTML, independently from registry data.
    try { await writeFile(join(temporary, 'search-index.json'), await readFile(join(output, 'search-index.json'))); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
    const { validateSnapshot } = await import('./validate-data.mjs');
    await validateSnapshot(temporary);
    await mkdir(resolve(output, '..'), { recursive: true });
    const backup = `${temporary}-previous`;
    let hadPrevious = false;
    try { await rename(output, backup); hadPrevious = true; }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
    try { await rename(temporary, output); }
    catch (error) {
      if (hadPrevious) await rename(backup, output);
      throw error;
    }
    await rm(backup, { recursive: true, force: true });
  } finally { await rm(temporary, { recursive: true, force: true }); }
  console.log(`Generated Ghost snapshot: ${packages.length} packages, ${contracts.length} contract groups, ${patterns.length} UI patterns. Source ${sourceRef.slice(0, 8)}.`);
} finally {
  await app?.close();
  await db.destroy();
}
