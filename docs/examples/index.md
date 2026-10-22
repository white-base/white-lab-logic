---
title: 조립 예제
---

# 조립 예제

<SourceNote path="packages/logic-server/ghost/README.md" />

직접 조립하는 예제와 검색용 카탈로그를 구별해 살펴보세요.

| 예제 | 무엇을 확인하나요? | 실행·데이터 성격 |
|---|---|---|
| [기본 조립](./basic.md) | 선언·계약·트리와 로컬 GUI | 참조 워크스페이스의 Ghost 조립 |
| [블로그](./blog.md) | 댓글 제외·교체, 데이터 기능 재사용 | blog-pnpm 실제 시연 프로젝트 |
| [쇼핑몰·ERP](./domains.md) | 도메인별 모듈·계약·대안 검색 | 업무 로직 없는 Ghost 메타데이터 |

## 현재 카탈로그의 범위

조회 화면은 `logic-runtime-workspace/packages/logic-server/ghost/`의 공개 등록 대상 패키지를 기존 레지스트리 로직으로 정규화한 스냅샷입니다. private 소비자 root는 제외합니다.

Ghost 패키지는 실제 package.json·logic.json 디렉터리를 갖지만 업무 로직을 제공하지 않습니다. DB module의 선택적 tables.json은 등록용 직접 테이블 메타데이터입니다.

`@ghost/*`와 `@fixture/*`는 공개 npm 레지스트리의 배포 패키지로 안내하지 않습니다. 원본 워크스페이스 접근과 의존 설치가 필요한 샘플입니다.

## 버전과 확인 범위

페이지의 원본 링크는 문서 작성 시 참조한 커밋을 가리킵니다. 예제 문서에 기록된 검증과 이 사이트 자체의 빌드·조회 검증은 별개입니다. 카탈로그만으로 실제 비즈니스 실행이나 호환성을 보장하지 않습니다.
