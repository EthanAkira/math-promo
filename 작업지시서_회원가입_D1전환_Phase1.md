# 작업 지시서: 회원가입/로그인 + D1 전환 (Phase 1)

**대상 실행 환경**: Claude Code (Windows PowerShell)
**프로젝트 스택**: Next.js 14 (`output: 'export'`), Cloudflare Pages + Pages Functions, 기존 저장소는 Cloudflare KV(`AMC_FILES`)
**목표**: 회원가입/로그인 인프라를 구축하고, 기존 KV 기반 채점 로직을 D1으로 전환하여 로그인한 유저에게 "단원별 정답률 대시보드"를 제공한다.

> 이 문서는 작업을 순서대로 실행하기 위한 지시서다. 각 단계는 이전 단계가 완료되어야 진행 가능하다. 단계별로 완료 기준(DoD)을 명시했으니, 각 단계 종료 후 DoD를 스스로 점검할 것.

---

## 사전 확인 (착수 전 필수)

- [ ] `wrangler --version` 확인 (없으면 `npm install -g wrangler`)
- [ ] Cloudflare 계정 로그인 상태 확인 (`wrangler login`)
- [ ] 현재 `wrangler.toml` 내용을 확인하고 백업해둘 것 (기존 KV 바인딩이 깨지지 않도록)
- [ ] 기존 `functions/api/` 디렉토리 구조 확인 — board, amc, csat 관련 기존 엔드포인트 목록 정리

---

## STEP 1 — D1 데이터베이스 생성 및 바인딩

**작업**:
```powershell
wrangler d1 create math-promo-db
```
출력된 `database_id`를 `wrangler.toml`에 아래와 같이 추가한다.

```toml
[[d1_databases]]
binding = "DB"
database_name = "math-promo-db"
database_id = "<생성된 ID로 교체>"
```

**주의**: 기존 `[[kv_namespaces]]` 블록(`AMC_FILES`)은 그대로 유지한다. 이번 작업은 KV를 없애는 게 아니라 D1을 추가하는 것이다. 게시판(board) 등 기존 KV 의존 기능은 이번 Phase에서 건드리지 않는다.

**DoD**: `wrangler d1 execute math-promo-db --command "SELECT 1"` 실행 시 정상 응답.

---

## STEP 2 — 스키마 마이그레이션 작성 및 적용

`migrations/0001_init.sql` 파일을 생성하고 아래 DDL을 작성한다.

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  grade TEXT,
  school_type TEXT CHECK (school_type IN ('general','international')) DEFAULT 'general',
  country TEXT,
  plan TEXT CHECK (plan IN ('free','premium')) DEFAULT 'free',
  created_at INTEGER NOT NULL
);

-- STEP 3(로그인/세션)에서 쿠키에 담을 세션을 서버에서 검증/무효화하려면 필요
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  token_hash TEXT UNIQUE NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);

CREATE TABLE problems (
  id TEXT PRIMARY KEY,
  grade TEXT NOT NULL,
  unit TEXT NOT NULL,
  concept_tags TEXT,              -- JSON 배열 문자열
  difficulty TEXT,
  problem_type TEXT CHECK (problem_type IN ('mcq','short','essay')) NOT NULL,
  is_premium INTEGER DEFAULT 0
);

CREATE TABLE submissions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  problem_id TEXT NOT NULL REFERENCES problems(id),
  submit_method TEXT CHECK (submit_method IN ('text','photo')) NOT NULL,
  raw_content TEXT,               -- 텍스트 답안 또는 이미지 URL
  submitted_at INTEGER NOT NULL
);

CREATE TABLE grading_results (
  id TEXT PRIMARY KEY,
  submission_id TEXT NOT NULL REFERENCES submissions(id),
  is_correct INTEGER NOT NULL,
  error_type TEXT,                -- 'calc_mistake' | 'concept_error' | 'approach_error' | NULL
  confidence REAL DEFAULT 1.0
);

