function randomInt(random, min, max) {
  return Math.floor(random() * (max - min + 1)) + min;
}

function pick(random, values) {
  return values[randomInt(random, 0, values.length - 1)];
}

function gcd(a, b) {
  let left = Math.abs(a);
  let right = Math.abs(b);
  while (right) [left, right] = [right, left % right];
  return left || 1;
}

function rational(numerator, denominator = 1) {
  if (denominator === 0) throw new Error('A rational number cannot have a zero denominator.');
  const sign = denominator < 0 ? -1 : 1;
  const common = gcd(numerator, denominator);
  return { n: (numerator * sign) / common, d: Math.abs(denominator) / common };
}

function rationalAdd(left, right) { return rational(left.n * right.d + right.n * left.d, left.d * right.d); }
function rationalSubtract(left, right) { return rational(left.n * right.d - right.n * left.d, left.d * right.d); }
function rationalMultiply(left, right) { return rational(left.n * right.n, left.d * right.d); }
function rationalDivide(left, right) { return rational(left.n * right.d, left.d * right.n); }

function rationalPower(value, exponent) {
  return rational(value.n ** exponent, value.d ** exponent);
}

function rationalText(value) {
  return value.d === 1 ? String(value.n) : `${value.n}/${value.d}`;
}

function signedText(value) {
  const absolute = rational(Math.abs(value.n), value.d);
  return `(${value.n >= 0 ? '+' : '−'}${rationalText(absolute)})`;
}

function decimalOperand(random) {
  let tenths;
  do tenths = randomInt(random, -89, 89); while (tenths === 0 || tenths % 10 === 0);
  const value = rational(tenths, 10);
  return { value, text: `(${tenths > 0 ? '+' : '−'}${Math.abs(tenths / 10)})`, decimal: true };
}

function integerOperand(random, max = 15) {
  let value;
  do value = randomInt(random, -max, max); while (value === 0);
  return { value: rational(value), text: signedText(rational(value)), decimal: false };
}

function fractionOperand(random) {
  const denominator = randomInt(random, 2, 12);
  let numerator;
  do numerator = randomInt(random, -denominator * 2, denominator * 2); while (numerator === 0 || numerator % denominator === 0);
  const value = rational(numerator, denominator);
  return { value, text: signedText(value), decimal: false };
}

function operationOperand(random, mode = 'mixed') {
  if (mode === 'decimal') return decimalOperand(random);
  if (mode === 'integer') return integerOperand(random);
  if (mode === 'fraction') return fractionOperand(random);
  return pick(random, [integerOperand, fractionOperand])(random);
}

function answerFor(value, decimalMode = false) {
  if (decimalMode && 10 % value.d === 0) return String(value.n * (10 / value.d) / 10);
  if (decimalMode && 100 % value.d === 0) return String(value.n * (100 / value.d) / 100);
  return rationalText(value);
}

function rationalAddition(random) {
  const mode = pick(random, ['integer', 'fraction', 'decimal']);
  const operands = Array.from({ length: random() < 0.35 ? 3 : 2 }, () => operationOperand(random, mode));
  const value = operands.reduce((total, item) => rationalAdd(total, item.value), rational(0));
  return problem('다음을 계산하세요.', operands.map((item) => item.text).join(' + '), answerFor(value, mode === 'decimal'), '', { promptEn: 'Calculate.' });
}

function rationalSubtraction(random) {
  const mode = pick(random, ['integer', 'fraction', 'decimal']);
  const operands = Array.from({ length: random() < 0.28 ? 3 : 2 }, () => operationOperand(random, mode));
  const value = operands.slice(1).reduce((total, item) => rationalSubtract(total, item.value), operands[0].value);
  return problem('다음을 계산하세요.', operands.map((item, index) => `${index ? ' − ' : ''}${item.text}`).join(''), answerFor(value, mode === 'decimal'), '', { promptEn: 'Calculate.' });
}

function rationalAddSubtract(random) {
  const mode = random() < 0.5 ? 'fraction' : 'decimal';
  const operands = Array.from({ length: random() < 0.45 ? 4 : 3 }, () => operationOperand(random, mode));
  const operators = Array.from({ length: operands.length - 1 }, () => random() < 0.5 ? '+' : '−');
  const value = operators.reduce((total, operator, index) => operator === '+' ? rationalAdd(total, operands[index + 1].value) : rationalSubtract(total, operands[index + 1].value), operands[0].value);
  const expression = operands.slice(1).reduce((text, item, index) => `${text} ${operators[index]} ${item.text}`, operands[0].text);
  return problem('다음을 계산하세요.', expression, answerFor(value, mode === 'decimal'), '', { promptEn: 'Calculate using addition and subtraction.' });
}

function rationalMultiplication(random) {
  if (random() < 0.22) {
    const base = operationOperand(random, random() < 0.6 ? 'fraction' : 'integer');
    const exponent = random() < 0.72 ? 2 : 3;
    const expression = `${base.text}^${exponent}`;
    return problem('거듭제곱을 계산하세요.', expression, rationalText(rationalPower(base.value, exponent)), '', { promptEn: 'Evaluate the power.' });
  }
  const operands = Array.from({ length: random() < 0.32 ? randomInt(random, 3, 4) : 2 }, () => operationOperand(random, random() < 0.72 ? 'fraction' : 'integer'));
  const value = operands.reduce((total, item) => rationalMultiply(total, item.value), rational(1));
  return problem('다음을 계산하세요.', operands.map((item) => item.text).join(' × '), rationalText(value), '', { promptEn: 'Calculate.' });
}

