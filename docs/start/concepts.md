---
title: 구성 요소와 용어
---

# 구성 요소와 용어

<SourceNote path="docs/spec/10-assembly-rules.md" />

모듈은 독립적인 책임을, 번들은 선택한 모듈의 조합을 표현합니다. 각 패키지의 `logic.json`이 조립 방식을 선언합니다.

## 네 가지 kind

| kind | 역할 | include 선언 |
|---|---|---|
| `db_module` | 데이터 스키마·업무 기능 | 불가 |
| `db_bundle` | DB 모듈·번들 조합 | DB 계열만 |
| `ui_module` | UI 구현·실행 환경 제공 | 불가 |
| `ui_bundle` | UI와 DB를 조립하는 구성 | 네 kind 모두 |

DB 계열은 UI에 역방향 의존하지 않습니다. 패키지 의존 그래프는 비순환이어야 하지만, 테이블 관계/FK 그래프의 순환은 허용됩니다.

## 선언을 읽는 순서

```json
{
  "engine": "1.0.0",
  "kind": "ui_bundle",
  "family": "blog.cms",
  "depend": { "db": ["@ghost/db-blog-publishing"] },
  "include": ["@ghost/ui-blog-editor"],
  "expect": ["blog.editor.toolbar"]
}
```

위 예시는 블로그 DB에 강하게 의존하고 편집 UI를 선택 조합으로 포함하며, toolbar 계약을 요구합니다. 실제 사용에는 `package.json`의 패키지 정보와 의존 설치도 필요합니다.

## 자주 쓰는 용어

| 용어 | 의미 |
|---|---|
| Manifest | `logic.json`에 담긴 조립 선언 |
| kind | DB/UI 모듈·번들의 종류 |
| family | 모듈 계열을 나타내는 논리 이름 |
| namespace | 분류와 선택에 쓰는 그룹 라벨 |
| Context | 런타임에서 모듈과 하위 조립에 접근하는 객체 |
| expect | 소비자가 요구하는 계약 |
| provide | UI 계열이 구현·재제공하는 계약 |
| engine | Manifest 형식·조립 규칙의 버전 |
| alias / path | 사용처 이름 / 하위 Context key를 이은 경로 |

[의존과 포함](/guide/dependencies.md)에서 변경 가능한 조합과 강한 의존의 차이를 이어서 확인하세요.
