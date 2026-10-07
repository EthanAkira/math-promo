import { jsonResponse, CORS_HEADERS } from '../auth/_shared.js';
import { normalizePhone, createOtpCode, sendOtpSms } from './_shared.js';

export async function onRequestPost({ request, env }) {
  if (!env.DB) return jsonResponse({ error: 'Guardian auth is not configured.' }, { status: 500 });

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const phone = normalizePhone(body.phone);
  if (phone.length < 9 || phone.length > 11) {
    return jsonResponse({ error: 'Invalid phone number.' }, { status: 400 });
  }

  const result = await createOtpCode(env.DB, phone);
  if (result.throttled) {
    return jsonResponse(
      { error: 'Please wait before requesting another code.', retryAfterMs: result.retryAfterMs },
      { status: 429 }
    );
  }

  const sendResult = await sendOtpSms(env, phone, result.code);

  const payload = { ok: true };
  if (sendResult.devFallback) {
    // SMS 벤더(SMS_API_KEY) 연동 전에만 내려가는 필드. 벤더 등록 후 자동으로 사라짐.
    payload.devCode = result.code;
    payload.devNote = 'SMS vendor not configured yet — code included in response for testing only.';
  }

  return jsonResponse(payload);
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}
