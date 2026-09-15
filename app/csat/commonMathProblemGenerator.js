/**
 * 고1 공통수학1 / 공통수학2 (수학(상)·수학(하)) 기본문제 생성 엔진
 * (Common Mathematics Problem Generation Engine)
 *
 * 18짱쉬운 수학(상) 16대 핵심 기출/기본 유형 알고리즘 기반:
 * - 유형 01: 다항식의 연산
 * - 유형 02: 곱셈공식 및 변형
 * - 유형 03: 항등식과 미정계수법
 * - 유형 04: 나머지정리와 인수정리
 * - 유형 05: 인수분해
 * - 유형 06: 복소수의 연산과 켤레복소수
 * - 유형 07: 복소수의 거듭제곱과 주기성
 * - 유형 08: 이차방정식과 판별식
 * - 유형 09: 근과 계수의 관계
 * - 유형 10: 이차함수의 최대·최소
 * - 유형 11: 고차방정식
 * - 유형 12: 연립방정식
 * - 유형 13: 일차부등식과 연립부등식
 * - 유형 14: 이차부등식
 * - 유형 15: 평면좌표 (거리·내분점·중점)
 * - 유형 16: 직선의 방정식 (기울기·평행·수직)
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

/**
 * Builds 5 unique multiple-choice options with 4 realistic distractors.
 */
function buildChoices(correctVal, distractorFunc, rng = Math.random) {
  const choices = new Set([correctVal]);
  let safety = 0;
  while (choices.size < 5 && safety < 80) {
    safety++;
    const candidate = distractorFunc(correctVal, rng);
    if (candidate !== undefined && candidate !== null && candidate !== '') {
      choices.add(candidate);
    }
  }

  // Fallback if not enough distractors
  let offset = 1;
  while (choices.size < 5) {
    if (typeof correctVal === 'number') {
      choices.add(correctVal + offset);
      if (choices.size < 5) choices.add(correctVal - offset);
    } else {
      choices.add(`${correctVal} + ${offset}`);
    }
    offset++;
  }

  const list = Array.from(choices).sort((a, b) => {
    if (typeof a === 'number' && typeof b === 'number') return a - b;
    return String(a).localeCompare(String(b), undefined, { numeric: true });
  });

  const correctIndex = list.indexOf(correctVal);
  return {
    choices: list.map((c) => (String(c).startsWith('$') ? String(c) : `$${c}$`)),
    correctIndex,
  };
}

// -------------------------------------------------------------
// Generators by Category
// -------------------------------------------------------------

/**
 * 1. 다항식의 덧셈과 뺄셈: k1*A + k2*B
 */
function genPolyAddSub(rng) {
  const a1 = randInt(1, 4, rng);
  const b1 = randNonZero(-4, 4, rng);
  const c1 = randNonZero(-5, 5, rng);

  const a2 = randInt(1, 3, rng);
  const b2 = randNonZero(-4, 4, rng);
  const c2 = randNonZero(-5, 5, rng);

  const k1 = pickRandom([1, 2, 3], rng);
  const k2 = pickRandom([-2, -1, 1, 2], rng);

  const resA = k1 * a1 + k2 * a2;
  const resB = k1 * b1 + k2 * b2;
  const resC = k1 * c1 + k2 * c2;

  const polyStr = (a, b, c) => {
    let s = `${a === 1 ? '' : a === -1 ? '-' : a}x^2`;
    s += b > 0 ? ` + ${b === 1 ? '' : b}x` : ` - ${Math.abs(b) === 1 ? '' : Math.abs(b)}x`;
    s += c > 0 ? ` + ${c}` : ` - ${Math.abs(c)}`;
    return s;
  };

  const polyA = polyStr(a1, b1, c1);
  const polyB = polyStr(a2, b2, c2);
  const correctPoly = polyStr(resA, resB, resC);

  const opStr = `${k1 === 1 ? '' : k1}A ${k2 > 0 ? `+ ${k2 === 1 ? '' : k2}` : `- ${Math.abs(k2) === 1 ? '' : Math.abs(k2)}`}B`;

  const question = `두 다항식 $$A = ${polyA}$$, $$B = ${polyB}$$에 대하여 $$${opStr}$$를 간단히 한 것은?`;
  const explanation = `$$${opStr} = ${k1}(${polyA}) ${k2 > 0 ? `+ ${k2}` : `- ${Math.abs(k2)}`}(${polyB})$$\n` +
    `$$= (${k1 * a1}x^2 ${k1 * b1 >= 0 ? `+ ${k1 * b1}` : `- ${Math.abs(k1 * b1)}`}x ${k1 * c1 >= 0 ? `+ ${k1 * c1}` : `- ${Math.abs(k1 * c1)}`}) + (${k2 * a2}x^2 ${k2 * b2 >= 0 ? `+ ${k2 * b2}` : `- ${Math.abs(k2 * b2)}`}x ${k2 * c2 >= 0 ? `+ ${k2 * c2}` : `- ${Math.abs(k2 * c2)}`})$$\n` +
    `$$= ${correctPoly}$$`;

  const { choices, correctIndex } = buildChoices(
    correctPoly,
    (_, r) => polyStr(resA + randInt(-2, 2, r), resB + randInt(-3, 3, r), resC + randInt(-4, 4, r)),
    rng
  );

  return {
    unitId: 'polynomial-ops',
    subjectId: 'common-math-1',
    chapterName: '다항식의 연산',
    question,
    choices,
    correctAnswer: correctIndex,
    explanation,
  };
}

