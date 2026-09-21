// Grade 4 국제 커리큘럼(Eureka Math / EngageNY 구조 기반) 문제 생성 엔진
// 7개 모듈(M1 자릿값·덧뺄셈, M2 미터법 환산, M3 곱셈·나눗셈, M4 각도·평면도형,
// M5 분수, M6 소수, M7 측정과 곱셈)의 Topic 단위(총 37개) 생성기.
// 원 출처의 문제 문장을 그대로 옮기지 않고, 단원의 구조와 접근법만 반영해 새로 작성함.

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

const PLACE_NAMES_KO = ['일', '십', '백', '천', '만', '십만', '백만', '천만', '억'];
const PLACE_NAMES_EN = ['ones', 'tens', 'hundreds', 'thousands', 'ten thousands', 'hundred thousands', 'millions'];

// ---------- Module 1: Place Value, Rounding, Addition & Subtraction ----------

export function m1PlaceValue(random) {
  const mode = randomInt(random, 0, 3);
  if (mode === 0) {
    const digits = randomInt(random, 5, 7);
    const n = randomInt(random, 10 ** (digits - 1), 10 ** digits - 1);
    const placeIndex = randomInt(random, 0, digits - 1);
    const digit = String(n).split('').reverse()[placeIndex];
    return wordQ(
      `${groupDigits(n)}에서 숫자 ${digit}이(가) 나타내는 자릿값은 얼마인가요? (예: 300)`,
      '',
      Number(digit) * 10 ** placeIndex,
      '',
      `In ${groupDigits(n)}, what value does the digit ${digit} at that position represent?`,
    );
  }
  if (mode === 1) {
    const base = randomInt(random, 2, 9);
    const direction = random() < 0.5;
    return wordQ(
      direction ? `${base}을(를) 10배 하면 얼마인가요?` : `${base * 10}을(를) 10으로 나누면 얼마인가요?`,
      '',
      direction ? base * 10 : base,
      '',
      direction ? `What is ${base} times 10?` : `What is ${base * 10} divided by 10?`,
    );
  }
  if (mode === 2) {
    const digits = randomInt(random, 5, 7);
    const n = randomInt(random, 10 ** (digits - 1), 10 ** digits - 1);
    return wordQ(`${groupDigits(n)}을(를) 숫자로 다시 쓰세요 (쉼표 없이).`, '', n, '', `Write ${groupDigits(n)} without commas.`);
  }
  const digits = randomInt(random, 4, 6);
  const n = randomInt(random, 10 ** (digits - 1), 10 ** digits - 1);
  const parts = String(n).split('').map((d, i) => Number(d) * 10 ** (String(n).length - 1 - i)).filter((v) => v !== 0);
  return wordQ(`${parts.join(' + ')} 을(를) 하나의 수로 나타내세요.`, '', n, '', `Write ${parts.join(' + ')} as a single number.`);
}

export function m1Compare(random) {
  const mode = randomInt(random, 0, 2);
  if (mode === 0) {
    const digits = randomInt(random, 5, 7);
    let a = randomInt(random, 10 ** (digits - 1), 10 ** digits - 1);
    let b = randomInt(random, 10 ** (digits - 1), 10 ** digits - 1);
    if (a === b) b += 1;
    return inline(`${groupDigits(a)} □ ${groupDigits(b)}`, a > b ? '>' : '<');
  }
  const digits = randomInt(random, 4, 6);
  const n = randomInt(random, 10 ** (digits - 1), 10 ** digits - 1);
  const unit = pick(random, [1000, 10000, 100000]);
  const more = random() < 0.5;
  return wordQ(
    `${groupDigits(n)}보다 ${groupDigits(unit)} ${more ? '큰' : '작은'} 수는 얼마인가요?`,
    '',
    more ? n + unit : n - unit,
    '',
    `What number is ${groupDigits(unit)} ${more ? 'more than' : 'less than'} ${groupDigits(n)}?`,
  );
}

export function m1Rounding(random) {
  const placeIndex = pick(random, [1, 2, 3, 4]);
  const place = 10 ** placeIndex;
  const n = randomInt(random, place * 2, place * 999);
  const rounded = Math.round(n / place) * place;
  return wordQ(
    `${groupDigits(n)}을(를) ${PLACE_NAMES_KO[placeIndex]}의 자리까지 반올림하세요.`,
    '',
    groupDigits(rounded),
    '',
    `Round ${groupDigits(n)} to the nearest ${PLACE_NAMES_EN[placeIndex]}.`,
  );
}

