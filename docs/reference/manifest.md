---
title: logic.json
---

# logic.json

<SourceNote path="docs/spec/logic-json-schema-reference.md" />

`logic.json`은 패키지의 조립 방식을 선언합니다. `package.json`이 필수이며 패키지 이름·버전의 단일 원본입니다.

## 주요 필드

| 필드 | 의미 |
|---|---|
| `engine` | Manifest 형식·조립 규칙 버전 |
| `kind` | 네 가지 모듈·번들 종류 |
| `family`, `namespace` | 모듈 계열·그룹 분류 |
| `depend.db`, `depend.ui` | DB/UI 강한 의존 |
| `include` | 번들의 선택 조합 |
| `exclude` | 제외할 include의 전체 경로 |
| `expect` | flat 요구 계약 배열 |
| `provide.ui`, `provide.db` | UI 계열의 제공·재제공 |
| `reject`, `accept` | 경로별 제공 후보 정책 |
| `link` | 기존 하위 Context 경로의 별칭 |
| `instance` | 인스턴스 모듈 선언 |
| `prop`, `propSchema`, `config` | 기본 설정·검증·사용처 변경 |
| `schema` | DB 관계·확장·참조·명명 설정 |
| `mutex`, `recommend` | 상호 배타·추천 선택자 |

## 패키지 참조

```json
{
  "engine": "1.0.0",
  "kind": "ui_bundle",
  "family": "example.app",
  "depend": { "db": ["@scope/data"] },
  "include": [{ "pkg": "@scope/view", "alias": "view" }]
}
```

객체형 참조의 패키지 키는 `pkg`입니다. 과거 `name` 표기는 읽기 호환용이며 새로 작성하지 않습니다.

`schema`는 DB 구조 선언입니다. manifest 형식 버전을 뜻하던 옛 필드명과 혼동하지 말고 버전은 `engine`에 기록하세요.

상세 규격은 원본 문서와 [조립 kind 표](/guide/dependencies.md), [계약 문법](./contracts.md), [사용처 설정](/guide/configuration.md)을 함께 확인하세요.
