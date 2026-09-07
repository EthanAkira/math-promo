// Server-only RPM Middle School 1-1 Applied Problem Generators
// Used by functions/api/curriculum-advanced/generate.js for authenticated, subscribed users.

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

const tx = (profile, ko, en) => (profile?.locale === 'ko' ? ko : en || ko);

// -------------------------------------------------------------
// 01: 소인수분해 응용
// -------------------------------------------------------------
// -------------------------------------------------------------
// 01: 소인수분해 응용 (RPM 1-1 Pages 10~15)
// -------------------------------------------------------------

function rpmPrimePropClosest(random, profile) {
  const T = pick(random, [14, 20, 32, 38, 62, 74]);
  const a = T - 1;
  const b = T + 1;
  const ans = a + b;
  return {
    prompt: tx(profile,
      `${T}에 가장 가까운 소수를 a, ${T}을 제외하고 가장 가까운 합성수를 b라 할 때, a + b의 값을 구하시오.`,
      `Let a be the prime closest to ${T}, and b be the composite number closest to ${T} (excluding ${T}). Find a + b.`),
    expression: `소수 a = ${a}, 합성수 b = ${b}`,
    answer: String(ans),
    explanation: tx(profile,
      `${T}에 가장 가까운 소수는 ${a}이고, 가장 가까운 합성수는 ${b}입니다. a + b = ${ans}입니다.`,
      `The closest prime is ${a}, and closest composite is ${b}. a + b = ${ans}.`),
  };
}

function rpmPrimePowerRules(random, profile) {
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
    prompt: tx(profile,
      `${base1}^${exp1} × ${base2}^${exp2}의 일의 자리의 숫자를 구하시오.`,
      `Find the units digit of ${base1}^${exp1} × ${base2}^${exp2}.`),
    expression: `${base1}^${exp1} × ${base2}^${exp2}`,
    answer: String(ans),
    explanation: tx(profile,
      `${base1}의 일의 자리 주기는 ${cycle1.length}, ${base2}의 주기는 ${cycle2.length}이므로 일의 자리는 (${u1} × ${u2})의 일의 자리인 ${ans}입니다.`,
      `Cycle lengths are ${cycle1.length} and ${cycle2.length}, giving units digit (${u1} × ${u2}) mod 10 = ${ans}.`),
  };
}

function rpmPrimeFactorizeExponents(random, profile) {
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
    prompt: tx(profile,
      `${N}을 소인수분해하면 2^a × 3^b × c일 때, a - b + c의 값을 구하시오. (단, a, b는 자연수이고 c는 5 이상의 소수)`,
      `When ${N} is factored into 2^a × 3^b × c, find a - b + c where c is a prime ≥ 5.`),
    expression: `${N} = 2^a × 3^b × c`,
    answer: String(ans),
    explanation: tx(profile,
      `${N} = 2^${a} × 3^${b} × ${c}이므로 a - b + c = ${ans}입니다.`,
      `${N} = 2^${a} × 3^${b} × ${c}, so a - b + c = ${ans}.`),
  };
}

function rpmPrimeFactorAnalysis(random, profile) {
  const N = pick(random, [84, 126, 150, 210, 330, 420]);
  const factors = factorize(N);
  const primes = factors.map(([p]) => p);
  const ans = primes.reduce((sum, p) => sum + p, 0);
  return {
    prompt: tx(profile,
      `${N}의 모든 소인수의 합을 구하시오.`,
      `Find the sum of all prime factors of ${N}.`),
    expression: `${N}의 소인수의 합`,
    answer: String(ans),
    explanation: tx(profile,
      `${N}의 소인수는 ${primes.join(', ')}이므로 합은 ${ans}입니다.`,
      `The prime factors are ${primes.join(', ')}, with sum = ${ans}.`),
  };
}

function rpmPrimeDivisorProperties(random, profile) {
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
    prompt: tx(profile,
      `${N}의 약수 중에서 어떤 자연수의 제곱이 되는 수의 개수를 구하시오.`,
      `Find the number of divisors of ${N} that are perfect squares.`),
    expression: `${N} = ${p1}^${e1} × ${p2}^${e2}`,
    answer: String(ans),
    answerSuffix: tx(profile, '개', ''),
    explanation: tx(profile,
      `지수가 모두 짝수인 약수의 개수는 ${countP1} × ${countP2} = ${ans}개입니다.`,
      `Even-exponent divisors count = ${countP1} × ${countP2} = ${ans}.`),
  };
}

function rpmPrimeMakeSquare(random, profile) {
  const [n, minK] = pick(random, [
    [540, 15],
    [180, 5],
    [525, 21],
    [72, 2],
    [84, 21],
  ]);
  const askSecond = random() < 0.4;
  const ans = askSecond ? minK * 4 : minK;
  return {
    prompt: tx(profile,
      `${n}에 자연수를 곱하여 어떤 자연수의 제곱이 되도록 할 때, 곱해야 하는 ${askSecond ? '두 번째로 작은 수' : '가장 작은 수'}를 구하시오.`,
      `Find the ${askSecond ? 'second smallest' : 'smallest'} natural number to multiply by ${n} to obtain a perfect square.`),
    expression: `${n} × x = y^2`,
    answer: String(ans),
    explanation: tx(profile,
      `${n}을 소인수분해하여 지수가 홀수인 소인수의 곱은 ${minK}입니다. 따라서 정답은 ${ans}입니다.`,
      `The product of prime factors with odd exponents is ${minK}. Answer is ${ans}.`),
  };
}

