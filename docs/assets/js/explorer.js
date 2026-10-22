import { href, escapeHTML as e, loadSnapshot, readQuery, writeQuery } from './shared.mjs';
import { kinds, domains, shortName, packageLink, queryLink, usageLink, patternLink, categoryOf, filterPackages, filterContracts, filterPatterns, filterProviders, paginate, quantity } from './catalog.mjs';

const root = document.querySelector('#explorer-root');
const mode = root.dataset.mode;
const defaults = { q: '', kind: '', domain: '', page: '1', name: '', version: '', from: '', scope: '', channel: '', owner: '', key: '', pattern: '', tab: 'overview' };
let state = readQuery(defaults);
let data;
const link = (path) => e(href(path));
const badge = (kind) => `<span class="kind-badge ${Object.hasOwn(kinds, kind) ? kind : ''}">${e(kinds[kind] || kind)}</span>`;
const empty = (text) => `<div class="empty-inline">${text}</div>`;
const option = (value, label, current) => `<option value="${e(value)}"${value === current ? ' selected' : ''}>${e(label)}</option>`;
const select = (key, label, values) => `<label class="select-field"><span>${label}</span><select data-query="${key}" aria-label="${label}">${values.map(([value, text]) => option(value, text, state[key])).join('')}</select></label>`;
const searchField = (label, placeholder) => `<label class="search-field"><span class="search-symbol" aria-hidden="true">⌕</span><input type="search" data-query="q" aria-label="${label}" placeholder="${placeholder}" value="${e(state.q)}" autocomplete="off"></label>`;
const catalogBack = () => state.from.startsWith('/catalog/?') ? state.from : '/catalog/';
const catalogLocation = () => queryLink('/catalog/', { q: state.q, kind: state.kind, domain: state.domain, page: state.page === '1' ? '' : state.page });
const tabs = [['overview', '개요'], ['contracts', '계약'], ['dependencies', '의존 관계'], ['tables', '테이블'], ['manifest', 'Manifest']];

