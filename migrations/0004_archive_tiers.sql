-- AMC/CSAT 기출 아카이브: 단원 태그·콘텐츠 유형·과목별 유료 구독 게이팅을 위한 메타데이터 테이블.
-- 실제 PDF 파일은 지금처럼 KV(AMC_FILES / CSAT_FILES)에 그대로 두고, 여기서는 file_key로만 참조한다.
-- 참고: 국제학교 커리큘럼/AMC·CSAT 유료화 데이터 모델 설계 논의 (2026-09-01).

CREATE TABLE archive_items (
  id TEXT PRIMARY KEY,
  subject TEXT NOT NULL CHECK (subject IN ('amc', 'csat')),
  level TEXT,                      -- AMC 전용: '8' | '10' | '12'
  grade TEXT,                      -- CSAT 전용: 'g1' | 'g2' | 'g3'
  exam_type TEXT,                  -- CSAT 전용: 'june' | 'sept' | 'nov' | 'city-mock'
  issuer TEXT,                     -- CSAT city-mock 전용: '서울' | '경기' | '인천' 등 (평가원 시험은 NULL)
  year INTEGER NOT NULL,
  variant TEXT,                    -- AMC 'A'/'B', CSAT '미적분'/'기하'/'확통' 등 (연도별로 명칭이 바뀔 수 있어 자유 텍스트)
  content_type TEXT NOT NULL CHECK (content_type IN (
    'problem', 'answer', 'solution', 'theory', 'variant_problem', 'related_problem', 'forecast', 'stats'
  )),
  solution_method TEXT,            -- content_type='solution'일 때만 사용: '대수적 풀이', '기하적 풀이' 등
  unit_tag TEXT,                   -- 단원명. 현재는 PDF(파일) 단위로 부여 — 문제 단위 세분화는 이후 phase에서 problem_number 컬럼 추가로 확장
  source_item_id TEXT REFERENCES archive_items(id), -- 변형/관련/예상 문제가 파생된 원본 기출 항목 (다대다 관계는 설명을 title/notes에 남기고 NULL로 둔다)
  access_tier TEXT NOT NULL CHECK (access_tier IN ('free', 'premium')) DEFAULT 'free',
  title TEXT,
  file_key TEXT NOT NULL UNIQUE,   -- KV 키 (기존 AMC_FILES/CSAT_FILES 네임스페이스, 형식 불변). UNIQUE로 upsert 지원
  filename TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- 과목별(과목 = subject) 분리 구독. 사이트 전체 단일 등급이 아니라 AMC/CSAT을 따로 구매할 수 있다.
CREATE TABLE user_subscriptions (
  user_id TEXT NOT NULL REFERENCES users(id),
  subject TEXT NOT NULL CHECK (subject IN ('amc', 'csat')),
  started_at INTEGER NOT NULL,
  expires_at INTEGER,              -- NULL = 무기한, 값이 있으면 그 시각(epoch ms) 이후 만료
  PRIMARY KEY (user_id, subject)
);

CREATE INDEX idx_archive_items_subject_year ON archive_items(subject, year);
CREATE INDEX idx_archive_items_tier ON archive_items(access_tier);
CREATE INDEX idx_archive_items_unit_tag ON archive_items(unit_tag);
CREATE INDEX idx_archive_items_content_type ON archive_items(content_type);
CREATE INDEX idx_archive_items_source ON archive_items(source_item_id);
CREATE INDEX idx_user_subscriptions_user ON user_subscriptions(user_id);