function rpmPrimeDivisorCountReverse(random, profile) {
  const targetA = ri(random, 2, 5);
  const totalDivisors = 12 * (targetA + 1);
  return {
    prompt: tx(profile,
      `8 × 3^a × 5^2의 약수의 개수가 ${totalDivisors}개일 때, 자연수 a의 값을 구하시오.`,
      `The number of divisors of 8 × 3^a × 5^2 is ${totalDivisors}. Find natural number a.`),
    expression: `약수의 개수: ${totalDivisors}개`,
    answer: String(targetA),
    explanation: tx(profile,
      `8 = 2³이므로 (3+1)(a+1)(2+1) = 12(a+1) = ${totalDivisors}에서 a = ${targetA}입니다.`,
      `8 = 2³, so (3+1)(a+1)(2+1) = 12(a+1) = ${totalDivisors}, giving a = ${targetA}.`),
  };
}

function rpmPrimeUnknownInDivisorCount(random, profile) {
  const ans = 4;
  return {
    prompt: tx(profile,
      `2 × 3 × □의 약수의 개수가 8개일 때, □ 안에 들어갈 수 있는 가장 작은 자연수를 구하시오.`,
      `The number of divisors of 2 × 3 × □ is 8. Find the smallest natural number for □.`),
    expression: `2 × 3 × □의 약수 = 8개`,
    answer: String(ans),
    explanation: tx(profile,
      `□ = 4(2²)일 때 2³ × 3으로 약수의 개수가 8개가 되며, 이는 소수 5보다 작으므로 가장 작은 수는 ${ans}입니다.`,
      `When □ = 4 (2²), 2³ × 3 has 8 divisors, and 4 < 5, so the smallest is ${ans}.`),
  };
}

function rpmPrimeDivisorCountReverseDeduce(random, profile) {
  const [A, B, ans] = pick(random, [
    [35, 36, 36],
    [120, 64, 6],
    [20, 36, 12],
  ]);
  return {
    prompt: tx(profile,
      `자연수 n의 약수의 개수를 f(n)이라 할 때, f(${A}) × f(x) = ${B}를 만족시키는 가장 작은 자연수 x의 값을 구하시오.`,
      `Let f(n) be the number of divisors of n. If f(${A}) × f(x) = ${B}, find the smallest natural number x.`),
    expression: `f(${A}) × f(x) = ${B}`,
    answer: String(ans),
    explanation: tx(profile,
      `조건을 만족하는 약수의 개수를 구하면 가장 작은 자연수는 ${ans}입니다.`,
      `Solving for the smallest number yields ${ans}.`),
  };
}

function rpmPrimeAllTypesMixed(random, profile) {
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
  return pick(random, allEngines)(random, profile);
}

// -------------------------------------------------------------
// 02: 최대공약수와 최소공배수 응용 (RPM 1-1 Pages 18~31)
// -------------------------------------------------------------

function rpmGcdBasicCoprime(random, profile) {
  const variant = pick(random, ['deduceExpSum', 'coprimeCount', 'findCoprimeChoice', 'unknownBox']);
  if (variant === 'deduceExpSum') {
    const a = ri(random, 2, 4);
    const b = ri(random, 2, 4);
    const ans = a + b;
    return {
      prompt: tx(profile,
        `세 수 2^3 × 3^b × 5^5, 3^4 × 5^a × 11, 2^3 × 3^3 × 5^4의 최대공약수가 3^${b} × 5^${a}일 때, a + b의 값을 구하시오. (단, a, b는 자연수)`,
        `If the GCF of 2^3 × 3^b × 5^5, 3^4 × 5^a × 11, and 2^3 × 3^3 × 5^4 is 3^${b} × 5^${a}, find a + b.`),
      expression: `G = 3^${b} × 5^${a}`,
      answer: String(ans),
      explanation: tx(profile,
        `공통 소인수 3의 지수 min(b, 4, 3) = ${b}에서 b = ${b}, 5의 지수 min(5, a, 4) = ${a}에서 a = ${a}입니다. a + b = ${ans}입니다.`,
        `Exponents give b = ${b} and a = ${a}, so a + b = ${ans}.`),
    };
  } else if (variant === 'coprimeCount') {
    const target = pick(random, [24, 28, 30, 36, 42]);
    const minVal = target - ri(random, 8, 12);
    const maxVal = target + ri(random, 8, 12);
    let count = 0;
    for (let x = minVal + 1; x < maxVal; x += 1) {
      if (gcd(x, target) === 1) count += 1;
    }
    return {
      prompt: tx(profile,
        `${minVal}보다 크고 ${maxVal}보다 작은 자연수 중에서 ${target}과 서로소인 수의 개수를 구하시오.`,
        `How many natural numbers between ${minVal} and ${maxVal} are coprime to ${target}?`),
      expression: `${minVal} < x < ${maxVal}, gcd(x, ${target}) = 1`,
      answer: String(count),
      answerSuffix: '개',
      explanation: tx(profile,
        `${target}과 서로소인 수는 ${count}개입니다.`,
        `There are ${count} numbers coprime to ${target}.`),
    };
  } else if (variant === 'findCoprimeChoice') {
    const coprimePairs = [[12, 29], [15, 28], [16, 27], [21, 40], [25, 36]];
    const nonCoprimePairs = [[8, 10], [9, 15], [14, 21], [18, 27], [24, 32]];
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
      prompt: tx(profile,
        `다음 중 두 수가 서로소인 것을 고르시오.`,
        `Which pair of numbers is coprime?`),
      expression: `서로소 판별`,
      answer: String(correctIndex),
      choices,
      explanation: tx(profile,
        `${correctPair[0]}과 ${correctPair[1]}의 최대공약수는 1이므로 서로소입니다. 정답은 ${correctIndex}번입니다.`,
        `The GCF of ${correctPair[0]} and ${correctPair[1]} is 1, so they are coprime. Choice ${correctIndex}.`),
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
      prompt: tx(profile,
        `두 자연수 2^4 × □ 와 2^3 × 3^5 × 11의 최대공약수가 72일 때, 다음 중 □ 안에 들어갈 수 없는 수는?`,
        `If the GCF of 2^4 × □ and 2^3 × 3^5 × 11 is 72, which of the following cannot be □?`),
      expression: `gcd(2^4 × □, 2^3 × 3^5 × 11) = 72`,
      answer: String(ansIdx),
      choices,
      explanation: tx(profile,
        `72 = 2^3 × 3^2이므로 □는 3^2을 인수로 가져야 하지만 3^3 이상의 거듭제곱이나 11을 가질 수 없습니다. ${invalid}은 조건을 만족하지 않습니다. 정답은 ${ansIdx}번입니다.`,
        `${invalid} does not satisfy the conditions. Answer is choice ${ansIdx}.`),
    };
  }
}

