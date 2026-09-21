// Grade 5 국제 커리큘럼(Eureka Math / EngageNY 구조 기반) 문제 생성 엔진
// 6개 모듈(M1 자릿값·소수, M2 다자리 수·소수 연산, M3 분수 덧셈·뺄셈,
// M4 분수·소수 곱셈·나눗셈, M5 부피·넓이·2D도형, M6 좌표평면·문제해결)의 Topic 단위(총 37개) 생성기.
// 원 출처의 문제 문장을 그대로 옮기지 않고, 교육과정 표준(CCSS Grade 5: 5.OA, 5.NBT, 5.NF, 5.MD, 5.G)과
// 단원의 핵심 개념·모델을 충실히 반영하여 새롭게 작성함.

function randomInt(random, min, max) {
  return Math.floor(random() * (max - min + 1)) + min;
}

function pick(random, values) {
  return values[randomInt(random, 0, values.length - 1)];
}

function gcd(a, b) {
  let left = Math.abs(a);
  let right = Math.abs(b);
  while (right) [left, right] = [right, left % right];
  return left || 1;
}

function fractionAnswer(numerator, denominator) {
  if (denominator === 0) return '0';
  const common = gcd(numerator, denominator);
  const top = numerator / common;
  const bottom = denominator / common;
  if (bottom === 1) return String(top);
  if (Math.abs(top) >= bottom) {
    const whole = Math.floor(top / bottom);
    const rem = top % bottom;
    return rem === 0 ? String(whole) : `${whole} ${rem}/${bottom}`;
  }
  return `${top}/${bottom}`;
}

function decimal(value, places = 3) {
  return Number(value.toFixed(places));
}

function inline(expression, answer) {
  return { kind: 'inline', expression, answer: String(answer) };
}

function vertical(a, b, operator, answer) {
  return { kind: 'vertical', a, b, operator, answer: String(answer) };
}

function wordQ(prompt, expression, answer, answerSuffix = '', promptEn = '', expressionEn = '') {
  return { kind: 'word', prompt, expression, answer: String(answer), answerSuffix, promptEn, expressionEn };
}

function groupDigits(n) {
  return n.toLocaleString('en-US');
}

// =========================================================================
// MODULE 1: Place Value and Decimal Fractions (Topics A - F)
// =========================================================================

// [M1 Topic A] 10의 거듭제곱과 자릿값 이동 (5.NBT.1, 5.NBT.2)
export function m1PowersOfTen(random) {
  const mode = randomInt(random, 0, 2);
  if (mode === 0) {
    // 거듭제곱 표현 계산: 3.4 x 10^2 or 4.56 x 10^3
    const exp = randomInt(random, 1, 3);
    const baseNum = randomInt(random, 12, 985) / 100;
    const ans = decimal(baseNum * 10 ** exp, 3);
    return wordQ(
      `${baseNum} × 10^${exp}의 값을 계산하세요.`,
      `${baseNum} × 10^${exp}`,
      ans,
      '',
      `Evaluate ${baseNum} × 10^${exp}.`,
      `${baseNum} × 10^${exp}`,
    );
  }
  if (mode === 1) {
    // 나눗셈 자릿값 이동: 450 ÷ 10^2
    const exp = pick(random, [1, 2, 3]);
    const orig = randomInt(random, 15, 850);
    const ans = decimal(orig / 10 ** exp, 3);
    return wordQ(
      `${orig} ÷ 10^${exp}의 값을 계산하세요.`,
      `${orig} ÷ 10^${exp}`,
      ans,
      '',
      `Evaluate ${orig} ÷ 10^${exp}.`,
      `${orig} ÷ 10^${exp}`,
    );
  }
  // 자릿수 관계: 5.NBT.1 "A digit in one place represents 10 times as much..."
  const digit = randomInt(random, 2, 9);
  return wordQ(
    `${digit}0.0에서 ${digit}은(는) 0.${digit}의 몇 배인가요?`,
    '',
    100,
    '배',
    `How many times greater is the value of ${digit} in ${digit}0.0 than in 0.${digit}?`,
  );
}

// [M1 Topic A] 자릿값 이동을 이용한 미터법 환산 (5.MD.1)
export function m1MetricShift(random) {
  const types = [
    { from: 'm', to: 'cm', mult: 100, val: randomInt(random, 12, 95) / 10 },
    { from: 'km', to: 'm', mult: 1000, val: randomInt(random, 12, 85) / 100 },
    { from: 'kg', to: 'g', mult: 1000, val: randomInt(random, 15, 75) / 10 },
    { from: 'L', to: 'mL', mult: 1000, val: randomInt(random, 12, 95) / 10 },
    { from: 'g', to: 'kg', mult: 0.001, val: randomInt(random, 250, 4500) },
    { from: 'cm', to: 'm', mult: 0.01, val: randomInt(random, 35, 750) },
  ];
  const item = pick(random, types);
  const ans = decimal(item.val * item.mult, 4);
  return wordQ(
    `자릿값 이동을 이용하여 환산하세요: ${item.val}${item.from} = □ ${item.to}`,
    '',
    ans,
    item.to,
    `Convert using place value patterns: ${item.val}${item.from} = □ ${item.to}`,
  );
}

