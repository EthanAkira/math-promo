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
