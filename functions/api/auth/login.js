import { jsonResponse, CORS_HEADERS, verifyPassword, createSession, toPublicUser } from './_shared.js';

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

  const user = await env.DB
    .prepare('SELECT id, email, password_hash, name, grade, school_type, country, plan FROM users WHERE email = ?')
    .bind(email)
    .first();

  // 이메일 존재 여부를 노출하지 않도록 계정 없음/비밀번호 불일치를 동일한 에러로 응답한다.
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return jsonResponse({ error: 'Invalid email or password.' }, { status: 401 });
  }

  const { cookie } = await createSession(env.DB, user.id);

  return jsonResponse({ ok: true, user: toPublicUser(user) }, { headers: { 'Set-Cookie': cookie } });
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}
