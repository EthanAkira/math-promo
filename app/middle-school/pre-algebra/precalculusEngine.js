const ri = (random, min, max) => Math.floor(random() * (max - min + 1)) + min;
const pick = (random, values) => values[ri(random, 0, values.length - 1)];
const nz = (random, min = -7, max = 7) => { let value; do value = ri(random, min, max); while (!value); return value; };
const signed = (value) => value >= 0 ? `+${value}` : `${value}`;
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const frac = (n, d = 1) => { const g = gcd(n, d); const nn = n / g; const dd = d / g; return dd === 1 ? String(nn) : `${nn}/${dd}`; };
const make = (prompt, expression, answer, extra = {}) => ({ prompt, expression, answer: String(answer), ...extra });
const bi = (promptEn, explanation, explanationEn, extra = {}) => ({ promptEn, explanation, explanationEn, ...extra });
const choice = (choicesKo, choicesEn = choicesKo) => ({ kind: 'choice', choicesKo, choicesEn });

const PC = 'precalculus';
const H2A = 'kr-high-2-algebra';
const H3G = 'kr-high-3-geometry';

function polynomialEndBehavior(random) {
  const degree = pick(random, [2, 3, 4, 5]); const leading = pick(random, [-3, -2, 2, 3]);
  const labelsKo = ['양쪽 끝이 모두 위로 향한다.', '양쪽 끝이 모두 아래로 향한다.', '왼쪽은 아래, 오른쪽은 위로 향한다.', '왼쪽은 위, 오른쪽은 아래로 향한다.'];
  const labelsEn = ['Both ends rise.', 'Both ends fall.', 'Left falls and right rises.', 'Left rises and right falls.'];
  const answer = degree % 2 === 0 ? (leading > 0 ? 1 : 2) : (leading > 0 ? 3 : 4);
  return make('다항함수의 끝 행동으로 알맞은 것을 고르세요.', `f(x)=${leading}x^${degree}+⋯`, answer, bi('Choose the end behavior of the polynomial.', `차수의 홀짝과 최고차항 계수의 부호를 보면 ${labelsKo[answer - 1]}입니다.`, `The degree parity and leading-coefficient sign determine that ${labelsEn[answer - 1].toLowerCase()}`, choice(labelsKo, labelsEn)));
}

function rationalFeatures(random) {
  const vertical = nz(random, -6, 6); const horizontal = pick(random, [-3, -2, 1, 2, 3]); const intercept = nz(random, -8, 8);
  if (random() < 0.65) return make('유리함수의 수직점근선의 방정식을 구하세요.', `f(x)=(${horizontal}x${signed(intercept)})/(x${signed(-vertical)})`, `x=${vertical}`, bi('Find the vertical asymptote.', `분모가 0이 되는 x=${vertical}에서 약분되지 않으므로 수직점근선입니다.`, `The denominator is zero at x=${vertical}, giving the vertical asymptote.`));
  const hole = nz(random, -5, 5); const other = hole + pick(random, [-3, -2, 2, 3]);
  return make('유리함수 그래프에서 구멍이 생기는 x좌표를 구하세요.', `f(x)=((x${signed(-hole)})(x${signed(-other)}))/(x${signed(-hole)})`, hole, bi('Find the x-coordinate of the hole.', `공통인수 x${signed(-hole)}가 약분되지만 x=${hole}는 정의되지 않아 구멍이 생깁니다.`, `The common factor cancels, but x=${hole} remains excluded, producing a hole.`));
}

function exponentialLogTransformations(random) {
  const base = pick(random, [2, 3, 4, 5]); const h = nz(random, -4, 4); const k = nz(random, -5, 5);
  if (random() < 0.5) return make('지수함수 그래프의 수평점근선을 구하세요.', `y=${base}^(x${signed(-h)})${signed(k)}`, `y=${k}`, bi('Find the horizontal asymptote.', `y=${base}^x의 수평점근선 y=0을 위아래로 ${k}만큼 이동하므로 y=${k}입니다.`, `The vertical shift moves y=0 to y=${k}.`));
  return make('로그함수 그래프의 수직점근선을 구하세요.', `y=log_${base}(x${signed(-h)})${signed(k)}`, `x=${h}`, bi('Find the vertical asymptote.', `로그의 진수가 0이 되는 경계 x=${h}가 수직점근선입니다.`, `The logarithm's boundary occurs at x=${h}.`));
}

function trigonometricGraphs(random) {
  const amplitude = ri(random, 2, 6); const frequency = pick(random, [1, 2, 3, 4]); const mode = random() < 0.5;
  if (mode) return make('삼각함수의 진폭을 구하세요.', `y=${amplitude}sin(${frequency}x)`, amplitude, bi('Find the amplitude.', `sin 앞 계수의 절댓값이 진폭이므로 ${amplitude}입니다.`, `The amplitude is the absolute value of the coefficient: ${amplitude}.`));
  const period = frequency === 1 ? '2π' : frequency === 2 ? 'π' : `2π/${frequency}`;
  return make('삼각함수의 주기를 구하세요.', `y=${amplitude}cos(${frequency}x)`, period, bi('Find the period.', `주기는 2π/${frequency}=${period}입니다.`, `The period is 2π/${frequency}=${period}.`));
}

