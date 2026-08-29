const ri = (random, min, max) => Math.floor(random() * (max - min + 1)) + min;
const pick = (random, values) => values[ri(random, 0, values.length - 1)];
const nz = (random, min = -7, max = 7) => { let value; do value = ri(random, min, max); while (!value); return value; };
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const frac = (n, d = 1) => { const g = gcd(n, d); const sign = d < 0 ? -1 : 1; const nn = sign * n / g; const dd = Math.abs(d) / g; return dd === 1 ? String(nn) : `${nn}/${dd}`; };
const signed = (value) => value >= 0 ? `+${value}` : `${value}`;
const line = (a, b) => `${a === 1 ? '' : a === -1 ? '−' : a}x${b ? signed(b) : ''}`;
const make = (prompt, expression, answer, extra = {}) => ({ prompt, expression, answer: String(answer), ...extra });
const bi = (extra, promptEn, explanation, explanationEn) => ({ ...extra, promptEn, explanation, explanationEn });
const choice = (choicesKo, choicesEn = choicesKo) => ({ kind: 'choice', choicesKo, choicesEn });

function polynomialDivision(random) {
  const a = nz(random, -6, 6); const b = nz(random, -6, 6);
  const middle = b - a; const constant = -a * b;
  return make('다항식의 나눗셈에서 몫을 구하세요.', `(x^2${signed(middle)}x${signed(constant)}) ÷ (x${signed(-a)})`, `x${signed(b)}`, bi({}, 'Find the quotient.', `피제수는 (x${signed(-a)})(x${signed(b)})이므로 몫은 x${signed(b)}입니다.`, `Factor the dividend as (x${signed(-a)})(x${signed(b)}).`));
}

function polynomialMultiplicity(random) {
  const root = nz(random, -5, 5); const other = root + pick(random, [-3, -2, 2, 3]); const multiplicity = pick(random, [2, 3]);
  return make(`P(x)=(x−(${root}))^${multiplicity}(x−(${other}))일 때 근 x=${root}의 중복도를 구하세요.`, '', multiplicity, bi({ kind: 'polynomial-zero-graph', roots: [{ x: root, multiplicity }, { x: other, multiplicity: 1 }] }, `Find the multiplicity of the zero x=${root}.`, `(x−(${root}))의 지수가 ${multiplicity}이므로 중복도는 ${multiplicity}입니다.`, `The exponent of the factor is ${multiplicity}.`));
}

function complexQuadraticRoots(random) {
  const real = ri(random, -5, 5); const imaginary = ri(random, 1, 6); const b = -2 * real; const c = real * real + imaginary * imaginary;
  const labelsKo = [`${real}+${imaginary}i, ${real}−${imaginary}i`, `${-real}+${imaginary}i, ${-real}−${imaginary}i`, `${real + imaginary}, ${real - imaginary}`, `${imaginary}+${real}i, ${imaginary}−${real}i`];
  return make('이차방정식의 두 복소수 근을 고르세요.', `x^2${signed(b)}x${signed(c)}=0`, 1, bi(choice(labelsKo), 'Choose the two complex roots.', `근의 공식에서 x=${real}±${imaginary}i입니다.`, `The quadratic formula gives x=${real}±${imaginary}i.`));
}

function completingSquare(random) {
  const h = nz(random, -6, 6); const k = ri(random, -8, 8); const constant = h * h + k;
  return make(`x^2${signed(2 * h)}x${signed(constant)}=(x${signed(h)})^2+k일 때 k를 구하세요.`, '', k, bi({}, 'Find k by completing the square.', `(x${signed(h)})²=x²${signed(2 * h)}x+${h * h}이므로 k=${constant}−${h * h}=${k}입니다.`, `Compare constants after completing the square: k=${k}.`));
}

function discriminantClassification(random) {
  const mode = ri(random, 0, 2); let b; let c; let discriminant;
  if (mode === 0) { const r1 = ri(random, -5, 1); const r2 = ri(random, 2, 7); b = -(r1 + r2); c = r1 * r2; discriminant = (r1 - r2) ** 2; }
  else if (mode === 1) { const r = ri(random, -6, 6); b = -2 * r; c = r * r; discriminant = 0; }
  else { b = pick(random, [0, 2, 4]); c = b * b / 4 + ri(random, 1, 5); discriminant = b * b - 4 * c; }
  const labelsKo = ['서로 다른 두 실근', '중근', '서로 다른 두 허근']; const labelsEn = ['two distinct real roots', 'one repeated real root', 'two nonreal complex roots'];
  return make('판별식을 이용하여 근의 종류를 고르세요.', `x^2${signed(b)}x${signed(c)}=0`, mode + 1, bi(choice(labelsKo, labelsEn), 'Classify the roots using the discriminant.', `D=b²−4ac=${discriminant}이므로 ${labelsKo[mode]}입니다.`, `D=${discriminant}, so the equation has ${labelsEn[mode]}.`));
}

