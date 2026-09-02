function randomInt(random, min, max) {
  return Math.floor(random() * (max - min + 1)) + min;
}

function pick(random, values) {
  return values[randomInt(random, 0, values.length - 1)];
}

function vertical(a, b, operator, answer = operator === '+' ? a + b : operator === '-' ? a - b : a * b) {
  return { kind: 'vertical', a, b, operator, answer: String(answer) };
}

function inline(expression, answer) {
  return { kind: 'inline', expression, answer: String(answer) };
}

function gcd(a, b) {
  let left = Math.abs(a);
  let right = Math.abs(b);
  while (right) [left, right] = [right, left % right];
  return left || 1;
}

function fractionAnswer(numerator, denominator) {
  const common = gcd(numerator, denominator);
  const top = numerator / common;
  const bottom = denominator / common;
  if (bottom === 1) return String(top);
  if (top > bottom) return `${Math.floor(top / bottom)} ${top % bottom}/${bottom}`;
  return `${top}/${bottom}`;
}

function decimal(value, places = 3) {
  return Number(value.toFixed(places));
}

function decimalOperation(random, operator) {
  const scale = pick(random, [10, 100, 1000]);
  let a = randomInt(random, 2, scale * 9) / scale;
  let b = randomInt(random, 1, scale * 5) / scale;
  if (operator === '-' && b > a) [a, b] = [b, a];
  const answer = operator === '+' ? a + b : a - b;
  return inline(`${a} ${operator} ${b}`, decimal(answer));
}

function fractionAddSub(random) {
  const same = random() < 0.45;
  const d1 = randomInt(random, 3, 12);
  const d2 = same ? d1 : randomInt(random, 3, 12);
  const operator = random() < 0.55 ? '+' : '-';
  let n1 = randomInt(random, 1, d1 * 2 - 1);
  let n2 = randomInt(random, 1, d2 * 2 - 1);
  if (operator === '-' && n1 * d2 < n2 * d1) [n1, n2] = [n2, n1];
  const numerator = operator === '+' ? n1 * d2 + n2 * d1 : n1 * d2 - n2 * d1;
  return inline(`${n1}/${d1} ${operator} ${n2}/${d2}`, fractionAnswer(numerator, d1 * d2));
}

function fractionMultiply(random) {
  const count = random() < 0.2 ? 3 : 2;
  const parts = Array.from({ length: count }, () => {
    const denominator = randomInt(random, 2, 12);
    return [randomInt(random, 1, denominator * 2), denominator];
  });
  const numerator = parts.reduce((value, part) => value * part[0], 1);
  const denominator = parts.reduce((value, part) => value * part[1], 1);
  return inline(parts.map(([n, d]) => `${n}/${d}`).join(' × '), fractionAnswer(numerator, denominator));
}

function fractionDivide(random) {
  const wholeFirst = random() < 0.35;
  const d1 = randomInt(random, 2, 12);
  const d2 = randomInt(random, 2, 12);
  const n1 = wholeFirst ? randomInt(random, 2, 9) * d1 : randomInt(random, 1, d1 * 2);
  const n2 = randomInt(random, 1, d2 * 2);
  return inline(`${wholeFirst ? n1 / d1 : `${n1}/${d1}`} ÷ ${n2}/${d2}`, fractionAnswer(n1 * d2, d1 * n2));
}

function decimalMultiply(random) {
  const a = randomInt(random, 2, 999) / pick(random, [10, 100]);
  const b = randomInt(random, 2, 99) / pick(random, [1, 10, 100]);
  return inline(`${a} × ${b}`, decimal(a * b, 5));
}

function decimalDivide(random) {
  const divisor = randomInt(random, 2, 25) / pick(random, [1, 10]);
  const quotient = randomInt(random, 2, 200) / pick(random, [1, 10, 100]);
  const dividend = decimal(divisor * quotient, 5);
  return inline(`${dividend} ÷ ${divisor}`, quotient);
}

function mixedNatural(random) {
  const a = randomInt(random, 10, 80);
  const b = randomInt(random, 2, 9);
  const c = randomInt(random, 2, 9);
  const mode = randomInt(random, 0, 3);
  if (mode === 0) return inline(`${a} + ${b} × ${c}`, a + b * c);
  if (mode === 1) return inline(`(${a} - ${b}) × ${c}`, (a - b) * c);
  if (mode === 2) return inline(`${a} - ${b} × ${c}`, a - b * c);
  const product = b * c;
  return inline(`${product} ÷ ${b} + ${a}`, c + a);
}

function factorsMultiples(random) {
  const mode = randomInt(random, 0, 3);
  if (mode === 0) {
    const n = randomInt(random, 12, 90);
    const factors = Array.from({ length: n }, (_, i) => i + 1).filter((value) => n % value === 0);
    return inline(`약수: ${n}`, factors.join(', '));
  }
  const a = randomInt(random, 2, 15);
  const b = randomInt(random, 2, 15);
  if (mode === 1) return inline(`최대공약수: ${a}, ${b}`, gcd(a, b));
  const lcm = a * b / gcd(a, b);
  if (mode === 2) return inline(`최소공배수: ${a}, ${b}`, lcm);
  const count = randomInt(random, 3, 6);
  return inline(`${a}의 ${count}번째 배수`, a * count);
}