function rpmGcdCommonDivisorProp(random, profile) {
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
      prompt: tx(profile,
        `두 자연수 A, B의 최대공약수가 ${G}일 때, 다음 중 A와 B의 공약수가 아닌 것은?`,
        `If the GCF of natural numbers A and B is ${G}, which of the following is NOT a common divisor?`),
      expression: `G = ${G}`,
      answer: String(ansIdx),
      choices,
      explanation: tx(profile,
        `두 수의 공약수는 최대공약수 ${G}의 약수입니다. ${bad}은 ${G}의 약수가 아닙니다. 정답은 ${ansIdx}번입니다.`,
        `Common divisors divide ${G}. ${bad} is not a divisor of ${G}. Answer is choice ${ansIdx}.`),
    };
  } else if (variant === 'countCommonDivisors') {
    const [e2, e3] = pick(random, [[2, 1], [3, 2], [2, 2], [3, 1]]);
    const divCount = (e2 + 1) * (e3 + 1);
    return {
      prompt: tx(profile,
        `세 수 2^${e2 + 1} × 3^${e3} × 5, 2^${e2} × 3^${e3 + 1} × 7, 2^${e2 + 2} × 3^${e3} × 11의 공약수의 개수를 구하시오.`,
        `Find the number of common divisors of the three numbers.`),
      expression: `최대공약수 G = 2^${e2} × 3^${e3}`,
      answer: String(divCount),
      answerSuffix: '개',
      explanation: tx(profile,
        `최대공약수는 2^${e2} × 3^${e3}이므로 공약수의 개수는 (${e2}+1) × (${e3}+1) = ${divCount}개입니다.`,
        `GCF is 2^${e2} × 3^${e3}, giving (${e2}+1) × (${e3}+1) = ${divCount} common divisors.`),
    };
  } else {
    const g = pick(random, [12, 14, 18, 20, 24]);
    const k1 = pick(random, [2, 3, 5]);
    let k2;
    do k2 = pick(random, [2, 3, 5, 7]); while (k1 === k2 || gcd(k1, k2) !== 1);
    const d1 = g * k1;
    const d2 = g * k2;
    return {
      prompt: tx(profile,
        `세 자연수 A, B, C에 대하여 A와 B의 최대공약수는 ${d1}이고, B와 C의 최대공약수는 ${d2}일 때, 세 수 A, B, C의 최대공약수를 구하시오.`,
        `For numbers A, B, C, GCF(A, B) = ${d1} and GCF(B, C) = ${d2}. Find GCF(A, B, C).`),
      expression: `gcd(A, B) = ${d1}, gcd(B, C) = ${d2}`,
      answer: String(g),
      explanation: tx(profile,
        `세 수의 최대공약수는 ${d1}과 ${d2}의 최대공약수인 ${g}입니다.`,
        `The GCF of A, B, C is gcd(${d1}, ${d2}) = ${g}.`),
    };
  }
}

