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

const tx = (profile, ko, en) => (((typeof profile === 'string' ? profile : profile?.locale) === 'ko') ? ko : (en || ko));

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
// CHAPTER 05: 문자의 사용과 식의 계산 응용 (RPM 1-1 Pages 78 ~ 91)
// -------------------------------------------------------------

// 1. [문자와 식 유형 01] 곱셈과 나눗셈 기호의 생략과 거듭제곱
function rpmAlgNotationSigns(random, profile) {
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
      prompt: tx(profile,
        '다음 중 a ÷ b ÷ c 와 같은 식은?',
        'Which of the following expressions is equivalent to a ÷ b ÷ c?'),
      expression: 'a ÷ b ÷ c',
      choices,
      answer: '1',
      explanation: tx(profile,
        'a ÷ b ÷ c = a × 1/b × 1/c = a/(bc) 입니다.',
        'a ÷ b ÷ c = a × 1/b × 1/c = a/(bc).'),
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
      prompt: tx(profile,
        '다음 식을 곱셈과 나눗셈 기호를 생략하여 간단히 나타낸 것은?',
        'Simplify the expression by omitting multiplication and division signs.'),
      expression: 'x × x × x ÷ y ÷ (-1)',
      choices,
      answer: '1',
      explanation: tx(profile,
        'x × x × x ÷ y ÷ (-1) = x^3 × 1/y × (-1) = -x^3/y 입니다.',
        'x × x × x ÷ y ÷ (-1) = -x^3/y.'),
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
    prompt: tx(profile,
      '다음 중 옳지 않은 것은?',
      'Which of the following statements is incorrect?'),
    expression: '곱셈·나눗셈 기호의 생략',
    choices,
    answer: '4',
    explanation: tx(profile,
      'a ÷ (1/b) ÷ (1/c) = a × b × c = abc 이므로 4번이 옳지 않습니다.',
      'a ÷ (1/b) ÷ (1/c) = a × b × c = abc, so option 4 is incorrect.'),
  };
}

// 2. [문자와 식 유형 02] 문자를 사용한 식 (자연수, 단위, 금액, 할인)
function rpmAlgVerbalUnitsCost(random, profile) {
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
      prompt: tx(profile,
        '십의 자리 숫자가 a이고 일의 자리 숫자가 b인 두 자리 자연수를 문자를 사용한 식으로 바르게 나타낸 것은?',
        'Which algebraic expression correctly represents a two-digit integer with tens digit a and units digit b?'),
      expression: '십의 자리: a, 일의 자리: b',
      choices,
      answer: '1',
      explanation: tx(profile,
        '십의 자리 숫자가 a이고 일의 자리 숫자가 b인 두 자리 자연수는 10 × a + b = 10a + b 입니다.',
        'The value is 10 × a + b = 10a + b.'),
    };
  }
  if (mode === 'time-unit') {
    const h = ri(random, 2, 5);
    return {
      prompt: tx(profile,
        `${h}시간 m분을 '분' 단위로 나타낸 식을 구하시오.`,
        `Express ${h} hours and m minutes in terms of minutes.`),
      expression: `${h}시간 m분`,
      answer: `${h * 60}+m`,
      explanation: tx(profile,
        `1시간은 60분이므로 ${h}시간 m분 = ${h} × 60 + m = ${h * 60} + m (분) 입니다.`,
        `1 hour = 60 minutes, so ${h} hours m minutes = ${h * 60} + m.`),
    };
  }
  const price = pick(random, [10000, 15000, 20000, 30000]);
  const disc = ri(random, 1, 4) * 5;
  const paid = price * (100 - disc) / 100;
  return {
    prompt: tx(profile,
      `정가가 ${price}원인 모자를 ${disc}% 할인하여 구매할 때 지불해야 하는 금액을 구하시오.`,
      `Find the discounted purchase price of a hat with regular price ${price} won discounted by ${disc}%.`),
    expression: `${price}원의 ${disc}% 할인 금액`,
    answer: String(paid),
    answerSuffix: tx(profile, '원', ' won'),
    explanation: tx(profile,
      `지불 금액 = ${price} × (1 - ${disc}/100) = ${paid}원입니다.`,
      `Discounted price = ${price} × (1 - ${disc}/100) = ${paid} won.`),
  };
}

// 3. [문자와 식 유형 03] 문자를 사용한 식 (도형의 둘레와 넓이)
function rpmAlgVerbalFigures(random, profile) {
  const mode = pick(random, ['trapezoid', 'rect-perimeter']);
  if (mode === 'trapezoid') {
    const h = pick(random, [4, 6, 8, 10]);
    const coeff = h / 2;
    return {
      prompt: tx(profile,
        `윗변의 길이가 a, 아랫변의 길이가 b, 높이가 ${h}인 사다리꼴의 넓이를 문자를 사용한 식으로 간단히 나타내시오.`,
        `Write a simplified algebraic expression for the area of a trapezoid with top base a, bottom base b, and height ${h}.`),
      expression: `윗변: a, 아랫변: b, 높이: ${h}`,
      answer: coeff === 1 ? 'a+b' : `${coeff}(a+b)`,
      explanation: tx(profile,
        `사다리꼴 넓이 = 1/2 × (a + b) × ${h} = ${coeff === 1 ? 'a+b' : `${coeff}(a+b)`} 입니다.`,
        `Area = 1/2 × (a + b) × ${h} = ${coeff === 1 ? 'a+b' : `${coeff}(a+b)`}.`),
    };
  }
  const w = ri(random, 3, 9);
  return {
    prompt: tx(profile,
      `세로의 길이가 x cm이고 가로의 길이가 세로보다 ${w} cm 더 긴 직사각형의 둘레의 길이를 x를 사용한 식으로 나타내시오.`,
      `A rectangle has height x cm and width (x + ${w}) cm. Express its perimeter using x.`),
    expression: `세로: x, 가로: x + ${w}`,
    answer: `4x+${2 * w}`,
    answerSuffix: 'cm',
    explanation: tx(profile,
      `둘레 = 2 × {x + (x + ${w})} = 2(2x + ${w}) = 4x + ${2 * w} (cm) 입니다.`,
      `Perimeter = 2(x + x + ${w}) = 4x + ${2 * w} cm.`),
  };
}

// 4. [문자와 식 유형 04] 문자를 사용한 식 (속력·거리·시간 및 농도)
function rpmAlgVerbalSpeedConcentration(random, profile) {
  const mode = pick(random, ['speed-time', 'salt-water']);
  if (mode === 'speed-time') {
    const speed = pick(random, [60, 70, 80, 100]);
    return {
      prompt: tx(profile,
        `시속 ${speed} km로 x시간 동안 달린 거리를 x를 사용한 식으로 나타내시오.`,
        `Express the distance traveled at ${speed} km/h for x hours.`),
      expression: `속력: ${speed} km/h, 시간: x시간`,
      answer: `${speed}x`,
      answerSuffix: 'km',
      explanation: tx(profile,
        `(거리) = (속력) × (시간) = ${speed}x (km) 입니다.`,
        `Distance = Speed × Time = ${speed}x km.`),
    };
  }
  const conc = ri(random, 5, 15);
  return {
    prompt: tx(profile,
      `${conc}%의 소금물 x g에 녹아 있는 소금의 양을 x를 사용한 식으로 나타내시오.`,
      `Express the amount of salt dissolved in x g of ${conc}% salt solution.`),
    expression: `${conc}% 소금물 x g`,
    answer: fracStr(conc, 100) === '1' ? 'x' : `${fracStr(conc, 100)}x`,
    answerSuffix: 'g',
    explanation: tx(profile,
      `(소금의 양) = (농도/100) × (소금물의 양) = ${conc}/100 × x = ${fracStr(conc, 100)}x (g) 입니다.`,
      `Salt = (${conc}/100) × x = ${fracStr(conc, 100)}x g.`),
  };
}

// 5. [문자와 식 유형 05] 식의 값 구하기 (음수 대입과 거듭제곱 부호)
function rpmAlgEvalBasicNegative(random, profile) {
  const x = -ri(random, 2, 4);
  const y = ri(random, 2, 4);
  const a = ri(random, 2, 3);
  const b = ri(random, 2, 4);
  const val = a * (x * x) - b * y;
  return {
    prompt: tx(profile,
      `x = ${x}, y = ${y}일 때, 다음 식의 값을 구하시오.`,
      `Evaluate the expression when x = ${x} and y = ${y}.`),
    expression: `${a}x^2 - ${b}y`,
    answer: String(val),
    explanation: tx(profile,
      `대입하면 ${a} × (${x})^2 - ${b} × (${y}) = ${a} × ${x * x} - ${b * y} = ${val} 입니다.`,
      `Substituting yields ${a}(${x * x}) - ${b * y} = ${val}.`),
  };
}

// 6. [문자와 식 유형 06] 분수를 분모에 대입하여 식의 값 구하기
function rpmAlgEvalFractionReciprocal(random, profile) {
  const d1 = pick(random, [2, 3, 4, 5]);
  const d2 = pick(random, [2, 3, 4]);
  const c1 = ri(random, 2, 4);
  const c2 = ri(random, 2, 5);
  const val = c1 * (-d1) + c2 * d2;
  return {
    prompt: tx(profile,
      `x = -1/${d1}, y = 1/${d2}일 때, 다음 식의 값을 구하시오.`,
      `Find the value of the expression when x = -1/${d1} and y = 1/${d2}.`),
    expression: `${c1}/x + ${c2}/y`,
    answer: String(val),
    explanation: tx(profile,
      `${c1}/x = ${c1} ÷ (-1/${d1}) = -${c1 * d1} 이고, ${c2}/y = ${c2} ÷ (1/${d2}) = ${c2 * d2} 이므로 합은 ${val} 입니다.`,
      `${c1}/x = -${c1 * d1} and ${c2}/y = ${c2 * d2}, giving ${val}.`),
  };
}

// 7. [문자와 식 유형 07] 식의 값의 실생활 활용
function rpmAlgEvalRealWorld(random, profile) {
  const t = ri(random, 10, 30);
  const v = Math.round((331 + 0.6 * t) * 10) / 10;
  return {
    prompt: tx(profile,
      `기온이 t ℃일 때, 공기 중에서 소리의 속력은 초속 (331 + 0.6t) m라고 한다. 기온이 ${t} ℃일 때, 소리의 속력을 구하시오.`,
      `The speed of sound in air at temperature t °C is (331 + 0.6t) m/s. Find the speed of sound when t = ${t} °C.`),
    expression: `v = 331 + 0.6t,  t = ${t}`,
    answer: String(v),
    answerSuffix: 'm/s',
    explanation: tx(profile,
      `t = ${t}를 대입하면 331 + 0.6 × ${t} = 331 + ${Math.round(0.6 * t * 10)/10} = ${v} (m/s) 입니다.`,
      `Substituting t = ${t} gives 331 + 0.6 × ${t} = ${v} m/s.`),
  };
}

// 8. [문자와 식 유형 08] 다항식의 항, 상수항, 계수와 차수
function rpmAlgPolyTermsDegree(random, profile) {
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
    prompt: tx(profile,
      `다항식 ${c2}x^2 + ${c1}x - ${Math.abs(c0)} 에 대한 설명 중 옳지 않은 것은?`,
      `Which of the following statements about the polynomial ${c2}x^2 + ${c1}x - ${Math.abs(c0)} is incorrect?`),
    expression: `${c2}x^2 + ${c1}x - ${Math.abs(c0)}`,
    choices,
    answer: '3',
    explanation: tx(profile,
      `상수항은 부호를 포함한 ${c0}이므로 ${Math.abs(c0)}이라고 한 3번이 옳지 않습니다.`,
      `The constant term includes the negative sign (${c0}), so statement 3 is incorrect.`),
  };
}

