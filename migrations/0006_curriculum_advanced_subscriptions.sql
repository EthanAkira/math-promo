-- 일반 한국/국제학교 교육과정(비-AMC/CSAT) 심화문제 생성 기능을 위한 별도 구독 상품(subject='curriculum-advanced').
-- user_subscriptions.subject는 CHECK(subject IN ('amc','csat'))로 고정돼 있어 SQLite에서 ALTER로 값을
-- 추가할 수 없으므로, 제약 없는 테이블로 재생성한다. 유효성 검사는 애플리케이션 레벨의
-- functions/api/_archive.js:VALID_SUBJECTS 화이트리스트가 담당한다 (archive_items는 이 기능과
-- 무관하므로 그대로 둔다).

CREATE TABLE user_subscriptions_new (
  user_id TEXT NOT NULL REFERENCES users(id),
  subject TEXT NOT NULL,
  started_at INTEGER NOT NULL,
  expires_at INTEGER,
  PRIMARY KEY (user_id, subject)
);

INSERT INTO user_subscriptions_new (user_id, subject, started_at, expires_at)
  SELECT user_id, subject, started_at, expires_at FROM user_subscriptions;

DROP TABLE user_subscriptions;
ALTER TABLE user_subscriptions_new RENAME TO user_subscriptions;

CREATE INDEX idx_user_subscriptions_user ON user_subscriptions(user_id);
