export const rootUrl = new URL('../../', import.meta.url);
export const href = (path) => new URL(String(path).replace(/^\//, ''), rootUrl).href;
export const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const cache = new Map();
export async function loadJSON(name) {
  if (!/^[a-z-]+$/.test(name)) throw new Error('Invalid data file');
  if (!cache.has(name)) cache.set(name, fetch(href(`/data/${name}.json`)).then((response) => {
    if (!response.ok) throw new Error(`데이터 응답 오류 (${response.status})`);
    return response.json();
  }).catch((error) => { cache.delete(name); throw error; }));
  return cache.get(name);
}
export async function loadSnapshot(files) {
  const entries = await Promise.all(['meta', ...files].map(async (file) => [file, await loadJSON(file)]));
  const data = Object.fromEntries(entries);
  if (data.meta.schemaVersion !== 1 || !data.meta.complete || files.some((file) => !Array.isArray(data[file]?.items))) throw new Error('데이터 형식을 확인할 수 없습니다.');
  return data;
}
export function readQuery(defaults) {
  const params = new URLSearchParams(location.search);
  return Object.fromEntries(Object.entries(defaults).map(([key, value]) => [key, params.get(key) ?? value]));
}
export function writeQuery(state, defaults) {
  const params = new URLSearchParams(Object.entries(state).filter(([key, value]) => value !== '' && String(value) !== String(defaults[key])));
  history.replaceState(null, '', location.pathname + (params.size ? `?${params}` : '') + location.hash);
}
export function searchDocuments(items, query) {
  const text = String(query).normalize('NFC').toLocaleLowerCase().trim();
  if (!text) return [];
  const terms = text.split(/[\s,]+/).filter(Boolean);
  return items.map((item) => {
    const title = item.title.normalize('NFC').toLocaleLowerCase();
    const body = item.text.normalize('NFC').toLocaleLowerCase();
    const score = terms.reduce((n, term) => n + (title === term ? 10 : title.includes(term) ? 5 : body.includes(term) ? 1 : 0), 0);
    const index = body.indexOf(terms.find((term) => body.includes(term)) ?? '');
    return { ...item, score, snippet: item.text.slice(Math.max(0, index - 35), Math.max(0, index - 35) + 180) };
  }).filter((item) => item.score > 0).sort((a, b) => b.score - a.score || a.title.localeCompare(b.title)).slice(0, 30);
}