// [M1 Topic B] 소수의 전개식과 천분의 일 (5.NBT.3a)
export function m1DecimalForms(random) {
  const mode = randomInt(random, 0, 1);
  const ones = randomInt(random, 1, 9);
  const tenths = randomInt(random, 0, 9);
  const hundredths = randomInt(random, 0, 9);
  const thousandths = randomInt(random, 1, 9);
  const decVal = decimal(ones + tenths * 0.1 + hundredths * 0.01 + thousandths * 0.001, 3);

  if (mode === 0) {
    // 분수를 이용한 전개식을 소수로
    const parts = [`${ones} × 1`];
    if (tenths > 0) parts.push(`${tenths} × (1/10)`);
    if (hundredths > 0) parts.push(`${hundredths} × (1/100)`);
    parts.push(`${thousandths} × (1/1000)`);
    return wordQ(
      `다음 전개식으로 표현된 수를 소수로 쓰세요: ${parts.join(' + ')}`,
      '',
      decVal,
      '',
      `Write the number in standard decimal form: ${parts.join(' + ')}`,
    );
  }
  // 단위 형식 질문: 3.405는 몇 천분의 일인가요?
  const totalThousandths = Math.round(decVal * 1000);
  return wordQ(
    `${decVal}은(는) 0.001(천분의 일)이 모두 몇 개 모인 수인가요?`,
    '',
    totalThousandths,
    '개',
    `How many thousandths (0.001) are in ${decVal}?`,
  );
}

// [M1 Topic B] 천분의 일까지의 소수 크기 비교 (5.NBT.3b)
export function m1DecimalCompare(random) {
  const base = randomInt(random, 1, 9);
  const t = randomInt(random, 1, 8);
  const h = randomInt(random, 0, 9);
  const th = randomInt(random, 1, 9);
  let a = decimal(base + t * 0.1 + h * 0.01 + th * 0.001, 3);
  let b;
  const mode = randomInt(random, 0, 2);
  if (mode === 0) {
    // 소수점 이하 자리수가 다른 경우: 3.4 vs 3.405
    b = decimal(base + t * 0.1, 1);
  } else if (mode === 1) {
    // 백분위와 천분위 혼동 유도: 2.35 vs 2.309
    b = decimal(base + t * 0.1 + (h + 1) * 0.01, 2);
  } else {
    // 같은 십분위, 미세한 차이
    b = decimal(base + t * 0.1 + h * 0.01 + ((th + 1) % 10) * 0.001, 3);
  }
  if (a === b) b = decimal(a + 0.001, 3);
  return inline(`${a} □ ${b}`, a > b ? '>' : '<');
}

// [M1 Topic C] 수직선 모델과 소수의 반올림 (5.NBT.4)
export function m1RoundingDecimals(random) {
  const targetPlace = pick(random, ['일의 자리', '소수 첫째 자리', '소수 둘째 자리']);
  const targetPlaceEn = targetPlace === '일의 자리' ? 'the nearest whole number' : targetPlace === '소수 첫째 자리' ? 'the nearest tenth' : 'the nearest hundredth';
  const val = decimal(randomInt(random, 1200, 8999) / 1000, 3);
  let ans;
  if (targetPlace === '일의 자리') {
    ans = Math.round(val);
  } else if (targetPlace === '소수 첫째 자리') {
    ans = decimal(Math.round(val * 10) / 10, 1);
  } else {
    ans = decimal(Math.round(val * 100) / 100, 2);
  }
  return wordQ(
    `${val}을(를) ${targetPlace}까지 반올림하세요.`,
    '',
    ans,
    '',
    `Round ${val} to ${targetPlaceEn}.`,
  );
}

// [M1 Topic D] 천분의 일까지의 소수 덧셈과 뺄셈 (5.NBT.7)
export function m1DecimalAddSub(random) {
  const isAdd = random() < 0.55;
  const a = decimal(randomInt(random, 1200, 7500) / 1000, 3);
  const b = decimal(randomInt(random, 300, 4200) / 1000, 3);
  let first = a;
  let second = b;
  if (!isAdd && second > first) [first, second] = [second, first];
  const ans = decimal(isAdd ? first + second : first - second, 3);
  return inline(`${first} ${isAdd ? '+' : '-'} ${second}`, ans);
}

// [M1 Topic E] 소수와 1자리 자연수의 곱셈 (5.NBT.7)
export function m1DecimalMultiply1Digit(random) {
  const places = pick(random, [1, 2]);
  const scale = 10 ** places;
  const dec = decimal(randomInt(random, 12, 450) / scale, places);
  const mult = randomInt(random, 3, 8);
  const ans = decimal(dec * mult, places);
  return inline(`${dec} × ${mult}`, ans);
}

// [M1 Topic F] 소수와 1자리 자연수의 나눗셈 (5.NBT.7)
export function m1DecimalDivide1Digit(random) {
  const divisor = randomInt(random, 2, 7);
  const quotient = decimal(randomInt(random, 15, 350) / pick(random, [10, 100]), 2);
  const dividend = decimal(divisor * quotient, 3);
  return inline(`${dividend} ÷ ${divisor}`, quotient);
}

// =========================================================================
// MODULE 2: Multi-Digit Whole Number & Decimal Operations (Topics A - H)
// =========================================================================

