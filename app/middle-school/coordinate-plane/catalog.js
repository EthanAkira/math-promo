function randomInt(random, min, max) {
  return Math.floor(random() * (max - min + 1)) + min;
}

function pick(random, values) {
  return values[randomInt(random, 0, values.length - 1)];
}

function nonZeroInt(random, min, max) {
  let value;
  do value = randomInt(random, min, max); while (value === 0);
  return value;
}

function pair(x, y) {
  return `(${x}, ${y})`;
}

function problem(prompt, expression, answer, extra = {}) {
  return { prompt, expression, answer: String(answer), answerSuffix: '', ...extra };
}

const QUADRANT_CHOICES_KO = ['① 제1사분면', '② 제2사분면', '③ 제3사분면', '④ 제4사분면', '⑤ 어느 사분면에도 속하지 않는다'];
const QUADRANT_CHOICES_EN = ['① Quadrant I', '② Quadrant II', '③ Quadrant III', '④ Quadrant IV', '⑤ Not in any quadrant'];
const POINT_LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];

// ---- 08-1 순서쌍과 좌표 ----

function orderedPairCondition(random) {
  const mode = randomInt(random, 0, 3);
  if (mode === 0) {
    const x = nonZeroInt(random, -9, 9);
    const y = nonZeroInt(random, -9, 9);
    return problem(`x좌표가 ${x}, y좌표가 ${y}인 점 P의 좌표를 구하세요.`, '', pair(x, y), { promptEn: `Find the coordinates of point P whose x-coordinate is ${x} and y-coordinate is ${y}.` });
  }
  if (mode === 1) {
    const x = nonZeroInt(random, -9, 9);
    return problem(`x축 위에 있고, x좌표가 ${x}인 점 P의 좌표를 구하세요.`, '', pair(x, 0), { promptEn: `Find the coordinates of point P on the x-axis whose x-coordinate is ${x}.` });
  }
  if (mode === 2) {
    const y = nonZeroInt(random, -9, 9);
    return problem(`y축 위에 있고, y좌표가 ${y}인 점 P의 좌표를 구하세요.`, '', pair(0, y), { promptEn: `Find the coordinates of point P on the y-axis whose y-coordinate is ${y}.` });
  }
  return problem('원점 O의 좌표를 구하세요.', '', pair(0, 0), { promptEn: 'Find the coordinates of the origin O.' });
}

function randomPlanePoints(random, count) {
  const points = [];
  const used = new Set();
  let guard = 0;
  while (points.length < count && guard < 200) {
    guard += 1;
    const onAxis = random() < 0.25;
    let x = randomInt(random, -5, 5);
    let y = randomInt(random, -5, 5);
    if (onAxis) { if (random() < 0.5) y = 0; else x = 0; }
    if (x === 0 && y === 0) continue;
    const key = `${x},${y}`;
    if (used.has(key)) continue;
    used.add(key);
    points.push({ x, y, label: POINT_LABELS[points.length] });
  }
  return points;
}

function planePointRead(random) {
  const points = randomPlanePoints(random, randomInt(random, 3, 4));
  const target = pick(random, points);
  return problem(`좌표평면 위의 점 ${target.label}의 좌표를 구하세요.`, '', pair(target.x, target.y), { kind: 'coordinate-plane', plane: { points, highlight: target.label }, promptEn: `Find the coordinates of point ${target.label}.` });
}

function planePointFind(random) {
  const points = randomPlanePoints(random, 4);
  const target = pick(random, points);
  return problem(`다음 좌표를 나타내는 점의 기호를 구하세요. ${pair(target.x, target.y)}`, '', target.label, { kind: 'coordinate-plane', plane: { points, highlight: '' }, promptEn: `Which point has the coordinates ${pair(target.x, target.y)}?` });
}

// ---- 08-2 사분면과 대칭인 점의 좌표 ----

function quadrantOf(x, y) {
  if (x === 0 || y === 0) return 5;
  if (x > 0 && y > 0) return 1;
  if (x < 0 && y > 0) return 2;
  if (x < 0 && y < 0) return 3;
  return 4;
}

