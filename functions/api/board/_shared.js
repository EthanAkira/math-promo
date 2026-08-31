export const MANIFEST_KEY = 'board-manifest';
export const VALID_CATEGORIES = ['notice', 'contact', 'coding'];
export const ADMIN_ONLY_CATEGORIES = ['notice', 'coding'];

export function isAdminPassword(env, password) {
  return Boolean(env.AMC_UPLOAD_PASSWORD) && password === env.AMC_UPLOAD_PASSWORD;
}

export function orderOf(post) {
  return typeof post.order === 'number' ? post.order : Date.parse(post.createdAt) || 0;
}

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

export async function readBoard(kv) {
  const raw = await kv.get(MANIFEST_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function writeBoard(kv, posts) {
  await kv.put(MANIFEST_KEY, JSON.stringify(posts));
}

export function postImageKey(id) {
  return `board-file:${id}`;
}

export function genId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
