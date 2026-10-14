export const MANIFEST_KEY = 'board-manifest';
export const CODING_TRACKS = ['python', 'java', 'stats', 'r', 'c'];
export const CODING_CATEGORIES = ['coding', ...CODING_TRACKS.map((t) => 'coding-' + t)];
export const VALID_CATEGORIES = ['notice', 'contact', ...CODING_CATEGORIES];
export const ADMIN_ONLY_CATEGORIES = ['notice', ...CODING_CATEGORIES];

// Science archive slots: science-<unitId>-<tb|wb>, e.g. science-g3-forces-tb.
// unitId always starts with the grade (g1..g6); the unit catalog lives client-side.
export const SCIENCE_CATEGORY_RE = /^science-g[1-9]-[a-z0-9-]{1,40}-(tb|wb)$/;
export const isScienceCategory = (c) => typeof c === 'string' && SCIENCE_CATEGORY_RE.test(c);
export const isValidCategory = (c) => VALID_CATEGORIES.includes(c) || isScienceCategory(c);
export const isAdminOnlyCategory = (c) => ADMIN_ONLY_CATEGORIES.includes(c) || isScienceCategory(c);
export const isLargeAttachmentCategory = (c) => CODING_CATEGORIES.includes(c) || isScienceCategory(c);

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
