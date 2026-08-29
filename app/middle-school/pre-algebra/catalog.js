import { PRIME_UNITS } from '../prime-factorization/catalog';
import { GCD_LCM_UNITS } from '../gcd-lcm/catalog';
import { INTEGER_RATIONAL_UNITS } from '../integers-rationals/catalog';
import { ALGEBRA_UNITS } from '../algebra-basics/catalog';
import { COORDINATE_UNITS } from '../coordinate-plane/catalog';
import { PROPORTION_UNITS } from '../proportion/catalog';
import { SECONDARY_ALGEBRA_UNITS } from './secondaryAlgebraEngine';
import { ALGEBRA_COMPLETION_UNITS } from './algebraCompletionEngine';
import { KOREAN_HIGH2_UNITS } from './koreanHigh2Engine';

function randomInt(random, min, max) {
  return Math.floor(random() * (max - min + 1)) + min;
}

function pick(random, values) {
  return values[Math.floor(random() * values.length)];
}

function gcd(a, b) {
  let left = Math.abs(a);
  let right = Math.abs(b);
  while (right) [left, right] = [right, left % right];
  return left || 1;
}

function fraction(n, d) {
  const divisor = gcd(n, d);
  const sign = d < 0 ? -1 : 1;
  const numerator = sign * n / divisor;
  const denominator = Math.abs(d) / divisor;
  return denominator === 1 ? String(numerator) : `${numerator}/${denominator}`;
}

function problem(prompt, expression, answer, extra = {}) {
  return { prompt, expression, answer: String(answer), ...extra };
}

function orderOfOperations(random) {
  const a = randomInt(random, 2, 12);
  const b = randomInt(random, 2, 9);
  const c = randomInt(random, 2, 8);
  const d = randomInt(random, 1, 9);
  const mode = randomInt(random, 0, 2);
  if (mode === 0) return problem('연산 순서에 따라 계산하세요.', `${a} + ${b} × ${c}`, a + b * c, { promptEn: 'Evaluate using the order of operations.', explanation: `곱셈을 먼저 계산하면 ${b}×${c}=${b * c}이고, ${a}+${b * c}=${a + b * c}입니다.`, explanationEn: `Multiply first: ${b}×${c}=${b * c}, then add ${a} to get ${a + b * c}.` });
  if (mode === 1) return problem('연산 순서에 따라 계산하세요.', `(${a} + ${b}) × ${c} − ${d}`, (a + b) * c - d, { promptEn: 'Evaluate using the order of operations.', explanation: `괄호, 곱셈, 뺄셈 순서로 계산하면 (${a}+${b})×${c}−${d}=${(a + b) * c - d}입니다.`, explanationEn: `Evaluate the parentheses, multiply, then subtract to get ${(a + b) * c - d}.` });
  const square = randomInt(random, 2, 7);
  return problem('연산 순서에 따라 계산하세요.', `${square}^2 + ${a} ÷ ${pick(random, [1, 2, 4])}`, '', {
    makeAnswer: true,
    promptEn: 'Evaluate using the order of operations.',
    calculate(item) {
      const divisor = Number(item.expression.split('÷')[1].trim());
      return String(square ** 2 + a / divisor);
    },
  });
}

function decimalOperations(random) {
  const a = randomInt(random, 12, 999) / 10;
  const b = randomInt(random, 11, 199) / 10;
  const mode = randomInt(random, 0, 2);
  if (mode === 0) return problem('소수를 계산하세요.', `${a.toFixed(1)} + ${b.toFixed(1)}`, (a + b).toFixed(1), { promptEn: 'Calculate with decimals.', explanation: '소수점을 세로로 맞추어 더합니다.', explanationEn: 'Align the decimal points and add.' });
  if (mode === 1) {
    const larger = Math.max(a, b);
    const smaller = Math.min(a, b);
    return problem('소수를 계산하세요.', `${larger.toFixed(1)} − ${smaller.toFixed(1)}`, (larger - smaller).toFixed(1), { promptEn: 'Calculate with decimals.', explanation: '소수점을 세로로 맞추어 뺍니다.', explanationEn: 'Align the decimal points and subtract.' });
  }
  const whole = randomInt(random, 2, 12);
  return problem('소수를 계산하세요.', `${a.toFixed(1)} × ${whole}`, (a * whole).toFixed(1).replace(/\.0$/, ''), { promptEn: 'Calculate with decimals.', explanation: `${a.toFixed(1)}를 ${whole}번 더한 값과 같습니다.`, explanationEn: `This is the same as adding ${a.toFixed(1)} a total of ${whole} times.` });
}