function quadrantIdentify(random) {
  const onAxis = random() < 0.18;
  let x = nonZeroInt(random, -12, 12);
  let y = nonZeroInt(random, -12, 12);
  if (onAxis) { if (random() < 0.5) x = 0; else y = 0; }
  const answer = quadrantOf(x, y);
  return problem(`점 ${pair(x, y)}는 제 몇 사분면 위의 점인지 구하세요.`, '', String(answer), { kind: 'choice', choicesKo: QUADRANT_CHOICES_KO, choicesEn: QUADRANT_CHOICES_EN, promptEn: `Which quadrant is the point ${pair(x, y)} in?` });
}

function quadrantFromSign(random) {
  const options = [['>', '>', 1], ['<', '>', 2], ['<', '<', 3], ['>', '<', 4]];
  const [signX, signY, answer] = pick(random, options);
  return problem(`a ${signX} 0, b ${signY} 0일 때, 점 (a, b)는 제 몇 사분면 위의 점인지 구하세요.`, '', String(answer), { kind: 'choice', choicesKo: QUADRANT_CHOICES_KO.slice(0, 4), choicesEn: QUADRANT_CHOICES_EN.slice(0, 4), promptEn: `If a ${signX} 0 and b ${signY} 0, which quadrant is the point (a, b) in?` });
}

function quadrantOfSigns(signX, signY) {
  if (signX > 0 && signY > 0) return 1;
  if (signX < 0 && signY > 0) return 2;
  if (signX < 0 && signY < 0) return 3;
  return 4;
}

function quadrantTransform(random) {
  const quadrant = randomInt(random, 1, 4);
  const signX = quadrant === 1 || quadrant === 4 ? 1 : -1;
  const signY = quadrant === 1 || quadrant === 2 ? 1 : -1;
  const transforms = [
    { expr: '(−a, b)', signX: -signX, signY },
    { expr: '(a, −b)', signX, signY: -signY },
    { expr: '(−a, −b)', signX: -signX, signY: -signY },
    { expr: '(b, a)', signX: signY, signY: signX },
    { expr: '(−b, −a)', signX: -signY, signY: -signX },
    { expr: '(b, −a)', signX: signY, signY: -signX },
    { expr: '(−b, a)', signX: -signY, signY: signX },
  ];
  const chosen = pick(random, transforms);
  const answer = quadrantOfSigns(chosen.signX, chosen.signY);
  const exprEn = chosen.expr.replace(/−/g, '-');
  return problem(`점 (a, b)가 제${quadrant}사분면 위의 점일 때, 점 ${chosen.expr}는 제 몇 사분면 위의 점인지 구하세요.`, '', String(answer), { kind: 'choice', choicesKo: QUADRANT_CHOICES_KO.slice(0, 4), choicesEn: QUADRANT_CHOICES_EN.slice(0, 4), promptEn: `If (a, b) is in Quadrant ${quadrant}, which quadrant is ${exprEn} in?` });
}

function symmetricPoints(random) {
  const x = nonZeroInt(random, -9, 9);
  const y = nonZeroInt(random, -9, 9);
  const mode = randomInt(random, 0, 2);
  if (mode === 0) return problem(`점 ${pair(x, y)}에 대하여 x축에 대칭인 점의 좌표를 구하세요.`, '', pair(x, -y), { promptEn: `Find the point symmetric to ${pair(x, y)} about the x-axis.` });
  if (mode === 1) return problem(`점 ${pair(x, y)}에 대하여 y축에 대칭인 점의 좌표를 구하세요.`, '', pair(-x, y), { promptEn: `Find the point symmetric to ${pair(x, y)} about the y-axis.` });
  return problem(`점 ${pair(x, y)}에 대하여 원점에 대칭인 점의 좌표를 구하세요.`, '', pair(-x, -y), { promptEn: `Find the point symmetric to ${pair(x, y)} about the origin.` });
}

// ---- 08-3 그래프와 그 해석 ----

