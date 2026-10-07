import { jsonResponse, CORS_HEADERS } from '../auth/_shared.js';
import { getSessionGuardian, getGuardianLink, createJoinCode } from './_shared.js';

const VALID_PURPOSES = ['device', 'teacher-invite'];

// 부모/선생님이 기기 연결 코드(purpose=device) 또는 선생님 초대 코드(purpose=teacher-invite)를 발급.
// teacher-invite는 부모(role=parent)만 발급 가능 — 선생님이 다른 선생님을 초대하는 건 막는다.
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
  const purpose = String(body.purpose || '');
  if (!studentId || !VALID_PURPOSES.includes(purpose)) {
    return jsonResponse({ error: 'studentId and a valid purpose are required.' }, { status: 400 });
  }

  const link = await getGuardianLink(env.DB, guardian.id, studentId);
  if (!link) return jsonResponse({ error: 'You are not linked to this student.' }, { status: 403 });
  if (purpose === 'teacher-invite' && link.role !== 'parent') {
    return jsonResponse({ error: 'Only a parent can invite a teacher.' }, { status: 403 });
  }

  const { code, expiresAt } = await createJoinCode(env.DB, { createdBy: guardian.id, studentId, purpose });
  return jsonResponse({ ok: true, code, expiresAt, purpose });
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}
