function randomInt(random, min, max) {
  return Math.floor(random() * (max - min + 1)) + min;
}

function pick(random, values) {
  return values[randomInt(random, 0, values.length - 1)];
}

function nonZero(random, min = -8, max = 8) {
  let value;
  do value = randomInt(random, min, max); while (value === 0);
  return value;
}

function gcd(a, b) {
  let left = Math.abs(a);
  let right = Math.abs(b);
  while (right) [left, right] = [right, left % right];
  return left || 1;
}

function fraction(numerator, denominator = 1) {
  const divisor = gcd(numerator, denominator);
  const sign = denominator < 0 ? -1 : 1;
  const n = sign * numerator / divisor;
  const d = Math.abs(denominator) / divisor;
  return d === 1 ? String(n) : `${n}/${d}`;
}

function signed(value) {
  return value >= 0 ? `+ ${value}` : `− ${Math.abs(value)}`;
}

function linear(a, b, variable = 'x') {
  const first = a === 1 ? variable : a === -1 ? `−${variable}` : `${a}${variable}`;
  return b === 0 ? first : `${first} ${signed(b)}`;
}

function item(prompt, expression, answer, extra = {}) {
  return { prompt, expression, answer: String(answer), ...extra };
}

function withEnglish(extra, promptEn, explanation, explanationEn) {
  return { ...extra, promptEn, explanation, explanationEn };
}

function repeatingDecimal(random) {
  const digit = randomInt(random, 1, 9);
  const mode = randomInt(random, 0, 1);
  if (mode === 0) return item('순환소수를 기약분수로 나타내세요.', `0.(${digit})`, fraction(digit, 9), withEnglish({}, 'Write the repeating decimal as a fraction in simplest form.', `x=0.(${digit})라 하면 10x−x=${digit}이므로 x=${digit}/9=${fraction(digit, 9)}입니다.`, `Let x=0.(${digit}). Then 10x−x=${digit}, so x=${fraction(digit, 9)}.`));
  const whole = randomInt(random, 1, 4);
  return item('순환소수를 기약분수로 나타내세요.', `${whole}.(${digit})`, fraction(whole * 9 + digit, 9), withEnglish({}, 'Write the repeating decimal as a fraction in simplest form.', `${whole}.(${digit})=${whole}+${digit}/9=${fraction(whole * 9 + digit, 9)}입니다.`, `${whole}.(${digit})=${whole}+${digit}/9=${fraction(whole * 9 + digit, 9)}.`));
}

function exponentLaws(random) {
  const a = randomInt(random, 2, 7);
  const b = randomInt(random, 2, 6);
  const mode = randomInt(random, 0, 2);
  if (mode === 0) return item('지수법칙을 이용하여 간단히 하세요.', `x^${a} × x^${b}`, `x^${a + b}`, withEnglish({}, 'Simplify using exponent laws.', `밑이 같으므로 지수를 더해 x^${a + b}입니다.`, `Add exponents with the same base: x^${a + b}.`));
  if (mode === 1) return item('지수법칙을 이용하여 간단히 하세요.', `x^${a + b} ÷ x^${a}`, `x^${b}`, withEnglish({}, 'Simplify using exponent laws.', `나눗셈에서는 지수를 빼므로 x^${b}입니다.`, `Subtract exponents when dividing: x^${b}.`));
  return item('지수법칙을 이용하여 간단히 하세요.', `(x^${a})^${b}`, `x^${a * b}`, withEnglish({}, 'Simplify using exponent laws.', `거듭제곱의 거듭제곱에서는 지수를 곱해 x^${a * b}입니다.`, `Multiply the exponents: x^${a * b}.`));
}

function polynomialOperations(random) {
  const a = nonZero(random, -6, 6);
  const b = nonZero(random, -8, 8);
  const c = nonZero(random, -6, 6);
  const d = nonZero(random, -8, 8);
  const mode = randomInt(random, 0, 1);
  if (mode === 0) return item('두 다항식을 더하여 간단히 하세요.', `(${linear(a, b)}) + (${linear(c, d)})`, linear(a + c, b + d).replaceAll(' ', ''), withEnglish({}, 'Add and simplify the polynomials.', `동류항을 더하면 ${a + c}x${signed(b + d)}입니다.`, `Combine like terms to get ${linear(a + c, b + d)}.`));
  const p = randomInt(random, 2, 5);
  const q = randomInt(random, 1, 6);
  return item('단항식과 다항식을 곱하여 전개하세요.', `${p}x(x ${signed(q)})`, `${p}x^2+${p * q}x`, withEnglish({}, 'Expand the product.', `분배법칙을 적용하면 ${p}x²+${p * q}x입니다.`, `Distribute ${p}x to obtain ${p}x²+${p * q}x.`));
}

const REVERSE_SYMBOL = { '<': '>', '≤': '≥', '>': '<', '≥': '≤' };

function choicesOf(choicesKo, choicesEn = choicesKo) {
  return { choices: choicesKo.map((label, index) => ({ label, labelEn: choicesEn[index] })) };
}

// 04-5/04-6: 기본형 ax+b ▢ c 부등식 풀이 (양수/음수로 나누어 부호가 바뀌는 경우 모두 포함)
function inequalitySolveBasic(random) {
  const root = randomInt(random, -6, 10);
  const a = randomInt(random, 2, 6);
  const b = randomInt(random, -9, 9);
  const symbol = pick(random, ['<', '≤', '>', '≥']);
  if (random() < 0.7) return item('일차부등식을 푸세요.', `${a}x ${signed(b)} ${symbol} ${a * root + b}`, `x${symbol}${root}`, withEnglish({}, 'Solve the linear inequality.', `양변에서 ${b}를 정리하고 양수 ${a}로 나누면 x${symbol}${root}입니다.`, `Isolate the x-term and divide by positive ${a}: x${symbol}${root}.`));
  return item('일차부등식을 푸세요.', `${-a}x ${signed(b)} ${symbol} ${-a * root + b}`, `x${REVERSE_SYMBOL[symbol]}${root}`, withEnglish({}, 'Solve the linear inequality.', `음수 ${-a}로 나누므로 부등호 방향을 바꾸어 x${REVERSE_SYMBOL[symbol]}${root}입니다.`, `Divide by negative ${-a} and reverse the inequality: x${REVERSE_SYMBOL[symbol]}${root}.`));
}

// 04-6: 괄호를 포함한 복잡한 일차부등식 (분배법칙 후 정리)
function inequalitySolveParentheses(random) {
  const p = randomInt(random, 2, 5);
  let q;
  do { q = randomInt(random, 1, 5); } while (q === p);
  const h = randomInt(random, -4, 4);
  const root = randomInt(random, -6, 8);
  const coeff = p - q;
  const r = root * coeff - p * h;
  const symbol = pick(random, ['<', '≤', '>', '≥']);
  const finalSymbol = coeff > 0 ? symbol : REVERSE_SYMBOL[symbol];
  return item('괄호를 풀어 일차부등식을 푸세요.', `${p}(${linear(1, -h)}) ${symbol} ${linear(q, r)}`, `x${finalSymbol}${root}`, withEnglish({}, 'Expand the parentheses and solve the inequality.', `괄호를 풀면 ${linear(p, -p * h)} ${symbol} ${linear(q, r)}이고, 정리하면 ${coeff < 0 ? '음수로 나누어 부등호 방향을 바꾸어 ' : ''}x${finalSymbol}${root}입니다.`, `Expanding gives ${linear(p, -p * h)} ${symbol} ${linear(q, r)}; simplifying yields x${finalSymbol}${root}.`));
}

// 04-6: 소수 계수를 포함한 일차부등식
function inequalitySolveDecimal(random) {
  const round1 = (value) => Math.round(value * 10) / 10;
  const fmt = (value) => (Number.isInteger(value) ? String(value) : value.toFixed(1));
  const root = randomInt(random, -8, 10);
  const a = round1(pick(random, [2, 3, 4, 5, 6, 7, 8, 9]) / 10);
  const b = round1(randomInt(random, -20, 20) / 10);
  const symbol = pick(random, ['<', '≤', '>', '≥']);
  const rhs = round1(a * root + b);
  return item('소수를 포함한 일차부등식을 푸세요.', `${fmt(a)}x ${signed(b)} ${symbol} ${fmt(rhs)}`, `x${symbol}${root}`, withEnglish({}, 'Solve the linear inequality with decimal coefficients.', `양변에서 ${fmt(b)}를 정리하고 양수 ${fmt(a)}로 나누면 x${symbol}${root}입니다.`, `Isolate the x-term and divide by the positive coefficient ${fmt(a)}: x${symbol}${root}.`));
}

// 04-2: 특정 x 값이 부등식의 해인지 판단하기
function inequalityCheckValue(random) {
  const a = randomInt(random, 2, 6);
  const b = randomInt(random, -8, 8);
  const c = randomInt(random, -10, 15);
  const testX = randomInt(random, -5, 8);
  const symbol = pick(random, ['<', '≤', '>', '≥']);
  const lhs = a * testX + b;
  const holds = symbol === '<' ? lhs < c : symbol === '≤' ? lhs <= c : symbol === '>' ? lhs > c : lhs >= c;
  return item(`x=${testX}가 다음 부등식의 해인지 판단하세요.`, `${linear(a, b)} ${symbol} ${c}`, holds ? '1' : '2', {
    ...choicesOf(['해이다', '해가 아니다'], ['It is a solution', 'It is not a solution']),
    ...withEnglish({}, `Decide whether x=${testX} is a solution of the inequality.`, `x=${testX}를 대입하면 ${lhs}${symbol}${c}는 ${holds ? '참' : '거짓'}이므로 해가 ${holds ? '됩니다' : '되지 않습니다'}.`, `Substituting x=${testX} gives ${lhs}${symbol}${c}, which is ${holds ? 'true' : 'false'}.`),
  });
}