// 9. [문자와 식 유형 09] 일차식의 식별과 분모 문자 함정
function rpmAlgLinearIdentify(random, profile) {
  const choices = [
    { value: '1', label: '-5x', labelEn: '-5x', isRight: true },
    { value: '2', label: '4', labelEn: '4', isRight: false },
    { value: '3', label: '1/x + 3', labelEn: '1/x + 3', isRight: false },
    { value: '4', label: 'x^2 + 1', labelEn: 'x^2 + 1', isRight: false },
    { value: '5', label: '1 + x - x^2', labelEn: '1 + x - x^2', isRight: false },
  ];
  return {
    prompt: tx(profile,
      '다음 보기 중 일차식인 것은?',
      'Which of the following is a linear expression?'),
    expression: '일차식의 판별',
    choices,
    answer: '1',
    explanation: tx(profile,
      '-5x는 차수가 1인 일차식입니다. 4는 상수항(0차), 1/x+3은 분모에 문자가 있어 다항식이 아니며, x^2+1과 1+x-x^2은 2차식입니다.',
      '-5x is a linear term of degree 1. 1/x is not a polynomial, 4 is constant (degree 0), others have degree 2.'),
  };
}

// 10. [문자와 식 유형 10] 일차식과 수의 곱셈·나눗셈
function rpmAlgMonomialMultDiv(random, profile) {
  const a = -ri(random, 2, 5);
  const b = ri(random, 2, 6);
  const c = -ri(random, 2, 7);
  const coeffX = a * b;
  const constVal = a * c;
  const sum = coeffX + constVal;
  return {
    prompt: tx(profile,
      `식 ${a}(${b}x - ${Math.abs(c)})를 간단히 하였을 때, x의 계수를 A, 상수항을 B라 하자. A + B의 값을 구하시오.`,
      `When ${a}(${b}x - ${Math.abs(c)}) is simplified to Ax + B, find A + B.`),
    expression: `${a}(${b}x - ${Math.abs(c)})`,
    answer: String(sum),
    explanation: tx(profile,
      `분배법칙으로 전개하면 ${coeffX}x + ${constVal} 이므로 A = ${coeffX}, B = ${constVal} 입니다. A + B = ${sum} 입니다.`,
      `Expanding yields ${coeffX}x + ${constVal}, so A + B = ${sum}.`),
  };
}

// 11. [문자와 식 유형 11] 동류항의 판별과 동류항 성립 조건
function rpmAlgLikeTerms(random, profile) {
  const a = ri(random, 2, 5);
  const b = ri(random, 1, 4);
  const ans = a + b;
  return {
    prompt: tx(profile,
      `두 식 3x^a y^${b} 와 -5x^${a} y^b 가 동류항일 때, a + b의 값을 구하시오.`,
      `Given that 3x^a y^${b} and -5x^${a} y^b are like terms, find a + b.`),
    expression: `3x^a y^${b},  -5x^${a} y^b`,
    answer: String(ans),
    explanation: tx(profile,
      `동류항은 문자의 종류와 차수가 각각 같아야 하므로 x의 차수는 ${a}, y의 차수는 ${b}로 일치합니다. 따라서 a + b = ${ans} 입니다.`,
      `Like terms must have matching variables and degrees, so a + b = ${ans}.`),
  };
}

// 12. [문자와 식 유형 12] 일차식의 덧셈과 뺄셈 (동류항 모으기)
function rpmAlgLinearAddSub(random, profile) {
  const a = ri(random, 2, 6);
  const b = -ri(random, 1, 5);
  const c = ri(random, 3, 7);
  const d = ri(random, 2, 6);
  const coeffX = a - c;
  const constVal = b - d;
  const ans = `${coeffX}x${constVal >= 0 ? '+' : ''}${constVal}`;
  return {
    prompt: tx(profile,
      '다음을 계산하여 ax + b 꼴로 간단히 나타내시오.',
      'Simplify the expression in the form ax + b.'),
    expression: `(${a}x - ${Math.abs(b)}) - (${c}x + ${d})`,
    answer: ans,
    explanation: tx(profile,
      `동류항끼리 모으면 (${a} - ${c})x + (${b} - ${d}) = ${ans} 입니다.`,
      `Combining like terms gives ${ans}.`),
  };
}

// 13. [문자와 식 유형 13] 괄호가 있는 일차식의 계산 (소/중/대괄호)
function rpmAlgLinearBrackets(random, profile) {
  const k1 = ri(random, 3, 6);
  const k2 = ri(random, 2, 4);
  const coeffX = 7 - 2 * k2;
  const constVal = -k1 + 2;
  const ans = `${coeffX}x${constVal >= 0 ? '+' : ''}${constVal}`;
  return {
    prompt: tx(profile,
      '다음 식을 괄호를 풀어 간단히 나타내시오.',
      'Simplify the expression by expanding parentheses from innermost to outermost.'),
    expression: `5x - [ ${k1} - 2{ x - (${k2}x - 1) } ]`,
    answer: ans,
    explanation: tx(profile,
      `소괄호 → 중괄호 → 대괄호 순서로 전개하여 정리하면 ${ans} 입니다.`,
      `Expanding inside-out yields ${ans}.`),
  };
}

// 14. [문자와 식 유형 14] 분수 꼴인 일차식의 덧셈과 뺄셈 (통분 연산)
function rpmAlgFractionalLinear(random, profile) {
  const a = ri(random, 2, 4);
  const b = ri(random, 1, 3);
  const c = ri(random, 2, 3);
  const d = ri(random, 4, 7);
  const numX = 4 * a - 3 * c;
  const numConst = -4 * b + 3 * d;
  return {
    prompt: tx(profile,
      `식 (${a}x - ${b})/3 - (${c}x - ${d})/4 를 간단히 하였을 때, x의 계수를 A, 상수항을 B라 하자. 12(A + B)의 값을 구하시오.`,
      `Simplify (${a}x - ${b})/3 - (${c}x - ${d})/4 to Ax + B. Find 12(A + B).`),
    expression: `(${a}x - ${b})/3 - (${c}x - ${d})/4`,
    answer: String(numX + numConst),
    explanation: tx(profile,
      `12로 통분하면 {4(${a}x - ${b}) - 3(${c}x - ${d})}/12 = (${numX}x + ${numConst})/12 입니다. 따라서 12(A + B) = ${numX + numConst} 입니다.`,
      `Combining over 12 gives (${numX}x + ${numConst})/12, so 12(A + B) = ${numX + numConst}.`),
  };
}

// 15. [문자와 식 유형 15] 일차식이 되도록 하는 미지수 조건
function rpmAlgLinearConditionParam(random, profile) {
  const p = ri(random, 2, 6);
  const q = ri(random, 2, 5);
  return {
    prompt: tx(profile,
      `다항식 (${p} - a)x^2 + ${q}x - 7 이 x에 대한 일차식이 되도록 하는 상수 a의 값을 구하시오.`,
      `Find the value of constant a such that (${p} - a)x^2 + ${q}x - 7 is a linear expression in x.`),
    expression: `(${p} - a)x^2 + ${q}x - 7`,
    answer: String(p),
    explanation: tx(profile,
      `x에 대한 일차식이 되려면 이차항의 계수가 0이어야 하므로 ${p} - a = 0 에서 a = ${p} 입니다.`,
      `For the expression to be linear, the quadratic coefficient must be zero: ${p} - a = 0 implies a = ${p}.`),
  };
}

// 16. [문자와 식 유형 16] 문자에 일차식을 대입하기
function rpmAlgSubstituteExpression(random, profile) {
  return {
    prompt: tx(profile,
      'A = 2x - 1, B = -x + 3 일 때, 3A - 2(A - B) 를 x에 관한 식으로 간단히 나타내시오.',
      'Given A = 2x - 1 and B = -x + 3, simplify 3A - 2(A - B) in terms of x.'),
    expression: `A = 2x - 1,  B = -x + 3`,
    answer: '5',
    explanation: tx(profile,
      `3A - 2(A - B) = A + 2B 입니다. 대입하면 (2x - 1) + 2(-x + 3) = 2x - 1 - 2x + 6 = 5 입니다.`,
      `3A - 2(A - B) = A + 2B = (2x - 1) + 2(-x + 3) = 5.`),
  };
}

// 17. [문자와 식 유형 17] □ 안에 알맞은 일차식 구하기
function rpmAlgUnknownBoxPoly(random, profile) {
  const a = ri(random, 3, 6);
  const b = -ri(random, 1, 4);
  const c = ri(random, 1, 3);
  const d = ri(random, 3, 6);
  const coeffX = a - c;
  const constVal = b - d;
  const ans = `${coeffX}x${constVal >= 0 ? '+' : ''}${constVal}`;
  return {
    prompt: tx(profile,
      '다음 □ 안에 알맞은 식을 구하시오.',
      'Find the polynomial expression that fits in □.'),
    expression: `(${a}x - ${Math.abs(b)}) - □ = ${c}x + ${d}`,
    answer: ans,
    explanation: tx(profile,
      `□ = (${a}x - ${Math.abs(b)}) - (${c}x + ${d}) = ${ans} 입니다.`,
      `□ = (${a}x - ${Math.abs(b)}) - (${c}x + ${d}) = ${ans}.`),
  };
}

// 18. [문자와 식 유형 18] 바르게 계산한 일차식 구하기
function rpmAlgCorrectPolyCalc(random, profile) {
  const a = ri(random, 2, 4);
  const b = -ri(random, 1, 4);
  const c = ri(random, 4, 7);
  const d = ri(random, 2, 5);
  const coeffX = c - 2 * a;
  const constVal = d - 2 * b;
  const ans = `${coeffX}x${constVal >= 0 ? '+' : ''}${constVal}`;
  return {
    prompt: tx(profile,
      `어떤 식에서 (${a}x - ${Math.abs(b)})를 빼야 할 것을 잘못하여 더했더니 ${c}x + ${d} 가 되었다. 바르게 계산한 식을 구하시오.`,
      `A student mistakenly added (${a}x - ${Math.abs(b)}) instead of subtracting it, obtaining ${c}x + ${d}. Find the correct result.`),
    expression: `어떤 식 = □`,
    answer: ans,
    explanation: tx(profile,
      `원래 식은 (${c}x + ${d}) - (${a}x - ${Math.abs(b)}) = ${c - a}x + ${d - b} 이므로, 바르게 계산하면 ${ans} 입니다.`,
      `The original polynomial is ${c - a}x + ${d - b}, giving correct answer ${ans}.`),
  };
}

// 19. [문자와 식 유형 19] 도형에서의 일차식 활용 (둘레와 색칠한 넓이)
function rpmAlgGeometryShadedArea(random, profile) {
  const extraBottom = ri(random, 4, 8);
  const h = pick(random, [8, 10, 12]);
  const cutH = pick(random, [3, 4]);
  const coeffX = (h - cutH) / 2 * 2;
  const constVal = ((h - cutH) * extraBottom) / 2;
  const ans = `${coeffX}x+${constVal}`;
  return {
    prompt: tx(profile,
      `윗변이 x cm, 아랫변이 (x + ${extraBottom}) cm, 높이가 ${h} cm인 사다리꼴에서 밑변을 공유하고 높이가 ${cutH} cm인 안쪽 삼각형을 잘라낸 색칠한 부분의 넓이를 x를 사용한 식으로 나타내시오.`,
      `In a trapezoid with top base x, bottom base x + ${extraBottom}, and height ${h}, find the shaded area after removing an inner triangle of height ${cutH}.`),
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
    explanation: tx(profile,
      `(사다리꼴 넓이) - (삼각형 넓이) = 1/2 × (2x + ${extraBottom}) × ${h} - 1/2 × (x + ${extraBottom}) × ${cutH} = ${ans} (cm^2) 입니다.`,
      `Area = ${ans} cm^2.`),
  };
}

