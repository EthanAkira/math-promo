// @ts-check
/**
 * Eureka Math / EngageNY Grade 6 Problem Generation Engine
 * Covers Modules 1 to 6 (40 Generator Units):
 *   Module 1: Ratios and Unit Rates (7 units)
 *   Module 2: Arithmetic Operations Including Division of Fractions (8 units)
 *   Module 3: Rational Numbers (7 units)
 *   Module 4: Expressions and Equations (9 units)
 *   Module 5: Area, Surface Area, and Volume Problems (5 units)
 *   Module 6: Statistics (4 units)
 */

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

function lcm(a, b) {
  return (Math.abs(a * b)) / gcd(a, b);
}

function simplifyFraction(n, d) {
  if (d < 0) {
    n = -n;
    d = -d;
  }
  const g = gcd(n, d);
  const sn = n / g;
  const sd = d / g;
  if (sd === 1) return `${sn}`;
  return `${sn}/${sd}`;
}

function randomInt(r, min, max) {
  return Math.floor(r() * (max - min + 1)) + min;
}

function pick(r, arr) {
  return arr[Math.floor(r() * arr.length)];
}

function roundTo(val, decimals = 2) {
  const factor = Math.pow(10, decimals);
  return Math.round(val * factor) / factor;
}

/* =========================================================================
   MODULE 1: RATIOS AND UNIT RATES
   ========================================================================= */

/**
 * 1. g6e-m1a-ratios
 * Understanding ratios and equivalent ratios (A:B)
 */
export function generateM1aRatios(random) {
  const mode = randomInt(random, 0, 2);
  if (mode === 0) {
    // Simplify ratio
    const f1 = randomInt(random, 2, 9);
    const f2 = randomInt(random, 2, 9);
    const k = randomInt(random, 2, 8);
    const g = gcd(f1, f2);
    const a = (f1 / g) * k;
    const b = (f2 / g) * k;
    const sa = f1 / g;
    const sb = f2 / g;
    return {
      kind: 'word',
      prompt: `두 수의 비 ${a} : ${b}를 가장 간단한 자연수의 비로 나타내세요. (예: 3:4)`,
      promptEn: `Express the ratio ${a} : ${b} in simplest form. (e.g. 3:4)`,
      expression: `${a} : ${b}`,
      expressionEn: `${a} : ${b}`,
      answer: `${sa}:${sb}`,
      answerSuffix: '',
    };
  }
  if (mode === 1) {
    // Part to whole ratio
    const boys = randomInt(random, 10, 18);
    const girls = randomInt(random, 10, 18);
    const total = boys + girls;
    const g = gcd(boys, total);
    const sBoys = boys / g;
    const sTotal = total / g;
    return {
      kind: 'word',
      prompt: `어느 반에 남학생 ${boys}명, 여학생 ${girls}명이 있습니다. 전체 학생 수에 대한 남학생 수의 비를 가장 간단한 자연수의 비로 구하세요. (예: 3:7)`,
      promptEn: `A class has ${boys} boys and ${girls} girls. What is the ratio of boys to total students in simplest form? (e.g. 3:7)`,
      expression: `${boys} / (${boys} + ${girls})`,
      expressionEn: `${boys} / (${boys} + ${girls})`,
      answer: `${sBoys}:${sTotal}`,
      answerSuffix: '',
    };
  }
  // Recipe scaling
  const a = randomInt(random, 2, 5);
  const b = randomInt(random, 3, 7);
  const mult = randomInt(random, 3, 8);
  const givenA = a * mult;
  const targetB = b * mult;
  return {
    kind: 'word',
    prompt: `주스 레시피에서 원액과 물의 비는 ${a} : ${b}입니다. 원액을 ${givenA}mL 넣었다면 물은 몇 mL 넣어야 할까요?`,
    promptEn: `In a juice recipe, the ratio of concentrate to water is ${a} : ${b}. If ${givenA} mL of concentrate is used, how many mL of water are needed?`,
    expression: `${a} : ${b} = ${givenA} : □`,
    expressionEn: `${a} : ${b} = ${givenA} : □`,
    answer: String(targetB),
    answerSuffix: 'mL',
  };
}

/**
 * 2. g6e-m1b-ratio-tables
 * Ratio tables and double number lines
 */
export function generateM1bRatioTables(random) {
  const baseA = randomInt(random, 2, 6);
  const baseB = randomInt(random, 3, 9);
  const scales = [1, 2, 3, 5, 8];
  const missingIdx = randomInt(random, 2, 4);
  const missingScale = scales[missingIdx];
  const isA = random() < 0.5;

  let tableA = scales.map((s, i) => (i === missingIdx && isA ? '□' : s * baseA));
  let tableB = scales.map((s, i) => (i === missingIdx && !isA ? '□' : s * baseB));
  const answerVal = isA ? missingScale * baseA : missingScale * baseB;

  return {
    kind: 'word',
    prompt: `다음 비 표에서 빈칸 □에 들어갈 알맞은 수를 구하세요.\n[x]: ${tableA.join(', ')}\n[y]: ${tableB.join(', ')}`,
    promptEn: `Find the value of □ in the ratio table.\n[x]: ${tableA.join(', ')}\n[y]: ${tableB.join(', ')}`,
    expression: `${baseA} : ${baseB}`,
    expressionEn: `${baseA} : ${baseB}`,
    answer: String(answerVal),
    answerSuffix: '',
  };
}

/**
 * 3. g6e-m1b-ratio-graphs
 * Ratios on the coordinate plane & constant of proportionality
 */
export function generateM1bRatioGraphs(random) {
  const unitRate = randomInt(random, 3, 12);
  const x1 = randomInt(random, 2, 5);
  const y1 = x1 * unitRate;
  const x2 = randomInt(random, 6, 10);
  const y2 = x2 * unitRate;

  return {
    kind: 'word',
    prompt: `어떤 물건의 개수(x)와 가격(y)의 비를 나타내는 직선 그래프가 점 (${x1}, ${y1})을 지납니다. 물건 ${x2}개의 가격은 몇 원(달러)일까요?`,
    promptEn: `A linear graph representing the ratio of items (x) to total cost (y) passes through (${x1}, ${y1}). What is the cost for ${x2} items?`,
    expression: `y / x = ${y1} / ${x1}`,
    expressionEn: `y / x = ${y1} / ${x1}`,
    answer: String(y2),
    answerSuffix: '',
  };
}

/**
 * 4. g6e-m1c-unit-rates
 * Unit rates and unit pricing
 */
