const ri = (random, min, max) => Math.floor(random() * (max - min + 1)) + min;
const pick = (random, values) => values[ri(random, 0, values.length - 1)];
const nz = (random, min = -6, max = 6) => { let value; do value = ri(random, min, max); while (!value); return value; };
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const frac = (n, d = 1) => { const g = gcd(n, d); return d / g === 1 ? String(n / g) : `${n / g}/${d / g}`; };
const signed = (value) => value >= 0 ? `+${value}` : `${value}`;
const make = (prompt, expression, answer, promptEn, explanation, explanationEn, extra = {}) => ({ prompt, expression, answer: String(answer), promptEn, explanation, explanationEn, ...extra });
const choice = (choicesKo, choicesEn = choicesKo) => ({ kind: 'choice', choicesKo, choicesEn });
const unit = (id, category, label, enLabel, description, enDescription, profiles, generator) => ({ id, category, label, description, en: [enLabel, enDescription], profiles, make: generator });

const BM1 = ['kr-basic-math-1']; const BM2 = ['kr-basic-math-2'];
const ECON = ['kr-economic-math']; const AI = ['kr-ai-math']; const JOB = ['kr-vocational-math'];
const CULT = ['kr-math-culture']; const PSTAT = ['kr-practical-statistics']; const PROJECT = ['kr-math-project'];
const PROF = ['kr-professional-math']; const DISC = ['kr-discrete-math']; const AALG = ['kr-advanced-algebra']; const ACALC = ['kr-advanced-calculus']; const AGEO = ['kr-advanced-geometry'];

