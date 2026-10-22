<script setup>
import { computed, ref } from 'vue';
import { withBase } from 'vitepress';
import { useSnapshot, useQuery } from '../lib/use-snapshot.js';
import { kinds, domains, shortName, packageLink, queryLink, usageLink, categoryOf, filterPackages, paginate, quantity } from '../lib/catalog.mjs';
const props = defineProps({ detail: Boolean });
const { data, error, retry } = useSnapshot(['packages', 'contracts']);
const { state, update } = useQuery({ q: '', kind: '', domain: '', page: '1', name: '', version: '', from: '' });
const draft = computed({ get: () => state.value.q, set: (q) => update({ q, page: '1' }) });
const results = computed(() => paginate(filterPackages(data.value?.packages.items ?? [], state.value), state.value.page));
const selected = computed(() => data.value?.packages.items.find((p) => p.name === state.value.name));
const version = computed(() => selected.value?.versions.find((v) => v.version === (!state.value.version || state.value.version === 'latest' ? selected.value.latestVersion : state.value.version)));
const tab = ref('overview');
const tabs = [['overview', '개요'], ['contracts', '계약'], ['dependencies', '의존 관계'], ['tables', '테이블'], ['manifest', 'Manifest']];
const dependents = computed(() => data.value?.packages.items.flatMap((p) => p.versions.filter((v) => v.version === p.latestVersion).flatMap((v) => v.deps.filter((d) => d.pkg === selected.value?.name).map((d) => ({ name: p.name, version: v.version, ...d })))) ?? []);
const domainOptions = computed(() => [...new Set((data.value?.packages.items ?? []).map((p) => p.domain).filter(Boolean))].sort());
const tableItems = computed(() => selected.value?.latestVersion === version.value?.version ? selected.value.tables : version.value?.tables ?? []);
const listUrl = computed(() => queryLink('/catalog/', { q: state.value.q, kind: state.value.kind, domain: state.value.domain, page: state.value.page === '1' ? '' : state.value.page }));
const backUrl = computed(() => state.value.from.startsWith('/catalog/?') ? state.value.from : '/catalog/');
function moveTab(event, offset) {
  const index = (tabs.findIndex(([value]) => value === tab.value) + offset + tabs.length) % tabs.length;
  tab.value = tabs[index][0];
  event.currentTarget.parentElement.children[index].focus();
}
</script>
<template>
  <div class="explorer-shell">
    <div v-if="error" class="state-panel" role="alert"><h2>데이터를 불러올 수 없습니다</h2><p>{{ error }}</p><button class="button primary" @click="retry">다시 시도</button></div>
    <div v-else-if="!data" class="state-panel" role="status"><span class="loading-dot"></span> 모듈 카탈로그를 불러오는 중입니다.</div>
    <template v-else>
      <div class="dataset-note"><span class="sample-tag">SAMPLE CATALOG</span><span>Ghost 샘플 · {{ new Date(data.meta.generatedAt).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' }) }} 기준</span><a :href="withBase('/examples/')">데이터 안내 ↗</a></div>
      <template v-if="!props.detail">
        <div class="explorer-heading"><div><div class="eyebrow">MODULE CATALOG</div><h1>다음 시스템의<br class="mobile-break"> 조각을 찾아보세요.</h1><p>DB와 UI, 모듈과 번들. 기능과 계약을 살펴보고 필요한 구성을 고르세요.</p></div><span class="count-stamp"><strong>{{ data.packages.items.length }}</strong>개의 샘플 모듈·번들</span></div>
        <form class="search-toolbar" role="search" @submit.prevent>
          <label class="search-field"><span class="search-symbol" aria-hidden="true">⌕</span><input v-model="draft" type="search" aria-label="모듈 검색" placeholder="이름, 기능, 계약으로 모듈 검색" autocomplete="off"></label>
          <label class="select-field"><span>도메인</span><select :value="state.domain" @change="update({ domain: $event.target.value, page: '1' })"><option value="">전체 도메인</option><option v-for="domain in domainOptions" :key="domain" :value="domain">{{ domains[domain] || domain }}</option></select></label>
        </form>
        <div class="filter-row"><div class="filter-chips" role="group" aria-label="모듈 종류 필터"><button v-for="[value, label] in [['', '전체'], ['db', 'DB 전체'], ['ui', 'UI 전체'], ...Object.entries(kinds)]" :key="value" :aria-pressed="state.kind === value" :class="{ active: state.kind === value }" @click="update({ kind: value, page: '1' })">{{ label }}</button></div></div>
        <div class="results-heading" aria-live="polite"><span>검색 결과 <strong>{{ results.total }}</strong><span class="muted">개</span></span><span class="muted">이름순 · 등록 선언 기준</span></div>
        <div v-if="!results.items.length" class="state-panel"><h2>{{ results.total ? '이 페이지에 결과가 없습니다' : '일치하는 모듈이 없습니다' }}</h2><p>검색어와 필터를 바꾸거나 검색 조건을 초기화하세요.</p><button class="text-button" @click="update({ q: '', kind: '', domain: '', page: '1' })">검색 초기화 →</button></div>
        <div v-else class="catalog-grid"><a v-for="pkg in results.items" :key="pkg.name" :href="withBase(packageLink(pkg.name, pkg.latestVersion, listUrl))" class="module-card"><div class="module-card-top"><span class="kind-badge" :class="pkg.kind">{{ kinds[pkg.kind] }}</span><span class="muted">v{{ pkg.latestVersion }}</span></div><h2>{{ shortName(pkg.name) }}</h2><div class="package-scope">{{ pkg.name }}</div><p>{{ pkg.description || '등록된 설명이 없습니다.' }}</p><div class="keyword-list"><span v-for="keyword in pkg.keywords.slice(0, 3)" :key="keyword">{{ keyword }}</span></div><div class="module-card-bottom"><span>{{ domains[pkg.domain] || pkg.domain || pkg.namespace }}</span><span>상세 보기 ↗</span></div></a></div>
        <nav v-if="results.pages > 1" class="pagination" aria-label="검색 결과 페이지"><button :disabled="results.page <= 1" @click="update({ page: String(results.page - 1) })">← 이전</button><span>{{ results.page }} / {{ results.pages }}</span><button :disabled="results.page >= results.pages" @click="update({ page: String(results.page + 1) })">다음 →</button></nav>
      </template>
      <template v-else-if="!selected || !version"><a class="back-link" :href="withBase(backUrl)">← 모듈 목록</a><div class="state-panel"><h1>{{ !selected ? '모듈을 찾을 수 없습니다' : '수집되지 않은 버전입니다' }}</h1><p>{{ state.name || '패키지 이름을 지정하세요.' }} {{ state.version }}</p><p v-if="selected">수집된 버전: {{ selected.versions.map((v) => v.version).join(', ') }}</p><a v-if="selected" :href="withBase(packageLink(selected.name, selected.latestVersion))">최신 수집 버전 보기 →</a></div></template>
      <template v-else>
        <a class="back-link" :href="withBase(backUrl)">← 모듈 목록</a>
        <div class="detail-title"><div><span class="kind-badge" :class="selected.kind">{{ kinds[selected.kind] }}</span><h1>{{ shortName(selected.name) }}</h1><p class="package-scope">{{ selected.name }}</p><p>{{ version.description }}</p></div><label class="version-picker">버전<select :value="version.version" @change="update({ version: $event.target.value })"><option v-for="v in selected.versions" :key="v.version" :value="v.version">{{ v.version }}{{ v.version === selected.latestVersion ? ' · latest' : '' }}</option></select></label></div>
        <div class="tab-bar" role="tablist" aria-label="모듈 상세"><button v-for="[value, label] in tabs" :key="value" role="tab" :aria-selected="tab === value" :tabindex="tab === value ? 0 : -1" @keydown.right.prevent="moveTab($event, 1)" @keydown.left.prevent="moveTab($event, -1)" :aria-controls="'detail-' + value" :id="'tab-' + value" :class="{ active: tab === value }" @click="tab = value">{{ label }}</button></div>
        <section :id="'detail-' + tab" role="tabpanel" :aria-labelledby="'tab-' + tab" class="detail-content">
          <template v-if="tab === 'overview'"><div class="detail-layout"><div><h2>모듈 정보</h2><dl class="metadata-grid"><dt>종류</dt><dd>{{ kinds[version.kind] }}</dd><dt>Family</dt><dd><code>{{ version.family }}</code></dd><dt>Namespace</dt><dd><code>{{ version.namespace }}</code></dd><dt>Manifest engine</dt><dd>{{ version.engine }}</dd><dt>실행 방식</dt><dd>{{ version.instance ? 'instance' : 'static' }}</dd><dt>구현</dt><dd>{{ version.impl || '미지정' }}</dd></dl><h2>로컬에서 조회</h2><pre class="command-block"><code>logic view {{ selected.name }}@{{ version.version }}</code></pre><p class="muted">Ghost 워크스페이스와 로컬 레지스트리가 필요합니다. 공개 npm 설치 대상이 아닙니다.</p></div><aside class="detail-aside"><h3>이 모듈 살펴보기</h3><a :href="selected.sourceUrl" target="_blank" rel="noreferrer">원본 패키지 ↗</a><a :href="withBase('/guide/dependencies.html')">의존과 포함 이해하기 →</a><a :href="withBase('/guide/contracts.html')">계약 연결 가이드 →</a><p>샘플 메타데이터입니다.<br>실제 업무 로직과 운영 데이터는 포함하지 않습니다.</p></aside></div></template>
          <template v-else-if="tab === 'contracts'"><h2>요구 계약 <span class="muted">{{ version.expect.length }}</span></h2><div v-if="!version.expect.length" class="empty-inline">직접 선언한 expect가 없습니다.</div><div v-for="e in version.expect" :key="e.contract.key" class="declaration-card"><div><span class="mini-tag">expect</span><a :href="withBase(usageLink(e.contract.key, categoryOf(version.kind)))"><code>{{ e.contract.source }}</code> ↗</a></div><p v-if="e.description">{{ e.description }}</p><small>수량 {{ quantity(e.min, e.max) }} · scope {{ e.contract.scope }} · owner {{ e.contract.owner || '전역' }}</small></div><h2>제공 계약 <span class="muted">{{ version.provide.length }}</span></h2><div v-if="!version.provide.length" class="empty-inline">직접 선언한 provide가 없습니다.</div><div v-for="(p, i) in version.provide" :key="i" class="declaration-card"><div><span class="mini-tag">provide.{{ p.channel }}</span><code>{{ p.contract.source }}</code></div><a :href="withBase('/contracts/providers/?q=' + encodeURIComponent(p.contract.source))">제공 선언 후보 살펴보기 →</a></div><p class="muted">직접 등록한 선언입니다. 실효 전파와 실제 연결 결과는 로컬 조립에서 확인하세요.</p></template>
          <template v-else-if="tab === 'dependencies'"><h2>의존·포함 선언</h2><div class="table-scroll"><table class="data-table"><thead><tr><th>관계</th><th>대상 패키지</th><th>요구 범위</th><th>해석 버전</th></tr></thead><tbody><tr v-for="(dep, i) in version.deps" :key="i"><td><span class="mini-tag">{{ dep.edgeType }}{{ dep.channel ? '.' + dep.channel : '' }}</span></td><td><a v-if="dep.pkg" :href="withBase(packageLink(dep.pkg, dep.resolvedVersion))">{{ dep.pkg }}</a><span v-else>{{ dep.path }}</span><small v-if="dep.path"> · {{ dep.path }}</small></td><td>{{ dep.range || '—' }}</td><td>{{ dep.resolvedVersion || '미해석' }}</td></tr></tbody></table></div><p v-if="!version.deps.length" class="empty-inline">의존·포함 선언이 없습니다.</p><h2>이 모듈을 사용하는 패키지</h2><a v-for="(dep, i) in dependents" :key="i" class="dependent-row" :href="withBase(packageLink(dep.name, dep.version))"><code>{{ dep.name }}</code><span>{{ dep.edgeType }} →</span></a><p v-if="!dependents.length" class="empty-inline">수집한 최신 버전에서 역참조가 없습니다.</p></template>
          <template v-else-if="tab === 'tables'"><h2>테이블 메타데이터</h2><p class="muted">{{ selected.latestVersion === version.version ? '최신 버전의 정적 의존·포함 폐포에서 수집한 정보입니다. exclude와 동적 선언은 반영하지 않습니다.' : '선택 버전의 직접 등록 테이블입니다.' }}</p><div v-if="tableItems.length" class="table-scroll"><table class="data-table"><thead><tr><th>테이블</th><th>등록 출처</th><th>소유 패키지</th></tr></thead><tbody><tr v-for="(t, i) in tableItems" :key="i"><td><code>{{ t.table }}</code></td><td>{{ t.source }}</td><td><a :href="withBase(packageLink(t.pkg || selected.name))">{{ t.pkg || selected.name }}</a><small v-if="t.ownerPkg"> · {{ t.ownerPkg }}</small></td></tr></tbody></table></div><div v-else class="empty-inline">등록된 테이블 메타데이터가 없습니다.</div></template>
          <template v-else><h2>logic.json</h2><pre class="command-block"><code>{{ JSON.stringify(version.manifest, null, 2) }}</code></pre></template>
        </section>
      </template>
    </template>
  </div>
</template>