function ratioPractice(random) {
  const a = randomInt(random, 2, 90);
  const b = randomInt(random, 2, 90);
  const common = gcd(a, b);
  return inline(`${a} : ${b} → 가장 간단한 비`, `${a / common} : ${b / common}`);
}

function proportionQuestion(prompt, expression, answer, answerSuffix = '', promptEn = '', expressionEn = '') {
  return { kind: 'word', prompt, expression, answer: String(answer), answerSuffix, promptEn, expressionEn };
}

const SIMPLE_RATIOS = [[2, 3], [2, 5], [3, 4], [3, 5], [3, 7], [4, 5], [4, 7], [5, 6], [5, 8], [7, 9]];

function proportionBasic(random) {
  const [a, b] = pick(random, SIMPLE_RATIOS);
  const scale = randomInt(random, 2, 12);
  const mode = randomInt(random, 0, 3);
  const expressions = [
    [`${a} : ${b} = ${a * scale} : □`, b * scale],
    [`${a} : ${b} = □ : ${b * scale}`, a * scale],
    [`□ : ${b} = ${a * scale} : ${b * scale}`, a],
    [`${a} : □ = ${a * scale} : ${b * scale}`, b],
  ];
  return proportionQuestion('다음 비례식에서 □에 알맞은 수를 구하세요.', expressions[mode][0], expressions[mode][1], '', 'Find the number that belongs in □.', expressions[mode][0]);
}

function proportionStory(random) {
  const mode = randomInt(random, 0, 4);
  if (mode === 0) {
    const concentrate = randomInt(random, 2, 5);
    const water = randomInt(random, concentrate + 1, 8);
    const scale = randomInt(random, 2, 6);
    return proportionQuestion(`오렌지 원액과 물을 ${concentrate}:${water}의 비율로 섞습니다. 원액을 ${concentrate * scale}컵 넣었다면 물은 몇 컵 넣어야 할까요?`, '', water * scale, '컵');
  }
  if (mode === 1) {
    const mapCm = randomInt(random, 2, 5);
    const realKm = mapCm * randomInt(random, 3, 7);
    const scale = randomInt(random, 2, 5);
    return proportionQuestion(`지도에서 ${mapCm}cm가 실제 거리 ${realKm}km를 나타냅니다. 지도에서 두 곳 사이가 ${mapCm * scale}cm라면 실제 거리는 몇 km일까요?`, '', realKm * scale, 'km');
  }
  if (mode === 2) {
    const count = randomInt(random, 2, 6);
    const unitPrice = randomInt(random, 5, 20) * 100;
    const wanted = count * randomInt(random, 2, 5);
    return proportionQuestion(`사과 ${count}개의 가격이 ${(count * unitPrice).toLocaleString('ko-KR')}원입니다. 같은 가격으로 사과 ${wanted}개를 산다면 얼마일까요?`, '', wanted * unitPrice, '원');
  }
  if (mode === 3) {
    const cookies = pick(random, [6, 8, 10, 12]);
    const gramsEach = pick(random, [10, 15, 20, 25]);
    const wanted = cookies * randomInt(random, 2, 4);
    return proportionQuestion(`쿠키 ${cookies}개를 만드는 데 밀가루 ${cookies * gramsEach}g이 필요합니다. 같은 크기의 쿠키 ${wanted}개를 만들려면 밀가루가 몇 g 필요할까요?`, '', wanted * gramsEach, 'g');
  }
  const hours = randomInt(random, 2, 4);
  const speed = randomInt(random, 4, 10) * 10;
  const wantedHours = hours + randomInt(random, 2, 5);
  return proportionQuestion(`자동차가 일정한 빠르기로 ${hours}시간 동안 ${hours * speed}km를 갔습니다. 같은 빠르기로 ${wantedHours}시간 동안 간다면 몇 km를 갈까요?`, '', wantedHours * speed, 'km');
}

function proportionalDistributionBasic(random) {
  const threeParts = random() < 0.35;
  const ratios = threeParts ? pick(random, [[2, 3, 5], [3, 4, 5], [4, 5, 6], [2, 4, 7]]) : pick(random, SIMPLE_RATIOS);
  const unit = randomInt(random, 4, 20);
  const total = ratios.reduce((sum, value) => sum + value, 0) * unit;
  const shares = ratios.map((value) => value * unit);
  if (!threeParts && random() < 0.3) {
    return proportionQuestion(`${total}을 ${ratios.join(':')}로 비례배분했을 때 큰 수는 얼마인가요?`, '', Math.max(...shares));
  }
  return proportionQuestion(`${total}을 ${ratios.join(':')}로 비례배분하세요.`, '', shares.join(', '), '', `Divide ${total} in the ratio ${ratios.join(':')}.`);
}

