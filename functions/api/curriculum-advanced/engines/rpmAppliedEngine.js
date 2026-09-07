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
function fracStr(n, d) {
  const g = gcd(n, d);
  let num = n / g;
  let den = d / g;
  if (den < 0) { num = -num; den = -den; }
  if (den === 1) return String(num);
  return `${num}/${den}`;
}

// 1. 부호를 사용하여 나타내기 (RPM 유형 01, #0270, #0271, #0272, #0324)
function rpmIrSignSituation(random, profile) {
  const isMultipleChoice = random() < 0.6;
  if (isMultipleChoice) {
    const findCorrect = random() < 0.5;
    const pool = [
      { ko: '지하 {v}층', en: 'Floor {v} below ground', sign: '-', wrong: '+' },
      { ko: '지출 {v}000원', en: 'Expense of {v}000 KRW', sign: '-', wrong: '+' },
      { ko: '{v}% 증가', en: '{v}% increase', sign: '+', wrong: '-' },
      { ko: '출발 {v}일 전', en: '{v} days before departure', sign: '-', wrong: '+' },
      { ko: '출발 {v}시간 후', en: '{v} hours after departure', sign: '+', wrong: '-' },
      { ko: '용돈 {v}000원 인상', en: 'Allowance raised by {v}000 KRW', sign: '+', wrong: '-' },
      { ko: '해저 {v}00 m', en: '{v}00 m below sea level', sign: '-', wrong: '+' },
      { ko: '해발 {v}00 m', en: '{v}00 m above sea level', sign: '+', wrong: '-' },
      { ko: '영하 {v}℃', en: '{v}°C below zero', sign: '-', wrong: '+' },
      { ko: '영상 {v}℃', en: '{v}°C above zero', sign: '+', wrong: '-' },
    ];
    const shuffled = [...pool].sort(() => random() - 0.5).slice(0, 5);
    const targetIdx = ri(random, 0, 4);

    const choices = shuffled.map((item, idx) => {
      const v = ri(random, 2, 8);
      const isTarget = idx === targetIdx;
      const useCorrect = findCorrect ? isTarget : !isTarget;
      const sign = useCorrect ? item.sign : item.wrong;
      const labelKo = `${item.ko.replace('{v}', v)}: ${sign}${v}`;
      const labelEn = `${item.en.replace('{v}', v)}: ${sign}${v}`;
      return {
        value: String(idx + 1),
        label: tx(profile, labelKo, labelEn),
      };
    });

    return {
      prompt: tx(profile,
        findCorrect ? '다음 중 부호 + 또는 -를 사용하여 나타낸 것으로 옳은 것은?' : '다음 중 부호 + 또는 -를 사용하여 나타낸 것으로 옳지 않은 것은?',
        findCorrect ? 'Which statement correctly represents the quantity with + or -?' : 'Which statement incorrectly represents the quantity with + or -?'),
      expression: choices.map((c) => `${c.value}. ${c.label}`).join('   '),
      choices,
      answer: String(targetIdx + 1),
      explanation: tx(profile,
        `반대되는 성질을 가진 수량에서 이익·증가·영상·해발 등은 '+', 손해·감소·영하·해저 등은 '-' 부호를 사용합니다.`,
        `Quantities indicating increase/above use '+', while decrease/below use '-'.`),
    };
  }

  const items = [
    { ko: '해저 200 m', en: '200 m below sea level', correct: '-200 m', given: random() < 0.5 ? '-200 m' : '+200 m' },
    { ko: '500원 손해', en: '500 KRW loss', correct: '-500원', given: random() < 0.5 ? '-500원' : '+500원' },
    { ko: '지상 7층', en: 'Floor 7 above ground', correct: '+7층', given: random() < 0.5 ? '+7층' : '-7층' },
    { ko: '영하 3℃', en: '3°C below zero', correct: '-3℃', given: random() < 0.5 ? '-3℃' : '+3℃' },
    { ko: '출발 10분 전', en: '10 mins before departure', correct: '-10분', given: random() < 0.5 ? '-10분' : '+10분' },
  ];
  const rightCount = items.filter((it) => it.correct === it.given).length;
  const tags = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ'];

  return {
    prompt: tx(profile,
      '다음 보기 중 부호 + 또는 -를 사용하여 나타낸 것으로 옳은 것은 모두 몇 개인지 구하시오.',
      'How many of the following statements correctly use the + or - sign?'),
    expression: items.map((it, idx) => `${tags[idx]}. ${tx(profile, it.ko, it.en)}: ${it.given}`).join(',  '),
    answer: String(rightCount),
    answerSuffix: tx(profile, '개', ''),
    explanation: tx(profile,
      `주어진 보기를 올바른 부호로 검증하면 옳은 것은 총 ${rightCount}개입니다.`,
      `Verifying the statements yields ${rightCount} correct ones.`),
  };
}

// 2. 정수의 분류 및 약분 분수 (RPM 유형 02, #0273, #0274, #0275, #0276)
function rpmIrClassifyIntegers(random, profile) {
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
  }));

  return {
    prompt: tx(profile, '다음 중 정수가 아닌 것은?', 'Which of the following is NOT an integer?'),
    expression: choices.map((c) => `${c.value}. ${c.label}`).join('   '),
    choices,
    answer: String(wrongIdx + 1),
    explanation: tx(profile,
      `${choices[wrongIdx].label}은 약분하여도 분모가 1이 되지 않으므로 정수가 아닙니다.`,
      `${choices[wrongIdx].label} does not simplify to an integer.`),
  };
}

// 3. 유리수의 분류 및 체계 (RPM 유형 03, #0277, #0278, #0279, #0326, #0329)
function rpmIrClassifyRationals(random, profile) {
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
    prompt: tx(profile,
      '다음 수 중에서 양의 유리수의 개수를 x개, 음의 유리수의 개수를 y개, 정수가 아닌 유리수의 개수를 z개라 할 때, x - y + z의 값을 구하시오.',
      'Let x = positive rationals, y = negative rationals, z = non-integer rationals. Find x - y + z.'),
    expression: list.map((it) => it.text).join(',  '),
    answer: String(ans),
    explanation: tx(profile,
      `x = ${x}, y = ${y}, z = ${z}이므로 x - y + z = ${ans}입니다.`,
      `x = ${x}, y = ${y}, z = ${z}, so x - y + z = ${ans}.`),
  };
}

