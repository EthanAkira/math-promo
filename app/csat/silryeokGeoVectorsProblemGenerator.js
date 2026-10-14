/**
 * 실력정석 기하와 벡터 (Silryeok Geometry & Vectors) 문제 생성 엔진
 * (Algorithmic Problem Generation Engine)
 *
 * 13대 단원별 알고리즘 기반 생성:
 * - 유제: 기본문제 (tier: 'basic', section: '기본문제 (유제)')
 * - 연습문제 표준: 응용문제 (tier: 'applied', section: '응용문제 (연습문제 표준)')
 * - 연습문제 실력편: 고난도 문제 (tier: 'advanced', section: '고난도 문제 (실력 연습문제)')
 *
 * 13대 단원 목록:
 * 01. 포물선의 방정식 (conic-sections / geometry)
 * 02. 타원의 방정식 (conic-sections / geometry)
 * 03. 쌍곡선의 방정식 (conic-sections / geometry)
 * 04. 이차곡선의 접선 (conic-sections / geometry)
 * 05. 일차변환과 행렬 (plane-vectors / geometry)
 * 06. 일차변환과 도형 (plane-vectors / geometry)
 * 07. 공간도형 (space-geometry / geometry)
 * 08. 정사영과 전개도 (space-geometry / geometry)
 * 09. 공간좌표 (space-geometry / geometry)
 * 10. 벡터의 연산 (plane-vectors / geometry)
 * 11. 벡터의 성분 (plane-vectors / geometry)
 * 12. 벡터의 내적 (plane-vectors / geometry)
 * 13. 직선과 구의 벡터방정식 (plane-vectors / geometry)
 */

function pickRandom(arr, rng = Math.random) {
  return arr[Math.floor(rng() * arr.length)];
}

function randInt(min, max, rng = Math.random) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function randNonZero(min, max, rng = Math.random) {
  let val = 0;
  while (val === 0) {
    val = randInt(min, max, rng);
  }
  return val;
}

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

function simplifyFrac(num, den) {
  if (den < 0) {
    num = -num;
    den = -den;
  }
  const g = gcd(num, den);
  num /= g;
  den /= g;
  if (den === 1) return `${num}`;
  return `\\frac{${num}}{${den}}`;
}

function buildChoices(correctVal, distractorOffsets = [-2, -1, 1, 2], isNumber = true, rng = Math.random) {
  const choices = [correctVal];
  for (const off of distractorOffsets) {
    const d = isNumber ? correctVal + off : `${correctVal} + ${off}`;
    if (!choices.includes(d)) {
      choices.push(d);
    }
  }
  let extra = 3;
  while (choices.length < 5) {
    choices.push(isNumber ? correctVal + extra : `${correctVal} + ${extra}`);
    extra++;
  }

  const choiceList = choices.slice(0, 5);
  for (let i = choiceList.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [choiceList[i], choiceList[j]] = [choiceList[j], choiceList[i]];
  }

  const correctIndex = choiceList.indexOf(correctVal);
  return {
    choices: choiceList.map((c) => (String(c).startsWith('$') ? String(c) : `$${c}$`)),
    correctAnswer: correctIndex >= 0 ? correctIndex : 0,
    answer: String(correctIndex >= 0 ? correctIndex : 0),
  };
}

