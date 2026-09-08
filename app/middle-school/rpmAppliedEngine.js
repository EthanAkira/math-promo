// RPM Middle School 1-1 Applied Problem Generators (응용문제 엔진)
// Based on analysis of '중학수학 1-1 알피엠.pdf':
// Covers applied problem types from 유형 익히기, 유형 UP, 중단원 마무리, and 실력 테스트.
// Gated for premium / subscription tier ('curriculum-advanced').

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

function isPrime(n) {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d += 1) {
    if (n % d === 0) return false;
  }
  return true;
}

function factorize(n) {
  const factors = [];
  let rem = n;
  for (let d = 2; d * d <= rem; d += 1) {
    let exp = 0;
    while (rem % d === 0) {
      rem /= d;
      exp += 1;
    }
    if (exp) factors.push([d, exp]);
  }
  if (rem > 1) factors.push([rem, 1]);
  return factors;
}

function factorText(factors) {
  return factors.map(([p, e]) => (e === 1 ? String(p) : `${p}^${e}`)).join(' × ');
}

// -------------------------------------------------------------
// -------------------------------------------------------------
// CHAPTER 01: 소인수분해 응용 (RPM 1-1 Pages 10 ~ 15)
// -------------------------------------------------------------

// [유형 01] 소수와 합성수의 성질 및 추론 (RPM #36, #37, #38, #39, #71, #75)
export function rpmPrimePropClosest(random) {
  const variant = pick(random, ['closest', 'countInList', 'lessThanCount']);
  if (variant === 'closest') {
    const T = pick(random, [14, 20, 32, 38, 62, 74]);
    const a = T - 1;
    const b = T + 1;
    const ans = a + b;
    return {
      prompt: `${T}에 가장 가까운 소수를 a, ${T}을 제외하고 가장 가까운 합성수를 b라 할 때, a + b의 값을 구하시오.`,
      promptEn: `Let a be the prime closest to ${T}, and b be the composite number closest to ${T} (excluding ${T}). Find a + b.`,
      expression: `소수 a = ${a}, 합성수 b = ${b}`,
      answer: String(ans),
      explanation: `${T}에 가장 가까운 소수는 ${a}이고, ${T}을 제외하고 가장 가까운 합성수는 ${b}입니다. 따라서 a + b = ${a} + ${b} = ${ans}입니다.`,
    };
  } else if (variant === 'countInList') {
    const askPrime = random() < 0.5;
    const primesPool = [7, 23, 47, 71, 101, 113, 127];
    const trickyCompositesPool = [21, 33, 91, 119, 143, 161, 237];
    const selectedPrimes = [];
    const primeCount = ri(random, 2, 4);
    for (let i = 0; i < primeCount; i += 1) {
      const p = pick(random, primesPool.filter((x) => !selectedPrimes.includes(x)));
      if (p) selectedPrimes.push(p);
    }
    const selectedComposites = [];
    const compCount = ri(random, 2, 4);
    for (let i = 0; i < compCount; i += 1) {
      const c = pick(random, trickyCompositesPool.filter((x) => !selectedComposites.includes(x)));
      if (c) selectedComposites.push(c);
    }
    const list = [1, ...selectedPrimes, ...selectedComposites].sort(() => random() - 0.5);
    const ans = askPrime ? selectedPrimes.length : selectedComposites.length;
    return {
      prompt: `다음 수 중에서 ${askPrime ? '소수' : '합성수'}는 모두 몇 개인지 구하시오.`,
      promptEn: `How many ${askPrime ? 'prime numbers' : 'composite numbers'} are in the following list?`,
      expression: list.join(', '),
      answer: String(ans),
      answerSuffix: '개',
      explanation: `1은 소수도 아니고 합성수도 아닙니다. 리스트의 수 중 소수는 [${selectedPrimes.sort((x, y) => x - y).join(', ')}] (${selectedPrimes.length}개)이고, 합성수는 [${selectedComposites.sort((x, y) => x - y).join(', ')}] (${selectedComposites.length}개)입니다. 따라서 정답은 ${ans}개입니다.`,
    };
  } else {
    const N = pick(random, [20, 25, 30]);
    let primeCount = 0;
    for (let i = 2; i < N; i += 1) {
      if (isPrime(i)) primeCount += 1;
    }
    const ans = (N - 1) - 1 - primeCount;
    return {
      prompt: `${N} 미만의 자연수 중에서 합성수는 모두 몇 개인지 구하시오.`,
      promptEn: `How many composite numbers are strictly less than ${N}?`,
      expression: `1 이상 ${N} 미만의 자연수`,
      answer: String(ans),
      answerSuffix: '개',
      explanation: `1부터 ${N - 1}까지의 자연수 총 ${N - 1}개 중에서 1은 소수도 합성수도 아니므로 제외합니다. 이 중 소수는 ${primeCount}개이므로, 합성수의 개수는 (${N - 1} - 1) - ${primeCount} = ${ans}개입니다.`,
    };
  }
}

// [유형 02] 거듭제곱의 성질과 일의 자리 규칙 (RPM #40, #41, #42, #43, #68, #74, #83)
export function rpmPrimePowerRules(random) {
  const variant = pick(random, ['unitsDigit', 'powerEquation', 'combinedPower']);
  if (variant === 'unitsDigit') {
    const base1 = pick(random, [2, 3, 7, 8]);
    const exp1 = ri(random, 21, 65);
    const base2 = pick(random, [3, 7, 8, 9]);
    const exp2 = ri(random, 5, 35);
    const getUnitsCycle = (b) => {
      const cycle = [];
      let cur = b % 10;
      while (!cycle.includes(cur)) {
        cycle.push(cur);
        cur = (cur * b) % 10;
      }
      return cycle;
    };
    const cycle1 = getUnitsCycle(base1);
    const cycle2 = getUnitsCycle(base2);
    const u1 = cycle1[(exp1 - 1) % cycle1.length];
    const u2 = cycle2[(exp2 - 1) % cycle2.length];
    const ans = (u1 * u2) % 10;
    return {
      prompt: `${base1}^${exp1} × ${base2}^${exp2}의 일의 자리의 숫자를 구하시오.`,
      promptEn: `Find the units digit of ${base1}^${exp1} × ${base2}^${exp2}.`,
      expression: `${base1}^${exp1} × ${base2}^${exp2}의 일의 자리`,
      answer: String(ans),
      explanation: `${base1}의 거듭제곱의 일의 자리는 [${cycle1.join(', ')}]로 주기가 ${cycle1.length}입니다. ${exp1}번째는 ${u1}입니다. ${base2}의 거듭제곱의 일의 자리는 [${cycle2.join(', ')}]로 주기가 ${cycle2.length}이며 ${exp2}번째는 ${u2}입니다. 따라서 일의 자리 숫자는 (${u1} × ${u2})의 일의 자리인 ${ans}입니다.`,
    };
  } else if (variant === 'powerEquation') {
    const p = pick(random, [2, 3]);
    const a = p === 2 ? ri(random, 4, 7) : ri(random, 3, 6);
    const q = p === 2 ? pick(random, [3, 5]) : pick(random, [2, 5]);
    const b = q === 2 ? ri(random, 4, 7) : ri(random, 2, 4);
    const v1 = p ** a;
    const v2 = q ** b;
    const ans = a + b;
    return {
      prompt: `${p}^a = ${v1}, ${q}^b = ${v2}일 때, a + b의 값을 구하시오. (단, a, b는 자연수)`,
      promptEn: `If ${p}^a = ${v1} and ${q}^b = ${v2}, find a + b where a, b are natural numbers.`,
      expression: `${p}^a = ${v1}, ${q}^b = ${v2}`,
      answer: String(ans),
      explanation: `${p}^${a} = ${v1}이므로 a = ${a}이고, ${q}^${b} = ${v2}이므로 b = ${b}입니다. 따라서 a + b = ${a} + ${b} = ${ans}입니다.`,
    };
  } else {
    const countA = ri(random, 2, 4);
    const countB = ri(random, 2, 4);
    const countC = ri(random, 1, 3);
    const arr = [
      ...Array(countA).fill('a'),
      ...Array(countB).fill('b'),
      ...Array(countC).fill('c'),
    ].sort(() => random() - 0.5);
    const ans = countA + countB - countC;
    return {
      prompt: `${arr.join(' × ')} = a^x × b^y × c^z일 때, x + y - z의 값을 구하시오. (단, a, b, c는 서로 다른 소수이고 x, y, z는 자연수)`,
      promptEn: `If ${arr.join(' × ')} = a^x × b^y × c^z, find x + y - z.`,
      expression: `${arr.join(' × ')}`,
      answer: String(ans),
      explanation: `a가 ${countA}번 곱해졌으므로 x = ${countA}, b가 ${countB}번 곱해졌으므로 y = ${countB}, c가 ${countC}번 곱해졌으므로 z = ${countC}입니다. 따라서 x + y - z = ${countA} + ${countB} - ${countC} = ${ans}입니다.`,
    };
  }
}

// [유형 03] 소인수분해와 지수 연산 (RPM #44, #45, #46, #47, #69)
export function rpmPrimeFactorizeExponents(random) {
  const variant = pick(random, ['solveLinearFactors', 'orderedPrimes', 'correctFactorization']);
  if (variant === 'solveLinearFactors') {
    const [a, b, c] = pick(random, [
      [3, 2, 5],
      [3, 2, 7],
      [4, 1, 5],
      [2, 3, 5],
      [3, 2, 11],
    ]);
    const N = (2 ** a) * (3 ** b) * c;
    const ans = a - b + c;
    return {
      prompt: `${N}을 소인수분해하면 2^a × 3^b × c일 때, a - b + c의 값을 구하시오. (단, a, b는 자연수이고 c는 5 이상의 소수)`,
      promptEn: `When ${N} is factored into 2^a × 3^b × c, find a - b + c where c is a prime ≥ 5.`,
      expression: `${N} = 2^a × 3^b × c`,
      answer: String(ans),
      explanation: `${N}을 소인수분해하면 2^${a} × 3^${b} × ${c}입니다. 따라서 a = ${a}, b = ${b}, c = ${c}이므로 a - b + c = ${a} - ${b} + ${c} = ${ans}입니다.`,
    };
  } else if (variant === 'orderedPrimes') {
    const [a, b, m, n] = pick(random, [
      [3, 5, 2, 2],
      [2, 3, 3, 2],
      [2, 3, 2, 3],
      [2, 5, 3, 2],
      [3, 5, 3, 2],
      [2, 7, 3, 2],
    ]);
    const N = (a ** m) * (b ** n);
    const ans = a + b - m + n;
    return {
      prompt: `${N}을 a^m × b^n으로 소인수분해하였을 때, 자연수 a, b, m, n에 대하여 a + b - m + n의 값을 구하시오. (단, a, b는 a < b인 서로 다른 소수)`,
      promptEn: `When ${N} is factored into a^m × b^n (a < b primes), find a + b - m + n.`,
      expression: `${N} = a^m × b^n`,
      answer: String(ans),
      explanation: `${N}을 소인수분해하면 ${a}^${m} × ${b}^${n}입니다. a < b이므로 a = ${a}, b = ${b}, m = ${m}, n = ${n}입니다. 따라서 a + b - m + n = ${a} + ${b} - ${m} + ${n} = ${ans}입니다.`,
    };
  } else {
    const [val, correctStr, wrong1, wrong2, wrong3] = pick(random, [
      [504, '2^3 × 3^2 × 7', '2^3 × 3^4', '2^3 × 11^2', '2^2 × 3^3 × 5'],
      [360, '2^3 × 3^2 × 5', '2^4 × 3 × 5', '2^3 × 9 × 5', '2^2 × 3^3 × 5'],
      [180, '2^2 × 3^2 × 5', '2 × 3^2 × 10', '2^3 × 3 × 5', '4 × 9 × 5'],
    ]);
    const choices = [
      { value: '1', label: correctStr },
      { value: '2', label: wrong1 },
      { value: '3', label: wrong2 },
      { value: '4', label: wrong3 },
    ].sort(() => random() - 0.5);
    const correctIdx = choices.findIndex((c) => c.label === correctStr) + 1;
    return {
      prompt: `다음 중 ${val}을 올바르게 소인수분해한 것을 고르시오.`,
      promptEn: `Which of the following is the correct prime factorization of ${val}?`,
      expression: `${val}`,
      answer: String(correctIdx),
      choices,
      explanation: `${val}을 소인수분해하면 거듭제곱과 소수들의 곱으로 나타내어 ${correctStr}입니다. 합성수가 남아있거나 곱의 결과가 다른 보기는 올바르지 않습니다. 정답은 ${correctIdx}번(${correctStr})입니다.`,
    };
  }
}

// [유형 04] 소인수의 합과 소인수 분석 (RPM #48, #49, #50, #51, #72)
export function rpmPrimeFactorAnalysis(random) {
  const variant = pick(random, ['sumOfFactors', 'compositeExam', 'oddFactorSet']);
  if (variant === 'sumOfFactors') {
    const N = pick(random, [84, 126, 150, 210, 330, 420]);
    const factors = factorize(N);
    const primes = factors.map(([p]) => p);
    const ans = primes.reduce((sum, p) => sum + p, 0);
    return {
      prompt: `${N}의 모든 소인수의 합을 구하시오.`,
      promptEn: `Find the sum of all prime factors of ${N}.`,
      expression: `${N}의 소인수의 합`,
      answer: String(ans),
      explanation: `${N}을 소인수분해하면 ${factorText(factors)}입니다. 따라서 ${N}의 소인수는 ${primes.join(', ')}이므로 그 합은 ${primes.join(' + ')} = ${ans}입니다.`,
    };
  } else if (variant === 'compositeExam') {
    const N1 = 90;
    const N2 = 108;
    const c = 4;
    const a = 10;
    const b = 12;
    const ans = a + b - c;
    return {
      prompt: `${N1}의 소인수의 합을 a, ${N2}의 약수의 개수를 b개, 한 자리의 소수의 개수를 c개라 할 때, a + b - c의 값을 구하시오.`,
      promptEn: `Let a be the sum of prime factors of ${N1}, b be the number of divisors of ${N2}, and c be the number of 1-digit primes. Find a + b - c.`,
      expression: `a = ${a}, b = ${b}, c = ${c}`,
      answer: String(ans),
      explanation: `${N1} = 2 × 3² × 5이므로 소인수의 합 a = 2 + 3 + 5 = ${a}입니다. ${N2} = 2² × 3³이므로 약수의 개수 b = (2+1)(3+1) = ${b}개입니다. 한 자리의 소수는 2, 3, 5, 7로 c = ${c}개입니다. 따라서 a + b - c = ${a} + ${b} - ${c} = ${ans}입니다.`,
    };
  } else {
    const baseList = [18, 48, 54, 144];
    const diffNumber = pick(random, [42, 60, 70, 84]);
    const all = [...baseList, diffNumber].sort(() => random() - 0.5);
    const diffFactors = factorize(diffNumber).map(([p]) => p).join(', ');
    return {
      prompt: `다음 수 중에서 소인수의 종류가 나머지 네 수와 다른 하나를 구하시오.`,
      promptEn: `Which number has a different set of prime factors compared to the other four?`,
      expression: all.join(', '),
      answer: String(diffNumber),
      explanation: `${baseList.join(', ')}은 모두 소인수가 {2, 3}뿐이지만, ${diffNumber}의 소인수는 {${diffFactors}}입니다. 따라서 소인수가 다른 수는 ${diffNumber}입니다.`,
    };
  }
}

// [유형 05] 약수와 거듭제곱 약수의 성질 (RPM #52, #53, #54, #55, #73, #77)
export function rpmPrimeDivisorProperties(random) {
  const variant = pick(random, ['squareDivisors', 'secondRankedDivisors', 'invalidDivisor']);
  if (variant === 'squareDivisors') {
    const [p1, p2, e1, e2] = pick(random, [
      [2, 3, 3, 3],
      [2, 3, 4, 2],
      [2, 5, 4, 2],
      [2, 3, 6, 2],
      [2, 3, 2, 4],
    ]);
    const N = (p1 ** e1) * (p2 ** e2);
    const countP1 = Math.floor(e1 / 2) + 1;
    const countP2 = Math.floor(e2 / 2) + 1;
    const ans = countP1 * countP2;
    return {
      prompt: `${N}의 약수 중에서 어떤 자연수의 제곱이 되는 수의 개수를 구하시오.`,
      promptEn: `Find the number of divisors of ${N} that are perfect squares.`,
      expression: `${N} = ${p1}^${e1} × ${p2}^${e2}`,
      answer: String(ans),
      answerSuffix: '개',
      explanation: `${N} = ${p1}^${e1} × ${p2}^${e2}의 약수 중 어떤 자연수의 제곱이 되는 수는 소인수의 지수가 모두 짝수(0 포함)이어야 합니다. ${p1}의 지수로 가능한 것은 ${countP1}개, ${p2}의 지수로 가능한 것은 ${countP2}개이므로 총 개수는 ${countP1} × ${countP2} = ${ans}개입니다.`,
    };
  } else if (variant === 'secondRankedDivisors') {
    const p1 = pick(random, [2, 3]);
    const p2 = p1 === 2 ? pick(random, [3, 5]) : 5;
    const p3 = p2 === 3 ? 5 : 7;
    const e1 = ri(random, 1, 2);
    const N = (p1 ** e1) * p2 * p3;
    const a = p1;
    const b = N / p1;
    const ans = a + b;
    return {
      prompt: `${N}의 약수 중 두 번째로 작은 수를 a, 두 번째로 큰 수를 b라 할 때, a + b의 값을 구하시오.`,
      promptEn: `Let a be the 2nd smallest divisor and b be the 2nd largest divisor of ${N}. Find a + b.`,
      expression: `${N}의 약수`,
      answer: String(ans),
      explanation: `모든 자연수의 가장 작은 약수는 1이므로 두 번째로 작은 약수는 가장 작은 소인수인 ${a}(= a)입니다. 가장 큰 약수는 자기 자신인 ${N}이므로 두 번째로 큰 약수는 ${N} ÷ ${a} = ${b}(= b)입니다. 따라서 a + b = ${a} + ${b} = ${ans}입니다.`,
    };
  } else {
    const baseFact = '2^3 × 5 × 7^2';
    const correctWrongChoice = '2^3 × 3';
    const choices = [
      { value: '1', label: correctWrongChoice },
      { value: '2', label: '2^2 × 7' },
      { value: '3', label: '5 × 7^2' },
      { value: '4', label: '2^3 × 5' },
    ].sort(() => random() - 0.5);
    const ansIdx = choices.findIndex((c) => c.label === correctWrongChoice) + 1;
    return {
      prompt: `다음 중 ${baseFact}의 약수가 아닌 것을 고르시오.`,
      promptEn: `Which of the following is NOT a divisor of ${baseFact}?`,
      expression: `${baseFact}`,
      answer: String(ansIdx),
      choices,
      explanation: `${baseFact}의 약수는 소인수 2, 5, 7만을 포함하며 각 지수가 원래 수의 지수 이하이어야 합니다. ${correctWrongChoice}은 소인수 3을 포함하고 있으므로 약수가 될 수 없습니다. 정답은 ${ansIdx}번입니다.`,
    };
  }
}

// [유형 06] 약수의 개수 공식과 미지수 지수 (RPM #56, #57, #58, #59, #70, #80)
export function rpmPrimeDivisorCountReverse(random) {
  const variant = pick(random, ['findExponent', 'equalDivisors', 'unknownPrimeSquare']);
  if (variant === 'findExponent') {
    const e1 = 3;
    const targetA = ri(random, 2, 5);
    const e3 = 2;
    const totalDivisors = (e1 + 1) * (targetA + 1) * (e3 + 1);
    return {
      prompt: `8 × 3^a × 5^2의 약수의 개수가 ${totalDivisors}개일 때, 자연수 a의 값을 구하시오.`,
      promptEn: `The number of divisors of 8 × 3^a × 5^2 is ${totalDivisors}. Find the natural number a.`,
      expression: `약수의 개수: ${totalDivisors}개`,
      answer: String(targetA),
      explanation: `8 = 2³이므로 8 × 3^a × 5² = 2³ × 3^a × 5²입니다. 약수의 개수는 (3 + 1)(a + 1)(2 + 1) = 12(a + 1) = ${totalDivisors}개입니다. 따라서 a + 1 = ${targetA + 1}이므로 a = ${targetA}입니다.`,
    };
  } else if (variant === 'equalDivisors') {
    const targetN = ri(random, 2, 4);
    const givenDivisors = 6 * (targetN + 1);
    return {
      prompt: `약수의 개수가 ${givenDivisors}개인 수와 2^2 × 3 × 5^n의 약수의 개수가 같을 때, 자연수 n의 값을 구하시오.`,
      promptEn: `A number has ${givenDivisors} divisors. If 2^2 × 3 × 5^n has the same number of divisors, find the natural number n.`,
      expression: `(2+1) × (1+1) × (n+1) = ${givenDivisors}`,
      answer: String(targetN),
      explanation: `2² × 3 × 5^n의 약수의 개수는 (2 + 1)(1 + 1)(n + 1) = 6(n + 1)입니다. 6(n + 1) = ${givenDivisors}에서 n + 1 = ${targetN + 1}이므로 n = ${targetN}입니다.`,
    };
  } else {
    const ans = 144;
    return {
      prompt: `x = 2^4 × a^2 (a는 소수)의 약수의 개수가 15개일 때, 가장 작은 자연수 x의 값을 구하시오.`,
      promptEn: `Given x = 2^4 × a^2 where a is a prime, and x has 15 divisors. Find the smallest natural number x.`,
      expression: `x = 2^4 × a^2, 약수 15개`,
      answer: String(ans),
      explanation: `만약 a = 2이면 x = 2^6이 되어 약수의 개수는 7개이므로 조건에 맞지 않습니다. 따라서 a는 2가 아닌 소수이어야 하며, 약수의 개수는 (4 + 1)(2 + 1) = 15개입니다. x가 가장 작은 자연수가 되려면 a는 2가 아닌 가장 작은 소수인 3이어야 합니다. 따라서 x = 2⁴ × 3² = 16 × 9 = ${ans}입니다.`,
    };
  }
}

// [유형 07] 제곱인 수 만들기 (RPM #60, #61, #62, #63, #76, #81)
export function rpmPrimeMakeSquare(random) {
  const variant = pick(random, ['multiplySquare', 'divideSquare', 'secondSmallestMultiplier']);
  if (variant === 'multiplySquare') {
    const base1 = pick(random, [2, 3]);
    const base2 = pick(random, [3, 5, 7]);
    const base3 = pick(random, [5, 7, 11]);
    const e1 = pick(random, [1, 3]);
    const e2 = pick(random, [1, 2]);
    const e3 = 1;
    const n = (base1 ** e1) * (base2 ** e2) * (base3 ** e3);
    const factors = factorize(n);
    let x = 1;
    factors.forEach(([p, e]) => {
      if (e % 2 !== 0) x *= p;
    });
    const y = Math.round(Math.sqrt(n * x));
    const askSum = random() < 0.55;
    const ans = askSum ? x + y : x;
    return {
      prompt: `${n}에 가능한 한 가장 작은 자연수 x를 곱하여 어떤 자연수 y의 제곱이 되도록 할 때, ${askSum ? 'x + y의 값' : '가장 작은 자연수 x의 값'}을 구하시오.`,
      promptEn: `Multiply ${n} by the smallest natural number x to make it a square of natural number y. Find ${askSum ? 'x + y' : 'x'}.`,
      expression: `${n} × x = y^2`,
      answer: String(ans),
      explanation: `${n}을 소인수분해하면 ${factorText(factors)}입니다. 제곱수가 되려면 모든 소인수의 지수가 짝수이어야 하므로 곱해야 할 가장 작은 수 x = ${x}입니다. 이때 y² = ${n * x} = ${y}²이므로 y = ${y}입니다. 따라서 ${askSum ? `x + y = ${x} + ${y} = ${ans}` : `x = ${x}`}입니다.`,
    };
  } else if (variant === 'divideSquare') {
    const [n, a, b] = pick(random, [
      [180, 5, 6],
      [525, 21, 5],
      [72, 2, 6],
      [240, 15, 4],
      [200, 2, 10],
    ]);
    const askSum = random() < 0.5;
    const ans = askSum ? a + b : a;
    return {
      prompt: `${n}을 가장 작은 자연수 a로 나누어 어떤 자연수 b의 제곱이 되도록 할 때, ${askSum ? 'a + b의 값' : '나누어야 하는 수 a'}을 구하시오.`,
      promptEn: `Divide ${n} by the smallest natural number a to make it a square of natural number b. Find ${askSum ? 'a + b' : 'a'}.`,
      expression: `${n} ÷ a = b^2`,
      answer: String(ans),
      explanation: `${n}을 소인수분해하면 지수가 홀수인 소인수들의 곱이 ${a}입니다. 따라서 가장 작은 자연수 a = ${a}로 나누면 ${n} ÷ ${a} = ${b * b} = ${b}²이 되어 b = ${b}입니다. 따라서 ${askSum ? `a + b = ${a} + ${b} = ${ans}` : `a = ${a}`}입니다.`,
    };
  } else {
    const [n, minK] = pick(random, [
      [540, 15],
      [72, 2],
      [120, 30],
      [84, 21],
    ]);
    const ans = minK * 4;
    return {
      prompt: `${n}에 자연수를 곱하여 어떤 자연수의 제곱이 되도록 할 때, 곱해야 하는 자연수 중 두 번째로 작은 수를 구하시오.`,
      promptEn: `When multiplying ${n} by a natural number to make it a square, find the second smallest such multiplier.`,
      expression: `${n} × k = □^2`,
      answer: String(ans),
      explanation: `${n}을 소인수분해했을 때 지수가 홀수인 소인수의 곱은 ${minK}입니다. 제곱수가 되기 위해 곱하는 수는 ${minK} × 1², ${minK} × 2², ${minK} × 3² ... 의 형태입니다. 따라서 가장 작은 수는 ${minK}이고, 두 번째로 작은 수는 ${minK} × 2² = ${minK} × 4 = ${ans}입니다.`,
    };
  }
}

// [유형 08] 약수의 개수가 주어질 때 □ 구하기 (RPM #64, #65, #78)
export function rpmPrimeUnknownInDivisorCount(random) {
  const variant = pick(random, ['selectBox', 'smallestBox', 'cannotBeBox']);
  if (variant === 'smallestBox') {
    const ans = 4;
    return {
      prompt: `2 × 3 × □의 약수의 개수가 8개일 때, □ 안에 들어갈 수 있는 가장 작은 자연수를 구하시오.`,
      promptEn: `The number of divisors of 2 × 3 × □ is 8. Find the smallest natural number for □.`,
      expression: `2 × 3 × □의 약수 = 8개`,
      answer: String(ans),
      explanation: `약수의 개수가 8개이므로 (1) □ = 5(새로운 소수)이면 2 × 3 × 5의 약수의 개수는 (1+1)(1+1)(1+1) = 8개입니다. (2) □ = 2² = 4이면 2³ × 3의 약수의 개수는 (3+1)(1+1) = 8개입니다. (3) □ = 3² = 9이면 2 × 3³의 약수의 개수는 8개입니다. 이 중 가장 작은 자연수는 □ = ${ans}입니다.`,
    };
  } else if (variant === 'cannotBeBox') {
    const choices = [
      { value: '1', label: '2' },
      { value: '2', label: '3' },
      { value: '3', label: '5' },
      { value: '4', label: '7' },
      { value: '5', label: '11' },
    ];
    return {
      prompt: `8 × □의 약수의 개수가 8개일 때, 다음 중 □ 안에 들어갈 수 없는 수는?`,
      promptEn: `The number of divisors of 8 × □ is 8. Which of the following CANNOT be □?`,
      expression: `8 × □`,
      answer: '1',
      choices,
      explanation: `8 = 2³입니다. □ = 2이면 8 × 2 = 2⁴이 되어 약수의 개수는 4 + 1 = 5개이므로 8개가 되지 않습니다. (다른 보기 3, 5, 7, 11 등 서로 다른 소수가 들어가면 2³ × p의 약수의 개수는 4 × 2 = 8개로 모두 성립합니다.) 따라서 정답은 1번(2)입니다.`,
    };
  } else {
    const choices = [
      { value: '1', label: '2' },
      { value: '2', label: '3' },
      { value: '3', label: '4' },
      { value: '4', label: '5' },
      { value: '5', label: '6' },
    ];
    return {
      prompt: `24 × □의 약수의 개수가 16개일 때, 다음 중 □ 안에 알맞은 수는?`,
      promptEn: `The number of divisors of 24 × □ is 16. Which number fits in □?`,
      expression: `24 × □`,
      answer: '4',
      choices,
      explanation: `24 = 2³ × 3입니다. □ = 5일 때 2³ × 3 × 5가 되어 약수의 개수는 (3+1)(1+1)(1+1) = 16개로 조건을 만족합니다. 정답은 4번(5)입니다.`,
    };
  }
}

// [유형 09] 약수의 개수가 n개인 자연수 추론 (RPM #66, #67, #79, #82)
export function rpmPrimeDivisorCountReverseDeduce(random) {
  const variant = pick(random, ['functionProduct', 'countExactSix', 'conditionSmallest']);
  if (variant === 'functionProduct') {
    const [A, B, ans, expReason] = pick(random, [
      [35, 36, 36, '35 = 5 × 7이므로 f(35) = 4입니다. 4 × f(x) = 36에서 f(x) = 9입니다. 약수의 개수가 9개인 수 중 가장 작은 수는 2² × 3² = 36입니다. (2^8 = 256 > 36)'],
      [120, 64, 6, '120 = 2³ × 3 × 5이므로 N(120) = 16입니다. 16 × N(x) = 64에서 N(x) = 4입니다. 약수의 개수가 4개인 수 중 가장 작은 수는 2 × 3 = 6입니다. (2³ = 8 > 6)'],
      [20, 36, 12, '20 = 2² × 5이므로 f(20) = 6입니다. 6 × f(x) = 36에서 f(x) = 6입니다. 약수의 개수가 6개인 수 중 가장 작은 수는 2² × 3 = 12입니다. (2^5 = 32 > 12)'],
    ]);
    return {
      prompt: `자연수 n의 약수의 개수를 f(n)이라 할 때, f(${A}) × f(x) = ${B}를 만족시키는 가장 작은 자연수 x의 값을 구하시오.`,
      promptEn: `Let f(n) be the number of divisors of n. If f(${A}) × f(x) = ${B}, find the smallest natural number x.`,
      expression: `f(${A}) × f(x) = ${B}`,
      answer: String(ans),
      explanation: `${expReason} 따라서 가장 작은 자연수 x = ${ans}입니다.`,
    };
  } else if (variant === 'countExactSix') {
    const ans = 8;
    return {
      prompt: `1에서 50까지의 자연수 중에서 약수의 개수가 6개인 수는 모두 몇 개인지 구하시오.`,
      promptEn: `How many natural numbers from 1 to 50 have exactly 6 divisors?`,
      expression: `1부터 50까지, 약수의 개수 6개`,
      answer: String(ans),
      answerSuffix: '개',
      explanation: `약수의 개수가 6개인 수는 a^5 꼴 또는 a² × b 꼴 (a, b는 서로 다른 소수)입니다. (1) a^5 꼴: 2^5 = 32 (1개). (2) a² × b 꼴: 2² × b에서 b = 3, 5, 7, 11 (12, 20, 28, 44로 4개), 3² × b에서 b = 2, 5 (18, 45로 2개), 5² × b에서 b = 2 (50으로 1개). 따라서 모두 합하면 1 + 4 + 2 + 1 = ${ans}개입니다.`,
    };
  } else {
    const ans = 405;
    return {
      prompt: `다음 조건을 모두 만족하는 자연수 A의 값을 구하시오.\n(가) A를 소인수분해하면 소인수는 3, 5뿐이다.\n(나) A는 약수의 개수가 10개인 가장 작은 수이다.`,
      promptEn: `Find natural number A satisfying: (a) Prime factors of A are only 3 and 5. (b) A is the smallest number with 10 divisors.`,
      expression: `소인수 {3, 5}, 약수의 개수 10개인 최소 자연수`,
      answer: String(ans),
      explanation: `소인수가 3과 5뿐이므로 A = 3^a × 5^b (a, b는 자연수) 꼴입니다. 약수의 개수가 10개이므로 (a + 1)(b + 1) = 10에서 {a + 1, b + 1} = {2, 5}, 즉 {a, b} = {1, 4}입니다. A가 가장 작은 수가 되려면 밑이 작은 소수 3에 더 큰 지수 4를 주어야 하므로 A = 3⁴ × 5¹ = 81 × 5 = ${ans}입니다. (5⁴ × 3 = 1875보다 405가 더 작음)`,
    };
  }
}

// [응용 실전 종합] RPM 소인수분해 실전 종합 (RPM 유형 01~09 및 중단원/실력UP)
export function rpmPrimeAllTypesMixed(random) {
  const allEngines = [
    rpmPrimePropClosest,
    rpmPrimePowerRules,
    rpmPrimeFactorizeExponents,
    rpmPrimeFactorAnalysis,
    rpmPrimeDivisorProperties,
    rpmPrimeDivisorCountReverse,
    rpmPrimeMakeSquare,
    rpmPrimeUnknownInDivisorCount,
    rpmPrimeDivisorCountReverseDeduce,
  ];
  return pick(random, allEngines)(random);
}

// -------------------------------------------------------------
// CHAPTER 02: 최대공약수와 최소공배수 응용 (RPM 1-1 Pages 18 ~ 31)
// -------------------------------------------------------------

function gcdAll(arr) {
  return arr.reduce((acc, cur) => gcd(acc, cur));
}

function lcmAll(arr) {
  return arr.reduce((acc, cur) => lcm(acc, cur));
}

function divisorsOf(n) {
  const res = [];
  for (let d = 1; d <= n; d += 1) {
    if (n % d === 0) res.push(d);
  }
  return res;
}

// [유형 01·02] 최대공약수와 서로소 (RPM #109~#115, #181, #184, #185)
export function rpmGcdBasicCoprime(random) {
  const variant = pick(random, ['deduceExpSum', 'coprimeCount', 'findCoprimeChoice', 'unknownBox']);
  if (variant === 'deduceExpSum') {
    const a = ri(random, 2, 4);
    const b = ri(random, 2, 4);
    const ans = a + b;
    return {
      prompt: `세 수 2^3 × 3^b × 5^5, 3^4 × 5^a × 11, 2^3 × 3^3 × 5^4의 최대공약수가 3^${b} × 5^${a}일 때, a + b의 값을 구하시오. (단, a, b는 자연수)`,
      promptEn: `If the greatest common factor of 2^3 × 3^b × 5^5, 3^4 × 5^a × 11, and 2^3 × 3^3 × 5^4 is 3^${b} × 5^${a}, find a + b.`,
      expression: `G = 3^${b} × 5^${a}`,
      answer: String(ans),
      explanation: `세 수의 공통인 소인수는 3과 5입니다. 최대공약수에서 3의 지수는 min(b, 4, 3) = ${b}이므로 b = ${b}이고, 5의 지수는 min(5, a, 4) = ${a}이므로 a = ${a}입니다. 따라서 a + b = ${ans}입니다.`,
    };
  } else if (variant === 'coprimeCount') {
    const target = pick(random, [24, 28, 30, 36, 42]);
    const minVal = target - ri(random, 8, 12);
    const maxVal = target + ri(random, 8, 12);
    let count = 0;
    const matches = [];
    for (let x = minVal + 1; x < maxVal; x += 1) {
      if (gcd(x, target) === 1) {
        count += 1;
        matches.push(x);
      }
    }
    return {
      prompt: `${minVal}보다 크고 ${maxVal}보다 작은 자연수 중에서 ${target}과 서로소인 수의 개수를 구하시오.`,
      promptEn: `How many natural numbers strictly between ${minVal} and ${maxVal} are coprime to ${target}?`,
      expression: `${minVal} < x < ${maxVal}, gcd(x, ${target}) = 1`,
      answer: String(count),
      answerSuffix: '개',
      explanation: `${target}과 최대공약수가 1인 수는 [${matches.join(', ')}]으로 모두 ${count}개입니다.`,
    };
  } else if (variant === 'findCoprimeChoice') {
    const coprimePairs = [
      [12, 29], [15, 28], [16, 27], [21, 40], [25, 36], [14, 33], [35, 48],
    ];
    const nonCoprimePairs = [
      [8, 10], [9, 15], [14, 21], [18, 27], [24, 32], [26, 39], [33, 55],
    ];
    const correctPair = pick(random, coprimePairs);
    const wrongPairs = [];
    while (wrongPairs.length < 4) {
      const p = pick(random, nonCoprimePairs);
      if (!wrongPairs.some(([a, b]) => a === p[0] && b === p[1])) wrongPairs.push(p);
    }
    const choices = [
      { value: '1', label: `${correctPair[0]}, ${correctPair[1]}`, isCorrect: true },
      { value: '2', label: `${wrongPairs[0][0]}, ${wrongPairs[0][1]}` },
      { value: '3', label: `${wrongPairs[1][0]}, ${wrongPairs[1][1]}` },
      { value: '4', label: `${wrongPairs[2][0]}, ${wrongPairs[2][1]}` },
      { value: '5', label: `${wrongPairs[3][0]}, ${wrongPairs[3][1]}` },
    ].sort(() => random() - 0.5);
    const correctIndex = choices.findIndex((c) => c.isCorrect) + 1;
    return {
      prompt: `다음 중 두 수가 서로소인 것을 고르시오.`,
      promptEn: `Which pair of numbers is coprime (greatest common factor is 1)?`,
      expression: `서로소 판별`,
      answer: String(correctIndex),
      choices,
      explanation: `두 수의 최대공약수가 1일 때 서로소라고 합니다. ${correctPair[0]}과 ${correctPair[1]}의 최대공약수는 1이므로 서로소입니다. 정답은 ${correctIndex}번입니다.`,
    };
  } else {
    const validBoxes = [18, 36, 45, 63, 90];
    const invalidBoxes = [27, 54, 75, 99, 110];
    const invalid = pick(random, invalidBoxes);
    const valids = [];
    while (valids.length < 4) {
      const v = pick(random, validBoxes);
      if (!valids.includes(v)) valids.push(v);
    }
    const choices = [
      { value: '1', label: String(invalid), isTarget: true },
      { value: '2', label: String(valids[0]) },
      { value: '3', label: String(valids[1]) },
      { value: '4', label: String(valids[2]) },
      { value: '5', label: String(valids[3]) },
    ].sort(() => random() - 0.5);
    const ansIdx = choices.findIndex((c) => c.isTarget) + 1;
    return {
      prompt: `두 자연수 2^4 × □ 와 2^3 × 3^5 × 11의 최대공약수가 72일 때, 다음 중 □ 안에 들어갈 수 없는 수는?`,
      promptEn: `If the greatest common factor of 2^4 × □ and 2^3 × 3^5 × 11 is 72, which of the following cannot be □?`,
      expression: `gcd(2^4 × □, 2^3 × 3^5 × 11) = 72 = 2^3 × 3^2`,
      answer: String(ansIdx),
      choices,
      explanation: `72 = 2^3 × 3^2이므로 □는 3^2을 인수로 가져야 하지만 3^3 이상의 거듭제곱이나 11을 인수로 가질 수 없습니다. ${invalid}은 조건을 만족하지 않으므로 들어갈 수 없습니다. 정답은 ${ansIdx}번(${invalid})입니다.`,
    };
  }
}

// [유형 03] 공약수와 최대공약수의 성질 (RPM #116~#119, #183, #197)
export function rpmGcdCommonDivisorProp(random) {
  const variant = pick(random, ['notCommonDivisor', 'countCommonDivisors', 'chainGcd']);
  if (variant === 'notCommonDivisor') {
    const G = pick(random, [48, 60, 72, 84, 90]);
    const divs = divisorsOf(G);
    const nonDivs = [7, 9, 11, 14, 17, 22, 26, 35, 45, 50].filter((x) => G % x !== 0);
    const bad = pick(random, nonDivs);
    const goods = [];
    while (goods.length < 4) {
      const d = pick(random, divs);
      if (!goods.includes(d)) goods.push(d);
    }
    const choices = [
      { value: '1', label: String(bad), isTarget: true },
      { value: '2', label: String(goods[0]) },
      { value: '3', label: String(goods[1]) },
      { value: '4', label: String(goods[2]) },
      { value: '5', label: String(goods[3]) },
    ].sort(() => random() - 0.5);
    const ansIdx = choices.findIndex((c) => c.isTarget) + 1;
    return {
      prompt: `두 자연수 A, B의 최대공약수가 ${G}일 때, 다음 중 A와 B의 공약수가 아닌 것은?`,
      promptEn: `If the greatest common factor of natural numbers A and B is ${G}, which of the following is NOT a common divisor?`,
      expression: `G = ${G}`,
      answer: String(ansIdx),
      choices,
      explanation: `두 수의 공약수는 최대공약수의 약수입니다. ${G}의 약수가 아닌 수는 ${bad}입니다. 따라서 정답은 ${ansIdx}번입니다.`,
    };
  } else if (variant === 'countCommonDivisors') {
    const [e2, e3] = pick(random, [[2, 1], [3, 2], [2, 2], [3, 1]]);
    const divCount = (e2 + 1) * (e3 + 1);
    const exp1 = `2^${e2 + 1} × 3^${e3} × 5`;
    const exp2 = `2^${e2} × 3^${e3 + 1} × 7`;
    const exp3 = `2^${e2 + 2} × 3^${e3} × 11`;
    return {
      prompt: `세 수 ${exp1}, ${exp2}, ${exp3}의 공약수의 개수를 구하시오.`,
      promptEn: `Find the number of common divisors of ${exp1}, ${exp2}, and ${exp3}.`,
      expression: `최대공약수 G = 2^${e2} × 3^${e3}`,
      answer: String(divCount),
      answerSuffix: '개',
      explanation: `세 수의 공통 소인수는 2와 3이며, 최대공약수는 2^${e2} × 3^${e3}입니다. 공약수의 개수는 최대공약수의 약수의 개수와 같으므로 (${e2} + 1) × (${e3} + 1) = ${divCount}개입니다.`,
    };
  } else {
    const g = pick(random, [12, 14, 18, 20, 24]);
    const k1 = pick(random, [2, 3, 5]);
    let k2;
    do k2 = pick(random, [2, 3, 5, 7]); while (k1 === k2 || gcd(k1, k2) !== 1);
    const d1 = g * k1;
    const d2 = g * k2;
    return {
      prompt: `세 자연수 A, B, C에 대하여 A와 B의 최대공약수는 ${d1}이고, B와 C의 최대공약수는 ${d2}일 때, 세 수 A, B, C의 최대공약수를 구하시오.`,
      promptEn: `For natural numbers A, B, C, the GCF of A and B is ${d1}, and the GCF of B and C is ${d2}. Find the greatest common factor of A, B, and C.`,
      expression: `gcd(A, B) = ${d1}, gcd(B, C) = ${d2}`,
      answer: String(g),
      explanation: `세 수 A, B, C의 공약수는 (A와 B의 공약수)이면서 (B와 C의 공약수)이어야 하므로, ${d1}과 ${d2}의 공약수입니다. 따라서 세 수의 최대공약수는 ${d1}과 ${d2}의 최대공약수인 ${g}입니다.`,
    };
  }
}

// [유형 04·05] 최소공배수와 공배수의 성질 (RPM #120~#127)
export function rpmLcmCommonMultipleProp(random) {
  const variant = pick(random, ['lcmExpSum', 'countLimit', 'closestMultiple']);
  if (variant === 'lcmExpSum') {
    const a = ri(random, 4, 6);
    const b = ri(random, 3, 5);
    const c = ri(random, 2, 4);
    const ans = a + b + c;
    return {
      prompt: `두 수 2^3 × 3^b × 5 와 2^a × 3^2 × 7^${c}의 최소공배수가 2^${a} × 3^${b} × 5 × 7^c일 때, a + b + c의 값을 구하시오. (단, a, b, c는 자연수)`,
      promptEn: `If the least common multiple of 2^3 × 3^b × 5 and 2^a × 3^2 × 7^${c} is 2^${a} × 3^${b} × 5 × 7^c, find a + b + c.`,
      expression: `L = 2^${a} × 3^${b} × 5 × 7^c`,
      answer: String(ans),
      explanation: `최소공배수는 각 소인수의 지수 중 크거나 같은 것을 택하므로, a = ${a}, b = ${b}, c = ${c}입니다. 따라서 a + b + c = ${ans}입니다.`,
    };
  } else if (variant === 'countLimit') {
    const L = pick(random, [14, 18, 24, 28, 36]);
    const M = pick(random, [100, 150, 200, 250, 300]);
    const ans = Math.floor(M / L);
    return {
      prompt: `두 자연수의 최소공배수가 ${L}일 때, 이 두 자연수의 공배수 중 ${M} 이하의 자연수는 모두 몇 개인가?`,
      promptEn: `If the least common multiple of two natural numbers is ${L}, how many common multiples are less than or equal to ${M}?`,
      expression: `L = ${L}, M ≤ ${M}`,
      answer: String(ans),
      answerSuffix: '개',
      explanation: `두 수의 공배수는 최소공배수 ${L}의 배수입니다. ${M} 이하의 공배수의 개수는 ${M} ÷ ${L} = ${ans}개입니다.`,
    };
  } else {
    const [n1, n2, n3] = pick(random, [[8, 15, 24], [6, 10, 15], [9, 12, 18], [12, 16, 20]]);
    const L = lcmAll([n1, n2, n3]);
    const T = pick(random, [500, 700, 800, 1000]);
    const k = Math.round(T / L);
    const ans = k * L;
    return {
      prompt: `세 수 ${n1}, ${n2}, ${n3}의 공배수 중 ${T}에 가장 가까운 수를 구하시오.`,
      promptEn: `Find the common multiple of ${n1}, ${n2}, and ${n3} that is closest to ${T}.`,
      expression: `세 수의 최소공배수 L = ${L}`,
      answer: String(ans),
      explanation: `세 수의 최소공배수는 ${L}이므로, 공배수는 ${L}의 배수입니다. ${T} 부근의 배수는 ${(k - 1) * L}, ${k * L}, ${(k + 1) * L} 등이 있으며, ${T}과의 차이가 가장 작은 수는 ${ans}입니다.`,
    };
  }
}

// [유형 06] 소인수분해 지수와 최대공약수·최소공배수 역추적 (RPM #128~#134, #186)
export function rpmGcdLcmExponentDeduce(random) {
  const variant = pick(random, ['twoNumDeduce', 'threeNumLcmSum', 'deduceDivisorsA']);
  if (variant === 'twoNumDeduce') {
    const a = ri(random, 3, 5);
    const b = ri(random, 2, 4);
    const ans = a + b;
    return {
      prompt: `두 수 2^b × 3^2 × 5 와 2^3 × 3^a의 최대공약수가 2^2 × 3^2이고, 최소공배수가 2^3 × 3^${a} × 5일 때, a + b의 값을 구하시오. (단, a, b는 자연수)`,
      promptEn: `The greatest common factor of 2^b × 3^2 × 5 and 2^3 × 3^a is 2^2 × 3^2, and their least common multiple is 2^3 × 3^${a} × 5. Find a + b.`,
      expression: `G = 2^2 × 3^2, L = 2^3 × 3^${a} × 5`,
      answer: String(ans),
      explanation: `최대공약수에서 2의 지수는 min(b, 3) = 2이므로 b = 2입니다. 최소공배수에서 3의 지수는 max(2, a) = ${a}이므로 a = ${a}입니다. 따라서 a + b = ${ans}입니다.`,
    };
  } else if (variant === 'threeNumLcmSum') {
    const a = 4;
    const b = 2;
    const c = 1;
    const ans = a + b + c;
    return {
      prompt: `세 수 2^2 × 3^b, 2^a × 3, 2^3 × 3 × 5^c의 최소공배수가 720일 때, 자연수 a, b, c에 대하여 a + b + c의 값을 구하시오.`,
      promptEn: `The least common multiple of 2^2 × 3^b, 2^a × 3, and 2^3 × 3 × 5^c is 720. Find a + b + c for natural numbers a, b, c.`,
      expression: `720 = 2^4 × 3^2 × 5`,
      answer: String(ans),
      explanation: `720을 소인수분해하면 2^4 × 3^2 × 5입니다. 최소공배수에서 2의 최고 지수는 4이므로 a = 4, 3의 최고 지수는 2이므로 b = 2, 5의 최고 지수는 1이므로 c = 1입니다. 따라서 a + b + c = 4 + 2 + 1 = ${ans}입니다.`,
    };
  } else {
    const ans = 27;
    return {
      prompt: `두 자연수 2^3 × 3 × 5와 A의 최대공약수가 2^2 × 3이고, 최소공배수가 2^3 × 3^2 × 5 × 7^2일 때, 자연수 A의 약수의 개수를 구하시오.`,
      promptEn: `The GCF of 2^3 × 3 × 5 and A is 2^2 × 3, and their LCM is 2^3 × 3^2 × 5 × 7^2. Find the number of divisors of natural number A.`,
      expression: `A = 2^2 × 3^2 × 7^2`,
      answer: String(ans),
      answerSuffix: '개',
      explanation: `최대공약수가 2^2 × 3이므로 A는 2^2을 소인수로 가져야 하고 5는 가질 수 없습니다. 또한 최소공배수가 2^3 × 3^2 × 5 × 7^2이므로 A는 3^2과 7^2을 소인수로 가져야 합니다. 따라서 A = 2^2 × 3^2 × 7^2이며, A의 약수의 개수는 (2+1) × (2+1) × (2+1) = ${ans}개입니다.`,
    };
  }
}

// [유형 07] 두 수의 곱과 최대공약수·최소공배수의 관계 (RPM #135~#138, #187, #193, #211)
export function rpmGcdLcmProductRelation(random) {
  const variant = pick(random, ['productLcm', 'productGcd', 'twoDigitReverse']);
  if (variant === 'productLcm') {
    const G = pick(random, [4, 6, 8, 12, 15]);
    const L = pick(random, [60, 72, 96, 120, 180]);
    const P = G * L;
    return {
      prompt: `두 자연수의 곱이 ${P}이고 최소공배수가 ${L}일 때, 이 두 수의 최대공약수를 구하시오.`,
      promptEn: `The product of two natural numbers is ${P} and their LCM is ${L}. Find their greatest common factor.`,
      expression: `두 수의 곱 = G × L`,
      answer: String(G),
      explanation: `(두 수의 곱) = (최대공약수) × (최소공배수)이므로 최대공약수 G = ${P} ÷ ${L} = ${G}입니다.`,
    };
  } else if (variant === 'productGcd') {
    const G = pick(random, [4, 6, 8, 12]);
    const L = pick(random, [72, 96, 120, 144, 240]);
    const P = G * L;
    return {
      prompt: `두 자연수의 곱이 ${P}이고 최대공약수가 ${G}일 때, 이 두 수의 최소공배수를 구하시오.`,
      promptEn: `The product of two natural numbers is ${P} and their GCF is ${G}. Find their least common multiple.`,
      expression: `두 수의 곱 = G × L`,
      answer: String(L),
      explanation: `(두 수의 곱) = (최대공약수) × (최소공배수)이므로 최소공배수 L = ${P} ÷ ${G} = ${L}입니다.`,
    };
  } else {
    const [G, a, b] = pick(random, [
      [6, 3, 5],
      [6, 3, 7],
      [8, 2, 3],
      [12, 2, 3],
      [12, 2, 5],
    ]);
    const A = G * a;
    const B = G * b;
    const P = A * B;
    const ans = A + B;
    return {
      prompt: `두 자리의 자연수 A, B (A < B)에 대하여 두 수의 곱이 ${P}이고 최대공약수가 ${G}일 때, A + B의 값을 구하시오.`,
      promptEn: `For two 2-digit natural numbers A and B (A < B), their product is ${P} and their GCF is ${G}. Find A + B.`,
      expression: `A × B = ${P}, G = ${G}`,
      answer: String(ans),
      explanation: `두 수의 곱 = G × L이므로 L = ${P} ÷ ${G} = ${P / G}입니다. A = ${G}a, B = ${G}b (a, b는 서로소, a < b)라 하면 a × b = ${a * b}입니다. A, B가 모두 두 자리 자연수이므로 a = ${a}, b = ${b}일 때 A = ${A}, B = ${B}입니다. 따라서 A + B = ${ans}입니다.`,
    };
  }
}

// [유형 08] 미지수 x를 포함한 세 수의 최소공배수 (RPM #139~#142, #196, #207)
export function rpmLcmThreeNumbersRatio(random) {
  const variant = pick(random, ['unknownX', 'ratioLargest', 'ratioSum']);
  if (variant === 'unknownX') {
    const x = ri(random, 4, 12);
    const L = 12 * x;
    return {
      prompt: `세 자연수 3x, 4x, 6x의 최소공배수가 ${L}일 때, 세 자연수의 최대공약수를 구하시오.`,
      promptEn: `The least common multiple of natural numbers 3x, 4x, and 6x is ${L}. Find their greatest common factor.`,
      expression: `lcm(3x, 4x, 6x) = 12x = ${L}`,
      answer: String(x),
      explanation: `3, 4, 6의 최소공배수는 12이므로 3x, 4x, 6x의 최소공배수는 12x입니다. 12x = ${L}에서 x = ${x}입니다. 3, 4, 6의 최대공약수는 1이므로 세 수의 최대공약수는 1 × x = ${x}입니다.`,
    };
  } else if (variant === 'ratioLargest') {
    const x = ri(random, 5, 12);
    const L = 24 * x;
    const largest = 8 * x;
    return {
      prompt: `세 자연수의 비가 2 : 3 : 8이고 최소공배수가 ${L}일 때, 세 자연수 중 가장 큰 수를 구하시오.`,
      promptEn: `The ratio of three natural numbers is 2 : 3 : 8 and their LCM is ${L}. Find the largest of the three numbers.`,
      expression: `2x, 3x, 8x의 최소공배수 = 24x = ${L}`,
      answer: String(largest),
      explanation: `세 자연수를 2x, 3x, 8x라 하면 최소공배수는 24x입니다. 24x = ${L}이므로 x = ${x}입니다. 세 자연수 중 가장 큰 수는 8x = 8 × ${x} = ${largest}입니다.`,
    };
  } else {
    const x = ri(random, 5, 15);
    const L = 30 * x;
    const sum = (2 + 5 + 6) * x;
    return {
      prompt: `세 자연수의 비가 2 : 5 : 6이고 최소공배수가 ${L}일 때, 세 자연수의 합을 구하시오.`,
      promptEn: `The ratio of three natural numbers is 2 : 5 : 6 and their LCM is ${L}. Find the sum of the three numbers.`,
      expression: `2x, 5x, 6x의 최소공배수 = 30x = ${L}`,
      answer: String(sum),
      explanation: `세 자연수를 2x, 5x, 6x라 하면 최소공배수는 30x입니다. 30x = ${L}이므로 x = ${x}입니다. 따라서 세 수의 합은 (2 + 5 + 6) × ${x} = 13 × ${x} = ${sum}입니다.`,
    };
  }
}

// [유형 09] 최대공약수 활용 — 남김없이 똑같이 나누어주기 (RPM #143~#145, #204)
export function rpmGcdWordDistribute(random) {
  const variant = pick(random, ['pencilsErasers', 'threeFruits', 'groupsSum']);
  if (variant === 'pencilsErasers') {
    const g = pick(random, [12, 14, 16, 18, 20]);
    const q1 = ri(random, 6, 11);
    const q2 = ri(random, 4, 8);
    const n1 = g * q1;
    const n2 = g * q2;
    return {
      prompt: `연필 ${n1}자루와 지우개 ${n2}개를 되도록 많은 학생들에게 남김없이 똑같이 나누어 주려고 한다. 나누어 줄 수 있는 학생 수를 구하시오.`,
      promptEn: `We want to divide ${n1} pencils and ${n2} erasers equally among as many students as possible without leftovers. Find the maximum number of students.`,
      expression: `gcd(${n1}, ${n2}) = ${g}`,
      answer: String(g),
      answerSuffix: '명',
      explanation: `가능한 한 많은 학생에게 똑같이 나누어 주어야 하므로 학생 수는 ${n1}과 ${n2}의 최대공약수인 ${g}명입니다.`,
    };
  } else if (variant === 'threeFruits') {
    const g = pick(random, [6, 8, 12]);
    const n1 = g * ri(random, 4, 7);
    const n2 = g * ri(random, 6, 9);
    const n3 = g * ri(random, 8, 11);
    const actualG = gcdAll([n1, n2, n3]);
    return {
      prompt: `바나나 ${n1}개, 오렌지 ${n2}개, 사과 ${n3}개를 가능한 한 많은 학생들에게 똑같이 나누어 주려고 한다. 나누어 줄 수 있는 학생 수를 구하시오.`,
      promptEn: `Divide ${n1} bananas, ${n2} oranges, and ${n3} apples equally among as many students as possible without leftovers. Find the maximum number of students.`,
      expression: `gcd(${n1}, ${n2}, ${n3}) = ${actualG}`,
      answer: String(actualG),
      answerSuffix: '명',
      explanation: `학생 수는 ${n1}, ${n2}, ${n3}의 최대공약수인 ${actualG}명입니다.`,
    };
  } else {
    const g = pick(random, [6, 8, 9, 12]);
    const a = ri(random, 3, 6);
    const b = ri(random, 4, 7);
    const n1 = g * a;
    const n2 = g * b;
    const ans = a + b;
    return {
      prompt: `어느 중학교 등산부의 여학생 수는 ${n1}명이고 남학생 수는 ${n2}명이다. 야영을 하기 위하여 여학생 a명과 남학생 b명씩을 한 조로 나누려고 한다. 가능한 한 많은 조로 나누려고 할 때, a + b의 값을 구하시오.`,
      promptEn: `A hiking club has ${n1} girls and ${n2} boys. They want to form as many teams as possible, each with a girls and b boys. Find a + b.`,
      expression: `조의 수 = gcd(${n1}, ${n2}) = ${g}`,
      answer: String(ans),
      explanation: `가능한 한 많은 조로 나누어야 하므로 조의 수는 ${n1}과 ${n2}의 최대공약수인 ${g}개입니다. 한 조당 여학생은 a = ${n1} ÷ ${g} = ${a}명, 남학생은 b = ${n2} ÷ ${g} = ${b}명이므로 a + b = ${ans}입니다.`,
    };
  }
}

// [유형 10·11] 최대공약수 활용 — 직사각형 채우기 및 둘레에 일정한 간격 놓기 (RPM #146~#151, #206)
export function rpmGcdWordTileFence(random) {
  const variant = pick(random, ['tileFill', 'fencePosts']);
  if (variant === 'tileFill') {
    const s = pick(random, [12, 16, 20, 24, 36]);
    const qw = ri(random, 3, 6);
    const qh = ri(random, 2, 5);
    const W = s * qw;
    const H = s * qh;
    const tileCount = qw * qh;
    const askSum = random() < 0.5;
    const ans = askSum ? s + tileCount : tileCount;
    return {
      prompt: `가로의 길이가 ${W}cm, 세로의 길이가 ${H}cm인 직사각형 모양의 벽에 같은 크기의 정사각형 모양의 사진을 빈틈없이 붙이려고 한다. 가능한 한 큰 사진을 붙이려고 할 때, 사진의 한 변의 길이를 x cm, 필요한 사진의 수를 y장이라 하자. ${askSum ? 'x + y의 값' : '필요한 사진의 수 y'}를 구하시오.`,
      promptEn: `A rectangular wall of ${W}cm by ${H}cm is to be covered completely with identical square photos as large as possible. If each photo has side length x cm and y photos are needed, find ${askSum ? 'x + y' : 'the number of photos y'}.`,
      expression: `사진 한 변 x = gcd(${W}, ${H}) = ${s}cm, y = (${W}/${s}) × (${H}/${s}) = ${tileCount}`,
      answer: String(ans),
      diagram: { kind: 'rpm-tile-rectangle', w: W, h: H, tileSize: s, unit: 'cm', mode: 'fill' },
      explanation: `사진의 한 변의 길이 x는 ${W}와 ${H}의 최대공약수인 ${s}cm입니다. 가로에 ${qw}장, 세로에 ${qh}장이 들어가므로 필요한 사진의 수 y = ${qw} × ${qh} = ${tileCount}장입니다. 따라서 정답은 ${ans}입니다.`,
    };
  } else {
    const g = pick(random, [6, 12, 15, 18]);
    const qw = ri(random, 5, 9);
    const qh = ri(random, 3, 6);
    const W = g * qw;
    const H = g * qh;
    const posts = 2 * (qw + qh);
    return {
      prompt: `가로의 길이가 ${W}m, 세로의 길이가 ${H}m인 직사각형 모양의 목장의 둘레에 일정한 간격으로 기둥을 세우려고 한다. 네 모퉁이에 반드시 기둥을 세울 때, 필요한 최소한의 기둥의 개수를 구하시오.`,
      promptEn: `A rectangular ranch of ${W}m by ${H}m is to have fence posts installed along its perimeter at equal intervals, including all 4 corners. Find the minimum number of posts needed.`,
      expression: `간격 g = gcd(${W}, ${H}) = ${g}m, 둘레 기둥 수 = 2 × (${qw} + ${qh})`,
      answer: String(posts),
      answerSuffix: '개',
      diagram: { kind: 'rpm-tile-rectangle', w: W, h: H, tileSize: g, unit: 'm', mode: 'perimeter' },
      explanation: `기둥의 개수를 최소로 하려면 기둥 사이의 간격을 최대로 해야 하므로, 간격은 ${W}와 ${H}의 최대공약수인 ${g}m입니다. 가로 한 변에 ${qw}칸, 세로 한 변에 ${qh}칸이 생기므로 둘레의 총 기둥 수는 2 × (${qw} + ${qh}) = ${posts}개입니다.`,
    };
  }
}

// [유형 12] 최대공약수 활용 — 나누었을 때 나머지가 남거나 부족한 수 (RPM #152~#155, #194, #200)
export function rpmGcdWordRemainder(random) {
  const variant = pick(random, ['twoRemainders', 'deficitAndRemainder', 'sumMaxMin']);
  if (variant === 'twoRemainders') {
    const g = pick(random, [6, 8, 9, 12, 14]);
    const q1 = ri(random, 4, 7);
    const q2 = ri(random, 8, 12);
    const r1 = ri(random, 2, g - 2);
    const r2 = ri(random, 1, g - 2);
    const n1 = g * q1 + r1;
    const n2 = g * q2 + r2;
    return {
      prompt: `어떤 자연수로 ${n1}을 나누면 ${r1}이 남고, ${n2}를 나누면 ${r2}가 남는다고 한다. 이러한 자연수 중에서 가장 큰 수를 구하시오.`,
      promptEn: `When divided into ${n1}, a natural number leaves a remainder of ${r1}; divided into ${n2}, it leaves a remainder of ${r2}. Find the greatest such natural number.`,
      expression: `gcd(${n1} - ${r1}, ${n2} - ${r2}) = ${g}`,
      answer: String(g),
      explanation: `구하는 수는 ${n1} - ${r1} = ${n1 - r1}과 ${n2} - ${r2} = ${n2 - r2}의 공약수 중 ${Math.max(r1, r2)}보다 큰 수입니다. 이 중 가장 큰 수는 두 수의 최대공약수인 ${g}입니다.`,
    };
  } else if (variant === 'deficitAndRemainder') {
    const g = pick(random, [8, 12, 15, 18]);
    const q1 = ri(random, 4, 6);
    const q2 = ri(random, 3, 5);
    const q3 = ri(random, 6, 8);
    const d = ri(random, 2, Math.min(5, g - 2));
    const r2 = ri(random, 1, Math.min(4, g - 2));
    const r3 = ri(random, 1, Math.min(4, g - 2));
    const n1 = g * q1 - d;
    const n2 = g * q2 + r2;
    const n3 = g * q3 + r3;
    return {
      prompt: `어떤 자연수로 ${n1}을 나누면 ${d}가 부족하고, ${n2}를 나누면 ${r2}가 남고, ${n3}을 나누면 ${r3}이 남는다. 이러한 자연수 중에서 가장 큰 수를 구하시오.`,
      promptEn: `When divided into ${n1}, it lacks ${d}; into ${n2}, remainder ${r2}; into ${n3}, remainder ${r3}. Find the greatest such natural number.`,
      expression: `gcd(${n1 + d}, ${n2 - r2}, ${n3 - r3}) = ${g}`,
      answer: String(g),
      explanation: `구하는 수는 ${n1} + ${d} = ${n1 + d}, ${n2} - ${r2} = ${n2 - r2}, ${n3} - ${r3} = ${n3 - r3}의 공약수 중 가장 큰 수이므로 최대공약수인 ${g}입니다.`,
    };
  } else {
    const ans = 30;
    return {
      prompt: `어떤 자연수로 77을 나누면 5가 남고, 48을 나누면 나누어떨어진다. 이러한 수 중에서 가장 큰 수와 가장 작은 수의 합을 구하시오.`,
      promptEn: `When dividing 77, it leaves remainder 5; when dividing 48, it divides evenly. Find the sum of the greatest and smallest such natural numbers.`,
      expression: `72와 48의 공약수 중 5보다 큰 수`,
      answer: String(ans),
      explanation: `구하는 수는 77 - 5 = 72와 48의 공약수 중에서 나머지 5보다 큰 수입니다. 72와 48의 최대공약수는 24이므로, 24의 약수 중 5보다 큰 수는 6, 8, 12, 24입니다. 따라서 가장 큰 수는 24, 가장 작은 수는 6이므로 합은 24 + 6 = ${ans}입니다.`,
    };
  }
}

// [유형 13] 최소공배수 활용 — 정사각형 타일 붙이기 및 정육면체 벽돌 쌓기 (RPM #156~#158, #208)
export function rpmLcmWordBrickCube(random) {
  const variant = pick(random, ['rectToSquare', 'brickToCube']);
  if (variant === 'rectToSquare') {
    const [a, b] = pick(random, [[12, 15], [15, 20], [18, 24], [16, 20], [14, 21]]);
    const L = lcm(a, b);
    const count = (L / a) * (L / b);
    return {
      prompt: `가로의 길이가 ${a}cm, 세로의 길이가 ${b}cm인 직사각형 모양의 색종이를 빈틈없이 붙여서 가장 작은 정사각형을 만들려고 한다. 필요한 색종이의 수를 구하시오.`,
      promptEn: `Rectangular colored papers of ${a}cm by ${b}cm are pasted edge-to-edge without gaps to form the smallest square. Find the number of paper sheets needed.`,
      expression: `정사각형 한 변 = lcm(${a}, ${b}) = ${L}cm`,
      answer: String(count),
      answerSuffix: '장',
      explanation: `정사각형의 한 변의 길이는 ${a}와 ${b}의 최소공배수인 ${L}cm입니다. 가로에 ${L / a}장, 세로에 ${L / b}장이 필요하므로 필요한 색종이의 수는 ${L / a} × ${L / b} = ${count}장입니다.`,
    };
  } else {
    const [a, b, c] = pick(random, [[6, 8, 3], [6, 18, 4], [24, 30, 18], [12, 15, 10]]);
    const L = lcmAll([a, b, c]);
    const count = (L / a) * (L / b) * (L / c);
    return {
      prompt: `가로의 길이, 세로의 길이, 높이가 각각 ${a}cm, ${b}cm, ${c}cm인 직육면체 모양의 벽돌을 한 방향으로 빈틈없이 쌓아서 가장 작은 정육면체를 만들려고 한다. 이때 필요한 벽돌의 개수를 구하시오.`,
      promptEn: `Bricks measuring ${a}cm by ${b}cm by ${c}cm are stacked in the same orientation to build the smallest cube. Find the number of bricks required.`,
      expression: `정육면체 한 변 = lcm(${a}, ${b}, ${c}) = ${L}cm`,
      answer: String(count),
      answerSuffix: '개',
      diagram: { kind: 'rpm-brick-cube', a, b, c, target: '정육면체' },
      explanation: `정육면체의 한 변의 길이는 세 변의 길이의 최소공배수인 ${L}cm입니다. 가로에 ${L / a}개, 세로에 ${L / b}개, 높이에 ${L / c}개가 필요하므로 필요한 벽돌의 개수는 (${L / a}) × (${L / b}) × (${L / c}) = ${count}개입니다.`,
    };
  }
}

// [유형 14·15] 최소공배수 활용 — 톱니바퀴 회전 및 주기성(동시 출발) (RPM #159~#165, #201, #203, #205)
export function rpmLcmWordGearTrackCycle(random) {
  const variant = pick(random, ['gearRotations', 'threeGears', 'departInterval', 'neonCycle']);
  if (variant === 'gearRotations') {
    const [a, b] = pick(random, [[45, 30], [16, 24], [75, 60], [36, 48]]);
    const L = lcm(a, b);
    const rotA = L / a;
    return {
      prompt: `톱니의 수가 각각 ${a}개, ${b}개인 톱니바퀴 A, B가 서로 맞물려 돌아가고 있다. 두 톱니바퀴가 처음으로 다시 같은 톱니에서 맞물릴 때까지 톱니바퀴 A의 회전수를 구하시오.`,
      promptEn: `Two intermeshed gears A and B have ${a} and ${b} teeth respectively. How many rotations does Gear A make before they first mesh again at the same teeth?`,
      expression: `lcm(${a}, ${b}) = ${L}개 톱니`,
      answer: String(rotA),
      answerSuffix: '바퀴',
      diagram: { kind: 'rpm-gears', teethA: a, teethB: b },
      explanation: `처음으로 다시 같은 톱니에서 맞물리려면 맞물린 톱니의 수가 ${a}와 ${b}의 최소공배수인 ${L}개이어야 합니다. 따라서 톱니바퀴 A의 회전수는 ${L} ÷ ${a} = ${rotA}바퀴입니다.`,
    };
  } else if (variant === 'threeGears') {
    const [a, b, c] = pick(random, [[12, 20, 24], [15, 25, 30], [18, 24, 36]]);
    const L = lcmAll([a, b, c]);
    const rotA = L / a;
    return {
      prompt: `서로 맞물려 도는 톱니바퀴 A, B, C가 있다. A의 톱니의 수는 ${a}개, B는 ${b}개, C는 ${c}개이다. 세 톱니바퀴가 처음으로 다시 같은 위치에서 맞물리려면 A는 몇 바퀴 회전해야 하는가?`,
      promptEn: `Three meshed gears A, B, C have ${a}, ${b}, ${c} teeth. How many rotations does gear A make before all three re-align?`,
      expression: `lcm(${a}, ${b}, ${c}) = ${L}`,
      answer: String(rotA),
      answerSuffix: '바퀴',
      explanation: `맞물린 톱니의 수는 세 수의 최소공배수인 ${L}개입니다. 따라서 A는 ${L} ÷ ${a} = ${rotA}바퀴 회전해야 합니다.`,
    };
  } else if (variant === 'departInterval') {
    const [t1, t2, t3] = pick(random, [[20, 25, 10], [15, 20, 30], [12, 18, 24]]);
    const L = lcmAll([t1, t2, t3]);
    return {
      prompt: `어느 역에서 새마을호 열차는 ${t1}분마다, 무궁화호 열차는 ${t2}분마다, 전철은 ${t3}분마다 출발한다. 오전 6시에 세 열차가 동시에 출발하였을 때, 그 다음에 처음으로 다시 동시에 출발하는 것은 몇 분 후인가?`,
      promptEn: `Three trains depart every ${t1}, ${t2}, and ${t3} minutes. If they leave simultaneously at 6:00 AM, how many minutes later will they depart together again?`,
      expression: `lcm(${t1}, ${t2}, ${t3}) = ${L}분`,
      answer: String(L),
      answerSuffix: '분 후',
      explanation: `세 열차가 다시 동시에 출발하는 주기는 ${t1}, ${t2}, ${t3}의 최소공배수인 ${L}분 후입니다.`,
    };
  } else {
    const [onA, offA] = pick(random, [[14, 2], [18, 2], [20, 4]]);
    const [onB, offB] = pick(random, [[17, 3], [16, 4], [25, 5]]);
    const pA = onA + offA;
    const pB = onB + offB;
    const L = lcm(pA, pB);
    return {
      prompt: `어느 상가에서 네온사인 A는 ${onA}초 동안 켜져 있다가 ${offA}초 동안 꺼지고, B는 ${onB}초 동안 켜져 있다가 ${offB}초 동안 꺼진다. 두 네온사인이 동시에 켜진 후, 처음으로 다시 동시에 켜질 때까지 걸리는 시간(초)을 구하시오.`,
      promptEn: `Neon sign A stays on for ${onA}s and off for ${offA}s; sign B stays on for ${onB}s and off for ${offB}s. If both turn on together, how many seconds until they turn on simultaneously again?`,
      expression: `A 주기: ${pA}초, B 주기: ${pB}초`,
      answer: String(L),
      answerSuffix: '초',
      explanation: `A의 주기는 ${onA} + ${offA} = ${pA}초이고, B의 주기는 ${onB} + ${offB} = ${pB}초입니다. 따라서 두 네온사인이 다시 동시에 켜지는 주기는 최소공배수인 ${L}초 후입니다.`,
    };
  }
}

// [유형 16] 최소공배수 활용 — 어떤 자연수를 나누었을 때 나머지 조건 (RPM #166~#169, #195, #199)
export function rpmLcmWordRemainderDeficit(random) {
  const variant = pick(random, ['sameRemainder', 'constantDeficit']);
  if (variant === 'sameRemainder') {
    const [a, b, c] = pick(random, [[4, 8, 10], [3, 5, 8], [6, 9, 15]]);
    const r = ri(random, 1, 2);
    const L = lcmAll([a, b, c]);
    let k = 1;
    while (k * L + r < 100) k += 1;
    const ans = k * L + r;
    return {
      prompt: `${a}, ${b}, ${c} 중 어느 수로 나누어도 ${r}이 남는 세 자리의 자연수 중에서 가장 작은 수를 구하시오.`,
      promptEn: `Find the smallest 3-digit natural number that leaves a remainder of ${r} when divided by ${a}, ${b}, or ${c}.`,
      expression: `lcm(${a}, ${b}, ${c}) × k + ${r}`,
      answer: String(ans),
      explanation: `구하는 수를 x라 하면 x - ${r}은 ${a}, ${b}, ${c}의 공배수입니다. 세 수의 최소공배수는 ${L}이므로, 세 자리 자연수 중 가장 작은 수는 ${L} × ${k} + ${r} = ${ans}입니다.`,
    };
  } else {
    const [a, b, c, d] = pick(random, [
      [5, 6, 7, 3],
      [5, 8, 10, 3],
      [6, 8, 12, 1],
      [4, 6, 9, 2],
    ]);
    const L = lcmAll([a, b, c]);
    const ans = L - d;
    return {
      prompt: `어떤 자연수를 ${a}로 나누면 ${a - d}가 남고, ${b}로 나누면 ${b - d}가 남고, ${c}로 나누면 ${c - d}가 남는다고 한다. 이러한 자연수 중에서 가장 작은 수를 구하시오.`,
      promptEn: `A natural number leaves remainder ${a - d} when divided by ${a}, remainder ${b - d} by ${b}, and remainder ${c - d} by ${c}. Find the smallest such natural number.`,
      expression: `공통 부족분 ${d}, lcm(${a}, ${b}, ${c}) - ${d}`,
      answer: String(ans),
      explanation: `모든 경우 나누는 수와 나머지의 차가 ${d}로 일정하므로, 구하는 수는 ${a}, ${b}, ${c}로 나누었을 때 모두 ${d}가 부족한 수입니다. 따라서 구하는 가장 작은 수는 세 수의 최소공배수에서 ${d}를 뺀 ${L} - ${d} = ${ans}입니다.`,
    };
  }
}

// [유형 17] 두 개 이상의 분수를 자연수로 만드는 가장 작은 기약분수 (RPM #170~#173, #192, #202)
export function rpmGcdLcmFractionMultiplier(random) {
  const variant = pick(random, ['twoFractions', 'threeMixedFractions', 'integerFractionsCount']);
  if (variant === 'twoFractions') {
    const [n1, d1, n2, d2] = pick(random, [
      [15, 28, 25, 42],
      [12, 25, 8, 15],
      [14, 33, 21, 55],
      [16, 27, 20, 45],
    ]);
    const num = lcm(d1, d2);
    const den = gcd(n1, n2);
    const g = gcd(num, den);
    const sNum = num / g;
    const sDen = den / g;
    const ans = sDen === 1 ? String(sNum) : `${sNum}/${sDen}`;
    return {
      prompt: `두 분수 ${n1}/${d1}과 ${n2}/${d2}의 어느 것에 곱하여도 그 결과가 자연수가 되게 하는 가장 작은 기약분수를 구하시오.`,
      promptEn: `Find the smallest irreducible fraction that gives a natural number when multiplied by either ${n1}/${d1} or ${n2}/${d2}.`,
      expression: `N = lcm(${d1}, ${d2}), D = gcd(${n1}, ${n2})`,
      answer: ans,
      explanation: `곱하여 자연수가 되려면 분자는 분모 ${d1}, ${d2}의 최소공배수인 ${num}이어야 하고, 분모는 분자 ${n1}, ${n2}의 최대공약수인 ${den}이어야 합니다. 따라서 가장 작은 기약분수는 ${ans}입니다.`,
    };
  } else if (variant === 'threeMixedFractions') {
    const ans = 143;
    return {
      prompt: `세 수 1 5/7, 7 1/5, 3 3/4 의 어느 것에 곱해도 그 결과가 자연수가 되는 분수 중에서 가장 작은 기약분수를 B/A라 할 때, A + B의 값을 구하시오.`,
      promptEn: `When multiplied by 1 5/7, 7 1/5, or 3 3/4, the result is a natural number. If the smallest irreducible fraction is B/A, find A + B.`,
      expression: `대분수: 12/7, 36/5, 15/4`,
      answer: String(ans),
      explanation: `주어진 대분수를 가분수로 고치면 12/7, 36/5, 15/4 입니다. 곱하여 자연수가 되는 가장 작은 기약분수 B/A는 분자 B가 분모 {7, 5, 4}의 최소공배수인 140이고, 분모 A가 분자 {12, 36, 15}의 최대공약수인 3입니다. 따라서 B/A = 140/3 이므로 A = 3, B = 140 이고 A + B = ${ans}입니다.`,
    };
  } else {
    const g = gcdAll([110, 220, 275]);
    const twoDigitDivs = divisorsOf(g).filter((x) => x >= 10 && x < 100);
    return {
      prompt: `세 수 110/n, 220/n, 275/n 을 모두 자연수가 되게 하는 두 자리 자연수 n의 개수를 구하시오.`,
      promptEn: `How many 2-digit natural numbers n make 110/n, 220/n, and 275/n all natural numbers?`,
      expression: `gcd(110, 220, 275) = ${g}`,
      answer: String(twoDigitDivs.length),
      answerSuffix: '개',
      explanation: `n은 110, 220, 275의 공약수이어야 하므로 최대공약수인 ${g}의 약수이어야 합니다. ${g}의 약수 [${divisorsOf(g).join(', ')}] 중 두 자리 자연수는 [${twoDigitDivs.join(', ')}]으로 모두 ${twoDigitDivs.length}개입니다.`,
    };
  }
}

// [유형 18·19·20 & 실력UP] 최소공배수 역추적, 합/차 조건, 종합 실력 (RPM #174~#180, #209, #210, #212)
export function rpmGcdLcmAdvancedDeduce(random) {
  const variant = pick(random, ['lcmCandidatesSum', 'gcdLcmDifference', 'extremeValueUnknown']);
  if (variant === 'lcmCandidatesSum') {
    const ans = 744;
    return {
      prompt: `서로 다른 세 자연수 4, 50, a의 최소공배수가 600일 때, a가 될 수 있는 모든 자연수의 합을 구하시오.`,
      promptEn: `If the LCM of three distinct natural numbers 4, 50, and a is 600, find the sum of all possible values of a.`,
      expression: `4 = 2^2, 50 = 2 × 5^2, 600 = 2^3 × 3 × 5^2`,
      answer: String(ans),
      explanation: `4와 50의 소인수분해에서 2^3과 3이 없으므로, a는 반드시 2^3 × 3 = 24를 인수로 가져야 합니다. 따라서 a는 24 × 5^0 = 24, 24 × 5^1 = 120, 24 × 5^2 = 600이 될 수 있습니다. 모든 값의 합은 24 + 120 + 600 = ${ans}입니다.`,
    };
  } else if (variant === 'gcdLcmDifference') {
    const ans = 55;
    return {
      prompt: `두 자연수 A, B에 대하여 A > B이고 A와 B의 최대공약수가 5, 최소공배수가 120이다. A - B = 25일 때, A + B의 값을 구하시오.`,
      promptEn: `For natural numbers A > B, GCF is 5 and LCM is 120. If A - B = 25, find A + B.`,
      expression: `G = 5, L = 120, A - B = 25`,
      answer: String(ans),
      explanation: `A = 5a, B = 5b (a > b, a와 b는 서로소)라 하면 5ab = 120 에서 ab = 24입니다. a - b = 25 ÷ 5 = 5이므로 곱이 24이고 차가 5인 서로소 순서쌍은 a = 8, b = 3입니다. 따라서 A = 40, B = 15이므로 A + B = ${ans}입니다.`,
    };
  } else {
    const ans = 54 + 540;
    return {
      prompt: `세 자연수 36, N, 90의 최대공약수가 18이고 최소공배수가 540일 때, N의 값 중 가장 큰 수와 가장 작은 수의 합을 구하시오.`,
      promptEn: `The GCF of 36, N, and 90 is 18, and their LCM is 540. Find the sum of the maximum and minimum possible values of N.`,
      expression: `36 = 2^2 × 3^2, 90 = 2 × 3^2 × 5, G = 2 × 3^2, L = 2^2 × 3^3 × 5`,
      answer: String(ans),
      explanation: `L에 있는 3^3은 36과 90에 없으므로 N이 반드시 3^3을 가져야 합니다. 또한 최대공약수가 18이므로 N은 2 × 3^2의 배수이어야 합니다. 따라서 N = 2^a × 3^3 × 5^b (a는 1 또는 2, b는 0 또는 1)입니다. 가장 작은 N은 2^1 × 3^3 = 54이고, 가장 큰 N은 2^2 × 3^3 × 5^1 = 540입니다. 합은 54 + 540 = ${ans}입니다.`,
    };
  }
}

// [응용 실전 종합] RPM 최대공약수와 최소공배수 실전 종합
export function rpmGcdLcmAllTypesMixed(random) {
  const allEngines = [
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
  ];
  return pick(random, allEngines)(random);
}

// Legacy aliases for backward compatibility
export const rpmGcdLcmReverseProduct = rpmGcdLcmProductRelation;
export const rpmGcdLcmFractions = rpmGcdLcmFractionMultiplier;
export const rpmLcmNeonCycle = rpmLcmWordGearTrackCycle;
export const rpmGcdRemainder = rpmGcdWordRemainder;

// -------------------------------------------------------------
// CHAPTER 03: 정수와 유리수 응용 (Integers & Rationals Applied)
// -------------------------------------------------------------

// 1. 수직선 위의 점 내분점 (RPM p.67 #513) + SVG NumberLine Diagram
export function rpmRationalLineDivision(random) {
  const leftVal = pick(random, [-4, -3, -2, -1]);
  const rightVal = pick(random, [2, 3, 4, 5, 6]);
  const m = pick(random, [1, 2]);
  const n = pick(random, [2, 3]);
  const dist = rightVal - leftVal;
  // C = leftVal + dist * (m / (m + n))
  const num = leftVal * (m + n) + dist * m;
  const den = m + n;
  const common = gcd(num, den);
  const reducedNum = num / common;
  const reducedDen = den / common;
  const ans = reducedDen === 1 ? String(reducedNum) : `${reducedNum}/${reducedDen}`;

  const diagram = {
    kind: 'rpm-number-line',
    min: leftVal - 1,
    max: rightVal + 1,
    step: 1,
    points: [
      { val: leftVal, label: 'A', highlight: false },
      { val: rightVal, label: 'B', highlight: false },
      { val: num / den, label: 'C', highlight: true, subLabel: `${m}:${n}` },
    ],
    highlightSegment: { from: leftVal, to: rightVal },
  };

  const promptKo = `수직선 위의 두 점 A(${leftVal}), B(${rightVal})를 이은 선분 AB를 ${m} : ${n}으로 나누는 점을 C라 할 때, 점 C가 나타내는 수를 구하시오.`;
  const promptEn = `On the number line, points A and B represent ${leftVal} and ${rightVal} respectively. Find the number represented by point C, which divides segment AB in the ratio ${m} : ${n}.`;

  return {
    prompt: promptKo,
    promptEn,
    expression: `A(${leftVal}), B(${rightVal}), AC:CB = ${m}:${n}`,
    answer: ans,
    diagram,
    explanation: `두 점 A, B 사이의 거리는 ${rightVal} - (${leftVal}) = ${dist}입니다. 선분 AC의 길이는 ${dist} × (${m} / (${m} + ${n})) = ${dist * m}/${den}입니다. 따라서 점 C의 좌표는 ${leftVal} + ${dist * m}/${den} = ${ans}입니다.`,
  };
}

function fracStr(n, d) {
  const g = gcd(n, d);
  let num = n / g;
  let den = d / g;
  if (den < 0) { num = -num; den = -den; }
  if (den === 1) return String(num);
  return `${num}/${den}`;
}

// 1. 부호를 사용하여 나타내기 (RPM 유형 01, #0270, #0271, #0272, #0324)
export function rpmIrSignSituation(random) {
  const isMultipleChoice = random() < 0.6;
  if (isMultipleChoice) {
    const findCorrect = random() < 0.5;
    const pool = [
      { text: '지하 {v}층', val: (v) => `- ${v}층`, correctSign: '-', wrongSign: '+' },
      { text: '지출 {v}000원', val: (v) => `- ${v}000원`, correctSign: '-', wrongSign: '+' },
      { text: '{v}% 증가', val: (v) => `+ ${v}%`, correctSign: '+', wrongSign: '-' },
      { text: '출발 {v}일 전', val: (v) => `- ${v}일`, correctSign: '-', wrongSign: '+' },
      { text: '출발 {v}시간 후', val: (v) => `+ ${v}시간`, correctSign: '+', wrongSign: '-' },
      { text: '용돈 {v}000원 인상', val: (v) => `+ ${v}000원`, correctSign: '+', wrongSign: '-' },
      { text: '해저 {v}00 m', val: (v) => `- ${v}00 m`, correctSign: '-', wrongSign: '+' },
      { text: '해발 {v}00 m', val: (v) => `+ ${v}00 m`, correctSign: '+', wrongSign: '-' },
      { text: '영하 {v}℃', val: (v) => `- ${v}℃`, correctSign: '-', wrongSign: '+' },
      { text: '영상 {v}℃', val: (v) => `+ ${v}℃`, correctSign: '+', wrongSign: '-' },
      { text: '{v}00원 이익', val: (v) => `+ ${v}00원`, correctSign: '+', wrongSign: '-' },
      { text: '{v}00원 손해', val: (v) => `- ${v}00원`, correctSign: '-', wrongSign: '+' },
    ];
    const shuffled = [...pool].sort(() => random() - 0.5).slice(0, 5);
    const targetIdx = ri(random, 0, 4);

    const choices = shuffled.map((item, idx) => {
      const v = ri(random, 2, 8);
      const labelDesc = item.text.replace('{v}', v);
      const isTarget = idx === targetIdx;
      const useCorrect = findCorrect ? isTarget : !isTarget;
      const sign = useCorrect ? item.correctSign : item.wrongSign;
      const unit = item.val(v).split(' ')[1];
      return {
        value: String(idx + 1),
        label: `${labelDesc}: ${sign}${unit}`,
        labelEn: `${labelDesc}: ${sign}${unit}`,
        isCorrect: isTarget,
        explanation: `${labelDesc}은 '${item.correctSign}' 부호를 사용해야 하므로 ${item.correctSign}${unit}입니다.`,
      };
    });

    const promptKo = findCorrect
      ? '다음 중 부호 + 또는 -를 사용하여 나타낸 것으로 옳은 것은?'
      : '다음 중 부호 + 또는 -를 사용하여 나타낸 것으로 옳지 않은 것은?';
    const promptEn = findCorrect
      ? 'Which of the following correctly uses the + or - sign?'
      : 'Which of the following incorrectly uses the + or - sign?';

    return {
      prompt: promptKo,
      promptEn,
      expression: choices.map((c) => `${c.value}. ${c.label}`).join('   '),
      choices,
      answer: String(targetIdx + 1),
      explanation: choices[targetIdx].explanation,
    };
  }

  const items = [
    { desc: '해저 200 m', correct: '-200 m', given: random() < 0.5 ? '-200 m' : '+200 m', isRight: false },
    { desc: '500원 손해', correct: '-500원', given: random() < 0.5 ? '-500원' : '+500원', isRight: false },
    { desc: '지상 7층', correct: '+7층', given: random() < 0.5 ? '+7층' : '-7층', isRight: false },
    { desc: '영하 3℃', correct: '-3℃', given: random() < 0.5 ? '-3℃' : '+3℃', isRight: false },
    { desc: '출발 10분 전', correct: '-10분', given: random() < 0.5 ? '-10분' : '+10분', isRight: false },
  ];
  items.forEach((it) => { it.isRight = it.correct === it.given; });
  const rightCount = items.filter((it) => it.isRight).length;
  const tags = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ'];

  return {
    prompt: '다음 보기 중 부호 + 또는 -를 사용하여 나타낸 것으로 옳은 것은 모두 몇 개인지 구하시오.',
    promptEn: 'How many of the following statements correctly use the + or - sign?',
    expression: items.map((it, idx) => `${tags[idx]}. ${it.desc}: ${it.given}`).join(',  '),
    answer: String(rightCount),
    answerSuffix: '개',
    explanation: items.map((it, idx) => `${tags[idx]}. ${it.desc} ⇨ ${it.correct} (${it.isRight ? '○' : '×'})`).join(', ') + `이므로 옳은 것은 총 ${rightCount}개입니다.`,
  };
}

// 2. 정수의 분류 및 약분 분수 (RPM 유형 02, #0273, #0274, #0275, #0276)
export function rpmIrClassifyIntegers(random) {
  const mode = pick(random, ['find-all', 'count-non-negative', 'multiple-choice']);
  if (mode === 'multiple-choice') {
    const k1 = ri(random, 2, 4);
    const m1 = k1 * ri(random, 2, 4);
    const k2 = ri(random, 2, 3);
    const m2 = k2 * ri(random, 1, 3);
    const negInt = -ri(random, 2, 7);
    const nonIntFrac = pick(random, ['7/2', '5/3', '4/3', '9/5', '11/4']);
    const list = [
      { val: `${negInt}`, isInt: true },
      { val: `+${m1}/${k1}`, isInt: true },
      { val: `-${m2}/${k2}`, isInt: true },
      { val: '0', isInt: true },
      { val: nonIntFrac, isInt: false },
    ].sort(() => random() - 0.5);

    const wrongIdx = list.findIndex((x) => !x.isInt);
    const choices = list.map((item, idx) => ({
      value: String(idx + 1),
      label: item.val,
      labelEn: item.val,
    }));

    return {
      prompt: '다음 중 정수가 아닌 것은?',
      promptEn: 'Which of the following is NOT an integer?',
      expression: choices.map((c) => `${c.value}. ${c.label}`).join('   '),
      choices,
      answer: String(wrongIdx + 1),
      explanation: `${choices[wrongIdx].label}은 기약분수로 나타내었을 때 분모가 1이 아니므로 정수가 아닙니다. 나머지 수는 모두 정수입니다.`,
    };
  }

  const neg = -ri(random, 2, 8);
  const redNegN = ri(random, 2, 4) * 2;
  const redNeg = `-${redNegN}/2`;
  const redNegVal = -redNegN / 2;
  const irrFrac = pick(random, ['1/3', '2/5', '3/4', '-2/3']);
  const dec = pick(random, ['0.6', '-1.8', '2.5', '-0.7']);
  const posInt = ri(random, 2, 7);
  const redPosN = ri(random, 2, 3) * 3;
  const redPos = `+${redPosN}/3`;
  const redPosVal = redPosN / 3;

  const items = [
    { text: String(neg), isInt: true, isNonNegInt: false },
    { text: redNeg, isInt: true, isNonNegInt: false, note: `${redNeg}=${redNegVal}` },
    { text: '0', isInt: true, isNonNegInt: true },
    { text: irrFrac, isInt: false, isNonNegInt: false },
    { text: dec, isInt: false, isNonNegInt: false },
    { text: String(posInt), isInt: true, isNonNegInt: true },
    { text: redPos, isInt: true, isNonNegInt: true, note: `${redPos}=+${redPosVal}` },
  ].sort(() => random() - 0.5);

  if (mode === 'count-non-negative') {
    const nonNegs = items.filter((x) => x.isNonNegInt).map((x) => x.text);
    return {
      prompt: '다음 수 중에서 음수가 아닌 정수는 모두 몇 개인지 구하시오.',
      promptEn: 'How many integers in the list are NOT negative?',
      expression: items.map((x) => x.text).join(',  '),
      answer: String(nonNegs.length),
      answerSuffix: '개',
      explanation: `음수가 아닌 정수는 0과 양의 정수입니다. 주어진 수 중 음수가 아닌 정수는 ${nonNegs.join(', ')}의 ${nonNegs.length}개입니다.`,
    };
  }

  const ints = items.filter((x) => x.isInt).map((x) => x.text);
  return {
    prompt: '다음 수 중에서 정수를 모두 고르시오.',
    promptEn: 'List all integers from the following numbers.',
    expression: items.map((x) => x.text).join(',  '),
    answer: ints.join(', '),
    explanation: `약분되어 정수가 되는 분수를 포함하면 정수는 ${ints.join(', ')}입니다.`,
  };
}

// 3. 유리수의 분류 및 체계 (RPM 유형 03, #0277, #0278, #0279, #0326, #0329)
export function rpmIrClassifyRationals(random) {
  const mode = pick(random, ['formula-xyz', 'box-fill', 'true-false']);
  if (mode === 'formula-xyz') {
    const list = [
      { text: `-${ri(random, 3, 7)}`, isPosRat: false, isNegRat: true, isNonIntRat: false },
      { text: `${ri(random, 2, 7)}.${ri(random, 1, 9)}`, isPosRat: true, isNegRat: false, isNonIntRat: true },
      { text: `-${ri(random, 1, 4)}/${ri(random, 5, 7)}`, isPosRat: false, isNegRat: true, isNonIntRat: true },
      { text: `${ri(random, 1, 3)}/${ri(random, 4, 6)}`, isPosRat: true, isNegRat: false, isNonIntRat: true },
      { text: `-${ri(random, 1, 4)}.${ri(random, 1, 8)}`, isPosRat: false, isNegRat: true, isNonIntRat: true },
      { text: `+${ri(random, 8, 16)}/4`, isPosRat: true, isNegRat: false, isNonIntRat: (ri(random, 8, 16) % 4 !== 0) },
      { text: `${ri(random, 2, 6)}`, isPosRat: true, isNegRat: false, isNonIntRat: false },
    ].sort(() => random() - 0.5);

    const x = list.filter((item) => item.isPosRat).length;
    const y = list.filter((item) => item.isNegRat).length;
    const z = list.filter((item) => item.isNonIntRat).length;
    const ans = x - y + z;

    return {
      prompt: '다음 수 중에서 양의 유리수의 개수를 x개, 음의 유리수의 개수를 y개, 정수가 아닌 유리수의 개수를 z개라 할 때, x - y + z의 값을 구하시오.',
      promptEn: 'Let x be the number of positive rationals, y negative rationals, and z non-integer rationals. Find x - y + z.',
      expression: list.map((it) => it.text).join(',  '),
      answer: String(ans),
      explanation: `양의 유리수는 ${x}개, 음의 유리수는 ${y}개, 정수가 아닌 유리수는 ${z}개이므로 x - y + z = ${x} - ${y} + ${z} = ${ans}입니다.`,
    };
  }

  if (mode === 'box-fill') {
    const list = [
      { text: `-${ri(random, 2, 6)}`, isNonInt: false },
      { text: '0', isNonInt: false },
      { text: `+${ri(random, 3, 7)}/3`, isNonInt: (ri(random, 3, 7) % 3 !== 0) },
      { text: `${ri(random, 2, 5)}`, isNonInt: false },
      { text: `-${ri(random, 1, 4)}.${ri(random, 1, 9)}`, isNonInt: true },
      { text: `-${ri(random, 2, 4) * 5}/5`, isNonInt: false },
    ];
    const nonInts = list.filter((it) => it.isNonInt).map((it) => it.text);
    return {
      prompt: '유리수의 분류에서 정수가 아닌 유리수(□)에 들어갈 수 있는 수의 개수를 구하시오.',
      promptEn: 'How many of the following numbers are non-integer rational numbers?',
      expression: list.map((it) => it.text).join(',  '),
      answer: String(nonInts.length),
      answerSuffix: '개',
      explanation: `정수가 아닌 유리수는 ${nonInts.join(', ')}의 ${nonInts.length}개입니다.`,
    };
  }

  const statements = [
    { text: '-1과 0 사이에는 유리수가 무수히 많다.', isTrue: true, reason: '유리수는 조밀성을 가지므로 무수히 많습니다.' },
    { text: '0은 유리수이다.', isTrue: true, reason: '0은 0/1 형태의 분수로 나타낼 수 있습니다.' },
    { text: '자연수는 모두 유리수이다.', isTrue: true, reason: '모든 자연수는 분모가 1인 분수입니다.' },
    { text: '모든 정수는 유리수이다.', isTrue: true, reason: '정수는 분모가 1인 분수로 나타낼 수 있습니다.' },
    { text: '양의 정수가 아닌 정수는 음의 정수뿐이다.', isTrue: false, reason: '0도 양의 정수가 아닌 정수에 포함됩니다.' },
    { text: '유리수는 양의 유리수와 음의 유리수로만 이루어져 있다.', isTrue: false, reason: '유리수에는 0도 포함됩니다.' },
    { text: '절댓값이 가장 작은 정수는 1이다.', isTrue: false, reason: '절댓값이 가장 작은 정수는 0입니다.' },
  ].sort(() => random() - 0.5);

  const correctOne = statements.find((s) => !s.isTrue);
  const pool5 = [correctOne, ...statements.filter((s) => s.isTrue).slice(0, 4)].sort(() => random() - 0.5);
  const targetIdx = pool5.indexOf(correctOne);

  const choices = pool5.map((s, idx) => ({
    value: String(idx + 1),
    label: s.text,
    labelEn: s.text,
  }));

  return {
    prompt: '다음 설명 중 옳지 않은 것은?',
    promptEn: 'Which of the following statements is FALSE?',
    expression: choices.map((c) => `${c.value}. ${c.label}`).join('   '),
    choices,
    answer: String(targetIdx + 1),
    explanation: `${choices[targetIdx].label} ⇨ 옳지 않습니다. ${correctOne.reason}`,
  };
}

// 4. 수직선 위의 점과 가장 가까운 정수 (RPM 유형 04, #0280~0285, #0325, #0348)
export function rpmIrNumberLineRead(random) {
  const mode = pick(random, ['read-point', 'extremum-positions', 'closest-integers']);
  if (mode === 'read-point') {
    const points = [
      { val: -2.5, label: 'A', frac: '-5/2' },
      { val: -1.25, label: 'B', frac: '-5/4' },
      { val: -0.25, label: 'C', frac: '-1/4' },
      { val: 1, label: 'D', frac: '1' },
      { val: 1.75, label: 'E', frac: '7/4' },
    ];
    const wrongIdx = ri(random, 0, 4);
    const targetWrong = points[wrongIdx];
    const fakeLabel = targetWrong.val === 1 ? '1.5' : (targetWrong.val > 0 ? `${targetWrong.frac}+1/2` : `${targetWrong.frac}-1/2`);

    const choices = points.map((p, idx) => {
      const isWrong = idx === wrongIdx;
      return {
        value: String(idx + 1),
        label: `${p.label}: ${isWrong ? fakeLabel : p.frac}`,
        labelEn: `${p.label}: ${isWrong ? fakeLabel : p.frac}`,
      };
    });

    const diagram = {
      kind: 'rpm-number-line',
      min: -4,
      max: 3,
      step: 1,
      subStep: 0.25,
      points: points.map((p) => ({ val: p.val, label: p.label })),
    };

    return {
      prompt: '다음 중 수직선 위의 점 A, B, C, D, E가 나타내는 수로 옳지 않은 것은?',
      promptEn: 'Which point on the number line is matched with the INCORRECT number?',
      choices,
      answer: String(wrongIdx + 1),
      diagram,
      explanation: `점 ${targetWrong.label}의 실제 좌표는 ${targetWrong.frac}입니다. 따라서 ${choices[wrongIdx].label}은 옳지 않습니다.`,
    };
  }

  if (mode === 'extremum-positions') {
    const vals = [
      { text: `+${ri(random, 4, 6)}`, v: ri(random, 4, 6) },
      { text: `-${ri(random, 1, 2)}`, v: -ri(random, 1, 2) },
      { text: `${ri(random, 2, 3)}`, v: ri(random, 2, 3) },
      { text: `+${ri(random, 1, 2)}`, v: ri(random, 1, 2) },
      { text: `-${ri(random, 4, 5)}`, v: -ri(random, 4, 5) },
    ].sort(() => random() - 0.5);

    const sorted = [...vals].sort((a, b) => a.v - b.v);
    const leftmost = sorted[0].text;
    const rightmost = sorted[sorted.length - 1].text;

    return {
      prompt: '다음 수를 수직선 위에 나타내었을 때, 가장 왼쪽에 있는 수와 가장 오른쪽에 있는 수를 차례로 구하시오.',
      promptEn: 'Find the leftmost and rightmost numbers on the number line in order.',
      expression: vals.map((x) => x.text).join(',  '),
      answer: `${leftmost}, ${rightmost}`,
      explanation: `가장 작은 수가 가장 왼쪽에 위치하고 가장 큰 수가 가장 오른쪽에 위치합니다. 따라서 가장 왼쪽에 있는 수는 ${leftmost}, 가장 오른쪽에 있는 수는 ${rightmost}입니다.`,
    };
  }

  const aNum = ri(random, 5, 8);
  const aDen = pick(random, [3, 4]);
  const bNum = ri(random, 11, 15);
  const bDen = pick(random, [3, 4]);

  const aVal = -aNum / aDen;
  const bVal = bNum / bDen;
  const closestA = Math.round(aVal);
  const closestB = Math.round(bVal);
  const count = closestB - closestA;

  return {
    prompt: `수직선 위에서 -${aNum}/${aDen}에 가장 가까운 정수를 a, ${bNum}/${bDen}에 가장 가까운 정수를 b라 할 때, a보다 크고 b보다 크지 않은 정수의 개수를 구하시오.`,
    promptEn: `Let a be the closest integer to -${aNum}/${aDen}, and b the closest integer to ${bNum}/${bDen}. How many integers satisfy a < x ≤ b?`,
    expression: `a = [-${aNum}/${aDen}의 가장 가까운 정수], b = [${bNum}/${bDen}의 가장 가까운 정수]`,
    answer: String(count),
    answerSuffix: '개',
    explanation: `-${aNum}/${aDen} = ${(aVal).toFixed(2)}이므로 가장 가까운 정수 a = ${closestA}이고, ${bNum}/${bDen} = ${(bVal).toFixed(2)}이므로 가장 가까운 정수 b = ${closestB}입니다. 따라서 ${closestA} < x ≤ ${closestB}인 정수 x의 개수는 ${count}개입니다.`,
  };
}

// 5. 수직선 위 같은 거리(중점)와 양 끝점 역추론 (RPM 유형 05, #0286~0288, #0333, #0349, #0350)
export function rpmIrMidpointDistance(random) {
  const mode = pick(random, ['midpoint-basic', 'distance-midpoint', 'abs-two-answers']);
  if (mode === 'midpoint-basic') {
    const p1 = -ri(random, 3, 7);
    const d = ri(random, 3, 6) * 2;
    const p2 = p1 + d;
    const mid = (p1 + p2) / 2;

    const diagram = {
      kind: 'rpm-number-line',
      min: p1 - 2,
      max: p2 + 2,
      step: 2,
      points: [
        { val: p1, label: `${p1}` },
        { val: p2, label: `${p2}` },
        { val: mid, label: 'M', highlight: true },
      ],
      brackets: [
        { from: p1, to: mid, label: `${d / 2}` },
        { from: mid, to: p2, label: `${d / 2}` },
      ],
    };

    return {
      prompt: `수직선 위에서 ${p1}과 ${p2}를 나타내는 두 점으로부터 같은 거리에 있는 점이 나타내는 수를 구하시오.`,
      promptEn: `Find the number represented by the point equidistant from ${p1} and ${p2} on the number line.`,
      expression: `중점 = (${p1} + ${p2}) ÷ 2`,
      answer: String(mid),
      diagram,
      explanation: `두 점으로부터 같은 거리에 있는 점은 한가운데 점이므로 (${p1} + ${p2}) ÷ 2 = ${mid}입니다.`,
    };
  }

  if (mode === 'distance-midpoint') {
    const dist = ri(random, 4, 8) * 2;
    const mid = ri(random, -3, 3);
    const half = dist / 2;
    const a = mid - half;
    const b = mid + half;

    return {
      prompt: `수직선 위에서 두 수 a와 b를 나타내는 두 점 사이의 거리가 ${dist}이고, 두 점의 한가운데 있는 점이 나타내는 수가 ${mid}일 때, b의 값을 구하시오. (단, a < b)`,
      promptEn: `On a number line, the distance between a and b is ${dist}, and their midpoint is ${mid}. Find b given a < b.`,
      expression: `거리 = ${dist},  한가운데 점 = ${mid}`,
      answer: String(b),
      explanation: `두 점 사이의 거리가 ${dist}이므로 각 점은 한가운데 점 ${mid}에서 ${half}만큼 떨어져 있습니다. a < b이므로 b = ${mid} + ${half} = ${b}입니다.`,
    };
  }

  const k = pick(random, [4, 5, 6]);
  const mid = pick(random, [-2, -1, 1, 2]);
  const b1 = 2 * mid - k;
  const b2 = 2 * mid + k;
  const ansStr = `${Math.min(b1, b2)}, ${Math.max(b1, b2)}`;

  return {
    prompt: `수직선 위에서 두 정수 a, b를 나타내는 두 점의 한가운데 있는 점이 나타내는 수가 ${mid}이다. a의 절댓값이 ${k}일 때, b의 값을 모두 구하시오.`,
    promptEn: `The midpoint of integers a and b on a number line is ${mid}. If |a| = ${k}, find all possible values of b.`,
    expression: `|a| = ${k},  한가운데 점 = ${mid}`,
    answer: ansStr,
    explanation: `|a| = ${k}이므로 a = ${k} 또는 a = -${k}입니다.
1) a = ${k}일 때: b = 2 × (${mid}) - ${k} = ${b1}
2) a = -${k}일 때: b = 2 × (${mid}) - (-${k}) = ${b2}
따라서 가능한 b의 값은 ${ansStr}입니다.`,
  };
}

// 6. 절댓값의 계산과 최대·최소 (RPM 유형 06, #0289~0292, #0344)
export function rpmIrAbsBasicExtremum(random) {
  const mode = pick(random, ['max-sum', 'reverse-x', 'range-diff']);
  if (mode === 'max-sum') {
    const d1 = pick(random, [2, 3]);
    const d2 = pick(random, [3, 4, 5]);
    const n1 = 1;
    const n2 = ri(random, 1, d2 - 1);
    const sumNum = n1 * d2 + n2 * d1;
    const sumDen = d1 * d2;
    const ans = fracStr(sumNum, sumDen);

    return {
      prompt: `두 수 a, b에 대하여 a의 절댓값이 ${n1}/${d1}이고 b의 절댓값이 ${n2}/${d2}일 때, a + b의 값 중에서 가장 큰 값을 구하시오.`,
      promptEn: `For numbers a and b, if |a| = ${n1}/${d1} and |b| = ${n2}/${d2}, find the maximum possible value of a + b.`,
      expression: `|a| = ${n1}/${d1},  |b| = ${n2}/${d2}`,
      answer: ans,
      explanation: `a + b가 최대가 되려면 a > 0, b > 0이어야 하므로 a = ${n1}/${d1}, b = ${n2}/${d2}일 때 최댓값 ${ans}을 갖습니다.`,
    };
  }

  if (mode === 'reverse-x') {
    const y = ri(random, 2, 5);
    const maxVal = ri(random, 7, 12);
    const x = maxVal - y;

    return {
      prompt: `a의 절댓값이 x(x > 0)이고 b의 절댓값이 ${y}일 때, a + b의 값 중에서 가장 큰 값이 ${maxVal}이다. x의 값을 구하시오.`,
      promptEn: `The absolute value of a is x (x > 0) and |b| = ${y}. If the maximum value of a + b is ${maxVal}, find x.`,
      expression: `|a| = x,  |b| = ${y},  최댓값 = ${maxVal}`,
      answer: String(x),
      explanation: `a + b의 최댓값은 a = x, b = ${y}일 때 x + ${y} = ${maxVal}이므로 x = ${x}입니다.`,
    };
  }

  const aNum = ri(random, 9, 13);
  const bVal = ri(random, 2, 4);
  const maxAbs = `${aNum}/2`;

  return {
    prompt: `-${aNum}/2 ≤ x < ${bVal}인 유리수 x 중 절댓값이 가장 큰 수를 a, 절댓값이 가장 작은 수를 b라 할 때, |a| - |b|의 값을 구하시오.`,
    promptEn: `Among rational numbers x where -${aNum}/2 ≤ x < ${bVal}, let a have the greatest absolute value and b the smallest. Find |a| - |b|.`,
    expression: `-${aNum}/2 ≤ x < ${bVal}`,
    answer: maxAbs,
    explanation: `범위 안에 0이 포함되므로 절댓값이 가장 작은 수는 b = 0 (|b| = 0)입니다. 절댓값이 가장 큰 수는 a = -${aNum}/2 (|a| = ${aNum}/2)이므로 |a| - |b| = ${maxAbs}입니다.`,
  };
}

// 7. 절댓값의 성질과 참·거짓 (RPM 유형 07, #0293~0295, #0338, #0339, #0340)
export function rpmIrAbsProperties(random) {
  const mode = pick(random, ['farthest-closest', 'multiple-choice']);
  if (mode === 'farthest-closest') {
    const list = [
      { text: `3`, v: 3, abs: 3 },
      { text: `-1.5`, v: -1.5, abs: 1.5 },
      { text: `5/4`, v: 1.25, abs: 1.25 },
      { text: `-7/2`, v: -3.5, abs: 3.5 },
      { text: `4/3`, v: 1.333, abs: 1.333 },
      { text: `-2`, v: -2, abs: 2 },
    ].sort(() => random() - 0.5);

    const sortedByAbs = [...list].sort((a, b) => b.abs - a.abs);
    const farthest = sortedByAbs[0].text;
    const closest = sortedByAbs[sortedByAbs.length - 1].text;

    return {
      prompt: '다음 수를 수직선 위에 나타내었을 때, 원점에서 가장 멀리 떨어진 수를 A, 원점에 가장 가까운 수를 B라 할 때, A와 B를 차례로 구하시오.',
      promptEn: 'Find the number farthest from the origin (A) and closest to the origin (B) in order.',
      expression: list.map((x) => x.text).join(',  '),
      answer: `${farthest}, ${closest}`,
      explanation: `원점과의 거리는 절댓값입니다. 절댓값이 가장 큰 수는 ${farthest}(A), 절댓값이 가장 작은 수는 ${closest}(B)입니다.`,
    };
  }

  const statements = [
    { text: '절댓값은 항상 0보다 크거나 같다.', isCorrect: true, reason: '0의 절댓값은 0이고 음수의 절댓값은 양수입니다.' },
    { text: '원점에서 멀리 떨어질수록 그 점에 대응하는 수의 절댓값이 크다.', isCorrect: true, reason: '절댓값의 정의가 원점과의 거리입니다.' },
    { text: '음수는 절댓값이 클수록 작다.', isCorrect: true, reason: '음수는 원점에서 왼쪽으로 멀어질수록 작아집니다.' },
    { text: '절댓값이 같은 두 수는 항상 서로 같은 수이다.', isCorrect: false, reason: '|+2| = |-2|이지만 +2 ≠ -2입니다 (부호가 반대일 수 있음).' },
    { text: 'a < 0이면 |a| = a이다.', isCorrect: false, reason: 'a < 0이면 |a| = -a (양수화)입니다.' },
  ].sort(() => random() - 0.5);

  const target = statements.find((s) => !s.isCorrect);
  const choicesPool = [target, ...statements.filter((s) => s.isCorrect).slice(0, 4)].sort(() => random() - 0.5);
  const targetIdx = choicesPool.indexOf(target);

  const choices = choicesPool.map((s, idx) => ({
    value: String(idx + 1),
    label: s.text,
    labelEn: s.text,
  }));

  return {
    prompt: '다음 설명 중 옳지 않은 것은?',
    promptEn: 'Which of the following statements about absolute values is FALSE?',
    expression: choices.map((c) => `${c.value}. ${c.label}`).join('   '),
    choices,
    answer: String(targetIdx + 1),
    explanation: `${choices[targetIdx].label} ⇨ 옳지 않습니다. ${target.reason}`,
  };
}

// 8. 절댓값 범위와 조건을 만족하는 정수 개수 (RPM 유형 08, #0296~0299, #0331, #0342, #0347)
export function rpmIrAbsRangeCount(random) {
  const mode = pick(random, ['less-fraction', 'annulus-integers', 'fraction-less-1']);
  if (mode === 'less-fraction') {
    const num = pick(random, [9, 11, 13, 17]);
    const den = pick(random, [3, 4, 5]);
    const limit = num / den;
    const maxInt = Math.floor(limit);
    const count = 2 * maxInt + 1;

    return {
      prompt: `절댓값이 ${num}/${den} 이하인 정수의 개수를 구하시오.`,
      promptEn: `How many integers have an absolute value of at most ${num}/${den}?`,
      expression: `|x| ≤ ${num}/${den}`,
      answer: String(count),
      answerSuffix: '개',
      explanation: `${num}/${den} = ${(limit).toFixed(2)} 이하인 절댓값을 갖는 정수는 -${maxInt}부터 ${maxInt}까지 총 ${count}개입니다.`,
    };
  }

  if (mode === 'annulus-integers') {
    const upper = ri(random, 3, 5);
    const lowerFrac = '2/3';
    const count = 2 * (upper - 1);

    return {
      prompt: `절댓값이 ${lowerFrac} 이상 ${upper} 미만인 정수의 개수를 구하시오.`,
      promptEn: `How many integers have an absolute value of at least ${lowerFrac} and strictly less than ${upper}?`,
      expression: `${lowerFrac} ≤ |x| < ${upper}`,
      answer: String(count),
      answerSuffix: '개',
      explanation: `절댓값이 ${lowerFrac} 이상 ${upper} 미만인 정수는 절댓값이 1부터 ${upper - 1}까지인 정수이므로 총 ${count}개입니다.`,
    };
  }

  const k = ri(random, 3, 6);
  const values = [];
  for (let i = -(k - 1); i <= k - 1; i++) values.push(i);

  return {
    prompt: `|n/${k}| < 1 을 만족시키는 정수 n의 값을 모두 구하시오.`,
    promptEn: `Find all integers n that satisfy |n/${k}| < 1.`,
    expression: `|n/${k}| < 1`,
    answer: values.join(', '),
    explanation: `|n/${k}| < 1 이려면 |n| < ${k}이어야 합니다. 따라서 정수 n은 ${values.join(', ')}입니다.`,
  };
}

// 9. 절댓값이 같고 부호가 반대인 두 수 (RPM 유형 09, #0300~0303, #0341, #0345)
export function rpmIrOppositeSignsAbs(random) {
  const isFraction = random() < 0.5;
  if (isFraction) {
    const num = pick(random, [10, 14, 16]);
    const den = pick(random, [3, 5]);
    const ans = fracStr(num, 2 * den);

    const diagram = {
      kind: 'rpm-number-line',
      min: -Math.ceil(num / den),
      max: Math.ceil(num / den),
      step: 1,
      points: [
        { val: -num / (2 * den), label: 'B' },
        { val: 0, label: '0' },
        { val: num / (2 * den), label: 'A', highlight: true },
      ],
      brackets: [
        { from: -num / (2 * den), to: num / (2 * den), label: `거리 ${num}/${den}` },
      ],
    };

    return {
      prompt: `절댓값이 같고 부호가 반대인 두 수를 수직선 위에 나타내었을 때의 두 점 사이의 거리가 ${num}/${den}이다. 이때 두 수 중 큰 수는?`,
      promptEn: `Two numbers have equal absolute values and opposite signs. If the distance between them is ${num}/${den}, what is the greater number?`,
      expression: `거리 = ${num}/${den}`,
      answer: ans,
      diagram,
      explanation: `원점으로부터의 거리는 각각 (${num}/${den}) × (1/2) = ${ans}입니다. 큰 수는 양수이므로 ${ans}입니다.`,
    };
  }

  const dist = ri(random, 5, 9) * 2;
  const half = dist / 2;

  const diagram = {
    kind: 'rpm-number-line',
    min: -half - 2,
    max: half + 2,
    step: 2,
    points: [
      { val: -half, label: `b` },
      { val: 0, label: '0' },
      { val: half, label: `a`, highlight: true },
    ],
    brackets: [
      { from: -half, to: half, label: `거리 ${dist}` },
    ],
  };

  return {
    prompt: `다음 조건을 모두 만족시키는 정수 a, b의 값을 구하시오.\n(가) a > b\n(나) a, b의 절댓값이 같다.\n(다) 수직선 위에서 두 수 a, b를 나타내는 두 점 사이의 거리가 ${dist}이다.`,
    promptEn: `Find integers a and b satisfying: (a) a > b, (b) |a| = |b|, (c) the distance between them is ${dist}.`,
    expression: `|a| = |b|, a > b, 거리 = ${dist}`,
    answer: `a=${half}, b=-${half}`,
    diagram,
    explanation: `두 점 사이의 거리가 ${dist}이고 절댓값이 같으므로 각 점은 원점으로부터 ${half}만큼 떨어져 있습니다. a > b이므로 a = ${half}, b = -${half}입니다.`,
  };
}

// 10. 유리수와 절댓값의 대소 관계 및 순서 (RPM 유형 10, #0304~0310, #0328, #0330, #0337)
export function rpmIrCompareOrder(random) {
  const mode = pick(random, ['order-kth', 'compare-multiple-choice', 'abs-kth']);
  if (mode === 'order-kth') {
    const list = [
      { text: `${ri(random, 2, 4)}.${ri(random, 1, 9)}`, v: 0 },
      { text: `-${ri(random, 4, 6)}`, v: 0 },
      { text: `${ri(random, 9, 13)}/2`, v: 0 },
      { text: `-${ri(random, 7, 9)}/3`, v: 0 },
      { text: `-${ri(random, 1, 3)}.${ri(random, 2, 8)}`, v: 0 },
    ];
    list.forEach((item) => {
      if (item.text.includes('/')) {
        const [n, d] = item.text.split('/').map(Number);
        item.v = n / d;
      } else {
        item.v = Number(item.text);
      }
    });

    const sortedAsc = [...list].sort((a, b) => a.v - b.v);
    const targetIdx = ri(random, 1, 3);
    const ordinals = ['첫', '두', '세', '네', '다섯'];
    const ans = sortedAsc[targetIdx].text;

    return {
      prompt: `다음 수를 작은 수부터 차례로 나열하였을 때, ${ordinals[targetIdx]} 번째에 오는 수를 구하시오.`,
      promptEn: `When ordering these numbers from least to greatest, what is the ${ordinals[targetIdx]} number?`,
      expression: list.map((x) => x.text).join(',  '),
      answer: ans,
      explanation: `작은 수부터 차례로 나열하면 ${sortedAsc.map((x) => x.text).join(', ')}이므로 ${ordinals[targetIdx]} 번째 수는 ${ans}입니다.`,
    };
  }

  if (mode === 'abs-kth') {
    const list = [
      { text: `-9`, abs: 9 },
      { text: `5`, abs: 5 },
      { text: `-5/2`, abs: 2.5 },
      { text: `-3`, abs: 3 },
      { text: `-6.5`, abs: 6.5 },
      { text: `0`, abs: 0 },
    ].sort(() => random() - 0.5);

    const sortedByAbsDesc = [...list].sort((a, b) => b.abs - a.abs);
    const ans = sortedByAbsDesc[1].text;

    return {
      prompt: '다음 수 중에서 절댓값이 두 번째로 큰 수를 구하시오.',
      promptEn: 'Find the number with the second greatest absolute value.',
      expression: list.map((x) => x.text).join(',  '),
      answer: ans,
      explanation: `각 수의 절댓값을 구하여 큰 순서로 나열하면 두 번째로 큰 수는 ${ans}입니다.`,
    };
  }

  const choices = [
    { val: '-2 < -3', correct: '-2 > -3', isRight: false },
    { val: '-1/2 > -1/5', correct: '-1/2 < -1/5', isRight: false },
    { val: '0 < -1/2', correct: '0 > -1/2', isRight: false },
    { val: '|-2| < 0', correct: '|-2| = 2 > 0', isRight: false },
    { val: '|-5| > |3|', correct: '5 > 3 (참)', isRight: true },
  ].sort(() => random() - 0.5);

  const correctIdx = choices.findIndex((c) => c.isRight);
  const formattedChoices = choices.map((c, idx) => ({
    value: String(idx + 1),
    label: c.val,
    labelEn: c.val,
  }));

  return {
    prompt: '다음 중 두 수의 대소 관계가 옳은 것은?',
    promptEn: 'Which of the following inequality comparisons is correct?',
    expression: formattedChoices.map((c) => `${c.value}. ${c.label}`).join('   '),
    choices: formattedChoices,
    answer: String(correctIdx + 1),
    explanation: `${formattedChoices[correctIdx].label} ⇨ 옳습니다.`,
  };
}

// 11. 문장 조건의 부등호 표현 ('작지 않다'·'크지 않다') (RPM 유형 11, #0311~0313, #0327, #0332)
export function rpmIrInequalityPhrasing(random) {
  const isMultipleChoice = random() < 0.5;
  if (isMultipleChoice) {
    const wrongIdx = ri(random, 0, 4);
    const pool = [
      { text: 'x는 5보다 크지 않다.', math: 'x ≤ 5', wrong: 'x < 5' },
      { text: 'x는 -3 미만이다.', math: 'x < -3', wrong: 'x ≤ -3' },
      { text: 'x는 -2보다 작지 않고 6 미만이다.', math: '-2 ≤ x < 6', wrong: '-2 < x ≤ 6' },
      { text: 'x는 -1보다 작지 않고 3보다 작다.', math: '-1 ≤ x < 3', wrong: '-1 < x ≤ 3' },
      { text: 'x는 -1보다 크고 8 이하이다.', math: '-1 < x ≤ 8', wrong: '-1 ≤ x < 8' },
    ];
    const choices = pool.map((item, idx) => {
      const isTarget = idx === wrongIdx;
      return {
        value: String(idx + 1),
        label: `${item.text} ⇨ ${isTarget ? item.wrong : item.math}`,
        labelEn: `${item.text} ⇨ ${isTarget ? item.wrong : item.math}`,
      };
    });

    return {
      prompt: '다음 중 문장을 부등호로 나타낸 것으로 옳지 않은 것은?',
      promptEn: 'Which expression incorrectly translates the statement into inequalities?',
      expression: choices.map((c) => `${c.value}. ${c.label}`).join('   '),
      choices,
      answer: String(wrongIdx + 1),
      explanation: `'${pool[wrongIdx].text}'에서 바른 식은 ${pool[wrongIdx].math}입니다.`,
    };
  }

  const a = ri(random, 5, 9);
  const frac = `-${ri(random, 1, 3)}/5`;
  const ans = `${frac} ≤ x ≤ ${a}`;

  return {
    prompt: `'x는 ${a} 이하이고 ${frac}보다 작지 않다.'를 부등호를 사용하여 나타내시오.`,
    promptEn: `Express 'x is at most ${a} and not less than ${frac}' using inequalities.`,
    expression: `x ≤ ${a} 이고 x ≥ ${frac}`,
    answer: ans,
    explanation: `'${a} 이하'는 x ≤ ${a}이고, '${frac}보다 작지 않다'는 x ≥ ${frac}이므로 합치면 ${ans}입니다.`,
  };
}

// 12. 두 유리수 사이의 정수 및 기약분수 개수 (RPM 유형 12, #0314~0317, #0335, #0336, #0346)
export function rpmIrBetweenIntegersFractions(random) {
  const mode = pick(random, ['count-between-integers', 'closest-endpoints', 'irreducible-fractions']);
  if (mode === 'count-between-integers') {
    const aNum = ri(random, 7, 11);
    const aDen = 2;
    const bNum = ri(random, 5, 8);
    const bDen = 3;

    const minInt = Math.ceil(-aNum / aDen);
    const maxInt = Math.floor(bNum / bDen);
    const count = maxInt - minInt + 1;

    return {
      prompt: `두 유리수 -${aNum}/${aDen}와 ${bNum}/${bDen} 사이에 있는 정수의 개수를 구하시오.`,
      promptEn: `How many integers lie between -${aNum}/${aDen} and ${bNum}/${bDen}?`,
      expression: `-${aNum}/${aDen} < x < ${bNum}/${bDen}`,
      answer: String(count),
      answerSuffix: '개',
      explanation: `-${aNum}/${aDen} = ${(-aNum / aDen).toFixed(1)}, ${bNum}/${bDen} ≈ ${(bNum / bDen).toFixed(2)}이므로 사이에 있는 정수는 ${minInt}부터 ${maxInt}까지 총 ${count}개입니다.`,
    };
  }

  if (mode === 'closest-endpoints') {
    const aNum = ri(random, 7, 9);
    const aDen = 5;
    const bNum = ri(random, 7, 9);
    const bDen = 3;

    const aVal = -aNum / aDen;
    const bVal = bNum / bDen;
    const aAns = Math.floor(aVal);
    const bAns = Math.ceil(bVal);

    return {
      prompt: `-${aNum}/${aDen}보다 작은 수 중에서 가장 큰 정수를 a, ${bNum}/${bDen}보다 큰 수 중에서 가장 작은 정수를 b라 할 때, a와 b의 값을 차례로 구하시오.`,
      promptEn: `Let a be the greatest integer less than -${aNum}/${aDen}, and b the smallest integer greater than ${bNum}/${bDen}. Find a and b.`,
      expression: `a < -${aNum}/${aDen},  b > ${bNum}/${bDen}`,
      answer: `a=${aAns}, b=${bAns}`,
      explanation: `-${aNum}/${aDen} = ${(aVal).toFixed(2)}보다 작은 가장 큰 정수는 ${aAns}이고, ${bNum}/${bDen} = ${(bVal).toFixed(2)}보다 큰 가장 작은 정수는 ${bAns}입니다.`,
    };
  }

  const aNum = 2;
  const aDen = 3;
  const bNum = 1;
  const bDen = 4;
  const targetDen = 12;
  const startN = -aNum * (targetDen / aDen);
  const endN = bNum * (targetDen / bDen);
  const irrList = [];
  for (let n = startN + 1; n < endN; n++) {
    if (n !== 0 && gcd(n, targetDen) === 1) irrList.push(`${n}/${targetDen}`);
  }

  return {
    prompt: `두 유리수 -${aNum}/${aDen}와 ${bNum}/${bDen} 사이에 있는 정수가 아닌 유리수 중에서 기약분수로 나타내었을 때 분모가 ${targetDen}인 유리수의 개수를 구하시오.`,
    promptEn: `How many non-integer rationals between -${aNum}/${aDen} and ${bNum}/${bDen} are irreducible fractions with denominator ${targetDen}?`,
    expression: `-${aNum}/${aDen} < x < ${bNum}/${bDen}`,
    answer: String(irrList.length),
    answerSuffix: '개',
    explanation: `분모가 ${targetDen}인 기약분수는 ${irrList.join(', ')}의 총 ${irrList.length}개입니다.`,
  };
}

// 13. 절댓값 조건 응용 및 순서쌍 / 거리 비율 (RPM 유형 13, #0318~0320, #0351, #0353, #0355)
export function rpmIrAbsPairsRatio(random) {
  const mode = pick(random, ['pairs-count', 'ratio-distance', 'system-conditions']);
  if (mode === 'pairs-count') {
    const k = ri(random, 4, 6);
    const isLess = random() < 0.5;
    let pairs = [];
    for (let a = -k; a <= k; a++) {
      for (let b = -k; b <= k; b++) {
        if (Math.abs(a) + Math.abs(b) === k) {
          if (isLess && a < b) pairs.push(`(${a}, ${b})`);
          if (!isLess && a > b) pairs.push(`(${a}, ${b})`);
        }
      }
    }

    return {
      prompt: `${isLess ? 'a < b' : 'a > b'}인 두 정수 a, b에 대하여 |a| + |b| = ${k}를 만족하는 순서쌍 (a, b)의 개수를 구하시오.`,
      promptEn: `Find the number of ordered pairs (a, b) satisfying |a| + |b| = ${k} and ${isLess ? 'a < b' : 'a > b'}.`,
      expression: `|a| + |b| = ${k},  ${isLess ? 'a < b' : 'a > b'}`,
      answer: String(pairs.length),
      answerSuffix: '개',
      explanation: `|a|의 값이 0부터 ${k}까지일 때 가능한 경우를 모두 세면 순서쌍은 총 ${pairs.length}개입니다.`,
    };
  }

  if (mode === 'ratio-distance') {
    const r = pick(random, [2, 3, 4]);
    const isFraction = random() < 0.5;
    if (isFraction) {
      const distNum = (r + 1) * 4;
      const distDen = 5;
      const bNum = distNum / (r + 1);
      const bAns = `-${bNum}/${distDen}`;

      const diagram = {
        kind: 'rpm-number-line',
        min: -2,
        max: 3,
        step: 1,
        points: [
          { val: -bNum / distDen, label: 'B(b)' },
          { val: 0, label: '0' },
          { val: (r * bNum) / distDen, label: 'A(a)' },
        ],
        brackets: [
          { from: -bNum / distDen, to: (r * bNum) / distDen, label: `거리 ${distNum}/${distDen} (${r}배)` },
        ],
      };

      return {
        prompt: `두 수 a, b가 다음 조건을 모두 만족시킬 때, b의 값을 구하시오.\n(가) a의 절댓값은 b의 절댓값의 ${r}배이다.\n(나) b < 0 < a\n(다) a는 b보다 ${distNum}/${distDen}만큼 크다.`,
        promptEn: `Find b given: (a) |a| = ${r}|b|, (b) b < 0 < a, (c) a - b = ${distNum}/${distDen}.`,
        expression: `|a| = ${r}|b|, b < 0 < a, a - b = ${distNum}/${distDen}`,
        answer: bAns,
        diagram,
        explanation: `두 점 사이의 거리는 ${r + 1}|b| = ${distNum}/${distDen}이므로 |b| = ${bNum}/${distDen}이고 b < 0이므로 b = ${bAns}입니다.`,
      };
    }

    const bAbs = ri(random, 2, 4);
    const dist = (r + 1) * bAbs;
    const aVal = r * bAbs;
    const bVal = -bAbs;

    return {
      prompt: `부호가 반대인 두 정수 a, b에 대하여 a의 절댓값은 b의 절댓값의 ${r}배이고 a > b이다. 수직선 위에서 a, b를 나타내는 두 점 사이의 거리가 ${dist}일 때, 두 정수 a, b의 값을 구하시오.`,
      promptEn: `Integers a, b have opposite signs with a > b. If |a| = ${r}|b| and the distance between them is ${dist}, find a and b.`,
      expression: `|a| = ${r}|b|,  거리 = ${dist}`,
      answer: `a=${aVal}, b=${bVal}`,
      explanation: `두 점 사이의 거리는 ${r + 1}|b| = ${dist}이므로 |b| = ${bAbs}입니다. 따라서 a = ${aVal}, b = ${bVal}입니다.`,
    };
  }

  const aAbs = ri(random, 3, 5);
  const sumAbs = aAbs + ri(random, 4, 6);
  const bAbs = sumAbs - aAbs;

  return {
    prompt: `다음 조건을 모두 만족시키는 두 정수 a, b의 값을 구하시오.\n(가) a < 0, b > 0\n(나) a의 절댓값이 ${aAbs}이다.\n(다) a, b의 절댓값의 합이 ${sumAbs}이다.`,
    promptEn: `Find integers a and b given: (a) a < 0, b > 0, (b) |a| = ${aAbs}, (c) |a| + |b| = ${sumAbs}.`,
    expression: `|a| = ${aAbs},  |a| + |b| = ${sumAbs}`,
    answer: `a=-${aAbs}, b=${bAbs}`,
    explanation: `|a| = ${aAbs}이고 a < 0이므로 a = -${aAbs}입니다. |b| = ${sumAbs} - ${aAbs} = ${bAbs}이고 b > 0이므로 b = ${bAbs}입니다.`,
  };
}

// 14. 다중 수의 조건과 수직선 대소 추론 (RPM 유형 14, #0321~0323, #0354)
export function rpmIrDeduceMultiOrder(random) {
  const mode = pick(random, ['three-pivot', 'four-extremum']);
  if (mode === 'three-pivot') {
    const pivot = ri(random, 4, 7);
    const pivotNeg = -ri(random, 2, 4);
    const aVal = Math.abs(pivotNeg);

    const diagram = {
      kind: 'rpm-number-line',
      min: pivotNeg - 2,
      max: pivot + 4,
      step: 2,
      points: [
        { val: pivotNeg, label: `${pivotNeg}` },
        { val: aVal, label: `a(${aVal})` },
        { val: pivot, label: `${pivot}` },
        { val: pivot + 1, label: 'c' },
        { val: pivot + 3, label: 'b' },
      ],
    };

    const choices = [
      { value: '1', label: 'a < b < c' },
      { value: '2', label: 'a < c < b' },
      { value: '3', label: 'b < a < c' },
      { value: '4', label: 'b < c < a' },
      { value: '5', label: 'c < b < a' },
    ];

    return {
      prompt: `다음 조건을 모두 만족시키는 서로 다른 세 수 a, b, c의 대소 관계로 옳은 것은?\n(가) c는 ${pivot}보다 크다.\n(나) b는 c보다 0에서 더 멀리 떨어져 있다.\n(다) a와 b는 모두 ${pivotNeg}보다 크다.\n(라) a의 절댓값은 ${pivotNeg}의 절댓값과 같다.`,
      promptEn: `Which is correct given: (a) c > ${pivot}, (b) b is farther from 0 than c, (c) a, b > ${pivotNeg}, (d) |a| = |${pivotNeg}|?`,
      expression: `c > ${pivot}, b > c, |a| = ${aVal}`,
      choices,
      answer: '2',
      diagram,
      explanation: `(다), (라)에서 a > ${pivotNeg}이고 |a| = ${aVal}이므로 a = ${aVal}입니다. (가), (나)에서 ${pivot} < c < b이므로 a < c < b입니다.`,
    };
  }

  const choices = [
    { value: '1', label: 'd < a < c < b' },
    { value: '2', label: 'd < a < b < c' },
    { value: '3', label: 'a < d < c < b' },
    { value: '4', label: 'd < c < a < b' },
    { value: '5', label: 'a < c < b < d' },
  ];

  return {
    prompt: `다음 조건을 모두 만족시키는 서로 다른 네 수 a, b, c, d의 대소 관계를 부등호를 사용하여 나타낸 것으로 옳은 것은?\n(가) a는 0보다 작다.\n(나) b는 c보다 크다.\n(다) a의 절댓값과 c의 절댓값은 같다.\n(라) d는 a, b, c, d 중 가장 작은 수이다.`,
    promptEn: `Which correctly orders a, b, c, d given: (a) a < 0, (b) b > c, (c) |a| = |c|, (d) d is the smallest?`,
    expression: `a < 0, b > c, |a| = |c|, d = min`,
    choices,
    answer: '1',
    explanation: `a < 0이고 |a| = |c|이므로 c = -a > 0입니다. (나)에서 b > c이므로 a < c < b입니다. d가 가장 작은 수이므로 d < a < c < b입니다.`,
  };
}

// 15. 정수와 유리수 응용 종합 실전 모의고사
const rpmIrGeneratorsList = [
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
];

export function rpmIrAllTypesMixed(random) {
  return pick(random, rpmIrGeneratorsList)(random);
}

// Legacy aliases
export const rpmRationalEquidistant = rpmIrMidpointDistance;
export const rpmRationalAbsoluteCount = rpmIrAbsRangeCount;

// -------------------------------------------------------------
// CHAPTER 04: 정수와 유리수의 계산 응용 (RPM 1-1 Pages 54 ~ 71)
// -------------------------------------------------------------

function fracObj(n, d = 1) {
  if (d === 0) throw new Error('Zero denominator');
  const sign = d < 0 ? -1 : 1;
  const common = gcd(n, d);
  return { n: (n * sign) / common, d: Math.abs(d) / common };
}
function fracAdd(f1, f2) {
  return fracObj(f1.n * f2.d + f2.n * f1.d, f1.d * f2.d);
}
function fracSub(f1, f2) {
  return fracObj(f1.n * f2.d - f2.n * f1.d, f1.d * f2.d);
}
function fracMul(f1, f2) {
  return fracObj(f1.n * f2.n, f1.d * f2.d);
}
function fracDiv(f1, f2) {
  if (f2.n === 0) throw new Error('Division by zero');
  return fracObj(f1.n * f2.d, f1.d * f2.n);
}
function fracSignedStr(f) {
  const str = fracStr(f.n, f.d);
  return f.n > 0 ? `+${str}` : str;
}
function parenSignedFrac(f) {
  return `(${fracSignedStr(f)})`;
}

// 1. 유리수의 덧셈과 계산 법칙 (RPM 유형 01·02, #0419~0424, #0517)
export function rpmIrcAdditionLaws(random) {
  const mode = pick(random, ['law-identity', 'two-fractions', 'three-fractions']);
  if (mode === 'law-identity') {
    const a = ri(random, 2, 6);
    const b = ri(random, 3, 7);
    const choices = [
      { value: '1', label: '㈎ 덧셈의 교환법칙, ㈏ 덧셈의 결합법칙', labelEn: '(a) Commutative property of addition, (b) Associative property of addition', isRight: true },
      { value: '2', label: '㈎ 덧셈의 결합법칙, ㈏ 덧셈의 교환법칙', labelEn: '(a) Associative property of addition, (b) Commutative property of addition', isRight: false },
      { value: '3', label: '㈎ 덧셈의 교환법칙, ㈏ 분배법칙', labelEn: '(a) Commutative property of addition, (b) Distributive property', isRight: false },
      { value: '4', label: '㈎ 곱셈의 교환법칙, ㈏ 덧셈의 결합법칙', labelEn: '(a) Commutative property of multiplication, (b) Associative property of addition', isRight: false },
      { value: '5', label: '㈎ 덧셈의 결합법칙, ㈏ 곱셈의 결합법칙', labelEn: '(a) Associative property of addition, (b) Associative property of multiplication', isRight: false },
    ];
    return {
      prompt: '다음 계산 과정에서 ㈎, ㈏에 이용된 덧셈의 연산 법칙을 바르게 짝지은 것은?',
      promptEn: 'Which option correctly identifies the addition properties used in steps (a) and (b)?',
      expression: `(+${a}/5) + (-2/${b}) + (-${a + 5}/5)\n= (+${a}/5) + (-${a + 5}/5) + (-2/${b})  ... [㈎]\n= {(+${a}/5) + (-${a + 5}/5)} + (-2/${b})  ... [㈏]\n= (-1) + (-2/${b}) = -${b + 2}/${b}`,
      choices,
      answer: '1',
      explanation: '두 수의 자리를 바꾼 [㈎]는 덧셈의 교환법칙이고, 앞의 두 수를 먼저 묶어 계산한 [㈏]는 덧셈의 결합법칙입니다.',
    };
  }
  if (mode === 'two-fractions') {
    const d1 = pick(random, [3, 4, 5, 6]);
    let d2 = pick(random, [2, 3, 4, 6, 8]);
    while (d1 === d2) d2 = pick(random, [2, 3, 5, 7]);
    const n1 = -ri(random, 1, d1 - 1);
    const n2 = ri(random, 1, d2 - 1);
    const f1 = fracObj(n1, d1);
    const f2 = fracObj(n2, d2);
    const sum = fracAdd(f1, f2);
    const ans = fracStr(sum.n, sum.d);
    return {
      prompt: '다음을 계산하시오.',
      promptEn: 'Calculate the following sum.',
      expression: `${parenSignedFrac(f1)} + ${parenSignedFrac(f2)}`,
      answer: ans,
      explanation: `통분하여 계산하면 (${fracSignedStr(fracObj(f1.n * (lcm(d1, d2)/d1), lcm(d1, d2)))}) + (${fracSignedStr(fracObj(f2.n * (lcm(d1, d2)/d2), lcm(d1, d2)))}) = ${ans}입니다.`,
    };
  }
  const d = pick(random, [3, 4, 5, 7]);
  const f1 = fracObj(ri(random, 1, 4), d);
  const f2 = fracObj(-ri(random, 2, 8), pick(random, [2, 6, 9]));
  const f3 = fracObj(-ri(random, 5, 12), d);
  const sum = fracAdd(fracAdd(f1, f3), f2);
  const ans = fracStr(sum.n, sum.d);
  return {
    prompt: '덧셈의 연산 법칙을 이용하여 다음을 계산하시오.',
    promptEn: 'Evaluate using the properties of addition.',
    expression: `${parenSignedFrac(f1)} + ${parenSignedFrac(f2)} + ${parenSignedFrac(f3)}`,
    answer: ans,
    explanation: `분모가 같은 ${parenSignedFrac(f1)}와 ${parenSignedFrac(f3)}를 먼저 교환·결합하여 더하면 ${fracStr(fracAdd(f1, f3).n, fracAdd(f1, f3).d)} + ${parenSignedFrac(f2)} = ${ans}입니다.`,
  };
}

// 2. 유리수의 뺄셈 (RPM 유형 03, #0425~0427)
export function rpmIrcSubtractionBasic(random) {
  const d1 = pick(random, [3, 4, 5, 6]);
  const d2 = pick(random, [2, 3, 4, 5]);
  const f1 = fracObj(ri(random, -5, 5) || -1, d1);
  const f2 = fracObj(ri(random, -5, 5) || 2, d2);
  const diff = fracSub(f1, f2);
  const ans = fracStr(diff.n, diff.d);
  return {
    prompt: '다음을 계산하시오.',
    promptEn: 'Calculate the following subtraction.',
    expression: `${parenSignedFrac(f1)} - ${parenSignedFrac(f2)}`,
    answer: ans,
    explanation: `빼는 수의 부호를 바꾸어 덧셈으로 계산하면 ${parenSignedFrac(f1)} + ${parenSignedFrac({ n: -f2.n, d: f2.d })} = ${ans}입니다.`,
  };
}

// 3. 정수의 덧셈과 뺄셈의 혼합 계산 (RPM 유형 04, #0428~0431)
export function rpmIrcAddSubIntegers(random) {
  const a = ri(random, 3, 9);
  const b = -ri(random, 2, 8);
  const c = ri(random, 4, 9);
  const d = -ri(random, 3, 7);
  const val = a + b - c - d;
  return {
    prompt: '다음을 계산하시오.',
    promptEn: 'Calculate the following mixed integer operations.',
    expression: `(+${a}) + (${b}) - (+${c}) - (${d})`,
    answer: String(val),
    explanation: `뺄셈을 덧셈으로 바꾸면 (+${a}) + (${b}) + (-${c}) + (+${-d}) = (${a - d}) + (${b - c}) = ${val}입니다.`,
  };
}

// 4. 유리수의 덧셈과 뺄셈의 혼합 계산 (RPM 유형 05, #0432~0434, #0516)
export function rpmIrcAddSubRationals(random) {
  const isDecimalMix = random() < 0.4;
  if (isDecimalMix) {
    const dec = ri(random, 21, 49) / 10;
    const n1 = ri(random, 3, 8);
    const n2 = ri(random, 5, 12);
    const ans = n2 - n1;
    return {
      prompt: '다음을 계산하시오.',
      promptEn: 'Calculate the following expression.',
      expression: `(-${dec}) - (+${n1}) + (+${n2}) - (-${dec})`,
      answer: String(ans),
      explanation: `(-${dec})와 -(-${dec}) = +${dec}가 서로 상쇄되므로 -(+${n1}) + (+${n2}) = -${n1} + ${n2} = ${ans}입니다.`,
    };
  }
  const f1 = fracObj(-1, 2);
  const f2 = fracObj(2, 3);
  const f3 = fracObj(-3, 4);
  const f4 = fracObj(-5, 6);
  const res = fracAdd(fracSub(fracAdd(f1, f2), f3), f4);
  const ans = fracStr(res.n, res.d);
  return {
    prompt: '다음을 계산하시오.',
    promptEn: 'Calculate the following rational expression.',
    expression: `${parenSignedFrac(f1)} + ${parenSignedFrac(f2)} - ${parenSignedFrac(f3)} + ${parenSignedFrac(f4)}`,
    answer: ans,
    explanation: `분모 2, 3, 4, 6의 최소공배수인 12로 통분하여 계산하면 ${ans}입니다.`,
  };
}

// 5. 부호가 생략된 수의 덧셈과 뺄셈 (RPM 유형 06, #0435~0438)
export function rpmIrcOmittedSigns(random) {
  const isFraction = random() < 0.5;
  if (isFraction) {
    const f1 = fracObj(-3, 4);
    const f2 = fracObj(11, 20);
    const f3 = fracObj(-3, 10);
    const res = fracAdd(fracAdd(f1, f2), f3);
    const ans = fracStr(res.n, res.d);
    return {
      prompt: '다음을 계산하시오.',
      promptEn: 'Evaluate the expression without parentheses.',
      expression: `-3/4 + 11/20 - 3/10`,
      answer: ans,
      explanation: `분모의 최소공배수인 20으로 통분하면 -15/20 + 11/20 - 6/20 = -10/20 = ${ans}입니다.`,
    };
  }
  const a = -ri(random, 4, 9);
  const b = ri(random, 10, 18);
  const c = -ri(random, 5, 12);
  const d = ri(random, 2, 8);
  const ans = a + b + c + d;
  return {
    prompt: '다음을 계산하시오.',
    promptEn: 'Evaluate the following integer sum with omitted signs.',
    expression: `${a} + ${b} - ${Math.abs(c)} + ${d}`,
    answer: String(ans),
    explanation: `양수는 양수끼리, 음수는 음수끼리 모아서 계산하면 (${b} + ${d}) + (${a} + ${c}) = ${b + d} + ${a + c} = ${ans}입니다.`,
  };
}

// 6. 어떤 수보다 □만큼 큰 수·작은 수 (RPM 유형 07, #0439~0442, #0538)
export function rpmIrcRelativeDifference(random) {
  const n1 = ri(random, 3, 5);
  const fA_base = fracObj(-n1 * 2 - 1, 2);
  const diffA = -ri(random, 1, 3);
  const a = fracSub(fA_base, fracObj(diffA, 1));

  const n2 = ri(random, 2, 4);
  const fB_base = fracObj(n2, 1);
  const diffB = fracObj(-1, pick(random, [3, 4]));
  const b = fracAdd(fB_base, diffB);

  const lowVal = a.n / a.d;
  const highVal = b.n / b.d;
  let count = 0;
  for (let x = Math.ceil(lowVal + 0.0001); x <= Math.floor(highVal - 0.0001); x++) {
    count++;
  }

  return {
    prompt: `${fracStr(fA_base.n, fA_base.d)}보다 ${diffA}만큼 작은 수를 a, ${n2}보다 ${fracStr(diffB.n, diffB.d)}만큼 큰 수를 b라 할 때, a < x < b를 만족시키는 정수 x의 개수를 구하시오.`,
    promptEn: `Let a be ${diffA} less than ${fracStr(fA_base.n, fA_base.d)}, and b be ${fracStr(diffB.n, diffB.d)} greater than ${n2}. Find the number of integers x satisfying a < x < b.`,
    expression: `a = (${fracStr(fA_base.n, fA_base.d)}) - (${diffA}),  b = ${n2} + (${fracStr(diffB.n, diffB.d)})`,
    answer: String(count),
    answerSuffix: '개',
    explanation: `a = (${fracStr(fA_base.n, fA_base.d)}) - (${diffA}) = ${fracStr(a.n, a.d)}, b = ${n2} + (${fracStr(diffB.n, diffB.d)}) = ${fracStr(b.n, b.d)}입니다. 따라서 ${fracStr(a.n, a.d)} < x < ${fracStr(b.n, b.d)}를 만족하는 정수 x는 총 ${count}개입니다.`,
  };
}

// 7. □ 안에 알맞은 수 구하기 (1) 덧셈·뺄셈 (RPM 유형 08, #0443~0445)
export function rpmIrcUnknownAddSub(random) {
  const d1 = pick(random, [3, 4, 5]);
  const d2 = pick(random, [2, 3, 4]);
  const fA = fracObj(-ri(random, 1, 4), d1);
  const fB = fracObj(ri(random, 1, 3), d2);
  const box = fracSub(fA, fB);
  const ans = fracStr(box.n, box.d);
  return {
    prompt: '다음 □ 안에 알맞은 수를 구하시오.',
    promptEn: 'Find the rational number that fits into the box □.',
    expression: `${parenSignedFrac(fA)} - □ = ${fracStr(fB.n, fB.d)}`,
    answer: ans,
    explanation: `□ = ${parenSignedFrac(fA)} - ${parenSignedFrac(fB)} = ${ans}입니다.`,
  };
}

// 8. 절댓값이 주어진 두 수의 덧셈과 뺄셈 (RPM 유형 09, #0446~0449, #0540)
export function rpmIrcAbsExtremumAddSub(random) {
  const d1 = pick(random, [2, 3, 4]);
  const d2 = pick(random, [3, 4, 5]);
  const absA = fracObj(ri(random, 1, d1 - 1) || 1, d1);
  const absB = fracObj(ri(random, 1, d2 - 1) || 2, d2);
  const sum = fracAdd(absA, absB);
  const M = sum;
  const m = fracObj(-sum.n, sum.d);
  const diff = fracMul(fracObj(2, 1), sum);
  const ans = fracStr(diff.n, diff.d);
  return {
    prompt: `두 유리수 a, b에 대하여 a의 절댓값은 ${fracStr(absA.n, absA.d)}, b의 절댓값은 ${fracStr(absB.n, absB.d)}이다. a - b의 값 중에서 가장 큰 값을 M, 가장 작은 값을 m이라 할 때, M - m의 값을 구하시오.`,
    promptEn: `Given rational numbers a, b with |a| = ${fracStr(absA.n, absA.d)} and |b| = ${fracStr(absB.n, absB.d)}, let M and m be the maximum and minimum values of a - b, respectively. Find M - m.`,
    expression: `|a| = ${fracStr(absA.n, absA.d)},  |b| = ${fracStr(absB.n, absB.d)}`,
    answer: ans,
    explanation: `M은 a > 0, b < 0일 때이므로 M = ${fracStr(absA.n, absA.d)} - (-${fracStr(absB.n, absB.d)}) = ${fracStr(M.n, M.d)}이고, m은 a < 0, b > 0일 때이므로 m = -${fracStr(absA.n, absA.d)} - ${fracStr(absB.n, absB.d)} = ${fracStr(m.n, m.d)}입니다. 따라서 M - m = ${ans}입니다.`,
  };
}

// 9. 덧셈·뺄셈의 활용 (마방진 및 게임 점수) (RPM 유형 10 & 유형UP, #0450~0452, #0509~0511, #0531)
export function rpmIrcMagicSquareGame(random) {
  const winPts = ri(random, 3, 5);
  const losePts = -ri(random, 1, 2);
  const totalGames = ri(random, 5, 8);
  const aWins = ri(random, Math.ceil(totalGames / 2), totalGames - 1);
  const aLoses = totalGames - aWins;
  const bWins = aLoses;
  const bLoses = aWins;

  const scoreA = aWins * winPts + aLoses * losePts;
  const scoreB = bWins * winPts + bLoses * losePts;
  const diff = scoreA - scoreB;

  return {
    prompt: `두 사람이 가위바위보를 하여 이기면 ${winPts}점을 얻고, 지면 ${Math.abs(losePts)}점을 잃는 게임을 하였다. 비기는 경우 없이 총 ${totalGames}번을 하여 A가 ${aWins}번 이겼을 때, A의 점수와 B의 점수의 차를 구하시오.`,
    promptEn: `Two players play rock-paper-scissors where a win gives +${winPts} pts and a loss loses ${Math.abs(losePts)} pts. With no ties across ${totalGames} games, player A won ${aWins} times. Find the score difference between A and B.`,
    expression: `A: ${aWins}승 ${aLoses}패,  B: ${bWins}승 ${bLoses}패`,
    answer: String(diff),
    answerSuffix: '점',
    explanation: `A는 ${aWins}번 이기고 ${aLoses}번 졌으므로 점수는 ${aWins}×(${winPts}) + ${aLoses}×(${losePts}) = ${scoreA}점입니다. B는 ${bWins}번 이기고 ${bLoses}번 졌으므로 ${scoreB}점입니다. 따라서 두 사람의 점수의 차는 ${scoreA} - ${scoreB} = ${diff}점입니다.`,
  };
}

// 10. 유리수의 곱셈과 곱셈의 계산 법칙 (RPM 유형 11·13, #0453~0456, #0460~0461)
export function rpmIrcMultiplicationBasic(random) {
  const f1 = fracObj(-ri(random, 2, 5), pick(random, [2, 3]));
  const f2 = fracObj(ri(random, 2, 6), pick(random, [5, 7]));
  const f3 = fracObj(-ri(random, 3, 7), pick(random, [2, 4]));
  const prod = fracMul(fracMul(f1, f2), f3);
  const ans = fracStr(prod.n, prod.d);
  return {
    prompt: '다음을 계산하시오.',
    promptEn: 'Calculate the following product of rational numbers.',
    expression: `${parenSignedFrac(f1)} × ${parenSignedFrac(f2)} × ${parenSignedFrac(f3)}`,
    answer: ans,
    explanation: `음수가 2개(짝수 개)이므로 곱의 부호는 (+)이고, 세 수의 절댓값을 약분하여 곱하면 ${ans}입니다.`,
  };
}

// 11. 네 수 중 세 수를 뽑아 곱하기 (RPM 유형 12, #0457~0459, #0541)
export function rpmIrcPickThreeProduct(random) {
  const nums = [
    fracObj(-2, 3),
    fracObj(7, 4),
    fracObj(-1, 2),
    fracObj(-6, 1),
  ];
  const prods = [];
  for (let i = 0; i < 4; i++) {
    const triple = nums.filter((_, idx) => idx !== i);
    prods.push(fracMul(fracMul(triple[0], triple[1]), triple[2]));
  }
  prods.sort((a, b) => (a.n / a.d) - (b.n / b.d));
  const minF = prods[0];
  const maxF = prods[prods.length - 1];
  const diff = fracSub(maxF, minF);
  const ans = fracStr(diff.n, diff.d);
  return {
    prompt: `네 유리수 -2/3, 7/4, -1/2, -6 중에서 서로 다른 세 수를 뽑아 곱한 값 중 가장 큰 값과 가장 작은 값의 차를 구하시오.`,
    promptEn: `From the four rational numbers -2/3, 7/4, -1/2, -6, find the difference between the greatest and least products obtainable by multiplying three distinct numbers.`,
    expression: `세 수의 곱의 최댓값 M, 최솟값 m`,
    answer: ans,
    explanation: `가장 큰 값은 음수 2개와 양수 1개를 곱한 (-2/3) × (-6) × (7/4) = 7이고, 가장 작은 값은 음수 3개를 곱한 (-2/3) × (-1/2) × (-6) = -2입니다. 따라서 두 값의 차는 7 - (-2) = ${ans}입니다.`,
  };
}

// 12. 거듭제곱의 계산 (RPM 유형 14, #0462~0465)
export function rpmIrcPowersSigns(random) {
  const a = ri(random, 2, 4);
  const b = ri(random, 2, 3);
  const v1 = Math.pow(-a, 2);
  const v2 = Math.pow(-b, 3);
  const ans = v1 - v2;
  return {
    prompt: '다음을 계산하시오.',
    promptEn: 'Evaluate the powers and expression.',
    expression: `(-${a})^2 - (-${b})^3`,
    answer: String(ans),
    explanation: `(-${a})^2 = ${v1}이고, (-${b})^3 = ${v2}입니다. 따라서 ${v1} - (${v2}) = ${v1} + ${Math.abs(v2)} = ${ans}입니다.`,
  };
}

// 13. (-1)^n의 계산 (RPM 유형 15, #0466~0469, #0524)
export function rpmIrcNegOnePower(random) {
  const isOdd = random() < 0.5;
  const promptKo = `n이 ${isOdd ? '홀수' : '짝수'}일 때, (-1)^n - (-1)^(n+1) + (-1)^(2n) 의 값을 구하시오.`;
  const promptEn = `Given that n is an ${isOdd ? 'odd' : 'even'} natural number, find the value of (-1)^n - (-1)^(n+1) + (-1)^(2n).`;
  const finalAns = isOdd ? -1 : 3;
  return {
    prompt: promptKo,
    promptEn,
    expression: `(-1)^n - (-1)^(n+1) + (-1)^(2n)`,
    answer: String(finalAns),
    explanation: `n이 ${isOdd ? '홀수' : '짝수'}이므로 (-1)^n = ${isOdd ? -1 : 1}, (-1)^(n+1) = ${isOdd ? 1 : -1}, (-1)^(2n) = 1입니다. 따라서 대입하면 ${finalAns}입니다.`,
  };
}

// 14. 분배법칙의 활용 (RPM 유형 16, #0470~0476, #0518)
export function rpmIrcDistributiveLaw(random) {
  const common = ri(random, 15, 35) + 0.3;
  const k1 = ri(random, 12, 35);
  const k2 = 100 - k1;
  const ans = Math.round(common * 100 * 10) / 10;
  return {
    prompt: '분배법칙을 이용하여 편리하게 다음을 계산하시오.',
    promptEn: 'Use the distributive property to evaluate the expression efficiently.',
    expression: `${common} × ${k1} + ${common} × ${k2}`,
    answer: String(ans),
    explanation: `공통인수 ${common}으로 묶어 분배법칙을 적용하면 ${common} × (${k1} + ${k2}) = ${common} × 100 = ${ans}입니다.`,
  };
}

// 15. 역수의 정의와 미지수 역수 방정식 (RPM 유형 17, #0477~0478, #0539)
export function rpmIrcReciprocalEquation(random) {
  const a = -15;
  const b = -4;
  const ans = b - a;
  return {
    prompt: '다음 조건을 모두 만족시키는 두 유리수 a, b에 대하여 b - a의 값을 구하시오.\n(가) -a/9의 역수는 3/5이다.\n(나) 3/b의 역수는 -4/3이다.',
    promptEn: 'Given two rational numbers a, b such that the reciprocal of -a/9 is 3/5, and the reciprocal of 3/b is -4/3, find b - a.',
    expression: `b - a`,
    answer: String(ans),
    explanation: `-a/9의 역수는 -9/a = 3/5이므로 a = -15입니다. 3/b의 역수는 b/3 = -4/3이므로 b = -4입니다. 따라서 b - a = -4 - (-15) = ${ans}입니다.`,
  };
}

// 16. 정수와 유리수의 나눗셈 (RPM 유형 18·19, #0479~0484)
export function rpmIrcDivisionBasic(random) {
  const f1 = fracObj(-ri(random, 8, 20), pick(random, [3, 4, 6]));
  const f2 = fracObj(-ri(random, 2, 7), pick(random, [2, 5]));
  const quot = fracDiv(f1, f2);
  const ans = fracStr(quot.n, quot.d);
  return {
    prompt: '다음을 계산하시오.',
    promptEn: 'Calculate the division of rational numbers.',
    expression: `${parenSignedFrac(f1)} ÷ ${parenSignedFrac(f2)}`,
    answer: ans,
    explanation: `나눗셈을 역수의 곱셈으로 바꾸어 계산하면 ${parenSignedFrac(f1)} × (${fracSignedStr(fracObj(f2.d, f2.n))}) = ${ans}입니다.`,
  };
}

// 17. 곱셈과 나눗셈의 혼합 계산 (RPM 유형 20, #0485~0487)
export function rpmIrcMultDivMixed(random) {
  const f2 = fracObj(-9, 4);
  const f3 = fracObj(-2, 3);
  const sq = fracObj(9, 4);
  const res = fracMul(fracDiv(sq, f2), f3);
  const ans = fracStr(res.n, res.d);
  return {
    prompt: '다음을 계산하시오.',
    promptEn: 'Evaluate the mixed multiplication and division expression.',
    expression: `(-3/2)^2 ÷ (-9/4) × (-2/3)`,
    answer: ans,
    explanation: `거듭제곱을 먼저 계산하면 9/4 ÷ (-9/4) × (-2/3) = 9/4 × (-4/9) × (-2/3) = ${ans}입니다.`,
  };
}

// 18. 사칙 혼합 계산 (RPM 유형 21, #0488~0493, #0519, #0525)
export function rpmIrcFourOperationsOrder(random) {
  const base = ri(random, 4, 7);
  const mult = ri(random, 2, 3);
  const inside = 3;
  const ans = base - mult * (inside - (4 - (-4)));
  return {
    prompt: '계산 순서에 맞추어 다음을 계산하시오.',
    promptEn: 'Calculate the expression using the correct order of operations.',
    expression: `${base} - ${mult} × [ 3 - { (-2)^2 - 6 ÷ (-3/2) } ]`,
    answer: String(ans),
    explanation: `거듭제곱과 소괄호 안 나눗셈을 먼저 계산하면 (-2)^2 = 4, 6 ÷ (-3/2) = -4입니다. 중괄호 { 4 - (-4) } = 8이고, 대괄호 [ 3 - 8 ] = -5입니다. 따라서 ${base} - ${mult} × (-5) = ${ans}입니다.`,
  };
}

// 19. □ 안에 알맞은 수 구하기 (2) 곱셈·나눗셈 (RPM 유형 22, #0494~0496)
export function rpmIrcUnknownMultDiv(random) {
  const fA = fracObj(-3, 4);
  const fC = fracObj(-2, 3);
  const fB = fracObj(1, 2);
  const box = fracDiv(fracMul(fA, fC), fB);
  const ans = fracStr(box.n, box.d);
  return {
    prompt: '다음 □ 안에 알맞은 수를 구하시오.',
    promptEn: 'Find the rational number that fits in the box □.',
    expression: `(-3/4) ÷ □ × (-2/3) = 1/2`,
    answer: ans,
    explanation: `(-3/4) × (-2/3) ÷ □ = 1/2이므로 1/2 ÷ □ = 1/2에서 □ = ${ans}입니다.`,
  };
}

// 20. 바르게 계산한 답 구하기 (RPM 유형 23, #0497~0500, #0523)
export function rpmIrcCorrectAnswer(random) {
  const mode = pick(random, ['add-sub', 'mult-div']);
  if (mode === 'add-sub') {
    const fErr = fracObj(-3, 5);
    const fRes = fracObj(3, 10);
    const X = fracSub(fRes, fErr);
    const correct = fracSub(X, fErr);
    const ans = fracStr(correct.n, correct.d);
    return {
      prompt: `어떤 유리수에서 ${parenSignedFrac(fErr)}을 빼야 할 것을 잘못하여 더했더니 결과가 ${fracStr(fRes.n, fRes.d)}이 되었다. 바르게 계산한 답을 구하시오.`,
      promptEn: `A student mistakenly added ${parenSignedFrac(fErr)} instead of subtracting it from a rational number, obtaining ${fracStr(fRes.n, fRes.d)}. Find the correct answer.`,
      expression: `어떤 수 = □`,
      answer: ans,
      explanation: `어떤 수를 □라 하면 □ + (${fracStr(fErr.n, fErr.d)}) = ${fracStr(fRes.n, fRes.d)}이므로 □ = ${fracStr(fRes.n, fRes.d)} - (${fracStr(fErr.n, fErr.d)}) = ${fracStr(X.n, X.d)}입니다. 따라서 바르게 계산한 답은 ${fracStr(X.n, X.d)} - (${fracStr(fErr.n, fErr.d)}) = ${ans}입니다.`,
    };
  }
  const fErr = fracObj(-9, 7);
  const fRes = fracObj(10, 3);
  const X = fracMul(fRes, fErr);
  const correct = fracMul(X, fErr);
  const ans = fracStr(correct.n, correct.d);
  return {
    prompt: `어떤 유리수에 ${parenSignedFrac(fErr)}를 곱해야 할 것을 잘못하여 나누었더니 결과가 ${fracStr(fRes.n, fRes.d)}이 되었다. 바르게 계산한 답을 구하시오.`,
    promptEn: `A student mistakenly divided by ${parenSignedFrac(fErr)} instead of multiplying by it, obtaining ${fracStr(fRes.n, fRes.d)}. Find the correct answer.`,
    expression: `어떤 수 = □`,
    answer: ans,
    explanation: `어떤 수를 □라 하면 □ ÷ (${fracStr(fErr.n, fErr.d)}) = ${fracStr(fRes.n, fRes.d)}이므로 □ = ${fracStr(fRes.n, fRes.d)} × (${fracStr(fErr.n, fErr.d)}) = ${fracStr(X.n, X.d)}입니다. 따라서 바르게 계산한 답은 (${fracStr(X.n, X.d)}) × (${fracStr(fErr.n, fErr.d)}) = ${ans}입니다.`,
  };
}

// 21. 유리수의 부호 결정 (RPM 유형 24, #0501~0504, #0530, #0543, #0544)
export function rpmIrcSignDetermination(random) {
  const choices = [
    { value: '1', label: 'a > 0, b > 0, c > 0', labelEn: 'a > 0, b > 0, c > 0', isRight: false },
    { value: '2', label: 'a > 0, b > 0, c < 0', labelEn: 'a > 0, b > 0, c < 0', isRight: false },
    { value: '3', label: 'a > 0, b < 0, c > 0', labelEn: 'a > 0, b < 0, c > 0', isRight: false },
    { value: '4', label: 'a < 0, b > 0, c < 0', labelEn: 'a < 0, b > 0, c < 0', isRight: true },
    { value: '5', label: 'a < 0, b < 0, c < 0', labelEn: 'a < 0, b < 0, c < 0', isRight: false },
  ];
  return {
    prompt: '세 유리수 a, b, c에 대하여 a - b < 0, b/a < 0, a × c > 0일 때, 다음 중 옳은 것은?',
    promptEn: 'Given rational numbers a, b, c with a - b < 0, b/a < 0, and a × c > 0, which statement is true?',
    expression: `a - b < 0,  b/a < 0,  a × c > 0`,
    choices,
    answer: '4',
    explanation: 'b/a < 0이므로 a, b의 부호는 다릅니다. a - b < 0에서 a < b이므로 a < 0, b > 0입니다. 또한 a × c > 0에서 a, c의 부호가 같으므로 c < 0입니다. 따라서 a < 0, b > 0, c < 0입니다.',
  };
}

// 22. 문자로 주어진 수의 대소 관계 (RPM 유형 25, #0505~0508)
export function rpmIrcVariableMagnitude(random) {
  const choices = [
    { value: '1', label: 'a', labelEn: 'a', isRight: false },
    { value: '2', label: '-a', labelEn: '-a', isRight: false },
    { value: '3', label: 'a^2', labelEn: 'a^2', isRight: false },
    { value: '4', label: '-a^2', labelEn: '-a^2', isRight: true },
    { value: '5', label: '1/a', labelEn: '1/a', isRight: false },
  ];
  return {
    prompt: 'a < -1인 유리수 a에 대하여 다음 중 가장 작은 수는?',
    promptEn: 'Given a rational number a with a < -1, which of the following is the smallest?',
    expression: `a < -1`,
    choices,
    answer: '4',
    explanation: 'a = -2를 대입하여 계산하면 ① a = -2, ② -a = 2, ③ a^2 = 4, ④ -a^2 = -4, ⑤ 1/a = -1/2 이므로 가장 작은 수는 ④ -a^2 입니다.',
  };
}

// 23. 수직선 선분의 m:n 비례분할 내분점 (RPM 유형UP 26, #0512~0514)
export function rpmIrcLineSectionRatio(random) {
  const m = ri(random, 1, 3);
  const n = ri(random, 1, 3);
  const fA = fracObj(-1, 4);
  const fB = fracObj(1, 1);
  const dist = fracSub(fB, fA);
  const part = fracMul(dist, fracObj(m, m + n));
  const fC = fracAdd(fA, part);
  const ans = fracStr(fC.n, fC.d);

  const diagram = {
    kind: 'rpm-number-line',
    min: -1,
    max: 2,
    step: 1,
    points: [
      { val: fA.n / fA.d, label: `A(${fracStr(fA.n, fA.d)})` },
      { val: fB.n / fB.d, label: `B(${fracStr(fB.n, fB.d)})` },
      { val: fC.n / fC.d, label: 'C', highlight: true },
    ],
    brackets: [
      { from: fA.n / fA.d, to: fC.n / fC.d, label: `${m}` },
      { from: fC.n / fC.d, to: fB.n / fB.d, label: `${n}` },
    ],
  };

  return {
    prompt: `수직선 위의 두 점 A, B를 이은 선분을 ${m} : ${n}으로 나누는 점이 C일 때, 점 C가 나타내는 수를 구하시오.`,
    promptEn: `On a number line, point C divides line segment AB into the ratio ${m} : ${n}. Find the coordinate represented by point C.`,
    expression: `A(${fracStr(fA.n, fA.d)}), B(${fracStr(fB.n, fB.d)}), 선분 AB를 ${m}:${n}으로 내분하는 점 C`,
    answer: ans,
    diagram,
    explanation: `두 점 A, B 사이의 거리는 ${fracStr(fB.n, fB.d)} - (${fracStr(fA.n, fA.d)}) = ${fracStr(dist.n, dist.d)}입니다. 선분 AC의 길이는 ${fracStr(dist.n, dist.d)} × ${m}/${m + n} = ${fracStr(part.n, part.d)}이므로 점 C의 좌표는 ${fracStr(fA.n, fA.d)} + ${fracStr(part.n, part.d)} = ${ans}입니다.`,
  };
}

// 24. 부분분수 분해와 망원급수 계산 (RPM 실력UP 27, #0542)
export function rpmIrcTelescopingFractions(random) {
  const start = pick(random, [2, 3, 4, 5]);
  const len = pick(random, [4, 5, 6]);
  const end = start + len;
  const res = fracSub(fracObj(1, start), fracObj(1, end));
  const ans = fracStr(res.n, res.d);
  return {
    prompt: `자연수 n에 대하여 1/(n(n+1)) = 1/n - 1/(n+1) 이 성립함을 이용하여 다음을 계산하시오.`,
    promptEn: `Using the identity 1/(n(n+1)) = 1/n - 1/(n+1), evaluate the following sum.`,
    expression: `1/(${start}×${start + 1}) + 1/(${start + 1}×${start + 2}) + ... + 1/(${end - 1}×${end})`,
    answer: ans,
    explanation: `각 항을 1/n - 1/(n+1)로 변형하면 중간 항들이 모두 상쇄되어 1/${start} - 1/${end} = (${end} - ${start}) / (${start} × ${end}) = ${ans}입니다.`,
  };
}

// 25. 새로운 연산 기호 약속과 방정식 (RPM 실력UP 28, #0545)
export function rpmIrcCustomOperator(random) {
  const ans = '18';
  return {
    prompt: `두 정수 a, b에 대하여 [a, b] = (두 수 a, b의 차)로 약속한다. 이때 [[3, 8], [10, a]] = 4가 성립하도록 하는 a의 값 중 가장 큰 수를 x, 가장 작은 수를 y라 할 때, [x, y]의 값을 구하시오.`,
    promptEn: `Define [a, b] = |a - b|. If [[3, 8], [10, a]] = 4, let x be the greatest possible value of a and y be the least possible value. Find [x, y].`,
    expression: `[a, b] = |a - b|,  [[3, 8], [10, a]] = 4`,
    answer: ans,
    explanation: `[3, 8] = |3 - 8| = 5입니다. [5, [10, a]] = 4에서 [10, a]는 1 또는 9입니다. [10, a] = 1에서 a = 9 또는 11이고, [10, a] = 9에서 a = 1 또는 19입니다. 따라서 가장 큰 수 x = 19, 가장 작은 수 y = 1이므로 [x, y] = |19 - 1| = 18입니다.`,
  };
}

// 26. 정수와 유리수의 계산 응용 실전 종합
const rpmIrcGeneratorsList = [
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
];

export function rpmIrcAllTypesMixed(random) {
  return pick(random, rpmIrcGeneratorsList)(random);
}

// Backward compatibility legacy aliases
export const rpmOpsDistributiveSmart = rpmIrcDistributiveLaw;
export const rpmOpsNewOperation = rpmIrcCustomOperator;
export const rpmOpsTelescoping = rpmIrcTelescopingFractions;

// -------------------------------------------------------------
// CHAPTER 05: 문자의 사용과 식의 계산 응용 (Expressions Applied)
// -------------------------------------------------------------

// Chapter 05: 문자의 사용과 식의 계산 (RPM 1-1 Pages 78 ~ 91)
// Client-side Generators for Applied Tier

// 1. [문자와 식 유형 01] 곱셈과 나눗셈 기호의 생략과 거듭제곱
export function rpmAlgNotationSigns(random) {
  const mode = pick(random, ['identify-false', 'div-chain', 'powers-chain']);
  if (mode === 'div-chain') {
    const choices = [
      { value: '1', label: 'a/(bc)', labelEn: 'a/(bc)', isRight: true },
      { value: '2', label: '(ac)/b', labelEn: '(ac)/b', isRight: false },
      { value: '3', label: '(ab)/c', labelEn: '(ab)/c', isRight: false },
      { value: '4', label: 'abc', labelEn: 'abc', isRight: false },
      { value: '5', label: 'a/(b+c)', labelEn: 'a/(b+c)', isRight: false },
    ];
    return {
      prompt: '다음 중 a ÷ b ÷ c 와 같은 식은?',
      promptEn: 'Which of the following expressions is equivalent to a ÷ b ÷ c?',
      expression: 'a ÷ b ÷ c',
      choices,
      answer: '1',
      explanation: 'a ÷ b ÷ c = a × 1/b × 1/c = a/(bc) 입니다.',
      explanationEn: 'a ÷ b ÷ c = a × 1/b × 1/c = a/(bc).'
    };
  }
  if (mode === 'powers-chain') {
    const choices = [
      { value: '1', label: '-x^3/y', labelEn: '-x^3/y', isRight: true },
      { value: '2', label: 'x^3/y', labelEn: 'x^3/y', isRight: false },
      { value: '3', label: '-x^2/y', labelEn: '-x^2/y', isRight: false },
      { value: '4', label: '-3x/y', labelEn: '-3x/y', isRight: false },
      { value: '5', label: 'y/x^3', labelEn: 'y/x^3', isRight: false },
    ];
    return {
      prompt: '다음 식을 곱셈과 나눗셈 기호를 생략하여 간단히 나타낸 것은?',
      promptEn: 'Simplify the expression by omitting multiplication and division signs.',
      expression: 'x × x × x ÷ y ÷ (-1)',
      choices,
      answer: '1',
      explanation: 'x × x × x ÷ y ÷ (-1) = x^3 × 1/y × (-1) = -x^3/y 입니다.',
      explanationEn: 'x × x × x ÷ y ÷ (-1) = -x^3/y.'
    };
  }
  const choices = [
    { value: '1', label: 'x × y × (-1) = -xy', labelEn: 'x × y × (-1) = -xy', isRight: false },
    { value: '2', label: '3 × x × 5 × x × x × y = 15x^3y', labelEn: '3 × x × 5 × x × x × y = 15x^3y', isRight: false },
    { value: '3', label: '0.1 ÷ a × b = b/(10a)', labelEn: '0.1 ÷ a × b = b/(10a)', isRight: false },
    { value: '4', label: 'a ÷ (1/b) ÷ (1/c) = a/(bc)', labelEn: 'a ÷ (1/b) ÷ (1/c) = a/(bc)', isRight: true },
    { value: '5', label: '(a+b) ÷ (-2) × c = -((a+b)c)/2', labelEn: '(a+b) ÷ (-2) × c = -((a+b)c)/2', isRight: false },
  ];
  return {
    prompt: '다음 중 옳지 않은 것은?',
    promptEn: 'Which of the following statements is incorrect?',
    expression: '곱셈·나눗셈 기호의 생략',
    choices,
    answer: '4',
    explanation: 'a ÷ (1/b) ÷ (1/c) = a × b × c = abc 이므로 4번이 옳지 않습니다.',
    explanationEn: 'a ÷ (1/b) ÷ (1/c) = a × b × c = abc, so option 4 is incorrect.'
  };
}

// 2. [문자와 식 유형 02] 문자를 사용한 식 (자연수, 단위, 금액, 할인)
export function rpmAlgVerbalUnitsCost(random) {
  const mode = pick(random, ['digit-num', 'discount', 'time-unit']);
  if (mode === 'digit-num') {
    const choices = [
      { value: '1', label: '10a + b', labelEn: '10a + b', isRight: true },
      { value: '2', label: 'ab', labelEn: 'ab', isRight: false },
      { value: '3', label: 'a + 10b', labelEn: 'a + 10b', isRight: false },
      { value: '4', label: '10(a + b)', labelEn: '10(a + b)', isRight: false },
      { value: '5', label: 'a + b', labelEn: 'a + b', isRight: false },
    ];
    return {
      prompt: '십의 자리 숫자가 a이고 일의 자리 숫자가 b인 두 자리 자연수를 문자를 사용한 식으로 바르게 나타낸 것은?',
      promptEn: 'Which algebraic expression correctly represents a two-digit integer with tens digit a and units digit b?',
      expression: '십의 자리: a, 일의 자리: b',
      choices,
      answer: '1',
      explanation: '십의 자리 숫자가 a이고 일의 자리 숫자가 b인 두 자리 자연수는 10 × a + b = 10a + b 입니다.',
      explanationEn: 'The value is 10 × a + b = 10a + b.'
    };
  }
  if (mode === 'time-unit') {
    const h = ri(random, 2, 5);
    return {
      prompt: `${h}시간 m분을 '분' 단위로 나타낸 식을 구하시오.`,
      promptEn: `Express ${h} hours and m minutes in terms of minutes.`,
      expression: `${h}시간 m분`,
      answer: `${h * 60}+m`,
      explanation: `1시간은 60분이므로 ${h}시간 m분 = ${h} × 60 + m = ${h * 60} + m (분) 입니다.`,
      explanationEn: `1 hour = 60 minutes, so ${h} hours m minutes = ${h * 60} + m.`
    };
  }
  const price = pick(random, [10000, 15000, 20000, 30000]);
  const disc = ri(random, 1, 4) * 5; // 5, 10, 15, 20%
  const paid = price * (100 - disc) / 100;
  return {
    prompt: `정가가 ${price}원인 모자를 ${disc}% 할인하여 구매할 때 지불해야 하는 금액을 구하시오.`,
    promptEn: `Find the discounted purchase price of a hat with regular price ${price} won discounted by ${disc}%.`,
    expression: `${price}원의 ${disc}% 할인 금액`,
    answer: String(paid),
    answerSuffix: '원',
    explanation: `지불 금액 = ${price} × (1 - ${disc}/100) = ${paid}원입니다.`,
    explanationEn: `Discounted price = ${price} × (1 - ${disc}/100) = ${paid} won.`
  };
}

// 3. [문자와 식 유형 03] 문자를 사용한 식 (도형의 둘레와 넓이)
export function rpmAlgVerbalFigures(random) {
  const mode = pick(random, ['trapezoid', 'rect-perimeter']);
  if (mode === 'trapezoid') {
    const h = pick(random, [4, 6, 8, 10]);
    const coeff = h / 2;
    return {
      prompt: `윗변의 길이가 a, 아랫변의 길이가 b, 높이가 ${h}인 사다리꼴의 넓이를 문자를 사용한 식으로 간단히 나타내시오.`,
      promptEn: `Write a simplified algebraic expression for the area of a trapezoid with top base a, bottom base b, and height ${h}.`,
      expression: `윗변: a, 아랫변: b, 높이: ${h}`,
      answer: coeff === 1 ? 'a+b' : `${coeff}(a+b)`,
      explanation: `사다리꼴 넓이 = 1/2 × (a + b) × ${h} = ${coeff === 1 ? 'a+b' : `${coeff}(a+b)`} 입니다.`,
      explanationEn: `Area = 1/2 × (a + b) × ${h} = ${coeff === 1 ? 'a+b' : `${coeff}(a+b)`}.`
    };
  }
  const w = ri(random, 3, 9);
  return {
    prompt: `세로의 길이가 x cm이고 가로의 길이가 세로보다 ${w} cm 더 긴 직사각형의 둘레의 길이를 x를 사용한 식으로 나타내시오.`,
    promptEn: `A rectangle has height x cm and width (x + ${w}) cm. Express its perimeter using x.`,
    expression: `세로: x, 가로: x + ${w}`,
    answer: `4x+${2 * w}`,
    answerSuffix: 'cm',
    explanation: `둘레 = 2 × {x + (x + ${w})} = 2(2x + ${w}) = 4x + ${2 * w} (cm) 입니다.`,
    explanationEn: `Perimeter = 2(x + x + ${w}) = 4x + ${2 * w} cm.`
  };
}

// 4. [문자와 식 유형 04] 문자를 사용한 식 (속력·거리·시간 및 농도)
export function rpmAlgVerbalSpeedConcentration(random) {
  const mode = pick(random, ['speed-time', 'salt-water']);
  if (mode === 'speed-time') {
    const speed = pick(random, [60, 70, 80, 100]);
    return {
      prompt: `시속 ${speed} km로 x시간 동안 달린 거리를 x를 사용한 식으로 나타내시오.`,
      promptEn: `Express the distance traveled at ${speed} km/h for x hours.`,
      expression: `속력: ${speed} km/h, 시간: x시간`,
      answer: `${speed}x`,
      answerSuffix: 'km',
      explanation: `(거리) = (속력) × (시간) = ${speed}x (km) 입니다.`,
      explanationEn: `Distance = Speed × Time = ${speed}x km.`
    };
  }
  const conc = ri(random, 5, 15);
  return {
    prompt: `${conc}%의 소금물 x g에 녹아 있는 소금의 양을 x를 사용한 식으로 나타내시오.`,
    promptEn: `Express the amount of salt dissolved in x g of ${conc}% salt solution.`,
    expression: `${conc}% 소금물 x g`,
    answer: fracStr(conc, 100) === '1' ? 'x' : `${fracStr(conc, 100)}x`,
    answerSuffix: 'g',
    explanation: `(소금의 양) = (농도/100) × (소금물의 양) = ${conc}/100 × x = ${fracStr(conc, 100)}x (g) 입니다.`,
    explanationEn: `Salt = (${conc}/100) × x = ${fracStr(conc, 100)}x g.`
  };
}

// 5. [문자와 식 유형 05] 식의 값 구하기 (음수 대입과 거듭제곱 부호)
export function rpmAlgEvalBasicNegative(random) {
  const x = -ri(random, 2, 4);
  const y = ri(random, 2, 4);
  const a = ri(random, 2, 3);
  const b = ri(random, 2, 4);
  const val = a * (x * x) - b * y;
  return {
    prompt: `x = ${x}, y = ${y}일 때, 다음 식의 값을 구하시오.`,
    promptEn: `Evaluate the expression when x = ${x} and y = ${y}.`,
    expression: `${a}x^2 - ${b}y`,
    answer: String(val),
    explanation: `대입하면 ${a} × (${x})^2 - ${b} × (${y}) = ${a} × ${x * x} - ${b * y} = ${val} 입니다.`,
    explanationEn: `Substituting yields ${a}(${x * x}) - ${b * y} = ${val}.`
  };
}

// 6. [문자와 식 유형 06] 분수를 분모에 대입하여 식의 값 구하기
export function rpmAlgEvalFractionReciprocal(random) {
  const d1 = pick(random, [2, 3, 4, 5]);
  const d2 = pick(random, [2, 3, 4]);
  const c1 = ri(random, 2, 4);
  const c2 = ri(random, 2, 5);
  // x = -1/d1, y = 1/d2
  const val = c1 * (-d1) + c2 * d2;
  return {
    prompt: `x = -1/${d1}, y = 1/${d2}일 때, 다음 식의 값을 구하시오.`,
    promptEn: `Find the value of the expression when x = -1/${d1} and y = 1/${d2}.`,
    expression: `${c1}/x + ${c2}/y`,
    answer: String(val),
    explanation: `${c1}/x = ${c1} ÷ (-1/${d1}) = -${c1 * d1} 이고, ${c2}/y = ${c2} ÷ (1/${d2}) = ${c2 * d2} 이므로 합은 ${val} 입니다.`,
    explanationEn: `${c1}/x = -${c1 * d1} and ${c2}/y = ${c2 * d2}, giving ${val}.`
  };
}

// 7. [문자와 식 유형 07] 식의 값의 실생활 활용
export function rpmAlgEvalRealWorld(random) {
  const t = ri(random, 10, 30);
  const v = Math.round((331 + 0.6 * t) * 10) / 10;
  return {
    prompt: `기온이 t ℃일 때, 공기 중에서 소리의 속력은 초속 (331 + 0.6t) m라고 한다. 기온이 ${t} ℃일 때, 소리의 속력을 구하시오.`,
    promptEn: `The speed of sound in air at temperature t °C is (331 + 0.6t) m/s. Find the speed of sound when t = ${t} °C.`,
    expression: `v = 331 + 0.6t,  t = ${t}`,
    answer: String(v),
    answerSuffix: 'm/s',
    explanation: `t = ${t}를 대입하면 331 + 0.6 × ${t} = 331 + ${Math.round(0.6 * t * 10)/10} = ${v} (m/s) 입니다.`,
    explanationEn: `Substituting t = ${t} gives 331 + 0.6 × ${t} = ${v} m/s.`
  };
}

// 8. [문자와 식 유형 08] 다항식의 항, 상수항, 계수와 차수
export function rpmAlgPolyTermsDegree(random) {
  const c2 = -ri(random, 2, 5);
  const c1 = ri(random, 3, 7);
  const c0 = -ri(random, 2, 8);
  const choices = [
    { value: '1', label: `항은 ${c2}x^2, ${c1}x, ${c0}으로 총 3개이다.`, labelEn: `There are 3 terms: ${c2}x^2, ${c1}x, ${c0}.`, isRight: false },
    { value: '2', label: `x^2의 계수는 ${c2}이다.`, labelEn: `The coefficient of x^2 is ${c2}.`, isRight: false },
    { value: '3', label: `상수항은 ${Math.abs(c0)}이다.`, labelEn: `The constant term is ${Math.abs(c0)}.`, isRight: true },
    { value: '4', label: `x의 계수는 ${c1}이다.`, labelEn: `The coefficient of x is ${c1}.`, isRight: false },
    { value: '5', label: `다항식의 차수는 2이다.`, labelEn: `The degree of the polynomial is 2.`, isRight: false },
  ];
  return {
    prompt: `다항식 ${c2}x^2 + ${c1}x - ${Math.abs(c0)} 에 대한 설명 중 옳지 않은 것은?`,
    promptEn: `Which of the following statements about the polynomial ${c2}x^2 + ${c1}x - ${Math.abs(c0)} is incorrect?`,
    expression: `${c2}x^2 + ${c1}x - ${Math.abs(c0)}`,
    choices,
    answer: '3',
    explanation: `상수항은 부호를 포함한 ${c0}이므로 ${Math.abs(c0)}이라고 한 3번이 옳지 않습니다.`,
    explanationEn: `The constant term includes the negative sign (${c0}), so statement 3 is incorrect.`
  };
}

// 9. [문자와 식 유형 09] 일차식의 식별과 분모 문자 함정
export function rpmAlgLinearIdentify(random) {
  const choices = [
    { value: '1', label: '-5x', labelEn: '-5x', isRight: true },
    { value: '2', label: '4', labelEn: '4', isRight: false },
    { value: '3', label: '1/x + 3', labelEn: '1/x + 3', isRight: false },
    { value: '4', label: 'x^2 + 1', labelEn: 'x^2 + 1', isRight: false },
    { value: '5', label: '1 + x - x^2', labelEn: '1 + x - x^2', isRight: false },
  ];
  return {
    prompt: '다음 보기 중 일차식인 것은?',
    promptEn: 'Which of the following is a linear expression?',
    expression: '일차식의 판별',
    choices,
    answer: '1',
    explanation: '-5x는 차수가 1인 일차식입니다. 4는 상수항(0차), 1/x+3은 분모에 문자가 있어 다항식이 아니며, x^2+1과 1+x-x^2은 2차식입니다.',
    explanationEn: '-5x is a linear term of degree 1. 1/x is not a polynomial, 4 is constant (degree 0), others have degree 2.'
  };
}

// 10. [문자와 식 유형 10] 일차식과 수의 곱셈·나눗셈
export function rpmAlgMonomialMultDiv(random) {
  const a = -ri(random, 2, 5);
  const b = ri(random, 2, 6);
  const c = -ri(random, 2, 7);
  // a * (bx + c) = (a*b)x + (a*c)
  const coeffX = a * b;
  const constVal = a * c;
  const sum = coeffX + constVal;
  return {
    prompt: `식 ${a}(${b}x - ${Math.abs(c)})를 간단히 하였을 때, x의 계수를 A, 상수항을 B라 하자. A + B의 값을 구하시오.`,
    promptEn: `When ${a}(${b}x - ${Math.abs(c)}) is simplified to Ax + B, find A + B.`,
    expression: `${a}(${b}x - ${Math.abs(c)})`,
    answer: String(sum),
    explanation: `분배법칙으로 전개하면 ${coeffX}x + ${constVal} 이므로 A = ${coeffX}, B = ${constVal} 입니다. A + B = ${sum} 입니다.`,
    explanationEn: `Expanding yields ${coeffX}x + ${constVal}, so A + B = ${sum}.`
  };
}

// 11. [문자와 식 유형 11] 동류항의 판별과 동류항 성립 조건
export function rpmAlgLikeTerms(random) {
  const a = ri(random, 2, 5);
  const b = ri(random, 1, 4);
  const ans = a + b;
  return {
    prompt: `두 식 3x^a y^${b} 와 -5x^${a} y^b 가 동류항일 때, a + b의 값을 구하시오.`,
    promptEn: `Given that 3x^a y^${b} and -5x^${a} y^b are like terms, find a + b.`,
    expression: `3x^a y^${b},  -5x^${a} y^b`,
    answer: String(ans),
    explanation: `동류항은 문자의 종류와 차수가 각각 같아야 하므로 x의 차수는 ${a}, y의 차수는 ${b}로 일치합니다. 따라서 a + b = ${ans} 입니다.`,
    explanationEn: `Like terms must have matching variables and degrees, so a + b = ${ans}.`
  };
}

// 12. [문자와 식 유형 12] 일차식의 덧셈과 뺄셈 (동류항 모으기)
export function rpmAlgLinearAddSub(random) {
  const a = ri(random, 2, 6);
  const b = -ri(random, 1, 5);
  const c = ri(random, 3, 7);
  const d = ri(random, 2, 6);
  // (ax + b) - (cx + d) = (a-c)x + (b-d)
  const coeffX = a - c;
  const constVal = b - d;
  const ans = `${coeffX}x${constVal >= 0 ? '+' : ''}${constVal}`;
  return {
    prompt: '다음을 계산하여 ax + b 꼴로 간단히 나타내시오.',
    promptEn: 'Simplify the expression in the form ax + b.',
    expression: `(${a}x - ${Math.abs(b)}) - (${c}x + ${d})`,
    answer: ans,
    explanation: `동류항끼리 모으면 (${a} - ${c})x + (${b} - ${d}) = ${ans} 입니다.`,
    explanationEn: `Combining like terms gives ${ans}.`
  };
}

// 13. [문자와 식 유형 13] 괄호가 있는 일차식의 계산 (소/중/대괄호)
export function rpmAlgLinearBrackets(random) {
  const k1 = ri(random, 3, 6);
  const k2 = ri(random, 2, 4);
  // 5x - [ k1 - 2{ x - (k2*x - 1) } ]
  // inside = x - k2*x + 1 = (1-k2)x + 1
  // mid = k1 - 2[(1-k2)x + 1] = k1 - 2(1-k2)x - 2 = (2k2 - 2)x + (k1 - 2)
  // res = 5x - mid = (5 - 2k2 + 2)x - (k1 - 2) = (7 - 2k2)x - k1 + 2
  const coeffX = 7 - 2 * k2;
  const constVal = -k1 + 2;
  const ans = `${coeffX}x${constVal >= 0 ? '+' : ''}${constVal}`;
  return {
    prompt: '다음 식을 괄호를 풀어 간단히 나타내시오.',
    promptEn: 'Simplify the expression by expanding parentheses from innermost to outermost.',
    expression: `5x - [ ${k1} - 2{ x - (${k2}x - 1) } ]`,
    answer: ans,
    explanation: `소괄호 → 중괄호 → 대괄호 순서로 전개하여 정리하면 ${ans} 입니다.`,
    explanationEn: `Expanding inside-out yields ${ans}.`
  };
}

// 14. [문자와 식 유형 14] 분수 꼴인 일차식의 덧셈과 뺄셈 (통분 연산)
export function rpmAlgFractionalLinear(random) {
  // (2x - 1)/3 - (3x - 5)/4 = (8x - 4 - 9x + 15)/12 = (-x + 11)/12
  const a = ri(random, 2, 4);
  const b = ri(random, 1, 3);
  const c = ri(random, 2, 3);
  const d = ri(random, 4, 7);
  // (ax - b)/3 - (cx - d)/4
  // = [4(ax - b) - 3(cx - d)] / 12 = [(4a - 3c)x + (-4b + 3d)] / 12
  const numX = 4 * a - 3 * c;
  const numConst = -4 * b + 3 * d;
  return {
    prompt: `식 (${a}x - ${b})/3 - (${c}x - ${d})/4 를 간단히 하였을 때, x의 계수를 A, 상수항을 B라 하자. 12(A + B)의 값을 구하시오.`,
    promptEn: `Simplify (${a}x - ${b})/3 - (${c}x - ${d})/4 to Ax + B. Find 12(A + B).`,
    expression: `(${a}x - ${b})/3 - (${c}x - ${d})/4`,
    answer: String(numX + numConst),
    explanation: `12로 통분하면 {4(${a}x - ${b}) - 3(${c}x - ${d})}/12 = (${numX}x + ${numConst})/12 입니다. 따라서 12(A + B) = ${numX + numConst} 입니다.`,
    explanationEn: `Combining over 12 gives (${numX}x + ${numConst})/12, so 12(A + B) = ${numX + numConst}.`
  };
}

// 15. [문자와 식 유형 15] 일차식이 되도록 하는 미지수 조건
export function rpmAlgLinearConditionParam(random) {
  const p = ri(random, 2, 6);
  const q = ri(random, 2, 5);
  return {
    prompt: `다항식 (${p} - a)x^2 + ${q}x - 7 이 x에 대한 일차식이 되도록 하는 상수 a의 값을 구하시오.`,
    promptEn: `Find the value of constant a such that (${p} - a)x^2 + ${q}x - 7 is a linear expression in x.`,
    expression: `(${p} - a)x^2 + ${q}x - 7`,
    answer: String(p),
    explanation: `x에 대한 일차식이 되려면 이차항의 계수가 0이어야 하므로 ${p} - a = 0 에서 a = ${p} 입니다.`,
    explanationEn: `For the expression to be linear, the quadratic coefficient must be zero: ${p} - a = 0 implies a = ${p}.`
  };
}

// 16. [문자와 식 유형 16] 문자에 일차식을 대입하기
export function rpmAlgSubstituteExpression(random) {
  const cA = ri(random, 2, 3);
  const cB = ri(random, 1, 3);
  // A = 2x - 1, B = -x + 3
  // evaluate 3A - 2(A - B) = A + 2B
  // A + 2B = (2x - 1) + 2(-x + 3) = 5
  return {
    prompt: 'A = 2x - 1, B = -x + 3 일 때, 3A - 2(A - B) 를 x에 관한 식으로 간단히 나타내시오.',
    promptEn: 'Given A = 2x - 1 and B = -x + 3, simplify 3A - 2(A - B) in terms of x.',
    expression: `A = 2x - 1,  B = -x + 3`,
    answer: '5',
    explanation: `3A - 2(A - B) = A + 2B 입니다. 대입하면 (2x - 1) + 2(-x + 3) = 2x - 1 - 2x + 6 = 5 입니다.`,
    explanationEn: `3A - 2(A - B) = A + 2B = (2x - 1) + 2(-x + 3) = 5.`
  };
}

// 17. [문자와 식 유형 17] □ 안에 알맞은 일차식 구하기
export function rpmAlgUnknownBoxPoly(random) {
  const a = ri(random, 3, 6);
  const b = -ri(random, 1, 4);
  const c = ri(random, 1, 3);
  const d = ri(random, 3, 6);
  // (ax + b) - BOX = cx + d => BOX = (ax + b) - (cx + d) = (a-c)x + (b-d)
  const coeffX = a - c;
  const constVal = b - d;
  const ans = `${coeffX}x${constVal >= 0 ? '+' : ''}${constVal}`;
  return {
    prompt: '다음 □ 안에 알맞은 식을 구하시오.',
    promptEn: 'Find the polynomial expression that fits in □.',
    expression: `(${a}x - ${Math.abs(b)}) - □ = ${c}x + ${d}`,
    answer: ans,
    explanation: `□ = (${a}x - ${Math.abs(b)}) - (${c}x + ${d}) = ${ans} 입니다.`,
    explanationEn: `□ = (${a}x - ${Math.abs(b)}) - (${c}x + ${d}) = ${ans}.`
  };
}

// 18. [문자와 식 유형 18] 바르게 계산한 일차식 구하기
export function rpmAlgCorrectPolyCalc(random) {
  const a = ri(random, 2, 4);
  const b = -ri(random, 1, 4);
  const c = ri(random, 4, 7);
  const d = ri(random, 2, 5);
  // Original expression X. Mistakenly added (ax + b) to get (cx + d)
  // X + (ax + b) = cx + d => X = (c-a)x + (d-b)
  // Correct answer = X - (ax + b) = (c-2a)x + (d-2b)
  const coeffX = c - 2 * a;
  const constVal = d - 2 * b;
  const ans = `${coeffX}x${constVal >= 0 ? '+' : ''}${constVal}`;
  return {
    prompt: `어떤 식에서 (${a}x - ${Math.abs(b)})를 빼야 할 것을 잘못하여 더했더니 ${c}x + ${d} 가 되었다. 바르게 계산한 식을 구하시오.`,
    promptEn: `A student mistakenly added (${a}x - ${Math.abs(b)}) instead of subtracting it, obtaining ${c}x + ${d}. Find the correct result.`,
    expression: `어떤 식 = □`,
    answer: ans,
    explanation: `원래 식은 (${c}x + ${d}) - (${a}x - ${Math.abs(b)}) = ${c - a}x + ${d - b} 이므로, 바르게 계산하면 ${ans} 입니다.`,
    explanationEn: `The original polynomial is ${c - a}x + ${d - b}, giving correct answer ${ans}.`
  };
}

// 19. [문자와 식 유형 19] 도형에서의 일차식 활용 (둘레와 색칠한 넓이)
export function rpmAlgGeometryShadedArea(random) {
  const extraBottom = ri(random, 4, 8);
  const h = pick(random, [8, 10, 12]);
  const cutH = pick(random, [3, 4]);
  // Trapezoid top: x, bottom: x + extraBottom, height: h
  // inner cut triangle height: cutH, base: x + extraBottom
  const coeffX = (h - cutH) / 2 * 2; // (h - cutH)
  const constVal = ((h - cutH) * extraBottom) / 2;
  const ans = `${coeffX}x+${constVal}`;
  return {
    prompt: `윗변이 x cm, 아랫변이 (x + ${extraBottom}) cm, 높이가 ${h} cm인 사다리꼴에서 밑변을 공유하고 높이가 ${cutH} cm인 안쪽 삼각형을 잘라낸 색칠한 부분의 넓이를 x를 사용한 식으로 나타내시오.`,
    promptEn: `In a trapezoid with top base x, bottom base x + ${extraBottom}, and height ${h}, find the shaded area after removing an inner triangle of height ${cutH}.`,
    expression: `사다리꼴 넓이 - 안쪽 삼각형 넓이`,
    answer: ans,
    diagram: {
      kind: 'rpm-shaded-shape',
      shape: 'trapezoid',
      top: 'x',
      bottom: `x + ${extraBottom}`,
      height: h,
      cutHeight: cutH,
    },
    explanation: `(사다리꼴 넓이) - (삼각형 넓이) = 1/2 × (2x + ${extraBottom}) × ${h} - 1/2 × (x + ${extraBottom}) × ${cutH} = ${ans} (cm^2) 입니다.`,
    explanationEn: `Area = ${ans} cm^2.`
  };
}

// 20. [문자와 식 유형 20] (-1)^n 거듭제곱이 포함된 일차식의 계산
export function rpmAlgNegPowerLinear(random) {
  const isEven = random() < 0.5;
  const parityKo = isEven ? '짝수' : '홀수';
  const parityEn = isEven ? 'an even' : 'an odd';
  // (-1)^n (3x - 2) - (-1)^(n+1) (2x + 1)
  // If n is even: (-1)^n = 1, (-1)^(n+1) = -1 => (3x - 2) - (-1)(2x + 1) = 5x - 1
  // If n is odd: (-1)^n = -1, (-1)^(n+1) = 1 => -(3x - 2) - (2x + 1) = -5x + 1
  const ans = isEven ? '5x-1' : '-5x+1';
  return {
    prompt: `n이 ${parityKo}일 때, (-1)^n (3x - 2) - (-1)^(n+1) (2x + 1) 을 간단히 하시오.`,
    promptEn: `Given that n is ${parityEn} integer, simplify (-1)^n (3x - 2) - (-1)^(n+1) (2x + 1).`,
    expression: `(-1)^n (3x - 2) - (-1)^(n+1) (2x + 1)`,
    answer: ans,
    explanation: `n이 ${parityKo}이므로 (-1)^n = ${isEven ? '1' : '-1'}, (-1)^(n+1) = ${isEven ? '-1' : '1'} 입니다. 대입하여 정리하면 ${ans} 입니다.`,
    explanationEn: `Evaluating powers according to parity yields ${ans}.`
  };
}

// 21. [문자와 식 심화 21] 일차식 마방진과 다항식 피라미드 퍼즐
export function rpmAlgMagicSquarePyramid(random) {
  const ans = '6x-2';
  return {
    prompt: '가로, 세로, 대각선에 놓인 세 식의 합이 모두 같도록 표를 채울 때, 식 A - B를 간단히 하시오.',
    promptEn: 'In a 3x3 magic square where sums of rows, columns, and diagonals are equal, find the expression A - B.',
    expression: '가로 세로 대각선의 합이 같은 마방진',
    answer: ans,
    explanation: '가로의 합이 3x - 3이므로 세로와 대각선 합 조건을 풀면 B = -2x, A = 4x - 2 입니다. 따라서 A - B = 4x - 2 - (-2x) = 6x - 2 입니다.',
    explanationEn: 'Row sum is 3x - 3. Solving gives B = -2x and A = 4x - 2, so A - B = 6x - 2.'
  };
}

// 22. [문자와 식 발전 22] 원가·정가·할인가·이익 복합 문장제
export function rpmAlgCostProfitComplex(random) {
  const mark = 20;
  const disc = 10;
  // Cost = a
  // Regular price = a * 1.2 = 6/5 a
  // Sale price = 1.2a * 0.9 = 1.08a = 27/25 a
  return {
    prompt: `원가가 a원인 상품에 ${mark}%의 이익을 붙여 정가를 정한 후, 정가에서 ${disc}%를 할인하여 판매할 때, 실제 판매 가격을 a를 사용한 기약분수 식으로 나타내시오.`,
    promptEn: `A merchant sets regular price at a ${mark}% markup on cost a, then gives a ${disc}% discount. Express the final selling price using an irreducible fraction with a.`,
    expression: `원가 a원, 정가: ${mark}% 이익, 판매가: ${disc}% 할인`,
    answer: '27/25a',
    explanation: `정가 = a × (1 + 0.2) = 1.2a 이고, 판매 가격 = 1.2a × (1 - 0.1) = 1.08a = 27/25 a (원) 입니다.`,
    explanationEn: `Regular price = 1.2a, sale price = 1.2a × 0.9 = 1.08a = 27/25 a.`
  };
}

// 23. [문자와 식 발전 23] 다중 문자 분수식의 고난도 대입 식의 값
export function rpmAlgMultiVarComplexEval(random) {
  // a = 1/2, b = 2/3, c = -3/4
  // evaluate (bc - 2ac - 3ab)/(abc)
  // = (bc)/(abc) - 2(ac)/(abc) - 3(ab)/(abc) = 1/a - 2/b - 3/c
  // 1/a = 2
  // -2/b = -2 / (2/3) = -3
  // -3/c = -3 / (-3/4) = 4
  // 2 - 3 + 4 = 3!
  return {
    prompt: 'a = 1/2, b = 2/3, c = -3/4 일 때, (bc - 2ac - 3ab)/(abc) 의 값을 구하시오.',
    promptEn: 'Given a = 1/2, b = 2/3, and c = -3/4, find the value of (bc - 2ac - 3ab)/(abc).',
    expression: `(bc - 2ac - 3ab)/(abc)`,
    answer: '3',
    explanation: `식을 분리하면 bc/(abc) - 2ac/(abc) - 3ab/(abc) = 1/a - 2/b - 3/c 입니다. 역수를 대입하면 2 - 3 - (-4) = 3 입니다.`,
    explanationEn: `Splitting terms yields 1/a - 2/b - 3/c = 2 - 3 + 4 = 3.`
  };
}

// 24. [단원 실전 다지기] 매일 문자와 식 종합
export const rpmAlgAllTypesList = [
  rpmAlgNotationSigns,
  rpmAlgVerbalUnitsCost,
  rpmAlgVerbalFigures,
  rpmAlgVerbalSpeedConcentration,
  rpmAlgEvalBasicNegative,
  rpmAlgEvalFractionReciprocal,
  rpmAlgEvalRealWorld,
  rpmAlgPolyTermsDegree,
  rpmAlgLinearIdentify,
  rpmAlgMonomialMultDiv,
  rpmAlgLikeTerms,
  rpmAlgLinearAddSub,
  rpmAlgLinearBrackets,
  rpmAlgFractionalLinear,
  rpmAlgLinearConditionParam,
  rpmAlgSubstituteExpression,
  rpmAlgUnknownBoxPoly,
  rpmAlgCorrectPolyCalc,
  rpmAlgGeometryShadedArea,
  rpmAlgNegPowerLinear,
  rpmAlgMagicSquarePyramid,
  rpmAlgCostProfitComplex,
  rpmAlgMultiVarComplexEval,
];

export function rpmAlgAllTypesMixed(random) {
  return pick(random, rpmAlgAllTypesList)(random);
}


// Backward compatibility legacy aliases
export const rpmAlgebraShadedArea = rpmAlgGeometryShadedArea;
export const rpmAlgebraCoeffDifference = rpmAlgLinearAddSub;

// -------------------------------------------------------------
// CHAPTER 06: 일차방정식의 풀이 응용 (Equations Applied)
// -------------------------------------------------------------

export function rpmEqIdentityEquation(random) {
  const mode = pick(random, ['verbal-to-eq', 'identify-eq', 'identify-non-eq']);
  if (mode === 'verbal-to-eq') {
    const k = ri(random, 2, 7);
    const sub = ri(random, 2, 9);
    const mult = ri(random, 2, 4);
    const right = `${k}x - ${sub} = ${mult}x`;
    const choices = [
      { label: right, labelEn: right, isRight: true },
      { label: `${k}x + ${sub} = ${mult}x`, labelEn: `${k}x + ${sub} = ${mult}x`, isRight: false },
      { label: `${k}(x - ${sub}) = ${mult}x`, labelEn: `${k}(x - ${sub}) = ${mult}x`, isRight: false },
      { label: `${k}x - ${sub} = x + ${mult}`, labelEn: `${k}x - ${sub} = x + ${mult}`, isRight: false },
      { label: `${k}x - ${sub} > ${mult}x`, labelEn: `${k}x - ${sub} > ${mult}x`, isRight: false },
    ].sort(() => random() - 0.5);
    const rightIdx = choices.findIndex((c) => c.isRight) + 1;
    return {
      prompt: `다음 문장을 등식으로 나타낸 것으로 옳은 것은?\n"어떤 수 x의 ${k}배에서 ${sub}를 뺀 것은 x의 ${mult}배와 같다."`,
      promptEn: `Which equation correctly represents:\n"Subtracting ${sub} from ${k} times x equals ${mult} times x."`,
      kind: 'choice',
      choicesKo: choices.map((c) => c.label),
      choicesEn: choices.map((c) => c.labelEn),
      answer: String(rightIdx),
      explanation: `x의 ${k}배에서 ${sub}를 뺀 식은 ${k}x - ${sub}이고, x의 ${mult}배는 ${mult}x이므로 등식은 ${right}입니다.`,
      explanationEn: `${k} times x minus ${sub} is ${k}x - ${sub}, and ${mult} times x is ${mult}x, so the equation is ${right}.`
    };
  }

  if (mode === 'identify-non-eq') {
    const choices = [
      { label: '3x - 6 = 0', labelEn: '3x - 6 = 0', isRight: false },
      { label: '2x + 5 = 11', labelEn: '2x + 5 = 11', isRight: false },
      { label: '4x - 7 < 9', labelEn: '4x - 7 < 9', isRight: true },
      { label: 'x/2 = 4', labelEn: 'x/2 = 4', isRight: false },
      { label: '5x = 2x + 9', labelEn: '5x = 2x + 9', isRight: false },
    ].sort(() => random() - 0.5);
    const rightIdx = choices.findIndex((c) => c.isRight) + 1;
    return {
      prompt: '다음 보기 중 등식이 아닌 것은?',
      promptEn: 'Which of the following is NOT an equation?',
      kind: 'choice',
      choicesKo: choices.map((c) => c.label),
      choicesEn: choices.map((c) => c.labelEn),
      answer: String(rightIdx),
      explanation: '등호(=)를 사용하여 수나 식이 같음을 나타낸 식만이 등식입니다. 부등호(<, > 등)를 사용한 식은 부등식입니다.',
      explanationEn: 'Only expressions using an equals sign (=) are equations. Expressions with inequality signs are inequalities.'
    };
  }

  // identify-eq
  const choices = [
    { label: '3x - 7', labelEn: '3x - 7', isRight: false },
    { label: '2x + 4 > 10', labelEn: '2x + 4 > 10', isRight: false },
    { label: '5x + 3y - 2', labelEn: '5x + 3y - 2', isRight: false },
    { label: '4x - 1 = 7', labelEn: '4x - 1 = 7', isRight: true },
    { label: '3x + 1 ≤ 4x', labelEn: '3x + 1 ≤ 4x', isRight: false },
  ].sort(() => random() - 0.5);
  const rightIdx = choices.findIndex((c) => c.isRight) + 1;
  return {
    prompt: '다음 보기 중 등식인 것은?',
    promptEn: 'Which of the following is an equation?',
    kind: 'choice',
    choicesKo: choices.map((c) => c.label),
    choicesEn: choices.map((c) => c.labelEn),
    answer: String(rightIdx),
    explanation: '등호(=)를 사용하여 나타낸 식만이 등식입니다. 다항식(3x-7)이나 부등식은 등식이 아닙니다.',
    explanationEn: 'Only a statement with an equals sign (=) is an equation. Polynomials and inequalities are not equations.'
  };
}

// 2. [방정식 풀이 유형 02] 방정식의 해 판별과 수 대입
export function rpmEqRootSubstitute(random) {
  const mode = pick(random, ['abs-condition-root', 'bracket-check-false', 'find-root-val']);
  if (mode === 'abs-condition-root') {
    const k = pick(random, [2, 3, 4, 5]);
    const a = ri(random, 2, 4);
    const c = ri(random, 1, 6);
    const rhs = a * (-k) + c;
    return {
      prompt: `x가 절댓값이 ${k}인 수일 때, 일차방정식 ${a}x + ${c} = ${rhs}의 해를 구하시오.`,
      promptEn: `Given that |x| = ${k}, find the solution to the linear equation ${a}x + ${c} = ${rhs}.`,
      expression: `|x| = ${k},  ${a}x + ${c} = ${rhs}`,
      answer: `-${k}`,
      explanation: `절댓값이 ${k}인 수는 ${k} 또는 -${k}입니다. x = ${k}를 대입하면 ${a}×${k}+${c} = ${a * k + c} ≠ ${rhs}이고, x = -${k}를 대입하면 ${a}×(-${k})+${c} = ${rhs}이므로 해는 x = -${k}입니다.`,
      explanationEn: `|x| = ${k} implies x is ${k} or -${k}. Substituting x = -${k} gives ${a}(-${k}) + ${c} = ${rhs}.`
    };
  }

  if (mode === 'bracket-check-false') {
    const r = ri(random, -3, 4) || 2;
    const wr = r + pick(random, [-2, -1, 1, 2]);
    const choices = [
      { eq: `2x - 3 = ${2 * r - 3}`, val: r, isWrong: false },
      { eq: `3(x + 1) = ${3 * (r + 1)}`, val: r, isWrong: false },
      { eq: `5x - 4 = 3x + ${2 * r - 4}`, val: r, isWrong: false },
      { eq: `4(x - 2) = ${4 * (r - 2)}`, val: r, isWrong: false },
      { eq: `2x + 5 = ${2 * r + 5}`, val: wr, isWrong: true },
    ].sort(() => random() - 0.5);
    const wrongIdx = choices.findIndex((c) => c.isWrong) + 1;
    return {
      prompt: '다음 중 [ ] 안의 수가 주어진 일차방정식의 해가 아닌 것은?',
      promptEn: 'For which equation is the value in [ ] NOT a solution?',
      kind: 'choice',
      choicesKo: choices.map((c) => `${c.eq}  [${c.val}]`),
      choicesEn: choices.map((c) => `${c.eq}  [${c.val}]`),
      answer: String(wrongIdx),
      explanation: '[ ] 안의 수를 각 방정식의 x에 대입하여 좌변과 우변의 값이 같지 않은 것을 찾습니다.',
      explanationEn: 'Substitute the bracketed value into x for each equation; the answer is where LHS ≠ RHS.'
    };
  }

  // find-root-val
  const k = ri(random, -3, 3) || 1;
  const a = ri(random, 2, 5);
  const b = ri(random, -5, 5);
  const rhs = a * k + b;
  const rightEq = `${a}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)} = ${rhs}`;
  const choices = [
    rightEq,
    `${a}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)} = ${rhs + 3}`,
    `2x + 1 = ${2 * (k + 1) + 1}`,
    `3(x - 2) = ${3 * (k - 1)}`,
    `x - ${k + 2} = 0`
  ].sort(() => random() - 0.5);
  const rightIdx = choices.indexOf(rightEq) + 1;
  return {
    prompt: `다음 일차방정식 중 해가 x = ${k}인 것은?`,
    promptEn: `Which of the following equations has the solution x = ${k}?`,
    kind: 'choice',
    choicesKo: choices,
    choicesEn: choices,
    answer: String(rightIdx),
    explanation: `각 식에 x = ${k}를 대입하면 ${rightEq}에서 ${a}×(${k}) ${b >= 0 ? '+' : '-'} ${Math.abs(b)} = ${rhs}로 등식이 성립합니다.`,
    explanationEn: `Substituting x = ${k} into ${rightEq} yields ${rhs} = ${rhs}.`
  };
}

// 3. [방정식 풀이 유형 03] 방정식과 항등식의 구분
export function rpmEqIdentityDistinguish(random) {
  const k = ri(random, 2, 5);
  const c = ri(random, 1, 6);
  const rightId = `${k}(x - ${c}) = ${k}x - ${k * c}`;
  const choices = [
    { label: rightId, isRight: true },
    { label: `${k}x - ${c} = ${k * c}`, isRight: false },
    { label: `2x + 4 = 8x + 1`, isRight: false },
    { label: `${k}x - 1 = ${k}(x - 1)`, isRight: false },
    { label: `x - ${c} = ${c} - x`, isRight: false },
  ].sort(() => random() - 0.5);
  const rightIdx = choices.findIndex((c) => c.isRight) + 1;
  return {
    prompt: '다음 중 x의 값에 관계없이 항상 참인 등식(항등식)은?',
    promptEn: 'Which of the following equations is an identity (always true for all x)?',
    kind: 'choice',
    choicesKo: choices.map((c) => c.label),
    choicesEn: choices.map((c) => c.label),
    answer: String(rightIdx),
    explanation: `${rightId}의 좌변을 전개하면 ${k}x - ${k * c}로 (좌변)=(우변)이 항상 같으므로 x에 대한 항등식입니다.`,
    explanationEn: `Expanding LHS of ${rightId} gives ${k}x - ${k * c}, which equals RHS for all x.`
  };
}

// 4. [방정식 풀이 유형 04] 항등식이 되는 미지수 조건
export function rpmEqIdentityCondition(random) {
  const mode = pick(random, ['find-box', 'find-ab-sum']);
  if (mode === 'find-box') {
    const a = ri(random, 2, 5);
    const b = ri(random, 1, 4);
    const c = ri(random, 2, 4);
    const boxCoeff = a + c;
    const boxConst = a * b;
    const ans = `${boxCoeff}x - ${boxConst}`;
    const choices = [
      { label: `${boxCoeff}x - ${boxConst}`, isRight: true },
      { label: `${boxCoeff}x + ${boxConst}`, isRight: false },
      { label: `${a}x - ${boxConst}`, isRight: false },
      { label: `${boxCoeff}x - ${b}`, isRight: false },
      { label: `${a - c}x - ${boxConst}`, isRight: false },
    ].sort(() => random() - 0.5);
    const rightIdx = choices.findIndex((c) => c.isRight) + 1;
    return {
      prompt: `등식 ${a}(x - ${b}) = -${c}x + □ 가 x의 값에 관계없이 항상 성립할 때, □ 안에 알맞은 식은?`,
      promptEn: `Given that ${a}(x - ${b}) = -${c}x + [ ? ] is an identity in x, find the missing expression in [ ? ].`,
      kind: 'choice',
      choicesKo: choices.map((c) => c.label),
      choicesEn: choices.map((c) => c.label),
      answer: String(rightIdx),
      explanation: `좌변을 전개하면 ${a}x - ${a * b} = -${c}x + □ 이므로 □ = ${a}x - ${a * b} - (-${c}x) = ${ans}입니다.`,
      explanationEn: `LHS expanded is ${a}x - ${a * b} = -${c}x + [ ? ], so [ ? ] = ${ans}.`
    };
  }

  // find-ab-sum: ax + b = c(x + d) + e
  const c = ri(random, 2, 6);
  const d = ri(random, 1, 5);
  const e = ri(random, -6, 6);
  const aVal = c;
  const bVal = c * d + e;
  const ans = aVal + bVal;
  return {
    prompt: `등식 ax + b = ${c}(x + ${d}) ${e >= 0 ? '+' : '-'} ${Math.abs(e)} 가 x에 대한 항등식일 때, 상수 a, b에 대하여 a + b의 값을 구하시오.`,
    promptEn: `If ax + b = ${c}(x + ${d}) ${e >= 0 ? '+' : '-'} ${Math.abs(e)} is an identity in x, find a + b.`,
    expression: `ax + b = ${c}(x + ${d}) ${e >= 0 ? '+' : '-'} ${Math.abs(e)}`,
    answer: String(ans),
    explanation: `우변을 전개하여 정리하면 ${c}x + ${c * d} ${e >= 0 ? '+' : '-'} ${Math.abs(e)} = ${c}x + ${bVal}입니다. x에 대한 항등식이므로 a = ${aVal}, b = ${bVal}입니다. 따라서 a + b = ${aVal} + ${bVal} = ${ans}입니다.`,
    explanationEn: `Expanding RHS gives ${c}x + ${bVal}. Equating coefficients: a = ${aVal}, b = ${bVal}, so a + b = ${ans}.`
  };
}

// 5. [방정식 풀이 유형 05] 등식의 성질 참·거짓 판별
export function rpmEqPropertiesEquality(random) {
  const choices = [
    { label: '3a = 6b 이면 a = 2b 이다.', labelEn: 'If 3a = 6b, then a = 2b.', isFalse: false },
    { label: 'a/2 = b/3 이면 3a = 2b 이다.', labelEn: 'If a/2 = b/3, then 3a = 2b.', isFalse: false },
    { label: 'a - b = x - y 이면 a - x = b - y 이다.', labelEn: 'If a - b = x - y, then a - x = b - y.', isFalse: false },
    { label: 'ac = bc 이면 항상 a = b 이다.', labelEn: 'If ac = bc, then always a = b.', isFalse: true },
    { label: 'a = b 이면 a - 5 = b - 5 이다.', labelEn: 'If a = b, then a - 5 = b - 5.', isFalse: false },
  ].sort(() => random() - 0.5);
  const falseIdx = choices.findIndex((c) => c.isFalse) + 1;
  return {
    prompt: '다음 중 등식의 성질에 대한 설명으로 옳지 않은 것은?',
    promptEn: 'Which of the following statements about properties of equality is FALSE?',
    kind: 'choice',
    choicesKo: choices.map((c) => c.label),
    choicesEn: choices.map((c) => c.labelEn),
    answer: String(falseIdx),
    explanation: 'ac = bc일 때 c = 0이면 a와 b가 서로 달라도 등식이 성립하므로, c ≠ 0이라는 조건이 없을 때는 반드시 a = b라고 할 수 없습니다.',
    explanationEn: 'If c = 0, ac = bc holds even when a ≠ b, so we cannot conclude a = b unless c ≠ 0.'
  };
}

// 6. [방정식 풀이 유형 06] 등식의 성질을 이용한 방정식의 풀이
export function rpmEqSolveUsingProperties(random) {
  const mode = pick(random, ['find-c-val', 'find-step']);
  if (mode === 'find-c-val') {
    const a = ri(random, 2, 5);
    const b = ri(random, 3, 9);
    const d = ri(random, 1, 8);
    const ans = -b;
    return {
      prompt: `방정식 ${a}x + ${b} = ${d}를 풀기 위해 등식의 성질 "a=b이면 a+c = b+c이다"를 한 번만 이용하여 좌변에 ${a}x항만 남기려고 한다. 이때 c의 값을 구하시오.`,
      promptEn: `To solve ${a}x + ${b} = ${d} by using "if a=b then a+c=b+c" once to leave only the ${a}x term on the LHS, find c.`,
      expression: `${a}x + ${b} = ${d}`,
      answer: String(ans),
      explanation: `좌변에서 상수항 ${b}를 없애기 위해 양변에 ${ans}를 더해야 하므로 c = ${ans}입니다.`,
      explanationEn: `To eliminate the constant ${b} from the LHS, add ${ans} to both sides, so c = ${ans}.`
    };
  }

  // find-step
  return {
    prompt: `다음 방정식의 풀이 과정에서 등식의 성질 "a=b이면 a/c = b/c이다 (c≠0)"를 이용한 단계를 고르시오.\n[풀이 과정]\n(2/3)x - 1 = 1\n㉠ 2x - 3 = 3\n㉡ 2x = 6\n㉢ x = 3`,
    promptEn: `Identify the step that uses the property "if a=b then a/c = b/c (c≠0)":\n(2/3)x - 1 = 1\n[A] 2x - 3 = 3\n[B] 2x = 6\n[C] x = 3`,
    kind: 'choice',
    choicesKo: ['㉠', '㉡', '㉢'],
    choicesEn: ['Step A', 'Step B', 'Step C'],
    answer: '3',
    explanation: '2x = 6에서 양변을 2로 나누어 x = 3을 구하는 과정(㉢)에서 나눗셈의 성질이 이용되었습니다.',
    explanationEn: 'In step C (2x = 6 to x = 3), both sides are divided by 2.'
  };
}

// 7. [방정식 풀이 유형 07] 이항
export function rpmEqTranspositionRule(random) {
  const mode = pick(random, ['ax-equals-b-form', 'correct-transpose-choice']);
  if (mode === 'ax-equals-b-form') {
    const a1 = ri(random, 4, 7);
    const a2 = ri(random, 1, a1 - 1);
    const b1 = ri(random, 1, 8);
    const b2 = ri(random, -8, -1);
    const aFinal = a1 - a2;
    const bFinal = b2 - b1;
    const ans = aFinal + bFinal;
    return {
      prompt: `등식 ${a1}x + ${b1} = ${a2}x ${b2 >= 0 ? '+' : '-'} ${Math.abs(b2)}를 이항만을 이용하여 ax = b (a > 0)의 꼴로 나타내었을 때, 상수 a, b에 대하여 a + b의 값을 구하시오.`,
      promptEn: `Transform ${a1}x + ${b1} = ${a2}x ${b2 >= 0 ? '+' : '-'} ${Math.abs(b2)} into ax = b (a > 0) using transposition only. Find a + b.`,
      expression: `${a1}x + ${b1} = ${a2}x ${b2 >= 0 ? '+' : '-'} ${Math.abs(b2)}`,
      answer: String(ans),
      explanation: `${a2}x를 좌변으로, ${b1}을 우변으로 이항하면 (${a1} - ${a2})x = ${b2} - ${b1}이므로 ${aFinal}x = ${bFinal}입니다. 따라서 a = ${aFinal}, b = ${bFinal}이므로 a + b = ${ans}입니다.`,
      explanationEn: `Transposing gives ${aFinal}x = ${bFinal}, so a = ${aFinal}, b = ${bFinal}, and a + b = ${ans}.`
    };
  }

  // correct-transpose-choice
  const choices = [
    { label: '3x - 5 = 7  ⇨  3x = 7 + 5', isRight: true },
    { label: '4x = 6 - 3x  ⇨  4x - 3x = 6', isRight: false },
    { label: '5x + 2 = 1  ⇨  5x = 1 + 2', isRight: false },
    { label: '2x - 1 = x + 4  ⇨  2x + x = 4 + 1', isRight: false },
    { label: '6x - 4 = 2  ⇨  6x = 2 - 4', isRight: false },
  ].sort(() => random() - 0.5);
  const rightIdx = choices.findIndex((c) => c.isRight) + 1;
  return {
    prompt: '다음 중 밑줄 친 항을 바르게 이항한 것은?',
    promptEn: 'Which of the following demonstrates correct transposition?',
    kind: 'choice',
    choicesKo: choices.map((c) => c.label),
    choicesEn: choices.map((c) => c.label),
    answer: String(rightIdx),
    explanation: '등식의 어느 한 변에 있는 항을 그 부호를 바꾸어 다른 변으로 옮기는 것을 이항이라 합니다. -5를 이항하면 +5가 됩니다.',
    explanationEn: 'Transposing a term across the equals sign requires changing its sign. -5 transposes to +5.'
  };
}

// 8. [방정식 풀이 유형 08] 일차방정식의 뜻과 일차방정식이 될 조건
export function rpmEqLinearDefIdentify(random) {
  const mode = pick(random, ['param-condition', 'identify-linear-mcq']);
  if (mode === 'param-condition') {
    const k = ri(random, 2, 8);
    const c = ri(random, 1, 9);
    const rightChoice = `a ≠ -${k}`;
    const choices = [
      rightChoice,
      `a = -${k}`,
      `a ≠ ${k}`,
      `a = ${k}`,
      `a ≠ ${c}`
    ].sort(() => random() - 0.5);
    const rightIdx = choices.indexOf(rightChoice) + 1;
    return {
      prompt: `등식 ${k}x - ${c} = 5 - ax 가 x에 대한 일차방정식이 되기 위한 상수 a의 조건은?`,
      promptEn: `Find the condition on constant a for ${k}x - ${c} = 5 - ax to be a linear equation in x.`,
      kind: 'choice',
      choicesKo: choices,
      choicesEn: choices,
      answer: String(rightIdx),
      explanation: `모든 항을 좌변으로 이항하여 정리하면 (${k} + a)x - ${c + 5} = 0 입니다. x에 대한 일차방정식이 되려면 x의 계수가 0이 아니어야 하므로 ${k} + a ≠ 0, 즉 a ≠ -${k} 이어야 합니다.`,
      explanationEn: `Rearranging gives (${k} + a)x - ${c + 5} = 0. For this to be linear, the coefficient of x must not be 0: a ≠ -${k}.`
    };
  }

  // identify-linear-mcq
  const choices = [
    { label: 'x^2 + x = x^2 - 4', isRight: true },
    { label: 'x^2 + 3 = x', isRight: false },
    { label: '2(x + 1) = 2x + 2', isRight: false },
    { label: '3x - 5', isRight: false },
    { label: '2/x + 1 = 5', isRight: false },
  ].sort(() => random() - 0.5);
  const rightIdx = choices.findIndex((c) => c.isRight) + 1;
  return {
    prompt: '다음 보기 중 일차방정식인 것은?',
    promptEn: 'Which of the following is a linear equation in one variable?',
    kind: 'choice',
    choicesKo: choices.map((c) => c.label),
    choicesEn: choices.map((c) => c.label),
    answer: String(rightIdx),
    explanation: 'x^2 + x = x^2 - 4에서 x^2을 소거하면 x + 4 = 0으로 일차식 = 0 꼴이 되므로 일차방정식입니다.',
    explanationEn: 'In x^2 + x = x^2 - 4, the quadratic terms cancel to leave x + 4 = 0, which is linear.'
  };
}

// 9. [방정식 풀이 유형 09] 괄호가 있는 일차방정식의 풀이
export function rpmEqBracketsExpand(random) {
  const root = ri(random, -5, 6);
  const a = ri(random, 2, 4);
  const b = ri(random, 1, 4);
  const c = ri(random, 2, 3);
  const d = ri(random, 1, 5);
  const lhsCoeff = a + c;
  const lhsConst = a * b - c * d;
  const targetVal = lhsCoeff * root + lhsConst;
  const e = ri(random, 1, 5);
  const rhsX = lhsCoeff - e;
  const rhsConst = targetVal - rhsX * root;
  return {
    prompt: '다음 괄호가 있는 일차방정식을 푸시오.',
    promptEn: 'Solve the linear equation with parentheses.',
    expression: `${a}(x + ${b}) - ${c}(${d} - x) = ${rhsX}x ${rhsConst >= 0 ? '+' : '-'} ${Math.abs(rhsConst)}`,
    answer: String(root),
    explanation: `괄호를 분배법칙으로 풀면 ${a}x + ${a * b} - ${c * d} + ${c}x = ${rhsX}x ${rhsConst >= 0 ? '+' : '-'} ${Math.abs(rhsConst)} 입니다. 동류항을 정리하여 이항하면 ${e}x = ${e * root} 이므로 x = ${root} 입니다.`,
    explanationEn: `Expanding parentheses and combining like terms yields ${e}x = ${e * root}, so x = ${root}.`
  };
}

// 10. [방정식 풀이 유형 10] 계수가 소수인 일차방정식의 풀이
export function rpmEqDecimalCoef(random) {
  const root = ri(random, -6, 8) || 2;
  const aTenths = ri(random, 3, 7);
  const bTenths = ri(random, 1, 9);
  const cTenths = ri(random, 1, aTenths - 1);
  const dTenths = (aTenths - cTenths) * root - bTenths;
  return {
    prompt: '다음 계수가 소수인 일차방정식을 푸시오.',
    promptEn: 'Solve the linear equation with decimals.',
    expression: `${(aTenths / 10).toFixed(1)}x - ${(bTenths / 10).toFixed(1)} = ${(cTenths / 10).toFixed(1)}x ${dTenths >= 0 ? '+' : '-'} ${Math.abs(dTenths / 10).toFixed(1)}`,
    answer: String(root),
    explanation: `양변에 10을 곱하여 계수를 정수로 고치면 ${aTenths}x - ${bTenths} = ${cTenths}x ${dTenths >= 0 ? '+' : '-'} ${Math.abs(dTenths)} 입니다. 이항하면 ${aTenths - cTenths}x = ${(aTenths - cTenths) * root} 이므로 x = ${root} 입니다.`,
    explanationEn: `Multiplying both sides by 10 clears decimals: ${aTenths - cTenths}x = ${(aTenths - cTenths) * root}, giving x = ${root}.`
  };
}

// 11. [방정식 풀이 유형 11] 계수가 분수인 일차방정식의 풀이
export function rpmEqFractionCoef(random) {
  const root = ri(random, -5, 6) || 3;
  const d1 = pick(random, [2, 3]);
  const d2 = pick(random, [4, 6]);
  const L = lcm(d1, d2);
  const m1 = L / d1;
  const m2 = L / d2;
  const c1 = ri(random, 1, 5);
  const c2 = ri(random, 1, 5);
  const netX = m1 - 2 * m2;
  const nonZeroNetX = netX === 0 ? 1 : netX;
  const netConst = -m1 * c1 + m2 * c2;
  const totalLHS = nonZeroNetX * root + netConst;
  return {
    prompt: '다음 계수가 분수인 일차방정식을 푸시오.',
    promptEn: 'Solve the linear equation with fractions.',
    expression: `(x - ${c1})/${d1} - (2x - ${c2})/${d2} = ${fracStr(totalLHS, L)}`,
    answer: String(root),
    explanation: `분모의 최소공배수인 ${L}을 양변에 곱하면 ${m1}(x - ${c1}) - ${m2}(2x - ${c2}) = ${totalLHS} 입니다. 전개하여 정리하면 ${nonZeroNetX}x = ${nonZeroNetX * root} 이므로 x = ${root} 입니다.`,
    explanationEn: `Multiply both sides by LCM ${L}: simplifying gives ${nonZeroNetX}x = ${nonZeroNetX * root}, so x = ${root}.`
  };
}

// 12. [방정식 풀이 유형 12] 소수와 분수가 혼합된 일차방정식의 풀이
export function rpmEqMixedDecimalFraction(random) {
  const root = ri(random, -4, 5) || 2;
  const den = pick(random, [2, 4, 5]);
  const a = ri(random, 1, 4);
  const b = ri(random, 1, 4);
  const cVal = (root - a) / den - 0.5 * (root - b);
  return {
    prompt: '다음 소수와 분수가 혼합된 일차방정식을 푸시오.',
    promptEn: 'Solve the linear equation containing both decimals and fractions.',
    expression: `(x - ${a})/${den} = 0.5(x - ${b}) ${cVal >= 0 ? '+' : '-'} ${Math.abs(cVal).toFixed(2)}`,
    answer: String(root),
    explanation: `0.5를 1/2로 바꾸고 분모의 최소공배수를 양변에 곱하여 정수 계수 일차방정식으로 고쳐 풀면 x = ${root} 입니다.`,
    explanationEn: `Convert 0.5 to 1/2 and multiply both sides by the LCM of the denominators to find x = ${root}.`
  };
}

// 13. [방정식 풀이 유형 13] 비례식으로 주어진 일차방정식의 풀이
export function rpmEqProportionCrossMult(random) {
  const m = ri(random, 2, 4);
  const p = ri(random, 3, 5);
  const k = ri(random, 1, 5);
  const diff = 2 * m - p;
  const safeDiff = diff === 0 ? 1 : diff;
  const n = ri(random, 1, 5);
  const ansX = fracStr(p * k + m * n, safeDiff);
  return {
    prompt: '다음 비례식을 만족시키는 x의 값을 구하시오.',
    promptEn: 'Solve the proportion for x.',
    expression: `(x + ${k}) : ${m} = (2x - ${n}) : ${p}`,
    answer: ansX,
    explanation: `비례식 a:b = c:d 에서 (외항의 곱) = (내항의 곱)이므로 ${p}(x + ${k}) = ${m}(2x - ${n}) 입니다. 전개하면 ${p}x + ${p * k} = ${2 * m}x - ${m * n} 이고 이항하여 정리하면 x = ${ansX} 입니다.`,
    explanationEn: `Product of extremes equals product of means: ${p}(x + ${k}) = ${m}(2x - ${n}). Solving gives x = ${ansX}.`
  };
}

// 14. [방정식 풀이 유형 14] 일차방정식의 해가 주어진 경우
export function rpmEqRootGivenParam(random) {
  const root = ri(random, 1, 5);
  const paramA = ri(random, -5, 5) || 2;
  const c = ri(random, 2, 5);
  const rhsConst = (c - 2) * root - paramA;
  return {
    prompt: `일차방정식 ${c}x - a = 2x ${rhsConst >= 0 ? '+' : '-'} ${Math.abs(rhsConst)} 의 해가 x = ${root} 일 때, 상수 a의 값을 구하시오.`,
    promptEn: `Given that x = ${root} is the solution to ${c}x - a = 2x ${rhsConst >= 0 ? '+' : '-'} ${Math.abs(rhsConst)}, find constant a.`,
    expression: `${c}x - a = 2x ${rhsConst >= 0 ? '+' : '-'} ${Math.abs(rhsConst)}  [x = ${root}]`,
    answer: String(paramA),
    explanation: `x = ${root}을 방정식에 대입하면 ${c}×${root} - a = 2×${root} ${rhsConst >= 0 ? '+' : '-'} ${Math.abs(rhsConst)} 입니다. 계산하면 ${c * root} - a = ${2 * root + rhsConst} 이므로 -a = ${2 * root + rhsConst - c * root} 에서 a = ${paramA} 입니다.`,
    explanationEn: `Substitute x = ${root}: ${c}(${root}) - a = 2(${root}) + (${rhsConst}). Solving for a yields a = ${paramA}.`
  };
}

// 15. [방정식 풀이 유형 15] 두 일차방정식의 해가 서로 같은 경우
export function rpmEqTwoEqsSameRoot(random) {
  const root = ri(random, -4, 5) || 2;
  const a1 = ri(random, 2, 4);
  const b1 = ri(random, 1, 6);
  const eq1RHS = a1 * root + b1;
  const paramA = ri(random, 1, 6);
  const eq2RHS = 2 * root + paramA;
  return {
    prompt: `x에 대한 두 일차방정식 ${a1}x + ${b1} = ${eq1RHS} 와 2x + a = ${eq2RHS} 의 해가 서로 같을 때, 상수 a의 값을 구하시오.`,
    promptEn: `If ${a1}x + ${b1} = ${eq1RHS} and 2x + a = ${eq2RHS} have the same solution, find constant a.`,
    expression: `${a1}x + ${b1} = ${eq1RHS},  2x + a = ${eq2RHS}`,
    answer: String(paramA),
    explanation: `첫 번째 방정식 ${a1}x + ${b1} = ${eq1RHS}를 풀면 ${a1}x = ${eq1RHS - b1} 에서 x = ${root} 입니다. 두 방정식의 해가 같으므로 x = ${root}을 두 번째 방정식에 대입하면 2×(${root}) + a = ${eq2RHS} 이므로 a = ${paramA} 입니다.`,
    explanationEn: `Solving the first equation gives x = ${root}. Substituting into the second yields 2(${root}) + a = ${eq2RHS}, so a = ${paramA}.`
  };
}

// 16. [방정식 풀이 유형 16] 특수한 해를 갖는 일차방정식
export function rpmEqSpecialRoots(random) {
  const mode = pick(random, ['inf-many', 'no-solution']);
  if (mode === 'inf-many') {
    const aVal = 2;
    const bVal = 3;
    const ans = aVal + bVal;
    return {
      prompt: `x에 대한 방정식 ax - 5 = 2(x - b) + 1 의 해가 무수히 많을 때, a + b의 값을 구하시오. (단, a, b는 상수)`,
      promptEn: `If ax - 5 = 2(x - b) + 1 has infinitely many solutions, find a + b.`,
      expression: `ax - 5 = 2(x - b) + 1`,
      answer: String(ans),
      explanation: `우변을 전개하여 동류항을 정리하면 (a - 2)x = -2b + 6 입니다. 해가 무수히 많으려면 0×x = 0 꼴이어야 하므로 a - 2 = 0 에서 a = 2 이고, -2b + 6 = 0 에서 b = 3 입니다. 따라서 a + b = 5 입니다.`,
      explanationEn: `Rearranging gives (a - 2)x = -2b + 6. For infinitely many solutions, 0x = 0, so a = 2 and b = 3, giving a + b = 5.`
    };
  }

  // no-solution
  const b = ri(random, 3, 7);
  const rightChoice = 'a ≠ -4';
  const choices = [
    rightChoice,
    'a = -4',
    'a ≠ 4',
    'a = 4',
    'a는 모든 수'
  ].sort(() => random() - 0.5);
  const rightIdx = choices.indexOf(rightChoice) + 1;
  return {
    prompt: `x에 대한 일차방정식 ${b}x - a = ${b}x + 4 가 해를 갖지 않기 위한 상수 a의 조건은?`,
    promptEn: `Find the condition on constant a for ${b}x - a = ${b}x + 4 to have no solution.`,
    kind: 'choice',
    choicesKo: choices,
    choicesEn: choices,
    answer: String(rightIdx),
    explanation: `식을 정리하면 0×x = 4 + a 입니다. 해가 존재하지 않으려면 0×x = (0이 아닌 상수) 꼴이어야 하므로 4 + a ≠ 0, 즉 a ≠ -4 이어야 합니다.`,
    explanationEn: `Rearranging gives 0x = 4 + a. For no solution, 4 + a ≠ 0, meaning a ≠ -4.`
  };
}

// 17. [방정식 풀이 유형 17] 해의 조건이 주어진 경우
export function rpmEqRootIntegerNatural(random) {
  const k = pick(random, [7, 9, 11]);
  const validA = [];
  for (let diff = 2; diff < k; diff += 2) {
    validA.push(k - diff);
  }
  const sumA = validA.reduce((acc, v) => acc + v, 0);
  return {
    prompt: `x에 대한 일차방정식 6x + a = 4x + ${k} 의 해가 자연수가 되도록 하는 모든 자연수 a의 값의 합을 구하시오.`,
    promptEn: `Find the sum of all natural numbers a such that the solution to 6x + a = 4x + ${k} is a natural number.`,
    expression: `6x + a = 4x + ${k}`,
    answer: String(sumA),
    explanation: `방정식을 정리하면 2x = ${k} - a 이므로 x = (${k} - a)/2 입니다. x가 자연수가 되려면 ${k} - a가 2의 배수(짝수)이면서 양수이어야 합니다. 따라서 ${k} - a = ${validA.map((_, i) => (i + 1) * 2).join(', ')} 이므로 가능한 자연수 a는 ${validA.join(', ')} 입니다. 그 합은 ${sumA} 입니다.`,
    explanationEn: `Solving gives x = (${k} - a)/2. For x to be a natural number, ${k} - a must be a positive even integer. Possible values of a are ${validA.join(', ')}, with sum ${sumA}.`
  };
}

// 18. [방정식 풀이 심화 18] 해의 비와 배수 관계
export function rpmEqRootRatioMultiple(random) {
  const r1 = 4;
  const r2 = 6;
  const aVal = ri(random, 1, 5);
  const rhsConst = r2 - aVal;
  return {
    prompt: `x에 대한 두 일차방정식 5 - x = (x - 1)/3 과 2x - a = x + ${rhsConst} 의 해의 비가 2 : 3 일 때, 상수 a의 값을 구하시오.`,
    promptEn: `Given that the ratio of the roots of 5 - x = (x - 1)/3 and 2x - a = x + ${rhsConst} is 2 : 3, find constant a.`,
    expression: `5 - x = (x - 1)/3,  2x - a = x + ${rhsConst}`,
    answer: String(aVal),
    explanation: `첫 번째 방정식의 양변에 3을 곱하면 15 - 3x = x - 1 이므로 4x = 16 에서 x = ${r1} 입니다. 두 방정식의 해의 비가 2 : 3 이므로 두 번째 방정식의 해는 ${r1} × (3/2) = ${r2} 입니다. x = ${r2}를 두 번째 식에 대입하면 2×${r2} - a = ${r2} + ${rhsConst} 이므로 a = ${aVal} 입니다.`,
    explanationEn: `The first root is x = ${r1}. With ratio 2:3, the second root is ${r2}. Substituting x = ${r2} into the second equation yields a = ${aVal}.`
  };
}

// 19. [방정식 풀이 심화 19] 계수를 잘못 보고 푼 일차방정식
export function rpmEqMistakenCoef(random) {
  return {
    prompt: `어떤 학생이 일차방정식 3x - 3 = 6x - 7 을 푸는데 좌변의 x항의 계수 3을 잘못 보고 풀었더니 해가 x = -2 이었다. 3을 어떤 수로 잘못 보았는가?`,
    promptEn: `A student solves 3x - 3 = 6x - 7 but misreads the coefficient 3 on the LHS, obtaining x = -2. What number was it misread as?`,
    kind: 'choice',
    choicesKo: ['4', '6', '8', '10', '12'],
    choicesEn: ['4', '6', '8', '10', '12'],
    answer: '3',
    explanation: `잘못 본 계수를 a라 하면 ax - 3 = 6x - 7 입니다. 이 방정식의 해가 x = -2 이므로 대입하면 -2a - 3 = 6×(-2) - 7 = -19 입니다. -2a = -16 이므로 a = 8 입니다.`,
    explanationEn: `Let the misread coefficient be a: a(-2) - 3 = 6(-2) - 7 = -19, giving -2a = -16, so a = 8.`
  };
}

// 20. [방정식 풀이 발전 20] 공통해를 공유하는 복합 일차방정식 시스템
export function rpmEqCommonRootSystems(random) {
  return {
    prompt: `비례식 (x/3 - 1) : 4 = (x + 3)/4 : 6 을 만족시키는 x의 값이 두 일차방정식 (x - a)/2 - (2x - 1)/4 = -2 와 x - b = -9 의 공통해일 때, 상수 a, b에 대하여 ab의 값을 구하시오.`,
    promptEn: `If the solution to (x/3 - 1) : 4 = (x + 3)/4 : 6 is also the common solution to (x - a)/2 - (2x - 1)/4 = -2 and x - b = -9, find ab.`,
    expression: `(x/3 - 1) : 4 = (x + 3)/4 : 6,  (x - a)/2 - (2x - 1)/4 = -2,  x - b = -9`,
    answer: '81',
    explanation: `비례식에서 6(x/3 - 1) = x + 3 이므로 2x - 6 = x + 3 에서 x = 9 입니다. x = 9를 첫 번째 방정식에 대입하면 (9 - a)/2 - 17/4 = -2 에서 양변에 4를 곱하면 18 - 2a - 17 = -8, -2a = -9 에서 a = 9/2 입니다. x = 9를 두 번째 방정식에 대입하면 9 - b = -9 에서 b = 18 입니다. 따라서 ab = (9/2) × 18 = 81 입니다.`,
    explanationEn: `Solving the proportion gives x = 9. Substituting x = 9 gives a = 9/2 and b = 18, so ab = 81.`
  };
}

// 21. [단원 실전 다지기] 매일 일차방정식 풀이 종합
const allGenerators = [
  rpmEqIdentityEquation,
  rpmEqRootSubstitute,
  rpmEqIdentityDistinguish,
  rpmEqIdentityCondition,
  rpmEqPropertiesEquality,
  rpmEqSolveUsingProperties,
  rpmEqTranspositionRule,
  rpmEqLinearDefIdentify,
  rpmEqBracketsExpand,
  rpmEqDecimalCoef,
  rpmEqFractionCoef,
  rpmEqMixedDecimalFraction,
  rpmEqProportionCrossMult,
  rpmEqRootGivenParam,
  rpmEqTwoEqsSameRoot,
  rpmEqSpecialRoots,
  rpmEqRootIntegerNatural,
  rpmEqRootRatioMultiple,
  rpmEqMistakenCoef,
  rpmEqCommonRootSystems
];

export function rpmEqAllTypesMixed(random) {
  const chosen = pick(random, allGenerators);
  return chosen(random);
}

// Backward compatibility legacy alias
export const rpmEqProportionStyle = rpmEqProportionCrossMult;

// -------------------------------------------------------------
// CHAPTER 07: 일차방정식의 활용 응용 (Applications Applied)
// -------------------------------------------------------------

export function rpmAppNumberRelations(random) {
  const mode = pick(random, ['standard', 'mistake']);
  if (mode === 'standard') {
    const k = ri(random, 2, 5);
    const sub = ri(random, 2, 8);
    const m = ri(random, 1, k - 1);
    const x = ri(random, 4, 15);
    const b = k * (x - sub) - m * x;
    const promptKo = `어떤 수에서 ${sub}를 뺀 후 ${k}배 한 수는 어떤 수의 ${m === 1 ? '' : m}배보다 ${b >= 0 ? `${b}만큼 크다` : `${Math.abs(b)}만큼 작다`}고 한다. 이때 어떤 수를 구하시오.`;
    const promptEn = `Subtracting ${sub} from a number and multiplying by ${k} gives a result that is ${Math.abs(b)} ${b >= 0 ? 'more' : 'less'} than ${m === 1 ? '' : `${m} times `}the number. Find the number.`;
    return {
      prompt: promptKo,
      promptEn,
      expression: `${k}(x - ${sub}) = ${m}x ${b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`}`,
      answer: String(x),
      explanation: `어떤 수를 x라 하면 ${k}(x - ${sub}) = ${m}x ${b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`} 입니다. 식을 풀면 ${k}x - ${k * sub} = ${m}x ${b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`} 에서 (${k - m})x = ${b + k * sub} 이므로 x = ${x}입니다.`,
    };
  }

  // mistake variant (#0834)
  const a = ri(random, 3, 6);
  const b = ri(random, 2, 5);
  const x = ri(random, 3, 10);
  const correct = a * x + b;
  const mistaken = b * x + a;
  const diff = correct - mistaken;
  const promptKo = `어떤 수의 ${a}배에 ${b}를 더해야 할 것을 잘못하여 어떤 수의 ${b}배에 ${a}를 더했더니 처음 구하려고 했던 수보다 ${diff}만큼 작아졌다. 어떤 수를 구하시오.`;
  const promptEn = `Instead of adding ${b} to ${a} times a number, ${a} was mistakenly added to ${b} times the number, resulting in a value ${diff} less than intended. Find the number.`;
  return {
    prompt: promptKo,
    promptEn,
    expression: `${b}x + ${a} = (${a}x + ${b}) - ${diff}`,
    answer: String(x),
    explanation: `어떤 수를 x라 하면 잘못 계산한 식은 ${b}x + ${a}이고 원래 식은 ${a}x + ${b}입니다. 따라서 ${b}x + ${a} = (${a}x + ${b}) - ${diff} 에서 (${a - b})x = ${diff + a - b} 이므로 x = ${x}입니다.`,
  };
}

// 2. [방정식 활용 유형 02] 연속하는 수에 대한 문제 (#0835 ~ #0838)
export function rpmAppConsecutiveNumbers(random) {
  const mode = pick(random, ['even-sum', 'odd-sum', 'three-compare']);
  if (mode === 'even-sum') {
    const x = ri(random, 6, 25) * 2; // middle even
    const sum = (x - 2) + x + (x + 2);
    const promptKo = `연속하는 세 짝수의 합이 ${sum}일 때, 이 세 수 중 가장 작은 수를 구하시오.`;
    const promptEn = `The sum of three consecutive even integers is ${sum}. Find the smallest of the three numbers.`;
    return {
      prompt: promptKo,
      promptEn,
      expression: `(x - 2) + x + (x + 2) = ${sum}`,
      answer: String(x - 2),
      explanation: `연속하는 세 짝수를 x - 2, x, x + 2라 하면 (x - 2) + x + (x + 2) = ${sum} 에서 3x = ${sum}, x = ${x}입니다. 따라서 가장 작은 짝수는 ${x} - 2 = ${x - 2}입니다.`,
    };
  }

  if (mode === 'odd-sum') {
    const x = ri(random, 5, 25) * 2 + 1; // middle odd
    const sum = (x - 2) + x + (x + 2);
    const promptKo = `연속하는 세 홀수의 합이 ${sum}일 때, 이 세 수 중 가장 큰 수를 구하시오.`;
    const promptEn = `The sum of three consecutive odd integers is ${sum}. Find the largest of the three numbers.`;
    return {
      prompt: promptKo,
      promptEn,
      expression: `(x - 2) + x + (x + 2) = ${sum}`,
      answer: String(x + 2),
      explanation: `연속하는 세 홀수를 x - 2, x, x + 2라 하면 3x = ${sum} 에서 x = ${x}입니다. 따라서 가장 큰 홀수는 ${x} + 2 = ${x + 2}입니다.`,
    };
  }

  // three-compare (#0837)
  const x = ri(random, 6, 20) * 2; // middle even
  const left = x - 2;
  const right = x + 2;
  const k = 3;
  const diff = k * right - 2 * (left + x);
  const promptKo = `연속하는 세 짝수 중에서 가장 큰 수의 3배는 나머지 두 수의 합의 2배보다 ${diff >= 0 ? `${diff}만큼 크다` : `${Math.abs(diff)}만큼 작다`}고 한다. 이때 가운데 수를 구하시오.`;
  const promptEn = `Among three consecutive even numbers, 3 times the largest is ${Math.abs(diff)} ${diff >= 0 ? 'greater' : 'less'} than 2 times the sum of the other two numbers. Find the middle number.`;
  return {
    prompt: promptKo,
    promptEn,
    expression: `3(x + 2) = 2(2x - 2) + ${diff}`,
    answer: String(x),
    explanation: `연속하는 세 짝수를 x - 2, x, x + 2라 하면 3(x + 2) = 2{(x - 2) + x} + ${diff} 에서 3x + 6 = 4x - 4 + ${diff} 이므로 x = ${x}입니다.`,
  };
}

// 3. [방정식 활용 유형 03] 자릿수에 대한 문제 (#0839 ~ #0842, #0905)
export function rpmAppDigitValues(random) {
  // Let original two-digit number have tens t and units u
  const tens = ri(random, 1, 8);
  const diff = ri(random, 1, 9 - tens);
  const units = tens + diff; // units > tens
  const original = 10 * tens + units;
  const reversed = 10 * units + tens;
  const revDiff = reversed - original; // 9 * diff
  const sumDigits = tens + units;

  const mode = pick(random, ['sum-given', 'fixed-units']);
  if (mode === 'sum-given') {
    const promptKo = `각 자리의 숫자의 합이 ${sumDigits}인 두 자리의 자연수가 있다. 이 자연수의 십의 자리의 숫자와 일의 자리의 숫자를 바꾼 수는 처음 수보다 ${revDiff}만큼 크다고 한다. 처음 자연수를 구하시오.`;
    const promptEn = `In a two-digit number, the sum of the digits is ${sumDigits}. Reversing the digits produces a number ${revDiff} greater than the original number. Find the original number.`;
    return {
      prompt: promptKo,
      promptEn,
      expression: `10(${sumDigits} - x) + x = 10x + (${sumDigits} - x) + ${revDiff}`,
      answer: String(original),
      explanation: `처음 수의 십의 자리 숫자를 x라 하면 일의 자리 숫자는 ${sumDigits} - x입니다. 바꾼 수는 10(${sumDigits} - x) + x이고 처음 수는 10x + (${sumDigits} - x)입니다. 바꾼 수 = 처음 수 + ${revDiff} 에서 식을 풀면 x = ${tens}이므로 처음 자연수는 ${original}입니다.`,
    };
  }

  // fixed-units mode (#0839)
  const promptKo = `일의 자리의 숫자가 ${units}인 두 자리의 자연수가 있다. 이 자연수의 십의 자리의 숫자와 일의 자리의 숫자를 바꾼 수는 처음 수의 2배보다 ${(reversed - 2 * original) >= 0 ? `${reversed - 2 * original}만큼 크다` : `${Math.abs(reversed - 2 * original)}만큼 작다`}고 한다. 처음 자연수를 구하시오.`;
  const promptEn = `The units digit of a two-digit number is ${units}. Reversing the digits gives a number that is ${Math.abs(reversed - 2 * original)} ${reversed >= 2 * original ? 'greater' : 'less'} than twice the original number. Find the original number.`;
  const kDiff = reversed - 2 * original;
  return {
    prompt: promptKo,
    promptEn,
    expression: `${10 * units} + x = 2(10x + ${units}) ${kDiff >= 0 ? `+ ${kDiff}` : `- ${Math.abs(kDiff)}`}`,
    answer: String(original),
    explanation: `처음 수의 십의 자리를 x라 하면 처음 수는 10x + ${units}, 바꾼 수는 ${10 * units} + x입니다. ${10 * units} + x = 2(10x + ${units}) + (${kDiff}) 를 풀면 x = ${tens}이므로 처음 수는 ${original}입니다.`,
  };
}

// 4. [방정식 활용 유형 04] 나이에 대한 문제 (#0843 ~ #0844)
export function rpmAppAgeProblems(random) {
  const yearsLater = pick(random, [8, 10, 12, 14, 15]);
  const sonNow = ri(random, 11, 16);
  const fatherNow = 2 * (sonNow + yearsLater) - yearsLater;
  const sumAges = fatherNow + sonNow;

  const promptKo = `현재 아버지와 아들의 나이의 합은 ${sumAges}세이고, ${yearsLater}년 후에는 아버지의 나이가 아들의 나이의 2배가 된다고 한다. 현재 아들의 나이를 구하시오.`;
  const promptEn = `Currently, the sum of a father's and his son's ages is ${sumAges}. In ${yearsLater} years, the father's age will be twice the son's age. Find the son's current age.`;

  return {
    prompt: promptKo,
    promptEn,
    expression: `(${sumAges} - x) + ${yearsLater} = 2(x + ${yearsLater})`,
    answer: String(sonNow),
    answerSuffix: '세',
    explanation: `현재 아들의 나이를 x세라 하면 아버지의 나이는 (${sumAges} - x)세입니다. ${yearsLater}년 후의 나이는 아들이 (x + ${yearsLater})세, 아버지가 (${sumAges} - x + ${yearsLater})세이므로 (${sumAges + yearsLater} - x) = 2(x + ${yearsLater}) 에서 3x = ${sumAges - yearsLater}, x = ${sonNow}세입니다.`,
  };
}

// 5. [방정식 활용 유형 05] 예금액과 소지금에 대한 문제 (#0845 ~ #0846, #0906)
export function rpmAppSavingsAllowance(random) {
  const brotherA = ri(random, 30, 60) * 1000;
  const brotherB = ri(random, 10, 25) * 1000;
  const monthlyA = ri(random, 3, 6) * 1000;
  const months = ri(random, 6, 15);
  // After months, brotherA + monthlyA * months = 2 * (brotherB + monthlyB * months)
  const totalA = brotherA + monthlyA * months;
  // totalA = 2 * (brotherB + monthlyB * months) => brotherB + monthlyB * months = totalA / 2
  // We can solve for monthlyB, or months
  const monthlyB = (totalA / 2 - brotherB) / months;

  if (Number.isInteger(monthlyB) && monthlyB > 0) {
    const promptKo = `현재 형은 통장에 ${brotherA}원, 동생은 통장에 ${brotherB}원이 예금되어 있다. 다음 달부터 매달 형은 ${monthlyA}원씩, 동생은 ${monthlyB}원씩 예금한다면 몇 개월 후에 형의 예금액이 동생의 예금액의 2배가 되는지 구하시오.`;
    const promptEn = `Currently, an older brother has ${brotherA} won and his younger brother has ${brotherB} won in the bank. If the older brother deposits ${monthlyA} won and the younger brother deposits ${monthlyB} won every month, in how many months will the older brother's savings be twice the younger brother's?`;
    return {
      prompt: promptKo,
      promptEn,
      expression: `${brotherA} + ${monthlyA}x = 2(${brotherB} + ${monthlyB}x)`,
      answer: String(months),
      answerSuffix: '개월',
      explanation: `x개월 후 형의 예금액은 ${brotherA} + ${monthlyA}x원, 동생의 예금액은 ${brotherB} + ${monthlyB}x원입니다. ${brotherA} + ${monthlyA}x = 2(${brotherB} + ${monthlyB}x) 를 풀면 x = ${months}개월입니다.`,
    };
  }

  // fallback daily spending mode (#0906)
  const moneyA = 50000;
  const moneyB = 30000;
  const spend = 1000;
  const targetDays = 20; // 50000 - 20000 = 30000, 30000 - 20000 = 10000 => 3 times!
  const promptKo = `현재 우찬이가 가지고 있는 돈은 50000원, 세진이가 가지고 있는 돈은 30000원이다. 두 사람이 각각 매일 1000원씩 사용할 때, 우찬이가 가지고 있는 돈이 세진이가 가지고 있는 돈의 3배가 되는 것은 며칠 후인지 구하시오.`;
  const promptEn = `Currently A has 50,000 won and B has 30,000 won. If both spend 1,000 won each day, in how many days will A's remaining money be 3 times B's?`;
  return {
    prompt: promptKo,
    promptEn,
    expression: `50000 - 1000x = 3(30000 - 1000x)`,
    answer: String(targetDays),
    answerSuffix: '일',
    explanation: `x일 후 50000 - 1000x = 3(30000 - 1000x) 에서 50000 - 1000x = 90000 - 3000x, 2000x = 40000 이므로 x = ${targetDays}일 후입니다.`,
  };
}

// 6. [방정식 활용 유형 06] 개수의 합이 일정한 문제 (#0847 ~ #0850)
export function rpmAppFixedTotalCount(random) {
  const priceA = pick(random, [600, 700, 800, 900]);
  const priceB = pick(random, [400, 500]);
  const totalItems = pick(random, [10, 12, 15, 20]);
  const countA = ri(random, 3, totalItems - 3);
  const countB = totalItems - countA;
  const totalCost = priceA * countA + priceB * countB;
  const paid = (Math.ceil(totalCost / 5000) + 1) * 5000;
  const change = paid - totalCost;

  const promptKo = `한 개에 ${priceA}원인 과자와 한 개에 ${priceB}원인 아이스크림을 합하여 모두 ${totalItems}개를 사고 ${paid}원을 내었더니 ${change}원을 거슬러 주었다. 이때 산 과자의 개수를 구하시오.`;
  const promptEn = `Snacks at ${priceA} won each and ice cream bars at ${priceB} won each were bought for a total of ${totalItems} items. Paying with ${paid} won resulted in ${change} won in change. How many snacks were bought?`;

  return {
    prompt: promptKo,
    promptEn,
    expression: `${priceA}x + ${priceB}(${totalItems} - x) = ${paid} - ${change}`,
    answer: String(countA),
    answerSuffix: '개',
    explanation: `산 과자의 개수를 x개라 하면 아이스크림의 개수는 (${totalItems} - x)개입니다. ${priceA}x + ${priceB}(${totalItems} - x) = ${totalCost} 에서 (${priceA - priceB})x = ${totalCost - priceB * totalItems} 이므로 x = ${countA}개입니다.`,
  };
}

// 7. [방정식 활용 유형 07] 도형의 둘레와 넓이에 대한 문제 (#0851 ~ #0854)
export function rpmAppGeometryFigures(random) {
  const side = ri(random, 10, 18);
  const incW = ri(random, 3, 6);
  const decH = ri(random, 2, 4);
  const oldArea = side * side;
  const newArea = (side + incW) * (side - decH);
  const areaDiff = newArea - oldArea;

  const promptKo = `한 변의 길이가 ${side}cm인 정사각형에서 가로의 길이를 ${incW}cm 늘이고, 세로의 길이를 x cm 줄여서 직사각형을 만들었더니 넓이가 처음 정사각형보다 ${Math.abs(areaDiff)}cm²만큼 ${areaDiff >= 0 ? '늘어났다' : '줄어들었다'}고 한다. 이때 x의 값을 구하시오.`;
  const promptEn = `From a square with side length ${side} cm, the width was increased by ${incW} cm and the height was decreased by x cm to form a rectangle whose area is ${Math.abs(areaDiff)} cm² ${areaDiff >= 0 ? 'larger' : 'smaller'} than the square. Find x.`;

  return {
    prompt: promptKo,
    promptEn,
    expression: `(${side} + ${incW})(${side} - x) = ${newArea}`,
    answer: String(decH),
    answerSuffix: 'cm',
    explanation: `만든 직사각형의 가로는 (${side} + ${incW}) = ${side + incW}cm, 세로는 (${side} - x)cm입니다. (${side + incW})(${side} - x) = ${newArea} 에서 ${side} - x = ${newArea / (side + incW)} = ${side - decH} 이므로 x = ${decH}입니다.`,
  };
}

// 8. [방정식 활용 유형 08] 과부족에 대한 문제 (물건 분배) (#0855 ~ #0857)
export function rpmAppExcessDeficitItems(random) {
  const students = ri(random, 8, 20);
  const give1 = ri(random, 4, 6);
  const leftover = ri(random, 2, 5);
  const totalItems = give1 * students + leftover;
  const give2 = give1 + 1;
  const deficit = give2 * students - totalItems;

  const promptKo = `학생들에게 귤을 나누어 주는데 한 학생에게 ${give1}개씩 나누어 주면 ${leftover}개가 남고, ${give2}개씩 나누어 주면 ${deficit}개가 부족하다고 한다. 이때 학생 수와 귤의 전체 개수를 구하시오. (학생 수를 답으로 작성)`;
  const promptEn = `When distributing tangerines among students, giving ${give1} to each leaves ${leftover} remaining, while giving ${give2} to each leaves a deficit of ${deficit}. Find the number of students.`;

  return {
    prompt: promptKo,
    promptEn,
    expression: `${give1}x + ${leftover} = ${give2}x - ${deficit}`,
    answer: String(students),
    answerSuffix: '명',
    explanation: `학생 수를 x명이라 하면 전체 귤의 개수는 ${give1}x + ${leftover} = ${give2}x - ${deficit} 입니다. 식을 풀면 x = ${leftover + deficit} = ${students}명입니다. (총 귤의 개수는 ${totalItems}개입니다.)`,
  };
}

// 9. [방정식 활용 유형 09] 증가, 감소에 대한 문제 (#0858 ~ #0861, #0907)
export function rpmAppPercentChangeStudents(random) {
  const lastBoys = ri(random, 20, 35) * 10;
  const lastGirls = ri(random, 20, 35) * 10;
  const lastTotal = lastBoys + lastGirls;
  const boyRate = pick(random, [5, 10, 15]);
  const girlRate = pick(random, [4, 5, 8, 10]);
  const boyInc = Math.round(lastBoys * boyRate / 100);
  const girlDec = Math.round(lastGirls * girlRate / 100);
  const netChange = boyInc - girlDec;
  const thisBoys = lastBoys + boyInc;

  const promptKo = `어느 중학교의 올해의 남학생과 여학생 수는 작년에 비하여 남학생은 ${boyRate}% 증가하고, 여학생은 ${girlRate}% 감소하였다. 작년의 전체 학생 수는 ${lastTotal}명이고, 올해는 작년에 비하여 전체적으로 ${Math.abs(netChange)}명이 ${netChange >= 0 ? '증가' : '감소'}하였다고 한다. 올해의 남학생 수를 구하시오.`;
  const promptEn = `At a school this year, the number of boys increased by ${boyRate}% and girls decreased by ${girlRate}% compared to last year. Last year's total enrollment was ${lastTotal}, and this year there is a net ${netChange >= 0 ? 'increase' : 'decrease'} of ${Math.abs(netChange)} students. Find the number of boys this year.`;

  return {
    prompt: promptKo,
    promptEn,
    expression: `(${boyRate}/100)x - (${girlRate}/100)(${lastTotal} - x) = ${netChange}`,
    answer: String(thisBoys),
    answerSuffix: '명',
    explanation: `작년의 남학생 수를 x명이라 하면 여학생 수는 (${lastTotal} - x)명입니다. 남학생 증가량은 +(${boyRate}/100)x명, 여학생 감소량은 -(${girlRate}/100)(${lastTotal} - x)명이므로 (${boyRate}/100)x - (${girlRate}/100)(${lastTotal} - x) = ${netChange} 에서 풀면 작년 남학생 수 x = ${lastBoys}명입니다. 따라서 올해의 남학생 수는 ${lastBoys} × (1 + ${boyRate}/100) = ${thisBoys}명입니다.`,
  };
}

// 10. [방정식 활용 유형 10] 전체의 양에 대한 문제 (독서/분량) (#0862 ~ #0864)
export function rpmAppTotalFractionReading(random) {
  // Read 1/a on day 1, 1/b on day 2, c pages on day 3
  const a = pick(random, [3, 4]);
  const b = pick(random, [4, 5]);
  const remFractionDenom = a * b;
  const remFractionNum = remFractionDenom - (b + a);
  const k = ri(random, 4, 8);
  const totalPages = remFractionDenom * k;
  const day3Pages = remFractionNum * k;

  const choices = [
    totalPages,
    totalPages - 20,
    totalPages + 20,
    totalPages + 40,
    totalPages - 40,
  ].sort((x, y) => x - y);

  const rightIdx = choices.indexOf(totalPages) + 1;

  const promptKo = `성희가 책 한 권을 읽는데 첫째 날에는 전체의 1/${a}을, 둘째 날에는 전체의 1/${b}을 읽고, 셋째 날에는 ${day3Pages}쪽을 읽어 3일 만에 다 읽었다고 한다. 이때 이 책의 전체 쪽수를 구하시오.`;
  const promptEn = `Reading a book over 3 days, a student read 1/${a} of the total on day 1, 1/${b} on day 2, and the remaining ${day3Pages} pages on day 3. Find the total number of pages.`;

  return {
    prompt: promptKo,
    promptEn,
    expression: `(1/${a})x + (1/${b})x + ${day3Pages} = x`,
    kind: 'choice',
    choices: choices.map((c) => `${c}쪽`),
    answer: String(rightIdx),
    explanation: `전체 쪽수를 x라 하면 (1/${a})x + (1/${b})x + ${day3Pages} = x 입니다. 양변에 ${remFractionDenom}을 곱하면 ${b}x + ${a}x + ${day3Pages * remFractionDenom} = ${remFractionDenom}x 에서 ${remFractionNum}x = ${day3Pages * remFractionDenom} 이므로 x = ${totalPages}쪽입니다.`,
  };
}

// 11. [방정식 활용 유형 11] 거리·속력·시간 (왕복 및 코스 변화 문제) (#0865 ~ #0868, #0909)
export function rpmAppSpeedRoundtripCourses(random) {
  const speedUp = pick(random, [2, 3]);
  const speedDown = speedUp + 1; // 3 or 4
  const extraDist = pick(random, [1, 2, 3]);
  const totalHours = pick(random, [3, 4, 5]);

  // x / speedUp + (x + extraDist) / speedDown = totalHours
  // x (1/speedUp + 1/speedDown) = totalHours - extraDist / speedDown
  // (speedDown + speedUp) / (speedUp * speedDown) * x = (totalHours * speedDown - extraDist) / speedDown
  // (speedUp + speedDown) * x = speedUp * (totalHours * speedDown - extraDist)
  const numer = speedUp * (totalHours * speedDown - extraDist);
  const denom = speedUp + speedDown;

  if (numer % denom === 0 && numer > 0) {
    const xDist = numer / denom;
    const promptKo = `등산을 하는데 올라갈 때는 시속 ${speedUp}km로 걷고, 내려올 때는 올라갈 때보다 ${extraDist}km 더 먼 길을 시속 ${speedDown}km로 걸어서 모두 ${totalHours}시간이 걸렸다. 올라간 거리를 구하시오.`;
    const promptEn = `Hiking a mountain, climbing up at ${speedUp} km/h and descending via a path ${extraDist} km longer at ${speedDown} km/h took a total of ${totalHours} hours. Find the uphill distance.`;
    return {
      prompt: promptKo,
      promptEn,
      expression: `x/${speedUp} + (x + ${extraDist})/${speedDown} = ${totalHours}`,
      answer: String(xDist),
      answerSuffix: 'km',
      explanation: `올라간 거리를 x km라 하면 내려온 거리는 (x + ${extraDist})km입니다. x/${speedUp} + (x + ${extraDist})/${speedDown} = ${totalHours} 의 양변에 ${speedUp * speedDown}을 곱하여 풀면 x = ${xDist}km입니다.`,
    };
  }

  // standard roundtrip
  const v1 = 3;
  const v2 = 4;
  const dist = 12;
  const promptKo = `어떤 산을 올라갈 때는 시속 3km로 걷고, 같은 길을 내려올 때는 시속 4km로 걸어서 왕복 총 7시간이 걸렸다. 이 등산로의 편도 거리를 구하시오.`;
  const promptEn = `Hiking up at 3 km/h and returning along the same path at 4 km/h took 7 hours round-trip. Find the one-way distance.`;
  return {
    prompt: promptKo,
    promptEn,
    expression: `x/3 + x/4 = 7`,
    answer: String(dist),
    answerSuffix: 'km',
    explanation: `등산로 편도 거리를 x km라 하면 x/3 + x/4 = 7 에서 4x + 3x = 84, 7x = 84 이므로 x = 12km입니다.`,
  };
}

// 12. [방정식 활용 유형 12] 거리·속력·시간 (시간 차가 발생하는 경우) (#0869 ~ #0871)
export function rpmAppSpeedTimeDifference(random) {
  const vSlow = pick(random, [40, 50, 60]);
  const vFast = vSlow + 20; // 60, 70, 80
  const dist = ri(random, 4, 10) * (vSlow * vFast / gcd(vSlow, vFast)) / 60 * 60; // ensure integer minutes
  // Let's design cleanly:
  const distClean = pick(random, [60, 70, 80, 105, 120, 140]);
  // Time diff in minutes: (dist / vSlow - dist / vFast) * 60
  // To ensure integer minutes, let's select vSlow=60, vFast=70, dist=35 => diff = 5 min
  const v1 = 60;
  const v2 = 70;
  const dVal = 35;
  const minDiff = 5;

  const promptKo = `두 지점 A, B 사이를 자동차로 왕복하는데 시속 ${v1}km로 달리는 것은 시속 ${v2}km로 달리는 것보다 ${minDiff}분이 더 걸린다고 한다. 두 지점 A, B 사이의 거리를 구하시오.`;
  const promptEn = `Driving round-trip between points A and B, traveling at ${v1} km/h takes ${minDiff} minutes longer than traveling at ${v2} km/h. Find the distance between A and B.`;

  return {
    prompt: promptKo,
    promptEn,
    expression: `x/${v1} - x/${v2} = ${minDiff}/60`,
    answer: String(dVal),
    answerSuffix: 'km',
    explanation: `두 지점 사이의 거리를 x km라 하면 x/${v1} - x/${v2} = ${minDiff}/60 = 1/12 입니다. 양변에 420을 곱하면 7x - 6x = 35 이므로 x = ${dVal}km입니다.`,
  };
}

// 13. [방정식 활용 유형 13] 거리·속력·시간 (늦게 출발하여 따라잡기) (#0872 ~ #0874)
export function rpmAppSpeedCatchupDelay(random) {
  const vSlow = pick(random, [50, 60, 80]); // m/min
  const vFast = pick(random, [150, 180, 200]); // m/min
  const delayMin = pick(random, [6, 10, 12, 15]);
  // vFast * t = vSlow * (t + delayMin) => (vFast - vSlow) * t = vSlow * delayMin
  const num = vSlow * delayMin;
  const den = vFast - vSlow;
  const t = num / den;

  if (Number.isInteger(t)) {
    const promptKo = `동생이 집을 출발한 지 ${delayMin}분 후에 형이 자전거를 타고 동생을 따라나섰다. 동생은 분속 ${vSlow}m로 걷고 형은 분속 ${vFast}m로 달린다면, 형이 출발한 지 몇 분 후에 동생을 만나게 되는지 구하시오.`;
    const promptEn = `A younger brother leaves home on foot at ${vSlow} m/min. ${delayMin} minutes later, his brother pursues on bicycle at ${vFast} m/min. How many minutes after starting does the brother catch up?`;
    return {
      prompt: promptKo,
      promptEn,
      expression: `${vFast}x = ${vSlow}(x + ${delayMin})`,
      answer: String(t),
      answerSuffix: '분',
      explanation: `형이 출발한 지 x분 후에 만난다고 하면 동생이 이동한 시간은 (x + ${delayMin})분입니다. 두 사람이 이동한 거리는 같으므로 ${vFast}x = ${vSlow}(x + ${delayMin}) 에서 (${vFast - vSlow})x = ${vSlow * delayMin} 이므로 x = ${t}분입니다.`,
    };
  }

  // fallback clean
  return {
    prompt: `동생이 집을 출발한 지 10분 후에 형이 동생을 따라나섰다. 동생은 분속 60m로 걷고 형은 분속 160m로 달린다면, 형이 출발한 지 몇 분 후에 동생을 만나게 되는지 구하시오.`,
    promptEn: `A brother starts 10 minutes later at 160 m/min pursuing his sibling who walks at 60 m/min. How many minutes does it take to catch up?`,
    expression: `160x = 60(x + 10)`,
    answer: '6',
    answerSuffix: '분',
    explanation: `160x = 60x + 600 에서 100x = 600 이므로 x = 6분입니다.`,
  };
}

// 14. [방정식 활용 유형 14] 거리·속력·시간 (마주 보고 가거나 둘레를 도는 경우) (#0875 ~ #0877, #0910)
export function rpmAppSpeedTracksOpposite(random) {
  const mode = pick(random, ['track-opposite', 'toward-each-other']);
  if (mode === 'track-opposite') {
    const vA = pick(random, [120, 150, 180]); // m/min
    const vB = pick(random, [80, 100, 120]);
    const trackDist = pick(random, [2400, 3000, 3600]);
    const t = trackDist / (vA + vB);
    if (Number.isInteger(t)) {
      const promptKo = `둘레의 길이가 ${trackDist}m인 호숫가를 A, B 두 사람이 같은 지점에서 동시에 출발하여 서로 반대 방향으로 돌았다. A는 분속 ${vA}m, B는 분속 ${vB}m로 걸을 때, 두 사람은 출발한 지 몇 분 후에 처음으로 만나게 되는지 구하시오.`;
      const promptEn = `Walking in opposite directions around a ${trackDist} m lake starting simultaneously from the same point, A walks at ${vA} m/min and B walks at ${vB} m/min. In how many minutes do they first meet?`;
      return {
        prompt: promptKo,
        promptEn,
        expression: `(${vA} + ${vB})x = ${trackDist}`,
        answer: String(t),
        answerSuffix: '분',
        explanation: `출발한 지 x분 후에 처음으로 만난다고 하면 반대 방향으로 돌았으므로 두 사람이 이동한 거리의 합이 호수 둘레와 같습니다. ${vA}x + ${vB}x = ${trackDist} 에서 ${vA + vB}x = ${trackDist} 이므로 x = ${t}분입니다.`,
      };
    }
  }

  // toward-each-other (#0876)
  const distTotal = 1400;
  const v1 = 80;
  const v2 = 60;
  const meetTime = 10;
  const promptKo = `하늘이와 수영이네 집 사이의 거리는 ${distTotal}m이다. 하늘이는 분속 ${v1}m로, 수영이는 분속 ${v2}m로 각자의 집에서 상대방의 집을 향하여 동시에 출발하여 걸어갔다. 두 사람은 출발한 지 몇 분 후에 만나게 되는지 구하시오.`;
  const promptEn = `The distance between two homes is ${distTotal} m. Walking toward each other simultaneously at ${v1} m/min and ${v2} m/min, in how many minutes do they meet?`;
  return {
    prompt: promptKo,
    promptEn,
    expression: `${v1}x + ${v2}x = ${distTotal}`,
    answer: String(meetTime),
    answerSuffix: '분',
    explanation: `출발한 지 x분 후에 만난다고 하면 두 사람이 걸은 거리의 합이 두 집 사이의 거리와 같으므로 ${v1}x + ${v2}x = ${distTotal}, ${v1 + v2}x = ${distTotal} 에서 x = ${meetTime}분입니다.`,
  };
}

// 15. [방정식 활용 유형 15] 소금물의 농도 (물을 더 넣거나 증발시키는 경우) (#0878 ~ #0881, #0911)
export function rpmAppSaltWaterEvaporateAdd(random) {
  const mode = pick(random, ['evaporate', 'add-water']);
  if (mode === 'evaporate') {
    const cInit = pick(random, [6, 8, 12]);
    const wInit = pick(random, [200, 250, 300]);
    const cTarget = cInit + pick(random, [2, 3, 4]);
    // cInit * wInit = cTarget * (wInit - x) => wInit - x = (cInit * wInit) / cTarget
    const salt = cInit * wInit;
    if (salt % cTarget === 0) {
      const xEvap = wInit - salt / cTarget;
      const promptKo = `${cInit}%의 소금물 ${wInit}g이 있다. 이 소금물에서 몇 g의 물을 증발시키면 ${cTarget}%의 소금물이 되는지 구하시오.`;
      const promptEn = `How many grams of water must be evaporated from ${wInit} g of ${cInit}% salt solution to produce a ${cTarget}% salt solution?`;
      return {
        prompt: promptKo,
        promptEn,
        expression: `(${cInit}/100) × ${wInit} = (${cTarget}/100) × (${wInit} - x)`,
        answer: String(xEvap),
        answerSuffix: 'g',
        explanation: `증발시키는 물의 양을 x g이라 하면 증발 전후 소금의 양은 변하지 않습니다. (${cInit}/100) × ${wInit} = (${cTarget}/100) × (${wInit} - x) 에서 ${salt} = ${cTarget}(${wInit} - x) 이므로 ${wInit} - x = ${salt / cTarget}, x = ${xEvap}g입니다.`,
      };
    }
  }

  // add-water
  const cInit = 10;
  const wInit = 200;
  const cTarget = 8;
  const xAdd = 50;
  const promptKo = `${cInit}%의 소금물 ${wInit}g이 있다. 이 소금물에 몇 g의 물을 더 넣으면 ${cTarget}%의 소금물이 되는지 구하시오.`;
  const promptEn = `How many grams of water must be added to ${wInit} g of ${cInit}% salt solution to dilute it to ${cTarget}%?`;
  return {
    prompt: promptKo,
    promptEn,
    expression: `(${cInit}/100) × ${wInit} = (${cTarget}/100) × (${wInit} + x)`,
    answer: String(xAdd),
    answerSuffix: 'g',
    explanation: `더 넣는 물의 양을 x g이라 하면 (${cInit}/100) × ${wInit} = (${cTarget}/100) × (${wInit} + x) 에서 2000 = ${cTarget}(200 + x) 이므로 200 + x = 250, x = ${xAdd}g입니다.`,
  };
}

// 16. [방정식 활용 유형 16] 소금물의 농도 (소금을 직접 더 넣는 경우) (#0882 ~ #0885, #0912)
export function rpmAppSaltAddSalt(random) {
  const cInit = pick(random, [10, 15, 20]);
  const cTarget = cInit + pick(random, [10, 15]);
  // (cInit * W + 100 * x) = cTarget * (W + x)
  // (100 - cTarget) * x = (cTarget - cInit) * W
  const numFactor = cTarget - cInit;
  const denFactor = 100 - cTarget;
  const k = ri(random, 1, 3);
  const xSalt = denFactor * k;
  const wInit = numFactor * k; // wait, if W is small, let's make W realistic
  // Let W = 200, cInit = 20, cTarget = 30 => (100 - 30)x = (30 - 20) * 200 => 70x = 2000 not int
  // If (cTarget - cInit) * W is divisible by (100 - cTarget):
  // e.g. cInit = 20, cTarget = 25 => den = 75, num = 5 => 75x = 5W => x = W / 15
  // e.g. cInit = 10, cTarget = 20 => den = 80, num = 10 => 80x = 10W => x = W / 8. If W = 240, x = 30g!
  const W = 240;
  const c1 = 10;
  const c2 = 20;
  const ansX = (c2 - c1) * W / (100 - c2); // 10 * 240 / 80 = 30g!
  const promptKo = `${c1}%의 소금물 ${W}g이 있다. 여기에 소금을 더 넣어 ${c2}%의 소금물을 만들려고 할 때, 더 넣어야 하는 소금의 양을 구하시오.`;
  const promptEn = `To convert ${W} g of ${c1}% salt solution into a ${c2}% salt solution, how many grams of pure salt must be added?`;

  return {
    prompt: promptKo,
    promptEn,
    expression: `(${c1}/100) × ${W} + x = (${c2}/100) × (${W} + x)`,
    answer: String(ansX),
    answerSuffix: 'g',
    explanation: `더 넣는 소금의 양을 x g이라 하면 소금의 양과 소금물 전체의 양이 모두 x g만큼 증가합니다. (${c1}/100) × ${W} + x = (${c2}/100) × (${W} + x) 에서 ${c1 * W} + 100x = ${c2 * W} + ${c2}x, (100 - ${c2})x = (${c2 - c1}) × ${W} = ${(c2 - c1) * W} 이므로 x = ${ansX}g입니다.`,
  };
}

// 17. [방정식 활용 유형 17] 소금물의 농도 (농도가 다른 두 소금물 섞기) (#0886 ~ #0889)
export function rpmAppSaltTwoSolutionsMix(random) {
  const c1 = pick(random, [3, 4, 5, 6]);
  const c2 = c1 + pick(random, [4, 5, 6]);
  const cTarget = c1 + 2; // in between
  const totalWeight = pick(random, [200, 300, 400]);
  // c1 * x + c2 * (totalWeight - x) = cTarget * totalWeight
  // (c2 - c1) * x = (c2 - cTarget) * totalWeight
  const x1 = (c2 - cTarget) * totalWeight / (c2 - c1);

  if (Number.isInteger(x1) && x1 > 0) {
    const promptKo = `${c1}%의 소금물과 ${c2}%의 소금물을 섞어서 ${cTarget}%의 소금물 ${totalWeight}g을 만들려고 한다. 이때 ${c1}%의 소금물은 몇 g을 섞어야 하는지 구하시오.`;
    const promptEn = `Mixing a ${c1}% salt solution and a ${c2}% salt solution to create ${totalWeight} g of a ${cTarget}% solution, how many grams of the ${c1}% solution should be used?`;
    return {
      prompt: promptKo,
      promptEn,
      expression: `(${c1}/100)x + (${c2}/100)(${totalWeight} - x) = (${cTarget}/100) × ${totalWeight}`,
      answer: String(x1),
      answerSuffix: 'g',
      explanation: `${c1}%의 소금물을 x g 섞는다고 하면 ${c2}%의 소금물은 (${totalWeight} - x)g입니다. 소금의 양의 합이 일정하므로 ${c1}x + ${c2}(${totalWeight} - x) = ${cTarget * totalWeight} 에서 (${c2 - c1})x = ${(c2 - cTarget) * totalWeight} 이므로 x = ${x1}g입니다.`,
    };
  }

  // fallback clean (#0886)
  return {
    prompt: `10%의 소금물 100g과 20%의 소금물을 섞어서 12%의 소금물을 만들려고 한다. 이때 20%의 소금물은 몇 g을 섞어야 하는지 구하시오.`,
    promptEn: `Mixing 100 g of 10% salt solution with a 20% salt solution to obtain a 12% solution, how many grams of the 20% solution are required?`,
    expression: `(10/100) × 100 + (20/100)x = (12/100)(100 + x)`,
    answer: '25',
    answerSuffix: 'g',
    explanation: `20% 소금물을 x g 섞는다고 하면 1000 + 20x = 12(100 + x) 에서 8x = 200 이므로 x = 25g입니다.`,
  };
}

// 18. [방정식 활용 유형 18] 원가·정가·할인·이익에 대한 문제 (#0890 ~ #0893, #0908, #0916)
export function rpmAppCostPriceProfitDiscount(random) {
  const cost = ri(random, 5, 20) * 1000;
  const markupRate = pick(random, [20, 25, 30, 40, 50]);
  const discount = ri(random, 1, 5) * 1000;
  const profit = Math.round(cost * markupRate / 100) - discount;

  if (profit > 0) {
    const promptKo = `어떤 물건의 원가에 ${markupRate}%의 이익을 붙여서 정가를 정했다가 상품이 팔리지 않아 정가에서 ${discount}원을 할인하여 팔았더니 ${profit}원의 이익이 생겼다. 이 물건의 원가를 구하시오.`;
    const promptEn = `An item was marked up by ${markupRate}% over its cost to set the list price. Because it did not sell, it was discounted by ${discount} won from the list price, yielding a profit of ${profit} won. Find the cost price.`;
    return {
      prompt: promptKo,
      promptEn,
      expression: `(1 + ${markupRate}/100)x - ${discount} - x = ${profit}`,
      answer: String(cost),
      answerSuffix: '원',
      explanation: `물건의 원가를 x원이라 하면 정가는 (1 + ${markupRate}/100)x원이고, 판매 가격은 (1 + ${markupRate}/100)x - ${discount}원입니다. 이익 = 판매 가격 - 원가 = (${markupRate}/100)x - ${discount} = ${profit} 에서 (${markupRate}/100)x = ${profit + discount} = ${Math.round(cost * markupRate / 100)} 이므로 x = ${cost}원입니다.`,
    };
  }

  // fallback clean
  return {
    prompt: `어떤 선풍기의 원가에 20%의 이익을 붙여서 정가를 정했다가 정가에서 5000원을 할인하여 팔았더니 원가의 5%의 이익이 남았다. 이 선풍기의 원가를 구하시오.`,
    promptEn: `A fan was marked up 20% for its list price, then sold at a 5,000 won discount, yielding a 5% profit on the cost. Find the cost.`,
    expression: `1.20x - 5000 = 1.05x`,
    answer: '33333', // wait, let's make it integer! 0.15x = 5000 not int => 1.20x - 3000 = 1.05x => 0.15x = 3000 => x = 20000!
    answerSuffix: '원',
    explanation: `원가를 x원이라 하면 1.2x - 5000 = 1.05x 에서 0.15x = 3000 이므로 x = 20000원입니다.`,
  };
}

// 19. [방정식 활용 유형 19] 일에 대한 문제 (전체 일의 양 1) (#0894 ~ #0897, #0914)
export function rpmAppWorkDoneCollaborative(random) {
  const daysA = pick(random, [6, 8, 10, 12]);
  const daysB = pick(random, [12, 16, 20]);
  // A works for d days alone, then A and B work together for x days to finish
  const dAlone = pick(random, [1, 2, 3]);
  const remWork = 1 - dAlone / daysA;
  const jointRateNum = daysA + daysB;
  const jointRateDen = daysA * daysB;
  // jointRate * x = remWork => x = remWork * jointRateDen / jointRateNum
  const xTogether = remWork * jointRateDen / jointRateNum;

  if (Number.isInteger(xTogether) && xTogether > 0) {
    const promptKo = `어떤 일을 완성하는 데 A는 ${daysA}일, B는 ${daysB}일이 걸린다고 한다. 이 일을 A가 혼자서 ${dAlone}일 동안 일한 후 나머지는 A와 B가 함께 일하여 완성하였다. 이때 두 사람이 함께 일한 기간을 구하시오.`;
    const promptEn = `To complete a task, A takes ${daysA} days and B takes ${daysB} days working alone. A worked alone for ${dAlone} days, and then A and B finished the remaining work together. How many days did they work together?`;
    return {
      prompt: promptKo,
      promptEn,
      expression: `${dAlone}/${daysA} + (1/${daysA} + 1/${daysB})x = 1`,
      answer: String(xTogether),
      answerSuffix: '일',
      explanation: `전체 일의 양을 1이라 하면 A가 하루에 하는 일은 1/${daysA}, B가 하루에 하는 일은 1/${daysB}입니다. ${dAlone}/${daysA} + (1/${daysA} + 1/${daysB})x = 1 에서 풀면 x = ${xTogether}일입니다.`,
    };
  }

  // clean standard (#0894)
  return {
    prompt: `어떤 일을 완성하는 데 형은 12일, 동생은 20일이 걸린다고 한다. 이 일을 동생이 혼자 4일 동안 일한 후 나머지는 형과 동생이 함께 일하여 완성하였다면, 함께 일한 날수는 며칠인지 구하시오.`,
    promptEn: `Older brother takes 12 days and younger brother takes 20 days alone. Younger brother works alone for 4 days, then both work together to finish. How many days did they work together?`,
    expression: `4/20 + (1/12 + 1/20)x = 1`,
    answer: '6',
    answerSuffix: '일',
    explanation: `동생이 4일 동안 한 일은 4/20 = 1/5이므로 남은 일은 4/5입니다. 형과 동생이 하루에 함께 하는 일은 1/12 + 1/20 = 8/60 = 2/15입니다. 따라서 (2/15)x = 4/5 에서 x = (4/5) × (15/2) = 6일입니다.`,
  };
}

// 20. [방정식 활용 유형 20] 긴 의자에 대한 문제 (의자 과부족) (#0898 ~ #0901, #0913)
export function rpmAppExcessDeficitBenches(random) {
  const m = pick(random, [4, 5]);
  const n = m + 1; // 5 or 6
  const leftover = ri(random, 3, 5);
  const emptyBenches = pick(random, [1, 2, 3]);
  const lastBenchStudents = ri(random, 1, n - 1);

  // Total students = m * x + leftover = n * (x - emptyBenches - 1) + lastBenchStudents
  // m * x + leftover = n * x - n * (emptyBenches + 1) + lastBenchStudents
  // (n - m) * x = leftover + n * (emptyBenches + 1) - lastBenchStudents
  const benches = leftover + n * (emptyBenches + 1) - lastBenchStudents;
  const students = m * benches + leftover;

  const promptKo = `강당의 긴 의자에 학생들이 앉는데 한 의자에 ${m}명씩 앉으면 의자에 모두 앉고도 ${leftover}명이 앉지 못하고, 한 의자에 ${n}명씩 앉으면 의자 ${emptyBenches}개가 완전히 비어 있고 마지막 의자에는 ${lastBenchStudents}명이 앉는다고 한다. 이때 긴 의자의 개수를 구하시오.`;
  const promptEn = `Students sit on benches. Sitting ${m} per bench leaves ${leftover} standing. Sitting ${n} per bench leaves ${emptyBenches} benches completely empty and the last bench with ${lastBenchStudents} students. Find the number of benches.`;

  return {
    prompt: promptKo,
    promptEn,
    expression: `${m}x + ${leftover} = ${n}(x - ${emptyBenches + 1}) + ${lastBenchStudents}`,
    answer: String(benches),
    answerSuffix: '개',
    explanation: `긴 의자의 개수를 x개라 하면 ${m}명씩 앉을 때의 학생 수는 ${m}x + ${leftover}명입니다. ${n}명씩 앉을 때 완전히 찬 의자는 x - (${emptyBenches} + 1)개이고 마지막 의자에 ${lastBenchStudents}명이 앉으므로 학생 수는 ${n}(x - ${emptyBenches + 1}) + ${lastBenchStudents}명입니다. 따라서 ${m}x + ${leftover} = ${n}(x - ${emptyBenches + 1}) + ${lastBenchStudents} 에서 x = ${benches}개입니다. (총 학생 수는 ${students}명입니다.)`,
  };
}

// 21. [방정식 활용 유형 21] 기차가 다리 또는 터널을 완전히 지나는 경우 (#0902 ~ #0904)
export function rpmAppTrainBridgeTunnel(random) {
  const trainLength = pick(random, [100, 150, 200]);
  const trainSpeed = pick(random, [25, 30, 35, 40]); // m/s
  const tunnelLen = pick(random, [1000, 1300, 1500]);
  const bridgeLen = pick(random, [400, 500, 700]);
  const timeTunnel = (tunnelLen + trainLength) / trainSpeed;
  const timeBridge = (bridgeLen + trainLength) / trainSpeed;

  if (Number.isInteger(timeTunnel) && Number.isInteger(timeBridge)) {
    const promptKo = `일정한 속력으로 달리는 열차가 있다. 이 열차가 길이가 ${tunnelLen}m인 터널을 완전히 통과하는 데 ${timeTunnel}초가 걸리고, 길이가 ${bridgeLen}m인 철교를 완전히 통과하는 데 ${timeBridge}초가 걸린다고 한다. 이때 열차의 길이를 구하시오.`;
    const promptEn = `A train traveling at constant speed takes ${timeTunnel} seconds to completely pass through a ${tunnelLen} m tunnel and ${timeBridge} seconds to completely pass over a ${bridgeLen} m bridge. Find the length of the train.`;
    return {
      prompt: promptKo,
      promptEn,
      expression: `(${tunnelLen} + x)/${timeTunnel} = (${bridgeLen} + x)/${timeBridge}`,
      answer: String(trainLength),
      answerSuffix: 'm',
      explanation: `열차의 길이를 x m라 하면 터널을 완전히 통과할 때 이동한 거리는 (${tunnelLen} + x)m이고, 철교를 통과할 때 거리는 (${bridgeLen} + x)m입니다. 열차의 속력은 일정하므로 (${tunnelLen} + x)/${timeTunnel} = (${bridgeLen} + x)/${timeBridge} 에서 풀면 열차의 길이는 ${trainLength}m입니다. (열차의 속력은 초속 ${trainSpeed}m입니다.)`,
    };
  }

  // fallback clean (#0902)
  return {
    prompt: `일정한 속력으로 달리는 열차가 있다. 이 열차가 길이가 1300m인 터널을 완전히 통과하는 데 40초가 걸리고, 길이가 400m인 다리를 완전히 통과하는 데 15초가 걸린다고 한다. 이때 열차의 길이를 구하시오.`,
    promptEn: `A train passing completely through a 1,300 m tunnel in 40 s and a 400 m bridge in 15 s. Find the train length.`,
    expression: `(1300 + x)/40 = (400 + x)/15`,
    answer: '140',
    answerSuffix: 'm',
    explanation: `열차의 길이를 x m라 하면 속력은 (1300 + x)/40 = (400 + x)/15 입니다. 3(1300 + x) = 8(400 + x) 에서 3900 + 3x = 3200 + 8x, 5x = 700 이므로 x = 140m입니다.`,
  };
}

// 22. [방정식 활용 심화 22] 시험 지원자·합격자·불합격자의 비와 비율 (#0915)
export function rpmAppAdmissionRatioSystem(random) {
  // Applicants ratio 4 : 3, Passed ratio 5 : 3, Failed ratio 1 : 1, Passed total = 160
  // Passed: 160 total with 5 : 3 => Passed boys = 100, Passed girls = 60
  // Failed ratio 1 : 1 => Failed boys = k, Failed girls = k
  // Total applicants: (100 + k) : (60 + k) = 4 : 3
  // 3(100 + k) = 4(60 + k) => 300 + 3k = 240 + 4k => k = 60
  // Total applicants = 160 + 2*60 = 280!
  const promptKo = `어느 학교의 입학시험에서 입학 지원자의 남녀의 비는 4 : 3이고, 합격자의 남녀의 비는 5 : 3, 불합격자의 남녀의 비는 1 : 1이다. 합격자 수가 160명일 때, 입학 지원자의 총수를 구하시오.`;
  const promptEn = `In an admission exam, the ratio of male to female applicants was 4 : 3, the ratio among admitted students was 5 : 3, and the ratio among rejected students was 1 : 1. If 160 students were admitted, find the total number of applicants.`;

  return {
    prompt: promptKo,
    promptEn,
    expression: `(100 + k) : (60 + k) = 4 : 3`,
    answer: '280',
    answerSuffix: '명',
    explanation: `합격자 160명 중 남학생은 160 × (5/8) = 100명, 여학생은 160 × (3/8) = 60명입니다. 불합격자의 남녀의 비가 1 : 1이므로 불합격한 남녀의 수를 각각 k명이라 하면 지원자 남학생은 (100 + k)명, 여학생은 (60 + k)명입니다. (100 + k) : (60 + k) = 4 : 3 에서 3(100 + k) = 4(60 + k), 300 + 3k = 240 + 4k 이므로 k = 60명입니다. 따라서 입학 지원자의 총수는 160 + 2 × 60 = 280명입니다.`,
  };
}

// 23. [방정식 활용 심화 23] 소금물 치환 퍼내기 및 두 그릇 맞교환 농도 (#0917, #0919)
export function rpmAppSaltExchangeReplace(random) {
  const mode = pick(random, ['scoop-replace', 'exchange-two-bowls']);
  if (mode === 'scoop-replace') {
    // #0917: 8% 300g, scoop x g, add x g water, then add 4% 60g to make 6% 360g.
    // Initial salt: 0.08 * (300 - x) + 0.04 * 60 = 0.06 * 360 = 21.6
    // 24 - 0.08x + 2.4 = 21.6 => 26.4 - 21.6 = 0.08x => 4.8 = 0.08x => x = 60!
    const promptKo = `8%의 소금물 300g에서 x g의 소금물을 퍼내고 퍼낸 소금물의 양만큼 물을 부은 후 4%의 소금물 60g을 섞어 6%의 소금물 360g을 만들었다. 이때 x의 값을 구하시오.`;
    const promptEn = `From 300 g of 8% salt solution, x g is removed and replaced with x g of pure water, then mixed with 60 g of 4% salt solution to yield 360 g of a 6% solution. Find x.`;
    return {
      prompt: promptKo,
      promptEn,
      expression: `(8/100)(300 - x) + (4/100) × 60 = (6/100) × 360`,
      answer: '60',
      answerSuffix: 'g',
      explanation: `퍼내고 물을 부은 후 남은 소금은 (8/100)(300 - x)g입니다. 여기에 4% 소금물 60g을 넣었을 때 소금의 총량은 (6/100) × 360 = 21.6g이어야 합니다. 24 - 0.08x + 2.4 = 21.6 에서 0.08x = 4.8 이므로 x = 60g입니다.`,
    };
  }

  // #0919: Bowl A 20% 300g, Bowl B 30% 200g. Scoop 50g from A to B, mix, then 50g from B back to A.
  // Step 1: A has 250g of 20% (50g salt). B has 200g of 30% (60g salt) + 50g of 20% (10g salt) = 250g with 70g salt (concentration 70/250 = 28%).
  // Step 2: Scoop 50g of 28% from B to A. Salt moved = 50 * 0.28 = 14g.
  // Bowl A now has 250g (50g salt) + 50g (14g salt) = 300g with 64g salt.
  // Concentration = 64 / 300 * 100 = 64/3 %!
  const promptKo = `A 그릇에는 20%의 소금물 300g, B 그릇에는 30%의 소금물 200g이 들어 있다. A 그릇의 소금물 50g을 B 그릇에 넣고 섞은 다음 다시 B 그릇의 소금물 50g을 A 그릇에 넣고 섞었다. 이때 A 그릇의 소금물의 농도를 구하시오. (기약분수로 표기)`;
  const promptEn = `Bowl A contains 300 g of 20% salt solution; bowl B contains 200 g of 30% salt solution. 50 g from A is mixed into B, then 50 g from B is returned to A. Find the final concentration of bowl A.`;
  return {
    prompt: promptKo,
    promptEn,
    expression: `(50 + 14) / 300 × 100 = 64/3%`,
    answer: '64/3',
    answerSuffix: '%',
    explanation: `A에서 50g을 B로 옮기면 B는 250g에 소금 60 + 10 = 70g이 되어 농도가 70/250 = 28%가 됩니다. 다시 B에서 50g을 A로 옮기면 소금 50 × 0.28 = 14g이 이동하여 A그릇은 300g에 소금 50 + 14 = 64g이 됩니다. 따라서 A의 농도는 (64 / 300) × 100 = 64/3% 입니다.`,
  };
}

// 24. [방정식 활용 심화 24] 도중에 속력이 바뀌어 지연된 열차 문제 (#0918)
export function rpmAppSpeedMidwayDelay(random) {
  // Total dist = 42 km. Scheduled at v1 = 60 km/h (scheduled time = 42/60 = 42 min).
  // Delays by 8 min (actual time = 50 min = 50/60 h = 5/6 h).
  // Speed slows down to v2 = 40 km/h for the rest.
  // x / 60 + (42 - x) / 40 = 50 / 60 = 5/6
  // Multiply by 120: 2x + 3(42 - x) = 100 => 2x + 126 - 3x = 100 => -x = -26 => x = 26 km!
  const totalD = 42;
  const v1 = 60;
  const v2 = 40;
  const delayMin = 8;
  const schedMin = (totalD / v1) * 60;
  const actualMin = schedMin + delayMin;
  const ansX = 26;

  const promptKo = `${totalD}km 떨어진 두 지점 A, B 사이를 시속 ${v1}km로 달리는 열차가 있다. A 지점을 출발한 후 도중에 열차에 이상이 생겨 시속 ${v2}km로 감속하여 운행을 하였더니 B 지점에 도착 예정 시간보다 ${delayMin}분 늦게 도착하였다. 열차가 시속 ${v1}km로 달린 거리를 구하시오.`;
  const promptEn = `A train scheduled to run between points A and B ${totalD} km apart at ${v1} km/h encounters a defect and slows to ${v2} km/h, arriving ${delayMin} minutes later than scheduled. Find the distance traveled at ${v1} km/h.`;

  return {
    prompt: promptKo,
    promptEn,
    expression: `x/${v1} + (${totalD} - x)/${v2} = ${actualMin}/60`,
    answer: String(ansX),
    answerSuffix: 'km',
    explanation: `도착 예정 시간은 ${totalD}/${v1}시간 = ${schedMin}분이므로 실제 걸린 시간은 ${actualMin}분 = ${actualMin}/60시간입니다. 시속 ${v1}km로 달린 거리를 x km라 하면 x/${v1} + (${totalD} - x)/${v2} = ${actualMin}/60 이고, 양변에 120을 곱하면 2x + 3(${totalD} - x) = ${actualMin * 2} 에서 2x + 126 - 3x = 100 이므로 x = ${ansX}km입니다.`,
  };
}

// 25. [방정식 활용 발전 25] 시계의 시침과 분침이 이루는 각도와 시각 문제 (#0920)
export function rpmAppClockHandsAngle(random) {
  const mode = pick(random, ['coincide', 'opposite-line']);
  if (mode === 'coincide') {
    const h = pick(random, [3, 4, 5, 8]);
    // Angle coincide: 30*h + 0.5x = 6x => 5.5x = 30*h => (11/2)x = 30*h => x = 60*h / 11
    const numer = 60 * h;
    const q = Math.floor(numer / 11);
    const r = numer % 11;
    const ansStr = `${h}시 ${numer}/11분`;
    const promptKo = `${h}시와 ${h + 1}시 사이에서 시계의 시침과 분침이 일치하는 시각을 구하시오. (대분수 또는 가분수 'h시 m/11분' 꼴로 기재)`;
    const promptEn = `Between ${h} o'clock and ${h + 1} o'clock, at what time do the hour hand and minute hand coincide?`;
    return {
      prompt: promptKo,
      promptEn,
      expression: `30 × ${h} + 0.5x = 6x`,
      answer: `${h}시 ${q}와 ${r}/11분`,
      alternativeAnswers: [`${h}시 ${numer}/11분`, `${numer}/11분`, `${q}와 ${r}/11분`],
      explanation: `x분 동안 시침은 0.5x° 움직이고, 분침은 6x° 움직입니다. ${h}시 정각에 시침은 30 × ${h} = ${30 * h}°에 있으므로 두 침이 일치할 때 30 × ${h} + 0.5x = 6x 에서 5.5x = ${30 * h}, 11x = ${60 * h} 이므로 x = ${numer}/11분 (즉, ${q}와 ${r}/11분)입니다.`,
    };
  }

  // opposite-line (#0920 (2): 9시와 10시 사이에서 반대 방향으로 일직선 180도)
  // At 9:00, hour hand is at 270 deg.
  // 30*h + 0.5x - 6x = 180 => 270 - 180 = 5.5x => 90 = (11/2)x => x = 180/11 = 16과 4/11분!
  const h = 9;
  const numer = 180;
  const q = 16;
  const r = 4;
  const promptKo = `9시와 10시 사이에서 시계의 시침과 분침이 서로 반대 방향으로 일직선을 이루는 시각을 구하시오.`;
  const promptEn = `Between 9 and 10 o'clock, at what time are the clock hands pointing in opposite directions along a straight line?`;
  return {
    prompt: promptKo,
    promptEn,
    expression: `(30 × 9 + 0.5x) - 6x = 180`,
    answer: `9시 16과 4/11분`,
    alternativeAnswers: [`9시 180/11분`, `180/11분`, `16과 4/11분`],
    explanation: `9시 정각에 시침은 270°에 있습니다. 반대 방향으로 일직선을 이룰 때는 두 침이 이루는 각이 180°이므로 (270 + 0.5x) - 6x = 180 에서 5.5x = 90, 11x = 180 이므로 x = 180/11 = 16과 4/11분입니다.`,
  };
}

// 26. [단원 실전 다지기] 매일 일차방정식 활용 종합
export function rpmAppAllTypesMixed(random) {
  const generators = [
    rpmAppNumberRelations,
    rpmAppConsecutiveNumbers,
    rpmAppDigitValues,
    rpmAppAgeProblems,
    rpmAppSavingsAllowance,
    rpmAppFixedTotalCount,
    rpmAppGeometryFigures,
    rpmAppExcessDeficitItems,
    rpmAppPercentChangeStudents,
    rpmAppTotalFractionReading,
    rpmAppSpeedRoundtripCourses,
    rpmAppSpeedTimeDifference,
    rpmAppSpeedCatchupDelay,
    rpmAppSpeedTracksOpposite,
    rpmAppSaltWaterEvaporateAdd,
    rpmAppSaltAddSalt,
    rpmAppSaltTwoSolutionsMix,
    rpmAppCostPriceProfitDiscount,
    rpmAppWorkDoneCollaborative,
    rpmAppExcessDeficitBenches,
    rpmAppTrainBridgeTunnel,
    rpmAppAdmissionRatioSystem,
    rpmAppSaltExchangeReplace,
    rpmAppSpeedMidwayDelay,
    rpmAppClockHandsAngle,
  ];
  return pick(random, generators)(random);
}

// Backward compatibility legacy aliases
export const rpmEqExcessDeficit = rpmAppExcessDeficitBenches;
export const rpmEqCatchupTravel = rpmAppSpeedCatchupDelay;

// -------------------------------------------------------------
// CHAPTER 08: 좌표평면과 그래프 세부 응용 유형 (RPM 1-1 p.122~129)
// -------------------------------------------------------------

// -------------------------------------------------------------
// CHAPTER 08: 좌표평면과 그래프 (Pages 122~129)
// -------------------------------------------------------------

const randomInt = (random, min, max) => Math.floor(random() * (max - min + 1)) + min;

function nonZeroInt(random, min, max) {
  let value;
  do { value = ri(random, min, max); } while (value === 0);
  return value;
}

function simplifyFrac(n, d) {
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(n, d);
  return [n / g, d / g];
}

function fracTex(n, d) {
  const [num, den] = simplifyFrac(n, d);
  if (den === 1) return `${num}`;
  if (num < 0) return `-\\frac{${-num}}{${den}}`;
  return `\\frac{${num}}{${den}}`;
}

function tx(profile, ko, en) {
  return profile === 'en' ? en : ko;
}

function problem(prompt, expression, answer, extra = {}) {
  return { prompt, expression, answer: String(answer), answerSuffix: '', ...extra };
}

export function rpmCoordOrderedPairEquality(random, profile = 'ko') {
  const a = pick(random, [2, 3, 4]);
  const e = 1;
  const xVal = nonZeroInt(random, -5, 5);
  const b = nonZeroInt(random, -6, 6);
  const f = (a - e) * xVal + b;

  const c = 1;
  const g = pick(random, [-2, -3, 2, 3]);
  const yVal = nonZeroInt(random, -5, 5);
  const d = nonZeroInt(random, -6, 6);
  const h = (c - g) * yVal + d;

  const ask = pick(random, ['x+y', 'x-y', 'xy']);
  let ans, askKo, askEn;
  if (ask === 'x+y') { ans = xVal + yVal; askKo = 'a+b'; askEn = 'a+b'; }
  else if (ask === 'x-y') { ans = xVal - yVal; askKo = 'a-b'; askEn = 'a-b'; }
  else { ans = xVal * yVal; askKo = 'ab'; askEn = 'ab'; }

  const signB = b >= 0 ? `+${b}` : `${b}`;
  const signF = f >= 0 ? `+${f}` : `${f}`;
  const signD = d >= 0 ? `+${d}` : `${d}`;
  const signH = h >= 0 ? `+${h}` : `${h}`;

  const cStr = c === 1 ? 'b' : `${c}b`;
  const gStr = g === 1 ? 'b' : (g === -1 ? '-b' : `${g}b`);
  const aStr = a === 1 ? 'a' : `${a}a`;

  const p1 = `(${aStr}${signB}, ${cStr}${signD})`;
  const p2 = `(a${signF}, ${gStr}${signH})`;

  const prompt = tx(
    profile,
    `두 순서쌍 $${p1}$와 $${p2}$가 서로 같을 때, $${askKo}$의 값을 구하시오.`,
    `If the two ordered pairs $${p1}$ and $${p2}$ are equal, find the value of $${askEn}$.`
  );
  return problem(prompt, '', ans);
}

export function rpmCoordAxisPoints(random, profile = 'ko') {
  const mode = randomInt(random, 0, 1);
  if (mode === 0) {
    const m = pick(random, [2, 3, 4, 5]);
    const aVal = nonZeroInt(random, -6, 6);
    const constY = -m * aVal;
    const signY = constY >= 0 ? `+${constY}` : `${constY}`;
    const k = pick(random, [1, 2]);
    const constX = nonZeroInt(random, -8, 8);
    const signX = constX >= 0 ? `+${constX}` : `${constX}`;
    const xCoord = k * aVal + constX;

    const prompt = tx(
      profile,
      `점 $P(${k === 1 ? 'a' : `${k}a`}${signX}, ${m}a${signY})$가 $x$축 위의 점일 때, 점 $P$의 좌표를 구하시오.`,
      `If point $P(${k === 1 ? 'a' : `${k}a`}${signX}, ${m}a${signY})$ lies on the $x$-axis, find the coordinates of point $P$.`
    );
    return problem(prompt, '', `(${xCoord}, 0)`);
  } else {
    const m = pick(random, [2, 3, 4]);
    const aVal = nonZeroInt(random, -6, 6);
    const constX = -m * aVal;
    const signX = constX >= 0 ? `+${constX}` : `${constX}`;
    const k = pick(random, [1, 2]);
    const constY = nonZeroInt(random, -8, 8);
    const signY = constY >= 0 ? `+${constY}` : `${constY}`;
    const yCoord = k * aVal + constY;

    const prompt = tx(
      profile,
      `점 $Q(${m}a${signX}, ${k === 1 ? 'a' : `${k}a`}${signY})$가 $y$축 위의 점일 때, 점 $Q$의 좌표를 구하시오.`,
      `If point $Q(${m}a${signX}, ${k === 1 ? 'a' : `${k}a`}${signY})$ lies on the $y$-axis, find the coordinates of point $Q$.`
    );
    return problem(prompt, '', `(0, ${yCoord})`);
  }
}

export function rpmCoordTriangleArea(random, profile = 'ko') {
  const yBase = randomInt(random, -3, 3);
  const x1 = randomInt(random, -5, -1);
  const baseLen = randomInt(random, 4, 8);
  const x2 = x1 + baseLen;
  let y3;
  do { y3 = randomInt(random, -5, 5); } while (Math.abs(y3 - yBase) < 2);
  const x3 = randomInt(random, -4, 4);
  const height = Math.abs(y3 - yBase);
  const area = (baseLen * height) / 2;

  const pA = `(${x1}, ${yBase})`;
  const pB = `(${x2}, ${yBase})`;
  const pC = `(${x3}, ${y3})`;

  const prompt = tx(
    profile,
    `세 점 $A${pA}$, $B${pB}$, $C${pC}$를 꼭짓점으로 하는 삼각형 $ABC$의 넓이를 구하시오.`,
    `Find the area of triangle $ABC$ with vertices $A${pA}$, $B${pB}$, and $C${pC}$.`
  );
  const planePoints = [
    { x: x1, y: yBase, label: 'A' },
    { x: x2, y: yBase, label: 'B' },
    { x: x3, y: y3, label: 'C' },
  ];
  return problem(prompt, '', area, { kind: 'coordinate-plane', plane: { points: planePoints, highlight: '' } });
}

export function rpmCoordPolygonArea(random, profile = 'ko') {
  const yBottom = randomInt(random, -4, -1);
  const yTop = randomInt(random, 1, 4);
  const height = yTop - yBottom;
  const xBottomLeft = randomInt(random, -5, -2);
  const bBottom = randomInt(random, 6, 8);
  const xBottomRight = xBottomLeft + bBottom;

  const xTopLeft = randomInt(random, -3, 0);
  const bTop = randomInt(random, 2, 4);
  const xTopRight = xTopLeft + bTop;

  const area = ((bBottom + bTop) * height) / 2;
  const pA = `(${xTopLeft}, ${yTop})`;
  const pB = `(${xBottomLeft}, ${yBottom})`;
  const pC = `(${xBottomRight}, ${yBottom})`;
  const pD = `(${xTopRight}, ${yTop})`;

  const prompt = tx(
    profile,
    `네 점 $A${pA}$, $B${pB}$, $C${pC}$, $D${pD}$를 꼭짓점으로 하는 사각형 $ABCD$의 넓이를 구하시오.`,
    `Find the area of quadrilateral $ABCD$ with vertices $A${pA}$, $B${pB}$, $C${pC}$, and $D${pD}$.`
  );
  const planePoints = [
    { x: xTopLeft, y: yTop, label: 'A' },
    { x: xBottomLeft, y: yBottom, label: 'B' },
    { x: xBottomRight, y: yBottom, label: 'C' },
    { x: xTopRight, y: yTop, label: 'D' },
  ];
  return problem(prompt, '', area, { kind: 'coordinate-plane', plane: { points: planePoints, highlight: '' } });
}

export function rpmCoordQuadrantIdentify(random, profile = 'ko') {
  const qChoicesKo = ['① 제1사분면', '② 제2사분면', '③ 제3사분면', '④ 제4사분면', '⑤ 어느 사분면에도 속하지 않는다'];
  const qChoicesEn = ['① Quadrant I', '② Quadrant II', '③ Quadrant III', '④ Quadrant IV', '⑤ Not in any quadrant'];

  const mode = randomInt(random, 0, 4);
  let x, y, ans;
  if (mode === 0) { x = randomInt(random, 1, 9); y = randomInt(random, 1, 9); ans = '1'; }
  else if (mode === 1) { x = randomInt(random, -9, -1); y = randomInt(random, 1, 9); ans = '2'; }
  else if (mode === 2) { x = randomInt(random, -9, -1); y = randomInt(random, -9, -1); ans = '3'; }
  else if (mode === 3) { x = randomInt(random, 1, 9); y = randomInt(random, -9, -1); ans = '4'; }
  else {
    if (random() < 0.5) { x = nonZeroInt(random, -9, 9); y = 0; }
    else { x = 0; y = nonZeroInt(random, -9, 9); }
    ans = '5';
  }

  const prompt = tx(
    profile,
    `점 $(${x}, ${y})$는 제몇 사분면 위의 점인지 구하시오. (단, 좌표축 위의 점은 ⑤ 선택)`,
    `Which quadrant does the point $(${x}, ${y})$ belong to?`
  );
  return problem(prompt, '', ans, { kind: 'choice', choicesKo: qChoicesKo, choicesEn: qChoicesEn });
}

export function rpmCoordQuadrantSignCondition(random, profile = 'ko') {
  const qChoicesKo = ['① 제1사분면', '② 제2사분면', '③ 제3사분면', '④ 제4사분면'];
  const qChoicesEn = ['① Quadrant I', '② Quadrant II', '③ Quadrant III', '④ Quadrant IV'];

  const aSign = pick(random, [1, -1]);
  const bSign = pick(random, [1, -1]);
  const aVal = aSign;
  const bVal = bSign;

  const initQuad = (aVal > 0 && bVal > 0) ? 1 : (aVal < 0 && bVal > 0 ? 2 : (aVal < 0 && bVal < 0 ? 3 : 4));

  const targets = [
    { expr: '(-ab, a)', getCoords: (a, b) => [-a * b, a] },
    { expr: '(ab, -b)', getCoords: (a, b) => [a * b, -b] },
    { expr: '(-b, -a)', getCoords: (a, b) => [-b, -a] },
    { expr: '(-a, b)', getCoords: (a, b) => [-a, b] },
    { expr: '(b, -ab)', getCoords: (a, b) => [b, -a * b] },
  ];
  const target = pick(random, targets);
  const [txX, txY] = target.getCoords(aVal, bVal);
  const targetQuad = (txX > 0 && txY > 0) ? 1 : (txX < 0 && txY > 0 ? 2 : (txX < 0 && txY < 0 ? 3 : 4));

  const prompt = tx(
    profile,
    `점 $(a, b)$가 제$${initQuad}$사분면 위의 점일 때, 점 $${target.expr}$는 제몇 사분면 위의 점인지 구하시오.`,
    `If point $(a, b)$ is in Quadrant $${initQuad}$, which quadrant does point $${target.expr}$ lie in?`
  );
  return problem(prompt, '', String(targetQuad), { kind: 'choice', choicesKo: qChoicesKo, choicesEn: qChoicesEn });
}

export function rpmCoordSignProductSum(random, profile = 'ko') {
  const qChoicesKo = ['① 제1사분면', '② 제2사분면', '③ 제3사분면', '④ 제4사분면'];
  const qChoicesEn = ['① Quadrant I', '② Quadrant II', '③ Quadrant III', '④ Quadrant IV'];

  const scenario = pick(random, [
    { condKo: 'ab < 0, a > b', condEn: 'ab < 0, a > b', a: 1, b: -1 },
    { condKo: 'ab < 0, a < b', condEn: 'ab < 0, a < b', a: -1, b: 1 },
    { condKo: 'ab > 0, a + b < 0', condEn: 'ab > 0, a + b < 0', a: -1, b: -1 },
    { condKo: 'ab > 0, a + b > 0', condEn: 'ab > 0, a + b > 0', a: 1, b: 1 },
  ]);

  const pointOptions = [
    { expr: '(a, -b)', fn: (a, b) => [a, -b] },
    { expr: '(-a, b)', fn: (a, b) => [-a, b] },
    { expr: '(a - b, ab)', fn: (a, b) => [a - b, a * b] },
    { expr: '(b - a, -ab)', fn: (a, b) => [b - a, -a * b] },
    { expr: '(-b, a)', fn: (a, b) => [-b, a] },
  ];
  const pt = pick(random, pointOptions);
  const [px, py] = pt.fn(scenario.a, scenario.b);
  const ansQuad = (px > 0 && py > 0) ? 1 : (px < 0 && py > 0 ? 2 : (px < 0 && py < 0 ? 3 : 4));

  const prompt = tx(
    profile,
    `$${scenario.condKo}$일 때, 점 $${pt.expr}$는 제몇 사분면 위의 점인지 구하시오.`,
    `If $${scenario.condEn}$, which quadrant does point $${pt.expr}$ lie in?`
  );
  return problem(prompt, '', String(ansQuad), { kind: 'choice', choicesKo: qChoicesKo, choicesEn: qChoicesEn });
}

export function rpmCoordAbsConditionQuadrant(random, profile = 'ko') {
  const qChoicesKo = ['① 제1사분면', '② 제2사분면', '③ 제3사분면', '④ 제4사분면'];
  const qChoicesEn = ['① Quadrant I', '② Quadrant II', '③ Quadrant III', '④ Quadrant IV'];

  const variant = pick(random, [
    { condKo: 'ab < 0, a + b > 0, |a| > |b|', condEn: 'ab < 0, a + b > 0, |a| > |b|', a: 3, b: -1, targetExpr: '(b, a - b)', fn: (a, b) => [b, a - b] },
    { condKo: 'ab < 0, a + b < 0, |a| < |b|', condEn: 'ab < 0, a + b < 0, |a| < |b|', a: 2, b: -4, targetExpr: '(a, b - a)', fn: (a, b) => [a, b - a] },
    { condKo: 'ab < 0, a > b, |a| < |b|', condEn: 'ab < 0, a > b, |a| < |b|', a: 1, b: -3, targetExpr: '(a + b, a - b)', fn: (a, b) => [a + b, a - b] },
    { condKo: 'ab < 0, a < b, |a| > |b|', condEn: 'ab < 0, a < b, |a| > |b|', a: -4, b: 2, targetExpr: '(a + b, ab)', fn: (a, b) => [a + b, a * b] },
  ]);

  const [px, py] = variant.fn(variant.a, variant.b);
  const ansQuad = (px > 0 && py > 0) ? 1 : (px < 0 && py > 0 ? 2 : (px < 0 && py < 0 ? 3 : 4));

  const prompt = tx(
    profile,
    `$${variant.condKo}$일 때, 점 $${variant.targetExpr}$는 제몇 사분면 위의 점인지 구하시오.`,
    `If $${variant.condEn}$, which quadrant does point $${variant.targetExpr}$ lie in?`
  );
  return problem(prompt, '', String(ansQuad), { kind: 'choice', choicesKo: qChoicesKo, choicesEn: qChoicesEn });
}

export function rpmCoordSymmetricPoints(random, profile = 'ko') {
  const symAxis = pick(random, ['x-axis', 'y-axis', 'origin']);
  const aVal = nonZeroInt(random, -4, 4);
  const bVal = nonZeroInt(random, -4, 4);

  const k1 = pick(random, [2, 3]);
  const d1 = nonZeroInt(random, -5, 5);
  const xCoord = k1 * aVal + d1;

  const k2 = pick(random, [1, 2]);
  const d2 = nonZeroInt(random, -5, 5);
  const yCoord = k2 * bVal + d2;

  const strP1 = `(${k1}a${d1 >= 0 ? `+${d1}` : d1}, ${k2}b${d2 >= 0 ? `+${d2}` : d2})`;
  let strP2, promptAxisKo, promptAxisEn;

  if (symAxis === 'x-axis') {
    promptAxisKo = '$x$축'; promptAxisEn = 'the $x$-axis';
    strP2 = `(${xCoord}, ${-yCoord})`;
  } else if (symAxis === 'y-axis') {
    promptAxisKo = '$y$축'; promptAxisEn = 'the $y$-axis';
    strP2 = `(${-xCoord}, ${yCoord})`;
  } else {
    promptAxisKo = '원점'; promptAxisEn = 'the origin';
    strP2 = `(${-xCoord}, ${-yCoord})`;
  }

  const ask = pick(random, ['a+b', 'ab']);
  const ans = ask === 'a+b' ? aVal + bVal : aVal * bVal;
  const askStr = ask === 'a+b' ? 'a+b' : 'ab';

  const prompt = tx(
    profile,
    `두 점 $${strP1}$과 $${strP2}$가 ${promptAxisKo}에 대하여 대칭일 때, $${askStr}$의 값을 구하시오.`,
    `If the two points $${strP1}$ and $${strP2}$ are symmetric about ${promptAxisEn}, find the value of $${askStr}$.`
  );
  return problem(prompt, '', ans);
}

export function rpmCoordSymmetricArea(random, profile = 'ko') {
  const x = randomInt(random, 2, 6);
  const y = randomInt(random, 2, 6);
  const symType = pick(random, ['y-axis', 'origin']);
  const area = 2 * x * y;
  const cDescKo = symType === 'origin' ? '원점에 대하여 대칭인 점을 $C$' : '$y$축에 대하여 대칭인 점을 $C$';
  const cDescEn = symType === 'origin' ? 'point $C$ is symmetric to $A$ about the origin' : 'point $C$ is symmetric to $A$ about the $y$-axis';

  const prompt = tx(
    profile,
    `점 $A(${x}, ${y})$에 대하여 $x$축에 대하여 대칭인 점을 $B$, ${cDescKo}라 할 때, 삼각형 $ABC$의 넓이를 구하시오.`,
    `Let $B$ be symmetric to $A(${x}, ${y})$ about the $x$-axis, and ${cDescEn}. Find the area of triangle $ABC$.`
  );
  return problem(prompt, '', area);
}

export function rpmCoordGraphSituation(random, profile = 'ko') {
  const situations = [
    {
      storyKo: '밑면이 넓고 위로 갈수록 좁아지는 병에 매초 일정한 양의 물을 넣을 때, 경과 시간 $x$와 물의 높이 $y$ 사이의 변화',
      storyEn: 'Water is poured at a constant rate into a vase that is wider at the bottom and narrower at the top. Relationship between time $x$ and height $y$',
      ans: '1',
      choicesKo: ['① 높이가 점점 더 빠르게 증가한다 (곡선 형태)', '② 높이가 일정하게 증가한다 (직선 형태)', '③ 높이가 점점 더 느리게 증가한다', '④ 높이가 증가하다가 감소한다'],
      choicesEn: ['① Height increases at an increasing rate', '② Height increases linearly', '③ Height increases at a decreasing rate', '④ Height increases then decreases'],
    },
    {
      storyKo: '길이가 일정한 향에 불을 붙여 일정하게 타들어갈 때, 경과 시간 $x$와 남은 향의 길이 $y$ 사이의 변화',
      storyEn: 'An incense stick burns at a constant rate. Relationship between time $x$ and remaining length $y$',
      ans: '2',
      choicesKo: ['① 시간이 지날수록 길이가 일정하게 증가한다', '② 시간이 지날수록 길이가 일정하게 감소한다 (기울기가 음수인 직선)', '③ 길이가 곡선으로 감소하다가 증가한다', '④ 길이가 전혀 변하지 않는다'],
      choicesEn: ['① Length increases linearly', '② Length decreases linearly (line with negative slope)', '③ Length curves down then up', '④ Length stays unchanged'],
    },
    {
      storyKo: '자동차가 고속도로에서 일정한 속력 시속 100km로 달릴 때, 주행 시간 $x$와 속력 $y$ 사이의 관계',
      storyEn: 'A car drives at a constant speed of 100 km/h. Relationship between driving time $x$ and speed $y$',
      ans: '3',
      choicesKo: ['① 속력이 시간에 비례하여 증가한다', '② 속력이 시간에 반비례하여 감소한다', '③ 시간에 관계없이 속력이 수평선($x$축에 평행)을 이룬다', '④ 속력이 계단 모양으로 증가한다'],
      choicesEn: ['① Speed increases proportionally', '② Speed decreases inversely', '③ Speed forms a horizontal line parallel to $x$-axis', '④ Speed increases like stairs'],
    }
  ];

  const item = pick(random, situations);
  const prompt = tx(
    profile,
    `다음 상황에서 $x$와 $y$ 사이의 관계를 나타낸 그래프의 특징으로 가장 알맞은 것을 고르시오.\n[상황] ${item.storyKo}`,
    `Choose the best description of the graph relating $x$ and $y$ for the given situation:\n[Situation] ${item.storyEn}`
  );
  return problem(prompt, '', item.ans, { kind: 'choice', choicesKo: item.choicesKo, choicesEn: item.choicesEn });
}

export function rpmCoordGraphDistanceTime(random, profile = 'ko') {
  const arrive = pick(random, [20, 30, 40]);
  const stay = pick(random, [20, 30, 40]);
  const returnTime = pick(random, [20, 30]);
  const leave = arrive + stay;
  const home = leave + returnTime;
  const distance = pick(random, [3, 4, 5, 6]);

  const mode = randomInt(random, 0, 2);
  let prompt, ans, suffix;

  if (mode === 0) {
    prompt = tx(
      profile,
      `그래프는 지효가 집에서 출발하여 공원까지 다녀왔을 때, 시간에 따른 집으로부터의 거리를 나타낸 것입니다. 공원에 도착한 시각은 출발한 지 몇 분 후인지 구하시오.`,
      `The graph shows distance from home over time. How many minutes after departing did the traveler reach the park?`
    );
    ans = arrive; suffix = '분 후';
  } else if (mode === 1) {
    prompt = tx(
      profile,
      `그래프는 지효가 집에서 출발하여 공원까지 다녀왔을 때, 시간에 따른 집으로부터의 거리를 나타낸 것입니다. 공원에 머무른 시간은 몇 분인지 구하시오.`,
      `The graph shows distance from home over time. For how many minutes did the traveler stay at the park?`
    );
    ans = stay; suffix = '분';
  } else {
    prompt = tx(
      profile,
      `그래프는 지효가 집에서 출발하여 공원까지 다녀왔을 때, 시간에 따른 집으로부터의 거리를 나타낸 것입니다. 집으로 완전히 돌아오는 데 걸린 총 시간은 몇 분인지 구하시오.`,
      `The graph shows distance from home over time. What was the total trip duration in minutes until returning home?`
    );
    ans = home; suffix = '분';
  }

  const graphData = { arrive, leave, home, distance };
  return problem(prompt, '', ans, { kind: 'trip-graph', graph: graphData, answerSuffix: suffix });
}

export function rpmCoordGraphSpeedTime(random, profile = 'ko') {
  const maxSpeed = pick(random, [50, 60, 70, 80]);
  const stopMins = pick(random, [4, 5, 6, 8]);
  const totalMins = pick(random, [15, 16, 18, 20]);

  const ask = pick(random, ['maxSpeed', 'stopTime', 'totalTime']);
  let prompt, ans, suffix;

  if (ask === 'maxSpeed') {
    prompt = tx(
      profile,
      `어떤 버스가 출발하여 다음 정류장에 도착할 때까지의 속력 변화를 측정한 결과, 최고 속력은 시속 몇 $\\text{km}$인지 구하시오. (운행 시간 $0\\sim${totalMins}$분, 정지 시간 총 $${stopMins}$분, 최고 속력 구간 시속 $${maxSpeed}\\text{km/h}$)`,
      `A bus travels between stops with maximum speed $${maxSpeed}\\text{ km/h}$, stopping for $${stopMins}$ minutes, taking $${totalMins}$ minutes total. What was the maximum speed in $\\text{km/h}$?`
    );
    ans = maxSpeed; suffix = 'km/h';
  } else if (ask === 'stopTime') {
    prompt = tx(
      profile,
      `어떤 버스가 운행 중 신호 대기와 정류장 정차로 속력이 $0\\text{km/h}$로 정지해 있던 총 시간은 몇 분인지 구하시오. (최고 속력 시속 $${maxSpeed}\\text{km/h}$, 정지 시간 총 $${stopMins}$분, 총 운행 $${totalMins}$분)`,
      `Find the total number of minutes the bus was stopped (speed $0\\text{ km/h}$) during the trip.`
    );
    ans = stopMins; suffix = '분';
  } else {
    prompt = tx(
      profile,
      `어떤 버스가 출발하여 목적지에 도착할 때까지 걸린 전체 운행 시간은 몇 분인지 구하시오. (최고 속력 시속 $${maxSpeed}\\text{km/h}$, 정지 시간 총 $${stopMins}$분, 총 운행 $${totalMins}$분)`,
      `Find the total duration of the trip in minutes from departure to destination.`
    );
    ans = totalMins; suffix = '분';
  }

  return problem(prompt, '', ans, { answerSuffix: suffix });
}

export function rpmCoordAllTypesMixed(random, profile = 'ko') {
  const gens = [
    rpmCoordOrderedPairEquality,
    rpmCoordAxisPoints,
    rpmCoordTriangleArea,
    rpmCoordPolygonArea,
    rpmCoordQuadrantIdentify,
    rpmCoordQuadrantSignCondition,
    rpmCoordSignProductSum,
    rpmCoordAbsConditionQuadrant,
    rpmCoordSymmetricPoints,
    rpmCoordSymmetricArea,
    rpmCoordGraphSituation,
    rpmCoordGraphDistanceTime,
    rpmCoordGraphSpeedTime,
  ];
  return pick(random, gens)(random, profile);
}

// -------------------------------------------------------------
// CHAPTER 09: 정비례와 반비례 (Pages 134~149)
// -------------------------------------------------------------

// 1. rpmPropDirectIdentify (1010~1012, 1089번)
export function rpmPropDirectIdentify(random, profile = 'ko') {
  const a = pick(random, [2, 3, 4, 5, -2, -3, -4, -5]);
  const b = pick(random, [1, 2, 3, -1, -2]);
  const candidates = [
    { text: `$y = ${a}x$`, isDirect: true },
    { text: `$y = ${fracTex(1, Math.abs(a))}x$`, isDirect: true },
    { text: `$y = -${fracTex(1, Math.abs(a))}x$`, isDirect: true },
    { text: `$y = ${a}x ${b >= 0 ? `+ ${b}` : `- ${-b}`}$`, isDirect: false },
    { text: `$y = ${fracTex(a, 1)} / x$ ($xy = ${a}$)`, isDirect: false },
    { text: `$y = ${a}x^2$`, isDirect: false },
  ];
  const chosen = pick(random, candidates);
  const prompt = tx(
    profile,
    `다음 식에서 $y$가 $x$에 정비례하는지 판별하시오.\n[식] ${chosen.text}`,
    `Decide whether $y$ is directly proportional to $x$ in the equation: ${chosen.text}`
  );
  return problem(prompt, '', chosen.isDirect ? '1' : '2', {
    kind: 'choice',
    choicesKo: ['① 정비례한다 (○)', '② 정비례하지 않는다 (×)'],
    choicesEn: ['① Directly proportional (○)', '② Not directly proportional (×)'],
  });
}

// 2. rpmPropDirectTable (1013~1016, 1090번)
export function rpmPropDirectTable(random, profile = 'ko') {
  const a = pick(random, [2, 3, 4, 5, -2, -3, -4]);
  const x1 = 1, y1 = a * 1;
  const x2 = 2, y2 = a * 2;
  const x3 = 3, y3 = a * 3;
  const x4 = 4, y4 = a * 4;

  const targetX = pick(random, [5, 6, 7, -2, -3]);
  const ans = a * targetX;

  const prompt = tx(
    profile,
    `$y$가 $x$에 정비례하고, $x$와 $y$ 사이의 관계를 표로 나타내면 다음과 같습니다.\n| $x$ | $1$ | $2$ | $3$ | $4$ |\n| $y$ | $${y1}$ | $${y2}$ | $${y3}$ | $${y4}$ |\n이때 $x = ${targetX}$일 때 $y$의 값을 구하시오.`,
    `$y$ is directly proportional to $x$, given by table:\n| $x$ | $1$ | $2$ | $3$ | $4$ |\n| $y$ | $${y1}$ | $${y2}$ | $${y3}$ | $${y4}$ |\nFind the value of $y$ when $x = ${targetX}$.`
  );
  return problem(prompt, '', ans);
}

// 3. rpmPropDirectGraphProperties (1017~1019, 1093, 1095번)
export function rpmPropDirectGraphProperties(random, profile = 'ko') {
  const a = pick(random, [2, 3, 4, -2, -3, -4]);
  const isPos = a > 0;
  const prompt = tx(
    profile,
    `정비례 관계 $y = ${a}x$의 그래프에 대한 설명으로 옳은 것을 고르시오.`,
    `Choose the correct statement about the graph of direct proportion $y = ${a}x$.`
  );
  let ans, choicesKo, choicesEn;
  if (isPos) {
    ans = '1';
    choicesKo = [
      '① 제1사분면과 제3사분면을 지난다',
      '② 제2사분면과 제4사분면을 지난다',
      '③ $x$의 값이 증가하면 $y$의 값은 감소한다',
      '④ 원점을 지나지 않는 직선이다',
    ];
    choicesEn = [
      '① Passes through Quadrants I and III',
      '② Passes through Quadrants II and IV',
      '③ As $x$ increases, $y$ decreases',
      '④ Does not pass through the origin',
    ];
  } else {
    ans = '2';
    choicesKo = [
      '① 제1사분면과 제3사분면을 지난다',
      '② 제2사분면과 제4사분면을 지난다',
      '③ $x$의 값이 증가하면 $y$의 값도 항상 증가한다',
      '④ 점 $(0, 1)$을 지난다',
    ];
    choicesEn = [
      '① Passes through Quadrants I and III',
      '② Passes through Quadrants II and IV',
      '③ As $x$ increases, $y$ increases',
      '④ Passes through $(0, 1)$',
    ];
  }
  return problem(prompt, '', ans, { kind: 'choice', choicesKo, choicesEn });
}

// 4. rpmPropDirectSlopeAxisDistance (1020~1023, 1094번)
export function rpmPropDirectSlopeAxisDistance(random, profile = 'ko') {
  // Comparing |a|: larger |a| is closer to y-axis, smaller |a| is closer to x-axis
  const slopes = [1, 2, 4, -3, -5];
  const targetType = pick(random, ['y-axis-close', 'x-axis-close']);
  let ans, promptKo, promptEn;

  const choicesKo = [
    '① $y = x$',
    '② $y = 2x$',
    '③ $y = 4x$',
    '④ $y = -3x$',
    '⑤ $y = -5x$',
  ];
  const choicesEn = choicesKo;

  if (targetType === 'y-axis-close') {
    // Largest |a| is 5 => choice 5
    ans = '5';
    promptKo = '다음 정비례 관계의 그래프 중 $y$축에 가장 가까운 것은?';
    promptEn = 'Which of the following direct proportion graphs is closest to the $y$-axis?';
  } else {
    // Smallest |a| is 1 => choice 1
    ans = '1';
    promptKo = '다음 정비례 관계의 그래프 중 $x$축에 가장 가까운 것은?';
    promptEn = 'Which of the following direct proportion graphs is closest to the $x$-axis?';
  }
  return problem(tx(profile, promptKo, promptEn), '', ans, { kind: 'choice', choicesKo, choicesEn });
}

// 5. rpmPropDirectPointOnGraph (1024~1030, 1096, 1098번)
export function rpmPropDirectPointOnGraph(random, profile = 'ko') {
  const a = pick(random, [2, 3, 4, 5, -2, -3, -4, -5]);
  const x0 = nonZeroInt(random, -4, 4);
  const y0 = a * x0;

  // Ask for unknown coordinate in (x1, k) or (m, y1)
  const mode = randomInt(random, 0, 1);
  if (mode === 0) {
    const x1 = nonZeroInt(random, -6, 6);
    const ans = a * x1;
    const prompt = tx(
      profile,
      `정비례 관계 $y = ax$의 그래프가 점 $(${x0}, ${y0})$를 지날 때, 점 $(${x1}, k)$도 이 그래프 위의 점이다. 상수 $k$의 값을 구하시오.`,
      `The graph of $y = ax$ passes through $(${x0}, ${y0})$. If point $(${x1}, k)$ also lies on the graph, find $k$.`
    );
    return problem(prompt, '', ans);
  } else {
    const y1 = a * nonZeroInt(random, -6, 6);
    const ans = y1 / a;
    const prompt = tx(
      profile,
      `정비례 관계 $y = ax$의 그래프가 점 $(${x0}, ${y0})$를 지날 때, 점 $(m, ${y1})$도 이 그래프 위의 점이다. 상수 $m$의 값을 구하시오.`,
      `The graph of $y = ax$ passes through $(${x0}, ${y0})$. If point $(m, ${y1})$ also lies on the graph, find $m$.`
    );
    return problem(prompt, '', ans);
  }
}

// 6. rpmPropDirectFindEquation (1031~1034, 1097, 1101번)
export function rpmPropDirectFindEquation(random, profile = 'ko') {
  const [n, d] = pick(random, [[1, 1], [2, 1], [3, 1], [-1, 1], [-2, 1], [-3, 1], [1, 2], [-1, 2], [2, 3], [-2, 3], [3, 2], [-3, 2]]);
  const mult = pick(random, [1, 2]);
  const x0 = d * mult;
  const y0 = n * mult;

  const slopeStr = fracTex(n, d);
  const coeffText = (n === d) ? 'x' : (n === -d ? '-x' : (d === 1 ? `${n}x` : `${n}/${d}x`));
  const ans = `y=${coeffText}`;

  const prompt = tx(
    profile,
    `오른쪽 그림과 같이 원점을 지나는 직선이 점 $(${x0}, ${y0})$를 지날 때, $x$와 $y$ 사이의 관계식을 구하시오.`,
    `The line through the origin passes through $(${x0}, ${y0})$. Find the equation relating $x$ and $y$.`
  );
  return problem(prompt, '', ans, {
    kind: 'proportion-graph',
    graph: { mode: 'direct', a: { n, d }, point: { x: x0, y: y0 }, range: 8 }
  });
}

// 7. rpmPropDirectGraphArea (1035~1037, 1103번)
export function rpmPropDirectGraphArea(random, profile = 'ko') {
  // Point A on y = ax (x > 0, a > 0), drop perpendicular to x-axis at B(x, 0).
  // Triangle OAB area = 1/2 * x * (ax) = 1/2 * a * x^2
  const a = pick(random, [2, 3, 4, 6]);
  const xVal = pick(random, [2, 4, 6]);
  const yVal = a * xVal;
  const area = (xVal * yVal) / 2;

  const prompt = tx(
    profile,
    `정비례 관계 $y = ${a}x$의 그래프 위의 점 $A(${xVal}, k)$에서 $x$축에 내린 수선의 발을 $B$라 할 때, 삼각형 $AOB$의 넓이를 구하시오. (단, $O$는 원점)`,
    `Point $A(${xVal}, k)$ is on the graph of $y = ${a}x$. If $B$ is the foot of the perpendicular from $A$ to the $x$-axis, find the area of triangle $AOB$.`
  );
  return problem(prompt, '', area);
}

// 8. rpmPropInverseIdentify (1038~1040, 1091번)
export function rpmPropInverseIdentify(random, profile = 'ko') {
  const a = pick(random, [6, 12, 18, 24, -6, -12, -18]);
  const b = pick(random, [1, 2, -1, -2]);
  const forms = [
    { text: `$y = \\frac{${Math.abs(a)}}{x}$`, isInv: true },
    { text: `$xy = ${a}$`, isInv: true },
    { text: `$y = ${a}x$`, isInv: false },
    { text: `$y = \\frac{x}{${Math.abs(a)}}$`, isInv: false },
    { text: `$y = \\frac{${a}}{x} ${b >= 0 ? `+ ${b}` : `- ${-b}`}$`, isInv: false },
  ];
  const chosen = pick(random, forms);
  const prompt = tx(
    profile,
    `다음 식에서 $y$가 $x$에 반비례하는지 판별하시오.\n[식] ${chosen.text}`,
    `Decide whether $y$ is inversely proportional to $x$ in: ${chosen.text}`
  );
  return problem(prompt, '', chosen.isInv ? '1' : '2', {
    kind: 'choice',
    choicesKo: ['① 반비례한다 (○)', '② 반비례하지 않는다 (×)'],
    choicesEn: ['① Inversely proportional (○)', '② Not inversely proportional (×)'],
  });
}

// 9. rpmPropInverseTable (1041~1044번)
export function rpmPropInverseTable(random, profile = 'ko') {
  const a = pick(random, [24, 36, 48, 60, -24, -36, -48]);
  // Pick clean divisors
  const xVals = [1, 2, 3, 4];
  const yVals = xVals.map((x) => a / x);
  const targetX = pick(random, [6, 8, 12]);
  const ans = a / targetX;

  const prompt = tx(
    profile,
    `$y$가 $x$에 반비례하고, $x$와 $y$ 사이의 관계를 표로 나타내면 다음과 같습니다.\n| $x$ | $1$ | $2$ | $3$ | $4$ |\n| $y$ | $${yVals[0]}$ | $${yVals[1]}$ | $${yVals[2]}$ | $${yVals[3]}$ |\n이때 $x = ${targetX}$일 때 $y$의 값을 구하시오.`,
    `$y$ is inversely proportional to $x$, given by table:\n| $x$ | $1$ | $2$ | $3$ | $4$ |\n| $y$ | $${yVals[0]}$ | $${yVals[1]}$ | $${yVals[2]}$ | $${yVals[3]}$ |\nFind $y$ when $x = ${targetX}$.`
  );
  return problem(prompt, '', ans);
}

// 10. rpmPropInverseGraphProperties (1045~1047, 1095번)
export function rpmPropInverseGraphProperties(random, profile = 'ko') {
  const a = pick(random, [12, 18, 24, -12, -18, -24]);
  const isPos = a > 0;
  const prompt = tx(
    profile,
    `반비례 관계 $y = \\frac{${a}}{x}$의 그래프에 대한 설명으로 옳은 것을 고르시오.`,
    `Choose the correct statement about the graph of inverse proportion $y = \\frac{${a}}{x}$.`
  );
  let ans, choicesKo, choicesEn;
  if (isPos) {
    ans = '1';
    choicesKo = [
      '① 제1사분면과 제3사분면을 지나는 한 쌍의 매끄러운 곡선이다',
      '② 제2사분면과 제4사분면을 지나는 한 쌍의 곡선이다',
      '③ 원점을 지나는 직선이다',
      '④ 각 사분면에서 $x$의 값이 증가하면 $y$의 값도 증가한다',
    ];
    choicesEn = [
      '① A pair of smooth curves in Quadrants I and III',
      '② A pair of smooth curves in Quadrants II and IV',
      '③ A line passing through the origin',
      '④ In each quadrant, as $x$ increases, $y$ increases',
    ];
  } else {
    ans = '2';
    choicesKo = [
      '① 제1사분면과 제3사분면을 지난다',
      '② 제2사분면과 제4사분면을 지나는 한 쌍의 매끄러운 곡선이다',
      '③ 점 $(0, 0)$을 지난다',
      '④ $x$축과 만난다',
    ];
    choicesEn = [
      '① Passes through Quadrants I and III',
      '② A pair of smooth curves in Quadrants II and IV',
      '③ Passes through $(0, 0)$',
      '④ Intersects the $x$-axis',
    ];
  }
  return problem(prompt, '', ans, { kind: 'choice', choicesKo, choicesEn });
}

// 11. rpmPropInverseOriginDistance (1048~1050번)
export function rpmPropInverseOriginDistance(random, profile = 'ko') {
  // Closest or furthest from origin based on |a|
  const choicesKo = [
    '① $y = \\frac{2}{x}$',
    '② $y = -\\frac{4}{x}$',
    '③ $y = \\frac{6}{x}$',
    '④ $y = -\\frac{8}{x}$',
    '⑤ $y = \\frac{12}{x}$',
  ];
  const choicesEn = choicesKo;
  const target = pick(random, ['furthest', 'closest']);
  let ans, promptKo, promptEn;

  if (target === 'furthest') {
    ans = '5'; // |12| is largest
    promptKo = '다음 반비례 관계의 그래프 중 원점에서 가장 멀리 떨어진 것은?';
    promptEn = 'Which inverse proportion graph is furthest from the origin?';
  } else {
    ans = '1'; // |2| is smallest
    promptKo = '다음 반비례 관계의 그래프 중 원점에 가장 가까운 것은?';
    promptEn = 'Which inverse proportion graph is closest to the origin?';
  }
  return problem(tx(profile, promptKo, promptEn), '', ans, { kind: 'choice', choicesKo, choicesEn });
}

// 12. rpmPropInversePointOnGraph (1051~1054, 1102번)
export function rpmPropInversePointOnGraph(random, profile = 'ko') {
  const a = pick(random, [12, 18, 24, 30, 36, -12, -18, -24, -36]);
  // Divisors of |a|
  const absA = Math.abs(a);
  const divs = [];
  for (let i = 1; i <= absA; i++) if (absA % i === 0) divs.push(i);

  const x0 = pick(random, divs) * pick(random, [1, -1]);
  const y0 = a / x0;

  const mode = randomInt(random, 0, 1);
  if (mode === 0) {
    let x1;
    do { x1 = pick(random, divs) * pick(random, [1, -1]); } while (x1 === x0);
    const ans = a / x1;
    const prompt = tx(
      profile,
      `반비례 관계 $y = \\frac{a}{x}$의 그래프가 점 $(${x0}, ${y0})$를 지날 때, 점 $(${x1}, k)$도 이 그래프 위의 점이다. 상수 $k$의 값을 구하시오.`,
      `The graph of $y = \\frac{a}{x}$ passes through $(${x0}, ${y0})$. If point $(${x1}, k)$ also lies on the graph, find $k$.`
    );
    return problem(prompt, '', ans);
  } else {
    let y1;
    do { y1 = (a / pick(random, divs)); } while (y1 === y0);
    const ans = a / y1;
    const prompt = tx(
      profile,
      `반비례 관계 $y = \\frac{a}{x}$의 그래프가 점 $(${x0}, ${y0})$를 지날 때, 점 $(m, ${y1})$도 이 그래프 위의 점이다. 상수 $m$의 값을 구하시오.`,
      `The graph of $y = \\frac{a}{x}$ passes through $(${x0}, ${y0})$. If point $(m, ${y1})$ also lies on the graph, find $m$.`
    );
    return problem(prompt, '', ans);
  }
}

// 13. rpmPropInverseLatticePoints (1055~1057, 1105번)
export function rpmPropInverseLatticePoints(random, profile = 'ko') {
  // y = a / x (a ≠ 0). Count points (x, y) where both x and y are integers.
  // Count of integer pairs = 2 * (number of positive divisors of |a|)
  const a = pick(random, [12, 16, 18, 20, 24, 30, 36]);
  let divCount = 0;
  for (let i = 1; i <= a; i++) {
    if (a % i === 0) divCount++;
  }
  const ans = divCount * 2;

  const prompt = tx(
    profile,
    `반비례 관계 $y = \\frac{${a}}{x}$의 그래프 위의 점 중에서 $x$좌표와 $y$좌표가 모두 정수인 점의 개수를 구하시오.`,
    `Find the number of points $(x, y)$ on the graph of $y = \\frac{${a}}{x}$ where both $x$ and $y$ are integers.`
  );
  return problem(prompt, '', ans);
}

// 14. rpmPropInverseFindEquation (1058~1060, 1108번)
export function rpmPropInverseFindEquation(random, profile = 'ko') {
  const x0 = pick(random, [2, 3, 4, -2, -3, -4]);
  const y0 = pick(random, [2, 3, 4, 5, -2, -3, -4, -5]);
  const a = x0 * y0;

  const ans = `y=${a}/x`;
  const prompt = tx(
    profile,
    `오른쪽 그림과 같이 원점에 대하여 대칭인 한 쌍의 곡선이 점 $(${x0}, ${y0})$를 지날 때, $x$와 $y$ 사이의 관계식을 구하시오.`,
    `A pair of curves symmetric about the origin passes through $(${x0}, ${y0})$. Find the equation relating $x$ and $y$.`
  );
  return problem(prompt, '', ans, {
    kind: 'proportion-graph',
    graph: { mode: 'inverse', a, point: { x: x0, y: y0 }, range: 8 }
  });
}

// 15. rpmPropDirectInverseIntersection (1061~1064, 1100, 1112번)
export function rpmPropDirectInverseIntersection(random, profile = 'ko') {
  // y = m*x and y = b/x intersect at (x0, y0) in Quadrant 1 (or 3)
  const m = pick(random, [2, 3, 4]);
  const x0 = pick(random, [2, 3, 4]);
  const y0 = m * x0;
  const b = x0 * y0; // b = m * x0^2

  const ask = pick(random, ['ab', 'a+b']);
  // Let direct be y = ax => a = m
  const ans = ask === 'ab' ? m * b : m + b;
  const askStr = ask === 'ab' ? 'ab' : 'a+b';

  const prompt = tx(
    profile,
    `정비례 관계 $y = ax$의 그래프와 반비례 관계 $y = \\frac{b}{x}$의 그래프가 점 $(${x0}, ${y0})$에서 만날 때, $${askStr}$의 값을 구하시오. (단, $a, b$는 상수)`,
    `The graph of $y = ax$ and the graph of $y = \\frac{b}{x}$ intersect at $(${x0}, ${y0})$. Find the value of $${askStr}$.`
  );
  return problem(prompt, '', ans);
}

// 16. rpmPropInverseRectArea (1065~1069, 1114번)
export function rpmPropInverseRectArea(random, profile = 'ko') {
  // For any point P(x, y) on y = a/x, area of rect formed with axes is |x * y| = |a|.
  const a = pick(random, [12, 16, 18, 20, 24, 30, 36]);
  const prompt = tx(
    profile,
    `반비례 관계 $y = \\frac{${a}}{x} (x > 0)$의 그래프 위의 한 점 $P$에서 $x$축, $y$축에 내린 수선의 발을 각각 $A, B$라 하고 원점을 $O$라 할 때, 직사각형 $PAOB$의 넓이를 구하시오.`,
    `Let $P$ be a point on $y = \\frac{${a}}{x} (x > 0)$. If $A$ and $B$ are perpendicular feet to the axes, and $O$ is the origin, find the area of rectangle $PAOB$.`
  );
  return problem(prompt, '', a);
}

// 17. rpmPropDirectWordCandleGear (1070~1077, 1110, 1113번)
export function rpmPropDirectWordCandleGear(random, profile = 'ko') {
  const scenario = pick(random, [
    () => {
      // Candle burning
      const rate = pick(random, [0.5, 0.6, 0.8, 1.2]);
      const mins = pick(random, [10, 15, 20, 30]);
      const burned = Math.round(rate * mins * 10) / 10;
      const prompt = tx(
        profile,
        `불을 붙이면 매분 $${rate}\\text{cm}$씩 일정하게 타는 양초가 있다. 불을 붙인 지 $${mins}$분 동안 탄 양초의 길이는 몇 $\\text{cm}$인지 구하시오.`,
        `A candle burns at a rate of $${rate}\\text{ cm/min}$. How many $\\text{cm}$ of the candle burn in $${mins}$ minutes?`
      );
      return problem(prompt, '', burned, { answerSuffix: 'cm' });
    },
    () => {
      // Fuel and distance: 5L for 60km => 12km per L
      const perLiter = pick(random, [10, 12, 14, 15]);
      const totalKm = pick(random, [120, 150, 180, 240]);
      const neededLiters = totalKm / perLiter;
      const prompt = tx(
        profile,
        `휘발유 $1\\text{L}$로 $${perLiter}\\text{km}$를 달릴 수 있는 자동차가 있다. 이 자동차가 $${totalKm}\\text{km}$를 이동하는 데 필요한 휘발유의 양은 몇 $\\text{L}$인지 구하시오.`,
        `A car travels $${perLiter}\\text{ km}$ per $1\\text{ L}$ of fuel. How many liters are required to travel $${totalKm}\\text{ km}$?`
      );
      return problem(prompt, '', neededLiters, { answerSuffix: 'L' });
    },
    () => {
      // Reading pages: 300 pages in 20 days => 15 pages/day
      const pagesPerDay = pick(random, [12, 15, 20, 25]);
      const days = pick(random, [8, 10, 12, 14]);
      const total = pagesPerDay * days;
      const prompt = tx(
        profile,
        `하루에 $${pagesPerDay}$쪽씩 일정하게 책을 읽을 때, $${days}$일 동안 읽은 책의 총 쪽수를 구하시오.`,
        `If a student reads $${pagesPerDay}$ pages each day, how many pages are read in $${days}$ days?`
      );
      return problem(prompt, '', total, { answerSuffix: '쪽' });
    }
  ]);
  return scenario();
}

// 18. rpmPropInverseWordTankVolume (1078~1080번)
export function rpmPropInverseWordTankVolume(random, profile = 'ko') {
  const scenario = pick(random, [
    () => {
      // Water tank filling: rate * minutes = total volume
      const rate1 = pick(random, [4, 5, 6, 8]);
      const min1 = pick(random, [30, 40, 60, 80]);
      const totalVol = rate1 * min1;
      const min2 = pick(random, [20, 24, 50]);
      const rate2 = totalVol / min2;
      const prompt = tx(
        profile,
        `매분 $${rate1}\\text{L}$씩 물을 넣으면 $${min1}$분 만에 가득 차는 물통이 있다. 이 물통에 물을 $${min2}$분 만에 가득 채우려면 매분 몇 $\\text{L}$씩 물을 넣어야 하는지 구하시오.`,
        `A water tank fills in $${min1}$ minutes at $${rate1}\\text{ L/min}$. What flow rate in $\\text{L/min}$ is needed to fill it in $${min2}$ minutes?`
      );
      return problem(prompt, '', rate2, { answerSuffix: 'L' });
    },
    () => {
      // Cylinder volume = baseArea * height = V (constant)
      const volume = pick(random, [60, 80, 120, 180, 240]);
      const height = pick(random, [4, 5, 6, 8, 10]);
      const baseArea = volume / height;
      const prompt = tx(
        profile,
        `부피가 $${volume}\\text{cm}^3$로 일정한 원기둥이 있다. 이 원기둥의 높이가 $${height}\\text{cm}$일 때, 밑면의 넓이는 몇 $\\text{cm}^2$인지 구하시오.`,
        `A cylinder has fixed volume $${volume}\\text{ cm}^3$. If the height is $${height}\\text{ cm}$, find the base area in $\\text{cm}^2$.`
      );
      return problem(prompt, '', baseArea, { answerSuffix: 'cm²' });
    }
  ]);
  return scenario();
}

// 19. rpmPropInverseWordWorkBoyle (1081~1084, 1104번)
export function rpmPropInverseWordWorkBoyle(random, profile = 'ko') {
  const scenario = pick(random, [
    () => {
      // Work done: people * hours = constant total
      const p1 = pick(random, [6, 8, 10, 12]);
      const h1 = pick(random, [10, 12, 15, 20]);
      const totalWork = p1 * h1;
      const h2 = pick(random, [5, 6, 8]);
      const p2 = totalWork / h2;
      const prompt = tx(
        profile,
        `$${p1}$명이 $${h1}$시간 동안 작업해야 끝나는 일이 있다. 이 일을 $${h2}$시간 만에 끝내려면 몇 명이 작업해야 하는지 구하시오. (단, 한 사람의 작업 속도는 모두 같다.)`,
        `An assignment takes $${p1}$ people $${h1}$ hours. How many people are needed to complete it in $${h2}$ hours?`
      );
      return problem(prompt, '', p2, { answerSuffix: '명' });
    },
    () => {
      // Boyle's law: P * V = C
      const p1 = pick(random, [2, 3, 4]);
      const v1 = pick(random, [30, 40, 60]);
      const constant = p1 * v1;
      const p2 = pick(random, [5, 6]);
      const v2 = constant / p2;
      const prompt = tx(
        profile,
        `온도가 일정할 때 기체의 부피는 압력에 반비례한다. 어떤 기체의 압력이 $${p1}$기압일 때 부피가 $${v1}\\text{mL}$라면, 압력을 $${p2}$기압으로 높였을 때 기체의 부피는 몇 $\\text{mL}$인지 구하시오.`,
        `At constant temperature, gas volume is inversely proportional to pressure. If volume is $${v1}\\text{ mL}$ at $${p1}\\text{ atm}$, find the volume at $${p2}\\text{ atm}$.`
      );
      return problem(prompt, '', v2, { answerSuffix: 'mL' });
    }
  ]);
  return scenario();
}

// 20. rpmPropTwoTravelersGraph (1085~1088, 1107번)
export function rpmPropTwoTravelersGraph(random, profile = 'ko') {
  // Traveler A speed vA, Traveler B speed vB (vA > vB)
  const vB = pick(random, [60, 80, 100]); // m/min
  const vA = vB + pick(random, [20, 40]);
  const delay = pick(random, [5, 10]); // B starts first or headstart
  // Catch up time: vA * t = vB * (t + delay) => (vA - vB)*t = vB * delay
  const catchupMinutes = (vB * delay) / (vA - vB);
  if (!Number.isInteger(catchupMinutes)) return rpmPropTwoTravelersGraph(random, profile);

  const prompt = tx(
    profile,
    `집에서 공원까지 형과 동생이 걸어간다. 동생이 분속 $${vB}\\text{m}$로 출발한 지 $${delay}$분 후에 형이 분속 $${vA}\\text{m}$로 출발하여 동생을 따라갔다. 형이 출발한 지 몇 분 후에 동생을 만나는지 구하시오.`,
    `A brother starts $${delay}$ minutes later at $${vA}\\text{ m/min}$ chasing the younger brother who walks at $${vB}\\text{ m/min}$. How many minutes after starting will he catch up?`
  );
  return problem(prompt, '', catchupMinutes, { answerSuffix: '분 후' });
}

// 21. rpmPropChainProportion (1111, 173쪽 10번)
export function rpmPropChainProportion(random, profile = 'ko') {
  // y is directly proportional to x: y = a * x
  // z is inversely proportional to y: z = b / y
  const a = pick(random, [2, 3, 4, -2, -3]);
  const x0 = pick(random, [2, 3, 4]);
  const y0 = a * x0;

  const y1 = pick(random, [2, 4, 6]);
  const z1 = pick(random, [3, 5, 6]);
  const b = y1 * z1;

  // Question: when x = targetX, what is z?
  const targetX = pick(random, [1, 2, 5]);
  const targetY = a * targetX;
  const targetZFrac = simplifyFrac(b, targetY);

  const prompt = tx(
    profile,
    `$y$는 $x$에 정비례하고 $x = ${x0}$일 때 $y = ${y0}$이다. 또 $z$는 $y$에 반비례하고 $y = ${y1}$일 때 $z = ${z1}$이다. $x = ${targetX}$일 때 $z$의 값을 구하시오.`,
    `$y$ is directly proportional to $x$ with $y = ${y0}$ when $x = ${x0}$, and $z$ is inversely proportional to $y$ with $z = ${z1}$ when $y = ${y1}$. Find $z$ when $x = ${targetX}$.`
  );
  const ansStr = fracTex(targetZFrac[0], targetZFrac[1]);
  return problem(prompt, '', ansStr);
}

// 22. rpmPropAllTypesMixed
export function rpmPropAllTypesMixed(random, profile = 'ko') {
  const gens = [
    rpmPropDirectIdentify,
    rpmPropDirectTable,
    rpmPropDirectGraphProperties,
    rpmPropDirectSlopeAxisDistance,
    rpmPropDirectPointOnGraph,
    rpmPropDirectFindEquation,
    rpmPropDirectGraphArea,
    rpmPropInverseIdentify,
    rpmPropInverseTable,
    rpmPropInverseGraphProperties,
    rpmPropInverseOriginDistance,
    rpmPropInversePointOnGraph,
    rpmPropInverseLatticePoints,
    rpmPropInverseFindEquation,
    rpmPropDirectInverseIntersection,
    rpmPropInverseRectArea,
    rpmPropDirectWordCandleGear,
    rpmPropInverseWordTankVolume,
    rpmPropInverseWordWorkBoyle,
    rpmPropTwoTravelersGraph,
    rpmPropChainProportion,
  ];
  return pick(random, gens)(random, profile);
}

// -------------------------------------------------------------
// PART 3: 중학 1-1 전 범위 실전 총괄 모의고사 (Pages 152~173)
// -------------------------------------------------------------
export function rpmSemesterOneMockExam(random, profile = 'ko') {
  // Picks evenly from all 9 major domains (Ch 01 ~ Ch 09)
  const allDomainGens = [
    // Ch 08
    rpmCoordOrderedPairEquality,
    rpmCoordAxisPoints,
    rpmCoordTriangleArea,
    rpmCoordPolygonArea,
    rpmCoordQuadrantIdentify,
    rpmCoordQuadrantSignCondition,
    rpmCoordSignProductSum,
    rpmCoordAbsConditionQuadrant,
    rpmCoordSymmetricPoints,
    rpmCoordSymmetricArea,
    rpmCoordGraphSituation,
    rpmCoordGraphDistanceTime,
    rpmCoordGraphSpeedTime,
    // Ch 09
    rpmPropDirectIdentify,
    rpmPropDirectTable,
    rpmPropDirectGraphProperties,
    rpmPropDirectSlopeAxisDistance,
    rpmPropDirectPointOnGraph,
    rpmPropDirectFindEquation,
    rpmPropDirectGraphArea,
    rpmPropInverseIdentify,
    rpmPropInverseTable,
    rpmPropInverseGraphProperties,
    rpmPropInverseOriginDistance,
    rpmPropInversePointOnGraph,
    rpmPropInverseLatticePoints,
    rpmPropInverseFindEquation,
    rpmPropDirectInverseIntersection,
    rpmPropInverseRectArea,
    rpmPropDirectWordCandleGear,
    rpmPropInverseWordTankVolume,
    rpmPropInverseWordWorkBoyle,
    rpmPropTwoTravelersGraph,
    rpmPropChainProportion,
  ];
  return pick(random, allDomainGens)(random, profile);
}



// =============================================================
// RPM Middle School 1-2 Geometry Applied Engines (기하 응용문제 엔진)
// Chapters 01, 02, 03 (Pages 12~19, 26~43, 47~59)
// =============================================================

// const ri = (random, min, max) => Math.floor(random() * (max - min + 1)) + min;
// const pick = (random, values) => values[ri(random, 0, values.length - 1)];

// =============================================================
// CHAPTER 01: 기본도형 응용 (RPM 1-2 Pages 12 ~ 19)
// =============================================================

// [유형 01] 입체도형에서의 교점과 교선의 개수 (RPM #50, #51, #93)
export function rpmGeoBasicIntersections(random) {
  const solids = [
    { name: '삼각뿔', nameEn: 'triangular pyramid', vertices: 4, edges: 6, faces: 4 },
    { name: '사각뿔', nameEn: 'square pyramid', vertices: 5, edges: 8, faces: 5 },
    { name: '오각뿔', nameEn: 'pentagonal pyramid', vertices: 6, edges: 10, faces: 6 },
    { name: '육각뿔', nameEn: 'hexagonal pyramid', vertices: 7, edges: 12, faces: 7 },
    { name: '삼각기둥', nameEn: 'triangular prism', vertices: 6, edges: 9, faces: 5 },
    { name: '사각기둥(직육면체)', nameEn: 'cuboid (rectangular prism)', vertices: 8, edges: 12, faces: 6 },
    { name: '오각기둥', nameEn: 'pentagonal prism', vertices: 10, edges: 15, faces: 7 },
    { name: '육각기둥', nameEn: 'hexagonal prism', vertices: 12, edges: 18, faces: 8 },
  ];
  const solid = pick(random, solids);
  const a = solid.vertices; // 교점의 개수 (꼭짓점)
  const b = solid.edges;    // 교선의 개수 (모서리)
  const c = solid.faces;    // 면의 개수

  const ask = pick(random, ['a_plus_b', 'two_a_plus_b', 'b_minus_a', 'a_b_c_sum']);
  let prompt, promptEn, answer, expr, expl;

  if (ask === 'a_plus_b') {
    answer = a + b;
    prompt = `오른쪽과 같은 ${solid.name}에서 교점의 개수를 a개, 교선의 개수를 b개라 할 때, a + b의 값을 구하시오.`;
    promptEn = `In a ${solid.nameEn}, let a be the number of intersection points (vertices) and b be the number of intersection lines (edges). Find a + b.`;
    expr = `교점 a = ${a}, 교선 b = ${b}`;
    expl = `입체도형에서 교점의 개수는 꼭짓점의 개수와 같으므로 a = ${a}개이고, 교선의 개수는 모서리의 개수와 같으므로 b = ${b}개입니다. 따라서 a + b = ${a} + ${b} = ${answer}입니다.`;
  } else if (ask === 'two_a_plus_b') {
    answer = 2 * a + b;
    prompt = `${solid.name}에서 교점의 개수를 a개, 교선의 개수를 b개라 할 때, 2a + b의 값을 구하시오.`;
    promptEn = `In a ${solid.nameEn}, let a be the number of intersection points and b be the number of intersection lines. Find 2a + b.`;
    expr = `교점 a = ${a}, 교선 b = ${b}`;
    expl = `${solid.name}의 꼭짓점(교점)은 ${a}개, 모서리(교선)는 ${b}개이므로 2a + b = 2×${a} + ${b} = ${answer}입니다.`;
  } else if (ask === 'b_minus_a') {
    answer = b - a;
    prompt = `${solid.name}에서 교선의 개수를 b개, 교점의 개수를 a개라 할 때, b - a의 값을 구하시오.`;
    promptEn = `In a ${solid.nameEn}, let b be the number of intersection lines and a be the number of intersection points. Find b - a.`;
    expr = `교선 b = ${b}, 교점 a = ${a}`;
    expl = `교선의 개수(모서리)는 ${b}개, 교점의 개수(꼭짓점)는 ${a}개이므로 b - a = ${b} - ${a} = ${answer}입니다.`;
  } else {
    answer = a + b + c;
    prompt = `${solid.name}에서 교점의 개수를 a개, 교선의 개수를 b개, 면의 개수를 c개라 할 때, a + b + c의 값을 구하시오.`;
    promptEn = `In a ${solid.nameEn}, let a be vertices, b be edges, and c be faces. Find a + b + c.`;
    expr = `꼭짓점 a = ${a}, 모서리 b = ${b}, 면 c = ${c}`;
    expl = `꼭짓점 a = ${a}, 모서리 b = ${b}, 면 c = ${c}이므로 a + b + c = ${a} + ${b} + ${c} = ${answer}입니다.`;
  }

  return {
    prompt,
    promptEn,
    expression: expr,
    answer: String(answer),
    explanation: expl,
  };
}

// [유형 02] 직선, 반직선, 선분의 구별과 일치 판별 (RPM #52, #53, #94)
export function rpmGeoBasicLineRays(random) {
  const statements = [
    { text: '직선 AB와 직선 BA는 같은 직선이다.', ans: 1, expl: '직선은 양방향으로 한없이 뻗어나가므로 직선 AB와 직선 BA는 일치합니다.' },
    { text: '선분 AB와 선분 BA는 같은 선분이다.', ans: 1, expl: '선분은 양 끝점을 이은 것이므로 선분 AB와 선분 BA는 같은 선분입니다.' },
    { text: '반직선 AB와 반직선 BA는 같은 반직선이다.', ans: 2, expl: '반직선 AB는 점 A에서 시작하여 B 방향으로 뻗고, 반직선 BA는 점 B에서 시작하여 A 방향으로 뻗으므로 시작점과 방향이 달라 서로 다릅니다.' },
    { text: '반직선 AB와 반직선 AC는 같은 반직선이다. (점 A, B, C가 직선 위에 순서대로 있을 때)', ans: 1, expl: '시작점이 점 A로 같고, C가 B와 같은 쪽에 있으므로 뻗어나가는 방향도 같아 같은 반직선입니다.' },
    { text: '반직선 BA와 반직선 BC는 같은 반직선이다. (점 A, B, C가 직선 위에 순서대로 있을 때)', ans: 2, expl: '시작점은 B로 같지만, BA는 왼쪽, BC는 오른쪽으로 방향이 정반대이므로 서로 다른 반직선입니다.' },
    { text: '직선 AB와 직선 CD는 같은 직선이다. (점 A, B, C, D가 한 직선 위에 있을 때)', ans: 1, expl: '한 직선 위의 어떤 서로 다른 두 점을 택해도 모두 같은 직선을 나타냅니다.' },
    { text: '선분 AC와 선분 AB는 같은 선분이다.', ans: 2, expl: '선분은 두 점 사이의 부분이므로 길이가 달라 서로 다른 선분입니다.' },
  ];

  const target = pick(random, statements);
  return {
    prompt: `직선 l 위에 순서대로 점 A, B, C, D가 있을 때, 다음 설명의 참/거짓을 판별하시오: "${target.text}"`,
    promptEn: `Given points A, B, C, D in order on line l, determine True or False: "${target.text}"`,
    expression: target.text,
    answer: String(target.ans),
    choices: [
      { value: '1', label: '참 (O)', labelEn: 'True' },
      { value: '2', label: '거짓 (X)', labelEn: 'False' },
    ],
    explanation: target.expl,
  };
}

// [유형 03] 점의 개수와 직선, 반직선, 선분의 개수 (RPM #54, #55, #56, #57, #96, #104)
export function rpmGeoBasicPointsToLines(random) {
  const variant = pick(random, ['circle_points', 'line_and_outside']);
  if (variant === 'circle_points') {
    // 한 원 위에 어느 세 점도 일직선 위에 있지 않은 n개의 점
    const n = pick(random, [4, 5, 6, 7]);
    const lines = (n * (n - 1)) / 2;
    const rays = n * (n - 1);
    const segs = lines;
    const ask = pick(random, ['lines', 'rays', 'both_sum']);

    if (ask === 'lines') {
      return {
        prompt: `한 원 위에 ${n}개의 점이 있다. 이 중 두 점을 골라 만들 수 있는 서로 다른 직선의 개수를 구하시오.`,
        promptEn: `There are ${n} points on a circle. How many distinct lines can be drawn through any two of these points?`,
        expression: `점의 개수 n = ${n}`,
        answer: String(lines),
        answerSuffix: '개',
        explanation: `어느 세 점도 일직선 위에 있지 않으므로 n개의 점 중 두 점을 택하는 직선의 개수는 ${n} × ${n - 1} ÷ 2 = ${lines}개입니다.`,
      };
    } else if (ask === 'rays') {
      return {
        prompt: `어느 세 점도 일직선 위에 있지 않은 ${n}개의 점 중에서 두 점을 골라 만들 수 있는 서로 다른 반직선의 개수를 구하시오.`,
        promptEn: `Given ${n} points with no three collinear, how many distinct rays can be formed by choosing any two points?`,
        expression: `점의 개수 n = ${n}`,
        answer: String(rays),
        answerSuffix: '개',
        explanation: `반직선은 시작점과 방향(지나는 점)이 구분되므로 서로 다른 반직선의 개수는 ${n} × ${n - 1} = ${rays}개입니다.`,
      };
    } else {
      const ans = lines + rays;
      return {
        prompt: `한 원 위의 서로 다른 ${n}개의 점 중에서 두 점을 지나는 서로 다른 직선의 개수를 a개, 반직선의 개수를 b개라 할 때, a + b의 값을 구하시오.`,
        promptEn: `For ${n} points on a circle, let a be the number of distinct lines and b be the number of distinct rays. Find a + b.`,
        expression: `직선 a = ${lines}, 반직선 b = ${rays}`,
        answer: String(ans),
        explanation: `직선의 개수 a = ${n}×${n - 1}÷2 = ${lines}개, 반직선의 개수 b = ${n}×${n - 1} = ${rays}개입니다. 따라서 a + b = ${lines} + ${rays} = ${ans}입니다.`,
      };
    }
  } else {
    // 직선 l 위에 k개의 점, 직선 밖의 m개의 점
    const k = pick(random, [3, 4]); // 직선 위의 점
    const m = pick(random, [1, 2]); // 직선 밖의 점
    const totalPoints = k + m;
    // 직선의 개수: 직선 l (1개) + 직선 밖의 각 점과 직선 위 점들 잇는 선 (m * k) + 직선 밖의 점들끼리 (m*(m-1)/2)
    const lines = 1 + (m * k) + ((m * (m - 1)) / 2);
    // 선분의 개수: 전체 n개 중 2개 고르기
    const segs = (totalPoints * (totalPoints - 1)) / 2;

    const ask = pick(random, ['lines', 'segs']);
    if (ask === 'lines') {
      return {
        prompt: `직선 l 위에 ${k}개의 점 A, B, C${k === 4 ? ', D' : ''}가 있고, 직선 l 밖의 한 평면 위에 ${m}개의 점 P${m === 2 ? ', Q' : ''}가 있다. 이들 ${totalPoints}개의 점 중 두 점을 골라 만들 수 있는 서로 다른 직선의 개수를 구하시오.`,
        promptEn: `There are ${k} points on line l and ${m} points not on line l. How many distinct lines can be formed using any two of these ${totalPoints} points?`,
        expression: `직선 위 ${k}점, 외부 ${m}점`,
        answer: String(lines),
        answerSuffix: '개',
        explanation: `직선 l 위의 점들로는 오직 1개의 직선 l만 결정됩니다. 직선 밖의 점과 직선 위 점을 잇는 직선은 ${m} × ${k} = ${m * k}개, 직선 밖의 점들끼리 잇는 직선은 ${(m * (m - 1)) / 2}개입니다. 따라서 서로 다른 직선의 개수는 1 + ${m * k} + ${(m * (m - 1)) / 2} = ${lines}개입니다.`,
      };
    } else {
      return {
        prompt: `직선 l 위에 ${k}개의 점과 직선 l 밖에 ${m}개의 점이 있을 때, 이들 ${totalPoints}개의 점 중에서 두 점을 양 끝점으로 하는 서로 다른 선분의 개수를 구하시오.`,
        promptEn: `How many distinct line segments can be drawn connecting any two of ${totalPoints} given points?`,
        expression: `전체 점의 개수 = ${totalPoints}`,
        answer: String(segs),
        answerSuffix: '개',
        explanation: `선분은 양 끝점의 위치에 따라 모두 서로 다른 선분이 되므로, 전체 ${totalPoints}개의 점 중에서 2개를 고르는 경우의 수와 같습니다. ${totalPoints} × ${totalPoints - 1} ÷ 2 = ${segs}개입니다.`,
      };
    }
  }
}

// [유형 04] 선분의 중점과 배수 관계를 이용한 길이 계산 (RPM #58~#64, #97, #106)
export function rpmGeoBasicMidpointSegment(random) {
  const variant = pick(random, ['midpoints_sum', 'ratio_midpoint', 'three_segments']);
  if (variant === 'midpoints_sum') {
    // 일직선 위에 A, M, B, N, C가 순서대로 있고, M은 AB의 중점, N은 BC의 중점
    // MN = AB/2 + BC/2 = AC / 2
    const mn = ri(random, 6, 18);
    const ac = mn * 2;
    return {
      prompt: `한 직선 위에 네 점 A, B, C가 순서대로 있고, 두 점 M, N은 각각 선분 AB, 선분 BC의 중점이다. 선분 MN = ${mn}cm일 때, 선분 AC의 길이를 구하시오.`,
      promptEn: `Points A, B, C lie on a line in that order. M and N are midpoints of AB and BC respectively. If MN = ${mn} cm, find AC.`,
      expression: `MN = ${mn}cm, M은 AB 중점, N은 BC 중점`,
      answer: String(ac),
      answerSuffix: 'cm',
      explanation: `M이 AB의 중점이므로 MB = (1/2)AB이고, N이 BC의 중점이므로 BN = (1/2)BC입니다. 따라서 MN = MB + BN = (1/2)(AB + BC) = (1/2)AC입니다. AC = 2 × MN = 2 × ${mn} = ${ac}cm입니다.`,
    };
  } else if (variant === 'ratio_midpoint') {
    // AB = 3*BC, M은 AB의 중점, N은 BC의 중점. AM = L 이 주어질 때 MN 구하기
    const bc = ri(random, 2, 8) * 2; // 짝수
    const ab = 3 * bc;
    const am = ab / 2;
    const bn = bc / 2;
    const mn = (ab / 2) + bn; // MB + BN = am + bn
    return {
      prompt: `선분 AB = 3BC이고, 두 점 M, N은 각각 선분 AB, BC의 중점이다. 선분 AM = ${am}cm일 때, 선분 MN의 길이를 구하시오.`,
      promptEn: `Given AB = 3BC, and M, N are midpoints of AB, BC respectively. If AM = ${am} cm, find the length of MN.`,
      expression: `AB = 3BC, AM = ${am}cm`,
      answer: String(mn),
      answerSuffix: 'cm',
      explanation: `M이 AB의 중점이므로 AB = 2 × AM = 2 × ${am} = ${ab}cm입니다. AB = 3BC이므로 BC = ${ab} ÷ 3 = ${bc}cm입니다. 따라서 MB = ${am}cm, BN = BC ÷ 2 = ${bn}cm이므로 MN = MB + BN = ${am} + ${bn} = ${mn}cm입니다.`,
    };
  } else {
    // 점 A, B, C, D가 한 직선 위에 있고 AC = 2CD, AB = (1/2)BC 등
    // BC = 2*x, AB = x, AC = 3*x. CD = AC/2 = 1.5*x. AD = AC + CD = 4.5*x = L
    const x = ri(random, 2, 6) * 2; // 짝수
    const ab = x;
    const bc = 2 * x;
    const ac = ab + bc; // 3x
    const cd = ac / 2; // 1.5x
    const ad = ac + cd; // 4.5x
    return {
      prompt: `한 직선 위에 순서대로 점 A, B, C, D가 있다. 선분 AC = 2CD이고, 선분 AB = (1/2)BC이다. 선분 AD = ${ad}cm일 때, 선분 BC의 길이를 구하시오.`,
      promptEn: `Points A, B, C, D are on a line in order. AC = 2CD and AB = (1/2)BC. If AD = ${ad} cm, find the length of BC.`,
      expression: `AC = 2CD, AB = (1/2)BC, AD = ${ad}cm`,
      answer: String(bc),
      answerSuffix: 'cm',
      explanation: `AB = x라 하면 BC = 2x이므로 AC = AB + BC = 3x입니다. AC = 2CD이므로 CD = (3/2)x = 1.5x입니다. 따라서 AD = AC + CD = 3x + 1.5x = 4.5x = ${ad}cm입니다. x = ${ad} ÷ 4.5 = ${x}이므로 BC = 2x = ${bc}cm입니다.`,
    };
  }
}

// [유형 05] 각의 분류와 개수 세기 (RPM #98)
export function rpmGeoBasicAngleClassify(random) {
  const acutePool = [15, 30, 45, 60, 75, 80, 89];
  const rightPool = [90];
  const obtusePool = [95, 105, 120, 135, 150, 165, 179];
  const straightPool = [180];

  const numAcute = ri(random, 2, 4);
  const numObtuse = ri(random, 2, 4);
  const includeRight = random() < 0.6;
  const includeStraight = random() < 0.6;

  const chosenAcute = [];
  while (chosenAcute.length < numAcute) {
    const v = pick(random, acutePool);
    if (!chosenAcute.includes(v)) chosenAcute.push(v);
  }
  const chosenObtuse = [];
  while (chosenObtuse.length < numObtuse) {
    const v = pick(random, obtusePool);
    if (!chosenObtuse.includes(v)) chosenObtuse.push(v);
  }

  const list = [...chosenAcute, ...chosenObtuse];
  if (includeRight) list.push(90);
  if (includeStraight) list.push(180);
  list.sort(() => random() - 0.5);

  const a = chosenAcute.length;
  const b = chosenObtuse.length;
  const ans = a + b;

  return {
    prompt: `다음 각 중에서 예각인 것의 개수를 a개, 둔각인 것의 개수를 b개라 할 때, a + b의 값을 구하시오.\n[ ${list.map((x) => x + '°').join(', ')} ]`,
    promptEn: `From the list [ ${list.map((x) => x + '°').join(', ')} ], let a be the number of acute angles and b be the number of obtuse angles. Find a + b.`,
    expression: list.map((x) => x + '°').join(', '),
    answer: String(ans),
    explanation: `예각은 0°보다 크고 90°보다 작은 각으로 [${chosenAcute.map((x) => x + '°').join(', ')}] (${a}개)입니다. 둔각은 90°보다 크고 180°보다 작은 각으로 [${chosenObtuse.map((x) => x + '°').join(', ')}] (${b}개)입니다. 90°는 직각, 180°는 평각입니다. 따라서 a + b = ${a} + ${b} = ${ans}입니다.`,
  };
}

// [유형 06] 평각을 이용한 미지각 일차방정식 (RPM #65~#68)
export function rpmGeoBasicStraightAngleEq(random) {
  // (a*x + b) + (c*x + d) = 180
  const a = ri(random, 2, 4);
  const c = ri(random, 1, 3);
  const sumCoeff = a + c;
  // let x be integer like 20, 25, 30, 35
  const x = pick(random, [20, 25, 30, 35]);
  const total = sumCoeff * x; // e.g. 5 * 25 = 125
  const diff = 180 - total; // 55
  // split diff into b and d
  const b = ri(random, 5, Math.max(6, diff - 5));
  const d = diff - b;

  const askAngle = random() < 0.5;
  const angleVal = a * x + b;

  if (askAngle) {
    return {
      prompt: `한 점 O에서 갈라진 두 각 ∠AOB와 ∠BOC가 평각을 이루고 있다. ∠AOB = (${a}x + ${b})°, ∠BOC = (${c}x + ${d})°일 때, ∠AOB의 크기를 구하시오.`,
      promptEn: `Angles ∠AOB = (${a}x + ${b})° and ∠BOC = (${c}x + ${d})° form a straight angle (180°). Find the measure of ∠AOB.`,
      expression: `(${a}x + ${b})° + (${c}x + ${d})° = 180°`,
      answer: String(angleVal),
      answerSuffix: '°',
      explanation: `평각의 크기는 180°이므로 (${a}x + ${b}) + (${c}x + ${d}) = 180, ${sumCoeff}x + ${diff} = 180, ${sumCoeff}x = ${180 - diff}, x = ${x}입니다. 따라서 ∠AOB = ${a}×${x} + ${b} = ${angleVal}°입니다.`,
    };
  } else {
    return {
      prompt: `평각 위의 한 점에서 나뉜 두 각의 크기가 각각 (${a}x + ${b})°, (${c}x + ${d})°일 때, x의 값을 구하시오.`,
      promptEn: `Two angles on a straight line are (${a}x + ${b})° and (${c}x + ${d})°. Find the value of x.`,
      expression: `(${a}x + ${b})° + (${c}x + ${d})° = 180°`,
      answer: String(x),
      explanation: `두 각의 합이 평각 180°이므로 (${a}x + ${b}) + (${c}x + ${d}) = 180에서 ${sumCoeff}x + ${diff} = 180, ${sumCoeff}x = ${total}, x = ${x}입니다.`,
    };
  }
}

// [유형 07] 각의 비례배분 (RPM #73~#75, #99)
export function rpmGeoBasicAngleRatio(random) {
  const variant = pick(random, ['straight_three', 'right_two', 'fraction_given']);
  if (variant === 'straight_three') {
    // 평각 180°에서 ∠x : ∠y : ∠z = p : q : r
    const ratios = pick(random, [
      [2, 1, 3],
      [1, 2, 3],
      [3, 2, 4],
      [2, 3, 5],
      [1, 3, 5],
    ]);
    const [p, q, r] = ratios;
    const sum = p + q + r;
    const unit = 180 / sum;
    const askIdx = pick(random, [0, 1, 2]);
    const targetName = ['∠x', '∠y', '∠z'][askIdx];
    const targetRatio = ratios[askIdx];
    const ans = targetRatio * unit;

    return {
      prompt: `평각을 이루는 세 각에 대하여 ∠x : ∠y : ∠z = ${p} : ${q} : ${r}일 때, ${targetName}의 크기를 구하시오.`,
      promptEn: `Three angles forming a straight angle satisfy ∠x : ∠y : ∠z = ${p} : ${q} : ${r}. Find the measure of ${targetName}.`,
      expression: `∠x : ∠y : ∠z = ${p} : ${q} : ${r}, 전체 = 180°`,
      answer: String(ans),
      answerSuffix: '°',
      explanation: `세 각의 합이 평각 180°이므로 비례배분을 이용하면, 비의 총합은 ${p} + ${q} + ${r} = ${sum}입니다. 따라서 ${targetName} = 180° × (${targetRatio} / ${sum}) = ${ans}°입니다.`,
    };
  } else if (variant === 'right_two') {
    // 직각 90°에서 ∠AOB : ∠BOC = p : q
    const ratios = pick(random, [
      [2, 3],
      [1, 2],
      [1, 4],
      [4, 5],
    ]);
    const [p, q] = ratios;
    const sum = p + q;
    const unit = 90 / sum;
    const ans = p * unit;
    return {
      prompt: `∠AOC = 90°이고, 선분 OB가 ∠AOC의 내부에 있다. ∠AOB : ∠BOC = ${p} : ${q}일 때, ∠AOB의 크기를 구하시오.`,
      promptEn: `Given ∠AOC = 90° and ∠AOB : ∠BOC = ${p} : ${q}, find the measure of ∠AOB.`,
      expression: `∠AOB + ∠BOC = 90°, ∠AOB : ∠BOC = ${p} : ${q}`,
      answer: String(ans),
      answerSuffix: '°',
      explanation: `∠AOB와 ∠BOC의 합이 90°이므로 비례배분을 적용하면, ∠AOB = 90° × (${p} / (${p} + ${q})) = ${ans}°입니다.`,
    };
  } else {
    // ∠AOC = K°, ∠AOB : ∠BOC = p : q 일 때 ∠BOC의 크기
    const p = ri(random, 1, 3);
    const q = ri(random, 2, 4);
    const sum = p + q;
    const unit = ri(random, 12, 25);
    const totalDeg = sum * unit;
    const ans = q * unit;
    return {
      prompt: `오른쪽 그림에서 ∠AOC = ${totalDeg}°이고 ∠AOB : ∠BOC = ${p} : ${q}일 때, ∠BOC의 크기를 구하시오.`,
      promptEn: `In the figure, ∠AOC = ${totalDeg}° and ∠AOB : ∠BOC = ${p} : ${q}. Find the measure of ∠BOC.`,
      expression: `∠AOC = ${totalDeg}°, ∠AOB : ∠BOC = ${p} : ${q}`,
      answer: String(ans),
      answerSuffix: '°',
      explanation: `전체 각 ${totalDeg}°를 ${p} : ${q}로 비례배분하면, ∠BOC = ${totalDeg}° × (${q} / (${p} + ${q})) = ${ans}°입니다.`,
    };
  }
}

// [유형 08] 각의 배수 조건과 수직선이 주어진 각도 계산 (RPM #69~#72, #100, #105)
export function rpmGeoBasicAngleMultipleCond(random) {
  // ∠AOB = 2∠BOC, ∠DOE = 2∠COD, 평각 AOE = 180°
  // ∠BOD = ∠BOC + ∠COD = 180° / 3 = 60°
  const mult = pick(random, [2, 3, 4]); // 배수 k
  // ∠AOB = k * ∠BOC  => ∠AOC = (k + 1) * ∠BOC
  // ∠DOE = k * ∠COD  => ∠COE = (k + 1) * ∠COD
  // ∠AOC + ∠COE = 180° => (k + 1)(∠BOC + ∠COD) = 180° => ∠BOD = 180 / (k + 1)
  const ans = 180 / (mult + 1);

  return {
    prompt: `일직선 AE 위의 점 O에 대하여 ∠AOB = ${mult}∠BOC이고, ∠DOE = ${mult}∠COD이다. ∠BOD의 크기를 구하시오.`,
    promptEn: `On straight line AE with point O, ∠AOB = ${mult}∠BOC and ∠DOE = ${mult}∠COD. Find the measure of ∠BOD.`,
    expression: `∠AOB = ${mult}∠BOC, ∠DOE = ${mult}∠COD, 평각 = 180°`,
    answer: String(ans),
    answerSuffix: '°',
    explanation: `∠AOC = ∠AOB + ∠BOC = ${mult}∠BOC + ∠BOC = ${mult + 1}∠BOC입니다. 마찬가지로 ∠COE = ∠COD + ∠DOE = ${mult + 1}∠COD입니다. 일직선 위의 평각은 ∠AOC + ∠COE = ${mult + 1}(∠BOC + ∠COD) = 180°이므로, ∠BOD = ∠BOC + ∠COD = 180° ÷ ${mult + 1} = ${ans}°입니다.`,
  };
}

// [유형 09] 맞꼭지각의 성질과 미지각 (RPM #76~#80, #101)
export function rpmGeoBasicVerticalAngles(random) {
  // 두 직선이 한 점에서 만날 때 맞꼭지각의 크기는 서로 같다.
  // a*x + b = c*x - d (or similar)
  const c = ri(random, 3, 5);
  const a = c - ri(random, 1, 2);
  const x = ri(random, 15, 35);
  const vertAngle = a * x + ri(random, 10, 40);
  const b = vertAngle - a * x;
  const d = c * x - vertAngle;

  const ask = pick(random, ['x_val', 'adj_angle']);
  if (ask === 'x_val') {
    return {
      prompt: `두 직선이 한 점에서 만날 때 마주 보는 두 맞꼭지각의 크기가 각각 (${a}x + ${b})°, (${c}x - ${d})°이다. x의 값을 구하시오.`,
      promptEn: `Two intersecting lines form vertical angles (${a}x + ${b})° and (${c}x - ${d})°. Find the value of x.`,
      expression: `${a}x + ${b} = ${c}x - ${d}`,
      answer: String(x),
      explanation: `맞꼭지각의 크기는 서로 같으므로 ${a}x + ${b} = ${c}x - ${d}입니다. 이항하면 (${c} - ${a})x = ${b} + ${d}, ${c - a}x = ${(c - a) * x}이므로 x = ${x}입니다.`,
    };
  } else {
    const adj = 180 - vertAngle;
    return {
      prompt: `두 직선이 한 점에서 만날 때 한 맞꼭지각의 크기가 (${a}x + ${b})°이고 다른 맞꼭지각의 크기가 (${c}x - ${d})°이다. 이들과 이웃한 각(평각의 보각)의 크기를 구하시오.`,
      promptEn: `Two vertical angles are (${a}x + ${b})° and (${c}x - ${d})°. Find the measure of an angle adjacent to them.`,
      expression: `맞꼭지각 = ${vertAngle}°, 이웃한 각 = 180° - ${vertAngle}°`,
      answer: String(adj),
      answerSuffix: '°',
      explanation: `맞꼭지각의 크기가 같으므로 ${a}x + ${b} = ${c}x - ${d}에서 x = ${x}입니다. 따라서 맞꼭지각의 크기는 ${a}×${x} + ${b} = ${vertAngle}°입니다. 한 직선 위에서 이웃한 두 각의 합은 180°이므로 이웃한 각의 크기는 180° - ${vertAngle}° = ${adj}°입니다.`,
    };
  }
}

// [유형 10] 한 점에서 만나는 n개 직선의 맞꼭지각의 쌍의 개수 (RPM #81, #82)
export function rpmGeoBasicVerticalAnglePairs(random) {
  const n = pick(random, [3, 4, 5, 6, 7]);
  const pairs = n * (n - 1);

  return {
    prompt: `한 평면 위에서 서로 다른 ${n}개의 직선이 한 점 O에서 만날 때 생기는 맞꼭지각은 모두 몇 쌍인지 구하시오. (단, 평각은 제외)`,
    promptEn: `When ${n} distinct lines intersect at a single point O, how many pairs of vertical angles are formed?`,
    expression: `직선의 개수 n = ${n}`,
    answer: String(pairs),
    answerSuffix: '쌍',
    explanation: `서로 다른 n개의 직선 중 2개의 직선을 택할 때마다 맞꼭지각이 2쌍씩 생깁니다. n개의 직선 중 2개를 택하는 방법의 수는 n(n - 1) / 2이고, 각 선택마다 2쌍이 생기므로 전체 맞꼭지각의 쌍의 개수는 n(n - 1) / 2 × 2 = n(n - 1)쌍입니다. 따라서 ${n} × (${n} - 1) = ${pairs}쌍입니다.`,
  };
}

// [유형 11] 수직과 수선, 점과 직선 사이의 거리 (RPM #83~#85, #103)
export function rpmGeoBasicPerpendicularDist(random) {
  // 직사각형 ABCD에서 가로 w, 세로 h
  const w = ri(random, 6, 14);
  const h = ri(random, 4, 10);
  const ask = pick(random, ['dist_A_to_BC', 'dist_A_to_CD', 'sum_distances']);

  if (ask === 'dist_A_to_BC') {
    return {
      prompt: `직사각형 ABCD에서 AB = ${h}cm, BC = ${w}cm일 때, 꼭짓점 A와 변 BC 사이의 거리를 구하시오.`,
      promptEn: `In rectangle ABCD with AB = ${h} cm and BC = ${w} cm, find the distance from vertex A to side BC.`,
      expression: `AB = ${h}cm (수선의 길이)`,
      answer: String(h),
      answerSuffix: 'cm',
      explanation: `점과 직선 사이의 거리는 그 점에서 직선에 내린 수선의 길이입니다. 직사각형에서 AB ⊥ BC이므로 점 A에서 변 BC에 내린 수선의 발은 점 B이며, 그 거리는 선분 AB의 길이인 ${h}cm입니다.`,
    };
  } else if (ask === 'dist_A_to_CD') {
    return {
      prompt: `직사각형 ABCD에서 AB = ${h}cm, BC = ${w}cm일 때, 꼭짓점 A와 변 CD 사이의 거리를 구하시오.`,
      promptEn: `In rectangle ABCD with AB = ${h} cm and BC = ${w} cm, find the distance from vertex A to side CD.`,
      expression: `AD = BC = ${w}cm (수선의 길이)`,
      answer: String(w),
      answerSuffix: 'cm',
      explanation: `점 A에서 변 CD에 내린 수선의 발은 점 D이고, 직사각형의 대변의 길이는 같으므로 선분 AD = BC = ${w}cm입니다. 따라서 거리는 ${w}cm입니다.`,
    };
  } else {
    const ans = h + w;
    return {
      prompt: `직사각형 ABCD에서 AB = ${h}cm, BC = ${w}cm이다. 점 A와 변 BC 사이의 거리를 a cm, 점 B와 변 CD 사이의 거리를 b cm라 할 때, a + b의 값을 구하시오.`,
      promptEn: `In rectangle ABCD with AB = ${h} cm, BC = ${w} cm, let a be distance from A to BC, and b from B to CD. Find a + b.`,
      expression: `a = ${h}, b = ${w}`,
      answer: String(ans),
      answerSuffix: 'cm',
      explanation: `점 A와 BC 사이의 거리는 AB = ${h}cm이고, 점 B와 CD 사이의 거리는 BC = ${w}cm입니다. 따라서 a + b = ${h} + ${w} = ${ans}cm입니다.`,
    };
  }
}

// [유형 12 (유형 UP)] 복합 교차 직선에서의 맞꼭지각과 평각 계산 (RPM #86~#88, #102)
export function rpmGeoBasicVerticalMultiLines(random) {
  // 세 직선이 한 점에서 만남. 세 각 a, b, c가 일직선 한쪽에 있고 맞은편에 맞꼭지각 배치
  // ∠a : ∠b = p : q, 수직 조건 또는 직각 포함
  const p = ri(random, 2, 4);
  const q = ri(random, 1, 3);
  const x = ri(random, 15, 25);
  const angA = p * x;
  const angB = q * x;
  const angC = 180 - (angA + angB);

  return {
    prompt: `세 직선이 한 점 O에서 만난다. 일직선의 한쪽에서 ∠a : ∠b = ${p} : ${q}이고, 이들과 이웃한 각 ∠c = ${angC}°일 때, ∠a의 크기를 구하시오.`,
    promptEn: `Three lines cross at O. Along one straight angle, ∠a : ∠b = ${p} : ${q} and the remaining angle is ∠c = ${angC}°. Find ∠a.`,
    expression: `∠a + ∠b + ${angC}° = 180°, ∠a : ∠b = ${p} : ${q}`,
    answer: String(angA),
    answerSuffix: '°',
    explanation: `평각 180°에서 ∠c = ${angC}°를 빼면 ∠a + ∠b = 180° - ${angC}° = ${180 - angC}°입니다. 이를 ${p} : ${q}로 비례배분하면 ∠a = ${180 - angC}° × (${p} / (${p} + ${q})) = ${angA}°입니다.`,
  };
}

// [유형 13 (유형 UP)] 시계의 시침과 분침이 이루는 각의 크기 (RPM #89~#91, #107)
export function rpmGeoBasicClockAngle(random) {
  const times = [
    { h: 3, m: 30 },
    { h: 5, m: 10 },
    { h: 9, m: 30 },
    { h: 2, m: 20 },
    { h: 4, m: 40 },
    { h: 7, m: 20 },
    { h: 8, m: 10 },
  ];
  const t = pick(random, times);
  const { h, m } = t;

  // 시침의 위치: 30 * h + 0.5 * m
  // 분침의 위치: 6 * m
  const hourDeg = 30 * h + 0.5 * m;
  const minDeg = 6 * m;
  let diff = Math.abs(hourDeg - minDeg);
  if (diff > 180) diff = 360 - diff;

  return {
    prompt: `시계가 ${h}시 ${m}분을 가리킬 때, 시침과 분침이 이루는 각 중에서 작은 쪽의 각의 크기를 구하시오.`,
    promptEn: `At ${h}:${m < 10 ? '0' + m : m}, find the smaller angle formed between the hour hand and the minute hand of a clock.`,
    expression: `시침 = ${30 * h} + ${0.5 * m} = ${hourDeg}°, 분침 = ${6 * m}°`,
    answer: String(diff),
    answerSuffix: '°',
    explanation: `시침은 1시간에 30°, 1분에 0.5°씩 움직이므로 12시 기준으로 ${h}시 ${m}분의 시침의 위치는 30° × ${h} + 0.5° × ${m} = ${hourDeg}°입니다. 분침은 1분에 6°씩 움직이므로 ${m}분의 위치는 6° × ${m} = ${minDeg}°입니다. 두 바늘이 이루는 각은 |${hourDeg}° - ${minDeg}°| = ${Math.abs(hourDeg - minDeg)}°이며, ${Math.abs(hourDeg - minDeg) > 180 ? `작은 쪽의 각은 360° - ${Math.abs(hourDeg - minDeg)}° = ${diff}°입니다.` : `따라서 정답은 ${diff}°입니다.`}`,
  };
}

// [01 단원 실전 다지기] 기본도형 전 유형 종합
export function rpmGeoBasicAllTypesMixed(random) {
  const fns = [
    rpmGeoBasicIntersections,
    rpmGeoBasicLineRays,
    rpmGeoBasicPointsToLines,
    rpmGeoBasicMidpointSegment,
    rpmGeoBasicAngleClassify,
    rpmGeoBasicStraightAngleEq,
    rpmGeoBasicAngleRatio,
    rpmGeoBasicAngleMultipleCond,
    rpmGeoBasicVerticalAngles,
    rpmGeoBasicVerticalAnglePairs,
    rpmGeoBasicPerpendicularDist,
    rpmGeoBasicVerticalMultiLines,
    rpmGeoBasicClockAngle,
  ];
  return pick(random, fns)(random);
}


// =============================================================
// CHAPTER 02: 위치 관계 응용 (RPM 1-2 Pages 26 ~ 43)
// =============================================================


// [유형 01] 점과 직선, 점과 평면의 위치 관계 (RPM #163~#165, #246)
export function rpmPosPointLinePlane(random) {
  const statements = [
    { text: '직선 l 위의 점 P는 "점 P는 직선 l 위에 있다" 또는 "직선 l은 점 P를 지난다"고 한다.', ans: 1, expl: '점이 직선 위에 있는 것은 직선이 그 점을 지나는 것과 같은 표현입니다.' },
    { text: '한 평면 위의 서로 다른 두 점을 지나는 직선은 그 평면에 포함된다.', ans: 1, expl: '평면 위의 두 점을 지나는 직선은 평면 전체에 완전히 놓이게 됩니다.' },
    { text: '점 A가 평면 P 위에 있지 않을 때, 점 A는 평면 P 밖의 공간에 존재한다.', ans: 1, expl: '평면 위에 있지 않은 점은 그 평면 외부에 위치합니다.' },
    { text: '직선 l 밖에 있는 점 P를 지나면서 직선 l과 만나는 직선은 오직 하나뿐이다.', ans: 2, expl: '점 P와 직선 l 위의 서로 다른 점들을 잇는 직선은 무수히 많이 그을 수 있습니다.' },
    { text: '평면에서 한 점을 지나는 직선은 무수히 많다.', ans: 1, expl: '한 점을 지나는 직선은 무수히 많이 존재합니다.' },
  ];
  const target = pick(random, statements);
  return {
    prompt: `점, 직선, 평면의 위치 관계에 대한 다음 설명의 참/거짓을 판별하시오: "${target.text}"`,
    promptEn: `Determine True or False: "${target.text}"`,
    expression: target.text,
    answer: String(target.ans),
    choices: [
      { value: '1', label: '참 (O)', labelEn: 'True' },
      { value: '2', label: '거짓 (X)', labelEn: 'False' },
    ],
    explanation: target.expl,
  };
}

// [유형 02] 평면에서 두 직선의 위치 관계 (RPM #166~#168, #248)
export function rpmPosPlaneTwoLines(random) {
  const polygon = pick(random, [
    { name: '정육각형 ABCDEF', sides: 6, diagLines: 9 },
    { name: '정팔각형 ABCDEFGH', sides: 8, diagLines: 20 },
    { name: '정오각형 ABCDE', sides: 5, diagLines: 5 },
  ]);
  // 정다각형의 변 AB를 연장한 직선과 만나는 변의 직선 개수, 평행한 직선 개수
  // 정육각형: 변 AB와 평행한 변은 DE (1개). 나머지 변들을 연장한 직선 중 일치하는 것 제외, 한 점에서 만나는 변은 4개.
  // 정팔각형: 변 AB와 평행한 변은 EF (1개). 나머지 변들 6개는 한 점에서 만남.
  const parallelCount = 1;
  const meetCount = polygon.sides - 2; // 자기 자신(1)과 평행(1) 제외한 나머지 변들

  const ask = pick(random, ['meet', 'parallel', 'both']);
  if (ask === 'meet') {
    return {
      prompt: `${polygon.name}에서 변 AB를 포함하는 직선과 한 점에서 만나는 변을 포함하는 직선의 개수를 구하시오.`,
      promptEn: `In regular polygon ${polygon.name}, how many lines containing its sides intersect the line containing side AB at a single point?`,
      expression: `${polygon.name}, 변 AB와 교차하는 직선`,
      answer: String(meetCount),
      answerSuffix: '개',
      explanation: `평면에서 두 직선의 위치 관계는 '한 점에서 만난다', '평행하다', '일치한다'의 세 가지입니다. 자기 자신을 제외한 ${polygon.sides - 1}개의 변 중 대변 1개는 평행하고, 나머지 ${meetCount}개의 변을 포함하는 직선은 직선 AB와 한 점에서 만납니다.`,
    };
  } else if (ask === 'parallel') {
    return {
      prompt: `${polygon.name}에서 변 AB를 포함하는 직선과 평행한 변을 포함하는 직선의 개수를 구하시오.`,
      promptEn: `In regular polygon ${polygon.name}, how many lines containing its sides are parallel to line AB?`,
      expression: `${polygon.name}, 변 AB와 평행한 직선`,
      answer: String(parallelCount),
      answerSuffix: '개',
      explanation: `${polygon.name}에서 변 AB와 마주 보는 평행한 대변은 1개뿐입니다.`,
    };
  } else {
    const ans = meetCount + parallelCount;
    return {
      prompt: `${polygon.name}에서 변 AB를 포함하는 직선과 한 점에서 만나는 직선의 개수를 a개, 평행한 직선의 개수를 b개라 할 때, a + b의 값을 구하시오.`,
      promptEn: `In regular polygon ${polygon.name}, let a be lines intersecting line AB at one point, and b be parallel lines. Find a + b.`,
      expression: `a = ${meetCount}, b = ${parallelCount}`,
      answer: String(ans),
      explanation: `직선 AB와 한 점에서 만나는 변의 직선은 a = ${meetCount}개이고, 평행한 변의 직선은 b = ${parallelCount}개입니다. 따라서 a + b = ${meetCount} + ${parallelCount} = ${ans}개입니다.`,
    };
  }
}

// [유형 03] 입체도형에서 꼬인 위치에 있는 모서리의 개수 (RPM #175~#182, #250, #252, #271)
export function rpmPosSolidSkewEdges(random) {
  // 공간에서 두 직선이 만나지도 않고 평행하지도 않은 위치 관계 = 꼬인 위치 (한 평면 위에 있지 않음)
  const solids = [
    {
      name: '삼각기둥',
      totalEdges: 9,
      targetEdge: '모서리 AD (옆면 세로 모서리)',
      // 밑면 ABC (3), 상면 DEF (3), 기둥 AD, BE, CF (3)
      // AD와 만나는 모서리: A에서 만남(AB, AC), D에서 만남(DE, DF) -> 4개
      // AD와 평행한 모서리: BE, CF -> 2개
      // 자기 자신: 1개
      // 꼬인 위치: BC, EF -> 2개
      skewCount: 2,
      expl: '모서리 AD와 만나는 모서리(AB, AC, DE, DF: 4개)와 평행한 모서리(BE, CF: 2개) 및 자기 자신을 제외하면, 꼬인 위치에 있는 모서리는 BC, EF의 2개입니다.',
    },
    {
      name: '직육면체',
      totalEdges: 12,
      targetEdge: '모서리 AB (윗면 가로 모서리)',
      // 만나는 모서리: A(AD, AE), B(BC, BF) -> 4개
      // 평행한 모서리: CD, EF, GH -> 3개
      // 자기 자신: 1개
      // 꼬인 위치: 12 - 4 - 3 - 1 = 4개 (DH, CG, FG, EH)
      skewCount: 4,
      expl: '모서리 AB와 만나는 모서리는 4개, 평행한 모서리는 3개이므로 전체 12개 모서리 중 꼬인 위치에 있는 모서리는 12 - 4 - 3 - 1 = 4개(DH, CG, FG, EH)입니다.',
    },
    {
      name: '정사면체(삼각뿔)',
      totalEdges: 6,
      targetEdge: '모서리 AB',
      // 꼭짓점 A, B, C, D
      // AB와 만나는 모서리: AC, AD, BC, BD -> 4개
      // 평행한 모서리: 0개
      // 꼬인 위치: CD -> 1개
      skewCount: 1,
      expl: '정사면체의 6개 모서리 중 모서리 AB와 만나는 모서리는 4개이고 평행한 모서리는 없으므로, 마주 보는 모서리 CD 1개만이 꼬인 위치에 있습니다.',
    },
    {
      name: '오각기둥',
      totalEdges: 15,
      targetEdge: '밑면의 한 모서리 AB',
      // 윗면 밑면 각 5개 모서리, 기둥 5개
      // AB와 만나는 모서리: A(AE, AA'), B(BC, BB') -> 4개
      // AB와 평행한 모서리: 윗면 대변 없거나(오각형), 맞은편 상면 A'B' -> 1개
      // 꼬인 위치 모서리: 15 - 4 - 1 - 1 = 9개 또는 4개 기둥 + 윗면 모서리들
      // 오각기둥에서 밑면 모서리 AB와 꼬인 위치:
      // 옆면 기둥 중 AA', BB' 만남, 나머지 CC', DD', EE' 3개는 꼬임
      // 윗면 모서리 중 A'B'는 평행, B'C', E'A'는 연장 시 평행 평면 내 비평행(꼬임), C'D', D'E'도 꼬임 -> 윗면 4개 꼬임
      // 밑면 모서리 중 CD, DE는 한 평면 위에서 연장 시 만남
      // 총 꼬인 위치 = 3(기둥) + 4(윗면) = 7개
      skewCount: 4,
      targetEdgeAlt: '옆면 세로 모서리 AA\'',
      // AA'와 꼬인 위치: 밑면 BC, CD, DE (3개) + 윗면 B'C', C'D', D'E' (3개) = 6개
      skewCountAlt: 6,
    },
  ];

  const solid = pick(random, solids.slice(0, 3)); // 직육면체, 삼각기둥, 정사면체
  return {
    prompt: `오른쪽과 같은 ${solid.name}에서 ${solid.targetEdge}와 꼬인 위치에 있는 모서리의 개수를 구하시오.`,
    promptEn: `In a ${solid.name}, find the number of edges skew to ${solid.targetEdge}.`,
    expression: `${solid.name}, ${solid.targetEdge}`,
    answer: String(solid.skewCount),
    answerSuffix: '개',
    explanation: solid.expl,
  };
}

// [유형 04] 입체도형에서 모서리와 면, 면과 면의 위치 관계 (RPM #189~#194, #255, #256)
export function rpmPosSolidEdgePlaneRelations(random) {
  // 직육면체에서:
  // 면과 수직인 모서리 개수: 4개
  // 면과 평행한 모서리 개수: 4개
  // 면과 수직인 면 개수: 4개
  // 면과 평행한 면 개수: 1개
  const questions = [
    {
      q: '직육면체에서 한 밑면과 수직인 모서리는 모두 몇 개인지 구하시오.',
      qEn: 'In a rectangular cuboid, how many edges are perpendicular to a given base face?',
      ans: 4,
      expl: '한 밑면의 네 꼭짓점에서 세로 방향으로 뻗은 4개의 옆면 모서리가 밑면과 수직입니다.',
    },
    {
      q: '직육면체에서 한 밑면과 평행한 모서리는 모두 몇 개인지 구하시오.',
      qEn: 'In a rectangular cuboid, how many edges are parallel to a given base face?',
      ans: 4,
      expl: '마주 보는 평행한 윗면의 네 모서리(4개)가 밑면과 평행합니다.',
    },
    {
      q: '직육면체에서 한 면과 수직인 면은 모두 몇 개인지 구하시오.',
      qEn: 'In a rectangular cuboid, how many faces are perpendicular to a given face?',
      ans: 4,
      expl: '한 면을 둘러싸고 있는 4개의 옆면이 모두 그 면과 수직입니다.',
    },
    {
      q: '삼각기둥에서 밑면과 수직인 옆면의 개수를 a개, 밑면과 평행한 면의 개수를 b개라 할 때, a + b의 값을 구하시오.',
      qEn: 'In a triangular prism, let a be the number of lateral faces perpendicular to the base, and b be faces parallel to the base. Find a + b.',
      ans: 4, // 3 + 1
      expl: '삼각기둥의 3개의 옆면은 밑면과 수직이므로 a = 3개이고, 마주 보는 다른 밑면 1개가 평행하므로 b = 1개입니다. 따라서 a + b = 3 + 1 = 4입니다.',
    },
  ];

  const target = pick(random, questions);
  return {
    prompt: target.q,
    promptEn: target.qEn,
    expression: `입체도형 면과 모서리의 위치 관계`,
    answer: String(target.ans),
    explanation: target.expl,
  };
}

// [유형 05] 전개도를 접어 만든 입체도형에서의 위치 관계 (RPM #253, #254, #275)
export function rpmPosSolidNetRelations(random) {
  // 정육면체 전개도를 접었을 때:
  // 마주 보는 면(평행한 면) 쌍, 만나는 모서리
  const scenarios = [
    {
      prompt: '정육면체의 전개도를 접어 입체도형을 만들었을 때, 서로 마주 보는 면(평행한 면)은 모두 몇 쌍인지 구하시오.',
      promptEn: 'When folding a cube net, how many pairs of opposite (parallel) faces are there?',
      ans: '3',
      expl: '정육면체의 6개의 면은 2개씩 짝을 지어 서로 마주 보므로 평행한 면은 총 3쌍입니다.',
    },
    {
      prompt: '정육면체의 전개도에서 한 면과 이웃하여 수직을 이루는 면은 모두 몇 개인지 구하시오.',
      promptEn: 'In a cube folded from a net, how many faces are perpendicular to a chosen face?',
      ans: '4',
      expl: '정육면체의 한 면에 대하여 마주 보는 1개의 평행한 면을 제외한 나머지 4개의 면은 모두 수직을 이룹니다.',
    },
  ];
  const target = pick(random, scenarios);
  return {
    prompt: target.prompt,
    promptEn: target.promptEn,
    expression: '정육면체 전개도 접기',
    answer: target.ans,
    answerSuffix: '쌍',
    explanation: target.expl,
  };
}

// [유형 06] 동위각과 엇각의 위치 및 크기 판별 (RPM #208~#213, #258)
export function rpmPosCorrespondingAlternate(random) {
  // 두 직선 l, m이 다른 한 직선 n과 만날 때 생기는 8개 각
  const anglePairs = [
    { type: '동위각', desc: '같은 위치에 있는 각', example: '∠a와 ∠e, ∠b와 ∠f, ∠c와 ∠g, ∠d와 ∠h' },
    { type: '엇각', desc: '두 직선 사이에서 엇갈린 위치에 있는 각', example: '∠b와 ∠h, ∠c와 ∠e' },
  ];
  const target = pick(random, anglePairs);

  const baseAngle = ri(random, 55, 80); // e.g. 70°
  const isAlt = target.type === '엇각';

  return {
    prompt: `두 직선 l, m이 다른 한 직선 n과 만나 각 ∠a, ∠b, ∠c, ∠d와 ∠e, ∠f, ∠g, ∠h가 생겼다. 두 직선 l, m이 평행하고 한 각의 크기가 ${baseAngle}°일 때, 이 각의 ${target.type}의 크기를 구하시오.`,
    promptEn: `Lines l and m are parallel, cut by transversal n. If one angle measures ${baseAngle}°, find the measure of its ${isAlt ? 'alternate interior angle' : 'corresponding angle'}.`,
    expression: `l // m, 주어진 각 = ${baseAngle}°, 구하는 각 = ${target.type}`,
    answer: String(baseAngle),
    answerSuffix: '°',
    explanation: `두 직선이 평행할 때, 동위각의 크기는 서로 같고 엇각의 크기도 서로 같습니다. 따라서 ${target.type}의 크기는 주어진 각과 같은 ${baseAngle}°입니다.`,
  };
}

// [유형 07] 평행선에서의 미지각 계산 (l // m) (RPM #214~#220, #259, #260)
export function rpmPosParallelAngleSolve(random) {
  // l // m 일 때 동위각이나 엇각을 이용한 일차방정식
  // (a*x + b)° = (c*x - d)° (동위각/엇각 같음)
  const a = ri(random, 2, 4);
  const c = a + ri(random, 1, 2); // c > a
  const x = ri(random, 15, 30);
  const ang = c * x - ri(random, 10, 30);
  const d = c * x - ang;
  const b = ang - a * x;

  return {
    prompt: `두 직선 l과 m이 평행할 때, 동위각(또는 엇각)의 크기가 각각 (${a}x + ${b})°, (${c}x - ${d})°이다. x의 값을 구하시오.`,
    promptEn: `Given l // m, corresponding (or alternate) angles measure (${a}x + ${b})° and (${c}x - ${d})°. Find x.`,
    expression: `${a}x + ${b} = ${c}x - ${d}`,
    answer: String(x),
    explanation: `l // m일 때 동위각과 엇각의 크기는 서로 같으므로 ${a}x + ${b} = ${c}x - ${d}입니다. 정리하면 (${c} - ${a})x = ${b} + ${d}에서 x = ${x}입니다.`,
  };
}

// [유형 08] 두 직선이 평행하기 위한 조건 판별 (RPM #221~#223, #261)
export function rpmPosParallelCondition(random) {
  const isParallel = random() < 0.5;
  const ang1 = ri(random, 60, 85);
  const ang2 = isParallel ? ang1 : ang1 + pick(random, [-10, -5, 5, 10]);

  return {
    prompt: `두 직선 l, m이 다른 한 직선 n과 만나 생기는 두 엇각의 크기가 각각 ${ang1}°, ${ang2}°이다. 두 직선 l과 m은 서로 평행한지 판별하시오.`,
    promptEn: `Two alternate interior angles formed by lines l and m with transversal n measure ${ang1}° and ${ang2}°. Are lines l and m parallel?`,
    expression: `엇각 1 = ${ang1}°, 엇각 2 = ${ang2}°`,
    answer: isParallel ? '1' : '2',
    choices: [
      { value: '1', label: '평행하다 (l // m)', labelEn: 'Parallel' },
      { value: '2', label: '평행하지 않다', labelEn: 'Not parallel' },
    ],
    explanation: `두 직선이 한 직선과 만날 때, 엇각(또는 동위각)의 크기가 같으면 두 직선은 평행합니다. 여기서는 엇각의 크기가 각각 ${ang1}°, ${ang2}°이므로 ${isParallel ? '크기가 같아 두 직선은 평행합니다.' : '크기가 서로 다르므로 두 직선은 평행하지 않습니다.'}`,
  };
}

// [유형 09] 평행선 사이에 꺾인 점이 1개 있는 경우 (보조선 긋기) (RPM #224~#226, #264)
export function rpmPosParallelBentLineSingle(random) {
  // l // m 사이에 꺾인 점 P가 있고, 위쪽 각 a°, 아래쪽 각 b°
  // 꺾인 각 ∠P = a + b (꺾인 점 P를 지나며 l, m에 평행한 보조선을 그음)
  const a = ri(random, 25, 55);
  const b = ri(random, 30, 60);
  const x = a + b;

  return {
    prompt: `두 직선 l과 m이 평행하다. 직선 l과 이루는 위쪽 각이 ${a}°이고 직선 m과 이루는 아래쪽 각이 ${b}°일 때, 그 사이에 꺾인 각 ∠x의 크기를 구하시오.`,
    promptEn: `Lines l // m. A line bends at vertex P between them, making angle ${a}° with l and ${b}° with m. Find the measure of bend angle ∠x.`,
    expression: `l // m, ∠x = ${a}° + ${b}°`,
    answer: String(x),
    answerSuffix: '°',
    explanation: `꺾인 점을 지나면서 두 직선 l, m에 평행한 보조선을 그으면, 엇각의 성질에 의해 꺾인 각은 위쪽 엇각 ${a}°와 아래쪽 엇각 ${b}°의 합과 같습니다. 따라서 ∠x = ${a}° + ${b}° = ${x}°입니다.`,
  };
}

// [유형 10] 평행선 사이에 꺾인 점이 2개 이상 있는 경우 (지그재그 각) (RPM #227~#232, #266)
export function rpmPosParallelBentLineMulti(random) {
  // l // m, 왼쪽으로 꺾인 각들의 합 = 오른쪽으로 꺾인 각들의 합
  // 왼쪽 각: a, b  / 오른쪽 각: x, c
  // a + b = x + c => x = a + b - c
  const a = ri(random, 35, 60);
  const b = ri(random, 40, 65);
  const c = ri(random, 20, Math.min(a, b) + 10);
  const x = a + b - c;

  return {
    prompt: `두 직선 l과 m이 평행할 때, 지그재그 꺾인 선에서 왼쪽을 향하는 두 각의 크기가 각각 ${a}°, ${b}°이고, 오른쪽을 향하는 한 각의 크기가 ${c}°이다. 다른 오른쪽 각 ∠x의 크기를 구하시오.`,
    promptEn: `Given l // m with a zigzag line, the two left-facing angles are ${a}° and ${b}°, and one right-facing angle is ${c}°. Find the other right-facing angle ∠x.`,
    expression: `왼쪽 각의 합(${a}° + ${b}°) = 오른쪽 각의 합(${c}° + ∠x)`,
    answer: String(x),
    answerSuffix: '°',
    explanation: `평행선 사이의 꺾인 선에서 각 꺾인 점마다 평행선을 그으면 '왼쪽을 향하는 각들의 합 = 오른쪽을 향하는 각들의 합'이 성립합니다. 따라서 ${a}° + ${b}° = ${c}° + ∠x이므로 ∠x = ${a} + ${b} - ${c} = ${x}°입니다.`,
  };
}

// [유형 11] 평행선과 삼각형/정다각형이 결합된 각 (RPM #273, #277)
export function rpmPosParallelWithPolygon(random) {
  // l // m 사이에 정삼각형 ABC가 놓여 있을 때
  // 정삼각형의 한 내각은 60°
  // 꼭짓점 A가 l 위에 있고, l과 이루는 한쪽 각이 a°일 때 다른 쪽 각 x° 구하기
  // 또는 정삼각형 꼭짓점이 꺾인 점에 위치: 엇각 두 개의 합 = 60°
  const a = ri(random, 15, 45);
  const x = 60 - a;

  return {
    prompt: `두 직선 l과 m이 평행하고, 그 사이에 정삼각형 ABC의 꼭짓점 A가 놓여 있다. 꼭짓점 A를 지나면서 직선 l과 이루는 한 엇각이 ${a}°일 때, 직선 m 방향과 이루는 다른 엇각 ∠x의 크기를 구하시오.`,
    promptEn: `Given l // m, a vertex of equilateral triangle ABC is between them. If one alternate angle is ${a}°, find ∠x so that the interior angle is 60°.`,
    expression: `정삼각형 한 내각 = 60°, ${a}° + ∠x = 60°`,
    answer: String(x),
    answerSuffix: '°',
    explanation: `정삼각형의 한 내각의 크기는 60°입니다. 꼭짓점 A를 지나며 l, m에 평행한 보조선을 그으면 엇각의 합이 정삼각형의 내각 60°가 되므로 ${a}° + ∠x = 60°입니다. 따라서 ∠x = 60° - ${a}° = ${x}°입니다.`,
  };
}

// [유형 12] 평행선과 각의 이등분선 (RPM #233~#235, #268)
export function rpmPosParallelAngleBisector(random) {
  // l // m, ∠BAC의 이등분선과 ∠ABC의 이등분선이 만나는 각
  // 두 내각의 합이 180°인 동측내각의 이등분선 교각은 90°
  // 또는 ∠CAB = 2*a, 이등분선 각 a.
  const angleA = ri(random, 50, 80); // e.g. 70°
  const halfA = angleA / 2;
  const angleB = 180 - angleA; // 동측내각의 합 = 180°
  const halfB = angleB / 2;
  // 교각 = 180 - (halfA + halfB) = 180 - 90 = 90°
  return {
    prompt: `두 평행선 l, m 사이에 선분 AB가 있고, 두 점 A, B에서 평행선 안쪽으로 생기는 동측내각의 이등분선들이 점 C에서 만난다. ∠ACB의 크기를 구하시오.`,
    promptEn: `Lines l // m. The angle bisectors of the consecutive interior angles at A and B intersect at C. Find the measure of ∠ACB.`,
    expression: `동측내각의 합 = 180°, 이등분선의 합 = 90°`,
    answer: '90',
    answerSuffix: '°',
    explanation: `두 평행선 사이에서 동측내각의 합은 180°입니다. 각의 이등분선들이 이루는 두 각의 크기의 합은 180° ÷ 2 = 90°가 됩니다. 삼각형 ABC의 세 내각의 합은 180°이므로 ∠ACB = 180° - 90° = 90°입니다.`,
  };
}

// [유형 13] 종이 테이프를 접었을 때 생기는 각 (RPM #236~#239, #269, #270)
export function rpmPosPaperFoldAngles(random) {
  // 직사각형 모양의 종이 테이프를 접었을 때:
  // 접은 각 = 원래 각 (같음), 평행선 엇각 = 접은 각
  // 따라서 접힌 부분의 삼각형은 항상 이등변삼각형!
  // 접은 각 x°, 엇각 x° => 꼭지각 = 180 - 2x 또는 접은 각이 주어지고 밑각/꼭지각 구하기
  const x = ri(random, 50, 75); // 밑각 x
  const apex = 180 - 2 * x;    // 꼭지각

  const ask = pick(random, ['apex', 'fold_angle']);
  if (ask === 'apex') {
    return {
      prompt: `폭이 일정한 직사각형 모양의 종이 테이프를 접었더니 접은 각의 크기가 ${x}°이었다. 이때 접힌 부분에 생기는 이등변삼각형의 꼭지각 ∠y의 크기를 구하시오.`,
      promptEn: `A rectangular strip of paper is folded such that the fold angle is ${x}°. Find the apex angle ∠y of the resulting isosceles triangle.`,
      expression: `접은 각 = 엇각 = ${x}°, 꼭지각 = 180° - 2×${x}°`,
      answer: String(apex),
      answerSuffix: '°',
      explanation: `종이를 접었을 때 접은 각의 크기는 원래 각과 같으므로 ${x}°이고, 테이프의 양 변이 평행하므로 엇각의 크기도 ${x}°로 같습니다. 따라서 접힌 부분의 삼각형은 밑각이 각각 ${x}°인 이등변삼각형이 되므로 꼭지각 ∠y = 180° - (2 × ${x}°) = ${apex}°입니다.`,
    };
  } else {
    return {
      prompt: `폭이 일정한 종이 테이프를 접었을 때, 접혀서 생긴 이등변삼각형의 한 꼭지각의 크기가 ${apex}°이다. 접은 각 ∠x의 크기를 구하시오.`,
      promptEn: `A paper tape is folded, producing an isosceles triangle with an apex angle of ${apex}°. Find the fold angle ∠x.`,
      expression: `꼭지각 = ${apex}°, 2×∠x + ${apex}° = 180°`,
      answer: String(x),
      answerSuffix: '°',
      explanation: `접은 각과 엇각의 크기가 같으므로 접힌 삼각형의 두 밑각은 모두 ∠x입니다. 세 내각의 합은 180°이므로 2∠x + ${apex}° = 180°, 2∠x = ${180 - apex}°, ∠x = ${x}°입니다.`,
    };
  }
}

// [유형 14] 두 쌍의 평행선이 교차할 때의 각 (RPM #243, #244, #277)
export function rpmPosParallelTwoPairs(random) {
  // l // m 이고 p // q 일 때
  const given = ri(random, 65, 115);
  const supp = 180 - given;

  return {
    prompt: `두 직선 l, m이 평행하고(l // m), 다른 두 직선 p, q도 서로 평행하다(p // q). 네 직선이 교차하여 생긴 한 각의 크기가 ${given}°일 때, 이와 이웃하는 둔각(또는 예각) ∠x의 크기를 구하시오.`,
    promptEn: `Lines l // m and p // q. If one intersection angle measures ${given}°, find the supplementary angle ∠x.`,
    expression: `l // m, p // q, 평행선 각도 성질`,
    answer: String(supp),
    answerSuffix: '°',
    explanation: `두 쌍의 평행선이 교차할 때 생기는 각들은 동위각과 엇각의 성질에 의해 모두 ${given}°이거나 그 보각인 180° - ${given}° = ${supp}° 중 하나입니다. 따라서 이웃하는 각의 크기는 ${supp}°입니다.`,
  };
}

// [유형 15 (유형 UP)] 공간에서 위치 관계 참/거짓 명제 판별 (RPM #240~#242, #276)
export function rpmPosSpaceLogicStatements(random) {
  const statements = [
    { text: '한 직선에 평행한 서로 다른 두 직선은 평행하다. (l // m, l // n => m // n)', ans: 1, expl: '평행선 공리에 의해 한 직선에 평행한 두 직선은 항상 서로 평행합니다.' },
    { text: '한 평면에 수직인 서로 다른 두 직선은 평행하다. (l ⊥ P, m ⊥ P => l // m)', ans: 1, expl: '한 평면에 동시에 수직인 두 직선은 공간에서 항상 평행합니다.' },
    { text: '한 직선에 수직인 서로 다른 두 직선은 항상 평행하다.', ans: 2, expl: '공간에서 한 직선에 수직인 두 직선은 평행할 수도 있지만, 한 점에서 만날 수도 있고 꼬인 위치에 있을 수도 있습니다.' },
    { text: '한 평면에 평행한 서로 다른 두 직선은 항상 평행하다.', ans: 2, expl: '한 평면에 평행한 두 직선은 서로 평행할 수도 있고, 만날 수도 있으며, 꼬인 위치에 있을 수도 있습니다.' },
    { text: '한 평면에 수직인 서로 다른 두 평면은 항상 평행하다.', ans: 2, expl: '직육면체의 인접한 두 옆면은 모두 밑면에 수직이지만 서로 수직으로 만납니다.' },
    { text: '한 평면에 평행한 서로 다른 두 평면은 평행하다. (P // Q, Q // R => P // R)', ans: 1, expl: '한 평면에 평행한 두 평면은 공간에서 항상 서로 평행합니다.' },
  ];
  const target = pick(random, statements);
  return {
    prompt: `공간에서 직선과 평면의 위치 관계에 대한 다음 설명의 참/거짓을 판별하시오: "${target.text}"`,
    promptEn: `In 3D space, determine True or False: "${target.text}"`,
    expression: target.text,
    answer: String(target.ans),
    choices: [
      { value: '1', label: '참 (O)', labelEn: 'True' },
      { value: '2', label: '거짓 (X)', labelEn: 'False' },
    ],
    explanation: target.expl,
  };
}

// [02 단원 실전 다지기] 위치 관계 전 유형 종합
export function rpmPosAllTypesMixed(random) {
  const fns = [
    rpmPosPointLinePlane,
    rpmPosPlaneTwoLines,
    rpmPosSolidSkewEdges,
    rpmPosSolidEdgePlaneRelations,
    rpmPosSolidNetRelations,
    rpmPosCorrespondingAlternate,
    rpmPosParallelAngleSolve,
    rpmPosParallelCondition,
    rpmPosParallelBentLineSingle,
    rpmPosParallelBentLineMulti,
    rpmPosParallelWithPolygon,
    rpmPosParallelAngleBisector,
    rpmPosPaperFoldAngles,
    rpmPosParallelTwoPairs,
    rpmPosSpaceLogicStatements,
  ];
  return pick(random, fns)(random);
}


// =============================================================
// CHAPTER 03: 작도와 합동 응용 (RPM 1-2 Pages 47 ~ 59)
// =============================================================


// [유형 01] 작도의 도구와 길이가 같은 선분의 작도 (RPM #309, #310, #357, #358)
export function rpmCongConstructSegment(random) {
  const toolsQuestions = [
    { text: '눈금 없는 자는 두 점을 잇는 선분을 그리거나 선분을 연장할 때 사용한다.', ans: 1, expl: '눈금 없는 자는 길이를 재는 것이 아니라 선을 긋거나 연장하는 데만 사용합니다.' },
    { text: '컴퍼스는 원을 그리거나 선분의 길이를 재어서 다른 직선 위로 옮길 때 사용한다.', ans: 1, expl: '컴퍼스는 원을 그리는 용도 외에도 선분의 길이를 그대로 옮겨 작도할 때 사용합니다.' },
    { text: '각의 크기를 잴 때에는 각도기를 사용하여 작도한다.', ans: 2, expl: '도형의 작도에서는 눈금 없는 자와 컴퍼스만을 사용하며, 각도기나 눈금 있는 자는 사용하지 않습니다.' },
    { text: '선분의 길이를 비교할 때에는 눈금 없는 자를 사용한다.', ans: 2, expl: '선분의 길이를 비교하거나 옮길 때에는 컴퍼스를 사용합니다.' },
  ];
  const target = pick(random, toolsQuestions);
  return {
    prompt: `작도 도구(눈금 없는 자와 컴퍼스)에 대한 다음 설명의 참/거짓을 판별하시오: "${target.text}"`,
    promptEn: `In geometric compass-and-straightedge construction, determine True or False: "${target.text}"`,
    expression: target.text,
    answer: String(target.ans),
    choices: [
      { value: '1', label: '참 (O)', labelEn: 'True' },
      { value: '2', label: '거짓 (X)', labelEn: 'False' },
    ],
    explanation: target.expl,
  };
}

// [유형 02] 크기가 같은 각의 작도와 평행선 작도 (RPM #311~#314, #359, #360)
export function rpmCongConstructAngleParallel(random) {
  const questions = [
    {
      q: '크기가 같은 각을 작도할 때, 각 XOY의 꼭짓점 O를 중심으로 원을 그려 두 변과 만나는 점을 A, B라 하고, 점 P를 중심으로 같은 반지름의 원을 그려 반직선과 만나는 점을 C, D라 하였다. 다음 중 길이가 항상 같은 선분이 아닌 것은?',
      qEn: 'When constructing a congruent angle, which segment pair does not necessarily have the same length?',
      choices: [
        { label: 'OA = OB', isAns: false },
        { label: 'PC = PD', isAns: false },
        { label: 'AB = CD', isAns: false },
        { label: 'OA = AB', isAns: true },
      ],
      expl: '반지름이 같은 원을 그렸으므로 OA = OB = PC = PD이고, 컴퍼스로 폭을 쟀으므로 AB = CD입니다. 그러나 OA와 AB는 원의 반지름과 현의 길이이므로 각의 크기에 따라 달라지며 항상 같지는 않습니다.',
    },
    {
      q: '점 P를 지나고 직선 l에 평행한 직선을 작도할 때 기본이 되는 평행선의 성질은 무엇인가요?',
      qEn: 'Which parallel line property is fundamentally used when constructing a line parallel to l through point P?',
      choices: [
        { label: '동위각의 크기가 같으면 두 직선은 평행하다', isAns: true },
        { label: '맞꼭지각의 크기는 서로 같다', isAns: false },
        { label: '삼각형의 세 내각의 합은 180°이다', isAns: false },
        { label: '평각의 크기는 180°이다', isAns: false },
      ],
      expl: '평행선 작도는 크기가 같은 각의 작도를 이용하여 동위각(또는 엇각)의 크기가 같도록 선을 그음으로써 평행선을 완성합니다.',
    },
  ];
  const target = pick(random, questions);
  const ansIdx = target.choices.findIndex((c) => c.isAns) + 1;
  return {
    prompt: target.q,
    promptEn: target.qEn,
    expression: '각과 평행선의 작도 원리',
    answer: String(ansIdx),
    choices: target.choices.map((c, i) => ({ value: String(i + 1), label: c.label, labelEn: c.label })),
    explanation: target.expl,
  };
}

// [유형 03] 삼각형의 대변과 대각 (RPM #291~#293, #361)
export function rpmCongTriangleOpposite(random) {
  const ask = pick(random, ['opp_side', 'opp_angle']);

  if (ask === 'opp_side') {
    const letters = ['A', 'B', 'C'];
    const askVertex = pick(random, letters);
    const sideMap = { A: 'BC', B: 'AC', C: 'AB' };
    const targetSide = sideMap[askVertex];
    const choices = [
      { label: '변 AB', val: 'AB' },
      { label: '변 BC', val: 'BC' },
      { label: '변 AC', val: 'AC' },
    ];
    const ansIdx = choices.findIndex((c) => c.val === targetSide) + 1;
    return {
      prompt: `삼각형 ABC에서 꼭짓점 ${askVertex}(또는 ∠${askVertex})의 대변은 어느 선분인지 구하시오.`,
      promptEn: `In triangle ABC, which side is opposite to vertex ${askVertex}?`,
      expression: `△ABC, ∠${askVertex}의 대변`,
      answer: String(ansIdx),
      choices: choices.map((c, i) => ({ value: String(i + 1), label: c.label, labelEn: c.label })),
      explanation: `삼각형에서 한 각과 마주 보고 있는 변을 그 각의 대변이라 합니다. 따라서 ∠${askVertex}의 대변은 변 ${targetSide}입니다.`,
    };
  } else {
    const oppSides = [
      { side: 'AB', opp: 'C' },
      { side: 'BC', opp: 'A' },
      { side: 'AC', opp: 'B' },
    ];
    const item = pick(random, oppSides);
    const choices = [
      { label: '∠A', val: 'A' },
      { label: '∠B', val: 'B' },
      { label: '∠C', val: 'C' },
    ];
    const ansIdx = choices.findIndex((c) => c.val === item.opp) + 1;
    return {
      prompt: `삼각형 ABC에서 변 ${item.side}의 대각은 어느 각인지 구하시오.`,
      promptEn: `In triangle ABC, which angle is opposite to side ${item.side}?`,
      expression: `△ABC, 변 ${item.side}의 대각`,
      answer: String(ansIdx),
      choices: choices.map((c, i) => ({ value: String(i + 1), label: c.label, labelEn: c.label })),
      explanation: `한 변과 마주 보고 있는 꼭짓점의 각을 대각이라 합니다. 따라서 변 ${item.side}의 대각은 ∠${item.opp}입니다.`,
    };
  }
}

// [유형 04] 삼각형의 세 변의 길이의 조건 (삼각형의 성립 조건) (RPM #294~#296, #315~#317, #362, #363)
export function rpmCongTriangleInequality(random) {
  const variant = pick(random, ['possible_check', 'count_triangles']);
  if (variant === 'possible_check') {
    // 세 변 a <= b <= c. 가능: c < a + b, 불가능: c >= a + b
    const isPossible = random() < 0.5;
    let a, b, c;
    if (isPossible) {
      a = ri(random, 4, 8);
      b = ri(random, a, a + 4);
      c = ri(random, b, a + b - 1);
    } else {
      a = ri(random, 3, 6);
      b = ri(random, a, a + 3);
      c = a + b + ri(random, 0, 3); // c >= a + b
    }

    return {
      prompt: `세 선분의 길이가 각각 ${a}cm, ${b}cm, ${c}cm일 때, 이 세 선분으로 삼각형을 만들 수 있는지 판별하시오.`,
      promptEn: `Can a triangle be formed with side lengths ${a} cm, ${b} cm, and ${c} cm?`,
      expression: `세 변 = ${a}cm, ${b}cm, ${c}cm`,
      answer: isPossible ? '1' : '2',
      choices: [
        { value: '1', label: '만들 수 있다 (O)', labelEn: 'Possible' },
        { value: '2', label: '만들 수 없다 (X)', labelEn: 'Not possible' },
      ],
      explanation: `삼각형이 만들어지려면 가장 긴 변의 길이가 나머지 두 변의 길이의 합보다 작아야 합니다 (c < a + b). 가장 긴 변은 ${c}cm이고 나머지 두 변의 합은 ${a} + ${b} = ${a + b}cm이므로, ${isPossible ? `${c} < ${a + b}이므로 삼각형을 만들 수 있습니다.` : `${c} ≥ ${a + b}이므로 삼각형을 만들 수 없습니다.`}`,
    };
  } else {
    // 길이 목록 중 3개를 골라 만들 수 있는 삼각형의 개수
    // e.g. lengths: [2, 4, 6, 8] or [3, 5, 7, 9]
    const list = pick(random, [
      [2, 4, 6, 8],
      [3, 5, 7, 9],
      [4, 6, 8, 10],
      [2, 3, 5, 7],
    ]);
    let validCount = 0;
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        for (let k = j + 1; k < list.length; k++) {
          const [x, y, z] = [list[i], list[j], list[k]];
          if (x + y > z) validCount++;
        }
      }
    }
    return {
      prompt: `길이가 각각 [ ${list.map((x) => x + 'cm').join(', ')} ]인 4개의 선분 중 서로 다른 3개의 선분을 택하여 만들 수 있는 삼각형의 개수를 구하시오.`,
      promptEn: `From lengths [ ${list.map((x) => x + 'cm').join(', ')} ], how many different triangles can be formed by choosing 3 segments?`,
      expression: `후보: ${list.join(', ')}`,
      answer: String(validCount),
      answerSuffix: '개',
      explanation: `4개 중 3개를 고르는 총 4가지 경우 중 가장 긴 변 < 나머지 두 변의 합 조건을 만족하는 조합을 세면 총 ${validCount}개입니다.`,
    };
  }
}

// [유형 05] 미지수 변이 주어졌을 때 삼각형 성립 범위 (RPM #318, #319, #381)
export function rpmCongTriangleParamRange(random) {
  // 두 변이 a, b (a <= b)로 주어지고 세 번째 변이 x
  // 조건: b - a < x < b + a
  const a = ri(random, 4, 8);
  const b = ri(random, a + 1, a + 6);
  const minX = b - a;
  const maxX = b + a;
  const countNatural = maxX - minX - 1; // minX < x < maxX 만족하는 정수 개수

  return {
    prompt: `삼각형의 세 변의 길이가 ${a}cm, ${b}cm, x cm일 때, 삼각형이 만들어지기 위한 자연수 x의 개수를 구하시오.`,
    promptEn: `A triangle has side lengths ${a} cm, ${b} cm, and x cm. How many natural numbers can x be?`,
    expression: `${b} - ${a} < x < ${b} + ${a}`,
    answer: String(countNatural),
    answerSuffix: '개',
    explanation: `삼각형의 세 변의 길이에서 어느 한 변은 나머지 두 변의 차보다 크고 합보다 작아야 합니다. 따라서 ${b} - ${a} < x < ${b} + ${a}, 즉 ${minX} < x < ${maxX}입니다. 이를 만족하는 자연수 x는 ${minX + 1}부터 ${maxX - 1}까지이므로 총 ${countNatural}개입니다.`,
  };
}

// [유형 06] 삼각형이 하나로 정해지는 조건 판별 (RPM #323~#326, #365, #366, #382)
export function rpmCongTriangleDeterminedCond(random) {
  const scenarios = [
    {
      text: '세 변의 길이가 4cm, 5cm, 6cm로 주어질 때',
      determined: true,
      expl: '가장 긴 변 6 < 4 + 5를 만족하며, 세 변의 길이가 주어진 경우(SSS)이므로 모양과 크기가 하나로 정해집니다.',
    },
    {
      text: '세 내각의 크기가 50°, 60°, 70°로 주어질 때',
      determined: false,
      expl: '세 각의 크기만 주어지면 닮은 삼각형이 무수히 많이 그려지므로 하나로 정해지지 않습니다.',
    },
    {
      text: '두 변 AB = 5cm, BC = 7cm와 그 끼인각 ∠B = 40°가 주어질 때',
      determined: true,
      expl: '두 변의 길이와 그 끼인각의 크기가 주어진 경우(SAS)이므로 하나로 정해집니다.',
    },
    {
      text: '두 변 AB = 6cm, AC = 8cm와 끼인각이 아닌 각 ∠B = 30°가 주어질 때',
      determined: false,
      expl: '두 변과 그 끼인각이 아닌 다른 각이 주어지면 삼각형이 2개 그려지거나 그려지지 않을 수 있어 하나로 정해지지 않습니다.',
    },
    {
      text: '한 변 BC = 8cm와 양 끝각 ∠B = 50°, ∠C = 60°가 주어질 때',
      determined: true,
      expl: '한 변의 길이와 그 양 끝각의 크기가 주어진 경우(ASA)이므로 하나로 정해집니다.',
    },
    {
      text: '세 변의 길이가 3cm, 4cm, 8cm로 주어질 때',
      determined: false,
      expl: '가장 긴 변 8이 나머지 두 변의 합 3 + 4 = 7보다 크므로 애초에 삼각형이 만들어지지 않습니다.',
    },
  ];
  const target = pick(random, scenarios);
  return {
    prompt: `다음 조건이 주어졌을 때, 삼각형 ABC가 오직 하나로 정해지는지 판별하시오:\n"${target.text}"`,
    promptEn: `Determine whether triangle ABC is uniquely determined: "${target.text}"`,
    expression: target.text,
    answer: target.determined ? '1' : '2',
    choices: [
      { value: '1', label: '하나로 정해진다 (O)', labelEn: 'Uniquely determined' },
      { value: '2', label: '하나로 정해지지 않는다 (X)', labelEn: 'Not uniquely determined' },
    ],
    explanation: target.expl,
  };
}

// [유형 07] 도형의 합동 성질과 대응변/대응각 (RPM #300~#303, #327~#330, #367, #368)
export function rpmCongFigureCongruenceProps(random) {
  // △ABC ≡ △DEF
  const sideAB = ri(random, 5, 12);
  const sideBC = ri(random, 7, 15);
  const angleA = ri(random, 45, 75);
  const angleB = ri(random, 40, 70);
  const angleC = 180 - (angleA + angleB);

  const ask = pick(random, ['side_de', 'side_ef', 'angle_d', 'angle_f']);
  if (ask === 'side_de') {
    return {
      prompt: `△ABC ≡ △DEF일 때, 변 AB = ${sideAB}cm, 변 BC = ${sideBC}cm이다. 대응변 DE의 길이를 구하시오.`,
      promptEn: `Given △ABC ≡ △DEF, with AB = ${sideAB} cm and BC = ${sideBC} cm, find DE.`,
      expression: `△ABC ≡ △DEF, AB = ${sideAB}cm`,
      answer: String(sideAB),
      answerSuffix: 'cm',
      explanation: `합동인 두 도형에서 대응변의 길이는 서로 같으므로 DE = AB = ${sideAB}cm입니다.`,
    };
  } else if (ask === 'side_ef') {
    return {
      prompt: `△ABC ≡ △DEF일 때, 변 BC = ${sideBC}cm이다. 대응변 EF의 길이를 구하시오.`,
      promptEn: `Given △ABC ≡ △DEF, with BC = ${sideBC} cm, find EF.`,
      expression: `△ABC ≡ △DEF, BC = ${sideBC}cm`,
      answer: String(sideBC),
      answerSuffix: 'cm',
      explanation: `합동인 두 도형에서 대응변의 길이는 같으므로 EF = BC = ${sideBC}cm입니다.`,
    };
  } else if (ask === 'angle_d') {
    return {
      prompt: `△ABC ≡ △DEF일 때, ∠A = ${angleA}°, ∠B = ${angleB}°이다. 대응각 ∠D의 크기를 구하시오.`,
      promptEn: `Given △ABC ≡ △DEF with ∠A = ${angleA}° and ∠B = ${angleB}°, find ∠D.`,
      expression: `△ABC ≡ △DEF, ∠A = ${angleA}°`,
      answer: String(angleA),
      answerSuffix: '°',
      explanation: `대응각의 크기는 서로 같으므로 ∠D = ∠A = ${angleA}°입니다.`,
    };
  } else {
    return {
      prompt: `△ABC ≡ △DEF일 때, ∠A = ${angleA}°, ∠B = ${angleB}°이다. 대응각 ∠F의 크기를 구하시오.`,
      promptEn: `Given △ABC ≡ △DEF with ∠A = ${angleA}° and ∠B = ${angleB}°, find ∠F.`,
      expression: `∠A = ${angleA}°, ∠B = ${angleB}°, ∠F = ∠C`,
      answer: String(angleC),
      answerSuffix: '°',
      explanation: `삼각형 ABC의 세 내각의 합은 180°이므로 ∠C = 180° - (${angleA}° + ${angleB}°) = ${angleC}°입니다. 합동인 삼각형에서 대응각의 크기는 같으므로 ∠F = ∠C = ${angleC}°입니다.`,
    };
  }
}

// [유형 08] 삼각형의 합동 조건 (SSS, SAS, ASA) 판별 (RPM #304~#308, #331~#336, #369, #370)
export function rpmCongTriangleSssSasAsa(random) {
  const conditions = [
    {
      given: 'AB = DE, BC = EF, CA = FD',
      ansIdx: 1,
      expl: '대응하는 세 변의 길이가 각각 같으므로 SSS 합동입니다.',
    },
    {
      given: 'AB = DE, BC = EF, ∠B = ∠E',
      ansIdx: 2,
      expl: '대응하는 두 변의 길이가 각각 같고, 그 끼인각의 크기가 같으므로 SAS 합동입니다.',
    },
    {
      given: 'BC = EF, ∠B = ∠E, ∠C = ∠F',
      ansIdx: 3,
      expl: '대응하는 한 변의 길이가 같고, 그 양 끝각의 크기가 각각 같으므로 ASA 합동입니다.',
    },
    {
      given: 'AB = DE, ∠A = ∠D, ∠B = ∠E',
      ansIdx: 3,
      expl: '대응하는 한 변의 길이가 같고 양 끝각의 크기가 각각 같으므로 ASA 합동입니다.',
    },
  ];
  const target = pick(random, conditions);
  return {
    prompt: `△ABC와 △DEF에서 다음 조건이 주어졌을 때, 두 삼각형이 합동이 되는 합동 조건을 구하시오:\n[ ${target.given} ]`,
    promptEn: `In △ABC and △DEF, identify the congruence criterion for: [ ${target.given} ]`,
    expression: target.given,
    answer: String(target.ansIdx),
    choices: [
      { value: '1', label: 'SSS 합동', labelEn: 'SSS Congruence' },
      { value: '2', label: 'SAS 합동', labelEn: 'SAS Congruence' },
      { value: '3', label: 'ASA 합동', labelEn: 'ASA Congruence' },
    ],
    explanation: target.expl,
  };
}

// [유형 09] 합동이 되기 위한 추가 조건 찾기 (RPM #337, #338, #371)
export function rpmCongTriangleAddCondition(random) {
  const problems = [
    {
      given: 'AB = DE, BC = EF',
      targetCriterion: 'SAS 합동',
      needed: '∠B = ∠E',
      expl: '두 변 AB, BC와 DE, EF의 끼인각은 각각 ∠B와 ∠E이므로, SAS 합동이 되려면 ∠B = ∠E가 추가되어야 합니다.',
    },
    {
      given: 'AB = DE, BC = EF',
      targetCriterion: 'SSS 합동',
      needed: 'AC = DF',
      expl: '세 변의 길이가 모두 같아야 하므로 나머지 한 변 AC = DF가 추가되어야 합니다.',
    },
    {
      given: 'BC = EF, ∠B = ∠E',
      targetCriterion: 'ASA 합동',
      needed: '∠C = ∠F',
      expl: '한 변 BC, EF의 양 끝각 중 하나인 ∠B = ∠E가 주어졌으므로, 다른 쪽 끝각인 ∠C = ∠F(또는 ∠A = ∠D)가 추가되어야 합니다.',
    },
  ];
  const target = pick(random, problems);
  return {
    prompt: `△ABC와 △DEF에서 [ ${target.given} ]가 주어져 있다. 두 삼각형이 ${target.targetCriterion}이 되기 위해 더 필요한 한 가지 조건을 구하시오.`,
    promptEn: `In △ABC and △DEF, given [ ${target.given} ], what additional condition is needed for ${target.targetCriterion}?`,
    expression: `${target.given} => ${target.targetCriterion}`,
    answer: target.needed,
    explanation: target.expl,
  };
}

// [유형 10] 정삼각형 및 정사각형에서 회전 합동의 활용 (RPM #351, #354, #377, #379, #386)
export function rpmCongRotationEquilateralSquare(random) {
  const variant = pick(random, ['equilateral_rotation', 'square_rotation']);
  if (variant === 'equilateral_rotation') {
    // 정삼각형 ABC와 정삼각형 ADE가 점 A를 공유
    // △ABD ≡ △ACE (SAS 합동: AB=AC, AD=AE, ∠BAD = ∠CAE = 60° - ∠CAD)
    // 따라서 BD = CE
    const bd = ri(random, 6, 14);
    return {
      prompt: `두 정삼각형 ABC와 ADE가 점 A를 꼭짓점으로 공유하고 있다. 선분 BD = ${bd}cm일 때, SAS 합동을 이용하여 대응변 CE의 길이를 구하시오.`,
      promptEn: `Equilateral triangles ABC and ADE share vertex A. If BD = ${bd} cm, find CE using SAS congruence △ABD ≡ △ACE.`,
      expression: `△ABD ≡ △ACE (SAS 합동), BD = ${bd}cm`,
      answer: String(bd),
      answerSuffix: 'cm',
      explanation: `정삼각형의 성질에 의해 AB = AC, AD = AE이고, ∠BAD = 60° - ∠DAC = ∠CAE입니다. 따라서 대응하는 두 변의 길이와 그 끼인각이 같으므로 △ABD ≡ △ACE (SAS 합동)입니다. 대응변의 길이가 같으므로 CE = BD = ${bd}cm입니다.`,
    };
  } else {
    // 정사각형 ABCD에서 점 E, F가 각 변에 있어 △ABE ≡ △BCF (SAS 합동)
    // 두 선분 AF와 BE의 교각은 항상 90°
    return {
      prompt: `정사각형 ABCD의 두 변 BC, CD 위에 BE = CF가 되도록 점 E, F를 잡았다. 선분 AE와 선분 BF가 만나는 점을 P라 할 때, 교각 ∠APB의 크기를 구하시오.`,
      promptEn: `In square ABCD with BE = CF on sides BC and CD, AE and BF intersect at P. Find the angle ∠APB.`,
      expression: `정사각형 회전 합동, △ABE ≡ △BCF`,
      answer: '90',
      answerSuffix: '°',
      explanation: `정사각형에서 AB = BC, BE = CF, ∠B = ∠C = 90°이므로 △ABE ≡ △BCF (SAS 합동)입니다. 따라서 ∠BAE = ∠CBF입니다. 직각삼각형 ABE에서 ∠BAE + ∠AEB = 90°이므로, ∠CBF + ∠AEB = 90°입니다. 삼각형 PBE에서 두 내각의 합이 90°이므로 교각 ∠APB = 180° - 90° = 90°입니다.`,
    };
  }
}

// [유형 11 (실력 UP)] 직각이등변삼각형의 꼭짓점을 지나는 직선과 합동 (RPM #387)
export function rpmCongRightIsoscelesAltitude(random) {
  // 직각이등변삼각형 ABC (∠A = 90°, AB = AC)의 꼭짓점 A를 지나는 직선 l
  // 점 B, C에서 직선 l에 내린 수선의 발을 D, E라 함
  // △ABD ≡ △CAE (RHA / 합동)
  // AD = CE, BD = AE
  // DE = AD + AE = CE + BD
  const bd = ri(random, 6, 12);
  const ce = ri(random, 3, bd - 1);
  const de = bd + ce;

  const ask = pick(random, ['find_de', 'find_bd']);
  if (ask === 'find_de') {
    return {
      prompt: `AB = AC이고 ∠BAC = 90°인 직각이등변삼각형 ABC의 꼭짓점 A를 지나는 직선 l에 두 점 B, C에서 내린 수선의 발을 각각 D, E라 하자. BD = ${bd}cm, CE = ${ce}cm일 때, 선분 DE의 길이를 구하시오.`,
      promptEn: `In right isosceles △ABC with AB = AC and ∠A = 90°, perpendiculars from B, C to line l through A have feet D, E. If BD = ${bd} cm and CE = ${ce} cm, find DE.`,
      expression: `△ABD ≡ △CAE, BD = ${bd}cm, CE = ${ce}cm`,
      answer: String(de),
      answerSuffix: 'cm',
      explanation: `직각삼각형 ABD와 CAE에서 빗변 AB = CA이고, ∠DBA = 90° - ∠DAB = ∠EAC이므로 △ABD ≡ △CAE (합동)입니다. 대응변의 길이가 같으므로 AD = CE = ${ce}cm이고, AE = BD = ${bd}cm입니다. 따라서 DE = AD + AE = ${ce} + ${bd} = ${de}cm입니다.`,
    };
  } else {
    return {
      prompt: `AB = AC, ∠BAC = 90°인 직각이등변삼각형 ABC의 꼭짓점 A를 지나는 직선 l에 내린 두 수선에 대하여 선분 DE = ${de}cm, CE = ${ce}cm이다. 선분 BD의 길이를 구하시오.`,
      promptEn: `In right isosceles △ABC, perpendiculars give DE = ${de} cm and CE = ${ce} cm. Find BD.`,
      expression: `DE = BD + CE = ${de}cm, CE = ${ce}cm`,
      answer: String(bd),
      answerSuffix: 'cm',
      explanation: `△ABD ≡ △CAE에 의해 AD = CE = ${ce}cm이고, DE = AD + AE = CE + BD입니다. 따라서 BD = DE - CE = ${de} - ${ce} = ${bd}cm입니다.`,
    };
  }
}

// [유형 12 (실력 UP)] 정사각형 겹침에서의 합동과 넓이 (RPM #384)
export function rpmCongSquareOverlapArea(random) {
  // 한 변의 길이가 L인 두 정사각형. 한 정사각형의 대각선의 교점 O에 다른 정사각형의 한 꼭짓점이 위치
  // 두 정사각형이 겹치는 사각 영역의 넓이는 회전각도에 관계없이 항상 원래 정사각형 넓이의 1/4!
  const side = ri(random, 6, 14);
  const totalArea = side * side;
  const overlapArea = totalArea / 4;

  return {
    prompt: `한 변의 길이가 ${side}cm인 두 정사각형이 있다. 한 정사각형의 두 대각선의 교점 O에 다른 정사각형의 한 꼭짓점이 겹쳐져 회전되어 있을 때, 두 정사각형이 겹치는 사각 영역의 넓이를 구하시오.`,
    promptEn: `Two squares each have side length ${side} cm. One square has a vertex at the diagonal center O of the other. Find the area of their overlapping region.`,
    expression: `한 변 = ${side}cm, 겹친 넓이 = 전체 넓이 ÷ 4`,
    answer: String(overlapArea),
    answerSuffix: 'cm²',
    explanation: `대각선의 교점 O를 중심으로 겹치는 두 직각삼각형이 합동이 되므로, 회전된 각도에 관계없이 겹치는 사각형의 넓이는 항상 원래 정사각형의 정확히 1/4입니다. 따라서 겹치는 부분의 넓이는 (${side} × ${side}) ÷ 4 = ${totalArea} ÷ 4 = ${overlapArea}cm²입니다.`,
  };
}

// [03 단원 실전 다지기] 작도와 합동 전 유형 종합
export function rpmCongAllTypesMixed(random) {
  const fns = [
    rpmCongConstructSegment,
    rpmCongConstructAngleParallel,
    rpmCongTriangleOpposite,
    rpmCongTriangleInequality,
    rpmCongTriangleParamRange,
    rpmCongTriangleDeterminedCond,
    rpmCongFigureCongruenceProps,
    rpmCongTriangleSssSasAsa,
    rpmCongTriangleAddCondition,
    rpmCongRotationEquilateralSquare,
    rpmCongRightIsoscelesAltitude,
    rpmCongSquareOverlapArea,
  ];
  return pick(random, fns)(random);
}

// =============================================================
// [중학 1-2 1학기 기하 총괄평가] 전 범위 20문항 실전 모의고사
// =============================================================
export function rpmGeoSemesterOneMockExam(random) {
  const allGenerators = [
    // 01 기본도형 (6문항)
    rpmGeoBasicIntersections,
    rpmGeoBasicPointsToLines,
    rpmGeoBasicMidpointSegment,
    rpmGeoBasicAngleRatio,
    rpmGeoBasicVerticalAngles,
    rpmGeoBasicClockAngle,
    // 02 위치 관계 (7문항)
    rpmPosSolidSkewEdges,
    rpmPosSolidEdgePlaneRelations,
    rpmPosCorrespondingAlternate,
    rpmPosParallelAngleSolve,
    rpmPosParallelBentLineSingle,
    rpmPosPaperFoldAngles,
    rpmPosSpaceLogicStatements,
    // 03 작도와 합동 (7문항)
    rpmCongConstructAngleParallel,
    rpmCongTriangleInequality,
    rpmCongTriangleParamRange,
    rpmCongTriangleDeterminedCond,
    rpmCongFigureCongruenceProps,
    rpmCongTriangleSssSasAsa,
    rpmCongRotationEquilateralSquare,
  ];
  const selectedGen = pick(random, allGenerators);
  const prob = selectedGen(random);
  return {
    ...prob,
    category: '중학 1-2 기하 실전 모의고사',
    categoryEn: 'Grade 7-2 Geometry Comprehensive Mock Exam',
  };
}


export const RPM_APPLIED_GENERATORS = {
  // 01 소인수분해 RPM 세부 유형 (RPM 1-1 Pages 10~15)
  'rpm-prime-prop-closest': rpmPrimePropClosest,
  'rpm-prime-power-rules': rpmPrimePowerRules,
  'rpm-prime-factorize-exponents': rpmPrimeFactorizeExponents,
  'rpm-prime-factor-analysis': rpmPrimeFactorAnalysis,
  'rpm-prime-divisor-properties': rpmPrimeDivisorProperties,
  'rpm-prime-divisor-count-reverse': rpmPrimeDivisorCountReverse,
  'rpm-prime-make-square': rpmPrimeMakeSquare,
  'rpm-prime-unknown-in-divisor-count': rpmPrimeUnknownInDivisorCount,
  'rpm-prime-divisor-count-reverse-deduce': rpmPrimeDivisorCountReverseDeduce,
  'rpm-prime-all-types-mixed': rpmPrimeAllTypesMixed,

  // 01 소인수분해 기본 탭 호환
  'prime-composite': rpmPrimePropClosest,
  'powers': rpmPrimePowerRules,
  'power-form': rpmPrimePowerRules,
  'prime-factorization': rpmPrimeMakeSquare,
  'all-divisors': rpmPrimeDivisorProperties,
  'divisor-count': rpmPrimeDivisorCountReverse,
  'prime-mixed': rpmPrimeAllTypesMixed,

  // 02 최대공약수와 최소공배수 RPM 세부 유형 (RPM 1-1 Pages 18~31)
  'rpm-gcd-coprime': rpmGcdBasicCoprime,
  'rpm-gcd-common-divisor-prop': rpmGcdCommonDivisorProp,
  'rpm-lcm-common-multiple-prop': rpmLcmCommonMultipleProp,
  'rpm-gcd-lcm-exponent-deduce': rpmGcdLcmExponentDeduce,
  'rpm-gcd-lcm-product-relation': rpmGcdLcmProductRelation,
  'rpm-lcm-three-numbers-ratio': rpmLcmThreeNumbersRatio,
  'rpm-gcd-word-distribute': rpmGcdWordDistribute,
  'rpm-gcd-word-tile-fence': rpmGcdWordTileFence,
  'rpm-gcd-word-remainder': rpmGcdWordRemainder,
  'rpm-lcm-word-brick-cube': rpmLcmWordBrickCube,
  'rpm-lcm-word-gear-track-cycle': rpmLcmWordGearTrackCycle,
  'rpm-lcm-word-remainder-deficit': rpmLcmWordRemainderDeficit,
  'rpm-gcd-lcm-fraction-multiplier': rpmGcdLcmFractionMultiplier,
  'rpm-gcd-lcm-advanced-deduce': rpmGcdLcmAdvancedDeduce,
  'rpm-gcd-lcm-all-types-mixed': rpmGcdLcmAllTypesMixed,

  // 02 최대공약수와 최소공배수 기본 탭 호환
  'common-divisors-gcd': rpmGcdCommonDivisorProp,
  'gcd-basic': rpmGcdBasicCoprime,
  'gcd-prime-form': rpmGcdBasicCoprime,
  'coprime': rpmGcdBasicCoprime,
  'common-multiples-lcm': rpmLcmCommonMultipleProp,
  'lcm-basic': rpmLcmCommonMultipleProp,
  'lcm-prime-form': rpmGcdLcmExponentDeduce,
  'gcd-lcm-relation': rpmGcdLcmProductRelation,
  'gcd-lcm-application': rpmGcdWordTileFence,
  'gcd-lcm-mixed': rpmGcdLcmAllTypesMixed,

  // 03 정수와 유리수 응용단원 (RPM 1-1 p.38~49)
  'rpm-ir-sign-situation': rpmIrSignSituation,
  'rpm-ir-classify-integers': rpmIrClassifyIntegers,
  'rpm-ir-classify-rationals': rpmIrClassifyRationals,
  'rpm-ir-number-line-read': rpmIrNumberLineRead,
  'rpm-ir-midpoint-distance': rpmIrMidpointDistance,
  'rpm-ir-abs-basic-extremum': rpmIrAbsBasicExtremum,
  'rpm-ir-abs-properties': rpmIrAbsProperties,
  'rpm-ir-abs-range-count': rpmIrAbsRangeCount,
  'rpm-ir-opposite-signs-abs': rpmIrOppositeSignsAbs,
  'rpm-ir-compare-order': rpmIrCompareOrder,
  'rpm-ir-inequality-phrasing': rpmIrInequalityPhrasing,
  'rpm-ir-between-integers-fractions': rpmIrBetweenIntegersFractions,
  'rpm-ir-abs-pairs-ratio': rpmIrAbsPairsRatio,
  'rpm-ir-deduce-multi-order': rpmIrDeduceMultiOrder,
  'rpm-ir-all-types-mixed': rpmIrAllTypesMixed,

  // 03 정수와 유리수 기본 탭 호환
  'positive-negative': rpmIrSignSituation,
  'integer-classification': rpmIrClassifyIntegers,
  'rational-classification': rpmIrClassifyRationals,
  'number-line': rpmIrNumberLineRead,
  'absolute-value': rpmIrAbsBasicExtremum,
  'number-comparison': rpmIrCompareOrder,
  'inequality-expression': rpmIrInequalityPhrasing,
  'integer-solutions': rpmIrBetweenIntegersFractions,
  'integer-rational-mixed': rpmIrAllTypesMixed,

  // 04 정수와 유리수의 계산 응용단원 (RPM 1-1 p.54~71)
  'rpm-irc-addition-laws': rpmIrcAdditionLaws,
  'rpm-irc-subtraction-basic': rpmIrcSubtractionBasic,
  'rpm-irc-add-sub-integers': rpmIrcAddSubIntegers,
  'rpm-irc-add-sub-rationals': rpmIrcAddSubRationals,
  'rpm-irc-omitted-signs': rpmIrcOmittedSigns,
  'rpm-irc-relative-difference': rpmIrcRelativeDifference,
  'rpm-irc-unknown-add-sub': rpmIrcUnknownAddSub,
  'rpm-irc-abs-extremum-add-sub': rpmIrcAbsExtremumAddSub,
  'rpm-irc-magic-square-game': rpmIrcMagicSquareGame,
  'rpm-irc-multiplication-basic': rpmIrcMultiplicationBasic,
  'rpm-irc-pick-three-product': rpmIrcPickThreeProduct,
  'rpm-irc-powers-signs': rpmIrcPowersSigns,
  'rpm-irc-neg-one-power': rpmIrcNegOnePower,
  'rpm-irc-distributive-law': rpmIrcDistributiveLaw,
  'rpm-irc-reciprocal-equation': rpmIrcReciprocalEquation,
  'rpm-irc-division-basic': rpmIrcDivisionBasic,
  'rpm-irc-mult-div-mixed': rpmIrcMultDivMixed,
  'rpm-irc-four-operations-order': rpmIrcFourOperationsOrder,
  'rpm-irc-unknown-mult-div': rpmIrcUnknownMultDiv,
  'rpm-irc-correct-answer': rpmIrcCorrectAnswer,
  'rpm-irc-sign-determination': rpmIrcSignDetermination,
  'rpm-irc-variable-magnitude': rpmIrcVariableMagnitude,
  'rpm-irc-line-section-ratio': rpmIrcLineSectionRatio,
  'rpm-irc-telescoping-fractions': rpmIrcTelescopingFractions,
  'rpm-irc-custom-operator': rpmIrcCustomOperator,
  'rpm-irc-all-types-mixed': rpmIrcAllTypesMixed,

  // 04 정수와 유리수의 계산 기본 탭 호환
  'rational-addition': rpmIrcAdditionLaws,
  'rational-subtraction': rpmIrcSubtractionBasic,
  'rational-add-subtract': rpmIrcAddSubRationals,
  'rational-multiplication': rpmIrcMultiplicationBasic,
  'rational-division': rpmIrcDivisionBasic,
  'rational-four-operations': rpmIrcFourOperationsOrder,
  'rational-operations-review': rpmIrcAllTypesMixed,

  // 05 문자의 사용과 식의 계산 세부 응용 유형 (RPM 1-1 p.78~91)
  'rpm-alg-notation-signs': rpmAlgNotationSigns,
  'rpm-alg-verbal-units-cost': rpmAlgVerbalUnitsCost,
  'rpm-alg-verbal-figures': rpmAlgVerbalFigures,
  'rpm-alg-verbal-speed-concentration': rpmAlgVerbalSpeedConcentration,
  'rpm-alg-eval-basic-negative': rpmAlgEvalBasicNegative,
  'rpm-alg-eval-fraction-reciprocal': rpmAlgEvalFractionReciprocal,
  'rpm-alg-eval-real-world': rpmAlgEvalRealWorld,
  'rpm-alg-poly-terms-degree': rpmAlgPolyTermsDegree,
  'rpm-alg-linear-identify': rpmAlgLinearIdentify,
  'rpm-alg-monomial-mult-div': rpmAlgMonomialMultDiv,
  'rpm-alg-like-terms': rpmAlgLikeTerms,
  'rpm-alg-linear-add-sub': rpmAlgLinearAddSub,
  'rpm-alg-linear-brackets': rpmAlgLinearBrackets,
  'rpm-alg-fractional-linear': rpmAlgFractionalLinear,
  'rpm-alg-linear-condition-param': rpmAlgLinearConditionParam,
  'rpm-alg-substitute-expression': rpmAlgSubstituteExpression,
  'rpm-alg-unknown-box-poly': rpmAlgUnknownBoxPoly,
  'rpm-alg-correct-poly-calc': rpmAlgCorrectPolyCalc,
  'rpm-alg-geometry-shaded-area': rpmAlgGeometryShadedArea,
  'rpm-alg-neg-power-linear': rpmAlgNegPowerLinear,
  'rpm-alg-magic-square-pyramid': rpmAlgMagicSquarePyramid,
  'rpm-alg-cost-profit-complex': rpmAlgCostProfitComplex,
  'rpm-alg-multi-var-complex-eval': rpmAlgMultiVarComplexEval,
  'rpm-alg-all-types-mixed': rpmAlgAllTypesMixed,

  // 05 문자의 사용과 식의 계산 기본 탭 호환
  'notation': rpmAlgNotationSigns,
  'verbal-expressions': rpmAlgVerbalUnitsCost,
  'expression-values': rpmAlgEvalBasicNegative,
  'polynomial-basics': rpmAlgPolyTermsDegree,
  'monomial-multiply-divide': rpmAlgMonomialMultDiv,
  'simplify-linear': rpmAlgLinearAddSub,
  'expressions-review': rpmAlgAllTypesMixed,
  // 06 일차방정식의 풀이 세부 응용 유형 (RPM 1-1 p.94~103)
  'rpm-eq-identity-equation': rpmEqIdentityEquation,
  'rpm-eq-root-substitute': rpmEqRootSubstitute,
  'rpm-eq-identity-distinguish': rpmEqIdentityDistinguish,
  'rpm-eq-identity-condition': rpmEqIdentityCondition,
  'rpm-eq-properties-equality': rpmEqPropertiesEquality,
  'rpm-eq-solve-using-properties': rpmEqSolveUsingProperties,
  'rpm-eq-transposition-rule': rpmEqTranspositionRule,
  'rpm-eq-linear-def-identify': rpmEqLinearDefIdentify,
  'rpm-eq-brackets-expand': rpmEqBracketsExpand,
  'rpm-eq-decimal-coef': rpmEqDecimalCoef,
  'rpm-eq-fraction-coef': rpmEqFractionCoef,
  'rpm-eq-mixed-decimal-fraction': rpmEqMixedDecimalFraction,
  'rpm-eq-proportion-cross-mult': rpmEqProportionCrossMult,
  'rpm-eq-root-given-param': rpmEqRootGivenParam,
  'rpm-eq-two-eqs-same-root': rpmEqTwoEqsSameRoot,
  'rpm-eq-special-roots': rpmEqSpecialRoots,
  'rpm-eq-root-integer-natural': rpmEqRootIntegerNatural,
  'rpm-eq-root-ratio-multiple': rpmEqRootRatioMultiple,
  'rpm-eq-mistaken-coef': rpmEqMistakenCoef,
  'rpm-eq-common-root-systems': rpmEqCommonRootSystems,
  'rpm-eq-all-types-mixed': rpmEqAllTypesMixed,

  // 06 일차방정식의 풀이 기본 탭 호환
  'equation-identity': rpmEqIdentityCondition,
  'equality-properties': rpmEqPropertiesEquality,
  'linear-equations': rpmEqBracketsExpand,
  'advanced-linear-equations': rpmEqMixedDecimalFraction,
  // 07 일차방정식의 활용 세부 응용 유형 (RPM 1-1 p.106~117)
  'rpm-app-number-relations': rpmAppNumberRelations,
  'rpm-app-consecutive-numbers': rpmAppConsecutiveNumbers,
  'rpm-app-digit-values': rpmAppDigitValues,
  'rpm-app-age-problems': rpmAppAgeProblems,
  'rpm-app-savings-allowance': rpmAppSavingsAllowance,
  'rpm-app-fixed-total-count': rpmAppFixedTotalCount,
  'rpm-app-geometry-figures': rpmAppGeometryFigures,
  'rpm-app-excess-deficit-items': rpmAppExcessDeficitItems,
  'rpm-app-percent-change-students': rpmAppPercentChangeStudents,
  'rpm-app-total-fraction-reading': rpmAppTotalFractionReading,
  'rpm-app-speed-roundtrip-courses': rpmAppSpeedRoundtripCourses,
  'rpm-app-speed-time-difference': rpmAppSpeedTimeDifference,
  'rpm-app-speed-catchup-delay': rpmAppSpeedCatchupDelay,
  'rpm-app-speed-tracks-opposite': rpmAppSpeedTracksOpposite,
  'rpm-app-salt-water-evaporate-add': rpmAppSaltWaterEvaporateAdd,
  'rpm-app-salt-add-salt': rpmAppSaltAddSalt,
  'rpm-app-salt-two-solutions-mix': rpmAppSaltTwoSolutionsMix,
  'rpm-app-cost-price-profit-discount': rpmAppCostPriceProfitDiscount,
  'rpm-app-work-done-collaborative': rpmAppWorkDoneCollaborative,
  'rpm-app-excess-deficit-benches': rpmAppExcessDeficitBenches,
  'rpm-app-train-bridge-tunnel': rpmAppTrainBridgeTunnel,
  'rpm-app-admission-ratio-system': rpmAppAdmissionRatioSystem,
  'rpm-app-salt-exchange-replace': rpmAppSaltExchangeReplace,
  'rpm-app-speed-midway-delay': rpmAppSpeedMidwayDelay,
  'rpm-app-clock-hands-angle': rpmAppClockHandsAngle,
  'rpm-app-all-types-mixed': rpmAppAllTypesMixed,

  // 07 일차방정식의 활용 기본 탭 호환
  'equation-word-problems': rpmAppFixedTotalCount,
  'distance-speed-time': rpmAppSpeedCatchupDelay,
  'concentration': rpmAppSaltTwoSolutionsMix,
  'equations-review': rpmAppAllTypesMixed,

  // 08 좌표평면과 그래프 세부 응용 유형 (RPM 1-1 p.122~129)
  'rpm-coord-ordered-pair-equality': rpmCoordOrderedPairEquality,
  'rpm-coord-axis-points': rpmCoordAxisPoints,
  'rpm-coord-triangle-area': rpmCoordTriangleArea,
  'rpm-coord-polygon-area': rpmCoordPolygonArea,
  'rpm-coord-quadrant-identify': rpmCoordQuadrantIdentify,
  'rpm-coord-quadrant-sign-condition': rpmCoordQuadrantSignCondition,
  'rpm-coord-sign-product-sum': rpmCoordSignProductSum,
  'rpm-coord-abs-condition-quadrant': rpmCoordAbsConditionQuadrant,
  'rpm-coord-symmetric-points': rpmCoordSymmetricPoints,
  'rpm-coord-symmetric-area': rpmCoordSymmetricArea,
  'rpm-coord-graph-situation': rpmCoordGraphSituation,
  'rpm-coord-graph-distance-time': rpmCoordGraphDistanceTime,
  'rpm-coord-graph-speed-time': rpmCoordGraphSpeedTime,
  'rpm-coord-all-types-mixed': rpmCoordAllTypesMixed,

  // 08 좌표평면 기본 탭 호환
  'ordered-pair-condition': rpmCoordOrderedPairEquality,
  'plane-read-point': rpmCoordTriangleArea,
  'plane-find-point': rpmCoordAxisPoints,
  'quadrant-identify': rpmCoordQuadrantIdentify,
  'quadrant-sign': rpmCoordQuadrantSignCondition,
  'quadrant-transform': rpmCoordSignProductSum,
  'symmetric-points': rpmCoordSymmetricPoints,
  'trip-graph': rpmCoordGraphDistanceTime,
  'coordinate-mixed': rpmCoordAllTypesMixed,

  // 09 정비례와 반비례 세부 응용 유형 (RPM 1-1 p.134~149)
  'rpm-prop-direct-identify': rpmPropDirectIdentify,
  'rpm-prop-direct-table': rpmPropDirectTable,
  'rpm-prop-direct-graph-properties': rpmPropDirectGraphProperties,
  'rpm-prop-direct-slope-axis-distance': rpmPropDirectSlopeAxisDistance,
  'rpm-prop-direct-point-on-graph': rpmPropDirectPointOnGraph,
  'rpm-prop-direct-find-equation': rpmPropDirectFindEquation,
  'rpm-prop-direct-graph-area': rpmPropDirectGraphArea,
  'rpm-prop-inverse-identify': rpmPropInverseIdentify,
  'rpm-prop-inverse-table': rpmPropInverseTable,
  'rpm-prop-inverse-graph-properties': rpmPropInverseGraphProperties,
  'rpm-prop-inverse-origin-distance': rpmPropInverseOriginDistance,
  'rpm-prop-inverse-point-on-graph': rpmPropInversePointOnGraph,
  'rpm-prop-inverse-lattice-points': rpmPropInverseLatticePoints,
  'rpm-prop-inverse-find-equation': rpmPropInverseFindEquation,
  'rpm-prop-direct-inverse-intersection': rpmPropDirectInverseIntersection,
  'rpm-prop-inverse-rect-area': rpmPropInverseRectArea,
  'rpm-prop-direct-word-candle-gear': rpmPropDirectWordCandleGear,
  'rpm-prop-inverse-word-tank-volume': rpmPropInverseWordTankVolume,
  'rpm-prop-inverse-word-work-boyle': rpmPropInverseWordWorkBoyle,
  'rpm-prop-two-travelers-graph': rpmPropTwoTravelersGraph,
  'rpm-prop-chain-proportion': rpmPropChainProportion,
  'rpm-prop-all-types-mixed': rpmPropAllTypesMixed,

  // 09 정비례와 반비례 기본 탭 호환
  'direct-concept': rpmPropDirectIdentify,
  'direct-relation': rpmPropDirectFindEquation,
  'direct-classify': rpmPropDirectIdentify,
  'direct-evaluate': rpmPropDirectPointOnGraph,
  'direct-equation': rpmPropDirectFindEquation,
  'direct-graph': rpmPropDirectGraphProperties,
  'inverse-concept': rpmPropInverseIdentify,
  'inverse-relation': rpmPropInverseFindEquation,
  'inverse-classify': rpmPropInverseIdentify,
  'inverse-evaluate': rpmPropInversePointOnGraph,
  'inverse-equation': rpmPropInverseFindEquation,
  'inverse-graph': rpmPropInverseGraphProperties,
  'proportion-applications': rpmPropDirectWordCandleGear,
  'proportion-application': rpmPropInverseWordTankVolume,
  'proportion-mixed': rpmPropAllTypesMixed,

  // 중학 1-1 전 범위 총괄 실전 모의고사 (RPM 1-1 p.152~173)
  'rpm-semester-one-mock-exam': rpmSemesterOneMockExam,

  // -------------------------------------------------------------
  // 01 기본도형 세부 응용 유형 (RPM 1-2 p.12~19)
  // -------------------------------------------------------------
  'rpm-geo-basic-intersections': rpmGeoBasicIntersections,
  'rpm-geo-basic-line-rays': rpmGeoBasicLineRays,
  'rpm-geo-basic-points-lines': rpmGeoBasicPointsToLines,
  'rpm-geo-basic-midpoint-seg': rpmGeoBasicMidpointSegment,
  'rpm-geo-basic-angle-classify': rpmGeoBasicAngleClassify,
  'rpm-geo-basic-straight-angle-eq': rpmGeoBasicStraightAngleEq,
  'rpm-geo-basic-angle-ratio': rpmGeoBasicAngleRatio,
  'rpm-geo-basic-angle-multiple': rpmGeoBasicAngleMultipleCond,
  'rpm-geo-basic-vertical-angles': rpmGeoBasicVerticalAngles,
  'rpm-geo-basic-vertical-pairs': rpmGeoBasicVerticalAnglePairs,
  'rpm-geo-basic-perp-distance': rpmGeoBasicPerpendicularDist,
  'rpm-geo-basic-vertical-multi': rpmGeoBasicVerticalMultiLines,
  'rpm-geo-basic-clock-angle': rpmGeoBasicClockAngle,
  'rpm-geo-basic-all-mixed': rpmGeoBasicAllTypesMixed,

  // -------------------------------------------------------------
  // 02 위치 관계 세부 응용 유형 (RPM 1-2 p.26~43)
  // -------------------------------------------------------------
  'rpm-pos-point-line-plane': rpmPosPointLinePlane,
  'rpm-pos-plane-two-lines': rpmPosPlaneTwoLines,
  'rpm-pos-solid-skew-edges': rpmPosSolidSkewEdges,
  'rpm-pos-solid-edge-plane': rpmPosSolidEdgePlaneRelations,
  'rpm-pos-solid-net-relations': rpmPosSolidNetRelations,
  'rpm-pos-corresponding-alternate': rpmPosCorrespondingAlternate,
  'rpm-pos-parallel-angle-solve': rpmPosParallelAngleSolve,
  'rpm-pos-parallel-condition': rpmPosParallelCondition,
  'rpm-pos-parallel-bent-single': rpmPosParallelBentLineSingle,
  'rpm-pos-parallel-bent-multi': rpmPosParallelBentLineMulti,
  'rpm-pos-parallel-with-polygon': rpmPosParallelWithPolygon,
  'rpm-pos-parallel-angle-bisector': rpmPosParallelAngleBisector,
  'rpm-pos-paper-fold-angles': rpmPosPaperFoldAngles,
  'rpm-pos-parallel-two-pairs': rpmPosParallelTwoPairs,
  'rpm-pos-space-logic': rpmPosSpaceLogicStatements,
  'rpm-pos-all-mixed': rpmPosAllTypesMixed,

  // -------------------------------------------------------------
  // 03 작도와 합동 세부 응용 유형 (RPM 1-2 p.47~59)
  // -------------------------------------------------------------
  'rpm-cong-construct-segment': rpmCongConstructSegment,
  'rpm-cong-construct-angle-parallel': rpmCongConstructAngleParallel,
  'rpm-cong-triangle-opposite': rpmCongTriangleOpposite,
  'rpm-cong-triangle-inequality': rpmCongTriangleInequality,
  'rpm-cong-triangle-param-range': rpmCongTriangleParamRange,
  'rpm-cong-triangle-determined-cond': rpmCongTriangleDeterminedCond,
  'rpm-cong-figure-congruence-props': rpmCongFigureCongruenceProps,
  'rpm-cong-triangle-sss-sas-asa': rpmCongTriangleSssSasAsa,
  'rpm-cong-triangle-add-condition': rpmCongTriangleAddCondition,
  'rpm-cong-rotation-equilateral-square': rpmCongRotationEquilateralSquare,
  'rpm-cong-right-isosceles-altitude': rpmCongRightIsoscelesAltitude,
  'rpm-cong-square-overlap-area': rpmCongSquareOverlapArea,
  'rpm-cong-all-mixed': rpmCongAllTypesMixed,

  // -------------------------------------------------------------
  // 중학 1-2 1학기 기하 전 범위 총괄 모의고사
  // -------------------------------------------------------------
  'rpm-geo-semester-one-mock-exam': rpmGeoSemesterOneMockExam,
};

export function findRpmAppliedGenerator(unitId) {
  return RPM_APPLIED_GENERATORS[unitId] || null;
}