// 04-3: 부등식의 성질 - 양변에 연산을 적용했을 때 부호 방향
function inequalityProperty(random) {
  const relation = pick(random, ['<', '>']);
  const k = nonZero(random, -9, 9);
  const ops = [
    { ko: `양변에 ${k}를 더하면`, en: `Add ${k} to both sides:`, expr: `a${signed(k)} □ b${signed(k)}`, flips: false },
    { ko: `양변에서 ${Math.abs(k)}를 빼면`, en: `Subtract ${Math.abs(k)} from both sides:`, expr: `a${signed(-Math.abs(k))} □ b${signed(-Math.abs(k))}`, flips: false },
    { ko: `양변에 ${k}를 곱하면`, en: `Multiply both sides by ${k}:`, expr: `${k}a □ ${k}b`, flips: k < 0 },
    { ko: `양변을 ${k}로 나누면`, en: `Divide both sides by ${k}:`, expr: `a÷${k} □ b÷${k}`, flips: k < 0 },
  ];
  const chosen = pick(random, ops);
  const resultSymbol = chosen.flips ? REVERSE_SYMBOL[relation] : relation;
  return item(`a ${relation} b일 때, ${chosen.ko} 다음 중 □ 안에 알맞은 부등호는?`, chosen.expr, resultSymbol === '<' ? '1' : '2', {
    ...choicesOf(['<', '>']),
    ...withEnglish({}, `Given a ${relation} b, ${chosen.en} choose the correct inequality symbol for □.`, `${chosen.flips ? '음수를 곱하거나 나누면 부등호 방향이 바뀌므로' : '더하거나 빼는 것은 부등호 방향에 영향을 주지 않으므로'} ${resultSymbol}입니다.`, `${chosen.flips ? 'Multiplying or dividing by a negative number reverses the inequality, so' : 'Adding or subtracting does not change the direction, so'} the symbol is ${resultSymbol}.`),
  });
}

// 05-1: 개수 제한형 활용 문제 (예산 안에서 최대 몇 개까지 살 수 있는지)
function inequalityWordBudget(random) {
  const price = pick(random, [300, 700, 800, 900, 1200, 1500]);
  const fee = pick(random, [500, 1000, 1500, 2000]);
  const maxCount = randomInt(random, 5, 15);
  const budget = price * maxCount + fee;
  return item(`한 개에 ${price}원인 물건을 ${fee}원짜리 상자에 담아서 ${budget}원 이하의 금액으로 사려고 한다. 물건의 개수를 x라 할 때, 최대 몇 개까지 살 수 있는지 구하세요.`, `${price}x + ${fee} ≤ ${budget}`, maxCount, { ...withEnglish({}, 'Set up and solve the inequality to find the maximum number of items.', `부등식을 세우면 ${price}x+${fee}≤${budget}이고, 풀면 x≤${maxCount}이므로 최대 ${maxCount}개까지 살 수 있습니다.`, `The inequality ${price}x+${fee}≤${budget} gives x≤${maxCount}, so at most ${maxCount} items.`), answerSuffix: '개' });
}

// 05-2: 연속하는 두 자연수의 합에 대한 활용 문제
function inequalityWordConsecutive(random) {
  const smallest = randomInt(random, 10, 40);
  const sum = 2 * smallest + 1;
  const threshold = sum - 1;
  return item(`연속하는 두 자연수의 합이 ${threshold}보다 크다고 한다. 이를 만족하는 가장 작은 두 자연수 중 작은 수를 구하세요.`, `x + (x+1) > ${threshold}`, smallest, withEnglish({}, 'Set up and solve the inequality, then give the smaller of the two smallest natural numbers.', `부등식을 세우면 2x+1>${threshold}이고, 풀면 x>${smallest - 1}이므로 가장 작은 자연수는 ${smallest}입니다.`, `The inequality 2x+1>${threshold} gives x>${smallest - 1}, so the smallest natural number is ${smallest}.`));
}

// 05-2: 두 지불 방식의 손익분기점 (몇 개 이상일 때 유리한지)
function inequalityWordBreakeven(random) {
  const priceLocal = pick(random, [1300, 1400, 1500, 1600, 1800]);
  const priceMarket = priceLocal + randomInt(random, 100, 300);
  const diff = priceMarket - priceLocal;
  const x0 = randomInt(random, 3, 10);
  const fee = diff * x0;
  const answer = x0 + 1;
  return item(`집 근처 상점에서 한 개에 ${priceMarket}원인 물건이 도매 시장에서는 ${priceLocal}원이고, 도매 시장에 다녀오는 데 교통비 ${fee}원이 든다고 한다. 물건을 몇 개 이상 살 경우 도매 시장에 가는 것이 유리한지 구하세요.`, `${priceMarket}x > ${priceLocal}x + ${fee}`, answer, { ...withEnglish({}, 'Set up and solve the inequality to find the break-even quantity.', `부등식을 세우면 ${priceMarket}x>${priceLocal}x+${fee}이고, 풀면 x>${x0}이므로 ${answer}개 이상일 때 유리합니다.`, `The inequality ${priceMarket}x>${priceLocal}x+${fee} gives x>${x0}, so buying ${answer} or more is cheaper via the market.`), answerSuffix: '개' });
}

const INEQUALITY_GENERATORS = [inequalitySolveBasic, inequalitySolveBasic, inequalitySolveParentheses, inequalitySolveDecimal, inequalityCheckValue, inequalityProperty, inequalityWordBudget, inequalityWordConsecutive, inequalityWordBreakeven];

function linearInequality(random) {
  return pick(random, INEQUALITY_GENERATORS)(random);
}

// 06-1/06-2: 두 식을 모두 만족하는 순서쌍 (x, y)가 연립방정식의 해인지 판단하기
function systemsCheckSolution(random) {
  const testX = randomInt(random, -5, 6);
  const testY = randomInt(random, -5, 6);
  let a; let b; let c; let d;
  do {
    a = nonZero(random, -4, 4); b = nonZero(random, -4, 4);
    c = nonZero(random, -4, 4); d = nonZero(random, -4, 4);
  } while (a * d === b * c);
  const e = a * testX + b * testY;
  const isSolution = random() < 0.5;
  const f = isSolution ? c * testX + d * testY : c * testX + d * testY + nonZero(random, 1, 4);
  return item(`(x, y)=(${testX}, ${testY})가 다음 연립방정식의 해인지 판단하세요.`, `${linear(a, 0)} ${signed(b)}y = ${e},  ${linear(c, 0)} ${signed(d)}y = ${f}`, isSolution ? '1' : '2', {
    ...choicesOf(['해이다', '해가 아니다'], ['It is a solution', 'It is not a solution']),
    ...withEnglish({}, `Decide whether (x, y)=(${testX}, ${testY}) is a solution of the system.`, `두 식에 대입하면 첫 식은 성립${isSolution ? '하고 둘째 식도 성립하므로 해입니다' : '하지만 둘째 식은 성립하지 않으므로 해가 아닙니다'}.`, `Substituting satisfies the first equation, and the second equation is ${isSolution ? 'also satisfied, so it is a solution' : 'not satisfied, so it is not a solution'}.`),
  });
}

// 06-3: 대입법 - 한 식이 y=... 형태로 이미 정리된 연립방정식
function systemsLinearSubstitution(random) {
  const x = randomInt(random, -6, 8);
  const y = randomInt(random, -6, 8);
  const m = nonZero(random, -4, 4);
  const k = y - m * x;
  let c; let d;
  do { c = nonZero(random, -4, 4); d = nonZero(random, -4, 4); } while (c + d * m === 0);
  const f = c * x + d * y;
  return item('대입법을 이용하여 연립방정식을 풀고 해 (x, y)를 구하세요.', `y = ${linear(m, k)},  ${linear(c, 0)} ${signed(d)}y = ${f}`, `(${x},${y})`, withEnglish({}, 'Substitute the first equation into the second, then solve for (x, y).', `y=${linear(m, k)}를 둘째 식에 대입하여 풀면 x=${x}, y=${y}이므로 해는 (${x}, ${y})입니다.`, `Substituting y=${linear(m, k)} into the second equation gives x=${x}, y=${y}.`));
}

// 06-5: 괄호를 포함한 복잡한 연립방정식
function systemsLinearParentheses(random) {
  const x = randomInt(random, -5, 7);
  const y = randomInt(random, -5, 7);
  const a = pick(random, [2, 3, 4, -2, -3, -4]);
  const h = randomInt(random, -3, 3);
  const b = nonZero(random, -4, 4);
  const rhs1 = a * (x - h) + b * y;
  let c; let d;
  do { c = nonZero(random, -4, 4); d = nonZero(random, -4, 4); } while (a * d === b * c);
  const rhs2 = c * x + d * y;
  return item('괄호를 풀어 연립방정식을 풀고 해 (x, y)를 구하세요.', `${a}(${linear(1, -h)}) ${signed(b)}y = ${rhs1},  ${linear(c, 0)} ${signed(d)}y = ${rhs2}`, `(${x},${y})`, withEnglish({}, 'Expand the parentheses, solve the system, and give (x, y).', `괄호를 풀면 ${linear(a, -a * h)} ${signed(b)}y = ${rhs1}이 되고, 두 식을 연립하여 풀면 x=${x}, y=${y}입니다.`, `Expanding gives ${linear(a, -a * h)} ${signed(b)}y=${rhs1}; solving the system yields x=${x}, y=${y}.`));
}

// 06-6: 해가 없거나 무수히 많은 특수한 연립방정식 판별하기
function systemsSpecialCase(random) {
  const a = nonZero(random, -4, 4);
  const b = nonZero(random, -4, 4);
  const k = pick(random, [2, 3, -2, -3]);
  const c = a * k; const d = b * k;
  const e = randomInt(random, -9, 9);
  const infinite = random() < 0.5;
  const f = infinite ? e * k : e * k + nonZero(random, 1, 6);
  return item('다음 연립방정식의 해의 개수를 고르세요.', `${linear(a, 0)} ${signed(b)}y = ${e},  ${linear(c, 0)} ${signed(d)}y = ${f}`, infinite ? '2' : '1', {
    ...choicesOf(['해가 없다', '해가 무수히 많다'], ['No solution', 'Infinitely many solutions']),
    ...withEnglish({}, 'Determine how many solutions this system has.', infinite ? `두 식의 계수와 상수항의 비가 모두 같으므로(${k}배) 해가 무수히 많습니다.` : `계수의 비는 같지만 상수항의 비가 달라 해가 없습니다.`, infinite ? `All coefficient and constant ratios match (×${k}), so there are infinitely many solutions.` : `The coefficient ratios match but the constants don't, so there is no solution.`),
  });
}

const SYSTEMS_GENERATORS = [systemsLinearBasic, systemsLinearBasic, systemsCheckSolution, systemsLinearSubstitution, systemsLinearParentheses, systemsSpecialCase];

