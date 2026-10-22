---
title: 쇼핑몰·ERP 카탈로그 탐색
---

# 쇼핑몰·ERP 카탈로그 탐색

<SourceNote path="packages/logic-server/ghost/README.md" />

Ghost의 쇼핑몰과 ERP 데이터는 검색·조립 탐색을 위한 메타데이터 시나리오입니다. 결제·재고·전표 등의 실제 업무 구현을 제공하지 않습니다.

## 쇼핑몰

[커머스 모듈 보기](/catalog/?domain=commerce)

상품·주문·결제·재고의 DB 모듈과 storefront·checkout UI를 비교하세요. 주문 DB를 더하면 채워야 할 결제·재고 계약이 함께 늘어날 수 있습니다.

```sh
pnpm --filter logic-server ghost:cli -- search --kind db_module --expect api:commerce.payment.authorize
```

## ERP

[ERP 모듈 보기](/catalog/?domain=erp)

영업·재무 구성과 K-GAAP/IFRS 대안을 살펴봅니다. 서로 배타적인 조합과 다음 추천 모듈을 구분합니다.

```sh
pnpm --filter logic-server ghost:cli -- search --kind ui_module --provide api:erp.finance.posting
pnpm --filter logic-server ghost:cli -- recommend
```

## 확인할 질문

1. 모듈을 선택할 때 새로 생기는 요구는 무엇인가요?
2. DB 소유권과 UI 제공 책임은 어디에 있나요?
3. 대안 구현을 바꿔도 실제 export 구조와 의미가 유지되나요?
4. 등록 선언과 사용처의 exclude·reject를 반영한 결과는 어떻게 다른가요?

[계약 집계](/contracts/)와 [제공 선언 후보](/contracts/providers/)를 오가며 필요한 조각을 찾아보세요.