function trigonometricIdentities(random) {
  const [opposite, adjacent, hypotenuse] = pick(random, [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]]);
  if (random() < 0.5) return make('θ가 제1사분면의 각일 때 cos θ를 구하세요.', `sin θ=${opposite}/${hypotenuse}`, frac(adjacent, hypotenuse), bi('Find cos θ in Quadrant I.', `sin²θ+cos²θ=1이고 제1사분면이므로 cos θ=${adjacent}/${hypotenuse}입니다.`, `Use sin²θ+cos²θ=1 and the positive Quadrant I value.`));
  return make('θ가 제1사분면의 각일 때 tan θ를 구하세요.', `cos θ=${adjacent}/${hypotenuse}`, frac(opposite, adjacent), bi('Find tan θ in Quadrant I.', `직각삼각형에서 마주보는 변은 ${opposite}, 이웃한 변은 ${adjacent}이므로 tan θ=${opposite}/${adjacent}입니다.`, `The opposite and adjacent legs give tan θ=${opposite}/${adjacent}.`));
}

function inverseTrigEquations(random) {
  const entries = [['1/2', 30], ['√2/2', 45], ['√3/2', 60], ['0', 0], ['1', 90]]; const [value, angle] = pick(random, entries);
  return make('주어진 범위에서 삼각방정식의 해를 구하세요.', `sin θ=${value}, −90°≤θ≤90°`, `${angle}°`, bi('Solve the trigonometric equation on the given interval.', `arcsin(${value})=${angle}°이고 주어진 범위에서 해는 ${angle}°입니다.`, `The principal inverse-sine value is ${angle}°.`));
}

// Ch4 Analytic Trigonometry, split into one unit per technique: the existing
// trigonometricIdentities() above only converts one ratio to another via the Pythagorean identity.
function trigVerifyIdentity(random) {
  const [opp, adj, hyp] = pick(random, [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]]);
  const ask = pick(random, ['sec-sin', 'csc-cos', 'one-minus-sin-sq']);
  if (ask === 'sec-sin') {
    const ans = frac(opp, adj);
    return make('삼각함수의 기본 항등식을 이용하여 값을 구하세요.', `sinθ=${opp}/${hyp}, cosθ=${adj}/${hyp}일 때, secθ·sinθ`, ans, bi('Use fundamental identities to simplify and evaluate.', `secθ·sinθ=tanθ=${opp}/${adj}=${ans}입니다.`, `secθ·sinθ=tanθ=${opp}/${adj}=${ans}.`));
  }
  if (ask === 'csc-cos') {
    const ans = frac(adj, opp);
    return make('삼각함수의 기본 항등식을 이용하여 값을 구하세요.', `sinθ=${opp}/${hyp}, cosθ=${adj}/${hyp}일 때, cscθ·cosθ`, ans, bi('Use fundamental identities to simplify and evaluate.', `cscθ·cosθ=cotθ=${adj}/${opp}=${ans}입니다.`, `cscθ·cosθ=cotθ=${adj}/${opp}=${ans}.`));
  }
  const ans = frac(adj * adj, hyp * hyp);
  return make('피타고라스 항등식을 이용하여 값을 구하세요.', `sinθ=${opp}/${hyp}일 때, 1−sin²θ`, ans, bi('Use the Pythagorean identity.', `1−sin²θ=cos²θ=(${adj}/${hyp})²=${ans}입니다.`, `1−sin²θ=cos²θ=(${adj}/${hyp})²=${ans}.`));
}

function trigSumDifference(random) {
  const table = [
    { deg: 15, label: 'sin', decomp: '45°−30°', value: '(√6−√2)/4' },
    { deg: 15, label: 'cos', decomp: '45°−30°', value: '(√6+√2)/4' },
    { deg: 75, label: 'sin', decomp: '45°+30°', value: '(√6+√2)/4' },
    { deg: 75, label: 'cos', decomp: '45°+30°', value: '(√6−√2)/4' },
    { deg: 105, label: 'sin', decomp: '60°+45°', value: '(√6+√2)/4' },
    { deg: 105, label: 'cos', decomp: '60°+45°', value: '(√2−√6)/4' },
  ];
  const entry = pick(random, table);
  return make('덧셈정리를 이용하여 삼각비의 값을 구하세요.', `${entry.label} ${entry.deg}°`, entry.value, bi('Use the sum/difference identity to find the exact value.', `${entry.deg}°=${entry.decomp}로 분해하여 덧셈정리를 적용하면 ${entry.value}입니다.`, `Decomposing ${entry.deg}°=${entry.decomp} and applying the sum/difference identity gives ${entry.value}.`));
}

function trigDoubleAngle(random) {
  const [opp, adj, hyp] = pick(random, [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]]);
  const quadrant = pick(random, ['I', 'II']);
  const cosSign = quadrant === 'I' ? 1 : -1;
  const ans = frac(2 * opp * cosSign * adj, hyp * hyp);
  const quadKo = quadrant === 'I' ? '제1사분면' : '제2사분면';
  const cosStr = `${cosSign > 0 ? '' : '−'}${adj}/${hyp}`;
  return make('배각공식을 이용하여 sin2θ의 값을 구하세요.', `θ가 ${quadKo}의 각이고 sinθ=${opp}/${hyp}`, ans, bi('Use the double-angle formula.', `cosθ=${cosStr}이므로 sin2θ=2sinθcosθ=${ans}입니다.`, `cosθ=${cosStr}, so sin2θ=2sinθcosθ=${ans}.`));
}

function trigProductToSum(random) {
  const table = [
    { formula: '2sin45°cos15°', rule: '2sinAcosB=sin(A+B)+sin(A−B)', calc: 'sin60°+sin30°', value: '(√3+1)/2' },
    { formula: '2cos45°sin15°', rule: '2cosAsinB=sin(A+B)−sin(A−B)', calc: 'sin60°−sin30°', value: '(√3−1)/2' },
    { formula: '2cos45°cos15°', rule: '2cosAcosB=cos(A−B)+cos(A+B)', calc: 'cos30°+cos60°', value: '(√3+1)/2' },
    { formula: '2sin45°sin15°', rule: '2sinAsinB=cos(A−B)−cos(A+B)', calc: 'cos30°−cos60°', value: '(√3−1)/2' },
  ];
  const entry = pick(random, table);
  return make('곱을 합으로 바꾸는 공식을 이용하여 값을 구하세요.', entry.formula, entry.value, bi('Use the product-to-sum identity.', `${entry.rule} 공식에 의해 ${entry.formula}=${entry.calc}=${entry.value}입니다.`, `By ${entry.rule}, ${entry.formula}=${entry.calc}=${entry.value}.`));
}

