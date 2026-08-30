import { jsonResponse, CORS_HEADERS, clearSessionCookie, deleteSessionByRequest } from './_shared.js';

export async function onRequestPost({ request, env }) {
  if (env.DB) await deleteSessionByRequest(env.DB, request);
  return jsonResponse({ ok: true }, { headers: { 'Set-Cookie': clearSessionCookie() } });
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}