function absoluteValueEquations(random) {
  const center = ri(random, -7, 7); const distance = ri(random, 2, 8); const left = center - distance; const right = center + distance;
  return make('절댓값 방정식의 두 해를 작은 것부터 쓰세요.', `|x−(${center})|=${distance}`, `${left},${right}`, bi({ kind: 'inequality-line', points: [left, right], mode: 'points' }, 'Solve the absolute-value equation.', `중심 ${center}에서 거리가 ${distance}인 두 수이므로 x=${left}, ${right}입니다.`, `The solutions are ${distance} units from ${center}: ${left}, ${right}.`));
}

function literalEquations(random) {
  const base1 = ri(random, 3, 9); const base2 = ri(random, 3, 9); const height = ri(random, 2, 10); const area = (base1 + base2) * height / 2;
  return make(`사다리꼴의 넓이 A=(a+b)h/2에서 A=${area}, a=${base1}, b=${base2}일 때 h를 구하세요.`, '', height, bi({}, 'Solve the formula A=(a+b)h/2 for h using the given values.', `h=2A/(a+b)=${2 * area}/${base1 + base2}=${height}입니다.`, `h=2A/(a+b)=${height}.`));
}

function systemInequalities(random) {
  const x = ri(random, -4, 5); const y = ri(random, -4, 5); const candidates = [[x, y], [x + 3, y - 4], [x - 4, y + 2], [-x, -y]];
  const c1 = x + y + ri(random, 0, 3); const c2 = x - y - ri(random, 0, 3);
  const valid = candidates.findIndex(([px, py]) => px + py <= c1 && px - py >= c2);
  if (valid !== 0) return systemInequalities(random);
  const labels = candidates.map(([px, py]) => `(${px},${py})`);
  return make('연립부등식을 모두 만족하는 점을 고르세요.', `x+y≤${c1}, x−y≥${c2}`, 1, bi({ ...choice(labels), kind: 'choice', region: { c1, c2 } }, 'Choose the point satisfying both inequalities.', `${labels[0]}을 대입하면 두 부등식을 모두 만족합니다.`, `Substitution shows ${labels[0]} satisfies both inequalities.`));
}

function linearQuadraticSystem(random) {
  const root1 = ri(random, -5, 1); const root2 = ri(random, 2, 7); const slope = nz(random, -3, 3); const intercept = ri(random, -5, 5);
  const y1 = slope * root1 + intercept; const y2 = slope * root2 + intercept;
  const sum = root1 + root2; const product = root1 * root2;
  return make('직선과 포물선의 교점 두 개의 x좌표의 합을 구하세요.', `y=${line(slope, intercept)}, y=${line(slope, intercept)}+(x−(${root1}))(x−(${root2}))`, sum, bi({ kind: 'algebra-graph', graph: { type: 'quadratic-system', slope, intercept, roots: [root1, root2], points: [{ x: root1, y: y1 }, { x: root2, y: y2 }] } }, 'Find the sum of the x-coordinates of the two intersections.', `두 식을 같게 놓으면 (x−(${root1}))(x−(${root2}))=0이므로 합은 ${sum}입니다.`, `Equating the functions gives roots ${root1},${root2}, whose sum is ${sum}.`));
}

function finiteDomainRange(random) {
  const inputs = [-2, -1, 0, 1, 2]; const a = nz(random, -3, 3); const b = ri(random, -3, 3); const outputs = [...new Set(inputs.map((x) => a * x + b))];
  const correct = `{${outputs.join(',')}}`; const distractors = [`{${inputs.join(',')}}`, `{${outputs.slice(0, -1).join(',')}}`, `{${outputs.map((v) => v + 1).join(',')}}`];
  return make('대응표에 나타난 함수의 치역을 고르세요.', '', 1, bi({ ...choice([correct, ...distractors]), visualKind: 'mapping-table', mapping: { inputs, outputs: inputs.map((x) => a * x + b) } }, 'Choose the range of the function shown in the mapping table.', `출력값을 중복 없이 모으면 ${correct}입니다.`, `Collect the distinct outputs to get ${correct}.`));
}

function piecewiseFunctions(random) {
  const split = ri(random, -2, 3); const a = nz(random, -3, 3); const b = ri(random, -5, 5); const c = nz(random, -3, 3); const d = ri(random, -5, 5);
  const x = split + pick(random, [-3, -2, 2, 3]); const first = x < split; const answer = first ? a * x + b : c * x + d;
  return make(`f(x)={ ${line(a, b)} (x<${split}), ${line(c, d)} (x≥${split}) }일 때 f(${x})를 구하세요.`, '', answer, bi({ kind: 'piecewise-graph', split, left: [a, b], right: [c, d] }, `Evaluate f(${x}) from the piecewise definition.`, `${x}${first ? '<' : '≥'}${split}이므로 해당 식에 대입하면 ${answer}입니다.`, `Use the ${first ? 'first' : 'second'} branch to obtain ${answer}.`));
}