export function generateM1cUnitRates(random) {
  const mode = randomInt(random, 0, 1);
  if (mode === 0) {
    // Miles per gallon or km per hour
    const hours = randomInt(random, 3, 6);
    const speed = randomInt(random, 45, 75);
    const totalDist = hours * speed;
    return {
      kind: 'word',
      prompt: `자동차가 ${hours}시간 동안 일정한 속력으로 ${totalDist}km를 달렸습니다. 이 자동차의 시속은 몇 km일까요? (1시간당 달린 거리)`,
      promptEn: `A car travels ${totalDist} km in ${hours} hours at a constant speed. What is the unit rate in km per hour?`,
      expression: `${totalDist} ÷ ${hours}`,
      expressionEn: `${totalDist} ÷ ${hours}`,
      answer: String(speed),
      answerSuffix: 'km/h',
    };
  }
  // Unit price
  const count = randomInt(random, 4, 8);
  const unitPrice = roundTo(randomInt(random, 15, 45) / 10, 2); // 1.5 to 4.5
  const totalPrice = roundTo(count * unitPrice, 2);
  return {
    kind: 'word',
    prompt: `사과 ${count}개의 가격이 $${totalPrice.toFixed(2)}입니다. 사과 1개의 단위 가격은 얼마일까요?`,
    promptEn: `A pack of ${count} apples costs $${totalPrice.toFixed(2)}. What is the unit price per apple?`,
    expression: `$${totalPrice.toFixed(2)} ÷ ${count}`,
    expressionEn: `$${totalPrice.toFixed(2)} ÷ ${count}`,
    answer: String(unitPrice),
    answerSuffix: '$',
  };
}

/**
 * 5. g6e-m1c-speed-work-rates
 * Speed, work rates and measurement unit conversions
 */
export function generateM1cSpeedWorkRates(random) {
  const mode = randomInt(random, 0, 1);
  if (mode === 0) {
    // Work rate
    const minutes = randomInt(random, 3, 6);
    const pagesPerMin = randomInt(random, 12, 25);
    const totalPages = minutes * pagesPerMin;
    const targetMin = randomInt(random, 8, 15);
    const targetPages = targetMin * pagesPerMin;
    return {
      kind: 'word',
      prompt: `인쇄기가 ${minutes}분 동안 ${totalPages}쪽을 인쇄합니다. 같은 빠르기로 ${targetMin}분 동안 인쇄하면 모두 몇 쪽을 인쇄할 수 있을까요?`,
      promptEn: `A printer prints ${totalPages} pages in ${minutes} minutes. At this rate, how many pages can it print in ${targetMin} minutes?`,
      expression: `(${totalPages} ÷ ${minutes}) × ${targetMin}`,
      expressionEn: `(${totalPages} ÷ ${minutes}) × ${targetMin}`,
      answer: String(targetPages),
      answerSuffix: '쪽',
    };
  }
  // Rate conversion: m/s to m/min
  const speedSec = randomInt(random, 4, 15);
  const speedMin = speedSec * 60;
  return {
    kind: 'word',
    prompt: `초속 ${speedSec}m로 달리는 로봇이 있습니다. 이 로봇의 분속은 몇 m일까요? (1분당 이동 거리)`,
    promptEn: `A robot moves at a rate of ${speedSec} meters per second. What is its speed in meters per minute?`,
    expression: `${speedSec} × 60`,
    expressionEn: `${speedSec} × 60`,
    answer: String(speedMin),
    answerSuffix: 'm/min',
  };
}

/**
 * 6. g6e-m1d-percent-basics
 * Percent as rate per 100, fraction and decimal conversions
 */
export function generateM1dPercentBasics(random) {
  const mode = randomInt(random, 0, 2);
  if (mode === 0) {
    // Fraction to percent
    const denoms = [2, 4, 5, 10, 20, 25, 50];
    const d = pick(random, denoms);
    const n = randomInt(random, 1, d - 1);
    const pct = (n / d) * 100;
    return {
      kind: 'word',
      prompt: `분수 ${n}/${d}를 백분율(%)로 나타내세요. (숫자만 입력)`,
      promptEn: `Convert the fraction ${n}/${d} to a percent. (Enter number only)`,
      expression: `${n}/${d} × 100%`,
      expressionEn: `${n}/${d} × 100%`,
      answer: String(pct),
      answerSuffix: '%',
    };
  }
  if (mode === 1) {
    // Decimal to percent
    const pct = randomInt(random, 5, 95);
    const dec = (pct / 100).toFixed(2);
    return {
      kind: 'word',
      prompt: `소수 ${dec}를 백분율(%)로 나타내세요. (숫자만 입력)`,
      promptEn: `Convert the decimal ${dec} to a percent. (Enter number only)`,
      expression: `${dec} × 100%`,
      expressionEn: `${dec} × 100%`,
      answer: String(pct),
      answerSuffix: '%',
    };
  }
  // Percent to simplest fraction
  const pcts = [20, 25, 40, 50, 60, 75, 80];
  const p = pick(random, pcts);
  const g = gcd(p, 100);
  const frac = `${p / g}/${100 / g}`;
  return {
    kind: 'word',
    prompt: `백분율 ${p}%를 가장 간단한 기약분수로 나타내세요. (예: 3/4)`,
    promptEn: `Write ${p}% as a fraction in simplest form. (e.g. 3/4)`,
    expression: `${p}% = ${p}/100`,
    expressionEn: `${p}% = ${p}/100`,
    answer: frac,
    answerSuffix: '',
  };
}

/**
 * 7. g6e-m1d-percent-problems
 * Finding percent of a quantity and the whole
 */
export function generateM1dPercentProblems(random) {
  const mode = randomInt(random, 0, 1);
  if (mode === 0) {
    // Percent of a quantity
    const pct = pick(random, [10, 15, 20, 25, 30, 40, 50, 75]);
    const whole = randomInt(random, 2, 10) * (100 / gcd(pct, 100));
    const part = (pct / 100) * whole;
    return {
      kind: 'word',
      prompt: `${whole}의 ${pct}%는 얼마일까요?`,
      promptEn: `What is ${pct}% of ${whole}?`,
      expression: `${whole} × ${pct}%`,
      expressionEn: `${whole} × ${pct}%`,
      answer: String(part),
      answerSuffix: '',
    };
  }
  // Find the whole: X is P% of what number?
  const pct = pick(random, [20, 25, 30, 40, 50, 60, 75, 80]);
  const whole = randomInt(random, 2, 8) * 50;
  const part = (pct / 100) * whole;
  return {
    kind: 'word',
    prompt: `어떤 수의 ${pct}%가 ${part}일 때, 이 어떤 수는 얼마일까요?`,
    promptEn: `${part} is ${pct}% of what number?`,
    expression: `${part} ÷ ${pct}%`,
    expressionEn: `${part} ÷ ${pct}%`,
    answer: String(whole),
    answerSuffix: '',
  };
}