/**
 * 2. 곱셈공식의 변형: x+y = S, xy = P 일 때 x^2+y^2 or x^3+y^3
 */
function genMultFormulaTransform(rng) {
  const s = randInt(2, 6, rng);
  const p = randInt(-4, 4, rng);
  const isCubic = rng() < 0.4;

  if (!isCubic) {
    const val = s * s - 2 * p;
    const question = `두 실수 $x, y$에 대하여 $x + y = ${s}$, $xy = ${p}$일 때, $x^2 + y^2$의 값은?`;
    const explanation = `곱셈공식의 변형에 의하여\n` +
      `$$x^2 + y^2 = (x + y)^2 - 2xy$$\n` +
      `$$= (${s})^2 - 2 \\times (${p}) = ${s * s} - (${2 * p}) = ${val}$$`;

    const { choices, correctIndex } = buildChoices(
      val,
      (c, r) => c + pickRandom([-4, -2, 2, 4, 6, 8, -6], r),
      rng
    );

    return {
      unitId: 'polynomial-ops',
      subjectId: 'common-math-1',
      chapterName: '곱셈공식',
      question,
      choices,
      correctAnswer: correctIndex,
      explanation,
    };
  } else {
    const val = s * s * s - 3 * p * s;
    const question = `두 실수 $x, y$에 대하여 $x + y = ${s}$, $xy = ${p}$일 때, $x^3 + y^3$의 값은?`;
    const explanation = `곱셈공식의 변형에 의하여\n` +
      `$$x^3 + y^3 = (x + y)^3 - 3xy(x + y)$$\n` +
      `$$= (${s})^3 - 3 \\times (${p}) \\times (${s}) = ${s ** 3} - (${3 * p * s}) = ${val}$$`;

    const { choices, correctIndex } = buildChoices(
      val,
      (c, r) => c + pickRandom([-12, -6, 6, 12, 18, -18], r),
      rng
    );

    return {
      unitId: 'polynomial-ops',
      subjectId: 'common-math-1',
      chapterName: '곱셈공식',
      question,
      choices,
      correctAnswer: correctIndex,
      explanation,
    };
  }
}

/**
 * 3. 항등식과 미정계수법: a(x-1) + b(x+2) = px + q
 */
function genIdentityUndetermined(rng) {
  const a = randInt(1, 5, rng);
  const b = randInt(1, 5, rng);
  const x1 = 1;
  const x2 = -2;

  const p = a + b;
  const q = -a + 2 * b;

  const sumVal = a + b;
  const question = `모든 실수 $x$에 대하여 등식 $$a(x - 1) + b(x + 2) = ${p}x ${q >= 0 ? `+ ${q}` : `- ${Math.abs(q)}`}$$가 성립할 때, $a + b$의 값은? (단, $a, b$는 상수이다.)`;
  const explanation = `주어진 등식이 $x$에 대한 항등식이므로 좌변을 정리하면\n` +
    `$$(a + b)x + (-a + 2b) = ${p}x ${q >= 0 ? `+ ${q}` : `- ${Math.abs(q)}`}$$\n` +
    `계수를 비교하면\n` +
    `$$a + b = ${p}$$, $$-a + 2b = ${q}$$\n` +
    `따라서 $a = ${a}, b = ${b}$이므로 $a + b = ${sumVal}$입니다.`;

  const { choices, correctIndex } = buildChoices(
    sumVal,
    (c, r) => c + pickRandom([-3, -2, -1, 1, 2, 3, 4], r),
    rng
  );

  return {
    unitId: 'polynomial-ops',
    subjectId: 'common-math-1',
    chapterName: '항등식',
    question,
    choices,
    correctAnswer: correctIndex,
    explanation,
  };
}

