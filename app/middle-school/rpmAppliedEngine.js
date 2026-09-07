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
// CHAPTER 04: 정수와 유리수의 계산 응용 (Operations Applied)
// -------------------------------------------------------------

// 1. 분배법칙을 이용한 편리한 계산 (RPM p.61 #472)
export function rpmOpsDistributiveSmart(random) {
  const common = pick(random, [-3.7, -4.5, 7.8, -2.4, 0.75]);
  const a = ri(random, 65, 85);
  const b = 100 - a;
  const total = 100;
  const ans = Math.round(total * common * 10) / 10;

  const promptKo = `분배법칙을 이용하여 ${a} × (${common}) + ${b} × (${common})을 계산하시오.`;
  const promptEn = `Use the distributive property to evaluate ${a} × (${common}) + ${b} × (${common}).`;

  return {
    prompt: promptKo,
    promptEn,
    expression: `${a} × (${common}) + ${b} × (${common})`,
    answer: String(ans),
    explanation: `분배법칙에 의해 ${a} × (${common}) + ${b} × (${common}) = (${a} + ${b}) × (${common}) = 100 × (${common}) = ${ans}입니다.`,
  };
}

// 2. 신연산 약속 문제 (새로운 연산 a ★ b) (RPM p.63 #490)
export function rpmOpsNewOperation(random) {
  const p = ri(random, 2, 4);
  const q = ri(random, 2, 3);
  const k = ri(random, -5, 5);
  const a = ri(random, -4, 4);
  const b = ri(random, -3, 5);
  const ans = p * a - q * b + k;

  const kStr = k >= 0 ? `+ ${k}` : `- ${Math.abs(k)}`;
  const promptKo = `두 유리수 a, b에 대하여 새로운 연산 ★을 a ★ b = ${p}a - ${q}b ${kStr} 로 정의할 때, (${a}) ★ (${b})의 값을 구하시오.`;
  const promptEn = `Define operation ★ for rational numbers as a ★ b = ${p}a - ${q}b ${kStr}. Find the value of (${a}) ★ (${b}).`;

  return {
    prompt: promptKo,
    promptEn,
    expression: `(${a}) ★ (${b})`,
    answer: String(ans),
    explanation: `정의된 식에 a = ${a}, b = ${b}를 대입하면 ${p} × (${a}) - ${q} × (${b}) ${kStr} = ${p * a} - (${q * b}) ${kStr} = ${ans}입니다.`,
  };
}

// 3. 부분분수 망원합 (RPM p.71 #542)
export function rpmOpsTelescoping(random) {
  const start = pick(random, [2, 3, 4, 5]);
  const count = pick(random, [4, 5, 6]);
  const end = start + count;
  // 1/(start * (start+1)) + ... + 1/((end-1)*end) = 1/start - 1/end
  const num = end - start;
  const den = start * end;
  const g = gcd(num, den);
  const ansNum = num / g;
  const ansDen = den / g;
  const ans = ansDen === 1 ? String(ansNum) : `${ansNum}/${ansDen}`;

  const promptKo = `1/(n(n+1)) = 1/n - 1/(n+1) 임을 이용하여 1/(${start}×${start + 1}) + 1/(${start + 1}×${start + 2}) + ... + 1/(${end - 1}×${end}) 을 계산하시오.`;
  const promptEn = `Using the identity 1/(n(n+1)) = 1/n - 1/(n+1), evaluate the sum 1/(${start}×${start + 1}) + ... + 1/(${end - 1}×${end}).`;

  return {
    prompt: promptKo,
    promptEn,
    expression: `1/(${start}×${start + 1}) + ... + 1/(${end - 1}×${end})`,
    answer: ans,
    explanation: `각 항을 부분분수로 변형하면 (1/${start} - 1/${start + 1}) + (1/${start + 1} - 1/${start + 2}) + ... + (1/${end - 1} - 1/${end}) = 1/${start} - 1/${end} = (${end} - ${start}) / (${start} × ${end}) = ${num}/${den} = ${ans}입니다.`,
  };
}

// -------------------------------------------------------------
// CHAPTER 05: 문자의 사용과 식의 계산 응용 (Expressions Applied)
// -------------------------------------------------------------