// 20. [문자와 식 유형 20] (-1)^n 거듭제곱이 포함된 일차식의 계산
function rpmAlgNegPowerLinear(random, profile) {
  const isEven = random() < 0.5;
  const parityKo = isEven ? '짝수' : '홀수';
  const parityEn = isEven ? 'an even' : 'an odd';
  const ans = isEven ? '5x-1' : '-5x+1';
  return {
    prompt: tx(profile,
      `n이 ${parityKo}일 때, (-1)^n (3x - 2) - (-1)^(n+1) (2x + 1) 을 간단히 하시오.`,
      `Given that n is ${parityEn} integer, simplify (-1)^n (3x - 2) - (-1)^(n+1) (2x + 1).`),
    expression: `(-1)^n (3x - 2) - (-1)^(n+1) (2x + 1)`,
    answer: ans,
    explanation: tx(profile,
      `n이 ${parityKo}이므로 (-1)^n = ${isEven ? '1' : '-1'}, (-1)^(n+1) = ${isEven ? '-1' : '1'} 입니다. 대입하여 정리하면 ${ans} 입니다.`,
      `Evaluating powers according to parity yields ${ans}.`),
  };
}

// 21. [문자와 식 심화 21] 일차식 마방진과 다항식 피라미드 퍼즐
function rpmAlgMagicSquarePyramid(random, profile) {
  const ans = '6x-2';
  return {
    prompt: tx(profile,
      '가로, 세로, 대각선에 놓인 세 식의 합이 모두 같도록 표를 채울 때, 식 A - B를 간단히 하시오.',
      'In a 3x3 magic square where sums of rows, columns, and diagonals are equal, find the expression A - B.'),
    expression: '가로 세로 대각선의 합이 같은 마방진',
    answer: ans,
    explanation: tx(profile,
      '가로의 합이 3x - 3이므로 세로와 대각선 합 조건을 풀면 B = -2x, A = 4x - 2 입니다. 따라서 A - B = 4x - 2 - (-2x) = 6x - 2 입니다.',
      'Row sum is 3x - 3. Solving gives B = -2x and A = 4x - 2, so A - B = 6x - 2.'),
  };
}

// 22. [문자와 식 발전 22] 원가·정가·할인가·이익 복합 문장제
function rpmAlgCostProfitComplex(random, profile) {
  const mark = 20;
  const disc = 10;
  return {
    prompt: tx(profile,
      `원가가 a원인 상품에 ${mark}%의 이익을 붙여 정가를 정한 후, 정가에서 ${disc}%를 할인하여 판매할 때, 실제 판매 가격을 a를 사용한 기약분수 식으로 나타내시오.`,
      `A merchant sets regular price at a ${mark}% markup on cost a, then gives a ${disc}% discount. Express the final selling price using an irreducible fraction with a.`),
    expression: `원가 a원, 정가: ${mark}% 이익, 판매가: ${disc}% 할인`,
    answer: '27/25a',
    explanation: tx(profile,
      `정가 = a × (1 + 0.2) = 1.2a 이고, 판매 가격 = 1.2a × (1 - 0.1) = 1.08a = 27/25 a (원) 입니다.`,
      `Regular price = 1.2a, sale price = 1.2a × 0.9 = 1.08a = 27/25 a.`),
  };
}

// 23. [문자와 식 발전 23] 다중 문자 분수식의 고난도 대입 식의 값
function rpmAlgMultiVarComplexEval(random, profile) {
  return {
    prompt: tx(profile,
      'a = 1/2, b = 2/3, c = -3/4 일 때, (bc - 2ac - 3ab)/(abc) 의 값을 구하시오.',
      'Given a = 1/2, b = 2/3, and c = -3/4, find the value of (bc - 2ac - 3ab)/(abc).'),
    expression: `(bc - 2ac - 3ab)/(abc)`,
    answer: '3',
    explanation: tx(profile,
      `식을 분리하면 bc/(abc) - 2ac/(abc) - 3ab/(abc) = 1/a - 2/b - 3/c 입니다. 역수를 대입하면 2 - 3 - (-4) = 3 입니다.`,
      `Splitting terms yields 1/a - 2/b - 3/c = 2 - 3 + 4 = 3.`),
  };
}

// 24. [단원 실전 다지기] 매일 문자와 식 종합
const rpmAlgServerList = [
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

function rpmAlgAllTypesMixed(random, profile) {
  return pick(random, rpmAlgServerList)(random, profile);
}


const rpmAlgebraShadedArea = rpmAlgGeometryShadedArea;

// -------------------------------------------------------------
// 06: 일차방정식의 풀이 응용 (RPM 1-1 p.94~103)
// -------------------------------------------------------------

function rpmEqIdentityEquation(random, profile = 'ko') {
  const mode = pick(random, ['verbal-to-eq', 'identify-eq', 'identify-non-eq']);
  if (mode === 'verbal-to-eq') {
    const k = ri(random, 2, 7);
    const sub = ri(random, 2, 9);
    const mult = ri(random, 2, 4);
    const right = `${k}x - ${sub} = ${mult}x`;
    const choices = [
      { label: right, isRight: true },
      { label: `${k}x + ${sub} = ${mult}x`, isRight: false },
      { label: `${k}(x - ${sub}) = ${mult}x`, isRight: false },
      { label: `${k}x - ${sub} = x + ${mult}`, isRight: false },
      { label: `${k}x - ${sub} > ${mult}x`, isRight: false },
    ].sort(() => random() - 0.5);
    const rightIdx = choices.findIndex((c) => c.isRight) + 1;
    return {
      prompt: tx(profile,
        `다음 문장을 등식으로 나타낸 것으로 옳은 것은?\n"어떤 수 x의 ${k}배에서 ${sub}를 뺀 것은 x의 ${mult}배와 같다."`,
        `Which equation correctly represents:\n"Subtracting ${sub} from ${k} times x equals ${mult} times x."`
      ),
      kind: 'choice',
      choices: choices.map((c) => c.label),
      answer: String(rightIdx),
      explanation: tx(profile,
        `x의 ${k}배에서 ${sub}를 뺀 식은 ${k}x - ${sub}이고, x의 ${mult}배는 ${mult}x이므로 등식은 ${right}입니다.`,
        `${k} times x minus ${sub} is ${k}x - ${sub}, and ${mult} times x is ${mult}x, so the equation is ${right}.`
      )
    };
  }

  if (mode === 'identify-non-eq') {
    const choices = [
      { label: '3x - 6 = 0', isRight: false },
      { label: '2x + 5 = 11', isRight: false },
      { label: '4x - 7 < 9', isRight: true },
      { label: 'x/2 = 4', isRight: false },
      { label: '5x = 2x + 9', isRight: false },
    ].sort(() => random() - 0.5);
    const rightIdx = choices.findIndex((c) => c.isRight) + 1;
    return {
      prompt: tx(profile, '다음 보기 중 등식이 아닌 것은?', 'Which of the following is NOT an equation?'),
      kind: 'choice',
      choices: choices.map((c) => c.label),
      answer: String(rightIdx),
      explanation: tx(profile,
        '등호(=)를 사용하여 수나 식이 같음을 나타낸 식만이 등식입니다. 부등호(<, > 등)를 사용한 식은 부등식입니다.',
        'Only expressions using an equals sign (=) are equations. Expressions with inequality signs are inequalities.'
      )
    };
  }

  const choices = [
    { label: '3x - 7', isRight: false },
    { label: '2x + 4 > 10', isRight: false },
    { label: '5x + 3y - 2', isRight: false },
    { label: '4x - 1 = 7', isRight: true },
    { label: '3x + 1 ≤ 4x', isRight: false },
  ].sort(() => random() - 0.5);
  const rightIdx = choices.findIndex((c) => c.isRight) + 1;
  return {
    prompt: tx(profile, '다음 보기 중 등식인 것은?', 'Which of the following is an equation?'),
    kind: 'choice',
    choices: choices.map((c) => c.label),
    answer: String(rightIdx),
    explanation: tx(profile,
      '등호(=)를 사용하여 나타낸 식만이 등식입니다. 다항식(3x-7)이나 부등식은 등식이 아닙니다.',
      'Only a statement with an equals sign (=) is an equation. Polynomials and inequalities are not equations.'
    )
  };
}

function rpmEqRootSubstitute(random, profile = 'ko') {
  const mode = pick(random, ['abs-condition-root', 'bracket-check-false', 'find-root-val']);
  if (mode === 'abs-condition-root') {
    const k = pick(random, [2, 3, 4, 5]);
    const a = ri(random, 2, 4);
    const c = ri(random, 1, 6);
    const rhs = a * (-k) + c;
    return {
      prompt: tx(profile,
        `x가 절댓값이 ${k}인 수일 때, 일차방정식 ${a}x + ${c} = ${rhs}의 해를 구하시오.`,
        `Given that |x| = ${k}, find the solution to the linear equation ${a}x + ${c} = ${rhs}.`
      ),
      expression: `|x| = ${k},  ${a}x + ${c} = ${rhs}`,
      answer: `-${k}`,
      explanation: tx(profile,
        `절댓값이 ${k}인 수는 ${k} 또는 -${k}입니다. x = ${k}를 대입하면 ${a}×${k}+${c} = ${a * k + c} ≠ ${rhs}이고, x = -${k}를 대입하면 ${a}×(-${k})+${c} = ${rhs}이므로 해는 x = -${k}입니다.`,
        `|x| = ${k} implies x is ${k} or -${k}. Substituting x = -${k} gives ${a}(-${k}) + ${c} = ${rhs}.`
      )
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
      prompt: tx(profile,
        '다음 중 [ ] 안의 수가 주어진 일차방정식의 해가 아닌 것은?',
        'For which equation is the value in [ ] NOT a solution?'
      ),
      kind: 'choice',
      choices: choices.map((c) => `${c.eq}  [${c.val}]`),
      answer: String(wrongIdx),
      explanation: tx(profile,
        '[ ] 안의 수를 각 방정식의 x에 대입하여 좌변과 우변의 값이 같지 않은 것을 찾습니다.',
        'Substitute the bracketed value into x for each equation; the answer is where LHS ≠ RHS.'
      )
    };
  }

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
    prompt: tx(profile,
      `다음 일차방정식 중 해가 x = ${k}인 것은?`,
      `Which of the following equations has the solution x = ${k}?`
    ),
    kind: 'choice',
    choices,
    answer: String(rightIdx),
    explanation: tx(profile,
      `각 식에 x = ${k}를 대입하면 ${rightEq}에서 ${a}×(${k}) ${b >= 0 ? '+' : '-'} ${Math.abs(b)} = ${rhs}로 등식이 성립합니다.`,
      `Substituting x = ${k} into ${rightEq} yields ${rhs} = ${rhs}.`
    )
  };
}

function rpmEqIdentityDistinguish(random, profile = 'ko') {
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
    prompt: tx(profile,
      '다음 중 x의 값에 관계없이 항상 참인 등식(항등식)은?',
      'Which of the following equations is an identity (always true for all x)?'
    ),
    kind: 'choice',
    choices: choices.map((c) => c.label),
    answer: String(rightIdx),
    explanation: tx(profile,
      `${rightId}의 좌변을 전개하면 ${k}x - ${k * c}로 (좌변)=(우변)이 항상 같으므로 x에 대한 항등식입니다.`,
      `Expanding LHS of ${rightId} gives ${k}x - ${k * c}, which equals RHS for all x.`
    )
  };
}

function rpmEqIdentityCondition(random, profile = 'ko') {
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
      prompt: tx(profile,
        `등식 ${a}(x - ${b}) = -${c}x + □ 가 x의 값에 관계없이 항상 성립할 때, □ 안에 알맞은 식은?`,
        `Given that ${a}(x - ${b}) = -${c}x + [ ? ] is an identity in x, find the missing expression in [ ? ].`
      ),
      kind: 'choice',
      choices: choices.map((c) => c.label),
      answer: String(rightIdx),
      explanation: tx(profile,
        `좌변을 전개하면 ${a}x - ${a * b} = -${c}x + □ 이므로 □ = ${a}x - ${a * b} - (-${c}x) = ${ans}입니다.`,
        `LHS expanded is ${a}x - ${a * b} = -${c}x + [ ? ], so [ ? ] = ${ans}.`
      )
    };
  }

  const c = ri(random, 2, 6);
  const d = ri(random, 1, 5);
  const e = ri(random, -6, 6);
  const aVal = c;
  const bVal = c * d + e;
  const ans = aVal + bVal;
  return {
    prompt: tx(profile,
      `등식 ax + b = ${c}(x + ${d}) ${e >= 0 ? '+' : '-'} ${Math.abs(e)} 가 x에 대한 항등식일 때, 상수 a, b에 대하여 a + b의 값을 구하시오.`,
      `If ax + b = ${c}(x + ${d}) ${e >= 0 ? '+' : '-'} ${Math.abs(e)} is an identity in x, find a + b.`
    ),
    expression: `ax + b = ${c}(x + ${d}) ${e >= 0 ? '+' : '-'} ${Math.abs(e)}`,
    answer: String(ans),
    explanation: tx(profile,
      `우변을 전개하여 정리하면 ${c}x + ${c * d} ${e >= 0 ? '+' : '-'} ${Math.abs(e)} = ${c}x + ${bVal}입니다. x에 대한 항등식이므로 a = ${aVal}, b = ${bVal}입니다. 따라서 a + b = ${aVal} + ${bVal} = ${ans}입니다.`,
      `Expanding RHS gives ${c}x + ${bVal}. Equating coefficients: a = ${aVal}, b = ${bVal}, so a + b = ${ans}.`
    )
  };
}