function tripGraph(random) {
  const distance = pick(random, [2, 3, 4, 5, 6]);
  const arrive = pick(random, [20, 30, 40, 50, 60]);
  const stay = pick(random, [20, 30, 40, 50, 60]);
  let returnTime;
  do returnTime = pick(random, [10, 20, 30, 40]); while (returnTime === arrive);
  const leave = arrive + stay;
  const home = leave + returnTime;
  const graph = { arrive, leave, home, distance };
  const mode = randomInt(random, 0, 2);
  if (mode === 0) return problem('그래프는 지혜가 집에서 출발하여 목적지까지 다녀왔을 때, 집으로부터의 거리를 시간에 따라 나타낸 것입니다. 목적지에 도착한 시간은 집에서 출발한 지 몇 분 후인지 구하세요.', '', arrive, { answerSuffix: '분 후', kind: 'trip-graph', graph, promptEn: 'How many minutes after leaving home did the trip reach the destination?' });
  if (mode === 1) return problem('그래프는 지혜가 집에서 출발하여 목적지까지 다녀왔을 때, 집으로부터의 거리를 시간에 따라 나타낸 것입니다. 집에서 출발하여 다시 돌아오는 데 걸린 시간을 구하세요.', '', home, { answerSuffix: '분', kind: 'trip-graph', graph, promptEn: 'How many minutes did the whole round trip take?' });
  return problem('그래프는 지혜가 집에서 출발하여 목적지까지 다녀왔을 때, 집으로부터의 거리를 시간에 따라 나타낸 것입니다. 목적지에 몇 분 동안 머물렀는지 구하세요.', '', stay, { answerSuffix: '분', kind: 'trip-graph', graph, promptEn: 'How many minutes did the trip stay at the destination?' });
}

const mixedGenerators = [orderedPairCondition, planePointRead, planePointFind, quadrantIdentify, quadrantFromSign, symmetricPoints];

export const COORDINATE_UNITS = [
  { id: 'ordered-pair-condition', label: '순서쌍과 좌표', description: '조건을 만족하는 점의 좌표 구하기', en: ['Ordered pairs & coordinates', 'Find the coordinates of a point from given conditions'], make: orderedPairCondition },
  { id: 'plane-read-point', label: '좌표평면 위의 점의 좌표 읽기', description: '좌표평면 위에 나타낸 점의 좌표 읽기', en: ['Reading coordinates from a graph', 'Read the coordinates of a labeled point on the coordinate plane'], make: planePointRead },
  { id: 'plane-find-point', label: '좌표로 점 찾기', description: '주어진 좌표를 나타내는 점의 기호 찾기', en: ['Locating a point by coordinates', 'Find which labeled point matches given coordinates'], make: planePointFind },
  { id: 'quadrant-identify', label: '사분면 판별', description: '점의 좌표를 보고 사분면 구하기', en: ['Identifying quadrants', 'Decide which quadrant a point lies in'], make: quadrantIdentify },
  { id: 'quadrant-sign', label: '부호로 사분면 판별', description: 'x좌표, y좌표의 부호로 사분면 구하기', en: ['Quadrants from signs', 'Use the signs of x and y to find the quadrant'], make: quadrantFromSign },
  { id: 'quadrant-transform', label: '사분면 위 점의 좌표 변형', description: '점의 좌표를 변형했을 때의 사분면 구하기', en: ['Transforming quadrant points', 'Find the quadrant of a point after changing signs or swapping coordinates'], make: quadrantTransform },
  { id: 'symmetric-points', label: '대칭인 점의 좌표', description: 'x축, y축, 원점에 대칭인 점의 좌표 구하기', en: ['Symmetric points', 'Find points symmetric about the x-axis, y-axis, or origin'], make: symmetricPoints },
  { id: 'trip-graph', label: '그래프와 그 해석', description: '이동 상황을 나타낸 그래프 해석하기', en: ['Interpreting graphs', 'Read a distance-time graph of a trip'], make: tripGraph },
  { id: 'coordinate-mixed', label: '좌표와 그래프 종합', description: '좌표, 사분면, 대칭, 그래프 해석을 골고루 연습하기', en: ['Coordinates & graphs review', 'Mixed practice across coordinates, quadrants and symmetry'], make: (random) => pick(random, mixedGenerators)(random) },
];