function systemsLinearBasic(random) {
  const x = randomInt(random, -5, 7);
  const y = randomInt(random, -5, 7);
  let a; let b; let c; let d;
  do {
    a = nonZero(random, -4, 4); b = nonZero(random, -4, 4);
    c = nonZero(random, -4, 4); d = nonZero(random, -4, 4);
  } while (a * d === b * c);
  const e = a * x + b * y;
  const f = c * x + d * y;
  return item('연립일차방정식의 해 (x, y)를 구하세요.', `${linear(a, 0)} ${signed(b)}y = ${e},  ${linear(c, 0)} ${signed(d)}y = ${f}`, `(${x},${y})`, withEnglish({ kind: 'system-graph', lines: [{ a, b, c: e }, { a: c, b: d, c: f }], point: { x, y } }, 'Solve the system and give (x, y).', `가감법으로 한 문자를 소거하면 x=${x}, y=${y}이므로 해는 (${x}, ${y})입니다.`, `Elimination gives x=${x} and y=${y}, so the solution is (${x}, ${y}).`));
}

function systemsLinear(random) {
  return pick(random, SYSTEMS_GENERATORS)(random);
}

function signedTerm(coeff, variable) {
  const abs = Math.abs(coeff);
  const term = abs === 1 ? variable : `${abs}${variable}`;
  return coeff < 0 ? `− ${term}` : `+ ${term}`;
}

// 08-5 (첫 번째 유형): 두 점을 지나는 직선의 기울기 / 일차함수의 y절편
function linearFunctionsSlopeIntercept(random) {
  const slope = nonZero(random, -4, 4);
  const intercept = randomInt(random, -6, 6);
  const x1 = randomInt(random, -3, 2);
  const x2 = x1 + randomInt(random, 1, 4);
  const y1 = slope * x1 + intercept;
  const y2 = slope * x2 + intercept;
  const mode = randomInt(random, 0, 1);
  if (mode === 0) return item(`두 점 (${x1}, ${y1}), (${x2}, ${y2})를 지나는 직선의 기울기를 구하세요.`, '', slope, withEnglish({ kind: 'algebra-graph', graph: { type: 'linear', slope, intercept, points: [{ x: x1, y: y1 }, { x: x2, y: y2 }] } }, `Find the slope of the line through (${x1}, ${y1}) and (${x2}, ${y2}).`, `기울기는 (${y2}−${y1})/(${x2}−${x1})=${slope}입니다.`, `The slope is (${y2}−${y1})/(${x2}−${x1})=${slope}.`));
  return item('일차함수의 y절편을 구하세요.', `y = ${linear(slope, intercept)}`, intercept, withEnglish({ kind: 'algebra-graph', graph: { type: 'linear', slope, intercept, points: [] } }, 'Find the y-intercept of the linear function.', `x=0일 때 y=${intercept}이므로 y절편은 ${intercept}입니다.`, `At x=0, y=${intercept}, so the y-intercept is ${intercept}.`));
}

// 08-1: 함숫값 구하기 (일차함수 및 반비례 f(x)=k/x)
function functionValue(random) {
  const x0 = nonZero(random, -6, 6);
  if (random() < 0.6) {
    const a = nonZero(random, -6, 6);
    const b = randomInt(random, -8, 8);
    const value = a * x0 + b;
    return item(`함수 f(x)=${linear(a, b)}에 대하여 f(${x0})의 값을 구하세요.`, '', value, withEnglish({}, 'Find the function value f(x0).', `f(${x0})=${linear(a, b)}에 x=${x0}을 대입하면 ${value}입니다.`, `Substitute x=${x0} into f(x)=${linear(a, b)} to get ${value}.`));
  }
  const multiplier = nonZero(random, -8, 8);
  const k = x0 * multiplier;
  return item(`함수 f(x)=${k}/x에 대하여 f(${x0})의 값을 구하세요.`, '', multiplier, withEnglish({}, 'Find the function value for the inverse-variation function.', `f(${x0})=${k}/${x0}=${multiplier}입니다.`, `f(${x0})=${k}/${x0}=${multiplier}.`));
}

// 08-2: 일차함수인지 판별하기
const LINEAR_FUNCTION_CANDIDATES = [
  { expr: 'y=3x−1', isLinear: true },
  { expr: 'y=−2x+x^2', isLinear: false },
  { expr: 'y=4', isLinear: false },
  { expr: 'xy=10', isLinear: false },
  { expr: 'y=(1/2)(x−3)', isLinear: true },
  { expr: 'x+3y=6', isLinear: true },
  { expr: 'y=1/x', isLinear: false },
  { expr: 'y=−x+5', isLinear: true },
];
function functionIdentifyLinear(random) {
  const chosen = pick(random, LINEAR_FUNCTION_CANDIDATES);
  return item('다음 중 y가 x에 대한 일차함수이면 "예", 아니면 "아니오"를 고르세요.', chosen.expr, chosen.isLinear ? '1' : '2', {
    ...choicesOf(['예', '아니오'], ['Yes', 'No']),
    ...withEnglish({}, 'Decide whether y is a linear function of x.', `${chosen.expr}는 x에 대한 일차식${chosen.isLinear ? '이므로 일차함수입니다' : '이 아니므로 일차함수가 아닙니다'}.`, `${chosen.expr} is ${chosen.isLinear ? '' : 'not '}a first-degree expression in x.`),
  });
}

// 08-4: 일차함수 그래프의 x절편, y절편
function functionIntercepts(random) {
  const a = nonZero(random, -6, 6);
  const b = nonZero(random, -8, 8);
  if (random() < 0.5) return item(`일차함수 y=${linear(a, b)}의 그래프의 y절편을 구하세요.`, '', b, withEnglish({}, 'Find the y-intercept.', `x=0일 때 y=${b}이므로 y절편은 ${b}입니다.`, `At x=0, y=${b}, so the y-intercept is ${b}.`));
  return item(`일차함수 y=${linear(a, b)}의 그래프의 x절편을 구하세요.`, '', fraction(-b, a), withEnglish({}, 'Find the x-intercept.', `y=0을 대입하면 x=${fraction(-b, a)}이므로 x절편은 ${fraction(-b, a)}입니다.`, `Setting y=0 gives x=${fraction(-b, a)}, the x-intercept.`));
}

// 08-5 (두 번째 유형): x의 증가량에 대한 y의 증가량 (변화율)
function functionRateOfChange(random) {
  const a = nonZero(random, -6, 6);
  const b = randomInt(random, -6, 6);
  const dx = randomInt(random, 2, 6);
  const dy = a * dx;
  return item(`일차함수 y=${linear(a, b)}에서 x의 값이 ${dx}만큼 증가할 때, y의 값의 증가량을 구하세요.`, '', dy, withEnglish({}, 'Find the change in y when x increases by the given amount.', `기울기가 ${a}이므로 x가 ${dx}만큼 증가하면 y는 ${a}×${dx}=${dy}만큼 증가합니다.`, `The slope is ${a}, so y changes by ${a}×${dx}=${dy}.`));
}

// 08-6: 일차함수 그래프의 증가·감소 판별
function functionSlopeSign(random) {
  const a = nonZero(random, -6, 6);
  const b = randomInt(random, -6, 6);
  return item(`일차함수 y=${linear(a, b)}에 대한 설명으로 옳은 것을 고르세요.`, '', a > 0 ? '1' : '2', {
    ...choicesOf(['x의 값이 증가하면 y의 값도 증가한다', 'x의 값이 증가하면 y의 값은 감소한다'], ['As x increases, y also increases', 'As x increases, y decreases']),
    ...withEnglish({}, 'Decide whether the function is increasing or decreasing.', `기울기가 ${a > 0 ? '양수' : '음수'}이므로 x가 증가하면 y는 ${a > 0 ? '증가합니다' : '감소합니다'}.`, `The slope is ${a > 0 ? 'positive' : 'negative'}, so y ${a > 0 ? 'increases' : 'decreases'} as x increases.`),
  });
}

// 08-7: 일차함수 그래프의 평행·일치 조건
function functionParallelCoincident(random) {
  const slope = nonZero(random, -6, 6);
  const knownIntercept = randomInt(random, -8, 8);
  if (random() < 0.5) {
    return item(`두 일차함수 y=${slope}x+a, y=${linear(slope, knownIntercept)}의 그래프가 서로 일치하도록 하는 상수 a의 값을 구하세요.`, '', knownIntercept, withEnglish({}, 'Find a so the two graphs coincide.', `기울기가 이미 같으므로 일치하려면 y절편도 같아야 합니다. 따라서 a=${knownIntercept}입니다.`, `The slopes already match, so the y-intercepts must match too: a=${knownIntercept}.`));
  }
  let otherIntercept;
  do { otherIntercept = randomInt(random, -8, 8); } while (otherIntercept === knownIntercept);
  return item(`두 일차함수 y=ax${signed(otherIntercept)}, y=${linear(slope, knownIntercept)}의 그래프가 서로 평행하도록 하는 상수 a의 값을 구하세요.`, '', slope, withEnglish({}, 'Find a so the two graphs are parallel.', `두 그래프가 평행하려면 기울기가 같아야 하므로 a=${slope}입니다.`, `Parallel lines have equal slopes, so a=${slope}.`));
}

// 08-8: 일차함수의 활용 (일정한 비율로 줄어드는 양)
function functionWordProblem(random) {
  const capacity = pick(random, [30, 40, 50, 60, 80]);
  const rate = pick(random, [5, 8, 10, 12, 15, 20]);
  const usedUnits = randomInt(random, 1, Math.floor(capacity / rate) - 1 || 1);
  const x = rate * usedUnits;
  const remaining = capacity - usedUnits;
  return item(`1 km를 달리는 데 1/${rate} L의 휘발유가 소모되는 자동차가 있다. 이 자동차에 휘발유 ${capacity} L를 채우고 출발하여 x km를 달렸을 때 남은 휘발유의 양을 y L라 하자. x=${x}일 때 y의 값을 구하세요.`, `y = ${capacity} − x/${rate}`, remaining, withEnglish({}, 'Set up the linear function and evaluate it at the given x.', `y=${capacity}−x/${rate}에 x=${x}를 대입하면 y=${remaining}입니다.`, `Substituting x=${x} into y=${capacity}−x/${rate} gives y=${remaining}.`), { answerSuffix: 'L' });
}

function linearFunctions(random) {
  return pick(random, LINEAR_FUNCTION_GENERATORS)(random);
}