// 1. 도형 색칠한 부분의 넓이 식 세우기 (RPM p.87 #680) + SVG Diagram
export function rpmAlgebraShadedArea(random) {
  const h = pick(random, [8, 10, 12]);
  const cutH = pick(random, [3, 4]);
  const extraBottom = ri(random, 4, 8);
  // Trapezoid area: 1/2 * (x + (x + extraBottom)) * h = h/2 * (2x + extraBottom) = (h)x + (h * extraBottom / 2)
  // Triangle area cut: 1/2 * (x + extraBottom) * cutH = (cutH / 2)x + (cutH * extraBottom / 2)
  // Shaded area = (h - cutH / 2)x + ...
  const coeffX = h - cutH / 2;
  const constVal = (h * extraBottom) / 2 - (cutH * extraBottom) / 2;

  const diagram = {
    kind: 'rpm-shaded-shape',
    shape: 'trapezoid',
    top: 'x',
    bottom: `x + ${extraBottom}`,
    height: h,
    cutHeight: cutH,
  };

  const promptKo = `윗변의 길이가 x, 아랫변의 길이가 x + ${extraBottom}, 높이가 ${h}인 사다리꼴에서 밑변을 공유하고 높이가 ${cutH}인 삼각형을 제외한 색칠한 부분의 넓이를 x를 사용한 간단한 식으로 나타내시오. (계수가 ax + b일 때 a, b 구하기)`;
  const promptEn = `In a trapezoid with top base x, bottom base x + ${extraBottom}, and height ${h}, find the area of the shaded region in terms of x (formatted as ax + b) after subtracting an inner triangle of height ${cutH}.`;

  const ans = `${coeffX}x+${constVal}`;

  return {
    prompt: promptKo,
    promptEn,
    expression: `사다리꼴 넓이 - 삼각형 넓이`,
    answer: ans,
    diagram,
    explanation: `사다리꼴의 넓이는 1/2 × {x + (x + ${extraBottom})} × ${h} = ${h}x + ${(h * extraBottom) / 2}이고, 삼각형의 넓이는 1/2 × (x + ${extraBottom}) × ${cutH} = ${cutH / 2}x + ${(cutH * extraBottom) / 2}입니다. 따라서 색칠한 넓이는 (${h}x + ${(h * extraBottom) / 2}) - (${cutH / 2}x + ${(cutH * extraBottom) / 2}) = ${ans}입니다.`,
  };
}

// 2. 복합 일차식 계수와 상수항의 차 (RPM p.83 #653, #654)
export function rpmAlgebraCoeffDifference(random) {
  const p = ri(random, 2, 4);
  const q = ri(random, 2, 3);
  const a1 = ri(random, 2, 5);
  const b1 = ri(random, -6, 6);
  const a2 = ri(random, 1, 4);
  const b2 = ri(random, -6, 6);

  // p(a1 x + b1) - q(a2 x + b2) = (p*a1 - q*a2)x + (p*b1 - q*b2)
  const aCoeff = p * a1 - q * a2;
  const bConst = p * b1 - q * b2;
  const ans = aCoeff - bConst;

  const signB1 = b1 >= 0 ? `+ ${b1}` : `- ${Math.abs(b1)}`;
  const signB2 = b2 >= 0 ? `+ ${b2}` : `- ${Math.abs(b2)}`;

  const promptKo = `${p}(${a1}x ${signB1}) - ${q}(${a2}x ${signB2}) 를 간단히 하였을 때, x의 계수를 a, 상수항을 b라 하자. 이때 a - b의 값을 구하시오.`;
  const promptEn = `When simplifying ${p}(${a1}x ${signB1}) - ${q}(${a2}x ${signB2}), let a be the coefficient of x and b be the constant term. Find a - b.`;

  return {
    prompt: promptKo,
    promptEn,
    expression: `${p}(${a1}x ${signB1}) - ${q}(${a2}x ${signB2}) = ax + b`,
    answer: String(ans),
    explanation: `괄호를 풀면 ${p * a1}x ${p * b1 >= 0 ? '+' : ''}${p * b1} - (${q * a2}x ${q * b2 >= 0 ? '+' : ''}${q * b2}) = ${aCoeff}x ${bConst >= 0 ? '+' : ''}${bConst}입니다. 따라서 a = ${aCoeff}, b = ${bConst}이므로 a - b = ${aCoeff} - (${bConst}) = ${ans}입니다.`,
  };
}

