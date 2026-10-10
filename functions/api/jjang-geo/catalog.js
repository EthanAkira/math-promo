// Public: the list of the 17 unit types with problem counts (no problem text, no answers).
import { CATALOG, CORS_HEADERS, jsonResponse } from './_shared.js';

export async function onRequestGet() {
  return jsonResponse({
    types: CATALOG.types.map((t) => ({ no: t.no, id: t.id, name: t.name, unit: t.unit, subject: t.subject, grade: t.grade, counts: t.counts })),
  }, { headers: { 'Cache-Control': 'public, max-age=300' } });
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}