function proportionalDistributionStory(random) {
  const mode = randomInt(random, 0, 4);
  if (mode === 0) {
    const ratios = pick(random, [[4, 3], [5, 3], [5, 4]]);
    const unit = randomInt(random, 4, 12) * 1000;
    const total = (ratios[0] + ratios[1]) * unit;
    return proportionQuestion(`형과 동생이 ${total.toLocaleString('ko-KR')}원을 ${ratios.join(':')}의 비율로 나누어 가지려고 합니다. 형과 동생은 각각 얼마씩 가지게 될까요?`, '', `${ratios[0] * unit}, ${ratios[1] * unit}`, '원');
  }
  if (mode === 1) {
    const ratios = pick(random, [[5, 3], [4, 5], [7, 2]]);
    const unit = randomInt(random, 3, 10);
    const total = (ratios[0] + ratios[1]) * unit;
    return proportionQuestion(`사탕 ${total}개를 민수와 지수에게 ${ratios.join(':')}의 비율로 나누어 주려고 합니다. 두 사람은 각각 몇 개씩 받게 될까요?`, '', `${ratios[0] * unit}, ${ratios[1] * unit}`, '개');
  }
  if (mode === 2) {
    const ratios = pick(random, [[2, 3, 4], [2, 3, 5], [3, 4, 5]]);
    const unit = randomInt(random, 2, 6) * 10000;
    const total = ratios.reduce((sum, value) => sum + value, 0) * unit;
    return proportionQuestion(`세 사람이 받은 상금 ${total.toLocaleString('ko-KR')}원을 기여도에 따라 ${ratios.join(':')}의 비율로 나누려고 합니다. 차례대로 얼마씩 받게 될까요?`, '', ratios.map((value) => value * unit).join(', '), '원');
  }
  if (mode === 3) {
    const ratios = pick(random, [[3, 2, 5], [2, 3, 5], [4, 3, 3]]);
    const unit = randomInt(random, 5, 12);
    const total = ratios.reduce((sum, value) => sum + value, 0) * unit;
    return proportionQuestion(`빨간색, 파란색, 노란색 색종이를 ${ratios.join(':')}의 비율로 준비했습니다. 전체가 ${total}장이라면 각 색깔은 몇 장일까요?`, '', ratios.map((value) => value * unit).join(', '), '장');
  }
  const ratios = pick(random, [[3, 4], [2, 5], [5, 7]]);
  const unit = randomInt(random, 5, 15);
  const total = (ratios[0] + ratios[1]) * unit;
  return proportionQuestion(`길이가 ${total}m인 길을 두 구간으로 나누려고 합니다. 두 구간 길이의 비가 ${ratios.join(':')}라면 각각 몇 m일까요?`, '', `${ratios[0] * unit}, ${ratios[1] * unit}`, 'm');
}

function proportionApplication(random) {
  const mode = randomInt(random, 0, 4);
  if (mode === 0) {
    const ratios = pick(random, SIMPLE_RATIOS);
    const unit = randomInt(random, 4, 12);
    const total = (ratios[0] + ratios[1]) * unit;
    return proportionQuestion(`두 수의 비가 ${ratios.join(':')}이고 두 수의 합이 ${total}입니다. 두 수를 각각 구하세요.`, '', `${ratios[0] * unit}, ${ratios[1] * unit}`);
  }
  if (mode === 1) {
    const ratios = pick(random, SIMPLE_RATIOS.filter(([a, b]) => b - a >= 2));
    const unit = randomInt(random, 3, 10);
    const difference = (ratios[1] - ratios[0]) * unit;
    return proportionQuestion(`두 수의 비가 ${ratios.join(':')}이고 두 수의 차가 ${difference}입니다. 두 수를 각각 구하세요.`, '', `${ratios[0] * unit}, ${ratios[1] * unit}`);
  }
  if (mode === 2) {
    const ratios = pick(random, [[2, 3, 5], [3, 4, 6], [2, 5, 7]]);
    const unit = randomInt(random, 4, 10);
    const known = ratios[2] * unit;
    const total = ratios.reduce((sum, value) => sum + value, 0) * unit;
    return proportionQuestion(`A, B, C 세 사람이 구슬을 ${ratios.join(':')}의 비율로 가지고 있습니다. C의 구슬이 ${known}개라면 세 사람의 구슬은 모두 몇 개일까요?`, '', total, '개');
  }
  if (mode === 3) {
    const ratios = pick(random, [[4, 5], [3, 5], [5, 7]]);
    const unit = randomInt(random, 3, 7);
    const total = (ratios[0] + ratios[1]) * unit;
    return proportionQuestion(`어떤 반의 남학생 수와 여학생 수의 비가 ${ratios.join(':')}입니다. 학생이 모두 ${total}명이라면 남학생과 여학생은 각각 몇 명일까요?`, '', `${ratios[0] * unit}, ${ratios[1] * unit}`, '명');
  }
  const ratios = pick(random, SIMPLE_RATIOS.filter(([a, b]) => b > a));
  const unit = randomInt(random, 3, 9);
  const difference = (ratios[1] - ratios[0]) * unit;
  return proportionQuestion(`빨간 구슬과 파란 구슬 수의 비가 ${ratios.join(':')}입니다. 파란 구슬이 빨간 구슬보다 ${difference}개 더 많다면 각각 몇 개일까요?`, '', `${ratios[0] * unit}, ${ratios[1] * unit}`, '개');
}

function oneDigitWithinNine(random) {
  if (random() < 0.5) {
    const a = randomInt(random, 1, 8);
    const b = randomInt(random, 1, 9 - a);
    return inline(`${a} + ${b}`, a + b);
  }
  const a = randomInt(random, 2, 9);
  const b = randomInt(random, 1, a);
  return inline(`${a} - ${b}`, a - b);
}

function threeNumbersWithinNine(random) {
  if (random() < 0.55) {
    const a = randomInt(random, 1, 6);
    const b = randomInt(random, 1, 8 - a);
    const c = randomInt(random, 1, 9 - a - b);
    return inline(`${a} + ${b} + ${c}`, a + b + c);
  }
  const a = randomInt(random, 4, 9);
  const b = randomInt(random, 1, a - 1);
  const c = randomInt(random, 1, a - b);
  return inline(`${a} - ${b} - ${c}`, a - b - c);
}