function fractionOperations(random) {
  const b = randomInt(random, 3, 12);
  const d = randomInt(random, 3, 12);
  const a = randomInt(random, 1, b - 1);
  const c = randomInt(random, 1, d - 1);
  const mode = randomInt(random, 0, 2);
  if (mode === 0) return problem('분수를 계산하고 기약분수로 나타내세요.', `${a}/${b} + ${c}/${d}`, fraction(a * d + c * b, b * d), { promptEn: 'Calculate and simplify.', explanation: `공통분모 ${b * d}로 통분한 뒤 분자를 더하고 약분합니다.`, explanationEn: `Use the common denominator ${b * d}, add the numerators, and simplify.` });
  if (mode === 1) return problem('분수를 계산하고 기약분수로 나타내세요.', `${a}/${b} × ${c}/${d}`, fraction(a * c, b * d), { promptEn: 'Calculate and simplify.', explanation: '분자는 분자끼리, 분모는 분모끼리 곱한 뒤 약분합니다.', explanationEn: 'Multiply numerators and denominators, then simplify.' });
  return problem('분수를 계산하고 기약분수로 나타내세요.', `${a}/${b} ÷ ${c}/${d}`, fraction(a * d, b * c), { promptEn: 'Calculate and simplify.', explanation: `나누는 수 ${c}/${d}의 역수 ${d}/${c}를 곱하고 약분합니다.`, explanationEn: `Multiply by the reciprocal ${d}/${c}, then simplify.` });
}

function fractionDecimalPercent(random) {
  const percent = pick(random, [5, 10, 12.5, 20, 25, 30, 40, 50, 60, 75, 80]);
  const mode = randomInt(random, 0, 2);
  const decimal = percent / 100;
  if (mode === 0) return problem('백분율을 소수로 나타내세요.', `${percent}%`, String(decimal), { promptEn: 'Write the percent as a decimal.', explanation: `${percent}%=${percent}/100=${decimal}입니다.`, explanationEn: `${percent}% means ${percent}/100, which is ${decimal}.` });
  if (mode === 1) return problem('소수를 백분율로 나타내세요.', String(decimal), `${percent}%`, { promptEn: 'Write the decimal as a percent.', explanation: `${decimal}에 100을 곱하고 %를 붙입니다.`, explanationEn: `Multiply ${decimal} by 100 and attach the percent sign.` });
  const scaled = Number.isInteger(percent) ? fraction(percent, 100) : fraction(Math.round(percent * 10), 1000);
  return problem('백분율을 기약분수로 나타내세요.', `${percent}%`, scaled, { promptEn: 'Write the percent as a fraction in simplest form.', explanation: `${percent}%를 100분의 수로 나타낸 뒤 약분합니다.`, explanationEn: `Write ${percent}% over 100 and simplify.` });
}

function ratioRate(random) {
  const baseA = randomInt(random, 2, 9);
  const baseB = randomInt(random, 2, 9);
  const divisor = gcd(baseA, baseB);
  const a = baseA / divisor;
  const b = baseB / divisor;
  const multiplier = randomInt(random, 2, 8);
  const missingMultiplier = randomInt(random, 2, 8);
  const table = [[a, b], [a * multiplier, b * multiplier], [a * missingMultiplier, null]];
  return problem('같은 비를 나타내는 표에서 □에 알맞은 수를 구하세요.', '', b * missingMultiplier, {
    kind: 'ratio-table', table, promptEn: 'Find the missing value in the equivalent-ratio table.',
    explanation: `${a}:${b}에서 두 항에 ${missingMultiplier}를 곱하므로 □=${b}×${missingMultiplier}=${b * missingMultiplier}입니다.`,
    explanationEn: `Multiply both terms of ${a}:${b} by ${missingMultiplier}, so the missing value is ${b * missingMultiplier}.`,
  });
}

