// Korean Middle School Grade 9 Semester 1 (중3-1) Applied Problem Generators
// Based on deep analysis of standard curriculum applied problem types:
// Covers applied problem types from 유형익히기, 유형 UP, 중단원 마무리, and 실력 UP+.
// Absolutely NO brand names in user-facing labels or descriptions.

const ri = (random, min, max) => Math.floor(random() * (max - min + 1)) + min;
const pick = (random, values) => values[ri(random, 0, values.length - 1)];

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a || 1;
}

function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b);
}

// Simplify sqrt(n) -> { outside: a, inside: b } where n = a^2 * b
function simplifyRadical(n) {
  if (n <= 0) return { outside: 0, inside: 0 };
  let outside = 1;
  let inside = n;
  for (let i = 2; i * i <= inside; i++) {
    while (inside % (i * i) === 0) {
      outside *= i;
      inside /= (i * i);
    }
  }
  return { outside, inside };
}

function radicalToString(outside, inside) {
  if (inside === 0) return '0';
  if (inside === 1) return String(outside);
  if (outside === 1) return `\\sqrt{${inside}}`;
  if (outside === -1) return `-\\sqrt{${inside}}`;
  return `${outside}\\sqrt{${inside}}`;
}

// =============================================================================
// Chapter 01: 제곱근과 실수
// =============================================================================

// 1. [제곱근의 뜻과 성질] 제곱근의 정의 및 a의 제곱근 vs 제곱근 a 판별
export function rpmG9RadicalConcept(random) {
  const mode = pick(random, ['concept-true-false', 'calc-square-roots', 'square-of-neg']);
  if (mode === 'concept-true-false') {
    const a = pick(random, [16, 25, 36, 49, 64, 81, 100, 121, 144]);
    const r = Math.round(Math.sqrt(a));
    return {
      prompt: '다음 중 옳은 것을 고르시오.',
      promptEn: 'Which of the following statements is correct?',
      expression: '',
      choices: [
        { value: '1', label: '모든 실수의 제곱근은 항상 2개이다.' },
        { value: '2', label: '0의 제곱근은 없다.' },
        { value: '3', label: `${a}의 제곱근은 ${r}이다.` },
        { value: '4', label: '음수의 제곱근은 음수이다.' },
        { value: '5', label: `제곱근 ${a}는 ${r}이다.` }
      ],
      answer: '5',
      explanation: `① 양수의 제곱근은 2개(±), 0의 제곱근은 1개(0), 음수의 제곱근은 없습니다.\n② 0의 제곱근은 0입니다.\n③ ${a}의 제곱근은 ±${r}입니다.\n④ 음수의 제곱근은 실수 범위에서 존재하지 않습니다.\n⑤ '제곱근 ${a}'는 \\(\\sqrt{${a}} = ${r}\\)을 의미하므로 옳은 설명입니다.`,
      explanationEn: `'The square root of ${a}' means \\(\\sqrt{${a}} = ${r}\\), which is correct.`
    };
  }
  if (mode === 'square-of-neg') {
    const base = pick(random, [2, 8, 18]);
    const bA = base;
    const bB = -Math.round(Math.sqrt(2 * base));
    const finalAns = bA - bB;
    return {
      prompt: `\\((- ${base})^2\\)의 양의 제곱근을 \\(A\\), \\(\\sqrt{${(2 * base) ** 2}}\\)의 음의 제곱근을 \\(B\\)라 할 때, \\(A - B\\)의 값을 구하시오.`,
      promptEn: `Let A be the positive square root of \\((- ${base})^2\\), and B be the negative square root of \\(\\sqrt{${(2 * base) ** 2}}\\). Find \\(A - B\\).`,
      expression: `A = \\sqrt{(-${base})^2} = ${base}, \\quad \\sqrt{${(2 * base) ** 2}} = ${2 * base} \\implies B = -${Math.round(Math.sqrt(2 * base))}`,
      answer: String(finalAns),
      explanation: `\\((- ${base})^2 = ${base ** 2}\\)의 양의 제곱근은 \\(A = ${base}\\)입니다.\n\\(\\sqrt{${(2 * base) ** 2}} = ${2 * base}\\)의 음의 제곱근은 \\(B = -\\sqrt{${2 * base}} = -${Math.round(Math.sqrt(2 * base))}\\)입니다.\n따라서 \\(A - B = ${base} - (-${Math.round(Math.sqrt(2 * base))}) = ${finalAns}\\)입니다.`,
      explanationEn: `A = ${base} and B = -${Math.round(Math.sqrt(2 * base))}. Thus A - B = ${finalAns}.`
    };
  }
  const n1 = pick(random, [3, 4, 5, 6, 7]);
  const n2 = pick(random, [2, 3, 4, 5]);
  const ans = n1 + n2;
  return {
    prompt: `다음 식을 간단히 하시오.\n\\[ \\sqrt{(-${n1})^2} + \\left(\\sqrt{${n2}}\\right)^2 \\]`,
    promptEn: `Simplify the expression: \\(\\sqrt{(-${n1})^2} + (\\sqrt{${n2}})^2\\).`,
    expression: `\\sqrt{(-${n1})^2} + (\\sqrt{${n2}})^2 = ${n1} + ${n2} = ${ans}`,
    answer: String(ans),
    explanation: `\\(\\sqrt{(-${n1})^2} = |-${n1}| = ${n1}\\)이고, \\((\\sqrt{${n2}})^2 = ${n2}\\)입니다.\n따라서 \\(${n1} + ${n2} = ${ans}\\)입니다.`,
    explanationEn: `\\(\\sqrt{(-${n1})^2} = ${n1}\\) and \\((\\sqrt{${n2}})^2 = ${n2}\\), so \\(${n1} + ${n2} = ${ans}\\).`
  };
}

// 2. [근호 안의 식의 부호 판별]
export function rpmG9RadicalSignExtraction(random) {
  const mode = pick(random, ['a-negative', 'a-minus-b', 'double-interval']);
  if (mode === 'a-negative') {
    return {
      prompt: '\\(a < 0\\)일 때, 다음 식을 간단히 하시오.\n\\[ \\sqrt{a^2} - \\sqrt{(-3a)^2} + \\sqrt{16a^2} \\]',
      promptEn: 'If \\(a < 0\\), simplify \\(\\sqrt{a^2} - \\sqrt{(-3a)^2} + \\sqrt{16a^2}\\).',
      expression: '\\sqrt{a^2} - \\sqrt{(-3a)^2} + \\sqrt{(4a)^2}',
      answer: '-2a',
      explanation: '\\(a < 0\\)이므로:\n• \\(\\sqrt{a^2} = |a| = -a\\)\n• \\(-3a > 0\\)이므로 \\(\\sqrt{(-3a)^2} = |-3a| = -3a\\)\n• \\(4a < 0\\)이므로 \\(\\sqrt{16a^2} = \\sqrt{(4a)^2} = |4a| = -4a\\)\n따라서 준식은 \\((-a) - (-3a) + (-4a) = -a + 3a - 4a = -2a\\)입니다.',
      explanationEn: 'Since \\(a < 0\\), \\(|a| = -a\\), \\(|-3a| = -3a\\), and \\(|4a| = -4a\\). Combining yields \\(-2a\\).'
    };
  }
  if (mode === 'a-minus-b') {
    return {
      prompt: '\\(a > b\\), \\(ab < 0\\)일 때, 다음 식을 간단히 하시오.\n\\[ \\sqrt{(a-b)^2} - \\sqrt{4a^2} + \\sqrt{(-2b)^2} \\]',
      promptEn: 'Given \\(a > b\\) and \\(ab < 0\\), simplify \\(\\sqrt{(a-b)^2} - \\sqrt{4a^2} + \\sqrt{(-2b)^2}\\).',
      expression: 'a > 0, b < 0 \\implies a-b > 0',
      answer: '-a-3b',
      explanation: '\\(a > b\\)이고 \\(ab < 0\\)이므로 \\(a > 0\\), \\(b < 0\\)입니다.\n• \\(a - b > 0\\)이므로 \\(\\sqrt{(a-b)^2} = a - b\\)\n• \\(a > 0\\)이므로 \\(\\sqrt{4a^2} = \\sqrt{(2a)^2} = 2a\\)\n• \\(b < 0\\)이므로 \\(-2b > 0\\), 따라서 \\(\\sqrt{(-2b)^2} = -2b\\)\n준식은 \\((a - b) - 2a + (-2b) = -a - 3b\\)입니다.',
      explanationEn: 'Since \\(a > 0\\) and \\(b < 0\\), \\(a - b > 0\\) and \\(-2b > 0\\). The result is \\(-a - 3b\\).'
    };
  }
  const c = ri(random, 1, 4);
  const d = c + ri(random, 2, 4);
  return {
    prompt: `\\(${c} < x < ${d}\\)일 때, 다음 식을 간단히 하시오.\n\\[ \\sqrt{(x - ${c})^2} + \\sqrt{(x - ${d})^2} \\]`,
    promptEn: `If \\(${c} < x < ${d}\\), simplify \\(\\sqrt{(x - ${c})^2} + \\sqrt{(x - ${d})^2}\\).`,
    expression: `x - ${c} > 0, \\quad x - ${d} < 0`,
    answer: String(d - c),
    explanation: `\\(${c} < x < ${d}\\)이므로 \\(x - ${c} > 0\\), \\(x - ${d} < 0\\)입니다.\n따라서 \\(\\sqrt{(x - ${c})^2} = x - ${c}\\)이고,\n\\(\\sqrt{(x - ${d})^2} = -(x - ${d}) = -x + ${d}\\)입니다.\n두 식을 더하면 \\((x - ${c}) + (-x + ${d}) = ${d} - ${c} = ${d - c}\\)입니다.`,
    explanationEn: `\\(x - ${c} > 0\\) and \\(x - ${d} < 0\\), so \\((x - ${c}) - (x - ${d}) = ${d - c}\\).`
  };
}

