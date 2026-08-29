const ri = (random, min, max) => Math.floor(random() * (max - min + 1)) + min;
const pick = (random, values) => values[ri(random, 0, values.length - 1)];
const nz = (random, min = -6, max = 6) => { let value; do value = ri(random, min, max); while (!value); return value; };
const signed = (value) => value >= 0 ? `+${value}` : `${value}`;
const make = (prompt, expression, answer, extra = {}) => ({ prompt, expression, answer: String(answer), ...extra });
const bi = (promptEn, explanation, explanationEn, extra = {}) => ({ promptEn, explanation, explanationEn, ...extra });
const choice = (choicesKo, choicesEn = choicesKo) => ({ kind: 'choice', choicesKo, choicesEn });

const C2 = ['kr-high-3-calculus-2'];
const GEO = ['kr-high-3-geometry'];

function sequenceLimit(random) {
  const a = nz(random); const b = ri(random, -8, 8); const c = nz(random); const d = ri(random, -8, 8);
  return make('수열의 극한을 구하세요.', `lim_(n→∞) (${a}n${signed(b)})/(${c}n${signed(d)})`, `${a}/${c}`, bi('Find the limit of the sequence.', `분자와 분모를 n으로 나누면 극한은 최고차항 계수의 비 ${a}/${c}입니다.`, `Divide by n; the limit is the ratio of leading coefficients, ${a}/${c}.`));
}

function geometricSeries(random) {
  const first = nz(random, -8, 8); const denominator = pick(random, [2, 3, 4, 5]); const numerator = pick(random, [-1, 1]);
  const top = first * denominator; const bottom = denominator - numerator;
  return make('무한등비급수의 합을 구하세요.', `${first}+${first}(${numerator}/${denominator})+${first}(${numerator}/${denominator})^2+⋯`, `${top}/${bottom}`, bi('Find the sum of the infinite geometric series.', `|r|<1이므로 S=a/(1−r)=${top}/${bottom}입니다.`, `Because |r|<1, S=a/(1−r)=${top}/${bottom}.`));
}

function expLogDerivative(random) {
  const base = pick(random, [2, 3, 5]); const coefficient = ri(random, 2, 6);
  if (random() < 0.5) return make('함수의 도함수를 구하세요.', `f(x)=e^(${coefficient}x)`, `${coefficient}e^(${coefficient}x)`, bi('Differentiate the function.', `연쇄법칙으로 f′(x)=${coefficient}e^(${coefficient}x)입니다.`, `The chain rule gives f′(x)=${coefficient}e^(${coefficient}x).`));
  return make('함수의 도함수를 구하세요.', `f(x)=log_${base} x`, `1/(x ln ${base})`, bi('Differentiate the function.', `밑이 ${base}인 로그함수의 미분법을 적용합니다.`, `Use d(log_a x)/dx=1/(x ln a).`));
}

function trigDerivative(random) {
  const coefficient = ri(random, 2, 7); const mode = random() < 0.5;
  return mode
    ? make('함수의 도함수를 구하세요.', `f(x)=sin(${coefficient}x)`, `${coefficient}cos(${coefficient}x)`, bi('Differentiate the function.', 'sin과 연쇄법칙을 적용합니다.', 'Apply the sine derivative and chain rule.'))
    : make('함수의 도함수를 구하세요.', `f(x)=cos(${coefficient}x)`, `−${coefficient}sin(${coefficient}x)`, bi('Differentiate the function.', 'cos과 연쇄법칙을 적용합니다.', 'Apply the cosine derivative and chain rule.'));
}

function productQuotientChain(random) {
  const power = ri(random, 2, 5); const shift = nz(random, -5, 5);
  if (random() < 0.5) return make('연쇄법칙을 이용하여 도함수를 구하세요.', `f(x)=(x${signed(shift)})^${power}`, `${power}(x${signed(shift)})^${power - 1}`, bi('Differentiate using the chain rule.', `바깥함수와 안쪽함수를 차례로 미분하면 ${power}(x${signed(shift)})^${power - 1}입니다.`, `Differentiate the outer and inner functions.`));
  return make('곱의 미분법으로 도함수를 구하세요.', `f(x)=x^${power}e^x`, `e^x(x^${power}+${power}x^${power - 1})`, bi('Differentiate using the product rule.', `f′=x^${power}e^x+${power}x^${power - 1}e^x입니다.`, `The product rule gives e^x(x^${power}+${power}x^${power - 1}).`));
}

function implicitDerivative(random) {
  const radius = ri(random, 2, 9); const x = ri(random, 1, radius - 1); const y2 = radius * radius - x * x;
  return make('음함수의 dy/dx를 구하세요.', `x^2+y^2=${radius * radius}`, '−x/y', bi('Find dy/dx by implicit differentiation.', `양변을 x로 미분하면 2x+2y(dy/dx)=0이므로 dy/dx=−x/y입니다.`, `Differentiate implicitly: 2x+2y(dy/dx)=0.`), { note: `예: x=${x}일 때 y²=${y2}` });
}