export function m1Addition(random) {
  const mode = random() < 0.6 ? 0 : 1;
  if (mode === 0) {
    const digits = randomInt(random, 4, 5);
    const a = randomInt(random, 10 ** (digits - 1), 10 ** digits - 1);
    const b = randomInt(random, 10 ** (digits - 1), 10 ** digits - 1);
    return vertical(a, b, '+', a + b);
  }
  const a = randomInt(random, 3000, 89999);
  const b = randomInt(random, 3000, 89999);
  return wordQ(
    `어느 목장에서 이번 달 우유를 ${groupDigits(a)}L, 다음 달에는 ${groupDigits(b)}L 생산했습니다. 두 달 동안 생산한 우유는 모두 몇 L인가요?`,
    '',
    a + b,
    'L',
    `A farm produced ${groupDigits(a)} L of milk one month and ${groupDigits(b)} L the next. How much milk in total?`,
  );
}

export function m1Subtraction(random) {
  const mode = random() < 0.6 ? 0 : 1;
  if (mode === 0) {
    const digits = randomInt(random, 4, 5);
    const a = randomInt(random, 10 ** (digits - 1), 10 ** digits - 1);
    const b = randomInt(random, 10 ** (digits - 2), a - 1);
    return vertical(a, b, '-', a - b);
  }
  const a = randomInt(random, 20000, 98000);
  const b = randomInt(random, 3000, a - 1000);
  return wordQ(
    `염소는 1년에 우유를 ${groupDigits(b)}L, 소는 ${groupDigits(a)}L 생산합니다. 염소가 소만큼 생산하려면 몇 L를 더 생산해야 하나요?`,
    '',
    a - b,
    'L',
    `A goat produces ${groupDigits(b)} L of milk a year and a cow produces ${groupDigits(a)} L. How many more liters must the goat produce to match the cow?`,
  );
}

export function m1WordProblems(random) {
  const mode = randomInt(random, 0, 2);
  if (mode === 0) {
    const smaller = randomInt(random, 1200, 8000);
    const diff = randomInt(random, 500, 4000);
    return wordQ(
      `도서관 책이 ${groupDigits(smaller + diff)}권, 서점 책이 ${groupDigits(smaller)}권 있습니다. 도서관 책이 서점 책보다 몇 권 더 많나요?`,
      '',
      diff,
      '권',
      `A library has ${groupDigits(smaller + diff)} books and a bookstore has ${groupDigits(smaller)} books. How many more does the library have?`,
    );
  }
  if (mode === 1) {
    const step1 = randomInt(random, 1500, 6000);
    const step2 = randomInt(random, 800, 4000);
    const start = randomInt(random, 3000, 9000);
    return wordQ(
      `어느 공장에서 월요일에 부품 ${groupDigits(start)}개를 만들었습니다. 화요일에는 ${groupDigits(step1)}개를 더 만들고, 수요일에는 ${groupDigits(step2)}개를 판매했습니다. 수요일이 끝난 후 남은 부품은 몇 개인가요?`,
      '',
      start + step1 - step2,
      '개',
      `A factory made ${groupDigits(start)} parts Monday, ${groupDigits(step1)} more Tuesday, and sold ${groupDigits(step2)} Wednesday. How many parts remain?`,
    );
  }
  const total = randomInt(random, 6000, 20000);
  const partA = randomInt(random, 2000, total - 2000);
  return wordQ(
    `두 도시의 인구를 합하면 ${groupDigits(total)}명이고, 한 도시의 인구가 ${groupDigits(partA)}명일 때 다른 도시의 인구는 몇 명인가요?`,
    '',
    total - partA,
    '명',
    `Two cities have a combined population of ${groupDigits(total)}. If one has ${groupDigits(partA)}, how many does the other have?`,
  );
}

// ---------- Module 2: Metric Unit Conversions ----------

const METRIC_UNITS = [
  { big: 'km', small: 'm', factor: 1000 },
  { big: 'm', small: 'cm', factor: 100 },
  { big: 'kg', small: 'g', factor: 1000 },
  { big: 'L', small: 'mL', factor: 1000 },
];

