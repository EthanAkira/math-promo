/**
 * 수능·평가원 기출 유형 (Jeongseok Calculus 2) 문제 생성 엔진
 * (Algorithmic Problem Generation Engine)
 *
 * 23대 단원별 알고리즘 기반 생성:
 * - 유제: 기본문제 (tier: 'basic', section: '기본문제 (유제)')
 * - 연습문제: 응용문제 (tier: 'applied', section: '응용문제 (연습문제)')
 *
 * 23대 단원 목록:
 * 01. 지수함수와 로그함수 (exp-log / math1)
 * 02. 지수방정식과 로그방정식 (exp-log / math1)
 * 03. 지수부등식과 로그부등식 (exp-log / math1)
 * 04. 삼각함수의 정의 (trig / math1)
 * 05. 삼각함수의 기본 성질 (trig / math1)
 * 06. 삼각함수의 그래프 (trig / math1)
 * 07. 삼각함수의 덧셈정리 (advanced-differentiation / calculus)
 * 08. 삼각방정식과 부등식 (trig / math1)
 * 09. 삼각형과 삼각함수 (trig / math1)
 * 10. 함수의 극한 (advanced-differentiation / calculus)
 * 11. 함수의 미분 (advanced-differentiation / calculus)
 * 12. 여러 가지 함수의 도함수 (advanced-differentiation / calculus)
 * 13. 곡선의 접선과 미분 (advanced-differentiation / calculus)
 * 14. 도함수의 성질 (advanced-differentiation / calculus)
 * 15. 극대ㆍ극소와 미분 (advanced-differentiation / calculus)
 * 16. 최대ㆍ최소와 미분 (advanced-differentiation / calculus)
 * 17. 방정식ㆍ부등식과 미분 (advanced-differentiation / calculus)
 * 18. 부정적분 (advanced-integration / calculus)
 * 19. 치환적분과 부분적분 (advanced-integration / calculus)
 * 20. 정적분의 계산 (advanced-integration / calculus)
 * 21. 여러 가지 정적분에 관한 문제 (advanced-integration / calculus)
 * 22. 넓이와 적분 (advanced-integration / calculus)
 * 23. 부피와 적분 (advanced-integration / calculus)
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

// 01. 지수함수와 로그함수
export function genJeongseokExpLog(tier = 'basic', rng = Math.random) {
  const a = randInt(2, 4, rng);
  const x = randInt(1, 3, rng);
  const ansVal = Math.pow(a, x);
  const question = `지수함수 $f(x) = ${a}^x$에 대하여 $f(${x})$의 값을 구하여라.`;
  const explanation = `$$f(${x}) = ${a}^{${x}} = ${ansVal}$$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansVal, [-3, -1, 2, 4], true, rng);
  return { chapter: 1, chapterName: '지수함수와 로그함수', unitId: 'exp-log', tier, question, choices, correctAnswer, answer, explanation };
}

// 02. 지수방정식과 로그방정식
export function genJeongseokExpLogEq(tier = 'basic', rng = Math.random) {
  const a = randInt(2, 3, rng);
  const x0 = randInt(2, 4, rng);
  const rhs = Math.pow(a, x0);
  const question = `지수방정식 $${a}^{2x - ${x0}} = ${rhs}$의 해 $x$를 구하여라.`;
  const ansVal = x0;
  const explanation = `$${a}^{2x - ${x0}} = ${a}^{${x0}} \\implies 2x - ${x0} = ${x0} \\implies 2x = ${2 * x0} \\implies x = ${ansVal}$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansVal, [-2, -1, 1, 2], true, rng);
  return { chapter: 2, chapterName: '지수방정식과 로그방정식', unitId: 'exp-log', tier, question, choices, correctAnswer, answer, explanation };
}

// 03. 지수부등식과 로그부등식
export function genJeongseokExpLogIneq(tier = 'basic', rng = Math.random) {
  const a = randInt(2, 3, rng);
  const k = randInt(1, 4, rng);
  const rhs = Math.pow(a, k);
  const question = `부등식 $${a}^x \\le ${rhs}$을 만족하는 자연수 $x$의 개수를 구하여라.`;
  const ansVal = k;
  const explanation = `밑이 $${a} > 1$이므로 부등호 방향이 유지되어 $x \\le ${k}$입니다.\n따라서 자연수 $x$는 $1$부터 $${k}$까지 총 $${ansVal}$개입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansVal, [-2, -1, 1, 2], true, rng);
  return { chapter: 3, chapterName: '지수부등식과 로그부등식', unitId: 'exp-log', tier, question, choices, correctAnswer, answer, explanation };
}

// 04. 삼각함수의 정의
export function genJeongseokTrigDefinition(tier = 'basic', rng = Math.random) {
  // theta = pi/6 or pi/3 or pi/4
  const question = `각 $\\theta = \\frac{\\pi}{3}$에 대하여 $\\sin\\theta \\cdot \\cos\\theta$의 값을 구하여라.`;
  const ansStr = `\\frac{\\sqrt{3}}{4}`;
  const explanation = `$$\\sin\\frac{\\pi}{3} = \\frac{\\sqrt{3}}{2}, \\quad \\cos\\frac{\\pi}{3} = \\frac{1}{2}$$\n따라서 곱은 $\\frac{\\sqrt{3}}{2} \\times \\frac{1}{2} = \\frac{\\sqrt{3}}{4}$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansStr, ['\\frac{1}{4}', '\\frac{\\sqrt{3}}{2}', '\\frac{1}{2}', '\\frac{3}{4}'], false, rng);
  return { chapter: 4, chapterName: '삼각함수의 정의', unitId: 'trig', tier, question, choices, correctAnswer, answer, explanation };
}

// 05. 삼각함수의 기본 성질
export function genJeongseokTrigProperties(tier = 'basic', rng = Math.random) {
  const question = `식 $\\sin^2\\theta + \\cos^2\\theta + \\tan^2\\theta - \\sec^2\\theta$의 값을 간단히 하여라.`;
  const ansVal = 0;
  const explanation = `$\\sin^2\\theta + \\cos^2\\theta = 1$이고 $1 + \\tan^2\\theta = \\sec^2\\theta \\implies \\tan^2\\theta - \\sec^2\\theta = -1$이므로\n$$1 + (-1) = 0$$\n입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansVal, [-2, -1, 1, 2], true, rng);
  return { chapter: 5, chapterName: '삼각함수의 기본 성질', unitId: 'trig', tier, question, choices, correctAnswer, answer, explanation };
}

// 06. 삼각함수의 그래프
export function genJeongseokTrigGraphs(tier = 'basic', rng = Math.random) {
  const a = randInt(2, 5, rng);
  const b = randInt(2, 4, rng);
  const period = simplifyFrac(2, b);
  const question = `함수 $y = ${a}\\sin(${b}x)$의 주기 $T$를 구하여라.`;
  const ansStr = `${period}\\pi`;
  const explanation = `$\\sin(bx)$의 주기는 $T = \\frac{2\\pi}{b}$입니다.\n$b = ${b}$이므로 주기는 $\\frac{2\\pi}{${b}} = ${period}\\pi$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansStr, ['\\pi', '2\\pi', `${b}\\pi`, `\\frac{\\pi}{${b}}`], false, rng);
  return { chapter: 6, chapterName: '삼각함수의 그래프', unitId: 'trig', tier, question, choices, correctAnswer, answer, explanation };
}

// 07. 삼각함수의 덧셈정리
export function genJeongseokTrigAddition(tier = 'basic', rng = Math.random) {
  const question = `$\\cos 75^\\circ = \\cos(45^\\circ + 30^\\circ)$의 값을 구하여라.`;
  const ansStr = `\\frac{\\sqrt{6} - \\sqrt{2}}{4}`;
  const explanation = `덧셈정리에 의해\n$$\\cos(45^\\circ + 30^\\circ) = \\cos 45^\\circ\\cos 30^\\circ - \\sin 45^\\circ\\sin 30^\\circ = \\frac{\\sqrt{2}}{2}\\frac{\\sqrt{3}}{2} - \\frac{\\sqrt{2}}{2}\\frac{1}{2} = \\frac{\\sqrt{6} - \\sqrt{2}}{4}$$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansStr, ['\\frac{\\sqrt{6} + \\sqrt{2}}{4}', '\\frac{\\sqrt{3} - 1}{4}', '\\frac{\\sqrt{2}}{4}', '\\frac{1}{2}'], false, rng);
  return { chapter: 7, chapterName: '삼각함수의 덧셈정리', unitId: 'advanced-differentiation', tier, question, choices, correctAnswer, answer, explanation };
}

// 08. 삼각방정식과 부등식
export function genJeongseokTrigEquations(tier = 'basic', rng = Math.random) {
  const question = `$0 \\le x < 2\\pi$에서 방정식 $2\\sin x - 1 = 0$의 모든 실근의 합을 구하여라.`;
  const ansStr = `\\pi`;
  const explanation = `$\\sin x = \\frac{1}{2}$이므로 $0 \\le x < 2\\pi$에서 실근은 $x = \\frac{\\pi}{6}, \\frac{5\\pi}{6}$입니다.\n따라서 실근의 합은 $\\frac{\\pi}{6} + \\frac{5\\pi}{6} = \\pi$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansStr, ['\\frac{\\pi}{2}', '2\\pi', '\\frac{3\\pi}{2}', '\\frac{2\\pi}{3}'], false, rng);
  return { chapter: 8, chapterName: '삼각방정식과 부등식', unitId: 'trig', tier, question, choices, correctAnswer, answer, explanation };
}

// 09. 삼각형과 삼각함수
export function genJeongseokTriangleTrig(tier = 'basic', rng = Math.random) {
  const a = randInt(4, 6, rng);
  const b = randInt(4, 8, rng);
  // S = 1/2 * a * b * sin(30도) = a * b / 4
  const ansVal = (a * b) / 4;
  const question = `두 변의 길이가 각각 $${a}$, $${b}$이고 그 끼인각의 크기가 $30^\\circ$인 삼각형의 넓이를 구하여라.`;
  const explanation = `삼각형의 넓이 공식 $S = \\frac{1}{2}ab\\sin C$에 의해\n$$S = \\frac{1}{2} \\times ${a} \\times ${b} \\times \\sin 30^\\circ = \\frac{1}{2} \\times ${a} \\times ${b} \\times \\frac{1}{2} = ${ansVal}$$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansVal, [-3, -1, 2, 4], true, rng);
  return { chapter: 9, chapterName: '삼각형과 삼각함수', unitId: 'trig', tier, question, choices, correctAnswer, answer, explanation };
}

// 10. 함수의 극한
export function genJeongseokExpLogLimits(tier = 'basic', rng = Math.random) {
  const k = randInt(2, 6, rng);
  const question = `극한값 $\\lim_{x \\to 0} \\frac{\\ln(1 + ${k}x)}{x}$를 구하여라.`;
  const ansVal = k;
  const explanation = `$$\\lim_{x \\to 0} \\frac{\\ln(1 + ${k}x)}{x} = \\lim_{x \\to 0} \\frac{\\ln(1 + ${k}x)}{${k}x} \\times ${k} = 1 \\times ${k} = ${ansVal}$$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansVal, [-2, -1, 1, 2], true, rng);
  return { chapter: 10, chapterName: '함수의 극한', unitId: 'advanced-differentiation', tier, question, choices, correctAnswer, answer, explanation };
}

// 11. 함수의 미분
export function genJeongseokDiffRules(tier = 'basic', rng = Math.random) {
  const a = randInt(2, 5, rng);
  // f(x) = e^{a x} -> f'(0) = a
  const question = `함수 $f(x) = e^{${a}x}$에 대하여 $f'(0)$의 값을 구하여라.`;
  const ansVal = a;
  const explanation = `도함수를 구하면 $f'(x) = ${a}e^{${a}x}$입니다.\n따라서 $f'(0) = ${a}e^0 = ${ansVal}$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansVal, [-2, -1, 1, 2], true, rng);
  return { chapter: 11, chapterName: '함수의 미분', unitId: 'advanced-differentiation', tier, question, choices, correctAnswer, answer, explanation };
}

// 12. 여러 가지 함수의 도함수
export function genJeongseokVariousDerivatives(tier = 'basic', rng = Math.random) {
  const k = randInt(2, 4, rng);
  // f(x) = sin(k x) -> f'(0) = k
  const question = `함수 $f(x) = \\sin(${k}x)$에 대하여 $f'(0)$의 값을 구하여라.`;
  const ansVal = k;
  const explanation = `도함수를 구하면 $f'(x) = ${k}\\cos(${k}x)$입니다.\n따라서 $f'(0) = ${k}\\cos(0) = ${ansVal}$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansVal, [-2, -1, 1, 2], true, rng);
  return { chapter: 12, chapterName: '여러 가지 함수의 도함수', unitId: 'advanced-differentiation', tier, question, choices, correctAnswer, answer, explanation };
}

// 13. 곡선의 접선과 미분
export function genJeongseokCurveTangents(tier = 'basic', rng = Math.random) {
  // y = ln x at (1, 0) -> slope = 1/1 = 1
  const question = `곡선 $y = \\ln x$ 위의 점 $(1, 0)$에서의 접선의 기울기를 구하여라.`;
  const ansVal = 1;
  const explanation = `$y' = \\frac{1}{x}$이므로 $x = 1$에서의 접선의 기울기는 $m = \\frac{1}{1} = 1$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansVal, [-1, 2, 3, 0], true, rng);
  return { chapter: 13, chapterName: '곡선의 접선과 미분', unitId: 'advanced-differentiation', tier, question, choices, correctAnswer, answer, explanation };
}

// 14. 도함수의 성질
export function genJeongseokMeanValue(tier = 'basic', rng = Math.random) {
  // 평균값 정리: f(x) = x^2 on [0, 4] -> f'(c) = 2c = (16-0)/4 = 4 -> c = 2
  const b = randInt(2, 6, rng) * 2;
  const c = b / 2;
  const question = `함수 $f(x) = x^2$에 대하여 닫힌 구간 $[0, ${b}]$에서 평균값 정리를 만족하는 상수 $c$의 값을 구하여라.`;
  const ansVal = c;
  const explanation = `평균변화율은 $\\frac{f(${b}) - f(0)}{${b} - 0} = \\frac{${b*b}}{${b}} = ${b}$입니다.\n$f'(c) = 2c = ${b} \\implies c = ${ansVal}$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansVal, [-2, -1, 1, 2], true, rng);
  return { chapter: 14, chapterName: '도함수의 성질', unitId: 'advanced-differentiation', tier, question, choices, correctAnswer, answer, explanation };
}

// 15. 극대·극소와 미분
export function genJeongseokExtrema(tier = 'basic', rng = Math.random) {
  // f(x) = x e^{-x} -> f'(x) = (1 - x) e^{-x} = 0 -> x = 1 (극대)
  const question = `함수 $f(x) = x e^{-x}$의 극댓값을 구하여라.`;
  const ansStr = `\\frac{1}{e}`;
  const explanation = `$f'(x) = (1 - x)e^{-x} = 0 \\implies x = 1$에서 극대입니다.\n따라서 극댓값은 $f(1) = 1 \\cdot e^{-1} = \\frac{1}{e}$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansStr, ['e', '\\frac{2}{e}', '\\frac{1}{e^2}', '1'], false, rng);
  return { chapter: 15, chapterName: '극대ㆍ극소와 미분', unitId: 'advanced-differentiation', tier, question, choices, correctAnswer, answer, explanation };
}

// 16. 최대·최소와 미분
export function genJeongseokMaxMin(tier = 'basic', rng = Math.random) {
  // f(x) = x - ln x on [1, e] -> f'(x) = 1 - 1/x = 0 -> x = 1 (극소이자 최소) f(1) = 1
  const question = `닫힌 구간 $[1, e]$에서 함수 $f(x) = x - \\ln x$의 최솟값을 구하여라.`;
  const ansVal = 1;
  const explanation = `$f'(x) = 1 - \\frac{1}{x} = 0 \\implies x = 1$입니다.\n구간 내에서 $x = 1$일 때 최솟값 $f(1) = 1 - 0 = 1$을 갖습니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansVal, [-1, 2, 3, 0], true, rng);
  return { chapter: 16, chapterName: '최대ㆍ최소와 미분', unitId: 'advanced-differentiation', tier, question, choices, correctAnswer, answer, explanation };
}

// 17. 방정식·부등식과 미분
export function genJeongseokDiffEquation(tier = 'basic', rng = Math.random) {
  const question = `모든 실수 $x$에 대하여 부등식 $e^x \\ge kx$가 성립하도록 하는 양수 $k$의 최댓값을 구하여라.`;
  const ansStr = `e`;
  const explanation = `원점을 지나는 직선 $y = kx$가 곡선 $y = e^x$에 접할 때 접점은 $(1, e)$이고 기울기는 $k = e$입니다.\n따라서 $k$의 최댓값은 $e$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansStr, ['1', '2', '2e', '\\frac{e}{2}'], false, rng);
  return { chapter: 17, chapterName: '방정식ㆍ부등식과 미분', unitId: 'advanced-differentiation', tier, question, choices, correctAnswer, answer, explanation };
}

// 18. 부정적분
export function genJeongseokIndefiniteIntegral(tier = 'basic', rng = Math.random) {
  const a = randInt(2, 5, rng);
  const question = `함수 $f(x) = \\cos(${a}x)$의 한 부정적분 $F(x)$에 대하여 $F(0) = 0$일 때, $F(x)$의 식을 구하여라.`;
  const ansStr = `\\frac{1}{${a}}\\sin(${a}x)`;
  const explanation = `$$\\int \\cos(${a}x) dx = \\frac{1}{${a}}\\sin(${a}x) + C$$\n$F(0) = 0 \\implies C = 0$이므로 $F(x) = \\frac{1}{${a}}\\sin(${a}x)$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansStr, [`${a}\\sin(${a}x)`, `-\\frac{1}{${a}}\\sin(${a}x)`, `\\frac{1}{${a}}\\cos(${a}x)`, `\\sin(${a}x)`], false, rng);
  return { chapter: 18, chapterName: '부정적분', unitId: 'advanced-integration', tier, question, choices, correctAnswer, answer, explanation };
}

// 19. 치환적분과 부분적분
export function genJeongseokSubstByParts(tier = 'basic', rng = Math.random) {
  const question = `정적분 $\\int_{0}^{1} x e^{x} dx$의 값을 구하여라.`;
  const ansVal = 1;
  const explanation = `부분적분법에 의해\n$$\\int_{0}^{1} x e^x dx = \\left[ x e^x \\right]_{0}^{1} - \\int_{0}^{1} e^x dx = e - (e - 1) = 1$$\n입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansVal, [-1, 2, 3, 0], true, rng);
  return { chapter: 19, chapterName: '치환적분과 부분적분', unitId: 'advanced-integration', tier, question, choices, correctAnswer, answer, explanation };
}

// 20. 정적분의 계산
export function genJeongseokDefiniteIntegral(tier = 'basic', rng = Math.random) {
  const question = `정적분 $\\int_{1}^{e} \\frac{1}{x} dx$의 값을 구하여라.`;
  const ansVal = 1;
  const explanation = `$$\\int_{1}^{e} \\frac{1}{x} dx = \\left[ \\ln x \\right]_{1}^{e} = \\ln e - \\ln 1 = 1 - 0 = 1$$\n입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansVal, [-1, 2, 3, 0], true, rng);
  return { chapter: 20, chapterName: '정적분의 계산', unitId: 'advanced-integration', tier, question, choices, correctAnswer, answer, explanation };
}

// 21. 여러 가지 정적분에 관한 문제
export function genJeongseokRiemannIntegral(tier = 'basic', rng = Math.random) {
  const question = `극한값 $\\lim_{n \\to \\infty} \\frac{1}{n} \\sum_{k=1}^{n} e^{\\frac{k}{n}}$을 구하여라.`;
  const ansStr = `e - 1`;
  const explanation = `구분구적법에 의해\n$$\\lim_{n \\to \\infty} \\frac{1}{n} \\sum_{k=1}^{n} e^{\\frac{k}{n}} = \\int_{0}^{1} e^x dx = \\left[ e^x \\right]_{0}^{1} = e - 1$$\n입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansStr, ['e', 'e + 1', '1', '\\frac{e}{2}'], false, rng);
  return { chapter: 21, chapterName: '여러 가지 정적분에 관한 문제', unitId: 'advanced-integration', tier, question, choices, correctAnswer, answer, explanation };
}

// 22. 넓이와 적분
export function genJeongseokAreaIntegral(tier = 'basic', rng = Math.random) {
  // y = e^x, x=0, x=1, y=0 사이의 넓이: e - 1
  const question = `곡선 $y = e^x$과 $x$축 및 두 직선 $x = 0$, $x = 1$로 둘러싸인 도형의 넓이를 구하여라.`;
  const ansStr = `e - 1`;
  const explanation = `구간 $[0, 1]$에서 $e^x > 0$이므로\n$$S = \\int_{0}^{1} e^x dx = \\left[ e^x \\right]_{0}^{1} = e - 1$$\n입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansStr, ['e', 'e + 1', '1', '\\frac{e}{2}'], false, rng);
  return { chapter: 22, chapterName: '넓이와 적분', unitId: 'advanced-integration', tier, question, choices, correctAnswer, answer, explanation };
}

// 23. 부피와 적분
export function genJeongseokVolumeIntegral(tier = 'basic', rng = Math.random) {
  // 단면 S(x) = e^x on [0, 1] -> V = e - 1
  const question = `어떤 입체도형을 $x$축에 수직인 평면으로 자른 단면의 넓이가 $S(x) = e^x$ ($0 \\le x \\le 1$)일 때, 이 입체도형의 부피를 구하여라.`;
  const ansStr = `e - 1`;
  const explanation = `부피 $V$는 단면적의 정적분이므로\n$$V = \\int_{0}^{1} e^x dx = \\left[ e^x \\right]_{0}^{1} = e - 1$$\n입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansStr, ['e', 'e + 1', '1', '\\frac{e}{2}'], false, rng);
  return { chapter: 23, chapterName: '부피와 적분', unitId: 'advanced-integration', tier, question, choices, correctAnswer, answer, explanation };
}

// Master Registry
export const JEONGSEOK_CALC2_GENERATORS = {
  1: genJeongseokExpLog,
  2: genJeongseokExpLogEq,
  3: genJeongseokExpLogIneq,
  4: genJeongseokTrigDefinition,
  5: genJeongseokTrigProperties,
  6: genJeongseokTrigGraphs,
  7: genJeongseokTrigAddition,
  8: genJeongseokTrigEquations,
  9: genJeongseokTriangleTrig,
  10: genJeongseokExpLogLimits,
  11: genJeongseokDiffRules,
  12: genJeongseokVariousDerivatives,
  13: genJeongseokCurveTangents,
  14: genJeongseokMeanValue,
  15: genJeongseokExtrema,
  16: genJeongseokMaxMin,
  17: genJeongseokDiffEquation,
  18: genJeongseokIndefiniteIntegral,
  19: genJeongseokSubstByParts,
  20: genJeongseokDefiniteIntegral,
  21: genJeongseokRiemannIntegral,
  22: genJeongseokAreaIntegral,
  23: genJeongseokVolumeIntegral,
};

export const JEONGSEOK_CALC2_GENERATORS_BY_UNIT = {
  'exp-log': [genJeongseokExpLog, genJeongseokExpLogEq, genJeongseokExpLogIneq],
  trig: [genJeongseokTrigDefinition, genJeongseokTrigProperties, genJeongseokTrigGraphs, genJeongseokTrigEquations, genJeongseokTriangleTrig],
  'advanced-differentiation': [
    genJeongseokTrigAddition,
    genJeongseokExpLogLimits,
    genJeongseokDiffRules,
    genJeongseokVariousDerivatives,
    genJeongseokCurveTangents,
    genJeongseokMeanValue,
    genJeongseokExtrema,
    genJeongseokMaxMin,
    genJeongseokDiffEquation,
  ],
  'advanced-integration': [
    genJeongseokIndefiniteIntegral,
    genJeongseokSubstByParts,
    genJeongseokDefiniteIntegral,
    genJeongseokRiemannIntegral,
    genJeongseokAreaIntegral,
    genJeongseokVolumeIntegral,
  ],
};

/**
 * Generates an algorithmic Jeongseok Calculus 2 problem.
 */
