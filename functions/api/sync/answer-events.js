import { jsonResponse, CORS_HEADERS, genId } from '../auth/_shared.js';
import { getStudentFromDeviceCookie } from '../guardian/_shared.js';

const MAX_EVENTS_PER_REQUEST = 100;

// 학생 기기(student_device 쿠키)에서 문제풀이 결과를 배치로 올린다.
// body: { events: [{ grade?, unit?, skillTag?, difficultyTier?, isCorrect, occurredAt? }, ...],
//         session?: { startedAt, endedAt, problemsSolved } }
export async function onRequestPost({ request, env }) {
  if (!env.DB) return jsonResponse({ error: 'Guardian auth is not configured.' }, { status: 500 });

  const student = await getStudentFromDeviceCookie(env.DB, request);
  if (!student) return jsonResponse({ error: 'This device is not connected to a student.' }, { status: 401 });

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const events = Array.isArray(body.events) ? body.events.slice(0, MAX_EVENTS_PER_REQUEST) : [];
  if (events.length === 0 && !body.session) {
    return jsonResponse({ error: 'No events or session provided.' }, { status: 400 });
  }

  const now = Date.now();
  const statements = [];

  for (const ev of events) {
    if (typeof ev.isCorrect === 'undefined') continue;
    statements.push(
      env.DB.prepare(
        `INSERT INTO answer_events (id, student_id, grade, unit, skill_tag, difficulty_tier, is_correct, occurred_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        genId(),
        student.id,
        ev.grade ? String(ev.grade).slice(0, 20) : null,
        ev.unit ? String(ev.unit).slice(0, 60) : null,
        ev.skillTag ? String(ev.skillTag).slice(0, 60) : null,
        Number.isInteger(ev.difficultyTier) ? ev.difficultyTier : null,
        ev.isCorrect ? 1 : 0,
        Number.isInteger(ev.occurredAt) ? ev.occurredAt : now
      )
    );
  }

  if (body.session && Number.isInteger(body.session.startedAt)) {
    statements.push(
      env.DB.prepare(
        `INSERT INTO study_sessions (id, student_id, started_at, ended_at, problems_solved) VALUES (?, ?, ?, ?, ?)`
      ).bind(
        genId(),
        student.id,
        body.session.startedAt,
        Number.isInteger(body.session.endedAt) ? body.session.endedAt : now,
        Number.isInteger(body.session.problemsSolved) ? body.session.problemsSolved : events.length
      )
    );
  }

  if (statements.length > 0) await env.DB.batch(statements);

  return jsonResponse({ ok: true, saved: events.length });
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}