/**
 * 4. 나머지정리와 인수정리: P(x) = x^3 + a*x^2 + b*x + c 를 x - alpha 로 나눈 나머지
 */
function genRemainderTheorem(rng) {
  const alpha = pickRandom([-2, -1, 1, 2, 3], rng);
  const a = randInt(-3, 3, rng);
  const b = randInt(-4, 4, rng);
  const c = randInt(-6, 6, rng);

  const rem = (alpha ** 3) + a * (alpha ** 2) + b * alpha + c;

  const polyP = `x^3 ${a > 0 ? `+ ${a}` : a < 0 ? `- ${Math.abs(a)}` : ''}x^2 ${b > 0 ? `+ ${b}` : b < 0 ? `- ${Math.abs(b)}` : ''}x ${c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`}`.replace(/\s+/g, ' ');

  const divisor = alpha > 0 ? `x - ${alpha}` : `x + ${Math.abs(alpha)}`;
  const question = `다항식 $P(x) = ${polyP}$를 $${divisor}$로 나누었을 때의 나머지는?`;
  const explanation = `나머지정리에 의하여 다항식 $P(x)$를 $${divisor}$로 나눈 나머지는 $P(${alpha})$입니다.\n` +
    `$$P(${alpha}) = (${alpha})^3 ${a >= 0 ? `+ ${a}` : `- ${Math.abs(a)}`}(${alpha})^2 ${b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`}(${alpha}) ${c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`}$$\n` +
    `$$= ${alpha ** 3} ${a * alpha ** 2 >= 0 ? `+ ${a * alpha ** 2}` : `- ${Math.abs(a * alpha ** 2)}`} ${b * alpha >= 0 ? `+ ${b * alpha}` : `- ${Math.abs(b * alpha)}`} ${c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`} = ${rem}$$`;

  const { choices, correctIndex } = buildChoices(
    rem,
    (val, r) => val + pickRandom([-4, -2, -1, 1, 2, 3, 5], r),
    rng
  );

  return {
    unitId: 'polynomial-ops',
    subjectId: 'common-math-1',
    chapterName: '나머지정리와 인수정리',
    question,
    choices,
    correctAnswer: correctIndex,
    explanation,
  };
}

/**
 * 5. 복소수의 연산: (a + bi)(c + di) 또는 z + z_bar, z * z_bar
 */
function genComplexArithmetic(rng) {
  const a = randNonZero(-4, 4, rng);
  const b = randNonZero(-4, 4, rng);
  const mode = pickRandom(['norm', 'add', 'bar'], rng);

  if (mode === 'norm') {
    const val = a * a + b * b;
    const zStr = `${a} ${b > 0 ? `+ ${b === 1 ? '' : b}` : `- ${Math.abs(b) === 1 ? '' : Math.abs(b)}`}i`;
    const question = `복소수 $z = ${zStr}$에 대하여 그 켤레복소수를 $\\overline{z}$라 할 때, $z\\overline{z}$의 값은?`;
    const explanation = `$z = ${zStr}$의 켤레복소수는 $\\overline{z} = ${a} ${b > 0 ? `- ${b === 1 ? '' : b}` : `+ ${Math.abs(b) === 1 ? '' : Math.abs(b)}`}i$입니다.\n` +
      `$$z\\overline{z} = (${a})^2 + (${Math.abs(b)})^2 = ${a * a} + ${b * b} = ${val}$$`;

    const { choices, correctIndex } = buildChoices(
      val,
      (c, r) => c + pickRandom([-6, -4, -2, 2, 4, 6, 8], r),
      rng
    );

    return {
      unitId: 'equations-inequalities',
      subjectId: 'common-math-1',
      chapterName: '복소수의 연산',
      question,
      choices,
      correctAnswer: correctIndex,
      explanation,
    };
  } else {
    const c = randNonZero(-3, 3, rng);
    const d = randNonZero(-3, 3, rng);
    const realPart = a * c - b * d;
    const imagPart = a * d + b * c;

    const z1 = `${a} ${b > 0 ? `+ ${b === 1 ? '' : b}` : `- ${Math.abs(b) === 1 ? '' : Math.abs(b)}`}i`;
    const z2 = `${c} ${d > 0 ? `+ ${d === 1 ? '' : d}` : `- ${Math.abs(d) === 1 ? '' : Math.abs(d)}`}i`;
    const resStr = `${realPart} ${imagPart >= 0 ? `+ ${imagPart === 1 ? '' : imagPart}` : `- ${Math.abs(imagPart) === 1 ? '' : Math.abs(imagPart)}`}i`;

    const question = `두 복소수의 곱 $(${z1})(${z2})$을 계산한 것은?`;
    const explanation = `$$(${z1})(${z2}) = ${a}\\times(${c}) + ${a}\\times(${d}i) + (${b}i)\\times(${c}) + (${b}i)\\times(${d}i)$$\n` +
      `$$= ${a * c} + ${a * d}i ${b * c >= 0 ? `+ ${b * c}` : `- ${Math.abs(b * c)}`}i + (${b * d})i^2$$\n` +
      `$i^2 = -1$이므로\n` +
      `$$= (${a * c} - ${b * d}) + (${a * d + b * c})i = ${resStr}$$`;

    const { choices, correctIndex } = buildChoices(
      resStr,
      (_, r) => `${realPart + randInt(-3, 3, r)} ${imagPart + randInt(-3, 3, r) >= 0 ? '+' : '-'} ${Math.abs(imagPart + randInt(-3, 3, r))}i`,
      rng
    );

    return {
      unitId: 'equations-inequalities',
      subjectId: 'common-math-1',
      chapterName: '복소수의 연산',
      question,
      choices,
      correctAnswer: correctIndex,
      explanation,
    };
  }
}

