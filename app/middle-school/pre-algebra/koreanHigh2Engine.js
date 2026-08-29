const ri = (random, min, max) => Math.floor(random() * (max - min + 1)) + min;
const pick = (random, values) => values[ri(random, 0, values.length - 1)];
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const frac = (n, d = 1) => { const divisor = gcd(n, d); const numerator = n / divisor; const denominator = d / divisor; return denominator === 1 ? String(numerator) : `${numerator}/${denominator}`; };
const signed = (value) => value >= 0 ? `+${value}` : `${value}`;
const make = (prompt, expression, answer, extra = {}) => ({ prompt, expression, answer: String(answer), ...extra });
const bi = (promptEn, explanation, explanationEn, extra = {}) => ({ promptEn, explanation, explanationEn, ...extra });
const choice = (choicesKo, choicesEn = choicesKo) => ({ kind: 'choice', choicesKo, choicesEn });

const H2A = ['kr-high-2-algebra'];
const H2C = ['kr-high-2-calculus-1'];
const H2S = ['kr-high-2-probability-statistics'];

function exponentialLogFunctions(random) {
  const base = pick(random, [2, 3, 4, 5]);
  const exponent = ri(random, 2, 5);
  if (random() < 0.5) return make('지수함수의 함숫값을 구하세요.', `f(x)=${base}^x, f(${exponent})`, base ** exponent, bi('Evaluate the exponential function.', `f(${exponent})=${base}^${exponent}=${base ** exponent}입니다.`, `f(${exponent})=${base}^${exponent}=${base ** exponent}.`));
  return make('로그함수의 함숫값을 구하세요.', `g(x)=log_${base}x, g(${base ** exponent})`, exponent, bi('Evaluate the logarithmic function.', `${base}^${exponent}=${base ** exponent}이므로 log_${base}${base ** exponent}=${exponent}입니다.`, `Since ${base}^${exponent}=${base ** exponent}, the logarithm is ${exponent}.`));
}

function radiansAndTrig(random) {
  const entries = [[30, 'π/6'], [45, 'π/4'], [60, 'π/3'], [90, 'π/2'], [120, '2π/3'], [135, '3π/4'], [150, '5π/6'], [180, 'π']];
  const [degrees, radians] = pick(random, entries);
  return make('각을 호도법으로 나타내세요.', `${degrees}°`, radians, bi('Write the angle in radians.', `${degrees}×π/180=${radians}입니다.`, `${degrees}×π/180=${radians}.`));
}

function sineCosineLaws(random) {
  if (random() < 0.5) {
    const [a, b, cosine, c] = pick(random, [[3, 4, 0, 5], [5, 5, '1/2', 5], [5, 7, '1/7', 8]]);
    return make('코사인법칙을 이용하여 변 c의 길이를 구하세요.', `a=${a}, b=${b}, cos C=${cosine}`, c, bi('Use the Cosine Law to find side c.', `c²=a²+b²−2ab cos C에 대입하면 c=${c}입니다.`, `Substitute into c²=a²+b²−2ab cos C to get c=${c}.`));
  }
  const scale = ri(random, 3, 9);
  const numerator = pick(random, [1, 2]);
  return make('사인법칙을 이용하여 변 b의 길이를 구하세요.', `a/sin A=${scale}, sin B=${numerator}/2`, frac(scale * numerator, 2), bi('Use the Sine Law to find side b.', `b/sin B=${scale}이므로 b=${scale}×${numerator}/2=${frac(scale * numerator, 2)}입니다.`, `Since b/sin B=${scale}, b=${frac(scale * numerator, 2)}.`));
}

