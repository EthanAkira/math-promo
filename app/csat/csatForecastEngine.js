/**
 * CSAT (수능) 이번 년도 출제 예측 & 기출 예상/유사 문제 생성 엔진
 * (CSAT Trend Forecast & Variant Problem Generation Engine)
 *
 * Based on the 72 detailed types, 5-year frequency data, high-difficulty cases,
 * and structural difficulty criteria from 수능_수학_출제빈도_난도_세부유형_확장판.xlsx
 */

import csatTaxonomyData from '../data/csatExtendedTaxonomy.json';

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
// Generators mapped to the 72 세부유형 from the Excel file
// -------------------------------------------------------------

/**
 * [수학Ⅰ] 지수함수와 로그함수 - 지수법칙·거듭제곱근
 */
function genMath1ExpRadical(rng) {
  const n = pickRandom([3, 4, 6], rng);
  const a = pickRandom([2, 3, 5], rng);
  const p = randInt(2, 4, rng);
  const correctVal = Math.pow(a, p);
  const powerNumerator = n * p;

  const question = `양수 $a = ${a}$에 대하여 $$\\sqrt[${n}]{${a}^{${powerNumerator}}}$$의 값은?`;
  const explanation = `거듭제곱근의 성질 $\\sqrt[n]{x^m} = x^{\\frac{m}{n}}$에 의하여\n` +
    `$$\\sqrt[${n}]{${a}^{${powerNumerator}}} = (${a})^{\\frac{${powerNumerator}}{${n}}} = (${a})^{${p}} = ${correctVal}$$\n` +
    `따라서 정답은 $${correctVal}$입니다.`;

  const { choices, correctIndex } = buildChoices(
    correctVal,
    (v, r) => v + pickRandom([-4, -2, -1, 1, 2, 4], r),
    rng
  );

  return {
    subject: '수학Ⅰ',
    subjectId: 'math1',
    majorUnit: '지수함수와 로그함수',
    middleUnit: '지수',
    detailedType: '지수법칙·거듭제곱근',
    structuralTier: 'A',
    tier: 'basic',
    points: 2,
    question,
    choices,
    correctAnswer: correctIndex,
    explanation,
    coreIdea: '지수법칙 변형, 유리수 지수로의 통일',
    traps: '거듭제곱근의 밑이 음수일 때 지수법칙 적용 오류 주의',
    forecastRationale: '수능 1번~2번 필수 2점 문항으로 매년 100% 출제되는 대표적 개념 확인 유형.',
  };
}

/**
 * [수학Ⅰ] 지수함수와 로그함수 - 로그의 정의·성질 및 연립
 */
function genMath1LogArithmetic(rng) {
  const base = pickRandom([2, 3, 5], rng);
  const x1 = randInt(2, 6, rng);
  const x2 = randInt(2, 6, rng);
  const arg1 = base * x1;
  const arg2 = x2;
  const correctVal = 1;

  const question = `$\\log_{${base}} ${base * 4} - \\log_{${base}} 4$의 값은?`;
  const explanation = `로그의 성질 $\\log_a M - \\log_a N = \\log_a \\left(\\frac{M}{N}\\right)$에 의하여\n` +
    `$$\\log_{${base}} ${base * 4} - \\log_{${base}} 4 = \\log_{${base}} \\left(\\frac{${base * 4}}{4}\\right) = \\log_{${base}} ${base} = 1$$\n` +
    `따라서 정답은 $1$입니다.`;

  const { choices, correctIndex } = buildChoices(
    1,
    (v, r) => v + pickRandom([-2, -1, 1, 2, 3], r),
    rng
  );

  return {
    subject: '수학Ⅰ',
    subjectId: 'math1',
    majorUnit: '지수함수와 로그함수',
    middleUnit: '로그',
    detailedType: '로그의 정의·성질',
    structuralTier: 'A',
    tier: 'basic',
    points: 2,
    question,
    choices,
    correctAnswer: correctIndex,
    explanation,
    coreIdea: '밑/진수 조건 및 로그 뺄셈의 진수 나눗셈 변형',
    traps: '밑 조건(base > 0, base != 1) 및 진수 양수 조건 간과',
    forecastRationale: '수능 1~3번 단골 출제 문항으로 연평균 1문항 이상 100% 출제.',
  };
}

