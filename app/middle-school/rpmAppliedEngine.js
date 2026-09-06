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
// CHAPTER 01: 소인수분해 응용 (Prime Factorization Applied)
// -------------------------------------------------------------

// 1. 제곱수 만들기: N * x = y^2 (RPM p.13 #61, p.15 #81)
export function rpmPrimeMakeSquare(random) {
  const base1 = pick(random, [2, 3]);
  const base2 = pick(random, [3, 5, 7]);
  const base3 = pick(random, [5, 7, 11]);
  // Odd exponents that need multiplying
  const e1 = pick(random, [1, 3]);
  const e2 = pick(random, [1, 2]);
  const e3 = 1;
  const n = (base1 ** e1) * (base2 ** e2) * (base3 ** e3);
  const factors = factorize(n);
  // Need to multiply prime factors with odd exponent
  let x = 1;
  factors.forEach(([p, e]) => {
    if (e % 2 !== 0) x *= p;
  });
  const y = Math.round(Math.sqrt(n * x));

  const askSum = random() < 0.55;
  const promptKo = `${n}에 가능한 한 가장 작은 자연수 x를 곱하여 어떤 자연수 y의 제곱이 되도록 할 때, ${askSum ? 'x + y의 값' : '가장 작은 자연수 x의 값'}을 구하시오.`;
  const promptEn = `Multiply ${n} by the smallest natural number x so that the result is the square of a natural number y. Find ${askSum ? 'the value of x + y' : 'the smallest natural number x'}.`;
  const ans = askSum ? x + y : x;

  return {
    prompt: promptKo,
    promptEn,
    expression: `${n} × x = y^2`,
    answer: String(ans),
    explanation: `${n}을 소인수분해하면 ${factorText(factors)}입니다. 제곱수가 되려면 모든 소인수의 지수가 짝수이어야 하므로 가장 작은 x = ${x}입니다. 이때 y² = ${n * x} = ${y}²이므로 y = ${y}입니다. 따라서 ${askSum ? `x + y = ${x} + ${y} = ${ans}` : `x = ${x}`}입니다.`,
  };
}

// 2. 약수의 개수가 주어졌을 때 지수/미지수 구하기 (RPM p.12 #58, #59)
export function rpmPrimeDivisorCountReverse(random) {
  const p1 = pick(random, [2, 3]);
  const p2 = p1 === 2 ? 3 : 5;
  const p3 = p2 === 3 ? 5 : 7;
  const e1 = ri(random, 2, 4);
  const targetN = ri(random, 1, 4);
  const totalDivisors = (e1 + 1) * 2 * (targetN + 1);

  const promptKo = `${p1}^${e1} × ${p2} × ${p3}^n의 약수의 개수가 ${totalDivisors}개일 때, 자연수 n의 값을 구하시오.`;
  const promptEn = `The number of divisors of ${p1}^${e1} × ${p2} × ${p3}^n is ${totalDivisors}. Find the natural number n.`;

  return {
    prompt: promptKo,
    promptEn,
    expression: `약수의 개수: ${totalDivisors}개`,
    answer: String(targetN),
    explanation: `약수의 개수는 각 소인수의 (지수 + 1)의 곱이므로, (${e1} + 1) × (1 + 1) × (n + 1) = ${totalDivisors}입니다. 즉 ${ (e1 + 1) * 2 } × (n + 1) = ${totalDivisors}에서 n + 1 = ${targetN + 1}, 따라서 n = ${targetN}입니다.`,
  };
}