function percentProblems(random) {
  const percent = pick(random, [10, 15, 20, 25, 30, 40, 50, 60, 75, 80]);
  const unit = pick(random, [4, 5, 10, 20]);
  const whole = unit * randomInt(random, 3, 12);
  const part = whole * percent / 100;
  if (Number.isInteger(part)) return problem(`${whole}의 ${percent}%를 구하세요.`, '', part, { promptEn: `Find ${percent}% of ${whole}.`, explanation: `${whole}×${percent}/100=${part}입니다.`, explanationEn: `${whole}×${percent}/100=${part}.` });
  return percentProblems(random);
}

function oneStepInequality(random) {
  const answer = randomInt(random, -8, 10);
  const coefficient = pick(random, [2, 3, 4, 5]);
  const symbol = pick(random, ['<', '≤', '>', '≥']);
  const reverse = { '<': '>', '≤': '≥', '>': '<', '≥': '≤' };
  if (random() < 0.65) return problem('부등식을 푸세요.', `${coefficient}x ${symbol} ${coefficient * answer}`, `x ${symbol} ${answer}`, { promptEn: 'Solve the inequality.', explanation: `양수 ${coefficient}로 양변을 나누면 부등호 방향은 그대로입니다.`, explanationEn: `Divide both sides by positive ${coefficient}; the inequality sign stays the same.` });
  return problem('부등식을 푸세요.', `${-coefficient}x ${symbol} ${-coefficient * answer}`, `x ${reverse[symbol]} ${answer}`, { promptEn: 'Solve the inequality.', explanation: `음수 ${-coefficient}로 양변을 나누므로 부등호 방향을 바꿉니다.`, explanationEn: `Dividing by negative ${-coefficient} reverses the inequality sign.` });
}

function centerAndSpread(random) {
  const count = pick(random, [5, 7]);
  const data = Array.from({ length: count }, () => randomInt(random, 2, 18)).sort((a, b) => a - b);
  const mode = randomInt(random, 0, 2);
  if (mode === 0) {
    const total = data.reduce((sum, value) => sum + value, 0);
    if (total % count !== 0) return centerAndSpread(random);
    return problem('자료의 평균을 구하세요.', data.join(', '), total / count, { kind: 'data-set', data, promptEn: 'Find the mean of the data.', explanation: `자료의 합 ${total}을 자료의 수 ${count}로 나누면 평균은 ${total / count}입니다.`, explanationEn: `Divide the sum ${total} by ${count} values to get ${total / count}.` });
  }
  if (mode === 1) return problem('자료의 중앙값을 구하세요.', data.join(', '), data[Math.floor(count / 2)], { kind: 'data-set', data, promptEn: 'Find the median of the data.', explanation: `크기순으로 놓았을 때 가운데 값은 ${data[Math.floor(count / 2)]}입니다.`, explanationEn: `The middle value in order is ${data[Math.floor(count / 2)]}.` });
  return problem('자료의 범위를 구하세요.', data.join(', '), data[data.length - 1] - data[0], { kind: 'data-set', data, promptEn: 'Find the range of the data.', explanation: `최댓값 ${data[data.length - 1]}에서 최솟값 ${data[0]}을 빼면 ${data[data.length - 1] - data[0]}입니다.`, explanationEn: `Subtract the minimum ${data[0]} from the maximum ${data[data.length - 1]}.` });
}

