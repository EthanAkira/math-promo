/**
 * 수능·평가원 심화 기출 유형 (Silryeok Integral & Stats) 문제 생성 엔진
 * (Algorithmic Problem Generation Engine)
 *
 * 16대 단원별 알고리즘 기반 생성:
 * - 유제: 기본문제 (tier: 'basic', section: '기본문제 (유제)')
 * - 연습문제 표준: 응용문제 (tier: 'applied', section: '응용문제 (연습문제 표준)')
 * - 연습문제 실력편: 고난도 문제 (tier: 'advanced', section: '고난도 문제 (실력 연습문제)')
 *
 * 16대 단원 목록:
 * 01. 부정적분 (indefinite-integrals / calculus)
 * 02. 치환적분과 부분적분 (substitution-by-parts / calculus)
 * 03. 정적분의 계산 (definite-integrals / calculus)
 * 04. 여러 가지 정적분 문제 (integral-functions / calculus)
 * 05. 넓이와 적분 (area-under-curve / calculus)
 * 06. 부피와 적분 (volume-of-solids / calculus)
 * 07. 속도ㆍ거리와 적분 (distance-velocity / calculus)
 * 08. 순열 (permutations / prob-stats)
 * 09. 조합 (combinations / prob-stats)
 * 10. 이항정리 (binomial-theorem / prob-stats)
 * 11. 확률의 정의 (mathematical-probability / prob-stats)
 * 12. 확률의 덧셈정리 (probability-addition / prob-stats)
 * 13. 확률의 곱셈정리 (conditional-probability / prob-stats)
 * 14. 확률분포 (discrete-random-var / prob-stats)
 * 15. 연속확률변수와 정규분포 (normal-dist / prob-stats)
 * 16. 통계적 추정 (confidence-interval / prob-stats)
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
// 01. 부정적분
// -----------------------------------------------------------------------------
export function genSilryeokIndefiniteIntegral(tier = 'basic', rng = Math.random) {
  const k = randInt(2, 5, rng);
  const a = randInt(1, 4, rng);
  if (tier === 'basic') {
    const question = `함수 $f(x)$에 대하여 $f'(x) = ${k}e^{${k}x} + ${2 * a}x$이고 $f(0) = 2$일 때, $f(1)$의 값을 구하여라.`;
    const ansStr = `e^{${k}} + ${a + 1}`;
    const explanation = `부정적분을 구하면\n$$f(x) = \\int (${k}e^{${k}x} + ${2 * a}x) dx = e^{${k}x} + ${a}x^2 + C$$\n$f(0) = 1 + C = 2 \\implies C = 1$입니다.\n따라서 $f(1) = e^{${k}} + ${a} + 1 = e^{${k}} + ${a + 1}$입니다.`;
    const { choices, correctAnswer, answer } = buildChoices(ansStr, [`e^{${k}} + ${a}`, `e^{${k}} + ${a + 2}`, `${k}e^{${k}} + 1`, `e^{${k}} - 1`], false, rng);
    return { chapter: 1, chapterName: '부정적분', unitId: 'advanced-integration', tier, question, choices, correctAnswer, answer, explanation };
  } else {
    // 실력편 고난도
    const question = `함수 $f(x)$가 모든 실수 $x$에 대하여 $f'(x) = \\frac{2x}{x^2 + ${a}}$이고 $f(0) = \\ln ${a}$를 만족할 때, $f(\\sqrt{${2 * a}})$의 값을 구하여라.`;
    const ansStr = `\\ln ${3 * a}`;
    const explanation = `$\\int \\frac{2x}{x^2 + ${a}} dx = \\ln(x^2 + ${a}) + C$입니다.\n$f(0) = \\ln ${a} + C = \\ln ${a} \\implies C = 0$입니다.\n따라서 $f(\\sqrt{${2 * a}}) = \\ln(${2 * a} + ${a}) = \\ln ${3 * a}$입니다.`;
    const { choices, correctAnswer, answer } = buildChoices(ansStr, [`\\ln ${2 * a}`, `\\ln ${4 * a}`, `\\ln ${a + 2}`, `2\\ln ${a}`], false, rng);
    return { chapter: 1, chapterName: '부정적분', unitId: 'advanced-integration', tier, question, choices, correctAnswer, answer, explanation };
  }
}

// -----------------------------------------------------------------------------
// 02. 치환적분과 부분적분
// -----------------------------------------------------------------------------
export function genSilryeokSubstByParts(tier = 'basic', rng = Math.random) {
  const a = randInt(1, 3, rng);
  if (tier === 'basic') {
    // 부분적분 기본: \int_0^1 x e^x dx = 1
    const question = `정적분 $\\int_{0}^{1} x e^{x} dx$의 값을 구하여라.`;
    const ansVal = 1;
    const explanation = `부분적분법을 적용하면\n$$\\int_{0}^{1} x e^x dx = \\left[ x e^x \\right]_{0}^{1} - \\int_{0}^{1} e^x dx = e - (e - 1) = 1$$\n입니다.`;
    const { choices, correctAnswer, answer } = buildChoices(ansVal, [-1, 2, 3, 0], true, rng);
    return { chapter: 2, chapterName: '치환적분과 부분적분', unitId: 'advanced-integration', tier, question, choices, correctAnswer, answer, explanation };
  } else {
    // 치환적분 실력: \int_0^a x (x^2 + 1)^2 dx
    const question = `정적분 $\\int_{0}^{${a}} 2x(x^2 + 1)^2 dx$의 값을 구하여라.`;
    const upper = a * a + 1;
    // \int_1^{a^2+1} u^2 du = [u^3 / 3]_1^{a^2+1} = ((a^2+1)^3 - 1) / 3
    const num = upper * upper * upper - 1;
    const ansStr = simplifyFrac(num, 3);
    const explanation = `$u = x^2 + 1$로 치환하면 $du = 2x dx$이고 적분 구간은 $1$부터 $${upper}$까지입니다.\n$$\\int_{1}^{${upper}} u^2 du = \\left[ \\frac{u^3}{3} \\right]_{1}^{${upper}} = \\frac{${upper}^3 - 1}{3} = ${ansStr}$$입니다.`;
    const { choices, correctAnswer, answer } = buildChoices(ansStr, ['10', '20', '30', '40'], false, rng);
    return { chapter: 2, chapterName: '치환적분과 부분적분', unitId: 'advanced-integration', tier, question, choices, correctAnswer, answer, explanation };
  }
}

// -----------------------------------------------------------------------------
// 03. 정적분의 계산
// -----------------------------------------------------------------------------
export function genSilryeokDefiniteIntegral(tier = 'basic', rng = Math.random) {
  const m = randInt(2, 4, rng);
  const question = `우함수와 기함수의 성질을 이용하여 정적분 $\\int_{-${m}}^{${m}} (3x^2 + 5x^3 + 7x) dx$의 값을 구하여라.`;
  // \int_{-m}^m 3x^2 dx = 2 * [x^3]_0^m = 2 m^3
  const ansVal = 2 * m * m * m;
  const explanation = `기함수인 $5x^3$과 $7x$는 대칭 구간 $[- ${m}, ${m}]$에서 정적분 값이 $0$입니다.\n우함수인 $3x^2$에 대하여\n$$\\int_{-${m}}^{${m}} 3x^2 dx = 2 \\int_{0}^{${m}} 3x^2 dx = 2 \\left[ x^3 \\right]_{0}^{${m}} = 2(${m})^3 = ${ansVal}$$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansVal, [-6, -4, 4, 8], true, rng);
  return { chapter: 3, chapterName: '정적분의 계산', unitId: 'advanced-integration', tier, question, choices, correctAnswer, answer, explanation };
}

// -----------------------------------------------------------------------------
// 04. 여러 가지 정적분 문제
// -----------------------------------------------------------------------------
export function genSilryeokIntegralFunctions(tier = 'basic', rng = Math.random) {
  const a = randInt(1, 4, rng);
  const question = `극한값 $\\lim_{n \\to \\infty} \\frac{1}{n} \\sum_{k=1}^{n} \\left(\\frac{${a}k}{n}\\right)^2$을 구하여라.`;
  // \int_0^1 (a x)^2 dx = a^2 / 3
  const ansStr = simplifyFrac(a * a, 3);
  const explanation = `구분구적법과 정적분의 관계에 의해 $x = \\frac{k}{n}$, $dx = \\frac{1}{n}$로 두면\n$$\\lim_{n \\to \\infty} \\frac{1}{n} \\sum_{k=1}^{n} (${a} \\cdot \\frac{k}{n})^2 = \\int_{0}^{1} (${a}x)^2 dx = ${a * a} \\left[ \\frac{x^3}{3} \\right]_{0}^{1} = ${ansStr}$$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansStr, ['1', '2', simplifyFrac(a, 3), simplifyFrac(a * a, 2)], false, rng);
  return { chapter: 4, chapterName: '여러 가지 정적분 문제', unitId: 'advanced-integration', tier, question, choices, correctAnswer, answer, explanation };
}

// -----------------------------------------------------------------------------
// 05. 넓이와 적분
// -----------------------------------------------------------------------------
export function genSilryeokAreaUnderCurve(tier = 'basic', rng = Math.random) {
  const m = randInt(2, 5, rng);
  // 두 곡선 y = x^2 와 y = m x 로 둘러싸인 도형의 넓이: m^3 / 6
  // m=6 이면 36
  const num = m * m * m;
  const ansStr = simplifyFrac(num, 6);
  const question = `곡선 $y = x^2$과 직선 $y = ${m}x$로 둘러싸인 도형의 넓이를 구하여라.`;
  const explanation = `교점의 $x$좌표는 $x^2 = ${m}x \\implies x = 0, ${m}$입니다.\n따라서 둘러싸인 넓이 $S$는\n$$S = \\int_{0}^{${m}} (${m}x - x^2) dx = \\left[ \\frac{${m}}{2}x^2 - \\frac{x^3}{3} \\right]_{0}^{${m}} = \\frac{${m}^3}{6} = ${ansStr}$$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansStr, ['4', '8', '12', '16'], false, rng);
  return { chapter: 5, chapterName: '넓이와 적분', unitId: 'advanced-integration', tier, question, choices, correctAnswer, answer, explanation };
}

// -----------------------------------------------------------------------------
// 06. 부피와 적분
// -----------------------------------------------------------------------------
export function genSilryeokVolumeOfSolids(tier = 'basic', rng = Math.random) {
  const h = randInt(2, 4, rng);
  // 단면적 S(x) = 3 x^2, V = \int_0^h 3x^2 dx = h^3
  const ansVal = h * h * h;
  const question = `어떤 입체도형을 높이 $x$ ($0 \\le x \\le ${h}$)에서 밑면과 평행하게 자른 단면의 넓이가 $S(x) = 3x^2$일 때, 이 입체도형의 부피를 구하여라.`;
  const explanation = `부피 $V$는 단면적의 정적분이므로\n$$V = \\int_{0}^{${h}} 3x^2 dx = \\left[ x^3 \\right]_{0}^{${h}} = (${h})^3 = ${ansVal}$$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansVal, [-4, -2, 2, 4], true, rng);
  return { chapter: 6, chapterName: '부피와 적분', unitId: 'advanced-integration', tier, question, choices, correctAnswer, answer, explanation };
}

// -----------------------------------------------------------------------------
// 07. 속도·거리와 적분
// -----------------------------------------------------------------------------
export function genSilryeokVelocityDistance(tier = 'basic', rng = Math.random) {
  const t0 = randInt(2, 4, rng);
  // 곡선의 길이 또는 이동 거리
  const question = `수직선 위를 움직이는 점 $P$의 시각 $t$ ($0 \\le t \\le ${t0}$)에서의 속도가 $v(t) = 4t$일 때, $t = 0$부터 $t = ${t0}$까지 점 $P$가 움직인 총 거리를 구하여라.`;
  const ansVal = 2 * t0 * t0;
  const explanation = `구간 $[0, ${t0}]$에서 $v(t) \\ge 0$이므로 움직인 거리는\n$$s = \\int_{0}^{${t0}} 4t dt = \\left[ 2t^2 \\right]_{0}^{${t0}} = 2(${t0})^2 = ${ansVal}$$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansVal, [-3, -1, 2, 4], true, rng);
  return { chapter: 7, chapterName: '속도ㆍ거리와 적분', unitId: 'advanced-integration', tier, question, choices, correctAnswer, answer, explanation };
}

// -----------------------------------------------------------------------------
// 08. 순열
// -----------------------------------------------------------------------------
export function genSilryeokPermutations(tier = 'basic', rng = Math.random) {
  const n = randInt(4, 6, rng);
  if (tier === 'basic') {
    // 원순열 (n-1)!
    const fact = [1, 1, 2, 6, 24, 120, 720];
    const ansVal = fact[n - 1];
    const question = `서로 다른 $${n}$명의 학생이 원형 탁자에 둘러앉는 경우의 수를 구하여라.`;
    const explanation = `원순열의 공식에 의해 서로 다른 $${n}$명이 원형으로 배열하는 경우의 수는\n$$(${n} - 1)! = ${n - 1}! = ${ansVal}$$가지입니다.`;
    const { choices, correctAnswer, answer } = buildChoices(ansVal, [-10, -5, 10, 20], true, rng);
    return { chapter: 8, chapterName: '순열', unitId: 'counting', tier, question, choices, correctAnswer, answer, explanation };
  } else {
    // 같은 것이 있는 순열 (길찾기)
    const a = 3;
    const b = randInt(2, 4, rng);
    const fact = [1, 1, 2, 6, 24, 120, 720, 5040];
    const ansVal = fact[a + b] / (fact[a] * fact[b]);
    const question = `가로로 $${a}$칸, 세로로 $${b}$칸인 바둑판 모양의 도로망에서 최단 거리로 이동하는 경로의 수를 구하여라.`;
    const explanation = `가로 방향 이동 $${a}$개와 세로 방향 이동 $${b}$개를 일렬로 나열하는 같은 것이 있는 순열이므로\n$$\\frac{(${a}+${b})!}{${a}! \\times ${b}!} = \\frac{${fact[a+b]}}{${fact[a]} \\times ${fact[b]}} = ${ansVal}$$가지입니다.`;
    const { choices, correctAnswer, answer } = buildChoices(ansVal, [-4, -2, 2, 4], true, rng);
    return { chapter: 8, chapterName: '순열', unitId: 'counting', tier, question, choices, correctAnswer, answer, explanation };
  }
}

// -----------------------------------------------------------------------------
// 09. 조합
// -----------------------------------------------------------------------------
export function genSilryeokCombinations(tier = 'basic', rng = Math.random) {
  if (tier === 'basic') {
    const n = randInt(5, 7, rng);
    const r = randInt(2, 3, rng);
    const fact = [1, 1, 2, 6, 24, 120, 720, 5040];
    const ansVal = fact[n] / (fact[r] * fact[n - r]);
    const question = `서로 다른 $${n}$개의 구슬 중에서 $${r}$개를 택하는 조합의 수 $_{${n}}\\mathrm{C}_{${r}}$을 구하여라.`;
    const explanation = `$$_{${n}}\\mathrm{C}_{${r}} = \\frac{${n}!}{${r}!(${n}-${r})!} = ${ansVal}$$입니다.`;
    const { choices, correctAnswer, answer } = buildChoices(ansVal, [-3, -1, 2, 4], true, rng);
    return { chapter: 9, chapterName: '조합', unitId: 'counting', tier, question, choices, correctAnswer, answer, explanation };
  } else {
    // 중복조합 x + y + z = k (음이 아닌 정수해)
    const k = randInt(4, 7, rng);
    // 3Hk = (3 + k - 1) C k = (k + 2) C 2 = (k + 2)(k + 1) / 2
    const ansVal = ((k + 2) * (k + 1)) / 2;
    const question = `방정식 $x + y + z = ${k}$을 만족하는 음이 아닌 정수해 $(x, y, z)$의 순서쌍의 개수를 구하여라.`;
    const explanation = `서로 다른 $3$개의 변수에서 중복을 허락하여 $${k}$개를 택하는 중복조합이므로\n$$_{3}\\mathrm{H}_{${k}} = _{3+${k}-1}\\mathrm{C}_{${k}} = _{${k+2}}\\mathrm{C}_{2} = \\frac{${k+2} \\times ${k+1}}{2} = ${ansVal}$$개입니다.`;
    const { choices, correctAnswer, answer } = buildChoices(ansVal, [-4, -2, 2, 4], true, rng);
    return { chapter: 9, chapterName: '조합', unitId: 'counting', tier, question, choices, correctAnswer, answer, explanation };
  }
}

// -----------------------------------------------------------------------------
// 10. 이항정리
// -----------------------------------------------------------------------------
export function genSilryeokBinomialTheorem(tier = 'basic', rng = Math.random) {
  const n = randInt(4, 6, rng);
  const a = randInt(2, 3, rng);
  // (x + a)^n 에서 x^{n-1} 항의 계수: n C 1 * a^1 = n * a
  const ansVal = n * a;
  const question = `다항식 $(x + ${a})^{${n}}$의 전개식에서 $x^{${n - 1}}$의 계수를 구하여라.`;
  const explanation = `이항정리에 의한 일반항은 $_{${n}}\\mathrm{C}_{r} x^{${n}-r} (${a})^r$입니다.\n$x^{${n-1}}$의 계수는 $r = 1$일 때이므로\n$$_{${n}}\\mathrm{C}_{1} \\times (${a})^1 = ${n} \\times ${a} = ${ansVal}$$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansVal, [-3, -1, 2, 4], true, rng);
  return { chapter: 10, chapterName: '이항정리', unitId: 'counting', tier, question, choices, correctAnswer, answer, explanation };
}

// -----------------------------------------------------------------------------
// 11. 확률의 정의
// -----------------------------------------------------------------------------
export function genSilryeokProbabilityDefinition(tier = 'basic', rng = Math.random) {
  const k = randInt(2, 5, rng);
  // 주사위를 던져 k 이상의 눈이 나올 확률: (7 - k) / 6
  const num = 7 - k;
  const ansStr = simplifyFrac(num, 6);
  const question = `한 개의 주사위를 던질 때, $${k}$ 이상의 눈이 나올 확률을 구하여라.`;
  const explanation = `주사위를 던져 나올 수 있는 모든 경우의 수는 $6$가지입니다.\n$${k}$ 이상의 눈은 $${Array.from({ length: num }, (_, i) => k + i).join(', ')}$의 총 $${num}$가지이므로\n구하는 확률은 $\\frac{${num}}{6} = ${ansStr}$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansStr, ['\\frac{1}{6}', '\\frac{1}{2}', '\\frac{2}{3}', '\\frac{5}{6}'], false, rng);
  return { chapter: 11, chapterName: '확률의 정의', unitId: 'probability', tier, question, choices, correctAnswer, answer, explanation };
}

// -----------------------------------------------------------------------------
// 12. 확률의 덧셈정리
// -----------------------------------------------------------------------------
export function genSilryeokProbabilityAddition(tier = 'basic', rng = Math.random) {
  // 여사건의 확률: 흰 공 3개, 검은 공 4개 중 2개 꺼낼 때 적어도 하나는 흰 공일 확률
  // 전체 7C2 = 21, 검은공만 4C2 = 6 -> 여사건 1 - 6/21 = 15/21 = 5/7
  const question = `흰 공 $3$개와 검은 공 $4$개가 들어 있는 주머니에서 임의로 $2$개의 공을 동시에 꺼낼 때, 적어도 한 개는 흰 공일 확률을 구하여라.`;
  const ansStr = `\\frac{5}{7}`;
  const explanation = `모든 경우의 수는 $_{7}\\mathrm{C}_{2} = 21$가지입니다.\n적어도 한 개가 흰 공일 사건의 여사건은 '두 개 모두 검은 공'인 사건이며, 경우의 수는 $_{4}\\mathrm{C}_{2} = 6$가지입니다.\n따라서 여사건의 확률을 이용하면\n$$P = 1 - \\frac{6}{21} = 1 - \\frac{2}{7} = \\frac{5}{7}$$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansStr, ['\\frac{2}{7}', '\\frac{3}{7}', '\\frac{4}{7}', '\\frac{6}{7}'], false, rng);
  return { chapter: 12, chapterName: '확률의 덧셈정리', unitId: 'probability', tier, question, choices, correctAnswer, answer, explanation };
}

// -----------------------------------------------------------------------------
// 13. 확률의 곱셈정리
// -----------------------------------------------------------------------------
export function genSilryeokProbabilityMultiplication(tier = 'basic', rng = Math.random) {
  // 독립시행의 확률: 주사위 4번 던져 1의 눈이 2번 나올 확률: 4C2 (1/6)^2 (5/6)^2
  const question = `한 개의 주사위를 $4$회 던질 때, $1$의 눈이 정확히 $2$회 나올 확률을 구하여라.`;
  // 4C2 * 1/36 * 25/36 = 6 * 25 / 1296 = 150 / 1296 = 25 / 216
  const ansStr = `\\frac{25}{216}`;
  const explanation = `주사위를 $1$회 던져 $1$의 눈이 나올 확률은 $\\frac{1}{6}$입니다.\n독립시행의 확률 공식에 의해\n$$_{4}\\mathrm{C}_{2} \\left(\\frac{1}{6}\\right)^2 \\left(\\frac{5}{6}\\right)^2 = 6 \\times \\frac{1}{36} \\times \\frac{25}{36} = \\frac{25}{216}$$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansStr, ['\\frac{1}{36}', '\\frac{5}{108}', '\\frac{25}{108}', '\\frac{5}{36}'], false, rng);
  return { chapter: 13, chapterName: '확률의 곱셈정리', unitId: 'probability', tier, question, choices, correctAnswer, answer, explanation };
}

// -----------------------------------------------------------------------------
// 14. 확률분포
// -----------------------------------------------------------------------------
export function genSilryeokProbabilityDistribution(tier = 'basic', rng = Math.random) {
  const n = randInt(10, 30, rng) * 2;
  // B(n, 1/2) -> E(X) = n/2, V(X) = n/4
  const eVal = n / 2;
  const question = `확률변수 $X$가 이항분포 $\\mathrm{B}\\left(${n}, \\frac{1}{2}\\right)$을 따를 때, $X$의 기댓값 $E(X)$를 구하여라.`;
  const explanation = `이항분포 $\\mathrm{B}(n, p)$에서 기댓값은 $E(X) = np$입니다.\n따라서 $E(X) = ${n} \\times \\frac{1}{2} = ${eVal}$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(eVal, [-4, -2, 2, 4], true, rng);
  return { chapter: 14, chapterName: '확률분포', unitId: 'statistics', tier, question, choices, correctAnswer, answer, explanation };
}

// -----------------------------------------------------------------------------
// 15. 연속확률변수와 정규분포
// -----------------------------------------------------------------------------
export function genSilryeokNormalDistribution(tier = 'basic', rng = Math.random) {
  const m = randInt(50, 70, rng);
  const s = randInt(5, 10, rng);
  // P(X <= m + s) = P(Z <= 1) = 0.5 + 0.3413 = 0.8413
  const target = m + s;
  const question = `확률변수 $X$가 정규분포 $\\mathrm{N}(${m}, ${s}^2)$을 따를 때, 표준정규분포표($P(0 \\le Z \\le 1) = 0.3413$)를 이용하여 $P(X \\le ${target})$을 구하여라.`;
  const ansStr = `0.8413`;
  const explanation = `$X = ${target}$을 표준화하면\n$$Z = \\frac{${target} - ${m}}{${s}} = 1$$\n따라서 $P(X \\le ${target}) = P(Z \\le 1) = 0.5 + P(0 \\le Z \\le 1) = 0.5 + 0.3413 = 0.8413$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansStr, ['0.5000', '0.6826', '0.3413', '0.9772'], false, rng);
  return { chapter: 15, chapterName: '연속확률변수와 정규분포', unitId: 'statistics', tier, question, choices, correctAnswer, answer, explanation };
}

// -----------------------------------------------------------------------------
// 16. 통계적 추정
// -----------------------------------------------------------------------------
export function genSilryeokStatisticalEstimation(tier = 'basic', rng = Math.random) {
  const n = 100;
  const s = 10;
  // 신뢰구간의 길이 L = 2 * 1.96 * (s / sqrt(n)) = 2 * 1.96 * (10 / 10) = 3.92
  const question = `모표준편차가 $\\sigma = ${s}$인 정규분포를 따르는 모집단에서 크기가 $n = ${n}$인 표본을 임의추출할 때, 모평균 $m$에 대한 신뢰도 $95\\%$의 신뢰구간의 길이를 구하여라. (단, $P(|Z| \\le 1.96) = 0.95$)`;
  const ansStr = `3.92`;
  const explanation = `신뢰도 $95\\%$ 신뢰구간의 길이는\n$$L = 2 \\times 1.96 \\times \\frac{\\sigma}{\\sqrt{n}} = 2 \\times 1.96 \\times \\frac{${s}}{\\sqrt{${n}}} = 2 \\times 1.96 \\times 1 = 3.92$$입니다.`;
  const { choices, correctAnswer, answer } = buildChoices(ansStr, ['1.96', '2.58', '5.16', '7.84'], false, rng);
  return { chapter: 16, chapterName: '통계적 추정', unitId: 'statistics', tier, question, choices, correctAnswer, answer, explanation };
}

// -----------------------------------------------------------------------------
// Master Registry
// -----------------------------------------------------------------------------
export const SILRYEOK_GENERATORS = {
  1: genSilryeokIndefiniteIntegral,
  2: genSilryeokSubstByParts,
  3: genSilryeokDefiniteIntegral,
  4: genSilryeokIntegralFunctions,
  5: genSilryeokAreaUnderCurve,
  6: genSilryeokVolumeOfSolids,
  7: genSilryeokVelocityDistance,
  8: genSilryeokPermutations,
  9: genSilryeokCombinations,
  10: genSilryeokBinomialTheorem,
  11: genSilryeokProbabilityDefinition,
  12: genSilryeokProbabilityAddition,
  13: genSilryeokProbabilityMultiplication,
  14: genSilryeokProbabilityDistribution,
  15: genSilryeokNormalDistribution,
  16: genSilryeokStatisticalEstimation,
};

export const SILRYEOK_GENERATORS_BY_UNIT = {
  'advanced-integration': [
    genSilryeokIndefiniteIntegral,
    genSilryeokSubstByParts,
    genSilryeokDefiniteIntegral,
    genSilryeokIntegralFunctions,
    genSilryeokAreaUnderCurve,
    genSilryeokVolumeOfSolids,
    genSilryeokVelocityDistance,
  ],
  counting: [genSilryeokPermutations, genSilryeokCombinations, genSilryeokBinomialTheorem],
  probability: [genSilryeokProbabilityDefinition, genSilryeokProbabilityAddition, genSilryeokProbabilityMultiplication],
  statistics: [genSilryeokProbabilityDistribution, genSilryeokNormalDistribution, genSilryeokStatisticalEstimation],
};

/**
 * Generates an algorithmic Silryeok Jeongseok Integral & Stats problem.
 */
