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
];

export function findIntegerRationalUnit(unitId) {
  return INTEGER_RATIONAL_UNITS.find((unit) => unit.id === unitId) || INTEGER_RATIONAL_UNITS[0];
}

export function localizeIntegerRationalUnit(unit, language, field = 'label') {
  if (language === 'ko') return unit[field];
  return unit.en[field === 'label' ? 0 : 1];
}
