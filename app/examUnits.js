// Canonical unit/topic taxonomies for the AMC and CSAT exam archives.
// Stored as the plain label string in archive_items.unit_tag, so these lists
// are additive: renaming an id here never breaks already-tagged files, and a
// pre-existing free-text tag that happens to match a label still filters correctly.

export const AMC_UNITS = [
  { id: 'algebra', label: '대수', labelEn: 'Algebra', description: '방정식·부등식·수열과 급수·다항식' },
  { id: 'geometry', label: '기하', labelEn: 'Geometry', description: '평면기하·입체기하·좌표기하' },
  { id: 'number-theory', label: '정수론', labelEn: 'Number Theory', description: '소인수분해·나머지·진법' },
  { id: 'combinatorics-probability', label: '조합과 확률', labelEn: 'Counting & Probability', description: '경우의 수·순열과 조합·확률' },
  { id: 'functions', label: '함수', labelEn: 'Functions', description: '함수의 성질과 그래프' },
  { id: 'trig-complex', label: '삼각함수와 복소수', labelEn: 'Trigonometry & Complex Numbers', description: 'AMC 12 중심 단원' },
  { id: 'logic-misc', label: '논리와 기타', labelEn: 'Logic & Miscellaneous', description: '단어 문제·논리적 추론' },
];

// Finer-grained taxonomy for PER-PROBLEM classification (not per-file like AMC_UNITS above).
// Used by amcProblemClassifier.js to tag individual problems extracted from uploaded AMC PDFs,
// and by the "단원별 AMC 기출문제" browser to group actual problems (not just whole files) by topic.
export const AMC_FINE_SUBJECTS = [
  {
    id: 'algebra', label: '대수', labelEn: 'Algebra',
    units: [
      { id: 'equations-inequalities', label: '방정식과 부등식', labelEn: 'Equations & Inequalities' },
      { id: 'ratios-percent', label: '비·비율과 백분율', labelEn: 'Ratios, Rates & Percent' },
      { id: 'sequences-patterns', label: '수열과 규칙', labelEn: 'Sequences & Patterns' },
      { id: 'expressions-substitution', label: '문자식과 대입', labelEn: 'Expressions & Substitution' },
    ],
  },
  {
    id: 'geometry', label: '기하', labelEn: 'Geometry',
    units: [
      { id: 'angles-plane-figures', label: '평면도형과 각도', labelEn: 'Angles & Plane Figures' },
      { id: 'triangles', label: '삼각형의 성질', labelEn: 'Triangles' },
      { id: 'quadrilaterals-polygons', label: '사각형과 다각형', labelEn: 'Quadrilaterals & Polygons' },
      { id: 'circles', label: '원과 부채꼴', labelEn: 'Circles & Sectors' },
      { id: 'solids', label: '입체도형 (부피·겉넓이)', labelEn: 'Solids (Volume & Surface Area)' },
      { id: 'coordinate-geometry', label: '좌표평면', labelEn: 'Coordinate Geometry' },
    ],
  },
  {
    id: 'number-theory', label: '정수론', labelEn: 'Number Theory',
    units: [
      { id: 'primes-factorization', label: '소수와 소인수분해', labelEn: 'Primes & Factorization' },
      { id: 'divisors-multiples', label: '약수와 배수', labelEn: 'Divisors & Multiples' },
      { id: 'remainders-divisibility', label: '나머지와 나누어떨어짐', labelEn: 'Remainders & Divisibility' },
      { id: 'bases-digits', label: '진법과 자릿수', labelEn: 'Bases & Digit Problems' },
    ],
  },
  {
    id: 'combinatorics-probability', label: '조합과 확률', labelEn: 'Counting & Probability',
    units: [
      { id: 'counting', label: '경우의 수', labelEn: 'Counting Principles' },
      { id: 'probability', label: '확률', labelEn: 'Probability' },
      { id: 'permutations-combinations', label: '순열과 조합', labelEn: 'Permutations & Combinations' },
    ],
  },
  {
    id: 'logic-word-problems', label: '논리와 문장제', labelEn: 'Logic & Word Problems',
    units: [
      { id: 'logical-reasoning', label: '논리적 추론', labelEn: 'Logical Reasoning' },
      { id: 'word-problems', label: '문장제 (속력·나이·금액)', labelEn: 'Word Problems' },
      { id: 'games-strategy', label: '게임과 전략', labelEn: 'Games & Strategy' },
    ],
  },
  {
    id: 'functions', label: '함수', labelEn: 'Functions',
    units: [
      { id: 'function-properties', label: '함수의 성질과 그래프', labelEn: 'Function Properties & Graphs' },
    ],
  },
  {
    id: 'advanced', label: '삼각함수·복소수 (AMC 10·12)', labelEn: 'Trig & Complex Numbers (AMC 10/12)',
    units: [
      { id: 'trigonometry', label: '삼각함수', labelEn: 'Trigonometry' },
      { id: 'complex-numbers', label: '복소수', labelEn: 'Complex Numbers' },
    ],
  },
  {
    id: 'uncategorized', label: '미분류', labelEn: 'Uncategorized',
    units: [
      { id: 'uncategorized', label: '자동 분류 미확정', labelEn: 'Not yet classified' },
    ],
  },
];