function rpmLcmCommonMultipleProp(random, profile) {
  const variant = pick(random, ['lcmExpSum', 'countLimit', 'closestMultiple']);
  if (variant === 'lcmExpSum') {
    const a = ri(random, 4, 6);
    const b = ri(random, 3, 5);
    const c = ri(random, 2, 4);
    const ans = a + b + c;
    return {
      prompt: tx(profile,
        `두 수 2^3 × 3^b × 5 와 2^a × 3^2 × 7^${c}의 최소공배수가 2^${a} × 3^${b} × 5 × 7^c일 때, a + b + c의 값을 구하시오. (단, a, b, c는 자연수)`,
        `If the LCM of 2^3 × 3^b × 5 and 2^a × 3^2 × 7^${c} is 2^${a} × 3^${b} × 5 × 7^c, find a + b + c.`),
      expression: `L = 2^${a} × 3^${b} × 5 × 7^c`,
      answer: String(ans),
      explanation: tx(profile,
        `최고 지수를 비교하면 a = ${a}, b = ${b}, c = ${c}이므로 a + b + c = ${ans}입니다.`,
        `Comparing max exponents gives a = ${a}, b = ${b}, c = ${c}, sum = ${ans}.`),
    };
  } else if (variant === 'countLimit') {
    const L = pick(random, [14, 18, 24, 28, 36]);
    const M = pick(random, [100, 150, 200, 250, 300]);
    const ans = Math.floor(M / L);
    return {
      prompt: tx(profile,
        `두 자연수의 최소공배수가 ${L}일 때, 이 두 자연수의 공배수 중 ${M} 이하의 자연수는 모두 몇 개인가?`,
        `If the LCM of two natural numbers is ${L}, how many common multiples are ≤ ${M}?`),
      expression: `L = ${L}, M ≤ ${M}`,
      answer: String(ans),
      answerSuffix: '개',
      explanation: tx(profile,
        `공배수는 ${L}의 배수이므로 ${M} 이하의 공배수는 ${M} ÷ ${L} = ${ans}개입니다.`,
        `Multiples are multiples of ${L}. ${M} ÷ ${L} = ${ans}.`),
    };
  } else {
    const [n1, n2, n3] = pick(random, [[8, 15, 24], [6, 10, 15], [9, 12, 18]]);
    const L = lcmAll([n1, n2, n3]);
    const T = pick(random, [500, 700, 800]);
    const k = Math.round(T / L);
    const ans = k * L;
    return {
      prompt: tx(profile,
        `세 수 ${n1}, ${n2}, ${n3}의 공배수 중 ${T}에 가장 가까운 수를 구하시오.`,
        `Find the common multiple of ${n1}, ${n2}, and ${n3} closest to ${T}.`),
      expression: `최소공배수 L = ${L}`,
      answer: String(ans),
      explanation: tx(profile,
        `최소공배수는 ${L}이며, ${T}에 가장 가까운 배수는 ${ans}입니다.`,
        `LCM is ${L}, closest multiple to ${T} is ${ans}.`),
    };
  }
}

function rpmGcdLcmExponentDeduce(random, profile) {
  const variant = pick(random, ['twoNumDeduce', 'threeNumLcmSum', 'deduceDivisorsA']);
  if (variant === 'twoNumDeduce') {
    const a = ri(random, 3, 5);
    const b = ri(random, 2, 4);
    const ans = a + b;
    return {
      prompt: tx(profile,
        `두 수 2^b × 3^2 × 5 와 2^3 × 3^a의 최대공약수가 2^2 × 3^2이고 최소공배수가 2^3 × 3^${a} × 5일 때, a + b의 값을 구하시오.`,
        `If GCF is 2^2 × 3^2 and LCM is 2^3 × 3^${a} × 5, find a + b.`),
      expression: `G = 2^2 × 3^2, L = 2^3 × 3^${a} × 5`,
      answer: String(ans),
      explanation: tx(profile,
        `b = 2, a = ${a}이므로 a + b = ${ans}입니다.`,
        `b = 2, a = ${a}, so a + b = ${ans}.`),
    };
  } else if (variant === 'threeNumLcmSum') {
    const ans = 7;
    return {
      prompt: tx(profile,
        `세 수 2^2 × 3^b, 2^a × 3, 2^3 × 3 × 5^c의 최소공배수가 720일 때, 자연수 a, b, c에 대하여 a + b + c의 값을 구하시오.`,
        `If the LCM of 2^2 × 3^b, 2^a × 3, and 2^3 × 3 × 5^c is 720, find a + b + c.`),
      expression: `720 = 2^4 × 3^2 × 5`,
      answer: String(ans),
      explanation: tx(profile,
        `720 = 2^4 × 3^2 × 5에서 a = 4, b = 2, c = 1이므로 a + b + c = ${ans}입니다.`,
        `720 = 2^4 × 3^2 × 5 gives a = 4, b = 2, c = 1. a + b + c = ${ans}.`),
    };
  } else {
    const ans = 27;
    return {
      prompt: tx(profile,
        `두 자연수 2^3 × 3 × 5와 A의 최대공약수가 2^2 × 3이고 최소공배수가 2^3 × 3^2 × 5 × 7^2일 때, 자연수 A의 약수의 개수를 구하시오.`,
        `If GCF is 2^2 × 3 and LCM is 2^3 × 3^2 × 5 × 7^2, find the number of divisors of A.`),
      expression: `A = 2^2 × 3^2 × 7^2`,
      answer: String(ans),
      answerSuffix: '개',
      explanation: tx(profile,
        `A = 2^2 × 3^2 × 7^2이므로 약수의 개수는 (2+1)(2+1)(2+1) = ${ans}개입니다.`,
        `A = 2^2 × 3^2 × 7^2, so number of divisors is 3 × 3 × 3 = ${ans}.`),
    };
  }
}

function rpmGcdLcmProductRelation(random, profile) {
  const [G, a, b] = pick(random, [
    [6, 3, 5],
    [6, 3, 7],
    [8, 2, 3],
    [12, 2, 3],
  ]);
  const A = G * a;
  const B = G * b;
  const P = A * B;
  const ans = A + B;
  return {
    prompt: tx(profile,
      `두 자리의 자연수 A, B (A < B)에 대하여 두 수의 곱이 ${P}이고 최대공약수가 ${G}일 때, A + B의 값을 구하시오.`,
      `For two 2-digit natural numbers A and B (A < B), their product is ${P} and GCF is ${G}. Find A + B.`),
    expression: `A × B = ${P}, G = ${G}`,
    answer: String(ans),
    explanation: tx(profile,
      `최소공배수 L = ${P / G}이며, a × b = ${a * b}에서 두 자리 자연수 A = ${A}, B = ${B}이므로 A + B = ${ans}입니다.`,
      `L = ${P / G}. Numbers are ${A} and ${B}, giving A + B = ${ans}.`),
  };
}

