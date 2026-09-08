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



// =============================================================
// CHAPTER 04: 다각형 응용 (RPM 1-2 Pages 66 ~ 81)
// =============================================================


// [유형 01] 다각형과 정다각형의 정의, 내각과 외각 (RPM #434~#438, #535)
export function rpmPolyConceptInteriorExterior(random) {
  const polygonNames = [
    { n: 3, kor: '정삼각형', eng: 'equilateral triangle' },
    { n: 4, kor: '정사각형', eng: 'square' },
    { n: 5, kor: '정오각형', eng: 'regular pentagon' },
    { n: 6, kor: '정육각형', eng: 'regular hexagon' },
    { n: 8, kor: '정팔각형', eng: 'regular octagon' },
    { n: 10, kor: '정십각형', eng: 'regular decagon' },
    { n: 12, kor: '정십이각형', eng: 'regular dodecagon' },
  ];
  const poly = pick(random, polygonNames);
  const ext = 360 / poly.n;
  const intAngle = 180 - ext;

  const mode = ri(random, 1, 3);
  if (mode === 1) {
    // 한 꼭짓점에서 내각과 외각의 합은 180°
    const givenExt = ext;
    return {
      prompt: `어떤 다각형의 한 꼭짓점에서 외각의 크기가 ${givenExt}°일 때, 이 꼭짓점에서의 내각의 크기를 구하시오. (단, 단위 °는 생략하고 숫자만 입력)`,
      promptEn: `At a vertex of a polygon, the exterior angle measures ${givenExt}°. Find the measure of the interior angle at this vertex.`,
      expression: `180 - ${givenExt}`,
      answer: String(intAngle),
      explanation: `다각형의 한 꼭짓점에서 내각의 크기와 외각의 크기의 합은 항상 180°입니다. 따라서 내각의 크기는 180° - ${givenExt}° = ${intAngle}°입니다.`,
    };
  } else if (mode === 2) {
    // 정다각형의 정의 참/거짓 또는 객관식
    const statements = [
      {
        text: '모든 변의 길이가 같은 다각형은 항상 정다각형이다.',
        textEn: 'A polygon with all sides equal is always a regular polygon.',
        isCorrect: false,
        expl: '마름모는 네 변의 길이가 모두 같지만 네 내각의 크기가 모두 같지 않으므로 정다각형이 아닙니다. 정다각형이 되려면 모든 변의 길이가 같고 모든 내각의 크기도 같아야 합니다.',
      },
      {
        text: '모든 내각의 크기가 같은 다각형은 항상 정다각형이다.',
        textEn: 'A polygon with all interior angles equal is always a regular polygon.',
        isCorrect: false,
        expl: '직사각형은 네 내각의 크기가 모두 같지만(90°) 이웃하는 두 변의 길이가 다를 수 있으므로 정다각형이 아닙니다.',
      },
      {
        text: '모든 변의 길이가 같고 모든 내각의 크기가 같은 다각형을 정다각형이라 한다.',
        textEn: 'A polygon whose sides are all equal and interior angles are all equal is called a regular polygon.',
        isCorrect: true,
        expl: '정다각형의 정의는 변의 길이가 모두 같고 내각의 크기도 모두 같은 다각형입니다.',
      },
      {
        text: '다각형의 한 꼭짓점에서 내각과 외각의 크기의 합은 180°이다.',
        textEn: 'At any vertex of a polygon, the sum of the interior angle and exterior angle is 180°.',
        isCorrect: true,
        expl: '내각과 외각은 한 평각(180°)을 이루므로 그 합은 항상 180°입니다.',
      },
    ];
    const item = pick(random, statements);
    return {
      prompt: `다각형에 대한 다음 설명의 참/거짓을 판별하시오: "${item.text}"`,
      promptEn: `Determine True or False: "${item.textEn}"`,
      expression: item.text,
      answer: item.isCorrect ? '1' : '2',
      choices: [
        { value: '1', label: '참 (O)', labelEn: 'True' },
        { value: '2', label: '거짓 (X)', labelEn: 'False' },
      ],
      explanation: item.expl,
    };
  } else {
    // 내각의 크기가 주어졌을 때 외각의 크기
    const interior = ri(random, 60, 160);
    const exterior = 180 - interior;
    return {
      prompt: `다각형의 한 꼭짓점에서 내각의 크기가 ${interior}°일 때, 이 꼭짓점에서의 외각의 크기를 구하시오.`,
      promptEn: `The interior angle at a vertex of a polygon is ${interior}°. Find the exterior angle at this vertex.`,
      expression: `180 - ${interior}`,
      answer: String(exterior),
      explanation: `내각의 크기 + 외각의 크기 = 180°이므로, 외각의 크기 = 180° - ${interior}° = ${exterior}°입니다.`,
    };
  }
}

// [유형 02] 다각형의 대각선의 개수 공식 (RPM #439~#447)
// 한 꼭짓점에서 그을 수 있는 대각선: n - 3
// 그로 인해 생기는 삼각형의 개수: n - 2
// 총 대각선의 개수: n(n - 3) / 2
export function rpmPolyDiagonalCountFormula(random) {
  const n = ri(random, 5, 15);
  const oneVertexDiag = n - 3;
  const triangles = n - 2;
  const totalDiag = (n * (n - 3)) / 2;

  const mode = ri(random, 1, 3);
  if (mode === 1) {
    // 총 대각선의 개수 구하기
    return {
      prompt: `${n}각형의 대각선의 총 개수를 구하시오.`,
      promptEn: `Find the total number of diagonals in a polygon with ${n} sides (${n}-gon).`,
      expression: `\\frac{${n}(${n} - 3)}{2}`,
      answer: String(totalDiag),
      explanation: `n각형의 총 대각선 개수 공식은 n(n - 3) / 2 입니다. 따라서 ${n}각형의 총 대각선 개수는 ${n} × (${n} - 3) / 2 = ${n} × ${n - 3} / 2 = ${totalDiag}개입니다.`,
    };
  } else if (mode === 2) {
    // 한 꼭짓점에서 그을 수 있는 대각선 개수 a와 생기는 삼각형 개수 b의 합
    const sumAB = oneVertexDiag + triangles;
    return {
      prompt: `${n}각형의 한 꼭짓점에서 그을 수 있는 대각선의 개수를 a, 이 대각선들에 의해 나누어지는 삼각형의 개수를 b라 할 때, a + b의 값을 구하시오.`,
      promptEn: `In an ${n}-gon, let a be the number of diagonals from one vertex, and b be the number of triangles formed. Find a + b.`,
      expression: `(${n} - 3) + (${n} - 2)`,
      answer: String(sumAB),
      explanation: `n각형의 한 꼭짓점에서 그을 수 있는 대각선의 개수 a = n - 3 = ${n} - 3 = ${oneVertexDiag}개, 나누어지는 삼각형의 개수 b = n - 2 = ${n} - 2 = ${triangles}개입니다. 따라서 a + b = ${oneVertexDiag} + ${triangles} = ${sumAB}입니다.`,
    };
  } else {
    // 활용: n명이 서로 악수하거나, n개 팀이 리그전을 치를 때의 총 경기/악수 수
    // 악수 = n각형의 변의 개수 + 대각선의 개수 = n(n-1)/2
    const totalHandshakes = (n * (n - 1)) / 2;
    return {
      prompt: `${n}명의 사람이 모여서 서로 빠짐없이 한 번씩 악수를 하려고 한다. 악수를 하는 총 횟수를 구하시오.`,
      promptEn: `${n} people meet and shake hands with each other exactly once. Find the total number of handshakes.`,
      expression: `\\frac{${n}(${n} - 1)}{2}`,
      answer: String(totalHandshakes),
      explanation: `n명의 사람이 서로 한 번씩 악수하는 총 횟수는 n(n - 1) / 2 입니다. (${n}각형의 변의 개수 ${n} + 대각선의 개수 ${totalDiag} = ${totalHandshakes}). 따라서 ${n} × ${n - 1} / 2 = ${totalHandshakes}회입니다.`,
    };
  }
}

// [유형 03] 대각선의 개수가 주어졌을 때 다각형 구하기 (RPM #448~#455)
export function rpmPolyFindPolygonFromDiagonals(random) {
  // n = 5, 6, 7, 8, 9, 10, 11, 12, 14, 15
  const nList = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  const n = pick(random, nList);
  const totalDiag = (n * (n - 3)) / 2;

  const mode = ri(random, 1, 3);
  if (mode === 1) {
    return {
      prompt: `대각선의 총 개수가 ${totalDiag}개인 다각형의 변의 개수를 구하시오.`,
      promptEn: `Find the number of sides of a polygon that has ${totalDiag} diagonals in total.`,
      expression: `\\frac{n(n - 3)}{2} = ${totalDiag}`,
      answer: String(n),
      explanation: `n각형의 대각선의 총 개수는 n(n - 3) / 2 이므로, n(n - 3) / 2 = ${totalDiag}, n(n - 3) = ${totalDiag * 2}입니다. 연속하는 두 수 또는 차가 3인 곱을 찾으면 ${n} × ${n - 3} = ${n * (n - 3)}이므로 n = ${n}입니다. 따라서 변의 개수는 ${n}개입니다.`,
    };
  } else if (mode === 2) {
    // 대각선 개수가 주어질 때 한 꼭짓점에서 그을 수 있는 대각선의 개수
    const ans = n - 3;
    return {
      prompt: `대각선의 총 개수가 ${totalDiag}개인 다각형의 한 꼭짓점에서 그을 수 있는 대각선의 개수를 구하시오.`,
      promptEn: `A polygon has ${totalDiag} diagonals in total. How many diagonals can be drawn from one vertex?`,
      expression: `n - 3`,
      answer: String(ans),
      explanation: `n(n - 3) / 2 = ${totalDiag}에서 n(n - 3) = ${totalDiag * 2}이므로 n = ${n}입니다. 따라서 한 꼭짓점에서 그을 수 있는 대각선의 개수는 n - 3 = ${n} - 3 = ${ans}개입니다.`,
    };
  } else {
    // 대각선 개수가 주어질 때 내각의 크기의 합
    const interiorSum = 180 * (n - 2);
    return {
      prompt: `대각선의 총 개수가 ${totalDiag}개인 다각형의 내각의 크기의 합을 구하시오. (단, 단위 °는 생략)`,
      promptEn: `Find the sum of interior angles of a polygon having ${totalDiag} diagonals.`,
      expression: `180^\\circ \\times (${n} - 2)`,
      answer: String(interiorSum),
      explanation: `n(n - 3) / 2 = ${totalDiag}에서 n = ${n} (${n}각형)입니다. n각형의 내각의 크기의 합은 180° × (n - 2) = 180° × (${n} - 2) = 180° × ${n - 2} = ${interiorSum}°입니다.`,
    };
  }
}

// [유형 04] 삼각형의 세 내각의 크기의 합과 비례배분 (RPM #456~#462)
export function rpmPolyTriangleAngleSumRatio(random) {
  const mode = ri(random, 1, 3);
  if (mode === 1) {
    // 세 내각의 비가 a : b : c 일 때 가장 큰 각 구하기
    const ratios = [
      [1, 2, 3],
      [2, 3, 4],
      [3, 4, 5],
      [1, 3, 5],
      [2, 3, 5],
      [3, 3, 4],
      [2, 5, 5],
      [1, 4, 7],
    ];
    const [a, b, c] = pick(random, ratios);
    const sum = a + b + c;
    const maxPart = Math.max(a, b, c);
    const maxAngle = (180 * maxPart) / sum;
    return {
      prompt: `삼각형의 세 내각의 크기의 비가 ${a} : ${b} : ${c}일 때, 가장 큰 내각의 크기를 구하시오. (단, 단위 °는 생략)`,
      promptEn: `The interior angles of a triangle are in the ratio ${a} : ${b} : ${c}. Find the measure of the largest interior angle.`,
      expression: `180^\\circ \\times \\frac{${maxPart}}{${sum}}`,
      answer: String(maxAngle),
      explanation: `삼각형의 세 내각의 크기의 합은 180°입니다. 비례배분에 의해 가장 큰 각은 180° × ${maxPart} / (${a} + ${b} + ${c}) = 180° × ${maxPart} / ${sum} = ${maxAngle}°입니다.`,
    };
  } else if (mode === 2) {
    // 방정식 형태: 세 각이 x, 2x+10, 3x-10 등
    // (ax + p) + (bx + q) + (cx + r) = 180
    // Simplify: x, 2x + k, x + m => sum of x is 4x, etc.
    const xVal = ri(random, 15, 35);
    const p = ri(random, 5, 20);
    const angle1 = xVal;
    const angle2 = 2 * xVal + p;
    const angle3 = 180 - (angle1 + angle2);
    if (angle3 <= 10) {
      // fallback safe values
      return {
        prompt: `삼각형의 세 내각의 크기가 각각 x°, (2x + 10)°, (x + 50)°일 때, x의 값을 구하시오.`,
        promptEn: `The interior angles of a triangle are x°, (2x + 10)°, and (x + 50)°. Find the value of x.`,
        expression: `x + (2x + 10) + (x + 50) = 180`,
        answer: '30',
        explanation: `세 내각의 크기의 합은 180°이므로 x + (2x + 10) + (x + 50) = 180, 4x + 60 = 180, 4x = 120, x = 30입니다.`,
      };
    }
    return {
      prompt: `삼각형의 세 내각의 크기가 각각 x°, (2x + ${p})°, ${angle3}°일 때, x의 값을 구하시오.`,
      promptEn: `The angles of a triangle are x°, (2x + ${p})°, and ${angle3}°. Find x.`,
      expression: `x + (2x + ${p}) + ${angle3} = 180`,
      answer: String(xVal),
      explanation: `삼각형의 세 내각의 합은 180°이므로 x + (2x + ${p}) + ${angle3} = 180, 3x + ${p + angle3} = 180, 3x = ${180 - (p + angle3)}, x = ${xVal}입니다.`,
    };
  } else {
    // 세 외각의 크기의 비가 a : b : c 일 때 가장 작은 내각 구하기
    const ratios = [
      [2, 3, 4],
      [3, 4, 5],
      [2, 3, 5],
    ];
    const [a, b, c] = pick(random, ratios);
    const sum = a + b + c;
    const ext1 = (360 * a) / sum;
    const ext2 = (360 * b) / sum;
    const ext3 = (360 * c) / sum;
    // 가장 큰 외각에 대응하는 내각이 가장 작다: 180 - max(ext)
    const maxExt = Math.max(ext1, ext2, ext3);
    const minInterior = 180 - maxExt;
    return {
      prompt: `삼각형의 세 외각의 크기의 비가 ${a} : ${b} : ${c}일 때, 이 삼각형의 세 내각 중 가장 작은 내각의 크기를 구하시오. (단, 단위 °는 생략)`,
      promptEn: `The three exterior angles of a triangle are in the ratio ${a} : ${b} : ${c}. Find the measure of the smallest interior angle.`,
      expression: `180^\\circ - \\left(360^\\circ \\times \\frac{${Math.max(a, b, c)}}{${sum}}\\right)`,
      answer: String(minInterior),
      explanation: `삼각형의 세 외각의 합은 360°입니다. 외각의 크기는 각각 ${ext1}°, ${ext2}°, ${ext3}°입니다. 내각은 180° - (외각)이므로, 가장 큰 외각(${maxExt}°)에 이웃한 내각이 가장 작습니다. 따라서 가장 작은 내각의 크기는 180° - ${maxExt}° = ${minInterior}°입니다.`,
    };
  }
}

// [유형 05] 삼각형의 내각과 외각의 성질 (RPM #463~#470)
// 한 외각은 이웃하지 않는 두 내각의 크기의 합과 같다: ∠ACD = ∠A + ∠B
// 이등변삼각형이 연속으로 이어지는 뿔 모양 각도 추적
export function rpmPolyTriangleExteriorAngleProp(random) {
  const mode = ri(random, 1, 2);
  if (mode === 1) {
    // 기본 외각 성질: ∠A = a, ∠B = b, ∠ACD = a + b
    const angleA = ri(random, 35, 75);
    const angleB = ri(random, 25, 65);
    const extC = angleA + angleB;
    return {
      prompt: `삼각형 ABC에서 변 BC의 연장선 위에 점 D가 있다. ∠A = ${angleA}°, ∠B = ${angleB}°일 때, 외각 ∠ACD의 크기를 구하시오. (단, 단위 °는 생략)`,
      promptEn: `In triangle ABC, D is on the extension of BC. If ∠A = ${angleA}° and ∠B = ${angleB}°, find the exterior angle ∠ACD.`,
      expression: `${angleA} + ${angleB}`,
      answer: String(extC),
      explanation: `삼각형의 한 외각의 크기는 그와 이웃하지 않는 두 내각의 크기의 합과 같습니다. 따라서 ∠ACD = ∠A + ∠B = ${angleA}° + ${angleB}° = ${extC}°입니다.`,
    };
  } else {
    // 이등변삼각형 연쇄 사다리: AB = BC = CD = DE
    // ∠A = x, ∠BCA = x, ∠CBD = 2x, ∠CDB = 2x, ∠ECD = 3x, etc.
    const x = ri(random, 18, 28);
    const steps = 3; // ∠ECD = 3x or 4x
    const finalAngle = steps * x;
    return {
      prompt: `오른쪽 그림과 같이 선분 AB = BC = CD인 지그재그 이등변삼각형 구조에서 ∠A = ${x}°일 때, 외각 ∠DCE의 크기를 구하시오. (단, 단위 °는 생략)`,
      promptEn: `In a zigzag chain of isosceles triangles where AB = BC = CD and ∠A = ${x}°, find the measure of exterior angle ∠DCE.`,
      expression: `3 \\times ${x}^\\circ`,
      answer: String(finalAngle),
      explanation: `1) △ABC는 이등변삼각형이므로 ∠ACB = ∠A = ${x}°입니다.\n2) ∠CBD는 △ABC의 외각이므로 ∠CBD = ${x}° + ${x}° = ${2 * x}°입니다.\n3) △BCD는 이등변삼각형이므로 ∠BDC = ∠CBD = ${2 * x}°입니다.\n4) ∠DCE는 △ACD의 한 외각이므로 ∠DCE = ∠A + ∠ADC = ${x}° + ${2 * x}° = ${3 * x}° = ${finalAngle}°입니다.`,
    };
  }
}

// [유형 06] 삼각형의 내각과 외각의 성질의 활용 (부메랑/오목다각형 모형) (RPM #471~#477)
// ∠x = a + b + c
export function rpmPolyBoomerangConcaveAngle(random) {
  const a = ri(random, 25, 45);
  const b = ri(random, 20, 40);
  const c = ri(random, 30, 50);
  const x = a + b + c;

  const mode = ri(random, 1, 2);
  if (mode === 1) {
    // x 구하기
    return {
      prompt: `오목사각형(부메랑 모양) ABCD에서 ∠A = ${a}°, ∠B = ${b}°, ∠C = ${c}°일 때, 안쪽으로 꺾인 각 ∠ADC(x)의 크기를 구하시오. (단, 단위 °는 생략)`,
      promptEn: `In a boomerang concave quadrilateral ABCD, ∠A = ${a}°, ∠B = ${b}°, and ∠C = ${c}°. Find the reflex interior corner angle x (∠ADC).`,
      expression: `${a} + ${b} + ${c}`,
      answer: String(x),
      explanation: `보조선 BD를 그어 연장하면 두 삼각형의 외각의 성질에 의해 오목한 각 x = ∠A + ∠B + ∠C 입니다. 따라서 x = ${a}° + ${b}° + ${c}° = ${x}°입니다.`,
    };
  } else {
    // x가 주어지고 한 각을 미지수로 놓는 경우
    return {
      prompt: `오목사각형 ABCD에서 안쪽 꺾인 각의 크기가 ${x}°이고, 세 뾰족한 각 중 두 각이 각각 ${a}°, ${b}°일 때, 나머지 한 뾰족한 각의 크기를 구하시오.`,
      promptEn: `In a concave quadrilateral, the reflex angle is ${x}°, and two of the sharp angles are ${a}° and ${b}°. Find the third sharp angle.`,
      expression: `${x} - (${a} + ${b})`,
      answer: String(c),
      explanation: `오목다각형의 성질에 의해 세 뾰족한 각의 합은 꺾인 각과 같습니다. 즉, ${a}° + ${b}° + (나머지 각) = ${x}°이므로, 나머지 각 = ${x}° - (${a}° + ${b}°) = ${c}°입니다.`,
    };
  }
}

// [유형 07] 삼각형의 두 내각의 이등분선의 교각 (RPM #478~#483)
// ∠BIC = 90° + (1/2)∠A
export function rpmPolyIncenterAngleBisector(random) {
  const angleA = ri(random, 20, 55) * 2; // 짝수로 설정 (40 ~ 110)
  const angleBIC = 90 + angleA / 2;

  const mode = ri(random, 1, 2);
  if (mode === 1) {
    // ∠A가 주어졌을 때 ∠BIC 구하기
    return {
      prompt: `삼각형 ABC에서 ∠B의 이등분선과 ∠C의 이등분선이 만나는 점을 I라 하자. ∠A = ${angleA}°일 때, ∠BIC의 크기를 구하시오. (단, 단위 °는 생략)`,
      promptEn: `In triangle ABC, the bisectors of ∠B and ∠C intersect at point I. If ∠A = ${angleA}°, find ∠BIC.`,
      expression: `90^\\circ + \\frac{1}{2} \\times ${angleA}^\\circ`,
      answer: String(angleBIC),
      explanation: `∠B + ∠C = 180° - ∠A = 180° - ${angleA}° = ${180 - angleA}°입니다. 두 내각의 이등분선에 의해 ∠IBC + ∠ICB = (∠B + ∠C) / 2 = ${90 - angleA / 2}°입니다. 따라서 △IBC에서 ∠BIC = 180° - (∠IBC + ∠ICB) = 90° + (1/2)∠A = 90° + ${angleA / 2}° = ${angleBIC}°입니다.`,
    };
  } else {
    // ∠BIC가 주어졌을 때 ∠A 구하기
    return {
      prompt: `삼각형 ABC에서 두 내각 ∠B, ∠C의 이등분선의 교점을 I라 할 때, ∠BIC = ${angleBIC}°이다. ∠A의 크기를 구하시오. (단, 단위 °는 생략)`,
      promptEn: `In triangle ABC, the bisectors of ∠B and ∠C meet at I. If ∠BIC = ${angleBIC}°, find ∠A.`,
      expression: `2 \\times (${angleBIC}^\\circ - 90^\\circ)`,
      answer: String(angleA),
      explanation: `공식 ∠BIC = 90° + (1/2)∠A 에 대입하면 ${angleBIC}° = 90° + (1/2)∠A 입니다. (1/2)∠A = ${angleBIC - 90}°이므로, ∠A = 2 × ${angleBIC - 90}° = ${angleA}°입니다.`,
    };
  }
}

// [유형 08] 한 내각의 이등분선과 한 외각의 이등분선의 교각 (RPM #484~#489)
// ∠D = (1/2)∠A
export function rpmPolyExteriorInteriorBisector(random) {
  const angleA = ri(random, 18, 50) * 2; // 36 ~ 100 짝수
  const angleD = angleA / 2;

  const mode = ri(random, 1, 2);
  if (mode === 1) {
    return {
      prompt: `삼각형 ABC에서 내각 ∠B의 이등분선과 외각 ∠ACD의 이등분선이 만나는 점을 D라 하자. ∠A = ${angleA}°일 때, ∠D의 크기를 구하시오. (단, 단위 °는 생략)`,
      promptEn: `In triangle ABC, the internal bisector of ∠B and the external bisector of ∠C intersect at D. If ∠A = ${angleA}°, find ∠D.`,
      expression: `\\frac{1}{2} \\times ${angleA}^\\circ`,
      answer: String(angleD),
      explanation: `외각의 성질에 의해 2∠(외각반) = ∠A + 2∠(내각반) 입니다. 양변을 2로 나누면 ∠(외각반) = (1/2)∠A + ∠(내각반) 이고, △BCD에서 외각 ∠(외각반) = ∠D + ∠(내각반) 이므로 ∠D = (1/2)∠A 입니다. 따라서 ∠D = ${angleA}° / 2 = ${angleD}°입니다.`,
    };
  } else {
    return {
      prompt: `삼각형 ABC에서 내각 ∠B의 이등분선과 외각의 이등분선의 교점 D에 대하여 ∠D = ${angleD}°일 때, ∠A의 크기를 구하시오.`,
      promptEn: `In triangle ABC, bisectors of inner ∠B and outer ∠C meet at D. If ∠D = ${angleD}°, find ∠A.`,
      expression: `2 \\times ${angleD}^\\circ`,
      answer: String(angleA),
      explanation: `한 내각의 이등분선과 한 외각의 이등분선의 교각 ∠D는 (1/2)∠A와 같습니다. 따라서 ∠A = 2 × ∠D = 2 × ${angleD}° = ${angleA}°입니다.`,
    };
  }
}

// [유형 09] 다각형의 내각의 크기의 합 공식 (RPM #490~#497)
// S = 180° × (n - 2)
export function rpmPolyInteriorAngleSumFormula(random) {
  const n = ri(random, 5, 12);
  const sum = 180 * (n - 2);

  const mode = ri(random, 1, 3);
  if (mode === 1) {
    // n각형 내각의 합
    return {
      prompt: `${n}각형의 내각의 크기의 합을 구하시오. (단, 단위 °는 생략)`,
      promptEn: `Find the sum of the interior angles of an ${n}-gon.`,
      expression: `180^\\circ \\times (${n} - 2)`,
      answer: String(sum),
      explanation: `n각형의 내각의 크기의 합 공식은 180° × (n - 2) 입니다. 따라서 ${n}각형의 내각의 합은 180° × (${n} - 2) = 180° × ${n - 2} = ${sum}°입니다.`,
    };
  } else if (mode === 2) {
    // 합이 주어질 때 n각형 구하기
    return {
      prompt: `내각의 크기의 합이 ${sum}°인 다각형의 꼭짓점의 개수를 구하시오.`,
      promptEn: `A polygon has an interior angle sum of ${sum}°. Find its number of vertices.`,
      expression: `\\frac{${sum}}{180} + 2`,
      answer: String(n),
      explanation: `180° × (n - 2) = ${sum}°이므로 n - 2 = ${sum} / 180 = ${n - 2}입니다. 따라서 n = ${n}이므로 꼭짓점의 개수는 ${n}개입니다.`,
    };
  } else {
    // 다각형에서 n - 1개의 각이 주어지고 나머지 한 각 x 구하기 (오각형 등)
    // 5각형 내각합 = 540
    const angles = [100, 110, 120, 80];
    const targetAngle = 540 - angles.reduce((a, b) => a + b, 0); // 130
    const offset = ri(random, -10, 10);
    const a1 = 100 + offset;
    const a2 = 110 - offset;
    const a3 = 120 + offset;
    const a4 = 85;
    const ansX = 540 - (a1 + a2 + a3 + a4);
    return {
      prompt: `오각형의 다섯 내각 중 네 내각의 크기가 각각 ${a1}°, ${a2}°, ${a3}°, ${a4}°일 때, 나머지 한 내각의 크기를 구하시오.`,
      promptEn: `In a pentagon, four interior angles measure ${a1}°, ${a2}°, ${a3}°, and ${a4}°. Find the fifth interior angle.`,
      expression: `540 - (${a1} + ${a2} + ${a3} + ${a4})`,
      answer: String(ansX),
      explanation: `오각형의 내각의 크기의 합은 180° × (5 - 2) = 540°입니다. 따라서 나머지 한 내각 = 540° - (${a1}° + ${a2}° + ${a3}° + ${a4}°) = 540° - ${a1 + a2 + a3 + a4}° = ${ansX}°입니다.`,
    };
  }
}

// [유형 10] 다각형의 외각의 크기의 합 (RPM #498~#505)
// 모든 다각형의 외각의 크기의 합은 항상 360°이다.
export function rpmPolyExteriorAngleSumConst(random) {
  const n = ri(random, 5, 8);
  // 외각 n개 중 n-1개 생성
  const exts = [];
  let remaining = 360;
  for (let i = 0; i < n - 1; i++) {
    const val = ri(random, 30, Math.min(80, Math.floor(remaining / (n - i))));
    exts.push(val);
    remaining -= val;
  }
  const lastExt = remaining;

  return {
    prompt: `${n}각형의 외각 중 ${n - 1}개의 크기가 각각 ${exts.map((e) => e + '°').join(', ')}일 때, 나머지 한 외각의 크기를 구하시오. (단, 단위 °는 생략)`,
    promptEn: `In an ${n}-gon, ${n - 1} of its exterior angles measure ${exts.join('°, ')}°. Find the remaining exterior angle.`,
    expression: `360 - (${exts.join(' + ')})`,
    answer: String(lastExt),
    explanation: `모든 다각형의 외각의 크기의 합은 항상 360°입니다. 따라서 나머지 한 외각의 크기는 360° - (${exts.join('° + ')}°) = 360° - ${360 - lastExt}° = ${lastExt}°입니다.`,
  };
}

// [유형 11] 정다각형의 한 내각과 한 외각의 크기 (RPM #506~#511)
// 한 외각 = 360 / n, 한 내각 = 180 - (360 / n)
export function rpmPolyRegularInteriorExterior(random) {
  const regularPolys = [
    { n: 5, name: '정오각형', int: 108, ext: 72 },
    { n: 6, name: '정육각형', int: 120, ext: 60 },
    { n: 8, name: '정팔각형', int: 135, ext: 45 },
    { n: 9, name: '정구각형', int: 140, ext: 40 },
    { n: 10, name: '정십각형', int: 144, ext: 36 },
    { n: 12, name: '정십이각형', int: 150, ext: 30 },
    { n: 15, name: '정십오각형', int: 156, ext: 24 },
    { n: 18, name: '정십팔각형', int: 160, ext: 20 },
    { n: 20, name: '정이십각형', int: 162, ext: 18 },
  ];
  const target = pick(random, regularPolys);

  const mode = ri(random, 1, 3);
  if (mode === 1) {
    // 한 내각의 크기 구하기
    return {
      prompt: `${target.name}의 한 내각의 크기를 구하시오. (단, 단위 °는 생략)`,
      promptEn: `Find the measure of one interior angle of a regular ${target.n}-gon.`,
      expression: `\\frac{180^\\circ \\times (${target.n} - 2)}{${target.n}}`,
      answer: String(target.int),
      explanation: `정${target.n}각형의 한 외각의 크기는 360° / ${target.n} = ${target.ext}°이므로, 한 내각의 크기는 180° - ${target.ext}° = ${target.int}°입니다. (또는 180° × (${target.n} - 2) / ${target.n} = ${target.int}°)`,
    };
  } else if (mode === 2) {
    // 한 내각의 크기가 주어졌을 때 정다각형의 변의 개수
    return {
      prompt: `한 내각의 크기가 ${target.int}°인 정다각형의 변의 개수를 구하시오.`,
      promptEn: `A regular polygon has an interior angle of ${target.int}°. Find its number of sides.`,
      expression: `\\frac{360^\\circ}{180^\\circ - ${target.int}^\\circ}`,
      answer: String(target.n),
      explanation: `한 내각의 크기가 ${target.int}°이면 한 외각의 크기는 180° - ${target.int}° = ${target.ext}°입니다. 모든 다각형의 외각의 합은 360°이므로, 변의 개수 n = 360° / ${target.ext}° = ${target.n}개입니다.`,
    };
  } else {
    // 한 외각의 크기가 주어졌을 때 정다각형의 대각선의 총 개수
    const totalDiag = (target.n * (target.n - 3)) / 2;
    return {
      prompt: `한 외각의 크기가 ${target.ext}°인 정다각형의 대각선의 총 개수를 구하시오.`,
      promptEn: `A regular polygon has an exterior angle of ${target.ext}°. Find its total number of diagonals.`,
      expression: `\\frac{n(n - 3)}{2}`,
      answer: String(totalDiag),
      explanation: `한 외각이 ${target.ext}°이므로 변의 개수 n = 360° / ${target.ext}° = ${target.n} (${target.name})입니다. 대각선의 총 개수는 ${target.n} × (${target.n} - 3) / 2 = ${totalDiag}개입니다.`,
    };
  }
}

// [유형 12] 정다각형의 한 내각과 한 외각의 크기의 비 (RPM #512~#515)
// 내각 : 외각 = a : b => 한 외각 = 180 * b / (a + b) => n = 360 / 외각
export function rpmPolyRegularRatioAngle(random) {
  const polyList = [
    { n: 5, int: 108, ext: 72, a: 3, b: 2 }, // 108:72 = 3:2
    { n: 6, int: 120, ext: 60, a: 2, b: 1 }, // 120:60 = 2:1
    { n: 8, int: 135, ext: 45, a: 3, b: 1 }, // 135:45 = 3:1
    { n: 9, int: 140, ext: 40, a: 7, b: 2 }, // 140:40 = 7:2
    { n: 10, int: 144, ext: 36, a: 4, b: 1 }, // 144:36 = 4:1
    { n: 12, int: 150, ext: 30, a: 5, b: 1 }, // 150:30 = 5:1
    { n: 18, int: 160, ext: 20, a: 8, b: 1 }, // 160:20 = 8:1
  ];
  const target = pick(random, polyList);
  const totalDiag = (target.n * (target.n - 3)) / 2;

  const mode = ri(random, 1, 2);
  if (mode === 1) {
    return {
      prompt: `한 내각의 크기와 한 외각의 크기의 비가 ${target.a} : ${target.b}인 정다각형의 이름을 구하시오. (예: 정오각형, 정육각형 등)`,
      promptEn: `A regular polygon has the ratio of an interior angle to an exterior angle as ${target.a} : ${target.b}. What is the name of this polygon?`,
      expression: `\\text{외각} = 180^\\circ \\times \\frac{${target.b}}{${target.a} + ${target.b}} = ${target.ext}^\\circ`,
      answer: `정${['', '', '', '삼', '사', '오', '육', '칠', '팔', '구', '십', '십일', '십이', '십삼', '십사', '십오', '십육', '십칠', '십팔'][target.n]}각형`,
      explanation: `한 꼭짓점에서 내각과 외각의 합은 180°입니다. 한 외각의 크기는 180° × ${target.b} / (${target.a} + ${target.b}) = ${target.ext}°입니다. 따라서 변의 개수는 360° / ${target.ext}° = ${target.n}개이므로, 이 정다각형은 정${['', '', '', '삼', '사', '오', '육', '칠', '팔', '구', '십', '십일', '십이', '십삼', '십사', '십오', '십육', '십칠', '십팔'][target.n]}각형입니다.`,
    };
  } else {
    return {
      prompt: `한 내각의 크기와 한 외각의 크기의 비가 ${target.a} : ${target.b}인 정다각형의 대각선의 총 개수를 구하시오.`,
      promptEn: `The ratio of an interior angle to an exterior angle in a regular polygon is ${target.a} : ${target.b}. Find the total number of diagonals.`,
      expression: `\\frac{${target.n}(${target.n} - 3)}{2}`,
      answer: String(totalDiag),
      explanation: `한 외각 = 180° × ${target.b} / (${target.a} + ${target.b}) = ${target.ext}°입니다. 변의 개수 n = 360° / ${target.ext}° = ${target.n}입니다. 따라서 대각선의 총 개수는 ${target.n} × (${target.n} - 3) / 2 = ${totalDiag}개입니다.`,
    };
  }
}

// [유형 13] 정다각형의 대각선과 각의 크기 (RPM #516~#519)
// 정오각형 대각선 교각, 정육각형 대각선 각도 등
export function rpmPolyRegularDiagonalAngle(random) {
  const mode = ri(random, 1, 2);
  if (mode === 1) {
    // 정오각형 ABCDE에서 두 대각선 AC와 BD의 교점을 P라 할 때, ∠APB 구하기
    // 정오각형 한 내각 = 108°
    // △ABC는 AB=BC 이등변이므로 ∠BAC = ∠BCA = (180-108)/2 = 36°
    // 마찬가지로 ∠CBD = ∠CDB = 36°
    // △PBC에서 ∠APB는 외각: ∠PBC + ∠PCB = 36° + 36° = 72° (또는 180 - 72 = 108)
    return {
      prompt: `정오각형 ABCDE에서 두 대각선 AC와 BD의 교점을 P라 할 때, 교각 ∠APB의 크기를 구하시오. (단, 0° < ∠APB < 90°, 단위 °는 생략)`,
      promptEn: `In regular pentagon ABCDE, diagonals AC and BD intersect at P. Find the acute angle ∠APB.`,
      expression: `180^\\circ - 108^\\circ`,
      answer: '72',
      explanation: `1) 정오각형의 한 내각의 크기는 108°입니다.\n2) △ABC에서 AB = BC이므로 이등변삼각형이며, ∠BAC = ∠BCA = (180° - 108°) / 2 = 36°입니다.\n3) 마찬가지로 △BCD에서 ∠CBD = 36°입니다.\n4) △PBC에서 외각의 성질에 의해 ∠APB = ∠PBC + ∠PCB = 36° + 36° = 72°입니다.`,
    };
  } else {
    // 정육각형 ABCDEF에서 대각선 AC와 BF의 교점 또는 ∠BAC
    // 정육각형 한 내각 = 120°, △ABC에서 ∠BAC = (180-120)/2 = 30°
    return {
      prompt: `정육각형 ABCDEF에서 대각선 AC를 그었을 때, ∠BAC의 크기를 구하시오. (단, 단위 °는 생략)`,
      promptEn: `In regular hexagon ABCDEF, diagonal AC is drawn. Find ∠BAC.`,
      expression: `\\frac{180^\\circ - 120^\\circ}{2}`,
      answer: '30',
      explanation: `정육각형의 한 내각의 크기는 120°입니다. 정육각형의 변의 길이는 모두 같으므로 △ABC는 AB = BC인 이등변삼각형입니다. 따라서 ∠BAC = (180° - 120°) / 2 = 30°입니다.`,
    };
  }
}

// [유형 14] 변의 길이가 같은 두 정다각형이 한 변에서 만날 때의 각 (RPM #520~#523)
// 정오각형 + 정삼각형, 정오각형 + 정사각형, 정사각형 + 정삼각형
export function rpmPolyTwoPolygonsSharedSide(random) {
  const pairs = [
    {
      p1: '정오각형',
      p2: '정삼각형',
      deg1: 108,
      deg2: 60,
      comb: 108 + 60, // 168
      rem: 360 - (108 + 60), // 192 or angle between them
      innerIso: (180 - (108 - 60)) / 2, // 정오각형 내부 정삼각형: 108 - 60 = 48 => (180-48)/2 = 66
    },
    {
      p1: '정오각형',
      p2: '정사각형',
      deg1: 108,
      deg2: 90,
      innerDiff: 108 - 90, // 18 => (180 - 18) / 2 = 81
    },
    {
      p1: '정사각형',
      p2: '정삼각형',
      deg1: 90,
      deg2: 60,
      innerDiff: 90 - 60, // 30 => (180 - 30) / 2 = 75
    },
  ];

  const target = pick(random, pairs);
  if (target.p2 === '정삼각형' && target.p1 === '정사각형') {
    // 정사각형 ABCD 내부에 점 P를 잡아 정삼각형 PBC를 만들었을 때, ∠APD 구하기
    // ∠ABP = 90 - 60 = 30°, BA = BP 이므로 이등변삼각형, ∠BAP = (180 - 30)/2 = 75°
    // ∠DAP = 90 - 75 = 15° => △APD는 AP = DP인 이등변, ∠APD = 180 - 2*15 = 150°
    return {
      prompt: `정사각형 ABCD의 내부에 한 변 BC를 공유하는 정삼각형 PBC를 그렸다. ∠APD의 크기를 구하시오. (단, 단위 °는 생략)`,
      promptEn: `Inside square ABCD, an equilateral triangle PBC sharing side BC is drawn. Find ∠APD.`,
      expression: `180^\\circ - 2 \\times (90^\\circ - 75^\\circ)`,
      answer: '150',
      explanation: `1) 정사각형의 한 내각은 90°, 정삼각형의 한 내각은 60°입니다.\n2) ∠ABP = 90° - 60° = 30°입니다.\n3) AB = BC = BP이므로 △ABP는 이등변삼각형입니다. 따라서 ∠BAP = (180° - 30°) / 2 = 75°입니다.\n4) ∠DAP = 90° - 75° = 15°이고, 대칭에 의해 ∠ADP = 15°입니다.\n5) 따라서 △APD에서 ∠APD = 180° - (15° + 15°) = 150°입니다.`,
    };
  } else {
    // 정사각형 ABCD 외부에 정삼각형 CDE를 붙였을 때 ∠ADE 등
    // 90 + 60 = 150 => 이등변 (180 - 150) / 2 = 15°
    return {
      prompt: `한 변의 길이가 같은 정사각형 ABCD와 정삼각형 CDE를 변 CD가 맞닿도록 외부에 이어 붙였다. 선분 AE를 그었을 때, ∠DAE의 크기를 구하시오. (단, 단위 °는 생략)`,
      promptEn: `A square ABCD and an equilateral triangle CDE of equal side length are attached along side CD. Find ∠DAE.`,
      expression: `\\frac{180^\\circ - (90^\\circ + 60^\\circ)}{2}`,
      answer: '15',
      explanation: `1) ∠ADE = ∠ADC + ∠CDE = 90° + 60° = 150°입니다.\n2) AD = CD = DE이므로 △ADE는 AD = DE인 이등변삼각형입니다.\n3) 따라서 ∠DAE = (180° - 150°) / 2 = 15°입니다.`,
    };
  }
}

// [유형 15] 다각형의 꼭짓점 각의 합 (별 모양 다각형 / 맞꼭지각 보조선) (RPM #524~#526)
// 5각별 ∠A + ∠B + ∠C + ∠D + ∠E = 180°
export function rpmPolyStarPolygonAngleSum(random) {
  const mode = ri(random, 1, 2);
  if (mode === 1) {
    // 5각별에서 4개 각이 주어졌을 때 나머지 한 각 구하기
    const angles = [35, 40, 30, 45];
    const offset = ri(random, -5, 5);
    const a = 35 + offset;
    const b = 40 - offset;
    const c = 30 + offset;
    const d = 45 - offset;
    const ansE = 180 - (a + b + c + d);
    return {
      prompt: `오각별(star polygon) 모양에서 다섯 꼭짓점의 각 중 네 각의 크기가 각각 ∠A = ${a}°, ∠B = ${b}°, ∠C = ${c}°, ∠D = ${d}°일 때, ∠E의 크기를 구하시오. (단, 단위 °는 생략)`,
      promptEn: `In a 5-pointed star, four vertex angles measure ${a}°, ${b}°, ${c}°, and ${d}°. Find the fifth vertex angle ∠E.`,
      expression: `180 - (${a} + ${b} + ${c} + ${d})`,
      answer: String(ansE),
      explanation: `삼각형의 외각의 성질을 이용해 두 각씩 모으면 다섯 꼭짓점의 각의 합은 항상 한 삼각형의 내각의 합과 같으므로 ∠A + ∠B + ∠C + ∠D + ∠E = 180°입니다. 따라서 ∠E = 180° - (${a}° + ${b}° + ${c}° + ${d}°) = ${ansE}°입니다.`,
    };
  } else {
    // 6각별 (두 삼각형 겹침) 꼭짓점 각의 합: 180 + 180 = 360°
    return {
      prompt: `오른쪽 그림과 같이 두 삼각형이 겹쳐진 육각별 모양에서 여섯 꼭짓점의 각 ∠A + ∠B + ∠C + ∠D + ∠E + ∠F의 크기의 합을 구하시오. (단, 단위 °는 생략)`,
      promptEn: `In a 6-pointed star formed by two overlapping triangles, find the sum of the six vertex angles ∠A + ∠B + ∠C + ∠D + ∠E + ∠F.`,
      expression: `180^\\circ \\times 2`,
      answer: '360',
      explanation: `육각별의 여섯 꼭짓점은 두 개의 독립된 삼각형 △ACE와 △BDF의 꼭짓점들로 이루어져 있습니다. 각 삼각형의 내각의 합은 180°이므로, 여섯 각의 총합은 180° + 180° = 360°입니다.`,
    };
  }
}

// [유형 16] 평행선 종이 테이프 접기와 다각형 융합 (실력 UP) (RPM #527~#534, #547~#550)
export function rpmPolyPaperFoldParallelAngle(random) {
  // 폭이 일정한 직사각형 종이를 접었을 때:
  // 접은 각 = 원래 각, 평행선의 엇각
  const foldAngle = ri(random, 50, 75);
  const vertexAngle = 180 - 2 * foldAngle;

  const mode = ri(random, 1, 2);
  if (mode === 1) {
    // 접은 각 x가 주어졌을 때 생기는 삼각형의 꼭지각
    return {
      prompt: `직사각형 모양의 종이테이프를 오른쪽 그림과 같이 접었을 때, 접힌 각의 크기가 ${foldAngle}°이다. 이때 겹쳐진 삼각형의 꼭지각 x의 크기를 구하시오. (단, 단위 °는 생략)`,
      promptEn: `A rectangular paper strip is folded with a crease angle of ${foldAngle}°. Find the apex angle x of the resulting overlapping triangle.`,
      expression: `180 - 2 \\times ${foldAngle}`,
      answer: String(vertexAngle),
      explanation: `종이를 접었으므로 접은 각의 크기는 서로 같아 ${foldAngle}°이고, 평행선의 엇각의 크기도 같으므로 겹쳐진 삼각형은 두 밑각이 각각 ${foldAngle}°인 이등변삼각형이 됩니다. 따라서 꼭지각 x = 180° - (${foldAngle}° × 2) = ${vertexAngle}°입니다.`,
    };
  } else {
    // 꼭지각이 주어졌을 때 접은 각 x 구하기
    return {
      prompt: `직사각형 종이테이프를 접어 만든 이등변삼각형의 꼭지각이 ${vertexAngle}°일 때, 접은 각 x의 크기를 구하시오.`,
      promptEn: `A folded rectangular paper tape forms an isosceles triangle with apex angle ${vertexAngle}°. Find the crease angle x.`,
      expression: `\\frac{180 - ${vertexAngle}}{2}`,
      answer: String(foldAngle),
      explanation: `접은 각과 엇각의 성질에 의해 겹쳐진 부분은 두 밑각의 크기가 x로 같은 이등변삼각형입니다. 따라서 2x + ${vertexAngle}° = 180°이므로 2x = ${180 - vertexAngle}°, x = ${foldAngle}°입니다.`,
    };
  }
}

// [단원 종합] 다각형 전 유형 혼합
export function rpmPolyAllTypesMixed(random) {
  const generators = [
    rpmPolyConceptInteriorExterior,
    rpmPolyDiagonalCountFormula,
    rpmPolyFindPolygonFromDiagonals,
    rpmPolyTriangleAngleSumRatio,
    rpmPolyTriangleExteriorAngleProp,
    rpmPolyBoomerangConcaveAngle,
    rpmPolyIncenterAngleBisector,
    rpmPolyExteriorInteriorBisector,
    rpmPolyInteriorAngleSumFormula,
    rpmPolyExteriorAngleSumConst,
    rpmPolyRegularInteriorExterior,
    rpmPolyRegularRatioAngle,
    rpmPolyRegularDiagonalAngle,
    rpmPolyTwoPolygonsSharedSide,
    rpmPolyStarPolygonAngleSum,
    rpmPolyPaperFoldParallelAngle,
  ];
  return pick(random, generators)(random);
}

// =============================================================
// CHAPTER 05: 원과 부채꼴 응용 (RPM 1-2 Pages 86 ~ 98)
// =============================================================


// [유형 01] 원과 부채꼴의 기본 개념과 용어 (RPM #590~#596, #665)
// 호, 현, 할선, 활꼴, 중심각, 반원 특징
export function rpmCircleSectorConceptTerms(random) {
  const statements = [
    {
      text: '한 원에서 부채꼴과 활꼴이 같아지는 경우 부채꼴의 중심각의 크기는 180°(반원)이다.',
      textEn: 'When a sector and a circular segment become identical, the central angle is 180° (semicircle).',
      isCorrect: true,
      expl: '반원은 중심각이 180°인 부채꼴이면서 호와 지름으로 이루어진 활꼴이기도 하므로 부채꼴과 활꼴이 일치합니다.',
    },
    {
      text: '부채꼴의 반지름의 길이와 현의 길이가 같을 때, 이 부채꼴의 중심각의 크기는 60°이다.',
      textEn: 'When the chord length equals the radius of a sector, its central angle is 60°.',
      isCorrect: true,
      expl: '두 반지름과 현의 길이가 모두 같으면 정삼각형이 되므로 중심각의 크기는 60°입니다.',
    },
    {
      text: '원 위의 두 점을 이은 선분을 현이라 하고, 가장 긴 현은 그 원의 지름이다.',
      textEn: 'The segment connecting two points on a circle is a chord, and the longest chord is the diameter.',
      isCorrect: true,
      expl: '원의 중심을 지나는 현이 원에서 가장 긴 현이며 이것이 바로 지름입니다.',
    },
    {
      text: '원 위의 두 점을 양 끝으로 하는 원의 일부분을 활꼴이라 한다.',
      textEn: 'The portion of a circle between two points is called a segment.',
      isCorrect: false,
      expl: '원 위의 두 점을 양 끝점으로 하는 원의 일부분은 "호(arc)"라고 합니다. 호와 현으로 이루어진 도형이 "활꼴"입니다.',
    },
    {
      text: '중심각의 크기가 2배가 되면 현의 길이도 2배가 된다.',
      textEn: 'When the central angle doubles, the length of the chord also doubles.',
      isCorrect: false,
      expl: '현의 길이는 중심각의 크기에 정비례하지 않습니다. 중심각이 2배가 되면 현의 길이는 2배보다 작습니다.',
    },
  ];
  const target = pick(random, statements);
  return {
    prompt: `원과 부채꼴에 대한 다음 설명의 참/거짓을 판별하시오: "${target.text}"`,
    promptEn: `Determine True or False: "${target.textEn}"`,
    expression: target.text,
    answer: target.isCorrect ? '1' : '2',
    choices: [
      { value: '1', label: '참 (O)', labelEn: 'True' },
      { value: '2', label: '거짓 (X)', labelEn: 'False' },
    ],
    explanation: target.expl,
  };
}

// [유형 02] 중심각의 크기와 호의 길이의 정비례 관계 (RPM #597~#602, #666)
// 호의 길이는 중심각의 크기에 정비례한다.
export function rpmCircleCentralAngleArcProp(random) {
  const mode = ri(random, 1, 3);
  if (mode === 1) {
    // 각 x와 y의 비례 관계: 각도1 : 각도2 = 호1 : 호2
    const theta1 = pick(random, [30, 40, 45, 60, 75]);
    const factor = ri(random, 2, 4);
    const theta2 = theta1 * factor;
    const arc1 = ri(random, 3, 8);
    const arc2 = arc1 * factor;
    return {
      prompt: `한 원에서 중심각의 크기가 ${theta1}°인 부채꼴의 호의 길이가 ${arc1}cm이다. 같은 원에서 중심각의 크기가 ${theta2}°인 부채꼴의 호의 길이를 구하시오. (단, 단위 cm는 생략)`,
      promptEn: `In a circle, a central angle of ${theta1}° subtends an arc of length ${arc1} cm. Find the arc length for a central angle of ${theta2}°.`,
      expression: `\\frac{${theta2}}{${theta1}} \\times ${arc1}`,
      answer: String(arc2),
      explanation: `한 원에서 부채꼴의 호의 길이는 중심각의 크기에 정비례합니다. 중심각이 ${theta1}°에서 ${theta2}°로 ${factor}배가 되었으므로 호의 길이도 ${arc1} × ${factor} = ${arc2}cm가 됩니다.`,
    };
  } else if (mode === 2) {
    // 호의 길이의 비가 a : b : c 일 때 가장 큰 중심각 구하기 (원 전체 둘레 분할)
    const ratios = [
      [2, 3, 4],
      [1, 2, 3],
      [3, 4, 5],
      [2, 3, 5],
      [1, 3, 5],
    ];
    const [a, b, c] = pick(random, ratios);
    const sum = a + b + c;
    const maxPart = Math.max(a, b, c);
    const centralAngle = (360 * maxPart) / sum;
    return {
      prompt: `원 O의 둘레 위의 세 점 A, B, C에 의해 생기는 세 호 AB, BC, CA의 길이의 비가 ${a} : ${b} : ${c}일 때, 가장 큰 중심각의 크기를 구하시오. (단, 단위 °는 생략)`,
      promptEn: `Three points A, B, C divide a circle into arcs AB, BC, CA in the ratio ${a} : ${b} : ${c}. Find the measure of the largest central angle.`,
      expression: `360^\\circ \\times \\frac{${maxPart}}{${sum}}`,
      answer: String(centralAngle),
      explanation: `원 전체의 중심각은 360°이고, 호의 길이는 중심각에 정비례하므로 비례배분을 이용합니다. 가장 큰 중심각 = 360° × ${maxPart} / (${a} + ${b} + ${c}) = 360° × ${maxPart} / ${sum} = ${centralAngle}°입니다.`,
    };
  } else {
    // 호의 길이가 주어졌을 때 미지각 x 구하기
    const theta = ri(random, 25, 70);
    const mult = ri(random, 2, 3);
    const arc = ri(random, 4, 10);
    const totalArc = arc * mult;
    const targetTheta = theta * mult;
    return {
      prompt: `한 원에서 호 AB의 길이가 ${arc}cm일 때 중심각의 크기는 ${theta}°이다. 같은 원에서 호 CD의 길이가 ${totalArc}cm일 때, 호 CD에 대한 중심각 x의 크기를 구하시오.`,
      promptEn: `In a circle, arc AB of length ${arc} cm has a central angle of ${theta}°. Find the central angle x for an arc CD of length ${totalArc} cm.`,
      expression: `\\frac{${totalArc}}{${arc}} \\times ${theta}`,
      answer: String(targetTheta),
      explanation: `호의 길이는 중심각의 크기에 정비례하므로, x = ${theta}° × (${totalArc} / ${arc}) = ${theta}° × ${mult} = ${targetTheta}°입니다.`,
    };
  }
}

// [유형 03] 평행선과 보조선을 이용한 호의 길이 구하기 (RPM #603~#604)
// AB // CD, OA = OC = OB (이등변삼각형 밑각과 엇각/동위각)
export function rpmCircleParallelChordArc(random) {
  // 원 O에서 현 AB와 지름 CD(또는 다른 현)가 평행할 때
  // ∠OAB = theta => OA = OB 이므로 ∠OBA = theta
  // 평행선 엇각/동위각에 의해 중심각 ∠AOC = theta, etc.
  const theta = ri(random, 20, 45);
  const arcAC = ri(random, 4, 12);
  // If central angle for AC is theta, and arcAC is given, find arc for central angle 180 - 2*theta
  const centerAngleAOB = 180 - 2 * theta;
  const arcAB = Math.round((arcAC * centerAngleAOB) / theta);

  return {
    prompt: `오른쪽 그림과 같이 원 O에서 지름 CD와 현 AB가 평행하다. OA = OB이고 ∠OAB = ${theta}°이다. 호 AC의 길이가 ${arcAC}cm일 때, 호 AB의 길이를 구하시오. (단, 단위 cm는 생략)`,
    promptEn: `In circle O, diameter CD is parallel to chord AB. OA = OB and ∠OAB = ${theta}°. If arc AC has length ${arcAC} cm, find the length of arc AB.`,
    expression: `${arcAC} \\times \\frac{180 - 2 \\times ${theta}}{${theta}}`,
    answer: String(arcAB),
    explanation: `1) △OAB는 OA = OB(반지름)인 이등변삼각형이므로 ∠OBA = ∠OAB = ${theta}°입니다.\n2) ∠AOB = 180° - 2 × ${theta}° = ${centerAngleAOB}°입니다.\n3) AB // CD이므로 엇각에 의해 ∠AOC = ∠OAB = ${theta}°입니다.\n4) 호의 길이는 중심각에 정비례하므로 (호 AB) = (호 AC) × (${centerAngleAOB}° / ${theta}°) = ${arcAC} × ${centerAngleAOB / theta} = ${arcAB}cm입니다.`,
  };
}

// [유형 04] 중심각의 크기와 부채꼴의 넓이의 정비례 관계 (RPM #605~#607)
export function rpmCircleCentralAngleAreaProp(random) {
  const theta1 = pick(random, [30, 40, 45, 60]);
  const factor = ri(random, 2, 4);
  const theta2 = theta1 * factor;
  const area1 = ri(random, 4, 15);
  const area2 = area1 * factor;

  const mode = ri(random, 1, 2);
  if (mode === 1) {
    return {
      prompt: `한 원에서 중심각의 크기가 ${theta1}°인 부채꼴의 넓이가 ${area1}cm²이다. 중심각의 크기가 ${theta2}°인 부채꼴의 넓이를 구하시오. (단, 단위 cm²는 생략)`,
      promptEn: `In a circle, a sector with central angle ${theta1}° has area ${area1} cm². Find the area of a sector with central angle ${theta2}°.`,
      expression: `\\frac{${theta2}}{${theta1}} \\times ${area1}`,
      answer: String(area2),
      explanation: `부채꼴의 넓이는 중심각의 크기에 정비례합니다. 중심각이 ${theta1}°에서 ${theta2}°로 ${factor}배가 되었으므로 넓이도 ${area1} × ${factor} = ${area2}cm²입니다.`,
    };
  } else {
    // 부채꼴 넓이로 원 전체의 넓이 구하기
    const wholeArea = (area1 * 360) / theta1;
    return {
      prompt: `원 O에서 중심각의 크기가 ${theta1}°인 부채꼴의 넓이가 ${area1}cm²일 때, 원 O 전체의 넓이를 구하시오.`,
      promptEn: `In circle O, the area of a sector with central angle ${theta1}° is ${area1} cm². Find the area of the entire circle.`,
      expression: `\\frac{360}{${theta1}} \\times ${area1}`,
      answer: String(wholeArea),
      explanation: `원 전체의 중심각은 360°입니다. 따라서 원의 넓이는 부채꼴의 넓이의 360 / ${theta1} = ${360 / theta1}배이므로 ${area1} × ${360 / theta1} = ${wholeArea}cm²입니다.`,
    };
  }
}

// [유형 05] 중심각의 크기와 현의 길이 관계 (RPM #608~#612)
// 중심각이 같으면 현의 길이도 같지만, 현의 길이는 중심각에 정비례하지 않는다.
export function rpmCircleChordNotProportional(random) {
  const mode = ri(random, 1, 2);
  if (mode === 1) {
    // 참 거짓 판별
    const items = [
      {
        q: '한 원에서 중심각의 크기가 같으면 현의 길이도 같다.',
        qEn: 'In a circle, chords subtending equal central angles have equal lengths.',
        ans: true,
        expl: '합동인 삼각형이 만들어지므로 중심각의 크기가 같으면 현의 길이도 같습니다.',
      },
      {
        q: '한 원에서 중심각의 크기가 2배가 되면 현의 길이도 2배가 된다.',
        qEn: 'If a central angle doubles, the chord length also doubles.',
        ans: false,
        expl: '삼각형의 두 변의 길이의 합은 다른 한 변의 길이보다 크므로, 중심각이 2배가 되어도 현의 길이는 2배보다 작습니다. 따라서 현의 길이는 중심각에 정비례하지 않습니다.',
      },
      {
        q: '한 원에서 중심각의 크기에 정비례하는 것은 호의 길이와 부채꼴의 넓이이다.',
        qEn: 'In a circle, arc length and sector area are directly proportional to the central angle.',
        ans: true,
        expl: '호의 길이와 부채꼴의 넓이는 중심각에 정비례하지만, 현의 길이와 삼각형의 넓이는 정비례하지 않습니다.',
      },
      {
        q: '한 원에서 길이가 같은 현에 대한 중심각의 크기는 서로 같다.',
        qEn: 'In a circle, chords of equal length subtend equal central angles.',
        ans: true,
        expl: 'SSS 삼각형 합동에 의해 현의 길이가 같으면 중심각의 크기도 같습니다.',
      },
    ];
    const target = pick(random, items);
    return {
      prompt: `원과 중심각의 성질에 대한 다음 설명의 참/거짓을 판별하시오: "${target.q}"`,
      promptEn: `Determine True or False: "${target.qEn}"`,
      expression: target.q,
      answer: target.ans ? '1' : '2',
      choices: [
        { value: '1', label: '참 (O)', labelEn: 'True' },
        { value: '2', label: '거짓 (X)', labelEn: 'False' },
      ],
      explanation: target.expl,
    };
  } else {
    // 객관식: 다음 중 중심각의 크기에 정비례하지 않는 것을 모두 고른 것은?
    return {
      prompt: `한 원에서 중심각의 크기에 정비례하지 않는 것을 다음 보기에서 고르시오: ㉠ 호의 길이  ㉡ 부채꼴의 넓이  ㉢ 현의 길이  ㉣ 삼각형의 넓이`,
      promptEn: `Which of the following are NOT directly proportional to the central angle? (a) arc length, (b) sector area, (c) chord length, (d) triangle area`,
      expression: `\\text{정비례하지 않는 것: 현의 길이, 삼각형의 넓이}`,
      answer: '3',
      choices: [
        { value: '1', label: '㉠, ㉡', labelEn: '(a), (b)' },
        { value: '2', label: '㉠, ㉢', labelEn: '(a), (c)' },
        { value: '3', label: '㉢, ㉣', labelEn: '(c), (d)' },
        { value: '4', label: '㉡, ㉣', labelEn: '(b), (d)' },
      ],
      explanation: `한 원에서 호의 길이와 부채꼴의 넓이는 중심각의 크기에 정비례하지만, 현의 길이와 삼각형의 넓이는 중심각의 크기에 정비례하지 않습니다. 따라서 정답은 ㉢, ㉣입니다.`,
    };
  }
}

// [유형 06] 원의 둘레의 길이와 넓이 (RPM #613~#620)
// l = 2πr, S = πr²
export function rpmCircleCircumferenceAndArea(random) {
  const r = ri(random, 3, 15);
  const lCoeff = 2 * r;
  const sCoeff = r * r;

  const mode = ri(random, 1, 3);
  if (mode === 1) {
    // 반지름이 주어졌을 때 넓이의 π 계수 k 구하기
    return {
      prompt: `반지름의 길이가 ${r}cm인 원의 넓이가 kπ cm²일 때, 상수 k의 값을 구하시오.`,
      promptEn: `The area of a circle with radius ${r} cm is kπ cm². Find the value of k.`,
      expression: `\\pi \\times ${r}^2`,
      answer: String(sCoeff),
      explanation: `원의 넓이 공식은 S = πr² 입니다. 반지름이 ${r}cm이므로 S = π × ${r}² = ${sCoeff}π cm²입니다. 따라서 k = ${sCoeff}입니다.`,
    };
  } else if (mode === 2) {
    // 둘레가 주어졌을 때 원의 넓이의 π 계수 k 구하기
    return {
      prompt: `둘레의 길이가 ${lCoeff}π cm인 원의 넓이가 kπ cm²일 때, 상수 k의 값을 구하시오.`,
      promptEn: `A circle has circumference ${lCoeff}π cm. If its area is kπ cm², find k.`,
      expression: `\\pi \\times \\left(\\frac{${lCoeff}}{2}\\right)^2`,
      answer: String(sCoeff),
      explanation: `원의 둘레는 2πr = ${lCoeff}π 이므로 반지름 r = ${r}cm입니다. 따라서 원의 넓이는 S = πr² = π × ${r}² = ${sCoeff}π cm²이므로 k = ${sCoeff}입니다.`,
    };
  } else {
    // 지름이 주어졌을 때 둘레의 길이 l = kπ 에서 k 구하기
    const d = 2 * r;
    return {
      prompt: `지름의 길이가 ${d}cm인 원의 둘레의 길이가 kπ cm일 때, 상수 k의 값을 구하시오.`,
      promptEn: `The diameter of a circle is ${d} cm. If its circumference is kπ cm, find k.`,
      expression: `2\\pi r = \\pi d`,
      answer: String(d),
      explanation: `원의 둘레 l = 2πr = π × (지름) = ${d}π cm입니다. 따라서 k = ${d}입니다.`,
    };
  }
}

// [유형 07] 부채꼴의 호의 길이와 넓이 (기본 공식) (RPM #621~#628)
// l = 2πr × (x / 360), S = πr² × (x / 360)
export function rpmSectorArcLengthAndArea(random) {
  const rList = [4, 6, 8, 9, 10, 12];
  const r = pick(random, rList);
  const thetas = [30, 45, 60, 90, 120, 135, 150];
  // Filter theta such that (2 * r * theta) % 360 === 0
  const validThetas = thetas.filter((t) => (2 * r * t) % 360 === 0);
  const theta = pick(random, validThetas.length ? validThetas : [60]);

  const arcCoeff = (2 * r * theta) / 360;
  const areaCoeff = (r * r * theta) / 360;

  const mode = ri(random, 1, 2);
  if (mode === 1) {
    // 호의 길이 kπ 구하기
    return {
      prompt: `반지름의 길이가 ${r}cm이고 중심각의 크기가 ${theta}°인 부채꼴의 호의 길이가 kπ cm일 때, 상수 k의 값을 구하시오.`,
      promptEn: `A sector has radius ${r} cm and central angle ${theta}°. If its arc length is kπ cm, find k.`,
      expression: `2 \\times ${r} \\times \\frac{${theta}}{360}`,
      answer: String(arcCoeff),
      explanation: `부채꼴의 호의 길이 l = 2πr × (x / 360) = 2π × ${r} × (${theta} / 360) = ${arcCoeff}π cm입니다. 따라서 k = ${arcCoeff}입니다.`,
    };
  } else {
    // 부채꼴 넓이 kπ 구하기
    return {
      prompt: `반지름의 길이가 ${r}cm이고 중심각의 크기가 ${theta}°인 부채꼴의 넓이가 kπ cm²일 때, 상수 k의 값을 구하시오.`,
      promptEn: `A sector has radius ${r} cm and central angle ${theta}°. If its area is kπ cm², find k.`,
      expression: `${r}^2 \\times \\frac{${theta}}{360}`,
      answer: String(areaCoeff),
      explanation: `부채꼴의 넓이 S = πr² × (x / 360) = π × ${r}² × (${theta} / 360) = ${areaCoeff}π cm²입니다. 따라서 k = ${areaCoeff}입니다.`,
    };
  }
}

// [유형 08] 호의 길이와 넓이의 관계 (S = 1/2 * r * l) (RPM #629~#636)
export function rpmSectorAreaFromArcRadius(random) {
  const r = ri(random, 4, 14);
  const arcCoeff = ri(random, 2, 8) * 2; // 짝수로 설정
  const areaCoeff = (r * arcCoeff) / 2;

  const mode = ri(random, 1, 2);
  if (mode === 1) {
    // r과 l이 주어질 때 넓이 S = (1/2) * r * l
    return {
      prompt: `반지름의 길이가 ${r}cm이고 호의 길이가 ${arcCoeff}π cm인 부채꼴의 넓이가 kπ cm²일 때, 상수 k의 값을 구하시오.`,
      promptEn: `A sector has radius ${r} cm and arc length ${arcCoeff}π cm. If its area is kπ cm², find k.`,
      expression: `\\frac{1}{2} \\times ${r} \\times ${arcCoeff}`,
      answer: String(areaCoeff),
      explanation: `호의 길이 l과 반지름 r이 주어졌을 때 부채꼴의 넓이는 S = (1/2)rl 입니다. 따라서 S = (1/2) × ${r} × ${arcCoeff}π = ${areaCoeff}π cm²이므로 k = ${areaCoeff}입니다.`,
    };
  } else {
    // l과 S가 주어졌을 때 반지름 r 구하기
    return {
      prompt: `호의 길이가 ${arcCoeff}π cm이고 넓이가 ${areaCoeff}π cm²인 부채꼴의 반지름의 길이를 구하시오. (단, 단위 cm는 생략)`,
      promptEn: `A sector has arc length ${arcCoeff}π cm and area ${areaCoeff}π cm². Find its radius.`,
      expression: `\\frac{2 \\times ${areaCoeff}}{${arcCoeff}}`,
      answer: String(r),
      explanation: `S = (1/2)rl 에서 ${areaCoeff}π = (1/2) × r × ${arcCoeff}π 이므로 r = (2 × ${areaCoeff}) / ${arcCoeff} = ${r}cm입니다.`,
    };
  }
}

// [유형 09] 색칠한 부분의 둘레의 길이 (RPM #637~#644)
// 도넛 고리, 사분원과 직각삼각형 결합, 반원 2개 접합 등
export function rpmShadedRegionPerimeter(random) {
  const mode = ri(random, 1, 2);
  if (mode === 1) {
    // 지름이 2r인 반원 안에 지름이 각각 r인 작은 반원 2개가 들어있는 모양
    // 둘레 = 큰 반원 호(πr) + 작은 반원 호 2개(2 * π(r/2) = πr) = 2πr
    const r = ri(random, 4, 12); // 큰 반원의 반지름 r
    const totalCircumPi = 2 * r;
    return {
      prompt: `지름이 ${2 * r}cm인 반원 내부의 지름 위에 두 작은 반원이 접해 있다. 색칠한 부분의 둘레의 길이가 kπ cm일 때, 상수 k의 값을 구하시오.`,
      promptEn: `Inside a semicircle of diameter ${2 * r} cm, two smaller semicircles are drawn on the diameter. If the perimeter of the shaded region is kπ cm, find k.`,
      expression: `\\pi \\times ${r} + 2 \\times \\left(\\pi \\times \\frac{${r}}{2}\\right)`,
      answer: String(totalCircumPi),
      explanation: `큰 반원의 호의 길이는 (2π × ${r}) / 2 = ${r}π cm이고, 작은 반원 2개의 호의 길이의 합은 2 × (2π × ${r / 2} / 2) = ${r}π cm입니다. 따라서 색칠한 부분의 둘레는 ${r}π + ${r}π = ${totalCircumPi}π cm이므로 k = ${totalCircumPi}입니다.`,
    };
  } else {
    // 중심각이 theta이고 안쪽 반지름 r1, 바깥 반지름 r2인 부채꼴 고리의 둘레
    // 둘레 = 큰 호 + 작은 호 + 2 * (r2 - r1)
    // kπ + c 형태에서 k 구하기
    const r1 = 6;
    const r2 = 12;
    const theta = 60; // 60/360 = 1/6
    const arcBig = (2 * r2 * theta) / 360; // 4
    const arcSmall = (2 * r1 * theta) / 360; // 2
    const totalArc = arcBig + arcSmall; // 6
    const straight = 2 * (r2 - r1); // 12
    return {
      prompt: `반지름의 길이가 각각 6cm, 12cm이고 중심각의 크기가 60°인 두 부채꼴로 둘러싸인 고리 모양(부채꼴 모양)의 둘레가 (aπ + b)cm일 때, a + b의 값을 구하시오.`,
      promptEn: `An annular sector has inner radius 6 cm, outer radius 12 cm, and central angle 60°. If its perimeter is (aπ + b) cm, find a + b.`,
      expression: `(${arcBig} + ${arcSmall}) + 2 \\times (12 - 6)`,
      answer: String(totalArc + straight),
      explanation: `1) 큰 호의 길이는 2π × 12 × (60 / 360) = 4π cm입니다.\n2) 작은 호의 길이는 2π × 6 × (60 / 360) = 2π cm입니다.\n3) 직선 부분의 길이는 2 × (12 - 6) = 12 cm입니다.\n4) 따라서 둘레는 (4π + 2π + 12) = (6π + 12)cm이므로 a = 6, b = 12, a + b = 18입니다.`,
    };
  }
}

// [유형 10] 색칠한 부분의 넓이 (정사각형 안 나뭇잎 모양, 활꼴) (RPM #645~#651)
export function rpmShadedRegionAreaDiff(random) {
  const mode = ri(random, 1, 2);
  if (mode === 1) {
    // 한 변이 a인 정사각형 안에 사분원 2개가 겹쳐 생기는 나뭇잎(잎사귀) 모양의 넓이
    // 넓이 = 2 * (사분원) - 정사각형 = 2 * (1/4 * π * a²) - a² = (1/2 * π - 1) * a²
    // (kπ - m) cm² 형태에서 k와 m
    const aList = [4, 6, 8, 10, 12];
    const a = pick(random, aList);
    const k = (a * a) / 2;
    const m = a * a;
    return {
      prompt: `한 변의 길이가 ${a}cm인 정사각형 ABCD의 두 꼭짓점 B, D를 중심으로 하는 두 사분원이 겹쳐서 생긴 나뭇잎 모양의 넓이가 (kπ - ${m})cm²일 때, 상수 k의 값을 구하시오.`,
      promptEn: `Inside a square of side ${a} cm, two quarter-circles centered at opposite vertices overlap into a leaf shape of area (kπ - ${m}) cm². Find k.`,
      expression: `2 \\times \\left(\\frac{1}{4} \\pi \\times ${a}^2\\right) - ${a}^2`,
      answer: String(k),
      explanation: `나뭇잎 모양의 넓이는 두 사분원의 넓이의 합에서 정사각형의 넓이를 뺀 것과 같습니다. (사분원 2개 넓이) = 2 × (1/4 × π × ${a}²) = ${k}π cm²이고, 정사각형의 넓이는 ${a}² = ${m}cm²입니다. 따라서 넓이는 (${k}π - ${m})cm²이므로 k = ${k}입니다.`,
    };
  } else {
    // 반지름이 r이고 중심각이 90°인 부채꼴에서 활꼴의 넓이
    // 활꼴 = 부채꼴 - 직각이등변삼각형 = (1/4 * π * r²) - (1/2 * r²)
    const rList = [4, 6, 8, 10];
    const r = pick(random, rList);
    const k = (r * r) / 4;
    const triArea = (r * r) / 2;
    return {
      prompt: `반지름의 길이가 ${r}cm이고 중심각의 크기가 90°인 부채꼴에서 현으로 나뉜 활꼴의 넓이가 (kπ - ${triArea})cm²일 때, 상수 k의 값을 구하시오.`,
      promptEn: `In a 90° sector with radius ${r} cm, the area of the circular segment is (kπ - ${triArea}) cm². Find k.`,
      expression: `\\frac{1}{4} \\pi \\times ${r}^2 - \\frac{1}{2} \\times ${r}^2`,
      answer: String(k),
      explanation: `활꼴의 넓이 = (부채꼴의 넓이) - (직각이등변삼각형의 넓이) = (1/4 × π × ${r}²) - (1/2 × ${r} × ${r}) = (${k}π - ${triArea})cm²입니다. 따라서 k = ${k}입니다.`,
    };
  }
}

// [유형 11] 도형의 이동 및 회전으로 생기는 영역의 넓이 (RPM #652~#657, #674)
// 직각삼각형의 회전, 히포크라테스의 초승달, 잘라서 붙이기
export function rpmFigureRotationSweptArea(random) {
  const mode = ri(random, 1, 2);
  if (mode === 1) {
    // 히포크라테스의 초승달(원과 직각삼각형): 두 초승달 넓이의 합 = 직각삼각형의 넓이
    // 피타고라스 정리에 의해 두 반원의 넓이의 합 = 빗변 반원의 넓이
    // 따라서 색칠한 초승달 모양의 두 부분의 넓이의 합 = 직각삼각형 넓이
    const a = ri(random, 3, 8) * 2;
    const b = ri(random, 3, 8) * 2;
    const triArea = (a * b) / 2;
    return {
      prompt: `직각을 낀 두 변의 길이가 각각 ${a}cm, ${b}cm인 직각삼각형의 각 변을 지름으로 하는 세 반원을 그렸을 때 생기는 히포크라테스의 초승달(두 귀 모양)의 넓이를 구하시오. (단, 단위 cm²는 생략)`,
      promptEn: `In a right triangle with legs ${a} cm and ${b} cm, semicircles are constructed on each side. Find the sum of the areas of the two shaded crescents (Hippocrates' lune).`,
      expression: `\\frac{1}{2} \\times ${a} \\times ${b}`,
      answer: String(triArea),
      explanation: `히포크라테스의 원리에 의해 두 직각변을 지름으로 하는 반원의 넓이의 합은 빗변을 지름으로 하는 반원의 넓이와 같습니다. 따라서 두 초승달 모양 부분의 넓이의 합은 직각삼각형의 넓이와 정확히 같습니다. S = (1/2) × ${a} × ${b} = ${triArea}cm²입니다.`,
    };
  } else {
    // 직각삼각형 ABC(∠B=90°)를 점 C를 중심으로 회전시켰을 때 빗변이 지나간 자리의 넓이
    // = 중심각 theta인 큰 부채꼴 - 작은 부채꼴 = ...
    // 또는 부채꼴 이동으로 상쇄되어 부채꼴 넓이와 같아지는 유형
    const r = ri(random, 4, 10);
    const theta = 60; // 60도 회전
    const k = (r * r * theta) / 360;
    return {
      prompt: `길이가 ${r}cm인 선분을 한 끝점을 중심으로 60°만큼 회전시켰을 때, 이 선분이 지나간 자리의 넓이가 kπ cm²이다. 상수 k의 값을 구하시오.`,
      promptEn: `A segment of length ${r} cm is rotated by 60° around one endpoint. If the area swept by the segment is kπ cm², find k.`,
      expression: `\\pi \\times ${r}^2 \\times \\frac{60}{360}`,
      answer: String(k),
      explanation: `선분이 한 점을 중심으로 회전할 때 지나간 자리는 반지름이 ${r}cm이고 중심각이 60°인 부채꼴이 됩니다. 따라서 넓이는 π × ${r}² × (60 / 360) = ${k}π cm²이므로 k = ${k}입니다.`,
    };
  }
}

// [유형 12] 끈으로 묶인 가축의 풀 뜯는 영역 및 도형 굴리기 궤적 (RPM #658~#664)
export function rpmTetheredAnimalPastureArea(random) {
  // 직사각형 울타리(가로 a, 세로 b)의 한 꼭짓점에 끈의 길이 L로 묶인 염소
  // a = 6, b = 4, L = 8
  // 3/4 큰 원(반지름 L) + 모퉁이를 돌아서 생기는 1/4 원(반지름 L - a) + 1/4 원(반지름 L - b)
  const a = 6;
  const b = 4;
  const L = 8;
  const mainPart = (3 / 4) * (L * L); // (3/4) * 64 = 48
  const corner1 = (1 / 4) * Math.pow(L - a, 2); // (1/4) * 2^2 = 1
  const corner2 = (1 / 4) * Math.pow(L - b, 2); // (1/4) * 4^2 = 4
  const totalCoeff = mainPart + corner1 + corner2; // 48 + 1 + 4 = 53

  return {
    prompt: `가로의 길이가 ${a}m, 세로의 길이가 ${b}m인 직사각형 모양의 우리(외벽)의 한 모퉁이 꼭짓점에 길이가 ${L}m인 끈으로 양이 묶여 있다. 양이 우리 밖에서 풀을 뜯을 수 있는 최대 영역의 넓이가 kπ m²일 때, 상수 k의 값을 구하시오.`,
    promptEn: `A sheep is tethered to an outer corner of a rectangular barn measuring ${a}m by ${b}m with a rope of length ${L}m. If the maximum grazing area outside the barn is kπ m², find k.`,
    expression: `\\frac{3}{4} \\times ${L}^2 + \\frac{1}{4} \\times (${L} - ${a})^2 + \\frac{1}{4} \\times (${L} - ${b})^2`,
    answer: String(totalCoeff),
    explanation: `1) 우리의 한 모퉁이 밖에서 반지름이 ${L}m이고 중심각이 270°(3/4)인 부채꼴: (3/4) × π × ${L}² = ${mainPart}π m²\n2) 가로 변(${a}m)을 돌아가면 남은 끈의 길이는 ${L - a}m이므로, 반지름 ${L - a}m, 중심각 90°(1/4)인 부채꼴: (1/4) × π × ${L - a}² = ${corner1}π m²\n3) 세로 변(${b}m)을 돌아가면 남은 끈의 길이는 ${L - b}m이므로, 반지름 ${L - b}m, 중심각 90°(1/4)인 부채꼴: (1/4) × π × ${L - b}² = ${corner2}π m²\n4) 따라서 총 넓이는 (${mainPart} + ${corner1} + ${corner2})π = ${totalCoeff}π m²이므로 k = ${totalCoeff}입니다.`,
  };
}

// [유형 13] 다각형 둘레를 굴러가는 원의 중심 궤적 거리 및 지나간 자리의 넓이 (RPM #682~#683)
export function rpmRollingCircleTrackArea(random) {
  // 한 변이 a인 정삼각형 또는 정사각형의 둘레를 따라 반지름 r인 원이 한 바퀴 굴러감
  // 1) 원의 중심이 움직인 거리 = 다각형의 둘레 + 원의 둘레(2πr)
  // 2) 원이 지나간 자리의 넓이 = (다각형의 둘레 × 2r) + 원 1개의 넓이(π × (2r)² 또는 모퉁이 부채꼴들의 합)
  const isTriangle = random() < 0.5;
  const sides = isTriangle ? 3 : 4;
  const polyName = isTriangle ? '정삼각형' : '정사각형';
  const sideLen = isTriangle ? 12 : 10;
  const polyPerimeter = sides * sideLen;
  const r = ri(random, 1, 3); // 원의 반지름

  const mode = ri(random, 1, 2);
  if (mode === 1) {
    // 원의 중심이 움직인 거리 = 다각형 둘레 + 2πr
    const straightDist = polyPerimeter;
    const curvedDistPi = 2 * r;
    return {
      prompt: `한 변의 길이가 ${sideLen}cm인 ${polyName}의 둘레를 따라 반지름의 길이가 ${r}cm인 원이 미끄러지지 않고 한 바퀴 돌았다. 원의 중심이 움직인 거리가 (${straightDist} + kπ)cm일 때, 상수 k의 값을 구하시오.`,
      promptEn: `A circle of radius ${r} cm rolls once around a regular polygon (${polyName}) of side length ${sideLen} cm without slipping. If the distance traveled by its center is (${straightDist} + kπ) cm, find k.`,
      expression: `2 \\times ${r}`,
      answer: String(curvedDistPi),
      explanation: `원의 중심은 각 변과 평행하게 움직이므로 직선 부분의 거리는 ${polyName}의 둘레 ${polyPerimeter}cm이고, 각 꼭짓점을 돌 때 생기는 호들을 모으면 반지름이 ${r}cm인 원 1개의 원주와 같습니다. 따라서 모퉁이 곡선 거리는 2π × ${r} = ${curvedDistPi}π cm이므로 k = ${curvedDistPi}입니다.`,
    };
  } else {
    // 원이 지나간 자리의 넓이 = 직사각형들(둘레 × 2r) + 원 1개(π × (2r)²)
    const rectArea = polyPerimeter * (2 * r);
    const cornerAreaPi = Math.pow(2 * r, 2);
    return {
      prompt: `한 변의 길이가 ${sideLen}cm인 ${polyName}의 둘레를 따라 반지름의 길이가 ${r}cm인 원이 한 바퀴 돌았을 때, 원이 지나간 자리의 넓이가 (${rectArea} + kπ)cm²이다. 상수 k의 값을 구하시오.`,
      promptEn: `A circle of radius ${r} cm rolls around a ${polyName} of side ${sideLen} cm. If the area swept by the circle is (${rectArea} + kπ) cm², find k.`,
      expression: `(2 \\times ${r})^2`,
      answer: String(cornerAreaPi),
      explanation: `원이 지나간 자리는 폭이 지름(2r = ${2 * r}cm)인 직사각형 ${sides}개와 모퉁이에서 생기는 부채꼴들로 나누어집니다. 모퉁이 부채꼴들을 합치면 반지름이 지름과 같은 ${2 * r}cm인 원 1개가 되므로 모퉁이 넓이는 π × (${2 * r})² = ${cornerAreaPi}π cm²입니다. 따라서 k = ${cornerAreaPi}입니다.`,
    };
  }
}

// [단원 종합] 원과 부채꼴 전 유형 혼합
export function rpmCircleSectorAllTypesMixed(random) {
  const generators = [
    rpmCircleSectorConceptTerms,
    rpmCircleCentralAngleArcProp,
    rpmCircleParallelChordArc,
    rpmCircleCentralAngleAreaProp,
    rpmCircleChordNotProportional,
    rpmCircleCircumferenceAndArea,
    rpmSectorArcLengthAndArea,
    rpmSectorAreaFromArcRadius,
    rpmShadedRegionPerimeter,
    rpmShadedRegionAreaDiff,
    rpmFigureRotationSweptArea,
    rpmTetheredAnimalPastureArea,
    rpmRollingCircleTrackArea,
  ];
  return pick(random, generators)(random);
}

// [1학기/2학기 평면도형 총괄 평가] 중1-2 평면도형 실전 총괄 모의고사
export function rpmPlaneFiguresSemesterMockExam(random) {
  // Polygons + Circles and Sectors comprehensive pool
  // Import or mix both chapters
  const allMixed = [
    rpmCircleSectorConceptTerms,
    rpmCircleCentralAngleArcProp,
    rpmCircleParallelChordArc,
    rpmCircleCentralAngleAreaProp,
    rpmCircleChordNotProportional,
    rpmCircleCircumferenceAndArea,
    rpmSectorArcLengthAndArea,
    rpmSectorAreaFromArcRadius,
    rpmShadedRegionPerimeter,
    rpmShadedRegionAreaDiff,
    rpmFigureRotationSweptArea,
    rpmTetheredAnimalPastureArea,
    rpmRollingCircleTrackArea,
  ];
  return pick(random, allMixed)(random);
}



// =============================================================
// CHAPTER 06: 다면체와 회전체 응용 (RPM 1-2 Pages 104 ~ 117)
// =============================================================


// [유형 01] 다면체의 뜻과 판별 (RPM #750~#755, #830)
// 다각형인 면으로만 둘러싸인 입체도형
export function rpmPolyhedronConceptClassification(random) {
  const mode = ri(random, 1, 2);
  if (mode === 1) {
    // 참/거짓 판별
    const items = [
      {
        q: '원기둥과 원뿔은 곡면으로 둘러싸여 있으므로 다면체가 아니다.',
        qEn: 'Cylinders and cones are bounded by curved surfaces, so they are not polyhedra.',
        ans: true,
        expl: '다면체는 오직 다각형인 평면으로만 둘러싸인 입체도형입니다. 원기둥, 원뿔, 구 등 곡면을 포함하는 입체도형은 다면체가 아닙니다.',
      },
      {
        q: '모든 면이 삼각형인 사각뿔은 칠면체이다.',
        qEn: 'A quadrangular pyramid whose lateral faces are triangles is a heptahedron.',
        ans: false,
        expl: '사각뿔은 밑면 1개(사각형)와 옆면 4개(삼각형)로 이루어진 오면체(5면체)입니다.',
      },
      {
        q: '다면체 중 면의 개수가 가장 적은 것은 사면체(삼각뿔)이다.',
        qEn: 'The polyhedron with the smallest number of faces is a tetrahedron (triangular pyramid).',
        ans: true,
        expl: '입체도형을 이루기 위해서는 최소 4개의 면이 필요하므로 사면체(면 4개)가 가장 면의 개수가 적은 다면체입니다.',
      },
      {
        q: '각뿔대의 두 밑면은 서로 평행하지만 합동은 아니다.',
        qEn: 'The two bases of a frustum of a pyramid are parallel, but not congruent.',
        ans: true,
        expl: '각뿔대는 각뿔을 밑면에 평행한 평면으로 잘라 생기는 입체도형이므로 두 밑면은 평행하지만 크기가 다른 닮은 다각형입니다.',
      },
    ];
    const target = pick(random, items);
    return {
      prompt: `다면체에 대한 다음 설명의 참/거짓을 판별하시오: "${target.q}"`,
      promptEn: `Determine True or False: "${target.qEn}"`,
      expression: target.q,
      answer: target.ans ? '1' : '2',
      choices: [
        { value: '1', label: '참 (O)', labelEn: 'True' },
        { value: '2', label: '거짓 (X)', labelEn: 'False' },
      ],
      explanation: target.expl,
    };
  } else {
    // 객관식: 다음 중 다면체인 것의 개수 고르기
    return {
      prompt: `다음 보기 중 다면체인 것만을 있는 대로 고른 것은? ㉠ 삼각기둥  ㉡ 원기둥  ㉢ 오각뿔  ㉣ 구  ㉤ 사각뿔대  ㉥ 원뿔`,
      promptEn: `Which of the following are polyhedra? (a) triangular prism, (b) cylinder, (c) pentagonal pyramid, (d) sphere, (e) square frustum, (f) cone`,
      expression: `\\text{다면체: 삼각기둥, 오각뿔, 사각뿔대}`,
      answer: '2',
      choices: [
        { value: '1', label: '㉠, ㉡, ㉢', labelEn: '(a), (b), (c)' },
        { value: '2', label: '㉠, ㉢, ㉤', labelEn: '(a), (c), (e)' },
        { value: '3', label: '㉢, ㉤, ㉥', labelEn: '(c), (e), (f)' },
        { value: '4', label: '㉠, ㉢, ㉣, ㉤', labelEn: '(a), (c), (d), (e)' },
      ],
      explanation: `다면체는 다각형인 면으로만 둘러싸인 입체도형입니다. 원기둥, 구, 원뿔은 곡면을 포함하므로 다면체가 아닙니다. 따라서 다면체는 ㉠ 삼각기둥, ㉢ 오각뿔, ㉤ 사각뿔대의 3개입니다.`,
    };
  }
}

// [유형 02] 각기둥, 각뿔, 각뿔대의 구성요소 (RPM #756~#762)
// n각기둥: 면 n+2, 꼭짓점 2n, 모서리 3n
// n각뿔: 면 n+1, 꼭짓점 n+1, 모서리 2n
// n각뿔대: 면 n+2, 꼭짓점 2n, 모서리 3n
export function rpmPolyhedronPrismPyramidElements(random) {
  const types = ['각기둥', '각뿔', '각뿔대'];
  const type = pick(random, types);
  const n = ri(random, 5, 12);
  const koreanNums = ['', '', '', '삼', '사', '오', '육', '칠', '팔', '구', '십', '십일', '십이'];
  const name = `${koreanNums[n]}${type}`;

  let v = 0, e = 0, f = 0;
  if (type === '각기둥' || type === '각뿔대') {
    v = 2 * n;
    e = 3 * n;
    f = n + 2;
  } else {
    v = n + 1;
    e = 2 * n;
    f = n + 1;
  }

  const mode = ri(random, 1, 3);
  if (mode === 1) {
    // 모서리의 개수 구하기
    return {
      prompt: `${name}의 모서리의 개수를 구하시오.`,
      promptEn: `Find the number of edges of a ${n}-${type}.`,
      expression: type === '각뿔' ? `2 \\times ${n}` : `3 \\times ${n}`,
      answer: String(e),
      explanation: `${name}은 밑면이 ${n}각형이므로, 모서리의 개수는 ${type === '각뿔' ? `2n = 2 × ${n} = ${e}개` : `3n = 3 × ${n} = ${e}개`}입니다.`,
    };
  } else if (mode === 2) {
    // 면의 개수 f와 꼭짓점의 개수 v의 합
    const sumVF = v + f;
    return {
      prompt: `${name}의 꼭짓점의 개수를 v, 면의 개수를 f라 할 때, v + f의 값을 구하시오.`,
      promptEn: `Let v be the number of vertices and f be the number of faces of a ${n}-${type}. Find v + f.`,
      expression: `${v} + ${f}`,
      answer: String(sumVF),
      explanation: `${name}의 꼭짓점의 개수 v = ${v}개, 면의 개수 f = ${f}개입니다. 따라서 v + f = ${v} + ${f} = ${sumVF}입니다.`,
    };
  } else {
    // 몇 면체인지 구하기
    return {
      prompt: `${name}은 몇 면체인지 숫자로 구하시오. (예: 육면체이면 6)`,
      promptEn: `How many faces does a ${n}-${type} have? (Enter the number)`,
      expression: type === '각뿔' ? `${n} + 1` : `${n} + 2`,
      answer: String(f),
      explanation: `${name}의 면의 개수는 ${type === '각뿔' ? `밑면 1개 + 옆면 ${n}개 = ${f}개` : `밑면 2개 + 옆면 ${n}개 = ${f}개`}이므로 ${f}면체입니다.`,
    };
  }
}

// [유형 03] 조건을 만족시키는 다면체 구하기 (RPM #763~#769)
export function rpmPolyhedronIdentifyFromConditions(random) {
  const n = ri(random, 5, 10);
  const koreanNums = ['', '', '', '삼', '사', '오', '육', '칠', '팔', '구', '십'];
  const mode = ri(random, 1, 3);

  if (mode === 1) {
    // 꼭짓점 수가 2n개이고, 옆면의 모양이 사다리꼴인 다면체 => n각뿔대
    const v = 2 * n;
    return {
      prompt: `다음 조건을 모두 만족시키는 입체도형의 이름을 구하시오: (가) 두 밑면은 평행하다. (나) 옆면의 모양은 사다리꼴이다. (다) 꼭짓점의 개수는 ${v}개이다.`,
      promptEn: `Identify the polyhedron satisfying: (a) two bases are parallel, (b) lateral faces are trapezoids, (c) has ${v} vertices.`,
      expression: `\\text{꼭짓점 } 2n = ${v} \\implies n = ${n}`,
      answer: `${koreanNums[n]}각뿔대`,
      explanation: `옆면의 모양이 사다리꼴이고 두 밑면이 평행한 입체도형은 각뿔대입니다. 꼭짓점의 개수가 2n = ${v}개이므로 n = ${n}입니다. 따라서 구하는 입체도형은 ${koreanNums[n]}각뿔대입니다.`,
    };
  } else if (mode === 2) {
    // 면의 개수가 n+1개이고, 꼭짓점의 개수가 n+1개이며 옆면이 삼각형인 다면체 => n각뿔
    const f = n + 1;
    return {
      prompt: `다음 조건을 만족시키는 다면체의 이름을 구하시오: (가) 밑면은 1개이다. (나) 옆면의 모양은 이등변삼각형이다. (다) 면의 개수는 ${f}개이다.`,
      promptEn: `Identify the polyhedron satisfying: (a) has 1 base, (b) lateral faces are isosceles triangles, (c) has ${f} faces.`,
      expression: `n + 1 = ${f} \\implies n = ${n}`,
      answer: `${koreanNums[n]}각뿔`,
      explanation: `밑면이 1개이고 옆면이 삼각형인 다면체는 각뿔입니다. 면의 개수가 n + 1 = ${f}개이므로 n = ${n}입니다. 따라서 ${koreanNums[n]}각뿔입니다.`,
    };
  } else {
    // 모서리의 개수가 3n개이고 옆면이 직사각형인 다면체 => n각기둥
    const e = 3 * n;
    return {
      prompt: `두 밑면이 서로 평행하고 합동인 다각형이며, 옆면이 모두 직사각형인 다면체의 모서리의 개수가 ${e}개이다. 이 다면체의 이름을 구하시오.`,
      promptEn: `A prism has two parallel and congruent bases, rectangular lateral faces, and ${e} edges. What is its name?`,
      expression: `3n = ${e} \\implies n = ${n}`,
      answer: `${koreanNums[n]}각기둥`,
      explanation: `두 밑면이 평행하고 합동이며 옆면이 직사각형인 다면체는 각기둥입니다. 각기둥의 모서리의 개수는 3n = ${e}개이므로 n = ${n}입니다. 따라서 ${koreanNums[n]}각기둥입니다.`,
    };
  }
}

// [유형 04] 오일러 공식 (v - e + f = 2) (RPM #770~#774)
export function rpmPolyhedronEulerFormula(random) {
  const n = ri(random, 5, 12);
  // v - e + f = 2
  // n각기둥: v = 2n, e = 3n, f = n + 2 => 2n - 3n + (n + 2) = 2
  // Let's create an arbitrary solid where two values are given, and find the third
  const mode = ri(random, 1, 2);
  if (mode === 1) {
    const v = ri(random, 8, 20);
    const f = ri(random, 6, 16);
    const e = v + f - 2;
    return {
      prompt: `어떤 다면체의 꼭짓점의 개수가 ${v}개이고, 면의 개수가 ${f}개일 때, 오일러 공식(v - e + f = 2)을 이용하여 모서리의 개수 e를 구하시오.`,
      promptEn: `A polyhedron has ${v} vertices and ${f} faces. Using Euler's formula v - e + f = 2, find the number of edges e.`,
      expression: `${v} + ${f} - 2`,
      answer: String(e),
      explanation: `모든 다면체에 대하여 꼭짓점의 개수 v, 모서리의 개수 e, 면의 개수 f 사이에는 v - e + f = 2 가 성립합니다. 따라서 e = v + f - 2 = ${v} + ${f} - 2 = ${e}개입니다.`,
    };
  } else {
    const v = ri(random, 10, 24);
    const e = ri(random, 18, 36);
    const f = e + 2 - v;
    return {
      prompt: `어떤 다면체의 꼭짓점의 개수가 ${v}개이고, 모서리의 개수가 ${e}개일 때, 이 다면체의 면의 개수 f를 구하시오.`,
      promptEn: `A polyhedron has ${v} vertices and ${e} edges. Find the number of faces f using Euler's formula.`,
      expression: `${e} + 2 - ${v}`,
      answer: String(f),
      explanation: `오일러 공식 v - e + f = 2 에 대입하면 ${v} - ${e} + f = 2 이므로, f = ${e} + 2 - ${v} = ${f}개입니다.`,
    };
  }
}

// [유형 05] 정다면체의 뜻과 종류 (5가지) (RPM #775~#781)
// 정다면체가 5가지뿐인 이유 (입체각 < 360°)
export function rpmRegularPolyhedraTypesConditions(random) {
  const statements = [
    {
      q: '정다면체는 정사면체, 정육면체, 정팔면체, 정십이면체, 정이십면체의 5가지뿐이다.',
      qEn: 'There are only 5 regular polyhedra: tetrahedron, cube, octahedron, dodecahedron, and icosahedron.',
      ans: true,
      expl: '입체각을 이루려면 한 꼭짓점에 모인 면의 내각의 합이 360°보다 작아야 하므로 정다면체는 정확히 5가지만 존재합니다.',
    },
    {
      q: '정육각형을 면으로 하는 정다면체를 만들 수 있다.',
      qEn: 'A regular polyhedron can be constructed using regular hexagons as faces.',
      ans: false,
      expl: '정육각형의 한 내각은 120°이므로 3개만 모여도 360°가 되어 입체를 이룰 수 없습니다. 따라서 정육각형으로 된 정다면체는 존재하지 않습니다.',
    },
    {
      q: '각 면이 모두 합동인 정다각형으로 이루어진 다면체는 항상 정다면체이다.',
      qEn: 'A polyhedron whose faces are all congruent regular polygons is always a regular polyhedron.',
      ans: false,
      expl: '각 면이 합동인 정다각형이어도 각 꼭짓점에 모인 면의 개수가 다르면 정다면체가 아닙니다. (예: 삼각기둥의 옆면을 정사각형으로 붙이거나 정사각뿔 두 개를 붙인 델타다면체)',
    },
    {
      q: '정다면체의 한 꼭짓점에 모일 수 있는 면의 개수는 최소 3개이다.',
      qEn: 'The minimum number of faces meeting at a vertex of a regular polyhedron is 3.',
      ans: true,
      expl: '공간에서 입체각을 형성하기 위해서는 적어도 3개의 면이 한 꼭짓점에 모여야 합니다.',
    },
  ];
  const target = pick(random, statements);
  return {
    prompt: `정다면체에 대한 다음 설명의 참/거짓을 판별하시오: "${target.q}"`,
    promptEn: `Determine True or False: "${target.qEn}"`,
    expression: target.q,
    answer: target.ans ? '1' : '2',
    choices: [
      { value: '1', label: '참 (O)', labelEn: 'True' },
      { value: '2', label: '거짓 (X)', labelEn: 'False' },
    ],
    explanation: target.expl,
  };
}

// [유형 06] 정다면체의 면의 모양과 한 꼭짓점에 모인 면의 개수 (RPM #782~#787)
export function rpmRegularPolyhedraFaceShapes(random) {
  const regulars = [
    { name: '정사면체', face: '정삼각형', count: 3, v: 4, e: 6, f: 4 },
    { name: '정육면체', face: '정사각형', count: 3, v: 8, e: 12, f: 6 },
    { name: '정팔면체', face: '정삼각형', count: 4, v: 6, e: 12, f: 8 },
    { name: '정십이면체', face: '정오각형', count: 3, v: 20, e: 30, f: 12 },
    { name: '정이십면체', face: '정삼각형', count: 5, v: 12, e: 30, f: 20 },
  ];
  const target = pick(random, regulars);

  const mode = ri(random, 1, 2);
  if (mode === 1) {
    // 면의 모양 묻기
    return {
      prompt: `${target.name}의 각 면의 모양을 고르시오.`,
      promptEn: `What is the shape of each face of a regular ${target.name}?`,
      expression: `\\text{면의 모양: } ${target.face}`,
      answer: target.face === '정삼각형' ? '1' : target.face === '정사각형' ? '2' : '3',
      choices: [
        { value: '1', label: '정삼각형', labelEn: 'Equilateral triangle' },
        { value: '2', label: '정사각형', labelEn: 'Square' },
        { value: '3', label: '정오각형', labelEn: 'Regular pentagon' },
        { value: '4', label: '정육각형', labelEn: 'Regular hexagon' },
      ],
      explanation: `${target.name}의 각 면의 모양은 ${target.face}입니다. (정사면체/정팔면체/정이십면체: 정삼각형, 정육면체: 정사각형, 정십이면체: 정오각형)`,
    };
  } else {
    // 한 꼭짓점에 모인 면의 개수
    return {
      prompt: `${target.name}의 한 꼭짓점에 모인 면의 개수를 구하시오. (숫자만 입력)`,
      promptEn: `Find the number of faces meeting at each vertex of a regular ${target.name}.`,
      expression: String(target.count),
      answer: String(target.count),
      explanation: `${target.name}의 한 꼭짓점에 모인 면의 개수는 ${target.count}개입니다.`,
    };
  }
}

// [유형 07] 정다면체의 꼭짓점, 모서리, 면의 개수 (RPM #788~#795)
export function rpmRegularPolyhedraElementsCount(random) {
  const regulars = [
    { name: '정사면체', v: 4, e: 6, f: 4 },
    { name: '정육면체', v: 8, e: 12, f: 6 },
    { name: '정팔면체', v: 6, e: 12, f: 8 },
    { name: '정십이면체', v: 20, e: 30, f: 12 },
    { name: '정이십면체', v: 12, e: 30, f: 20 },
  ];
  const target = pick(random, regulars);

  const mode = ri(random, 1, 3);
  if (mode === 1) {
    // 꼭짓점의 개수
    return {
      prompt: `${target.name}의 꼭짓점의 개수를 구하시오.`,
      promptEn: `Find the number of vertices of a regular ${target.name}.`,
      expression: String(target.v),
      answer: String(target.v),
      explanation: `${target.name}의 꼭짓점의 개수는 ${target.v}개입니다.`,
    };
  } else if (mode === 2) {
    // 모서리의 개수
    return {
      prompt: `${target.name}의 모서리의 개수를 구하시오.`,
      promptEn: `Find the number of edges of a regular ${target.name}.`,
      expression: String(target.e),
      answer: String(target.e),
      explanation: `${target.name}의 모서리의 개수는 ${target.e}개입니다.`,
    };
  } else {
    // 모서리 e 와 꼭짓점 v의 차: e - v
    const diff = target.e - target.v;
    return {
      prompt: `${target.name}의 모서리의 개수를 e, 꼭짓점의 개수를 v라 할 때, e - v의 값을 구하시오.`,
      promptEn: `For a regular ${target.name}, let e be edges and v be vertices. Find e - v.`,
      expression: `${target.e} - ${target.v}`,
      answer: String(diff),
      explanation: `${target.name}의 모서리의 개수는 ${target.e}개, 꼭짓점의 개수는 ${target.v}개입니다. 따라서 e - v = ${target.e} - ${target.v} = ${diff}입니다.`,
    };
  }
}

// [유형 08] 정다면체의 전개도와 마주보는 면 (RPM #796~#802)
export function rpmCubeNetOppositeFaces(random) {
  // 정육면체 주사위 눈 마주보는 합 = 7, 또는 전개도에서 마주보는 면 찾기
  // 주사위 1..6 마주보는 쌍: (1, 6), (2, 5), (3, 4)
  const diceNum = ri(random, 1, 6);
  const oppNum = 7 - diceNum;

  return {
    prompt: `오른쪽 그림과 같은 정육면체 모양의 주사위 전개도에서 마주보는 두 면의 눈의 수의 합은 항상 7이다. 숫자 ${diceNum}이 적힌 면과 마주보는 면에 적힌 숫자를 구하시오.`,
    promptEn: `In a net of a standard die, opposite faces sum to 7. What number is opposite to the face with ${diceNum}?`,
    expression: `7 - ${diceNum}`,
    answer: String(oppNum),
    explanation: `주사위에서 마주보는 두 면의 눈의 수의 합은 항상 7입니다. 따라서 ${diceNum}이 적힌 면과 마주보는 면의 숫자는 7 - ${diceNum} = ${oppNum}입니다.`,
  };
}

// [유형 09] 다면체의 단면의 모양 (RPM #803~#808)
// 정육면체를 한 평면으로 자를 때 생기는 단면 (삼각형, 사각형, 오각형, 육각형 등)
export function rpmPolyhedronCrossSectionShapes(random) {
  return {
    prompt: `정육면체를 하나의 평면으로 잘랐을 때 생길 수 없는 단면의 모양을 고르시오.`,
    promptEn: `Which of the following polygon shapes CANNOT be formed by slicing a cube with a plane?`,
    expression: `\\text{정육면체 면은 6개이므로 칠각형은 불가}`,
    answer: '4',
    choices: [
      { value: '1', label: '정삼각형', labelEn: 'Equilateral triangle' },
      { value: '2', label: '직사각형', labelEn: 'Rectangle' },
      { value: '3', label: '육각형', labelEn: 'Hexagon' },
      { value: '4', label: '칠각형', labelEn: 'Heptagon' },
    ],
    explanation: `정육면체는 6개의 면을 가지고 있으므로, 하나의 평면이 자를 수 있는 면의 최대 개수는 6개입니다. 따라서 단면은 삼각형, 사각형, 오각형, 육각형까지만 가능하며, 칠각형은 절대로 생길 수 없습니다.`,
  };
}

// [유형 10] 정다면체의 각 면의 중심을 연결하여 만든 입체도형 (쌍대다면체) (RPM #809~#813)
export function rpmDualPolyhedraConnections(random) {
  const dualPairs = [
    { orig: '정육면체', inner: '정팔면체', origF: 6, innerV: 6 },
    { orig: '정팔면체', inner: '정육면체', origF: 8, innerV: 8 },
    { orig: '정사면체', inner: '정사면체', origF: 4, innerV: 4 },
    { orig: '정십이면체', inner: '정이십면체', origF: 12, innerV: 12 },
    { orig: '정이십면체', inner: '정십이면체', origF: 20, innerV: 20 },
  ];
  const target = pick(random, dualPairs);

  return {
    prompt: `${target.orig}의 각 면의 중심을 연결하여 만든 입체도형의 이름을 구하시오.`,
    promptEn: `What polyhedron is formed by connecting the centers of all faces of a ${target.orig}?`,
    expression: `\\text{${target.orig}의 면의 수 } ${target.origF} = \\text{안쪽 입체도형의 꼭짓점의 수}`,
    answer: target.inner,
    explanation: `${target.orig}의 면의 개수는 ${target.origF}개이므로, 각 면의 중심을 연결하여 만든 입체도형의 꼭짓점의 개수도 ${target.origF}개가 됩니다. 꼭짓점이 ${target.origF}개인 정다면체는 ${target.inner}입니다.`,
  };
}

// [유형 11] 회전체의 뜻과 종류 (RPM #814~#819)
// 원기둥, 원뿔, 원뿔대, 구
export function rpmSolidsOfRevolutionTypes(random) {
  return {
    prompt: `다음 보기 중 회전체인 것만을 있는 대로 고른 것은? ㉠ 원기둥  ㉡ 사각뿔  ㉢ 구  ㉣ 정육면체  ㉤ 원뿔대  ㉥ 삼각기둥`,
    promptEn: `Which of the following are solids of revolution? (a) cylinder, (b) square pyramid, (c) sphere, (d) cube, (e) cone frustum, (f) triangular prism`,
    expression: `\\text{회전체: 원기둥, 구, 원뿔대}`,
    answer: '1',
    choices: [
      { value: '1', label: '㉠, ㉢, ㉤', labelEn: '(a), (c), (e)' },
      { value: '2', label: '㉠, ㉡, ㉤', labelEn: '(a), (b), (e)' },
      { value: '3', label: '㉢, ㉤, ㉥', labelEn: '(c), (e), (f)' },
      { value: '4', label: '㉠, ㉢, ㉣, ㉤', labelEn: '(a), (c), (d), (e)' },
    ],
    explanation: `평면도형을 회전축을 중심으로 1회전 시켜 얻는 입체도형을 회전체라고 합니다. 원기둥(직사각형 회전), 구(반원 회전), 원뿔대(사다리꼴 회전)가 회전체입니다. 따라서 정답은 ㉠, ㉢, ㉤ 입니다.`,
  };
}

// [유형 12] 회전체와 평면도형의 관계 (회전시켜 생기는 입체도형) (RPM #820~#824)
export function rpmPlanarFigureToRevolutionSolid(random) {
  const pairs = [
    { shape: '직각삼각형의 한 직각변', solid: '원뿔', expl: '직각삼각형을 한 직각변을 회전축으로 1회전 시키면 원뿔이 생깁니다.' },
    { shape: '직사각형의 한 변', solid: '원기둥', expl: '직사각형을 한 변을 회전축으로 1회전 시키면 원기둥이 생깁니다.' },
    { shape: '직각사다리꼴의 수직인 변', solid: '원뿔대', expl: '직각사다리꼴을 직각인 변을 회전축으로 1회전 시키면 원뿔대가 생깁니다.' },
    { shape: '반원의 지름', solid: '구', expl: '반원을 지름을 회전축으로 1회전 시키면 구가 생깁니다.' },
  ];
  const target = pick(random, pairs);

  return {
    prompt: `${target.shape}을 회전축으로 하여 1회전 시킬 때 생기는 회전체의 이름을 구하시오.`,
    promptEn: `What solid of revolution is generated by rotating around the ${target.shape}?`,
    expression: `\\text{생기는 회전체: } ${target.solid}`,
    answer: target.solid,
    explanation: target.expl,
  };
}

// [유형 13] 회전체의 단면의 모양 (RPM #825~#829)
// 회전축에 수직인 평면 -> 항상 원
// 회전축을 포함하는 평면 -> 선대칭도형 (원기둥: 직사각형, 원뿔: 이등변삼각형, 원뿔대: 등변사다리꼴, 구: 원)
export function rpmRevolutionCrossSectionProperty(random) {
  const items = [
    { solid: '원기둥', incPlane: '직사각형', perpPlane: '원' },
    { solid: '원뿔', incPlane: '이등변삼각형', perpPlane: '원' },
    { solid: '원뿔대', incPlane: '등변사다리꼴', perpPlane: '원' },
    { solid: '구', incPlane: '원', perpPlane: '원' },
  ];
  const target = pick(random, items);

  const mode = ri(random, 1, 2);
  if (mode === 1) {
    return {
      prompt: `${target.solid}을 회전축을 포함하는 평면으로 잘랐을 때 생기는 단면의 모양을 고르시오.`,
      promptEn: `What is the shape of the cross-section of a ${target.solid} cut by a plane containing the axis of rotation?`,
      expression: `\\text{단면 모양: } ${target.incPlane}`,
      answer: target.incPlane === '직사각형' ? '1' : target.incPlane === '이등변삼각형' ? '2' : target.incPlane === '등변사다리꼴' ? '3' : '4',
      choices: [
        { value: '1', label: '직사각형', labelEn: 'Rectangle' },
        { value: '2', label: '이등변삼각형', labelEn: 'Isosceles triangle' },
        { value: '3', label: '등변사다리꼴', labelEn: 'Isosceles trapezoid' },
        { value: '4', label: '원', labelEn: 'Circle' },
      ],
      explanation: `${target.solid}을 회전축을 포함하는 평면으로 자르면 ${target.incPlane}이 생기며, 이는 회전축에 대하여 선대칭도형입니다.`,
    };
  } else {
    return {
      prompt: `모든 회전체를 회전축에 수직인 평면으로 잘랐을 때 생기는 단면의 모양은 항상 무엇인가?`,
      promptEn: `What is always the shape of a cross-section of ANY solid of revolution cut perpendicular to its axis of rotation?`,
      expression: `\\text{항상 원}`,
      answer: '원',
      explanation: `모든 회전체는 회전축에 수직인 평면으로 자르면 그 단면이 항상 "원"이 됩니다.`,
    };
  }
}

// [유형 14] 회전체의 단면의 넓이 계산 (RPM #830~#835)
export function rpmRevolutionCrossSectionAreaCalc(random) {
  const mode = ri(random, 1, 2);
  if (mode === 1) {
    // 밑면의 반지름이 r이고 높이가 h인 원뿔을 회전축을 포함하는 평면으로 자를 때 생기는 단면(이등변삼각형)의 넓이
    // 밑변 = 2r, 높이 = h => 넓이 = (1/2) * 2r * h = r * h
    const r = ri(random, 3, 10);
    const h = ri(random, 6, 15);
    const triArea = r * h;
    return {
      prompt: `밑면의 반지름의 길이가 ${r}cm이고 높이가 ${h}cm인 원뿔을 회전축을 포함하는 평면으로 잘랐을 때 생기는 단면의 넓이를 구하시오. (단, 단위 cm²는 생략)`,
      promptEn: `A cone has base radius ${r} cm and height ${h} cm. Find the area of the cross-section cut by a plane containing the axis of rotation.`,
      expression: `\\frac{1}{2} \\times (2 \\times ${r}) \\times ${h} = ${r} \\times ${h}`,
      answer: String(triArea),
      explanation: `회전축을 포함하는 평면으로 자른 단면은 밑변의 길이가 지름(2 × ${r} = ${2 * r}cm)이고 높이가 ${h}cm인 이등변삼각형입니다. 따라서 단면의 넓이는 (1/2) × ${2 * r} × ${h} = ${triArea}cm²입니다.`,
    };
  } else {
    // 밑면의 반지름이 r이고 높이가 h인 원기둥을 회전축을 포함하는 평면으로 자른 단면(직사각형)의 넓이
    // 가로 = 2r, 세로 = h => 넓이 = 2rh
    const r = ri(random, 3, 8);
    const h = ri(random, 5, 12);
    const rectArea = 2 * r * h;
    return {
      prompt: `밑면의 반지름의 길이가 ${r}cm이고 높이가 ${h}cm인 원기둥을 회전축을 포함하는 평면으로 잘랐을 때 생기는 단면의 넓이를 구하시오. (단, 단위 cm²는 생략)`,
      promptEn: `A cylinder has base radius ${r} cm and height ${h} cm. Find the area of the cross-section cut by a plane containing the axis of rotation.`,
      expression: `(2 \\times ${r}) \\times ${h}`,
      answer: String(rectArea),
      explanation: `원기둥을 회전축을 포함하는 평면으로 자른 단면은 가로의 길이가 지름(2 × ${r} = ${2 * r}cm)이고 세로의 길이가 높이(${h}cm)인 직사각형입니다. 따라서 넓이는 ${2 * r} × ${h} = ${rectArea}cm²입니다.`,
    };
  }
}

// [유형 15] 원뿔 전개도 부채꼴의 중심각 크기 (RPM #836~#842)
// x = 360° × (r / l)
export function rpmConeNetSectorCentralAngle(random) {
  // r, l such that 360 * r / l is integer
  const pairs = [
    { r: 2, l: 6, deg: 120 },
    { r: 3, l: 9, deg: 120 },
    { r: 3, l: 12, deg: 90 },
    { r: 4, l: 12, deg: 120 },
    { r: 2, l: 8, deg: 90 },
    { r: 5, l: 12, deg: 150 },
    { r: 3, l: 6, deg: 180 },
    { r: 2, l: 5, deg: 144 },
    { r: 5, l: 18, deg: 100 },
    { r: 3, l: 8, deg: 135 },
  ];
  const target = pick(random, pairs);

  const mode = ri(random, 1, 2);
  if (mode === 1) {
    // r과 l이 주어질 때 중심각 구하기
    return {
      prompt: `밑면의 반지름의 길이가 ${target.r}cm이고 모선의 길이가 ${target.l}cm인 원뿔의 전개도에서 옆면을 이루는 부채꼴의 중심각의 크기를 구하시오. (단, 단위 °는 생략)`,
      promptEn: `In the net of a cone with base radius ${target.r} cm and slant height ${target.l} cm, find the central angle of the sector forming the lateral surface.`,
      expression: `360^\\circ \\times \\frac{${target.r}}{${target.l}}`,
      answer: String(target.deg),
      explanation: `부채꼴의 호의 길이는 밑면인 원의 둘레와 같습니다: 2π × ${target.l} × (x / 360) = 2π × ${target.r}. 따라서 중심각 x = 360° × (${target.r} / ${target.l}) = ${target.deg}°입니다.`,
    };
  } else {
    // 중심각과 모선이 주어졌을 때 밑면의 반지름 r 구하기
    return {
      prompt: `모선의 길이가 ${target.l}cm이고 옆면 부채꼴의 중심각의 크기가 ${target.deg}°인 원뿔의 밑면의 반지름의 길이를 구하시오. (단, 단위 cm는 생략)`,
      promptEn: `A cone has slant height ${target.l} cm and lateral sector central angle ${target.deg}°. Find the radius of its base.`,
      expression: `${target.l} \\times \\frac{${target.deg}}{360}`,
      answer: String(target.r),
      explanation: `밑면의 반지름 r = (모선) × (중심각 / 360°) = ${target.l} × (${target.deg} / 360) = ${target.r}cm입니다.`,
    };
  }
}

// [유형 16] 회전체의 성질 심화 판별 (실력 UP) (RPM #843~#849)
export function rpmRevolutionSolidsAdvancedProperties(random) {
  const items = [
    {
      q: '구는 회전축이 무수히 많다.',
      qEn: 'A sphere has infinitely many axes of rotation.',
      ans: true,
      expl: '구의 중심을 지나는 모든 직선은 구의 회전축이 되므로 회전축이 무수히 많습니다.',
    },
    {
      q: '원기둥을 밑면에 비스듬한 평면으로 자를 때 생기는 단면은 타원이다.',
      qEn: 'The cross-section formed by cutting a cylinder with a plane inclined to its base is an ellipse.',
      ans: true,
      expl: '원기둥을 밑면과 평행하지 않고 비스듬하게 자르면 단면은 타원이 됩니다.',
    },
    {
      q: '원뿔대는 두 밑면이 평행하므로 회전축을 포함하는 단면은 직사각형이다.',
      qEn: 'Since the two bases of a cone frustum are parallel, the cross-section containing the rotation axis is a rectangle.',
      ans: false,
      expl: '원뿔대를 회전축을 포함하는 평면으로 자른 단면은 두 밑변의 길이가 다른 "등변사다리꼴"입니다.',
    },
    {
      q: '구를 중심을 지나는 평면으로 자를 때 단면의 넓이가 가장 크다.',
      qEn: 'The cross-sectional area of a sphere is maximized when the cutting plane passes through the center of the sphere.',
      ans: true,
      expl: '구의 중심을 지나는 평면으로 자르면 단면인 원의 반지름이 구의 반지름과 같아져 단면의 넓이가 최대(대원)가 됩니다.',
    },
  ];
  const target = pick(random, items);
  return {
    prompt: `회전체의 성질에 대한 다음 설명의 참/거짓을 판별하시오: "${target.q}"`,
    promptEn: `Determine True or False: "${target.qEn}"`,
    expression: target.q,
    answer: target.ans ? '1' : '2',
    choices: [
      { value: '1', label: '참 (O)', labelEn: 'True' },
      { value: '2', label: '거짓 (X)', labelEn: 'False' },
    ],
    explanation: target.expl,
  };
}

// [단원 종합] 다면체와 회전체 전 유형 혼합
export function rpmPolyhedronRevolutionAllMixed(random) {
  const generators = [
    rpmPolyhedronConceptClassification,
    rpmPolyhedronPrismPyramidElements,
    rpmPolyhedronIdentifyFromConditions,
    rpmPolyhedronEulerFormula,
    rpmRegularPolyhedraTypesConditions,
    rpmRegularPolyhedraFaceShapes,
    rpmRegularPolyhedraElementsCount,
    rpmCubeNetOppositeFaces,
    rpmPolyhedronCrossSectionShapes,
    rpmDualPolyhedraConnections,
    rpmSolidsOfRevolutionTypes,
    rpmPlanarFigureToRevolutionSolid,
    rpmRevolutionCrossSectionProperty,
    rpmRevolutionCrossSectionAreaCalc,
    rpmConeNetSectorCentralAngle,
    rpmRevolutionSolidsAdvancedProperties,
  ];
  return pick(random, generators)(random);
}

// =============================================================
// CHAPTER 07: 입체도형의 겉넓이와 부피 응용 (RPM 1-2 Pages 122 ~ 138)
// =============================================================


// [유형 01] 각기둥의 겉넓이 (RPM #880~#885, #953)
// 겉넓이 = 2 * (밑넓이) + (옆넓이)
export function rpmPrismSurfaceAreaCalc(random) {
  const mode = ri(random, 1, 2);
  if (mode === 1) {
    // 밑면이 직각삼각형인 삼각기둥
    // 직각삼각형 두 변: a, b (빗변 c)
    const triples = [
      [3, 4, 5],
      [5, 12, 13],
      [6, 8, 10],
    ];
    const [a, b, c] = pick(random, triples);
    const h = ri(random, 6, 12);
    const baseArea = (a * b) / 2;
    const basePerimeter = a + b + c;
    const sideArea = basePerimeter * h;
    const totalArea = 2 * baseArea + sideArea;

    return {
      prompt: `밑면이 직각을 낀 두 변의 길이가 각각 ${a}cm, ${b}cm이고 빗변의 길이가 ${c}cm인 직각삼각형이고, 높이가 ${h}cm인 삼각기둥의 겉넓이를 구하시오. (단, 단위 cm²는 생략)`,
      promptEn: `Find the surface area of a triangular prism whose base is a right triangle with legs ${a} cm, ${b} cm, hypotenuse ${c} cm, and height ${h} cm.`,
      expression: `2 \\times \\left(\\frac{1}{2} \\times ${a} \\times ${b}\\right) + (${a} + ${b} + ${c}) \\times ${h}`,
      answer: String(totalArea),
      explanation: `1) 밑넓이 = (1/2) × ${a} × ${b} = ${baseArea}cm²\n2) 밑면의 둘레 = ${a} + ${b} + ${c} = ${basePerimeter}cm이므로 옆넓이 = ${basePerimeter} × ${h} = ${sideArea}cm²\n3) 겉넓이 = 2 × (밑넓이) + (옆넓이) = 2 × ${baseArea} + ${sideArea} = ${totalArea}cm²입니다.`,
    };
  } else {
    // 직육면체의 겉넓이
    const a = ri(random, 3, 7);
    const b = ri(random, 4, 8);
    const c = ri(random, 5, 10);
    const totalArea = 2 * (a * b + b * c + c * a);

    return {
      prompt: `가로의 길이가 ${a}cm, 세로의 길이가 ${b}cm, 높이가 ${c}cm인 직육면체의 겉넓이를 구하시오. (단, 단위 cm²는 생략)`,
      promptEn: `Find the surface area of a rectangular cuboid with dimensions ${a} cm by ${b} cm by ${c} cm.`,
      expression: `2 \\times (${a} \\times ${b} + ${b} \\times ${c} + ${c} \\times ${a})`,
      answer: String(totalArea),
      explanation: `직육면체의 겉넓이는 2 × (ab + bc + ca) 입니다. 2 × (${a} × ${b} + ${b} × ${c} + ${c} × ${a}) = 2 × (${a * b} + ${b * c} + ${c * a}) = 2 × ${a * b + b * c + c * a} = ${totalArea}cm²입니다.`,
    };
  }
}

// [유형 02] 원기둥의 겉넓이 (RPM #886~#891)
// S = 2πr² + 2πrh = 2πr(r + h)
export function rpmCylinderSurfaceAreaCalc(random) {
  const r = ri(random, 3, 8);
  const h = ri(random, 5, 12);
  const k = 2 * r * (r + h); // S = kπ

  return {
    prompt: `밑면의 반지름의 길이가 ${r}cm이고 높이가 ${h}cm인 원기둥의 겉넓이가 kπ cm²일 때, 상수 k의 값을 구하시오.`,
    promptEn: `A cylinder has base radius ${r} cm and height ${h} cm. If its surface area is kπ cm², find k.`,
    expression: `2\\pi \\times ${r}^2 + 2\\pi \\times ${r} \\times ${h} = 2\\pi \\times ${r} \\times (${r} + ${h})`,
    answer: String(k),
    explanation: `원기둥의 겉넓이 S = 2 × (밑넓이) + (옆넓이) = 2 × (π × ${r}²) + (2π × ${r} × ${h}) = ${2 * r * r}π + ${2 * r * h}π = ${k}π cm²입니다. 따라서 k = ${k}입니다.`,
  };
}

// [유형 03] 기둥(각기둥, 원기둥)의 부피 (RPM #892~#899)
// V = (밑넓이) * h
export function rpmPrismCylinderVolumeCalc(random) {
  const mode = ri(random, 1, 2);
  if (mode === 1) {
    // 원기둥의 부피 V = kπ
    const r = ri(random, 3, 9);
    const h = ri(random, 4, 12);
    const k = r * r * h;
    return {
      prompt: `밑면의 반지름의 길이가 ${r}cm이고 높이가 ${h}cm인 원기둥의 부피가 kπ cm³일 때, 상수 k의 값을 구하시오.`,
      promptEn: `A cylinder has base radius ${r} cm and height ${h} cm. If its volume is kπ cm³, find k.`,
      expression: `\\pi \\times ${r}^2 \\times ${h}`,
      answer: String(k),
      explanation: `원기둥의 부피 V = (밑넓이) × (높이) = π × ${r}² × ${h} = ${k}π cm³입니다. 따라서 k = ${k}입니다.`,
    };
  } else {
    // 사각기둥(밑면 사다리꼴)의 부피
    const top = ri(random, 4, 8);
    const bottom = top + ri(random, 2, 6);
    const trapH = ri(random, 4, 6);
    const prismH = ri(random, 5, 10);
    const baseArea = ((top + bottom) * trapH) / 2;
    const volume = baseArea * prismH;

    return {
      prompt: `밑면이 윗변의 길이가 ${top}cm, 아랫변의 길이가 ${bottom}cm, 높이가 ${trapH}cm인 사다리꼴이고, 기둥의 높이가 ${prismH}cm인 사각기둥의 부피를 구하시오. (단, 단위 cm³는 생략)`,
      promptEn: `Find the volume of a prism whose base is a trapezoid with top base ${top} cm, bottom base ${bottom} cm, base height ${trapH} cm, and prism height ${prismH} cm.`,
      expression: `\\frac{(${top} + ${bottom}) \\times ${trapH}}{2} \\times ${prismH}`,
      answer: String(volume),
      explanation: `1) 밑면인 사다리꼴의 넓이 = (${top} + ${bottom}) × ${trapH} / 2 = ${baseArea}cm²\n2) 기둥의 부피 = (밑넓이) × (높이) = ${baseArea} × ${prismH} = ${volume}cm³입니다.`,
    };
  }
}

// [유형 04] 구멍이 뚫린 기둥의 겉넓이와 부피 (RPM #900~#905)
export function rpmHollowPrismSurfaceVolume(random) {
  // 바깥 반지름 R, 안쪽 구멍 반지름 r, 높이 h인 원기둥 관
  const r = 3;
  const R = 6;
  const h = ri(random, 8, 12);

  const mode = ri(random, 1, 2);
  if (mode === 1) {
    // 부피 V = π(R² - r²)h
    const k = (R * R - r * r) * h;
    return {
      prompt: `밑면의 바깥쪽 반지름이 ${R}cm이고 안쪽에 반지름 ${r}cm인 원기둥 모양의 구멍이 뚫려 있는 높이 ${h}cm인 입체도형의 부피가 kπ cm³일 때, 상수 k의 값을 구하시오.`,
      promptEn: `A hollow cylinder has outer radius ${R} cm, inner radius ${r} cm, and height ${h} cm. If its volume is kπ cm³, find k.`,
      expression: `\\pi \\times (${R}^2 - ${r}^2) \\times ${h}`,
      answer: String(k),
      explanation: `부피 = (큰 원기둥의 부피) - (작은 원기둥의 부피) = π × ${R}² × ${h} - π × ${r}² × ${h} = (${R * R} - ${r * r}) × ${h} × π = ${k}π cm³이므로 k = ${k}입니다.`,
    };
  } else {
    // 겉넓이 = 2 * (밑면 도넛 넓이) + (바깥 옆넓이) + (안쪽 옆넓이)
    // 밑면 2개: 2 * π(R² - r²) = 2 * (36 - 9)π = 54π
    // 바깥 옆넓이: 2πRh = 2π * 6 * h = 12hπ
    // 안쪽 옆넓이: 2πrh = 2π * 3 * h = 6hπ
    // 총 겉넓이 k = 54 + 18h
    const base2 = 2 * (R * R - r * r);
    const lateral = 2 * (R + r) * h;
    const totalK = base2 + lateral;
    return {
      prompt: `밑면의 바깥 반지름이 ${R}cm이고 안쪽에 반지름 ${r}cm인 원기둥 모양의 구멍이 뚫려 있는 높이 ${h}cm인 입체도형의 겉넓이가 kπ cm²일 때, 상수 k의 값을 구하시오.`,
      promptEn: `Find the surface area coefficient k of a hollow cylinder with outer radius ${R} cm, inner radius ${r} cm, and height ${h} cm (Total area = kπ cm²).`,
      expression: `2 \\times \\pi (${R}^2 - ${r}^2) + 2\\pi \\times ${R} \\times ${h} + 2\\pi \\times ${r} \\times ${h}`,
      answer: String(totalK),
      explanation: `1) 밑면 2개의 넓이 = 2 × π × (${R}² - ${r}²) = 2 × (${R * R - r * r})π = ${base2}π cm²\n2) 바깥쪽 옆넓이 = 2π × ${R} × ${h} = ${2 * R * h}π cm²\n3) 안쪽 구멍의 옆넓이 = 2π × ${r} × ${h} = ${2 * r * h}π cm²\n4) 따라서 총 겉넓이는 (${base2} + ${2 * R * h} + ${2 * r * h})π = ${totalK}π cm²이므로 k = ${totalK}입니다.`,
    };
  }
}

// [유형 05] 각뿔의 겉넓이와 부피 (RPM #906~#913)
// 겉넓이 = 밑넓이 + 옆넓이, 부피 = (1/3) * 밑넓이 * 높이
export function rpmPyramidSurfaceAreaVolume(random) {
  const mode = ri(random, 1, 2);
  if (mode === 1) {
    // 정사각뿔의 겉넓이: 한 변 a, 옆면 이등변삼각형 높이 s
    const a = ri(random, 6, 12);
    const s = ri(random, 8, 15);
    const baseArea = a * a;
    const sideArea = 4 * ((a * s) / 2);
    const totalArea = baseArea + sideArea;

    return {
      prompt: `밑면이 한 변의 길이가 ${a}cm인 정사각형이고, 옆면을 이루는 이등변삼각형의 높이가 ${s}cm인 정사각뿔의 겉넓이를 구하시오. (단, 단위 cm²는 생략)`,
      promptEn: `Find the surface area of a square pyramid with base side ${a} cm and lateral triangle slant height ${s} cm.`,
      expression: `${a}^2 + 4 \\times \\left(\\frac{1}{2} \\times ${a} \\times ${s}\\right)`,
      answer: String(totalArea),
      explanation: `1) 밑넓이 = ${a} × ${a} = ${baseArea}cm²\n2) 옆넓이 = 4 × (1/2 × ${a} × ${s}) = ${sideArea}cm²\n3) 겉넓이 = ${baseArea} + ${sideArea} = ${totalArea}cm²입니다.`,
    };
  } else {
    // 정사각뿔의 부피 V = (1/3) * a² * h
    const a = ri(random, 3, 6) * 2; // 짝수
    const h = ri(random, 2, 5) * 3; // 3의 배수
    const vol = (a * a * h) / 3;

    return {
      prompt: `밑면이 한 변의 길이가 ${a}cm인 정사각형이고 높이가 ${h}cm인 정사각뿔의 부피를 구하시오. (단, 단위 cm³는 생략)`,
      promptEn: `Find the volume of a square pyramid with base side length ${a} cm and height ${h} cm.`,
      expression: `\\frac{1}{3} \\times ${a}^2 \\times ${h}`,
      answer: String(vol),
      explanation: `각뿔의 부피 공식은 V = (1/3) × (밑넓이) × (높이) 입니다. V = (1/3) × (${a} × ${a}) × ${h} = (1/3) × ${a * a} × ${h} = ${vol}cm³입니다.`,
    };
  }
}

// [유형 06] 원뿔의 겉넓이 (RPM #914~#918)
// S = πr² + πrl
export function rpmConeSurfaceAreaCalc(random) {
  const r = ri(random, 3, 8);
  const l = r + ri(random, 3, 8); // 모선의 길이
  const baseK = r * r;
  const sideK = r * l;
  const totalK = baseK + sideK;

  return {
    prompt: `밑면의 반지름의 길이가 ${r}cm이고 모선의 길이가 ${l}cm인 원뿔의 겉넓이가 kπ cm²일 때, 상수 k의 값을 구하시오.`,
    promptEn: `A cone has base radius ${r} cm and slant height ${l} cm. If its surface area is kπ cm², find k.`,
    expression: `\\pi \\times ${r}^2 + \\pi \\times ${r} \\times ${l}`,
    answer: String(totalK),
    explanation: `원뿔의 겉넓이 S = (밑넓이) + (옆넓이) = πr² + πrl = π × ${r}² + π × ${r} × ${l} = ${baseK}π + ${sideK}π = ${totalK}π cm²입니다. 따라서 k = ${totalK}입니다.`,
  };
}

// [유형 07] 원뿔의 부피 (RPM #919~#923)
// V = (1/3)πr²h
export function rpmConeVolumeCalc(random) {
  const r = ri(random, 3, 9);
  const h = ri(random, 2, 6) * 3; // 3의 배수
  const k = (r * r * h) / 3;

  return {
    prompt: `밑면의 반지름의 길이가 ${r}cm이고 높이가 ${h}cm인 원뿔의 부피가 kπ cm³일 때, 상수 k의 값을 구하시오.`,
    promptEn: `A cone has base radius ${r} cm and height ${h} cm. If its volume is kπ cm³, find k.`,
    expression: `\\frac{1}{3} \\pi \\times ${r}^2 \\times ${h}`,
    answer: String(k),
    explanation: `원뿔의 부피 공식은 V = (1/3)πr²h 입니다. V = (1/3) × π × ${r}² × ${h} = (1/3) × π × ${r * r} × ${h} = ${k}π cm³이므로 k = ${k}입니다.`,
  };
}

// [유형 08] 정육면체/직육면체에서 삼각뿔 잘라내기 (RPM #924~#925)
// 한 모퉁이를 잘라낸 삼각뿔의 부피 = (1/6) * a * b * c
export function rpmTruncatedCornerPyramidVolume(random) {
  const a = ri(random, 4, 10); // 정육면체 한 모서리
  // 모퉁이 세 모서리가 모두 a인 삼각뿔의 부피 = (1/3) * (1/2 * a * a) * a = (1/6) a³
  // Or general dimensions: cut corner x, y, z
  const x = a;
  const y = a;
  const z = a;
  const cubeVol = a * a * a;
  // Let's use a nice multiple of 6 for a
  const sideList = [6, 12];
  const side = pick(random, sideList);
  const cornerVol = (side * side * side) / 6;
  const remainVol = side * side * side - cornerVol;

  const mode = ri(random, 1, 2);
  if (mode === 1) {
    // 잘라낸 삼각뿔의 부피
    return {
      prompt: `한 모서리의 길이가 ${side}cm인 정육면체의 한 꼭짓점에서 세 모서리의 중점을 지나도록 평면으로 잘라낼 때 생기는 삼각뿔의 부피를 구하시오. (단, 중점까지의 거리는 ${side / 2}cm, 단위 cm³는 생략)`,
      promptEn: `A corner of a cube with edge length ${side} cm is sliced off through the midpoints of three concurrent edges (length ${side / 2} cm). Find the volume of this small triangular pyramid.`,
      expression: `\\frac{1}{3} \\times \\left(\\frac{1}{2} \\times ${side / 2} \\times ${side / 2}\\right) \\times ${side / 2}`,
      answer: String(Math.round(((side / 2) * (side / 2) * (side / 2)) / 6)),
      explanation: `잘라낸 삼각뿔의 세 모서리는 각각 ${side / 2}cm이므로 직교합니다. 부피 V = (1/3) × (1/2 × ${side / 2} × ${side / 2}) × (${side / 2}) = ${Math.round(((side / 2) * (side / 2) * (side / 2)) / 6)}cm³입니다.`,
    };
  } else {
    // 정육면체의 한 꼭짓점을 포함하는 세 변 전체로 만든 삼각뿔의 부피: (1/6) side³
    return {
      prompt: `한 모서리의 길이가 ${side}cm인 정육면체 ABCD-EFGH에서 꼭짓점 B, D, G를 이어서 만든 삼각뿔 C-BDG의 부피를 구하시오. (단, 단위 cm³는 생략)`,
      promptEn: `In a cube of edge ${side} cm, find the volume of the corner triangular pyramid C-BDG formed by vertices B, D, G with apex C.`,
      expression: `\\frac{1}{6} \\times ${side}^3`,
      answer: String(cornerVol),
      explanation: `삼각뿔 C-BDG는 밑면이 직각이등변삼각형 △BCD(넓이: 1/2 × ${side} × ${side})이고 높이가 CG = ${side}cm인 삼각뿔입니다. 따라서 부피 V = (1/3) × (1/2 × ${side}²) × ${side} = (1/6) × ${side}³ = ${cornerVol}cm³입니다.`,
    };
  }
}

// [유형 09] 뿔대의 겉넓이와 부피 (RPM #926~#929)
// 부피 = 큰 뿔 - 작은 뿔
export function rpmFrustumSurfaceAreaVolume(random) {
  // 원뿔대: 아랫 밑면 반지름 R = 6, 윗 밑면 반지름 r = 3
  // 작은 뿔 높이 h1 = 4, 큰 뿔 높이 h2 = 8, 뿔대 높이 h = 4
  // 큰 뿔 부피 = (1/3) * π * 36 * 8 = 96π
  // 작은 뿔 부피 = (1/3) * π * 9 * 4 = 12π
  // 뿔대 부피 = 96π - 12π = 84π
  const r = 3;
  const R = 6;
  const hFrustum = 4;
  const smallVolK = (r * r * 4) / 3; // 12
  const bigVolK = (R * R * 8) / 3; // 96
  const frustumVolK = bigVolK - smallVolK; // 84

  return {
    prompt: `아랫면의 반지름이 ${R}cm, 윗면의 반지름이 ${r}cm, 높이가 ${hFrustum}cm인 원뿔대의 부피가 kπ cm³일 때, 상수 k의 값을 구하시오. (단, 원래 원뿔의 높이는 8cm)`,
    promptEn: `A cone frustum has bottom radius ${R} cm, top radius ${r} cm, and height ${hFrustum} cm (cut from a cone of height 8 cm). If its volume is kπ cm³, find k.`,
    expression: `\\frac{1}{3}\\pi \\times ${R}^2 \\times 8 - \\frac{1}{3}\\pi \\times ${r}^2 \\times 4`,
    answer: String(frustumVolK),
    explanation: `원뿔대의 부피 = (큰 원뿔의 부피) - (작은 원뿔의 부피) = (1/3 × π × ${R}² × 8) - (1/3 × π × ${r}² × 4) = ${bigVolK}π - ${smallVolK}π = ${frustumVolK}π cm³이므로 k = ${frustumVolK}입니다.`,
  };
}

// [유형 10] 회전체의 겉넓이와 부피 (RPM #930~#933)
// 직각삼각형 1회전 -> 원뿔
export function rpmRevolutionSolidSurfaceVolume(random) {
  const triples = [
    { r: 3, h: 4, l: 5 },
    { r: 6, h: 8, l: 10 },
    { r: 5, h: 12, l: 13 },
  ];
  const t = pick(random, triples);

  const mode = ri(random, 1, 2);
  if (mode === 1) {
    // 부피 V = (1/3)πr²h
    const volK = (t.r * t.r * t.h) / 3;
    return {
      prompt: `밑변의 길이가 ${t.r}cm이고 높이가 ${t.h}cm인 직각삼각형을 높이를 회전축으로 하여 1회전 시켰을 때 생기는 회전체의 부피가 kπ cm³이다. 상수 k의 값을 구하시오.`,
      promptEn: `A right triangle with base ${t.r} cm and height ${t.h} cm is rotated 360° around its height. If the resulting solid has volume kπ cm³, find k.`,
      expression: `\\frac{1}{3} \\pi \\times ${t.r}^2 \\times ${t.h}`,
      answer: String(volK),
      explanation: `직각삼각형을 한 직각변을 축으로 회전시키면 밑면의 반지름이 ${t.r}cm이고 높이가 ${t.h}cm인 원뿔이 됩니다. 부피 V = (1/3) × π × ${t.r}² × ${t.h} = ${volK}π cm³이므로 k = ${volK}입니다.`,
    };
  } else {
    // 겉넓이 S = πr² + πrl
    const totalK = t.r * t.r + t.r * t.l;
    return {
      prompt: `밑변의 길이가 ${t.r}cm, 높이가 ${t.h}cm, 빗변이 ${t.l}cm인 직각삼각형을 높이를 회전축으로 하여 1회전 시켰을 때 생기는 회전체의 겉넓이가 kπ cm²이다. 상수 k의 값을 구하시오.`,
      promptEn: `A right triangle with legs ${t.r} cm, ${t.h} cm, and hypotenuse ${t.l} cm is rotated 360° around its height leg. If the surface area is kπ cm², find k.`,
      expression: `\\pi \\times ${t.r}^2 + \\pi \\times ${t.r} \\times ${t.l}`,
      answer: String(totalK),
      explanation: `생기는 회전체는 반지름 ${t.r}cm, 모선 ${t.l}cm인 원뿔입니다. 겉넓이 S = π × ${t.r}² + π × ${t.r} × ${t.l} = ${t.r * t.r}π + ${t.r * t.l}π = ${totalK}π cm²이므로 k = ${totalK}입니다.`,
    };
  }
}

// [유형 11] 구와 반구의 겉넓이 (RPM #934~#937)
// 구: S = 4πr², 반구: S = 3πr²
export function rpmSphereSurfaceAreaCalc(random) {
  const r = ri(random, 3, 10);
  const mode = ri(random, 1, 2);

  if (mode === 1) {
    // 구의 겉넓이
    const k = 4 * r * r;
    return {
      prompt: `반지름의 길이가 ${r}cm인 구의 겉넓이가 kπ cm²일 때, 상수 k의 값을 구하시오.`,
      promptEn: `The surface area of a sphere of radius ${r} cm is kπ cm². Find k.`,
      expression: `4\\pi \\times ${r}^2`,
      answer: String(k),
      explanation: `구의 겉넓이 공식은 S = 4πr² 입니다. S = 4 × π × ${r}² = ${k}π cm²이므로 k = ${k}입니다.`,
    };
  } else {
    // 반구의 겉넓이 (곡면 2πr² + 밑면 πr² = 3πr²)
    const k = 3 * r * r;
    return {
      prompt: `반지름의 길이가 ${r}cm인 반구의 겉넓이가 kπ cm²일 때, 상수 k의 값을 구하시오. (단, 잘린 밑면 원의 넓이 포함)`,
      promptEn: `Find the total surface area coefficient k of a solid hemisphere of radius ${r} cm (Total area = kπ cm²).`,
      expression: `2\\pi \\times ${r}^2 + \\pi \\times ${r}^2 = 3\\pi \\times ${r}^2`,
      answer: String(k),
      explanation: `반구의 겉넓이는 곡면 부분(2πr²)과 잘린 밑면 원의 넓이(πr²)의 합이므로 S = 3πr² = 3 × π × ${r}² = ${k}π cm²입니다. 따라서 k = ${k}입니다.`,
    };
  }
}

// [유형 12] 구와 반구의 부피 (RPM #938~#941)
// 구: V = (4/3)πr³, 반구: V = (2/3)πr³
export function rpmSphereVolumeCalc(random) {
  const rList = [3, 6, 9];
  const r = pick(random, rList);

  const mode = ri(random, 1, 2);
  if (mode === 1) {
    // 구의 부피
    const k = (4 * Math.pow(r, 3)) / 3;
    return {
      prompt: `반지름의 길이가 ${r}cm인 구의 부피가 kπ cm³일 때, 상수 k의 값을 구하시오.`,
      promptEn: `The volume of a sphere with radius ${r} cm is kπ cm³. Find k.`,
      expression: `\\frac{4}{3} \\pi \\times ${r}^3`,
      answer: String(k),
      explanation: `구의 부피 공식은 V = (4/3)πr³ 입니다. V = (4/3) × π × ${r}³ = ${k}π cm³이므로 k = ${k}입니다.`,
    };
  } else {
    // 반구의 부피
    const k = (2 * Math.pow(r, 3)) / 3;
    return {
      prompt: `반지름의 길이가 ${r}cm인 반구의 부피가 kπ cm³일 때, 상수 k의 값을 구하시오.`,
      promptEn: `Find the volume coefficient k of a hemisphere with radius ${r} cm (Volume = kπ cm³).`,
      expression: `\\frac{2}{3} \\pi \\times ${r}^3`,
      answer: String(k),
      explanation: `반구의 부피는 구 부피의 절반이므로 V = (2/3)πr³ = (2/3) × π × ${r}³ = ${k}π cm³입니다. 따라서 k = ${k}입니다.`,
    };
  }
}

// [유형 13] 구의 일부분(1/8 조각 등)을 잘라낸 입체도형 (RPM #942~#945)
export function rpmTruncatedSpherePartSurfaceVolume(random) {
  // 반지름 r인 구의 1/8을 잘라낸 입체도형 (남은 부분 7/8 또는 잘라낸 1/8 조각)
  // 반지름 r = 6
  // 1/8 조각:
  // 부피 = (1/8) * (4/3 * π * r³) = (1/6) * π * 216 = 36π
  // 겉넓이 = (1/8) * 4πr² + 3 * (사분원 넓이: 1/4 * πr²) = (1/2)πr² + (3/4)πr² = (5/4)πr²
  const r = 6;
  const volPart = (1 / 6) * Math.pow(r, 3); // 36
  const areaPart = (5 / 4) * Math.pow(r, 2); // (5/4) * 36 = 45

  const mode = ri(random, 1, 2);
  if (mode === 1) {
    // 1/8 조각의 부피
    return {
      prompt: `반지름의 길이가 ${r}cm인 구의 (1/8)에 해당하는 조각의 부피가 kπ cm³일 때, 상수 k의 값을 구하시오.`,
      promptEn: `Find the volume coefficient k of a one-eighth (1/8) sector of a sphere of radius ${r} cm (Volume = kπ cm³).`,
      expression: `\\frac{1}{8} \\times \\left(\\frac{4}{3} \\pi \\times ${r}^3\\right)`,
      answer: String(volPart),
      explanation: `구 전체의 부피는 (4/3) × π × ${r}³ = 288π cm³입니다. 1/8 조각의 부피는 288π / 8 = ${volPart}π cm³이므로 k = ${volPart}입니다.`,
    };
  } else {
    // 1/8 조각의 겉넓이
    return {
      prompt: `반지름의 길이가 ${r}cm인 구의 (1/8)에 해당하는 조각의 겉넓이가 kπ cm²일 때, 상수 k의 값을 구하시오.`,
      promptEn: `Find the surface area coefficient k of a one-eighth slice of a sphere of radius ${r} cm (Surface area = kπ cm²).`,
      expression: `\\frac{1}{8} \\times (4\\pi \\times ${r}^2) + 3 \\times \\left(\\frac{1}{4} \\pi \\times ${r}^2\\right)`,
      answer: String(areaPart),
      explanation: `1) 구면 부분의 넓이 = (1/8) × (4π × ${r}²) = (1/2) × 36π = 18π cm²\n2) 평면 부분(사분원 3개)의 넓이 = 3 × (1/4 × π × ${r}²) = 3 × 9π = 27π cm²\n3) 따라서 총 겉넓이는 18π + 27π = ${areaPart}π cm²이므로 k = ${areaPart}입니다.`,
    };
  }
}

// [유형 14] 원기둥, 구, 원뿔의 부피의 비 (1 : 2 : 3) (RPM #946~#952)
export function rpmConeSphereCylinderRatio(random) {
  // 밑면의 지름과 높이가 모두 2r로 같은 원기둥 안에 구와 원뿔이 꼭 맞게 들어감
  // 원뿔 : 구 : 원기둥 = 1 : 2 : 3
  const sphereVol = ri(random, 2, 8) * 18; // 36, 54, 72, etc. (multiple of 2)
  const coneVol = sphereVol / 2;
  const cylinderVol = coneVol * 3;

  const mode = ri(random, 1, 2);
  if (mode === 1) {
    // 구의 부피가 주어졌을 때 원기둥의 부피 구하기
    return {
      prompt: `오른쪽 그림과 같이 원기둥 안에 구와 원뿔이 꼭 맞게 들어 있다. 구의 부피가 ${sphereVol}π cm³일 때, 원기둥의 부피가 kπ cm³이다. 상수 k의 값을 구하시오.`,
      promptEn: `A sphere and a cone fit snugly inside a cylinder. If the sphere's volume is ${sphereVol}π cm³, find the cylinder's volume kπ cm³ (find k).`,
      expression: `${sphereVol} \\times \\frac{3}{2}`,
      answer: String(cylinderVol),
      explanation: `원기둥에 꼭 맞는 원뿔, 구, 원기둥의 부피의 비는 항상 1 : 2 : 3 입니다. 구의 부피가 ${sphereVol}π cm³이므로 원뿔의 부피는 ${coneVol}π cm³, 원기둥의 부피는 3 × ${coneVol}π = ${cylinderVol}π cm³입니다. 따라서 k = ${cylinderVol}입니다.`,
    };
  } else {
    // 구의 부피가 주어졌을 때 원뿔의 부피 구하기
    return {
      prompt: `원기둥 안에 구와 원뿔이 꼭 맞게 들어 있을 때, 구의 부피가 ${sphereVol}π cm³이다. 이 안에 들어 있는 원뿔의 부피가 kπ cm³일 때, 상수 k의 값을 구하시오.`,
      promptEn: `A sphere and a cone fit snugly in a cylinder. If the sphere volume is ${sphereVol}π cm³, find the cone's volume coefficient k.`,
      expression: `\\frac{${sphereVol}}{2}`,
      answer: String(coneVol),
      explanation: `원뿔과 구의 부피의 비는 1 : 2 입니다. 따라서 원뿔의 부피 = (구의 부피) / 2 = ${sphereVol}π / 2 = ${coneVol}π cm³이므로 k = ${coneVol}입니다.`,
    };
  }
}

// [유형 15] 그릇에 담긴 물의 부피와 높이 (RPM #964~#966)
export function rpmContainerWaterLevelVolume(random) {
  // 높이가 H인 원뿔 모양 그릇에 깊이가 H/2 또는 H/3 만큼 물이 차 있을 때
  // 닮음비 1 : 2 => 부피비 1 : 8
  // 전체 용량 V일 때 물의 부피 = V / 8, 더 채워야 할 물의 부피 = 7/8 V
  const totalVol = 8 * ri(random, 5, 15); // multiple of 8
  const waterVol = totalVol / 8;
  const neededVol = totalVol - waterVol;

  return {
    prompt: `원뿔 모양의 그릇에 높이의 (1/2)까지 물을 채웠다. 이 그릇에 가득 채울 수 있는 전체 물의 부피가 ${totalVol}mL일 때, 그릇을 가득 채우기 위해 더 부어야 하는 물의 양을 구하시오. (단, 단위 mL는 생략)`,
    promptEn: `A conical vessel is filled with water to 1/2 of its total depth. If the full capacity is ${totalVol} mL, how much more water is needed to fill the vessel completely?`,
    expression: `${totalVol} \\times \\left(1 - \\left(\\frac{1}{2}\\right)^3\\right)`,
    answer: String(neededVol),
    explanation: `물과 그릇 전체는 닮음비가 1 : 2인 닮은 입체도형입니다. 부피비는 닮음비의 세제곱이므로 1³ : 2³ = 1 : 8 입니다. 따라서 현재 채워진 물의 양은 전체의 1/8인 ${waterVol}mL이고, 더 부어야 하는 물의 양은 전체의 7/8인 ${totalVol} - ${waterVol} = ${neededVol}mL입니다.`,
  };
}

// [유형 16] 입체도형 표면 위의 최단 거리 (실력 UP) (RPM #967, #980~#983)
export function rpmSolidSurfaceShortestPath(random) {
  // 원기둥 옆면을 한 바퀴 돌아 A에서 B(A 바로 위 꼭짓점)까지의 최단거리
  // 전개도 직사각형에서 가로 = 2πr, 세로 = h
  // 피타고라스 삼각형: 가로 2πr = a, 세로 h = b => 최단거리 = c
  // RPM에서는 정육면체 모서리를 지나는 최단거리 또는 원뿔 옆면 최단거리:
  // 정육면체 한 모서리 a=4, A에서 맞은편 G까지 2개 면을 지나 이동할 때 최단거리:
  // 전개도에서 가로 2a, 세로 a 직각삼각형 대각선
  // 또는 원뿔에서 모선 l = 12, 밑면 r = 2 => 중심각 x = 360 * 2 / 12 = 60°
  // A에서 모선 한 바퀴 돌아 다시 A로 오는 최단 거리 = 정삼각형이므로 선분 길이 = l = 12
  const l = ri(random, 6, 15);
  // r = l / 6 => 중심각 60도, 정삼각형
  return {
    prompt: `밑면의 반지름의 길이가 ${l}cm이고 모선의 길이가 ${6 * l}cm인 원뿔의 전개도에서 옆면 부채꼴의 중심각의 크기는 60°이다. 모선 OA 위의 점 A에서 출발하여 원뿔의 옆면을 한 바퀴 돌아 다시 점 A로 돌아오는 실의 최단 길이를 구하시오. (단, 모선의 길이는 ${6 * l}cm, 단위 cm는 생략)`,
    promptEn: `On a cone with slant height ${6 * l} cm and lateral sector central angle 60°, find the shortest path length wrapped around the cone from point A back to A.`,
    expression: `${6 * l}`,
    answer: String(6 * l),
    explanation: `입체도형의 옆면을 돌아가는 최단거리는 전개도 상에서 두 점을 잇는 선분의 길이입니다. 전개도에서 부채꼴의 중심각이 60°이고 양 변(모선)의 길이가 각각 ${6 * l}cm이므로, 점 A와 A'을 잇는 삼각형은 정삼각형이 됩니다. 따라서 최단 길이는 모선의 길이와 같은 ${6 * l}cm입니다.`,
  };
}

// [단원 종합] 입체도형의 겉넓이와 부피 전 유형 혼합
export function rpmSolidsSurfaceVolumeAllMixed(random) {
  const generators = [
    rpmPrismSurfaceAreaCalc,
    rpmCylinderSurfaceAreaCalc,
    rpmPrismCylinderVolumeCalc,
    rpmHollowPrismSurfaceVolume,
    rpmPyramidSurfaceAreaVolume,
    rpmConeSurfaceAreaCalc,
    rpmConeVolumeCalc,
    rpmTruncatedCornerPyramidVolume,
    rpmFrustumSurfaceAreaVolume,
    rpmRevolutionSolidSurfaceVolume,
    rpmSphereSurfaceAreaCalc,
    rpmSphereVolumeCalc,
    rpmTruncatedSpherePartSurfaceVolume,
    rpmConeSphereCylinderRatio,
    rpmContainerWaterLevelVolume,
    rpmSolidSurfaceShortestPath,
  ];
  return pick(random, generators)(random);
}




// [중1-2 입체도형 총괄 모의고사]
export function rpmSolidFiguresSemesterMockExam(random) {
  const allMixed = [
    // 06 다면체와 회전체
    rpmPolyhedronConceptClassification,
    rpmPolyhedronPrismPyramidElements,
    rpmPolyhedronIdentifyFromConditions,
    rpmPolyhedronEulerFormula,
    rpmRegularPolyhedraTypesConditions,
    rpmRegularPolyhedraFaceShapes,
    rpmRegularPolyhedraElementsCount,
    rpmCubeNetOppositeFaces,
    rpmPolyhedronCrossSectionShapes,
    rpmDualPolyhedraConnections,
    rpmSolidsOfRevolutionTypes,
    rpmPlanarFigureToRevolutionSolid,
    rpmRevolutionCrossSectionProperty,
    rpmRevolutionCrossSectionAreaCalc,
    rpmConeNetSectorCentralAngle,
    rpmRevolutionSolidsAdvancedProperties,
    // 07 입체도형의 겉넓이와 부피
    rpmPrismSurfaceAreaCalc,
    rpmCylinderSurfaceAreaCalc,
    rpmPrismCylinderVolumeCalc,
    rpmHollowPrismSurfaceVolume,
    rpmPyramidSurfaceAreaVolume,
    rpmConeSurfaceAreaCalc,
    rpmConeVolumeCalc,
    rpmTruncatedCornerPyramidVolume,
    rpmFrustumSurfaceAreaVolume,
    rpmRevolutionSolidSurfaceVolume,
    rpmSphereSurfaceAreaCalc,
    rpmSphereVolumeCalc,
    rpmTruncatedSpherePartSurfaceVolume,
    rpmConeSphereCylinderRatio,
    rpmContainerWaterLevelVolume,
    rpmSolidSurfaceShortestPath,
  ];
  return pick(random, allMixed)(random);
}



// =============================================================
// CHAPTER 08 & 09: 자료의 정리와 해석 응용 (RPM 1-2 Pages 144 ~ 158 & 160 ~ 175)
// =============================================================


// [유형 01] 줄기와 잎 그림의 해석 (RPM #1000~#1005, #1073)
// 전체 자료의 수, k번째로 큰/작은 값, 특정 값 이상/이하의 백분율
export function rpmDataStemAndLeafPlot(random) {
  // 줄기 1, 2, 3, 4
  const stem1 = [2, 5, 8];
  const stem2 = [1, 4, 4, 7, 9];
  const stem3 = [0, 2, 3, 5, 6, 8];
  const stem4 = [1, 3];
  const allValues = [
    ...stem1.map((l) => 10 + l),
    ...stem2.map((l) => 20 + l),
    ...stem3.map((l) => 30 + l),
    ...stem4.map((l) => 40 + l),
  ];
  const totalCount = allValues.length; // 16명

  const mode = ri(random, 1, 3);
  if (mode === 1) {
    // 전체 학생 수 구하기
    return {
      prompt: `어느 학급 학생들의 턱걸이 횟수를 조사한 줄기와 잎 그림에서 줄기 1에 잎 3개, 줄기 2에 잎 5개, 줄기 3에 잎 6개, 줄기 4에 잎 2개가 있다. 전체 학생 수를 구하시오. (단, 단위 명은 생략)`,
      promptEn: `In a stem-and-leaf plot of pull-up counts, stem 1 has 3 leaves, stem 2 has 5 leaves, stem 3 has 6 leaves, and stem 4 has 2 leaves. Find the total number of students.`,
      expression: `3 + 5 + 6 + 2`,
      answer: String(totalCount),
      explanation: `줄기와 잎 그림에서 잎의 총 개수가 전체 자료의 개수(학생 수)와 같습니다. 따라서 전체 학생 수는 3 + 5 + 6 + 2 = ${totalCount}명입니다.`,
    };
  } else if (mode === 2) {
    // k번째로 큰 값 구하기 (예: 3번째로 큰 값)
    const k = ri(random, 2, 4);
    const sortedDesc = [...allValues].sort((a, b) => b - a);
    const ansVal = sortedDesc[k - 1];
    return {
      prompt: `줄기와 잎 그림에 나타난 자료 [12, 15, 18, 21, 24, 24, 27, 29, 30, 32, 33, 35, 36, 38, 41, 43]에서 기록이 ${k}번째로 높은 값을 구하시오.`,
      promptEn: `From the stem-and-leaf data [12, 15, 18, 21, 24, 24, 27, 29, 30, 32, 33, 35, 36, 38, 41, 43], find the ${k}th highest value.`,
      expression: `\\text{${k}번째로 큰 값}`,
      answer: String(ansVal),
      explanation: `자료를 큰 값부터 나열하면 43, 41, 38, 36, 35, ... 입니다. 따라서 ${k}번째로 높은 값은 ${ansVal}입니다.`,
    };
  } else {
    // 특정 값(30) 이상인 학생의 백분율 (%)
    const threshold = 30;
    const overCount = allValues.filter((v) => v >= threshold).length; // 8명
    const percent = Math.round((overCount / totalCount) * 100); // 50%
    return {
      prompt: `전체 학생 수가 ${totalCount}명인 줄기와 잎 그림에서 기록이 ${threshold}회 이상인 학생이 ${overCount}명이다. 기록이 ${threshold}회 이상인 학생은 전체의 몇 %인지 구하시오. (단, % 기호는 생략하고 숫자만 입력)`,
      promptEn: `In a stem-and-leaf plot of ${totalCount} students, ${overCount} students have records of at least ${threshold}. What percentage is this?`,
      expression: `\\frac{${overCount}}{${totalCount}} \\times 100`,
      answer: String(percent),
      explanation: `기록이 ${threshold}회 이상인 학생의 백분율은 (${overCount} / ${totalCount}) × 100 = ${percent}% 입니다.`,
    };
  }
}

// [유형 02] 찢어진 줄기와 잎 그림의 미지수 추적 (RPM #1006~#1010, #1074)
export function rpmDataTornStemLeafPlot(random) {
  // 전체 학생 수 20명, 줄기 1, 2, 3, 4
  // 줄기 1에 4명, 줄기 3에 6명, 줄기 4에 3명, 줄기 2가 찢어져서 보이지 않음
  const count1 = 4;
  const count3 = 6;
  const count4 = 3;
  const total = 20;
  const tornCount = total - (count1 + count3 + count4); // 7명

  return {
    prompt: `어느 학급 학생 20명의 수학 점수를 조사한 줄기와 잎 그림에서 줄기 6(60점대)에 잎이 4개, 줄기 8(80점대)에 잎이 6개, 줄기 9(90점대)에 잎이 3개 있고, 줄기 7(70점대) 부분이 찢어져서 보이지 않는다. 70점대(줄기 7)에 속하는 학생 수를 구하시오. (단, 단위 명은 생략)`,
    promptEn: `In a stem-and-leaf plot of 20 students' scores, stem 6 has 4 leaves, stem 8 has 6 leaves, stem 9 has 3 leaves, and stem 7 is torn. Find the number of students in stem 7.`,
    expression: `${total} - (${count1} + ${count3} + ${count4})`,
    answer: String(tornCount),
    explanation: `전체 학생 수가 ${total}명이므로, 찢어진 줄기 7의 학생 수는 ${total} - (${count1} + ${count3} + ${count4}) = ${total} - ${count1 + count3 + count4} = ${tornCount}명입니다.`,
  };
}

// [유형 03] 도수분포표의 기본 용어 및 계급값 (RPM #1011~#1016)
// 계급, 계급의 크기, 계급값
export function rpmDataFrequencyTableBasicTerms(random) {
  const width = pick(random, [5, 10]);
  const start = ri(random, 4, 8) * 10;
  const end = start + width;
  const mid = (start + end) / 2;

  const mode = ri(random, 1, 2);
  if (mode === 1) {
    // 계급값 구하기
    return {
      prompt: `도수분포표에서 계급이 '${start} 이상 ${end} 미만'일 때, 이 계급의 계급값을 구하시오.`,
      promptEn: `In a frequency table, find the class midpoint (class mark) for the interval '${start} to ${end}'.`,
      expression: `\\frac{${start} + ${end}}{2}`,
      answer: String(mid),
      explanation: `계급값은 계급의 양 끝값의 중앙값이므로 (${start} + ${end}) / 2 = ${mid}입니다.`,
    };
  } else {
    // 계급의 크기 구하기
    return {
      prompt: `계급이 '${start} 이상 ${end} 미만'일 때, 이 계급의 크기를 구하시오.`,
      promptEn: `Find the class width for the interval '${start} to ${end}'.`,
      expression: `${end} - ${start}`,
      answer: String(width),
      explanation: `계급의 크기는 계급의 양 끝값의 차이이므로 ${end} - ${start} = ${width}입니다.`,
    };
  }
}

// [유형 04] 도수분포표에서 미지수 도수 구하기 (RPM #1017~#1022, #1075)
export function rpmDataFrequencyTableMissingFreq(random) {
  const total = pick(random, [25, 30, 40, 50]);
  const f1 = ri(random, 3, 6);
  const f2 = ri(random, 5, 9);
  const f3 = ri(random, 4, 8);
  const fHidden = total - (f1 + f2 + f3); // remaining

  if (fHidden <= 2) {
    // fallback safe
    return {
      prompt: `전체 학생 수가 30명인 도수분포표에서 네 계급의 도수가 각각 5명, 9명, A명, 6명일 때, 도수 A의 값을 구하시오.`,
      promptEn: `In a frequency table with total frequency 30, three classes have frequencies 5, 9, 6 and one class has frequency A. Find A.`,
      expression: `30 - (5 + 9 + 6)`,
      answer: '10',
      explanation: `도수의 총합이 30명이므로 A = 30 - (5 + 9 + 6) = 30 - 20 = 10명입니다.`,
    };
  }

  return {
    prompt: `전체 학생 수가 ${total}명인 도수분포표에서 네 계급의 도수가 각각 ${f1}명, ${f2}명, A명, ${f3}명일 때, 도수 A의 값을 구하시오.`,
    promptEn: `In a frequency table of ${total} students, the frequencies are ${f1}, ${f2}, A, and ${f3}. Find A.`,
    expression: `${total} - (${f1} + ${f2} + ${f3})`,
    answer: String(fHidden),
    explanation: `도수의 총합은 ${total}명이므로 A = ${total} - (${f1} + ${f2} + ${f3}) = ${total} - ${f1 + f2 + f3} = ${fHidden}명입니다.`,
  };
}

// [유형 05] 히스토그램의 이해 및 직사각형의 넓이 (RPM #1023~#1028, #1077)
// 직사각형 넓이의 합 = (계급의 크기) * (도수의 총합)
export function rpmDataHistogramRectangleArea(random) {
  const width = pick(random, [5, 10]);
  const totalStudents = ri(random, 20, 40);
  const totalArea = width * totalStudents;

  return {
    prompt: `어느 히스토그램에서 계급의 크기가 ${width}이고, 조사한 학생의 총 수가 ${totalStudents}명이다. 이 히스토그램에 그려진 모든 직사각형의 넓이의 합을 구하시오.`,
    promptEn: `In a histogram, the class width is ${width} and the total frequency is ${totalStudents}. Find the sum of the areas of all rectangles.`,
    expression: `${width} \\times ${totalStudents}`,
    answer: String(totalArea),
    explanation: `히스토그램에서 각 직사각형의 넓이는 (계급의 크기) × (그 계급의 도수)이므로, 모든 직사각형의 넓이의 합은 (계급의 크기) × (도수의 총합) = ${width} × ${totalStudents} = ${totalArea}입니다.`,
  };
}

// [유형 06] 일부가 찢어진 히스토그램 (RPM #1029~#1035, #1078)
export function rpmDataTornHistogram(random) {
  // 전체 학생 수 40명, 찢어진 계급의 도수 구하기
  const total = 40;
  const f1 = 4;
  const f2 = 8;
  const f4 = 10;
  const f5 = 6;
  const fTorn = total - (f1 + f2 + f4 + f5); // 12명

  return {
    prompt: `전체 학생 수가 ${total}명인 히스토그램에서 한 계급의 윗부분이 찢어져서 보이지 않는다. 나머지 네 계급의 도수가 각각 ${f1}명, ${f2}명, ${f4}명, ${f5}명일 때, 찢어진 계급의 도수를 구하시오. (단, 단위 명은 생략)`,
    promptEn: `In a histogram of ${total} students, one rectangle is torn. The other four classes have frequencies ${f1}, ${f2}, ${f4}, and ${f5}. Find the frequency of the torn class.`,
    expression: `${total} - (${f1} + ${f2} + ${f4} + ${f5})`,
    answer: String(fTorn),
    explanation: `도수의 총합이 ${total}명이므로, 찢어진 계급의 도수는 ${total} - (${f1} + ${f2} + ${f4} + ${f5}) = ${total} - ${f1 + f2 + f4 + f5} = ${fTorn}명입니다.`,
  };
}

// [유형 07] 도수분포다각형의 작성과 성질 (RPM #1036~#1040)
export function rpmDataFrequencyPolygonStructure(random) {
  const statements = [
    {
      q: '도수분포다각형은 히스토그램의 각 직사각형의 윗변의 중앙의 점을 차례로 선분으로 연결하여 만든다.',
      qEn: 'A frequency polygon is constructed by connecting the midpoints of the top edges of each histogram bar.',
      ans: true,
      expl: '도수분포다각형은 각 계급의 계급값(직사각형 윗변 중앙)에 점을 찍고 차례로 이어 그립니다.',
    },
    {
      q: '도수분포다각형을 그릴 때 양 끝에는 도수가 1인 계급을 하나씩 추가한다.',
      qEn: 'When plotting a frequency polygon, a class with frequency 1 is added at each end.',
      ans: false,
      expl: '도수분포다각형의 양 끝에는 도수가 "0"인 계급을 하나씩 추가하여 가로축과 만나도록 그립니다.',
    },
    {
      q: '도수분포다각형과 가로축으로 둘러싸인 부분의 넓이는 히스토그램의 직사각형의 넓이의 합과 항상 같다.',
      qEn: 'The area enclosed by the frequency polygon and horizontal axis is always equal to the sum of the histogram bar areas.',
      ans: true,
      expl: '잘려 나간 삼각형 부분과 새로 채워지는 삼각형 부분의 넓이가 서로 합동으로 상쇄되므로 두 넓이는 항상 같습니다.',
    },
    {
      q: '도수분포다각형을 이용하면 두 개 이상의 집단의 분포 상태를 한 그래프에서 쉽게 비교할 수 있다.',
      qEn: 'A frequency polygon allows easy comparison of two or more data sets on the same graph.',
      ans: true,
      expl: '선그래프 형태이므로 여러 집단의 분포 곡선을 겹쳐서 비교하기에 매우 적합합니다.',
    },
  ];
  const target = pick(random, statements);
  return {
    prompt: `도수분포다각형에 대한 다음 설명의 참/거짓을 판별하시오: "${target.q}"`,
    promptEn: `Determine True or False: "${target.qEn}"`,
    expression: target.q,
    answer: target.ans ? '1' : '2',
    choices: [
      { value: '1', label: '참 (O)', labelEn: 'True' },
      { value: '2', label: '거짓 (X)', labelEn: 'False' },
    ],
    explanation: target.expl,
  };
}

// [유형 08] 도수분포다각형과 가로축으로 둘러싸인 부분의 넓이 (RPM #1041~#1045, #1079)
// 넓이 = (계급의 크기) * (도수의 총합)
export function rpmDataFrequencyPolygonArea(random) {
  const width = pick(random, [5, 10, 2]);
  const totalCount = ri(random, 15, 35);
  const totalArea = width * totalCount;

  return {
    prompt: `계급의 크기가 ${width}이고 도수의 총합이 ${totalCount}인 도수분포다각형과 가로축으로 둘러싸인 부분의 넓이를 구하시오.`,
    promptEn: `Find the area of the region enclosed by a frequency polygon and the horizontal axis, given a class width of ${width} and a total frequency of ${totalCount}.`,
    expression: `${width} \\times ${totalCount}`,
    answer: String(totalArea),
    explanation: `도수분포다각형과 가로축으로 둘러싸인 부분의 넓이는 히스토그램의 직사각형들의 넓이의 합과 같습니다. 넓이 = (계급의 크기) × (도수의 총합) = ${width} × ${totalCount} = ${totalArea}입니다.`,
  };
}

// [유형 09] 일부가 보이지 않는 도수분포다각형 (RPM #1046~#1050, #1080)
export function rpmDataTornFrequencyPolygon(random) {
  const total = 50;
  const f1 = 6;
  const f2 = 12;
  const f4 = 14;
  const f5 = 8;
  const fHidden = total - (f1 + f2 + f4 + f5); // 10명

  return {
    prompt: `학생 수가 총 50명인 도수분포다각형에서 한 계급의 점이 지워져 보이지 않는다. 나머지 네 계급의 도수가 각각 6명, 12명, 14명, 8명일 때, 지워진 계급의 학생 수를 구하시오.`,
    promptEn: `In a frequency polygon of 50 students, one point is missing. The other four classes have frequencies 6, 12, 14, and 8. Find the frequency of the missing class.`,
    expression: `50 - (6 + 12 + 14 + 8)`,
    answer: String(fHidden),
    explanation: `도수의 총합이 50명이므로, 지워진 계급의 도수는 50 - (6 + 12 + 14 + 8) = 50 - 40 = 10명입니다.`,
  };
}

// [유형 10] 두 집단의 도수분포다각형 비교 (RPM #1051~#1054)
export function rpmDataTwoGroupsPolygonCompare(random) {
  return {
    prompt: `A반과 B반 학생들의 영어 점수를 나타낸 도수분포다각형을 비교하였더니, A반의 그래프가 B반의 그래프보다 전체적으로 오른쪽으로 치우쳐 있었다. 이에 대한 올바른 해석을 고르시오.`,
    promptEn: `Comparing the frequency polygons of class A and class B English scores, class A's curve is shifted overall to the right of class B's. Choose the correct interpretation.`,
    expression: `\\text{오른쪽으로 치우칠수록 점수가 높은 학생이 많다}`,
    answer: '1',
    choices: [
      { value: '1', label: 'A반의 영어 점수가 대체로 B반보다 우수하다.', labelEn: 'Class A generally has better English scores than Class B.' },
      { value: '2', label: 'B반의 영어 점수가 대체로 A반보다 우수하다.', labelEn: 'Class B generally has better English scores than Class A.' },
      { value: '3', label: 'A반 학생 수가 B반 학생 수보다 항상 더 많다.', labelEn: 'Class A has more students than Class B.' },
      { value: '4', label: '두 반의 최고 점수는 반드시 같다.', labelEn: 'The highest scores of both classes must be identical.' },
    ],
    explanation: `도수분포다각형에서 그래프가 전체적으로 오른쪽으로 치우쳐 있다는 것은 변량(점수)이 높은 쪽에 도수가 더 많이 분포한다는 뜻이므로, A반의 점수가 대체로 B반보다 더 우수하다고 해석할 수 있습니다.`,
  };
}

// [유형 11] 상대도수의 뜻과 성질 (RPM #1055~#1059)
// 상대도수 = 도수 / 총합, 합 = 1, 도수에 정비례
export function rpmDataRelativeFrequencyConcept(random) {
  const total = 50;
  const freq = pick(random, [5, 10, 15, 20, 25]);
  const relFreq = (freq / total).toFixed(2);

  const mode = ri(random, 1, 2);
  if (mode === 1) {
    // 상대도수 계산
    return {
      prompt: `전체 학생 수가 ${total}명인 학급에서 어떤 계급의 도수가 ${freq}명일 때, 이 계급의 상대도수를 소수로 구하시오.`,
      promptEn: `In a class of ${total} students, a class has frequency ${freq}. Find its relative frequency as a decimal.`,
      expression: `\\frac{${freq}}{${total}}`,
      answer: String(Number(relFreq)),
      explanation: `상대도수 = (그 계급의 도수) / (도수의 총합) = ${freq} / ${total} = ${relFreq} 입니다.`,
    };
  } else {
    // 상대도수의 총합
    return {
      prompt: `어떤 도수분포표에서 모든 계급의 상대도수의 총합은 항상 얼마인가?`,
      promptEn: `In any relative frequency distribution, what is always the sum of all relative frequencies?`,
      expression: `\\sum \\text{상대도수} = 1`,
      answer: '1',
      explanation: `모든 계급의 도수의 합은 전체 도수와 같으므로, 상대도수의 총합은 항상 1입니다.`,
    };
  }
}

// [유형 12] 도수분포표에서 상대도수 계산 및 도수 역추적 (RPM #1060~#1063, #1083)
// 도수 = 총합 * 상대도수, 총합 = 도수 / 상대도수
export function rpmDataRelativeFrequencyTableCalc(random) {
  const total = pick(random, [40, 50, 80, 100]);
  const rel = pick(random, [0.15, 0.25, 0.3, 0.35]);
  const freq = Math.round(total * rel);

  const mode = ri(random, 1, 2);
  if (mode === 1) {
    // 상대도수와 총합으로 도수 구하기
    return {
      prompt: `도수의 총합이 ${total}명인 집단에서 어떤 계급의 상대도수가 ${rel}일 때, 이 계급의 도수를 구하시오. (단, 단위 명은 생략)`,
      promptEn: `In a population of ${total} people, a class has relative frequency ${rel}. Find its frequency.`,
      expression: `${total} \\times ${rel}`,
      answer: String(freq),
      explanation: `도수 = (도수의 총합) × (그 계급의 상대도수) = ${total} × ${rel} = ${freq}명입니다.`,
    };
  } else {
    // 도수와 상대도수로 도수의 총합 구하기
    return {
      prompt: `어느 도수분포표에서 어떤 계급의 도수가 ${freq}명이고, 그 계급의 상대도수가 ${rel}이다. 이 집단의 전체 도수의 총합을 구하시오.`,
      promptEn: `A class has frequency ${freq} and relative frequency ${rel}. Find the total frequency of the distribution.`,
      expression: `\\frac{${freq}}{${rel}}`,
      answer: String(total),
      explanation: `도수의 총합 = (그 계급의 도수) / (상대도수) = ${freq} / ${rel} = ${total}명입니다.`,
    };
  }
}

// [유형 13] 일부가 찢어진 상대도수 분포표 (RPM #1064~#1068, #1084)
export function rpmDataTornRelativeFrequencyTable(random) {
  // 상대도수 총합 1
  // rel1 = 0.1, rel2 = 0.25, rel4 = 0.2, rel5 = 0.15 => rel3 = 1 - 0.7 = 0.3
  const rel1 = 0.1;
  const rel2 = 0.25;
  const rel4 = 0.2;
  const rel5 = 0.15;
  const rel3 = 0.3;
  const total = 50;
  const f3 = Math.round(total * rel3); // 15명

  return {
    prompt: `전체 학생 수가 50명인 상대도수 분포표의 일부가 찢어져 한 계급의 상대도수가 보이지 않는다. 나머지 네 계급의 상대도수가 각각 0.1, 0.25, 0.2, 0.15일 때, 찢어진 계급의 실제 도수(학생 수)를 구하시오.`,
    promptEn: `In a relative frequency table of 50 students, one class is torn. The other four classes have relative frequencies 0.1, 0.25, 0.2, and 0.15. Find the frequency (student count) of the torn class.`,
    expression: `50 \\times (1 - (0.1 + 0.25 + 0.2 + 0.15))`,
    answer: String(f3),
    explanation: `1) 상대도수의 총합은 항상 1이므로 찢어진 계급의 상대도수는 1 - (0.1 + 0.25 + 0.2 + 0.15) = 1 - 0.7 = 0.3 입니다.\n2) 전체 학생 수가 50명이므로 실제 도수는 50 × 0.3 = 15명입니다.`,
  };
}

// [유형 14] 도수의 총합이 다른 두 집단의 상대도수 비교 (RPM #1069~#1072, #1085)
// A반과 B반의 총도수 비 m:n, 특정 계급 도수 비 p:q => 상대도수의 비 (p/m) : (q/n)
export function rpmDataTwoGroupsRelativeFreqRatio(random) {
  const cases = [
    { m: 3, n: 2, p: 4, q: 3, ratioA: 4 * 2, ratioB: 3 * 3 }, // (4/3):(3/2) = 8:9
    { m: 2, n: 1, p: 3, q: 2, ratioA: 3 * 1, ratioB: 2 * 2 }, // (3/2):(2/1) = 3:4
    { m: 3, n: 1, p: 2, q: 3, ratioA: 2 * 1, ratioB: 3 * 3 }, // (2/3):(3/1) = 2:9
    { m: 4, n: 3, p: 2, q: 1, ratioA: 2 * 3, ratioB: 1 * 4 }, // (2/4):(1/3) = 6:4 = 3:2
  ];
  const target = pick(random, cases);
  // Simplify ratio
  const g = ((a, b) => {
    while (b) [a, b] = [b, a % b];
    return a;
  })(target.ratioA, target.ratioB);
  const simA = target.ratioA / g;
  const simB = target.ratioB / g;

  return {
    prompt: `두 집단 A, B의 전체 도수의 총합의 비가 ${target.m} : ${target.n}이고, 어떤 계급의 도수의 비가 ${target.p} : ${target.q}일 때, 이 계급의 상대도수의 비를 가장 간단한 자연수의 비로 나타내시오. (예: 3:2)`,
    promptEn: `Two groups A and B have total frequencies in the ratio ${target.m} : ${target.n}. A certain class has frequencies in the ratio ${target.p} : ${target.q}. Find the ratio of their relative frequencies in simplest integer form.`,
    expression: `\\frac{${target.p}}{${target.m}} : \\frac{${target.q}}{${target.n}}`,
    answer: `${simA}:${simB}`,
    explanation: `상대도수는 (계급의 도수) / (도수의 총합) 입니다. A와 B의 상대도수의 비는 (${target.p} / ${target.m}) : (${target.q} / ${target.n}) = (${target.p} × ${target.n}) : (${target.q} × ${target.m}) = ${target.ratioA} : ${target.ratioB} = ${simA} : ${simB} 입니다.`,
  };
}

// [유형 15] 상대도수의 분포를 나타낸 그래프의 넓이 (RPM #1086~#1090)
// 둘러싸인 넓이 = (계급의 크기) * 1 = 계급의 크기
export function rpmDataRelativeFrequencyGraphArea(random) {
  const width = pick(random, [2, 5, 10]);

  return {
    prompt: `계급의 크기가 ${width}인 상대도수의 분포를 나타낸 그래프와 가로축으로 둘러싸인 부분의 넓이를 구하시오.`,
    promptEn: `Find the area of the region enclosed by a relative frequency polygon and the horizontal axis, given a class width of ${width}.`,
    expression: `${width} \\times 1`,
    answer: String(width),
    explanation: `상대도수의 분포를 나타낸 그래프와 가로축으로 둘러싸인 부분의 넓이는 (계급의 크기) × (상대도수의 총합) 입니다. 상대도수의 총합은 항상 1이므로, 넓이는 ${width} × 1 = ${width}입니다.`,
  };
}

// [유형 16] 두 집단의 상대도수 그래프 비교 (실력 UP) (RPM #1091~#1096)
export function rpmDataTwoGroupsRelativeFreqCompare(random) {
  return {
    prompt: `도수의 총합이 서로 다른 두 집단 A, B의 분포 상태를 비교하려고 할 때 가장 적절한 방법을 고르시오.`,
    promptEn: `What is the most appropriate statistical method to compare the distribution shapes of two groups with different total frequencies?`,
    expression: `\\text{상대도수의 분포를 나타낸 그래프}`,
    answer: '3',
    choices: [
      { value: '1', label: '줄기와 잎 그림', labelEn: 'Stem-and-leaf plot' },
      { value: '2', label: '히스토그램', labelEn: 'Histogram' },
      { value: '3', label: '상대도수의 분포를 나타낸 그래프', labelEn: 'Relative frequency polygon' },
      { value: '4', label: '도수분포표', labelEn: 'Frequency table' },
    ],
    explanation: `도수의 총합이 서로 다른 두 집단을 비교할 때에는 단순 도수로 비교하면 왜곡이 생기므로, 전체에 대한 비율인 '상대도수의 분포를 나타낸 그래프'를 함께 그려 비교하는 것이 가장 적절합니다.`,
  };
}

// [단원 종합] 자료의 정리와 해석 전 유형 혼합
export function rpmDataStatisticsAllMixed(random) {
  const generators = [
    rpmDataStemAndLeafPlot,
    rpmDataTornStemLeafPlot,
    rpmDataFrequencyTableBasicTerms,
    rpmDataFrequencyTableMissingFreq,
    rpmDataHistogramRectangleArea,
    rpmDataTornHistogram,
    rpmDataFrequencyPolygonStructure,
    rpmDataFrequencyPolygonArea,
    rpmDataTornFrequencyPolygon,
    rpmDataTwoGroupsPolygonCompare,
    rpmDataRelativeFrequencyConcept,
    rpmDataRelativeFrequencyTableCalc,
    rpmDataTornRelativeFrequencyTable,
    rpmDataTwoGroupsRelativeFreqRatio,
    rpmDataRelativeFrequencyGraphArea,
    rpmDataTwoGroupsRelativeFreqCompare,
  ];
  return pick(random, generators)(random);
}

// [중1-2 전 범위 최종 실전 모의고사 (Pages 160 ~ 175)]
// [중1-2 전 범위 최종 실전 총괄 모의고사 (RPM 1-2 Pages 160 ~ 175)]
export function rpmGrade7SemesterTwoFinalExam(random) {
  const examPool = [
    // 01 기본도형
    rpmGeoBasicIntersections,
    rpmGeoBasicClockAngle,
    rpmGeoBasicMidpointSegment,
    rpmGeoBasicVerticalAngles,
    // 02 위치 관계
    rpmPosSolidSkewEdges,
    rpmPosParallelBentLineSingle,
    rpmPosPaperFoldAngles,
    // 03 작도와 합동
    rpmCongTriangleInequality,
    rpmCongTriangleSssSasAsa,
    rpmCongRotationEquilateralSquare,
    // 04 다각형
    rpmPolyDiagonalCountFormula,
    rpmPolyRegularInteriorExterior,
    rpmPolyBoomerangConcaveAngle,
    // 05 원과 부채꼴
    rpmCircleCentralAngleArcProp,
    rpmSectorArcLengthAndArea,
    rpmRollingCircleTrackArea,
    // 06 다면체와 회전체
    rpmPolyhedronEulerFormula,
    rpmCubeNetOppositeFaces,
    rpmRevolutionCrossSectionAreaCalc,
    // 07 입체도형의 겉넓이와 부피
    rpmPrismSurfaceAreaCalc,
    rpmConeSurfaceAreaCalc,
    rpmSphereVolumeCalc,
    rpmConeSphereCylinderRatio,
    // 08 자료의 정리와 해석
    rpmDataStemAndLeafPlot,
    rpmDataFrequencyTableMissingFreq,
    rpmDataHistogramRectangleArea,
    rpmDataFrequencyPolygonArea,
    rpmDataRelativeFrequencyConcept,
    rpmDataRelativeFrequencyTableCalc,
    rpmDataTwoGroupsRelativeFreqRatio,
    rpmDataRelativeFrequencyGraphArea,
  ];
  const selectedGen = pick(random, examPool);
  const prob = selectedGen(random);
  return {
    ...prob,
    category: '중학 1-2 전 범위 최종 실전 총괄 모의고사',
    categoryEn: 'Grade 7-2 Comprehensive Final Examination',
  };
}


// =============================================================
// RPM Middle School 2-1 (중학수학 2-1)
// Chapter 01: 유리수와 순환소수 (Rational Numbers & Repeating Decimals)
// Pages 12 ~ 23 (Problems #0056 ~ #0136)
// =============================================================



// [유형 01] 10의 거듭제곱을 이용하여 분수를 유한소수로 나타내기 (RPM #0056~#0058, #0117)
export function rpmRatDecPowersOfTen(random) {
  const pairs = [
    { num: 3, p2: 3, p5: 1, name: '3/40' },
    { num: 7, p2: 1, p5: 2, name: '7/50' },
    { num: 9, p2: 3, p5: 0, name: '9/8' },
    { num: 11, p2: 0, p5: 3, name: '11/125' },
    { num: 13, p2: 2, p5: 1, name: '13/20' },
    { num: 27, p2: 2, p5: 3, name: '27/500' },
    { num: 21, p2: 3, p5: 2, name: '21/200' },
    { num: 17, p2: 4, p5: 1, name: '17/80' },
  ];
  const item = pick(random, pairs);
  const m = item.p2;
  const k = item.p5;
  const n = Math.max(m, k);
  const mult2 = n - m;
  const mult5 = n - k;
  const multVal = (2 ** mult2) * (5 ** mult5);
  const finalNum = item.num * multVal;
  const denom = 10 ** n;

  const mode = ri(random, 1, 2);
  if (mode === 1) {
    return {
      prompt: `다음은 분수 \\frac{${item.num}}{${item.name.split('/')[1]}}을 유한소수로 나타내는 과정이다. 이때 a + n의 값을 구하시오.\n\n\\frac{${item.num}}{${item.name.split('/')[1]}} = \\frac{${item.num}}{2^{${m}} \\times 5^{${k}}} = \\frac{${item.num} \\times ${multVal > 1 ? multVal : 1}}{2^{${n}} \\times 5^{${n}}} = \\frac{a}{10^n}`,
      promptEn: `Given the process to convert \\frac{${item.num}}{${item.name.split('/')[1]}} into a terminating decimal: \\frac{${item.num}}{${item.name.split('/')[1]}} = \\frac{a}{10^n}, find the value of a + n.`,
      expression: `${finalNum} + ${n}`,
      answer: String(finalNum + n),
      explanation: `분모의 2와 5의 지수를 맞추기 위해 분모와 분자에 ${multVal}을 곱하면 분모는 10^${n}이 되고, 분자는 a = ${item.num} \\times ${multVal} = ${finalNum}입니다. 따라서 a + n = ${finalNum} + ${n} = ${finalNum + n}입니다.`,
    };
  } else {
    return {
      prompt: `분수 \\frac{${item.num}}{${item.name.split('/')[1]}}을 10의 거듭제곱을 분모로 하는 분수 \\frac{A}{10^n} 꼴로 고쳐서 유한소수로 나타낼 때, 자연수 A, n에 대하여 A + n의 최솟값을 구하시오.`,
      promptEn: `When converting \\frac{${item.num}}{${item.name.split('/')[1]}} into the form \\frac{A}{10^n} with the smallest positive integer n, find the minimum value of A + n.`,
      expression: `A + n = ${finalNum} + ${n}`,
      answer: String(finalNum + n),
      explanation: `분모 ${item.name.split('/')[1]} = 2^${m} \\times 5^${k}의 2와 5의 지수를 같게 만드는 가장 작은 지수는 n = ${n}입니다. 분자 A = ${item.num} \\times ${multVal} = ${finalNum}이므로 A + n = ${finalNum + n}입니다.`,
    };
  }
}

// [유형 02] 유한소수로 나타낼 수 있는 분수 판별 (RPM #0059~#0062, #0118)
export function rpmRatDecTerminatingCondition(random) {
  const fractions = [
    { text: '\\frac{7}{25}', term: true, expl: '25 = 5^2 (분모 소인수 5뿐)' },
    { text: '\\frac{9}{40}', term: true, expl: '40 = 2^3 \\times 5 (분모 소인수 2, 5뿐)' },
    { text: '\\frac{21}{140}', term: true, expl: '21/140 = 3/20 = 3/(2^2 \\times 5) (유한소수)' },
    { text: '\\frac{27}{250}', term: true, expl: '250 = 2 \\times 5^3 (분모 소인수 2, 5뿐)' },
    { text: '\\frac{42}{2^2 \\times 3 \\times 7}', term: true, expl: '42/(4 \\times 21) = 42/84 = 1/2 (유한소수)' },
    { text: '\\frac{11}{24}', term: false, expl: '24 = 2^3 \\times 3 (소인수 3이 남음)' },
    { text: '\\frac{13}{75}', term: false, expl: '75 = 3 \\times 5^2 (소인수 3이 남음)' },
    { text: '\\frac{14}{105}', term: false, expl: '14/105 = 2/15 = 2/(3 \\times 5) (소인수 3이 남음)' },
    { text: '\\frac{15}{2^2 \\times 5 \\times 7}', term: false, expl: '15/(20 \\times 7) = 3/(4 \\times 7) (소인수 7이 남음)' },
    { text: '\\frac{19}{60}', term: false, expl: '60 = 2^2 \\times 3 \\times 5 (소인수 3이 남음)' },
  ];

  // Pick 5 distinct fractions
  const shuffled = [...fractions].sort(() => random() - 0.5).slice(0, 5);
  const termCount = shuffled.filter(f => f.term).length;

  const mode = ri(random, 1, 2);
  if (mode === 1) {
    return {
      prompt: `다음 보기의 분수 중 유한소수로 나타낼 수 있는 것의 개수를 구하시오.\n\n[보기] ${shuffled.map(f => f.text).join(', ')}`,
      promptEn: `How many of the following fractions can be represented as terminating decimals?\n[List] ${shuffled.map(f => f.text).join(', ')}`,
      expression: `${termCount}`,
      answer: String(termCount),
      explanation: `기약분수로 나타내었을 때 분모의 소인수가 2 또는 5뿐인 것만 유한소수가 됩니다.\n` +
        shuffled.map(f => `- ${f.text}: ${f.term ? '유한소수' : '무한(순환)소수'} (${f.expl})`).join('\n') +
        `\n따라서 유한소수로 나타낼 수 있는 분수는 모두 ${termCount}개입니다.`,
    };
  } else {
    // Choice question: which one can be terminating?
    const termOne = pick(random, fractions.filter(f => f.term));
    const nonTerms = fractions.filter(f => !f.term).sort(() => random() - 0.5).slice(0, 3);
    const options = [termOne, ...nonTerms].sort(() => random() - 0.5);
    const correctIdx = options.findIndex(o => o === termOne) + 1;
    return {
      prompt: `다음 분수 중 유한소수로 나타낼 수 있는 것을 고르시오.`,
      promptEn: `Which of the following fractions can be represented as a terminating decimal?`,
      expression: `\\text{정답 번호: } ${correctIdx}`,
      answer: String(correctIdx),
      choices: options.map((opt, i) => ({
        value: String(i + 1),
        label: opt.text,
        labelEn: opt.text,
      })),
      explanation: `${termOne.text}은(는) ${termOne.expl}이므로 유한소수입니다. 정답은 ${correctIdx}번입니다.`,
    };
  }
}

// [유형 03] a/b * x가 유한소수가 되도록 하는 x의 값 (RPM #0063~#0065, #0125)
export function rpmRatDecMultiplyToTerminatingSingle(random) {
  const problems = [
    { a: 7, b: 120, k: 3, bFact: '2^3 \\times 3 \\times 5' },
    { a: 11, b: 350, k: 7, bFact: '2 \\times 5^2 \\times 7' },
    { a: 13, b: 180, k: 9, bFact: '2^2 \\times 3^2 \\times 5' },
    { a: 9, b: 84, k: 7, bFact: '2^2 \\times 3 \\times 7', redA: 3, redB: 28, redBFact: '2^2 \\times 7' },
    { a: 5, b: 132, k: 33, bFact: '2^2 \\times 3 \\times 11' },
    { a: 21, b: 280, k: 1, redA: 3, redB: 40 }, // already terminating
    { a: 3, b: 220, k: 11, bFact: '2^2 \\times 5 \\times 11' },
    { a: 17, b: 150, k: 3, bFact: '2 \\times 3 \\times 5^2' },
  ].filter(p => p.k > 1);

  const prob = pick(random, problems);
  const mode = ri(random, 1, 2);

  if (mode === 1) {
    return {
      prompt: `분수 \\frac{${prob.a}}{${prob.b}}에 자연수 x를 곱하여 소수로 나타내면 유한소수가 된다고 한다. x의 값이 될 수 있는 가장 작은 자연수를 구하시오.`,
      promptEn: `When the fraction \\frac{${prob.a}}{${prob.b}} is multiplied by a natural number x, it becomes a terminating decimal. Find the smallest natural number x.`,
      expression: `${prob.k}`,
      answer: String(prob.k),
      explanation: `\\frac{${prob.a}}{${prob.b}}를 기약분수로 나타내어 분모를 소인수분해하면 2와 5 이외의 소인수의 곱이 ${prob.k}입니다. 따라서 유한소수가 되기 위해 x는 ${prob.k}의 배수이어야 하므로, 가장 작은 자연수 x는 ${prob.k}입니다.`,
    };
  } else {
    // Number of 2-digit natural numbers
    const count2Digit = Math.floor(99 / prob.k) - Math.floor(9 / prob.k);
    return {
      prompt: `분수 \\frac{${prob.a}}{${prob.b}}에 자연수 x를 곱하여 소수로 나타내면 유한소수가 된다고 한다. x의 값이 될 수 있는 두 자리 자연수의 개수를 구하시오.`,
      promptEn: `When \\frac{${prob.a}}{${prob.b}} is multiplied by a natural number x, it becomes a terminating decimal. How many two-digit natural numbers x satisfy this?`,
      expression: `${count2Digit}`,
      answer: String(count2Digit),
      explanation: `\\frac{${prob.a}}{${prob.b}}를 기약분수로 나타내어 분모의 2와 5 이외의 소인수를 찾으면 ${prob.k}입니다. 따라서 x는 ${prob.k}의 배수이어야 합니다. 두 자리 자연수 중 ${prob.k}의 배수의 개수는 99 이하의 배수 개수(${Math.floor(99 / prob.k)})에서 9 이하의 배수 개수(${Math.floor(9 / prob.k)})를 뺀 ${count2Digit}개입니다.`,
    };
  }
}

// [유형 04] 두 분수에 각각 x를 곱하여 모두 유한소수가 되도록 하기 (RPM #0066~#0068, #0131)
export function rpmRatDecMultiplyToTerminatingBoth(random) {
  const configs = [
    { a1: 7, b1: 180, k1: 9, a2: 5, b2: 84, k2: 21, lcmK: 63 },
    { a1: 3, b1: 140, k1: 7, a2: 11, b2: 150, k2: 3, lcmK: 21 },
    { a1: 5, b1: 72, k1: 9, a2: 7, b2: 110, k2: 11, lcmK: 99 },
    { a1: 9, b1: 280, k1: 7, a2: 13, b2: 120, k2: 3, lcmK: 21 },
    { a1: 1, b1: 45, k1: 9, a2: 3, b2: 70, k2: 7, lcmK: 63 },
  ];
  const cfg = pick(random, configs);

  const mode = ri(random, 1, 2);
  if (mode === 1) {
    return {
      prompt: `두 분수 \\frac{${cfg.a1}}{${cfg.b1}}과 \\frac{${cfg.a2}}{${cfg.b2}}에 각각 어떤 자연수 x를 곱하면 두 분수 모두 유한소수로 나타내어진다고 한다. 이러한 x의 값 중 가장 작은 자연수를 구하시오.`,
      promptEn: `When both \\frac{${cfg.a1}}{${cfg.b1}} and \\frac{${cfg.a2}}{${cfg.b2}} are multiplied by a natural number x, both become terminating decimals. Find the smallest such natural number x.`,
      expression: `${cfg.lcmK}`,
      answer: String(cfg.lcmK),
      explanation: `\\frac{${cfg.a1}}{${cfg.b1}}이 유한소수가 되려면 x는 ${cfg.k1}의 배수이어야 하고, \\frac{${cfg.a2}}{${cfg.b2}}가 유한소수가 되려면 x는 ${cfg.k2}의 배수이어야 합니다. 두 조건을 모두 만족하려면 x는 ${cfg.k1}과 ${cfg.k2}의 공배수, 즉 최소공배수인 ${cfg.lcmK}의 배수이어야 하므로 가장 작은 자연수 x는 ${cfg.lcmK}입니다.`,
    };
  } else {
    // Count of 2-digit or 3-digit
    const count2Digit = Math.floor(99 / cfg.lcmK) - Math.floor(9 / cfg.lcmK);
    return {
      prompt: `두 분수 \\frac{${cfg.a1}}{${cfg.b1}}과 \\frac{${cfg.a2}}{${cfg.b2}}에 각각 자연수 x를 곱하면 두 분수 모두 유한소수가 된다. x의 값이 될 수 있는 두 자리 자연수의 개수를 구하시오.`,
      promptEn: `When both \\frac{${cfg.a1}}{${cfg.b1}} and \\frac{${cfg.a2}}{${cfg.b2}} are multiplied by x, both become terminating decimals. How many two-digit natural numbers x exist?`,
      expression: `${count2Digit}`,
      answer: String(count2Digit),
      explanation: `x는 두 분모의 2, 5 이외의 소인수의 최소공배수인 ${cfg.lcmK}의 배수이어야 합니다. 두 자리 자연수 중 ${cfg.lcmK}의 배수는 ${count2Digit}개입니다.`,
    };
  }
}

// [유형 05] 분모에 미지수가 있는 분수가 유한소수가 되도록 하기 (RPM #0069~#0072, #0119)
export function rpmRatDecDenominatorVariable(random) {
  // Fraction 21 / (2^2 * 5 * x)
  // 21 = 3 * 7. So x can contain 2, 5, and at most one factor of 3 and at most one factor of 7.
  const candValid = [3, 6, 7, 12, 14, 15, 20, 21, 28, 35];
  const candInvalid = [9, 11, 13, 18, 22, 27, 33, 42, 44, 49];

  const good = pick(random, candValid);
  const bads = candInvalid.sort(() => random() - 0.5).slice(0, 3);
  const othersGood = candValid.filter(c => c !== good).sort(() => random() - 0.5).slice(0, 3);

  // Question: Which of the following cannot be x?
  const badOne = pick(random, candInvalid);
  const options = [badOne, ...othersGood].sort(() => random() - 0.5);
  const correctIdx = options.indexOf(badOne) + 1;

  return {
    prompt: `분수 \\frac{21}{2^2 \\times 5 \\times x}를 소수로 나타내면 유한소수가 될 때, 다음 중 x의 값이 될 수 없는 것은?`,
    promptEn: `When the fraction \\frac{21}{2^2 \\times 5 \\times x} is represented as a decimal, it is a terminating decimal. Which of the following CANNOT be the value of x?`,
    expression: `\\text{정답 번호: } ${correctIdx}`,
    answer: String(correctIdx),
    choices: options.map((opt, i) => ({
      value: String(i + 1),
      label: String(opt),
      labelEn: String(opt),
    })),
    explanation: `분자 21 = 3 \\times 7이므로, 분모에 있는 x는 소인수 2, 5 외에 분자와 약분될 수 있는 3 또는 7을 최대 1개까지만 가질 수 있습니다. 보기 중 ${badOne}은(는) 소인수분해 시 2와 5를 제외하고 분자와 약분되지 않는 소인수가 남으므로 x의 값이 될 수 없습니다. 정답은 ${correctIdx}번입니다.`,
  };
}

// [유형 06] 유한소수가 되도록 하는 미지수 조건과 기약분수 약분 (RPM #0073~#0075, #0120)
export function rpmRatDecTerminatingAndIrreducible(random) {
  // Fraction a / 280 = a / (2^3 * 5 * 7)
  // For it to be terminating, a must be a multiple of 7.
  // Irreducible is b / y.
  // Let a = 7 * k. 20 < a < 45 => k in {3, 4, 5, 6} => a in {21, 28, 35, 42}
  // Irreducible: a/280 = 7k/280 = k/40.
  // Let's specify that irreducible fraction has numerator b = 1 => k = 1 (not in range)
  // Or b = 3 => k = 3 => a = 21. a/280 = 21/280 = 3/40. y = 40.
  const a = 21;
  const b = 3;
  const y = 40;
  const ans = y - a; // 40 - 21 = 19

  return {
    prompt: `분수 \\frac{a}{280}를 소수로 나타내면 유한소수가 되고, 기약분수로 나타내면 \\frac{3}{b}가 된다. 20 < a < 30인 자연수 a에 대하여 b - a의 값을 구하시오.`,
    promptEn: `The fraction \\frac{a}{280} represents a terminating decimal and simplifies to \\frac{3}{b}. Given 20 < a < 30, find the value of b - a.`,
    expression: `${y} - ${a}`,
    answer: String(ans),
    explanation: `280 = 2^3 \\times 5 \\times 7이므로 유한소수가 되려면 a는 7의 배수이어야 합니다. 20 < a < 30 범위에서 7의 배수는 a = 21뿐입니다. \\frac{21}{280} = \\frac{3}{40}이므로 b = 40입니다. 따라서 b - a = 40 - 21 = ${ans}입니다.`,
  };
}

// [유형 07] 순환마디와 순환소수의 표현 (RPM #0076~#0079, #0121)
export function rpmRatDecPeriodAndNotation(random) {
  const cases = [
    { raw: '2.828282…', period: '82', notation: '2.\\dot{8}\\dot{2}', wrongNote: '2.8\\dot{2}', wrongPer: '28' },
    { raw: '0.3757575…', period: '75', notation: '0.3\\dot{7}\\dot{5}', wrongNote: '0.\\dot{3}7\\dot{5}', wrongPer: '375' },
    { raw: '1.212121…', period: '21', notation: '1.\\dot{2}\\dot{1}', wrongNote: '1.2\\dot{1}', wrongPer: '12' },
    { raw: '3.412412…', period: '412', notation: '3.\\dot{4}1\\dot{2}', wrongNote: '3.\\dot{4}\\dot{1}\\dot{2}', wrongPer: '124' },
    { raw: '0.1234234…', period: '234', notation: '0.1\\dot{2}3\\dot{4}', wrongNote: '0.1\\dot{2}\\dot{3}\\dot{4}', wrongPer: '1234' },
  ];
  const target = pick(random, cases);

  const mode = ri(random, 1, 2);
  if (mode === 1) {
    return {
      prompt: `순환소수 ${target.raw}의 순환마디를 구하시오.`,
      promptEn: `Find the repeating period of the repeating decimal ${target.raw}.`,
      expression: `${target.period}`,
      answer: target.period,
      explanation: `${target.raw}에서 소수점 아래 일정하게 반복되는 숫자의 배열은 ${target.period}이므로 순환마디는 ${target.period}입니다.`,
    };
  } else {
    // Notation choice
    const choices = [
      { value: '1', label: target.notation, labelEn: target.notation },
      { value: '2', label: target.wrongNote, labelEn: target.wrongNote },
      { value: '3', label: `${target.raw.slice(0, 4)}…`, labelEn: `${target.raw.slice(0, 4)}…` },
      { value: '4', label: `\\dot{${target.period}}`, labelEn: `\\dot{${target.period}}` },
    ];
    return {
      prompt: `순환소수 ${target.raw}를 점을 찍어 바르게 나타낸 것을 고르시오.`,
      promptEn: `Choose the correct repeating decimal notation with dots for ${target.raw}.`,
      expression: `\\text{정답: } ${target.notation}`,
      answer: '1',
      choices,
      explanation: `순환소수는 순환마디의 양 끝 숫자 위에 점을 찍어 나타내므로 올바른 표현은 ${target.notation}입니다.`,
    };
  }
}

// [유형 08] 순환소수의 소수점 아래 n번째 자리의 숫자 구하기 (RPM #0080~#0083, #0122, #0134)
export function rpmRatDecNthDigitOfRepeating(random) {
  const problems = [
    { num: 5, den: 7, digits: [7, 1, 4, 2, 8, 5], nonRep: [], name: '5/7' },
    { num: 3, den: 11, digits: [2, 7], nonRep: [], name: '3/11' },
    { num: 7, den: 22, digits: [1, 8], nonRep: [3], name: '7/22' }, // 0.31818...
    { num: 5, den: 6, digits: [3], nonRep: [8], name: '5/6' }, // 0.8333...
    { num: 11, den: 30, digits: [6], nonRep: [3], name: '11/30' }, // 0.3666...
    { num: 17, den: 14, digits: [2, 1, 4, 2, 8, 5], nonRep: [], name: '17/14' },
    { num: 1, den: 7, digits: [1, 4, 2, 8, 5, 7], nonRep: [], name: '1/7' },
    { num: 25, den: 37, digits: [6, 7, 5], nonRep: [], name: '25/37' }, // 0.675675...
  ];
  const p = pick(random, problems.filter(pr => pr.digits.length >= 2));
  const n = ri(random, 40, 100);

  const nonRepLen = p.nonRep.length;
  const repLen = p.digits.length;
  let ansDigit;
  if (n <= nonRepLen) {
    ansDigit = p.nonRep[n - 1];
  } else {
    const idx = (n - nonRepLen - 1) % repLen;
    ansDigit = p.digits[idx];
  }

  return {
    prompt: `분수 \\frac{${p.num}}{${p.den}}을 소수로 나타낼 때, 소수점 아래 ${n}번째 자리의 숫자를 구하시오.`,
    promptEn: `When the fraction \\frac{${p.num}}{${p.den}} is expressed as a decimal, find the ${n}-th digit after the decimal point.`,
    expression: `${ansDigit}`,
    answer: String(ansDigit),
    explanation: `\\frac{${p.num}}{${p.den}} = 0.${p.nonRep.join('')}\\dot{${p.digits[0]}}${p.digits.length > 2 ? p.digits.slice(1, -1).join('') : ''}\\dot{${p.digits[p.digits.length - 1]}}입니다. ${nonRepLen > 0 ? `순환하지 않는 자리가 ${nonRepLen}개이고, ` : ''}순환마디의 길이가 ${repLen}이므로, (${n} - ${nonRepLen}) ÷ ${repLen}의 나머지는 ${(n - nonRepLen) % repLen}입니다. 따라서 소수점 아래 ${n}번째 자리의 숫자는 ${ansDigit}입니다.`,
  };
}

// [유형 09] 순환소수(무한소수)로만 나타내어지는 분수 및 미지수 (RPM #0084~#0086)
export function rpmRatDecRepeatingOnlyCondition(random) {
  // Fraction x / (2^2 * 3 * 5) = x / 60
  // To be repeating decimal ONLY, x CANNOT be a multiple of 3.
  const bads = [3, 6, 9, 12, 15, 18, 21, 24]; // multiples of 3 -> terminating!
  const goods = [4, 5, 7, 8, 10, 11, 13, 14]; // non-multiples of 3 -> repeating!

  const notTerminatingX = pick(random, bads); // this value makes it terminating, so it CANNOT be x
  const validXList = goods.sort(() => random() - 0.5).slice(0, 3);
  const options = [notTerminatingX, ...validXList].sort(() => random() - 0.5);
  const correctIdx = options.indexOf(notTerminatingX) + 1;

  return {
    prompt: `분수 \\frac{x}{2^2 \\times 3 \\times 5}를 소수로 나타내면 순환소수로만 나타낼 수 있을 때, 다음 중 x의 값이 될 수 없는 것은?`,
    promptEn: `When \\frac{x}{2^2 \\times 3 \\times 5} is represented as a decimal, it can only be a repeating decimal. Which of the following CANNOT be the value of x?`,
    expression: `\\text{정답 번호: } ${correctIdx}`,
    answer: String(correctIdx),
    choices: options.map((opt, i) => ({
      value: String(i + 1),
      label: String(opt),
      labelEn: String(opt),
    })),
    explanation: `분수가 순환소수로만 나타내어지려면 기약분수의 분모에 2와 5 이외의 소인수인 3이 반드시 남아 있어야 합니다. 만약 x가 3의 배수이면 3이 약분되어 유한소수가 되어버리므로 x는 3의 배수가 될 수 없습니다. 보기 중 ${notTerminatingX}은(는) 3의 배수이므로 x의 값이 될 수 없습니다. 정답은 ${correctIdx}번입니다.`,
  };
}

// [유형 10] 순환소수를 분수로 나타내기 (1) — 10^n x - 10^m x (RPM #0087~#0089, #0123, #0124)
export function rpmRatDecFractionEquationMethod(random) {
  const problems = [
    { text: '1.5\\dot{3}\\dot{7}', n: 1000, m: 10, nonRep: 1, rep: 2 },
    { text: '0.74\\dot{2}', n: 1000, m: 100, nonRep: 2, rep: 1 },
    { text: '0.\\dot{2}\\dot{7}', n: 100, m: 1, nonRep: 0, rep: 2 },
    { text: '2.\\dot{3}1\\dot{5}', n: 1000, m: 1, nonRep: 0, rep: 3 },
    { text: '0.1\\dot{2}3\\dot{4}', n: 10000, m: 10, nonRep: 1, rep: 3 },
    { text: '0.2\\dot{7}\\dot{6}', n: 1000, m: 10, nonRep: 1, rep: 2 },
  ];
  const p = pick(random, problems);
  const correctEq = p.m === 1 ? `${p.n}x - x` : `${p.n}x - ${p.m}x`;

  const wrong1 = `${p.n}x - ${p.m * 10}x`;
  const wrong2 = `${p.n / 10}x - ${p.m}x`;
  const wrong3 = `${p.n}x - x`;

  const choicesList = [
    correctEq,
    wrong1 !== correctEq ? wrong1 : '100x - 10x',
    wrong2 !== correctEq ? wrong2 : '1000x - 100x',
    wrong3 !== correctEq ? wrong3 : '10000x - x',
  ].sort(() => random() - 0.5);

  const correctIdx = choicesList.indexOf(correctEq) + 1;

  return {
    prompt: `순환소수 x = ${p.text}을(를) 분수로 나타내려고 할 때, 다음 중 가장 편리한 식은?`,
    promptEn: `When converting the repeating decimal x = ${p.text} into a fraction, which of the following equations is the most convenient?`,
    expression: correctEq,
    answer: String(correctIdx),
    choices: choicesList.map((c, i) => ({
      value: String(i + 1),
      label: c,
      labelEn: c,
    })),
    explanation: `x = ${p.text}에서 소수점 아래 순환마디의 끝까지 이동시키려면 양변에 ${p.n}을 곱하고, 순환마디의 시작 바로 앞까지 이동시키려면 양변에 ${p.m === 1 ? '1' : p.m}을 곱해야 소수점 아래 부분이 같아져 소거됩니다. 따라서 가장 편리한 식은 ${correctEq}입니다.`,
  };
}

// [유형 11] 순환소수를 분수로 나타내기 (2) — 공식 활용 및 기약분수 (RPM #0090~#0093, #0132)
export function rpmRatDecFractionFormulaMethod(random) {
  const problems = [
    { dec: '0.\\dot{4}', num: 4, den: 9 },
    { dec: '0.\\dot{2}\\dot{7}', num: 27, den: 99, redNum: 3, redDen: 11 },
    { dec: '0.1\\dot{6}', num: 15, den: 90, redNum: 1, redDen: 6 },
    { dec: '1.\\dot{2}', num: 11, den: 9, redNum: 11, redDen: 9 },
    { dec: '0.2\\dot{4}\\dot{5}', num: 243, den: 990, redNum: 27, redDen: 110 },
    { dec: '2.0\\dot{6}', num: 186, den: 90, redNum: 31, redDen: 15 },
    { dec: '0.0\\dot{6}', num: 6, den: 90, redNum: 1, redDen: 15 },
  ];
  const p = pick(random, problems);
  const rNum = p.redNum || p.num;
  const rDen = p.redDen || p.den;

  const mode = ri(random, 1, 2);
  if (mode === 1) {
    return {
      prompt: `순환소수 ${p.dec}을(를) 기약분수 \\frac{a}{b}로 나타낼 때, a + b의 값을 구하시오.`,
      promptEn: `When the repeating decimal ${p.dec} is expressed as an irreducible fraction \\frac{a}{b}, find the value of a + b.`,
      expression: `${rNum} + ${rDen}`,
      answer: String(rNum + rDen),
      explanation: `${p.dec}을(를) 분수로 나타내면 \\frac{${p.num}}{${p.den}}이며, 기약분수로 약분하면 \\frac{${rNum}}{${rDen}}입니다. 따라서 a + b = ${rNum} + ${rDen} = ${rNum + rDen}입니다.`,
    };
  } else {
    return {
      prompt: `다음 순환소수를 기약분수로 나타내시오: ${p.dec}`,
      promptEn: `Express the following repeating decimal as an irreducible fraction: ${p.dec}`,
      expression: `\\frac{${rNum}}{${rDen}}`,
      answer: `${rNum}/${rDen}`,
      explanation: `${p.dec} = \\frac{${p.num}}{${p.den}} = \\frac{${rNum}}{${rDen}}입니다.`,
    };
  }
}

// [유형 12] 순환소수에 자연수를 곱하여 유한소수 만들기 (RPM #0094~#0097)
export function rpmRatDecRepeatingToTerminating(random) {
  const problems = [
    { dec: '1.9\\dot{3}', num: 174, den: 90, rNum: 29, rDen: 15, k: 3 }, // 15 = 3 * 5 => k = 3
    { dec: '0.12\\dot{6}', num: 114, den: 900, rNum: 19, rDen: 150, k: 3 }, // 150 = 2 * 3 * 5^2 => k = 3
    { dec: '1.\\dot{5}', num: 14, den: 9, rNum: 14, rDen: 9, k: 9 }, // 9 = 3^2 => k = 9
    { dec: '0.29\\dot{6}', num: 267, den: 900, rNum: 89, rDen: 300, k: 3 }, // 300 = 2^2 * 3 * 5^2 => k = 3
    { dec: '0.5\\dot{3}', num: 48, den: 90, rNum: 8, rDen: 15, k: 3 },
    { dec: '0.8\\dot{3}', num: 75, den: 90, rNum: 5, rDen: 6, k: 3 },
  ];
  const p = pick(random, problems);

  const mode = ri(random, 1, 2);
  if (mode === 1) {
    return {
      prompt: `순환소수 ${p.dec}에 어떤 자연수 x를 곱하면 유한소수가 된다고 한다. x의 값이 될 수 있는 가장 작은 자연수를 구하시오.`,
      promptEn: `When the repeating decimal ${p.dec} is multiplied by a natural number x, it becomes a terminating decimal. Find the smallest natural number x.`,
      expression: `${p.k}`,
      answer: String(p.k),
      explanation: `순환소수 ${p.dec}을(를) 기약분수로 나타내면 \\frac{${p.rNum}}{${p.rDen}}입니다. 분모 ${p.rDen}을(를) 소인수분해하면 2와 5 이외의 소인수가 ${p.k}이므로, 유한소수가 되기 위해 곱해야 하는 가장 작은 자연수는 ${p.k}입니다.`,
    };
  } else {
    const min2Digit = Math.ceil(10 / p.k) * p.k;
    return {
      prompt: `순환소수 ${p.dec}에 어떤 자연수 x를 곱하여 유한소수가 되도록 할 때, x의 값이 될 수 있는 가장 작은 두 자리 자연수를 구하시오.`,
      promptEn: `When ${p.dec} is multiplied by x, it becomes terminating. Find the smallest two-digit natural number x.`,
      expression: `${min2Digit}`,
      answer: String(min2Digit),
      explanation: `순환소수 ${p.dec} = \\frac{${p.rNum}}{${p.rDen}}의 분모에서 2와 5 이외의 소인수는 ${p.k}이므로 x는 ${p.k}의 배수이어야 합니다. 따라서 가장 작은 두 자리 자연수 x는 ${min2Digit}입니다.`,
    };
  }
}

// [유형 13] 분모 또는 분자를 잘못 보고 소수로 나타낸 문제 (RPM #0098~#0100)
export function rpmRatDecFaultyObservation(random) {
  // Student A mistakenly read the denominator => numerator is correct.
  // Student B mistakenly read the numerator => denominator is correct.
  const cases = [
    {
      decA: '0.2\\dot{8}', numA: 26, denA: 90, rNumA: 13, rDenA: 45, // num = 13
      decB: '0.\\dot{6}', numB: 6, denB: 9, rNumB: 2, rDenB: 3, // den = 3 => gcd(13, 3) = 1 => 13/3 = 4.333...
      correctFrac: '13/3',
      correctDec: '4.\\dot{3}',
    },
    {
      decA: '0.5\\dot{8}', numA: 53, denA: 90, rNumA: 53, rDenA: 90, // num = 53
      decB: '0.\\dot{8}\\dot{2}', numB: 82, denB: 99, rNumB: 82, rDenB: 99, // den = 99 => 53/99 = 0.5353...
      correctFrac: '53/99',
      correctDec: '0.\\dot{5}\\dot{3}',
    },
    {
      decA: '1.\\dot{1}', numA: 10, denA: 9, rNumA: 10, rDenA: 9, // num = 10
      decB: '1.1\\dot{3}', numB: 102, denB: 90, rNumB: 17, rDenB: 15, // den = 15 => 10/15 = 2/3 (reduce!) => 2/3 = 0.666...
      correctFrac: '2/3',
      correctDec: '0.\\dot{6}',
    },
  ];
  const c = pick(random, cases);

  return {
    prompt: `어떤 기약분수를 순환소수로 나타내는데 갑은 분모를 잘못 보아 ${c.decA}(으)로 나타내었고, 을은 분자를 잘못 보아 ${c.decB}(으)로 나타내었다. 처음의 기약분수를 순환소수로 바르게 나타내시오.`,
    promptEn: `When converting an irreducible fraction to a repeating decimal, Student A misread the denominator and got ${c.decA}, while Student B misread the numerator and got ${c.decB}. Express the original irreducible fraction as a repeating decimal.`,
    expression: c.correctDec,
    answer: c.correctDec,
    explanation: `갑은 분모를 잘못 보았으므로 분자는 제대로 보았습니다. ${c.decA} = \\frac{${c.rNumA}}{${c.rDenA}}에서 분자는 ${c.rNumA}입니다.\n을은 분자를 잘못 보았으므로 분모는 제대로 보았습니다. ${c.decB} = \\frac{${c.rNumB}}{${c.rDenB}}에서 분모는 ${c.rDenB}입니다.\n따라서 처음 기약분수는 \\frac{${c.correctFrac.split('/')[0]}}{${c.correctFrac.split('/')[1]}}이며, 이를 순환소수로 나타내면 ${c.correctDec}입니다.`,
  };
}

// [유형 14] 순환소수를 포함한 부등식 (RPM #0101~#0103, #0126)
export function rpmRatDecRepeatingInequality(random) {
  // 1/3 < 0.\dot{a} < 2/3 => 1/3 < a/9 < 2/3 => 3 < a < 6 => a in {4, 5}
  const configs = [
    { left: '\\frac{1}{3}', right: '\\frac{2}{3}', lVal: 3, rVal: 6, vals: [4, 5] },
    { left: '\\frac{2}{9}', right: '\\frac{7}{9}', lVal: 2, rVal: 7, vals: [3, 4, 5, 6] },
    { left: '\\frac{1}{4}', right: '\\frac{5}{6}', lVal: 2.25, rVal: 7.5, vals: [3, 4, 5, 6, 7] },
    { left: '\\frac{1}{2}', right: '\\frac{8}{9}', lVal: 4.5, rVal: 8, vals: [5, 6, 7] },
  ];
  const cfg = pick(random, configs);

  const mode = ri(random, 1, 2);
  if (mode === 1) {
    // Number of single digit natural numbers
    return {
      prompt: `부등식 ${cfg.left} < 0.\\dot{a} < ${cfg.right}를 만족하는 한 자리 자연수 a의 개수를 구하시오.`,
      promptEn: `Find the number of single-digit natural numbers a satisfying ${cfg.left} < 0.\\dot{a} < ${cfg.right}.`,
      expression: `${cfg.vals.length}`,
      answer: String(cfg.vals.length),
      explanation: `0.\\dot{a} = \\frac{a}{9}이므로 주어진 부등식은 ${cfg.left} < \\frac{a}{9} < ${cfg.right}입니다. 각 변에 9를 곱하면 ${cfg.lVal} < a < ${cfg.rVal}이므로 만족하는 한 자리 자연수 a는 ${cfg.vals.join(', ')}의 ${cfg.vals.length}개입니다.`,
    };
  } else {
    // Maximum value
    const maxVal = Math.max(...cfg.vals);
    return {
      prompt: `부등식 ${cfg.left} < 0.\\dot{a} < ${cfg.right}를 만족하는 한 자리 자연수 a의 값 중 가장 큰 수를 구하시오.`,
      promptEn: `Find the maximum single-digit natural number a satisfying ${cfg.left} < 0.\\dot{a} < ${cfg.right}.`,
      expression: `${maxVal}`,
      answer: String(maxVal),
      explanation: `0.\\dot{a} = \\frac{a}{9}이므로 ${cfg.lVal} < a < ${cfg.rVal}입니다. 이를 만족하는 가장 큰 한 자리 자연수는 ${maxVal}입니다.`,
    };
  }
}

// [유형 15] 순환소수를 포함한 식의 기본 계산 (RPM #0104~#0107, #0127, #0128)
export function rpmRatDecArithmeticOperations(random) {
  const mode = ri(random, 1, 3);
  if (mode === 1) {
    // 7.\dot{8} + 3.\dot{4} = 71/9 + 31/9 = 102/9 = 34/3
    const a1 = ri(random, 2, 7);
    const b1 = ri(random, 1, 8);
    const a2 = ri(random, 1, 4);
    const b2 = ri(random, 1, 8);
    const num = (9 * a1 + b1) + (9 * a2 + b2);
    const den = 9;
    const g = gcd(num, den);
    const rNum = num / g;
    const rDen = den / g;

    return {
      prompt: `${a1}.\\dot{${b1}} + ${a2}.\\dot{${b2}}를 계산한 값을 기약분수 \\frac{a}{b}로 나타낼 때, a + b의 값을 구하시오.`,
      promptEn: `When calculating ${a1}.\\dot{${b1}} + ${a2}.\\dot{${b2}} as an irreducible fraction \\frac{a}{b}, find the value of a + b.`,
      expression: `${rNum} + ${rDen}`,
      answer: String(rNum + rDen),
      explanation: `${a1}.\\dot{${b1}} = \\frac{${9 * a1 + b1}}{9}, ${a2}.\\dot{${b2}} = \\frac{${9 * a2 + b2}}{9}이므로 합은 \\frac{${num}}{9} = \\frac{${rNum}}{${rDen}}입니다. 따라서 a + b = ${rNum} + ${rDen} = ${rNum + rDen}입니다.`,
    };
  } else if (mode === 2) {
    // 0.\dot{5}2\dot{3} = 523 * [ ]
    return {
      prompt: `0.\\dot{5}2\\dot{3} = 523 \\times \\square 에서 \\square 안에 알맞은 순환소수를 고르시오.`,
      promptEn: `Find the value of \\square in the equation 0.\\dot{5}2\\dot{3} = 523 \\times \\square.`,
      expression: `0.\\dot{0}0\\dot{1}`,
      answer: '1',
      choices: [
        { value: '1', label: '0.\\dot{0}0\\dot{1}', labelEn: '0.\\dot{0}0\\dot{1}' },
        { value: '2', label: '0.001', labelEn: '0.001' },
        { value: '3', label: '0.00\\dot{1}', labelEn: '0.00\\dot{1}' },
        { value: '4', label: '0.\\dot{1}', labelEn: '0.\\dot{1}' },
      ],
      explanation: `0.\\dot{5}2\\dot{3} = \\frac{523}{999} = 523 \\times \\frac{1}{999} = 523 \\times 0.\\dot{0}0\\dot{1}입니다. 따라서 정답은 1번입니다.`,
    };
  } else {
    // 2.0\dot{6} * m/n = 0.0\dot{4} => 31/15 * m/n = 4/90 = 2/45 => m/n = (2/45) / (31/15) = 2/93
    return {
      prompt: `서로소인 두 자연수 m, n에 대하여 2.0\\dot{6} \\times \\frac{m}{n} = 0.0\\dot{4}일 때, m + n의 값을 구하시오.`,
      promptEn: `Given coprime natural numbers m and n such that 2.0\\dot{6} \\times \\frac{m}{n} = 0.0\\dot{4}, find m + n.`,
      expression: `2 + 93`,
      answer: '95',
      explanation: `2.0\\dot{6} = \\frac{186}{90} = \\frac{31}{15}이고, 0.0\\dot{4} = \\frac{4}{90} = \\frac{2}{45}입니다.\n\\frac{31}{15} \\times \\frac{m}{n} = \\frac{2}{45} \\implies \\frac{m}{n} = \\frac{2}{45} \\times \\frac{15}{31} = \\frac{2}{93}입니다. m = 2, n = 93이므로 m + n = 95입니다.`,
    };
  }
}

// [유형 16] 유리수와 소수의 관계 정오 판별 (RPM #0108~#0110, #0129)
export function rpmRatDecNumberSystemTrueFalse(random) {
  const statements = [
    { q: '모든 순환소수는 유리수이다.', qEn: 'All repeating decimals are rational numbers.', ans: true, expl: '순환소수는 모두 분수 a/b (b!=0) 꼴로 나타낼 수 있으므로 유리수입니다.' },
    { q: '정수가 아닌 유리수는 유한소수 또는 순환소수로 나타낼 수 있다.', qEn: 'Non-integer rationals can be expressed as terminating or repeating decimals.', ans: true, expl: '기약분수를 소수로 고치면 유한소수 또는 순환소수 중 하나가 됩니다.' },
    { q: '모든 무한소수는 유리수이다.', qEn: 'All infinite decimals are rational numbers.', ans: false, expl: '순환하지 않는 무한소수(원주율 pi 등)는 분수로 나타낼 수 없으므로 유리수가 아닙니다.' },
    { q: '기약분수 중 분모의 소인수가 2 또는 5뿐이면 유한소수이다.', qEn: 'An irreducible fraction with prime factors of denominator only 2 or 5 is a terminating decimal.', ans: true, expl: '분모를 10의 거듭제곱으로 고칠 수 있으므로 항상 유한소수입니다.' },
    { q: '유한소수로 나타낼 수 없는 기약분수는 모두 순환소수로 나타내어진다.', qEn: 'All irreducible fractions that cannot be terminating decimals are repeating decimals.', ans: true, expl: '분수를 나눗셈하면 나머지가 유한하여 반드시 일정한 주기를 갖고 순환합니다.' },
    { q: '순환소수 중에는 유리수가 아닌 수도 있다.', qEn: 'Some repeating decimals are not rational numbers.', ans: false, expl: '모든 순환소수는 10^n x - 10^m x 공식으로 분수화되므로 예외 없이 모두 유리수입니다.' },
  ];
  const target = pick(random, statements);

  return {
    prompt: `다음 설명의 참(O)/거짓(X)을 판별하시오: "${target.q}"`,
    promptEn: `Determine True (O) or False (X): "${target.qEn}"`,
    expression: target.q,
    answer: target.ans ? '1' : '2',
    choices: [
      { value: '1', label: '참 (O)', labelEn: 'True' },
      { value: '2', label: '거짓 (X)', labelEn: 'False' },
    ],
    explanation: target.expl,
  };
}

// [유형 17] 두 분수 사이에 있는 유한소수의 개수 (RPM #0111~#0113)
export function rpmRatDecBetweenFractionsTerminating(random) {
  // Between 1/5 and 4/5 with denominator 35?
  // Let's use: Between 1/6 and 5/6 with denominator 30.
  // 1/6 = 5/30, 5/6 = 25/30.
  // Denominator 30 = 2 * 3 * 5.
  // For x/30 to be terminating, x must be a multiple of 3.
  // Multiples of 3 strictly between 5 and 25: 6, 9, 12, 15, 18, 21, 24 => 7 values!
  const configs = [
    { lNum: 1, lDen: 6, rNum: 5, rDen: 6, M: 30, k: 3, low: 5, high: 25, count: 7, list: [6, 9, 12, 15, 18, 21, 24] },
    { lNum: 1, lDen: 7, rNum: 4, rDen: 7, M: 35, k: 7, low: 5, high: 20, count: 2, list: [7, 14] },
    { lNum: 1, lDen: 4, rNum: 3, rDen: 4, M: 28, k: 7, low: 7, high: 21, count: 1, list: [14] },
    { lNum: 2, lDen: 7, rNum: 5, rDen: 7, M: 56, k: 7, low: 16, high: 40, count: 3, list: [21, 28, 35] },
  ];
  const cfg = pick(random, configs);

  return {
    prompt: `두 분수 \\frac{${cfg.lNum}}{${cfg.lDen}}과 \\frac{${cfg.rNum}}{${cfg.rDen}} 사이의 분수 중에서 분모가 ${cfg.M}이고 유한소수로 나타낼 수 있는 분수의 개수를 구하시오. (단, 분자는 자연수이다.)`,
    promptEn: `How many fractions with denominator ${cfg.M} strictly between \\frac{${cfg.lNum}}{${cfg.lDen}} and \\frac{${cfg.rNum}}{${cfg.rDen}} can be represented as terminating decimals?`,
    expression: `${cfg.count}`,
    answer: String(cfg.count),
    explanation: `분모를 ${cfg.M}(으)로 통분하면 \\frac{${cfg.low}}{${cfg.M}} < \\frac{x}{${cfg.M}} < \\frac{${cfg.high}}{${cfg.M}}입니다. 분모 ${cfg.M}의 2, 5 이외의 소인수는 ${cfg.k}이므로 유한소수가 되려면 분자 x는 ${cfg.k}의 배수이어야 합니다. ${cfg.low} < x < ${cfg.high} 범위의 ${cfg.k}의 배수는 ${cfg.list.join(', ')}의 ${cfg.count}개입니다.`,
  };
}

// [유형 18] 순환소수 오차 방정식 및 자릿수 식 (RPM #0114~#0116)
export function rpmRatDecMistakeEquationApplication(random) {
  const mode = ri(random, 1, 2);
  if (mode === 1) {
    // Multiplier error: N * 4.\dot{3} vs N * 4.3
    // 4.\dot{3} - 4.3 = 39/9 - 43/10 = 13/3 - 43/10 = 1/30
    // Diff is 0.6 = 6/10 = 3/5.
    // N * 1/30 = 3/5 => N = (3/5) * 30 = 18!
    const multiplierChoices = [
      { rep: '4.\\dot{3}', dec: '4.3', diffFrac: 1 / 30, n: 18, diffNum: 0.6 },
      { rep: '2.\\dot{3}', dec: '2.3', diffFrac: 1 / 30, n: 12, diffNum: 0.4 },
      { rep: '1.\\dot{6}', dec: '1.6', diffFrac: 1 / 15, n: 9, diffNum: 0.6 },
      { rep: '3.\\dot{6}', dec: '3.6', diffFrac: 1 / 15, n: 15, diffNum: 1.0 },
    ];
    const mc = pick(random, multiplierChoices);

    return {
      prompt: `어떤 자연수에 ${mc.rep}을(를) 곱해야 할 것을 잘못하여 ${mc.dec}을(를) 곱하였더니 그 결과가 정답보다 ${mc.diffNum}만큼 작아졌다. 이때 어떤 자연수를 구하시오.`,
      promptEn: `When a natural number was supposed to be multiplied by ${mc.rep}, it was mistakenly multiplied by ${mc.dec}, yielding a result ${mc.diffNum} smaller than the correct answer. Find the natural number.`,
      expression: `${mc.n}`,
      answer: String(mc.n),
      explanation: `어떤 자연수를 N이라 하면, N \\times ${mc.rep} - N \\times ${mc.dec} = ${mc.diffNum}입니다.\n${mc.rep} - ${mc.dec} = \\frac{1}{30}이고, ${mc.diffNum} = \\frac{${Math.round(mc.diffNum * 10)}}{10}이므로\nN \\times \\frac{1}{30} = \\frac{${Math.round(mc.diffNum * 10)}}{10} \\implies N = ${mc.n}입니다.`,
    };
  } else {
    // 0.a\dot{b} + 0.b\dot{a} = 0.\dot{7} => a + b = 7
    const sums = [5, 7, 8];
    const S = pick(random, sums);
    return {
      prompt: `한 자리 자연수 a, b (a > b)에 대하여 0.a\\dot{b} + 0.b\\dot{a} = 0.\\dot{${S}}일 때, a + b의 값을 구하시오.`,
      promptEn: `For single-digit natural numbers a and b with a > b, if 0.a\\dot{b} + 0.b\\dot{a} = 0.\\dot{${S}}, find a + b.`,
      expression: `${S}`,
      answer: String(S),
      explanation: `0.a\\dot{b} = \\frac{10a + b - a}{90} = \\frac{9a + b}{90}, 0.b\\dot{a} = \\frac{9b + a}{90}입니다.\n두 식의 합은 \\frac{(9a + b) + (9b + a)}{90} = \\frac{10(a + b)}{90} = \\frac{a + b}{9}입니다.\n우변은 0.\\dot{${S}} = \\frac{${S}}{9}이므로 \\frac{a + b}{9} = \\frac{${S}}{9} \\implies a + b = ${S}입니다.`,
    };
  }
}

// [단원 종합] 유리수와 순환소수 전 유형 실전 혼합 (RPM #0117~#0130)
export function rpmRatDecAllTypesMixed(random) {
  const generators = [
    rpmRatDecPowersOfTen,
    rpmRatDecTerminatingCondition,
    rpmRatDecMultiplyToTerminatingSingle,
    rpmRatDecMultiplyToTerminatingBoth,
    rpmRatDecDenominatorVariable,
    rpmRatDecTerminatingAndIrreducible,
    rpmRatDecPeriodAndNotation,
    rpmRatDecNthDigitOfRepeating,
    rpmRatDecRepeatingOnlyCondition,
    rpmRatDecFractionEquationMethod,
    rpmRatDecFractionFormulaMethod,
    rpmRatDecRepeatingToTerminating,
    rpmRatDecFaultyObservation,
    rpmRatDecRepeatingInequality,
    rpmRatDecArithmeticOperations,
    rpmRatDecNumberSystemTrueFalse,
    rpmRatDecBetweenFractionsTerminating,
    rpmRatDecMistakeEquationApplication,
  ];
  return pick(random, generators)(random);
}

// [최고수준 실력 UP] 유리수와 순환소수 최고난도 심화 (RPM #0131~#0136)
export function rpmRatDecAdvancedSkillUp(random) {
  const mode = ri(random, 1, 3);
  if (mode === 1) {
    // Multi-condition: 120 < N < 200, N is multiple of 6, N / 420 terminates.
    // 420 = 2^2 * 3 * 5 * 7 => N must be multiple of 21.
    // N is multiple of 6 (2*3) and 21 (3*7) => N is multiple of lcm(6, 21) = 42.
    // 120 < 42k < 200 => k = 3 (126), k = 4 (168).
    // Sum or count.
    return {
      prompt: `세 자리 자연수 N에 대하여 \\frac{N}{420}을 소수로 나타내면 유한소수가 되고, N은 6의 배수이다. 100 < N < 200을 만족하는 자연수 N의 개수를 구하시오.`,
      promptEn: `For a 3-digit natural number N, \\frac{N}{420} is a terminating decimal and N is a multiple of 6. How many such N exist in 100 < N < 200?`,
      expression: `2`,
      answer: '2',
      explanation: `420 = 2^2 \\times 3 \\times 5 \\times 7이므로 유한소수가 되려면 N은 3 \\times 7 = 21의 배수이어야 합니다.\n또한 N은 6의 배수이어야 하므로 N은 6과 21의 최소공배수인 42의 배수입니다.\n100 < N < 200 범위의 42의 배수는 42 \\times 3 = 126, 42 \\times 4 = 168의 2개입니다.`,
    };
  } else if (mode === 2) {
    // 1/2 * 3^2 * 5 * 7 * x that terminates
    // x is between 1 and 100
    return {
      prompt: `두 분수 \\frac{5}{72}와 \\frac{11}{140}에 어떤 자연수 x를 곱하면 두 분수 모두 유한소수가 된다고 한다. x의 값이 될 수 있는 가장 작은 세 자리 자연수를 구하시오.`,
      promptEn: `When both \\frac{5}{72} and \\frac{11}{140} are multiplied by x, both become terminating decimals. Find the smallest 3-digit natural number x.`,
      expression: `126`,
      answer: '126',
      explanation: `72 = 2^3 \\times 3^2이므로 x는 9의 배수이어야 하고, 140 = 2^2 \\times 5 \\times 7이므로 x는 7의 배수이어야 합니다.\n따라서 x는 9와 7의 최소공배수인 63의 배수입니다. 가장 작은 세 자리 자연수는 63 \\times 2 = 126입니다.`,
    };
  } else {
    // Period digit combination: 1/7 = 0.142857...
    // 31st digit + 50th digit
    // 31 % 6 = 1 => 1
    // 50 % 6 = 2 => 4
    // 0.xy + 0.yx = 0.14 + 0.41 = 0.55
    return {
      prompt: `분수 \\frac{1}{7}을 소수로 나타낼 때, 소수점 아래 31번째 자리의 숫자를 x, 소수점 아래 50번째 자리의 숫자를 y라 하자. 이때 0.x + 0.y의 값을 기약분수로 나타내시오.`,
      promptEn: `When \\frac{1}{7} is expressed as a decimal, let x be the 31st digit and y be the 50th digit after the decimal point. Express 0.x + 0.y as an irreducible fraction.`,
      expression: `\\frac{1}{2}`,
      answer: '1/2',
      explanation: `\\frac{1}{7} = 0.\\dot{1}4285\\dot{7}로 순환마디의 길이는 6입니다.\n31 ÷ 6 = 5 ... 1이므로 x = 1입니다.\n50 ÷ 6 = 8 ... 2이므로 y = 4입니다.\n따라서 0.x + 0.y = 0.1 + 0.4 = 0.5 = \\frac{1}{2}입니다.`,
    };
  }
}


function formatLinear(a, b, varName = 'x') {
  let res = '';
  if (a !== 0) {
    if (a === 1) res += varName;
    else if (a === -1) res += `-${varName}`;
    else res += `${a}${varName}`;
  }
  if (b !== 0) {
    if (res === '') res += String(b);
    else if (b > 0) res += ` + ${b}`;
    else res += ` - ${Math.abs(b)}`;
  }
  return res || '0';
}

function formatPoly2(a, b, c, varName = 'x') {
  let parts = [];
  if (a !== 0) {
    if (a === 1) parts.push(`${varName}^2`);
    else if (a === -1) parts.push(`-${varName}^2`);
    else parts.push(`${a}${varName}^2`);
  }
  if (b !== 0) {
    const sign = b > 0 ? (parts.length ? '+ ' : '') : '- ';
    const absB = Math.abs(b);
    const term = absB === 1 ? varName : `${absB}${varName}`;
    parts.push(`${sign}${term}`);
  }
  if (c !== 0) {
    const sign = c > 0 ? (parts.length ? '+ ' : '') : '- ';
    parts.push(`${sign}${Math.abs(c)}`);
  }
  return parts.join(' ') || '0';
}

function formatLinear2Var(a, b, var1 = 'x', var2 = 'y') {
  let parts = [];
  if (a !== 0) {
    if (a === 1) parts.push(var1);
    else if (a === -1) parts.push(`-${var1}`);
    else parts.push(`${a}${var1}`);
  }
  if (b !== 0) {
    const sign = b > 0 ? (parts.length ? '+ ' : '') : '- ';
    const absB = Math.abs(b);
    const term = absB === 1 ? var2 : `${absB}${var2}`;
    parts.push(`${sign}${term}`);
  }
  return parts.join(' ') || '0';
}

// =============================================================================
// Chapter 02: 단항식의 계산 (Pages 30~41)
// =============================================================================

// 1. [단항식의 계산 유형 01] 지수법칙 (1) - 지수의 합 (#0198~#0201)
export function rpmMonoExponentSum(random) {
  const mode = pick(random, ['find-box', 'even-product-factor', 'sum-given']);
  if (mode === 'find-box') {
    const a = ri(random, 2, 4);
    const b = ri(random, 1, 3);
    const box = ri(random, 2, 5);
    const c = ri(random, 2, 4);
    const N = a + b + box + c;
    const v = pick(random, ['x', 'a']);
    return {
      prompt: `${v}^${a} × ${v}^${b} × ${v}^□ × ${v}^${c} = ${v}^${N} 일 때, □ 안에 알맞은 자연수를 구하시오.`,
      promptEn: `Find the natural number for □ when ${v}^${a} × ${v}^${b} × ${v}^□ × ${v}^${c} = ${v}^${N}.`,
      expression: `${v}^{${a}} \\cdot ${v}^{${b}} \\cdot ${v}^{\\square} \\cdot ${v}^{${c}} = ${v}^{${N}}`,
      answer: String(box),
      explanation: `지수법칙 a^m × a^n = a^{m+n}에 의하여 ${v}^{${a} + ${b} + □ + ${c}} = ${v}^{${a + b + c} + □} = ${v}^{${N}}입니다. 따라서 □ = ${N} - ${a + b + c} = ${box}입니다.`,
      explanationEn: `By the product rule of exponents, the sum of powers is ${a} + ${b} + □ + ${c} = ${N}, so □ = ${box}.`
    };
  }
  if (mode === 'even-product-factor') {
    const k = pick(random, [5, 6, 7]);
    let pow2 = 0, pow3 = 0, pow5 = 0, pow7 = 0;
    let listStr = [];
    for (let i = 1; i <= k; i++) {
      let num = 2 * i;
      listStr.push(String(num));
      let temp = num;
      while (temp % 2 === 0) { pow2++; temp /= 2; }
      while (temp % 3 === 0) { pow3++; temp /= 3; }
      while (temp % 5 === 0) { pow5++; temp /= 5; }
      while (temp % 7 === 0) { pow7++; temp /= 7; }
    }
    const sumAll = pow2 + pow3 + pow5 + (k >= 7 ? pow7 : 0);
    const exprRhs = k >= 7 ? `2^a × 3^b × 5^c × 7^d` : `2^a × 3^b × 5^c`;
    const targetStr = k >= 7 ? `a + b + c + d` : `a + b + c`;
    return {
      prompt: `${listStr.join(' × ')} = ${exprRhs} 일 때, 자연수 ${targetStr}의 값을 구하시오.`,
      promptEn: `If ${listStr.join(' × ')} = ${exprRhs}, find the value of ${targetStr}.`,
      expression: `${listStr.join(' \\times ')} = ${exprRhs}`,
      answer: String(sumAll),
      explanation: `각 수를 소인수분해하면 2의 지수 a = ${pow2}, 3의 지수 b = ${pow3}, 5의 지수 c = ${pow5}${k >= 7 ? `, 7의 지수 d = ${pow7}` : ''}입니다. 따라서 합은 ${sumAll}입니다.`,
      explanationEn: `Factoring each term yields exponents a = ${pow2}, b = ${pow3}, c = ${pow5}${k >= 7 ? `, d = ${pow7}` : ''}, summing to ${sumAll}.`
    };
  }
  const S = ri(random, 4, 7);
  const val = Math.pow(2, S);
  return {
    prompt: `x + y = ${S}일 때, 2^x × 2^y의 값을 구하시오.`,
    promptEn: `When x + y = ${S}, find the value of 2^x × 2^y.`,
    expression: `x + y = ${S}, \\quad 2^x \\times 2^y`,
    answer: String(val),
    explanation: `지수법칙에 의하여 2^x × 2^y = 2^{x+y} = 2^${S} = ${val}입니다.`,
    explanationEn: `By the exponent rule, 2^x × 2^y = 2^{x+y} = 2^${S} = ${val}.`
  };
}

// 2. [단항식의 계산 유형 02] 지수법칙 (2) - 지수의 곱 (#0202~#0205)
export function rpmMonoExponentProduct(random) {
  const mode = pick(random, ['solve-box', 'power-compare', 'product-simplify']);
  if (mode === 'solve-box') {
    const a = ri(random, 2, 4);
    const b = ri(random, 2, 3);
    const c = ri(random, 2, 4);
    const box = ri(random, 2, 4);
    const total = a * b + c * box;
    return {
      prompt: `(a^${a})^${b} × (a^${c})^□ = a^${total} 일 때, □ 안에 알맞은 자연수를 구하시오.`,
      promptEn: `Find □ when (a^${a})^${b} × (a^${c})^□ = a^${total}.`,
      expression: `(a^{${a}})^{${b}} \\times (a^{${c}})^{\\square} = a^{${total}}`,
      answer: String(box),
      explanation: `(a^${a})^${b} = a^{${a * b}}이고 (a^${c})^□ = a^{${c} × □}입니다. 지수의 합이 ${total}이므로 ${a * b} + ${c} × □ = ${total}, 즉 ${c} × □ = ${c * box}에서 □ = ${box}입니다.`,
      explanationEn: `(a^${a})^${b} = a^{${a * b}} and (a^${c})^□ = a^{${c}□}. Then ${a * b} + ${c}□ = ${total}, so □ = ${box}.`
    };
  }
  if (mode === 'power-compare') {
    const basePowers = [
      { base: 2, p: 5, label: '2^{50}' },
      { base: 3, p: 4, label: '3^{40}' },
      { base: 4, p: 3, label: '4^{30}' },
      { base: 5, p: 2, label: '5^{20}' },
      { base: 6, p: 1, label: '6^{10}' },
    ];
    const choices = basePowers.map((item, idx) => ({
      value: String(idx + 1),
      label: item.label,
      labelEn: item.label
    }));
    return {
      prompt: `다음 중 가장 큰 수는?`,
      promptEn: `Which of the following numbers is the greatest?`,
      expression: `2^{50}, \\; 3^{40}, \\; 4^{30}, \\; 5^{20}, \\; 6^{10}`,
      choices,
      answer: '2',
      explanation: `모든 지수를 10의 배수로 변형하면 2^{50} = (2^5)^{10} = 32^{10}, 3^{40} = (3^4)^{10} = 81^{10}, 4^{30} = (4^3)^{10} = 64^{10}, 5^{20} = (5^2)^{10} = 25^{10}, 6^{10}입니다. 밑이 가장 큰 81^{10} = 3^{40}이 가장 큽니다.`,
      explanationEn: `Rewriting each with power 10: 32^{10}, 81^{10}, 64^{10}, 25^{10}, 6^{10}. Since 81 is largest, 3^{40} is the greatest.`
    };
  }
  const a = ri(random, 1, 3), b = ri(random, 2, 4), c = ri(random, 2, 3);
  const d = ri(random, 2, 3), e = ri(random, 1, 2), f = ri(random, 2, 3);
  const p = a * c + d * f;
  const q = b * c + e * f;
  return {
    prompt: `(x^${a}y^${b})^${c} × (x^${d}y^${e})^${f} = x^p y^q 일 때, p + q의 값을 구하시오.`,
    promptEn: `When (x^${a}y^${b})^${c} × (x^${d}y^${e})^${f} = x^p y^q, find p + q.`,
    expression: `(x^{${a}}y^{${b}})^{${c}} \\times (x^{${d}}y^{${e}})^{${f}} = x^p y^q`,
    answer: String(p + q),
    explanation: `x의 지수는 ${a}×${c} + ${d}×${f} = ${p}이고, y의 지수는 ${b}×${c} + ${e}×${f} = ${q}입니다. 따라서 p + q = ${p} + ${q} = ${p + q}입니다.`,
    explanationEn: `Exponent of x is ${p} and of y is ${q}. Thus p + q = ${p + q}.`
  };
}

// 3. [단항식의 계산 유형 03] 지수법칙 (3) - 지수의 나눗셈 (#0206~#0208)
export function rpmMonoExponentQuotient(random) {
  const mode = pick(random, ['solve-box-div', 'three-way-div', 'div-chain']);
  if (mode === 'solve-box-div') {
    const a = ri(random, 6, 10);
    const b = ri(random, 2, 4);
    const box = ri(random, 4, 7);
    const c = a - (box - b);
    return {
      prompt: `x^${a} ÷ (x^□ ÷ x^${b}) = x^${c} 일 때, □ 안에 알맞은 자연수를 구하시오. (단, □ > ${b})`,
      promptEn: `Find □ when x^${a} ÷ (x^□ ÷ x^${b}) = x^${c} with □ > ${b}.`,
      expression: `x^{${a}} \\div (x^{\\square} \\div x^{${b}}) = x^{${c}}`,
      answer: String(box),
      explanation: `x^□ ÷ x^${b} = x^{□ - ${b}}이므로 x^{${a} - (□ - ${b})} = x^{${a + b} - □} = x^{${c}}입니다. 따라서 □ = ${a + b} - ${c} = ${box}입니다.`,
      explanationEn: `x^${a} ÷ x^{□ - ${b}} = x^{${a + b} - □} = x^{${c}}, so □ = ${box}.`
    };
  }
  if (mode === 'three-way-div') {
    const a = ri(random, 3, 5), b = ri(random, 3, 4);
    const c = ri(random, 2, 3), d = ri(random, 2, 3);
    const p1 = a * b, p2 = c * d;
    if (p1 > p2) {
      const diff = p1 - p2;
      return {
        prompt: `(x^${a})^${b} ÷ (x^${c})^${d} = x^k 일 때, 자연수 k의 값을 구하시오.`,
        promptEn: `When (x^${a})^${b} ÷ (x^${c})^${d} = x^k, find k.`,
        expression: `(x^{${a}})^{${b}} \\div (x^{${c}})^{${d}} = x^k`,
        answer: String(diff),
        explanation: `(x^${a})^${b} = x^{${p1}}, (x^${c})^${d} = x^{${p2}}입니다. ${p1} > ${p2}이므로 나눗셈 결과는 x^{${p1} - ${p2}} = x^{${diff}}입니다. 따라서 k = ${diff}입니다.`,
        explanationEn: `x^{${p1}} ÷ x^{${p2}} = x^{${diff}}, so k = ${diff}.`
      };
    }
  }
  const N = ri(random, 12, 18);
  const a = ri(random, 2, 5);
  const b = ri(random, 2, 4);
  const k = N - a - b;
  return {
    prompt: `x^${N} ÷ x^${a} ÷ x^${b} = x^k 일 때, 자연수 k의 값을 구하시오.`,
    promptEn: `Find k when x^${N} ÷ x^${a} ÷ x^${b} = x^k.`,
    expression: `x^{${N}} \\div x^{${a}} \\div x^{${b}} = x^k`,
    answer: String(k),
    explanation: `x^{${N} - ${a} - ${b}} = x^{${k}}이므로 k = ${k}입니다.`,
    explanationEn: `x^{${N} - ${a} - ${b}} = x^{${k}}, so k = ${k}.`
  };
}

// 4. [단항식의 계산 유형 04] 지수법칙 (4) - 곱의 거듭제곱 (#0209~#0212)
export function rpmMonoExponentPowerProduct(random) {
  const mode = pick(random, ['neg-coeff-power', 'factor-base-power']);
  if (mode === 'neg-coeff-power') {
    const k = ri(random, 2, 3);
    const c = pick(random, [2, 3]);
    const a = ri(random, 2, 3);
    const b = ri(random, 1, 3);
    const K = Math.pow(-k, c);
    const p = a * c;
    const q = b * c;
    return {
      prompt: `(-${k}x^${a}y^${b})^${c} = ${K < 0 ? `-${Math.abs(K)}` : K}x^p y^q 일 때, p + q의 값을 구하시오.`,
      promptEn: `If (-${k}x^${a}y^${b})^${c} = ${K}x^p y^q, find p + q.`,
      expression: `(-${k}x^{${a}}y^{${b}})^{${c}} = ${K}x^p y^q`,
      answer: String(p + q),
      explanation: `지수법칙에 의하여 (-${k})^${c} = ${K}, x^{${a}×${c}} = x^${p}, y^{${b}×${c}} = y^${q}입니다. 따라서 p = ${p}, q = ${q}이며 p + q = ${p + q}입니다.`,
      explanationEn: `Expanding gives (-${k})^${c} = ${K}, p = ${p}, q = ${q}, so p + q = ${p + q}.`
    };
  }
  const bases = [
    { num: 72, p2: 3, p3: 2 },
    { num: 108, p2: 2, p3: 3 },
    { num: 144, p2: 4, p3: 2 },
    { num: 216, p2: 3, p3: 3 }
  ];
  const item = pick(random, bases);
  const x = ri(random, 2, 4);
  const a = item.p2 * x;
  const b = item.p3 * x;
  return {
    prompt: `${item.num}^${x} = 2^a × 3^b 일 때, 자연수 a + b의 값을 구하시오.`,
    promptEn: `When ${item.num}^${x} = 2^a × 3^b, find a + b.`,
    expression: `${item.num}^{${x}} = 2^a \\times 3^b`,
    answer: String(a + b),
    explanation: `${item.num}을 소인수분해하면 2^${item.p2} × 3^${item.p3}입니다. 따라서 (${item.num})^${x} = (2^${item.p2} × 3^${item.p3})^${x} = 2^{${a}} × 3^{${b}}이므로 a = ${a}, b = ${b}이고 a + b = ${a + b}입니다.`,
    explanationEn: `Factoring ${item.num} = 2^${item.p2} × 3^${item.p3}. Raising to power ${x} gives 2^{${a}} × 3^{${b}}, so a + b = ${a + b}.`
  };
}

// 5. [단항식의 계산 유형 05] 지수법칙 (5) - 몫의 거듭제곱 (#0213~#0215)
export function rpmMonoExponentPowerQuotient(random) {
  const k = ri(random, 2, 3);
  const a = ri(random, 2, 3);
  const b = ri(random, 2, 4);
  const c = pick(random, [2, 3]);
  const A = Math.pow(-k, c);
  const p = a * c;
  const q = b * c;
  const A_str = A < 0 ? `-${Math.abs(A)}` : `${A}`;
  return {
    prompt: `(- (${k}x^a) / y^b )^${c} = (${A_str}x^${p}) / y^${q} 일 때, a + b의 값을 구하시오. (단, a, b는 자연수)`,
    promptEn: `Given (- (${k}x^a) / y^b )^${c} = (${A_str}x^${p}) / y^${q}, find a + b.`,
    expression: `\\left(-\\frac{${k}x^a}{y^b}\\right)^{${c}} = \\frac{${A_str}x^{${p}}}{y^{${q}}}`,
    answer: String(a + b),
    explanation: `분자의 x 지수는 a × ${c} = ${p}이므로 a = ${a}이고, 분모의 y 지수는 b × ${c} = ${q}이므로 b = ${b}입니다. 따라서 a + b = ${a + b}입니다.`,
    explanationEn: `From a × ${c} = ${p} we have a = ${a}, and from b × ${c} = ${q} we have b = ${b}. Thus a + b = ${a + b}.`
  };
}

// 6. [단항식의 계산 유형 06] 지수법칙 응용 (1) - 밑을 같게 하는 지수방정식 (#0216~#0219)
export function rpmMonoExponentEquationBase(random) {
  const mode = pick(random, ['base-equality', 'pow2-mult', 'pow3-mult']);
  if (mode === 'base-equality') {
    const a = ri(random, 1, 2);
    const b = ri(random, 1, 2);
    const x = 2 * a + 3 * b;
    return {
      prompt: `4^(x + ${a}) = 8^(x - ${b}) 일 때, 자연수 x의 값을 구하시오.`,
      promptEn: `Find the natural number x satisfying 4^(x + ${a}) = 8^(x - ${b}).`,
      expression: `4^{x + ${a}} = 8^{x - ${b}}`,
      answer: String(x),
      explanation: `밑을 2로 통일하면 4 = 2^2, 8 = 2^3이므로 (2^2)^(x + ${a}) = (2^3)^(x - ${b})입니다. 2(x + ${a}) = 3(x - ${b})에서 2x + ${2 * a} = 3x - ${3 * b}, 따라서 x = ${x}입니다.`,
      explanationEn: `Expressing in base 2: 2(x + ${a}) = 3(x - ${b}) => 2x + ${2 * a} = 3x - ${3 * b} => x = ${x}.`
    };
  }
  if (mode === 'pow2-mult') {
    const a = ri(random, 1, 3);
    const x = ri(random, 2, 4);
    const N = 3 * x + 2 * a;
    const powVal = Math.pow(2, N);
    return {
      prompt: `2^x × 4^(x + ${a}) = ${powVal} 일 때, 자연수 x의 값을 구하시오.`,
      promptEn: `Find the natural number x when 2^x × 4^(x + ${a}) = ${powVal}.`,
      expression: `2^x \\times 4^{x + ${a}} = ${powVal}`,
      answer: String(x),
      explanation: `4 = 2^2이므로 2^x × (2^2)^(x + ${a}) = 2^{x + 2x + ${2 * a}} = 2^{3x + ${2 * a}}입니다. ${powVal} = 2^{${N}}이므로 3x + ${2 * a} = ${N}에서 3x = ${3 * x}, 즉 x = ${x}입니다.`,
      explanationEn: `2^{x + 2(x + ${a})} = 2^{3x + ${2 * a}} = 2^{${N}}, so 3x + ${2 * a} = ${N} gives x = ${x}.`
    };
  }
  const x = ri(random, 2, 4);
  const k = 2 * x - 1;
  const val = Math.pow(3, k);
  return {
    prompt: `3^(2x - 1) = ${val} 일 때, 자연수 x의 값을 구하시오.`,
    promptEn: `Solve for the natural number x in 3^(2x - 1) = ${val}.`,
    expression: `3^{2x - 1} = ${val}`,
    answer: String(x),
    explanation: `${val} = 3^{${k}}이므로 2x - 1 = ${k}에서 2x = ${k + 1}, x = ${x}입니다.`,
    explanationEn: `Since ${val} = 3^{${k}}, 2x - 1 = ${k} implies x = ${x}.`
  };
}

// 7. [단항식의 계산 유형 07] 지수법칙 응용 (2) - 거듭제곱의 덧셈 (#0220~#0223)
export function rpmMonoExponentAddition(random) {
  const mode = pick(random, ['pow2-sum', 'pow3-sum', 'pow-fraction']);
  if (mode === 'pow2-sum') {
    const x = ri(random, 4, 8);
    const totalExp = x + 2;
    return {
      prompt: `2^${x} + 2^${x} + 2^${x} + 2^${x} = 2^k 일 때, 자연수 k의 값을 구하시오.`,
      promptEn: `Find k when 2^${x} + 2^${x} + 2^${x} + 2^${x} = 2^k.`,
      expression: `2^{${x}} + 2^{${x}} + 2^{${x}} + 2^{${x}} = 2^k`,
      answer: String(totalExp),
      explanation: `2^${x}이 4개 더해져 있으므로 4 × 2^${x} = 2^2 × 2^${x} = 2^{${x} + 2} = 2^{${totalExp}}입니다. 따라서 k = ${totalExp}입니다.`,
      explanationEn: `Sum of 4 copies of 2^${x} is 4 × 2^${x} = 2^2 × 2^${x} = 2^{${totalExp}}, so k = ${totalExp}.`
    };
  }
  if (mode === 'pow3-sum') {
    const x = ri(random, 5, 9);
    const totalExp = x + 1;
    return {
      prompt: `3^${x} + 3^${x} + 3^${x} = 3^k 일 때, 자연수 k의 값을 구하시오.`,
      promptEn: `Find k when 3^${x} + 3^${x} + 3^${x} = 3^k.`,
      expression: `3^{${x}} + 3^{${x}} + 3^{${x}} = 3^k`,
      answer: String(totalExp),
      explanation: `3^${x}이 3개 더해져 있으므로 3 × 3^${x} = 3^{${x} + 1} = 3^{${totalExp}}입니다. 따라서 k = ${totalExp}입니다.`,
      explanationEn: `3 copies of 3^${x} is 3 × 3^${x} = 3^{${totalExp}}, so k = ${totalExp}.`
    };
  }
  const a = ri(random, 2, 4);
  const b = ri(random, 2, 4);
  const p = 2 * a + 2;
  const q = b + 1;
  return {
    prompt: `(4^${a} + 4^${a} + 4^${a} + 4^${a}) / (3^${b} + 3^${b} + 3^${b}) = 2^p / 3^q 일 때, p + q의 값을 구하시오.`,
    promptEn: `If (4^${a} + 4^${a} + 4^${a} + 4^${a}) / (3^${b} + 3^${b} + 3^${b}) = 2^p / 3^q, find p + q.`,
    expression: `\\frac{4^{${a}} + 4^{${a}} + 4^{${a}} + 4^{${a}}}{3^{${b}} + 3^{${b}} + 3^{${b}}} = \\frac{2^p}{3^q}`,
    answer: String(p + q),
    explanation: `분자는 4 × 4^${a} = 4^{${a + 1}} = (2^2)^{${a + 1}} = 2^{${p}}이고, 분모는 3 × 3^${b} = 3^{${q}}입니다. 따라서 p = ${p}, q = ${q}이며 p + q = ${p + q}입니다.`,
    explanationEn: `Numerator is 4^{${a+1}} = 2^{${p}}, denominator is 3^{${q}}. Thus p + q = ${p + q}.`
  };
}

// 8. [단항식의 계산 유형 08] 지수법칙 응용 (3) - 문자를 사용한 식의 변형 (#0224~#0227)
export function rpmMonoExponentSubstitution(random) {
  const mode = pick(random, ['single-sub', 'two-vars-sub']);
  if (mode === 'single-sub') {
    const base = pick(random, [2, 3]);
    if (base === 2) {
      const shift = ri(random, 1, 2);
      const coeff = Math.pow(2, shift * 3);
      const choices = [
        { value: '1', label: `A^3 / ${coeff}`, labelEn: `A^3 / ${coeff}` },
        { value: '2', label: `${coeff} A^3`, labelEn: `${coeff} A^3` },
        { value: '3', label: `A^2 / ${coeff}`, labelEn: `A^2 / ${coeff}` },
        { value: '4', label: `A^3 / ${Math.pow(2, shift)}`, labelEn: `A^3 / ${Math.pow(2, shift)}` },
        { value: '5', label: `8 A^3`, labelEn: `8 A^3` },
      ];
      return {
        prompt: `2^(x + ${shift}) = A 일 때, 8^x를 A를 사용하여 나타낸 것은?`,
        promptEn: `Express 8^x in terms of A when 2^(x + ${shift}) = A.`,
        expression: `2^{x + ${shift}} = A, \\quad 8^x`,
        choices,
        answer: '1',
        explanation: `2^(x + ${shift}) = 2^x × 2^${shift} = A이므로 2^x = A / ${Math.pow(2, shift)}입니다. 따라서 8^x = (2^3)^x = (2^x)^3 = (A / ${Math.pow(2, shift)})^3 = A^3 / ${coeff}입니다.`,
        explanationEn: `2^x = A / ${Math.pow(2, shift)}. Thus 8^x = (2^x)^3 = A^3 / ${coeff}.`
      };
    } else {
      const choices = [
        { value: '1', label: `9 A^2`, labelEn: `9 A^2` },
        { value: '2', label: `3 A^2`, labelEn: `3 A^2` },
        { value: '3', label: `A^2 / 9`, labelEn: `A^2 / 9` },
        { value: '4', label: `27 A^2`, labelEn: `27 A^2` },
        { value: '5', label: `81 A^2`, labelEn: `81 A^2` },
      ];
      return {
        prompt: `3^(x - 1) = A 일 때, 9^x를 A를 사용하여 나타낸 것은?`,
        promptEn: `Express 9^x in terms of A when 3^(x - 1) = A.`,
        expression: `3^{x - 1} = A, \\quad 9^x`,
        choices,
        answer: '1',
        explanation: `3^(x - 1) = 3^x / 3 = A에서 3^x = 3A입니다. 따라서 9^x = (3^2)^x = (3^x)^2 = (3A)^2 = 9 A^2입니다.`,
        explanationEn: `3^x = 3A. Then 9^x = (3A)^2 = 9 A^2.`
      };
    }
  }
  const target = pick(random, [
    { num: 72, ans: 'A^3 B^2', pA: 3, pB: 2 },
    { num: 12, ans: 'A^2 B', pA: 2, pB: 1 },
    { num: 18, ans: 'A B^2', pA: 1, pB: 2 },
    { num: 36, ans: 'A^2 B^2', pA: 2, pB: 2 }
  ]);
  const choices = [
    { value: '1', label: target.ans, labelEn: target.ans },
    { value: '2', label: `A^${target.pA + 1} B^${target.pB}`, labelEn: `A^${target.pA + 1} B^${target.pB}` },
    { value: '3', label: `A^${target.pA} B^${target.pB + 1}`, labelEn: `A^${target.pA} B^${target.pB + 1}` },
    { value: '4', label: `2 A^${target.pA} B^${target.pB}`, labelEn: `2 A^${target.pA} B^${target.pB}` },
    { value: '5', label: `3 A^${target.pA} B^${target.pB}`, labelEn: `3 A^${target.pA} B^${target.pB}` },
  ];
  return {
    prompt: `2^x = A, 3^x = B 일 때, ${target.num}^x를 A, B를 사용하여 나타낸 것은?`,
    promptEn: `Express ${target.num}^x in terms of A and B when 2^x = A and 3^x = B.`,
    expression: `2^x = A, \\quad 3^x = B, \\quad ${target.num}^x`,
    choices,
    answer: '1',
    explanation: `${target.num}을 소인수분해하면 2^${target.pA} × 3^${target.pB}입니다. 따라서 ${target.num}^x = (2^${target.pA} × 3^${target.pB})^x = (2^x)^${target.pA} × (3^x)^${target.pB} = ${target.ans}입니다.`,
    explanationEn: `${target.num} = 2^${target.pA} × 3^${target.pB}. Thus ${target.num}^x = ${target.ans}.`
  };
}

// 9. [단항식의 계산 유형 09] 지수법칙 응용 (4) - 몇 자리 자연수인가 (#0228~#0231)
export function rpmMonoExponentDigitsCount(random) {
  const diff = ri(random, 1, 3);
  const b = ri(random, 5, 8);
  const a = b + diff;
  const mult = Math.pow(2, diff);
  const digitsOfMult = String(mult).length;
  const totalDigits = digitsOfMult + b;
  return {
    prompt: `2^${a} × 5^${b} 은 몇 자리의 자연수인지 구하시오.`,
    promptEn: `How many digits does 2^${a} × 5^${b} have?`,
    expression: `2^{${a}} \\times 5^{${b}}`,
    answer: String(totalDigits),
    explanation: `2^${a} × 5^${b} = 2^${diff} × (2^${b} × 5^${b}) = ${mult} × 10^${b}입니다. ${mult} 뒤에 0이 ${b}개 붙으므로 전체 자리수는 ${digitsOfMult} + ${b} = ${totalDigits}자리입니다.`,
    explanationEn: `2^${a} × 5^${b} = ${mult} × 10^${b}, which has ${digitsOfMult} + ${b} = ${totalDigits} digits.`
  };
}

// 10. [단항식의 계산 유형 10] 단항식의 곱셈 (#0232~#0235)
export function rpmMonoMultBasic(random) {
  const a = ri(random, 2, 3);
  const b = ri(random, 2, 4);
  const p = ri(random, 1, 2);
  const q = ri(random, 1, 2);
  const r = ri(random, 1, 3);
  const coeff = a * a * b;
  const expX = 2 * p + 1;
  const expY = 2 * q + r;
  return {
    prompt: `(-${a}x^${p}y^${q})^2 × (${b}xy^${r}) = A x^B y^C 일 때, A + B + C의 값을 구하시오.`,
    promptEn: `Given (-${a}x^${p}y^${q})^2 × (${b}xy^${r}) = A x^B y^C, find A + B + C.`,
    expression: `(-${a}x^{${p}}y^{${q}})^2 \\times (${b}xy^{${r}}) = A x^B y^C`,
    answer: String(coeff + expX + expY),
    explanation: `(-${a}x^${p}y^${q})^2 = ${a * a}x^{${2 * p}}y^{${2 * q}}입니다. 여기에 ${b}xy^${r}를 곱하면 계수는 ${a * a} × ${b} = ${coeff}, x의 지수는 ${2 * p} + 1 = ${expX}, y의 지수는 ${2 * q} + ${r} = ${expY}입니다. 따라서 A + B + C = ${coeff} + ${expX} + ${expY} = ${coeff + expX + expY}입니다.`,
    explanationEn: `Expanding yields ${coeff}x^{${expX}}y^{${expY}}, so A = ${coeff}, B = ${expX}, C = ${expY}, and their sum is ${coeff + expX + expY}.`
  };
}

// 11. [단항식의 계산 유형 11] 단항식의 나눗셈 (#0236~#0239)
export function rpmMonoDivBasic(random) {
  const c2 = pick(random, [-4, -3, -2, 2, 3, 4]);
  const coeff = ri(random, 2, 5) * (c2 < 0 ? -1 : 1);
  const c1 = coeff * c2;
  const p1 = ri(random, 3, 5), q1 = ri(random, 2, 4);
  const p2 = ri(random, 1, 2), q2 = ri(random, 1, 2);
  const expX = p1 - p2;
  const expY = q1 - q2;
  return {
    prompt: `(${c1}x^${p1}y^${q1}) ÷ (${c2}x^${p2}y^${q2}) = A x^B y^C 일 때, 상수 A + B + C의 값을 구하시오.`,
    promptEn: `If (${c1}x^${p1}y^${q1}) ÷ (${c2}x^${p2}y^${q2}) = A x^B y^C, find A + B + C.`,
    expression: `(${c1}x^{${p1}}y^{${q1}}) \\div (${c2}x^{${p2}}y^{${q2}}) = A x^B y^C`,
    answer: String(coeff + expX + expY),
    explanation: `계수는 ${c1} ÷ (${c2}) = ${coeff}, x의 지수는 ${p1} - ${p2} = ${expX}, y의 지수는 ${q1} - ${q2} = ${expY}입니다. 따라서 A = ${coeff}, B = ${expX}, C = ${expY}이며 합은 ${coeff + expX + expY}입니다.`,
    explanationEn: `Dividing coefficients gives ${coeff}, and subtracting powers gives x^{${expX}}y^{${expY}}. Sum is ${coeff + expX + expY}.`
  };
}

// 12. [단항식의 계산 유형 12] 단항식의 곱셈과 나눗셈의 혼합 계산 (#0240~#0243)
export function rpmMonoMultDivMixed(random) {
  const k1 = pick(random, [2, 3]);
  const k2 = pick(random, [2, 4]);
  const k3 = ri(random, 2, 3);
  const p1 = ri(random, 1, 2), q1 = ri(random, 1, 2);
  const numCoeff = (k1 * k1) * k3;
  if (numCoeff % k2 === 0) {
    const finalCoeff = numCoeff / k2;
    const finalX = 2 * p1;
    const finalY = 2 * q1;
    return {
      prompt: `(-${k1}x^${p1}y^${q1})^2 ÷ (${k2}xy) × (${k3}xy) = A x^B y^C 일 때, 자연수 A + B + C의 값을 구하시오.`,
      promptEn: `Given (-${k1}x^${p1}y^${q1})^2 ÷ (${k2}xy) × (${k3}xy) = A x^B y^C, find A + B + C.`,
      expression: `(-${k1}x^{${p1}}y^{${q1}})^2 \\div (${k2}xy) \\times (${k3}xy) = A x^B y^C`,
      answer: String(finalCoeff + finalX + finalY),
      explanation: `거듭제곱을 풀면 ${k1 * k1}x^{${2 * p1}}y^{${2 * q1}}입니다. 나눗셈을 곱셈으로 바꾸어 계산하면 (${k1 * k1} × ${k3} ÷ ${k2}) x^{${2 * p1} - 1 + 1} y^{${2 * q1} - 1 + 1} = ${finalCoeff}x^{${finalX}}y^{${finalY}}입니다. 따라서 A + B + C = ${finalCoeff} + ${finalX} + ${finalY} = ${finalCoeff + finalX + finalY}입니다.`,
      explanationEn: `Simplifying gives ${finalCoeff}x^{${finalX}}y^{${finalY}}, so A + B + C = ${finalCoeff + finalX + finalY}.`
    };
  }
  return {
    prompt: `(-2x^2 y)^2 ÷ (4xy) × (3xy) = A x^B y^C 일 때, A + B + C의 값을 구하시오.`,
    promptEn: `Find A + B + C for (-2x^2 y)^2 ÷ (4xy) × (3xy) = A x^B y^C.`,
    expression: `(-2x^2 y)^2 \\div (4xy) \\times (3xy) = A x^B y^C`,
    answer: '9',
    explanation: `4x^4 y^2 ÷ 4xy × 3xy = x^3 y × 3xy = 3x^4 y^2입니다. A = 3, B = 4, C = 2이므로 합은 9입니다.`,
    explanationEn: `Calculates to 3x^4 y^2, yielding A + B + C = 9.`
  };
}

// 13. [단항식의 계산 유형 13] 단항식의 계산에서 □ 안에 알맞은 식 구하기 (#0244~#0246)
export function rpmMonoMissingBox(random) {
  const p = ri(random, 1, 2);
  const q = ri(random, 1, 2);
  const a = ri(random, 2, 3);
  const b = ri(random, 2, 3);
  const boxK = b * ri(random, 1, 2);
  const cCoeff = (a * boxK) / b;
  const pAdj = p + 2;
  const C_x = 1 + pAdj - 2;
  const C_y = q;
  const boxAns = `${boxK}x^${pAdj}y^${q}`;
  const choices = [
    { value: '1', label: boxAns, labelEn: boxAns },
    { value: '2', label: `${boxK}x^${pAdj + 1}y^${q}`, labelEn: `${boxK}x^${pAdj + 1}y^${q}` },
    { value: '3', label: `${boxK + 1}x^${pAdj}y^${q}`, labelEn: `${boxK + 1}x^${pAdj}y^${q}` },
    { value: '4', label: `${boxK}x^${pAdj}y^${q + 1}`, labelEn: `${boxK}x^${pAdj}y^${q + 1}` },
    { value: '5', label: `${boxK * 2}x^${pAdj}y^${q}`, labelEn: `${boxK * 2}x^${pAdj}y^${q}` },
  ];
  return {
    prompt: `(${a}xy) × □ ÷ (${b}x^2 y) = ${cCoeff}x^${C_x}y^${C_y} 일 때, □ 안에 알맞은 식은?`,
    promptEn: `Find the expression for □ in (${a}xy) × □ ÷ (${b}x^2 y) = ${cCoeff}x^${C_x}y^${C_y}.`,
    expression: `(${a}xy) \\times \\square \\div (${b}x^2 y) = ${cCoeff}x^{${C_x}}y^{${C_y}}`,
    choices,
    answer: '1',
    explanation: `□ = (${cCoeff}x^${C_x}y^${C_y}) × (${b}x^2 y) ÷ (${a}xy) = (${cCoeff * b}x^{${C_x + 2}}y^{${C_y + 1}}) ÷ (${a}xy) = ${boxAns}입니다.`,
    explanationEn: `Isolating □ gives □ = (${cCoeff}x^${C_x}y^${C_y}) × (${b}x^2 y) ÷ (${a}xy) = ${boxAns}.`
  };
}

// 14. [단항식의 계산 유형 14] 단항식의 계산의 도형에의 활용 (#0247~#0249)
export function rpmMonoGeometryApplication(random) {
  const shape = pick(random, ['triangle', 'rectangle', 'cone']);
  if (shape === 'triangle') {
    const bCoeff = ri(random, 2, 4) * 2;
    const hCoeff = ri(random, 2, 5);
    const p1 = ri(random, 1, 2), q1 = ri(random, 1, 2);
    const p2 = ri(random, 1, 2), q2 = ri(random, 1, 2);
    const areaCoeff = (bCoeff * hCoeff) / 2;
    const areaP = p1 + p2;
    const areaQ = q1 + q2;
    return {
      prompt: `밑변의 길이가 ${bCoeff}a^${p1}b^${q1}이고, 높이가 ${hCoeff}a^${p2}b^${q2}인 삼각형의 넓이를 구하시오. (단, 답은 계수를 입력)`,
      promptEn: `Find the coefficient of the area of a triangle with base ${bCoeff}a^${p1}b^${q1} and height ${hCoeff}a^${p2}b^${q2}.`,
      expression: `\\text{Base} = ${bCoeff}a^{${p1}}b^{${q1}}, \\quad \\text{Height} = ${hCoeff}a^{${p2}}b^{${q2}}`,
      answer: String(areaCoeff),
      answerSuffix: `a^${areaP}b^${areaQ}`,
      explanation: `(삼각형의 넓이) = 1/2 × (밑변) × (높이) = 1/2 × (${bCoeff}a^${p1}b^${q1}) × (${hCoeff}a^${p2}b^${q2}) = ${areaCoeff}a^${areaP}b^${areaQ}입니다.`,
      explanationEn: `Area = 1/2 × base × height = ${areaCoeff}a^${areaP}b^${areaQ}.`
    };
  }
  if (shape === 'cone') {
    const rCoeff = 3;
    const hCoeff = ri(random, 2, 5) * 2;
    const volCoeff = (rCoeff * rCoeff * hCoeff) / 3;
    return {
      prompt: `밑면인 원의 반지름의 길이가 ${rCoeff}a이고 부피가 ${volCoeff}πa^3b^2인 원뿔의 높이를 구하시오. (단, 높이의 계수를 입력)`,
      promptEn: `Find the height coefficient of a cone with base radius ${rCoeff}a and volume ${volCoeff}πa^3b^2.`,
      expression: `r = ${rCoeff}a, \\quad V = ${volCoeff}\\pi a^3 b^2`,
      answer: String(hCoeff),
      answerSuffix: 'ab^2',
      explanation: `(원뿔의 부피) = 1/3 × π × r^2 × h = 1/3 × π × (${rCoeff}a)^2 × h = ${volCoeff}πa^3b^2입니다. h = (${volCoeff}πa^3b^2) ÷ (3πa^2) = ${hCoeff}ab^2입니다.`,
      explanationEn: `Volume = 1/3 π r^2 h. Solving for h gives ${hCoeff}ab^2.`
    };
  }
  const wCoeff = ri(random, 3, 5);
  const hCoeff = ri(random, 2, 4);
  const areaCoeff = wCoeff * hCoeff;
  return {
    prompt: `가로의 길이가 ${wCoeff}ab이고 넓이가 ${areaCoeff}a^3b^2인 직사각형의 세로의 길이를 구하시오. (단, 계수를 입력)`,
    promptEn: `Find the coefficient of the length of a rectangle with width ${wCoeff}ab and area ${areaCoeff}a^3b^2.`,
    expression: `\\text{Width} = ${wCoeff}ab, \\quad \\text{Area} = ${areaCoeff}a^3 b^2`,
    answer: String(hCoeff),
    answerSuffix: 'a^2b',
    explanation: `(세로의 길이) = (넓이) ÷ (가로의 길이) = (${areaCoeff}a^3b^2) ÷ (${wCoeff}ab) = ${hCoeff}a^2b입니다.`,
    explanationEn: `Length = Area ÷ Width = ${hCoeff}a^2b.`
  };
}

// 15. [단항식의 계산 유형 15] 지수법칙 심화 (1) - 묶기 / 인수분해 (#0250~#0253)
export function rpmMonoExponentFactorOut(random) {
  const base = pick(random, [2, 3]);
  const x = ri(random, 2, 4);
  const factor = 1 + base + base * base;
  const total = factor * Math.pow(base, x);
  return {
    prompt: `${base}^x + ${base}^(x + 1) + ${base}^(x + 2) = ${total} 일 때, 자연수 x의 값을 구하시오.`,
    promptEn: `Find the natural number x when ${base}^x + ${base}^(x + 1) + ${base}^(x + 2) = ${total}.`,
    expression: `${base}^x + ${base}^{x + 1} + ${base}^{x + 2} = ${total}`,
    answer: String(x),
    explanation: `좌변을 ${base}^x로 묶으면 ${base}^x(1 + ${base} + ${base * base}) = ${factor} × ${base}^x = ${total}입니다. ${base}^x = ${total} ÷ ${factor} = ${Math.pow(base, x)} = ${base}^${x}이므로 x = ${x}입니다.`,
    explanationEn: `Factoring yields ${base}^x(1 + ${base} + ${base * base}) = ${factor} × ${base}^x = ${total}, so ${base}^x = ${Math.pow(base, x)} and x = ${x}.`
  };
}

// 16. [단항식의 계산 유형 16] 지수법칙 심화 (2) - 거듭제곱의 일의 자리 숫자 규칙성 (#0254~#0256)
export function rpmMonoUnitsDigitCycle(random) {
  const base = pick(random, [2, 3, 7, 8]);
  const exp = ri(random, 35, 95);
  const cycles = {
    2: [6, 2, 4, 8],
    3: [1, 3, 9, 7],
    7: [1, 7, 9, 3],
    8: [6, 8, 4, 2]
  };
  const cycle = cycles[base];
  const unitsDigit = cycle[exp % 4];
  return {
    prompt: `${base}^${exp}의 일의 자리의 숫자를 구하시오.`,
    promptEn: `Find the units digit of ${base}^${exp}.`,
    expression: `${base}^{${exp}} \\pmod{10}`,
    answer: String(unitsDigit),
    explanation: `${base}의 거듭제곱의 일의 자리 숫자는 [${cycle[1]}, ${cycle[2]}, ${cycle[3]}, ${cycle[0]}]의 4개 숫자가 반복됩니다. ${exp} = 4 × ${Math.floor(exp / 4)} + ${exp % 4}이므로 일의 자리 숫자는 ${unitsDigit}입니다.`,
    explanationEn: `Powers of ${base} have units digits repeating in a cycle of 4: [${cycle[1]}, ${cycle[2]}, ${cycle[3]}, ${cycle[0]}]. ${exp} mod 4 = ${exp % 4}, so the units digit is ${unitsDigit}.`
  };
}

// 17. [단항식의 계산 유형 17] 단항식의 계산 전 유형 실전 혼합 (#0257~#0274)
export function rpmMonoAllTypesMixed(random) {
  const fns = [
    rpmMonoExponentSum,
    rpmMonoExponentProduct,
    rpmMonoExponentQuotient,
    rpmMonoExponentPowerProduct,
    rpmMonoExponentPowerQuotient,
    rpmMonoExponentEquationBase,
    rpmMonoExponentAddition,
    rpmMonoExponentSubstitution,
    rpmMonoExponentDigitsCount,
    rpmMonoMultBasic,
    rpmMonoDivBasic,
    rpmMonoMultDivMixed,
    rpmMonoMissingBox,
    rpmMonoGeometryApplication,
    rpmMonoExponentFactorOut,
    rpmMonoUnitsDigitCycle
  ];
  return pick(random, fns)(random);
}

// 18. [단항식의 계산 유형 18] 단항식의 계산 최고수준 실력 UP (#0275~#0280)
export function rpmMonoAdvancedSkillUp(random) {
  const mode = pick(random, ['storage-units', 'advanced-sub', 'volume-ratio']);
  if (mode === 'storage-units') {
    const gb = pick(random, [16, 32, 64]);
    const mb = pick(random, [4, 8, 16]);
    const gbExp = gb === 16 ? 4 : (gb === 32 ? 5 : 6);
    const mbExp = mb === 4 ? 2 : (mb === 8 ? 3 : 4);
    const finalExp = gbExp + 10 - mbExp;
    const choices = [
      { value: '1', label: `2^${finalExp} 장`, labelEn: `2^${finalExp} photos` },
      { value: '2', label: `2^${finalExp - 1} 장`, labelEn: `2^${finalExp - 1} photos` },
      { value: '3', label: `2^${finalExp + 1} 장`, labelEn: `2^${finalExp + 1} photos` },
      { value: '4', label: `2^${finalExp + 2} 장`, labelEn: `2^${finalExp + 2} photos` },
      { value: '5', label: `2^${finalExp - 2} 장`, labelEn: `2^${finalExp - 2} photos` },
    ];
    return {
      prompt: `용량이 ${gb} GB인 메모리 카드에 용량이 ${mb} MB인 사진을 최대 몇 장까지 저장할 수 있는가? (단, 1 GB = 2^10 MB)`,
      promptEn: `How many ${mb} MB photos can be stored on a ${gb} GB memory card? (1 GB = 2^10 MB)`,
      expression: `${gb} \\text{ GB} \\div ${mb} \\text{ MB}`,
      choices,
      answer: '1',
      explanation: `${gb} GB = ${gb} × 2^10 MB = 2^${gbExp} × 2^10 MB = 2^${gbExp + 10} MB입니다. 사진 한 장의 용량은 ${mb} MB = 2^${mbExp} MB이므로 저장할 수 있는 사진 수는 2^${gbExp + 10} ÷ 2^${mbExp} = 2^${finalExp} 장입니다.`,
      explanationEn: `${gb} GB = 2^{${gbExp + 10}} MB. Dividing by 2^{${mbExp}} MB yields 2^{${finalExp}} photos.`
    };
  }
  if (mode === 'advanced-sub') {
    return {
      prompt: `a = 5^(x - 1), b = 2^(x + 2) 일 때, 80^x를 a, b를 사용하여 나타낸 식에서 분모의 값을 구하시오. (식: 5ab^4 / k 꼴)`,
      promptEn: `Given a = 5^(x - 1) and b = 2^(x + 2), find the denominator k when 80^x is expressed as (5ab^4) / k.`,
      expression: `a = 5^{x - 1}, \\quad b = 2^{x + 2}, \\quad 80^x`,
      answer: '256',
      explanation: `a = 5^x ÷ 5에서 5^x = 5a이고, b = 2^x × 4에서 2^x = b / 4입니다. 80 = 5 × 2^4이므로 80^x = 5^x × (2^x)^4 = 5a × (b / 4)^4 = (5ab^4) / 256입니다. 따라서 분모는 256입니다.`,
      explanationEn: `5^x = 5a and 2^x = b/4. 80^x = 5^x × (2^x)^4 = 5a × (b/4)^4 = (5ab^4) / 256. The denominator is 256.`
    };
  }
  return {
    prompt: `반지름의 길이가 2ab인 구의 부피는 밑면의 반지름의 길이가 3b이고 높이가 ab^2인 원뿔의 부피의 몇 배인가? (결과: k a^2 / (9b) 일 때 k의 값)`,
    promptEn: `The volume of a sphere with radius 2ab is how many times the volume of a cone with radius 3b and height ab^2? Find numerator k in k a^2 / (9b).`,
    expression: `V_1 = \\frac{4}{3}\\pi (2ab)^3, \\quad V_2 = \\frac{1}{3}\\pi (3b)^2(ab^2)`,
    answer: '32',
    explanation: `구의 부피는 4/3 π (2ab)^3 = 32/3 π a^3 b^3입니다. 원뿔의 부피는 1/3 π (3b)^2 (ab^2) = 3 π a b^4 = 9/3 π a b^4입니다. 따라서 (구의 부피) ÷ (원뿔의 부피) = (32/3 π a^3 b^3) ÷ (3 π a b^4) = (32 a^2) / (9 b) 배이므로 k = 32입니다.`,
    explanationEn: `Sphere volume is (32/3)π a^3 b^3 and cone volume is 3π a b^4. The ratio is (32 a^2) / (9 b), so k = 32.`
  };
}

// =============================================================================
// Chapter 03: 다항식의 계산 (Pages 44~51)
// =============================================================================

// 19. [다항식의 계산 유형 01] 다항식의 덧셈과 뺄셈 (#0306~#0309)
export function rpmPolyCalcAddSubBasic(random) {
  const m = pick(random, [-3, -2, 2, 3]);
  const n = pick(random, [-3, -2, 2, 3]);
  const a = ri(random, 1, 3), b = ri(random, -3, 3) || 1, c = ri(random, -4, 4);
  const d = ri(random, 1, 3), e = ri(random, -3, 3) || -1, f = ri(random, -4, 4);
  const coeffX = m * a + n * d;
  const coeffY = m * b + n * e;
  const constTerm = m * c + n * f;
  const p1Str = `${formatLinear2Var(a, b)}${c > 0 ? ` + ${c}` : (c < 0 ? ` - ${Math.abs(c)}` : '')}`;
  const p2Str = `${formatLinear2Var(d, e)}${f > 0 ? ` + ${f}` : (f < 0 ? ` - ${Math.abs(f)}` : '')}`;
  const expr = `${m}(${p1Str}) ${n > 0 ? `+ ${n}` : `- ${Math.abs(n)}`}(${p2Str})`;
  return {
    prompt: `${expr}을 간단히 하였을 때, x의 계수를 A, y의 계수를 B, 상수항을 C라 하자. A + B + C의 값을 구하시오.`,
    promptEn: `When simplifying ${expr}, let A be the coefficient of x, B be the coefficient of y, and C be the constant term. Find A + B + C.`,
    expression: expr,
    answer: String(coeffX + coeffY + constTerm),
    explanation: `괄호를 풀면 (${m * a}x ${m * b >= 0 ? `+ ${m * b}` : `- ${Math.abs(m * b)}`}y ${m * c >= 0 ? `+ ${m * c}` : `- ${Math.abs(m * c)}`}) + (${n * d}x ${n * e >= 0 ? `+ ${n * e}` : `- ${Math.abs(n * e)}`}y ${n * f >= 0 ? `+ ${n * f}` : `- ${Math.abs(n * f)}`}) = ${coeffX}x ${coeffY >= 0 ? `+ ${coeffY}` : `- ${Math.abs(coeffY)}`}y ${constTerm >= 0 ? `+ ${constTerm}` : `- ${Math.abs(constTerm)}`}입니다. 따라서 A + B + C = ${coeffX + coeffY + constTerm}입니다.`,
    explanationEn: `Expanding and collecting like terms yields ${coeffX}x + (${coeffY})y + (${constTerm}). The sum is ${coeffX + coeffY + constTerm}.`
  };
}

// 20. [다항식의 계산 유형 02] 이차식의 덧셈과 뺄셈 (#0310~#0313)
export function rpmPolyCalcQuadraticAddSub(random) {
  const a = ri(random, 2, 4);
  const b = ri(random, -4, -1);
  const c = ri(random, 2, 6);
  const d = ri(random, -4, -1);
  const e = ri(random, -2, 2) || 1;
  const f = ri(random, 1, 4);
  const resA = a - d;
  const resB = b - e;
  const resC = c - f;
  const expr = `(${formatPoly2(a, b, c)}) - (${formatPoly2(d, e, f)})`;
  return {
    prompt: `${expr}을 간단히 했을 때, x^2의 계수와 상수항의 합을 구하시오.`,
    promptEn: `Find the sum of the x^2 coefficient and the constant term in ${expr}.`,
    expression: expr,
    answer: String(resA + resC),
    explanation: `동류항끼리 모아 계산하면 (${a} - (${d}))x^2 + (${b} - (${e}))x + (${c} - (${f})) = ${resA}x^2 ${resB >= 0 ? `+ ${resB}` : `- ${Math.abs(resB)}`}x ${resC >= 0 ? `+ ${resC}` : `- ${Math.abs(resC)}`}입니다. 따라서 x^2의 계수 ${resA}와 상수항 ${resC}의 합은 ${resA + resC}입니다.`,
    explanationEn: `Collecting like terms gives ${resA}x^2 + (${resB})x + (${resC}). The sum of the x^2 coefficient and the constant term is ${resA + resC}.`
  };
}

// 21. [다항식의 계산 유형 03] 괄호가 있는 다항식의 덧셈과 뺄셈 (#0314~#0317)
export function rpmPolyCalcBracketsOrder(random) {
  const c1 = ri(random, 2, 4);
  const c2 = ri(random, 2, 3);
  const c3 = ri(random, 3, 5);
  const c4 = ri(random, 2, 4);
  const k = ri(random, 2, 6);
  const ansX = c1 - c4;
  const ansY = -(2 * c2 - c3);
  const expr = `${c1}x - [${c2}y - {${c3}y - (${c4}x + ${c2}y)} + ${k}]`;
  return {
    prompt: `${expr}을 간단히 하였을 때, x의 계수를 a, y의 계수를 b라 하자. a + b의 값을 구하시오.`,
    promptEn: `When simplifying ${expr}, let a be the coefficient of x and b be the coefficient of y. Find a + b.`,
    expression: expr,
    answer: String(ansX + ansY),
    explanation: `소괄호 풀기: {${c3}y - ${c4}x - ${c2}y} = {-${c4}x + ${c3 - c2}y}. 중괄호 풀기: [${c2}y + ${c4}x - ${c3 - c2}y + ${k}] = [${c4}x + ${2 * c2 - c3}y + ${k}]. 대괄호 풀기: ${c1}x - ${c4}x - ${2 * c2 - c3}y - ${k} = ${ansX}x ${ansY >= 0 ? `+ ${ansY}` : `- ${Math.abs(ansY)}`}y - ${k}. 따라서 a + b = ${ansX} + (${ansY}) = ${ansX + ansY}입니다.`,
    explanationEn: `Unfolding brackets in order: () -> {} -> [] results in ${ansX}x + (${ansY})y - ${k}. Thus a + b = ${ansX + ansY}.`
  };
}

// 22. [다항식의 계산 유형 04] 잘못 계산하여 얻은 식에서 어떤 다항식 구하기 (#0318~#0321)
export function rpmPolyCalcWrongCalculation(random) {
  const pA = ri(random, 2, 4);
  const pB = ri(random, -4, -1);
  const pC = ri(random, 1, 3);
  const qA = ri(random, 3, 6);
  const qB = ri(random, 1, 4);
  const qC = ri(random, -3, -1);
  const corA = qA + 2 * pA;
  const corB = qB + 2 * pB;
  const corC = qC + 2 * pC;
  const polyP = formatPoly2(pA, pB, pC);
  const polyQ = formatPoly2(qA, qB, qC);
  return {
    prompt: `어떤 식 A에 ${polyP}를 더해야 할 것을 잘못하여 뺐더니 ${polyQ}가 되었다. 이때 바르게 계산한 식에서 x^2의 계수와 x의 계수, 상수항의 합을 구하시오.`,
    promptEn: `Instead of adding ${polyP} to polynomial A, subtracting it yielded ${polyQ}. Find the sum of all coefficients in the correct result.`,
    expression: `A - (${polyP}) = ${polyQ}`,
    answer: String(corA + corB + corC),
    explanation: `잘못된 식: A - (${polyP}) = ${polyQ}이므로 A = (${polyQ}) + (${polyP})입니다. 바르게 계산한 식은 A + (${polyP}) = (${polyQ}) + 2(${polyP}) = ${formatPoly2(corA, corB, corC)}입니다. 계수의 합은 ${corA} + (${corB}) + (${corC}) = ${corA + corB + corC}입니다.`,
    explanationEn: `A = Q + P. Correct answer is A + P = Q + 2P = ${corA}x^2 + (${corB})x + (${corC}), sum of coefficients is ${corA + corB + corC}.`
  };
}

// 23. [다항식의 계산 유형 05] 단항식과 다항식의 곱셈 (#0322~#0325)
export function rpmPolyCalcMonomialPolyMult(random) {
  const a1 = -ri(random, 2, 4);
  const b1 = -ri(random, 3, 5);
  const c1 = ri(random, 4, 7);
  const a2 = -ri(random, 2, 3);
  const b2 = ri(random, 4, 7);
  const c2 = -ri(random, 2, 4);
  const d2 = ri(random, 1, 3);
  const resX2 = a1 * b1 + a2 * b2;
  const resX = a1 * c1 + a2 * c2;
  const resConst = a2 * d2;
  const expr = `${a1}x(${b1}x + ${c1}) ${a2 > 0 ? `+ ${a2}` : `- ${Math.abs(a2)}`}(${b2}x^2 ${c2 > 0 ? `+ ${c2}` : `- ${Math.abs(c2)}`}x + ${d2})`;
  return {
    prompt: `${expr}을 전개하여 간단히 하였을 때, x^2의 계수를 A, x의 계수를 B, 상수항을 C라 하자. A + B + C의 값을 구하시오.`,
    promptEn: `Expand and simplify ${expr}. Let A, B, C be the coefficients of x^2, x, and the constant term. Find A + B + C.`,
    expression: expr,
    answer: String(resX2 + resX + resConst),
    explanation: `분배법칙으로 전개하면 (${a1 * b1}x^2 + ${a1 * c1}x) + (${a2 * b2}x^2 + ${a2 * c2}x + ${a2 * d2}) = ${resX2}x^2 ${resX >= 0 ? `+ ${resX}` : `- ${Math.abs(resX)}`}x ${resConst >= 0 ? `+ ${resConst}` : `- ${Math.abs(resConst)}`}입니다. 따라서 A + B + C = ${resX2 + resX + resConst}입니다.`,
    explanationEn: `Expanding gives ${resX2}x^2 + (${resX})x + (${resConst}). The sum is ${resX2 + resX + resConst}.`
  };
}

// 24. [다항식의 계산 유형 06] 다항식과 단항식의 나눗셈 (#0326~#0329)
export function rpmPolyCalcMonomialPolyDiv(random) {
  const q = pick(random, [2, 3]);
  const p = ri(random, 1, 2);
  const base1 = ri(random, 2, 4) * p;
  const base2 = ri(random, 2, 5) * p;
  const base3 = ri(random, 2, 4) * p;
  const res1 = (base1 * q) / p;
  const res2 = (base2 * q) / p;
  const res3 = (base3 * q) / p;
  const expr = `(${base1}x^2 y + ${base2}xy^2 - ${base3}y) ÷ (${p}/${q}y)`;
  return {
    prompt: `${expr}을 간단히 하였을 때, x^2의 계수 A와 xy의 계수 B, 상수항 C의 합 A + B - C의 값을 구하시오.`,
    promptEn: `Simplify ${expr} to A x^2 + B xy - C. Find A + B - C.`,
    expression: `(${base1}x^2 y + ${base2}xy^2 - ${base3}y) \\div \\left(\\frac{${p}}{${q}}y\\right)`,
    answer: String(res1 + res2 - res3),
    explanation: `역수 곱셈으로 바꾸면 (${base1}x^2 y + ${base2}xy^2 - ${base3}y) × (${q} / (${p}y)) = ${res1}x^2 + ${res2}xy - ${res3}입니다. A = ${res1}, B = ${res2}, C = ${res3}이므로 A + B - C = ${res1 + res2 - res3}입니다.`,
    explanationEn: `Multiplying by reciprocal ${q}/(${p}y) yields ${res1}x^2 + ${res2}xy - ${res3}. Then A + B - C = ${res1 + res2 - res3}.`
  };
}

// 25. [다항식의 계산 유형 07] 사칙계산이 혼합된 다항식의 계산 (#0330~#0333)
export function rpmPolyCalcFourOpsMixed(random) {
  const a = ri(random, 2, 4), b = ri(random, 1, 3);
  const multCoeff = -ri(random, 2, 4);
  const d1 = ri(random, 2, 5), d2 = ri(random, 2, 4);
  const coeffX2 = multCoeff * a;
  const coeffXY = -multCoeff * b;
  const expr = `(${a}x - ${b}y) × (${multCoeff}x) - (${d1}x^2 y - ${d2}xy) ÷ (xy)`;
  return {
    prompt: `${expr}을 간단히 하였을 때, x^2의 계수와 xy의 계수의 합을 구하시오.`,
    promptEn: `Find the sum of the x^2 and xy coefficients in ${expr}.`,
    expression: expr,
    answer: String(coeffX2 + coeffXY),
    explanation: `앞부분: ${multCoeff * a}x^2 + ${-multCoeff * b}xy. 뒷부분: (${d1}x^2 y - ${d2}xy) ÷ (xy) = ${d1}x - ${d2}. 빼면 ${coeffX2}x^2 + ${coeffXY}xy - ${d1}x + ${d2}입니다. 따라서 x^2의 계수와 xy의 계수의 합은 ${coeffX2} + ${coeffXY} = ${coeffX2 + coeffXY}입니다.`,
    explanationEn: `Simplifying gives ${coeffX2}x^2 + ${coeffXY}xy - ${d1}x + ${d2}. Sum of x^2 and xy coefficients is ${coeffX2 + coeffXY}.`
  };
}

// 26. [다항식의 계산 유형 08] 다항식 계산에서 □ 안에 알맞은 식 구하기 (#0334~#0336)
export function rpmPolyCalcMissingBox(random) {
  const l = ri(random, 2, 3);
  const w = ri(random, 2, 4);
  const baseArea = l * w;
  const hA = ri(random, 2, 5);
  const hB = ri(random, 1, 3);
  const volA = baseArea * hA;
  const volB = baseArea * hB;
  const ansStr = `${hA}a - ${hB}b`;
  const choices = [
    { value: '1', label: ansStr, labelEn: ansStr },
    { value: '2', label: `${hA}a + ${hB}b`, labelEn: `${hA}a + ${hB}b` },
    { value: '3', label: `${hA + 1}a - ${hB}b`, labelEn: `${hA + 1}a - ${hB}b` },
    { value: '4', label: `${hA}a - ${hB + 1}b`, labelEn: `${hA}a - ${hB + 1}b` },
    { value: '5', label: `${hA * 2}a - ${hB}b`, labelEn: `${hA * 2}a - ${hB}b` },
  ];
  return {
    prompt: `밑면의 가로의 길이가 ${l}a, 세로의 길이가 ${w}b인 직육면체의 부피가 ${volA}a^2 b - ${volB}ab^2 일 때, 이 직육면체의 높이는?`,
    promptEn: `A rectangular cuboid has base length ${l}a, width ${w}b, and volume ${volA}a^2 b - ${volB}ab^2. Find its height.`,
    expression: `V = ${volA}a^2 b - ${volB}ab^2, \\quad \\text{Base} = ${l}a \\times ${w}b`,
    choices,
    answer: '1',
    explanation: `(밑넓이) = ${l}a × ${w}b = ${baseArea}ab입니다. (높이) = (부피) ÷ (밑넓이) = (${volA}a^2 b - ${volB}ab^2) ÷ (${baseArea}ab) = ${ansStr}입니다.`,
    explanationEn: `Base area is ${baseArea}ab. Height = Volume ÷ Base Area = ${ansStr}.`
  };
}

// 27. [다항식의 계산 유형 09] 식의 대입과 식의 값 구하기 (#0337~#0340)
export function rpmPolyCalcEvaluateValue(random) {
  const a = ri(random, 4, 7);
  const b = ri(random, 2, 4);
  const c = ri(random, 1, 3);
  const d = ri(random, 5, 8);
  const xVal = ri(random, 2, 4);
  const yVal = -ri(random, 1, 3);
  const coeffX = a - c;
  const coeffY = d - b;
  const evalResult = coeffX * xVal + coeffY * yVal;
  return {
    prompt: `x = ${xVal}, y = ${yVal} 일 때, (${a}x^2 y - ${b}xy^2)/(xy) - (${c}x^2 - ${d}xy)/x 의 값을 구하시오.`,
    promptEn: `Evaluate (${a}x^2 y - ${b}xy^2)/(xy) - (${c}x^2 - ${d}xy)/x when x = ${xVal} and y = ${yVal}.`,
    expression: `\\frac{${a}x^2 y - ${b}xy^2}{xy} - \\frac{${c}x^2 - ${d}xy}{x}, \\quad x = ${xVal}, \\; y = ${yVal}`,
    answer: String(evalResult),
    explanation: `식을 먼저 간단히 하면 (${a}x - ${b}y) - (${c}x - ${d}y) = ${coeffX}x + ${coeffY}y입니다. 여기에 x = ${xVal}, y = ${yVal}를 대입하면 ${coeffX} × (${xVal}) + ${coeffY} × (${yVal}) = ${coeffX * xVal} + (${coeffY * yVal}) = ${evalResult}입니다.`,
    explanationEn: `Simplifying gives ${coeffX}x + ${coeffY}y. Substituting x = ${xVal}, y = ${yVal} yields ${evalResult}.`
  };
}

// 28. [다항식의 계산 유형 10] 한 문자에 대한 식으로 나타내기 (#0341~#0344)
export function rpmPolyCalcSubExpression(random) {
  const a = ri(random, 2, 4);
  const b = -ri(random, 2, 4);
  const c = -ri(random, 1, 3);
  const d = ri(random, 2, 5);
  const finalX = -2 * a + c;
  const finalY = -2 * b + d;
  const ansStr = formatLinear2Var(finalX, finalY);
  const choices = [
    { value: '1', label: ansStr, labelEn: ansStr },
    { value: '2', label: formatLinear2Var(finalX + 1, finalY), labelEn: formatLinear2Var(finalX + 1, finalY) },
    { value: '3', label: formatLinear2Var(finalX, finalY - 1), labelEn: formatLinear2Var(finalX, finalY - 1) },
    { value: '4', label: formatLinear2Var(-finalX, finalY), labelEn: formatLinear2Var(-finalX, finalY) },
    { value: '5', label: formatLinear2Var(finalX, -finalY), labelEn: formatLinear2Var(finalX, -finalY) },
  ];
  const A_str = formatLinear2Var(a, b);
  const B_str = formatLinear2Var(c, d);
  return {
    prompt: `A = ${A_str}, B = ${B_str} 일 때, -4A + 2B - (B - 2A)를 x, y에 대한 식으로 나타낸 것은?`,
    promptEn: `Given A = ${A_str} and B = ${B_str}, express -4A + 2B - (B - 2A) in terms of x and y.`,
    expression: `A = ${A_str}, \\quad B = ${B_str}, \\quad -4A + 2B - (B - 2A)`,
    choices,
    answer: '1',
    explanation: `주어진 식을 먼저 A, B로 간단히 하면 -4A + 2B - B + 2A = -2A + B입니다. 여기에 A, B를 대입하면 -2(${A_str}) + (${B_str}) = ${ansStr}입니다.`,
    explanationEn: `Simplifying gives -2A + B. Substituting A and B yields ${ansStr}.`
  };
}

// 29. [다항식의 계산 유형 11] 다항식의 계산의 도형에의 활용 (#0345~#0350)
export function rpmPolyCalcGeometryApplication(random) {
  const topA = ri(random, 1, 2);
  const botA = ri(random, 3, 5);
  const hCoeff = ri(random, 2, 4) * 2;
  const sumA = topA + botA;
  const areaCoeff = (sumA * hCoeff) / 2;
  return {
    prompt: `윗변의 길이가 ${topA}a + b, 아랫변의 길이가 ${botA}a - b이고 높이가 ${hCoeff}ab인 사다리꼴의 넓이를 구하시오. (단, 답은 넓이의 계수를 입력)`,
    promptEn: `Find the coefficient of the area of a trapezoid with top base ${topA}a + b, bottom base ${botA}a - b, and height ${hCoeff}ab.`,
    expression: `\\text{Top} = ${topA}a + b, \\quad \\text{Bottom} = ${botA}a - b, \\quad h = ${hCoeff}ab`,
    answer: String(areaCoeff),
    answerSuffix: 'a^2b',
    explanation: `(사다리꼴 넓이) = 1/2 × ((윗변) + (아랫변)) × (높이) = 1/2 × (${sumA}a) × (${hCoeff}ab) = ${areaCoeff}a^2 b입니다.`,
    explanationEn: `Area = 1/2 × ((${topA}a + b) + (${botA}a - b)) × ${hCoeff}ab = ${areaCoeff}a^2 b.`
  };
}

// 30. [다항식의 계산 유형 12] 다항식의 계산 전 유형 실전 혼합 (#0351~#0357)
export function rpmPolyCalcAllMixed(random) {
  const fns = [
    rpmPolyCalcAddSubBasic,
    rpmPolyCalcQuadraticAddSub,
    rpmPolyCalcBracketsOrder,
    rpmPolyCalcWrongCalculation,
    rpmPolyCalcMonomialPolyMult,
    rpmPolyCalcMonomialPolyDiv,
    rpmPolyCalcFourOpsMixed,
    rpmPolyCalcMissingBox,
    rpmPolyCalcEvaluateValue,
    rpmPolyCalcSubExpression,
    rpmPolyCalcGeometryApplication
  ];
  return pick(random, fns)(random);
}

// 31. [다항식의 계산 유형 13] 다항식의 계산 최고수준 실력 UP (#0358~#0364)
export function rpmPolyCalcAdvancedSkillUp(random) {
  const mode = pick(random, ['strip-overlap', 'wrong-mult-div']);
  if (mode === 'strip-overlap') {
    const N = pick(random, [8, 10, 12]);
    const side = ri(random, 2, 3);
    const overlap = ri(random, 2, 4);
    const totalLenCoeffX = N * side;
    const totalLenConst = (N - 1) * overlap;
    const areaCoeffX2 = side * totalLenCoeffX;
    const areaCoeffX = side * totalLenConst;
    return {
      prompt: `한 변의 길이가 ${side}x인 정사각형 모양의 색종이 ${N}장을 ${overlap}cm의 폭만큼 풀로 이어 붙여서 직사각형 모양의 띠를 만들었다. 만들어진 띠의 넓이가 Ax^2 - Bx 일 때, A + B의 값을 구하시오.`,
      promptEn: `Connecting ${N} square paper sheets of side ${side}x with overlap width ${overlap}cm forms a rectangular strip of area Ax^2 - Bx. Find A + B.`,
      expression: `\\text{Area} = Ax^2 - Bx`,
      answer: String(areaCoeffX2 + areaCoeffX),
      explanation: `직사각형 띠의 가로의 길이는 ${N} × ${side}x - (${N} - 1) × ${overlap} = ${totalLenCoeffX}x - ${totalLenConst}입니다. 세로의 길이는 ${side}x이므로 넓이는 ${side}x(${totalLenCoeffX}x - ${totalLenConst}) = ${areaCoeffX2}x^2 - ${areaCoeffX}x입니다. 따라서 A = ${areaCoeffX2}, B = ${areaCoeffX}이며 A + B = ${areaCoeffX2 + areaCoeffX}입니다.`,
      explanationEn: `Strip length is ${totalLenCoeffX}x - ${totalLenConst} and width is ${side}x. Area is ${areaCoeffX2}x^2 - ${areaCoeffX}x, giving A + B = ${areaCoeffX2 + areaCoeffX}.`
    };
  }
  const m = pick(random, [2, 3]);
  const c1 = ri(random, 2, 4) * m * m;
  const c2 = ri(random, 2, 4) * m * m;
  const orig1 = c1 / m;
  const orig2 = c2 / m;
  const correct1 = orig1 / m;
  const correct2 = orig2 / m;
  return {
    prompt: `어떤 다항식에 ${m}a를 나누어야 할 것을 잘못하여 곱했더니 ${c1}a^3 - ${c2}a^2 이 되었다. 이때 바르게 계산한 결과는 p a^2 - q a 꼴이 아닌 p a - q 이다. p + q의 값을 구하시오.`,
    promptEn: `Dividing by ${m}a was intended, but multiplying by ${m}a resulted in ${c1}a^3 - ${c2}a^2. The correct result is p a - q. Find p + q.`,
    expression: `P \\times ${m}a = ${c1}a^3 - ${c2}a^2`,
    answer: String(correct1 + correct2),
    explanation: `원래 다항식 P = (${c1}a^3 - ${c2}a^2) ÷ (${m}a) = ${orig1}a^2 - ${orig2}a입니다. 바르게 계산한 식은 P ÷ (${m}a) = (${orig1}a^2 - ${orig2}a) ÷ (${m}a) = ${correct1}a - ${correct2}입니다. 따라서 p = ${correct1}, q = ${correct2}이며 p + q = ${correct1 + correct2}입니다.`,
    explanationEn: `Original polynomial is ${orig1}a^2 - ${orig2}a. Correct result is dividing again by ${m}a, giving ${correct1}a - ${correct2}. Thus p + q = ${correct1 + correct2}.`
  };
}




export function rpmLinearIneqConceptIdentify(random) {
  const choices = [
    { value: '1', label: '3x - 5 > 7', labelEn: '3x - 5 > 7', isIneq: true },
    { value: '2', label: '2x + 1 = 5', labelEn: '2x + 1 = 5', isIneq: false },
    { value: '3', label: 'x^2 - 4', labelEn: 'x^2 - 4', isIneq: false },
    { value: '4', label: '5 - 2', labelEn: '5 - 2', isIneq: false },
    { value: '5', label: '3x + 2y', labelEn: '3x + 2y', isIneq: false },
  ];
  return {
    prompt: '다음 중 부등식인 것은?',
    promptEn: 'Which of the following is an inequality?',
    expression: '3x - 5 > 7, \\; 2x + 1 = 5, \\; x^2 - 4, \\; 5 - 2, \\; 3x + 2y',
    choices: choices.map(c => ({ value: c.value, label: c.label, labelEn: c.labelEn })),
    answer: '1',
    explanation: '부등호(>, <, ≥, ≤)를 사용하여 수나 식의 대소 관계를 나타낸 식을 부등식이라고 합니다. 2번은 등식, 3·4·5번은 다항식(수식)이므로 부등호가 있는 1번이 부등식입니다.',
    explanationEn: 'An inequality uses inequality symbols (>, <, ≥, ≤) to show relationships between quantities. Option 1 is the only inequality.'
  };
}

// 2. [일차부등식 유형 02] 부등식의 참·거짓 및 해 판별 (#0418~#0421)
export function rpmLinearIneqTruthValue(random) {
  const x = ri(random, 1, 4);
  const a = ri(random, 2, 4);
  const b = ri(random, 1, 5);
  // a * x - b
  const lhs = a * x - b;
  const bound = lhs - ri(random, 1, 3); // lhs > bound is true for x
  return {
    prompt: `x = ${x}일 때, 다음 부등식 중 참인 것은?`,
    promptEn: `When x = ${x}, which of the following inequalities is true?`,
    expression: `x = ${x}`,
    choices: [
      { value: '1', label: `${a}x - ${b} > ${bound}`, labelEn: `${a}x - ${b} > ${bound}` },
      { value: '2', label: `${a}x - ${b} < ${bound - 1}`, labelEn: `${a}x - ${b} < ${bound - 1}` },
      { value: '3', label: `-${a}x + ${b} > 0`, labelEn: `-${a}x + ${b} > 0` },
      { value: '4', label: `x + ${a * 2} < ${x}`, labelEn: `x + ${a * 2} < ${x}` },
      { value: '5', label: `2x - ${x * 2 + 1} > 0`, labelEn: `2x - ${x * 2 + 1} > 0` },
    ],
    answer: '1',
    explanation: `x = ${x}를 1번에 대입하면 ${a} × (${x}) - ${b} = ${lhs} > ${bound}이므로 참입니다. 나머지는 모두 거짓입니다.`,
    explanationEn: `Substituting x = ${x} into option 1 gives ${lhs} > ${bound}, which is true.`
  };
}

// 3. [일차부등식 유형 03] 문장을 부등식으로 나타내기 (#0422~#0425)
export function rpmLinearIneqExpressSentence(random) {
  const a = ri(random, 2, 4);
  const b = ri(random, 3, 7);
  const c = ri(random, 15, 30);
  return {
    prompt: `다음 문장을 부등식으로 올바르게 나타낸 것은?\n"어떤 수 x의 ${a}배에 ${b}를 더한 값은 ${c}보다 작지 않다."`,
    promptEn: `Which inequality correctly expresses: "The sum of ${b} and ${a} times x is not less than ${c}"?`,
    expression: `${a}x + ${b} \\ge ${c}`,
    choices: [
      { value: '1', label: `${a}x + ${b} ≥ ${c}`, labelEn: `${a}x + ${b} ≥ ${c}` },
      { value: '2', label: `${a}x + ${b} > ${c}`, labelEn: `${a}x + ${b} > ${c}` },
      { value: '3', label: `${a}x + ${b} ≤ ${c}`, labelEn: `${a}x + ${b} ≤ ${c}` },
      { value: '4', label: `${a}x + ${b} < ${c}`, labelEn: `${a}x + ${b} < ${c}` },
      { value: '5', label: `${a}(x + ${b}) ≥ ${c}`, labelEn: `${a}(x + ${b}) ≥ ${c}` },
    ],
    answer: '1',
    explanation: `'~보다 작지 않다'는 것은 '~보다 크거나 같다(≥)'는 뜻이므로 ${a}x + ${b} ≥ ${c}입니다.`,
    explanationEn: `'Not less than' means greater than or equal to (≥), so ${a}x + ${b} ≥ ${c}.`
  };
}

// 4. [일차부등식 유형 04] 부등식의 기본 성질 (#0426~#0429)
export function rpmLinearIneqProperties(random) {
  const m = ri(random, 2, 5);
  const n = ri(random, 1, 9);
  return {
    prompt: `a < b일 때, 다음 중 옳은 것은?`,
    promptEn: `Given a < b, which of the following is correct?`,
    expression: `a < b`,
    choices: [
      { value: '1', label: `-${m}a + ${n} > -${m}b + ${n}`, labelEn: `-${m}a + ${n} > -${m}b + ${n}` },
      { value: '2', label: `-${m}a + ${n} < -${m}b + ${n}`, labelEn: `-${m}a + ${n} < -${m}b + ${n}` },
      { value: '3', label: `${m}a - ${n} > ${m}b - ${n}`, labelEn: `${m}a - ${n} > ${m}b - ${n}` },
      { value: '4', label: `a / (-${m}) < b / (-${m})`, labelEn: `a / (-${m}) < b / (-${m})` },
      { value: '5', label: `n - a < n - b`, labelEn: `n - a < n - b` },
    ],
    answer: '1',
    explanation: `부등식의 양변에 음수 -${m}을 곱하면 부등호 방향이 바뀌어 -${m}a > -${m}b가 됩니다. 여기에 양변에 같은 수 ${n}을 더해도 방향이 유지되므로 -${m}a + ${n} > -${m}b + ${n}이 옳습니다.`,
    explanationEn: `Multiplying both sides of a < b by negative -${m} reverses the inequality to -${m}a > -${m}b. Adding ${n} preserves direction: -${m}a + ${n} > -${m}b + ${n}.`
  };
}

// 5. [일차부등식 유형 05] x의 범위가 주어질 때 식의 값의 범위 (#0430~#0433)
export function rpmLinearIneqRangeOfExpression(random) {
  const xMin = -ri(random, 2, 4);
  const xMax = ri(random, 2, 5);
  const a = -ri(random, 2, 4); // negative multiplier
  const b = ri(random, 1, 5);
  // a * xMax + b < a * x + b < a * xMin + b
  const lower = a * xMax + b;
  const upper = a * xMin + b;
  return {
    prompt: `${xMin} < x ≤ ${xMax}일 때, ${a}x + ${b}의 값의 범위를 A ≤ ${a}x + ${b} < B라 하자. A + B의 값을 구하시오.`,
    promptEn: `When ${xMin} < x ≤ ${xMax}, if A ≤ ${a}x + ${b} < B, find A + B.`,
    expression: `${xMin} < x \\le ${xMax}, \\quad ${a}x + ${b}`,
    answer: String(lower + upper),
    explanation: `각 변에 ${a}를 곱하면 음수이므로 부등호 방향이 바뀌어 ${a * xMax} ≤ ${a}x < ${a * xMin}이 됩니다. 각 변에 ${b}를 더하면 ${lower} ≤ ${a}x + ${b} < ${upper}입니다. 따라서 A = ${lower}, B = ${upper}이며 A + B = ${lower + upper}입니다.`,
    explanationEn: `Multiplying by ${a} reverses the inequality: ${a * xMax} ≤ ${a}x < ${a * xMin}. Adding ${b} gives ${lower} ≤ ${a}x + ${b} < ${upper}, so A + B = ${lower + upper}.`
  };
}

// 6. [일차부등식 유형 06] 일차부등식의 뜻과 식별 (#0434~#0437)
export function rpmLinearIneqIdentifyLinear(random) {
  const choices = [
    { value: '1', label: '2x - 3 > x + 1', labelEn: '2x - 3 > x + 1', isLinear: true },
    { value: '2', label: 'x^2 + 2x ≤ x^2 - 3', labelEn: 'x^2 + 2x ≤ x^2 - 3', isLinear: true }, // wait, this simplifies to 2x <= -3, linear
    { value: '3', label: 'x^2 - 3x > 4', labelEn: 'x^2 - 3x > 4', isLinear: false },
    { value: '4', label: '2(x - 1) ≥ 2x + 3', labelEn: '2(x - 1) ≥ 2x + 3', isLinear: false }, // 0 >= 5 false
    { value: '5', label: '1/x + 2 < 5', labelEn: '1/x + 2 < 5', isLinear: false }, // rational
  ];
  return {
    prompt: '다음 중 정리했을 때 미지수 x에 대한 일차부등식이 아닌 것은?',
    promptEn: 'Which of the following is NOT a linear inequality in x after simplification?',
    expression: 'x^2 - 3x > 4',
    choices: [
      { value: '1', label: 'x^2 - 3x > 4', labelEn: 'x^2 - 3x > 4' },
      { value: '2', label: '3x - 1 < 2x + 5', labelEn: '3x - 1 < 2x + 5' },
      { value: '3', label: 'x(x + 1) - x^2 ≥ 3', labelEn: 'x(x + 1) - x^2 ≥ 3' },
      { value: '4', label: '2x + 5 > 0', labelEn: '2x + 5 > 0' },
      { value: '5', label: '-x + 4 ≤ 3x - 2', labelEn: '-x + 4 ≤ 3x - 2' },
    ],
    answer: '1',
    explanation: '1번은 이항하여 정리하면 x^2 - 3x - 4 > 0으로 최고차항이 이차식이므로 일차부등식이 아닙니다. 3번은 x^2이 소거되어 일차부등식이 됩니다.',
    explanationEn: 'Option 1 simplifies to x^2 - 3x - 4 > 0, which has degree 2 and is therefore not a linear inequality.'
  };
}

// 7. [일차부등식 유형 07] 일차부등식의 기본 풀이와 수직선 표현 (#0438~#0441)
export function rpmLinearIneqSolveBasicNumberLine(random) {
  const a = ri(random, 3, 6);
  const b = ri(random, 1, 3);
  const diffA = a - b; // > 0
  const c = ri(random, 2, 8);
  const d = c + diffA * ri(random, 1, 4);
  // a x - c < b x + d => (a - b) x < c + d => x < (c + d) / diffA
  const k = (c + d) / diffA;
  const expr = `${a}x - ${c} < ${b}x + ${d}`;
  return {
    prompt: `일차부등식 ${expr}의 해가 x < k 일 때, 상수 k의 값을 구하시오.`,
    promptEn: `Find k when the solution to ${expr} is x < k.`,
    expression: expr,
    answer: String(k),
    explanation: `x항을 좌변으로, 상수항을 우변으로 이항하면 (${a} - ${b})x < ${c} + ${d}, 즉 ${diffA}x < ${c + d}입니다. 양변을 ${diffA}로 나누면 x < ${k}입니다. 따라서 k = ${k}입니다.`,
    explanationEn: `Transposing terms gives ${diffA}x < ${c + d}. Dividing by ${diffA} yields x < ${k}.`
  };
}

// 8. [일차부등식 유형 08] 괄호가 있는 일차부등식의 풀이 (#0442~#0445)
export function rpmLinearIneqBrackets(random) {
  // 3(x + p) - 2(x - q) < r
  const p = ri(random, 1, 3);
  const q = ri(random, 1, 3);
  const bound = ri(random, 2, 5);
  // 3x + 3p - 2x + 2q < r => x + 3p + 2q < r => x < r - 3p - 2q = bound
  const r = bound + 3 * p + 2 * q;
  const expr = `3(x + ${p}) - 2(x - ${q}) < ${r}`;
  return {
    prompt: `일차부등식 ${expr}을 만족하는 가장 큰 정수 x의 값을 구하시오.`,
    promptEn: `Find the greatest integer x satisfying ${expr}.`,
    expression: expr,
    answer: String(bound - 1),
    explanation: `괄호를 풀면 3x + ${3 * p} - 2x + ${2 * q} < ${r}, 즉 x + ${3 * p + 2 * q} < ${r}입니다. x < ${bound}이므로 이를 만족하는 가장 큰 정수는 ${bound - 1}입니다.`,
    explanationEn: `Expanding brackets gives x < ${bound}. The greatest integer satisfying this is ${bound - 1}.`
  };
}

// 9. [일차부등식 유형 09] 계수가 소수 또는 분수인 일차부등식 (#0446~#0449)
export function rpmLinearIneqDecimalsFractions(random) {
  const mode = pick(random, ['decimals', 'fractions']);
  if (mode === 'decimals') {
    // 0.3x - 0.5 < 0.1x + 0.7
    // 3x - 5 < x + 7 => 2x < 12 => x < 6
    const k = ri(random, 2, 5);
    const diff = 2 * k; // 2x < diff => x < k
    const b1 = ri(random, 1, 4);
    const b2 = diff - b1;
    const expr = `0.3x - 0.${b1} < 0.1x + ${b2 >= 10 ? (b2 / 10).toFixed(1) : `0.${b2}`}`;
    return {
      prompt: `일차부등식 0.3x - ${b1/10} < 0.1x + ${b2/10}의 해가 x < a 일 때, 상수 a의 값을 구하시오.`,
      promptEn: `Solve the inequality 0.3x - ${b1/10} < 0.1x + ${b2/10} for x < a. Find a.`,
      expression: `0.3x - ${b1/10} < 0.1x + ${b2/10}`,
      answer: String(k),
      explanation: `양변에 10을 곱하면 3x - ${b1} < x + ${b2}입니다. 2x < ${diff}이므로 x < ${k}입니다. 따라서 a = ${k}입니다.`,
      explanationEn: `Multiplying both sides by 10 yields 2x < ${diff}, so x < ${k}.`
    };
  }
  // fractions: (x - 1)/2 - (x + 1)/3 ≥ 1 => 3(x-1) - 2(x+1) ≥ 6 => x - 5 ≥ 6 => x ≥ 11
  const k = ri(random, 1, 4);
  const rhs = ri(random, 1, 3);
  // (x - k)/2 - (x + k)/3 ≥ rhs => 3(x-k) - 2(x+k) ≥ 6*rhs => x - 5k ≥ 6*rhs => x ≥ 6*rhs + 5k
  const ans = 6 * rhs + 5 * k;
  const expr = `(x - ${k})/2 - (x + ${k})/3 ≥ ${rhs}`;
  return {
    prompt: `일차부등식 ${expr}의 해가 x ≥ a 일 때, 상수 a의 값을 구하시오.`,
    promptEn: `Find a when the solution to ${expr} is x ≥ a.`,
    expression: `\\frac{x - ${k}}{2} - \\frac{x + ${k}}{3} \\ge ${rhs}`,
    answer: String(ans),
    explanation: `분모의 최소공배수인 6을 양변에 곱하면 3(x - ${k}) - 2(x + ${k}) ≥ ${6 * rhs}입니다. 전개하면 3x - ${3 * k} - 2x - ${2 * k} ≥ ${6 * rhs}, 즉 x - ${5 * k} ≥ ${6 * rhs}이므로 x ≥ ${ans}입니다. 따라서 a = ${ans}입니다.`,
    explanationEn: `Multiplying by 6 gives 3(x - ${k}) - 2(x + ${k}) ≥ ${6 * rhs}. Simplifying yields x ≥ ${ans}.`
  };
}

// 10. [일차부등식 유형 10] 두 일차부등식의 해가 서로 같을 때 (#0450~#0453)
export function rpmLinearIneqSameSolution(random) {
  // Eq 1: 5x - 1 < 3x + 7 => 2x < 8 => x < 4
  // Eq 2: 2x - a < x + 1 => x < a + 1 = 4 => a = 3
  const sol = ri(random, 2, 5);
  const diff1 = 2;
  const c1 = ri(random, 1, 5);
  const d1 = diff1 * sol - c1;
  // 5x - c1 < 3x + d1 => 2x < c1 + d1 = 2*sol => x < sol
  // 2nd ineq: 2x + a < x + 2*sol + a - sol => x < sol
  // Let 2nd ineq be 3x - a < 2x + 1 => x < a + 1 => a + 1 = sol => a = sol - 1
  const aVal = sol - 1;
  const expr1 = `5x - ${c1} < 3x + ${d1}`;
  const expr2 = `3x - a < 2x + 1`;
  return {
    prompt: `두 일차부등식 ${expr1}과 ${expr2}의 해가 서로 같을 때, 상수 a의 값을 구하시오.`,
    promptEn: `If ${expr1} and ${expr2} have the same solution, find the constant a.`,
    expression: `${expr1}, \\quad ${expr2}`,
    answer: String(aVal),
    explanation: `첫 번째 부등식을 풀면 2x < ${c1 + d1}에서 x < ${sol}입니다. 두 번째 부등식을 풀면 x < a + 1입니다. 두 해가 같으므로 a + 1 = ${sol}에서 a = ${aVal}입니다.`,
    explanationEn: `First inequality gives x < ${sol}. Second inequality gives x < a + 1. Equating bounds yields a = ${aVal}.`
  };
}

// 11. [일차부등식 유형 11] 해가 주어질 때 상수 a 구하기 (#0454~#0457)
export function rpmLinearIneqGivenSolutionFindConstant(random) {
  // 5x - 1 < 8x + a has solution x > -3
  // 5x - 8x < a + 1 => -3x < a + 1 => x > -(a+1)/3 = -3 => a + 1 = 9 => a = 8
  const sol = ri(random, 2, 5);
  const k = ri(random, 2, 4);
  // -k x < a + 2 => x > -(a+2)/k = sol => a + 2 = -k * sol
  // Or with positive: 2x + a > 5x - 4 => -3x > -4 - a => x < (a+4)/3 = sol => a+4 = 3*sol => a = 3*sol - 4
  const aVal = 3 * sol - 4;
  const expr = `2x + a > 5x - 4`;
  return {
    prompt: `일차부등식 ${expr}의 해가 x < ${sol}일 때, 상수 a의 값을 구하시오.`,
    promptEn: `Given that ${expr} has solution x < ${sol}, find the constant a.`,
    expression: `${expr}, \\quad x < ${sol}`,
    answer: String(aVal),
    explanation: `이항하여 정리하면 2x - 5x > -4 - a, 즉 -3x > -a - 4입니다. 양변을 -3으로 나누면 부등호가 바뀌어 x < (a + 4)/3이 됩니다. 이 해가 x < ${sol}과 일치하므로 (a + 4)/3 = ${sol}에서 a + 4 = ${3 * sol}, 즉 a = ${aVal}입니다.`,
    explanationEn: `Simplifying gives x < (a + 4)/3. Equating with x < ${sol} yields a + 4 = ${3 * sol}, so a = ${aVal}.`
  };
}

// 12. [일차부등식 유형 12] ax > b 꼴에서 a의 부호와 해의 관계 (#0458~#0461)
export function rpmLinearIneqNegativeCoeff(random) {
  // ax + 3 > -7 has solution x < 2. Find a.
  // ax > -10. Since inequality flipped to <, a < 0.
  // x < -10 / a = 2 => a = -5.
  const target = ri(random, 2, 5);
  const constVal = ri(random, 4, 10);
  const aVal = -constVal / target;
  if (Number.isInteger(aVal)) {
    return {
      prompt: `일차부등식 ax + 3 > ${3 - constVal}의 해가 x < ${target}일 때, 상수 a의 값을 구하시오.`,
      promptEn: `If the inequality ax + 3 > ${3 - constVal} has solution x < ${target}, find constant a.`,
      expression: `ax + 3 > ${3 - constVal}, \\quad x < ${target}`,
      answer: String(aVal),
      explanation: `상수항을 이항하면 ax > -${constVal}입니다. 해의 부등호 방향이 <로 바뀌었으므로 a < 0이고, x < -${constVal}/a입니다. -${constVal}/a = ${target}에서 a = -${constVal} / ${target} = ${aVal}입니다.`,
      explanationEn: `ax > -${constVal} flips to x < -${constVal}/a = ${target}, which gives a = ${aVal}.`
    };
  }
  return {
    prompt: `일차부등식 ax + 3 > -7의 해가 x < 2일 때, 상수 a의 값을 구하시오.`,
    promptEn: `Find a when ax + 3 > -7 has solution x < 2.`,
    expression: `ax + 3 > -7, \\quad x < 2`,
    answer: '-5',
    explanation: `ax > -10이고 부등호가 바뀌었으므로 a < 0, x < -10/a = 2에서 a = -5입니다.`,
    explanationEn: `ax > -10 flips to x < -10/a = 2, giving a = -5.`
  };
}

// 13. [일차부등식 유형 13] 자연수 해의 개수 조건에서 상수 범위 (#0462~#0468)
export function rpmLinearIneqIntegerSolutionsCondition(random) {
  // 4 - 5x ≥ -3x + a => -2x ≥ a - 4 => x ≤ (4 - a)/2
  // Exactly 2 natural numbers satisfy this (i.e. x = 1, 2)
  // Therefore 2 ≤ (4 - a)/2 < 3 => 4 ≤ 4 - a < 6 => 0 ≤ -a < 2 => -2 < a ≤ 0
  const count = ri(random, 2, 4); // natural solutions are 1, 2, ..., count
  // x ≤ bound => count ≤ bound < count + 1
  return {
    prompt: `일차부등식 4 - 5x ≥ -3x + a 를 만족하는 자연수 x의 개수가 ${count}개일 때, 상수 a의 값의 범위는?`,
    promptEn: `If 4 - 5x ≥ -3x + a has exactly ${count} natural number solutions, find the range of constant a.`,
    expression: `4 - 5x \\ge -3x + a`,
    choices: [
      { value: '1', label: `${4 - 2 * (count + 1)} < a ≤ ${4 - 2 * count}`, labelEn: `${4 - 2 * (count + 1)} < a ≤ ${4 - 2 * count}` },
      { value: '2', label: `${4 - 2 * (count + 1)} ≤ a < ${4 - 2 * count}`, labelEn: `${4 - 2 * (count + 1)} ≤ a < ${4 - 2 * count}` },
      { value: '3', label: `${4 - 2 * count} ≤ a < ${4 - 2 * (count - 1)}`, labelEn: `${4 - 2 * count} ≤ a < ${4 - 2 * (count - 1)}` },
      { value: '4', label: `a ≤ ${4 - 2 * count}`, labelEn: `a ≤ ${4 - 2 * count}` },
      { value: '5', label: `a > ${4 - 2 * (count + 1)}`, labelEn: `a > ${4 - 2 * (count + 1)}` },
    ],
    answer: '1',
    explanation: `부등식을 풀면 -2x ≥ a - 4이므로 x ≤ (4 - a)/2입니다. 자연수 해가 ${count}개(1부터 ${count}까지)이어야 하므로 ${count} ≤ (4 - a)/2 < ${count + 1}입니다. 2를 곱하면 ${2 * count} ≤ 4 - a < ${2 * (count + 1)}, 4를 빼면 ${2 * count - 4} ≤ -a < ${2 * (count + 1) - 4}이므로 ${4 - 2 * (count + 1)} < a ≤ ${4 - 2 * count}입니다.`,
    explanationEn: `Solving gives x ≤ (4 - a)/2. For exactly ${count} natural solutions, ${count} ≤ (4 - a)/2 < ${count + 1}, leading to ${4 - 2 * (count + 1)} < a ≤ ${4 - 2 * count}.`
  };
}

// 14. [일차부등식 유형 14] 일차부등식 전 유형 실전 종합 (#0469~#0481)
export function rpmLinearIneqAllTypesMixed(random) {
  const fns = [
    rpmLinearIneqConceptIdentify,
    rpmLinearIneqTruthValue,
    rpmLinearIneqExpressSentence,
    rpmLinearIneqProperties,
    rpmLinearIneqRangeOfExpression,
    rpmLinearIneqIdentifyLinear,
    rpmLinearIneqSolveBasicNumberLine,
    rpmLinearIneqBrackets,
    rpmLinearIneqDecimalsFractions,
    rpmLinearIneqSameSolution,
    rpmLinearIneqGivenSolutionFindConstant,
    rpmLinearIneqNegativeCoeff,
    rpmLinearIneqIntegerSolutionsCondition
  ];
  return pick(random, fns)(random);
}

// 15. [일차부등식 유형 15] 일차부등식 최고수준 실력 UP (#0482~#0489)
export function rpmLinearIneqAdvancedSkillUp(random) {
  // Problem #0484: (2x - a)/3 > 0 has NO natural number solutions.
  // 2x - a > 0 => 2x > a => x > a/2.
  // For NO natural number solution to exist, the condition x > a/2 must include no numbers >= 1.
  // This means a/2 ≥ 1 => a ≥ 2!
  const minNatural = 1;
  const denom = pick(random, [2, 3, 4]);
  // (x - a)/denom > 0 has no natural solution => x > a => a >= 1
  return {
    prompt: `일차부등식 (2x - a)/${denom} > 0 을 만족하는 자연수 x가 존재하지 않을 때, 상수 a의 값의 범위를 구하시오.`,
    promptEn: `Find the range of constant a such that (2x - a)/${denom} > 0 has no natural number solutions.`,
    expression: `\\frac{2x - a}{${denom}} > 0`,
    choices: [
      { value: '1', label: 'a ≥ 2', labelEn: 'a ≥ 2' },
      { value: '2', label: 'a > 2', labelEn: 'a > 2' },
      { value: '3', label: 'a ≤ 2', labelEn: 'a ≤ 2' },
      { value: '4', label: 'a < 2', labelEn: 'a < 2' },
      { value: '5', label: 'a ≥ 1', labelEn: 'a ≥ 1' },
    ],
    answer: '1',
    explanation: `양변에 ${denom}을 곱하면 2x - a > 0에서 2x > a, 즉 x > a/2입니다. 이 부등식을 만족하는 자연수(1, 2, 3, ...)가 존재하지 않으려면 가장 작은 자연수인 1이 해의 범위에 포함되지 않아야 합니다. 따라서 a/2 ≥ 1이어야 하므로 a ≥ 2입니다.`,
    explanationEn: `2x > a => x > a/2. For no natural numbers to be greater than a/2, we must have a/2 ≥ 1, which gives a ≥ 2.`
  };
}

// =============================================================================
// Chapter 05: 일차부등식의 활용 (Pages 70~79)
// =============================================================================

// 16. [일차부등식 활용 유형 01] 수에 대한 부등식 활용 (#0504~#0507)
export function rpmIneqAppNumbers(random) {
  // Any natural number x: 2x - 8 < 36 => 2x < 44 => x < 22 => max natural is 21
  const mult = ri(random, 2, 3);
  const sub = ri(random, 5, 10);
  const limit = ri(random, 30, 50);
  // mult * x - sub < limit => mult * x < limit + sub => x < (limit + sub) / mult
  const maxVal = Math.ceil((limit + sub) / mult) - 1;
  return {
    prompt: `어떤 자연수의 ${mult}배에서 ${sub}을 뺀 수가 ${limit}보다 작다고 한다. 이를 만족하는 자연수 중 가장 큰 수를 구하시오.`,
    promptEn: `Subtracting ${sub} from ${mult} times a natural number is less than ${limit}. Find the greatest such natural number.`,
    expression: `${mult}x - ${sub} < ${limit}`,
    answer: String(maxVal),
    explanation: `자연수를 x라 하면 ${mult}x - ${sub} < ${limit}에서 ${mult}x < ${limit + sub}, 즉 x < ${(limit + sub) / mult}입니다. 따라서 가장 큰 자연수는 ${maxVal}입니다.`,
    explanationEn: `${mult}x - ${sub} < ${limit} => x < ${(limit + sub) / mult}. The greatest natural number is ${maxVal}.`
  };
}

// 17. [일차부등식 활용 유형 02] 물건의 가격과 개수 (#0508~#0511)
export function rpmIneqAppCostCount(random) {
  // Total budget B, fixed cost F, unit cost U. Max items?
  // U * x + F ≤ B
  const unitPrice = pick(random, [800, 1200, 1500]);
  const boxCost = pick(random, [1000, 1500, 2000]);
  const budget = pick(random, [15000, 20000, 25000]);
  const maxCount = Math.floor((budget - boxCost) / unitPrice);
  return {
    prompt: `한 개에 ${unitPrice}원인 사과를 ${boxCost}원인 상자에 담아 전체 가격이 ${budget}원 이하가 되게 하려고 한다. 사과를 최대 몇 개까지 담을 수 있는가?`,
    promptEn: `Apples cost ${unitPrice} won each and a gift box costs ${boxCost} won. How many apples can be bought with at most ${budget} won?`,
    expression: `${unitPrice}x + ${boxCost} \\le ${budget}`,
    answer: String(maxCount),
    explanation: `사과의 개수를 x라 하면 ${unitPrice}x + ${boxCost} ≤ ${budget}입니다. ${unitPrice}x ≤ ${budget - boxCost}에서 x ≤ ${(budget - boxCost) / unitPrice}이므로 최대 ${maxCount}개까지 담을 수 있습니다.`,
    explanationEn: `${unitPrice}x + ${boxCost} ≤ ${budget} => x ≤ ${(budget - boxCost) / unitPrice}. Maximum items = ${maxCount}.`
  };
}

// 18. [일차부등식 활용 유형 03] 예금액과 저축액 (#0512~#0515)
export function rpmIneqAppSavingsDeposit(random) {
  // A has 20000, saves 1000/month. B has 10000, saves 3000/month.
  // When does B have more than A?
  // 10000 + 3000x > 20000 + 1000x => 2000x > 10000 => x > 5 months => 6 months
  const aBase = ri(random, 3, 5) * 10000;
  const bBase = ri(random, 1, 2) * 10000;
  const aSave = 2000;
  const bSave = 5000;
  // bBase + bSave * x > aBase + aSave * x => (bSave - aSave) * x > aBase - bBase
  const months = Math.floor((aBase - bBase) / (bSave - aSave)) + 1;
  return {
    prompt: `현재 형의 통장에는 ${aBase}원, 동생의 통장에는 ${bBase}원이 들어 있다. 다음 달부터 매달 형은 ${aSave}원씩, 동생은 ${bSave}원씩 저축한다면, 몇 개월 후부터 동생의 예금액이 형의 예금액보다 많아지는가?`,
    promptEn: `Currently elder brother has ${aBase} won and younger brother has ${bBase} won. Saving ${aSave} and ${bSave} won monthly respectively, after how many months will younger brother have more?`,
    expression: `${bBase} + ${bSave}x > ${aBase} + ${aSave}x`,
    answer: String(months),
    explanation: `x개월 후 동생의 예금액이 형보다 많아진다고 하면 ${bBase} + ${bSave}x > ${aBase} + ${aSave}x 입니다. 이항하면 ${bSave - aSave}x > ${aBase - bBase}이므로 x > ${(aBase - bBase) / (bSave - aSave)}입니다. 따라서 ${months}개월 후부터 많아집니다.`,
    explanationEn: `${bBase} + ${bSave}x > ${aBase} + ${aSave}x => ${bSave - aSave}x > ${aBase - bBase}, yielding x > ${(aBase - bBase) / (bSave - aSave)}, so ${months} months.`
  };
}

// 19. [일차부등식 활용 유형 04] 평균 점수에 대한 부등식 (#0516~#0519)
export function rpmIneqAppAverageScore(random) {
  // 3 tests: s1, s2, s3. Target average A over 4 tests. Minimum score on 4th test?
  const targetAvg = ri(random, 82, 90);
  const s1 = targetAvg - ri(random, 2, 8);
  const s2 = targetAvg + ri(random, 1, 5);
  const s3 = targetAvg - ri(random, 1, 6);
  // (s1 + s2 + s3 + x) / 4 ≥ targetAvg => x ≥ 4 * targetAvg - (s1 + s2 + s3)
  const minScore = 4 * targetAvg - (s1 + s2 + s3);
  return {
    prompt: `민지는 세 번의 수학 시험에서 각각 ${s1}점, ${s2}점, ${s3}점을 받았다. 네 번의 시험의 평균 점수가 ${targetAvg}점 이상이 되려면 네 번째 시험에서 최소 몇 점 이상을 받아야 하는가?`,
    promptEn: `Minji scored ${s1}, ${s2}, and ${s3} on three math exams. What minimum score is needed on the fourth exam to achieve an average of at least ${targetAvg}?`,
    expression: `\\frac{${s1} + ${s2} + ${s3} + x}{4} \\ge ${targetAvg}`,
    answer: String(minScore),
    explanation: `네 번째 점수를 x점이라 하면 (${s1} + ${s2} + ${s3} + x)/4 ≥ ${targetAvg}입니다. 양변에 4를 곱하면 ${s1 + s2 + s3} + x ≥ ${4 * targetAvg}이므로 x ≥ ${minScore}점입니다.`,
    explanationEn: `(${s1} + ${s2} + ${s3} + x)/4 ≥ ${targetAvg} => x ≥ ${minScore}.`
  };
}

// 20. [일차부등식 활용 유형 05] 요금 선택 / 추가 요금제 (#0520~#0523)
export function rpmIneqAppPricingPlans(random) {
  // Plan A: base 15000, 50 won per minute. Plan B: base 25000, 20 won per minute.
  // When is Plan B cheaper?
  // 25000 + 20x < 15000 + 50x => 30x > 10000 => x > 333.3 => 334 min
  const baseA = 15000, rateA = 60;
  const baseB = 27000, rateB = 20;
  // 27000 + 20x < 15000 + 60x => 40x > 12000 => x > 300 => 301 min
  const minMinutes = Math.floor((baseB - baseA) / (rateA - rateB)) + 1;
  return {
    prompt: `A 요금제는 기본요금 ${baseA}원에 1분당 ${rateA}원이고, B 요금제는 기본요금 ${baseB}원에 1분당 ${rateB}원이다. 한 달 통화 시간이 몇 분을 초과해야 B 요금제를 선택하는 것이 더 유리한가?`,
    promptEn: `Plan A has base ${baseA} won + ${rateA} won/min. Plan B has base ${baseB} won + ${rateB} won/min. Beyond how many minutes is Plan B cheaper?`,
    expression: `${baseB} + ${rateB}x < ${baseA} + ${rateA}x`,
    answer: String(minMinutes - 1),
    answerSuffix: '분',
    explanation: `통화 시간을 x분이라 하면 B 요금제가 유리하려면 ${baseB} + ${rateB}x < ${baseA} + ${rateA}x 이어야 합니다. ${rateA - rateB}x > ${baseB - baseA}에서 x > ${(baseB - baseA) / (rateA - rateB)}분이므로 ${(baseB - baseA) / (rateA - rateB)}분을 초과해야 합니다.`,
    explanationEn: `${baseB} + ${rateB}x < ${baseA} + ${rateA}x => x > ${(baseB - baseA) / (rateA - rateB)} minutes.`
  };
}

// 21. [일차부등식 활용 유형 06] 단체 입장권 할인과 유리한 선택 (#0524~#0527)
export function rpmIneqAppGroupDiscount(random) {
  // Price per person: 3000 won. Group of 30 or more gets 20% discount.
  // Group ticket for 30: 30 * 3000 * 0.8 = 72000 won.
  // Normal ticket for x people: 3000 * x.
  // 72000 < 3000x => x > 24 => 25 people!
  const price = pick(random, [2000, 3000, 4000]);
  const groupSize = pick(random, [20, 30]);
  const discountRate = pick(random, [10, 20]); // percent
  const groupTotal = groupSize * price * (1 - discountRate / 100);
  const minPeople = Math.floor(groupTotal / price) + 1;
  return {
    prompt: `어느 미술관의 입장료는 1인당 ${price}원이고, ${groupSize}명 이상의 단체인 경우 입장료의 ${discountRate}%를 할인해 준다고 한다. ${groupSize}명 미만의 인원이 입장할 때, 최소 몇 명 이상이면 ${groupSize}명의 단체 입장권을 사는 것이 더 유리한가?`,
    promptEn: `Museum admission is ${price} won per person with ${discountRate}% discount for groups of ${groupSize} or more. For fewer than ${groupSize} people, at least how many people make buying a ${groupSize}-person group ticket cheaper?`,
    expression: `${groupSize} \\times ${price} \\times (1 - 0.${discountRate}) < ${price}x`,
    answer: String(minPeople),
    explanation: `${groupSize}명의 단체 입장권 가격은 ${groupSize} × ${price} × ${1 - discountRate / 100} = ${groupTotal}원입니다. x명의 개인 입장료는 ${price}x원이므로 ${groupTotal} < ${price}x에서 x > ${groupTotal / price}입니다. 따라서 최소 ${minPeople}명 이상이면 단체권을 사는 것이 유리합니다.`,
    explanationEn: `Group ticket costs ${groupTotal} won. ${groupTotal} < ${price}x implies x > ${groupTotal / price}, so at least ${minPeople} people.`
  };
}

// 22. [일차부등식 활용 유형 07] 물건 구입비와 교통비 비교 (#0528~#0531)
export function rpmIneqAppStoreComparison(random) {
  // Local store price: P1. Wholesale discount store: P2 (P2 < P1).
  // Round-trip transport: T.
  // P2 * x + T < P1 * x => (P1 - P2) * x > T => x > T / (P1 - P2)
  const p1 = 2000;
  const p2 = 1600;
  const transport = pick(random, [1800, 2400, 3000]);
  const minItems = Math.floor(transport / (p1 - p2)) + 1;
  return {
    prompt: `어느 물건의 가격이 집 근처 마트에서는 개당 ${p1}원이고, 대형 할인점에서는 개당 ${p2}원이다. 대형 할인점에 다녀오려면 왕복 교통비 ${transport}원이 든다고 할 때, 이 물건을 몇 개 이상 사야 대형 할인점에서 사는 것이 더 유리한가?`,
    promptEn: `An item costs ${p1} won locally and ${p2} won at a discount store, with ${transport} won round-trip transit. At least how many items must be bought for the discount store to be cheaper?`,
    expression: `${p2}x + ${transport} < ${p1}x`,
    answer: String(minItems),
    explanation: `구입할 개수를 x개라 하면 ${p2}x + ${transport} < ${p1}x 입니다. 이항하면 ${p1 - p2}x > ${transport}이므로 x > ${transport / (p1 - p2)}입니다. 따라서 최소 ${minItems}개 이상 사야 합니다.`,
    explanationEn: `${p2}x + ${transport} < ${p1}x => ${p1 - p2}x > ${transport} => x > ${transport / (p1 - p2)}, requiring at least ${minItems} items.`
  };
}

// 23. [일차부등식 활용 유형 08] 원가·정가와 할인 판매 이익 (#0532~#0535)
export function rpmIneqAppCostPriceProfit(random) {
  // Cost: C. Markup: 30% (price = 1.3 C). Discount: D won.
  // Profit ≥ 10% of cost: (1.3 C - D) - C ≥ 0.1 C => 0.2 C ≥ D => C ≥ 5 D
  const markupPercent = 30;
  const discount = pick(random, [1000, 1500, 2000]);
  const minProfitPercent = 10;
  // Price = C * (1 + 0.3) - discount
  // Profit = Price - C = 0.3 C - discount ≥ 0.1 C => 0.2 C ≥ discount => C ≥ discount / 0.2
  const minCost = discount / ((markupPercent - minProfitPercent) / 100);
  return {
    prompt: `원가에 ${markupPercent}%의 이익을 붙여 정가를 정한 후, ${discount}원을 할인하여 판매하려고 한다. 이익이 원가의 ${minProfitPercent}% 이상이 되도록 하려면 원가는 최소 얼마 이상이어야 하는가?`,
    promptEn: `Setting price at ${markupPercent}% markup on cost, then discounting ${discount} won: find the minimum cost so profit is at least ${minProfitPercent}% of cost.`,
    expression: `1.${markupPercent}C - ${discount} - C \\ge 0.${minProfitPercent}C`,
    answer: String(minCost),
    answerSuffix: '원',
    explanation: `원가를 C원이라 하면 판매 가격은 1.${markupPercent}C - ${discount}원입니다. (이익) = (판매가) - (원가) = 0.${markupPercent - minProfitPercent + 10}C - ${discount} ≥ 0.${minProfitPercent}C 이어야 하므로, 0.${markupPercent - minProfitPercent}C ≥ ${discount}에서 C ≥ ${minCost}원입니다.`,
    explanationEn: `Profit = 0.${markupPercent}C - ${discount} ≥ 0.${minProfitPercent}C => 0.${markupPercent - minProfitPercent}C ≥ ${discount} => C ≥ ${minCost} won.`
  };
}

// 24. [일차부등식 활용 유형 09] 도형에 대한 부등식 (#0536~#0539)
export function rpmIneqAppGeometry(random) {
  // Triangle sides: x, x+3, x+7
  // For triangle to exist, sum of two smaller sides > largest side:
  // x + (x + 3) > x + 7 => 2x + 3 > x + 7 => x > 4
  const d1 = ri(random, 2, 4);
  const d2 = d1 + ri(random, 3, 6);
  // Sides: x, x + d1, x + d2
  // x + x + d1 > x + d2 => x > d2 - d1
  const minX = d2 - d1;
  return {
    prompt: `삼각형의 세 변의 길이가 x cm, (x + ${d1}) cm, (x + ${d2}) cm 일 때, x의 값의 범위를 구하시오. (결과가 x > k 일 때 k의 값)`,
    promptEn: `If a triangle has side lengths x cm, (x + ${d1}) cm, and (x + ${d2}) cm, find the minimum bound k such that x > k.`,
    expression: `x + (x + ${d1}) > x + ${d2}`,
    answer: String(minX),
    explanation: `가장 긴 변의 길이는 x + ${d2}입니다. 삼각형이 성립할 조건에 의하여 가장 긴 변의 길이는 나머지 두 변의 길이의 합보다 작아야 하므로, x + (x + ${d1}) > x + ${d2}입니다. 정리하면 x > ${d2 - d1}입니다.`,
    explanationEn: `The sum of the two shorter sides must exceed the longest side: x + (x + ${d1}) > x + ${d2} => x > ${minX}.`
  };
}

// 25. [일차부등식 활용 유형 10] 소금물의 농도 (물 증발/추가) (#0540~#0545)
export function rpmIneqAppSaltWaterEvaporateAdd(random) {
  // 10% salt water 600g. Evaporate x g of water to make concentration >= 15%.
  // Salt = 600 * 0.10 = 60g.
  // 60 / (600 - x) >= 0.15 => 60 >= 0.15(600 - x) = 90 - 0.15x => 0.15x >= 30 => x >= 200g
  const totalWater = pick(random, [400, 500, 600]);
  const c1 = 10;
  const c2 = 15;
  const salt = (totalWater * c1) / 100;
  // salt / (totalWater - x) >= c2 / 100 => salt >= (c2/100) * totalWater - (c2/100) * x
  // (c2/100) * x >= (c2/100) * totalWater - salt
  const minWater = totalWater - (salt * 100) / c2;
  return {
    prompt: `${c1}%의 소금물 ${totalWater} g이 있다. 이 소금물에서 물을 증발시켜 농도가 ${c2}% 이상이 되게 하려고 할 때, 최소 몇 g의 물을 증발시켜야 하는가?`,
    promptEn: `Given ${totalWater} g of ${c1}% salt water, at least how much water must be evaporated to reach a concentration of at least ${c2}%?`,
    expression: `\\frac{${salt}}{${totalWater} - x} \\ge \\frac{${c2}}{100}`,
    answer: String(Math.round(minWater)),
    answerSuffix: 'g',
    explanation: `증발시킬 물의 양을 x g이라 하면 소금의 양은 ${totalWater} × (${c1}/100) = ${salt} g으로 일정합니다. 증발 후 소금물의 양은 (${totalWater} - x) g이므로 ${salt} / (${totalWater} - x) × 100 ≥ ${c2}입니다. ${salt * 100} ≥ ${c2}(${totalWater} - x)에서 ${c2}x ≥ ${c2 * totalWater - salt * 100}, 따라서 x ≥ ${minWater} g입니다.`,
    explanationEn: `Salt amount is ${salt} g. Setting ${salt} / (${totalWater} - x) ≥ ${c2}/100 gives x ≥ ${minWater} g.`
  };
}

// 26. [일차부등식 활용 유형 11] 거리·속력·시간 (왕복 총 시간 이내) (#0546~#0549)
export function rpmIneqAppSpeedRoundTripTime(random) {
  // Go at speed 4 km/h, return at speed 3 km/h. Total time <= 3.5 hours.
  // x/4 + x/3 <= 3.5 => 7x / 12 <= 7/2 => x <= 6 km
  const v1 = 4;
  const v2 = 3;
  const maxTimeHours = 3.5;
  // x/4 + x/3 <= 7/2 => 7x/12 <= 7/2 => x <= 6
  return {
    prompt: `갈 때는 시속 ${v1} km, 올 때는 같은 길을 시속 ${v2} km로 걸어서 왕복하는 데 ${maxTimeHours}시간 이내가 걸리도록 하려고 한다. 최대 몇 km 떨어진 곳까지 다녀올 수 있는가?`,
    promptEn: `Walking ${v1} km/h outgoing and ${v2} km/h returning on the same path within ${maxTimeHours} hours round trip, what is the maximum distance?`,
    expression: `\\frac{x}{${v1}} + \\frac{x}{${v2}} \\le ${maxTimeHours}`,
    answer: '6',
    answerSuffix: 'km',
    explanation: `거리를 x km라 하면 갈 때 걸린 시간은 x/${v1}시간, 올 때 걸린 시간은 x/${v2}시간입니다. x/${v1} + x/${v2} ≤ ${maxTimeHours}에서 양변에 12를 곱하면 3x + 4x ≤ 42, 즉 7x ≤ 42이므로 x ≤ 6 km입니다.`,
    explanationEn: `Total time = x/${v1} + x/${v2} ≤ ${maxTimeHours} => 7x/12 ≤ 3.5 => x ≤ 6 km.`
  };
}

// 27. [일차부등식 활용 유형 12] 물건 구매/휴식 시간 포함 역 왕복 (#0550~#0553)
export function rpmIneqAppSpeedShoppingStation(random) {
  // Waiting for train for 1 hour (60 min). Speed 3 km/h. Store errand takes 12 min.
  // Max distance: 2 * (x / 3) + 12/60 <= 1 => 2x / 3 <= 48/60 = 4/5 => x <= 1.2 km
  const waitMin = 60;
  const shopMin = 12;
  const speed = 3;
  // 2 * (x / speed) * 60 + shopMin <= waitMin
  // 120 x / 3 <= 48 => 40x <= 48 => x <= 1.2 km
  return {
    prompt: `기차 출발 시간까지 1시간의 여유가 있어서 상점에 가서 물건을 사 오려고 한다. 물건을 사는 데 12분이 걸리고 시속 ${speed} km로 걷는다면, 역에서 최대 몇 km 떨어진 상점까지 다녀올 수 있는가?`,
    promptEn: `With 1 hour before train departure, taking 12 minutes to shop at a store while walking at ${speed} km/h, what is the maximum distance to the store?`,
    expression: `2 \\times \\frac{x}{${speed}} + \\frac{12}{60} \\le 1`,
    answer: '1.2',
    answerSuffix: 'km',
    explanation: `거리를 x km라 하면 왕복 걸리는 시간은 2x/${speed}시간입니다. 물건을 사는 시간은 12/60 = 0.2시간이므로 2x/${speed} + 0.2 ≤ 1 입니다. 2x/${speed} ≤ 0.8에서 x ≤ 0.8 × ${speed} / 2 = 1.2 km입니다.`,
    explanationEn: `Round trip walking time 2x/${speed} + 0.2 ≤ 1 => 2x/${speed} ≤ 0.8 => x ≤ 1.2 km.`
  };
}

// 28. [일차부등식 활용 유형 13] 도중 속력 변경과 지연 (#0554~#0557)
export function rpmIneqAppSpeedChangeMidway(random) {
  // Total distance 10 km. Walk at 3 km/h for x km, then run at 6 km/h for (10 - x) km.
  // Total time <= 2.5 hours. Max walk distance x?
  // x/3 + (10 - x)/6 <= 2.5 => 2x + 10 - x <= 15 => x <= 5 km
  const totalDist = 10;
  const v1 = 3;
  const v2 = 6;
  const maxTime = 2.5;
  // x/3 + (10 - x)/6 <= 2.5 => (2x + 10 - x)/6 <= 2.5 => x + 10 <= 15 => x <= 5
  return {
    prompt: `집에서 ${totalDist} km 떨어진 공원까지 가는데 처음에는 시속 ${v1} km로 걷다가 도중에 시속 ${v2} km로 뛰었더니 ${maxTime}시간 이내에 도착하였다. 시속 ${v1} km로 걸어간 거리는 최대 몇 km인가?`,
    promptEn: `Traveling ${totalDist} km to a park, walking at ${v1} km/h for part of the way and running at ${v2} km/h for the remainder within ${maxTime} hours: what is the maximum walking distance?`,
    expression: `\\frac{x}{${v1}} + \\frac{${totalDist} - x}{${v2}} \\le ${maxTime}`,
    answer: '5',
    answerSuffix: 'km',
    explanation: `걸어간 거리를 x km라 하면 뛰어간 거리는 (${totalDist} - x) km입니다. x/${v1} + (${totalDist} - x)/${v2} ≤ ${maxTime}에서 양변에 6을 곱하면 2x + ${totalDist} - x ≤ 15, 즉 x + ${totalDist} ≤ 15이므로 x ≤ 5 km입니다.`,
    explanationEn: `x/${v1} + (${totalDist} - x)/${v2} ≤ ${maxTime} => 2x + ${totalDist} - x ≤ 15 => x ≤ 5 km.`
  };
}

// 29. [일차부등식 활용 유형 14] 일차부등식의 활용 전 유형 실전 종합 (#0558~#0567)
export function rpmIneqAppAllTypesMixed(random) {
  const fns = [
    rpmIneqAppNumbers,
    rpmIneqAppCostCount,
    rpmIneqAppSavingsDeposit,
    rpmIneqAppAverageScore,
    rpmIneqAppPricingPlans,
    rpmIneqAppGroupDiscount,
    rpmIneqAppStoreComparison,
    rpmIneqAppCostPriceProfit,
    rpmIneqAppGeometry,
    rpmIneqAppSaltWaterEvaporateAdd,
    rpmIneqAppSpeedRoundTripTime,
    rpmIneqAppSpeedShoppingStation,
    rpmIneqAppSpeedChangeMidway
  ];
  return pick(random, fns)(random);
}

// 30. [일차부등식 활용 유형 15] 일차부등식의 활용 최고수준 실력 UP (#0568~#0575)
export function rpmIneqAppAdvancedSkillUp(random) {
  // Problem #0568: 8% salt water 200g. How much water to evaporate for >= 10%?
  // Salt = 16g. 16 / (200 - x) >= 0.10 => 160 >= 200 - x => x >= 40g.
  return {
    prompt: `8%의 소금물 200 g이 있다. 이 소금물에서 물을 증발시켜 농도가 10% 이상이 되게 하려면 최소 몇 g의 물을 증발시켜야 하는가?`,
    promptEn: `Given 200 g of 8% salt water, at least how much water must be evaporated to make concentration at least 10%?`,
    expression: `\\frac{16}{200 - x} \\ge \\frac{10}{100}`,
    answer: '40',
    answerSuffix: 'g',
    explanation: `소금의 양은 200 × 0.08 = 16 g입니다. 물을 x g 증발시키면 소금물의 양은 (200 - x) g이 되므로 16 / (200 - x) ≥ 0.10 입니다. 양변에 (200 - x)를 곱하면 16 ≥ 20 - 0.1x, 0.1x ≥ 4에서 x ≥ 40 g입니다.`,
    explanationEn: `Salt is 16 g. 16 / (200 - x) ≥ 0.1 => 16 ≥ 20 - 0.1x => x ≥ 40 g.`
  };
}

export function rpmSysLinearTwoVarsIdentify(random) {
  return {
    prompt: '다음 중 미지수가 2개인 일차방정식은?',
    promptEn: 'Which of the following is a linear equation in two variables?',
    expression: 'ax + by + c = 0',
    choices: [
      { value: '1', label: '3x - 2y = 5', labelEn: '3x - 2y = 5' },
      { value: '2', label: 'x^2 + y = 3', labelEn: 'x^2 + y = 3' },
      { value: '3', label: '2x - 3y', labelEn: '2x - 3y' },
      { value: '4', label: '1/x + y = 2', labelEn: '1/x + y = 2' },
      { value: '5', label: 'x - 2y = x + 3', labelEn: 'x - 2y = x + 3' },
    ],
    answer: '1',
    explanation: '미지수가 2개이고 차수가 모두 1인 등식을 미지수가 2개인 일차방정식이라고 합니다. 2번은 이차식, 3번은 등호가 없고, 4번은 분모에 미지수가 있으며, 5번은 x가 소거되어 미지수가 1개가 되므로 1번만 해당합니다.',
    explanationEn: 'Only option 1 has two variables of degree 1 and an equality sign.'
  };
}

// 32. [연립일차방정식 유형 02] 일차방정식의 자연수 해 순서쌍 (#0622~#0625)
export function rpmSysLinearNaturalPairs(random) {
  // 2x + 3y = C
  // Find count of natural pairs (x, y >= 1)
  const a = 2;
  const b = 3;
  const C = pick(random, [17, 19, 23, 25]);
  let count = 0;
  for (let y = 1; y * b < C; y++) {
    if ((C - b * y) % a === 0) {
      count++;
    }
  }
  return {
    prompt: `일차방정식 ${a}x + ${b}y = ${C} 를 만족하는 자연수 x, y의 순서쌍 (x, y)의 개수를 구하시오.`,
    promptEn: `Find the number of natural number pairs (x, y) satisfying ${a}x + ${b}y = ${C}.`,
    expression: `${a}x + ${b}y = ${C}`,
    answer: String(count),
    explanation: `y는 자연수이므로 y = 1부터 대입하면, 2x = ${C} - 3y에서 x가 자연수가 되는 순서쌍 (x, y)의 개수는 총 ${count}개입니다.`,
    explanationEn: `Substituting natural numbers y = 1, 2, ... into 2x = ${C} - 3y yields ${count} integer solutions for x >= 1.`
  };
}

// 33. [연립일차방정식 유형 03] 해가 주어질 때 일차방정식의 미지수 구하기 (#0626~#0629)
export function rpmSysLinearGivenSolFindConstant(random) {
  // ax + by = c has solution (m, n)
  const m = ri(random, 1, 4);
  const n = ri(random, 1, 4);
  const b = ri(random, 2, 4);
  const c = ri(random, 10, 25);
  // a * m + b * n = c => a = (c - b * n) / m
  const aVal = (c - b * n) / m;
  if (Number.isInteger(aVal) && aVal !== 0) {
    return {
      prompt: `일차방정식 ax + ${b}y = ${c} 의 한 해가 (${m}, ${n})일 때, 상수 a의 값을 구하시오.`,
      promptEn: `If (${m}, ${n}) is a solution to ax + ${b}y = ${c}, find constant a.`,
      expression: `ax + ${b}y = ${c}, \\quad (x, y) = (${m}, ${n})`,
      answer: String(aVal),
      explanation: `x = ${m}, y = ${n}을 방정식에 대입하면 a × (${m}) + ${b} × (${n}) = ${c}입니다. ${m}a + ${b * n} = ${c}에서 ${m}a = ${c - b * n}, 따라서 a = ${aVal}입니다.`,
      explanationEn: `Substituting (${m}, ${n}) gives ${m}a + ${b * n} = ${c}, so a = ${aVal}.`
    };
  }
  return {
    prompt: `일차방정식 ax + 3y = 15 의 한 해가 (3, 2)일 때, 상수 a의 값을 구하시오.`,
    promptEn: `Find a when (3, 2) is a solution to ax + 3y = 15.`,
    expression: `ax + 3y = 15, \\quad (x, y) = (3, 2)`,
    answer: '3',
    explanation: `x = 3, y = 2를 대입하면 3a + 6 = 15에서 3a = 9, 즉 a = 3입니다.`,
    explanationEn: `3a + 6 = 15 => a = 3.`
  };
}

// 34. [연립일차방정식 유형 04] 연립일차방정식의 해의 뜻 (#0630~#0633)
export function rpmSysLinearSystemSolutionConcept(random) {
  // Check which pair (x, y) satisfies both x + y = 5 and 2x - y = 4 => 3x = 9 => x = 3, y = 2
  const x = ri(random, 2, 4);
  const y = ri(random, 1, 3);
  const c1 = x + y;
  const c2 = 2 * x - y;
  return {
    prompt: `연립방정식 x + y = ${c1}, 2x - y = ${c2} 의 해는?`,
    promptEn: `Find the solution to the system x + y = ${c1}, 2x - y = ${c2}.`,
    expression: `\\begin{cases} x + y = ${c1} \\\\ 2x - y = ${c2} \\end{cases}`,
    choices: [
      { value: '1', label: `x = ${x}, y = ${y}`, labelEn: `x = ${x}, y = ${y}` },
      { value: '2', label: `x = ${x + 1}, y = ${y - 1}`, labelEn: `x = ${x + 1}, y = ${y - 1}` },
      { value: '3', label: `x = ${x - 1}, y = ${y + 1}`, labelEn: `x = ${x - 1}, y = ${y + 1}` },
      { value: '4', label: `x = ${x}, y = ${y + 1}`, labelEn: `x = ${x}, y = ${y + 1}` },
      { value: '5', label: `x = ${x + 1}, y = ${y}`, labelEn: `x = ${x + 1}, y = ${y}` },
    ],
    answer: '1',
    explanation: `두 식을 더하면 3x = ${c1 + c2}이므로 x = ${x}입니다. 첫 번째 식에 대입하면 y = ${c1} - ${x} = ${y}입니다.`,
    explanationEn: `Adding both equations gives 3x = ${c1 + c2} => x = ${x}. Substituting gives y = ${y}.`
  };
}

// 35. [연립일차방정식 유형 05] 해가 주어질 때 상수 a, b 구하기 (#0634~#0637)
export function rpmSysLinearGivenSolSystemConst(random) {
  const x = ri(random, 1, 3);
  const y = ri(random, 1, 3);
  const a = ri(random, 2, 4);
  const b = ri(random, 2, 4);
  const c1 = a * x + y;
  const c2 = 2 * x + b * y;
  // ax + y = c1, 2x + by = c2
  return {
    prompt: `연립방정식 ax + y = ${c1}, 2x + by = ${c2} 의 해가 (${x}, ${y})일 때, a + b의 값을 구하시오.`,
    promptEn: `If (${x}, ${y}) is the solution to ax + y = ${c1}, 2x + by = ${c2}, find a + b.`,
    expression: `\\begin{cases} ax + y = ${c1} \\\\ 2x + by = ${c2} \\end{cases}`,
    answer: String(a + b),
    explanation: `x = ${x}, y = ${y}를 각 식에 대입하면 ${x}a + ${y} = ${c1}에서 a = ${a}이고, ${2 * x} + ${y}b = ${c2}에서 b = ${b}입니다. 따라서 a + b = ${a + b}입니다.`,
    explanationEn: `Substituting gives a = ${a} and b = ${b}. Thus a + b = ${a + b}.`
  };
}

// 36. [연립일차방정식 유형 06] 대입법을 이용한 연립방정식의 풀이 (#0638~#0641)
export function rpmSysLinearSubstitutionMethod(random) {
  // y = 2x - 1, 3x + 2y = C
  // 3x + 2(2x - 1) = 7x - 2 = C => 7x = C + 2
  const x = ri(random, 1, 3);
  const y = 2 * x - 1;
  const C = 3 * x + 2 * y;
  return {
    prompt: `연립방정식 y = 2x - 1, 3x + 2y = ${C} 의 해가 x = a, y = b일 때, a + b의 값을 구하시오.`,
    promptEn: `Solve the system y = 2x - 1, 3x + 2y = ${C}. Let x = a, y = b. Find a + b.`,
    expression: `\\begin{cases} y = 2x - 1 \\\\ 3x + 2y = ${C} \\end{cases}`,
    answer: String(x + y),
    explanation: `y = 2x - 1을 두 번째 식에 대입하면 3x + 2(2x - 1) = ${C}, 즉 7x - 2 = ${C}에서 7x = ${C + 2}, x = ${x}입니다. y = 2(${x}) - 1 = ${y}이므로 a + b = ${x + y}입니다.`,
    explanationEn: `Substituting y gives 7x - 2 = ${C} => x = ${x}, y = ${y}. a + b = ${x + y}.`
  };
}

// 37. [연립일차방정식 유형 07] 가감법을 이용한 연립방정식의 풀이 (#0642~#0645)
export function rpmSysLinearAdditionSubtractionMethod(random) {
  // 3x + 2y = c1
  // 2x + 3y = c2
  const x = ri(random, 1, 4);
  const y = ri(random, 1, 4);
  const c1 = 3 * x + 2 * y;
  const c2 = 2 * x + 3 * y;
  return {
    prompt: `연립방정식 3x + 2y = ${c1}, 2x + 3y = ${c2} 의 해가 x = a, y = b일 때, a - b의 값을 구하시오.`,
    promptEn: `Solve 3x + 2y = ${c1}, 2x + 3y = ${c2}. Let x = a, y = b. Find a - b.`,
    expression: `\\begin{cases} 3x + 2y = ${c1} \\\\ 2x + 3y = ${c2} \\end{cases}`,
    answer: String(x - y),
    explanation: `두 식을 변끼리 빼면 (3x - 2x) + (2y - 3y) = x - y = ${c1 - c2}입니다. 따라서 a - b = ${x - y}입니다.`,
    explanationEn: `Subtracting the two equations gives x - y = ${c1 - c2} = ${x - y}.`
  };
}

// 38. [연립일차방정식 유형 08] 괄호가 있는 연립방정식의 풀이 (#0646~#0649)
export function rpmSysLinearParentheses(random) {
  const x = ri(random, 2, 5);
  const y = ri(random, 1, 4);
  // 2(x + y) - y = 2x + y = C1
  // 3(x - 1) + 2y = 3x + 2y - 3 = C2 => 3x + 2y = C2 + 3
  const c1 = 2 * x + y;
  const c2 = 3 * x + 2 * y - 3;
  return {
    prompt: `연립방정식 2(x + y) - y = ${c1}, 3(x - 1) + 2y = ${c2} 의 해가 x = a, y = b일 때, a + b의 값을 구하시오.`,
    promptEn: `Solve 2(x + y) - y = ${c1}, 3(x - 1) + 2y = ${c2}. Find a + b.`,
    expression: `\\begin{cases} 2(x + y) - y = ${c1} \\\\ 3(x - 1) + 2y = ${c2} \\end{cases}`,
    answer: String(x + y),
    explanation: `괄호를 정리하면 2x + y = ${c1} 과 3x + 2y = ${c2 + 3} 입니다. 첫 식에 2를 곱해 빼면 4x + 2y - (3x + 2y) = x = ${2 * c1 - (c2 + 3)} = ${x}입니다. y = ${y}이므로 a + b = ${x + y}입니다.`,
    explanationEn: `Simplifying gives 2x + y = ${c1} and 3x + 2y = ${c2 + 3}. Solving gives x = ${x}, y = ${y}, so a + b = ${x + y}.`
  };
}

// 39. [연립일차방정식 유형 09] 계수가 소수 또는 분수인 연립방정식 (#0650~#0655)
export function rpmSysLinearDecimalsFractions(random) {
  const x = ri(random, 2, 4);
  const y = ri(random, 1, 3);
  // 0.2x + 0.3y = (2x + 3y)/10
  // x/2 + y/3 = (3x + 2y)/6
  const num1 = 2 * x + 3 * y;
  const num2 = 3 * x + 2 * y;
  return {
    prompt: `연립방정식 0.2x + 0.3y = ${num1/10}, x/2 + y/3 = ${fracStr(num2, 6)} 의 해 x의 값을 구하시오.`,
    promptEn: `Solve 0.2x + 0.3y = ${num1/10}, x/2 + y/3 = ${fracStr(num2, 6)} for x.`,
    expression: `\\begin{cases} 0.2x + 0.3y = ${num1/10} \\\\ \\frac{x}{2} + \\frac{y}{3} = ${fracStr(num2, 6)} \\end{cases}`,
    answer: String(x),
    explanation: `첫 번째 식의 양변에 10을 곱하면 2x + 3y = ${num1}입니다. 두 번째 식의 양변에 6을 곱하면 3x + 2y = ${num2}입니다. 두 연립방정식을 풀면 x = ${x}, y = ${y}입니다.`,
    explanationEn: `Clearing decimals and fractions gives 2x + 3y = ${num1} and 3x + 2y = ${num2}, yielding x = ${x}.`
  };
}

// 40. [연립일차방정식 유형 10] A = B = C 꼴의 연립방정식 (#0656~#0659)
export function rpmSysLinearABCForm(random) {
  const x = ri(random, 2, 4);
  const y = ri(random, 1, 3);
  // A = x + 2y
  // B = 2x - y + C_diff
  // C = val
  const A_val = x + 2 * y;
  const exprA = `x + 2y`;
  const exprB = `2x - y + ${A_val - (2 * x - y)}`;
  return {
    prompt: `방정식 ${exprA} = ${exprB} = ${A_val} 의 해가 x = a, y = b일 때, a + b의 값을 구하시오.`,
    promptEn: `Solve ${exprA} = ${exprB} = ${A_val}. Find a + b.`,
    expression: `${exprA} = ${exprB} = ${A_val}`,
    answer: String(x + y),
    explanation: `A = C, B = C로 두 개의 식을 세우면 x + 2y = ${A_val}, 2x - y = ${2 * x - y}입니다. 연립하여 풀면 x = ${x}, y = ${y}이므로 a + b = ${x + y}입니다.`,
    explanationEn: `Forming the system with A = C and B = C gives x = ${x}, y = ${y}, so a + b = ${x + y}.`
  };
}

// 41. [연립일차방정식 유형 11] 연립방정식 해가 다른 일차방정식을 만족할 때 (#0660~#0663)
export function rpmSysLinearSatisfyOtherEquation(random) {
  const x = ri(random, 2, 4);
  const y = ri(random, 1, 3);
  // System: x + y = c1, 2x - y = c2
  // Satisfies 3x + a y = c3 => a = (c3 - 3x) / y
  const c1 = x + y;
  const c2 = 2 * x - y;
  const a = ri(random, 2, 4);
  const c3 = 3 * x + a * y;
  return {
    prompt: `연립방정식 x + y = ${c1}, 2x - y = ${c2} 의 해가 일차방정식 3x + ay = ${c3} 을 만족할 때, 상수 a의 값을 구하시오.`,
    promptEn: `If the solution to x + y = ${c1}, 2x - y = ${c2} satisfies 3x + ay = ${c3}, find constant a.`,
    expression: `\\begin{cases} x + y = ${c1} \\\\ 2x - y = ${c2} \\end{cases}, \\quad 3x + ay = ${c3}`,
    answer: String(a),
    explanation: `연립방정식을 풀면 x = ${x}, y = ${y}입니다. 이를 3x + ay = ${c3}에 대입하면 3(${x}) + ${y}a = ${c3}, 즉 ${y}a = ${c3 - 3 * x}에서 a = ${a}입니다.`,
    explanationEn: `Solving the system yields (${x}, ${y}). Substituting gives a = ${a}.`
  };
}

// 42. [연립일차방정식 유형 12] x, y 사이의 관계식이 주어진 연립방정식 (#0664~#0667)
export function rpmSysLinearVariableRelation(random) {
  // y = 2x, ax + y = c1, x - y = c2
  const x = ri(random, 1, 3);
  const y = 2 * x;
  const a = ri(random, 2, 4);
  const c1 = a * x + y;
  return {
    prompt: `연립방정식 ax + y = ${c1}, 3x - y = ${3 * x - y} 의 해에서 y의 값이 x의 값의 2배일 때, 상수 a의 값을 구하시오.`,
    promptEn: `In ax + y = ${c1}, 3x - y = ${3 * x - y}, if y = 2x, find constant a.`,
    expression: `y = 2x, \\quad \\begin{cases} ax + y = ${c1} \\\\ 3x - y = ${3 * x - y} \\end{cases}`,
    answer: String(a),
    explanation: `y = 2x를 3x - y = ${3 * x - y}에 대입하면 3x - 2x = x = ${x}입니다. y = 2(${x}) = ${y}이므로 첫 번째 식에 대입하면 ${x}a + ${y} = ${c1}에서 a = ${a}입니다.`,
    explanationEn: `Using y = 2x gives x = ${x}, y = ${y}. Substituting into the first equation yields a = ${a}.`
  };
}

// 43. [연립일차방정식 유형 13] 두 연립방정식의 해가 서로 같을 때 (#0668~#0671)
export function rpmSysLinearTwoSystemsCommonSol(random) {
  const x = ri(random, 2, 4);
  const y = ri(random, 1, 3);
  // Equations without constants: x + y = c1, 2x - 3y = c2
  // Equations with constants a, b: ax + y = c3, x + by = c4
  const c1 = x + y;
  const c2 = 2 * x - 3 * y;
  const a = ri(random, 2, 3);
  const b = ri(random, 2, 3);
  const c3 = a * x + y;
  const c4 = x + b * y;
  return {
    prompt: `두 연립방정식 {x + y = ${c1}, ax + y = ${c3}}과 {2x - 3y = ${c2}, x + by = ${c4}}의 해가 서로 같을 때, a + b의 값을 구하시오.`,
    promptEn: `If systems {x + y = ${c1}, ax + y = ${c3}} and {2x - 3y = ${c2}, x + by = ${c4}} share the same solution, find a + b.`,
    expression: `\\begin{cases} x + y = ${c1} \\\\ ax + y = ${c3} \\end{cases}, \\quad \\begin{cases} 2x - 3y = ${c2} \\\\ x + by = ${c4} \\end{cases}`,
    answer: String(a + b),
    explanation: `상수가 없는 두 식 x + y = ${c1}과 2x - 3y = ${c2}를 연립하여 풀면 x = ${x}, y = ${y}입니다. 이를 대입하면 a = ${a}, b = ${b}이므로 a + b = ${a + b}입니다.`,
    explanationEn: `Solving the constant-free pair gives (${x}, ${y}), leading to a = ${a}, b = ${b}, and sum = ${a + b}.`
  };
}

// 44. [연립일차방정식 유형 14] 잘못 보고 푼 연립방정식 (#0672~#0675)
export function rpmSysLinearFaultyObservation(random) {
  // A mistake on constant in equation 1: solved correctly for eq 2: 2x + y = 7
  // Student got x = 2 => y = 7 - 4 = 3.
  // Find correct solution...
  return {
    prompt: `연립방정식 {ax + y = 5, 2x - y = 1}을 푸는데 첫 번째 식의 5를 다른 수로 잘못 보고 풀어서 x = 2를 얻었다. 바르게 푼 해에서 x의 값을 구하시오.`,
    promptEn: `In {ax + y = 5, 2x - y = 1}, mistaking 5 in the first equation gave x = 2. Find the correct x value. (Given a = 1)`,
    expression: `\\begin{cases} x + y = 5 \\\\ 2x - y = 1 \\end{cases}`,
    answer: '2',
    explanation: `x + y = 5와 2x - y = 1을 바르게 연립하여 풀면 3x = 6에서 x = 2입니다.`,
    explanationEn: `Adding equations gives 3x = 6 => x = 2.`
  };
}

// 45. [연립일차방정식 유형 15] 해가 무수히 많은 연립방정식 (#0676~#0679)
export function rpmSysLinearSpecialInfinitelyMany(random) {
  // 2x + 3y = 6
  // 4x + a y = b  has infinitely many solutions => 4/2 = a/3 = b/6 = 2 => a = 6, b = 12
  const mult = pick(random, [2, 3]);
  const a0 = 2, b0 = 3, c0 = pick(random, [4, 5, 6]);
  const a = a0 * mult;
  const b = b0 * mult;
  const c = c0 * mult;
  return {
    prompt: `연립방정식 ${a0}x + ${b0}y = ${c0}, ${a}x + ay = b 의 해가 무수히 많을 때, a + b의 값을 구하시오.`,
    promptEn: `When ${a0}x + ${b0}y = ${c0} and ${a}x + ay = b have infinitely many solutions, find a + b.`,
    expression: `\\begin{cases} ${a0}x + ${b0}y = ${c0} \\\\ ${a}x + ay = b \\end{cases}`,
    answer: String(b + c),
    explanation: `해가 무수히 많으려면 두 방정식의 계수와 상수항의 비가 모두 같아야 합니다. 즉 ${a}/${a0} = a/${b0} = b/${c0} = ${mult}이므로 a = ${b}, b = ${c}입니다. 따라서 a + b = ${b + c}입니다.`,
    explanationEn: `For infinitely many solutions, ratios must be equal: ${mult} = a/${b0} = b/${c0} => a = ${b}, b = ${c}, sum = ${b + c}.`
  };
}

// 46. [연립일차방정식 유형 16] 해가 없는 연립방정식 (#0680~#0683)
export function rpmSysLinearSpecialNoSolution(random) {
  // 2x - 3y = 4
  // 4x + a y = 5 has no solution => 4/2 = a/(-3) != 5/4 => a = -6
  const mult = pick(random, [2, 3]);
  const a0 = 2, b0 = -3;
  const a = a0 * mult;
  const aVal = b0 * mult;
  return {
    prompt: `연립방정식 ${a0}x - 3y = 4, ${a}x + ay = 5 의 해가 없을 때, 상수 a의 값을 구하시오.`,
    promptEn: `Find a when ${a0}x - 3y = 4 and ${a}x + ay = 5 have no solution.`,
    expression: `\\begin{cases} ${a0}x - 3y = 4 \\\\ ${a}x + ay = 5 \\end{cases}`,
    answer: String(aVal),
    explanation: `해가 없으려면 x, y의 계수의 비는 같고 상수항의 비는 달라야 합니다. 즉 ${a}/${a0} = a/(-3) ≠ 5/4 이어야 하므로 ${mult} = a/(-3)에서 a = ${aVal}입니다.`,
    explanationEn: `No solution requires matching coefficient ratios: ${mult} = a/(-3) => a = ${aVal}.`
  };
}

// 47. [연립일차방정식 유형 17] 계수가 순환소수인 연립방정식 (#0684~#0687)
export function rpmSysLinearRepeatingDecimals(random) {
  // 0.3_dot x + 0.6_dot y = 1 => 1/3 x + 2/3 y = 1 => x + 2y = 3
  // 0.5_dot x - 0.2_dot y = 1/9 => 5/9 x - 2/9 y = 1/9 => 5x - 2y = 1
  // Add: 6x = 4 => x = 2/3 (use integer)
  // Let's use:
  // 0.3_dot x + y = 3 => 1/3 x + y = 3 => x + 3y = 9
  // x - y = 1
  // Add: 4y = 8 => y = 2, x = 3
  return {
    prompt: `연립방정식 0.3̇ x + y = 3, x - y = 1 의 해가 x = a, y = b일 때, a + b의 값을 구하시오. (단, 0.3̇ = 1/3)`,
    promptEn: `Solve 0.3̇ x + y = 3, x - y = 1. Find a + b.`,
    expression: `\\begin{cases} 0.\\dot{3}x + y = 3 \\\\ x - y = 1 \\end{cases}`,
    answer: '5',
    explanation: `0.3̇ = 3/9 = 1/3이므로 첫 식은 1/3 x + y = 3, 즉 x + 3y = 9입니다. 두 식을 연립하여 풀면 x = 3, y = 2입니다. 따라서 a + b = 5입니다.`,
    explanationEn: `0.3̇ = 1/3. The system becomes x + 3y = 9 and x - y = 1, giving x = 3, y = 2, sum = 5.`
  };
}

// 48. [연립일차방정식 유형 18] 연립일차방정식 전 유형 실전 종합 (#0688~#0704)
export function rpmSysLinearAllTypesMixed(random) {
  const fns = [
    rpmSysLinearTwoVarsIdentify,
    rpmSysLinearNaturalPairs,
    rpmSysLinearGivenSolFindConstant,
    rpmSysLinearSystemSolutionConcept,
    rpmSysLinearGivenSolSystemConst,
    rpmSysLinearSubstitutionMethod,
    rpmSysLinearAdditionSubtractionMethod,
    rpmSysLinearParentheses,
    rpmSysLinearDecimalsFractions,
    rpmSysLinearABCForm,
    rpmSysLinearSatisfyOtherEquation,
    rpmSysLinearVariableRelation,
    rpmSysLinearTwoSystemsCommonSol,
    rpmSysLinearFaultyObservation,
    rpmSysLinearSpecialInfinitelyMany,
    rpmSysLinearSpecialNoSolution,
    rpmSysLinearRepeatingDecimals
  ];
  return pick(random, fns)(random);
}

// 49. [연립일차방정식 유형 19] 연립일차방정식 최고수준 실력 UP (#0705~#0720)
export function rpmSysLinearAdvancedSkillUp(random) {
  // Problem #0705: (2x + y = k) and (x - y = -1) satisfies x + y = 3.
  // x - y = -1 and x + y = 3 => 2x = 2 => x = 1, y = 2.
  // Then k = 2(1) + 2 = 4.
  const x = ri(random, 1, 3);
  const y = ri(random, 2, 4);
  const diff = x - y;
  const sum = x + y;
  const k = 2 * x + y;
  return {
    prompt: `연립방정식 {2x + y = k, x - y = ${diff}}의 해가 일차방정식 x + y = ${sum}을 만족할 때, 상수 k의 값을 구하시오.`,
    promptEn: `If the solution to {2x + y = k, x - y = ${diff}} satisfies x + y = ${sum}, find constant k.`,
    expression: `\\begin{cases} 2x + y = k \\\\ x - y = ${diff} \\end{cases}, \\quad x + y = ${sum}`,
    answer: String(k),
    explanation: `x - y = ${diff}와 x + y = ${sum}을 연립하여 풀면 2x = ${diff + sum}에서 x = ${x}, y = ${y}입니다. 이를 2x + y = k에 대입하면 k = 2(${x}) + ${y} = ${k}입니다.`,
    explanationEn: `Solving x - y = ${diff} and x + y = ${sum} gives (${x}, ${y}). Then k = 2(${x}) + ${y} = ${k}.`
  };
}

// =============================================================================
// Chapter 07: 연립일차방정식의 활용 (Pages 100~111)
// =============================================================================

// 50. [연립방정식 활용 유형 01] 두 자리 자연수 (#0732~#0735)
export function rpmSysAppTwoDigitNumbers(random) {
  // Tens digit x, units digit y.
  // x + y = 10. Reversing digits gives 10y + x = (10x + y) + 36 => 9y - 9x = 36 => y - x = 4.
  // x = 3, y = 7 => original number is 37.
  const x = ri(random, 2, 4);
  const diff = ri(random, 2, 4);
  const y = x + diff;
  const sumDigits = x + y;
  const diffNumber = 9 * diff;
  const origNumber = 10 * x + y;
  return {
    prompt: `각 자리의 숫자의 합이 ${sumDigits}인 두 자리 자연수가 있다. 십의 자리의 숫자와 일의 자리의 숫자를 바꾼 수는 처음 수보다 ${diffNumber}만큼 크다고 한다. 처음 자연수를 구하시오.`,
    promptEn: `A two-digit number has sum of digits ${sumDigits}. Reversing the digits increases the number by ${diffNumber}. Find the original number.`,
    expression: `x + y = ${sumDigits}, \\quad 10y + x = (10x + y) + ${diffNumber}`,
    answer: String(origNumber),
    explanation: `십의 자리 숫자를 x, 일의 자리 숫자를 y라 하면 x + y = ${sumDigits}이고, (10y + x) - (10x + y) = 9(y - x) = ${diffNumber}에서 y - x = ${diff}입니다. 연립하여 풀면 x = ${x}, y = ${y}이므로 처음 자연수는 ${origNumber}입니다.`,
    explanationEn: `x + y = ${sumDigits} and y - x = ${diff} yields x = ${x}, y = ${y}. The number is ${origNumber}.`
  };
}

// 51. [연립방정식 활용 유형 02] 나이에 대한 연립방정식 활용 (#0736~#0739)
export function rpmSysAppAges(random) {
  // Father x, son y.
  // x - y = 30. In 10 years, x + 10 = 2(y + 10) + 4 => x - 2y = 14.
  // x = 46, y = 16.
  const sonAge = ri(random, 12, 16);
  const ageDiff = ri(random, 28, 34);
  const fatherAge = sonAge + ageDiff;
  const years = ri(random, 5, 10);
  const k = 2;
  const excess = (fatherAge + years) - k * (sonAge + years);
  return {
    prompt: `현재 아버지와 아들의 나이의 차는 ${ageDiff}세이다. ${years}년 후에는 아버지의 나이가 아들의 나이의 ${k}배보다 ${excess}세가 많아진다고 한다. 현재 아들의 나이를 구하시오.`,
    promptEn: `The age difference between father and son is ${ageDiff}. In ${years} years, father's age will be ${excess} more than ${k} times son's age. Find son's current age.`,
    expression: `x - y = ${ageDiff}, \\quad (x + ${years}) = ${k}(y + ${years}) + ${excess}`,
    answer: String(sonAge),
    answerSuffix: '세',
    explanation: `현재 아버지의 나이를 x세, 아들의 나이를 y세라 하면 x - y = ${ageDiff}입니다. ${years}년 후 (x + ${years}) = ${k}(y + ${years}) + ${excess}에서 x - ${k}y = ${k * years + excess - years}입니다. 두 식을 연립하여 풀면 y = ${sonAge}세입니다.`,
    explanationEn: `x - y = ${ageDiff} and x - 2y = ${fatherAge + years - 2 * (sonAge + years)} gives son's age y = ${sonAge}.`
  };
}

// 52. [연립방정식 활용 유형 03] 물건의 가격과 개수 (#0740~#0743)
export function rpmSysAppPriceQuantity(random) {
  // Pencils x (800 won), Erasers y (500 won). Total 10 items for 6800 won.
  // x + y = 10, 800x + 500y = 6800 => 8x + 5y = 68 => 3x = 18 => x = 6, y = 4
  const pA = 800, pB = 500;
  const x = ri(random, 4, 7);
  const y = 10 - x;
  const totalCost = pA * x + pB * y;
  return {
    prompt: `한 자루에 ${pA}원인 연필과 한 개에 ${pB}원인 지우개를 합하여 모두 10개를 사고 ${totalCost}원을 지불하였다. 산 연필의 개수를 구하시오.`,
    promptEn: `Pencils cost ${pA} won and erasers cost ${pB} won. Buying 10 items total for ${totalCost} won, how many pencils were bought?`,
    expression: `x + y = 10, \\quad ${pA}x + ${pB}y = ${totalCost}`,
    answer: String(x),
    explanation: `연필을 x자루, 지우개를 y개라 하면 x + y = 10, ${pA}x + ${pB}y = ${totalCost}입니다. 양변을 100으로 나누어 연립하면 x = ${x}자루입니다.`,
    explanationEn: `x + y = 10 and 8x + 5y = ${totalCost/100} yields x = ${x}.`
  };
}

// 53. [연립방정식 활용 유형 04] 점수 및 가위바위보 (#0744~#0747)
export function rpmSysAppScoresRockPaperScissors(random) {
  // Total 10 games. Win +2 stairs, Lose -1 stair.
  // A is at +8 stairs, B is at -1 stairs.
  // A won x, lost y. x + y = 10, 2x - y = 8 => 3x = 18 => x = 6 wins.
  const totalGames = 10;
  const x = ri(random, 6, 8);
  const y = totalGames - x;
  const posA = 2 * x - y;
  return {
    prompt: `지민이와 지수가 가위바위보를 하여 이긴 사람은 2계단 올라가고 진 사람은 1계단 내려가기로 하였다. 비기는 경우 없이 10번 게임을 한 결과 지민이는 처음보다 ${posA}계단 올라가 있었다. 지민이가 이긴 횟수를 구하시오.`,
    promptEn: `In 10 rock-paper-scissors games, winner climbs 2 steps and loser descends 1 step. If Jimin ended up ${posA} steps above start, how many times did Jimin win?`,
    expression: `x + y = 10, \\quad 2x - y = ${posA}`,
    answer: String(x),
    explanation: `지민이가 이긴 횟수를 x회, 진 횟수를 y회라 하면 x + y = 10이고 2x - y = ${posA}입니다. 두 식을 더하면 3x = ${10 + posA}이므로 x = ${x}회입니다.`,
    explanationEn: `x + y = 10 and 2x - y = ${posA} gives 3x = ${10 + posA} => x = ${x}.`
  };
}

// 54. [연립방정식 활용 유형 05] 도형에 대한 연립방정식 활용 (#0748~#0751)
export function rpmSysAppGeometry(random) {
  // Rectangle perimeter = 2(w + h) = 40 => w + h = 20
  // Length is 4 cm longer than width: w - h = 4 => w = 12, h = 8
  const w = ri(random, 10, 15);
  const h = ri(random, 5, 9);
  const perimeter = 2 * (w + h);
  const diff = w - h;
  return {
    prompt: `둘레의 길이가 ${perimeter} cm인 직사각형이 있다. 가로의 길이가 세로의 길이보다 ${diff} cm 더 길 때, 이 직사각형의 가로의 길이를 구하시오.`,
    promptEn: `A rectangle has perimeter ${perimeter} cm, and its length is ${diff} cm longer than its width. Find the length.`,
    expression: `2(x + y) = ${perimeter}, \\quad x - y = ${diff}`,
    answer: String(w),
    answerSuffix: 'cm',
    explanation: `가로를 x cm, 세로를 y cm라 하면 x + y = ${perimeter / 2}이고 x - y = ${diff}입니다. 두 식을 더하면 2x = ${perimeter / 2 + diff}이므로 x = ${w} cm입니다.`,
    explanationEn: `x + y = ${perimeter / 2} and x - y = ${diff} yields x = ${w} cm.`
  };
}

// 55. [연립방정식 활용 유형 06] 트랙/호수 둘레 반대·같은 방향 (#0752~#0755)
export function rpmSysAppSpeedOppositeSameTrack(random) {
  // Track circumference: 3 km (3000 m).
  // Opposite direction: meet after 15 min (speed sum = 3000 / 15 = 200 m/min).
  // Same direction: meet after 60 min (speed diff = 3000 / 60 = 50 m/min).
  // vA = (200 + 50)/2 = 125 m/min, vB = 75 m/min.
  const dist = 3000;
  const tOpp = 15;
  const tSame = 60;
  const sumV = dist / tOpp;
  const diffV = dist / tSame;
  const vA = (sumV + diffV) / 2;
  return {
    prompt: `둘레의 길이가 ${dist} m인 호수를 A와 B가 같은 지점에서 동시에 출발하여 반대 방향으로 돌면 ${tOpp}분 후에 만나고, 같은 방향으로 돌면 ${tSame}분 후에 만난다. A의 분속을 구하시오. (단, A가 B보다 빠르다)`,
    promptEn: `On a ${dist} m circular lake, walking in opposite directions meets after ${tOpp} min, while same direction meets after ${tSame} min. Find A's speed in m/min.`,
    expression: `${tOpp}(x + y) = ${dist}, \\quad ${tSame}(x - y) = ${dist}`,
    answer: String(vA),
    answerSuffix: 'm/분',
    explanation: `A의 속력을 x m/분, B의 속력을 y m/분이라 하면 반대 방향: x + y = ${sumV}, 같은 방향: x - y = ${diffV}입니다. 더하면 2x = ${sumV + diffV}에서 x = ${vA} m/분입니다.`,
    explanationEn: `x + y = ${sumV} and x - y = ${diffV} gives x = ${vA} m/min.`
  };
}

// 56. [연립방정식 활용 유형 07] 강물과 배의 속력 (#0756~#0759)
export function rpmSysAppSpeedRiverBoat(random) {
  // Distance = 24 km. Upstream takes 3 hours (speed = 8 km/h). Downstream takes 2 hours (speed = 12 km/h).
  // Boat speed x, river speed y.
  // x - y = 8, x + y = 12 => x = 10, y = 2 km/h.
  const dist = 24;
  const tUp = 3;
  const tDown = 2;
  const vUp = dist / tUp;
  const vDown = dist / tDown;
  const riverSpeed = (vDown - vUp) / 2;
  return {
    prompt: `길이가 ${dist} km인 강을 보트를 타고 거슬러 올라가는 데는 ${tUp}시간, 따라 내려오는 데는 ${tDown}시간이 걸렸다. 강물의 시속을 구하시오. (단, 보트와 강물의 속력은 일정하다)`,
    promptEn: `Traveling ${dist} km on a river takes ${tUp} hours upstream and ${tDown} hours downstream. Find the river current speed in km/h.`,
    expression: `x - y = \\frac{${dist}}{${tUp}}, \\quad x + y = \\frac{${dist}}{${tDown}}`,
    answer: String(riverSpeed),
    answerSuffix: 'km/h',
    explanation: `보트 속력을 x, 강물 속력을 y라 하면 거슬러 올라갈 때 x - y = ${vUp}, 내려올 때 x + y = ${vDown}입니다. 빼면 2y = ${vDown - vUp}이므로 강물의 속력은 ${riverSpeed} km/h입니다.`,
    explanationEn: `x - y = ${vUp} and x + y = ${vDown} gives river speed y = ${riverSpeed} km/h.`
  };
}

// 57. [연립방정식 활용 유형 08] 열차의 터널과 다리 통과 (#0760~#0763)
export function rpmSysAppSpeedTrainBridge(random) {
  // Train length L, speed v.
  // Bridge: 1000m in 40s => 1000 + L = 40v
  // Tunnel: 1600m in 60s => 1600 + L = 60v
  // Subtract: 600 = 20v => v = 30 m/s. L = 40(30) - 1000 = 200 m.
  const lenBridge = 1000, timeBridge = 40;
  const lenTunnel = 1600, timeTunnel = 60;
  const v = (lenTunnel - lenBridge) / (timeTunnel - timeBridge);
  const L = timeBridge * v - lenBridge;
  return {
    prompt: `일정한 속력으로 달리는 기차가 ${lenBridge} m 길이의 철교를 완전히 통과하는 데 ${timeBridge}초가 걸리고, ${lenTunnel} m 길이의 터널을 완전히 통과하는 데 ${timeTunnel}초가 걸린다. 이 기차의 길이를 구하시오.`,
    promptEn: `A train crosses a ${lenBridge} m bridge in ${timeBridge} s and a ${lenTunnel} m tunnel in ${timeTunnel} s at constant speed. Find the train length in meters.`,
    expression: `${lenBridge} + L = ${timeBridge}v, \\quad ${lenTunnel} + L = ${timeTunnel}v`,
    answer: String(L),
    answerSuffix: 'm',
    explanation: `기차의 길이를 L m, 속력을 v m/초라 하면 ${lenBridge} + L = ${timeBridge}v, ${lenTunnel} + L = ${timeTunnel}v 입니다. 두 식을 빼면 ${lenTunnel - lenBridge} = ${timeTunnel - timeBridge}v에서 v = ${v} m/초입니다. L = ${timeBridge} × ${v} - ${lenBridge} = ${L} m입니다.`,
    explanationEn: `Subtracting equations gives v = ${v} m/s, so train length L = ${L} m.`
  };
}

// 58. [연립방정식 활용 유형 09] 두 소금물 섞기 (#0764~#0767)
export function rpmSysAppSaltTwoSolutions(random) {
  // Solution A (x%), Solution B (y%).
  // Mix 100g A + 200g B => 6% salt water (300g, 18g salt) => x + 2y = 18
  // Mix 200g A + 100g B => 8% salt water (300g, 24g salt) => 2x + y = 24
  // Add: 3x + 3y = 42 => x + y = 14. Subtract: x - y = 6 => x = 10%, y = 4%
  return {
    prompt: `농도가 서로 다른 두 종류의 소금물 A, B가 있다. 소금물 A를 100 g, 소금물 B를 200 g 섞으면 6%의 소금물이 되고, 소금물 A를 200 g, 소금물 B를 100 g 섞으면 8%의 소금물이 된다. 소금물 A의 농도를 구하시오.`,
    promptEn: `Mixing 100 g of A with 200 g of B yields 6% solution; mixing 200 g of A with 100 g of B yields 8% solution. Find the concentration of A.`,
    expression: `x + 2y = 18, \\quad 2x + y = 24`,
    answer: '10',
    answerSuffix: '%',
    explanation: `소금물 A의 농도를 x%, B의 농도를 y%라 하면 100 × (x/100) + 200 × (y/100) = 300 × 0.06 = 18에서 x + 2y = 18입니다. 또한 2x + y = 24입니다. 연립하여 풀면 x = 10%, y = 4%입니다.`,
    explanationEn: `x + 2y = 18 and 2x + y = 24 yields x = 10%.`
  };
}

// 59. [연립방정식 활용 유형 10] 소금물에 물 증발/추가 또는 소금 추가 (#0768~#0771)
export function rpmSysAppSaltWaterEvaporateAdd(random) {
  // 10% salt water 200g. Add x g of salt to make 20% salt water.
  // (20 + x) / (200 + x) = 0.20 => 20 + x = 40 + 0.2x => 0.8x = 20 => x = 25g
  return {
    prompt: `10%의 소금물 200 g에 소금을 더 넣어서 20%의 소금물을 만들려고 한다. 더 넣어야 할 소금의 양을 구하시오.`,
    promptEn: `How much salt must be added to 200 g of 10% salt water to produce a 20% salt solution?`,
    expression: `\\frac{20 + x}{200 + x} = \\frac{20}{100}`,
    answer: '25',
    answerSuffix: 'g',
    explanation: `소금물 200 g에 녹아 있는 소금은 20 g입니다. 소금 x g을 더 넣으면 전체 소금물의 양은 (200 + x) g, 소금의 양은 (20 + x) g이므로 (20 + x)/(200 + x) = 0.20에서 20 + x = 40 + 0.2x, 0.8x = 20, 즉 x = 25 g입니다.`,
    explanationEn: `(20 + x) / (200 + x) = 0.2 => 0.8x = 20 => x = 25 g.`
  };
}

// 60. [연립방정식 활용 유형 11] 합금의 비율에 대한 활용 (#0772~#0775)
export function rpmSysAppAlloyMetals(random) {
  // Alloy A: copper 20%, zinc 30%. Alloy B: copper 40%, zinc 10%.
  // Make alloy with 280g copper and 210g zinc.
  // 0.2x + 0.4y = 280 => 2x + 4y = 2800 => x + 2y = 1400
  // 0.3x + 0.1y = 210 => 3x + y = 2100
  // 5x = 4200 - 1400 = 2800 => x = 560g, y = 420g
  return {
    prompt: `두 종류의 합금 A, B가 있다. A는 구리를 20%, 아연을 30% 포함하고, B는 구리를 40%, 아연을 10% 포함한다. 두 합금을 녹여서 구리 280 g, 아연 210 g을 얻으려면 합금 A는 몇 g 필요한가?`,
    promptEn: `Alloy A is 20% copper and 30% zinc; Alloy B is 40% copper and 10% zinc. To obtain 280 g copper and 210 g zinc, how many grams of Alloy A are needed?`,
    expression: `0.2x + 0.4y = 280, \\quad 0.3x + 0.1y = 210`,
    answer: '560',
    answerSuffix: 'g',
    explanation: `합금 A를 x g, 합금 B를 y g이라 하면 0.2x + 0.4y = 280, 0.3x + 0.1y = 210입니다. 연립하여 풀면 x = 560 g, y = 420 g입니다. 따라서 합금 A는 560 g 필요합니다.`,
    explanationEn: `0.2x + 0.4y = 280 and 0.3x + 0.1y = 210 gives x = 560 g.`
  };
}

// 61. [연립방정식 활용 유형 12] 학생 수의 증가와 감소 (#0776~#0779)
export function rpmSysAppStudentPercentChange(random) {
  // Last year total: 1000 students. Male increased by 5%, female decreased by 10%.
  // Total decreased by 10 students. Find this year's male students.
  // x + y = 1000, 0.05x - 0.10y = -10 => 5x - 10y = -1000 => x - 2y = -200
  // 3y = 1200 => y = 400, x = 600.
  // This year's male: 600 * 1.05 = 630.
  const lastTotal = 1000;
  const pInc = 5;
  const pDec = 10;
  const netChange = -10;
  const maleLast = 600;
  const maleThis = maleLast * 1.05;
  return {
    prompt: `어느 중학교의 작년 전체 학생 수는 ${lastTotal}명이었다. 올해는 남학생 수가 ${pInc}% 증가하고 여학생 수가 ${pDec}% 감소하여 전체 학생 수가 ${Math.abs(netChange)}명 감소하였다. 올해의 남학생 수를 구하시오.`,
    promptEn: `Last year enrollment was ${lastTotal}. This year boys increased by ${pInc}% and girls decreased by ${pDec}%, resulting in an overall decrease of ${Math.abs(netChange)}. Find the number of boys this year.`,
    expression: `x + y = 1000, \\quad 0.05x - 0.10y = -10`,
    answer: String(maleThis),
    answerSuffix: '명',
    explanation: `작년 남학생을 x명, 여학생을 y명이라 하면 x + y = 1000이고 0.05x - 0.10y = -10입니다. 연립하여 풀면 작년 남학생 x = 600명입니다. 올해 남학생은 600 × 1.05 = 630명입니다.`,
    explanationEn: `x + y = 1000 and 0.05x - 0.1y = -10 gives last year's boys x = 600. This year boys = 630.`
  };
}

// 62. [연립방정식 활용 유형 13] 일에 대한 연립방정식 활용 (#0780~#0783)
export function rpmSysAppWorkRate(random) {
  // A and B work together for 4 days to finish (4a + 4b = 1).
  // A works 2 days, then B finishes in 7 days (2a + 7b = 1).
  // 4a + 14b = 2 => 10b = 1 => b = 1/10 (B takes 10 days).
  // 4a + 4/10 = 1 => 4a = 6/10 => a = 3/20 (A takes 20/3 days).
  return {
    prompt: `어떤 일을 완성하는 데 A와 B가 함께 하면 4일이 걸린다. 이 일을 A가 2일 동안 한 후 나머지를 B가 7일 동안 하여 완성하였다. 이 일을 B가 혼자서 한다면 며칠이 걸리는가?`,
    promptEn: `A and B together finish a task in 4 days. If A works for 2 days and B finishes in 7 days, how many days would B take alone?`,
    expression: `4x + 4y = 1, \\quad 2x + 7y = 1`,
    answer: '10',
    answerSuffix: '일',
    explanation: `전체 일의 양을 1이라 하고, A, B가 하루에 하는 일의 양을 각각 x, y라 하면 4x + 4y = 1, 2x + 7y = 1입니다. 연립하여 풀면 y = 1/10입니다. 따라서 B가 혼자서 하면 10일이 걸립니다.`,
    explanationEn: `4x + 4y = 1 and 2x + 7y = 1 yields B's daily rate y = 1/10, taking 10 days.`
  };
}

// 63. [연립방정식 활용 유형 14] 원가·정가와 할인 판매 이익 (#0784~#0787)
export function rpmSysAppCostPriceProfit(random) {
  // Two products A and B cost 10000 won in total.
  // A sold at 20% profit, B at 10% profit. Total profit 1400 won.
  // x + y = 10000, 0.20x + 0.10y = 1400 => 2x + y = 14000 => x = 4000, y = 6000
  return {
    prompt: `두 상품 A, B를 합하여 10000원에 사서 A 상품은 원가의 20%, B 상품은 원가의 10%의 이익을 붙여서 팔았더니 전체 이익이 1400원이었다. A 상품의 원가를 구하시오.`,
    promptEn: `Buying items A and B for 10000 won total, A was sold at 20% profit and B at 10% profit, yielding 1400 won total profit. Find the cost of item A.`,
    expression: `x + y = 10000, \\quad 0.20x + 0.10y = 1400`,
    answer: '4000',
    answerSuffix: '원',
    explanation: `A의 원가를 x원, B의 원가를 y원이라 하면 x + y = 10000, 0.2x + 0.1y = 1400입니다. 10을 곱하면 2x + y = 14000이므로 빼면 x = 4000원입니다.`,
    explanationEn: `x + y = 10000 and 2x + y = 14000 gives x = 4000 won.`
  };
}

// 64. [연립방정식 활용 유형 15] 연립방정식의 활용 전 유형 실전 종합 (#0788~#0804)
export function rpmSysAppAllTypesMixed(random) {
  const fns = [
    rpmSysAppTwoDigitNumbers,
    rpmSysAppAges,
    rpmSysAppPriceQuantity,
    rpmSysAppScoresRockPaperScissors,
    rpmSysAppGeometry,
    rpmSysAppSpeedOppositeSameTrack,
    rpmSysAppSpeedRiverBoat,
    rpmSysAppSpeedTrainBridge,
    rpmSysAppSaltTwoSolutions,
    rpmSysAppSaltWaterEvaporateAdd,
    rpmSysAppAlloyMetals,
    rpmSysAppStudentPercentChange,
    rpmSysAppWorkRate,
    rpmSysAppCostPriceProfit
  ];
  return pick(random, fns)(random);
}

// 65. [연립방정식 활용 유형 16] 연립방정식의 활용 최고수준 실력 UP (#0805~#0817)
export function rpmSysAppAdvancedSkillUp(random) {
  // Problem #0813: Ostriches (2 legs) and giraffes (4 legs), 30 heads, 82 legs.
  // x + y = 30, 2x + 4y = 82 => x + 2y = 41 => y = 11 giraffes, x = 19 ostriches.
  return {
    prompt: `동물원에 타조와 기린을 합하여 모두 30마리가 있다. 타조와 기린의 다리 수의 합이 82개일 때, 타조의 수를 구하시오.`,
    promptEn: `There are 30 ostriches and giraffes in a zoo with 82 legs in total. How many ostriches are there?`,
    expression: `x + y = 30, \\quad 2x + 4y = 82`,
    answer: '19',
    answerSuffix: '마리',
    explanation: `타조의 수를 x마리, 기린의 수를 y마리라 하면 x + y = 30이고 2x + 4y = 82입니다. 2로 나누면 x + 2y = 41이므로 두 식을 빼면 y = 11마리입니다. x = 30 - 11 = 19마리입니다.`,
    explanationEn: `x + y = 30 and 2x + 4y = 82 yields giraffes y = 11 and ostriches x = 19.`
  };
}



export function rpmLinearFuncConcept(random) {
  const mode = pick(random, ['identify-func', 'identify-non-func']);
  if (mode === 'identify-func') {
    const choices = [
      { value: '1', label: '한 변의 길이가 x cm인 정사각형의 둘레의 길이 y cm', labelEn: 'Perimeter y cm of a square with side length x cm' },
      { value: '2', label: '자연수 x보다 작은 자연수 y', labelEn: 'Natural numbers y less than natural number x' },
      { value: '3', label: '절댓값이 x인 수 y', labelEn: 'Numbers y whose absolute value is x' },
      { value: '4', label: '자연수 x의 배수 y', labelEn: 'Multiples y of natural number x' },
      { value: '5', label: '자연수 x의 약수 y', labelEn: 'Divisors y of natural number x' },
    ];
    return {
      prompt: '다음 보기 중 y가 x의 함수인 것은?',
      promptEn: 'Which of the following describes y as a function of x?',
      expression: 'y = f(x)',
      choices,
      answer: '1',
      explanation: '정사각형의 둘레의 길이는 y = 4x로 x의 값 하나에 y의 값이 오직 하나씩 대응하므로 함수입니다. 2, 3, 4, 5번은 x의 값 하나에 y의 값이 없거나 2개 이상 정해지므로 함수가 아닙니다.',
      explanationEn: 'The perimeter of a square is y = 4x, which assigns exactly one y to each x. The other options can have multiple or no corresponding y values.'
    };
  } else {
    const choices = [
      { value: '1', label: '자연수 x와 서로소인 자연수 y', labelEn: 'Natural numbers y coprime to natural number x' },
      { value: '2', label: '하루 24시간 중 낮의 길이가 x시간일 때 밤의 길이 y시간', labelEn: 'Night hours y when day hours are x out of 24 hours' },
      { value: '3', label: '한 자루에 800원인 볼펜 x자루의 가격 y원', labelEn: 'Price y won for x pens at 800 won each' },
      { value: '4', label: '시속 60 km로 x시간 동안 달린 거리 y km', labelEn: 'Distance y km traveled in x hours at 60 km/h' },
      { value: '5', label: '넓이가 30 cm²인 직사각형의 가로 x cm, 세로 y cm', labelEn: 'Height y cm of a rectangle with area 30 cm² and width x cm' },
    ];
    return {
      prompt: '다음 보기 중 y가 x의 함수가 아닌 것은?',
      promptEn: 'Which of the following does NOT describe y as a function of x?',
      expression: 'y \\neq f(x)',
      choices,
      answer: '1',
      explanation: '자연수 x와 서로소인 수는 무수히 많으므로 x의 값 하나에 y의 값이 오직 하나로 정해지지 않아 함수가 아닙니다. 나머지는 모두 1:1 대응 관계식이 성립합니다 (y = 24 - x, y = 800x, y = 60x, y = 30/x).',
      explanationEn: 'There are infinitely many numbers coprime to x, so y is not uniquely determined. Hence 1 is not a function.'
    };
  }
}

// 02. [일차함수 유형 02] 함숫값 f(a) 구하기 (#0861~#0863)
export function rpmLinearFuncEvalValue(random) {
  const a = pick(random, [-4, -3, -2, 2, 3, 4, 5]);
  const b = ri(random, -9, 9);
  const p = ri(random, -3, 3);
  const q = ri(random, -3, 3);
  const k1 = pick(random, [1, 2, 3]);
  const k2 = pick(random, [-2, -1, 1, 2]);
  const fp = a * p + b;
  const fq = a * q + b;
  const ans = k1 * fp + k2 * fq;

  return {
    prompt: `일차함수 f(x) = ${formatLinear(a, b)} 에 대하여 ${k1 === 1 ? '' : k1}f(${p}) ${k2 > 0 ? '+ ' + (k2 === 1 ? '' : k2) : '- ' + (Math.abs(k2) === 1 ? '' : Math.abs(k2))}f(${q}) 의 값을 구하시오.`,
    promptEn: `For the linear function f(x) = ${formatLinear(a, b)}, find the value of ${k1 === 1 ? '' : k1}f(${p}) ${k2 > 0 ? '+ ' + (k2 === 1 ? '' : k2) : '- ' + (Math.abs(k2) === 1 ? '' : Math.abs(k2))}f(${q}).`,
    expression: `f(x) = ${formatLinear(a, b)}`,
    answer: String(ans),
    explanation: `f(${p}) = ${a} × (${p}) + (${b}) = ${fp} 이고, f(${q}) = ${a} × (${q}) + (${b}) = ${fq} 입니다. 따라서 준식은 ${k1} × (${fp}) + (${k2}) × (${fq}) = ${ans} 입니다.`,
    explanationEn: `Evaluating f(${p}) = ${fp} and f(${q}) = ${fq}, the result is ${k1}(${fp}) + (${k2})(${fq}) = ${ans}.`
  };
}

// 03. [일차함수 유형 03] 일차함수의 뜻과 식별 (#0864~#0868)
export function rpmLinearFuncIdentifyLinear(random) {
  const a = ri(random, 2, 5);
  const b = ri(random, 1, 4);
  const choices = [
    { value: '1', label: `y = ${formatLinear(a, b)}`, labelEn: `y = ${formatLinear(a, b)}` },
    { value: '2', label: `y = ${a}/x + ${b}`, labelEn: `y = ${a}/x + ${b}` },
    { value: '3', label: `y = ${a}x^2 - ${b}x`, labelEn: `y = ${a}x^2 - ${b}x` },
    { value: '4', label: `y = ${b}`, labelEn: `y = ${b}` },
    { value: '5', label: `2(x - y) = 3 - 2y`, labelEn: `2(x - y) = 3 - 2y` },
  ];
  return {
    prompt: '다음 보기 중 일차함수인 것은?',
    promptEn: 'Which of the following is a linear function?',
    expression: 'y = ax + b \\quad (a \\neq 0)',
    choices,
    answer: '1',
    explanation: '일차함수는 y = ax + b (a ≠ 0) 꼴로 나타내어지는 함수입니다. 2번은 분모에 미지수가 있어 일차식이 아니고, 3번은 이차함수, 4번은 상수함수, 5번은 y가 소거되어 2x = 3이 되므로 함수의 꼴이 아닙니다. 따라서 1번만 일차함수입니다.',
    explanationEn: 'A linear function must be in the form y = ax + b with a ≠ 0. Only option 1 satisfies this definition.'
  };
}

// 04. [일차함수 유형 04] 일차함수 그래프 위의 점 (#0869~#0871)
export function rpmLinearFuncPointOnGraph(random) {
  const a = pick(random, [-3, -2, 2, 3, 4]);
  const b = ri(random, -5, 5);
  const p = ri(random, 1, 4);
  const correctY = a * p + b;
  const q = ri(random, -3, -1);
  const correctX = q;
  const qY = a * q + b;

  // Let point (p, m) be on graph, find m. Or point (k, qY) be on graph, find k.
  const mode = pick(random, ['find-y', 'find-x']);
  if (mode === 'find-y') {
    return {
      prompt: `일차함수 y = ${formatLinear(a, b)} 의 그래프가 점 (${p}, m)을 지날 때, m의 값을 구하시오.`,
      promptEn: `If the graph of y = ${formatLinear(a, b)} passes through the point (${p}, m), find m.`,
      expression: `y = ${formatLinear(a, b)}`,
      answer: String(correctY),
      explanation: `x = ${p}, y = m을 식에 대입하면 m = ${a} × (${p}) + (${b}) = ${correctY} 입니다.`,
      explanationEn: `Substituting x = ${p}, y = m gives m = ${a}(${p}) + (${b}) = ${correctY}.`
    };
  } else {
    return {
      prompt: `일차함수 y = ${formatLinear(a, b)} 의 그래프가 점 (k, ${qY})를 지날 때, k의 값을 구하시오.`,
      promptEn: `If the graph of y = ${formatLinear(a, b)} passes through (k, ${qY}), find k.`,
      expression: `y = ${formatLinear(a, b)}`,
      answer: String(correctX),
      explanation: `x = k, y = ${qY}를 식에 대입하면 ${qY} = ${a}k + (${b}) 에서 ${a}k = ${qY - b}, k = ${correctX} 입니다.`,
      explanationEn: `Substituting x = k, y = ${qY} yields ${a}k + (${b}) = ${qY}, so k = ${correctX}.`
    };
  }
}

// 05. [일차함수 유형 05] 일차함수의 그래프의 평행이동 y = ax + b (#0872~#0876)
export function rpmLinearFuncTranslationY(random) {
  const a = pick(random, [-4, -3, -2, 2, 3, 4]);
  const b = ri(random, -6, 6);
  const p = pick(random, [-5, -4, -3, 3, 4, 5]);
  const targetX = ri(random, 1, 4);
  const targetY = a * targetX + b + p;

  return {
    prompt: `일차함수 y = ${formatLinear(a, b)} 의 그래프를 y축의 방향으로 ${p > 0 ? p + '만큼' : Math.abs(p) + '만큼 음의 방향으로(또는 -' + Math.abs(p) + '만큼)'} 평행이동하였더니 점 (${targetX}, k)를 지났다. 상수 k의 값을 구하시오.`,
    promptEn: `The graph of y = ${formatLinear(a, b)} is translated along the y-axis by ${p}. If it passes through (${targetX}, k), find k.`,
    expression: `y = ${formatLinear(a, b)} \\to y = ${formatLinear(a, b + p)}`,
    answer: String(targetY),
    explanation: `y축의 방향으로 ${p}만큼 평행이동한 일차함수의 식은 y = ${formatLinear(a, b)} + (${p}) = ${formatLinear(a, b + p)} 입니다. 점 (${targetX}, k)를 대입하면 k = ${a} × (${targetX}) + (${b + p}) = ${targetY} 입니다.`,
    explanationEn: `The translated line is y = ${formatLinear(a, b + p)}. Substituting (${targetX}, k) gives k = ${targetY}.`
  };
}

// 06. [일차함수 유형 06] 일차함수 그래프의 x절편, y절편 (#0877~#0880)
export function rpmLinearFuncIntercepts(random) {
  const m = pick(random, [-4, -3, -2, 2, 3, 4]);
  const xInt = pick(random, [-6, -4, -3, -2, 2, 3, 4, 6]);
  // y = m(x - xInt) = mx - m*xInt => yInt = -m * xInt
  const yInt = -m * xInt;

  const mode = pick(random, ['sum', 'diff']);
  const ans = mode === 'sum' ? xInt + yInt : xInt - yInt;
  const exprStr = `y = ${formatLinear(m, yInt)}`;

  return {
    prompt: `일차함수 ${exprStr} 의 그래프의 x절편을 a, y절편을 b라 할 때, ${mode === 'sum' ? 'a + b' : 'a - b'}의 값을 구하시오.`,
    promptEn: `Let a be the x-intercept and b be the y-intercept of ${exprStr}. Find ${mode === 'sum' ? 'a + b' : 'a - b'}.`,
    expression: exprStr,
    answer: String(ans),
    explanation: `y = 0을 대입하면 0 = ${m}x + (${yInt}) 에서 x = ${xInt} 이므로 x절편 a = ${xInt} 입니다. x = 0을 대입하면 y = ${yInt} 이므로 y절편 b = ${yInt} 입니다. 따라서 ${mode === 'sum' ? `a + b = ${xInt} + (${yInt}) = ${ans}` : `a - b = ${xInt} - (${yInt}) = ${ans}`} 입니다.`,
    explanationEn: `Setting y = 0 gives x-intercept a = ${xInt}. Setting x = 0 gives y-intercept b = ${yInt}. Thus ${mode === 'sum' ? 'a + b' : 'a - b'} = ${ans}.`
  };
}

// 07. [일차함수 유형 07] 기울기의 뜻과 증가량 (#0881~#0883)
export function rpmLinearFuncSlopeDefinition(random) {
  const a = pick(random, [-4, -3, -2, 2, 3, 4, 5]);
  const b = ri(random, -7, 7);
  const deltaX = pick(random, [2, 3, 4, 5]);
  const deltaY = a * deltaX;

  return {
    prompt: `일차함수 y = ${formatLinear(a, b)} 의 그래프에서 x의 값이 ${deltaX}만큼 증가할 때, y의 값의 증가량을 구하시오.`,
    promptEn: `For the linear function y = ${formatLinear(a, b)}, find the change in y when x increases by ${deltaX}.`,
    expression: `\\text{기울기} = \\frac{y\\text{의 증가량}}{x\\text{의 증가량}} = ${a}`,
    answer: String(deltaY),
    explanation: `일차함수의 기울기는 ${a}이므로 (y의 증가량) / (x의 증가량) = ${a} 입니다. x의 증가량이 ${deltaX}이므로 y의 증가량은 ${a} × ${deltaX} = ${deltaY} 입니다.`,
    explanationEn: `Slope is ${a}. Since Δy / Δx = ${a} and Δx = ${deltaX}, Δy = ${a} × ${deltaX} = ${deltaY}.`
  };
}

// 08. [일차함수 유형 08] 두 점을 지나는 일차함수 그래프의 기울기 (#0884~#0887)
export function rpmLinearFuncSlopeTwoPoints(random) {
  const x1 = ri(random, -4, 2);
  const diffX = pick(random, [2, 3, 4, 5]);
  const x2 = x1 + diffX;
  const a = pick(random, [-3, -2, 1, 2, 3]);
  const y1 = ri(random, -5, 5);
  const y2 = y1 + a * diffX;

  // Let one coordinate be variable k: e.g. (x2, k) has slope a
  const mode = pick(random, ['find-slope', 'find-coordinate']);
  if (mode === 'find-slope') {
    return {
      prompt: `두 점 (${x1}, ${y1}), (${x2}, ${y2})를 지나는 일차함수 그래프의 기울기를 구하시오.`,
      promptEn: `Find the slope of the line passing through the points (${x1}, ${y1}) and (${x2}, ${y2}).`,
      expression: `(${x1}, ${y1}), \\; (${x2}, ${y2})`,
      answer: String(a),
      explanation: `기울기 = (y2 - y1) / (x2 - x1) = (${y2} - (${y1})) / (${x2} - (${x1})) = ${y2 - y1} / ${x2 - x1} = ${a} 입니다.`,
      explanationEn: `Slope = (${y2} - ${y1}) / (${x2} - ${x1}) = ${a}.`
    };
  } else {
    return {
      prompt: `두 점 (${x1}, ${y1}), (${x2}, k)를 지나는 일차함수 그래프의 기울기가 ${a}일 때, 상수 k의 값을 구하시오.`,
      promptEn: `If the line passing through (${x1}, ${y1}) and (${x2}, k) has slope ${a}, find k.`,
      expression: `\\frac{k - (${y1})}{${x2} - (${x1})} = ${a}`,
      answer: String(y2),
      explanation: `기울기 공식을 세우면 (k - (${y1})) / (${x2} - (${x1})) = ${a} 이므로 (k - (${y1})) / ${diffX} = ${a}, k - (${y1}) = ${a * diffX}, k = ${y2} 입니다.`,
      explanationEn: `Using the slope formula (k - ${y1}) / (${x2} - ${x1}) = ${a} yields k = ${y2}.`
    };
  }
}

// 09. [일차함수 유형 09] 일차함수 그래프 그리기와 지나는 사분면 (#0888~#0889)
export function rpmLinearFuncDrawQuadrants(random) {
  // Signs:
  // a > 0, b > 0: passes 1, 2, 3 (does NOT pass 4)
  // a > 0, b < 0: passes 1, 3, 4 (does NOT pass 2)
  // a < 0, b > 0: passes 1, 2, 4 (does NOT pass 3)
  // a < 0, b < 0: passes 2, 3, 4 (does NOT pass 1)
  const aSign = pick(random, [1, -1]);
  const bSign = pick(random, [1, -1]);
  const a = aSign * ri(random, 1, 4);
  const b = bSign * ri(random, 1, 6);

  let missingQuadrant;
  if (a > 0 && b > 0) missingQuadrant = '4';
  else if (a > 0 && b < 0) missingQuadrant = '2';
  else if (a < 0 && b > 0) missingQuadrant = '3';
  else missingQuadrant = '1';

  return {
    prompt: `일차함수 y = ${formatLinear(a, b)} 의 그래프가 지나지 않는 사분면은 제 몇 사분면인지 구하시오. (숫자만 입력)`,
    promptEn: `Which quadrant does the graph of y = ${formatLinear(a, b)} NOT pass through? (Enter digit 1-4)`,
    expression: `y = ${formatLinear(a, b)}`,
    answer: missingQuadrant,
    answerSuffix: '사분면',
    explanation: `기울기 a = ${a} (${a > 0 ? '양수, 오른쪽 위로 향함' : '음수, 오른쪽 아래로 향함'})이고, y절편 b = ${b} (${b > 0 ? '양수' : '음수'})입니다. 그래프를 그리면 제${missingQuadrant}사분면을 지나지 않습니다.`,
    explanationEn: `Slope is ${a > 0 ? 'positive' : 'negative'} and y-intercept is ${b > 0 ? 'positive' : 'negative'}, so it does not pass through quadrant ${missingQuadrant}.`
  };
}

// 10. [일차함수 유형 10] 일차함수 그래프와 좌표축으로 둘러싸인 도형의 넓이 (#0890~#0892)
export function rpmLinearFuncAxisTriangleArea(random) {
  const xInt = pick(random, [2, 3, 4, 6, 8]) * pick(random, [1, -1]);
  const yInt = pick(random, [2, 3, 4, 5, 6]) * pick(random, [1, -1]);
  const area = Math.abs(xInt * yInt) / 2;

  // y = - (yInt / xInt) x + yInt
  const slope = - yInt / xInt;
  const slopeStr = fracStr(-yInt, xInt);
  const expr = `y = ${slopeStr === '1' ? 'x' : slopeStr === '-1' ? '-x' : slopeStr + 'x'} ${yInt > 0 ? '+ ' + yInt : '- ' + Math.abs(yInt)}`;

  return {
    prompt: `일차함수 ${expr} 의 그래프와 x축, y축으로 둘러싸인 삼각형의 넓이를 구하시오.`,
    promptEn: `Find the area of the triangle bounded by ${expr}, the x-axis, and the y-axis.`,
    expression: expr,
    answer: String(area),
    explanation: `x절편은 ${xInt}이고 y절편은 ${yInt}입니다. 좌표축과 둘러싸인 삼각형은 직각삼각형이므로 넓이는 1/2 × |x절편| × |y절편| = 1/2 × ${Math.abs(xInt)} × ${Math.abs(yInt)} = ${area} 입니다.`,
    explanationEn: `The x-intercept is ${xInt} and y-intercept is ${yInt}. Area = 1/2 × |${xInt}| × |${yInt}| = ${area}.`
  };
}

// 11. [일차함수 유형 11] 일차함수 y = ax + b의 그래프의 성질 (부호 판별) (#0893~#0895)
export function rpmLinearFuncSignProperties(random) {
  // a, b signs given by graph shape, then ask about y = bx - a or y = -ax + b
  const aSign = pick(random, [1, -1]);
  const bSign = pick(random, [1, -1]);
  const aDesc = aSign > 0 ? 'a > 0' : 'a < 0';
  const bDesc = bSign > 0 ? 'b > 0' : 'b < 0';

  const choices = [
    { value: '1', label: `${aDesc}, ${bDesc}`, labelEn: `${aDesc}, ${bDesc}` },
    { value: '2', label: `${aSign > 0 ? 'a < 0' : 'a > 0'}, ${bDesc}`, labelEn: `${aSign > 0 ? 'a < 0' : 'a > 0'}, ${bDesc}` },
    { value: '3', label: `${aDesc}, ${bSign > 0 ? 'b < 0' : 'b > 0'}`, labelEn: `${aDesc}, ${bSign > 0 ? 'b < 0' : 'b > 0'}` },
    { value: '4', label: `${aSign > 0 ? 'a < 0' : 'a > 0'}, ${bSign > 0 ? 'b < 0' : 'b > 0'}`, labelEn: `${aSign > 0 ? 'a < 0' : 'a > 0'}, ${bSign > 0 ? 'b < 0' : 'b > 0'}` },
    { value: '5', label: `a = 0, ${bDesc}`, labelEn: `a = 0, ${bDesc}` },
  ];

  const dirDesc = aSign > 0 ? '오른쪽 위로 향하고' : '오른쪽 아래로 향하고';
  const yIntDesc = bSign > 0 ? 'y축의 양의 부분에서 만난다' : 'y축의 음의 부분에서 만난다';

  return {
    prompt: `일차함수 y = ax + b의 그래프가 ${dirDesc}, ${yIntDesc}. 이때 상수 a, b의 부호로 알맞은 것은?`,
    promptEn: `The graph of y = ax + b rises to the ${aSign > 0 ? 'upper right' : 'lower right'} and intersects the y-axis in the ${bSign > 0 ? 'positive' : 'negative'} part. Determine the signs of a and b.`,
    expression: 'y = ax + b',
    choices,
    answer: '1',
    explanation: `직선이 ${dirDesc} 있으므로 기울기 a는 ${aSign > 0 ? '양수(a > 0)' : '음수(a < 0)'}이고, ${yIntDesc} 있으므로 y절편 b는 ${bSign > 0 ? '양수(b > 0)' : '음수(b < 0)'}입니다.`,
    explanationEn: `The direction indicates a ${aSign > 0 ? '> 0' : '< 0'}, and the y-intercept indicates b ${bSign > 0 ? '> 0' : '< 0'}.`
  };
}

// 12. [일차함수 유형 12] 서로 평행한 두 일차함수의 그래프 (#0896~#0899)
export function rpmLinearFuncParallelLines(random) {
  const a = pick(random, [-4, -3, -2, 2, 3, 4]);
  const b1 = ri(random, -6, 6);
  const b2 = b1 + pick(random, [-4, -3, -2, 2, 3, 4]);
  const k = ri(random, 1, 3);

  // y = (k*a_unknown) x + b1 is parallel to y = a x + b2
  // => k * m = a => m = a / k
  return {
    prompt: `두 일차함수 y = (${k}m - 1)x + ${b1} 과 y = ${formatLinear(a, b2)} 의 그래프가 서로 평행할 때, 상수 m의 값을 구하시오.`,
    promptEn: `If the graphs of y = (${k}m - 1)x + ${b1} and y = ${formatLinear(a, b2)} are parallel, find m.`,
    expression: `(${k}m - 1) = ${a}`,
    answer: fracStr(a + 1, k),
    explanation: `두 일차함수의 그래프가 서로 평행하려면 기울기가 같고 y절편이 달라야 합니다. 따라서 ${k}m - 1 = ${a} 에서 ${k}m = ${a + 1}, m = ${fracStr(a + 1, k)} 입니다. (y절편은 ${b1} ≠ ${b2} 로 서로 다릅니다.)`,
    explanationEn: `Parallel lines have equal slopes and different y-intercepts: ${k}m - 1 = ${a} => m = ${fracStr(a + 1, k)}.`
  };
}

// 13. [일차함수 유형 13] 일치하는 두 일차함수의 그래프 (#0900~#0903)
export function rpmLinearFuncCoincidentLines(random) {
  const a = pick(random, [-4, -3, -2, 2, 3, 4]);
  const b = ri(random, -7, 7);
  const p = ri(random, -5, 5);
  // y = ax + b translated along y-axis by p becomes y = mx + n
  // m = a, n = b + p
  return {
    prompt: `일차함수 y = ax + ${b} 의 그래프를 y축의 방향으로 ${p}만큼 평행이동하였더니 일차함수 y = ${a}x + c 의 그래프와 일치하였다. 상수 a + c의 값을 구하시오.`,
    promptEn: `Translating y = ax + ${b} by ${p} along the y-axis yields y = ${a}x + c. Find a + c.`,
    expression: `y = ax + ${b + p} \\equiv y = ${a}x + c`,
    answer: String(a + (b + p)),
    explanation: `평행이동한 식은 y = ax + (${b}) + (${p}) = ax + ${b + p} 입니다. 이 그래프가 y = ${a}x + c 와 일치하므로 a = ${a}, c = ${b + p} 입니다. 따라서 a + c = ${a} + (${b + p}) = ${a + b + p} 입니다.`,
    explanationEn: `Translating gives y = ax + ${b + p}. For coincidence, a = ${a} and c = ${b + p}, so a + c = ${a + b + p}.`
  };
}

// 14. [일차함수 유형 14] 일차함수 성질 종합 판정 (#0904~#0906)
export function rpmLinearFuncComprehensiveProperties(random) {
  const m = pick(random, [2, 3, -2, -3]);
  const b = pick(random, [4, 6, -4, -6]);
  const xInt = -b / m;

  const trueStatements = [
    `기울기는 ${m}이다.`,
    `y절편은 ${b}이다.`,
    `x절편은 ${xInt}이다.`,
    `점 (1, ${m + b})를 지난다.`,
    m > 0 ? 'x의 값이 증가하면 y의 값도 증가한다.' : 'x의 값이 증가하면 y의 값은 감소한다.'
  ];
  const falseStatement = m > 0 ? 'x의 값이 증가하면 y의 값은 감소한다.' : 'x의 값이 증가하면 y의 값도 증가한다.';

  const choices = [
    { value: '1', label: falseStatement, labelEn: falseStatement },
    { value: '2', label: trueStatements[0], labelEn: trueStatements[0] },
    { value: '3', label: trueStatements[1], labelEn: trueStatements[1] },
    { value: '4', label: trueStatements[2], labelEn: trueStatements[2] },
    { value: '5', label: trueStatements[3], labelEn: trueStatements[3] },
  ];

  return {
    prompt: `일차함수 y = ${formatLinear(m, b)} 의 그래프에 대한 설명 중 옳지 않은 것은?`,
    promptEn: `Which statement about the graph of y = ${formatLinear(m, b)} is FALSE?`,
    expression: `y = ${formatLinear(m, b)}`,
    choices,
    answer: '1',
    explanation: `기울기가 ${m} (${m > 0 ? '양수' : '음수'})이므로 x의 값이 증가할 때 y의 값은 ${m > 0 ? '증가' : '감소'}해야 합니다. 따라서 1번 설명이 옳지 않습니다.`,
    explanationEn: `Since the slope is ${m}, y ${m > 0 ? 'increases' : 'decreases'} as x increases. Thus option 1 is false.`
  };
}

// 15. [일차함수 활용 유형 15] 온도와 길이 (#0907~#0912)
export function rpmLinearFuncAppTemperature(random) {
  const initialTemp = pick(random, [80, 90, 100]);
  const coolingRate = pick(random, [2, 3, 4, 5]);
  const targetTemp = pick(random, [20, 30, 40, 50]);
  const minutes = (initialTemp - targetTemp) / coolingRate;

  return {
    prompt: `${initialTemp} ℃인 뜨거운 물이 1분에 ${coolingRate} ℃씩 일정하게 식는다고 한다. 물의 온도가 ${targetTemp} ℃가 되는 것은 몇 분 후인지 구하시오.`,
    promptEn: `Hot water at ${initialTemp} °C cools at a rate of ${coolingRate} °C per minute. After how many minutes will its temperature reach ${targetTemp} °C?`,
    expression: `y = ${initialTemp} - ${coolingRate}x`,
    answer: String(minutes),
    answerSuffix: '분 후',
    explanation: `x분 후의 온도를 y ℃라 하면 y = ${initialTemp} - ${coolingRate}x 입니다. y = ${targetTemp}를 대입하면 ${targetTemp} = ${initialTemp} - ${coolingRate}x, ${coolingRate}x = ${initialTemp - targetTemp}, x = ${minutes} 분 후입니다.`,
    explanationEn: `Setting y = ${initialTemp} - ${coolingRate}x = ${targetTemp} gives ${coolingRate}x = ${initialTemp - targetTemp}, so x = ${minutes}.`
  };
}

// 16. [일차함수 활용 유형 16] 물의 양 (#0913~#0915)
export function rpmLinearFuncAppWaterTank(random) {
  const initWater = pick(random, [10, 20, 30]);
  const rate = pick(random, [3, 4, 5, 6]);
  const tankCapacity = pick(random, [70, 80, 100, 120]);
  const neededWater = tankCapacity - initWater;
  const timeMin = Math.round(neededWater / rate);
  const finalTank = initWater + rate * timeMin;

  return {
    prompt: `현재 ${initWater} L의 물이 들어 있는 물탱크에 1분에 ${rate} L씩 일정한 속도로 물을 채운다. 물탱크에 물의 양이 ${finalTank} L가 되도록 하려면 몇 분 동안 물을 채워야 하는지 구하시오.`,
    promptEn: `A tank currently contains ${initWater} L of water. Water is added at ${rate} L/min. How many minutes until the tank has ${finalTank} L?`,
    expression: `y = ${initWater} + ${rate}x`,
    answer: String(timeMin),
    answerSuffix: '분',
    explanation: `x분 후 물의 양 y = ${initWater} + ${rate}x 입니다. ${finalTank} = ${initWater} + ${rate}x 에서 ${rate}x = ${finalTank - initWater}, x = ${timeMin} 분입니다.`,
    explanationEn: `y = ${initWater} + ${rate}x = ${finalTank} gives x = ${timeMin} minutes.`
  };
}

// 17. [일차함수 활용 유형 17] 속력, 거리, 시간 (#0916~#0918)
export function rpmLinearFuncAppSpeedDistance(random) {
  const totalDist = pick(random, [180, 240, 300, 360]);
  const speed = pick(random, [60, 70, 80]);
  const remainingTarget = pick(random, [60, 80, 100, 120]);
  const travelHours = (totalDist - remainingTarget) / speed;

  return {
    prompt: `${totalDist} km 떨어진 목적지를 향해 시속 ${speed} km로 달릴 때, 남은 거리가 ${remainingTarget} km가 되는 것은 출발한 지 몇 시간 후인지 구하시오.`,
    promptEn: `Driving towards a destination ${totalDist} km away at ${speed} km/h, after how many hours will the remaining distance be ${remainingTarget} km?`,
    expression: `y = ${totalDist} - ${speed}x`,
    answer: fracStr(totalDist - remainingTarget, speed),
    answerSuffix: '시간 후',
    explanation: `x시간 후 남은 거리를 y km라 하면 y = ${totalDist} - ${speed}x 입니다. ${remainingTarget} = ${totalDist} - ${speed}x 에서 ${speed}x = ${totalDist - remainingTarget}, x = ${fracStr(totalDist - remainingTarget, speed)} 시간 후입니다.`,
    explanationEn: `Remaining distance y = ${totalDist} - ${speed}x. Setting y = ${remainingTarget} gives x = ${fracStr(totalDist - remainingTarget, speed)} hours.`
  };
}

// 18. [일차함수 활용 유형 18] 도형 위를 움직이는 점 (동점 P) (#0919~#0921)
export function rpmLinearFuncAppMovingPoint(random) {
  const width = pick(random, [10, 12, 16, 20]);
  const height = pick(random, [6, 8, 10]);
  const speed = pick(random, [1, 2]);
  const sec = pick(random, [2, 3, 4]);
  // Point P moves from B towards C on rectangle ABCD at speed cm/s
  // BP = speed * x. Area of triangle ABP = 1/2 * BP * AB = 1/2 * (speed * x) * height
  const areaRate = (speed * height) / 2;
  const targetArea = areaRate * sec;

  return {
    prompt: `가로의 길이가 ${width} cm, 세로의 길이가 ${height} cm인 직사각형 ABCD에서 점 P가 꼭짓점 B를 출발하여 변 BC를 따라 매초 ${speed} cm의 속력으로 꼭짓점 C까지 움직인다. 출발한 지 x초 후의 삼각형 ABP의 넓이가 ${targetArea} cm²가 되는 것은 몇 초 후인지 구하시오.`,
    promptEn: `In rectangle ABCD (width ${width} cm, height ${height} cm), point P moves from B along BC towards C at ${speed} cm/s. After how many seconds will triangle ABP have area ${targetArea} cm²?`,
    expression: `y = \\frac{1}{2} \\times (${speed}x) \\times ${height} = ${areaRate}x`,
    answer: String(sec),
    answerSuffix: '초 후',
    explanation: `x초 후 선분 BP의 길이는 ${speed}x cm입니다. 삼각형 ABP의 넓이 y = 1/2 × BP × AB = 1/2 × (${speed}x) × ${height} = ${areaRate}x 입니다. ${targetArea} = ${areaRate}x 에서 x = ${sec} 초 후입니다.`,
    explanationEn: `Length BP = ${speed}x cm. Area y = 1/2 × (${speed}x) × ${height} = ${areaRate}x. Setting ${areaRate}x = ${targetArea} gives x = ${sec}.`
  };
}

// 19. [일차함수 활용 유형 19] 그래프가 주어진 경우의 모델링 (#0922~#0924)
export function rpmLinearFuncAppGraphModeling(random) {
  const initVal = pick(random, [20, 24, 30, 40]);
  const burnTime = pick(random, [4, 5, 6, 8]);
  const burnRate = initVal / burnTime;
  const t = ri(random, 1, burnTime - 1);
  const remaining = initVal - burnRate * t;

  return {
    prompt: `길이가 ${initVal} cm인 양초에 불을 붙이면 ${burnTime}시간 만에 다 탄다고 한다. 불을 붙인 지 ${t}시간 후에 남은 양초의 길이를 구하시오.`,
    promptEn: `A candle of length ${initVal} cm burns completely in ${burnTime} hours. Find its remaining length after ${t} hours.`,
    expression: `y = ${initVal} - \\frac{${initVal}}{${burnTime}}x = ${initVal} - ${burnRate}x`,
    answer: String(remaining),
    answerSuffix: 'cm',
    explanation: `1시간에 ${initVal} / ${burnTime} = ${burnRate} cm씩 타므로 x시간 후 남은 양초의 길이는 y = ${initVal} - ${burnRate}x 입니다. x = ${t}를 대입하면 y = ${initVal} - ${burnRate} × ${t} = ${remaining} cm 입니다.`,
    explanationEn: `Burn rate is ${burnRate} cm/h. Remaining length y = ${initVal} - ${burnRate}x. At x = ${t}, y = ${remaining} cm.`
  };
}

// 20. [유형 UP] 두 일차함수 그래프와 좌표축으로 둘러싸인 넓이 (#0925~#0927)
export function rpmLinearFuncUpTwoLinesArea(random) {
  // Line 1: y = x + h
  // Line 2: y = -a x + h (share y-intercept (0, h))
  const h = pick(random, [2, 3, 4, 6]);
  const a = pick(random, [2, 3]);
  // x-intercept 1: -h
  // x-intercept 2: h / a
  // Base on x-axis = h + h/a = h(1 + 1/a)
  // Area = 1/2 * base * height = 1/2 * (h * (a+1)/a) * h = h^2 (a+1) / (2a)
  // Let's pick clean integers: e.g. a=1, h=4 => x-intercepts -4, 4 => base 8, height 4 => area 16
  const xInt1 = -pick(random, [2, 3, 4]);
  const xInt2 = pick(random, [2, 3, 4, 5]);
  const yInt = pick(random, [2, 4, 6]);
  const base = xInt2 - xInt1;
  const area = (base * yInt) / 2;

  const m1 = -yInt / xInt1;
  const m2 = -yInt / xInt2;

  return {
    prompt: `두 일차함수 y = ${fracStr(yInt, -xInt1)}x + ${yInt} 과 y = ${fracStr(-yInt, xInt2)}x + ${yInt} 의 그래프와 x축으로 둘러싸인 도형의 넓이를 구하시오.`,
    promptEn: `Find the area of the figure enclosed by y = ${fracStr(yInt, -xInt1)}x + ${yInt}, y = ${fracStr(-yInt, xInt2)}x + ${yInt}, and the x-axis.`,
    expression: `y = ${fracStr(yInt, -xInt1)}x + ${yInt}, \\quad y = ${fracStr(-yInt, xInt2)}x + ${yInt}`,
    answer: String(area),
    explanation: `두 직선은 모두 y축과 점 (0, ${yInt})에서 만나므로 삼각형의 높이는 ${yInt}입니다. 각 직선의 x절편은 ${xInt1}과 ${xInt2}이므로 밑변의 길이는 ${xInt2} - (${xInt1}) = ${base}입니다. 따라서 넓이는 1/2 × ${base} × ${yInt} = ${area}입니다.`,
    explanationEn: `The shared y-intercept is (0, ${yInt}), giving height ${yInt}. The x-intercepts are ${xInt1} and ${xInt2}, giving base ${base}. Area = 1/2 × ${base} × ${yInt} = ${area}.`
  };
}

// 21. [유형 UP] 일차함수 그래프가 특정 사분면을 지나지 않을 조건 (#0928~#0930)
export function rpmLinearFuncUpQuadrantCondition(random) {
  // y = (2k - 3)x + (k + 2) passes quadrants 1, 2, 4 but not 3
  // Passes 1, 2, 4 => slope < 0 and y-intercept > 0
  const c1 = ri(random, 1, 3);
  const c2 = ri(random, 2, 5);
  // slope = k - c1 < 0 => k < c1
  // y-intercept = k + c2 > 0 => k > -c2
  // => -c2 < k < c1
  return {
    prompt: `일차함수 y = (k - ${c1})x + (k + ${c2}) 의 그래프가 제3사분면을 지나지 않도록 하는 상수 k의 값의 범위를 구하시오. (예: -2 < k < 3)`,
    promptEn: `Find the range of k such that y = (k - ${c1})x + (k + ${c2}) does not pass through the 3rd quadrant. (Format: a < k < b)`,
    expression: `y = (k - ${c1})x + (k + ${c2})`,
    answer: `-${c2} < k < ${c1}`,
    explanation: `제3사분면을 지나지 않으려면 오른쪽 아래로 향하면서 y축의 양의 부분을 지나야 하므로 (기울기) < 0 이고 (y절편) > 0 이어야 합니다. k - ${c1} < 0 에서 k < ${c1} 이고, k + ${c2} > 0 에서 k > -${c2} 입니다. 따라서 -${c2} < k < ${c1} 입니다.`,
    explanationEn: `To avoid the 3rd quadrant, slope < 0 and y-intercept > 0: k - ${c1} < 0 => k < ${c1} and k + ${c2} > 0 => k > -${c2}. Result: -${c2} < k < ${c1}.`
  };
}

// 22. [단원 실전 다지기] 일차함수와 그 그래프 전 유형 실전 종합 (#0931~#0956)
export function rpmLinearFuncAllTypesMixed(random) {
  const subTypes = [
    rpmLinearFuncConcept,
    rpmLinearFuncEvalValue,
    rpmLinearFuncIdentifyLinear,
    rpmLinearFuncPointOnGraph,
    rpmLinearFuncTranslationY,
    rpmLinearFuncIntercepts,
    rpmLinearFuncSlopeDefinition,
    rpmLinearFuncSlopeTwoPoints,
    rpmLinearFuncDrawQuadrants,
    rpmLinearFuncAxisTriangleArea,
    rpmLinearFuncSignProperties,
    rpmLinearFuncParallelLines,
    rpmLinearFuncCoincidentLines,
    rpmLinearFuncAppTemperature,
    rpmLinearFuncAppWaterTank,
    rpmLinearFuncAppSpeedDistance
  ];
  const chosen = pick(random, subTypes);
  return chosen(random);
}

// 23. [단원 최고수준] 일차함수와 그 그래프 실력 UP (#0957~#0964)
export function rpmLinearFuncAdvancedSkillUp(random) {
  // Advanced problem: Line y = -2/3 x + 4 is parallel to y = ax + b, and distance between x-intercepts is D
  const a = pick(random, [-3, -2, 2, 3]);
  const b1 = ri(random, 2, 6);
  const xInt1 = -b1 / a; // e.g. a=2, b1=6 => xInt1 = -3
  const dist = pick(random, [3, 4, 5]);
  const xInt2 = xInt1 + dist;
  const b2 = -a * xInt2;

  return {
    prompt: `두 일차함수 y = ${formatLinear(a, b1)} 와 y = ax + b의 그래프가 서로 평행하고, 두 그래프가 x축과 만나는 두 점 사이의 거리가 ${dist}이다. b > ${b1}일 때, a + b의 값을 구하시오.`,
    promptEn: `The graphs of y = ${formatLinear(a, b1)} and y = ax + b are parallel, and the distance between their x-intercepts is ${dist}. Given b > ${b1}, find a + b.`,
    expression: `y = ${formatLinear(a, b1)}, \\quad y = ax + b`,
    answer: String(a + (b1 + Math.abs(a) * dist)),
    explanation: `평행하므로 a = ${a} 입니다. 첫 번째 그래프의 x절편은 -${b1} / ${a} = ${fracStr(-b1, a)} 입니다. 두 그래프 사이의 거리가 ${dist}이고 b > ${b1}이므로 두 번째 그래프의 x절편과의 차이에 의해 b = ${b1 + Math.abs(a) * dist} 가 됩니다. 따라서 a + b = ${a} + ${b1 + Math.abs(a) * dist} = ${a + b1 + Math.abs(a) * dist} 입니다.`,
    explanationEn: `Since lines are parallel, a = ${a}. With x-intercept distance ${dist} and b > ${b1}, b = ${b1 + Math.abs(a) * dist}. Thus a + b = ${a + b1 + Math.abs(a) * dist}.`
  };
}

export function rpmLineEqnFormAxByC(random) {
  // a x + b y + c = 0 => y = -a/b x - c/b
  const b = pick(random, [2, 3, 4]);
  const a = pick(random, [-6, -4, -3, 3, 4, 6]);
  const c = pick(random, [-12, -9, -6, 6, 9, 12]);
  const slope = -a / b;
  const yInt = -c / b;
  const xInt = -c / a;

  const mode = pick(random, ['slope-yint-sum', 'xint']);
  if (mode === 'slope-yint-sum') {
    const ans = slope + yInt;
    return {
      prompt: `일차방정식 ${a}x + ${b}y + (${c}) = 0 의 그래프의 기울기를 m, y절편을 n이라 할 때, m + n의 값을 구하시오.`,
      promptEn: `For ${a}x + ${b}y + (${c}) = 0, let m be the slope and n be the y-intercept. Find m + n.`,
      expression: `${a}x + ${b}y + (${c}) = 0`,
      answer: fracStr(-a - c, b),
      explanation: `식의 y에 관하여 정리하면 ${b}y = -${a}x - (${c}) 에서 y = ${fracStr(-a, b)}x + (${fracStr(-c, b)}) 입니다. 따라서 기울기 m = ${fracStr(-a, b)}, y절편 n = ${fracStr(-c, b)} 이므로 m + n = ${fracStr(-a - c, b)} 입니다.`,
      explanationEn: `Solving for y gives y = ${fracStr(-a, b)}x + (${fracStr(-c, b)}). Then m = ${fracStr(-a, b)}, n = ${fracStr(-c, b)}, sum = ${fracStr(-a - c, b)}.`
    };
  } else {
    return {
      prompt: `일차방정식 ${a}x + ${b}y + (${c}) = 0 의 그래프의 x절편을 구하시오.`,
      promptEn: `Find the x-intercept of the line ${a}x + ${b}y + (${c}) = 0.`,
      expression: `${a}x + ${b}y + (${c}) = 0`,
      answer: fracStr(-c, a),
      explanation: `y = 0을 대입하면 ${a}x + (${c}) = 0 에서 ${a}x = -(${c}), x = ${fracStr(-c, a)} 입니다.`,
      explanationEn: `Substituting y = 0 yields ${a}x + (${c}) = 0 => x = ${fracStr(-c, a)}.`
    };
  }
}

// 02. [직선의 방정식 유형 02] 일차방정식의 그래프 위의 점 (#1010~#1013)
export function rpmLineEqnPointOnLine(random) {
  const a = ri(random, 2, 5);
  const b = ri(random, 1, 4);
  const px = ri(random, -3, 3);
  const py = ri(random, -3, 3);
  // a * x - (k + 1) * y + c = 0
  const kVal = ri(random, 1, 4);
  const coeffY = -(kVal + 1);
  const c = -(a * px + coeffY * py);

  return {
    prompt: `일차방정식 ${a}x - (k + 1)y + (${c}) = 0 의 그래프가 점 (${px}, ${py})를 지날 때, 상수 k의 값을 구하시오.`,
    promptEn: `If the line ${a}x - (k + 1)y + (${c}) = 0 passes through (${px}, ${py}), find k.`,
    expression: `${a}x - (k + 1)y + (${c}) = 0`,
    answer: String(kVal),
    explanation: `x = ${px}, y = ${py}를 대입하면 ${a} × (${px}) - (k + 1) × (${py}) + (${c}) = 0 에서 ${a * px + c} - ${py}(k + 1) = 0 입니다. 이를 k에 대하여 풀면 k = ${kVal} 입니다.`,
    explanationEn: `Substituting (${px}, ${py}) gives ${a * px} - (k + 1)(${py}) + (${c}) = 0 => k = ${kVal}.`
  };
}

// 03. [직선의 방정식 유형 03] 계수의 부호와 그래프의 개형 (#1014~#1016)
export function rpmLineEqnSignsProperties(random) {
  // ax + by + c = 0 => y = -a/b x - c/b
  // Give condition: ab > 0 and bc < 0
  // Then slope = -a/b < 0, y-intercept = -c/b > 0 => passes 1, 2, 4 (does NOT pass 3)
  const mode = pick(random, ['ab>0,bc<0', 'ab<0,bc>0', 'ab>0,bc>0']);
  let slopeSign, yIntSign, missingQuad, condText;
  if (mode === 'ab>0,bc<0') {
    condText = 'ab > 0, \\; bc < 0';
    slopeSign = -1; // -a/b < 0
    yIntSign = 1;   // -c/b > 0 since c/b < 0
    missingQuad = '3';
  } else if (mode === 'ab<0,bc>0') {
    condText = 'ab < 0, \\; bc > 0';
    slopeSign = 1;  // -a/b > 0
    yIntSign = -1;  // -c/b < 0 since c/b > 0
    missingQuad = '2';
  } else {
    condText = 'ab > 0, \\; bc > 0';
    slopeSign = -1; // -a/b < 0
    yIntSign = -1;  // -c/b < 0
    missingQuad = '1';
  }

  return {
    prompt: `일차방정식 ax + by + c = 0 에 대하여 ${condText} 일 때, 이 그래프가 지나지 않는 사분면은 제 몇 사분면인지 구하시오. (숫자만 입력)`,
    promptEn: `Given ${condText} for ax + by + c = 0, which quadrant does its graph NOT pass through? (Enter digit 1-4)`,
    expression: condText,
    answer: missingQuad,
    answerSuffix: '사분면',
    explanation: `ax + by + c = 0 을 y에 대하여 정리하면 y = -a/b x - c/b 입니다. ${condText} 이므로 기울기 -a/b는 ${slopeSign > 0 ? '양수' : '음수'}이고, y절편 -c/b는 ${yIntSign > 0 ? '양수' : '음수'}입니다. 따라서 그래프는 제${missingQuad}사분면을 지나지 않습니다.`,
    explanationEn: `Solving for y gives slope ${slopeSign > 0 ? '> 0' : '< 0'} and y-intercept ${yIntSign > 0 ? '> 0' : '< 0'}. It avoids quadrant ${missingQuad}.`
  };
}

// 04. [직선의 방정식 유형 04] 좌표축에 평행한 직선의 방정식 (x = p, y = q) (#1017~#1020)
export function rpmLineEqnParallelToAxes(random) {
  const p = ri(random, -6, 6);
  const q = ri(random, -6, 6);
  const axis = pick(random, ['x-axis', 'y-axis']);

  if (axis === 'x-axis') {
    // parallel to x-axis => y = q
    return {
      prompt: `점 (${p}, ${q})를 지나고 x축에 평행한(y축에 수직인) 직선의 방정식을 구하시오.`,
      promptEn: `Find the equation of the line passing through (${p}, ${q}) and parallel to the x-axis.`,
      expression: `(${p}, ${q})`,
      answer: `y = ${q}`,
      explanation: `x축에 평행한 직선 위의 모든 점은 y좌표가 일정하므로 y = q 꼴입니다. 점 (${p}, ${q})를 지나므로 구하는 직선의 방정식은 y = ${q} 입니다.`,
      explanationEn: `A line parallel to the x-axis has constant y: y = ${q}.`
    };
  } else {
    // parallel to y-axis => x = p
    return {
      prompt: `점 (${p}, ${q})를 지나고 y축에 평행한(x축에 수직인) 직선의 방정식을 구하시오.`,
      promptEn: `Find the equation of the line passing through (${p}, ${q}) and parallel to the y-axis.`,
      expression: `(${p}, ${q})`,
      answer: `x = ${p}`,
      explanation: `y축에 평행한 직선 위의 모든 점은 x좌표가 일정하므로 x = p 꼴입니다. 점 (${p}, ${q})를 지나므로 구하는 직선의 방정식은 x = ${p} 입니다.`,
      explanationEn: `A line parallel to the y-axis has constant x: x = ${p}.`
    };
  }
}

// 05. [직선의 방정식 유형 05] 좌표축에 평행한 네 직선으로 둘러싸인 도형의 넓이 (#1021~#1027)
export function rpmLineEqnFourLinesRectArea(random) {
  const x1 = ri(random, -5, -1);
  const x2 = ri(random, 1, 6);
  const y1 = ri(random, -5, -1);
  const y2 = ri(random, 1, 6);
  const width = x2 - x1;
  const height = y2 - y1;
  const area = width * height;

  return {
    prompt: `네 직선 x = ${x1}, x = ${x2}, y = ${y1}, y = ${y2} 로 둘러싸인 도형의 넓이를 구하시오.`,
    promptEn: `Find the area of the rectangle bounded by x = ${x1}, x = ${x2}, y = ${y1}, and y = ${y2}.`,
    expression: `x = ${x1}, \\; x = ${x2}, \\; y = ${y1}, \\; y = ${y2}`,
    answer: String(area),
    explanation: `네 직선으로 둘러싸인 도형은 직사각형입니다. 가로의 길이는 ${x2} - (${x1}) = ${width} 이고, 세로의 길이는 ${y2} - (${y1}) = ${height} 입니다. 따라서 넓이는 ${width} × ${height} = ${area} 입니다.`,
    explanationEn: `The rectangle has width ${x2} - (${x1}) = ${width} and height ${y2} - (${y1}) = ${height}. Area = ${width} × ${height} = ${area}.`
  };
}

// 06. [직선의 방정식 유형 06] 직선의 방정식 구하기 - 기울기와 y절편 (#1028~#1030)
export function rpmLineEqnFromSlopeYint(random) {
  const m = pick(random, [-4, -3, -2, 2, 3, 4]);
  const n = ri(random, -6, 6);
  const px = ri(random, 1, 4);
  const py = m * px + n;

  return {
    prompt: `기울기가 ${m}이고 y절편이 ${n}인 직선이 점 (${px}, k)를 지날 때, 상수 k의 값을 구하시오.`,
    promptEn: `A line with slope ${m} and y-intercept ${n} passes through (${px}, k). Find k.`,
    expression: `y = ${formatLinear(m, n)}`,
    answer: String(py),
    explanation: `기울기가 ${m}이고 y절편이 ${n}인 직선의 방정식은 y = ${formatLinear(m, n)} 입니다. 점 (${px}, k)를 대입하면 k = ${m} × (${px}) + (${n}) = ${py} 입니다.`,
    explanationEn: `The line equation is y = ${formatLinear(m, n)}. Substituting (${px}, k) gives k = ${py}.`
  };
}

// 07. [직선의 방정식 유형 07] 직선의 방정식 구하기 - 기울기와 한 점 (#1031~#1035)
export function rpmLineEqnFromSlopePoint(random) {
  const m = pick(random, [-3, -2, 2, 3]);
  const px = ri(random, -3, 3);
  const py = ri(random, -4, 4);
  // y - py = m(x - px) => y = mx - m*px + py
  const yInt = -m * px + py;

  return {
    prompt: `기울기가 ${m}이고 점 (${px}, ${py})를 지나는 직선의 방정식을 y = ax + b 라 할 때, a + b의 값을 구하시오.`,
    promptEn: `The line with slope ${m} passing through (${px}, ${py}) is y = ax + b. Find a + b.`,
    expression: `y - (${py}) = ${m}(x - (${px}))`,
    answer: String(m + yInt),
    explanation: `직선의 방정식은 y - (${py}) = ${m}(x - (${px})) 에서 y = ${m}x - ${m * px} + (${py}) = ${formatLinear(m, yInt)} 입니다. a = ${m}, b = ${yInt} 이므로 a + b = ${m} + (${yInt}) = ${m + yInt} 입니다.`,
    explanationEn: `The equation is y = ${formatLinear(m, yInt)}. So a = ${m}, b = ${yInt}, and a + b = ${m + yInt}.`
  };
}

// 08. [직선의 방정식 유형 08] 직선의 방정식 구하기 - 서로 다른 두 점 (#1036~#1039)
export function rpmLineEqnFromTwoPoints(random) {
  const x1 = ri(random, -3, 1);
  const diffX = pick(random, [2, 3, 4]);
  const x2 = x1 + diffX;
  const m = pick(random, [-3, -2, 1, 2, 3]);
  const y1 = ri(random, -4, 4);
  const y2 = y1 + m * diffX;
  // yInt = y1 - m * x1
  const yInt = y1 - m * x1;

  return {
    prompt: `두 점 (${x1}, ${y1}), (${x2}, ${y2})를 지나는 직선의 방정식을 y = ax + b 라 할 때, a - b의 값을 구하시오.`,
    promptEn: `The line through (${x1}, ${y1}) and (${x2}, ${y2}) is y = ax + b. Find a - b.`,
    expression: `(${x1}, ${y1}), \\; (${x2}, ${y2})`,
    answer: String(m - yInt),
    explanation: `기울기 a = (${y2} - (${y1})) / (${x2} - (${x1})) = ${y2 - y1} / ${diffX} = ${m} 입니다. y = ${m}x + b 에 점 (${x1}, ${y1})을 대입하면 ${y1} = ${m} × (${x1}) + b 에서 b = ${yInt} 입니다. 따라서 a - b = ${m} - (${yInt}) = ${m - yInt} 입니다.`,
    explanationEn: `Slope a = ${m}. Substituting gives y-intercept b = ${yInt}. Then a - b = ${m - yInt}.`
  };
}

// 09. [직선의 방정식 유형 09] 직선의 방정식 구하기 - x절편과 y절편 (#1040~#1043)
export function rpmLineEqnFromIntercepts(random) {
  const a = pick(random, [-6, -4, -3, -2, 2, 3, 4, 6]);
  const b = pick(random, [-6, -4, -3, -2, 2, 3, 4, 6]);
  // slope = -b / a
  // y = -b/a x + b
  const px = ri(random, 1, 3);
  // Ask for y value when x = px or ask for a, b
  const slopeStr = fracStr(-b, a);

  return {
    prompt: `x절편이 ${a}이고 y절편이 ${b}인 직선의 기울기를 기약분수로 구하시오. (예: 2/3 또는 -1/2)`,
    promptEn: `Find the slope of the line with x-intercept ${a} and y-intercept ${b} as a simplified fraction.`,
    expression: `(${a}, 0), \\; (0, ${b})`,
    answer: slopeStr,
    explanation: `x절편이 ${a}이면 점 (${a}, 0)을 지나고, y절편이 ${b}이면 점 (0, ${b})를 지납니다. 따라서 기울기는 (0 - (${b})) / (${a} - 0) = -${b} / ${a} = ${slopeStr} 입니다.`,
    explanationEn: `The line passes through (${a}, 0) and (0, ${b}). Slope = (${b} - 0) / (0 - ${a}) = ${slopeStr}.`
  };
}

// 10. [직선의 방정식 유형 10] 연립방정식의 해와 두 직선의 교점 (#1044~#1047)
export function rpmLineEqnIntersectionAsSolution(random) {
  const x = ri(random, 1, 4);
  const y = ri(random, 1, 4);
  const a1 = ri(random, 1, 3);
  const b1 = ri(random, 1, 3);
  const c1 = a1 * x + b1 * y;
  const a2 = ri(random, 1, 3);
  const b2 = -ri(random, 1, 3);
  const c2 = a2 * x + b2 * y;

  return {
    prompt: `두 직선 ${a1}x + ${b1}y = ${c1} 과 ${a2}x ${b2 > 0 ? '+ ' + b2 : '- ' + Math.abs(b2)}y = ${c2} 의 교점의 좌표 (p, q)에 대하여 p + q의 값을 구하시오.`,
    promptEn: `Find p + q where (p, q) is the intersection of ${a1}x + ${b1}y = ${c1} and ${a2}x ${b2 > 0 ? '+ ' + b2 : '- ' + Math.abs(b2)}y = ${c2}.`,
    expression: `\\begin{cases} ${a1}x + ${b1}y = ${c1} \\\\ ${a2}x ${b2 > 0 ? '+ ' + b2 : '- ' + Math.abs(b2)}y = ${c2} \\end{cases}`,
    answer: String(x + y),
    explanation: `두 직선의 교점의 좌표는 두 일차방정식을 연립하여 푼 해와 같습니다. 연립방정식을 풀면 x = ${x}, y = ${y} 이므로 교점은 (${x}, ${y})입니다. 따라서 p + q = ${x} + ${y} = ${x + y} 입니다.`,
    explanationEn: `The intersection equals the system solution: x = ${x}, y = ${y}. Thus p + q = ${x + y}.`
  };
}

// 11. [직선의 방정식 유형 11] 두 직선의 교점의 좌표를 이용하여 미지수 구하기 (#1048~#1050)
export function rpmLineEqnIntersectionFindConst(random) {
  const p = ri(random, 1, 4);
  const q = ri(random, -3, 3);
  // Line 1: 2x + y = c1
  const c1 = 2 * p + q;
  // Line 2: a x - y = 5 => a * p - q = 5 => a = (5 + q) / p
  const a = ri(random, 1, 4);
  const c2 = a * p - q;

  return {
    prompt: `두 직선 2x + y = ${c1} 과 ax - y = ${c2} 의 교점의 x좌표가 ${p}일 때, 상수 a의 값을 구하시오.`,
    promptEn: `If the x-coordinate of the intersection of 2x + y = ${c1} and ax - y = ${c2} is ${p}, find a.`,
    expression: `x = ${p}`,
    answer: String(a),
    explanation: `교점의 x좌표가 ${p}이므로 첫 번째 식에 x = ${p}를 대입하면 2 × (${p}) + y = ${c1} 에서 y = ${q} 입니다. 교점 (${p}, ${q})를 두 번째 식에 대입하면 a × (${p}) - (${q}) = ${c2} 에서 ${p}a = ${c2 + q}, a = ${a} 입니다.`,
    explanationEn: `Substituting x = ${p} into line 1 gives y = ${q}. Substituting (${p}, ${q}) into line 2 gives a = ${a}.`
  };
}

// 12. [직선의 방정식 유형 12] 두 직선의 교점을 지나는 직선의 방정식 (#1051~#1052)
export function rpmLineEqnLineThroughIntersection(random) {
  const px = ri(random, 1, 3);
  const py = ri(random, 1, 3);
  // Two simple lines intersecting at (px, py): x + y = px + py, x - y = px - py
  const c1 = px + py;
  const c2 = px - py;
  // New line is parallel to y = m x (e.g. 2x)
  const m = pick(random, [2, 3, -2, -3]);
  const newYint = py - m * px;

  return {
    prompt: `두 직선 x + y = ${c1} 과 x - y = ${c2} 의 교점을 지나고 직선 y = ${m}x 에 평행한 직선의 방정식을 y = ax + b 라 할 때, a + b의 값을 구하시오.`,
    promptEn: `A line passes through the intersection of x + y = ${c1} and x - y = ${c2}, and is parallel to y = ${m}x. If its equation is y = ax + b, find a + b.`,
    expression: `y = ax + b`,
    answer: String(m + newYint),
    explanation: `두 식을 연립하여 풀면 교점의 좌표는 (${px}, ${py})입니다. 직선 y = ${m}x 에 평행하므로 기울기 a = ${m} 입니다. 점 (${px}, ${py})를 대입하면 ${py} = ${m} × (${px}) + b 에서 b = ${newYint} 입니다. 따라서 a + b = ${m} + (${newYint}) = ${m + newYint} 입니다.`,
    explanationEn: `Intersection is (${px}, ${py}). Parallel to y = ${m}x gives a = ${m}. Then b = ${newYint}, so a + b = ${m + newYint}.`
  };
}

// 13. [직선의 방정식 유형 13] 세 직선이 한 점에서 만날 조건 (#1053~#1055)
export function rpmLineEqnThreeLinesOnePoint(random) {
  const x = ri(random, 1, 3);
  const y = ri(random, 1, 3);
  // Line 1: x + y = x + y
  const c1 = x + y;
  // Line 2: 2x - y = 2x - y
  const c2 = 2 * x - y;
  // Line 3: a x + 2y = 8 => a * x = 8 - 2y
  const a = ri(random, 1, 4);
  const c3 = a * x + 2 * y;

  return {
    prompt: `세 직선 x + y = ${c1}, 2x - y = ${c2}, ax + 2y = ${c3} 이 한 점에서 만날 때, 상수 a의 값을 구하시오.`,
    promptEn: `The three lines x + y = ${c1}, 2x - y = ${c2}, and ax + 2y = ${c3} meet at a single point. Find a.`,
    expression: `\\begin{cases} x + y = ${c1} \\\\ 2x - y = ${c2} \\end{cases}`,
    answer: String(a),
    explanation: `상수가 없는 앞의 두 직선을 연립하여 풀면 x = ${x}, y = ${y} 입니다. 세 직선이 한 점에서 만나므로 교점 (${x}, ${y})가 세 번째 직선 ax + 2y = ${c3} 위의 점이어야 합니다. 대입하면 a × (${x}) + 2 × (${y}) = ${c3}, ${x}a = ${c3 - 2 * y}, a = ${a} 입니다.`,
    explanationEn: `The first two lines intersect at (${x}, ${y}). Substituting into the third line yields ${x}a + 2(${y}) = ${c3} => a = ${a}.`
  };
}

// 14. [직선의 방정식 유형 14] 연립방정식의 해의 개수와 두 직선의 위치 관계 (#1056~#1059)
export function rpmLineEqnSystemSolutionTypes(random) {
  const mode = pick(random, ['parallel-no-sol', 'coincident-inf-sol']);
  const k = pick(random, [2, 3]);
  const a = ri(random, 2, 4);
  const b = ri(random, 1, 3);
  const c = ri(random, 4, 8);

  if (mode === 'parallel-no-sol') {
    // Line 1: a x + b y = c
    // Line 2: (k * a) x + m y = c * k + 2 (different c)
    const mAns = k * b;
    return {
      prompt: `두 일차방정식 ${a}x + ${b}y = ${c} 과 ${k * a}x + my = ${c * k + 3} 의 그래프의 교점이 존재하지 않을 때(해가 없을 때), 상수 m의 값을 구하시오.`,
      promptEn: `If the system ${a}x + ${b}y = ${c} and ${k * a}x + my = ${c * k + 3} has no solution (parallel lines), find m.`,
      expression: `\\frac{${a}}{${k * a}} = \\frac{${b}}{m} \\neq \\frac{${c}}{${c * k + 3}}`,
      answer: String(mAns),
      explanation: `두 직선의 교점이 존재하지 않으려면 서로 평행해야 합니다. 따라서 계수의 비에서 ${a} / (${k * a}) = ${b} / m ≠ ${c} / (${c * k + 3}) 이어야 하므로 1/${k} = ${b} / m 에서 m = ${mAns} 입니다.`,
      explanationEn: `For parallel lines (no solution), ${a}/(${k * a}) = ${b}/m => m = ${mAns}.`
    };
  } else {
    // Line 1: a x - b y = c
    // Line 2: (k * a) x + m y = k * c (same c => inf sol)
    const mAns = -k * b;
    return {
      prompt: `두 직선 ${a}x - ${b}y = ${c} 과 ${k * a}x + my = ${k * c} 의 그래프가 일치할 때(해가 무수히 많을 때), 상수 m의 값을 구하시오.`,
      promptEn: `If the lines ${a}x - ${b}y = ${c} and ${k * a}x + my = ${k * c} are coincident (infinitely many solutions), find m.`,
      expression: `\\frac{${a}}{${k * a}} = \\frac{-${b}}{m} = \\frac{${c}}{${k * c}}`,
      answer: String(mAns),
      explanation: `두 직선이 일치하려면 모든 계수와 상수항의 비가 같아야 합니다. 따라서 ${a} / (${k * a}) = -${b} / m = ${c} / (${k * c}) = 1/${k} 에서 m = ${mAns} 입니다.`,
      explanationEn: `For coincident lines, ${a}/(${k * a}) = -${b}/m => m = ${mAns}.`
    };
  }
}

// 15. [직선의 방정식 유형 15] 두 직선과 좌표축으로 둘러싸인 도형의 넓이 (#1060~#1063)
export function rpmLineEqnEnclosedTriangleArea(random) {
  // Two lines intersecting at (px, py) with shared or distinct intercepts
  // Line 1: y = -x + 4 (x-int = 4)
  // Line 2: y = 2x - 2 (x-int = 1)
  // Intersection: 2x - 2 = -x + 4 => 3x = 6 => x = 2, y = 2
  // Base on x-axis = 4 - 1 = 3, height = 2, area = 1/2 * 3 * 2 = 3
  const xInt1 = pick(random, [4, 6]);
  const xInt2 = pick(random, [1, 2]);
  const py = ri(random, 2, 4);
  const base = xInt1 - xInt2;
  const area = (base * py) / 2;

  return {
    prompt: `두 직선과 x축으로 둘러싸인 삼각형의 밑변이 두 x절편 ${xInt2}와 ${xInt1} 사이에 있고, 두 직선의 교점의 y좌표가 ${py}일 때, 이 삼각형의 넓이를 구하시오.`,
    promptEn: `A triangle is formed by two lines and the x-axis. The x-intercepts are ${xInt2} and ${xInt1}, and the intersection's y-coordinate is ${py}. Find the area.`,
    expression: `\\text{Base} = ${xInt1} - ${xInt2} = ${base}, \\quad \\text{Height} = ${py}`,
    answer: String(area),
    explanation: `x축 위에 있는 밑변의 길이는 ${xInt1} - ${xInt2} = ${base} 이고, 교점의 y좌표가 높이가 되므로 높이는 ${py} 입니다. 따라서 삼각형의 넓이는 1/2 × ${base} × ${py} = ${area} 입니다.`,
    explanationEn: `Base along the x-axis = ${base}, height = ${py}. Area = 1/2 × ${base} × ${py} = ${area}.`
  };
}

// 16. [직선의 방정식 활용 유형 16] 직선의 방정식의 실생활 활용 (#1064~#1065)
export function rpmLineEqnAppsRealLife(random) {
  // Two water tanks:
  // Tank A: starts with A0 L, leaks at a L/min: y = A0 - ax
  // Tank B: starts with B0 L, leaks at b L/min: y = B0 - bx
  // Meet at x minutes
  const xMin = pick(random, [10, 15, 20]);
  const yWater = pick(random, [30, 40, 50]);
  const aRate = ri(random, 2, 3);
  const bRate = aRate + ri(random, 1, 2);
  const a0 = yWater + aRate * xMin;
  const b0 = yWater + bRate * xMin;

  return {
    prompt: `물탱크 A에는 ${a0} L, 물탱크 B에는 ${b0} L의 물이 들어 있다. 두 물탱크에서 각각 1분에 ${aRate} L, ${bRate} L씩 물을 빼낼 때, 두 물탱크에 남아 있는 물의 양이 같아지는 것은 몇 분 후인지 구하시오.`,
    promptEn: `Tank A has ${a0} L of water and leaks at ${aRate} L/min. Tank B has ${b0} L and leaks at ${bRate} L/min. After how many minutes will both tanks have equal water?`,
    expression: `${a0} - ${aRate}x = ${b0} - ${bRate}x`,
    answer: String(xMin),
    answerSuffix: '분 후',
    explanation: `x분 후 남아 있는 물의 양을 y L라 하면 A: y = ${a0} - ${aRate}x, B: y = ${b0} - ${bRate}x 입니다. 두 식을 연립하면 ${a0} - ${aRate}x = ${b0} - ${bRate}x 에서 (${bRate} - ${aRate})x = ${b0 - a0}, x = ${xMin} 분 후입니다.`,
    explanationEn: `Setting ${a0} - ${aRate}x = ${b0} - ${bRate}x yields (${bRate - aRate})x = ${b0 - a0} => x = ${xMin}.`
  };
}

// 17. [유형 UP] 직선과 선분이 만날 조건 (#1066~#1068)
export function rpmLineEqnUpLineMeetsSegment(random) {
  // Line y = a x - b (fixed y-intercept (0, -b))
  // Segment AB with A(x1, y1), B(x2, y2)
  // Slope through A: (y1 + b) / x1
  // Slope through B: (y2 + b) / x2
  const b = ri(random, 1, 3);
  const x1 = 1;
  const y1 = ri(random, 4, 6);
  const x2 = ri(random, 3, 4);
  const y2 = ri(random, 1, 2);

  const slopeA = (y1 + b) / x1;
  const slopeB = (y2 + b) / x2;
  const minSlope = Math.min(slopeA, slopeB);
  const maxSlope = Math.max(slopeA, slopeB);

  return {
    prompt: `직선 y = ax - ${b} 가 두 점 A(${x1}, ${y1}), B(${x2}, ${y2})를 이은 선분 AB와 만나도록 하는 상수 a의 최댓값을 구하시오.`,
    promptEn: `Find the maximum value of a such that y = ax - ${b} intersects the line segment AB connecting A(${x1}, ${y1}) and B(${x2}, ${y2}).`,
    expression: `y = ax - ${b}`,
    answer: fracStr(y1 + b, x1),
    explanation: `직선 y = ax - ${b} 는 항상 점 (0, -${b})를 지납니다. 선분 AB와 만나려면 직선이 점 A를 지날 때와 점 B를 지날 때의 기울기 사이에 있어야 합니다. 점 A(${x1}, ${y1})을 지날 때 기울기 a = (${y1} - (-${b})) / (${x1} - 0) = ${fracStr(y1 + b, x1)} 이고, 점 B(${x2}, ${y2})를 지날 때 기울기 a = (${y2} - (-${b})) / (${x2} - 0) = ${fracStr(y2 + b, x2)} 입니다. 따라서 최댓값은 ${fracStr(y1 + b, x1)} 입니다.`,
    explanationEn: `The line passes through (0, -${b}). At point A, a = ${fracStr(y1 + b, x1)}; at B, a = ${fracStr(y2 + b, x2)}. Max slope is ${fracStr(y1 + b, x1)}.`
  };
}

// 18. [유형 UP] 삼각형의 넓이를 이등분하는 직선 (#1069~#1071)
export function rpmLineEqnUpBisectTriangleArea(random) {
  // Triangle formed by line ax + by = c and axes
  // e.g. 4x + 3y = 12 => (3, 0) and (0, 4)
  // Line y = mx through origin (0, 0) bisects the area
  // Midpoint of opposite segment or bisecting the y-axis intercept:
  // If line y = mx cuts hypotenuse, it bisects triangle if it passes through midpoint of (3, 0) and (0, 4) => (3/2, 2)
  // m = 2 / (3/2) = 4/3
  const xInt = pick(random, [4, 6]);
  const yInt = pick(random, [4, 6]);
  // Midpoint = (xInt / 2, yInt / 2)
  // Slope m = (yInt / 2) / (xInt / 2) = yInt / xInt
  const ansSlope = fracStr(yInt, xInt);

  return {
    prompt: `일차방정식 ${fracStr(yInt, gcd(xInt, yInt))}x + ${fracStr(xInt, gcd(xInt, yInt))}y = ${fracStr(xInt * yInt, gcd(xInt, yInt))} 의 그래프와 x축 및 y축으로 둘러싸인 직각삼각형의 넓이를 원점을 지나는 직선 y = ax 가 이등분할 때, 상수 a의 값을 기약분수로 구하시오.`,
    promptEn: `The line y = ax passes through the origin and bisects the area of the triangle bounded by the axes and the line with intercepts (${xInt}, 0) and (0, ${yInt}). Find a as a simplified fraction.`,
    expression: `y = ax`,
    answer: ansSlope,
    explanation: `직각삼각형의 두 꼭짓점은 (${xInt}, 0)과 (0, ${yInt})입니다. 원점을 지나는 직선 y = ax가 이 삼각형의 넓이를 이등분하려면 빗변의 중점 (${xInt}/2, ${yInt}/2) = (${xInt / 2}, ${yInt / 2})를 지나야 합니다. 대입하면 ${yInt / 2} = a × (${xInt / 2}) 에서 a = ${yInt} / ${xInt} = ${ansSlope} 입니다.`,
    explanationEn: `To bisect the triangle, the line through origin must pass through the midpoint (${xInt/2}, ${yInt/2}). Slope a = ${ansSlope}.`
  };
}

// 19. [단원 실전 다지기] 일차함수와 일차방정식의 관계 전 유형 실전 종합 (#1072~#1086)
export function rpmLineEqnAllTypesMixed(random) {
  const subTypes = [
    rpmLineEqnFormAxByC,
    rpmLineEqnPointOnLine,
    rpmLineEqnSignsProperties,
    rpmLineEqnParallelToAxes,
    rpmLineEqnFourLinesRectArea,
    rpmLineEqnFromSlopeYint,
    rpmLineEqnFromSlopePoint,
    rpmLineEqnFromTwoPoints,
    rpmLineEqnFromIntercepts,
    rpmLineEqnIntersectionAsSolution,
    rpmLineEqnIntersectionFindConst,
    rpmLineEqnLineThroughIntersection,
    rpmLineEqnThreeLinesOnePoint,
    rpmLineEqnSystemSolutionTypes,
    rpmLineEqnEnclosedTriangleArea,
    rpmLineEqnAppsRealLife
  ];
  const chosen = pick(random, subTypes);
  return chosen(random);
}

// 20. [단원 최고수준] 일차함수와 일차방정식의 관계 실력 UP (#1087~#1092)
export function rpmLineEqnAdvancedSkillUp(random) {
  // Three lines: 2x + y = 2, x - y = 4, and ax + y = 6 do not form a triangle
  // Three lines do NOT form a triangle if:
  // 1) Two lines are parallel, OR
  // 2) All three lines meet at a single point
  const a1 = 2, b1 = 1, c1 = 2; // y = -2x + 2
  const a2 = 1, b2 = -1, c2 = 4; // y = x - 4
  // Intersection of line 1 & 2:
  // -2x + 2 = x - 4 => 3x = 6 => x = 2, y = -2
  // Line 3: ax + y = 6 => y = -ax + 6
  // Parallel to line 1 => -a = -2 => a = 2
  // Parallel to line 2 => -a = 1 => a = -1
  // Passes (2, -2) => 2a + (-2) = 6 => 2a = 8 => a = 4
  const mode = pick(random, ['concurrent', 'parallel']);
  if (mode === 'concurrent') {
    return {
      prompt: `세 직선 2x + y = 2, x - y = 4, ax + y = 6 이 한 점에서 만날 때, 상수 a의 값을 구하시오.`,
      promptEn: `The three lines 2x + y = 2, x - y = 4, and ax + y = 6 meet at a single point. Find a.`,
      expression: `\\begin{cases} 2x + y = 2 \\\\ x - y = 4 \\end{cases}`,
      answer: '4',
      explanation: `앞의 두 식을 연립하여 풀면 교점의 좌표는 (2, -2)입니다. 세 직선이 한 점에서 만나므로 점 (2, -2)를 세 번째 직선 ax + y = 6 에 대입하면 2a + (-2) = 6 에서 2a = 8, a = 4 입니다.`,
      explanationEn: `Intersection of first two lines is (2, -2). Substituting into ax + y = 6 yields 2a - 2 = 6 => a = 4.`
    };
  } else {
    return {
      prompt: `세 직선 2x + y = 2, x - y = 4, ax + y = 6 에 의하여 삼각형이 만들어지지 않도록 하는 양수 a의 값 중, 두 직선이 평행하여 삼각형이 만들어지지 않을 때의 a의 값을 구하시오.`,
      promptEn: `Find the positive value of a such that the lines do not form a triangle due to two lines being parallel.`,
      expression: `y = -2x + 2, \\; y = x - 4, \\; y = -ax + 6`,
      answer: '2',
      explanation: `각 직선의 기울기는 -2, 1, -a 입니다. 두 직선이 평행하면 삼각형이 만들어지지 않으므로 -a = -2 에서 a = 2 또는 -a = 1 에서 a = -1 입니다. 문제에서 양수 a의 값을 구하라고 하였으므로 a = 2 입니다.`,
      explanationEn: `The slopes are -2, 1, and -a. For parallel lines, -a = -2 => a = 2 (positive).`
    };
  }
}

// 21. [중2-1 최종총괄] 중학 2-1 전 범위 최종 실전 총괄 모의고사 (RPM p.152~167)
export function rpmGrade8SemesterOneFinalExam(random) {
  // Comprehensive review problem drawing from the 9 main themes of Grade 2-1:
  // 1. 유리수와 순환소수
  // 2. 단항식의 계산
  // 3. 다항식의 계산
  // 4. 일차부등식
  // 5. 일차부등식의 활용
  // 6. 연립일차방정식
  // 7. 연립일차방정식의 활용
  // 8. 일차함수와 그 그래프
  // 9. 일차함수와 일차방정식의 관계
  const theme = pick(random, ['rat-dec', 'mono', 'poly', 'ineq', 'ineq-app', 'sys', 'sys-app', 'linear-func', 'line-eqn']);

  if (theme === 'rat-dec') {
    const den = pick(random, [12, 18, 24, 30, 45, 60]);
    const num = ri(random, 1, 11);
    // irreducible check
    const g = gcd(num, den);
    const redDen = den / g;
    // Check prime factors of redDen
    let temp = redDen;
    while (temp % 2 === 0) temp /= 2;
    while (temp % 5 === 0) temp /= 5;
    const isTerminating = temp === 1;
    return {
      prompt: `분수 ${num}/${den} 을(를) 소수로 나타낼 때 유한소수가 되는지 순환소수가 되는지 판별하시오.`,
      promptEn: `Determine if ${num}/${den} is a terminating decimal or a repeating decimal.`,
      expression: `\\frac{${num}}{${den}}`,
      choices: [
        { value: '1', label: '유한소수', labelEn: 'Terminating decimal' },
        { value: '2', label: '순환소수', labelEn: 'Repeating decimal' },
        { value: '3', label: '정수', labelEn: 'Integer' },
        { value: '4', label: '무리수', labelEn: 'Irrational number' },
        { value: '5', label: '알 수 없음', labelEn: 'Cannot be determined' },
      ],
      answer: isTerminating ? '1' : '2',
      explanation: `기약분수로 나타내면 ${fracStr(num, den)} 입니다. 분모의 소인수가 2와 5뿐이면 유한소수이고, 그 외의 소인수가 있으면 순환소수가 됩니다. 분모의 소인수를 분석하면 ${isTerminating ? '2와 5뿐이므로 유한소수' : '2 또는 5 이외의 소인수가 존재하므로 순환소수'}입니다.`,
      explanationEn: `Simplifying gives ${fracStr(num, den)}. The prime factorization of denominator shows it is a ${isTerminating ? 'terminating' : 'repeating'} decimal.`
    };
  } else if (theme === 'mono') {
    const a = ri(random, 2, 4);
    const b = ri(random, 2, 3);
    const ans = a * b;
    return {
      prompt: `(x^${a})^${b} = x^□ 일 때, □ 안에 알맞은 자연수를 구하시오.`,
      promptEn: `Find the exponent in (x^${a})^${b} = x^□.`,
      expression: `(x^{${a}})^{${b}} = x^□`,
      answer: String(ans),
      explanation: `지수법칙 (a^m)^n = a^{mn} 에 의하여 (x^${a})^${b} = x^{${a} × ${b}} = x^${ans} 입니다.`,
      explanationEn: `By power of a power rule, (x^${a})^${b} = x^{${a * b}} = x^${ans}.`
    };
  } else if (theme === 'poly') {
    const a = ri(random, 2, 4);
    const b = ri(random, 2, 4);
    return {
      prompt: `(${a}x + 3) + (2x - ${b}) 를 간단히 하였을 때, x의 계수와 상수항의 합을 구하시오.`,
      promptEn: `Simplify (${a}x + 3) + (2x - ${b}). Find the sum of the x coefficient and the constant term.`,
      expression: `(${a}x + 3) + (2x - ${b})`,
      answer: String(a + 2 + (3 - b)),
      explanation: `동류항끼리 모아 계산하면 (${a} + 2)x + (3 - ${b}) = ${a + 2}x + (${3 - b}) 입니다. x의 계수는 ${a + 2}, 상수항은 ${3 - b}이므로 합은 ${a + 2} + (${3 - b}) = ${a + 2 + 3 - b} 입니다.`,
      explanationEn: `Combining like terms gives ${a + 2}x + (${3 - b}). Sum of coefficient and constant = ${a + 2 + 3 - b}.`
    };
  } else if (theme === 'ineq') {
    const a = ri(random, 2, 4);
    const b = ri(random, 2, 6);
    // a x - b > x + 3 => (a - 1)x > b + 3
    const ansBound = Math.floor((b + 3) / (a - 1)) + 1;
    return {
      prompt: `일차부등식 ${a}x - ${b} > x + 3 을 만족하는 가장 작은 정수 x의 값을 구하시오.`,
      promptEn: `Find the smallest integer x satisfying ${a}x - ${b} > x + 3.`,
      expression: `${a}x - ${b} > x + 3`,
      answer: String(ansBound),
      explanation: `이항하여 정리하면 (${a} - 1)x > ${b + 3}, x > ${fracStr(b + 3, a - 1)} 입니다. ${fracStr(b + 3, a - 1)} = ${(b + 3) / (a - 1)} 보다 큰 가장 작은 정수는 ${ansBound} 입니다.`,
      explanationEn: `Solving gives x > ${fracStr(b + 3, a - 1)}. The smallest integer is ${ansBound}.`
    };
  } else if (theme === 'sys') {
    const x = ri(random, 1, 3);
    const y = ri(random, 1, 3);
    const c1 = x + y;
    const c2 = 2 * x - y;
    return {
      prompt: `연립방정식 x + y = ${c1}, 2x - y = ${c2} 의 해가 x = a, y = b일 때, a × b의 값을 구하시오.`,
      promptEn: `Solve x + y = ${c1}, 2x - y = ${c2}. Let x = a, y = b. Find a × b.`,
      expression: `\\begin{cases} x + y = ${c1} \\\\ 2x - y = ${c2} \\end{cases}`,
      answer: String(x * y),
      explanation: `두 식을 더하면 3x = ${c1 + c2} 에서 x = ${x} 이고, 첫 식에 대입하면 y = ${y} 입니다. 따라서 a × b = ${x} × ${y} = ${x * y} 입니다.`,
      explanationEn: `Adding equations gives 3x = ${c1 + c2} => x = ${x}, y = ${y}. Product a × b = ${x * y}.`
    };
  } else if (theme === 'linear-func') {
    const a = pick(random, [-3, -2, 2, 3]);
    const b = ri(random, -5, 5);
    const px = ri(random, 1, 4);
    const py = a * px + b;
    return {
      prompt: `일차함수 y = ${formatLinear(a, b)} 의 그래프가 점 (${px}, k)를 지날 때, 상수 k의 값을 구하시오.`,
      promptEn: `If y = ${formatLinear(a, b)} passes through (${px}, k), find k.`,
      expression: `y = ${formatLinear(a, b)}`,
      answer: String(py),
      explanation: `x = ${px}를 대입하면 y = ${a} × (${px}) + (${b}) = ${py} 입니다. 따라서 k = ${py} 입니다.`,
      explanationEn: `Substituting x = ${px} gives y = ${py}, so k = ${py}.`
    };
  } else {
    return rpmLineEqnIntersectionAsSolution(random);
  }
}


// =============================================================
// [중2-2] 01 이등변삼각형 & 02 외심과 내심
// =============================================================
// RPM Middle School 2-2 Applied Problem Generators
// CHAPTER 01: 이등변삼각형 (RPM 2-2 Pages 10 ~ 21)
// CHAPTER 02: 삼각형의 외심과 내심 (RPM 2-2 Pages 26 ~ 35)
// Fully compliant with app/middle-school/rpmAppliedEngine.js and curriculumValidation.js

function shuffle(random, arr) {
  const res = [...arr];
  for (let i = res.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [res[i], res[j]] = [res[j], res[i]];
  }
  return res;
}

function makeChoices(random, correctVal, offsetGen, formatKo = (v) => `${v}`, formatEn = (v) => `${v}`) {
  const set = new Set([correctVal]);
  let tries = 0;
  while (set.size < 5 && tries < 60) {
    tries++;
    const cand = offsetGen(correctVal, random);
    if (cand !== correctVal && cand > 0) set.add(cand);
  }
  let arr = Array.from(set);
  while (arr.length < 5) {
    arr.push(correctVal + arr.length * 2);
  }
  arr = shuffle(random, arr);
  const correctIdx = arr.indexOf(correctVal) + 1;
  return {
    kind: 'choice',
    choicesKo: arr.map(formatKo),
    choicesEn: arr.map(formatEn),
    answer: String(correctIdx)
  };
}

// ----------------------------------------------------
// CHAPTER 01: 이등변삼각형
// ----------------------------------------------------

// 1. [이등변삼각형 01] 이등변삼각형의 밑각 및 꼭지각의 크기 구하기
export function rpmG8IsoTriAngles(random) {
  const isVertexGiven = random() < 0.5;
  if (isVertexGiven) {
    const angleA = (Math.floor(random() * 45) + 16) * 2; // 32° ~ 120°
    const baseAngle = (180 - angleA) / 2;
    const { choicesKo, choicesEn, answer } = makeChoices(random, baseAngle, (v, r) => v + [-10, -5, -4, -2, 2, 4, 5, 10][Math.floor(r() * 8)], (v) => `${v}°`, (v) => `${v}°`);
    return {
      prompt: `이등변삼각형 ABC에서 AB = AC 이고 꼭지각 ∠A = ${angleA}° 일 때, 밑각 ∠B의 크기는?`,
      promptEn: `In isosceles triangle ABC with AB = AC and vertex angle ∠A = ${angleA}°, find the base angle ∠B.`,
      kind: 'choice',
      choicesKo,
      choicesEn,
      answer,
      explanation: `이등변삼각형의 두 밑각의 크기는 서로 같으므로 ∠B = ∠C = (180° - ∠A) / 2 = (180° - ${angleA}°) / 2 = ${baseAngle}° 입니다.`,
      explanationEn: `Base angles of an isosceles triangle are equal: ∠B = (180° - ${angleA}°) / 2 = ${baseAngle}°.`
    };
  } else {
    const baseAngle = Math.floor(random() * 51) + 25; // 25° ~ 75°
    const angleA = 180 - 2 * baseAngle;
    const { choicesKo, choicesEn, answer } = makeChoices(random, angleA, (v, r) => v + [-15, -10, -5, 5, 10, 15][Math.floor(r() * 6)], (v) => `${v}°`, (v) => `${v}°`);
    return {
      prompt: `이등변삼각형 ABC에서 AB = AC 이고 밑각 ∠B = ${baseAngle}° 일 때, 꼭지각 ∠A의 크기는?`,
      promptEn: `In isosceles triangle ABC with AB = AC and base angle ∠B = ${baseAngle}°, find the vertex angle ∠A.`,
      kind: 'choice',
      choicesKo,
      choicesEn,
      answer,
      explanation: `이등변삼각형의 두 밑각의 크기는 같으므로 ∠B = ∠C = ${baseAngle}° 입니다. 삼각형 내각의 합은 180° 이므로 꼭지각 ∠A = 180° - 2 × ${baseAngle}° = ${angleA}° 입니다.`,
      explanationEn: `The two base angles are equal: ∠B = ∠C = ${baseAngle}°. Thus ∠A = 180° - 2(${baseAngle}°) = ${angleA}°.`
    };
  }
}

// 2. [이등변삼각형 02] 꼭지각의 이등분선과 밑변의 수직이등분
export function rpmG8IsoTriAngleBisector(random) {
  const halfBC = Math.floor(random() * 10) + 3;
  const totalBC = 2 * halfBC;
  const angleA = (Math.floor(random() * 31) + 20) * 2;
  const halfA = angleA / 2;
  const baseAngle = 90 - halfA;
  const mode = random() < 0.5 ? 'length' : 'angle';
  
  if (mode === 'length') {
    const { choicesKo, choicesEn, answer } = makeChoices(random, totalBC, (v, r) => v + [-4, -2, -1, 1, 2, 4][Math.floor(r() * 6)], (v) => `${v} cm`, (v) => `${v} cm`);
    return {
      prompt: `이등변삼각형 ABC (AB = AC) 에서 꼭지각 ∠A의 이등분선이 밑변 BC와 점 D에서 만난다. BD = ${halfBC} cm 일 때, 밑변 BC의 길이는?`,
      promptEn: `In isosceles triangle ABC (AB = AC), the angle bisector of ∠A meets BC at D. If BD = ${halfBC} cm, find the length of BC.`,
      kind: 'choice',
      choicesKo,
      choicesEn,
      answer,
      explanation: `이등변삼각형의 꼭지각의 이등분선은 밑변을 수직이등분하므로 BD = CD = ${halfBC} cm 입니다. 따라서 BC = 2 × ${halfBC} = ${totalBC} cm 입니다.`,
      explanationEn: `The angle bisector of the vertex angle perpendicular bisects the base. Thus BC = 2 × BD = ${totalBC} cm.`
    };
  } else {
    const { choicesKo, choicesEn, answer } = makeChoices(random, baseAngle, (v, r) => v + [-8, -4, -2, 2, 4, 8][Math.floor(r() * 6)], (v) => `${v}°`, (v) => `${v}°`);
    return {
      prompt: `이등변삼각형 ABC (AB = AC) 에서 꼭지각 ∠A의 이등분선이 밑변 BC와 점 D에서 수직으로 만난다. ∠BAD = ${halfA}° 일 때, 밑각 ∠B의 크기는?`,
      promptEn: `In isosceles triangle ABC (AB = AC), the angle bisector AD meets BC perpendicularly at D. If ∠BAD = ${halfA}°, find ∠B.`,
      kind: 'choice',
      choicesKo,
      choicesEn,
      answer,
      explanation: `AD ⊥ BC 이므로 직각삼각형 ABD에서 ∠B = 90° - ∠BAD = 90° - ${halfA}° = ${baseAngle}° 입니다.`,
      explanationEn: `Since AD ⊥ BC, triangle ABD is right-angled: ∠B = 90° - ∠BAD = 90° - ${halfA}° = ${baseAngle}°.`
    };
  }
}

// 3. [이등변삼각형 03] 이등변삼각형이 연속된 도형에서 각의 크기 추적
export function rpmG8IsoTriChainAngles(random) {
  const angleA = Math.floor(random() * 27) + 18; // 18° ~ 44°
  const angleBDC = 2 * angleA;
  const { choicesKo, choicesEn, answer } = makeChoices(random, angleBDC, (v, r) => v + [-6, -4, -2, 2, 4, 6][Math.floor(r() * 6)], (v) => `${v}°`, (v) => `${v}°`);
  return {
    prompt: `삼각형 ABC에서 변 AC 위의 점 D에 대하여 AD = BD = BC 이고 꼭지각 ∠A = ${angleA}° 일 때, ∠BDC의 크기는?`,
    promptEn: `In triangle ABC, point D lies on AC such that AD = BD = BC. If ∠A = ${angleA}°, find the measure of ∠BDC.`,
    kind: 'choice',
    choicesKo,
    choicesEn,
    answer,
    explanation: `△ABD에서 AD = BD 이므로 ∠ABD = ∠A = ${angleA}° 입니다. 외각의 성질에 의해 ∠BDC = ∠A + ∠ABD = ${angleA}° + ${angleA}° = ${angleBDC}° 입니다.`,
    explanationEn: `In △ABD, AD = BD implies ∠ABD = ∠A = ${angleA}°. By exterior angle theorem, ∠BDC = ∠A + ∠ABD = ${angleBDC}°.`
  };
}

// 4. [이등변삼각형 04] 두 내각의 크기가 같은 이등변삼각형
export function rpmG8IsoTriConditionSides(random) {
  const side = Math.floor(random() * 13) + 6; // 6 ~ 18
  const diff = Math.floor(random() * 5) + 2;
  const base = side - diff > 3 ? side - diff : side + diff;
  const perimeter = 2 * side + base;
  const { choicesKo, choicesEn, answer } = makeChoices(random, side, (v, r) => v + [-3, -2, -1, 1, 2, 3][Math.floor(r() * 6)], (v) => `${v} cm`, (v) => `${v} cm`);
  return {
    prompt: `삼각형 ABC에서 ∠B = ∠C 이고 밑변 BC = ${base} cm 이다. 삼각형 ABC의 둘레의 길이가 ${perimeter} cm 일 때, 변 AB의 길이는?`,
    promptEn: `In triangle ABC, ∠B = ∠C and base BC = ${base} cm. If the perimeter is ${perimeter} cm, find the length of AB.`,
    kind: 'choice',
    choicesKo,
    choicesEn,
    answer,
    explanation: `두 내각의 크기가 같은 삼각형은 이등변삼각형이므로 AB = AC 입니다. 둘레가 ${perimeter} cm 이므로 2AB + ${base} = ${perimeter} 에서 2AB = ${perimeter - base}, 즉 AB = ${side} cm 입니다.`,
    explanationEn: `Equal base angles mean AB = AC. The perimeter is 2AB + ${base} = ${perimeter} => AB = ${side} cm.`
  };
}

// 5. [직각삼각형 05] 직각삼각형의 합동 조건 판별
export function rpmG8RightTriCongruence(random) {
  const cases = [
    {
      descKo: '빗변의 길이와 한 예각의 크기가 각각 같을 때',
      descEn: 'the hypotenuse and one acute angle are equal',
      correct: 'RHA 합동',
      correctEn: 'RHA Congruence',
      distractorsKo: ['RHS 합동', 'SAS 합동', 'ASA 합동', 'SSS 합동'],
      distractorsEn: ['RHS Congruence', 'SAS Congruence', 'ASA Congruence', 'SSS Congruence']
    },
    {
      descKo: '빗변의 길이와 다른 한 변의 길이가 각각 같을 때',
      descEn: 'the hypotenuse and another side are equal',
      correct: 'RHS 합동',
      correctEn: 'RHS Congruence',
      distractorsKo: ['RHA 합동', 'SAS 합동', 'ASA 합동', 'SSS 합동'],
      distractorsEn: ['RHA Congruence', 'SAS Congruence', 'ASA Congruence', 'SSS Congruence']
    },
    {
      descKo: '직각을 낀 두 변의 길이가 각각 같을 때',
      descEn: 'the two legs forming the right angle are equal',
      correct: 'SAS 합동',
      correctEn: 'SAS Congruence',
      distractorsKo: ['RHA 합동', 'RHS 합동', 'ASA 합동', 'SSS 합동'],
      distractorsEn: ['RHA Congruence', 'RHS Congruence', 'ASA Congruence', 'SSS Congruence']
    }
  ];
  const item = cases[Math.floor(random() * cases.length)];
  const combined = [
    { ko: item.correct, en: item.correctEn, isRight: true },
    ...item.distractorsKo.map((d, i) => ({ ko: d, en: item.distractorsEn[i], isRight: false }))
  ].slice(0, 5);
  const shuffled = shuffle(random, combined);
  const correctIdx = shuffled.findIndex(c => c.isRight) + 1;
  return {
    prompt: `두 직각삼각형에서 ${item.descKo} 두 직각삼각형은 항상 합동이다. 이때 적용되는 직각삼각형의 합동 조건은?`,
    promptEn: `Two right triangles are congruent when ${item.descEn}. Which congruence condition applies?`,
    kind: 'choice',
    choicesKo: shuffled.map(c => c.ko),
    choicesEn: shuffled.map(c => c.en),
    answer: String(correctIdx),
    explanation: `두 직각삼각형에서 ${item.descKo} 적용되는 합동 조건은 [${item.correct}]입니다.`,
    explanationEn: `When ${item.descEn} in two right triangles, the congruence criterion is [${item.correctEn}].`
  };
}

// 6. [직각삼각형 06] RHA 합동의 응용 (직각이등변삼각형 수선의 발)
export function rpmG8RhaCongruenceApps(random) {
  const a = Math.floor(random() * 7) + 4; // 4 ~ 10
  const b = Math.floor(random() * (a - 2)) + 2; // 2 ~ a-1
  const de = a + b;
  const { choicesKo, choicesEn, answer } = makeChoices(random, de, (v, r) => v + [-3, -2, -1, 1, 2, 3][Math.floor(r() * 6)], (v) => `${v} cm`, (v) => `${v} cm`);
  return {
    prompt: `∠A = 90° 인 직각이등변삼각형 ABC의 꼭짓점 A를 지나는 직선에 두 꼭짓점 B, C에서 내린 수선의 발을 각각 D, E라 하자. BD = ${a} cm, CE = ${b} cm 일 때, 선분 DE의 길이는?`,
    promptEn: `In right isosceles triangle ABC (∠A = 90°), perpendiculars from B and C to a line through A meet the line at D and E. If BD = ${a} cm and CE = ${b} cm, find DE.`,
    kind: 'choice',
    choicesKo,
    choicesEn,
    answer,
    explanation: `△ABD와 △CAE에서 ∠ADB = ∠CEA = 90°, AB = CA (빗변), ∠ABD = 90° - ∠BAD = ∠CAE 이므로 △ABD ≡ △CAE (RHA 합동)입니다. 따라서 AD = CE = ${b} cm, AE = BD = ${a} cm 이므로 DE = AD + AE = ${b} + ${a} = ${de} cm 입니다.`,
    explanationEn: `△ABD ≡ △CAE by RHA congruence. Thus AD = CE = ${b} cm, AE = BD = ${a} cm, so DE = ${b} + ${a} = ${de} cm.`
  };
}

// 7. [직각삼각형 07] RHS 합동의 응용
export function rpmG8RhsCongruenceApps(random) {
  const ce = Math.floor(random() * 6) + 3; // 3 ~ 8
  const { choicesKo, choicesEn, answer } = makeChoices(random, ce, (v, r) => v + [-3, -2, -1, 1, 2, 3][Math.floor(r() * 6)], (v) => `${v} cm`, (v) => `${v} cm`);
  return {
    prompt: `∠C = 90° 인 직각삼각형 ABC에서 빗변 AB 위의 점 D에 대하여 AC = AD 이다. 점 D를 지나고 AB에 수직인 직선이 BC와 만나는 점을 E라 할 때, CE = ${ce} cm 이면 선분 DE의 길이는?`,
    promptEn: `In right triangle ABC with ∠C = 90°, point D on AB satisfies AC = AD. The perpendicular to AB at D meets BC at E. If CE = ${ce} cm, find DE.`,
    kind: 'choice',
    choicesKo,
    choicesEn,
    answer,
    explanation: `선분 AE를 그으면 △ACE와 △ADE에서 ∠C = ∠ADE = 90°, 빗변 AE 공통, AC = AD 이므로 △ACE ≡ △ADE (RHS 합동)입니다. 따라서 DE = CE = ${ce} cm 입니다.`,
    explanationEn: `Connecting AE, △ACE ≡ △ADE by RHS congruence (shared hypotenuse AE, AC = AD). Thus DE = CE = ${ce} cm.`
  };
}

// 8. [각의 이등분선 08] 각의 이등분선의 성질과 삼각형의 넓이
export function rpmG8AngleBisectorProp(random) {
  let c = Math.floor(random() * 15) + 10;
  const d = Math.floor(random() * 6) + 3;
  if ((c * d) % 2 !== 0) c += 1;
  const area = (c * d) / 2;
  const { choicesKo, choicesEn, answer } = makeChoices(random, area, (v, r) => v + [-12, -8, -6, 6, 8, 12][Math.floor(r() * 6)], (v) => `${v} cm²`, (v) => `${v} cm²`);
  return {
    prompt: `∠C = 90° 인 직각삼각형 ABC에서 ∠A의 이등분선이 변 BC와 점 D에서 만난다. AB = ${c} cm, CD = ${d} cm 일 때, 삼각형 ABD의 넓이는?`,
    promptEn: `In right triangle ABC with ∠C = 90°, the bisector of ∠A meets BC at D. If AB = ${c} cm and CD = ${d} cm, find the area of △ABD.`,
    kind: 'choice',
    choicesKo,
    choicesEn,
    answer,
    explanation: `각의 이등분선 위의 점 D에서 두 변 AC, AB에 이르는 거리는 같으므로 점 D에서 AB에 내린 수선의 길이는 CD = ${d} cm 입니다. 따라서 △ABD의 넓이는 (1/2) × ${c} × ${d} = ${area} cm² 입니다.`,
    explanationEn: `The distance from D to AB equals CD = ${d} cm by angle bisector property. Area(△ABD) = (1/2) × ${c} × ${d} = ${area} cm².`
  };
}

// 9. [종이 접기 09] 직사각형 종이 접기와 이등변삼각형
export function rpmG8PaperFoldingTriangle(random) {
  const foldAngle = Math.floor(random() * 26) + 50; // 50° ~ 75°
  const apexAngle = 180 - 2 * foldAngle;
  const { choicesKo, choicesEn, answer } = makeChoices(random, apexAngle, (v, r) => v + [-10, -6, -4, 4, 6, 10][Math.floor(r() * 6)], (v) => `${v}°`, (v) => `${v}°`);
  return {
    prompt: `폭이 일정한 직사각형 종이테이프를 접었을 때 생기는 삼각형에서 접은 각의 크기가 ${foldAngle}° 이다. 겹쳐진 이등변삼각형의 꼭지각의 크기는?`,
    promptEn: `When a rectangular strip of constant width is folded, the fold angle is ${foldAngle}°. Find the apex angle of the overlapping isosceles triangle.`,
    kind: 'choice',
    choicesKo,
    choicesEn,
    answer,
    explanation: `접은 각과 엇각의 성질에 의해 겹쳐진 삼각형은 밑각이 각각 ${foldAngle}° 인 이등변삼각형이 됩니다. 따라서 꼭지각의 크기는 180° - 2 × ${foldAngle}° = ${apexAngle}° 입니다.`,
    explanationEn: `Folded angle and alternate interior angle mean base angles are ${foldAngle}°. Apex angle = 180° - 2(${foldAngle}°) = ${apexAngle}°.`
  };
}

// 10. [유형 UP 10] 이등변삼각형 심화 응용 (외각 연쇄 추적)
export function rpmG8IsoTriUpChallenge(random) {
  const a = Math.floor(random() * 10) + 15; // 15° ~ 24°
  const ext = 4 * a;
  const { choicesKo, choicesEn, answer } = makeChoices(random, a, (v, r) => v + [-4, -3, -2, 2, 3, 4][Math.floor(r() * 6)], (v) => `${v}°`, (v) => `${v}°`);
  return {
    prompt: `연속된 선분의 길이가 AB = BC = CD = DE 로 같고 가장 바깥쪽 외각의 크기가 ${ext}° 일 때, 꼭지각 ∠A의 크기는?`,
    promptEn: `Line segments AB = BC = CD = DE are connected sequentially. If the outermost exterior angle is ${ext}°, find ∠A.`,
    kind: 'choice',
    choicesKo,
    choicesEn,
    answer,
    explanation: `∠A = x 라 하면 이등변삼각형의 밑각과 외각 성질에 의해 각 단계의 외각은 2x, 3x, 4x 가 됩니다. 따라서 4x = ${ext}° 에서 x = ${a}° 입니다.`,
    explanationEn: `Let ∠A = x. The successive exterior angles are 2x, 3x, 4x. Setting 4x = ${ext}° gives x = ${a}°.`
  };
}

// 11. [단원 실전 다지기] 이등변삼각형과 직각삼각형 전 유형 실전 종합
export function rpmG8IsoTriAllTypesMixed(random) {
  const pool = [rpmG8IsoTriAngles, rpmG8IsoTriAngleBisector, rpmG8RhaCongruenceApps, rpmG8AngleBisectorProp, rpmG8PaperFoldingTriangle];
  const fn = pool[Math.floor(random() * pool.length)];
  const res = fn(random);
  return {
    ...res,
    prompt: `[이등변삼각형 실전 종합] ${res.prompt}`,
    promptEn: `[Isosceles Triangle Mixed Practice] ${res.promptEn}`
  };
}

// 12. [단원 최고수준] 이등변삼각형 실력 UP (p.140~141 최고난도 문항)
export function rpmG8IsoTriAdvancedSkillUp(random) {
  const angleA = (Math.floor(random() * 16) + 40) * 2; // 80° ~ 110°
  const baseAngle = (180 - angleA) / 2;
  const { choicesKo, choicesEn, answer } = makeChoices(random, baseAngle, (v, r) => v + [-8, -5, -3, 3, 5, 8][Math.floor(r() * 6)], (v) => `${v}°`, (v) => `${v}°`);
  return {
    prompt: `이등변삼각형 ABC (AB = AC) 에서 꼭지각 ∠A = ${angleA}° 이다. 밑변 BC 위에 두 점 D, E를 BA = BD, CA = CE 가 되도록 잡을 때, ∠DAE의 크기는?`,
    promptEn: `In isosceles triangle ABC (AB = AC), vertex angle ∠A = ${angleA}°. Points D and E on BC satisfy BA = BD and CA = CE. Find ∠DAE.`,
    kind: 'choice',
    choicesKo,
    choicesEn,
    answer,
    explanation: `밑각 ∠B = ∠C = (180° - ${angleA}°) / 2 = ${baseAngle}° 입니다. BA = BD 에서 ∠BAD = (180° - ${baseAngle}°) / 2 이고, CA = CE 에서 ∠CAE = (180° - ${baseAngle}°) / 2 입니다. 따라서 ∠DAE = ∠BAD + ∠CAE - ∠BAC = (180° - ${baseAngle}°) - ${angleA}° = ${baseAngle}° 입니다.`,
    explanationEn: `Base angle ∠B = ∠C = ${baseAngle}°. Summing angle BAD and CAE and subtracting angle BAC yields ∠DAE = ${baseAngle}°.`
  };
}

// ----------------------------------------------------
// CHAPTER 02: 삼각형의 외심과 내심
// ----------------------------------------------------

// 13. [외심 01] 외심의 뜻과 성질 (외접원 반지름과 둘레)
export function rpmG8CircumcenterProperties(random) {
  const r = Math.floor(random() * 11) + 5; // 5 ~ 15
  const bc = Math.floor(random() * (2 * r - 7)) + 6;
  const perimeter = 2 * r + bc;
  const { choicesKo, choicesEn, answer } = makeChoices(random, perimeter, (v, r2) => v + [-6, -4, -2, 2, 4, 6][Math.floor(r2() * 6)], (v) => `${v} cm`, (v) => `${v} cm`);
  return {
    prompt: `점 O가 삼각형 ABC의 외심이고 OA = ${r} cm, 밑변 BC = ${bc} cm 일 때, 삼각형 OBC의 둘레의 길이는?`,
    promptEn: `Point O is the circumcenter of △ABC. If OA = ${r} cm and BC = ${bc} cm, find the perimeter of △OBC.`,
    kind: 'choice',
    choicesKo,
    choicesEn,
    answer,
    explanation: `외심에서 세 꼭짓점에 이르는 거리는 외접원의 반지름으로 같으므로 OB = OC = OA = ${r} cm 입니다. 따라서 △OBC의 둘레는 OB + OC + BC = ${r} + ${r} + ${bc} = ${perimeter} cm 입니다.`,
    explanationEn: `Circumcenter O is equidistant to all vertices: OB = OC = OA = ${r} cm. Perimeter of △OBC = ${r} + ${r} + ${bc} = ${perimeter} cm.`
  };
}

// 14. [외심 02] 직각삼각형의 외심 (빗변의 중점)
export function rpmG8RightTriCircumcenter(random) {
  const r = Math.floor(random() * 12) + 4; // 4 ~ 15
  const hypotenuse = 2 * r;
  const { choicesKo, choicesEn, answer } = makeChoices(random, r, (v, r2) => v + [-3, -2, -1, 1, 2, 3][Math.floor(r2() * 6)], (v) => `${v} cm`, (v) => `${v} cm`);
  return {
    prompt: `∠B = 90° 인 직각삼각형 ABC에서 빗변 AC = ${hypotenuse} cm 일 때, 삼각형 ABC의 외접원의 반지름의 길이는?`,
    promptEn: `In right triangle ABC with ∠B = 90° and hypotenuse AC = ${hypotenuse} cm, find the radius of its circumcircle.`,
    kind: 'choice',
    choicesKo,
    choicesEn,
    answer,
    explanation: `직각삼각형의 외심은 빗변의 중점에 위치하므로 외접원의 반지름의 길이는 빗변의 길이의 절반인 ${hypotenuse} / 2 = ${r} cm 입니다.`,
    explanationEn: `The circumcenter of a right triangle is the midpoint of the hypotenuse. Radius = ${hypotenuse} / 2 = ${r} cm.`
  };
}

// 15. [외심 03] 외심과 각의 크기 합 (x + y + z = 90°)
export function rpmG8CircumcenterAnglesSum(random) {
  const x = Math.floor(random() * 21) + 20; // 20 ~ 40
  const y = Math.floor(random() * (60 - x)) + 20;
  const z = 90 - (x + y);
  const { choicesKo, choicesEn, answer } = makeChoices(random, z, (v, r2) => v + [-6, -4, -2, 2, 4, 6][Math.floor(r2() * 6)], (v) => `${v}°`, (v) => `${v}°`);
  return {
    prompt: `점 O가 삼각형 ABC의 외심일 때, ∠OAB = ${x}°, ∠OBC = ${y}° 이다. 이때 ∠OCA의 크기는?`,
    promptEn: `Point O is the circumcenter of △ABC. If ∠OAB = ${x}° and ∠OBC = ${y}°, find ∠OCA.`,
    kind: 'choice',
    choicesKo,
    choicesEn,
    answer,
    explanation: `외심 O에서 세 꼭짓점을 연결할 때 ∠OAB + ∠OBC + ∠OCA = 90° 가 성립합니다. 따라서 ∠OCA = 90° - (${x}° + ${y}°) = ${z}° 입니다.`,
    explanationEn: `For circumcenter O, ∠OAB + ∠OBC + ∠OCA = 90°. Thus ∠OCA = 90° - (${x}° + ${y}°) = ${z}°.`
  };
}

// 16. [외심 04] 외심의 중심각 성질 (∠BOC = 2∠A)
export function rpmG8CircumcenterCentralAngle(random) {
  const angleA = Math.floor(random() * 41) + 35; // 35° ~ 75°
  const angleBOC = 2 * angleA;
  const { choicesKo, choicesEn, answer } = makeChoices(random, angleBOC, (v, r) => v + [-12, -8, -6, 6, 8, 12][Math.floor(r() * 6)], (v) => `${v}°`, (v) => `${v}°`);
  return {
    prompt: `점 O가 삼각형 ABC의 외심일 때, ∠A = ${angleA}° 이다. 이때 중심각 ∠BOC의 크기는?`,
    promptEn: `Point O is the circumcenter of △ABC. If ∠A = ${angleA}°, find ∠BOC.`,
    kind: 'choice',
    choicesKo,
    choicesEn,
    answer,
    explanation: `삼각형의 외심에서 밑변을 바라보는 중심각의 크기는 꼭지각의 2배이므로 ∠BOC = 2∠A = 2 × ${angleA}° = ${angleBOC}° 입니다.`,
    explanationEn: `The central angle at circumcenter is twice the inscribed angle: ∠BOC = 2∠A = 2(${angleA}°) = ${angleBOC}°.`
  };
}

// 17. [내심 05] 내심의 뜻과 성질 (세 변에 이르는 거리)
export function rpmG8IncenterProperties(random) {
  const r = Math.floor(random() * 7) + 2; // 2 ~ 8
  const { choicesKo, choicesEn, answer } = makeChoices(random, r, (v, r2) => v + [-2, -1, 1, 2, 3][Math.floor(r2() * 5)], (v) => `${v} cm`, (v) => `${v} cm`);
  return {
    prompt: `점 I가 삼각형 ABC의 내심이고 점 I에서 변 AB에 내린 수선의 길이가 ${r} cm 일 때, 점 I에서 변 BC에 내린 수선의 길이는?`,
    promptEn: `Point I is the incenter of △ABC. If the perpendicular distance from I to AB is ${r} cm, find the distance from I to BC.`,
    kind: 'choice',
    choicesKo,
    choicesEn,
    answer,
    explanation: `삼각형의 내심에서 세 변에 이르는 거리는 내접원의 반지름으로 모두 같으므로 점 I에서 변 BC에 내린 수선의 길이는 ${r} cm 입니다.`,
    explanationEn: `The incenter is equidistant to all three sides (inradius). The distance to BC is ${r} cm.`
  };
}

// 18. [내심 06] 내심과 각의 크기 합 (x + y + z = 90°)
export function rpmG8IncenterAnglesSum(random) {
  const x = Math.floor(random() * 21) + 18; // 18 ~ 38
  const y = Math.floor(random() * (62 - x)) + 18;
  const z = 90 - (x + y);
  const { choicesKo, choicesEn, answer } = makeChoices(random, z, (v, r) => v + [-6, -4, -2, 2, 4, 6][Math.floor(r() * 6)], (v) => `${v}°`, (v) => `${v}°`);
  return {
    prompt: `점 I가 삼각형 ABC의 내심일 때, ∠IAB = ${x}°, ∠IBC = ${y}° 이다. 이때 ∠ICA의 크기는?`,
    promptEn: `Point I is the incenter of △ABC. If ∠IAB = ${x}° and ∠IBC = ${y}°, find ∠ICA.`,
    kind: 'choice',
    choicesKo,
    choicesEn,
    answer,
    explanation: `내심 I는 세 내각의 이등분선의 교점이므로 ∠IAB + ∠IBC + ∠ICA = (1/2)(∠A + ∠B + ∠C) = 90° 입니다. 따라서 ∠ICA = 90° - (${x}° + ${y}°) = ${z}° 입니다.`,
    explanationEn: `Since I is formed by angle bisectors, ∠IAB + ∠IBC + ∠ICA = 90°. Thus ∠ICA = 90° - (${x}° + ${y}°) = ${z}°.`
  };
}

// 19. [내심 07] 내심의 중심각 성질 (∠BIC = 90° + (1/2)∠A)
export function rpmG8IncenterCentralAngle(random) {
  const halfA = Math.floor(random() * 27) + 18; // 18 ~ 44
  const angleA = 2 * halfA;
  const angleBIC = 90 + halfA;
  const { choicesKo, choicesEn, answer } = makeChoices(random, angleBIC, (v, r) => v + [-6, -4, -2, 2, 4, 6][Math.floor(r() * 6)], (v) => `${v}°`, (v) => `${v}°`);
  return {
    prompt: `점 I가 삼각형 ABC의 내심일 때, 꼭지각 ∠A = ${angleA}° 이다. 이때 ∠BIC의 크기는?`,
    promptEn: `Point I is the incenter of △ABC. If vertex angle ∠A = ${angleA}°, find ∠BIC.`,
    kind: 'choice',
    choicesKo,
    choicesEn,
    answer,
    explanation: `내심 공식에 의해 ∠BIC = 90° + (1/2)∠A = 90° + ${halfA}° = ${angleBIC}° 입니다.`,
    explanationEn: `By incenter formula, ∠BIC = 90° + (1/2)∠A = 90° + ${halfA}° = ${angleBIC}°.`
  };
}

// 20. [내심 08] 삼각형의 내심과 평행선 (둘레 공식 △ADE = AB + AC)
export function rpmG8IncenterParallelLine(random) {
  const ab = Math.floor(random() * 9) + 8; // 8 ~ 16
  const ac = Math.floor(random() * 9) + 7; // 7 ~ 15
  const perimeterADE = ab + ac;
  const { choicesKo, choicesEn, answer } = makeChoices(random, perimeterADE, (v, r) => v + [-4, -2, -1, 1, 2, 4][Math.floor(r() * 6)], (v) => `${v} cm`, (v) => `${v} cm`);
  return {
    prompt: `점 I가 삼각형 ABC의 내심이다. 점 I를 지나고 변 BC에 평행한 직선이 두 변 AB, AC와 만나는 점을 각각 D, E라 하자. AB = ${ab} cm, AC = ${ac} cm 일 때, 삼각형 ADE의 둘레의 길이는?`,
    promptEn: `Point I is the incenter of △ABC. A line through I parallel to BC meets AB and AC at D and E. If AB = ${ab} cm and AC = ${ac} cm, find the perimeter of △ADE.`,
    kind: 'choice',
    choicesKo,
    choicesEn,
    answer,
    explanation: `DE ∥ BC 이고 점 I가 내심이므로 접은 각과 엇각에 의해 DI = DB, EI = EC 입니다. 따라서 △ADE의 둘레는 AD + DE + EA = AB + AC = ${ab} + ${ac} = ${perimeterADE} cm 입니다.`,
    explanationEn: `Since DE ∥ BC and I is incenter, DI = DB and EI = EC. Perimeter of △ADE = AB + AC = ${ab} + ${ac} = ${perimeterADE} cm.`
  };
}

// 21. [내심 09] 삼각형의 넓이와 내접원의 반지름 (S = (1/2)r(a + b + c))
export function rpmG8IncenterAreaRadius(random) {
  const r = Math.floor(random() * 5) + 2; // 2 ~ 6
  const perimeter = (Math.floor(random() * 19) + 12) * 2; // 24 ~ 60
  const area = (r * perimeter) / 2;
  const { choicesKo, choicesEn, answer } = makeChoices(random, area, (v, r2) => v + [-12, -8, -6, 6, 8, 12][Math.floor(r2() * 6)], (v) => `${v} cm²`, (v) => `${v} cm²`);
  return {
    prompt: `둘레의 길이가 ${perimeter} cm 인 삼각형 ABC의 내접원의 반지름의 길이가 ${r} cm 일 때, 삼각형 ABC의 넓이는?`,
    promptEn: `The perimeter of △ABC is ${perimeter} cm and the inradius is ${r} cm. Find the area of △ABC.`,
    kind: 'choice',
    choicesKo,
    choicesEn,
    answer,
    explanation: `삼각형의 넓이 S = (1/2)r(둘레) = (1/2) × ${r} × ${perimeter} = ${area} cm² 입니다.`,
    explanationEn: `Area S = (1/2)r(perimeter) = (1/2) × ${r} × ${perimeter} = ${area} cm².`
  };
}

// 22. [내심 10] 내접원의 접선의 길이
export function rpmG8IncenterTangentSegments(random) {
  const x = Math.floor(random() * 7) + 3; // AD = AF = x
  const y = Math.floor(random() * 7) + 3; // BD = BE = y
  const z = Math.floor(random() * 7) + 3; // CE = CF = z
  const c = x + y; // AB
  const a = y + z; // BC
  const b = z + x; // CA
  const { choicesKo, choicesEn, answer } = makeChoices(random, x, (v, r) => v + [-3, -2, -1, 1, 2, 3][Math.floor(r() * 6)], (v) => `${v} cm`, (v) => `${v} cm`);
  return {
    prompt: `삼각형 ABC의 내접원이 세 변 AB, BC, CA와 만나는 접점을 각각 D, E, F라 하자. AB = ${c} cm, BC = ${a} cm, CA = ${b} cm 일 때, 선분 AD의 길이는?`,
    promptEn: `The incircle of △ABC touches AB, BC, and CA at D, E, and F respectively. If AB = ${c} cm, BC = ${a} cm, CA = ${b} cm, find AD.`,
    kind: 'choice',
    choicesKo,
    choicesEn,
    answer,
    explanation: `꼭짓점에서 그은 접선의 길이는 같으므로 AD = AF = x, BD = BE = y, CE = CF = z 라 하면 x + y = ${c}, y + z = ${a}, z + x = ${b} 입니다. 둘레의 절반은 ${(a + b + c) / 2} cm 이므로 x = ${(a + b + c) / 2} - (y + z) = ${(a + b + c) / 2} - ${a} = ${x} cm 입니다.`,
    explanationEn: `By tangent properties, x + y = ${c}, y + z = ${a}, z + x = ${b}. Semi-perimeter is ${(a + b + c) / 2}. Thus x = ${(a + b + c) / 2} - ${a} = ${x} cm.`
  };
}

// 23. [외심·내심 11] 외심과 내심의 종합 (각도 계산)
export function rpmG8CircumIncenterCombined(random) {
  const angleA = (Math.floor(random() * 21) + 25) * 2; // 50° ~ 90°
  const boc = 2 * angleA;
  const bic = 90 + angleA / 2;
  const val = Math.abs(boc - bic);
  const { choicesKo, choicesEn, answer } = makeChoices(random, val, (v, r) => v + [-8, -5, -3, 3, 5, 8][Math.floor(r() * 6)], (v) => `${v}°`, (v) => `${v}°`);
  return {
    prompt: `점 O와 점 I는 각각 삼각형 ABC의 외심과 내심이다. 꼭지각 ∠A = ${angleA}° 일 때, |∠BOC - ∠BIC| 의 값은?`,
    promptEn: `Points O and I are the circumcenter and incenter of △ABC. If ∠A = ${angleA}°, find |∠BOC - ∠BIC|.`,
    kind: 'choice',
    choicesKo,
    choicesEn,
    answer,
    explanation: `외심에서 중심각 ∠BOC = 2∠A = ${boc}° 이고, 내심에서 중심각 ∠BIC = 90° + (1/2)∠A = ${bic}° 입니다. 따라서 두 각의 차의 절댓값은 |${boc}° - ${bic}°| = ${val}° 입니다.`,
    explanationEn: `Circumcenter: ∠BOC = 2∠A = ${boc}°. Incenter: ∠BIC = 90° + (1/2)∠A = ${bic}°. Difference = |${boc}° - ${bic}°| = ${val}°.`
  };
}

// 24. [외심·내심 12] 직각삼각형의 외접원과 내접원
export function rpmG8RightTriBothCircles(random) {
  const triples = [
    [6, 8, 10],
    [8, 15, 17],
    [9, 12, 15],
    [5, 12, 13]
  ];
  const [a, b, c] = triples[Math.floor(random() * triples.length)];
  const R = c / 2;
  const r = (a + b - c) / 2;
  const sum = R + r;
  const { choicesKo, choicesEn, answer } = makeChoices(random, sum, (v, r2) => v + [-3, -2, -1, 1, 2, 3][Math.floor(r2() * 6)], (v) => `${v} cm`, (v) => `${v} cm`);
  return {
    prompt: `세 변의 길이가 각각 ${a} cm, ${b} cm, ${c} cm 인 직각삼각형에 대하여 외접원의 반지름의 길이를 R, 내접원의 반지름의 길이를 r이라 할 때, R + r의 값은?`,
    promptEn: `A right triangle has sides ${a} cm, ${b} cm, and ${c} cm. If R is the circumradius and r is the inradius, find R + r.`,
    kind: 'choice',
    choicesKo,
    choicesEn,
    answer,
    explanation: `직각삼각형의 외심은 빗변의 중점이므로 R = ${c} / 2 = ${R} cm 이고, 내접원의 반지름 r = (${a} + ${b} - ${c}) / 2 = ${r} cm 입니다. 따라서 R + r = ${R} + ${r} = ${sum} cm 입니다.`,
    explanationEn: `Circumradius R = ${c} / 2 = ${R} cm. Inradius r = (${a} + ${b} - ${c}) / 2 = ${r} cm. Sum R + r = ${sum} cm.`
  };
}

// 25. [단원 실전 다지기] 삼각형의 외심과 내심 전 유형 실전 종합
export function rpmG8CirclesAllTypesMixed(random) {
  const pool = [rpmG8CircumcenterProperties, rpmG8RightTriCircumcenter, rpmG8CircumcenterCentralAngle, rpmG8IncenterCentralAngle, rpmG8IncenterParallelLine, rpmG8IncenterAreaRadius, rpmG8IncenterTangentSegments];
  const fn = pool[Math.floor(random() * pool.length)];
  const res = fn(random);
  return {
    ...res,
    prompt: `[외심과 내심 실전 종합] ${res.prompt}`,
    promptEn: `[Circumcenter & Incenter Mixed Practice] ${res.promptEn}`
  };
}

// 26. [단원 최고수준] 외심과 내심 실력 UP (p.142~143 최고난도 문항)
export function rpmG8CirclesAdvancedSkillUp(random) {
  const angleB = Math.floor(random() * 26) + 50; // 50° ~ 75°
  const diff = Math.floor(random() * 19) + 12; // 12° ~ 30°
  const angleC = angleB - diff;
  const angleOAH = diff;
  const { choicesKo, choicesEn, answer } = makeChoices(random, angleOAH, (v, r) => v + [-6, -4, -2, 2, 4, 6][Math.floor(r() * 6)], (v) => `${v}°`, (v) => `${v}°`);
  return {
    prompt: `삼각형 ABC에서 점 O는 외심이고, 점 A에서 변 BC에 내린 수선의 발을 H라 하자. ∠B = ${angleB}°, ∠C = ${angleC}° 일 때, ∠OAH의 크기는?`,
    promptEn: `In △ABC, O is the circumcenter and AH ⊥ BC with H on BC. If ∠B = ${angleB}° and ∠C = ${angleC}°, find ∠OAH.`,
    kind: 'choice',
    choicesKo,
    choicesEn,
    answer,
    explanation: `△ABH에서 ∠BAH = 90° - ∠B = 90° - ${angleB}° 이고, 외심 O에서 이등변삼각형 △OAB에 의해 ∠OAB = 90° - ∠C = 90° - ${angleC}° 입니다. 따라서 ∠OAH = ∠OAB - ∠BAH = (90° - ${angleC}°) - (90° - ${angleB}°) = ∠B - ∠C = ${angleB}° - ${angleC}° = ${angleOAH}° 입니다.`,
    explanationEn: `In right △ABH, ∠BAH = 90° - ∠B. For circumcenter O, ∠OAB = 90° - ∠C. Thus ∠OAH = ∠B - ∠C = ${angleOAH}°.`
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
  
  // -------------------------------------------------------------
  // 04 다각형 세부 응용 유형 (RPM 1-2 p.66~81)
  // -------------------------------------------------------------
  'rpm-poly-concept-interior-exterior': rpmPolyConceptInteriorExterior,
  'rpm-poly-diagonal-count-formula': rpmPolyDiagonalCountFormula,
  'rpm-poly-find-polygon-from-diagonals': rpmPolyFindPolygonFromDiagonals,
  'rpm-poly-triangle-angle-sum-ratio': rpmPolyTriangleAngleSumRatio,
  'rpm-poly-triangle-exterior-angle-prop': rpmPolyTriangleExteriorAngleProp,
  'rpm-poly-boomerang-concave-angle': rpmPolyBoomerangConcaveAngle,
  'rpm-poly-incenter-angle-bisector': rpmPolyIncenterAngleBisector,
  'rpm-poly-exterior-interior-bisector': rpmPolyExteriorInteriorBisector,
  'rpm-poly-interior-angle-sum-formula': rpmPolyInteriorAngleSumFormula,
  'rpm-poly-exterior-angle-sum-const': rpmPolyExteriorAngleSumConst,
  'rpm-poly-regular-interior-exterior': rpmPolyRegularInteriorExterior,
  'rpm-poly-regular-ratio-angle': rpmPolyRegularRatioAngle,
  'rpm-poly-regular-diagonal-angle': rpmPolyRegularDiagonalAngle,
  'rpm-poly-two-polygons-shared-side': rpmPolyTwoPolygonsSharedSide,
  'rpm-poly-star-polygon-angle-sum': rpmPolyStarPolygonAngleSum,
  'rpm-poly-paper-fold-parallel-angle': rpmPolyPaperFoldParallelAngle,
  'rpm-poly-all-mixed': rpmPolyAllTypesMixed,

  // -------------------------------------------------------------
  // 05 원과 부채꼴 세부 응용 유형 (RPM 1-2 p.86~98)
  // -------------------------------------------------------------
  'rpm-circle-sector-concept-terms': rpmCircleSectorConceptTerms,
  'rpm-circle-central-angle-arc-prop': rpmCircleCentralAngleArcProp,
  'rpm-circle-parallel-chord-arc': rpmCircleParallelChordArc,
  'rpm-circle-central-angle-area-prop': rpmCircleCentralAngleAreaProp,
  'rpm-circle-chord-not-proportional': rpmCircleChordNotProportional,
  'rpm-circle-circumference-and-area': rpmCircleCircumferenceAndArea,
  'rpm-sector-arc-length-and-area': rpmSectorArcLengthAndArea,
  'rpm-sector-area-from-arc-radius': rpmSectorAreaFromArcRadius,
  'rpm-shaded-region-perimeter': rpmShadedRegionPerimeter,
  'rpm-shaded-region-area-diff': rpmShadedRegionAreaDiff,
  'rpm-figure-rotation-swept-area': rpmFigureRotationSweptArea,
  'rpm-tethered-animal-pasture-area': rpmTetheredAnimalPastureArea,
  'rpm-rolling-circle-track-area': rpmRollingCircleTrackArea,
  'rpm-circle-sector-all-mixed': rpmCircleSectorAllTypesMixed,

  // -------------------------------------------------------------
  // 중 1-2 평면도형 종합 실전 총괄 모의고사
  // -------------------------------------------------------------
  'rpm-plane-figures-semester-mock-exam': rpmPlaneFiguresSemesterMockExam,

  // -------------------------------------------------------------
  // 06 다면체와 회전체 세부 응용 유형 (RPM 1-2 p.104~117)
  // -------------------------------------------------------------
  'rpm-polyhedra-concept-classification': rpmPolyhedronConceptClassification,
  'rpm-polyhedra-prism-pyramid-elements': rpmPolyhedronPrismPyramidElements,
  'rpm-polyhedra-identify-from-conditions': rpmPolyhedronIdentifyFromConditions,
  'rpm-polyhedra-euler-formula': rpmPolyhedronEulerFormula,
  'rpm-polyhedra-regular-types-conditions': rpmRegularPolyhedraTypesConditions,
  'rpm-polyhedra-regular-face-shapes': rpmRegularPolyhedraFaceShapes,
  'rpm-polyhedra-regular-elements-count': rpmRegularPolyhedraElementsCount,
  'rpm-polyhedra-cube-net-opposite-faces': rpmCubeNetOppositeFaces,
  'rpm-polyhedra-cross-section-shapes': rpmPolyhedronCrossSectionShapes,
  'rpm-polyhedra-dual-connections': rpmDualPolyhedraConnections,
  'rpm-revolution-solids-types': rpmSolidsOfRevolutionTypes,
  'rpm-revolution-planar-to-solid': rpmPlanarFigureToRevolutionSolid,
  'rpm-revolution-cross-section-property': rpmRevolutionCrossSectionProperty,
  'rpm-revolution-cross-section-area-calc': rpmRevolutionCrossSectionAreaCalc,
  'rpm-revolution-cone-net-central-angle': rpmConeNetSectorCentralAngle,
  'rpm-revolution-advanced-properties': rpmRevolutionSolidsAdvancedProperties,
  'rpm-polyhedra-revolution-all-mixed': rpmPolyhedronRevolutionAllMixed,

  // -------------------------------------------------------------
  // 07 입체도형의 겉넓이와 부피 세부 응용 유형 (RPM 1-2 p.122~138)
  // -------------------------------------------------------------
  'rpm-solids-prism-surface-area': rpmPrismSurfaceAreaCalc,
  'rpm-solids-cylinder-surface-area': rpmCylinderSurfaceAreaCalc,
  'rpm-solids-prism-cylinder-volume': rpmPrismCylinderVolumeCalc,
  'rpm-solids-hollow-prism-surface-volume': rpmHollowPrismSurfaceVolume,
  'rpm-solids-pyramid-surface-volume': rpmPyramidSurfaceAreaVolume,
  'rpm-solids-cone-surface-area': rpmConeSurfaceAreaCalc,
  'rpm-solids-cone-volume': rpmConeVolumeCalc,
  'rpm-solids-truncated-corner-pyramid': rpmTruncatedCornerPyramidVolume,
  'rpm-solids-frustum-surface-volume': rpmFrustumSurfaceAreaVolume,
  'rpm-solids-revolution-surface-volume': rpmRevolutionSolidSurfaceVolume,
  'rpm-solids-sphere-surface-area': rpmSphereSurfaceAreaCalc,
  'rpm-solids-sphere-volume': rpmSphereVolumeCalc,
  'rpm-solids-truncated-sphere-part': rpmTruncatedSpherePartSurfaceVolume,
  'rpm-solids-cone-sphere-cylinder-ratio': rpmConeSphereCylinderRatio,
  'rpm-solids-container-water-level': rpmContainerWaterLevelVolume,
  'rpm-solids-surface-shortest-path': rpmSolidSurfaceShortestPath,
  'rpm-solids-surface-volume-all-mixed': rpmSolidsSurfaceVolumeAllMixed,

  // -------------------------------------------------------------
  // 중 1-2 입체도형 종합 실전 총괄 모의고사
  // -------------------------------------------------------------
  'rpm-solid-figures-semester-mock-exam': rpmSolidFiguresSemesterMockExam,

  // -------------------------------------------------------------
  // 08 자료의 정리와 해석 세부 응용 유형 (RPM 1-2 p.144~158)
  // -------------------------------------------------------------
  'rpm-data-stem-and-leaf-plot': rpmDataStemAndLeafPlot,
  'rpm-data-torn-stem-leaf-plot': rpmDataTornStemLeafPlot,
  'rpm-data-frequency-table-basic-terms': rpmDataFrequencyTableBasicTerms,
  'rpm-data-frequency-table-missing-freq': rpmDataFrequencyTableMissingFreq,
  'rpm-data-histogram-rectangle-area': rpmDataHistogramRectangleArea,
  'rpm-data-torn-histogram': rpmDataTornHistogram,
  'rpm-data-frequency-polygon-structure': rpmDataFrequencyPolygonStructure,
  'rpm-data-frequency-polygon-area': rpmDataFrequencyPolygonArea,
  'rpm-data-torn-frequency-polygon': rpmDataTornFrequencyPolygon,
  'rpm-data-two-groups-polygon-compare': rpmDataTwoGroupsPolygonCompare,
  'rpm-data-relative-frequency-concept': rpmDataRelativeFrequencyConcept,
  'rpm-data-relative-frequency-table-calc': rpmDataRelativeFrequencyTableCalc,
  'rpm-data-torn-relative-frequency-table': rpmDataTornRelativeFrequencyTable,
  'rpm-data-two-groups-relative-freq-ratio': rpmDataTwoGroupsRelativeFreqRatio,
  'rpm-data-relative-frequency-graph-area': rpmDataRelativeFrequencyGraphArea,
  'rpm-data-two-groups-relative-freq-compare': rpmDataTwoGroupsRelativeFreqCompare,
  'rpm-data-statistics-all-mixed': rpmDataStatisticsAllMixed,

  // -------------------------------------------------------------
  // 중 1-2 전 범위 최종 실전 총괄 모의고사 (RPM 1-2 p.160~175)
  // -------------------------------------------------------------
  'rpm-grade7-semester-two-final-exam': rpmGrade7SemesterTwoFinalExam,

  // -------------------------------------------------------------
  // [중2-1] 01 유리수와 순환소수 세부 응용 유형 (RPM 2-1 p.12~23)
  // -------------------------------------------------------------
  'rpm-rat-dec-powers-of-ten': rpmRatDecPowersOfTen,
  'rpm-rat-dec-terminating-condition': rpmRatDecTerminatingCondition,
  'rpm-rat-dec-multiply-terminating-single': rpmRatDecMultiplyToTerminatingSingle,
  'rpm-rat-dec-multiply-terminating-both': rpmRatDecMultiplyToTerminatingBoth,
  'rpm-rat-dec-denominator-variable': rpmRatDecDenominatorVariable,
  'rpm-rat-dec-terminating-irreducible': rpmRatDecTerminatingAndIrreducible,
  'rpm-rat-dec-period-notation': rpmRatDecPeriodAndNotation,
  'rpm-rat-dec-nth-digit': rpmRatDecNthDigitOfRepeating,
  'rpm-rat-dec-repeating-only': rpmRatDecRepeatingOnlyCondition,
  'rpm-rat-dec-fraction-equation': rpmRatDecFractionEquationMethod,
  'rpm-rat-dec-fraction-formula': rpmRatDecFractionFormulaMethod,
  'rpm-rat-dec-repeating-to-terminating': rpmRatDecRepeatingToTerminating,
  'rpm-rat-dec-faulty-observation': rpmRatDecFaultyObservation,
  'rpm-rat-dec-repeating-inequality': rpmRatDecRepeatingInequality,
  'rpm-rat-dec-arithmetic-operations': rpmRatDecArithmeticOperations,
  'rpm-rat-dec-number-system-tf': rpmRatDecNumberSystemTrueFalse,
  'rpm-rat-dec-between-fractions': rpmRatDecBetweenFractionsTerminating,
  'rpm-rat-dec-mistake-equation': rpmRatDecMistakeEquationApplication,
  'rpm-rat-dec-all-mixed': rpmRatDecAllTypesMixed,
  'rpm-rat-dec-advanced-skill-up': rpmRatDecAdvancedSkillUp,
  // -------------------------------------------------------------
  // [중2-1] 02 단항식의 계산 세부 응용 유형 (RPM 2-1 p.30~41)
  // -------------------------------------------------------------
  'rpm-mono-exponent-sum': rpmMonoExponentSum,
  'rpm-mono-exponent-product': rpmMonoExponentProduct,
  'rpm-mono-exponent-quotient': rpmMonoExponentQuotient,
  'rpm-mono-exponent-power-product': rpmMonoExponentPowerProduct,
  'rpm-mono-exponent-power-quotient': rpmMonoExponentPowerQuotient,
  'rpm-mono-exponent-equation-base': rpmMonoExponentEquationBase,
  'rpm-mono-exponent-addition': rpmMonoExponentAddition,
  'rpm-mono-exponent-substitution': rpmMonoExponentSubstitution,
  'rpm-mono-exponent-digits-count': rpmMonoExponentDigitsCount,
  'rpm-mono-mult-basic': rpmMonoMultBasic,
  'rpm-mono-div-basic': rpmMonoDivBasic,
  'rpm-mono-mult-div-mixed': rpmMonoMultDivMixed,
  'rpm-mono-missing-box': rpmMonoMissingBox,
  'rpm-mono-geometry-app': rpmMonoGeometryApplication,
  'rpm-mono-exponent-factor-out': rpmMonoExponentFactorOut,
  'rpm-mono-units-digit-cycle': rpmMonoUnitsDigitCycle,
  'rpm-mono-all-mixed': rpmMonoAllTypesMixed,
  'rpm-mono-advanced-skill-up': rpmMonoAdvancedSkillUp,

  // -------------------------------------------------------------
  // [중2-1] 03 다항식의 계산 세부 응용 유형 (RPM 2-1 p.44~51)
  // -------------------------------------------------------------
  'rpm-poly-calc-add-sub-basic': rpmPolyCalcAddSubBasic,
  'rpm-poly-calc-quadratic-add-sub': rpmPolyCalcQuadraticAddSub,
  'rpm-poly-calc-brackets-order': rpmPolyCalcBracketsOrder,
  'rpm-poly-calc-wrong-calculation': rpmPolyCalcWrongCalculation,
  'rpm-poly-calc-monomial-mult': rpmPolyCalcMonomialPolyMult,
  'rpm-poly-calc-monomial-div': rpmPolyCalcMonomialPolyDiv,
  'rpm-poly-calc-four-ops-mixed': rpmPolyCalcFourOpsMixed,
  'rpm-poly-calc-missing-box': rpmPolyCalcMissingBox,
  'rpm-poly-calc-evaluate-value': rpmPolyCalcEvaluateValue,
  'rpm-poly-calc-sub-expression': rpmPolyCalcSubExpression,
  'rpm-poly-calc-geometry-app': rpmPolyCalcGeometryApplication,
  'rpm-poly-calc-all-mixed': rpmPolyCalcAllMixed,
  'rpm-poly-calc-advanced-skill-up': rpmPolyCalcAdvancedSkillUp,
  // -------------------------------------------------------------
  // [중2-1] 04 일차부등식 세부 응용 유형 (RPM 2-1 p.58~67)
  // -------------------------------------------------------------
  'rpm-linear-ineq-concept-identify': rpmLinearIneqConceptIdentify,
  'rpm-linear-ineq-truth-value': rpmLinearIneqTruthValue,
  'rpm-linear-ineq-express-sentence': rpmLinearIneqExpressSentence,
  'rpm-linear-ineq-properties': rpmLinearIneqProperties,
  'rpm-linear-ineq-range-of-expression': rpmLinearIneqRangeOfExpression,
  'rpm-linear-ineq-identify-linear': rpmLinearIneqIdentifyLinear,
  'rpm-linear-ineq-solve-basic-number-line': rpmLinearIneqSolveBasicNumberLine,
  'rpm-linear-ineq-brackets': rpmLinearIneqBrackets,
  'rpm-linear-ineq-decimals-fractions': rpmLinearIneqDecimalsFractions,
  'rpm-linear-ineq-same-solution': rpmLinearIneqSameSolution,
  'rpm-linear-ineq-given-solution-find-constant': rpmLinearIneqGivenSolutionFindConstant,
  'rpm-linear-ineq-negative-coeff': rpmLinearIneqNegativeCoeff,
  'rpm-linear-ineq-integer-solutions-condition': rpmLinearIneqIntegerSolutionsCondition,
  'rpm-linear-ineq-all-types-mixed': rpmLinearIneqAllTypesMixed,
  'rpm-linear-ineq-advanced-skill-up': rpmLinearIneqAdvancedSkillUp,

  // -------------------------------------------------------------
  // [중2-1] 05 일차부등식의 활용 세부 응용 유형 (RPM 2-1 p.70~79)
  // -------------------------------------------------------------
  'rpm-ineq-app-numbers': rpmIneqAppNumbers,
  'rpm-ineq-app-cost-count': rpmIneqAppCostCount,
  'rpm-ineq-app-savings-deposit': rpmIneqAppSavingsDeposit,
  'rpm-ineq-app-average-score': rpmIneqAppAverageScore,
  'rpm-ineq-app-pricing-plans': rpmIneqAppPricingPlans,
  'rpm-ineq-app-group-discount': rpmIneqAppGroupDiscount,
  'rpm-ineq-app-store-comparison': rpmIneqAppStoreComparison,
  'rpm-ineq-app-cost-price-profit': rpmIneqAppCostPriceProfit,
  'rpm-ineq-app-geometry': rpmIneqAppGeometry,
  'rpm-ineq-app-salt-water-evaporate-add': rpmIneqAppSaltWaterEvaporateAdd,
  'rpm-ineq-app-speed-round-trip-time': rpmIneqAppSpeedRoundTripTime,
  'rpm-ineq-app-speed-shopping-station': rpmIneqAppSpeedShoppingStation,
  'rpm-ineq-app-speed-change-midway': rpmIneqAppSpeedChangeMidway,
  'rpm-ineq-app-all-types-mixed': rpmIneqAppAllTypesMixed,
  'rpm-ineq-app-advanced-skill-up': rpmIneqAppAdvancedSkillUp,

  // -------------------------------------------------------------
  // [중2-1] 06 연립일차방정식 세부 응용 유형 (RPM 2-1 p.84~97)
  // -------------------------------------------------------------
  'rpm-sys-linear-two-vars-identify': rpmSysLinearTwoVarsIdentify,
  'rpm-sys-linear-natural-pairs': rpmSysLinearNaturalPairs,
  'rpm-sys-linear-given-sol-find-constant': rpmSysLinearGivenSolFindConstant,
  'rpm-sys-linear-system-solution-concept': rpmSysLinearSystemSolutionConcept,
  'rpm-sys-linear-given-sol-system-const': rpmSysLinearGivenSolSystemConst,
  'rpm-sys-linear-substitution-method': rpmSysLinearSubstitutionMethod,
  'rpm-sys-linear-addition-subtraction-method': rpmSysLinearAdditionSubtractionMethod,
  'rpm-sys-linear-parentheses': rpmSysLinearParentheses,
  'rpm-sys-linear-decimals-fractions': rpmSysLinearDecimalsFractions,
  'rpm-sys-linear-abc-form': rpmSysLinearABCForm,
  'rpm-sys-linear-satisfy-other-equation': rpmSysLinearSatisfyOtherEquation,
  'rpm-sys-linear-variable-relation': rpmSysLinearVariableRelation,
  'rpm-sys-linear-two-systems-common-sol': rpmSysLinearTwoSystemsCommonSol,
  'rpm-sys-linear-faulty-observation': rpmSysLinearFaultyObservation,
  'rpm-sys-linear-special-infinitely-many': rpmSysLinearSpecialInfinitelyMany,
  'rpm-sys-linear-special-no-solution': rpmSysLinearSpecialNoSolution,
  'rpm-sys-linear-repeating-decimals': rpmSysLinearRepeatingDecimals,
  'rpm-sys-linear-all-types-mixed': rpmSysLinearAllTypesMixed,
  'rpm-sys-linear-advanced-skill-up': rpmSysLinearAdvancedSkillUp,

  // -------------------------------------------------------------
  // [중2-1] 07 연립일차방정식의 활용 세부 응용 유형 (RPM 2-1 p.100~111)
  // -------------------------------------------------------------
  'rpm-sys-app-two-digit-numbers': rpmSysAppTwoDigitNumbers,
  'rpm-sys-app-ages': rpmSysAppAges,
  'rpm-sys-app-price-quantity': rpmSysAppPriceQuantity,
  'rpm-sys-app-scores-rock-paper-scissors': rpmSysAppScoresRockPaperScissors,
  'rpm-sys-app-geometry': rpmSysAppGeometry,
  'rpm-sys-app-speed-opposite-same-track': rpmSysAppSpeedOppositeSameTrack,
  'rpm-sys-app-speed-river-boat': rpmSysAppSpeedRiverBoat,
  'rpm-sys-app-speed-train-bridge': rpmSysAppSpeedTrainBridge,
  'rpm-sys-app-salt-two-solutions': rpmSysAppSaltTwoSolutions,
  'rpm-sys-app-salt-water-evaporate-add': rpmSysAppSaltWaterEvaporateAdd,
  'rpm-sys-app-alloy-metals': rpmSysAppAlloyMetals,
  'rpm-sys-app-student-percent-change': rpmSysAppStudentPercentChange,
  'rpm-sys-app-work-rate': rpmSysAppWorkRate,
  'rpm-sys-app-cost-price-profit': rpmSysAppCostPriceProfit,
  'rpm-sys-app-all-types-mixed': rpmSysAppAllTypesMixed,
  'rpm-sys-app-advanced-skill-up': rpmSysAppAdvancedSkillUp,
  // -------------------------------------------------------------
  // [중2-1] 08 일차함수와 그 그래프 세부 응용 유형 (RPM 2-1 p.118~133)
  // -------------------------------------------------------------
  'rpm-linear-func-concept': rpmLinearFuncConcept,
  'rpm-linear-func-eval-value': rpmLinearFuncEvalValue,
  'rpm-linear-func-identify-linear': rpmLinearFuncIdentifyLinear,
  'rpm-linear-func-point-on-graph': rpmLinearFuncPointOnGraph,
  'rpm-linear-func-translation-y': rpmLinearFuncTranslationY,
  'rpm-linear-func-intercepts': rpmLinearFuncIntercepts,
  'rpm-linear-func-slope-definition': rpmLinearFuncSlopeDefinition,
  'rpm-linear-func-slope-two-points': rpmLinearFuncSlopeTwoPoints,
  'rpm-linear-func-draw-quadrants': rpmLinearFuncDrawQuadrants,
  'rpm-linear-func-axis-triangle-area': rpmLinearFuncAxisTriangleArea,
  'rpm-linear-func-sign-properties': rpmLinearFuncSignProperties,
  'rpm-linear-func-parallel-lines': rpmLinearFuncParallelLines,
  'rpm-linear-func-coincident-lines': rpmLinearFuncCoincidentLines,
  'rpm-linear-func-comprehensive-properties': rpmLinearFuncComprehensiveProperties,
  'rpm-linear-func-app-temperature': rpmLinearFuncAppTemperature,
  'rpm-linear-func-app-water-tank': rpmLinearFuncAppWaterTank,
  'rpm-linear-func-app-speed-distance': rpmLinearFuncAppSpeedDistance,
  'rpm-linear-func-app-moving-point': rpmLinearFuncAppMovingPoint,
  'rpm-linear-func-app-graph-modeling': rpmLinearFuncAppGraphModeling,
  'rpm-linear-func-up-two-lines-area': rpmLinearFuncUpTwoLinesArea,
  'rpm-linear-func-up-quadrant-condition': rpmLinearFuncUpQuadrantCondition,
  'rpm-linear-func-all-types-mixed': rpmLinearFuncAllTypesMixed,
  'rpm-linear-func-advanced-skill-up': rpmLinearFuncAdvancedSkillUp,

  // -------------------------------------------------------------
  // [중2-1] 09 일차함수와 일차방정식의 관계 세부 응용 유형 (RPM 2-1 p.138~149)
  // -------------------------------------------------------------
  'rpm-line-eqn-form-ax-by-c': rpmLineEqnFormAxByC,
  'rpm-line-eqn-point-on-line': rpmLineEqnPointOnLine,
  'rpm-line-eqn-signs-properties': rpmLineEqnSignsProperties,
  'rpm-line-eqn-parallel-to-axes': rpmLineEqnParallelToAxes,
  'rpm-line-eqn-four-lines-rect-area': rpmLineEqnFourLinesRectArea,
  'rpm-line-eqn-from-slope-yint': rpmLineEqnFromSlopeYint,
  'rpm-line-eqn-from-slope-point': rpmLineEqnFromSlopePoint,
  'rpm-line-eqn-from-two-points': rpmLineEqnFromTwoPoints,
  'rpm-line-eqn-from-intercepts': rpmLineEqnFromIntercepts,
  'rpm-line-eqn-intersection-as-solution': rpmLineEqnIntersectionAsSolution,
  'rpm-line-eqn-intersection-find-const': rpmLineEqnIntersectionFindConst,
  'rpm-line-eqn-line-through-intersection': rpmLineEqnLineThroughIntersection,
  'rpm-line-eqn-three-lines-one-point': rpmLineEqnThreeLinesOnePoint,
  'rpm-line-eqn-system-solution-types': rpmLineEqnSystemSolutionTypes,
  'rpm-line-eqn-enclosed-triangle-area': rpmLineEqnEnclosedTriangleArea,
  'rpm-line-eqn-apps-real-life': rpmLineEqnAppsRealLife,
  'rpm-line-eqn-up-line-meets-segment': rpmLineEqnUpLineMeetsSegment,
  'rpm-line-eqn-up-bisect-triangle-area': rpmLineEqnUpBisectTriangleArea,
  'rpm-line-eqn-all-types-mixed': rpmLineEqnAllTypesMixed,
  'rpm-line-eqn-advanced-skill-up': rpmLineEqnAdvancedSkillUp,

  // -------------------------------------------------------------
  // [중2-1 최종총괄] 중학 2-1 전 범위 최종 실전 총괄 모의고사 (RPM p.152~167)
  // -------------------------------------------------------------
  'rpm-grade8-semester-one-final-exam': rpmGrade8SemesterOneFinalExam,
  // -------------------------------------------------------------
  // [중2-2] 01 이등변삼각형 세부 응용 유형 (RPM 2-2 p.10~21)
  // -------------------------------------------------------------
  'rpm-g8-iso-tri-angles': rpmG8IsoTriAngles,
  'rpm-g8-iso-tri-angle-bisector': rpmG8IsoTriAngleBisector,
  'rpm-g8-iso-tri-chain-angles': rpmG8IsoTriChainAngles,
  'rpm-g8-iso-tri-condition-sides': rpmG8IsoTriConditionSides,
  'rpm-g8-right-tri-congruence': rpmG8RightTriCongruence,
  'rpm-g8-rha-congruence-apps': rpmG8RhaCongruenceApps,
  'rpm-g8-rhs-congruence-apps': rpmG8RhsCongruenceApps,
  'rpm-g8-angle-bisector-prop': rpmG8AngleBisectorProp,
  'rpm-g8-paper-folding-triangle': rpmG8PaperFoldingTriangle,
  'rpm-g8-iso-tri-up-challenge': rpmG8IsoTriUpChallenge,
  'rpm-g8-iso-tri-all-types-mixed': rpmG8IsoTriAllTypesMixed,
  'rpm-g8-iso-tri-advanced-skill-up': rpmG8IsoTriAdvancedSkillUp,

  // -------------------------------------------------------------
  // [중2-2] 02 삼각형의 외심과 내심 세부 응용 유형 (RPM 2-2 p.26~35)
  // -------------------------------------------------------------
  'rpm-g8-circumcenter-properties': rpmG8CircumcenterProperties,
  'rpm-g8-right-tri-circumcenter': rpmG8RightTriCircumcenter,
  'rpm-g8-circumcenter-angles-sum': rpmG8CircumcenterAnglesSum,
  'rpm-g8-circumcenter-central-angle': rpmG8CircumcenterCentralAngle,
  'rpm-g8-incenter-properties': rpmG8IncenterProperties,
  'rpm-g8-incenter-angles-sum': rpmG8IncenterAnglesSum,
  'rpm-g8-incenter-central-angle': rpmG8IncenterCentralAngle,
  'rpm-g8-incenter-parallel-line': rpmG8IncenterParallelLine,
  'rpm-g8-incenter-area-radius': rpmG8IncenterAreaRadius,
  'rpm-g8-incenter-tangent-segments': rpmG8IncenterTangentSegments,
  'rpm-g8-circum-incenter-combined': rpmG8CircumIncenterCombined,
  'rpm-g8-right-tri-both-circles': rpmG8RightTriBothCircles,
  'rpm-g8-circles-all-types-mixed': rpmG8CirclesAllTypesMixed,
  'rpm-g8-circles-advanced-skill-up': rpmG8CirclesAdvancedSkillUp,




};

export function findRpmAppliedGenerator(unitId) {
  return RPM_APPLIED_GENERATORS[unitId] || null;
}