export function m2MetricConvert(random) {
  const unit = pick(random, METRIC_UNITS);
  const mode = randomInt(random, 0, 2);
  if (mode === 0) {
    const big = randomInt(random, 1, 9);
    const small = pick(random, [0, unit.factor / 10, unit.factor / 4, unit.factor / 2]);
    return wordQ(`${big}${unit.big} ${small}${unit.small}을(를) ${unit.small} 단위로 나타내세요.`, '', big * unit.factor + small, unit.small, `Express ${big}${unit.big} ${small}${unit.small} in ${unit.small}.`);
  }
  if (mode === 1) {
    const total = randomInt(random, 1, 9) * unit.factor + pick(random, [0, unit.factor / 10, unit.factor / 4, unit.factor / 2]);
    const bigPart = Math.floor(total / unit.factor);
    const smallPart = total % unit.factor;
    return wordQ(`${total}${unit.small}을(를) ${unit.big}과(와) ${unit.small}로 나타내세요.`, '', smallPart === 0 ? `${bigPart}${unit.big}` : `${bigPart}${unit.big} ${smallPart}${unit.small}`, '', `Express ${total}${unit.small} in ${unit.big} and ${unit.small}.`);
  }
  const a = randomInt(random, 1, 6) * unit.factor + pick(random, [0, unit.factor / 4, unit.factor / 2]);
  const b = randomInt(random, 1, 6) * unit.factor + pick(random, [0, unit.factor / 4, unit.factor / 2]);
  const operator = random() < 0.5 ? '+' : '-';
  let x = a;
  let y = b;
  if (operator === '-' && y > x) [x, y] = [y, x];
  const total = operator === '+' ? x + y : x - y;
  const bigPart = Math.floor(total / unit.factor);
  const smallPart = total % unit.factor;
  return wordQ(
    `${Math.floor(x / unit.factor)}${unit.big} ${x % unit.factor}${unit.small} ${operator} ${Math.floor(y / unit.factor)}${unit.big} ${y % unit.factor}${unit.small}을(를) 계산하세요.`,
    '',
    smallPart === 0 ? `${bigPart}${unit.big}` : `${bigPart}${unit.big} ${smallPart}${unit.small}`,
  );
}

export function m2MetricApply(random) {
  const mode = randomInt(random, 0, 2);
  if (mode === 0) {
    const legMeters = randomInt(random, 300, 900);
    const laps = randomInt(random, 3, 6);
    return wordQ(
      `한 바퀴가 ${legMeters}m인 트랙을 ${laps}바퀴 돌았습니다. 모두 몇 m를 달렸나요? (필요하면 km와 m로 나타내세요)`,
      '',
      legMeters * laps,
      'm',
      `A track is ${legMeters} m per lap. After ${laps} laps, how many meters were run?`,
    );
  }
  if (mode === 1) {
    const bagsKg = randomInt(random, 2, 8);
    const bagWeight = pick(random, [250, 500, 750]);
    const alreadyG = randomInt(random, 500, 4000);
    return wordQ(
      `${bagWeight}g짜리 봉지 ${bagsKg}개와 따로 ${alreadyG}g이 있습니다. 무게는 모두 몇 g인가요?`,
      '',
      bagWeight * bagsKg + alreadyG,
      'g',
      `${bagsKg} bags of ${bagWeight}g each, plus ${alreadyG}g more. Total weight?`,
    );
  }
  const bottleMl = pick(random, [250, 330, 500, 750]);
  const bottles = randomInt(random, 4, 10);
  const usedMl = randomInt(random, 200, 1500);
  return wordQ(
    `${bottleMl}mL 물병 ${bottles}개가 있었는데, ${usedMl}mL를 사용했습니다. 남은 양은 몇 mL인가요?`,
    '',
    bottleMl * bottles - usedMl,
    'mL',
    `There were ${bottles} bottles of ${bottleMl}mL. After using ${usedMl}mL, how much remains?`,
  );
}

// ---------- Module 3: Multi-Digit Multiplication and Division ----------

