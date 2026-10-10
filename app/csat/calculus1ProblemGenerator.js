/**
 * 짱쉬운 미적분 1 (Calculus 1 Basic & CSAT) 문제 생성 엔진
 * (Calculus 1 Algorithmic Problem Generation Engine)
 *
 * 15대 핵심 기출/기본 유형 알고리즘 기반:
 * - 유형 01: 분수식의 극한값 (sequence-limits / calculus)
 * - 유형 02: 무리식의 극한값 (sequence-limits / calculus)
 * - 유형 03: 지수로 표현된 식의 극한값 (sequence-limits / calculus)
 * - 유형 04: 급수 (sequence-limits / calculus)
 * - 유형 05: 다항함수, 분수함수의 극한 (limits-continuity / math2)
 * - 유형 06: 무리함수의 극한 (limits-continuity / math2)
 * - 유형 07: 좌극한과 우극한 (limits-continuity / math2)
 * - 유형 08: 함수의 연속 (limits-continuity / math2)
 * - 유형 09: 미분계수 구하기 (differentiation / math2)
 * - 유형 10: 미분계수의 정의 (differentiation / math2)
 * - 유형 11: 접선의 방정식 (differentiation / math2)
 * - 유형 12: 극대와 극소 (differentiation / math2)
 * - 유형 13: 정적분 (integration / math2)
 * - 유형 14: 적분과 미분의 관계 (integration / math2)
 * - 유형 15: 넓이 (integration / math2)
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

  // Fallback if needed
  let offset = 1;
  while (choices.size < 5) {
    choices.add(`${parseInt(correctVal, 10) || 0 + offset}`);
    offset++;
  }

  const choiceList = Array.from(choices);
  for (let i = choiceList.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [choiceList[i], choiceList[j]] = [choiceList[j], choiceList[i]];
  }

  const correctIndex = choiceList.indexOf(correctVal);
  return {
    choices: choiceList.map((c) => (c.startsWith('$') ? c : `$${c}$`)),
    correctAnswer: correctIndex >= 0 ? correctIndex : 0,
    answer: String(correctIndex >= 0 ? correctIndex : 0),
  };
}

// -------------------------------------------------------------
// 1. 유형 01: 분수식의 극한값
// -------------------------------------------------------------
export function genFractionLimit(rng = Math.random) {
  const a = randInt(2, 7, rng);
  const b = randInt(1, 9, rng);
  const c = randInt(1, 4, rng);
  const d = randNonZero(-5, 5, rng);

  const fracStr = simplifyFrac(a, c);
  const question = `$$\\lim_{n \\to \\infty} \\frac{${a}n^2 + ${b}}{${c === 1 ? '' : c}n^2 ${d >= 0 ? '+' : ''}${d}n}$$의 값은?`;
  const explanation = `분모의 최고차항인 $n^2$으로 분모, 분자를 나누면:
$$\\lim_{n \\to \\infty} \\frac{${a} + \\frac{${b}}{n^2}}{${c} + \\frac{${d}}{n}} = \\frac{${a}}{${c}} = ${fracStr}$$
따라서 정답은 $${fracStr}$입니다.`;

  const { choices, correctAnswer, answer } = buildChoices(fracStr, (cVal, r) => {
    const na = randInt(1, 8, r);
    const nc = randInt(1, 5, r);
    return simplifyFrac(na, nc);
  }, rng);

  return {
    unitId: 'sequence-limits',
    subjectId: 'calculus',
    amcSubjectId: 'algebra',
    amcUnitId: 'sequences-patterns',
    chapterName: '분수식의 극한값',
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -------------------------------------------------------------
// 2. 유형 02: 무리식의 극한값 (∞ - ∞ 꼴 유리화)
// -------------------------------------------------------------
export function genRadicalLimit(rng = Math.random) {
  const k = randInt(1, 6, rng) * 2; // even number for clean answer
  const c = randInt(1, 9, rng);
  const ansVal = `${k / 2}`;

  const question = `$$\\lim_{n \\to \\infty} (\\sqrt{n^2 + ${k}n + ${c}} - n)$$의 값은?`;
  const explanation = `분자를 유리화하면:
$$\\lim_{n \\to \\infty} \\frac{(n^2 + ${k}n + ${c}) - n^2}{\\sqrt{n^2 + ${k}n + ${c}} + n} = \\lim_{n \\to \\infty} \\frac{${k}n + ${c}}{\\sqrt{n^2 + ${k}n + ${c}} + n}$$
분모, 분자를 $n$으로 나누면:
$$\\frac{${k}}{1 + 1} = \\frac{${k}}{2} = ${ansVal}$$
따라서 극한값은 $${ansVal}$입니다.`;

  const { choices, correctAnswer, answer } = buildChoices(ansVal, (cVal, r) => {
    return `${randInt(1, 10, r)}`;
  }, rng);

  return {
    unitId: 'sequence-limits',
    subjectId: 'calculus',
    amcSubjectId: 'algebra',
    amcUnitId: 'radical-equations',
    chapterName: '무리식의 극한값',
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -------------------------------------------------------------
// 3. 유형 03: 지수로 표현된 식의 극한값
// -------------------------------------------------------------
export function genExponentialLimit(rng = Math.random) {
  const base = pickRandom([3, 4, 5], rng);
  const smallBase = base - 1;
  const a = randInt(2, 5, rng);
  const p = randInt(1, 2, rng); // power offset: base^(n+p)
  const c = randInt(1, 3, rng);

  const numCoeff = a * (base ** p);
  const ansStr = simplifyFrac(numCoeff, c);

  const question = `$$\\lim_{n \\to \\infty} \\frac{${a} \\cdot ${base}^{n+${p}} + ${smallBase}^n}{${c === 1 ? '' : c} \\cdot ${base}^n - 1}$$의 값은?`;
  const explanation = `밑의 절댓값이 가장 큰 $${base}^n$으로 분모와 분자를 각각 나누면:
$$\\lim_{n \\to \\infty} \\frac{${a} \\cdot ${base}^{${p}} + \\left(\\frac{${smallBase}}{${base}}\\right)^n}{${c} - \\left(\\frac{1}{${base}}\\right)^n} = \\frac{${numCoeff}}{${c}} = ${ansStr}$$
따라서 정답은 $${ansStr}$입니다.`;

  const { choices, correctAnswer, answer } = buildChoices(ansStr, (cVal, r) => {
    const na = randInt(1, 15, r);
    const nc = randInt(1, 3, r);
    return simplifyFrac(na, nc);
  }, rng);

  return {
    unitId: 'sequence-limits',
    subjectId: 'calculus',
    amcSubjectId: 'algebra',
    amcUnitId: 'exponential-logarithmic',
    chapterName: '지수로 표현된 식의 극한값',
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -------------------------------------------------------------
// 4. 유형 04: 급수 (등비급수)
// -------------------------------------------------------------
export function genInfiniteSeries(rng = Math.random) {
  const num = randInt(1, 3, rng);
  const den = randInt(num + 1, num + 4, rng); // |r| < 1
  const firstTermNum = num;
  const firstTermDen = den;

  // S = (num/den) / (1 - num/den) = num / (den - num)
  const sumVal = simplifyFrac(num, den - num);

  const question = `$$\\sum_{n=1}^{\\infty} \\left(\\frac{${num}}{${den}}\\right)^n$$의 값은?`;
  const explanation = `첫째항 $a = \\frac{${num}}{${den}}$, 공비 $r = \\frac{${num}}{${den}}$인 무한등비급수이므로 $|r| < 1$에서 수렴합니다.
$$S = \\frac{a}{1 - r} = \\frac{\\frac{${num}}{${den}}}{1 - \\frac{${num}}{${den}}} = \\frac{\\frac{${num}}{${den}}}{\\frac{${den - num}}{${den}}} = ${sumVal}$$
따라서 급수의 합은 $${sumVal}$입니다.`;

  const { choices, correctAnswer, answer } = buildChoices(sumVal, (cVal, r) => {
    const na = randInt(1, 5, r);
    const nb = randInt(1, 4, r);
    return simplifyFrac(na, nb);
  }, rng);

  return {
    unitId: 'sequence-limits',
    subjectId: 'calculus',
    amcSubjectId: 'algebra',
    amcUnitId: 'sequences-patterns',
    chapterName: '급수',
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -------------------------------------------------------------
// 5. 유형 05: 다항함수, 분수함수의 극한 (0/0 꼴 인수분해)
// -------------------------------------------------------------
export function genRationalFuncLimit(rng = Math.random) {
  const a = randInt(1, 4, rng);
  const b = randInt(1, 5, rng);
  // (x - a)(x + b) / (x - a) as x -> a => a + b
  const ansVal = `${a + b}`;
  const expandedConst = -a * b;
  const middleCoeff = b - a;

  const middleTerm = middleCoeff === 0 ? '' : (middleCoeff > 0 ? `+ ${middleCoeff === 1 ? '' : middleCoeff}x` : `- ${Math.abs(middleCoeff) === 1 ? '' : Math.abs(middleCoeff)}x`);
  const constTerm = expandedConst >= 0 ? `+ ${expandedConst}` : `- ${Math.abs(expandedConst)}`;

  const question = `$$\\lim_{x \\to ${a}} \\frac{x^2 ${middleTerm} ${constTerm}}{x - ${a}}$$의 값은?`;
  const explanation = `분자를 인수분해하면 $(x - ${a})(x + ${b})$입니다.
$$\\lim_{x \\to ${a}} \\frac{(x - ${a})(x + ${b})}{x - ${a}} = \\lim_{x \\to ${a}} (x + ${b}) = ${a} + ${b} = ${ansVal}$$
따라서 극한값은 $${ansVal}$입니다.`;

  const { choices, correctAnswer, answer } = buildChoices(ansVal, (cVal, r) => {
    return `${randInt(2, 12, r)}`;
  }, rng);

  return {
    unitId: 'limits-continuity',
    subjectId: 'math2',
    amcSubjectId: 'advanced',
    amcUnitId: 'rational-functions',
    chapterName: '다항함수, 분수함수의 극한',
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -------------------------------------------------------------
// 6. 유형 06: 무리함수의 극한 (0/0 꼴 유리화)
// -------------------------------------------------------------
export function genRadicalFuncLimit(rng = Math.random) {
  const a = randInt(1, 4, rng);
  const k = randInt(2, 4, rng);
  const constInRoot = k * k - a; // so sqrt(a + constInRoot) = k
  const ansFrac = simplifyFrac(1, 2 * k);

  const question = `$$\\lim_{x \\to ${a}} \\frac{\\sqrt{x + ${constInRoot}} - ${k}}{x - ${a}}$$의 값은?`;
  const explanation = `분자를 유리화하면:
$$\\lim_{x \\to ${a}} \\frac{(x + ${constInRoot}) - ${k * k}}{(x - ${a})(\\sqrt{x + ${constInRoot}} + ${k})} = \\lim_{x \\to ${a}} \\frac{x - ${a}}{(x - ${a})(\\sqrt{x + ${constInRoot}} + ${k})}$$
 약분 후 $x=${a}$를 대입하면:
$$\\frac{1}{${k} + ${k}} = ${ansFrac}$$
따라서 극한값은 $${ansFrac}$입니다.`;

  const { choices, correctAnswer, answer } = buildChoices(ansFrac, (cVal, r) => {
    const den = pickRandom([2, 4, 6, 8], r);
    return simplifyFrac(1, den);
  }, rng);

  return {
    unitId: 'limits-continuity',
    subjectId: 'math2',
    amcSubjectId: 'advanced',
    amcUnitId: 'radical-equations',
    chapterName: '무리함수의 극한',
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -------------------------------------------------------------
// 7. 유형 07: 좌극한과 우극한
// -------------------------------------------------------------
export function genOneSidedLimit(rng = Math.random) {
  const c = randInt(1, 4, rng);
  const m = randInt(2, 4, rng);
  const leftVal = randInt(1, 5, rng);
  const rightVal = leftVal + m;
  const sumVal = `${leftVal + rightVal}`;

  const question = `함수 $f(x)$에 대하여 $\\lim_{x \\to ${c}^-} f(x) = ${leftVal}$, $\\lim_{x \\to ${c}^+} f(x) = ${rightVal}$일 때,
$$\\lim_{x \\to ${c}^-} f(x) + \\lim_{x \\to ${c}^+} f(x)$$의 값은?`;
  const explanation = `주어진 좌극한과 우극한의 값을 각각 대입하여 합을 구합니다.
$$\\lim_{x \\to ${c}^-} f(x) + \\lim_{x \\to ${c}^+} f(x) = ${leftVal} + ${rightVal} = ${sumVal}$$
따라서 정답은 $${sumVal}$입니다.`;

  const { choices, correctAnswer, answer } = buildChoices(sumVal, (cVal, r) => {
    return `${randInt(2, 14, r)}`;
  }, rng);

  return {
    unitId: 'limits-continuity',
    subjectId: 'math2',
    amcSubjectId: 'functions',
    amcUnitId: 'function-properties',
    chapterName: '좌극한과 우극한',
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -------------------------------------------------------------
// 8. 유형 08: 함수의 연속
// -------------------------------------------------------------
export function genContinuity(rng = Math.random) {
  const c = randInt(1, 3, rng);
  const m = randInt(2, 4, rng);
  const constPart = randInt(1, 5, rng);
  // f(x) = m*x + a for x >= c, f(x) = x^2 + constPart for x < c
  // m*c + a = c^2 + constPart => a = c^2 + constPart - m*c
  const aVal = c * c + constPart - m * c;
  const ansStr = `${aVal}`;

  const question = `함수 $f(x) = \\begin{cases} ${m}x + a & (x \\ge ${c}) \\\\ x^2 + ${constPart} & (x < ${c}) \\end{cases}$ 가 $x = ${c}$에서 연속일 때, 상수 $a$의 값은?`;
  const explanation = `$x = ${c}$에서 연속이려면 우극한(함숫값)과 좌극한이 같아야 합니다.
$$f(${c}) = ${m}(${c}) + a = ${m * c} + a$$
$$\\lim_{x \\to ${c}^-} f(x) = ${c}^2 + ${constPart} = ${c * c + constPart}$$
두 값이 같으므로:
$$${m * c} + a = ${c * c + constPart} \\implies a = ${ansStr}$$
따라서 상수 $a$의 값은 $${ansStr}$입니다.`;

  const { choices, correctAnswer, answer } = buildChoices(ansStr, (cVal, r) => {
    return `${randInt(-4, 8, r)}`;
  }, rng);

  return {
    unitId: 'limits-continuity',
    subjectId: 'math2',
    amcSubjectId: 'functions',
    amcUnitId: 'function-properties',
    chapterName: '함수의 연속',
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -------------------------------------------------------------
// 9. 유형 09: 미분계수 구하기
// -------------------------------------------------------------
export function genDerivativeValue(rng = Math.random) {
  const a = randInt(1, 3, rng);
  const b = randInt(1, 5, rng);
  const cVal = randNonZero(-4, 4, rng);
  const x0 = randInt(1, 3, rng);

  // f(x) = a*x^3 + b*x^2 + c*x
  // f'(x) = 3a*x^2 + 2b*x + c
  const derVal = 3 * a * (x0 ** 2) + 2 * b * x0 + cVal;
  const ansStr = `${derVal}`;

  const signB = b >= 0 ? `+ ${b === 1 ? '' : b}` : `- ${Math.abs(b)}`;
  const signC = cVal >= 0 ? `+ ${cVal}` : `- ${Math.abs(cVal)}`;

  const question = `함수 $f(x) = ${a === 1 ? '' : a}x^3 ${signB}x^2 ${signC}x$에 대하여 $f'(${x0})$의 값은?`;
  const explanation = `도함수 $f'(x)$를 구하면:
$$f'(x) = ${3 * a}x^2 + ${2 * b}x ${cVal >= 0 ? '+' : ''}${cVal}$$
$x = ${x0}$을 대입하면:
$$f'(${x0}) = ${3 * a}(${x0}^2) + ${2 * b}(${x0}) ${cVal >= 0 ? '+' : ''}${cVal} = ${3 * a * (x0 ** 2)} + ${2 * b * x0} ${cVal >= 0 ? '+' : ''}${cVal} = ${ansStr}$$
따라서 정답은 $${ansStr}$입니다.`;

  const { choices, correctAnswer, answer } = buildChoices(ansStr, (cVal, r) => {
    return `${randInt(derVal - 6, derVal + 8, r)}`;
  }, rng);

  return {
    unitId: 'differentiation',
    subjectId: 'math2',
    amcSubjectId: 'advanced',
    amcUnitId: 'polynomial-arithmetic',
    chapterName: '미분계수 구하기',
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -------------------------------------------------------------
// 10. 유형 10: 미분계수의 정의
// -------------------------------------------------------------
export function genDerivativeDefinition(rng = Math.random) {
  const x0 = randInt(1, 3, rng);
  const k = randInt(2, 4, rng);
  const fPrime = randInt(2, 8, rng);
  const ansVal = `${k * fPrime}`;

  const question = `미분가능한 함수 $f(x)$에 대하여 $f'(${x0}) = ${fPrime}$일 때,
$$\\lim_{h \\to 0} \\frac{f(${x0} + ${k}h) - f(${x0})}{h}$$의 값은?`;
  const explanation = `미분계수의 정의에 의해:
$$\\lim_{h \\to 0} \\frac{f(${x0} + ${k}h) - f(${x0})}{h} = \\lim_{h \\to 0} \\left[ \\frac{f(${x0} + ${k}h) - f(${x0})}{${k}h} \\times ${k} \\right] = ${k} f'(${x0})$$
$f'(${x0}) = ${fPrime}$이므로:
$$${k} \\times ${fPrime} = ${ansVal}$$
따라서 정답은 $${ansVal}$입니다.`;

  const { choices, correctAnswer, answer } = buildChoices(ansVal, (cVal, r) => {
    return `${randInt(k * fPrime - 8, k * fPrime + 12, r)}`;
  }, rng);

  return {
    unitId: 'differentiation',
    subjectId: 'math2',
    amcSubjectId: 'advanced',
    amcUnitId: 'polynomial-arithmetic',
    chapterName: '미분계수의 정의',
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -------------------------------------------------------------
// 11. 유형 11: 접선의 방정식
// -------------------------------------------------------------
export function genTangentLine(rng = Math.random) {
  const a = randInt(1, 3, rng);
  const x0 = randInt(1, 3, rng);
  const y0 = a * x0 * x0;
  const slope = 2 * a * x0;
  // y - y0 = slope*(x - x0) => y = slope*x + (y0 - slope*x0)
  const yIntercept = y0 - slope * x0;
  const ansStr = `${slope}`;

  const question = `곡선 $y = ${a === 1 ? '' : a}x^2$ 위의 점 $(${x0}, ${y0})$에서의 접선의 기울기는?`;
  const explanation = `$y' = ${2 * a}x$이므로, $x = ${x0}$에서의 접선의 기울기는:
$$m = ${2 * a}(${x0}) = ${ansStr}$$
따라서 접선의 기울기는 $${ansStr}$입니다.`;

  const { choices, correctAnswer, answer } = buildChoices(ansStr, (cVal, r) => {
    return `${randInt(1, 15, r)}`;
  }, rng);

  return {
    unitId: 'differentiation',
    subjectId: 'math2',
    amcSubjectId: 'advanced',
    amcUnitId: 'coordinate-geometry-equations',
    chapterName: '접선의 방정식',
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -------------------------------------------------------------
// 12. 유형 12: 극대와 극소
// -------------------------------------------------------------
export function genExtrema(rng = Math.random) {
  const k = randInt(1, 3, rng);
  // f(x) = x^3 - 3*k^2*x => f'(x) = 3(x^2 - k^2) = 0 => x = +-k
  // Max at x = -k: f(-k) = -k^3 + 3k^3 = 2k^3
  const maxVal = 2 * (k ** 3);
  const ansStr = `${maxVal}`;

  const coeff = 3 * k * k;
  const question = `함수 $f(x) = x^3 - ${coeff}x$의 극댓값은?`;
  const explanation = `도함수를 구하여 $0$이 되는 점을 찾으면:
$$f'(x) = 3x^2 - ${coeff} = 3(x^2 - ${k * k}) = 3(x + ${k})(x - ${k}) = 0$$
증감표에 의해 $f'(x)$가 양에서 음으로 바뀌는 $x = -${k}$에서 극댓값을 갖습니다.
$$f(-${k}) = (-${k})^3 - ${coeff}(-${k}) = -${k ** 3} + ${coeff * k} = ${ansStr}$$
따라서 극댓값은 $${ansStr}$입니다.`;

  const { choices, correctAnswer, answer } = buildChoices(ansStr, (cVal, r) => {
    return `${randInt(2, 25, r)}`;
  }, rng);

  return {
    unitId: 'differentiation',
    subjectId: 'math2',
    amcSubjectId: 'advanced',
    amcUnitId: 'quadratic-optimization',
    chapterName: '극대와 극소',
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -------------------------------------------------------------
// 13. 유형 13: 정적분
// -------------------------------------------------------------
export function genDefiniteIntegral(rng = Math.random) {
  const a = randInt(2, 4, rng);
  const b = randInt(1, 3, rng);
  // int_0^b (a*x) dx = [a/2 * x^2]_0^b = a/2 * b^2
  const val = (a * b * b) / 2;
  const ansStr = `${val}`;

  const question = `$$\\int_{0}^{${b}} ${a}x \\,dx$$의 값은?`;
  const explanation = `부정적분을 구하여 위끝과 아래끝을 대입하면:
$$\\int_{0}^{${b}} ${a}x \\,dx = \\left[ \\frac{${a}}{2}x^2 \\right]_0^{${b}} = \\frac{${a}}{2}(${b}^2) - 0 = ${ansStr}$$
따라서 정적분의 값은 $${ansStr}$입니다.`;

  const { choices, correctAnswer, answer } = buildChoices(ansStr, (cVal, r) => {
    return `${randInt(1, 20, r)}`;
  }, rng);

  return {
    unitId: 'integration',
    subjectId: 'math2',
    amcSubjectId: 'advanced',
    amcUnitId: 'integration',
    chapterName: '정적분',
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -------------------------------------------------------------
// 14. 유형 14: 적분과 미분의 관계
// -------------------------------------------------------------
export function genFundamentalTheorem(rng = Math.random) {
  const a = randInt(1, 3, rng);
  const b = randInt(2, 5, rng);
  const xVal = randInt(1, 3, rng);

  // int_1^x f(t) dt = a*x^2 + b*x - (a+b)
  // f(x) = 2ax + b
  const fVal = 2 * a * xVal + b;
  const ansStr = `${fVal}`;

  const constTerm = -(a + b);
  const signB = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
  const signConst = constTerm >= 0 ? `+ ${constTerm}` : `- ${Math.abs(constTerm)}`;

  const question = `다항함수 $f(x)$가 모든 실수 $x$에 대하여
$$\\int_{1}^{x} f(t) \\,dt = ${a === 1 ? '' : a}x^2 ${signB}x ${signConst}$$
를 만족시킬 때, $f(${xVal})$의 값은?`;
  const explanation = `양변을 $x$에 대하여 미분하면:
$$\\frac{d}{dx} \\int_{1}^{x} f(t) \\,dt = f(x) = ${2 * a}x ${b >= 0 ? '+' : ''}${b}$$
$x = ${xVal}$을 대입하면:
$$f(${xVal}) = ${2 * a}(${xVal}) + ${b} = ${ansStr}$$
따라서 정답은 $${ansStr}$입니다.`;

  const { choices, correctAnswer, answer } = buildChoices(ansStr, (cVal, r) => {
    return `${randInt(3, 20, r)}`;
  }, rng);

  return {
    unitId: 'integration',
    subjectId: 'math2',
    amcSubjectId: 'advanced',
    amcUnitId: 'integration',
    chapterName: '적분과 미분의 관계',
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -------------------------------------------------------------
// 15. 유형 15: 넓이 (포물선과 x축 공식)
// -------------------------------------------------------------
export function genAreaUnderCurve(rng = Math.random) {
  const k = randInt(1, 4, rng);
  // y = x(k - x) with x-axis from 0 to k => S = 1/6 * k^3
  const k3 = k * k * k;
  const ansStr = simplifyFrac(k3, 6);

  const question = `곡선 $y = x(${k} - x)$와 $x$축으로 둘러싸인 도형의 넓이는?`;
  const explanation = `곡선과 $x$축의 교점의 $x$좌표는 $x = 0$, $x = ${k}$입니다.
포물선과 직선으로 둘러싸인 도형의 넓이 공식 $S = \\frac{|a|}{6}(\\beta - \\alpha)^3$에 의해:
$$S = \\frac{1}{6}(${k} - 0)^3 = \\frac{${k3}}{6} = ${ansStr}$$
따라서 구하는 넓이는 $${ansStr}$입니다.`;

  const { choices, correctAnswer, answer } = buildChoices(ansStr, (cVal, r) => {
    const nk = randInt(1, 5, r);
    return simplifyFrac(nk * nk * nk, 6);
  }, rng);

  return {
    unitId: 'integration',
    subjectId: 'math2',
    amcSubjectId: 'advanced',
    amcUnitId: 'integration',
    chapterName: '넓이',
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -------------------------------------------------------------
// Registry & Main API
// -------------------------------------------------------------
export const CALCULUS1_GENERATORS_BY_UNIT = {
  'sequence-limits': [genFractionLimit, genRadicalLimit, genExponentialLimit, genInfiniteSeries],
  'limits-continuity': [genRationalFuncLimit, genRadicalFuncLimit, genOneSidedLimit, genContinuity],
  differentiation: [genDerivativeValue, genDerivativeDefinition, genTangentLine, genExtrema],
  integration: [genDefiniteIntegral, genFundamentalTheorem, genAreaUnderCurve],
};

export const ALL_CALCULUS1_GENERATORS = [
  genFractionLimit,
  genRadicalLimit,
  genExponentialLimit,
  genInfiniteSeries,
  genRationalFuncLimit,
  genRadicalFuncLimit,
  genOneSidedLimit,
  genContinuity,
  genDerivativeValue,
  genDerivativeDefinition,
  genTangentLine,
  genExtrema,
  genDefiniteIntegral,
  genFundamentalTheorem,
  genAreaUnderCurve,
];

/**
 * Generates an algorithmic Calculus 1 problem for a given unit.
 */
export function generateCalculus1Problem(unitId, options = {}) {
  const rng = options.rng || Math.random;
  let list = CALCULUS1_GENERATORS_BY_UNIT[unitId];
  if (!list || list.length === 0) {
    list = ALL_CALCULUS1_GENERATORS;
  }

  const fn = pickRandom(list, rng);
  const prob = fn(rng);
  const idSuffix = Math.floor(rng() * 90000 + 10000);

  return {
    id: `gen-calc1-${prob.unitId}-${idSuffix}`,
    number: options.number || 1,
    tier: 'basic',
    grade: 'g3',
    points: 2,
    type: 'multiple_choice',
    sourceLabel: `짱쉬운 미적분 1 알고리즘 변형 · ${prob.chapterName}`,
    category: 'csat',
    ...prob,
  };
}

/**
 * Generates a variant problem similar to the provided source problem.
 */
export function generateCalculus1Variant(sourceProblem, options = {}) {
  const unitId = sourceProblem?.unitId || 'limits-continuity';
  return generateCalculus1Problem(unitId, {
    ...options,
    number: sourceProblem?.number || 1,
  });
}
