---
title: 의존과 포함
---

# 의존과 포함

<SourceNote path="docs/spec/10-assembly-rules.md" />

`depend`는 조립의 정체성에 필요한 강한 의존입니다. `include`는 번들이 구성하고 사용자가 제외·교체할 수 있는 조합입니다.

## 관계 선택

| 상황 | 선언 |
|---|---|
| 코드가 직접 호출하는 모듈 | `depend` |
| 참조 테이블을 소유한 필수 DB 모듈 | `depend.db` |
| 선택 가능한 화면이나 기능 | 번들의 `include` |

```json
{
  "kind": "ui_bundle",
  "depend": {
    "db": ["@ghost/db-blog-publishing"],
    "ui": ["@ghost/ui-blog-public"]
  },
  "include": [{ "pkg": "@ghost/ui-blog-editor", "alias": "editor" }]
}
```

객체형 패키지 참조는 `pkg`를 사용합니다. 패키지 설치와 `package.json.dependencies`도 해당 선언과 일치해야 합니다.

## kind 조합표

| 호스트 | depend 대상 | include 대상 |
|---|---|---|
| DB 모듈 | DB 모듈 | 없음 |
| DB 번들 | DB 모듈·DB 번들 | DB 모듈·DB 번들 |
| UI 모듈 | UI 모듈·DB 모듈·DB 번들 | 없음 |
| UI 번들 | 네 kind 모두 | 네 kind 모두 |

DB 대상은 `depend.db`, UI 대상은 `depend.ui`에 넣습니다. 올바른 kind 조합이어도 칸이 다르면 `E_DEPEND_BUCKET_MISMATCH`로 중단합니다.

## DB를 추가하면 요구도 늘어납니다

DB 계열의 expect는 조립을 통해 전파될 수 있습니다. 기능만 늘어난다고 생각하지 말고 추가된 계약을 제공할 UI도 함께 확인하세요.

다음: [제외와 교체](./replacement.md) · [계약 연결](./contracts.md)