// 09-1: 일차방정식 ax+by+c=0의 그래프의 기울기·x절편·y절편
function lineStandardForm(random) {
  const a = nonZero(random, -5, 5);
  const b = nonZero(random, -5, 5);
  const c = randomInt(random, -10, 10);
  const expression = `${linear(a, 0)} ${signedTerm(b, 'y')} ${signed(c)} = 0`;
  const ask = pick(random, ['slope', 'x-intercept', 'y-intercept']);
  if (ask === 'slope') return item('다음 일차방정식의 그래프의 기울기를 구하세요.', expression, fraction(-a, b), withEnglish({}, 'Find the slope of the graph of the linear equation.', `y=${fraction(-a, b)}x+(${fraction(-c, b)}) 꼴로 정리하면 기울기는 ${fraction(-a, b)}입니다.`, `Solving for y gives slope ${fraction(-a, b)}.`));
  if (ask === 'x-intercept') return item('다음 일차방정식의 그래프의 x절편을 구하세요.', expression, fraction(-c, a), withEnglish({}, 'Find the x-intercept of the graph.', `y=0을 대입하면 x=${fraction(-c, a)}이므로 x절편은 ${fraction(-c, a)}입니다.`, `Setting y=0 gives x=${fraction(-c, a)}.`));
  return item('다음 일차방정식의 그래프의 y절편을 구하세요.', expression, fraction(-c, b), withEnglish({}, 'Find the y-intercept of the graph.', `x=0을 대입하면 y=${fraction(-c, b)}이므로 y절편은 ${fraction(-c, b)}입니다.`, `Setting x=0 gives y=${fraction(-c, b)}.`));
}

// 09-2: 좌표축에 평행한 직선의 방정식 (x=p, y=q)
function verticalHorizontalLine(random) {
  const x0 = randomInt(random, -6, 6);
  const y0 = randomInt(random, -6, 6);
  if (random() < 0.5) return item(`점 (${x0}, ${y0})을 지나고 y축에 평행한 직선의 방정식을 구하세요.`, '', `x=${x0}`, withEnglish({}, 'Find the equation of the line through the point, parallel to the y-axis.', `y축에 평행한 직선은 x=(상수) 꼴이므로 x=${x0}입니다.`, `A line parallel to the y-axis has the form x=constant: x=${x0}.`));
  return item(`점 (${x0}, ${y0})을 지나고 x축에 평행한 직선의 방정식을 구하세요.`, '', `y=${y0}`, withEnglish({}, 'Find the equation of the line through the point, parallel to the x-axis.', `x축에 평행한 직선은 y=(상수) 꼴이므로 y=${y0}입니다.`, `A line parallel to the x-axis has the form y=constant: y=${y0}.`));
}

// 09-3: 기울기를 알 때 직선의 방정식 y=ax+b에서 a+b의 값 구하기 (열린 형태 답 대신 계산값으로 확인)
function lineEquationSlopeForm(random) {
  const slope = nonZero(random, -6, 6);
  const mode = pick(random, ['intercept', 'point', 'rate']);
  if (mode === 'intercept') {
    const b = randomInt(random, -8, 8);
    return item(`기울기가 ${slope}이고 y절편이 ${b}인 직선의 방정식을 y=ax+b 꼴로 나타낼 때, a+b의 값을 구하세요.`, '', slope + b, withEnglish({}, 'Write the line as y=ax+b and find a+b.', `a=${slope}, b=${b}이므로 a+b=${slope + b}입니다.`, `Here a=${slope} and b=${b}, so a+b=${slope + b}.`));
  }
  if (mode === 'point') {
    const x0 = randomInt(random, -6, 6);
    const y0 = randomInt(random, -6, 6);
    const b = y0 - slope * x0;
    return item(`기울기가 ${slope}이고 점 (${x0}, ${y0})을 지나는 직선의 방정식을 y=ax+b 꼴로 나타낼 때, a+b의 값을 구하세요.`, '', slope + b, withEnglish({}, 'Write the line as y=ax+b and find a+b.', `y=${slope}x+b에 (${x0}, ${y0})을 대입하면 b=${b}이므로 a+b=${slope + b}입니다.`, `Substituting the point into y=${slope}x+b gives b=${b}, so a+b=${slope + b}.`));
  }
  const dx = randomInt(random, 2, 5);
  const dy = slope * dx;
  const b = randomInt(random, -8, 8);
  return item(`x의 값이 ${dx}만큼 증가할 때 y의 값이 ${dy}만큼 증가하고, y절편이 ${b}인 직선의 방정식을 y=ax+b 꼴로 나타낼 때, a+b의 값을 구하세요.`, '', slope + b, withEnglish({}, 'Write the line as y=ax+b and find a+b.', `기울기는 ${dy}/${dx}=${slope}이고 b=${b}이므로 a+b=${slope + b}입니다.`, `The slope is ${dy}/${dx}=${slope}, and b=${b}, so a+b=${slope + b}.`));
}

// 09-4: 두 점 또는 x절편·y절편으로 직선의 방정식 구하기
function lineEquationTwoPoints(random) {
  if (random() < 0.5) {
    const x1 = randomInt(random, -6, 4);
    const x2 = x1 + randomInt(random, 1, 6);
    const slope = nonZero(random, -5, 5);
    const y1 = randomInt(random, -8, 8);
    const y2 = y1 + slope * (x2 - x1);
    const b = y1 - slope * x1;
    return item(`두 점 (${x1}, ${y1}), (${x2}, ${y2})를 지나는 직선의 방정식을 y=ax+b 꼴로 나타낼 때, a+b의 값을 구하세요.`, '', slope + b, withEnglish({}, 'Find the line through the two points as y=ax+b and give a+b.', `기울기는 (${y2}−${y1})/(${x2}−${x1})=${slope}이고 b=${b}이므로 a+b=${slope + b}입니다.`, `The slope is ${slope} and the y-intercept is ${b}, so a+b=${slope + b}.`));
  }
  const xIntercept = nonZero(random, -8, 8);
  const slope = nonZero(random, -4, 4);
  const yIntercept = xIntercept * slope * -1;
  return item(`x절편이 ${xIntercept}, y절편이 ${yIntercept}인 직선의 방정식을 y=ax+b 꼴로 나타낼 때, a+b의 값을 구하세요.`, '', slope + yIntercept, withEnglish({}, 'Find the line through the intercepts as y=ax+b and give a+b.', `기울기는 −(y절편/x절편)=${slope}이고 b=${yIntercept}이므로 a+b=${slope + yIntercept}입니다.`, `The slope is −(y-intercept/x-intercept)=${slope} and b=${yIntercept}, so a+b=${slope + yIntercept}.`));
}

const LINEAR_FUNCTION_GENERATORS = [linearFunctionsSlopeIntercept, linearFunctionsSlopeIntercept, functionValue, functionIdentifyLinear, functionIntercepts, functionRateOfChange, functionSlopeSign, functionParallelCoincident, functionWordProblem, lineStandardForm, verticalHorizontalLine, lineEquationSlopeForm, lineEquationTwoPoints];

// 09-1: 사건과 경우의 수 (한 개의 주사위)
function countingDiceEvent(random) {
  const events = [
    { desc: '3 미만의 눈', descEn: 'a value less than 3', test: (n) => n < 3 },
    { desc: '3의 배수의 눈', descEn: 'a multiple of 3', test: (n) => n % 3 === 0 },
    { desc: '6의 약수의 눈', descEn: 'a divisor of 6', test: (n) => 6 % n === 0 },
    { desc: '4 이상의 눈', descEn: 'a value of at least 4', test: (n) => n >= 4 },
    { desc: '소수의 눈', descEn: 'a prime value', test: (n) => [2, 3, 5].includes(n) },
  ];
  const chosen = pick(random, events);
  const favorable = [1, 2, 3, 4, 5, 6].filter(chosen.test);
  return item(`한 개의 주사위를 던질 때, ${chosen.desc}이 나오는 경우의 수를 구하세요.`, '', favorable.length, withEnglish({}, `Roll one die. Find the number of ways to get ${chosen.descEn}.`, `${chosen.desc}은 {${favorable.join(', ')}}이므로 경우의 수는 ${favorable.length}입니다.`, `The outcomes are {${favorable.join(', ')}}, so there are ${favorable.length} ways.`));
}

// 09-2: 사건 A 또는 사건 B가 일어나는 경우의 수 (배타적 사건의 덧셈 법칙)
// 겹치는 배수가 생기지 않도록(중2 수준에서는 포함배제를 다루지 않으므로) 검증된 조합만 사용한다.
const OR_RULE_CASES = [{ total: 10, a: 3, b: 5 }, { total: 10, a: 2, b: 9 }, { total: 20, a: 4, b: 7 }, { total: 20, a: 3, b: 8 }, { total: 25, a: 5, b: 6 }];
function countingOrRule(random) {
  const { total, a, b } = pick(random, OR_RULE_CASES);
  const countA = Math.floor(total / a); const countB = Math.floor(total / b);
  const answer = countA + countB;
  return item(`1부터 ${total}까지의 자연수가 각각 적힌 카드 중 한 장을 뽑을 때, ${a}의 배수 또는 ${b}의 배수가 적힌 카드가 나오는 경우의 수를 구하세요.`, '', answer, withEnglish({}, `Draw one card numbered 1 to ${total}. Find the number of ways to draw a multiple of ${a} or a multiple of ${b}.`, `${a}의 배수는 ${countA}개, ${b}의 배수는 ${countB}개이고 두 사건은 동시에 일어나지 않으므로 경우의 수는 ${countA}+${countB}=${answer}입니다.`, `There are ${countA} multiples of ${a} and ${countB} multiples of ${b}; since the events are mutually exclusive, the count is ${countA}+${countB}=${answer}.`));
}

// 09-3: 두 사건이 동시에 일어나는 경우의 수 (곱의 법칙)
function countingAndRule(random) {
  const routeA = randomInt(random, 2, 5);
  const routeB = randomInt(random, 2, 4);
  return item(`민서네 집에서 이모 댁까지 가는 버스 노선이 ${routeA}가지, 지하철 노선이 ${routeB}가지 있다. 갈 때는 버스를, 올 때는 지하철을 이용하는 방법의 수를 구하세요.`, '', routeA * routeB, withEnglish({}, `There are ${routeA} bus routes and ${routeB} subway routes between two places. Find the number of ways to go by bus and return by subway.`, `버스를 고르는 방법 ${routeA}가지와 지하철을 고르는 방법 ${routeB}가지를 곱하면 ${routeA}×${routeB}=${routeA * routeB}입니다.`, `Multiply the choices: ${routeA}×${routeB}=${routeA * routeB}.`));
}

// 09-4: 한 줄로 세우는 경우의 수 (전체 나열) — 순열 기호 없이 직접 곱으로 설명한다.
function arrangeInRow(random) {
  const n = randomInt(random, 3, 5);
  const terms = []; let answer = 1;
  for (let i = n; i >= 1; i -= 1) { terms.push(i); answer *= i; }
  return item(`서로 다른 ${n}명을 한 줄로 세우는 경우의 수를 구하세요.`, '', answer, withEnglish({}, `Find the number of ways to arrange ${n} distinct people in a row.`, `첫 번째 자리부터 차례로 자리를 채우면 ${terms.join('×')}=${answer}입니다.`, `Fill each position in turn: ${terms.join('×')}=${answer}.`));
}

