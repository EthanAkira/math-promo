// AP Calculus AB/BC — fills genuine gaps left after cross-referencing the source book's standard
// College Board AB/BC unit structure ("Mia's AP Calculus", D:\ap calculus ab&bc, chapters 5-22)
// against the calculus content already built in koreanHigh2Engine.js/koreanHigh3Engine.js.
// Structure/technique only, no source text or problems reproduced — every unit below is a fresh,
// self-authored parameterized generator. Same local helper/unit() shape as koreanHigh2Engine.js
// (generator signature is (random) => problem; language is always dual-authored via bi(), never
// resolved from a profile, since PreAlgebraGenerator.js only ever calls unit.make(random)).
const ri = (random, min, max) => Math.floor(random() * (max - min + 1)) + min;
const pick = (random, values) => values[ri(random, 0, values.length - 1)];
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const frac = (n, d = 1) => {
  if (d < 0) { n = -n; d = -d; } // keep the denominator positive (e.g. "-1/3", never "1/-3")
  const divisor = gcd(n, d) || 1;
  const numerator = n / divisor; const denominator = d / divisor;
  return denominator === 1 ? String(numerator) : `${numerator}/${denominator}`;
};
const signed = (value) => (value >= 0 ? `+${value}` : `${value}`);
const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
const make = (prompt, expression, answer, extra = {}) => ({ prompt, expression, answer: String(answer), ...extra });
const bi = (promptEn, explanation, explanationEn, extra = {}) => ({ promptEn, explanation, explanationEn, ...extra });
const choice = (choicesKo, choicesEn = choicesKo) => ({ kind: 'choice', choicesKo, choicesEn });

// AB-level gaps: three (concavity/optimization/Riemann sums) are genuine Korean 미적분Ⅰ gaps too.
const AB_AND_KR = ['ap-calc-ab', 'ap-calc-bc', 'kr-high-2-calculus-1'];
const AB_ONLY = ['ap-calc-ab', 'ap-calc-bc'];
const BC_ONLY = ['ap-calc-bc'];

function concavitySecondDerivative(random) {
  const a = pick(random, [1, 2, 3]);
  const k = ri(random, -4, 4);
  const b = -3 * a * k;
  const c = ri(random, -5, 5);
  return make(
    '함수 f(x)의 변곡점의 x좌표를 구하세요.',
    `f(x)=${a}x^3${signed(b)}x^2${signed(c)}x`,
    k,
    bi('Find the x-coordinate of the inflection point of f(x).',
      `f''(x)=${6 * a}x${signed(2 * b)}이고 이를 0으로 놓으면 x=${k}에서 오목한 방향이 바뀌므로 변곡점입니다.`,
      `f''(x)=${6 * a}x${signed(2 * b)}; setting it to 0 gives x=${k}, where concavity changes.`)
  );
}

function optimizationClosedInterval(random) {
  const k = ri(random, 3, 10);
  const L = 4 * k;
  const maxArea = 2 * k * k;
  return make(
    `길이 ${L}m인 울타리로, 한 변은 벽에 붙여서(울타리 불필요) 나머지 세 변을 막아 직사각형 모양의 땅을 만들려고 합니다. 만들 수 있는 최대 넓이(m²)를 구하세요.`,
    `2w+l=${L}, A=lw`,
    maxArea,
    bi(`A fence of length ${L}m encloses a rectangular plot using a wall for one side (no fence needed there). Find the maximum possible area (m²).`,
      `A=l·w=(${L}-2w)w=${L}w-2w². A'(w)=${L}-4w=0에서 w=${k}, 최대 넓이는 A(${k})=${maxArea}m²입니다.`,
      `A=l·w=(${L}-2w)w. Setting A'(w)=0 gives w=${k}, and the maximum area is A(${k})=${maxArea} m².`)
  );
}

