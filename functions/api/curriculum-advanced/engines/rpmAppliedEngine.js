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

const tx = (profile, ko, en) => (profile?.locale === 'ko' ? ko : en || ko);

// -------------------------------------------------------------
// 01: 소인수분해 응용
// -------------------------------------------------------------
function rpmPrimeMakeSquare(random, profile) {
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

  return {
    prompt: tx(profile,
      `${n}에 가능한 한 가장 작은 자연수 x를 곱하여 어떤 자연수 y의 제곱이 되도록 할 때, ${askSum ? 'x + y의 값' : '가장 작은 자연수 x의 값'}을 구하시오.`,
      `Multiply ${n} by the smallest natural number x so that the result is the square of a natural number y. Find ${askSum ? 'x + y' : 'the smallest natural number x'}.`),
    expression: `${n} × x = y^2`,
    answer: String(askSum ? x + y : x),
    explanation: tx(profile,
      `${n}을 소인수분해하면 ${factorText(factors)}입니다. 제곱수가 되려면 모든 소인수의 지수가 짝수이어야 하므로 x = ${x}입니다. 이때 y² = ${y}²이므로 y = ${y}입니다. 따라서 ${askSum ? `x + y = ${x + y}` : `x = ${x}`}입니다.`,
      `Factoring ${n} gives ${factorText(factors)}. For a square, all exponents must be even, so x = ${x}. Then y = ${y}, so ${askSum ? `x + y = ${x + y}` : `x = ${x}`}.`),
  };
}

function rpmPrimeDivisorCountReverse(random, profile) {
  const p1 = pick(random, [2, 3]);
  const p2 = p1 === 2 ? 3 : 5;
  const p3 = p2 === 3 ? 5 : 7;
  const e1 = ri(random, 2, 4);
  const targetN = ri(random, 1, 4);
  const totalDivisors = (e1 + 1) * 2 * (targetN + 1);

  return {
    prompt: tx(profile,
      `${p1}^${e1} × ${p2} × ${p3}^n의 약수의 개수가 ${totalDivisors}개일 때, 자연수 n의 값을 구하시오.`,
      `The number of divisors of ${p1}^${e1} × ${p2} × ${p3}^n is ${totalDivisors}. Find natural number n.`),
    expression: `약수의 개수: ${totalDivisors}개`,
    answer: String(targetN),
    explanation: tx(profile,
      `약수의 개수는 (${e1}+1)×(1+1)×(n+1) = ${totalDivisors}에서 n = ${targetN}입니다.`,
      `Divisors count = (${e1}+1)(2)(n+1) = ${totalDivisors}, hence n = ${targetN}.`),
  };
}

function rpmPrimeRankDivisors(random, profile) {
  const p1 = pick(random, [2, 3]);
  const p2 = pick(random, [3, 5, 7]);
  const e1 = ri(random, 1, 3);
  const e2 = ri(random, 1, 2);
  const n = (p1 ** e1) * (p2 ** e2);
  const smallestPrime = Math.min(p1, p2);
  const secondSmallest = smallestPrime;
  const secondLargest = n / smallestPrime;
  const ans = secondSmallest + secondLargest;

  return {
    prompt: tx(profile,
      `${n}의 약수 중 두 번째로 작은 수를 a, 두 번째로 큰 수를 b라 할 때, a + b의 값을 구하시오.`,
      `Let a be the second smallest divisor of ${n}, and b be the second largest. Find a + b.`),
    expression: `${n}의 약수`,
    answer: String(ans),
    explanation: tx(profile,
      `두 번째로 작은 약수는 ${secondSmallest}, 두 번째로 큰 약수는 ${secondLargest}이므로 a + b = ${ans}입니다.`,
      `The second smallest divisor is ${secondSmallest}, second largest is ${secondLargest}, so a + b = ${ans}.`),
  };
}

// -------------------------------------------------------------
// 02: 최대공약수와 최소공배수 응용
// -------------------------------------------------------------
function rpmGcdLcmReverseProduct(random, profile) {
  const g = pick(random, [4, 6, 8, 12]);
  const [aFactor, bFactor] = pick(random, [[3, 5], [4, 7], [3, 8], [5, 7]]);
  const A = g * aFactor;
  const B = g * bFactor;
  const product = A * B;
  const l = g * aFactor * bFactor;
  const ans = A + B;

  return {
    prompt: tx(profile,
      `두 자리의 자연수 A, B에 대하여 두 수의 곱이 ${product}이고 최대공약수가 ${g}일 때, A + B의 값을 구하시오.`,
      `Two 2-digit natural numbers A and B have product ${product} and GCF ${g}. Find A + B.`),
    expression: `A × B = ${product}, G = ${g}`,
    answer: String(ans),
    explanation: tx(profile,
      `최소공배수는 ${product} ÷ ${g} = ${l}입니다. A = ${Math.min(A, B)}, B = ${Math.max(A, B)}이므로 A + B = ${ans}입니다.`,
      `LCM = ${l}. The 2-digit numbers are ${A} and ${B}, giving A + B = ${ans}.`),
  };
}

