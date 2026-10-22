---
title: 설치와 첫 조립
---

# 설치와 첫 조립

<SourceNote path="packages/logic-auto-cli/README.md" />

먼저 Node.js와 패키지 매니저를 준비합니다. 아래 명령은 원본 CLI README의 설치 방식입니다. 패키지 배포·접근 환경에 따라 사설 레지스트리 또는 참조 워크스페이스가 필요할 수 있습니다.

## 1. CLI 준비

```sh
mkdir logic-first
cd logic-first
pnpm add -D logic-auto-cli
pnpm exec logic --help
```

## 2. UI 번들 초기화

```sh
pnpm exec logic init --name logic-first --kind ui_bundle --yes
```

`logic.json`, `index.js`와 패키지 정보가 준비됩니다. 기존 `package.json`은 병합하며, 진입점이 쓰는 `logic-runtime`을 자동 설치합니다. 자동 설치가 실패하면 출력된 안내에 따라 런타임을 설치하세요.

워크스페이스 링크를 직접 구성하려면 `--no-install`을 사용하고 런타임을 별도로 연결합니다.

## 3. 선언과 조립 결과 확인

```sh
pnpm exec logic validate --all --strict
pnpm exec logic check
pnpm exec logic tree --contract
```

초기 번들은 아직 기능을 포함하지 않은 출발점입니다. `validate`는 선언을, `check`는 계약과 조립 결과를 검사합니다. CI에서 경고까지 실패로 처리하려면 `logic check --strict`를 사용합니다.

## 4. 모듈 선택

[모듈 조회](/catalog/)에서 종류, 계약, 의존 관계를 확인합니다. 현재 카탈로그의 `@ghost/*`는 원본 워크스페이스에 있는 샘플이므로 공개 npm 설치 명령으로 그대로 사용하지 마세요. 실제 조립은 [워크스페이스 기본 예제](/examples/basic.md)에서 이어갈 수 있습니다.

설치 가능한 패키지를 고른 뒤에는 관계에 따라 다음 형태로 선언합니다.

```sh
# 실제 사용 가능한 패키지 이름으로 바꾸세요.
pnpm exec logic add <package>
pnpm exec logic include <package>
```

## 5. GUI 열기

```sh
pnpm exec logic gui
```

로컬 서버가 현재 조립을 표시합니다. 사이트의 카탈로그와 달리, 로컬 GUI는 실제 프로젝트를 읽고 변경안을 적용할 수 있습니다.

다음은 [조립 흐름](/guide/)과 [기본 예제](/examples/basic.md)입니다.
