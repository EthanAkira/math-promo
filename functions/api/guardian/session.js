import { jsonResponse, CORS_HEADERS } from '../auth/_shared.js';
import { getSessionGuardian, listLinkedStudents } from './_shared.js';

export async function onRequestGet({ request, env }) {
  if (!env.DB) return jsonResponse({ error: 'Guardian auth is not configured.' }, { status: 500 });

  const guardian = await getSessionGuardian(env.DB, request);
  if (!guardian) return jsonResponse({ guardian: null, students: [] });

  const students = await listLinkedStudents(env.DB, guardian.id);
  return jsonResponse({ guardian: { id: guardian.id, phone: guardian.phone, name: guardian.name }, students });
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}