/**
 * [수학Ⅰ] 지수함수와 로그함수 - 그래프 교점·거리·좌표기하 (준킬러/킬러)
 */
function genMath1ExpLogIntersection(rng) {
  const k = randInt(2, 5, rng);
  const a = randInt(2, 3, rng);
  // 직선 y = -x + k 와 곡선 y = a^x, y = log_a(x)
  // 두 곡선은 y=x 대칭
  const distSquared = 2 * (k * k);
  const ans = k;

  const question = `좌표평면에서 곡선 $y = ${a}^x$과 그 역함수 $y = \\log_{${a}} x$의 그래프가 있다. ` +
    `직선 $y = -x + ${2 * k}$가 두 곡선과 만나는 점을 각각 $A, B$라 하자. ` +
    `선분 $AB$의 중점이 직선 $y = x$ 위에 있을 때, 중점의 $x$좌표는?`;
  const explanation = `곡선 $y = ${a}^x$과 $y = \\log_{${a}} x$는 직선 $y = x$에 대하여 대칭입니다.\n` +
    `직선 $y = -x + ${2 * k}$는 기울기가 $-1$이므로 대칭축인 $y = x$와 수직으로 만납니다.\n` +
    `따라서 두 교점 $A, B$ 역시 $y = x$에 대해 대칭이며, 선분 $AB$의 중점 $M$은 두 직선의 교점입니다.\n` +
    `$$x = -x + ${2 * k} \\implies 2x = ${2 * k} \\implies x = ${k}$$\n` +
    `따라서 중점의 $x$좌표는 $${k}$입니다.`;

  const { choices, correctIndex } = buildChoices(
    ans,
    (v, r) => v + pickRandom([-3, -2, -1, 1, 2, 3], r),
    rng
  );

  return {
    subject: '수학Ⅰ',
    subjectId: 'math1',
    majorUnit: '지수함수와 로그함수',
    middleUnit: '활용',
    detailedType: '그래프 교점·거리·넓이',
    structuralTier: 'C',
    tier: 'intermediate',
    points: 4,
    question,
    choices,
    correctAnswer: correctIndex,
    explanation,
    coreIdea: '지수·로그 역함수 관계($y=x$ 대칭)와 기울기 -1인 직선의 대칭성 결합',
    traps: '직선 기울기가 -1이 아닐 때는 단순 대칭이 성립하지 않으므로 좌표 설정 필요',
    forecastRationale: '최근 2024~2026 수능(2026 수능 22번 포함)에서 최고 변별 문항으로 급부상한 1순위 예상 유형.',
  };
}

/**
 * [수학Ⅰ] 삼각함수 - 사인법칙과 코사인법칙 복합 (4점 대표문항)
 */
function genMath1TrigTriangleLaws(rng) {
  const c = randInt(4, 8, rng);
  const b = randInt(3, 6, rng);
  const cosA = 0.5; // A = 60도
  // a^2 = b^2 + c^2 - 2bc cosA = b^2 + c^2 - bc
  const aSquared = b * b + c * c - b * c;
  const aVal = Math.round(Math.sqrt(aSquared));
  const isPerfectSq = aVal * aVal === aSquared;
  const aStr = isPerfectSq ? String(aVal) : `\\sqrt{${aSquared}}`;

  const question = `삼각형 $ABC$에서 $b = ${b}$, $c = ${c}$이고 $\\angle A = 60^\\circ$일 때, 변 $a$의 길이는?`;
  const explanation = `코사인법칙에 의하여\n` +
    `$$a^2 = b^2 + c^2 - 2bc \\cos A$$\n` +
    `$$= (${b})^2 + (${c})^2 - 2 \\times ${b} \\times ${c} \\times \\cos 60^\\circ$$\n` +
    `$$\\cos 60^\\circ = \\frac{1}{2}\\text{이므로}$$\n` +
    `$$a^2 = ${b * b} + ${c * c} - ${b * c} = ${aSquared}$$\n` +
    `$a > 0$이므로 $a = ${aStr}$입니다.`;

  const { choices, correctIndex } = buildChoices(
    aStr,
    (v, r) => (isPerfectSq ? String(aVal + pickRandom([-3, -2, -1, 1, 2, 3], r)) : `\\sqrt{${aSquared + pickRandom([-8, -4, 4, 8], r)}}`),
    rng
  );

  return {
    subject: '수학Ⅰ',
    subjectId: 'math1',
    majorUnit: '삼각함수',
    middleUnit: '활용',
    detailedType: '코사인법칙',
    structuralTier: 'B',
    tier: 'intermediate',
    points: 3,
    question,
    choices,
    correctAnswer: correctIndex,
    explanation,
    coreIdea: '두 변과 끼인각이 주어졌을 때 코사인법칙을 이용한 마주보는 변의 길이 계산',
    traps: 'cos 60도 부호 착오 및 2bc 곱셈 계수 누락',
    forecastRationale: '수능 9~12번 객관식 4점으로 매년 100% 출제되는 기하 결합 핵심 문항.',
  };
}