// 4. 수직선 위의 점과 가장 가까운 정수 (RPM 유형 04, #0280~0285, #0325, #0348)
function rpmIrNumberLineRead(random, profile) {
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
    prompt: tx(profile,
      `수직선 위에서 -${aNum}/${aDen}에 가장 가까운 정수를 a, ${bNum}/${bDen}에 가장 가까운 정수를 b라 할 때, a보다 크고 b보다 크지 않은 정수의 개수를 구하시오.`,
      `Let a be the closest integer to -${aNum}/${aDen}, and b the closest integer to ${bNum}/${bDen}. How many integers satisfy a < x ≤ b?`),
    expression: `a = [-${aNum}/${aDen} 근처 정수], b = [${bNum}/${bDen} 근처 정수]`,
    answer: String(count),
    answerSuffix: tx(profile, '개', ''),
    explanation: tx(profile,
      `a = ${closestA}, b = ${closestB}이므로 ${closestA} < x ≤ ${closestB}인 정수는 총 ${count}개입니다.`,
      `a = ${closestA}, b = ${closestB}, giving ${count} integers satisfying ${closestA} < x ≤ ${closestB}.`),
  };
}

// 5. 수직선 위 같은 거리(중점)와 양 끝점 역추론 (RPM 유형 05, #0286~0288, #0333, #0349, #0350)
function rpmIrMidpointDistance(random, profile) {
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
    prompt: tx(profile,
      `수직선 위에서 ${p1}과 ${p2}를 나타내는 두 점으로부터 같은 거리에 있는 점이 나타내는 수를 구하시오.`,
      `Find the number represented by the point equidistant from ${p1} and ${p2} on the number line.`),
    expression: `중점 = (${p1} + ${p2}) ÷ 2`,
    answer: String(mid),
    diagram,
    explanation: tx(profile,
      `두 점의 한가운데 점은 (${p1} + ${p2}) ÷ 2 = ${mid}입니다.`,
      `The midpoint is (${p1} + ${p2}) ÷ 2 = ${mid}.`),
  };
}

// 6. 절댓값의 계산과 최대·최소 (RPM 유형 06, #0289~0292, #0344)
function rpmIrAbsBasicExtremum(random, profile) {
  const d1 = pick(random, [2, 3]);
  const d2 = pick(random, [3, 4, 5]);
  const n1 = 1;
  const n2 = ri(random, 1, d2 - 1);
  const sumNum = n1 * d2 + n2 * d1;
  const sumDen = d1 * d2;
  const ans = fracStr(sumNum, sumDen);

  return {
    prompt: tx(profile,
      `두 수 a, b에 대하여 a의 절댓값이 ${n1}/${d1}이고 b의 절댓값이 ${n2}/${d2}일 때, a + b의 값 중에서 가장 큰 값을 구하시오.`,
      `If |a| = ${n1}/${d1} and |b| = ${n2}/${d2}, find the maximum possible value of a + b.`),
    expression: `|a| = ${n1}/${d1}, |b| = ${n2}/${d2}`,
    answer: ans,
    explanation: tx(profile,
      `a = ${n1}/${d1}, b = ${n2}/${d2}일 때 a + b의 최댓값 ${ans}을 갖습니다.`,
      `Maximum occurs when both are positive, yielding ${ans}.`),
  };
}

// 7. 절댓값의 성질과 참·거짓 (RPM 유형 07, #0293~0295, #0338, #0339, #0340)
function rpmIrAbsProperties(random, profile) {
  const list = [
    { text: `3`, v: 3, abs: 3 },
    { text: `-1.5`, v: -1.5, abs: 1.5 },
    { text: `5/4`, v: 1.25, abs: 1.25 },
    { text: `-7/2`, v: -3.5, abs: 3.5 },
    { text: `4/3`, v: 1.333, abs: 1.333 },
    { text: `-2`, v: -2, abs: 2 },
  ].sort(() => random() - 0.5);

  const sorted = [...list].sort((a, b) => b.abs - a.abs);
  const farthest = sorted[0].text;
  const closest = sorted[sorted.length - 1].text;

  return {
    prompt: tx(profile,
      '다음 수를 수직선 위에 나타내었을 때, 원점에서 가장 멀리 떨어진 수를 A, 원점에 가장 가까운 수를 B라 할 때, A와 B를 차례로 구하시오.',
      'Find the number farthest from the origin (A) and closest to the origin (B) in order.'),
    expression: list.map((x) => x.text).join(',  '),
    answer: `${farthest}, ${closest}`,
    explanation: tx(profile,
      `절댓값이 가장 큰 수가 원점에서 가장 멀고(${farthest}), 가장 작은 수가 가장 가깝습니다(${closest}).`,
      `Farthest is ${farthest}, closest is ${closest}.`),
  };
}

// 8. 절댓값 범위와 조건을 만족하는 정수 개수 (RPM 유형 08, #0296~0299, #0331, #0342, #0347)
function rpmIrAbsRangeCount(random, profile) {
  const num = pick(random, [9, 11, 13, 17]);
  const den = pick(random, [3, 4, 5]);
  const maxInt = Math.floor(num / den);
  const count = 2 * maxInt + 1;

  return {
    prompt: tx(profile,
      `절댓값이 ${num}/${den} 이하인 정수의 개수를 구하시오.`,
      `How many integers have an absolute value of at most ${num}/${den}?`),
    expression: `|x| ≤ ${num}/${den}`,
    answer: String(count),
    answerSuffix: tx(profile, '개', ''),
    explanation: tx(profile,
      `|x| ≤ ${num}/${den} (≈ ${(num / den).toFixed(2)})을 만족하는 정수는 -${maxInt}부터 ${maxInt}까지 총 ${count}개입니다.`,
      `Integers from -${maxInt} to ${maxInt} give ${count} values.`),
  };
}

// 9. 절댓값이 같고 부호가 반대인 두 수 (RPM 유형 09, #0300~0303, #0341, #0345)
function rpmIrOppositeSignsAbs(random, profile) {
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
    prompt: tx(profile,
      `절댓값이 같고 부호가 반대인 두 수를 수직선 위에 나타내었을 때의 두 점 사이의 거리가 ${num}/${den}이다. 이때 두 수 중 큰 수는?`,
      `Two numbers have equal absolute values and opposite signs. If the distance between them is ${num}/${den}, what is the greater number?`),
    expression: `거리 = ${num}/${den}`,
    answer: ans,
    diagram,
    explanation: tx(profile,
      `원점으로부터의 거리는 (${num}/${den}) × 1/2 = ${ans}이며 큰 수는 양수이므로 ${ans}입니다.`,
      `Distance from origin is (${num}/${den}) × 1/2 = ${ans}.`),
  };
}

