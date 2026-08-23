function randomInt(random, min, max) {
  return Math.floor(random() * (max - min + 1)) + min;
}

function pick(random, values) {
  return values[randomInt(random, 0, values.length - 1)];
}

function vertical(a, b, operator, answer = operator === '+' ? a + b : operator === '-' ? a - b : a * b) {
  return { kind: 'vertical', a, b, operator, answer: String(answer) };
}

function inline(expression, answer) {
  return { kind: 'inline', expression, answer: String(answer) };
}

function gcd(a, b) {
  let left = Math.abs(a);
  let right = Math.abs(b);
  while (right) [left, right] = [right, left % right];
  return left || 1;
}

function fractionAnswer(numerator, denominator) {
  const common = gcd(numerator, denominator);
  const top = numerator / common;
  const bottom = denominator / common;
  if (bottom === 1) return String(top);
  if (top > bottom) return `${Math.floor(top / bottom)} ${top % bottom}/${bottom}`;
  return `${top}/${bottom}`;
}

function decimal(value, places = 3) {
  return Number(value.toFixed(places));
}

function decimalOperation(random, operator) {
  const scale = pick(random, [10, 100, 1000]);
  let a = randomInt(random, 2, scale * 9) / scale;
  let b = randomInt(random, 1, scale * 5) / scale;
  if (operator === '-' && b > a) [a, b] = [b, a];
  const answer = operator === '+' ? a + b : a - b;
  return inline(`${a} ${operator} ${b}`, decimal(answer));
}

function fractionAddSub(random) {
  const same = random() < 0.45;
  const d1 = randomInt(random, 3, 12);
  const d2 = same ? d1 : randomInt(random, 3, 12);
  const operator = random() < 0.55 ? '+' : '-';
  let n1 = randomInt(random, 1, d1 * 2 - 1);
  let n2 = randomInt(random, 1, d2 * 2 - 1);
  if (operator === '-' && n1 * d2 < n2 * d1) [n1, n2] = [n2, n1];
  const numerator = operator === '+' ? n1 * d2 + n2 * d1 : n1 * d2 - n2 * d1;
  return inline(`${n1}/${d1} ${operator} ${n2}/${d2}`, fractionAnswer(numerator, d1 * d2));
}

function fractionMultiply(random) {
  const count = random() < 0.2 ? 3 : 2;
  const parts = Array.from({ length: count }, () => {
    const denominator = randomInt(random, 2, 12);
    return [randomInt(random, 1, denominator * 2), denominator];
  });
  const numerator = parts.reduce((value, part) => value * part[0], 1);
  const denominator = parts.reduce((value, part) => value * part[1], 1);
  return inline(parts.map(([n, d]) => `${n}/${d}`).join(' × '), fractionAnswer(numerator, denominator));
}

function fractionDivide(random) {
  const wholeFirst = random() < 0.35;
  const d1 = randomInt(random, 2, 12);
  const d2 = randomInt(random, 2, 12);
  const n1 = wholeFirst ? randomInt(random, 2, 9) * d1 : randomInt(random, 1, d1 * 2);
  const n2 = randomInt(random, 1, d2 * 2);
  return inline(`${wholeFirst ? n1 / d1 : `${n1}/${d1}`} ÷ ${n2}/${d2}`, fractionAnswer(n1 * d2, d1 * n2));
}

function decimalMultiply(random) {
  const a = randomInt(random, 2, 999) / pick(random, [10, 100]);
  const b = randomInt(random, 2, 99) / pick(random, [1, 10, 100]);
  return inline(`${a} × ${b}`, decimal(a * b, 5));
}

function decimalDivide(random) {
  const divisor = randomInt(random, 2, 25) / pick(random, [1, 10]);
  const quotient = randomInt(random, 2, 200) / pick(random, [1, 10, 100]);
  const dividend = decimal(divisor * quotient, 5);
  return inline(`${dividend} ÷ ${divisor}`, quotient);
}

function mixedNatural(random) {
  const a = randomInt(random, 10, 80);
  const b = randomInt(random, 2, 9);
  const c = randomInt(random, 2, 9);
  const mode = randomInt(random, 0, 3);
  if (mode === 0) return inline(`${a} + ${b} × ${c}`, a + b * c);
  if (mode === 1) return inline(`(${a} - ${b}) × ${c}`, (a - b) * c);
  if (mode === 2) return inline(`${a} - ${b} × ${c}`, a - b * c);
  const product = b * c;
  return inline(`${product} ÷ ${b} + ${a}`, c + a);
}

