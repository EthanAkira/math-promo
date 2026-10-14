/**
 * 기본정석 미적분 (Jeongseok Calculus) 문제 생성 엔진
 * (Jeongseok Calculus Algorithmic Problem Generation Engine)
 *
 * 기본정석 미적분 15대 단원별 알고리즘 기반 생성:
 * - 유제: 기본문제 (tier: 'basic', section: '기본문제 (유제)')
 * - 연습문제: 응용문제 (tier: 'applied', section: '응용문제 (연습문제)')
 *
 * 15대 단원 목록:
 * 01. 수열의 극한 (sequence-limits / calculus)
 * 02. 급수 (infinite-series / calculus)
 * 03. 함수의 극한 (function-limits / math2)
 * 04. 함수의 연속 (continuity / math2)
 * 05. 함수의 미분 (derivatives / math2)
 * 06. 곡선의 접선과 미분 (tangent-lines / math2)
 * 07. 극대·극소와 미분 (extrema / math2)
 * 08. 최대·최소와 미분 (optimization / math2)
 * 09. 방정식·부등식과 미분 (equations-inequalities / math2)
 * 10. 속도·가속도와 미분 (velocity-acceleration / math2)
 * 11. 부정적분 (indefinite-integrals / math2)
 * 12. 정적분의 계산 (definite-integrals / math2)
 * 13. 여러 가지 정적분에 관한 문제 (integral-functions / math2)
 * 14. 넓이와 적분 (area-under-curve / math2)
 * 15. 속도·거리와 적분 (distance-velocity / math2)
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

  // Shuffle
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

// -----------------------------------------------------------------------------
// 01. 수열의 극한
// -----------------------------------------------------------------------------
export function genJeongseokSequenceLimit(tier = 'basic', rng = Math.random) {
  if (tier === 'basic') {
    // 유제 스타일: 분수식 또는 무리식 극한값
    const a = randInt(2, 6, rng);
    const b = randInt(1, 5, rng);
    const c = randInt(1, 4, rng);
    const d = randInt(2, 7, rng);
    // lim (a*n^2 + b*n) / (c*n^2 + d) = a / c
    const ansNum = a;
    const ansDen = c;
    const ansStr = simplifyFrac(ansNum, ansDen);
    const question = `다음 수열의 극한값을 구하여라.\n$$\\lim_{n \\to \\infty} \\frac{${a}n^2 + ${b}n}{${c}n^2 + ${d}}$$`;
    const explanation = `분모와 분자의 최고차항인 $n^2$으로 분모, 분자를 각각 나누면\n$$\\lim_{n \\to \\infty} \\frac{${a} + \\frac{${b}}{n}}{${c} + \\frac{${d}}{n^2}} = \\frac{${a} + 0}{${c} + 0} = ${ansStr}$$입니다.`;
    const { choices, correctAnswer, answer } = buildChoices(ansStr, ['0', '1', `${a + 1}`, `${Math.max(1, c - 1)}`], false, rng);
    return {
      chapter: 1,
      chapterName: '수열의 극한',
      unitId: 'sequence-limits',
      tier: 'basic',
      section: '기본문제 (유제)',
      points: 2,
      question,
      choices,
      correctAnswer,
      answer,
      explanation,
    };
  } else {
    // 연습문제 스타일: 샌드위치 정리 또는 무한 등비수열의 극한 응용
    const k = randInt(2, 5, rng);
    const m = randInt(3, 8, rng);
    const question = `모든 자연수 $n$에 대하여 수열 $\\{a_n\\}$이\n$$${k}n - 1 < n a_n < ${k}n + ${m}$$\n을 만족할 때, $\\lim_{n \\to \\infty} a_n$의 값을 구하여라.`;
    const ansVal = k;
    const explanation = `주어진 부등식의 각 변을 $n$ ($n > 0$)으로 나누면\n$$\\frac{${k}n - 1}{n} < a_n < \\frac{${k}n + ${m}}{n}$$\n이때 $\\lim_{n \\to \\infty} \\frac{${k}n - 1}{n} = ${k}$, $\\lim_{n \\to \\infty} \\frac{${k}n + ${m}}{n} = ${k}$이므로\n수열의 극한의 대소 관계(샌드위치 정리)에 의해 $\\lim_{n \\to \\infty} a_n = ${k}$입니다.`;
    const { choices, correctAnswer, answer } = buildChoices(ansVal, [-2, -1, 1, 2], true, rng);
    return {
      chapter: 1,
      chapterName: '수열의 극한',
      unitId: 'sequence-limits',
      tier: 'applied',
      section: '응용문제 (연습문제)',
      points: 4,
      question,
      choices,
      correctAnswer,
      answer,
      explanation,
    };
  }
}

// -----------------------------------------------------------------------------
// 02. 급수
// -----------------------------------------------------------------------------
export function genJeongseokSeries(tier = 'basic', rng = Math.random) {
  if (tier === 'basic') {
    // 부분분수 급수
    const a = randInt(1, 4, rng);
    const question = `급수 $\\sum_{n=1}^{\\infty} \\frac{1}{(n+${a})(n+${a+1})}$의 합을 구하여라.`;
    const ansStr = simplifyFrac(1, a + 1);
    const explanation = `일반항을 부분분수로 분해하면\n$$\\frac{1}{(n+${a})(n+${a+1})} = \\frac{1}{n+${a}} - \\frac{1}{n+${a+1}}$$\n제$n$항까지의 부분합 $S_n$은\n$$S_n = \\left(\\frac{1}{${a+1}} - \\frac{1}{${a+2}}\\right) + \\cdots + \\left(\\frac{1}{n+${a}} - \\frac{1}{n+${a+1}}\\right) = \\frac{1}{${a+1}} - \\frac{1}{n+${a+1}}$$\n따라서 $\\lim_{n \\to \\infty} S_n = \\frac{1}{${a+1}}$입니다.`;
    const { choices, correctAnswer, answer } = buildChoices(ansStr, ['0', '1', simplifyFrac(1, a), simplifyFrac(1, a + 2)], false, rng);
    return {
      chapter: 2,
      chapterName: '급수',
      unitId: 'sequence-limits',
      tier: 'basic',
      section: '기본문제 (유제)',
      points: 2,
      question,
      choices,
      correctAnswer,
      answer,
      explanation,
    };
  } else {
    // 등비급수의 합 응용
    const firstTerm = randInt(2, 6, rng);
    const rDen = randInt(2, 4, rng);
    const question = `첫째항이 $${firstTerm}$이고 공비가 $\\frac{1}{${rDen}}$인 무한등비급수의 합을 구하여라.`;
    const sumVal = simplifyFrac(firstTerm * rDen, rDen - 1);
    const explanation = `첫째항 $a = ${firstTerm}$, 공비 $r = \\frac{1}{${rDen}}$ ($|r| < 1$)이므로\n등비급수의 합 공식 $S = \\frac{a}{1 - r}$에 의해\n$$S = \\frac{${firstTerm}}{1 - \\frac{1}{${rDen}}} = \\frac{${firstTerm}}{\\frac{${rDen-1}}{${rDen}}} = ${sumVal}$$입니다.`;
    const { choices, correctAnswer, answer } = buildChoices(sumVal, ['2', '4', '6', '8'], false, rng);
    return {
      chapter: 2,
      chapterName: '급수',
      unitId: 'sequence-limits',
      tier: 'applied',
      section: '응용문제 (연습문제)',
      points: 3,
      question,
      choices,
      correctAnswer,
      answer,
      explanation,
    };
  }
}

// -----------------------------------------------------------------------------
// 03. 함수의 극한
// -----------------------------------------------------------------------------
export function genJeongseokFuncLimit(tier = 'basic', rng = Math.random) {
  const a = randInt(1, 4, rng);
  const b = randInt(2, 5, rng);
  if (tier === 'basic') {
    // 0/0 꼴 인수분해 극한
    const question = `다음 극한값을 구하여라.\n$$\\lim_{x \\to ${a}} \\frac{x^2 - ${a*a}}{x - ${a}}$$`;
    const ansVal = 2 * a;
    const explanation = `분자를 인수분해하면 $x^2 - ${a*a} = (x - ${a})(x + ${a})$이므로\n$$\\lim_{x \\to ${a}} \\frac{(x - ${a})(x + ${a})}{x - ${a}} = \\lim_{x \\to ${a}} (x + ${a}) = ${ansVal}$$입니다.`;
    const { choices, correctAnswer, answer } = buildChoices(ansVal, [-2, -1, 1, 2], true, rng);
    return {
      chapter: 3,
      chapterName: '함수의 극한',
      unitId: 'limits-continuity',
      tier: 'basic',
      section: '기본문제 (유제)',
      points: 2,
      question,
      choices,
      correctAnswer,
      answer,
      explanation,
    };
  } else {
    // 무리식 0/0 꼴 유리화 극한
    const c = randInt(1, 3, rng);
    const question = `다음 극한값을 구하여라.\n$$\\lim_{x \\to 0} \\frac{\\sqrt{x + ${c*c}} - ${c}}{x}$$`;
    const ansStr = simplifyFrac(1, 2 * c);
    const explanation = `분자를 유리화하면\n$$\\lim_{x \\to 0} \\frac{(\\sqrt{x + ${c*c}} - ${c})(\\sqrt{x + ${c*c}} + ${c})}{x(\\sqrt{x + ${c*c}} + ${c})} = \\lim_{x \\to 0} \\frac{x}{x(\\sqrt{x + ${c*c}} + ${c})} = \\frac{1}{2 \\times ${c}} = ${ansStr}$$입니다.`;
    const { choices, correctAnswer, answer } = buildChoices(ansStr, ['0', '1', simplifyFrac(1, c), simplifyFrac(1, 3 * c)], false, rng);
    return {
      chapter: 3,
      chapterName: '함수의 극한',
      unitId: 'limits-continuity',
      tier: 'applied',
      section: '응용문제 (연습문제)',
      points: 3,
      question,
      choices,
      correctAnswer,
      answer,
      explanation,
    };
  }
}

// -----------------------------------------------------------------------------
// 04. 함수의 연속
// -----------------------------------------------------------------------------
export function genJeongseokContinuity(tier = 'basic', rng = Math.random) {
  const a = randInt(1, 4, rng);
  const m = randInt(2, 5, rng);
  const k = m * a;
  const question = `함수 $f(x)$가 다음과 같이 정의될 때, $x = ${a}$에서 연속이 되도록 하는 상수 $k$의 값을 구하여라.\n$$f(x) = \\begin{cases} \\frac{x^2 - ${a*a}}{x - ${a}} & (x \\ne ${a}) \\\\ k & (x = ${a}) \\end{cases}$$`;
  const ansVal = 2 * a;
  const explanation = `$x = ${a}$에서 연속이려면 $\\lim_{x \\to ${a}} f(x) = f(${a})$이어야 합니다.\n$$\\lim_{x \\to ${a}} \\frac{x^2 - ${a*a}}{x - ${a}} = \\lim_{x \\to ${a}} (x + ${a}) = ${ansVal}$$\n따라서 $k = ${ansVal}$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansVal, [-2, -1, 1, 2], true, rng);
  return {
    chapter: 4,
    chapterName: '함수의 연속',
    unitId: 'limits-continuity',
    tier: tier,
    section: tier === 'basic' ? '기본문제 (유제)' : '응용문제 (연습문제)',
    points: tier === 'basic' ? 2 : 3,
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -----------------------------------------------------------------------------
// 05. 함수의 미분
// -----------------------------------------------------------------------------
export function genJeongseokDerivative(tier = 'basic', rng = Math.random) {
  const a = randInt(1, 4, rng);
  const b = randInt(2, 5, rng);
  const c = randInt(1, 6, rng);
  const x0 = randInt(1, 3, rng);
  // f(x) = a x^3 + b x^2 + c x
  // f'(x) = 3a x^2 + 2b x + c
  const ansVal = 3 * a * x0 * x0 + 2 * b * x0 + c;
  const question = `함수 $f(x) = ${a === 1 ? '' : a}x^3 + ${b}x^2 + ${c}x$에 대하여 $f'(${x0})$의 값을 구하여라.`;
  const explanation = `도함수를 구하면 $f'(x) = ${3 * a}x^2 + ${2 * b}x + ${c}$입니다.\n따라서 $x = ${x0}$을 대입하면\n$$f'(${x0}) = ${3 * a}(${x0})^2 + ${2 * b}(${x0}) + ${c} = ${3 * a * x0 * x0} + ${2 * b * x0} + ${c} = ${ansVal}$$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansVal, [-3, -1, 2, 4], true, rng);
  return {
    chapter: 5,
    chapterName: '함수의 미분',
    unitId: 'differentiation',
    tier: tier,
    section: tier === 'basic' ? '기본문제 (유제)' : '응용문제 (연습문제)',
    points: tier === 'basic' ? 2 : 3,
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -----------------------------------------------------------------------------
// 06. 곡선의 접선과 미분
// -----------------------------------------------------------------------------
export function genJeongseokTangent(tier = 'basic', rng = Math.random) {
  const a = randInt(1, 3, rng);
  const x0 = randInt(1, 2, rng);
  // y = x^2 + a x 위의 점 (x0, y0)에서의 접선의 기울기 m = 2*x0 + a
  const y0 = x0 * x0 + a * x0;
  const slope = 2 * x0 + a;
  const question = `곡선 $y = x^2 + ${a}x$ 위의 점 $(${x0}, ${y0})$에서의 접선의 기울기를 구하여라.`;
  const explanation = `$y' = 2x + ${a}$이므로 점 $(${x0}, ${y0})$에서의 접선의 기울기는\n$$m = 2(${x0}) + ${a} = ${slope}$$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(slope, [-2, -1, 1, 2], true, rng);
  return {
    chapter: 6,
    chapterName: '곡선의 접선과 미분',
    unitId: 'differentiation',
    tier: tier,
    section: tier === 'basic' ? '기본문제 (유제)' : '응용문제 (연습문제)',
    points: tier === 'basic' ? 2 : 3,
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -----------------------------------------------------------------------------
// 07. 극대·극소와 미분
// -----------------------------------------------------------------------------
export function genJeongseokExtrema(tier = 'basic', rng = Math.random) {
  const a = randInt(1, 3, rng);
  // f(x) = x^3 - 3 a^2 x
  // f'(x) = 3(x^2 - a^2) = 0 -> x = a (극소), x = -a (극대)
  // 극댓값: f(-a) = -a^3 + 3a^3 = 2a^3
  const ansVal = 2 * a * a * a;
  const question = `함수 $f(x) = x^3 - ${3 * a * a}x$의 극댓값을 구하여라.`;
  const explanation = `$f'(x) = 3x^2 - ${3 * a * a} = 3(x + ${a})(x - ${a})$이므로\n$f'(x) = 0$이 되는 $x = -${a}$에서 극대를 갖습니다.\n따라서 극댓값은 $f(-${a}) = (-${a})^3 - ${3 * a * a}(-${a}) = ${ansVal}$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansVal, [-4, -2, 2, 4], true, rng);
  return {
    chapter: 7,
    chapterName: '극대ㆍ극소와 미분',
    unitId: 'differentiation',
    tier: tier,
    section: tier === 'basic' ? '기본문제 (유제)' : '응용문제 (연습문제)',
    points: tier === 'basic' ? 3 : 4,
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -----------------------------------------------------------------------------
// 08. 최대·최소와 미분
// -----------------------------------------------------------------------------
export function genJeongseokMaxMin(tier = 'basic', rng = Math.random) {
  const p = randInt(2, 5, rng);
  // f(x) = -x^2 + 2px on [0, p+1]
  // max at x = p: f(p) = p^2
  const ansVal = p * p;
  const question = `닫힌 구간 $[0, ${p + 1}]$에서 함수 $f(x) = -x^2 + ${2 * p}x$의 최댓값을 구하여라.`;
  const explanation = `$f'(x) = -2x + ${2 * p} = 0 \\implies x = ${p}$입니다.\n$x = ${p}$는 구간 $[0, ${p + 1}]$ 안에 속하므로 최댓값은\n$$f(${p}) = -(${p})^2 + ${2 * p}(${p}) = ${ansVal}$$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansVal, [-3, -1, 2, 5], true, rng);
  return {
    chapter: 8,
    chapterName: '최대ㆍ최소와 미분',
    unitId: 'differentiation',
    tier: tier,
    section: tier === 'basic' ? '기본문제 (유제)' : '응용문제 (연습문제)',
    points: tier === 'basic' ? 3 : 4,
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -----------------------------------------------------------------------------
// 09. 방정식·부등식과 미분
// -----------------------------------------------------------------------------
export function genJeongseokDiffEquation(tier = 'basic', rng = Math.random) {
  const k = randInt(2, 6, rng);
  const question = `방정식 $2x^3 - 6x + k = 0$이 서로 다른 세 실근을 갖기 위한 정수 $k$의 개수를 구하여라.`;
  // f(x) = 2x^3 - 6x, f'(x) = 6(x^2 - 1) = 0 -> x = +-1
  // f(1) = -4, f(-1) = 4
  // 서로 다른 세 실근: -f(-1) < k < -f(1) => -4 < k < 4 => k in {-3, -2, -1, 0, 1, 2, 3} (7개)
  const ansVal = 7;
  const explanation = `$f(x) = 2x^3 - 6x$라 하면 $f'(x) = 6(x^2 - 1) = 6(x + 1)(x - 1)$이므로\n극댓값 $f(-1) = 4$, 극솟값 $f(1) = -4$입니다.\n방정식 $f(x) = -k$가 서로 다른 세 실근을 가지려면\n$$-4 < -k < 4 \\iff -4 < k < 4$$\n따라서 정수 $k$는 $-3, -2, -1, 0, 1, 2, 3$의 총 $7$개입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansVal, [-2, -1, 1, 2], true, rng);
  return {
    chapter: 9,
    chapterName: '방정식ㆍ부등식과 미분',
    unitId: 'differentiation',
    tier: tier,
    section: tier === 'basic' ? '기본문제 (유제)' : '응용문제 (연습문제)',
    points: tier === 'basic' ? 3 : 4,
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -----------------------------------------------------------------------------
// 10. 속도·가속도와 미분
// -----------------------------------------------------------------------------
export function genJeongseokVelocityDiff(tier = 'basic', rng = Math.random) {
  const v0 = randInt(10, 30, rng);
  const g = 10;
  // x(t) = v0 t - 5 t^2
  // 최고 높이에 도달할 때의 시각: v(t) = v0 - 10 t = 0 -> t = v0 / 10
  const tStop = simplifyFrac(v0, 10);
  const question = `수직선 위를 움직이는 물체의 시각 $t$에서의 위치가 $x(t) = ${v0}t - 5t^2$일 때, 속도가 $0$이 되는 시각 $t$를 구하여라.`;
  const explanation = `속도 $v(t) = x'(t) = ${v0} - 10t$입니다.\n속도가 $0$이 되는 순간은 $v(t) = 0$이므로\n$$${v0} - 10t = 0 \\iff t = ${tStop}$$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(tStop, ['1', '2', '3', '4'], false, rng);
  return {
    chapter: 10,
    chapterName: '속도ㆍ가속도와 미분',
    unitId: 'differentiation',
    tier: tier,
    section: tier === 'basic' ? '기본문제 (유제)' : '응용문제 (연습문제)',
    points: 2,
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -----------------------------------------------------------------------------
// 11. 부정적분
// -----------------------------------------------------------------------------
export function genJeongseokIndefiniteIntegral(tier = 'basic', rng = Math.random) {
  const a = randInt(2, 5, rng);
  const c = randInt(1, 4, rng);
  // f'(x) = 2ax + c, f(0) = 1 -> f(x) = a x^2 + c x + 1
  const x0 = randInt(1, 2, rng);
  const ansVal = a * x0 * x0 + c * x0 + 1;
  const question = `함수 $f(x)$에 대하여 $f'(x) = ${2 * a}x + ${c}$이고 $f(0) = 1$일 때, $f(${x0})$의 값을 구하여라.`;
  const explanation = `부정적분을 구하면 $f(x) = \\int (${2 * a}x + ${c}) dx = ${a}x^2 + ${c}x + C$입니다.\n$f(0) = 1$이므로 적분상수 $C = 1$입니다.\n따라서 $f(${x0}) = ${a}(${x0})^2 + ${c}(${x0}) + 1 = ${ansVal}$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansVal, [-2, -1, 1, 2], true, rng);
  return {
    chapter: 11,
    chapterName: '부정적분',
    unitId: 'integration',
    tier: tier,
    section: tier === 'basic' ? '기본문제 (유제)' : '응용문제 (연습문제)',
    points: tier === 'basic' ? 2 : 3,
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -----------------------------------------------------------------------------
// 12. 정적분의 계산
// -----------------------------------------------------------------------------
export function genJeongseokDefiniteIntegral(tier = 'basic', rng = Math.random) {
  const b = randInt(1, 3, rng);
  // \int_0^b (3 x^2 + 2x) dx = [x^3 + x^2]_0^b = b^3 + b^2
  const ansVal = b * b * b + b * b;
  const question = `다음 정적분의 값을 구하여라.\n$$\\int_{0}^{${b}} (3x^2 + 2x) dx$$`;
  const explanation = `부정적분은 $\\int (3x^2 + 2x) dx = x^3 + x^2$입니다.\n따라서 정적분의 값은\n$$\\left[ x^3 + x^2 \\right]_{0}^{${b}} = (${b})^3 + (${b})^2 - 0 = ${ansVal}$$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansVal, [-3, -1, 2, 4], true, rng);
  return {
    chapter: 12,
    chapterName: '정적분의 계산',
    unitId: 'integration',
    tier: tier,
    section: tier === 'basic' ? '기본문제 (유제)' : '응용문제 (연습문제)',
    points: tier === 'basic' ? 2 : 3,
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -----------------------------------------------------------------------------
// 13. 여러 가지 정적분에 관한 문제
// -----------------------------------------------------------------------------
export function genJeongseokIntegralFunc(tier = 'basic', rng = Math.random) {
  const a = randInt(1, 4, rng);
  const x0 = randInt(1, 3, rng);
  // f(x) = \frac{d}{dx} \int_a^x (3t^2 + 4t) dt = 3x^2 + 4x
  const ansVal = 3 * x0 * x0 + 4 * x0;
  const question = `함수 $g(x) = \\int_{${a}}^{x} (3t^2 + 4t) dt$에 대하여 $g'(${x0})$의 값을 구하여라.`;
  const explanation = `정적분으로 정의된 함수의 미분 성질에 의해\n$$g'(x) = \\frac{d}{dx} \\int_{${a}}^{x} (3t^2 + 4t) dt = 3x^2 + 4x$$\n따라서 $g'(${x0}) = 3(${x0})^2 + 4(${x0}) = ${ansVal}$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansVal, [-3, -1, 2, 4], true, rng);
  return {
    chapter: 13,
    chapterName: '여러 가지 정적분에 관한 문제',
    unitId: 'integration',
    tier: tier,
    section: tier === 'basic' ? '기본문제 (유제)' : '응용문제 (연습문제)',
    points: 3,
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -----------------------------------------------------------------------------
// 14. 넓이와 적분
// -----------------------------------------------------------------------------
export function genJeongseokAreaIntegral(tier = 'basic', rng = Math.random) {
  const a = randInt(1, 4, rng);
  // 곡선 y = x(a - x) 와 x축으로 둘러싸인 도형의 넓이 = a^3 / 6
  // 만약 6의 배수가 되도록 a=6: 넓이 = 36
  const ansVal = a * a * a;
  const question = `곡선 $y = -6x(x - ${a})$와 $x$축으로 둘러싸인 도형의 넓이를 구하여라.`;
  // \int_0^a -6(x^2 - ax) dx = 6 * a^3 / 6 = a^3
  const explanation = `곡선과 $x$축의 교점은 $x = 0$과 $x = ${a}$입니다.\n구간 $[0, ${a}]$에서 $y \\ge 0$이므로 둘러싸인 넓이 $S$는\n$$S = \\int_{0}^{${a}} (-6x^2 + ${6 * a}x) dx = \\left[ -2x^3 + ${3 * a}x^2 \\right]_{0}^{${a}} = -2(${a})^3 + 3(${a})^3 = ${ansVal}$$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansVal, [-4, -2, 2, 6], true, rng);
  return {
    chapter: 14,
    chapterName: '넓이와 적분',
    unitId: 'integration',
    tier: tier,
    section: tier === 'basic' ? '기본문제 (유제)' : '응용문제 (연습문제)',
    points: tier === 'basic' ? 3 : 4,
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -----------------------------------------------------------------------------
// 15. 속도·거리와 적분
// -----------------------------------------------------------------------------
export function genJeongseokVelocityIntegral(tier = 'basic', rng = Math.random) {
  const t0 = randInt(2, 4, rng);
  // v(t) = 6t - 2
  // 이동 거리 on [0, t0]: [3t^2 - 2t]_0^t0 = 3 t0^2 - 2 t0
  const ansVal = 3 * t0 * t0 - 2 * t0;
  const question = `원점을 출발하여 수직선 위를 움직이는 점 $P$의 시각 $t$ ($t \\ge 0$)에서의 속도가 $v(t) = 6t - 2$일 때, $t = 1$부터 $t = ${t0 + 1}$까지 점 $P$의 위치의 변화량을 구하여라.`;
  const changeVal = (3 * (t0 + 1) * (t0 + 1) - 2 * (t0 + 1)) - (3 * 1 - 2 * 1);
  const explanation = `위치의 변화량은 속도의 정적분이므로\n$$\\Delta x = \\int_{1}^{${t0 + 1}} (6t - 2) dt = \\left[ 3t^2 - 2t \\right]_{1}^{${t0 + 1}} = ${changeVal}$$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(changeVal, [-3, -1, 2, 4], true, rng);
  return {
    chapter: 15,
    chapterName: '속도ㆍ거리와 적분',
    unitId: 'integration',
    tier: tier,
    section: tier === 'basic' ? '기본문제 (유제)' : '응용문제 (연습문제)',
    points: 3,
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -----------------------------------------------------------------------------
// Registry & Master Generator
// -----------------------------------------------------------------------------
export const JEONGSEOK_GENERATORS = {
  1: genJeongseokSequenceLimit,
  2: genJeongseokSeries,
  3: genJeongseokFuncLimit,
  4: genJeongseokContinuity,
  5: genJeongseokDerivative,
  6: genJeongseokTangent,
  7: genJeongseokExtrema,
  8: genJeongseokMaxMin,
  9: genJeongseokDiffEquation,
  10: genJeongseokVelocityDiff,
  11: genJeongseokIndefiniteIntegral,
  12: genJeongseokDefiniteIntegral,
  13: genJeongseokIntegralFunc,
  14: genJeongseokAreaIntegral,
  15: genJeongseokVelocityIntegral,
};

export const JEONGSEOK_GENERATORS_BY_UNIT = {
  'sequence-limits': [genJeongseokSequenceLimit, genJeongseokSeries],
  'limits-continuity': [genJeongseokFuncLimit, genJeongseokContinuity],
  differentiation: [genJeongseokDerivative, genJeongseokTangent, genJeongseokExtrema, genJeongseokMaxMin, genJeongseokDiffEquation, genJeongseokVelocityDiff],
  integration: [genJeongseokIndefiniteIntegral, genJeongseokDefiniteIntegral, genJeongseokIntegralFunc, genJeongseokAreaIntegral, genJeongseokVelocityIntegral],
};

/**
 * Generates an algorithmic Jeongseok Calculus problem.
 */
