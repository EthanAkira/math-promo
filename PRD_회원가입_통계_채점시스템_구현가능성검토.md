# 구현 가능성 검토: PRD_회원가입_통계_채점시스템

**대상 문서**: PRD_회원가입_통계_채점시스템.md
**검토일**: 2026-08-28
**결론**: 기술적으로 구현 가능. 단, 현재 스택에는 없는 인프라(DB, 인증, 파일 스토리지, 스케줄러)를 새로 얹어야 하는 작업.

---

## 1. 현재 스택 (코드 확인 결과)

| 영역 | 현황 |
|---|---|
| 프론트엔드 | Next.js 14, `output: 'export'` — 완전 정적 사이트 (서버 렌더링/동적 API 라우트 불가) |
| 배포 | Cloudflare Pages (`wrangler pages deploy out`) |
| 백엔드 | `functions/api/*` — Cloudflare Pages Functions(엣지 함수) 이미 존재 (board, amc, csat 업로드/조회용) |
| 저장소 | Cloudflare **KV** 단일 네임스페이스(`AMC_FILES`)뿐. 게시판도 KV에 JSON 배열 전체를 읽고 쓰는 방식(`readBoard`/`writeBoard`) — 관계형 DB 아님 |
| 없는 것 | 인증/세션, 관계형 DB, 결제, 이미지 스토리지(R2), 스케줄러(cron), AI 비전 연동 |

→ 이 PRD는 "지금 있는 기능 위에 추가"가 아니라 **새 인프라 레이어를 구축**하는 작업이다.

---

## 2. Phase별 구현 가능성 평가

### Phase 1 — 회원가입/로그인 + 텍스트 채점 + 기본 대시보드
**평가: 가능, 중간 난이도**

- NextAuth는 사용 불가 (정적 export + 서버리스 함수 조합과 맞지 않음) → Pages Functions로 인증 직접 구현
- KV로는 "이메일로 유저 조회", "학년별 집계" 같은 쿼리가 비효율적 → **Cloudflare D1(엣지 SQLite, 무료 티어)** 도입 권장
- 비밀번호 해싱은 Workers 런타임의 Web Crypto(PBKDF2/SubtleCrypto)로 처리해야 함 (bcrypt 등 네이티브 라이브러리 사용 불가)
- 구글 소셜 로그인은 OAuth 리다이렉트 플로우로 Pages Functions에서 직접 구현 가능

### Phase 2 — 서술형 오류유형 분류 + 전국 통계 배치 공개
**평가: 가능하지만 설계 필요**

- 통계 배치 집계에는 정기 실행(cron)이 필요한데, Pages Functions 자체엔 스케줄 기능이 없음 → 별도 Worker(Cron Trigger)를 붙여야 함
- "서술형 오류유형 자동분류"는 사실상 AI(Claude API 등) 호출이 전제 → 건당 비용 발생, API 키를 Pages 시크릿으로 관리 필요

### Phase 3 — 사진 업로드 OCR/AI 채점 + 국제 비교
**평가: 가장 난이도 높음**

- 사진 저장은 KV(값 크기 제한, 비용구조)보다 **Cloudflare R2**가 적합
- 이미지 기울기 보정/전처리는 엣지 함수의 CPU 시간 제한 때문에 서버에서 무겁게 처리하기 어려움 → 클라이언트(캔버스)에서 전처리 후 업로드하는 구조 필요
- 손글씨 OCR + 채점은 Claude 비전 API 등으로 기술적으로는 가능하나 정확도/비용이 실제 병목 — PRD가 이를 인지하고 Phase 3로 미룬 것은 타당한 판단

---

## 3. 기술 외 리스크 (코드로 해결 불가)

- 미성년자 개인정보(국내 개인정보보호법 + 해외 COPPA/GDPR-K 동시 대응)는 **법률 검토 없이 기능만 구현하면 안 됨**. 보호자 동의 UI는 만들 수 있지만 적법성 판단은 별도 절차 필요.

---

## 4. 요약

- **막는 요소는 없음.** Cloudflare 생태계(D1 + R2 + Workers Cron + 기존 Pages Functions)로 전부 커버 가능.
- 다만 "회원가입 버튼 하나 추가"가 아니라 **D1 도입 + 커스텀 인증 시스템 구축**이 선행돼야 하는 작업이므로, PRD의 Phase 1 자체가 최소 1~2주 분량의 인프라 작업.
- 결제(별도 PRD 범위)와 AI 채점 비용은 본 PRD 범위 밖의 별도 리스크로 계산 필요.

## 5. 추천 다음 단계

1. Phase 1(회원가입/로그인 + D1 스키마 + 텍스트 채점 기록)부터 설계·구현 시작
2. 또는 먼저 D1 스키마 초안(User, Problem, Submission, GradingResult, Feedback, StatisticsSnapshot)만 확정
