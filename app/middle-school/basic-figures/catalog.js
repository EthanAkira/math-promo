
import {
  rpmGeoBasicIntersections,
  rpmGeoBasicLineRays,
  rpmGeoBasicPointsToLines,
  rpmGeoBasicMidpointSegment,
  rpmGeoBasicAngleClassify,
  rpmGeoBasicStraightAngleEq,
  rpmGeoBasicAngleRatio,
  rpmGeoBasicAngleMultipleCond,
  rpmGeoBasicVerticalAngles,
  rpmGeoBasicVerticalAnglePairs,
  rpmGeoBasicPerpendicularDist,
  rpmGeoBasicVerticalMultiLines,
  rpmGeoBasicClockAngle,
  rpmGeoBasicAllTypesMixed,
  rpmPosPointLinePlane,
  rpmPosPlaneTwoLines,
  rpmPosSolidSkewEdges,
  rpmPosSolidEdgePlaneRelations,
  rpmPosSolidNetRelations,
  rpmPosCorrespondingAlternate,
  rpmPosParallelAngleSolve,
  rpmPosParallelCondition,
  rpmPosParallelBentLineSingle,
  rpmPosParallelBentLineMulti,
  rpmPosParallelWithPolygon,
  rpmPosParallelAngleBisector,
  rpmPosPaperFoldAngles,
  rpmPosParallelTwoPairs,
  rpmPosSpaceLogicStatements,
  rpmPosAllTypesMixed,
  rpmCongConstructSegment,
  rpmCongConstructAngleParallel,
  rpmCongTriangleOpposite,
  rpmCongTriangleInequality,
  rpmCongTriangleParamRange,
  rpmCongTriangleDeterminedCond,
  rpmCongFigureCongruenceProps,
  rpmCongTriangleSssSasAsa,
  rpmCongTriangleAddCondition,
  rpmCongRotationEquilateralSquare,
  rpmCongRightIsoscelesAltitude,
  rpmCongSquareOverlapArea,
  rpmCongAllTypesMixed,
  rpmGeoSemesterOneMockExam,
} from '../rpmAppliedEngine.js';
import { CORE_GEOMETRY_UNITS } from './geometryProblemEngine.js';
import { ADVANCED_GEOMETRY_UNITS } from './advancedGeometryEngine.js';
import { ADVANCED_GEOMETRY_CHALLENGE_UNITS } from './advancedGeometryChallengeEngine.js';
import { MIDDLE_GEOMETRY_BASIC_UNITS } from './middleGeometryBasicsEngine.js';
import { TRIANGLE_QUADRILATERAL_UNITS } from './triangleQuadrilateralEngine.js';
import { TRIANGLE_SIMILARITY_UNITS } from './triangleSimilarityEngine.js';
import { CIRCLE_PROPERTIES_UNITS } from './circlePropertiesEngine.js';
import { TRANSFORMATIONS_UNITS } from './transformationsEngine.js';
import { LOGICAL_REASONING_UNITS } from './logicalReasoningEngine.js';

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
  // RPM 01 기본도형 세부 응용
  'rpm-geo-basic-intersections': ['kr-middle-1', 'pre-algebra'],
  'rpm-geo-basic-line-rays': ['kr-middle-1', 'pre-algebra'],
  'rpm-geo-basic-points-lines': ['kr-middle-1', 'pre-algebra'],
  'rpm-geo-basic-midpoint-seg': ['kr-middle-1', 'pre-algebra'],
  'rpm-geo-basic-angle-classify': ['kr-middle-1', 'pre-algebra'],
  'rpm-geo-basic-straight-angle-eq': ['kr-middle-1', 'pre-algebra'],
  'rpm-geo-basic-angle-ratio': ['kr-middle-1', 'pre-algebra'],
  'rpm-geo-basic-angle-multiple': ['kr-middle-1', 'pre-algebra'],
  'rpm-geo-basic-vertical-angles': ['kr-middle-1', 'pre-algebra'],
  'rpm-geo-basic-vertical-pairs': ['kr-middle-1', 'pre-algebra'],
  'rpm-geo-basic-perp-distance': ['kr-middle-1', 'pre-algebra'],
  'rpm-geo-basic-vertical-multi': ['kr-middle-1', 'pre-algebra'],
  'rpm-geo-basic-clock-angle': ['kr-middle-1', 'pre-algebra'],
  'rpm-geo-basic-all-mixed': ['kr-middle-1', 'pre-algebra'],

  // RPM 02 위치 관계 세부 응용
  'rpm-pos-point-line-plane': ['kr-middle-1', 'pre-algebra'],
  'rpm-pos-plane-two-lines': ['kr-middle-1', 'pre-algebra'],
  'rpm-pos-solid-skew-edges': ['kr-middle-1', 'pre-algebra'],
  'rpm-pos-solid-edge-plane': ['kr-middle-1', 'pre-algebra'],
  'rpm-pos-solid-net-relations': ['kr-middle-1', 'pre-algebra'],
  'rpm-pos-corresponding-alternate': ['kr-middle-1', 'pre-algebra'],
  'rpm-pos-parallel-angle-solve': ['kr-middle-1', 'pre-algebra'],
  'rpm-pos-parallel-condition': ['kr-middle-1', 'pre-algebra'],
  'rpm-pos-parallel-bent-single': ['kr-middle-1', 'pre-algebra'],
  'rpm-pos-parallel-bent-multi': ['kr-middle-1', 'pre-algebra'],
  'rpm-pos-parallel-with-polygon': ['kr-middle-1', 'pre-algebra'],
  'rpm-pos-parallel-angle-bisector': ['kr-middle-1', 'pre-algebra'],
  'rpm-pos-paper-fold-angles': ['kr-middle-1', 'pre-algebra'],
  'rpm-pos-parallel-two-pairs': ['kr-middle-1', 'pre-algebra'],
  'rpm-pos-space-logic': ['kr-middle-1', 'pre-algebra'],
  'rpm-pos-all-mixed': ['kr-middle-1', 'pre-algebra'],

  // RPM 03 작도와 합동 세부 응용
  'rpm-cong-construct-segment': ['kr-middle-1', 'pre-algebra'],
  'rpm-cong-construct-angle-parallel': ['kr-middle-1', 'pre-algebra'],
  'rpm-cong-triangle-opposite': ['kr-middle-1', 'pre-algebra'],
  'rpm-cong-triangle-inequality': ['kr-middle-1', 'pre-algebra'],
  'rpm-cong-triangle-param-range': ['kr-middle-1', 'pre-algebra'],
  'rpm-cong-triangle-determined-cond': ['kr-middle-1', 'pre-algebra'],
  'rpm-cong-figure-congruence-props': ['kr-middle-1', 'pre-algebra'],
  'rpm-cong-triangle-sss-sas-asa': ['kr-middle-1', 'pre-algebra'],
  'rpm-cong-triangle-add-condition': ['kr-middle-1', 'pre-algebra'],
  'rpm-cong-rotation-equilateral-square': ['kr-middle-1', 'pre-algebra'],
  'rpm-cong-right-isosceles-altitude': ['kr-middle-1', 'pre-algebra'],
  'rpm-cong-square-overlap-area': ['kr-middle-1', 'pre-algebra'],
  'rpm-cong-all-mixed': ['kr-middle-1', 'pre-algebra'],

  // 중학 1-2 기하 실전 모의고사
  'rpm-geo-semester-one-mock-exam': ['kr-middle-1', 'pre-algebra'],

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

  // TRIANGLE_QUADRILATERAL_UNITS (triangleQuadrilateralEngine.js)
  'isosceles-triangle-properties': ['kr-middle-2', 'geometry'],
  'triangle-circumcenter': ['kr-middle-2', 'geometry'],
  'triangle-incenter': ['kr-middle-2', 'geometry'],
  'parallelogram-properties': ['kr-middle-2', 'geometry'],
  'special-quadrilaterals': ['kr-middle-2', 'geometry'],

  // TRIANGLE_SIMILARITY_UNITS (triangleSimilarityEngine.js)
  'similarity-conditions': ['kr-middle-2', 'geometry'],
  'right-triangle-similarity': ['kr-middle-2', 'geometry'],
  'similar-solids-ratio': ['kr-middle-2', 'geometry'],
  'parallel-line-segment-ratio': ['kr-middle-2', 'geometry'],
  'midsegment-theorem': ['kr-middle-2', 'geometry'],
  'triangle-centroid-median': ['kr-middle-2', 'geometry'],
  'pythagorean-applications': ['kr-middle-2', 'geometry'],

  // CIRCLE_PROPERTIES_UNITS (circlePropertiesEngine.js - RPM 중3-2 원의 성질)
  'circle-chord-properties': ['kr-middle-3', 'geometry', 'amc12'],
  'circle-tangent-properties': ['kr-middle-3', 'geometry', 'amc12'],
  'circle-inscribed-circumscribed': ['kr-middle-3', 'geometry', 'amc12'],
  'circle-inscribed-angles': ['kr-middle-3', 'geometry', 'amc12'],
  'circle-cyclic-quadrilaterals': ['kr-middle-3', 'geometry', 'amc12'],
  'circle-tangent-chord-angles': ['kr-middle-3', 'geometry', 'amc12'],
  'circle-properties-mixed': ['kr-middle-3', 'geometry', 'amc12'],

  // TRANSFORMATIONS_UNITS (transformationsEngine.js) — coordinate translation/reflection/
  // rotation/dilation; in the 2022 개정 Korean curriculum this is 공통수학2 (고1) content.
  'transform-translation': ['kr-high-1', 'geometry'],
  'transform-reflection': ['kr-high-1', 'geometry'],
  'transform-rotation': ['kr-high-1', 'geometry'],
  'transform-dilation': ['kr-high-1', 'geometry'],
  'transform-dilation-area': ['kr-high-1', 'geometry'],

  // LOGICAL_REASONING_UNITS (logicalReasoningEngine.js) — truth tables/conditional forms are
  // 2022 개정 공통수학2 "명제" content (고1); detachment/syllogism and the equality properties
  // used in two-column proofs are the same course's introduction to formal proof.
  'logic-truth-tables': ['kr-high-1', 'geometry'],
  'logic-conditional-forms': ['kr-high-1', 'geometry'],
  'logic-detachment-syllogism': ['kr-high-1', 'geometry'],
  'logic-segment-angle-properties': ['kr-high-1', 'geometry'],
};

