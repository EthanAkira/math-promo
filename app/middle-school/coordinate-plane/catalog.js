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

export function findCoordinateUnit(unitId) {
  return COORDINATE_UNITS.find((unit) => unit.id === unitId) || COORDINATE_UNITS[0];
}

export function localizeCoordinateUnit(unit, language, field = 'label') {
  if (language === 'ko') return unit[field];
  return unit.en[field === 'label' ? 0 : 1];
}
