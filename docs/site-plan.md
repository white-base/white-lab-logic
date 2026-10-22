# Logic 문서·조회 사이트 구성계획서

> **상태**: 정적 HTML 전환·GitHub Pages 게시·HTTPS 검증 완료
> **버전**: 0.7
> **최종수정**: 2026-10-22
> **대상 도메인**: `logic.bindmodel.com`
> **사이트 저장소**: `white-base/white-lab-logic`

## 1. 목적과 작업 범위

**현재 적용 방침(2026-10-22)**: 사용자의 후속 요청에 따라 VitePress 빌드 방식을 정적 HTML·CSS·JavaScript 방식으로 전환한다. `docs/index.html`을 실제 진입 파일로 관리하고 GitHub Pages는 `main` 브랜치의 `/docs`를 직접 게시한다. 아래의 VitePress 관련 설명은 1차 구현 당시의 설계·기록이며 현재 전환 계획은 §16을 우선 적용한다.

Logic의 DB/UI 모듈과 번들을 이해하고, 조립 방법을 학습하며, 사용할 모듈과 계약을 찾는 공개 사이트를 만든다. 문서 원고와 조회 화면의 콘텐츠는 이 저장소의 `/docs`를 기준으로 관리한다.

초안에서 **조회 서비스**는 등록된 모듈·번들·계약·의존 관계·테이블 메타데이터를 검색하고 상세 정보를 확인하는 서비스로 정의한다. 업무 시스템의 고객·주문 등 실제 운영 데이터를 조회하는 서비스는 별도 범위다.

먼저 이 Markdown 구성계획서와 문서 안내를 작성한 뒤, 2026-10-22의 진행 지시에 따라 1차 사이트 구현을 시작했다. 구현 진행과 검증 결과는 §15에 기록한다. 공개 배포·도메인 연결은 실제 저장소 설정과 접근 권한을 확인해 진행한다.

## 2. 현재 상태와 설계 전제

| 구분 | 확인 결과 | 계획에 반영할 내용 |
|---|---|---|
| 사이트 저장소 | 작업 시작 시 `README.md`만 존재 | `/docs`부터 문서 구조 수립 |
| 사이트 Git 원격 | `white-base/white-lab-logic` | 문서 사이트를 독립 저장소로 관리 |
| 모듈 참조 위치 | `/Volumes/SSD/PJ-Git/logic-runtime-workspace/` | 규격·도구·예제의 근거로 사용 |
| 참조 기준 | `logic-runtime-workspace` 커밋 `5ae5d4adf6c2e706c58b3b8ee336e1fb5c1af3c4`의 로컬 문서 | 문서·데이터 갱신 시 참조 버전을 함께 기록 |
| 규격 원본 | `logic-runtime-workspace/docs/spec/`가 단일 원본 | 사이트에서 규격을 독립 개정하지 않음 |
| 레지스트리 | `logic-server`의 공개 GET API와 계약 집계 경로 확인 | 모듈·계약 조회의 데이터 원본으로 활용 |
| 공개 도메인 | 목표 주소 `https://logic.bindmodel.com/` | Pages·DNS 연결 상태는 구현 단계에서 확인 |

문서의 과거 변경 이력에 폐기된 동작이 남아 있으므로 최신 본문·구현 정합화 메모를 기준으로 원고를 작성한다. 이 계획서에서 기존 테스트를 다시 실행하거나 운영 API를 검증한 것으로 간주하지 않는다.

## 3. 방문자와 주요 이용 흐름

| 방문자 | 목적 | 대표 흐름 |
|---|---|---|
| 처음 사용하는 개발자 | 조립 개념과 시작 방법 이해 | 홈 → 시작하기 → 첫 조립 → 예제 |
| 조립하는 개발자 | 적합한 모듈·번들 찾기 | 모듈 조회 → 상세·계약 확인 → 조립 가이드 → 로컬 CLI/GUI |
| 모듈 작성자 | 계약 설계와 재사용 사례 확인 | 계약 조회 → UI 기능 패턴 → 실제 선언 사례 → 계약 설계 문서 |
| 유지보수 담당자 | 선언·오류·버전 확인 | 레퍼런스 → 오류 코드·검증 단계 → 해당 규격 |

## 4. 상단 메뉴 초안

홈은 로고로 이동하고, 나머지 여섯 메뉴를 상단 탐색에 배치한다. 문서 검색은 공통 검색창으로 제공하고, 모듈·계약 검색은 각 조회 메뉴에서 제공한다.

| 메뉴 | 대표 URL | 역할 | 우선순위 |
|---|---|---|---|
| 홈 | `/` | Logic 소개, 네 가지 구성 요소, 시작·조회 진입 | 1차 |
| 시작하기 | `/start/` | 개념·설치·첫 조립 | 1차 |
| 조립 가이드 | `/guide/` | 의존·포함·교체·계약·검증·도구 사용 | 1차 |
| 레퍼런스 | `/reference/` | Manifest·계약 문법·CLI·런타임·조회 API | 1차 |
| 모듈 조회 | `/catalog/` | DB/UI 모듈·번들 검색과 상세 | 1차 |
| 계약 조회 | `/contracts/` | expect 집계·사용 사례·제공 후보·UI 패턴 탐색 | 1차 |
| 예제 | `/examples/` | 기본 조립과 블로그·쇼핑몰·ERP 사례 | 기본·블로그 1차, 나머지 확장 |