function rationalDivision(random) {
  if (random() < 0.2) {
    const operand = operationOperand(random, random() < 0.65 ? 'fraction' : 'decimal');
    return problem('다음 수의 역수를 구하세요.', operand.text, rationalText(rational(operand.value.d, operand.value.n)), '', { promptEn: 'Find the reciprocal of the number.' });
  }
  const mode = pick(random, ['integer', 'fraction', 'decimal']);
  const operands = Array.from({ length: random() < 0.25 ? 3 : 2 }, () => operationOperand(random, mode));
  const operators = operands.length === 3 ? (random() < 0.5 ? ['÷', '×'] : ['×', '÷']) : ['÷'];
  let value = operands[0].value;
  for (let index = 0; index < operators.length; index += 1) value = operators[index] === '÷' ? rationalDivide(value, operands[index + 1].value) : rationalMultiply(value, operands[index + 1].value);
  const expression = operands.slice(1).reduce((text, item, index) => `${text} ${operators[index]} ${item.text}`, operands[0].text);
  return problem('다음을 계산하세요.', expression, answerFor(value, false), '', { promptEn: 'Calculate.' });
}

function rationalFourOperations(random) {
  const operands = Array.from({ length: 3 }, () => operationOperand(random, random() < 0.65 ? 'fraction' : 'integer'));
  const [a, b, c] = operands.map((item) => item.value);
  const patterns = [
    { expression: `${operands[0].text} − ${operands[1].text} × ${operands[2].text}`, value: rationalSubtract(a, rationalMultiply(b, c)) },
    { expression: `${operands[0].text} + ${operands[1].text} ÷ ${operands[2].text}`, value: rationalAdd(a, rationalDivide(b, c)) },
    { expression: `[${operands[0].text} + ${operands[1].text}] × ${operands[2].text}`, value: rationalMultiply(rationalAdd(a, b), c) },
    { expression: `${operands[0].text} × ${operands[1].text} − ${operands[2].text}`, value: rationalSubtract(rationalMultiply(a, b), c) },
  ];
  const selected = pick(random, patterns);
  return problem('계산 순서에 맞게 계산하세요.', selected.expression, rationalText(selected.value), '', { promptEn: 'Calculate using the correct order of operations.' });
}

function problem(prompt, expression, answer, answerSuffix = '', extra = {}) {
  return { prompt, expression, answer: String(answer), answerSuffix, ...extra };
}

function integerItem(value) {
  return { value, text: value > 0 ? `+${value}` : String(value), integer: true, natural: value > 0 };
}

function decimalItem(tenths) {
  const value = tenths / 10;
  return { value, text: value > 0 ? `+${value}` : String(value), integer: false, natural: false };
}

function fractionItem(numerator, denominator) {
  const common = gcd(numerator, denominator);
  const n = numerator / common;
  const d = denominator / common;
  if (d === 1) return integerItem(n);
  return { value: n / d, text: `${n > 0 ? '+' : '-'}${Math.abs(n)}/${d}`, integer: false, natural: false };
}

function randomNonInteger(random) {
  if (random() < 0.5) {
    let tenths;
    do tenths = randomInt(random, -49, 49); while (tenths === 0 || tenths % 10 === 0);
    return decimalItem(tenths);
  }
  const denominator = pick(random, [2, 3, 4, 5, 6, 8]);
  let numerator;
  do numerator = randomInt(random, -denominator * 3, denominator * 3); while (numerator === 0 || numerator % denominator === 0);
  return fractionItem(numerator, denominator);
}

function mixedNumberList(random) {
  const items = [integerItem(randomInt(random, 1, 10)), integerItem(-randomInt(random, 1, 10)), integerItem(0)];
  while (items.length < 6) {
    const item = randomNonInteger(random);
    if (!items.some((current) => current.text === item.text)) items.push(item);
  }
  for (let index = items.length - 1; index > 0; index -= 1) {
    const target = randomInt(random, 0, index);
    [items[index], items[target]] = [items[target], items[index]];
  }
  return items;
}

function positiveNegative(random) {
  const amount = randomInt(random, 2, 50);
  const scenarios = [
    [`영상 ${amount}℃`, `${amount}°C above zero`, amount, '℃'], [`영하 ${amount}℃`, `${amount}°C below zero`, -amount, '℃'],
    [`지상 ${amount}층`, `floor ${amount} above ground`, amount, '층'], [`지하 ${amount}층`, `floor ${amount} below ground`, -amount, '층'],
    [`${amount * 1000}원 이익`, `a profit of ${amount * 1000} won`, amount * 1000, '원'], [`${amount * 1000}원 손해`, `a loss of ${amount * 1000} won`, -amount * 1000, '원'],
    [`${amount}m 상승`, `a rise of ${amount} m`, amount, 'm'], [`${amount}m 하강`, `a fall of ${amount} m`, -amount, 'm'],
    [`해발 ${amount}m`, `${amount} m above sea level`, amount, 'm'], [`해수면 아래 ${amount}m`, `${amount} m below sea level`, -amount, 'm'],
  ];
  const [situation, expressionEn, value, suffix] = pick(random, scenarios);
  return problem('다음 상황을 + 또는 − 기호를 사용하여 나타내세요.', situation, value > 0 ? `+${value}` : value, suffix, { promptEn: 'Represent the situation using a + or − sign.', expressionEn });
}