function averageRateChange(random) {
  const a = nz(random, -3, 3); const b = ri(random, -5, 5); const left = ri(random, -4, 1); const right = left + ri(random, 2, 5);
  const f = (x) => a * x * x + b; const answer = frac(f(right) - f(left), right - left);
  return make(`f(x)=${a}x^2${signed(b)}의 구간 [${left},${right}]에서 평균변화율을 구하세요.`, '', answer, bi({ kind: 'algebra-graph', graph: { type: 'quadratic', a, h: 0, k: b, points: [{ x: left, y: f(left) }, { x: right, y: f(right) }] } }, 'Find the average rate of change on the interval.', `(f(${right})−f(${left}))/(${right}−${left})=${answer}입니다.`, `Use the secant slope formula to obtain ${answer}.`));
}

function functionTransformations(random) {
  const h = nz(random, -5, 5); const k = nz(random, -5, 5); const ah = Math.abs(h); const ak = Math.abs(k); const labelsKo = [`오른쪽 ${ah}만큼, 위 ${ak}만큼`, `왼쪽 ${ah}만큼, 위 ${ak}만큼`, `오른쪽 ${ah}만큼, 아래 ${ak}만큼`, `왼쪽 ${ah}만큼, 아래 ${ak}만큼`];
  const horizontalRight = h > 0; const verticalUp = k > 0; const answer = horizontalRight ? (verticalUp ? 1 : 3) : (verticalUp ? 2 : 4);
  return make('y=f(x)의 그래프에서 다음 그래프의 이동을 고르세요.', `y=f(x−(${h}))${signed(k)}`, answer, bi(choice(labelsKo, labelsKo), 'Choose the graph transformation.', `괄호 안은 ${horizontalRight ? '오른쪽' : '왼쪽'} ${Math.abs(h)}, 함수 밖은 ${verticalUp ? '위' : '아래'} ${Math.abs(k)}만큼 이동합니다.`, `The inside shift is horizontal and the outside shift is vertical.`));
}

function inverseFunctions(random) {
  const a = nz(random, -5, 5); const b = ri(random, -6, 6); const input = ri(random, -5, 8); const answer = frac(input - b, a);
  return make(`f(x)=${line(a, b)}일 때 f^−1(${input})을 구하세요.`, '', answer, bi({}, 'Evaluate the inverse function.', `${line(a, b)}=${input}을 풀면 x=${answer}이므로 f⁻¹(${input})=${answer}입니다.`, `Solve ${line(a, b)}=${input} for x to get ${answer}.`));
}

function exponentialModeling(random) {
  const initial = pick(random, [100, 200, 500, 1000]); const rate = pick(random, [10, 20, 25, 50]); const years = ri(random, 2, 4); const factor = 1 + rate / 100; const answer = initial * factor ** years;
  const rounded = Number(answer.toFixed(2));
  return make(`초기량이 ${initial}이고 매년 ${rate}%씩 증가할 때 ${years}년 후의 양을 구하세요.`, `${initial}(1+${rate}/100)^${years}`, rounded, bi({ kind: 'algebra-graph', graph: { type: 'exponential', base: factor, scale: initial } }, 'Find the amount after exponential growth.', `A=${initial}(${factor})^${years}=${rounded}입니다.`, `Use A=${initial}(${factor})^${years}=${rounded}.`));
}

function linearRegression(random) {
  const slope = nz(random, 1, 4); const intercept = ri(random, -3, 5); const points = Array.from({ length: 7 }, (_, index) => [index + 1, slope * (index + 1) + intercept + pick(random, [-1, 0, 0, 1])]);
  const x = ri(random, 8, 12); const answer = slope * x + intercept;
  return make(`산점도의 추세선이 y=${line(slope, intercept)}일 때 x=${x}에서 예측값을 구하세요.`, '', answer, bi({ kind: 'regression-scatter', points, slope, intercept }, 'Use the trend line to predict the response.', `추세선에 x=${x}를 대입하면 y=${answer}입니다.`, `Substitute x=${x} into the trend line to get ${answer}.`));
}

function twoWayTables(random) {
  const a = ri(random, 8, 20); const b = ri(random, 5, 15); const c = ri(random, 6, 18); const d = ri(random, 5, 15); const row = a + b;
  return make('이원분할표에서 첫 번째 행에 속한다는 조건 아래 첫 번째 열에 속할 조건부확률을 구하세요.', '', frac(a, row), bi({ kind: 'two-way-table', cells: [[a, b], [c, d]] }, 'Find the conditional probability of column 1 given row 1.', `조건이 첫 번째 행이므로 표본공간은 ${row}, 해당 칸은 ${a}이어서 ${frac(a, row)}입니다.`, `Restrict to row 1: ${a}/${row}=${frac(a, row)}.`));
}