function withCurriculumProfiles(units) {
  return units.map((unit) => (
    CURRICULUM_PROFILES[unit.id] ? { ...unit, curriculumProfiles: CURRICULUM_PROFILES[unit.id] } : unit
  ));
}

// `tier` ('basic'|'intermediate'|'advanced' -> 하/중/상) and `category` (대단원 grouping, used by
// the "종합 테스트 만들기" checkbox tree) are hand-judged static metadata added for the core-practice
// test generator — no per-problem difficulty signal exists anywhere in this engine to derive them
// from automatically (only ADVANCED_GEOMETRY_CHALLENGE_UNITS carries an informal `difficulty`
// object, and only on 7 of ~90 units). Judged from each unit's own scope/grade level, not measured.
const UNIT_META = {
  // 01 기본도형 세부 응용 유형
  'rpm-geo-basic-intersections': { tier: 'basic', category: 'rpm-basic-figures-applied' },
  'rpm-geo-basic-line-rays': { tier: 'basic', category: 'rpm-basic-figures-applied' },
  'rpm-geo-basic-points-lines': { tier: 'intermediate', category: 'rpm-basic-figures-applied' },
  'rpm-geo-basic-midpoint-seg': { tier: 'intermediate', category: 'rpm-basic-figures-applied' },
  'rpm-geo-basic-angle-classify': { tier: 'basic', category: 'rpm-basic-figures-applied' },
  'rpm-geo-basic-straight-angle-eq': { tier: 'intermediate', category: 'rpm-basic-figures-applied' },
  'rpm-geo-basic-angle-ratio': { tier: 'intermediate', category: 'rpm-basic-figures-applied' },
  'rpm-geo-basic-angle-multiple': { tier: 'intermediate', category: 'rpm-basic-figures-applied' },
  'rpm-geo-basic-vertical-angles': { tier: 'intermediate', category: 'rpm-basic-figures-applied' },
  'rpm-geo-basic-vertical-pairs': { tier: 'intermediate', category: 'rpm-basic-figures-applied' },
  'rpm-geo-basic-perp-distance': { tier: 'basic', category: 'rpm-basic-figures-applied' },
  'rpm-geo-basic-vertical-multi': { tier: 'advanced', category: 'rpm-basic-figures-applied' },
  'rpm-geo-basic-clock-angle': { tier: 'advanced', category: 'rpm-basic-figures-applied' },
  'rpm-geo-basic-all-mixed': { tier: 'intermediate', category: 'rpm-basic-figures-applied' },

  // 02 위치 관계 세부 응용 유형
  'rpm-pos-point-line-plane': { tier: 'basic', category: 'rpm-position-relations-applied' },
  'rpm-pos-plane-two-lines': { tier: 'basic', category: 'rpm-position-relations-applied' },
  'rpm-pos-solid-skew-edges': { tier: 'intermediate', category: 'rpm-position-relations-applied' },
  'rpm-pos-solid-edge-plane': { tier: 'intermediate', category: 'rpm-position-relations-applied' },
  'rpm-pos-solid-net-relations': { tier: 'advanced', category: 'rpm-position-relations-applied' },
  'rpm-pos-corresponding-alternate': { tier: 'basic', category: 'rpm-position-relations-applied' },
  'rpm-pos-parallel-angle-solve': { tier: 'intermediate', category: 'rpm-position-relations-applied' },
  'rpm-pos-parallel-condition': { tier: 'intermediate', category: 'rpm-position-relations-applied' },
  'rpm-pos-parallel-bent-single': { tier: 'intermediate', category: 'rpm-position-relations-applied' },
  'rpm-pos-parallel-bent-multi': { tier: 'intermediate', category: 'rpm-position-relations-applied' },
  'rpm-pos-parallel-with-polygon': { tier: 'advanced', category: 'rpm-position-relations-applied' },
  'rpm-pos-parallel-angle-bisector': { tier: 'advanced', category: 'rpm-position-relations-applied' },
  'rpm-pos-paper-fold-angles': { tier: 'advanced', category: 'rpm-position-relations-applied' },
  'rpm-pos-parallel-two-pairs': { tier: 'intermediate', category: 'rpm-position-relations-applied' },
  'rpm-pos-space-logic': { tier: 'advanced', category: 'rpm-position-relations-applied' },
  'rpm-pos-all-mixed': { tier: 'intermediate', category: 'rpm-position-relations-applied' },

  // 03 작도와 합동 세부 응용 유형
  'rpm-cong-construct-segment': { tier: 'basic', category: 'rpm-construction-congruence-applied' },
  'rpm-cong-construct-angle-parallel': { tier: 'intermediate', category: 'rpm-construction-congruence-applied' },
  'rpm-cong-triangle-opposite': { tier: 'basic', category: 'rpm-construction-congruence-applied' },
  'rpm-cong-triangle-inequality': { tier: 'intermediate', category: 'rpm-construction-congruence-applied' },
  'rpm-cong-triangle-param-range': { tier: 'intermediate', category: 'rpm-construction-congruence-applied' },
  'rpm-cong-triangle-determined-cond': { tier: 'intermediate', category: 'rpm-construction-congruence-applied' },
  'rpm-cong-figure-congruence-props': { tier: 'basic', category: 'rpm-construction-congruence-applied' },
  'rpm-cong-triangle-sss-sas-asa': { tier: 'intermediate', category: 'rpm-construction-congruence-applied' },
  'rpm-cong-triangle-add-condition': { tier: 'intermediate', category: 'rpm-construction-congruence-applied' },
  'rpm-cong-rotation-equilateral-square': { tier: 'advanced', category: 'rpm-construction-congruence-applied' },
  'rpm-cong-right-isosceles-altitude': { tier: 'advanced', category: 'rpm-construction-congruence-applied' },
  'rpm-cong-square-overlap-area': { tier: 'advanced', category: 'rpm-construction-congruence-applied' },
  'rpm-cong-all-mixed': { tier: 'intermediate', category: 'rpm-construction-congruence-applied' },

  // 1학기 총괄 모의고사
  'rpm-geo-semester-one-mock-exam': { tier: 'advanced', category: 'rpm-geo-mock' },
  'terms-ox': { tier: 'basic', category: 'basic-figures-intro' },
  'distance-midpoint': { tier: 'basic', category: 'basic-figures-intro' },
  'angle-classify': { tier: 'basic', category: 'basic-figures-intro' },
  'straight-angle': { tier: 'basic', category: 'basic-figures-intro' },
  'vertical-angle': { tier: 'basic', category: 'basic-figures-intro' },
  'perpendicular': { tier: 'basic', category: 'basic-figures-intro' },
  'basic-figures-mixed': { tier: 'basic', category: 'basic-figures-intro' },

  'visual-foundations': { tier: 'basic', category: 'core-geometry' },
  'visual-angles': { tier: 'basic', category: 'core-geometry' },
  'perpendicular-distance': { tier: 'basic', category: 'core-geometry' },
  'parallel-lines': { tier: 'basic', category: 'core-geometry' },
  'triangle-angles': { tier: 'basic', category: 'core-geometry' },
  'ruler-compass-construction': { tier: 'basic', category: 'core-geometry' },
  'triangle-side-angle-relations': { tier: 'intermediate', category: 'core-geometry' },
  'circle-sector': { tier: 'basic', category: 'core-geometry' },
  'triangle-congruence-similarity': { tier: 'intermediate', category: 'core-geometry' },
  'pythagorean-theorem': { tier: 'intermediate', category: 'core-geometry' },
  'high-coordinate-geometry': { tier: 'intermediate', category: 'core-geometry' },
  'solid-elements': { tier: 'basic', category: 'core-geometry' },
  'solid-relations': { tier: 'basic', category: 'core-geometry' },

  'polygon-foundations-basic': { tier: 'basic', category: 'middle-geometry-basics' },
  'polygon-diagonals-basic': { tier: 'basic', category: 'middle-geometry-basics' },
  'polygon-angles-basic': { tier: 'intermediate', category: 'middle-geometry-basics' },
  'triangle-interior-exterior-basic': { tier: 'basic', category: 'middle-geometry-basics' },
  'circle-parts-basic': { tier: 'basic', category: 'middle-geometry-basics' },
  'circle-sector-proportion': { tier: 'intermediate', category: 'middle-geometry-basics' },
  'circle-sector-inverse-basic': { tier: 'intermediate', category: 'middle-geometry-basics' },
  'annulus-composite-circle': { tier: 'intermediate', category: 'middle-geometry-basics' },
  'annular-sector-measures': { tier: 'intermediate', category: 'middle-geometry-basics' },
  'polyhedron-counts-general': { tier: 'basic', category: 'middle-geometry-basics' },
  'polyhedron-concepts-euler': { tier: 'intermediate', category: 'middle-geometry-basics' },
  'regular-polyhedra-basic': { tier: 'basic', category: 'middle-geometry-basics' },
  'solids-revolution-nets': { tier: 'intermediate', category: 'middle-geometry-basics' },
  'solids-revolution-sections': { tier: 'intermediate', category: 'middle-geometry-basics' },
  'metric-solid-nets': { tier: 'intermediate', category: 'middle-geometry-basics' },
  'prism-cylinder-measures': { tier: 'intermediate', category: 'middle-geometry-basics' },
  'pyramid-cone-measures': { tier: 'intermediate', category: 'middle-geometry-basics' },
  'expanded-solid-measures': { tier: 'advanced', category: 'middle-geometry-basics' },
  'sphere-measures-basic': { tier: 'intermediate', category: 'middle-geometry-basics' },
  'hemisphere-sphere-ratios': { tier: 'advanced', category: 'middle-geometry-basics' },
  'solid-volume-ratios': { tier: 'intermediate', category: 'middle-geometry-basics' },

  'isosceles-triangle-properties': { tier: 'intermediate', category: 'triangle-quadrilateral' },
  'triangle-circumcenter': { tier: 'intermediate', category: 'triangle-quadrilateral' },
  'triangle-incenter': { tier: 'intermediate', category: 'triangle-quadrilateral' },
  'parallelogram-properties': { tier: 'intermediate', category: 'triangle-quadrilateral' },
  'special-quadrilaterals': { tier: 'intermediate', category: 'triangle-quadrilateral' },

  'similarity-conditions': { tier: 'intermediate', category: 'triangle-similarity' },
  'right-triangle-similarity': { tier: 'intermediate', category: 'triangle-similarity' },
  'similar-solids-ratio': { tier: 'advanced', category: 'triangle-similarity' },
  'parallel-line-segment-ratio': { tier: 'intermediate', category: 'triangle-similarity' },
  'midsegment-theorem': { tier: 'intermediate', category: 'triangle-similarity' },
  'triangle-centroid-median': { tier: 'intermediate', category: 'triangle-similarity' },
  'pythagorean-applications': { tier: 'advanced', category: 'triangle-similarity' },

  'circle-chord-properties': { tier: 'intermediate', category: 'circle-properties' },
  'circle-tangent-properties': { tier: 'intermediate', category: 'circle-properties' },
  'circle-inscribed-circumscribed': { tier: 'advanced', category: 'circle-properties' },
  'circle-inscribed-angles': { tier: 'advanced', category: 'circle-properties' },
  'circle-cyclic-quadrilaterals': { tier: 'advanced', category: 'circle-properties' },
  'circle-tangent-chord-angles': { tier: 'advanced', category: 'circle-properties' },
  'circle-properties-mixed': { tier: 'advanced', category: 'circle-properties' },

  'transform-translation': { tier: 'basic', category: 'transformations' },
  'transform-reflection': { tier: 'basic', category: 'transformations' },
  'transform-rotation': { tier: 'intermediate', category: 'transformations' },
  'transform-dilation': { tier: 'intermediate', category: 'transformations' },
  'transform-dilation-area': { tier: 'advanced', category: 'transformations' },

  'logic-truth-tables': { tier: 'basic', category: 'logical-reasoning' },
  'logic-conditional-forms': { tier: 'intermediate', category: 'logical-reasoning' },
  'logic-detachment-syllogism': { tier: 'intermediate', category: 'logical-reasoning' },
  'logic-segment-angle-properties': { tier: 'intermediate', category: 'logical-reasoning' },

  'radians-trig-ratios': { tier: 'advanced', category: 'advanced-geometry' },
  'sine-cosine-laws': { tier: 'advanced', category: 'advanced-geometry' },
  'advanced-circle-theorems': { tier: 'advanced', category: 'advanced-geometry' },
  'triangle-centers': { tier: 'advanced', category: 'advanced-geometry' },
  'olympiad-geometry': { tier: 'advanced', category: 'advanced-geometry' },
  'conic-sections': { tier: 'advanced', category: 'advanced-geometry' },
  'plane-vectors': { tier: 'advanced', category: 'advanced-geometry' },
  'space-geometry-coordinates': { tier: 'advanced', category: 'advanced-geometry' },
  'trigonometric-graphs': { tier: 'advanced', category: 'advanced-geometry' },
  'calculus-geometry-visuals': { tier: 'advanced', category: 'advanced-geometry' },
  'statistics-visuals': { tier: 'advanced', category: 'advanced-geometry' },
  'amc12-geometry-mixed': { tier: 'advanced', category: 'advanced-geometry' },
  'csat-geometry-mixed': { tier: 'advanced', category: 'advanced-geometry' },
  'g12-visual-mixed': { tier: 'advanced', category: 'advanced-geometry' },

  'amc12-multi-theorem': { tier: 'advanced', category: 'advanced-geometry-challenge' },
  'csat-geometry-reasoning': { tier: 'advanced', category: 'advanced-geometry-challenge' },
  'g12-geometry-challenge': { tier: 'advanced', category: 'advanced-geometry-challenge' },
  'tangent-power-challenge': { tier: 'advanced', category: 'advanced-geometry-challenge' },
  'similarity-area-challenge': { tier: 'advanced', category: 'advanced-geometry-challenge' },
  'conic-vector-challenge': { tier: 'advanced', category: 'advanced-geometry-challenge' },
  'space-projection-challenge': { tier: 'advanced', category: 'advanced-geometry-challenge' },
};

