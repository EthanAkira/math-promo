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

function decimalPointShift(random) {
  const a = randomInt(random, 12, 98);
  const b = randomInt(random, 12, 98);
  const product = a * b;
  const d1 = pick(random, [1, 2]);
  const d2 = pick(random, [0, 1]);
  const decimalA = a / 10 ** d1;
  const decimalB = d2 === 0 ? b : b / 10 ** d2;
  const answer = decimal(product / 10 ** (d1 + d2), d1 + d2);
  return {
    kind: 'word',
    prompt: `${a} × ${b} = ${product}입니다. 이를 이용하여 다음을 계산하세요.`,
    expression: `${decimalA} × ${decimalB}`,
    answer: String(answer),
    answerSuffix: '',
    promptEn: `${a} × ${b} = ${product}. Use this fact to compute the following.`,
    expressionEn: `${decimalA} × ${decimalB}`,
  };
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

const GRADE4_INTL_UNITS = [
  { id: 'g4e-m1a-place-value', label: '[M1] 자릿값과 큰 수 읽기', description: '백만 단위까지 자릿값과 10배 관계, 수를 여러 형태로 나타내기', make: m1PlaceValue },
  { id: 'g4e-m1b-compare', label: '[M1] 큰 수의 비교', description: '다섯~일곱 자리 수의 크기 비교와 몇 천/몇 만 더 크거나 작은 수', make: m1Compare },
  { id: 'g4e-m1c-rounding', label: '[M1] 큰 수의 반올림', description: '주어진 자리까지 반올림하기', make: m1Rounding },
  { id: 'g4e-m1d-addition', label: '[M1] 큰 수의 덧셈', description: '세로셈과 받아올림이 있는 덧셈 문장제', make: m1Addition },
  { id: 'g4e-m1e-subtraction', label: '[M1] 큰 수의 뺄셈', description: '받아내림이 있는 뺄셈과 문장제', make: m1Subtraction },
  { id: 'g4e-m1f-word-problems', label: '[M1] 덧셈과 뺄셈 문장제', description: '두 단계 이상의 덧셈·뺄셈 문장제', make: m1WordProblems },
  { id: 'g4e-m2a-metric-convert', label: '[M2] 미터법 단위 환산', description: 'km·m·cm, kg·g, L·mL 단위를 작은 단위로 바꾸기', make: m2MetricConvert },
  { id: 'g4e-m2b-metric-apply', label: '[M2] 미터법 단위 활용 문장제', description: '길이·무게·들이를 활용한 다단계 문장제', make: m2MetricApply },
  { id: 'g4e-m3a-area-perimeter-compare', label: '[M3] 넓이·둘레와 배 비교', description: '직사각형의 넓이·둘레 공식과 몇 배 문장제', make: m3AreaPerimeterCompare },
  { id: 'g4e-m3b-multiply-10-100-1000', label: '[M3] 10, 100, 1000의 곱셈', description: '10, 100, 1000을 곱하거나 나누는 규칙', make: m3MultiplyPowersOfTen },
  { id: 'g4e-m3c-multiply-multidigit-1digit', label: '[M3] 몇 자리 수 × 한 자리 수', description: '두~네 자리 수와 한 자리 수의 곱셈', make: m3MultiplyMultiDigitByOne },
  { id: 'g4e-m3d-multiply-word-problems', label: '[M3] 곱셈 문장제', description: '곱셈을 활용한 실생활 문장제', make: m3MultiplyWordProblems },
  { id: 'g4e-m3e-division-remainders', label: '[M3] 나머지가 있는 나눗셈', description: '나머지가 있는 나눗셈과 나머지 해석', make: m3DivisionWithRemainder },
  { id: 'g4e-m3f-factors-primes', label: '[M3] 약수, 배수, 소수', description: '약수 구하기, 소수와 합성수, 배수 판별', make: m3FactorsPrimes },
  { id: 'g4e-m3g-division-large', label: '[M3] 큰 수의 나눗셈', description: '세~네 자리 수를 한 자리 수로 나누기', make: m3DivisionLarge },
  { id: 'g4e-m3h-multiply-2x2', label: '[M3] 두 자리 수 × 두 자리 수', description: '두 자리 수끼리의 곱셈', make: m3Multiply2x2 },
  { id: 'g4e-m4a-lines-angles', label: '[M4] 직선과 각의 기초', description: '수직선·평행선 판별과 각의 분류', make: m4LinesAngles },
  { id: 'g4e-m4b-angle-measure', label: '[M4] 각도기로 각 재기', description: '각도기를 이용해 주어진 각의 크기 재기', make: m4AngleMeasure },
  { id: 'g4e-m4c-angle-addition', label: '[M4] 각의 덧셈', description: '나뉜 각의 합을 이용해 모르는 각 구하기', make: m4AngleAddition },
  { id: 'g4e-m4d-figures-symmetry', label: '[M4] 삼각형·사각형 분류', description: '변과 각에 따른 삼각형·사각형 분류', make: m4FiguresSymmetry },
  { id: 'g4e-m5a-decompose-fractions', label: '[M5] 분수의 분해', description: '분수를 단위분수의 합으로 나타내기', make: m5DecomposeFractions },
  { id: 'g4e-m5b-fraction-equivalence', label: '[M5] 분수의 동치', description: '곱셈과 나눗셈으로 동치분수 만들기', make: m5FractionEquivalence },
  { id: 'g4e-m5c-fraction-compare', label: '[M5] 분수의 크기 비교', description: '분모가 다른 분수의 크기 비교', make: m5FractionCompare },
  { id: 'g4e-m5d-fraction-add-sub-like', label: '[M5] 분모가 같은 분수의 덧셈과 뺄셈', description: '두세 개의 분수를 더하고 빼기', make: m5FractionAddSubLike },
  { id: 'g4e-m5e-fraction-greater-than-1', label: '[M5] 가분수와 대분수', description: '가분수·대분수 변환과 크기 비교', make: m5FractionGreaterThanOne },
  { id: 'g4e-m5f-mixed-number-add-sub', label: '[M5] 대분수의 덧셈과 뺄셈', description: '분모가 같은 대분수의 덧셈과 뺄셈', make: m5MixedNumberAddSub },
  { id: 'g4e-m5g-fraction-multiply-whole', label: '[M5] 분수와 자연수의 곱셈', description: '자연수와 분수(대분수 포함)의 곱셈', make: m5FractionMultiplyWhole },
  { id: 'g4e-m5h-fraction-pattern', label: '[M5] 분수의 규칙 찾기', description: '단위분수를 더해가는 규칙 찾기', make: m5FractionPattern },
  { id: 'g4e-m6a-tenths', label: '[M6] 소수 한 자리 수 (십분의 일)', description: '십분의 몇을 분수와 소수로 나타내기', make: m6Tenths },
  { id: 'g4e-m6b-hundredths', label: '[M6] 십분의 일과 백분의 일', description: '백분의 몇을 소수로, 소수 두 자리 수의 동치', make: m6Hundredths },
  { id: 'g4e-m6c-decimal-compare', label: '[M6] 소수의 크기 비교', description: '소수 한두 자리 수의 크기 비교', make: m6DecimalCompare },
  { id: 'g4e-m6d-decimal-addition', label: '[M6] 소수의 덧셈과 뺄셈', description: '소수 한두 자리 수의 덧셈과 뺄셈', make: m6DecimalAddition },
  { id: 'g4e-m6e-money-decimals', label: '[M6] 소수로 나타낸 돈', description: '달러와 센트를 소수로 나타내고 계산하기', make: m6MoneyDecimals },
  { id: 'g4e-m7a-conversion-tables', label: '[M7] 측정 단위 환산표', description: '환산표를 이용한 단위 변환', make: m7ConversionTables },
  { id: 'g4e-m7b-mixed-unit-problems', label: '[M7] 혼합 단위 문장제', description: '큰 단위와 작은 단위가 섞인 문장제', make: m7MixedUnitProblems },
  { id: 'g4e-m7c-mixed-number-measurement', label: '[M7] 분수로 나타낸 측정값', description: '대분수로 나타낸 측정값을 한 단위로 바꾸기', make: m7MixedNumberMeasurement },
  { id: 'g4e-m7d-composite-area-review', label: '[M7] 복합 도형의 넓이', description: '직사각형에서 일부를 잘라낸 도형의 넓이 구하기', make: m7CompositeAreaReview },
];

export const GRADE5_INTL_UNITS = [
  { id: 'g5e-m1a-powers-of-ten', label: '[M1] 10의 거듭제곱과 자릿값 이동', description: '10, 100, 1000 곱셈·나눗셈과 지수 표기법, 자릿값 패턴', make: m1PowersOfTen },
  { id: 'g5e-m1a-metric-shift', label: '[M1] 자릿값 이동을 이용한 미터법 환산', description: 'm-cm, km-m, kg-g, L-mL 단위 환산과 자릿값 규칙', make: m1MetricShift },
  { id: 'g5e-m1b-decimal-forms', label: '[M1] 소수의 전개식과 천분의 일', description: '소수 세 자리 수의 자릿값, 분수·거듭제곱 전개식', make: m1DecimalForms },
  { id: 'g5e-m1b-decimal-compare', label: '[M1] 천분의 일까지의 소수 크기 비교', description: '소수 세 자리 수까지의 크기 비교와 부등호 판정', make: m1DecimalCompare },
  { id: 'g5e-m1c-rounding-decimals', label: '[M1] 수직선 모델과 소수의 반올림', description: '수직선을 이용해 일의 자리, 소수 첫째·둘째 자리까지 반올림', make: m1RoundingDecimals },
  { id: 'g5e-m1d-decimal-add-sub', label: '[M1] 천분의 일까지의 소수 덧셈·뺄셈', description: '단위 형태와 표준 알고리즘을 이용한 소수 계산', make: m1DecimalAddSub },
  { id: 'g5e-m1e-decimal-multiply-1digit', label: '[M1] 소수와 1자리 자연수의 곱셈', description: '면적 모델과 자릿값 추론을 통한 소수 곱셈', make: m1DecimalMultiply1Digit },
  { id: 'g5e-m1f-decimal-divide-1digit', label: '[M1] 소수와 1자리 자연수의 나눗셈', description: '나눗셈 알고리즘과 단위 변환을 통한 소수 나눗셈', make: m1DecimalDivide1Digit },
  { id: 'g5e-m2a-mental-mult', label: '[M2] 큰 수 곱셈의 암산과 어림', description: '10의 거듭제곱 곱셈과 자릿수 추론, 곱 어림하기', make: m2MentalMult },
  { id: 'g5e-m2a-order-expressions', label: '[M2] 괄호와 사칙연산 식의 해석', description: '괄호가 있는 식의 계산 순서와 문장 표현', make: m2OrderExpressions },
  { id: 'g5e-m2b-mult-standard-alg', label: '[M2] 다자리 자연수 곱셈 표준 알고리즘', description: '세·네 자리 수와 두 자리 수의 표준 세로셈', make: m2MultStandardAlg },
  { id: 'g5e-m2c-decimal-mult', label: '[M2] 소수의 다자리 곱셈', description: '소수와 두 자리 자연수, 소수끼리의 곱셈과 소수점 위치', make: m2DecimalMult },
  { id: 'g5e-m2d-measurement-word-mult', label: '[M2] 측정 단위 환산 곱셈 문장제', description: '길이·무게·들이 단위를 활용한 다단계 곱셈 문장제', make: m2MeasurementWordMult },
  { id: 'g5e-m2e-mental-div', label: '[M2] 다자리 나눗셈의 암산과 몫 어림', description: '몇십으로 나누기, 나눗셈의 몫을 어림하기', make: m2MentalDiv },
  { id: 'g5e-m2f-div-2digit-divisor', label: '[M2] 두 자리 수로 나누는 나눗셈', description: '세·네 자리 수를 두 자리 수로 나누는 세로셈과 검산', make: m2Div2DigitDivisor },
  { id: 'g5e-m2g-decimal-div-multidigit', label: '[M2] 소수를 두 자리 수로 나누기', description: '소수를 두 자리 자연수로 나누는 나눗셈', make: m2DecimalDivMultidigit },
  { id: 'g5e-m2h-div-word-problems', label: '[M2] 나눗셈 다단계 문장제와 나머지 해석', description: '실생활 나눗셈 문장제와 상황에 따른 나머지 해석', make: m2DivWordProblems },
  { id: 'g5e-m3a-equivalent-fractions', label: '[M3] 동치분수와 크기가 같은 분수 만들기', description: '수직선과 분할을 이용한 동치분수 생성과 약분', make: m3EquivalentFractions },
  { id: 'g5e-m3b-fraction-add-sub-visual', label: '[M3] 면적 모델을 이용한 이분모 분수 덧뺄셈', description: '직사각형 면적 모델로 분모를 같게 만들어 더하고 빼기', make: m3FractionAddSubVisual },
  { id: 'g5e-m3c-fraction-add-sub-unlike', label: '[M3] 통분과 대분수의 덧셈·뺄셈', description: '공통분모를 구하여 분수와 대분수를 더하고 빼기', make: m3FractionAddSubUnlike },
  { id: 'g5e-m3d-fraction-word-problems', label: '[M3] 분수 덧셈·뺄셈 테이프 다이어그램 문장제', description: '테이프 다이어그램을 활용한 분수 실생활 문장제', make: m3FractionWordProblems },
  { id: 'g5e-m4a-line-plots', label: '[M4] 분수 측정값의 선 플롯과 해석', description: '1/2, 1/4, 1/8 인치 단위의 측정 자료를 선 플롯으로 나타내고 분석하기', make: m4LinePlots },
  { id: 'g5e-m4b-fraction-as-division', label: '[M4] 나눗셈으로서의 분수와 등분 문장제', description: 'a ÷ b = a/b의 의미와 똑같이 나누는 실생활 문제', make: m4FractionAsDivision },
  { id: 'g5e-m4c-whole-times-fraction', label: '[M4] 자연수와 분수의 곱셈', description: '자연수의 분수 배(부분 구하기)와 곱셈 계산', make: m4WholeTimesFraction },
  { id: 'g5e-m4d-fraction-expressions', label: '[M4] 분수 식의 작성과 연산', description: '조건에 맞는 분수 연산 식을 세우고 값 구하기', make: m4FractionExpressions },
  { id: 'g5e-m4e-fraction-times-fraction', label: '[M4] 분수와 분수의 곱셈', description: '면적 모델과 알고리즘을 활용한 분수끼리의 곱셈', make: m4FractionTimesFraction },
  { id: 'g5e-m4f-scaling-resizing', label: '[M4] 곱셈을 크기 변환(배율)으로 이해하기', description: '곱하는 수의 크기(1보다 큼/작음)에 따른 결과의 크기 비교', make: m4ScalingResizing },
  { id: 'g5e-m4g-fraction-division-unit', label: '[M4] 단위분수와 자연수의 나눗셈', description: '단위분수 ÷ 자연수와 자연수 ÷ 단위분수의 의미와 계산', make: m4FractionDivisionUnit },
  { id: 'g5e-m4h-numerical-expressions', label: '[M4] 분수·소수 혼합 수치식의 계산', description: '괄호와 분수·소수가 포함된 복합 수치식의 연산 순서', make: m4NumericalExpressions },
  { id: 'g5e-m5a-volume-unit-cubes', label: '[M5] 단위 정육면체와 부피 개념', description: '1cm³ 쌓기나무를 빈틈없이 채워 부피 구하기와 층별 계산', make: m5VolumeUnitCubes },
  { id: 'g5e-m5b-volume-formula', label: '[M5] 직육면체의 부피 공식과 복합 입체', description: '부피 = 가로 × 세로 × 높이 공식과 복합 직육면체의 부피', make: m5VolumeFormula },
  { id: 'g5e-m5c-area-fractional-sides', label: '[M5] 분수 변을 가진 직사각형의 넓이', description: '변의 길이가 대분수인 직사각형의 넓이를 타일링과 곱셈으로 구하기', make: m5AreaFractionalSides },
  { id: 'g5e-m5d-quadrilateral-hierarchy', label: '[M5] 사각형의 성질과 위계적 분류', description: '사다리꼴·평행사변형·마름모·직사각형·정사각형의 포함 관계', make: m5QuadrilateralHierarchy },
  { id: 'g5e-m6a-coordinate-plane-basics', label: '[M6] 좌표평면의 기초와 순서쌍', description: 'x축·y축, 원점 (0,0)과 제1사분면 순서쌍 (x, y) 읽고 나타내기', make: m6CoordinatePlaneBasics },
  { id: 'g5e-m6b-coordinate-patterns', label: '[M6] 규칙에 따른 좌표 패턴과 직선', description: '대응 규칙으로 순서쌍을 만들어 좌표평면에 점 찍고 규칙 찾기', make: m6CoordinatePatterns },
  { id: 'g5e-m6c-figures-coordinate-plane', label: '[M6] 좌표평면 위의 도형과 둘레·넓이', description: '좌표 위의 다각형 꼭짓점, 변의 길이와 넓이 구하기', make: m6FiguresCoordinatePlane },
  { id: 'g5e-m6d-line-graphs', label: '[M6] 꺾은선그래프 해석과 실생활 문제', description: '시간의 흐름에 따른 변화를 나타낸 꺾은선그래프 분석', make: m6LineGraphs },
  { id: 'g5e-m6e-multistep-word-problems', label: '[M6] 다단계 복합 문제 해결', description: '분수·소수·도형 개념이 융합된 실생활 다단계 문장제', make: m6MultistepWordProblems },
  { id: 'g5e-m6f-year-review-patterns', label: '[M6] 수학적 규칙과 수열 탐구', description: '피보나치 수열, 정사각수 등 패턴과 논리 퍼즐', make: m6YearReviewPatterns },
];

export const GRADE6_INTL_UNITS = [
  { id: 'g6e-m1a-ratios', label: '[M1] 비의 개념과 간단한 비', description: '두 수의 비 표현(A:B), 동치비와 가장 간단한 자연수의 비', make: generateM1aRatios },
  { id: 'g6e-m1b-ratio-tables', label: '[M1] 비 표와 이중 수직선 모델', description: '비 표와 이중 수직선 다이어그램에서 빈칸 찾기', make: generateM1bRatioTables },
  { id: 'g6e-m1b-ratio-graphs', label: '[M1] 좌표평면 위의 비와 비례 그래프', description: '비를 순서쌍 (x, y)로 그래프에 나타내고 단위 비율 기울기 활용하기', make: generateM1bRatioGraphs },
  { id: 'g6e-m1c-unit-rates', label: '[M1] 단위 비율과 단위 가격 비교', description: '단위 가격(Unit Price), 연비, 가성비 비교하기', make: generateM1cUnitRates },
  { id: 'g6e-m1c-speed-work-rates', label: '[M1] 속력·작업 속도와 측정 단위 변환', description: '거리=속력×시간, 인쇄 속도 및 초속-분속 단위 변환', make: generateM1cSpeedWorkRates },
  { id: 'g6e-m1d-percent-basics', label: '[M1] 백분율의 기초와 분수·소수 변환', description: '100에 대한 비로서의 백분율(%), 분수·소수 상호 변환', make: generateM1dPercentBasics },
  { id: 'g6e-m1d-percent-problems', label: '[M1] 백분율을 이용한 양과 전체 구하기', description: '어떤 수의 P%, P%가 주어졌을 때의 전체 양, 할인율 문장제', make: generateM1dPercentProblems },

  { id: 'g6e-m2a-fraction-division-models', label: '[M2] 시각적 모델을 통한 분수 나눗셈', description: '도형 모델을 활용한 분수 ÷ 분수의 의미와 몫 구하기', make: generateM2aFractionDivisionModels },
  { id: 'g6e-m2a-fraction-division-algorithm', label: '[M2] 분수와 대분수의 나눗셈 알고리즘', description: '역수를 곱하는 표준 알고리즘을 이용한 분수 나눗셈', make: generateM2aFractionDivisionAlgorithm },
  { id: 'g6e-m2a-fraction-div-word-problems', label: '[M2] 분수 나눗셈 실생활 문장제', description: '요리 배수, 포장, 면적을 활용한 분수 나눗셈 문장제', make: generateM2aFractionDivWordProblems },
  { id: 'g6e-m2b-decimal-ops', label: '[M2] 다자리 소수의 사칙연산 (덧셈·뺄셈·곱셈)', description: '자릿수를 맞춘 소수의 덧셈·뺄셈과 소수 곱셈 표준 계산법', make: generateM2bDecimalOps },
  { id: 'g6e-m2c-division-algorithm', label: '[M2] 소수의 나눗셈 표준 알고리즘', description: '나누는 수를 자연수로 바꾸어 계산하는 소수 나눗셈', make: generateM2cDivisionAlgorithm },
  { id: 'g6e-m2d-divisibility-rules', label: '[M2] 배수 판정법과 자릿수 규칙', description: '2, 3, 4, 5, 6, 8, 9, 10의 배수 판정법과 빈자리 수 추론', make: generateM2dDivisibilityRules },
  { id: 'g6e-m2d-gcf-lcm', label: '[M2] 최대공약수(GCF)와 최소공배수(LCM)', description: '소인수분해를 이용한 GCF, LCM 계산과 주기 문장제', make: generateM2dGcfLcm },
  { id: 'g6e-m2d-euclidean-algorithm', label: '[M2] 유클리드 호제법과 분배법칙 인수분해', description: '유클리드 호제법 원리와 GCF를 밖으로 묶어내는 분배법칙', make: generateM2dEuclideanAlgorithm },

  { id: 'g6e-m3a-integers-opposites', label: '[M3] 정수와 반대수 (수직선 방향과 크기)', description: '양수·음수의 의미, 수직선에서의 반대 부호 수(Opposite)', make: generateM3aIntegersOpposites },
  { id: 'g6e-m3a-rational-number-line', label: '[M3] 수직선 위의 유리수와 대소 비교', description: '음의 분수·소수의 위치와 부등호를 이용한 크기 비교', make: generateM3aRationalNumberLine },
  { id: 'g6e-m3b-absolute-value', label: '[M3] 절댓값과 거리의 크기(Magnitude)', description: '원점으로부터의 거리로서의 절댓값 |x|과 부채·온도 크기 비교', make: generateM3bAbsoluteValue },
  { id: 'g6e-m3b-inequalities-rational', label: '[M3] 유리수 부등식의 표현과 해석', description: '실생활 상황을 부등식으로 나타내고 범위 안의 정수 개수 구하기', make: generateM3bInequalitiesRational },
  { id: 'g6e-m3c-coordinate-plane-4quad', label: '[M3] 사분면과 4개 사분면의 순서쌍', description: '제1~4사분면과 좌표축 위의 점의 특징 판별', make: generateM3cCoordinatePlane4Quad },
  { id: 'g6e-m3c-coordinate-symmetry', label: '[M3] 좌표평면 위의 대칭이동', description: 'x축·y축에 대한 대칭점의 좌표 구하기', make: generateM3cCoordinateSymmetry },
  { id: 'g6e-m3c-coordinate-distance', label: '[M3] 좌표평면 위 두 점 사이의 거리', description: 'x좌표 또는 y좌표가 같은 두 점 사이의 수평·수직 거리', make: generateM3cCoordinateDistance },

  { id: 'g6e-m4a-exponents-order', label: '[M4] 거듭제곱과 사칙연산 계산 순서', description: '지수 표기법 a^n과 괄호·거듭제곱이 포함된 혼합 계산(PEMDAS)', make: generateM4aExponentsOrder },
  { id: 'g6e-m4b-algebraic-expressions', label: '[M4] 문자를 사용한 식과 식의 값 구하기', description: '문장제를 대수식으로 나타내고 문자에 수를 대입하여 값 구하기', make: generateM4bAlgebraicExpressions },
  { id: 'g6e-m4b-distributive-factoring', label: '[M4] 분배법칙을 이용한 식의 전개와 묶기', description: 'a(bx+c) 전개하기와 공통인수로 묶어 인수분해하기', make: generateM4bDistributiveFactoring },
  { id: 'g6e-m4c-equivalent-expressions', label: '[M4] 동류항 정리와 동치식 판별', description: '동류항끼리 모아 식 간단히 하기와 식의 동치 관계 확인', make: generateM4cEquivalentExpressions },
  { id: 'g6e-m4d-one-step-equations-add', label: '[M4] 일차방정식: 덧셈과 뺄셈', description: '등식의 성질을 이용한 x + a = b, x - a = b 풀기', make: generateM4dOneStepEquationsAdd },
  { id: 'g6e-m4d-one-step-equations-mult', label: '[M4] 일차방정식: 곱셈과 나눗셈', description: '등식의 성질을 이용한 ax = b, x/a = b 풀기', make: generateM4dOneStepEquationsMult },
  { id: 'g6e-m4e-equation-word-problems', label: '[M4] 방정식 실생활 문장제 해결', description: '실생활 문제 상황을 일차방정식으로 세우고 해 구하기', make: generateM4eEquationWordProblems },
  { id: 'g6e-m4f-inequalities-graphing', label: '[M4] 부등식의 표현과 수직선 그래프', description: 'x > c, x ≤ c 등 부등식의 표현과 조건 판별', make: generateM4fInequalitiesGraphing },
  { id: 'g6e-m4f-two-variable-relationships', label: '[M4] 독립변수와 종속변수 (y = kx 관계식)', description: '두 변수 사이의 관계를 표·식·그래프로 나타내고 값 구하기', make: generateM4fTwoVariableRelationships },

  { id: 'g6e-m5a-area-parallelograms-triangles', label: '[M5] 평행사변형과 삼각형의 넓이', description: '밑변과 높이를 이용한 평행사변형(bh) 및 삼각형(1/2 bh) 넓이', make: generateM5aAreaParallelogramsTriangles },
  { id: 'g6e-m5a-area-polygons-composite', label: '[M5] 사다리꼴과 복합 다각형의 넓이', description: '사다리꼴 넓이 공식과 다각형 분할·합성을 통한 복합 도형 넓이', make: generateM5aAreaPolygonsComposite },
  { id: 'g6e-m5b-polygons-coordinate-plane', label: '[M5] 좌표평면 위의 다각형과 넓이', description: '네 사분면에 걸친 다각형 꼭짓점 좌표로 가로·세로 길이와 넓이 구하기', make: generateM5bPolygonsCoordinatePlane },
  { id: 'g6e-m5c-volume-fractional-cubes', label: '[M5] 분수 변 길이를 갖는 직육면체의 부피', description: 'V = l × w × h 공식과 분수 길이 직육면체 부피 계산', make: generateM5cVolumeFractionalCubes },
  { id: 'g6e-m5d-nets-surface-area', label: '[M5] 전개도와 각기둥의 겉넓이', description: '직육면체 전개도의 면적 합과 겉넓이 공식 계산', make: generateM5dNetsSurfaceArea },

  { id: 'g6e-m6a-statistical-questions-plots', label: '[M6] 통계적 질문과 점도표·히스토그램', description: '통계적 질문 구별하기와 자료의 범위(최댓값 - 최솟값) 구하기', make: generateM6aStatisticalQuestionsPlots },
  { id: 'g6e-m6b-mean-and-mad', label: '[M6] 대푯값 평균과 평균절대편차(MAD)', description: '자료의 평균(Mean)과 산포도 척도인 평균절대편차(MAD) 계산', make: generateM6bMeanAndMad },
  { id: 'g6e-m6c-median-and-iqr', label: '[M6] 중앙값과 사분위범위(IQR)', description: '정렬된 자료의 중앙값(Median)과 Q1, Q3, 사분위범위(IQR)', make: generateM6cMedianAndIqr },
  { id: 'g6e-m6c-box-plots-five-summary', label: '[M6] 상자그림과 다섯 수 요약 (Five-Number Summary)', description: '최솟값·Q1·중앙값·Q3·최댓값 요약과 상자그림(Box plot) 해석', make: generateM6cBoxPlotsFiveSummary },
];

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
      ...GRADE4_INTL_UNITS,
    ],
  },
  {
    id: '5', label: '5학년', units: [
      { id: 'g5-mixed-natural', label: '자연수의 혼합 계산', description: '괄호와 사칙연산 순서를 포함한 계산', make: mixedNatural },
      { id: 'g5-factors-multiples', label: '약수와 배수', description: '약수·배수·최대공약수·최소공배수', make: factorsMultiples },
      { id: 'g5-reduce-common-denominator', label: '약분과 통분', description: '기약분수 만들기와 분수의 크기 비교', make: (r) => { const n = randomInt(r, 1, 9); const d = randomInt(r, n + 1, 12); const k = randomInt(r, 2, 8); return inline(`${n * k}/${d * k} → 기약분수`, fractionAnswer(n * k, d * k)); } },
      { id: 'g5-fraction-add-sub', label: '분수의 덧셈과 뺄셈', description: '분모가 다른 분수의 덧셈과 뺄셈', make: fractionAddSub },
      { id: 'g5-fraction-multiply', label: '분수의 곱셈', description: '분수와 자연수, 두세 분수의 곱셈', make: fractionMultiply },
      { id: 'g5-decimal-multiply', label: '소수의 곱셈', description: '소수와 자연수 또는 소수의 곱셈, 곱의 소수점 위치', make: (r) => (r() < 0.7 ? decimalMultiply(r) : decimalPointShift(r)) },
      { id: 'g5-perimeter-area', label: '다각형의 둘레와 넓이', description: '직사각형·삼각형·평행사변형·사다리꼴·마름모, 직각으로 이루어진 도형', make: perimeterArea },
      { id: 'g5-range-round', label: '수의 범위와 어림', description: '이상·이하·초과·미만과 올림·버림·반올림', make: rangeRound },
      { id: 'g5-average-probability', label: '평균과 가능성', description: '자료의 평균 구하기와 가능성을 분수로 나타내기', make: averageProbability },
      { id: 'g5-solid-figure', label: '직육면체와 정육면체', description: '면·모서리·꼭짓점의 개수, 겨냥도의 평행·수직 관계, 전개도', make: (r) => pick(r, [solidFigureBasic, solidFigureSketch, solidFigureNet, solidFigureNet])(r) },
      { id: 'g5-congruence-symmetry', label: '합동과 대칭', description: '대응변·대응각과 선대칭·점대칭의 성질', make: (r) => (r() < 0.55 ? congruenceSymmetry(r) : pointSymmetry(r)) },
      { id: 'g5-function-table', label: '규칙과 대응', description: '표에서 대응 규칙을 찾아 값 구하기', make: functionTable },
      { id: 'g5-block-pattern', label: '계단 모양 규칙', description: '정사각형이 늘어나는 계단 모양을 보고 몇 번째 모양의 정사각형 수 구하기', make: blockStaircasePattern },
      ...GRADE5_INTL_UNITS,
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
      ...GRADE6_INTL_UNITS,
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
    'g4e-m1a-place-value': ['[M1] Place value to millions', 'Digit value, ×10 relationships, and multiple number forms'], 'g4e-m1b-compare': ['[M1] Comparing large numbers', 'Compare multi-digit numbers and find numbers thousands/ten-thousands more or less'], 'g4e-m1c-rounding': ['[M1] Rounding large numbers', 'Round multi-digit numbers to a given place'], 'g4e-m1d-addition': ['[M1] Multi-digit addition', 'Standard algorithm addition with regrouping and word problems'], 'g4e-m1e-subtraction': ['[M1] Multi-digit subtraction', 'Standard algorithm subtraction with regrouping and word problems'], 'g4e-m1f-word-problems': ['[M1] Addition & subtraction word problems', 'Multi-step word problems combining addition and subtraction'],
    'g4e-m2a-metric-convert': ['[M2] Metric unit conversion', 'Convert km/m/cm, kg/g, L/mL to a smaller unit'], 'g4e-m2b-metric-apply': ['[M2] Applying metric conversions', 'Multi-step word problems using length, weight, and capacity'],
    'g4e-m3a-area-perimeter-compare': ['[M3] Area, perimeter & comparison', 'Rectangle area/perimeter formulas and multiplicative comparison word problems'], 'g4e-m3b-multiply-10-100-1000': ['[M3] Multiplying by 10, 100, 1000', 'Patterns for multiplying and dividing by powers of ten'], 'g4e-m3c-multiply-multidigit-1digit': ['[M3] Multi-digit × 1-digit', 'Multiply 2–4 digit numbers by a one-digit number'], 'g4e-m3d-multiply-word-problems': ['[M3] Multiplication word problems', 'Real-world problems solved with multiplication'], 'g4e-m3e-division-remainders': ['[M3] Division with remainders', 'Divide with remainders and interpret the remainder'], 'g4e-m3f-factors-primes': ['[M3] Factors, multiples & primes', 'Find factors, classify prime/composite, identify multiples'], 'g4e-m3g-division-large': ['[M3] Dividing large numbers', 'Divide 3–4 digit numbers by a one-digit number'], 'g4e-m3h-multiply-2x2': ['[M3] 2-digit × 2-digit multiplication', 'Multiply two two-digit numbers'],
    'g4e-m4a-lines-angles': ['[M4] Lines & angles basics', 'Identify perpendicular/parallel lines and classify angles'], 'g4e-m4b-angle-measure': ['[M4] Measuring angles', 'Use a protractor to measure a given angle'], 'g4e-m4c-angle-addition': ['[M4] Angle addition', 'Find an unknown angle using the sum of adjacent angles'], 'g4e-m4d-figures-symmetry': ['[M4] Classifying triangles & quadrilaterals', 'Classify shapes by side length and angle type'],
    'g4e-m5a-decompose-fractions': ['[M5] Decomposing fractions', 'Express a fraction as a sum of unit fractions'], 'g4e-m5b-fraction-equivalence': ['[M5] Equivalent fractions', 'Create equivalent fractions using multiplication and division'], 'g4e-m5c-fraction-compare': ['[M5] Comparing fractions', 'Compare fractions with different denominators'], 'g4e-m5d-fraction-add-sub-like': ['[M5] Adding/subtracting like fractions', 'Add and subtract two or three fractions with the same denominator'], 'g4e-m5e-fraction-greater-than-1': ['[M5] Fractions greater than 1', 'Convert between improper fractions and mixed numbers, and compare'], 'g4e-m5f-mixed-number-add-sub': ['[M5] Adding/subtracting mixed numbers', 'Add and subtract mixed numbers with like denominators'], 'g4e-m5g-fraction-multiply-whole': ['[M5] Multiplying fractions by whole numbers', 'Multiply a whole number by a fraction or mixed number'], 'g4e-m5h-fraction-pattern': ['[M5] Fraction sum patterns', 'Find the pattern when adding a sequence of unit fractions'],
    'g4e-m6a-tenths': ['[M6] Tenths', 'Express tenths as a fraction and as a decimal'], 'g4e-m6b-hundredths': ['[M6] Tenths and hundredths', 'Express hundredths as decimals and relate tenths to hundredths'], 'g4e-m6c-decimal-compare': ['[M6] Comparing decimals', 'Compare decimals to one or two places'], 'g4e-m6d-decimal-addition': ['[M6] Adding/subtracting decimals', 'Add and subtract decimals to one or two places'], 'g4e-m6e-money-decimals': ['[M6] Money as decimals', 'Express and calculate money amounts as decimals'],
    'g4e-m7a-conversion-tables': ['[M7] Measurement conversion tables', 'Use a conversion table to change units'], 'g4e-m7b-mixed-unit-problems': ['[M7] Mixed-unit word problems', 'Word problems mixing a larger and smaller unit'], 'g4e-m7c-mixed-number-measurement': ['[M7] Measurements as mixed numbers', 'Convert a mixed-number measurement to a single unit'], 'g4e-m7d-composite-area-review': ['[M7] Composite figure area', 'Find the area of an L-shaped composite figure'],
    'g5-mixed-natural': ['Mixed whole-number operations', 'Order of operations and parentheses'], 'g5-factors-multiples': ['Factors & multiples', 'GCF, LCM, factors and multiples'], 'g5-reduce-common-denominator': ['Simplifying fractions', 'Reduce and compare fractions'], 'g5-fraction-add-sub': ['Fraction addition & subtraction', 'Unlike denominators'], 'g5-fraction-multiply': ['Fraction multiplication', 'Multiply fractions and whole numbers'], 'g5-decimal-multiply': ['Decimal multiplication', 'Multiply decimals and whole numbers'], 'g5-perimeter-area': ['Perimeter & area', 'Rectangles, triangles, parallelograms, trapezoids, rhombuses, and rectilinear figures'], 'g5-block-pattern': ['Staircase patterns', 'Count unit squares in a growing staircase figure'], 'g5-range-round': ['Number ranges & rounding', 'At least/most, more/less than, round up/down/nearest'], 'g5-average-probability': ['Average & likelihood', 'Find an average and express likelihood as a fraction'], 'g5-solid-figure': ['Rectangular & cube prisms', 'Count faces, edges, vertices and edge-length totals'],    'g5-congruence-symmetry': ['Congruence & symmetry', 'Corresponding sides, angles, and symmetric points'], 'g5-function-table': ['Patterns & correspondence', 'Find a value from a table rule'],
    'g5e-m1a-powers-of-ten': ['[M1] Powers of Ten & Place Value Shifts', 'Multiplying and dividing by 10, 100, 1000 and exponents'],
    'g5e-m1a-metric-shift': ['[M1] Metric Conversions with Powers of 10', 'Convert metric units using place value shifts'],
    'g5e-m1b-decimal-forms': ['[M1] Decimals in Expanded Form to Thousandths', 'Place value of decimals to thousandths and expanded form'],
    'g5e-m1b-decimal-compare': ['[M1] Comparing Decimals to Thousandths', 'Compare decimals to thousandths using inequality symbols'],
    'g5e-m1c-rounding-decimals': ['[M1] Rounding Decimals to Any Place', 'Round decimals to whole number, tenths, or hundredths'],
    'g5e-m1d-decimal-add-sub': ['[M1] Adding & Subtracting Decimals', 'Add and subtract decimals through thousandths'],
    'g5e-m1e-decimal-multiply-1digit': ['[M1] Multiplying Decimals by 1-Digit Numbers', 'Multiply decimals by 1-digit whole numbers using area models'],
    'g5e-m1f-decimal-divide-1digit': ['[M1] Dividing Decimals by 1-Digit Numbers', 'Divide decimals by 1-digit whole numbers with place value reasoning'],
    'g5e-m2a-mental-mult': ['[M2] Mental Strategies for Multi-Digit Multiplication', 'Multiply powers of ten and estimate products'],
    'g5e-m2a-order-expressions': ['[M2] Numerical Expressions with Parentheses', 'Order of operations and interpreting numerical expressions'],
    'g5e-m2b-mult-standard-alg': ['[M2] Standard Algorithm for Multi-Digit Multiplication', 'Multiply multi-digit numbers by 2-digit numbers'],
    'g5e-m2c-decimal-mult': ['[M2] Multi-Digit Decimal Multiplication', 'Multiply decimals by whole numbers and decimals'],
    'g5e-m2d-measurement-word-mult': ['[M2] Measurement Word Problems with Multiplication', 'Multi-step measurement word problems with conversions'],
    'g5e-m2e-mental-div': ['[M2] Mental Strategies for Multi-Digit Division', 'Divide by multiples of ten and estimate quotients'],
    'g5e-m2f-div-2digit-divisor': ['[M2] Dividing by Two-Digit Divisors', 'Standard algorithm for division by two-digit divisors'],
    'g5e-m2g-decimal-div-multidigit': ['[M2] Multi-Digit Decimal Division', 'Divide decimals by two-digit whole numbers'],
    'g5e-m2h-div-word-problems': ['[M2] Division Word Problems & Interpreting Remainders', 'Solve division word problems and interpret remainders'],
    'g5e-m3a-equivalent-fractions': ['[M3] Equivalent Fractions & Simplification', 'Create equivalent fractions and simplify using factors'],
    'g5e-m3b-fraction-add-sub-visual': ['[M3] Adding & Subtracting Fractions with Visual Models', 'Use area models to add and subtract fractions with unlike denominators'],
    'g5e-m3c-fraction-add-sub-unlike': ['[M3] Adding & Subtracting Unlike Fractions & Mixed Numbers', 'Add and subtract fractions and mixed numbers using common denominators'],
    'g5e-m3d-fraction-word-problems': ['[M3] Fraction Addition & Subtraction Word Problems', 'Tape diagrams for multi-step fraction word problems'],
    'g5e-m4a-line-plots': ['[M4] Line Plots of Fractional Measurements', 'Display and analyze fraction measurement data using line plots'],
    'g5e-m4b-fraction-as-division': ['[M4] Fractions as Division & Equal Sharing', 'Understand a ÷ b = a/b and solve equal sharing word problems'],
    'g5e-m4c-whole-times-fraction': ['[M4] Multiplying Whole Numbers by Fractions', 'Find fraction parts of whole numbers using multiplication'],
    'g5e-m4d-fraction-expressions': ['[M4] Fraction Expressions & Word Problems', 'Write and evaluate numerical expressions involving fractions'],
    'g5e-m4e-fraction-times-fraction': ['[M4] Multiplying Fractions by Fractions', 'Multiply fractions using area models and the standard algorithm'],
    'g5e-m4f-scaling-resizing': ['[M4] Multiplication as Scaling and Resizing', 'Interpret multiplication as resizing by comparing factor sizes'],
    'g5e-m4g-fraction-division-unit': ['[M4] Dividing Unit Fractions & Whole Numbers', 'Divide unit fractions by whole numbers and whole numbers by unit fractions'],
    'g5e-m4h-numerical-expressions': ['[M4] Numerical Expressions with Fractions & Decimals', 'Evaluate multi-step expressions combining fractions and decimals'],
    'g5e-m5a-volume-unit-cubes': ['[M5] Volume Concepts with Unit Cubes', 'Pack unit cubes and calculate volume in cubic centimeters and layers'],
    'g5e-m5b-volume-formula': ['[M5] Volume Formulas for Right Rectangular Prisms', 'Apply V = l × w × h and V = B × h to rectangular prisms'],
    'g5e-m5c-area-fractional-sides': ['[M5] Area of Rectangles with Fractional Side Lengths', 'Find rectangle area with fractional dimensions using tiling'],
    'g5e-m5d-quadrilateral-hierarchy': ['[M5] Classifying 2D Shapes & Quadrilateral Hierarchy', 'Classify quadrilaterals based on properties and hierarchy'],
    'g5e-m6a-coordinate-plane-basics': ['[M6] Coordinate Plane Basics & Ordered Pairs', 'Plot and read ordered pairs (x, y) in the first quadrant'],
    'g5e-m6b-coordinate-patterns': ['[M6] Patterns in the Coordinate Plane & Graphing Rules', 'Generate coordinate pairs from rules and identify linear patterns'],
    'g5e-m6c-figures-coordinate-plane': ['[M6] Geometric Figures on the Coordinate Plane', 'Draw shapes on coordinate planes and find perimeter and area'],
    'g5e-m6d-line-graphs': ['[M6] Line Graphs & Real-World Problem Solving', 'Analyze time-series line graphs and solve real-world problems'],
    'g5e-m6e-multistep-word-problems': ['[M6] Multi-Step Word Problems', 'Solve complex multi-step problems integrating fractions, decimals, and geometry'],
    'g5e-m6f-year-review-patterns': ['[M6] Number Patterns, Sequences & Math Puzzles', 'Explore Fibonacci sequences, square numbers, and math puzzles'],
    'g6-fraction-divide-natural': ['Fraction ÷ whole number', 'Divide fractions by whole numbers'],
    'g6-decimal-divide-natural': ['Decimal ÷ whole number', 'Exact decimal division by whole numbers'],
    'g6-ratio': ['Ratios & rates', 'Simplify ratios and convert to fractions/decimals'],
    'g6-fraction-divide': ['Fraction division', 'Divide fractions and whole numbers'],
    'g6-decimal-divide': ['Decimal division', 'Divide decimals by decimals with different places'],
    'g6-proportion-basic': ['Proportion basics', 'Find missing values in proportions'],
    'g6-proportion-story': ['Proportion word problems', 'Solve everyday problems using proportions'],
    'g6-distribution-basic': ['Proportional division basics', 'Divide a whole according to a given ratio'],
    'g6-distribution-story': ['Proportional division problems', 'Divide quantities in everyday situations'],
    'g6-proportion-application': ['Proportion applications', 'Applications using sum, difference, and parts'],
    'g6-percentage-basic': ['Percentage basics', 'Convert between fractions, decimals, and percents'],
    'g6-percentage-word': ['Percentage word problems', 'Discounts, rates, and everyday percentages'],
    'g6-circle-measure': ['Circumference & circle area', 'Use pi=3.14 to calculate circumference and area'],
    'g6-prism-pyramid': ['Prisms & pyramids', 'Count faces, edges, and vertices'],
    'g6-volume-surface': ['Volume & surface area', 'Volume and surface area of rectangular prisms'],
    'g6-data-graph': ['Strip graphs & pie charts', 'Interpret percentage data in charts'],
    'g6e-m1a-ratios': ['[M1] Understanding Ratios & Equivalent Ratios', 'Ratio notation A:B, equivalent ratios and simplest form'],
    'g6e-m1b-ratio-tables': ['[M1] Ratio Tables & Double Number Lines', 'Find missing values in ratio tables and double number line diagrams'],
    'g6e-m1b-ratio-graphs': ['[M1] Ratios on the Coordinate Plane', 'Graph ratios as (x, y) coordinates and interpret unit rate slope'],
    'g6e-m1c-unit-rates': ['[M1] Unit Rates & Unit Pricing', 'Calculate unit rates, unit price comparisons, and fuel efficiency'],
    'g6e-m1c-speed-work-rates': ['[M1] Speed, Work & Unit Conversions', 'Distance = Rate × Time, work rate, and converting measurement units'],
    'g6e-m1d-percent-basics': ['[M1] Percent as Rate per 100', 'Understanding percent, converting between fractions, decimals, and percents'],
    'g6e-m1d-percent-problems': ['[M1] Percent of a Quantity and the Whole', 'Find a percentage of a quantity, the whole amount, and discounts'],
    'g6e-m2a-fraction-division-models': ['[M2] Fraction Division with Visual Models', 'Interpret division of fractions using visual models and quotients'],
    'g6e-m2a-fraction-division-algorithm': ['[M2] Dividing Fractions & Mixed Numbers', 'Standard algorithm multiplying by the reciprocal for fraction division'],
    'g6e-m2a-fraction-div-word-problems': ['[M2] Fraction Division Word Problems', 'Multi-step real-world problems involving division of fractions'],
    'g6e-m2b-decimal-ops': ['[M2] Multi-Digit Decimal Operations', 'Standard algorithms for adding, subtracting, and multiplying decimals'],
    'g6e-m2c-division-algorithm': ['[M2] Multi-Digit Decimal Division', 'Divide multi-digit decimals by converting divisors to whole numbers'],
    'g6e-m2d-divisibility-rules': ['[M2] Divisibility Rules & Multiples', 'Divisibility tests for 2, 3, 4, 5, 6, 8, 9, 10 and digit reasoning'],
    'g6e-m2d-gcf-lcm': ['[M2] GCF and LCM', 'Calculate Greatest Common Factor and Least Common Multiple with applications'],
    'g6e-m2d-euclidean-algorithm': ['[M2] Euclidean Algorithm & Factoring', 'Euclidean algorithm for GCF and factoring using the distributive property'],
    'g6e-m3a-integers-opposites': ['[M3] Integers and Opposites', 'Positive and negative numbers on the number line and real-world contexts'],
    'g6e-m3a-rational-number-line': ['[M3] Rational Numbers on the Number Line', 'Order and compare rational numbers (fractions, decimals, negatives)'],
    'g6e-m3b-absolute-value': ['[M3] Absolute Value and Magnitude', 'Distance from zero, magnitude of numbers, debt and temperature comparisons'],
    'g6e-m3b-inequalities-rational': ['[M3] Inequality Statements with Rational Numbers', 'Write and interpret inequality statements in real-world contexts'],
    'g6e-m3c-coordinate-plane-4quad': ['[M3] 4-Quadrant Coordinate Plane', 'Identify quadrants and plot ordered pairs across all four quadrants'],
    'g6e-m3c-coordinate-symmetry': ['[M3] Symmetry and Reflections in Coordinate Plane', 'Find reflections of points across the x-axis and y-axis'],
    'g6e-m3c-coordinate-distance': ['[M3] Distance Between Points on Coordinate Plane', 'Find horizontal and vertical distance between points with same coordinate'],
    'g6e-m4a-exponents-order': ['[M4] Exponents and Order of Operations', 'Evaluate numerical expressions with exponents following order of operations'],
    'g6e-m4b-algebraic-expressions': ['[M4] Writing and Evaluating Algebraic Expressions', 'Translate verbal phrases into expressions and evaluate for given values'],
    'g6e-m4b-distributive-factoring': ['[M4] Distributive Property & Factoring Expressions', 'Apply the distributive property to expand and factor linear expressions'],
    'g6e-m4c-equivalent-expressions': ['[M4] Combining Like Terms & Equivalent Expressions', 'Simplify expressions by combining like terms and determine equivalence'],
    'g6e-m4d-one-step-equations-add': ['[M4] One-Step Equations: Addition & Subtraction', 'Solve one-step equations of the form x + a = b and x - a = b'],
    'g6e-m4d-one-step-equations-mult': ['[M4] One-Step Equations: Multiplication & Division', 'Solve one-step equations of the form ax = b and x/a = b'],
    'g6e-m4e-equation-word-problems': ['[M4] Equation Word Problems', 'Set up and solve one-step and multi-step equations for real-world situations'],
    'g6e-m4f-inequalities-graphing': ['[M4] Inequalities and Number Line Graphs', 'Write inequalities of the form x > c or x ≤ c and graph on number line'],
    'g6e-m4f-two-variable-relationships': ['[M4] Two-Variable Relationships & Tables', 'Represent relationships between independent and dependent variables'],
    'g6e-m5a-area-parallelograms-triangles': ['[M5] Area of Parallelograms & Triangles', 'Calculate area using base and height formulas for parallelograms and triangles'],
    'g6e-m5a-area-polygons-composite': ['[M5] Area of Trapezoids & Composite Polygons', 'Find area of trapezoids and decompose composite polygons into simple shapes'],
    'g6e-m5b-polygons-coordinate-plane': ['[M5] Polygons on the Coordinate Plane', 'Find side lengths, perimeter, and area of polygons plotted on coordinate plane'],
    'g6e-m5c-volume-fractional-cubes': ['[M5] Volume with Fractional Edge Lengths', 'Calculate volume of rectangular prisms with fractional edge lengths (V = lwh)'],
    'g6e-m5d-nets-surface-area': ['[M5] Nets and Surface Area of Prisms', 'Use 2D nets to calculate the surface area of rectangular prisms and pyramids'],
    'g6e-m6a-statistical-questions-plots': ['[M6] Statistical Questions, Dot Plots & Histograms', 'Identify statistical questions with variability and analyze data ranges'],
    'g6e-m6b-mean-and-mad': ['[M6] Mean and Mean Absolute Deviation (MAD)', 'Calculate the mean and measure variability using Mean Absolute Deviation'],
    'g6e-m6c-median-and-iqr': ['[M6] Median and Interquartile Range (IQR)', 'Find the median, lower quartile Q1, upper quartile Q3, and IQR'],
    'g6e-m6c-box-plots-five-summary': ['[M6] Five-Number Summary & Box Plots', 'Interpret five-number summaries and construct/analyze box plots'],
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
  pointSymmetry, polygonAngleMissing, prismPyramidCounts, rangeRound, solidFigureBasic,
  solidFigureNet, solidFigureSketch, timeAddCalc, volumeSurfaceArea, weightCapacityConvert,
} from './geometryMeasurementEngine';
import {
  m1PlaceValue, m1Compare, m1Rounding, m1Addition, m1Subtraction, m1WordProblems,
  m2MetricConvert, m2MetricApply,
  m3AreaPerimeterCompare, m3MultiplyPowersOfTen, m3MultiplyMultiDigitByOne, m3MultiplyWordProblems,
  m3DivisionWithRemainder, m3FactorsPrimes, m3DivisionLarge, m3Multiply2x2,
  m4LinesAngles, m4AngleMeasure, m4AngleAddition, m4FiguresSymmetry,
  m5DecomposeFractions, m5FractionEquivalence, m5FractionCompare, m5FractionAddSubLike,
  m5FractionGreaterThanOne, m5MixedNumberAddSub, m5FractionMultiplyWhole, m5FractionPattern,
  m6Tenths, m6Hundredths, m6DecimalCompare, m6DecimalAddition, m6MoneyDecimals,
  m7ConversionTables, m7MixedUnitProblems, m7MixedNumberMeasurement, m7CompositeAreaReview,
} from './grade4EurekaEngine';
import {
  m1PowersOfTen, m1MetricShift, m1DecimalForms, m1DecimalCompare, m1RoundingDecimals, m1DecimalAddSub, m1DecimalMultiply1Digit, m1DecimalDivide1Digit,
  m2MentalMult, m2OrderExpressions, m2MultStandardAlg, m2DecimalMult, m2MeasurementWordMult, m2MentalDiv, m2Div2DigitDivisor, m2DecimalDivMultidigit, m2DivWordProblems,
  m3EquivalentFractions, m3FractionAddSubVisual, m3FractionAddSubUnlike, m3FractionWordProblems,
  m4LinePlots, m4FractionAsDivision, m4WholeTimesFraction, m4FractionExpressions, m4FractionTimesFraction, m4ScalingResizing, m4FractionDivisionUnit, m4NumericalExpressions,
  m5VolumeUnitCubes, m5VolumeFormula, m5AreaFractionalSides, m5QuadrilateralHierarchy,
  m6CoordinatePlaneBasics, m6CoordinatePatterns, m6FiguresCoordinatePlane, m6LineGraphs, m6MultistepWordProblems, m6YearReviewPatterns,
} from './grade5EurekaEngine';
import {
  generateM1aRatios, generateM1bRatioTables, generateM1bRatioGraphs, generateM1cUnitRates, generateM1cSpeedWorkRates,
  generateM1dPercentBasics, generateM1dPercentProblems,
  generateM2aFractionDivisionModels, generateM2aFractionDivisionAlgorithm, generateM2aFractionDivWordProblems,
  generateM2bDecimalOps, generateM2cDivisionAlgorithm, generateM2dDivisibilityRules, generateM2dGcfLcm, generateM2dEuclideanAlgorithm,
  generateM3aIntegersOpposites, generateM3aRationalNumberLine, generateM3bAbsoluteValue, generateM3bInequalitiesRational,
  generateM3cCoordinatePlane4Quad, generateM3cCoordinateSymmetry, generateM3cCoordinateDistance,
  generateM4aExponentsOrder, generateM4bAlgebraicExpressions, generateM4bDistributiveFactoring, generateM4cEquivalentExpressions,
  generateM4dOneStepEquationsAdd, generateM4dOneStepEquationsMult, generateM4eEquationWordProblems, generateM4fInequalitiesGraphing, generateM4fTwoVariableRelationships,
  generateM5aAreaParallelogramsTriangles, generateM5aAreaPolygonsComposite, generateM5bPolygonsCoordinatePlane, generateM5cVolumeFractionalCubes, generateM5dNetsSurfaceArea,
  generateM6aStatisticalQuestionsPlots, generateM6bMeanAndMad, generateM6cMedianAndIqr, generateM6cBoxPlotsFiveSummary,
} from './grade6EurekaEngine';