function integerClassification(random) {
  const items = mixedNumberList(random);
  const mode = randomInt(random, 0, 4);
  const questions = [
    ['양의 정수를 모두 쓰세요.', items.filter((item) => item.integer && item.value > 0)],
    ['음의 정수를 모두 쓰세요.', items.filter((item) => item.integer && item.value < 0)],
    ['정수를 모두 쓰세요.', items.filter((item) => item.integer)],
  ];
  const promptsEn = ['List all positive integers.', 'List all negative integers.', 'List all integers.'];
  if (mode < 3) return problem(questions[mode][0], items.map((item) => item.text).join(', '), questions[mode][1].map((item) => item.text).join(', '), '', { promptEn: promptsEn[mode] });
  if (mode === 3) return problem('자연수의 개수를 구하세요.', items.map((item) => item.text).join(', '), items.filter((item) => item.natural).length, '개', { promptEn: 'How many natural numbers are there?' });
  return problem('자연수가 아닌 정수의 개수를 구하세요.', items.map((item) => item.text).join(', '), items.filter((item) => item.integer && !item.natural).length, '개', { promptEn: 'How many integers are not natural numbers?' });
}

function rationalClassification(random) {
  const items = mixedNumberList(random);
  const mode = randomInt(random, 0, 2);
  const selected = mode === 0 ? items.filter((item) => item.value > 0) : mode === 1 ? items.filter((item) => item.value < 0) : items.filter((item) => !item.integer);
  const prompt = mode === 0 ? '양의 유리수를 모두 쓰세요.' : mode === 1 ? '음의 유리수를 모두 쓰세요.' : '정수가 아닌 유리수를 모두 쓰세요.';
  const promptEn = mode === 0 ? 'List all positive rational numbers.' : mode === 1 ? 'List all negative rational numbers.' : 'List all rational numbers that are not integers.';
  return problem(prompt, items.map((item) => item.text).join(', '), selected.map((item) => item.text).join(', '), '', { promptEn });
}

function numberLine(random) {
  const rational = random() < 0.55;
  const step = rational ? 0.5 : 1;
  const min = rational ? -3 : -6;
  const max = rational ? 3 : 6;
  const tick = randomInt(random, 1, Math.round((max - min) / step) - 1);
  const value = min + tick * step;
  return problem('수직선 위의 점 A가 나타내는 수를 구하세요.', '', value, '', { promptEn: 'Find the number represented by point A on the number line.', kind: 'number-line', line: { min, max, step, value, label: 'A' } });
}

function randomRational(random) {
  if (random() < 0.35) return integerItem(randomInt(random, -9, 9));
  return randomNonInteger(random);
}

function absoluteValue(random) {
  const mode = randomInt(random, 0, 2);
  if (mode === 0) {
    const item = randomRational(random);
    const absolute = item.text.replace(/^[-+]/, '');
    return problem('다음 수의 절댓값을 구하세요.', item.text, absolute, '', { promptEn: 'Find the absolute value of the following number.' });
  }
  if (mode === 1) {
    const item = random() < 0.5 ? integerItem(randomInt(random, 1, 12)) : fractionItem(randomInt(random, 1, 12), pick(random, [2, 3, 4, 5]));
    const absolute = item.text.replace(/^[-+]/, '');
    return problem(`절댓값이 ${absolute}인 수를 모두 구하세요.`, '', `-${absolute}, +${absolute}`, '', { promptEn: `List all numbers whose absolute value is ${absolute}.` });
  }
  const items = [];
  while (items.length < 5) {
    const item = randomRational(random);
    if (!items.some((current) => Math.abs(current.value) === Math.abs(item.value))) items.push(item);
  }
  return problem('다음 수를 절댓값이 작은 수부터 차례대로 나열하세요.', items.map((item) => item.text).join(', '), [...items].sort((a, b) => Math.abs(a.value) - Math.abs(b.value)).map((item) => item.text).join(', '), '', { promptEn: 'Order the numbers from the smallest absolute value to the largest.' });
}

function comparison(random) {
  if (random() < 0.75) {
    let left;
    let right;
    do { left = randomRational(random); right = randomRational(random); } while (left.value === right.value);
    return problem('□ 안에 > 또는 < 중 알맞은 기호를 쓰세요.', `${left.text} □ ${right.text}`, left.value > right.value ? '>' : '<', '', { promptEn: 'Write > or < in the box.' });
  }
  const items = [];
  while (items.length < 5) {
    const item = randomRational(random);
    if (!items.some((current) => current.value === item.value)) items.push(item);
  }
  return problem('다음 수를 큰 수부터 차례대로 나열하세요.', items.map((item) => item.text).join(', '), [...items].sort((a, b) => b.value - a.value).map((item) => item.text).join(', '), '', { promptEn: 'Order the numbers from greatest to least.' });
}

function inequalityExpression(random) {
  const a = randomInt(random, -6, 4);
  const b = a + randomInt(random, 2, 7);
  const modes = [
    [`x는 ${a} 이상이다.`, `x is at least ${a}.`, `x ≥ ${a}`], [`x는 ${b} 미만이다.`, `x is less than ${b}.`, `x < ${b}`],
    [`x는 ${a} 초과 ${b} 이하이다.`, `x is greater than ${a} and at most ${b}.`, `${a} < x ≤ ${b}`], [`x는 ${a} 이상 ${b} 미만이다.`, `x is at least ${a} and less than ${b}.`, `${a} ≤ x < ${b}`],
    [`x는 ${a}보다 작지 않다.`, `x is not less than ${a}.`, `x ≥ ${a}`], [`x는 ${b}보다 크지 않다.`, `x is not greater than ${b}.`, `x ≤ ${b}`],
  ];
  const [prompt, expressionEn, answer] = pick(random, modes);
  return problem('다음 문장을 부등호를 사용하여 나타내세요.', prompt, answer, '', { promptEn: 'Write the statement using inequality symbols.', expressionEn });
}

function integerSolutions(random) {
  const lower = randomInt(random, -7, 2);
  const upper = lower + randomInt(random, 3, 8);
  const includeLower = random() < 0.5;
  const includeUpper = random() < 0.5;
  const leftSymbol = includeLower ? '≤' : '<';
  const rightSymbol = includeUpper ? '≤' : '<';
  const values = [];
  for (let value = lower; value <= upper; value += 1) {
    if ((includeLower || value > lower) && (includeUpper || value < upper)) values.push(value);
  }
  return problem('다음 조건을 만족하는 정수를 모두 구하세요.', `${lower} ${leftSymbol} x ${rightSymbol} ${upper}`, values.join(', '), '', { promptEn: 'List all integers that satisfy the condition.' });
}