페이지 공통 요소는 현재 위치, 문서 목차, 관련 문서, 원본 링크, 적용 버전, 최종 수정일로 구성한다. 모바일에서는 상단 메뉴와 문서 사이드바를 접어 제공한다.

## 5. 문서 사이드바 구성

### 5.1 시작하기

1. **Logic 소개**: 모듈형 소프트웨어 조립의 목적과 해결하는 문제.
2. **네 가지 구성 요소**: `db_module`, `db_bundle`, `ui_module`, `ui_bundle`의 역할과 예시.
3. **핵심 용어**: manifest, kind, family, Context, expect, provide, engine.
4. **설치와 개발 환경**: 런타임·CLI 설치, 로컬 환경과 레지스트리의 차이.
5. **첫 조립**: 초기화 → 모듈 구성 → 선언 검증 → 계약 검사 → 트리 확인.

### 5.2 조립 가이드

1. **모듈·번들 선택**: kind별 조합 가능 범위, DB→UI 의존 금지.
2. **의존과 포함**: `depend.db`, `depend.ui`, `include` 및 강한 의존과 선택 조합.
3. **제외와 교체**: `exclude`, `include[].path`, alias와 하위 경로.
4. **계약 연결**: expect/provide, scope·owner·수량, 재제공.
5. **제공 후보 제어**: `reject`·`accept`, 경로별 적용과 우선순위.
6. **링크와 인스턴스**: `link`, static/instance, `prop`·사용처 `config`.
7. **DB 스키마 조립**: relation·extend·reference·물리 명명, 계획·차이·반영.
8. **검증과 문제 해결**: `logic validate`, `logic check`, Stage와 오류 진단.
9. **CLI로 조립하기 / GUI로 조립하기**: 명령 흐름과 로컬 GUI 사용법.
10. **UI 계약 설계**: public export 규칙 → base expect → 실제 계약·소비 근거.

### 5.3 레퍼런스

| 묶음 | 세부 문서 |
|---|---|
| Manifest | `logic.json` 필드, kind 조합표, engine, package.json과의 관계 |
| 계약 | expect/provide 문법, scope·owner, min/max, 와일드카드, 허용·거부 |
| 스키마 | SQL 관계·확장·참조, 명명·재생성 규칙 |
| 명령어 | init·add·include·exclude·reject·accept·link·validate·check·tree·schema·search·view·gui |
| 런타임 API | `define()`, Context, `getIncludedModules()`, 공개 API의 책임 |
| 조회 API | 패키지·버전·의존·테이블·계약 조회와 응답 형식 |
| 진단·버전 | 오류 코드, Stage, 패키지 버전과 manifest engine 구분, 릴리스 정책 |

`logic check`는 조립 결과의 계약 등을, `logic validate`는 선언 구조 등을 검사한다. 둘의 범위와 기본 경고·strict 모드 동작을 구분해 설명한다. DB 반영 명령은 조회·계획 명령과 동작을 구별해 문서화한다.

### 5.4 예제

| 예제 | 내용 | 근거와 표시 |
|---|---|---|
| 기본 조립 | DB 모듈 → 번들 → UI 구성과 계약 확인 | `fixtures/`의 작은 시나리오, 테스트용 표시 |
| 블로그 조립 | 기본 화면, 댓글 제외, 댓글 UI 교체, DB 기능 재사용 | `work/modularization-lab/projects/blog-pnpm/docs/` |
| 쇼핑몰 조립 | 상품·주문·결제·재고의 선택과 계약 탐색 | Ghost 메타데이터 시나리오 표시 |
| ERP 조립 | 영업·재무와 K-GAAP/IFRS 대안 탐색 | Ghost 메타데이터 시나리오 표시 |

Ghost는 검색·조립 탐색용이며 업무 로직을 구현한 완성 애플리케이션으로 소개하지 않는다. `@ghost/*`, `@fixture/*`는 공개 npm에서 바로 설치 가능한 패키지로 안내하지 않고 워크스페이스 예제라는 조건을 명시한다.

## 6. 조회 서비스 화면 구성

### 6.1 모듈 조회

목록 화면은 검색어, 계열(DB/UI), 종류(모듈/번들), 결과 수, 페이지 이동을 제공한다. 초기 데이터에 있는 분류만 필터로 노출하고 상세 분류는 후속 확장한다.

| 화면 | URL 초안 | 표시 내용 |
|---|---|---|
| 모듈 목록 | `/catalog/` | 이름·설명·kind·최신 등록 버전·namespace·예제 여부 |
| 모듈 상세 | `/catalog/package/?name=…&version=…` | 선택 버전의 개요·manifest·expect/provide·의존/포함·역참조·테이블 |
| 관계 보기 | 상세 화면의 관계 탭 | edge 종류, 패키지·버전, 선언 경로, 미수집 대상 표시 |

상세 탭은 **개요 / 계약 / 의존 관계 / 테이블 / Manifest**로 구성한다. 개요에서 원본 문서와 CLI 조회 예시로 연결한다. 버전은 정확한 버전으로 공유할 수 있게 하고, `latest` 요청은 실제 선택된 버전도 표시한다.

사이트의 관계·테이블 정보는 **등록된 선언과 정적 폐포 기준**이다. 사용자의 exclude·교체·동적 setup을 반영한 실효 결과는 로컬 CLI/GUI에서 확인하도록 안내한다. 컨텍스트 없는 검색 결과에 ‘내 조립과 호환됨’ 표시를 붙이지 않는다.

### 6.2 계약 조회