// -------------------------------------------------------------
// CHAPTER 06: 일차방정식의 풀이 응용 (Equations Applied)
// -------------------------------------------------------------

// 1. 비례식 형태의 일차방정식 (RPM p.99 #785)
export function rpmEqProportionStyle(random) {
  const xVal = ri(random, 2, 7);
  const a1 = ri(random, 2, 4);
  const b1 = ri(random, -5, 6);
  const term1 = a1 * xVal + b1;
  const a2 = 1;
  const b2 = ri(random, -4, 4);
  const term2 = a2 * xVal + b2;

  const m = pick(random, [2, 3, 4]);
  const n = 1;

  // Let term1 : term2 = (term1 / g) : (term2 / g)
  // Simplified: (a1 x + b1) : (x + b2) = (m * mult) : (mult)
  const leftExpr = `${a1}x ${b1 >= 0 ? '+' : '-'} ${Math.abs(b1)}`;
  const rightExpr = `x ${b2 >= 0 ? '+' : '-'} ${Math.abs(b2)}`;
  const ratioLeft = term1;
  const ratioRight = term2;

  const promptKo = `비례식 (${leftExpr}) : (${rightExpr}) = ${ratioLeft} : ${ratioRight} 을 만족시키는 x의 값을 구하시오.`;
  const promptEn = `Solve for x in the proportion (${leftExpr}) : (${rightExpr}) = ${ratioLeft} : ${ratioRight}.`;

  return {
    prompt: promptKo,
    promptEn,
    expression: `(${leftExpr}) : (${rightExpr}) = ${ratioLeft} : ${ratioRight}`,
    answer: String(xVal),
    explanation: `내항의 곱은 외항의 곱과 같으므로, ${ratioRight}(${leftExpr}) = ${ratioLeft}(${rightExpr})입니다. 식을 전개하여 일차방정식을 풀면 x = ${xVal}을 얻습니다.`,
  };
}

// 2. 항등식 조건에서 상수 구하기 (RPM p.95 #756, p.103 #815)
export function rpmEqIdentityCondition(random) {
  const aVal = ri(random, 2, 5);
  const bVal = ri(random, -6, 6);
  const mult = ri(random, 2, 4);
  // 2a x + (a + b) = mult*x + constVal
  const leftXCoeff = mult * aVal;
  const leftConst = aVal + bVal;

  const promptKo = `등식 ${leftXCoeff}x + ${leftConst} = a(${mult}x + 1) + b 가 모든 x에 대하여 항상 참일 때, 상수 a, b에 대하여 a - b의 값을 구하시오.`;
  const promptEn = `The equality ${leftXCoeff}x + ${leftConst} = a(${mult}x + 1) + b is true for all x. Find the value of a - b for constants a and b.`;
  const ans = aVal - bVal;

  return {
    prompt: promptKo,
    promptEn,
    expression: `${leftXCoeff}x + ${leftConst} = a(${mult}x + 1) + b`,
    answer: String(ans),
    explanation: `우변을 전개하면 ${mult}ax + (a + b)입니다. x에 대한 항등식이므로 ${mult}a = ${leftXCoeff}에서 a = ${aVal}, a + b = ${leftConst}에서 b = ${leftConst} - ${aVal} = ${bVal}입니다. 따라서 a - b = ${aVal} - (${bVal}) = ${ans}입니다.`,
  };
}

// -------------------------------------------------------------
// CHAPTER 07: 일차방정식의 활용 응용 (Applications Applied)
// -------------------------------------------------------------