export const UNIT_CATEGORY_LABELS = {
  'rpm-basic-figures-applied': { label: '[RPM 세부응용] 01 기본도형', labelEn: '[Applied] 01 Basic Figures' },
  'rpm-position-relations-applied': { label: '[RPM 세부응용] 02 위치 관계', labelEn: '[Applied] 02 Position Relations' },
  'rpm-construction-congruence-applied': { label: '[RPM 세부응용] 03 작도와 합동', labelEn: '[Applied] 03 Constructions & Congruence' },
  'rpm-geo-mock': { label: '[총괄평가] 중학 1-2 기하 실전 모의고사', labelEn: '[Mock Exam] Grade 7-2 Geometry Comprehensive' },
  'basic-figures-intro': { label: '기본 도형 (점·선·면·각)', labelEn: 'Basic Figures (Points, Lines & Angles)' },
  'core-geometry': { label: '평면도형 기초', labelEn: 'Core Plane Geometry' },
  'middle-geometry-basics': { label: '다각형·원·입체도형', labelEn: 'Polygons, Circles & Solids' },
  'triangle-quadrilateral': { label: '삼각형과 사각형의 성질', labelEn: 'Triangle & Quadrilateral Properties' },
  'triangle-similarity': { label: '도형의 닮음', labelEn: 'Similarity' },
  'circle-properties': { label: '원의 성질', labelEn: 'Circle Properties' },
  'transformations': { label: '이동과 변환', labelEn: 'Transformations' },
  'logical-reasoning': { label: '명제와 논리', labelEn: 'Logical Reasoning' },
  'advanced-geometry': { label: '심화 기하 (고교·경시)', labelEn: 'Advanced Geometry (G12/Competition)' },
  'advanced-geometry-challenge': { label: '심화 기하 챌린지', labelEn: 'Advanced Geometry Challenge' },
};

