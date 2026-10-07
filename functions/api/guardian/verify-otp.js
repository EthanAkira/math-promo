import { jsonResponse, CORS_HEADERS } from '../auth/_shared.js';
import {
  normalizePhone,
  verifyOtpCode,
  findOrCreateGuardian,
  createGuardianSession,
  listLinkedStudents,
} from './_shared.js';

export async function onRequestPost({ request, env }) {
  if (!env.DB) return jsonResponse({ error: 'Guardian auth is not configured.' }, { status: 500 });

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const phone = normalizePhone(body.phone);
  const code = String(body.code || '').trim();
  if (!phone || !/^\d{6}$/.test(code)) {
    return jsonResponse({ error: 'Invalid phone or code.' }, { status: 400 });
  }

  const valid = await verifyOtpCode(env.DB, phone, code);
  if (!valid) return jsonResponse({ error: 'Invalid or expired code.' }, { status: 401 });

  const guardian = await findOrCreateGuardian(env.DB, phone);
  const { cookie } = await createGuardianSession(env.DB, guardian.id);
  const students = await listLinkedStudents(env.DB, guardian.id);

  return jsonResponse(
    { ok: true, guardian: { id: guardian.id, phone: guardian.phone, name: guardian.name }, students },
    { headers: { 'Set-Cookie': cookie } }
  );
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}
