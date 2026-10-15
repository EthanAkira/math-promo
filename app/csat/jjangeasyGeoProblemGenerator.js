/**
 * 짱쉬운 기하와 벡터 (Jjangeasy Geometry & Vectors) 알고리즘 문제 생성 엔진
 * (Algorithmic Problem Generation Engine)
 *
 * 16대 유형별 알고리즘 기반 생성:
 * 전 문항 기본문제 (tier: 'basic', section: '기본문제 (짱쉬운 유형별)')
 *
 * 16대 유형 목록:
 * 01. 포물선 (conic-sections / parabola)
 * 02. 타원 (conic-sections / ellipse)
 * 03. 쌍곡선 (conic-sections / hyperbola)
 * 04. 음함수의 미분과 접선 (conic-sections / conic-tangents)
 * 05. 이차곡선의 접선 (conic-sections / conic-tangents)
 * 06. 평면벡터의 뜻과 연산 (plane-vectors / vector-operations)
 * 07. 평면벡터의 성분과 크기 (plane-vectors / vector-components)
 * 08. 평면벡터의 내적 (plane-vectors / vector-dot-product)
 * 09. 공간도형과 위치 관계 (space-geometry / spatial-relations)
 * 10. 삼수선의 정리 (space-geometry / three-perpendiculars)
 * 11. 정사영 (space-geometry / orthogonal-projection)
 * 12. 공간좌표와 대칭이동 (space-geometry / spatial-coordinates)
 * 13. 선분의 내분점과 외분점 (space-geometry / division-points)
 * 14. 구의 방정식 (space-geometry / sphere-equations)
 * 15. 공간벡터의 성분과 내적 (space-geometry / spatial-vectors)
 * 16. 직선과 평면의 방정식 (space-geometry / lines-planes-equations)
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
    const d = isNumber ? correctVal + off : off;
    if (!choices.includes(d)) {
      choices.push(d);
    }
  }
  let extra = 3;
  while (choices.length < 5) {
    choices.push(isNumber ? correctVal + extra : `${correctVal}'`);
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

// -------------------------------------------------------------
// 유형 01. 포물선 (conic-sections / parabola)
// -------------------------------------------------------------
export function genJjangParabola(tier = 'basic', rng = Math.random) {
  const p = randInt(2, 6, rng);
  const x1 = randInt(2, 8, rng);
  // 점 P(x1, y1)은 포물선 y^2 = 4px 위의 점
  // 초점 F(p, 0), 준선 x = -p. 초점 F와 점 P 사이의 거리 PF = x1 + p
  const dist = x1 + p;
  const question = `초점이 $\\mathrm{F}(${p}, 0)$이고 준선이 $x = -${p}$인 포물선 $y^2 = ${4 * p}x$ 위의 점 $\\mathrm{P}(${x1}, y_1)$에 대하여 선분 $\\mathrm{PF}$의 길이는?`;
  const { choices, correctAnswer, answer } = buildChoices(dist, [-3, -1, 1, 3], true, rng);
  const explanation = `포물선의 정의에 의해 포물선 위의 점 $\\mathrm{P}(x_1, y_1)$에서 초점 $\\mathrm{F}(p, 0)$까지의 거리는 점 $\\mathrm{P}$에서 준선 $x = -p$까지의 거리와 같습니다.\n따라서 $\\overline{\\mathrm{PF}} = x_1 - (-p) = x_1 + p$입니다.\n주어진 문제에서 $x_1 = ${x1}, p = ${p}$이므로\n$$\\overline{\\mathrm{PF}} = ${x1} + ${p} = ${dist}$$입니다.`;

  return {
    chapter: 1,
    chapterName: '유형 01. 포물선',
    typeId: 1,
    subjectId: 'geometry',
    unitId: 'conic-sections',
    subUnitId: 'parabola',
    majorUnit: '이차곡선',
    middleUnit: '포물선',
    detailedType: '포물선의 정의와 방정식',
    amcSubjectId: 'geometry',
    amcUnitId: 'conic-sections',
    tier: 'basic',
    difficulty: '기본',
    points: 2,
    type: 'multiple-choice',
    section: '기본문제 (짱쉬운 유형별)',
    question,
    choices,
    answer,
    correctAnswer,
    explanation,
  };
}

// -------------------------------------------------------------
// 유형 02. 타원 (conic-sections / ellipse)
// -------------------------------------------------------------
export function genJjangEllipse(tier = 'basic', rng = Math.random) {
  // c^2 = a^2 - b^2, a > b > 0
  const b = randInt(2, 4, rng);
  const c = randInt(2, 4, rng);
  const a2 = b * b + c * c;
  const b2 = b * b;
  const majorLength = 2 * Math.round(Math.sqrt(a2));
  // 완전제곱수 a 설정
  const a = randInt(4, 7, rng);
  const cVal = randInt(2, a - 1, rng);
  const bVal2 = a * a - cVal * cVal;

  const question = `타원 $\\frac{x^2}{${a * a}} + \\frac{y^2}{${bVal2}} = 1$의 두 초점을 $\\mathrm{F}, \\mathrm{F}'$이라 할 때, 이 타원 위의 한 점 $\\mathrm{P}$에 대하여 $\\overline{\\mathrm{PF}} + \\overline{\\mathrm{PF}'}$의 값은?`;
  const ansVal = 2 * a;
  const { choices, correctAnswer, answer } = buildChoices(ansVal, [-4, -2, 2, 4], true, rng);
  const explanation = `타원의 정의에 의해 타원 위의 임의의 점 $\\mathrm{P}$로부터 두 초점 $\\mathrm{F}, \\mathrm{F}'$까지의 거리의 합은 장축의 길이 $2a$와 같습니다.\n방정식 $\\frac{x^2}{${a * a}} + \\frac{y^2}{${bVal2}} = 1$에서 $a^2 = ${a * a}$이므로 $a = ${a}$입니다.\n따라서 장축의 길이는 $2a = 2 \\times ${a} = ${ansVal}$이므로\n$$\\overline{\\mathrm{PF}} + \\overline{\\mathrm{PF}'} = ${ansVal}$$입니다.`;

  return {
    chapter: 2,
    chapterName: '유형 02. 타원',
    typeId: 2,
    subjectId: 'geometry',
    unitId: 'conic-sections',
    subUnitId: 'ellipse',
    majorUnit: '이차곡선',
    middleUnit: '타원',
    detailedType: '타원의 정의와 방정식',
    amcSubjectId: 'geometry',
    amcUnitId: 'conic-sections',
    tier: 'basic',
    difficulty: '기본',
    points: 2,
    type: 'multiple-choice',
    section: '기본문제 (짱쉬운 유형별)',
    question,
    choices,
    answer,
    correctAnswer,
    explanation,
  };
}

// -------------------------------------------------------------
// 유형 03. 쌍곡선 (conic-sections / hyperbola)
// -------------------------------------------------------------
export function genJjangHyperbola(tier = 'basic', rng = Math.random) {
  const a = randInt(2, 5, rng);
  const b = randInt(2, 5, rng);
  const a2 = a * a;
  const b2 = b * b;
  const c2 = a2 + b2;

  const mode = randInt(1, 2, rng);
  if (mode === 1) {
    // 주축의 길이
    const question = `쌍곡선 $\\frac{x^2}{${a2}} - \\frac{y^2}{${b2}} = 1$의 주축의 길이는?`;
    const ansVal = 2 * a;
    const { choices, correctAnswer, answer } = buildChoices(ansVal, [-3, -1, 1, 3], true, rng);
    const explanation = `쌍곡선 $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$에서 주축의 길이는 $2a$입니다.\n$a^2 = ${a2}$이므로 $a = ${a}$입니다.\n따라서 주축의 길이는 $2 \\times ${a} = ${ansVal}$입니다.`;
    return {
      chapter: 3,
      chapterName: '유형 03. 쌍곡선',
      typeId: 3,
      subjectId: 'geometry',
      unitId: 'conic-sections',
      subUnitId: 'hyperbola',
      majorUnit: '이차곡선',
      middleUnit: '쌍곡선',
      detailedType: '쌍곡선의 정의와 점근선',
      amcSubjectId: 'geometry',
      amcUnitId: 'conic-sections',
      tier: 'basic',
      difficulty: '기본',
      points: 2,
      type: 'multiple-choice',
      section: '기본문제 (짱쉬운 유형별)',
      question,
      choices,
      answer,
      correctAnswer,
      explanation,
    };
  } else {
    // 두 초점 사이의 거리 또는 c^2
    const question = `쌍곡선 $\\frac{x^2}{${a2}} - \\frac{y^2}{${b2}} = 1$의 두 초점을 $\\mathrm{F}(c, 0), \\mathrm{F}'(-c, 0)$이라 할 때, $c^2$의 값은?`;
    const ansVal = c2;
    const { choices, correctAnswer, answer } = buildChoices(ansVal, [-5, -2, 2, 5], true, rng);
    const explanation = `쌍곡선 $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$에서 초점의 좌표 $c$는 $c^2 = a^2 + b^2$을 만족합니다.\n$a^2 = ${a2}, b^2 = ${b2}$이므로\n$$c^2 = ${a2} + ${b2} = ${c2}$$입니다.`;
    return {
      chapter: 3,
      chapterName: '유형 03. 쌍곡선',
      typeId: 3,
      subjectId: 'geometry',
      unitId: 'conic-sections',
      subUnitId: 'hyperbola',
      majorUnit: '이차곡선',
      middleUnit: '쌍곡선',
      detailedType: '쌍곡선의 정의와 점근선',
      amcSubjectId: 'geometry',
      amcUnitId: 'conic-sections',
      tier: 'basic',
      difficulty: '기본',
      points: 2,
      type: 'multiple-choice',
      section: '기본문제 (짱쉬운 유형별)',
      question,
      choices,
      answer,
      correctAnswer,
      explanation,
    };
  }
}

// -------------------------------------------------------------
// 유형 04. 음함수의 미분과 접선 (conic-sections / conic-tangents)
// -------------------------------------------------------------
export function genJjangImplicitTangent(tier = 'basic', rng = Math.random) {
  // 곡선 x^2 + k y^2 = C 위의 점 (x0, y0)에서의 접선의 기울기
  const k = randInt(2, 4, rng);
  const x0 = randInt(1, 3, rng);
  const y0 = randInt(1, 3, rng);
  const C = x0 * x0 + k * y0 * y0;
  // 2x + 2k y (dy/dx) = 0 -> dy/dx = -x0 / (k y0)
  // 정수화하기 위해 분수 선택지 또는 특정 값
  const slopeNum = -x0;
  const slopeDen = k * y0;
  const slopeStr = simplifyFrac(slopeNum, slopeDen);

  const question = `곡선 $x^2 + ${k}y^2 = ${C}$ 위의 점 $(${x0}, ${y0})$에서의 접선의 기울기는?`;
  const ansStr = `$${slopeStr}$`;
  const distractors = [
    `$${simplifyFrac(x0, slopeDen)}$`,
    `$${simplifyFrac(-y0, k * x0)}$`,
    `$${simplifyFrac(-x0, y0)}$`,
    `$${simplifyFrac(slopeNum + 1, slopeDen)}$`,
  ];
  const { choices, correctAnswer, answer } = buildChoices(ansStr, distractors, false, rng);
  const explanation = `주어진 방정식 $x^2 + ${k}y^2 = ${C}$의 양변을 $x$에 대하여 미분하면\n$$2x + ${2 * k}y \\frac{dy}{dx} = 0$$\n$$\\frac{dy}{dx} = -\\frac{x}{${k}y}$$\n점 $(${x0}, ${y0})$에서의 접선의 기울기는 $x = ${x0}, y = ${y0}$을 대입하면\n$$\\frac{dy}{dx} = -\\frac{${x0}}{${k} \\times ${y0}} = ${slopeStr}$$입니다.`;

  return {
    chapter: 4,
    chapterName: '유형 04. 음함수의 미분과 접선',
    typeId: 4,
    subjectId: 'geometry',
    unitId: 'conic-sections',
    subUnitId: 'conic-tangents',
    majorUnit: '이차곡선',
    middleUnit: '이차곡선의 접선',
    detailedType: '음함수 미분법을 이용한 접선의 방정식',
    amcSubjectId: 'geometry',
    amcUnitId: 'conic-sections',
    tier: 'basic',
    difficulty: '기본',
    points: 3,
    type: 'multiple-choice',
    section: '기본문제 (짱쉬운 유형별)',
    question,
    choices,
    answer,
    correctAnswer,
    explanation,
  };
}

// -------------------------------------------------------------
// 유형 05. 이차곡선의 접선 (conic-sections / conic-tangents)
// -------------------------------------------------------------
export function genJjangConicTangents(tier = 'basic', rng = Math.random) {
  // 포물선 y^2 = 4px 위의 점 (x1, y1)에서의 접선: y1 y = 2p (x + x1)
  const p = randInt(1, 4, rng);
  const y1 = 2 * p * randInt(1, 3, rng);
  const x1 = (y1 * y1) / (4 * p);
  // 접선의 방정식: y1 y = 2p (x + x1) -> y = (2p / y1) x + (2p x1 / y1)
  // x절편: y = 0 일 때 x = -x1
  const question = `포물선 $y^2 = ${4 * p}x$ 위의 점 $(${x1}, ${y1})$에서의 접선이 $x$축과 만나는 점의 $x$좌표는?`;
  const ansVal = -x1;
  const { choices, correctAnswer, answer } = buildChoices(ansVal, [-3, -1, 1, 3], true, rng);
  const explanation = `포물선 $y^2 = 4px$ 위의 점 $(x_1, y_1)$에서의 접선의 방정식은\n$$y_1 y = 2p(x + x_1)$$\n$p = ${p}, x_1 = ${x1}, y_1 = ${y1}$을 대입하면\n$$${y1}y = ${2 * p}(x + ${x1})$$\n$x$축과 만나는 점($y = 0$)의 $x$좌표는 $0 = ${2 * p}(x + ${x1})$에서\n$$x = -${x1}$$입니다.`;

  return {
    chapter: 5,
    chapterName: '유형 05. 이차곡선의 접선',
    typeId: 5,
    subjectId: 'geometry',
    unitId: 'conic-sections',
    subUnitId: 'conic-tangents',
    majorUnit: '이차곡선',
    middleUnit: '이차곡선의 접선',
    detailedType: '기울기가 주어진 접선과 접점 공식',
    amcSubjectId: 'geometry',
    amcUnitId: 'conic-sections',
    tier: 'basic',
    difficulty: '기본',
    points: 3,
    type: 'multiple-choice',
    section: '기본문제 (짱쉬운 유형별)',
    question,
    choices,
    answer,
    correctAnswer,
    explanation,
  };
}

// -------------------------------------------------------------
// 유형 06. 평면벡터의 뜻과 연산 (plane-vectors / vector-operations)
// -------------------------------------------------------------
export function genJjangVectorOperations(tier = 'basic', rng = Math.random) {
  // 2(x + a) - 3(x - b) = c -> x 정리 또는 계수 구하기
  const c1 = randInt(2, 4, rng);
  const c2 = randInt(1, 3, rng);
  // 3 * a - 2 * b 연산
  const question = `두 평면벡터 $\\vec{a}, \\vec{b}$에 대하여 등식 $2(\\vec{x} + \\vec{a}) - 3(\\vec{x} - \\vec{b}) = \\vec{0}$을 만족시키는 벡터 $\\vec{x}$를 $\\vec{a}, \\vec{b}$로 나타낸 것은?`;
  const ansStr = `$2\\vec{a} + 3\\vec{b}$`;
  const distractors = [
    `$2\\vec{a} - 3\\vec{b}$`,
    `$-2\\vec{a} + 3\\vec{b}$`,
    `$3\\vec{a} + 2\\vec{b}$`,
    `$5\\vec{a} + \\vec{b}$`,
  ];
  const { choices, correctAnswer, answer } = buildChoices(ansStr, distractors, false, rng);
  const explanation = `주어진 식의 괄호를 전개하여 정리하면\n$$2\\vec{x} + 2\\vec{a} - 3\\vec{x} + 3\\vec{b} = \\vec{0}$$\n$$-\\vec{x} + 2\\vec{a} + 3\\vec{b} = \\vec{0}$$\n따라서 $\\vec{x} = 2\\vec{a} + 3\\vec{b}$입니다.`;

  return {
    chapter: 6,
    chapterName: '유형 06. 평면벡터의 뜻과 연산',
    typeId: 6,
    subjectId: 'geometry',
    unitId: 'plane-vectors',
    subUnitId: 'vector-operations',
    majorUnit: '평면벡터',
    middleUnit: '평면벡터의 연산',
    detailedType: '벡터의 덧셈·뺄셈과 실수배',
    amcSubjectId: 'geometry',
    amcUnitId: 'plane-vectors',
    tier: 'basic',
    difficulty: '기본',
    points: 2,
    type: 'multiple-choice',
    section: '기본문제 (짱쉬운 유형별)',
    question,
    choices,
    answer,
    correctAnswer,
    explanation,
  };
}

// -------------------------------------------------------------
// 유형 07. 평면벡터의 성분과 크기 (plane-vectors / vector-components)
// -------------------------------------------------------------
export function genJjangVectorComponents(tier = 'basic', rng = Math.random) {
  const a1 = randInt(-4, 4, rng);
  const a2 = randInt(1, 5, rng);
  const b1 = randInt(-3, 3, rng);
  const b2 = randInt(-4, 4, rng);
  const k = randInt(2, 3, rng);

  // v = a + k*b
  const v1 = a1 + k * b1;
  const v2 = a2 + k * b2;
  const sum = v1 + v2;

  const question = `두 평면벡터 $\\vec{a} = (${a1}, ${a2}), \\vec{b} = (${b1}, ${b2})$에 대하여 벡터 $\\vec{a} + ${k}\\vec{b}$의 모든 성분의 합은?`;
  const ansVal = sum;
  const { choices, correctAnswer, answer } = buildChoices(ansVal, [-3, -1, 1, 3], true, rng);
  const explanation = `$\\vec{a} + ${k}\\vec{b} = (${a1}, ${a2}) + ${k}(${b1}, ${b2})$\n$$= (${a1}, ${a2}) + (${k * b1}, ${k * b2})$$\n$$= (${a1 + k * b1}, ${a2 + k * b2}) = (${v1}, ${v2})$$\n따라서 모든 성분의 합은\n$$${v1} + (${v2}) = ${sum}$$입니다.`;

  return {
    chapter: 7,
    chapterName: '유형 07. 평면벡터의 성분과 크기',
    typeId: 7,
    subjectId: 'geometry',
    unitId: 'plane-vectors',
    subUnitId: 'vector-components',
    majorUnit: '평면벡터',
    middleUnit: '평면벡터의 성분과 내적',
    detailedType: '위치벡터의 성분과 크기 계산',
    amcSubjectId: 'geometry',
    amcUnitId: 'plane-vectors',
    tier: 'basic',
    difficulty: '기본',
    points: 2,
    type: 'multiple-choice',
    section: '기본문제 (짱쉬운 유형별)',
    question,
    choices,
    answer,
    correctAnswer,
    explanation,
  };
}

// -------------------------------------------------------------
// 유형 08. 평면벡터의 내적 (plane-vectors / vector-dot-product)
// -------------------------------------------------------------
export function genJjangVectorDotProduct(tier = 'basic', rng = Math.random) {
  const a1 = randInt(-4, 5, rng);
  const a2 = randInt(-4, 5, rng);
  const b1 = randInt(-3, 4, rng);
  const b2 = randInt(-3, 4, rng);
  const dot = a1 * b1 + a2 * b2;

  const question = `두 평면벡터 $\\vec{a} = (${a1}, ${a2})$와 $\\vec{b} = (${b1}, ${b2})$의 내적 $\\vec{a} \\cdot \\vec{b}$의 값은?`;
  const ansVal = dot;
  const { choices, correctAnswer, answer } = buildChoices(ansVal, [-4, -2, 2, 4], true, rng);
  const explanation = `두 평면벡터 $\\vec{a} = (a_1, a_2), \\vec{b} = (b_1, b_2)$의 내적은\n$$\\vec{a} \\cdot \\vec{b} = a_1 b_1 + a_2 b_2$$\n입니다. 주어진 성분을 대입하면\n$$\\vec{a} \\cdot \\vec{b} = (${a1}) \\times (${b1}) + (${a2}) \\times (${b2}) = ${a1 * b1} + ${a2 * b2} = ${dot}$$입니다.`;

  return {
    chapter: 8,
    chapterName: '유형 08. 평면벡터의 내적',
    typeId: 8,
    subjectId: 'geometry',
    unitId: 'plane-vectors',
    subUnitId: 'vector-dot-product',
    majorUnit: '평면벡터',
    middleUnit: '평면벡터의 성분과 내적',
    detailedType: '두 평면벡터의 내적과 이루는 각',
    amcSubjectId: 'geometry',
    amcUnitId: 'plane-vectors',
    tier: 'basic',
    difficulty: '기본',
    points: 2,
    type: 'multiple-choice',
    section: '기본문제 (짱쉬운 유형별)',
    question,
    choices,
    answer,
    correctAnswer,
    explanation,
  };
}

// -------------------------------------------------------------
// 유형 09. 공간도형과 위치 관계 (space-geometry / spatial-relations)
// -------------------------------------------------------------
export function genJjangSpatialRelations(tier = 'basic', rng = Math.random) {
  // 정육면체 ABCD-EFGH에서 직선과 직선, 직선과 평면의 위치관계
  const edges = [
    { target: '직선 $\\mathrm{AB}$', parallel: '직선 $\\mathrm{CD}, \\mathrm{EF}, \\mathrm{GH}$', skew: '직선 $\\mathrm{CG}, \\mathrm{DH}, \\mathrm{EH}, \\mathrm{FG}$', countSkew: 4 },
    { target: '직선 $\\mathrm{AE}$', parallel: '직선 $\\mathrm{BF}, \\mathrm{CG}, \\mathrm{DH}$', skew: '직선 $\\mathrm{BC}, \\mathrm{CD}, \\mathrm{FG}, \\mathrm{GH}$', countSkew: 4 },
  ];
  const picked = pickRandom(edges, rng);
  const question = `오른쪽 그림과 같은 정육면체 $\\mathrm{ABCD-EFGH}$에서 ${picked.target}와 꼬인 위치에 있는 모서리의 개수는?`;
  const ansVal = 4;
  const { choices, correctAnswer, answer } = buildChoices(ansVal, [-2, -1, 1, 2], true, rng);
  const explanation = `정육면체에서 한 모서리와의 위치 관계는 다음과 같습니다.\n- 만나는 모서리: 4개\n- 평행한 모서리: 3개\n- 꼬인 위치에 있는 모서리: 전체 12개 모서리 중 자신(1개), 만나는 것(4개), 평행한 것(3개)을 제외한 나머지 $12 - 1 - 4 - 3 = 4$개입니다.\n따라서 ${picked.target}와 꼬인 위치에 있는 모서리는 ${picked.skew}로 총 ${ansVal}개입니다.`;

  return {
    chapter: 9,
    chapterName: '유형 09. 공간도형과 위치 관계',
    typeId: 9,
    subjectId: 'geometry',
    unitId: 'space-geometry',
    subUnitId: 'spatial-relations',
    majorUnit: '공간도형과 공간좌표',
    middleUnit: '공간도형',
    detailedType: '직선과 평면의 위치 관계와 꼬인 위치',
    amcSubjectId: 'geometry',
    amcUnitId: 'space-geometry',
    tier: 'basic',
    difficulty: '기본',
    points: 3,
    type: 'multiple-choice',
    section: '기본문제 (짱쉬운 유형별)',
    question,
    choices,
    answer,
    correctAnswer,
    explanation,
  };
}

// -------------------------------------------------------------
// 유형 10. 삼수선의 정리 (space-geometry / three-perpendiculars)
// -------------------------------------------------------------
export function genJjangThreePerpendiculars(tier = 'basic', rng = Math.random) {
  // 삼수선: PH perp alpha, HQ perp l, then PQ perp l
  // PH = a, HQ = b, PQ = sqrt(a^2 + b^2)
  const triples = [
    [3, 4, 5],
    [6, 8, 10],
    [5, 12, 13],
    [8, 15, 17],
  ];
  const [a, b, c] = pickRandom(triples, rng);
  const question = `평면 $\\alpha$ 위에 있지 않은 점 $\\mathrm{P}$에서 평면 $\\alpha$에 내린 수선의 발을 $\\mathrm{H}$, 점 $\\mathrm{H}$에서 평면 $\\alpha$ 위의 직선 $l$에 내린 수선의 발을 $\\mathrm{Q}$라 하자. $\\overline{\\mathrm{PH}} = ${a}, \\overline{\\mathrm{HQ}} = ${b}$일 때, 선분 $\\overline{\\mathrm{PQ}}$의 길이는?`;
  const ansVal = c;
  const { choices, correctAnswer, answer } = buildChoices(ansVal, [-3, -1, 1, 3], true, rng);
  const explanation = `삼수선의 정리에 의하여 점 $\\mathrm{P}$에서 직선 $l$에 내린 수선은 점 $\\mathrm{Q}$를 지나므로 $\\overline{\\mathrm{PQ}} \\perp l$입니다.\n직각삼각형 $\\mathrm{PHQ}$에서 $\\angle \\mathrm{PHQ} = 90^\\circ$이므로 피타고라스 정리에 의해\n$$\\overline{\\mathrm{PQ}} = \\sqrt{\\overline{\\mathrm{PH}}^2 + \\overline{\\mathrm{HQ}}^2} = \\sqrt{${a}^2 + ${b}^2} = \\sqrt{${a * a + b * b}} = ${c}$$\n입니다.`;

  return {
    chapter: 10,
    chapterName: '유형 10. 삼수선의 정리',
    typeId: 10,
    subjectId: 'geometry',
    unitId: 'space-geometry',
    subUnitId: 'three-perpendiculars',
    majorUnit: '공간도형과 공간좌표',
    middleUnit: '공간도형',
    detailedType: '삼수선의 정리와 이면각의 크기',
    amcSubjectId: 'geometry',
    amcUnitId: 'space-geometry',
    tier: 'basic',
    difficulty: '기본',
    points: 3,
    type: 'multiple-choice',
    section: '기본문제 (짱쉬운 유형별)',
    question,
    choices,
    answer,
    correctAnswer,
    explanation,
  };
}

// -------------------------------------------------------------
// 유형 11. 정사영 (space-geometry / orthogonal-projection)
// -------------------------------------------------------------
export function genJjangOrthogonalProjection(tier = 'basic', rng = Math.random) {
  // S' = S * cos(theta)
  const angles = [
    { deg: 30, cosStr: '\\frac{\\sqrt{3}}{2}', mult: 2, sqrt3: true },
    { deg: 45, cosStr: '\\frac{\\sqrt{2}}{2}', mult: 2, sqrt2: true },
    { deg: 60, cosStr: '\\frac{1}{2}', mult: 2, isHalf: true },
  ];
  const picked = pickRandom(angles, rng);
  const k = randInt(2, 6, rng) * 2; // 짝수로 설정
  let sPrimeVal;
  let ansChoices;

  if (picked.isHalf) {
    const s = k;
    const ansVal = s / 2;
    const question = `넓이가 $${s}$인 평면도형의 평면 $\\alpha$ 위로의 정사영의 넓이를 구하시오. 단, 도형을 포함하는 평면과 평면 $\\alpha$가 이루는 각의 크기는 $60^\\circ$이다.`;
    const { choices, correctAnswer, answer } = buildChoices(ansVal, [-3, -1, 1, 3], true, rng);
    const explanation = `정사영의 넓이 공식을 적용하면\n$$S' = S \\cos \\theta = ${s} \\times \\cos 60^\\circ = ${s} \\times \\frac{1}{2} = ${ansVal}$$\n입니다.`;
    return {
      chapter: 11,
      chapterName: '유형 11. 정사영',
      typeId: 11,
      subjectId: 'geometry',
      unitId: 'space-geometry',
      subUnitId: 'orthogonal-projection',
      majorUnit: '공간도형과 공간좌표',
      middleUnit: '공간도형',
      detailedType: '정사영의 길이와 넓이의 계산',
      amcSubjectId: 'geometry',
      amcUnitId: 'space-geometry',
      tier: 'basic',
      difficulty: '기본',
      points: 2,
      type: 'multiple-choice',
      section: '기본문제 (짱쉬운 유형별)',
      question,
      choices,
      answer,
      correctAnswer,
      explanation,
    };
  } else if (picked.sqrt3) {
    const s = k;
    const ansNum = (s / 2);
    const ansStr = `$${ansNum === 1 ? '' : ansNum}\\sqrt{3}$`;
    const question = `넓이가 $${s}$인 평면도형의 평면 $\\alpha$ 위로의 정사영의 넓이를 구하시오. 단, 도형을 포함하는 평면과 평면 $\\alpha$가 이루는 각의 크기는 $30^\\circ$이다.`;
    const distractors = [
      `$${ansNum + 1}\\sqrt{3}$`,
      `$${ansNum - 1}\\sqrt{3}$`,
      `$${ansNum}\\sqrt{2}$`,
      `$${s}\\sqrt{3}$`,
    ];
    const { choices, correctAnswer, answer } = buildChoices(ansStr, distractors, false, rng);
    const explanation = `정사영의 넓이 공식을 적용하면\n$$S' = S \\cos \\theta = ${s} \\times \\cos 30^\\circ = ${s} \\times \\frac{\\sqrt{3}}{2} = ${ansNum}\\sqrt{3}$$\n입니다.`;
    return {
      chapter: 11,
      chapterName: '유형 11. 정사영',
      typeId: 11,
      subjectId: 'geometry',
      unitId: 'space-geometry',
      subUnitId: 'orthogonal-projection',
      majorUnit: '공간도형과 공간좌표',
      middleUnit: '공간도형',
      detailedType: '정사영의 길이와 넓이의 계산',
      amcSubjectId: 'geometry',
      amcUnitId: 'space-geometry',
      tier: 'basic',
      difficulty: '기본',
      points: 3,
      type: 'multiple-choice',
      section: '기본문제 (짱쉬운 유형별)',
      question,
      choices,
      answer,
      correctAnswer,
      explanation,
    };
  } else {
    const s = k;
    const ansNum = (s / 2);
    const ansStr = `$${ansNum === 1 ? '' : ansNum}\\sqrt{2}$`;
    const question = `넓이가 $${s}$인 평면도형의 평면 $\\alpha$ 위로의 정사영의 넓이를 구하시오. 단, 도형을 포함하는 평면과 평면 $\\alpha$가 이루는 각의 크기는 $45^\\circ$이다.`;
    const distractors = [
      `$${ansNum + 1}\\sqrt{2}$`,
      `$${ansNum - 1}\\sqrt{2}$`,
      `$${ansNum}\\sqrt{3}$`,
      `$${s}\\sqrt{2}$`,
    ];
    const { choices, correctAnswer, answer } = buildChoices(ansStr, distractors, false, rng);
    const explanation = `정사영의 넓이 공식을 적용하면\n$$S' = S \\cos \\theta = ${s} \\times \\cos 45^\\circ = ${s} \\times \\frac{\\sqrt{2}}{2} = ${ansNum}\\sqrt{2}$$\n입니다.`;
    return {
      chapter: 11,
      chapterName: '유형 11. 정사영',
      typeId: 11,
      subjectId: 'geometry',
      unitId: 'space-geometry',
      subUnitId: 'orthogonal-projection',
      majorUnit: '공간도형과 공간좌표',
      middleUnit: '공간도형',
      detailedType: '정사영의 길이와 넓이의 계산',
      amcSubjectId: 'geometry',
      amcUnitId: 'space-geometry',
      tier: 'basic',
      difficulty: '기본',
      points: 3,
      type: 'multiple-choice',
      section: '기본문제 (짱쉬운 유형별)',
      question,
      choices,
      answer,
      correctAnswer,
      explanation,
    };
  }
}

// -------------------------------------------------------------
// 유형 12. 공간좌표와 대칭이동 (space-geometry / spatial-coordinates)
// -------------------------------------------------------------
export function genJjangSpatialCoordinates(tier = 'basic', rng = Math.random) {
  const x = randNonZero(-5, 5, rng);
  const y = randNonZero(-5, 5, rng);
  const z = randNonZero(-5, 5, rng);

  const targets = [
    { name: '$xy$평면', res: `(${x}, ${y}, 0)`, sum: x + y },
    { name: '$yz$평면', res: `(0, ${y}, ${z})`, sum: y + z },
    { name: '$zx$평면', res: `(${x}, 0, ${z})`, sum: x + z },
    { name: '$z$축 대칭', res: `(${-x}, ${-y}, ${z})`, sum: -x - y + z },
  ];
  const picked = pickRandom(targets, rng);

  const question = `좌표공간의 점 $\\mathrm{P}(${x}, ${y}, ${z})$를 ${picked.name}에 대하여 대칭이동(또는 수선의 발)한 점 $\\mathrm{Q}$의 모든 좌표의 합은?`;
  const ansVal = picked.sum;
  const { choices, correctAnswer, answer } = buildChoices(ansVal, [-3, -1, 1, 3], true, rng);
  const explanation = `점 $\\mathrm{P}(${x}, ${y}, ${z})$를 ${picked.name}에 대하여 이동한 점 $\\mathrm{Q}$의 좌표는 $${picked.res}$입니다.\n따라서 모든 좌표의 합은\n$$${picked.sum}$$입니다.`;

  return {
    chapter: 12,
    chapterName: '유형 12. 공간좌표와 대칭이동',
    typeId: 12,
    subjectId: 'geometry',
    unitId: 'space-geometry',
    subUnitId: 'spatial-coordinates',
    majorUnit: '공간도형과 공간좌표',
    middleUnit: '공간좌표',
    detailedType: '좌표공간에서의 점의 좌표와 대칭이동',
    amcSubjectId: 'geometry',
    amcUnitId: 'space-geometry',
    tier: 'basic',
    difficulty: '기본',
    points: 2,
    type: 'multiple-choice',
    section: '기본문제 (짱쉬운 유형별)',
    question,
    choices,
    answer,
    correctAnswer,
    explanation,
  };
}

// -------------------------------------------------------------
// 유형 13. 선분의 내분점과 외분점 (space-geometry / division-points)
// -------------------------------------------------------------
export function genJjangDivisionPoints(tier = 'basic', rng = Math.random) {
  // 선분 AB를 1:2 또는 2:1로 내분하는 점 P
  const m = 1;
  const n = 2;
  const x1 = randInt(-3, 3, rng);
  const y1 = randInt(-3, 3, rng);
  const z1 = randInt(-3, 3, rng);
  // (x1 + 2*x2) % 3 == 0이 되도록 x2 선택
  const x2 = x1 + 3 * randInt(1, 3, rng);
  const y2 = y1 + 3 * randInt(1, 3, rng);
  const z2 = z1 + 3 * randInt(1, 3, rng);

  const px = Math.round((m * x2 + n * x1) / (m + n));
  const py = Math.round((m * y2 + n * y1) / (m + n));
  const pz = Math.round((m * z2 + n * z1) / (m + n));
  const sum = px + py + pz;

  const question = `좌표공간의 두 점 $\\mathrm{A}(${x1}, ${y1}, ${z1}), \\mathrm{B}(${x2}, ${y2}, ${z2})$에 대하여 선분 $\\mathrm{AB}$를 $1 : 2$로 내분하는 점을 $\\mathrm{P}(a, b, c)$라 할 때, $a + b + c$의 값은?`;
  const ansVal = sum;
  const { choices, correctAnswer, answer } = buildChoices(ansVal, [-3, -1, 1, 3], true, rng);
  const explanation = `내분점 공식에 의하여 점 $\\mathrm{P}(a, b, c)$의 각 좌표는\n$$a = \\frac{1 \\times (${x2}) + 2 \\times (${x1})}{1 + 2} = ${px}$$\n$$b = \\frac{1 \\times (${y2}) + 2 \\times (${y1})}{1 + 2} = ${py}$$\n$$c = \\frac{1 \\times (${z2}) + 2 \\times (${z1})}{1 + 2} = ${pz}$$\n따라서 $a + b + c = ${px} + ${py} + ${pz} = ${sum}$입니다.`;

  return {
    chapter: 13,
    chapterName: '유형 13. 선분의 내분점과 외분점',
    typeId: 13,
    subjectId: 'geometry',
    unitId: 'space-geometry',
    subUnitId: 'division-points',
    majorUnit: '공간도형과 공간좌표',
    middleUnit: '공간좌표',
    detailedType: '공간에서 선분의 내분점·외분점과 무게중심',
    amcSubjectId: 'geometry',
    amcUnitId: 'space-geometry',
    tier: 'basic',
    difficulty: '기본',
    points: 3,
    type: 'multiple-choice',
    section: '기본문제 (짱쉬운 유형별)',
    question,
    choices,
    answer,
    correctAnswer,
    explanation,
  };
}

// -------------------------------------------------------------
// 유형 14. 구의 방정식 (space-geometry / sphere-equations)
// -------------------------------------------------------------
export function genJjangSphereEquations(tier = 'basic', rng = Math.random) {
  // 구 (x-a)^2 + (y-b)^2 + (z-c)^2 = r^2
  const a = randInt(-3, 3, rng);
  const b = randInt(-3, 3, rng);
  const c = randInt(2, 5, rng);
  const r = c + randInt(1, 3, rng);
  const r2 = r * r;

  // xy 평면과 만나는 원: z = 0 -> (x-a)^2 + (y-b)^2 = r^2 - c^2
  const circleR2 = r2 - c * c;
  const question = `구 $(x ${a >= 0 ? '- ' + a : '+ ' + (-a)})^2 + (y ${b >= 0 ? '- ' + b : '+ ' + (-b)})^2 + (z - ${c})^2 = ${r2}$이 $xy$평면과 만나서 생기는 원의 넓이는?`;
  const ansStr = `$${circleR2}\\pi$`;
  const distractors = [
    `$${circleR2 + 4}\\pi$`,
    `$${circleR2 - 4}\\pi$`,
    `$${r2}\\pi$`,
    `$${circleR2 + 8}\\pi$`,
  ];
  const { choices, correctAnswer, answer } = buildChoices(ansStr, distractors, false, rng);
  const explanation = `$xy$평면과 만나는 도형은 구의 방정식에 $z = 0$을 대입하여 구합니다.\n$$(x ${a >= 0 ? '- ' + a : '+ ' + (-a)})^2 + (y ${b >= 0 ? '- ' + b : '+ ' + (-b)})^2 + (0 - ${c})^2 = ${r2}$$\n$$(x ${a >= 0 ? '- ' + a : '+ ' + (-a)})^2 + (y ${b >= 0 ? '- ' + b : '+ ' + (-b)})^2 + ${c * c} = ${r2}$$\n$$(x ${a >= 0 ? '- ' + a : '+ ' + (-a)})^2 + (y ${b >= 0 ? '- ' + b : '+ ' + (-b)})^2 = ${r2} - ${c * c} = ${circleR2}$$\n이는 반지름의 길이가 $\\sqrt{${circleR2}}$인 원이므로 그 넓이는\n$$\\pi \\times (\\sqrt{${circleR2}})^2 = ${circleR2}\\pi$$\n입니다.`;

  return {
    chapter: 14,
    chapterName: '유형 14. 구의 방정식',
    typeId: 14,
    subjectId: 'geometry',
    unitId: 'space-geometry',
    subUnitId: 'sphere-equations',
    majorUnit: '공간도형과 공간좌표',
    middleUnit: '공간좌표',
    detailedType: '구의 방정식과 평면·축과의 관계',
    amcSubjectId: 'geometry',
    amcUnitId: 'space-geometry',
    tier: 'basic',
    difficulty: '기본',
    points: 3,
    type: 'multiple-choice',
    section: '기본문제 (짱쉬운 유형별)',
    question,
    choices,
    answer,
    correctAnswer,
    explanation,
  };
}

// -------------------------------------------------------------
// 유형 15. 공간벡터의 성분과 내적 (space-geometry / spatial-vectors)
// -------------------------------------------------------------
export function genJjangSpatialVectors(tier = 'basic', rng = Math.random) {
  // 공간벡터 a = (a1, a2, a3), b = (b1, b2, x)가 수직일 때 x의 값
  const a1 = randInt(1, 4, rng);
  const a2 = randInt(1, 4, rng);
  const a3 = randInt(1, 3, rng);
  const b1 = randInt(-3, 3, rng);
  const b2 = randInt(-3, 3, rng);
  // a1*b1 + a2*b2 + a3*x = 0 -> a3*x = -(a1*b1 + a2*b2)
  // x가 정수가 되도록 설정
  const dot12 = a1 * b1 + a2 * b2;
  const k = randInt(-3, 3, rng);
  const correctedA3 = 1;
  const targetX = -dot12;

  const question = `두 공간벡터 $\\vec{a} = (${a1}, ${a2}, 1)$과 $\\vec{b} = (${b1}, ${b2}, x)$가 서로 수직일 때, 실수 $x$의 값은?`;
  const ansVal = targetX;
  const { choices, correctAnswer, answer } = buildChoices(ansVal, [-3, -1, 1, 3], true, rng);
  const explanation = `두 벡터가 서로 수직이면 내적이 $0$입니다. 즉, $\\vec{a} \\cdot \\vec{b} = 0$입니다.\n$$\\vec{a} \\cdot \\vec{b} = (${a1}) \\times (${b1}) + (${a2}) \\times (${b2}) + 1 \\times x = 0$$\n$$${dot12} + x = 0$$\n따라서 $x = ${targetX}$입니다.`;

  return {
    chapter: 15,
    chapterName: '유형 15. 공간벡터의 성분과 내적',
    typeId: 15,
    subjectId: 'geometry',
    unitId: 'space-geometry',
    subUnitId: 'spatial-vectors',
    majorUnit: '공간도형과 공간좌표',
    middleUnit: '공간벡터',
    detailedType: '공간벡터의 성분 연산과 내적',
    amcSubjectId: 'geometry',
    amcUnitId: 'space-geometry',
    tier: 'basic',
    difficulty: '기본',
    points: 3,
    type: 'multiple-choice',
    section: '기본문제 (짱쉬운 유형별)',
    question,
    choices,
    answer,
    correctAnswer,
    explanation,
  };
}

// -------------------------------------------------------------
// 유형 16. 직선과 평면의 방정식 (space-geometry / lines-planes-equations)
// -------------------------------------------------------------
export function genJjangLinesPlanesEquations(tier = 'basic', rng = Math.random) {
  // 평면 ax + by + cz + d = 0의 법선벡터 (a, b, c) 또는 직선의 방향벡터
  const a = randInt(1, 4, rng);
  const b = randInt(-4, 4, rng);
  const c = randInt(-4, 4, rng);
  const x0 = randInt(-2, 3, rng);
  const y0 = randInt(-2, 3, rng);
  const z0 = randInt(-2, 3, rng);
  const d = -(a * x0 + b * y0 + c * z0);

  const question = `점 $(${x0}, ${y0}, ${z0})$을 지나고 벡터 $\\vec{n} = (${a}, ${b}, ${c})$에 수직인 평면의 방정식에서 $x$의 계수가 $${a}$일 때, 상수항의 값은?`;
  const ansVal = d;
  const { choices, correctAnswer, answer } = buildChoices(ansVal, [-3, -1, 1, 3], true, rng);
  const explanation = `법선벡터가 $\\vec{n} = (a, b, c)$이고 점 $(x_0, y_0, z_0)$을 지나는 평면의 방정식은\n$$a(x - x_0) + b(y - y_0) + c(z - z_0) = 0$$\n입니다. 주어진 값을 대입하면\n$$${a}(x - (${x0})) + (${b})(y - (${y0})) + (${c})(z - (${z0})) = 0$$\n$$${a}x + (${b})y + (${c})z + (${d}) = 0$$\n따라서 상수항은 $${d}$입니다.`;

  return {
    chapter: 16,
    chapterName: '유형 16. 직선과 평면의 방정식',
    typeId: 16,
    subjectId: 'geometry',
    unitId: 'space-geometry',
    subUnitId: 'lines-planes-equations',
    majorUnit: '공간도형과 공간좌표',
    middleUnit: '공간도형의 방정식',
    detailedType: '방향벡터·법선벡터와 직선·평면의 방정식',
    amcSubjectId: 'geometry',
    amcUnitId: 'space-geometry',
    tier: 'basic',
    difficulty: '기본',
    points: 3,
    type: 'multiple-choice',
    section: '기본문제 (짱쉬운 유형별)',
    question,
    choices,
    answer,
    correctAnswer,
    explanation,
  };
}

// -------------------------------------------------------------
// Generator Table & Exports
// -------------------------------------------------------------
export const JJANGEASY_GEO_GENERATORS = {
  1: genJjangParabola,
  2: genJjangEllipse,
  3: genJjangHyperbola,
  4: genJjangImplicitTangent,
  5: genJjangConicTangents,
  6: genJjangVectorOperations,
  7: genJjangVectorComponents,
  8: genJjangVectorDotProduct,
  9: genJjangSpatialRelations,
  10: genJjangThreePerpendiculars,
  11: genJjangOrthogonalProjection,
  12: genJjangSpatialCoordinates,
  13: genJjangDivisionPoints,
  14: genJjangSphereEquations,
  15: genJjangSpatialVectors,
  16: genJjangLinesPlanesEquations,
};

export const JJANGEASY_GEO_GENERATORS_BY_UNIT = {
  'conic-sections': [
    genJjangParabola,
    genJjangEllipse,
    genJjangHyperbola,
    genJjangImplicitTangent,
    genJjangConicTangents,
  ],
  'plane-vectors': [
    genJjangVectorOperations,
    genJjangVectorComponents,
    genJjangVectorDotProduct,
  ],
  'space-geometry': [
    genJjangSpatialRelations,
    genJjangThreePerpendiculars,
    genJjangOrthogonalProjection,
    genJjangSpatialCoordinates,
    genJjangDivisionPoints,
    genJjangSphereEquations,
    genJjangSpatialVectors,
    genJjangLinesPlanesEquations,
  ],
};

/**
 * Generates an algorithmic Jjangeasy Geometry & Vectors problem.
 */