// 01. 포물선의 방정식
export function genSilryeokParabola(tier = 'basic', rng = Math.random) {
  const p = randInt(2, 6, rng);
  // y^2 = 4 p x -> 초점 (p, 0), 준선 x = -p
  const question = `초점이 점 $(${p}, 0)$이고 준선이 직선 $x = -${p}$인 포물선의 방정식을 구하여라.`;
  const ansStr = `y^2 = ${4 * p}x`;
  const explanation = `초점이 $(p, 0)$, 준선이 $x = -p$인 포물선의 방정식은 $y^2 = 4px$입니다.\n$p = ${p}$이므로 구하는 포물선의 방정식은\n$$y^2 = 4 \\times ${p} \\times x = ${4 * p}x$$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansStr, [`y^2 = ${2 * p}x`, `y^2 = ${p}x`, `x^2 = ${4 * p}y`, `y^2 = -${4 * p}x`], false, rng);
  return { chapter: 1, chapterName: '포물선의 방정식', unitId: 'conic-sections', tier, question, choices, correctAnswer, answer, explanation };
}

// 02. 타원의 방정식
export function genSilryeokEllipse(tier = 'basic', rng = Math.random) {
  const a = randInt(3, 5, rng);
  const b = a - 1;
  // x^2 / a^2 + y^2 / b^2 = 1 -> 장축의 길이 2a
  const ansVal = 2 * a;
  const question = `타원 $\\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} = 1$의 장축의 길이를 구하여라.`;
  const explanation = `$a^2 = ${a * a}$, $b^2 = ${b * b}$에서 $a = ${a}$, $b = ${b}$입니다.\n$a > b > 0$이므로 장축의 길이는 $2a = 2 \\times ${a} = ${ansVal}$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansVal, [-2, -1, 1, 2], true, rng);
  return { chapter: 2, chapterName: '타원의 방정식', unitId: 'conic-sections', tier, question, choices, correctAnswer, answer, explanation };
}

// 03. 쌍곡선의 방정식
export function genSilryeokHyperbola(tier = 'basic', rng = Math.random) {
  const a = randInt(2, 4, rng);
  const b = randInt(2, 4, rng);
  // x^2 / a^2 - y^2 / b^2 = 1 -> 점근선 y = +- (b/a) x
  const slope = simplifyFrac(b, a);
  const question = `쌍곡선 $\\frac{x^2}{${a * a}} - \\frac{y^2}{${b * b}} = 1$의 점근선의 기울기의 절댓값을 구하여라.`;
  const explanation = `쌍곡선 $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$의 점근선의 방정식은 $y = \\pm \\frac{b}{a}x$입니다.\n따라서 기울기의 절댓값은 $\\frac{${b}}{${a}} = ${slope}$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(slope, ['1', '2', simplifyFrac(a, b), simplifyFrac(b + 1, a)], false, rng);
  return { chapter: 3, chapterName: '쌍곡선의 방정식', unitId: 'conic-sections', tier, question, choices, correctAnswer, answer, explanation };
}

// 04. 이차곡선의 접선
export function genSilryeokConicTangents(tier = 'basic', rng = Math.random) {
  const p = randInt(2, 4, rng);
  const m = randInt(1, 3, rng);
  // y^2 = 4 p x 에 접하고 기울기가 m인 접선: y = m x + p / m
  const c = simplifyFrac(p, m);
  const question = `포물선 $y^2 = ${4 * p}x$에 접하고 기울기가 $${m}$인 직선의 $y$절편을 구하여라.`;
  const explanation = `기울기가 $m$인 포물선 $y^2 = 4px$의 접선의 방정식은 $y = mx + \\frac{p}{m}$입니다.\n$p = ${p}$, $m = ${m}$이므로 $y$절편은 $\\frac{${p}}{${m}} = ${c}$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(c, ['1', '2', '3', '4'], false, rng);
  return { chapter: 4, chapterName: '이차곡선의 접선', unitId: 'conic-sections', tier, question, choices, correctAnswer, answer, explanation };
}