function polarCoordinates(random) {
  const radius = ri(random, 2, 8); const [angle, xFactor, yFactor] = pick(random, [[0, 1, 0], [90, 0, 1], [180, -1, 0], [270, 0, -1]]);
  return make('극좌표를 직교좌표로 나타내세요.', `(r,θ)=(${radius},${angle}°)`, `${radius * xFactor},${radius * yFactor}`, bi('Convert the polar point to rectangular coordinates.', `x=r cosθ=${radius * xFactor}, y=r sinθ=${radius * yFactor}입니다.`, `Use x=r cosθ and y=r sinθ.`));
}

function parametricFunctions(random) {
  const x0 = ri(random, -5, 5); const y0 = ri(random, -5, 5); const vx = nz(random, -4, 4); const vy = nz(random, -4, 4); const time = ri(random, 1, 5);
  return make('매개변수로 나타낸 점의 좌표를 구하세요.', `x=${x0}${signed(vx)}t, y=${y0}${signed(vy)}t, t=${time}`, `${x0 + vx * time},${y0 + vy * time}`, bi('Find the point defined parametrically at the given t.', `t=${time}를 두 식에 대입하면 (${x0 + vx * time},${y0 + vy * time})입니다.`, `Substitute t=${time} into both equations.`));
}

// Ch6 Parametric Equations & Polar Coordinates, split into one unit per technique.
function parametricEliminate(random) {
  const h = nz(random, -4, 4); const k = nz(random, -6, 6); const a = pick(random, [1, 2, -1, -2]);
  const xVal = nz(random, -5, 5);
  const t = xVal - h;
  const yVal = a * t * t + k;
  return make('매개변수를 소거하여 직교방정식을 구하고, 주어진 x에서 y를 구하세요.', `x=t${signed(h)}, y=${a}t^2${signed(k)}, x=${xVal}일 때 y=?`, yVal, bi('Eliminate the parameter, then evaluate.', `t=x${signed(-h)}이므로 y=${a}(x${signed(-h)})^2${signed(k)}이고, x=${xVal}일 때 y=${yVal}입니다.`, `Since t=x${signed(-h)}, y=${a}(x${signed(-h)})²${signed(k)}; at x=${xVal}, y=${yVal}.`));
}

function projectileMotion(random) {
  const g = 10;
  const angle = pick(random, [30, 90]);
  const sinTheta = angle === 30 ? 0.5 : 1;
  const vSinTheta = pick(random, [10, 20, 30, 40]);
  const v = vSinTheta / sinTheta;
  if (random() < 0.5) {
    const T = (2 * vSinTheta) / g;
    return make('발사체의 비행 시간을 구하세요.', `초기 속력 v=${v}m/s, 발사각 ${angle}°, g=10m/s²`, T, bi('Find the time of flight.', `T=2v sinθ/g=2×${v}×sin${angle}°/10=${T}초입니다.`, `T=2v sinθ/g=2×${v}×sin${angle}°/10=${T} s.`));
  }
  const H = (vSinTheta * vSinTheta) / (2 * g);
  return make('발사체의 최대 높이를 구하세요.', `초기 속력 v=${v}m/s, 발사각 ${angle}°, g=10m/s²`, H, bi('Find the maximum height.', `H=(v sinθ)²/(2g)=(${vSinTheta})²/20=${H}m입니다.`, `H=(v sinθ)²/(2g)=(${vSinTheta})²/20=${H} m.`));
}

function polarGraphIdentify(random) {
  const mode = ri(random, 0, 3);
  const labelsKo = ['원', '카디오이드', '장미 곡선', '연주형(레먼니스케이트)'];
  const labelsEn = ['circle', 'cardioid', 'rose curve', 'lemniscate'];
  const a = ri(random, 2, 6);
  const k = pick(random, [2, 3, 4, 5]);
  const equations = [`r=${a}`, `r=${a}(1+cosθ)`, `r=${a}cos(${k}θ)`, `r^2=${a * a}cos(2θ)`];
  return make('극방정식이 나타내는 곡선의 종류를 고르세요.', equations[mode], mode + 1, bi('Identify the curve represented by the polar equation.', `극방정식의 형태를 비교하면 ${labelsKo[mode]}입니다.`, `Comparing the form of the equation identifies a ${labelsEn[mode]}.`, choice(labelsKo, labelsEn)));
}

function complexPolarDeMoivre(random) {
  const pool = [
    { base: '1+i', rSq: 2, thetaDeg: 45, n: 4 }, { base: '1+i', rSq: 2, thetaDeg: 45, n: 8 },
    { base: '√3+i', rSq: 4, thetaDeg: 30, n: 6 }, { base: '√3+i', rSq: 4, thetaDeg: 30, n: 3 },
    { base: '-1+i', rSq: 2, thetaDeg: 135, n: 4 }, { base: '1+√3i', rSq: 4, thetaDeg: 60, n: 3 },
  ];
  const { base, rSq, thetaDeg, n } = pick(random, pool);
  const rPow = Math.round(rSq ** (n / 2));
  const angle = (((thetaDeg * n) % 360) + 360) % 360;
  let ans;
  if (angle === 0) ans = `${rPow}`;
  else if (angle === 180) ans = `${-rPow}`;
  else if (angle === 90) ans = `${rPow}i`;
  else ans = `-${rPow}i`;
  return make('드무아브르 정리를 이용하여 값을 구하세요.', `(${base})^${n}`, ans, bi("Use De Moivre's Theorem.", `극형식으로 나타내면 r^${n}(cos${n}θ+isin${n}θ)이고 계산하면 ${ans}입니다.`, `Converting to polar form and applying De Moivre's Theorem gives ${ans}.`));
}