| 화면 | URL 초안 | 목적·표시 항목 |
|---|---|---|
| expect 집계 | `/contracts/` | DB/UI 계열, 정규화된 계약 키, scope·owner, 선언 패키지 수, 모듈/번들 수 |
| 계약 사용 사례 | `/contracts/usage/?kind=…&key=…` | 정확한 키의 요구 패키지·버전·원문·설명·min/max |
| 제공 후보 검색 | `/contracts/providers/` | 계약·owner·kind 조건과 일치하는 등록 제공 선언 |
| UI 기능 패턴 검색 | `/contracts/patterns/` | UI 번들의 직접 expect를 기능명·설명으로 검색 |
| UI 패턴 선언 사례 | `/contracts/pattern/?scope=…&pattern=…` | 패턴을 쓰는 번들과 각각의 owner·원문·설명·수량 |

계약 조회의 표시 규칙은 다음과 같다.

- DB/UI 분류는 **선언한 패키지의 kind**를 따른다. `provide.db`와 `provide.ui` 채널로 패키지 계열을 결정하지 않는다.
- `usageCount`는 각 패키지의 **최신 등록 버전에서 해당 expect를 직접 선언한 서로 다른 패키지 수**다. 호출량·설치량·실제 연결 수가 아니다.
- 정확한 계약 키 집계는 scope·owner를 보존한다. 서로 다른 owner의 로컬 계약은 같은 이름이어도 합치지 않는다.
- UI 기능 패턴은 `ui_bundle`에 직접 선언된 expect만 대상으로 하고, 이름이 같은 여러 owner의 사례를 묶어 탐색한다. 이 묶음은 동일 계약이나 구현 호환성을 뜻하지 않는다.
- min/max는 제공자 요구 수량이다. 사용 패키지 수나 export 멤버 수로 표시하지 않는다.
- 초기 화면에서 제공 후보는 **등록 선언 후보**다. 실제 그래프의 도달 범위·reject/accept·수량 등을 적용한 연결 성공을 보장하지 않는다.

### 6.3 공통 검색·상태 처리

문서 본문 검색과 카탈로그 검색은 대상과 결과 화면을 구분한다. 카탈로그는 검색어·필터·페이지를 URL에 유지하고, 상세에서 목록으로 돌아와도 조건을 복원한다. 패키지명·계약 키는 URL 인코딩하며 `@scope/name`을 지원한다.

데이터 로딩 중, 결과 없음, 알려지지 않은 패키지/버전, 데이터 파일 오류를 각각 표시한다. 조회 실패를 ‘검색 결과 없음’으로 바꾸지 않는다. 정적 데이터 화면에는 데이터 기준일과 샘플 여부를 항상 표시한다.

## 7. 제공 방식과 기존 API 활용

### 7.1 권장 방식: 문서 + 정적 카탈로그로 시작

GitHub Pages는 정적 파일을 제공하므로 문서·검색 UI·공개 JSON을 배포하고, Node 서버·SQLite 조회·모듈 설치·조립 실행은 별도 환경에서 수행한다. [GitHub Pages 소개](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)

| 구분 | 1차: 정적 조회 | 2차: 공개 API 연계 |
|---|---|---|
| 데이터 | 검토한 공개 메타데이터 스냅샷 | 별도 운영하는 `logic-server` |
| 검색 | 브라우저에서 스냅샷 검색·필터 | 공개 GET API 질의 |
| 갱신 | 데이터 재생성 후 사이트 재배포 | 서버 등록 상태를 조회 시 반영 |
| 운영 의존 | Pages만으로 문서·조회 제공 | HTTPS API 주소·CORS·장애 처리 필요 |
| 조회 범위 | 수집한 패키지·버전·선언 사례 | 운영 서버에 등록된 공개 정보 |

1차 화면의 필터·정렬 지원 범위를 명시하고 서버 검색의 점수·호환성 판정을 임의로 복제하지 않는다. 2차 운영 API의 도메인은 아직 지정하지 않는다. 현재 참조한 서버 앱에는 CORS 설정이 보이지 않으므로 브라우저 직접 호출은 서버 또는 프록시 설정 확인 후 연결한다.

### 7.2 스냅샷 수집·갱신 계획

1. 유지보수 환경에서 참조 저장소의 고정 커밋과 공개할 카탈로그 범위를 선택한다. 처음에는 Ghost/fixture를 샘플로 사용한다.
2. 임시 레지스트리를 별도 DB 경로로 준비하고 기존 공개 조회 로직으로 패키지·버전·계약을 추출한다. 기존 사용 DB를 데이터 생성 대상으로 삼지 않는다.
3. 페이지가 있는 API는 마지막 페이지까지 수집하고, 제한만 있는 API는 잘림 여부를 확인한다. 수집한 버전의 manifest·관계·테이블과 사용 사례를 함께 저장한다.
4. 공개 필드 목록으로 JSON을 생성한다. 패키지·계약 식별자, 메타데이터, 선언, 원본 링크를 포함하고 계정·토큰·관리자 데이터는 포함하지 않는다.
5. `schemaVersion`, `generatedAt`, `sourceRepo`, `sourceRef`, `dataset`, 수집 범위·완전성 정보를 기록한다. 샘플/실제 등록 데이터의 출처도 구분한다.
6. 건수·중복·깨진 참조·정확 버전 연결을 확인한 뒤 스냅샷을 저장소에 반영하고 배포한다. 실패하면 기존 배포 데이터를 유지한다.

