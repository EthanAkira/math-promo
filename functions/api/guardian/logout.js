import { jsonResponse, CORS_HEADERS } from '../auth/_shared.js';
import { revokeGuardianSession, clearGuardianSessionCookie } from './_shared.js';

export async function onRequestPost({ request, env }) {
  if (env.DB) await revokeGuardianSession(env.DB, request);
  return jsonResponse({ ok: true }, { headers: { 'Set-Cookie': clearGuardianSessionCookie() } });
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}
