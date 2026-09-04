// Canonical unit/topic taxonomies for the AMC and CSAT exam archives.
// Stored as the plain label string in archive_items.unit_tag, so these lists
// are additive: renaming an id here never breaks already-tagged files, and a
// pre-existing free-text tag that happens to match a label still filters correctly.

export const AMC_UNITS = [
  { id: 'algebra', label: '대수', labelEn: 'Algebra', description: '사칙연산·일차방정식·비와 비율·백분율·속력과 일률·수열과 규칙' },
  { id: 'number-theory', label: '정수론', labelEn: 'Number Theory', description: '소수와 소인수분해·약수와 배수·최대공약수와 최소공배수·나머지·자릿수 주기' },
  { id: 'geometry', label: '기하', labelEn: 'Geometry', description: '평면도형과 각도·삼각형·사각형과 다각형·원과 부채꼴·입체도형·좌표평면' },
  { id: 'combinatorics-probability', label: '경우의 수와 확률', labelEn: 'Counting & Probability', description: '합·곱의 법칙·순열과 조합·벤다이어그램·경로 찾기·수학적 확률' },
  { id: 'statistics-data', label: '통계와 자료 해석', labelEn: 'Statistics & Data Analysis', description: '평균·중앙값·최빈값·범위·막대그래프와 표 분석' },
  { id: 'logic-word-problems', label: '논리와 문제해결', labelEn: 'Logic & Problem Solving', description: '논리 추론·시계와 달력·게임 전략·암호산·실생활 문장제' },
  { id: 'functions', label: '함수', labelEn: 'Functions', description: '함수의 성질·규칙 연산과 함수값·그래프' },
  { id: 'advanced', label: '심화 경시 (AMC 10·12)', labelEn: 'Advanced (AMC 10/12)', description: '삼각함수·복소수·로그 등 고등 경시 주제' },
];

