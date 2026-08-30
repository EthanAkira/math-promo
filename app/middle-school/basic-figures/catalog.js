import { CORE_GEOMETRY_UNITS } from './geometryProblemEngine';
import { ADVANCED_GEOMETRY_UNITS } from './advancedGeometryEngine';
import { ADVANCED_GEOMETRY_CHALLENGE_UNITS } from './advancedGeometryChallengeEngine';
import { MIDDLE_GEOMETRY_BASIC_UNITS } from './middleGeometryBasicsEngine';

function randomInt(random, min, max) {
  return Math.floor(random() * (max - min + 1)) + min;
}

function pick(random, values) {
  return values[randomInt(random, 0, values.length - 1)];
}

function problem(prompt, expression, answer, answerSuffix = '', promptEn = '', expressionEn = '') {
  return { prompt, expression, answer: String(answer), answerSuffix, promptEn, expressionEn };
}

// --- 01-1~01-2 : 점·선·면, 직선/반직선/선분, 입체도형의 면·꼭짓점·모서리 정오 판별 ---
const STATEMENTS = [
  { ko: '점, 선, 면은 도형을 이루는 기본 요소이다.', en: 'A point, a line, and a plane are the basic elements of a figure.', answer: 1 },
  { ko: '점이 움직인 자리는 항상 직선이 된다.', en: 'The path traced by a moving point is always a straight line.', answer: 2 },
  { ko: '면과 면이 만나면 교선이 생기고, 교선은 항상 직선이다.', en: 'When two planes meet, the line of intersection is always straight.', answer: 2 },
  { ko: '서로 다른 두 점을 지나는 직선은 오직 하나뿐이다.', en: 'Exactly one line passes through two distinct points.', answer: 1 },
  { ko: '선분 AB와 선분 BA는 같은 도형을 나타낸다.', en: 'Segment AB and segment BA name the same figure.', answer: 1 },
  { ko: '반직선 AB와 반직선 BA는 같은 도형을 나타낸다.', en: 'Ray AB and ray BA name the same figure.', answer: 2 },
  { ko: '삼각뿔의 면의 개수는 4개이다.', en: 'A triangular pyramid has 4 faces.', answer: 1 },
  { ko: '삼각뿔의 모서리의 개수는 5개이다.', en: 'A triangular pyramid has 5 edges.', answer: 2 },
  { ko: '삼각기둥의 꼭짓점의 개수는 6개이다.', en: 'A triangular prism has 6 vertices.', answer: 1 },
  { ko: '삼각기둥의 면의 개수는 5개이다.', en: 'A triangular prism has 5 faces.', answer: 1 },
  { ko: '사각뿔의 모서리의 개수는 6개이다.', en: 'A square pyramid has 6 edges.', answer: 2 },
  { ko: '평각의 크기는 180˚이다.', en: 'A straight angle measures 180˚.', answer: 1 },
  { ko: '맞꼭지각의 크기는 서로 같다.', en: 'Vertical angles are always equal in measure.', answer: 1 },
  { ko: '두 직선이 수직으로 만나면 그 교각의 크기는 90˚이다.', en: 'If two lines meet at right angles, the angle between them is 90˚.', answer: 1 },
  { ko: '예각은 90˚보다 크고 180˚보다 작은 각이다.', en: 'An acute angle is greater than 90˚ and less than 180˚.', answer: 2 },
  { ko: '한 점을 지나는 직선은 무수히 많이 그을 수 있다.', en: 'Infinitely many lines can be drawn through a single point.', answer: 1 },
];

function termsOx(random) {
  const item = pick(random, STATEMENTS);
  return {
    ...problem(
      '다음 설명이 옳은지 판단하세요.',
      item.ko,
      item.answer,
      '',
      'Decide whether the statement below is true or false.',
      item.en
    ),
    choices: [
      { value: '1', label: '참 (O)', labelEn: 'True' },
      { value: '2', label: '거짓 (X)', labelEn: 'False' },
    ],
  };
}