function factorsMultiples(random) {
  const mode = randomInt(random, 0, 3);
  if (mode === 0) {
    const n = randomInt(random, 12, 90);
    const factors = Array.from({ length: n }, (_, i) => i + 1).filter((value) => n % value === 0);
    return inline(`약수: ${n}`, factors.join(', '));
  }
  const a = randomInt(random, 2, 15);
  const b = randomInt(random, 2, 15);
  if (mode === 1) return inline(`최대공약수: ${a}, ${b}`, gcd(a, b));
  const lcm = a * b / gcd(a, b);
  if (mode === 2) return inline(`최소공배수: ${a}, ${b}`, lcm);
  const count = randomInt(random, 3, 6);
  return inline(`${a}의 ${count}번째 배수`, a * count);
}

function ratioPractice(random) {
  const a = randomInt(random, 2, 90);
  const b = randomInt(random, 2, 90);
  const common = gcd(a, b);
  return inline(`${a} : ${b} → 가장 간단한 비`, `${a / common} : ${b / common}`);
}

function oneDigitWithinNine(random) {
  if (random() < 0.5) {
    const a = randomInt(random, 1, 8);
    const b = randomInt(random, 1, 9 - a);
    return inline(`${a} + ${b}`, a + b);
  }
  const a = randomInt(random, 2, 9);
  const b = randomInt(random, 1, a);
  return inline(`${a} - ${b}`, a - b);
}

function threeNumbersWithinNine(random) {
  if (random() < 0.55) {
    const a = randomInt(random, 1, 6);
    const b = randomInt(random, 1, 8 - a);
    const c = randomInt(random, 1, 9 - a - b);
    return inline(`${a} + ${b} + ${c}`, a + b + c);
  }
  const a = randomInt(random, 4, 9);
  const b = randomInt(random, 1, a - 1);
  const c = randomInt(random, 1, a - b);
  return inline(`${a} - ${b} - ${c}`, a - b - c);
}

function twoDigitOneDigit(random, mode) {
  const operator = mode.includes('sub') ? '-' : '+';
  let ones;
  let b;
  if (mode === 'add-no-carry') {
    ones = randomInt(random, 1, 8);
    b = randomInt(random, 1, 9 - ones);
  } else if (mode === 'add-carry') {
    ones = randomInt(random, 2, 9);
    b = randomInt(random, 10 - ones, 9);
  } else if (mode === 'sub-no-borrow') {
    ones = randomInt(random, 1, 9);
    b = randomInt(random, 1, ones);
  } else {
    ones = randomInt(random, 0, 7);
    b = randomInt(random, ones + 1, 9);
  }
  const a = randomInt(random, 1, 8) * 10 + ones;
  return vertical(a, b, operator);
}

function twoDigitPair(random, carry) {
  const operator = random() < 0.5 ? '+' : '-';
  if (operator === '+') {
    let a = randomInt(random, 10, 79);
    let b = randomInt(random, 10, 99 - a);
    const hasCarry = (a % 10) + (b % 10) >= 10;
    if (hasCarry !== carry) return twoDigitPair(random, carry);
    return vertical(a, b, '+');
  }
  let a = randomInt(random, 20, 99);
  let b = randomInt(random, 10, a);
  const hasBorrow = a % 10 < b % 10;
  if (hasBorrow !== carry) return twoDigitPair(random, carry);
  return vertical(a, b, '-');
}

function threeNumberUnder100(random) {
  if (random() < 0.5) {
    const a = randomInt(random, 5, 50);
    const b = randomInt(random, 2, 75 - a);
    const c = randomInt(random, 1, 99 - a - b);
    return inline(`${a} + ${b} + ${c}`, a + b + c);
  }
  const a = randomInt(random, 30, 99);
  const b = randomInt(random, 5, a - 5);
  const c = randomInt(random, 1, a - b);
  return inline(`${a} - ${b} - ${c}`, a - b - c);
}

function largeAddSub(random) {
  const digits = random() < 0.35 ? 4 : 3;
  const min = digits === 4 ? 1000 : 100;
  const max = digits === 4 ? 8999 : 899;
  const operator = random() < 0.55 ? '+' : '-';
  const a = randomInt(random, min, max);
  const b = operator === '+' ? randomInt(random, min, Math.min(max, 9999 - a)) : randomInt(random, min, a);
  return vertical(a, b, operator);
}

function multiply(random, digits, multiplierDigits = 1) {
  const min = 10 ** (digits - 1);
  const max = 10 ** digits - 1;
  const bMin = multiplierDigits === 1 ? 2 : 10;
  const bMax = multiplierDigits === 1 ? 9 : 29;
  const a = randomInt(random, min, max);
  const b = randomInt(random, bMin, bMax);
  return vertical(a, b, '×', a * b);
}

