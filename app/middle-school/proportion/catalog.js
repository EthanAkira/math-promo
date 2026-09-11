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

function problem(prompt, expression, answer, extra = {}) {
  return { prompt, expression, answer: String(answer), answerSuffix: '', ...extra };
}

function divisorsOf(value) {
  const abs = Math.abs(value);
  const divs = [];
  for (let divisor = 1; divisor <= abs; divisor += 1) if (abs % divisor === 0) divs.push(divisor);
  return divs;
}

function coeffText(n, d) {
  if (n === d) return 'x';
  if (n === -d) return '-x';
  return d === 1 ? `${n}x` : `${n}/${d}x`;
}

const SLOPES = [[1, 1], [2, 1], [3, 1], [-1, 1], [-2, 1], [-3, 1], [1, 2], [-1, 2], [1, 3], [-1, 3], [2, 3], [-2, 3], [3, 2], [-3, 2]];
const PROPORTION_CHOICES_KO = ['① 그렇다 (○)', '② 아니다 (×)'];
const PROPORTION_CHOICES_EN = ['① Yes (○)', '② No (×)'];

// ---- 09-1, 09-2 정비례 ----

function directRelationFromPair(random) {
  const [n, d] = pick(random, SLOPES);
  const mult = pick(random, [1, 2]);
  const sign = pick(random, [1, -1]);
  const x0 = d * mult * sign;
  const y0 = n * mult * sign;
  return problem(`y가 x에 정비례하고 x=${x0}일 때 y=${y0}이다. x와 y 사이의 관계식을 구하세요.`, '', `y=${coeffText(n, d)}`, { promptEn: `y is directly proportional to x. If x=${x0} then y=${y0}. Find the equation relating x and y.` });
}

function directClassify(random) {
  const a = pick(random, [2, 3, 4, 5, 6, 7, 8, 9, -2, -3, -4, -5]);
  const b = pick(random, [1, 2, 3, 4, 5, -1, -2, -3]);
  const forms = [
    { text: `y=${a}x`, direct: true },
    { text: `y=x/${Math.abs(a)}`, direct: true },
    { text: `y=-x/${Math.abs(a)}`, direct: true },
    { text: `y=${a}x${b >= 0 ? '+' : '-'}${Math.abs(b)}`, direct: false },
    { text: `y=${a}/x`, direct: false },
    { text: `xy=${a}`, direct: false },
    { text: `y=${a}x^2`, direct: false },
  ];
  const chosen = pick(random, forms);
  return problem('다음 식에서 y가 x에 정비례하는지 판별하세요.', chosen.text, chosen.direct ? '1' : '2', { kind: 'choice', choicesKo: PROPORTION_CHOICES_KO, choicesEn: PROPORTION_CHOICES_EN, promptEn: 'Decide whether y is directly proportional to x.' });
}

function directEvaluate(random) {
  const a = pick(random, [2, 3, 4, 5, -2, -3, -4, -5, 6, -6]);
  const x = nonZeroInt(random, -8, 8);
  const y = a * x;
  if (random() < 0.5) return problem(`y=${a}x일 때, x=${x}이면 y의 값을 구하세요.`, '', y, { promptEn: `If y=${a}x and x=${x}, find y.` });
  return problem(`y=${a}x일 때, y=${y}이면 x의 값을 구하세요.`, '', x, { promptEn: `If y=${a}x and y=${y}, find x.` });
}

function directGraph(random) {
  const [n, d] = pick(random, SLOPES);
  const mult = pick(random, [1, 2]);
  const sign = pick(random, [1, -1]);
  const x0 = d * mult * sign;
  const y0 = n * mult * sign;
  return problem('그래프가 원점을 지나는 직선일 때, x와 y 사이의 관계식을 구하세요.', '', `y=${coeffText(n, d)}`, { kind: 'proportion-graph', graph: { mode: 'direct', a: { n, d }, point: { x: x0, y: y0 }, range: 8 }, promptEn: 'The graph is a line through the origin. Find the equation relating x and y.' });
}

// ---- 09-3, 09-4 반비례 ----

function inverseRelationFromPair(random) {
  const values = [1, 2, 3, 4, 6, -1, -2, -3, -4, -6];
  const x0 = pick(random, values);
  const y0 = pick(random, values);
  const a = x0 * y0;
  return problem(`y가 x에 반비례하고 x=${x0}일 때 y=${y0}이다. x와 y 사이의 관계식을 구하세요.`, '', `y=${a}/x`, { promptEn: `y is inversely proportional to x. If x=${x0} then y=${y0}. Find the equation relating x and y.` });
}

