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

export function findProportionUnit(unitId) {
  return PROPORTION_UNITS.find((unit) => unit.id === unitId) || PROPORTION_UNITS[0];
}

export function localizeProportionUnit(unit, language, field = 'label') {
  if (language === 'ko') return unit[field];
  return unit.en[field === 'label' ? 0 : 1];
}