function twoDigitOneDigit(random, mode) {
  const operator = mode.includes('sub') ? '-' : '+';
  let ones;
  let b;
  if (mode === 'add-no-carry') {
    ones = randomInt(random, 1, 8);
    b = randomInt(random, 1, 9 - ones);
  } else if (mode === 'add-carry') {
    ones = randomInt(random, 2, 9);
    b = randomInt(random, 10 - ones, 9);
  } else if (mode === 'sub-no-borrow') {
    ones = randomInt(random, 1, 9);
    b = randomInt(random, 1, ones);
  } else {
    ones = randomInt(random, 0, 7);
    b = randomInt(random, ones + 1, 9);
  }
  const a = randomInt(random, 1, 8) * 10 + ones;
  return vertical(a, b, operator);
}

function twoDigitPair(random, carry) {
  const operator = random() < 0.5 ? '+' : '-';
  if (operator === '+') {
    let a = randomInt(random, 10, 79);
    let b = randomInt(random, 10, 99 - a);
    const hasCarry = (a % 10) + (b % 10) >= 10;
    if (hasCarry !== carry) return twoDigitPair(random, carry);
    return vertical(a, b, '+');
  }
  let a = randomInt(random, 20, 99);
  let b = randomInt(random, 10, a);
  const hasBorrow = a % 10 < b % 10;
  if (hasBorrow !== carry) return twoDigitPair(random, carry);
  return vertical(a, b, '-');
}

function threeNumberUnder100(random) {
  if (random() < 0.5) {
    const a = randomInt(random, 5, 50);
    const b = randomInt(random, 2, 75 - a);
    const c = randomInt(random, 1, 99 - a - b);
    return inline(`${a} + ${b} + ${c}`, a + b + c);
  }
  const a = randomInt(random, 30, 99);
  const b = randomInt(random, 5, a - 5);
  const c = randomInt(random, 1, a - b);
  return inline(`${a} - ${b} - ${c}`, a - b - c);
}

function largeAddSub(random) {
  const digits = random() < 0.35 ? 4 : 3;
  const min = digits === 4 ? 1000 : 100;
  const max = digits === 4 ? 8999 : 899;
  const operator = random() < 0.55 ? '+' : '-';
  const a = randomInt(random, min, max);
  const b = operator === '+' ? randomInt(random, min, Math.min(max, 9999 - a)) : randomInt(random, min, a);
  return vertical(a, b, operator);
}

function multiply(random, digits, multiplierDigits = 1) {
  const min = 10 ** (digits - 1);
  const max = 10 ** digits - 1;
  const bMin = multiplierDigits === 1 ? 2 : 10;
  const bMax = multiplierDigits === 1 ? 9 : 29;
  const a = randomInt(random, min, max);
  const b = randomInt(random, bMin, bMax);
  return vertical(a, b, '×', a * b);
}

function exactDivision(random, quotientMin = 2, quotientMax = 12) {
  const divisor = randomInt(random, 2, 9);
  const quotient = randomInt(random, quotientMin, quotientMax);
  return inline(`${divisor * quotient} ÷ ${divisor}`, quotient);
}

function fractionPractice(random) {
  const denominator = randomInt(random, 3, 9);
  const mode = randomInt(random, 0, 2);
  if (mode === 0) {
    const whole = randomInt(random, 1, 8);
    const numerator = randomInt(random, 1, denominator - 1);
    return inline(`${whole} ${numerator}/${denominator} → 가분수`, `${whole * denominator + numerator}/${denominator}`);
  }
  if (mode === 1) {
    const whole = randomInt(random, 1, 8);
    const numerator = randomInt(random, 1, denominator - 1);
    const improper = whole * denominator + numerator;
    return inline(`${improper}/${denominator} → 대분수`, `${whole} ${numerator}/${denominator}`);
  }
  const left = randomInt(random, 1, denominator * 2 - 1);
  let right = randomInt(random, 1, denominator * 2 - 1);
  if (right === left) right = right === denominator * 2 - 1 ? right - 1 : right + 1;
  return inline(`${left}/${denominator} □ ${right}/${denominator}`, left > right ? '>' : '<');
}