/**
 * 6. 근과 계수의 관계: x^2 - px + q = 0 의 두 근 alpha, beta 에 대해 alpha^2 + beta^2
 */
function genRootsRelations(rng) {
  const p = randInt(2, 7, rng); // alpha + beta
  const q = randInt(-5, 5, rng); // alpha * beta
  const val = p * p - 2 * q;

  const eqStr = `x^2 - ${p}x ${q >= 0 ? `+ ${q}` : `- ${Math.abs(q)}`} = 0`;
  const question = `이차방정식 $${eqStr}$의 두 실근을 $\\alpha, \\beta$라 할 때, $\\alpha^2 + \\beta^2$의 값은?`;
  const explanation = `근과 계수의 관계에 의하여\n` +
    `$$\\alpha + \\beta = ${p}, \\quad \\alpha\\beta = ${q}$$\n` +
    `따라서 곱셈공식 변형에 의하여\n` +
    `$$\\alpha^2 + \\beta^2 = (\\alpha + \\beta)^2 - 2\\alpha\\beta$$\n` +
    `$$= (${p})^2 - 2(${q}) = ${p * p} - (${2 * q}) = ${val}$$`;

  const { choices, correctIndex } = buildChoices(
    val,
    (c, r) => c + pickRandom([-6, -4, -2, 2, 4, 6, 8], r),
    rng
  );

  return {
    unitId: 'equations-inequalities',
    subjectId: 'common-math-1',
    chapterName: '근과 계수의 관계',
    question,
    choices,
    correctAnswer: correctIndex,
    explanation,
  };
}

/**
 * 7. 이차방정식과 판별식: D = 0 (중근) 조건
 */
function genQuadraticDiscriminant(rng) {
  const k = randInt(1, 6, rng);
  const c = k * k; // x^2 - 2kx + k^2 = 0
  const question = `이차방정식 $x^2 - 2kx + ${c} = 0$이 중근을 갖도록 하는 양수 $k$의 값은?`;
  const explanation = `이차방정식이 중근을 가지려면 판별식 $D = 0$이어야 합니다.\n` +
    `$$\\frac{D}{4} = (-k)^2 - 1 \\times ${c} = k^2 - ${c} = 0$$\n` +
    `$$k^2 = ${c} \\implies k = ${k} \\quad (\\because k > 0)$$`;

  const { choices, correctIndex } = buildChoices(
    k,
    (v, r) => v + pickRandom([-3, -2, -1, 1, 2, 3], r),
    rng
  );

  return {
    unitId: 'equations-inequalities',
    subjectId: 'common-math-1',
    chapterName: '이차방정식과 판별식',
    question,
    choices,
    correctAnswer: correctIndex,
    explanation,
  };
}

/**
 * 8. 이차함수의 최대·최소
 */
