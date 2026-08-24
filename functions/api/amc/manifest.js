import { readManifest, jsonResponse, CORS_HEADERS } from './_shared.js';

export async function onRequestGet({ env }) {
  const manifest = await readManifest(env.AMC_FILES);
  return jsonResponse(manifest);
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}