function basicExpression(random) {
  const a = ri(random, 2, 9); const x = ri(random, -5, 8); const b = ri(random, -9, 9);
  return make('식의 값을 구하세요.', `${a}x${signed(b)}, x=${x}`, a * x + b, 'Evaluate the expression.', `x=${x}를 대입하면 ${a * x + b}입니다.`, `Substitute x=${x} to get ${a * x + b}.`);
}
function basicEquation(random) {
  const a = ri(random, 2, 8); const x = ri(random, -7, 9); const b = ri(random, -9, 9);
  return make('일차방정식을 푸세요.', `${a}x${signed(b)}=${a * x + b}`, x, 'Solve the linear equation.', `양변에서 ${b}를 정리하고 ${a}로 나누면 x=${x}입니다.`, `Isolate x and divide by ${a}.`);
}
function basicFunction(random) {
  const a = nz(random, -5, 5); const b = ri(random, -8, 8); const x = ri(random, -5, 5);
  return make('함숫값을 구하세요.', `f(x)=${a}x${signed(b)}, f(${x})`, a * x + b, 'Find the function value.', `x=${x}를 대입하면 ${a * x + b}입니다.`, `Substitute x=${x}.`);
}
function basicCoordinate(random) {
  const x1 = ri(random, -8, 8); const y1 = ri(random, -8, 8); const x2 = ri(random, -8, 8); const y2 = ri(random, -8, 8);
  return make('두 점의 중점을 구하세요.', `A(${x1},${y1}), B(${x2},${y2})`, `${frac(x1 + x2, 2)},${frac(y1 + y2, 2)}`, 'Find the midpoint.', '각 좌표의 평균을 구합니다.', 'Average the x-coordinates and y-coordinates.');
}
function simpleInterest(random) {
  const principal = ri(random, 10, 80) * 10000; const rate = pick(random, [2, 3, 4, 5]); const years = ri(random, 1, 5); const interest = principal * rate * years / 100;
  return make('단리로 붙는 이자를 구하세요.', `원금 ${principal}원, 연 ${rate}%, ${years}년`, interest, 'Find the simple interest.', `원금×이율×기간=${principal}×${rate}/100×${years}=${interest}원입니다.`, 'Use principal × rate × time.');
}
function compoundGrowth(random) {
  const principal = pick(random, [100000, 200000, 500000]); const rate = pick(random, [5, 10, 20]); const years = ri(random, 2, 4); const amount = Math.round(principal * (1 + rate / 100) ** years);
  return make('복리로 계산한 만기 금액을 구하세요.', `원금 ${principal}원, 연 ${rate}%, ${years}년`, amount, 'Find the compound amount.', `${principal}(1+${rate}/100)^${years}=${amount}원입니다.`, 'Use P(1+r)^t.');
}
function supplyDemand(random) {
  const equilibrium = ri(random, 4, 15); const slope = ri(random, 2, 6); const intercept = ri(random, 10, 30); const demandIntercept = intercept + 2 * slope * equilibrium;
  return make('수요와 공급이 같은 균형수량을 구하세요.', `공급 P=${slope}Q${signed(intercept)}, 수요 P=−${slope}Q+${demandIntercept}`, equilibrium, 'Find the equilibrium quantity.', '두 가격식을 같게 놓고 Q를 구합니다.', 'Set supply price equal to demand price and solve for Q.');
}
function exchangeRate(random) {
  const rate = pick(random, [1200, 1250, 1300, 1350]); const dollars = ri(random, 10, 80);
  return make('환전 금액을 구하세요.', `1달러=${rate}원, ${dollars}달러`, rate * dollars, 'Convert the currency.', `${rate}×${dollars}=${rate * dollars}원입니다.`, 'Multiply the exchange rate by the dollar amount.');
}
function vectorDistance(random) {
  const a = [ri(random, -5, 5), ri(random, -5, 5)]; const b = [ri(random, -5, 5), ri(random, -5, 5)];
  return make('두 데이터 벡터 사이 거리의 제곱을 구하세요.', `a=(${a}), b=(${b})`, (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2, 'Find the squared distance between the data vectors.', '대응 성분의 차를 제곱하여 더합니다.', 'Square and sum the component differences.');
}
function weightedPrediction(random) {
  const weights = [ri(random, -3, 4), ri(random, -3, 4)]; const inputs = [ri(random, 0, 8), ri(random, 0, 8)]; const bias = ri(random, -5, 5);
  return make('선형 예측값을 구하세요.', `y=${weights[0]}x₁${signed(weights[1])}x₂${signed(bias)}, x=(${inputs})`, weights[0] * inputs[0] + weights[1] * inputs[1] + bias, 'Find the linear prediction.', '가중치와 입력을 곱해 더하고 편향을 더합니다.', 'Take the weighted sum and add the bias.');
}
function meanSquaredError(random) {
  const actual = [ri(random, 1, 9), ri(random, 1, 9)]; const predicted = [actual[0] + pick(random, [-2, -1, 1, 2]), actual[1] + pick(random, [-2, -1, 1, 2])];
  const mse = ((actual[0] - predicted[0]) ** 2 + (actual[1] - predicted[1]) ** 2) / 2;
  return make('두 자료의 평균제곱오차를 구하세요.', `실제값 ${actual}, 예측값 ${predicted}`, mse, 'Find the mean squared error.', '오차를 각각 제곱하여 평균을 구합니다.', 'Average the squared prediction errors.');
}
function confusionAccuracy(random) {
  const correct = ri(random, 60, 95); const total = 100;
  return make('분류 모델의 정확도를 구하세요.', `전체 ${total}개 중 정분류 ${correct}개`, `${correct}%`, 'Find the classification accuracy.', `정확도=${correct}/${total}×100=${correct}%입니다.`, 'Accuracy is correct predictions divided by all predictions.');
}
function workRate(random) {
  const hourly = ri(random, 10, 25) * 1000; const hours = ri(random, 4, 10); const overtime = ri(random, 0, 3); const pay = hourly * hours + hourly * 1.5 * overtime;
  return make('하루 임금을 구하세요.', `시급 ${hourly}원, 기본 ${hours}시간, 1.5배 연장 ${overtime}시간`, pay, 'Find the daily wage.', '기본임금과 연장임금을 더합니다.', 'Add regular and overtime pay.');
}
function mixtureRatio(random) {
  const total = ri(random, 5, 20) * 10; const percent = pick(random, [10, 20, 25, 30, 40]);
  return make('필요한 원료의 양을 구하세요.', `전체 ${total}kg의 ${percent}%`, total * percent / 100, 'Find the required material amount.', `${total}×${percent}/100=${total * percent / 100}kg입니다.`, 'Multiply the total by the percentage.');
}
function tolerance(random) {
  const target = ri(random, 20, 100); const tol = pick(random, [0.1, 0.2, 0.5, 1]);
  return make('허용되는 측정 범위를 쓰세요.', `${target}±${tol} mm`, `${target - tol},${target + tol}`, 'Write the acceptable measurement interval.', `최솟값은 ${target - tol}, 최댓값은 ${target + tol}입니다.`, 'Subtract and add the tolerance.');
}
function patternCulture(random) {
  const first = ri(random, 1, 8); const difference = ri(random, 2, 7); const n = ri(random, 5, 12);
  return make('전통 무늬의 반복 수열에서 n번째 수를 구하세요.', `${first}, ${first + difference}, ${first + 2 * difference}, …, n=${n}`, first + (n - 1) * difference, 'Find the nth term of the repeating design sequence.', '등차수열의 일반항을 사용합니다.', 'Use the arithmetic-sequence formula.');
}
function musicalRatio(random) {
  const base = pick(random, [220, 240, 264]);
  return make('진동수의 비가 3:2인 음의 진동수를 구하세요.', `기준음 ${base}Hz`, base * 3 / 2, 'Find the frequency in a 3:2 musical ratio.', `${base}×3/2=${base * 3 / 2}Hz입니다.`, 'Multiply the base frequency by 3/2.');
}
function symmetryChoice(random) {
  const choicesKo = ['정사각형', '일반 평행사변형', '부등변삼각형', '일반 사다리꼴']; const choicesEn = ['square', 'general parallelogram', 'scalene triangle', 'general trapezoid'];
  return make('선대칭축이 4개인 도형을 고르세요.', '', 1, 'Choose the shape with four axes of symmetry.', '정사각형은 선대칭축이 4개입니다.', 'A square has four axes of symmetry.', choice(choicesKo, choicesEn));
}
function sampleStatistic(random) {
  const data = Array.from({ length: 5 }, () => ri(random, 5, 25)); const total = data.reduce((s, v) => s + v, 0);
  if (total % 5) return sampleStatistic(random);
  return make('표본평균을 구하세요.', data.join(', '), total / 5, 'Find the sample mean.', `자료의 합 ${total}을 5로 나눕니다.`, `Divide the total ${total} by 5.`);
}
function standardDeviation(random) {
  const center = ri(random, 5, 20); const d = ri(random, 1, 5); const data = [center - d, center - d, center + d, center + d];
  return make('자료의 표준편차를 구하세요.', data.join(', '), d, 'Find the standard deviation.', `평균은 ${center}이고 편차의 제곱 평균은 ${d * d}이므로 표준편차는 ${d}입니다.`, `The mean is ${center}; the variance is ${d * d}, so the standard deviation is ${d}.`);
}
function regressionPrediction(random) {
  const slope = ri(random, 2, 6); const intercept = ri(random, -5, 10); const x = ri(random, 5, 15);
  return make('회귀직선으로 예측값을 구하세요.', `ŷ=${slope}x${signed(intercept)}, x=${x}`, slope * x + intercept, 'Use the regression line to predict y.', 'x값을 회귀식에 대입합니다.', 'Substitute x into the regression equation.');
}
function confidenceEstimate(random) {
  const mean = ri(random, 40, 90); const margin = ri(random, 2, 8);
  return make('추정 구간을 구하세요.', `표본평균 ${mean}, 오차한계 ${margin}`, `${mean - margin},${mean + margin}`, 'Find the estimate interval.', '표본평균에서 오차한계를 빼고 더합니다.', 'Subtract and add the margin of error.');
}
function researchVariables(random) {
  const choicesKo = ['하루 공부시간과 수학 점수', '학생 이름과 학번', '교실 번호와 학교 이름', '조사 날짜와 조사자 이름']; const choicesEn = ['daily study time and math score', 'student name and ID', 'classroom number and school name', 'survey date and researcher name'];
  return make('두 양의 관계를 탐구하기에 알맞은 변수 쌍을 고르세요.', '', 1, 'Choose variables suitable for investigating a quantitative relationship.', '공부시간과 점수는 수량으로 측정하여 관계를 분석할 수 있습니다.', 'Study time and score are quantitative variables suitable for relationship analysis.', choice(choicesKo, choicesEn));
}
function samplingDesign(random) {
  const choicesKo = ['학년별로 무작위 추출한다.', '친한 친구만 조사한다.', '첫 번째 반만 조사한다.', '응답하고 싶은 학생만 조사한다.']; const choicesEn = ['randomly sample within each grade', 'survey only close friends', 'survey only the first class', 'use only volunteers'];
  return make('학교 전체를 대표하기에 가장 적절한 표본추출 방법을 고르세요.', '', 1, 'Choose the best sampling method to represent the school.', '학년별 무작위 추출은 특정 집단에 치우치는 것을 줄입니다.', 'Stratified random sampling reduces group bias.', choice(choicesKo, choicesEn));
}
function modelSelection(random) {
  const choicesKo = ['산점도와 회귀직선', '원주율 계산', '소인수분해', '작도']; const choicesEn = ['scatterplot and regression line', 'computing pi', 'prime factorization', 'geometric construction'];
  return make('시간에 따른 온도 자료의 추세를 분석할 방법을 고르세요.', '', 1, 'Choose a method for analyzing a temperature trend over time.', '두 수량의 추세는 산점도와 회귀모델로 분석할 수 있습니다.', 'A scatterplot and regression model can analyze the trend.', choice(choicesKo, choicesEn));
}
function logicTruth(random) {
  const p = random() < 0.5; const q = random() < 0.5;
  return make('논리식 p→q의 진리값을 구하세요.', `p=${p ? '참' : '거짓'}, q=${q ? '참' : '거짓'}`, (!p || q) ? '참' : '거짓', 'Find the truth value of p→q.', 'p가 참이고 q가 거짓일 때만 거짓입니다.', 'An implication is false only when p is true and q is false.');
}
function graphDegree(random) {
  const degrees = Array.from({ length: 5 }, () => ri(random, 1, 4)); const sum = degrees.reduce((s, v) => s + v, 0); if (sum % 2) return graphDegree(random);
  return make('그래프의 모서리 수를 구하세요.', `꼭짓점의 차수: ${degrees.join(', ')}`, sum / 2, 'Find the number of edges in the graph.', '차수의 합은 모서리 수의 두 배입니다.', 'The degree sum equals twice the number of edges.');
}
function recurrenceTerm(random) {
  const first = ri(random, 1, 5); const add = ri(random, 2, 6); const n = ri(random, 5, 10);
  return make('점화식으로 정의된 수열의 항을 구하세요.', `a₁=${first}, aₙ₊₁=aₙ+${add}, a_${n}`, first + (n - 1) * add, 'Find the requested recursively defined term.', '앞 항에서 일정한 수를 반복해 더합니다.', 'Repeatedly add the constant difference.');
}
function complexPolar(random) {
  const r = ri(random, 2, 8); const angle = pick(random, [0, 90, 180, 270]); const values = { 0: `${r}`, 90: `${r}i`, 180: `${-r}`, 270: `−${r}i` };
  return make('복소수의 극형식을 직교형식으로 나타내세요.', `${r}(cos ${angle}°+i sin ${angle}°)`, values[angle], 'Convert the complex number from polar to rectangular form.', '특수각의 사인과 코사인 값을 대입합니다.', 'Substitute the sine and cosine values of the special angle.');
}
function matrixDeterminant(random) {
  const a = ri(random, -5, 5); const b = ri(random, -5, 5); const c = ri(random, -5, 5); const d = ri(random, -5, 5);
  return make('행렬식의 값을 구하세요.', `|${a},${b};${c},${d}|`, a * d - b * c, 'Find the determinant.', `ad−bc=${a * d - b * c}입니다.`, 'Use ad−bc.');
}
function advancedLimit(random) {
  const a = ri(random, 1, 6); const b = ri(random, 1, 6);
  return make('극한값을 구하세요.', `lim_(x→0) sin(${a}x)/(${b}x)`, frac(a, b), 'Evaluate the limit.', 'lim sin u/u=1을 이용합니다.', 'Use lim(sin u/u)=1.');
}
function seriesConvergence(random) {
  const p = pick(random, [0.5, 1, 2, 3]); const answer = p > 1 ? 1 : 2;
  return make('급수의 수렴·발산을 고르세요.', `Σ_(n=1)^∞ 1/n^${p}`, answer, 'Classify the series as convergent or divergent.', 'p급수는 p>1일 때 수렴합니다.', 'A p-series converges exactly when p>1.', choice(['수렴', '발산'], ['convergent', 'divergent']));
}
function spatialVector(random) {
  const a = [ri(random, -4, 4), ri(random, -4, 4), ri(random, -4, 4)]; const b = [ri(random, -4, 4), ri(random, -4, 4), ri(random, -4, 4)];
  return make('공간벡터의 내적을 구하세요.', `a=⟨${a}⟩, b=⟨${b}⟩`, a.reduce((s, v, i) => s + v * b[i], 0), 'Find the dot product of the 3D vectors.', '대응 성분을 곱하여 더합니다.', 'Multiply corresponding components and add.');
}

export const KOREAN_ELECTIVE_UNITS = [
  unit('bm1-expression', '문자와 식', '식의 값', 'Evaluating expressions', '대입을 이용한 식의 계산', 'Evaluate expressions by substitution', BM1, basicExpression),
  unit('bm1-equation', '방정식과 부등식', '일차방정식', 'Linear equations', '기본 일차방정식 풀이', 'Solve basic linear equations', BM1, basicEquation),
  unit('bm1-financial-percent', '금융수학', '생활 속 백분율', 'Everyday percentages', '가격·할인·이율의 기초', 'Use percentages in daily contexts', BM1, simpleInterest),
  unit('bm2-function', '함수', '함수와 그래프 기초', 'Functions & graphs', '일차함수의 값과 관계', 'Evaluate and interpret linear functions', BM2, basicFunction),
  unit('bm2-coordinate', '도형의 방정식', '좌표와 중점', 'Coordinates & midpoints', '좌표평면에서 중점 계산', 'Calculate midpoints in the coordinate plane', BM2, basicCoordinate),
  unit('bm2-statistics', '확률과 통계', '자료의 평균', 'Data averages', '생활 자료의 평균 계산', 'Calculate averages of everyday data', BM2, sampleStatistic),
  unit('econ-simple-interest', '금융수학', '단리', 'Simple interest', '원금·이율·기간과 단리', 'Model simple interest', ECON, simpleInterest),
  unit('econ-compound-growth', '금융수학', '복리와 지수성장', 'Compound growth', '복리와 지수함수 모델', 'Model compound growth', ECON, compoundGrowth),
  unit('econ-supply-demand', '경제 모델링', '수요·공급과 균형', 'Supply, demand & equilibrium', '일차함수로 시장 균형 분석', 'Analyze market equilibrium with linear functions', ECON, supplyDemand),
  unit('econ-exchange-rate', '금융수학', '환율', 'Exchange rates', '환율을 이용한 화폐 변환', 'Convert currencies using exchange rates', ECON, exchangeRate),
  unit('ai-vector-distance', '데이터와 모델링', '데이터 벡터와 거리', 'Data vectors & distance', '특징 벡터 사이 거리', 'Measure distances between feature vectors', AI, vectorDistance),
  unit('ai-linear-prediction', '데이터와 모델링', '선형 예측', 'Linear prediction', '가중합과 편향을 이용한 예측', 'Predict with weighted sums and bias', AI, weightedPrediction),
  unit('ai-loss-function', '데이터와 모델링', '손실함수', 'Loss functions', '평균제곱오차 계산', 'Calculate mean squared error', AI, meanSquaredError),
  unit('ai-classification', '데이터와 모델링', '분류 정확도', 'Classification accuracy', '분류 결과의 정확도 해석', 'Interpret classification accuracy', AI, confusionAccuracy),
  unit('job-wages', '직무수학', '임금과 근무시간', 'Wages & working time', '기본급과 연장근무 계산', 'Calculate regular and overtime wages', JOB, workRate),
  unit('job-mixtures', '직무수학', '배합과 비율', 'Mixtures & ratios', '작업 현장의 백분율과 배합', 'Apply percentages to workplace mixtures', JOB, mixtureRatio),
  unit('job-tolerance', '직무수학', '측정과 허용오차', 'Measurement & tolerance', '측정값의 허용 범위', 'Interpret measurement tolerances', JOB, tolerance),
  unit('culture-patterns', '탐구와 문화', '문화 속 수열과 무늬', 'Patterns in culture', '전통 무늬의 반복과 수열', 'Explore sequences in cultural designs', CULT, patternCulture),
  unit('culture-music-ratios', '탐구와 문화', '음악과 비', 'Music & ratios', '음정과 진동수의 비', 'Connect musical intervals and ratios', CULT, musicalRatio),
  unit('culture-symmetry', '탐구와 문화', '예술과 대칭', 'Art & symmetry', '도형과 문양의 대칭성', 'Explore symmetry in art and design', CULT, symmetryChoice),
  unit('pstat-sampling', '실용통계', '자료와 표본', 'Data & samples', '표본자료의 요약', 'Summarize sample data', PSTAT, sampleStatistic),
  unit('pstat-spread', '실용통계', '산포와 표준편차', 'Spread & standard deviation', '자료의 퍼진 정도 분석', 'Analyze data spread', PSTAT, standardDeviation),
  unit('pstat-regression', '실용통계', '상관과 회귀', 'Correlation & regression', '회귀모델을 이용한 예측', 'Predict with regression models', PSTAT, regressionPrediction),
  unit('pstat-inference', '실용통계', '통계적 추정', 'Statistical inference', '오차한계와 추정 구간', 'Interpret margins of error and intervals', PSTAT, confidenceEstimate),
  unit('project-variables', '수학과제 탐구', '탐구 문제와 변수', 'Research questions & variables', '측정 가능한 탐구 변수 설정', 'Define measurable research variables', PROJECT, researchVariables),
  unit('project-sampling', '수학과제 탐구', '자료 수집 설계', 'Data-collection design', '대표성 있는 표본 설계', 'Design representative samples', PROJECT, samplingDesign),
  unit('project-model-selection', '수학과제 탐구', '수학적 모델 선택', 'Choosing mathematical models', '탐구 목적에 맞는 모델 선택', 'Choose models suited to research goals', PROJECT, modelSelection),
  unit('professional-modeling', '고급수학', '전문 수학 모델링', 'Professional mathematical modeling', '함수·행렬·미적분을 연결한 모델', 'Connect functions, matrices and calculus', PROF, weightedPrediction),
  unit('professional-calculus', '고급수학', '전문 미적분 기초', 'Professional calculus foundations', '극한과 변화율의 심화', 'Extend limits and rates of change', PROF, advancedLimit),
  unit('professional-vectors', '고급수학', '전문 벡터 기초', 'Professional vector foundations', '공간벡터와 내적', 'Use spatial vectors and dot products', PROF, spatialVector),
  unit('discrete-logic', '이산수학', '명제논리', 'Propositional logic', '진리표와 논리연산', 'Use truth tables and logical operations', DISC, logicTruth),
  unit('discrete-graphs', '이산수학', '그래프 이론', 'Graph theory', '차수와 모서리의 관계', 'Relate vertex degrees and edges', DISC, graphDegree),
  unit('discrete-recurrence', '이산수학', '점화식', 'Recurrence relations', '점화식으로 수열 계산', 'Evaluate recursively defined sequences', DISC, recurrenceTerm),
  unit('advanced-algebra-complex', '고급수학', '복소수의 극형식', 'Polar form of complex numbers', '복소수의 극형식과 직교형식', 'Convert complex-number representations', AALG, complexPolar),
  unit('advanced-algebra-matrices', '고급수학', '행렬식', 'Determinants', '2차 행렬식의 계산과 의미', 'Calculate and interpret determinants', AALG, matrixDeterminant),
  unit('advanced-algebra-recurrence', '고급수학', '점화식과 수열', 'Recurrences & sequences', '대수적 점화식 분석', 'Analyze algebraic recurrences', AALG, recurrenceTerm),
  unit('advanced-calculus-limits', '고급수학', '삼각함수의 극한', 'Trigonometric limits', '기본 극한을 이용한 계산', 'Evaluate trigonometric limits', ACALC, advancedLimit),
  unit('advanced-calculus-series', '고급수학', '무한급수 판정', 'Infinite-series tests', 'p급수의 수렴과 발산', 'Test p-series convergence', ACALC, seriesConvergence),
  unit('advanced-calculus-modeling', '고급수학', '변화율 모델링', 'Rate-of-change modeling', '고급 함수의 변화율 해석', 'Model rates of change', ACALC, weightedPrediction),
  unit('advanced-geometry-vectors', '고급기하', '공간벡터', 'Spatial vectors', '3차원 벡터의 연산', 'Operate with vectors in three dimensions', AGEO, spatialVector),
  unit('advanced-geometry-determinant', '고급기하', '행렬식과 넓이', 'Determinants & area', '행렬식으로 변환과 넓이 해석', 'Interpret transformations and area with determinants', AGEO, matrixDeterminant),
  unit('advanced-geometry-coordinates', '고급기하', '공간좌표', 'Spatial coordinates', '공간에서 거리와 위치 관계', 'Analyze distance and position in space', AGEO, vectorDistance),
];