function riemannSums(random) {
  const h = pick(random, [1, 2, 3]);
  const values = Array.from({ length: 4 }, () => ri(random, -4, 9));
  const useLeft = random() < 0.5;
  const sum = useLeft ? h * (values[0] + values[1] + values[2]) : h * (values[1] + values[2] + values[3]);
  const xs = [0, h, 2 * h, 3 * h];
  return make(
    `아래 표는 함수 f의 값을 나타냅니다. ${useLeft ? '왼쪽' : '오른쪽'} 리만합을 이용하여 [0, ${3 * h}] 구간에서 ∫f(x)dx의 근삿값을 구하세요. (소구간 폭 ${h})`,
    `x: ${xs.join(', ')} / f(x): ${values.join(', ')}`,
    sum,
    bi(`The table gives values of f. Approximate ∫f(x)dx on [0, ${3 * h}] using a ${useLeft ? 'left' : 'right'} Riemann sum with subinterval width ${h}.`,
      useLeft
        ? `왼쪽 리만합은 각 소구간의 왼쪽 함숫값을 사용합니다: ${h}×(${values[0]}+${values[1]}+${values[2]})=${sum}.`
        : `오른쪽 리만합은 각 소구간의 오른쪽 함숫값을 사용합니다: ${h}×(${values[1]}+${values[2]}+${values[3]})=${sum}.`,
      useLeft
        ? `A left Riemann sum uses the left endpoint of each subinterval: ${h}×(${values[0]}+${values[1]}+${values[2]})=${sum}.`
        : `A right Riemann sum uses the right endpoint of each subinterval: ${h}×(${values[1]}+${values[2]}+${values[3]})=${sum}.`)
  );
}

function relatedRates(random) {
  const rate = ri(random, 2, 5);
  const radius = ri(random, 3, 10);
  const answer = `${2 * radius * rate}π`;
  return make(
    `원의 반지름이 매초 ${rate}cm씩 늘어나고 있습니다. 반지름이 ${radius}cm일 때, 원의 넓이의 증가율(cm²/s)을 구하세요.`,
    `A=πr^2, dr/dt=${rate}`,
    answer,
    bi(`A circle's radius is increasing at ${rate} cm/s. Find the rate of change of its area (cm²/s) when the radius is ${radius} cm.`,
      `A=πr²의 양변을 t에 대해 미분하면 dA/dt=2πr·dr/dt=2π×${radius}×${rate}=${answer}cm²/s입니다.`,
      `Differentiating A=πr² gives dA/dt=2πr·dr/dt=2π×${radius}×${rate}=${answer} cm²/s.`)
  );
}

function lhopitalRule(random) {
  const a = ri(random, 1, 6);
  const b = ri(random, 1, 6);
  const useExp = random() < 0.5;
  const answer = frac(a, b);
  const expr = useExp ? `lim_(x→0) (e^(${a}x)-1)/(${b}x)` : `lim_(x→0) sin(${a}x)/(${b}x)`;
  return make(
    '로피탈의 정리를 이용하여 극한값을 구하세요. (0/0 꼴)',
    expr,
    answer,
    bi('Use L\'Hôpital\'s Rule to evaluate the limit (0/0 form).',
      useExp
        ? `분자, 분모를 각각 미분하면 lim_(x→0) ${a}e^(${a}x)/${b} = ${a}/${b}=${answer}입니다.`
        : `분자, 분모를 각각 미분하면 lim_(x→0) ${a}cos(${a}x)/${b} = ${a}/${b}=${answer}입니다.`,
      useExp
        ? `Differentiating numerator and denominator gives lim ${a}e^(${a}x)/${b} = ${a}/${b}=${answer}.`
        : `Differentiating numerator and denominator gives lim ${a}cos(${a}x)/${b} = ${a}/${b}=${answer}.`)
  );
}

function separableDifferentialEquation(random) {
  const k = pick(random, [2, 4, 6]);
  const t = ri(random, 1, 4);
  const y0 = ri(random, -5, 5);
  const answer = (k / 2) * t * t + y0;
  return make(
    `미분방정식 dy/dx=kx 를 만족하고 y(0)=${y0}인 함수 y=f(x)에 대하여 f(${t})의 값을 구하세요.`,
    `dy/dx=${k}x, y(0)=${y0}`,
    answer,
    bi(`Given dy/dx=kx and y(0)=${y0}, find f(${t}).`,
      `변수분리하여 dy=${k}x dx, 양변을 적분하면 y=${k / 2}x²+C. y(0)=${y0}에서 C=${y0}이므로 f(${t})=${k / 2}×${t}²${signed(y0)}=${answer}.`,
      `Separating variables: dy=${k}x dx, integrate to get y=${k / 2}x²+C. Since y(0)=${y0}, C=${y0}, so f(${t})=${answer}.`)
  );
}