export function m3AreaPerimeterCompare(random) {
  const mode = randomInt(random, 0, 1);
  if (mode === 0) {
    const w = randomInt(random, 4, 30);
    const h = randomInt(random, 4, 30);
    const askArea = random() < 0.5;
    return {
      ...wordQ(`직사각형의 가로가 ${w}cm, 세로가 ${h}cm입니다. ${askArea ? '넓이' : '둘레'}를 구하세요.`, '', askArea ? w * h : 2 * (w + h), askArea ? 'cm²' : 'cm', `A rectangle is ${w}cm by ${h}cm. Find its ${askArea ? 'area' : 'perimeter'}.`),
      visualKind: 'polygon-figure',
      polygon: { shape: 'rectangle', a: w, b: h },
    };
  }
  const base = randomInt(random, 3, 12);
  const factor = randomInt(random, 2, 9);
  return wordQ(
    `민수의 나이는 ${base}살이고, 아버지의 나이는 민수 나이의 ${factor}배입니다. 아버지는 몇 살인가요?`,
    '',
    base * factor,
    '살',
    `Minsu is ${base} years old. His father is ${factor} times as old. How old is the father?`,
  );
}

export function m3MultiplyPowersOfTen(random) {
  const base = randomInt(random, 2, 90);
  const factor = pick(random, [10, 100, 1000]);
  const reverse = random() < 0.35;
  if (reverse) return inline(`${base * factor} ÷ ${factor}`, base);
  return inline(`${base} × ${factor}`, base * factor);
}

export function m3MultiplyMultiDigitByOne(random) {
  const digits = randomInt(random, 2, 4);
  const a = randomInt(random, 10 ** (digits - 1), 10 ** digits - 1);
  const b = randomInt(random, 2, 9);
  return vertical(a, b, '×', a * b);
}

export function m3MultiplyWordProblems(random) {
  const mode = randomInt(random, 0, 2);
  if (mode === 0) {
    const unitPrice = randomInt(random, 120, 890);
    const count = randomInt(random, 15, 60);
    return wordQ(`연필 한 자루의 가격이 ${unitPrice}원입니다. ${count}자루를 사면 얼마인가요?`, '', unitPrice * count, '원', `A pencil costs ${unitPrice} won. How much do ${count} pencils cost?`);
  }
  if (mode === 1) {
    const perBox = randomInt(random, 24, 96);
    const boxes = randomInt(random, 6, 25);
    const extra = randomInt(random, 5, 40);
    return wordQ(`한 상자에 ${perBox}개씩 든 상자가 ${boxes}개 있고, 낱개로 ${extra}개가 더 있습니다. 모두 몇 개인가요?`, '', perBox * boxes + extra, '개', `${boxes} boxes of ${perBox} items each, plus ${extra} more. Total items?`);
  }
  const rate = randomInt(random, 15, 60);
  const days = randomInt(random, 12, 30);
  const already = randomInt(random, 50, 400);
  return wordQ(`하루에 책을 ${rate}쪽씩 ${days}일 동안 읽었고, 그 전에 이미 ${already}쪽을 읽었습니다. 모두 몇 쪽을 읽었나요?`, '', rate * days + already, '쪽', `Read ${rate} pages/day for ${days} days, plus ${already} pages already read. Total pages?`);
}

export function m3DivisionWithRemainder(random) {
  const divisor = randomInt(random, 3, 9);
  const quotient = randomInt(random, 4, 30);
  const remainder = randomInt(random, 1, divisor - 1);
  const dividend = divisor * quotient + remainder;
  const askRemainderWord = random() < 0.4;
  if (askRemainderWord) {
    return wordQ(`사탕 ${dividend}개를 한 사람에게 ${divisor}개씩 나누어 줄 때, 몇 명에게 나누어 줄 수 있고 몇 개가 남나요?`, '', `${quotient}명, ${remainder}개`, '', `Give out ${dividend} candies, ${divisor} per person. How many people, and how many left over?`);
  }
  return inline(`${dividend} ÷ ${divisor}`, `${quotient} R ${remainder}`);
}

export function m3FactorsPrimes(random) {
  const mode = randomInt(random, 0, 3);
  if (mode === 0) {
    const n = randomInt(random, 12, 100);
    const factors = Array.from({ length: n }, (_, i) => i + 1).filter((v) => n % v === 0);
    return wordQ(`${n}의 약수를 모두 쓰세요.`, '', factors.join(', '), '', `List all the factors of ${n}.`);
  }
  if (mode === 1) {
    const n = randomInt(random, 2, 100);
    const factors = Array.from({ length: n }, (_, i) => i + 1).filter((v) => n % v === 0);
    const isPrime = factors.length === 2;
    return wordQ(`${n}은(는) 소수인가요, 합성수인가요?`, '', isPrime ? '소수' : '합성수', '', `Is ${n} prime or composite?`);
  }
  if (mode === 2) {
    const base = randomInt(random, 3, 12);
    const n = randomInt(random, 20, 144);
    return wordQ(`${n}은(는) ${base}의 배수인가요? (예 또는 아니오)`, '', n % base === 0 ? '예' : '아니오', '', `Is ${n} a multiple of ${base}?`);
  }
  const base = randomInt(random, 3, 9);
  const count = randomInt(random, 4, 9);
  return wordQ(`${base}의 ${count}번째 배수를 구하세요.`, '', base * count, '', `Find the ${count}th multiple of ${base}.`);
}

