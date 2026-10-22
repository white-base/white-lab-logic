---
title: 조립 가이드
---

# 조립 가이드

<SourceNote path="docs/spec/10-assembly-rules.md" />

조립은 **모듈 선택 → 관계 선언 → 계약 확인 → 검증**의 순서로 진행합니다. 먼저 데이터 책임과 교체할 UI 책임을 구분하세요.

## 기본 흐름

1. [모듈 조회](/catalog/)에서 DB/UI 모듈·번들을 찾습니다.
2. 빠지면 조립이 깨지는 관계는 [depend](/guide/dependencies.md)로 선언합니다.
3. 선택하거나 교체할 조합은 `include`로 선언합니다.
4. [expect/provide 계약](/guide/contracts.md)의 scope·owner·수량을 확인합니다.
5. `logic validate`와 `logic check`로 선언·조립 결과를 나눠 검사합니다.
6. `logic tree --contract` 또는 `logic gui`로 관계를 살펴봅니다.

## 작업별 안내

| 작업 | 안내 |
|---|---|
| 모듈을 묶기 | [의존과 포함](./dependencies.md) |
| 하위 UI를 제외·교체 | [제외와 교체](./replacement.md) |
| 요구·제공을 연결 | [계약 연결](./contracts.md) |
| 제공 후보 제어와 별칭 | [허용·거부와 링크](./policies.md) |
| 인스턴스·사용처 설정 | [인스턴스와 설정](./configuration.md) |
| DB 관계와 변경 계획 | [DB 스키마](./schema.md) |
| 오류 확인 | [검증과 문제 해결](./validation.md) |
| 화면에서 작업 | [CLI와 GUI](./tools.md) |
| 새로운 UI 계약 설계 | [UI 계약 설계](./ui-contracts.md) |

## 카탈로그와 로컬 결과

카탈로그는 등록된 선언과 정적 의존 정보를 제공합니다. 사용처별 exclude·교체·동적 setup이 반영된 실효 결과는 로컬 조립에서 확인합니다. 같은 계약 이름이 검색되어도 연결 성공을 뜻하지 않습니다.