// Finer-grained taxonomy for PER-PROBLEM classification (not per-file like AMC_UNITS above).
// Used by amcProblemClassifier.js to tag individual problems extracted from uploaded AMC PDFs,
// and by the "단원별 AMC 기출문제" browser to group actual problems by granular topic.
export const AMC_FINE_SUBJECTS = [
  {
    id: 'algebra', label: '대수', labelEn: 'Algebra',
    description: '기초 연산부터 방정식, 비율, 속력, 수열까지 대수 영역 핵심 주제',
    units: [
      { id: 'arithmetic-operations', label: '사칙연산과 계산 법칙', labelEn: 'Arithmetic & Operations', desc: '분수·소수 계산, 연산 순서, 거듭제곱과 부호' },
      { id: 'equations-inequalities', label: '방정식과 부등식', labelEn: 'Equations & Inequalities', desc: '일차방정식, 연립방정식, 절댓값 방정식' },
      { id: 'ratios-percent', label: '비·비례식과 백분율', labelEn: 'Ratios, Rates & Percent', desc: '비와 비율, 비례식, 정비례/반비례, 백분율' },
      { id: 'percentages-money', label: '백분율·할인과 이익', labelEn: 'Percentages & Finance', desc: '퍼센트 증감, 세금, 할인율, 원가와 정가' },
      { id: 'speed-distance-time', label: '속력·거리·시간', labelEn: 'Speed, Distance & Time', desc: '평균 속력, 상대속력, 왕복 및 추격 문제' },
      { id: 'work-rate', label: '일의 양과 작업률', labelEn: 'Work & Rates', desc: '함께 일하기, 물통 채우기, 시간당 능률' },
      { id: 'sequences-patterns', label: '수열과 규칙성', labelEn: 'Sequences & Patterns', desc: '등차수열, 계차수열, 수 배열과 패턴 규칙' },
      { id: 'expressions-substitution', label: '식의 계산과 대입', labelEn: 'Expressions & Substitution', desc: '문자식 정리, 식의 값 구하기, 대입법' },
    ],
  },
  {
    id: 'number-theory', label: '정수론', labelEn: 'Number Theory',
    description: '소수, 약수, 배수, 나머지, 자릿수 분석 등 정수론 영역 핵심 주제',
    units: [
      { id: 'primes-factorization', label: '소수와 소인수분해', labelEn: 'Primes & Factorization', desc: '소수 판별, 소인수분해, 소인수의 합과 곱' },
      { id: 'divisors-multiples', label: '약수와 배수 (약수의 개수)', labelEn: 'Divisors & Multiples', desc: '약수의 개수와 총합, 공약수와 공배수' },
      { id: 'gcd-lcm', label: '최대공약수와 최소공배수', labelEn: 'GCD & LCM', desc: 'GCD·LCM 관계식, 주기성 및 순환 문제' },
      { id: 'remainders-divisibility', label: '나머지와 배수 판정법', labelEn: 'Remainders & Divisibility', desc: '배수 판정법, 나눗셈과 나머지 연산' },
      { id: 'units-digit-cycles', label: '일의 자리와 거듭제곱 주기', labelEn: 'Units Digit & Cycles', desc: '거듭제곱 끝자리 주기성, 끝 두 자리' },
      { id: 'bases-digits', label: '자릿수 분석과 진법', labelEn: 'Digits & Number Bases', desc: '각 자리 숫자의 합, 십진법 자릿수 구조, n진법' },
    ],
  },
  {
    id: 'geometry', label: '기하', labelEn: 'Geometry',
    description: '각도, 삼각형, 사각형, 원, 입체도형, 좌표평면 등 기하 영역 핵심 주제',
    units: [
      { id: 'angles-plane-figures', label: '평면도형과 각도·평행선', labelEn: 'Angles & Plane Figures', desc: '맞꼭지각, 동위각, 엇각, 평행선 각도' },
      { id: 'triangles', label: '삼각형의 성질과 피타고라스', labelEn: 'Triangles & Pythagorean', desc: '이등변·정삼각형, 직각삼각형, 삼각부등식' },
      { id: 'quadrilaterals-polygons', label: '사각형과 다각형의 성질', labelEn: 'Quadrilaterals & Polygons', desc: '직사각형, 정사각형, 평행사변형, 다각형 내각·대각선' },
      { id: 'area-perimeter', label: '도형의 넓이와 둘레', labelEn: 'Area & Perimeter', desc: '색칠한 부분의 넓이, 둘레 계산, 도형 자르기/붙이기' },
      { id: 'circles', label: '원과 부채꼴', labelEn: 'Circles & Sectors', desc: '원주율, 원의 둘레와 넓이, 부채꼴 호와 면적' },
      { id: 'solids', label: '입체도형 (부피·겉넓이)', labelEn: 'Solids (Volume & Area)', desc: '직육면체, 정육면체, 원기둥, 부피와 겉넓이, 전개도' },
      { id: 'coordinate-geometry', label: '좌표평면과 격자점', labelEn: 'Coordinate & Lattice', desc: '좌표, 중점, 기울기, 격자점 세기' },
      { id: 'symmetry-transformations', label: '대칭·회전과 공간지각', labelEn: 'Symmetry & Spatial Vision', desc: '선대칭, 점대칭, 회전체, 접기/펼치기' },
    ],
  },
  {
    id: 'combinatorics-probability', label: '경우의 수와 확률', labelEn: 'Counting & Probability',
    description: '경우의 수 계산, 순열, 조합, 벤다이어그램, 확률 등 조합 영역 핵심 주제',
    units: [
      { id: 'counting', label: '경우의 수 (합·곱의 법칙)', labelEn: 'Counting Principles', desc: '수형도, 합의 법칙, 곱의 법칙, 체계적 나열' },
      { id: 'permutations-arrangements', label: '순열과 나열하기', labelEn: 'Permutations & Orderings', desc: '서로 다른 n개 중 r개 일렬 나열, 조건부 나열' },
      { id: 'permutations-combinations', label: '순열과 조합 (팀 선택)', labelEn: 'Combinations & Selection', desc: '대표 선출, 조 편성, 부분집합 선택' },
      { id: 'venn-sets', label: '벤다이어그램과 집합', labelEn: 'Venn Diagrams & Sets', desc: '두/세 집합 교집합·합집합, 포함배제' },
      { id: 'paths-grids', label: '경로 찾기와 격자길', labelEn: 'Grid Paths & Routing', desc: '최단거리 길찾기, 파스칼 삼각형 응용' },
      { id: 'probability', label: '확률 (주사위·동전·기하)', labelEn: 'Probability', desc: '주사위, 동전, 카드, 제비뽑기, 넓이의 비율' },
    ],
  },
  {
    id: 'statistics-data', label: '통계와 자료 해석', labelEn: 'Statistics & Data',
    description: '대푯값, 평균, 중앙값, 자료 해석 등 통계 영역 핵심 주제',
    units: [
      { id: 'statistics-averages', label: '평균·중앙값·최빈값', labelEn: 'Mean, Median & Mode', desc: '산술평균, 가중평균, 중앙값 찾기, 대푯값' },
      { id: 'charts-data-analysis', label: '표와 그래프 해석', labelEn: 'Charts & Data Analysis', desc: '막대그래프, 꺾은선그래프, 원그래프, 표 분석' },
    ],
  },
  {
    id: 'logic-word-problems', label: '논리와 문제해결', labelEn: 'Logic & Problem Solving',
    description: '논리 추론, 참·거짓 판별, 시계/달력, 게임 전략, 암호산 등 문제해결 영역',
    units: [
      { id: 'logical-reasoning', label: '논리적 추론과 참·거짓', labelEn: 'Logical Reasoning', desc: '진실/거짓말쟁이 문제, 명제 논리, 경우 따지기' },
      { id: 'clocks-calendars', label: '시계와 달력 문제', labelEn: 'Clocks & Calendars', desc: '시침과 분침이 이루는 각도, 요일 계산, 날짜 주기' },
      { id: 'games-strategy', label: '게임과 필승 전략', labelEn: 'Games & Strategy', desc: '동전 집기, 님 게임, 후수/선수 필승법' },
      { id: 'cryptarithms-puzzles', label: '암호산과 수학 퍼즐', labelEn: 'Cryptarithms & Puzzles', desc: '복면산, 마방진, 빈칸 채우기 퍼즐' },
      { id: 'word-problems', label: '실생활 문장제 (나이·금액)', labelEn: 'Word Problems', desc: '나이 문제, 금액 분배, 과부족 문제' },
    ],
  },
  {
    id: 'functions', label: '함수', labelEn: 'Functions',
    description: '함수의 정의, 함수값 계산, 합성함수, 일차함수 그래프',
    units: [
      { id: 'function-properties', label: '함수의 성질과 그래프', labelEn: 'Function Properties & Graphs', desc: 'f(x) 정의, 규칙에 따른 함수값 계산, 합성함수' },
    ],
  },
  {
    id: 'advanced', label: '심화 주제 (AMC 10·12)', labelEn: 'Trig & Complex (AMC 10/12)',
    description: '삼각함수, 복소수 등 고등 경시 심화 주제',
    units: [
      { id: 'trigonometry', label: '삼각함수', labelEn: 'Trigonometry', desc: 'sin, cos, tan 삼각비 및 삼각함수 성질' },
      { id: 'complex-numbers', label: '복소수', labelEn: 'Complex Numbers', desc: '허수 단위 i, 복소수의 연산과 켤레복소수' },
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
