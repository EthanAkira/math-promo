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
  return `${top}/${bottom}`;
}

function decimal(value, places = 2) {
  return Number(value.toFixed(places));
}

function inline(expression, answer) {
  return { kind: 'inline', expression, answer: String(answer) };
}

function wordQ(prompt, expression, answer, answerSuffix = '', promptEn = '', expressionEn = '') {
  return { kind: 'word', prompt, expression, answer: String(answer), answerSuffix, promptEn, expressionEn };
}

function formatLengthCm(totalCm) {
  if (totalCm < 100) return `${totalCm}cm`;
  if (totalCm % 100 === 0) return `${totalCm / 100}m`;
  return `${Math.floor(totalCm / 100)}m ${totalCm % 100}cm`;
}

export function lengthCalcSimple(random) {
  const operator = random() < 0.55 ? '+' : '-';
  const total1 = randomInt(random, 0, 3) * 100 + randomInt(random, 0, 99);
  let total2 = randomInt(random, 0, 2) * 100 + randomInt(random, 0, 99);
  let a = total1;
  let b = total2;
  if (operator === '-' && b > a) [a, b] = [b, a];
  const result = operator === '+' ? a + b : a - b;
  return inline(`${formatLengthCm(a)} ${operator} ${formatLengthCm(b)}`, formatLengthCm(result));
}

export function timeAddCalc(random) {
  const hour = randomInt(random, 1, 11);
  const minute = pick(random, [0, 10, 15, 20, 30, 40, 45, 50]);
  const addMinutes = pick(random, [10, 15, 20, 30, 40, 45, 50, 60, 70, 90]);
  const startTotal = hour * 60 + minute;
  const endTotal = startTotal + addMinutes;
  let endHour = Math.floor(endTotal / 60) % 12;
  if (endHour === 0) endHour = 12;
  const endMinute = endTotal % 60;
  return wordQ(
    `${hour}시 ${minute}분에서 ${addMinutes}분 후는 몇 시 몇 분일까요?`,
    '',
    endMinute === 0 ? `${endHour}시` : `${endHour}시 ${endMinute}분`,
    '',
    `What time is it ${addMinutes} minutes after ${hour}:${String(minute).padStart(2, '0')}?`,
  );
}

export function clockRead(random) {
  const hour = randomInt(random, 1, 12);
  const minute = pick(random, [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]);
  const answer = minute === 0 ? `${hour}시` : `${hour}시 ${minute}분`;
  return {
    ...wordQ('시계를 보고 몇 시 몇 분인지 쓰세요.', '', answer, '', 'Read the clock and write the time.'),
    visualKind: 'clock',
    clock: { hour, minute },
  };
}

export function measurementUnitConvert(random) {
  const mode = randomInt(random, 0, 5);
  if (mode === 0) {
    const km = randomInt(random, 1, 9);
    const m = pick(random, [0, 100, 200, 250, 400, 500, 600, 750, 800]);
    return wordQ('다음을 m 단위로 나타내세요.', `${km}km ${m}m`, km * 1000 + m, 'm');
  }
  if (mode === 1) {
    const totalM = randomInt(random, 1, 9) * 1000 + pick(random, [0, 100, 250, 500, 750]);
    const km = Math.floor(totalM / 1000);
    const m = totalM % 1000;
    return wordQ('다음을 km와 m로 나타내세요.', `${totalM}m`, m === 0 ? `${km}km` : `${km}km ${m}m`);
  }
  if (mode === 2) {
    const cm = randomInt(random, 2, 15);
    return wordQ('다음을 mm 단위로 나타내세요.', `${cm}cm`, cm * 10, 'mm');
  }
  if (mode === 3) {
    const min = randomInt(random, 1, 9);
    const sec = pick(random, [0, 10, 15, 20, 30, 40, 45, 50]);
    return wordQ('다음을 초 단위로 나타내세요.', `${min}분 ${sec}초`, min * 60 + sec, '초');
  }
  if (mode === 4) {
    const totalSec = randomInt(random, 1, 9) * 60 + pick(random, [0, 10, 15, 20, 30, 40, 45, 50]);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return wordQ('다음을 분과 초로 나타내세요.', `${totalSec}초`, sec === 0 ? `${min}분` : `${min}분 ${sec}초`);
  }
  const l = randomInt(random, 1, 9);
  const ml = pick(random, [0, 100, 200, 250, 500, 750]);
  return wordQ('다음을 mL 단위로 나타내세요.', `${l}L ${ml}mL`, l * 1000 + ml, 'mL');
}

