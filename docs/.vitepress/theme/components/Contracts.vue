<script setup>
import { computed } from 'vue';
import { withBase } from 'vitepress';
import { useSnapshot, useQuery } from '../lib/use-snapshot.js';
import { kinds, packageLink, usageLink, patternLink, filterContracts, filterPatterns, filterProviders, paginate, quantity } from '../lib/catalog.mjs';
const props = defineProps({ mode: { type: String, default: 'groups' } });
const { data, error, retry } = useSnapshot(['contracts', 'patterns', 'providers']);
const { state, update } = useQuery({ q: '', kind: '', scope: '', channel: '', owner: '', page: '1', key: '', pattern: '' });
const isDetail = computed(() => ['usage', 'pattern'].includes(props.mode));
const isPattern = computed(() => ['patterns', 'pattern'].includes(props.mode));
const title = computed(() => ({ groups: '연결은 계약에서 시작됩니다.', patterns: '이미 쓰이는 UI 패턴을 발견하세요.', providers: '계약을 제공하는 선언을 찾으세요.', usage: '계약의 실제 선언을 살펴보세요.', pattern: '패턴의 사용 사례를 살펴보세요.' })[props.mode]);
const description = computed(() => ({ groups: '모듈과 번들이 무엇을 요구하는지, 얼마나 함께 쓰이는지 살펴보세요.', patterns: '최신 UI 번들에 직접 선언된 expect를 기능 이름과 설명으로 탐색합니다.', providers: '수집한 최신 버전의 provide 선언 후보입니다. 실제 조립의 연결 결과는 로컬에서 확인하세요.', usage: '최신 등록 버전에서 이 계약 키를 직접 요구하는 패키지입니다.', pattern: '같은 이름을 사용하는 UI 번들의 선언입니다. 서로 다른 owner의 계약은 각각 보존합니다.' })[props.mode]);
const results = computed(() => {
  if (!data.value) return paginate([]);
  const items = props.mode === 'patterns' ? filterPatterns(data.value.patterns.items, state.value) : props.mode === 'providers' ? filterProviders(data.value.providers.items, state.value) : filterContracts(data.value.contracts.items, state.value);
  return paginate(items, state.value.page);
});
const selected = computed(() => !data.value ? null : props.mode === 'pattern' ? data.value.patterns.items.find((g) => g.scope === state.value.scope && g.pattern === state.value.pattern) : data.value.contracts.items.find((g) => g.contract.key === state.value.key && g.category === state.value.kind));
const links = [ ['groups', 'expect 집계', '/contracts/'], ['patterns', 'UI 기능 패턴', '/contracts/patterns/'], ['providers', '제공 선언 후보', '/contracts/providers/'] ];
</script>
<template>
  <div class="explorer-shell">
    <div v-if="error" class="state-panel" role="alert"><h2>데이터를 불러올 수 없습니다</h2><p>{{ error }}</p><button class="button primary" @click="retry">다시 시도</button></div>
    <div v-else-if="!data" class="state-panel" role="status">계약 카탈로그를 불러오는 중입니다.</div>
    <template v-else>
      <div class="dataset-note"><span class="sample-tag">SAMPLE CATALOG</span><span>Ghost 샘플 · {{ new Date(data.meta.generatedAt).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' }) }} 기준</span><a :href="withBase('/reference/contracts.html')">계약 문법 ↗</a></div>
      <div class="explorer-heading"><div><div class="eyebrow">{{ isPattern ? 'UI EXPECT PATTERNS' : 'CONTRACT EXPLORER' }}</div><h1>{{ title }}</h1><p>{{ description }}</p></div></div>
      <nav class="contract-nav" aria-label="계약 조회 메뉴"><a v-for="[mode, text, href] in links" :key="mode" :href="withBase(href)" :class="{ active: props.mode === mode || (props.mode === 'usage' && mode === 'groups') || (props.mode === 'pattern' && mode === 'patterns') }">{{ text }}</a></nav>
      <template v-if="!isDetail">
        <form class="search-toolbar" role="search" @submit.prevent><label class="search-field"><span class="search-symbol" aria-hidden="true">⌕</span><input :value="state.q" type="search" :aria-label="isPattern ? 'UI 패턴 검색' : '계약 검색'" :placeholder="isPattern ? '예: toolbar, navigation, 제목' : '계약 이름, 경로 또는 패키지로 검색'" @input="update({ q: $event.target.value, page: '1' })"></label><label v-if="isPattern" class="select-field"><span>Scope</span><select :value="state.scope" @change="update({ scope: $event.target.value, page: '1' })"><option value="">전체</option><option value="local">local</option><option value="api">api</option></select></label><label v-else class="select-field"><span>계열</span><select :value="state.kind" @change="update({ kind: $event.target.value, page: '1' })"><option value="">DB + UI 전체</option><option value="db">DB</option><option value="ui">UI</option><template v-if="props.mode === 'providers'"><option value="ui_module">UI 모듈</option><option value="ui_bundle">UI 번들</option></template></select></label></form>
        <div v-if="props.mode === 'providers'" class="provider-filters"><label>제공 채널<select :value="state.channel" @change="update({ channel: $event.target.value, page: '1' })"><option value="">전체 채널</option><option value="db">provide.db</option><option value="ui">provide.ui</option></select></label><label>명시 owner 또는 선언 패키지<input :value="state.owner" placeholder="예: @ghost/ui-blog-cms" @input="update({ owner: $event.target.value, page: '1' })"></label></div>
        <div class="info-strip"><span class="info-mark">i</span><p v-if="props.mode === 'groups'">사용 수는 최신 버전에서 직접 선언한 <strong>서로 다른 패키지 수</strong>입니다. 같은 이름도 owner가 다르면 별도 계약입니다.</p><p v-else-if="isPattern">동일 패턴의 선언 사례를 묶습니다. <strong>이름이 같아도 같은 계약이나 호환 구현을 뜻하지 않습니다.</strong></p><p v-else>이 목록은 등록된 제공 선언입니다. 그래프 도달 범위·수량·허용/거부를 반영한 <strong>조립 성공 판정은 포함하지 않습니다.</strong></p></div>
        <div class="results-heading" aria-live="polite"><span>검색 결과 <strong>{{ results.total }}</strong>개</span><span class="muted">{{ props.mode === 'providers' ? '최신 버전의 직접 제공 선언' : '최신 버전의 직접 요구 선언' }}</span></div>
        <div v-if="!results.items.length" class="state-panel"><h2>조건에 맞는 선언이 없습니다</h2><p>검색어를 바꾸거나 필터를 초기화하세요.</p><button class="text-button" @click="update({ q: '', kind: '', scope: '', owner: '', channel: '', page: '1' })">검색 초기화 →</button></div>
        <div v-else-if="props.mode === 'providers'" class="contract-grid"><article v-for="(p, i) in results.items" :key="i" class="contract-card"><div class="module-card-top"><span class="kind-badge" :class="p.kind">{{ kinds[p.kind] }}</span><span class="mini-tag">provide.{{ p.channel }}</span></div><h2><code>{{ p.contract.source }}</code></h2><p>{{ p.description }}</p><div class="contract-meta">scope {{ p.contract.scope }} · owner {{ p.contract.owner || p.name }}</div><a class="provider-link" :href="withBase(packageLink(p.name, p.version))">{{ p.name }} <span>↗</span></a></article></div>
        <div v-else class="contract-grid"><a v-for="g in results.items" :key="g.contract?.key || g.scope + g.pattern" :href="withBase(isPattern ? patternLink(g.pattern, g.scope) : usageLink(g.contract.key, g.category))" class="contract-card"><div class="module-card-top"><span v-if="!isPattern" class="kind-badge" :class="g.category + '_module'">{{ g.category.toUpperCase() }} 계약</span><span v-else class="kind-badge ui_bundle">UI 기능 패턴</span><span class="scope-badge">{{ g.contract?.scope || g.scope }}</span></div><h2><code>{{ g.contract?.path || g.pattern }}</code></h2><div class="contract-meta">{{ isPattern ? 'UI 번들의 직접 expect' : (g.contract.owner || '전역 API 계약') }}</div><div v-if="isPattern" class="pattern-example">{{ g.consumers[0]?.expect[0]?.description || g.consumers[0]?.description || '실제 선언 사례에서 사용 목적을 확인하세요.' }}</div><div class="contract-card-bottom"><span><strong>{{ g.usageCount }}</strong>개 {{ isPattern ? 'UI 번들' : '패키지' }}에서 사용</span><span>선언 사례 ↗</span></div></a></div>
        <nav v-if="results.pages > 1" class="pagination" aria-label="계약 결과 페이지"><button :disabled="results.page <= 1" @click="update({ page: String(results.page - 1) })">← 이전</button><span>{{ results.page }} / {{ results.pages }}</span><button :disabled="results.page >= results.pages" @click="update({ page: String(results.page + 1) })">다음 →</button></nav>
      </template>
      <template v-else-if="selected">
        <div class="selected-contract"><div><span class="mini-tag">{{ isPattern ? state.scope : state.kind.toUpperCase() }}</span><h2><code>{{ isPattern ? selected.pattern : selected.contract.key }}</code></h2><p>{{ selected.usageCount }}개 {{ isPattern ? 'UI 번들' : '패키지' }}의 최신 버전에서 직접 선언</p></div><a v-if="!isPattern" class="button secondary" :href="withBase('/contracts/providers/?q=' + encodeURIComponent(selected.contract.path))">제공 선언 후보 →</a></div>
        <article v-for="consumer in selected.consumers" :key="consumer.name" class="consumer-card"><div class="consumer-top"><div><span class="kind-badge" :class="consumer.kind">{{ kinds[consumer.kind] }}</span><h3><a :href="withBase(packageLink(consumer.name, consumer.version))">{{ consumer.name }} ↗</a></h3><p>{{ consumer.description }}</p></div><span class="version-label">v{{ consumer.version }}</span></div><div v-for="(e, i) in consumer.expect" :key="i" class="declaration-card"><div><code>{{ e.source }}</code><span class="mini-tag">{{ e.min === 0 ? '선택' : '필수' }} · {{ quantity(e.min, e.max) }}</span></div><p v-if="e.description">{{ e.description }}</p><small>scope {{ e.scope }} · owner {{ e.owner || '전역' }}</small></div></article>
        <p class="sample-caption">선언 사례는 이름·scope·owner·수량의 근거입니다. 실제 public export 구조와 호출 동작은 개별 구현에서 확인하세요.</p>
      </template>
      <div v-else class="state-panel"><h2>{{ props.mode === 'pattern' ? 'UI 패턴을 찾을 수 없습니다' : '계약 키를 찾을 수 없습니다' }}</h2><p>정확한 {{ props.mode === 'pattern' ? 'scope와 pattern' : 'kind와 key' }}를 지정하거나 목록에서 선택하세요.</p><a :href="withBase(isPattern ? '/contracts/patterns/' : '/contracts/')">목록으로 이동 →</a></div>
    </template>
  </div>
</template>