const mixedGenerators = [positiveNegative, integerClassification, rationalClassification, numberLine, absoluteValue, comparison, inequalityExpression, integerSolutions];
const rationalOperationGenerators = [rationalAddition, rationalSubtraction, rationalAddSubtract, rationalMultiplication, rationalDivision, rationalFourOperations];

export const INTEGER_RATIONAL_BASIC_UNITS = [
  { id: 'positive-negative', label: '양수와 음수', description: '반대되는 상황을 +와 − 기호로 나타내기', en: ['Positive & negative numbers', 'Represent opposite situations with signs'], make: positiveNegative },
  { id: 'integer-classification', label: '정수의 분류', description: '양의 정수·0·음의 정수와 자연수 구분하기', en: ['Classifying integers', 'Classify positive, zero and negative integers'], make: integerClassification },
  { id: 'rational-classification', label: '유리수의 분류', description: '양·음의 유리수와 정수가 아닌 유리수 구분하기', en: ['Classifying rational numbers', 'Classify positive, negative and non-integer rationals'], make: rationalClassification },
  { id: 'number-line', label: '수직선과 좌표', description: '수직선 위 점이 나타내는 정수와 유리수 읽기', en: ['Number lines', 'Read integer and rational coordinates'], make: numberLine },
  { id: 'absolute-value', label: '절댓값', description: '절댓값을 구하고 절댓값의 크기로 수 배열하기', en: ['Absolute value', 'Find and compare absolute values'], make: absoluteValue },
  { id: 'number-comparison', label: '수의 대소관계', description: '유리수의 크기를 비교하고 순서대로 나열하기', en: ['Comparing numbers', 'Compare and order rational numbers'], make: comparison },
  { id: 'inequality-expression', label: '부등호의 사용', description: '문장으로 주어진 범위를 부등호로 나타내기', en: ['Writing inequalities', 'Translate verbal conditions into inequalities'], make: inequalityExpression },
  { id: 'integer-solutions', label: '조건을 만족하는 정수', description: '부등식 범위에 포함되는 정수를 모두 구하기', en: ['Integer solutions', 'List integers satisfying inequalities'], make: integerSolutions },
  { id: 'integer-rational-mixed', label: '정수와 유리수 기본 종합', description: '분류·수직선·절댓값·대소관계·부등호를 골고루 연습하기', en: ['Integers & rationals review', 'Mixed practice across all skills'], make: (random) => pick(random, mixedGenerators)(random) },
  { id: 'rational-addition', label: '유리수의 덧셈', description: '정수·분수·소수의 부호를 포함한 덧셈', en: ['Adding rational numbers', 'Add signed integers, fractions and decimals'], make: rationalAddition },
  { id: 'rational-subtraction', label: '유리수의 뺄셈', description: '정수·분수·소수의 부호를 포함한 뺄셈', en: ['Subtracting rational numbers', 'Subtract signed integers, fractions and decimals'], make: rationalSubtraction },
  { id: 'rational-add-subtract', label: '덧셈과 뺄셈의 혼합 계산', description: '세 수와 네 수의 덧셈·뺄셈 혼합 계산', en: ['Mixed addition & subtraction', 'Calculate expressions with three or four terms'], make: rationalAddSubtract },
  { id: 'rational-multiplication', label: '유리수의 곱셈과 거듭제곱', description: '부호가 있는 수의 곱셈과 거듭제곱', en: ['Multiplication & powers', 'Multiply signed rational numbers and evaluate powers'], make: rationalMultiplication },
  { id: 'rational-division', label: '유리수의 나눗셈과 역수', description: '역수를 이용한 분수·소수·정수의 나눗셈', en: ['Division & reciprocals', 'Divide rational numbers and find reciprocals'], make: rationalDivision },
  { id: 'rational-four-operations', label: '유리수의 사칙 혼합 계산', description: '괄호와 계산 순서를 포함한 사칙 혼합 계산', en: ['Mixed rational operations', 'Use parentheses and the order of operations'], make: rationalFourOperations },
  { id: 'rational-operations-review', label: '유리수의 사칙계산 종합', description: '덧셈·뺄셈·곱셈·나눗셈을 골고루 연습하기', en: ['Rational operations review', 'Mixed practice across all rational operations'], make: (random) => pick(random, rationalOperationGenerators)(random) },
];