export function weightCapacityConvert(random) {
  const mode = randomInt(random, 0, 3);
  if (mode === 0) {
    const kg = randomInt(random, 1, 9);
    const g = pick(random, [0, 100, 250, 500, 750]);
    return wordQ('다음을 g 단위로 나타내세요.', `${kg}kg ${g}g`, kg * 1000 + g, 'g');
  }
  if (mode === 1) {
    const totalG = randomInt(random, 1, 9) * 1000 + pick(random, [0, 100, 250, 500, 750]);
    const kg = Math.floor(totalG / 1000);
    const g = totalG % 1000;
    return wordQ('다음을 kg과 g으로 나타내세요.', `${totalG}g`, g === 0 ? `${kg}kg` : `${kg}kg ${g}g`);
  }
  if (mode === 2) {
    const totalMl = randomInt(random, 1, 9) * 1000 + pick(random, [0, 100, 250, 500, 750]);
    const l = Math.floor(totalMl / 1000);
    const ml = totalMl % 1000;
    return wordQ('다음을 L와 mL로 나타내세요.', `${totalMl}mL`, ml === 0 ? `${l}L` : `${l}L ${ml}mL`);
  }
  const kg1 = randomInt(random, 1, 5);
  const g1 = pick(random, [0, 100, 250, 500, 750]);
  const kg2 = randomInt(random, 1, 4);
  const g2 = pick(random, [0, 100, 250, 500, 750]);
  const totalG = (kg1 * 1000 + g1) + (kg2 * 1000 + g2);
  const kg = Math.floor(totalG / 1000);
  const g = totalG % 1000;
  return wordQ('무게의 합을 구하세요.', `${kg1}kg ${g1}g + ${kg2}kg ${g2}g`, g === 0 ? `${kg}kg` : `${kg}kg ${g}g`);
}

export function circleBasic(random) {
  const radius = randomInt(random, 2, 20);
  if (random() < 0.5) return wordQ('원의 반지름이 주어졌을 때 지름을 구하세요.', `반지름 ${radius}cm`, radius * 2, 'cm');
  return wordQ('원의 지름이 주어졌을 때 반지름을 구하세요.', `지름 ${radius * 2}cm`, radius, 'cm');
}

export function angleBasic(random) {
  const mode = randomInt(random, 0, 2);
  if (mode === 0) {
    const operator = random() < 0.5 ? '+' : '-';
    let a = randomInt(random, 10, 170);
    let b = randomInt(random, 10, 170);
    if (operator === '+') { while (a + b >= 180) b = randomInt(random, 10, 170); }
    else if (a < b) [a, b] = [b, a];
    return inline(`${a}° ${operator} ${b}°`, operator === '+' ? a + b : a - b);
  }
  if (mode === 1) {
    const angle = randomInt(random, 5, 179);
    const type = angle < 90 ? '예각' : angle === 90 ? '직각' : '둔각';
    return { ...wordQ('그림의 각을 예각, 직각, 둔각 중 하나로 분류하세요.', '', type, '', 'Classify the angle shown as acute, right, or obtuse.', ''), visualKind: 'angle-figure', angle: { degrees: angle } };
  }
  const useStraight = random() < 0.5;
  const total = useStraight ? 180 : 90;
  const known = randomInt(random, 10, total - 10);
  const label = useStraight ? '일직선을 이루는 두 각의 합은 180°입니다.' : '두 각의 합이 직각(90°)입니다.';
  return wordQ(`${label} 한 각이 ${known}°일 때 나머지 각은 몇 도인가요?`, '', total - known, '°');
}

export function polygonAngleMissing(random) {
  if (random() < 0.5) {
    let a = randomInt(random, 20, 120);
    let b = randomInt(random, 20, 120);
    while (a + b >= 170) { a = randomInt(random, 20, 110); b = randomInt(random, 20, 110); }
    return wordQ('삼각형의 세 각 중 두 각이 주어졌습니다. 나머지 한 각을 구하세요.', `${a}°, ${b}°`, 180 - a - b, '°');
  }
  let a = randomInt(random, 50, 110);
  let b = randomInt(random, 50, 110);
  let c = randomInt(random, 50, 110);
  while (a + b + c >= 350) { a = randomInt(random, 50, 100); b = randomInt(random, 50, 100); c = randomInt(random, 50, 100); }
  return wordQ('사각형의 네 각 중 세 각이 주어졌습니다. 나머지 한 각을 구하세요.', `${a}°, ${b}°, ${c}°`, 360 - a - b - c, '°');
}

