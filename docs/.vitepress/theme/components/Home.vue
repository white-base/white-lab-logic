<script setup>
import { withBase } from 'vitepress';
import { data } from '../home.data.js';
import { kinds, shortName, packageLink } from '../lib/catalog.mjs';
const featured = data.packages.filter((p) => ['@ghost/db-blog-publishing', '@ghost/ui-blog-cms', '@ghost/db-commerce-order'].includes(p.name));
const steps = [
  { n: '01', title: '구조를 이해하세요', text: 'DB와 UI, 모듈과 번들. 네 가지 구성 요소에서 시작합니다.', href: '/start/concepts.html', cta: '핵심 개념 읽기' },
  { n: '02', title: '필요한 모듈을 찾으세요', text: '기능과 계약을 살펴보고, 시스템에 필요한 조각을 고릅니다.', href: '/catalog/', cta: '모듈 탐색하기' },
  { n: '03', title: '연결하고 검증하세요', text: '의존과 계약을 선언하고 CLI와 GUI로 조립을 확인합니다.', href: '/guide/', cta: '조립 가이드 보기' }
];
</script>
<template>
  <main class="logic-home">
    <div class="home-wrap">
      <section class="hero">
        <div class="hero-copy">
          <div class="eyebrow"><span class="live-dot"></span> THE MODULAR WAY TO BUILD</div>
          <h1>모듈을 찾고,<br><span>시스템을 조립하세요.</span></h1>
          <p class="hero-description">독립적인 DB와 UI를 하나의 시스템으로.<br class="desktop-break">Logic의 조립 문서와 모듈·계약 카탈로그에서 시작하세요.</p>
          <div class="hero-actions"><a class="button primary" :href="withBase('/start/quickstart.html')">조립 시작하기 <span>↗</span></a><a class="button secondary" :href="withBase('/catalog/')">모듈 둘러보기 <span>→</span></a></div>
          <div class="hero-footnote"><span class="tiny-check">✓</span> 계약 기반 연결 <span class="foot-separator">/</span> 교체 가능한 모듈 <span class="foot-separator">/</span> 선언부터 검증까지</div>
        </div>
        <div class="assembly-visual" aria-label="UI 번들이 DB 번들과 UI 모듈을 연결하는 조립 예시">
          <div class="visual-topline"><span><i></i> ASSEMBLY PREVIEW</span><span>logic.json</span></div>
          <div class="graph-canvas">
            <div class="graph-label">작은 조각이 만드는 하나의 흐름</div>
            <div class="graph-root graph-node"><div class="node-icon">◫</div><div><small>UI BUNDLE</small><strong>blog-cms</strong></div><span class="node-status">root</span></div>
            <div class="graph-wires"><span>depend.db</span><span>include</span></div>
            <div class="graph-children">
              <div class="graph-node child db-node"><div class="node-icon">▤</div><div><small>DB BUNDLE</small><strong>blog-publishing</strong></div></div>
              <div class="graph-node child ui-node"><div class="node-icon">▦</div><div><small>UI MODULE</small><strong>blog-editor</strong></div></div>
            </div>
            <div class="contract-bridge"><span class="bridge-dot"></span><code>expect</code><span class="bridge-line"></span><code>provide</code><span class="bridge-dot"></span></div>
          </div>
          <div class="visual-bottom"><span class="mini-tag">선언으로 연결</span><span>모듈을 바꿔도, 조립 방식은 그대로.</span></div>
        </div>
      </section>
      <div class="home-statbar"><div class="stat-intro"><span class="eyebrow">EXPLORE THE CATALOG</span><strong>다음 조립의 재료를 만나보세요.</strong></div><a :href="withBase('/catalog/')"><strong>{{ data.counts.packages }}<span>개</span></strong><small>샘플 모듈·번들 ↗</small></a><a :href="withBase('/contracts/')"><strong>{{ data.counts.contracts }}<span>개</span></strong><small>계약 그룹 ↗</small></a><a :href="withBase('/contracts/patterns/')"><strong>{{ data.counts.patterns }}<span>개</span></strong><small>UI 기능 패턴 ↗</small></a></div>
      <section class="home-section">
        <div class="section-heading"><div><div class="eyebrow">START WITH THE BASICS</div><h2>아이디어에서 조립까지, 한 단계씩.</h2></div><a :href="withBase('/start/')">처음 사용하는 분을 위한 안내 <span>→</span></a></div>
        <div class="journey-grid"><a v-for="step in steps" :key="step.n" :href="withBase(step.href)" class="journey-card"><span class="step-number">{{ step.n }}</span><h3>{{ step.title }}</h3><p>{{ step.text }}</p><div class="card-cta">{{ step.cta }} <span>↗</span></div></a></div>
      </section>
      <section class="home-section featured-section">
        <div class="section-heading"><div><div class="eyebrow">BUILDING BLOCKS</div><h2>무엇을 조립해볼까요?</h2></div><a :href="withBase('/catalog/')">모든 모듈 보기 <span>→</span></a></div>
        <div class="featured-grid"><a v-for="pkg in featured" :key="pkg.name" :href="withBase(packageLink(pkg.name, pkg.latestVersion))" class="module-card"><div class="module-card-top"><span class="kind-badge" :class="pkg.kind">{{ kinds[pkg.kind] }}</span><span class="muted">{{ pkg.latestVersion }}</span></div><h3>{{ shortName(pkg.name) }}</h3><p>{{ pkg.description }}</p><div class="module-card-bottom"><span>{{ pkg.namespace }}</span><span>자세히 보기 ↗</span></div></a></div>
        <p class="sample-caption"><span class="sample-dot"></span>Ghost 샘플 카탈로그입니다. 업무 로직과 공개 npm 배포를 포함하지 않습니다.</p>
      </section>
      <section class="home-callout"><div class="callout-icon">{ }</div><div><div class="eyebrow">CONTRACT FIRST</div><h2>이름을 찾는 데서, 연결을 이해하는 데로.</h2><p>요구하는 계약과 제공하는 모듈, 실제 선언 사례를 함께 살펴보세요.</p></div><a class="button secondary" :href="withBase('/contracts/')">계약 탐색하기 <span>→</span></a></section>
    </div>
  </main>
</template>
