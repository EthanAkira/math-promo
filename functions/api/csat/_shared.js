export const MANIFEST_KEY = 'csat-manifest';

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
  if (!raw) return { june: [], sept: [], nov: [] };
  const parsed = JSON.parse(raw);
  return { june: parsed.june || [], sept: parsed.sept || [], nov: parsed.nov || [] };
}

export async function writeManifest(kv, manifest) {
  await kv.put(MANIFEST_KEY, JSON.stringify(manifest));
}

export function fileKey(examType, year, variantId, fileType) {
  return `csatfile:${examType}:${year}:${variantId}:${fileType}`;
}