function exactDivision(random, quotientMin = 2, quotientMax = 12) {
  const divisor = randomInt(random, 2, 9);
  const quotient = randomInt(random, quotientMin, quotientMax);
  return inline(`${divisor * quotient} ÷ ${divisor}`, quotient);
}

function fractionPractice(random) {
  const denominator = randomInt(random, 3, 9);
  const mode = randomInt(random, 0, 2);
  if (mode === 0) {
    const whole = randomInt(random, 1, 8);
    const numerator = randomInt(random, 1, denominator - 1);
    return inline(`${whole} ${numerator}/${denominator} → 가분수`, `${whole * denominator + numerator}/${denominator}`);
  }
  if (mode === 1) {
    const whole = randomInt(random, 1, 8);
    const numerator = randomInt(random, 1, denominator - 1);
    const improper = whole * denominator + numerator;
    return inline(`${improper}/${denominator} → 대분수`, `${whole} ${numerator}/${denominator}`);
  }
  const left = randomInt(random, 1, denominator * 2 - 1);
  let right = randomInt(random, 1, denominator * 2 - 1);
  if (right === left) right = right === denominator * 2 - 1 ? right - 1 : right + 1;
  return inline(`${left}/${denominator} □ ${right}/${denominator}`, left > right ? '>' : '<');
}