export const RPM_INTEGER_RATIONAL_CONCEPT_APPLIED_UNITS = [
  {
    id: 'rpm-ir-sign-situation',
    label: '[유형 01] 부호를 사용하여 나타내기 (서로 반대되는 성질)',
    description: '이익·손해, 해발·해저, 득점·실점, 영상·영하, 증가·감소 등 반대 성질의 부호(+,-) 적용 및 옳은 것/옳지 않은 것 판별',
    en: ['[Type 01] Representing Situations with Signs', 'Apply positive and negative signs to opposing real-world quantities and identify correct statements'],
    make: (random) => rpmIrSignSituation(random),
  },
  {
    id: 'rpm-ir-classify-integers',
    label: '[유형 02] 정수의 분류 및 약분 분수 판별',
    description: '양의 정수(자연수), 0, 음의 정수 분류 및 약분되어 정수가 되는 분수(-4/2, +6/2 등) 함정 구별하기',
    en: ['[Type 02] Integer Classification & Reducible Fractions', 'Classify positive integers, 0, and negative integers; identify fractions that reduce to integers'],
    make: (random) => rpmIrClassifyIntegers(random),
  },
  {
    id: 'rpm-ir-classify-rationals',
    label: '[유형 03] 유리수의 분류 및 체계',
    description: '양의 유리수, 음의 유리수, 정수가 아닌 유리수(분수·소수)의 개수 구하기 및 수 체계 참·거짓 명제 판별',
    en: ['[Type 03] Rational Number Classification & Systems', 'Count positive, negative, and non-integer rational numbers, and evaluate truth values of number systems'],
    make: (random) => rpmIrClassifyRationals(random),
  },
  {
    id: 'rpm-ir-number-line-read',
    label: '[유형 04] 수직선 위의 점과 가장 가까운 정수',
    description: '수직선에 표시된 점 A, B, C, D, E의 유리수 좌표 읽기, 가장 가까운 정수 찾기 및 두 수의 차/합',
    en: ['[Type 04] Points on the Number Line & Closest Integers', 'Read rational coordinates on a number line, find closest integers, and calculate differences/sums'],
    make: (random) => rpmIrNumberLineRead(random),
  },
  {
    id: 'rpm-ir-midpoint-distance',
    label: '[유형 05] 수직선 위 같은 거리(중점)와 양 끝점 역추론',
    description: '두 점으로부터 같은 거리에 있는 중점의 수 구하기, 한 점과 거리 d가 주어졌을 때 반대편 점 좌표 구하기',
    en: ['[Type 05] Equidistant Points (Midpoints) & Endpoints', 'Find the midpoint equidistant from two numbers, or deduce endpoints given distance and one coordinate'],
    make: (random) => rpmIrMidpointDistance(random),
  },
  {
    id: 'rpm-ir-abs-basic-extremum',
    label: '[유형 06] 절댓값의 계산과 최대·최소',
    description: '절댓값의 기본 연산, 절댓값이 가장 큰 수와 가장 작은 수 찾기 및 두 수의 차/합',
    en: ['[Type 06] Absolute Value Calculation & Extrema', 'Compute absolute values, identify numbers with maximum/minimum absolute value, and calculate their sum/difference'],
    make: (random) => rpmIrAbsBasicExtremum(random),
  },
  {
    id: 'rpm-ir-abs-properties',
    label: '[유형 07] 절댓값의 성질과 참·거짓',
    description: '|a| >= 0, 0의 절댓값, 원점과의 거리 성질, 절댓값 관련 명제의 옳고 그름 판별',
    en: ['[Type 07] Properties of Absolute Value & True/False', 'Evaluate statements regarding properties of absolute values, distance from origin, and non-negativity'],
    make: (random) => rpmIrAbsProperties(random),
  },
  {
    id: 'rpm-ir-abs-range-count',
    label: '[유형 08] 절댓값 범위와 조건을 만족하는 정수 개수',
    description: '|x| <= k, m <= |x| < n 범위 및 0 포함 여부에 따른 정수 x의 개수 구하기',
    en: ['[Type 08] Absolute Value Ranges & Integer Counts', 'Count integer solutions satisfying absolute value range conditions |x| <= k or m <= |x| < n'],
    make: (random) => rpmIrAbsRangeCount(random),
  },
  {
    id: 'rpm-ir-opposite-signs-abs',
    label: '[유형 09] 절댓값이 같고 부호가 반대인 두 수',
    description: '수직선 위에서 원점 대칭인 두 점 사이의 거리가 D일 때 두 수 a, b (a > b) 각각 구하기',
    en: ['[Type 09] Numbers with Equal Absolute Value & Opposite Signs', 'Find two opposite-signed numbers with equal absolute value given the distance between them on the number line'],
    make: (random) => rpmIrOppositeSignsAbs(random),
  },
  {
    id: 'rpm-ir-compare-order',
    label: '[유형 10] 유리수와 절댓값의 대소 관계 및 순서',
    description: '양수·음수·절댓값의 대소 비교, 가장 작은 수부터 나열할 때 k번째 수 찾기',
    en: ['[Type 10] Comparing & Ordering Rational Numbers', 'Compare signed numbers and absolute values; find the k-th number when sorted in ascending order'],
    make: (random) => rpmIrCompareOrder(random),
  },
  {
    id: 'rpm-ir-inequality-phrasing',
    label: '[유형 11] 문장 조건의 부등호 표현',
    description: '‘~보다 작지 않다(>=)’, ‘~보다 크지 않다(<=)’, ‘초과·미만’ 등의 일상 언어 조건을 부등호로 바르게 표현하기',
    en: ['[Type 11] Verbal Conditions to Inequality Expressions', 'Accurately convert expressions like "not less than" (>=) and "not greater than" (<=) to inequalities'],
    make: (random) => rpmIrInequalityPhrasing(random),
  },
  {
    id: 'rpm-ir-between-integers-fractions',
    label: '[유형 12] 두 유리수 사이의 정수 및 기약분수 개수',
    description: '두 유리수 A와 B 사이의 정수 개수 및 합, 분모가 d인 기약분수의 개수 구하기',
    en: ['[Type 12] Integers & Irreducible Fractions Between Two Rationals', 'Count integers and irreducible fractions with denominator d between two rational endpoints'],
    make: (random) => rpmIrBetweenIntegersFractions(random),
  },
  {
    id: 'rpm-ir-abs-pairs-ratio',
    label: '[유형 13] 절댓값 조건 응용 및 순서쌍 / 거리 비율',
    description: '|a| + |b| = k를 만족하는 순서쌍 (a, b)의 개수, 수직선 내분 비율 점 역추론',
    en: ['[Type 13] Absolute Value Pairs & Distance Ratios', 'Count ordered pairs satisfying |a| + |b| = k; deduce points dividing number line segments into specific ratios'],
    make: (random) => rpmIrAbsPairsRatio(random),
  },
  {
    id: 'rpm-ir-deduce-multi-order',
    label: '[유형 14] 다중 수의 조건과 수직선 대소 추론',
    description: '여러 조건(부호, 절댓값 관계, 순서)을 만족하는 a, b, c, d의 대소 관계 및 수직선 배치 추론',
    en: ['[Type 14] Multi-variable Deductions & Number Line Ordering', 'Deduce the order of multiple numbers a, b, c, d from compound relational conditions and absolute values'],
    make: (random) => rpmIrDeduceMultiOrder(random),
  },
  {
    id: 'rpm-ir-all-types-mixed',
    label: '[단원 실전 다지기] 매일 정수와 유리수 개념 종합',
    description: '정수와 유리수 핵심 유형 01~14 및 대소 관계·수직선 심화 문제를 골고루 풀어보는 단원 실전 다지기',
    en: ['[Daily Practice Review] Daily Integers & Rationals Comprehensive', 'Comprehensive practice set covering core and advanced concepts of integers and rational numbers'],
    make: (random) => rpmIrAllTypesMixed(random),
  },
];