function note() {
  return `<div class="dataset-note"><span class="sample-tag">SAMPLE CATALOG</span><span>Ghost 샘플 · ${e(new Date(data.meta.generatedAt).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' }))} 기준</span><a href="${link('/examples/')}">데이터 안내 ↗</a></div>`;
}
function paging(result) {
  if (result.pages <= 1) return '';
  return `<nav class="pagination" aria-label="검색 결과 페이지"><button data-page="${result.page - 1}"${result.page <= 1 ? ' disabled' : ''}>← 이전</button><span>${result.page} / ${result.pages}</span><button data-page="${result.page + 1}"${result.page >= result.pages ? ' disabled' : ''}>다음 →</button></nav>`;
}
function resetPanel(title = '조건에 맞는 결과가 없습니다') {
  return `<div class="state-panel"><h2>${title}</h2><p>검색어와 필터를 바꾸거나 검색 조건을 초기화하세요.</p><button class="text-button" data-action="reset">검색 초기화 →</button></div>`;
}
function packageCards(items) {
  return `<div class="catalog-grid">${items.map((pkg) => `<a class="module-card" href="${link(packageLink(pkg.name, pkg.latestVersion, catalogLocation()))}"><div class="module-card-top">${badge(pkg.kind)}<span class="muted">v${e(pkg.latestVersion)}</span></div><h2>${e(shortName(pkg.name))}</h2><div class="package-scope">${e(pkg.name)}</div><p>${e(pkg.description || '등록된 설명이 없습니다.')}</p><div class="keyword-list">${pkg.keywords.slice(0, 3).map((keyword) => `<span>${e(keyword)}</span>`).join('')}</div><div class="module-card-bottom"><span>${e(domains[pkg.domain] || pkg.domain || pkg.namespace)}</span><span>상세 보기 ↗</span></div></a>`).join('')}</div>`;
}
function renderCatalog() {
  const values = [...new Set(data.packages.items.map((pkg) => pkg.domain).filter(Boolean))].sort();
  root.innerHTML = `${note()}<div class="explorer-heading"><div><div class="eyebrow">MODULE CATALOG</div><h1>다음 시스템의<br class="mobile-break"> 조각을 찾아보세요.</h1><p>DB와 UI, 모듈과 번들. 기능과 계약을 살펴보고 필요한 구성을 고르세요.</p></div><span class="count-stamp"><strong>${data.packages.items.length}</strong>개의 샘플 모듈·번들</span></div><form class="search-toolbar" role="search">${searchField('모듈 검색', '이름, 기능, 계약으로 모듈 검색')}${select('domain', '도메인', [['', '전체 도메인'], ...values.map((value) => [value, domains[value] || value])])}</form><div class="filter-row"><div class="filter-chips" role="group" aria-label="모듈 종류 필터">${[['', '전체'], ['db', 'DB 전체'], ['ui', 'UI 전체'], ...Object.entries(kinds)].map(([value, label]) => `<button data-kind="${value}" aria-pressed="${state.kind === value}" class="${state.kind === value ? 'active' : ''}">${label}</button>`).join('')}</div></div><div id="query-results"></div>`;
  renderResults();
}
function renderResults() {
  const target = root.querySelector('#query-results');
  if (!target) return;
  let items;
  if (mode === 'catalog') items = filterPackages(data.packages.items, state);
  else if (mode === 'patterns') items = filterPatterns(data.patterns.items, state);
  else if (mode === 'providers') items = filterProviders(data.providers.items, state);
  else items = filterContracts(data.contracts.items, state);
  const result = paginate(items, state.page);
  const heading = `<div class="results-heading" aria-live="polite"><span>검색 결과 <strong>${result.total}</strong>개</span><span class="muted">${mode === 'catalog' ? '이름순 · 등록 선언 기준' : mode === 'providers' ? '최신 버전의 직접 제공 선언' : '최신 버전의 직접 요구 선언'}</span></div>`;
  const body = !result.items.length ? resetPanel(result.total ? '이 페이지에 결과가 없습니다' : '조건에 맞는 결과가 없습니다') : mode === 'catalog' ? packageCards(result.items) : contractCards(result.items);
  target.innerHTML = heading + body + paging(result);
}
function selectedPackage() {
  const pkg = data.packages.items.find((pkg) => pkg.name === state.name);
  const version = pkg?.versions.find((v) => v.version === (!state.version || state.version === 'latest' ? pkg.latestVersion : state.version));
  return { pkg, version };
}
function renderPackage() {
  const { pkg, version } = selectedPackage();
  const back = `<a class="back-link" href="${link(catalogBack())}">← 모듈 목록</a>`;
  if (!pkg || !version) {
    root.innerHTML = `${note()}${back}<div class="state-panel"><h1>${!pkg ? '모듈을 찾을 수 없습니다' : '수집되지 않은 버전입니다'}</h1><p>${e(state.name || '패키지 이름을 지정하세요.')} ${e(state.version)}</p>${pkg ? `<p>수집된 버전: ${pkg.versions.map((v) => e(v.version)).join(', ')}</p><a href="${link(packageLink(pkg.name, pkg.latestVersion, state.from))}">최신 수집 버전 보기 →</a>` : ''}</div>`;
    return;
  }
  root.innerHTML = `${note()}${back}<div class="detail-title"><div>${badge(pkg.kind)}<h1>${e(shortName(pkg.name))}</h1><p class="package-scope">${e(pkg.name)}</p><p>${e(version.description)}</p></div><label class="version-picker">버전<select data-query="version" aria-label="버전">${pkg.versions.map((v) => option(v.version, `${v.version}${v.version === pkg.latestVersion ? ' · latest' : ''}`, version.version)).join('')}</select></label></div><div class="tab-bar" role="tablist" aria-label="모듈 상세">${tabs.map(([value, text]) => `<button role="tab" id="tab-${value}" aria-controls="module-panel" aria-selected="${state.tab === value}" tabindex="${state.tab === value ? 0 : -1}" class="${state.tab === value ? 'active' : ''}" data-tab="${value}">${text}</button>`).join('')}</div><section id="module-panel" role="tabpanel" class="detail-content"></section>`;
  renderPackagePanel();
}
function renderPackagePanel() {
  const panel = root.querySelector('#module-panel');
  if (!panel) return;
  const { pkg, version: v } = selectedPackage();
  if (!tabs.some(([key]) => key === state.tab)) state.tab = 'overview';
  for (const button of root.querySelectorAll('[data-tab]')) {
    const active = button.dataset.tab === state.tab;
    button.setAttribute('aria-selected', String(active)); button.tabIndex = active ? 0 : -1; button.classList.toggle('active', active);
  }
  panel.setAttribute('aria-labelledby', `tab-${state.tab}`);
  if (state.tab === 'overview') {
    const meta = [['종류', kinds[v.kind]], ['Family', v.family], ['Namespace', v.namespace], ['Manifest engine', v.engine], ['실행 방식', v.instance ? 'instance' : 'static'], ['구현', v.impl || '미지정']];
    panel.innerHTML = `<div class="detail-layout"><div><h2>모듈 정보</h2><dl class="metadata-grid">${meta.map(([key, value]) => `<dt>${key}</dt><dd>${e(value)}</dd>`).join('')}</dl><h2>로컬에서 조회</h2><pre class="command-block"><code>logic view ${e(pkg.name)}@${e(v.version)}</code></pre><p class="muted">Ghost 워크스페이스와 로컬 레지스트리가 필요합니다. 공개 npm 설치 대상이 아닙니다.</p></div><aside class="detail-aside"><h3>이 모듈 살펴보기</h3><a href="${e(pkg.sourceUrl)}" target="_blank" rel="noreferrer">원본 패키지 ↗</a><a href="${link('/guide/dependencies.html')}">의존과 포함 이해하기 →</a><a href="${link('/guide/contracts.html')}">계약 연결 가이드 →</a><p>샘플 메타데이터입니다.<br>실제 업무 로직과 운영 데이터는 포함하지 않습니다.</p></aside></div>`;
  } else if (state.tab === 'contracts') {
    panel.innerHTML = `<h2>요구 계약 <span class="muted">${v.expect.length}</span></h2>${v.expect.map((d) => `<div class="declaration-card"><div><span class="mini-tag">expect</span><a href="${link(usageLink(d.contract.key, categoryOf(v.kind)))}"><code>${e(d.contract.source)}</code> ↗</a></div>${d.description ? `<p>${e(d.description)}</p>` : ''}<small>수량 ${quantity(d.min, d.max)} · scope ${e(d.contract.scope)} · owner ${e(d.contract.owner || '전역')}</small></div>`).join('') || empty('직접 선언한 expect가 없습니다.')}<h2>제공 계약 <span class="muted">${v.provide.length}</span></h2>${v.provide.map((p) => `<div class="declaration-card"><div><span class="mini-tag">provide.${e(p.channel)}</span><code>${e(p.contract.source)}</code></div><a href="${link(queryLink('/contracts/providers/', { q: p.contract.source }))}">제공 선언 후보 살펴보기 →</a></div>`).join('') || empty('직접 선언한 provide가 없습니다.')}<p class="muted">직접 등록한 선언입니다. 실효 전파와 실제 연결 결과는 로컬 조립에서 확인하세요.</p>`;
  } else if (state.tab === 'dependencies') {
    const dependents = data.packages.items.flatMap((p) => p.versions.filter((version) => version.version === p.latestVersion).flatMap((version) => version.deps.filter((dep) => dep.pkg === pkg.name).map((dep) => ({ name: p.name, version: version.version, ...dep }))));
    panel.innerHTML = `<h2>의존·포함 선언</h2>${v.deps.length ? `<div class="table-scroll"><table class="data-table"><thead><tr><th>관계</th><th>대상 패키지</th><th>요구 범위</th><th>해석 버전</th></tr></thead><tbody>${v.deps.map((dep) => `<tr><td><span class="mini-tag">${e(dep.edgeType)}${dep.channel ? '.' + e(dep.channel) : ''}</span></td><td>${dep.pkg ? `<a href="${link(packageLink(dep.pkg, dep.resolvedVersion, state.from))}">${e(dep.pkg)}</a>` : e(dep.path)}${dep.path ? `<small> · ${e(dep.path)}</small>` : ''}</td><td>${e(dep.range || '—')}</td><td>${e(dep.resolvedVersion || '미해석')}</td></tr>`).join('')}</tbody></table></div>` : empty('의존·포함 선언이 없습니다.')}<h2>이 모듈을 사용하는 패키지</h2>${dependents.map((dep) => `<a class="dependent-row" href="${link(packageLink(dep.name, dep.version, state.from))}"><code>${e(dep.name)}</code><span>${e(dep.edgeType)} →</span></a>`).join('') || empty('수집한 최신 버전에서 역참조가 없습니다.')}`;
  } else if (state.tab === 'tables') {
    const tables = pkg.latestVersion === v.version ? pkg.tables : v.tables;
    panel.innerHTML = `<h2>테이블 메타데이터</h2><p class="muted">${pkg.latestVersion === v.version ? '최신 버전의 정적 의존·포함 폐포에서 수집한 정보입니다. exclude와 동적 선언은 반영하지 않습니다.' : '선택 버전의 직접 등록 테이블입니다.'}</p>${tables.length ? `<div class="table-scroll"><table class="data-table"><thead><tr><th>테이블</th><th>등록 출처</th><th>소유 패키지</th></tr></thead><tbody>${tables.map((t) => `<tr><td><code>${e(t.table)}</code></td><td>${e(t.source)}</td><td><a href="${link(packageLink(t.pkg || pkg.name))}">${e(t.pkg || pkg.name)}</a>${t.ownerPkg ? `<small> · ${e(t.ownerPkg)}</small>` : ''}</td></tr>`).join('')}</tbody></table></div>` : empty('등록된 테이블 메타데이터가 없습니다.')}`;
  } else panel.innerHTML = `<h2>logic.json</h2><pre class="command-block"><code>${e(JSON.stringify(v.manifest, null, 2))}</code></pre>`;
}
const contractTitles = { groups: '연결은 계약에서 시작됩니다.', patterns: '이미 쓰이는 UI 패턴을 발견하세요.', providers: '계약을 제공하는 선언을 찾으세요.', usage: '계약의 실제 선언을 살펴보세요.', pattern: '패턴의 사용 사례를 살펴보세요.' };
const descriptions = { groups: '모듈과 번들이 무엇을 요구하는지, 얼마나 함께 쓰이는지 살펴보세요.', patterns: '최신 UI 번들에 직접 선언된 expect를 기능 이름과 설명으로 탐색합니다.', providers: '수집한 최신 버전의 provide 선언 후보입니다. 실제 조립의 연결 결과는 로컬에서 확인하세요.', usage: '최신 등록 버전에서 이 계약 키를 직접 요구하는 패키지입니다.', pattern: '같은 이름을 사용하는 UI 번들의 선언입니다. 서로 다른 owner의 계약은 각각 보존합니다.' };
function renderContracts() {
  const isPattern = ['patterns', 'pattern'].includes(mode);
  const isDetail = ['usage', 'pattern'].includes(mode);
  const navigation = [['groups', 'expect 집계', '/contracts/'], ['patterns', 'UI 기능 패턴', '/contracts/patterns/'], ['providers', '제공 선언 후보', '/contracts/providers/']];
  root.innerHTML = `${note()}<div class="explorer-heading"><div><div class="eyebrow">${isPattern ? 'UI EXPECT PATTERNS' : 'CONTRACT EXPLORER'}</div><h1>${contractTitles[mode]}</h1><p>${descriptions[mode]}</p></div></div><nav class="contract-nav" aria-label="계약 조회 메뉴">${navigation.map(([value, text, path]) => `<a href="${link(path)}" class="${mode === value || (mode === 'usage' && value === 'groups') || (mode === 'pattern' && value === 'patterns') ? 'active' : ''}">${text}</a>`).join('')}</nav><div id="contract-content"></div>`;
  const content = root.querySelector('#contract-content');
  if (isDetail) { content.innerHTML = contractDetail(isPattern); return; }
  const filters = isPattern ? select('scope', 'Scope', [['', '전체'], ['local', 'local'], ['api', 'api']]) : select('kind', '계열', [['', 'DB + UI 전체'], ['db', 'DB'], ['ui', 'UI'], ...(mode === 'providers' ? [['ui_module', 'UI 모듈'], ['ui_bundle', 'UI 번들']] : [])]);
  const info = mode === 'groups' ? '사용 수는 최신 버전에서 직접 선언한 <strong>서로 다른 패키지 수</strong>입니다. 같은 이름도 owner가 다르면 별도 계약입니다.' : isPattern ? '동일 패턴의 선언 사례를 묶습니다. <strong>이름이 같아도 같은 계약이나 호환 구현을 뜻하지 않습니다.</strong>' : '등록된 제공 선언입니다. 그래프 도달 범위·수량·허용/거부를 반영한 <strong>조립 성공 판정은 포함하지 않습니다.</strong>';
  content.innerHTML = `<form class="search-toolbar" role="search">${searchField(isPattern ? 'UI 패턴 검색' : '계약 검색', isPattern ? '예: toolbar, navigation, 제목' : '계약 이름, 경로 또는 패키지로 검색')}${filters}</form>${mode === 'providers' ? `<div class="provider-filters"><label>제공 채널<select data-query="channel">${[['', '전체 채널'], ['db', 'provide.db'], ['ui', 'provide.ui']].map(([value, label]) => option(value, label, state.channel)).join('')}</select></label><label>명시 owner 또는 선언 패키지<input data-query="owner" value="${e(state.owner)}" placeholder="예: @ghost/ui-blog-cms"></label></div>` : ''}<div class="info-strip"><span class="info-mark">i</span><p>${info}</p></div><div id="query-results"></div>`;
  renderResults();
}
function contractCards(items) {
  if (mode === 'providers') return `<div class="contract-grid">${items.map((p) => `<article class="contract-card"><div class="module-card-top">${badge(p.kind)}<span class="mini-tag">provide.${e(p.channel)}</span></div><h2><code>${e(p.contract.source)}</code></h2><p>${e(p.description)}</p><div class="contract-meta">scope ${e(p.contract.scope)} · owner ${e(p.contract.owner || p.name)}</div><a class="provider-link" href="${link(packageLink(p.name, p.version))}">${e(p.name)} <span>↗</span></a></article>`).join('')}</div>`;
  const pattern = mode === 'patterns';
  return `<div class="contract-grid">${items.map((g) => `<a class="contract-card" href="${link(pattern ? patternLink(g.pattern, g.scope) : usageLink(g.contract.key, g.category))}"><div class="module-card-top">${pattern ? badge('ui_bundle') : `<span class="kind-badge ${e(g.category)}_module">${e(g.category.toUpperCase())} 계약</span>`}<span class="scope-badge">${e(g.contract?.scope || g.scope)}</span></div><h2><code>${e(g.contract?.path || g.pattern)}</code></h2><div class="contract-meta">${pattern ? 'UI 번들의 직접 expect' : e(g.contract.owner || '전역 API 계약')}</div>${pattern ? `<div class="pattern-example">${e(g.consumers[0]?.expect[0]?.description || g.consumers[0]?.description || '실제 선언 사례에서 사용 목적을 확인하세요.')}</div>` : ''}<div class="contract-card-bottom"><span><strong>${g.usageCount}</strong>개 ${pattern ? 'UI 번들' : '패키지'}에서 사용</span><span>선언 사례 ↗</span></div></a>`).join('')}</div>`;
}
function contractDetail(pattern) {
  const selected = pattern ? data.patterns.items.find((g) => g.scope === state.scope && g.pattern === state.pattern) : data.contracts.items.find((g) => g.contract.key === state.key && g.category === state.kind);
  if (!selected) return `<div class="state-panel"><h2>${pattern ? 'UI 패턴을 찾을 수 없습니다' : '계약 키를 찾을 수 없습니다'}</h2><p>정확한 ${pattern ? 'scope와 pattern' : 'kind와 key'}를 지정하거나 목록에서 선택하세요.</p><a href="${link(pattern ? '/contracts/patterns/' : '/contracts/')}">목록으로 이동 →</a></div>`;
  return `<div class="selected-contract"><div><span class="mini-tag">${e(pattern ? state.scope : state.kind.toUpperCase())}</span><h2><code>${e(pattern ? selected.pattern : selected.contract.key)}</code></h2><p>${selected.usageCount}개 ${pattern ? 'UI 번들' : '패키지'}의 최신 버전에서 직접 선언</p></div>${!pattern ? `<a class="button secondary" href="${link(queryLink('/contracts/providers/', { q: selected.contract.path }))}">제공 선언 후보 →</a>` : ''}</div>${selected.consumers.map((c) => `<article class="consumer-card"><div class="consumer-top"><div>${badge(c.kind)}<h3><a href="${link(packageLink(c.name, c.version))}">${e(c.name)} ↗</a></h3><p>${e(c.description)}</p></div><span class="version-label">v${e(c.version)}</span></div>${c.expect.map((d) => `<div class="declaration-card"><div><code>${e(d.source)}</code><span class="mini-tag">${d.min === 0 ? '선택' : '필수'} · ${quantity(d.min, d.max)}</span></div>${d.description ? `<p>${e(d.description)}</p>` : ''}<small>scope ${e(d.scope)} · owner ${e(d.owner || '전역')}</small></div>`).join('')}</article>`).join('')}<p class="sample-caption">선언 사례는 이름·scope·owner·수량의 근거입니다. 실제 public export 구조와 호출 동작은 개별 구현에서 확인하세요.</p>`;
}
function render() {
  if (mode === 'catalog') renderCatalog();
  else if (mode === 'package') renderPackage();
  else renderContracts();
}
function update(patch) {
  state = { ...state, ...patch };
  writeQuery(state, defaults);
  if (mode === 'package') {
    if (Object.hasOwn(patch, 'version')) renderPackage(); else renderPackagePanel();
  } else renderResults();
  for (const element of root.querySelectorAll('[data-query]')) if (element.value !== state[element.dataset.query]) element.value = state[element.dataset.query];
  for (const button of root.querySelectorAll('[data-kind]')) {
    const active = button.dataset.kind === state.kind; button.setAttribute('aria-pressed', String(active)); button.classList.toggle('active', active);
  }
}
root.addEventListener('submit', (event) => event.preventDefault());
root.addEventListener('input', (event) => { const key = event.target.dataset.query; if (key && event.target.tagName === 'INPUT') update({ [key]: event.target.value, page: '1' }); });
root.addEventListener('change', (event) => { const key = event.target.dataset.query; if (key && event.target.tagName === 'SELECT') update({ [key]: event.target.value, page: '1' }); });
root.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button || button.disabled) return;
  if (button.dataset.action === 'retry') start();
  else if (button.dataset.action === 'reset') update({ q: '', kind: '', domain: '', scope: '', owner: '', channel: '', page: '1' });
  else if (Object.hasOwn(button.dataset, 'kind')) update({ kind: button.dataset.kind, page: '1' });
  else if (button.dataset.tab) update({ tab: button.dataset.tab });
  else if (button.dataset.page) { update({ page: button.dataset.page }); root.querySelector('#query-results')?.scrollIntoView({ block: 'start' }); }
});
root.addEventListener('keydown', (event) => {
  if (!event.target.dataset.tab || !['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const index = tabs.findIndex(([key]) => key === state.tab);
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
  update({ tab: tabs[next][0] }); root.querySelector(`[data-tab="${tabs[next][0]}"]`).focus();
});
window.addEventListener('popstate', () => { state = readQuery(defaults); if (data) render(); });
async function start() {
  root.innerHTML = '<div class="state-panel" role="status">카탈로그를 불러오는 중입니다.</div>';
  try { data = await loadSnapshot(mode === 'catalog' || mode === 'package' ? ['packages'] : mode === 'patterns' || mode === 'pattern' ? ['patterns'] : mode === 'providers' ? ['providers'] : ['contracts']); render(); }
  catch (error) { root.innerHTML = `<div class="state-panel" role="alert"><h1>데이터를 불러올 수 없습니다</h1><p>${e(error.message)}</p><button class="button primary" data-action="retry">다시 시도</button></div>`; }
}
start();
