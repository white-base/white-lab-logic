---
title: 제외와 교체
---

# 제외와 교체

<SourceNote path="docs/spec/10-assembly-rules.md" />

하위 번들의 원본을 수정하지 않고 엔트리에서 include 경로를 제어할 수 있습니다. 경로는 패키지 이름이 아닌 **Context key를 `/`로 연결한 전체 경로**입니다.

## 선택 조합 제외

```json
{
  "exclude": ["site/comments", "site/data/comments"]
}
```

예시는 블로그의 댓글 UI와 대응 DB 경로를 함께 제외합니다. UI만 제거해 계약 요구가 남는 경우에는 조립 검사가 실패할 수 있습니다. 이미 존재하는 DB 테이블을 삭제하는 동작은 아닙니다.

```sh
logic exclude --path site/comments
logic exclude --path site/comments --remove
```

## 같은 자리에 교체

```json
{
  "include": [
    { "pkg": "@blog/ui-blog", "alias": "site" },
    { "pkg": "@blog/ui-comments-compact", "path": "site/comments" }
  ]
}
```

기존 include 경로를 지정하면 해당 자리를 교체합니다. 별도 exclude는 필요하지 않습니다. 빈 경로 자리를 지정하면 새 include를 추가합니다. depend로 연결된 자리는 교체할 수 없습니다.

```sh
logic include <replacement-package> --path site/comments
```

## 바꾸기 전 확인

- 기존 소비자가 요구하는 계약과 새 모듈의 제공 선언을 대조합니다.
- 실제 export 구조와 실행 환경이 맞는지 확인합니다.
- 교체 후 `logic validate`, `logic check`, `logic tree --contract`로 결과를 확인합니다.

실제 시연: [블로그 조립 예제](/examples/blog.md)