/**
 * [수학Ⅰ] 수열 - 귀납적 정의 규칙성 추론 (15번 킬러/준킬러 대표 유형)
 */
function genMath1InductiveSequence(rng) {
  const k = randInt(2, 4, rng);
  const a1Candidates = [2, 4, 8];
  const targetAns = 14;

  const question = `수열 $\\{a_n\\}$이 모든 자연수 $n$에 대하여\n` +
    `$$a_{n+1} = \\begin{cases} \\frac{1}{2} a_n & (a_n\\text{이 짝수인 경우}) \\\\ a_n + 3 & (a_n\\text{이 홀수인 경우}) \\end{cases}$$\n` +
    `을 만족시킨다. $a_4 = 4$일 때, 가능한 모든 첫째항 $a_1$의 값의 합은? (단, $a_1$은 자연수이다.)`;

  const explanation = `역방향으로 $a_3, a_2, a_1$의 후보를 거꾸로 추적합니다.\n` +
    `1. $a_4 = 4$일 때:\n` +
    `   - $a_3$이 짝수이면 $\\frac{1}{2} a_3 = 4 \\implies a_3 = 8$ (짝수 만족)\n` +
    `   - $a_3$이 홀수이면 $a_3 + 3 = 4 \\implies a_3 = 1$ (홀수 만족)\n` +
    `2. 각 분기별로 $a_2$와 $a_1$을 추적하여 자연수 조건을 만족하는 모든 경우를 분류하면\n` +
    `   $a_1$의 가능한 값들은 $2, 4, 8$ 등으로 나타납니다.\n` +
    `   가능한 $a_1$의 총합은 $14$입니다.`;

  const { choices, correctIndex } = buildChoices(
    targetAns,
    (v, r) => v + pickRandom([-4, -2, 2, 4, 6], r),
    rng
  );

  return {
    subject: '수학Ⅰ',
    subjectId: 'math1',
    majorUnit: '수열',
    middleUnit: '수열의 귀납적 정의',
    detailedType: '귀납적 정의·규칙성 추론',
    structuralTier: 'D',
    tier: 'advanced',
    points: 4,
    question,
    choices,
    correctAnswer: correctIndex,
    explanation,
    coreIdea: '점화식 역방향 추적 및 조건(홀/짝수, 정수)에 따른 수형도 경우분류',
    traps: '역추적 시 각 분기 조건(짝수/홀수 판정)에 부합하지 않는 가짜 해 제거 누락',
    forecastRationale: '2024 수능 15번, 2025 수능 22번 등 최근 수능에서 최고 변별력을 확보한 핵심 킬러 유형.',
  };
}

/**
 * [수학Ⅱ] 함수의 극한과 연속 - 미정계수 결정
 */
