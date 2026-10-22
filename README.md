# white-lab-logic

`logic.bindmodel.com`에서 제공하는 Logic 조립 문서와 모듈·계약 조회 사이트입니다. `/docs`의 Markdown과 Vue 컴포넌트를 VitePress로 빌드하고 GitHub Pages에 게시합니다.

## 로컬 실행

Node.js 22 이상과 pnpm 11.11.0을 사용합니다.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

```sh
pnpm test
pnpm build
pnpm preview
```

`pnpm build`는 저장된 스냅샷의 무결성을 검사한 뒤 `docs/.vitepress/dist`를 생성합니다. 시작하기·가이드·레퍼런스·예제 24개 문서, 모듈과 계약을 탐색하는 7개 조회 경로를 제공합니다.

## 조회 데이터

현재 데이터는 `logic-runtime-workspace`의 Ghost 샘플입니다. 모듈·번들 60개, 정확 계약 그룹 45개, UI 기능 패턴 26개와 최신 버전 제공 선언 86개를 포함합니다. 실제 업무 로직·운영 DB·공개 npm 배포 여부를 보장하지 않습니다.

사이트 빌드는 원본 저장소나 실행 중인 API에 의존하지 않습니다. 데이터를 갱신할 때만 원본 워크스페이스와 그 의존성이 필요합니다.

```sh
pnpm data:generate ../logic-runtime-workspace
pnpm data:validate
pnpm test
pnpm build
```

추출 도구는 기존 레지스트리 로직을 메모리 DB에서 실행합니다. 공개 조회 API의 전체 페이지를 수집하고 검증한 후 스냅샷 디렉터리를 교체합니다. 기존 사용 DB는 변경하지 않습니다. 출처·커밋·생성 시각·수집 범위는 `docs/public/data/meta.json`에 기록합니다.

## GitHub Pages

1. 저장소 `Settings → Pages → Source`를 **GitHub Actions**로 설정합니다.
2. Custom domain을 `logic.bindmodel.com`으로 설정합니다.
3. DNS에서 `logic`의 CNAME이 `white-base.github.io`를 가리키는지 확인합니다.
4. `main`에 반영하면 `.github/workflows/pages.yml`이 테스트·빌드 후 게시합니다. PR에서는 검증만 수행합니다.
5. 인증서 발급 후 Enforce HTTPS를 켭니다.

커스텀 도메인은 `/`를 기본 경로로 사용합니다. 저장소 하위 경로로 별도 게시하려면 `SITE_BASE=/white-lab-logic/ pnpm build`처럼 지정하세요. Actions 방식에서는 CNAME 파일 대신 Pages 설정에서 도메인을 연결합니다.

## 문서 관리

규격의 단일 원본은 `logic-runtime-workspace/docs/spec/`입니다. 사이트 문서는 원본 파일과 참조 커밋을 표시합니다. 작성자용 `docs/README.md`와 `docs/site-plan.md`는 빌드·문서 검색에서 제외합니다.

- [사이트 구성계획서](docs/site-plan.md)
- [문서 안내](docs/README.md)
