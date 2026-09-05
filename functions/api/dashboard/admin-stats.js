import { jsonResponse, CORS_HEADERS } from './_shared.js';

// Teacher/admin view over every student's grading stats — separate from stats.js,
// which only ever returns the logged-in user's own rows. Password-gated on the
// same shared env.AMC_UPLOAD_PASSWORD used by every other admin endpoint in this repo.
export async function onRequestPost({ request, env }) {
  if (!env.AMC_UPLOAD_PASSWORD) return jsonResponse({ error: 'Dashboard administration is not configured.' }, { status: 500 });
  if (!env.DB) return jsonResponse({ error: 'Database is not configured.' }, { status: 500 });

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON.' }, { status: 400 });
  }
  if (body.password !== env.AMC_UPLOAD_PASSWORD) return jsonResponse({ error: 'Incorrect password.' }, { status: 401 });

  if (body.action === 'list') {
    const { results } = await env.DB.prepare(
      `SELECT u.id, u.email, u.name, u.grade, u.school_type,
              COUNT(s.id) AS total,
              SUM(gr.is_correct) AS correct,
              MAX(s.submitted_at) AS last_submitted_at
       FROM users u
       LEFT JOIN submissions s ON s.user_id = u.id
       LEFT JOIN grading_results gr ON gr.submission_id = s.id
       GROUP BY u.id
       ORDER BY last_submitted_at DESC`
    ).all();

    const students = (results || []).map((row) => ({
      id: row.id,
      email: row.email,
      name: row.name,
      grade: row.grade,
      schoolType: row.school_type,
      total: row.total || 0,
      correct: row.correct || 0,
      accuracy: row.total > 0 ? Math.round((row.correct / row.total) * 100) : null,
      lastSubmittedAt: row.last_submitted_at,
    }));
    return jsonResponse({ students });
  }

  if (body.action === 'detail') {
    const email = String(body.email || '').trim().toLowerCase();
    if (!email) return jsonResponse({ error: 'Email is required.' }, { status: 400 });

    const user = await env.DB.prepare('SELECT id, email, name FROM users WHERE email = ?').bind(email).first();
    if (!user) return jsonResponse({ error: '해당 이메일로 가입된 회원을 찾을 수 없습니다.' }, { status: 404 });

    const { results } = await env.DB.prepare(
      `SELECT p.grade AS grade, p.unit AS unit,
              COUNT(*) AS total,
              SUM(gr.is_correct) AS correct
       FROM submissions s
       JOIN grading_results gr ON gr.submission_id = s.id
       JOIN problems p ON p.id = s.problem_id
       WHERE s.user_id = ?
       GROUP BY p.grade, p.unit
       ORDER BY p.grade, p.unit`
    ).bind(user.id).all();

    const stats = (results || []).map((row) => ({
      grade: row.grade,
      unit: row.unit,
      total: row.total,
      correct: row.correct,
      accuracy: row.total > 0 ? Math.round((row.correct / row.total) * 100) : 0,
    }));
    return jsonResponse({ user, stats });
  }

  return jsonResponse({ error: 'Invalid action.' }, { status: 400 });
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}