function stemLeaf(random) {
  const stemA = randomInt(random, 1, 4);
  const stemB = stemA + 1;
  const leavesA = Array.from({ length: randomInt(random, 3, 5) }, () => randomInt(random, 0, 9)).sort((a, b) => a - b);
  const leavesB = Array.from({ length: randomInt(random, 3, 5) }, () => randomInt(random, 0, 9)).sort((a, b) => a - b);
  const all = [...leavesA.map((leaf) => stemA * 10 + leaf), ...leavesB.map((leaf) => stemB * 10 + leaf)].sort((a, b) => a - b);
  const mode = randomInt(random, 0, 1);
  if (mode === 0) return problem('줄기와 잎 그림에서 자료의 최댓값을 구하세요.', '', all[all.length - 1], { kind: 'stem-leaf', stemLeaf: [[stemA, leavesA], [stemB, leavesB]], promptEn: 'Find the maximum value in the stem-and-leaf plot.', explanation: `가장 큰 줄기의 가장 큰 잎을 읽으면 ${all[all.length - 1]}입니다.`, explanationEn: `Read the largest leaf on the largest stem: ${all[all.length - 1]}.` });
  return problem('줄기와 잎 그림에 나타난 자료의 개수를 구하세요.', '', all.length, { kind: 'stem-leaf', stemLeaf: [[stemA, leavesA], [stemB, leavesB]], promptEn: 'How many data values are shown?', explanation: `잎의 개수를 모두 세면 ${all.length}개입니다.`, explanationEn: `There are ${all.length} leaves, so there are ${all.length} data values.` });
}

function frequencyTable(random) {
  const frequencies = Array.from({ length: 4 }, () => randomInt(random, 2, 9));
  const total = frequencies.reduce((sum, value) => sum + value, 0);
  const index = randomInt(random, 0, 3);
  const mode = randomInt(random, 0, 1);
  const table = frequencies.map((frequency, row) => ({ interval: `${row * 10}~${row * 10 + 9}`, frequency }));
  if (mode === 0) return problem('도수분포표에서 전체 도수의 합을 구하세요.', '', total, { kind: 'frequency-table', frequencyTable: table, promptEn: 'Find the total frequency.', explanation: `각 계급의 도수를 더하면 ${frequencies.join('+')}=${total}입니다.`, explanationEn: `Add all class frequencies to get ${total}.` });
  const relative = frequencies[index] / total;
  return problem(`도수분포표에서 ${table[index].interval} 계급의 상대도수를 소수로 구하세요.`, '', String(Number(relative.toFixed(3))), { kind: 'frequency-table', frequencyTable: table, promptEn: `Find the relative frequency for the ${table[index].interval} class as a decimal.`, explanation: `상대도수는 ${frequencies[index]}÷${total}=${Number(relative.toFixed(3))}입니다.`, explanationEn: `Relative frequency is ${frequencies[index]}÷${total}=${Number(relative.toFixed(3))}.` });
}