function withDifficultyTier(units) {
  return units.map((unit) => (
    UNIT_META[unit.id] ? { ...unit, tier: UNIT_META[unit.id].tier, category: UNIT_META[unit.id].category } : unit
  ));
}


// -------------------------------------------------------------
// 중학 1-2 RPM 기하 세부 응용 유형 정의
// -------------------------------------------------------------
export const RPM_BASIC_FIGURES_APPLIED_UNITS = [
  { id: 'rpm-geo-basic-intersections', label: '[기본도형 유형 01] 입체도형에서의 교점과 교선의 개수', description: '삼각뿔, 사각뿔, 기둥 등 입체도형의 꼭짓점(교점)과 모서리(교선) 개수 및 2a+b 식 계산', en: ['Geometry Type 01: Vertices and Edges in Solids', 'Count intersection points (vertices) and lines (edges) in polyhedra'], make: rpmGeoBasicIntersections },
  { id: 'rpm-geo-basic-line-rays', label: '[기본도형 유형 02] 직선, 반직선, 선분의 구별과 일치 판별', description: '시작점과 뻗어나가는 방향에 따른 직선/반직선/선분의 일치 및 참/거짓 판별', en: ['Geometry Type 02: Lines, Rays, and Segments', 'Determine equivalence and truth of lines, rays, and line segments'], make: rpmGeoBasicLineRays },
  { id: 'rpm-geo-basic-points-lines', label: '[기본도형 유형 03] 점의 개수와 직선, 반직선, 선분의 개수', description: '원 위 또는 직선과 외부의 점들 중 두 점을 골라 만들 수 있는 직선/반직선/선분 개수', en: ['Geometry Type 03: Lines & Rays from Given Points', 'Calculate number of distinct lines and rays through combinations of points'], make: rpmGeoBasicPointsToLines },
  { id: 'rpm-geo-basic-midpoint-seg', label: '[기본도형 유형 04] 선분의 중점과 배수 관계를 이용한 선분의 길이', description: '중점 M, N과 배수 관계(AB=3BC 등)를 이용하여 전체 및 특정 선분의 길이 계산', en: ['Geometry Type 04: Segment Midpoints & Ratios', 'Calculate segment lengths using midpoints and linear ratio conditions'], make: rpmGeoBasicMidpointSegment },
  { id: 'rpm-geo-basic-angle-classify', label: '[기본도형 유형 05] 각의 분류와 예각·직각·둔각·평각 판별', description: '주어진 여러 각들 중 예각, 직각, 둔각, 평각의 개수를 세고 합과 차 구하기', en: ['Geometry Type 05: Classifying Angle Types', 'Identify and count acute, right, obtuse, and straight angles'], make: rpmGeoBasicAngleClassify },
  { id: 'rpm-geo-basic-straight-angle-eq', label: '[기본도형 유형 06] 평각(180°)을 이용한 미지각 일차방정식', description: '일직선 위의 두 각이나 세 각의 합이 180°임을 이용하여 미지수 x 및 각의 크기 구하기', en: ['Geometry Type 06: Straight Angle Linear Equations', 'Solve for x and angle measures using straight angle sum of 180°'], make: rpmGeoBasicStraightAngleEq },
  { id: 'rpm-geo-basic-angle-ratio', label: '[기본도형 유형 07] 각의 비례배분과 미지각의 크기', description: '평각(180°) 또는 직각(90°)에서 각의 비가 주어졌을 때 비례배분으로 각도 구하기', en: ['Geometry Type 07: Proportional Division of Angles', 'Divide straight and right angles proportionally using given angle ratios'], make: rpmGeoBasicAngleRatio },
  { id: 'rpm-geo-basic-angle-multiple', label: '[기본도형 유형 08] 각의 배수 조건과 수직선이 주어진 각도 계산', description: '수직(90°) 및 각의 배수 조건(∠AOB=k∠BOC 등)이 결합된 복합 각도 계산', en: ['Geometry Type 08: Angle Multiple & Perpendicular Conditions', 'Evaluate angles with multiple-ratio conditions and perpendicular lines'], make: rpmGeoBasicAngleMultipleCond },
  { id: 'rpm-geo-basic-vertical-angles', label: '[기본도형 유형 09] 맞꼭지각의 성질과 미지수 계산', description: '두 직선이 만날 때 생기는 맞꼭지각의 크기가 같음을 이용하여 x 및 이웃한 각 구하기', en: ['Geometry Type 09: Vertical Angle Equations', 'Solve equations using equality of vertical opposite angles'], make: rpmGeoBasicVerticalAngles },
  { id: 'rpm-geo-basic-vertical-pairs', label: '[기본도형 유형 10] 한 점에서 만나는 n개 직선의 맞꼭지각의 쌍의 개수', description: '한 점에서 만나는 n개의 직선에서 생기는 맞꼭지각의 총 쌍의 수 n(n-1) 구하기', en: ['Geometry Type 10: Counting Vertical Angle Pairs', 'Compute total number of vertical angle pairs n(n-1) formed by n lines'], make: rpmGeoBasicVerticalAnglePairs },
  { id: 'rpm-geo-basic-perp-distance', label: '[기본도형 유형 11] 수직과 수선, 점과 직선 사이의 거리', description: '수선의 발의 정의와 직사각형 등 도형에서 한 점과 변 사이의 거리 계산', en: ['Geometry Type 11: Perpendiculars & Point-to-Line Distance', 'Understand perpendicular foot and evaluate distances from point to line'], make: rpmGeoBasicPerpendicularDist },
  { id: 'rpm-geo-basic-vertical-multi', label: '[기본도형 유형 12] 복합 교차 직선에서의 맞꼭지각과 평각 계산', description: '세 직선 이상이 한 점에서 교차할 때 각의 비와 맞꼭지각을 융합한 심화 각도 계산', en: ['Geometry Type 12: Multi-line Vertical & Straight Angle System', 'Solve advanced angle systems with multiple intersecting lines and ratios'], make: rpmGeoBasicVerticalMultiLines },
  { id: 'rpm-geo-basic-clock-angle', label: '[기본도형 유형 13] 시계의 시침과 분침이 이루는 각의 크기', description: '시침(0.5°/분)과 분침(6°/분)의 이동 속력을 이용하여 h시 m분의 작은 쪽 각도 구하기', en: ['Geometry Type 13: Angles Formed by Clock Hands', 'Calculate smaller angle between hour and minute hands at given times'], make: rpmGeoBasicClockAngle },
  { id: 'rpm-geo-basic-all-mixed', label: '[단원 실전 다지기] 매일 01 기본도형 종합', description: '교점·교선, 직선·선분, 평각·맞꼭지각, 시계 각도 등 기본도형 전 유형 종합 출제', en: ['Daily 01 Basic Figures Comprehensive', 'Comprehensive mixed practice across all basic figures problem types'], make: rpmGeoBasicAllTypesMixed },
];