export function m3DivisionLarge(random) {
  const divisor = randomInt(random, 2, 9);
  const digits = randomInt(random, 3, 4);
  const quotient = randomInt(random, 10 ** (digits - 2), 10 ** (digits - 1) - 1);
  const remainder = random() < 0.5 ? randomInt(random, 1, divisor - 1) : 0;
  const dividend = divisor * quotient + remainder;
  return inline(`${dividend} ÷ ${divisor}`, remainder ? `${quotient} R ${remainder}` : quotient);
}

export function m3Multiply2x2(random) {
  const a = randomInt(random, 11, 99);
  const b = randomInt(random, 11, 99);
  return vertical(a, b, '×', a * b);
}

// ---------- Module 4: Angle Measure and Plane Figures ----------

export function m4LinesAngles(random) {
  const mode = randomInt(random, 0, 2);
  if (mode === 0) {
    const relation = pick(random, ['수직', '평행']);
    return wordQ(
      relation === '수직' ? '한 점에서 만나 이루는 각이 모두 직각인 두 직선을 무엇이라고 하나요?' : '아무리 늘여도 서로 만나지 않는 두 직선을 무엇이라고 하나요?',
      '',
      relation === '수직' ? '수직선(수직인 직선)' : '평행선',
      '',
      relation === '수직' ? 'Two lines that meet to form right angles are called ___ lines.' : 'Two lines that never meet are called ___ lines.',
    );
  }
  const angle = randomInt(random, 5, 179);
  const type = angle < 90 ? '예각' : angle === 90 ? '직각' : '둔각';
  return { ...wordQ('그림의 각을 예각, 직각, 둔각 중 하나로 분류하세요.', '', type, '', 'Classify the angle as acute, right, or obtuse.'), visualKind: 'angle-figure', angle: { degrees: angle } };
}

const BENCHMARK_ANGLES = [30, 45, 60, 90, 120, 135, 150, 180];

export function m4AngleMeasure(random) {
  const useBenchmark = random() < 0.5;
  const angle = useBenchmark ? pick(random, BENCHMARK_ANGLES) : randomInt(random, 10, 175);
  return { ...wordQ('각도기를 사용하여 그림의 각의 크기를 재세요.', '', angle, '°', 'Use a protractor to measure the angle shown.'), visualKind: 'angle-figure', angle: { degrees: angle } };
}

export function m4AngleAddition(random) {
  const useStraight = random() < 0.5;
  const total = useStraight ? 180 : 90;
  const parts = random() < 0.6 ? 2 : 3;
  if (parts === 2) {
    const known = randomInt(random, 10, total - 10);
    return wordQ(`한 각이 ${total === 180 ? '일직선을 이루는' : '직각을 이루는'} 두 각으로 나뉘어 있습니다. 한 각이 ${known}°일 때 나머지 각은 몇 도인가요?`, '', total - known, '°');
  }
  let a = randomInt(random, 10, total - 30);
  let b = randomInt(random, 10, total - a - 10);
  return wordQ(`한 각이 세 개의 작은 각으로 나뉘어 있습니다. 두 각이 각각 ${a}°, ${b}°이고 전체가 ${total}°일 때 나머지 각은 몇 도인가요?`, '', total - a - b, '°');
}

const TRIANGLE_TYPES_BY_SIDE = ['정삼각형', '이등변삼각형', '부등변삼각형'];