function rpmLcmThreeNumbersRatio(random, profile) {
  const x = ri(random, 4, 10);
  const L = 24 * x;
  const largest = 8 * x;
  return {
    prompt: tx(profile,
      `세 자연수의 비가 2 : 3 : 8이고 최소공배수가 ${L}일 때, 세 자연수 중 가장 큰 수를 구하시오.`,
      `The ratio of three natural numbers is 2 : 3 : 8 and their LCM is ${L}. Find the largest number.`),
    expression: `2x, 3x, 8x의 최소공배수 = 24x = ${L}`,
    answer: String(largest),
    explanation: tx(profile,
      `24x = ${L}에서 x = ${x}입니다. 가장 큰 수는 8x = ${largest}입니다.`,
      `24x = ${L} gives x = ${x}. Largest is 8x = ${largest}.`),
  };
}

function rpmGcdWordDistribute(random, profile) {
  const g = pick(random, [12, 15, 18, 20]);
  const a = ri(random, 3, 6);
  const b = ri(random, 4, 7);
  const n1 = g * a;
  const n2 = g * b;
  const ans = a + b;
  return {
    prompt: tx(profile,
      `여학생 ${n1}명과 남학생 ${n2}명이 야영을 위해 여학생 a명과 남학생 b명씩 한 조로 나누려고 한다. 가능한 한 많은 조로 나눌 때, a + b의 값을 구하시오.`,
      `With ${n1} girls and ${n2} boys, form as many teams of a girls and b boys as possible. Find a + b.`),
    expression: `조의 수 = gcd(${n1}, ${n2}) = ${g}`,
    answer: String(ans),
    explanation: tx(profile,
      `조의 수는 최대공약수인 ${g}개이며, a = ${a}, b = ${b}이므로 a + b = ${ans}입니다.`,
      `Number of teams is ${g}. a = ${a}, b = ${b}, so a + b = ${ans}.`),
  };
}

function rpmGcdWordTileFence(random, profile) {
  const s = pick(random, [12, 16, 20, 24, 36]);
  const qw = ri(random, 3, 6);
  const qh = ri(random, 2, 5);
  const W = s * qw;
  const H = s * qh;
  const count = qw * qh;
  return {
    prompt: tx(profile,
      `가로 ${W}cm, 세로 ${H}cm인 직사각형 벽에 가능한 한 큰 정사각형 타일을 빈틈없이 붙이려고 한다. 필요한 타일의 개수를 구하시오.`,
      `A rectangular wall of ${W}cm by ${H}cm is tiled with the largest possible square tiles. Find the number of tiles needed.`),
    expression: `타일 한 변 = gcd(${W}, ${H}) = ${s}cm`,
    answer: String(count),
    answerSuffix: '개',
    diagram: { kind: 'rpm-tile-rectangle', w: W, h: H, tileSize: s, unit: 'cm', mode: 'fill' },
    explanation: tx(profile,
      `타일 한 변은 ${s}cm이고, 필요한 타일 수는 ${qw} × ${qh} = ${count}개입니다.`,
      `Tile side is ${s}cm. Total tiles needed = ${qw} × ${qh} = ${count}.`),
  };
}

function rpmGcdWordRemainder(random, profile) {
  const g = pick(random, [6, 8, 9, 12, 14]);
  const q1 = ri(random, 4, 7);
  const q2 = ri(random, 8, 12);
  const r1 = ri(random, 2, g - 2);
  const r2 = ri(random, 1, g - 2);
  const n1 = g * q1 + r1;
  const n2 = g * q2 + r2;
  return {
    prompt: tx(profile,
      `어떤 자연수로 ${n1}을 나누면 ${r1}이 남고, ${n2}를 나누면 ${r2}가 남는다고 한다. 이러한 자연수 중에서 가장 큰 수를 구하시오.`,
      `When divided into ${n1}, remainder is ${r1}; into ${n2}, remainder is ${r2}. Find the greatest such natural number.`),
    expression: `gcd(${n1} - ${r1}, ${n2} - ${r2}) = ${g}`,
    answer: String(g),
    explanation: tx(profile,
      `${n1 - r1}과 ${n2 - r2}의 최대공약수인 ${g}입니다.`,
      `The GCF of ${n1 - r1} and ${n2 - r2} is ${g}.`),
  };
}

function rpmLcmWordBrickCube(random, profile) {
  const [a, b, c] = pick(random, [[6, 8, 3], [6, 18, 4], [12, 15, 10]]);
  const L = lcmAll([a, b, c]);
  const count = (L / a) * (L / b) * (L / c);
  return {
    prompt: tx(profile,
      `가로 ${a}cm, 세로 ${b}cm, 높이 ${c}cm인 직육면체 벽돌을 쌓아 가장 작은 정육면체를 만들 때 필요한 벽돌의 개수를 구하시오.`,
      `Bricks of ${a}cm by ${b}cm by ${c}cm are stacked to build the smallest cube. Find the number of bricks required.`),
    expression: `정육면체 한 변 = lcm(${a}, ${b}, ${c}) = ${L}cm`,
    answer: String(count),
    answerSuffix: '개',
    diagram: { kind: 'rpm-brick-cube', a, b, c, target: '정육면체' },
    explanation: tx(profile,
      `한 변의 길이는 ${L}cm이며, 필요한 벽돌의 개수는 ${count}개입니다.`,
      `Cube side is ${L}cm. Bricks needed = ${count}.`),
  };
}

