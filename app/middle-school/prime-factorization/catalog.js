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
  return {
    ...problem('다음 수가 소수인지 합성수인지 고르세요.', value, prime ? '1' : '2', '', 'Choose whether the number is prime or composite.'),
    choices: [
      { value: '1', label: '소수', labelEn: 'Prime' },
      { value: '2', label: '합성수', labelEn: 'Composite' },
    ],
  };
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

export const PRIME_BASIC_UNITS = [
  { id: 'prime-composite', label: '소수와 합성수', description: '자연수가 소수인지 합성수인지 판별하기', en: ['Primes and composites', 'Classify numbers as prime or composite'], make: primeComposite },
  { id: 'powers', label: '거듭제곱과 지수', description: '밑과 지수를 찾고 같은 수의 곱을 거듭제곱으로 나타내기', en: ['Powers and exponents', 'Identify bases and exponents; write repeated products'], make: powers },
  { id: 'power-form', label: '거듭제곱으로 나타내기', description: '자연수를 주어진 밑의 거듭제곱으로 나타내기', en: ['Writing powers', 'Express a number as a power of a given base'], make: powerForm },
  { id: 'prime-factorization', label: '소인수분해', description: '자연수를 소인수분해하고 소인수 찾기', en: ['Prime factorization', 'Factor numbers and identify their prime factors'], make: primeFactorization },
  { id: 'all-divisors', label: '약수 모두 구하기', description: '소인수분해를 이용해 약수를 빠짐없이 구하기', en: ['Listing divisors', 'Use prime factorization to list every divisor'], make: allDivisors },
  { id: 'divisor-count', label: '약수의 개수', description: '소인수의 지수를 이용해 약수의 개수 구하기', en: ['Number of divisors', 'Use exponents to count divisors'], make: divisorCount },
  { id: 'prime-mixed', label: '소인수분해 기본 종합', description: '소수·거듭제곱·소인수분해·약수 유형을 골고루 연습하기', en: ['Prime factorization review', 'Mixed practice with primes, powers, factors and divisors'], make: (random) => pick(random, generators)(random) },
];

import {
  rpmPrimePropClosest,
  rpmPrimePowerRules,
  rpmPrimeFactorizeExponents,
  rpmPrimeFactorAnalysis,
  rpmPrimeDivisorProperties,
  rpmPrimeDivisorCountReverse,
  rpmPrimeMakeSquare,
  rpmPrimeUnknownInDivisorCount,
  rpmPrimeDivisorCountReverseDeduce,
  rpmPrimeAllTypesMixed,
} from '../rpmAppliedEngine.js';