/* =========================================================================
   MODULE 2: ARITHMETIC OPERATIONS INCLUDING DIVISION OF FRACTIONS
   ========================================================================= */

/**
 * 8. g6e-m2a-fraction-division-models
 * Fraction division visual models ("how many C/D in A/B?")
 */
export function generateM2aFractionDivisionModels(random) {
  const d2 = pick(random, [4, 6, 8, 10, 12]);
  const c = 1; // unit fraction or small divisor
  const count = randomInt(random, 2, 6);
  // a/b = count * (c / d2)
  const g = gcd(count * c, d2);
  const n1 = (count * c) / g;
  const d1 = d2 / g;

  return {
    kind: 'word',
    prompt: `길이가 ${n1}/${d1}m인 끈을 ${c}/${d2}m씩 자르면 모두 몇 도막을 만들 수 있을까요?`,
    promptEn: `A piece of rope of length ${n1}/${d1} m is cut into pieces of ${c}/${d2} m each. How many pieces can be made?`,
    expression: `${n1}/${d1} ÷ ${c}/${d2}`,
    expressionEn: `${n1}/${d1} ÷ ${c}/${d2}`,
    answer: String(count),
    answerSuffix: '도막',
  };
}

/**
 * 9. g6e-m2a-fraction-division-algorithm
 * Dividing fractions & mixed numbers
 */
export function generateM2aFractionDivisionAlgorithm(random) {
  const n1 = randomInt(random, 2, 7);
  const d1 = randomInt(random, 3, 9);
  const n2 = randomInt(random, 1, 5);
  const d2 = randomInt(random, 2, 8);

  const finalNum = n1 * d2;
  const finalDen = d1 * n2;
  const ans = simplifyFraction(finalNum, finalDen);

  return {
    kind: 'inline',
    prompt: `다음 분수 나눗셈을 계산하여 기약분수로 나타내세요. (예: 5/4 또는 3)`,
    promptEn: `Calculate the quotient in simplest form. (e.g. 5/4 or 3)`,
    expression: `${n1}/${d1} ÷ ${n2}/${d2}`,
    expressionEn: `${n1}/${d1} ÷ ${n2}/${d2}`,
    answer: ans,
    answerSuffix: '',
  };
}

/**
 * 10. g6e-m2a-fraction-div-word-problems
 * Multi-step fraction division word problems
 */
export function generateM2aFractionDivWordProblems(random) {
  const batches = randomInt(random, 3, 8);
  const unitNum = pick(random, [1, 3]);
  const unitDen = 4; // 1/4 or 3/4
  const totalNum = batches * unitNum;
  const g = gcd(totalNum, unitDen);
  const sNum = totalNum / g;
  const sDen = unitDen / g;

  const fracStr = sDen === 1 ? `${sNum}` : `${sNum}/${sDen}`;

  return {
    kind: 'word',
    prompt: `쿠키 1판을 굽는 데 밀가루가 ${unitNum}/${unitDen}컵 필요합니다. 밀가루가 모두 ${fracStr}컵 있다면 쿠키를 몇 판 구울 수 있을까요?`,
    promptEn: `A recipe requires ${unitNum}/${unitDen} cup of flour for one batch of cookies. If you have ${fracStr} cups of flour, how many batches can you bake?`,
    expression: `${fracStr} ÷ ${unitNum}/${unitDen}`,
    expressionEn: `${fracStr} ÷ ${unitNum}/${unitDen}`,
    answer: String(batches),
    answerSuffix: '판',
  };
}

/**
 * 11. g6e-m2b-decimal-ops
 * Multi-digit decimal addition, subtraction, multiplication
 */
export function generateM2bDecimalOps(random) {
  const op = pick(random, ['+', '-', '×']);
  if (op === '+') {
    const a = roundTo(randomInt(random, 120, 850) / 100, 2);
    const b = roundTo(randomInt(random, 1100, 4500) / 1000, 3);
    const ans = roundTo(a + b, 3);
    return {
      kind: 'inline',
      prompt: `다음을 계산하세요.`,
      promptEn: `Calculate the sum.`,
      expression: `${a} + ${b}`,
      expressionEn: `${a} + ${b}`,
      answer: String(ans),
      answerSuffix: '',
    };
  }
  if (op === '-') {
    const b = roundTo(randomInt(random, 150, 450) / 100, 2);
    const a = roundTo(b + randomInt(random, 200, 600) / 100, 2);
    const ans = roundTo(a - b, 2);
    return {
      kind: 'inline',
      prompt: `다음을 계산하세요.`,
      promptEn: `Calculate the difference.`,
      expression: `${a} - ${b}`,
      expressionEn: `${a} - ${b}`,
      answer: String(ans),
      answerSuffix: '',
    };
  }
  // Multiplication
  const a = roundTo(randomInt(random, 12, 45) / 10, 1);
  const b = roundTo(randomInt(random, 15, 65) / 10, 1);
  const ans = roundTo(a * b, 2);
  return {
    kind: 'inline',
    prompt: `다음을 계산하세요.`,
    promptEn: `Calculate the product.`,
    expression: `${a} × ${b}`,
    expressionEn: `${a} × ${b}`,
    answer: String(ans),
    answerSuffix: '',
  };
}

/**
 * 12. g6e-m2c-division-algorithm
 * Multi-digit division with decimal divisor
 */
export function generateM2cDivisionAlgorithm(random) {
  const divisor = pick(random, [0.4, 0.5, 0.6, 0.8, 1.2, 1.5, 2.5]);
  const quotient = randomInt(random, 12, 45);
  const dividend = roundTo(divisor * quotient, 2);

  return {
    kind: 'inline',
    prompt: `다음을 계산하세요.`,
    promptEn: `Calculate the quotient.`,
    expression: `${dividend} ÷ ${divisor}`,
    expressionEn: `${dividend} ÷ ${divisor}`,
    answer: String(quotient),
    answerSuffix: '',
  };
}

/**
 * 13. g6e-m2d-divisibility-rules
 * Divisibility rules (3, 4, 9)
 */
export function generateM2dDivisibilityRules(random) {
  const target = pick(random, [3, 9]);
  const d1 = randomInt(random, 1, 9);
  const d2 = randomInt(random, 0, 9);
  const d4 = randomInt(random, 0, 9);

  // find digit d3 (0..9) such that (d1 + d2 + d3 + d4) % target === 0
  const possible = [];
  for (let x = 0; x <= 9; x++) {
    if ((d1 + d2 + x + d4) % target === 0) possible.push(x);
  }
  const chosenX = pick(random, possible);

  return {
    kind: 'word',
    prompt: `네 자리 수 ${d1}${d2}□${d4}가 ${target}의 배수가 되도록 하는 한 자리 수 □ 중 가장 작은 수를 구하세요.`,
    promptEn: `Find the smallest single digit □ such that the four-digit number ${d1}${d2}□${d4} is divisible by ${target}.`,
    expression: `${d1}${d2}□${d4} mod ${target} = 0`,
    expressionEn: `${d1}${d2}□${d4} mod ${target} = 0`,
    answer: String(Math.min(...possible)),
    answerSuffix: '',
  };
}

