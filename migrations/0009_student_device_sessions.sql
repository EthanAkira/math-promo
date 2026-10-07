-- Phase: 학생 기기(태블릿 등) 연결 세션
-- join_codes(purpose='device')를 /connect에서 리딤하면 여기에 세션이 생긴다.
-- guardian_sessions와 같은 원칙: 쿠키엔 원본 토큰만, DB엔 해시만.

CREATE TABLE student_device_sessions (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES students(id),
  token_hash TEXT UNIQUE NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);

CREATE INDEX idx_student_device_sessions_student ON student_device_sessions(student_id);
CREATE INDEX idx_student_device_sessions_expires ON student_device_sessions(expires_at);