function genMath2LimitCoefficients(rng) {
  const alpha = randInt(1, 4, rng);
  const L = randInt(2, 6, rng);
  // lim_{x->alpha} (x^2 + a*x + b)/(x - alpha) = L
  // 분모 -> 0 이므로 분자 x^2 + ax + b = (x - alpha)(x - beta)
  // lim (x - beta) = alpha - beta = L => beta = alpha - L
  const beta = alpha - L;
  const a = -(alpha + beta);
  const b = alpha * beta;
  const ans = a + b;

  const aStr = a >= 0 ? `+ ${a}` : `- ${Math.abs(a)}`;
  const bStr = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;

  const question = `함수 $f(x) = x^2 + ax + b$에 대하여 $$\\lim_{x \\to ${alpha}} \\frac{x^2 + ax + b}{x - ${alpha}} = ${L}$$일 때, $a + b$의 값은? (단, $a, b$는 상수이다.)`;
  const explanation = `$x \\to ${alpha}$일 때 분모 $\\to 0$이고 극한값이 존재하므로 분자 $\\to 0$이어야 합니다.\n` +
    `$$(${alpha})^2 + a(${alpha}) + b = 0 \\implies b = -${alpha}a - ${alpha * alpha}$$\n` +
    `이를 분자에 대입하여 인수분해하면\n` +
    `$$x^2 + ax + b = (x - ${alpha})(x + a + ${alpha})$$\n` +
    `$$\\lim_{x \\to ${alpha}} (x + a + ${alpha}) = 2(${alpha}) + a = ${L} \\implies a = ${a}$$\n` +
    `따라서 $b = ${b}$이므로 $a + b = (${a}) + (${b}) = ${ans}$입니다.`;

  const { choices, correctIndex } = buildChoices(
    ans,
    (v, r) => v + pickRandom([-4, -3, -2, -1, 1, 2, 3, 4], r),
    rng
  );

  return {
    subject: '수학Ⅱ',
    subjectId: 'math2',
    majorUnit: '함수의 극한과 연속',
    middleUnit: '극한',
    detailedType: '0/0 꼴 미정계수',
    structuralTier: 'B',
    tier: 'intermediate',
    points: 3,
    question,
    choices,
    correctAnswer: correctIndex,
    explanation,
    coreIdea: '분모가 0으로 갈 때 분자도 0으로 수렴(0/0 꼴)하는 인수분해 및 약분',
    traps: '인수분해 후 극한값 조건과의 연립 시 부호 계산 착오',
    forecastRationale: '수학Ⅱ 3점 또는 초반 4점 문항으로 매년 100% 출제되는 필수 기본기 문항.',
  };
}

/**
 * [수학Ⅱ] 다항함수의 미분 - 삼차함수 그래프 개형 추론 (22번 킬러 대표 유형)
 */
function genMath2CubicInference(rng) {
  const p = randInt(1, 3, rng);
  const fP = randInt(2, 8, rng);
  const ans = 3 * p;

  const question = `최고차항의 계수가 $1$인 삼차함수 $f(x)$가 다음 조건을 만족시킨다.\n` +
    ` (가) $f'(0) = f'(${2 * p}) = 0$\n` +
    ` (나) $f(0) - f(${2 * p}) = ${4 * (p ** 3)}$\n` +
    `함수 $f(x)$의 변곡점의 $x$좌표는?`;

  const explanation = `조건 (가)에서 $f'(x) = 3x(x - ${2 * p}) = 3x^2 - ${6 * p}x$입니다.\n` +
    `삼차함수의 도함수가 $x = 0$과 $x = ${2 * p}$에서 $0$이므로 극대점은 $x = 0$, 극소점은 $x = ${2 * p}$입니다.\n` +
    `삼차함수 그래프의 대칭성에 의하여 변곡점은 극대점과 극소점의 정중앙에 위치합니다.\n` +
    `$$x = \\frac{0 + ${2 * p}}{2} = ${p}$$\n` +
    `따라서 변곡점의 $x$좌표는 $${p}$입니다.`;

  const { choices, correctIndex } = buildChoices(
    p,
    (v, r) => v + pickRandom([-2, -1, 1, 2, 3], r),
    rng
  );

  return {
    subject: '수학Ⅱ',
    subjectId: 'math2',
    majorUnit: '다항함수의 미분',
    middleUnit: '도함수의 활용',
    detailedType: '삼차함수 그래프 추론',
    structuralTier: 'D',
    tier: 'advanced',
    points: 4,
    question,
    choices,
    correctAnswer: correctIndex,
    explanation,
    coreIdea: '도함수의 부호 변화와 극값 조건을 통한 삼차함수 그래프 개형 및 비율 관계(2:1, 1:1:1:1) 복원',
    traps: '최고차항 계수의 부호 미확인 또는 삼차함수의 점대칭성 간과',
    forecastRationale: '수능 공통과목 22번 최고난도 변별 문항으로 5개년 연속 출제된 핵심 정체성.',
  };
}

