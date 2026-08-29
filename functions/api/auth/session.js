import { jsonResponse, CORS_HEADERS, getSessionUser, toPublicUser } from './_shared.js';

export async function onRequestGet({ request, env }) {
  if (!env.DB) return jsonResponse({ error: 'Auth is not configured.' }, { status: 500 });

  const user = await getSessionUser(env.DB, request);
  if (!user) return jsonResponse({ user: null });

  return jsonResponse({ user: toPublicUser(user) });
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}