export function generateJjangeasyGeoProblem(unitIdOrType, options = {}) {
  const rng = options.rng || Math.random;
  const tier = 'basic';

  let fn;
  if (typeof unitIdOrType === 'number' && JJANGEASY_GEO_GENERATORS[unitIdOrType]) {
    fn = JJANGEASY_GEO_GENERATORS[unitIdOrType];
  } else if (JJANGEASY_GEO_GENERATORS_BY_UNIT[unitIdOrType]) {
    fn = pickRandom(JJANGEASY_GEO_GENERATORS_BY_UNIT[unitIdOrType], rng);
  } else {
    const all = Object.values(JJANGEASY_GEO_GENERATORS);
    fn = pickRandom(all, rng);
  }

  const prob = fn(tier, rng);
  const idSuffix = Math.floor(rng() * 90000 + 10000);

  return {
    id: `gen-jjangeasy-geo-${prob.typeId}-${idSuffix}`,
    number: options.number || 1,
    grade: 'g3',
    category: 'csat',
    sourceLabel: `짱쉬운 기하와 벡터 변형 · ${prob.chapterName} [기본문제]`,
    ...prob,
  };
}

/**
 * Generates a variant problem similar to the provided source problem.
 */
export function generateJjangeasyGeoVariant(sourceProblem, options = {}) {
  const typeId = sourceProblem?.typeId || sourceProblem?.chapter || 1;
  return generateJjangeasyGeoProblem(typeId, {
    ...options,
    number: sourceProblem?.number || 1,
  });
}