export const RPM_INTEGER_RATIONAL_CALC_APPLIED_UNITS = [
  {
    id: 'rpm-irc-addition-laws',
    label: '[계산 유형 01·02] 유리수의 덧셈과 계산 법칙',
    description: '덧셈의 교환법칙과 결합법칙의 적용 과정 식별 및 분수·소수의 부호 덧셈 계산',
    en: ['[Calc Type 01·02] Addition of Rationals & Properties', 'Identify commutative/associative laws and compute rational addition'],
    make: (random) => rpmIrcAdditionLaws(random),
  },
  {
    id: 'rpm-irc-subtraction-basic',
    label: '[계산 유형 03] 유리수의 뺄셈',
    description: '빼는 수의 부호를 바꾸어 더하는 유리수의 기본 뺄셈 및 통분 연산',
    en: ['[Calc Type 03] Subtraction of Rational Numbers', 'Subtract rational numbers by adding the opposite and finding common denominators'],
    make: (random) => rpmIrcSubtractionBasic(random),
  },
  {
    id: 'rpm-irc-add-sub-integers',
    label: '[계산 유형 04] 정수의 덧셈과 뺄셈의 혼합 계산',
    description: '여러 정수가 섞인 덧셈과 뺄셈에서 뺄셈을 덧셈으로 고쳐 양수·음수 묶어 계산하기',
    en: ['[Calc Type 04] Mixed Addition & Subtraction of Integers', 'Evaluate mixed sums and differences of multiple integers by grouping signs'],
    make: (random) => rpmIrcAddSubIntegers(random),
  },
  {
    id: 'rpm-irc-add-sub-rationals',
    label: '[계산 유형 05] 유리수의 덧셈과 뺄셈의 혼합 계산',
    description: '분수와 소수가 섞인 덧셈·뺄셈 혼합식 통분 및 상쇄 연산',
    en: ['[Calc Type 05] Mixed Addition & Subtraction of Rationals', 'Compute mixed additions and subtractions involving fractions and decimals'],
    make: (random) => rpmIrcAddSubRationals(random),
  },
  {
    id: 'rpm-irc-omitted-signs',
    label: '[계산 유형 06] 부호가 생략된 수의 덧셈과 뺄셈',
    description: '괄호와 덧셈 기호가 생략된 수의 식을 부호별로 묶어 신속하고 정확하게 계산',
    en: ['[Calc Type 06] Operations with Omitted Parentheses & Signs', 'Evaluate arithmetic expressions where positive signs and parentheses are omitted'],
    make: (random) => rpmIrcOmittedSigns(random),
  },
  {
    id: 'rpm-irc-relative-difference',
    label: '[계산 유형 07] 어떤 수보다 □만큼 큰 수·작은 수',
    description: 'A보다 x만큼 큰 수와 B보다 y만큼 작은 수를 구하고 그 사이 정수의 개수 구하기',
    en: ['[Calc Type 07] Numbers Greater or Less than Given Numbers', 'Find numbers relative to given values and count integers lying between them'],
    make: (random) => rpmIrcRelativeDifference(random),
  },
  {
    id: 'rpm-irc-unknown-add-sub',
    label: '[계산 유형 08] □ 안에 알맞은 수 구하기 (덧셈·뺄셈)',
    description: 'A - □ = B, □ + C = D 꼴의 덧셈·뺄셈 미지수 등식 역연산',
    en: ['[Calc Type 08] Finding the Missing Value (Addition/Subtraction)', 'Solve for missing values □ in addition and subtraction equations'],
    make: (random) => rpmIrcUnknownAddSub(random),
  },
  {
    id: 'rpm-irc-abs-extremum-add-sub',
    label: '[계산 유형 09] 절댓값이 주어진 두 수의 덧셈과 뺄셈',
    description: '|a|, |b|가 주어졌을 때 a - b 또는 a + b의 최댓값(M)과 최솟값(m) 및 M - m 구하기',
    en: ['[Calc Type 09] Addition & Subtraction with Given Absolute Values', 'Find maximum and minimum values of a - b given absolute values |a| and |b|'],
    make: (random) => rpmIrcAbsExtremumAddSub(random),
  },
  {
    id: 'rpm-irc-magic-square-game',
    label: '[계산 유형 10 & 심화] 덧셈·뺄셈의 활용 (마방진 및 게임 점수)',
    description: '가로·세로·대각선의 합이 일정한 마방진 빈칸 추론 및 가위바위보 게임 득점·실점 점수 차',
    en: ['[Calc Type 10 & Advanced] Applications of Add/Sub (Magic Squares & Game Scores)', 'Solve rational magic squares and calculate game score differentials'],
    make: (random) => rpmIrcMagicSquareGame(random),
  },
  {
    id: 'rpm-irc-multiplication-basic',
    label: '[계산 유형 11·13] 유리수의 곱셈과 곱셈의 계산 법칙',
    description: '세 개 이상의 유리수 곱셈에서 음수의 개수에 따른 부호 결정 및 교환·결합법칙',
    en: ['[Calc Type 11·13] Multiplication of Rationals & Properties', 'Determine product signs from negative factors and apply multiplication laws'],
    make: (random) => rpmIrcMultiplicationBasic(random),
  },
  {
    id: 'rpm-irc-pick-three-product',
    label: '[계산 유형 12] 네 수 중 세 수를 뽑아 곱하기',
    description: '네 개의 유리수 중 세 수를 뽑아 곱할 때 가능한 가장 큰 값과 가장 작은 값의 차',
    en: ['[Calc Type 12] Picking 3 out of 4 Numbers to Maximize/Minimize Product', 'Pick three numbers out of four to find maximum and minimum products'],
    make: (random) => rpmIrcPickThreeProduct(random),
  },
  {
    id: 'rpm-irc-powers-signs',
    label: '[계산 유형 14] 거듭제곱의 계산과 부호 판별',
    description: '(-a)^n과 -a^n의 괄호 유무 및 짝수/홀수 지수에 따른 부호와 계산 결과 판별',
    en: ['[Calc Type 14] Calculation of Powers and Sign Rules', 'Evaluate powers with parentheses (-a)^n vs -a^n based on even/odd exponents'],
    make: (random) => rpmIrcPowersSigns(random),
  },
  {
    id: 'rpm-irc-neg-one-power',
    label: '[계산 유형 15] (-1)^n 거듭제곱 식의 계산',
    description: 'n이 짝수 또는 홀수일 때 (-1)^n, (-1)^(n+1), (-1)^(2n) 등이 포함된 다항 식의 값',
    en: ['[Calc Type 15] Powers of (-1)^n for Even and Odd Integers', 'Evaluate algebraic expressions involving powers of -1 based on parity of n'],
    make: (random) => rpmIrcNegOnePower(random),
  },
  {
    id: 'rpm-irc-distributive-law',
    label: '[계산 유형 16] 분배법칙의 활용과 편리한 계산',
    description: 'a × (b + c) = a × b + a × c 분배 및 공통인수를 묶어 10, 100 단위로 암산하기',
    en: ['[Calc Type 16] Distributive Property & Efficient Computation', 'Apply distributive laws forward and reverse to simplify complex products'],
    make: (random) => rpmIrcDistributiveLaw(random),
  },
  {
    id: 'rpm-irc-reciprocal-equation',
    label: '[계산 유형 17] 역수의 정의와 미지수 역수 방정식',
    description: '두 수의 곱이 1이 되는 역수의 성질과 식의 역수가 주어졌을 때 미지수 a, b 구하기',
    en: ['[Calc Type 17] Definition of Reciprocals & Unknowns', 'Find unknowns from reciprocal relations where product equals 1'],
    make: (random) => rpmIrcReciprocalEquation(random),
  },
  {
    id: 'rpm-irc-division-basic',
    label: '[계산 유형 18·19] 정수와 유리수의 나눗셈',
    description: '나누는 수를 역수로 바꾸어 곱셈으로 전환하는 유리수의 나눗셈',
    en: ['[Calc Type 18·19] Division of Integers & Rational Numbers', 'Divide signed rational numbers by multiplying by reciprocals'],
    make: (random) => rpmIrcDivisionBasic(random),
  },
  {
    id: 'rpm-irc-mult-div-mixed',
    label: '[계산 유형 20] 곱셈과 나눗셈의 혼합 계산',
    description: '거듭제곱 먼저 계산 후 나눗셈을 곱셈으로 고쳐 약분하여 푸는 곱셈·나눗셈 혼합식',
    en: ['[Calc Type 20] Mixed Multiplication & Division', 'Evaluate powers first and convert divisions to multiplications to simplify'],
    make: (random) => rpmIrcMultDivMixed(random),
  },
  {
    id: 'rpm-irc-four-operations-order',
    label: '[계산 유형 21] 사칙 혼합 계산 (괄호와 계산 순서)',
    description: '거듭제곱 → 소괄호 → 중괄호 → 대괄호 순서의 사칙연산 우선순위 정밀 계산',
    en: ['[Calc Type 21] Order of Operations with Four Arithmetic Operations', 'Evaluate complex nested expressions following strict precedence rules'],
    make: (random) => rpmIrcFourOperationsOrder(random),
  },
  {
    id: 'rpm-irc-unknown-mult-div',
    label: '[계산 유형 22] □ 안에 알맞은 수 구하기 (곱셈·나눗셈)',
    description: 'A ÷ □ × B = C 꼴에서 곱셈·나눗셈 역연산으로 미지수 □ 구하기',
    en: ['[Calc Type 22] Finding Missing Values in Mult/Div Equations', 'Solve for missing values □ in multiplication and division equations'],
    make: (random) => rpmIrcUnknownMultDiv(random),
  },
  {
    id: 'rpm-irc-correct-answer',
    label: '[계산 유형 23] 바르게 계산한 답 구하기',
    description: '어떤 수에 특정 연산을 잘못 적용한 결과로부터 원래 수를 찾고 바른 답 계산하기',
    en: ['[Calc Type 23] Finding the Correct Answer from Erroneous Operation', 'Recover the original operand from mistaken operation and compute correct result'],
    make: (random) => rpmIrcCorrectAnswer(random),
  },
  {
    id: 'rpm-irc-sign-determination',
    label: '[계산 유형 24] 유리수의 부호 결정',
    description: 'a - b < 0, b/a < 0, ac > 0 등의 부등식 조건으로부터 a, b, c의 부호 논리적 결정',
    en: ['[Calc Type 24] Determining Signs of Rational Variables', 'Logically deduce signs of variables from inequality conditions and products/quotients'],
    make: (random) => rpmIrcSignDetermination(random),
  },
  {
    id: 'rpm-irc-variable-magnitude',
    label: '[계산 유형 25] 문자로 주어진 수의 대소 관계',
    description: 'a < -1 또는 -1 < a < 0일 때 a, -a, a^2, -a^2, 1/a 등의 크기 비교',
    en: ['[Calc Type 25] Comparing Magnitudes of Variable Expressions', 'Compare values of powers and reciprocals when variable lies in specific intervals'],
    make: (random) => rpmIrcVariableMagnitude(random),
  },
  {
    id: 'rpm-irc-line-section-ratio',
    label: '[계산 심화 26] 수직선 선분의 m:n 비례분할 내분점',
    description: '수직선 위의 두 점 A, B 사이의 거리를 m : n으로 내분하는 점 C의 좌표 구하기',
    en: ['[Calc Advanced 26] Dividing a Line Segment in Ratio m:n on Number Line', 'Find coordinates of point dividing segment AB in ratio m:n on number line'],
    make: (random) => rpmIrcLineSectionRatio(random),
  },
  {
    id: 'rpm-irc-telescoping-fractions',
    label: '[계산 발전 27] 부분분수 분해와 망원급수 계산',
    description: '1/(n(n+1)) = 1/n - 1/(n+1) 단위분수 차 분해를 통한 연속 분수합 소거',
    en: ['[Calc Advanced 27] Partial Fraction Decomposition & Telescoping Sum', 'Evaluate telescoping sums using partial fraction decomposition 1/(n(n+1))'],
    make: (random) => rpmIrcTelescopingFractions(random),
  },
  {
    id: 'rpm-irc-custom-operator',
    label: '[계산 발전 28] 새로운 연산 기호 약속과 방정식',
    description: '[a, b] = |a - b| 등 새로 정의된 기호의 연산 규칙 적용 및 미지수 조건 해석',
    en: ['[Calc Advanced 28] Custom Defined Operators & Absolute Equations', 'Solve equations defined by custom binary operations and absolute values'],
    make: (random) => rpmIrcCustomOperator(random),
  },
  {
    id: 'rpm-irc-all-types-mixed',
    label: '[단원 실전 다지기] 매일 정수와 유리수 연산 종합',
    description: '정수와 유리수의 덧셈, 뺄셈, 곱셈, 나눗셈, 사칙혼합 및 심화 규칙을 골고루 풀어보는 단원 실전 다지기',
    en: ['[Daily Practice Review] Daily Rational Operations Comprehensive', 'Comprehensive practice set covering core and advanced operations of integers and rational numbers'],
    make: (random) => rpmIrcAllTypesMixed(random),
  },
];

