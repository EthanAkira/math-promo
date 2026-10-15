/**
 * 실력정석 수학1 (Silryeok Jeongseok Math 1) 문제 생성 엔진
 * (Algorithmic Problem Generation Engine)
 *
 * 17대 단원별 알고리즘 기반 생성:
 * - 유제: 기본문제 (tier: 'basic', section: '기본문제 (유제)')
 * - 연습문제 표준: 응용문제 (tier: 'applied', section: '응용문제 (연습문제 표준)')
 * - 연습문제 실력편: 고난도 문제 (tier: 'advanced', section: '고난도 문제 (실력 연습문제)')
 *
 * 17대 단원 목록:
 * 01. 행렬의 뜻 (matrices-intro / common-math-1)
 * 02. 행렬의 연산 (matrices-intro / common-math-1)
 * 03. 역행렬과 연립일차방정식 (matrices-intro / common-math-1)
 * 04. 그래프와 행렬 (matrices-intro / common-math-1)
 * 05. 지수 (exp-log / math1)
 * 06. 로그 (exp-log / math1)
 * 07. 상용로그 (exp-log / math1)
 * 08. 지수함수와 로그함수 (exp-log / math1)
 * 09. 지수방정식과 로그방정식 (exp-log / math1)
 * 10. 지수부등식과 로그부등식 (exp-log / math1)
 * 11. 등차수열 (sequences / math1)
 * 12. 등비수열 (sequences / math1)
 * 13. 여러 가지 수열 (sequences / math1)
 * 14. 수학적 귀납법 (sequences / math1)
 * 15. 알고리즘과 순서도 (sequences / math1)
 * 16. 수열의 극한 (sequence-limits / calculus)
 * 17. 무한급수 (sequence-limits / calculus)
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
// 01. 행렬의 뜻
// -----------------------------------------------------------------------------
export function genSilryeokMatrixIntro(tier = 'basic', rng = Math.random) {
  const iCoeff = randInt(1, 3, rng);
  const jCoeff = randInt(1, 3, rng);
  const constVal = randInt(-2, 4, rng);
  const targetI = randInt(1, 3, rng);
  const targetJ = randInt(1, 3, rng);
  const aij = iCoeff * targetI + jCoeff * targetJ + constVal;

  let question, explanation, correctVal;
  if (tier === 'basic') {
    question = `$3 \\times 3$ 행렬 $A = (a_{ij})$의 성분이 $a_{ij} = ${iCoeff}i + ${jCoeff}j ${constVal >= 0 ? '+ ' + constVal : '- ' + Math.abs(constVal)}$로 정의될 때, 성분 $a_{${targetI}${targetJ}}$의 값은?`;
    explanation = `행렬 $A = (a_{ij})$의 성분 공식에 $i = ${targetI}, j = ${targetJ}$를 대입하면, $a_{${targetI}${targetJ}} = ${iCoeff}(${targetI}) + ${jCoeff}(${targetJ}) ${constVal >= 0 ? '+ ' + constVal : '- ' + Math.abs(constVal)} = ${aij}$이다.`;
    correctVal = aij;
  } else if (tier === 'applied') {
    const traceVal = (iCoeff * 1 + jCoeff * 1 + constVal) + (iCoeff * 2 + jCoeff * 2 + constVal) + (iCoeff * 3 + jCoeff * 3 + constVal);
    question = `$3 \\times 3$ 행렬 $A = (a_{ij})$의 성분이 $a_{ij} = ${iCoeff}i + ${jCoeff}j ${constVal >= 0 ? '+ ' + constVal : '- ' + Math.abs(constVal)}$일 때, 주대각성분의 합 $a_{11} + a_{22} + a_{33}$의 값은?`;
    explanation = `$a_{11} = ${iCoeff}(1) + ${jCoeff}(1) + ${constVal} = ${iCoeff + jCoeff + constVal}$\n$a_{22} = ${iCoeff}(2) + ${jCoeff}(2) + ${constVal} = ${2 * iCoeff + 2 * jCoeff + constVal}$\n$a_{33} = ${iCoeff}(3) + ${jCoeff}(3) + ${constVal} = ${3 * iCoeff + 3 * jCoeff + constVal}$\n따라서 주대각성분의 합은 $${traceVal}$이다.`;
    correctVal = traceVal;
  } else {
    // advanced: sum of all elements in 3x3 matrix
    let allSum = 0;
    for (let r = 1; r <= 3; r++) {
      for (let c = 1; c <= 3; c++) {
        allSum += iCoeff * r + jCoeff * c + constVal;
      }
    }
    question = `$3 \\times 3$ 행렬 $A = (a_{ij})$에 대하여 $a_{ij} = ${iCoeff}i + ${jCoeff}j ${constVal >= 0 ? '+ ' + constVal : '- ' + Math.abs(constVal)}$이다. 행렬 $A$의 모든 성분의 총합은?`;
    explanation = `행렬 $A$의 모든 성분의 합은 $\\sum_{i=1}^3 \\sum_{j=1}^3 (${iCoeff}i + ${jCoeff}j + ${constVal})$이다.\n$\\sum_{i=1}^3 ${iCoeff}i \\times 3 = ${iCoeff} \\times 6 \\times 3 = ${18 * iCoeff}$\n$\\sum_{j=1}^3 ${jCoeff}j \\times 3 = ${jCoeff} \\times 6 \\times 3 = ${18 * jCoeff}$\n상수항의 합 $= 9 \\times (${constVal}) = ${9 * constVal}$\n총합은 $${allSum}$이다.`;
    correctVal = allSum;
  }

  const { choices, correctAnswer, answer } = buildChoices(correctVal, [-4, -2, 2, 4], true, rng);
  return {
    chapter: 1, chapterName: '행렬의 뜻', subjectId: 'common-math-1', unitId: 'matrices-intro', subUnitId: 'matrix-concepts',
    tier, question, explanation, choices, correctAnswer, answer, points: tier === 'basic' ? 2 : tier === 'applied' ? 3 : 4,
  };
}

// -----------------------------------------------------------------------------
// 02. 행렬의 연산
// -----------------------------------------------------------------------------
export function genSilryeokMatrixOps(tier = 'basic', rng = Math.random) {
  const a = randInt(1, 3, rng);
  const b = randInt(1, 3, rng);
  const c = randInt(0, 2, rng);
  const d = randInt(1, 4, rng);

  const tr = a + d;
  const det = a * d - b * c;

  let question, explanation, correctVal;
  if (tier === 'basic') {
    const k = randInt(2, 4, rng);
    question = `이차정사각행렬 $A = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}$에 대하여 행렬 $${k}A$의 모든 성분의 합을 구하시오.`;
    const sumA = a + b + c + d;
    correctVal = k * sumA;
    explanation = `행렬 $A$의 모든 성분의 합은 $${a} + ${b} + ${c} + ${d} = ${sumA}$이므로, $${k}A$의 모든 성분의 합은 $${k} \\times ${sumA} = ${correctVal}$이다.`;
  } else if (tier === 'applied') {
    question = `행렬 $A = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}$에 대하여 케일리-해밀턴 정리 $A^2 - pA + qE = O$가 성립할 때, 상수 $p + q$의 값은? (단, $E$는 단위행렬, $O$는 영행렬)`;
    correctVal = tr + det;
    explanation = `케일리-해밀턴 정리에 의하여 이차정사각행렬 $A$에 대해 $A^2 - (a+d)A + (ad-bc)E = O$가 성립한다.\n$p = a + d = ${a} + ${d} = ${tr}$\n$q = ad - bc = (${a})(${d}) - (${b})(${c}) = ${det}$\n따라서 $p + q = ${tr} + ${det} = ${correctVal}$이다.`;
  } else {
    // advanced: A^3 or A^2 = pA - qE
    question = `행렬 $A = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}$에 대하여 $A^2 = ${tr}A ${det >= 0 ? '- ' + det : '+ ' + Math.abs(det)}E$가 성립할 때, 행렬 $A^3$을 $mA + nE$의 꼴로 나타낼 때 상수 $m + n$의 값은?`;
    const m = tr * tr - det;
    const n = -tr * det;
    correctVal = m + n;
    explanation = `$A^2 = ${tr}A - ${det}E$의 양변에 $A$를 곱하면\n$A^3 = ${tr}A^2 - ${det}A = ${tr}(${tr}A - ${det}E) - ${det}A = (${tr * tr - det})A - (${tr * det})E$\n따라서 $m = ${m}, n = ${n}$이므로 $m + n = ${correctVal}$이다.`;
  }

  const { choices, correctAnswer, answer } = buildChoices(correctVal, [-5, -2, 3, 6], true, rng);
  return {
    chapter: 2, chapterName: '행렬의 연산', subjectId: 'common-math-1', unitId: 'matrices-intro', subUnitId: 'matrix-operations',
    tier, question, explanation, choices, correctAnswer, answer, points: tier === 'basic' ? 2 : tier === 'applied' ? 3 : 4,
  };
}

// -----------------------------------------------------------------------------
// 03. 역행렬과 연립일차방정식
// -----------------------------------------------------------------------------
export function genSilryeokInverseMatrix(tier = 'basic', rng = Math.random) {
  const k = randInt(1, 5, rng);
  const a = randInt(2, 4, rng);
  const detZeroK = a * k; // for det = ad - bc = 0

  let question, explanation, correctVal;
  if (tier === 'basic') {
    question = `이차정사각행렬 $A = \\begin{pmatrix} ${a} & ${k} \\\\ ${a * 2} & x \\end{pmatrix}$의 역행렬 $A^{-1}$가 존재하지 않도록 하는 실수 $x$의 값은?`;
    correctVal = 2 * k;
    explanation = `행렬 $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$의 역행렬이 존재하지 않으려면 $ad - bc = 0$이어야 한다.\n$(${a})(x) - (${k})(${a * 2}) = 0 \\implies ${a}x = ${2 * a * k} \\implies x = ${correctVal}$이다.`;
  } else if (tier === 'applied') {
    const x0 = randInt(1, 4, rng);
    const y0 = randInt(1, 4, rng);
    const c1 = a * x0 + 1 * y0;
    const c2 = 1 * x0 + 2 * y0;
    question = `연립일차방정식 $\\begin{pmatrix} ${a} & 1 \\\\ 1 & 2 \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} ${c1} \\\\ ${c2} \\end{pmatrix}$의 해 $(x, y)$에 대하여 $x + y$의 값은?`;
    correctVal = x0 + y0;
    explanation = `계수행렬 $A = \\begin{pmatrix} ${a} & 1 \\\\ 1 & 2 \\end{pmatrix}$의 판별식 $D = ${2 * a} - 1 = ${2 * a - 1} \\neq 0$이므로 역행렬이 존재한다.\n역행렬을 곱하여 연립방정식을 풀면 $x = ${x0}, y = ${y0}$이다.\n따라서 $x + y = ${correctVal}$이다.`;
  } else {
    question = `연립일차방정식 $\\begin{pmatrix} k-1 & 2 \\\\ 3 & k-2 \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} 0 \\\\ 0 \\end{pmatrix}$이 $x = 0, y = 0$ 이외의 해를 갖도록 하는 모든 실수 $k$의 값의 합은?`;
    correctVal = 3;
    explanation = `연립방정식이 $x=0, y=0$ 이외의 해(자명하지 않은 해)를 가지려면 계수행렬의 역행렬이 존재하지 않아야 한다.\n즉, $(k-1)(k-2) - 6 = 0 \\iff k^2 - 3k + 2 - 6 = 0 \\iff k^2 - 3k - 4 = 0$\n근과 계수의 관계에 의하여 모든 실수 $k$의 값의 합은 $3$이다.`;
  }

  const { choices, correctAnswer, answer } = buildChoices(correctVal, [-3, -1, 1, 2], true, rng);
  return {
    chapter: 3, chapterName: '역행렬과 연립일차방정식', subjectId: 'common-math-1', unitId: 'matrices-intro', subUnitId: 'inverse-matrix',
    tier, question, explanation, choices, correctAnswer, answer, points: tier === 'basic' ? 2 : tier === 'applied' ? 3 : 4,
  };
}

// -----------------------------------------------------------------------------
// 04. 그래프와 행렬
// -----------------------------------------------------------------------------
export function genSilryeokGraphMatrix(tier = 'basic', rng = Math.random) {
  const vertices = randInt(4, 6, rng);
  const edges = randInt(vertices, vertices * 2 - 1, rng);
  const sumOfEntries = edges * 2;

  let question, explanation, correctVal;
  if (tier === 'basic') {
    question = `꼭짓점의 개수가 $${vertices}$개이고 변의 개수가 $${edges}$개인 그래프의 인접행렬 $M$에 대하여, 행렬 $M$의 모든 성분의 합은?`;
    correctVal = sumOfEntries;
    explanation = `그래프의 인접행렬에서 각 변은 2개의 $1$에 대응하므로, 인접행렬의 모든 성분의 합은 변의 개수의 $2$배인 $2 \\times ${edges} = ${sumOfEntries}$이다.`;
  } else if (tier === 'applied') {
    const degSum = sumOfEntries;
    question = `꼭짓점의 개수가 $${vertices}$개인 그래프에서 각 꼭짓점에 연결된 변의 개수(차수)의 합이 $${degSum}$일 때, 이 그래프의 변의 개수는?`;
    correctVal = edges;
    explanation = `오일러의 차수 정리에 의하여 모든 꼭짓점의 차수의 합은 변의 개수의 $2$배와 같다.\n따라서 변의 개수 $= \\frac{${degSum}}{2} = ${edges}$개이다.`;
  } else {
    // advanced: M^2 entry represents paths of length 2
    question = `꼭짓점 $A, B, C, D$로 이루어진 그래프의 인접행렬 $M$에 대하여, 행렬 $M^2$의 $(i, j)$ 성분이 의미하는 바로 가장 적절한 것은?`;
    correctVal = 0; // index for choice
    const choiceTexts = [
      '꼭짓점 $i$에서 꼭짓점 $j$로 가는 길이가 $2$인 경로의 개수',
      '꼭짓점 $i$와 $j$ 사이를 직접 연결하는 변의 개수의 제곱',
      '꼭짓점 $i$에서 꼭짓점 $j$로 가는 최단 경로의 길이',
      '꼭짓점 $i$와 꼭짓점 $j$의 차수의 곱',
      '그래프 전체의 닫힌 회로의 총개수'
    ];
    return {
      chapter: 4, chapterName: '그래프와 행렬', subjectId: 'common-math-1', unitId: 'matrices-intro', subUnitId: 'graph-matrix',
      tier, question,
      explanation: `인접행렬 $M$의 거듭제곱 $M^n$의 $(i, j)$ 성분은 꼭짓점 $i$에서 꼭짓점 $j$로 가는 길이가 $n$인 경로의 개수를 나타낸다. 따라서 $M^2$의 $(i, j)$ 성분은 길이가 $2$인 경로의 개수이다.`,
      choices: choiceTexts.map((c) => String(c)), correctAnswer: 0, answer: '0', points: 4,
    };
  }

  const { choices, correctAnswer, answer } = buildChoices(correctVal, [-4, -2, 2, 4], true, rng);
  return {
    chapter: 4, chapterName: '그래프와 행렬', subjectId: 'common-math-1', unitId: 'matrices-intro', subUnitId: 'graph-matrix',
    tier, question, explanation, choices, correctAnswer, answer, points: tier === 'basic' ? 2 : 3,
  };
}

// -----------------------------------------------------------------------------
// 05. 지수
// -----------------------------------------------------------------------------
export function genSilryeokExponents(tier = 'basic', rng = Math.random) {
  const base = pickRandom([2, 3, 5], rng);
  const p = randInt(2, 4, rng);
  const q = randInt(1, 3, rng);

  let question, explanation, correctVal;
  if (tier === 'basic') {
    question = `$\\left( ${base}^{${p}} \\right)^{\\frac{1}{${p}}} \\times ${base}^{${q}}$의 값은?`;
    correctVal = Math.pow(base, 1 + q);
    explanation = `$\\left( ${base}^{${p}} \\right)^{\\frac{1}{${p}}} = ${base}^{1}$\n따라서 ${base}^{1} \\times ${base}^{${q}} = ${base}^{${1 + q}} = ${correctVal}$이다.`;
  } else if (tier === 'applied') {
    const k = randInt(2, 4, rng);
    question = `$x + x^{-1} = ${k}$일 때, $x^2 + x^{-2}$의 값을 구하시오.`;
    correctVal = k * k - 2;
    explanation = `$(x + x^{-1})^2 = x^2 + 2 + x^{-2} = ${k}^2 = ${k * k}$\n따라서 $x^2 + x^{-2} = ${k * k} - 2 = ${correctVal}$이다.`;
  } else {
    const k = randInt(3, 5, rng);
    question = `$x + x^{-1} = ${k}$일 때, $x^3 + x^{-3}$의 값을 구하시오.`;
    correctVal = Math.pow(k, 3) - 3 * k;
    explanation = `$x^3 + x^{-3} = (x + x^{-1})^3 - 3(x + x^{-1}) = ${k}^3 - 3(${k}) = ${Math.pow(k, 3)} - ${3 * k} = ${correctVal}$이다.`;
  }

  const { choices, correctAnswer, answer } = buildChoices(correctVal, [-6, -3, 3, 6], true, rng);
  return {
    chapter: 5, chapterName: '지수', subjectId: 'math1', unitId: 'exp-log', subUnitId: 'exponents',
    tier, question, explanation, choices, correctAnswer, answer, points: tier === 'basic' ? 2 : tier === 'applied' ? 3 : 4,
  };
}

// -----------------------------------------------------------------------------
// 06. 로그
// -----------------------------------------------------------------------------
export function genSilryeokLogarithms(tier = 'basic', rng = Math.random) {
  const base = pickRandom([2, 3], rng);
  const expVal = randInt(2, 5, rng);
  const numVal = Math.pow(base, expVal);

  let question, explanation, correctVal;
  if (tier === 'basic') {
    question = `$\\log_{${base}} ${numVal}$의 값을 구하시오.`;
    correctVal = expVal;
    explanation = `$\\log_{${base}} ${numVal} = \\log_{${base}} (${base}^{${expVal}}) = ${expVal}$이다.`;
  } else if (tier === 'applied') {
    const m = randInt(2, 6, rng);
    const n = randInt(2, 6, rng);
    const prod = m * n;
    question = `$\\log_{${base}} ${m} + \\log_{${base}} ${n} - \\log_{${base}} ${prod}$의 값을 구하시오.`;
    correctVal = 0;
    explanation = `$\\log_{${base}} ${m} + \\log_{${base}} ${n} - \\log_{${base}} ${prod} = \\log_{${base}} \\left(\\frac{${m} \\times ${n}}{${prod}}\\right) = \\log_{${base}} 1 = 0$이다.`;
  } else {
    // advanced: change of base chain
    question = `$\\log_2 3 \\times \\log_3 5 \\times \\log_5 8$의 값을 구하시오.`;
    correctVal = 3;
    explanation = `밑변환 공식에 의하여 $\\frac{\\log 3}{\\log 2} \\times \\frac{\\log 5}{\\log 3} \\times \\frac{\\log 8}{\\log 5} = \\frac{\\log 8}{\\log 2} = \\log_2 8 = 3$이다.`;
  }

  const { choices, correctAnswer, answer } = buildChoices(correctVal, [-2, -1, 1, 2], true, rng);
  return {
    chapter: 6, chapterName: '로그', subjectId: 'math1', unitId: 'exp-log', subUnitId: 'logarithms',
    tier, question, explanation, choices, correctAnswer, answer, points: tier === 'basic' ? 2 : tier === 'applied' ? 3 : 4,
  };
}

// -----------------------------------------------------------------------------
// 07. 상용로그
// -----------------------------------------------------------------------------
export function genSilryeokCommonLog(tier = 'basic', rng = Math.random) {
  const digits = randInt(3, 7, rng);
  let question, explanation, correctVal;

  if (tier === 'basic') {
    question = `$\\log 10^{${digits}}$의 값을 구하시오.`;
    correctVal = digits;
    explanation = `상용로그의 정의에 의하여 $\\log 10^{${digits}} = ${digits}$이다.`;
  } else if (tier === 'applied') {
    // characteristic (지표) determining number of digits
    const n = randInt(15, 25, rng);
    // 2^n digits: log10(2) approx 0.3010
    const logVal = Math.floor(n * 0.3010);
    correctVal = logVal + 1;
    question = `$\\log 2 = 0.3010$일 때, $2^{${n}}$은 몇 자리의 정수인지 구하시오.`;
    explanation = `$\\log 2^{${n}} = ${n} \\times \\log 2 = ${n} \\times 0.3010 = ${(n * 0.3010).toFixed(4)}$이다.\n지표(정수 부분)가 $${logVal}$이므로 자리수는 $${logVal} + 1 = ${correctVal}$자리이다.`;
  } else {
    // advanced: small decimal first non-zero digit
    const n = randInt(10, 20, rng);
    const logVal = Math.floor(n * 0.3010);
    correctVal = logVal + 1;
    question = `$\\log 2 = 0.3010$일 때, $\\left(\\frac{1}{2}\\right)^{${n}}$을 소수로 나타내면 소수점 아래 몇째 자리에서 처음으로 $0$이 아닌 숫자가 나타나는가?`;
    explanation = `$\\log \\left(\\frac{1}{2}\\right)^{${n}} = -${n} \\log 2 = -${(n * 0.3010).toFixed(4)} = -${logVal + 1} + ${(1 - (n * 0.3010 - logVal)).toFixed(4)}$\n지표가 $-${logVal + 1}$이므로 소수점 아래 $${correctVal}$째 자리에서 처음으로 $0$이 아닌 숫자가 나타난다.`;
  }

  const { choices, correctAnswer, answer } = buildChoices(correctVal, [-3, -1, 1, 2], true, rng);
  return {
    chapter: 7, chapterName: '상용로그', subjectId: 'math1', unitId: 'exp-log', subUnitId: 'logarithms',
    tier, question, explanation, choices, correctAnswer, answer, points: tier === 'basic' ? 2 : tier === 'applied' ? 3 : 4,
  };
}

// -----------------------------------------------------------------------------
// 08. 지수함수와 로그함수
// -----------------------------------------------------------------------------
export function genSilryeokExpLogFunctions(tier = 'basic', rng = Math.random) {
  const a = pickRandom([2, 3], rng);
  const p = randInt(1, 3, rng);
  const q = randInt(1, 4, rng);

  let question, explanation, correctVal;
  if (tier === 'basic') {
    question = `지수함수 $f(x) = ${a}^{x - ${p}} + ${q}$에 대하여 $f(${p + 1})$의 값을 구하시오.`;
    correctVal = a + q;
    explanation = `$f(${p + 1}) = ${a}^{(${p + 1}) - ${p}} + ${q} = ${a}^1 + ${q} = ${correctVal}$이다.`;
  } else if (tier === 'applied') {
    const xMin = 1;
    const xMax = 3;
    const maxVal = Math.pow(a, xMax - p) + q;
    question = `정의역이 $[${xMin}, ${xMax}]$인 함수 $y = ${a}^{x - ${p}} + ${q}$의 최댓값은?`;
    correctVal = maxVal;
    explanation = `밑이 $${a} > 1$이므로 증가함수이다. 따라서 $x = ${xMax}$에서 최댓값을 갖는다.\n최댓값 $= ${a}^{${xMax} - ${p}} + ${q} = ${maxVal}$이다.`;
  } else {
    // advanced: intersection / inverse function
    question = `함수 $f(x) = \\log_{${a}} (x - ${p}) + ${q}$의 역함수를 $g(x)$라 할 때, $g(${q + 1})$의 값을 구하시오.`;
    correctVal = p + a;
    explanation = `$g(${q + 1}) = k \\iff f(k) = ${q + 1}$이다.\n$\\log_{${a}} (k - ${p}) + ${q} = ${q + 1} \\iff \\log_{${a}} (k - ${p}) = 1 \\iff k - ${p} = ${a} \\iff k = ${p + a}$이다.`;
  }

  const { choices, correctAnswer, answer } = buildChoices(correctVal, [-4, -2, 2, 4], true, rng);
  return {
    chapter: 8, chapterName: '지수함수와 로그함수', subjectId: 'math1', unitId: 'exp-log', subUnitId: 'exp-log-graphs',
    tier, question, explanation, choices, correctAnswer, answer, points: tier === 'basic' ? 2 : tier === 'applied' ? 3 : 4,
  };
}

// -----------------------------------------------------------------------------
// 09. 지수방정식과 로그방정식
// -----------------------------------------------------------------------------
export function genSilryeokExpLogEquations(tier = 'basic', rng = Math.random) {
  const a = pickRandom([2, 3], rng);
  const sol1 = randInt(1, 3, rng);
  const sol2 = randInt(4, 6, rng);

  let question, explanation, correctVal;
  if (tier === 'basic') {
    const rhs = Math.pow(a, sol1);
    question = `방정식 $${a}^{2x - 1} = ${rhs}$의 해 $x$의 값을 구하시오.`;
    // 2x - 1 = sol1 => x = (sol1 + 1)/2
    const ansNum = sol1 + 1;
    correctVal = ansNum % 2 === 0 ? ansNum / 2 : ansNum;
    explanation = `$${a}^{2x - 1} = ${a}^{${sol1}} \\implies 2x - 1 = ${sol1} \\implies 2x = ${ansNum} \\implies x = ${ansNum / 2}$이다.`;
    if (ansNum % 2 !== 0) {
      return genSilryeokExpLogEquations(tier, rng);
    }
  } else if (tier === 'applied') {
    // substitution: t^2 - (a^sol1 + a^sol2)t + a^(sol1+sol2) = 0
    const A = Math.pow(a, sol1);
    const B = Math.pow(a, sol2);
    const S = A + B;
    const P = A * B;
    question = `방정식 $${a}^{2x} - ${S} \\cdot ${a}^x + ${P} = 0$의 두 실근의 합은?`;
    correctVal = sol1 + sol2;
    explanation = `$${a}^x = t$ ($t > 0$)라 두면 $t^2 - ${S}t + ${P} = 0 \\iff (t - ${A})(t - ${B}) = 0$\n$t = ${a}^x = ${A} \\implies x = ${sol1}$, $t = ${a}^x = ${B} \\implies x = ${sol2}$\n따라서 두 근의 합은 $${sol1} + ${sol2} = ${correctVal}$이다.`;
  } else {
    // advanced: log equation with log condition
    const p = randInt(2, 4, rng);
    question = `방정식 $\\log_2 (x - 1) + \\log_2 (x + 1) = ${p}$의 실근을 구하시오.`;
    const rhsVal = Math.pow(2, p);
    // x^2 - 1 = rhsVal => x = sqrt(rhsVal + 1)
    const inside = rhsVal + 1;
    question = `방정식 $\\log_2 (x - 1) + \\log_2 (x + 1) = 3$의 양의 실근 $x$의 값은?`;
    correctVal = 3;
    explanation = `진수 조건: $x > 1$\n$\\log_2 (x^2 - 1) = 3 \\implies x^2 - 1 = 8 \\implies x^2 = 9$\n$x > 1$이므로 $x = 3$이다.`;
  }

  const { choices, correctAnswer, answer } = buildChoices(correctVal, [-3, -1, 1, 2], true, rng);
  return {
    chapter: 9, chapterName: '지수방정식과 로그방정식', subjectId: 'math1', unitId: 'exp-log', subUnitId: 'exp-log-equations',
    tier, question, explanation, choices, correctAnswer, answer, points: tier === 'basic' ? 2 : tier === 'applied' ? 3 : 4,
  };
}

// -----------------------------------------------------------------------------
// 10. 지수부등식과 로그부등식
// -----------------------------------------------------------------------------
export function genSilryeokExpLogInequalities(tier = 'basic', rng = Math.random) {
  const a = randInt(2, 4, rng);
  const k = randInt(2, 5, rng);

  let question, explanation, correctVal;
  if (tier === 'basic') {
    const rhs = Math.pow(a, k);
    question = `부등식 $${a}^x \\le ${rhs}$를 만족하는 자연수 $x$의 개수는?`;
    correctVal = k;
    explanation = `$${a}^x \\le ${a}^{${k}}$에서 밑 $${a} > 1$이므로 $x \\le ${k}$이다.\n따라서 자연수 $x$는 $1, 2, \\dots, ${k}$의 $${k}$개이다.`;
  } else if (tier === 'applied') {
    // base between 0 and 1
    question = `부등식 $\\left(\\frac{1}{2}\\right)^{2x - 3} \\ge \\left(\\frac{1}{2}\\right)^{x + 1}$을 만족하는 자연수 $x$의 최댓값은?`;
    correctVal = 4;
    explanation = `밑이 $0 < \\frac{1}{2} < 1$이므로 부등호 방향이 반대로 바뀐다.\n$2x - 3 \\le x + 1 \\implies x \\le 4$\n따라서 자연수 $x$의 최댓값은 $4$이다.`;
  } else {
    // advanced: log inequality with domain condition
    question = `부등식 $\\log_2 (x - 2) + \\log_2 (x - 4) \\le 3$을 만족하는 정수 $x$의 개수를 구하시오.`;
    // x > 4, (x-2)(x-4) <= 8 => x^2 - 6x + 8 <= 8 => x(x-6) <= 0 => 0 <= x <= 6
    // with x > 4 => x = 5, 6 => 2 integers
    correctVal = 2;
    explanation = `진수 조건: $x - 2 > 0$ 이고 $x - 4 > 0 \\implies x > 4$\n$\\log_2 [(x-2)(x-4)] \\le 3 \\implies (x-2)(x-4) \\le 8$\n$x^2 - 6x \\le 0 \\implies 0 \\le x \\le 6$\n진수 조건 $x > 4$와의 공통 범위는 $4 < x \\le 6$이므로 정수 $x$는 $5, 6$의 $2$개이다.`;
  }

  const { choices, correctAnswer, answer } = buildChoices(correctVal, [-2, -1, 1, 2], true, rng);
  return {
    chapter: 10, chapterName: '지수부등식과 로그부등식', subjectId: 'math1', unitId: 'exp-log', subUnitId: 'exp-log-inequalities',
    tier, question, explanation, choices, correctAnswer, answer, points: tier === 'basic' ? 2 : tier === 'applied' ? 3 : 4,
  };
}

// -----------------------------------------------------------------------------
// 11. 등차수열
// -----------------------------------------------------------------------------
export function genSilryeokArithmeticSeq(tier = 'basic', rng = Math.random) {
  const a1 = randInt(1, 10, rng);
  const d = randInt(2, 6, rng);
  const n = randInt(5, 12, rng);
  const an = a1 + (n - 1) * d;

  let question, explanation, correctVal;
  if (tier === 'basic') {
    question = `첫째항이 $${a1}$이고 공차가 $${d}$인 등차수열 $\\{a_n\\}$의 제$${n}$항 $a_{${n}}$의 값은?`;
    correctVal = an;
    explanation = `등차수열의 일반항 공식 $a_n = a_1 + (n-1)d$에 의하여 $a_{${n}} = ${a1} + (${n}-1)(${d}) = ${a1} + ${(n-1)*d} = ${an}$이다.`;
  } else if (tier === 'applied') {
    const Sn = (n * (2 * a1 + (n - 1) * d)) / 2;
    question = `첫째항이 $${a1}$이고 공차가 $${d}$인 등차수열의 첫째항부터 제$${n}$항까지의 합 $S_{${n}}$의 값은?`;
    correctVal = Sn;
    explanation = `등차수열의 합 공식 $S_n = \\frac{n(2a + (n-1)d)}{2}$에 대입하면\n$S_{${n}} = \\frac{${n}(2 \\times ${a1} + ${n-1} \\times ${d})}{2} = \\frac{${n}(${2*a1 + (n-1)*d})}{2} = ${Sn}$이다.`;
  } else {
    // advanced: Sn maximum when an turns negative
    const A = randInt(40, 60, rng);
    const D = randInt(3, 5, rng);
    const N = Math.floor(A / D) + 1; // number of positive terms
    const maxSn = (N * (2 * A - (N - 1) * D)) / 2;
    question = `첫째항이 $${A}$이고 공차가 $-${D}$인 등차수열 $\\{a_n\\}$의 첫째항부터 제$n$항까지의 합 $S_n$이 최대가 될 때의 자연수 $n$의 값은?`;
    correctVal = N;
    explanation = `$a_n = ${A} - ${D}(n - 1) > 0 \\implies ${D}n < ${A + D} \\implies n < \\frac{${A + D}}{${D}} = ${(A + D) / D}$\n따라서 제$${N}$항까지 양수이고 제$${N+1}$항부터 음수이므로, $S_n$이 최대가 되는 $n = ${N}$이다.`;
  }

  const { choices, correctAnswer, answer } = buildChoices(correctVal, [-6, -3, 3, 6], true, rng);
  return {
    chapter: 11, chapterName: '등차수열', subjectId: 'math1', unitId: 'sequences', subUnitId: 'arithmetic-sequences',
    tier, question, explanation, choices, correctAnswer, answer, points: tier === 'basic' ? 2 : tier === 'applied' ? 3 : 4,
  };
}

// -----------------------------------------------------------------------------
// 12. 등비수열
// -----------------------------------------------------------------------------
export function genSilryeokGeometricSeq(tier = 'basic', rng = Math.random) {
  const a = randInt(2, 5, rng);
  const r = randInt(2, 3, rng);
  const n = randInt(3, 5, rng);
  const an = a * Math.pow(r, n - 1);

  let question, explanation, correctVal;
  if (tier === 'basic') {
    question = `첫째항이 $${a}$이고 공비가 $${r}$인 등비수열 $\\{a_n\\}$의 제$${n}$항 $a_{${n}}$의 값은?`;
    correctVal = an;
    explanation = `등비수열의 일반항 공식 $a_n = a r^{n-1}$에 대입하면 $a_{${n}} = ${a} \\times ${r}^{${n}-1} = ${a} \\times ${Math.pow(r, n-1)} = ${an}$이다.`;
  } else if (tier === 'applied') {
    const Sn = (a * (Math.pow(r, n) - 1)) / (r - 1);
    question = `첫째항이 $${a}$이고 공비가 $${r}$인 등비수열의 첫째항부터 제$${n}$항까지의 합 $S_{${n}}$의 값은?`;
    correctVal = Sn;
    explanation = `등비수열의 합 공식 $S_n = \\frac{a(r^n - 1)}{r - 1}$에 대입하면\n$S_{${n}} = \\frac{${a}(${r}^{${n}} - 1)}{${r} - 1} = \\frac{${a}(${Math.pow(r, n) - 1})}{${r - 1}} = ${Sn}$이다.`;
  } else {
    // advanced: geometric mean property a_m * a_k
    question = `모든 항이 양수인 등비수열 $\\{a_n\\}$에 대하여 $a_2 = 6, a_6 = 24$일 때, $a_4$의 값은?`;
    // a_4^2 = a_2 * a_6 = 144 => a_4 = 12
    correctVal = 12;
    explanation = `등비수열의 성질(등비중항)에 의하여 $a_4^2 = a_2 \\times a_6 = 6 \\times 24 = 144$\n모든 항이 양수이므로 $a_4 = 12$이다.`;
  }

  const { choices, correctAnswer, answer } = buildChoices(correctVal, [-8, -4, 4, 8], true, rng);
  return {
    chapter: 12, chapterName: '등비수열', subjectId: 'math1', unitId: 'sequences', subUnitId: 'geometric-sequences',
    tier, question, explanation, choices, correctAnswer, answer, points: tier === 'basic' ? 2 : tier === 'applied' ? 3 : 4,
  };
}

// -----------------------------------------------------------------------------
// 13. 여러 가지 수열
// -----------------------------------------------------------------------------
export function genSilryeokSigmaSum(tier = 'basic', rng = Math.random) {
  const n = randInt(5, 10, rng);
  const sumK = (n * (n + 1)) / 2;

  let question, explanation, correctVal;
  if (tier === 'basic') {
    const c = randInt(2, 4, rng);
    question = `$\\sum_{k=1}^{${n}} (${c}k + 1)$의 값을 구하시오.`;
    correctVal = c * sumK + n;
    explanation = `$\\sum_{k=1}^{${n}} (${c}k + 1) = ${c} \\sum_{k=1}^{${n}} k + \\sum_{k=1}^{${n}} 1 = ${c} \\times \\frac{${n} \\times ${n+1}}{2} + ${n} = ${c} \\times ${sumK} + ${n} = ${correctVal}$이다.`;
  } else if (tier === 'applied') {
    // sum k(k+1)
    const sumKK = (n * (n + 1) * (n + 2)) / 3;
    question = `$\\sum_{k=1}^{${n}} k(k + 1)$의 값을 구하시오.`;
    correctVal = sumKK;
    explanation = `$\\sum_{k=1}^n k(k+1) = \\frac{n(n+1)(n+2)}{3}$ 공식에 $n = ${n}$을 대입하면\n$\\frac{${n} \\times ${n+1} \\times ${n+2}}{3} = ${sumKK}$이다.`;
  } else {
    // advanced: partial fractions sum 1 / (k(k+1))
    question = `$\\sum_{k=1}^{${n}} \\frac{1}{k(k + 1)}$의 값은?`;
    return {
      chapter: 13, chapterName: '여러 가지 수열', subjectId: 'math1', unitId: 'sequences', subUnitId: 'sigma-sum',
      tier, question,
      explanation: `부분분수 분해: $\\frac{1}{k(k+1)} = \\frac{1}{k} - \\frac{1}{k+1}$\n망원합으로 전개하면 $\\left(1 - \\frac{1}{2}\\right) + \\left(\\frac{1}{2} - \\frac{1}{3}\\right) + \\dots + \\left(\\frac{1}{${n}} - \\frac{1}{${n+1}}\\right) = 1 - \\frac{1}{${n+1}} = \\frac{${n}}{${n+1}}$이다.`,
      choices: [`$\\frac{${n}}{${n+1}}$`, `$\\frac{${n-1}}{${n}}$`, `$\\frac{${n+1}}{${n+2}}$`, `$\\frac{1}{${n+1}}$`, `$\\frac{${n}}{${n+2}}$`],
      correctAnswer: 0, answer: '0', points: 4,
    };
  }

  const { choices, correctAnswer, answer } = buildChoices(correctVal, [-10, -5, 5, 10], true, rng);
  return {
    chapter: 13, chapterName: '여러 가지 수열', subjectId: 'math1', unitId: 'sequences', subUnitId: 'sigma-sum',
    tier, question, explanation, choices, correctAnswer, answer, points: tier === 'basic' ? 2 : tier === 'applied' ? 3 : 4,
  };
}

// -----------------------------------------------------------------------------
// 14. 수학적 귀납법
// -----------------------------------------------------------------------------
export function genSilryeokMathInduction(tier = 'basic', rng = Math.random) {
  const a1 = randInt(1, 4, rng);
  const p = randInt(2, 3, rng);
  const q = randInt(1, 3, rng);

  let question, explanation, correctVal;
  if (tier === 'basic') {
    // a_{n+1} = a_n + q
    const targetN = 4;
    const a4 = a1 + 3 * q;
    question = `수열 $\\{a_n\\}$이 $a_1 = ${a1}$, $a_{n+1} = a_n + ${q}$ ($n \\ge 1$)로 정의될 때, $a_4$의 값은?`;
    correctVal = a4;
    explanation = `$a_2 = ${a1} + ${q} = ${a1 + q}$\n$a_3 = ${a1 + q} + ${q} = ${a1 + 2 * q}$\n$a_4 = ${a1 + 2 * q} + ${q} = ${a4}$이다.`;
  } else if (tier === 'applied') {
    // a_{n+1} = p * a_n + q
    const a2 = p * a1 + q;
    const a3 = p * a2 + q;
    question = `수열 $\\{a_n\\}$이 $a_1 = ${a1}$, $a_{n+1} = ${p}a_n + ${q}$ ($n \\ge 1$)로 정의될 때, $a_3$의 값은?`;
    correctVal = a3;
    explanation = `$a_2 = ${p}(${a1}) + ${q} = ${a2}$\n$a_3 = ${p}(${a2}) + ${q} = ${a3}$이다.`;
  } else {
    // advanced: periodic recurrence or non-linear recurrence
    // a_{n+1} = 1 / (1 - a_n) with a_1 = 2 => a_2 = -1, a_3 = 1/2, a_4 = 2 (period 3)
    const target = randInt(50, 100, rng);
    const mod = target % 3;
    const val = mod === 1 ? 2 : mod === 2 ? -1 : 1; // if 0 then 1/2
    question = `수열 $\\{a_n\\}$이 $a_1 = 2$, $a_{n+1} = \\frac{1}{1 - a_n}$ ($n \\ge 1$)으로 정의될 때, $a_{${target}}$의 값은?`;
    if (mod === 0) {
      return {
        chapter: 14, chapterName: '수학적 귀납법', subjectId: 'math1', unitId: 'sequences', subUnitId: 'mathematical-induction',
        tier, question,
        explanation: `$a_1 = 2$\n$a_2 = \\frac{1}{1 - 2} = -1$\n$a_3 = \\frac{1}{1 - (-1)} = \\frac{1}{2}$\n$a_4 = \\frac{1}{1 - 1/2} = 2$\n주기가 $3$인 순환수열이다. $${target} = 3 \\times ${Math.floor(target / 3)} + 0$이므로 $a_{${target}} = a_3 = \\frac{1}{2}$이다.`,
        choices: ['$\\frac{1}{2}$', '$2$', '$-1$', '$1$', '$0$'],
        correctAnswer: 0, answer: '0', points: 4,
      };
    } else {
      correctVal = mod === 1 ? 2 : -1;
      explanation = `$a_1 = 2, a_2 = -1, a_3 = 1/2, a_4 = 2$로 주기가 $3$이다. $${target} \\equiv ${mod} \\pmod 3$이므로 $a_{${target}} = ${correctVal}$이다.`;
    }
  }

  const { choices, correctAnswer, answer } = buildChoices(correctVal, [-3, -1, 1, 2], true, rng);
  return {
    chapter: 14, chapterName: '수학적 귀납법', subjectId: 'math1', unitId: 'sequences', subUnitId: 'mathematical-induction',
    tier, question, explanation, choices, correctAnswer, answer, points: tier === 'basic' ? 2 : tier === 'applied' ? 3 : 4,
  };
}

// -----------------------------------------------------------------------------
// 15. 알고리즘과 순서도
// -----------------------------------------------------------------------------
export function genSilryeokAlgorithmsFlowcharts(tier = 'basic', rng = Math.random) {
  const N = randInt(5, 10, rng);
  const correctVal = (N * (N + 1)) / 2;

  let question, explanation;
  if (tier === 'basic') {
    question = `순서도 알고리즘에서 변수 $S=0, I=0$으로 시작하여, [ $I = I + 1$ ], [ $S = S + I$ ], [ $I < ${N}$ 이면 반복 ]을 수행한 후 인쇄되는 $S$의 값은?`;
    explanation = `$I$가 $1$부터 $${N}$까지 $1$씩 증가하며 $S$에 누적된다.\n따라서 $S = 1 + 2 + \\dots + ${N} = \\frac{${N} \\times ${N+1}}{2} = ${correctVal}$이다.`;
  } else if (tier === 'applied') {
    const k = randInt(2, 4, rng);
    const sumEven = N * (N + 1);
    question = `알고리즘에서 $S=0, I=0$으로 시작하여 [ $I = I + 2$ ], [ $S = S + I$ ], [ $I < ${2 * N}$ 이면 반복 ]을 거친 후 출력되는 $S$의 값은?`;
    explanation = `짝수 $2, 4, 6, \\dots, ${2 * N}$의 합을 구하는 알고리즘이다.\n$S = 2(1 + 2 + \\dots + ${N}) = 2 \\times \\frac{${N}(${N+1})}{2} = ${sumEven}$이다.`;
    const { choices, correctAnswer, answer } = buildChoices(sumEven, [-6, -3, 3, 6], true, rng);
    return {
      chapter: 15, chapterName: '알고리즘과 순서도', subjectId: 'math1', unitId: 'sequences', subUnitId: 'algorithms-flowcharts',
      tier, question, explanation, choices, correctAnswer, answer, points: 3,
    };
  } else {
    // advanced: factorial or nested loop
    question = `알고리즘에서 $P=1, I=1$로 초기화하고 [ $I = I + 1$ ], [ $P = P \\times I$ ], [ $I < 5$ 이면 반복 ]을 수행할 때 최종 출력되는 $P$의 값은?`;
    const fact5 = 120;
    explanation = `$P$는 $1 \\times 2 \\times 3 \\times 4 \\times 5 = 5! = 120$을 계산한다.`;
    const { choices, correctAnswer, answer } = buildChoices(fact5, [-20, -10, 10, 20], true, rng);
    return {
      chapter: 15, chapterName: '알고리즘과 순서도', subjectId: 'math1', unitId: 'sequences', subUnitId: 'algorithms-flowcharts',
      tier, question, explanation, choices, correctAnswer, answer, points: 4,
    };
  }

  const { choices, correctAnswer, answer } = buildChoices(correctVal, [-5, -2, 2, 5], true, rng);
  return {
    chapter: 15, chapterName: '알고리즘과 순서도', subjectId: 'math1', unitId: 'sequences', subUnitId: 'algorithms-flowcharts',
    tier, question, explanation, choices, correctAnswer, answer, points: 2,
  };
}

// -----------------------------------------------------------------------------
// 16. 수열의 극한
// -----------------------------------------------------------------------------
export function genSilryeokSequenceLimits(tier = 'basic', rng = Math.random) {
  const a = randInt(2, 6, rng);
  const b = randInt(1, 5, rng);
  const c = randInt(2, 5, rng);

  let question, explanation, correctVal;
  if (tier === 'basic') {
    question = `극한값 $\\lim_{n \\to \\infty} \\frac{${a}n + ${b}}{${c}n - 1}$의 값은? (단, $a=${a}, c=${c}$)`;
    // clean fraction
    return {
      chapter: 16, chapterName: '수열의 극한', subjectId: 'calculus', unitId: 'sequence-limits', subUnitId: 'sequence-convergence',
      tier, question: `극한값 $\\lim_{n \\to \\infty} \\frac{${a}n + ${b}}{${c}n - 1}$을 구하시오.`,
      explanation: `분모와 분자를 최고차항 $n$으로 나누면 $\\lim_{n \\to \\infty} \\frac{${a} + \\frac{${b}}{n}}{${c} - \\frac{1}{n}} = \\frac{${a}}{${c}}$이다.`,
      choices: [`$${simplifyFrac(a, c)}$`, `$${simplifyFrac(a + 1, c)}$`, `$${simplifyFrac(a - 1, c)}$`, `$${c}$`, `$0$`],
      correctAnswer: 0, answer: '0', points: 2,
    };
  } else if (tier === 'applied') {
    // rationalization: sqrt(n^2 + kn) - n -> k/2
    const k = randInt(2, 8, rng) * 2; // even number so k/2 is integer
    correctVal = k / 2;
    question = `극한값 $\\lim_{n \\to \\infty} \\left( \\sqrt{n^2 + ${k}n} - n \\right)$의 값을 구하시오.`;
    explanation = `분자를 유리화하면\n$\\lim_{n \\to \\infty} \\frac{(\\sqrt{n^2 + ${k}n} - n)(\\sqrt{n^2 + ${k}n} + n)}{\\sqrt{n^2 + ${k}n} + n} = \\lim_{n \\to \\infty} \\frac{${k}n}{\\sqrt{n^2 + ${k}n} + n} = \\frac{${k}}{1 + 1} = ${correctVal}$이다.`;
  } else {
    // advanced: sandwich theorem or geometric limit with power
    const r = randInt(3, 5, rng);
    question = `극한값 $\\lim_{n \\to \\infty} \\frac{${r}^{n+1} - 2^n}{${r}^n + 3^n}$의 값을 구하시오.`;
    correctVal = r;
    explanation = `분모에서 가장 밑이 큰 항인 $${r}^n$으로 분모와 분자를 나누면\n$\\lim_{n \\to \\infty} \\frac{${r} - \\left(\\frac{2}{${r}}\\right)^n}{1 + \\left(\\frac{3}{${r}}\\right)^n} = \\frac{${r} - 0}{1 + 0} = ${r}$이다.`;
  }

  const { choices, correctAnswer, answer } = buildChoices(correctVal, [-3, -1, 1, 2], true, rng);
  return {
    chapter: 16, chapterName: '수열의 극한', subjectId: 'calculus', unitId: 'sequence-limits', subUnitId: 'sequence-convergence',
    tier, question, explanation, choices, correctAnswer, answer, points: tier === 'applied' ? 3 : 4,
  };
}

// -----------------------------------------------------------------------------
// 17. 무한급수
// -----------------------------------------------------------------------------
export function genSilryeokInfiniteSeries(tier = 'basic', rng = Math.random) {
  let question, explanation, correctVal;

  if (tier === 'basic') {
    // a / (1 - r) with r = 1/2 or 1/3
    const rDen = pickRandom([2, 3], rng);
    const a = randInt(1, 4, rng);
    // S = a / (1 - 1/rDen) = a * rDen / (rDen - 1)
    const num = a * rDen;
    const den = rDen - 1;
    const ansStr = simplifyFrac(num, den);
    question = `첫째항이 $${a}$이고 공비가 $\\frac{1}{${rDen}}$인 무한등비급수 $\\sum_{n=1}^\\infty ${a} \\left(\\frac{1}{${rDen}}\\right)^{n-1}$의 합은?`;
    explanation = `무한등비급수의 수렴 조건 $|r| < 1$을 만족하므로 공식 $S = \\frac{a}{1 - r}$에 대입하면\n$S = \\frac{${a}}{1 - \\frac{1}{${rDen}}} = \\frac{${a}}{\\frac{${rDen - 1}}{${rDen}}} = ${ansStr}$이다.`;
    return {
      chapter: 17, chapterName: '무한급수', subjectId: 'calculus', unitId: 'sequence-limits', subUnitId: 'infinite-series',
      tier, question, explanation,
      choices: [`$${ansStr}$`, `$${simplifyFrac(num + 1, den)}$`, `$${simplifyFrac(num - 1, den)}$`, `$${a}$`, `$${a * 2}$`],
      correctAnswer: 0, answer: '0', points: 2,
    };
  } else if (tier === 'applied') {
    // repeating decimal via geometric series
    const p = randInt(1, 8, rng);
    question = `순환소수 $0.\\dot{${p}}$를 무한등비급수를 이용하여 기약분수로 나타낸 것은?`;
    const ansFrac = simplifyFrac(p, 9);
    explanation = `$0.\\dot{${p}} = \\frac{${p}}{10} + \\frac{${p}}{100} + \\dots = \\frac{\\frac{${p}}{10}}{1 - \\frac{1}{10}} = \\frac{\\frac{${p}}{10}}{\\frac{9}{10}} = \\frac{${p}}{9} = ${ansFrac}$이다.`;
    return {
      chapter: 17, chapterName: '무한급수', subjectId: 'calculus', unitId: 'sequence-limits', subUnitId: 'infinite-series',
      tier, question, explanation,
      choices: [`$${ansFrac}$`, `$\\frac{${p}}{10}$`, `$\\frac{${p+1}}{9}$`, `$\\frac{${p}}{99}$`, `$\\frac{${p}}{11}$`],
      correctAnswer: 0, answer: '0', points: 3,
    };
  } else {
    // advanced: geometric series application (fractal / geometric scale ratio)
    question = `첫째항이 $a$이고 공비가 $r$인 수렴하는 무한등비급수의 합이 $4$이고, 각 항의 제곱으로 이루어진 무한등비급수의 합이 $\\frac{16}{3}$일 때, 첫째항 $a$의 값은?`;
    // S1 = a / (1-r) = 4 => a = 4(1-r)
    // S2 = a^2 / (1-r^2) = 16/3 => 16(1-r)^2 / [(1-r)(1+r)] = 16(1-r)/(1+r) = 16/3 => (1-r)/(1+r) = 1/3 => 3-3r = 1+r => 4r = 2 => r = 1/2 => a = 2
    correctVal = 2;
    explanation = `$S_1 = \\frac{a}{1 - r} = 4 \\implies a = 4(1 - r)$\n각 항을 제곱한 수열은 첫째항 $a^2$, 공비 $r^2$이므로\n$S_2 = \\frac{a^2}{1 - r^2} = \\frac{16(1 - r)^2}{(1 - r)(1 + r)} = \\frac{16(1 - r)}{1 + r} = \\frac{16}{3}$\n$\\frac{1 - r}{1 + r} = \\frac{1}{3} \\implies 3 - 3r = 1 + r \\implies 4r = 2 \\implies r = \\frac{1}{2}$\n따라서 $a = 4\\left(1 - \\frac{1}{2}\\right) = 2$이다.`;
  }

  const { choices, correctAnswer, answer } = buildChoices(correctVal, [-2, -1, 1, 2], true, rng);
  return {
    chapter: 17, chapterName: '무한급수', subjectId: 'calculus', unitId: 'sequence-limits', subUnitId: 'infinite-series',
    tier, question, explanation, choices, correctAnswer, answer, points: 4,
  };
}

// -----------------------------------------------------------------------------
// Chapter Generator Dispatch Table
// -----------------------------------------------------------------------------
export const SILRYEOK_MATH1_GENERATORS = {
  1: genSilryeokMatrixIntro,
  2: genSilryeokMatrixOps,
  3: genSilryeokInverseMatrix,
  4: genSilryeokGraphMatrix,
  5: genSilryeokExponents,
  6: genSilryeokLogarithms,
  7: genSilryeokCommonLog,
  8: genSilryeokExpLogFunctions,
  9: genSilryeokExpLogEquations,
  10: genSilryeokExpLogInequalities,
  11: genSilryeokArithmeticSeq,
  12: genSilryeokGeometricSeq,
  13: genSilryeokSigmaSum,
  14: genSilryeokMathInduction,
  15: genSilryeokAlgorithmsFlowcharts,
  16: genSilryeokSequenceLimits,
  17: genSilryeokInfiniteSeries,
};

export const SILRYEOK_MATH1_GENERATORS_BY_UNIT = {
  'matrices-intro': [genSilryeokMatrixIntro, genSilryeokMatrixOps, genSilryeokInverseMatrix, genSilryeokGraphMatrix],
  'exp-log': [genSilryeokExponents, genSilryeokLogarithms, genSilryeokCommonLog, genSilryeokExpLogFunctions, genSilryeokExpLogEquations, genSilryeokExpLogInequalities],
  'sequences': [genSilryeokArithmeticSeq, genSilryeokGeometricSeq, genSilryeokSigmaSum, genSilryeokMathInduction, genSilryeokAlgorithmsFlowcharts],
  'sequence-limits': [genSilryeokSequenceLimits, genSilryeokInfiniteSeries],
};

/**
 * Generates an algorithmic Silryeok Jeongseok Math 1 problem.
 */
