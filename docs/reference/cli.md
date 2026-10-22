---
title: CLI 명령어
---

# CLI 명령어

<SourceNote path="packages/logic-auto-cli/README.md" />

CLI 패키지는 `logic-auto-cli`, 실행 명령은 `logic`입니다. 설치한 버전의 `logic --help`와 원본 README가 상세 옵션의 기준입니다.

## 명령 지도

| 목적 | 명령 |
|---|---|
| 시작 | `logic init` |
| 구성 | `add`, `include`, `remove`, `exclude` |
| 계약 후보 정책 | `reject`, `accept` |
| 하위 별칭 | `link` |
| 정보 | `info`, `detail`, `table`, `tree`, `why` |
| 검사 | `validate`, `check`, `contract`, `recommend` |
| 화면 | `gui` |
| 레지스트리 조회 | `search`, `view` |
| 회원·발행 | `register`, `login`, `logout`, `whoami`, `publish`, `unpublish` |
| 설정 | `config`, `set`, `unset` |
| DB | `schema plan`, `diff`, `sync`, `relation`, `reference`, `extend`, `naming`, `recreate` |

## 자주 쓰는 조회

```sh
logic tree --contract
logic tree --contract --format json
logic search -s 주문,결제 --kind db --all
logic search -p api:member.login
logic view @ghost/ui-blog-cms --versions --dependents
```

## 레지스트리 선택

`--registry <url>` → `LOGIC_REGISTRY` → 기본 `http://127.0.0.1:3000` 순서입니다. 검색·상세 조회는 로그인 없이 사용할 수 있고, 발행·취소는 토큰과 소유권이 필요합니다.

`logic remove`는 로컬 의존 선언 제거이며 `logic unpublish`는 레지스트리 출판 취소입니다. 동작 대상을 구분하세요.

## 조립 검증

```sh
logic validate --all --strict
logic check --strict
```

[검증 가이드](/guide/validation.md)에서 기본 경고와 strict 동작의 차이를 확인하세요.