function rationalExpressions(random) {
  const a = nz(random, -6, 6); const b = nz(random, -6, 6);
  return make('유리식을 약분하세요.', `(x^2${signed(a + b)}x${signed(a * b)})/(x${signed(a)})`, `x${signed(b)}`, bi({}, 'Simplify the rational expression.', `분자를 (x${signed(a)})(x${signed(b)})로 인수분해하여 공통인수를 약분합니다.`, `Factor the numerator and cancel the common factor.`));
}

function rationalEquations(random) {
  const excluded = nz(random, -5, 5); const root = excluded + pick(random, [-5, -3, 3, 5]); const numerator = root - excluded;
  return make(`유리방정식을 푸세요. 단, x≠${excluded}.`, `${numerator}/(x−(${excluded}))=1`, root, bi({}, 'Solve the rational equation, respecting the restriction.', `x−(${excluded})=${numerator}이므로 x=${root}이고 제한 조건을 만족합니다.`, `Solve x−(${excluded})=${numerator}; the result satisfies the restriction.`));
}

function radicalEquations(random) {
  const root = ri(random, -5, 12); const value = ri(random, 2, 8); const shift = value * value - root;
  return make('무리방정식을 풀고 해를 검산하세요.', `√(x${signed(shift)})=${value}`, root, bi({}, 'Solve and check the radical equation.', `양변을 제곱하면 x${signed(shift)}=${value * value}, x=${root}이며 원래 식을 만족합니다.`, `Square both sides to get x=${root}, then verify it.`));
}

function logarithmicModeling(random) {
  const base = pick(random, [2, 3, 10]); const exponent = ri(random, 2, 6); const multiplier = ri(random, 1, 4);
  return make(`N=${multiplier}·${base}^t이고 N=${multiplier * base ** exponent}일 때 t를 구하세요.`, '', exponent, bi({}, 'Solve the exponential model for t.', `${multiplier}·${base}^t=${multiplier * base ** exponent}에서 ${base}^t=${base}^${exponent}이므로 t=${exponent}입니다.`, `Match equal powers of ${base} to get t=${exponent}.`));
}

function geometricSequences(random) {
  const first = nz(random, 1, 6); const ratio = pick(random, [2, 3, 4]); const n = ri(random, 4, 7); const nth = first * ratio ** (n - 1);
  if (random() < 0.5) return make(`첫째항이 ${first}, 공비가 ${ratio}인 등비수열의 제${n}항을 구하세요.`, '', nth, bi({ kind: 'sequence-table', values: Array.from({ length: 5 }, (_, i) => first * ratio ** i) }, 'Find the indicated term of the geometric sequence.', `a_${n}=${first}·${ratio}^${n - 1}=${nth}입니다.`, `a_${n}=${first}·${ratio}^${n - 1}=${nth}.`));
  const sum = first * (ratio ** n - 1) / (ratio - 1);
  return make(`첫째항이 ${first}, 공비가 ${ratio}인 등비수열의 첫 ${n}항의 합을 구하세요.`, '', sum, bi({ kind: 'sequence-table', values: Array.from({ length: 5 }, (_, i) => first * ratio ** i) }, 'Find the finite geometric sum.', `S_${n}=${first}(${ratio}^${n}−1)/(${ratio}−1)=${sum}입니다.`, `Use the finite geometric-sum formula to get ${sum}.`));
}

function binomialTheorem(random) {
  const n = ri(random, 4, 8); const r = ri(random, 1, n - 1); let coefficient = 1;
  for (let i = 1; i <= r; i += 1) coefficient = coefficient * (n - i + 1) / i;
  return make(`(x+1)^${n}의 전개식에서 x^${n - r}의 계수를 구하세요.`, '', coefficient, bi({}, 'Find the requested coefficient using the Binomial Theorem.', `계수는 ${n}C${r}=${coefficient}입니다.`, `The coefficient is ${n}C${r}=${coefficient}.`));
}

function variationModeling(random) {
  const k = ri(random, 2, 12); const x = ri(random, 2, 8); const inverse = random() < 0.5; const y = inverse ? k * x : k * x; const target = ri(random, 2, 9);
  if (inverse) return make(`y가 x에 반비례하고 x=${x}일 때 y=${k}입니다. x=${target}일 때 y를 구하세요.`, '', frac(k * x, target), bi({}, 'Solve the inverse-variation problem.', `xy=${k * x}이므로 y=${k * x}/${target}=${frac(k * x, target)}입니다.`, `The product xy is constant.`));
  return make(`y가 x에 정비례하고 x=${x}일 때 y=${y}입니다. x=${target}일 때 y를 구하세요.`, '', k * target, bi({}, 'Solve the direct-variation problem.', `y=kx에서 k=${k}이므로 y=${k * target}입니다.`, `Find the constant of variation and substitute.`));
}