// 09-4: 한 줄로 세우는 경우의 수 (일부만 뽑아 세우기) — 역시 기호 없이 직접 곱으로 설명한다.
function arrangeSubsetInRow(random) {
  const n = randomInt(random, 4, 7);
  const r = pick(random, [2, 3]);
  const terms = []; let answer = 1;
  for (let i = 0; i < r; i += 1) { const term = n - i; terms.push(term); answer *= term; }
  return item(`서로 다른 ${n}명 중에서 ${r}명을 뽑아 한 줄로 세우는 경우의 수를 구하세요.`, '', answer, withEnglish({}, `Choose ${r} people from ${n} distinct people and arrange them in a row. Find the number of ways.`, `앞에서부터 차례로 자리를 채우면 ${terms.join('×')}=${answer}입니다.`, `Fill the positions one at a time: ${terms.join('×')}=${answer}.`));
}

// 09-6: 서로 다른 직책(대표)을 각각 뽑는 경우의 수 (순서를 구분)
function chooseDistinctRoles(random) {
  const n = randomInt(random, 4, 7);
  const roles = pick(random, [['반장', '부반장'], ['회장', '부회장'], ['반장', '부반장', '총무']]);
  const terms = []; let answer = 1;
  for (let i = 0; i < roles.length; i += 1) { const term = n - i; terms.push(term); answer *= term; }
  return item(`학생 ${n}명 중에서 ${roles.join(', ')}을(를) 각각 1명씩 뽑는 경우의 수를 구하세요.`, '', answer, withEnglish({}, `Choose ${roles.join(', ')} (one each, distinct roles) from ${n} students. Find the number of ways.`, `서로 다른 직책이므로 순서를 구분하여 ${terms.join('×')}=${answer}입니다.`, `Since the roles are distinct, multiply: ${terms.join('×')}=${answer}.`));
}

// 09-6: 대표를 뽑는 경우의 수 (순서 없음) — 순서를 구분한 경우의 수를 중복되는 나열 방법의 수로 나눈다.
function chooseRepresentativesUnordered(random) {
  const n = randomInt(random, 4, 9);
  const r = pick(random, [2, 3]);
  let ordered = 1;
  for (let i = 0; i < r; i += 1) ordered *= (n - i);
  const factorial = r === 2 ? 2 : 6;
  const answer = ordered / factorial;
  return item(`서로 다른 ${n}명 중에서 대표 ${r}명을 뽑는 경우의 수를 구하세요. (단, 대표 사이에는 순서가 없다)`, '', answer, withEnglish({}, `Choose ${r} representatives (unordered) from ${n} distinct people. Find the number of ways.`, `순서를 구분하여 뽑으면 ${ordered}가지이고, 뽑힌 ${r}명을 나열하는 방법의 수 ${factorial}가지만큼 중복되므로 ${ordered}÷${factorial}=${answer}입니다.`, `Ordering them gives ${ordered} ways; each unordered group is counted ${factorial} times (the arrangements of the ${r} chosen people), so divide by ${factorial} to get ${answer}.`));
}

// 09-5: 숫자 카드로 자연수 만들기 (0 없음)
function formNumberNoZero(random) {
  const digitCount = pick(random, [4, 5]);
  const pickCount = pick(random, [2, 3]);
  const terms = []; let answer = 1;
  for (let i = 0; i < pickCount; i += 1) { const term = digitCount - i; terms.push(term); answer *= term; }
  const digitWord = { 2: '두', 3: '세' }[pickCount];
  return item(`1부터 ${digitCount}까지의 숫자가 각각 적힌 ${digitCount}장의 카드가 있다. 이 중 ${pickCount}장을 뽑아 만들 수 있는 ${digitWord} 자리 자연수의 개수를 구하세요.`, '', answer, withEnglish({}, `There are cards numbered 1 to ${digitCount}. Find how many ${pickCount}-digit numbers can be formed by choosing ${pickCount} cards.`, `맨 앞자리부터 차례로 ${terms.join('×')}=${answer}입니다.`, `Fill each digit position in turn: ${terms.join('×')}=${answer}.`));
}

// 09-5: 숫자 카드로 자연수 만들기 (0 포함, 맨 앞자리에 0 불가)
function formNumberWithZero(random) {
  const maxDigit = pick(random, [4, 5]);
  const digitCount = maxDigit + 1;
  const pickCount = pick(random, [2, 3, 4]);
  const terms = [digitCount - 1];
  let pool = digitCount - 1;
  let answer = digitCount - 1;
  for (let i = 1; i < pickCount; i += 1) { answer *= pool; terms.push(pool); pool -= 1; }
  const digitWord = { 2: '두', 3: '세', 4: '네' }[pickCount];
  return item(`0부터 ${maxDigit}까지의 숫자가 각각 적힌 ${digitCount}장의 카드가 있다. 이 중 ${pickCount}장을 뽑아 만들 수 있는 ${digitWord} 자리 자연수의 개수를 구하세요.`, '', answer, withEnglish({}, `There are cards numbered 0 to ${maxDigit}. Find how many ${pickCount}-digit numbers can be formed by choosing ${pickCount} of them (no leading zero).`, `맨 앞자리는 0이 될 수 없으므로 ${digitCount - 1}가지이고, 그 다음 자리부터는 이미 사용한 카드를 제외한 나머지를 순서대로 선택하므로 ${terms.join('×')}=${answer}입니다.`, `The leading digit excludes 0 (${digitCount - 1} choices); each following digit is chosen from what's left: ${terms.join('×')}=${answer}.`));
}

// 10-1: 확률의 뜻
function probabilitySingleDraw(random) {
  const red = randomInt(random, 2, 8);
  const blue = randomInt(random, 2, 8);
  return item(`주머니에 빨간 공 ${red}개와 파란 공 ${blue}개가 있습니다. 한 개를 꺼낼 때 빨간 공일 확률을 구하세요.`, '', fraction(red, red + blue), withEnglish({ kind: 'probability-bar', counts: [{ label: 'R', value: red }, { label: 'B', value: blue }] }, `A bag has ${red} red and ${blue} blue balls. Find P(red).`, `전체 ${red + blue}개 중 빨간 공이 ${red}개이므로 확률은 ${fraction(red, red + blue)}입니다.`, `There are ${red} favorable outcomes out of ${red + blue}, so the probability is ${fraction(red, red + blue)}.`));
}

// 10-3: 어떤 사건이 일어나지 않을 확률 (여사건)
function probabilityComplement(random) {
  const total = randomInt(random, 8, 12);
  const favorable = randomInt(random, 2, total - 2);
  const p = fraction(favorable, total);
  const complement = fraction(total - favorable, total);
  return item(`어떤 사건 A가 일어날 확률이 ${p}일 때, 사건 A가 일어나지 않을 확률을 구하세요.`, '', complement, withEnglish({}, `If the probability that event A occurs is ${p}, find the probability that A does not occur.`, `여사건의 확률은 1에서 원래 확률을 빼면 되므로 1−${p}=${complement}입니다.`, `The complement's probability is 1 minus the original: 1−${p}=${complement}.`));
}

// 10-4: 사건 A 또는 사건 B가 일어날 확률 (배타적 사건의 덧셈 법칙)
function probabilityAddition(random) {
  const countA = randomInt(random, 2, 6); const countB = randomInt(random, 2, 6); const countC = randomInt(random, 2, 6);
  const total = countA + countB + countC;
  const pA = fraction(countA, total); const pC = fraction(countC, total);
  const answer = fraction(countA + countC, total);
  return item(`주머니 속에 빨간 공 ${countA}개, 파란 공 ${countB}개, 노란 공 ${countC}개가 들어 있다. 한 개의 공을 꺼낼 때, 빨간 공 또는 노란 공이 나올 확률을 구하세요.`, '', answer, withEnglish({}, `A bag has ${countA} red, ${countB} blue, and ${countC} yellow balls. Find the probability of drawing a red or yellow ball.`, `빨간 공 또는 노란 공이 나오는 사건은 동시에 일어나지 않으므로 두 확률을 더하면 ${pA}+${pC}=${answer}입니다.`, `The two events cannot happen together, so add the probabilities: ${pA}+${pC}=${answer}.`));
}

// 10-2: 확률의 성질 (O/X)
const PROBABILITY_PROPERTY_STATEMENTS = [
  { ko: '확률 P는 항상 0≤P≤1을 만족한다.', en: 'A probability P always satisfies 0≤P≤1.', valid: true },
  { ko: '반드시 일어나는 사건의 확률은 1이다.', en: 'The probability of a certain event is 1.', valid: true },
  { ko: '절대로 일어나지 않는 사건의 확률은 0이다.', en: 'The probability of an impossible event is 0.', valid: true },
  { ko: '사건 A가 일어날 확률과 일어나지 않을 확률의 합은 1이다.', en: "The probability of A plus the probability of not-A equals 1.", valid: true },
  { ko: '확률은 1보다 클 수도 있다.', en: 'A probability can be greater than 1.', valid: false },
  { ko: '확률이 0이면 그 사건은 반드시 일어난다.', en: 'If the probability is 0, the event is certain to occur.', valid: false },
];
function probabilityProperties(random) {
  const chosen = pick(random, PROBABILITY_PROPERTY_STATEMENTS);
  return item(`다음 설명이 옳은지 판단하세요.\n"${chosen.ko}"`, '', chosen.valid ? '1' : '2', {
    ...choicesOf(['옳다', '옳지 않다'], ['True', 'False']),
    promptEn: `Decide whether the following is true.\n"${chosen.en}"`,
    explanation: chosen.valid ? '확률의 기본 성질에 부합하는 옳은 설명입니다.' : '확률의 기본 성질에 어긋나는 설명입니다.',
    explanationEn: chosen.valid ? 'This matches a basic property of probability.' : 'This contradicts a basic property of probability.',
  });
}