// [M2 Topic A] 큰 수 곱셈의 암산과 어림 (5.NBT.1, 5.NBT.2)
export function m2MentalMult(random) {
  const aBase = pick(random, [2, 3, 4, 5, 6, 7, 8, 9]);
  const bBase = pick(random, [2, 3, 4, 5, 6, 7, 8, 9]);
  const aZeros = pick(random, [1, 2, 3]);
  const bZeros = pick(random, [1, 2]);
  const a = aBase * 10 ** aZeros;
  const b = bBase * 10 ** bZeros;
  const ans = a * b;
  return inline(`${groupDigits(a)} × ${groupDigits(b)}`, groupDigits(ans));
}

// [M2 Topic A] 괄호와 사칙연산 식의 해석 (5.OA.1, 5.OA.2)
export function m2OrderExpressions(random) {
  const a = randomInt(random, 12, 35);
  const b = randomInt(random, 5, 18);
  const c = randomInt(random, 2, 6);
  const mode = randomInt(random, 0, 2);
  if (mode === 0) {
    const ans = (a + b) * c;
    return inline(`(${a} + ${b}) × ${c}`, ans);
  }
  if (mode === 1) {
    const ans = (a - b) * c;
    return inline(`(${a} - ${b}) × ${c}`, ans);
  }
  const ans = a * c + b;
  return inline(`${a} × ${c} + ${b}`, ans);
}

// [M2 Topic B] 다자리 자연수 곱셈 표준 알고리즘 (5.NBT.5)
export function m2MultStandardAlg(random) {
  const a = randomInt(random, 125, 642);
  const b = randomInt(random, 14, 48);
  return vertical(a, b, '×', a * b);
}

// [M2 Topic C] 소수의 다자리 곱셈 (5.NBT.7)
export function m2DecimalMult(random) {
  const mode = randomInt(random, 0, 1);
  if (mode === 0) {
    // 소수 × 두 자리 자연수: 3.24 × 15
    const dec = decimal(randomInt(random, 120, 450) / 100, 2);
    const whole = randomInt(random, 12, 28);
    return inline(`${dec} × ${whole}`, decimal(dec * whole, 2));
  }
  // 소수 × 소수: 0.45 × 1.2
  const a = decimal(randomInt(random, 15, 85) / 100, 2);
  const b = decimal(randomInt(random, 12, 45) / 10, 1);
  return inline(`${a} × ${b}`, decimal(a * b, 3));
}

// [M2 Topic D] 측정 단위 환산 곱셈 문장제 (5.MD.1, 5.NBT.7)
export function m2MeasurementWordMult(random) {
  const mode = randomInt(random, 0, 1);
  if (mode === 0) {
    const meters = decimal(randomInt(random, 25, 75) / 10, 1);
    const cm = Math.round(meters * 100);
    return wordQ(
      `리본의 길이가 ${meters}m입니다. 이 리본의 길이는 몇 cm인가요?`,
      '',
      cm,
      'cm',
      `A ribbon is ${meters} m long. What is its length in centimeters?`,
    );
  }
  const kg = decimal(randomInt(random, 12, 45) / 10, 1);
  const pricePerKg = randomInt(random, 2500, 6000);
  const total = Math.round(kg * pricePerKg);
  return wordQ(
    `사과 1kg의 가격이 ${groupDigits(pricePerKg)}원입니다. 사과 ${kg}kg을 사려면 모두 얼마를 내야 하나요?`,
    '',
    groupDigits(total),
    '원',
    `Apples cost $${(pricePerKg / 1000).toFixed(2)} per kg. How much for ${kg} kg?`,
    '',
  );
}

// [M2 Topic E] 다자리 나눗셈의 암산과 몫 어림 (5.NBT.6)
export function m2MentalDiv(random) {
  const divisorBase = pick(random, [2, 3, 4, 5, 6, 7, 8, 9]);
  const quotient = randomInt(random, 4, 12);
  const divisor = divisorBase * 10;
  const dividend = divisor * quotient;
  return inline(`${dividend} ÷ ${divisor}`, quotient);
}

// [M2 Topic F] 두 자리 수로 나누는 나눗셈 (5.NBT.6)
export function m2Div2DigitDivisor(random) {
  const divisor = randomInt(random, 12, 45);
  const quotient = randomInt(random, 14, 85);
  const hasRem = random() < 0.45;
  const remainder = hasRem ? randomInt(random, 1, divisor - 1) : 0;
  const dividend = divisor * quotient + remainder;
  const ans = hasRem ? `${quotient} R ${remainder}` : quotient;
  return inline(`${dividend} ÷ ${divisor}`, ans);
}

// [M2 Topic G] 소수를 두 자리 수로 나누기 (5.NBT.7)
export function m2DecimalDivMultidigit(random) {
  const divisor = randomInt(random, 12, 32);
  const quotient = decimal(randomInt(random, 15, 65) / 10, 1);
  const dividend = decimal(divisor * quotient, 2);
  return inline(`${dividend} ÷ ${divisor}`, quotient);
}

