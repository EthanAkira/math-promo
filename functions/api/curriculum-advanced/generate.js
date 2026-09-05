import { CORS_HEADERS, jsonResponse, getSessionUser } from '../auth/_shared.js';
import { hasActiveSubscription } from '../_archive.js';
import { findAdvancedGenerator } from './engines/registry.js';

const PROBLEM_COUNT_DEFAULT = 20;
const PROBLEM_COUNT_MAX = 20;

// Same locale table as app/middle-school/basic-figures/geometryProfiles.js — kept as a small,
// self-contained copy here (rather than importing across the functions/app boundary) since only
// `locale` is ever needed server-side to resolve prompt/explanation language via each engine's tx().
const PROFILE_LOCALES = {
  kr: 'ko', international: 'en', amc: 'en', sg: 'en-SG', tw: 'zh-TW', hk: 'zh-HK',
  g12: 'en', ib: 'en', amc12: 'en', csat: 'ko',
};

function resolveProfile(profileId) {
  return { id: profileId || 'kr', locale: PROFILE_LOCALES[profileId] || 'ko' };
}

// Mirrors BasicFiguresGenerator.js's seededRandom() exactly so the same seed always reproduces
// the same worksheet, matching the free tier's behavior (print/share a seed -> same problems).
function hashSeed(text) {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededRandom(seedText) {
  let value = hashSeed(seedText);
  return function next() {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const unitId = url.searchParams.get('unit');
  const profile = resolveProfile(url.searchParams.get('profile'));
  const seed = url.searchParams.get('seed') || String(Date.now());
  const count = Math.min(PROBLEM_COUNT_MAX, Math.max(1, Number(url.searchParams.get('count')) || PROBLEM_COUNT_DEFAULT));

  const generator = findAdvancedGenerator(unitId);
  if (!generator) return jsonResponse({ error: 'no_advanced_content', message: '이 단원은 심화 문제가 아직 준비되지 않았습니다.' }, { status: 404 });

  if (!env.DB) return jsonResponse({ error: 'not_configured' }, { status: 500 });
  const user = await getSessionUser(env.DB, request);
  if (!user) return jsonResponse({ error: 'login_required' }, { status: 401 });

  const active = await hasActiveSubscription(env.DB, user.id, 'curriculum-advanced');
  if (!active) return jsonResponse({ error: 'subscription_required' }, { status: 403 });

  const random = seededRandom(`${seed}:${unitId}:${profile.id}:advanced`);
  const used = new Set();
  const problems = [];
  for (let index = 0; index < count; index += 1) {
    let item;
    let uniquenessKey;
    let attempt = 0;
    do {
      item = generator(random, profile);
      uniquenessKey = `${item.prompt}|${item.expression}|${JSON.stringify(item.diagram)}|${item.answer}`;
      attempt += 1;
    } while (used.has(uniquenessKey) && attempt < 80);
    used.add(uniquenessKey);
    problems.push({ id: index + 1, ...item });
  }

  return jsonResponse({ problems });
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}
