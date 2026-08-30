import { EVIDENCE_STAGES, VALIDATION_STATES, REVIEW_STATES, canPublish, genId, jsonResponse, parseStringArray, CORS_HEADERS } from './_shared.js';

function rowToRecord(row) {
  return {
    id: row.id,
    unitId: row.unit_id,
    source: { type: row.source_type, reference: row.source_reference, rights: row.source_rights },
    problemType: row.problem_type,
    analysis: {
      fixedElements: JSON.parse(row.fixed_elements_json),
      variables: JSON.parse(row.variables_json),
      constraints: JSON.parse(row.constraints_json),
      solutionRule: row.solution_rule,
      answerValidation: row.answer_validation,
    },
    difficultyRules: JSON.parse(row.difficulty_rules_json),
    evidenceStatus: row.evidence_status,
    validationStatus: row.validation_status,
    displayReviewStatus: row.display_review_status,
    visibility: row.visibility,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function onRequestPost({ request, env }) {
  if (!env.AMC_UPLOAD_PASSWORD) return jsonResponse({ error: 'Curriculum evidence administration is not configured.' }, { status: 500 });
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON.' }, { status: 400 });
  }
  if (body.password !== env.AMC_UPLOAD_PASSWORD) return jsonResponse({ error: 'Incorrect password.' }, { status: 401 });

  if (body.action === 'list') {
    const result = await env.DB.prepare('SELECT * FROM curriculum_evidence ORDER BY updated_at DESC').all();
    return jsonResponse({ records: (result.results || []).map(rowToRecord) });
  }

  if (body.action !== 'upsert') return jsonResponse({ error: 'Invalid action.' }, { status: 400 });
  try {
    const record = body.record || {};
    const unitId = String(record.unitId || '').trim();
    const sourceType = String(record.source?.type || '').trim();
    const sourceReference = String(record.source?.reference || '').trim();
    const sourceRights = String(record.source?.rights || '').trim();
    const problemType = String(record.problemType || '').trim();
    const solutionRule = String(record.analysis?.solutionRule || '').trim();
    const answerValidation = String(record.analysis?.answerValidation || '').trim();
    if (!unitId || !sourceType || !sourceReference || !sourceRights || !problemType || !solutionRule || !answerValidation) {
      return jsonResponse({ error: 'Required evidence or analysis fields are missing.' }, { status: 400 });
    }
    if (!EVIDENCE_STAGES.includes(record.evidenceStatus)) return jsonResponse({ error: 'Invalid evidence status.' }, { status: 400 });
    if (!VALIDATION_STATES.includes(record.validationStatus)) return jsonResponse({ error: 'Invalid validation status.' }, { status: 400 });
    if (!REVIEW_STATES.includes(record.displayReviewStatus)) return jsonResponse({ error: 'Invalid display review status.' }, { status: 400 });
    const difficultyRules = record.difficultyRules || {};
    if (!Array.isArray(difficultyRules.allowedLevels) || !difficultyRules.allowedLevels.length) return jsonResponse({ error: 'Difficulty rules are required.' }, { status: 400 });
    const fixedElements = parseStringArray(record.analysis?.fixedElements, 'fixedElements');
    const variables = parseStringArray(record.analysis?.variables, 'variables');
    const constraints = parseStringArray(record.analysis?.constraints, 'constraints');
    const visibility = canPublish(record) ? 'public' : 'admin-preview';
    const now = Date.now();
    await env.DB.prepare(
      `INSERT INTO curriculum_evidence (
        id, unit_id, source_type, source_reference, source_rights, problem_type,
        fixed_elements_json, variables_json, constraints_json, solution_rule, answer_validation,
        difficulty_rules_json, evidence_status, validation_status, display_review_status, visibility,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(unit_id) DO UPDATE SET
        source_type = excluded.source_type, source_reference = excluded.source_reference,
        source_rights = excluded.source_rights, problem_type = excluded.problem_type,
        fixed_elements_json = excluded.fixed_elements_json, variables_json = excluded.variables_json,
        constraints_json = excluded.constraints_json, solution_rule = excluded.solution_rule,
        answer_validation = excluded.answer_validation, difficulty_rules_json = excluded.difficulty_rules_json,
        evidence_status = excluded.evidence_status, validation_status = excluded.validation_status,
        display_review_status = excluded.display_review_status, visibility = excluded.visibility,
        updated_at = excluded.updated_at`
    ).bind(
      record.id || genId(), unitId, sourceType, sourceReference, sourceRights, problemType,
      JSON.stringify(fixedElements), JSON.stringify(variables), JSON.stringify(constraints), solutionRule, answerValidation,
      JSON.stringify(difficultyRules), record.evidenceStatus, record.validationStatus, record.displayReviewStatus, visibility,
      now, now
    ).run();
    const saved = await env.DB.prepare('SELECT * FROM curriculum_evidence WHERE unit_id = ?').bind(unitId).first();
    return jsonResponse({ ok: true, record: rowToRecord(saved) });
  } catch (error) {
    return jsonResponse({ error: error.message || 'Could not save evidence.' }, { status: 400 });
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}