// [M2 Topic H] 나눗셈 다단계 문장제와 나머지 해석 (5.NBT.6, 5.MD.1)
export function m2DivWordProblems(random) {
  const total = randomInt(random, 125, 450);
  const perBox = randomInt(random, 12, 24);
  const boxes = Math.floor(total / perBox);
  const rem = total % perBox;
  const mode = randomInt(random, 0, 1);
  if (mode === 0) {
    // 상자에 가득 담고 남은 개수
    return wordQ(
      `구슬 ${total}개를 한 상자에 ${perBox}개씩 똑같이 나누어 담으려고 합니다. 상자에 가득 담고 남는 구슬은 몇 개인가요?`,
      '',
      rem,
      '개',
      `There are ${total} marbles to pack ${perBox} per box. How many marbles are left over?`,
    );
  }
  // 모두 담기 위해 필요한 상자의 최소 개수
  const neededBoxes = rem > 0 ? boxes + 1 : boxes;
  return wordQ(
    `학생 ${total}명이 버스를 타고 현장학습을 가려고 합니다. 한 버스에 ${perBox}명씩 탈 수 있다면 최소 몇 대의 버스가 필요한가요?`,
    '',
    neededBoxes,
    '대',
    `${total} students go on a field trip. Each bus seats ${perBox}. How many buses are needed?`,
  );
}

// =========================================================================
// MODULE 3: Addition and Subtraction of Fractions (Topics A - D)
// =========================================================================

// [M3 Topic A] 동치분수와 크기가 같은 분수 만들기 (5.NF.1)
export function m3EquivalentFractions(random) {
  const d1 = pick(random, [2, 3, 4, 5, 6]);
  const n1 = randomInt(random, 1, d1 - 1);
  const k = randomInt(random, 2, 5);
  const mode = randomInt(random, 0, 1);
  if (mode === 0) {
    return inline(`${n1}/${d1} = □/${d1 * k}`, n1 * k);
  }
  return inline(`${n1 * k}/${d1 * k} → 기약분수`, fractionAnswer(n1, d1));
}

// [M3 Topic B] 시각적 모델을 통한 이분모 분수의 덧셈과 뺄셈 (5.NF.1)
export function m3FractionAddSubVisual(random) {
  // 공약수가 없거나 작은 분모 쌍 (예: 1/2 + 1/3 = 5/6, 3/4 - 1/2)
  const d1 = pick(random, [2, 3, 4, 5]);
  const d2 = pick(random, [3, 4, 5, 6].filter((x) => x !== d1));
  const isAdd = random() < 0.55;
  const n1 = randomInt(random, 1, d1 - 1);
  const n2 = randomInt(random, 1, d2 - 1);
  let first = [n1, d1];
  let second = [n2, d2];
  if (!isAdd && first[0] * second[1] < second[0] * first[1]) {
    [first, second] = [second, first];
  }
  const top = isAdd ? first[0] * second[1] + second[0] * first[1] : first[0] * second[1] - second[0] * first[1];
  const bottom = first[1] * second[1];
  return inline(`${first[0]}/${first[1]} ${isAdd ? '+' : '-'} ${second[0]}/${second[1]}`, fractionAnswer(top, bottom));
}

// [M3 Topic C] 수치적 통분과 대분수의 덧셈·뺄셈 (5.NF.1)
export function m3FractionAddSubUnlike(random) {
  const mode = randomInt(random, 0, 1);
  const d1 = pick(random, [3, 4, 5, 6, 8]);
  const d2 = pick(random, [2, 3, 4, 5, 6, 8].filter((x) => x !== d1));
  const isAdd = random() < 0.55;

  if (mode === 0) {
    // 진분수 연산
    const n1 = randomInt(random, 1, d1 - 1);
    const n2 = randomInt(random, 1, d2 - 1);
    let top1 = n1;
    let top2 = n2;
    if (!isAdd && top1 * d2 < top2 * d1) {
      return inline(`${n2}/${d2} - ${n1}/${d1}`, fractionAnswer(n2 * d1 - n1 * d2, d1 * d2));
    }
    const num = isAdd ? top1 * d2 + top2 * d1 : top1 * d2 - top2 * d1;
    return inline(`${top1}/${d1} ${isAdd ? '+' : '-'} ${top2}/${d2}`, fractionAnswer(num, d1 * d2));
  }
  // 대분수 연산
  const w1 = randomInt(random, 2, 5);
  const w2 = randomInt(random, 1, 3);
  const n1 = randomInt(random, 1, d1 - 1);
  const n2 = randomInt(random, 1, d2 - 1);
  const imp1 = w1 * d1 + n1;
  const imp2 = w2 * d2 + n2;
  const num = isAdd ? imp1 * d2 + imp2 * d1 : imp1 * d2 - imp2 * d1;
  return inline(`${w1} ${n1}/${d1} ${isAdd ? '+' : '-'} ${w2} ${n2}/${d2}`, fractionAnswer(num, d1 * d2));
}