function partialFractionsIntegration(random) {
  // b < a by construction so a-b is always positive — frac(1, negative) would otherwise
  // format as the ugly "1/-3" instead of "-1/3".
  const b = ri(random, -6, 3);
  const a = b + ri(random, 1, 6);
  const answer = frac(1, a - b);
  return make(
    '부분분수분해 1/((x−a)(x−b)) = A/(x−a) + B/(x−b) 에서 A의 값을 구하세요.',
    `a=${a}, b=${b}`,
    answer,
    bi('In the partial fraction decomposition 1/((x−a)(x−b)) = A/(x−a) + B/(x−b), find A.',
      `1=A(x−b)+B(x−a)에 x=a를 대입하면 1=A(a−b)이므로 A=1/(a−b)=${answer}.`,
      `Setting x=a in 1=A(x−b)+B(x−a) gives 1=A(a−b), so A=1/(a−b)=${answer}.`)
  );
}

function improperIntegral(random) {
  const p = pick(random, [2, 3, 4, 5]);
  return make(
    `이상적분 ∫₁^∞ x^(−${p}) dx 의 값을 구하세요. (p=${p}>1이므로 수렴합니다)`,
    `∫₁^∞ x^(-${p}) dx`,
    frac(1, p - 1),
    bi(`Evaluate the improper integral ∫₁^∞ x^(−${p}) dx. (It converges since p=${p}>1.)`,
      `∫₁^b x^(−${p})dx=[x^(1−${p})/(1−${p})]₁^b, b→∞일 때 첫째 항은 0으로 수렴하여 값은 1/(${p}−1)=${frac(1, p - 1)}입니다.`,
      `∫₁^b x^(−${p})dx=[x^(1−${p})/(1−${p})]₁^b → as b→∞ the first term vanishes, leaving 1/(${p}−1)=${frac(1, p - 1)}.`)
  );
}

function eulerMethod(random) {
  const x0 = ri(random, 0, 2);
  const y0 = ri(random, 1, 4);
  const h = pick(random, [0.5, 1]);
  const y1 = y0 + h * (x0 + y0);
  const x1 = x0 + h;
  const y2 = y1 + h * (x1 + y1);
  return make(
    `dy/dx=x+y, 초기점 (x₀,y₀)=(${x0},${y0}), 스텝 크기 h=${h}일 때, 오일러 방법으로 두 단계 후의 근삿값 y₂를 구하세요.`,
    `x_(n+1)=x_n+h, y_(n+1)=y_n+h·(x_n+y_n)`,
    y2,
    bi(`Using Euler's method with dy/dx=x+y, (x₀,y₀)=(${x0},${y0}), and step size h=${h}, find the approximation y₂ after two steps.`,
      `y₁=${y0}+${h}×(${x0}+${y0})=${y1}. x₁=${x1}. y₂=${y1}+${h}×(${x1}+${y1})=${y2}.`,
      `y₁=${y0}+${h}×(${x0}+${y0})=${y1}. x₁=${x1}. y₂=${y1}+${h}×(${x1}+${y1})=${y2}.`)
  );
}

function logisticGrowth(random) {
  const M = pick(random, [40, 80, 120, 200]);
  const k = pick(random, [1, 2, 4]);
  const answer = (k * M) / 4;
  return make(
    `로지스틱 성장 모형 dP/dt=kP(1−P/M) 에서 k=${k}, 이월수용력(carrying capacity) M=${M}일 때, P=M/2에서 dP/dt의 값(최대 성장률)을 구하세요.`,
    `dP/dt=${k}P(1−P/${M})`,
    answer,
    bi(`For the logistic model dP/dt=kP(1−P/M) with k=${k} and carrying capacity M=${M}, find dP/dt (the maximum growth rate) at P=M/2.`,
      `로지스틱 모형에서 성장률이 최대가 되는 지점은 P=M/2이며, 이때 dP/dt=kM/4=${k}×${M}/4=${answer}.`,
      `The logistic model's growth rate is maximized at P=M/2, where dP/dt=kM/4=${k}×${M}/4=${answer}.`)
  );
}

