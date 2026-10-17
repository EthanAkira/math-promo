// Subscribers only: the stored 기출 / 고난도 problems of one unit type (image ids + answers).
import { CATALOG, CORS_HEADERS, jsonResponse, requireSubscriber, typeById } from './_shared.js';

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const typeNo = Number(url.searchParams.get('type'));
  if (!typeById(typeNo)) return jsonResponse({ error: 'unknown_type' }, { status: 404 });

  const gate = await requireSubscriber(env, request);
  if (gate.response) return gate.response;

  const section = url.searchParams.get('section'); // p | h | (all)
  const list = CATALOG.problems.filter((p) => p.typeNo === typeNo && (!section || p.sectionCode === section));
  return jsonResponse({
    type: typeById(typeNo),
    problems: list.map((p) => ({
      id: p.id, number: p.number, section: p.section, sectionCode: p.sectionCode,
      source: p.source, topic: p.topic, kind: p.kind, answer: p.answer, points: p.points,
      stemImage: p.stemImage, solImage: p.solImage, choices: null,
    })),
  }, { headers: { 'Cache-Control': 'private, no-store' } });
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}
