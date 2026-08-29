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

function polarCoordinates(random) {
  const radius = ri(random, 2, 8); const [angle, xFactor, yFactor] = pick(random, [[0, 1, 0], [90, 0, 1], [180, -1, 0], [270, 0, -1]]);
  return make('극좌표를 직교좌표로 나타내세요.', `(r,θ)=(${radius},${angle}°)`, `${radius * xFactor},${radius * yFactor}`, bi('Convert the polar point to rectangular coordinates.', `x=r cosθ=${radius * xFactor}, y=r sinθ=${radius * yFactor}입니다.`, `Use x=r cosθ and y=r sinθ.`));
}

function parametricFunctions(random) {
  const x0 = ri(random, -5, 5); const y0 = ri(random, -5, 5); const vx = nz(random, -4, 4); const vy = nz(random, -4, 4); const time = ri(random, 1, 5);
  return make('매개변수로 나타낸 점의 좌표를 구하세요.', `x=${x0}${signed(vx)}t, y=${y0}${signed(vy)}t, t=${time}`, `${x0 + vx * time},${y0 + vy * time}`, bi('Find the point defined parametrically at the given t.', `t=${time}를 두 식에 대입하면 (${x0 + vx * time},${y0 + vy * time})입니다.`, `Substitute t=${time} into both equations.`));
}

function conicSections(random) {
  const mode = ri(random, 0, 2); const labelsKo = ['포물선', '타원', '쌍곡선']; const labelsEn = ['parabola', 'ellipse', 'hyperbola'];
  const [ellipseA, ellipseB] = pick(random, [[25, 9], [16, 9], [25, 16]]); const [hyperbolaA, hyperbolaB] = pick(random, [[16, 9], [9, 4], [25, 9]]);
  const equations = [`y^2=${ri(random, 2, 8)}x`, `x^2/${ellipseA}+y^2/${ellipseB}=1`, `x^2/${hyperbolaA}−y^2/${hyperbolaB}=1`];
  return make('방정식이 나타내는 이차곡선을 고르세요.', equations[mode], mode + 1, bi('Identify the conic represented by the equation.', `표준형을 비교하면 ${labelsKo[mode]}입니다.`, `Comparing with standard forms identifies a ${labelsEn[mode]}.`, choice(labelsKo, labelsEn)));
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

const unit = (id, category, label, enLabel, description, enDescription, profiles, generator) => ({ id, category, label, description, en: [enLabel, enDescription], profiles, make: generator });

export const PRECALCULUS_UNITS = [
  unit('precalc-polynomial-end-behavior', '함수', '다항함수의 끝 행동', 'Polynomial end behavior', '차수와 최고차항으로 그래프의 끝 행동 판단', 'Analyze polynomial end behavior', [PC], polynomialEndBehavior),
  unit('precalc-rational-features', '함수', '유리함수의 점근선과 구멍', 'Rational function features', '수직·수평점근선과 제거 가능한 불연속', 'Find asymptotes and holes', [PC], rationalFeatures),
  unit('precalc-exp-log-transformations', '지수와 로그', '지수·로그함수의 그래프 변환', 'Exponential & logarithmic transformations', '평행이동과 점근선', 'Analyze transformations and asymptotes', [PC, H2A], exponentialLogTransformations),
  unit('precalc-trig-graphs', '삼각함수', '삼각함수 그래프', 'Trigonometric graphs', '진폭·주기와 그래프 변환', 'Analyze amplitude and period', [PC, H2A], trigonometricGraphs),
  unit('precalc-trig-identities', '삼각함수', '삼각함수의 관계', 'Trigonometric identities', '기본 항등식과 삼각비 사이의 관계', 'Use fundamental trigonometric identities', [PC, H2A], trigonometricIdentities),
  unit('precalc-inverse-trig', '삼각함수', '역삼각함수와 삼각방정식', 'Inverse trigonometry', '역삼각함수로 삼각방정식 해결', 'Solve equations using inverse trigonometric functions', [PC], inverseTrigEquations),
  unit('precalc-polar-coordinates', '극좌표와 매개변수', '극좌표', 'Polar coordinates', '극좌표와 직교좌표의 변환', 'Convert between polar and rectangular coordinates', [PC], polarCoordinates),
  unit('precalc-parametric-functions', '극좌표와 매개변수', '매개변수함수', 'Parametric functions', '매개변수로 나타낸 위치와 변화', 'Evaluate parametric functions', [PC], parametricFunctions),
  unit('precalc-conic-sections', '이차곡선', '원뿔곡선', 'Conic sections', '포물선·타원·쌍곡선의 표준형', 'Identify conic sections from standard equations', [PC, H3G], conicSections),
  unit('precalc-vectors', '벡터', '벡터의 연산', 'Vector operations', '벡터의 크기와 내적', 'Calculate vector magnitudes and dot products', [PC, H3G], vectorOperations),
  unit('precalc-transformation-matrices', '행렬', '변환행렬', 'Transformation matrices', '행렬을 이용한 평면도형의 변환', 'Apply transformation matrices', [PC], transformationMatrices),
];