// 3. 약수 중 두 번째로 작은 수와 두 번째로 큰 수 (RPM p.15 #77)
export function rpmPrimeRankDivisors(random) {
  const p1 = pick(random, [2, 3]);
  const p2 = pick(random, [3, 5, 7]);
  const e1 = ri(random, 1, 3);
  const e2 = ri(random, 1, 2);
  const n = (p1 ** e1) * (p2 ** e2);
  const smallestPrime = Math.min(p1, p2);
  const secondSmallest = smallestPrime;
  const secondLargest = n / smallestPrime;
  const ans = secondSmallest + secondLargest;

  const promptKo = `${n}의 약수 중 두 번째로 작은 수를 a, 두 번째로 큰 수를 b라 할 때, a + b의 값을 구하시오.`;
  const promptEn = `Let a be the second smallest divisor of ${n}, and b be the second largest divisor of ${n}. Find a + b.`;

  return {
    prompt: promptKo,
    promptEn,
    expression: `${n}의 약수`,
    answer: String(ans),
    explanation: `${n}의 약수 중 가장 작은 수는 1이고, 두 번째로 작은 수는 가장 작은 소인수인 ${secondSmallest}(= a)입니다. 가장 큰 약수는 ${n}이고, 두 번째로 큰 수는 ${n} ÷ ${secondSmallest} = ${secondLargest}(= b)입니다. 따라서 a + b = ${secondSmallest} + ${secondLargest} = ${ans}입니다.`,
  };
}

// 4. 소인수분해 종합 응용
export function rpmPrimeFactorizationMixed(random) {
  const fn = pick(random, [rpmPrimeMakeSquare, rpmPrimeDivisorCountReverse, rpmPrimeRankDivisors]);
  return fn(random);
}

// -------------------------------------------------------------
// CHAPTER 02: 최대공약수와 최소공배수 응용 (GCD & LCM Applied)
// -------------------------------------------------------------

// 1. A * B = G * L 및 두 자리 자연수 A + B 역추적 (RPM p.21 #138, p.31 #209)
export function rpmGcdLcmReverseProduct(random) {
  const g = pick(random, [4, 6, 8, 12]);
  const [aFactor, bFactor] = pick(random, [[3, 5], [4, 7], [3, 8], [5, 7]]);
  const A = g * aFactor;
  const B = g * bFactor;
  const product = A * B;
  const l = g * aFactor * bFactor;
  const ans = A + B;

  const promptKo = `두 자리의 자연수 A, B에 대하여 두 수의 곱이 ${product}이고 최대공약수가 ${g}일 때, A + B의 값을 구하시오.`;
  const promptEn = `Two 2-digit natural numbers A and B have a product of ${product} and a greatest common factor of ${g}. Find the value of A + B.`;

  return {
    prompt: promptKo,
    promptEn,
    expression: `A × B = ${product}, G = ${g}`,
    answer: String(ans),
    explanation: `두 수의 곱 = 최대공약수 × 최소공배수이므로 최소공배수 L = ${product} ÷ ${g} = ${l}입니다. A = ${g}a, B = ${g}b (a, b는 서로소)라 하면 ${g} × a × b = ${l}, 즉 a × b = ${aFactor * bFactor}입니다. A, B가 모두 두 자리 자연수이므로 a = ${Math.min(aFactor, bFactor)}, b = ${Math.max(aFactor, bFactor)}일 때 A = ${Math.min(A, B)}, B = ${Math.max(A, B)}입니다. 따라서 A + B = ${ans}입니다.`,
  };
}

// 2. 두 분수를 모두 자연수로 만드는 가장 작은 기약분수 (RPM p.23 #151)
export function rpmGcdLcmFractions(random) {
  const n1 = pick(random, [12, 14, 16, 18]);
  const d1 = pick(random, [25, 35, 45]);
  const n2 = pick(random, [8, 10, 20]);
  const d2 = pick(random, [15, 21, 27]);

  // To make (n1/d1) * (N/D) natural: N must be multiple of d1, d2 (LCM(d1, d2)), D must be divisor of n1, n2 (GCD(n1, n2))
  const num = lcm(d1, d2);
  const den = gcd(n1, n2);
  const g = gcd(num, den);
  const simpleNum = num / g;
  const simpleDen = den / g;
  const ans = simpleDen === 1 ? String(simpleNum) : `${simpleNum}/${simpleDen}`;

  const promptKo = `두 분수 ${n1}/${d1}과 ${n2}/${d2}의 어느 것에 곱하여도 그 결과가 자연수가 되게 하는 가장 작은 기약분수를 구하시오.`;
  const promptEn = `Find the smallest irreducible fraction that yields a natural number when multiplied by either ${n1}/${d1} or ${n2}/${d2}.`;

  return {
    prompt: promptKo,
    promptEn,
    expression: `${n1}/${d1} × (N/D) = 자연수, ${n2}/${d2} × (N/D) = 자연수`,
    answer: ans,
    explanation: `곱하여 자연수가 되려면 분자 N은 분모 ${d1}, ${d2}의 최소공배수이어야 하고, 분모 D는 분자 ${n1}, ${n2}의 최대공약수이어야 합니다. N = LCM(${d1}, ${d2}) = ${num}, D = GCD(${n1}, ${n2}) = ${den}이므로 가장 작은 기약분수는 ${ans}입니다.`,
  };
}