const POINT_LABELS = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ'];

export function lineRaySegmentClassify(random) {
  const kind = pick(random, ['segment', 'ray', 'line']);
  const [labelA, labelB] = POINT_LABELS;
  const answer = kind === 'segment' ? '선분' : kind === 'ray' ? '반직선' : '직선';
  return {
    ...wordQ('그림과 같은 도형의 이름을 선분, 반직선, 직선 중에서 쓰세요.', '', answer, '', 'Name the figure shown: segment, ray, or line.'),
    visualKind: 'point-figure',
    figure: { kind, labelA, labelB },
  };
}

const POINT_CLOUD_LAYOUTS = {
  3: [[40, 110], [170, 110], [105, 25]],
  4: [[30, 115], [175, 115], [150, 30], [55, 35]],
  5: [[100, 20], [180, 70], [150, 135], [50, 135], [20, 70]],
  6: [[100, 15], [175, 55], [175, 120], [100, 155], [25, 120], [25, 55]],
};

export function countFiguresFromPoints(random) {
  const n = randomInt(random, 3, 6);
  const points = POINT_CLOUD_LAYOUTS[n];
  const labels = POINT_LABELS.slice(0, n);
  const kind = pick(random, ['선분', '직선', '반직선']);
  const answer = kind === '반직선' ? n * (n - 1) : (n * (n - 1)) / 2;
  return {
    ...wordQ(`그림과 같이 어느 세 점도 한 직선 위에 있지 않은 ${n}개의 점이 있습니다. 두 점을 이어 그릴 수 있는 ${kind}은(는) 모두 몇 개인가요?`, '', answer, '개', `No three of these ${n} points lie on the same line. How many ${kind === '반직선' ? 'rays' : kind === '직선' ? 'lines' : 'segments'} can be drawn through two of them?`),
    visualKind: 'point-cloud',
    cloud: { points, labels },
  };
}

function withPolygon(question, shape, dims) {
  return { ...question, visualKind: 'polygon-figure', polygon: { shape, ...dims } };
}

export function perimeterArea(random) {
  const shape = pick(random, ['rectangle', 'square', 'parallelogram', 'triangle', 'trapezoid', 'rhombus']);
  const askPerimeter = random() < 0.5;
  if (shape === 'rectangle') {
    const w = randomInt(random, 3, 20);
    const h = randomInt(random, 3, 20);
    if (askPerimeter) return withPolygon(wordQ('그림과 같은 직사각형의 둘레를 구하세요.', '', 2 * (w + h), 'cm', 'Find the perimeter of the rectangle shown.'), 'rectangle', { a: w, b: h });
    return withPolygon(wordQ('그림과 같은 직사각형의 넓이를 구하세요.', '', w * h, 'cm²', 'Find the area of the rectangle shown.'), 'rectangle', { a: w, b: h });
  }
  if (shape === 'square') {
    const a = randomInt(random, 3, 20);
    if (askPerimeter) return withPolygon(wordQ('그림과 같은 정사각형의 둘레를 구하세요.', '', 4 * a, 'cm', 'Find the perimeter of the square shown.'), 'square', { a });
    return withPolygon(wordQ('그림과 같은 정사각형의 넓이를 구하세요.', '', a * a, 'cm²', 'Find the area of the square shown.'), 'square', { a });
  }
  if (shape === 'parallelogram') {
    const base = randomInt(random, 4, 20);
    const height = randomInt(random, 3, 15);
    return withPolygon(wordQ('그림과 같은 평행사변형의 넓이를 구하세요.', '', base * height, 'cm²', 'Find the area of the parallelogram shown.'), 'parallelogram', { a: base, height });
  }
  if (shape === 'triangle') {
    const base = randomInt(random, 4, 20);
    let height = randomInt(random, 3, 15);
    if ((base * height) % 2 !== 0) height += 1;
    return withPolygon(wordQ('그림과 같은 삼각형의 넓이를 구하세요.', '', (base * height) / 2, 'cm²', 'Find the area of the triangle shown.'), 'triangle', { a: base, height });
  }
  if (shape === 'trapezoid') {
    const a = randomInt(random, 4, 15);
    const b = randomInt(random, a + 2, 20);
    let height = randomInt(random, 3, 15);
    if (((a + b) * height) % 2 !== 0) height += 1;
    return withPolygon(wordQ('그림과 같은 사다리꼴의 넓이를 구하세요.', '', ((a + b) * height) / 2, 'cm²', 'Find the area of the trapezoid shown.'), 'trapezoid', { a, b, height });
  }
  let d1 = randomInt(random, 4, 20);
  let d2 = randomInt(random, 4, 20);
  if ((d1 * d2) % 2 !== 0) d2 += 1;
  return withPolygon(wordQ('그림과 같은 마름모의 넓이를 구하세요.', '', (d1 * d2) / 2, 'cm²', 'Find the area of the rhombus shown.'), 'rhombus', { d1, d2 });
}

