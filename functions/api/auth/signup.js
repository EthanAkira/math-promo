import { jsonResponse, CORS_HEADERS, genId, hashPassword, createSession, toPublicUser } from './_shared.js';

const VALID_SCHOOL_TYPES = ['general', 'international'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BIRTH_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// 개인정보보호법 제22조의2(만 14세 미만 아동의 개인정보 수집 시 법정대리인 동의 필요) 대응을 위해
// 생년월일만 우선 확보한다. 아직 동의/차단 로직은 없음 — 유료 콘텐츠 출시 시점에 별도로 구현 예정
// (회원가입_연령확인_부모동의_정책.md 참고).
function isValidBirthDate(value) {
  if (!BIRTH_DATE_RE.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return false;
  const year = Number(value.slice(0, 4));
  return year >= 1950 && date.getTime() <= Date.now();
}

export async function onRequestPost({ request, env }) {
  if (!env.DB) return jsonResponse({ error: 'Auth is not configured.' }, { status: 500 });

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');
  const name = String(body.name || '').trim().slice(0, 60);
  const grade = body.grade ? String(body.grade).trim().slice(0, 20) : null;
  const schoolType = VALID_SCHOOL_TYPES.includes(body.schoolType) ? body.schoolType : 'general';
  const country = body.country ? String(body.country).trim().slice(0, 60) : null;
  const birthDate = String(body.birthDate || '').trim();

  if (!EMAIL_RE.test(email)) return jsonResponse({ error: 'Invalid email.' }, { status: 400 });
  if (password.length < 8) {
    return jsonResponse({ error: 'Password must be at least 8 characters.' }, { status: 400 });
  }
  if (!name) return jsonResponse({ error: 'Name is required.' }, { status: 400 });
  if (!isValidBirthDate(birthDate)) return jsonResponse({ error: 'A valid birth date is required.' }, { status: 400 });

  const existing = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
  if (existing) return jsonResponse({ error: 'Email already registered.' }, { status: 409 });

  const id = genId();
  const passwordHash = await hashPassword(password);
  const createdAt = Date.now();

  await env.DB.prepare(
    `INSERT INTO users (id, email, password_hash, name, grade, school_type, country, plan, birth_date, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'free', ?, ?)`
  )
    .bind(id, email, passwordHash, name, grade, schoolType, country, birthDate, createdAt)
    .run();

  const { cookie } = await createSession(env.DB, id);

  return jsonResponse(
    { ok: true, user: toPublicUser({ id, email, name, grade, school_type: schoolType, country, plan: 'free', birth_date: birthDate }) },
    { status: 201, headers: { 'Set-Cookie': cookie } }
  );
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}
