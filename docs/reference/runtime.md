---
title: 런타임 API
---

# 런타임 API

<SourceNote path="packages/logic-runtime/README.md" />

`logic-runtime`은 모듈 작성자가 사용하는 파사드입니다. 조립 코어와 UI/SQL Context API를 제공합니다.

## define

```js
import { define } from 'logic-runtime';

export default define(import.meta, (ctx) => {
  // Context 설정과 계약 등록
});
```

## 포함 모듈 접근

```js
import * as entry from './index.js';

const ctx = entry.default;
ctx.bindModule(entry);

const [menu] = ctx.getIncludedModules('assem.shell.menu');
if (menu) {
  await menu.module.renderMenuRegion({ ctx: menu.ctx });
}
```

`getIncludedModules(contract?)`는 현재 Context의 실효 include에서 expect를 충족하는 항목을 반환합니다. 각 항목은 `{ contract, pkg, ctx, module }`이며 `module`은 최초 import의 ESM namespace입니다.

하위 bundle의 render 함수에는 반환된 scoped `ctx`를 넘깁니다. 이 Context는 부모 path와 exclude를 보존하며, 조회를 위해 module을 다시 import하거나 manifest를 읽지 않습니다.

## 계약과 export 구조

provide 이름은 선택할 Context를 결정합니다. named export 형태와 동작 규칙은 소비자가 요구하는 인터페이스로 정합니다. 현재 런타임의 계약 매칭을 export 멤버 구조의 자동 검증으로 해석하지 마세요.

실제 render 함수명은 소비 계약마다 다릅니다. 위 `renderMenuRegion`을 모든 모듈의 공통 메서드로 가정하지 않습니다.