export function generateSilryeokMath1Problem(unitIdOrChapter, options = {}) {
  const rng = options.rng || Math.random;
  const tier = options.tier || 'applied';

  let fn;
  if (typeof unitIdOrChapter === 'number' && SILRYEOK_MATH1_GENERATORS[unitIdOrChapter]) {
    fn = SILRYEOK_MATH1_GENERATORS[unitIdOrChapter];
  } else if (SILRYEOK_MATH1_GENERATORS_BY_UNIT[unitIdOrChapter]) {
    fn = pickRandom(SILRYEOK_MATH1_GENERATORS_BY_UNIT[unitIdOrChapter], rng);
  } else {
    const all = Object.values(SILRYEOK_MATH1_GENERATORS);
    fn = pickRandom(all, rng);
  }

  const prob = fn(tier, rng);
  const idSuffix = Math.floor(rng() * 90000 + 10000);
  const tierLabel = tier === 'basic' ? '기본문제' : tier === 'advanced' ? '고난도 문제' : '응용문제';

  return {
    id: `gen-silryeok-math1-${prob.chapter}-${tier}-${idSuffix}`,
    number: options.number || 1,
    grade: 'g3',
    category: 'csat',
    sourceLabel: `실력정석 수학1 변형 · ${prob.chapter}단원 ${prob.chapterName} [${tierLabel}]`,
    ...prob,
  };
}

/**
 * Generates a variant problem similar to the provided source problem.
 */
export function generateSilryeokMath1Variant(sourceProblem, options = {}) {
  const ch = sourceProblem?.chapter || 1;
  const tier = sourceProblem?.tier || 'applied';
  return generateSilryeokMath1Problem(ch, {
    ...options,
    tier,
    number: sourceProblem?.number || 1,
  });
}