function inverseClassify(random) {
  const a = pick(random, [4, 6, 8, 9, 10, 12, -4, -6, -8, -9]);
  const b = pick(random, [1, 2, 3, -1, -2]);
  const forms = [
    { text: `y=${a}/x`, inverse: true },
    { text: `xy=${a}`, inverse: true },
    { text: `y=${a}x`, inverse: false },
    { text: `y=x/${Math.abs(a)}`, inverse: false },
    { text: `y=${a}/x${b >= 0 ? '+' : '-'}${Math.abs(b)}`, inverse: false },
    { text: `y=${a}x${b >= 0 ? '+' : '-'}${Math.abs(b)}`, inverse: false },
  ];
  const chosen = pick(random, forms);
  return problem('다음 식에서 y가 x에 반비례하는지 판별하세요.', chosen.text, chosen.inverse ? '1' : '2', { kind: 'choice', choicesKo: PROPORTION_CHOICES_KO, choicesEn: PROPORTION_CHOICES_EN, promptEn: 'Decide whether y is inversely proportional to x.' });
}

function inverseEvaluate(random) {
  const a = pick(random, [12, -12, 18, -18, 24, -24, 20, -20, 16, -16, 30, -30, 36, -36]);
  const x = pick(random, divisorsOf(a)) * pick(random, [1, -1]);
  const y = a / x;
  if (random() < 0.5) return problem(`y=${a}/x일 때, x=${x}이면 y의 값을 구하세요.`, '', y, { promptEn: `If y=${a}/x and x=${x}, find y.` });
  return problem(`y=${a}/x일 때, y=${y}이면 x의 값을 구하세요.`, '', x, { promptEn: `If y=${a}/x and y=${y}, find x.` });
}

function inverseGraph(random) {
  const values = [1, 2, 3, 4, -1, -2, -3, -4];
  const x0 = pick(random, values);
  const y0 = pick(random, values);
  const a = x0 * y0;
  return problem('그래프가 원점에 대하여 대칭인 한 쌍의 매끄러운 곡선일 때, x와 y 사이의 관계식을 구하세요.', '', `y=${a}/x`, { kind: 'proportion-graph', graph: { mode: 'inverse', a, point: { x: x0, y: y0 }, range: 8 }, promptEn: 'The graph is a pair of smooth curves symmetric about the origin. Find the equation relating x and y.' });
}

// ---- 09-5 정비례, 반비례 관계의 활용 ----