function conditionalProbability(random) {
  const common = ri(random, 3, 10); const onlyA = ri(random, 4, 12); const onlyB = ri(random, 4, 12);
  return make('P(B|A)를 구하세요.', `n(A∩B)=${common}, n(A)=${common + onlyA}`, frac(common, common + onlyA), bi({ kind: 'venn', total: common + onlyA + onlyB, a: common + onlyA, b: common + onlyB, intersection: common }, 'Find P(B|A).', `P(B|A)=n(A∩B)/n(A)=${common}/${common + onlyA}=${frac(common, common + onlyA)}입니다.`, `Use the conditional-probability definition.`));
}

function exactTrigonometry(random) {
  const cases = [['sin30°', 1, 2, ''], ['cos60°', 1, 2, ''], ['sin45°', 1, 2, '√2'], ['cos30°', 1, 2, '√3'], ['tan45°', 1, 1, '']];
  const [trig, numerator, denominator, radical] = pick(random, cases); const scale = ri(random, 1, 9); const coefficient = frac(scale * numerator, denominator);
  const answer = radical ? (coefficient === '1' ? radical : coefficient === '1/2' ? `${radical}/2` : `${coefficient}${radical}`) : coefficient;
  const expression = scale === 1 ? trig : `${scale}·${trig}`;
  return make('삼각함수의 정확한 값을 구하세요.', expression, answer, bi({ kind: 'unit-circle', angle: trig.match(/\d+/)?.[0] }, 'Find the exact trigonometric value.', `특수각의 단위원 값에 ${scale}을 곱하면 ${expression}=${answer}입니다.`, `Multiply the exact unit-circle value by ${scale}: ${answer}.`));
}

function internalDivision(random) {
  const x1 = ri(random, -8, 2); const y1 = ri(random, -8, 2); const m = ri(random, 1, 4); const n = ri(random, 1, 4); const px = ri(random, -3, 6); const py = ri(random, -3, 6); const x2n = px * (m + n) - n * x1; const y2n = py * (m + n) - n * y1;
  if (x2n % m || y2n % m) return internalDivision(random);
  const x2 = x2n / m; const y2 = y2n / m;
  return make(`A(${x1},${y1}), B(${x2},${y2})를 m:n=${m}:${n}으로 내분하는 점 P의 좌표를 구하세요.`, '', `(${px},${py})`, bi({ kind: 'coordinate-geometry-graph', mode: 'segment', points: [{ x: x1, y: y1, label: 'A' }, { x: x2, y: y2, label: 'B' }, { x: px, y: py, label: 'P' }] }, 'Find the internal-division point.', `P=((n·A+m·B)/(m+n))=(${px},${py})입니다.`, `Apply the section formula to obtain (${px},${py}).`));
}

function externalDivision(random) {
  const x1 = ri(random, -8, 2); const y1 = ri(random, -8, 2); const m = ri(random, 1, 4); let n = ri(random, 1, 4); if (n === m) n += 1; const px = ri(random, -3, 6); const py = ri(random, -3, 6); const x2n = (m - n) * px + n * x1; const y2n = (m - n) * py + n * y1;
  if (x2n % m || y2n % m) return externalDivision(random);
  const x2 = x2n / m; const y2 = y2n / m;
  return make(`A(${x1},${y1}), B(${x2},${y2})를 m:n=${m}:${n}으로 외분하는 점 P의 좌표를 구하세요.`, '', `(${px},${py})`, bi({ kind: 'coordinate-geometry-graph', mode: 'segment', points: [{ x: x1, y: y1, label: 'A' }, { x: x2, y: y2, label: 'B' }, { x: px, y: py, label: 'P' }] }, 'Find the external-division point.', `P=((−n·A+m·B)/(m−n))=(${px},${py})입니다.`, `Apply the external section formula to obtain (${px},${py}).`));
}

function lineDistanceConditions(random) {
  if (random() < 0.5) {
    const slope = nz(random, -5, 5); return make(`직선 y=${slope}x+2에 수직인 직선의 기울기를 구하세요.`, '', frac(-1, slope), bi({ kind: 'coordinate-geometry-graph', mode: 'perpendicular-lines', slope }, 'Find the slope of a perpendicular line.', `두 기울기의 곱은 −1이므로 기울기는 ${frac(-1, slope)}입니다.`, `Perpendicular slopes multiply to −1.`));
  }
  const a = pick(random, [3, 4, 5]); const b = pick(random, [3, 4, 5]); const distance = ri(random, 2, 8); const norm2 = a * a + b * b; const norm = Math.sqrt(norm2);
  if (!Number.isInteger(norm)) return lineDistanceConditions(random);
  const c = distance * norm;
  return make(`원점과 직선 ${a}x+${b}y−${c}=0 사이의 거리를 구하세요.`, '', distance, bi({ kind: 'coordinate-geometry-graph', mode: 'point-line', a, b, c }, 'Find the distance from the origin to the line.', `거리=|−${c}|/√(${a}²+${b}²)=${distance}입니다.`, `Use the point-to-line distance formula.`));
}