export const GRADE_CATALOG = [
  {
    id: '1', label: '1학년', units: [
      { id: 'g1-bonds', label: '수 가르기와 모으기', description: '10 이하 수를 두 수로 가르거나 모으기', make: (r) => { const whole = randomInt(r, 3, 10); const part = randomInt(r, 1, whole - 1); return r() < 0.5 ? inline(`${whole} = ${part} + □`, whole - part) : inline(`${whole} = □ + ${whole - part}`, part); } },
      { id: 'g1-within-9', label: '한 자리 수 덧셈과 뺄셈', description: '합과 차가 9 이하인 계산', make: oneDigitWithinNine },
      { id: 'g1-three-numbers', label: '세 수의 덧셈과 뺄셈', description: '세 수를 순서대로 계산하기', make: threeNumbersWithinNine },
      { id: 'g1-two-digit-no-carry', label: '두 자리 수 ± 한 자리 수', description: '받아올림·받아내림 없는 계산', make: (r) => twoDigitOneDigit(r, pick(r, ['add-no-carry', 'sub-no-borrow'])) },
      { id: 'g1-two-digit-carry', label: '받아올림·받아내림', description: '두 자리 수와 한 자리 수 계산', make: (r) => twoDigitOneDigit(r, pick(r, ['add-carry', 'sub-borrow'])) },
    ],
  },
  {
    id: '2', label: '2학년', units: [
      { id: 'g2-no-carry', label: '두 자리 덧셈과 뺄셈 - 기초', description: '받아올림·받아내림 없는 두 자리 계산', make: (r) => twoDigitPair(r, false) },
      { id: 'g2-carry', label: '두 자리 덧셈과 뺄셈 - 심화', description: '받아올림·받아내림이 있는 두 자리 계산', make: (r) => twoDigitPair(r, true) },
      { id: 'g2-three-numbers', label: '세 수의 계산', description: '합과 차가 100 이하인 세 수 계산', make: threeNumberUnder100 },
      { id: 'g2-tables-2-5', label: '곱셈구구 2~5단', description: '2, 3, 4, 5단 곱셈구구', make: (r) => { const a = pick(r, [2, 3, 4, 5]); const b = randomInt(r, 1, 9); return inline(`${a} × ${b}`, a * b); } },
      { id: 'g2-tables-6-9', label: '곱셈구구 6~9단', description: '6, 7, 8, 9단 곱셈구구', make: (r) => { const a = pick(r, [6, 7, 8, 9]); const b = randomInt(r, 1, 9); return inline(`${a} × ${b}`, a * b); } },
      { id: 'g2-tables-all', label: '곱셈구구 종합', description: '2단부터 9단까지 무작위', make: (r) => { const a = randomInt(r, 2, 9); const b = randomInt(r, 1, 9); return inline(`${a} × ${b}`, a * b); } },
      { id: 'g2-length', label: '길이 재기', description: 'cm와 m 단위 길이의 합과 차', make: lengthCalcSimple },
      { id: 'g2-time', label: '시각과 시간', description: '시각에서 몇 분 후의 시각 구하기', make: timeAddCalc },
      { id: 'g2-clock-read', label: '시계 보고 시각 읽기', description: '시계 그림을 보고 몇 시 몇 분인지 읽기', make: clockRead },
    ],
  },
  {
    id: '3', label: '3학년', units: [
      { id: 'g3-add-sub', label: '세·네 자리 덧셈과 뺄셈', description: '받아올림·받아내림을 포함한 큰 수 계산', make: largeAddSub },
      { id: 'g3-division-basic', label: '나눗셈 기초', description: '곱셈구구 범위의 나누어떨어지는 나눗셈', make: (r) => exactDivision(r, 2, 9) },
      { id: 'g3-multiply-2x1', label: '두 자리 수 × 한 자리 수', description: '두 자리 수에 한 자리 수 곱하기', make: (r) => multiply(r, 2) },
      { id: 'g3-multiply-3x1', label: '세 자리 수 × 한 자리 수', description: '세 자리 수에 한 자리 수 곱하기', make: (r) => multiply(r, 3) },
      { id: 'g3-multiply-2x2', label: '두 자리 수 × 두 자리 수', description: '두 자리 수끼리 곱하기', make: (r) => multiply(r, 2, 2) },
      { id: 'g3-division-exact', label: '두 자리 수 ÷ 한 자리 수', description: '나머지가 없는 두 자리 수 나눗셈', make: (r) => exactDivision(r, 10, 30) },
      { id: 'g3-fractions', label: '분수', description: '가분수·대분수 변환과 크기 비교', make: fractionPractice },
      { id: 'g3-number-patterns', label: '수의 규칙 찾기', description: '일정하게 더하거나 곱하는 수열의 다음 수 찾기', make: (r) => makeElementarySequencePattern(r, randomInt, pick) },
      { id: 'g3-length-time-units', label: '길이와 시간의 단위', description: 'mm·cm·m·km, 분·초 단위 변환', make: measurementUnitConvert },
      { id: 'g3-capacity-weight', label: '들이와 무게', description: 'L·mL, g·kg 단위 변환과 덧셈', make: weightCapacityConvert },
      { id: 'g3-circle', label: '원', description: '원의 반지름과 지름의 관계', make: circleBasic },
      { id: 'g3-line-ray-segment', label: '선분·반직선·직선', description: '그림을 보고 선분, 반직선, 직선을 구별하기', make: lineRaySegmentClassify },
      { id: 'g3-count-figures', label: '점을 이용한 선분·직선·반직선 세기', description: '여러 점을 이어 만들 수 있는 도형의 개수 구하기', make: countFiguresFromPoints },
      { id: 'g3-division-remainder', label: '나눗셈의 몫과 나머지', description: '두세 자리 수를 한 자리 수로 나누기', make: divisionRemainder3 },
      { id: 'g3-circle-properties', label: '원의 성질', description: '맞닿은 원의 길이, 두 원의 중심 사이 거리, 원의 크기 비교', make: circleProperties },
      { id: 'g3-fraction-of-whole', label: '분수로 나타내기', description: '테이프 그림을 보고 부분을 분수로 나타내거나 값 구하기', make: fractionOfWhole },
      { id: 'g3-data-table', label: '표', description: '표를 보고 빈칸에 알맞은 수 구하기', make: dataTableMissing },
      { id: 'g3-pictograph', label: '그림그래프', description: '그림그래프를 보고 값을 읽고 비교하기', make: pictographRead },
    ],
  },
  {
    id: '4', label: '4학년', units: [
      { id: 'g4-large-multiply', label: '큰 수의 곱셈', description: '두세 자리 수와 한두 자리 수의 곱셈', make: (r) => multiply(r, pick(r, [2, 3, 4]), pick(r, [1, 2])) },
      { id: 'g4-large-division', label: '큰 수의 나눗셈', description: '두세 자리 수를 한두 자리 수로 나누기', make: (r) => { const divisor = randomInt(r, 2, 29); const quotient = randomInt(r, 3, 99); const remainder = r() < 0.35 ? randomInt(r, 1, divisor - 1) : 0; return inline(`${divisor * quotient + remainder} ÷ ${divisor}`, remainder ? `${quotient} R ${remainder}` : quotient); } },
      { id: 'g4-fraction-add-sub', label: '분수의 덧셈과 뺄셈', description: '분모가 같은 진분수·가분수·대분수 계산', make: (r) => { const d = randomInt(r, 3, 12); let a = randomInt(r, 1, d * 3); let b = randomInt(r, 1, d * 2); const op = r() < 0.55 ? '+' : '-'; if (op === '-' && b > a) [a, b] = [b, a]; return inline(`${a}/${d} ${op} ${b}/${d}`, fractionAnswer(op === '+' ? a + b : a - b, d)); } },
      { id: 'g4-decimal-add-sub', label: '소수의 덧셈과 뺄셈', description: '소수 한 자리부터 세 자리까지의 계산', make: (r) => decimalOperation(r, r() < 0.55 ? '+' : '-') },
      { id: 'g4-number-patterns', label: '수의 규칙과 수열', description: '덧셈·곱셈 규칙을 찾아 빈 항 구하기', make: (r) => makeElementarySequencePattern(r, randomInt, pick) },
      { id: 'g4-growing-block-patterns', label: '묶음 수열의 규칙', description: '길이가 하나씩 늘어나는 묶음에서 항의 위치 찾기', make: (r) => makeElementaryGrowingBlockPattern(r, randomInt, pick) },
      { id: 'g4-angle', label: '각도', description: '각도의 합과 차, 예각·직각·둔각 분류', make: angleBasic },
      { id: 'g4-polygon-angle', label: '삼각형과 사각형의 각', description: '내각의 합을 이용해 나머지 각 구하기', make: polygonAngleMissing },
    ],
  },
  {
    id: '5', label: '5학년', units: [
      { id: 'g5-mixed-natural', label: '자연수의 혼합 계산', description: '괄호와 사칙연산 순서를 포함한 계산', make: mixedNatural },
      { id: 'g5-factors-multiples', label: '약수와 배수', description: '약수·배수·최대공약수·최소공배수', make: factorsMultiples },
      { id: 'g5-reduce-common-denominator', label: '약분과 통분', description: '기약분수 만들기와 분수의 크기 비교', make: (r) => { const n = randomInt(r, 1, 9); const d = randomInt(r, n + 1, 12); const k = randomInt(r, 2, 8); return inline(`${n * k}/${d * k} → 기약분수`, fractionAnswer(n * k, d * k)); } },
      { id: 'g5-fraction-add-sub', label: '분수의 덧셈과 뺄셈', description: '분모가 다른 분수의 덧셈과 뺄셈', make: fractionAddSub },
      { id: 'g5-fraction-multiply', label: '분수의 곱셈', description: '분수와 자연수, 두세 분수의 곱셈', make: fractionMultiply },
      { id: 'g5-decimal-multiply', label: '소수의 곱셈', description: '소수와 자연수 또는 소수의 곱셈', make: decimalMultiply },
      { id: 'g5-perimeter-area', label: '다각형의 둘레와 넓이', description: '직사각형·삼각형·평행사변형·사다리꼴·마름모, 직각으로 이루어진 도형', make: perimeterArea },
      { id: 'g5-range-round', label: '수의 범위와 어림', description: '이상·이하·초과·미만과 올림·버림·반올림', make: rangeRound },
      { id: 'g5-average-probability', label: '평균과 가능성', description: '자료의 평균 구하기와 가능성을 분수로 나타내기', make: averageProbability },
      { id: 'g5-solid-figure', label: '직육면체와 정육면체', description: '면·모서리·꼭짓점의 개수와 모서리 길이의 합', make: solidFigureBasic },
      { id: 'g5-congruence-symmetry', label: '합동과 대칭', description: '대응변·대응각과 선대칭·점대칭의 성질', make: congruenceSymmetry },
      { id: 'g5-function-table', label: '규칙과 대응', description: '표에서 대응 규칙을 찾아 값 구하기', make: functionTable },
      { id: 'g5-block-pattern', label: '계단 모양 규칙', description: '정사각형이 늘어나는 계단 모양을 보고 몇 번째 모양의 정사각형 수 구하기', make: blockStaircasePattern },
    ],
  },
  {
    id: '6', label: '6학년', units: [
      { id: 'g6-fraction-divide-natural', label: '분수 ÷ 자연수', description: '진분수·가분수·대분수를 자연수로 나누기', make: (r) => { const d = randomInt(r, 2, 15); const n = randomInt(r, 1, d * 3); const whole = randomInt(r, 2, 12); return inline(`${n}/${d} ÷ ${whole}`, fractionAnswer(n, d * whole)); } },
      { id: 'g6-decimal-divide-natural', label: '소수 ÷ 자연수', description: '나누어떨어지는 소수 나눗셈', make: decimalDivide },
      { id: 'g6-ratio', label: '비와 비율', description: '비를 간단히 나타내고 분수·소수로 바꾸기', make: ratioPractice },
      { id: 'g6-fraction-divide', label: '분수의 나눗셈', description: '자연수와 분수를 포함한 분수 나눗셈', make: fractionDivide },
      { id: 'g6-decimal-divide', label: '소수의 나눗셈', description: '자릿수가 다른 소수끼리의 나눗셈', make: decimalDivide },
      { id: 'g6-proportion-basic', label: '비례식 기본형', description: '비례식의 빈칸에 알맞은 수 구하기', make: proportionBasic },
      { id: 'g6-proportion-story', label: '비례식을 세우는 문장제', description: '생활 속 상황을 비례식으로 해결하기', make: proportionStory },
      { id: 'g6-distribution-basic', label: '비례배분 기본형', description: '전체를 주어진 비로 나누기', make: proportionalDistributionBasic },
      { id: 'g6-distribution-story', label: '비례배분 문장제', description: '생활 속 양을 주어진 비로 나누기', make: proportionalDistributionStory },
      { id: 'g6-proportion-application', label: '비례식과 비례배분 응용', description: '합·차·일부의 양을 이용한 응용 문제', make: proportionApplication },
      { id: 'g6-percentage-basic', label: '백분율의 표현', description: '분수·소수·백분율 서로 바꾸기', make: percentageBasic },
      { id: 'g6-percentage-word', label: '백분율 문장제', description: '할인 금액, 전체 중 비율 등 생활 속 백분율', make: percentageWord },
      { id: 'g6-circle-measure', label: '원의 원주와 넓이', description: '원주율 3.14를 이용한 원주와 넓이', make: circleMeasure },
      { id: 'g6-prism-pyramid', label: '각기둥과 각뿔', description: '면·모서리·꼭짓점의 개수 구하기', make: prismPyramidCounts },
      { id: 'g6-volume-surface', label: '직육면체의 부피와 겉넓이', description: '직육면체·정육면체의 부피와 겉넓이', make: volumeSurfaceArea },
      { id: 'g6-data-graph', label: '띠그래프와 원그래프', description: '백분율 자료를 해석하는 문장제', make: dataGraphWord },
    ],
  },
];

