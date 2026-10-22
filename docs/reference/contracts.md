---
title: 계약 문자열
---

# 계약 문자열

<SourceNote path="docs/spec/18-contract-namespace-syntax.md" />

계약 축(expect/provide)과 네임스페이스 축(namespace/mutex/recommend)은 목적과 파서 프로파일이 다릅니다.

## 계약 표기

| 예시 | 의미 |
|---|---|
| `page.title` | 로컬 계약 |
| `api:page.title` | 전역 API 계약 |
| `pkg:@scope/owner#page.title` | owner를 지정한 로컬 계약 |
| `api:?page.actions` | 전역 API, 선택 요구 0~1 |
| `api:+page.item` | 전역 API, 요구 1개 이상 |

수량한정자는 scope 뒤에 둡니다. expect만 수량을 선언할 수 있으며 provide에는 min/max를 쓰지 않습니다.

## 와일드카드

provide는 꼬리 와일드카드로 경로를 제공할 수 있습니다. 신규 expect는 구체 경로를 선언합니다.

| provide 패턴 | 경로 범위 |
|---|---|
| `page.*` | 정확히 한 단계 하위 |
| `page.**` | 한 단계 이상 하위 |

두 패턴 모두 자기 자신인 `page`를 포함하지 않습니다. 경로 일치는 매칭의 한 조건일 뿐이며 scope·owner·도달 범위·수량을 별도로 적용합니다.

## 정확한 키와 기능 패턴

무자격 `page.title`의 정규화 키에는 선언 owner가 포함됩니다. A와 B의 계약 키는 서로 다릅니다. UI 기능 패턴 조회는 이름 사용 사례를 탐색하려고 같은 scope·경로를 묶지만 계약의 정체성은 바꾸지 않습니다.

## 피해야 할 표기

- 폐기된 `ns:` 대신 계약에는 `api:`를 사용합니다.
- 신규 expect에서 와일드카드를 정의하지 않습니다.
- 수량을 export 멤버 개수로 해석하지 않습니다.
- namespace를 계약 키와 같은 식별자로 취급하지 않습니다.
