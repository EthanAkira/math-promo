/**
 * 실력정석 수학2 (Silryeok Jeongseok Math 2) 문제 생성 엔진
 * (Algorithmic Problem Generation Engine)
 *
 * 14대 단원별 알고리즘 기반 생성:
 * - 유제: 기본문제 (tier: 'basic', section: '기본문제 (유제)')
 * - 연습문제 표준: 응용문제 (tier: 'applied', section: '응용문제 (연습문제 표준)')
 * - 연습문제 실력편: 고난도 문제 (tier: 'advanced', section: '고난도 문제 (실력 연습문제)')
 *
 * 14대 단원 목록:
 * 01. 방정식 (equations-inequalities / common-math-1)
 * 02. 부등식 (equations-inequalities / common-math-1)
 * 03. 삼각함수의 덧셈정리 (advanced-differentiation / calculus)
 * 04. 삼각함수의 공식과 방정식 (advanced-differentiation / calculus)
 * 05. 함수의 극한 (advanced-differentiation / calculus)
 * 06. 함수의 연속 (limits-continuity / math2)
 * 07. 변화율과 도함수 (advanced-differentiation / calculus)
 * 08. 여러 가지 함수의 도함수 (advanced-differentiation / calculus)
 * 09. 곡선의 접선과 미분 (advanced-differentiation / calculus)
 * 10. 평균값의 정리 (advanced-differentiation / calculus)
 * 11. 극대ㆍ극소와 미분 (advanced-differentiation / calculus)
 * 12. 최대ㆍ최소와 미분 (advanced-differentiation / calculus)
 * 13. 방정식ㆍ부등식과 미분 (advanced-differentiation / calculus)
 * 14. 속도ㆍ가속도와 미분 (advanced-differentiation / calculus)
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

// -----------------------------------------------------------------------------
// 01. 방정식 (분수방정식, 무리방정식)
// -----------------------------------------------------------------------------
export function genSilryeokMath2Equations(tier = 'basic', rng = Math.random) {
  let question, explanation, correctVal;

  if (tier === 'basic') {
    // fractional equation: a/(x - 1) + b/(x + 1) = c
    const a = randInt(1, 3, rng);
    const b = randInt(1, 3, rng);
    const xSol = randInt(2, 4, rng);
    const cVal = simplifyFrac(a * (xSol + 1) + b * (xSol - 1), xSol * xSol - 1);
    question = `분수방정식 $\\frac{${a}}{x - 1} + \\frac{${b}}{x + 1} = ${cVal}$의 실근 $x$의 값을 구하시오.`;
    correctVal = xSol;
    explanation = `양변에 $(x - 1)(x + 1)$을 곱하여 정리하면 $x = ${xSol}$을 얻는다. 분모를 $0$으로 만들지 않으므로 참인 실근이다.`;
  } else if (tier === 'applied') {
    // irrational equation: sqrt(x + a) = x - b
    const b = randInt(1, 3, rng);
    const xSol = b + 3; // ensure x - b >= 0
    const a = (xSol - b) * (xSol - b) - xSol;
    question = `무리방정식 $\\sqrt{x ${a >= 0 ? '+ ' + a : '- ' + Math.abs(a)}} = x - ${b}$의 실근 $x$의 값은?`;
    correctVal = xSol;
    explanation = `양변을 제곱하면 $x + ${a} = (x - ${b})^2 = x^2 - ${2 * b}x + ${b * b}$\n정리하면 $x^2 - ${2 * b + 1}x + ${b * b - a} = 0$\n무리방정식의 조건 $x - ${b} \\ge 0$ (즉 $x \\ge ${b}$)을 만족하는 근은 $x = ${xSol}$이다.`;
  } else {
    // advanced: extraneous root identification (무연근 판정)
    question = `분수방정식 $\\frac{x - 1}{x - 3} = \\frac{2}{x - 3} + 1$에 대하여 설명한 것 중 옳은 것은?`;
    return {
      chapter: 1, chapterName: '방정식', subjectId: 'common-math-1', unitId: 'equations-inequalities', subUnitId: 'fractional-irrational-eq',
      tier, question,
      explanation: `양변에 $(x - 3)$을 곱하면 $x - 1 = 2 + (x - 3) \\implies x - 1 = x - 1$이 되어 항등식이 된다.\n그러나 원방정식의 분모 조건 $x - 3 \\ne 0$, 즉 $x \\ne 3$이어야 하므로 $x = 3$을 제외한 모든 실수가 해이다.`,
      choices: [
        '$x \\ne 3$인 모든 실수가 해이다.',
        '해는 오직 $x = 3$뿐이다.',
        '해가 전혀 존재하지 않는다.',
        '모든 실수가 해이다.',
        '해는 $x = 1, 3$의 2개이다.'
      ],
      correctAnswer: 0, answer: '0', points: 4,
    };
  }

  const { choices, correctAnswer, answer } = buildChoices(correctVal, [-2, -1, 1, 2], true, rng);
  return {
    chapter: 1, chapterName: '방정식', subjectId: 'common-math-1', unitId: 'equations-inequalities', subUnitId: 'fractional-irrational-eq',
    tier, question, explanation, choices, correctAnswer, answer, points: tier === 'basic' ? 2 : 3,
  };
}

// -----------------------------------------------------------------------------
// 02. 부등식 (고차부등식, 분수부등식)
// -----------------------------------------------------------------------------
export function genSilryeokMath2Inequalities(tier = 'basic', rng = Math.random) {
  let question, explanation, correctVal;

  if (tier === 'basic') {
    // higher degree: (x - 1)(x - 3)(x - 5) <= 0
    question = `부등식 $(x - 1)(x - 3)(x - 5) \\le 0$을 만족하는 자연수 $x$의 개수는?`;
    correctVal = 3; // 1, 3, 4 (wait, x <= 1 or 3 <= x <= 5 => natural: 1, 3, 4, 5 => 4)
    question = `부등식 $(x - 1)(x - 3)(x - 5) \\le 0$의 해가 $x \\le a$ 또는 $b \\le x \\le c$일 때, $a + b + c$의 값은?`;
    correctVal = 1 + 3 + 5;
    explanation = `삼차부등식의 부호 판정에 의하여 해는 $x \\le 1$ 또는 $3 \\le x \\le 5$이다.\n따라서 $a = 1, b = 3, c = 5$이므로 $a + b + c = 9$이다.`;
  } else if (tier === 'applied') {
    // fractional inequality: (x - 2)/(x - 5) <= 0
    question = `분수부등식 $\\frac{x - 2}{x - 5} \\le 0$을 만족하는 정수 $x$의 개수는?`;
    correctVal = 3; // 2, 3, 4 (x != 5)
    explanation = `분수부등식 $\\frac{x - 2}{x - 5} \\le 0$은 $(x - 2)(x - 5) \\le 0$이고 $x \\ne 5$와 동치이다.\n따라서 해는 $2 \\le x < 5$이므로 만족하는 정수 $x$는 $2, 3, 4$의 $3$개이다.`;
  } else {
    // advanced: (x - a)/(x^2 - b) >= 0 with constraint
    question = `분수부등식 $\\frac{x - 1}{x^2 - 9} \\le 0$을 만족하는 자연수 $x$의 합을 구하시오.`;
    // (x - 1)(x - 3)(x + 3) <= 0 with x != -3, 3 => x < -3 or 1 <= x < 3
    // Natural numbers in range: x = 1, 2 => sum = 3
    correctVal = 3;
    explanation = `$(x - 1)(x - 3)(x + 3) \\le 0$이고 $x \\ne \\pm 3$이다.\n해는 $x < -3$ 또는 $1 \\le x < 3$이다.\n만족하는 자연수 $x$는 $1, 2$이므로 그 합은 $1 + 2 = 3$이다.`;
  }

  const { choices, correctAnswer, answer } = buildChoices(correctVal, [-2, -1, 1, 2], true, rng);
  return {
    chapter: 2, chapterName: '부등식', subjectId: 'common-math-1', unitId: 'equations-inequalities', subUnitId: 'fractional-inequalities',
    tier, question, explanation, choices, correctAnswer, answer, points: tier === 'basic' ? 2 : tier === 'applied' ? 3 : 4,
  };
}

// -----------------------------------------------------------------------------
// 03. 삼각함수의 덧셈정리
// -----------------------------------------------------------------------------
export function genSilryeokMath2TrigAddition(tier = 'basic', rng = Math.random) {
  let question, explanation, correctVal;

  if (tier === 'basic') {
    question = `$\\sin 75^\\circ$의 값을 삼각함수의 덧셈정리를 이용하여 구한 것으로 옳은 것은?`;
    return {
      chapter: 3, chapterName: '삼각함수의 덧셈정리', subjectId: 'calculus', unitId: 'advanced-differentiation', subUnitId: 'trig-addition-formulas',
      tier, question,
      explanation: `$\\sin 75^\\circ = \\sin(45^\\circ + 30^\\circ) = \\sin 45^\\circ \\cos 30^\\circ + \\cos 45^\\circ \\sin 30^\\circ = \\frac{\\sqrt{2}}{2} \\cdot \\frac{\\sqrt{3}}{2} + \\frac{\\sqrt{2}}{2} \\cdot \\frac{1}{2} = \\frac{\\sqrt{6} + \\sqrt{2}}{4}$이다.`,
      choices: ['$\\frac{\\sqrt{6} + \\sqrt{2}}{4}$', '$\\frac{\\sqrt{6} - \\sqrt{2}}{4}$', '$\\frac{\\sqrt{3} + 1}{2\\sqrt{2}}$', '$\\frac{\\sqrt{6} + \\sqrt{3}}{4}$', '$\\frac{\\sqrt{2} + 1}{4}$'],
      correctAnswer: 0, answer: '0', points: 2,
    };
  } else if (tier === 'applied') {
    // angle between two lines: tan theta = |m1 - m2| / (1 + m1 * m2)
    // lines y = 2x and y = 1/3 x => tan theta = |2 - 1/3| / (1 + 2/3) = (5/3) / (5/3) = 1 => theta = 45 deg
    question = `두 직선 $y = 2x$와 $y = \\frac{1}{3}x$가 이루는 예각의 크기 $\\theta$에 대하여 $\\tan\\theta$의 값은?`;
    correctVal = 1;
    explanation = `두 직선의 기울기를 각각 $m_1 = 2, m_2 = \\frac{1}{3}$이라 하면\n$\\tan\\theta = \\left| \\frac{m_1 - m_2}{1 + m_1 m_2} \\right| = \\left| \\frac{2 - \\frac{1}{3}}{1 + 2 \\cdot \\frac{1}{3}} \\right| = \\frac{\\frac{5}{3}}{\\frac{5}{3}} = 1$이다.`;
  } else {
    // advanced: linear combination synthesis (합성)
    const a = randInt(2, 4, rng);
    const b = randInt(2, 4, rng);
    const maxVal = Math.round(Math.sqrt(a * a + b * b) * 10) / 10;
    // 3 sin x + 4 cos x => max = 5
    question = `함수 $f(x) = 3\\sin x + 4\\cos x + 2$의 최댓값을 구하시오.`;
    correctVal = 7;
    explanation = `$3\\sin x + 4\\cos x = 5\\sin(x + \\alpha)$ ($단, $\\cos\\alpha = \\frac{3}{5}, \\sin\\alpha = \\frac{4}{5}$)\n따라서 $f(x)$의 최댓값은 $5 + 2 = 7$이다.`;
  }

  const { choices, correctAnswer, answer } = buildChoices(correctVal, [-2, -1, 1, 2], true, rng);
  return {
    chapter: 3, chapterName: '삼각함수의 덧셈정리', subjectId: 'calculus', unitId: 'advanced-differentiation', subUnitId: 'trig-addition-formulas',
    tier, question, explanation, choices, correctAnswer, answer, points: tier === 'applied' ? 3 : 4,
  };
}

// -----------------------------------------------------------------------------
// 04. 삼각함수의 공식과 방정식
// -----------------------------------------------------------------------------
export function genSilryeokMath2TrigFormulas(tier = 'basic', rng = Math.random) {
  let question, explanation, correctVal;

  if (tier === 'basic') {
    question = `$\\cos\\theta = \\frac{3}{5}$ ($0 < \\theta < \\frac{\\pi}{2}$)일 때, $\\cos 2\\theta$의 값은?`;
    return {
      chapter: 4, chapterName: '삼각함수의 공식과 방정식', subjectId: 'calculus', unitId: 'advanced-differentiation', subUnitId: 'trig-equations',
      tier, question,
      explanation: `배각공식에 의하여 $\\cos 2\\theta = 2\\cos^2\\theta - 1 = 2\\left(\\frac{3}{5}\\right)^2 - 1 = 2 \\cdot \\frac{9}{25} - 1 = \\frac{18}{25} - \\frac{25}{25} = -\\frac{7}{25}$이다.`,
      choices: ['$-\\frac{7}{25}$', '$\\frac{7}{25}$', '$\\frac{24}{25}$', '$-\\frac{24}{25}$', '$\\frac{9}{25}$'],
      correctAnswer: 0, answer: '0', points: 2,
    };
  } else if (tier === 'applied') {
    // equation: 2cos^2 x - cos x - 1 = 0 in [0, 2pi)
    // (2cos x + 1)(cos x - 1) = 0 => cos x = 1 (x=0) or cos x = -1/2 (x = 2pi/3, 4pi/3) => 3 solutions
    question = `구간 $[0, 2\\pi)$에서 삼각방정식 $2\\cos^2 x - \\cos x - 1 = 0$의 서로 다른 실근의 개수는?`;
    correctVal = 3;
    explanation = `$(2\\cos x + 1)(\\cos x - 1) = 0 \\implies \\cos x = 1$ 또는 $\\cos x = -\\frac{1}{2}$\n$[0, 2\\pi)$에서 $\\cos x = 1$의 해는 $x = 0$\n$\\cos x = -\\frac{1}{2}$의 해는 $x = \\frac{2\\pi}{3}, \\frac{4\\pi}{3}$\n따라서 서로 다른 실근의 개수는 $3$개이다.`;
  } else {
    // advanced: sum of solutions
    question = `구간 $[0, 2\\pi)$에서 방정식 $\\cos 2x = \\sin x$의 모든 실근의 합은?`;
    // 1 - 2sin^2 x = sin x => 2sin^2 x + sin x - 1 = 0 => (2sin x - 1)(sin x + 1) = 0
    // sin x = 1/2 => pi/6, 5pi/6
    // sin x = -1 => 3pi/2
    // sum = pi/6 + 5pi/6 + 3pi/2 = pi + 3pi/2 = 5pi/2
    return {
      chapter: 4, chapterName: '삼각함수의 공식과 방정식', subjectId: 'calculus', unitId: 'advanced-differentiation', subUnitId: 'trig-equations',
      tier, question,
      explanation: `$\\cos 2x = 1 - 2\\sin^2 x$이므로 $1 - 2\\sin^2 x = \\sin x \\implies 2\\sin^2 x + \\sin x - 1 = 0$\n$(2\\sin x - 1)(\\sin x + 1) = 0 \\implies \\sin x = \\frac{1}{2}$ 또는 $\\sin x = -1$\n해는 $x = \\frac{\\pi}{6}, \\frac{5\\pi}{6}, \\frac{3\\pi}{2}$이다.\n실근의 합은 $\\frac{\\pi}{6} + \\frac{5\\pi}{6} + \\frac{3\\pi}{2} = \\frac{5\\pi}{2}$이다.`,
      choices: ['$\\frac{5\\pi}{2}$', '$2\\pi$', '$3\\pi$', '$\\frac{7\\pi}{2}$', '$\\frac{3\\pi}{2}$'],
      correctAnswer: 0, answer: '0', points: 4,
    };
  }

  const { choices, correctAnswer, answer } = buildChoices(correctVal, [-2, -1, 1, 2], true, rng);
  return {
    chapter: 4, chapterName: '삼각함수의 공식과 방정식', subjectId: 'calculus', unitId: 'advanced-differentiation', subUnitId: 'trig-equations',
    tier, question, explanation, choices, correctAnswer, answer, points: 3,
  };
}

// -----------------------------------------------------------------------------
// 05. 함수의 극한 (초월함수의 극한)
// -----------------------------------------------------------------------------
export function genSilryeokMath2FuncLimits(tier = 'basic', rng = Math.random) {
  const a = randInt(2, 5, rng);
  const b = randInt(2, 5, rng);

  let question, explanation;
  if (tier === 'basic') {
    question = `극한값 $\\lim_{x \\to 0} \\frac{\\sin(${a}x)}{${b}x}$의 값은?`;
    explanation = `$\\lim_{x \\to 0} \\frac{\\sin(${a}x)}{${a}x} \\times \\frac{${a}}{${b}} = 1 \\times \\frac{${a}}{${b}} = ${simplifyFrac(a, b)}$이다.`;
    return {
      chapter: 5, chapterName: '함수의 극한', subjectId: 'calculus', unitId: 'advanced-differentiation', subUnitId: 'transcendental-limits',
      tier, question, explanation,
      choices: [`$${simplifyFrac(a, b)}$`, `$${simplifyFrac(b, a)}$`, `$1$`, `$${a * b}$`, `$0$`],
      correctAnswer: 0, answer: '0', points: 2,
    };
  } else if (tier === 'applied') {
    question = `극한값 $\\lim_{x \\to 0} \\frac{e^{${a}x} - 1}{\\ln(1 + ${b}x)}$의 값은?`;
    explanation = `분모와 분자를 $x$로 나누면 $\\lim_{x \\to 0} \\frac{\\frac{e^{${a}x}-1}{x}}{\\frac{\\ln(1+${b}x)}{x}} = \\frac{${a}}{${b}} = ${simplifyFrac(a, b)}$이다.`;
    return {
      chapter: 5, chapterName: '함수의 극한', subjectId: 'calculus', unitId: 'advanced-differentiation', subUnitId: 'transcendental-limits',
      tier, question, explanation,
      choices: [`$${simplifyFrac(a, b)}$`, `$${simplifyFrac(b, a)}$`, `$${a + b}$`, `$\\frac{1}{${a * b}}$`, `$1$`],
      correctAnswer: 0, answer: '0', points: 3,
    };
  } else {
    // advanced: (1 - cos ax) / x^2 -> a^2 / 2
    const ansFrac = simplifyFrac(a * a, 2);
    question = `극한값 $\\lim_{x \\to 0} \\frac{1 - \\cos(${a}x)}{x^2}$의 값은?`;
    explanation = `분모와 분자에 $1 + \\cos(${a}x)$를 곱하면\n$\\lim_{x \\to 0} \\frac{\\sin^2(${a}x)}{x^2(1 + \\cos ${a}x)} = ${a}^2 \\times \\frac{1}{1 + 1} = \\frac{${a * a}}{2} = ${ansFrac}$이다.`;
    return {
      chapter: 5, chapterName: '함수의 극한', subjectId: 'calculus', unitId: 'advanced-differentiation', subUnitId: 'transcendental-limits',
      tier, question, explanation,
      choices: [`$${ansFrac}$`, `$${a}$`, `$${a * a}$`, `$\\frac{${a}}{2}$`, `$1$`],
      correctAnswer: 0, answer: '0', points: 4,
    };
  }
}

// -----------------------------------------------------------------------------
// 06. 함수의 연속
// -----------------------------------------------------------------------------
export function genSilryeokMath2FuncContinuity(tier = 'basic', rng = Math.random) {
  const a = randInt(1, 4, rng);
  const k = randInt(2, 5, rng);

  let question, explanation, correctVal;
  if (tier === 'basic') {
    // piecewise function continuous at x = 1: f(x) = kx + a (x >= 1), f(x) = x^2 + 3 (x < 1)
    const rhsVal = 1 + 3;
    // k(1) + a = 4 => a = 4 - k
    const targetA = rhsVal - k;
    question = `함수 $f(x) = \\begin{cases} ${k}x + a & (x \\ge 1) \\\\ x^2 + 3 & (x < 1) \\end{cases}$ 가 $x = 1$에서 연속이 되도록 하는 상수 $a$의 값은?`;
    correctVal = targetA;
    explanation = `함수 $f(x)$가 $x = 1$에서 연속이려면 좌극한과 우극한(함숫값)이 일치해야 한다.\n$\\lim_{x \\to 1^-} (x^2 + 3) = 4$\n$\\lim_{x \\to 1^+} (${k}x + a) = ${k} + a$\n따라서 ${k} + a = 4 \\implies a = ${targetA}$이다.`;
  } else if (tier === 'applied') {
    // Intermediate Value Theorem: f(x) = x^3 - 3x - 1 in which interval has root?
    // f(1) = -3, f(2) = 1 => root in (1, 2)
    question = `방정식 $x^3 - 3x - 1 = 0$의 오직 하나의 양의 실근이 존재하는 구간으로 옳은 것은?`;
    return {
      chapter: 6, chapterName: '함수의 연속', subjectId: 'math2', unitId: 'limits-continuity', subUnitId: 'continuity-theorems',
      tier, question,
      explanation: `$f(x) = x^3 - 3x - 1$이라 할 때,\n$f(1) = 1 - 3 - 1 = -3 < 0$\n$f(2) = 8 - 6 - 1 = 1 > 0$\n$f(1)f(2) < 0$이므로 사잇값(중간값)의 정리에 의하여 열린구간 $(1, 2)$에 적어도 하나의 실근이 존재한다.`,
      choices: ['$(1, 2)$', '$(0, 1)$', '$(2, 3)$', '$(3, 4)$', '$(-1, 0)$'],
      correctAnswer: 0, answer: '0', points: 3,
    };
  } else {
    // advanced: product continuity with removable discontinuity
    question = `함수 $f(x) = \\begin{cases} \\frac{x^2 - 4}{x - 2} & (x \\ne 2) \\\\ k & (x = 2) \\end{cases}$ 가 모든 실수에서 연속일 때, 상수 $k$의 값은?`;
    correctVal = 4;
    explanation = `$\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2} = \\lim_{x \\to 2} (x + 2) = 4$\n연속이려면 $f(2) = \\lim_{x \\to 2} f(x) = 4$이어야 하므로 $k = 4$이다.`;
  }

  const { choices, correctAnswer, answer } = buildChoices(correctVal, [-2, -1, 1, 2], true, rng);
  return {
    chapter: 6, chapterName: '함수의 연속', subjectId: 'math2', unitId: 'limits-continuity', subUnitId: 'continuity-theorems',
    tier, question, explanation, choices, correctAnswer, answer, points: tier === 'basic' ? 2 : 4,
  };
}

// -----------------------------------------------------------------------------
// 07. 변화율과 도함수
// -----------------------------------------------------------------------------
export function genSilryeokMath2DerivRules(tier = 'basic', rng = Math.random) {
  const a = randInt(2, 4, rng);

  let question, explanation, correctVal;
  if (tier === 'basic') {
    question = `함수 $f(x) = \\frac{1}{x + ${a}}$에 대하여 도함수 $f'(1)$의 값은?`;
    // f'(x) = -1 / (x+a)^2 => f'(1) = -1 / (1+a)^2
    const den = (1 + a) * (1 + a);
    return {
      chapter: 7, chapterName: '변화율과 도함수', subjectId: 'calculus', unitId: 'advanced-differentiation', subUnitId: 'derivative-rules',
      tier, question,
      explanation: `몫의 미분법에 의하여 $f'(x) = -\\frac{1}{(x + ${a})^2}$이다.\n따라서 $f'(1) = -\\frac{1}{(1 + ${a})^2} = -\\frac{1}{${den}}$이다.`,
      choices: [`$-\\frac{1}{${den}}$`, `$\\frac{1}{${den}}$`, `$-\\frac{1}{${1 + a}}$`, `$\\frac{1}{${1 + a}}$`, `$-${den}$`],
      correctAnswer: 0, answer: '0', points: 2,
    };
  } else if (tier === 'applied') {
    // product rule with e^x: f(x) = (x^2 + 1) e^x => f'(x) = (x^2 + 2x + 1) e^x => f'(1) = 4e
    question = `함수 $f(x) = (x^2 + ${a})e^x$에 대하여 $f'(0)$의 값을 구하시오.`;
    // f'(x) = 2x e^x + (x^2 + a)e^x = (x^2 + 2x + a)e^x => f'(0) = a
    correctVal = a;
    explanation = `곱의 미분법에 의하여 $f'(x) = 2x e^x + (x^2 + ${a})e^x = (x^2 + 2x + ${a})e^x$\n따라서 $f'(0) = ${a} \\times e^0 = ${a}$이다.`;
  } else {
    // advanced: parametric differentiation
    // x = t^2 + 1, y = t^3 - t => dy/dx = (3t^2 - 1) / (2t) at t = 1 => 2/2 = 1
    question = `매개변수 $t$로 나타내어진 곡선 $x = t^2 + 1, y = t^3 - t$에서 $t = 1$일 때의 미분계수 $\\frac{dy}{dx}$의 값은?`;
    correctVal = 1;
    explanation = `$\\frac{dx}{dt} = 2t, \\quad \\frac{dy}{dt} = 3t^2 - 1$\n$\\frac{dy}{dx} = \\frac{dy/dt}{dx/dt} = \\frac{3t^2 - 1}{2t}$\n$t = 1$을 대입하면 $\\frac{3(1)^2 - 1}{2(1)} = \\frac{2}{2} = 1$이다.`;
  }

  const { choices, correctAnswer, answer } = buildChoices(correctVal, [-2, -1, 1, 2], true, rng);
  return {
    chapter: 7, chapterName: '변화율과 도함수', subjectId: 'calculus', unitId: 'advanced-differentiation', subUnitId: 'derivative-rules',
    tier, question, explanation, choices, correctAnswer, answer, points: tier === 'applied' ? 3 : 4,
  };
}

// -----------------------------------------------------------------------------
// 08. 여러 가지 함수의 도함수
// -----------------------------------------------------------------------------
export function genSilryeokMath2TranscendentalDerivs(tier = 'basic', rng = Math.random) {
  let question, explanation, correctVal;

  if (tier === 'basic') {
    question = `함수 $f(x) = \\ln(x^2 + 1)$에 대하여 $f'(1)$의 값을 구하시오.`;
    correctVal = 1; // 2x/(x^2+1) at x=1 => 2/2 = 1
    explanation = `합성함수 미분법에 의하여 $f'(x) = \\frac{(x^2 + 1)'}{x^2 + 1} = \\frac{2x}{x^2 + 1}$\n따라서 $f'(1) = \\frac{2(1)}{1 + 1} = 1$이다.`;
  } else if (tier === 'applied') {
    // implicit differentiation: x^2 + y^2 = 25 at (3, 4) => dy/dx = -x/y = -3/4
    question = `원 $x^2 + y^2 = 25$ 위의 점 $(3, 4)$에서의 접선의 기울기 $\\frac{dy}{dx}$의 값은?`;
    return {
      chapter: 8, chapterName: '여러 가지 함수의 도함수', subjectId: 'calculus', unitId: 'advanced-differentiation', subUnitId: 'transcendental-derivatives',
      tier, question,
      explanation: `양변을 $x$에 대하여 음함수 미분하면 $2x + 2y \\frac{dy}{dx} = 0 \\implies \\frac{dy}{dx} = -\\frac{x}{y}$\n점 $(3, 4)$를 대입하면 $\\frac{dy}{dx} = -\\frac{3}{4}$이다.`,
      choices: ['$-\\frac{3}{4}$', '$\\frac{3}{4}$', '$-\\frac{4}{3}$', '$\\frac{4}{3}$', '$-\\frac{3}{5}$'],
      correctAnswer: 0, answer: '0', points: 3,
    };
  } else {
    // advanced: inverse function derivative (f^-1)'(b) = 1 / f'(a)
    // f(x) = x^3 + x + 1, f(1) = 3 => f'(x) = 3x^2 + 1 => f'(1) = 4 => (g)'(3) = 1/4
    question = `미분가능한 함수 $f(x) = x^3 + x + 1$의 역함수를 $g(x)$라 할 때, 미분계수 $g'(3)$의 값은?`;
    return {
      chapter: 8, chapterName: '여러 가지 함수의 도함수', subjectId: 'calculus', unitId: 'advanced-differentiation', subUnitId: 'transcendental-derivatives',
      tier, question,
      explanation: `$f(1) = 1^3 + 1 + 1 = 3$이므로 $g(3) = 1$이다.\n$f'(x) = 3x^2 + 1 \\implies f'(1) = 3(1)^2 + 1 = 4$\n역함수의 미분법 공식에 의하여 $g'(3) = \\frac{1}{f'(1)} = \\frac{1}{4}$이다.`,
      choices: ['$\\frac{1}{4}$', '$\\frac{1}{3}$', '$4$', '$\\frac{1}{5}$', '$\\frac{3}{4}$'],
      correctAnswer: 0, answer: '0', points: 4,
    };
  }

  const { choices, correctAnswer, answer } = buildChoices(correctVal, [-2, -1, 1, 2], true, rng);
  return {
    chapter: 8, chapterName: '여러 가지 함수의 도함수', subjectId: 'calculus', unitId: 'advanced-differentiation', subUnitId: 'transcendental-derivatives',
    tier, question, explanation, choices, correctAnswer, answer, points: 2,
  };
}

// -----------------------------------------------------------------------------
// 09. 곡선의 접선과 미분
// -----------------------------------------------------------------------------
export function genSilryeokMath2TangentLines(tier = 'basic', rng = Math.random) {
  let question, explanation, correctVal;

  if (tier === 'basic') {
    // tangent to y = e^x at (0, 1): y - 1 = 1(x - 0) => y = x + 1 => y-intercept = 1
    question = `곡선 $y = e^x$ 위의 점 $(0, 1)$에서의 접선의 $y$절편의 값을 구하시오.`;
    correctVal = 1;
    explanation = `$y' = e^x$이므로 $x = 0$에서 접선의 기울기는 $e^0 = 1$이다.\n접선의 방정식은 $y - 1 = 1(x - 0) \\implies y = x + 1$이므로 $y$절편은 $1$이다.`;
  } else if (tier === 'applied') {
    // tangent to y = ln x passing through origin (0, 0): point (e, 1), line y = (1/e)x
    question = `원점 $(0, 0)$에서 곡선 $y = \\ln x$에 그은 접선의 방정식의 기울기는?`;
    return {
      chapter: 9, chapterName: '곡선의 접선과 미분', subjectId: 'calculus', unitId: 'advanced-differentiation', subUnitId: 'tangent-lines',
      tier, question,
      explanation: `접점을 $(t, \\ln t)$라 하면 기울기는 $\\frac{1}{t}$이다.\n접선 $y - \\ln t = \\frac{1}{t}(x - t)$가 원점 $(0, 0)$을 지나므로 $-\\ln t = -1 \\implies t = e$\n따라서 접선의 기울기는 $\\frac{1}{e}$이다.`,
      choices: ['$\\frac{1}{e}$', '$e$', '$\\frac{1}{e^2}$', '$1$', '$2e$'],
      correctAnswer: 0, answer: '0', points: 3,
    };
  } else {
    // advanced: common tangent condition
    question = `두 곡선 $y = e^x$와 $y = ax^2$이 한 점에서 접할 때, 양수 $a$의 값은?`;
    // e^t = a t^2 and e^t = 2at => at^2 = 2at => t = 2 => e^2 = 4a => a = e^2 / 4
    return {
      chapter: 9, chapterName: '곡선의 접선과 미분', subjectId: 'calculus', unitId: 'advanced-differentiation', subUnitId: 'tangent-lines',
      tier, question,
      explanation: `접점의 $x$좌표를 $t$라 하면\n$e^t = at^2$ (함숫값 일치)\n$e^t = 2at$ (미분계수 일치)\n$at^2 = 2at \\implies t = 2$ ($a > 0$)\n$t = 2$를 대입하면 $e^2 = 4a \\implies a = \\frac{e^2}{4}$이다.`,
      choices: ['$\\frac{e^2}{4}$', '$\\frac{e}{2}$', '$\\frac{e^2}{2}$', '$e^2$', '$\\frac{e}{4}$'],
      correctAnswer: 0, answer: '0', points: 4,
    };
  }

  const { choices, correctAnswer, answer } = buildChoices(correctVal, [-2, -1, 1, 2], true, rng);
  return {
    chapter: 9, chapterName: '곡선의 접선과 미분', subjectId: 'calculus', unitId: 'advanced-differentiation', subUnitId: 'tangent-lines',
    tier, question, explanation, choices, correctAnswer, answer, points: 2,
  };
}

// -----------------------------------------------------------------------------
// 10. 평균값의 정리
// -----------------------------------------------------------------------------
export function genSilryeokMath2MeanValueTheorem(tier = 'basic', rng = Math.random) {
  let question, explanation, correctVal;

  if (tier === 'basic') {
    // Rolle's theorem: f(x) = x^2 - 4x on [0, 4] => f'(c) = 2c - 4 = 0 => c = 2
    question = `함수 $f(x) = x^2 - 4x$에 대하여 닫힌구간 $[0, 4]$에서 롤의 정리를 만족하는 상수 $c$의 값은?`;
    correctVal = 2;
    explanation = `$f(0) = f(4) = 0$이므로 롤의 정리에 의해 $f'(c) = 0$인 $c$가 열린구간 $(0, 4)$에 존재한다.\n$f'(x) = 2x - 4 = 0 \\implies c = 2$이다.`;
  } else if (tier === 'applied') {
    // MVT: f(x) = x^3 on [0, 2] => (8 - 0)/2 = 4 => f'(c) = 3c^2 = 4 => c = 2/sqrt(3)
    question = `함수 $f(x) = x^2 + 2x$에 대하여 닫힌구간 $[1, 3]$에서 평균값의 정리를 만족하는 상수 $c$의 값은?`;
    // (f(3) - f(1))/(3 - 1) = (15 - 3)/2 = 6 => f'(c) = 2c + 2 = 6 => 2c = 4 => c = 2
    correctVal = 2;
    explanation = `$\\frac{f(3) - f(1)}{3 - 1} = \\frac{15 - 3}{2} = 6$\n$f'(c) = 2c + 2 = 6 \\implies 2c = 4 \\implies c = 2$이다.`;
  } else {
    // advanced: limit evaluation with MVT
    question = `모든 실수에서 미분가능한 함수 $f(x)$가 $\\lim_{x \\to \\infty} f'(x) = 3$을 만족할 때, $\\lim_{x \\to \\infty} [f(x + 2) - f(x)]$의 값은?`;
    correctVal = 6;
    explanation = `평균값 정리에 의하여 $\\frac{f(x + 2) - f(x)}{(x + 2) - x} = f'(c)$ ($x < c < x + 2$)\n$f(x + 2) - f(x) = 2 f'(c)$\n$x \\to \\infty$일 때 $c \\to \\infty$이므로 극한값은 $2 \\times 3 = 6$이다.`;
  }

  const { choices, correctAnswer, answer } = buildChoices(correctVal, [-2, -1, 1, 2], true, rng);
  return {
    chapter: 10, chapterName: '평균값의 정리', subjectId: 'calculus', unitId: 'advanced-differentiation', subUnitId: 'mean-value-theorem',
    tier, question, explanation, choices, correctAnswer, answer, points: tier === 'basic' ? 2 : tier === 'applied' ? 3 : 4,
  };
}

// -----------------------------------------------------------------------------
// 11. 극대ㆍ극소와 미분
// -----------------------------------------------------------------------------
export function genSilryeokMath2ExtremaInflection(tier = 'basic', rng = Math.random) {
  let question, explanation, correctVal;

  if (tier === 'basic') {
    // f(x) = x^3 - 3x + 2 => f'(x) = 3(x^2 - 1) = 0 => x = -1 (local max = 4), x = 1 (local min = 0)
    question = `함수 $f(x) = x^3 - 3x + 2$의 극댓값과 극솟값의 합을 구하시오.`;
    correctVal = 4;
    explanation = `$f'(x) = 3x^2 - 3 = 3(x - 1)(x + 1) = 0 \\implies x = \\pm 1$\n극댓값 $f(-1) = -1 + 3 + 2 = 4$\n극솟값 $f(1) = 1 - 3 + 2 = 0$\n따라서 합은 $4 + 0 = 4$이다.`;
  } else if (tier === 'applied') {
    // inflection point of f(x) = x e^{-x}
    // f'(x) = (1 - x)e^-x, f''(x) = (x - 2)e^-x = 0 => x = 2
    question = `곡선 $f(x) = x e^{-x}$의 변곡점의 $x$좌표의 값은?`;
    correctVal = 2;
    explanation = `$f'(x) = (1 - x)e^{-x}$\n$f''(x) = -e^{-x} - (1 - x)e^{-x} = (x - 2)e^{-x}$\n$f''(x) = 0$이고 그 좌우에서 부호가 변하는 $x$는 $x = 2$이다.`;
  } else {
    // advanced: extrema count with parameter k
    question = `함수 $f(x) = x^3 - 3kx^2 + 9x$가 극값을 갖지 않도록 하는 정수 $k$의 개수는?`;
    // f'(x) = 3(x^2 - 2kx + 3) => D/4 = k^2 - 3 <= 0 => -sqrt(3) <= k <= sqrt(3) => k = -1, 0, 1 => 3
    correctVal = 3;
    explanation = `$f'(x) = 3(x^2 - 2kx + 3)$\n삼차함수가 극값을 갖지 않으려면 판별식 $D/4 \\le 0$이어야 한다.\n$D/4 = k^2 - 3 \\le 0 \\implies -\\sqrt{3} \\le k \\le \\sqrt{3}$\n정수 $k$는 $-1, 0, 1$의 $3$개이다.`;
  }

  const { choices, correctAnswer, answer } = buildChoices(correctVal, [-2, -1, 1, 2], true, rng);
  return {
    chapter: 11, chapterName: '극대ㆍ극소와 미분', subjectId: 'calculus', unitId: 'advanced-differentiation', subUnitId: 'extrema-inflection',
    tier, question, explanation, choices, correctAnswer, answer, points: tier === 'basic' ? 2 : tier === 'applied' ? 3 : 4,
  };
}

// -----------------------------------------------------------------------------
// 12. 최대ㆍ최소와 미분
// -----------------------------------------------------------------------------
export function genSilryeokMath2Optimization(tier = 'basic', rng = Math.random) {
  let question, explanation, correctVal;

  if (tier === 'basic') {
    // f(x) = -x^2 + 4x + 1 on [0, 3] => max at x = 2 is 5
    question = `닫힌구간 $[0, 3]$에서 함수 $f(x) = -x^2 + 4x + 1$의 최댓값을 구하시오.`;
    correctVal = 5;
    explanation = `$f(x) = -(x - 2)^2 + 5$\n$x = 2$가 구간 $[0, 3]$에 포함되므로 최댓값은 $f(2) = 5$이다.`;
  } else if (tier === 'applied') {
    // max of f(x) = x ln x on [1/e, e] (or x / (x^2 + 1))
    // f(x) = x / (x^2 + 1) => max at x = 1 is 1/2
    question = `함수 $f(x) = \\frac{2x}{x^2 + 1}$ ($x > 0$)의 최댓값을 구하시오.`;
    correctVal = 1;
    explanation = `산술-기하 평균 부등식 또는 미분을 이용하면 $x^2 + 1 \\ge 2x$이므로 $\\frac{2x}{x^2 + 1} \\le 1$이다. (등호는 $x = 1$일 때 성립)\n따라서 최댓값은 $1$이다.`;
  } else {
    // advanced: geometric optimization (rectangle under parabola y = 9 - x^2)
    // Area A(x) = 2x(9 - x^2) = 18x - 2x^3 => A'(x) = 18 - 6x^2 = 0 => x^2 = 3 => x = sqrt(3)
    // Max Area = 2sqrt(3)(6) = 12sqrt(3)
    question = `곡선 $y = 12 - x^2$과 $x$축으로 둘러싸인 도형에 내접하고 한 변이 $x$축 위에 있는 직사각형의 최대 넓이는?`;
    // A(x) = 2x(12 - x^2) = 24x - 2x^3 => A'(x) = 24 - 6x^2 = 0 => x = 2
    // A(2) = 2(2)(8) = 32
    correctVal = 32;
    explanation = `직사각형의 제1사분면 꼭짓점을 $(x, 12 - x^2)$이라 하면 ($0 < x < \\sqrt{12}$)\n넓이 $S(x) = 2x(12 - x^2) = 24x - 2x^3$\n$S'(x) = 24 - 6x^2 = 0 \\implies x = 2$\n따라서 최대 넓이는 $S(2) = 4(12 - 4) = 32$이다.`;
  }

  const { choices, correctAnswer, answer } = buildChoices(correctVal, [-6, -3, 3, 6], true, rng);
  return {
    chapter: 12, chapterName: '최대ㆍ최소와 미분', subjectId: 'calculus', unitId: 'advanced-differentiation', subUnitId: 'optimization-applications',
    tier, question, explanation, choices, correctAnswer, answer, points: tier === 'basic' ? 2 : tier === 'applied' ? 3 : 4,
  };
}

// -----------------------------------------------------------------------------
// 13. 방정식ㆍ부등식과 미분
// -----------------------------------------------------------------------------
export function genSilryeokMath2EquationsDiff(tier = 'basic', rng = Math.random) {
  let question, explanation, correctVal;

  if (tier === 'basic') {
    // number of real roots of x^3 - 3x + 5 = 0
    // local max f(-1) = 7, local min f(1) = 3 => f(-1)*f(1) = 21 > 0 => 1 real root
    question = `삼차방정식 $x^3 - 3x + 5 = 0$의 서로 다른 실근의 개수를 구하시오.`;
    correctVal = 1;
    explanation = `$f(x) = x^3 - 3x + 5$의 극값: $f'(x) = 3(x^2 - 1) = 0 \\implies x = \\pm 1$\n$f(-1) = 7 > 0, f(1) = 3 > 0$\n극댓값과 극솟값의 곱이 양수이므로 서로 다른 실근의 개수는 $1$개이다.`;
  } else if (tier === 'applied') {
    // x^3 - 3x = k has 3 distinct real roots => k in (-2, 2)
    question = `방정식 $x^3 - 3x = k$가 서로 다른 세 실근을 갖도록 하는 정수 $k$의 개수는?`;
    correctVal = 3; // -1, 0, 1
    explanation = `$f(x) = x^3 - 3x$의 극댓값은 $f(-1) = 2$, 극솟값은 $f(1) = -2$이다.\n서로 다른 세 실근을 가지려면 $-2 < k < 2$이어야 한다.\n만족하는 정수 $k$는 $-1, 0, 1$의 $3$개이다.`;
  } else {
    // advanced: transcendental inequality e^x >= ax + 1 for all x
    // tangent at x = 0 is y = x + 1, so a = 1
    question = `모든 실수 $x$에 대하여 부등식 $e^x \\ge ax + 1$이 항상 성립하도록 하는 상수 $a$의 값은?`;
    correctVal = 1;
    explanation = `곡선 $y = e^x$ 위의 점 $(0, 1)$에서의 접선의 방정식은 $y = x + 1$이다.\n$y = e^x$는 아래로 볼록하므로 접선 $y = x + 1$보다 항상 위쪽에 위치한다.\n따라서 모든 실수에 대해 부등식이 성립하려면 $a = 1$이어야 한다.`;
  }

  const { choices, correctAnswer, answer } = buildChoices(correctVal, [-2, -1, 1, 2], true, rng);
  return {
    chapter: 13, chapterName: '방정식ㆍ부등식과 미분', subjectId: 'calculus', unitId: 'advanced-differentiation', subUnitId: 'curve-sketching-equations',
    tier, question, explanation, choices, correctAnswer, answer, points: tier === 'basic' ? 2 : tier === 'applied' ? 3 : 4,
  };
}

// -----------------------------------------------------------------------------
// 14. 속도ㆍ가속도와 미분
// -----------------------------------------------------------------------------
export function genSilryeokMath2VelocityAccel(tier = 'basic', rng = Math.random) {
  let question, explanation, correctVal;

  if (tier === 'basic') {
    // x(t) = t^3 - 3t^2 + 2t => v(t) = 3t^2 - 6t + 2 at t = 2 => 12 - 12 + 2 = 2
    question = `수직선 위를 움직이는 점 $P$의 시각 $t$에서의 위치가 $x(t) = t^3 - 3t^2 + 2t$일 때, $t = 2$에서의 속도를 구하시오.`;
    correctVal = 2;
    explanation = `속도 $v(t) = x'(t) = 3t^2 - 6t + 2$\n$t = 2$를 대입하면 $v(2) = 3(4) - 6(2) + 2 = 2$이다.`;
  } else if (tier === 'applied') {
    // direction change: v(t) = 0 => x(t) = -t^2 + 6t => v(t) = -2t + 6 = 0 => t = 3 => x(3) = 9
    question = `수직선 위를 움직이는 점 $P$의 시각 $t$에서의 위치가 $x(t) = -t^2 + 6t$이다. 점 $P$가 운동 방향을 바꿀 때의 위치 $x$의 값은?`;
    correctVal = 9;
    explanation = `속도 $v(t) = x'(t) = -2t + 6 = 0 \\implies t = 3$\n운동 방향을 바꾸는 시각 $t = 3$에서의 위치는 $x(3) = -(3)^2 + 6(3) = 9$이다.`;
  } else {
    // advanced: 2D speed sqrt((x')^2 + (y')^2)
    // x(t) = 2 cos t, y(t) = 2 sin t => speed = 2
    question = `좌표평면 위를 움직이는 점 $P$의 시각 $t$에서의 위치가 $(x, y) = (3\\cos t, 3\\sin t)$일 때, 점 $P$의 속력의 값은?`;
    correctVal = 3;
    explanation = `$\\frac{dx}{dt} = -3\\sin t, \\quad \\frac{dy}{dt} = 3\\cos t$\n속력은 $\\sqrt{\\left(\\frac{dx}{dt}\\right)^2 + \\left(\\frac{dy}{dt}\\right)^2} = \\sqrt{9\\sin^2 t + 9\\cos^2 t} = \\sqrt{9} = 3$이다.`;
  }

  const { choices, correctAnswer, answer } = buildChoices(correctVal, [-3, -1, 1, 2], true, rng);
  return {
    chapter: 14, chapterName: '속도ㆍ가속도와 미분', subjectId: 'calculus', unitId: 'advanced-differentiation', subUnitId: 'velocity-acceleration',
    tier, question, explanation, choices, correctAnswer, answer, points: tier === 'basic' ? 2 : tier === 'applied' ? 3 : 4,
  };
}

// -----------------------------------------------------------------------------
// Chapter Generator Dispatch Table
// -----------------------------------------------------------------------------
export const SILRYEOK_MATH2_GENERATORS = {
  1: genSilryeokMath2Equations,
  2: genSilryeokMath2Inequalities,
  3: genSilryeokMath2TrigAddition,
  4: genSilryeokMath2TrigFormulas,
  5: genSilryeokMath2FuncLimits,
  6: genSilryeokMath2FuncContinuity,
  7: genSilryeokMath2DerivRules,
  8: genSilryeokMath2TranscendentalDerivs,
  9: genSilryeokMath2TangentLines,
  10: genSilryeokMath2MeanValueTheorem,
  11: genSilryeokMath2ExtremaInflection,
  12: genSilryeokMath2Optimization,
  13: genSilryeokMath2EquationsDiff,
  14: genSilryeokMath2VelocityAccel,
};

export const SILRYEOK_MATH2_GENERATORS_BY_UNIT = {
  'equations-inequalities': [genSilryeokMath2Equations, genSilryeokMath2Inequalities],
  'advanced-differentiation': [
    genSilryeokMath2TrigAddition,
    genSilryeokMath2TrigFormulas,
    genSilryeokMath2FuncLimits,
    genSilryeokMath2DerivRules,
    genSilryeokMath2TranscendentalDerivs,
    genSilryeokMath2TangentLines,
    genSilryeokMath2MeanValueTheorem,
    genSilryeokMath2ExtremaInflection,
    genSilryeokMath2Optimization,
    genSilryeokMath2EquationsDiff,
    genSilryeokMath2VelocityAccel,
  ],
  'limits-continuity': [genSilryeokMath2FuncContinuity],
};

/**
 * Generates an algorithmic Silryeok Jeongseok Math 2 problem.
 */