// --- 01-3 : 두 점 사이의 거리, 중점과 삼등분점 ---
function distanceMidpoint(random) {
  const variant = randomInt(random, 0, 3);
  if (variant === 0) {
    const ab = randomInt(random, 2, 11) * 2; // 4~22, 짝수
    return problem(
      '선분 AB의 중점을 M이라 하자. AM의 길이를 구하세요.',
      `AB = ${ab}cm`,
      ab / 2,
      'cm',
      'M is the midpoint of segment AB. Find the length of AM.',
      `AB = ${ab} cm`
    );
  }
  if (variant === 1) {
    const ab = randomInt(random, 1, 8) * 4; // 4~32, 4의 배수
    return problem(
      '선분 AB의 중점을 M, AM의 중점을 N이라 하자. NM의 길이를 구하세요.',
      `AB = ${ab}cm`,
      ab / 4,
      'cm',
      'M is the midpoint of AB, and N is the midpoint of AM. Find the length of NM.',
      `AB = ${ab} cm`
    );
  }
  const ab = randomInt(random, 2, 9) * 3; // 6~27, 3의 배수
  if (variant === 2) {
    return problem(
      '점 M, N은 선분 AB의 삼등분점이다 (AM = MN = NB). AM의 길이를 구하세요.',
      `AB = ${ab}cm`,
      ab / 3,
      'cm',
      'Points M and N divide segment AB into three equal parts (AM = MN = NB). Find the length of AM.',
      `AB = ${ab} cm`
    );
  }
  return problem(
    '점 M, N은 선분 AB의 삼등분점이다 (AM = MN = NB). MB의 길이를 구하세요.',
    `AB = ${ab}cm`,
    (ab / 3) * 2,
    'cm',
    'Points M and N divide segment AB into three equal parts (AM = MN = NB). Find the length of MB.',
    `AB = ${ab} cm`
  );
}

// --- 01-4 : 각의 분류 ---
function angleClassify(random) {
  const r = random();
  let deg;
  if (r < 0.15) deg = 90;
  else if (r < 0.3) deg = 180;
  else if (r < 0.65) deg = randomInt(random, 1, 89);
  else deg = randomInt(random, 91, 179);

  let answer;
  if (deg === 90) answer = 2;
  else if (deg === 180) answer = 4;
  else if (deg < 90) answer = 1;
  else answer = 3;

  return {
    ...problem(
      '다음 각은 예각, 직각, 둔각, 평각 중 무엇인가요?',
      `${deg}˚`,
      answer,
      '',
      'Which of these best describes the angle below?'
    ),
    choices: [
      { value: '1', label: '예각', labelEn: 'Acute' },
      { value: '2', label: '직각', labelEn: 'Right' },
      { value: '3', label: '둔각', labelEn: 'Obtuse' },
      { value: '4', label: '평각', labelEn: 'Straight' },
    ],
  };
}

// --- 01-4 : 평각을 이용한 미지각 구하기 ---
function straightAngle(random) {
  const a = randomInt(random, 1, 17) * 10; // 10~170
  const x = 180 - a;
  return problem(
    '일직선 위의 한 점에서 갈라진 두 각이 평각을 이룰 때, x의 값을 구하세요.',
    `${a}˚ + x = 180˚`,
    x,
    '˚',
    'Two angles formed at a point on a straight line add up to a straight angle. Find x.',
    `${a}˚ + x = 180˚`
  );
}

// --- 01-5 : 맞꼭지각 ---
function verticalAngle(random) {
  const a = randomInt(random, 1, 17) * 10; // 10~170
  const r = random();
  if (r < 0.45) {
    return problem(
      '두 직선이 한 점에서 만날 때 생기는 맞꼭지각(서로 마주 보는 각)의 크기를 구하세요.',
      `한 각의 크기 = ${a}˚`,
      a,
      '˚',
      'Two lines cross at a point. Find the measure of the vertical angle (the angle opposite the given one).',
      `One angle = ${a}˚`
    );
  }
  if (r < 0.8) {
    return problem(
      '두 직선이 한 점에서 만날 때 생기는 이웃한 각의 크기를 구하세요.',
      `한 각의 크기 = ${a}˚`,
      180 - a,
      '˚',
      'Two lines cross at a point. Find the measure of the angle adjacent to the given one.',
      `One angle = ${a}˚`
    );
  }
  const a3 = randomInt(random, 1, 5) * 10; // 10~50, a3+b3 <= 150 보장
  const maxBSteps = Math.max(1, Math.floor((150 - a3) / 10));
  const b3 = 10 + randomInt(random, 0, maxBSteps - 1) * 10;
  const x = 180 - a3 - b3;
  return problem(
    '한 점에서 나온 세 반직선이 평각을 이룰 때, x의 값을 구하세요.',
    `${a3}˚ + ${b3}˚ + x = 180˚`,
    x,
    '˚',
    'Three rays from one point together form a straight angle. Find x.',
    `${a3}˚ + ${b3}˚ + x = 180˚`
  );
}