const NEW_UNITS = [
  { id: 'order-of-operations', label: '연산 순서와 거듭제곱', description: '괄호·지수·곱셈과 나눗셈·덧셈과 뺄셈 순서', en: ['Order of operations', 'Evaluate expressions using grouping, exponents and operation order'], profiles: ['pre-algebra'], category: '수와 연산', make: orderOfOperations },
  { id: 'decimal-operations', label: '소수의 사칙계산', description: '여러 자리 소수의 덧셈·뺄셈·곱셈', en: ['Decimal operations', 'Add, subtract and multiply multi-digit decimals'], profiles: ['pre-algebra'], category: '수와 연산', make: decimalOperations },
  { id: 'fraction-operations', label: '분수의 사칙계산', description: '분수의 덧셈·곱셈·나눗셈과 약분', en: ['Fraction operations', 'Add, multiply and divide fractions'], profiles: ['pre-algebra'], category: '수와 연산', make: fractionOperations },
  { id: 'fraction-decimal-percent', label: '분수·소수·백분율 변환', description: '세 가지 표현을 서로 바꾸기', en: ['Fractions, decimals & percents', 'Convert among fractions, decimals and percents'], profiles: ['pre-algebra'], category: '비와 비율', make: fractionDecimalPercent },
  { id: 'ratio-rate-table', label: '비와 단위율', description: '같은 비를 나타내는 표와 단위율', en: ['Ratios & unit rates', 'Complete equivalent-ratio tables and reason about unit rates'], profiles: ['pre-algebra'], category: '비와 비율', make: ratioRate },
  { id: 'percent-problems', label: '백분율 활용', description: '전체의 백분율에 해당하는 양 구하기', en: ['Percent problems', 'Find a percent of a quantity'], profiles: ['pre-algebra'], category: '비와 비율', make: percentProblems },
  { id: 'one-step-inequality', label: '일차부등식 기초', description: '한 단계 부등식을 풀고 음수로 나눌 때 방향 바꾸기', en: ['One-step inequalities', 'Solve one-step inequalities, including division by negatives'], profiles: ['pre-algebra'], category: '문자와 식', make: oneStepInequality },
  { id: 'center-spread', label: '평균·중앙값·범위', description: '자료의 중심과 퍼진 정도를 수로 요약하기', en: ['Center & spread', 'Find mean, median and range'], profiles: ['pre-algebra', 'kr-middle-1'], category: '자료와 가능성', make: centerAndSpread },
  { id: 'stem-leaf', label: '줄기와 잎 그림', description: '줄기와 잎 그림을 읽고 자료의 특징 파악하기', en: ['Stem-and-leaf plots', 'Read and interpret stem-and-leaf plots'], profiles: ['kr-middle-1'], category: '자료와 가능성', make: stemLeaf },
  { id: 'frequency-table', label: '도수분포표와 상대도수', description: '계급의 도수와 상대도수 구하기', en: ['Frequency tables', 'Read class frequencies and calculate relative frequencies'], profiles: ['pre-algebra', 'kr-middle-1'], category: '자료와 가능성', make: frequencyTable },
];

const SOURCE_GROUPS = [
  ['수와 연산', ['pre-algebra', 'kr-middle-1'], PRIME_UNITS],
  ['수와 연산', ['pre-algebra', 'kr-middle-1'], GCD_LCM_UNITS],
  ['수와 연산', ['pre-algebra', 'kr-middle-1'], INTEGER_RATIONAL_UNITS],
  ['문자와 식', ['pre-algebra', 'kr-middle-1', 'kr-middle-2', 'algebra-1'], ALGEBRA_UNITS],
  ['좌표와 관계', ['pre-algebra', 'kr-middle-1', 'kr-middle-2', 'algebra-1'], COORDINATE_UNITS],
  ['좌표와 관계', ['pre-algebra', 'kr-middle-1', 'algebra-1'], PROPORTION_UNITS],
];

const IMPORTED_UNITS = SOURCE_GROUPS.flatMap(([category, profiles, units]) => units.map((unit) => ({ ...unit, category, profiles })));

export const PRE_ALGEBRA_UNITS = [...IMPORTED_UNITS, ...NEW_UNITS, ...SECONDARY_ALGEBRA_UNITS, ...ALGEBRA_COMPLETION_UNITS, ...KOREAN_HIGH2_UNITS];