export function generateJeongseokCalculusProblem(unitIdOrChapter, options = {}) {
  const rng = options.rng || Math.random;
  const tier = options.tier || (rng() > 0.5 ? 'applied' : 'basic');

  let fn;
  if (typeof unitIdOrChapter === 'number' && JEONGSEOK_GENERATORS[unitIdOrChapter]) {
    fn = JEONGSEOK_GENERATORS[unitIdOrChapter];
  } else if (JEONGSEOK_GENERATORS_BY_UNIT[unitIdOrChapter]) {
    fn = pickRandom(JEONGSEOK_GENERATORS_BY_UNIT[unitIdOrChapter], rng);
  } else {
    const all = Object.values(JEONGSEOK_GENERATORS);
    fn = pickRandom(all, rng);
  }

  const prob = fn(tier, rng);
  const idSuffix = Math.floor(rng() * 90000 + 10000);

  return {
    id: `gen-jeongseok-calc-${prob.chapter}-${tier}-${idSuffix}`,
    number: options.number || 1,
    grade: 'g2',
    category: 'csat',
    sourceLabel: `기본정석 미적분 변형 · ${prob.chapter}단원 ${prob.chapterName} [${tier === 'basic' ? '기본문제' : '응용문제'}]`,
    ...prob,
  };
}

/**
 * Generates a variant problem similar to the provided source Jeongseok problem.
 */
export function generateJeongseokCalculusVariant(sourceProblem, options = {}) {
  const ch = sourceProblem?.chapter || 1;
  const tier = sourceProblem?.tier || 'basic';
  return generateJeongseokCalculusProblem(ch, {
    ...options,
    tier,
    number: sourceProblem?.number || 1,
  });
}