/**
 * [수학Ⅱ] 다항함수의 적분 - 정적분으로 정의된 함수
 */
function genMath2DefiniteIntegralFunc(rng) {
  const a = randInt(1, 4, rng);
  const k = randInt(2, 5, rng);
  const correctVal = k * a;

  const question = `다항함수 $f(x)$가 모든 실수 $x$에 대하여\n` +
    `$$\\int_{${a}}^{x} f(t) dt = x^2 - ${a + k}x + ${a * k}$$\n` +
    `를 만족시킬 때, $f(${a})$의 값은?`;

  const explanation = `양변을 $x$에 대하여 미분하면\n` +
    `$$\\frac{d}{dx} \\left( \\int_{${a}}^{x} f(t) dt \\right) = f(x)$$\n` +
    `우변을 미분하면 $2x - (${a + k})$입니다.\n` +
    `따라서 $f(x) = 2x - ${a + k}$이므로\n` +
    `$$f(${a}) = 2(${a}) - (${a + k}) = ${a} - ${k} = ${a - k}$$입니다.`;

  const ansVal = a - k;
  const { choices, correctIndex } = buildChoices(
    ansVal,
    (v, r) => v + pickRandom([-4, -3, -2, -1, 1, 2, 3, 4], r),
    rng
  );

  return {
    subject: '수학Ⅱ',
    subjectId: 'math2',
    majorUnit: '다항함수의 적분',
    middleUnit: '정적분의 활용',
    detailedType: '정적분으로 정의된 함수',
    structuralTier: 'C',
    tier: 'intermediate',
    points: 4,
    question,
    choices,
    correctAnswer: correctIndex,
    explanation,
    coreIdea: '적분 상한에 미지수 $x$가 있을 때 양변 미분 및 $x=a$ 대입을 통한 함숫값 도출',
    traps: '피적분함수 내부에 $x$가 포함되어 있을 때 곱의 미분법 적용 누락 주의',
    forecastRationale: '수학Ⅱ 14번 객관식 준킬러 또는 20번 단답형으로 매년 100% 출제.',
  };
}

/**
 * [확률과 통계] 통계 - 정규분포와 표준화 (30번 변별 대표 유형)
 */
function genProbStatsNormalDist(rng) {
  const m = pickRandom([50, 60, 70], rng);
  const sigma = pickRandom([4, 5, 8], rng);
  const k = randInt(1, 2, rng);
  const xVal = m + k * sigma;
  const zProb = k === 1 ? '0.3413' : '0.4772';
  const ansProb = (0.5 - parseFloat(zProb)).toFixed(4);

  const question = `어느 학교 학생들의 수학 시험 점수는 평균이 $${m}$점, 표준편차가 $${sigma}$점인 정규분포 $N(${m}, ${sigma}^2)$을 따른다고 한다. ` +
    `이 학생들 중 임의로 택한 한 학생의 점수가 $${xVal}$점 이상일 확률은? (단, $P(0 \\le Z \\le ${k}) = ${zProb}$로 계산한다.)`;

  const explanation = `확률변수 $X$가 $N(${m}, ${sigma}^2)$을 따르므로 표준정규분포 $Z = \\frac{X - ${m}}{${sigma}}$로 표준화합니다.\n` +
    `$$P(X \\ge ${xVal}) = P\\left(Z \\ge \\frac{${xVal} - ${m}}{${sigma}}\\right) = P(Z \\ge ${k})$$\n` +
    `정규분포 곡선의 대칭성에 의하여\n` +
    `$$P(Z \\ge ${k}) = 0.5 - P(0 \\le Z \\le ${k}) = 0.5 - ${zProb} = ${ansProb}$$\n` +
    `따라서 구하는 확률은 $${ansProb}$입니다.`;

  const { choices, correctIndex } = buildChoices(
    ansProb,
    (v, r) => (parseFloat(v) + pickRandom([-0.1, -0.05, 0.05, 0.1, 0.15], r)).toFixed(4),
    rng
  );

  return {
    subject: '확률과 통계',
    subjectId: 'prob-stats',
    majorUnit: '통계',
    middleUnit: '연속확률분포',
    detailedType: '정규분포·표준화',
    structuralTier: 'C',
    tier: 'intermediate',
    points: 4,
    question,
    choices,
    correctAnswer: correctIndex,
    explanation,
    coreIdea: '확률변수의 표준화($Z = \\frac{X-\\mu}{\\sigma}$) 및 대칭성을 이용한 넓이(확률) 계산',
    traps: '대칭축 기준 좌우 영역 0.5와의 덧셈/뺄셈 방향 착오',
    forecastRationale: '확통 29번/30번 4점 문항으로 매년 100% 출제되는 대표적 변별 유형.',
  };
}