// 1. 긴 의자 과부족 문제 (RPM p.115 #898)
export function rpmEqExcessDeficit(random) {
  const chairs = ri(random, 6, 12);
  const perChair1 = pick(random, [4, 5, 6]);
  const leftover = ri(random, 3, 5);
  const students = perChair1 * chairs + leftover;

  const perChair2 = perChair1 + 1;
  // All but last chair filled with perChair2, last chair has lastChairStudents
  // students = perChair2 * (chairs - 1) + lastChairStudents
  const lastChairStudents = students - perChair2 * (chairs - 1);

  const promptKo = `강당의 긴 의자에 학생들이 앉는데 한 의자에 ${perChair1}명씩 앉으면 의자에 모두 앉고도 ${leftover}명이 앉지 못하고, 한 의자에 ${perChair2}명씩 앉으면 빈 의자는 없고 마지막 의자에는 ${lastChairStudents}명이 앉는다고 합니다. 이때 긴 의자의 개수를 구하시오.`;
  const promptEn = `When students sit ${perChair1} to a long bench, ${leftover} students are left standing. When they sit ${perChair2} to a bench, all benches are used and the last bench has ${lastChairStudents} students. How many benches are there?`;

  return {
    prompt: promptKo,
    promptEn,
    expression: `${perChair1}x + ${leftover} = ${perChair2}(x - 1) + ${lastChairStudents}`,
    answer: String(chairs),
    answerSuffix: '개',
    explanation: `긴 의자의 개수를 x개라 하면 총 학생 수는 ${perChair1}x + ${leftover}명입니다. 또한 ${perChair2}명씩 앉을 때 학생 수는 ${perChair2}(x - 1) + ${lastChairStudents}명입니다. 두 식이 같으므로 ${perChair1}x + ${leftover} = ${perChair2}(x - 1) + ${lastChairStudents}, 이를 풀면 x = ${chairs}입니다.`,
  };
}

// 2. 거리-속력-시간 시차 출발 따라잡기 (RPM p.111 #873, #874) + SVG Diagram
export function rpmEqCatchupTravel(random) {
  const speedA = pick(random, [50, 60]);
  const speedB = pick(random, [70, 80, 90]);
  const delayMin = pick(random, [15, 20, 30]); // minutes
  // distance = speedA * (t + delayMin/60) = speedB * t
  // (speedB - speedA) * t = speedA * (delayMin / 60)
  // t = (speedA * delayMin/60) / (speedB - speedA)
  const delayHours = delayMin / 60;
  const leadDist = speedA * delayHours;
  const speedDiff = speedB - speedA;
  const catchupHours = leadDist / speedDiff;
  const totalDist = Math.round(speedB * catchupHours);

  const diagram = {
    kind: 'rpm-travel-diagram',
    speedA,
    speedB,
    delay: delayMin,
  };

  const promptKo = `한 차는 먼저 출발하여 시속 ${speedA}km로 달렸고, 다른 차는 ${delayMin}분 늦게 출발하여 시속 ${speedB}km로 달려서 목적지에 동시에 도착하였습니다. 출발지에서 목적지까지의 거리(km)를 구하시오.`;
  const promptEn = `Car A leaves first at ${speedA} km/h. Car B leaves ${delayMin} minutes later at ${speedB} km/h and arrives at the destination at the exact same time. Find the distance from start to destination in km.`;

  return {
    prompt: promptKo,
    promptEn,
    expression: `${speedA}(t + ${delayMin}/60) = ${speedB}t`,
    answer: String(totalDist),
    answerSuffix: 'km',
    diagram,
    explanation: `늦게 출발한 차가 걸린 시간을 t시간이라 하면 먼저 출발한 차는 (t + ${delayMin}/60)시간 동안 달렸습니다. 달린 거리가 같으므로 ${speedA}(t + ${delayMin}/60) = ${speedB}t 입니다. 방정식을 풀면 t = ${catchupHours}시간이며, 총 거리는 ${speedB} × ${catchupHours} = ${totalDist}km 입니다.`,
  };
}

// -------------------------------------------------------------
// CHAPTER 08: 좌표와 그래프 응용 (Coordinate Plane Applied)
// -------------------------------------------------------------