function conicSections(random) {
  const mode = ri(random, 0, 2); const labelsKo = ['포물선', '타원', '쌍곡선']; const labelsEn = ['parabola', 'ellipse', 'hyperbola'];
  const [ellipseA, ellipseB] = pick(random, [[25, 9], [16, 9], [25, 16]]); const [hyperbolaA, hyperbolaB] = pick(random, [[16, 9], [9, 4], [25, 9]]);
  const equations = [`y^2=${ri(random, 2, 8)}x`, `x^2/${ellipseA}+y^2/${ellipseB}=1`, `x^2/${hyperbolaA}−y^2/${hyperbolaB}=1`];
  return make('방정식이 나타내는 이차곡선을 고르세요.', equations[mode], mode + 1, bi('Identify the conic represented by the equation.', `표준형을 비교하면 ${labelsKo[mode]}입니다.`, `Comparing with standard forms identifies a ${labelsEn[mode]}.`, choice(labelsKo, labelsEn)));
}

// Ch7 Analytic Geometry, split into one unit per conic (translated standard forms) plus a
// general-to-standard-form (completing the square) unit — the existing conicSections() above only
// identifies the conic TYPE from an origin-centered equation, none of these read off actual
// features (vertex/focus/directrix, foci/vertices/eccentricity, foci/vertices/asymptotes) or
// require completing the square.
function parabolaFeatures(random) {
  const h = nz(random, -5, 5); const k = nz(random, -5, 5); const p = pick(random, [-3, -2, -1, 1, 2, 3]);
  const vertical = random() < 0.5;
  const eq = vertical ? `(x${signed(-h)})^2=${4 * p}(y${signed(-k)})` : `(y${signed(-k)})^2=${4 * p}(x${signed(-h)})`;
  const ask = pick(random, ['vertex', 'focus', 'directrix']);
  if (ask === 'vertex') {
    return make('포물선의 꼭짓점을 구하세요.', eq, `${h},${k}`, bi('Find the vertex of the parabola.', `표준형에서 꼭짓점은 (${h},${k})입니다.`, `From the standard form, the vertex is (${h},${k}).`));
  }
  if (ask === 'focus') {
    const focus = vertical ? `${h},${k + p}` : `${h + p},${k}`;
    return make('포물선의 초점을 구하세요.', eq, focus, bi('Find the focus of the parabola.', `p=${p}이므로 초점은 (${focus})입니다.`, `Since p=${p}, the focus is (${focus}).`));
  }
  const directrix = vertical ? `y=${k - p}` : `x=${h - p}`;
  return make('포물선의 준선을 구하세요.', eq, directrix, bi('Find the directrix of the parabola.', `p=${p}이므로 준선은 ${directrix}입니다.`, `Since p=${p}, the directrix is ${directrix}.`));
}

function ellipseFeaturesTranslated(random) {
  const h = nz(random, -5, 5); const k = nz(random, -5, 5);
  const [a, b, c] = pick(random, [[5, 4, 3], [13, 12, 5], [10, 8, 6], [15, 12, 9], [17, 15, 8]]);
  const eq = `(x${signed(-h)})^2/${a * a}+(y${signed(-k)})^2/${b * b}=1`;
  const ask = pick(random, ['foci', 'vertices', 'eccentricity']);
  if (ask === 'foci') {
    return make('타원의 두 초점을 구하세요.', eq, `(${h - c},${k}),(${h + c},${k})`, bi('Find the two foci of the ellipse.', `c²=a²−b²=${a * a}−${b * b}=${c * c}이므로 c=${c}, 초점은 (${h - c},${k})와 (${h + c},${k})입니다.`, `c²=a²−b²=${c * c}, so c=${c}; the foci are (${h - c},${k}) and (${h + c},${k}).`));
  }
  if (ask === 'vertices') {
    return make('타원의 장축 위의 두 꼭짓점을 구하세요.', eq, `(${h - a},${k}),(${h + a},${k})`, bi('Find the two vertices on the major axis.', `장축의 반이 a=${a}이므로 꼭짓점은 (${h - a},${k})와 (${h + a},${k})입니다.`, `The semi-major axis is a=${a}, so the vertices are (${h - a},${k}) and (${h + a},${k}).`));
  }
  const e = frac(c, a);
  return make('타원의 이심률을 구하세요.', eq, e, bi('Find the eccentricity of the ellipse.', `c²=a²−b²=${c * c}이므로 c=${c}이고, 이심률 e=c/a=${e}입니다.`, `c²=a²−b²=${c * c} gives c=${c}, so the eccentricity is e=c/a=${e}.`));
}

