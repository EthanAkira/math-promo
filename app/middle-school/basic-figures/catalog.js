
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
  rpmPolyConceptInteriorExterior,
  rpmPolyDiagonalCountFormula,
  rpmPolyFindPolygonFromDiagonals,
  rpmPolyTriangleAngleSumRatio,
  rpmPolyTriangleExteriorAngleProp,
  rpmPolyBoomerangConcaveAngle,
  rpmPolyIncenterAngleBisector,
  rpmPolyExteriorInteriorBisector,
  rpmPolyInteriorAngleSumFormula,
  rpmPolyExteriorAngleSumConst,
  rpmPolyRegularInteriorExterior,
  rpmPolyRegularRatioAngle,
  rpmPolyRegularDiagonalAngle,
  rpmPolyTwoPolygonsSharedSide,
  rpmPolyStarPolygonAngleSum,
  rpmPolyPaperFoldParallelAngle,
  rpmPolyAllTypesMixed,
  rpmCircleSectorConceptTerms,
  rpmCircleCentralAngleArcProp,
  rpmCircleParallelChordArc,
  rpmCircleCentralAngleAreaProp,
  rpmCircleChordNotProportional,
  rpmCircleCircumferenceAndArea,
  rpmSectorArcLengthAndArea,
  rpmSectorAreaFromArcRadius,
  rpmShadedRegionPerimeter,
  rpmShadedRegionAreaDiff,
  rpmFigureRotationSweptArea,
  rpmTetheredAnimalPastureArea,
  rpmRollingCircleTrackArea,
  rpmCircleSectorAllTypesMixed,
  rpmPlaneFiguresSemesterMockExam,
  rpmPolyhedronConceptClassification,
  rpmPolyhedronPrismPyramidElements,
  rpmPolyhedronIdentifyFromConditions,
  rpmPolyhedronEulerFormula,
  rpmRegularPolyhedraTypesConditions,
  rpmRegularPolyhedraFaceShapes,
  rpmRegularPolyhedraElementsCount,
  rpmCubeNetOppositeFaces,
  rpmPolyhedronCrossSectionShapes,
  rpmDualPolyhedraConnections,
  rpmSolidsOfRevolutionTypes,
  rpmPlanarFigureToRevolutionSolid,
  rpmRevolutionCrossSectionProperty,
  rpmRevolutionCrossSectionAreaCalc,
  rpmConeNetSectorCentralAngle,
  rpmRevolutionSolidsAdvancedProperties,
  rpmPolyhedronRevolutionAllMixed,
  rpmPrismSurfaceAreaCalc,
  rpmCylinderSurfaceAreaCalc,
  rpmPrismCylinderVolumeCalc,
  rpmHollowPrismSurfaceVolume,
  rpmPyramidSurfaceAreaVolume,
  rpmConeSurfaceAreaCalc,
  rpmConeVolumeCalc,
  rpmTruncatedCornerPyramidVolume,
  rpmFrustumSurfaceAreaVolume,
  rpmRevolutionSolidSurfaceVolume,
  rpmSphereSurfaceAreaCalc,
  rpmSphereVolumeCalc,
  rpmTruncatedSpherePartSurfaceVolume,
  rpmConeSphereCylinderRatio,
  rpmContainerWaterLevelVolume,
  rpmSolidSurfaceShortestPath,
  rpmSolidsSurfaceVolumeAllMixed,
  rpmSolidFiguresSemesterMockExam,
  rpmDataStemAndLeafPlot,
  rpmDataTornStemLeafPlot,
  rpmDataFrequencyTableBasicTerms,
  rpmDataFrequencyTableMissingFreq,
  rpmDataHistogramRectangleArea,
  rpmDataTornHistogram,
  rpmDataFrequencyPolygonStructure,
  rpmDataFrequencyPolygonArea,
  rpmDataTornFrequencyPolygon,
  rpmDataTwoGroupsPolygonCompare,
  rpmDataRelativeFrequencyConcept,
  rpmDataRelativeFrequencyTableCalc,
  rpmDataTornRelativeFrequencyTable,
  rpmDataTwoGroupsRelativeFreqRatio,
  rpmDataRelativeFrequencyGraphArea,
  rpmDataTwoGroupsRelativeFreqCompare,
  rpmDataStatisticsAllMixed,
  rpmGrade7SemesterTwoFinalExam,
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
  // 유형별 실전 응용
  'applied-geo-basic-intersections': ['kr-middle-1', 'pre-algebra'],
  'applied-geo-basic-line-rays': ['kr-middle-1', 'pre-algebra'],
  'applied-geo-basic-points-lines': ['kr-middle-1', 'pre-algebra'],
  'applied-geo-basic-midpoint-seg': ['kr-middle-1', 'pre-algebra'],
  'applied-geo-basic-angle-classify': ['kr-middle-1', 'pre-algebra'],
  'applied-geo-basic-straight-angle-eq': ['kr-middle-1', 'pre-algebra'],
  'applied-geo-basic-angle-ratio': ['kr-middle-1', 'pre-algebra'],
  'applied-geo-basic-angle-multiple': ['kr-middle-1', 'pre-algebra'],
  'applied-geo-basic-vertical-angles': ['kr-middle-1', 'pre-algebra'],
  'applied-geo-basic-vertical-pairs': ['kr-middle-1', 'pre-algebra'],
  'applied-geo-basic-perp-distance': ['kr-middle-1', 'pre-algebra'],
  'applied-geo-basic-vertical-multi': ['kr-middle-1', 'pre-algebra'],
  'applied-geo-basic-clock-angle': ['kr-middle-1', 'pre-algebra'],
  'applied-geo-basic-all-mixed': ['kr-middle-1', 'pre-algebra'],

  // 유형별 실전 응용
  'applied-pos-point-line-plane': ['kr-middle-1', 'pre-algebra'],
  'applied-pos-plane-two-lines': ['kr-middle-1', 'pre-algebra'],
  'applied-pos-solid-skew-edges': ['kr-middle-1', 'pre-algebra'],
  'applied-pos-solid-edge-plane': ['kr-middle-1', 'pre-algebra'],
  'applied-pos-solid-net-relations': ['kr-middle-1', 'pre-algebra'],
  'applied-pos-corresponding-alternate': ['kr-middle-1', 'pre-algebra'],
  'applied-pos-parallel-angle-solve': ['kr-middle-1', 'pre-algebra'],
  'applied-pos-parallel-condition': ['kr-middle-1', 'pre-algebra'],
  'applied-pos-parallel-bent-single': ['kr-middle-1', 'pre-algebra'],
  'applied-pos-parallel-bent-multi': ['kr-middle-1', 'pre-algebra'],
  'applied-pos-parallel-with-polygon': ['kr-middle-1', 'pre-algebra'],
  'applied-pos-parallel-angle-bisector': ['kr-middle-1', 'pre-algebra'],
  'applied-pos-paper-fold-angles': ['kr-middle-1', 'pre-algebra'],
  'applied-pos-parallel-two-pairs': ['kr-middle-1', 'pre-algebra'],
  'applied-pos-space-logic': ['kr-middle-1', 'pre-algebra'],
  'applied-pos-all-mixed': ['kr-middle-1', 'pre-algebra'],

  // 유형별 실전 응용
  'applied-cong-construct-segment': ['kr-middle-1', 'pre-algebra'],
  'applied-cong-construct-angle-parallel': ['kr-middle-1', 'pre-algebra'],
  'applied-cong-triangle-opposite': ['kr-middle-1', 'pre-algebra'],
  'applied-cong-triangle-inequality': ['kr-middle-1', 'pre-algebra'],
  'applied-cong-triangle-param-range': ['kr-middle-1', 'pre-algebra'],
  'applied-cong-triangle-determined-cond': ['kr-middle-1', 'pre-algebra'],
  'applied-cong-figure-congruence-props': ['kr-middle-1', 'pre-algebra'],
  'applied-cong-triangle-sss-sas-asa': ['kr-middle-1', 'pre-algebra'],
  'applied-cong-triangle-add-condition': ['kr-middle-1', 'pre-algebra'],
  'applied-cong-rotation-equilateral-square': ['kr-middle-1', 'pre-algebra'],
  'applied-cong-right-isosceles-altitude': ['kr-middle-1', 'pre-algebra'],
  'applied-cong-square-overlap-area': ['kr-middle-1', 'pre-algebra'],
  'applied-cong-all-mixed': ['kr-middle-1', 'pre-algebra'],

  // 중학 1-2 기하 실전 모의고사
  'applied-geo-semester-one-mock-exam': ['kr-middle-1', 'pre-algebra'],

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

  // 유형별 실전 응용
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
  // 유형별 실전 응용
  'applied-poly-concept-interior-exterior': ['kr-middle-1', 'pre-algebra'],
  'applied-poly-diagonal-count-formula': ['kr-middle-1', 'pre-algebra'],
  'applied-poly-find-polygon-from-diagonals': ['kr-middle-1', 'pre-algebra'],
  'applied-poly-triangle-angle-sum-ratio': ['kr-middle-1', 'pre-algebra'],
  'applied-poly-triangle-exterior-angle-prop': ['kr-middle-1', 'pre-algebra'],
  'applied-poly-boomerang-concave-angle': ['kr-middle-1', 'pre-algebra'],
  'applied-poly-incenter-angle-bisector': ['kr-middle-1', 'pre-algebra'],
  'applied-poly-exterior-interior-bisector': ['kr-middle-1', 'pre-algebra'],
  'applied-poly-interior-angle-sum-formula': ['kr-middle-1', 'pre-algebra'],
  'applied-poly-exterior-angle-sum-const': ['kr-middle-1', 'pre-algebra'],
  'applied-poly-regular-interior-exterior': ['kr-middle-1', 'pre-algebra'],
  'applied-poly-regular-ratio-angle': ['kr-middle-1', 'pre-algebra'],
  'applied-poly-regular-diagonal-angle': ['kr-middle-1', 'pre-algebra'],
  'applied-poly-two-polygons-shared-side': ['kr-middle-1', 'pre-algebra'],
  'applied-poly-star-polygon-angle-sum': ['kr-middle-1', 'pre-algebra'],
  'applied-poly-paper-fold-parallel-angle': ['kr-middle-1', 'pre-algebra'],
  'applied-poly-all-mixed': ['kr-middle-1', 'pre-algebra'],

  // 유형별 실전 응용
  'applied-circle-sector-concept-terms': ['kr-middle-1', 'pre-algebra'],
  'applied-circle-central-angle-arc-prop': ['kr-middle-1', 'pre-algebra'],
  'applied-circle-parallel-chord-arc': ['kr-middle-1', 'pre-algebra'],
  'applied-circle-central-angle-area-prop': ['kr-middle-1', 'pre-algebra'],
  'applied-circle-chord-not-proportional': ['kr-middle-1', 'pre-algebra'],
  'applied-circle-circumference-and-area': ['kr-middle-1', 'pre-algebra'],
  'applied-sector-arc-length-and-area': ['kr-middle-1', 'pre-algebra'],
  'applied-sector-area-from-arc-radius': ['kr-middle-1', 'pre-algebra'],
  'applied-shaded-region-perimeter': ['kr-middle-1', 'pre-algebra'],
  'applied-shaded-region-area-diff': ['kr-middle-1', 'pre-algebra'],
  'applied-figure-rotation-swept-area': ['kr-middle-1', 'pre-algebra'],
  'applied-tethered-animal-pasture-area': ['kr-middle-1', 'pre-algebra'],
  'applied-rolling-circle-track-area': ['kr-middle-1', 'pre-algebra'],
  'applied-circle-sector-all-mixed': ['kr-middle-1', 'pre-algebra'],
  'applied-plane-figures-semester-mock-exam': ['kr-middle-1', 'pre-algebra'],

  // 유형별 실전 응용
  'applied-polyhedra-concept-classification': ['kr-middle-1', 'pre-algebra'],
  'applied-polyhedra-prism-pyramid-elements': ['kr-middle-1', 'pre-algebra'],
  'applied-polyhedra-identify-from-conditions': ['kr-middle-1', 'pre-algebra'],
  'applied-polyhedra-euler-formula': ['kr-middle-1', 'pre-algebra'],
  'applied-polyhedra-regular-types-conditions': ['kr-middle-1', 'pre-algebra'],
  'applied-polyhedra-regular-face-shapes': ['kr-middle-1', 'pre-algebra'],
  'applied-polyhedra-regular-elements-count': ['kr-middle-1', 'pre-algebra'],
  'applied-polyhedra-cube-net-opposite-faces': ['kr-middle-1', 'pre-algebra'],
  'applied-polyhedra-cross-section-shapes': ['kr-middle-1', 'pre-algebra'],
  'applied-polyhedra-dual-connections': ['kr-middle-1', 'pre-algebra'],
  'applied-revolution-solids-types': ['kr-middle-1', 'pre-algebra'],
  'applied-revolution-planar-to-solid': ['kr-middle-1', 'pre-algebra'],
  'applied-revolution-cross-section-property': ['kr-middle-1', 'pre-algebra'],
  'applied-revolution-cross-section-area-calc': ['kr-middle-1', 'pre-algebra'],
  'applied-revolution-cone-net-central-angle': ['kr-middle-1', 'pre-algebra'],
  'applied-revolution-advanced-properties': ['kr-middle-1', 'pre-algebra'],
  'applied-polyhedra-revolution-all-mixed': ['kr-middle-1', 'pre-algebra'],

  // 유형별 실전 응용
  'applied-solids-prism-surface-area': ['kr-middle-1', 'pre-algebra'],
  'applied-solids-cylinder-surface-area': ['kr-middle-1', 'pre-algebra'],
  'applied-solids-prism-cylinder-volume': ['kr-middle-1', 'pre-algebra'],
  'applied-solids-hollow-prism-surface-volume': ['kr-middle-1', 'pre-algebra'],
  'applied-solids-pyramid-surface-volume': ['kr-middle-1', 'pre-algebra'],
  'applied-solids-cone-surface-area': ['kr-middle-1', 'pre-algebra'],
  'applied-solids-cone-volume': ['kr-middle-1', 'pre-algebra'],
  'applied-solids-truncated-corner-pyramid': ['kr-middle-1', 'pre-algebra'],
  'applied-solids-frustum-surface-volume': ['kr-middle-1', 'pre-algebra'],
  'applied-solids-revolution-surface-volume': ['kr-middle-1', 'pre-algebra'],
  'applied-solids-sphere-surface-area': ['kr-middle-1', 'pre-algebra'],
  'applied-solids-sphere-volume': ['kr-middle-1', 'pre-algebra'],
  'applied-solids-truncated-sphere-part': ['kr-middle-1', 'pre-algebra'],
  'applied-solids-cone-sphere-cylinder-ratio': ['kr-middle-1', 'pre-algebra'],
  'applied-solids-container-water-level': ['kr-middle-1', 'pre-algebra'],
  'applied-solids-surface-shortest-path': ['kr-middle-1', 'pre-algebra'],
  'applied-solids-surface-volume-all-mixed': ['kr-middle-1', 'pre-algebra'],
  'applied-solid-figures-semester-mock-exam': ['kr-middle-1', 'pre-algebra'],

  // 유형별 실전 응용
  'applied-data-stem-and-leaf-plot': ['kr-middle-1', 'pre-algebra'],
  'applied-data-torn-stem-leaf-plot': ['kr-middle-1', 'pre-algebra'],
  'applied-data-frequency-table-basic-terms': ['kr-middle-1', 'pre-algebra'],
  'applied-data-frequency-table-missing-freq': ['kr-middle-1', 'pre-algebra'],
  'applied-data-histogram-rectangle-area': ['kr-middle-1', 'pre-algebra'],
  'applied-data-torn-histogram': ['kr-middle-1', 'pre-algebra'],
  'applied-data-frequency-polygon-structure': ['kr-middle-1', 'pre-algebra'],
  'applied-data-frequency-polygon-area': ['kr-middle-1', 'pre-algebra'],
  'applied-data-torn-frequency-polygon': ['kr-middle-1', 'pre-algebra'],
  'applied-data-two-groups-polygon-compare': ['kr-middle-1', 'pre-algebra'],
  'applied-data-relative-frequency-concept': ['kr-middle-1', 'pre-algebra'],
  'applied-data-relative-frequency-table-calc': ['kr-middle-1', 'pre-algebra'],
  'applied-data-torn-relative-frequency-table': ['kr-middle-1', 'pre-algebra'],
  'applied-data-two-groups-relative-freq-ratio': ['kr-middle-1', 'pre-algebra'],
  'applied-data-relative-frequency-graph-area': ['kr-middle-1', 'pre-algebra'],
  'applied-data-two-groups-relative-freq-compare': ['kr-middle-1', 'pre-algebra'],
  'applied-data-statistics-all-mixed': ['kr-middle-1', 'pre-algebra'],

  // 유형별 실전 응용
  'applied-grade7-semester-two-final-exam': ['kr-middle-1', 'pre-algebra'],
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
  'applied-geo-basic-intersections': { tier: 'basic', category: 'applied-basic-figures-applied' },
  'applied-geo-basic-line-rays': { tier: 'basic', category: 'applied-basic-figures-applied' },
  'applied-geo-basic-points-lines': { tier: 'intermediate', category: 'applied-basic-figures-applied' },
  'applied-geo-basic-midpoint-seg': { tier: 'intermediate', category: 'applied-basic-figures-applied' },
  'applied-geo-basic-angle-classify': { tier: 'basic', category: 'applied-basic-figures-applied' },
  'applied-geo-basic-straight-angle-eq': { tier: 'intermediate', category: 'applied-basic-figures-applied' },
  'applied-geo-basic-angle-ratio': { tier: 'intermediate', category: 'applied-basic-figures-applied' },
  'applied-geo-basic-angle-multiple': { tier: 'intermediate', category: 'applied-basic-figures-applied' },
  'applied-geo-basic-vertical-angles': { tier: 'intermediate', category: 'applied-basic-figures-applied' },
  'applied-geo-basic-vertical-pairs': { tier: 'intermediate', category: 'applied-basic-figures-applied' },
  'applied-geo-basic-perp-distance': { tier: 'basic', category: 'applied-basic-figures-applied' },
  'applied-geo-basic-vertical-multi': { tier: 'advanced', category: 'applied-basic-figures-applied' },
  'applied-geo-basic-clock-angle': { tier: 'advanced', category: 'applied-basic-figures-applied' },
  'applied-geo-basic-all-mixed': { tier: 'intermediate', category: 'applied-basic-figures-applied' },

  // 02 위치 관계 세부 응용 유형
  'applied-pos-point-line-plane': { tier: 'basic', category: 'applied-position-relations-applied' },
  'applied-pos-plane-two-lines': { tier: 'basic', category: 'applied-position-relations-applied' },
  'applied-pos-solid-skew-edges': { tier: 'intermediate', category: 'applied-position-relations-applied' },
  'applied-pos-solid-edge-plane': { tier: 'intermediate', category: 'applied-position-relations-applied' },
  'applied-pos-solid-net-relations': { tier: 'advanced', category: 'applied-position-relations-applied' },
  'applied-pos-corresponding-alternate': { tier: 'basic', category: 'applied-position-relations-applied' },
  'applied-pos-parallel-angle-solve': { tier: 'intermediate', category: 'applied-position-relations-applied' },
  'applied-pos-parallel-condition': { tier: 'intermediate', category: 'applied-position-relations-applied' },
  'applied-pos-parallel-bent-single': { tier: 'intermediate', category: 'applied-position-relations-applied' },
  'applied-pos-parallel-bent-multi': { tier: 'intermediate', category: 'applied-position-relations-applied' },
  'applied-pos-parallel-with-polygon': { tier: 'advanced', category: 'applied-position-relations-applied' },
  'applied-pos-parallel-angle-bisector': { tier: 'advanced', category: 'applied-position-relations-applied' },
  'applied-pos-paper-fold-angles': { tier: 'advanced', category: 'applied-position-relations-applied' },
  'applied-pos-parallel-two-pairs': { tier: 'intermediate', category: 'applied-position-relations-applied' },
  'applied-pos-space-logic': { tier: 'advanced', category: 'applied-position-relations-applied' },
  'applied-pos-all-mixed': { tier: 'intermediate', category: 'applied-position-relations-applied' },

  // 03 작도와 합동 세부 응용 유형
  'applied-cong-construct-segment': { tier: 'basic', category: 'applied-construction-congruence-applied' },
  'applied-cong-construct-angle-parallel': { tier: 'intermediate', category: 'applied-construction-congruence-applied' },
  'applied-cong-triangle-opposite': { tier: 'basic', category: 'applied-construction-congruence-applied' },
  'applied-cong-triangle-inequality': { tier: 'intermediate', category: 'applied-construction-congruence-applied' },
  'applied-cong-triangle-param-range': { tier: 'intermediate', category: 'applied-construction-congruence-applied' },
  'applied-cong-triangle-determined-cond': { tier: 'intermediate', category: 'applied-construction-congruence-applied' },
  'applied-cong-figure-congruence-props': { tier: 'basic', category: 'applied-construction-congruence-applied' },
  'applied-cong-triangle-sss-sas-asa': { tier: 'intermediate', category: 'applied-construction-congruence-applied' },
  'applied-cong-triangle-add-condition': { tier: 'intermediate', category: 'applied-construction-congruence-applied' },
  'applied-cong-rotation-equilateral-square': { tier: 'advanced', category: 'applied-construction-congruence-applied' },
  'applied-cong-right-isosceles-altitude': { tier: 'advanced', category: 'applied-construction-congruence-applied' },
  'applied-cong-square-overlap-area': { tier: 'advanced', category: 'applied-construction-congruence-applied' },
  'applied-cong-all-mixed': { tier: 'intermediate', category: 'applied-construction-congruence-applied' },

  // 1학기 총괄 모의고사
  'applied-geo-semester-one-mock-exam': { tier: 'advanced', category: 'applied-geo-mock' },
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
  // -------------------------------------------------------------
  // 유형별 실전 응용
  // -------------------------------------------------------------
  'applied-poly-concept-interior-exterior': { tier: 'basic', category: 'applied-polygons-applied' },
  'applied-poly-diagonal-count-formula': { tier: 'basic', category: 'applied-polygons-applied' },
  'applied-poly-find-polygon-from-diagonals': { tier: 'intermediate', category: 'applied-polygons-applied' },
  'applied-poly-triangle-angle-sum-ratio': { tier: 'basic', category: 'applied-polygons-applied' },
  'applied-poly-triangle-exterior-angle-prop': { tier: 'basic', category: 'applied-polygons-applied' },
  'applied-poly-boomerang-concave-angle': { tier: 'intermediate', category: 'applied-polygons-applied' },
  'applied-poly-incenter-angle-bisector': { tier: 'intermediate', category: 'applied-polygons-applied' },
  'applied-poly-exterior-interior-bisector': { tier: 'intermediate', category: 'applied-polygons-applied' },
  'applied-poly-interior-angle-sum-formula': { tier: 'basic', category: 'applied-polygons-applied' },
  'applied-poly-exterior-angle-sum-const': { tier: 'basic', category: 'applied-polygons-applied' },
  'applied-poly-regular-interior-exterior': { tier: 'basic', category: 'applied-polygons-applied' },
  'applied-poly-regular-ratio-angle': { tier: 'intermediate', category: 'applied-polygons-applied' },
  'applied-poly-regular-diagonal-angle': { tier: 'intermediate', category: 'applied-polygons-applied' },
  'applied-poly-two-polygons-shared-side': { tier: 'intermediate', category: 'applied-polygons-applied' },
  'applied-poly-star-polygon-angle-sum': { tier: 'intermediate', category: 'applied-polygons-applied' },
  'applied-poly-paper-fold-parallel-angle': { tier: 'intermediate', category: 'applied-polygons-applied' },
  'applied-poly-all-mixed': { tier: 'advanced', category: 'applied-polygons-applied' },

  // -------------------------------------------------------------
  // 유형별 실전 응용
  // -------------------------------------------------------------
  'applied-circle-sector-concept-terms': { tier: 'basic', category: 'applied-circles-sectors-applied' },
  'applied-circle-central-angle-arc-prop': { tier: 'basic', category: 'applied-circles-sectors-applied' },
  'applied-circle-parallel-chord-arc': { tier: 'intermediate', category: 'applied-circles-sectors-applied' },
  'applied-circle-central-angle-area-prop': { tier: 'basic', category: 'applied-circles-sectors-applied' },
  'applied-circle-chord-not-proportional': { tier: 'basic', category: 'applied-circles-sectors-applied' },
  'applied-circle-circumference-and-area': { tier: 'basic', category: 'applied-circles-sectors-applied' },
  'applied-sector-arc-length-and-area': { tier: 'basic', category: 'applied-circles-sectors-applied' },
  'applied-sector-area-from-arc-radius': { tier: 'intermediate', category: 'applied-circles-sectors-applied' },
  'applied-shaded-region-perimeter': { tier: 'intermediate', category: 'applied-circles-sectors-applied' },
  'applied-shaded-region-area-diff': { tier: 'intermediate', category: 'applied-circles-sectors-applied' },
  'applied-figure-rotation-swept-area': { tier: 'advanced', category: 'applied-circles-sectors-applied' },
  'applied-tethered-animal-pasture-area': { tier: 'advanced', category: 'applied-circles-sectors-applied' },
  'applied-rolling-circle-track-area': { tier: 'advanced', category: 'applied-circles-sectors-applied' },
  'applied-circle-sector-all-mixed': { tier: 'advanced', category: 'applied-circles-sectors-applied' },

  // 평면도형 총괄평가 모의고사
  'applied-plane-figures-semester-mock-exam': { tier: 'advanced', category: 'applied-plane-mock' },

  // -------------------------------------------------------------
  // 유형별 실전 응용
  // -------------------------------------------------------------
  'applied-polyhedra-concept-classification': { tier: 'basic', category: 'applied-polyhedra-revolution-applied' },
  'applied-polyhedra-prism-pyramid-elements': { tier: 'basic', category: 'applied-polyhedra-revolution-applied' },
  'applied-polyhedra-identify-from-conditions': { tier: 'intermediate', category: 'applied-polyhedra-revolution-applied' },
  'applied-polyhedra-euler-formula': { tier: 'basic', category: 'applied-polyhedra-revolution-applied' },
  'applied-polyhedra-regular-types-conditions': { tier: 'basic', category: 'applied-polyhedra-revolution-applied' },
  'applied-polyhedra-regular-face-shapes': { tier: 'basic', category: 'applied-polyhedra-revolution-applied' },
  'applied-polyhedra-regular-elements-count': { tier: 'basic', category: 'applied-polyhedra-revolution-applied' },
  'applied-polyhedra-cube-net-opposite-faces': { tier: 'intermediate', category: 'applied-polyhedra-revolution-applied' },
  'applied-polyhedra-cross-section-shapes': { tier: 'intermediate', category: 'applied-polyhedra-revolution-applied' },
  'applied-polyhedra-dual-connections': { tier: 'intermediate', category: 'applied-polyhedra-revolution-applied' },
  'applied-revolution-solids-types': { tier: 'basic', category: 'applied-polyhedra-revolution-applied' },
  'applied-revolution-planar-to-solid': { tier: 'basic', category: 'applied-polyhedra-revolution-applied' },
  'applied-revolution-cross-section-property': { tier: 'intermediate', category: 'applied-polyhedra-revolution-applied' },
  'applied-revolution-cross-section-area-calc': { tier: 'intermediate', category: 'applied-polyhedra-revolution-applied' },
  'applied-revolution-cone-net-central-angle': { tier: 'intermediate', category: 'applied-polyhedra-revolution-applied' },
  'applied-revolution-advanced-properties': { tier: 'advanced', category: 'applied-polyhedra-revolution-applied' },
  'applied-polyhedra-revolution-all-mixed': { tier: 'advanced', category: 'applied-polyhedra-revolution-applied' },

  // -------------------------------------------------------------
  // 유형별 실전 응용
  // -------------------------------------------------------------
  'applied-solids-prism-surface-area': { tier: 'basic', category: 'applied-solids-measures-applied' },
  'applied-solids-cylinder-surface-area': { tier: 'basic', category: 'applied-solids-measures-applied' },
  'applied-solids-prism-cylinder-volume': { tier: 'basic', category: 'applied-solids-measures-applied' },
  'applied-solids-hollow-prism-surface-volume': { tier: 'intermediate', category: 'applied-solids-measures-applied' },
  'applied-solids-pyramid-surface-volume': { tier: 'intermediate', category: 'applied-solids-measures-applied' },
  'applied-solids-cone-surface-area': { tier: 'basic', category: 'applied-solids-measures-applied' },
  'applied-solids-cone-volume': { tier: 'basic', category: 'applied-solids-measures-applied' },
  'applied-solids-truncated-corner-pyramid': { tier: 'intermediate', category: 'applied-solids-measures-applied' },
  'applied-solids-frustum-surface-volume': { tier: 'intermediate', category: 'applied-solids-measures-applied' },
  'applied-solids-revolution-surface-volume': { tier: 'intermediate', category: 'applied-solids-measures-applied' },
  'applied-solids-sphere-surface-area': { tier: 'basic', category: 'applied-solids-measures-applied' },
  'applied-solids-sphere-volume': { tier: 'basic', category: 'applied-solids-measures-applied' },
  'applied-solids-truncated-sphere-part': { tier: 'intermediate', category: 'applied-solids-measures-applied' },
  'applied-solids-cone-sphere-cylinder-ratio': { tier: 'intermediate', category: 'applied-solids-measures-applied' },
  'applied-solids-container-water-level': { tier: 'advanced', category: 'applied-solids-measures-applied' },
  'applied-solids-surface-shortest-path': { tier: 'advanced', category: 'applied-solids-measures-applied' },
  'applied-solids-surface-volume-all-mixed': { tier: 'advanced', category: 'applied-solids-measures-applied' },

  // 입체도형 총괄평가 모의고사
  'applied-solid-figures-semester-mock-exam': { tier: 'advanced', category: 'applied-solid-mock' },

  // -------------------------------------------------------------
  // 유형별 실전 응용
  // -------------------------------------------------------------
  'applied-data-stem-and-leaf-plot': { tier: 'basic', category: 'applied-data-stats-applied' },
  'applied-data-torn-stem-leaf-plot': { tier: 'intermediate', category: 'applied-data-stats-applied' },
  'applied-data-frequency-table-basic-terms': { tier: 'basic', category: 'applied-data-stats-applied' },
  'applied-data-frequency-table-missing-freq': { tier: 'intermediate', category: 'applied-data-stats-applied' },
  'applied-data-histogram-rectangle-area': { tier: 'intermediate', category: 'applied-data-stats-applied' },
  'applied-data-torn-histogram': { tier: 'intermediate', category: 'applied-data-stats-applied' },
  'applied-data-frequency-polygon-structure': { tier: 'basic', category: 'applied-data-stats-applied' },
  'applied-data-frequency-polygon-area': { tier: 'intermediate', category: 'applied-data-stats-applied' },
  'applied-data-torn-frequency-polygon': { tier: 'intermediate', category: 'applied-data-stats-applied' },
  'applied-data-two-groups-polygon-compare': { tier: 'intermediate', category: 'applied-data-stats-applied' },
  'applied-data-relative-frequency-concept': { tier: 'basic', category: 'applied-data-stats-applied' },
  'applied-data-relative-frequency-table-calc': { tier: 'intermediate', category: 'applied-data-stats-applied' },
  'applied-data-torn-relative-frequency-table': { tier: 'intermediate', category: 'applied-data-stats-applied' },
  'applied-data-two-groups-relative-freq-ratio': { tier: 'advanced', category: 'applied-data-stats-applied' },
  'applied-data-relative-frequency-graph-area': { tier: 'intermediate', category: 'applied-data-stats-applied' },
  'applied-data-two-groups-relative-freq-compare': { tier: 'advanced', category: 'applied-data-stats-applied' },
  'applied-data-statistics-all-mixed': { tier: 'advanced', category: 'applied-data-stats-applied' },

  // -------------------------------------------------------------
  // 유형별 실전 응용
  // -------------------------------------------------------------
  'applied-grade7-semester-two-final-exam': { tier: 'advanced', category: 'applied-grade7-final-mock' },
};