function sequenceSumsInduction(random) {
  const n = ri(random, 5, 20);
  if (random() < 0.65) return make('수열의 합을 구하세요.', `1+2+3+⋯+${n}`, n * (n + 1) / 2, bi('Find the sum.', `1부터 ${n}까지의 합은 ${n}(${n}+1)/2=${n * (n + 1) / 2}입니다.`, `Use n(n+1)/2 to get ${n * (n + 1) / 2}.`));
  const choicesKo = ['k+1일 때도 성립함을 보인다.', 'n=0만 확인한다.', '결론을 먼저 가정한다.', '한 가지 수치만 대입한다.'];
  const choicesEn = ['Show it holds for k+1.', 'Check only n=0.', 'Assume the conclusion.', 'Substitute one value only.'];
  return make('수학적 귀납법에서 n=k일 때 성립한다고 가정한 다음 단계로 알맞은 것을 고르세요.', '', 1, bi('Choose the next step in mathematical induction after assuming the statement for n=k.', '귀납 가정을 이용하여 n=k+1일 때도 성립함을 보입니다.', 'Use the induction hypothesis to prove the statement for n=k+1.', choice(choicesKo, choicesEn)));
}

function polynomialLimit(random) {
  const a = ri(random, 1, 5); const b = ri(random, -6, 6); const c = ri(random, -8, 8); const x = ri(random, -3, 4);
  return make('함수의 극한을 구하세요.', `lim_(x→${x}) (${a}x^2${signed(b)}x${signed(c)})`, a * x * x + b * x + c, bi('Evaluate the limit.', '다항함수는 연속이므로 x의 값을 직접 대입합니다.', 'A polynomial is continuous, so substitute the approaching value.'));
}

function continuityParameter(random) {
  const split = ri(random, -3, 4); const slope = ri(random, 1, 5); const intercept = ri(random, -6, 6); const answer = slope * split + intercept;
  return make(`함수 f(x)가 x=${split}에서 연속일 때 a를 구하세요.`, `f(x)={ ${slope}x${signed(intercept)} (x≠${split}), a (x=${split}) }`, answer, bi(`Find a so that f is continuous at x=${split}.`, `연속이려면 a=lim f(x)=${slope}×${split}${signed(intercept)}=${answer}입니다.`, `Continuity requires a=lim f(x)=${answer}.`));
}

function derivativeDefinition(random) {
  const a = ri(random, 1, 5); const b = ri(random, -7, 7); const x = ri(random, -3, 5); const answer = 2 * a * x + b;
  return make('주어진 점에서의 미분계수를 구하세요.', `f(x)=${a}x^2${signed(b)}x, x=${x}`, answer, bi('Find the derivative at the given point.', `f′(x)=${2 * a}x${signed(b)}이므로 f′(${x})=${answer}입니다.`, `f′(x)=${2 * a}x${signed(b)}, so f′(${x})=${answer}.`));
}

function derivativeRules(random) {
  const a = ri(random, 1, 5); const b = ri(random, -6, 6); const c = ri(random, -7, 7);
  const answer = `${3 * a}x^2${signed(2 * b)}x${signed(c)}`;
  return make('함수의 도함수를 구하세요.', `f(x)=${a}x^3${signed(b)}x^2${signed(c)}x`, answer, bi('Differentiate the function.', `거듭제곱의 미분법을 적용하면 f′(x)=${answer}입니다.`, `Apply the power rule to get f′(x)=${answer}.`));
}

function tangentSlope(random) {
  const a = ri(random, 1, 4); const h = ri(random, -4, 4); const b = ri(random, -6, 6); const slope = 2 * a * h + b;
  return make('곡선 위의 주어진 점에서 접선의 기울기를 구하세요.', `y=${a}x^2${signed(b)}x, x=${h}`, slope, bi('Find the slope of the tangent at the given x-value.', `도함수 y′=${2 * a}x${signed(b)}에 x=${h}를 대입하면 ${slope}입니다.`, `Substitute x=${h} into y′=${2 * a}x${signed(b)} to get ${slope}.`));
}