// 10-5: 두 사건이 동시에 일어날 확률 (독립사건의 곱셈 법칙)
function probabilityIndependentEvents(random) {
  const diceFavorable = pick(random, [
    { desc: '소수의 눈', descEn: 'a prime value', count: 3 },
    { desc: '3의 배수의 눈', descEn: 'a multiple of 3', count: 2 },
    { desc: '4 이하의 눈', descEn: 'a value of at most 4', count: 4 },
  ]);
  const pCoin = fraction(1, 2);
  const pDice = fraction(diceFavorable.count, 6);
  const answer = fraction(diceFavorable.count, 12);
  return item(`한 개의 동전과 한 개의 주사위를 동시에 던질 때, 동전은 앞면이 나오고 주사위는 ${diceFavorable.desc}이 나올 확률을 구하세요.`, '', answer, withEnglish({}, `Toss one coin and one die together. Find the probability that the coin shows heads and the die shows ${diceFavorable.descEn}.`, `두 사건은 독립이므로 확률을 곱하면 ${pCoin}×${pDice}=${answer}입니다.`, `The events are independent, so multiply: ${pCoin}×${pDice}=${answer}.`));
}

// 10-6: 연속하여 뽑는 경우의 확률 (복원 vs 비복원)
function probabilitySequentialDraws(random) {
  const white = randomInt(random, 2, 6);
  const black = randomInt(random, 2, 6);
  const total = white + black;
  const withReplacement = random() < 0.5;
  const askWhite = random() < 0.5;
  const count = askWhite ? white : black;
  const colorKo = askWhite ? '흰' : '검은';
  const colorEn = askWhite ? 'white' : 'black';
  if (withReplacement) {
    const p1 = fraction(count, total);
    const answer = fraction(count * count, total * total);
    return item(`주머니 속에 흰 공 ${white}개, 검은 공 ${black}개가 들어 있다. 한 개의 공을 꺼내 확인하고 다시 넣은 후 한 개의 공을 또 꺼낼 때, 두 개 모두 ${colorKo} 공일 확률을 구하세요.`, '', answer, withEnglish({}, `A bag has ${white} white and ${black} black balls. Draw one, replace it, then draw again. Find the probability both are ${colorEn}.`, `꺼낸 공을 다시 넣으므로 두 번의 확률이 같아 ${p1}×${p1}=${answer}입니다.`, `Since the ball is replaced, both draws have the same probability: ${p1}×${p1}=${answer}.`));
  }
  const p1 = fraction(count, total);
  const p2 = fraction(count - 1, total - 1);
  const answer = fraction(count * (count - 1), total * (total - 1));
  return item(`주머니 속에 흰 공 ${white}개, 검은 공 ${black}개가 들어 있다. 한 개의 공을 꺼내 확인하고 다시 넣지 않은 후 한 개의 공을 또 꺼낼 때, 두 개 모두 ${colorKo} 공일 확률을 구하세요.`, '', answer, withEnglish({}, `A bag has ${white} white and ${black} black balls. Draw one without replacement, then draw again. Find the probability both are ${colorEn}.`, `공을 다시 넣지 않으므로 두 번째 확률이 달라져 ${p1}×${p2}=${answer}입니다.`, `Since the ball is not replaced, the second probability changes: ${p1}×${p2}=${answer}.`));
}

// 10-7: 도형에서의 확률 (넓이 또는 각의 비)
function probabilityGeometric(random) {
  const mode = pick(random, ['grid', 'spinner']);
  if (mode === 'grid') {
    const totalCells = 9;
    const shaded = randomInt(random, 2, 6);
    const answer = fraction(shaded, totalCells);
    return item(`크기가 모두 같은 정사각형 ${totalCells}개로 이루어진 과녁에 화살을 한 번 쏠 때, 색칠된 ${shaded}칸을 맞힐 확률을 구하세요. (단, 화살이 과녁을 벗어나거나 경계선을 맞히는 경우는 없다)`, '', answer, withEnglish({}, `A target is divided into ${totalCells} equal squares. Find the probability of hitting one of the ${shaded} shaded squares.`, `전체 넓이에 대한 색칠된 부분의 넓이의 비가 확률이므로 ${shaded}/${totalCells}=${answer}입니다.`, `The probability equals the ratio of the shaded area to the total area: ${shaded}/${totalCells}=${answer}.`));
  }
  const sections = pick(random, [8, 10, 12]);
  const favorable = randomInt(random, 2, Math.floor(sections / 2));
  const answer = fraction(favorable, sections);
  return item(`크기가 같은 ${sections}등분된 원판에 화살을 한 번 쏠 때, 특정 부분(${favorable}칸)을 맞힐 확률을 구하세요. (단, 화살이 원판을 벗어나거나 경계선을 맞히는 경우는 없다)`, '', answer, withEnglish({}, `A spinner is divided into ${sections} equal sections. Find the probability of landing on one of ${favorable} marked sections.`, `전체 중 특정 부분이 차지하는 비율이 확률이므로 ${favorable}/${sections}=${answer}입니다.`, `The probability equals the fraction of sections marked: ${favorable}/${sections}=${answer}.`));
}

const PROBABILITY_COUNTING_GENERATORS = [
  countingDiceEvent, countingOrRule, countingAndRule,
  arrangeInRow, arrangeSubsetInRow, chooseDistinctRoles, chooseRepresentativesUnordered,
  formNumberNoZero, formNumberWithZero,
  probabilitySingleDraw, probabilityComplement, probabilityAddition, probabilityProperties,
  probabilityIndependentEvents, probabilitySequentialDraws, probabilityGeometric,
];
function probability(random) {
  return pick(random, PROBABILITY_COUNTING_GENERATORS)(random);
}

function radicals(random) {
  const outside = randomInt(random, 2, 9);
  const inside = pick(random, [2, 3, 5, 6, 7]);
  const mode = randomInt(random, 0, 1);
  if (mode === 0) return item('제곱근을 간단히 하세요.', `√${outside * outside * inside}`, `${outside}√${inside}`, withEnglish({}, 'Simplify the radical.', `${outside * outside * inside}=${outside}²×${inside}이므로 √${outside * outside * inside}=${outside}√${inside}입니다.`, `Factor out ${outside}² to get ${outside}√${inside}.`));
  const multiplier = randomInt(random, 2, 6);
  return item('동류근끼리 계산하세요.', `${multiplier}√${inside} + ${outside}√${inside}`, `${multiplier + outside}√${inside}`, withEnglish({}, 'Combine like radicals.', `√${inside}의 계수를 더하면 ${multiplier + outside}√${inside}입니다.`, `Add the coefficients to get ${multiplier + outside}√${inside}.`));
}

function identitiesFactoring(random) {
  const p = randomInt(random, 1, 8);
  const q = randomInt(random, 1, 8);
  const mode = randomInt(random, 0, 1);
  if (mode === 0) return item('다항식을 인수분해하세요.', `x^2 + ${p + q}x + ${p * q}`, `(x+${p})(x+${q})`, withEnglish({}, 'Factor the polynomial.', `합이 ${p + q}, 곱이 ${p * q}인 두 수는 ${p}, ${q}이므로 (x+${p})(x+${q})입니다.`, `The two numbers with sum ${p + q} and product ${p * q} are ${p} and ${q}.`));
  return item('곱셈공식을 이용하여 전개하세요.', `(x + ${p})^2`, `x^2+${2 * p}x+${p * p}`, withEnglish({}, 'Expand using an algebraic identity.', `(a+b)²=a²+2ab+b²을 적용하면 x²+${2 * p}x+${p * p}입니다.`, `Use (a+b)²=a²+2ab+b².`));
}

function quadraticEquations(random) {
  let r1 = randomInt(random, -8, 5);
  let r2 = randomInt(random, -5, 8);
  if (r1 > r2) [r1, r2] = [r2, r1];
  const b = -(r1 + r2);
  const c = r1 * r2;
  return item('이차방정식의 두 근을 작은 것부터 쓰세요.', `x^2 ${signed(b)}x ${signed(c)} = 0`, `${r1},${r2}`, withEnglish({}, 'Solve the quadratic equation and list the roots in increasing order.', `(x−(${r1}))(x−(${r2}))=0으로 인수분해되므로 두 근은 ${r1}, ${r2}입니다.`, `Factoring gives roots ${r1} and ${r2}.`));
}

function quadraticFunctions(random) {
  const a = pick(random, [-2, -1, 1, 2]);
  const h = randomInt(random, -4, 4);
  const k = randomInt(random, -5, 5);
  const expression = `y=${a === 1 ? '' : a === -1 ? '−' : a}(x${h >= 0 ? '−' : '+'}${Math.abs(h)})^2${k === 0 ? '' : signed(k).replace(' ', '')}`;
  return item('이차함수 그래프의 꼭짓점 좌표를 구하세요.', expression, `(${h},${k})`, withEnglish({ kind: 'algebra-graph', graph: { type: 'quadratic', a, h, k, points: [{ x: h, y: k }] } }, 'Find the vertex of the quadratic graph.', `y=a(x−p)²+q의 꼭짓점은 (p,q)이므로 (${h},${k})입니다.`, `In y=a(x−p)²+q, the vertex is (p,q), so it is (${h},${k}).`));
}

function quadraticMaxMin(random) {
  const a = pick(random, [-2, -1, 1, 2]);
  const h = randomInt(random, -3, 3);
  const k = randomInt(random, -4, 4);
  const spanLeft = randomInt(random, 1, 4);
  const spanRight = randomInt(random, 1, 4);
  const p = h - spanLeft;
  const q = h + spanRight;
  const farX = spanLeft >= spanRight ? p : q;
  const f = (x) => a * (x - h) * (x - h) + k;
  const vertexIsMax = a < 0;
  const askMax = random() < 0.5;
  const answerIsVertex = askMax === vertexIsMax;
  const atX = answerIsVertex ? h : farX;
  const answer = f(atX);
  const expression = `y=${a === 1 ? '' : a === -1 ? '−' : a}(x${h >= 0 ? '−' : '+'}${Math.abs(h)})^2${k === 0 ? '' : signed(k).replace(' ', '')} (${p}≤x≤${q})`;
  const label = askMax ? '최댓값' : '최솟값';
  const labelEn = askMax ? 'maximum value' : 'minimum value';
  const explanation = answerIsVertex
    ? `이차항의 계수가 ${a > 0 ? '양수' : '음수'}이므로 꼭짓점 x=${h}에서 ${label} ${answer}을 갖습니다.`
    : `꼭짓점은 반대쪽 극값을 주므로 꼭짓점에서 더 먼 끝점 x=${atX}에서 ${label} ${answer}을 갖습니다.`;
  const explanationEn = answerIsVertex
    ? `Since a is ${a > 0 ? 'positive' : 'negative'}, the vertex x=${h} gives the ${labelEn} ${answer}.`
    : `The vertex gives the opposite extreme, so the endpoint farther from the vertex, x=${atX}, gives the ${labelEn} ${answer}.`;
  return item(`주어진 구간에서 이차함수의 ${label}을 구하세요.`, expression, answer, withEnglish({ kind: 'algebra-graph', graph: { type: 'quadratic', a, h, k, points: [{ x: atX, y: answer }] } }, `Find the ${labelEn} of the quadratic function on the given interval.`, explanation, explanationEn));
}

