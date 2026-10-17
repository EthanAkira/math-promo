// Shared helpers for the paid 마플 수능기출 미적분Ⅰ endpoints (underscore-prefixed => never routed).
// Catalog = metadata + answer keys only; the scanned question / solution images are stored in D1
// (table jjang_calc1_assets, ids mp-q-NNNN / mp-s-NNNN) and served only to subscribers.
import { CORS_HEADERS, jsonResponse, getSessionUser } from '../auth/_shared.js';
import { hasActiveSubscription } from '../_archive.js';
import catalog from './_data/catalog.js';
import { SERIES_ENGINES } from '../curriculum-advanced/engines/calc1/seriesEngine.js';
import { LIMITS_ENGINES } from '../curriculum-advanced/engines/calc1/limitsEngine.js';
import { CALCULUS_ENGINES } from '../curriculum-advanced/engines/calc1/calculusEngine.js';
import { MARPLE_ENGINES } from '../curriculum-advanced/engines/calc1/marpleEngine.js';

export { CORS_HEADERS, jsonResponse };

// A CSAT-archive subscriber or a curriculum-advanced subscriber may read this book.
export const SUBSCRIPTION_SUBJECTS = ['csat', 'curriculum-advanced'];
export const CATALOG = catalog;

const S = SERIES_ENGINES;
const L = LIMITS_ENGINES;
const C = CALCULUS_ENGINES;
const M = MARPLE_ENGINES;
// Marple type id -> generator list. Reuses the verified jjang engines and adds the Marple-specific ones.
export const GENERATORS = {
  'mp-seq-limit': S['jc1-seq-limit'],
  'mp-seq-apps': S['jc1-graph-limit'],
  'mp-geo-limit': S['jc1-geo-limit'],
  'mp-series': S['jc1-series'].filter((_, i) => i !== 3 && i !== 4),
  'mp-geo-series': [...S['jc1-series'].filter((_, i) => i === 3 || i === 4), ...M['mp-geo-series']],
  'mp-geo-apps': S['jc1-geo-apps'],
  'mp-func-limit': [...M['mp-func-limit'], ...L['jc1-one-sided']],
  'mp-coeff': L['jc1-coeff'],
  'mp-continuity': L['jc1-continuity'],
  'mp-derivative': L['jc1-derivative'],
  'mp-tangent': L['jc1-tangent'],
  'mp-extrema': C['jc1-extrema'],
  'mp-applications': C['jc1-applications'],
  'mp-kinematics': C['jc1-kinematics'],
  'mp-indefinite': M['mp-indefinite'],
  'mp-definite': C['jc1-definite'],
  'mp-integral-fn': C['jc1-integral-fn'],
  'mp-area': C['jc1-area'],
  'mp-motion-dist': C['jc1-motion-dist'],
};

export function typeById(typeNo) {
  return CATALOG.types.find((t) => t.no === Number(typeNo)) || null;
}

// 401 / 403 JSON response when the caller is not a logged-in subscriber, otherwise { user }.
export async function requireSubscriber(env, request) {
  if (!env.DB) return { response: jsonResponse({ error: 'not_configured' }, { status: 500 }) };
  const user = await getSessionUser(env.DB, request);
  if (!user) return { response: jsonResponse({ error: 'login_required' }, { status: 401 }) };
  for (const subject of SUBSCRIPTION_SUBJECTS) {
    if (await hasActiveSubscription(env.DB, user.id, subject)) return { user };
  }
  return { response: jsonResponse({ error: 'subscription_required' }, { status: 403 }) };
}

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