function hyperbolaFeaturesTranslated(random) {
  const h = nz(random, -5, 5); const k = nz(random, -5, 5);
  const [a, b, c] = pick(random, [[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [9, 12, 15]]);
  const eq = `(x${signed(-h)})^2/${a * a}−(y${signed(-k)})^2/${b * b}=1`;
  const ask = pick(random, ['foci', 'vertices', 'asymptotes']);
  if (ask === 'foci') {
    return make('쌍곡선의 두 초점을 구하세요.', eq, `(${h - c},${k}),(${h + c},${k})`, bi('Find the two foci of the hyperbola.', `c²=a²+b²=${a * a}+${b * b}=${c * c}이므로 c=${c}, 초점은 (${h - c},${k})와 (${h + c},${k})입니다.`, `c²=a²+b²=${c * c}, so c=${c}; the foci are (${h - c},${k}) and (${h + c},${k}).`));
  }
  if (ask === 'vertices') {
    return make('쌍곡선의 두 꼭짓점을 구하세요.', eq, `(${h - a},${k}),(${h + a},${k})`, bi('Find the two vertices of the hyperbola.', `a=${a}이므로 꼭짓점은 (${h - a},${k})와 (${h + a},${k})입니다.`, `Since a=${a}, the vertices are (${h - a},${k}) and (${h + a},${k}).`));
  }
  const slope = frac(b, a);
  return make('쌍곡선의 점근선을 구하세요.', eq, `y${signed(-k)}=±${slope}(x${signed(-h)})`, bi('Find the asymptotes of the hyperbola.', `점근선은 y−k=±(b/a)(x−h) 꼴이므로 y${signed(-k)}=±${slope}(x${signed(-h)})입니다.`, `The asymptotes have the form y−k=±(b/a)(x−h): y${signed(-k)}=±${slope}(x${signed(-h)}).`));
}

function conicGeneralForm(random) {
  const h = nz(random, -4, 4); const k = nz(random, -4, 4);
  const a = ri(random, 2, 5); let b = ri(random, 2, 5);
  while (b === a) b = ri(random, 2, 5);
  const A = b * b; const C = a * a;
  const D = -2 * b * b * h; const E = -2 * a * a * k; const F = b * b * h * h + a * a * k * k - a * a * b * b;
  const eq = `${A}x^2+${C}y^2${signed(D)}x${signed(E)}y${signed(F)}=0`;
  if (random() < 0.5) {
    return make('완전제곱식으로 고쳐 타원의 중심을 구하세요.', eq, `${h},${k}`, bi('Complete the square to find the center of the ellipse.', `x, y에 대해 완전제곱식으로 고치면 (x${signed(-h)})²/${a * a}+(y${signed(-k)})²/${b * b}=1이 되어 중심은 (${h},${k})입니다.`, `Completing the square gives (x${signed(-h)})²/${a * a}+(y${signed(-k)})²/${b * b}=1, so the center is (${h},${k}).`));
  }
  return make('완전제곱식으로 고쳐 장축 반지름의 제곱(a²)을 구하세요.', eq, a * a, bi('Complete the square to find a² (semi-major axis squared).', `완전제곱식으로 고치면 (x${signed(-h)})²/${a * a}+(y${signed(-k)})²/${b * b}=1이 되므로 a²=${a * a}입니다.`, `Completing the square gives (x${signed(-h)})²/${a * a}+(y${signed(-k)})²/${b * b}=1, so a²=${a * a}.`));
}

// Ch8 Discrete Mathematics, split into one unit per sub-topic. The existing arithmetic/geometric
// sequence units (secondaryAlgebraEngine.js `sequences`, algebraCompletionEngine.js
// `geometric-sequences`) already cover the precalculus profile for basic term/finite-sum
// questions, so these focus on techniques those don't touch: recursive definitions, solving the
// series formula for n, infinite geometric series, counting principle/permutations, and
// probability with/without replacement (permutations-combinations and conditional-probability
// exist elsewhere but aren't on the precalculus profile).
function sequenceRecursive(random) {
  const a1 = nz(random, -8, 8);
  if (random() < 0.5) {
    const k = ri(random, 4, 8);
    const d = nz(random, -5, 5);
    const ak = a1 + (k - 1) * d;
    return make('점화식으로 정의된 수열의 항을 구하세요.', `a_1=${a1}, a_n=a_(n-1)${signed(d)} (n≥2)일 때 a_${k}`, ak, bi('Find the term defined by the recursive rule.', `등차수열이므로 a_${k}=a_1+${k - 1}×(${d})=${ak}입니다.`, `This is arithmetic, so a_${k}=a_1+${k - 1}×(${d})=${ak}.`));
  }
  const k = ri(random, 3, 5);
  const r = pick(random, [-3, -2, 2, 3]);
  const ak = a1 * r ** (k - 1);
  return make('점화식으로 정의된 수열의 항을 구하세요.', `a_1=${a1}, a_n=${r}×a_(n-1) (n≥2)일 때 a_${k}`, ak, bi('Find the term defined by the recursive rule.', `등비수열이므로 a_${k}=a_1×${r}^${k - 1}=${ak}입니다.`, `This is geometric, so a_${k}=a_1×${r}^${k - 1}=${ak}.`));
}

function arithmeticSeriesFindN(random) {
  const a1 = nz(random, -6, 6);
  const d = ri(random, 1, 5);
  const n = ri(random, 5, 15);
  const Sn = n * (2 * a1 + (n - 1) * d) / 2;
  return make('등차수열의 합을 이용하여 항의 개수 n을 구하세요.', `첫째항 ${a1}, 공차 ${d}인 등차수열의 첫 n항의 합이 ${Sn}`, n, bi('Use the arithmetic series sum formula to find n.', `S_n=n/2(2a_1+(n-1)d) 공식에 대입해 정리하면 n=${n}입니다.`, `Substituting into S_n=n/2(2a_1+(n-1)d) and solving gives n=${n}.`));
}

function infiniteGeometricSeries(random) {
  const [rNum, rDen] = pick(random, [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [-1, 2], [-1, 3], [-2, 3]]);
  const a1 = nz(random, -6, 6);
  const S = frac(a1 * rDen, rDen - rNum);
  const rStr = frac(rNum, rDen);
  return make('무한등비급수의 합을 구하세요.', `첫째항 ${a1}, 공비 ${rStr}인 무한등비급수`, S, bi('Find the sum of the infinite geometric series.', `|r|<1이므로 S=a_1/(1−r)=${a1}/(1−(${rStr}))=${S}입니다.`, `Since |r|<1, S=a_1/(1−r)=${a1}/(1−(${rStr}))=${S}.`));
}

function countingPermutations(random) {
  if (random() < 0.5) {
    const counts = [ri(random, 2, 4), ri(random, 2, 5), ri(random, 2, 4)];
    const total = counts[0] * counts[1] * counts[2];
    return make('곱의 법칙을 이용하여 전체 경우의 수를 구하세요.', `각 단계에서 ${counts[0]}가지, ${counts[1]}가지, ${counts[2]}가지 선택이 가능할 때 전체 경우의 수`, total, bi('Use the Fundamental Counting Principle.', `각 단계의 경우의 수를 곱하면 ${counts[0]}×${counts[1]}×${counts[2]}=${total}입니다.`, `Multiply the choices at each stage: ${counts[0]}×${counts[1]}×${counts[2]}=${total}.`));
  }
  const n = ri(random, 4, 8);
  const r = ri(random, 2, n - 1);
  let nPr = 1;
  for (let i = 0; i < r; i += 1) nPr *= (n - i);
  return make('순열의 수를 구하세요.', `_${n}P_${r}`, nPr, bi('Find the number of permutations.', `_${n}P_${r}=${n}!/(${n}−${r})!=${nPr}입니다.`, `_${n}P_${r}=${n}!/(${n}-${r})!=${nPr}.`));
}

function probabilityEvents(random) {
  const red = ri(random, 3, 6);
  const blue = ri(random, 3, 6);
  const total = red + blue;
  if (random() < 0.5) {
    const p = frac(red * (red - 1), total * (total - 1));
    return make('비복원추출로 공을 2개 꺼낼 때 확률을 구하세요.', `빨간 공 ${red}개, 파란 공 ${blue}개 중 2개를 비복원으로 꺼낼 때, 둘 다 빨간 공일 확률`, p, bi('Find the probability without replacement.', `P=${red}/${total}×${red - 1}/${total - 1}=${p}입니다.`, `P=${red}/${total}×${red - 1}/${total - 1}=${p}.`));
  }
  const p = frac(red * red, total * total);
  return make('복원추출로 공을 2번 꺼낼 때 확률을 구하세요.', `빨간 공 ${red}개, 파란 공 ${blue}개 중 복원으로 2번 꺼낼 때, 둘 다 빨간 공일 확률`, p, bi('Find the probability with replacement (independent events).', `P=(${red}/${total})²=${p}입니다.`, `P=(${red}/${total})²=${p}.`));
}

function vectorOperations(random) {
  const [x, y, magnitude] = pick(random, [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]]); const signX = pick(random, [-1, 1]); const signY = pick(random, [-1, 1]);
  if (random() < 0.5) return make('벡터의 크기를 구하세요.', `v=⟨${signX * x},${signY * y}⟩`, magnitude, bi('Find the magnitude of the vector.', `|v|=√(${x}²+${y}²)=${magnitude}입니다.`, `Use |v|=√(x²+y²)=${magnitude}.`));
  const a = [signX * x, signY * y]; const b = [ri(random, -4, 4), ri(random, -4, 4)];
  return make('두 벡터의 내적을 구하세요.', `⟨${a[0]},${a[1]}⟩·⟨${b[0]},${b[1]}⟩`, a[0] * b[0] + a[1] * b[1], bi('Find the dot product.', `대응 성분을 곱해 더하면 ${a[0] * b[0] + a[1] * b[1]}입니다.`, `Multiply corresponding components and add.`));
}