// 3. [근호 안이 자연수가 될 조건]
export function rpmG9RadicalNaturalCondition(random) {
  const mode = pick(random, ['multiply', 'divide']);
  if (mode === 'multiply') {
    const candidates = [
      { a: 24, mult: 6, primeExp: '2^3 \\times 3' },
      { a: 45, mult: 5, primeExp: '3^2 \\times 5' },
      { a: 54, mult: 6, primeExp: '2 \\times 3^3' },
      { a: 72, mult: 2, primeExp: '2^3 \\times 3^2' },
      { a: 84, mult: 21, primeExp: '2^2 \\times 3 \\times 7' },
      { a: 120, mult: 30, primeExp: '2^3 \\times 3 \\times 5' },
      { a: 150, mult: 6, primeExp: '2 \\times 3 \\times 5^2' }
    ];
    const item = pick(random, candidates);
    return {
      prompt: `\\(\\sqrt{${item.a}x}\\)가 자연수가 되도록 하는 가장 작은 자연수 \\(x\\)의 값을 구하시오.`,
      promptEn: `Find the smallest natural number \\(x\\) such that \\(\\sqrt{${item.a}x}\\) is a natural number.`,
      expression: `${item.a} = ${item.primeExp}`,
      answer: String(item.mult),
      explanation: `\\(${item.a}\\)를 소인수분해하면 \\(${item.a} = ${item.primeExp}\\)입니다.\n근호 안의 수가 어떤 자연수의 제곱이 되려면 모든 소인수의 지수가 짝수이어야 합니다.\n따라서 지수가 홀수인 소인수를 짝수로 만들어 주기 위한 가장 작은 자연수 \\(x\\)는 \\(${item.mult}\\)입니다.`,
      explanationEn: `Factoring ${item.a} yields ${item.primeExp}. To make every exponent even, the smallest multiplier is ${item.mult}.`
    };
  }
  const divCandidates = [
    { a: 180, div: 5, primeExp: '2^2 \\times 3^2 \\times 5' },
    { a: 200, div: 2, primeExp: '2^3 \\times 5^2' },
    { a: 300, div: 3, primeExp: '2^2 \\times 3 \\times 5^2' },
    { a: 75, div: 3, primeExp: '3 \\times 5^2' },
    { a: 112, div: 7, primeExp: '2^4 \\times 7' }
  ];
  const item = pick(random, divCandidates);
  return {
    prompt: `\\(\\sqrt{\\frac{${item.a}}{x}}\\)가 자연수가 되도록 하는 가장 작은 자연수 \\(x\\)의 값을 구하시오.`,
    promptEn: `Find the smallest natural number \\(x\\) such that \\(\\sqrt{\\frac{${item.a}}{x}}\\) is a natural number.`,
    expression: `${item.a} = ${item.primeExp}`,
    answer: String(item.div),
    explanation: `\\(${item.a}\\)를 소인수분해하면 \\(${item.a} = ${item.primeExp}\\)입니다.\n나누어서 지수를 모두 짝수로 만들어야 하므로, 홀수 차수를 가진 소인수를 나누어 없애야 합니다.\n따라서 가장 작은 자연수 \\(x\\)는 \\(${item.div}\\)입니다.`,
    explanationEn: `Factoring ${item.a} gives ${item.primeExp}. Dividing by ${item.div} leaves only even powers.`
  };
}

// 4. [근호 덧셈/뺄셈형 자연수 조건]
export function rpmG9RadicalAddSubCondition(random) {
  const mode = pick(random, ['add', 'sub']);
  if (mode === 'add') {
    const n = ri(random, 20, 80);
    const nextSq = Math.ceil(Math.sqrt(n + 1)) ** 2;
    const x = nextSq - n;
    return {
      prompt: `\\(\\sqrt{${n} + x}\\)가 자연수가 되도록 하는 가장 작은 자연수 \\(x\\)의 값을 구하시오.`,
      promptEn: `Find the smallest natural number \\(x\\) such that \\(\\sqrt{${n} + x}\\) is a natural number.`,
      expression: `\\sqrt{${n} + x} = \\sqrt{${nextSq}} = ${Math.round(Math.sqrt(nextSq))}`,
      answer: String(x),
      explanation: `\\(${n} + x\\)가 어떤 자연수의 제곱수이어야 하므로, \\(${n}\\)보다 큰 제곱수 중 가장 작은 수는 \\(${nextSq}\\)입니다.\n따라서 \\(${n} + x = ${nextSq}\\)에서 \\(x = ${nextSq} - ${n} = ${x}\\)입니다.`,
      explanationEn: `The smallest square greater than ${n} is ${nextSq}. Hence \\(x = ${nextSq} - ${n} = ${x}\\).`
    };
  }
  const n = pick(random, [26, 38, 50, 67, 85, 102]);
  const prevSq = Math.floor(Math.sqrt(n - 1)) ** 2;
  const x = n - prevSq;
  return {
    prompt: `\\(\\sqrt{${n} - x}\\)가 자연수가 되도록 하는 가장 작은 자연수 \\(x\\)의 값을 구하시오.`,
    promptEn: `Find the smallest natural number \\(x\\) such that \\(\\sqrt{${n} - x}\\) is a natural number.`,
    expression: `\\sqrt{${n} - x} = \\sqrt{${prevSq}} = ${Math.round(Math.sqrt(prevSq))}`,
    answer: String(x),
    explanation: `\\(${n} - x\\)가 어떤 자연수의 제곱수이어야 하므로, \\(${n}\\)보다 작은 제곱수 중 가장 큰 수는 \\(${prevSq}\\)입니다.\n따라서 \\(${n} - x = ${prevSq}\\)에서 \\(x = ${n} - ${prevSq} = ${x}\\)입니다.`,
    explanationEn: `The largest square less than ${n} is ${prevSq}. Thus \\(x = ${n} - ${prevSq} = ${x}\\).`
  };
}

// 5. [제곱근의 대소 비교 및 부등식 만족 정수 개수]
export function rpmG9RadicalInequalityCount(random) {
  const a = ri(random, 2, 5);
  const b = a + ri(random, 1, 3);
  const count = (b * b - 1) - (a * a);
  return {
    prompt: `부등식 \\(${a} < \\sqrt{x} < ${b}\\)를 만족시키는 자연수 \\(x\\)의 개수를 구하시오.`,
    promptEn: `Find the number of natural numbers \\(x\\) satisfying \\(${a} < \\sqrt{x} < ${b}\\).`,
    expression: `${a}^2 < x < ${b}^2 \\implies ${a * a} < x < ${b * b}`,
    answer: String(count),
    explanation: `각 변을 모두 제곱하면 \\(${a}^2 < x < ${b}^2\\), 즉 \\(${a * a} < x < ${b * b}\\)입니다.\n이를 만족시키는 자연수 \\(x\\)의 개수는 \\((${b * b} - 1) - (${a * a} + 1) + 1 = ${b * b} - ${a * a} - 1 = ${count}\\)개입니다.`,
    explanationEn: `Squaring all sides gives \\(${a * a} < x < ${b * b}\\). The count of integers is ${count}.`
  };
}

// 6. [무리수의 수직선 대응]
export function rpmG9RadicalNumberLineCoord(random) {
  const pivot = ri(random, -3, 3);
  const a = ri(random, 1, 3);
  const b = ri(random, 1, 3);
  const hypSq = a * a + b * b;
  const dir = pick(random, ['left', 'right']);
  const sign = dir === 'right' ? '+' : '-';
  const point = dir === 'right' ? `${pivot}+\\sqrt{${hypSq}}` : `${pivot}-\\sqrt{${hypSq}}`;
  return {
    prompt: `수직선 위의 점 \\(A(${pivot})\\)를 기준으로 가로의 길이가 \\(${a}\\), 세로의 길이가 \\(${b}\\)인 직각삼각형의 빗변을 반지름으로 하여 원을 그릴 때, 점 \\(A\\)에서 ${dir === 'right' ? '오른쪽' : '왼쪽'}으로 호가 수직선과 만나는 점 \\(P\\)에 대응하는 수를 구하시오.`,
    promptEn: `Starting from point A(${pivot}) on the number line, a circular arc with radius equal to the hypotenuse of a right triangle with legs ${a} and ${b} intersects the number line to the ${dir}. Find the coordinate of point P.`,
    expression: `r = \\sqrt{${a}^2 + ${b}^2} = \\sqrt{${hypSq}}, \\quad P = ${pivot} ${sign} \\sqrt{${hypSq}}`,
    answer: point,
    explanation: `직각삼각형의 빗변의 길이는 피타고라스 정리에 의해 \\(\\sqrt{${a}^2 + ${b}^2} = \\sqrt{${hypSq}}\\)입니다.\n기준점 \\(A\\)의 좌표가 \\(${pivot}\\)이고 점 \\(P\\)는 점 \\(A\\)에서 ${dir === 'right' ? '오른쪽(+)' : '왼쪽(-)'}에 있으므로 대응하는 수는 \\(${pivot} ${sign} \\sqrt{${hypSq}}\\)입니다.`,
    explanationEn: `The hypotenuse length is \\(\\sqrt{${hypSq}}\\). Extending to the ${dir} gives \\(${point}\\).`
  };
}

// 7. [무리수의 정수 부분과 소수 부분]
export function rpmG9RadicalIntDecParts(random) {
  const n = pick(random, [5, 6, 7, 8, 10, 11, 12, 13, 14, 15]);
  const intPart = Math.floor(Math.sqrt(n));
  return {
    prompt: `\\(\\sqrt{${n}}\\)의 정수 부분을 \\(a\\), 소수 부분을 \\(b\\)라 할 때, \\(b^2 + ${2 * intPart}b\\)의 값을 구하시오.`,
    promptEn: `Let the integer part of \\(\\sqrt{${n}}\\) be \\(a\\), and the fractional part be \\(b\\). Find \\(b^2 + ${2 * intPart}b\\).`,
    expression: `b = \\sqrt{${n}} - ${intPart} \\implies b + ${intPart} = \\sqrt{${n}}`,
    answer: String(n - intPart * intPart),
    explanation: `\\(${intPart}^2 < ${n} < ${intPart + 1}^2\\)이므로 \\(${intPart} < \\sqrt{${n}} < ${intPart + 1}\\)입니다.\n따라서 정수 부분 \\(a = ${intPart}\\)이고, 소수 부분 \\(b = \\sqrt{${n}} - ${intPart}\\)입니다.\n\\(b + ${intPart} = \\sqrt{${n}}\\)의 양변을 제곱하면 \\((b + ${intPart})^2 = ${n}\\)이므로\n\\[ b^2 + ${2 * intPart}b + ${intPart * intPart} = ${n} \\implies b^2 + ${2 * intPart}b = ${n} - ${intPart * intPart} = ${n - intPart * intPart} \\]입니다.`,
    explanationEn: `Since \\(b = \\sqrt{${n}} - ${intPart}\\), \\(b + ${intPart} = \\sqrt{${n}}\\). Squaring both sides yields \\(b^2 + ${2 * intPart}b = ${n - intPart * intPart}\\).`
  };
}

// 8. [Ch 01 종합 실전]
export function rpmG9RadicalsRealAllMixed(random) {
  const fns = [
    rpmG9RadicalConcept,
    rpmG9RadicalSignExtraction,
    rpmG9RadicalNaturalCondition,
    rpmG9RadicalAddSubCondition,
    rpmG9RadicalInequalityCount,
    rpmG9RadicalNumberLineCoord,
    rpmG9RadicalIntDecParts
  ];
  return pick(random, fns)(random);
}

// =============================================================================
// Chapter 02: 근호를 포함한 식의 계산
// =============================================================================

// 1. [제곱근의 곱셈과 나눗셈 및 a sqrt(b) 변환]
export function rpmG9RadicalOpsMultDiv(random) {
  const a = ri(random, 2, 6);
  const b = ri(random, 2, 5);
  const c = ri(random, 2, 4);
  const totalIn = a * b * c;
  const simp = simplifyRadical(totalIn);
  return {
    prompt: `다음 식을 간단히 하여 \\(a\\sqrt{b}\\) 꼴로 나타낼 때, 유리수 \\(a, b\\)에 대하여 \\(a + b\\)의 값을 구하시오. (단, \\(b\\)는 가장 작은 자연수)\n\\[ \\sqrt{${a * b}} \\times \\sqrt{${c}} \\]`,
    promptEn: `Simplify \\(\\sqrt{${a * b}} \\times \\sqrt{${c}}\\) into \\(a\\sqrt{b}\\). Find \\(a + b\\) where \\(b\\) is the smallest square-free integer.`,
    expression: `\\sqrt{${a * b} \\times ${c}} = \\sqrt{${totalIn}} = ${radicalToString(simp.outside, simp.inside)}`,
    answer: String(simp.outside + simp.inside),
    explanation: `\\(\\sqrt{${a * b}} \\times \\sqrt{${c}} = \\sqrt{${a * b} \\times ${c}} = \\sqrt{${totalIn}}\\)입니다.\n\\(${totalIn} = ${simp.outside}^2 \\times ${simp.inside}\\)이므로 \\(${radicalToString(simp.outside, simp.inside)}\\)입니다.\n따라서 \\(a = ${simp.outside}\\), \\(b = ${simp.inside}\\)이므로 \\(a + b = ${simp.outside + simp.inside}\\)입니다.`,
    explanationEn: `\\(\\sqrt{${totalIn}} = ${simp.outside}\\sqrt{${simp.inside}}\\). Thus \\(a + b = ${simp.outside + simp.inside}\\).`
  };
}