// 10. 유리수와 절댓값의 대소 관계 및 순서 (RPM 유형 10, #0304~0310, #0328, #0330, #0337)
function rpmIrCompareOrder(random, profile) {
  const list = [
    { text: `-9`, abs: 9 },
    { text: `5`, abs: 5 },
    { text: `-5/2`, abs: 2.5 },
    { text: `-3`, abs: 3 },
    { text: `-6.5`, abs: 6.5 },
    { text: `0`, abs: 0 },
  ].sort(() => random() - 0.5);

  const sorted = [...list].sort((a, b) => b.abs - a.abs);
  const ans = sorted[1].text;

  return {
    prompt: tx(profile,
      '다음 수 중에서 절댓값이 두 번째로 큰 수를 구하시오.',
      'Find the number with the second greatest absolute value.'),
    expression: list.map((x) => x.text).join(',  '),
    answer: ans,
    explanation: tx(profile,
      `절댓값을 크기순으로 나열했을 때 두 번째로 큰 수는 ${ans}입니다.`,
      `The second largest absolute value is ${ans}.`),
  };
}

// 11. 문장 조건의 부등호 표현 ('작지 않다'·'크지 않다') (RPM 유형 11, #0311~0313, #0327, #0332)
function rpmIrInequalityPhrasing(random, profile) {
  const a = ri(random, 5, 9);
  const frac = `-${ri(random, 1, 3)}/5`;
  const ans = `${frac} ≤ x ≤ ${a}`;

  return {
    prompt: tx(profile,
      `'x는 ${a} 이하이고 ${frac}보다 작지 않다.'를 부등호를 사용하여 나타내시오.`,
      `Express 'x is at most ${a} and not less than ${frac}' using inequalities.`),
    expression: `x ≤ ${a}, x ≥ ${frac}`,
    answer: ans,
    explanation: tx(profile,
      `'${a} 이하'는 x ≤ ${a}, '${frac}보다 작지 않다'는 x ≥ ${frac}이므로 ${ans}입니다.`,
      `'At most ${a}' is x ≤ ${a} and 'not less than ${frac}' is x ≥ ${frac}, giving ${ans}.`),
  };
}

// 12. 두 유리수 사이의 정수 및 기약분수 개수 (RPM 유형 12, #0314~0317, #0335, #0336, #0346)
function rpmIrBetweenIntegersFractions(random, profile) {
  const aNum = ri(random, 7, 11);
  const aDen = 2;
  const bNum = ri(random, 5, 8);
  const bDen = 3;

  const minInt = Math.ceil(-aNum / aDen);
  const maxInt = Math.floor(bNum / bDen);
  const count = maxInt - minInt + 1;

  return {
    prompt: tx(profile,
      `두 유리수 -${aNum}/${aDen}와 ${bNum}/${bDen} 사이에 있는 정수의 개수를 구하시오.`,
      `How many integers lie between -${aNum}/${aDen} and ${bNum}/${bDen}?`),
    expression: `-${aNum}/${aDen} < x < ${bNum}/${bDen}`,
    answer: String(count),
    answerSuffix: tx(profile, '개', ''),
    explanation: tx(profile,
      `${minInt}부터 ${maxInt}까지 총 ${count}개의 정수가 있습니다.`,
      `There are ${count} integers from ${minInt} to ${maxInt}.`),
  };
}

// 13. 절댓값 조건 응용 및 순서쌍 / 거리 비율 (RPM 유형 13, #0318~0320, #0351, #0353, #0355)
function rpmIrAbsPairsRatio(random, profile) {
  const r = pick(random, [2, 3, 4]);
  const bAbs = ri(random, 2, 4);
  const dist = (r + 1) * bAbs;
  const aVal = r * bAbs;
  const bVal = -bAbs;

  return {
    prompt: tx(profile,
      `부호가 반대인 두 정수 a, b에 대하여 a의 절댓값은 b의 절댓값의 ${r}배이고 a > b이다. 수직선 위에서 a, b를 나타내는 두 점 사이의 거리가 ${dist}일 때, 두 정수 a, b의 값을 구하시오.`,
      `Two integers a, b have opposite signs with a > b. If |a| = ${r}|b| and distance is ${dist}, find a and b.`),
    expression: `|a| = ${r}|b|, 거리 = ${dist}`,
    answer: `a=${aVal}, b=${bVal}`,
    explanation: tx(profile,
      `두 점 사이의 거리는 ${r + 1}|b| = ${dist}이므로 |b| = ${bAbs}입니다. a = ${aVal}, b = ${bVal}입니다.`,
      `Distance is ${r + 1}|b| = ${dist}, so |b| = ${bAbs}. a = ${aVal}, b = ${bVal}.`),
  };
}

// 14. 다중 수의 조건과 수직선 대소 추론 (RPM 유형 14, #0321~0323, #0354)
function rpmIrDeduceMultiOrder(random, profile) {
  const choices = [
    { value: '1', label: 'd < a < c < b' },
    { value: '2', label: 'd < a < b < c' },
    { value: '3', label: 'a < d < c < b' },
    { value: '4', label: 'd < c < a < b' },
    { value: '5', label: 'a < c < b < d' },
  ];

  return {
    prompt: tx(profile,
      `다음 조건을 모두 만족시키는 서로 다른 네 수 a, b, c, d의 대소 관계를 부등호를 사용하여 나타낸 것으로 옳은 것은?\n(가) a는 0보다 작다.\n(나) b는 c보다 크다.\n(다) a의 절댓값과 c의 절댓값은 같다.\n(라) d는 a, b, c, d 중 가장 작은 수이다.`,
      `Order a, b, c, d given: (a) a < 0, (b) b > c, (c) |a| = |c|, (d) d is the smallest.`),
    expression: `a < 0, b > c, |a| = |c|, d = min`,
    choices,
    answer: '1',
    explanation: tx(profile,
      `a < 0이고 |a| = |c|이므로 c > 0입니다. b > c이므로 a < c < b이고 d가 가장 작으므로 d < a < c < b입니다.`,
      `Since a < 0 and |a| = |c|, c > 0. Since b > c, a < c < b. With d smallest, d < a < c < b.`),
  };
}

