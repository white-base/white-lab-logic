---
title: 계약 연결
---

# 계약 연결

<SourceNote path="docs/spec/12-expect-provide.md" />

`expect`는 필요한 기능을, `provide`는 제공하는 기능을 선언합니다. 계약 이름뿐 아니라 scope·owner·도달 범위·요구 수량이 연결을 결정합니다.

## 선언 방향

- DB 모듈·번들과 UI 번들은 flat `expect` 배열을 선언합니다.
- UI 모듈은 expect를 선언하지 않습니다.
- UI 모듈·번들이 `provide.ui`, `provide.db`로 구현 또는 재제공을 선언합니다.
- `provide.reexport`라는 별도 필드는 없습니다.

```json
{
  "expect": [
    "page.title",
    { "contract": "page.actions", "min": 0, "max": 1, "description": "선택 작업 영역" }
  ]
}
```

```json
{
  "provide": { "ui": ["page.title", "page.actions"] }
}
```

두 조각은 각각 소비자와 제공자의 선언 예시입니다. 하나의 완전한 manifest가 아니며, 실제 연결은 조립 위치와 kind 규칙도 충족해야 합니다.

## scope와 owner

| 표기 | 탐색 의미 |
|---|---|
| `page.title` | 로컬 계약. 실효 직계 관계를 기준으로 연결 |
| `api:page.title` | 전역 API 계약. 실효 의존 폐포에서 탐색 |
| `pkg:@scope/name#page.title` | 지정한 패키지 owner의 로컬 계약을 탐색 |

무자격 계약과 `api:` 계약은 정체성이 다릅니다. owner가 다른 로컬 계약도 별도입니다. [계약 문법](/reference/contracts.md)에서 상세 조건을 확인하세요.

## 수량과 재제공

기본 요구 수량은 1개입니다. `?`는 0~1개, `+`는 1개 이상을 요구하며 객체형 min/max로 수량을 표현할 수 있습니다. 수량은 **제공자 수**이며 함수 멤버 개수와 다릅니다.

DB 계열 expect는 전파되지만, 하위 제공을 상위로 보이게 하려면 자신의 `provide.ui`/`provide.db`에 명시적으로 다시 선언해야 합니다.

## 검색 결과를 사용하는 방법

[정확 계약 집계](/contracts/)는 owner를 보존합니다. [UI 기능 패턴](/contracts/patterns/)은 같은 이름의 사례를 모아 보여줍니다. 패턴 사용 수나 제공 선언만으로 구현 호환성을 추정하지 말고 동일 버전의 export와 소비 코드를 확인하세요.