// 3. 네온사인 점등/신호등 주기 동시 켜짐 (RPM p.31 #205)
export function rpmLcmNeonCycle(random) {
  const [onA, offA] = pick(random, [[14, 2], [18, 2], [20, 4]]);
  const [onB, offB] = pick(random, [[17, 3], [16, 4], [25, 5]]);
  const periodA = onA + offA;
  const periodB = onB + offB;
  const cycleLcm = lcm(periodA, periodB);

  const promptKo = `어느 상가에서 네온사인 A는 ${onA}초 켜져 있다가 ${offA}초 꺼지고, 네온사인 B는 ${onB}초 켜져 있다가 ${offB}초 꺼집니다. 두 네온사인이 동시에 켜진 후, 처음으로 다시 동시에 켜질 때까지 걸리는 시간(초)을 구하시오.`;
  const promptEn = `Neon light A stays on for ${onA}s and off for ${offA}s. Neon light B stays on for ${onB}s and off for ${offB}s. If both turn on simultaneously, how many seconds later will they next turn on together?`;

  return {
    prompt: promptKo,
    promptEn,
    expression: `A 주기: ${periodA}초, B 주기: ${periodB}초`,
    answer: String(cycleLcm),
    answerSuffix: '초',
    explanation: `네온사인 A가 다시 켜지는 주기는 ${onA} + ${offA} = ${periodA}초이고, B가 다시 켜지는 주기는 ${onB} + ${offB} = ${periodB}초입니다. 따라서 두 네온사인이 다시 동시에 켜지는 주기는 ${periodA}와 ${periodB}의 최소공배수인 ${cycleLcm}초 후입니다.`,
  };
}

// 4. 나머지가 남는 어떤 수 중 가장 큰 수 (RPM p.29 #194)
export function rpmGcdRemainder(random) {
  const g = pick(random, [6, 8, 9, 12, 14]);
  const q1 = ri(random, 3, 6);
  const q2 = ri(random, 7, 10);
  const r1 = ri(random, 2, g - 2);
  const r2 = ri(random, 1, g - 2);
  const num1 = g * q1 + r1;
  const num2 = g * q2 + r2;

  const promptKo = `어떤 자연수로 ${num1}을 나누면 ${r1}이 남고, ${num2}를 나누면 ${r2}가 남는다고 합니다. 이러한 자연수 중에서 가장 큰 수를 구하시오.`;
  const promptEn = `When divided into ${num1}, a certain natural number leaves a remainder of ${r1}; divided into ${num2}, it leaves a remainder of ${r2}. Find the greatest such natural number.`;

  return {
    prompt: promptKo,
    promptEn,
    expression: `${num1} ÷ N = q₁ ... ${r1}, ${num2} ÷ N = q₂ ... ${r2}`,
    answer: String(g),
    explanation: `구하는 수는 ${num1} - ${r1} = ${num1 - r1}과 ${num2} - ${r2} = ${num2 - r2}의 공약수 중 ${Math.max(r1, r2)}보다 큰 수입니다. 가장 큰 수는 두 수의 최대공약수인 ${g}입니다.`,
  };
}

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