// 15. 정수와 유리수 응용 종합 실전 모의고사
const rpmIrServerList = [
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

function rpmIrAllTypesMixed(random, profile) {
  return pick(random, rpmIrServerList)(random, profile);
}

// Legacy alias
const rpmRationalLineDivision = rpmIrNumberLineRead;

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

// 1. 유리수의 덧셈과 계산 법칙
function rpmIrcAdditionLaws(random, profile) {
  const mode = pick(random, ['law-identity', 'two-fractions', 'three-fractions']);
  if (mode === 'law-identity') {
    const a = ri(random, 2, 6);
    const b = ri(random, 3, 7);
    const choices = [
      { value: '1', label: '㈎ 덧셈의 교환법칙, ㈏ 덧셈의 결합법칙', labelEn: '(a) Commutative property, (b) Associative property', isRight: true },
      { value: '2', label: '㈎ 덧셈의 결합법칙, ㈏ 덧셈의 교환법칙', labelEn: '(a) Associative property, (b) Commutative property', isRight: false },
      { value: '3', label: '㈎ 덧셈의 교환법칙, ㈏ 분배법칙', labelEn: '(a) Commutative property, (b) Distributive property', isRight: false },
      { value: '4', label: '㈎ 곱셈의 교환법칙, ㈏ 덧셈의 결합법칙', labelEn: '(a) Mult commutative, (b) Add associative', isRight: false },
      { value: '5', label: '㈎ 덧셈의 결합법칙, ㈏ 곱셈의 결합법칙', labelEn: '(a) Add associative, (b) Mult associative', isRight: false },
    ];
    return {
      prompt: tx(profile,
        '다음 계산 과정에서 ㈎, ㈏에 이용된 덧셈의 연산 법칙을 바르게 짝지은 것은?',
        'Which option correctly identifies the addition properties used in steps (a) and (b)?'),
      expression: `(+${a}/5) + (-2/${b}) + (-${a + 5}/5)\n= (+${a}/5) + (-${a + 5}/5) + (-2/${b})  ... [㈎]\n= {(+${a}/5) + (-${a + 5}/5)} + (-2/${b})  ... [㈏]\n= (-1) + (-2/${b}) = -${b + 2}/${b}`,
      choices,
      answer: '1',
      explanation: tx(profile,
        '두 수의 자리를 바꾼 [㈎]는 덧셈의 교환법칙이고, 앞의 두 수를 먼저 묶어 계산한 [㈏]는 덧셈의 결합법칙입니다.',
        'Swapping positions is commutative property [a]; grouping is associative property [b].'),
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
      prompt: tx(profile, '다음을 계산하시오.', 'Calculate the following sum.'),
      expression: `${parenSignedFrac(f1)} + ${parenSignedFrac(f2)}`,
      answer: ans,
      explanation: tx(profile,
        `통분하여 계산하면 (${fracSignedStr(fracObj(f1.n * (lcm(d1, d2)/d1), lcm(d1, d2)))}) + (${fracSignedStr(fracObj(f2.n * (lcm(d1, d2)/d2), lcm(d1, d2)))}) = ${ans}입니다.`,
        `Finding common denominator gives ${ans}.`),
    };
  }
  const d = pick(random, [3, 4, 5, 7]);
  const f1 = fracObj(ri(random, 1, 4), d);
  const f2 = fracObj(-ri(random, 2, 8), pick(random, [2, 6, 9]));
  const f3 = fracObj(-ri(random, 5, 12), d);
  const sum = fracAdd(fracAdd(f1, f3), f2);
  const ans = fracStr(sum.n, sum.d);
  return {
    prompt: tx(profile, '덧셈의 연산 법칙을 이용하여 다음을 계산하시오.', 'Evaluate using the properties of addition.'),
    expression: `${parenSignedFrac(f1)} + ${parenSignedFrac(f2)} + ${parenSignedFrac(f3)}`,
    answer: ans,
    explanation: tx(profile,
      `분모가 같은 ${parenSignedFrac(f1)}와 ${parenSignedFrac(f3)}를 먼저 결합하여 계산하면 ${ans}입니다.`,
      `Group fractions with same denominator first to get ${ans}.`),
  };
}

// 2. 유리수의 뺄셈
function rpmIrcSubtractionBasic(random, profile) {
  const d1 = pick(random, [3, 4, 5, 6]);
  const d2 = pick(random, [2, 3, 4, 5]);
  const f1 = fracObj(ri(random, -5, 5) || -1, d1);
  const f2 = fracObj(ri(random, -5, 5) || 2, d2);
  const diff = fracSub(f1, f2);
  const ans = fracStr(diff.n, diff.d);
  return {
    prompt: tx(profile, '다음을 계산하시오.', 'Calculate the subtraction.'),
    expression: `${parenSignedFrac(f1)} - ${parenSignedFrac(f2)}`,
    answer: ans,
    explanation: tx(profile,
      `빼는 수의 부호를 바꾸어 덧셈으로 계산하면 ${parenSignedFrac(f1)} + ${parenSignedFrac({ n: -f2.n, d: f2.d })} = ${ans}입니다.`,
      `Change subtraction to addition of opposite sign to get ${ans}.`),
  };
}

// 3. 정수의 덧셈과 뺄셈의 혼합 계산
function rpmIrcAddSubIntegers(random, profile) {
  const a = ri(random, 3, 9);
  const b = -ri(random, 2, 8);
  const c = ri(random, 4, 9);
  const d = -ri(random, 3, 7);
  const val = a + b - c - d;
  return {
    prompt: tx(profile, '다음을 계산하시오.', 'Evaluate the mixed integer operations.'),
    expression: `(+${a}) + (${b}) - (+${c}) - (${d})`,
    answer: String(val),
    explanation: tx(profile,
      `뺄셈을 덧셈으로 바꾸면 (+${a}) + (${b}) + (-${c}) + (+${-d}) = ${val}입니다.`,
      `Convert subtractions to additions to evaluate: ${val}.`),
  };
}

// 4. 유리수의 덧셈과 뺄셈의 혼합 계산
function rpmIrcAddSubRationals(random, profile) {
  const isDecimalMix = random() < 0.4;
  if (isDecimalMix) {
    const dec = ri(random, 21, 49) / 10;
    const n1 = ri(random, 3, 8);
    const n2 = ri(random, 5, 12);
    const ans = n2 - n1;
    return {
      prompt: tx(profile, '다음을 계산하시오.', 'Calculate the following expression.'),
      expression: `(-${dec}) - (+${n1}) + (+${n2}) - (-${dec})`,
      answer: String(ans),
      explanation: tx(profile,
        `(-${dec})와 -(-${dec}) = +${dec}가 서로 상쇄되므로 -(+${n1}) + (+${n2}) = ${ans}입니다.`,
        `The terms (-${dec}) and -(-${dec}) cancel each other out, giving ${ans}.`),
    };
  }
  const f1 = fracObj(-1, 2);
  const f2 = fracObj(2, 3);
  const f3 = fracObj(-3, 4);
  const f4 = fracObj(-5, 6);
  const res = fracAdd(fracSub(fracAdd(f1, f2), f3), f4);
  const ans = fracStr(res.n, res.d);
  return {
    prompt: tx(profile, '다음을 계산하시오.', 'Evaluate the rational expression.'),
    expression: `${parenSignedFrac(f1)} + ${parenSignedFrac(f2)} - ${parenSignedFrac(f3)} + ${parenSignedFrac(f4)}`,
    answer: ans,
    explanation: tx(profile,
      `최소공배수 12로 통분하여 계산하면 ${ans}입니다.`,
      `Using common denominator 12 yields ${ans}.`),
  };
}

// 5. 부호가 생략된 수의 덧셈과 뺄셈
function rpmIrcOmittedSigns(random, profile) {
  const isFraction = random() < 0.5;
  if (isFraction) {
    const f1 = fracObj(-3, 4);
    const f2 = fracObj(11, 20);
    const f3 = fracObj(-3, 10);
    const res = fracAdd(fracAdd(f1, f2), f3);
    const ans = fracStr(res.n, res.d);
    return {
      prompt: tx(profile, '다음을 계산하시오.', 'Evaluate the expression without parentheses.'),
      expression: `-3/4 + 11/20 - 3/10`,
      answer: ans,
      explanation: tx(profile,
        `분모의 최소공배수인 20으로 통분하면 -15/20 + 11/20 - 6/20 = ${ans}입니다.`,
        `With common denominator 20, result is ${ans}.`),
    };
  }
  const a = -ri(random, 4, 9);
  const b = ri(random, 10, 18);
  const c = -ri(random, 5, 12);
  const d = ri(random, 2, 8);
  const ans = a + b + c + d;
  return {
    prompt: tx(profile, '다음을 계산하시오.', 'Evaluate the following sum with omitted signs.'),
    expression: `${a} + ${b} - ${Math.abs(c)} + ${d}`,
    answer: String(ans),
    explanation: tx(profile,
      `양수는 양수끼리, 음수는 음수끼리 모아서 계산하면 ${ans}입니다.`,
      `Grouping positives and negatives yields ${ans}.`),
  };
}

// 6. 어떤 수보다 □만큼 큰 수·작은 수
function rpmIrcRelativeDifference(random, profile) {
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
    prompt: tx(profile,
      `${fracStr(fA_base.n, fA_base.d)}보다 ${diffA}만큼 작은 수를 a, ${n2}보다 ${fracStr(diffB.n, diffB.d)}만큼 큰 수를 b라 할 때, a < x < b를 만족시키는 정수 x의 개수를 구하시오.`,
      `Let a be ${diffA} less than ${fracStr(fA_base.n, fA_base.d)}, and b be ${fracStr(diffB.n, diffB.d)} greater than ${n2}. Find the number of integers x satisfying a < x < b.`),
    expression: `a = (${fracStr(fA_base.n, fA_base.d)}) - (${diffA}),  b = ${n2} + (${fracStr(diffB.n, diffB.d)})`,
    answer: String(count),
    answerSuffix: tx(profile, '개', ''),
    explanation: tx(profile,
      `a = ${fracStr(a.n, a.d)}, b = ${fracStr(b.n, b.d)}이므로 ${fracStr(a.n, a.d)} < x < ${fracStr(b.n, b.d)}를 만족하는 정수 x는 총 ${count}개입니다.`,
      `Since a = ${fracStr(a.n, a.d)} and b = ${fracStr(b.n, b.d)}, there are ${count} integers satisfying the condition.`),
  };
}

