---
title: 오류와 버전
---

# 오류와 버전

<SourceNote path="docs/spec/15-validation-stages.md" />

오류의 코드와 단계, 문제 경로를 함께 확인하세요. 실행 환경의 예외와 조립 규칙 진단을 구분하면 수정할 위치가 명확해집니다.

## 자주 확인하는 코드

| 코드 | 확인할 내용 |
|---|---|
| `E_MISSING_PACKAGE_JSON` | logic.json 옆에 package.json이 있는지 |
| `E_DEPEND_KIND_PAIRING` | 호스트와 의존 대상 kind 조합 |
| `E_DEPEND_BUCKET_MISMATCH` | DB/UI 대상이 올바른 depend 칸인지 |
| `E_INCLUDE_KIND_PAIRING` | 번들의 include 조합 |
| `E_CONTEXT_KEY_DUPLICATE` | alias·path와 depend key 충돌 |
| `E_CONTRACT_POLICY_CONFLICT` | 같은 경로/토큰의 accept·reject 충돌 |
| `E_LINK_PATH_NOT_FOUND` | 링크 대상의 실효 경로 존재 여부 |
| `E_CLI_REGISTRY_UNREACHABLE` | 레지스트리 주소와 연결 상태 |

세부 진단과 심각도는 해당 규격·실행 명령의 출력이 기준입니다. 아직 결정되지 않은 항목의 Stage를 사이트에서 임의로 확정하지 않습니다.

## engine과 패키지 버전

`engine`은 Manifest 형식과 조립 규칙의 버전입니다. `logic-runtime`이나 npm 패키지의 배포 버전이 아닙니다.

- 새 manifest의 기본 engine은 `1.0.0`입니다.
- 참조 런타임의 지원 범위는 `>=1.0.0 <2.0.0`입니다.
- engine 누락·잘못된 SemVer·지원 범위 밖 값은 Stage 1 경고로 처리합니다.
- 패키지 버전이 바뀌어도 manifest 규격이 같으면 engine은 그대로일 수 있습니다.

계약 미충족은 검사 단계와 동적 주입 시점의 처리가 다릅니다. [검증과 문제 해결](/guide/validation.md)을 함께 확인하세요.