function arcLength(random) {
  // factor = sqrt(1+m^2) as an exact fraction [numerator, denominator] — computed via fractions
  // throughout (not floating-point) so widths that aren't multiples of 3 don't produce a
  // repeating decimal the student can't type exactly (e.g. 5/3 × 7 = 11.666...).
  const [mLabel, factorNum, factorDen] = pick(random, [['0', 1, 1], ['3/4', 5, 4], ['4/3', 5, 3]]);
  const width = factorDen === 3 ? 3 * ri(random, 1, 4) : ri(random, 2, 8);
  const answer = frac(factorNum * width, factorDen);
  return make(
    `직선 y=mx+c (m=${mLabel})의 x=0부터 x=${width}까지의 호의 길이를 호의 길이 공식 ∫√(1+(y')²)dx 을 이용해 구하세요.`,
    `y'=${mLabel}, ∫₀^${width}√(1+m²)dx`,
    answer,
    bi(`Find the arc length of the line y=mx+c (m=${mLabel}) from x=0 to x=${width}, using L=∫√(1+(y')²)dx.`,
      `y'=${mLabel}로 상수이므로 L=√(1+m²)×${width}=(${factorNum}/${factorDen})×${width}=${answer}. (직선의 호 길이는 두 점 사이의 거리와 같습니다.)`,
      `Since y'=${mLabel} is constant, L=√(1+m²)×${width}=(${factorNum}/${factorDen})×${width}=${answer}. (This matches the straight-line distance formula.)`)
  );
}

function parametricCalculus(random) {
  const a = ri(random, -4, 4);
  const b = ri(random, -6, 6);
  let t0 = ri(random, 1, 4);
  while (2 * t0 + a === 0) t0 = ri(random, 1, 4);
  const answer = frac(3 * t0 * t0 + b, 2 * t0 + a);
  return make(
    `매개변수 방정식 x(t)=t²${signed(a)}t, y(t)=t³${signed(b)}t 에서 t=${t0}일 때 dy/dx의 값을 구하세요.`,
    `dy/dx=(dy/dt)/(dx/dt)`,
    answer,
    bi(`For the parametric curve x(t)=t²${signed(a)}t, y(t)=t³${signed(b)}t, find dy/dx at t=${t0}.`,
      `dx/dt=2t${signed(a)}, dy/dt=3t²${signed(b)}이므로 t=${t0}에서 dy/dx=(${3 * t0 * t0 + b})/(${2 * t0 + a})=${answer}.`,
      `dx/dt=2t${signed(a)}, dy/dt=3t²${signed(b)}, so at t=${t0}, dy/dx=(${3 * t0 * t0 + b})/(${2 * t0 + a})=${answer}.`)
  );
}

function polarCalculus(random) {
  const a = ri(random, 2, 6);
  const answer = `${frac(a * a, 4)}π`;
  return make(
    `극좌표 방정식 r=${a}sinθ (0≤θ≤π)로 둘러싸인 영역의 넓이를 구하세요.`,
    `A=(1/2)∫r²dθ`,
    answer,
    bi(`Find the area enclosed by the polar curve r=${a}sinθ for 0≤θ≤π.`,
      `A=(1/2)∫₀^π(${a}sinθ)²dθ=(1/2)×${a * a}×∫₀^π sin²θ dθ=(1/2)×${a * a}×(π/2)=${answer}.`,
      `A=(1/2)∫₀^π(${a}sinθ)²dθ=(1/2)×${a * a}×(π/2)=${answer}.`)
  );
}