// 1. 좌표평면 위 삼각형의 넓이 (RPM p.127 #973) + SVG Plane Diagram
export function rpmCoordTriangleArea(random) {
  const x1 = ri(random, 1, 4);
  const y1 = ri(random, 1, 5);
  const x2 = x1;
  const y2 = -ri(random, 1, 4);
  const x3 = -ri(random, 2, 5);
  const y3 = ri(random, -3, 3);

  // Base is vertical segment between (x1, y1) and (x2, y2)
  const base = Math.abs(y1 - y2);
  const height = Math.abs(x1 - x3);
  const area = (base * height) / 2;
  const ans = Number.isInteger(area) ? String(area) : String(area.toFixed(1));

  const diagram = {
    kind: 'rpm-plane-polygon',
    vertices: [
      { x: x1, y: y1, label: 'A' },
      { x: x2, y: y2, label: 'B' },
      { x: x3, y: y3, label: 'C' },
    ],
    xRange: [-6, 6],
    yRange: [-6, 6],
    label: 'ABC',
  };

  const promptKo = `좌표평면 위의 세 점 A(${x1}, ${y1}), B(${x2}, ${y2}), C(${x3}, ${y3})을 꼭짓점으로 하는 삼각형 ABC의 넓이를 구하시오.`;
  const promptEn = `Find the area of triangle ABC with vertices A(${x1}, ${y1}), B(${x2}, ${y2}), and C(${x3}, ${y3}) on the coordinate plane.`;

  return {
    prompt: promptKo,
    promptEn,
    expression: `A(${x1}, ${y1}), B(${x2}, ${y2}), C(${x3}, ${y3})`,
    answer: ans,
    diagram,
    explanation: `선분 AB는 x좌표가 ${x1}로 같으므로 밑변의 길이는 |${y1} - (${y2})| = ${base}입니다. 꼭짓점 C에서 직선 AB까지의 거리는 높이가 되므로 |${x1} - (${x3})| = ${height}입니다. 따라서 삼각형 ABC의 넓이는 1/2 × ${base} × ${height} = ${ans}입니다.`,
  };
}

// 2. 사분면 부호 판별 및 대칭 이동 (RPM p.127 #971, #972)
export function rpmCoordQuadrantSign(random) {
  const aSign = pick(random, ['+', '-']);
  const bSign = aSign === '+' ? '-' : '+';
  // ab < 0, a - b > 0 if a > 0, b < 0; a - b < 0 if a < 0, b > 0
  const aPositive = aSign === '+';
  const aMinusBPositive = aPositive;

  const targetPoint = pick(random, ['(-a, b)', '(ab, a)', '(b, a-b)', '(-ab, -a)']);
  let quadAns = '1';
  if (targetPoint === '(-a, b)') {
    quadAns = !aPositive && !aPositive ? '1' : '3'; // if a>0, b<0 -> (-a, b) is (-,-) -> 3
    quadAns = aPositive ? '3' : '1';
  } else if (targetPoint === '(ab, a)') {
    quadAns = aPositive ? '2' : '3'; // ab is always -, a is + or -
  } else if (targetPoint === '(b, a-b)') {
    quadAns = aPositive ? '2' : '4'; // b is -, a-b is + -> (-, +) -> 2
  } else {
    quadAns = aPositive ? '4' : '1';
  }

  const promptKo = `ab < 0이고 a - b ${aMinusBPositive ? '> 0' : '< 0'}일 때, 점 ${targetPoint}는 제 몇 사분면 위의 점인지 구하시오. (숫자만 입력)`;
  const promptEn = `Given ab < 0 and a - b ${aMinusBPositive ? '> 0' : '< 0'}, which quadrant does point ${targetPoint} lie in? (Enter quadrant number 1~4)`;

  return {
    prompt: promptKo,
    promptEn,
    expression: `ab < 0, a - b ${aMinusBPositive ? '> 0' : '< 0'}`,
    answer: quadAns,
    answerSuffix: '사분면',
    explanation: `ab < 0이므로 a와 b의 부호는 서로 다릅니다. 이때 a - b ${aMinusBPositive ? '> 0이므로 a > b, 즉 a > 0, b < 0' : '< 0이므로 a < b, 즉 a < 0, b > 0'}입니다. 이에 따라 ${targetPoint}의 각 좌표의 부호를 판별하면 제${quadAns}사분면 위의 점입니다.`,
  };
}

