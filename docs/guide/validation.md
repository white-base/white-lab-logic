---
title: 검증과 문제 해결
---

# 검증과 문제 해결

<SourceNote path="packages/logic-auto-cli/README.md" />

선언 형식과 조립 결과를 따로 검사하면 문제의 위치를 찾기 쉽습니다.

## 두 검사 명령

| 명령 | 확인 내용 |
|---|---|
| `logic validate` | manifest 선언·kind 조합·경로와 정합성 |
| `logic check` | 조립 결과의 계약 충족·수량·mutex·resolve |
| `logic tree --contract` | Context 트리와 계약 연결 근거 |

```sh
logic validate --all --strict
logic check --strict
logic tree --contract --format json
```

`validate`는 패키지 설치·DB 접속·index.js 로딩을 하지 않습니다. `check`는 조립 결과를 검사하며 필수 계약 미충족 등은 기본적으로 경고일 수 있습니다. CI에서 경고를 실패로 처리하려면 strict 모드를 사용합니다.

## Stage 해석

| 단계 | 의미 |
|---|---|
| Stage 1 | 알림·경고. 조립 계속 |
| Stage 2 | 해결할 조립 조건에 대한 경고 |
| Stage 3 | 무결성 위반 등으로 중단 |

검사에서의 경고와 실제 동적 주입 시점의 중단은 다를 수 있습니다. 동적 module loader는 최소 제공자 수 미달이면 부분 주입하지 않고 중단합니다.

## 진단 순서

1. 오류의 `code`, `stage`, `path`, `hint`를 확인합니다.
2. `package.json`과 `logic.json`이 같은 디렉터리에 있는지 확인합니다.
3. DB/UI 대상이 올바른 depend 칸에 있는지 확인합니다.
4. 경로가 패키지 이름이 아닌 Context key인지 확인합니다.
5. scope·owner·수량과 reject/accept를 확인합니다.
6. 같은 버전의 실제 export와 소비 코드를 확인합니다.

[오류와 버전](/reference/diagnostics.md) · [허용·거부](/guide/policies.md)