function rpmLcmWordGearTrackCycle(random, profile) {
  const [a, b] = pick(random, [[45, 30], [16, 24], [75, 60], [36, 48]]);
  const L = lcm(a, b);
  const rotA = L / a;
  return {
    prompt: tx(profile,
      `톱니 수가 각각 ${a}개, ${b}개인 톱니바퀴 A, B가 맞물려 돌 때, 다시 처음 위치에서 맞물릴 때까지 톱니바퀴 A의 회전수를 구하시오.`,
      `Two gears A and B have ${a} and ${b} teeth. How many rotations does Gear A make before they re-align?`),
    expression: `lcm(${a}, ${b}) = ${L}개 톱니`,
    answer: String(rotA),
    answerSuffix: '바퀴',
    diagram: { kind: 'rpm-gears', teethA: a, teethB: b },
    explanation: tx(profile,
      `맞물린 톱니 수는 ${L}개이므로 A의 회전수는 ${L} ÷ ${a} = ${rotA}바퀴입니다.`,
      `Total teeth meshed is ${L}. A makes ${L} ÷ ${a} = ${rotA} rotations.`),
  };
}

function rpmLcmWordRemainderDeficit(random, profile) {
  const [a, b, c, d] = pick(random, [
    [5, 6, 7, 3],
    [5, 8, 10, 3],
    [6, 8, 12, 1],
  ]);
  const L = lcmAll([a, b, c]);
  const ans = L - d;
  return {
    prompt: tx(profile,
      `어떤 자연수를 ${a}로 나누면 ${a - d}가 남고, ${b}로 나누면 ${b - d}가 남고, ${c}로 나누면 ${c - d}가 남는다. 이러한 수 중 가장 작은 수를 구하시오.`,
      `A number leaves remainder ${a - d} by ${a}, ${b - d} by ${b}, and ${c - d} by ${c}. Find the smallest such number.`),
    expression: `공통 부족분 ${d}, lcm(${a}, ${b}, ${c}) - ${d}`,
    answer: String(ans),
    explanation: tx(profile,
      `모두 ${d}가 부족하므로 세 수의 최소공배수에서 ${d}를 뺀 ${ans}입니다.`,
      `Each is deficient by ${d}. Answer is LCM - ${d} = ${ans}.`),
  };
}

function rpmGcdLcmFractionMultiplier(random, profile) {
  const [n1, d1, n2, d2] = pick(random, [
    [15, 28, 25, 42],
    [12, 25, 8, 15],
    [14, 33, 21, 55],
  ]);
  const num = lcm(d1, d2);
  const den = gcd(n1, n2);
  const g = gcd(num, den);
  const sNum = num / g;
  const sDen = den / g;
  const ans = sDen === 1 ? String(sNum) : `${sNum}/${sDen}`;
  return {
    prompt: tx(profile,
      `두 분수 ${n1}/${d1}과 ${n2}/${d2}의 어느 것에 곱하여도 그 결과가 자연수가 되게 하는 가장 작은 기약분수를 구하시오.`,
      `Find the smallest irreducible fraction that gives a natural number when multiplied by either ${n1}/${d1} or ${n2}/${d2}.`),
    expression: `N = lcm(${d1}, ${d2}), D = gcd(${n1}, ${n2})`,
    answer: ans,
    explanation: tx(profile,
      `분자는 분모의 최소공배수 ${num}, 분모는 분자의 최대공약수 ${den}이므로 기약분수는 ${ans}입니다.`,
      `Numerator is LCM = ${num}, denominator is GCF = ${den}, giving ${ans}.`),
  };
}

function rpmGcdLcmAdvancedDeduce(random, profile) {
  const ans = 55;
  return {
    prompt: tx(profile,
      `두 자연수 A, B에 대하여 A > B이고 최대공약수가 5, 최소공배수가 120이다. A - B = 25일 때, A + B의 값을 구하시오.`,
      `For natural numbers A > B, GCF is 5 and LCM is 120. If A - B = 25, find A + B.`),
    expression: `G = 5, L = 120, A - B = 25`,
    answer: String(ans),
    explanation: tx(profile,
      `ab = 24, a - b = 5에서 a = 8, b = 3이므로 A = 40, B = 15이고 A + B = ${ans}입니다.`,
      `ab = 24 and a - b = 5 gives a = 8, b = 3, so A = 40, B = 15 and A + B = ${ans}.`),
  };
}

function rpmGcdLcmAllTypesMixed(random, profile) {
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
  return pick(random, allEngines)(random, profile);
}

const rpmGcdLcmReverseProduct = rpmGcdLcmProductRelation;
const rpmGcdLcmFractions = rpmGcdLcmFractionMultiplier;
const rpmLcmNeonCycle = rpmLcmWordGearTrackCycle;
const rpmGcdRemainder = rpmGcdWordRemainder;

// -------------------------------------------------------------
// 03: 정수와 유리수 응용
// -------------------------------------------------------------
function rpmRationalLineDivision(random, profile) {
  const leftVal = pick(random, [-4, -3, -2, -1]);
  const rightVal = pick(random, [2, 3, 4, 5, 6]);
  const m = pick(random, [1, 2]);
  const n = pick(random, [2, 3]);
  const dist = rightVal - leftVal;
  const num = leftVal * (m + n) + dist * m;
  const den = m + n;
  const common = gcd(num, den);
  const reducedNum = num / common;
  const reducedDen = den / common;
  const ans = reducedDen === 1 ? String(reducedNum) : `${reducedNum}/${reducedDen}`;

  return {
    prompt: tx(profile,
      `수직선 위의 두 점 A(${leftVal}), B(${rightVal})를 이은 선분을 ${m} : ${n}으로 나누는 점 C가 나타내는 수를 구하시오.`,
      `On the number line, points A(${leftVal}) and B(${rightVal}) form a segment. Find the coordinate of point C dividing AB in ratio ${m} : ${n}.`),
    expression: `A(${leftVal}), B(${rightVal}), AC:CB = ${m}:${n}`,
    answer: ans,
    diagram: {
      kind: 'rpm-number-line',
      min: leftVal - 1,
      max: rightVal + 1,
      step: 1,
      points: [
        { val: leftVal, label: 'A' },
        { val: rightVal, label: 'B' },
        { val: num / den, label: 'C', highlight: true, subLabel: `${m}:${n}` },
      ],
      highlightSegment: { from: leftVal, to: rightVal },
    },
    explanation: tx(profile,
      `거리 ${dist}의 ${m}/${den}만큼 점 A에서 오른쪽으로 이동하면 ${leftVal} + ${dist * m}/${den} = ${ans}입니다.`,
      `Moving ${dist * m}/${den} right from A gives ${ans}.`),
  };
}