function rpmEqPropertiesEquality(random, profile = 'ko') {
  const choices = [
    { label: tx(profile, '3a = 6b 이면 a = 2b 이다.', 'If 3a = 6b, then a = 2b.'), isFalse: false },
    { label: tx(profile, 'a/2 = b/3 이면 3a = 2b 이다.', 'If a/2 = b/3, then 3a = 2b.'), isFalse: false },
    { label: tx(profile, 'a - b = x - y 이면 a - x = b - y 이다.', 'If a - b = x - y, then a - x = b - y.'), isFalse: false },
    { label: tx(profile, 'ac = bc 이면 항상 a = b 이다.', 'If ac = bc, then always a = b.'), isFalse: true },
    { label: tx(profile, 'a = b 이면 a - 5 = b - 5 이다.', 'If a = b, then a - 5 = b - 5.'), isFalse: false },
  ].sort(() => random() - 0.5);
  const falseIdx = choices.findIndex((c) => c.isFalse) + 1;
  return {
    prompt: tx(profile,
      '다음 중 등식의 성질에 대한 설명으로 옳지 않은 것은?',
      'Which of the following statements about properties of equality is FALSE?'
    ),
    kind: 'choice',
    choices: choices.map((c) => c.label),
    answer: String(falseIdx),
    explanation: tx(profile,
      'ac = bc일 때 c = 0이면 a와 b가 서로 달라도 등식이 성립하므로, c ≠ 0이라는 조건이 없을 때는 반드시 a = b라고 할 수 없습니다.',
      'If c = 0, ac = bc holds even when a ≠ b, so we cannot conclude a = b unless c ≠ 0.'
    )
  };
}

function rpmEqSolveUsingProperties(random, profile = 'ko') {
  const mode = pick(random, ['find-c-val', 'find-step']);
  if (mode === 'find-c-val') {
    const a = ri(random, 2, 5);
    const b = ri(random, 3, 9);
    const d = ri(random, 1, 8);
    const ans = -b;
    return {
      prompt: tx(profile,
        `방정식 ${a}x + ${b} = ${d}를 풀기 위해 등식의 성질 "a=b이면 a+c = b+c이다"를 한 번만 이용하여 좌변에 ${a}x항만 남기려고 한다. 이때 c의 값을 구하시오.`,
        `To solve ${a}x + ${b} = ${d} by using "if a=b then a+c=b+c" once to leave only the ${a}x term on the LHS, find c.`
      ),
      expression: `${a}x + ${b} = ${d}`,
      answer: String(ans),
      explanation: tx(profile,
        `좌변에서 상수항 ${b}를 없애기 위해 양변에 ${ans}를 더해야 하므로 c = ${ans}입니다.`,
        `To eliminate the constant ${b} from the LHS, add ${ans} to both sides, so c = ${ans}.`
      )
    };
  }

  return {
    prompt: tx(profile,
      `다음 방정식의 풀이 과정에서 등식의 성질 "a=b이면 a/c = b/c이다 (c≠0)"를 이용한 단계를 고르시오.\n[풀이 과정]\n(2/3)x - 1 = 1\n㉠ 2x - 3 = 3\n㉡ 2x = 6\n㉢ x = 3`,
      `Identify the step that uses the property "if a=b then a/c = b/c (c≠0)":\n(2/3)x - 1 = 1\n[A] 2x - 3 = 3\n[B] 2x = 6\n[C] x = 3`
    ),
    kind: 'choice',
    choices: [
      tx(profile, '㉠', 'Step A'),
      tx(profile, '㉡', 'Step B'),
      tx(profile, '㉢', 'Step C')
    ],
    answer: '3',
    explanation: tx(profile,
      '2x = 6에서 양변을 2로 나누어 x = 3을 구하는 과정(㉢)에서 나눗셈의 성질이 이용되었습니다.',
      'In step C (2x = 6 to x = 3), both sides are divided by 2.'
    )
  };
}

function rpmEqTranspositionRule(random, profile = 'ko') {
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
      prompt: tx(profile,
        `등식 ${a1}x + ${b1} = ${a2}x ${b2 >= 0 ? '+' : '-'} ${Math.abs(b2)}를 이항만을 이용하여 ax = b (a > 0)의 꼴로 나타내었을 때, 상수 a, b에 대하여 a + b의 값을 구하시오.`,
        `Transform ${a1}x + ${b1} = ${a2}x ${b2 >= 0 ? '+' : '-'} ${Math.abs(b2)} into ax = b (a > 0) using transposition only. Find a + b.`
      ),
      expression: `${a1}x + ${b1} = ${a2}x ${b2 >= 0 ? '+' : '-'} ${Math.abs(b2)}`,
      answer: String(ans),
      explanation: tx(profile,
        `${a2}x를 좌변으로, ${b1}을 우변으로 이항하면 (${a1} - ${a2})x = ${b2} - ${b1}이므로 ${aFinal}x = ${bFinal}입니다. 따라서 a = ${aFinal}, b = ${bFinal}이므로 a + b = ${ans}입니다.`,
        `Transposing gives ${aFinal}x = ${bFinal}, so a = ${aFinal}, b = ${bFinal}, and a + b = ${ans}.`
      )
    };
  }

  const choices = [
    { label: '3x - 5 = 7  ⇨  3x = 7 + 5', isRight: true },
    { label: '4x = 6 - 3x  ⇨  4x - 3x = 6', isRight: false },
    { label: '5x + 2 = 1  ⇨  5x = 1 + 2', isRight: false },
    { label: '2x - 1 = x + 4  ⇨  2x + x = 4 + 1', isRight: false },
    { label: '6x - 4 = 2  ⇨  6x = 2 - 4', isRight: false },
  ].sort(() => random() - 0.5);
  const rightIdx = choices.findIndex((c) => c.isRight) + 1;
  return {
    prompt: tx(profile,
      '다음 중 밑줄 친 항을 바르게 이항한 것은?',
      'Which of the following demonstrates correct transposition?'
    ),
    kind: 'choice',
    choices: choices.map((c) => c.label),
    answer: String(rightIdx),
    explanation: tx(profile,
      '등식의 어느 한 변에 있는 항을 그 부호를 바꾸어 다른 변으로 옮기는 것을 이항이라 합니다. -5를 이항하면 +5가 됩니다.',
      'Transposing a term across the equals sign requires changing its sign. -5 transposes to +5.'
    )
  };
}

function rpmEqLinearDefIdentify(random, profile = 'ko') {
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
      prompt: tx(profile,
        `등식 ${k}x - ${c} = 5 - ax 가 x에 대한 일차방정식이 되기 위한 상수 a의 조건은?`,
        `Find the condition on constant a for ${k}x - ${c} = 5 - ax to be a linear equation in x.`
      ),
      kind: 'choice',
      choices,
      answer: String(rightIdx),
      explanation: tx(profile,
        `모든 항을 좌변으로 이항하여 정리하면 (${k} + a)x - ${c + 5} = 0 입니다. x에 대한 일차방정식이 되려면 x의 계수가 0이 아니어야 하므로 ${k} + a ≠ 0, 즉 a ≠ -${k} 이어야 합니다.`,
        `Rearranging gives (${k} + a)x - ${c + 5} = 0. For this to be linear, the coefficient of x must not be 0: a ≠ -${k}.`
      )
    };
  }

  const choices = [
    { label: 'x^2 + x = x^2 - 4', isRight: true },
    { label: 'x^2 + 3 = x', isRight: false },
    { label: '2(x + 1) = 2x + 2', isRight: false },
    { label: '3x - 5', isRight: false },
    { label: '2/x + 1 = 5', isRight: false },
  ].sort(() => random() - 0.5);
  const rightIdx = choices.findIndex((c) => c.isRight) + 1;
  return {
    prompt: tx(profile,
      '다음 보기 중 일차방정식인 것은?',
      'Which of the following is a linear equation in one variable?'
    ),
    kind: 'choice',
    choices: choices.map((c) => c.label),
    answer: String(rightIdx),
    explanation: tx(profile,
      'x^2 + x = x^2 - 4에서 x^2을 소거하면 x + 4 = 0으로 일차식 = 0 꼴이 되므로 일차방정식입니다.',
      'In x^2 + x = x^2 - 4, the quadratic terms cancel to leave x + 4 = 0, which is linear.'
    )
  };
}

function rpmEqBracketsExpand(random, profile = 'ko') {
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
    prompt: tx(profile,
      '다음 괄호가 있는 일차방정식을 푸시오.',
      'Solve the linear equation with parentheses.'
    ),
    expression: `${a}(x + ${b}) - ${c}(${d} - x) = ${rhsX}x ${rhsConst >= 0 ? '+' : '-'} ${Math.abs(rhsConst)}`,
    answer: String(root),
    explanation: tx(profile,
      `괄호를 분배법칙으로 풀면 ${a}x + ${a * b} - ${c * d} + ${c}x = ${rhsX}x ${rhsConst >= 0 ? '+' : '-'} ${Math.abs(rhsConst)} 입니다. 동류항을 정리하여 이항하면 ${e}x = ${e * root} 이므로 x = ${root} 입니다.`,
      `Expanding parentheses and combining like terms yields ${e}x = ${e * root}, so x = ${root}.`
    )
  };
}

function rpmEqDecimalCoef(random, profile = 'ko') {
  const root = ri(random, -6, 8) || 2;
  const aTenths = ri(random, 3, 7);
  const bTenths = ri(random, 1, 9);
  const cTenths = ri(random, 1, aTenths - 1);
  const dTenths = (aTenths - cTenths) * root - bTenths;
  return {
    prompt: tx(profile,
      '다음 계수가 소수인 일차방정식을 푸시오.',
      'Solve the linear equation with decimals.'
    ),
    expression: `${(aTenths / 10).toFixed(1)}x - ${(bTenths / 10).toFixed(1)} = ${(cTenths / 10).toFixed(1)}x ${dTenths >= 0 ? '+' : '-'} ${Math.abs(dTenths / 10).toFixed(1)}`,
    answer: String(root),
    explanation: tx(profile,
      `양변에 10을 곱하여 계수를 정수로 고치면 ${aTenths}x - ${bTenths} = ${cTenths}x ${dTenths >= 0 ? '+' : '-'} ${Math.abs(dTenths)} 입니다. 이항하면 ${aTenths - cTenths}x = ${(aTenths - cTenths) * root} 이므로 x = ${root} 입니다.`,
      `Multiplying both sides by 10 clears decimals: ${aTenths - cTenths}x = ${(aTenths - cTenths) * root}, giving x = ${root}.`
    )
  };
}

function rpmEqFractionCoef(random, profile = 'ko') {
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
    prompt: tx(profile,
      '다음 계수가 분수인 일차방정식을 푸시오.',
      'Solve the linear equation with fractions.'
    ),
    expression: `(x - ${c1})/${d1} - (2x - ${c2})/${d2} = ${fracStr(totalLHS, L)}`,
    answer: String(root),
    explanation: tx(profile,
      `분모의 최소공배수인 ${L}을 양변에 곱하면 ${m1}(x - ${c1}) - ${m2}(2x - ${c2}) = ${totalLHS} 입니다. 전개하여 정리하면 ${nonZeroNetX}x = ${nonZeroNetX * root} 이므로 x = ${root} 입니다.`,
      `Multiply both sides by LCM ${L}: simplifying gives ${nonZeroNetX}x = ${nonZeroNetX * root}, so x = ${root}.`
    )
  };
}