export const RPM_POSITION_RELATIONS_APPLIED_UNITS = [
  { id: 'rpm-pos-point-line-plane', label: '[위치관계 유형 01] 점과 직선, 점과 평면의 위치 관계', description: '점이 직선이나 평면 위에 있다/있지 않다의 정의와 포함 관계 판별', en: ['Position Type 01: Points, Lines & Planes Incidence', 'Determine incidence relations of points on lines and planes'], make: rpmPosPointLinePlane },
  { id: 'rpm-pos-plane-two-lines', label: '[위치관계 유형 02] 평면에서 두 직선의 위치 관계', description: '정다각형에서 특정 변을 포함하는 직선과 한 점에서 만나는/평행한 직선 개수', en: ['Position Type 02: Intersecting & Parallel Lines in a Plane', 'Count intersecting and parallel side-extended lines in regular polygons'], make: rpmPosPlaneTwoLines },
  { id: 'rpm-pos-solid-skew-edges', label: '[위치관계 유형 03] 입체도형에서 꼬인 위치에 있는 모서리의 개수', description: '직육면체, 삼각기둥, 정사면체 등에서 특정 모서리와 꼬인 위치(Skew)에 있는 모서리 개수', en: ['Position Type 03: Skew Edges in Polyhedra', 'Count edges skew to a given edge in prisms and pyramids'], make: rpmPosSolidSkewEdges },
  { id: 'rpm-pos-solid-edge-plane', label: '[위치관계 유형 04] 입체도형에서 모서리와 면, 면과 면의 위치 관계', description: '직육면체나 각기둥에서 특정 면과 수직/평행인 모서리와 면의 개수 세기', en: ['Position Type 04: Perpendicular & Parallel Edges and Faces', 'Count edges and faces perpendicular or parallel to a given face in solids'], make: rpmPosSolidEdgePlaneRelations },
  { id: 'rpm-pos-solid-net-relations', label: '[위치관계 유형 05] 전개도를 접어 만든 입체도형에서의 위치 관계', description: '정육면체 전개도를 접었을 때 서로 마주 보는 평행한 면의 쌍 및 수직 면 개수', en: ['Position Type 05: Spatial Relations in Folded Net Solids', 'Analyze parallel and perpendicular faces in folded cube nets'], make: rpmPosSolidNetRelations },
  { id: 'rpm-pos-corresponding-alternate', label: '[위치관계 유형 06] 동위각과 엇각의 위치 및 크기 판별', description: '평행선이 다른 한 직선과 만날 때 생기는 동위각과 엇각의 짝과 크기 확인', en: ['Position Type 06: Corresponding & Alternate Interior Angles', 'Identify corresponding and alternate angle pairs and their measures'], make: rpmPosCorrespondingAlternate },
  { id: 'rpm-pos-parallel-angle-solve', label: '[위치관계 유형 07] 평행선에서의 미지각 계산 (l // m)', description: '두 직선이 평행할 때 동위각과 엇각의 크기가 같음을 이용한 미지수 x의 값 구하기', en: ['Position Type 07: Solving Unknown Angles with Parallel Lines', 'Solve for x using equal measures of corresponding and alternate angles'], make: rpmPosParallelAngleSolve },
  { id: 'rpm-pos-parallel-condition', label: '[위치관계 유형 08] 두 직선이 평행하기 위한 조건 판별', description: '동위각이나 엇각의 크기가 같음을 확인하여 두 직선이 평행한지 여부 판별하기', en: ['Position Type 08: Conditions for Parallel Lines', 'Determine if two lines are parallel based on angle measures'], make: rpmPosParallelCondition },
  { id: 'rpm-pos-parallel-bent-single', label: '[위치관계 유형 09] 평행선 사이에 꺾인 점이 1개 있는 경우', description: '꺾인 점을 지나며 평행선에 나란한 보조선을 그어 꺾인 각 ∠x 구하기 (∠x = a + b)', en: ['Position Type 09: Bent Lines with One Vertex between Parallels', 'Draw parallel auxiliary lines at bend vertex to find angle sum x = a + b'], make: rpmPosParallelBentLineSingle },
  { id: 'rpm-pos-parallel-bent-multi', label: '[위치관계 유형 10] 평행선 사이에 꺾인 점이 2개 이상 있는 경우 (지그재그)', description: '지그재그 꺾인 선에서 왼쪽을 향하는 각들의 합 = 오른쪽을 향하는 각들의 합 원리 활용', en: ['Position Type 10: Zigzag Bent Lines between Parallels', 'Apply left-angles sum equals right-angles sum rule for multi-bend lines'], make: rpmPosParallelBentLineMulti },
  { id: 'rpm-pos-parallel-with-polygon', label: '[위치관계 유형 11] 평행선과 삼각형·정다각형이 결합된 각', description: '평행선 사이에 정삼각형이나 다각형의 꼭짓점이 놓였을 때 엇각과 내각의 결합 계산', en: ['Position Type 11: Parallel Lines with Polygons & Equilateral Triangles', 'Evaluate angles formed when polygon vertices lie between parallel lines'], make: rpmPosParallelWithPolygon },
  { id: 'rpm-pos-parallel-angle-bisector', label: '[위치관계 유형 12] 평행선과 각의 이등분선이 만날 때의 각', description: '평행선 내부 동측내각의 이등분선들이 만나는 점에서의 수직 교각(90°) 원리', en: ['Position Type 12: Angle Bisectors Between Parallel Lines', 'Analyze right angles formed by intersecting consecutive interior bisectors'], make: rpmPosParallelAngleBisector },
  { id: 'rpm-pos-paper-fold-angles', label: '[위치관계 유형 13] 종이 테이프를 접었을 때 생기는 각과 이등변삼각형', description: '접은 각 = 원래 각 성질과 평행선 엇각으로 이등변삼각형을 유도하여 각도 구하기', en: ['Position Type 13: Folded Paper Tape Angles & Isosceles Triangles', 'Use fold angle invariance and alternate angles to solve isosceles angles'], make: rpmPosPaperFoldAngles },
  { id: 'rpm-pos-parallel-two-pairs', label: '[위치관계 유형 14] 두 쌍의 평행선이 교차할 때의 각', description: 'l // m, p // q의 두 쌍의 평행선이 격자형으로 만날 때 동위각·엇각·보각 관계 분석', en: ['Position Type 14: Two Pairs of Intersecting Parallel Lines', 'Analyze grids of two parallel line pairs and supplementary angles'], make: rpmPosParallelTwoPairs },
  { id: 'rpm-pos-space-logic', label: '[위치관계 유형 15] 공간에서 위치 관계 참/거짓 명제 판별', description: '직육면체 공간 모델을 활용하여 직선과 평면의 수직/평행 명제의 참과 거짓 판별', en: ['Position Type 15: True/False Propositions in 3D Space', 'Evaluate spatial logic propositions on lines and planes using cuboid models'], make: rpmPosSpaceLogicStatements },
  { id: 'rpm-pos-all-mixed', label: '[단원 실전 다지기] 매일 02 위치 관계 종합', description: '꼬인 위치, 평행선의 동위각·엇각, 꺾인 선, 종이 접기 등 위치 관계 전 유형 종합 출제', en: ['Daily 02 Position Relations Comprehensive', 'Comprehensive mixed practice across all position relations problem types'], make: rpmPosAllTypesMixed },
];