function proportionApplication(random) {
  const scenarios = [
    () => {
      const rate = pick(random, [2, 3, 4, 5]);
      if (random() < 0.5) return problem(`매분 ${rate}L의 물이 나오는 정수기가 있다. x분 후 나온 물의 양을 yL라 할 때, x와 y 사이의 관계식을 구하세요.`, '', `y=${rate}x`, { promptEn: `Water flows at ${rate} L per minute. Write the equation relating minutes x and liters y.` });
      const minutes = randomInt(random, 2, 12);
      const liters = rate * minutes;
      return problem(`매분 ${rate}L의 물이 나오는 정수기에서 ${liters}L의 물이 나오려면 몇 분이 걸리는지 구하세요.`, '', minutes, { answerSuffix: '분', promptEn: `How many minutes to collect ${liters} L at ${rate} L per minute?` });
    },
    () => {
      const price = pick(random, [500, 800, 1000, 1200, 1500]);
      if (random() < 0.5) return problem(`한 개에 ${price}원인 과자 x개의 가격을 y원이라 할 때, x와 y 사이의 관계식을 구하세요.`, '', `y=${price}x`, { promptEn: `Each snack costs ${price} won. Write the equation relating the number bought x and the total price y.` });
      const count = randomInt(random, 2, 10);
      const total = price * count;
      return problem(`한 개에 ${price}원인 과자를 ${total}원어치 샀습니다. 몇 개를 샀는지 구하세요.`, '', count, { answerSuffix: '개', promptEn: `Snacks cost ${price} won each; ${total} won was spent. How many were bought?` });
    },
    () => {
      const totalItems = pick(random, [24, 36, 48, 60, 72, 84, 96]);
      const divs = divisorsOf(totalItems).filter((value) => value >= 2 && value <= 20);
      if (random() < 0.5) return problem(`귤 ${totalItems}개를 x명에게 남김없이 똑같이 나누어 줄 때, 한 명이 받는 귤의 개수를 y개라 하자. x와 y 사이의 관계식을 구하세요.`, '', `y=${totalItems}/x`, { promptEn: `${totalItems} tangerines are shared equally among x people, y each. Write the equation relating x and y.` });
      const people = pick(random, divs);
      const each = totalItems / people;
      return problem(`귤 ${totalItems}개를 ${people}명에게 남김없이 똑같이 나누어 줄 때, 한 명이 받는 귤의 개수를 구하세요.`, '', each, { answerSuffix: '개', promptEn: `${totalItems} tangerines shared equally among ${people} people: how many does each person get?` });
    },
    () => {
      const area = pick(random, [12, 18, 24, 30, 36, 48, 60]);
      const divs = divisorsOf(area).filter((value) => value >= 2 && value <= area / 2);
      if (random() < 0.5) return problem(`넓이가 ${area}cm²로 일정한 직사각형의 가로의 길이를 x cm, 세로의 길이를 y cm라 하자. x와 y 사이의 관계식을 구하세요.`, '', `y=${area}/x`, { promptEn: `A rectangle has a fixed area of ${area} cm². Write the equation relating width x and height y.` });
      const width = pick(random, divs);
      const height = area / width;
      return problem(`넓이가 ${area}cm²로 일정한 직사각형의 가로의 길이가 ${width}cm일 때, 세로의 길이를 구하세요.`, '', height, { answerSuffix: 'cm', promptEn: `A rectangle with area ${area} cm² has width ${width} cm. Find the height.` });
    },
    () => {
      const distance = pick(random, [60, 80, 90, 100, 120, 150, 180]);
      const divs = divisorsOf(distance).filter((value) => value >= 2 && value <= distance / 2);
      if (random() < 0.5) return problem(`두 지점 사이의 거리가 ${distance}km이다. 시속 x km로 이동할 때 걸리는 시간을 y시간이라 하자. x와 y 사이의 관계식을 구하세요.`, '', `y=${distance}/x`, { promptEn: `The distance between two points is ${distance} km. Write the equation relating speed x (km/h) and time y (hours).` });
      const speed = pick(random, divs);
      const time = distance / speed;
      return problem(`거리가 ${distance}km인 두 지점을 시속 ${speed}km로 이동할 때 걸리는 시간을 구하세요.`, '', time, { answerSuffix: '시간', promptEn: `Distance ${distance} km at ${speed} km/h: find the travel time.` });
    },
  ];
  return pick(random, scenarios)();
}

const mixedGenerators = [directRelationFromPair, directClassify, directEvaluate, inverseRelationFromPair, inverseClassify, inverseEvaluate, proportionApplication];

export const PROPORTION_UNITS = [
  { id: 'direct-relation', label: '정비례 관계식 구하기', description: '조건을 만족하는 정비례 관계식 y=ax 구하기', en: ['Direct proportion equations', 'Find y=ax from a given x, y pair'], make: directRelationFromPair },
  { id: 'direct-classify', label: '정비례 관계 판별', description: '식을 보고 정비례 관계인지 판별하기', en: ['Identifying direct proportion', 'Decide whether an equation is a direct proportion'], make: directClassify },
  { id: 'direct-evaluate', label: '정비례 관계식의 값', description: '정비례 관계식에서 x, y의 값 구하기', en: ['Evaluating direct proportion', 'Find x or y from a direct proportion equation'], make: directEvaluate },
  { id: 'direct-graph', label: '정비례 관계의 그래프', description: '원점을 지나는 직선 그래프에서 관계식 구하기', en: ['Graphs of direct proportion', 'Find the equation from a line through the origin'], make: directGraph },
  { id: 'inverse-relation', label: '반비례 관계식 구하기', description: '조건을 만족하는 반비례 관계식 y=a/x 구하기', en: ['Inverse proportion equations', 'Find y=a/x from a given x, y pair'], make: inverseRelationFromPair },
  { id: 'inverse-classify', label: '반비례 관계 판별', description: '식을 보고 반비례 관계인지 판별하기', en: ['Identifying inverse proportion', 'Decide whether an equation is an inverse proportion'], make: inverseClassify },
  { id: 'inverse-evaluate', label: '반비례 관계식의 값', description: '반비례 관계식에서 x, y의 값 구하기', en: ['Evaluating inverse proportion', 'Find x or y from an inverse proportion equation'], make: inverseEvaluate },
  { id: 'inverse-graph', label: '반비례 관계의 그래프', description: '한 쌍의 매끄러운 곡선 그래프에서 관계식 구하기', en: ['Graphs of inverse proportion', 'Find the equation from a pair of smooth curves'], make: inverseGraph },
  { id: 'proportion-application', label: '정비례, 반비례의 활용', description: '실생활 상황을 정비례·반비례 관계식으로 나타내고 활용하기', en: ['Applications', 'Model real situations with direct and inverse proportion'], make: proportionApplication },
  { id: 'proportion-mixed', label: '정비례와 반비례 종합', description: '정비례·반비례의 판별, 관계식, 활용을 골고루 연습하기', en: ['Proportion review', 'Mixed practice across direct and inverse proportion'], make: (random) => pick(random, mixedGenerators)(random) },
];

