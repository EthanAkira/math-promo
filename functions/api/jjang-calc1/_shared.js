// Shared helpers for the paid Calculus I (유형별 기출·응용) endpoints. Underscore-prefixed, so Pages
// Functions never routes it. Everything content-bearing stays on the server: the catalog JSON,
// the answer keys and the generators are never imported by any `app/` client file.
import { CORS_HEADERS, jsonResponse, getSessionUser } from '../auth/_shared.js';
import { hasActiveSubscription } from '../_archive.js';
import catalog from './_data/catalog.js';
import { SERIES_ENGINES } from '../curriculum-advanced/engines/calc1/seriesEngine.js';
import { LIMITS_ENGINES } from '../curriculum-advanced/engines/calc1/limitsEngine.js';
import { CALCULUS_ENGINES } from '../curriculum-advanced/engines/calc1/calculusEngine.js';

export { CORS_HEADERS, jsonResponse };

export const SUBSCRIPTION_SUBJECT = 'curriculum-advanced';
export const CATALOG = catalog;
export const GENERATORS = { ...SERIES_ENGINES, ...LIMITS_ENGINES, ...CALCULUS_ENGINES };

export function typeById(typeNo) {
  return CATALOG.types.find((t) => t.no === Number(typeNo)) || null;
}

// 401 / 403 JSON response when the caller is not a logged-in subscriber, otherwise null.
export async function requireSubscriber(env, request) {
  if (!env.DB) return { response: jsonResponse({ error: 'not_configured' }, { status: 500 }) };
  const user = await getSessionUser(env.DB, request);
  if (!user) return { response: jsonResponse({ error: 'login_required' }, { status: 401 }) };
  const active = await hasActiveSubscription(env.DB, user.id, SUBSCRIPTION_SUBJECT);
  if (!active) return { response: jsonResponse({ error: 'subscription_required' }, { status: 403 }) };
  return { user };
}

// Same mulberry-style PRNG as the other advanced-tier endpoints, so a seed reproduces a worksheet.
function hashSeed(text) {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
export function seededRandom(seedText) {
  let value = hashSeed(seedText);
  return function next() {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}