function rpmEqMixedDecimalFraction(random, profile = 'ko') {
  const root = ri(random, -4, 5) || 2;
  const den = pick(random, [2, 4, 5]);
  const a = ri(random, 1, 4);
  const b = ri(random, 1, 4);
  const cVal = (root - a) / den - 0.5 * (root - b);
  return {
    prompt: tx(profile,
      '다음 소수와 분수가 혼합된 일차방정식을 푸시오.',
      'Solve the linear equation containing both decimals and fractions.'
    ),
    expression: `(x - ${a})/${den} = 0.5(x - ${b}) ${cVal >= 0 ? '+' : '-'} ${Math.abs(cVal).toFixed(2)}`,
    answer: String(root),
    explanation: tx(profile,
      `0.5를 1/2로 바꾸고 분모의 최소공배수를 양변에 곱하여 정수 계수 일차방정식으로 고쳐 풀면 x = ${root} 입니다.`,
      `Convert 0.5 to 1/2 and multiply both sides by the LCM of the denominators to find x = ${root}.`
    )
  };
}

function rpmEqProportionCrossMult(random, profile = 'ko') {
  const m = ri(random, 2, 4);
  const p = ri(random, 3, 5);
  const k = ri(random, 1, 5);
  const diff = 2 * m - p;
  const safeDiff = diff === 0 ? 1 : diff;
  const n = ri(random, 1, 5);
  const ansX = fracStr(p * k + m * n, safeDiff);
  return {
    prompt: tx(profile,
      '다음 비례식을 만족시키는 x의 값을 구하시오.',
      'Solve the proportion for x.'
    ),
    expression: `(x + ${k}) : ${m} = (2x - ${n}) : ${p}`,
    answer: ansX,
    explanation: tx(profile,
      `비례식 a:b = c:d 에서 (외항의 곱) = (내항의 곱)이므로 ${p}(x + ${k}) = ${m}(2x - ${n}) 입니다. 전개하면 ${p}x + ${p * k} = ${2 * m}x - ${m * n} 이고 이항하여 정리하면 x = ${ansX} 입니다.`,
      `Product of extremes equals product of means: ${p}(x + ${k}) = ${m}(2x - ${n}). Solving gives x = ${ansX}.`
    )
  };
}

function rpmEqRootGivenParam(random, profile = 'ko') {
  const root = ri(random, 1, 5);
  const paramA = ri(random, -5, 5) || 2;
  const c = ri(random, 2, 5);
  const rhsConst = (c - 2) * root - paramA;
  return {
    prompt: tx(profile,
      `일차방정식 ${c}x - a = 2x ${rhsConst >= 0 ? '+' : '-'} ${Math.abs(rhsConst)} 의 해가 x = ${root} 일 때, 상수 a의 값을 구하시오.`,
      `Given that x = ${root} is the solution to ${c}x - a = 2x ${rhsConst >= 0 ? '+' : '-'} ${Math.abs(rhsConst)}, find constant a.`
    ),
    expression: `${c}x - a = 2x ${rhsConst >= 0 ? '+' : '-'} ${Math.abs(rhsConst)}  [x = ${root}]`,
    answer: String(paramA),
    explanation: tx(profile,
      `x = ${root}을 방정식에 대입하면 ${c}×${root} - a = 2×${root} ${rhsConst >= 0 ? '+' : '-'} ${Math.abs(rhsConst)} 입니다. 계산하면 ${c * root} - a = ${2 * root + rhsConst} 이므로 -a = ${2 * root + rhsConst - c * root} 에서 a = ${paramA} 입니다.`,
      `Substitute x = ${root}: ${c}(${root}) - a = 2(${root}) + (${rhsConst}). Solving for a yields a = ${paramA}.`
    )
  };
}

function rpmEqTwoEqsSameRoot(random, profile = 'ko') {
  const root = ri(random, -4, 5) || 2;
  const a1 = ri(random, 2, 4);
  const b1 = ri(random, 1, 6);
  const eq1RHS = a1 * root + b1;
  const paramA = ri(random, 1, 6);
  const eq2RHS = 2 * root + paramA;
  return {
    prompt: tx(profile,
      `x에 대한 두 일차방정식 ${a1}x + ${b1} = ${eq1RHS} 와 2x + a = ${eq2RHS} 의 해가 서로 같을 때, 상수 a의 값을 구하시오.`,
      `If ${a1}x + ${b1} = ${eq1RHS} and 2x + a = ${eq2RHS} have the same solution, find constant a.`
    ),
    expression: `${a1}x + ${b1} = ${eq1RHS},  2x + a = ${eq2RHS}`,
    answer: String(paramA),
    explanation: tx(profile,
      `첫 번째 방정식 ${a1}x + ${b1} = ${eq1RHS}를 풀면 ${a1}x = ${eq1RHS - b1} 에서 x = ${root} 입니다. 두 방정식의 해가 같으므로 x = ${root}을 두 번째 방정식에 대입하면 2×(${root}) + a = ${eq2RHS} 이므로 a = ${paramA} 입니다.`,
      `Solving the first equation gives x = ${root}. Substituting into the second yields 2(${root}) + a = ${eq2RHS}, so a = ${paramA}.`
    )
  };
}

function rpmEqSpecialRoots(random, profile = 'ko') {
  const mode = pick(random, ['inf-many', 'no-solution']);
  if (mode === 'inf-many') {
    const aVal = 2;
    const bVal = 3;
    const ans = aVal + bVal;
    return {
      prompt: tx(profile,
        `x에 대한 방정식 ax - 5 = 2(x - b) + 1 의 해가 무수히 많을 때, a + b의 값을 구하시오. (단, a, b는 상수)`,
        `If ax - 5 = 2(x - b) + 1 has infinitely many solutions, find a + b.`
      ),
      expression: `ax - 5 = 2(x - b) + 1`,
      answer: String(ans),
      explanation: tx(profile,
        `우변을 전개하여 동류항을 정리하면 (a - 2)x = -2b + 6 입니다. 해가 무수히 많으려면 0×x = 0 꼴이어야 하므로 a - 2 = 0 에서 a = 2 이고, -2b + 6 = 0 에서 b = 3 입니다. 따라서 a + b = 5 입니다.`,
        `Rearranging gives (a - 2)x = -2b + 6. For infinitely many solutions, 0x = 0, so a = 2 and b = 3, giving a + b = 5.`
      )
    };
  }

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
    prompt: tx(profile,
      `x에 대한 일차방정식 ${b}x - a = ${b}x + 4 가 해를 갖지 않기 위한 상수 a의 조건은?`,
      `Find the condition on constant a for ${b}x - a = ${b}x + 4 to have no solution.`
    ),
    kind: 'choice',
    choices,
    answer: String(rightIdx),
    explanation: tx(profile,
      `식을 정리하면 0×x = 4 + a 입니다. 해가 존재하지 않으려면 0×x = (0이 아닌 상수) 꼴이어야 하므로 4 + a ≠ 0, 즉 a ≠ -4 이어야 합니다.`,
      `Rearranging gives 0x = 4 + a. For no solution, 4 + a ≠ 0, meaning a ≠ -4.`
    )
  };
}

function rpmEqRootIntegerNatural(random, profile = 'ko') {
  const k = pick(random, [7, 9, 11]);
  const validA = [];
  for (let diff = 2; diff < k; diff += 2) {
    validA.push(k - diff);
  }
  const sumA = validA.reduce((acc, v) => acc + v, 0);
  return {
    prompt: tx(profile,
      `x에 대한 일차방정식 6x + a = 4x + ${k} 의 해가 자연수가 되도록 하는 모든 자연수 a의 값의 합을 구하시오.`,
      `Find the sum of all natural numbers a such that the solution to 6x + a = 4x + ${k} is a natural number.`
    ),
    expression: `6x + a = 4x + ${k}`,
    answer: String(sumA),
    explanation: tx(profile,
      `방정식을 정리하면 2x = ${k} - a 이므로 x = (${k} - a)/2 입니다. x가 자연수가 되려면 ${k} - a가 2의 배수(짝수)이면서 양수이어야 합니다. 따라서 ${k} - a = ${validA.map((_, i) => (i + 1) * 2).join(', ')} 이므로 가능한 자연수 a는 ${validA.join(', ')} 입니다. 그 합은 ${sumA} 입니다.`,
      `Solving gives x = (${k} - a)/2. For x to be a natural number, ${k} - a must be a positive even integer. Possible values of a are ${validA.join(', ')}, with sum ${sumA}.`
    )
  };
}

function rpmEqRootRatioMultiple(random, profile = 'ko') {
  const r1 = 4;
  const r2 = 6;
  const aVal = ri(random, 1, 5);
  const rhsConst = r2 - aVal;
  return {
    prompt: tx(profile,
      `x에 대한 두 일차방정식 5 - x = (x - 1)/3 과 2x - a = x + ${rhsConst} 의 해의 비가 2 : 3 일 때, 상수 a의 값을 구하시오.`,
      `Given that the ratio of the roots of 5 - x = (x - 1)/3 and 2x - a = x + ${rhsConst} is 2 : 3, find constant a.`
    ),
    expression: `5 - x = (x - 1)/3,  2x - a = x + ${rhsConst}`,
    answer: String(aVal),
    explanation: tx(profile,
      `첫 번째 방정식의 양변에 3을 곱하면 15 - 3x = x - 1 이므로 4x = 16 에서 x = ${r1} 입니다. 두 방정식의 해의 비가 2 : 3 이므로 두 번째 방정식의 해는 ${r1} × (3/2) = ${r2} 입니다. x = ${r2}를 두 번째 식에 대입하면 2×${r2} - a = ${r2} + ${rhsConst} 이므로 a = ${aVal} 입니다.`,
      `The first root is x = ${r1}. With ratio 2:3, the second root is ${r2}. Substituting x = ${r2} into the second equation yields a = ${aVal}.`
    )
  };
}

function rpmEqMistakenCoef(random, profile = 'ko') {
  return {
    prompt: tx(profile,
      `어떤 학생이 일차방정식 3x - 3 = 6x - 7 을 푸는데 좌변의 x항의 계수 3을 잘못 보고 풀었더니 해가 x = -2 이었다. 3을 어떤 수로 잘못 보았는가?`,
      `A student solves 3x - 3 = 6x - 7 but misreads the coefficient 3 on the LHS, obtaining x = -2. What number was it misread as?`
    ),
    kind: 'choice',
    choices: ['4', '6', '8', '10', '12'],
    answer: '3',
    explanation: tx(profile,
      `잘못 본 계수를 a라 하면 ax - 3 = 6x - 7 입니다. 이 방정식의 해가 x = -2 이므로 대입하면 -2a - 3 = 6×(-2) - 7 = -19 입니다. -2a = -16 이므로 a = 8 입니다.`,
      `Let the misread coefficient be a: a(-2) - 3 = 6(-2) - 7 = -19, giving -2a = -16, so a = 8.`
    )
  };
}

