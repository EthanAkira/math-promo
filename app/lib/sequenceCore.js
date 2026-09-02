export const arithmeticTerm = (first, difference, n) => first + (n - 1) * difference;

export const arithmeticSum = (first, difference, n) => n * (2 * first + (n - 1) * difference) / 2;

export const geometricTerm = (first, ratio, n) => first * ratio ** (n - 1);

export const geometricSum = (first, ratio, n) => ratio === 1
  ? first * n
  : first * (ratio ** n - 1) / (ratio - 1);

export const arithmeticValues = (first, difference, count = 5) =>
  Array.from({ length: count }, (_, index) => arithmeticTerm(first, difference, index + 1));

export const geometricValues = (first, ratio, count = 5) =>
  Array.from({ length: count }, (_, index) => geometricTerm(first, ratio, index + 1));

export const naturalSum = (n) => n * (n + 1) / 2;

export const squareSum = (n) => n * (n + 1) * (2 * n + 1) / 6;

export const cubeSum = (n) => naturalSum(n) ** 2;

export function locateTriangularBlock(index) {
  const block = Math.ceil((Math.sqrt(8 * index + 1) - 1) / 2);
  const position = index - naturalSum(block - 1);
  return { block, position };
}

export function iterateRecurrence(first, next, count) {
  const values = [first];
  for (let n = 1; n < count; n += 1) values.push(next(values[n - 1], n));
  return values;
}

export function makeElementarySequencePattern(random, randomInt, pick) {
  const multiplicative = random() < 0.35;
  const first = randomInt(random, 1, multiplicative ? 9 : 30);
  const step = multiplicative ? pick(random, [2, 3, 4]) : pick(random, [2, 3, 4, 5, 10]);
  const values = multiplicative ? geometricValues(first, step, 6) : arithmeticValues(first, step, 6);
  const missingIndex = randomInt(random, 3, 5);
  const displayed = values.map((value, index) => index === missingIndex ? '□' : value);
  return {
    kind: 'inline',
    expression: displayed.join(', '),
    answer: String(values[missingIndex]),
    prompt: '수의 규칙을 찾아 □에 알맞은 수를 구하세요.',
    promptEn: 'Find the pattern and the missing number.',
  };
}

export function makeElementaryGrowingBlockPattern(random, randomInt, pick) {
  const start = randomInt(random, 1, 4);
  const step = pick(random, [1, 2, 3]);
  const target = randomInt(random, 8, 28);
  const { position } = locateTriangularBlock(target);
  const blocks = Array.from({ length: 5 }, (_, blockIndex) =>
    Array.from({ length: blockIndex + 1 }, (_, index) => start + index * step).join(', '));
  return {
    kind: 'word',
    prompt: `(${blocks.join(' | ')})와 같이 수를 묶어 나열할 때 제${target}항을 구하세요.`,
    expression: '',
    answer: String(start + (position - 1) * step),
    promptEn: `The sequence is grouped as (${blocks.join(' | ')}). Find term ${target}.`,
  };
}
