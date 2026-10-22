# Logic 사이트 문서

> **상태**: 1차 구현
> **최종수정**: 2026-10-22

`logic.bindmodel.com`에서 제공할 조립 문서·모듈 및 계약 조회 사이트의 원고와 계획을 이 폴더에서 관리한다.

- [사이트 구성계획서](site-plan.md): 초안 메뉴, 페이지 구조, 조회 서비스, 데이터 제공 방식, 단계별 구현·배포 계획.
- [시작하기](start/index.md): 개념과 첫 조립.
- [조립 가이드](guide/index.md): 의존·교체·계약·스키마·검증.
- [레퍼런스](reference/index.md): Manifest·CLI·런타임·공개 API.
- [예제](examples/index.md): 기본·블로그·도메인 탐색.

조립 규격과 예제는 `/Volumes/SSD/PJ-Git/logic-runtime-workspace/`의 문서를 참조한다. 규격의 단일 원본은 해당 저장소의 `docs/spec/`이며, 이 저장소에서는 공개용 설명과 탐색 기능을 구성한다.

모듈·계약 화면은 `catalog/`, `contracts/`의 Markdown 경로와 `.vitepress/theme/components/`의 Vue 컴포넌트로 구현한다. 샘플 스냅샷은 `public/data/`에 저장한다. 실행과 갱신 명령은 저장소 README를 참조한다.

이 안내와 구성계획서는 작성자용이며 공개 페이지·문서 검색 대상에서 제외한다.