function rpmEqCommonRootSystems(random, profile = 'ko') {
  return {
    prompt: tx(profile,
      `비례식 (x/3 - 1) : 4 = (x + 3)/4 : 6 을 만족시키는 x의 값이 두 일차방정식 (x - a)/2 - (2x - 1)/4 = -2 와 x - b = -9 의 공통해일 때, 상수 a, b에 대하여 ab의 값을 구하시오.`,
      `If the solution to (x/3 - 1) : 4 = (x + 3)/4 : 6 is also the common solution to (x - a)/2 - (2x - 1)/4 = -2 and x - b = -9, find ab.`
    ),
    expression: `(x/3 - 1) : 4 = (x + 3)/4 : 6,  (x - a)/2 - (2x - 1)/4 = -2,  x - b = -9`,
    answer: '81',
    explanation: tx(profile,
      `비례식에서 6(x/3 - 1) = x + 3 이므로 2x - 6 = x + 3 에서 x = 9 입니다. x = 9를 첫 번째 방정식에 대입하면 (9 - a)/2 - 17/4 = -2 에서 양변에 4를 곱하면 18 - 2a - 17 = -8, -2a = -9 에서 a = 9/2 입니다. x = 9를 두 번째 방정식에 대입하면 9 - b = -9 에서 b = 18 입니다. 따라서 ab = (9/2) × 18 = 81 입니다.`,
      `Solving the proportion gives x = 9. Substituting x = 9 gives a = 9/2 and b = 18, so ab = 81.`
    )
  };
}

const allServerGenerators = [
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

function rpmEqAllTypesMixed(random, profile = 'ko') {
  const chosen = pick(random, allServerGenerators);
  return chosen(random, profile);
}

// -------------------------------------------------------------
// 07: 일차방정식의 활용 응용 (RPM 1-1 p.106~117)
// -------------------------------------------------------------

function rpmAppNumberRelations(random, profile = 'ko') {
  const mode = pick(random, ['standard', 'mistake']);
  if (mode === 'standard') {
    const k = ri(random, 2, 5);
    const sub = ri(random, 2, 8);
    const m = ri(random, 1, k - 1);
    const x = ri(random, 4, 15);
    const b = k * (x - sub) - m * x;
    return {
      prompt: tx(profile,
        `어떤 수에서 ${sub}를 뺀 후 ${k}배 한 수는 어떤 수의 ${m === 1 ? '' : m}배보다 ${b >= 0 ? `${b}만큼 크다` : `${Math.abs(b)}만큼 작다`}고 한다. 이때 어떤 수를 구하시오.`,
        `Subtracting ${sub} from a number and multiplying by ${k} gives a result that is ${Math.abs(b)} ${b >= 0 ? 'more' : 'less'} than ${m === 1 ? '' : `${m} times `}the number. Find the number.`
      ),
      expression: `${k}(x - ${sub}) = ${m}x ${b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`}`,
      answer: String(x),
      explanation: tx(profile,
        `어떤 수를 x라 하면 ${k}(x - ${sub}) = ${m}x ${b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`} 에서 x = ${x}입니다.`,
        `Letting the number be x, solving ${k}(x - ${sub}) = ${m}x ${b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`} yields x = ${x}.`
      ),
    };
  }

  const a = ri(random, 3, 6);
  const b = ri(random, 2, 5);
  const x = ri(random, 3, 10);
  const correct = a * x + b;
  const mistaken = b * x + a;
  const diff = correct - mistaken;
  return {
    prompt: tx(profile,
      `어떤 수의 ${a}배에 ${b}를 더해야 할 것을 잘못하여 어떤 수의 ${b}배에 ${a}를 더했더니 처음 구하려고 했던 수보다 ${diff}만큼 작아졌다. 어떤 수를 구하시오.`,
      `Instead of adding ${b} to ${a} times a number, adding ${a} to ${b} times the number gave a value ${diff} less than intended. Find the number.`
    ),
    expression: `${b}x + ${a} = (${a}x + ${b}) - ${diff}`,
    answer: String(x),
    explanation: tx(profile,
      `어떤 수를 x라 하면 ${b}x + ${a} = (${a}x + ${b}) - ${diff} 에서 (${a - b})x = ${diff + a - b} 이므로 x = ${x}입니다.`,
      `Let the number be x. Solving ${b}x + ${a} = (${a}x + ${b}) - ${diff} gives x = ${x}.`
    ),
  };
}

// 2. [방정식 활용 유형 02] 연속하는 수에 대한 문제 (#0835 ~ #0838)
function rpmAppConsecutiveNumbers(random, profile = 'ko') {
  const mode = pick(random, ['even-sum', 'odd-sum', 'three-compare']);
  if (mode === 'even-sum') {
    const x = ri(random, 6, 25) * 2;
    const sum = (x - 2) + x + (x + 2);
    return {
      prompt: tx(profile,
        `연속하는 세 짝수의 합이 ${sum}일 때, 이 세 수 중 가장 작은 수를 구하시오.`,
        `The sum of three consecutive even integers is ${sum}. Find the smallest number.`
      ),
      expression: `(x - 2) + x + (x + 2) = ${sum}`,
      answer: String(x - 2),
      explanation: tx(profile,
        `세 짝수를 x-2, x, x+2라 하면 3x = ${sum}에서 가운데 수는 ${x}, 가장 작은 수는 ${x - 2}입니다.`,
        `Letting the numbers be x-2, x, x+2, 3x = ${sum}, so the smallest is ${x - 2}.`
      ),
    };
  }

  if (mode === 'odd-sum') {
    const x = ri(random, 5, 25) * 2 + 1;
    const sum = (x - 2) + x + (x + 2);
    return {
      prompt: tx(profile,
        `연속하는 세 홀수의 합이 ${sum}일 때, 이 세 수 중 가장 큰 수를 구하시오.`,
        `The sum of three consecutive odd integers is ${sum}. Find the largest number.`
      ),
      expression: `(x - 2) + x + (x + 2) = ${sum}`,
      answer: String(x + 2),
      explanation: tx(profile,
        `세 홀수를 x-2, x, x+2라 하면 3x = ${sum}에서 x = ${x}이므로 가장 큰 수는 ${x + 2}입니다.`,
        `Letting the numbers be x-2, x, x+2, 3x = ${sum} gives x = ${x}, so the largest is ${x + 2}.`
      ),
    };
  }

  const x = ri(random, 6, 20) * 2;
  const left = x - 2;
  const right = x + 2;
  const diff = 3 * right - 2 * (left + x);
  return {
    prompt: tx(profile,
      `연속하는 세 짝수 중에서 가장 큰 수의 3배는 나머지 두 수의 합의 2배보다 ${diff >= 0 ? `${diff}만큼 크다` : `${Math.abs(diff)}만큼 작다`}고 한다. 이때 가운데 수를 구하시오.`,
      `Among three consecutive even numbers, 3 times the largest is ${Math.abs(diff)} ${diff >= 0 ? 'more' : 'less'} than twice the sum of the other two. Find the middle number.`
    ),
    expression: `3(x + 2) = 2(2x - 2) + ${diff}`,
    answer: String(x),
    explanation: tx(profile,
      `3(x + 2) = 2(2x - 2) + ${diff} 에서 x = ${x}입니다.`,
      `Solving 3(x + 2) = 2(2x - 2) + ${diff} yields x = ${x}.`
    ),
  };
}

// 3. [방정식 활용 유형 03] 자릿수에 대한 문제 (#0839 ~ #0842, #0905)
function rpmAppDigitValues(random, profile = 'ko') {
  const tens = ri(random, 1, 8);
  const diff = ri(random, 1, 9 - tens);
  const units = tens + diff;
  const original = 10 * tens + units;
  const reversed = 10 * units + tens;
  const revDiff = reversed - original;
  const sumDigits = tens + units;

  return {
    prompt: tx(profile,
      `각 자리의 숫자의 합이 ${sumDigits}인 두 자리의 자연수가 있다. 이 자연수의 십의 자리의 숫자와 일의 자리의 숫자를 바꾼 수는 처음 수보다 ${revDiff}만큼 크다고 한다. 처음 자연수를 구하시오.`,
      `In a two-digit number, the sum of digits is ${sumDigits}. Reversing the digits yields a number ${revDiff} greater than the original. Find the original number.`
    ),
    expression: `10(${sumDigits} - x) + x = 10x + (${sumDigits} - x) + ${revDiff}`,
    answer: String(original),
    explanation: tx(profile,
      `처음 십의 자리를 x라 하면 바꾼 수는 10(${sumDigits} - x) + x = 10x + (${sumDigits} - x) + ${revDiff} 에서 x = ${tens}이므로 처음 수는 ${original}입니다.`,
      `Letting the tens digit be x, solving yields x = ${tens}, so the number is ${original}.`
    ),
  };
}

// 4. [방정식 활용 유형 04] 나이에 대한 문제 (#0843 ~ #0844)
function rpmAppAgeProblems(random, profile = 'ko') {
  const yearsLater = pick(random, [8, 10, 12, 14, 15]);
  const sonNow = ri(random, 11, 16);
  const fatherNow = 2 * (sonNow + yearsLater) - yearsLater;
  const sumAges = fatherNow + sonNow;

  return {
    prompt: tx(profile,
      `현재 아버지와 아들의 나이의 합은 ${sumAges}세이고, ${yearsLater}년 후에는 아버지의 나이가 아들의 나이의 2배가 된다고 한다. 현재 아들의 나이를 구하시오.`,
      `The sum of a father's and son's current ages is ${sumAges}. In ${yearsLater} years, the father will be twice as old as the son. Find the son's current age.`
    ),
    expression: `(${sumAges} - x) + ${yearsLater} = 2(x + ${yearsLater})`,
    answer: String(sonNow),
    answerSuffix: tx(profile, '세', ' years old'),
    explanation: tx(profile,
      `현재 아들의 나이를 x세라 하면 (${sumAges} - x) + ${yearsLater} = 2(x + ${yearsLater}) 에서 x = ${sonNow}세입니다.`,
      `Letting son's age be x, (${sumAges} - x) + ${yearsLater} = 2(x + ${yearsLater}) gives x = ${sonNow}.`
    ),
  };
}

// 5. [방정식 활용 유형 05] 예금액과 소지금에 대한 문제 (#0845 ~ #0846, #0906)
function rpmAppSavingsAllowance(random, profile = 'ko') {
  const brotherA = 30000;
  const brotherB = 15000;
  const monthlyA = 4000;
  const monthlyB = 1000;
  const months = 10;

  return {
    prompt: tx(profile,
      `현재 형은 통장에 ${brotherA}원, 동생은 통장에 ${brotherB}원이 예금되어 있다. 다음 달부터 매달 형은 ${monthlyA}원씩, 동생은 ${monthlyB}원씩 예금한다면 몇 개월 후에 형의 예금액이 동생의 예금액의 2배가 되는지 구하시오.`,
      `Currently A has ${brotherA} won and B has ${brotherB} won in savings. If A deposits ${monthlyA} won and B deposits ${monthlyB} won monthly, in how many months will A have twice B's savings?`
    ),
    expression: `${brotherA} + ${monthlyA}x = 2(${brotherB} + ${monthlyB}x)`,
    answer: String(months),
    answerSuffix: tx(profile, '개월', ' months'),
    explanation: tx(profile,
      `${brotherA} + ${monthlyA}x = 2(${brotherB} + ${monthlyB}x) 에서 2000x = 20000 이므로 x = ${months}개월입니다.`,
      `Solving ${brotherA} + ${monthlyA}x = 2(${brotherB} + ${monthlyB}x) gives x = ${months} months.`
    ),
  };
}

// 6. [방정식 활용 유형 06] 개수의 합이 일정한 문제 (#0847 ~ #0850)
function rpmAppFixedTotalCount(random, profile = 'ko') {
  const priceA = pick(random, [600, 700, 800]);
  const priceB = 500;
  const totalItems = 10;
  const countA = ri(random, 3, 7);
  const countB = totalItems - countA;
  const totalCost = priceA * countA + priceB * countB;
  const paid = 7000;
  const change = paid - totalCost;

  return {
    prompt: tx(profile,
      `한 개에 ${priceA}원인 과자와 한 개에 ${priceB}원인 아이스크림을 합하여 모두 ${totalItems}개를 사고 ${paid}원을 내었더니 ${change}원을 거슬러 주었다. 이때 산 과자의 개수를 구하시오.`,
      `Snacks at ${priceA} won each and ice cream bars at ${priceB} won each were bought for a total of ${totalItems} items. Paying ${paid} won yielded ${change} won change. How many snacks were bought?`
    ),
    expression: `${priceA}x + ${priceB}(${totalItems} - x) = ${paid} - ${change}`,
    answer: String(countA),
    answerSuffix: tx(profile, '개', ''),
    explanation: tx(profile,
      `산 과자의 개수를 x라 하면 ${priceA}x + ${priceB}(${totalItems} - x) = ${totalCost} 에서 x = ${countA}개입니다.`,
      `Letting the number of snacks be x, ${priceA}x + ${priceB}(${totalItems} - x) = ${totalCost} gives x = ${countA}.`
    ),
  };
}