// 05. 일차변환과 행렬
export function genSilryeokLinearTransform(tier = 'basic', rng = Math.random) {
  const a = randInt(1, 3, rng);
  const b = randInt(1, 2, rng);
  const x = randInt(1, 4, rng);
  const y = randInt(1, 3, rng);
  // [a, b; 0, 1] * [x; y] = [ax + by, y]
  const ansX = a * x + b * y;
  const question = `행렬 $A = \\begin{pmatrix} ${a} & ${b} \\\\ 0 & 1 \\end{pmatrix}$에 의해 점 $(${x}, ${y})$가 점 $(x', y')$로 옮겨질 때, $x'$의 값을 구하여라.`;
  const explanation = `$$\\begin{pmatrix} x' \\\\ y' \\end{pmatrix} = \\begin{pmatrix} ${a} & ${b} \\\\ 0 & 1 \\end{pmatrix} \\begin{pmatrix} ${x} \\\\ ${y} \\end{pmatrix} = \\begin{pmatrix} ${a}(${x}) + ${b}(${y}) \\\\ ${y} \\end{pmatrix} = \\begin{pmatrix} ${ansX} \\\\ ${y} \\end{pmatrix}$$\n따라서 $x' = ${ansX}$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansX, [-2, -1, 1, 2], true, rng);
  return { chapter: 5, chapterName: '일차변환과 행렬', unitId: 'plane-vectors', tier, question, choices, correctAnswer, answer, explanation };
}

// 06. 일차변환과 도형
export function genSilryeokTransformGeometry(tier = 'basic', rng = Math.random) {
  const det = randInt(2, 5, rng);
  const s0 = randInt(2, 6, rng);
  // 넓이 변화율: S' = |det A| * S0 = det * s0
  const ansVal = det * s0;
  const question = `행렬식(판별식)의 절댓값이 $${det}$인 일차변환에 의하여 넓이가 $${s0}$인 도형이 옮겨진 상의 넓이를 구하여라.`;
  const explanation = `일차변환 $f$를 나타내는 행렬을 $A$라 하면 도형의 넓이의 변화율은 $|\\det A|$입니다.\n따라서 옮겨진 도형의 넓이는\n$$S' = |\\det A| \\times S = ${det} \\times ${s0} = ${ansVal}$$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansVal, [-4, -2, 2, 4], true, rng);
  return { chapter: 6, chapterName: '일차변환과 도형', unitId: 'plane-vectors', tier, question, choices, correctAnswer, answer, explanation };
}

// 07. 공간도형
export function genSilryeokSpaceGeometry(tier = 'basic', rng = Math.random) {
  const a = randInt(3, 5, rng);
  const b = randInt(4, 6, rng);
  // 삼수선의 정리: 밑변 a, 높이 b -> 빗변 c = sqrt(a^2 + b^2)
  const question = `평면 $\\alpha$ 위의 직선 $l$과 그 평면 위에 있지 않은 점 $P$에 대하여, $P$에서 $\\alpha$에 내린 수선의 발을 $O$라 하자. $PO = 4$, $O$에서 $l$에 내린 수선의 길이가 $3$일 때, 삼수선의 정리에 의해 $P$에서 $l$까지의 거리를 구하여라.`;
  const ansVal = 5;
  const explanation = `삼수선의 정리에 의해 $P$에서 직선 $l$에 내린 수선의 발을 $H$라 하면 삼각형 $POH$는 $\\angle POH = 90^\\circ$인 직각삼각형입니다.\n$$PH = \\sqrt{PO^2 + OH^2} = \\sqrt{4^2 + 3^2} = \\sqrt{16 + 9} = 5$$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansVal, [-2, -1, 1, 2], true, rng);
  return { chapter: 7, chapterName: '공간도형', unitId: 'space-geometry', tier, question, choices, correctAnswer, answer, explanation };
}

// 08. 정사영과 전개도
export function genSilryeokOrthographicProjection(tier = 'basic', rng = Math.random) {
  const s = randInt(6, 12, rng) * 2;
  // S' = S * cos(60도) = S / 2
  const ansVal = s / 2;
  const question = `넓이가 $${s}$인 평면도형이 밑면과 이루는 이면각의 크기가 $60^\\circ$일 때, 이 도형의 밑면 위로의 정사영의 넓이를 구하여라.`;
  const explanation = `정사영의 넓이 공식 $S' = S \\cos \\theta$에 의해\n$$S' = ${s} \\times \\cos 60^\\circ = ${s} \\times \\frac{1}{2} = ${ansVal}$$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansVal, [-3, -1, 2, 4], true, rng);
  return { chapter: 8, chapterName: '정사영과 전개도', unitId: 'space-geometry', tier, question, choices, correctAnswer, answer, explanation };
}

