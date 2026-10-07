import { jsonResponse, CORS_HEADERS, genId } from '../auth/_shared.js';
import { getSessionGuardian, getGuardianLink } from '../guardian/_shared.js';

// 부모/선생님이 리포트에 정성 코멘트를 남긴다. can_leave_feedback 권한이 있어야 함.
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

  const studentId = String(body.studentId || '');
  const comment = String(body.comment || '').trim().slice(0, 500);
  if (!studentId || !comment) return jsonResponse({ error: 'studentId and comment are required.' }, { status: 400 });

  const link = await getGuardianLink(env.DB, guardian.id, studentId);
  if (!link) return jsonResponse({ error: 'You are not linked to this student.' }, { status: 403 });
  if (!link.can_leave_feedback) return jsonResponse({ error: 'You do not have permission to leave feedback.' }, { status: 403 });

  const now = Date.now();
  await env.DB.prepare(
    `INSERT INTO guardian_feedback (id, guardian_id, student_id, comment, period_start, period_end, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).bind(genId(), guardian.id, studentId, comment, body.periodStart || null, body.periodEnd || null, now).run();

  return jsonResponse({ ok: true }, { status: 201 });
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}