// 2. [분모의 유리화]
export function rpmG9RadicalOpsRationalize(random) {
  const root = pick(random, [2, 3, 5, 6, 7]);
  const mult = ri(random, 2, 6);
  const numerator = mult * root;
  return {
    prompt: `\\(\\frac{${numerator}}{\\sqrt{${root}}}\\)의 분모를 유리화하여 간단히 하시오.`,
    promptEn: `Rationalize the denominator of \\(\\frac{${numerator}}{\\sqrt{${root}}}\\).`,
    expression: `\\frac{${numerator}\\sqrt{${root}}}{${root}} = ${mult}\\sqrt{${root}}`,
    answer: `${mult}\\sqrt{${root}}`,
    explanation: `분모와 분자에 각각 \\(\\sqrt{${root}}\\)을 곱하면:\n\\[ \\frac{${numerator} \\times \\sqrt{${root}}}{\\sqrt{${root}} \\times \\sqrt{${root}}} = \\frac{${numerator}\\sqrt{${root}}}{${root}} = ${mult}\\sqrt{${root}} \\]입니다.`,
    explanationEn: `Multiplying numerator and denominator by \\(\\sqrt{${root}}\\) gives \\(${mult}\\sqrt{${root}}\\).`
  };
}

// 3. [제곱근의 덧셈과 뺄셈 동류항 정리]
export function rpmG9RadicalOpsAddSub(random) {
  const prime = pick(random, [2, 3, 5]);
  const c1 = ri(random, 2, 5);
  const c2 = ri(random, 1, 4);
  const c3 = ri(random, 1, 3);
  const n1 = c1 * c1 * prime;
  const n2 = c2 * c2 * prime;
  const coeffResult = c1 + c2 - c3;
  return {
    prompt: `다음 식을 계산하여 \\(k\\sqrt{${prime}}\\) 꼴로 나타낼 때, 유리수 \\(k\\)의 값을 구하시오.\n\\[ \\sqrt{${n1}} + \\sqrt{${n2}} - ${c3}\\sqrt{${prime}} \\]`,
    promptEn: `Simplify \\(\\sqrt{${n1}} + \\sqrt{${n2}} - ${c3}\\sqrt{${prime}}\\) to \\(k\\sqrt{${prime}}\\). Find \\(k\\).`,
    expression: `${c1}\\sqrt{${prime}} + ${c2}\\sqrt{${prime}} - ${c3}\\sqrt{${prime}} = ${coeffResult}\\sqrt{${prime}}`,
    answer: String(coeffResult),
    explanation: `각 근호를 간단히 하면:\n• \\(\\sqrt{${n1}} = ${c1}\\sqrt{${prime}}\\)\n• \\(\\sqrt{${n2}} = ${c2}\\sqrt{${prime}}\\)\n따라서 준식은 \\(${c1}\\sqrt{${prime}} + ${c2}\\sqrt{${prime}} - ${c3}\\sqrt{${prime}} = (${c1} + ${c2} - ${c3})\\sqrt{${prime}} = ${coeffResult}\\sqrt{${prime}}\\)입니다.\n그러므로 \\(k = ${coeffResult}\\)입니다.`,
    explanationEn: `Simplifying radicals gives \\((${c1} + ${c2} - ${c3})\\sqrt{${prime}} = ${coeffResult}\\sqrt{${prime}}\\), so \\(k = ${coeffResult}\\).`
  };
}

// 4. [도형에서의 제곱근 활용]
export function rpmG9RadicalOpsGeometry(random) {
  const wSq = pick(random, [12, 18, 20, 24, 27, 32, 48]);
  const hSq = pick(random, [8, 12, 18, 20]);
  const simpArea = simplifyRadical(wSq * hSq);
  return {
    prompt: `가로의 길이가 \\(\\sqrt{${wSq}}\\)이고 세로의 길이가 \\(\\sqrt{${hSq}}\\)인 직사각형의 넓이를 \\(a\\sqrt{b}\\) 꼴로 나타낼 때, \\(a + b\\)의 값을 구하시오. (단, \\(b\\)는 가장 작은 자연수)`,
    promptEn: `Express the area of a rectangle with sides \\(\\sqrt{${wSq}}\\) and \\(\\sqrt{${hSq}}\\) as \\(a\\sqrt{b}\\). Find \\(a + b\\).`,
    expression: `\\sqrt{${wSq * hSq}} = ${radicalToString(simpArea.outside, simpArea.inside)}`,
    answer: String(simpArea.outside + simpArea.inside),
    explanation: `직사각형의 넓이는 \\(\\sqrt{${wSq}} \\times \\sqrt{${hSq}} = \\sqrt{${wSq * hSq}} = ${radicalToString(simpArea.outside, simpArea.inside)}\\)입니다.\n따라서 \\(a = ${simpArea.outside}\\), \\(b = ${simpArea.inside}\\)이므로 \\(a + b = ${simpArea.outside + simpArea.inside}\\)입니다.`,
    explanationEn: `Area is \\(${radicalToString(simpArea.outside, simpArea.inside)}\\), so \\(a + b = ${simpArea.outside + simpArea.inside}\\).`
  };
}

// 5. [Ch 02 종합 실전]
export function rpmG9RadicalOperationsAllMixed(random) {
  const fns = [
    rpmG9RadicalOpsMultDiv,
    rpmG9RadicalOpsRationalize,
    rpmG9RadicalOpsAddSub,
    rpmG9RadicalOpsGeometry
  ];
  return pick(random, fns)(random);
}

// =============================================================================
// Chapter 03: 다항식의 곱셈
// =============================================================================

// 1. [완전제곱식과 계수 찾기] (ax + b)^2
export function rpmG9PolyMultSquare(random) {
  const a = ri(random, 1, 3);
  const b = ri(random, 2, 5);
  const sign = pick(random, ['+', '-']);
  const sNum = sign === '+' ? 1 : -1;
  const a2 = a * a;
  const mid = 2 * a * b * sNum;
  const b2 = b * b;
  const expr = a === 1 ? `(x ${sign} ${b})^2` : `(${a}x ${sign} ${b})^2`;
  return {
    prompt: `다항식 \\(${expr}\\)을 전개하였을 때, \\(x\\)의 계수를 \\(A\\), 상수항을 \\(B\\)라 하자. \\(A + B\\)의 값을 구하시오.`,
    promptEn: `When expanding \\(${expr}\\), let \\(A\\) be the coefficient of \\(x\\) and \\(B\\) the constant term. Find \\(A + B\\).`,
    expression: `${expr} = ${a2 === 1 ? '' : a2}x^2 ${mid >= 0 ? '+' : ''}${mid}x + ${b2}`,
    answer: String(mid + b2),
    explanation: `완전제곱식 전개 공식 \\((ax + b)^2 = a^2x^2 + 2abx + b^2\\)에 의하여:\n\\[ ${expr} = ${a2 === 1 ? '' : a2}x^2 ${mid >= 0 ? '+' : ''}${mid}x + ${b2} \\]입니다.\n따라서 \\(x\\)의 계수 \\(A = ${mid}\\), 상수항 \\(B = ${b2}\\)이므로 \\(A + B = ${mid} + ${b2} = ${mid + b2}\\)입니다.`,
    explanationEn: `Expanding gives \\(${a2 === 1 ? '' : a2}x^2 ${mid >= 0 ? '+' : ''}${mid}x + ${b2}\\). Thus \\(A + B = ${mid + b2}\\).`
  };
}

// 2. [합차 공식과 연속 합차]
export function rpmG9PolyMultDiffSquares(random) {
  const a = ri(random, 2, 5);
  const b = ri(random, 1, 4);
  const a2 = a * a;
  const b2 = b * b;
  return {
    prompt: `다음 식을 전개하시오.\n\\[ (${a}x + ${b})(${a}x - ${b}) \\]`,
    promptEn: `Expand \\((${a}x + ${b})(${a}x - ${b})\\).`,
    expression: `(${a}x)^2 - ${b}^2 = ${a2}x^2 - ${b2}`,
    answer: `${a2}x^2-${b2}`,
    explanation: `합차 공식 \\((A + B)(A - B) = A^2 - B^2\\)에 의하여:\n\\[ (${a}x + ${b})(${a}x - ${b}) = (${a}x)^2 - ${b}^2 = ${a2}x^2 - ${b2} \\]입니다.`,
    explanationEn: `Using \\((A + B)(A - B) = A^2 - B^2\\), we obtain \\(${a2}x^2 - ${b2}\\).`
  };
}

// 3. [곱셈 공식을 이용한 수의 계산]
export function rpmG9PolyMultNumCalc(random) {
  const base = pick(random, [50, 100, 200]);
  const diff = ri(random, 1, 4);
  const num = base + diff;
  const ans = num * num;
  return {
    prompt: `곱셈 공식을 이용하여 \\(${num}^2\\)을 계산하시오.`,
    promptEn: `Compute \\(${num}^2\\) using algebraic identities.`,
    expression: `(${base} + ${diff})^2 = ${base}^2 + 2 \\times ${base} \\times ${diff} + ${diff}^2 = ${ans}`,
    answer: String(ans),
    explanation: `\\(${num}^2 = (${base} + ${diff})^2 = ${base}^2 + 2 \\times ${base} \\times ${diff} + ${diff}^2 = ${base * base} + ${2 * base * diff} + ${diff * diff} = ${ans}\\)입니다.`,
    explanationEn: `\\((${base} + ${diff})^2 = ${base * base} + ${2 * base * diff} + ${diff * diff} = ${ans}\\).`
  };
}

// 4. [곱셈 공식의 변형]
export function rpmG9PolyMultTransform(random) {
  const sum = ri(random, 3, 7);
  const prod = ri(random, 1, 4);
  const sqSum = sum * sum - 2 * prod;
  return {
    prompt: `\\(x + y = ${sum}\\), \\(xy = ${prod}\\)일 때, \\(x^2 + y^2\\)의 값을 구하시오.`,
    promptEn: `If \\(x + y = ${sum}\\) and \\(xy = ${prod}\\), find the value of \\(x^2 + y^2\\).`,
    expression: `x^2 + y^2 = (x+y)^2 - 2xy = ${sum}^2 - 2(${prod}) = ${sqSum}`,
    answer: String(sqSum),
    explanation: `곱셈 공식의 변형에 의하여:\n\\[ x^2 + y^2 = (x + y)^2 - 2xy = ${sum}^2 - 2 \\times ${prod} = ${sum * sum} - ${2 * prod} = ${sqSum} \\]입니다.`,
    explanationEn: `\\(x^2 + y^2 = (x + y)^2 - 2xy = ${sum * sum} - ${2 * prod} = ${sqSum}\\).`
  };
}