// 7. □ 안에 알맞은 수 구하기 (1) 덧셈·뺄셈
function rpmIrcUnknownAddSub(random, profile) {
  const d1 = pick(random, [3, 4, 5]);
  const d2 = pick(random, [2, 3, 4]);
  const fA = fracObj(-ri(random, 1, 4), d1);
  const fB = fracObj(ri(random, 1, 3), d2);
  const box = fracSub(fA, fB);
  const ans = fracStr(box.n, box.d);
  return {
    prompt: tx(profile, '다음 □ 안에 알맞은 수를 구하시오.', 'Find the number that fits in □.'),
    expression: `${parenSignedFrac(fA)} - □ = ${fracStr(fB.n, fB.d)}`,
    answer: ans,
    explanation: tx(profile,
      `□ = ${parenSignedFrac(fA)} - ${parenSignedFrac(fB)} = ${ans}입니다.`,
      `□ = ${parenSignedFrac(fA)} - ${parenSignedFrac(fB)} = ${ans}.`),
  };
}

// 8. 절댓값이 주어진 두 수의 덧셈과 뺄셈
function rpmIrcAbsExtremumAddSub(random, profile) {
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
    prompt: tx(profile,
      `두 유리수 a, b에 대하여 a의 절댓값은 ${fracStr(absA.n, absA.d)}, b의 절댓값은 ${fracStr(absB.n, absB.d)}이다. a - b의 값 중에서 가장 큰 값을 M, 가장 작은 값을 m이라 할 때, M - m의 값을 구하시오.`,
      `Given |a| = ${fracStr(absA.n, absA.d)} and |b| = ${fracStr(absB.n, absB.d)}, let M and m be the maximum and minimum values of a - b. Find M - m.`),
    expression: `|a| = ${fracStr(absA.n, absA.d)},  |b| = ${fracStr(absB.n, absB.d)}`,
    answer: ans,
    explanation: tx(profile,
      `M = ${fracStr(M.n, M.d)}, m = ${fracStr(m.n, m.d)}이므로 M - m = ${ans}입니다.`,
      `M = ${fracStr(M.n, M.d)}, m = ${fracStr(m.n, m.d)}, yielding M - m = ${ans}.`),
  };
}