// --- 01-6 : 수직과 수선 ---
const PERP_QUESTIONS = [
  {
    q: '직선 l 위에 있지 않은 점 P에서 직선 l에 수선을 내렸을 때 생기는 교점을 무엇이라 하나요?',
    qEn: 'What is the intersection point called when a perpendicular is dropped from a point P (not on line l) to line l?',
    choices: [
      { ko: '수선의 발', en: 'Foot of the perpendicular' },
      { ko: '수직이등분점', en: 'Perpendicular bisector point' },
      { ko: '대칭점', en: 'Symmetric point' },
      { ko: '교선', en: 'Line of intersection' },
    ],
    answer: 1,
  },
  {
    q: '점과 직선 사이의 거리는 그 점에서 직선에 내린 무엇의 길이인가요?',
    qEn: 'The distance from a point to a line is the length of what, drawn from the point to the line?',
    choices: [
      { ko: '수선', en: 'The perpendicular' },
      { ko: '접선', en: 'The tangent' },
      { ko: '대각선', en: 'The diagonal' },
      { ko: '중선', en: 'The median' },
    ],
    answer: 1,
  },
  {
    q: '두 직선이 만나서 이루는 각이 90˚일 때, 두 직선의 관계는 무엇인가요?',
    qEn: 'If two lines meet at a 90˚ angle, how are the two lines related?',
    choices: [
      { ko: '평행하다', en: 'Parallel' },
      { ko: '수직이다', en: 'Perpendicular' },
      { ko: '일치한다', en: 'Coincident' },
      { ko: '꼬인 위치에 있다', en: 'Skew' },
    ],
    answer: 2,
  },
  {
    q: '점 P에서 직선 l 위의 점들까지 그은 선분 중 길이가 가장 짧은 것은 무엇인가요?',
    qEn: 'Among all segments from point P to points on line l, which one is the shortest?',
    choices: [
      { ko: '수선', en: 'The perpendicular' },
      { ko: '임의의 선분', en: 'Any arbitrary segment' },
      { ko: '평행선', en: 'A parallel line' },
      { ko: '반직선', en: 'A ray' },
    ],
    answer: 1,
  },
  {
    q: '기호 AB⊥CD는 두 선분이 어떤 관계임을 나타내나요?',
    qEn: 'What relationship does the notation AB⊥CD indicate between the two segments?',
    choices: [
      { ko: '평행', en: 'Parallel' },
      { ko: '수직', en: 'Perpendicular' },
      { ko: '같음', en: 'Equal' },
      { ko: '겹침', en: 'Overlapping' },
    ],
    answer: 2,
  },
  {
    q: '삼각형에서 한 꼭짓점과 그 대변 사이의 거리를 잴 때 사용하는 선분은 무엇인가요?',
    qEn: 'In a triangle, which segment is used to measure the distance from a vertex to its opposite side?',
    choices: [
      { ko: '수선', en: 'The perpendicular (altitude)' },
      { ko: '대각선', en: 'The diagonal' },
      { ko: '중선', en: 'The median' },
      { ko: '이등분선', en: 'The bisector' },
    ],
    answer: 1,
  },
];

function perpendicular(random) {
  const q = pick(random, PERP_QUESTIONS);
  return {
    ...problem(q.q, '', q.answer, '', q.qEn, ''),
    choices: q.choices.map((choice, index) => ({ value: String(index + 1), label: choice.ko, labelEn: choice.en })),
  };
}

const generators = [termsOx, distanceMidpoint, angleClassify, straightAngle, verticalAngle, perpendicular];

// CORE_GEOMETRY_UNITS/MIDDLE_GEOMETRY_BASIC_UNITS only had exam-track `profiles` (kr/international/amc/...),
// with no grade/course namespace like the Algebra catalogs use (kr-middle-1, algebra-1, ...). This map adds
// that second, independent axis via `curriculumProfiles` so curriculumCatalog.js can deep-link a specific
// grade's page to the matching unit. Units not listed here (e.g. regional-geometry-mixed) span multiple
// grades and are intentionally left untagged.
const CURRICULUM_PROFILES = {
  // CORE_GEOMETRY_UNITS (geometryProblemEngine.js)
  'visual-foundations': ['kr-middle-1', 'pre-algebra'],
  'visual-angles': ['kr-middle-1', 'pre-algebra'],
  'perpendicular-distance': ['kr-middle-1', 'pre-algebra'],
  'parallel-lines': ['kr-middle-1', 'pre-algebra'],
  'triangle-angles': ['kr-middle-1', 'pre-algebra'],
  'ruler-compass-construction': ['kr-middle-1', 'pre-algebra'],
  'triangle-side-angle-relations': ['kr-middle-2', 'geometry'],
  'circle-sector': ['kr-middle-1', 'pre-algebra'],
  'triangle-congruence-similarity': ['kr-middle-2', 'geometry'],
  'pythagorean-theorem': ['kr-middle-2', 'geometry'],
  'high-coordinate-geometry': ['kr-high-1', 'geometry'],
  'solid-elements': ['kr-middle-1', 'pre-algebra'],
  'solid-relations': ['kr-middle-1', 'pre-algebra'],

  // MIDDLE_GEOMETRY_BASIC_UNITS (middleGeometryBasicsEngine.js)
  'polygon-foundations-basic': ['kr-middle-1', 'pre-algebra'],
  'polygon-diagonals-basic': ['kr-middle-1', 'pre-algebra'],
  'polygon-angles-basic': ['kr-middle-1', 'pre-algebra'],
  'triangle-interior-exterior-basic': ['kr-middle-1', 'pre-algebra'],
  'circle-parts-basic': ['kr-middle-1', 'pre-algebra'],
  'circle-sector-proportion': ['kr-middle-1', 'pre-algebra'],
  'circle-sector-inverse-basic': ['kr-middle-1', 'pre-algebra'],
  'annulus-composite-circle': ['kr-middle-1', 'pre-algebra'],
  'annular-sector-measures': ['kr-middle-1', 'pre-algebra'],
  'polyhedron-counts-general': ['kr-middle-1', 'pre-algebra'],
  'polyhedron-concepts-euler': ['kr-middle-1', 'geometry'],
  'regular-polyhedra-basic': ['kr-middle-1', 'pre-algebra'],
  'solids-revolution-nets': ['kr-middle-1', 'pre-algebra'],
  'solids-revolution-sections': ['kr-middle-1', 'pre-algebra'],
  'metric-solid-nets': ['kr-middle-1', 'pre-algebra'],
  'prism-cylinder-measures': ['kr-middle-1', 'pre-algebra'],
  'pyramid-cone-measures': ['kr-middle-1', 'pre-algebra'],
  'expanded-solid-measures': ['kr-middle-1', 'geometry'],
  'sphere-measures-basic': ['kr-middle-1', 'pre-algebra'],
  'hemisphere-sphere-ratios': ['kr-middle-1', 'geometry'],
  'solid-volume-ratios': ['kr-middle-1', 'pre-algebra'],
};