function extrema(random) {
  const h = ri(random, -6, 6); const k = ri(random, -8, 8); const direction = random() < 0.5 ? 1 : -1;
  return make(`함수의 ${direction > 0 ? '극솟값' : '극댓값'}을 구하세요.`, `f(x)=${direction > 0 ? '' : '−'}(x−(${h}))^2${signed(k)}`, k, bi(`Find the ${direction > 0 ? 'minimum' : 'maximum'} value.`, `꼭짓점은 (${h},${k})이므로 구하는 값은 ${k}입니다.`, `The vertex is (${h},${k}), so the requested value is ${k}.`));
}

function motionDerivative(random) {
  const a = ri(random, 1, 5); const b = ri(random, -6, 6); const t = ri(random, 1, 6); const velocity = 2 * a * t + b;
  return make('위치 s(t)가 주어질 때 해당 시각의 순간속도를 구하세요.', `s(t)=${a}t^2${signed(b)}t, t=${t}`, velocity, bi('Find the instantaneous velocity at the given time.', `v(t)=s′(t)=${2 * a}t${signed(b)}이므로 v(${t})=${velocity}입니다.`, `v(t)=s′(t)=${2 * a}t${signed(b)}, so v(${t})=${velocity}.`));
}

function antiderivative(random) {
  const even = pick(random, [2, 4, 6, 8]); const b = ri(random, -6, 6); const answer = `${even / 2}x^2${signed(b)}x+C`;
  return make('부정적분을 구하세요.', `∫(${even}x${signed(b)})dx`, answer, bi('Find the indefinite integral.', `항별로 적분하면 ${answer}입니다.`, `Integrate term by term to obtain ${answer}.`));
}

function definiteIntegral(random) {
  const a = pick(random, [2, 4, 6]); const b = ri(random, 0, 6); const upper = ri(random, 2, 6); const answer = a * upper * upper / 2 + b * upper;
  return make('정적분의 값을 구하세요.', `∫_0^${upper} (${a}x+${b})dx`, answer, bi('Evaluate the definite integral.', `원시함수 ${a / 2}x²+${b}x에 0과 ${upper}를 대입하면 ${answer}입니다.`, `Evaluate the antiderivative at ${upper} and 0 to get ${answer}.`));
}

function areaByIntegral(random) {
  const slope = ri(random, 1, 6); const upper = pick(random, [2, 4, 6]); const area = slope * upper * upper / 2;
  return make('곡선과 x축 및 두 직선으로 둘러싸인 넓이를 구하세요.', `y=${slope}x, 0≤x≤${upper}`, area, bi('Find the enclosed area.', `넓이는 ∫_0^${upper}${slope}x dx=${area}입니다.`, `The area is ∫_0^${upper}${slope}x dx=${area}.`));
}

function expectedValue(random) {
  const values = [0, 1, 2]; const weights = [ri(random, 1, 3), ri(random, 1, 3), ri(random, 1, 3)]; const total = weights.reduce((sum, value) => sum + value, 0); const numerator = weights[1] + 2 * weights[2];
  return make('확률변수 X의 기댓값을 구하세요.', `X: 0,1,2 / P: ${weights.map((value) => frac(value, total)).join(',')}`, frac(numerator, total), bi('Find the expected value of X.', `E(X)=0×${weights[0]}/${total}+1×${weights[1]}/${total}+2×${weights[2]}/${total}=${frac(numerator, total)}입니다.`, `Compute ΣxP(X=x) to get ${frac(numerator, total)}.`));
}

function binomialDistribution(random) {
  const n = pick(random, [3, 4, 5]); const successes = ri(random, 0, n); const combinations = (count, selected) => { let result = 1; for (let i = 1; i <= selected; i += 1) result = result * (count - i + 1) / i; return result; };
  const numerator = combinations(n, successes);
  return make('성공확률이 1/2인 독립시행을 n번 할 때 정확히 r번 성공할 확률을 구하세요.', `n=${n}, r=${successes}`, frac(numerator, 2 ** n), bi('Find the probability of exactly r successes when p=1/2.', `이항분포에서 C(${n},${successes})(1/2)^${n}=${frac(numerator, 2 ** n)}입니다.`, `Use the binomial formula to get ${frac(numerator, 2 ** n)}.`));
}