// 5. [Ch 03 종합 실전]
export function rpmG9PolynomialMultAllMixed(random) {
  const fns = [
    rpmG9PolyMultSquare,
    rpmG9PolyMultDiffSquares,
    rpmG9PolyMultNumCalc,
    rpmG9PolyMultTransform
  ];
  return pick(random, fns)(random);
}

// =============================================================================
// Chapter 04: 인수분해
// =============================================================================

// 1. [완전제곱식 조건] 상수항 = (b/2)^2
export function rpmG9FactorPerfectSquare(random) {
  const half = ri(random, 2, 7);
  const b = 2 * half;
  const c = half * half;
  return {
    prompt: `이차식 \\(x^2 + ${b}x + k\\)가 완전제곱식이 되도록 하는 상수 \\(k\\)의 값을 구하시오.`,
    promptEn: `Find the constant \\(k\\) such that \\(x^2 + ${b}x + k\\) is a perfect square trinomial.`,
    expression: `k = \\left(\\frac{${b}}{2}\\right)^2 = ${half}^2 = ${c}`,
    answer: String(c),
    explanation: `\\(x^2 + bx + c\\)가 완전제곱식이 될 조건은 \\(c = \\left(\\frac{b}{2}\\right)^2\\)입니다.\n따라서 \\(k = \\left(\\frac{${b}}{2}\\right)^2 = ${half}^2 = ${c}\\)입니다.`,
    explanationEn: `For \\(x^2 + bx + k\\) to be a perfect square, \\(k = (b/2)^2 = ${c}\\).`
  };
}

// 2. [크로스 인수분해] x^2 + (a+b)x + ab
export function rpmG9FactorTrinomial(random) {
  const p = ri(random, 1, 6);
  const q = ri(random, 1, 6) * (pick(random, [1, -1]));
  const sum = p + q;
  const prod = p * q;
  const sumStr = sum >= 0 ? `+ ${sum}x` : `- ${Math.abs(sum)}x`;
  const prodStr = prod >= 0 ? `+ ${prod}` : `- ${Math.abs(prod)}`;
  const factorP = p >= 0 ? `(x + ${p})` : `(x - ${Math.abs(p)})`;
  const factorQ = q >= 0 ? `(x + ${q})` : `(x - ${Math.abs(q)})`;
  return {
    prompt: `다항식 \\(x^2 ${sumStr} ${prodStr}\\)을 인수분해하였을 때, 두 일차식의 인수의 합을 구하시오.`,
    promptEn: `Factor \\(x^2 ${sumStr} ${prodStr}\\). What is the sum of its two linear factors?`,
    expression: `x^2 ${sumStr} ${prodStr} = ${factorP}${factorQ}`,
    answer: `2x${sum >= 0 ? '+' : ''}${sum}`,
    explanation: `합이 \\(${sum}\\)이고 곱이 \\(${prod}\\)인 두 정수는 \\(${p}\\)와 \\(${q}\\)입니다.\n따라서 \\(x^2 ${sumStr} ${prodStr} = ${factorP}${factorQ}\\)로 인수분해됩니다.\n두 인수의 합은 \\((x + ${p}) + (x + ${q}) = 2x ${sum >= 0 ? '+' : ''}${sum}\\)입니다.`,
    explanationEn: `The factors are ${factorP} and ${factorQ}. Their sum is \\(2x + ${sum}\\).`
  };
}

// 3. [인수분해를 이용한 수의 계산]
export function rpmG9FactorNumCalc(random) {
  const a = ri(random, 55, 95);
  const b = a - 2;
  const ans = (a + b) * (a - b);
  return {
    prompt: `인수분해 공식을 이용하여 다음 식의 값을 구하시오.\n\\[ ${a}^2 - ${b}^2 \\]`,
    promptEn: `Evaluate \\(${a}^2 - ${b}^2\\) using factorization.`,
    expression: `(${a} + ${b})(${a} - ${b}) = ${a + b} \\times ${a - b} = ${ans}`,
    answer: String(ans),
    explanation: `합차 공식 \\(A^2 - B^2 = (A + B)(A - B)\\)을 이용하면:\n\\[ ${a}^2 - ${b}^2 = (${a} + ${b})(${a} - ${b}) = ${a + b} \\times ${a - b} = ${ans} \\]입니다.`,
    explanationEn: `\\((${a} + ${b})(${a} - ${b}) = ${a + b} \\times 2 = ${ans}\\).`
  };
}

// 4. [인수분해를 이용한 식의 값]
export function rpmG9FactorSubstitutionValue(random) {
  const xVal = ri(random, 11, 25);
  const k = ri(random, 1, 5);
  const ans = (xVal - k) ** 2;
  return {
    prompt: `\\(x = ${xVal}\\)일 때, 다음 식의 값을 인수분해 공식을 이용하여 구하시오.\n\\[ x^2 - ${2 * k}x + ${k * k} \\]`,
    promptEn: `When \\(x = ${xVal}\\), evaluate \\(x^2 - ${2 * k}x + ${k * k}\\) using factoring.`,
    expression: `x^2 - ${2 * k}x + ${k * k} = (x - ${k})^2 = (${xVal} - ${k})^2 = ${ans}`,
    answer: String(ans),
    explanation: `준식을 인수분해하면 \\(x^2 - ${2 * k}x + ${k * k} = (x - ${k})^2\\)입니다.\n\\(x = ${xVal}\\)를 대입하면 \\((${xVal} - ${k})^2 = ${xVal - k}^2 = ${ans}\\)입니다.`,
    explanationEn: `Factoring gives \\((x - ${k})^2\\). Substituting \\(x = ${xVal}\\) yields \\(${ans}\\).`
  };
}

// 5. [Ch 04 종합 실전]
export function rpmG9FactorizationAllMixed(random) {
  const fns = [
    rpmG9FactorPerfectSquare,
    rpmG9FactorTrinomial,
    rpmG9FactorNumCalc,
    rpmG9FactorSubstitutionValue
  ];
  return pick(random, fns)(random);
}

// =============================================================================
// Chapter 05: 이차방정식의 풀이
// =============================================================================

// 1. [이차방정식의 해와 미지수 구하기]
export function rpmG9QuadGivenRoot(random) {
  const r1 = ri(random, 1, 5);
  const r2 = ri(random, -5, -1);
  const sum = -(r1 + r2);
  const prod = r1 * r2;
  return {
    prompt: `이차방정식 \\(x^2 ${sum >= 0 ? '+' : ''}${sum}x + a = 0\\)의 한 근이 \\(x = ${r1}\\)일 때, 상수 \\(a\\)의 값과 다른 한 근 \\(b\\)에 대하여 \\(a + b\\)의 값을 구하시오.`,
    promptEn: `Given that \\(x = ${r1}\\) is a root of \\(x^2 + ${sum}x + a = 0\\), find \\(a + b\\) where \\(b\\) is the other root.`,
    expression: `${r1}^2 + ${sum}(${r1}) + a = 0 \\implies a = ${prod}, \\quad b = ${r2}`,
    answer: String(prod + r2),
    explanation: `\\(x = ${r1}\\)을 방정식에 대입하면 \\(${r1}^2 + (${sum})(${r1}) + a = 0\\)에서 \\(${r1 * r1 + sum * r1} + a = 0\\), 즉 \\(a = ${prod}\\)입니다.\n이차방정식 \\(x^2 ${sum >= 0 ? '+' : ''}${sum}x + ${prod} = 0\\)을 인수분해하면 \\((x - ${r1})(x - ${r2}) = 0\\)이므로 다른 한 근은 \\(b = ${r2}\\)입니다.\n따라서 \\(a + b = ${prod} + (${r2}) = ${prod + r2}\\)입니다.`,
    explanationEn: `Substituting \\(x = ${r1}\\) gives \\(a = ${prod}\\). The other root is \\(b = ${r2}\\). Thus \\(a + b = ${prod + r2}\\).`
  };
}

// 2. [중근 조건]
export function rpmG9QuadDoubleRoot(random) {
  const root = ri(random, 2, 7) * pick(random, [1, -1]);
  const b = -2 * root;
  const c = root * root;
  return {
    prompt: `이차방정식 \\(x^2 ${b >= 0 ? '+' : ''}${b}x + k = 0\\)이 중근을 가질 때, 상수 \\(k\\)의 값과 그 중근 \\(m\\)에 대하여 \\(k + m\\)의 값을 구하시오.`,
    promptEn: `If \\(x^2 + ${b}x + k = 0\\) has a double root, find \\(k + m\\) where \\(m\\) is the double root.`,
    expression: `k = \\left(\\frac{${b}}{2}\\right)^2 = ${c}, \\quad (x - ${root})^2 = 0 \\implies m = ${root}`,
    answer: String(c + root),
    explanation: `이차방정식이 중근을 가지려면 완전제곱식이 되어야 하므로:\n\\[ k = \\left(\\frac{${b}}{2}\\right)^2 = (${-root})^2 = ${c} \\]입니다.\n이때 방정식은 \\((x - ${root})^2 = 0\\)이므로 중근은 \\(m = ${root}\\)입니다.\n따라서 \\(k + m = ${c} + ${root} = ${c + root}\\)입니다.`,
    explanationEn: `\\(k = (b/2)^2 = ${c}\\) and the double root is \\(m = ${root}\\). Thus \\(k + m = ${c + root}\\).`
  };
}

// 3. [제곱근을 이용한 풀이]
export function rpmG9QuadSquareRootForm(random) {
  const p = ri(random, 1, 5) * pick(random, [1, -1]);
  const q = pick(random, [2, 3, 5, 6, 7]);
  return {
    prompt: `이차방정식 \\((x ${p >= 0 ? '+' : ''}${p})^2 = ${q}\\)의 두 근 중 큰 근을 \\(\\alpha\\), 작은 근을 \\(\\beta\\)라 할 때, \\(\\alpha - \\beta\\)의 값을 구하시오.`,
    promptEn: `For \\((x + ${p})^2 = ${q}\\), let \\(\\alpha > \\beta\\) be the roots. Find \\(\\alpha - \\beta\\).`,
    expression: `x = ${-p} \\pm \\sqrt{${q}} \\implies \\alpha - \\beta = 2\\sqrt{${q}}`,
    answer: `2\\sqrt{${q}}`,
    explanation: `제곱근을 이용하면 \\(x ${p >= 0 ? '+' : ''}${p} = \\pm\\sqrt{${q}}\\)이므로 \\(x = ${-p} \\pm \\sqrt{${q}}\\)입니다.\n큰 근은 \\(\\alpha = ${-p} + \\sqrt{${q}}\\), 작은 근은 \\(\\beta = ${-p} - \\sqrt{${q}}\\)이므로\n\\(\\alpha - \\beta = (${-p} + \\sqrt{${q}}) - (${-p} - \\sqrt{${q}}) = 2\\sqrt{${q}}\\)입니다.`,
    explanationEn: `\\(\\alpha - \\beta = (-p + \\sqrt{q}) - (-p - \\sqrt{q}) = 2\\sqrt{q}\\).`
  };
}