// [M3 Topic D] 분수 덧셈·뺄셈 테이프 다이어그램 문장제 (5.NF.2)
export function m3FractionWordProblems(random) {
  const d1 = pick(random, [3, 4, 5]);
  const d2 = pick(random, [2, 4, 6].filter((x) => x !== d1));
  const n1 = randomInt(random, 1, d1 - 1);
  const n2 = randomInt(random, 1, d2 - 1);
  const isAdd = random() < 0.5;

  if (isAdd) {
    const ans = fractionAnswer(n1 * d2 + n2 * d1, d1 * d2);
    return wordQ(
      `민수는 오전에 케이크의 ${n1}/${d1}을(를) 먹고, 오후에 ${n2}/${d2}을(를) 먹었습니다. 민수가 먹은 케이크는 전체의 얼마인가요?`,
      '',
      ans,
      '',
      `Min-su ate ${n1}/${d1} of a cake in the morning and ${n2}/${d2} in the afternoon. What fraction did he eat in total?`,
    );
  }
  // 뺄셈: 주스가 2 1/4L 있었는데 1 1/3L 마심
  const w = randomInt(random, 2, 4);
  const totalImp = w * d1 + n1;
  const subImp = 1 * d2 + n2;
  const remNum = totalImp * d2 - subImp * d1;
  const ans = fractionAnswer(remNum, d1 * d2);
  return wordQ(
    `물병에 물이 ${w} ${n1}/${d1}L 들어 있었습니다. 그중 1 ${n2}/${d2}L를 마셨다면 남은 물은 몇 L인가요?`,
    '',
    ans,
    'L',
    `A pitcher had ${w} ${n1}/${d1} L of water. After drinking 1 ${n2}/${d2} L, how much water is left?`,
  );
}

// =========================================================================
// MODULE 4: Multiplication and Division of Fractions & Decimals (Topics A - H)
// =========================================================================

// [M4 Topic A] 분수 측정값의 꺾은선/선 플롯 (5.MD.2)
export function m4LinePlots(random) {
  const denom = pick(random, [2, 4, 8]);
  const data = [
    randomInt(random, 1, denom),
    randomInt(random, 1, denom),
    randomInt(random, 1, denom),
    randomInt(random, 1, denom),
  ];
  const sumNum = data.reduce((acc, v) => acc + v, 0);
  const ans = fractionAnswer(sumNum, denom);
  return wordQ(
    `연필 4자루의 길이를 쟀더니 각각 ${data.map((v) => `${v}/${denom}인치`).join(', ')}였습니다. 4자루의 총 길이는 몇 인치인가요?`,
    '',
    ans,
    '인치',
    `The lengths of 4 ribbons measured ${data.map((v) => `${v}/${denom} inch`).join(', ')}. What is their total combined length?`,
  );
}

// [M4 Topic B] 나눗셈으로서의 분수 (5.NF.3)
export function m4FractionAsDivision(random) {
  const numerator = randomInt(random, 3, 14);
  const denominator = randomInt(random, 2, 8);
  if (numerator === denominator) return m4FractionAsDivision(random);
  const ans = fractionAnswer(numerator, denominator);
  const mode = randomInt(random, 0, 1);
  if (mode === 0) {
    return inline(`${numerator} ÷ ${denominator} → 분수`, ans);
  }
  return wordQ(
    `피자 ${numerator}판을 ${denominator}명의 친구가 똑같이 나누어 먹으려고 합니다. 한 사람이 먹게 되는 피자는 몇 판인가요?`,
    '',
    ans,
    '판',
    `Share ${numerator} pizzas equally among ${denominator} friends. How much pizza does each person get?`,
  );
}

// [M4 Topic C] 자연수와 분수의 곱셈 (5.NF.4a)
export function m4WholeTimesFraction(random) {
  const whole = randomInt(random, 3, 12);
  const d = pick(random, [3, 4, 5, 6, 8]);
  const n = randomInt(random, 1, d - 1);
  const ans = fractionAnswer(whole * n, d);
  const mode = randomInt(random, 0, 1);
  if (mode === 0) {
    return inline(`${whole} × ${n}/${d}`, ans);
  }
  return wordQ(
    `${whole}의 ${n}/${d}은(는) 얼마인가요?`,
    '',
    ans,
    '',
    `What is ${n}/${d} of ${whole}?`,
  );
}

// [M4 Topic D] 분수 식의 작성과 연산 (5.OA.1, 5.NF.4a)
export function m4FractionExpressions(random) {
  const a = randomInt(random, 4, 15);
  const b = randomInt(random, 4, 15);
  const d = pick(random, [2, 3, 4, 5]);
  const n = 1;
  const sum = a + b;
  const ans = fractionAnswer(sum * n, d);
  return wordQ(
    `'${a}와 ${b}의 합의 ${n}/${d}'을 계산식으로 쓰고 답을 구하세요.`,
    `(${a} + ${b}) × ${n}/${d}`,
    ans,
    '',
    `Evaluate: ${n}/${d} of the sum of ${a} and ${b}.`,
    `(${a} + ${b}) × ${n}/${d}`,
  );
}

// [M4 Topic E] 분수와 분수의 곱셈 (넓이 모델) (5.NF.4b)
export function m4FractionTimesFraction(random) {
  const d1 = pick(random, [2, 3, 4, 5]);
  const n1 = randomInt(random, 1, d1 - 1);
  const d2 = pick(random, [3, 4, 5, 7]);
  const n2 = randomInt(random, 1, d2 - 1);
  const ans = fractionAnswer(n1 * n2, d1 * d2);
  return inline(`${n1}/${d1} × ${n2}/${d2}`, ans);
}