/**
 * 14. g6e-m2d-gcf-lcm
 * GCF and LCM
 */
export function generateM2dGcfLcm(random) {
  const isGcf = random() < 0.5;
  const g = randomInt(random, 3, 12);
  const m1 = randomInt(random, 2, 6);
  let m2 = randomInt(random, 2, 7);
  while (gcd(m1, m2) !== 1) {
    m2++;
  }
  const a = g * m1;
  const b = g * m2;

  if (isGcf) {
    return {
      kind: 'inline',
      prompt: `두 수의 최대공약수(GCF)를 구하세요.`,
      promptEn: `Find the Greatest Common Factor (GCF) of the two numbers.`,
      expression: `GCF(${a}, ${b})`,
      expressionEn: `GCF(${a}, ${b})`,
      answer: String(g),
      answerSuffix: '',
    };
  }
  const ansLcm = g * m1 * m2;
  return {
    kind: 'inline',
    prompt: `두 수의 최소공배수(LCM)를 구하세요.`,
    promptEn: `Find the Least Common Multiple (LCM) of the two numbers.`,
    expression: `LCM(${a}, ${b})`,
    expressionEn: `LCM(${a}, ${b})`,
    answer: String(ansLcm),
    answerSuffix: '',
  };
}

/**
 * 15. g6e-m2d-euclidean-algorithm
 * Distributive property factoring and Euclidean Algorithm
 */
export function generateM2dEuclideanAlgorithm(random) {
  const g = pick(random, [4, 6, 8, 12, 14, 15]);
  const p1 = randomInt(random, 2, 5);
  let p2 = randomInt(random, 2, 6);
  while (gcd(p1, p2) !== 1) p2++;

  const a = g * p1;
  const b = g * p2;

  return {
    kind: 'word',
    prompt: `분배법칙을 이용하여 ${a} + ${b}를 GCF × (□ + △)의 꼴로 묶어 나타낼 때, 괄호 밖으로 묶어낼 수 있는 최대공약수(GCF)는 얼마일까요?`,
    promptEn: `Using the distributive property to express ${a} + ${b} as GCF × (□ + △), what is the greatest common factor (GCF) factored outside?`,
    expression: `${a} + ${b} = GCF × (${p1} + ${p2})`,
    expressionEn: `${a} + ${b} = GCF × (${p1} + ${p2})`,
    answer: String(g),
    answerSuffix: '',
  };
}

/* =========================================================================
   MODULE 3: RATIONAL NUMBERS
   ========================================================================= */

/**
 * 16. g6e-m3a-integers-opposites
 * Positive & negative numbers and opposites
 */
export function generateM3aIntegersOpposites(random) {
  const val = randomInt(random, 3, 35) * (random() < 0.5 ? 1 : -1);
  const mode = randomInt(random, 0, 1);
  if (mode === 0) {
    const opp = -val;
    return {
      kind: 'inline',
      prompt: `수 ${val}의 반대 부호인 수(반대수, Opposite)를 구하세요.`,
      promptEn: `Find the opposite of ${val}.`,
      expression: `-(${val})`,
      expressionEn: `-(${val})`,
      answer: String(opp),
      answerSuffix: '',
    };
  }
  // Elevation / temperature
  const start = -randomInt(random, 5, 20);
  const change = randomInt(random, 6, 25);
  const finalVal = start + change;
  return {
    kind: 'word',
    prompt: `어느 도시의 기온이 영상/영하 ${Math.abs(start)}℃ (${start}℃)였습니다. 기온이 ${change}℃ 상승했다면 현재 기온은 몇 ℃일까요?`,
    promptEn: `The temperature in a city was ${start}°C. If it increased by ${change}°C, what is the current temperature?`,
    expression: `${start} + ${change}`,
    expressionEn: `${start} + ${change}`,
    answer: String(finalVal),
    answerSuffix: '℃',
  };
}

/**
 * 17. g6e-m3a-rational-number-line
 * Rational numbers on number line & comparison
 */
export function generateM3aRationalNumberLine(random) {
  const a = -roundTo(randomInt(random, 15, 65) / 10, 1);
  let b = -roundTo(randomInt(random, 15, 65) / 10, 1);
  if (a === b) b -= 0.5;

  const ans = a > b ? '>' : '<';
  return {
    kind: 'inline',
    prompt: `두 유리수의 크기를 비교하여 빈칸 □에 알맞은 부등호 (>, <)를 입력하세요.`,
    promptEn: `Compare the two rational numbers and enter the correct inequality symbol (> or <).`,
    expression: `${a} □ ${b}`,
    expressionEn: `${a} □ ${b}`,
    answer: ans,
    answerSuffix: '',
  };
}

/**
 * 18. g6e-m3b-absolute-value
 * Absolute value and magnitude
 */
export function generateM3bAbsoluteValue(random) {
  const mode = randomInt(random, 0, 2);
  if (mode === 0) {
    const val = -randomInt(random, 4, 48);
    return {
      kind: 'inline',
      prompt: `다음 절댓값을 계산하세요.`,
      promptEn: `Evaluate the absolute value.`,
      expression: `|${val}|`,
      expressionEn: `|${val}|`,
      answer: String(Math.abs(val)),
      answerSuffix: '',
    };
  }
  if (mode === 1) {
    const val = -roundTo(randomInt(random, 15, 95) / 10, 1);
    return {
      kind: 'inline',
      prompt: `다음 절댓값을 계산하세요.`,
      promptEn: `Evaluate the absolute value.`,
      expression: `|${val}|`,
      expressionEn: `|${val}|`,
      answer: String(Math.abs(val)),
      answerSuffix: '',
    };
  }
  // Magnitude comparison: debt
  const d1 = randomInt(random, 25, 80);
  const d2 = randomInt(random, 25, 80);
  const higherDebt = Math.max(d1, d2);
  return {
    kind: 'word',
    prompt: `통장 잔고가 A는 -$${d1}, B는 -$${d2}입니다. 빚의 크기(절댓값)가 더 큰 쪽의 빚 금액은 얼마일까요? (숫자만 입력)`,
    promptEn: `Account A has a balance of -$${d1} and Account B has -$${d2}. What is the magnitude of the greater debt?`,
    expression: `max(|-${d1}|, |-${d2}|)`,
    expressionEn: `max(|-${d1}|, |-${d2}|)`,
    answer: String(higherDebt),
    answerSuffix: '$',
  };
}

