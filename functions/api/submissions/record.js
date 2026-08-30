import { jsonResponse, CORS_HEADERS, genId } from './_shared.js';
import { getSessionUser } from '../auth/_shared.js';

const VALID_PROBLEM_TYPES = ['mcq', 'short', 'essay'];

// 문제는 학년/단원 조합으로 클라이언트에서 무작위 생성되며 별도의 문제 은행이 없으므로,
// D1 problems 테이블에는 단원마다 하나의 대표 행만 두고(id = unit:<unitId>) 그 아래로
// submissions/grading_results를 쌓아 단원별 정답률 집계(대시보드)를 지원한다.
function problemIdFor(unit) {
  return `unit:${unit}`;
}

export async function onRequestPost({ request, env }) {
  if (!env.DB) return jsonResponse({ error: 'Not configured.' }, { status: 500 });

  const user = await getSessionUser(env.DB, request);
  if (!user) return jsonResponse({ error: 'Not authenticated.' }, { status: 401 });

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const entries = Array.isArray(body.entries) ? body.entries : [body];
  if (entries.length === 0 || entries.length > 50) {
    return jsonResponse({ error: 'entries must contain 1-50 items.' }, { status: 400 });
  }

  const now = Date.now();
  const statements = [];
  const seenProblemIds = new Set();

  for (const entry of entries) {
    const grade = String(entry.grade || '').trim().slice(0, 20);
    const unit = String(entry.unit || '').trim().slice(0, 60);
    if (!grade || !unit) return jsonResponse({ error: 'grade and unit are required.' }, { status: 400 });

    const problemType = VALID_PROBLEM_TYPES.includes(entry.problemType) ? entry.problemType : 'short';
    const isCorrect = Boolean(entry.isCorrect);
    const rawContent = entry.answer != null ? String(entry.answer).slice(0, 500) : null;
    const problemId = problemIdFor(unit);

    if (!seenProblemIds.has(problemId)) {
      seenProblemIds.add(problemId);
      statements.push(
        env.DB
          .prepare('INSERT OR IGNORE INTO problems (id, grade, unit, concept_tags, difficulty, problem_type, is_premium) VALUES (?, ?, ?, NULL, NULL, ?, 0)')
          .bind(problemId, grade, unit, problemType)
      );
    }

    const submissionId = genId();
    statements.push(
      env.DB
        .prepare('INSERT INTO submissions (id, user_id, problem_id, submit_method, raw_content, submitted_at) VALUES (?, ?, ?, ?, ?, ?)')
        .bind(submissionId, user.id, problemId, 'text', rawContent, now)
    );
    statements.push(
      env.DB
        .prepare('INSERT INTO grading_results (id, submission_id, is_correct, error_type, confidence) VALUES (?, ?, ?, NULL, 1.0)')
        .bind(genId(), submissionId, isCorrect ? 1 : 0)
    );
  }

  await env.DB.batch(statements);

  return jsonResponse({ ok: true }, { status: 201 });
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}
