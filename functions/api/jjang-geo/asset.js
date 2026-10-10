// Subscribers only: figure / 원문 이미지 / 해설 쪽 images stored in D1 (jjang_calc1_assets).
import { CORS_HEADERS, jsonResponse, requireSubscriber } from './_shared.js';

function base64ToBytes(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

export async function onRequestGet({ request, env }) {
  const id = new URL(request.url).searchParams.get('id') || '';
  if (!/^(geo-\d{2}-\d{2}|gsol-\d{2})$/.test(id)) return jsonResponse({ error: 'bad_id' }, { status: 400 });

  const gate = await requireSubscriber(env, request);
  if (gate.response) return gate.response;

  const row = await env.DB.prepare('SELECT mime, data FROM jjang_calc1_assets WHERE id = ?').bind(id).first();
  if (!row) return jsonResponse({ error: 'not_found' }, { status: 404 });
  return new Response(base64ToBytes(row.data), {
    headers: { 'Content-Type': row.mime || 'image/png', 'Cache-Control': 'private, max-age=3600' },
  });
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}
