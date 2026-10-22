# Logic 사이트 문서

> **상태**: 정적 HTML 전환·게시 완료
> **최종수정**: 2026-10-22

사이트의 진입 파일은 [index.html](index.html)이다. 각 문서·조회 화면은 HTML로 직접 관리하며 `/docs` 폴더를 GitHub Pages에 그대로 게시한다.

- [구성계획서와 진행 기록](site-plan.md)
- [시작하기](start/index.html)
- [조립 가이드](guide/index.html)
- [레퍼런스](reference/index.html)
- [예제](examples/index.html)
- [저장소 실행·검증 안내](../README.md)

공통 디자인은 `assets/site.css`, 탐색·검색·조회 코드는 `assets/js/`, 데이터는 `data/`에서 관리한다. HTML 수정 후 `node scripts/index-docs.mjs`로 문서 검색 인덱스를 갱신한다.

규격의 단일 원본은 `/Volumes/SSD/PJ-Git/logic-runtime-workspace/docs/spec/`다. 계획서와 이 안내는 사이트 메뉴와 문서 검색에서 제외한다.
