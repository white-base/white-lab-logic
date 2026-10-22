---
title: 기본 조립 살펴보기
---

# 기본 조립 살펴보기

<SourceNote path="packages/logic-server/ghost/README.md" />

Ghost 워크스페이스에서 카탈로그 검색과 계약 트리를 확인합니다. 원본 저장소에 접근할 수 있어야 하며, 업무 기능을 실행하는 예제는 아닙니다.

## 1. 워크스페이스 준비

원본 `logic-runtime-workspace` 저장소를 준비하고 루트에서 실행합니다.

```sh
pnpm install --frozen-lockfile
```

## 2. Ghost 레지스트리 준비

```sh
pnpm --filter logic-server seed:ghost
pnpm --filter logic-server start:ghost
```

샘플 서버는 기본 포트 3001을 사용합니다. 기존 사용 DB와 구분된 Ghost 레지스트리를 사용하세요.

## 3. 다른 터미널에서 조회

```sh
pnpm --filter logic-server ghost:cli -- search --kind ui --all
pnpm --filter logic-server ghost:cli -- view @ghost/ui-blog-cms
pnpm --filter logic-server ghost:cli -- tree --contract
pnpm --filter logic-server ghost:cli -- check
```

`ghost:cli`는 준비된 ghost-workbench를 기준으로 실행하고 Ghost 레지스트리에 연결합니다. CLI `search`는 조립 문맥의 영향을 받을 수 있고 `--all`은 전체 후보를 살펴보는 데 사용합니다.

## 4. 웹 카탈로그와 대조

[블로그 CMS 상세](/catalog/package/?name=%40ghost%2Fui-blog-cms&version=1.0.0)에서 다음 내용을 비교합니다.

- DB와 UI에 대한 depend 선언.
- editor UI에 대한 include 선언.
- 필수 toolbar와 선택 comment 계약.
- 등록 선언과 로컬 실효 트리의 차이.

이후 [블로그 실행 예제](./blog.md)에서 실제 화면·DB 기능을 살펴보세요.
