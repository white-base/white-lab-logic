# white-lab-logic

`logic.bindmodel.com`의 Logic 조립 문서·모듈 및 계약 조회 사이트입니다. **`docs/index.html`이 실제 진입 파일**이며 `/docs`의 HTML·CSS·JavaScript·JSON을 GitHub Pages에서 그대로 제공합니다.

## 파일 구조

```text
docs/
├── index.html              # 홈
├── start/                  # 시작하기 HTML
├── guide/                  # 조립 가이드 HTML
├── reference/              # 레퍼런스 HTML
├── examples/               # 조립 예제 HTML
├── catalog/                # 모듈 검색·상세 HTML
├── contracts/              # 계약·UI 패턴 조회 HTML
├── assets/site.css         # 공통 디자인
├── assets/js/              # 공통 탐색·검색·조회 JavaScript
├── data/                   # 공개 JSON 스냅샷·문서 검색 인덱스
├── CNAME                   # logic.bindmodel.com
└── .nojekyll               # 정적 파일 직접 게시
```

## 로컬 확인

프런트엔드 패키지 설치나 빌드 과정 없이 실행합니다. JSON 조회가 동작하도록 HTTP 서버로 확인하세요. Node.js 22 이상을 사용하는 미리보기 명령입니다.

```sh
node scripts/serve.mjs
# http://127.0.0.1:4173/index.html
```

`pnpm dev`와 `pnpm preview`도 같은 서버를 실행합니다. 다른 포트는 `node scripts/serve.mjs --port 5000`으로 지정합니다.

## 문서 수정과 검증

각 `.html`의 본문을 직접 수정합니다. 문서 본문은 JavaScript 없이도 표시됩니다. 메뉴·사이드바를 변경하면 해당 HTML 링크도 함께 갱신합니다.

```sh
node scripts/index-docs.mjs       # HTML에서 문서 검색 인덱스 갱신
node --test tests/*.test.mjs
node scripts/validate-data.mjs
node scripts/validate-site.mjs
```

검증은 HTML 33개, 내부 링크·자산 경로, 문서 검색 인덱스와 카탈로그 참조를 확인합니다. 문서·예제 24개와 조회 경로 7개를 제공합니다. `pnpm test`, `pnpm check`, `pnpm search:index`도 사용할 수 있습니다.

## 조회 데이터

현재 카탈로그는 `logic-runtime-workspace`의 Ghost 샘플입니다. 모듈·번들 60개, 정확 계약 그룹 45개, UI 기능 패턴 26개, 제공 선언 86개를 포함합니다. 실제 업무 로직이나 공개 npm 배포 패키지를 뜻하지 않습니다.

데이터를 갱신할 때만 원본 워크스페이스와 그 의존성이 필요합니다.

```sh
node scripts/generate-data.mjs ../logic-runtime-workspace
node scripts/validate-data.mjs
```

기존 레지스트리 조회 로직을 메모리 DB에서 실행하고 공개 메타데이터만 저장합니다. 원본 저장소와 사용 중인 DB는 변경하지 않습니다. `docs/data/meta.json`에 출처·참조 커밋·수집 기준을 기록합니다. 레지스트리 데이터 재생성 시 문서 검색 인덱스도 보존합니다.

## GitHub Pages

- Source: **Deploy from a branch**
- Branch: **main**, Folder: **/docs**
- Custom domain: **logic.bindmodel.com**
- 가비아 DNS: **CNAME logic → white-base.github.io**

`main`에 HTML을 반영하면 GitHub Pages가 `/docs`를 직접 게시합니다. `.github/workflows/check.yml`은 소스 검증만 담당하며 프런트엔드 빌드·artifact 배포를 수행하지 않습니다. 2026-10-22에 DNS·인증서·Enforce HTTPS와 실제 사이트 접속을 확인했습니다.

규격의 단일 원본은 `logic-runtime-workspace/docs/spec/`입니다. [구성계획서와 진행 기록](docs/site-plan.md), [문서 안내](docs/README.md)를 참고하세요.