const ENGLISH = {
  grades: { '1': 'Grade 1', '2': 'Grade 2', '3': 'Grade 3', '4': 'Grade 4', '5': 'Grade 5', '6': 'Grade 6' },
  units: {
    'g1-bonds': ['Number bonds', 'Split and combine numbers up to 10'], 'g1-within-9': ['One-digit addition & subtraction', 'Sums and differences up to 9'], 'g1-three-numbers': ['Three-number operations', 'Calculate three numbers in order'], 'g1-two-digit-no-carry': ['Two-digit ± one-digit', 'No regrouping'], 'g1-two-digit-carry': ['Regrouping practice', 'Two-digit and one-digit operations'],
    'g2-no-carry': ['Two-digit operations: basic', 'No regrouping'], 'g2-carry': ['Two-digit operations: advanced', 'With regrouping'], 'g2-three-numbers': ['Three-number operations', 'Sums and differences up to 100'], 'g2-tables-2-5': ['Times tables 2–5', 'Multiplication facts 2 through 5'], 'g2-tables-6-9': ['Times tables 6–9', 'Multiplication facts 6 through 9'], 'g2-tables-all': ['All times tables', 'Random facts from 2 through 9'], 'g2-length': ['Measuring length', 'Sums and differences of cm and m'], 'g2-time': ['Clock time', 'Find the time some minutes later'], 'g2-clock-read': ['Reading a clock', 'Read the hour and minute from a clock face'],
    'g3-add-sub': ['3- and 4-digit operations', 'Large-number addition and subtraction'], 'g3-division-basic': ['Division basics', 'Exact division within multiplication facts'], 'g3-multiply-2x1': ['2-digit × 1-digit', 'Multiply a two-digit number'], 'g3-multiply-3x1': ['3-digit × 1-digit', 'Multiply a three-digit number'], 'g3-multiply-2x2': ['2-digit × 2-digit', 'Multiply two two-digit numbers'], 'g3-division-exact': ['2-digit ÷ 1-digit', 'Exact two-digit division'], 'g3-fractions': ['Fractions', 'Improper and mixed fractions; comparison'], 'g3-number-patterns': ['Number patterns', 'Continue additive and multiplicative sequences'], 'g3-length-time-units': ['Length & time units', 'Convert mm, cm, m, km, minutes, seconds'], 'g3-capacity-weight': ['Capacity & weight', 'Convert and add L, mL, g, kg'], 'g3-circle': ['Circles', 'Relate radius and diameter'], 'g3-line-ray-segment': ['Segments, rays & lines', 'Identify the figure shown'], 'g3-count-figures': ['Counting segments, rays & lines', 'Count the figures formed by several points'], 'g3-division-remainder': ['Division with remainders', 'Divide 2–3 digit numbers by a 1-digit number'], 'g3-circle-properties': ['Properties of circles', 'Touching circles, center distance, and size comparison'], 'g3-fraction-of-whole': ['Fractions of a whole', 'Read a shaded part as a fraction or find its value from a tape diagram'], 'g3-data-table': ['Tables', 'Find the missing value in a table'], 'g3-pictograph': ['Pictographs', 'Read and compare values from a pictograph'],
    'g4-large-multiply': ['Large-number multiplication', '2–4 digit numbers times 1–2 digit numbers'], 'g4-large-division': ['Large-number division', 'Divide 2–3 digit numbers'], 'g4-fraction-add-sub': ['Fraction addition & subtraction', 'Like denominators and mixed forms'], 'g4-decimal-add-sub': ['Decimal addition & subtraction', 'Tenths through thousandths'], 'g4-number-patterns': ['Patterns & sequences', 'Find missing terms from additive and multiplicative rules'], 'g4-growing-block-patterns': ['Growing block patterns', 'Locate terms in groups whose lengths increase'], 'g4-angle': ['Angles', 'Add, subtract, and classify angles'], 'g4-polygon-angle': ['Triangle & quadrilateral angles', 'Use the angle-sum property to find a missing angle'],
    'g5-mixed-natural': ['Mixed whole-number operations', 'Order of operations and parentheses'], 'g5-factors-multiples': ['Factors & multiples', 'GCF, LCM, factors and multiples'], 'g5-reduce-common-denominator': ['Simplifying fractions', 'Reduce and compare fractions'], 'g5-fraction-add-sub': ['Fraction addition & subtraction', 'Unlike denominators'], 'g5-fraction-multiply': ['Fraction multiplication', 'Multiply fractions and whole numbers'], 'g5-decimal-multiply': ['Decimal multiplication', 'Multiply decimals and whole numbers'], 'g5-perimeter-area': ['Perimeter & area', 'Rectangles, triangles, parallelograms, trapezoids, rhombuses, and rectilinear figures'], 'g5-block-pattern': ['Staircase patterns', 'Count unit squares in a growing staircase figure'], 'g5-range-round': ['Number ranges & rounding', 'At least/most, more/less than, round up/down/nearest'], 'g5-average-probability': ['Average & likelihood', 'Find an average and express likelihood as a fraction'], 'g5-solid-figure': ['Rectangular & cube prisms', 'Count faces, edges, vertices and edge-length totals'], 'g5-congruence-symmetry': ['Congruence & symmetry', 'Corresponding sides, angles, and symmetric points'], 'g5-function-table': ['Patterns & correspondence', 'Find a value from a table rule'],
    'g6-fraction-divide-natural': ['Fraction ÷ whole number', 'Divide proper, improper and mixed fractions'], 'g6-decimal-divide-natural': ['Decimal ÷ whole number', 'Exact decimal division'], 'g6-ratio': ['Ratios and rates', 'Simplify ratios and convert forms'], 'g6-fraction-divide': ['Fraction division', 'Divide fractions and whole numbers'], 'g6-decimal-divide': ['Decimal division', 'Divide decimals with different place values'], 'g6-proportion-basic': ['Basic proportions', 'Find the missing value in a proportion'], 'g6-proportion-story': ['Proportion word problems', 'Solve everyday situations with proportions'], 'g6-distribution-basic': ['Basic proportional distribution', 'Divide a total in a given ratio'], 'g6-distribution-story': ['Distribution word problems', 'Share quantities in a given ratio'], 'g6-proportion-application': ['Proportion applications', 'Use sums, differences and known shares'], 'g6-percentage-basic': ['Expressing percentages', 'Convert between fractions, decimals, and percentages'], 'g6-percentage-word': ['Percentage word problems', 'Discounts and shares of a total'], 'g6-circle-measure': ['Circumference & area of circles', 'Use π ≈ 3.14'], 'g6-prism-pyramid': ['Prisms & pyramids', 'Count faces, edges, and vertices'], 'g6-volume-surface': ['Volume & surface area', 'Rectangular prisms and cubes'], 'g6-data-graph': ['Band & pie graphs', 'Word problems interpreting percentage data'],
  },
};

