// Subscribers only: freshly generated similar problems for one unit type. The same seed always
// reproduces the same worksheet. Problems are built backward from a chosen answer and every
// generator is verified numerically offline (scripts/test_jjang_engines.mjs).
import { CATALOG, CORS_HEADERS, GENERATORS, jsonResponse, requireSubscriber, seededRandom, typeById } from './_shared.js';

const COUNT_DEFAULT = 10;
const COUNT_MAX = 30;

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const typeNo = Number(url.searchParams.get('type'));
  const type = typeById(typeNo);
  if (!type) return jsonResponse({ error: 'unknown_type' }, { status: 404 });
  const gens = GENERATORS[type.id];
  if (!gens || !gens.length) return jsonResponse({ error: 'no_generator' }, { status: 404 });

  const gate = await requireSubscriber(env, request);
  if (gate.response) return gate.response;

  const seed = url.searchParams.get('seed') || String(Date.now());
  const count = Math.min(COUNT_MAX, Math.max(1, Number(url.searchParams.get('count')) || COUNT_DEFAULT));
  const profile = { id: 'kr', locale: 'ko' };
  const random = seededRandom(`${seed}:${type.id}:similar`);

  const used = new Set();
  const problems = [];
  for (let index = 0; index < count; index += 1) {
    let item; let attempt = 0;
    do {
      // Rotate through the type's generators so a worksheet mixes the sub-patterns of the unit.
      const gen = gens[(index + attempt) % gens.length];
      item = gen(random, profile);
      attempt += 1;
    } while (used.has(item.prompt) && attempt < 40);
    used.add(item.prompt);
    problems.push({
      id: `${type.id}-${seed}-${index + 1}`, number: index + 1,
      kind: item.kind, question: item.prompt, choices: item.choices || null,
      answer: item.answer, explanation: item.explanation,
    });
  }
  void CATALOG;
  return jsonResponse({ type, problems }, { headers: { 'Cache-Control': 'private, no-store' } });
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}