// 9. 덧셈·뺄셈의 활용 (마방진 및 게임 점수)
function rpmIrcMagicSquareGame(random, profile) {
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
    prompt: tx(profile,
      `두 사람이 가위바위보를 하여 이기면 ${winPts}점을 얻고, 지면 ${Math.abs(losePts)}점을 잃는 게임을 하였다. 비기는 경우 없이 총 ${totalGames}번을 하여 A가 ${aWins}번 이겼을 때, A의 점수와 B의 점수의 차를 구하시오.`,
      `In a rock-paper-scissors game, a win grants ${winPts} pts and a loss loses ${Math.abs(losePts)} pts. With no ties over ${totalGames} rounds, A won ${aWins} times. Find the score difference between A and B.`),
    expression: `A: ${aWins}승 ${aLoses}패,  B: ${bWins}승 ${bLoses}패`,
    answer: String(diff),
    answerSuffix: tx(profile, '점', 'pts'),
    explanation: tx(profile,
      `A는 ${scoreA}점, B는 ${scoreB}점이므로 두 사람의 점수 차는 ${diff}점입니다.`,
      `A scored ${scoreA}, B scored ${scoreB}, giving a difference of ${diff} pts.`),
  };
}

// 10. 유리수의 곱셈과 곱셈의 계산 법칙
function rpmIrcMultiplicationBasic(random, profile) {
  const f1 = fracObj(-ri(random, 2, 5), pick(random, [2, 3]));
  const f2 = fracObj(ri(random, 2, 6), pick(random, [5, 7]));
  const f3 = fracObj(-ri(random, 3, 7), pick(random, [2, 4]));
  const prod = fracMul(fracMul(f1, f2), f3);
  const ans = fracStr(prod.n, prod.d);
  return {
    prompt: tx(profile, '다음을 계산하시오.', 'Calculate the product.'),
    expression: `${parenSignedFrac(f1)} × ${parenSignedFrac(f2)} × ${parenSignedFrac(f3)}`,
    answer: ans,
    explanation: tx(profile,
      `음수가 2개(짝수 개)이므로 부호는 (+)이고, 약분하여 곱하면 ${ans}입니다.`,
      `Two negative signs yield a positive product: ${ans}.`),
  };
}

// 11. 네 수 중 세 수를 뽑아 곱하기
function rpmIrcPickThreeProduct(random, profile) {
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
    prompt: tx(profile,
      '네 유리수 -2/3, 7/4, -1/2, -6 중에서 서로 다른 세 수를 뽑아 곱한 값 중 가장 큰 값과 가장 작은 값의 차를 구하시오.',
      'From the four numbers -2/3, 7/4, -1/2, -6, find the difference between the greatest and least products of three distinct numbers.'),
    expression: `세 수의 곱의 최댓값 M, 최솟값 m`,
    answer: ans,
    explanation: tx(profile,
      `가장 큰 값은 7이고, 가장 작은 값은 -2이므로 차는 7 - (-2) = ${ans}입니다.`,
      `Max product is 7, min is -2, difference is 7 - (-2) = ${ans}.`),
  };
}

// 12. 거듭제곱의 계산
function rpmIrcPowersSigns(random, profile) {
  const a = ri(random, 2, 4);
  const b = ri(random, 2, 3);
  const v1 = Math.pow(-a, 2);
  const v2 = Math.pow(-b, 3);
  const ans = v1 - v2;
  return {
    prompt: tx(profile, '다음을 계산하시오.', 'Evaluate the expression with powers.'),
    expression: `(-${a})^2 - (-${b})^3`,
    answer: String(ans),
    explanation: tx(profile,
      `(-${a})^2 = ${v1}, (-${b})^3 = ${v2}이므로 ${v1} - (${v2}) = ${ans}입니다.`,
      `(-${a})^2 = ${v1}, (-${b})^3 = ${v2}, giving ${ans}.`),
  };
}

// 13. (-1)^n의 계산
function rpmIrcNegOnePower(random, profile) {
  const isOdd = random() < 0.5;
  const promptKo = `n이 ${isOdd ? '홀수' : '짝수'}일 때, (-1)^n - (-1)^(n+1) + (-1)^(2n) 의 값을 구하시오.`;
  const promptEn = `Given that n is an ${isOdd ? 'odd' : 'even'} integer, find the value of (-1)^n - (-1)^(n+1) + (-1)^(2n).`;
  const finalAns = isOdd ? -1 : 3;
  return {
    prompt: tx(profile, promptKo, promptEn),
    expression: `(-1)^n - (-1)^(n+1) + (-1)^(2n)`,
    answer: String(finalAns),
    explanation: tx(profile,
      `n이 ${isOdd ? '홀수' : '짝수'}이므로 대입하여 정리하면 ${finalAns}입니다.`,
      `Evaluating based on n parity gives ${finalAns}.`),
  };
}

// 14. 분배법칙의 활용
function rpmIrcDistributiveLaw(random, profile) {
  const common = ri(random, 15, 35) + 0.3;
  const k1 = ri(random, 12, 35);
  const k2 = 100 - k1;
  const ans = Math.round(common * 100 * 10) / 10;
  return {
    prompt: tx(profile, '분배법칙을 이용하여 편리하게 다음을 계산하시오.', 'Use the distributive property to evaluate.'),
    expression: `${common} × ${k1} + ${common} × ${k2}`,
    answer: String(ans),
    explanation: tx(profile,
      `${common} × (${k1} + ${k2}) = ${common} × 100 = ${ans}입니다.`,
      `${common} × (${k1} + ${k2}) = ${common} × 100 = ${ans}.`),
  };
}

// 15. 역수의 정의와 미지수 역수 방정식
function rpmIrcReciprocalEquation(random, profile) {
  const a = -15;
  const b = -4;
  const ans = b - a;
  return {
    prompt: tx(profile,
      '다음 조건을 모두 만족시키는 두 유리수 a, b에 대하여 b - a의 값을 구하시오.\n(가) -a/9의 역수는 3/5이다.\n(나) 3/b의 역수는 -4/3이다.',
      'Given rational numbers a, b where the reciprocal of -a/9 is 3/5, and the reciprocal of 3/b is -4/3, find b - a.'),
    expression: `b - a`,
    answer: String(ans),
    explanation: tx(profile,
      `-a/9의 역수는 -9/a = 3/5이므로 a = -15이고, 3/b의 역수는 b/3 = -4/3이므로 b = -4입니다. 따라서 b - a = ${ans}입니다.`,
      `Reciprocals give a = -15 and b = -4, so b - a = ${ans}.`),
  };
}