function substitutionIntegral(random) {
  const coefficient = pick(random, [2, 4, 6, 8]); const shift = nz(random, -6, 6); const power = ri(random, 2, 5);
  return make('치환적분을 이용하여 부정적분을 구하세요.', `∫${coefficient}x(x^2${signed(shift)})^${power} dx`, `${coefficient / (2 * (power + 1))}(x^2${signed(shift)})^${power + 1}+C`, bi('Evaluate the integral using substitution.', `u=x²${signed(shift)}로 놓으면 du=2x dx입니다.`, `Let u=x²${signed(shift)}, so du=2x dx.`));
}

function integrationByParts(random) {
  const coefficient = ri(random, 2, 6);
  return make('부분적분을 이용하여 부정적분을 구하세요.', `∫x e^(${coefficient}x) dx`, `e^(${coefficient}x)(${coefficient}x−1)/${coefficient ** 2}+C`, bi('Evaluate the integral using integration by parts.', `u=x, dv=e^(${coefficient}x)dx로 놓고 ∫u dv=uv−∫v du를 적용합니다.`, `Let u=x and dv=e^(${coefficient}x)dx, then use integration by parts.`));
}

function volumeIntegral(random) {
  const slope = ri(random, 1, 5); const upper = ri(random, 2, 5);
  return make('영역을 x축 둘레로 회전시킨 회전체의 부피를 구하세요.', `y=${slope}x, 0≤x≤${upper}`, `${slope ** 2 * upper ** 3}π/3`, bi('Find the volume of the solid of revolution about the x-axis.', `V=π∫_0^${upper}(${slope}x)²dx=${slope ** 2 * upper ** 3}π/3입니다.`, `Use the disk method: V=π∫[f(x)]²dx.`));
}

function parabolaFocus(random) {
  const p = nz(random, -6, 6);
  return make('포물선의 초점을 구하세요.', `y^2=${4 * p}x`, `${p},0`, bi('Find the focus of the parabola.', `y²=4px의 초점은 (p,0)이므로 (${p},0)입니다.`, `For y²=4px, the focus is (p,0).`));
}

function ellipseFeatures(random) {
  const [a, b, c] = pick(random, [[5, 3, 4], [10, 6, 8], [13, 5, 12]]);
  return make('타원의 두 초점을 구하세요.', `x^2/${a * a}+y^2/${b * b}=1`, `(${-c},0),(${c},0)`, bi('Find the two foci of the ellipse.', `c²=a²−b²이므로 c=${c}, 초점은 (±${c},0)입니다.`, `Since c²=a²−b², the foci are (±${c},0).`));
}

function hyperbolaAsymptotes(random) {
  const a = ri(random, 2, 6); const b = ri(random, 2, 6);
  return make('쌍곡선의 점근선을 구하세요.', `x^2/${a * a}−y^2/${b * b}=1`, `y=±${b}/${a}x`, bi('Find the asymptotes of the hyperbola.', `표준형 x²/a²−y²/b²=1의 점근선은 y=±(b/a)x입니다.`, `For x²/a²−y²/b²=1, the asymptotes are y=±(b/a)x.`));
}

function vectorAngle(random) {
  const mode = pick(random, [0, 1]); const vectors = mode ? [[1, 0], [0, 1]] : [[1, 1], [1, 1]]; const answer = mode ? '90°' : '0°';
  return make('두 벡터가 이루는 각을 구하세요.', `a=⟨${vectors[0]}⟩, b=⟨${vectors[1]}⟩`, answer, bi('Find the angle between the vectors.', `a·b=|a||b|cosθ를 이용하면 θ=${answer}입니다.`, `Use a·b=|a||b|cosθ to obtain ${answer}.`));
}

function linePlaneRelations(random) {
  const labelsKo = ['평행', '수직', '일치', '어느 것도 아님']; const labelsEn = ['parallel', 'perpendicular', 'coincident', 'neither']; const mode = random() < 0.5 ? 0 : 1;
  const normals = mode === 0 ? ['⟨1,2,−1⟩', '⟨2,4,−2⟩'] : ['⟨1,1,0⟩', '⟨1,−1,0⟩'];
  return make('두 평면의 위치 관계를 고르세요.', `n₁=${normals[0]}, n₂=${normals[1]}`, mode + 1, bi('Choose the relationship between the two planes.', mode === 0 ? '법선벡터가 서로 상수배이므로 평행입니다.' : '법선벡터의 내적이 0이므로 수직입니다.', mode === 0 ? 'The normal vectors are scalar multiples, so the planes are parallel.' : 'The normal vectors have dot product zero, so the planes are perpendicular.', choice(labelsKo, labelsEn)));
}