export function m4FiguresSymmetry(random) {
  const mode = randomInt(random, 0, 2);
  if (mode === 0) {
    const angle = randomInt(random, 20, 150);
    const angleType = angle < 90 ? '예각삼각형' : angle === 90 ? '직각삼각형' : '둔각삼각형';
    return wordQ(`한 각이 ${angle}°인 삼각형이 있습니다. 이 삼각형은 예각삼각형, 직각삼각형, 둔각삼각형 중 무엇일 수 있나요?`, '', angleType, '', `A triangle has one angle of ${angle}°. Classify it (acute/right/obtuse) based on that angle.`);
  }
  if (mode === 1) {
    const sides = pick(random, [[5, 5, 5], [5, 5, 8], [4, 6, 9]]);
    const type = sides[0] === sides[1] && sides[1] === sides[2] ? '정삼각형' : sides[0] === sides[1] || sides[1] === sides[2] ? '이등변삼각형' : '부등변삼각형';
    return { ...wordQ(`변의 길이가 ${sides.join('cm, ')}cm인 삼각형을 변의 길이에 따라 분류하세요.`, '', type, '', `A triangle has sides ${sides.join(', ')}cm. Classify it by side length.`), visualKind: 'polygon-figure', polygon: { shape: 'triangle', a: sides[0], height: 10 } };
  }
  const quad = pick(random, [
    { name: '직사각형', desc: '네 각이 모두 직각이고 마주 보는 두 쌍의 변이 평행한 사각형' },
    { name: '평행사변형', desc: '마주 보는 두 쌍의 변이 서로 평행한 사각형' },
    { name: '사다리꼴', desc: '적어도 한 쌍의 마주 보는 변이 평행한 사각형' },
    { name: '마름모', desc: '네 변의 길이가 모두 같은 사각형' },
  ]);
  return wordQ(`다음 설명에 알맞은 사각형의 이름을 쓰세요: "${quad.desc}"`, '', quad.name);
}

// ---------- Module 5: Fraction Equivalence, Ordering, and Operations ----------

export function m5DecomposeFractions(random) {
  const denominator = randomInt(random, 4, 12);
  const numerator = randomInt(random, 2, denominator - 1);
  return {
    ...wordQ(`${numerator}/${denominator}을(를) 단위분수(분자가 1인 분수)의 합으로 나타내세요.`, '', `${'1/' + denominator} × ${numerator} (또는 ${Array(numerator).fill(`1/${denominator}`).join(' + ')})`, '', `Decompose ${numerator}/${denominator} as a sum of unit fractions.`),
    visualKind: 'fraction-tape',
    tape: { total: denominator, parts: denominator, mark: numerator },
  };
}

export function m5FractionEquivalence(random) {
  const n = randomInt(random, 1, 9);
  const d = randomInt(random, n + 1, 12);
  const scale = randomInt(random, 2, 8);
  const scaleUp = random() < 0.5;
  if (scaleUp) return inline(`${n}/${d} = □/${d * scale}`, n * scale);
  return inline(`${n * scale}/${d * scale} = □/${d}`, n);
}

export function m5FractionCompare(random) {
  const d1 = randomInt(random, 3, 10);
  let d2 = randomInt(random, 3, 10);
  if (d2 === d1) d2 += 1;
  const n1 = randomInt(random, 1, d1 - 1);
  const n2 = randomInt(random, 1, d2 - 1);
  const left = n1 / d1;
  const right = n2 / d2;
  const answer = left === right ? '=' : left > right ? '>' : '<';
  return inline(`${n1}/${d1} □ ${n2}/${d2}`, answer);
}

export function m5FractionAddSubLike(random) {
  const d = randomInt(random, 3, 12);
  const terms = random() < 0.3 ? 3 : 2;
  const parts = Array.from({ length: terms }, () => randomInt(random, 1, d - 1));
  const operators = Array.from({ length: terms - 1 }, () => (random() < 0.6 ? '+' : '-'));
  let total = parts[0];
  operators.forEach((op, i) => { total = op === '+' ? total + parts[i + 1] : total - parts[i + 1]; });
  if (total < 0 || total > d) return m5FractionAddSubLike(random);
  const expr = parts.map((p, i) => (i === 0 ? `${p}/${d}` : `${operators[i - 1]} ${p}/${d}`)).join(' ');
  return inline(expr, fractionAnswer(total, d));
}

export function m5FractionGreaterThanOne(random) {
  const mode = randomInt(random, 0, 2);
  const d = randomInt(random, 3, 10);
  if (mode === 0) {
    const whole = randomInt(random, 1, 6);
    const num = randomInt(random, 1, d - 1);
    return inline(`${whole} ${num}/${d} → 가분수`, whole * d + num);
  }
  if (mode === 1) {
    const improper = randomInt(random, d + 1, d * 6);
    return inline(`${improper}/${d} → 대분수`, fractionAnswer(improper, d));
  }
  const left = randomInt(random, d + 1, d * 4);
  let right = randomInt(random, d + 1, d * 4);
  if (right === left) right += 1;
  return inline(`${left}/${d} □ ${right}/${d}`, left > right ? '>' : '<');
}