export const RPM_CONSTRUCTION_CONGRUENCE_APPLIED_UNITS = [
  { id: 'rpm-cong-construct-segment', label: '[작도와 합동 유형 01] 작도의 도구와 길이가 같은 선분의 작도', description: '눈금 없는 자(선 긋기)와 컴퍼스(길이 옮기기)의 기본 원리와 선분 복사 작도', en: ['Congruence Type 01: Compass & Straightedge Segment Construction', 'Core roles of straightedge and compass in duplicating segment lengths'], make: rpmCongConstructSegment },
  { id: 'rpm-cong-construct-angle-parallel', label: '[작도와 합동 유형 02] 크기가 같은 각과 평행선의 작도', description: '크기가 같은 각 작도 시 길이가 같은 선분 확인 및 동위각을 이용한 평행선 작도', en: ['Congruence Type 02: Congruent Angles & Parallel Line Construction', 'Construct equal angles and verify parallel lines using corresponding angles'], make: rpmCongConstructAngleParallel },
  { id: 'rpm-cong-triangle-opposite', label: '[작도와 합동 유형 03] 삼각형의 대변과 대각', description: '삼각형 ABC에서 꼭짓점과 마주 보는 대변, 변과 마주 보는 대각 매칭', en: ['Congruence Type 03: Opposite Sides & Angles of a Triangle', 'Identify opposite sides and opposite angles in triangle ABC'], make: rpmCongTriangleOpposite },
  { id: 'rpm-cong-triangle-inequality', label: '[작도와 합동 유형 04] 삼각형의 세 변의 길이의 조건 (삼각형의 성립 조건)', description: '가장 긴 변 < 나머지 두 변의 합 조건으로 삼각형 성립 여부 판별 및 조합 개수 세기', en: ['Congruence Type 04: Triangle Inequality Theorem', 'Determine if segments form a triangle (longest < sum of other two)'], make: rpmCongTriangleInequality },
  { id: 'rpm-cong-triangle-param-range', label: '[작도와 합동 유형 05] 미지수 변이 주어졌을 때 삼각형 성립 범위', description: '두 변 a, b와 미지수 변 x가 주어졌을 때 |a-b| < x < a+b 만족하는 자연수 개수', en: ['Congruence Type 05: Range for Unknown Triangle Side', 'Find range and count of integers satisfying triangle inequality |a-b| < x < a+b'], make: rpmCongTriangleParamRange },
  { id: 'rpm-cong-triangle-determined-cond', label: '[작도와 합동 유형 06] 삼각형이 하나로 정해지는 조건 판별', description: 'SSS, SAS, ASA 조건 충족 여부 및 하나로 정해지지 않는 반례(AAA, SSA 등) 판별', en: ['Congruence Type 06: Conditions for Unique Triangle Determination', 'Check conditions determining a unique triangle vs non-unique cases'], make: rpmCongTriangleDeterminedCond },
  { id: 'rpm-cong-figure-congruence-props', label: '[작도와 합동 유형 07] 도형의 합동 성질과 대응변·대응각', description: '합동 기호(≡)의 대응점 순서, 대응변의 길이와 대응각의 크기 계산', en: ['Congruence Type 07: Congruence Properties & Corresponding Parts', 'Properties of congruent figures, corresponding sides, and angles'], make: rpmCongFigureCongruenceProps },
  { id: 'rpm-cong-triangle-sss-sas-asa', label: '[작도와 합동 유형 08] 삼각형의 합동 조건 (SSS, SAS, ASA) 판별', description: '대응하는 세 변(SSS), 두 변과 끼인각(SAS), 한 변과 양 끝각(ASA) 합동 판별', en: ['Congruence Type 08: SSS, SAS, and ASA Triangle Congruence', 'Identify applicable congruence criterion from given conditions'], make: rpmCongTriangleSssSasAsa },
  { id: 'rpm-cong-triangle-add-condition', label: '[작도와 합동 유형 09] 합동이 되기 위한 추가 조건 찾기', description: '두 조건이 주어졌을 때 목표 합동 조건(SSS, SAS, ASA)을 완성하는 추가 조건 탐색', en: ['Congruence Type 09: Finding Necessary Additional Conditions', 'Determine required additional side or angle to establish congruence'], make: rpmCongTriangleAddCondition },
  { id: 'rpm-cong-rotation-equilateral-square', label: '[작도와 합동 유형 10] 정삼각형 및 정사각형에서 회전 합동의 활용', description: '정삼각형이나 정사각형에서 회전 대칭으로 생기는 SAS 합동을 통한 길이·각도 계산', en: ['Congruence Type 10: Rotational Congruence in Equilateral Triangles & Squares', 'Apply rotational SAS congruence in regular polygons to find lengths and angles'], make: rpmCongRotationEquilateralSquare },
  { id: 'rpm-cong-right-isosceles-altitude', label: '[작도와 합동 유형 11] 직각이등변삼각형의 꼭짓점을 지나는 직선과 합동', description: '직각이등변삼각형 꼭짓점의 직선에 내린 두 수선으로 생기는 직각삼각형 합동 활용', en: ['Congruence Type 11: Altitudes on Line through Right Isosceles Vertex', 'Exploit congruent right triangles formed by dropping altitudes onto a line'], make: rpmCongRightIsoscelesAltitude },
  { id: 'rpm-cong-square-overlap-area', label: '[작도와 합동 유형 12] 정사각형 겹침에서의 합동과 넓이', description: '대각선의 교점에 꼭짓점이 놓인 두 정사각형의 겹친 넓이 = 한 정사각형의 1/4 계산', en: ['Congruence Type 12: Overlapping Squares Area via Congruence', 'Calculate constant overlap area (1/4 of square) by rotational congruence'], make: rpmCongSquareOverlapArea },
  { id: 'rpm-cong-all-mixed', label: '[단원 실전 다지기] 매일 03 작도와 합동 종합', description: '작도 도구, 삼각형 성립 조건, SSS/SAS/ASA 합동, 회전 합동 등 전 유형 종합 출제', en: ['Daily 03 Constructions & Congruence Comprehensive', 'Comprehensive mixed practice across all construction and congruence types'], make: rpmCongAllTypesMixed },
];