// 09. 공간좌표
export function genSilryeokSpatialCoordinates(tier = 'basic', rng = Math.random) {
  const r = randInt(2, 5, rng);
  // 중심 (1, 2, 3), 반지름 r인 구의 방정식: (x-1)^2 + (y-2)^2 + (z-3)^2 = r^2
  const ansVal = r * r;
  const question = `중심이 $(1, 2, 3)$이고 반지름의 길이가 $${r}$인 구의 방정식에서 우변의 상수값 $r^2$을 구하여라.`;
  const explanation = `중심이 $(a, b, c)$, 반지름이 $r$인 구의 방정식은 $(x-a)^2 + (y-b)^2 + (z-c)^2 = r^2$입니다.\n따라서 우변의 상수값은 $r^2 = (${r})^2 = ${ansVal}$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansVal, [-4, -2, 2, 4], true, rng);
  return { chapter: 9, chapterName: '공간좌표', unitId: 'space-geometry', tier, question, choices, correctAnswer, answer, explanation };
}

// 10. 벡터의 연산
export function genSilryeokVectorOperations(tier = 'basic', rng = Math.random) {
  const a = randInt(2, 4, rng);
  const b = randInt(1, 3, rng);
  // 3(a v) - 2(b v) = (3a - 2b) v
  const ansVal = 3 * a - 2 * b;
  const question = `벡터 $\\vec{x}$에 대하여 $3(${a}\\vec{a}) - 2(${b}\\vec{a}) = k\\vec{a}$를 만족하는 상수 $k$의 값을 구하여라.`;
  const explanation = `$$3(${a}\\vec{a}) - 2(${b}\\vec{a}) = (${3 * a} - ${2 * b})\\vec{a} = ${ansVal}\\vec{a}$$\n따라서 $k = ${ansVal}$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansVal, [-2, -1, 1, 2], true, rng);
  return { chapter: 10, chapterName: '벡터의 연산', unitId: 'plane-vectors', tier, question, choices, correctAnswer, answer, explanation };
}

// 11. 벡터의 성분
export function genSilryeokVectorComponents(tier = 'basic', rng = Math.random) {
  const x = randInt(3, 4, rng);
  const y = randInt(4, 5, rng);
  // |a| = sqrt(x^2 + y^2)
  const normSq = x * x + y * y;
  const question = `평면벡터 $\\vec{a} = (${x}, ${y})$의 크기 $|\\vec{a}|$의 제곱값 $|\\vec{a}|^2$을 구하여라.`;
  const explanation = `벡터의 크기의 제곱은 $|\\vec{a}|^2 = x^2 + y^2 = (${x})^2 + (${y})^2 = ${normSq}$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(normSq, [-5, -2, 3, 6], true, rng);
  return { chapter: 11, chapterName: '벡터의 성분', unitId: 'plane-vectors', tier, question, choices, correctAnswer, answer, explanation };
}

// 12. 벡터의 내적
export function genSilryeokDotProduct(tier = 'basic', rng = Math.random) {
  const x1 = randInt(1, 3, rng);
  const y1 = randInt(2, 4, rng);
  const x2 = randInt(2, 4, rng);
  const y2 = randInt(1, 3, rng);
  // a . b = x1 x2 + y1 y2
  const dot = x1 * x2 + y1 * y2;
  const question = `두 평면벡터 $\\vec{a} = (${x1}, ${y1})$, $\\vec{b} = (${x2}, ${y2})$의 내적 $\\vec{a} \\cdot \\vec{b}$의 값을 구하여라.`;
  const explanation = `벡터의 성분에 의한 내적 공식 $\\vec{a} \\cdot \\vec{b} = x_1 x_2 + y_1 y_2$에 의해\n$$\\vec{a} \\cdot \\vec{b} = (${x1})(${x2}) + (${y1})(${y2}) = ${x1 * x2} + ${y1 * y2} = ${dot}$$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(dot, [-3, -1, 2, 4], true, rng);
  return { chapter: 12, chapterName: '벡터의 내적', unitId: 'plane-vectors', tier, question, choices, correctAnswer, answer, explanation };
}