function normalDistribution(random) {
  const mean = ri(random, 50, 80); const offset = ri(random, 3, 12); const choicesKo = [`P(X≤${mean - offset})`, `P(X≤${mean})`, `P(X≥${mean + offset * 2})`, `P(X=${mean + offset})`];
  const choicesEn = choicesKo;
  return make(`정규분포 N(${mean}, σ²)을 따를 때 대칭성에 의해 P(X≥${mean + offset})와 같은 확률을 고르세요.`, '', 1, bi(`For X~N(${mean},σ²), choose the probability equal to P(X≥${mean + offset}) by symmetry.`, `평균 ${mean}을 중심으로 대칭이므로 P(X≥${mean + offset})=P(X≤${mean - offset})입니다.`, `Symmetry about the mean gives P(X≥${mean + offset})=P(X≤${mean - offset}).`, choice(choicesKo, choicesEn)));
}

function samplingMean(random) {
  const values = Array.from({ length: pick(random, [4, 5, 8]) }, () => ri(random, 10, 40)); const total = values.reduce((sum, value) => sum + value, 0);
  if (total % values.length) return samplingMean(random);
  return make('표본의 표본평균을 구하세요.', values.join(', '), total / values.length, bi('Find the sample mean.', `자료의 합 ${total}을 표본의 크기 ${values.length}로 나누면 ${total / values.length}입니다.`, `Divide the total ${total} by ${values.length} to get ${total / values.length}.`));
}

function confidenceInterval(random) {
  const mean = ri(random, 40, 90); const margin = ri(random, 2, 8);
  return make('모평균의 신뢰구간이 표본평균±오차한계로 주어질 때 신뢰구간을 구하세요.', `표본평균=${mean}, 오차한계=${margin}`, `${mean - margin},${mean + margin}`, bi('Find the confidence interval from the sample mean and margin of error.', `${mean}±${margin}이므로 ${mean - margin}≤μ≤${mean + margin}입니다.`, `${mean}±${margin} gives ${mean - margin}≤μ≤${mean + margin}.`));
}

function sampleProportion(random) {
  const n = pick(random, [50, 80, 100, 200, 400]);
  const successes = ri(random, Math.round(n * 0.2), Math.round(n * 0.8));
  if (random() < 0.5) {
    return make('표본비율을 구하세요.', `크기 ${n}인 표본에서 특성 A를 가진 것이 ${successes}개`, frac(successes, n), bi('Find the sample proportion.', `표본비율은 p̂=${successes}/${n}=${frac(successes, n)}입니다.`, `The sample proportion is p̂=${successes}/${n}=${frac(successes, n)}.`));
  }
  const marginPercent = pick(random, [2, 3, 4, 5]);
  const pointEstimate = Math.round((successes / n) * 100);
  return make('모비율의 신뢰구간을 구하세요. (단위: %)', `표본비율 ${pointEstimate}%, 오차한계 ${marginPercent}%p`, `${pointEstimate - marginPercent},${pointEstimate + marginPercent}`, bi('Find the confidence interval for the population proportion (in %).', `표본비율에서 오차한계를 빼고 더하면 ${pointEstimate - marginPercent}%≤p≤${pointEstimate + marginPercent}%입니다.`, `${pointEstimate}%±${marginPercent}%p gives ${pointEstimate - marginPercent}%≤p≤${pointEstimate + marginPercent}%.`));
}

const unit = (id, category, label, enLabel, description, enDescription, profiles, generator) => ({ id, category, label, description, en: [enLabel, enDescription], profiles, make: generator });