export function rangeRound(random) {
  const mode = randomInt(random, 0, 2);
  if (mode === 0) {
    const value = randomInt(random, 1, 100);
    const boundary = randomInt(random, 1, 100);
    const type = pick(random, ['이상', '이하', '초과', '미만']);
    let result;
    if (type === '이상') result = value >= boundary;
    else if (type === '이하') result = value <= boundary;
    else if (type === '초과') result = value > boundary;
    else result = value < boundary;
    return wordQ(`${value}는 ${boundary} ${type}인가요? (맞으면 O, 아니면 X)`, '', result ? 'O' : 'X');
  }
  if (mode === 1) {
    const lower = randomInt(random, 5, 50);
    const upper = lower + randomInt(random, 5, 20);
    const lowerType = pick(random, ['이상', '초과']);
    const upperType = pick(random, ['이하', '미만']);
    const askLargest = random() < 0.5;
    const minVal = lowerType === '이상' ? lower : lower + 1;
    const maxVal = upperType === '이하' ? upper : upper - 1;
    return wordQ(`${lower} ${lowerType} ${upper} ${upperType}인 자연수 중 가장 ${askLargest ? '큰' : '작은'} 수를 구하세요.`, '', askLargest ? maxVal : minVal);
  }
  const value = randomInt(random, 100, 9999);
  const place = pick(random, [10, 100, 1000]);
  const method = pick(random, ['올림', '버림', '반올림']);
  let result;
  if (method === '올림') result = Math.ceil(value / place) * place;
  else if (method === '버림') result = Math.floor(value / place) * place;
  else result = Math.round(value / place) * place;
  const placeLabel = place === 10 ? '십' : place === 100 ? '백' : '천';
  return wordQ(`${value}을(를) ${placeLabel}의 자리에서 ${method}하세요.`, '', result);
}

export function averageProbability(random, attempt = 0) {
  if (random() < 0.5) {
    const count = randomInt(random, 3, 5);
    const avg = randomInt(random, 5, 30);
    const values = Array.from({ length: count - 1 }, () => randomInt(random, Math.max(1, avg - 15), avg + 15));
    const last = avg * count - values.reduce((sum, value) => sum + value, 0);
    if ((last < 1 || last > avg + 30) && attempt < 20) return averageProbability(random, attempt + 1);
    const all = [...values, Math.max(1, last)];
    const finalAvg = Math.round(all.reduce((sum, value) => sum + value, 0) / all.length);
    return wordQ('다음 자료의 평균을 구하세요.', all.join(', '), finalAvg);
  }
  const red = randomInt(random, 1, 8);
  const blue = randomInt(random, 1, 8);
  const total = red + blue;
  return wordQ(`주머니에 빨간 구슬 ${red}개, 파란 구슬 ${blue}개가 있습니다. 하나를 꺼낼 때 빨간 구슬일 가능성을 분수로 나타내세요.`, '', fractionAnswer(red, total));
}

const SOLID_LABELS = { cube: '정육면체', box: '직육면체' };

