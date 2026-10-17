// Public: the 19 unit types with problem counts only (no problem data, no answers).
import { CATALOG, jsonResponse, CORS_HEADERS } from './_shared.js';

export async function onRequestGet() {
  return jsonResponse({
    types: CATALOG.types.map((t) => ({ no: t.no, id: t.id, name: t.name, unit: t.unit, subject: t.subject, grade: t.grade, counts: t.counts })),
  }, { headers: { 'Cache-Control': 'public, max-age=300' } });
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}