const SERIES_TESTS = [
  { build: (random) => { const p = pick(random, [0.5, 1, 2, 3]); return { label: `Σ 1/n^${p}`, converges: p > 1, why: `p-급수 판정: p=${p}이므로 ${p > 1 ? '수렴' : '발산'}합니다.`, whyEn: `p-series test: p=${p}, so it ${p > 1 ? 'converges' : 'diverges'}.` }; } },
  { build: (random) => { const r = pick(random, [0.5, -0.5, 0.9, 2, -2, 1.2]); return { label: `Σ (${r})^n`, converges: Math.abs(r) < 1, why: `등비급수 판정: 공비의 절댓값이 ${Math.abs(r) < 1 ? '1보다 작으므로 수렴' : '1 이상이므로 발산'}합니다.`, whyEn: `Geometric series test: |ratio|=${Math.abs(r)}, so it ${Math.abs(r) < 1 ? 'converges' : 'diverges'}.` }; } },
  { build: (random) => { const p = pick(random, [0.5, 1, 2]); return { label: `Σ (−1)ⁿ/n^${p}`, converges: true, why: '교대급수 판정: 항의 크기가 0으로 감소하는 교대급수이므로 수렴합니다.', whyEn: 'Alternating series test: the terms decrease to 0, so it converges.' }; } },
];

function seriesConvergenceTests(random) {
  const { label, converges, why, whyEn } = pick(random, SERIES_TESTS).build(random);
  // choice() answers are the 1-based INDEX into choicesKo/choicesEn, not a semantic value —
  // matching koreanHigh3Engine.js's planeRelationship pattern (`mode + 1`).
  return make(
    '다음 급수는 수렴합니까, 발산합니까?',
    label,
    converges ? 1 : 2,
    bi('Does the series below converge or diverge?', why, whyEn, choice(['수렴', '발산'], ['Converges', 'Diverges']))
  );
}

function powerSeriesRadius(random) {
  const k = ri(random, 2, 6);
  return make(
    `거듭제곱급수 Σ_(n=0)^∞ ${k}ⁿ(x−a)ⁿ 의 수렴반경 R을 구하세요.`,
    `Σ (${k}(x-a))^n`,
    frac(1, k),
    bi(`Find the radius of convergence R of the power series Σ ${k}ⁿ(x−a)ⁿ.`,
      `비율판정법으로 |${k}(x−a)|<1, 즉 |x−a|<1/${k}이므로 R=1/${k}=${frac(1, k)}.`,
      `By the ratio test, |${k}(x−a)|<1, i.e. |x−a|<1/${k}, so R=1/${k}=${frac(1, k)}.`)
  );
}

const MACLAURIN_FUNCTIONS = [
  { name: 'e^x', nameLatex: 'e^x', term: (n) => `x^${n}`, coeff: (n) => frac(1, fact(n)), rule: 'e^x=Σx^n/n!' },
  { name: '1/(1-x)', nameLatex: '1/(1-x)', term: (n) => `x^${n}`, coeff: () => '1', rule: '1/(1-x)=Σx^n' },
  { name: 'ln(1+x)', nameLatex: 'ln(1+x)', term: (n) => `x^${n}`, coeff: (n) => frac(n % 2 === 1 ? 1 : -1, n), rule: 'ln(1+x)=Σ(-1)^(n+1)x^n/n (n≥1)' },
];

function taylorMaclaurinSeries(random) {
  const fn = pick(random, MACLAURIN_FUNCTIONS);
  const n = ri(random, 1, 5);
  return make(
    `${fn.name}의 매클로린 급수에서 ${fn.term(n)}의 계수를 구하세요.`,
    fn.rule,
    fn.coeff(n),
    bi(`Find the coefficient of ${fn.term(n)} in the Maclaurin series of ${fn.name}.`,
      `${fn.rule}이므로 ${fn.term(n)}의 계수는 ${fn.coeff(n)}입니다.`,
      `Since ${fn.rule}, the coefficient of ${fn.term(n)} is ${fn.coeff(n)}.`)
  );
}

const unit = (id, category, label, enLabel, description, enDescription, profiles, generator) => ({ id, category, label, description, en: [enLabel, enDescription], profiles, make: generator });

