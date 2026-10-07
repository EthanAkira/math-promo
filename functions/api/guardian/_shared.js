import { genId } from '../auth/_shared.js';

// 부모/선생님(guardian) 전화번호 OTP 로그인 — auth/_shared.js(이메일/비번, A 시스템)와는
// 별도 쿠키(guardian_session)를 쓴다. 같은 브라우저에서 학생 본인 로그인(session)과
// 부모/선생님 로그인(guardian_session)이 동시에 존재할 수 있기 때문.

const GUARDIAN_SESSION_COOKIE = 'guardian_session';
const GUARDIAN_SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30일
const OTP_TTL_MS = 5 * 60 * 1000; // 5분
const OTP_RESEND_INTERVAL_MS = 60 * 1000; // 60초 — 벤더 붙기 전엔 스팸 방지 목적이 크지 않지만 습관적으로 넣어둠

const STUDENT_DEVICE_COOKIE = 'student_device';
const STUDENT_DEVICE_TTL_MS = 180 * 24 * 60 * 60 * 1000; // 180일 — 공용 가정 태블릿이라 길게
const JOIN_CODE_TTL_MS = 15 * 60 * 1000; // 15분
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 0/O, 1/I 등 헷갈리는 문자 제외

function toHex(bytes) {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function sha256Hex(text) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return toHex(new Uint8Array(digest));
}

function buildGuardianCookie(token, maxAgeSeconds) {
  return `${GUARDIAN_SESSION_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAgeSeconds}`;
}