export const RPM_COORDINATE_APPLIED_UNITS = [
  { id: 'rpm-coord-ordered-pair-equality', label: '[좌표평면 유형 01] 두 순서쌍이 서로 같을 조건', description: '두 순서쌍의 각 좌표가 같음을 이용하여 일차방정식 세워 미지수 구하기', en: ['Coordinate Plane Type 01: Equality of Ordered Pairs', 'Solve linear equations from equal ordered pairs'], make: rpmCoordOrderedPairEquality },
  { id: 'rpm-coord-axis-points', label: '[좌표평면 유형 02] x축·y축 위의 점의 좌표와 미지수', description: 'x축 위의 점(y=0), y축 위의 점(x=0) 조건을 이용하여 미지수 좌표 구하기', en: ['Coordinate Plane Type 02: Points on Coordinate Axes', 'Use x-axis (y=0) and y-axis (x=0) conditions to solve for coordinates'], make: rpmCoordAxisPoints },
  { id: 'rpm-coord-triangle-area', label: '[좌표평면 유형 03] 좌표평면 위 삼각형의 넓이', description: '좌표평면 위의 세 점을 꼭짓점으로 하는 삼각형의 넓이 구하기', en: ['Coordinate Plane Type 03: Triangle Area on Coordinate Plane', 'Calculate area of triangles from vertex coordinates'], make: rpmCoordTriangleArea },
  { id: 'rpm-coord-polygon-area', label: '[좌표평면 유형 04] 좌표평면 위 사각형과 사다리꼴의 넓이', description: '좌표축에 평행한 선분을 이용하거나 직사각형에서 뺄셈하여 다각형 넓이 구하기', en: ['Coordinate Plane Type 04: Quadrilateral & Trapezoid Area', 'Calculate area of trapezoids and quadrilaterals by partitioning or enclosing rectangles'], make: rpmCoordPolygonArea },
  { id: 'rpm-coord-quadrant-identify', label: '[좌표평면 유형 05] 사분면 판별과 좌표축 위의 점', description: '부호에 따른 제1, 2, 3, 4사분면 판별 및 좌표축 위의 점 식별', en: ['Coordinate Plane Type 05: Identifying Quadrants', 'Determine quadrants from signs and identify axis points'], make: rpmCoordQuadrantIdentify },
  { id: 'rpm-coord-quadrant-sign-condition', label: '[좌표평면 유형 06] 사분면 조건과 변형된 점의 사분면', description: '점 (a, b)가 특정 사분면일 때 변형된 점 (-ab, a+b), (-b, -a) 등이 속하는 사분면 구하기', en: ['Coordinate Plane Type 06: Transformed Points Quadrant', 'Determine quadrant of transformed points given initial quadrant conditions'], make: rpmCoordQuadrantSignCondition },
  { id: 'rpm-coord-sign-product-sum', label: '[좌표평면 유형 07] 곱과 합·차 부호 조건에 따른 사분면 판별', description: 'ab<0, a>b 또는 ab>0, a+b<0 등의 부호 조건에서 점의 사분면 구하기', en: ['Coordinate Plane Type 07: Quadrants from Product and Sum Signs', 'Find quadrant from sign constraints like ab<0, a>b, ab>0, a+b<0'], make: rpmCoordSignProductSum },
  { id: 'rpm-coord-abs-condition-quadrant', label: '[좌표평면 유형 08] 절댓값 대소 조건과 사분면 판별 심화', description: 'ab<0, |a|<|b| 또는 |a|>|b| 조건에서 점 (a+b, a-b)의 부호와 사분면 구하기', en: ['Coordinate Plane Type 08: Quadrants with Absolute Value Inequalities', 'Analyze signs of sums and differences with absolute value comparisons'], make: rpmCoordAbsConditionQuadrant },
  { id: 'rpm-coord-symmetric-points', label: '[좌표평면 유형 09] 대칭인 점의 좌표와 미지수 결정', description: 'x축 대칭, y축 대칭, 원점 대칭 조건을 이용하여 미지수 구하기', en: ['Coordinate Plane Type 09: Symmetric Points & Parameters', 'Solve coordinate equations using reflections across axes or the origin'], make: rpmCoordSymmetricPoints },
  { id: 'rpm-coord-symmetric-area', label: '[좌표평면 유형 10] 대칭점들로 이루어진 도형의 넓이', description: '한 점과 그 점을 대칭이동한 점들로 이루어지는 직각삼각형의 넓이 계산하기', en: ['Coordinate Plane Type 10: Area from Symmetric Points', 'Compute areas of triangles formed by reflected points'], make: rpmCoordSymmetricArea },
  { id: 'rpm-coord-graph-situation', label: '[좌표평면 유형 11] 상황에 알맞은 변화 그래프의 이해', description: '물 채우기, 향 타기, 일정한 속력 등 실생활 상황에 따른 그래프 개형 파악하기', en: ['Coordinate Plane Type 11: Graphing Real-world Situations', 'Match real scenarios with rate-of-change curves'], make: rpmCoordGraphSituation },
  { id: 'rpm-coord-graph-distance-time', label: '[좌표평면 유형 12] 이동 거리-시간 그래프 정밀 분석', description: '거리-시간 그래프에서 도착 시각, 체류 시간, 반환점, 총 소요 시간 해석하기', en: ['Coordinate Plane Type 12: Distance-Time Graph Analysis', 'Extract arrival time, stay duration, turnaround point, and total trip time'], make: rpmCoordGraphDistanceTime },
  { id: 'rpm-coord-graph-speed-time', label: '[좌표평면 유형 13] 속력-시간 그래프 및 운행 분석', description: '속력-시간 그래프에서 최고 속력, 정지 시간, 가속/감속 구간 분석하기', en: ['Coordinate Plane Type 13: Speed-Time Graph Analysis', 'Determine max speed, stopping duration, and acceleration phases from speed profiles'], make: rpmCoordGraphSpeedTime },
  { id: 'rpm-coord-all-types-mixed', label: '[단원 실전 다지기] 매일 좌표평면과 그래프 종합', description: '순서쌍, 축 위의 점, 사분면, 부호 조건, 대칭, 넓이, 그래프 해석 전 유형 종합 출제', en: ['Daily Coordinate Plane Comprehensive', 'Comprehensive mixed practice covering all coordinate plane and graph types'], make: rpmCoordAllTypesMixed },
  { id: 'rpm-semester-one-mock-exam', label: '[1학기 총괄평가] 매일 중학 1-1 전 범위 실전 모의고사 (소인수분해~반비례)', description: '소인수분해, 정수와 유리수, 일차방정식, 좌표평면, 정비례·반비례 전 단원 실전 모의고사', en: ['Semester 1 Final Review Mock Exam', 'Comprehensive mock exam across all Grade 7 Semester 1 chapters'], make: rpmSemesterOneMockExam },
];