function circleEquations(random) {
  const h = ri(random, -5, 5); const k = ri(random, -5, 5); const radius = ri(random, 2, 8);
  return make('원의 중심 좌표와 반지름을 중심x,중심y,반지름 형식으로 쓰세요.', `(x−(${h}))^2+(y−(${k}))^2=${radius * radius}`, `${h},${k},${radius}`, bi({ kind: 'coordinate-geometry-graph', mode: 'circle', h, k, radius }, 'Give center x, center y, and radius.', `표준형과 비교하면 중심은 (${h},${k}), 반지름은 ${radius}입니다.`, `Compare with (x−h)²+(y−k)²=r².`));
}

function coordinateTransformations(random) {
  const x = ri(random, -7, 7); const y = ri(random, -7, 7); const dx = nz(random, -5, 5); const dy = nz(random, -5, 5);
  return make(`점 P(${x},${y})를 x축 방향으로 ${dx}, y축 방향으로 ${dy}만큼 평행이동한 좌표를 구하세요.`, '', `(${x + dx},${y + dy})`, bi({ kind: 'coordinate-geometry-graph', mode: 'translation', points: [{ x, y, label: 'P' }, { x: x + dx, y: y + dy, label: "P'" }] }, 'Translate the point by the given vector.', `각 좌표에 이동량을 더하면 (${x + dx},${y + dy})입니다.`, `Add the translation vector to the coordinates.`));
}

function propositions(random) {
  const statement = pick(random, [
    ['n이 4의 배수이면 n은 2의 배수이다.', '참', '거짓'],
    ['x²=9이면 x=3이다.', '거짓', '참'],
    ['두 정수가 모두 홀수이면 그 합은 짝수이다.', '참', '거짓'],
  ]);
  return make(`명제의 참·거짓을 고르세요: ${statement[0]}`, '', 1, bi(choice([statement[1], statement[2]], [statement[1] === '참' ? 'True' : 'False', statement[2] === '참' ? 'True' : 'False']), `Determine whether the proposition is true or false: ${statement[0]}`, `정의 또는 반례를 확인하면 이 명제는 ${statement[1]}입니다.`, `Checking the definition or a counterexample gives the stated truth value.`));
}

function matrixMultiplication(random) {
  const a = Array.from({ length: 4 }, () => ri(random, -3, 5)); const b = Array.from({ length: 4 }, () => ri(random, -3, 5));
  const result = [a[0] * b[0] + a[1] * b[2], a[0] * b[1] + a[1] * b[3], a[2] * b[0] + a[3] * b[2], a[2] * b[1] + a[3] * b[3]];
  return make('두 행렬의 곱을 [a,b;c,d] 형식으로 쓰세요.', `[${a[0]},${a[1]};${a[2]},${a[3]}][${b[0]},${b[1]};${b[2]},${b[3]}]`, `[${result[0]},${result[1]};${result[2]},${result[3]}]`, bi({ kind: 'matrix-operation', matrices: [a, b], operator: '×' }, 'Multiply the matrices.', '행과 열의 대응 성분을 곱하여 더합니다.', 'Take row-by-column dot products.'));
}

const P = { H1: ['kr-high-1'], H2A: ['kr-high-2-algebra'], H2S: ['kr-high-2-probability-statistics'], A1: ['algebra-1'], A2: ['algebra-2'], PC: ['precalculus'] };
const profiles = (...groups) => [...new Set(groups.flat())];
const unit = (id, category, label, enLabel, description, enDescription, profileList, generator) => ({ id, category, label, description, en: [enLabel, enDescription], profiles: profileList, make: generator });

const HIGH1_REVIEW = [polynomialDivision, complexQuadraticRoots, completingSquare, discriminantClassification, linearQuadraticSystem, functionTransformations, inverseFunctions, internalDivision, lineDistanceConditions, circleEquations, coordinateTransformations, propositions, matrixMultiplication];
const ALGEBRA1_REVIEW = [completingSquare, discriminantClassification, absoluteValueEquations, literalEquations, systemInequalities, finiteDomainRange, piecewiseFunctions, averageRateChange, functionTransformations, exponentialModeling, linearRegression, twoWayTables, variationModeling];
const ALGEBRA2_REVIEW = [polynomialDivision, polynomialMultiplicity, complexQuadraticRoots, discriminantClassification, linearQuadraticSystem, piecewiseFunctions, averageRateChange, inverseFunctions, exponentialModeling, rationalExpressions, rationalEquations, radicalEquations, logarithmicModeling, geometricSequences, binomialTheorem, conditionalProbability, exactTrigonometry, matrixMultiplication];
const mixed = (pool) => (random) => pick(random, pool)(random);