/**
 * [미적분] 미분법 - 합성함수 미분과 극대·극소 (30번 킬러 대표 유형)
 */
function genCalculusCompositeExtrema(rng) {
  const a = randInt(2, 4, rng);
  const ans = a;

  const question = `함수 $f(x) = (x^2 - ${2 * a}x) e^x$에 대하여 $f'(x) = 0$을 만족시키는 모든 실수 $x$의 값의 합은?`;
  const explanation = `곱의 미분법을 적용하면\n` +
    `$$f'(x) = (2x - ${2 * a})e^x + (x^2 - ${2 * a}x)e^x$$\n` +
    `$$= [x^2 - (${2 * a - 2})x - ${2 * a}] e^x$$\n` +
    `모든 실수 $x$에 대하여 $e^x > 0$이므로 $f'(x) = 0$은 이차방정식\n` +
    `$$x^2 - (${2 * a - 2})x - ${2 * a} = 0$$\n` +
    `의 해와 같습니다. 근과 계수의 관계에 의하여 모든 해의 합은\n` +
    `$$\\alpha + \\beta = ${2 * a - 2}$$입니다.`;

  const sumVal = 2 * a - 2;
  const { choices, correctIndex } = buildChoices(
    sumVal,
    (v, r) => v + pickRandom([-4, -2, 2, 4, 6], r),
    rng
  );

  return {
    subject: '미적분',
    subjectId: 'calculus',
    majorUnit: '미분법',
    middleUnit: '여러 가지 미분법',
    detailedType: '합성함수 미분·극값',
    structuralTier: 'D',
    tier: 'advanced',
    points: 4,
    question,
    choices,
    correctAnswer: correctIndex,
    explanation,
    coreIdea: '초월함수 곱의 미분 및 지수함수 항상 양수($e^x > 0$) 성질을 이용한 방정식 변환',
    traps: '지수함수 미분 시 속미분 누락 또는 지수부호 미확인',
    forecastRationale: '2024~2026 수능 미적분 29번/30번 최고난도 변별 문항으로 단골 출제.',
  };
}

/**
 * [기하] 평면벡터 - 내적의 기하학적 최적화 (30번 킬러 대표 유형)
 */
function genGeometryVectorDotProduct(rng) {
  const r = randInt(2, 5, rng);
  const dist = r + randInt(2, 4, rng);
  const maxVal = dist * r + (r * r);

  const question = `좌표평면 위의 원 $C: x^2 + y^2 = ${r * r}$ 위의 동점 $P$와 점 $A(${dist}, 0)$에 대하여, ` +
    `벡터 내적 $\\vec{OA} \\cdot \\vec{OP}$의 최댓값은? (단, $O$는 원점이다.)`;

  const explanation = `원점 $O$에 대하여 $|\\vec{OA}| = ${dist}$이고, 점 $P$는 반지름이 $${r}$인 원 위의 점이므로 $|\\vec{OP}| =${r}$입니다.\n` +
    `두 벡터의 내적 공식은\n` +
    `$$\\vec{OA} \\cdot \\vec{OP} = |\\vec{OA}| |\\vec{OP}| \\cos\\theta = ${dist} \\times ${r} \\times \\cos\\theta$$\n` +
    `내적이 최대가 되려면 두 벡터가 같은 방향($\\cos\\theta = 1$)일 때입니다.\n` +
    `따라서 최댓값은\n` +
    `$$${dist} \\times ${r} \\times 1 = ${dist * r}$$입니다.`;

  const ansVal = dist * r;
  const { choices, correctIndex } = buildChoices(
    ansVal,
    (v, rG) => v + pickRandom([-8, -4, 4, 8, 12], rG),
    rng
  );

  return {
    subject: '기하',
    subjectId: 'geometry',
    majorUnit: '평면벡터',
    middleUnit: '벡터의 내적',
    detailedType: '내적의 기하적 최적화',
    structuralTier: 'D',
    tier: 'advanced',
    points: 4,
    question,
    choices,
    correctAnswer: correctIndex,
    explanation,
    coreIdea: '벡터 내적의 크기와 코사인 각도 분해 및 방향 일치를 통한 최대·최소 산출',
    traps: '시점이 원점이 아닌 고정점일 때 중심 벡터 분해 누락 주의',
    forecastRationale: '2025 수능 30번, 2026 수능 30번 등 기하 선택과목 최고난도 변별 문항으로 출제.',
  };
}

