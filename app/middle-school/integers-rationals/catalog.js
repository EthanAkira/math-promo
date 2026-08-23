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

export const INTEGER_RATIONAL_UNITS = [
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

export function findIntegerRationalUnit(unitId) {
  return INTEGER_RATIONAL_UNITS.find((unit) => unit.id === unitId) || INTEGER_RATIONAL_UNITS[0];
}

export function localizeIntegerRationalUnit(unit, language, field = 'label') {
  if (language === 'ko') return unit[field];
  return unit.en[field === 'label' ? 0 : 1];
}
