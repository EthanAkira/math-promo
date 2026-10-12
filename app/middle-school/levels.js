// Applied (paid) units are split into two worksheet tabs: 응용문제 (standard typed applied units) and
// 고난도 문제 (심화·발전·실력 UP, whole-unit mixes and exams). Decided from the unit label so every
// generator classifies the same way.
const EXPERT_LABEL = /(심화|발전|실력\s*UP|최고난도|단원 실전 다지기|종합|총괄|전 유형|혼합|모의)/;

export function appliedLevel(unit) {
  if (unit?.amcUnitId) return 'applied';
  return EXPERT_LABEL.test(String(unit?.label ?? '')) ? 'expert' : 'applied';
}

export function unitsForLevel(units, level) {
  const filtered = units.filter((unit) => appliedLevel(unit) === level);
  return filtered.length ? filtered : units;
}

export function expertTabLabel(language) {
  return language === 'ko' ? '고난도 문제 🔒' : 'Challenge 🔒';
}

// Level of any catalog unit (pre-algebra / basic-figures keep a hand-judged difficulty `tier`):
// applied-* units use the label rule above; others map basic→기본, intermediate→응용, advanced→고난도.
// The chapter-level "기본 문제" units listed on the home curriculum page, whatever difficulty tier their
// catalog entry carries (many 중3 basics live under applied-* ids).
const HOME_BASIC_IDS = new Set(['expressions-review', 'equations-review', 'visual-foundations', 'polygon-angles-basic', 'circle-sector-inverse-basic', 'polyhedron-concepts-euler', 'expanded-solid-measures', 'frequency-table', 'decimal-classification', 'polynomial-operations-2', 'linear-inequalities-2', 'systems-linear', 'linear-functions-2', 'isosceles-triangle-properties', 'special-quadrilaterals', 'similarity-conditions', 'pythagorean-basic', 'probability-2', 'radicals-real-numbers', 'applied-g9-radical-ops-mult-div', 'applied-g9-poly-mult-square', 'identities-factoring', 'quadratic-equations', 'applied-g9-quad-app-numbers', 'quadratic-functions', 'applied-g9-quad-func-standard-form', 'applied-g9s2-trig-concept', 'applied-g9s2-trig-apps-length', 'circle-properties-mixed', 'circle-chord-properties', 'circle-tangent-properties', 'circle-inscribed-circumscribed', 'circle-inscribed-angles', 'circle-cyclic-quadrilaterals', 'circle-tangent-chord-angles', 'data-variation']);

export function unitLevel(unit) {
  if (HOME_BASIC_IDS.has(unit?.id)) return 'basic';
  if (String(unit?.id ?? '').startsWith('applied-')) return appliedLevel(unit);
  if (unit?.tier === 'advanced') return 'expert';
  if (unit?.tier === 'intermediate') return 'applied';
  return 'basic';
}

export function levelTabLabels(language) {
  return language === 'ko'
    ? { basic: '기본 문제', applied: '응용문제', expert: '고난도 문제' }
    : { basic: 'Basic', applied: 'Applied', expert: 'Challenge' };
}

// ---- semester (학기) of a Korean middle-school unit ----------------------------------------------------
// '1-1' … '3-2' (중학교 학년-학기), or null for units that are not part of a middle-school semester
// (high-school transformations, logic, ...). Worksheet pages list only units of the semester they were
// opened for, using the same grouping as the home curriculum list.
const AMC_SEMESTER = {
  'gcd-lcm': '1-1', 'primes-factorization': '1-1', 'coordinate-geometry': '1-1', 'ratios-percent': '1-1',
  'angles-plane-figures': '1-2', circles: '1-2',
  'equations-inequalities': '2-1',
  triangles: '2-2', 'quadrilaterals-polygons': '2-2', probability: '2-2',
};
const GEOMETRY_CATEGORY_SEMESTER = {
  'basic-figures-intro': '1-2',
  'middle-geometry-basics': '1-2',
  'applied-basic-figures-applied': '1-2',
  'applied-position-relations-applied': '1-2',
  'applied-construction-congruence-applied': '1-2',
  'applied-polygons-applied': '1-2',
  'applied-circles-sectors-applied': '1-2',
  'applied-polyhedra-revolution-applied': '1-2',
  'applied-solids-measures-applied': '1-2',
  'applied-data-stats-applied': '1-2',
  'applied-geo-mock': '1-2',
  'applied-plane-mock': '1-2',
  'applied-solid-mock': '1-2',
  'applied-grade7-final-mock': '1-2',
  'triangle-quadrilateral': '2-2',
  'triangle-similarity': '2-2',
  'circle-properties': '3-2',
};
const ID_SEMESTER = [
  ['2-1', /rpm-mono|rpm-poly-calc|rpm-linear-ineq|rpm-ineq-app|rpm-sys-|rpm-linear-func|rpm-line-eqn|rat-dec|repeating|grade8-semester-one|linear-functions-2|linear-inequalities-2|systems-linear|polynomial-operations|applied-mono|applied-poly-calc|applied-linear-ineq|applied-ineq-app|applied-sys|applied-linear-func|applied-line-eqn|decimal-classification|polynomial-basics|monomial-multiply|exponent-laws/],
  ['3-2', /g9s2|grade9-semester-two|data-variation|trig|scatter-corr/],
  ['3-1', /(^|-)g9-|grade9-semester-one|radicals-real|identities-factoring|quadratic|radical-ops/],
  ['2-2', /(^|-)g8-|grade8-semester-two|probability-2|pythagorean|parallelogram|special-quad|triangle-circumcenter|triangle-incenter|isosceles-triangle|triangle-centroid|midsegment|parallel-line-segment|right-triangle-similarity|similarity-conditions|similar-solids/],
  ['1-2', /frequency-table|stem-leaf|center-spread|applied-data|grade7-semester-two/],
  ['1-1', /prime|gcd|lcm|divisor|integer|rational|absolute|expression|equation|coordinate|plane|quadrant|proportion|direct|inverse|applied-alg|applied-app|applied-irc?-|applied-ir-|grade7-semester-one|age-problems|advanced-linear|trip-graph|symmetric-points|ordered-pair|^powers|power-form|positive-negative|number-line|number-comparison|^notation|simplify-linear|equality-properties|distance-speed|concentration|two-solution|meeting-point|percentage|applied-eq-/],
];

