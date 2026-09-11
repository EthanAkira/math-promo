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

export const GCD_LCM_BASIC_UNITS = [
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

import {
  rpmGcdBasicCoprime,
  rpmGcdCommonDivisorProp,
  rpmLcmCommonMultipleProp,
  rpmGcdLcmExponentDeduce,
  rpmGcdLcmProductRelation,
  rpmLcmThreeNumbersRatio,
  rpmGcdWordDistribute,
  rpmGcdWordTileFence,
  rpmGcdWordRemainder,
  rpmLcmWordBrickCube,
  rpmLcmWordGearTrackCycle,
  rpmLcmWordRemainderDeficit,
  rpmGcdLcmFractionMultiplier,
  rpmGcdLcmAdvancedDeduce,
  rpmGcdLcmAllTypesMixed,
} from '../rpmAppliedEngine.js';

export const RPM_GCD_LCM_APPLIED_UNITS = [
  {
    id: 'applied-gcd-coprime',
    label: '[유형 01·02] 최대공약수와 서로소',
    description: '소인수분해를 이용한 최대공약수, 서로소 판별, 특정 범위 내 서로소의 개수 및 미지수 구하기',
    en: ['[Type 01·02] GCF & Coprime Numbers', 'Find GCF from prime factors, determine coprime pairs, count coprimes, and deduce unknowns'],
    make: rpmGcdBasicCoprime,
  },
  {
    id: 'applied-gcd-common-divisor-prop',
    label: '[유형 03] 공약수와 최대공약수의 성질',
    description: '공약수는 최대공약수의 약수임을 활용, 소인수분해를 이용한 공약수의 개수, 세 수의 최대공약수 추론',
    en: ['[Type 03] Common Divisor Properties', 'Use GCF divisor properties, count common divisors via prime factorization, and chain 3-number GCF'],
    make: rpmGcdCommonDivisorProp,
  },
  {
    id: 'applied-lcm-common-multiple-prop',
    label: '[유형 04·05] 최소공배수와 공배수의 성질',
    description: '소인수분해를 이용한 최소공배수, 특정 수 이하의 공배수 개수, 특정 수에 가장 가까운 공배수',
    en: ['[Type 04·05] LCM & Common Multiples Properties', 'Find LCM from prime factors, count common multiples up to a limit, and find closest multiple'],
    make: rpmLcmCommonMultipleProp,
  },
  {
    id: 'applied-gcd-lcm-exponent-deduce',
    label: '[유형 06] 소인수분해 지수와 최대공약수·최소공배수 역추적',
    description: '최대공약수와 최소공배수가 주어질 때 소인수 지수 미지수 a, b, c 역추적 및 미지수의 약수 개수',
    en: ['[Type 06] Prime Exponent Reverse Deduction', 'Reverse deduce prime exponents from given GCF and LCM, and compute divisor counts'],
    make: rpmGcdLcmExponentDeduce,
  },
  {
    id: 'applied-gcd-lcm-product-relation',
    label: '[유형 07] 두 수의 곱과 최대공약수·최소공배수의 관계',
    description: 'A × B = G × L 공식 활용, 두 수의 곱과 최대공약수가 주어질 때 두 자리 자연수 A + B 역추적',
    en: ['[Type 07] Product & GCF-LCM Relationship', 'Apply A × B = G × L, and deduce 2-digit natural numbers A + B from product and GCF'],
    make: rpmGcdLcmProductRelation,
  },
  {
    id: 'applied-lcm-three-numbers-ratio',
    label: '[유형 08] 미지수 x를 포함한 세 수의 최소공배수와 비',
    description: 'ax, bx, cx의 최소공배수로부터 x 및 최대공약수 구하기, 세 수의 비 a:b:c와 최소공배수로 가장 큰 수/합 구하기',
    en: ['[Type 08] Three Numbers with Unknown x & Ratios', 'Find x and GCF from LCM of ax, bx, cx; find largest number and sum given ratio a:b:c and LCM'],
    make: rpmLcmThreeNumbersRatio,
  },
  {
    id: 'applied-gcd-word-distribute',
    label: '[유형 09] 최대공약수 활용 — 남김없이 똑같이 나누어주기',
    description: '물품을 가능한 한 많은 사람에게 똑같이 나누어주기, 조 나누기 및 한 조의 인원수 합 a + b',
    en: ['[Type 09] GCF Word Problems: Equal Distribution', 'Divide items equally among maximal recipients, team division, and team member sum a + b'],
    make: rpmGcdWordDistribute,
  },
  {
    id: 'applied-gcd-word-tile-fence',
    label: '[유형 10·11] 최대공약수 활용 — 직사각형 채우기 및 둘레에 일정한 간격 놓기',
    description: '직사각형 벽면에 가장 큰 정사각형 타일 붙이기(타일 수 및 변의 길이), 둘레와 네 모퉁이에 기둥 세우기',
    en: ['[Type 10·11] GCF Word Problems: Tiling & Fence Posts', 'Cover rectangle with largest square tiles, and install fence posts at equal intervals including corners'],
    make: rpmGcdWordTileFence,
  },
  {
    id: 'applied-gcd-word-remainder',
    label: '[유형 12] 최대공약수 활용 — 나누었을 때 나머지가 남거나 부족한 수',
    description: '나누면 나머지가 남는 수, 부족한 수가 주어질 때 가장 큰 자연수 및 가능한 수 중 최댓값과 최솟값의 합',
    en: ['[Type 12] GCF Word Problems: Remainders & Deficits', 'Find greatest divisor given remainders/deficits, and find sum of maximum and minimum valid divisors'],
    make: rpmGcdWordRemainder,
  },
  {
    id: 'applied-lcm-word-brick-cube',
    label: '[유형 13] 최소공배수 활용 — 정사각형 타일 붙이기 및 정육면체 벽돌 쌓기',
    description: '직사각형 타일을 붙여 가장 작은 정사각형 만들기, 직육면체 벽돌을 쌓아 가장 작은 정육면체 만들기',
    en: ['[Type 13] LCM Word Problems: Tiles to Square & Bricks to Cube', 'Assemble rectangular tiles into smallest square, stack rectangular bricks into smallest cube'],
    make: rpmLcmWordBrickCube,
  },
  {
    id: 'applied-lcm-word-gear-track-cycle',
    label: '[유형 14·15] 최소공배수 활용 — 톱니바퀴 회전 및 주기성(동시 출발)',
    description: '맞물려 도는 두 개·세 개의 톱니바퀴 회전수, 배차 간격 동시 출발, 네온사인 점등·소등 주기',
    en: ['[Type 14·15] LCM Word Problems: Meshed Gears & Repeating Cycles', 'Rotations of 2 or 3 meshed gears, simultaneous departure intervals, and neon light cycle periodicity'],
    make: rpmLcmWordGearTrackCycle,
  },
  {
    id: 'applied-lcm-word-remainder-deficit',
    label: '[유형 16] 최소공배수 활용 — 어떤 자연수를 나누었을 때 나머지 조건',
    description: '어느 수로 나누어도 r이 남는 가장 작은 세 자리 자연수, 나누는 수와 나머지의 차가 일정한 부족 조건의 수',
    en: ['[Type 16] LCM Word Problems: Divisor Remainder & Deficit Conditions', 'Smallest 3-digit number with constant remainder, and constant deficit numbers (divisor minus remainder)'],
    make: rpmLcmWordRemainderDeficit,
  },
  {
    id: 'applied-gcd-lcm-fraction-multiplier',
    label: '[유형 17] 두 개 이상의 분수를 자연수로 만드는 가장 작은 기약분수',
    description: '두 분수·세 분수(대분수 포함)에 곱하여 자연수가 되는 가장 작은 기약분수 B/A, 분모가 되는 두 자리 자연수의 개수',
    en: ['[Type 17] Smallest Fraction Multiplier for Integers', 'Smallest irreducible fraction B/A to multiply fractions (including mixed) into integers; count 2-digit denominators'],
    make: rpmGcdLcmFractionMultiplier,
  },
  {
    id: 'applied-gcd-lcm-advanced-deduce',
    label: '[유형 18·19·20 & 실력UP] 최소공배수 역추적, 합/차 조건, 종합 실력',
    description: '세 수의 최소공배수가 주어질 때 미지수 후보들의 합, 최대공약수와 최소공배수 및 차 A-B가 주어질 때 A+B, 최댓값과 최솟값의 합',
    en: ['[Type 18·19·20 & Challenge] Advanced Reverse Deduction & Sum/Diff Conditions', 'Deduce candidates for unknown number from LCM, find A+B given GCF, LCM, and diff A-B, find max+min'],
    make: rpmGcdLcmAdvancedDeduce,
  },
  {
    id: 'applied-gcd-lcm-all-types-mixed',
    label: '[단원 실전 다지기] 매일 최대공약수와 최소공배수 종합',
    description: '최대공약수와 최소공배수 핵심 유형 01~20 및 활용·심화 문제를 골고루 풀어보는 단원 실전 다지기',
    en: ['[Daily Practice Review] Daily GCD & LCM Comprehensive', 'Comprehensive practice set covering core and advanced GCD & LCM problem types'],
    make: rpmGcdLcmAllTypesMixed,
  },
];

export const GCD_LCM_UNITS = [...GCD_LCM_BASIC_UNITS, ...RPM_GCD_LCM_APPLIED_UNITS];

export function findGcdLcmUnit(unitId) {
  return GCD_LCM_UNITS.find((unit) => unit.id === unitId) || GCD_LCM_BASIC_UNITS[0];
}

export function localizeGcdLcmUnit(unit, language, field = 'label') {
  if (language === 'ko') return unit[field];
  return localizeRegionalUnit(unit.id, language, unit.en[field === 'label' ? 0 : 1], field);
}
import { localizeRegionalUnit } from '../../regionalCatalog';