function transformationMatrices(random) {
  const x = nz(random, -6, 6); const y = nz(random, -6, 6); const mode = ri(random, 0, 2);
  const matrices = ['[−1,0;0,1]', '[1,0;0,−1]', '[0,−1;1,0]']; const results = [[-x, y], [x, -y], [-y, x]];
  return make('행렬로 점을 변환한 결과를 구하세요.', `${matrices[mode]}[${x};${y}]`, `${results[mode][0]},${results[mode][1]}`, bi('Apply the transformation matrix to the point.', `행과 열의 내적을 계산하면 (${results[mode][0]},${results[mode][1]})입니다.`, `Row-column multiplication gives (${results[mode][0]},${results[mode][1]}).`));
}

// Ch1 Polynomial & Rational Functions: Remainder Theorem (evaluate f(a) without direct long
// division) and Factor Theorem (find the coefficient making (x-a) a factor).
function polynomialTheorems(random) {
  const a = nz(random, -4, 4);
  if (random() < 0.5) {
    const b = nz(random, -5, 5); const c = nz(random, -5, 5); const d = nz(random, -5, 5);
    const remainder = a ** 3 + b * a ** 2 + c * a + d;
    return make('나머지 정리를 이용하여 다항식을 (x−a) 꼴로 나눈 나머지를 구하세요.', `f(x)=x^3${signed(b)}x^2${signed(c)}x${signed(d)}, (x${signed(-a)})로 나눈 나머지는?`, remainder, bi('Use the Remainder Theorem to find the remainder.', `나머지 정리에 의해 나머지는 f(${a})=${remainder}입니다.`, `By the Remainder Theorem, the remainder equals f(${a})=${remainder}.`));
  }
  const b = nz(random, -5, 5); const k = nz(random, -6, 6);
  const d = -(a ** 3 + b * a ** 2 + k * a);
  return make('인수정리를 이용하여 (x−a)가 다항식의 인수가 되도록 하는 상수 k를 구하세요.', `f(x)=x^3${signed(b)}x^2+kx${signed(d)}, (x${signed(-a)})가 f(x)의 인수`, k, bi('Use the Factor Theorem to find k.', `인수정리에 의해 f(${a})=0이어야 하므로 방정식을 풀면 k=${k}입니다.`, `By the Factor Theorem, f(${a})=0, which solves to k=${k}.`));
}