function withCurriculumProfiles(units) {
  return units.map((unit) => (
    CURRICULUM_PROFILES[unit.id] ? { ...unit, curriculumProfiles: CURRICULUM_PROFILES[unit.id] } : unit
  ));
}

export const BASIC_FIGURE_UNITS = [
  { id: 'terms-ox', label: '점·선·면 정오 판별', description: '점·선·면의 성질, 직선/반직선/선분의 표현, 입체도형의 면·꼭짓점·모서리 판별하기', en: ['Points, Lines & Planes (True/False)', 'Check statements about points, lines, planes, and solid shapes'], make: termsOx },
  { id: 'distance-midpoint', label: '두 점 사이의 거리와 중점', description: '중점과 삼등분점을 이용해 선분의 길이 구하기', en: ['Distance & Midpoints', 'Use midpoints and trisection points to find segment lengths'], make: distanceMidpoint },
  { id: 'angle-classify', label: '각의 분류', description: '주어진 각을 예각·직각·둔각·평각으로 분류하기', en: ['Classifying Angles', 'Classify a given angle as acute, right, obtuse, or straight'], make: angleClassify },
  { id: 'straight-angle', label: '평각과 미지각', description: '평각을 이루는 두 각의 관계로 x의 값 구하기', en: ['Straight Angles', 'Use two angles that form a straight angle to find x'], make: straightAngle },
  { id: 'vertical-angle', label: '맞꼭지각', description: '두 직선이 만날 때 생기는 맞꼭지각과 이웃한 각 구하기', en: ['Vertical Angles', 'Find vertical and adjacent angles formed by intersecting lines'], make: verticalAngle },
  { id: 'perpendicular', label: '수직과 수선', description: '수선의 발, 점과 직선 사이의 거리 등 수직 관련 개념 확인하기', en: ['Perpendicular Lines', 'Check concepts like the foot of a perpendicular and point-to-line distance'], make: perpendicular },
  { id: 'basic-figures-mixed', label: '기본 도형 기본 종합', description: '점·선·면부터 맞꼭지각, 수직과 수선까지 골고루 연습하기', en: ['Basic Figures Review', 'Mixed practice covering points, lines, angles, and perpendiculars'], make: (random) => pick(random, generators)(random) },
  ...withCurriculumProfiles(CORE_GEOMETRY_UNITS),
  ...withCurriculumProfiles(MIDDLE_GEOMETRY_BASIC_UNITS),
  ...ADVANCED_GEOMETRY_UNITS,
  ...ADVANCED_GEOMETRY_CHALLENGE_UNITS,
];

export function findBasicFigureUnit(unitId) {
  return BASIC_FIGURE_UNITS.find((unit) => unit.id === unitId)
    || BASIC_FIGURE_UNITS.find((unit) => unit.id === 'visual-foundations')
    || BASIC_FIGURE_UNITS[0];
}

export function localizeBasicFigureUnit(unit, language, field = 'label') {
  if (unit.labels) {
    const values = field === 'label' ? unit.labels : unit.descriptions;
    return values[language] || values[language?.split('-')[0]] || values.en || values.ko;
  }
  if (language === 'ko') return unit[field];
  return unit.en[field === 'label' ? 0 : 1];
}