function spaceCoordinates(random) {
  const a = ri(random, -6, 6); const b = ri(random, -6, 6); const c = ri(random, -6, 6); const dx = ri(random, 1, 5); const dy = ri(random, 1, 5); const dz = ri(random, 1, 5);
  return make('두 점 사이의 거리의 제곱을 구하세요.', `A(${a},${b},${c}), B(${a + dx},${b + dy},${c + dz})`, dx * dx + dy * dy + dz * dz, bi('Find the square of the distance between the points.', `거리의 제곱은 (${dx})²+(${dy})²+(${dz})²=${dx * dx + dy * dy + dz * dz}입니다.`, `Sum the squares of the coordinate differences.`));
}

function sphereEquation(random) {
  const h = ri(random, -5, 5); const k = ri(random, -5, 5); const l = ri(random, -5, 5); const radius = ri(random, 2, 8);
  return make('구의 반지름을 구하세요.', `(x−(${h}))^2+(y−(${k}))^2+(z−(${l}))^2=${radius ** 2}`, radius, bi('Find the radius of the sphere.', `표준형의 우변이 r²=${radius ** 2}이므로 반지름은 ${radius}입니다.`, `The right side is r²=${radius ** 2}, so r=${radius}.`));
}

const unit = (id, category, label, enLabel, description, enDescription, profiles, generator) => ({ id, category, label, description, en: [enLabel, enDescription], profiles, make: generator });

export const KOREAN_HIGH3_UNITS = [
  unit('h3-sequence-limits', '수열의 극한', '수열의 극한', 'Limits of sequences', '수열의 수렴과 발산 및 극한값', 'Evaluate limits of sequences', C2, sequenceLimit),
  unit('h3-infinite-series', '수열의 극한', '급수와 무한등비급수', 'Infinite series', '무한등비급수의 수렴과 합', 'Analyze and sum infinite geometric series', C2, geometricSeries),
  unit('h3-exp-log-derivatives', '미분법', '지수·로그함수의 미분', 'Exponential & logarithmic derivatives', '지수함수와 로그함수의 도함수', 'Differentiate exponential and logarithmic functions', C2, expLogDerivative),
  unit('h3-trig-derivatives', '미분법', '삼각함수의 미분', 'Trigonometric derivatives', '삼각함수와 합성함수의 도함수', 'Differentiate trigonometric functions', C2, trigDerivative),
  unit('h3-advanced-derivative-rules', '미분법', '여러 가지 미분법', 'Advanced derivative rules', '곱·몫·연쇄법칙', 'Use product, quotient and chain rules', C2, productQuotientChain),
  unit('h3-implicit-differentiation', '미분법', '음함수의 미분', 'Implicit differentiation', '음함수 관계에서 도함수 구하기', 'Differentiate implicit relations', C2, implicitDerivative),
  unit('h3-substitution-integration', '적분법', '치환적분법', 'Integration by substitution', '치환을 이용한 부정적분', 'Integrate using substitution', C2, substitutionIntegral),
  unit('h3-integration-by-parts', '적분법', '부분적분법', 'Integration by parts', '곱으로 된 함수의 적분', 'Integrate products by parts', C2, integrationByParts),
  unit('h3-volume-integrals', '적분법', '정적분의 활용', 'Applications of definite integrals', '회전체의 부피 계산', 'Find volumes using definite integrals', C2, volumeIntegral),
  unit('h3-parabola', '이차곡선', '포물선', 'Parabolas', '초점과 준선 및 표준형', 'Use focus, directrix and standard forms', GEO, parabolaFocus),
  unit('h3-ellipse', '이차곡선', '타원', 'Ellipses', '타원의 초점과 표준형', 'Find ellipse features from standard forms', GEO, ellipseFeatures),
  unit('h3-hyperbola', '이차곡선', '쌍곡선', 'Hyperbolas', '쌍곡선의 초점과 점근선', 'Find hyperbola features and asymptotes', GEO, hyperbolaAsymptotes),
  unit('h3-vector-angle', '벡터', '벡터의 내적과 각', 'Vector dot products & angles', '내적으로 두 벡터가 이루는 각 구하기', 'Use dot products to find angles', GEO, vectorAngle),
  unit('h3-lines-planes', '공간도형', '직선과 평면의 위치 관계', 'Lines & planes in space', '법선벡터로 평행과 수직 판단', 'Classify spatial relationships', GEO, linePlaneRelations),
  unit('h3-space-coordinates', '공간도형', '공간좌표와 거리', 'Coordinates in space', '3차원 좌표와 거리', 'Calculate in three-dimensional coordinates', GEO, spaceCoordinates),
  unit('h3-sphere-equations', '공간도형', '구의 방정식', 'Equations of spheres', '중심과 반지름을 이용한 구의 방정식', 'Interpret equations of spheres', GEO, sphereEquation),
];