/**
 * 19. g6e-m3b-inequalities-rational
 * Writing & interpreting inequality statements
 */
export function generateM3bInequalitiesRational(random) {
  const lower = -randomInt(random, 5, 10);
  const upper = randomInt(random, 1, 5);
  // Count integers satisfying lower < x <= upper
  const count = upper - lower;

  return {
    kind: 'word',
    prompt: `부등식 ${lower} < x ≤ ${upper}를 만족하는 정수 x는 모두 몇 개일까요?`,
    promptEn: `How many integers x satisfy the inequality ${lower} < x ≤ ${upper}?`,
    expression: `${lower} < x ≤ ${upper}`,
    expressionEn: `${lower} < x ≤ ${upper}`,
    answer: String(count),
    answerSuffix: '개',
  };
}

/**
 * 20. g6e-m3c-coordinate-plane-4quad
 * 4-Quadrant coordinate plane & identifying quadrants
 */
export function generateM3cCoordinatePlane4Quad(random) {
  const mode = randomInt(random, 0, 1);
  if (mode === 0) {
    const q = randomInt(random, 1, 4);
    let x = randomInt(random, 2, 8);
    let y = randomInt(random, 2, 8);
    if (q === 2) x = -x;
    if (q === 3) { x = -x; y = -y; }
    if (q === 4) y = -y;

    const qNamesKr = ['', '1', '2', '3', '4'];
    return {
      kind: 'word',
      prompt: `좌표평면 위의 점 (${x}, ${y})는 제몇 사분면에 위치할까요? (숫자 1, 2, 3, 4 중 하나만 입력)`,
      promptEn: `In which quadrant is the point (${x}, ${y}) located? (Enter 1, 2, 3, or 4)`,
      expression: `(${x}, ${y})`,
      expressionEn: `(${x}, ${y})`,
      answer: String(q),
      answerSuffix: '사분면',
    };
  }
  // Points on axes
  const isX = random() < 0.5;
  const nonZero = randomInt(random, 2, 9) * (random() < 0.5 ? 1 : -1);
  const pt = isX ? `(${nonZero}, 0)` : `(0, ${nonZero})`;
  const axis = isX ? 'x' : 'y';
  return {
    kind: 'word',
    prompt: `좌표평면 위의 점 ${pt}은 어느 축 위에 있을까요? (x 또는 y 입력)`,
    promptEn: `On which axis does the point ${pt} lie? (Enter x or y)`,
    expression: pt,
    expressionEn: pt,
    answer: axis,
    answerSuffix: '축',
  };
}

/**
 * 21. g6e-m3c-coordinate-symmetry
 * Reflections across x-axis, y-axis, and origin
 */
export function generateM3cCoordinateSymmetry(random) {
  const x = randomInt(random, 2, 9) * (random() < 0.5 ? 1 : -1);
  const y = randomInt(random, 2, 9) * (random() < 0.5 ? 1 : -1);
  const axis = pick(random, ['x축', 'y축']);

  let refX = x;
  let refY = y;
  if (axis === 'x축') {
    refY = -y;
  } else {
    refX = -x;
  }

  return {
    kind: 'word',
    prompt: `점 (${x}, ${y})를 ${axis}에 대하여 대칭이동한 점의 좌표를 (x, y) 형식으로 쓰세요.`,
    promptEn: `Find the coordinates of the reflection of (${x}, ${y}) across the ${axis === 'x축' ? 'x-axis' : 'y-axis'}. Format as (x, y).`,
    expression: `Reflection of (${x}, ${y}) over ${axis === 'x축' ? 'x-axis' : 'y-axis'}`,
    expressionEn: `Reflection of (${x}, ${y}) over ${axis === 'x축' ? 'x-axis' : 'y-axis'}`,
    answer: `(${refX}, ${refY})`,
    answerSuffix: '',
  };
}

/**
 * 22. g6e-m3c-coordinate-distance
 * Distance between points with the same coordinate
 */
export function generateM3cCoordinateDistance(random) {
  const isHorizontal = random() < 0.5;
  const common = randomInt(random, -8, 8);
  const v1 = randomInt(random, 1, 9);
  const v2 = -randomInt(random, 1, 9);
  const dist = Math.abs(v1 - v2);

  let p1, p2;
  if (isHorizontal) {
    p1 = `(${v1}, ${common})`;
    p2 = `(${v2}, ${common})`;
  } else {
    p1 = `(${common}, ${v1})`;
    p2 = `(${common}, ${v2})`;
  }

  return {
    kind: 'word',
    prompt: `좌표평면 위의 두 점 ${p1}과 ${p2} 사이의 거리를 구하세요.`,
    promptEn: `Find the distance between the two points ${p1} and ${p2} on the coordinate plane.`,
    expression: `Distance(${p1}, ${p2})`,
    expressionEn: `Distance(${p1}, ${p2})`,
    answer: String(dist),
    answerSuffix: '',
  };
}

/* =========================================================================
   MODULE 4: EXPRESSIONS AND EQUATIONS
   ========================================================================= */

/**
 * 23. g6e-m4a-exponents-order
 * Exponents and order of operations (PEMDAS)
 */
export function generateM4aExponentsOrder(random) {
  const base = pick(random, [2, 3, 4, 5]);
  const exp = base === 2 ? pick(random, [3, 4]) : 2;
  const powVal = Math.pow(base, exp);

  const mult = randomInt(random, 2, 4);
  const sub = randomInt(random, 1, 5);
  const add = randomInt(random, 5, 15);

  const expr = `${add} + ${mult} × (${base}^${exp} - ${sub})`;
  const ans = add + mult * (powVal - sub);

  return {
    kind: 'inline',
    prompt: `거듭제곱과 계산 순서에 유의하여 다음 식의 값을 구하세요.`,
    promptEn: `Evaluate the expression following the order of operations.`,
    expression: expr,
    expressionEn: expr,
    answer: String(ans),
    answerSuffix: '',
  };
}

/**
 * 24. g6e-m4b-algebraic-expressions
 * Writing & evaluating algebraic expressions
 */
export function generateM4bAlgebraicExpressions(random) {
  const a = randomInt(random, 2, 5);
  const b = randomInt(random, 3, 9);
  const x = randomInt(random, 3, 8);

  const ans = a * x + b;
  return {
    kind: 'word',
    prompt: `식 ${a}x + ${b}에서 x = ${x}일 때, 식의 값을 구하세요.`,
    promptEn: `Evaluate the expression ${a}x + ${b} when x = ${x}.`,
    expression: `${a}(${x}) + ${b}`,
    expressionEn: `${a}(${x}) + ${b}`,
    answer: String(ans),
    answerSuffix: '',
  };
}