export function m5MixedNumberAddSub(random) {
  const d = randomInt(random, 3, 10);
  const w1 = randomInt(random, 1, 8);
  const w2 = randomInt(random, 1, 8);
  const n1 = randomInt(random, 1, d - 1);
  const n2 = randomInt(random, 1, d - 1);
  const operator = random() < 0.55 ? '+' : '-';
  let a = w1 * d + n1;
  let b = w2 * d + n2;
  if (operator === '-' && b > a) [a, b] = [b, a];
  const total = operator === '+' ? a + b : a - b;
  return inline(`${fractionAnswer(a, d)} ${operator} ${fractionAnswer(b, d)}`, fractionAnswer(total, d));
}

export function m5FractionMultiplyWhole(random) {
  const mode = random() < 0.5;
  const d = randomInt(random, 3, 10);
  if (mode) {
    const n = randomInt(random, 1, d - 1);
    const whole = randomInt(random, 2, 9);
    return inline(`${whole} × ${n}/${d}`, fractionAnswer(whole * n, d));
  }
  const w = randomInt(random, 1, 6);
  const n = randomInt(random, 1, d - 1);
  const whole = randomInt(random, 2, 6);
  const total = w * d + n;
  return inline(`${whole} × ${fractionAnswer(total, d)}`, fractionAnswer(whole * total, d));
}

export function m5FractionPattern(random) {
  const terms = randomInt(random, 3, 5);
  const denominators = Array.from({ length: terms }, (_, i) => 2 ** (i + 1));
  const expr = denominators.map((d) => `1/${d}`).join(' + ');
  const sum = 1 - 1 / denominators[denominators.length - 1];
  return inline(expr, fractionAnswer(Math.round(sum * denominators[denominators.length - 1]), denominators[denominators.length - 1]));
}

// ---------- Module 6: Decimal Fractions ----------

export function m6Tenths(random) {
  const tenths = randomInt(random, 1, 9);
  const asFraction = random() < 0.5;
  if (asFraction) return inline(`${tenths}/10 → 소수`, decimal(tenths / 10, 1));
  return inline(`0.${tenths} → 분수`, `${tenths}/10`);
}

export function m6Hundredths(random) {
  const mode = randomInt(random, 0, 2);
  if (mode === 0) {
    const hundredths = randomInt(random, 1, 99);
    return inline(`${hundredths}/100 → 소수`, decimal(hundredths / 100, 2));
  }
  if (mode === 1) {
    const tenths = randomInt(random, 1, 9);
    return inline(`${tenths}/10 = □/100`, tenths * 10);
  }
  const whole = randomInt(random, 1, 9);
  const hundredths = randomInt(random, 1, 99);
  return inline(`${whole} ${hundredths}/100 → 소수`, decimal(whole + hundredths / 100, 2));
}

export function m6DecimalCompare(random) {
  const places = pick(random, [1, 2]);
  const scale = 10 ** places;
  let a = randomInt(random, 1, scale * 20) / scale;
  let b = randomInt(random, 1, scale * 20) / scale;
  if (a === b) b = decimal(b + 1 / scale, places);
  return inline(`${a} □ ${b}`, a > b ? '>' : '<');
}

export function m6DecimalAddition(random) {
  const places = pick(random, [1, 2]);
  const scale = 10 ** places;
  const a = randomInt(random, 1, scale * 15) / scale;
  const b = randomInt(random, 1, scale * 15) / scale;
  const operator = random() < 0.6 ? '+' : '-';
  let x = a;
  let y = b;
  if (operator === '-' && y > x) [x, y] = [y, x];
  return inline(`${x} ${operator} ${y}`, decimal(operator === '+' ? x + y : x - y, places));
}

