import { jsonResponse, CORS_HEADERS, genId } from '../auth/_shared.js';
import { getSessionGuardian, listLinkedStudents } from './_shared.js';

// 부모가 자녀(학생)를 등록. role=parent, can_manage_billing=1로 guardian_links까지 함께 만든다.
// (선생님은 여기로 학생을 새로 만들 수 없음 — 부모가 초대해야만 학생과 연결됨)
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

  const name = String(body.name || '').trim().slice(0, 60);
  const grade = body.grade ? String(body.grade).trim().slice(0, 20) : null;
  if (!name) return jsonResponse({ error: 'Student name is required.' }, { status: 400 });

  const studentId = genId();
  const now = Date.now();

  await env.DB.prepare('INSERT INTO students (id, name, grade, created_at) VALUES (?, ?, ?, ?)')
    .bind(studentId, name, grade, now)
    .run();

  await env.DB.prepare(
    `INSERT INTO guardian_links (id, guardian_id, student_id, role, can_manage_billing, can_set_goals, can_leave_feedback, created_at)
     VALUES (?, ?, ?, 'parent', 1, 1, 1, ?)`
  )
    .bind(genId(), guardian.id, studentId, now)
    .run();

  const students = await listLinkedStudents(env.DB, guardian.id);
  return jsonResponse({ ok: true, students }, { status: 201 });
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}
