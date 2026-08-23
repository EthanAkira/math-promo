function randomInt(random, min, max) {
  return Math.floor(random() * (max - min + 1)) + min;
}

function pick(random, values) {
  return values[randomInt(random, 0, values.length - 1)];
}

function problem(prompt, expression, answer, answerSuffix = '', promptEn = '') {
  return { prompt, expression, answer: String(answer), answerSuffix, promptEn };
}

function gcd(a, b) {
  let left = Math.abs(a);
  let right = Math.abs(b);
  while (right) [left, right] = [right, left % right];
  return left || 1;
}

function gcdAll(values) {
  return values.reduce((result, value) => gcd(result, value));
}

function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b);
}

function lcmAll(values) {
  return values.reduce((result, value) => lcm(result, value));
}

function divisors(value) {
  const result = [];
  for (let divisor = 1; divisor <= value; divisor += 1) if (value % divisor === 0) result.push(divisor);
  return result;
}

function factorize(value) {
  const factors = [];
  let remaining = value;
  for (let divisor = 2; divisor * divisor <= remaining; divisor += 1) {
    let exponent = 0;
    while (remaining % divisor === 0) { remaining /= divisor; exponent += 1; }
    if (exponent) factors.push([divisor, exponent]);
  }
  if (remaining > 1) factors.push([remaining, 1]);
  return factors;
}

function factorText(value) {
  return factorize(value).map(([prime, exponent]) => exponent === 1 ? String(prime) : `${prime}^${exponent}`).join(' × ');
}

function pairWithGcd(random) {
  const common = randomInt(random, 2, 15);
  let left;
  let right;
  do {
    left = randomInt(random, 2, 10);
    right = randomInt(random, 2, 10);
  } while (left === right || gcd(left, right) !== 1);
  return [common * left, common * right];
}

function numbersWithCommonFactor(random, count = 2) {
  const common = randomInt(random, 2, 12);
  let cofactors;
  do cofactors = Array.from({ length: count }, () => randomInt(random, 2, 12)); while (gcdAll(cofactors) !== 1 || new Set(cofactors).size !== count);
  return cofactors.map((value) => value * common);
}

function commonDivisorsAndGcd(random) {
  const [a, b] = pairWithGcd(random);
  const common = gcd(a, b);
  if (random() < 0.5) return problem('두 수의 공약수를 모두 구하세요.', `${a}, ${b}`, divisors(common).join(', '), '', 'List all common divisors.');
  return problem('두 수의 최대공약수를 구하세요.', `${a}, ${b}`, common, '', 'Find the greatest common divisor.');
}

function gcdBasic(random) {
  const values = numbersWithCommonFactor(random, random() < 0.35 ? 3 : 2);
  return problem('다음 수들의 최대공약수를 구하세요.', values.join(', '), gcdAll(values), '', 'Find the greatest common divisor.');
}

function gcdPrimeForm(random) {
  const values = numbersWithCommonFactor(random, random() < 0.35 ? 3 : 2);
  const answer = gcdAll(values);
  return problem('다음 수들의 최대공약수를 소인수의 곱으로 나타내세요.', values.map(factorText).join(' , '), factorText(answer), '', 'Write the GCF as a product of prime factors.');
}

function coprimeCheck(random) {
  const coprime = random() < 0.5;
  let a;
  let b;
  do {
    a = randomInt(random, 8, 80);
    b = randomInt(random, 8, 80);
  } while (a === b || (gcd(a, b) === 1) !== coprime);
  return problem('두 수가 서로소인지 판별하세요.', `${a}, ${b}`, coprime ? '서로소' : '서로소가 아님', '', 'Decide whether the two numbers are coprime.');
}

function commonMultiplesAndLcm(random) {
  const a = randomInt(random, 3, 15);
  const b = randomInt(random, 4, 18);
  const common = lcm(a, b);
  const mode = randomInt(random, 0, 2);
  if (mode === 0) return problem('두 수의 공배수를 작은 것부터 3개 구하세요.', `${a}, ${b}`, `${common}, ${common * 2}, ${common * 3}`, '', 'Write the first three common multiples.');
  if (mode === 1) return problem('두 수의 최소공배수를 구하세요.', `${a}, ${b}`, common, '', 'Find the least common multiple.');
  const limit = common * randomInt(random, 3, 5);
  return problem(`${limit} 이하인 두 수의 공배수를 모두 구하세요.`, `${a}, ${b}`, Array.from({ length: limit / common }, (_, index) => common * (index + 1)).join(', '), '', `List all common multiples up to ${limit}.`);
}

function lcmBasic(random) {
  let values;
  let answer;
  do {
    values = Array.from({ length: random() < 0.35 ? 3 : 2 }, () => randomInt(random, 4, 36));
    answer = lcmAll(values);
  } while (new Set(values).size !== values.length || answer > 1500);
  return problem('다음 수들의 최소공배수를 구하세요.', values.join(', '), answer, '', 'Find the least common multiple.');
}

function lcmPrimeForm(random) {
  let values;
  let answer;
  do {
    values = Array.from({ length: random() < 0.35 ? 3 : 2 }, () => randomInt(random, 6, 90));
    answer = lcmAll(values);
  } while (new Set(values).size !== values.length || answer > 3000);
  return problem('다음 수들의 최소공배수를 소인수의 곱으로 나타내세요.', values.map(factorText).join(' , '), factorText(answer), '', 'Write the LCM as a product of prime factors.');
}