/**
 * 25. g6e-m4b-distributive-factoring
 * Distributive property & factoring expressions
 */
export function generateM4bDistributiveFactoring(random) {
  const g = randomInt(random, 3, 8);
  const c1 = randomInt(random, 2, 5);
  let c2 = randomInt(random, 2, 6);
  while (gcd(c1, c2) !== 1) c2++;

  const a = g * c1;
  const b = g * c2;

  return {
    kind: 'word',
    prompt: `식 ${a}x + ${b}를 공통인수 GCF로 묶어 GCF × (${c1}x + □) 꼴로 인수분해할 때, 괄호 안의 빈칸 □에 들어갈 수는 얼마일까요?`,
    promptEn: `Factor the expression ${a}x + ${b} using the GCF to get GCF × (${c1}x + □). What number belongs in □?`,
    expression: `${a}x + ${b} = ${g}(${c1}x + □)`,
    expressionEn: `${a}x + ${b} = ${g}(${c1}x + □)`,
    answer: String(c2),
    answerSuffix: '',
  };
}

/**
 * 26. g6e-m4c-equivalent-expressions
 * Combining like terms
 */
export function generateM4cEquivalentExpressions(random) {
  const a1 = randomInt(random, 2, 7);
  const a2 = randomInt(random, 2, 6);
  const c1 = randomInt(random, 3, 9);
  const c2 = randomInt(random, 2, 8);

  const totalX = a1 + a2;
  const totalC = c1 + c2;

  return {
    kind: 'word',
    prompt: `동류항끼리 모아 식을 간단히 정리할 때, ${a1}x + ${c1} + ${a2}x + ${c2}에서 x의 계수는 얼마일까요?`,
    promptEn: `Simplify by combining like terms: ${a1}x + ${c1} + ${a2}x + ${c2}. What is the coefficient of x?`,
    expression: `${a1}x + ${c1} + ${a2}x + ${c2}`,
    expressionEn: `${a1}x + ${c1} + ${a2}x + ${c2}`,
    answer: String(totalX),
    answerSuffix: '',
  };
}

/**
 * 27. g6e-m4d-one-step-equations-add
 * One-step equations: addition and subtraction
 */
export function generateM4dOneStepEquationsAdd(random) {
  const isAdd = random() < 0.5;
  if (isAdd) {
    const a = randomInt(random, 12, 45);
    const x = randomInt(random, 15, 55);
    const b = x + a;
    return {
      kind: 'inline',
      prompt: `방정식을 풀어 x의 값을 구하세요.`,
      promptEn: `Solve the one-step equation for x.`,
      expression: `x + ${a} = ${b}`,
      expressionEn: `x + ${a} = ${b}`,
      answer: String(x),
      answerSuffix: '',
    };
  }
  const a = randomInt(random, 12, 45);
  const x = randomInt(random, 25, 75);
  const b = x - a;
  return {
    kind: 'inline',
    prompt: `방정식을 풀어 x의 값을 구하세요.`,
    promptEn: `Solve the one-step equation for x.`,
    expression: `x - ${a} = ${b}`,
    expressionEn: `x - ${a} = ${b}`,
    answer: String(x),
    answerSuffix: '',
  };
}

/**
 * 28. g6e-m4d-one-step-equations-mult
 * One-step equations: multiplication and division
 */
export function generateM4dOneStepEquationsMult(random) {
  const isMult = random() < 0.5;
  if (isMult) {
    const a = randomInt(random, 3, 9);
    const x = randomInt(random, 6, 18);
    const b = a * x;
    return {
      kind: 'inline',
      prompt: `방정식을 풀어 x의 값을 구하세요.`,
      promptEn: `Solve the one-step equation for x.`,
      expression: `${a}x = ${b}`,
      expressionEn: `${a}x = ${b}`,
      answer: String(x),
      answerSuffix: '',
    };
  }
  const a = randomInt(random, 3, 8);
  const x = randomInt(random, 5, 15) * a;
  const b = x / a;
  return {
    kind: 'inline',
    prompt: `방정식을 풀어 x의 값을 구하세요.`,
    promptEn: `Solve the one-step equation for x.`,
    expression: `x ÷ ${a} = ${b}`,
    expressionEn: `x ÷ ${a} = ${b}`,
    answer: String(x),
    answerSuffix: '',
  };
}

/**
 * 29. g6e-m4e-equation-word-problems
 * Equation word problems
 */
export function generateM4eEquationWordProblems(random) {
  const itemPrice = randomInt(random, 4, 12);
  const itemsCount = randomInt(random, 3, 6);
  const extra = randomInt(random, 5, 20);
  const total = itemPrice * itemsCount + extra;

  return {
    kind: 'word',
    prompt: `지민이는 권당 ${itemPrice}달러인 공책 ${itemsCount}권과 필통 1개를 사고 모두 ${total}달러를 냈습니다. 필통 1개의 가격은 몇 달러일까요?`,
    promptEn: `Jimin bought ${itemsCount} notebooks for $${itemPrice} each and one pencil case. Her total was $${total}. How much did the pencil case cost?`,
    expression: `${itemPrice} × ${itemsCount} + p = ${total}`,
    expressionEn: `${itemPrice} × ${itemsCount} + p = ${total}`,
    answer: String(extra),
    answerSuffix: '$',
  };
}

/**
 * 30. g6e-m4f-inequalities-graphing
 * Inequalities on number line & solutions
 */
export function generateM4fInequalitiesGraphing(random) {
  const bound = randomInt(random, 12, 35);
  const isGreater = random() < 0.5;

  return {
    kind: 'word',
    prompt: `놀이기구를 타려면 키가 적어도 ${bound}인치 이상이어야 합니다. 키를 h라고 할 때 이를 나타내는 부등식으로 알맞은 것은 무엇일까요?\n1) h < ${bound}\n2) h ≤ ${bound}\n3) h > ${bound}\n4) h ≥ ${bound}\n(번호 1~4 중 선택)`,
    promptEn: `To ride a roller coaster, you must be at least ${bound} inches tall. Which inequality represents this requirement for height h?\n1) h < ${bound}\n2) h ≤ ${bound}\n3) h > ${bound}\n4) h ≥ ${bound}\n(Enter 1, 2, 3, or 4)`,
    expression: `h ≥ ${bound}`,
    expressionEn: `h ≥ ${bound}`,
    answer: '4',
    answerSuffix: '번',
  };
}

/**
 * 31. g6e-m4f-two-variable-relationships
 * Independent and dependent variables (y = kx)
 */