export function localizeGrade(grade, language) {
  return language !== 'ko' ? localizeRegionalGrade(grade.id, language, ENGLISH.grades[grade.id]) : grade.label;
}

export function localizeUnit(unit, language, field = 'label') {
  if (language === 'ko') return unit[field];
  const translated = ENGLISH.units[unit.id];
  const englishText = translated ? translated[field === 'label' ? 0 : 1] : unit[field];
  return localizeRegionalUnit(unit.id, language, englishText, field);
}

export function findGrade(gradeId) {
  return GRADE_CATALOG.find((grade) => grade.id === gradeId) || GRADE_CATALOG[0];
}

export function findUnit(gradeId, unitId) {
  const grade = findGrade(gradeId);
  return grade.units.find((unit) => unit.id === unitId) || grade.units[0];
}
import { localizeRegionalGrade, localizeRegionalUnit } from '../../regionalCatalog';
import { makeElementaryGrowingBlockPattern, makeElementarySequencePattern } from '../../lib/sequenceCore';
import {
  angleBasic, averageProbability, blockStaircasePattern, circleBasic, circleMeasure, circleProperties,
  clockRead, congruenceSymmetry, countFiguresFromPoints, dataGraphWord, dataTableMissing,
  divisionRemainder3, fractionOfWhole, functionTable, lengthCalcSimple, lineRaySegmentClassify,
  measurementUnitConvert, percentageBasic, percentageWord, perimeterArea, pictographRead,
  polygonAngleMissing, prismPyramidCounts, rangeRound, solidFigureBasic, timeAddCalc,
  volumeSurfaceArea, weightCapacityConvert,
} from './geometryMeasurementEngine';
