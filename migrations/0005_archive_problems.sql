-- 단원별 기출문제(문제 단위) 저장소. archive_items(파일 단위)와 별개로, 업로드된 문제지 PDF에서
-- 실제로 추출한 개별 문제(문항 번호·본문·보기·정답·해설)를 저장해 세밀한 단원별로 모아 보여준다.
-- unit_id는 app/examUnits.js의 AMC_FINE_SUBJECTS에서 온 값 (규칙 기반 자동 분류, app/amcProblemClassifier.js).
-- 참고: AMC 8 기출 단원별 정리 요청 (2026-09-04).

CREATE TABLE archive_problems (
  id TEXT PRIMARY KEY,
  subject TEXT NOT NULL CHECK (subject IN ('amc', 'csat')),
  level TEXT,                      -- AMC 전용: '8' | '10' | '12'
  grade TEXT,                      -- CSAT 전용
  exam_type TEXT,                  -- CSAT 전용
  year INTEGER NOT NULL,
  variant TEXT,
  problem_number INTEGER NOT NULL,
  subject_id TEXT,                 -- AMC_FINE_SUBJECTS 상위 분류 id (예: 'geometry')
  unit_id TEXT,                    -- AMC_FINE_SUBJECTS 세부 단원 id (예: 'circles')
  question_text TEXT,
  choices_json TEXT,                -- JSON 배열 문자열, 객관식일 때만
  answer TEXT,
  explanation TEXT,
  points INTEGER,
  source_file_key TEXT NOT NULL,   -- archive_items.file_key 참조 (원본 문제지 PDF)
  classify_method TEXT NOT NULL DEFAULT 'auto-keyword' CHECK (classify_method IN ('auto-keyword', 'manual')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE(subject, level, year, variant, problem_number)
);

CREATE INDEX idx_archive_problems_unit ON archive_problems(subject, unit_id);
CREATE INDEX idx_archive_problems_source ON archive_problems(source_file_key);
CREATE INDEX idx_archive_problems_level_year ON archive_problems(subject, level, year);
