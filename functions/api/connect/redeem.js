import { jsonResponse, CORS_HEADERS } from '../auth/_shared.js';
import { getValidJoinCode, markJoinCodeUsed, createStudentDeviceSession } from '../guardian/_shared.js';

// 학생 기기(태블릿 등)에서 부모가 발급한 device 코드를 입력 — 로그인 없이 이 기기를
// 해당 학생으로 등록한다(student_device 쿠키). /parent(보호자 인증)와는 별개 경로.
export async function onRequestPost({ request, env }) {
  if (!env.DB) return jsonResponse({ error: 'Guardian auth is not configured.' }, { status: 500 });

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const code = String(body.code || '').trim().toUpperCase();
  if (!code) return jsonResponse({ error: 'Code is required.' }, { status: 400 });

  const joinCode = await getValidJoinCode(env.DB, code, 'device');
  if (!joinCode) return jsonResponse({ error: 'Invalid or expired code.' }, { status: 400 });

  await markJoinCodeUsed(env.DB, joinCode.id, null);
  const { cookie } = await createStudentDeviceSession(env.DB, joinCode.student_id);

  const student = await env.DB
    .prepare('SELECT id, name, grade FROM students WHERE id = ?')
    .bind(joinCode.student_id)
    .first();

  return jsonResponse({ ok: true, student }, { headers: { 'Set-Cookie': cookie } });
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}
