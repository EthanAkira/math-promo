import { CORS_HEADERS, jsonResponse } from '../auth/_shared.js';
import { upsertArchiveProblem, listArchiveProblemsBySubject, deleteArchiveProblemsBySource } from '../_archive.js';

const VALID_LEVELS = ['8', '10', '12'];

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const level = url.searchParams.get('level');
  if (level && !VALID_LEVELS.includes(level)) return jsonResponse({ error: 'Invalid AMC level.' }, { status: 400 });
  if (!env.DB) return jsonResponse({ problems: [] });

  const rows = await listArchiveProblemsBySubject(env.DB, 'amc', level || null);
  const problems = rows.map((row) => ({
    id: row.id,
    level: row.level,
    year: row.year,
    variant: row.variant,
    problemNumber: row.problem_number,
    subjectId: row.subject_id,
    unitId: row.unit_id,
    question: row.question_text,
    choices: row.choices_json ? JSON.parse(row.choices_json) : [],
    answer: row.answer,
    explanation: row.explanation,
    points: row.points,
    sourceFileKey: row.source_file_key,
  }));
  return jsonResponse({ problems });
}

// Bulk-upserts every problem extracted (client-side) from one uploaded AMC problem-set file.
// Re-running for the same sourceFileKey replaces its problems (handles re-classification and
// problem-count changes cleanly instead of accumulating stale rows).
export async function onRequestPost({ request, env }) {
  if (!env.AMC_UPLOAD_PASSWORD) return jsonResponse({ error: 'Problem classification is not configured.' }, { status: 500 });
  if (!env.DB) return jsonResponse({ error: 'Database is not configured.' }, { status: 500 });

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON.' }, { status: 400 });
  }
  if (body.password !== env.AMC_UPLOAD_PASSWORD) return jsonResponse({ error: 'Incorrect password.' }, { status: 401 });

  const level = String(body.level || '');
  const year = Number(body.year);
  const variant = String(body.variant || '');
  const sourceFileKey = String(body.sourceFileKey || '');
  const items = Array.isArray(body.items) ? body.items : [];

  if (!VALID_LEVELS.includes(level)) return jsonResponse({ error: 'Invalid AMC level.' }, { status: 400 });
  if (!Number.isFinite(year)) return jsonResponse({ error: 'Invalid year.' }, { status: 400 });
  if (!variant) return jsonResponse({ error: 'Missing variant.' }, { status: 400 });
  if (!sourceFileKey) return jsonResponse({ error: 'Missing sourceFileKey.' }, { status: 400 });
  if (items.length === 0) return jsonResponse({ error: 'No problems to save.' }, { status: 400 });

  await deleteArchiveProblemsBySource(env.DB, sourceFileKey);

  let saved = 0;
  for (const item of items) {
    const problemNumber = Number(item.problemNumber);
    if (!Number.isFinite(problemNumber)) continue;
    await upsertArchiveProblem(env.DB, {
      subject: 'amc',
      level,
      year,
      variant,
      problemNumber,
      subjectId: item.subjectId || null,
      unitId: item.unitId || null,
      questionText: item.question || null,
      choicesJson: Array.isArray(item.choices) && item.choices.length ? JSON.stringify(item.choices) : null,
      answer: item.answer != null ? String(item.answer) : null,
      explanation: item.explanation || null,
      points: Number.isFinite(Number(item.points)) ? Number(item.points) : null,
      sourceFileKey,
      classifyMethod: 'auto-keyword',
    });
    saved += 1;
  }

  return jsonResponse({ ok: true, saved });
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}