export const COORDINATE_ALL_UNITS = [...COORDINATE_UNITS, ...RPM_COORDINATE_APPLIED_UNITS];

export function findCoordinateUnit(unitId) {
  return COORDINATE_ALL_UNITS.find((unit) => unit.id === unitId) || COORDINATE_UNITS[0];
}

export function localizeCoordinateUnit(unit, language, field = 'label') {
  if (language === 'ko') return unit[field];
  return localizeRegionalUnit(unit.id, language, unit.en[field === 'label' ? 0 : 1], field);
}
import { localizeRegionalUnit } from '../../regionalCatalog.js';
import {
  rpmCoordOrderedPairEquality,
  rpmCoordAxisPoints,
  rpmCoordTriangleArea,
  rpmCoordPolygonArea,
  rpmCoordQuadrantIdentify,
  rpmCoordQuadrantSignCondition,
  rpmCoordSignProductSum,
  rpmCoordAbsConditionQuadrant,
  rpmCoordSymmetricPoints,
  rpmCoordSymmetricArea,
  rpmCoordGraphSituation,
  rpmCoordGraphDistanceTime,
  rpmCoordGraphSpeedTime,
  rpmCoordAllTypesMixed,
  rpmSemesterOneMockExam,
} from '../rpmAppliedEngine.js';
