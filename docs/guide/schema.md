---
title: DB 스키마 조립
---

# DB 스키마 조립

<SourceNote path="docs/spec/bindmodel_schema_relations_v0.1.md" />

DB 모듈이 소유한 테이블과 번들이 선언한 관계를 조합합니다. 카탈로그의 테이블 목록은 등록 메타데이터이며 실제 사용 DB를 조회한 결과가 아닙니다.

## 관계의 책임

- `schema.relation`: 테이블 사이 관계 선언.
- `schema.extend`: 조합에서 필요한 확장 선언.
- `schema.reference`: 다른 모듈의 테이블 참조.
- `schema.naming` / `schema.recreate`: 물리 명명과 재생성 설정.

참조되는 테이블의 소유 모듈은 빠지면 안 되므로 `include` 대신 `depend.db`로 선언합니다. 세부 필드 형태는 [Manifest 레퍼런스](/reference/manifest.md)의 원본 링크를 기준으로 작성하세요.

## 계획과 차이 확인

```sh
logic schema plan --vendor sqlite --stdout
logic schema diff --sqlite .logic/app.sqlite --exit-code
```

`plan`은 DB에 접속하지 않고 DDL 계획을 만듭니다. `diff`는 기존 DB와의 차이를 보여주고, `--exit-code`는 반영할 변경이 있을 때 종료 코드 1을 반환합니다.

## 실제 반영

```sh
logic schema sync --sqlite .logic/app.sqlite
```

`sync`는 SQLite 파일을 실제로 변경합니다. 대상 DB와 변경 계획을 확인한 후 실행하세요. UI entry별 지원 범위는 예제의 검증 문서를 확인합니다.

관계/FK 그래프는 순환을 허용하지만 패키지 의존 그래프는 비순환이어야 합니다. 두 그래프를 구별해 문제를 진단하세요.
