export const EVIDENCE_STAGES = ['catalogued', 'sourced', 'analyzed', 'implemented', 'validated', 'localized', 'published'];
export const VALIDATION_STATES = ['not-validated', 'pending', 'passed', 'failed'];
export const REVIEW_STATES = ['not-reviewed', 'pending', 'passed', 'failed'];

export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export function jsonResponse(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS, ...(init.headers || {}) },
  });
}

export function genId() {
  return `evidence-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function canPublish(record) {
  return EVIDENCE_STAGES.indexOf(record.evidenceStatus) >= EVIDENCE_STAGES.indexOf('localized')
    && record.validationStatus === 'passed'
    && record.displayReviewStatus === 'passed';
}

export function parseStringArray(value, field) {
  const values = Array.isArray(value) ? value : String(value || '').split('\n');
  const result = values.map((item) => String(item).trim()).filter(Boolean);
  if (!result.length) throw new Error(`${field} is required.`);
  return result;
}
