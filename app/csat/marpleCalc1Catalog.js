// 마플 수능기출 미적분Ⅰ(2017) — CSAT unit-browser entries (수능·평가원·교육청 기출).
// The compact rows come from scripts/marple/build_catalog.py; the scanned question / solution images
// themselves are NOT in the bundle: they are served per problem from /api/marple-calc1/asset
// (subscribers only). 사관학교·경찰대 기출과 고난도 문항은 /premium/marple-calc1 의 "고난도" 구간에 있다.
import data from '../data/csatMarpleCalc1Catalog.json';

const ORIGIN_LABEL = { 평가원: '평가원 기출', 교육청: '교육청 기출', 수능: '수능 기출' };

export const MARPLE_CALC1_ID_PREFIX = 'marple-calc1-';

export const csatMarpleCalc1Catalog = data.rows.map(([number, typeNo, shortFlag, answer, points, topicIdx, originIdx]) => {
  const t = data.types.find((x) => x[0] === typeNo);
  const [, name, subjectId, unitId, subUnitId, chapterName, grade, majorUnit] = t;
  const mc = shortFlag === 0;
  const origin = originIdx >= 0 ? data.origins[originIdx] : null;
  const label = origin ? ORIGIN_LABEL[origin] : null;
  const stamp = String(number).padStart(4, '0');
  return {
    id: `${MARPLE_CALC1_ID_PREFIX}${stamp}`,
    number,
    problemNumber: number,
    mpType: typeNo,
    chapterName,
    subjectId,
    unitId,
    subUnitId,
    majorUnit,
    middleUnit: chapterName,
    detailedType: topicIdx >= 0 ? data.topics[topicIdx] : name,
    tier: 'applied',
    difficulty: '기출',
    grade,
    points: points || 3,
    type: mc ? 'multiple_choice' : 'subjective',
    section: '기출문제 (마플 수능기출)',
    sourceLabel: `마플 수능기출 미적분Ⅰ ${stamp}번${label ? ` · ${label}` : ''}`,
    question: `[마플 수능기출 미적분Ⅰ ${stamp}번] 아래 원문 문항 이미지를 보고 풀어 보세요.`,
    choices: mc ? ['', '', '', '', ''] : [],
    // multiple choice answers are 0-based option indexes, subjective answers are the integer itself
    answer: mc ? String(answer - 1) : String(answer),
    questionImage: `/api/marple-calc1/asset?id=mp-q-${stamp}`,
    explanationImage: `/api/marple-calc1/asset?id=mp-s-${stamp}`,
    explanation: '풀이 이미지를 확인하세요.',
    category: 'csat',
  };
});

// 유사문제: generated server-side (subscribers only) by the same engines as the premium book.
export async function fetchMarpleSimilarProblem(candidate) {
  const typeNo = candidate?.mpType;
  if (!typeNo) throw new Error('no_type');
  const seed = Math.random().toString(36).slice(2, 10);
  const res = await fetch(`/api/marple-calc1/similar?type=${typeNo}&count=1&seed=${seed}`);
  if (res.status === 401) throw new Error('login_required');
  if (res.status === 403) throw new Error('subscription_required');
  if (!res.ok) throw new Error('failed');
  const { problems } = await res.json();
  const item = problems[0];
  const mc = item.kind === 'mcq' && Array.isArray(item.choices);
  return {
    id: `${MARPLE_CALC1_ID_PREFIX}gen-${seed}`,
    number: 1,
    points: candidate.points || 3,
    unitId: candidate.unitId,
    subUnitId: candidate.subUnitId,
    type: mc ? 'multiple_choice' : 'subjective',
    question: item.question,
    choices: mc ? item.choices.map((c) => `$${c}$`) : [],
    correctAnswer: mc ? Number(item.answer) - 1 : item.answer,
    answer: mc ? String(Number(item.answer) - 1) : String(item.answer),
    explanation: item.explanation,
    category: 'csat',
  };
}