export function generateSilryeokIntegralStatsProblem(unitIdOrChapter, options = {}) {
  const rng = options.rng || Math.random;
  const tier = options.tier || 'applied';

  let fn;
  if (typeof unitIdOrChapter === 'number' && SILRYEOK_GENERATORS[unitIdOrChapter]) {
    fn = SILRYEOK_GENERATORS[unitIdOrChapter];
  } else if (SILRYEOK_GENERATORS_BY_UNIT[unitIdOrChapter]) {
    fn = pickRandom(SILRYEOK_GENERATORS_BY_UNIT[unitIdOrChapter], rng);
  } else {
    const all = Object.values(SILRYEOK_GENERATORS);
    fn = pickRandom(all, rng);
  }

  const prob = fn(tier, rng);
  const idSuffix = Math.floor(rng() * 90000 + 10000);
  const tierLabel = tier === 'basic' ? '기본문제' : tier === 'advanced' ? '고난도 문제' : '응용문제';

  return {
    id: `gen-silryeok-intstat-${prob.chapter}-${tier}-${idSuffix}`,
    number: options.number || 1,
    grade: 'g3',
    category: 'csat',
    sourceLabel: `수능·평가원 심화 기출 유형 변형 · ${prob.chapter}단원 ${prob.chapterName} [${tierLabel}]`,
    ...prob,
  };
}

/**
 * Generates a variant problem similar to the provided source problem.
 */
export function generateSilryeokIntegralStatsVariant(sourceProblem, options = {}) {
  const ch = sourceProblem?.chapter || 1;
  const tier = sourceProblem?.tier || 'applied';
  return generateSilryeokIntegralStatsProblem(ch, {
    ...options,
    tier,
    number: sourceProblem?.number || 1,
  });
}