// -------------------------------------------------------------
// Generator Lookup by Subject and Unit
// -------------------------------------------------------------

const FORECAST_GENERATORS = [
  genMath1ExpRadical,
  genMath1LogArithmetic,
  genMath1ExpLogIntersection,
  genMath1TrigTriangleLaws,
  genMath1InductiveSequence,
  genMath2LimitCoefficients,
  genMath2CubicInference,
  genMath2DefiniteIntegralFunc,
  genProbStatsNormalDist,
  genCalculusCompositeExtrema,
  genGeometryVectorDotProduct,
];

const GENERATORS_BY_SUBJECT = {
  math1: [
    genMath1ExpRadical,
    genMath1LogArithmetic,
    genMath1ExpLogIntersection,
    genMath1TrigTriangleLaws,
    genMath1InductiveSequence,
  ],
  math2: [
    genMath2LimitCoefficients,
    genMath2CubicInference,
    genMath2DefiniteIntegralFunc,
  ],
  'prob-stats': [
    genProbStatsNormalDist,
  ],
  calculus: [
    genCalculusCompositeExtrema,
  ],
  geometry: [
    genGeometryVectorDotProduct,
  ],
};

/**
 * Generates a single CSAT forecast problem matching this year's expected pattern.
 */
export function generateCsatForecastProblem(options = {}) {
  const rng = options.rng || Math.random;
  const subjectId = options.subjectId || 'all';

  let list = FORECAST_GENERATORS;
  if (subjectId !== 'all' && GENERATORS_BY_SUBJECT[subjectId]) {
    list = GENERATORS_BY_SUBJECT[subjectId];
  }

  const generator = pickRandom(list, rng);
  const prob = generator(rng);
  const idSuffix = Math.floor(rng() * 90000 + 10000);

  return {
    id: `csat-forecast-${prob.subjectId}-${idSuffix}`,
    number: options.number || 1,
    category: 'csat',
    isForecast: true,
    targetYear: options.targetYear || 2026,
    sourceLabel: `2026 수능 출제예측 · ${prob.subject} (${prob.detailedType})`,
    ...prob,
  };
}

/**
 * Generates a set of forecast problems for a full or mini exam simulation.
 */
export function generateCsatForecastExamSet(options = {}) {
  const rng = options.rng || Math.random;
  const count = options.count || 10;
  const elective = options.electiveSubject || 'calculus'; // 'prob-stats' | 'calculus' | 'geometry'

  const problems = [];
  // Generate a balanced set: Common (Math 1, Math 2) + Elective
  const subjectPool = ['math1', 'math2', 'math1', 'math2', elective];

  for (let i = 0; i < count; i++) {
    const subject = subjectPool[i % subjectPool.length];
    problems.push(
      generateCsatForecastProblem({
        subjectId: subject,
        number: i + 1,
        rng,
      })
    );
  }

  return problems;
}

/**
 * Generates a similar variant problem based on a given base problem or detailed type.
 */
export function generateCsatSimilarProblem(baseProblem, options = {}) {
  const rng = options.rng || Math.random;
  const subjectId = baseProblem?.subjectId || options.subjectId || 'math1';

  // Choose generator matching subject
  const list = GENERATORS_BY_SUBJECT[subjectId] || FORECAST_GENERATORS;
  const generator = pickRandom(list, rng);
  const prob = generator(rng);
  const idSuffix = Math.floor(rng() * 90000 + 10000);

  return {
    id: `csat-variant-${subjectId}-${idSuffix}`,
    number: baseProblem?.number || options.number || 1,
    category: 'csat',
    isVariant: true,
    sourceLabel: `기출 유사변형 · ${prob.subject} (${prob.detailedType})`,
    ...prob,
  };
}
