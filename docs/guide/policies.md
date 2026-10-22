---
title: 허용·거부와 링크
---

# 허용·거부와 링크

<SourceNote path="docs/spec/19-provider-reject.md" />

모듈 자체를 제외하는 것과 특정 계약 후보만 거부하는 것은 다른 작업입니다. 제공자 정책은 최상위 overlay로 선언합니다.

## reject와 accept

```json
{
  "reject": [{ "path": "page/style", "contracts": ["api:page.screen"] }],
  "accept": [{ "path": "page/style", "contracts": ["view.theme"] }]
}
```

`reject`는 지정한 edge의 패키지 자신의 provide 중 해당 계약만 후보에서 제외합니다. 그 패키지의 자손 provide까지 거부하는 의미는 아닙니다. `accept`는 상위 사용 경로에서 하위 거부를 다시 허용합니다.

상위 선언이 우선하고, 같은 단계에서는 exact 토큰이 `*`보다 우선합니다. 같은 경로·토큰을 accept와 reject에 동시에 선언하면 충돌입니다.

```sh
logic reject api:page.screen --path page/style
logic accept view.theme --path page/style
```

## link: 이미 조립된 위치에 이름 붙이기

```json
{
  "link": [{ "alias": "heading", "path": "main/header" }]
}
```

코드에서는 `ctx.link.heading`으로 해당 scoped Context에 접근합니다. link는 새 edge나 패키지 설치를 만들지 않습니다. 경로는 두 segment 이상이어야 하며, 실제 조립에서 경로가 사라지면 오류가 됩니다.

```sh
logic link --path main/header --alias heading
logic link --alias heading --remove
```

link가 걸린 경로는 CLI에서 바로 exclude할 수 없습니다. 링크를 먼저 정리하고 검증하세요.