export const UNIT_CATEGORY_LABELS = {
  'applied-basic-figures-applied': { label: '[세부응용] 01 기본도형', labelEn: '[Applied] 01 Basic Figures' },
  'applied-position-relations-applied': { label: '[세부응용] 02 위치 관계', labelEn: '[Applied] 02 Position Relations' },
  'applied-construction-congruence-applied': { label: '[세부응용] 03 작도와 합동', labelEn: '[Applied] 03 Constructions & Congruence' },
  'applied-geo-mock': { label: '[총괄평가] 중학 1-2 기하 실전 모의고사', labelEn: '[Mock Exam] Grade 7-2 Geometry Comprehensive' },
  'applied-polygons-applied': { label: '[세부응용] 04 다각형', labelEn: '[Applied] 04 Polygons' },
  'applied-circles-sectors-applied': { label: '[세부응용] 05 원과 부채꼴', labelEn: '[Applied] 05 Circles & Sectors' },
  'applied-plane-mock': { label: '[총괄평가] 중학 1-2 평면도형 종합 모의고사', labelEn: '[Mock Exam] Grade 7-2 Plane Figures Comprehensive' },
  'applied-polyhedra-revolution-applied': { label: '[세부응용] 06 다면체와 회전체', labelEn: '[Applied] 06 Polyhedra & Revolution' },
  'applied-solids-measures-applied': { label: '[세부응용] 07 입체도형의 겉넓이와 부피', labelEn: '[Applied] 07 Solids Surface & Volume' },
  'applied-solid-mock': { label: '[총괄평가] 중학 1-2 입체도형 종합 모의고사', labelEn: '[Mock Exam] Grade 7-2 Solid Figures Comprehensive' },
  'applied-data-stats-applied': { label: '[세부응용] 08 자료의 정리와 해석', labelEn: '[Applied] 08 Data & Statistics' },
  'applied-grade7-final-mock': { label: '[최종총괄] 중학 1-2 전 범위 최종 실전 모의고사', labelEn: '[Final Exam] Grade 7-2 Comprehensive' },



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
// 유형별 실전 응용
// -------------------------------------------------------------
export const RPM_BASIC_FIGURES_APPLIED_UNITS = [
  { id: 'applied-geo-basic-intersections', label: '[기본도형 유형 01] 입체도형에서의 교점과 교선의 개수', description: '삼각뿔, 사각뿔, 기둥 등 입체도형의 꼭짓점(교점)과 모서리(교선) 개수 및 2a+b 식 계산', en: ['Geometry Type 01: Vertices and Edges in Solids', 'Count intersection points (vertices) and lines (edges) in polyhedra'], make: rpmGeoBasicIntersections },
  { id: 'applied-geo-basic-line-rays', label: '[기본도형 유형 02] 직선, 반직선, 선분의 구별과 일치 판별', description: '시작점과 뻗어나가는 방향에 따른 직선/반직선/선분의 일치 및 참/거짓 판별', en: ['Geometry Type 02: Lines, Rays, and Segments', 'Determine equivalence and truth of lines, rays, and line segments'], make: rpmGeoBasicLineRays },
  { id: 'applied-geo-basic-points-lines', label: '[기본도형 유형 03] 점의 개수와 직선, 반직선, 선분의 개수', description: '원 위 또는 직선과 외부의 점들 중 두 점을 골라 만들 수 있는 직선/반직선/선분 개수', en: ['Geometry Type 03: Lines & Rays from Given Points', 'Calculate number of distinct lines and rays through combinations of points'], make: rpmGeoBasicPointsToLines },
  { id: 'applied-geo-basic-midpoint-seg', label: '[기본도형 유형 04] 선분의 중점과 배수 관계를 이용한 선분의 길이', description: '중점 M, N과 배수 관계(AB=3BC 등)를 이용하여 전체 및 특정 선분의 길이 계산', en: ['Geometry Type 04: Segment Midpoints & Ratios', 'Calculate segment lengths using midpoints and linear ratio conditions'], make: rpmGeoBasicMidpointSegment },
  { id: 'applied-geo-basic-angle-classify', label: '[기본도형 유형 05] 각의 분류와 예각·직각·둔각·평각 판별', description: '주어진 여러 각들 중 예각, 직각, 둔각, 평각의 개수를 세고 합과 차 구하기', en: ['Geometry Type 05: Classifying Angle Types', 'Identify and count acute, right, obtuse, and straight angles'], make: rpmGeoBasicAngleClassify },
  { id: 'applied-geo-basic-straight-angle-eq', label: '[기본도형 유형 06] 평각(180°)을 이용한 미지각 일차방정식', description: '일직선 위의 두 각이나 세 각의 합이 180°임을 이용하여 미지수 x 및 각의 크기 구하기', en: ['Geometry Type 06: Straight Angle Linear Equations', 'Solve for x and angle measures using straight angle sum of 180°'], make: rpmGeoBasicStraightAngleEq },
  { id: 'applied-geo-basic-angle-ratio', label: '[기본도형 유형 07] 각의 비례배분과 미지각의 크기', description: '평각(180°) 또는 직각(90°)에서 각의 비가 주어졌을 때 비례배분으로 각도 구하기', en: ['Geometry Type 07: Proportional Division of Angles', 'Divide straight and right angles proportionally using given angle ratios'], make: rpmGeoBasicAngleRatio },
  { id: 'applied-geo-basic-angle-multiple', label: '[기본도형 유형 08] 각의 배수 조건과 수직선이 주어진 각도 계산', description: '수직(90°) 및 각의 배수 조건(∠AOB=k∠BOC 등)이 결합된 복합 각도 계산', en: ['Geometry Type 08: Angle Multiple & Perpendicular Conditions', 'Evaluate angles with multiple-ratio conditions and perpendicular lines'], make: rpmGeoBasicAngleMultipleCond },
  { id: 'applied-geo-basic-vertical-angles', label: '[기본도형 유형 09] 맞꼭지각의 성질과 미지수 계산', description: '두 직선이 만날 때 생기는 맞꼭지각의 크기가 같음을 이용하여 x 및 이웃한 각 구하기', en: ['Geometry Type 09: Vertical Angle Equations', 'Solve equations using equality of vertical opposite angles'], make: rpmGeoBasicVerticalAngles },
  { id: 'applied-geo-basic-vertical-pairs', label: '[기본도형 유형 10] 한 점에서 만나는 n개 직선의 맞꼭지각의 쌍의 개수', description: '한 점에서 만나는 n개의 직선에서 생기는 맞꼭지각의 총 쌍의 수 n(n-1) 구하기', en: ['Geometry Type 10: Counting Vertical Angle Pairs', 'Compute total number of vertical angle pairs n(n-1) formed by n lines'], make: rpmGeoBasicVerticalAnglePairs },
  { id: 'applied-geo-basic-perp-distance', label: '[기본도형 유형 11] 수직과 수선, 점과 직선 사이의 거리', description: '수선의 발의 정의와 직사각형 등 도형에서 한 점과 변 사이의 거리 계산', en: ['Geometry Type 11: Perpendiculars & Point-to-Line Distance', 'Understand perpendicular foot and evaluate distances from point to line'], make: rpmGeoBasicPerpendicularDist },
  { id: 'applied-geo-basic-vertical-multi', label: '[기본도형 유형 12] 복합 교차 직선에서의 맞꼭지각과 평각 계산', description: '세 직선 이상이 한 점에서 교차할 때 각의 비와 맞꼭지각을 융합한 심화 각도 계산', en: ['Geometry Type 12: Multi-line Vertical & Straight Angle System', 'Solve advanced angle systems with multiple intersecting lines and ratios'], make: rpmGeoBasicVerticalMultiLines },
  { id: 'applied-geo-basic-clock-angle', label: '[기본도형 유형 13] 시계의 시침과 분침이 이루는 각의 크기', description: '시침(0.5°/분)과 분침(6°/분)의 이동 속력을 이용하여 h시 m분의 작은 쪽 각도 구하기', en: ['Geometry Type 13: Angles Formed by Clock Hands', 'Calculate smaller angle between hour and minute hands at given times'], make: rpmGeoBasicClockAngle },
  { id: 'applied-geo-basic-all-mixed', label: '[단원 실전 다지기] 매일 01 기본도형 종합', description: '교점·교선, 직선·선분, 평각·맞꼭지각, 시계 각도 등 기본도형 전 유형 종합 출제', en: ['Daily 01 Basic Figures Comprehensive', 'Comprehensive mixed practice across all basic figures problem types'], make: rpmGeoBasicAllTypesMixed },
];

export const RPM_POSITION_RELATIONS_APPLIED_UNITS = [
  { id: 'applied-pos-point-line-plane', label: '[위치관계 유형 01] 점과 직선, 점과 평면의 위치 관계', description: '점이 직선이나 평면 위에 있다/있지 않다의 정의와 포함 관계 판별', en: ['Position Type 01: Points, Lines & Planes Incidence', 'Determine incidence relations of points on lines and planes'], make: rpmPosPointLinePlane },
  { id: 'applied-pos-plane-two-lines', label: '[위치관계 유형 02] 평면에서 두 직선의 위치 관계', description: '정다각형에서 특정 변을 포함하는 직선과 한 점에서 만나는/평행한 직선 개수', en: ['Position Type 02: Intersecting & Parallel Lines in a Plane', 'Count intersecting and parallel side-extended lines in regular polygons'], make: rpmPosPlaneTwoLines },
  { id: 'applied-pos-solid-skew-edges', label: '[위치관계 유형 03] 입체도형에서 꼬인 위치에 있는 모서리의 개수', description: '직육면체, 삼각기둥, 정사면체 등에서 특정 모서리와 꼬인 위치(Skew)에 있는 모서리 개수', en: ['Position Type 03: Skew Edges in Polyhedra', 'Count edges skew to a given edge in prisms and pyramids'], make: rpmPosSolidSkewEdges },
  { id: 'applied-pos-solid-edge-plane', label: '[위치관계 유형 04] 입체도형에서 모서리와 면, 면과 면의 위치 관계', description: '직육면체나 각기둥에서 특정 면과 수직/평행인 모서리와 면의 개수 세기', en: ['Position Type 04: Perpendicular & Parallel Edges and Faces', 'Count edges and faces perpendicular or parallel to a given face in solids'], make: rpmPosSolidEdgePlaneRelations },
  { id: 'applied-pos-solid-net-relations', label: '[위치관계 유형 05] 전개도를 접어 만든 입체도형에서의 위치 관계', description: '정육면체 전개도를 접었을 때 서로 마주 보는 평행한 면의 쌍 및 수직 면 개수', en: ['Position Type 05: Spatial Relations in Folded Net Solids', 'Analyze parallel and perpendicular faces in folded cube nets'], make: rpmPosSolidNetRelations },
  { id: 'applied-pos-corresponding-alternate', label: '[위치관계 유형 06] 동위각과 엇각의 위치 및 크기 판별', description: '평행선이 다른 한 직선과 만날 때 생기는 동위각과 엇각의 짝과 크기 확인', en: ['Position Type 06: Corresponding & Alternate Interior Angles', 'Identify corresponding and alternate angle pairs and their measures'], make: rpmPosCorrespondingAlternate },
  { id: 'applied-pos-parallel-angle-solve', label: '[위치관계 유형 07] 평행선에서의 미지각 계산 (l // m)', description: '두 직선이 평행할 때 동위각과 엇각의 크기가 같음을 이용한 미지수 x의 값 구하기', en: ['Position Type 07: Solving Unknown Angles with Parallel Lines', 'Solve for x using equal measures of corresponding and alternate angles'], make: rpmPosParallelAngleSolve },
  { id: 'applied-pos-parallel-condition', label: '[위치관계 유형 08] 두 직선이 평행하기 위한 조건 판별', description: '동위각이나 엇각의 크기가 같음을 확인하여 두 직선이 평행한지 여부 판별하기', en: ['Position Type 08: Conditions for Parallel Lines', 'Determine if two lines are parallel based on angle measures'], make: rpmPosParallelCondition },
  { id: 'applied-pos-parallel-bent-single', label: '[위치관계 유형 09] 평행선 사이에 꺾인 점이 1개 있는 경우', description: '꺾인 점을 지나며 평행선에 나란한 보조선을 그어 꺾인 각 ∠x 구하기 (∠x = a + b)', en: ['Position Type 09: Bent Lines with One Vertex between Parallels', 'Draw parallel auxiliary lines at bend vertex to find angle sum x = a + b'], make: rpmPosParallelBentLineSingle },
  { id: 'applied-pos-parallel-bent-multi', label: '[위치관계 유형 10] 평행선 사이에 꺾인 점이 2개 이상 있는 경우 (지그재그)', description: '지그재그 꺾인 선에서 왼쪽을 향하는 각들의 합 = 오른쪽을 향하는 각들의 합 원리 활용', en: ['Position Type 10: Zigzag Bent Lines between Parallels', 'Apply left-angles sum equals right-angles sum rule for multi-bend lines'], make: rpmPosParallelBentLineMulti },
  { id: 'applied-pos-parallel-with-polygon', label: '[위치관계 유형 11] 평행선과 삼각형·정다각형이 결합된 각', description: '평행선 사이에 정삼각형이나 다각형의 꼭짓점이 놓였을 때 엇각과 내각의 결합 계산', en: ['Position Type 11: Parallel Lines with Polygons & Equilateral Triangles', 'Evaluate angles formed when polygon vertices lie between parallel lines'], make: rpmPosParallelWithPolygon },
  { id: 'applied-pos-parallel-angle-bisector', label: '[위치관계 유형 12] 평행선과 각의 이등분선이 만날 때의 각', description: '평행선 내부 동측내각의 이등분선들이 만나는 점에서의 수직 교각(90°) 원리', en: ['Position Type 12: Angle Bisectors Between Parallel Lines', 'Analyze right angles formed by intersecting consecutive interior bisectors'], make: rpmPosParallelAngleBisector },
  { id: 'applied-pos-paper-fold-angles', label: '[위치관계 유형 13] 종이 테이프를 접었을 때 생기는 각과 이등변삼각형', description: '접은 각 = 원래 각 성질과 평행선 엇각으로 이등변삼각형을 유도하여 각도 구하기', en: ['Position Type 13: Folded Paper Tape Angles & Isosceles Triangles', 'Use fold angle invariance and alternate angles to solve isosceles angles'], make: rpmPosPaperFoldAngles },
  { id: 'applied-pos-parallel-two-pairs', label: '[위치관계 유형 14] 두 쌍의 평행선이 교차할 때의 각', description: 'l // m, p // q의 두 쌍의 평행선이 격자형으로 만날 때 동위각·엇각·보각 관계 분석', en: ['Position Type 14: Two Pairs of Intersecting Parallel Lines', 'Analyze grids of two parallel line pairs and supplementary angles'], make: rpmPosParallelTwoPairs },
  { id: 'applied-pos-space-logic', label: '[위치관계 유형 15] 공간에서 위치 관계 참/거짓 명제 판별', description: '직육면체 공간 모델을 활용하여 직선과 평면의 수직/평행 명제의 참과 거짓 판별', en: ['Position Type 15: True/False Propositions in 3D Space', 'Evaluate spatial logic propositions on lines and planes using cuboid models'], make: rpmPosSpaceLogicStatements },
  { id: 'applied-pos-all-mixed', label: '[단원 실전 다지기] 매일 02 위치 관계 종합', description: '꼬인 위치, 평행선의 동위각·엇각, 꺾인 선, 종이 접기 등 위치 관계 전 유형 종합 출제', en: ['Daily 02 Position Relations Comprehensive', 'Comprehensive mixed practice across all position relations problem types'], make: rpmPosAllTypesMixed },
];

export const RPM_CONSTRUCTION_CONGRUENCE_APPLIED_UNITS = [
  { id: 'applied-cong-construct-segment', label: '[작도와 합동 유형 01] 작도의 도구와 길이가 같은 선분의 작도', description: '눈금 없는 자(선 긋기)와 컴퍼스(길이 옮기기)의 기본 원리와 선분 복사 작도', en: ['Congruence Type 01: Compass & Straightedge Segment Construction', 'Core roles of straightedge and compass in duplicating segment lengths'], make: rpmCongConstructSegment },
  { id: 'applied-cong-construct-angle-parallel', label: '[작도와 합동 유형 02] 크기가 같은 각과 평행선의 작도', description: '크기가 같은 각 작도 시 길이가 같은 선분 확인 및 동위각을 이용한 평행선 작도', en: ['Congruence Type 02: Congruent Angles & Parallel Line Construction', 'Construct equal angles and verify parallel lines using corresponding angles'], make: rpmCongConstructAngleParallel },
  { id: 'applied-cong-triangle-opposite', label: '[작도와 합동 유형 03] 삼각형의 대변과 대각', description: '삼각형 ABC에서 꼭짓점과 마주 보는 대변, 변과 마주 보는 대각 매칭', en: ['Congruence Type 03: Opposite Sides & Angles of a Triangle', 'Identify opposite sides and opposite angles in triangle ABC'], make: rpmCongTriangleOpposite },
  { id: 'applied-cong-triangle-inequality', label: '[작도와 합동 유형 04] 삼각형의 세 변의 길이의 조건 (삼각형의 성립 조건)', description: '가장 긴 변 < 나머지 두 변의 합 조건으로 삼각형 성립 여부 판별 및 조합 개수 세기', en: ['Congruence Type 04: Triangle Inequality Theorem', 'Determine if segments form a triangle (longest < sum of other two)'], make: rpmCongTriangleInequality },
  { id: 'applied-cong-triangle-param-range', label: '[작도와 합동 유형 05] 미지수 변이 주어졌을 때 삼각형 성립 범위', description: '두 변 a, b와 미지수 변 x가 주어졌을 때 |a-b| < x < a+b 만족하는 자연수 개수', en: ['Congruence Type 05: Range for Unknown Triangle Side', 'Find range and count of integers satisfying triangle inequality |a-b| < x < a+b'], make: rpmCongTriangleParamRange },
  { id: 'applied-cong-triangle-determined-cond', label: '[작도와 합동 유형 06] 삼각형이 하나로 정해지는 조건 판별', description: 'SSS, SAS, ASA 조건 충족 여부 및 하나로 정해지지 않는 반례(AAA, SSA 등) 판별', en: ['Congruence Type 06: Conditions for Unique Triangle Determination', 'Check conditions determining a unique triangle vs non-unique cases'], make: rpmCongTriangleDeterminedCond },
  { id: 'applied-cong-figure-congruence-props', label: '[작도와 합동 유형 07] 도형의 합동 성질과 대응변·대응각', description: '합동 기호(≡)의 대응점 순서, 대응변의 길이와 대응각의 크기 계산', en: ['Congruence Type 07: Congruence Properties & Corresponding Parts', 'Properties of congruent figures, corresponding sides, and angles'], make: rpmCongFigureCongruenceProps },
  { id: 'applied-cong-triangle-sss-sas-asa', label: '[작도와 합동 유형 08] 삼각형의 합동 조건 (SSS, SAS, ASA) 판별', description: '대응하는 세 변(SSS), 두 변과 끼인각(SAS), 한 변과 양 끝각(ASA) 합동 판별', en: ['Congruence Type 08: SSS, SAS, and ASA Triangle Congruence', 'Identify applicable congruence criterion from given conditions'], make: rpmCongTriangleSssSasAsa },
  { id: 'applied-cong-triangle-add-condition', label: '[작도와 합동 유형 09] 합동이 되기 위한 추가 조건 찾기', description: '두 조건이 주어졌을 때 목표 합동 조건(SSS, SAS, ASA)을 완성하는 추가 조건 탐색', en: ['Congruence Type 09: Finding Necessary Additional Conditions', 'Determine required additional side or angle to establish congruence'], make: rpmCongTriangleAddCondition },
  { id: 'applied-cong-rotation-equilateral-square', label: '[작도와 합동 유형 10] 정삼각형 및 정사각형에서 회전 합동의 활용', description: '정삼각형이나 정사각형에서 회전 대칭으로 생기는 SAS 합동을 통한 길이·각도 계산', en: ['Congruence Type 10: Rotational Congruence in Equilateral Triangles & Squares', 'Apply rotational SAS congruence in regular polygons to find lengths and angles'], make: rpmCongRotationEquilateralSquare },
  { id: 'applied-cong-right-isosceles-altitude', label: '[작도와 합동 유형 11] 직각이등변삼각형의 꼭짓점을 지나는 직선과 합동', description: '직각이등변삼각형 꼭짓점의 직선에 내린 두 수선으로 생기는 직각삼각형 합동 활용', en: ['Congruence Type 11: Altitudes on Line through Right Isosceles Vertex', 'Exploit congruent right triangles formed by dropping altitudes onto a line'], make: rpmCongRightIsoscelesAltitude },
  { id: 'applied-cong-square-overlap-area', label: '[작도와 합동 유형 12] 정사각형 겹침에서의 합동과 넓이', description: '대각선의 교점에 꼭짓점이 놓인 두 정사각형의 겹친 넓이 = 한 정사각형의 1/4 계산', en: ['Congruence Type 12: Overlapping Squares Area via Congruence', 'Calculate constant overlap area (1/4 of square) by rotational congruence'], make: rpmCongSquareOverlapArea },
  { id: 'applied-cong-all-mixed', label: '[단원 실전 다지기] 매일 03 작도와 합동 종합', description: '작도 도구, 삼각형 성립 조건, SSS/SAS/ASA 합동, 회전 합동 등 전 유형 종합 출제', en: ['Daily 03 Constructions & Congruence Comprehensive', 'Comprehensive mixed practice across all construction and congruence types'], make: rpmCongAllTypesMixed },
];

export const RPM_GEO_MOCK_UNITS = [
  { id: 'applied-geo-semester-one-mock-exam', label: '[1학기 총괄평가] 매일 중학 1-2 1학기 기하 전 범위 실전 모의고사 (기본도형~합동)', description: '기본도형, 위치관계, 작도와 합동 3개 단원 총 20문항 실전 모의고사', en: ['Grade 7-2 Semester 1 Geometry Comprehensive Mock Exam', 'Comprehensive 20-problem mock exam across Basic Figures, Position Relations, and Congruence'], make: rpmGeoSemesterOneMockExam },
];

export const RPM_POLYGONS_APPLIED_UNITS = [
  { id: 'applied-poly-concept-interior-exterior', label: '[다각형 응용 01] 다각형과 정다각형의 성질', description: '다각형의 내각과 외각의 관계(합=180°) 및 정다각형의 정의 판별', en: ['Polygons Type 01: Polygon & Regular Polygon Definitions', 'Relationship between interior and exterior angles (sum=180°) and regular polygon criteria'], make: rpmPolyConceptInteriorExterior },
  { id: 'applied-poly-diagonal-count-formula', label: '[다각형 응용 02] 다각형의 대각선의 개수 공식', description: '한 꼭짓점에서 그을 수 있는 대각선(n-3) 및 총 대각선 수(n(n-3)/2)와 악수 활용', en: ['Polygons Type 02: Number of Diagonals Formula', 'Diagonals from one vertex (n-3), total diagonals n(n-3)/2, and handshake problem'], make: rpmPolyDiagonalCountFormula },
  { id: 'applied-poly-find-polygon-from-diagonals', label: '[다각형 응용 03] 대각선의 개수로 다각형 역추적', description: '대각선의 총수가 주어질 때 다각형의 변의 개수 및 내각의 합 계산', en: ['Polygons Type 03: Identifying Polygon from Diagonal Count', 'Determine number of sides and interior angle sum from total diagonal count'], make: rpmPolyFindPolygonFromDiagonals },
  { id: 'applied-poly-triangle-angle-sum-ratio', label: '[다각형 응용 04] 삼각형 내각의 합과 각의 비례배분', description: '삼각형 세 내각의 합(180°)과 비례배분 및 외각의 비를 이용한 각의 크기', en: ['Polygons Type 04: Triangle Angle Sum & Ratio Distribution', 'Triangle interior angle sum 180°, ratio division, and exterior angle ratios'], make: rpmPolyTriangleAngleSumRatio },
  { id: 'applied-poly-triangle-exterior-angle-prop', label: '[다각형 응용 05] 삼각형 내각과 외각의 성질', description: '한 외각은 이웃하지 않는 두 내각의 합 및 이등변삼각형 연쇄 사다리 각도', en: ['Polygons Type 05: Triangle Exterior Angle Theorem', 'One exterior angle equals sum of two remote interior angles and zigzag isosceles chains'], make: rpmPolyTriangleExteriorAngleProp },
  { id: 'applied-poly-boomerang-concave-angle', label: '[다각형 응용 06] 오목다각형(부메랑 모양)의 각', description: '오목사각형 부메랑 공식 x = a + b + c 를 이용한 꺾인 각도 구하기', en: ['Polygons Type 06: Concave Quadrilateral Boomerang Angle', 'Calculate reflex corner angle using the boomerang formula x = a + b + c'], make: rpmPolyBoomerangConcaveAngle },
  { id: 'applied-poly-incenter-angle-bisector', label: '[다각형 응용 07] 삼각형 두 내각의 이등분선의 교각', description: '삼각형의 두 내각의 이등분선의 교각 BIC = 90° + (1/2)A 계산', en: ['Polygons Type 07: Angle Between Two Interior Angle Bisectors', 'Compute angle at incenter BIC = 90° + (1/2)A'], make: rpmPolyIncenterAngleBisector },
  { id: 'applied-poly-exterior-interior-bisector', label: '[다각형 응용 08] 내각과 외각의 이등분선의 교각', description: '한 내각의 이등분선과 한 외각의 이등분선의 교각 D = (1/2)A 계산', en: ['Polygons Type 08: Angle Between Interior & Exterior Bisectors', 'Angle between interior bisector and exterior bisector D = (1/2)A'], make: rpmPolyExteriorInteriorBisector },
  { id: 'applied-poly-interior-angle-sum-formula', label: '[다각형 응용 09] 다각형의 내각의 크기의 합 공식', description: '180° × (n - 2) 공식을 이용한 n각형 내각의 합 및 미지수 각도 계산', en: ['Polygons Type 09: Polygon Interior Angle Sum Formula', 'Sum of interior angles 180° × (n - 2) and solving for missing angles'], make: rpmPolyInteriorAngleSumFormula },
  { id: 'applied-poly-exterior-angle-sum-const', label: '[다각형 응용 10] 다각형의 외각의 크기의 합', description: '모든 다각형의 외각의 크기의 합은 항상 360°임을 이용한 미지각 계산', en: ['Polygons Type 10: Sum of Exterior Angles of a Polygon', 'Using the fact that sum of exterior angles is always 360° to find missing angles'], make: rpmPolyExteriorAngleSumConst },
  { id: 'applied-poly-regular-interior-exterior', label: '[다각형 응용 11] 정다각형의 한 내각과 한 외각의 크기', description: '정n각형의 한 내각과 외각의 크기 공식 및 다각형의 변의 개수 역추적', en: ['Polygons Type 11: Regular Polygon Interior & Exterior Angles', 'Compute individual interior and exterior angles and identify regular polygon'], make: rpmPolyRegularInteriorExterior },
  { id: 'applied-poly-regular-ratio-angle', label: '[다각형 응용 12] 정다각형 한 내각과 한 외각의 비', description: '내각:외각의 비가 주어졌을 때 정다각형 이름 및 총 대각선 수 구하기', en: ['Polygons Type 12: Ratio of Interior to Exterior Angle', 'Determine regular polygon type and diagonal count from interior:exterior ratio'], make: rpmPolyRegularRatioAngle },
  { id: 'applied-poly-regular-diagonal-angle', label: '[다각형 응용 13] 정다각형의 대각선과 각의 크기', description: '정오각형 및 정육각형 내부 대각선이 이루는 교각 및 이등변삼각형 각도', en: ['Polygons Type 13: Angles Formed by Diagonals in Regular Polygons', 'Calculate intersection angles of diagonals in regular pentagons and hexagons'], make: rpmPolyRegularDiagonalAngle },
  { id: 'applied-poly-two-polygons-shared-side', label: '[다각형 응용 14] 변을 공유하는 두 정다각형의 결합각', description: '정다각형들이 한 변에서 맞닿아 있을 때 사이 각 및 이등변삼각형 꼭지각 계산', en: ['Polygons Type 14: Combined Angles of Touching Regular Polygons', 'Angles between two regular polygons sharing a common edge'], make: rpmPolyTwoPolygonsSharedSide },
  { id: 'applied-poly-star-polygon-angle-sum', label: '[다각형 응용 15] 별 모양 다각형 꼭짓점의 각의 합', description: '외각 성질과 맞꼭지각을 이용한 5각별(180°) 및 6각별(360°) 꼭짓점 각의 총합', en: ['Polygons Type 15: Star Polygon Vertex Angle Sum', 'Sum of vertex angles in 5-pointed (180°) and 6-pointed (360°) star polygons'], make: rpmPolyStarPolygonAngleSum },
  { id: 'applied-poly-paper-fold-parallel-angle', label: '[다각형 응용 16] 평행선 종이 테이프 접기와 다각형 (실력UP)', description: '직사각형 종이 테이프를 접었을 때 접은 각과 엇각으로 생기는 이등변삼각형 각도', en: ['Polygons Type 16: Folded Paper Strip Angles with Parallel Lines', 'Calculate folded and alternate interior angles forming isosceles triangles'], make: rpmPolyPaperFoldParallelAngle },
  { id: 'applied-poly-all-mixed', label: '[다각형 종합] 다각형 전 유형 실전 혼합 모의고사', description: '다각형 단원 16개 세부 핵심 유형에서 무작위 출제되는 실전 대비 세트', en: ['Polygons Comprehensive: All 16 Types Mixed', 'Randomized practice set covering all 16 polygon applied problem types'], make: rpmPolyAllTypesMixed },
];

export const RPM_CIRCLES_SECTORS_APPLIED_UNITS = [
  { id: 'applied-circle-sector-concept-terms', label: '[원과 부채꼴 응용 01] 원과 부채꼴의 기본 개념과 용어', description: '호, 현, 활꼴, 중심각의 정의 및 반원의 성질 정오 판별', en: ['Circles & Sectors Type 01: Basic Concepts & Terminology', 'Definitions of arc, chord, segment, central angle, and semicircle properties'], make: rpmCircleSectorConceptTerms },
  { id: 'applied-circle-central-angle-arc-prop', label: '[원과 부채꼴 응용 02] 중심각의 크기와 호의 길이의 정비례', description: '호의 길이는 중심각의 크기에 정비례함을 이용한 비례식 및 비례배분', en: ['Circles & Sectors Type 02: Central Angle & Arc Length Proportionality', 'Direct proportionality between central angle and arc length; ratio distribution'], make: rpmCircleCentralAngleArcProp },
  { id: 'applied-circle-parallel-chord-arc', label: '[원과 부채꼴 응용 03] 평행선과 보조선을 이용한 호의 길이', description: '원 안의 평행선 엇각과 이등변삼각형 반지름 성질을 이용한 호의 길이 계산', en: ['Circles & Sectors Type 03: Parallel Chords & Arc Length', 'Find arc lengths using parallel line alternate interior angles and radii isosceles triangles'], make: rpmCircleParallelChordArc },
  { id: 'applied-circle-central-angle-area-prop', label: '[원과 부채꼴 응용 04] 중심각의 크기와 부채꼴 넓이의 정비례', description: '부채꼴의 넓이는 중심각에 정비례함을 이용한 넓이 계산 및 원의 넓이 역추적', en: ['Circles & Sectors Type 04: Central Angle & Sector Area Proportionality', 'Direct proportionality between central angle and sector area; total circle area'], make: rpmCircleCentralAngleAreaProp },
  { id: 'applied-circle-chord-not-proportional', label: '[원과 부채꼴 응용 05] 중심각과 현의 길이의 관계', description: '현의 길이와 삼각형 넓이는 중심각에 정비례하지 않음 판별 및 이해', en: ['Circles & Sectors Type 05: Central Angle vs Chord Length', 'Chords and triangle areas are NOT directly proportional to the central angle'], make: rpmCircleChordNotProportional },
  { id: 'applied-circle-circumference-and-area', label: '[원과 부채꼴 응용 06] 원의 둘레의 길이와 넓이 공식', description: 'l = 2πr 과 S = πr² 공식을 이용한 원의 둘레와 넓이 계산', en: ['Circles & Sectors Type 06: Circle Circumference & Area Formulas', 'Calculate circle circumference (2πr) and area (πr²)'], make: rpmCircleCircumferenceAndArea },
  { id: 'applied-sector-arc-length-and-area', label: '[원과 부채꼴 응용 07] 부채꼴의 호의 길이와 넓이 공식', description: '반지름과 중심각으로부터 부채꼴의 호의 길이와 넓이 계산', en: ['Circles & Sectors Type 07: Sector Arc Length & Area Formulas', 'Calculate arc length 2πr(x/360) and sector area πr²(x/360)'], make: rpmSectorArcLengthAndArea },
  { id: 'applied-sector-area-from-arc-radius', label: '[원과 부채꼴 응용 08] 호의 길이와 반지름으로 넓이 구하기', description: 'S = (1/2)rl 공식을 활용한 부채꼴 넓이 및 반지름 역추적', en: ['Circles & Sectors Type 08: Sector Area from Arc Length & Radius', 'Use S = (1/2)rl to find area or backtrack radius and central angle'], make: rpmSectorAreaFromArcRadius },
  { id: 'applied-shaded-region-perimeter', label: '[원과 부채꼴 응용 09] 색칠한 부분의 둘레의 길이', description: '반원 접합 및 부채꼴 고리 모양 둘레의 길이(곡선 호 + 직선 선분) 계산', en: ['Circles & Sectors Type 09: Perimeter of Shaded Geometric Regions', 'Perimeter of composite shapes combining arcs and straight boundaries'], make: rpmShadedRegionPerimeter },
  { id: 'applied-shaded-region-area-diff', label: '[원과 부채꼴 응용 10] 색칠한 부분의 넓이 (나뭇잎/활꼴)', description: '정사각형 안 겹쳐진 사분원의 나뭇잎 모양 및 활꼴 넓이(부채꼴-삼각형) 계산', en: ['Circles & Sectors Type 10: Area of Shaded Regions (Leaf & Segment)', 'Area of overlapping quarter-circles in square and circular segments'], make: rpmShadedRegionAreaDiff },
  { id: 'applied-figure-rotation-swept-area', label: '[원과 부채꼴 응용 11] 도형의 이동 및 회전으로 생기는 영역', description: '히포크라테스의 초승달 및 선분/도형 회전 궤적이 지나간 자리의 넓이', en: ['Circles & Sectors Type 11: Area Swept by Rotating / Translating Figures', 'Hippocrates crescents and swept areas of rotated line segments'], make: rpmFigureRotationSweptArea },
  { id: 'applied-tethered-animal-pasture-area', label: '[원과 부채꼴 응용 12] 묶인 가축의 풀 뜯는 영역의 넓이', description: '직사각형 우리 모퉁이에 묶인 가축의 모퉁이 회전 부채꼴 최대 영역 계산', en: ['Circles & Sectors Type 12: Tethered Animal Grazing Area', 'Calculate multi-sector grazing areas of animals tethered to rectangular fences'], make: rpmTetheredAnimalPastureArea },
  { id: 'applied-rolling-circle-track-area', label: '[원과 부채꼴 응용 13] 다각형 둘레를 굴러가는 원의 자취', description: '다각형 둘레를 구르는 원의 중심 이동 거리 및 지나간 자리의 넓이 계산', en: ['Circles & Sectors Type 13: Locus of a Rolling Circle Around Polygons', 'Distance traveled by center and area swept by circle rolling around polygons'], make: rpmRollingCircleTrackArea },
  { id: 'applied-circle-sector-all-mixed', label: '[원과 부채꼴 종합] 원과 부채꼴 전 유형 실전 혼합 모의고사', description: '원과 부채꼴 단원 13개 세부 핵심 유형에서 무작위 출제되는 실전 대비 세트', en: ['Circles & Sectors Comprehensive: All 13 Types Mixed', 'Randomized practice set covering all 13 circle and sector applied problem types'], make: rpmCircleSectorAllTypesMixed },
];

export const RPM_PLANE_FIGURES_MOCK_UNITS = [
  { id: 'applied-plane-figures-semester-mock-exam', label: '[평면도형 총괄평가] 중1-2 평면도형 종합 실전 모의고사', description: '다각형과 원과 부채꼴 전 범위를 망라한 중단원 및 실력UP 총괄 모의고사', en: ['Grade 7-2 Plane Figures Comprehensive Mock Exam', 'Comprehensive mock exam covering all topics in Polygons, Circles, and Sectors'], make: rpmPlaneFiguresSemesterMockExam },
];

export const RPM_POLYHEDRA_REVOLUTION_APPLIED_UNITS = [
  { id: 'applied-polyhedra-concept-classification', label: '[다면체·회전체 응용 01] 다면체의 뜻과 판별', description: '다각형인 면으로만 둘러싸인 입체도형 판별 및 최소 사면체 성질', en: ['Polyhedra & Revolution Type 01: Polyhedron Concept & Classification', 'Identify polyhedra bounded purely by polygons and minimum face rules'], make: rpmPolyhedronConceptClassification },
  { id: 'applied-polyhedra-prism-pyramid-elements', label: '[다면체·회전체 응용 02] 각기둥·각뿔·각뿔대의 구성요소', description: 'n각기둥, n각뿔, n각뿔대의 면, 꼭짓점, 모서리의 개수 공식 계산', en: ['Polyhedra & Revolution Type 02: Prism, Pyramid & Frustum Elements', 'Formulas for faces, vertices, and edges of n-gonal prisms, pyramids, and frustums'], make: rpmPolyhedronPrismPyramidElements },
  { id: 'applied-polyhedra-identify-from-conditions', label: '[다면체·회전체 응용 03] 조건을 만족시키는 다면체 구하기', description: '면의 모양, 밑면의 수, 꼭짓점·모서리 수로부터 다면체 이름 역추적', en: ['Polyhedra & Revolution Type 03: Identifying Polyhedra from Conditions', 'Reverse lookup of polyhedron name from face shapes, base counts, and vertex/edge counts'], make: rpmPolyhedronIdentifyFromConditions },
  { id: 'applied-polyhedra-euler-formula', label: '[다면체·회전체 응용 04] 오일러 공식 (v - e + f = 2)', description: '다면체의 꼭짓점(v), 모서리(e), 면(f)의 오일러 다면체 정리 활용', en: ['Polyhedra & Revolution Type 04: Euler Characteristic Formula (v - e + f = 2)', 'Apply Euler polyhedron theorem to calculate unknown vertices, edges, or faces'], make: rpmPolyhedronEulerFormula },
  { id: 'applied-polyhedra-regular-types-conditions', label: '[다면체·회전체 응용 05] 정다면체의 뜻과 조건 (5가지)', description: '각 면이 합동인 정다각형이고 꼭짓점당 면 수가 같은 5가지 정다면체 원리', en: ['Polyhedra & Revolution Type 05: Regular Polyhedra Definition & 5 Types', 'Criteria for the exactly 5 Platonic solids based on vertex angle sums < 360°'], make: rpmRegularPolyhedraTypesConditions },
  { id: 'applied-polyhedra-regular-face-shapes', label: '[다면체·회전체 응용 06] 정다면체 면의 모양과 꼭짓점당 면 수', description: '정삼각형(4,8,20면체), 정사각형(6면체), 정오각형(12면체) 및 모인 면 수', en: ['Polyhedra & Revolution Type 06: Regular Polyhedra Face Shapes & Vertex Counts', 'Face geometries (triangle, square, pentagon) and number of faces meeting at each vertex'], make: rpmRegularPolyhedraFaceShapes },
  { id: 'applied-polyhedra-regular-elements-count', label: '[다면체·회전체 응용 07] 정다면체 꼭짓점·모서리·면의 개수', description: '5개 정다면체의 v, e, f 개수 암기 및 계산 활용', en: ['Polyhedra & Revolution Type 07: Counting Vertices, Edges, and Faces of Regular Solids', 'Calculation and relations between v, e, and f of Platonic solids'], make: rpmRegularPolyhedraElementsCount },
  { id: 'applied-polyhedra-cube-net-opposite-faces', label: '[다면체·회전체 응용 08] 정다면체의 전개도와 마주보는 면', description: '정육면체 주사위 전개도에서 마주보는 면의 눈의 합(7) 및 위치 판별', en: ['Polyhedra & Revolution Type 08: Cube Nets & Opposite Faces', 'Identify opposite faces and die pip sums (sum = 7) on unfolded cube nets'], make: rpmCubeNetOppositeFaces },
  { id: 'applied-polyhedra-cross-section-shapes', label: '[다면체·회전체 응용 09] 다면체의 단면의 모양', description: '정육면체를 평면으로 자를 때 생길 수 있는 다각형 단면(삼각형~육각형, 칠각형 불가)', en: ['Polyhedra & Revolution Type 09: Cross-Sections of Polyhedra', 'Possible polygon cross-sections of a sliced cube (triangles up to hexagons; heptagons impossible)'], make: rpmPolyhedronCrossSectionShapes },
  { id: 'applied-polyhedra-dual-connections', label: '[다면체·회전체 응용 10] 정다면체 면의 중심 연결 입체 (쌍대다면체)', description: '정다면체 각 면의 중심을 연결하여 생기는 쌍대 정다면체 관계 판별', en: ['Polyhedra & Revolution Type 10: Dual Polyhedra by Connecting Face Centers', 'Determine dual Platonic solids formed by joining centers of adjacent faces'], make: rpmDualPolyhedraConnections },
  { id: 'applied-revolution-solids-types', label: '[다면체·회전체 응용 11] 회전체의 뜻과 종류', description: '원기둥, 원뿔, 원뿔대, 구 등 회전축을 중심으로 1회전 시켜 생기는 입체 판별', en: ['Polyhedra & Revolution Type 11: Solids of Revolution Definition & Types', 'Classification of cylinder, cone, frustum, and sphere formed by revolving plane shapes'], make: rpmSolidsOfRevolutionTypes },
  { id: 'applied-revolution-planar-to-solid', label: '[다면체·회전체 응용 12] 평면도형의 회전과 회전체 매칭', description: '직사각형, 직각삼각형, 사다리꼴, 반원 회전 시 생성되는 입체도형 매칭', en: ['Polyhedra & Revolution Type 12: Revolving Planar Figures into 3D Solids', 'Matching rectangles, right triangles, trapezoids, and semicircles to their revolved solids'], make: rpmPlanarFigureToRevolutionSolid },
  { id: 'applied-revolution-cross-section-property', label: '[다면체·회전체 응용 13] 회전체의 단면의 성질', description: '회전축에 수직인 단면(원)과 회전축을 포함하는 단면(선대칭도형) 성질', en: ['Polyhedra & Revolution Type 13: Cross-Section Properties of Revolved Solids', 'Perpendicular cuts are circles; axial cuts are line-symmetric congruent figures'], make: rpmRevolutionCrossSectionProperty },
  { id: 'applied-revolution-cross-section-area-calc', label: '[다면체·회전체 응용 14] 회전체의 단면의 넓이 계산', description: '원뿔의 이등변삼각형 단면, 원기둥의 직사각형 단면 넓이 공식 계산', en: ['Polyhedra & Revolution Type 14: Cross-Sectional Area Calculations', 'Calculate area of axial triangle sections in cones and rectangle sections in cylinders'], make: rpmRevolutionCrossSectionAreaCalc },
  { id: 'applied-revolution-cone-net-central-angle', label: '[다면체·회전체 응용 15] 원뿔 전개도 부채꼴의 중심각 크기', description: '밑면 반지름 r과 모선 l로부터 옆면 부채꼴 중심각 x = 360° × (r / l) 계산', en: ['Polyhedra & Revolution Type 15: Cone Lateral Net Sector Central Angle', 'Compute central angle x = 360° × (r / l) from base radius r and slant height l'], make: rpmConeNetSectorCentralAngle },
  { id: 'applied-revolution-advanced-properties', label: '[다면체·회전체 응용 16] 회전체의 성질 심화 판별 (실력UP)', description: '구의 무수히 많은 회전축, 대원 단면, 비스듬한 단면 타원 등 심화 정오 판별', en: ['Polyhedra & Revolution Type 16: Advanced Properties of Solids of Revolution', 'Sphere infinite axes, great circle maximum area, and inclined cylindrical ellipse sections'], make: rpmRevolutionSolidsAdvancedProperties },
  { id: 'applied-polyhedra-revolution-all-mixed', label: '[다면체·회전체 종합] 다면체와 회전체 전 유형 실전 혼합', description: '다면체와 회전체 단원 16개 세부 핵심 유형 무작위 실전 출제 세트', en: ['Polyhedra & Revolution Comprehensive: All 16 Types Mixed', 'Randomized practice set covering all 16 polyhedra and revolution applied problem types'], make: rpmPolyhedronRevolutionAllMixed },
];

export const RPM_SOLIDS_MEASURES_APPLIED_UNITS = [
  { id: 'applied-solids-prism-surface-area', label: '[겉넓이와 부피 응용 01] 각기둥의 겉넓이', description: '밑면이 삼각형, 사각형인 각기둥의 겉넓이(2×밑넓이 + 옆넓이) 계산', en: ['Solids Surface & Volume Type 01: Prism Surface Area', 'Compute surface area of triangular and rectangular prisms (2×base + lateral area)'], make: rpmPrismSurfaceAreaCalc },
  { id: 'applied-solids-cylinder-surface-area', label: '[겉넓이와 부피 응용 02] 원기둥의 겉넓이', description: 'S = 2πr² + 2πrh = 2πr(r + h) 공식을 활용한 원기둥 겉넓이 계산', en: ['Solids Surface & Volume Type 02: Cylinder Surface Area', 'Calculate surface area of a cylinder using S = 2πr² + 2πrh'], make: rpmCylinderSurfaceAreaCalc },
  { id: 'applied-solids-prism-cylinder-volume', label: '[겉넓이와 부피 응용 03] 기둥(각기둥, 원기둥)의 부피', description: '밑넓이 × 높이 공식을 이용한 사각기둥 및 원기둥 부피 계산', en: ['Solids Surface & Volume Type 03: Prism & Cylinder Volume', 'Calculate volume of prisms and cylinders using V = base area × height'], make: rpmPrismCylinderVolumeCalc },
  { id: 'applied-solids-hollow-prism-surface-volume', label: '[겉넓이와 부피 응용 04] 구멍이 뚫린 기둥의 겉넓이와 부피', description: '원기둥 구멍이 뚫린 기둥의 도넛형 밑넓이, 바깥/안쪽 옆넓이 및 부피 계산', en: ['Solids Surface & Volume Type 04: Hollow Cylinder Surface Area & Volume', 'Surface area (outer + inner + 2 bases) and volume of hollow cylinder tubes'], make: rpmHollowPrismSurfaceVolume },
  { id: 'applied-solids-pyramid-surface-volume', label: '[겉넓이와 부피 응용 05] 각뿔의 겉넓이와 부피', description: '정사각뿔의 겉넓이(밑넓이+이등변삼각형 4개) 및 부피(1/3 × 밑넓이 × 높이)', en: ['Solids Surface & Volume Type 05: Pyramid Surface Area & Volume', 'Square pyramid surface area (base + 4 triangles) and volume (1/3 × base × height)'], make: rpmPyramidSurfaceAreaVolume },
  { id: 'applied-solids-cone-surface-area', label: '[겉넓이와 부피 응용 06] 원뿔의 겉넓이', description: '밑넓이(πr²) + 옆넓이(πrl) 공식을 이용한 원뿔의 겉넓이 계산', en: ['Solids Surface & Volume Type 06: Cone Surface Area', 'Compute cone total surface area S = πr² + πrl using base radius and slant height'], make: rpmConeSurfaceAreaCalc },
  { id: 'applied-solids-cone-volume', label: '[겉넓이와 부피 응용 07] 원뿔의 부피', description: 'V = (1/3)πr²h 공식을 이용한 원뿔의 부피 계산', en: ['Solids Surface & Volume Type 07: Cone Volume Formula', 'Calculate cone volume using V = (1/3)πr²h'], make: rpmConeVolumeCalc },
  { id: 'applied-solids-truncated-corner-pyramid', label: '[겉넓이와 부피 응용 08] 정육면체 모퉁이를 자른 삼각뿔의 부피', description: '정육면체 꼭짓점에서 세 변을 잘라낸 삼각뿔(1/6 a³) 및 남은 입체 부피', en: ['Solids Surface & Volume Type 08: Corner Truncated Pyramid Volume', 'Volume of a corner triangular pyramid cut from a cube (V = 1/6 a³)'], make: rpmTruncatedCornerPyramidVolume },
  { id: 'applied-solids-frustum-surface-volume', label: '[겉넓이와 부피 응용 09] 뿔대(원뿔대)의 겉넓이와 부피', description: '큰 뿔의 부피에서 작은 뿔의 부피를 뺀 뿔대의 부피 및 옆면 넓이 계산', en: ['Solids Surface & Volume Type 09: Frustum Volume & Surface Area', 'Calculate frustum volume by subtracting small cone from large cone'], make: rpmFrustumSurfaceAreaVolume },
  { id: 'applied-solids-revolution-surface-volume', label: '[겉넓이와 부피 응용 10] 회전체의 겉넓이와 부피', description: '직각삼각형 회전체(원뿔)의 겉넓이와 부피 동시 계산', en: ['Solids Surface & Volume Type 10: Revolved Solid Surface Area & Volume', 'Surface area and volume of right triangle revolved solids (cones)'], make: rpmRevolutionSolidSurfaceVolume },
  { id: 'applied-solids-sphere-surface-area', label: '[겉넓이와 부피 응용 11] 구와 반구의 겉넓이', description: '구(4πr²) 및 반구(곡면 2πr² + 밑면 πr² = 3πr²)의 겉넓이 계산', en: ['Solids Surface & Volume Type 11: Sphere & Hemisphere Surface Area', 'Compute surface area of sphere (4πr²) and solid hemisphere (3πr²)'], make: rpmSphereSurfaceAreaCalc },
  { id: 'applied-solids-sphere-volume', label: '[겉넓이와 부피 응용 12] 구와 반구의 부피', description: '구(4/3 πr³) 및 반구(2/3 πr³)의 부피 공식 계산', en: ['Solids Surface & Volume Type 12: Sphere & Hemisphere Volume', 'Calculate volume of sphere (4/3 πr³) and hemisphere (2/3 πr³)'], make: rpmSphereVolumeCalc },
  { id: 'applied-solids-truncated-sphere-part', label: '[겉넓이와 부피 응용 13] 구의 일부분(1/8 조각 등)의 겉넓이와 부피', description: '구의 1/8 조각 입체도형의 구면(1/8) + 사분원 3개 겉넓이 및 부피 계산', en: ['Solids Surface & Volume Type 13: Sliced Sphere Sector (1/8 Chunk) Measures', 'Surface area (spherical wedge + 3 quarter-circle planes) and volume of 1/8 sphere'], make: rpmTruncatedSpherePartSurfaceVolume },
  { id: 'applied-solids-cone-sphere-cylinder-ratio', label: '[겉넓이와 부피 응용 14] 원뿔·구·원기둥의 부피의 비 (1 : 2 : 3)', description: '동일 지름과 높이를 갖는 원뿔, 구, 원기둥의 부피비 1 : 2 : 3 활용 문제', en: ['Solids Surface & Volume Type 14: Cone, Sphere & Cylinder Volume Ratio (1:2:3)', 'Solve snug-fit inscribed volume ratios: cone (1) : sphere (2) : cylinder (3)'], make: rpmConeSphereCylinderRatio },
  { id: 'applied-solids-container-water-level', label: '[겉넓이와 부피 응용 15] 그릇에 담긴 물의 부피와 높이', description: '원뿔 그릇의 깊이비 1:2와 부피비 1:8을 이용한 물의 양 역추적', en: ['Solids Surface & Volume Type 15: Conical Container Water Volume & Depth Ratio', 'Apply cubic scale factor (1:8 volume ratio for 1:2 depth) to water level calculations'], make: rpmContainerWaterLevelVolume },
  { id: 'applied-solids-surface-shortest-path', label: '[겉넓이와 부피 응용 16] 입체도형 표면 위의 최단 거리 (실력UP)', description: '원뿔 옆면 전개도(부채꼴) 상에서 두 점을 잇는 직선 선분 최단거리 계산', en: ['Solids Surface & Volume Type 16: Shortest Path on Solid Surface (Unfolded Net)', 'Find shortest wrapped string path across lateral surfaces using unfolded nets'], make: rpmSolidSurfaceShortestPath },
  { id: 'applied-solids-surface-volume-all-mixed', label: '[겉넓이와 부피 종합] 입체도형의 겉넓이와 부피 전 유형 혼합', description: '입체도형의 겉넓이와 부피 단원 16개 핵심 유형 무작위 실전 출제 세트', en: ['Solids Surface & Volume Comprehensive: All 16 Types Mixed', 'Randomized practice set covering all 16 solid figure measurement applied types'], make: rpmSolidsSurfaceVolumeAllMixed },
];

export const RPM_SOLID_FIGURES_MOCK_UNITS = [
  { id: 'applied-solid-figures-semester-mock-exam', label: '[입체도형 총괄평가] 중1-2 입체도형 종합 실전 모의고사', description: '다면체와 회전체, 입체도형의 겉넓이와 부피 전 범위를 망라한 중단원 및 실력UP 총괄 모의고사', en: ['Grade 7-2 Solid Figures Comprehensive Mock Exam', 'Comprehensive mock exam covering all topics in Polyhedra, Revolution Solids, Surface Area, and Volume'], make: rpmSolidFiguresSemesterMockExam },
];

export const RPM_DATA_STATISTICS_APPLIED_UNITS = [
  { id: 'applied-data-stem-and-leaf-plot', label: '[자료와 통계 응용 01] 줄기와 잎 그림 해석', description: '전체 자료의 수, k번째로 큰/작은 변량, 특정 범위 백분율 계산', en: ['Data & Statistics Type 01: Stem-and-Leaf Plot Interpretation', 'Find total data points, k-th values, and percentage in range'], make: rpmDataStemAndLeafPlot },
  { id: 'applied-data-torn-stem-leaf-plot', label: '[자료와 통계 응용 02] 찢어진 줄기와 잎 그림', description: '일부가 찢어져 보이지 않는 줄기와 잎 그림에서 주어진 조건으로 미지수 추적', en: ['Data & Statistics Type 02: Torn Stem-and-Leaf Plot', 'Deduce hidden leaves from given totals, percentages, or conditions'], make: rpmDataTornStemLeafPlot },
  { id: 'applied-data-frequency-table-basic-terms', label: '[자료와 통계 응용 03] 도수분포표 기본 용어 및 계급값', description: '변량, 계급, 계급의 크기, 계급값, 도수의 뜻과 계산', en: ['Data & Statistics Type 03: Frequency Table Basic Terms & Class Marks', 'Concepts and calculations of class intervals, widths, class marks, and frequencies'], make: rpmDataFrequencyTableBasicTerms },
  { id: 'applied-data-frequency-table-missing-freq', label: '[자료와 통계 응용 04] 도수분포표에서 미지수 도수 구하기', description: '도수의 총합 및 비율 조건을 이용하여 표에서 지워진 계급의 도수 계산', en: ['Data & Statistics Type 04: Finding Missing Frequencies in Tables', 'Calculate missing frequencies using total frequency and percentage conditions'], make: rpmDataFrequencyTableMissingFreq },
  { id: 'applied-data-histogram-rectangle-area', label: '[자료와 통계 응용 05] 히스토그램 직사각형의 넓이', description: '(직사각형 넓이의 합) = (계급의 크기) × (도수의 총합) 성질을 이용한 넓이 계산', en: ['Data & Statistics Type 05: Histogram Rectangle Areas', 'Calculate total rectangle area = class width × total frequency'], make: rpmDataHistogramRectangleArea },
  { id: 'applied-data-torn-histogram', label: '[자료와 통계 응용 06] 일부가 찢어진 히스토그램', description: '직사각형 일부가 찢어진 히스토그램에서 백분율 조건을 이용한 지워진 도수 추적', en: ['Data & Statistics Type 06: Torn Histogram Reconstruction', 'Find missing bar heights using total frequency and percentage clues'], make: rpmDataTornHistogram },
  { id: 'applied-data-frequency-polygon-structure', label: '[자료와 통계 응용 07] 도수분포다각형의 작성과 성질', description: '계급값 위의 점 연결, 양 끝 도수 0인 계급 추가, 참/거짓 개념 판별', en: ['Data & Statistics Type 07: Frequency Polygon Properties', 'True/False conceptual properties of frequency polygons and connecting midpoints'], make: rpmDataFrequencyPolygonStructure },
  { id: 'applied-data-frequency-polygon-area', label: '[자료와 통계 응용 08] 도수분포다각형과 가로축 둘러싸인 넓이', description: '도수분포다각형과 가로축으로 둘러싸인 부분의 넓이 = (계급의 크기) × (도수의 총합)', en: ['Data & Statistics Type 08: Frequency Polygon Enclosed Area', 'Enclosed area with horizontal axis = class width × total frequency'], make: rpmDataFrequencyPolygonArea },
  { id: 'applied-data-torn-frequency-polygon', label: '[자료와 통계 응용 09] 일부가 보이지 않는 도수분포다각형', description: '잉크가 묻거나 찢어져 가려진 점의 도수를 전체 도수 합으로부터 역산', en: ['Data & Statistics Type 09: Torn Frequency Polygon', 'Calculate hidden vertex frequency from total frequency sum'], make: rpmDataTornFrequencyPolygon },
  { id: 'applied-data-two-groups-polygon-compare', label: '[자료와 통계 응용 10] 두 집단의 도수분포다각형 비교', description: '오른쪽/왼쪽 치우침에 따른 두 집단의 성적·변량 분포 상태 비교 해석', en: ['Data & Statistics Type 10: Comparing Frequency Polygons of Two Groups', 'Interpret relative performance and distribution shifts between two groups'], make: rpmDataTwoGroupsPolygonCompare },
  { id: 'applied-data-relative-frequency-concept', label: '[자료와 통계 응용 11] 상대도수의 뜻과 성질', description: '상대도수 = (도수) / (도수의 총합), 총합은 항상 1, 도수에 정비례하는 성질', en: ['Data & Statistics Type 11: Relative Frequency Definition & Properties', 'Relative frequency = frequency / total; sum equals 1; directly proportional'], make: rpmDataRelativeFrequencyConcept },
  { id: 'applied-data-relative-frequency-table-calc', label: '[자료와 통계 응용 12] 도수분포표 상대도수 계산 및 역추적', description: '상대도수와 도수의 총합을 이용하여 특정 계급의 도수 역계산', en: ['Data & Statistics Type 12: Calculating Relative Frequency & Reversing Frequencies', 'Compute frequency = relative frequency × total frequency'], make: rpmDataRelativeFrequencyTableCalc },
  { id: 'applied-data-torn-relative-frequency-table', label: '[자료와 통계 응용 13] 일부가 찢어진 상대도수 분포표', description: '빈칸 A, B가 있는 상대도수 분포표에서 총합 1과 비례 관계를 이용한 빈칸 완성', en: ['Data & Statistics Type 13: Torn Relative Frequency Table', 'Determine missing values A and B using total sum 1 and proportions'], make: rpmDataTornRelativeFrequencyTable },
  { id: 'applied-data-two-groups-relative-freq-ratio', label: '[자료와 통계 응용 14] 도수 총합이 다른 두 집단의 상대도수 비교', description: '두 집단의 도수의 총합의 비와 특정 계급의 도수의 비로부터 상대도수의 비 계산', en: ['Data & Statistics Type 14: Relative Frequency Ratio of Two Groups', 'Find ratio of relative frequencies from ratio of totals and ratio of frequencies'], make: rpmDataTwoGroupsRelativeFreqRatio },
  { id: 'applied-data-relative-frequency-graph-area', label: '[자료와 통계 응용 15] 상대도수 그래프와 가로축 둘러싸인 넓이', description: '상대도수의 분포를 나타낸 다각형과 가로축으로 둘러싸인 부분의 넓이 = 계급의 크기', en: ['Data & Statistics Type 15: Relative Frequency Polygon Enclosed Area', 'Area enclosed by relative frequency polygon and axis = class width × 1'], make: rpmDataRelativeFrequencyGraphArea },
  { id: 'applied-data-two-groups-relative-freq-compare', label: '[자료와 통계 응용 16] 두 집단의 상대도수 그래프 비교 (실력UP)', description: '도수의 총합이 서로 다른 두 집단의 분포 상태 비교 시 상대도수 그래프 활용', en: ['Data & Statistics Type 16: Advanced Comparison of Relative Frequency Distributions', 'Compare distribution shapes between groups with unequal sample sizes'], make: rpmDataTwoGroupsRelativeFreqCompare },
  { id: 'applied-data-statistics-all-mixed', label: '[자료와 통계 종합] 자료의 정리와 해석 전 유형 실전 혼합', description: '줄기와 잎, 도수분포표, 히스토그램, 도수분포다각형, 상대도수 전 16개 핵심 유형 무작위 실전 세트', en: ['Data & Statistics Comprehensive: All 16 Types Mixed', 'Randomized practice set covering all 16 data collection and representation types'], make: rpmDataStatisticsAllMixed },
];

export const RPM_GRADE7_FINAL_MOCK_UNITS = [
  { id: 'applied-grade7-semester-two-final-exam', label: '[중1-2 최종총괄] 중학 1-2 전 범위 최종 실전 모의고사', description: '기본도형, 위치관계, 작도합동, 평면도형, 입체도형, 통계 등 중학 1-2 전 범위 총괄 실전 모의고사', en: ['Grade 7-2 Comprehensive Final Examination', 'Ultimate comprehensive mock exam covering all chapters of Grade 7 Semester 2 (Basic Figures, Relations, Congruence, Polygons, Circles, Solids, Statistics)'], make: rpmGrade7SemesterTwoFinalExam },
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
  ...RPM_POLYGONS_APPLIED_UNITS,
  ...RPM_CIRCLES_SECTORS_APPLIED_UNITS,
  ...RPM_PLANE_FIGURES_MOCK_UNITS,
  ...RPM_POLYHEDRA_REVOLUTION_APPLIED_UNITS,
  ...RPM_SOLIDS_MEASURES_APPLIED_UNITS,
  ...RPM_SOLID_FIGURES_MOCK_UNITS,
  ...RPM_DATA_STATISTICS_APPLIED_UNITS,
  ...RPM_GRADE7_FINAL_MOCK_UNITS,
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