export const KOREAN_HIGH2_UNITS = [
  unit('h2-exponential-log-functions', '지수와 로그', '지수함수와 로그함수', 'Exponential & logarithmic functions', '함숫값과 지수·로그의 역관계', 'Evaluate exponential and logarithmic functions', H2A, exponentialLogFunctions),
  unit('h2-radians-trig', '삼각함수', '일반각과 호도법', 'Angles & radians', '각을 호도법으로 나타내고 삼각함수와 연결', 'Convert angles to radians', H2A, radiansAndTrig),
  unit('h2-sine-cosine-laws', '삼각함수', '사인법칙과 코사인법칙', 'Sine & Cosine Laws', '삼각형의 변과 각 사이의 관계', 'Solve triangles using the Sine and Cosine Laws', H2A, sineCosineLaws),
  unit('h2-sequence-sums-induction', '수열', '수열의 합과 수학적 귀납법', 'Sequence sums & induction', '수열의 합 공식과 귀납적 증명 절차', 'Use sum formulas and mathematical induction', H2A, sequenceSumsInduction),
  unit('h2-function-limits', '미적분', '함수의 극한', 'Limits of functions', '다항함수의 극한과 극한값 계산', 'Evaluate limits of functions', H2C, polynomialLimit),
  unit('h2-continuity', '미적분', '함수의 연속', 'Continuity', '연속 조건을 이용한 미지수 결정', 'Use continuity conditions', H2C, continuityParameter),
  unit('h2-derivative-definition', '미적분', '미분계수', 'Derivative at a point', '한 점에서의 순간변화율', 'Find derivatives at specified points', H2C, derivativeDefinition),
  unit('h2-derivative-rules', '미적분', '도함수', 'Derivative rules', '다항함수의 도함수 계산', 'Differentiate polynomial functions', H2C, derivativeRules),
  unit('h2-tangent-lines', '미적분', '접선의 방정식', 'Tangent lines', '접선의 기울기와 도함수', 'Find tangent slopes and equations', H2C, tangentSlope),
  unit('h2-monotonic-extrema', '미적분', '함수의 증가·감소와 극값', 'Monotonicity & extrema', '도함수와 함수의 극대·극소', 'Analyze extrema using derivatives', H2C, extrema),
  unit('h2-motion-derivatives', '미적분', '속도와 가속도', 'Motion & derivatives', '위치함수와 순간속도', 'Apply derivatives to motion', H2C, motionDerivative),
  unit('h2-antiderivatives', '미적분', '부정적분', 'Indefinite integrals', '다항함수의 원시함수', 'Find antiderivatives', H2C, antiderivative),
  unit('h2-definite-integrals', '미적분', '정적분', 'Definite integrals', '정적분의 계산', 'Evaluate definite integrals', H2C, definiteIntegral),
  unit('h2-integral-area', '미적분', '정적분과 넓이', 'Area by integration', '정적분을 이용한 넓이', 'Find area using definite integrals', H2C, areaByIntegral),
  unit('h2-expected-value', '확률과 통계', '확률변수와 기댓값', 'Random variables & expectation', '이산확률변수의 기댓값', 'Find expected values of discrete random variables', H2S, expectedValue),
  unit('h2-binomial-distribution', '확률과 통계', '이항분포', 'Binomial distribution', '독립시행의 성공 횟수 확률', 'Calculate binomial probabilities', H2S, binomialDistribution),
  unit('h2-normal-distribution', '확률과 통계', '정규분포', 'Normal distribution', '정규분포의 대칭성과 확률', 'Use symmetry of normal distributions', H2S, normalDistribution),
  unit('h2-sample-mean', '확률과 통계', '표본평균', 'Sample mean', '표본자료의 평균과 표집', 'Calculate sample means', H2S, samplingMean),
  unit('h2-confidence-interval', '확률과 통계', '통계적 추정', 'Statistical estimation', '모평균의 신뢰구간', 'Construct confidence intervals for a population mean', H2S, confidenceInterval),
  unit('h2-sample-proportion', '확률과 통계', '표본비율과 모비율의 추정', 'Sample & population proportion', '표본비율 계산과 모비율의 신뢰구간 추정', 'Compute sample proportions and estimate confidence intervals for a population proportion', H2S, sampleProportion),
];