// [M4 Topic F] 곱셈을 크기 변환(배율, Scaling)으로 이해하기 (5.NF.5)
export function m4ScalingResizing(random) {
  const base = randomInt(random, 5, 25);
  const mode = randomInt(random, 0, 2);
  if (mode === 0) {
    // 1보다 큰 분수를 곱하면 결과는 base보다 큼
    const top = randomInt(random, 4, 7);
    const bottom = top - 1;
    return wordQ(
      `${base} × ${top}/${bottom}의 계산 결과는 ${base}보다 큰가요, 작은가요? (크다 또는 작다로 답하세요)`,
      '',
      '크다',
      '',
      `Will ${base} × ${top}/${bottom} be greater than or less than ${base}? (Answer: greater or less)`,
    );
  }
  if (mode === 1) {
    // 1보다 작은 분수를 곱하면 결과는 base보다 작음
    const bottom = randomInt(random, 3, 8);
    const top = randomInt(random, 1, bottom - 1);
    return wordQ(
      `${base} × ${top}/${bottom}의 계산 결과는 ${base}보다 큰가요, 작은가요? (크다 또는 작다로 답하세요)`,
      '',
      '작다',
      '',
      `Will ${base} × ${top}/${bottom} be greater than or less than ${base}? (Answer: greater or less)`,
    );
  }
  // 1과 같은 분수를 곱하면 같음
  const same = randomInt(random, 3, 9);
  return wordQ(
    `${base} × ${same}/${same}의 계산 결과는 ${base}와 같은가요? (같다 또는 다르다로 답하세요)`,
    '',
    '같다',
    '',
    `Is ${base} × ${same}/${same} equal to ${base}? (Answer: equal or different)`,
  );
}

// [M4 Topic G] 단위분수와 자연수의 나눗셈 (5.NF.7)
export function m4FractionDivisionUnit(random) {
  const mode = randomInt(random, 0, 1);
  const unitDenom = pick(random, [2, 3, 4, 5, 6]);
  const whole = randomInt(random, 2, 7);
  if (mode === 0) {
    // 단위분수 ÷ 자연수: (1/3) ÷ 4 = 1/12
    const ans = `1/${unitDenom * whole}`;
    return inline(`1/${unitDenom} ÷ ${whole}`, ans);
  }
  // 자연수 ÷ 단위분수: 5 ÷ (1/4) = 20
  const ans = whole * unitDenom;
  return inline(`${whole} ÷ 1/${unitDenom}`, ans);
}

// [M4 Topic H] 분수와 소수가 포함된 혼합 수치식 (5.OA.1, 5.OA.2)
export function m4NumericalExpressions(random) {
  const a = randomInt(random, 2, 6);
  const b = randomInt(random, 1, 4);
  const c = pick(random, [2, 4]);
  // 1/2 × (a + b) or [a × b] ÷ 2
  const sum = a + b;
  const ans = fractionAnswer(sum, c);
  return inline(`1/${c} × (${a} + ${b})`, ans);
}

// =========================================================================
// MODULE 5: Addition and Multiplication with Volume and Area (Topics A - D)
// =========================================================================

// [M5 Topic A] 단위 정육면체와 부피 개념 (5.MD.3, 5.MD.4)
export function m5VolumeUnitCubes(random) {
  const l = randomInt(random, 2, 5);
  const w = randomInt(random, 2, 4);
  const h = randomInt(random, 2, 4);
  const cubes = l * w * h;
  const mode = randomInt(random, 0, 1);
  if (mode === 0) {
    return wordQ(
      `가로 ${l}개, 세로 ${w}개, 높이 ${h}층으로 1cm³짜리 쌓기나무를 빈틈없이 쌓았습니다. 전체 쌓기나무의 개수는 몇 개인가요?`,
      '',
      cubes,
      '개',
      `Unit cubes (1 cm³ each) are packed with length ${l}, width ${w}, and height ${h} layers. How many cubes in total?`,
    );
  }
  return wordQ(
    `한 층에 쌓기나무가 ${l * w}개씩 ${h}층으로 쌓인 직육면체의 부피는 몇 cm³인가요? (단위 정육면체의 부피 = 1cm³)`,
    '',
    cubes,
    'cm³',
    `A rectangular prism has ${l * w} unit cubes per layer and ${h} layers. What is its volume in cm³?`,
  );
}

// [M5 Topic B] 직육면체의 부피 공식과 복합 입체 (5.MD.5)
export function m5VolumeFormula(random) {
  const mode = randomInt(random, 0, 1);
  if (mode === 0) {
    // V = l * w * h
    const l = randomInt(random, 4, 12);
    const w = randomInt(random, 3, 8);
    const h = randomInt(random, 2, 6);
    const vol = l * w * h;
    return wordQ(
      `가로 ${l}cm, 세로 ${w}cm, 높이 ${h}cm인 직육면체의 부피를 구하세요.`,
      '',
      vol,
      'cm³',
      `Find the volume of a rectangular prism measuring ${l} cm by ${w} cm by ${h} cm.`,
    );
  }
  // V = 밑넓이(Base) × 높이
  const base = randomInt(random, 25, 75);
  const h = randomInt(random, 4, 10);
  const vol = base * h;
  return wordQ(
    `어떤 직육면체의 밑넓이가 ${base}cm²이고 높이가 ${h}cm입니다. 이 직육면체의 부피는 몇 cm³인가요?`,
    '',
    vol,
    'cm³',
    `A rectangular prism has a base area of ${base} cm² and a height of ${h} cm. What is its volume?`,
  );
}