export function solidFigureBasic(random) {
  const isCube = random() < 0.4;
  const label = isCube ? SOLID_LABELS.cube : SOLID_LABELS.box;
  const mode = randomInt(random, 0, 3);
  if (mode === 0) return wordQ(`${label}의 면은 모두 몇 개인가요?`, '', 6, '개');
  if (mode === 1) return wordQ(`${label}의 모서리는 모두 몇 개인가요?`, '', 12, '개');
  if (mode === 2) return wordQ(`${label}의 꼭짓점은 모두 몇 개인가요?`, '', 8, '개');
  if (isCube) {
    const a = randomInt(random, 2, 15);
    return wordQ(`한 모서리가 ${a}cm인 정육면체의 모든 모서리 길이의 합을 구하세요.`, '', 12 * a, 'cm');
  }
  const a = randomInt(random, 2, 15);
  const b = randomInt(random, 2, 15);
  const c = randomInt(random, 2, 15);
  return wordQ(`가로 ${a}cm, 세로 ${b}cm, 높이 ${c}cm인 직육면체의 모든 모서리 길이의 합을 구하세요.`, '', 4 * (a + b + c), 'cm');
}

export function congruenceSymmetry(random) {
  const mode = randomInt(random, 0, 2);
  if (mode === 0) {
    const len = randomInt(random, 3, 20);
    return wordQ(`두 도형이 서로 합동입니다. 한 변의 길이가 ${len}cm일 때 그와 대응하는 변의 길이를 구하세요.`, '', len, 'cm');
  }
  if (mode === 1) {
    const angle = randomInt(random, 20, 150);
    return wordQ(`두 도형이 서로 합동입니다. 한 각의 크기가 ${angle}°일 때 그와 대응하는 각의 크기를 구하세요.`, '', angle, '°');
  }
  const dist = randomInt(random, 2, 15);
  return wordQ(`선대칭도형에서 대칭축으로부터 한 점까지의 거리가 ${dist}cm입니다. 그 점과 대응하는 점까지의 대칭축으로부터의 거리를 구하세요.`, '', dist, 'cm');
}

export function functionTable(random) {
  const k = randomInt(random, 2, 6);
  const b = randomInt(random, 0, 10);
  const xs = [1, 2, 3, 4];
  const targetX = randomInt(random, 5, 9);
  const pairs = xs.map((x) => `x=${x}일 때 y=${k * x + b}`).join(', ');
  return wordQ(`x와 y 사이에 일정한 대응 규칙이 있습니다. ${pairs}입니다. 규칙에 따라 x=${targetX}일 때 y의 값을 구하세요.`, '', k * targetX + b);
}

export function percentageBasic(random) {
  const mode = randomInt(random, 0, 2);
  if (mode === 0) {
    const d = pick(random, [4, 5, 10, 20, 25, 50]);
    const n = randomInt(random, 1, d - 1);
    return wordQ('다음 분수를 백분율로 나타내세요.', `${n}/${d}`, Math.round((n / d) * 100), '%');
  }
  if (mode === 1) {
    const percent = pick(random, [5, 10, 15, 20, 25, 30, 40, 45, 50, 60, 75, 80]);
    return wordQ('다음 백분율을 소수로 나타내세요.', `${percent}%`, decimal(percent / 100, 2));
  }
  const percent = pick(random, [10, 20, 25, 50, 75]);
  return wordQ('다음 백분율을 기약분수로 나타내세요.', `${percent}%`, fractionAnswer(percent, 100));
}

export function percentageWord(random) {
  const mode = randomInt(random, 0, 2);
  if (mode === 0) {
    const total = pick(random, [200, 400, 500, 800, 1000]);
    const percent = pick(random, [10, 20, 25, 30, 40, 50, 60, 75]);
    return wordQ(`전체 ${total}명 중 ${percent}%가 안경을 씁니다. 안경을 쓴 학생은 몇 명인가요?`, '', (total * percent) / 100, '명');
  }
  const price = pick(random, [5000, 8000, 10000, 12000, 15000, 20000, 25000]);
  const percent = pick(random, [10, 15, 20, 25, 30]);
  if (mode === 1) return wordQ(`정가 ${price.toLocaleString('ko-KR')}원인 물건을 ${percent}% 할인하여 판매합니다. 할인 금액은 얼마인가요?`, '', (price * percent) / 100, '원');
  return wordQ(`정가 ${price.toLocaleString('ko-KR')}원인 물건을 ${percent}% 할인하여 판매합니다. 판매 가격은 얼마인가요?`, '', price - (price * percent) / 100, '원');
}