// 4. [근의 공식]
export function rpmG9QuadQuadraticFormula(random) {
  const b = pick(random, [1, 3, 5]);
  const c = -pick(random, [1, 2, 3]);
  const disc = b * b - 4 * c;
  return {
    prompt: `이차방정식 \\(x^2 - ${b}x + (${c}) = 0\\)을 근의 공식을 이용하여 풀었을 때, \\(x = \\frac{A \\pm \\sqrt{B}}{2}\\)이다. 유리수 \\(A, B\\)에 대하여 \\(A + B\\)의 값을 구하시오.`,
    promptEn: `Solve \\(x^2 - ${b}x + ${c} = 0\\) with the quadratic formula to get \\(x = \\frac{A \\pm \\sqrt{B}}{2}\\). Find \\(A + B\\).`,
    expression: `x = \\frac{-(-${b}) \\pm \\sqrt{(-${b})^2 - 4(1)(${c})}}{2} = \\frac{${b} \\pm \\sqrt{${disc}}}{2}`,
    answer: String(b + disc),
    explanation: `근의 공식 \\(x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}\\)에 의하여:\n\\[ x = \\frac{-(-${b}) \\pm \\sqrt{(-${b})^2 - 4 \\times 1 \\times (${c})}}{2} = \\frac{${b} \\pm \\sqrt{${disc}}}{2} \\]입니다.\n따라서 \\(A = ${b}\\), \\(B = ${disc}\\)이므로 \\(A + B = ${b} + ${disc} = ${b + disc}\\)입니다.`,
    explanationEn: `Applying the formula yields \\(A = ${b}\\) and \\(B = ${disc}\\). Thus \\(A + B = ${b + disc}\\).`
  };
}

// 5. [Ch 05 종합 실전]
export function rpmG9QuadSolveAllMixed(random) {
  const fns = [
    rpmG9QuadGivenRoot,
    rpmG9QuadDoubleRoot,
    rpmG9QuadSquareRootForm,
    rpmG9QuadQuadraticFormula
  ];
  return pick(random, fns)(random);
}

// =============================================================================
// Chapter 06: 이차방정식의 활용
// =============================================================================

// 1. [연속하는 두 수에 대한 활용]
export function rpmG9QuadAppConsecutiveNumbers(random) {
  const n = ri(random, 5, 15);
  const prod = n * (n + 1);
  return {
    prompt: `연속하는 두 자연수의 곱이 \\(${prod}\\)일 때, 두 자연수의 합을 구하시오.`,
    promptEn: `The product of two consecutive natural numbers is \\(${prod}\\). Find their sum.`,
    expression: `x(x + 1) = ${prod} \\implies x^2 + x - ${prod} = 0 \\implies (x - ${n})(x + ${n + 1}) = 0`,
    answer: String(2 * n + 1),
    explanation: `연속하는 두 자연수를 \\(x, x+1\\)이라 하면:\n\\[ x(x + 1) = ${prod} \\implies x^2 + x - ${prod} = 0 \\]\n인수분해하면 \\((x - ${n})(x + ${n + 1}) = 0\\)입니다.\n\\(x\\)는 자연수이므로 \\(x = ${n}\\)이고, 두 자연수는 \\(${n}, ${n + 1}\\)입니다.\n따라서 두 수의 합은 \\(${n} + ${n + 1} = ${2 * n + 1}\\)입니다.`,
    explanationEn: `Solving \\(x(x+1) = ${prod}\\) gives \\(x = ${n}\\). The sum is \\(${n} + ${n + 1} = ${2 * n + 1}\\).`
  };
}

// 2. [도형에 대한 활용]
export function rpmG9QuadAppGeometry(random) {
  const w = ri(random, 6, 14);
  const h = w + ri(random, 2, 6);
  const perimeter = 2 * (w + h);
  const area = w * h;
  return {
    prompt: `둘레의 길이가 \\(${perimeter}\\text{ cm}\\)이고 넓이가 \\(${area}\\text{ cm}^2\\)인 직사각형이 있다. 이 직사각형의 긴 변의 길이를 구하시오.`,
    promptEn: `A rectangle has perimeter \\(${perimeter}\\text{ cm}\\) and area \\(${area}\\text{ cm}^2\\). Find the length of its longer side.`,
    expression: `w + h = ${w + h}, \\quad wh = ${area} \\implies x^2 - ${w + h}x + ${area} = 0`,
    answer: String(h),
    explanation: `가로와 세로의 길이의 합은 둘레의 절반인 \\(${perimeter / 2}\\text{ cm}\\)입니다.\n가로의 길이를 \\(x\\)라 하면 세로는 \\(${perimeter / 2} - x\\)입니다.\n\\[ x(${perimeter / 2} - x) = ${area} \\implies x^2 - ${perimeter / 2}x + ${area} = 0 \\]\n인수분해하면 \\((x - ${w})(x - ${h}) = 0\\)입니다.\n따라서 두 변의 길이는 \\(${w}\\text{ cm}\\)와 \\(${h}\\text{ cm}\\)이므로 긴 변의 길이는 \\(${h}\\text{ cm}\\)입니다.`,
    explanationEn: `The side lengths are ${w} and ${h}. The longer side is ${h}.`
  };
}

// 3. [길을 낸 화단의 넓이 활용]
export function rpmG9QuadAppRoadGarden(random) {
  const W = ri(random, 12, 20);
  const H = ri(random, 10, 16);
  const x = ri(random, 1, 3);
  const remainingArea = (W - x) * (H - x);
  return {
    prompt: `가로의 길이가 \\(${W}\\text{ m}\\), 세로의 길이가 \\(${H}\\text{ m}\\)인 직사각형 모양의 밭에 폭이 \\(x\\text{ m}\\)로 일정한 도로를 상하, 좌우로 하나씩 만들었더니 남은 밭의 넓이가 \\(${remainingArea}\\text{ m}^2\\)가 되었다. 도로의 폭 \\(x\\)를 구하시오.`,
    promptEn: `A rectangular field measuring \\(${W}\\text{ m}\\) by \\(${H}\\text{ m}\\) has a cross-shaped road of width \\(x\\text{ m}\\). If the remaining area is \\(${remainingArea}\\text{ m}^2\\), find \\(x\\).`,
    expression: `(${W} - x)(${H} - x) = ${remainingArea} \\implies x = ${x}`,
    answer: String(x),
    explanation: `길을 한쪽으로 몰아서 생각하면 남은 밭의 넓이는 가로 \\((${W} - x)\\text{ m}\\), 세로 \\((${H} - x)\\text{ m}\\)인 직사각형의 넓이와 같습니다.\n\\[ (${W} - x)(${H} - x) = ${remainingArea} \\implies x^2 - ${W + H}x + ${W * H - remainingArea} = 0 \\]\n인수분해하면 \\((x - ${x})(x - ${W + H - x}) = 0\\)입니다.\n도로의 폭은 원래 길이보다 작아야 하므로 \\(x = ${x}\\text{ m}\\)입니다.`,
    explanationEn: `\\((${W} - x)(${H} - x) = ${remainingArea}\\) yields \\(x = ${x}\\).`
  };
}

// 4. [쏘아 올린 물체의 높이]
export function rpmG9QuadAppProjectile(random) {
  const t = ri(random, 2, 5);
  const v0 = 5 * t + 10;
  const groundTime = v0 / 5;
  return {
    prompt: `지면에서 초속 \\(${v0}\\text{ m}\\)로 똑바로 위로 쏘아 올린 물체의 \\(t\\)초 후의 높이 \\(h\\)가 \\(h = ${v0}t - 5t^2\\text{ (m)}\\)이다. 이 물체가 다시 지면에 떨어지는 것은 쏘아 올린 지 몇 초 후인지 구하시오.`,
    promptEn: `A projectile's height is given by \\(h = ${v0}t - 5t^2\\). How many seconds after launch does it hit the ground?`,
    expression: `${v0}t - 5t^2 = 0 \\implies 5t(t - ${groundTime}) = 0`,
    answer: String(groundTime),
    explanation: `물체가 지면에 떨어질 때는 높이 \\(h = 0\\)일 때입니다.\n\\[ ${v0}t - 5t^2 = 0 \\implies -5t(t - ${groundTime}) = 0 \\]\n\\(t > 0\\)이므로 \\(t = ${groundTime}\\)초 후입니다.`,
    explanationEn: `Setting \\(h = 0\\) gives \\(5t(t - ${groundTime}) = 0\\), so \\(t = ${groundTime}\\).`
  };
}

// 5. [Ch 06 종합 실전]
export function rpmG9QuadAppsAllMixed(random) {
  const fns = [
    rpmG9QuadAppConsecutiveNumbers,
    rpmG9QuadAppGeometry,
    rpmG9QuadAppRoadGarden,
    rpmG9QuadAppProjectile
  ];
  return pick(random, fns)(random);
}

// =============================================================================
// Chapter 07: 이차함수와 그 그래프
// =============================================================================

// 1. [이차함수의 성질] 꼭짓점, 축의 방정식
export function rpmG9QuadFuncBasicProperties(random) {
  const a = pick(random, [-3, -2, -1, 1, 2, 3]);
  const p = ri(random, -4, 4);
  const q = ri(random, -5, 5);
  const pSign = p >= 0 ? `- ${p}` : `+ ${Math.abs(p)}`;
  const qSign = q >= 0 ? `+ ${q}` : `- ${Math.abs(q)}`;
  const aStr = a === 1 ? '' : (a === -1 ? '-' : String(a));
  return {
    prompt: `이차함수 \\(y = ${aStr}(x ${pSign})^2 ${qSign}\\)의 꼭짓점의 좌표가 \\((m, n)\\), 축의 방정식이 \\(x = k\\)일 때, \\(m + n + k\\)의 값을 구하시오.`,
    promptEn: `For \\(y = ${aStr}(x ${pSign})^2 ${qSign}\\), let the vertex be \\((m, n)\\) and axis be \\(x = k\\). Find \\(m + n + k\\).`,
    expression: `\\text{꼭짓점: } (${p}, ${q}), \\quad \\text{축: } x = ${p}`,
    answer: String(p + q + p),
    explanation: `표준형 \\(y = a(x - p)^2 + q\\)에서 꼭짓점의 좌표는 \\((p, q) = (${p}, ${q})\\)이므로 \\(m = ${p}\\), \\(n = ${q}\\)입니다.\n축의 방정식은 \\(x = p\\)이므로 \\(k = ${p}\\)입니다.\n따라서 \\(m + n + k = ${p} + ${q} + ${p} = ${2 * p + q}\\)입니다.`,
    explanationEn: `Vertex is \\((${p}, ${q})\\) and axis is \\(x = ${p}\\). \\(m + n + k = ${2 * p + q}\\).`
  };
}

// 2. [평행이동과 그래프 위의 점]
export function rpmG9QuadFuncTranslation(random) {
  const a = pick(random, [-2, -1, 1, 2]);
  const m = ri(random, 1, 4);
  const n = ri(random, 1, 4);
  const testX = m + 1;
  const testY = a * (1) ** 2 + n;
  return {
    prompt: `이차함수 \\(y = ${a === 1 ? '' : (a === -1 ? '-' : a)}x^2\\)의 그래프를 \\(x\\)축의 방향으로 \\(${m}\\)만큼, \\(y\\)축의 방향으로 \\(${n}\\)만큼 평행이동한 그래프가 점 \\((${testX}, k)\\)를 지날 때, \\(k\\)의 값을 구하시오.`,
    promptEn: `If \\(y = ${a}x^2\\) is shifted by \\(${m}\\) horizontally and \\(${n}\\) vertically, and passes through \\((${testX}, k)\\), find \\(k\\).`,
    expression: `y = ${a === 1 ? '' : (a === -1 ? '-' : a)}(x - ${m})^2 + ${n}`,
    answer: String(testY),
    explanation: `평행이동한 이차함수의 식은 \\(y = ${a === 1 ? '' : (a === -1 ? '-' : a)}(x - ${m})^2 + ${n}\\)입니다.\n이 식에 점 \\((${testX}, k)\\)를 대입하면:\n\\[ k = ${a === 1 ? '' : (a === -1 ? '-' : a)}(${testX} - ${m})^2 + ${n} = ${a} \\times 1 + ${n} = ${testY} \\]입니다.`,
    explanationEn: `The translated parabola is \\(y = ${a}(x - ${m})^2 + ${n}\\). Substituting \\(x = ${testX}\\) gives \\(k = ${testY}\\).`
  };
}