export function generateM4fTwoVariableRelationships(random) {
  const k = randomInt(random, 15, 60);
  const hours = randomInt(random, 3, 8);
  const distance = k * hours;

  return {
    kind: 'word',
    prompt: `자전거가 시속 ${k}km의 일정한 속력으로 달립니다. 시간(t시간)과 이동 거리(d km) 사이의 관계식이 d = ${k}t일 때, ${hours}시간 동안 이동한 거리는 몇 km일까요?`,
    promptEn: `A bicycle travels at a constant speed of ${k} km/h. If the relationship between time (t hours) and distance (d km) is d = ${k}t, what is the distance traveled in ${hours} hours?`,
    expression: `d = ${k} × ${hours}`,
    expressionEn: `d = ${k} × ${hours}`,
    answer: String(distance),
    answerSuffix: 'km',
  };
}

/* =========================================================================
   MODULE 5: AREA, SURFACE AREA, AND VOLUME PROBLEMS
   ========================================================================= */

/**
 * 32. g6e-m5a-area-parallelograms-triangles
 * Area of parallelograms and triangles
 */
export function generateM5aAreaParallelogramsTriangles(random) {
  const isTriangle = random() < 0.5;
  const b = randomInt(random, 6, 20);
  const h = randomInt(random, 4, 16);

  if (isTriangle) {
    const area = (b * h) / 2;
    return {
      kind: 'word',
      prompt: `밑변의 길이가 ${b}cm이고 높이가 ${h}cm인 삼각형의 넓이는 몇 cm²일까요?`,
      promptEn: `Find the area of a triangle with a base of ${b} cm and a height of ${h} cm.`,
      expression: `1/2 × ${b} × ${h}`,
      expressionEn: `1/2 × ${b} × ${h}`,
      answer: String(area),
      answerSuffix: 'cm²',
    };
  }
  const area = b * h;
  return {
    kind: 'word',
    prompt: `밑변의 길이가 ${b}m이고 높이가 ${h}m인 평행사변형의 넓이는 몇 m²일까요?`,
    promptEn: `Find the area of a parallelogram with a base of ${b} m and a height of ${h} m.`,
    expression: `${b} × ${h}`,
    expressionEn: `${b} × ${h}`,
    answer: String(area),
    answerSuffix: 'm²',
  };
}

/**
 * 33. g6e-m5a-area-polygons-composite
 * Area of trapezoids and composite polygons
 */
export function generateM5aAreaPolygonsComposite(random) {
  const top = randomInt(random, 4, 12);
  const bottom = top + randomInt(random, 2, 10);
  const h = randomInt(random, 2, 8) * 2; // even height
  const area = ((top + bottom) * h) / 2;

  return {
    kind: 'word',
    prompt: `윗변의 길이가 ${top}cm, 아랫변의 길이가 ${bottom}cm이고 높이가 ${h}cm인 사다리꼴의 넓이는 몇 cm²일까요?`,
    promptEn: `Find the area of a trapezoid with top base ${top} cm, bottom base ${bottom} cm, and height ${h} cm.`,
    expression: `(${top} + ${bottom}) × ${h} ÷ 2`,
    expressionEn: `(${top} + ${bottom}) × ${h} ÷ 2`,
    answer: String(area),
    answerSuffix: 'cm²',
  };
}

/**
 * 34. g6e-m5b-polygons-coordinate-plane
 * Polygons on the coordinate plane
 */
export function generateM5bPolygonsCoordinatePlane(random) {
  const x1 = -randomInt(random, 2, 6);
  const x2 = randomInt(random, 2, 6);
  const y1 = -randomInt(random, 2, 6);
  const y2 = randomInt(random, 2, 6);

  const width = x2 - x1;
  const height = y2 - y1;
  const area = width * height;

  return {
    kind: 'word',
    prompt: `네 꼭짓점이 (${x1}, ${y2}), (${x2}, ${y2}), (${x2}, ${y1}), (${x1}, ${y1})인 직사각형의 넓이는 몇 단위²일까요?`,
    promptEn: `Find the area of the rectangle with vertices at (${x1}, ${y2}), (${x2}, ${y2}), (${x2}, ${y1}), and (${x1}, ${y1}).`,
    expression: `(${x2} - (${x1})) × (${y2} - (${y1}))`,
    expressionEn: `(${x2} - (${x1})) × (${y2} - (${y1}))`,
    answer: String(area),
    answerSuffix: '',
  };
}

/**
 * 35. g6e-m5c-volume-fractional-cubes
 * Volume with fractional edge lengths
 */
export function generateM5cVolumeFractionalCubes(random) {
  const l = roundTo(randomInt(random, 2, 5) + 0.5, 1);
  const w = randomInt(random, 2, 6);
  const h = roundTo(randomInt(random, 1, 3) + 0.5, 1);
  const vol = roundTo(l * w * h, 2);

  return {
    kind: 'word',
    prompt: `가로 ${l}cm, 세로 ${w}cm, 높이 ${h}cm인 직육면체의 부피는 몇 cm³일까요?`,
    promptEn: `Find the volume of a right rectangular prism with length ${l} cm, width ${w} cm, and height ${h} cm.`,
    expression: `${l} × ${w} × ${h}`,
    expressionEn: `${l} × ${w} × ${h}`,
    answer: String(vol),
    answerSuffix: 'cm³',
  };
}

/**
 * 36. g6e-m5d-nets-surface-area
 * Nets and surface area of prisms
 */
export function generateM5dNetsSurfaceArea(random) {
  const l = randomInt(random, 3, 8);
  const w = randomInt(random, 2, 6);
  const h = randomInt(random, 4, 10);

  const sa = 2 * (l * w + w * h + h * l);

  return {
    kind: 'word',
    prompt: `가로 ${l}cm, 세로 ${w}cm, 높이 ${h}cm인 직육면체의 겉넓이는 몇 cm²일까요?`,
    promptEn: `Find the surface area of a rectangular prism with length ${l} cm, width ${w} cm, and height ${h} cm.`,
    expression: `2 × (${l}×${w} + ${w}×${h} + ${h}×${l})`,
    expressionEn: `2 × (${l}×${w} + ${w}×${h} + ${h}×${l})`,
    answer: String(sa),
    answerSuffix: 'cm²',
  };
}

/* =========================================================================
   MODULE 6: STATISTICS
   ========================================================================= */

/**
 * 37. g6e-m6a-statistical-questions-plots
 * Statistical questions and dot plots
 */