// 7. [방정식 활용 유형 07] 도형의 둘레와 넓이에 대한 문제 (#0851 ~ #0854)
function rpmAppGeometryFigures(random, profile = 'ko') {
  const side = ri(random, 10, 16);
  const incW = ri(random, 3, 5);
  const decH = ri(random, 2, 4);
  const newArea = (side + incW) * (side - decH);

  return {
    prompt: tx(profile,
      `한 변의 길이가 ${side}cm인 정사각형에서 가로의 길이를 ${incW}cm 늘이고, 세로의 길이를 x cm 줄여서 직사각형을 만들었더니 넓이가 ${newArea}cm²가 되었다고 한다. 이때 x의 값을 구하시오.`,
      `A square of side ${side} cm has its width increased by ${incW} cm and its height decreased by x cm, resulting in an area of ${newArea} cm². Find x.`
    ),
    expression: `(${side} + ${incW})(${side} - x) = ${newArea}`,
    answer: String(decH),
    answerSuffix: 'cm',
    explanation: tx(profile,
      `(${side + incW})(${side} - x) = ${newArea} 에서 ${side} - x = ${side - decH} 이므로 x = ${decH}입니다.`,
      `(${side + incW})(${side} - x) = ${newArea} gives x = ${decH}.`
    ),
  };
}

// 8. [방정식 활용 유형 08] 과부족에 대한 문제 (#0855 ~ #0857)
function rpmAppExcessDeficitItems(random, profile = 'ko') {
  const students = ri(random, 8, 18);
  const give1 = 5;
  const leftover = ri(random, 2, 5);
  const totalItems = give1 * students + leftover;
  const give2 = 6;
  const deficit = give2 * students - totalItems;

  return {
    prompt: tx(profile,
      `학생들에게 귤을 나누어 주는데 한 학생에게 ${give1}개씩 나누어 주면 ${leftover}개가 남고, ${give2}개씩 나누어 주면 ${deficit}개가 부족하다고 한다. 이때 학생 수를 구하시오.`,
      `Distributing tangerines, giving ${give1} per student leaves ${leftover} remaining, while giving ${give2} per student leaves a deficit of ${deficit}. Find the number of students.`
    ),
    expression: `${give1}x + ${leftover} = ${give2}x - ${deficit}`,
    answer: String(students),
    answerSuffix: tx(profile, '명', ''),
    explanation: tx(profile,
      `${give1}x + ${leftover} = ${give2}x - ${deficit} 에서 x = ${students}명입니다.`,
      `Solving ${give1}x + ${leftover} = ${give2}x - ${deficit} yields x = ${students}.`
    ),
  };
}

// 9. [방정식 활용 유형 09] 증가, 감소에 대한 문제 (#0858 ~ #0861, #0907)
function rpmAppPercentChangeStudents(random, profile = 'ko') {
  const lastBoys = 300;
  const lastGirls = 200;
  const lastTotal = 500;
  const boyRate = 10;
  const girlRate = 5;
  const netChange = 20; // 30 - 10 = 20 inc
  const thisBoys = 330;

  return {
    prompt: tx(profile,
      `어느 중학교의 올해 학생 수는 작년에 비하여 남학생은 ${boyRate}% 증가하고, 여학생은 ${girlRate}% 감소하였다. 작년의 전체 학생 수는 ${lastTotal}명이고, 올해는 전체적으로 ${netChange}명이 증가하였다고 한다. 올해의 남학생 수를 구하시오.`,
      `This year, boys increased by ${boyRate}% and girls decreased by ${girlRate}% from last year's total of ${lastTotal}, yielding an overall increase of ${netChange} students. Find the number of boys this year.`
    ),
    expression: `0.10x - 0.05(${lastTotal} - x) = ${netChange}`,
    answer: String(thisBoys),
    answerSuffix: tx(profile, '명', ''),
    explanation: tx(profile,
      `작년 남학생 수를 x라 하면 0.10x - 0.05(${lastTotal} - x) = ${netChange} 에서 x = ${lastBoys}명입니다. 올해 남학생 수는 ${lastBoys} × 1.10 = ${thisBoys}명입니다.`,
      `Letting last year's boys be x, 0.10x - 0.05(${lastTotal} - x) = ${netChange} gives x = ${lastBoys}. This year's boys = ${thisBoys}.`
    ),
  };
}

// 10. [방정식 활용 유형 10] 전체의 양에 대한 문제 (#0862 ~ #0864)
function rpmAppTotalFractionReading(random, profile = 'ko') {
  const totalPages = 120;
  return {
    prompt: tx(profile,
      `성희가 책 한 권을 읽는데 첫째 날에는 전체의 1/3을, 둘째 날에는 전체의 1/4을 읽고, 셋째 날에는 50쪽을 읽어 다 읽었다고 한다. 이 책의 전체 쪽수를 구하시오.`,
      `Reading a book over 3 days: 1/3 of the total on day 1, 1/4 on day 2, and the remaining 50 pages on day 3. Find the total number of pages.`
    ),
    expression: `(1/3)x + (1/4)x + 50 = x`,
    answer: String(totalPages),
    answerSuffix: tx(profile, '쪽', ' pages'),
    explanation: tx(profile,
      `(1/3)x + (1/4)x + 50 = x 에서 (5/12)x = 50 이므로 x = 120쪽입니다.`,
      `Solving (1/3)x + (1/4)x + 50 = x gives x = 120 pages.`
    ),
  };
}

// 11. [방정식 활용 유형 11] 거리·속력·시간 (왕복 및 코스 변화 문제) (#0865 ~ #0868, #0909)
function rpmAppSpeedRoundtripCourses(random, profile = 'ko') {
  const dist = 12;
  return {
    prompt: tx(profile,
      `어떤 산을 올라갈 때는 시속 3km로 걷고, 내려올 때는 시속 4km로 걸어서 왕복 총 7시간이 걸렸다. 등산로의 편도 거리를 구하시오.`,
      `Hiking up a mountain at 3 km/h and descending at 4 km/h took 7 hours round-trip. Find the one-way distance.`
    ),
    expression: `x/3 + x/4 = 7`,
    answer: String(dist),
    answerSuffix: 'km',
    explanation: tx(profile,
      `편도 거리를 x km라 하면 x/3 + x/4 = 7 에서 7x = 84, x = 12km입니다.`,
      `Letting the distance be x km, x/3 + x/4 = 7 yields x = 12 km.`
    ),
  };
}

// 12. [방정식 활용 유형 12] 거리·속력·시간 (시간 차 발생) (#0869 ~ #0871)
function rpmAppSpeedTimeDifference(random, profile = 'ko') {
  const dVal = 35;
  return {
    prompt: tx(profile,
      `두 지점 A, B 사이를 자동차로 왕복하는데 시속 60km로 달리는 것은 시속 70km로 달리는 것보다 5분이 더 걸린다고 한다. 두 지점 A, B 사이의 거리를 구하시오.`,
      `Driving between A and B, traveling at 60 km/h takes 5 minutes longer than at 70 km/h. Find the distance between A and B.`
    ),
    expression: `x/60 - x/70 = 5/60`,
    answer: String(dVal),
    answerSuffix: 'km',
    explanation: tx(profile,
      `거리를 x km라 하면 x/60 - x/70 = 1/12 에서 7x - 6x = 35 이므로 x = 35km입니다.`,
      `Solving x/60 - x/70 = 5/60 gives x = 35 km.`
    ),
  };
}

// 13. [방정식 활용 유형 13] 거리·속력·시간 (추격 문제) (#0872 ~ #0874)
function rpmAppSpeedCatchupDelay(random, profile = 'ko') {
  return {
    prompt: tx(profile,
      `동생이 집을 출발한 지 10분 후에 형이 동생을 따라나섰다. 동생은 분속 60m로 걷고 형은 분속 160m로 달린다면, 형이 출발한 지 몇 분 후에 동생을 만나게 되는지 구하시오.`,
      `A brother starts 10 minutes later at 160 m/min pursuing his sibling walking at 60 m/min. In how many minutes does he catch up?`
    ),
    expression: `160x = 60(x + 10)`,
    answer: '6',
    answerSuffix: tx(profile, '분', ' minutes'),
    explanation: tx(profile,
      `160x = 60(x + 10) 에서 100x = 600 이므로 x = 6분입니다.`,
      `Solving 160x = 60(x + 10) yields x = 6 minutes.`
    ),
  };
}

// 14. [방정식 활용 유형 14] 거리·속력·시간 (마주보기/트랙) (#0875 ~ #0877, #0910)
function rpmAppSpeedTracksOpposite(random, profile = 'ko') {
  return {
    prompt: tx(profile,
      `둘레의 길이가 3000m인 호숫가를 A, B 두 사람이 같은 지점에서 동시에 출발하여 서로 반대 방향으로 돌았다. A는 분속 180m, B는 분속 120m로 걸을 때, 두 사람은 출발한 지 몇 분 후에 처음으로 만나게 되는지 구하시오.`,
      `Walking in opposite directions around a 3,000 m lake, A walks at 180 m/min and B at 120 m/min. In how many minutes do they first meet?`
    ),
    expression: `(180 + 120)x = 3000`,
    answer: '10',
    answerSuffix: tx(profile, '분', ' minutes'),
    explanation: tx(profile,
      `300x = 3000 에서 x = 10분입니다.`,
      `Solving 300x = 3000 gives x = 10 minutes.`
    ),
  };
}

// 15. [방정식 활용 유형 15] 소금물의 농도 (물 증발/추가) (#0878 ~ #0881, #0911)
function rpmAppSaltWaterEvaporateAdd(random, profile = 'ko') {
  return {
    prompt: tx(profile,
      `8%의 소금물 250g이 있다. 이 소금물에서 몇 g의 물을 증발시키면 10%의 소금물이 되는지 구하시오.`,
      `How many grams of water must be evaporated from 250 g of 8% salt solution to obtain a 10% salt solution?`
    ),
    expression: `(8/100) × 250 = (10/100)(250 - x)`,
    answer: '50',
    answerSuffix: 'g',
    explanation: tx(profile,
      `2000 = 10(250 - x) 에서 250 - x = 200 이므로 x = 50g입니다.`,
      `Solving (8/100) × 250 = (10/100)(250 - x) yields x = 50 g.`
    ),
  };
}

// 16. [방정식 활용 유형 16] 소금물의 농도 (소금 더 넣기) (#0882 ~ #0885, #0912)
function rpmAppSaltAddSalt(random, profile = 'ko') {
  return {
    prompt: tx(profile,
      `10%의 소금물 240g이 있다. 여기에 소금을 더 넣어 20%의 소금물을 만들려고 할 때, 더 넣어야 하는 소금의 양을 구하시오.`,
      `How many grams of salt must be added to 240 g of 10% salt solution to obtain a 20% salt solution?`
    ),
    expression: `(10/100) × 240 + x = (20/100)(240 + x)`,
    answer: '30',
    answerSuffix: 'g',
    explanation: tx(profile,
      `2400 + 100x = 4800 + 20x 에서 80x = 2400 이므로 x = 30g입니다.`,
      `Solving (10/100) × 240 + x = (20/100)(240 + x) gives x = 30 g.`
    ),
  };
}

// 17. [방정식 활용 유형 17] 소금물의 농도 (두 소금물 섞기) (#0886 ~ #0889)
function rpmAppSaltTwoSolutionsMix(random, profile = 'ko') {
  return {
    prompt: tx(profile,
      `10%의 소금물 100g과 20%의 소금물을 섞어서 12%의 소금물을 만들려고 한다. 20%의 소금물은 몇 g을 섞어야 하는지 구하시오.`,
      `Mixing 100 g of 10% salt solution with a 20% solution to obtain a 12% solution, how many grams of the 20% solution are required?`
    ),
    expression: `(10/100) × 100 + (20/100)x = (12/100)(100 + x)`,
    answer: '25',
    answerSuffix: 'g',
    explanation: tx(profile,
      `1000 + 20x = 1200 + 12x 에서 8x = 200 이므로 x = 25g입니다.`,
      `Solving 1000 + 20x = 12(100 + x) gives x = 25 g.`
    ),
  };
}

