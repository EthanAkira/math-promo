// Subscribers only: the stored 기출·기본·예상 problems of one unit type (with source info + answers).
import { CATALOG, CORS_HEADERS, jsonResponse, requireSubscriber, typeById } from './_shared.js';

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const typeNo = Number(url.searchParams.get('type'));
  if (!typeById(typeNo)) return jsonResponse({ error: 'unknown_type' }, { status: 404 });

  const gate = await requireSubscriber(env, request);
  if (gate.response) return gate.response;

  const section = url.searchParams.get('section'); // b | p | e | (all)
  const list = CATALOG.problems.filter((p) => p.typeNo === typeNo && (!section || p.sectionCode === section));
  return jsonResponse({
    type: typeById(typeNo),
    problems: list.map((p) => ({
      id: p.id, number: p.number, section: p.section, sectionCode: p.sectionCode,
      source: p.source, examYear: p.examYear, examKind: p.examKind,
      kind: p.kind, question: p.stemIsImage ? '' : p.question, choices: p.choices, answer: p.answer,
      stemImage: p.stemIsImage ? p.figure : null,
      figure: p.stemIsImage ? null : p.figure,
      solPage: p.solPage, points: p.points,
    })),
  }, { headers: { 'Cache-Control': 'private, no-store' } });
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}
