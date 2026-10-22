import { ref, onMounted, onBeforeUnmount } from 'vue';
import { withBase } from 'vitepress';

const cache = new Map();
export function useSnapshot(files) {
  const data = ref(null), error = ref('');
  let active = true;
  async function fetchData() {
    error.value = '';
    try {
      const entries = await Promise.all(['meta', ...files].map(async (name) => {
        if (!cache.has(name)) cache.set(name, fetch(withBase(`/data/${name}.json`)).then((r) => {
          if (!r.ok) throw new Error(`데이터 응답 오류 (${r.status})`);
          return r.json();
        }).catch((e) => { cache.delete(name); throw e; }));
        return [name, await cache.get(name)];
      }));
      const result = Object.fromEntries(entries);
      if (result.meta.schemaVersion !== 1 || !result.meta.complete || files.some((name) => !Array.isArray(result[name]?.items))) throw new Error('데이터 형식을 확인할 수 없습니다.');
      if (active) data.value = result;
    } catch (e) { if (active) error.value = `카탈로그를 불러오지 못했습니다. ${e.message}`; }
  }
  onMounted(fetchData);
  onBeforeUnmount(() => { active = false; });
  return { data, error, retry: fetchData };
}

export function useQuery(defaults) {
  const state = ref({ ...defaults });
  function sync() {
    const params = new URLSearchParams(window.location.search);
    state.value = Object.fromEntries(Object.entries(defaults).map(([key, value]) => [key, params.get(key) ?? value]));
  }
  onMounted(() => { sync(); window.addEventListener('popstate', sync); window.addEventListener('logic:navigate', sync); });
  onBeforeUnmount(() => { window.removeEventListener('popstate', sync); window.removeEventListener('logic:navigate', sync); });
  function update(patch) {
    const next = { ...state.value, ...patch };
    state.value = next;
    const params = new URLSearchParams(Object.entries(next).filter(([key, value]) => value !== '' && String(value) !== String(defaults[key])));
    const url = window.location.pathname + (params.size ? `?${params}` : '') + window.location.hash;
    window.history.replaceState({}, '', url);
  }
  return { state, update };
}
