import { jsonResponse, CORS_HEADERS } from '../auth/_shared.js';
import { getStudentFromDeviceCookie } from '../guardian/_shared.js';

// 이 기기(브라우저)가 어떤 학생으로 등록돼 있는지 확인 — 문제 생성기 화면이 로드될 때
// 호출해서 "누구로 학습 중인지" 표시하고, sync/answer-events 호출 시 studentId로 쓴다.
export async function onRequestGet({ request, env }) {
  if (!env.DB) return jsonResponse({ error: 'Guardian auth is not configured.' }, { status: 500 });

  const student = await getStudentFromDeviceCookie(env.DB, request);
  return jsonResponse({ student: student ? { id: student.id, name: student.name, grade: student.grade } : null });
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}