export const ALGEBRA_COMPLETION_UNITS = [
  unit('polynomial-division', '다항식', '다항식의 나눗셈', 'Polynomial division', '인수분해와 다항식 나눗셈의 몫', 'Divide polynomials and verify by multiplication', profiles(P.H1, P.A2, P.PC), polynomialDivision),
  unit('polynomial-zeros-multiplicity', '다항식', '다항함수의 영점과 중복도', 'Polynomial zeros & multiplicity', '인수와 그래프의 x절편·중복도 연결', 'Connect factors, zeros, intercepts and multiplicity', profiles(P.A2, P.PC), polynomialMultiplicity),
  unit('complex-quadratic-roots', '방정식과 부등식', '복소수 이차방정식', 'Complex quadratic roots', '판별식이 음수인 이차방정식', 'Solve quadratics with nonreal roots', profiles(P.H1, P.A2), complexQuadraticRoots),
  unit('completing-square', '방정식과 부등식', '완전제곱식과 제곱완성', 'Completing the square', '이차식을 완전제곱식으로 변형', 'Rewrite quadratics in completed-square form', profiles(P.H1, P.A1, P.A2), completingSquare),
  unit('discriminant-roots', '방정식과 부등식', '판별식과 근의 종류', 'Discriminant & root type', '판별식으로 실근·중근·허근 판별', 'Classify quadratic roots using the discriminant', profiles(P.H1, P.A1, P.A2), discriminantClassification),
  unit('absolute-value-equations', '방정식과 부등식', '절댓값 방정식', 'Absolute-value equations', '거리 해석으로 절댓값 방정식 해결', 'Solve absolute-value equations as distance statements', profiles(P.A1, P.A2), absoluteValueEquations),
  unit('literal-equations', '방정식과 부등식', '문자 공식 변형', 'Literal equations', '공식에서 특정 문자를 고립시키고 적용', 'Rearrange and apply formulas', profiles(P.A1), literalEquations),
  unit('systems-inequalities', '방정식과 부등식', '연립일차부등식', 'Systems of inequalities', '두 부등식의 공통해와 영역', 'Find points in overlapping solution regions', profiles(P.A1), systemInequalities),
  unit('linear-quadratic-systems', '방정식과 부등식', '직선과 이차함수의 교점', 'Linear-quadratic systems', '연립이차방정식과 그래프의 교점', 'Solve intersections of lines and quadratics', profiles(P.H1, P.A2), linearQuadraticSystem),
  unit('finite-domain-range', '함수', '정의역과 치역', 'Domain & range', '대응표에서 정의역과 치역 해석', 'Interpret domain and range from mappings', profiles(P.A1, P.A2), finiteDomainRange),
  unit('piecewise-functions', '함수', '구간별 정의 함수', 'Piecewise functions', '조건에 따라 식을 선택하여 함숫값 계산', 'Evaluate and graph piecewise functions', profiles(P.A1, P.A2, P.PC), piecewiseFunctions),
  unit('average-rate-change', '함수', '평균변화율', 'Average rate of change', '표·식·그래프에서 구간 변화율 계산', 'Calculate and interpret secant slopes', profiles(P.A1, P.A2, P.PC), averageRateChange),
  unit('function-transformations', '함수', '함수 그래프의 변환', 'Function transformations', '평행이동·대칭·확대와 식의 변화', 'Interpret shifts, reflections and stretches', profiles(P.H1, P.A1, P.A2, P.PC), functionTransformations),
  unit('inverse-functions-complete', '함수', '역함수', 'Inverse functions', '일대일함수의 역함숫값 계산', 'Evaluate inverse functions algebraically', profiles(P.H1, P.A2, P.PC), inverseFunctions),
  unit('exponential-modeling', '함수', '지수성장과 감소 모델', 'Exponential growth & decay', '백분율 변화와 지수모델 응용', 'Model repeated percent change', profiles(P.A1, P.A2, P.PC), exponentialModeling),
  unit('regression-modeling', '확률과 통계', '산점도와 회귀모델', 'Scatterplots & regression', '추세선으로 자료의 값을 예측', 'Use linear regression models for prediction', profiles(P.A1, P.A2), linearRegression),
  unit('two-way-tables', '확률과 통계', '이원분할표와 조건부확률', 'Two-way tables', '행·열 조건에 따른 상대도수', 'Calculate conditional relative frequencies', profiles(P.H2S, P.A1, P.A2), twoWayTables),
  unit('rational-expressions', '문자와 식', '유리식의 연산', 'Rational expressions', '인수분해와 유리식의 약분', 'Factor and simplify rational expressions', profiles(P.A2, P.PC), rationalExpressions),
  unit('rational-equations', '방정식과 부등식', '유리방정식', 'Rational equations', '정의역 제한과 유리방정식의 해', 'Solve rational equations and reject excluded values', profiles(P.A2), rationalEquations),
  unit('radical-equations', '방정식과 부등식', '무리방정식', 'Radical equations', '제곱과 검산을 이용한 무리방정식', 'Solve radical equations and check extraneous roots', profiles(P.A2), radicalEquations),
  unit('logarithmic-modeling', '지수와 로그', '지수·로그 모델링', 'Exponential & logarithmic modeling', '지수모델의 미지 지수 구하기', 'Solve for time in exponential models', profiles(P.A2), logarithmicModeling),
  unit('geometric-sequences', '수열', '등비수열과 유한급수', 'Geometric sequences & series', '등비수열의 일반항과 합', 'Find terms and finite geometric sums', profiles(P.H2A, P.A2, P.PC), geometricSequences),
  unit('binomial-theorem', '다항식', '이항정리', 'Binomial Theorem', '조합을 이용한 전개식의 계수', 'Find expansion coefficients with combinations', profiles(P.H2S, P.A2), binomialTheorem),
  unit('variation-modeling', '수학적 모델링', '정비례·반비례 모델링', 'Direct & inverse variation', '변화상수를 이용한 응용문제', 'Model direct and inverse variation', profiles(P.A1, P.A2), variationModeling),
  unit('conditional-probability', '확률과 통계', '조건부확률', 'Conditional probability', '집합과 조건을 제한한 확률', 'Calculate probabilities under conditions', profiles(P.H2S, P.A2), conditionalProbability),
  unit('algebra2-trigonometry', '삼각함수', '삼각함수의 값', 'Trigonometric values', '특수각의 정확한 삼각함수 값', 'Use exact unit-circle values', profiles(P.H2A, P.A2, P.PC), exactTrigonometry),
  unit('internal-division-coordinate', '도형의 방정식', '선분의 내분점', 'Internal division point', '내분 공식과 좌표 계산', 'Use the section formula in coordinates', profiles(P.H1), internalDivision),
  unit('external-division-coordinate', '도형의 방정식', '선분의 외분점', 'External division point', '외분 공식과 좌표 계산', 'Use the external section formula in coordinates', profiles(P.H1), externalDivision),
  unit('line-distance-conditions', '도형의 방정식', '직선의 평행·수직·거리', 'Line conditions & distance', '기울기 관계와 점·직선 사이 거리', 'Use slopes and point-to-line distance', profiles(P.H1), lineDistanceConditions),
  unit('circle-equations-complete', '도형의 방정식', '원의 방정식', 'Circle equations', '중심과 반지름을 이용한 원의 표준형', 'Read and construct circle equations', profiles(P.H1), circleEquations),
  unit('coordinate-transformations', '도형의 방정식', '도형의 이동', 'Coordinate transformations', '점과 도형의 평행이동·대칭이동', 'Translate and reflect coordinate figures', profiles(P.H1), coordinateTransformations),
  unit('propositions-complete', '집합과 명제', '명제·조건·반례', 'Propositions & counterexamples', '명제의 참·거짓과 반례 판단', 'Test propositions and use counterexamples', profiles(P.H1), propositions),
  unit('matrix-multiplication', '행렬', '행렬의 곱셈', 'Matrix multiplication', '행과 열의 곱으로 행렬 계산', 'Multiply matrices by row-column products', profiles(P.H1, P.A2, P.PC), matrixMultiplication),
  unit('kr-high-1-complete-review', '종합평가', '공통수학 1·2 종합평가', 'Common Mathematics comprehensive review', '대수·함수·경우의 수·좌표·집합·행렬을 섞은 독립 문제지', 'Mixed independent review across Common Mathematics 1–2', profiles(P.H1), mixed(HIGH1_REVIEW)),
  unit('algebra-1-complete-review', '종합평가', 'Algebra 1 종합평가', 'Algebra 1 comprehensive review', '식·방정식·함수·모델링·자료를 섞은 독립 문제지', 'Mixed independent review of equations, functions, modeling and data', profiles(P.A1), mixed(ALGEBRA1_REVIEW)),
  unit('algebra-2-complete-review', '종합평가', 'Algebra 2 종합평가', 'Algebra 2 comprehensive review', '고급 대수·함수·확률·수열·삼각함수 혼합 문제지', 'Mixed independent review of advanced algebra, functions, probability, sequences and trigonometry', profiles(P.A2), mixed(ALGEBRA2_REVIEW)),
];