CREATE TABLE feedback (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  concept_tag TEXT NOT NULL,
  comment TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE statistics_snapshots (
  id TEXT PRIMARY KEY,
  group_type TEXT CHECK (group_type IN ('grade','international','country')) NOT NULL,
  group_key TEXT NOT NULL,
  period_start INTEGER NOT NULL,
  period_end INTEGER NOT NULL,
  aggregate_json TEXT NOT NULL,
  published_at INTEGER
);

CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);
CREATE INDEX idx_submissions_user ON submissions(user_id);
CREATE INDEX idx_grading_submission ON grading_results(submission_id);
CREATE INDEX idx_feedback_user ON feedback(user_id);
```

**적용**:
```powershell
wrangler d1 migrations apply math-promo-db --local   # 로컬 테스트용
wrangler d1 migrations apply math-promo-db --remote  # 실제 배포 대상
```

**DoD**: `wrangler d1 execute math-promo-db --command "SELECT name FROM sqlite_master WHERE type='table'" --remote` 로 7개 테이블(users, sessions, problems, submissions, grading_results, feedback, statistics_snapshots)이 모두 조회됨.

---

## STEP 3 — 인증 API 구현

**위치**: `functions/api/auth/signup.ts`, `functions/api/auth/login.ts`, `functions/api/auth/session.ts`

**요구사항**:
1. `signup`: email, password, name, grade, school_type, country 입력받아 `users` 테이블에 INSERT
   - 비밀번호는 반드시 `crypto.subtle` (PBKDF2 또는 유사 방식)로 해싱 — Node 전용 `bcrypt` 라이브러리는 Workers 런타임에서 동작하지 않으므로 사용 금지
   - 이메일 중복 시 409 반환
2. `login`: email/password 검증 후 세션 토큰 발급 (httpOnly 쿠키에 저장 권장)
3. `session`: 현재 로그인 상태 확인용 엔드포인트 (대시보드 접근 시 사용)

**주의사항**:
- 기존 `functions/api/board`, `functions/api/amc`, `functions/api/csat` 코드의 스타일(에러 핸들링, 응답 포맷)을 그대로 따를 것 — 새 패턴을 만들지 말고 기존 컨벤션에 맞출 것
- `env.DB`(D1 바인딩)는 기존 `env.AMC_FILES`(KV 바인딩) 옆에 나란히 사용 가능. 두 바인딩을 혼동하지 않도록 변수명 명확히 구분

**DoD**: PowerShell에서 `Invoke-RestMethod`로 signup → login → session 순서로 호출했을 때 정상 흐름 확인.

---

## STEP 4 — 프론트엔드 로그인/가입 UI 연동

- 기존 페이지 상단 또는 헤더에 로그인/회원가입 버튼 추가
- 로그인 상태에 따라 "내 통계 보기" 메뉴 노출 여부 분기
- 세션 상태는 클라이언트에서 `/api/auth/session` 호출로 확인 (정적 export이므로 서버 컴포넌트 세션 체크 불가 — 클라이언트 사이드에서 처리)

**DoD**: 로그인 전/후 헤더 UI가 달라지고, 새로고침해도 로그인 상태 유지됨(쿠키 기반).

---

## STEP 5 — 채점 결과를 D1에 기록하도록 전환

- 기존 텍스트 채점(빨간펜 애니메이션) 로직에서 채점 완료 시점에 D1의 `submissions`, `grading_results`에 INSERT하는 호출 추가
- 단, **비로그인 사용자는 계속 기존 방식(즉석 채점, 저장 없음)으로 동작** — 로그인 유저에 한해서만 D1 기록
- 이 단계에서 KV(`AMC_FILES`)를 건드리거나 제거하지 않는다 — 게시판 등 기존 기능과 무관하게 별도로 추가

**DoD**: 로그인 상태에서 문제를 풀면 D1에 레코드가 쌓이고, `wrangler d1 execute ... --command "SELECT * FROM submissions LIMIT 5"`로 확인 가능.

---

## STEP 6 — 개인 대시보드 페이지 구현

- 신규 페이지 `/dashboard` (또는 적절한 경로)
- `functions/api/dashboard/stats.ts`: 로그인한 유저의 `submissions` + `grading_results`를 JOIN하여 단원(unit)별 정답률 집계 후 반환
- 프론트엔드에서 단원별 막대그래프 또는 표로 표시

**DoD**: 로그인 후 문제 5개 이상 풀면 대시보드에 단원별 정답률이 표시됨.

---

## STEP 7 — 로컬 테스트 및 배포

```powershell
wrangler pages dev out --d1=DB=math-promo-db
```
- 로컬에서 회원가입 → 로그인 → 문제풀이 → 대시보드까지 전체 플로우 수동 테스트
- 문제 없으면 `wrangler pages deploy out` 으로 배포
- 배포 후 프로덕션 D1(`--remote`)에도 마이그레이션이 적용되어 있는지 재확인

**DoD**: 프로덕션 URL에서 전체 플로우가 로컬과 동일하게 동작.

---

## 이번 Phase에서 하지 않는 것 (Out of Scope)

- 결제/구독 연동 (별도 작업)
- 서술형 AI 채점, 사진 업로드 채점 (Phase 3)
- 전국/국제 비교 통계 배치 공개 (Phase 2 이후)
- 소셜 로그인(구글 등) — 이메일/비밀번호 방식만 우선 구현
- 미성년자 개인정보 동의 절차 UI (법률 검토 후 별도 진행)

## 진행 중 막히면

- D1 바인딩이 로컬(`--local`)과 원격(`--remote`)에서 다르게 동작하면, 마이그레이션을 두 곳 모두에 적용했는지부터 확인할 것
- 기존 KV 기반 기능(board 등)이 이번 작업 이후 깨졌다면, `wrangler.toml`에서 D1 블록 추가 시 기존 KV 블록을 실수로 삭제하지 않았는지 확인할 것
