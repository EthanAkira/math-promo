import { jsonResponse, CORS_HEADERS } from './_shared.js';
import { getSessionUser } from '../auth/_shared.js';

export async function onRequestGet({ request, env }) {
  if (!env.DB) return jsonResponse({ error: 'Not configured.' }, { status: 500 });

  const user = await getSessionUser(env.DB, request);
  if (!user) return jsonResponse({ error: 'Not authenticated.' }, { status: 401 });

  const { results } = await env.DB
    .prepare(
      `SELECT p.grade AS grade, p.unit AS unit,
              COUNT(*) AS total,
              SUM(gr.is_correct) AS correct
       FROM submissions s
       JOIN grading_results gr ON gr.submission_id = s.id
       JOIN problems p ON p.id = s.problem_id
       WHERE s.user_id = ?
       GROUP BY p.grade, p.unit
       ORDER BY p.grade, p.unit`
    )
    .bind(user.id)
    .all();

  const stats = (results || []).map((row) => ({
    grade: row.grade,
    unit: row.unit,
    total: row.total,
    correct: row.correct,
    accuracy: row.total > 0 ? Math.round((row.correct / row.total) * 100) : 0,
  }));

  return jsonResponse({ stats });
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}
