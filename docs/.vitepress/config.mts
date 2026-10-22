import { defineConfig } from 'vitepress';

const section = (text: string, items: [string, string][]) => ({ text, items: items.map(([text, link]) => ({ text, link })) });
const base = process.env.SITE_BASE || '/';
export default defineConfig({
  lang: 'ko-KR',
  title: 'Logic',
  titleTemplate: ':title · Logic',
  description: 'DB와 UI 모듈을 연결하는 소프트웨어 조립 플랫폼. 조립 문서와 모듈·계약 카탈로그를 만나보세요.',
  base,
  srcExclude: ['README.md', 'site-plan.md'],
  lastUpdated: true,
  sitemap: { hostname: process.env.SITE_ORIGIN || 'https://logic.bindmodel.com' },
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}favicon.svg` }],
    ['meta', { name: 'theme-color', content: '#17674a' }],
    ['meta', { property: 'og:site_name', content: 'Logic · bindmodel' }]
  ],
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Logic',
    nav: [
      { text: '시작하기', link: '/start/', activeMatch: '/start/' },
      { text: '조립 가이드', link: '/guide/', activeMatch: '/guide/' },
      { text: '레퍼런스', link: '/reference/', activeMatch: '/reference/' },
      { text: '모듈 조회', link: '/catalog/', activeMatch: '/catalog/' },
      { text: '계약 조회', link: '/contracts/', activeMatch: '/contracts/' },
      { text: '예제', link: '/examples/', activeMatch: '/examples/' }
    ],
    sidebar: {
      '/start/': [section('시작하기', [['Logic 소개', '/start/'], ['구성 요소와 용어', '/start/concepts'], ['설치와 첫 조립', '/start/quickstart']])],
      '/guide/': [section('조립 가이드', [['조립 흐름', '/guide/'], ['의존과 포함', '/guide/dependencies'], ['제외와 교체', '/guide/replacement'], ['계약 연결', '/guide/contracts'], ['허용·거부와 링크', '/guide/policies'], ['인스턴스와 설정', '/guide/configuration'], ['DB 스키마', '/guide/schema'], ['검증과 문제 해결', '/guide/validation'], ['CLI와 GUI', '/guide/tools'], ['UI 계약 설계', '/guide/ui-contracts']])],
      '/reference/': [section('레퍼런스', [['전체 보기', '/reference/'], ['logic.json', '/reference/manifest'], ['계약 문자열', '/reference/contracts'], ['CLI 명령어', '/reference/cli'], ['런타임 API', '/reference/runtime'], ['공개 조회 API', '/reference/api'], ['오류와 버전', '/reference/diagnostics']])],
      '/examples/': [section('조립 예제', [['예제 안내', '/examples/'], ['기본 조립', '/examples/basic'], ['블로그 조립', '/examples/blog'], ['쇼핑몰·ERP 탐색', '/examples/domains']])]
    },
    search: { provider: 'local', options: { translations: { button: { buttonText: '문서 검색', buttonAriaLabel: '문서 검색' }, modal: { noResultsText: '일치하는 문서가 없습니다.', resetButtonTitle: '검색어 지우기', displayDetails: '상세 표시', footer: { selectText: '선택', navigateText: '이동', closeText: '닫기' } } } } },
    outline: { label: '이 페이지에서', level: [2, 3] },
    docFooter: { prev: '이전 문서', next: '다음 문서' },
    lastUpdated: { text: '최근 수정', formatOptions: { dateStyle: 'medium' } },
    returnToTopLabel: '맨 위로',
    sidebarMenuLabel: '문서 메뉴',
    darkModeSwitchLabel: '화면 테마',
    footer: { message: '모듈을 연결하는 더 나은 방법.', copyright: 'Logic · bindmodel' }
  }
});