export function middleSemester(unit) {
  if (unit?.amcUnitId) return AMC_SEMESTER[unit.amcUnitId] ?? null;
  const id = String(unit?.id ?? '');
  if (unit?.category && GEOMETRY_CATEGORY_SEMESTER[unit.category]) return GEOMETRY_CATEGORY_SEMESTER[unit.category];
  if (unit?.category === 'core-geometry') {
    if (/pythagorean|congruence-similarity|high-coordinate/.test(id)) return /high-coordinate/.test(id) ? null : '2-2';
    return '1-2';
  }
  if (['transformations', 'logical-reasoning'].includes(unit?.category)) return null;
  for (const [semester, pattern] of ID_SEMESTER) if (pattern.test(id)) return semester;
  return null;
}

// Chapter headings for the grouped 문제 유형 list of the geometry page (Korean middle-school profile).
const GEOMETRY_CHAPTER = {
  'basic-figures-intro': '기본 도형', 'core-geometry': '기본 도형 · 각과 작도', 'middle-geometry-basics': '다각형 · 원 · 입체도형',
  'applied-basic-figures-applied': '기본 도형', 'applied-position-relations-applied': '위치 관계', 'applied-construction-congruence-applied': '작도와 합동',
  'applied-polygons-applied': '다각형', 'applied-circles-sectors-applied': '원과 부채꼴', 'applied-polyhedra-revolution-applied': '다면체와 회전체',
  'applied-solids-measures-applied': '입체도형의 겉넓이와 부피', 'applied-data-stats-applied': '자료의 정리와 해석',
  'applied-geo-mock': '종합 모의고사', 'applied-plane-mock': '종합 모의고사', 'applied-solid-mock': '종합 모의고사', 'applied-grade7-final-mock': '종합 모의고사',
  'triangle-quadrilateral': '삼각형 · 사각형', 'triangle-similarity': '닮음 · 피타고라스', 'circle-properties': '원의 성질',
};
export function geometryChapter(unit) {
  return GEOMETRY_CHAPTER[unit?.category] || '기타';
}

// [{ label, units }] in first-appearance order.
export function groupUnits(units, labelOf) {
  const groups = [];
  const byLabel = new Map();
  units.forEach((unit) => {
    const label = labelOf(unit);
    if (!byLabel.has(label)) { const group = { label, units: [] }; byLabel.set(label, group); groups.push(group); }
    byLabel.get(label).units.push(unit);
  });
  return groups;
}

// Chapter of a 중3 unit, used to title the groups of the unit list (their catalog category is just "중3-1 실전 응용").
const MIDDLE3_CHAPTER = [
  [/g9s2.*(circle|inscribed|tangent|angle|cyclic|chord)|circle-/, '원의 성질'],
  [/g9s2-trig-apps/, '삼각비의 활용'],
  [/g9s2-trig/, '삼각비'],
  [/radical-ops|radical-mult|rationalize/, '근호를 포함한 식의 계산'],
  [/radicals-real|radical-/, '제곱근과 실수'],
  [/poly-mult/, '다항식의 곱셈'],
  [/factor|identities/, '인수분해'],
  [/quad-func|quadratic-functions|quadratic-max/, '이차함수'],
  [/quad-app/, '이차방정식의 활용'],
  [/quad-|quadratic-equations/, '이차방정식'],
  [/trig-apps/, '삼각비의 활용'],
  [/trig/, '삼각비'],
  [/circle|inscribed|tangent/, '원의 성질'],
  [/scatter|correlation/, '상관관계와 산점도'],
  [/stats|variation/, '대푯값과 산포도'],
  [/advanced-skill|grade9/, '심화 · 종합'],
];
export function middle3Chapter(unit) {
  const id = String(unit?.id ?? '');
  for (const [pattern, label] of MIDDLE3_CHAPTER) if (pattern.test(id)) return label;
  return null;
}