export const RPM_GEO_MOCK_UNITS = [
  { id: 'rpm-geo-semester-one-mock-exam', label: '[1학기 총괄평가] 매일 중학 1-2 1학기 기하 전 범위 실전 모의고사 (기본도형~합동)', description: '기본도형, 위치관계, 작도와 합동 3개 단원 총 20문항 실전 모의고사', en: ['Grade 7-2 Semester 1 Geometry Comprehensive Mock Exam', 'Comprehensive 20-problem mock exam across Basic Figures, Position Relations, and Congruence'], make: rpmGeoSemesterOneMockExam },
];


export const BASIC_FIGURE_UNITS = withDifficultyTier([
  { id: 'terms-ox', label: '점·선·면 정오 판별', description: '점·선·면의 성질, 직선/반직선/선분의 표현, 입체도형의 면·꼭짓점·모서리 판별하기', en: ['Points, Lines & Planes (True/False)', 'Check statements about points, lines, planes, and solid shapes'], make: termsOx },
  { id: 'distance-midpoint', label: '두 점 사이의 거리와 중점', description: '중점과 삼등분점을 이용해 선분의 길이 구하기', en: ['Distance & Midpoints', 'Use midpoints and trisection points to find segment lengths'], make: distanceMidpoint },
  { id: 'angle-classify', label: '각의 분류', description: '주어진 각을 예각·직각·둔각·평각으로 분류하기', en: ['Classifying Angles', 'Classify a given angle as acute, right, obtuse, or straight'], make: angleClassify },
  { id: 'straight-angle', label: '평각과 미지각', description: '평각을 이루는 두 각의 관계로 x의 값 구하기', en: ['Straight Angles', 'Use two angles that form a straight angle to find x'], make: straightAngle },
  { id: 'vertical-angle', label: '맞꼭지각', description: '두 직선이 만날 때 생기는 맞꼭지각과 이웃한 각 구하기', en: ['Vertical Angles', 'Find vertical and adjacent angles formed by intersecting lines'], make: verticalAngle },
  { id: 'perpendicular', label: '수직과 수선', description: '수선의 발, 점과 직선 사이의 거리 등 수직 관련 개념 확인하기', en: ['Perpendicular Lines', 'Check concepts like the foot of a perpendicular and point-to-line distance'], make: perpendicular },
  { id: 'basic-figures-mixed', label: '기본 도형 기본 종합', description: '점·선·면부터 맞꼭지각, 수직과 수선까지 골고루 연습하기', en: ['Basic Figures Review', 'Mixed practice covering points, lines, angles, and perpendiculars'], make: (random) => pick(random, generators)(random) },
  ...withCurriculumProfiles(CORE_GEOMETRY_UNITS),
  ...withCurriculumProfiles(MIDDLE_GEOMETRY_BASIC_UNITS),
  ...withCurriculumProfiles(TRIANGLE_QUADRILATERAL_UNITS),
  ...withCurriculumProfiles(TRIANGLE_SIMILARITY_UNITS),
  ...withCurriculumProfiles(CIRCLE_PROPERTIES_UNITS),
  ...withCurriculumProfiles(TRANSFORMATIONS_UNITS),
  ...withCurriculumProfiles(LOGICAL_REASONING_UNITS),
  ...ADVANCED_GEOMETRY_UNITS,
  ...ADVANCED_GEOMETRY_CHALLENGE_UNITS,
  ...RPM_BASIC_FIGURES_APPLIED_UNITS,
  ...RPM_POSITION_RELATIONS_APPLIED_UNITS,
  ...RPM_CONSTRUCTION_CONGRUENCE_APPLIED_UNITS,
  ...RPM_GEO_MOCK_UNITS,
]);

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