// 3. [부호 판별 a, p, q]
export function rpmG9QuadFuncSigns(random) {
  return {
    prompt: '이차함수 \\(y = a(x - p)^2 + q\\)의 그래프의 꼭짓점이 제2사분면 위에 있고 위로 볼록할 때, 다음 보기 중 옳은 것을 고르시오.',
    promptEn: 'If the vertex of \\(y = a(x - p)^2 + q\\) is in Quadrant II and the parabola opens downward, which statement is true?',
    expression: 'a < 0, \\quad p < 0, \\quad q > 0',
    choices: [
      { value: '1', label: 'a > 0, p > 0, q > 0' },
      { value: '2', label: 'a < 0, p > 0, q < 0' },
      { value: '3', label: 'a < 0, p < 0, q > 0' },
      { value: '4', label: 'a > 0, p < 0, q > 0' },
      { value: '5', label: 'a < 0, p < 0, q < 0' }
    ],
    answer: '3',
    explanation: '• 위로 볼록하므로 \\(a < 0\\)입니다.\n• 꼭짓점 \\((p, q)\\)가 제2사분면 위에 있으므로 \\(x\\)좌표는 음수, \\(y\\)좌표는 양수입니다. 즉, \\(p < 0\\), \\(q > 0\\)입니다.\n따라서 옳은 것은 ③ \\(a < 0, p < 0, q > 0\\)입니다.',
    explanationEn: 'Opens downward \\(\\implies a < 0\\). Quadrant II vertex \\(\\implies p < 0, q > 0\\).'
  };
}

// 4. [Ch 07 종합 실전]
export function rpmG9QuadFunctionsGraphAllMixed(random) {
  const fns = [
    rpmG9QuadFuncBasicProperties,
    rpmG9QuadFuncTranslation,
    rpmG9QuadFuncSigns
  ];
  return pick(random, fns)(random);
}

// =============================================================================
// Chapter 08: 이차함수 y = ax^2 + bx + c의 그래프
// =============================================================================

// 1. [일반형을 표준형으로 변환 및 꼭짓점]
export function rpmG9QuadFuncStandardForm(random) {
  const a = pick(random, [1, -1, 2, -2]);
  const p = ri(random, -3, 3);
  const q = ri(random, -5, 5);
  const b = -2 * a * p;
  const c = a * p * p + q;
  const aStr = a === 1 ? '' : (a === -1 ? '-' : String(a));
  const bStr = b === 0 ? '' : (b > 0 ? `+ ${b === 1 ? '' : b}x` : `- ${b === -1 ? '' : Math.abs(b)}x`);
  const cStr = c === 0 ? '' : (c > 0 ? `+ ${c}` : `- ${Math.abs(c)}`);
  return {
    prompt: `이차함수 \\(y = ${aStr}x^2 ${bStr} ${cStr}\\)의 꼭짓점의 좌표를 \\((p, q)\\)라 할 때, \\(p + q\\)의 값을 구하시오.`,
    promptEn: `Find \\(p + q\\) where \\((p, q)\\) is the vertex of \\(y = ${aStr}x^2 ${bStr} ${cStr}\\).`,
    expression: `y = ${aStr}(x - ${p})^2 ${q >= 0 ? '+' : ''}${q}`,
    answer: String(p + q),
    explanation: `완전제곱식 형태로 변형하면:\n\\[ y = ${aStr}(x^2 ${-2 * p >= 0 ? '+' : ''}${-2 * p}x) ${cStr} = ${aStr}(x - ${p})^2 ${q >= 0 ? '+' : ''}${q} \\]입니다.\n따라서 꼭짓점의 좌표는 \\((${p}, ${q})\\)이므로 \\(p + q = ${p} + (${q}) = ${p + q}\\)입니다.`,
    explanationEn: `Converting to vertex form gives vertex \\((${p}, ${q})\\). Thus \\(p + q = ${p + q}\\).`
  };
}

// 2. [이차함수 식 구하기]
export function rpmG9QuadFuncFindEquation(random) {
  const p = ri(random, 1, 4);
  const q = ri(random, -3, 3);
  const a = pick(random, [-2, -1, 1, 2]);
  const c = a * p * p + q;
  return {
    prompt: `꼭짓점의 좌표가 \\((${p}, ${q})\\)이고 점 \\((0, ${c})\\)을 지나는 이차함수의 식을 \\(y = ax^2 + bx + c\\)라 할 때, 상수 \\(a, b, c\\)에 대하여 \\(a + b + c\\)의 값을 구하시오.`,
    promptEn: `A parabola has vertex \\((${p}, ${q})\\) and passes through \\((0, ${c})\\). Find \\(a + b + c\\) for \\(y = ax^2 + bx + c\\).`,
    expression: `y = ${a}(x - ${p})^2 + ${q} = ${a}x^2 - ${2 * a * p}x + ${c}`,
    answer: String(a - 2 * a * p + c),
    explanation: `꼭짓점이 \\((${p}, ${q})\\)이므로 식을 \\(y = a(x - ${p})^2 + ${q}\\)로 놓을 수 있습니다.\n점 \\((0, ${c})\\)을 대입하면:\n\\[ ${c} = a(0 - ${p})^2 + ${q} \\implies ${c} = ${p * p}a + ${q} \\implies a = ${a} \\]\n따라서 \\(y = ${a}(x - ${p})^2 + ${q} = ${a}x^2 - ${2 * a * p}x + ${c}\\)입니다.\n그러므로 \\(a + b + c = ${a} + (${-2 * a * p}) + ${c} = ${a - 2 * a * p + c}\\)입니다.`,
    explanationEn: `Setting up \\(y = a(x - ${p})^2 + ${q}\\) and using \\((0, ${c})\\) gives \\(a = ${a}\\). Then \\(a + b + c = ${a - 2 * a * p + c}\\).`
  };
}

// 3. [x축과의 교점과 삼각형의 넓이]
export function rpmG9QuadFuncTriangleArea(random) {
  return {
    prompt: '이차함수 \\(y = -x^2 + 2x + 8\\)의 그래프가 \\(x\\)축과 만나는 두 점을 각각 \\(A, B\\)라 하고, 꼭짓점을 \\(C\\)라 할 때, \\(\\triangle ABC\\)의 넓이를 구하시오.',
    promptEn: 'For \\(y = -x^2 + 2x + 8\\), let \\(A, B\\) be the x-intercepts and \\(C\\) the vertex. Find the area of \\(\\triangle ABC\\).',
    expression: '-x^2 + 2x + 8 = -(x + 2)(x - 4) = 0 \\implies A(-2, 0), B(4, 0), C(1, 9)',
    answer: '27',
    explanation: '\\(y = 0\\)일 때, \\(-x^2 + 2x + 8 = 0 \\implies x^2 - 2x - 8 = 0 \\implies (x + 2)(x - 4) = 0\\)이므로\n두 점의 좌표는 \\(A(-2, 0), B(4, 0)\\)입니다. 밑변의 길이 \\(AB = 4 - (-2) = 6\\)입니다.\n꼭짓점 \\(C\\)는 \\(y = -(x - 1)^2 + 9\\)에서 \\(C(1, 9)\\)이므로 높이는 \\(9\\)입니다.\n따라서 삼각형 \\(ABC\\)의 넓이는 \\(\\frac{1}{2} \\times 6 \\times 9 = 27\\)입니다.',
    explanationEn: 'x-intercepts are \\(-2\\) and \\(4\\) (base = 6), vertex is \\((1, 9)\\) (height = 9). Area = \\(\\frac{1}{2} \\times 6 \\times 9 = 27\\).'
  };
}

// 4. [Ch 08 종합 실전]
export function rpmG9QuadFunctionsStandardAllMixed(random) {
  const fns = [
    rpmG9QuadFuncStandardForm,
    rpmG9QuadFuncFindEquation,
    rpmG9QuadFuncTriangleArea
  ];
  return pick(random, fns)(random);
}

// =============================================================================
// 실력 UP+ (최고수준 심화)
// =============================================================================

export function rpmG9AdvancedSkillUp(random) {
  const mode = pick(random, ['pi-radical', 'quad-param-int', 'parabola-quadrilateral']);
  if (mode === 'pi-radical') {
    return {
      prompt: '\\(A = \\sqrt{(\\pi - 3)^2} - \\sqrt{(3 - \\pi)^2} + \\sqrt{(\\pi - 4)^2}\\)일 때, \\(A\\)를 간단히 하시오.',
      promptEn: 'Simplify \\(A = \\sqrt{(\\pi - 3)^2} - \\sqrt{(3 - \\pi)^2} + \\sqrt{(\\pi - 4)^2}\\).',
      expression: '\\pi \\approx 3.14 \\implies \\pi - 3 > 0, \\quad 3 - \\pi < 0, \\quad \\pi - 4 < 0',
      answer: '4-\\pi',
      explanation: '\\(\\pi \\approx 3.14\\)이므로:\n• \\(\\pi - 3 > 0\\)이므로 \\(\\sqrt{(\\pi - 3)^2} = \\pi - 3\\)\n• \\(3 - \\pi < 0\\)이므로 \\(\\sqrt{(3 - \\pi)^2} = -(3 - \\pi) = \\pi - 3\\)\n• \\(\\pi - 4 < 0\\)이므로 \\(\\sqrt{(\\pi - 4)^2} = -(\\pi - 4) = 4 - \\pi\\)\n따라서 준식은 \\((\\pi - 3) - (\\pi - 3) + (4 - \\pi) = 4 - \\pi\\)입니다.',
      explanationEn: 'Evaluating signs yields \\((\\pi - 3) - (\\pi - 3) + (4 - \\pi) = 4 - \\pi\\).'
    };
  }
  if (mode === 'quad-param-int') {
    return {
      prompt: '이차방정식 \\(x^2 - 2(k + 1)x + k^2 + 3 = 0\\)이 서로 다른 두 실근을 갖도록 하는 정수 \\(k\\)의 최솟값을 구하시오.',
      promptEn: 'Find the minimum integer \\(k\\) such that \\(x^2 - 2(k + 1)x + k^2 + 3 = 0\\) has two distinct real roots.',
      expression: 'D/4 = (k + 1)^2 - (k^2 + 3) > 0 \\implies 2k - 2 > 0 \\implies k > 1',
      answer: '2',
      explanation: '서로 다른 두 실근을 가지려면 판별식 \\(D > 0\\)이어야 합니다.\n짝수 판별식 \\(D/4 = (k + 1)^2 - (k^2 + 3) = k^2 + 2k + 1 - k^2 - 3 = 2k - 2 > 0\\)에서\n\\(2k > 2 \\implies k > 1\\)입니다.\n따라서 정수 \\(k\\)의 최솟값은 \\(2\\)입니다.',
      explanationEn: '\\(D/4 = 2k - 2 > 0 \\implies k > 1\\). The smallest integer is 2.'
    };
  }
  return {
    prompt: '이차함수 \\(y = x^2 - 4x + 3\\)의 꼭짓점을 \\(P\\), \\(y\\)축과의 교점을 \\(Q\\), 원점을 \\(O\\)라 할 때, 삼각형 \\(OPQ\\)의 넓이를 구하시오.',
    promptEn: 'For \\(y = x^2 - 4x + 3\\), let \\(P\\) be the vertex and \\(Q\\) the y-intercept. Find the area of \\(\\triangle OPQ\\).',
    expression: 'P(2, -1), \\quad Q(0, 3), \\quad O(0, 0)',
    answer: '3',
    explanation: '이차함수 \\(y = (x - 2)^2 - 1\\)에서 꼭짓점은 \\(P(2, -1)\\)입니다.\n\\(y\\)축과의 교점은 \\(x = 0\\)일 때 \\(y = 3\\)이므로 \\(Q(0, 3)\\)입니다.\n삼각형 \\(OPQ\\)에서 밑변을 선분 \\(OQ\\)로 잡으면 밑변의 길이는 \\(3\\)이고, 높이는 점 \\(P\\)의 \\(x\\)좌표의 절댓값인 \\(2\\)입니다.\n따라서 삼각형 \\(OPQ\\)의 넓이는 \\(\\frac{1}{2} \\times 3 \\times 2 = 3\\)입니다.',
    explanationEn: 'Base along y-axis is \\(OQ = 3\\), height is \\(x_P = 2\\). Area = \\(\\frac{1}{2} \\times 3 \\times 2 = 3\\).'
  };
}