// Ch5 Applications of Trigonometry: Law of Cosines (SAS -> missing side) and the ½ab·sinC area
// formula (kept to angles with a clean rational sine so the area is exact).
function lawOfSinesCosines(random) {
  if (random() < 0.5) {
    const pool = [
      { a: 3, b: 8, C: 60, c: 7 }, { a: 5, b: 8, C: 60, c: 7 }, { a: 3, b: 5, C: 120, c: 7 }, { a: 7, b: 8, C: 120, c: 13 },
      { a: 3, b: 4, C: 90, c: 5 }, { a: 6, b: 8, C: 90, c: 10 }, { a: 5, b: 12, C: 90, c: 13 }, { a: 9, b: 12, C: 90, c: 15 },
    ];
    const { a, b, C, c } = pick(random, pool);
    return make('코사인 법칙을 이용하여 변의 길이를 구하세요.', `삼각형에서 a=${a}, b=${b}, ∠C=${C}°, c=?`, c, bi('Use the Law of Cosines to find side c.', `c²=a²+b²−2ab·cosC 공식에 대입하면 c=${c}입니다.`, `Substitute into c²=a²+b²−2ab·cosC to get c=${c}.`));
  }
  const a = ri(random, 4, 12); const b = ri(random, 4, 12);
  const [angle, denom] = pick(random, [[30, 4], [90, 2]]);
  const area = frac(a * b, denom);
  return make('사인법칙의 넓이 공식을 이용하여 삼각형의 넓이를 구하세요.', `삼각형에서 a=${a}, b=${b}, ∠C=${angle}°`, area, bi('Find the area using ½ab·sinC.', `넓이=½ab sinC 공식에 대입하면 ${area}입니다.`, `Using Area=½ab·sinC gives ${area}.`));
}

// Ch2 Exponential & Logarithmic Functions: solving by matching bases, and rewriting a log
// equation in exponential form.
function exponentialEquationSolving(random) {
  const base = pick(random, [2, 3, 5]);
  if (random() < 0.5) {
    const x = nz(random, -5, 5);
    const m = nz(random, -3, 3);
    const c1 = nz(random, -6, 6);
    const c2 = m * x + c1;
    return make('밑을 같게 하여 지수방정식을 푸세요.', `${base}^(${m}x${signed(c1)})=${base}^${c2}`, x, bi('Solve by equating exponents (same base).', `밑이 같으므로 지수를 비교하면 ${m}x${signed(c1)}=${c2}이고, 이를 풀면 x=${x}입니다.`, `Since the bases match, equate exponents: ${m}x${signed(c1)}=${c2}, giving x=${x}.`));
  }
  const k = ri(random, 1, 4);
  const x = base ** k;
  return make('로그방정식을 지수형으로 바꾸어 푸세요.', `log_${base}(x)=${k}`, x, bi('Rewrite in exponential form and solve.', `log_${base}(x)=${k}는 x=${base}^${k}=${x}와 같습니다.`, `log_${base}(x)=${k} means x=${base}^${k}=${x}.`));
}

const unit = (id, category, label, enLabel, description, enDescription, profiles, generator) => ({ id, category, label, description, en: [enLabel, enDescription], profiles, make: generator });

