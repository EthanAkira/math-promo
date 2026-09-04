// AMC/CSAT 아카이브 공용 D1 태깅 헬퍼. 실제 파일은 그대로 KV(AMC_FILES)에 저장되고,
// 여기서는 단원 태그·콘텐츠 유형·유료 등급 같은 메타데이터만 file_key로 연결해 관리한다.
// 밑줄 접두 파일이라 Cloudflare Pages Functions 라우팅에서 제외된다 (routes/../auth/_shared.js와 동일한 관례).
export function genId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export const VALID_SUBJECTS = ['amc', 'csat'];
export const VALID_CONTENT_TYPES = ['problem', 'answer', 'solution', 'theory', 'variant_problem', 'related_problem', 'forecast', 'stats'];
export const VALID_ACCESS_TIERS = ['free', 'premium'];

// 기존 fileType(문제지/해설지/정답지, 영문 복수형)을 그대로 유지하면서 새 콘텐츠 유형을 추가한다.
export const FILE_TYPE_TO_CONTENT_TYPE = {
  problems: 'problem',
  solutions: 'solution',
  answers: 'answer',
  theory: 'theory',
  variant_problem: 'variant_problem',
  related_problem: 'related_problem',
  forecast: 'forecast',
  stats: 'stats',
};
export const VALID_FILE_TYPES = Object.keys(FILE_TYPE_TO_CONTENT_TYPE);

// '해설지'에 여러 풀이법을 동시에 보관하려면 KV 슬롯 키 자체를 방법별로 나눠야 한다
// (그렇지 않으면 두 번째 풀이법 업로드가 첫 번째를 덮어씀).
export function resolveStorageFileType(rawFileType, solutionMethod) {
  if (rawFileType === 'solutions' && solutionMethod && solutionMethod.trim()) {
    const slug = solutionMethod.trim().toLowerCase().replace(/\s+/g, '-').slice(0, 40);
    return `solutions__${slug}`;
  }
  return rawFileType;
}

export function isPremiumGatedSubject(subject) {
  return VALID_SUBJECTS.includes(subject);
}

export async function upsertArchiveItem(db, fields) {
  if (!db) return null;
  const {
    subject, level = null, grade = null, examType = null, issuer = null, year, variant = null,
    contentType, solutionMethod = null, unitTag = null, sourceItemId = null, accessTier = 'free',
    title = null, fileKey, filename = null,
  } = fields;
  const now = Date.now();
  const existing = await db.prepare('SELECT id FROM archive_items WHERE file_key = ?').bind(fileKey).first();
  if (existing) {
    await db.prepare(
      `UPDATE archive_items SET subject=?, level=?, grade=?, exam_type=?, issuer=?, year=?, variant=?,
       content_type=?, solution_method=?, unit_tag=?, source_item_id=?, access_tier=?, title=?, filename=?, updated_at=?
       WHERE file_key=?`,
    ).bind(subject, level, grade, examType, issuer, year, variant, contentType, solutionMethod, unitTag, sourceItemId, accessTier, title, filename, now, fileKey).run();
    return existing.id;
  }
  const id = genId();
  await db.prepare(
    `INSERT INTO archive_items (id, subject, level, grade, exam_type, issuer, year, variant, content_type,
     solution_method, unit_tag, source_item_id, access_tier, title, file_key, filename, sort_order, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`,
  ).bind(id, subject, level, grade, examType, issuer, year, variant, contentType, solutionMethod, unitTag, sourceItemId, accessTier, title, fileKey, filename, now, now).run();
  return id;
}

export async function getArchiveItemsBySubject(db, subject) {
  if (!db) return [];
  const { results } = await db.prepare('SELECT * FROM archive_items WHERE subject = ?').bind(subject).all();
  return results || [];
}

export async function getArchiveItemByFileKey(db, key) {
  if (!db) return null;
  return db.prepare('SELECT * FROM archive_items WHERE file_key = ?').bind(key).first();
}

export async function deleteArchiveItemByFileKey(db, key) {
  if (!db) return;
  await db.prepare('DELETE FROM archive_items WHERE file_key = ?').bind(key).run();
}

export async function renameArchiveItemFileKey(db, oldKey, newKey) {
  if (!db) return;
  await db.prepare('UPDATE archive_items SET file_key = ?, updated_at = ? WHERE file_key = ?').bind(newKey, Date.now(), oldKey).run();
}

export async function hasActiveSubscription(db, userId, subject) {
  if (!db || !userId) return false;
  const row = await db.prepare('SELECT expires_at FROM user_subscriptions WHERE user_id = ? AND subject = ?').bind(userId, subject).first();
  if (!row) return false;
  return row.expires_at == null || row.expires_at > Date.now();
}

export async function findUserByEmail(db, email) {
  if (!db || !email) return null;
  return db.prepare('SELECT id, email, name FROM users WHERE email = ?').bind(String(email).trim().toLowerCase()).first();
}

// expiresAt: epoch ms, or null for lifetime access.
export async function upsertSubscription(db, userId, subject, expiresAt) {
  const now = Date.now();
  await db.prepare(
    `INSERT INTO user_subscriptions (user_id, subject, started_at, expires_at) VALUES (?, ?, ?, ?)
     ON CONFLICT(user_id, subject) DO UPDATE SET expires_at = excluded.expires_at`
  ).bind(userId, subject, now, expiresAt).run();
}

export async function deleteSubscription(db, userId, subject) {
  await db.prepare('DELETE FROM user_subscriptions WHERE user_id = ? AND subject = ?').bind(userId, subject).run();
}

export async function listSubscriptionsWithUsers(db) {
  if (!db) return [];
  const { results } = await db.prepare(
    `SELECT s.user_id, s.subject, s.started_at, s.expires_at, u.email, u.name
     FROM user_subscriptions s JOIN users u ON u.id = s.user_id
     ORDER BY s.started_at DESC`
  ).all();
  return results || [];
}
