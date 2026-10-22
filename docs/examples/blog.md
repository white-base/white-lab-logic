---
title: 블로그 조립과 UI 교체
---

# 블로그 조립과 UI 교체

<SourceNote path="work/modularization-lab/projects/blog-pnpm/docs/demos.md" />

참조 워크스페이스의 `work/modularization-lab/projects/blog-pnpm`은 모듈 조합과 UI 교체를 보여주는 실행 프로젝트입니다. 해당 폴더에서 의존성을 설치한 뒤 실행합니다.

## 기본 블로그

```sh
pnpm install --frozen-lockfile
pnpm demo:default
```

기본 시연은 포트 4320에서 글 목록·상세·작성·관리 화면을 제공합니다. 각 데모는 별도 프로세스와 DB를 사용합니다.

## 댓글 제외

```json
{
  "include": [{ "pkg": "@blog/ui-blog", "alias": "site" }],
  "exclude": ["site/comments", "site/data/comments"]
}
```

```sh
pnpm demo:no-comments
```

포트 4321의 시연에서는 댓글 UI와 대응 DB 경로를 함께 제외합니다. 이미 존재하는 DB 파일의 테이블을 삭제하는 동작이 아닙니다.

## 댓글 UI 교체

```json
{
  "include": [
    { "pkg": "@blog/ui-blog", "alias": "site" },
    { "pkg": "@blog/ui-comments-compact", "path": "site/comments" }
  ]
}
```

```sh
pnpm demo:compact-comments
```

포트 4322에서 같은 경로의 표준 댓글을 compact UI로 교체합니다. 별도 exclude 없이 기존 include 자리를 바꿉니다.

## 스키마·이동성 확인

```sh
pnpm schema:plan
pnpm verify
pnpm verify:portable
```

원본 검증은 별도 임시 DB와 시연 프로젝트를 대상으로 합니다. 이 사이트의 카탈로그는 해당 업무 코드·실행 결과를 그대로 호스팅하지 않습니다.