function dataVariation(random) {
  const base = Array.from({ length: 5 }, () => randomInt(random, 2, 14)).sort((a, b) => a - b);
  const shift = randomInt(random, 2, 7);
  const mean = base.reduce((sum, value) => sum + value, 0) / base.length;
  if (!Number.isInteger(mean)) return dataVariation(random);
  return item(`자료 ${base.join(', ')}의 모든 값에 ${shift}를 더했을 때 새 평균을 구하세요.`, '', mean + shift, withEnglish({ kind: 'data-bars', data: base }, `Add ${shift} to every value in ${base.join(', ')}. Find the new mean.`, `원래 평균 ${mean}에 ${shift}를 더하면 새 평균은 ${mean + shift}입니다.`, `Adding ${shift} to every value increases the mean from ${mean} to ${mean + shift}.`));
}

function remainderFactorTheorem(random) {
  const a = nonZero(random, -4, 4);
  const b = nonZero(random, -5, 5);
  const c = nonZero(random, -8, 8);
  const root = randomInt(random, -3, 4);
  const value = a * root * root + b * root + c;
  return item(`P(x)=${a}x^2 ${signed(b)}x ${signed(c)}를 x−(${root})로 나눈 나머지를 구하세요.`, '', value, withEnglish({}, `Find the remainder when P(x)=${a}x²${signed(b)}x${signed(c)} is divided by x−(${root}).`, `나머지정리에 의해 나머지는 P(${root})=${value}입니다.`, `By the Remainder Theorem, the remainder is P(${root})=${value}.`));
}

function complexNumbers(random) {
  const a = nonZero(random, -6, 6);
  const b = nonZero(random, -6, 6);
  const c = nonZero(random, -6, 6);
  const d = nonZero(random, -6, 6);
  if (random() < 0.5) return item('복소수를 계산하세요.', `(${a}${signed(b)}i)+(${c}${signed(d)}i)`, `${a + c}${b + d >= 0 ? '+' : ''}${b + d}i`, withEnglish({}, 'Add the complex numbers.', `실수부와 허수부를 각각 더하면 ${a + c}${b + d >= 0 ? '+' : ''}${b + d}i입니다.`, `Add real and imaginary parts separately.`));
  const real = a * c - b * d;
  const imag = a * d + b * c;
  return item('복소수를 계산하세요.', `(${a}${signed(b)}i)(${c}${signed(d)}i)`, `${real}${imag >= 0 ? '+' : ''}${imag}i`, withEnglish({}, 'Multiply the complex numbers.', `i²=−1을 이용해 전개하면 ${real}${imag >= 0 ? '+' : ''}${imag}i입니다.`, `Expand and use i²=−1.`));
}

function quadraticInequalities(random) {
  let left = randomInt(random, -6, 1);
  let right = randomInt(random, 2, 8);
  if (left >= right) [left, right] = [right - 2, right];
  const choicesKo = [`x<${left} 또는 x>${right}`, `${left}<x<${right}`, `x>${left}`, `x<${right}`];
  const choicesEn = [`x<${left} or x>${right}`, `${left}<x<${right}`, `x>${left}`, `x<${right}`];
  const outside = random() < 0.5;
  return item('이차부등식의 해를 고르세요.', `(x−(${left}))(x−${right}) ${outside ? '>' : '<'} 0`, outside ? 1 : 2, withEnglish({ kind: 'choice', choicesKo, choicesEn }, 'Choose the solution set of the quadratic inequality.', `경계는 ${left}, ${right}이고 이차항의 계수가 양수이므로 ${outside ? choicesKo[0] : choicesKo[1]}입니다.`, `The boundary points are ${left} and ${right}; use the sign of the upward-opening quadratic.`));
}

function permutationsCombinations(random) {
  const n = randomInt(random, 5, 9);
  const r = pick(random, [2, 3]);
  if (random() < 0.5) {
    let answer = 1;
    for (let index = 0; index < r; index += 1) answer *= n - index;
    return item(`서로 다른 ${n}명 중 회장, 부회장 등 서로 다른 ${r}개의 직책을 정하는 경우의 수를 구하세요.`, `${n}P${r}`, answer, withEnglish({}, `Assign ${r} distinct offices to ${n} people. How many ways?`, `순서를 고려하므로 ${n}P${r}=${answer}입니다.`, `Order matters, so use ${n}P${r}=${answer}.`));
  }
  const numerator = Array.from({ length: r }, (_, index) => n - index).reduce((a, b) => a * b, 1);
  const denominator = Array.from({ length: r }, (_, index) => index + 1).reduce((a, b) => a * b, 1);
  return item(`서로 다른 ${n}명 중 대표 ${r}명을 뽑는 경우의 수를 구하세요.`, `${n}C${r}`, numerator / denominator, withEnglish({}, `Choose ${r} representatives from ${n} people. How many ways?`, `순서를 고려하지 않으므로 ${n}C${r}=${numerator / denominator}입니다.`, `Order does not matter, so use ${n}C${r}=${numerator / denominator}.`));
}

function circularPermutations(random) {
  const n = randomInt(random, 4, 8);
  let answer = 1;
  for (let index = 2; index <= n - 1; index += 1) answer *= index;
  return item(`서로 다른 ${n}명이 원탁에 둘러앉는 경우의 수를 구하세요.`, '', answer, withEnglish({}, `${n} distinct people sit around a round table. How many arrangements are there?`, `원순열의 수는 (n−1)!이므로 (${n}−1)!=${answer}입니다.`, `The number of circular permutations is (n−1)!=(${n}−1)!=${answer}.`));
}

function matrices(random) {
  const left = Array.from({ length: 4 }, () => randomInt(random, -5, 7));
  const right = Array.from({ length: 4 }, () => randomInt(random, -5, 7));
  const answer = left.map((value, index) => value + right[index]);
  return item('두 행렬의 합을 [a,b;c,d] 형식으로 쓰세요.', `[${left[0]},${left[1]};${left[2]},${left[3]}] + [${right[0]},${right[1]};${right[2]},${right[3]}]`, `[${answer[0]},${answer[1]};${answer[2]},${answer[3]}]`, withEnglish({ kind: 'matrix-operation', matrices: [left, right], operator: '+' }, 'Add the matrices. Write the answer as [a,b;c,d].', '같은 위치의 성분끼리 더합니다.', 'Add corresponding entries.'));
}

function setsAndLogic(random) {
  const total = randomInt(random, 28, 50);
  const a = randomInt(random, 12, total - 8);
  const b = randomInt(random, 10, total - 6);
  const intersectionMin = Math.max(2, a + b - total);
  const intersection = randomInt(random, intersectionMin, Math.min(a, b) - 1);
  return item(`전체 ${total}명 중 집합 A의 원소가 ${a}명, B의 원소가 ${b}명, A∩B가 ${intersection}명입니다. A∪B의 원소 수를 구하세요.`, '', a + b - intersection, withEnglish({ kind: 'venn', total, a, b, intersection }, 'Find |A∪B| from the given set counts.', `|A∪B|=|A|+|B|−|A∩B|=${a}+${b}−${intersection}=${a + b - intersection}입니다.`, `Use inclusion-exclusion to obtain ${a + b - intersection}.`));
}

function functionComposition(random) {
  const a = nonZero(random, -4, 4);
  const b = randomInt(random, -6, 6);
  const c = nonZero(random, -4, 4);
  const d = randomInt(random, -6, 6);
  const x = randomInt(random, -3, 5);
  const answer = a * (c * x + d) + b;
  return item(`f(x)=${linear(a, b)}, g(x)=${linear(c, d)}일 때 (f∘g)(${x})를 구하세요.`, '', answer, withEnglish({}, `Given f(x)=${linear(a, b)} and g(x)=${linear(c, d)}, find (f∘g)(${x}).`, `g(${x})=${c * x + d}이고 f(${c * x + d})=${answer}입니다.`, `First g(${x})=${c * x + d}, then f(${c * x + d})=${answer}.`));
}

function rationalRadicalFunctions(random) {
  const excluded = randomInt(random, -7, 7);
  const choicesKo = [`x≠${excluded}`, `x>${excluded}`, `x≥${excluded}`, '모든 실수'];
  const choicesEn = [`x≠${excluded}`, `x>${excluded}`, `x≥${excluded}`, 'all real numbers'];
  if (random() < 0.5) return item('유리함수의 정의역을 고르세요.', `y=1/(x−(${excluded}))`, 1, withEnglish({ kind: 'choice', choicesKo, choicesEn }, 'Choose the domain of the rational function.', `분모가 0이 될 수 없으므로 x≠${excluded}입니다.`, `The denominator cannot be zero, so x≠${excluded}.`));
  const start = randomInt(random, -6, 6);
  const radicalChoicesKo = [`x≥${start}`, `x>${start}`, `x≤${start}`, '모든 실수'];
  return item('무리함수의 정의역을 고르세요.', `y=√(x−(${start}))`, 1, withEnglish({ kind: 'choice', choicesKo: radicalChoicesKo, choicesEn: radicalChoicesKo }, 'Choose the domain of the radical function.', `근호 안이 0 이상이어야 하므로 x≥${start}입니다.`, `The radicand must be nonnegative, so x≥${start}.`));
}

function exponentialEquations(random) {
  const base = pick(random, [2, 3, 5]);
  const root = randomInt(random, -2, 6);
  const shift = randomInt(random, -4, 4);
  return item('지수방정식을 푸세요.', `${base}^(x${shift >= 0 ? '+' : '−'}${Math.abs(shift)}) = ${base}^${root + shift}`, root, withEnglish({ kind: 'algebra-graph', graph: { type: 'exponential', base, points: [{ x: 0, y: 1 }] } }, 'Solve the exponential equation.', `밑이 같으므로 지수를 비교하면 x${signed(shift).replace('+ ', '+').replace('− ', '−')}=${root + shift}, 따라서 x=${root}입니다.`, `Equal bases give equal exponents, so x=${root}.`));
}