// 16. 정수와 유리수의 나눗셈
function rpmIrcDivisionBasic(random, profile) {
  const f1 = fracObj(-ri(random, 8, 20), pick(random, [3, 4, 6]));
  const f2 = fracObj(-ri(random, 2, 7), pick(random, [2, 5]));
  const quot = fracDiv(f1, f2);
  const ans = fracStr(quot.n, quot.d);
  return {
    prompt: tx(profile, '다음을 계산하시오.', 'Calculate the division.'),
    expression: `${parenSignedFrac(f1)} ÷ ${parenSignedFrac(f2)}`,
    answer: ans,
    explanation: tx(profile,
      `나눗셈을 역수의 곱셈으로 바꾸어 계산하면 ${ans}입니다.`,
      `Multiplying by the reciprocal gives ${ans}.`),
  };
}

// 17. 곱셈과 나눗셈의 혼합 계산
function rpmIrcMultDivMixed(random, profile) {
  const f2 = fracObj(-9, 4);
  const f3 = fracObj(-2, 3);
  const sq = fracObj(9, 4);
  const res = fracMul(fracDiv(sq, f2), f3);
  const ans = fracStr(res.n, res.d);
  return {
    prompt: tx(profile, '다음을 계산하시오.', 'Evaluate the mixed multiplication and division.'),
    expression: `(-3/2)^2 ÷ (-9/4) × (-2/3)`,
    answer: ans,
    explanation: tx(profile,
      `거듭제곱 계산 후 나눗셈을 곱셈으로 고치면 ${ans}입니다.`,
      `Evaluating power and converting division gives ${ans}.`),
  };
}

// 18. 사칙 혼합 계산
function rpmIrcFourOperationsOrder(random, profile) {
  const base = ri(random, 4, 7);
  const mult = ri(random, 2, 3);
  const inside = 3;
  const ans = base - mult * (inside - (4 - (-4)));
  return {
    prompt: tx(profile, '계산 순서에 맞추어 다음을 계산하시오.', 'Calculate using order of operations.'),
    expression: `${base} - ${mult} × [ 3 - { (-2)^2 - 6 ÷ (-3/2) } ]`,
    answer: String(ans),
    explanation: tx(profile,
      `소괄호·거듭제곱 → 중괄호 → 대괄호 순서로 계산하면 ${ans}입니다.`,
      `Evaluating inside-out following order of operations yields ${ans}.`),
  };
}

// 19. □ 안에 알맞은 수 구하기 (2) 곱셈·나눗셈
function rpmIrcUnknownMultDiv(random, profile) {
  const fA = fracObj(-3, 4);
  const fC = fracObj(-2, 3);
  const fB = fracObj(1, 2);
  const box = fracDiv(fracMul(fA, fC), fB);
  const ans = fracStr(box.n, box.d);
  return {
    prompt: tx(profile, '다음 □ 안에 알맞은 수를 구하시오.', 'Find the number that fits into □.'),
    expression: `(-3/4) ÷ □ × (-2/3) = 1/2`,
    answer: ans,
    explanation: tx(profile,
      `(-3/4) × (-2/3) ÷ □ = 1/2에서 □ = ${ans}입니다.`,
      `Solving for □ gives ${ans}.`),
  };
}

// 20. 바르게 계산한 답 구하기
function rpmIrcCorrectAnswer(random, profile) {
  const mode = pick(random, ['add-sub', 'mult-div']);
  if (mode === 'add-sub') {
    const fErr = fracObj(-3, 5);
    const fRes = fracObj(3, 10);
    const X = fracSub(fRes, fErr);
    const correct = fracSub(X, fErr);
    const ans = fracStr(correct.n, correct.d);
    return {
      prompt: tx(profile,
        `어떤 유리수에서 ${parenSignedFrac(fErr)}을 빼야 할 것을 잘못하여 더했더니 결과가 ${fracStr(fRes.n, fRes.d)}이 되었다. 바르게 계산한 답을 구하시오.`,
        `A student mistakenly added ${parenSignedFrac(fErr)} instead of subtracting it, obtaining ${fracStr(fRes.n, fRes.d)}. Find the correct answer.`),
      expression: `어떤 수 = □`,
      answer: ans,
      explanation: tx(profile,
        `원래 수는 ${fracStr(X.n, X.d)}이므로 바른 답은 ${ans}입니다.`,
        `Original number is ${fracStr(X.n, X.d)}, giving correct answer ${ans}.`),
    };
  }
  const fErr = fracObj(-9, 7);
  const fRes = fracObj(10, 3);
  const X = fracMul(fRes, fErr);
  const correct = fracMul(X, fErr);
  const ans = fracStr(correct.n, correct.d);
  return {
    prompt: tx(profile,
      `어떤 유리수에 ${parenSignedFrac(fErr)}를 곱해야 할 것을 잘못하여 나누었더니 결과가 ${fracStr(fRes.n, fRes.d)}이 되었다. 바르게 계산한 답을 구하시오.`,
      `A student mistakenly divided by ${parenSignedFrac(fErr)} instead of multiplying by it, obtaining ${fracStr(fRes.n, fRes.d)}. Find the correct answer.`),
      expression: `어떤 수 = □`,
    answer: ans,
    explanation: tx(profile,
      `원래 수는 ${fracStr(X.n, X.d)}이므로 바른 답은 ${ans}입니다.`,
      `Original number is ${fracStr(X.n, X.d)}, giving correct answer ${ans}.`),
  };
}