function genQuadraticVertex(rng) {
  const p = randInt(1, 4, rng);
  const q = randInt(-5, 5, rng);
  const a = pickRandom([-1, 1], rng);

  // y = a(x - p)^2 + q = a x^2 - 2ap x + a p^2 + q
  const bCoeff = -2 * a * p;
  const cCoeff = a * (p ** 2) + q;

  const funcStr = `${a === 1 ? '' : '-'}x^2 ${bCoeff > 0 ? `+ ${bCoeff}` : `- ${Math.abs(bCoeff)}`}x ${cCoeff >= 0 ? `+ ${cCoeff}` : `- ${Math.abs(cCoeff)}`}`;
  const targetLabel = a === 1 ? '최솟값' : '최댓값';

  const question = `이차함수 $y = ${funcStr}$의 ${targetLabel}은?`;
  const explanation = `주어진 이차함수를 완전제곱식으로 변형하면\n` +
    `$$y = ${a === 1 ? '' : '-'}(x^2 - ${2 * p}x) ${cCoeff >= 0 ? `+ ${cCoeff}` : `- ${Math.abs(cCoeff)}`}$$\n` +
    `$$= ${a === 1 ? '' : '-'}(x - ${p})^2 + ${q}$$\n` +
    `따라서 $x = ${p}$일 때 ${targetLabel}은 $${q}$입니다.`;

  const { choices, correctIndex } = buildChoices(
    q,
    (v, r) => v + pickRandom([-4, -3, -2, -1, 1, 2, 3, 4], r),
    rng
  );

  return {
    unitId: 'equations-inequalities',
    subjectId: 'common-math-1',
    chapterName: '이차함수의 활용',
    question,
    choices,
    correctAnswer: correctIndex,
    explanation,
  };
}

/**
 * 9. 이차부등식: (x - a)(x - b) <= 0 의 정수해 개수
 */
function genQuadraticInequality(rng) {
  const a = randInt(-4, 2, rng);
  const b = a + randInt(3, 7, rng); // a < b
  const count = b - a + 1;

  const s = a + b;
  const p = a * b;

  const ineqStr = `x^2 ${s > 0 ? `- ${s}` : `+ ${Math.abs(s)}`}x ${p >= 0 ? `+ ${p}` : `- ${Math.abs(p)}`} \\le 0`;
  const question = `이차부등식 $$${ineqStr}$$을 만족시키는 모든 정수 $x$의 개수는?`;
  const explanation = `좌변을 인수분해하면\n` +
    `$$(x ${a > 0 ? `- ${a}` : `+ ${Math.abs(a)}`})(x ${b > 0 ? `- ${b}` : `+ ${Math.abs(b)}`}) \\le 0$$\n` +
    `따라서 해의 범위는 $$${a} \\le x \\le ${b}$$입니다.\n` +
    `이 범위를 만족하는 정수 $x$는 $${a}$부터 $${b}$까지이므로\n` +
    `개수는 $${b} - (${a}) + 1 = ${count}$개입니다.`;

  const { choices, correctIndex } = buildChoices(
    count,
    (v, r) => v + pickRandom([-3, -2, -1, 1, 2, 3, 4], r),
    rng
  );

  return {
    unitId: 'equations-inequalities',
    subjectId: 'common-math-1',
    chapterName: '이차부등식',
    question,
    choices,
    correctAnswer: correctIndex,
    explanation,
  };
}

/**
 * 10. 평면좌표: 두 점 사이의 거리
 */
function genDistancePoints(rng) {
  const dx = pickRandom([3, 4, 5, 6, 8], rng);
  const dy = pickRandom([3, 4, 5, 6, 8], rng);
  const x1 = randInt(-3, 3, rng);
  const y1 = randInt(-3, 3, rng);
  const x2 = x1 + dx;
  const y2 = y1 + dy;

  const dSquared = dx * dx + dy * dy;
  const dist = Math.sqrt(dSquared);
  const isExactInt = Number.isInteger(dist);

  const ansStr = isExactInt ? String(dist) : `\\sqrt{${dSquared}}`;

  const question = `좌표평면 위의 두 점 $A(${x1}, ${y1})$, $B(${x2}, ${y2})$ 사이의 거리는?`;
  const explanation = `두 점 $A(x_1, y_1), B(x_2, y_2)$ 사이의 거리 공식에 의하여\n` +
    `$$\\overline{AB} = \\sqrt{(${x2} - (${x1}))^2 + (${y2} - (${y1}))^2}$$\n` +
    `$$= \\sqrt{(${dx})^2 + (${dy})^2} = \\sqrt{${dx * dx} + ${dy * dy}} = ${ansStr}$$`;

  const { choices, correctIndex } = buildChoices(
    ansStr,
    (val, r) => (isExactInt ? String(dist + pickRandom([-2, -1, 1, 2, 3], r)) : `\\sqrt{${dSquared + pickRandom([-6, -4, 4, 6, 8], r)}}`),
    rng
  );

  return {
    unitId: 'coordinate-geometry-equations',
    subjectId: 'common-math-2',
    chapterName: '평면좌표',
    question,
    choices,
    correctAnswer: correctIndex,
    explanation,
  };
}