// -------------------------------------------------------------
// CHAPTER 09: 정비례와 반비례 응용 (Proportions Applied)
// -------------------------------------------------------------

// 1. 정비례와 반비례 교점 및 상수 구하기 (RPM p.141 #1063, #1064) + SVG Hyperbola Diagram
export function rpmPropIntersection(random) {
  const a = pick(random, [2, 3, -2, -3]);
  const meetX = pick(random, [2, 3, 4]);
  const meetY = a * meetX;
  const k = meetX * meetY; // k = x * y for inverse variation y = k/x
  const askSum = random() < 0.5;

  const diagram = {
    kind: 'rpm-hyperbola-line',
    slope: a,
    k,
    meetX,
    meetY,
  };

  const promptKo = `정비례 관계 y = ${a}x 와 반비례 관계 y = a/x 의 그래프가 점 P(${meetX}, b)에서 만날 때, ${askSum ? '상수 a와 b에 대하여 a + b의 값' : '상수 a의 값'}을 구하시오.`;
  const promptEn = `The graphs of direct variation y = ${a}x and inverse variation y = a/x intersect at point P(${meetX}, b). Find ${askSum ? 'the value of a + b' : 'the constant a'}.`;
  const ans = askSum ? k + meetY : k;

  return {
    prompt: promptKo,
    promptEn,
    expression: `y = ${a}x, y = a/x, P(${meetX}, b)`,
    answer: String(ans),
    diagram,
    explanation: `점 P(${meetX}, b)가 정비례 y = ${a}x 위의 점이므로 b = ${a} × ${meetX} = ${meetY}입니다. 또한 P(${meetX}, ${meetY})가 반비례 y = a/x 위의 점이므로 상수 a = ${meetX} × ${meetY} = ${k}입니다. 따라서 ${askSum ? `a + b = ${k} + ${meetY} = ${ans}` : `a = ${k}`}입니다.`,
  };
}

// 2. 반비례 그래프 위의 점과 삼각형/직사각형 넓이 (RPM p.137 #1037) + SVG Diagram
export function rpmPropGraphArea(random) {
  const k = pick(random, [12, 16, 18, 24, 32]);
  // Point P on y = k/x has xy = k. Triangle OPQ has area = 1/2 * x * y = k / 2
  const area = k / 2;

  const diagram = {
    kind: 'rpm-hyperbola-line',
    slope: 1.5,
    k,
    meetX: Math.round(Math.sqrt(k)),
    meetY: Math.round(Math.sqrt(k)),
    showTriangle: true,
  };

  const promptKo = `반비례 관계 y = a/x (a > 0)의 그래프 위의 한 점 P에서 x축과 y축에 각각 수선의 발을 내려 원점과 함께 직각삼각형을 만들었더니 넓이가 ${area}이었습니다. 이때 양수 a의 값을 구하시오.`;
  const promptEn = `From a point P on the inverse variation curve y = a/x (a > 0), perpendiculars to the axes form a right triangle with the origin of area ${area}. Find the value of a.`;

  return {
    prompt: promptKo,
    promptEn,
    expression: `(삼각형 넓이) = 1/2 × x × y = ${area}`,
    answer: String(k),
    diagram,
    explanation: `반비례 관계 y = a/x 위의 점 P(x, y)에 대하여 x × y = a 입니다. 직각삼각형의 넓이는 1/2 × x × y = a/2 이므로, a/2 = ${area}에서 a = ${k}입니다.`,
  };
}

