/**
 * 짱중요한유형 미적분Ⅱ (Calculus 2 Important & CSAT) 문제 생성 엔진
 * (Calculus 2 Algorithmic Problem Generation Engine)
 *
 * 21대 핵심 수능/모의평가 출제유형 알고리즘 기반:
 * - 유형 01: 지수함수의 그래프와 최대·최소 (exponential-functions / exp-log)
 * - 유형 02: 로그함수의 그래프와 최대·최소 (logarithmic-functions / exp-log)
 * - 유형 03: 지수방정식과 지수부등식 (exponential-equations / exp-log)
 * - 유형 04: 로그방정식과 로그부등식 (logarithmic-equations / exp-log)
 * - 유형 05: 지수·로그함수의 실생활 활용 (exp-log-applications / exp-log)
 * - 유형 06: 일반각과 호도법 및 삼각함수의 뜻 (trig-definition / trig)
 * - 유형 07: 삼각함수의 그래프와 성질 (trig-graphs / trig)
 * - 유형 08: 삼각함수의 덧셈정리와 배각공식 (trig-addition-formulas / advanced-differentiation)
 * - 유형 09: 삼각함수의 합성 (trig-synthesis / advanced-differentiation)
 * - 유형 10: 삼각방정식과 삼각부등식 (trig-equations / trig)
 * - 유형 11: 지수함수와 로그함수의 극한 (exp-log-limits / advanced-differentiation)
 * - 유형 12: 삼각함수의 극한 (trig-limits / advanced-differentiation)
 * - 유형 13: 삼각함수 극한의 도형에의 활용 (trig-limit-geometry / advanced-differentiation)
 * - 유형 14: 여러 가지 함수의 미분법 (derivative-rules / advanced-differentiation)
 * - 유형 15: 접선의 방정식 (tangent-lines / advanced-differentiation)
 * - 유형 16: 극대·극소와 최대·최소 (extrema-optimization / advanced-differentiation)
 * - 유형 17: 함수의 그래프와 방정식·부등식 (curve-sketching-equations / advanced-differentiation)
 * - 유형 18: 치환적분법과 부분적분법 (substitution-by-parts / advanced-integration)
 * - 유형 19: 급수와 정적분 (riemann-sum-integrals / advanced-integration)
 * - 유형 20: 정적분의 활용 - 곡선 사이의 넓이 (area-between-curves / advanced-integration)
 * - 유형 21: 정적분의 활용 - 입체도형의 부피 (volume-of-solids / advanced-integration)
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
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function makeChoices(correctVal, distractorOffsets = [-2, -1, 1, 2], isNumber = true) {
  const choices = [correctVal];
  for (const off of distractorOffsets) {
    const d = isNumber ? correctVal + off : `${correctVal} + ${off}`;
    if (!choices.includes(d) && (typeof d !== 'number' || d > 0)) {
      choices.push(d);
    }
  }
  while (choices.length < 5) {
    const extra = isNumber ? correctVal + choices.length + 2 : `${correctVal}_${choices.length}`;
    if (!choices.includes(extra)) choices.push(extra);
  }

  // Shuffle deterministic or random
  choices.sort((a, b) => (typeof a === 'number' && typeof b === 'number' ? a - b : String(a).localeCompare(String(b))));
  const correctIdx = choices.indexOf(correctVal);

  return {
    choices: choices.map((c) => `$${c}$`),
    answer: String(correctIdx + 1),
    correctAnswer: correctIdx + 1,
  };
}

// 1. 유형 01: 지수함수의 그래프와 최대·최소
function genExpFunctionsProblem(rng = Math.random) {
  const a = pickRandom([2, 3], rng);
  const p = randInt(1, 3, rng);
  const q = randInt(1, 5, rng);
  const minX = -1;
  const maxX = 2;
  const maxVal = Math.pow(a, maxX - p + 2) + q;
  const minVal = Math.pow(a, minX - p + 2) + q;
  const ansSum = maxVal + minVal;

  const { choices, answer, correctAnswer } = makeChoices(ansSum, [-4, -2, 2, 4]);

  return {
    chapter: 1,
    chapterName: '지수함수의 그래프와 최대·최소',
    subjectId: 'math1',
    unitId: 'exp-log',
    subUnitId: 'exponential-functions',
    amcSubjectId: 'algebra',
    amcUnitId: 'exponential-logarithmic',
    question: `닫힌 구간 $[${minX}, ${maxX}]$에서 정의된 지수함수 $f(x) = ${a}^{x - ${p - 2}} + ${q}$의 최댓값을 $M$, 최솟값을 $m$이라 할 때, $M + m$의 값을 구하시오.`,
    choices,
    answer,
    correctAnswer,
    explanation: `**[단계별 해설]**\n\n1단계: 밑 $a = ${a} > 1$이므로 함수 $f(x)$는 증가함수입니다.\n2단계: $x = ${maxX}$에서 최댓값 $M = ${a}^{${maxX - p + 2}} + ${q} = ${maxVal}$을 가집니다.\n3단계: $x = ${minX}$에서 최솟값 $m = ${a}^{${minX - p + 2}} + ${q} = ${minVal}$을 가집니다.\n4단계: 따라서 $M + m = ${maxVal} + ${minVal} = ${ansSum}$입니다.`,
  };
}

// 2. 유형 02: 로그함수의 그래프와 최대·최소
function genLogFunctionsProblem(rng = Math.random) {
  const a = pickRandom([2, 3], rng);
  const p = randInt(1, 3, rng);
  const q = randInt(2, 6, rng);
  const minX = p + 1;
  const maxX = p + Math.pow(a, 2);
  const minVal = 0 + q;
  const maxVal = 2 + q;
  const ans = maxVal - minVal;

  const { choices, answer, correctAnswer } = makeChoices(ans, [-2, -1, 1, 2]);

  return {
    chapter: 2,
    chapterName: '로그함수의 그래프와 최대·최소',
    subjectId: 'math1',
    unitId: 'exp-log',
    subUnitId: 'logarithmic-functions',
    amcSubjectId: 'algebra',
    amcUnitId: 'exponential-logarithmic',
    question: `닫힌 구간 $[${minX}, ${maxX}]$에서 함수 $f(x) = \\log_{${a}}(x - ${p}) + ${q}$의 최댓값과 최솟값의 차 $M - m$의 값을 구하시오.`,
    choices,
    answer,
    correctAnswer,
    explanation: `**[단계별 해설]**\n\n1단계: 밑이 $${a} > 1$이므로 함수 $f(x)$는 구간 $[${minX}, ${maxX}]$에서 증가함수입니다.\n2단계: $x = ${maxX}$에서 최댓값 $M = \\log_{${a}}(${maxX - p}) + ${q} = \\log_{${a}}(${Math.pow(a, 2)}) + ${q} = 2 + ${q} = ${maxVal}$입니다.\n3단계: $x = ${minX}$에서 최솟값 $m = \\log_{${a}}(${minX - p}) + ${q} = \\log_{${a}}(1) + ${q} = 0 + ${q} = ${minVal}$입니다.\n4단계: 따라서 $M - m = ${maxVal} - ${minVal} = ${ans}$입니다.`,
  };
}

// 3. 유형 03: 지수방정식과 지수부등식
function genExpEquationsProblem(rng = Math.random) {
  const a = pickRandom([2, 3], rng);
  const alpha = randInt(1, 2, rng);
  const beta = randInt(3, 4, rng);
  const sumRoots = alpha + beta;
  const pCoeff = -(Math.pow(a, alpha) + Math.pow(a, beta));
  const qConst = Math.pow(a, alpha + beta);

  const { choices, answer, correctAnswer } = makeChoices(sumRoots, [-2, -1, 1, 2]);

  return {
    chapter: 3,
    chapterName: '지수방정식과 지수부등식',
    subjectId: 'math1',
    unitId: 'exp-log',
    subUnitId: 'exponential-equations',
    amcSubjectId: 'algebra',
    amcUnitId: 'exponential-logarithmic',
    question: `지수방정식 $(${a}^x)^2 ${pCoeff < 0 ? pCoeff : '+' + pCoeff} \\cdot ${a}^x + ${qConst} = 0$의 두 실근의 합을 구하시오.`,
    choices,
    answer,
    correctAnswer,
    explanation: `**[단계별 해설]**\n\n1단계: $t = ${a}^x > 0$로 치환하면 $t^2 ${pCoeff}t + ${qConst} = 0$입니다.\n2단계: 인수분해하면 $(t - ${Math.pow(a, alpha)})(t - ${Math.pow(a, beta)}) = 0$이므로 $t = ${Math.pow(a, alpha)}$ 또는 $t = ${Math.pow(a, beta)}$입니다.\n3단계: ${a}^x = ${a}^{${alpha}} \\implies x = ${alpha}$, ${a}^x = ${a}^{${beta}} \\implies x = ${beta}$입니다.\n4단계: 따라서 두 실근의 합은 $${alpha} + ${beta} = ${sumRoots}$입니다.`,
  };
}

// 4. 유형 04: 로그방정식과 로그부등식
function genLogEquationsProblem(rng = Math.random) {
  const diff = randInt(1, 3, rng);
  const root = randInt(diff + 1, 6, rng);
  const prod = root * (root - diff);

  const { choices, answer, correctAnswer } = makeChoices(root, [-2, -1, 1, 2]);

  return {
    chapter: 4,
    chapterName: '로그방정식과 로그부등식',
    subjectId: 'math1',
    unitId: 'exp-log',
    subUnitId: 'logarithmic-equations',
    amcSubjectId: 'algebra',
    amcUnitId: 'exponential-logarithmic',
    question: `방정식 $\\log_2 x + \\log_2(x - ${diff}) = \\log_2 ${prod}$를 만족시키는 실수 $x$의 값을 구하시오.`,
    choices,
    answer,
    correctAnswer,
    explanation: `**[단계별 해설]**\n\n1단계: 진수 조건에 의해 $x > 0$이고 $x - ${diff} > 0$이므로 $x > ${diff}$입니다.\n2단계: 로그 성질에 의해 $\\log_2(x(x - ${diff})) = \\log_2 ${prod}$이므로 $x^2 - ${diff}x - ${prod} = 0$입니다.\n3단계: $(x - ${root})(x + ${prod / root}) = 0$에서 진수 조건 $x > ${diff}$를 만족하는 해는 $x = ${root}$입니다.`,
  };
}

// 5. 유형 05: 지수·로그함수의 실생활 활용
function genExpLogApplicationsProblem(rng = Math.random) {
  const k = randInt(2, 5, rng);
  const initial = randInt(10, 50, rng) * 10;
  const hours = randInt(2, 4, rng);
  const finalVal = initial * Math.pow(k, hours);

  const { choices, answer, correctAnswer } = makeChoices(hours, [-2, -1, 1, 2]);

  return {
    chapter: 5,
    chapterName: '지수·로그함수의 실생활 활용',
    subjectId: 'math1',
    unitId: 'exp-log',
    subUnitId: 'exp-log-applications',
    amcSubjectId: 'algebra',
    amcUnitId: 'exponential-logarithmic',
    question: `어느 세균은 $1$시간마다 그 수가 $${k}$배로 증가한다고 한다. 처음에 $${initial}$마리였던 세균이 번식하여 $${finalVal}$마리가 되는 데 걸리는 시간(시간)을 구하시오.`,
    choices,
    answer,
    correctAnswer,
    explanation: `**[단계별 해설]**\n\n1단계: $t$시간 후의 세균의 수는 $N(t) = ${initial} \\times ${k}^t$ 마리입니다.\n2단계: $N(t) = ${finalVal}$이므로 $${initial} \\times ${k}^t = ${finalVal}$에서 ${k}^t = ${finalVal / initial} = ${Math.pow(k, hours)}$입니다.\n3단계: 따라서 구하는 시간은 $t = ${hours}$시간입니다.`,
  };
}

// 6. 유형 06: 일반각과 호도법 및 삼각함수의 뜻
function genTrigDefinitionProblem(rng = Math.random) {
  const r = randInt(2, 6, rng);
  const thetaNumerator = randInt(1, 3, rng);
  const thetaDenominator = pickRandom([3, 4, 6], rng);
  const l_text = `\\frac{${r * thetaNumerator}\\pi}{${thetaDenominator}}`;
  const areaNumerator = r * r * thetaNumerator;
  const areaDenominator = 2 * thetaDenominator;
  const g = gcd(areaNumerator, areaDenominator);
  const aNum = areaNumerator / g;
  const aDen = areaDenominator / g;
  const ansStr = aDen === 1 ? `${aNum}\\pi` : `\\frac{${aNum}\\pi}{${aDen}}`;

  const { choices, answer, correctAnswer } = makeChoices(ansStr, ['\\pi', '2\\pi', '3\\pi', '4\\pi'], false);

  return {
    chapter: 6,
    chapterName: '일반각과 호도법 및 삼각함수의 뜻',
    subjectId: 'math1',
    unitId: 'trig',
    subUnitId: 'trig-definition',
    amcSubjectId: 'advanced',
    amcUnitId: 'trigonometry',
    question: `반지름의 길이가 $${r}$이고 호의 길이가 $${l_text}$인 부채꼴의 넓이를 구하시오.`,
    choices,
    answer,
    correctAnswer,
    explanation: `**[단계별 해설]**\n\n1단계: 부채꼴의 반지름을 $r = ${r}$, 호의 길이를 $l = ${l_text}$라 합니다.\n2단계: 부채꼴의 넓이 공식은 $S = \\frac{1}{2} r l$입니다.\n3단계: $S = \\frac{1}{2} \\times ${r} \\times ${l_text} = $${ansStr}$입니다.`,
  };
}

// 7. 유형 07: 삼각함수의 그래프와 성질
function genTrigGraphsProblem(rng = Math.random) {
  const a = randInt(2, 5, rng);
  const b = randInt(2, 4, rng);
  const c = randInt(1, 5, rng);
  const maxVal = a + c;
  const minVal = -a + c;
  const period = `\\frac{2\\pi}{${b}}`;
  const ansSum = maxVal + b;

  const { choices, answer, correctAnswer } = makeChoices(ansSum, [-2, -1, 1, 2]);

  return {
    chapter: 7,
    chapterName: '삼각함수의 그래프와 성질',
    subjectId: 'math1',
    unitId: 'trig',
    subUnitId: 'trig-graphs',
    amcSubjectId: 'advanced',
    amcUnitId: 'trigonometry',
    question: `함수 $f(x) = ${a}\\sin(${b}x) + ${c}$의 최댓값을 $M$, 주기를 $T$라 할 때, $M + ${b}$의 값을 구하시오. (단, 주기 $T = ${period}$)`,
    choices,
    answer,
    correctAnswer,
    explanation: `**[단계별 해설]**\n\n1단계: $-1 \\le \\sin(${b}x) \\le 1$이므로 함수의 최댓값은 $M = ${a} + ${c} = ${maxVal}$입니다.\n2단계: $x$의 계수가 $${b}$이므로 기본 주기는 $T = \\frac{2\\pi}{${b}}$입니다.\n3단계: 따라서 $M + ${b} = ${maxVal} + ${b} = ${ansSum}$입니다.`,
  };
}

// 8. 유형 08: 삼각함수의 덧셈정리와 배각공식
function genTrigAdditionFormulasProblem(rng = Math.random) {
  const m1 = randInt(1, 3, rng);
  const m2 = randInt(m1 + 1, 5, rng);
  const tanThetaNum = Math.abs(m2 - m1);
  const tanThetaDen = 1 + m1 * m2;
  const g = gcd(tanThetaNum, tanThetaDen);
  const numG = tanThetaNum / g;
  const denG = tanThetaDen / g;
  const ansStr = denG === 1 ? `${numG}` : `\\frac{${numG}}{${denG}}`;

  const { choices, answer, correctAnswer } = makeChoices(ansStr, ['\\frac{1}{2}', '\\frac{1}{3}', '\\frac{2}{3}', '1'], false);

  return {
    chapter: 8,
    chapterName: '삼각함수의 덧셈정리와 배각공식',
    subjectId: 'calculus',
    unitId: 'advanced-differentiation',
    subUnitId: 'trig-addition-formulas',
    amcSubjectId: 'advanced',
    amcUnitId: 'trig-identities',
    question: `두 직선 $y = ${m1}x$와 $y = ${m2}x$가 이루는 예각의 크기를 $\\theta$라 할 때, $\\tan\\theta$의 값을 구하시오.`,
    choices,
    answer,
    correctAnswer,
    explanation: `**[단계별 해설]**\n\n1단계: 두 직선의 기울기를 각각 $\\tan\\alpha = ${m2}$, $\\tan\\beta = ${m1}$이라 하면 $\\theta = \\alpha - \\beta$입니다.\n2단계: 탄젠트의 덧셈정리에 의해 $\\tan\\theta = \\left| \\frac{\\tan\\alpha - \\tan\\beta}{1 + \\tan\\alpha\\tan\\beta} \\right|$입니다.\n3단계: $\\tan\\theta = \\frac{${m2} - ${m1}}{1 + ${m2} \\times ${m1}} = ${ansStr}$입니다.`,
  };
}

// 9. 유형 09: 삼각함수의 합성
function genTrigSynthesisProblem(rng = Math.random) {
  const pairs = [
    { a: 1, b: Math.sqrt(3), r: 2, aStr: '', bStr: '\\sqrt{3}' },
    { a: Math.sqrt(3), b: 1, r: 2, aStr: '\\sqrt{3}', bStr: '' },
    { a: 3, b: 4, r: 5, aStr: '3', bStr: '4' },
  ];
  const item = pickRandom(pairs, rng);
  const c = randInt(1, 5, rng);
  const maxVal = item.r + c;

  const { choices, answer, correctAnswer } = makeChoices(maxVal, [-2, -1, 1, 2]);

  return {
    chapter: 9,
    chapterName: '삼각함수의 합성',
    subjectId: 'calculus',
    unitId: 'advanced-differentiation',
    subUnitId: 'trig-synthesis',
    amcSubjectId: 'advanced',
    amcUnitId: 'trig-identities',
    question: `함수 $f(x) = ${item.aStr}\\sin x + ${item.bStr}\\cos x + ${c}$의 최댓값을 구하시오.`,
    choices,
    answer,
    correctAnswer,
    explanation: `**[단계별 해설]**\n\n1단계: 삼각함수의 합성에 의해 $f(x) = ${item.r}\\sin(x + \\alpha) + ${c}$ 꼴로 변형됩니다.\n2단계: $-1 \\le \\sin(x + \\alpha) \\le 1$이므로 최댓값은 $M = ${item.r} + ${c} = ${maxVal}$입니다.`,
  };
}

// 10. 유형 10: 삼각방정식과 삼각부등식
function genTrigEquationsProblem(rng = Math.random) {
  const ansCount = 2;
  const kVal = pickRandom(['\\frac{1}{2}', '\\frac{\\sqrt{2}}{2}', '\\frac{\\sqrt{3}}{2}'], rng);

  const { choices, answer, correctAnswer } = makeChoices(ansCount, [-1, 1, 2, 3]);

  return {
    chapter: 10,
    chapterName: '삼각방정식과 삼각부등식',
    subjectId: 'math1',
    unitId: 'trig',
    subUnitId: 'trig-equations',
    amcSubjectId: 'advanced',
    amcUnitId: 'trigonometry',
    question: `$0 \\le x < 2\\pi$일 때, 삼각방정식 $\\sin x = ${kVal}$의 서로 다른 실근의 개수를 구하시오.`,
    choices,
    answer,
    correctAnswer,
    explanation: `**[단계별 해설]**\n\n1단계: $0 \\le x < 2\\pi$에서 $y = \\sin x$의 그래프와 직선 $y = ${kVal}$의 교점을 찾습니다.\n2단계: 제1사분면과 제2사분면에서 각각 1개씩 교점을 가지므로 서로 다른 실근의 개수는 $${ansCount}$개입니다.`,
  };
}

// 11. 유형 11: 지수함수와 로그함수의 극한
function genExpLogLimitsProblem(rng = Math.random) {
  const a = randInt(2, 6, rng);
  const b = randInt(2, 5, rng);
  const g = gcd(a, b);
  const numG = a / g;
  const denG = b / g;
  const ansStr = denG === 1 ? `${numG}` : `\\frac{${numG}}{${denG}}`;

  const { choices, answer, correctAnswer } = makeChoices(ansStr, ['1', '2', '\\frac{1}{2}', '\\frac{3}{2}'], false);

  return {
    chapter: 11,
    chapterName: '지수함수와 로그함수의 극한',
    subjectId: 'calculus',
    unitId: 'advanced-differentiation',
    subUnitId: 'exp-log-limits',
    amcSubjectId: 'calculus',
    amcUnitId: 'derivatives',
    question: `극한값 $\\lim_{x \\to 0} \\frac{\\ln(1 + ${a}x)}{${b}x}$의 값을 구하시오.`,
    choices,
    answer,
    correctAnswer,
    explanation: `**[단계별 해설]**\n\n1단계: 기본 공식 $\\lim_{t \\to 0} \\frac{\\ln(1 + t)}{t} = 1$을 적용합니다.\n2단계: $\\lim_{x \\to 0} \\frac{\\ln(1 + ${a}x)}{${a}x} \\cdot \\frac{${a}}{${b}} = 1 \\cdot \\frac{${a}}{${b}} = ${ansStr}$입니다.`,
  };
}

// 12. 유형 12: 삼각함수의 극한
function genTrigLimitsProblem(rng = Math.random) {
  const a = randInt(2, 6, rng);
  const b = randInt(2, 5, rng);
  const g = gcd(a, b);
  const numG = a / g;
  const denG = b / g;
  const ansStr = denG === 1 ? `${numG}` : `\\frac{${numG}}{${denG}}`;

  const { choices, answer, correctAnswer } = makeChoices(ansStr, ['1', '2', '\\frac{1}{3}', '3'], false);

  return {
    chapter: 12,
    chapterName: '삼각함수의 극한',
    subjectId: 'calculus',
    unitId: 'advanced-differentiation',
    subUnitId: 'trig-limits',
    amcSubjectId: 'calculus',
    amcUnitId: 'derivatives',
    question: `극한값 $\\lim_{x \\to 0} \\frac{\\sin(${a}x)}{${b}x}$의 값을 구하시오.`,
    choices,
    answer,
    correctAnswer,
    explanation: `**[단계별 해설]**\n\n1단계: 삼각함수의 극한 기본 공식 $\\lim_{t \\to 0} \\frac{\\sin t}{t} = 1$을 이용합니다.\n2단계: $\\lim_{x \\to 0} \\frac{\\sin(${a}x)}{${a}x} \\times \\frac{${a}}{${b}} = 1 \\times \\frac{${a}}{${b}} = ${ansStr}$입니다.`,
  };
}

// 13. 유형 13: 삼각함수 극한의 도형에의 활용
function genTrigLimitGeometryProblem(rng = Math.random) {
  const r = randInt(1, 4, rng);
  const coeff = r * r;
  const ans = coeff;

  const { choices, answer, correctAnswer } = makeChoices(ans, [-2, -1, 1, 2]);

  return {
    chapter: 13,
    chapterName: '삼각함수 극한의 도형에의 활용',
    subjectId: 'calculus',
    unitId: 'advanced-differentiation',
    subUnitId: 'trig-limit-geometry',
    amcSubjectId: 'geometry',
    amcUnitId: 'trig-geometry',
    question: `반지름의 길이가 $${r}$인 원 $O$의 중심각이 $\\theta$인 부채꼴 $OAB$에서 호 $AB$의 길이를 $l(\\theta)$라 할 때, $\\lim_{\\theta \\to 0+} \\frac{l(\\theta)^2}{\\theta^2}$의 값을 구하시오.`,
    choices,
    answer,
    correctAnswer,
    explanation: `**[단계별 해설]**\n\n1단계: 반지름 $r = ${r}$일 때 호의 길이는 $l(\\theta) = r\\theta = ${r}\\theta$입니다.\n2단계: 따라서 $\\frac{l(\\theta)^2}{\\theta^2} = \\frac{(${r}\\theta)^2}{\\theta^2} = ${coeff}$입니다.\n3단계: $\\lim_{\\theta \\to 0+} ${coeff} = ${ans}$입니다.`,
  };
}

// 14. 유형 14: 여러 가지 함수의 미분법
function genDerivativeRulesProblem(rng = Math.random) {
  const a = randInt(2, 4, rng);
  const b = randInt(1, 3, rng);
  // f(x) = (ax + b) e^x -> f'(0) = a + b
  const ans = a + b;

  const { choices, answer, correctAnswer } = makeChoices(ans, [-2, -1, 1, 2]);

  return {
    chapter: 14,
    chapterName: '여러 가지 함수의 미분법',
    subjectId: 'calculus',
    unitId: 'advanced-differentiation',
    subUnitId: 'derivative-rules',
    amcSubjectId: 'calculus',
    amcUnitId: 'derivatives',
    question: `함수 $f(x) = (${a}x + ${b})e^x$에 대하여 $f'(0)$의 값을 구하시오.`,
    choices,
    answer,
    correctAnswer,
    explanation: `**[단계별 해설]**\n\n1단계: 곱의 미분법을 적용합니다. $f'(x) = ${a}e^x + (${a}x + ${b})e^x = (${a}x + ${a + b})e^x$입니다.\n2단계: $x = 0$을 대입하면 $f'(0) = (0 + ${a + b})e^0 = ${ans}$입니다.`,
  };
}

// 15. 유형 15: 접선의 방정식
function genTangentLinesProblem(rng = Math.random) {
  const a = randInt(2, 4, rng);
  // f(x) = a ln x at x = 1 -> slope = a, point = (1, 0) -> y = a(x - 1) -> y-intercept = -a
  const ans = -a;

  const { choices, answer, correctAnswer } = makeChoices(ans, [-2, -1, 1, 2]);

  return {
    chapter: 15,
    chapterName: '접선의 방정식',
    subjectId: 'calculus',
    unitId: 'advanced-differentiation',
    subUnitId: 'tangent-lines',
    amcSubjectId: 'calculus',
    amcUnitId: 'derivatives',
    question: `곡선 $y = ${a}\\ln x$ 위의 점 $(1, 0)$에서의 접선의 $y$절편을 구하시오.`,
    choices,
    answer,
    correctAnswer,
    explanation: `**[단계별 해설]**\n\n1단계: $y' = \\frac{${a}}{x}$이므로 $x = 1$에서의 접선의 기울기는 $m = ${a}$입니다.\n2단계: 점 $(1, 0)$을 지나고 기울기가 $${a}$인 접선의 방정식은 $y - 0 = ${a}(x - 1) \\implies y = ${a}x - ${a}$입니다.\n3단계: 따라서 접선의 $y$절편은 $-${a}$입니다.`,
  };
}

// 16. 유형 16: 극대·극소와 최대·최소
function genExtremaOptimizationProblem(rng = Math.random) {
  const a = randInt(1, 3, rng);
  // f(x) = x e^{-x} -> f'(x) = (1 - x)e^{-x} -> max at x = 1, f(1) = 1/e
  const ans = 1;

  const { choices, answer, correctAnswer } = makeChoices(ans, [-2, -1, 1, 2]);

  return {
    chapter: 16,
    chapterName: '극대·극소와 최대·최소',
    subjectId: 'calculus',
    unitId: 'advanced-differentiation',
    subUnitId: 'extrema-optimization',
    amcSubjectId: 'calculus',
    amcUnitId: 'derivatives',
    question: `함수 $f(x) = x e^{-x}$가 $x = a$에서 극댓값을 가질 때, 상수 $a$의 값을 구하시오.`,
    choices,
    answer,
    correctAnswer,
    explanation: `**[단계별 해설]**\n\n1단계: 도함수를 구하면 $f'(x) = 1 \\cdot e^{-x} - x e^{-x} = (1 - x)e^{-x}$입니다.\n2단계: $e^{-x} > 0$이므로 $f'(x) = 0$을 만족하는 해는 $x = 1$입니다.\n3단계: $x < 1$에서 $f'(x) > 0$, $x > 1$에서 $f'(x) < 0$이므로 $x = 1$에서 극대입니다. 따라서 $a = ${ans}$입니다.`,
  };
}

// 17. 유형 17: 함수의 그래프와 방정식·부등식
function genCurveSketchingEquationsProblem(rng = Math.random) {
  const ans = 2;

  const { choices, answer, correctAnswer } = makeChoices(ans, [-1, 1, 2, 3]);

  return {
    chapter: 17,
    chapterName: '함수의 그래프와 방정식·부등식',
    subjectId: 'calculus',
    unitId: 'advanced-differentiation',
    subUnitId: 'curve-sketching-equations',
    amcSubjectId: 'calculus',
    amcUnitId: 'derivatives',
    question: `방정식 $e^x = 2x + 1$의 서로 다른 실근의 개수를 구하시오.`,
    choices,
    answer,
    correctAnswer,
    explanation: `**[단계별 해설]**\n\n1단계: $f(x) = e^x - 2x - 1$이라 두면 $f'(x) = e^x - 2$입니다.\n2단계: $f'(x) = 0 \\implies x = \\ln 2$에서 최솟값 $f(\\ln 2) = 2 - 2\\ln 2 - 1 = 1 - \\ln 4 < 0$을 갖습니다.\n3단계: $\\lim_{x \\to -\\infty} f(x) = +\\infty$, $\\lim_{x \\to \\infty} f(x) = +\\infty$이므로 서로 다른 $2$개의 실근을 갖습니다.`,
  };
}

// 18. 유형 18: 치환적분법과 부분적분법
function genSubstitutionByPartsProblem(rng = Math.random) {
  const a = randInt(2, 4, rng);
  // int_0^1 x e^{x^2} dx = 1/2 [e^{x^2}]_0^1 = (e - 1)/2
  const ans = 1;

  const { choices, answer, correctAnswer } = makeChoices(ans, [-1, 2, 3, 4]);

  return {
    chapter: 18,
    chapterName: '치환적분법과 부분적분법',
    subjectId: 'calculus',
    unitId: 'advanced-integration',
    subUnitId: 'substitution-by-parts',
    amcSubjectId: 'calculus',
    amcUnitId: 'integrals',
    question: `정적분 $\\int_0^1 2x e^{x^2} dx = e - k$일 때, 상수 $k$의 값을 구하시오.`,
    choices,
    answer,
    correctAnswer,
    explanation: `**[단계별 해설]**\n\n1단계: $t = x^2$으로 치환하면 $dt = 2x dx$입니다.\n2단계: 적분 구간은 $x = 0 \\to t = 0$, $x = 1 \\to t = 1$입니다.\n3단계: $\\int_0^1 e^t dt = [e^t]_0^1 = e^1 - e^0 = e - 1$입니다.\n4단계: 따라서 $k = ${ans}$입니다.`,
  };
}

// 19. 유형 19: 급수와 정적분
function genRiemannSumIntegralsProblem(rng = Math.random) {
  const p = randInt(2, 4, rng);
  // lim 1/n sum (k/n)^2 = int_0^1 x^2 dx = 1/3
  const ans = 3;

  const { choices, answer, correctAnswer } = makeChoices(ans, [-2, -1, 1, 2]);

  return {
    chapter: 19,
    chapterName: '급수와 정적분',
    subjectId: 'calculus',
    unitId: 'advanced-integration',
    subUnitId: 'riemann-sum-integrals',
    amcSubjectId: 'calculus',
    amcUnitId: 'integrals',
    question: `급수의 합 $\\lim_{n \\to \\infty} \\sum_{k=1}^n \\left(\\frac{k}{n}\\right)^2 \\frac{1}{n} = \\frac{1}{k}$일 때, 양수 $k$의 값을 구하시오.`,
    choices,
    answer,
    correctAnswer,
    explanation: `**[단계별 해설]**\n\n1단계: 구분구적법 공식을 적용하여 정적분으로 변환합니다.\n2단계: $\\frac{k}{n} = x$, $\\frac{1}{n} = dx$, 적분 구간은 $[0, 1]$입니다.\n3단계: $\\int_0^1 x^2 dx = \\left[ \\frac{1}{3}x^3 \\right]_0^1 = \\frac{1}{3}$입니다.\n4단계: 따라서 $k = 3$입니다.`,
  };
}

// 20. 유형 20: 정적분의 활용 (넓이)
function genAreaBetweenCurvesProblem(rng = Math.random) {
  // Area between y = e^x, x = 0, x = 1, and x-axis = e - 1
  const ans = 1;

  const { choices, answer, correctAnswer } = makeChoices(ans, [-1, 2, 3, 4]);

  return {
    chapter: 20,
    chapterName: '정적분의 활용 (넓이)',
    subjectId: 'calculus',
    unitId: 'advanced-integration',
    subUnitId: 'area-between-curves',
    amcSubjectId: 'calculus',
    amcUnitId: 'integrals',
    question: `곡선 $y = e^x$과 $x$축 및 두 직선 $x = 0, x = 1$로 둘러싸인 도형의 넓이가 $e - k$일 때, 상수 $k$의 값을 구하시오.`,
    choices,
    answer,
    correctAnswer,
    explanation: `**[단계별 해설]**\n\n1단계: 구간 $[0, 1]$에서 $e^x > 0$이므로 구하는 넓이 $S = \\int_0^1 e^x dx$입니다.\n2단계: $S = [e^x]_0^1 = e^1 - e^0 = e - 1$입니다.\n3단계: 따라서 $k = ${ans}$입니다.`,
  };
}

// 21. 유형 21: 정적분의 활용 (부피)
function genVolumeOfSolidsProblem(rng = Math.random) {
  // Solid with base x in [0, 1], cross-section S(x) = e^x -> V = e - 1
  const ans = 1;

  const { choices, answer, correctAnswer } = makeChoices(ans, [-1, 2, 3, 4]);

  return {
    chapter: 21,
    chapterName: '정적분의 활용 (부피)',
    subjectId: 'calculus',
    unitId: 'advanced-integration',
    subUnitId: 'volume-of-solids',
    amcSubjectId: 'calculus',
    amcUnitId: 'integrals',
    question: `어떤 입체도형을 $x$축에 수직인 평면으로 자른 단면의 넓이가 $S(x) = e^x$이다. $x = 0$부터 $x = 1$까지 이 입체도형의 부피가 $e - k$일 때, 상수 $k$의 값을 구하시오.`,
    choices,
    answer,
    correctAnswer,
    explanation: `**[단계별 해설]**\n\n1단계: 단면의 넓이 $S(x)$를 적분하여 입체도형의 부피를 구합니다.\n2단계: $V = \\int_0^1 S(x) dx = \\int_0^1 e^x dx = [e^x]_0^1 = e - 1$입니다.\n3단계: 따라서 $k = ${ans}$입니다.`,
  };
}

export const CALCULUS2_IMPORTANT_GENERATORS_BY_UNIT = {
  'exponential-functions': [genExpFunctionsProblem],
  'logarithmic-functions': [genLogFunctionsProblem],
  'exponential-equations': [genExpEquationsProblem],
  'logarithmic-equations': [genLogEquationsProblem],
  'exp-log-applications': [genExpLogApplicationsProblem],
  'trig-definition': [genTrigDefinitionProblem],
  'trig-graphs': [genTrigGraphsProblem],
  'trig-addition-formulas': [genTrigAdditionFormulasProblem],
  'trig-synthesis': [genTrigSynthesisProblem],
  'trig-equations': [genTrigEquationsProblem],
  'exp-log-limits': [genExpLogLimitsProblem],
  'trig-limits': [genTrigLimitsProblem],
  'trig-limit-geometry': [genTrigLimitGeometryProblem],
  'derivative-rules': [genDerivativeRulesProblem],
  'tangent-lines': [genTangentLinesProblem],
  'extrema-optimization': [genExtremaOptimizationProblem],
  'curve-sketching-equations': [genCurveSketchingEquationsProblem],
  'substitution-by-parts': [genSubstitutionByPartsProblem],
  'riemann-sum-integrals': [genRiemannSumIntegralsProblem],
  'area-between-curves': [genAreaBetweenCurvesProblem],
  'volume-of-solids': [genVolumeOfSolidsProblem],
  'exp-log': [genExpFunctionsProblem, genLogFunctionsProblem, genExpEquationsProblem, genLogEquationsProblem, genExpLogApplicationsProblem],
  'trig': [genTrigDefinitionProblem, genTrigGraphsProblem, genTrigEquationsProblem],
  'advanced-differentiation': [genTrigAdditionFormulasProblem, genTrigSynthesisProblem, genExpLogLimitsProblem, genTrigLimitsProblem, genTrigLimitGeometryProblem, genDerivativeRulesProblem, genTangentLinesProblem, genExtremaOptimizationProblem, genCurveSketchingEquationsProblem],
  'advanced-integration': [genSubstitutionByPartsProblem, genRiemannSumIntegralsProblem, genAreaBetweenCurvesProblem, genVolumeOfSolidsProblem],
};

export const ALL_CALCULUS2_IMPORTANT_GENERATORS = [
  genExpFunctionsProblem,
  genLogFunctionsProblem,
  genExpEquationsProblem,
  genLogEquationsProblem,
  genExpLogApplicationsProblem,
  genTrigDefinitionProblem,
  genTrigGraphsProblem,
  genTrigAdditionFormulasProblem,
  genTrigSynthesisProblem,
  genTrigEquationsProblem,
  genExpLogLimitsProblem,
  genTrigLimitsProblem,
  genTrigLimitGeometryProblem,
  genDerivativeRulesProblem,
  genTangentLinesProblem,
  genExtremaOptimizationProblem,
  genCurveSketchingEquationsProblem,
  genSubstitutionByPartsProblem,
  genRiemannSumIntegralsProblem,
  genAreaBetweenCurvesProblem,
  genVolumeOfSolidsProblem,
];

/**
 * Generates an algorithmic Calculus 2 Important problem for a given unit.
 */
export function generateCalculus2ImportantProblem(unitId, options = {}) {
  const rng = options.rng || Math.random;
  let list = CALCULUS2_IMPORTANT_GENERATORS_BY_UNIT[unitId];
  if (!list || list.length === 0) {
    list = ALL_CALCULUS2_IMPORTANT_GENERATORS;
  }

  const fn = pickRandom(list, rng);
  const prob = fn(rng);
  const idSuffix = Math.floor(rng() * 90000 + 10000);

  return {
    id: `gen-calc2-${prob.subUnitId || unitId}-${idSuffix}`,
    number: options.number || 1,
    tier: 'important',
    grade: 'g2',
    points: 3,
    type: 'multiple_choice',
    sourceLabel: `짱중요한유형 미적분Ⅱ 알고리즘 변형 · ${prob.chapterName}`,
    category: 'csat',
    ...prob,
  };
}

/**
 * Generates a variant problem similar to the provided source problem.
 */
export function generateCalculus2ImportantVariant(sourceProblem, options = {}) {
  const unitId = sourceProblem?.subUnitId || sourceProblem?.unitId || 'exponential-functions';
  return generateCalculus2ImportantProblem(unitId, {
    ...options,
    number: sourceProblem?.number || 1,
  });
}
