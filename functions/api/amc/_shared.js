export const MANIFEST_KEY = 'manifest';

export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export function jsonResponse(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS, ...(init.headers || {}) },
  });
}

export async function readManifest(kv) {
  const raw = await kv.get(MANIFEST_KEY);
  if (!raw) return { 8: [], 10: [], 12: [] };
  const parsed = JSON.parse(raw);
  return { 8: parsed[8] || [], 10: parsed[10] || [], 12: parsed[12] || [] };
}

export async function writeManifest(kv, manifest) {
  await kv.put(MANIFEST_KEY, JSON.stringify(manifest));
}

export function fileKey(level, year, variantId, fileType) {
  return `file:${level}:${year}:${variantId}:${fileType}`;
}