function gcdLcmRelation(random) {
  const [a, b] = pairWithGcd(random);
  const greatest = gcd(a, b);
  const least = lcm(a, b);
  const mode = randomInt(random, 0, 2);
  if (mode === 0) return problem(`두 자연수 A와 ${b}의 최대공약수가 ${greatest}, 최소공배수가 ${least}일 때 A를 구하세요.`, '', a, '', `The GCF of A and ${b} is ${greatest}, and their LCM is ${least}. Find A.`);
  if (mode === 1) return problem(`두 자연수의 곱이 ${a * b}이고 최소공배수가 ${least}일 때 최대공약수를 구하세요.`, '', greatest, '', `The product is ${a * b} and the LCM is ${least}. Find the GCF.`);
  return problem(`두 자연수의 곱이 ${a * b}이고 최대공약수가 ${greatest}일 때 최소공배수를 구하세요.`, '', least, '', `The product is ${a * b} and the GCF is ${greatest}. Find the LCM.`);
}

function application(random) {
  const mode = randomInt(random, 0, 4);
  if (mode === 0) {
    const [apples, pears] = pairWithGcd(random);
    return problem(`사과 ${apples}개와 배 ${pears}개를 학생들에게 남김없이 똑같이 나누어 주려고 합니다. 나누어 줄 수 있는 학생 수의 최댓값을 구하세요.`, '', gcd(apples, pears), '명');
  }
  if (mode === 1) {
    const [candies, chocolates] = pairWithGcd(random);
    const students = gcd(candies, chocolates);
    return problem(`사탕 ${candies}개와 초콜릿 ${chocolates}개를 최대한 많은 학생에게 남김없이 똑같이 나누어 줍니다. 한 학생이 받는 사탕과 초콜릿 수를 차례대로 구하세요.`, '', `${candies / students}, ${chocolates / students}`, '개');
  }
  if (mode === 2) {
    const intervals = pick(random, [[15, 20], [18, 24], [20, 30], [25, 40], [30, 45]]);
    return problem(`두 버스가 지금 동시에 출발합니다. 한 버스는 ${intervals[0]}분마다, 다른 버스는 ${intervals[1]}분마다 출발할 때, 다시 동시에 출발하는 것은 몇 분 후인가요?`, '', lcm(...intervals), '분 후');
  }
  if (mode === 3) {
    const [width, height] = pairWithGcd(random);
    return problem(`가로 ${width}cm, 세로 ${height}cm인 직사각형을 남김없이 가장 큰 정사각형들로 나누려고 합니다. 정사각형 한 변의 길이는 몇 cm인가요?`, '', gcd(width, height), 'cm');
  }
  const intervals = pick(random, [[8, 12], [10, 15], [12, 18], [14, 21], [16, 24]]);
  return problem(`두 전구가 지금 동시에 켜졌습니다. 각각 ${intervals[0]}초, ${intervals[1]}초마다 켜질 때 다시 동시에 켜지는 것은 몇 초 후인가요?`, '', lcm(...intervals), '초 후');
}

const mixedGenerators = [commonDivisorsAndGcd, gcdBasic, gcdPrimeForm, coprimeCheck, commonMultiplesAndLcm, lcmBasic, lcmPrimeForm, gcdLcmRelation, application];

export const GCD_LCM_UNITS = [
  { id: 'common-divisors-gcd', label: '공약수와 최대공약수', description: '두 수의 공약수와 최대공약수 구하기', en: ['Common divisors & GCF', 'Find common divisors and the greatest common divisor'], make: commonDivisorsAndGcd },
  { id: 'gcd-basic', label: '최대공약수 기본', description: '두세 자연수의 최대공약수 구하기', en: ['GCF basics', 'Find the GCF of two or three numbers'], make: gcdBasic },
  { id: 'gcd-prime-form', label: '최대공약수와 소인수분해', description: '소인수분해된 수들의 최대공약수 구하기', en: ['GCF from prime factors', 'Find the GCF from prime factorizations'], make: gcdPrimeForm },
  { id: 'coprime', label: '서로소 판별', description: '두 수의 최대공약수가 1인지 판별하기', en: ['Coprime numbers', 'Decide whether two numbers are coprime'], make: coprimeCheck },
  { id: 'common-multiples-lcm', label: '공배수와 최소공배수', description: '공배수를 나열하고 최소공배수 구하기', en: ['Common multiples & LCM', 'List common multiples and find the LCM'], make: commonMultiplesAndLcm },
  { id: 'lcm-basic', label: '최소공배수 기본', description: '두세 자연수의 최소공배수 구하기', en: ['LCM basics', 'Find the LCM of two or three numbers'], make: lcmBasic },
  { id: 'lcm-prime-form', label: '최소공배수와 소인수분해', description: '소인수분해된 수들의 최소공배수 구하기', en: ['LCM from prime factors', 'Find the LCM from prime factorizations'], make: lcmPrimeForm },
  { id: 'gcd-lcm-relation', label: '최대공약수와 최소공배수의 관계', description: '두 수의 곱과 최대·최소공배수의 관계 활용하기', en: ['Relationship between GCF & LCM', 'Use product = GCF × LCM'], make: gcdLcmRelation },
  { id: 'gcd-lcm-application', label: '최대공약수와 최소공배수 활용', description: '나누기·묶기·주기적인 상황의 문장제 해결하기', en: ['GCF & LCM applications', 'Solve grouping and repeating-cycle word problems'], make: application },
  { id: 'gcd-lcm-mixed', label: '최대공약수와 최소공배수 종합', description: '공약수·공배수·서로소·관계·활용을 골고루 연습하기', en: ['GCF & LCM review', 'Mixed practice across all skills'], make: (random) => pick(random, mixedGenerators)(random) },
];

export function findGcdLcmUnit(unitId) {
  return GCD_LCM_UNITS.find((unit) => unit.id === unitId) || GCD_LCM_UNITS[0];
}

export function localizeGcdLcmUnit(unit, language, field = 'label') {
  if (language === 'ko') return unit[field];
  return unit.en[field === 'label' ? 0 : 1];
}