// 21. 유리수의 부호 결정
function rpmIrcSignDetermination(random, profile) {
  const choices = [
    { value: '1', label: 'a > 0, b > 0, c > 0', labelEn: 'a > 0, b > 0, c > 0', isRight: false },
    { value: '2', label: 'a > 0, b > 0, c < 0', labelEn: 'a > 0, b > 0, c < 0', isRight: false },
    { value: '3', label: 'a > 0, b < 0, c > 0', labelEn: 'a > 0, b < 0, c > 0', isRight: false },
    { value: '4', label: 'a < 0, b > 0, c < 0', labelEn: 'a < 0, b > 0, c < 0', isRight: true },
    { value: '5', label: 'a < 0, b < 0, c < 0', labelEn: 'a < 0, b < 0, c < 0', isRight: false },
  ];
  return {
    prompt: tx(profile,
      '세 유리수 a, b, c에 대하여 a - b < 0, b/a < 0, a × c > 0일 때, 다음 중 옳은 것은?',
      'Given rational numbers a, b, c with a - b < 0, b/a < 0, and a × c > 0, which statement is true?'),
    expression: `a - b < 0,  b/a < 0,  a × c > 0`,
    choices,
    answer: '4',
    explanation: tx(profile,
      'b/a < 0에서 a, b 부호가 다르고, a < b이므로 a < 0, b > 0입니다. a × c > 0에서 c < 0이므로 a < 0, b > 0, c < 0입니다.',
      'Since b/a < 0 and a < b, a < 0 and b > 0. Since ac > 0, c < 0. Thus a < 0, b > 0, c < 0.'),
  };
}

// 22. 문자로 주어진 수의 대소 관계
function rpmIrcVariableMagnitude(random, profile) {
  const choices = [
    { value: '1', label: 'a', labelEn: 'a', isRight: false },
    { value: '2', label: '-a', labelEn: '-a', isRight: false },
    { value: '3', label: 'a^2', labelEn: 'a^2', isRight: false },
    { value: '4', label: '-a^2', labelEn: '-a^2', isRight: true },
    { value: '5', label: '1/a', labelEn: '1/a', isRight: false },
  ];
  return {
    prompt: tx(profile, 'a < -1인 유리수 a에 대하여 다음 중 가장 작은 수는?', 'Given a < -1, which number is the smallest?'),
    expression: `a < -1`,
    choices,
    answer: '4',
    explanation: tx(profile,
      'a = -2를 대입하면 -a^2 = -4가 가장 작습니다.',
      'Testing with a = -2 shows that -a^2 = -4 is the smallest.'),
  };
}

// 23. 수직선 선분의 m:n 비례분할 내분점
function rpmIrcLineSectionRatio(random, profile) {
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
    prompt: tx(profile,
      `수직선 위의 두 점 A, B를 이은 선분을 ${m} : ${n}으로 나누는 점이 C일 때, 점 C가 나타내는 수를 구하시오.`,
      `On a number line, point C divides line segment AB into ratio ${m} : ${n}. Find the coordinate of C.`),
    expression: `A(${fracStr(fA.n, fA.d)}), B(${fracStr(fB.n, fB.d)}), 선분 AB를 ${m}:${n}으로 내분하는 점 C`,
    answer: ans,
    diagram,
    explanation: tx(profile,
      `점 C의 좌표는 ${fracStr(fA.n, fA.d)} + (${fracStr(dist.n, dist.d)} × ${m}/${m + n}) = ${ans}입니다.`,
      `Coordinate of C is ${fracStr(fA.n, fA.d)} + (${fracStr(dist.n, dist.d)} × ${m}/${m + n}) = ${ans}.`),
  };
}

// 24. 부분분수 분해와 망원급수 계산
function rpmIrcTelescopingFractions(random, profile) {
  const start = pick(random, [2, 3, 4, 5]);
  const len = pick(random, [4, 5, 6]);
  const end = start + len;
  const res = fracSub(fracObj(1, start), fracObj(1, end));
  const ans = fracStr(res.n, res.d);
  return {
    prompt: tx(profile,
      '자연수 n에 대하여 1/(n(n+1)) = 1/n - 1/(n+1) 이 성립함을 이용하여 다음을 계산하시오.',
      'Using the telescoping identity 1/(n(n+1)) = 1/n - 1/(n+1), evaluate the sum.'),
    expression: `1/(${start}×${start + 1}) + 1/(${start + 1}×${start + 2}) + ... + 1/(${end - 1}×${end})`,
    answer: ans,
    explanation: tx(profile,
      `중간 항들이 소거되어 1/${start} - 1/${end} = ${ans}입니다.`,
      `Intermediate terms cancel out leaving 1/${start} - 1/${end} = ${ans}.`),
  };
}

// 25. 새로운 연산 기호 약속과 방정식
function rpmIrcCustomOperator(random, profile) {
  const ans = '18';
  return {
    prompt: tx(profile,
      '두 정수 a, b에 대하여 [a, b] = (두 수 a, b의 차)로 약속한다. 이때 [[3, 8], [10, a]] = 4가 성립하도록 하는 a의 값 중 가장 큰 수를 x, 가장 작은 수를 y라 할 때, [x, y]의 값을 구하시오.',
      'Define [a, b] = |a - b|. If [[3, 8], [10, a]] = 4, let x be the max value of a and y be the min. Find [x, y].'),
    expression: `[a, b] = |a - b|,  [[3, 8], [10, a]] = 4`,
    answer: ans,
    explanation: tx(profile,
      `가장 큰 수 x = 19, 가장 작은 수 y = 1이므로 [x, y] = |19 - 1| = 18입니다.`,
      `Max is 19 and min is 1, so [x, y] = |19 - 1| = 18.`),
  };
}

// 26. 정수와 유리수의 계산 응용 실전 종합
const rpmIrcServerList = [
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

function rpmIrcAllTypesMixed(random, profile) {
  return pick(random, rpmIrcServerList)(random, profile);
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

  // 03 정수와 유리수 RPM 세부 유형 (RPM 1-1 Pages 38~49)
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

  // Legacy aliases
  'rpmRationalEquidistant': rpmIrMidpointDistance,
  'rpmRationalAbsoluteCount': rpmIrAbsRangeCount,

  // 04 정수와 유리수의 계산 RPM 세부 유형 (RPM 1-1 Pages 54~71)
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

  // Legacy aliases
  'rpmOpsDistributiveSmart': rpmIrcDistributiveLaw,
  'rpmOpsNewOperation': rpmIrcCustomOperator,
  'rpmOpsTelescoping': rpmIrcTelescopingFractions,

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

  // 04 정수와 유리수의 계산 기본 탭 호환
  'rational-addition': rpmIrcAdditionLaws,
  'rational-subtraction': rpmIrcSubtractionBasic,
  'rational-add-subtract': rpmIrcAddSubRationals,
  'rational-multiplication': rpmIrcMultiplicationBasic,
  'rational-division': rpmIrcDivisionBasic,
  'rational-four-operations': rpmIrcFourOperationsOrder,
  'rational-operations-review': rpmIrcAllTypesMixed,

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