// [M5 Topic C] 분수 변을 가진 직사각형의 넓이 (5.NF.4b)
export function m5AreaFractionalSides(random) {
  const wWhole = randomInt(random, 2, 4);
  const wDenom = pick(random, [2, 3, 4]);
  const wNum = 1;
  const hWhole = randomInt(random, 1, 3);
  const hDenom = pick(random, [2, 3]);
  const hNum = 1;

  const wImp = wWhole * wDenom + wNum;
  const hImp = hWhole * hDenom + hNum;
  const areaNum = wImp * hImp;
  const areaDenom = wDenom * hDenom;
  const ans = fractionAnswer(areaNum, areaDenom);

  return wordQ(
    `가로가 ${wWhole} ${wNum}/${wDenom}m이고 세로가 ${hWhole} ${hNum}/${hDenom}m인 직사각형 모양 화단의 넓이는 몇 m²인가요?`,
    '',
    ans,
    'm²',
    `Find the area of a rectangle with length ${wWhole} ${wNum}/${wDenom} m and width ${hWhole} ${hNum}/${hDenom} m.`,
  );
}

// [M5 Topic D] 사각형의 성질과 위계적 분류 (5.G.3, 5.G.4)
export function m5QuadrilateralHierarchy(random) {
  const questions = [
    {
      q: '평행한 변이 적어도 한 쌍 있는 사각형을 무엇이라고 하나요? (사다리꼴, 평행사변형, 직사각형 중 선택)',
      qEn: 'A quadrilateral with at least one pair of parallel sides is called a what? (trapezoid, parallelogram, rectangle)',
      ans: '사다리꼴',
    },
    {
      q: '마주 보는 두 쌍의 변이 서로 평행한 사각형을 무엇이라고 하나요?',
      qEn: 'A quadrilateral where both pairs of opposite sides are parallel is called a what?',
      ans: '평행사변형',
    },
    {
      q: '네 각이 모두 직각인 사각형을 무엇이라고 하나요?',
      qEn: 'A quadrilateral with four right angles is called a what?',
      ans: '직사각형',
    },
    {
      q: '네 변의 길이가 모두 같은 사각형을 무엇이라고 하나요?',
      qEn: 'A quadrilateral with four sides of equal length is called a what?',
      ans: '마름모',
    },
    {
      q: '네 변의 길이가 모두 같고 네 각이 모두 직각인 사각형을 무엇이라고 하나요?',
      qEn: 'A quadrilateral with four equal sides and four right angles is called a what?',
      ans: '정사각형',
    },
    {
      q: '모든 정사각형은 직사각형이라고 말할 수 있나요? (예 또는 아니오로 답하세요)',
      qEn: 'Is every square also a rectangle? (Answer: yes or no)',
      ans: '예',
    },
  ];
  const item = pick(random, questions);
  return wordQ(item.q, '', item.ans, '', item.qEn);
}

// =========================================================================
// MODULE 6: Problem Solving with the Coordinate Plane (Topics A - F)
// =========================================================================

// [M6 Topic A] 좌표평면의 기초와 순서쌍 (5.G.1)
export function m6CoordinatePlaneBasics(random) {
  const x = randomInt(random, 1, 9);
  const y = randomInt(random, 1, 9);
  const mode = randomInt(random, 0, 1);
  if (mode === 0) {
    return wordQ(
      `원점 (0, 0)에서 시작하여 x축 방향으로 ${x}칸, y축 방향으로 ${y}칸 이동한 점의 좌표를 순서쌍 (x, y) 형태로 쓰세요.`,
      '',
      `(${x}, ${y})`,
      '',
      `Starting at origin (0, 0), move ${x} units along the x-axis and ${y} units along the y-axis. Write the coordinate pair.`,
    );
  }
  return wordQ(
    `점 P의 좌표가 (${x}, ${y})일 때, 이 점의 x좌표는 얼마인가요?`,
    '',
    x,
    '',
    `Point P has coordinates (${x}, ${y}). What is its x-coordinate?`,
  );
}

// [M6 Topic B] 규칙에 따른 좌표 패턴과 직선 (5.OA.3, 5.G.2)
export function m6CoordinatePatterns(random) {
  const mode = randomInt(random, 0, 1);
  if (mode === 0) {
    // y = x + c 규칙
    const c = randomInt(random, 2, 6);
    const x = randomInt(random, 2, 7);
    const y = x + c;
    return wordQ(
      `규칙 'y는 x보다 ${c}만큼 더 크다'에서 x가 ${x}일 때, 점 (x, y)의 y좌표를 구하세요.`,
      `y = ${x} + ${c}`,
      y,
      '',
      `Using rule 'y is ${c} more than x', what is the y-coordinate when x = ${x}?`,
    );
  }
  // y = m * x 규칙
  const m = pick(random, [2, 3]);
  const x = randomInt(random, 2, 5);
  const y = m * x;
  return wordQ(
    `규칙 'y = ${m} × x'에서 x가 ${x}일 때, 점 (x, y)의 y좌표를 구하세요.`,
    `y = ${m} × ${x}`,
    y,
    '',
    `Using rule 'y = ${m}x', what is the y-coordinate when x = ${x}?`,
  );
}

