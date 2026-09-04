import { CORS_HEADERS, jsonResponse, getSessionUser } from '../auth/_shared.js';
import { hasActiveSubscription, VALID_SUBJECTS } from '../_archive.js';

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const subject = url.searchParams.get('subject');
  if (!VALID_SUBJECTS.includes(subject)) {
    return jsonResponse({ error: 'Invalid subject.' }, { status: 400 });
  }
  if (!env.DB) return jsonResponse({ active: false });

  const user = await getSessionUser(env.DB, request);
  if (!user) return jsonResponse({ active: false });

  const active = await hasActiveSubscription(env.DB, user.id, subject);
  return jsonResponse({ active });
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}
