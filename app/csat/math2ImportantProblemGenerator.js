/**
 * 짱중요한유형 수학Ⅱ (Math 2 Important & CSAT) 문제 생성 엔진
 * (Math 2 Algorithmic Problem Generation Engine)
 *
 * 17대 핵심 수능/모의평가 출제유형 알고리즘 기반:
 * - 유형 01: 집합의 연산 (set-operations / set-theory)
 * - 유형 02: 집합의 원소의 개수 (set-cardinality / set-theory)
 * - 유형 03: 명제와 진리집합 (propositions-truth-sets / propositions)
 * - 유형 04: 충분조건과 필요조건 (conditions-logic / propositions)
 * - 유형 05: 절대부등식과 명제의 증명 (inequalities-proof / algebra)
 * - 유형 06: 합성함수 (composite-functions / functions)
 * - 유형 07: 역함수 (inverse-functions / functions)
 * - 유형 08: 유리함수 (rational-functions / functions)
 * - 유형 09: 무리함수 (radical-functions / functions)
 * - 유형 10: 등차수열 (arithmetic-sequences / sequences)
 * - 유형 11: 등비수열 (geometric-sequences / sequences)
 * - 유형 12: 등차중항과 등비중항 (sequence-means / sequences)
 * - 유형 13: 수열의 합 (시그마) (sigma-sum / sequences)
 * - 유형 14: 여러 가지 수열 (various-sequences / sequences)
 * - 유형 15: 수열의 귀납적 정의 (inductive-definition / sequences)
 * - 유형 16: 지수와 로그의 성질 (exponents-logs / algebra)
 * - 유형 17: 지수와 로그의 활용 (exponents-logs-application / algebra)
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
// 1. 유형 01: 집합의 연산
// -------------------------------------------------------------
export function genSetOperationsProblem(rng = Math.random) {
  const a = randInt(2, 5, rng);
  const b = randInt(6, 9, rng);
  const c = randInt(3, 7, rng);

  const setA = [1, 2, a];
  const setB = [2, c, b];
  const union = Array.from(new Set([...setA, ...setB])).sort((x, y) => x - y);
  const sumVal = union.reduce((acc, v) => acc + v, 0);

  const question = `두 집합 $A = \\{1, 2, ${a}\\}$, $B = \\{2, ${c}, ${b}\\}$에 대하여 집합 $A \\cup B$의 모든 원소의 합은?`;
  const explanation = `집합 $A$와 $B$의 합집합 $A \\cup B$를 구하면:
$$A \\cup B = \\{${union.join(', ')}\\}$$
따라서 모든 원소의 합은:
$$${union.join(' + ')} = ${sumVal}$$
정답은 $${sumVal}$입니다.`;

  const { choices, correctAnswer, answer } = buildChoices(`${sumVal}`, (cVal, r) => {
    const diff = randNonZero(-5, 5, r);
    return `${Math.max(1, parseInt(cVal, 10) + diff)}`;
  }, rng);

  return {
    unitId: 'set-operations',
    subjectId: 'common-math',
    amcSubjectId: 'algebra',
    amcUnitId: 'sets-logic',
    chapterName: '집합의 연산',
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -------------------------------------------------------------
// 2. 유형 02: 집합의 원소의 개수
// -------------------------------------------------------------
export function genSetCardinalityProblem(rng = Math.random) {
  const nU = randInt(40, 60, rng);
  const nA = randInt(20, 35, rng);
  const nB = randInt(15, 30, rng);
  const maxInter = Math.min(nA, nB);
  const minInter = Math.max(0, nA + nB - nU);
  const nInter = randInt(minInter + 2, maxInter - 2, rng);

  const nUnion = nA + nB - nInter;
  const nComp = nU - nUnion;

  const question = `전체집합 $U$의 두 부분집합 $A, B$에 대하여 $n(U) = ${nU}$, $n(A) = ${nA}$, $n(B) = ${nB}$, $n(A \\cap B) = ${nInter}$일 때, $n(A^c \\cap B^c)$의 값은?`;
  const explanation = `드 모르간의 법칙에 의하여 $A^c \\cap B^c = (A \\cup B)^c$입니다.
먼저 합집합의 원소의 개수를 구하면:
$$n(A \\cup B) = n(A) + n(B) - n(A \\cap B) = ${nA} + ${nB} - ${nInter} = ${nUnion}$$
따라서:
$$n(A^c \\cap B^c) = n((A \\cup B)^c) = n(U) - n(A \\cup B) = ${nU} - ${nUnion} = ${nComp}$$
정답은 $${nComp}$입니다.`;

  const { choices, correctAnswer, answer } = buildChoices(`${nComp}`, (cVal, r) => {
    const diff = randNonZero(-6, 6, r);
    return `${Math.max(1, parseInt(cVal, 10) + diff)}`;
  }, rng);

  return {
    unitId: 'set-cardinality',
    subjectId: 'common-math',
    amcSubjectId: 'algebra',
    amcUnitId: 'sets-logic',
    chapterName: '집합의 원소의 개수',
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -------------------------------------------------------------
// 3. 유형 03: 명제와 진리집합
// -------------------------------------------------------------
export function genPropositionsProblem(rng = Math.random) {
  const k = randInt(2, 5, rng);
  const m = randInt(-6, -2, rng);
  const M = randInt(6, 10, rng);

  // Condition: |x - a| <= k => a - k >= m and a + k <= M => a in [m + k, M - k]
  const minA = m + k;
  const maxA = M - k;
  const countA = maxA - minA + 1;

  const question = `두 조건 $p: |x - a| \\le ${k}$, $q: ${m} \\le x \\le ${M}$에 대하여 명제 $p \\to q$가 참이 되도록 하는 정수 $a$의 개수는?`;
  const explanation = `명제 $p \\to q$가 참이 되려면 진리집합 사이에 $P \\subset Q$가 성립해야 합니다.
조건 $p$의 진리집합 $P$는 $a - ${k} \\le x \\le a + ${k}$입니다.
$P \\subset Q$이므로:
$$${m} \\le a - ${k} \\quad \\text{이고} \\quad a + ${k} \\le ${M}$$
따라서:
$$${minA} \\le a \\le ${maxA}$$
이를 만족하는 정수 $a$는 $${minA}$부터 $${maxA}$까지이므로 개수는:
$$${maxA} - (${minA}) + 1 = ${countA}$$
정답은 $${countA}$개입니다.`;

  const { choices, correctAnswer, answer } = buildChoices(`${countA}`, (cVal, r) => {
    const diff = randNonZero(-4, 4, r);
    return `${Math.max(1, parseInt(cVal, 10) + diff)}`;
  }, rng);

  return {
    unitId: 'propositions-truth-sets',
    subjectId: 'common-math',
    amcSubjectId: 'algebra',
    amcUnitId: 'sets-logic',
    chapterName: '명제와 진리집합',
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -------------------------------------------------------------
// 4. 유형 04: 충분조건과 필요조건
// -------------------------------------------------------------
export function genConditionsProblem(rng = Math.random) {
  const a = randInt(3, 8, rng);
  const ansVal = a;

  const question = `두 조건 $p: x = ${a}$, $q: x^2 - ${a + 2}x + 2a = 0$에 대하여, 실수 $x$에 대해 $p$는 $q$이기 위한 어떤 조건인가?`;
  const explanation = `이차방정식 $x^2 - ${a + 2}x + 2a = 0$을 인수분해하면:
$$(x - 2)(x - ${a}) = 0 \\implies x = 2 \\text{ 또는 } x = ${a}$$
조건 $p$의 진리집합은 $P = \\{${a}\\}$이고,
조건 $q$의 진리집합은 $Q = \\{2, ${a}\\}$입니다.
따라서 $P \\subset Q$이고 $Q \\not\\subset P$이므로, $p \\implies q$는 참이지만 $q \\implies p$는 거짓입니다.
그러므로 $p$는 $q$이기 위한 **충분조건**입니다.`;

  const rawChoices = ['충분조건', '필요조건', '필요충분조건', '필요조건도 충분조건도 아니다', '판정할 수 없다'];
  return {
    unitId: 'conditions-logic',
    subjectId: 'common-math',
    amcSubjectId: 'algebra',
    amcUnitId: 'sets-logic',
    chapterName: '충분조건과 필요조건',
    question,
    choices: rawChoices.map((c) => `$${c}$`),
    correctAnswer: 0,
    answer: '0',
    explanation,
  };
}

// -------------------------------------------------------------
// 5. 유형 05: 절대부등식과 명제의 증명 (산술평균과 기하평균)
// -------------------------------------------------------------
export function genAbsoluteInequalityProblem(rng = Math.random) {
  const a = randInt(1, 4, rng);
  const k = randInt(2, 6, rng);
  const kSq = k * k;
  const minVal = 2 * k;

  const question = `$x > ${a}$일 때, 식 $(x - ${a}) + \\frac{${kSq}}{x - ${a}}$의 최솟값은?`;
  const explanation = `$x > ${a}$에서 $x - ${a} > 0$이고 $\\frac{${kSq}}{x - ${a}} > 0$입니다.
산술평균과 기하평균의 관계($A > 0, B > 0$일 때 $A + B \\ge 2\\sqrt{AB}$)에 의하여:
$$(x - ${a}) + \\frac{${kSq}}{x - ${a}} \\ge 2\\sqrt{(x - ${a}) \\cdot \\frac{${kSq}}{x - ${a}}} = 2\\sqrt{${kSq}} = 2 \\times ${k} = ${minVal}$$
(등호는 $x - ${a} = ${k}$, 즉 $x = ${a + k}$일 때 성립합니다.)
따라서 최솟값은 $${minVal}$입니다.`;

  const { choices, correctAnswer, answer } = buildChoices(`${minVal}`, (cVal, r) => {
    const diff = randNonZero(-5, 5, r);
    return `${Math.max(1, parseInt(cVal, 10) + diff)}`;
  }, rng);

  return {
    unitId: 'inequalities-proof',
    subjectId: 'common-math',
    amcSubjectId: 'algebra',
    amcUnitId: 'inequalities-optimization',
    chapterName: '절대부등식과 명제의 증명',
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -------------------------------------------------------------
// 6. 유형 06: 합성함수
// -------------------------------------------------------------
export function genCompositeFunctionProblem(rng = Math.random) {
  const a = randInt(2, 4, rng);
  const b = randInt(-3, 5, rng);
  const c = randInt(1, 3, rng);
  const d = randInt(-4, 4, rng);
  const x0 = randInt(1, 4, rng);

  const gx0 = c * x0 + d;
  const fgx0 = a * gx0 + b;

  const question = `두 함수 $f(x) = ${a}x ${b >= 0 ? '+' : ''}${b}$, $g(x) = ${c === 1 ? '' : c}x ${d >= 0 ? '+' : ''}${d}$에 대하여 $(f \\circ g)(${x0})$의 값은?`;
  const explanation = `합성함수의 정의에 의하여 $(f \\circ g)(${x0}) = f(g(${x0}))$입니다.
먼저 $g(${x0})$의 값을 구하면:
$$g(${x0}) = ${c === 1 ? '' : c} \\times ${x0} ${d >= 0 ? '+' : ''}${d} = ${gx0}$$
이제 $f(${gx0})$의 값을 계산하면:
$$f(${gx0}) = ${a} \\times (${gx0}) ${b >= 0 ? '+' : ''}${b} = ${fgx0}$$
따라서 정답은 $${fgx0}$입니다.`;

  const { choices, correctAnswer, answer } = buildChoices(`${fgx0}`, (cVal, r) => {
    const diff = randNonZero(-6, 6, r);
    return `${parseInt(cVal, 10) + diff}`;
  }, rng);

  return {
    unitId: 'composite-functions',
    subjectId: 'common-math',
    amcSubjectId: 'functions',
    amcUnitId: 'composite-inverse-functions',
    chapterName: '합성함수',
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -------------------------------------------------------------
// 7. 유형 07: 역함수
// -------------------------------------------------------------
export function genInverseFunctionProblem(rng = Math.random) {
  const a = randInt(2, 5, rng);
  const b = randInt(-5, 5, rng);
  const k = randInt(1, 4, rng);
  const yVal = a * k + b;

  const question = `함수 $f(x) = ${a}x ${b >= 0 ? '+' : ''}${b}$의 역함수를 $f^{-1}(x)$라 할 때, $f^{-1}(${yVal})$의 값은?`;
  const explanation = `역함수의 성질에 의해 $f^{-1}(${yVal}) = k \\iff f(k) = ${yVal}$입니다.
$$f(k) = ${a}k ${b >= 0 ? '+' : ''}${b} = ${yVal}$$
양변을 정리하면:
$$${a}k = ${yVal - b} \\implies k = ${k}$$
따라서 $f^{-1}(${yVal}) = ${k}$입니다.`;

  const { choices, correctAnswer, answer } = buildChoices(`${k}`, (cVal, r) => {
    const diff = randNonZero(-4, 4, r);
    return `${parseInt(cVal, 10) + diff}`;
  }, rng);

  return {
    unitId: 'inverse-functions',
    subjectId: 'common-math',
    amcSubjectId: 'functions',
    amcUnitId: 'composite-inverse-functions',
    chapterName: '역함수',
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -------------------------------------------------------------
// 8. 유형 08: 유리함수
// -------------------------------------------------------------
export function genRationalFunctionProblem(rng = Math.random) {
  const p = randNonZero(-4, 4, rng);
  const q = randNonZero(-3, 5, rng);
  const k = randInt(1, 5, rng);

  // y = k / (x - p) + q = (q(x - p) + k) / (x - p) = (qx + (k - p*q)) / (x - p)
  const numA = q;
  const numB = k - p * q;
  const denB = -p;

  const question = `유리함수 $y = \\frac{${numA === 1 ? '' : numA === -1 ? '-' : numA}x ${numB >= 0 ? '+' : ''}${numB}}{x ${denB >= 0 ? '+' : ''}${denB}}$의 점근선의 교점의 좌표는?`;
  const explanation = `유리함수의 표준형으로 변형하면:
$$y = \\frac{${k}}{x ${denB >= 0 ? '+' : ''}${denB}} + ${q}$$
따라서 점근선의 방정식은:
$$x = ${p}, \\quad y = ${q}$$
점근선의 교점의 좌표는 $(${p}, ${q})$입니다.`;

  const correctCoord = `(${p}, ${q})`;
  const { choices, correctAnswer, answer } = buildChoices(correctCoord, (cVal, r) => {
    const dp = randNonZero(-3, 3, r);
    const dq = randNonZero(-3, 3, r);
    return `(${p + dp}, ${q + dq})`;
  }, rng);

  return {
    unitId: 'rational-functions',
    subjectId: 'common-math',
    amcSubjectId: 'functions',
    amcUnitId: 'rational-functions',
    chapterName: '유리함수',
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -------------------------------------------------------------
// 9. 유형 09: 무리함수
// -------------------------------------------------------------
export function genRadicalFunctionProblem(rng = Math.random) {
  const a = randInt(1, 4, rng);
  const b = randInt(-4, 4, rng);
  const c = randInt(-3, 5, rng);
  const x0 = randInt(1, 3, rng);

  // Let inner = a*x0 - b be a perfect square
  const sq = randInt(1, 4, rng);
  const inner = sq * sq;
  const calculatedB = a * x0 - inner;
  const y0 = sq + c;

  const question = `무리함수 $f(x) = \\sqrt{${a === 1 ? '' : a}x ${calculatedB >= 0 ? '+' : ''}${calculatedB}} ${c >= 0 ? '+' : ''}${c}$에 대하여 $f(${x0})$의 값은?`;
  const explanation = `$x = ${x0}$을 함수식에 대입하면:
$$f(${x0}) = \\sqrt{${a === 1 ? '' : a} \\times ${x0} ${calculatedB >= 0 ? '+' : ''}${calculatedB}} ${c >= 0 ? '+' : ''}${c} = \\sqrt{${inner}} ${c >= 0 ? '+' : ''}${c} = ${sq} ${c >= 0 ? '+' : ''}${c} = ${y0}$$
따라서 정답은 $${y0}$입니다.`;

  const { choices, correctAnswer, answer } = buildChoices(`${y0}`, (cVal, r) => {
    const diff = randNonZero(-4, 4, r);
    return `${parseInt(cVal, 10) + diff}`;
  }, rng);

  return {
    unitId: 'radical-functions',
    subjectId: 'common-math',
    amcSubjectId: 'functions',
    amcUnitId: 'radicals-algebraic-graphs',
    chapterName: '무리함수',
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -------------------------------------------------------------
// 10. 유형 10: 등차수열
// -------------------------------------------------------------
export function genArithmeticSequenceProblem(rng = Math.random) {
  const a1 = randInt(-5, 10, rng);
  const d = randNonZero(-4, 6, rng);
  const p = randInt(2, 4, rng);
  const q = randInt(6, 9, rng);
  const target = randInt(10, 15, rng);

  const ap = a1 + (p - 1) * d;
  const aq = a1 + (q - 1) * d;
  const aTarget = a1 + (target - 1) * d;

  const question = `등차수열 $\\{a_n\\}$에 대하여 $a_{${p}} = ${ap}$, $a_{${q}} = ${aq}$일 때, 제 $${target}$항 $a_{${target}}$의 값은?`;
  const explanation = `등차수열의 일반항은 $a_n = a_1 + (n-1)d$입니다.
두 항의 차이를 이용하면:
$$a_{${q}} - a_{${p}} = (${q} - ${p})d = ${q - p}d$$
$$${aq} - (${ap}) = ${aq - ap} \\implies ${q - p}d = ${aq - ap} \\implies d = ${d}$$
첫째항 $a_1$을 구하면:
$$a_{${p}} = a_1 + ${p - 1}(${d}) = ${ap} \\implies a_1 = ${a1}$$
따라서 제 $${target}$항은:
$$a_{${target}} = a_1 + (${target} - 1)d = ${a1} + ${target - 1} \\times (${d}) = ${aTarget}$$
정답은 $${aTarget}$입니다.`;

  const { choices, correctAnswer, answer } = buildChoices(`${aTarget}`, (cVal, r) => {
    const diff = randNonZero(-6, 6, r);
    return `${parseInt(cVal, 10) + diff}`;
  }, rng);

  return {
    unitId: 'arithmetic-sequences',
    subjectId: 'math1',
    amcSubjectId: 'algebra',
    amcUnitId: 'sequences-patterns',
    chapterName: '등차수열',
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -------------------------------------------------------------
// 11. 유형 11: 등비수열
// -------------------------------------------------------------
export function genGeometricSequenceProblem(rng = Math.random) {
  const r = pickRandom([2, 3, -2], rng);
  const a1 = randInt(1, 4, rng) * (r === -2 ? 1 : 1);
  const p = 2;
  const q = 4;
  const target = 5;

  const a2 = a1 * r;
  const a4 = a1 * Math.pow(r, 3);
  const aTarget = a1 * Math.pow(r, target - 1);

  const question = `첫째항과 공비가 0이 아닌 등비수열 $\\{a_n\\}$에 대하여 $a_{${p}} = ${a2}$, $a_{${q}} = ${a4}$일 때, $a_{${target}}$의 값은?`;
  const explanation = `등비수열의 일반항은 $a_n = a_1 r^{n-1}$입니다.
$$\\frac{a_{${q}}}{a_{${p}}} = \\frac{a_1 r^3}{a_1 r} = r^2 = \\frac{${a4}}{${a2}} = ${Math.pow(r, 2)}$$
주어진 조건에 의해 공비 $r = ${r}$입니다.
첫째항 $a_1$은:
$$a_{${p}} = a_1 r = ${a2} \\implies a_1 = ${a1}$$
따라서 제 $${target}$항은:
$$a_{${target}} = a_1 r^{${target - 1}} = ${a1} \\times (${r})^{${target - 1}} = ${aTarget}$$
정답은 $${aTarget}$입니다.`;

  const { choices, correctAnswer, answer } = buildChoices(`${aTarget}`, (cVal, r) => {
    const diff = randNonZero(-8, 8, r);
    return `${parseInt(cVal, 10) + diff}`;
  }, rng);

  return {
    unitId: 'geometric-sequences',
    subjectId: 'math1',
    amcSubjectId: 'algebra',
    amcUnitId: 'sequences-patterns',
    chapterName: '등비수열',
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -------------------------------------------------------------
// 12. 유형 12: 등차중항과 등비중항
// -------------------------------------------------------------
export function genSequenceMeansProblem(rng = Math.random) {
  const a = randInt(2, 6, rng);
  const c = randInt(8, 18, rng) * 2;
  // Arithmetic mean b = (a + c) / 2
  const isEven = (a + c) % 2 === 0;
  const adjustedC = isEven ? c : c + 1;
  const b = (a + adjustedC) / 2;

  const question = `세 수 $${a}, x, ${adjustedC}$가 이 순서대로 등차수열을 이룰 때, 양수 $x$의 값은?`;
  const explanation = `세 수 $a, b, c$가 등차수열을 이룰 때 등차중항의 성질에 의하여:
$$2b = a + c \\implies b = \\frac{a + c}{2}$$
따라서:
$$x = \\frac{${a} + ${adjustedC}}{2} = \\frac{${a + adjustedC}}{2} = ${b}$$
정답은 $${b}$입니다.`;

  const { choices, correctAnswer, answer } = buildChoices(`${b}`, (cVal, r) => {
    const diff = randNonZero(-4, 4, r);
    return `${Math.max(1, parseInt(cVal, 10) + diff)}`;
  }, rng);

  return {
    unitId: 'sequence-means',
    subjectId: 'math1',
    amcSubjectId: 'algebra',
    amcUnitId: 'arithmetic-geometric-means',
    chapterName: '등차중항과 등비중항',
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -------------------------------------------------------------
// 13. 유형 13: 수열의 합 (시그마)
// -------------------------------------------------------------
export function genSigmaSumProblem(rng = Math.random) {
  const n = randInt(5, 10, rng);
  const a = randInt(2, 4, rng);
  const b = randInt(1, 5, rng);

  // sum_{k=1}^n (ak + b) = a * n(n+1)/2 + b * n
  const sumK = (n * (n + 1)) / 2;
  const totalSum = a * sumK + b * n;

  const question = `$$\\sum_{k=1}^{${n}} (${a}k + ${b})$$의 값은?`;
  const explanation = `시그마의 선형 성질과 자연수 거듭제곱의 합 공식에 의하여:
$$\\sum_{k=1}^{${n}} (${a}k + ${b}) = ${a}\\sum_{k=1}^{${n}} k + \\sum_{k=1}^{${n}} ${b}$$
$$\\sum_{k=1}^{${n}} k = \\frac{${n} \\times ${n + 1}}{2} = ${sumK}$$
따라서:
$$\\text{값} = ${a} \\times ${sumK} + ${b} \\times ${n} = ${a * sumK} + ${b * n} = ${totalSum}$$
정답은 $${totalSum}$입니다.`;

  const { choices, correctAnswer, answer } = buildChoices(`${totalSum}`, (cVal, r) => {
    const diff = randNonZero(-15, 15, r);
    return `${Math.max(1, parseInt(cVal, 10) + diff)}`;
  }, rng);

  return {
    unitId: 'sigma-sum',
    subjectId: 'math1',
    amcSubjectId: 'algebra',
    amcUnitId: 'sequences-patterns',
    chapterName: '수열의 합 (시그마)',
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -------------------------------------------------------------
// 14. 유형 14: 여러 가지 수열 (부분분수 전개)
// -------------------------------------------------------------
export function genVariousSequencesProblem(rng = Math.random) {
  const n = randInt(8, 15, rng);
  const ansNum = n;
  const ansDen = n + 1;
  const ansStr = `\\frac{${ansNum}}{${ansDen}}`;

  const question = `$$\\sum_{k=1}^{${n}} \\frac{1}{k(k+1)}$$의 값은?`;
  const explanation = `부분분수 전개 공식 $\\frac{1}{k(k+1)} = \\frac{1}{k} - \\frac{1}{k+1}$을 적용하면:
$$\\sum_{k=1}^{${n}} \\left( \\frac{1}{k} - \\frac{1}{k+1} \\right) = \\left(1 - \\frac{1}{2}\\right) + \\left(\\frac{1}{2} - \\frac{1}{3}\\right) + \\cdots + \\left(\\frac{1}{${n}} - \\frac{1}{${n + 1}}\\right)$$
중간 항들이 모두 소거되므로:
$$= 1 - \\frac{1}{${n + 1}} = \\frac{${ansNum}}{${ansDen}}$$
따라서 정답은 $${ansStr}$입니다.`;

  const { choices, correctAnswer, answer } = buildChoices(ansStr, (cVal, r) => {
    const dn = randNonZero(-3, 3, r);
    const dd = randInt(1, 4, r);
    return simplifyFrac(Math.max(1, ansNum + dn), ansDen + dd);
  }, rng);

  return {
    unitId: 'various-sequences',
    subjectId: 'math1',
    amcSubjectId: 'algebra',
    amcUnitId: 'sequences-patterns',
    chapterName: '여러 가지 수열',
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -------------------------------------------------------------
// 15. 유형 15: 수열의 귀납적 정의
// -------------------------------------------------------------
export function genInductiveDefinitionProblem(rng = Math.random) {
  const a1 = randInt(1, 3, rng);
  const p = randInt(2, 3, rng);
  const q = randInt(1, 4, rng);
  const target = 4;

  let cur = a1;
  const steps = [`a_1 = ${a1}`];
  for (let i = 2; i <= target; i++) {
    cur = p * cur + q;
    steps.push(`a_${i} = ${p} \\times a_{${i - 1}} + ${q} = ${cur}`);
  }

  const question = `수열 $\\{a_n\\}$이 $a_1 = ${a1}$, $a_{n+1} = ${p}a_n + ${q}$ ($n = 1, 2, 3, \\dots$)으로 정의될 때, $a_{${target}}$의 값은?`;
  const explanation = `귀납적 정의에 따라 차례대로 항을 계산하면:
$$${steps.join('$$ \n $$')}$$
따라서 $a_{${target}} = ${cur}$입니다.`;

  const { choices, correctAnswer, answer } = buildChoices(`${cur}`, (cVal, r) => {
    const diff = randNonZero(-8, 8, r);
    return `${Math.max(1, parseInt(cVal, 10) + diff)}`;
  }, rng);

  return {
    unitId: 'inductive-definition',
    subjectId: 'math1',
    amcSubjectId: 'algebra',
    amcUnitId: 'sequences-patterns',
    chapterName: '수열의 귀납적 정의',
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -------------------------------------------------------------
// 16. 유형 16: 지수와 로그의 성질
// -------------------------------------------------------------
export function genExponentsLogsProblem(rng = Math.random) {
  const base = pickRandom([2, 3, 5], rng);
  const expA = randInt(2, 4, rng);
  const expB = randInt(1, 3, rng);
  const valA = Math.pow(base, expA);
  const valB = Math.pow(base, expB);
  const ansVal = expA + expB;

  const question = `$$\\log_{${base}} ${valA} + \\log_{${base}} ${valB}$$의 값은?`;
  const explanation = `로그의 덧셈 성질 $\\log_a x + \\log_a y = \\log_a (xy)$을 이용하면:
$$\\log_{${base}} ${valA} + \\log_{${base}} ${valB} = \\log_{${base}} (${valA} \\times ${valB}) = \\log_{${base}} (${base}^{${expA}} \\times ${base}^{${expB}}) = \\log_{${base}} (${base}^{${ansVal}}) = ${ansVal}$$
또는 각 로그의 값을 직접 구하면:
$$\\log_{${base}} ${valA} = ${expA}, \\quad \\log_{${base}} ${valB} = ${expB} \\implies ${expA} + ${expB} = ${ansVal}$$
정답은 $${ansVal}$입니다.`;

  const { choices, correctAnswer, answer } = buildChoices(`${ansVal}`, (cVal, r) => {
    const diff = randNonZero(-4, 4, r);
    return `${Math.max(1, parseInt(cVal, 10) + diff)}`;
  }, rng);

  return {
    unitId: 'exponents-logs',
    subjectId: 'math1',
    amcSubjectId: 'algebra',
    amcUnitId: 'exponents-logarithms',
    chapterName: '지수와 로그의 성질',
    question,
    choices,
    correctAnswer,
    answer,
    explanation,
  };
}

// -------------------------------------------------------------
// 17. 유형 17: 지수와 로그의 활용 (실생활 관계식)
// -------------------------------------------------------------
export function genExponentsLogsApplicationProblem(rng = Math.random) {
  const halfLife = randInt(3, 8, rng) * 10; // e.g. 30, 40, 50 years
  const multiple = randInt(2, 4, rng);
  const totalTime = halfLife * multiple;
  const fractionStr = `\\frac{1}{${Math.pow(2, multiple)}}`;

  const question = `어떤 방사성 물질의 반감기는 $${halfLife}$년이다. 처음 양을 $m_0$라 할 때, $${totalTime}$년 후 남아 있는 물질의 양은 처음 양의 몇 배인가?`;
  const explanation = `반감기가 $T = ${halfLife}$년인 방사성 물질의 $t$년 후 남아 있는 양 $m(t)$는:
$$m(t) = m_0 \\left(\\frac{1}{2}\\right)^{\\frac{t}{T}}$$
$t = ${totalTime}$을 대입하면:
$$\\frac{t}{T} = \\frac{${totalTime}}{${halfLife}} = ${multiple}$$
따라서:
$$m(${totalTime}) = m_0 \\left(\\frac{1}{2}\\right)^{${multiple}} = ${fractionStr} m_0$$
남아 있는 양은 처음 양의 $${fractionStr}$배입니다.`;

  const { choices, correctAnswer, answer } = buildChoices(fractionStr, (cVal, r) => {
    const mult = randInt(1, 5, r);
    return `\\frac{1}{${Math.pow(2, mult)}}`;
  }, rng);

  return {
    unitId: 'exponents-logs-application',
    subjectId: 'math1',
    amcSubjectId: 'algebra',
    amcUnitId: 'exponents-logarithms',
    chapterName: '지수와 로그의 활용',
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
export const MATH2_IMPORTANT_GENERATORS_BY_UNIT = {
  'set-operations': [genSetOperationsProblem],
  'set-cardinality': [genSetCardinalityProblem],
  'propositions-truth-sets': [genPropositionsProblem],
  'conditions-logic': [genConditionsProblem],
  'inequalities-proof': [genAbsoluteInequalityProblem],
  'composite-functions': [genCompositeFunctionProblem],
  'inverse-functions': [genInverseFunctionProblem],
  'rational-functions': [genRationalFunctionProblem],
  'radical-functions': [genRadicalFunctionProblem],
  'arithmetic-sequences': [genArithmeticSequenceProblem],
  'geometric-sequences': [genGeometricSequenceProblem],
  'sequence-means': [genSequenceMeansProblem],
  'sigma-sum': [genSigmaSumProblem],
  'various-sequences': [genVariousSequencesProblem],
  'inductive-definition': [genInductiveDefinitionProblem],
  'exponents-logs': [genExponentsLogsProblem],
  'exponents-logs-application': [genExponentsLogsApplicationProblem],
};

export const ALL_MATH2_IMPORTANT_GENERATORS = [
  genSetOperationsProblem,
  genSetCardinalityProblem,
  genPropositionsProblem,
  genConditionsProblem,
  genAbsoluteInequalityProblem,
  genCompositeFunctionProblem,
  genInverseFunctionProblem,
  genRationalFunctionProblem,
  genRadicalFunctionProblem,
  genArithmeticSequenceProblem,
  genGeometricSequenceProblem,
  genSequenceMeansProblem,
  genSigmaSumProblem,
  genVariousSequencesProblem,
  genInductiveDefinitionProblem,
  genExponentsLogsProblem,
  genExponentsLogsApplicationProblem,
];

/**
 * Generates an algorithmic Math 2 Important problem for a given unit.
 */
export function generateMath2ImportantProblem(unitId, options = {}) {
  const rng = options.rng || Math.random;
  let list = MATH2_IMPORTANT_GENERATORS_BY_UNIT[unitId];
  if (!list || list.length === 0) {
    list = ALL_MATH2_IMPORTANT_GENERATORS;
  }

  const fn = pickRandom(list, rng);
  const prob = fn(rng);
  const idSuffix = Math.floor(rng() * 90000 + 10000);

  return {
    id: `gen-math2-${prob.unitId}-${idSuffix}`,
    number: options.number || 1,
    tier: 'important',
    grade: 'g2',
    points: 3,
    type: 'multiple_choice',
    sourceLabel: `짱중요한유형 수학Ⅱ 알고리즘 변형 · ${prob.chapterName}`,
    category: 'csat',
    ...prob,
  };
}

/**
 * Generates a variant problem similar to the provided source problem.
 */
export function generateMath2ImportantVariant(sourceProblem, options = {}) {
  const unitId = sourceProblem?.unitId || 'set-operations';
  return generateMath2ImportantProblem(unitId, {
    ...options,
    number: sourceProblem?.number || 1,
  });
}