export function circleMeasure(random) {
  const radius = randomInt(random, 2, 20);
  if (random() < 0.5) return wordQ(`반지름이 ${radius}cm인 원의 원주를 구하세요. (원주율: 3.14)`, '', decimal(radius * 2 * 3.14, 2), 'cm');
  return wordQ(`반지름이 ${radius}cm인 원의 넓이를 구하세요. (원주율: 3.14)`, '', decimal(radius * radius * 3.14, 2), 'cm²');
}

const KOREAN_ORDINAL = { 3: '삼', 4: '사', 5: '오', 6: '육', 7: '칠', 8: '팔' };

export function prismPyramidCounts(random) {
  const n = randomInt(random, 3, 8);
  const isPrism = random() < 0.5;
  const property = pick(random, ['면', '모서리', '꼭짓점']);
  let value;
  if (isPrism) value = property === '면' ? n + 2 : property === '모서리' ? 3 * n : 2 * n;
  else value = property === '면' ? n + 1 : property === '모서리' ? 2 * n : n + 1;
  const shapeName = `${KOREAN_ORDINAL[n]}각${isPrism ? '기둥' : '뿔'}`;
  return wordQ(`${shapeName}의 ${property}은(는) 몇 개인가요?`, '', value, '개');
}

export function volumeSurfaceArea(random) {
  const isCube = random() < 0.4;
  const askVolume = random() < 0.5;
  if (isCube) {
    const a = randomInt(random, 2, 15);
    if (askVolume) return wordQ(`한 모서리가 ${a}cm인 정육면체의 부피를 구하세요.`, '', a * a * a, 'cm³');
    return wordQ(`한 모서리가 ${a}cm인 정육면체의 겉넓이를 구하세요.`, '', 6 * a * a, 'cm²');
  }
  const a = randomInt(random, 2, 15);
  const b = randomInt(random, 2, 15);
  const c = randomInt(random, 2, 15);
  if (askVolume) return wordQ(`가로 ${a}cm, 세로 ${b}cm, 높이 ${c}cm인 직육면체의 부피를 구하세요.`, '', a * b * c, 'cm³');
  return wordQ(`가로 ${a}cm, 세로 ${b}cm, 높이 ${c}cm인 직육면체의 겉넓이를 구하세요.`, '', 2 * (a * b + b * c + c * a), 'cm²');
}

const GRAPH_TOPICS = [
  { topic: '좋아하는 과일', categories: ['사과', '바나나', '포도', '기타'] },
  { topic: '좋아하는 운동', categories: ['축구', '야구', '농구', '기타'] },
  { topic: '기르고 싶은 동물', categories: ['강아지', '고양이', '물고기', '기타'] },
];

export function dataGraphWord(random) {
  const { topic, categories } = pick(random, GRAPH_TOPICS);
  let p1 = pick(random, [10, 15, 20, 25, 30]);
  let p2 = pick(random, [10, 15, 20, 25, 30]);
  let p3 = pick(random, [10, 15, 20, 25, 30]);
  let guard = 0;
  while (p1 + p2 + p3 >= 95 && guard < 20) {
    p1 = pick(random, [10, 15, 20]);
    p2 = pick(random, [10, 15, 20]);
    p3 = pick(random, [10, 15, 20]);
    guard += 1;
  }
  const p4 = 100 - p1 - p2 - p3;
  const total = pick(random, [200, 400, 500]);
  const summary = `${categories[0]} ${p1}%, ${categories[1]} ${p2}%, ${categories[2]} ${p3}%, ${categories[3]} ${p4}%`;
  if (random() < 0.5) {
    return wordQ(`어느 반 학생 ${total}명을 대상으로 ${topic}을(를) 조사했더니 ${summary}였습니다. ${categories[0]}을(를) 좋아하는 학생은 몇 명인가요?`, '', (total * p1) / 100, '명');
  }
  return wordQ(`어느 반 학생을 대상으로 ${topic}을(를) 조사했더니 ${categories[0]} ${p1}%, ${categories[1]} ${p2}%, ${categories[2]} ${p3}%였고 나머지는 ${categories[3]}였습니다. ${categories[3]}의 비율은 몇 %인가요?`, '', p4, '%');
}
