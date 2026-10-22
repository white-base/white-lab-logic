---
title: 인스턴스와 설정
---

# 인스턴스와 설정

<SourceNote path="docs/spec/20-module-prop.md" />

모듈의 기본 설정은 `prop`, 사용하는 위치의 변경은 `config`로 표현합니다. 설정을 바꿔도 expect 충족 규칙은 바뀌지 않습니다.

## 기본값과 사용처 값

```json
{
  "kind": "ui_module",
  "family": "title",
  "provide": { "ui": ["view.title"] },
  "prop": { "text": "제목", "visible": true }
}
```

```json
{
  "include": [{ "pkg": "@shop/title", "alias": "header_title" }],
  "config": [{ "path": "header_title", "prop": { "text": "관리자" } }]
}
```

기본 모듈은 유지하고, 사용하는 scope의 prop만 변경합니다. 기본값 → 가까운 번들 → 상위 엔트리 설정 순으로 적용합니다.

## config 선택자

| 선택자 | 처리 |
|---|---|
| `header` | 해당 위치의 값을 덮어쓰기 |
| `*header` | 기존 값을 유지하며 병합 |
| `header+` | 해당 위치와 모든 하위에 적용 |
| `header-` | 같은 config 항목의 적용 범위에서 제외 |

config의 path 배열은 **각각 독립된 전체 경로**입니다. include.path의 segment 배열과 혼동하지 마세요.

## static과 instance

static 모듈은 공유 Context로 동작하고, instance 모듈은 실제 Context별 상태와 식별을 구분합니다. alias는 사용처 경로, instanceId는 물리 식별에 사용됩니다.

GUI는 static 카드와 instance별 사용처를 구분해 표시합니다. 복제는 원본의 DB 데이터나 동적 추가 결과를 자동 복사하지 않습니다. 실제 인스턴스 동작은 원본 규격과 소비 환경에서 확인하세요.