// 18. [방정식 활용 유형 18] 원가·정가·할인·이익 (#0890 ~ #0893, #0908, #0916)
function rpmAppCostPriceProfitDiscount(random, profile = 'ko') {
  return {
    prompt: tx(profile,
      `어떤 물건의 원가에 40%의 이익을 붙여서 정가를 정했다가 정가에서 1600원을 할인하여 팔았더니 1400원의 이익이 생겼다. 이 물건의 원가를 구하시오.`,
      `An item was marked up 40% to set the list price, then sold at a 1,600 won discount, yielding a 1,400 won profit. Find the cost price.`
    ),
    expression: `1.40x - 1600 - x = 1400`,
    answer: '7500',
    answerSuffix: tx(profile, '원', ' won'),
    explanation: tx(profile,
      `0.40x - 1600 = 1400 에서 0.40x = 3000 이므로 원가 x = 7500원입니다.`,
      `Solving 0.40x - 1600 = 1400 yields x = 7500 won.`
    ),
  };
}

// 19. [방정식 활용 유형 19] 일에 대한 문제 (#0894 ~ #0897, #0914)
function rpmAppWorkDoneCollaborative(random, profile = 'ko') {
  return {
    prompt: tx(profile,
      `어떤 일을 완성하는 데 A는 8일, B는 16일이 걸린다. 처음에 A가 2일 동안 일한 후에 A와 B가 함께 일하여 일을 완성했다면, 두 사람이 함께 일한 날수를 구하시오.`,
      `Task takes A 8 days and B 16 days alone. A worked alone for 2 days, then A and B finished together. How many days did they work together?`
    ),
    expression: `2/8 + (1/8 + 1/16)x = 1`,
    answer: '4',
    answerSuffix: tx(profile, '일', ' days'),
    explanation: tx(profile,
      `1/4 + (3/16)x = 1 에서 (3/16)x = 3/4 이므로 x = 4일입니다.`,
      `Solving 2/8 + (3/16)x = 1 yields x = 4 days.`
    ),
  };
}

// 20. [방정식 활용 유형 20] 긴 의자에 대한 문제 (#0898 ~ #0901, #0913)
function rpmAppExcessDeficitBenches(random, profile = 'ko') {
  return {
    prompt: tx(profile,
      `긴 의자에 학생들이 앉는데 한 의자에 5명씩 앉으면 4명이 앉지 못하고, 6명씩 앉으면 빈 의자는 없고 마지막 의자에는 3명이 앉는다고 한다. 긴 의자의 개수를 구하시오.`,
      `Sitting 5 students per bench leaves 4 standing. Sitting 6 per bench leaves no empty benches and 3 students on the last bench. Find the number of benches.`
    ),
    expression: `5x + 4 = 6(x - 1) + 3`,
    answer: '7',
    answerSuffix: tx(profile, '개', ' benches'),
    explanation: tx(profile,
      `5x + 4 = 6x - 3 에서 x = 7개입니다.`,
      `Solving 5x + 4 = 6(x - 1) + 3 yields x = 7 benches.`
    ),
  };
}

// 21. [방정식 활용 유형 21] 기차 통과 문제 (#0902 ~ #0904)
function rpmAppTrainBridgeTunnel(random, profile = 'ko') {
  return {
    prompt: tx(profile,
      `일정한 속력으로 달리는 열차가 있다. 이 열차가 길이가 1300m인 터널을 완전히 통과하는 데 40초가 걸리고, 길이가 400m인 다리를 완전히 통과하는 데 15초가 걸린다. 열차의 길이를 구하시오.`,
      `A train passes a 1,300 m tunnel in 40 s and a 400 m bridge in 15 s at constant speed. Find the train length.`
    ),
    expression: `(1300 + x)/40 = (400 + x)/15`,
    answer: '140',
    answerSuffix: 'm',
    explanation: tx(profile,
      `속력은 (1300 + x)/40 = (400 + x)/15 에서 3(1300 + x) = 8(400 + x), 5x = 700 이므로 x = 140m입니다.`,
      `Solving (1300 + x)/40 = (400 + x)/15 yields x = 140 m.`
    ),
  };
}

// 22. [방정식 활용 심화 22] 시험 지원자·합격자·불합격자 비율 (#0915)
function rpmAppAdmissionRatioSystem(random, profile = 'ko') {
  return {
    prompt: tx(profile,
      `어느 학교의 입학시험에서 지원자의 남녀 비는 4 : 3, 합격자의 남녀 비는 5 : 3, 불합격자의 남녀 비는 1 : 1이다. 합격자 수가 160명일 때, 입학 지원자의 총수를 구하시오.`,
      `Applicant male-female ratio is 4 : 3, admitted ratio is 5 : 3, and rejected ratio is 1 : 1. If 160 were admitted, find the total number of applicants.`
    ),
    expression: `(100 + k) : (60 + k) = 4 : 3`,
    answer: '280',
    answerSuffix: tx(profile, '명', ''),
    explanation: tx(profile,
      `합격 남학생 100명, 여학생 60명. 불합격 남녀 각 k명에서 (100 + k) : (60 + k) = 4 : 3, k = 60. 총 지원자 = 160 + 120 = 280명입니다.`,
      `Admitted: 100 boys, 60 girls. Rejected: k boys, k girls. (100 + k) : (60 + k) = 4 : 3 gives k = 60. Total applicants = 280.`
    ),
  };
}

// 23. [방정식 활용 심화 23] 소금물 퍼내기/맞교환 (#0917, #0919)
function rpmAppSaltExchangeReplace(random, profile = 'ko') {
  return {
    prompt: tx(profile,
      `8%의 소금물 300g에서 x g의 소금물을 퍼내고 퍼낸 만큼 물을 부은 후 4%의 소금물 60g을 섞어 6%의 소금물 360g을 만들었다. x의 값을 구하시오.`,
      `From 300 g of 8% salt solution, x g is replaced with water, then mixed with 60 g of 4% solution to make 360 g of 6% solution. Find x.`
    ),
    expression: `0.08(300 - x) + 0.04 × 60 = 0.06 × 360`,
    answer: '60',
    answerSuffix: 'g',
    explanation: tx(profile,
      `24 - 0.08x + 2.4 = 21.6 에서 0.08x = 4.8 이므로 x = 60g입니다.`,
      `Solving 0.08(300 - x) + 2.4 = 21.6 gives x = 60 g.`
    ),
  };
}

// 24. [방정식 활용 심화 24] 도중 감속 지연 열차 (#0918)
function rpmAppSpeedMidwayDelay(random, profile = 'ko') {
  return {
    prompt: tx(profile,
      `42km 떨어진 두 지점 A, B 사이를 시속 60km로 달리는 열차가 도중에 시속 40km로 감속 운행하여 예정 시간보다 8분 늦게 도착하였다. 시속 60km로 달린 거리를 구하시오.`,
      `A train on a 42 km route scheduled at 60 km/h slows to 40 km/h midway, arriving 8 minutes late. Find the distance traveled at 60 km/h.`
    ),
    expression: `x/60 + (42 - x)/40 = 50/60`,
    answer: '26',
    answerSuffix: 'km',
    explanation: tx(profile,
      `2x + 3(42 - x) = 100 에서 x = 26km입니다.`,
      `Solving x/60 + (42 - x)/40 = 50/60 yields x = 26 km.`
    ),
  };
}

// 25. [방정식 활용 발전 25] 시계 각도 시각 (#0920)
function rpmAppClockHandsAngle(random, profile = 'ko') {
  return {
    prompt: tx(profile,
      `9시와 10시 사이에서 시계의 시침과 분침이 서로 반대 방향으로 일직선을 이루는 시각을 구하시오.`,
      `Between 9 and 10 o'clock, at what time are the clock hands in opposite directions along a straight line?`
    ),
    expression: `(270 + 0.5x) - 6x = 180`,
    answer: `9시 16과 4/11분`,
    explanation: tx(profile,
      `5.5x = 90 에서 11x = 180, x = 180/11 = 16과 4/11분입니다.`,
      `Solving 5.5x = 90 gives x = 180/11 = 16 and 4/11 minutes.`
    ),
  };
}

// 26. [단원 실전 다지기] 매일 일차방정식 활용 종합
function rpmAppAllTypesMixed(random, profile = 'ko') {
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
  return pick(random, generators)(random, profile);
}

// Legacy aliases
const rpmEqExcessDeficit = rpmAppExcessDeficitBenches;
const rpmEqCatchupTravel = rpmAppSpeedCatchupDelay;


// -------------------------------------------------------------
// CHAPTER 08 & 09: 좌표평면과 그래프, 정비례와 반비례 세부 응용 유형 (RPM 1-1 p.122~149, 152~173)
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

function problem(prompt, expression, answer, extra = {}) {
  return { prompt, expression, answer: String(answer), answerSuffix: '', ...extra };
}

function rpmCoordOrderedPairEquality(random, profile = 'ko') {
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

function rpmCoordAxisPoints(random, profile = 'ko') {
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

function rpmCoordTriangleArea(random, profile = 'ko') {
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

function rpmCoordPolygonArea(random, profile = 'ko') {
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

function rpmCoordQuadrantIdentify(random, profile = 'ko') {
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

function rpmCoordQuadrantSignCondition(random, profile = 'ko') {
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

function rpmCoordSignProductSum(random, profile = 'ko') {
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

function rpmCoordAbsConditionQuadrant(random, profile = 'ko') {
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

function rpmCoordSymmetricPoints(random, profile = 'ko') {
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

function rpmCoordSymmetricArea(random, profile = 'ko') {
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

function rpmCoordGraphSituation(random, profile = 'ko') {
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

function rpmCoordGraphDistanceTime(random, profile = 'ko') {
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

function rpmCoordGraphSpeedTime(random, profile = 'ko') {
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

function rpmCoordAllTypesMixed(random, profile = 'ko') {
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
function rpmPropDirectIdentify(random, profile = 'ko') {
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
function rpmPropDirectTable(random, profile = 'ko') {
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
function rpmPropDirectGraphProperties(random, profile = 'ko') {
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
function rpmPropDirectSlopeAxisDistance(random, profile = 'ko') {
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
function rpmPropDirectPointOnGraph(random, profile = 'ko') {
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
function rpmPropDirectFindEquation(random, profile = 'ko') {
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
function rpmPropDirectGraphArea(random, profile = 'ko') {
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
function rpmPropInverseIdentify(random, profile = 'ko') {
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
function rpmPropInverseTable(random, profile = 'ko') {
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
function rpmPropInverseGraphProperties(random, profile = 'ko') {
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
function rpmPropInverseOriginDistance(random, profile = 'ko') {
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
function rpmPropInversePointOnGraph(random, profile = 'ko') {
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
function rpmPropInverseLatticePoints(random, profile = 'ko') {
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
function rpmPropInverseFindEquation(random, profile = 'ko') {
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
function rpmPropDirectInverseIntersection(random, profile = 'ko') {
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
function rpmPropInverseRectArea(random, profile = 'ko') {
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
function rpmPropDirectWordCandleGear(random, profile = 'ko') {
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
function rpmPropInverseWordTankVolume(random, profile = 'ko') {
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
function rpmPropInverseWordWorkBoyle(random, profile = 'ko') {
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
function rpmPropTwoTravelersGraph(random, profile = 'ko') {
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
function rpmPropChainProportion(random, profile = 'ko') {
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
function rpmPropAllTypesMixed(random, profile = 'ko') {
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
function rpmSemesterOneMockExam(random, profile = 'ko') {
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
'rpm-geo-semester-one-mock-exam': rpmGeoSemesterOneMockExam,
};
