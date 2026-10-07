-- Phase: 부모 진도관리 + 피드백 + 선생님 공유 (B 시스템)
-- 참고: Daily_Learning_Lab_유료화_생성엔진_설계.md 섹션 4(역할 체계), 3(스킬 태그)
-- 대상: Cloudflare D1 (SQLite) — 0001_init.sql(A 시스템: users/sessions/...)과 별도 테이블군.
--        기존 테이블은 건드리지 않음(추가만).
--
-- 설계 메모(계정구조_컨텐츠티어_설계메모.md)에 있던 families/students/answer_events는
-- 문서상 설계였을 뿐 실제 코드에는 아직 없었음 — 이 마이그레이션이 최초 구현.
-- guardian_links에 role(parent|teacher)을 처음부터 넣어서, 나중에 "선생님 공유"를
-- 별도로 얹기 위해 스키마를 또 바꾸는 일이 없도록 함.

-- 부모/선생님 계정 (전화번호 기반, SMS OTP 로그인)
CREATE TABLE guardians (
  id TEXT PRIMARY KEY,
  phone TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at INTEGER NOT NULL
);

-- OTP 로그인 코드 (평문 저장 금지 — 해시만 저장, sessions 테이블과 동일 원칙)
CREATE TABLE otp_codes (
  id TEXT PRIMARY KEY,
  phone TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  consumed_at INTEGER,
  created_at INTEGER NOT NULL
);

-- 로그인 세션 (A 시스템의 sessions 테이블과 동일 패턴 — httpOnly 쿠키엔 해시만)
CREATE TABLE guardian_sessions (
  id TEXT PRIMARY KEY,
  guardian_id TEXT NOT NULL REFERENCES guardians(id),
  token_hash TEXT UNIQUE NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);

-- 학생 (별도 로그인 없이 부모/선생님을 통해 관리되는 엔티티. A 시스템 users와는 별개 —
-- 추후 학생 본인 계정(A)과 연결할 경우를 대비해 user_id만 nullable로 열어둠)
CREATE TABLE students (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  grade TEXT,
  user_id TEXT REFERENCES users(id),
  created_at INTEGER NOT NULL
);

-- 보호자(부모/선생님) ↔ 학생 관계 + 권한
CREATE TABLE guardian_links (
  id TEXT PRIMARY KEY,
  guardian_id TEXT NOT NULL REFERENCES guardians(id),
  student_id TEXT NOT NULL REFERENCES students(id),
  role TEXT NOT NULL CHECK (role IN ('parent','teacher')),
  can_manage_billing INTEGER NOT NULL DEFAULT 0,  -- 결제/구독 변경 (부모 기본 1, 선생님 항상 0)
  can_set_goals INTEGER NOT NULL DEFAULT 1,       -- 목표 설계 권한
  can_leave_feedback INTEGER NOT NULL DEFAULT 1,  -- 코멘트 작성 권한
  invited_by TEXT REFERENCES guardians(id),       -- 선생님은 부모가 초대(join_codes 경유)
  created_at INTEGER NOT NULL,
  UNIQUE(guardian_id, student_id)
);

-- 초대/연결 코드 — 학생 기기 등록과 선생님 초대를 한 테이블로 통일 (같은 "코드 발급 → 상대가 입력" 패턴)
CREATE TABLE join_codes (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  purpose TEXT NOT NULL CHECK (purpose IN ('device','teacher-invite')),
  created_by TEXT NOT NULL REFERENCES guardians(id),
  student_id TEXT REFERENCES students(id),        -- teacher-invite는 특정 학생용, device는 최초 등록 시 NULL 가능
  expires_at INTEGER NOT NULL,
  used_at INTEGER,
  used_by TEXT REFERENCES guardians(id),
  created_at INTEGER NOT NULL
);

-- 정답 기록 — skill_tag/difficulty_tier를 처음부터 포함
-- (지금은 초등 연산 생성기 기준 unit만 채워지고, skill_tag/difficulty_tier는 향후
--  유료 문제생성 엔진(기출 패턴 태깅)이 붙을 때부터 채워짐 — 컬럼을 미리 열어둠으로써
--  나중에 ALTER TABLE 없이 그대로 스킬 단위 리포트로 확장 가능)
CREATE TABLE answer_events (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES students(id),
  grade TEXT,
  unit TEXT,
  skill_tag TEXT,
  difficulty_tier INTEGER,
  is_correct INTEGER NOT NULL,
  occurred_at INTEGER NOT NULL
);

-- 학습 세션(공부 시작~종료) — "오늘 몇 분 했는지" 같은 진도 리포트에 필요
CREATE TABLE study_sessions (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES students(id),
  started_at INTEGER NOT NULL,
  ended_at INTEGER,
  problems_solved INTEGER NOT NULL DEFAULT 0
);

-- 부모/선생님이 남기는 정성 피드백 (자동 리포트 위에 얹는 코멘트)
CREATE TABLE guardian_feedback (
  id TEXT PRIMARY KEY,
  guardian_id TEXT NOT NULL REFERENCES guardians(id),
  student_id TEXT NOT NULL REFERENCES students(id),
  comment TEXT NOT NULL,
  period_start INTEGER,
  period_end INTEGER,
  created_at INTEGER NOT NULL
);

CREATE INDEX idx_guardian_sessions_guardian ON guardian_sessions(guardian_id);
CREATE INDEX idx_guardian_sessions_expires ON guardian_sessions(expires_at);
CREATE INDEX idx_guardian_links_student ON guardian_links(student_id);
CREATE INDEX idx_guardian_links_guardian ON guardian_links(guardian_id);
CREATE INDEX idx_join_codes_code ON join_codes(code);
CREATE INDEX idx_answer_events_student ON answer_events(student_id);
CREATE INDEX idx_answer_events_occurred ON answer_events(occurred_at);
CREATE INDEX idx_study_sessions_student ON study_sessions(student_id);
CREATE INDEX idx_guardian_feedback_student ON guardian_feedback(student_id);
CREATE INDEX idx_otp_codes_phone ON otp_codes(phone);