// -------------------------------------------------------------
// 04: 문자의 사용과 식의 계산 응용
// -------------------------------------------------------------
function rpmAlgebraShadedArea(random, profile) {
  const h = pick(random, [8, 10, 12]);
  const cutH = pick(random, [3, 4]);
  const extraBottom = ri(random, 4, 8);
  const coeffX = h - cutH / 2;
  const constVal = (h * extraBottom) / 2 - (cutH * extraBottom) / 2;
  const ans = `${coeffX}x+${constVal}`;

  return {
    prompt: tx(profile,
      `윗변이 x, 아랫변이 x + ${extraBottom}, 높이가 ${h}인 사다리꼴에서 높이 ${cutH}인 삼각형을 뺀 색칠한 넓이를 ax + b 꼴로 나타내시오.`,
      `In a trapezoid of top base x, bottom base x + ${extraBottom}, and height ${h}, find the shaded area after subtracting an inner triangle of height ${cutH}.`),
    expression: `사다리꼴 넓이 - 삼각형 넓이`,
    answer: ans,
    diagram: {
      kind: 'rpm-shaded-shape',
      shape: 'trapezoid',
      top: 'x',
      bottom: `x + ${extraBottom}`,
      height: h,
      cutHeight: cutH,
    },
    explanation: tx(profile,
      `사다리꼴 넓이 - 삼각형 넓이 = ${ans}입니다.`,
      `Trapezoid area minus triangle area equals ${ans}.`),
  };
}

// -------------------------------------------------------------
// 05: 일차방정식과 활용 응용
// -------------------------------------------------------------
function rpmEqExcessDeficit(random, profile) {
  const chairs = ri(random, 6, 12);
  const perChair1 = pick(random, [4, 5, 6]);
  const leftover = ri(random, 3, 5);
  const students = perChair1 * chairs + leftover;
  const perChair2 = perChair1 + 1;
  const lastChairStudents = students - perChair2 * (chairs - 1);

  return {
    prompt: tx(profile,
      `긴 의자에 학생들이 앉는데 한 의자에 ${perChair1}명씩 앉으면 ${leftover}명이 남고, ${perChair2}명씩 앉으면 마지막 의자에는 ${lastChairStudents}명이 앉는다고 합니다. 긴 의자의 개수를 구하시오.`,
      `Students sitting ${perChair1} per bench leave ${leftover} standing. Sitting ${perChair2} per bench leaves the last bench with ${lastChairStudents}. Find the number of benches.`),
    expression: `${perChair1}x + ${leftover} = ${perChair2}(x - 1) + ${lastChairStudents}`,
    answer: String(chairs),
    answerSuffix: '개',
    explanation: tx(profile,
      `방정식 ${perChair1}x + ${leftover} = ${perChair2}(x - 1) + ${lastChairStudents}을 풀면 x = ${chairs}입니다.`,
      `Solving ${perChair1}x + ${leftover} = ${perChair2}(x - 1) + ${lastChairStudents} gives x = ${chairs}.`),
  };
}

function rpmEqCatchupTravel(random, profile) {
  const speedA = pick(random, [50, 60]);
  const speedB = pick(random, [70, 80, 90]);
  const delayMin = pick(random, [15, 20, 30]);
  const delayHours = delayMin / 60;
  const speedDiff = speedB - speedA;
  const catchupHours = (speedA * delayHours) / speedDiff;
  const totalDist = Math.round(speedB * catchupHours);

  return {
    prompt: tx(profile,
      `한 차는 먼저 출발하여 시속 ${speedA}km로 달렸고 다른 차는 ${delayMin}분 늦게 출발하여 시속 ${speedB}km로 달려서 목적지에 동시에 도착했습니다. 거리(km)를 구하시오.`,
      `Car A leaves first at ${speedA} km/h. Car B leaves ${delayMin} minutes later at ${speedB} km/h and arrives simultaneously. Find distance (km).`),
    expression: `${speedA}(t + ${delayMin}/60) = ${speedB}t`,
    answer: String(totalDist),
    answerSuffix: 'km',
    diagram: { kind: 'rpm-travel-diagram', speedA, speedB, delay: delayMin },
    explanation: tx(profile,
      `걸린 시간 t = ${catchupHours}시간이며 총 거리는 ${totalDist}km입니다.`,
      `Time t = ${catchupHours}h, so distance = ${totalDist}km.`),
  };
}

