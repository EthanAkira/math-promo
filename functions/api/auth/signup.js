import { jsonResponse, CORS_HEADERS, genId, hashPassword, createSession, toPublicUser } from './_shared.js';

const VALID_SCHOOL_TYPES = ['general', 'international'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  if (!EMAIL_RE.test(email)) return jsonResponse({ error: 'Invalid email.' }, { status: 400 });
  if (password.length < 8) {
    return jsonResponse({ error: 'Password must be at least 8 characters.' }, { status: 400 });
  }
  if (!name) return jsonResponse({ error: 'Name is required.' }, { status: 400 });

  const existing = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
  if (existing) return jsonResponse({ error: 'Email already registered.' }, { status: 409 });

  const id = genId();
  const passwordHash = await hashPassword(password);
  const createdAt = Date.now();

  await env.DB.prepare(
    `INSERT INTO users (id, email, password_hash, name, grade, school_type, country, plan, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'free', ?)`
  )
    .bind(id, email, passwordHash, name, grade, schoolType, country, createdAt)
    .run();

  const { cookie } = await createSession(env.DB, id);

  return jsonResponse(
    { ok: true, user: toPublicUser({ id, email, name, grade, school_type: schoolType, country, plan: 'free' }) },
    { status: 201, headers: { 'Set-Cookie': cookie } }
  );
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}
