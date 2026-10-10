-- 미적분 I 유형별 기출·응용(유료) 서버 전용 이미지 저장소: 그림, 원문 이미지 문항, 해설 쪽.
-- 적용: wrangler d1 execute math-promo-db --remote --file=migrations/0010_jjang_calc1_assets.sql
-- (주의: `d1 migrations apply` 는 사용하지 않는다 — 0004/0005 가 추적 테이블에 없음)
CREATE TABLE IF NOT EXISTS jjang_calc1_assets (
  id TEXT PRIMARY KEY,
  mime TEXT NOT NULL DEFAULT 'image/png',
  data TEXT NOT NULL
);
