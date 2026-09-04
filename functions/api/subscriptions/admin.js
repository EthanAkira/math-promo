import { CORS_HEADERS, jsonResponse } from '../auth/_shared.js';
import { VALID_SUBJECTS, findUserByEmail, upsertSubscription, deleteSubscription, listSubscriptionsWithUsers } from '../_archive.js';

const DAY_MS = 24 * 60 * 60 * 1000;

export async function onRequestPost({ request, env }) {
  if (!env.AMC_UPLOAD_PASSWORD) return jsonResponse({ error: 'Subscription administration is not configured.' }, { status: 500 });
  if (!env.DB) return jsonResponse({ error: 'Database is not configured.' }, { status: 500 });

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON.' }, { status: 400 });
  }
  if (body.password !== env.AMC_UPLOAD_PASSWORD) return jsonResponse({ error: 'Incorrect password.' }, { status: 401 });

  if (body.action === 'list') {
    const subscriptions = await listSubscriptionsWithUsers(env.DB);
    return jsonResponse({ subscriptions });
  }

  const email = String(body.email || '').trim().toLowerCase();
  const subject = body.subject;
  if (!email) return jsonResponse({ error: 'Email is required.' }, { status: 400 });
  if (!VALID_SUBJECTS.includes(subject)) return jsonResponse({ error: 'Invalid subject.' }, { status: 400 });

  const user = await findUserByEmail(env.DB, email);
  if (!user) return jsonResponse({ error: '해당 이메일로 가입된 회원을 찾을 수 없습니다.' }, { status: 404 });

  if (body.action === 'grant') {
    const durationDays = Number(body.durationDays);
    const expiresAt = Number.isFinite(durationDays) && durationDays > 0 ? Date.now() + durationDays * DAY_MS : null;
    await upsertSubscription(env.DB, user.id, subject, expiresAt);
    const subscriptions = await listSubscriptionsWithUsers(env.DB);
    return jsonResponse({ ok: true, user, subscriptions });
  }

  if (body.action === 'revoke') {
    await deleteSubscription(env.DB, user.id, subject);
    const subscriptions = await listSubscriptionsWithUsers(env.DB);
    return jsonResponse({ ok: true, user, subscriptions });
  }

  return jsonResponse({ error: 'Invalid action.' }, { status: 400 });
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}