// =============================================================================
// 중3-1 전 범위 종합 실전 모의고사 (25문항)
// =============================================================================

export function rpmGrade9SemesterOneFinalExam(random) {
  const allGenerators = [
    rpmG9RadicalConcept,
    rpmG9RadicalSignExtraction,
    rpmG9RadicalNaturalCondition,
    rpmG9RadicalAddSubCondition,
    rpmG9RadicalInequalityCount,
    rpmG9RadicalNumberLineCoord,
    rpmG9RadicalIntDecParts,
    rpmG9RadicalOpsMultDiv,
    rpmG9RadicalOpsRationalize,
    rpmG9RadicalOpsAddSub,
    rpmG9RadicalOpsGeometry,
    rpmG9PolyMultSquare,
    rpmG9PolyMultDiffSquares,
    rpmG9PolyMultNumCalc,
    rpmG9PolyMultTransform,
    rpmG9FactorPerfectSquare,
    rpmG9FactorTrinomial,
    rpmG9FactorNumCalc,
    rpmG9FactorSubstitutionValue,
    rpmG9QuadGivenRoot,
    rpmG9QuadDoubleRoot,
    rpmG9QuadSquareRootForm,
    rpmG9QuadQuadraticFormula,
    rpmG9QuadAppConsecutiveNumbers,
    rpmG9QuadAppGeometry,
    rpmG9QuadAppRoadGarden,
    rpmG9QuadAppProjectile,
    rpmG9QuadFuncBasicProperties,
    rpmG9QuadFuncTranslation,
    rpmG9QuadFuncSigns,
    rpmG9QuadFuncStandardForm,
    rpmG9QuadFuncFindEquation,
    rpmG9QuadFuncTriangleArea,
    rpmG9AdvancedSkillUp
  ];
  return pick(random, allGenerators)(random);
}

// =============================================================================
// Unit Definitions for Grade 9 Semester 1
// =============================================================================

export const APPLIED_G9_RADICALS_REAL_APPLIED_UNITS = [
  { id: 'applied-g9-radical-concept', label: '[응용] 제곱근의 뜻과 성질', description: '제곱근의 정의와 양·음의 제곱근, 성질 심화', en: ['Square Root Definition and Properties', 'Rigorous properties and definitions of roots'], make: (r) => rpmG9RadicalConcept(r) },
  { id: 'applied-g9-radical-sign-extraction', label: '[응용] 근호 안의 식의 부호 판별', description: 'sqrt(a^2) = |a| 부호 판별 및 간소화', en: ['Sign Determination Inside Radicals', 'Simplifying square root of squared algebraic expressions'], make: (r) => rpmG9RadicalSignExtraction(r) },
  { id: 'applied-g9-radical-natural-condition', label: '[응용] sqrt(ax)가 자연수가 될 조건', description: '소인수분해를 이용한 최소 자연수 곱과 몫', en: ['Condition for sqrt(ax) to be Natural', 'Finding multipliers and divisors via prime factorization'], make: (r) => rpmG9RadicalNaturalCondition(r) },
  { id: 'applied-g9-radical-add-sub-condition', label: '[응용] sqrt(n±x)가 자연수가 될 조건', description: '합과 차 형태의 제곱수 만들기 조건', en: ['Condition for sqrt(n±x) to be Natural', 'Square conditions on additive and subtractive roots'], make: (r) => rpmG9RadicalAddSubCondition(r) },
  { id: 'applied-g9-radical-inequality-count', label: '[응용] 제곱근 부등식 만족 정수 개수', description: '부등식을 만족시키는 x의 개수 구하기', en: ['Counting Integers in Radical Inequalities', 'Counting solutions satisfying radical bounds'], make: (r) => rpmG9RadicalInequalityCount(r) },
  { id: 'applied-g9-radical-number-line-coord', label: '[응용] 무리수의 수직선 대응', description: '피타고라스 정리를 이용한 수직선 회전 좌표', en: ['Real Numbers on the Number Line', 'Locating irrational coordinates using right triangle hypotenuses'], make: (r) => rpmG9RadicalNumberLineCoord(r) },
  { id: 'applied-g9-radical-int-dec-parts', label: '[응용] 무리수의 정수 부분과 소수 부분', description: '정수부분 a와 소수부분 b의 복합 식의 값', en: ['Integer and Fractional Parts of Radicals', 'Expressions involving integer and fractional components'], make: (r) => rpmG9RadicalIntDecParts(r) },
  { id: 'applied-g9-radicals-real-all-mixed', label: '[응용] 제곱근과 실수 세부 유형 실전', description: '제곱근과 실수 전 유형 종합 실전 다지기', en: ['Radicals & Real Numbers Comprehensive Practice', 'Mixed applied practice across all radical and real number types'], make: (r) => rpmG9RadicalsRealAllMixed(r) },
];

export const APPLIED_G9_RADICAL_OPERATIONS_APPLIED_UNITS = [
  { id: 'applied-g9-radical-ops-mult-div', label: '[응용] 제곱근의 곱셈과 나눗셈', description: '근호 밖으로 빼내기 a sqrt(b) 변환', en: ['Multiplication and Division of Radicals', 'Simplification into standard radical form'], make: (r) => rpmG9RadicalOpsMultDiv(r) },
  { id: 'applied-g9-radical-ops-rationalize', label: '[응용] 분모의 유리화', description: '단항식 분모의 유리화와 기약 표현', en: ['Rationalization of Denominators', 'Multiplying conjugates and simplifying rational forms'], make: (r) => rpmG9RadicalOpsRationalize(r) },
  { id: 'applied-g9-radical-ops-add-sub', label: '[응용] 제곱근의 덧셈과 뺄셈', description: '동류근호 덧셈·뺄셈 혼합 계산', en: ['Addition and Subtraction of Radicals', 'Combining like radical terms and simplifying'], make: (r) => rpmG9RadicalOpsAddSub(r) },
  { id: 'applied-g9-radical-ops-geometry', label: '[응용] 도형에서의 제곱근 활용', description: '직사각형, 삼각형의 넓이와 둘레 계산', en: ['Geometric Applications of Radicals', 'Areas and perimeters in radical expressions'], make: (r) => rpmG9RadicalOpsGeometry(r) },
  { id: 'applied-g9-radical-ops-all-mixed', label: '[응용] 근호를 포함한 식의 계산 세부 유형 실전', description: '근호 계산 전 유형 종합 실전 다지기', en: ['Radical Operations Comprehensive Practice', 'Mixed applied practice across all radical arithmetic types'], make: (r) => rpmG9RadicalOperationsAllMixed(r) },
];

export const APPLIED_G9_POLYNOMIAL_MULT_APPLIED_UNITS = [
  { id: 'applied-g9-poly-mult-square', label: '[응용] 완전제곱식의 전개와 계수', description: '(ax ± b)^2 전개 및 미지수 계수 찾기', en: ['Squaring Binomials & Coefficients', 'Expanding squared binomials and identifying terms'], make: (r) => rpmG9PolyMultSquare(r) },
  { id: 'applied-g9-poly-mult-diff-squares', label: '[응용] 합차 공식과 연속 합차', description: '(a+b)(a-b) 및 차수 확장 연속 합차', en: ['Difference of Squares & Chains', 'Difference of squares expansions and consecutive products'], make: (r) => rpmG9PolyMultDiffSquares(r) },
  { id: 'applied-g9-poly-mult-num-calc', label: '[응용] 곱셈 공식을 이용한 수의 계산', description: '102^2, 98×102 등 큰 수의 빠른 계산', en: ['Numerical Calculation via Identities', 'Applying algebraic identities to large arithmetic products'], make: (r) => rpmG9PolyMultNumCalc(r) },
  { id: 'applied-g9-poly-mult-transform', label: '[응용] 곱셈 공식의 변형', description: 'x^2 + y^2, x^2 + 1/x^2 대입 및 변형', en: ['Transformations of Identities', 'Sum of squares and reciprocal power identities'], make: (r) => rpmG9PolyMultTransform(r) },
  { id: 'applied-g9-poly-mult-all-mixed', label: '[응용] 다항식의 곱셈 세부 유형 실전', description: '다항식의 곱셈 전 유형 종합 실전 다지기', en: ['Polynomial Multiplication Comprehensive Practice', 'Mixed applied practice across all polynomial expansion types'], make: (r) => rpmG9PolynomialMultAllMixed(r) },
];

export const APPLIED_G9_FACTORIZATION_APPLIED_UNITS = [
  { id: 'applied-g9-factor-perfect-square', label: '[응용] 완전제곱식 인수분해 및 조건', description: '완전제곱식이 될 조건 상수항 구하기', en: ['Factoring Perfect Squares & Conditions', 'Conditions for trinomials to be perfect squares'], make: (r) => rpmG9FactorPerfectSquare(r) },
  { id: 'applied-g9-factor-trinomial', label: '[응용] 이차식의 인수분해와 인수의 합', description: 'x^2 + (a+b)x + ab 인수분해와 일차식 합', en: ['Trinomial Factoring & Sum of Factors', 'Factoring quadratic trinomials into linear factors'], make: (r) => rpmG9FactorTrinomial(r) },
  { id: 'applied-g9-factor-num-calc', label: '[응용] 인수분해를 이용한 수의 계산', description: 'a^2 - b^2 합차를 이용한 빠른 수의 계산', en: ['Numerical Calculation via Factoring', 'Quick arithmetic using difference of squares'], make: (r) => rpmG9FactorNumCalc(r) },
  { id: 'applied-g9-factor-sub-val', label: '[응용] 인수분해를 이용한 식의 값', description: '인수분해 후 문자 대입하여 식의 값 구하기', en: ['Evaluating Expressions via Factoring', 'Factoring before algebraic substitution'], make: (r) => rpmG9FactorSubstitutionValue(r) },
  { id: 'applied-g9-factorization-all-mixed', label: '[응용] 인수분해 세부 유형 실전', description: '인수분해 전 유형 종합 실전 다지기', en: ['Factoring Comprehensive Practice', 'Mixed applied practice across all factorization types'], make: (r) => rpmG9FactorizationAllMixed(r) },
];