function rpmGcdLcmFractions(random, profile) {
  const n1 = pick(random, [12, 14, 16, 18]);
  const d1 = pick(random, [25, 35, 45]);
  const n2 = pick(random, [8, 10, 20]);
  const d2 = pick(random, [15, 21, 27]);
  const num = lcm(d1, d2);
  const den = gcd(n1, n2);
  const g = gcd(num, den);
  const simpleNum = num / g;
  const simpleDen = den / g;
  const ans = simpleDen === 1 ? String(simpleNum) : `${simpleNum}/${simpleDen}`;

  return {
    prompt: tx(profile,
      `두 분수 ${n1}/${d1}과 ${n2}/${d2}의 어느 것에 곱하여도 그 결과가 자연수가 되게 하는 가장 작은 기약분수를 구하시오.`,
      `Find the smallest irreducible fraction that yields a natural number when multiplied by either ${n1}/${d1} or ${n2}/${d2}.`),
    expression: `${n1}/${d1} × (N/D) = 자연수, ${n2}/${d2} × (N/D) = 자연수`,
    answer: ans,
    explanation: tx(profile,
      `분자 N = LCM(${d1}, ${d2}) = ${num}, 분모 D = GCD(${n1}, ${n2}) = ${den}이므로 기약분수는 ${ans}입니다.`,
      `Numerator N = LCM(${d1}, ${d2}) = ${num}, denominator D = GCD(${n1}, ${n2}) = ${den}, yielding ${ans}.`),
  };
}

function rpmLcmNeonCycle(random, profile) {
  const [onA, offA] = pick(random, [[14, 2], [18, 2], [20, 4]]);
  const [onB, offB] = pick(random, [[17, 3], [16, 4], [25, 5]]);
  const periodA = onA + offA;
  const periodB = onB + offB;
  const cycleLcm = lcm(periodA, periodB);

  return {
    prompt: tx(profile,
      `네온사인 A는 ${onA}초 켜지고 ${offA}초 꺼지며, B는 ${onB}초 켜지고 ${offB}초 꺼집니다. 동시에 켜진 후 다시 처음으로 동시에 켜질 때까지 걸리는 시간(초)을 구하시오.`,
      `Light A is on for ${onA}s/off for ${offA}s, light B is on for ${onB}s/off for ${offB}s. If both turn on now, how many seconds later will they next turn on together?`),
    expression: `A 주기: ${periodA}초, B 주기: ${periodB}초`,
    answer: String(cycleLcm),
    answerSuffix: '초',
    explanation: tx(profile,
      `A의 주기 ${periodA}초와 B의 주기 ${periodB}초의 최소공배수인 ${cycleLcm}초 후입니다.`,
      `The LCM of periods ${periodA}s and ${periodB}s is ${cycleLcm}s.`),
  };
}

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
  'prime-composite': rpmPrimeMakeSquare,
  'powers': rpmPrimeDivisorCountReverse,
  'power-form': rpmPrimeMakeSquare,
  'prime-factorization': rpmPrimeMakeSquare,
  'all-divisors': rpmPrimeRankDivisors,
  'divisor-count': rpmPrimeDivisorCountReverse,
  'prime-mixed': (r, p) => pick(r, [rpmPrimeMakeSquare, rpmPrimeDivisorCountReverse, rpmPrimeRankDivisors])(r, p),

  'common-divisors-gcd': rpmGcdLcmReverseProduct,
  'gcd-basic': rpmGcdLcmReverseProduct,
  'gcd-prime-form': rpmGcdLcmReverseProduct,
  'coprime': rpmGcdLcmReverseProduct,
  'common-multiples-lcm': rpmGcdLcmFractions,
  'lcm-basic': rpmLcmNeonCycle,
  'lcm-prime-form': rpmGcdLcmFractions,
  'gcd-lcm-relation': rpmGcdLcmReverseProduct,
  'gcd-lcm-application': rpmLcmNeonCycle,
  'gcd-lcm-mixed': (r, p) => pick(r, [rpmGcdLcmReverseProduct, rpmGcdLcmFractions, rpmLcmNeonCycle])(r, p),

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