// 3. 톱니바퀴 회전수 (RPM p.133 #1007, 반비례 실생활)
export function rpmPropGearPhysics(random) {
  const teethA = pick(random, [24, 30, 36, 40, 48]);
  const revA = ri(random, 4, 8);
  const totalTeethMoved = teethA * revA;
  const teethB = pick(random, [15, 20, 32, 60].filter((t) => totalTeethMoved % t === 0 && t !== teethA));
  const revB = totalTeethMoved / teethB;

  const promptKo = `맞물려 돌아가는 두 톱니바퀴 A, B가 있습니다. 톱니 수가 ${teethA}개인 톱니바퀴 A가 ${revA}회 회전할 때, 톱니 수가 ${teethB}개인 톱니바퀴 B는 몇 회 회전하는지 구하시오.`;
  const promptEn = `Two meshed gears A and B rotate together. Gear A has ${teethA} teeth and rotates ${revA} times. How many rotations does Gear B (with ${teethB} teeth) make?`;

  return {
    prompt: promptKo,
    promptEn,
    expression: `${teethA} × ${revA} = ${teethB} × y`,
    answer: String(revB),
    answerSuffix: '회',
    explanation: `맞물려 돌아가는 두 톱니바퀴에서 맞물린 톱니의 총수는 서로 같으므로 (톱니 수) × (회전수)는 일정(반비례 관계)합니다. 따라서 ${teethA} × ${revA} = ${teethB} × y 에서 y = ${totalTeethMoved} ÷ ${teethB} = ${revB}회입니다.`,
  };
}

// -------------------------------------------------------------
// UNIFIED ENGINE REGISTRY FOR ALL 9 MIDDLE 1-1 UNITS
// -------------------------------------------------------------

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

  // 04 정수와 유리수의 계산
  'rational-addition': rpmOpsDistributiveSmart,
  'rational-subtraction': rpmOpsDistributiveSmart,
  'rational-add-subtract': rpmOpsDistributiveSmart,
  'rational-multiplication': rpmOpsDistributiveSmart,
  'rational-division': rpmOpsTelescoping,
  'rational-four-operations': rpmOpsNewOperation,
  'rational-operations-review': (r) => pick(r, [rpmOpsDistributiveSmart, rpmOpsNewOperation, rpmOpsTelescoping])(r),

  // 05 문자의 사용과 식의 계산 & 06 일차방정식의 풀이 & 07 일차방정식의 활용
  'notation': rpmAlgebraShadedArea,
  'verbal-expressions': rpmAlgebraShadedArea,
  'expression-values': rpmAlgebraCoeffDifference,
  'polynomial-basics': rpmAlgebraCoeffDifference,
  'monomial-multiply-divide': rpmAlgebraCoeffDifference,
  'simplify-linear': rpmAlgebraCoeffDifference,
  'expressions-review': (r) => pick(r, [rpmAlgebraShadedArea, rpmAlgebraCoeffDifference])(r),
  'equation-identity': rpmEqIdentityCondition,
  'equality-properties': rpmEqProportionStyle,
  'linear-equations': rpmEqProportionStyle,
  'advanced-linear-equations': rpmEqIdentityCondition,
  'equation-word-problems': rpmEqExcessDeficit,
  'distance-speed-time': rpmEqCatchupTravel,
  'concentration': rpmEqExcessDeficit,
  'equations-review': (r) => pick(r, [rpmEqProportionStyle, rpmEqIdentityCondition, rpmEqExcessDeficit, rpmEqCatchupTravel])(r),

  // 08 좌표와 그래프
  'ordered-pair-condition': rpmCoordQuadrantSign,
  'plane-read-point': rpmCoordTriangleArea,
  'plane-find-point': rpmCoordTriangleArea,
  'quadrant-identify': rpmCoordQuadrantSign,
  'quadrant-sign': rpmCoordQuadrantSign,
  'quadrant-transform': rpmCoordQuadrantSign,
  'symmetric-points': rpmCoordQuadrantSign,
  'trip-graph': rpmCoordTriangleArea,
  'coordinate-mixed': (r) => pick(r, [rpmCoordTriangleArea, rpmCoordQuadrantSign])(r),

  // 09 정비례와 반비례
  'direct-concept': rpmPropIntersection,
  'direct-equation': rpmPropIntersection,
  'direct-graph': rpmPropIntersection,
  'inverse-concept': rpmPropGraphArea,
  'inverse-equation': rpmPropGraphArea,
  'inverse-graph': rpmPropGraphArea,
  'proportion-applications': rpmPropGearPhysics,
  'proportion-mixed': (r) => pick(r, [rpmPropIntersection, rpmPropGraphArea, rpmPropGearPhysics])(r),
};

export function findRpmAppliedGenerator(unitId) {
  return RPM_APPLIED_GENERATORS[unitId] || null;
}
