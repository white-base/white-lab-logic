---
title: CLI와 GUI
---

# CLI와 GUI

<SourceNote path="packages/logic-gui/README.md" />

CLI와 로컬 GUI는 같은 조립 프로젝트를 다루는 도구입니다. 웹 카탈로그는 패키지를 탐색하는 공개 조회 화면입니다.

## CLI의 기본 순서

```sh
logic info
logic validate
logic check
logic tree --contract
```

`logic search`와 `logic view`는 레지스트리에 질의합니다. 로컬 조립을 읽는 명령과 연결 대상을 구분하세요.

```sh
logic search -s 블로그 --kind ui --all
logic view @ghost/ui-blog-cms --versions
```

Ghost 샘플은 원본 워크스페이스의 Ghost 레지스트리를 기동한 뒤 조회합니다.

## GUI 실행

```sh
logic gui
logic gui --port 5000 --no-open
```

현재 조립 루트를 로컬 서버로 엽니다. 기본 host는 loopback이며, 실행·저장에는 기동 시 생성한 세션 토큰을 사용합니다. 표시되는 토큰 URL은 해당 로컬 세션에서 사용하세요.

## 변경 미리보기와 적용

GUI는 모듈 추가·교체·제외와 계약 정책을 가상 변경으로 계산하고, 적용 시 대응하는 CLI 명령을 실행합니다. 미리보기와 적용을 구분해 결과를 확인합니다.

레지스트리에 연결되지 않아도 로컬 조립과 검증은 동작할 수 있습니다. 온라인 후보 검색은 별도의 레지스트리 연결이 필요합니다.

전체 명령은 [CLI 레퍼런스](/reference/cli.md)에서 확인하세요.