export function generateM6aStatisticalQuestionsPlots(random) {
  const mode = randomInt(random, 0, 1);
  if (mode === 0) {
    // Statistical question classification
    return {
      kind: 'word',
      prompt: `다음 중 조사 대상 집단에 따라 다양한 답이 나오는 '통계적 질문(Statistical Question)'은 몇 번일까요?\n1) 우리 학교 6학년 학생들의 좋아하는 색깔은 무엇인가요?\n2) 에베레스트 산의 높이는 몇 m인가요?\n3) 2026년 대한민국의 수도는 어디인가요?\n4) 직사각형의 네 내각의 합은 몇 도인가요?\n(번호 1~4 중 선택)`,
      promptEn: `Which of the following is a statistical question?\n1) What are the favorite colors of 6th grade students in our school?\n2) How tall is Mount Everest in meters?\n3) What is the capital of South Korea in 2026?\n4) What is the sum of angles in a rectangle?\n(Enter 1, 2, 3, or 4)`,
      expression: `Statistical Question Concept`,
      expressionEn: `Statistical Question Concept`,
      answer: '1',
      answerSuffix: '번',
    };
  }
  // Range from data
  const data = Array.from({ length: 6 }, () => randomInt(random, 5, 25)).sort((a, b) => a - b);
  const range = data[data.length - 1] - data[0];
  return {
    kind: 'word',
    prompt: `자료 [${data.join(', ')}]의 범위(최댓값 - 최솟값)는 얼마일까요?`,
    promptEn: `What is the range of the dataset [${data.join(', ')}]?`,
    expression: `${data[data.length - 1]} - ${data[0]}`,
    expressionEn: `${data[data.length - 1]} - ${data[0]}`,
    answer: String(range),
    answerSuffix: '',
  };
}

/**
 * 38. g6e-m6b-mean-and-mad
 * Mean and Mean Absolute Deviation (MAD)
 */
export function generateM6bMeanAndMad(random) {
  const center = randomInt(random, 15, 30);
  const diffs = [-4, -2, 0, 2, 4];
  const data = diffs.map((d) => center + d);
  const mean = center;

  const isMean = random() < 0.5;
  if (isMean) {
    return {
      kind: 'word',
      prompt: `자료 [${data.join(', ')}]의 평균(Mean)을 구하세요.`,
      promptEn: `Find the mean of the dataset [${data.join(', ')}].`,
      expression: `(${data.join(' + ')}) ÷ ${data.length}`,
      expressionEn: `(${data.join(' + ')}) ÷ ${data.length}`,
      answer: String(mean),
      answerSuffix: '',
    };
  }
  // MAD calculation
  const absDevs = diffs.map((d) => Math.abs(d));
  const mad = roundTo(absDevs.reduce((a, b) => a + b, 0) / absDevs.length, 1);

  return {
    kind: 'word',
    prompt: `자료 [${data.join(', ')}]의 평균은 ${mean}입니다. 각 자료값과 평균 사이의 편차의 절댓값들의 평균인 '평균절대편차(MAD)'를 구하세요.`,
    promptEn: `The mean of [${data.join(', ')}] is ${mean}. Find the Mean Absolute Deviation (MAD) of the dataset.`,
    expression: `(|${diffs.join('| + |')}|) ÷ 5`,
    expressionEn: `(|${diffs.join('| + |')}|) ÷ 5`,
    answer: String(mad),
    answerSuffix: '',
  };
}

/**
 * 39. g6e-m6c-median-and-iqr
 * Median and Interquartile Range (IQR)
 */
export function generateM6cMedianAndIqr(random) {
  // 7 sorted values
  const q1 = randomInt(random, 10, 15);
  const median = q1 + randomInt(random, 3, 7);
  const q3 = median + randomInt(random, 3, 7);

  const d1 = q1 - randomInt(random, 2, 5);
  const d3 = median - randomInt(random, 1, 2);
  const d5 = median + randomInt(random, 1, 2);
  const d7 = q3 + randomInt(random, 2, 6);

  const data = [d1, q1, d3, median, d5, q3, d7];
  const iqr = q3 - q1;

  const mode = randomInt(random, 0, 1);
  if (mode === 0) {
    return {
      kind: 'word',
      prompt: `자료 [${data.join(', ')}]의 중앙값(Median)을 구하세요.`,
      promptEn: `Find the median of the dataset [${data.join(', ')}].`,
      expression: `Median of sorted data`,
      expressionEn: `Median of sorted data`,
      answer: String(median),
      answerSuffix: '',
    };
  }
  return {
    kind: 'word',
    prompt: `정렬된 자료 [${data.join(', ')}]에서 제1사분위수 Q1 = ${q1}, 제3사분위수 Q3 = ${q3}입니다. 사분위범위(IQR = Q3 - Q1)는 얼마일까요?`,
    promptEn: `For the sorted data [${data.join(', ')}], Q1 = ${q1} and Q3 = ${q3}. What is the Interquartile Range (IQR)?`,
    expression: `${q3} - ${q1}`,
    expressionEn: `${q3} - ${q1}`,
    answer: String(iqr),
    answerSuffix: '',
  };
}

/**
 * 40. g6e-m6c-box-plots-five-summary
 * Five-number summary and box plots
 */
export function generateM6cBoxPlotsFiveSummary(random) {
  const min = randomInt(random, 5, 12);
  const q1 = min + randomInt(random, 4, 8);
  const median = q1 + randomInt(random, 4, 9);
  const q3 = median + randomInt(random, 5, 10);
  const max = q3 + randomInt(random, 6, 12);

  const mode = randomInt(random, 0, 1);
  if (mode === 0) {
    // Range
    const r = max - min;
    return {
      kind: 'word',
      prompt: `상자그림(Box plot)의 다섯 수 요약이 최솟값=${min}, Q1=${q1}, 중앙값=${median}, Q3=${q3}, 최댓값=${max}일 때, 전체 자료의 범위(Range)는 얼마일까요?`,
      promptEn: `Given the five-number summary: Min=${min}, Q1=${q1}, Median=${median}, Q3=${q3}, Max=${max}, what is the range of the dataset?`,
      expression: `${max} - ${min}`,
      expressionEn: `${max} - ${min}`,
      answer: String(r),
      answerSuffix: '',
    };
  }
  // Percentage of data
  return {
    kind: 'word',
    prompt: `상자그림(Box plot)에서 상자(Box)의 양 끝인 제1사분위수(Q1)와 제3사분위수(Q3) 사이에 포함되는 전체 데이터의 비율은 몇 %일까요? (숫자만 입력)`,
    promptEn: `In a box plot, what percentage of the total data lies between the first quartile (Q1) and the third quartile (Q3)? (Enter number only)`,
    expression: `Middle 50% between Q1 and Q3`,
    expressionEn: `Middle 50% between Q1 and Q3`,
    answer: '50',
    answerSuffix: '%',
  };
}
