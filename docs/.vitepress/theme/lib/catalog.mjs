export const kinds = { db_module: 'DB 모듈', db_bundle: 'DB 번들', ui_module: 'UI 모듈', ui_bundle: 'UI 번들' };
export const domains = { blog: '블로그', commerce: '커머스', erp: 'ERP', 'assembly-demo': '조립 데모' };
export const categoryOf = (kind) => kind.startsWith('db_') ? 'db' : 'ui';
export const shortName = (name) => name.replace(/^@[^/]+\//, '');
export const queryLink = (path, values = {}) => {
  const params = new URLSearchParams(Object.entries(values).filter(([, value]) => value !== '' && value != null));
  return `${path}${params.size ? `?${params}` : ''}`;
};
export const packageLink = (name, version, from) => queryLink('/catalog/package/', { name, version, from });
export const usageLink = (key, kind) => queryLink('/contracts/usage/', { key, kind });
export const patternLink = (pattern, scope) => queryLink('/contracts/pattern/', { scope, pattern });
export function hasKind(actual, filter) { return !filter || actual === filter || categoryOf(actual) === filter; }
export const terms = (q) => String(q ?? '').toLocaleLowerCase().split(',').map((v) => v.trim()).filter(Boolean);
export function includesTerms(values, q) {
  const search = values.flat(Infinity).filter((v) => v != null).join(' ').toLocaleLowerCase();
  return !terms(q).length || terms(q).some((part) => search.includes(part));
}
export function filterPackages(items, { q = '', kind = '', domain = '' } = {}) {
  return items.filter((pkg) => hasKind(pkg.kind, kind) && (!domain || pkg.domain === domain) && includesTerms([
    pkg.name, pkg.family, pkg.namespace, pkg.description, pkg.keywords, pkg.domain,
    pkg.versions.find((v) => v.version === pkg.latestVersion)?.expect.map((e) => e.contract.source),
    pkg.versions.find((v) => v.version === pkg.latestVersion)?.provide.map((e) => e.contract.source)
  ], q)).sort((a, b) => a.name.localeCompare(b.name));
}
export function filterContracts(items, { q = '', kind = '' } = {}) {
  return items.filter((g) => (!kind || g.category === kind) && includesTerms([g.contract.key, g.contract.path, g.contract.owner], q));
}
export function filterPatterns(items, { q = '', scope = '' } = {}) {
  return items.filter((g) => (!scope || g.scope === scope) && includesTerms([g.pattern, g.consumers.map((c) => [c.name, c.description, c.expect.map((e) => [e.source, e.description])])], q));
}
export function filterProviders(items, { q = '', kind = '', owner = '', channel = '' } = {}) {
  return items.filter((p) => hasKind(p.kind, kind) && (!channel || p.channel === channel) && (!owner || (p.contract.owner ?? p.name) === owner) && includesTerms([p.contract.source, p.contract.path, p.name, p.description], q));
}
export function paginate(items, page = 1, size = 12) {
  const pages = Math.max(1, Math.ceil(items.length / size));
  const parsed = Number(page);
  const current = Number.isSafeInteger(parsed) && parsed > 0 ? parsed : 1;
  return { items: items.slice((current - 1) * size, current * size), page: current, pages, total: items.length };
}
export function quantity(min, max) {
  return `${min}..${max == null ? '∞' : max}`;
}
