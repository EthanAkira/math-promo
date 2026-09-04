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