function clearGuardianCookie() {
  return `${GUARDIAN_SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

function buildStudentDeviceCookie(token, maxAgeSeconds) {
  return `${STUDENT_DEVICE_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAgeSeconds}`;
}

function parseCookies(request) {
  const header = request.headers.get('Cookie') || '';
  const cookies = {};
  header.split(';').forEach((pair) => {
    const idx = pair.indexOf('=');
    if (idx === -1) return;
    const key = pair.slice(0, idx).trim();
    const value = pair.slice(idx + 1).trim();
    if (key) cookies[key] = decodeURIComponent(value);
  });
  return cookies;
}

// 국가 확장 전까지는 한국 번호(숫자만, 10~11자리)만 가정. 해외진출 시점에 country별
// 정규화 로직이 필요해짐 — 계정구조 설계메모의 "국가 필드 이중 역할" 항목과 같이 볼 것.
export function normalizePhone(raw) {
  return String(raw || '').replace(/\D/g, '');
}

export function genOtpCode() {
  return String(crypto.getRandomValues(new Uint32Array(1))[0] % 1000000).padStart(6, '0');
}

// SMS 벤더(예: 알리고) 계약 전 임시 경로. env.SMS_API_KEY가 없으면 콘솔 로그만 남기고,
// 응답에 devCode를 실어 로컬/초기 테스트를 가능하게 한다. 벤더 연동 후 이 분기를
// 실제 발송 코드로 교체하면 devCode 노출도 자동으로 사라진다.
export async function sendOtpSms(env, phone, code) {
  if (!env.SMS_API_KEY) {
    console.log(`[guardian-otp][dev-stub] phone=${phone} code=${code}`);
    return { devFallback: true };
  }
  // TODO: 알리고 등 실제 SMS 벤더 연동. env.SMS_API_KEY 등록 후 여기를 채울 것.
  throw new Error('SMS_API_KEY is set but sendOtpSms() has no real provider wired up yet.');
}

export async function createOtpCode(db, phone) {
  const now = Date.now();
  const recent = await db
    .prepare('SELECT created_at FROM otp_codes WHERE phone = ? ORDER BY created_at DESC LIMIT 1')
    .bind(phone)
    .first();
  if (recent && now - recent.created_at < OTP_RESEND_INTERVAL_MS) {
    return { throttled: true, retryAfterMs: OTP_RESEND_INTERVAL_MS - (now - recent.created_at) };
  }

  const code = genOtpCode();
  const codeHash = await sha256Hex(`${phone}:${code}`);
  await db
    .prepare('INSERT INTO otp_codes (id, phone, code_hash, expires_at, created_at) VALUES (?, ?, ?, ?, ?)')
    .bind(genId(), phone, codeHash, now + OTP_TTL_MS, now)
    .run();

  return { throttled: false, code };
}

export async function verifyOtpCode(db, phone, code) {
  const now = Date.now();
  const codeHash = await sha256Hex(`${phone}:${code}`);
  const row = await db
    .prepare(
      'SELECT id, expires_at, consumed_at FROM otp_codes WHERE phone = ? AND code_hash = ? ORDER BY created_at DESC LIMIT 1'
    )
    .bind(phone, codeHash)
    .first();

  if (!row || row.consumed_at || row.expires_at < now) return false;

  await db.prepare('UPDATE otp_codes SET consumed_at = ? WHERE id = ?').bind(now, row.id).run();
  return true;
}

export async function findOrCreateGuardian(db, phone) {
  const existing = await db
    .prepare('SELECT id, phone, name, created_at FROM guardians WHERE phone = ?')
    .bind(phone)
    .first();
  if (existing) return existing;

  const id = genId();
  const createdAt = Date.now();
  await db.prepare('INSERT INTO guardians (id, phone, created_at) VALUES (?, ?, ?)').bind(id, phone, createdAt).run();
  return { id, phone, name: null, created_at: createdAt };
}

export async function createGuardianSession(db, guardianId) {
  const token = toHex(crypto.getRandomValues(new Uint8Array(32)));
  const tokenHash = await sha256Hex(token);
  const now = Date.now();
  const expiresAt = now + GUARDIAN_SESSION_TTL_MS;

  await db
    .prepare('INSERT INTO guardian_sessions (id, guardian_id, token_hash, created_at, expires_at) VALUES (?, ?, ?, ?, ?)')
    .bind(genId(), guardianId, tokenHash, now, expiresAt)
    .run();

  return { cookie: buildGuardianCookie(token, Math.floor(GUARDIAN_SESSION_TTL_MS / 1000)) };
}

export async function getSessionGuardian(db, request) {
  const token = parseCookies(request)[GUARDIAN_SESSION_COOKIE];
  if (!token) return null;

  const tokenHash = await sha256Hex(token);
  const row = await db
    .prepare(
      `SELECT guardians.id AS id, guardians.phone AS phone, guardians.name AS name,
              guardian_sessions.expires_at AS expires_at
       FROM guardian_sessions JOIN guardians ON guardians.id = guardian_sessions.guardian_id
       WHERE guardian_sessions.token_hash = ?`
    )
    .bind(tokenHash)
    .first();

  if (!row || row.expires_at < Date.now()) return null;
  return row;
}

export async function revokeGuardianSession(db, request) {
  const token = parseCookies(request)[GUARDIAN_SESSION_COOKIE];
  if (!token) return;
  const tokenHash = await sha256Hex(token);
  await db.prepare('DELETE FROM guardian_sessions WHERE token_hash = ?').bind(tokenHash).run();
}

export function clearGuardianSessionCookie() {
  return clearGuardianCookie();
}

// ---- 연결 코드(join_codes): 학생 기기 등록(purpose=device) / 부모→선생님 초대(purpose=teacher-invite) ----

export function genJoinCode(length = 8) {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join('');
}

// 학생에 대한 guardian_links 존재 여부 + role/권한 확인. 없으면 null.
export async function getGuardianLink(db, guardianId, studentId) {
  return db
    .prepare(
      `SELECT role, can_manage_billing, can_set_goals, can_leave_feedback
       FROM guardian_links WHERE guardian_id = ? AND student_id = ?`
    )
    .bind(guardianId, studentId)
    .first();
}

export async function createJoinCode(db, { createdBy, studentId, purpose }) {
  const id = genId();
  const code = genJoinCode();
  const now = Date.now();
  const expiresAt = now + JOIN_CODE_TTL_MS;

  await db
    .prepare(
      `INSERT INTO join_codes (id, code, purpose, created_by, student_id, expires_at, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(id, code, purpose, createdBy, studentId, expiresAt, now)
    .run();

  return { id, code, expiresAt };
}

export async function getValidJoinCode(db, code, purpose) {
  const row = await db
    .prepare(
      `SELECT id, code, purpose, created_by, student_id, expires_at, used_at
       FROM join_codes WHERE code = ? AND purpose = ?`
    )
    .bind(code, purpose)
    .first();

  if (!row || row.used_at || row.expires_at < Date.now()) return null;
  return row;
}

export async function markJoinCodeUsed(db, id, usedBy) {
  await db.prepare('UPDATE join_codes SET used_at = ?, used_by = ? WHERE id = ?').bind(Date.now(), usedBy || null, id).run();
}

// ---- 학생 기기(student_device) 세션: 태블릿이 /connect에서 device 코드를 리딤하면 발급 ----

export async function createStudentDeviceSession(db, studentId) {
  const token = toHex(crypto.getRandomValues(new Uint8Array(32)));
  const tokenHash = await sha256Hex(token);
  const now = Date.now();
  const expiresAt = now + STUDENT_DEVICE_TTL_MS;

  await db
    .prepare('INSERT INTO student_device_sessions (id, student_id, token_hash, created_at, expires_at) VALUES (?, ?, ?, ?, ?)')
    .bind(genId(), studentId, tokenHash, now, expiresAt)
    .run();

  return { cookie: buildStudentDeviceCookie(token, Math.floor(STUDENT_DEVICE_TTL_MS / 1000)) };
}

export async function getStudentFromDeviceCookie(db, request) {
  const token = parseCookies(request)[STUDENT_DEVICE_COOKIE];
  if (!token) return null;

  const tokenHash = await sha256Hex(token);
  const row = await db
    .prepare(
      `SELECT students.id AS id, students.name AS name, students.grade AS grade,
              student_device_sessions.expires_at AS expires_at
       FROM student_device_sessions JOIN students ON students.id = student_device_sessions.student_id
       WHERE student_device_sessions.token_hash = ?`
    )
    .bind(tokenHash)
    .first();

  if (!row || row.expires_at < Date.now()) return null;
  return row;
}

// role별로 부모/선생님 화면 분기에 그대로 쓸 수 있게 권한 필드를 boolean으로 변환해 내려준다.
export async function listLinkedStudents(db, guardianId) {
  const { results } = await db
    .prepare(
      `SELECT students.id AS id, students.name AS name, students.grade AS grade,
              guardian_links.role AS role,
              guardian_links.can_manage_billing AS can_manage_billing,
              guardian_links.can_set_goals AS can_set_goals,
              guardian_links.can_leave_feedback AS can_leave_feedback
       FROM guardian_links JOIN students ON students.id = guardian_links.student_id
       WHERE guardian_links.guardian_id = ?
       ORDER BY guardian_links.created_at ASC`
    )
    .bind(guardianId)
    .all();

  return (results || []).map((r) => ({
    id: r.id,
    name: r.name,
    grade: r.grade,
    role: r.role,
    canManageBilling: !!r.can_manage_billing,
    canSetGoals: !!r.can_set_goals,
    canLeaveFeedback: !!r.can_leave_feedback,
  }));
}