export const APPLIED_G9_QUAD_EQUATIONS_SOLVE_APPLIED_UNITS = [
  { id: 'applied-g9-quad-given-root', label: '[응용] 한 근이 주어질 때 미지수와 다른 근', description: '주어진 근 대입하여 상수 구하고 풀기', en: ['Given One Root Find Other Root', 'Substituting known roots to find parameters and roots'], make: (r) => rpmG9QuadGivenRoot(r) },
  { id: 'applied-g9-quad-double-root', label: '[응용] 이차방정식의 중근 조건', description: '완전제곱식 조건과 중근 구하기', en: ['Conditions for Double Roots', 'Perfect square conditions and double root values'], make: (r) => rpmG9QuadDoubleRoot(r) },
  { id: 'applied-g9-quad-square-root-form', label: '[응용] 제곱근을 이용한 풀이', description: '(x+p)^2 = q 형태의 해와 두 근의 차', en: ['Solving Quadratics by Square Roots', 'Extracting roots from (x+p)^2 = q form'], make: (r) => rpmG9QuadSquareRootForm(r) },
  { id: 'applied-g9-quad-formula', label: '[응용] 근의 공식의 활용', description: '근의 공식을 이용한 이차방정식의 풀이', en: ['Quadratic Formula Applications', 'Applying quadratic formula to solve general equations'], make: (r) => rpmG9QuadQuadraticFormula(r) },
  { id: 'applied-g9-quad-solve-all-mixed', label: '[응용] 이차방정식의 풀이 세부 유형 실전', description: '이차방정식의 풀이 전 유형 종합 실전 다지기', en: ['Solving Quadratic Equations Comprehensive Practice', 'Mixed applied practice across all quadratic solving methods'], make: (r) => rpmG9QuadSolveAllMixed(r) },
];

export const APPLIED_G9_QUAD_EQUATIONS_APPS_APPLIED_UNITS = [
  { id: 'applied-g9-quad-app-numbers', label: '[응용] 연속하는 수에 대한 활용', description: '연속하는 자연수·홀수·짝수의 곱과 합', en: ['Applications on Consecutive Numbers', 'Equations on products and sums of consecutive integers'], make: (r) => rpmG9QuadAppConsecutiveNumbers(r) },
  { id: 'applied-g9-quad-app-geometry', label: '[응용] 도형에 대한 활용', description: '직사각형 둘레와 넓이를 이용한 방정식', en: ['Geometric Applications of Quadratics', 'Perimeter and area modeling for rectangles'], make: (r) => rpmG9QuadAppGeometry(r) },
  { id: 'applied-g9-quad-app-road', label: '[응용] 길을 낸 화단의 넓이 활용', description: '십자형 또는 가장자리 도로를 낸 밭의 넓이', en: ['Applications on Road & Garden Areas', 'Area equations with uniform road widths'], make: (r) => rpmG9QuadAppRoadGarden(r) },
  { id: 'applied-g9-quad-app-projectile', label: '[응용] 물체의 높이에 대한 활용', description: '위로 쏘아 올린 물체의 지면 도달 시간', en: ['Projectile Motion & Height Applications', 'Modeling projectile heights and ground impact times'], make: (r) => rpmG9QuadAppProjectile(r) },
  { id: 'applied-g9-quad-app-all-mixed', label: '[응용] 이차방정식의 활용 세부 유형 실전', description: '이차방정식 활용 전 유형 종합 실전 다지기', en: ['Quadratic Equation Applications Comprehensive Practice', 'Mixed applied word problems across all application types'], make: (r) => rpmG9QuadAppsAllMixed(r) },
];

export const APPLIED_G9_QUAD_FUNCTIONS_GRAPH_APPLIED_UNITS = [
  { id: 'applied-g9-quad-func-basic-props', label: '[응용] 이차함수의 꼭짓점과 축의 방정식', description: 'y = a(x-p)^2 + q의 성질과 좌표', en: ['Vertex and Axis of Quadratic Functions', 'Interpreting vertex and axis of symmetry'], make: (r) => rpmG9QuadFuncBasicProperties(r) },
  { id: 'applied-g9-quad-func-translation', label: '[응용] 이차함수의 평행이동과 지나는 점', description: 'x축, y축 평행이동과 대입 미지수 구하기', en: ['Parabola Translations and Points', 'Horizontal and vertical shifts passing through given points'], make: (r) => rpmG9QuadFuncTranslation(r) },
  { id: 'applied-g9-quad-func-signs', label: '[응용] 그래프의 위치와 계수의 부호', description: '사분면 위치에 따른 a, p, q의 부호 판별', en: ['Parabola Position & Sign Determination', 'Determining signs of a, p, q from quadrant locations'], make: (r) => rpmG9QuadFuncSigns(r) },
  { id: 'applied-g9-quad-func-graph-all-mixed', label: '[응용] 이차함수와 그 그래프 세부 유형 실전', description: '이차함수 기본/표준형 전 유형 종합 실전 다지기', en: ['Quadratic Functions & Graphs Comprehensive Practice', 'Mixed applied practice on vertex forms and parabola properties'], make: (r) => rpmG9QuadFunctionsGraphAllMixed(r) },
];

export const APPLIED_G9_QUAD_FUNCTIONS_STANDARD_APPLIED_UNITS = [
  { id: 'applied-g9-quad-func-standard-form', label: '[응용] 일반형의 표준형 변환 및 꼭짓점', description: 'y = ax^2 + bx + c를 표준형으로 고쳐 풀기', en: ['Converting General Form to Vertex Form', 'Completing the square on general quadratic functions'], make: (r) => rpmG9QuadFuncStandardForm(r) },
  { id: 'applied-g9-quad-func-find-eqn', label: '[응용] 조건이 주어질 때 이차함수 식 구하기', description: '꼭짓점과 한 점이 주어질 때 식 작성', en: ['Finding Quadratic Equations from Points', 'Formulating parabola equations from vertex and points'], make: (r) => rpmG9QuadFuncFindEquation(r) },
  { id: 'applied-g9-quad-func-triangle-area', label: '[응용] 이차함수 그래프와 도형의 넓이', description: 'x축 교점과 꼭짓점으로 이루어진 삼각형 넓이', en: ['Parabola Graphs & Polygon Areas', 'Areas of triangles formed by intercepts and vertices'], make: (r) => rpmG9QuadFuncTriangleArea(r) },
  { id: 'applied-g9-quad-func-std-all-mixed', label: '[응용] 이차함수 y = ax² + bx + c 세부 유형 실전', description: '일반형 전 유형 종합 실전 다지기', en: ['General Quadratic Functions Comprehensive Practice', 'Mixed applied practice across general form quadratics'], make: (r) => rpmG9QuadFunctionsStandardAllMixed(r) },
];

export const APPLIED_G9_ADVANCED_SKILL_UP_UNITS = [
  { id: 'applied-g9-advanced-skill-up', label: '[단원 최고수준] 중3-1 최고수준 심화 (실력 UP+)', description: '무리수 기호 판별, 판별식 파라미터, 포물선 기하 융합 심화 문제', en: ['Grade 9 Semester 1 Advanced Challenge', 'Challenging problems: radical signs with pi, discriminant integer bounds, parabola geometry'], make: (r) => rpmG9AdvancedSkillUp(r) },
];

export const APPLIED_GRADE9_SEMESTER_ONE_FINAL_MOCK_UNITS = [
  { id: 'applied-grade9-semester-one-final-exam', label: '[중3-1 총괄] 중3-1 전 범위 종합 실전 모의고사 (25문항)', description: '제곱근, 근호 계산, 다항식 곱셈, 인수분해, 이차방정식, 이차함수 전 범위 실전 총괄 모의고사', en: ['Grade 9 Semester 1 Capstone Exam', 'Comprehensive 25-problem exam covering all Grade 9 Semester 1 units'], make: (r) => rpmGrade9SemesterOneFinalExam(r) },
];

export const ALL_GRADE9_ALGEBRA_APPLIED_UNITS = [
  ...APPLIED_G9_RADICALS_REAL_APPLIED_UNITS,
  ...APPLIED_G9_RADICAL_OPERATIONS_APPLIED_UNITS,
  ...APPLIED_G9_POLYNOMIAL_MULT_APPLIED_UNITS,
  ...APPLIED_G9_FACTORIZATION_APPLIED_UNITS,
  ...APPLIED_G9_QUAD_EQUATIONS_SOLVE_APPLIED_UNITS,
  ...APPLIED_G9_QUAD_EQUATIONS_APPS_APPLIED_UNITS,
  ...APPLIED_G9_QUAD_FUNCTIONS_GRAPH_APPLIED_UNITS,
  ...APPLIED_G9_QUAD_FUNCTIONS_STANDARD_APPLIED_UNITS,
  ...APPLIED_G9_ADVANCED_SKILL_UP_UNITS,
  ...APPLIED_GRADE9_SEMESTER_ONE_FINAL_MOCK_UNITS,
];

const GRADE9_APPLIED_MAP = {
  ...Object.fromEntries(ALL_GRADE9_ALGEBRA_APPLIED_UNITS.map((u) => [u.id, u.make])),
  ...Object.fromEntries(ALL_GRADE9_ALGEBRA_APPLIED_UNITS.map((u) => [u.id.replace('applied-', 'rpm-'), u.make])),
};

export function findGrade9AlgebraGenerator(unitId) {
  return GRADE9_APPLIED_MAP[unitId] || null;
}

export const RPM_G9_RADICALS_REAL_APPLIED_UNITS = APPLIED_G9_RADICALS_REAL_APPLIED_UNITS;
export const RPM_G9_RADICAL_OPERATIONS_APPLIED_UNITS = APPLIED_G9_RADICAL_OPERATIONS_APPLIED_UNITS;
export const RPM_G9_POLYNOMIAL_MULT_APPLIED_UNITS = APPLIED_G9_POLYNOMIAL_MULT_APPLIED_UNITS;
export const RPM_G9_FACTORIZATION_APPLIED_UNITS = APPLIED_G9_FACTORIZATION_APPLIED_UNITS;
export const RPM_G9_QUAD_EQUATIONS_SOLVE_APPLIED_UNITS = APPLIED_G9_QUAD_EQUATIONS_SOLVE_APPLIED_UNITS;
export const RPM_G9_QUAD_EQUATIONS_APPS_APPLIED_UNITS = APPLIED_G9_QUAD_EQUATIONS_APPS_APPLIED_UNITS;
export const RPM_G9_QUAD_FUNCTIONS_GRAPH_APPLIED_UNITS = APPLIED_G9_QUAD_FUNCTIONS_GRAPH_APPLIED_UNITS;
export const RPM_G9_QUAD_FUNCTIONS_STANDARD_APPLIED_UNITS = APPLIED_G9_QUAD_FUNCTIONS_STANDARD_APPLIED_UNITS;
export const RPM_G9_ADVANCED_SKILL_UP_UNITS = APPLIED_G9_ADVANCED_SKILL_UP_UNITS;
export const RPM_GRADE9_SEMESTER_ONE_FINAL_MOCK_UNITS = APPLIED_GRADE9_SEMESTER_ONE_FINAL_MOCK_UNITS;