export const RPM_PRIME_APPLIED_UNITS = [
  {
    id: 'rpm-prime-prop-closest',
    label: '[유형 01] 소수와 합성수의 성질 및 추론',
    description: '소수·합성수 참/거짓 판별, 특정 수에 가장 가까운 소수·합성수 합 및 개수 구하기',
    en: ['[Type 01] Properties of Primes & Composites', 'Determine prime/composite properties, find closest primes/composites and count'],
    make: rpmPrimePropClosest,
  },
  {
    id: 'rpm-prime-power-rules',
    label: '[유형 02] 거듭제곱의 성질과 일의 자리 규칙',
    description: '거듭제곱 표현 판별, 거듭제곱 방정식 m^a=p, 거듭제곱의 일의 자리 수의 주기성 규칙',
    en: ['[Type 02] Power Rules & Units Digits', 'Verify power expressions, solve base-power equations, and find units digits via periodicity'],
    make: rpmPrimePowerRules,
  },
  {
    id: 'rpm-prime-factorize-exponents',
    label: '[유형 03] 소인수분해와 지수 연산',
    description: '소인수분해 바르게 된 것 판별 및 2^a×3^b×c 꼴에서 소인수와 지수의 대수식 계산',
    en: ['[Type 03] Prime Factorization & Exponent Algebra', 'Identify correct factorization forms and compute linear expressions in prime factors and exponents'],
    make: rpmPrimeFactorizeExponents,
  },
  {
    id: 'rpm-prime-factor-analysis',
    label: '[유형 04] 소인수의 합과 소인수 분석',
    description: '소인수의 합, 같은 소인수를 갖는 수 찾기, 소인수 종류가 다른 수 판별',
    en: ['[Type 04] Prime Factor Sums & Set Analysis', 'Find sum of prime factors, identify numbers with identical prime factor sets, and find outliers'],
    make: rpmPrimeFactorAnalysis,
  },
  {
    id: 'rpm-prime-divisor-properties',
    label: '[유형 05] 약수와 거듭제곱 약수의 성질',
    description: '소인수분해를 이용한 약수 판별, 완전제곱수가 되는 약수의 개수, 두 번째로 큰/작은 약수',
    en: ['[Type 05] Divisor Properties & Square Divisors', 'Identify valid divisors, count square divisors, and find 2nd largest and 2nd smallest divisors'],
    make: rpmPrimeDivisorProperties,
  },
  {
    id: 'rpm-prime-divisor-count-reverse',
    label: '[유형 06] 약수의 개수 공식과 미지수 지수',
    description: '약수의 개수 공식을 이용한 지수 미지수 n 구하기, 2^4×a^2의 약수 개수로 최소 자연수 구하기',
    en: ['[Type 06] Divisor Counting Formula & Exponent Reverse', 'Find unknown exponents from divisor counts and deduce smallest numbers with given divisor counts'],
    make: rpmPrimeDivisorCountReverse,
  },
  {
    id: 'rpm-prime-make-square',
    label: '[유형 07] 제곱인 수 만들기',
    description: '자연수를 곱하거나 나누어 어떤 수의 제곱 만들기, 두 번째로 작은 곱하는 수 구하기',
    en: ['[Type 07] Making Perfect Squares', 'Multiply or divide by minimal natural numbers to create squares; find 2nd smallest multiplier'],
    make: rpmPrimeMakeSquare,
  },
  {
    id: 'rpm-prime-unknown-in-divisor-count',
    label: '[유형 08] 약수의 개수가 주어질 때 □ 구하기',
    description: 'N×□의 약수의 개수가 주어질 때 □에 들어갈 수 있는 수/없는 수 및 가장 작은 자연수',
    en: ['[Type 08] Finding Box Value in Divisor Counts', 'Determine valid or invalid natural numbers in N × □ to yield given divisor count'],
    make: rpmPrimeUnknownInDivisorCount,
  },
  {
    id: 'rpm-prime-divisor-count-reverse-deduce',
    label: '[유형 09] 약수의 개수가 n개인 자연수 추론',
    description: '약수 개수 함수 f(A)×f(x)=B 역추론, 약수 개수가 6개인 수의 개수, 소인수 조건이 주어진 최소 수',
    en: ['[Type 09] Deducing Numbers with n Divisors', 'Solve f(A)×f(x)=B, count numbers with exactly 6 divisors in a range, and deduce constrained minimums'],
    make: rpmPrimeDivisorCountReverseDeduce,
  },
  {
    id: 'rpm-prime-all-types-mixed',
    label: '[단원 실전 다지기] 매일 소인수분해 종합',
    description: '소인수분해 핵심 유형 01~09 및 발전·심화 문제를 골고루 풀어보는 단원 실전 다지기',
    en: ['[Daily Practice Review] Daily Prime Factorization Comprehensive', 'Comprehensive practice set covering core and advanced prime factorization problem types'],
    make: rpmPrimeAllTypesMixed,
  },
];

export const PRIME_UNITS = [...PRIME_BASIC_UNITS, ...RPM_PRIME_APPLIED_UNITS];

export function findPrimeUnit(unitId) {
  return PRIME_UNITS.find((unit) => unit.id === unitId) || PRIME_BASIC_UNITS[0];
}

export function localizePrimeUnit(unit, language, field = 'label') {
  if (language === 'ko') return unit[field];
  return localizeRegionalUnit(unit.id, language, unit.en[field === 'label' ? 0 : 1], field);
}
import { localizeRegionalUnit } from '../../regionalCatalog.js';