export function m6MoneyDecimals(random) {
  const dollars = randomInt(random, 1, 40);
  const cents = pick(random, [0, 25, 50, 75]);
  const mode = randomInt(random, 0, 1);
  if (mode === 0) {
    return wordQ(`${dollars}달러 ${cents}센트를 소수로 나타내면 얼마인가요? (예: $12.50)`, '', `$${dollars}.${String(cents).padStart(2, '0')}`, '', `Write ${dollars} dollars ${cents} cents as a decimal.`);
  }
  const price1 = decimal(randomInt(random, 100, 4000) / 100, 2);
  const price2 = decimal(randomInt(random, 100, 4000) / 100, 2);
  return wordQ(`연필이 $${price1.toFixed(2)}, 공책이 $${price2.toFixed(2)}입니다. 두 개를 사면 모두 얼마인가요?`, '', `$${decimal(price1 + price2, 2).toFixed(2)}`, '', `A pencil costs $${price1.toFixed(2)} and a notebook $${price2.toFixed(2)}. Total cost?`);
}

// ---------- Module 7: Exploring Measurement with Multiplication ----------

const CONVERSION_TABLE_UNITS = [
  { big: 'ft', small: 'in', factor: 12, ko: '피트/인치' },
  { big: 'lb', small: 'oz', factor: 16, ko: '파운드/온스' },
  { big: 'gal', small: 'qt', factor: 4, ko: '갤런/쿼트' },
  { big: 'hr', small: 'min', factor: 60, ko: '시간/분' },
];

export function m7ConversionTables(random) {
  const unit = pick(random, CONVERSION_TABLE_UNITS);
  const count = randomInt(random, 2, 9);
  return wordQ(`환산표를 사용하세요: 1${unit.big} = ${unit.factor}${unit.small}. ${count}${unit.big}은(는) 몇 ${unit.small}인가요?`, '', count * unit.factor, unit.small, `Using 1${unit.big} = ${unit.factor}${unit.small}, convert ${count}${unit.big} to ${unit.small}.`);
}

export function m7MixedUnitProblems(random) {
  const unit = pick(random, CONVERSION_TABLE_UNITS);
  const bigPart = randomInt(random, 2, 8);
  const smallPart = randomInt(random, 1, unit.factor - 1);
  const totalSmall = bigPart * unit.factor + smallPart;
  const subtractSmall = randomInt(random, 1, totalSmall - 1);
  return wordQ(
    `${bigPart}${unit.big} ${smallPart}${unit.small}에서 ${subtractSmall}${unit.small}을(를) 빼면 몇 ${unit.small}인가요?`,
    '',
    totalSmall - subtractSmall,
    unit.small,
    `Starting from ${bigPart}${unit.big} ${smallPart}${unit.small}, subtract ${subtractSmall}${unit.small}. Result in ${unit.small}?`,
  );
}

export function m7MixedNumberMeasurement(random) {
  const unit = pick(random, [{ label: 'm', small: 'cm', factor: 100 }, { label: 'kg', small: 'g', factor: 1000 }, { label: 'L', small: 'mL', factor: 1000 }]);
  const whole = randomInt(random, 1, 8);
  const fracDenominator = pick(random, [2, 4, 5, 10]);
  const fracNumerator = randomInt(random, 1, fracDenominator - 1);
  const smallPart = Math.round((fracNumerator / fracDenominator) * unit.factor);
  return wordQ(
    `${whole} ${fracNumerator}/${fracDenominator}${unit.label}을(를) ${unit.small} 단위의 한 수로 나타내세요.`,
    '',
    whole * unit.factor + smallPart,
    unit.small,
    `Express ${whole} ${fracNumerator}/${fracDenominator}${unit.label} as a single measurement in ${unit.small}.`,
  );
}

export function m7CompositeAreaReview(random) {
  const w = randomInt(random, 12, 24);
  const h = randomInt(random, 10, 20);
  const notchW = randomInt(random, 3, Math.floor(w / 2));
  const notchH = randomInt(random, 3, Math.floor(h / 2));
  const area = w * h - notchW * notchH;
  return {
    ...wordQ(`직사각형(가로 ${w}cm, 세로 ${h}cm)에서 한쪽 모서리를 가로 ${notchW}cm, 세로 ${notchH}cm만큼 잘라냈습니다. 남은 도형의 넓이는 몇 cm²인가요?`, '', area, 'cm²', `A ${w}cm by ${h}cm rectangle has a ${notchW}cm by ${notchH}cm corner removed. Find the remaining area.`),
    visualKind: 'polygon-figure',
    polygon: { shape: 'lshape', a: notchW, b: notchH, w: w, h: h },
  };
}