CI 빌드는 저장소에 포함된 스냅샷만으로 재현 가능하게 한다. 개발자 PC의 절대경로나 별도 저장소 접근 권한을 사이트 빌드의 필수 조건으로 두지 않는다. 데이터 추출 도구는 후속 단계에서 작성하며 이 문서 작업에서는 실행하지 않았다.

### 7.3 기존 공개 GET API와 화면 연결

아래 경로는 참조 문서와 `logic-server/src/routes/contracts.js`에서 확인했다. 운영 주소의 응답을 검증한 목록은 아니다.

| 화면·기능 | 활용할 기존 API |
|---|---|
| 모듈 목록 | `GET /v1/packages` — `q`, `kind`, `page`, `limit` |
| 개요·버전 | `GET /v1/packages/:name`, `GET /v1/packages/:name/versions` |
| 버전별 Manifest | `GET /v1/packages/:name/versions/:version` |
| 의존·테이블 | `GET /v1/packages/:name/versions/:version/deps`, `…/tables` |
| 역참조 | `GET /v1/packages/:name/dependents` |
| 제공·요구 선언 검색 | `GET /v1/contracts` — `provide` 또는 `expect`, `owner`, `kind` |
| expect 집계·사용 사례 | `GET /v1/contracts/expects`, `GET /v1/contracts/expects/consumers` |
| UI 기능 패턴·사용 사례 | `GET /v1/contracts/expect-patterns`, `GET /v1/contracts/expect-patterns/consumers` |

현재 서버는 public export 구조·실제 export 경로·base expect 조합을 저장·검색하지 않는다. 관련 지침과 로컬 적용 근거를 문서에서 소개하고, 구조 검색 UI와 자동 타입 검증은 서버 확장 이후의 기능으로 둔다.

회원 가입·로그인·패키지 등록·출판 취소·관리자 화면은 1차 공개 조회 UI에 포함하지 않는다. 필요한 CLI 사용 안내는 문서로 제공한다.

## 8. `/docs` 중심 파일 구조

사용자의 HTML 방식 요청에 따라 다음 파일을 직접 관리한다. `/docs`가 게시 소스이며 `docs/index.html`이 실제 홈이다.

```text
white-lab-logic/
├── README.md
├── package.json                       # 선택적인 로컬 실행·검증 명령
├── scripts/                           # 미리보기·검증·데이터/검색 인덱스 갱신
├── tests/
├── .github/workflows/check.yml        # 소스 검증만 수행
└── docs/
    ├── index.html                    # 실제 홈
    ├── start/                        # 시작하기 HTML
    ├── guide/                        # 조립 가이드 HTML
    ├── reference/                    # 레퍼런스 HTML
    ├── examples/                     # 조립 예제 HTML
    ├── catalog/                      # 모듈 검색·상세 HTML
    ├── contracts/                    # 계약·패턴 검색·사례 HTML
    ├── assets/
    │   ├── site.css                  # 공통 디자인
    │   ├── logo.svg
    │   ├── favicon.svg
    │   └── js/
    │       ├── site.js               # 메뉴·테마·문서 검색
    │       ├── explorer.js           # 조회 화면
    │       ├── catalog.mjs           # 검색·URL·페이지 로직
    │       └── shared.mjs            # 공통 데이터 로딩·문자열 처리
    ├── data/
    │   ├── meta.json
    │   ├── packages.json
    │   ├── contracts.json
    │   ├── patterns.json
    │   ├── providers.json
    │   └── search-index.json
    ├── CNAME
    ├── .nojekyll
    ├── sitemap.xml
    ├── 404.html
    ├── README.md                     # 작성자 안내
    └── site-plan.md                  # 이 계획서
```

프런트엔드 프레임워크 설치와 컴파일은 필요하지 않다. 문서 본문과 홈은 HTML 자체에 포함하며, 카탈로그와 문서 검색만 JavaScript와 JSON을 사용한다. 문서 HTML 수정 후 `node scripts/index-docs.mjs`로 검색 인덱스를 갱신한다.

`/docs`는 소스 폴더명이며 공개 도메인의 `/docs/` 접두사를 뜻하지 않는다. 각 경로의 `index.html`과 상대 링크를 사용하므로 도메인 루트와 로컬 HTTP 서버에서 직접 접속·새로고침할 수 있다. 계획서·작성자 README는 사이트 메뉴·문서 검색에서 제외한다.

## 9. 원고와 규격 관리

- **역할**: 규격 변경은 참조 저장소에서 수행하고 이 저장소는 사용자용 설명·예제·탐색을 담당한다.
- **출처**: 각 페이지에 원본 파일·참조 커밋·적용 engine/패키지 버전·수정일을 기록한다. 관련 최신 원본으로 이동할 링크도 제공한다.
- **본문**: 목적 → 선언/명령 예시 → 예상 결과 → 관련 규칙 → 문제 해결 순서로 작성한다. CLI 명령은 해당 버전의 사용법과 대조한다.
- **공개 범위**: 개발 지침·미결 설계·관리자 운영 자료를 일괄 복사하지 않는다. 공개용으로 선정한 내용을 검토해 원고화한다.
- **상태**: 확정 규격, 구현된 동작, 계획·미지원 기능, 샘플 데이터의 상태를 구분한다.
- **갱신**: 규격·CLI·카탈로그 변경 시 영향 페이지와 스냅샷을 함께 확인한다. 단순 복사본을 별도 규격처럼 관리하지 않는다.
- **표기**: 한글 설명과 실제 코드 식별자를 함께 사용하고 `engine` 버전과 npm 패키지 버전을 구별한다.