export function generateSilryeokMath2Problem(unitIdOrChapter, options = {}) {
  const rng = options.rng || Math.random;
  const tier = options.tier || 'applied';

  let fn;
  if (typeof unitIdOrChapter === 'number' && SILRYEOK_MATH2_GENERATORS[unitIdOrChapter]) {
    fn = SILRYEOK_MATH2_GENERATORS[unitIdOrChapter];
  } else if (SILRYEOK_MATH2_GENERATORS_BY_UNIT[unitIdOrChapter]) {
    fn = pickRandom(SILRYEOK_MATH2_GENERATORS_BY_UNIT[unitIdOrChapter], rng);
  } else {
    const all = Object.values(SILRYEOK_MATH2_GENERATORS);
    fn = pickRandom(all, rng);
  }

  const prob = fn(tier, rng);
  const idSuffix = Math.floor(rng() * 90000 + 10000);
  const tierLabel = tier === 'basic' ? '기본문제' : tier === 'advanced' ? '고난도 문제' : '응용문제';

  return {
    id: `gen-silryeok-math2-${prob.chapter}-${tier}-${idSuffix}`,
    number: options.number || 1,
    grade: 'g3',
    category: 'csat',
    sourceLabel: `실력정석 수학2 변형 · ${prob.chapter}단원 ${prob.chapterName} [${tierLabel}]`,
    ...prob,
  };
}

/**
 * Generates a variant problem similar to the provided source problem.
 */
export function generateSilryeokMath2Variant(sourceProblem, options = {}) {
  const ch = sourceProblem?.chapter || 1;
  const tier = sourceProblem?.tier || 'applied';
  return generateSilryeokMath2Problem(ch, {
    ...options,
    tier,
    number: sourceProblem?.number || 1,
  });
}