export const AP_CALCULUS_UNITS = [
  unit('concavity-second-derivative', 'AP Calculus', '오목성과 변곡점', 'Concavity & Inflection Points', '이계도함수를 이용한 오목성 판정과 변곡점', 'Use the second derivative to determine concavity and inflection points', AB_AND_KR, concavitySecondDerivative),
  unit('optimization-closed-interval', 'AP Calculus', '최적화 (최댓값·최솟값 활용)', 'Optimization', '미분을 이용한 실생활 최댓값·최솟값 문제', 'Solve real-world maximum/minimum problems using derivatives', AB_AND_KR, optimizationClosedInterval),
  unit('riemann-sums', 'AP Calculus', '리만합과 정적분의 근사', 'Riemann Sums', '표로 주어진 함숫값으로 왼쪽·오른쪽 리만합 계산', 'Approximate a definite integral using left/right Riemann sums from a table', AB_AND_KR, riemannSums),
  unit('related-rates', 'AP Calculus', '관련 변화율', 'Related Rates', '연쇄법칙을 이용한 관련 변화율 문제', 'Solve related rates problems using the chain rule', AB_ONLY, relatedRates),
  unit('lhopital-rule', 'AP Calculus', "로피탈의 정리", "L'Hôpital's Rule", '0/0 부정형 극한을 로피탈의 정리로 계산', "Evaluate 0/0 indeterminate limits using L'Hôpital's Rule", AB_ONLY, lhopitalRule),
  unit('differential-equations-separable', 'AP Calculus', '변수분리형 미분방정식', 'Separable Differential Equations', '변수분리법으로 미분방정식의 특수해 구하기', 'Solve a separable differential equation with an initial condition', AB_ONLY, separableDifferentialEquation),
  unit('partial-fractions-integration', 'AP Calculus (BC)', '부분분수분해', 'Partial Fraction Decomposition', '유리함수를 부분분수로 분해하기 (BC)', 'Decompose a rational function into partial fractions (BC)', BC_ONLY, partialFractionsIntegration),
  unit('improper-integrals', 'AP Calculus (BC)', '이상적분', 'Improper Integrals', 'p-적분의 수렴 판정과 값 계산 (BC)', 'Evaluate a convergent improper p-integral (BC)', BC_ONLY, improperIntegral),
  unit('euler-method', 'AP Calculus (BC)', '오일러 방법', "Euler's Method", '미분방정식의 수치적 근사해 구하기 (BC)', "Approximate a solution to a differential equation using Euler's Method (BC)", BC_ONLY, eulerMethod),
  unit('logistic-growth', 'AP Calculus (BC)', '로지스틱 성장 모형', 'Logistic Growth', '로지스틱 미분방정식과 최대 성장률 (BC)', 'Analyze the logistic differential equation and its maximum growth rate (BC)', BC_ONLY, logisticGrowth),
  unit('arc-length', 'AP Calculus (BC)', '곡선의 길이', 'Arc Length', '호의 길이 공식을 이용한 곡선의 길이 계산 (BC)', 'Find the arc length of a curve using the arc length formula (BC)', BC_ONLY, arcLength),
  unit('parametric-vector-calculus', 'AP Calculus (BC)', '매개변수 미분법', 'Parametric Differentiation', '매개변수로 나타낸 곡선의 dy/dx 구하기 (BC)', 'Find dy/dx for a curve given in parametric form (BC)', BC_ONLY, parametricCalculus),
  unit('polar-calculus', 'AP Calculus (BC)', '극좌표와 넓이', 'Area in Polar Coordinates', '극좌표 방정식으로 둘러싸인 영역의 넓이 (BC)', 'Find the area enclosed by a polar curve (BC)', BC_ONLY, polarCalculus),
  unit('series-convergence-tests', 'AP Calculus (BC)', '급수의 수렴판정법', 'Series Convergence Tests', 'p-급수·등비급수·교대급수 판정법 적용 (BC)', 'Apply the p-series, geometric series, and alternating series tests (BC)', BC_ONLY, seriesConvergenceTests),
  unit('power-series-radius-of-convergence', 'AP Calculus (BC)', '거듭제곱급수의 수렴반경', 'Radius of Convergence', '비율판정법으로 수렴반경 구하기 (BC)', 'Find the radius of convergence using the ratio test (BC)', BC_ONLY, powerSeriesRadius),
  unit('taylor-maclaurin-series', 'AP Calculus (BC)', '테일러·매클로린 급수', 'Taylor & Maclaurin Series', '표준함수의 매클로린 급수 계수 구하기 (BC)', 'Find a coefficient in the Maclaurin series of a standard function (BC)', BC_ONLY, taylorMaclaurinSeries),
];