export const RPM_PROPORTION_APPLIED_UNITS = [
  { id: 'applied-prop-direct-identify', label: '[정비례 반비례 유형 01] 정비례 관계의 식별 (식과 문장제)', description: 'y=ax (a≠0) 관계식 판별 및 두 양 사이의 정비례 관계 문장제 식별', en: ['Proportion Type 01: Identifying Direct Proportion', 'Recognize y=ax and real-world direct proportion scenarios'], make: rpmPropDirectIdentify },
  { id: 'applied-prop-direct-table', label: '[정비례 반비례 유형 02] 정비례 관계의 표와 관계식 y=ax', description: '표의 x, y 대응 관계를 파악하여 정비례 상수 a 구하고 미지수 값 계산하기', en: ['Proportion Type 02: Direct Proportion Tables & Equations', 'Find constant of proportionality a from table and evaluate missing values'], make: rpmPropDirectTable },
  { id: 'applied-prop-direct-graph-properties', label: '[정비례 반비례 유형 03] 정비례 그래프 y=ax의 성질', description: '원점을 지나는 직선, a의 부호에 따른 지나는 사분면과 증가·감소 성질', en: ['Proportion Type 03: Properties of Direct Proportion Graphs', 'Analyze slope, passing quadrants, and increase/decrease behavior of y=ax'], make: rpmPropDirectGraphProperties },
  { id: 'applied-prop-direct-slope-axis-distance', label: '[정비례 반비례 유형 04] 정비례 그래프의 기울기와 축에 가까운 정도', description: '|a|의 크기가 클수록 y축에 가깝고, 작을수록 x축에 가까운 성질 비교하기', en: ['Proportion Type 04: Slope Steepness & Axis Proximity', 'Compare |a| magnitude to determine proximity to x-axis and y-axis'], make: rpmPropDirectSlopeAxisDistance },
  { id: 'applied-prop-direct-point-on-graph', label: '[정비례 반비례 유형 05] 정비례 그래프 위의 점과 미지수 좌표', description: 'y=ax의 그래프가 점 (p, q)를 지날 때 상수 a 및 다른 점의 미지수 좌표 구하기', en: ['Proportion Type 05: Points on Direct Proportion Lines', 'Solve for unknown coordinates by substituting given points into y=ax'], make: rpmPropDirectPointOnGraph },
  { id: 'applied-prop-direct-find-equation', label: '[정비례 반비례 유형 06] 그래프에서 정비례 관계식 y=ax 구하기', description: '원점을 지나는 직선 위의 한 점의 좌표를 읽어 정비례 관계식 유도하기', en: ['Proportion Type 06: Finding Direct Proportion from Graph', 'Determine y=ax from a labeled point on a line through the origin'], make: rpmPropDirectFindEquation },
  { id: 'applied-prop-direct-graph-area', label: '[정비례 반비례 유형 07] 정비례 그래프와 도형의 넓이', description: '직선 위의 점과 수선의 발, 원점으로 이루어진 직각삼각형의 넓이 구하기', en: ['Proportion Type 07: Geometry & Area in Direct Proportion', 'Calculate triangle areas bounded by the line, axis perpendiculars, and origin'], make: rpmPropDirectGraphArea },
  { id: 'applied-prop-inverse-identify', label: '[정비례 반비례 유형 08] 반비례 관계의 식별 (식과 문장제)', description: 'y=a/x 또는 xy=a (a≠0) 식별 및 곱이 일정한 실생활 반비례 문장제 파악', en: ['Proportion Type 08: Identifying Inverse Proportion', 'Identify y=a/x and real situations where product of two quantities is constant'], make: rpmPropInverseIdentify },
  { id: 'applied-prop-inverse-table', label: '[정비례 반비례 유형 09] 반비례 관계의 표와 관계식 y=a/x', description: '표에서 x와 y의 곱 xy=a가 일정함을 이용하여 빈칸 완성 및 미지수 계산', en: ['Proportion Type 09: Inverse Proportion Tables & Equations', 'Deduce y=a/x using constant product xy=a and fill missing table entries'], make: rpmPropInverseTable },
  { id: 'applied-prop-inverse-graph-properties', label: '[정비례 반비례 유형 10] 반비례 그래프 y=a/x의 성질', description: '원점에 대칭인 한 쌍의 곡선, a의 부호에 따른 사분면과 각 사분면에서의 증감', en: ['Proportion Type 10: Properties of Inverse Proportion Curves', 'Analyze hyperbolas symmetric about origin, quadrants, and monotonic intervals'], make: rpmPropInverseGraphProperties },
  { id: 'applied-prop-inverse-origin-distance', label: '[정비례 반비례 유형 11] 반비례 그래프와 원점에서 떨어진 거리', description: '|a|의 값이 클수록 원점에서 멀어지고, 작을수록 원점에 가까운 성질 비교', en: ['Proportion Type 11: Distance from Origin in Inverse Curves', 'Compare |a| values to determine which hyperbola is furthest from origin'], make: rpmPropInverseOriginDistance },
  { id: 'applied-prop-inverse-point-on-graph', label: '[정비례 반비례 유형 12] 반비례 그래프 위의 점과 미지수 좌표', description: 'y=a/x 그래프가 점 (p, q)를 지날 때 곱 xy=a로 미지수 좌표 계산하기', en: ['Proportion Type 12: Points on Inverse Proportion Hyperbolas', 'Determine constant a and solve missing coordinates using xy=a'], make: rpmPropInversePointOnGraph },
  { id: 'applied-prop-inverse-lattice-points', label: '[정비례 반비례 유형 13] 반비례 그래프 위의 정수 좌표 격자점 개수', description: 'y=a/x 위의 점 중에서 x좌표와 y좌표가 모두 정수인 점의 개수 (약수의 개수 × 2)', en: ['Proportion Type 13: Integer Lattice Points on Hyperbolas', 'Calculate number of integer coordinate points (x, y) using factor counting'], make: rpmPropInverseLatticePoints },
  { id: 'applied-prop-inverse-find-equation', label: '[정비례 반비례 유형 14] 그래프에서 반비례 관계식 y=a/x 구하기', description: '원점에 대칭인 쌍곡선 위의 한 점의 좌표를 읽어 반비례 관계식 유도하기', en: ['Proportion Type 14: Finding Inverse Proportion from Graph', 'Derive y=a/x by reading coordinate point on hyperbolic curve'], make: rpmPropInverseFindEquation },
  { id: 'applied-prop-direct-inverse-intersection', label: '[정비례 반비례 유형 15] 정비례와 반비례의 교점과 상수 결정', description: '정비례 y=ax와 반비례 y=b/x가 만나는 교점의 좌표 대입과 상수 ab 구하기', en: ['Proportion Type 15: Intersections of Direct & Inverse Lines', 'Solve for intersection points and product constants ab of y=ax and y=b/x'], make: rpmPropDirectInverseIntersection },
  { id: 'applied-prop-inverse-rect-area', label: '[정비례 반비례 유형 16] 반비례 그래프와 직사각형의 넓이', description: '곡선 위의 점과 좌표축으로 둘러싸인 직사각형의 넓이가 항상 |a|로 일정함을 활용하기', en: ['Proportion Type 16: Rectangle Area from Hyperbolic Points', 'Utilize constant area property xy=|a| for axis-aligned rectangles under hyperbola'], make: rpmPropInverseRectArea },
  { id: 'applied-prop-direct-word-candle-gear', label: '[정비례 반비례 유형 17] 정비례의 실생활 활용 (양초·연비·독서량)', description: '양초가 타는 길이, 1L당 주행 거리, 독서 쪽수 등 일정한 비율로 변화하는 문제', en: ['Proportion Type 17: Real-world Direct Proportion Applications', 'Solve problems involving steady consumption, fuel efficiency, and uniform rates'], make: rpmPropDirectWordCandleGear },
  { id: 'applied-prop-inverse-word-tank-volume', label: '[정비례 반비례 유형 18] 반비례의 실생활 활용 (물통 채우기·원기둥)', description: '총 용량이 일정한 물통 채우기(시간과 급수량), 부피가 일정한 원기둥(밑면과 높이)', en: ['Proportion Type 18: Real-world Inverse Applications (Tanks & Volumes)', 'Model constant tank capacity (rate × time) and fixed cylinder volumes'], make: rpmPropInverseWordTankVolume },
  { id: 'applied-prop-inverse-word-work-boyle', label: '[정비례 반비례 유형 19] 반비례 과학·작업 활용 (보일의 법칙·인원수)', description: '기체의 압력과 부피(보일의 법칙), 정해진 일을 완성하는 작업 인원수와 시간', en: ['Proportion Type 19: Scientific & Labor Inverse Proportions', 'Apply Boyles law (P × V = C) and team labor equations (workers × days = work)'], make: rpmPropInverseWordWorkBoyle },
  { id: 'applied-prop-two-travelers-graph', label: '[정비례 반비례 유형 20] 두 사람의 이동 거리 그래프 비교와 추월', description: '시차를 두고 출발한 두 사람의 이동 그래프에서 만나는 시각과 거리 분석', en: ['Proportion Type 20: Comparative Motion Graphs & Catchup Times', 'Determine meeting times and distance gaps between two moving travelers'], make: rpmPropTwoTravelersGraph },
  { id: 'applied-prop-chain-proportion', label: '[정비례 반비례 유형 21] 연쇄 비례 (정비례와 반비례의 결합)', description: 'y가 x에 정비례하고 z가 y에 반비례할 때 주어진 조건으로 미지수 값 유도하기', en: ['Proportion Type 21: Chained Proportion Systems', 'Evaluate multi-step proportions where y is proportional to x and z inversely to y'], make: rpmPropChainProportion },
  { id: 'applied-prop-all-types-mixed', label: '[단원 실전 다지기] 매일 정비례와 반비례 종합', description: '정비례/반비례 판별, 그래프 성질, 교점, 넓이, 실생활 활용 전 유형 종합 출제', en: ['Daily Proportion Comprehensive', 'Comprehensive mixed practice across all direct and inverse proportion types'], make: rpmPropAllTypesMixed },
  { id: 'applied-semester-one-mock-exam', label: '[1학기 총괄평가] 매일 중학 1-1 전 범위 실전 모의고사 (소인수분해~반비례)', description: '소인수분해, 정수와 유리수, 일차방정식, 좌표평면, 정비례·반비례 전 단원 실전 모의고사', en: ['Semester 1 Final Review Mock Exam', 'Comprehensive mock exam across all Grade 7 Semester 1 chapters'], make: rpmSemesterOneMockExam },
];

