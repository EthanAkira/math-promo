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

function linearInequality(random) {
  const root = randomInt(random, -6, 10);
  const a = randomInt(random, 2, 6);
  const b = randomInt(random, -9, 9);
  const symbol = pick(random, ['<', '≤', '>', '≥']);
  const reverse = { '<': '>', '≤': '≥', '>': '<', '≥': '≤' };
  if (random() < 0.7) return item('일차부등식을 푸세요.', `${a}x ${signed(b)} ${symbol} ${a * root + b}`, `x${symbol}${root}`, withEnglish({}, 'Solve the linear inequality.', `양변에서 ${b}를 정리하고 양수 ${a}로 나누면 x${symbol}${root}입니다.`, `Isolate the x-term and divide by positive ${a}: x${symbol}${root}.`));
  return item('일차부등식을 푸세요.', `${-a}x ${signed(b)} ${symbol} ${-a * root + b}`, `x${reverse[symbol]}${root}`, withEnglish({}, 'Solve the linear inequality.', `음수 ${-a}로 나누므로 부등호 방향을 바꾸어 x${reverse[symbol]}${root}입니다.`, `Divide by negative ${-a} and reverse the inequality: x${reverse[symbol]}${root}.`));
}

function systemsLinear(random) {
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

function linearFunctions(random) {
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

function probability(random) {
  const red = randomInt(random, 2, 8);
  const blue = randomInt(random, 2, 8);
  const mode = randomInt(random, 0, 1);
  if (mode === 0) return item(`주머니에 빨간 공 ${red}개와 파란 공 ${blue}개가 있습니다. 한 개를 꺼낼 때 빨간 공일 확률을 구하세요.`, '', fraction(red, red + blue), withEnglish({ kind: 'probability-bar', counts: [{ label: 'R', value: red }, { label: 'B', value: blue }] }, `A bag has ${red} red and ${blue} blue balls. Find P(red).`, `전체 ${red + blue}개 중 빨간 공이 ${red}개이므로 확률은 ${fraction(red, red + blue)}입니다.`, `There are ${red} favorable outcomes out of ${red + blue}, so the probability is ${fraction(red, red + blue)}.`));
  const first = fraction(red, red + blue);
  const second = fraction(red - 1, red + blue - 1);
  return item(`빨간 공 ${red}개와 파란 공 ${blue}개 중 두 개를 차례로 복원하지 않고 꺼냅니다. 모두 빨간 공일 확률을 구하세요.`, `${first} × ${second}`, fraction(red * (red - 1), (red + blue) * (red + blue - 1)), withEnglish({ kind: 'probability-tree', red, blue }, 'Two balls are drawn without replacement. Find the probability both are red.', `두 확률을 곱하면 ${first}×${second}=${fraction(red * (red - 1), (red + blue) * (red + blue - 1))}입니다.`, `Multiply the successive probabilities to get ${fraction(red * (red - 1), (red + blue) * (red + blue - 1))}.`));
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
};

const profiles = (...groups) => [...new Set(groups.flat())];

export const SECONDARY_ALGEBRA_UNITS = [
  { id: 'repeating-decimals', category: '수와 연산', label: '유리수와 순환소수', description: '순환소수를 분수로 바꾸고 유리수의 표현 이해하기', en: ['Rational & repeating decimals', 'Convert repeating decimals to fractions'], profiles: profiles(P.M2), make: repeatingDecimal },
  { id: 'exponent-laws', category: '문자와 식', label: '지수법칙', description: '곱셈·나눗셈·거듭제곱의 지수법칙', en: ['Exponent laws', 'Use product, quotient and power rules'], profiles: profiles(P.M2, P.A1), make: exponentLaws },
  { id: 'polynomial-operations-2', category: '문자와 식', label: '식의 계산', description: '단항식과 다항식의 계산 및 전개', en: ['Polynomial operations', 'Combine, multiply and expand algebraic expressions'], profiles: profiles(P.M2, P.A1), make: polynomialOperations },
  { id: 'linear-inequalities-2', category: '방정식과 부등식', label: '일차부등식', description: '일차부등식의 풀이와 부호 방향', en: ['Linear inequalities', 'Solve multi-step linear inequalities'], profiles: profiles(P.M2, P.A1), make: linearInequality },
  { id: 'systems-linear', category: '방정식과 부등식', label: '연립일차방정식', description: '가감법·대입법과 두 직선의 교점', en: ['Systems of linear equations', 'Solve systems algebraically and graphically'], profiles: profiles(P.M2, P.A1), make: systemsLinear },
  { id: 'linear-functions-2', category: '함수', label: '일차함수', description: '기울기·절편·그래프와 연립방정식의 관계', en: ['Linear functions', 'Work with slope, intercepts and graphs'], profiles: profiles(P.M2, P.A1), make: linearFunctions },
  { id: 'probability-2', category: '확률과 통계', label: '경우의 수와 확률', description: '한 단계·두 단계 확률과 복원하지 않는 추출', en: ['Probability', 'Find one-stage and two-stage probabilities'], profiles: profiles(P.M2, P.A1), make: probability },
  { id: 'radicals-real-numbers', category: '수와 연산', label: '제곱근과 실수', description: '근호의 간단한 계산과 무리수', en: ['Radicals & real numbers', 'Simplify and combine radical expressions'], profiles: profiles(P.M3, P.A1, P.A2), make: radicals },
  { id: 'identities-factoring', category: '문자와 식', label: '곱셈공식과 인수분해', description: '곱셈공식의 전개와 이차식 인수분해', en: ['Identities & factoring', 'Expand identities and factor quadratics'], profiles: profiles(P.M3, P.H1, P.A1, P.A2), make: identitiesFactoring },
  { id: 'quadratic-equations', category: '방정식과 부등식', label: '이차방정식', description: '인수분해 가능한 이차방정식의 근', en: ['Quadratic equations', 'Solve quadratic equations by factoring'], profiles: profiles(P.M3, P.H1, P.A1, P.A2), make: quadraticEquations },
  { id: 'quadratic-functions', category: '함수', label: '이차함수', description: '꼭짓점·축·그래프의 이동', en: ['Quadratic functions', 'Interpret vertices, axes and graph transformations'], profiles: profiles(P.M3, P.H1, P.A1, P.A2), make: quadraticFunctions },
  { id: 'data-variation', category: '확률과 통계', label: '대푯값과 산포의 변화', description: '자료 변환에 따른 평균과 산포의 변화', en: ['Data transformations', 'Understand how transformations affect center and spread'], profiles: profiles(P.M3, P.A1), make: dataVariation },
  { id: 'remainder-factor-theorem', category: '다항식', label: '나머지정리와 인수정리', description: '다항식의 값으로 나머지와 인수 판정', en: ['Remainder & Factor Theorems', 'Use polynomial values to find remainders and factors'], profiles: profiles(P.H1, P.A2), make: remainderFactorTheorem },
  { id: 'complex-numbers', category: '수와 연산', label: '복소수', description: '복소수의 사칙계산과 i²=−1', en: ['Complex numbers', 'Add and multiply complex numbers'], profiles: profiles(P.H1, P.A2), make: complexNumbers },
  { id: 'quadratic-inequalities', category: '방정식과 부등식', label: '이차부등식', description: '이차식의 부호와 해의 범위', en: ['Quadratic inequalities', 'Solve inequalities using zeros and signs'], profiles: profiles(P.H1, P.A2), make: quadraticInequalities },
  { id: 'permutations-combinations', category: '경우의 수', label: '순열과 조합', description: '순서를 고려하는 배열과 선택', en: ['Permutations & combinations', 'Count ordered arrangements and selections'], profiles: profiles(P.H1, P.H2S, P.A2), make: permutationsCombinations },
  { id: 'matrices', category: '행렬', label: '행렬의 연산', description: '행렬의 성분과 덧셈', en: ['Matrix operations', 'Add matrices entry by entry'], profiles: profiles(P.H1, P.A2), make: matrices },
  { id: 'sets-logic', category: '집합과 명제', label: '집합의 연산', description: '합집합·교집합과 포함배제', en: ['Sets & logic', 'Use unions, intersections and inclusion-exclusion'], profiles: profiles(P.H1), make: setsAndLogic },
  { id: 'function-composition', category: '함수', label: '함수의 합성과 역함수 기초', description: '함숫값과 합성함수 계산', en: ['Function composition', 'Evaluate composite functions'], profiles: profiles(P.H1, P.A2), make: functionComposition },
  { id: 'rational-radical-functions', category: '함수', label: '유리함수와 무리함수', description: '분모와 근호 조건을 이용한 정의역', en: ['Rational & radical functions', 'Determine domains from denominators and radicals'], profiles: profiles(P.H1, P.A2), make: rationalRadicalFunctions },
  { id: 'exponential-equations', category: '지수와 로그', label: '지수함수와 지수방정식', description: '지수법칙과 같은 밑의 지수 비교', en: ['Exponential functions', 'Solve exponential equations and interpret growth'], profiles: profiles(P.H2A, P.A2), make: exponentialEquations },
  { id: 'logarithms', category: '지수와 로그', label: '로그', description: '로그의 정의와 기본 계산', en: ['Logarithms', 'Evaluate logarithms from their definition'], profiles: profiles(P.H2A, P.A2), make: logarithms },
  { id: 'sequences', category: '수열', label: '등차수열', description: '일반항과 첫 n항의 합', en: ['Arithmetic sequences', 'Find terms and finite sums'], profiles: profiles(P.H2A, P.A2), make: sequences },
  { id: 'algebra-modeling', category: '수학적 모델링', label: '대수 문장제와 모델링', description: '비용·수익 관계를 식으로 세워 해결하기', en: ['Algebraic modeling', 'Build and solve equations from applied contexts'], profiles: profiles(P.M2, P.M3, P.H1, P.A1, P.A2), make: algebraModeling },
];