export const RPM_INTEGER_RATIONAL_APPLIED_UNITS = [
  ...RPM_INTEGER_RATIONAL_CONCEPT_APPLIED_UNITS,
  ...RPM_INTEGER_RATIONAL_CALC_APPLIED_UNITS,
];

export const INTEGER_RATIONAL_UNITS = [...INTEGER_RATIONAL_BASIC_UNITS, ...RPM_INTEGER_RATIONAL_APPLIED_UNITS];

export function findIntegerRationalUnit(unitId) {
  return INTEGER_RATIONAL_UNITS.find((unit) => unit.id === unitId) || INTEGER_RATIONAL_BASIC_UNITS[0];
}

export function localizeIntegerRationalUnit(unit, language, field = 'label') {
  if (language === 'ko') return unit[field];
  return localizeRegionalUnit(unit.id, language, unit.en[field === 'label' ? 0 : 1], field);
}

import {
  rpmIrSignSituation,
  rpmIrClassifyIntegers,
  rpmIrClassifyRationals,
  rpmIrNumberLineRead,
  rpmIrMidpointDistance,
  rpmIrAbsBasicExtremum,
  rpmIrAbsProperties,
  rpmIrAbsRangeCount,
  rpmIrOppositeSignsAbs,
  rpmIrCompareOrder,
  rpmIrInequalityPhrasing,
  rpmIrBetweenIntegersFractions,
  rpmIrAbsPairsRatio,
  rpmIrDeduceMultiOrder,
  rpmIrAllTypesMixed,
  rpmIrcAdditionLaws,
  rpmIrcSubtractionBasic,
  rpmIrcAddSubIntegers,
  rpmIrcAddSubRationals,
  rpmIrcOmittedSigns,
  rpmIrcRelativeDifference,
  rpmIrcUnknownAddSub,
  rpmIrcAbsExtremumAddSub,
  rpmIrcMagicSquareGame,
  rpmIrcMultiplicationBasic,
  rpmIrcPickThreeProduct,
  rpmIrcPowersSigns,
  rpmIrcNegOnePower,
  rpmIrcDistributiveLaw,
  rpmIrcReciprocalEquation,
  rpmIrcDivisionBasic,
  rpmIrcMultDivMixed,
  rpmIrcFourOperationsOrder,
  rpmIrcUnknownMultDiv,
  rpmIrcCorrectAnswer,
  rpmIrcSignDetermination,
  rpmIrcVariableMagnitude,
  rpmIrcLineSectionRatio,
  rpmIrcTelescopingFractions,
  rpmIrcCustomOperator,
  rpmIrcAllTypesMixed,
} from '../rpmAppliedEngine';
import { localizeRegionalUnit } from '../../regionalCatalog';