export const PRE_ALGEBRA_PROFILES = [
  { id: 'kr-middle-1', label: '한국 중학교 1학년', labelEn: 'Korea Middle School 1', description: '2022 개정 교육과정의 비기하 전 범위', descriptionEn: 'All non-geometry Grade 7 topics in Korea’s 2022 curriculum' },
  { id: 'kr-middle-2', label: '한국 중학교 2학년', labelEn: 'Korea Middle School 2', description: '식의 계산·부등식·연립방정식·일차함수·확률', descriptionEn: 'Expressions, inequalities, systems, linear functions and probability' },
  { id: 'kr-middle-3', label: '한국 중학교 3학년', labelEn: 'Korea Middle School 3', description: '제곱근·인수분해·이차방정식·이차함수·통계', descriptionEn: 'Radicals, factoring, quadratics and data transformations' },
  { id: 'kr-high-1', label: '한국 고등학교 1학년', labelEn: 'Korea High School 1', description: '공통수학 1·2 전 영역 생성 템플릿', descriptionEn: 'Complete generator coverage for Korea Common Mathematics 1–2' },
  { id: 'kr-high-2-algebra', label: '한국 고2 · 대수', labelEn: 'Korea Grade 11 · Algebra', description: '2022 개정 교육과정 대수: 지수·로그, 삼각함수, 수열', descriptionEn: 'Korea 2022 Algebra: exponents, logarithms, trigonometry and sequences' },
  { id: 'kr-high-2-calculus-1', label: '한국 고2 · 미적분Ⅰ', labelEn: 'Korea Grade 11 · Calculus I', description: '2022 개정 교육과정 미적분Ⅰ: 극한·연속, 미분, 적분', descriptionEn: 'Korea 2022 Calculus I: limits, continuity, derivatives and integrals' },
  { id: 'kr-high-2-probability-statistics', label: '한국 고2 · 확률과 통계', labelEn: 'Korea Grade 11 · Probability & Statistics', description: '2022 개정 교육과정 확률과 통계: 경우의 수, 확률분포, 통계적 추정', descriptionEn: 'Korea 2022 Probability & Statistics: counting, distributions and inference' },
  { id: 'pre-algebra', label: 'Pre-Algebra', labelEn: 'Pre-Algebra', description: '미국 Grade 6~8 대수 준비 핵심 범위', descriptionEn: 'Core non-geometry preparation across U.S. Grades 6–8' },
  { id: 'algebra-1', label: 'Algebra 1', labelEn: 'Algebra 1', description: 'Common Core 대수·함수·모델링 전 영역 생성 템플릿', descriptionEn: 'Complete Common Core Algebra/Functions/Modeling generator coverage' },
  { id: 'algebra-2', label: 'Algebra 2', labelEn: 'Algebra 2', description: '확장 대수·함수·통계·삼각함수 전 영역 생성 템플릿', descriptionEn: 'Complete extended algebra, functions, statistics and trigonometry generator coverage' },
];

export function unitsForProfile(profileId) {
  return PRE_ALGEBRA_UNITS.filter((unit) => unit.profiles.includes(profileId));
}

export function findPreAlgebraProfile(profileId) {
  return PRE_ALGEBRA_PROFILES.find((profile) => profile.id === profileId) || PRE_ALGEBRA_PROFILES[0];
}

export function findPreAlgebraUnit(unitId, profileId = 'kr-middle-1') {
  const units = unitsForProfile(profileId);
  return units.find((unit) => unit.id === unitId) || units[0];
}

export function localizePreAlgebraUnit(unit, language, field = 'label') {
  if (language === 'ko') return unit[field];
  return unit.en?.[field === 'label' ? 0 : 1] || unit[field];
}

export function finalizeGeneratedProblem(item, unit) {
  let finalized = { ...item };
  if (finalized.makeAnswer && typeof finalized.calculate === 'function') finalized.answer = finalized.calculate(finalized);
  delete finalized.makeAnswer;
  delete finalized.calculate;
  if (Array.isArray(finalized.choices)) {
    finalized.kind = 'choice';
    finalized.choicesKo = finalized.choices.map((choice) => choice.label ?? String(choice));
    finalized.choicesEn = finalized.choices.map((choice) => choice.labelEn ?? choice.label ?? String(choice));
  }
  finalized.answer = String(finalized.answer);
  finalized.category = unit.category;
  const choiceIndex = Number(finalized.answer) - 1;
  const answerKo = finalized.kind === 'choice' && finalized.choicesKo?.[choiceIndex] ? finalized.choicesKo[choiceIndex] : finalized.answer;
  const answerEn = finalized.kind === 'choice' && finalized.choicesEn?.[choiceIndex] ? finalized.choicesEn[choiceIndex] : finalized.answer;
  finalized.explanation ||= `${unit.label}의 정의와 계산 규칙을 적용하면 정답은 ${answerKo}입니다.`;
  finalized.explanationEn ||= `Applying the definition and calculation rules gives ${answerEn}.`;
  return finalized;
}