export function flattenAmcFineUnits() {
  return AMC_FINE_SUBJECTS.flatMap((subject) => subject.units.map((unit) => ({
    ...unit, subjectId: subject.id, subjectLabel: subject.label, subjectLabelEn: subject.labelEn,
  })));
}

export function findAmcFineUnit(unitId) {
  return flattenAmcFineUnits().find((unit) => unit.id === unitId) || null;
}

// Matches the site's existing 2015/2022 개정 교육과정 dual-naming convention
// (see app/curriculumCatalog.js) so the CSAT archive doesn't invent a separate scheme.
export const CSAT_SUBJECTS = [
  {
    id: 'math1', label: '수학Ⅰ', labelEn: 'Math I', revised2022: '대수',
    units: [
      { id: 'exp-log', label: '지수함수와 로그함수', labelEn: 'Exponential & Logarithmic Functions' },
      { id: 'trig', label: '삼각함수', labelEn: 'Trigonometric Functions' },
      { id: 'sequences', label: '수열', labelEn: 'Sequences' },
    ],
  },
  {
    id: 'math2', label: '수학Ⅱ', labelEn: 'Math II', revised2022: '미적분Ⅰ',
    units: [
      { id: 'limits-continuity', label: '함수의 극한과 연속', labelEn: 'Limits & Continuity' },
      { id: 'differentiation', label: '미분', labelEn: 'Differentiation' },
      { id: 'integration', label: '적분', labelEn: 'Integration' },
    ],
  },
  {
    id: 'prob-stats', label: '확률과 통계', labelEn: 'Probability & Statistics', revised2022: '확률과 통계',
    units: [
      { id: 'counting', label: '경우의 수', labelEn: 'Counting Principles' },
      { id: 'probability', label: '확률', labelEn: 'Probability' },
      { id: 'statistics', label: '통계', labelEn: 'Statistics' },
    ],
  },
  {
    id: 'calculus', label: '미적분', labelEn: 'Calculus', revised2022: '미적분Ⅱ',
    units: [
      { id: 'sequence-limits', label: '수열의 극한', labelEn: 'Limits of Sequences' },
      { id: 'advanced-differentiation', label: '여러 가지 미분법', labelEn: 'Advanced Differentiation' },
      { id: 'advanced-integration', label: '여러 가지 적분법', labelEn: 'Advanced Integration' },
    ],
  },
  {
    id: 'geometry', label: '기하', labelEn: 'Geometry', revised2022: '기하',
    units: [
      { id: 'conic-sections', label: '이차곡선', labelEn: 'Conic Sections' },
      { id: 'plane-vectors', label: '평면벡터', labelEn: 'Plane Vectors' },
      { id: 'space-geometry', label: '공간도형과 공간좌표', labelEn: 'Solid Geometry & Space Coordinates' },
    ],
  },
];

// Composite label ("수학Ⅰ · 지수함수와 로그함수") used as the stored unit_tag value,
// so the plain-string tag stays self-descriptive without a schema change.
export function csatUnitTagLabel(subject, unit) {
  return `${subject.label} · ${unit.label}`;
}

export function flattenCsatUnits() {
  return CSAT_SUBJECTS.flatMap((subject) => subject.units.map((unit) => ({
    value: csatUnitTagLabel(subject, unit),
    subjectId: subject.id,
    subjectLabel: subject.label,
    unitId: unit.id,
    unitLabel: unit.label,
  })));
}