export function generateJeongseokCalc2Problem(unitIdOrChapter, options = {}) {
  const rng = options.rng || Math.random;
  const tier = options.tier || 'applied';

  let fn;
  if (typeof unitIdOrChapter === 'number' && JEONGSEOK_CALC2_GENERATORS[unitIdOrChapter]) {
    fn = JEONGSEOK_CALC2_GENERATORS[unitIdOrChapter];
  } else if (JEONGSEOK_CALC2_GENERATORS_BY_UNIT[unitIdOrChapter]) {
    fn = pickRandom(JEONGSEOK_CALC2_GENERATORS_BY_UNIT[unitIdOrChapter], rng);
  } else {
    const all = Object.values(JEONGSEOK_CALC2_GENERATORS);
    fn = pickRandom(all, rng);
  }

  const prob = fn(tier, rng);
  const idSuffix = Math.floor(rng() * 90000 + 10000);
  const tierLabel = tier === 'basic' ? '기본문제' : '응용문제';

  return {
    id: `gen-jeongseok-calc2-${prob.chapter}-${tier}-${idSuffix}`,
    number: options.number || 1,
    grade: 'g2',
    category: 'csat',
    sourceLabel: `수능·평가원 기출 유형 변형 · ${prob.chapter}단원 ${prob.chapterName} [${tierLabel}]`,
    ...prob,
  };
}

/**
 * Generates a variant problem similar to the provided source problem.
 */
export function generateJeongseokCalc2Variant(sourceProblem, options = {}) {
  const ch = sourceProblem?.chapter || 1;
  const tier = sourceProblem?.tier || 'applied';
  return generateJeongseokCalc2Problem(ch, {
    ...options,
    tier,
    number: sourceProblem?.number || 1,
  });
}
