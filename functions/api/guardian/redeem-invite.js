import { jsonResponse, CORS_HEADERS, genId } from '../auth/_shared.js';
import { getSessionGuardian, getValidJoinCode, markJoinCodeUsed, listLinkedStudents } from './_shared.js';

// 선생님이 부모가 발급한 teacher-invite 코드를 입력해 학생과 연결됨.
// 호출 전에 선생님 본인이 이미 OTP로 로그인(guardian_session)돼 있어야 함.
export async function onRequestPost({ request, env }) {
  if (!env.DB) return jsonResponse({ error: 'Guardian auth is not configured.' }, { status: 500 });

  const guardian = await getSessionGuardian(env.DB, request);
  if (!guardian) return jsonResponse({ error: 'Not authenticated.' }, { status: 401 });

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const code = String(body.code || '').trim().toUpperCase();
  if (!code) return jsonResponse({ error: 'Code is required.' }, { status: 400 });

  const joinCode = await getValidJoinCode(env.DB, code, 'teacher-invite');
  if (!joinCode) return jsonResponse({ error: 'Invalid or expired code.' }, { status: 400 });

  const existing = await env.DB
    .prepare('SELECT id FROM guardian_links WHERE guardian_id = ? AND student_id = ?')
    .bind(guardian.id, joinCode.student_id)
    .first();

  if (!existing) {
    await env.DB
      .prepare(
        `INSERT INTO guardian_links (id, guardian_id, student_id, role, can_manage_billing, can_set_goals, can_leave_feedback, invited_by, created_at)
         VALUES (?, ?, ?, 'teacher', 0, 1, 1, ?, ?)`
      )
      .bind(genId(), guardian.id, joinCode.student_id, joinCode.created_by, Date.now())
      .run();
  }

  await markJoinCodeUsed(env.DB, joinCode.id, guardian.id);

  const students = await listLinkedStudents(env.DB, guardian.id);
  return jsonResponse({ ok: true, students });
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}
