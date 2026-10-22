import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export async function validateSnapshot(directory = resolve(import.meta.dirname, '../docs/public/data')) {
  const read = async (name) => JSON.parse(await readFile(resolve(directory, `${name}.json`), 'utf8'));
  const [meta, { items: packages }, { items: contracts }, { items: patterns }, { items: providers }] = await Promise.all(['meta', 'packages', 'contracts', 'patterns', 'providers'].map(read));
  assert.equal(meta.schemaVersion, 1);
  assert.equal(meta.complete, true);
  assert.ok(Number.isFinite(Date.parse(meta.generatedAt)));
  const byName = new Map(packages.map((pkg) => [pkg.name, pkg]));
  assert.equal(byName.size, packages.length, 'Duplicate packages');
  assert.ok(packages.length > 0, 'Empty package snapshot');
  const validKinds = ['db_module', 'db_bundle', 'ui_module', 'ui_bundle'];
  for (const pkg of packages) {
    assert.ok(validKinds.includes(pkg.kind));
    assert.ok(pkg.versions.some((v) => v.version === pkg.latestVersion));
    assert.equal(new Set(pkg.versions.map((v) => v.version)).size, pkg.versions.length);
    for (const version of pkg.versions) {
      assert.equal(version.name, pkg.name);
      assert.equal(version.kind, pkg.kind);
      for (const dep of version.deps.filter((dep) => dep.pkg)) {
        assert.ok(byName.has(dep.pkg), `Missing dependency ${dep.pkg}`);
        if (dep.resolvedVersion) assert.ok(byName.get(dep.pkg).versions.some((v) => v.version === dep.resolvedVersion));
      }
    }
  }
  for (const group of [...contracts, ...patterns]) {
    assert.equal(group.usageCount, new Set(group.consumers.map((c) => c.name)).size, 'Usage count must count distinct packages');
    for (const consumer of group.consumers) {
      assert.equal(consumer.version, byName.get(consumer.name)?.latestVersion);
      if (group.contract) {
        assert.ok(consumer.expect.every((e) => e.key === group.contract.key));
        assert.ok(consumer.kind.startsWith(group.category));
      } else {
        assert.equal(consumer.kind, 'ui_bundle');
        assert.ok(consumer.expect.every((e) => e.scope === group.scope && e.path === group.pattern));
      }
    }
    if (group.contract) assert.equal(group.moduleCount + group.bundleCount, group.usageCount);
  }
  assert.equal(new Set(contracts.map((g) => `${g.category}:${g.contract.key}`)).size, contracts.length);
  assert.equal(new Set(patterns.map((g) => `${g.scope}:${g.pattern}`)).size, patterns.length);
  for (const p of providers) assert.equal(p.version, byName.get(p.name)?.latestVersion);
  assert.deepEqual(meta.counts, { packages: packages.length, versions: packages.reduce((n, p) => n + p.versions.length, 0), contracts: contracts.length, patterns: patterns.length, providers: providers.length });
  return meta.counts;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  console.log('Snapshot validation passed:', await validateSnapshot());
}