function logarithms(random) {
  const base = pick(random, [2, 3, 5]);
  const exponent = randomInt(random, 1, 5);
  return item('로그의 값을 구하세요.', `log_${base} ${base ** exponent}`, exponent, withEnglish({}, 'Evaluate the logarithm.', `${base}^${exponent}=${base ** exponent}이므로 log_${base} ${base ** exponent}=${exponent}입니다.`, `Because ${base}^${exponent}=${base ** exponent}, the logarithm equals ${exponent}.`));
}

function sequences(random) {
  const first = randomInt(random, -5, 10);
  const difference = nonZero(random, -5, 7);
  const n = randomInt(random, 5, 12);
  const nth = first + (n - 1) * difference;
  if (random() < 0.5) return item(`첫째항이 ${first}, 공차가 ${difference}인 등차수열의 제${n}항을 구하세요.`, '', nth, withEnglish({ kind: 'sequence-table', values: Array.from({ length: 5 }, (_, index) => first + index * difference) }, `Find term ${n} of the arithmetic sequence with first term ${first} and common difference ${difference}.`, `a_${n}=${first}+(${n}−1)×${difference}=${nth}입니다.`, `a_${n}=${first}+(${n}−1)×${difference}=${nth}.`));
  const sum = n * (first + nth) / 2;
  return item(`첫째항이 ${first}, 공차가 ${difference}인 등차수열의 첫 ${n}개 항의 합을 구하세요.`, '', sum, withEnglish({ kind: 'sequence-table', values: Array.from({ length: 5 }, (_, index) => first + index * difference) }, `Find the sum of the first ${n} terms of the arithmetic sequence.`, `S_${n}=${n}(${first}+${nth})/2=${sum}입니다.`, `S_${n}=${n}(${first}+${nth})/2=${sum}.`));
}

function algebraModeling(random) {
  const price = randomInt(random, 8, 20);
  const cost = randomInt(random, 2, price - 2);
  const fixed = randomInt(random, 3, 12) * 10;
  const target = randomInt(random, 2, 10) * (price - cost);
  const units = (target + fixed) / (price - cost);
  if (!Number.isInteger(units)) return algebraModeling(random);
  return item(`한 제품의 판매가는 ${price}천 원, 변동비는 ${cost}천 원이고 고정비는 ${fixed}천 원입니다. 이익이 ${target}천 원이 되려면 몇 개를 팔아야 합니까?`, `(${price}−${cost})x−${fixed}=${target}`, units, withEnglish({}, `Price is ${price}, variable cost ${cost}, fixed cost ${fixed}. How many units give profit ${target}?`, `(${price}−${cost})x−${fixed}=${target}을 풀면 x=${units}입니다.`, `Solve (${price}−${cost})x−${fixed}=${target} to get x=${units}.`));
}

const P = {
  M2: ['kr-middle-2'],
  M3: ['kr-middle-3'],
  H1: ['kr-high-1'],
  H2A: ['kr-high-2-algebra'],
  H2S: ['kr-high-2-probability-statistics'],
  A1: ['algebra-1'],
  A2: ['algebra-2'],
  PC: ['precalculus'],
};

const profiles = (...groups) => [...new Set(groups.flat())];

export const SECONDARY_ALGEBRA_UNITS = [
  { id: 'repeating-decimals', category: '수와 연산', label: '유리수와 순환소수', description: '순환소수를 분수로 바꾸고 유리수의 표현 이해하기', en: ['Rational & repeating decimals', 'Convert repeating decimals to fractions'], profiles: profiles(P.M2), make: repeatingDecimal },
  { id: 'exponent-laws', category: '문자와 식', label: '지수법칙', description: '곱셈·나눗셈·거듭제곱의 지수법칙', en: ['Exponent laws', 'Use product, quotient and power rules'], profiles: profiles(P.M2, P.A1), make: exponentLaws },
  { id: 'polynomial-operations-2', category: '문자와 식', label: '식의 계산', description: '단항식과 다항식의 계산 및 전개', en: ['Polynomial operations', 'Combine, multiply and expand algebraic expressions'], profiles: profiles(P.M2, P.A1), make: polynomialOperations },
  { id: 'linear-inequalities-2', category: '방정식과 부등식', label: '일차부등식', description: '일차부등식의 풀이와 부호 방향', en: ['Linear inequalities', 'Solve multi-step linear inequalities'], profiles: profiles(P.M2, P.A1), make: linearInequality },
  { id: 'systems-linear', category: '방정식과 부등식', label: '연립일차방정식', description: '가감법·대입법과 두 직선의 교점', en: ['Systems of linear equations', 'Solve systems algebraically and graphically'], profiles: profiles(P.M2, P.A1), make: systemsLinear },
  { id: 'linear-functions-2', category: '함수', label: '일차함수', description: '기울기·절편·그래프와 연립방정식의 관계', en: ['Linear functions', 'Work with slope, intercepts and graphs'], profiles: profiles(P.M2, P.A1), make: linearFunctions },
  { id: 'probability-2', category: '확률과 통계', label: '경우의 수와 확률', description: '경우의 수(합·곱의 법칙, 나열·대표 뽑기)와 확률의 성질·계산', en: ['Counting & probability', 'Counting principles, arrangements, and the properties and rules of probability'], profiles: profiles(P.M2, P.A1), make: probability },
  { id: 'radicals-real-numbers', category: '수와 연산', label: '제곱근과 실수', description: '근호의 간단한 계산과 무리수', en: ['Radicals & real numbers', 'Simplify and combine radical expressions'], profiles: profiles(P.M3, P.A1, P.A2, P.PC), make: radicals },
  { id: 'identities-factoring', category: '문자와 식', label: '곱셈공식과 인수분해', description: '곱셈공식의 전개와 이차식 인수분해', en: ['Identities & factoring', 'Expand identities and factor quadratics'], profiles: profiles(P.M3, P.H1, P.A1, P.A2), make: identitiesFactoring },
  { id: 'quadratic-equations', category: '방정식과 부등식', label: '이차방정식', description: '인수분해 가능한 이차방정식의 근', en: ['Quadratic equations', 'Solve quadratic equations by factoring'], profiles: profiles(P.M3, P.H1, P.A1, P.A2), make: quadraticEquations },
  { id: 'quadratic-functions', category: '함수', label: '이차함수', description: '꼭짓점·축·그래프의 이동', en: ['Quadratic functions', 'Interpret vertices, axes and graph transformations'], profiles: profiles(P.M3, P.H1, P.A1, P.A2, P.PC), make: quadraticFunctions },
  { id: 'quadratic-max-min', category: '함수', label: '이차함수의 최대·최소', description: '주어진 구간에서 이차함수의 최댓값과 최솟값', en: ['Quadratic max & min', 'Find the maximum or minimum on a closed interval'], profiles: profiles(P.M3, P.H1, P.A1, P.A2, P.PC), make: quadraticMaxMin },
  { id: 'data-variation', category: '확률과 통계', label: '대푯값과 산포의 변화', description: '자료 변환에 따른 평균과 산포의 변화', en: ['Data transformations', 'Understand how transformations affect center and spread'], profiles: profiles(P.M3, P.A1), make: dataVariation },
  { id: 'remainder-factor-theorem', category: '다항식', label: '나머지정리와 인수정리', description: '다항식의 값으로 나머지와 인수 판정', en: ['Remainder & Factor Theorems', 'Use polynomial values to find remainders and factors'], profiles: profiles(P.H1, P.A2, P.PC), make: remainderFactorTheorem },
  { id: 'complex-numbers', category: '수와 연산', label: '복소수', description: '복소수의 사칙계산과 i²=−1', en: ['Complex numbers', 'Add and multiply complex numbers'], profiles: profiles(P.H1, P.A2, P.PC), make: complexNumbers },
  { id: 'quadratic-inequalities', category: '방정식과 부등식', label: '이차부등식', description: '이차식의 부호와 해의 범위', en: ['Quadratic inequalities', 'Solve inequalities using zeros and signs'], profiles: profiles(P.H1, P.A2), make: quadraticInequalities },
  { id: 'permutations-combinations', category: '경우의 수', label: '순열과 조합', description: '순서를 고려하는 배열과 선택', en: ['Permutations & combinations', 'Count ordered arrangements and selections'], profiles: profiles(P.H1, P.H2S, P.A2), make: permutationsCombinations },
  { id: 'circular-permutations', category: '경우의 수', label: '원순열', description: '원형으로 배열하는 경우의 수', en: ['Circular permutations', 'Count seatings arranged around a circle'], profiles: profiles(P.H1, P.H2S, P.A2), make: circularPermutations },
  { id: 'matrices', category: '행렬', label: '행렬의 연산', description: '행렬의 성분과 덧셈', en: ['Matrix operations', 'Add matrices entry by entry'], profiles: profiles(P.H1, P.A2), make: matrices },
  { id: 'sets-logic', category: '집합과 명제', label: '집합의 연산', description: '합집합·교집합과 포함배제', en: ['Sets & logic', 'Use unions, intersections and inclusion-exclusion'], profiles: profiles(P.H1), make: setsAndLogic },
  { id: 'function-composition', category: '함수', label: '함수의 합성과 역함수 기초', description: '함숫값과 합성함수 계산', en: ['Function composition', 'Evaluate composite functions'], profiles: profiles(P.H1, P.A2, P.PC), make: functionComposition },
  { id: 'rational-radical-functions', category: '함수', label: '유리함수와 무리함수', description: '분모와 근호 조건을 이용한 정의역', en: ['Rational & radical functions', 'Determine domains from denominators and radicals'], profiles: profiles(P.H1, P.A2, P.PC), make: rationalRadicalFunctions },
  { id: 'exponential-equations', category: '지수와 로그', label: '지수함수와 지수방정식', description: '지수법칙과 같은 밑의 지수 비교', en: ['Exponential functions', 'Solve exponential equations and interpret growth'], profiles: profiles(P.H2A, P.A2, P.PC), make: exponentialEquations },
  { id: 'logarithms', category: '지수와 로그', label: '로그', description: '로그의 정의와 기본 계산', en: ['Logarithms', 'Evaluate logarithms from their definition'], profiles: profiles(P.H2A, P.A2, P.PC), make: logarithms },
  { id: 'sequences', category: '수열', label: '등차수열', description: '일반항과 첫 n항의 합', en: ['Arithmetic sequences', 'Find terms and finite sums'], profiles: profiles(P.H2A, P.A2, P.PC), make: sequences },
  { id: 'algebra-modeling', category: '수학적 모델링', label: '대수 문장제와 모델링', description: '비용·수익 관계를 식으로 세워 해결하기', en: ['Algebraic modeling', 'Build and solve equations from applied contexts'], profiles: profiles(P.M2, P.M3, P.H1, P.A1, P.A2), make: algebraModeling },
];