export const GRADE_CATALOG = [
  {
    id: '1', label: '1학년', units: [
      { id: 'g1-bonds', label: '수 가르기와 모으기', description: '10 이하 수를 두 수로 가르거나 모으기', make: (r) => { const whole = randomInt(r, 3, 10); const part = randomInt(r, 1, whole - 1); return r() < 0.5 ? inline(`${whole} = ${part} + □`, whole - part) : inline(`${whole} = □ + ${whole - part}`, part); } },
      { id: 'g1-within-9', label: '한 자리 수 덧셈과 뺄셈', description: '합과 차가 9 이하인 계산', make: oneDigitWithinNine },
      { id: 'g1-three-numbers', label: '세 수의 덧셈과 뺄셈', description: '세 수를 순서대로 계산하기', make: threeNumbersWithinNine },
      { id: 'g1-two-digit-no-carry', label: '두 자리 수 ± 한 자리 수', description: '받아올림·받아내림 없는 계산', make: (r) => twoDigitOneDigit(r, pick(r, ['add-no-carry', 'sub-no-borrow'])) },
      { id: 'g1-two-digit-carry', label: '받아올림·받아내림', description: '두 자리 수와 한 자리 수 계산', make: (r) => twoDigitOneDigit(r, pick(r, ['add-carry', 'sub-borrow'])) },
    ],
  },
  {
    id: '2', label: '2학년', units: [
      { id: 'g2-no-carry', label: '두 자리 덧셈과 뺄셈 - 기초', description: '받아올림·받아내림 없는 두 자리 계산', make: (r) => twoDigitPair(r, false) },
      { id: 'g2-carry', label: '두 자리 덧셈과 뺄셈 - 심화', description: '받아올림·받아내림이 있는 두 자리 계산', make: (r) => twoDigitPair(r, true) },
      { id: 'g2-three-numbers', label: '세 수의 계산', description: '합과 차가 100 이하인 세 수 계산', make: threeNumberUnder100 },
      { id: 'g2-tables-2-5', label: '곱셈구구 2~5단', description: '2, 3, 4, 5단 곱셈구구', make: (r) => { const a = pick(r, [2, 3, 4, 5]); const b = randomInt(r, 1, 9); return inline(`${a} × ${b}`, a * b); } },
      { id: 'g2-tables-6-9', label: '곱셈구구 6~9단', description: '6, 7, 8, 9단 곱셈구구', make: (r) => { const a = pick(r, [6, 7, 8, 9]); const b = randomInt(r, 1, 9); return inline(`${a} × ${b}`, a * b); } },
      { id: 'g2-tables-all', label: '곱셈구구 종합', description: '2단부터 9단까지 무작위', make: (r) => { const a = randomInt(r, 2, 9); const b = randomInt(r, 1, 9); return inline(`${a} × ${b}`, a * b); } },
    ],
  },
  {
    id: '3', label: '3학년', units: [
      { id: 'g3-add-sub', label: '세·네 자리 덧셈과 뺄셈', description: '받아올림·받아내림을 포함한 큰 수 계산', make: largeAddSub },
      { id: 'g3-division-basic', label: '나눗셈 기초', description: '곱셈구구 범위의 나누어떨어지는 나눗셈', make: (r) => exactDivision(r, 2, 9) },
      { id: 'g3-multiply-2x1', label: '두 자리 수 × 한 자리 수', description: '두 자리 수에 한 자리 수 곱하기', make: (r) => multiply(r, 2) },
      { id: 'g3-multiply-3x1', label: '세 자리 수 × 한 자리 수', description: '세 자리 수에 한 자리 수 곱하기', make: (r) => multiply(r, 3) },
      { id: 'g3-multiply-2x2', label: '두 자리 수 × 두 자리 수', description: '두 자리 수끼리 곱하기', make: (r) => multiply(r, 2, 2) },
      { id: 'g3-division-exact', label: '두 자리 수 ÷ 한 자리 수', description: '나머지가 없는 두 자리 수 나눗셈', make: (r) => exactDivision(r, 10, 30) },
      { id: 'g3-fractions', label: '분수', description: '가분수·대분수 변환과 크기 비교', make: fractionPractice },
    ],
  },
  {
    id: '4', label: '4학년', units: [
      { id: 'g4-large-multiply', label: '큰 수의 곱셈', description: '두세 자리 수와 한두 자리 수의 곱셈', make: (r) => multiply(r, pick(r, [2, 3, 4]), pick(r, [1, 2])) },
      { id: 'g4-large-division', label: '큰 수의 나눗셈', description: '두세 자리 수를 한두 자리 수로 나누기', make: (r) => { const divisor = randomInt(r, 2, 29); const quotient = randomInt(r, 3, 99); const remainder = r() < 0.35 ? randomInt(r, 1, divisor - 1) : 0; return inline(`${divisor * quotient + remainder} ÷ ${divisor}`, remainder ? `${quotient} R ${remainder}` : quotient); } },
      { id: 'g4-fraction-add-sub', label: '분수의 덧셈과 뺄셈', description: '분모가 같은 진분수·가분수·대분수 계산', make: (r) => { const d = randomInt(r, 3, 12); let a = randomInt(r, 1, d * 3); let b = randomInt(r, 1, d * 2); const op = r() < 0.55 ? '+' : '-'; if (op === '-' && b > a) [a, b] = [b, a]; return inline(`${a}/${d} ${op} ${b}/${d}`, fractionAnswer(op === '+' ? a + b : a - b, d)); } },
      { id: 'g4-decimal-add-sub', label: '소수의 덧셈과 뺄셈', description: '소수 한 자리부터 세 자리까지의 계산', make: (r) => decimalOperation(r, r() < 0.55 ? '+' : '-') },
    ],
  },
  {
    id: '5', label: '5학년', units: [
      { id: 'g5-mixed-natural', label: '자연수의 혼합 계산', description: '괄호와 사칙연산 순서를 포함한 계산', make: mixedNatural },
      { id: 'g5-factors-multiples', label: '약수와 배수', description: '약수·배수·최대공약수·최소공배수', make: factorsMultiples },
      { id: 'g5-reduce-common-denominator', label: '약분과 통분', description: '기약분수 만들기와 분수의 크기 비교', make: (r) => { const n = randomInt(r, 1, 9); const d = randomInt(r, n + 1, 12); const k = randomInt(r, 2, 8); return inline(`${n * k}/${d * k} → 기약분수`, fractionAnswer(n * k, d * k)); } },
      { id: 'g5-fraction-add-sub', label: '분수의 덧셈과 뺄셈', description: '분모가 다른 분수의 덧셈과 뺄셈', make: fractionAddSub },
      { id: 'g5-fraction-multiply', label: '분수의 곱셈', description: '분수와 자연수, 두세 분수의 곱셈', make: fractionMultiply },
      { id: 'g5-decimal-multiply', label: '소수의 곱셈', description: '소수와 자연수 또는 소수의 곱셈', make: decimalMultiply },
    ],
  },
  {
    id: '6', label: '6학년', units: [
      { id: 'g6-fraction-divide-natural', label: '분수 ÷ 자연수', description: '진분수·가분수·대분수를 자연수로 나누기', make: (r) => { const d = randomInt(r, 2, 15); const n = randomInt(r, 1, d * 3); const whole = randomInt(r, 2, 12); return inline(`${n}/${d} ÷ ${whole}`, fractionAnswer(n, d * whole)); } },
      { id: 'g6-decimal-divide-natural', label: '소수 ÷ 자연수', description: '나누어떨어지는 소수 나눗셈', make: decimalDivide },
      { id: 'g6-ratio', label: '비와 비율', description: '비를 간단히 나타내고 분수·소수로 바꾸기', make: ratioPractice },
      { id: 'g6-fraction-divide', label: '분수의 나눗셈', description: '자연수와 분수를 포함한 분수 나눗셈', make: fractionDivide },
      { id: 'g6-decimal-divide', label: '소수의 나눗셈', description: '자릿수가 다른 소수끼리의 나눗셈', make: decimalDivide },
      { id: 'g6-proportion', label: '비례식과 비례배분', description: '비를 가장 간단한 자연수의 비로 나타내기', make: ratioPractice },
    ],
  },
];