export const PROPORTION_ALL_UNITS = [...PROPORTION_UNITS, ...RPM_PROPORTION_APPLIED_UNITS];

export function findProportionUnit(unitId) {
  return PROPORTION_ALL_UNITS.find((unit) => unit.id === unitId) || PROPORTION_UNITS[0];
}

export function localizeProportionUnit(unit, language, field = 'label') {
  if (language === 'ko') return unit[field];
  return localizeRegionalUnit(unit.id, language, unit.en[field === 'label' ? 0 : 1], field);
}
import { localizeRegionalUnit } from '../../regionalCatalog.js';
import {
  rpmPropDirectIdentify,
  rpmPropDirectTable,
  rpmPropDirectGraphProperties,
  rpmPropDirectSlopeAxisDistance,
  rpmPropDirectPointOnGraph,
  rpmPropDirectFindEquation,
  rpmPropDirectGraphArea,
  rpmPropInverseIdentify,
  rpmPropInverseTable,
  rpmPropInverseGraphProperties,
  rpmPropInverseOriginDistance,
  rpmPropInversePointOnGraph,
  rpmPropInverseLatticePoints,
  rpmPropInverseFindEquation,
  rpmPropDirectInverseIntersection,
  rpmPropInverseRectArea,
  rpmPropDirectWordCandleGear,
  rpmPropInverseWordTankVolume,
  rpmPropInverseWordWorkBoyle,
  rpmPropTwoTravelersGraph,
  rpmPropChainProportion,
  rpmPropAllTypesMixed,
  rpmSemesterOneMockExam,
} from '../rpmAppliedEngine.js';
