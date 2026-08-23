function randomInt(random, min, max) {
  return Math.floor(random() * (max - min + 1)) + min;
}

function pick(random, values) {
  return values[randomInt(random, 0, values.length - 1)];
}

function problem(prompt, expression, answer, answerSuffix = '', promptEn = '') {
  return { prompt, expression, answer: String(answer), answerSuffix, promptEn };
}

const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];

function isPrime(value) {
  if (value < 2) return false;
  for (let divisor = 2; divisor * divisor <= value; divisor += 1) {
    if (value % divisor === 0) return false;
  }
  return true;
}

function factorize(value) {
  const factors = [];
  let remaining = value;
  for (let divisor = 2; divisor * divisor <= remaining; divisor += 1) {
    let exponent = 0;
    while (remaining % divisor === 0) {
      remaining /= divisor;
      exponent += 1;
    }
    if (exponent) factors.push([divisor, exponent]);
  }
  if (remaining > 1) factors.push([remaining, 1]);
  return factors;
}

function factorText(factors) {
  return factors.map(([prime, exponent]) => exponent === 1 ? String(prime) : `${prime}^${exponent}`).join(' × ');
}

function divisorsOf(value) {
  const values = [];
  for (let divisor = 1; divisor <= value; divisor += 1) {
    if (value % divisor === 0) values.push(divisor);
  }
  return values;
}

function randomComposite(random, max = 500) {
  let value;
  do value = randomInt(random, 4, max); while (isPrime(value));
  return value;
}

function primeComposite(random) {
  const prime = random() < 0.45;
  const value = prime ? pick(random, PRIMES) : randomComposite(random, 100);
  return problem('다음 수가 소수인지 합성수인지 쓰세요.', value, prime ? '소수' : '합성수', '', 'Write whether the number is prime or composite.');
}

function powers(random) {
  const base = randomInt(random, 2, 9);
  const exponent = randomInt(random, 2, 6);
  if (random() < 0.5) {
    return problem('다음 거듭제곱의 밑과 지수를 차례대로 쓰세요.', `${base}^${exponent}`, `${base}, ${exponent}`, '', 'Write the base and exponent in order.');
  }
  return problem('다음 곱을 거듭제곱으로 나타내세요.', Array.from({ length: exponent }, () => base).join(' × '), `${base}^${exponent}`, '', 'Write the product using an exponent.');
}

function powerForm(random) {
  const base = randomInt(random, 2, 10);
  const exponent = randomInt(random, 2, base <= 4 ? 6 : 4);
  const value = base ** exponent;
  return problem(`다음 수를 ${base}의 거듭제곱으로 나타내세요.`, value, `${base}^${exponent}`, '', `Write the number as a power of ${base}.`);
}

function factorizationValue(random, max = 1000) {
  const candidates = [];
  for (let value = 12; value <= max; value += 1) {
    const factors = factorize(value);
    if (factors.length >= 2 || factors.some(([, exponent]) => exponent >= 2)) candidates.push(value);
  }
  return pick(random, candidates);
}

function primeFactorization(random) {
  const value = factorizationValue(random);
  const factors = factorize(value);
  if (random() < 0.7) return problem('다음 수를 소인수분해하세요.', value, factorText(factors), '', 'Find the prime factorization.');
  return problem('다음 수의 소인수를 모두 쓰세요.', value, factors.map(([prime]) => prime).join(', '), '', 'List all prime factors.');
}

function allDivisors(random) {
  let value;
  let divisors;
  do {
    value = randomComposite(random, 240);
    divisors = divisorsOf(value);
  } while (divisors.length > 12);
  return problem('다음 수의 약수를 모두 구하세요.', value, divisors.join(', '), '', 'List all divisors of the number.');
}

function divisorCount(random) {
  const value = factorizationValue(random, 500);
  const factors = factorize(value);
  const answer = factors.reduce((count, [, exponent]) => count * (exponent + 1), 1);
  const showFactorization = random() < 0.55;
  return problem('다음 수의 약수의 개수를 구하세요.', showFactorization ? factorText(factors) : value, answer, '개', 'Find the number of divisors.');
}

const generators = [primeComposite, powers, powerForm, primeFactorization, allDivisors, divisorCount];

export const PRIME_UNITS = [
  { id: 'prime-composite', label: '소수와 합성수', description: '자연수가 소수인지 합성수인지 판별하기', en: ['Primes and composites', 'Classify numbers as prime or composite'], make: primeComposite },
  { id: 'powers', label: '거듭제곱과 지수', description: '밑과 지수를 찾고 같은 수의 곱을 거듭제곱으로 나타내기', en: ['Powers and exponents', 'Identify bases and exponents; write repeated products'], make: powers },
  { id: 'power-form', label: '거듭제곱으로 나타내기', description: '자연수를 주어진 밑의 거듭제곱으로 나타내기', en: ['Writing powers', 'Express a number as a power of a given base'], make: powerForm },
  { id: 'prime-factorization', label: '소인수분해', description: '자연수를 소인수분해하고 소인수 찾기', en: ['Prime factorization', 'Factor numbers and identify their prime factors'], make: primeFactorization },
  { id: 'all-divisors', label: '약수 모두 구하기', description: '소인수분해를 이용해 약수를 빠짐없이 구하기', en: ['Listing divisors', 'Use prime factorization to list every divisor'], make: allDivisors },
  { id: 'divisor-count', label: '약수의 개수', description: '소인수의 지수를 이용해 약수의 개수 구하기', en: ['Number of divisors', 'Use exponents to count divisors'], make: divisorCount },
  { id: 'prime-mixed', label: '소인수분해 기본 종합', description: '소수·거듭제곱·소인수분해·약수 유형을 골고루 연습하기', en: ['Prime factorization review', 'Mixed practice with primes, powers, factors and divisors'], make: (random) => pick(random, generators)(random) },
];

export function findPrimeUnit(unitId) {
  return PRIME_UNITS.find((unit) => unit.id === unitId) || PRIME_UNITS[0];
}

export function localizePrimeUnit(unit, language, field = 'label') {
  if (language !== 'en') return unit[field];
  return unit.en[field === 'label' ? 0 : 1];
}