/**
 * 11. 직선의 방정식: 두 점을 지나는 직선 또는 수직인 직선
 */
function genLinearEquation(rng) {
  const x1 = randInt(1, 4, rng);
  const y1 = randInt(-3, 5, rng);
  const m = pickRandom([-3, -2, -1, 1, 2, 3], rng);

  // y - y1 = m(x - x1) => y = m*x - m*x1 + y1
  const yIntercept = -m * x1 + y1;

  const question = `점 $A(${x1}, ${y1})$을 지나고 기울기가 $${m}$인 직선의 $y$절편은?`;
  const explanation = `점 $A(${x1}, ${y1})$을 지나고 기울기가 $${m}$인 직선의 방정식은\n` +
    `$$y - (${y1}) = ${m}(x - ${x1})$$\n` +
    `$$y = ${m}x ${-m * x1 >= 0 ? `+ ${-m * x1}` : `- ${Math.abs(m * x1)}`} ${y1 >= 0 ? `+ ${y1}` : `- ${Math.abs(y1)}`}$$\n` +
    `$$y = ${m}x ${yIntercept >= 0 ? `+ ${yIntercept}` : `- ${Math.abs(yIntercept)}`}$$\n` +
    `따라서 $x = 0$일 때 $y$절편은 $${yIntercept}$입니다.`;

  const { choices, correctIndex } = buildChoices(
    yIntercept,
    (v, r) => v + pickRandom([-4, -3, -2, -1, 1, 2, 3, 4], r),
    rng
  );

  return {
    unitId: 'coordinate-geometry-equations',
    subjectId: 'common-math-2',
    chapterName: '직선의 방정식',
    question,
    choices,
    correctAnswer: correctIndex,
    explanation,
  };
}

// -------------------------------------------------------------
// Public Engine API
// -------------------------------------------------------------

const GENERATORS_BY_UNIT = {
  'polynomial-ops': [
    genPolyAddSub,
    genMultFormulaTransform,
    genIdentityUndetermined,
    genRemainderTheorem,
  ],
  'equations-inequalities': [
    genComplexArithmetic,
    genRootsRelations,
    genQuadraticDiscriminant,
    genQuadraticVertex,
    genQuadraticInequality,
  ],
  'coordinate-geometry-equations': [
    genDistancePoints,
    genLinearEquation,
  ],
};

const ALL_GENERATORS = [
  genPolyAddSub,
  genMultFormulaTransform,
  genIdentityUndetermined,
  genRemainderTheorem,
  genComplexArithmetic,
  genRootsRelations,
  genQuadraticDiscriminant,
  genQuadraticVertex,
  genQuadraticInequality,
  genDistancePoints,
  genLinearEquation,
];

/**
 * Generates an algorithmic problem for a given unit or category.
 */
export function generateCommonMathProblem(unitId, options = {}) {
  const rng = options.rng || Math.random;
  let generatorList = GENERATORS_BY_UNIT[unitId];
  if (!generatorList || generatorList.length === 0) {
    generatorList = ALL_GENERATORS;
  }

  const fn = pickRandom(generatorList, rng);
  const prob = fn(rng);
  const idSuffix = Math.floor(rng() * 90000 + 10000);

  return {
    id: `gen-common-math-${prob.unitId}-${idSuffix}`,
    number: options.number || 1,
    tier: 'basic',
    grade: 'g1',
    points: 2,
    type: 'multiple_choice',
    sourceLabel: `공통수학1 알고리즘 변형 · ${prob.chapterName}`,
    category: 'csat',
    ...prob,
  };
}

/**
 * Generates a variant problem similar to the provided source problem.
 */
export function generateCommonMathVariant(sourceProblem, options = {}) {
  const unitId = sourceProblem?.unitId || 'polynomial-ops';
  return generateCommonMathProblem(unitId, {
    ...options,
    number: sourceProblem?.number || 1,
  });
}