// -------------------------------------------------------------
// 06: 좌표평면과 그래프 응용
// -------------------------------------------------------------
function rpmCoordTriangleArea(random, profile) {
  const x1 = ri(random, 1, 4);
  const y1 = ri(random, 1, 5);
  const x2 = x1;
  const y2 = -ri(random, 1, 4);
  const x3 = -ri(random, 2, 5);
  const y3 = ri(random, -3, 3);
  const base = Math.abs(y1 - y2);
  const height = Math.abs(x1 - x3);
  const area = (base * height) / 2;
  const ans = Number.isInteger(area) ? String(area) : String(area.toFixed(1));

  return {
    prompt: tx(profile,
      `좌표평면 위의 세 점 A(${x1}, ${y1}), B(${x2}, ${y2}), C(${x3}, ${y3})을 꼭짓점으로 하는 삼각형 ABC의 넓이를 구하시오.`,
      `Find the area of triangle ABC with vertices A(${x1}, ${y1}), B(${x2}, ${y2}), C(${x3}, ${y3}).`),
    expression: `A(${x1}, ${y1}), B(${x2}, ${y2}), C(${x3}, ${y3})`,
    answer: ans,
    diagram: {
      kind: 'rpm-plane-polygon',
      vertices: [{ x: x1, y: y1, label: 'A' }, { x: x2, y: y2, label: 'B' }, { x: x3, y: y3, label: 'C' }],
      xRange: [-6, 6],
      yRange: [-6, 6],
    },
    explanation: tx(profile,
      `밑변 ${base}, 높이 ${height}이므로 넓이는 1/2 × ${base} × ${height} = ${ans}입니다.`,
      `Base ${base}, height ${height} gives area 1/2 × ${base} × ${height} = ${ans}.`),
  };
}

// -------------------------------------------------------------
// 07: 정비례와 반비례 응용
// -------------------------------------------------------------
function rpmPropIntersection(random, profile) {
  const a = pick(random, [2, 3, -2, -3]);
  const meetX = pick(random, [2, 3, 4]);
  const meetY = a * meetX;
  const k = meetX * meetY;
  const askSum = random() < 0.5;
  const ans = askSum ? k + meetY : k;

  return {
    prompt: tx(profile,
      `정비례 y = ${a}x 와 반비례 y = a/x 가 점 P(${meetX}, b)에서 만날 때, ${askSum ? 'a + b의 값' : '상수 a의 값'}을 구하시오.`,
      `Direct variation y = ${a}x and inverse variation y = a/x intersect at P(${meetX}, b). Find ${askSum ? 'a + b' : 'constant a'}.`),
    expression: `y = ${a}x, y = a/x, P(${meetX}, b)`,
    answer: String(ans),
    diagram: { kind: 'rpm-hyperbola-line', slope: a, k, meetX, meetY },
    explanation: tx(profile,
      `b = ${meetY}, a = ${k}이므로 ${askSum ? `a + b = ${ans}` : `a = ${k}`}입니다.`,
      `b = ${meetY}, a = ${k}, giving ${askSum ? `a + b = ${ans}` : `a = ${k}`}.`),
  };
}

export const RPM_ADVANCED_ENGINES = {
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

  'positive-negative': rpmRationalLineDivision,
  'integer-classification': rpmRationalLineDivision,
  'rational-classification': rpmRationalLineDivision,
  'number-line': rpmRationalLineDivision,
  'absolute-value': rpmRationalLineDivision,
  'number-comparison': rpmRationalLineDivision,
  'inequality-expression': rpmRationalLineDivision,
  'integer-solutions': rpmRationalLineDivision,
  'integer-rational-mixed': rpmRationalLineDivision,
  'rational-addition': rpmRationalLineDivision,
  'rational-subtraction': rpmRationalLineDivision,
  'rational-add-subtract': rpmRationalLineDivision,
  'rational-multiplication': rpmRationalLineDivision,
  'rational-division': rpmRationalLineDivision,
  'rational-four-operations': rpmRationalLineDivision,
  'rational-operations-review': rpmRationalLineDivision,

  'notation': rpmAlgebraShadedArea,
  'verbal-expressions': rpmAlgebraShadedArea,
  'expression-values': rpmAlgebraShadedArea,
  'polynomial-basics': rpmAlgebraShadedArea,
  'monomial-multiply-divide': rpmAlgebraShadedArea,
  'simplify-linear': rpmAlgebraShadedArea,
  'expressions-review': rpmAlgebraShadedArea,
  'equation-identity': rpmEqExcessDeficit,
  'equality-properties': rpmEqExcessDeficit,
  'linear-equations': rpmEqExcessDeficit,
  'advanced-linear-equations': rpmEqExcessDeficit,
  'equation-word-problems': rpmEqExcessDeficit,
  'distance-speed-time': rpmEqCatchupTravel,
  'concentration': rpmEqExcessDeficit,
  'equations-review': (r, p) => pick(r, [rpmAlgebraShadedArea, rpmEqExcessDeficit, rpmEqCatchupTravel])(r, p),

  'ordered-pair-condition': rpmCoordTriangleArea,
  'plane-read-point': rpmCoordTriangleArea,
  'plane-find-point': rpmCoordTriangleArea,
  'quadrant-identify': rpmCoordTriangleArea,
  'quadrant-sign': rpmCoordTriangleArea,
  'quadrant-transform': rpmCoordTriangleArea,
  'symmetric-points': rpmCoordTriangleArea,
  'trip-graph': rpmCoordTriangleArea,
  'coordinate-mixed': rpmCoordTriangleArea,

  'direct-concept': rpmPropIntersection,
  'direct-equation': rpmPropIntersection,
  'direct-graph': rpmPropIntersection,
  'inverse-concept': rpmPropIntersection,
  'inverse-equation': rpmPropIntersection,
  'inverse-graph': rpmPropIntersection,
  'proportion-applications': rpmPropIntersection,
  'proportion-mixed': rpmPropIntersection,
};