// 13. 직선과 구의 벡터방정식
export function genSilryeokVectorEquations(tier = 'basic', rng = Math.random) {
  const u1 = randInt(2, 4, rng);
  const u2 = randInt(3, 5, rng);
  const question = `점 $(1, 2)$를 지나고 방향벡터가 $\\vec{u} = (${u1}, ${u2})$인 직선의 방정식에서 기울기를 구하여라.`;
  const slope = simplifyFrac(u2, u1);
  const explanation = `방향벡터가 $\\vec{u} = (u_1, u_2)$인 직선의 기울기는 $m = \\frac{u_2}{u_1}$입니다.\n따라서 기울기는 $\\frac{${u2}}{${u1}} = ${slope}$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(slope, ['1', '2', simplifyFrac(u1, u2), simplifyFrac(u2 + 1, u1)], false, rng);
  return { chapter: 13, chapterName: '직선과 구의 벡터방정식', unitId: 'plane-vectors', tier, question, choices, correctAnswer, answer, explanation };
}

// Master Registry
export const SILRYEOK_GEO_GENERATORS = {
  1: genSilryeokParabola,
  2: genSilryeokEllipse,
  3: genSilryeokHyperbola,
  4: genSilryeokConicTangents,
  5: genSilryeokLinearTransform,
  6: genSilryeokTransformGeometry,
  7: genSilryeokSpaceGeometry,
  8: genSilryeokOrthographicProjection,
  9: genSilryeokSpatialCoordinates,
  10: genSilryeokVectorOperations,
  11: genSilryeokVectorComponents,
  12: genSilryeokDotProduct,
  13: genSilryeokVectorEquations,
};

export const SILRYEOK_GEO_GENERATORS_BY_UNIT = {
  'conic-sections': [genSilryeokParabola, genSilryeokEllipse, genSilryeokHyperbola, genSilryeokConicTangents],
  'space-geometry': [genSilryeokSpaceGeometry, genSilryeokOrthographicProjection, genSilryeokSpatialCoordinates],
  'plane-vectors': [
    genSilryeokLinearTransform,
    genSilryeokTransformGeometry,
    genSilryeokVectorOperations,
    genSilryeokVectorComponents,
    genSilryeokDotProduct,
    genSilryeokVectorEquations,
  ],
};

/**
 * Generates an algorithmic Silryeok Jeongseok Geometry & Vectors problem.
 */
export function generateSilryeokGeoProblem(unitIdOrChapter, options = {}) {
  const rng = options.rng || Math.random;
  const tier = options.tier || 'applied';

  let fn;
  if (typeof unitIdOrChapter === 'number' && SILRYEOK_GEO_GENERATORS[unitIdOrChapter]) {
    fn = SILRYEOK_GEO_GENERATORS[unitIdOrChapter];
  } else if (SILRYEOK_GEO_GENERATORS_BY_UNIT[unitIdOrChapter]) {
    fn = pickRandom(SILRYEOK_GEO_GENERATORS_BY_UNIT[unitIdOrChapter], rng);
  } else {
    const all = Object.values(SILRYEOK_GEO_GENERATORS);
    fn = pickRandom(all, rng);
  }

  const prob = fn(tier, rng);
  const idSuffix = Math.floor(rng() * 90000 + 10000);
  const tierLabel = tier === 'basic' ? '기본문제' : tier === 'advanced' ? '고난도 문제' : '응용문제';

  return {
    id: `gen-silryeok-geo-${prob.chapter}-${tier}-${idSuffix}`,
    number: options.number || 1,
    grade: 'g3',
    category: 'csat',
    sourceLabel: `실력정석 기하와 벡터 변형 · ${prob.chapter}단원 ${prob.chapterName} [${tierLabel}]`,
    ...prob,
  };
}

/**
 * Generates a variant problem similar to the provided source problem.
 */
export function generateSilryeokGeoVariant(sourceProblem, options = {}) {
  const ch = sourceProblem?.chapter || 1;
  const tier = sourceProblem?.tier || 'applied';
  return generateSilryeokGeoProblem(ch, {
    ...options,
    tier,
    number: sourceProblem?.number || 1,
  });
}
