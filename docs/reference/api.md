---
title: 공개 조회 API
---

# 공개 조회 API

<SourceNote path="packages/logic-server/README.md" />

기존 `logic-server`의 공개 GET API를 정리했습니다. 현재 사이트는 저장된 샘플 스냅샷을 사용하며 운영 API 주소는 아직 연결하지 않았습니다.

## 패키지

| 경로 | 조회 내용 |
|---|---|
| `/v1/packages` | 검색·목록, q·kind·page·limit |
| `/v1/packages/:name` | 패키지와 버전 목록 |
| `/v1/packages/:name/versions` | 버전 목록 상세 |
| `/v1/packages/:name/versions/:version` | 선택 버전·Manifest·직접 선언 |
| `…/versions/:version/deps` | 의존 스냅샷 |
| `…/versions/:version/tables` | 등록 테이블 |
| `/v1/packages/:name/dependents` | 역참조, limit·offset |

`:name`은 URL 인코딩합니다. 예를 들어 `@shop/catalog-db`는 `%40shop%2Fcatalog-db`입니다. 조회 버전에는 정확한 SemVer 또는 `latest`를 씁니다.

## 계약

| 경로 | 조회 내용 |
|---|---|
| `/v1/contracts` | provide 또는 expect 조건의 등록 선언 후보 |
| `/v1/contracts/expects` | 최신 버전의 직접 expect 집계 |
| `/v1/contracts/expects/consumers` | 정확한 key를 쓰는 패키지 |
| `/v1/contracts/expect-patterns` | UI 번들 기능 패턴, q 또는 pattern 필요 |
| `/v1/contracts/expect-patterns/consumers` | scope·pattern에 해당하는 실제 선언 |

계열 필터 `kind=db`는 DB 모듈·번들, `kind=ui`는 UI 모듈·번들을 뜻합니다. 기능 패턴은 `ui_bundle`만 대상으로 합니다.

## 응답과 오류

```json
{ "ok": true, "data": {} }
```

```json
{
  "ok": false,
  "error": { "code": "E_REG_ROUTE_NOT_FOUND", "stage": 3, "message": "…" }
}
```

진단에는 path와 hint가 추가될 수 있습니다. 알 수 없는 쿼리 필드는 400으로 거절됩니다. API마다 페이지 또는 offset 방식이 다르므로 스키마를 확인하세요.

서버가 실행 중이면 해당 서버의 `/docs`와 `/docs/json`에서 OpenAPI를 확인할 수 있습니다. 브라우저에서 별도 도메인의 서버를 호출하려면 HTTPS와 CORS 구성이 필요합니다.