const ENGLISH = {
  grades: { '1': 'Grade 1', '2': 'Grade 2', '3': 'Grade 3', '4': 'Grade 4', '5': 'Grade 5', '6': 'Grade 6' },
  units: {
    'g1-bonds': ['Number bonds', 'Split and combine numbers up to 10'], 'g1-within-9': ['One-digit addition & subtraction', 'Sums and differences up to 9'], 'g1-three-numbers': ['Three-number operations', 'Calculate three numbers in order'], 'g1-two-digit-no-carry': ['Two-digit ± one-digit', 'No regrouping'], 'g1-two-digit-carry': ['Regrouping practice', 'Two-digit and one-digit operations'],
    'g2-no-carry': ['Two-digit operations: basic', 'No regrouping'], 'g2-carry': ['Two-digit operations: advanced', 'With regrouping'], 'g2-three-numbers': ['Three-number operations', 'Sums and differences up to 100'], 'g2-tables-2-5': ['Times tables 2–5', 'Multiplication facts 2 through 5'], 'g2-tables-6-9': ['Times tables 6–9', 'Multiplication facts 6 through 9'], 'g2-tables-all': ['All times tables', 'Random facts from 2 through 9'],
    'g3-add-sub': ['3- and 4-digit operations', 'Large-number addition and subtraction'], 'g3-division-basic': ['Division basics', 'Exact division within multiplication facts'], 'g3-multiply-2x1': ['2-digit × 1-digit', 'Multiply a two-digit number'], 'g3-multiply-3x1': ['3-digit × 1-digit', 'Multiply a three-digit number'], 'g3-multiply-2x2': ['2-digit × 2-digit', 'Multiply two two-digit numbers'], 'g3-division-exact': ['2-digit ÷ 1-digit', 'Exact two-digit division'], 'g3-fractions': ['Fractions', 'Improper and mixed fractions; comparison'],
    'g4-large-multiply': ['Large-number multiplication', '2–4 digit numbers times 1–2 digit numbers'], 'g4-large-division': ['Large-number division', 'Divide 2–3 digit numbers'], 'g4-fraction-add-sub': ['Fraction addition & subtraction', 'Like denominators and mixed forms'], 'g4-decimal-add-sub': ['Decimal addition & subtraction', 'Tenths through thousandths'],
    'g5-mixed-natural': ['Mixed whole-number operations', 'Order of operations and parentheses'], 'g5-factors-multiples': ['Factors & multiples', 'GCF, LCM, factors and multiples'], 'g5-reduce-common-denominator': ['Simplifying fractions', 'Reduce and compare fractions'], 'g5-fraction-add-sub': ['Fraction addition & subtraction', 'Unlike denominators'], 'g5-fraction-multiply': ['Fraction multiplication', 'Multiply fractions and whole numbers'], 'g5-decimal-multiply': ['Decimal multiplication', 'Multiply decimals and whole numbers'],
    'g6-fraction-divide-natural': ['Fraction ÷ whole number', 'Divide proper, improper and mixed fractions'], 'g6-decimal-divide-natural': ['Decimal ÷ whole number', 'Exact decimal division'], 'g6-ratio': ['Ratios and rates', 'Simplify ratios and convert forms'], 'g6-fraction-divide': ['Fraction division', 'Divide fractions and whole numbers'], 'g6-decimal-divide': ['Decimal division', 'Divide decimals with different place values'], 'g6-proportion': ['Proportions', 'Simplify and partition ratios'],
  },
};

export function localizeGrade(grade, language) {
  return language === 'en' ? ENGLISH.grades[grade.id] : grade.label;
}

export function localizeUnit(unit, language, field = 'label') {
  if (language !== 'en') return unit[field];
  const translated = ENGLISH.units[unit.id];
  return translated ? translated[field === 'label' ? 0 : 1] : unit[field];
}

export function findGrade(gradeId) {
  return GRADE_CATALOG.find((grade) => grade.id === gradeId) || GRADE_CATALOG[0];
}

export function findUnit(gradeId, unitId) {
  const grade = findGrade(gradeId);
  return grade.units.find((unit) => unit.id === unitId) || grade.units[0];
}