// 2. 수직선에서 두 점으로부터 같은 거리에 있는 점 (RPM p.47 #333)
export function rpmRationalEquidistant(random) {
  const p1 = pick(random, [-6, -5, -4, -3, -2]);
  const p2 = pick(random, [2, 4, 6, 8]);
  const sum = p1 + p2;
  const g = gcd(sum, 2);
  const num = sum / g;
  const den = 2 / g;
  const ans = den === 1 ? String(num) : `${num}/${den}`;

  const diagram = {
    kind: 'rpm-number-line',
    min: p1 - 1,
    max: p2 + 1,
    step: 2,
    points: [
      { val: p1, label: `${p1}` },
      { val: p2, label: `${p2}` },
      { val: sum / 2, label: 'P', highlight: true },
    ],
  };

  const promptKo = `수직선 위에서 두 수 ${p1}와 ${p2}를 나타내는 두 점으로부터 같은 거리에 있는 점이 나타내는 수를 구하시오.`;
  const promptEn = `Find the number represented by the point equidistant from the points representing ${p1} and ${p2} on the number line.`;

  return {
    prompt: promptKo,
    promptEn,
    expression: `중점 P = (${p1} + ${p2}) / 2`,
    answer: ans,
    diagram,
    explanation: `두 점으로부터 같은 거리에 있는 점은 두 수의 한가운데 점(평균)이므로 (${p1} + ${p2}) ÷ 2 = ${ans}입니다.`,
  };
}

// 3. 절댓값 조건식과 정수의 개수 (RPM p.71 #538)
export function rpmRationalAbsoluteCount(random) {
  const aBase = pick(random, [3, 4, 5]);
  const bBase = pick(random, [2, 3, 4]);
  // a is -aBase - 1/2, b is bBase - 1/3
  const minInt = -aBase;
  const maxInt = bBase - 1;
  const count = maxInt - minInt + 1;

  const promptKo = `-${aBase}보다 -1/2만큼 큰 수를 a, ${bBase}보다 -1/3만큼 큰 수를 b라 할 때, a < x < b를 만족시키는 정수 x의 개수를 구하시오.`;
  const promptEn = `Let a be the number 1/2 greater than -${aBase} (i.e. -${aBase} - 1/2), and b be the number -1/3 greater than ${bBase}. How many integers x satisfy a < x < b?`;

  return {
    prompt: promptKo,
    promptEn,
    expression: `a = -${aBase} - 1/2, b = ${bBase} - 1/3`,
    answer: String(count),
    answerSuffix: '개',
    explanation: `a = -${aBase} - 0.5 = -${aBase + 0.5}, b = ${bBase} - 1/3 ≈ ${bBase - 0.33}입니다. 따라서 -${aBase + 0.5} < x < ${bBase - 0.33}을 만족시키는 정수 x는 -${aBase}부터 ${maxInt}까지 총 ${count}개입니다.`,
  };
}

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
  // 01 소인수분해
  'prime-composite': rpmPrimeFactorizationMixed,
  'powers': rpmPrimeFactorizationMixed,
  'power-form': rpmPrimeFactorizationMixed,
  'prime-factorization': rpmPrimeMakeSquare,
  'all-divisors': rpmPrimeRankDivisors,
  'divisor-count': rpmPrimeDivisorCountReverse,
  'prime-mixed': rpmPrimeFactorizationMixed,

  // 02 최대공약수와 최소공배수
  'common-divisors-gcd': rpmGcdRemainder,
  'gcd-basic': rpmGcdRemainder,
  'gcd-prime-form': rpmGcdLcmReverseProduct,
  'coprime': rpmGcdLcmReverseProduct,
  'common-multiples-lcm': rpmGcdLcmFractions,
  'lcm-basic': rpmLcmNeonCycle,
  'lcm-prime-form': rpmGcdLcmFractions,
  'gcd-lcm-relation': rpmGcdLcmReverseProduct,
  'gcd-lcm-application': rpmLcmNeonCycle,
  'gcd-lcm-mixed': (r) => pick(r, [rpmGcdLcmReverseProduct, rpmGcdLcmFractions, rpmLcmNeonCycle, rpmGcdRemainder])(r),

  // 03 정수와 유리수 & 04 정수와 유리수의 계산
  'positive-negative': rpmRationalAbsoluteCount,
  'integer-classification': rpmRationalAbsoluteCount,
  'rational-classification': rpmRationalAbsoluteCount,
  'number-line': rpmRationalLineDivision,
  'absolute-value': rpmRationalEquidistant,
  'number-comparison': rpmRationalAbsoluteCount,
  'inequality-expression': rpmRationalAbsoluteCount,
  'integer-solutions': rpmRationalAbsoluteCount,
  'integer-rational-mixed': (r) => pick(r, [rpmRationalLineDivision, rpmRationalEquidistant, rpmRationalAbsoluteCount])(r),
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