// [M6 Topic C] 좌표평면 위의 도형과 둘레·넓이 (5.G.1, 5.G.2)
export function m6FiguresCoordinatePlane(random) {
  const x1 = randomInt(random, 1, 4);
  const y1 = randomInt(random, 1, 4);
  const width = randomInt(random, 3, 7);
  const height = randomInt(random, 2, 5);
  const mode = randomInt(random, 0, 1);
  if (mode === 0) {
    // 직사각형 넓이
    const area = width * height;
    return wordQ(
      `좌표평면 위에서 네 점 (${x1}, ${y1}), (${x1 + width}, ${y1}), (${x1 + width}, ${y1 + height}), (${x1}, ${y1 + height})을 꼭짓점으로 하는 직사각형의 넓이를 구하세요.`,
      '',
      area,
      '',
      `Find the area of the rectangle formed by (${x1}, ${y1}), (${x1 + width}, ${y1}), (${x1 + width}, ${y1 + height}), (${x1}, ${y1 + height}).`,
    );
  }
  // 두 점 사이의 거리
  return wordQ(
    `좌표평면 위의 두 점 A(${x1}, ${y1})와 B(${x1 + width}, ${y1}) 사이의 선분의 길이는 얼마인가요?`,
    '',
    width,
    '',
    `What is the length of the segment between points A(${x1}, ${y1}) and B(${x1 + width}, ${y1})?`,
  );
}

// [M6 Topic D] 꺾은선그래프 해석과 실생활 문제 (5.OA.3, 5.G.2)
export function m6LineGraphs(random) {
  const times = ['오전 9시', '오전 10시', '오전 11시', '낮 12시'];
  const timesEn = ['9 AM', '10 AM', '11 AM', '12 PM'];
  const baseTemp = randomInt(random, 12, 18);
  const t0 = baseTemp;
  const t1 = t0 + randomInt(random, 1, 3);
  const t2 = t1 + randomInt(random, 2, 4);
  const t3 = t2 + randomInt(random, 1, 3);

  const diff = t3 - t0;
  return wordQ(
    `어느 날 시간별 기온이 ${times[0]}에 ${t0}℃, ${times[1]}에 ${t1}℃, ${times[2]}에 ${t2}℃, ${times[3]}에 ${t3}℃였습니다. ${times[0]}부터 ${times[3]}까지 기온은 몇 ℃ 상승했나요?`,
    '',
    diff,
    '℃',
    `Hourly temperatures were recorded: ${timesEn[0]} (${t0}°C), ${timesEn[1]} (${t1}°C), ${timesEn[2]} (${t2}°C), ${timesEn[3]} (${t3}°C). How many degrees did the temperature rise from ${timesEn[0]} to ${timesEn[3]}?`,
  );
}

// [M6 Topic E] 다단계 복합 문제 해결 (5.NF.2, 5.NF.6, 5.MD.5)
export function m6MultistepWordProblems(random) {
  // 예: 과수원에서 300개의 사과를 수확하여 1/3을 팔고, 남은 것의 1/2을 상자에 담음
  const total = pick(random, [120, 180, 240, 300, 360]);
  const fracSoldDenom = 3;
  const sold = total / fracSoldDenom;
  const remaining = total - sold;
  const boxed = remaining / 2;
  return wordQ(
    `과수원에서 사과 ${total}개를 수확했습니다. 전체의 1/3을 시장에 팔고, 남은 사과의 1/2을 이웃에게 나누어 주었습니다. 마지막으로 남은 사과는 몇 개인가요?`,
    '',
    boxed,
    '개',
    `An orchard harvested ${total} apples. 1/3 were sold at the market, and 1/2 of the remainder was shared with neighbors. How many apples remain?`,
  );
}

// [M6 Topic F] 수학적 규칙과 피보나치/수열 탐구 (5.OA.3)
export function m6YearReviewPatterns(random) {
  const mode = randomInt(random, 0, 1);
  if (mode === 0) {
    // 피보나치 수열 규칙
    const startA = 1;
    const startB = 1;
    const seq = [startA, startB];
    for (let i = 2; i < 7; i += 1) {
      seq.push(seq[i - 1] + seq[i - 2]);
    }
    // seq = [1, 1, 2, 3, 5, 8, 13]
    return wordQ(
      `앞의 두 수를 더해 다음 수가 되는 규칙입니다: ${seq.slice(0, 5).join(', ')}, □, ${seq[6]}. 빈칸에 알맞은 수를 구하세요.`,
      '',
      seq[5],
      '',
      `Each term is the sum of the two preceding terms: ${seq.slice(0, 5).join(', ')}, □, ${seq[6]}. Find the missing number.`,
    );
  }
  // 정사각수(제곱수) 규칙: 1, 4, 9, 16, 25, 36
  const n = randomInt(random, 5, 8);
  const squares = [1, 4, 9, 16];
  return wordQ(
    `정사각수 수열입니다: 1, 4, 9, 16, 25, ... 이 수열의 ${n}번째 수는 얼마인가요?`,
    '',
    n * n,
    '',
    `In the sequence of square numbers: 1, 4, 9, 16, 25, ... what is the ${n}th term?`,
  );
}
