-- Phase 1: 회원가입/로그인 + 채점 기록 + 통계 스냅샷용 초기 스키마
-- 참고: 작업지시서_회원가입_D1전환_Phase1.md STEP 2
-- 대상: Cloudflare D1 (SQLite)

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

-- STEP 3(로그인/세션)에 필요하지만 원안 초안에는 빠져 있던 테이블.
-- httpOnly 쿠키에는 토큰의 해시만 저장하고, 여기에 원본을 절대 남기지 않는다.
-- (탈취 시 즉시 무효화(로그아웃/강제 만료)가 가능해야 하므로 상태 없는 JWT 대신 서버 세션 방식을 택함)
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