export const PRECALCULUS_UNITS = [
  unit('precalc-polynomial-end-behavior', '함수', '다항함수의 끝 행동', 'Polynomial end behavior', '차수와 최고차항으로 그래프의 끝 행동 판단', 'Analyze polynomial end behavior', [PC], polynomialEndBehavior),
  unit('precalc-rational-features', '함수', '유리함수의 점근선과 구멍', 'Rational function features', '수직·수평점근선과 제거 가능한 불연속', 'Find asymptotes and holes', [PC], rationalFeatures),
  unit('precalc-polynomial-theorems', '함수', '나머지정리와 인수정리', 'Remainder & Factor Theorems', '직접 나눗셈 없이 나머지와 인수 조건 구하기', 'Apply the Remainder and Factor Theorems', [PC], polynomialTheorems),
  unit('precalc-exp-log-transformations', '지수와 로그', '지수·로그함수의 그래프 변환', 'Exponential & logarithmic transformations', '평행이동과 점근선', 'Analyze transformations and asymptotes', [PC, H2A], exponentialLogTransformations),
  unit('precalc-exponential-equations', '지수와 로그', '지수방정식과 로그방정식', 'Exponential & logarithmic equations', '밑을 같게 하거나 지수형으로 바꾸어 풀기', 'Solve by matching bases or rewriting in exponential form', [PC, H2A], exponentialEquationSolving),
  unit('precalc-trig-graphs', '삼각함수', '삼각함수 그래프', 'Trigonometric graphs', '진폭·주기와 그래프 변환', 'Analyze amplitude and period', [PC, H2A], trigonometricGraphs),
  unit('precalc-trig-identities', '삼각함수', '삼각함수의 관계', 'Trigonometric identities', '기본 항등식과 삼각비 사이의 관계', 'Use fundamental trigonometric identities', [PC, H2A], trigonometricIdentities),
  unit('precalc-inverse-trig', '삼각함수', '역삼각함수와 삼각방정식', 'Inverse trigonometry', '역삼각함수로 삼각방정식 해결', 'Solve equations using inverse trigonometric functions', [PC], inverseTrigEquations),
  unit('precalc-trig-verify-identity', '삼각함수', '삼각함수의 기본 항등식 활용', 'Fundamental identity applications', '역수·몫·피타고라스 항등식으로 식 간단히 하기', 'Simplify expressions using reciprocal, quotient and Pythagorean identities', [PC], trigVerifyIdentity),
  unit('precalc-trig-sum-difference', '삼각함수', '삼각함수의 덧셈정리', 'Sum & difference identities', '각을 분해하여 삼각비의 정확한 값 구하기', 'Decompose angles to find exact trigonometric values', [PC], trigSumDifference),
  unit('precalc-trig-double-angle', '삼각함수', '배각공식', 'Double-angle identities', '사분면 조건에서 sin2θ의 값 구하기', 'Find sin2θ given a ratio and quadrant condition', [PC], trigDoubleAngle),
  unit('precalc-trig-product-sum', '삼각함수', '곱을 합으로 바꾸는 공식', 'Product-to-sum identities', '곱 형태의 삼각함수 값을 합으로 바꾸어 계산', 'Convert products of trig functions to sums to evaluate', [PC], trigProductToSum),
  unit('precalc-polar-coordinates', '극좌표와 매개변수', '극좌표', 'Polar coordinates', '극좌표와 직교좌표의 변환', 'Convert between polar and rectangular coordinates', [PC], polarCoordinates),
  unit('precalc-parametric-functions', '극좌표와 매개변수', '매개변수함수', 'Parametric functions', '매개변수로 나타낸 위치와 변화', 'Evaluate parametric functions', [PC], parametricFunctions),
  unit('precalc-parametric-eliminate', '극좌표와 매개변수', '매개변수의 소거', 'Eliminating the parameter', '매개변수를 소거해 직교방정식으로 나타내기', 'Eliminate the parameter to get a rectangular equation', [PC], parametricEliminate),
  unit('precalc-projectile-motion', '극좌표와 매개변수', '매개변수를 이용한 발사체 운동', 'Projectile motion (parametric)', '비행 시간과 최대 높이 구하기', 'Find time of flight and maximum height', [PC], projectileMotion),
  unit('precalc-polar-graph-identify', '극좌표와 매개변수', '극방정식의 그래프', 'Special polar graphs', '카디오이드·장미곡선·연주형 등 극그래프 식별', 'Identify cardioids, rose curves and lemniscates from their equations', [PC], polarGraphIdentify),
  unit('precalc-complex-polar-demoivre', '극좌표와 매개변수', '복소수의 극형식과 드무아브르 정리', 'Complex numbers in polar form', '드무아브르 정리를 이용한 거듭제곱 계산', "Use De Moivre's Theorem to compute powers of complex numbers", [PC], complexPolarDeMoivre),
  unit('precalc-conic-sections', '이차곡선', '원뿔곡선', 'Conic sections', '포물선·타원·쌍곡선의 표준형', 'Identify conic sections from standard equations', [PC, H3G], conicSections),
  unit('precalc-parabola-features', '이차곡선', '포물선의 성질', 'Parabola features', '평행이동된 포물선의 꼭짓점·초점·준선', 'Find the vertex, focus and directrix of a translated parabola', [PC, H3G], parabolaFeatures),
  unit('precalc-ellipse-features', '이차곡선', '타원의 성질', 'Ellipse features', '평행이동된 타원의 초점·꼭짓점·이심률', 'Find the foci, vertices and eccentricity of a translated ellipse', [PC, H3G], ellipseFeaturesTranslated),
  unit('precalc-hyperbola-features', '이차곡선', '쌍곡선의 성질', 'Hyperbola features', '평행이동된 쌍곡선의 초점·꼭짓점·점근선', 'Find the foci, vertices and asymptotes of a translated hyperbola', [PC, H3G], hyperbolaFeaturesTranslated),
  unit('precalc-conic-general-form', '이차곡선', '이차곡선의 일반형과 표준형', 'Conics: general to standard form', '완전제곱식으로 일반형을 표준형으로 바꾸기', 'Complete the square to convert a general conic equation to standard form', [PC, H3G], conicGeneralForm),
  unit('precalc-sequence-recursive', '수열', '점화식으로 정의된 수열', 'Recursively defined sequences', '점화식에서 특정 항의 값 구하기', 'Find a specific term from a recursive rule', [PC], sequenceRecursive),
  unit('precalc-arithmetic-series-find-n', '수열', '등차수열의 합과 항의 개수', 'Arithmetic series: solve for n', '급수 공식을 이용해 항의 개수 구하기', 'Use the series sum formula to find the number of terms', [PC], arithmeticSeriesFindN),
  unit('precalc-infinite-geometric-series', '수열', '무한등비급수', 'Infinite geometric series', '수렴하는 무한등비급수의 합 구하기', 'Find the sum of a convergent infinite geometric series', [PC], infiniteGeometricSeries),
  unit('precalc-counting-permutations', '경우의 수', '경우의 수와 순열', 'Counting principle & permutations', '곱의 법칙과 순열의 수 구하기', 'Apply the counting principle and count permutations', [PC], countingPermutations),
  unit('precalc-probability-events', '확률과 통계', '복원·비복원추출과 확률', 'Probability with/without replacement', '독립·종속시행의 확률 구하기', 'Find probabilities for independent and dependent events', [PC], probabilityEvents),
  unit('precalc-vectors', '벡터', '벡터의 연산', 'Vector operations', '벡터의 크기와 내적', 'Calculate vector magnitudes and dot products', [PC, H3G], vectorOperations),
  unit('precalc-law-of-sines-cosines', '삼각함수', '사인법칙과 코사인법칙', 'Law of Sines & Cosines', '변의 길이와 삼각형의 넓이 구하기', 'Find missing sides and triangle areas', [PC], lawOfSinesCosines),
  unit('precalc-transformation-matrices', '행렬', '변환행렬', 'Transformation matrices', '행렬을 이용한 평면도형의 변환', 'Apply transformation matrices', [PC], transformationMatrices),
];
