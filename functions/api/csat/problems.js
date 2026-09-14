import { jsonResponse, CORS_HEADERS } from './_shared.js';
import { upsertArchiveProblem, listArchiveProblemsBySubject, deleteArchiveProblemsBySource } from '../_archive.js';

const VALID_GRADES = ['g1', 'g2', 'g3'];

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const grade = url.searchParams.get('grade');
  if (grade && !VALID_GRADES.includes(grade)) return jsonResponse({ error: 'Invalid grade.' }, { status: 400 });
  if (!env.DB) return jsonResponse({ problems: [] });

  // listArchiveProblemsBySubject's optional filter targets the `level` column (AMC's
  // 8/10/12), which CSAT rows never set — filter by `grade` here instead, in JS.
  const allRows = await listArchiveProblemsBySubject(env.DB, 'csat');
  const rows = grade ? allRows.filter((row) => row.grade === grade) : allRows;
  const problems = rows.map((row) => ({
    id: row.id,
    grade: row.grade,
    examType: row.exam_type,
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

// Bulk-upserts every problem extracted (client-side) from one uploaded CSAT problem-set file.
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

  const grade = VALID_GRADES.includes(body.grade) ? body.grade : null;
  const examType = String(body.examType || '') || null;
  const year = Number(body.year);
  const variant = String(body.variant || '');
  const sourceFileKey = String(body.sourceFileKey || '');
  const items = Array.isArray(body.items) ? body.items : [];

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
      subject: 'csat',
      grade,
      examType,
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
