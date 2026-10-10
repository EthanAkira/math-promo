/**
 * 짱중요한유형 확률과 통계 (Probability & Statistics Important & CSAT) 문제 생성 엔진
 * (Probability & Statistics Algorithmic Problem Generation Engine)
 *
 * 18대 핵심 수능/모의평가 출제유형 알고리즘 기반:
 * - 유형 01: 순열 (permutations / counting)
 * - 유형 02: 여러 가지 순열 (원순열, 중복순열) (circular-permutations / counting)
 * - 유형 03: 같은 것이 있는 순열 (최단 경로) (grid-paths / counting)
 * - 유형 04: 조합 (combinations / counting)
 * - 유형 05: 중복조합 (duplicate-combinations / counting)
 * - 유형 06: 집합의 분할과 자연수의 분할 (partitions / counting)
 * - 유형 07: 이항정리 (항의 계수 구하기) (binomial-theorem / counting)
 * - 유형 08: 확률의 뜻과 계산 (덧셈정리) (probability-addition / probability)
 * - 유형 09: 수학적 확률 구하기 (mathematical-probability / probability)
 * - 유형 10: 조건부확률 (conditional-probability / probability)
 * - 유형 11: 독립시행의 확률 (independent-trials / probability)
 * - 유형 12: 이산확률변수의 기댓값과 분산 (discrete-random-var / statistics)
 * - 유형 13: 이항분포 (binomial-dist / statistics)
 * - 유형 14: 연속확률변수와 확률밀도함수 (continuous-random-var / statistics)
 * - 유형 15: 정규분포와 표준화 (normal-dist / statistics)
 * - 유형 16: 표본평균의 분포 (sample-mean-dist / statistics)
 * - 유형 17: 모평균의 추정과 신뢰구간 (confidence-interval / statistics)
 * - 유형 18: 모비율의 추정과 신뢰구간 (population-proportion / statistics)
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

function factorial(n) {
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

function nPr(n, r) {
  if (r < 0 || r > n) return 0;
  let res = 1;
  for (let i = 0; i < r; i++) res *= (n - i);
  return res;
}

function nCr(n, r) {
  if (r < 0 || r > n) return 0;
  if (r === 0 || r === n) return 1;
  let k = Math.min(r, n - r);
  let num = 1;
  let den = 1;
  for (let i = 1; i <= k; i++) {
    num *= (n - i + 1);
    den *= i;
  }
  return Math.round(num / den);
}

function nHr(n, r) {
  return nCr(n + r - 1, r);
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

  let offset = 1;
  while (choices.size < 5) {
    const num = parseInt(correctVal, 10);
    if (!isNaN(num)) {
      choices.add(`${num + offset}`);
    } else {
      choices.add(`${correctVal}+${offset}`);
    }
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
// 1. 유형 01: 순열
// -------------------------------------------------------------
export function genPermutationProblem(rng = Math.random) {
  const total = randInt(5, 7, rng);
  const boys = randInt(2, 3, rng);
  const girls = total - boys;

  // Question: Arrange in a line such that 2 specific girls are at both ends
  // 2 girls at both ends: 2! * (total - 2)!
  const endsWay = 2; // P(2, 2)
  const middleWay = factorial(total - 2);
  const ansVal = endsWay * middleWay;

  const question = `남학생 $${boys}$명과 여학생 $${girls}$명이 한 줄로 설 때, 양 끝에 여학생이 서는 경우의 수는?`;
  const explanation = `양 끝에 여학생 $2$명을 세우는 경우의 수는 ${girls}명의 여학생 중 $2$명을 택하여 양 끝에 배열하는 방법:
$${girls} \\times ${girls - 1} = ${girls * (girls - 1)}$가지
가운데에 남은 $${total - 2}$명을 일렬로 세우는 경우의 수는 $(${total - 2})! = ${middleWay}$가지입니다.
따라서 구하는 경우의 수는:
$$${girls * (girls - 1)} \\times ${middleWay} = ${ansVal}$$
정답은 $${ansVal}$입니다.`;

  const { choices, correctAnswer, answer } = buildChoices(`${ansVal}`, (cVal, r) => {
    const diff = randNonZero(-24, 24, r);
    return `${Math.max(1, parseInt(cVal, 10) + diff)}`;
  }, rng);

  return {
    unitId: 'counting',
    subjectId: 'prob-stats',
    amcSubjectId: 'combinatorics-probability',
    amcUnitId: 'permutations-arrangements',
    chapterName: '순열',
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -------------------------------------------------------------
// 2. 유형 02: 여러 가지 순열 (원순열, 중복순열)
// -------------------------------------------------------------
export function genCircularPermutationProblem(rng = Math.random) {
  const n = randInt(4, 7, rng);
  const ansVal = factorial(n - 1);

  const question = `서로 다른 $${n}$명의 학생이 원형 탁자에 둘러앉는 경우의 수는?`;
  const explanation = `서로 다른 $n$개의 원소를 원형으로 배열하는 원순열의 공식은 $(n-1)!$입니다.
$$(${n} - 1)! = ${n - 1}! = ${ansVal}$$
따라서 정답은 $${ansVal}$입니다.`;

  const { choices, correctAnswer, answer } = buildChoices(`${ansVal}`, (cVal, r) => {
    const diff = randNonZero(-12, 12, r);
    return `${Math.max(1, parseInt(cVal, 10) + diff)}`;
  }, rng);

  return {
    unitId: 'counting',
    subjectId: 'prob-stats',
    amcSubjectId: 'combinatorics-probability',
    amcUnitId: 'permutations-arrangements',
    chapterName: '여러 가지 순열',
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -------------------------------------------------------------
// 3. 유형 03: 같은 것이 있는 순열 (최단 경로)
// -------------------------------------------------------------
export function genGridPathsProblem(rng = Math.random) {
  const w1 = randInt(2, 3, rng);
  const h1 = randInt(1, 2, rng);
  const w2 = randInt(2, 3, rng);
  const h2 = randInt(1, 2, rng);

  const way1 = nCr(w1 + h1, w1);
  const way2 = nCr(w2 + h2, w2);
  const ansVal = way1 * way2;

  const question = `그림과 같은 도로망에서 $A$ 지점에서 중간 지점 $P$를 거쳐 $B$ 지점까지 최단 거리로 가는 경우의 수는? ($A \\to P$는 가로 $${w1}$칸, 세로 $${h1}$칸이고 $P \\to B$는 가로 $${w2}$칸, 세로 $${h2}$칸이다.)`;
  const explanation = `$A$ 지점에서 $P$ 지점까지 가는 최단 경로의 수:
$$\\frac{(${w1} + ${h1})!}{${w1}! \\times ${h1}!} = {}_{${w1 + h1}}\\mathrm{C}_{${w1}} = ${way1}$$
$P$ 지점에서 $B$ 지점까지 가는 최단 경로의 수:
$$\\frac{(${w2} + ${h2})!}{${w2}! \\times ${h2}!} = {}_{${w2 + h2}}\\mathrm{C}_{${w2}} = ${way2}$$
곱의 법칙에 의하여 $A$에서 $P$를 거쳐 $B$로 가는 전체 경로의 수는:
$$${way1} \\times ${way2} = ${ansVal}$$
정답은 $${ansVal}$입니다.`;

  const { choices, correctAnswer, answer } = buildChoices(`${ansVal}`, (cVal, r) => {
    const diff = randNonZero(-6, 6, r);
    return `${Math.max(1, parseInt(cVal, 10) + diff)}`;
  }, rng);

  return {
    unitId: 'counting',
    subjectId: 'prob-stats',
    amcSubjectId: 'combinatorics-probability',
    amcUnitId: 'paths-grids',
    chapterName: '같은 것이 있는 순열',
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -------------------------------------------------------------
// 4. 유형 04: 조합
// -------------------------------------------------------------
export function genCombinationProblem(rng = Math.random) {
  const n = randInt(6, 9, rng);
  const r = randInt(2, 4, rng);
  const ansVal = nCr(n, r);

  const question = `$${n}$명의 학생 중에서 대표 $${r}$명을 선출하는 경우의 수는?`;
  const explanation = `서로 다른 $${n}$명 중에서 순서에 상관없이 $${r}$명을 택하는 조합의 수는:
$_{${n}}\\mathrm{C}_{${r}} = \\frac{${n}!}{${r}! \\times ${n - r}!} = ${ansVal}$$
정답은 $${ansVal}$입니다.`;

  const { choices, correctAnswer, answer } = buildChoices(`${ansVal}`, (cVal, r) => {
    const diff = randNonZero(-10, 10, r);
    return `${Math.max(1, parseInt(cVal, 10) + diff)}`;
  }, rng);

  return {
    unitId: 'counting',
    subjectId: 'prob-stats',
    amcSubjectId: 'combinatorics-probability',
    amcUnitId: 'permutations-combinations',
    chapterName: '조합',
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -------------------------------------------------------------
// 5. 유형 05: 중복조합
// -------------------------------------------------------------
export function genDuplicateCombinationProblem(rng = Math.random) {
  const n = randInt(5, 8, rng);
  const ansVal = nHr(3, n);

  const question = `방정식 $x + y + z = ${n}$을 만족시키는 음이 아닌 정수 $x, y, z$의 순서쌍 $(x, y, z)$의 개수는?`;
  const explanation = `음이 아닌 정수해의 개수는 서로 다른 $3$개의 변수에서 중복을 허락하여 $${n}$개를 택하는 중복조합의 수와 같습니다.
$_{3}\\mathrm{H}_{${n}} = {}_{3 + ${n} - 1}\\mathrm{C}_{${n}} = {}_{${n + 2}}\\mathrm{C}_{${n}} = {}_{${n + 2}}\\mathrm{C}_{2}$$
$_{${n + 2}}\\mathrm{C}_{2} = \\frac{${n + 2} \\times ${n + 1}}{2} = ${ansVal}$$
따라서 정답은 $${ansVal}$입니다.`;

  const { choices, correctAnswer, answer } = buildChoices(`${ansVal}`, (cVal, r) => {
    const diff = randNonZero(-8, 8, r);
    return `${Math.max(1, parseInt(cVal, 10) + diff)}`;
  }, rng);

  return {
    unitId: 'counting',
    subjectId: 'prob-stats',
    amcSubjectId: 'combinatorics-probability',
    amcUnitId: 'permutations-combinations',
    chapterName: '중복조합',
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -------------------------------------------------------------
// 6. 유형 06: 집합의 분할과 자연수의 분할
// -------------------------------------------------------------
export function genPartitionsProblem(rng = Math.random) {
  const n = randInt(5, 7, rng);
  // Natural number partition into 2 parts: floor(n / 2)
  const ansVal = Math.floor(n / 2);

  const question = `자연수 $${n}$을 두 개의 자연수의 합으로 나타내는 방법의 수 $P(${n}, 2)$의 값은?`;
  const explanation = `자연수 $${n}$을 두 자연수의 합으로 나타내는 순서쌍 $(a, b)$ ($a \\ge b \\ge 1$)를 구하면:
`;
  const pairs = [];
  for (let b = 1; b <= Math.floor(n / 2); b++) {
    pairs.push(`(${n - b}, ${b})`);
  }

  const explBody = explanation + pairs.join(', ') + `이므로 개수는 $${ansVal}$가지입니다.
따라서 $P(${n}, 2) = ${ansVal}$입니다.`;

  const { choices, correctAnswer, answer } = buildChoices(`${ansVal}`, (cVal, r) => {
    const diff = randNonZero(-2, 2, r);
    return `${Math.max(1, parseInt(cVal, 10) + diff)}`;
  }, rng);

  return {
    unitId: 'counting',
    subjectId: 'prob-stats',
    amcSubjectId: 'combinatorics-probability',
    amcUnitId: 'counting',
    chapterName: '집합의 분할과 자연수의 분할',
    question,
    choices,
    correctAnswer,
    answer,
    explanation: explBody,
  };
}

// -------------------------------------------------------------
// 7. 유형 07: 이항정리 (항의 계수 구하기)
// -------------------------------------------------------------
export function genBinomialTheoremProblem(rng = Math.random) {
  const a = randInt(2, 3, rng);
  const n = randInt(4, 6, rng);
  const r = 2; // coefficient of x^r
  const coeff = nCr(n, r) * Math.pow(a, r);

  const question = `다항식 $(${a}x + 1)^{${n}}$의 전개식에서 $x^2$의 계수는?`;
  const explanation = `이항정리에 의한 일반항은:
$_{${n}}\\mathrm{C}_{r} (${a}x)^r (1)^{${n} - r} = {}_{${n}}\\mathrm{C}_{r} \\cdot ${a}^r x^r$$
$x^2$의 계수는 $r = 2$일 때이므로:
$_{${n}}\\mathrm{C}_{2} \\times ${a}^2 = ${nCr(n, 2)} \\times ${a * a} = ${coeff}$$
따라서 정답은 $${coeff}$입니다.`;

  const { choices, correctAnswer, answer } = buildChoices(`${coeff}`, (cVal, r) => {
    const diff = randNonZero(-15, 15, r);
    return `${Math.max(1, parseInt(cVal, 10) + diff)}`;
  }, rng);

  return {
    unitId: 'counting',
    subjectId: 'prob-stats',
    amcSubjectId: 'combinatorics-probability',
    amcUnitId: 'binomial-theorem',
    chapterName: '항의 계수 구하기',
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -------------------------------------------------------------
// 8. 유형 08: 확률의 뜻과 계산 (덧셈정리)
// -------------------------------------------------------------
export function genProbabilityAdditionProblem(rng = Math.random) {
  // P(A) = a/10, P(B) = b/10, P(A n B) = c/10
  const a = randInt(4, 6, rng);
  const b = randInt(3, 5, rng);
  const c = randInt(1, Math.min(a, b) - 1, rng);
  const union = a + b - c;
  const fracStr = simplifyFrac(union, 10);

  const question = `두 사건 $A, B$에 대하여 $P(A) = \\frac{${a}}{10}$, $P(B) = \\frac{${b}}{10}$, $P(A \\cap B) = \\frac{${c}}{10}$일 때, $P(A \\cup B)$의 값은?`;
  const explanation = `확률의 덧셈정리에 의하여:
$$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$$
$$= \\frac{${a}}{10} + \\frac{${b}}{10} - \\frac{${c}}{10} = \\frac{${union}}{10} = ${fracStr}$$
따라서 정답은 $${fracStr}$입니다.`;

  const { choices, correctAnswer, answer } = buildChoices(fracStr, (cVal, r) => {
    const num = randInt(1, 9, r);
    return simplifyFrac(num, 10);
  }, rng);

  return {
    unitId: 'probability',
    subjectId: 'prob-stats',
    amcSubjectId: 'combinatorics-probability',
    amcUnitId: 'probability',
    chapterName: '확률의 계산',
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -------------------------------------------------------------
// 9. 유형 09: 수학적 확률 구하기
// -------------------------------------------------------------
export function genMathematicalProbabilityProblem(rng = Math.random) {
  const white = randInt(3, 5, rng);
  const black = randInt(3, 4, rng);
  const total = white + black;

  // Pick 2 balls, both white
  const den = nCr(total, 2);
  const num = nCr(white, 2);
  const fracStr = simplifyFrac(num, den);

  const question = `흰 공 $${white}$개와 검은 공 $${black}$개가 들어 있는 주머니에서 임의로 $2$개의 공을 동시에 꺼낼 때, $2$개 모두 흰 공일 확률은?`;
  const explanation = `전체 $${total}$개의 공 중에서 $2$개를 꺼내는 경우의 수는:
$_{${total}}\\mathrm{C}_{2} = \\frac{${total} \\times ${total - 1}}{2} = ${den}$$
흰 공 $${white}$개 중에서 $2$개를 꺼내는 경우의 수는:
$_{${white}}\\mathrm{C}_{2} = \\frac{${white} \\times ${white - 1}}{2} = ${num}$$
따라서 구하는 확률은:
$$\\frac{${num}}{${den}} = ${fracStr}$$
정답은 $${fracStr}$입니다.`;

  const { choices, correctAnswer, answer } = buildChoices(fracStr, (cVal, r) => {
    const na = randInt(1, den - 1, r);
    return simplifyFrac(na, den);
  }, rng);

  return {
    unitId: 'probability',
    subjectId: 'prob-stats',
    amcSubjectId: 'combinatorics-probability',
    amcUnitId: 'probability',
    chapterName: '확률 구하기',
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -------------------------------------------------------------
// 10. 유형 10: 조건부확률
// -------------------------------------------------------------
export function genConditionalProbabilityProblem(rng = Math.random) {
  const pA_num = randInt(4, 7, rng);
  const pAnB_num = randInt(2, pA_num - 1, rng);
  const fracStr = simplifyFrac(pAnB_num, pA_num);

  const question = `두 사건 $A, B$에 대하여 $P(A) = \\frac{${pA_num}}{10}$, $P(A \\cap B) = \\frac{${pAnB_num}}{10}$일 때, 조건부확률 $P(B|A)$의 값은?`;
  const explanation = `조건부확률의 정의에 의하여:
$$P(B|A) = \\frac{P(A \\cap B)}{P(A)} = \\frac{\\frac{${pAnB_num}}{10}}{\\frac{${pA_num}}{10}} = \\frac{${pAnB_num}}{${pA_num}} = ${fracStr}$$
따라서 정답은 $${fracStr}$입니다.`;

  const { choices, correctAnswer, answer } = buildChoices(fracStr, (cVal, r) => {
    const num = randInt(1, 8, r);
    const den = randInt(2, 9, r);
    return simplifyFrac(num, den);
  }, rng);

  return {
    unitId: 'probability',
    subjectId: 'prob-stats',
    amcSubjectId: 'combinatorics-probability',
    amcUnitId: 'probability',
    chapterName: '조건부확률',
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -------------------------------------------------------------
// 11. 유형 11: 독립시행의 확률
// -------------------------------------------------------------
export function genIndependentTrialsProblem(rng = Math.random) {
  const n = 4;
  const r = 3;
  // Toss a coin 4 times, heads 3 times: C(4, 3) * (1/2)^4 = 4 / 16 = 1/4
  const num = nCr(n, r);
  const den = Math.pow(2, n);
  const fracStr = simplifyFrac(num, den);

  const question = `한 개의 동전을 $${n}$번 던질 때, 앞면이 $${r}$번 나올 확률은?`;
  const explanation = `동전을 한 번 던질 때 앞면이 나올 확률은 $p = \\frac{1}{2}$입니다.
독립시행의 확률 공식 $P(X = r) = {}_{n}\\mathrm{C}_{r} p^r (1-p)^{n-r}$에 의하여:
$$P(X = ${r}) = {}_{${n}}\\mathrm{C}_{${r}} \\left(\\frac{1}{2}\\right)^3 \\left(\\frac{1}{2}\\right)^1 = ${num} \\times \\frac{1}{${den}} = \\frac{${num}}{${den}} = ${fracStr}$$
정답은 $${fracStr}$입니다.`;

  const { choices, correctAnswer, answer } = buildChoices(fracStr, (cVal, r) => {
    const na = randInt(1, den - 1, r);
    return simplifyFrac(na, den);
  }, rng);

  return {
    unitId: 'probability',
    subjectId: 'prob-stats',
    amcSubjectId: 'combinatorics-probability',
    amcUnitId: 'probability',
    chapterName: '독립시행의 확률',
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -------------------------------------------------------------
// 12. 유형 12: 이산확률변수의 기댓값과 분산
// -------------------------------------------------------------
export function genDiscreteRandomVarProblem(rng = Math.random) {
  const a = randInt(2, 4, rng);
  const b = randInt(1, 5, rng);
  const ex = randInt(2, 6, rng);
  const ansVal = a * ex + b;

  const question = `확률변수 $X$에 대하여 기댓값 $E(X) = ${ex}$일 때, $E(${a}X + ${b})$의 값은?`;
  const explanation = `기댓값의 선형 성질 $E(aX + b) = aE(X) + b$에 의하여:
$$E(${a}X + ${b}) = ${a}E(X) + ${b} = ${a} \\times ${ex} + ${b} = ${ansVal}$$
따라서 정답은 $${ansVal}$입니다.`;

  const { choices, correctAnswer, answer } = buildChoices(`${ansVal}`, (cVal, r) => {
    const diff = randNonZero(-6, 6, r);
    return `${parseInt(cVal, 10) + diff}`;
  }, rng);

  return {
    unitId: 'statistics',
    subjectId: 'prob-stats',
    amcSubjectId: 'combinatorics-probability',
    amcUnitId: 'probability-distributions',
    chapterName: '이산확률변수의 기댓값과 분산',
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -------------------------------------------------------------
// 13. 유형 13: 이항분포
// -------------------------------------------------------------
export function genBinomialDistProblem(rng = Math.random) {
  const n = randInt(2, 6, rng) * 10;
  const p_num = 1;
  const p_den = pickRandom([2, 5], rng);
  const mean = Math.round(n * p_num / p_den);
  const varVal = Math.round(mean * (1 - p_num / p_den));

  const question = `확률변수 $X$가 이항분포 $B\\left(${n}, \\frac{${p_num}}{${p_den}}\\right)$을 따를 때, $E(X)$의 값은?`;
  const explanation = `이항분포 $B(n, p)$에서 기댓값은 $E(X) = np$입니다.
$$E(X) = ${n} \\times \\frac{${p_num}}{${p_den}} = ${mean}$$
정답은 $${mean}$입니다.`;

  const { choices, correctAnswer, answer } = buildChoices(`${mean}`, (cVal, r) => {
    const diff = randNonZero(-5, 5, r);
    return `${Math.max(1, parseInt(cVal, 10) + diff)}`;
  }, rng);

  return {
    unitId: 'statistics',
    subjectId: 'prob-stats',
    amcSubjectId: 'combinatorics-probability',
    amcUnitId: 'probability-distributions',
    chapterName: '이항분포',
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -------------------------------------------------------------
// 14. 유형 14: 연속확률변수와 확률밀도함수
// -------------------------------------------------------------
export function genContinuousRandomVarProblem(rng = Math.random) {
  const a = randInt(2, 4, rng);
  // f(x) = kx on [0, a]. Total area = 1/2 * a * (k*a) = 1/2 * k * a^2 = 1 => k = 2 / a^2
  const kStr = `\\frac{2}{${a * a}}`;

  const question = `연속확률변수 $X$의 확률밀도함수가 $f(x) = kx$ ($0 \\le x \\le ${a}$)일 때, 상수 $k$의 값은?`;
  const explanation = `확률밀도함수의 전체 넓이는 $1$이어야 합니다.
$$\\int_{0}^{${a}} kx \\, dx = \\left[ \\frac{1}{2}kx^2 \\right]_0^{${a}} = \\frac{1}{2} k \\times ${a * a} = 1$$
$$\\frac{${a * a}}{2} k = 1 \\implies k = ${kStr}$$
따라서 상수 $k = ${kStr}$입니다.`;

  const { choices, correctAnswer, answer } = buildChoices(kStr, (cVal, r) => {
    const num = randInt(1, 4, r);
    const den = randInt(3, 9, r);
    return simplifyFrac(num, den);
  }, rng);

  return {
    unitId: 'statistics',
    subjectId: 'prob-stats',
    amcSubjectId: 'combinatorics-probability',
    amcUnitId: 'probability-distributions',
    chapterName: '연속확률변수와 확률밀도함수',
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -------------------------------------------------------------
// 15. 유형 15: 정규분포와 표준화
// -------------------------------------------------------------
export function genNormalDistProblem(rng = Math.random) {
  const m = randInt(50, 70, rng);
  const sigma = randInt(4, 8, rng);
  const k = m + sigma * 2;

  // P(X <= m + 2*sigma) = P(Z <= 2) = 0.5 + 0.4772 = 0.9772
  const ansVal = '0.9772';

  const question = `확률변수 $X$가 정규분포 $N(${m}, ${sigma}^2)$을 따를 때, $P(X \\le ${k})$의 값은? (단, $P(0 \\le Z \\le 2) = 0.4772$로 계산한다.)`;
  const explanation = `확률변수 $X$를 표준화하면 $Z = \\frac{X - m}{\\sigma}$입니다.
$$P(X \\le ${k}) = P\\left(Z \\le \\frac{${k} - ${m}}{${sigma}}\\right) = P(Z \\le 2)$$
$$P(Z \\le 2) = 0.5 + P(0 \\le Z \\le 2) = 0.5 + 0.4772 = 0.9772$$
정답은 $0.9772$입니다.`;

  const { choices, correctAnswer, answer } = buildChoices(ansVal, (cVal, r) => {
    const raw = ['0.8413', '0.9544', '0.9987', '0.5000', '0.6826'];
    return pickRandom(raw, r);
  }, rng);

  return {
    unitId: 'statistics',
    subjectId: 'prob-stats',
    amcSubjectId: 'combinatorics-probability',
    amcUnitId: 'probability-distributions',
    chapterName: '정규분포와 표준화',
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -------------------------------------------------------------
// 16. 유형 16: 표본평균의 분포
// -------------------------------------------------------------
export function genSampleMeanDistProblem(rng = Math.random) {
  const m = randInt(60, 80, rng);
  const sigma = randInt(6, 12, rng);
  const n = pickRandom([4, 9, 16], rng);
  const sqrtN = Math.sqrt(n);
  const sigmaBar = Math.round(sigma / sqrtN);

  const question = `모평균이 $${m}$, 모표준편차가 $${sigma}$인 정규분포를 따르는 모집단에서 크기가 $${n}$인 표본을 임의추출할 때, 표본평균 $\\bar{X}$의 표준편차 $\\sigma(\\bar{X})$의 값은?`;
  const explanation = `표본평균 $\\bar{X}$의 표준편차 공식은 $\\sigma(\\bar{X}) = \\frac{\\sigma}{\\sqrt{n}}$입니다.
$$\\sigma(\\bar{X}) = \\frac{${sigma}}{\\sqrt{${n}}} = \\frac{${sigma}}{${sqrtN}} = ${sigmaBar}$$
따라서 정답은 $${sigmaBar}$입니다.`;

  const { choices, correctAnswer, answer } = buildChoices(`${sigmaBar}`, (cVal, r) => {
    const diff = randNonZero(-3, 3, r);
    return `${Math.max(1, parseInt(cVal, 10) + diff)}`;
  }, rng);

  return {
    unitId: 'statistics',
    subjectId: 'prob-stats',
    amcSubjectId: 'statistics-data',
    amcUnitId: 'statistics-averages',
    chapterName: '표본평균의 분포',
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -------------------------------------------------------------
// 17. 유형 17: 모평균의 추정과 신뢰구간
// -------------------------------------------------------------
export function genConfidenceIntervalProblem(rng = Math.random) {
  const sigma = randInt(4, 10, rng);
  const n = 100;
  // Length of 95% confidence interval: 2 * 1.96 * sigma / sqrt(n) = 2 * 1.96 * sigma / 10 = 0.392 * sigma
  const lenVal = (2 * 1.96 * sigma / 10).toFixed(3);

  const question = `모표준편차가 $${sigma}$인 정규분포를 따르는 모집단에서 크기 $100$인 표본을 임의추출하여 모평균을 신뢰도 95%로 추정할 때, 신뢰구간의 길이는? (단, $Z=1.96$을 이용한다.)`;
  const explanation = `신뢰도 95%에서의 신뢰구간의 길이는:
$$L = 2 \\times 1.96 \\times \\frac{\\sigma}{\\sqrt{n}} = 2 \\times 1.96 \\times \\frac{${sigma}}{\\sqrt{100}} = 2 \\times 1.96 \\times \\frac{${sigma}}{10} = ${lenVal}$$
따라서 정답은 $${lenVal}$입니다.`;

  const { choices, correctAnswer, answer } = buildChoices(lenVal, (cVal, r) => {
    const offset = randNonZero(-3, 3, r) * 0.196;
    return (parseFloat(cVal) + offset).toFixed(3);
  }, rng);

  return {
    unitId: 'statistics',
    subjectId: 'prob-stats',
    amcSubjectId: 'statistics-data',
    amcUnitId: 'statistics-averages',
    chapterName: '모평균의 추정과 신뢰구간',
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -------------------------------------------------------------
// 18. 유형 18: 모비율의 추정과 신뢰구간
// -------------------------------------------------------------
export function genPopulationProportionProblem(rng = Math.random) {
  const n = 400;
  const pHat = '0.36';
  // Standard error: sqrt(0.36 * 0.64 / 400) = sqrt(0.2304 / 400) = 0.48 / 20 = 0.024
  const se = '0.024';

  const question = `어느 도시에서 주민 $400$명을 임의추출하여 조사한 표본비율이 $\\hat{p} = 0.36$이었다. 표본비율 $\\hat{p}$의 표준편차 $\\sigma(\\hat{p})$의 값은?`;
  const explanation = `표본비율 $\\hat{p}$의 표준편차 공식은:
$$\\sigma(\\hat{p}) = \\sqrt{\\frac{\\hat{p}(1-\\hat{p})}{n}} = \\sqrt{\\frac{0.36 \\times 0.64}{400}} = \\frac{0.6 \\times 0.8}{20} = \\frac{0.48}{20} = 0.024$$
따라서 정답은 $0.024$입니다.`;

  const { choices, correctAnswer, answer } = buildChoices(se, (cVal, r) => {
    const raw = ['0.012', '0.018', '0.032', '0.048', '0.060'];
    return pickRandom(raw, r);
  }, rng);

  return {
    unitId: 'statistics',
    subjectId: 'prob-stats',
    amcSubjectId: 'statistics-data',
    amcUnitId: 'statistics-averages',
    chapterName: '모비율의 추정과 신뢰구간',
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -------------------------------------------------------------
// Mapping & Dispatcher
// -------------------------------------------------------------
export const PROBSTATS_IMPORTANT_GENERATORS_BY_UNIT = {
  'permutations': [genPermutationProblem],
  'circular-permutations': [genCircularPermutationProblem],
  'grid-paths': [genGridPathsProblem],
  'combinations': [genCombinationProblem],
  'duplicate-combinations': [genDuplicateCombinationProblem],
  'partitions': [genPartitionsProblem],
  'binomial-theorem': [genBinomialTheoremProblem],
  'probability-addition': [genProbabilityAdditionProblem],
  'mathematical-probability': [genMathematicalProbabilityProblem],
  'conditional-probability': [genConditionalProbabilityProblem],
  'independent-trials': [genIndependentTrialsProblem],
  'discrete-random-var': [genDiscreteRandomVarProblem],
  'binomial-dist': [genBinomialDistProblem],
  'continuous-random-var': [genContinuousRandomVarProblem],
  'normal-dist': [genNormalDistProblem],
  'sample-mean-dist': [genSampleMeanDistProblem],
  'confidence-interval': [genConfidenceIntervalProblem],
  'population-proportion': [genPopulationProportionProblem],
};

export const ALL_PROBSTATS_IMPORTANT_GENERATORS = [
  genPermutationProblem,
  genCircularPermutationProblem,
  genGridPathsProblem,
  genCombinationProblem,
  genDuplicateCombinationProblem,
  genPartitionsProblem,
  genBinomialTheoremProblem,
  genProbabilityAdditionProblem,
  genMathematicalProbabilityProblem,
  genConditionalProbabilityProblem,
  genIndependentTrialsProblem,
  genDiscreteRandomVarProblem,
  genBinomialDistProblem,
  genContinuousRandomVarProblem,
  genNormalDistProblem,
  genSampleMeanDistProblem,
  genConfidenceIntervalProblem,
  genPopulationProportionProblem,
];

/**
 * Generates an algorithmic Probability & Statistics Important problem for a given unit.
 */
export function generateProbStatsImportantProblem(unitId, options = {}) {
  const rng = options.rng || Math.random;
  let list = PROBSTATS_IMPORTANT_GENERATORS_BY_UNIT[unitId];
  if (!list || list.length === 0) {
    list = ALL_PROBSTATS_IMPORTANT_GENERATORS;
  }

  const fn = pickRandom(list, rng);
  const prob = fn(rng);
  const idSuffix = Math.floor(rng() * 90000 + 10000);

  return {
    id: `gen-probstats-${prob.unitId}-${idSuffix}`,
    number: options.number || 1,
    tier: 'important',
    grade: 'g2',
    points: 3,
    type: 'multiple_choice',
    sourceLabel: `짱중요한유형 확률과 통계 알고리즘 변형 · ${prob.chapterName}`,
    category: 'csat',
    ...prob,
  };
}

/**
 * Generates a variant problem similar to the provided source problem.
 */
export function generateProbStatsImportantVariant(sourceProblem, options = {}) {
  const unitId = sourceProblem?.subUnitId || 'permutations';
  return generateProbStatsImportantProblem(unitId, {
    ...options,
    number: sourceProblem?.number || 1,
  });
}