## 10. GitHub Pages·도메인 계획

**`main` 브랜치의 `/docs`를 직접 게시**한다. Pages의 `Build and deployment → Source`는 `Deploy from a branch`, Branch는 `main`, Folder는 `/docs`로 설정한다. [GitHub 게시 소스 설정](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

| 항목 | 현재 방식 |
|---|---|
| 진입 파일 | `docs/index.html` |
| 게시 파일 | `/docs`의 HTML·CSS·JavaScript·JSON·정적 자산 |
| 전처리 | `docs/.nojekyll`로 정적 파일 제공 |
| 게시 | main 반영 시 Pages의 기본 게시 작업 실행 |
| 별도 CI | `check.yml`이 테스트·데이터·HTML 링크 검사만 수행 |
| 도메인 | `docs/CNAME`과 Pages 설정의 `logic.bindmodel.com` |

가비아 DNS의 `logic` CNAME은 `white-base.github.io`를 가리키도록 한다. DNS 값에 저장소 경로를 붙이지 않는다. DNS 확인과 인증서 발급이 완료되면 Enforce HTTPS를 적용한다. [GitHub 커스텀 도메인 설정](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)

기존 VitePress artifact 배포 workflow는 제거하고 GitHub Pages의 브랜치 게시로 대체한다. 실제 전환 결과와 도메인 상태는 §16에 기록한다.

## 11. 단계별 진행 계획과 완료 기준

| 단계 | 작업 | 완료 기준 |
|---|---|---|
| 0. 구성계획 | 이 문서를 먼저 작성하고 원본 확인 결과 보완 | 메뉴·URL·데이터 범위·출처·배포안·후속 범위 기록 |
| 1. 문서 기반 | 정적 HTML 홈·사이드바·문서 검색, 시작하기와 핵심 가이드 | HTML 직접 제공, 주요 문서 이동·검색·모바일 탐색 가능 |
| 2. 정적 조회 | 데이터 추출·검증, 모듈/계약/패턴 검색·상세 | 서버 없이 검색·상세·버전 공유 가능, 기준일·샘플 표시 |
| 3. 예제와 배포 | 기본·블로그 예제, main /docs 직접 게시, 도메인 연결 | 직접 URL 접속·새로고침·HTTPS·404·모바일 확인 |
| 4. API 연계 | 운영 API·CORS 구성, 실시간 검색 어댑터 | 성공/빈 결과/오류 처리, 검색 조건·페이지 일관성 검증 |
| 5. 후속 확장 | 관계 그래프, 예제 확대, public export 구조 조회 검토 | 근거 데이터와 필요한 서버 기능을 갖춘 항목부터 공개 |

1차 공개 범위는 **단계 1~3**이다. 본문 검색, 첫 조립 문서, 모듈 검색·상세, 정확 계약 집계·사용 사례, UI 패턴 검색·선언 사례, 기본·블로그 예제를 포함한다. 온라인 조립 실행·DB 변경·호환성 자동 확정은 후속 서비스로 별도 설계한다.

조회 검증에는 다음 사례를 포함한다.

- 스코프 패키지명과 한글 검색어, DB/UI 및 네 kind 필터, URL 조건 복원.
- 동일 이름의 로컬 계약을 가진 서로 다른 owner의 정확 집계와 패턴 집계 차이.
- 과거 버전의 계약을 최신 버전 사용 수에 중복 집계하지 않는지 확인.
- 알 수 없는 버전·빈 결과·불완전한 데이터·조회 실패 표시.
- 스냅샷과 원본 API의 대표 항목 대조, Ghost/fixture와 실제 구현 예제 표시.
- 목록→상세→계약→예제 이동, 모바일·키보드 탐색, 직접 접속·새로고침.

## 12. 구현 전 확인할 항목과 초안 기본값

| 항목 | 초안 기본값 | 확인 시점 |
|---|---|---|
| 서비스 명칭·언어 | Logic / 한글 중심, 코드 용어 병기 | 홈 원고·디자인 작성 시 |
| 사이트 형식 | 정적 HTML·CSS·JavaScript | 사용자 요청에 따라 전환 |
| 첫 카탈로그 | Ghost/fixture의 공개 가능한 샘플 | 스냅샷 제작 시 |
| 실제 패키지 포함 | 공개 범위·배포 상태를 확인한 패키지만 | 실데이터 갱신 시 |
| API 운영 주소 | 미지정, 1차는 정적 데이터 | API 연계 착수 시 |
| 데이터 갱신 | 원본 변경 후 수동 재생성·검토 | 자동화 필요성이 생기면 확대 |
| 도메인 | `logic.bindmodel.com`, DNS·HTTPS 연결 확인 | 완료 내역은 §16.2 |

## 13. 참조 자료

조립 문서의 로컬 기준 폴더는 `/Volumes/SSD/PJ-Git/logic-runtime-workspace/`다. 아래 원본 링크는 이번 검토 커밋에 고정했다. 원본 저장소 접근 권한에 따라 웹 열람이 제한될 수 있다.

| 근거 | 참조 문서 |
|---|---|
| 플랫폼·구성 요소 | [프로젝트 개요](https://github.com/white-base/logic-runtime-workspace/blob/5ae5d4adf6c2e706c58b3b8ee336e1fb5c1af3c4/docs/00-overview.md) |
| 규격 원본 정책 | [ADR-0001](https://github.com/white-base/logic-runtime-workspace/blob/5ae5d4adf6c2e706c58b3b8ee336e1fb5c1af3c4/docs/decisions/ADR-0001-docs-single-source.md) |
| 의존·포함·교체·링크 | [조립 고정 규칙](https://github.com/white-base/logic-runtime-workspace/blob/5ae5d4adf6c2e706c58b3b8ee336e1fb5c1af3c4/docs/spec/10-assembly-rules.md) |
| 계약과 전파 | [expect/provide](https://github.com/white-base/logic-runtime-workspace/blob/5ae5d4adf6c2e706c58b3b8ee336e1fb5c1af3c4/docs/spec/12-expect-provide.md) |
| 검증 단계 | [Stage 규격](https://github.com/white-base/logic-runtime-workspace/blob/5ae5d4adf6c2e706c58b3b8ee336e1fb5c1af3c4/docs/spec/15-validation-stages.md) |
| 계약 문자열·namespace | [계약 문법](https://github.com/white-base/logic-runtime-workspace/blob/5ae5d4adf6c2e706c58b3b8ee336e1fb5c1af3c4/docs/spec/18-contract-namespace-syntax.md) |
| 런타임 사용 | [logic-runtime](https://github.com/white-base/logic-runtime-workspace/blob/5ae5d4adf6c2e706c58b3b8ee336e1fb5c1af3c4/packages/logic-runtime/README.md) |
| CLI·GUI | [logic-auto-cli](https://github.com/white-base/logic-runtime-workspace/blob/5ae5d4adf6c2e706c58b3b8ee336e1fb5c1af3c4/packages/logic-auto-cli/README.md), [logic-gui](https://github.com/white-base/logic-runtime-workspace/blob/5ae5d4adf6c2e706c58b3b8ee336e1fb5c1af3c4/packages/logic-gui/README.md) |
| 공개 조회 API | [logic-server](https://github.com/white-base/logic-runtime-workspace/blob/5ae5d4adf6c2e706c58b3b8ee336e1fb5c1af3c4/packages/logic-server/README.md) |
| 정확 계약·패턴 집계 | [카탈로그 계획·구현 기록](https://github.com/white-base/logic-runtime-workspace/blob/5ae5d4adf6c2e706c58b3b8ee336e1fb5c1af3c4/docs/design/29-registry-expect-catalog-plan.md) |
| public export·미지원 구조 검색 | [UI export 적용 기록](https://github.com/white-base/logic-runtime-workspace/blob/5ae5d4adf6c2e706c58b3b8ee336e1fb5c1af3c4/docs/design/30-ui-public-export-expect-plan.md), [서버 조회의 근거와 한계](https://github.com/white-base/logic-runtime-workspace/blob/5ae5d4adf6c2e706c58b3b8ee336e1fb5c1af3c4/docs/skills/logic-modularization/references/ui-export-registry.md) |
| 샘플 데이터 | [Ghost 카탈로그](https://github.com/white-base/logic-runtime-workspace/blob/5ae5d4adf6c2e706c58b3b8ee336e1fb5c1af3c4/packages/logic-server/ghost/README.md) |
| 실제 조립 예제 | [blog-pnpm 시연 문서](https://github.com/white-base/logic-runtime-workspace/blob/5ae5d4adf6c2e706c58b3b8ee336e1fb5c1af3c4/work/modularization-lab/projects/blog-pnpm/docs/demos.md) |

## 14. 이번 문서 작업 기록

- [x] 구현 전에 `docs/site-plan.md` 초안 생성.
- [x] 규격·CLI/GUI·레지스트리·카탈로그·예제 문서 확인.
- [x] 메뉴·화면·URL·데이터·원고 관리·배포 단계 보완.
- [x] 작성자용 안내와 저장소 README 연결.
- [x] 사이트 화면·데이터 추출·빌드·Pages 배포 구현.

## 15. 1차 VitePress 구현 기록 (HTML 전환 전)

GitHub Pages를 대상으로 현재 저장소에서 구현한다. 별도의 Sites 호스팅 프로젝트는 생성하지 않는다.

- [x] 구현 전에 작업 계획과 범위를 이 파일에 갱신.
- [x] `/docs`를 입력으로 하는 VitePress 기반과 공통 디자인·탐색 구성.
- [x] 시작하기·조립 가이드·레퍼런스·기본/블로그 예제 작성.
- [x] 기존 레지스트리 조회 로직으로 재현 가능한 샘플 스냅샷 생성.
- [x] 모듈 검색·버전 상세·계약 집계·사용 사례·UI 패턴 조회 구현.
- [x] 데이터 무결성·검색/집계 동작·문서 빌드 확인.
- [x] 데스크톱·모바일 화면과 직접 URL 접속 검증.
- [x] GitHub Pages workflow·도메인 설정 안내·실행 README 작성.
- [x] 완료 항목·검증 결과·배포 상태를 이 파일에 기록.

### 15.1 구현 중 결정 사항

- 문서 24개와 조회 화면 경로 7개를 작성했다. 공통 문서 검색과 한글 검색, 모듈 종류·도메인 필터, 버전 상세, 정확 계약과 UI 패턴 사례를 제공한다.
- 데이터는 기존 `logic-server`를 포트 없이 메모리 DB에 구성해 공개 GET API로 추출했다. Ghost 샘플 패키지 60개, 계약 그룹 45개, UI 패턴 26개, 제공 선언 86개를 수집했다.
- 초기 데이터 규모에서는 `packages.json`에 수집한 버전 상세를 함께 보관한다. 별도 패키지별 파일 분할은 보류하고, 제공 선언용 `providers.json`을 추가했다.
- 검색은 브라우저 부분 일치·필터와 모듈 이름순을 사용한다. 서버의 관련성 점수나 실효 조립 호환성 판정을 복제하지 않는다.
- 원본 저장소와 사용 DB는 수정하지 않는다. 일반 빌드·CI는 저장된 스냅샷으로 실행한다.
- 2026-10-22 확인 시 GitHub Pages는 비활성 상태였다. 원격 저장소 SSH 읽기 접근은 확인했으며 게시 설정을 후속 진행한다.
- GitHub Pages 게시 소스를 GitHub Actions로 변경하고 Custom domain에 `logic.bindmodel.com`을 저장했다. DNS는 사용자가 직접 CNAME을 추가하기로 했다. 인증서와 HTTPS 강제는 DNS 검증 이후 확인한다.

### 15.2 검증 결과

- `pnpm test`: 데이터 참조·집계·한글 필터·owner 구분·URL 인코딩·페이지 처리 6개 테스트 통과.
- `pnpm build`: 스냅샷 검증과 VitePress 정적 빌드 통과. HTML 33개(홈·문서·조회·404) 생성.
- 빌드된 HTML의 내부 링크·정적 자산 경로 점검 통과. 작성자용 README와 계획서는 산출물에서 제외했다.
- Chrome에서 한글 모듈 검색과 UI 필터, 계약 상세·사용 사례, 서로 다른 owner의 UI 패턴, 문서 검색·이동, 미수집 버전 상태를 확인했다.
- 모바일 390px에서 홈·카탈로그의 가로 넘침이 없음을 확인했다. 상세 탭의 키보드 이동과 목록 검색 조건 복원도 점검했다.
- 원격에서도 테스트·빌드·배포 성공: [첫 Pages 배포](https://github.com/white-base/white-lab-logic/actions/runs/39751324918), 구현 커밋 `5bcf365`.

### 15.3 배포·도메인 상태

- 기본 브랜치 `main`에 구현을 반영했고 GitHub Actions의 build/deploy가 모두 성공했다.
- Pages의 게시 소스는 GitHub Actions, Custom domain은 `logic.bindmodel.com`이다. 사이트가 실제 도메인 또는 하위 경로에 맞게 빌드되도록 Pages 메타데이터에서 base/origin을 읽는다.
- 사용자가 가비아에 `CNAME logic → white-base.github.io`를 직접 추가하기로 했다. 최종 접속·인증서 상태는 DNS 반영 이후 확인한다.
- 첫 배포에서 확인한 Action 런타임 경고를 해소하기 위해 Node 24 기반 Action으로 갱신했다. 사이트의 빌드 Node 버전은 22를 유지한다. Runner 이미지는 Ubuntu 24.04로 고정했다.
- 갱신 근거: [checkout 변경 이력](https://github.com/actions/checkout/blob/main/CHANGELOG.md), [pnpm Action](https://github.com/pnpm/action-setup/blob/v6/action.yml), [configure-pages 릴리스](https://github.com/actions/configure-pages/releases), [upload-pages-artifact 릴리스](https://github.com/actions/upload-pages-artifact/releases), [deploy-pages 릴리스](https://github.com/actions/deploy-pages/releases).
- 최종 Action 구성의 원격 검증도 성공했다: [최종 Pages 배포](https://github.com/white-base/white-lab-logic/actions/runs/39751655716), 사이트 코드 커밋 `43d4e0a`, build/deploy 전체 46초.
- 데이터 생성 도구를 격리된 임시 출력 위치에서 두 번 실행해 최초 생성과 기존 스냅샷 교체를 모두 확인했다. 원본 저장소와 사이트의 공개 데이터 파일은 이 검증에서 변경하지 않았다.
- 최종 확인 시 가비아 권한 네임서버는 `logic.bindmodel.com`에 NXDOMAIN을 반환했다. 따라서 사용자 CNAME 추가 이후 실제 도메인 접속과 HTTPS 인증서·강제 설정 확인이 남아 있다. Pages 배포 성공을 DNS 연결 완료로 취급하지 않는다.

## 16. 정적 HTML 전환 계획

사용자가 `docs/index.html`이 있는 HTML 방식을 요청했다. 기존 문서와 카탈로그 데이터·기능을 유지하며 게시 소스를 단순화한다.

- [x] 구현 전에 전환 계획을 이 Markdown 파일에 작성.
- [x] `docs/index.html`과 문서·조회 경로의 HTML 파일을 직접 관리.
- [x] 공통 CSS·JavaScript와 JSON 데이터를 `/docs` 안에 배치.
- [x] 기존 문서 검색·모듈 검색·계약/패턴 조회·상세 기능을 순수 JavaScript로 전환.
- [x] VitePress·Vue 의존성과 전용 빌드·배포 설정 제거.
- [x] `main /docs` 직접 게시와 `CNAME`·`.nojekyll` 구성.
- [x] HTML 링크·데이터·검색 테스트 및 브라우저·모바일 검증.
- [x] 변경을 저장소와 GitHub Pages에 반영하고 결과 기록.

문서 본문은 실제 HTML에 포함한다. 작성자용 계획서와 README는 Markdown으로 유지한다. 조회 서비스는 공개 JSON 스냅샷을 브라우저에서 읽으며, 업무 로직·실효 조립 판정의 지원 범위는 그대로 유지한다.

### 16.1 구현 내용

- HTML 파일 33개(홈·문서 24개·조회 7개·404)를 `/docs`에 직접 배치했다.
- 문서·카탈로그 본문과 공통 탐색은 기존 내용을 유지했다. 데이터 디렉터리를 `docs/data`로 옮겼다.
- 브라우저 검색·필터·상세·계약 사례·키보드 탭 이동을 순수 JavaScript로 전환했다.
- VitePress·Vue 설정과 의존성, 기존 Pages artifact workflow를 제거했다. 소스 검증용 `check.yml`만 유지한다.
- 테스트 8개, 데이터 무결성, HTML 640개 내부 링크·자산 경로, 문서 검색 인덱스 24개 검증을 통과했다.
- Chrome에서 한글 모듈 필터, 상세 계약·의존 관계와 키보드 탭 이동, 정확 계약 사례, owner가 다른 UI 패턴 사례, 제공 후보 검색, 문서 검색·이동, 미수집 버전 안내를 확인했다.
- 모바일 390px에서 문서·카탈로그의 가로 넘침이 없고 상단 메뉴·문서 사이드바가 동작함을 확인했다. 콘솔 오류·경고는 없었다.
- 격리한 임시 출력 경로에서 데이터 생성·교체를 두 번 실행해 `docs/data` 출력과 문서 검색 인덱스 보존을 확인했다. 참조 저장소와 공개 스냅샷은 이 검증에서 수정하지 않았다.

### 16.2 게시·도메인 확인 결과

- HTML 구현 커밋 `e9e9047`을 `main`에 반영했다. [원격 자동 검증](https://github.com/white-base/white-lab-logic/actions/runs/39758639669)에서 테스트·데이터·HTML 검사가 모두 성공했다.
- GitHub Pages Source를 **Deploy from a branch**, Branch를 **main**, Folder를 **/docs**로 저장했다. Custom domain은 `logic.bindmodel.com`을 유지했다. 설정 전환 시 GitHub가 생성한 루트 CNAME 커밋 `14f5185`도 로컬에 동기화했다. 실제 게시 소스의 도메인 파일은 `docs/CNAME`이다.
- [브랜치 게시 작업](https://github.com/white-base/white-lab-logic/actions/runs/39758736021)이 성공했다(58초). 프런트엔드 패키지 설치·VitePress 빌드 없이 `/docs`의 정적 파일을 게시했다.
- 사용자가 추가한 `logic → white-base.github.io` CNAME을 가비아 권한 네임서버에서 확인했다. Pages의 DNS 검증도 성공했다.
- 인증서가 유효한 `https://logic.bindmodel.com/`의 HTTP 200과 HTTP→HTTPS 301 전환을 확인했다. Pages의 **Enforce HTTPS**도 저장했다.
- 실제 도메인의 홈·문서·조회 상세 HTML, CSS, JavaScript·공통 모듈, 메타데이터가 로컬 파일과 동일함을 확인했다. Chrome에서도 한글 `블로그` 검색과 UI 필터가 7개 결과를 표시하며 콘솔 오류·경고가 없었다.

공개 주소: **https://logic.bindmodel.com/**. 이후 문서·데이터 변경은 `/docs`를 수정하고 검증한 뒤 `main`에 반영한다.

## 17. 홈페이지 영상 추가 계획

사용자가 제공한 [YouTube 영상](https://www.youtube.com/watch?v=ZZ4Cr58TWk0)을 첫 페이지 하단에 추가한다. 기존 계약 소개 다음, 푸터 앞에 시연 영상 영역을 배치해 문서·카탈로그 탐색 이후 조립 활용 사례를 볼 수 있게 한다.

- [x] 구현 전에 이 Markdown 파일에 위치·방식·검증 계획 기록.
- [x] `docs/index.html` 하단에 제목·소개와 YouTube 임베드, 원본 영상 링크 추가.
- [x] 화면 너비에 맞는 16:9 미리보기, 재생 버튼을 누를 때 플레이어 로딩, 방문 시 자동 재생 없는 구성 적용.
- [ ] HTML 검사 및 데스크톱·모바일 화면 확인 후 GitHub Pages에 반영.

YouTube 공식 oEmbed 응답으로 영상 제목과 임베드 제공 여부를 확인했다. 영상은 주문관리 앱을 모듈 조립으로 작업보드로 바꾸는 내용을 소개한다. 동영상 파일은 저장소에 복사하지 않고 YouTube 플레이어를 사용한다.

검증 브라우저에서 초기 iframe이 빈 화면으로 남는 현상을 확인해, 공식 미리보기 이미지와 재생 링크를 먼저 표시하도록 보완했다. 재생 버튼을 누르면 YouTube iframe을 구성한다. JavaScript를 사용할 수 없는 경우에도 링크로 원본 영상을 볼 수 있다. 갱신한 홈의 CSS·JavaScript URL에는 버전 쿼리를 추가해 기존 브라우저 캐시가 남지 않게 한다.

- `node scripts/validate-site.mjs`와 `git diff --check`를 통과했다.
- 데스크톱과 모바일 390px에서 제목·원본 링크·16:9 영역의 배치를 확인했다. 모바일 문서 너비가 390px로 가로 넘침이 없었다.
- Chrome에서 재생 버튼을 누른 뒤 실제 영상이 페이지 내부에서 재생되고, 영상 컨트롤로 일시중지되는 것을 확인했다.
