import { PRIME_BASIC_UNITS } from '../prime-factorization/catalog';
import { GCD_LCM_BASIC_UNITS } from '../gcd-lcm/catalog';
import { INTEGER_RATIONAL_UNITS, RPM_RATIONAL_DECIMALS_APPLIED_UNITS } from '../integers-rationals/catalog';
import { ALGEBRA_UNITS, RPM_ALGEBRA_APPLIED_UNITS } from '../algebra-basics/catalog';
import { COORDINATE_UNITS } from '../coordinate-plane/catalog';
import { PROPORTION_UNITS } from '../proportion/catalog';
import { SECONDARY_ALGEBRA_UNITS } from './secondaryAlgebraEngine';
import { ALGEBRA_COMPLETION_UNITS } from './algebraCompletionEngine';
import { KOREAN_HIGH2_UNITS } from './koreanHigh2Engine';
import { PRECALCULUS_UNITS } from './precalculusEngine';
import { KOREAN_HIGH3_UNITS } from './koreanHigh3Engine';
import { AP_CALCULUS_UNITS } from './apCalculusEngine';

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
  const stemA = randomInt(random, 1, 3);
  const stemB = stemA + 1;
  const leavesA = Array.from({ length: randomInt(random, 3, 6) }, () => randomInt(random, 0, 9)).sort((a, b) => a - b);
  const leavesB = Array.from({ length: randomInt(random, 3, 6) }, () => randomInt(random, 0, 9)).sort((a, b) => a - b);
  if (leavesA.length === leavesB.length) return stemLeaf(random);
  const all = [...leavesA.map((leaf) => stemA * 10 + leaf), ...leavesB.map((leaf) => stemB * 10 + leaf)].sort((a, b) => a - b);
  const visual = { kind: 'stem-leaf', stemLeaf: [[stemA, leavesA], [stemB, leavesB]] };
  const mode = randomInt(random, 0, 5);
  if (mode === 0) return problem('줄기와 잎 그림에서 자료의 최댓값을 구하세요.', '', all[all.length - 1], { ...visual, promptEn: 'Find the maximum value in the stem-and-leaf plot.', explanation: `가장 큰 줄기의 가장 큰 잎을 읽으면 ${all[all.length - 1]}입니다.`, explanationEn: `Read the largest leaf on the largest stem: ${all[all.length - 1]}.` });
  if (mode === 1) return problem('줄기와 잎 그림에 나타난 자료의 개수를 구하세요.', '', all.length, { ...visual, promptEn: 'How many data values are shown?', explanation: `잎의 개수를 모두 세면 ${all.length}개입니다.`, explanationEn: `There are ${all.length} leaves, so there are ${all.length} data values.` });
  if (mode === 2) {
    const answerStem = leavesA.length > leavesB.length ? stemA : stemB;
    return problem('잎이 가장 많은 줄기를 구하세요.', '', answerStem, { ...visual, promptEn: 'Which stem has the most leaves?', explanation: `줄기 ${stemA}은 잎 ${leavesA.length}개, 줄기 ${stemB}은 잎 ${leavesB.length}개이므로 잎이 더 많은 줄기는 ${answerStem}입니다.`, explanationEn: `Stem ${stemA} has ${leavesA.length} leaves and stem ${stemB} has ${leavesB.length}; the stem with more leaves is ${answerStem}.` });
  }
  if (mode === 3) {
    const targetStem = pick(random, [stemA, stemB]);
    const leaves = targetStem === stemA ? leavesA : leavesB;
    return problem(`줄기 ${targetStem}에 해당하는 잎을 모두 구하세요. (작은 수부터 쉼표로 구분)`, '', leaves.join(','), { ...visual, promptEn: `List all leaves for stem ${targetStem}, smallest to largest, separated by commas.`, explanation: `줄기 ${targetStem}의 잎을 작은 수부터 나열하면 ${leaves.join(', ')}입니다.`, explanationEn: `The leaves for stem ${targetStem} in order are ${leaves.join(', ')}.` });
  }
  if (mode === 4) {
    const n = randomInt(random, 2, Math.min(4, all.length - 1));
    const fromLargest = random() < 0.5;
    const value = fromLargest ? all[all.length - n] : all[n - 1];
    const rankLabel = fromLargest ? `큰 자료부터 ${n}번째` : `작은 자료부터 ${n}번째`;
    return problem(`${rankLabel} 값을 구하세요.`, '', value, { ...visual, promptEn: `Find the value ranked ${n} from the ${fromLargest ? 'largest' : 'smallest'}.`, explanation: `자료를 크기순으로 나열하면 ${all.join(', ')}이므로 ${rankLabel} 값은 ${value}입니다.`, explanationEn: `In sorted order (${all.join(', ')}), the requested value is ${value}.` });
  }
  const threshold = pick(random, [stemA, stemB]) * 10 + randomInt(random, 0, 5);
  const count = all.filter((value) => value >= threshold).length;
  return problem(`값이 ${threshold} 이상인 자료의 개수를 구하세요.`, '', count, { ...visual, promptEn: `Find how many data values are at least ${threshold}.`, explanation: `${threshold} 이상인 값을 모두 세면 ${count}개입니다.`, explanationEn: `Counting values that are at least ${threshold} gives ${count}.` });
}

function frequencyTable(random) {
  const width = pick(random, [5, 10]);
  const frequencies = Array.from({ length: 4 }, () => randomInt(random, 2, 9));
  const total = frequencies.reduce((sum, value) => sum + value, 0);
  const table = frequencies.map((frequency, row) => ({ interval: `${row * width}~${row * width + width - 1}`, frequency }));
  const visual = (rows) => ({ kind: 'frequency-table', frequencyTable: rows });
  const mode = randomInt(random, 0, 5);
  if (mode === 0) return problem('도수분포표에서 전체 도수의 합을 구하세요.', '', total, { ...visual(table), promptEn: 'Find the total frequency.', explanation: `각 계급의 도수를 더하면 ${frequencies.join('+')}=${total}입니다.`, explanationEn: `Add all class frequencies to get ${total}.` });
  if (mode === 1) {
    const index = randomInt(random, 0, 3);
    const relative = frequencies[index] / total;
    return problem(`도수분포표에서 ${table[index].interval} 계급의 상대도수를 소수로 구하세요.`, '', String(Number(relative.toFixed(3))), { ...visual(table), promptEn: `Find the relative frequency for the ${table[index].interval} class as a decimal.`, explanation: `상대도수는 ${frequencies[index]}÷${total}=${Number(relative.toFixed(3))}입니다.`, explanationEn: `Relative frequency is ${frequencies[index]}÷${total}=${Number(relative.toFixed(3))}.` });
  }
  if (mode === 2) {
    const index = randomInt(random, 0, 3);
    const hidden = table.map((row, rowIndex) => (rowIndex === index ? { ...row, frequency: 'A' } : row));
    const others = frequencies.filter((_, rowIndex) => rowIndex !== index);
    return problem(`아래 도수분포표에서 전체 도수가 ${total}일 때, A의 값을 구하세요.`, '', frequencies[index], { ...visual(hidden), promptEn: `Given a total frequency of ${total}, find the value of A.`, explanation: `A=${total}-(${others.join('+')})=${frequencies[index]}입니다.`, explanationEn: `A = ${total} - (${others.join('+')}) = ${frequencies[index]}.` });
  }
  if (mode === 3) {
    const index = randomInt(random, 1, 3);
    const threshold = table[index].interval.split('~')[0];
    const cumulative = frequencies.slice(index).reduce((sum, value) => sum + value, 0);
    return problem(`${threshold} 이상인 계급의 도수의 합을 구하세요.`, '', cumulative, { ...visual(table), promptEn: `Find the sum of frequencies for classes at or above ${threshold}.`, explanation: `${table[index].interval}부터 마지막 계급까지 도수를 더하면 ${frequencies.slice(index).join('+')}=${cumulative}입니다.`, explanationEn: `Adding the frequencies from ${table[index].interval} onward gives ${cumulative}.` });
  }
  if (mode === 4) {
    return problem('도수분포표에서 계급의 크기와 계급의 개수를 차례로 구하세요.', '', `${width},${frequencies.length}`, { ...visual(table), promptEn: 'Find the class width and the number of classes, in order.', explanation: `각 계급의 크기는 ${width}이고 계급은 ${frequencies.length}개입니다.`, explanationEn: `Each class has width ${width}, and there are ${frequencies.length} classes.` });
  }
  const maxFrequency = Math.max(...frequencies);
  if (frequencies.filter((value) => value === maxFrequency).length > 1) return frequencyTable(random);
  const maxIndex = frequencies.indexOf(maxFrequency);
  return problem('도수가 가장 큰 계급을 구하세요.', '', table[maxIndex].interval, { ...visual(table), promptEn: 'Find the class with the greatest frequency.', explanation: `도수가 가장 큰 계급은 ${table[maxIndex].interval}이고 도수는 ${maxFrequency}입니다.`, explanationEn: `The class with the greatest frequency is ${table[maxIndex].interval}, with frequency ${maxFrequency}.` });
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
  ['수와 연산', ['pre-algebra', 'kr-middle-1'], PRIME_BASIC_UNITS],
  ['수와 연산', ['pre-algebra', 'kr-middle-1'], GCD_LCM_BASIC_UNITS],
  ['수와 연산', ['pre-algebra', 'kr-middle-1'], INTEGER_RATIONAL_UNITS],
  ['유리수와 순환소수', ['pre-algebra', 'kr-middle-2'], RPM_RATIONAL_DECIMALS_APPLIED_UNITS],
  ['문자와 식', ['pre-algebra', 'kr-middle-1', 'kr-middle-2', 'algebra-1'], [...ALGEBRA_UNITS, ...RPM_ALGEBRA_APPLIED_UNITS]],
  ['좌표와 관계', ['pre-algebra', 'kr-middle-1', 'kr-middle-2', 'algebra-1'], COORDINATE_UNITS],
  ['좌표와 관계', ['pre-algebra', 'kr-middle-1', 'algebra-1'], PROPORTION_UNITS],
];

const IMPORTED_UNITS = SOURCE_GROUPS.flatMap(([category, profiles, units]) => units.map((unit) => ({ ...unit, category, profiles })));

// `tier` ('basic'|'intermediate'|'advanced' -> 하/중/상), for the "종합 테스트 만들기" core-practice
// test generator's difficulty ceiling. No per-problem difficulty signal exists anywhere in these
// engines to derive this from — hand-judged from each unit's own scope/grade level, keyed by id
// so it applies across every source file without touching each one individually.
const UNIT_TIERS = {
  // integers-rationals RPM 2-1 Chapter 01 유리수와 순환소수
  'rpm-rat-dec-powers-of-ten': 'basic',
  'rpm-rat-dec-terminating-condition': 'basic',
  'rpm-rat-dec-multiply-terminating-single': 'intermediate',
  'rpm-rat-dec-multiply-terminating-both': 'intermediate',
  'rpm-rat-dec-denominator-variable': 'intermediate',
  'rpm-rat-dec-terminating-irreducible': 'intermediate',
  'rpm-rat-dec-period-notation': 'basic',
  'rpm-rat-dec-nth-digit': 'intermediate',
  'rpm-rat-dec-repeating-only': 'intermediate',
  'rpm-rat-dec-fraction-equation': 'basic',
  'rpm-rat-dec-fraction-formula': 'basic',
  'rpm-rat-dec-repeating-to-terminating': 'intermediate',
  'rpm-rat-dec-faulty-observation': 'intermediate',
  'rpm-rat-dec-repeating-inequality': 'intermediate',
  'rpm-rat-dec-arithmetic-operations': 'intermediate',
  'rpm-rat-dec-number-system-tf': 'basic',
  'rpm-rat-dec-between-fractions': 'intermediate',
  'rpm-rat-dec-mistake-equation': 'intermediate',
  'rpm-rat-dec-all-mixed': 'advanced',
  'rpm-rat-dec-advanced-skill-up': 'advanced',

  // prime-factorization/catalog.js
  'prime-composite': 'basic', 'prime-factorization': 'basic', 'power-form': 'basic', 'powers': 'basic',
  'all-divisors': 'basic', 'divisor-count': 'intermediate', 'prime-mixed': 'intermediate',
  // gcd-lcm/catalog.js
  'gcd-basic': 'basic', 'lcm-basic': 'basic', 'common-divisors-gcd': 'basic', 'common-multiples-lcm': 'basic',
  'coprime': 'intermediate', 'gcd-prime-form': 'intermediate', 'lcm-prime-form': 'intermediate',
  'gcd-lcm-relation': 'intermediate', 'gcd-lcm-application': 'intermediate', 'gcd-lcm-mixed': 'intermediate',
  // integers-rationals/catalog.js
  'positive-negative': 'basic', 'number-line': 'basic', 'absolute-value': 'basic', 'number-comparison': 'basic',
  'integer-classification': 'basic', 'rational-classification': 'basic', 'rational-addition': 'basic',
  'rational-subtraction': 'basic', 'rational-add-subtract': 'intermediate', 'rational-multiplication': 'basic',
  'rational-division': 'intermediate', 'rational-four-operations': 'intermediate', 'rational-operations-review': 'intermediate',
  'inequality-expression': 'intermediate', 'integer-solutions': 'intermediate', 'integer-rational-mixed': 'intermediate',
  'rpm-ir-sign-situation': 'advanced', 'rpm-ir-classify-integers': 'advanced', 'rpm-ir-classify-rationals': 'advanced',
  'rpm-ir-number-line-read': 'advanced', 'rpm-ir-midpoint-distance': 'advanced', 'rpm-ir-abs-basic-extremum': 'advanced',
  'rpm-ir-abs-properties': 'advanced', 'rpm-ir-abs-range-count': 'advanced', 'rpm-ir-opposite-signs-abs': 'advanced',
  'rpm-ir-compare-order': 'advanced', 'rpm-ir-inequality-phrasing': 'advanced', 'rpm-ir-between-integers-fractions': 'advanced',
  'rpm-ir-abs-pairs-ratio': 'advanced', 'rpm-ir-deduce-multi-order': 'advanced', 'rpm-ir-all-types-mixed': 'advanced',
  'rpm-irc-addition-laws': 'advanced', 'rpm-irc-subtraction-basic': 'advanced', 'rpm-irc-add-sub-integers': 'advanced',
  'rpm-irc-add-sub-rationals': 'advanced', 'rpm-irc-omitted-signs': 'advanced', 'rpm-irc-relative-difference': 'advanced',
  'rpm-irc-unknown-add-sub': 'advanced', 'rpm-irc-abs-extremum-add-sub': 'advanced', 'rpm-irc-magic-square-game': 'advanced',
  'rpm-irc-multiplication-basic': 'advanced', 'rpm-irc-pick-three-product': 'advanced', 'rpm-irc-powers-signs': 'advanced',
  'rpm-irc-neg-one-power': 'advanced', 'rpm-irc-distributive-law': 'advanced', 'rpm-irc-reciprocal-equation': 'advanced',
  'rpm-irc-division-basic': 'advanced', 'rpm-irc-mult-div-mixed': 'advanced', 'rpm-irc-four-operations-order': 'advanced',
  'rpm-irc-unknown-mult-div': 'advanced', 'rpm-irc-correct-answer': 'advanced', 'rpm-irc-sign-determination': 'advanced',
  'rpm-irc-variable-magnitude': 'advanced', 'rpm-irc-line-section-ratio': 'advanced', 'rpm-irc-telescoping-fractions': 'advanced',
  'rpm-irc-custom-operator': 'advanced', 'rpm-irc-all-types-mixed': 'advanced',
  // algebra-basics/catalog.js
  'notation': 'basic', 'expression-values': 'basic', 'verbal-expressions': 'basic', 'polynomial-basics': 'basic',
  'simplify-linear': 'intermediate', 'monomial-multiply-divide': 'intermediate', 'expressions-review': 'intermediate',
  'equation-identity': 'intermediate', 'equality-properties': 'intermediate', 'linear-equations': 'intermediate',
  'advanced-linear-equations': 'advanced', 'equation-word-problems': 'intermediate', 'distance-speed-time': 'intermediate',
  'concentration': 'advanced', 'equations-review': 'intermediate',
  'rpm-alg-notation-signs': 'advanced', 'rpm-alg-verbal-units-cost': 'advanced', 'rpm-alg-verbal-figures': 'advanced',
  'rpm-alg-verbal-speed-concentration': 'advanced', 'rpm-alg-eval-basic-negative': 'advanced', 'rpm-alg-eval-fraction-reciprocal': 'advanced',
  'rpm-alg-eval-real-world': 'advanced', 'rpm-alg-poly-terms-degree': 'advanced', 'rpm-alg-linear-identify': 'advanced',
  'rpm-alg-monomial-mult-div': 'advanced', 'rpm-alg-like-terms': 'advanced', 'rpm-alg-linear-add-sub': 'advanced',
  'rpm-alg-linear-brackets': 'advanced', 'rpm-alg-fractional-linear': 'advanced', 'rpm-alg-linear-condition-param': 'advanced',
  'rpm-alg-substitute-expression': 'advanced', 'rpm-alg-unknown-box-poly': 'advanced', 'rpm-alg-correct-poly-calc': 'advanced',
  'rpm-alg-geometry-shaded-area': 'advanced', 'rpm-alg-neg-power-linear': 'advanced', 'rpm-alg-magic-square-pyramid': 'advanced',
  'rpm-alg-cost-profit-complex': 'advanced', 'rpm-alg-multi-var-complex-eval': 'advanced', 'rpm-alg-all-types-mixed': 'advanced',
  // 06 일차방정식의 풀이 세부 응용 유형 (RPM 1-1 p.94~103)
  'rpm-eq-identity-equation': 'advanced', 'rpm-eq-root-substitute': 'advanced', 'rpm-eq-identity-distinguish': 'advanced',
  'rpm-eq-identity-condition': 'advanced', 'rpm-eq-properties-equality': 'advanced', 'rpm-eq-solve-using-properties': 'advanced',
  'rpm-eq-transposition-rule': 'advanced', 'rpm-eq-linear-def-identify': 'advanced', 'rpm-eq-brackets-expand': 'advanced',
  'rpm-eq-decimal-coef': 'advanced', 'rpm-eq-fraction-coef': 'advanced', 'rpm-eq-mixed-decimal-fraction': 'advanced',
  'rpm-eq-proportion-cross-mult': 'advanced', 'rpm-eq-root-given-param': 'advanced', 'rpm-eq-two-eqs-same-root': 'advanced',
  'rpm-eq-special-roots': 'advanced', 'rpm-eq-root-integer-natural': 'advanced', 'rpm-eq-root-ratio-multiple': 'advanced',
  'rpm-eq-mistaken-coef': 'advanced', 'rpm-eq-common-root-systems': 'advanced', 'rpm-eq-all-types-mixed': 'advanced',
  // 07 일차방정식의 활용 세부 응용 유형 (RPM 1-1 p.106~117)
  'rpm-app-number-relations': 'advanced', 'rpm-app-consecutive-numbers': 'advanced', 'rpm-app-digit-values': 'advanced',
  'rpm-app-age-problems': 'advanced', 'rpm-app-savings-allowance': 'advanced', 'rpm-app-fixed-total-count': 'advanced',
  'rpm-app-geometry-figures': 'advanced', 'rpm-app-excess-deficit-items': 'advanced', 'rpm-app-percent-change-students': 'advanced',
  'rpm-app-total-fraction-reading': 'advanced', 'rpm-app-speed-roundtrip-courses': 'advanced', 'rpm-app-speed-time-difference': 'advanced',
  'rpm-app-speed-catchup-delay': 'advanced', 'rpm-app-speed-tracks-opposite': 'advanced', 'rpm-app-salt-water-evaporate-add': 'advanced',
  'rpm-app-salt-add-salt': 'advanced', 'rpm-app-salt-two-solutions-mix': 'advanced', 'rpm-app-cost-price-profit-discount': 'advanced',
  'rpm-app-work-done-collaborative': 'advanced', 'rpm-app-excess-deficit-benches': 'advanced', 'rpm-app-train-bridge-tunnel': 'advanced',
  'rpm-app-admission-ratio-system': 'advanced', 'rpm-app-salt-exchange-replace': 'advanced', 'rpm-app-speed-midway-delay': 'advanced',
  'rpm-app-clock-hands-angle': 'advanced', 'rpm-app-all-types-mixed': 'advanced',
  // coordinate-plane/catalog.js
  'plane-read-point': 'basic', 'plane-find-point': 'basic', 'quadrant-identify': 'basic', 'quadrant-sign': 'basic',
  'symmetric-points': 'intermediate', 'quadrant-transform': 'intermediate', 'ordered-pair-condition': 'intermediate',
  'coordinate-mixed': 'intermediate', 'trip-graph': 'intermediate',
  'rpm-coord-ordered-pair-equality': 'advanced', 'rpm-coord-axis-points': 'advanced', 'rpm-coord-triangle-area': 'advanced',
  'rpm-coord-polygon-area': 'advanced', 'rpm-coord-quadrant-identify': 'advanced', 'rpm-coord-quadrant-sign-condition': 'advanced',
  'rpm-coord-sign-product-sum': 'advanced', 'rpm-coord-abs-condition-quadrant': 'advanced', 'rpm-coord-symmetric-points': 'advanced',
  'rpm-coord-symmetric-area': 'advanced', 'rpm-coord-graph-situation': 'advanced', 'rpm-coord-graph-distance-time': 'advanced',
  'rpm-coord-graph-speed-time': 'advanced', 'rpm-coord-all-types-mixed': 'advanced',
  // proportion/catalog.js
  'direct-relation': 'basic', 'direct-classify': 'basic', 'direct-evaluate': 'basic', 'direct-graph': 'intermediate',
  'inverse-relation': 'basic', 'inverse-classify': 'basic', 'inverse-evaluate': 'intermediate', 'inverse-graph': 'intermediate',
  'proportion-application': 'intermediate', 'proportion-mixed': 'intermediate',
  'rpm-prop-direct-identify': 'advanced', 'rpm-prop-direct-table': 'advanced', 'rpm-prop-direct-graph-properties': 'advanced',
  'rpm-prop-direct-slope-axis-distance': 'advanced', 'rpm-prop-direct-point-on-graph': 'advanced', 'rpm-prop-direct-find-equation': 'advanced',
  'rpm-prop-direct-graph-area': 'advanced', 'rpm-prop-inverse-identify': 'advanced', 'rpm-prop-inverse-table': 'advanced',
  'rpm-prop-inverse-graph-properties': 'advanced', 'rpm-prop-inverse-origin-distance': 'advanced', 'rpm-prop-inverse-point-on-graph': 'advanced',
  'rpm-prop-inverse-lattice-points': 'advanced', 'rpm-prop-inverse-find-equation': 'advanced', 'rpm-prop-direct-inverse-intersection': 'advanced',
  'rpm-prop-inverse-rect-area': 'advanced', 'rpm-prop-direct-word-candle-gear': 'advanced', 'rpm-prop-inverse-word-tank-volume': 'advanced',
  'rpm-prop-inverse-word-work-boyle': 'advanced', 'rpm-prop-two-travelers-graph': 'advanced', 'rpm-prop-chain-proportion': 'advanced',
  'rpm-prop-all-types-mixed': 'advanced',
  // 중학 1-1 전 범위 총괄 실전 모의고사 (RPM 1-1 p.152~173)
  'rpm-semester-one-mock-exam': 'advanced',
  // NEW_UNITS (this file)
  'order-of-operations': 'basic', 'decimal-operations': 'basic', 'fraction-operations': 'basic',
  'fraction-decimal-percent': 'basic', 'ratio-rate-table': 'basic', 'percent-problems': 'basic',
  'one-step-inequality': 'intermediate', 'center-spread': 'basic', 'stem-leaf': 'basic', 'frequency-table': 'intermediate',
  // secondaryAlgebraEngine.js
  'repeating-decimals': 'basic', 'exponent-laws': 'basic', 'polynomial-operations-2': 'intermediate',
  'linear-inequalities-2': 'intermediate', 'systems-linear': 'intermediate', 'linear-functions-2': 'intermediate',
  'probability-2': 'intermediate', 'radicals-real-numbers': 'intermediate', 'identities-factoring': 'intermediate',
  'quadratic-equations': 'intermediate', 'quadratic-functions': 'intermediate', 'quadratic-max-min': 'advanced',
  'data-variation': 'intermediate', 'remainder-factor-theorem': 'advanced', 'complex-numbers': 'advanced',
  'quadratic-inequalities': 'advanced', 'permutations-combinations': 'advanced', 'circular-permutations': 'advanced',
  'matrices': 'intermediate', 'sets-logic': 'intermediate', 'function-composition': 'intermediate',
  'rational-radical-functions': 'advanced', 'exponential-equations': 'intermediate', 'logarithms': 'intermediate',
  'sequences': 'intermediate', 'algebra-modeling': 'intermediate',
  // algebraCompletionEngine.js
  'polynomial-division': 'intermediate', 'polynomial-zeros-multiplicity': 'advanced', 'complex-quadratic-roots': 'advanced',
  'completing-square': 'intermediate', 'discriminant-roots': 'intermediate', 'absolute-value-equations': 'intermediate',
  'literal-equations': 'intermediate', 'systems-inequalities': 'intermediate', 'linear-quadratic-systems': 'advanced',
  'finite-domain-range': 'intermediate', 'piecewise-functions': 'intermediate', 'average-rate-change': 'intermediate',
  'function-transformations': 'intermediate', 'inverse-functions-complete': 'advanced', 'exponential-modeling': 'intermediate',
  'regression-modeling': 'intermediate', 'two-way-tables': 'intermediate', 'rational-expressions': 'advanced',
  'rational-equations': 'advanced', 'radical-equations': 'advanced', 'logarithmic-modeling': 'advanced',
  'geometric-sequences': 'intermediate', 'binomial-theorem': 'advanced', 'variation-modeling': 'intermediate',
  'conditional-probability': 'advanced', 'algebra2-trigonometry': 'intermediate', 'internal-division-coordinate': 'intermediate',
  'external-division-coordinate': 'intermediate', 'line-distance-conditions': 'advanced', 'circle-equations-complete': 'intermediate',
  'coordinate-transformations': 'intermediate', 'propositions-complete': 'intermediate', 'matrix-multiplication': 'intermediate',
  'kr-high-1-complete-review': 'advanced', 'algebra-1-complete-review': 'intermediate', 'algebra-2-complete-review': 'advanced',
  // koreanHigh2Engine.js (고2)
  'h2-exponential-log-functions': 'intermediate', 'h2-radians-trig': 'intermediate', 'h2-sine-cosine-laws': 'intermediate',
  'h2-sequence-sums-induction': 'advanced', 'h2-function-limits': 'intermediate', 'h2-continuity': 'intermediate',
  'h2-derivative-definition': 'intermediate', 'h2-derivative-rules': 'intermediate', 'h2-tangent-lines': 'intermediate',
  'h2-monotonic-extrema': 'advanced', 'h2-motion-derivatives': 'advanced', 'h2-antiderivatives': 'intermediate',
  'h2-definite-integrals': 'intermediate', 'h2-integral-area': 'advanced', 'h2-expected-value': 'intermediate',
  'h2-binomial-distribution': 'advanced', 'h2-normal-distribution': 'advanced', 'h2-sample-mean': 'intermediate',
  'h2-confidence-interval': 'advanced', 'h2-sample-proportion': 'advanced',
  // precalculusEngine.js
  'precalc-polynomial-end-behavior': 'intermediate', 'precalc-rational-features': 'advanced',
  'precalc-exp-log-transformations': 'intermediate', 'precalc-trig-graphs': 'intermediate', 'precalc-trig-identities': 'advanced',
  'precalc-inverse-trig': 'advanced', 'precalc-polar-coordinates': 'advanced', 'precalc-parametric-functions': 'advanced',
  'precalc-conic-sections': 'advanced', 'precalc-vectors': 'advanced', 'precalc-transformation-matrices': 'intermediate',
  // koreanHigh3Engine.js (고3)
  'h3-sequence-limits': 'intermediate', 'h3-infinite-series': 'advanced', 'h3-exp-log-derivatives': 'intermediate',
  'h3-trig-derivatives': 'intermediate', 'h3-advanced-derivative-rules': 'advanced', 'h3-implicit-differentiation': 'advanced',
  'h3-substitution-integration': 'advanced', 'h3-integration-by-parts': 'advanced', 'h3-volume-integrals': 'advanced',
  'h3-parabola': 'intermediate', 'h3-ellipse': 'intermediate', 'h3-hyperbola': 'advanced', 'h3-vector-angle': 'intermediate',
  'h3-lines-planes': 'advanced', 'h3-space-coordinates': 'intermediate', 'h3-sphere-equations': 'advanced',
  // apCalculusEngine.js
  'concavity-second-derivative': 'intermediate', 'optimization-closed-interval': 'intermediate', 'riemann-sums': 'intermediate',
  'related-rates': 'advanced', 'lhopital-rule': 'intermediate', 'differential-equations-separable': 'advanced',
  'partial-fractions-integration': 'advanced', 'improper-integrals': 'advanced', 'euler-method': 'advanced',
  'logistic-growth': 'advanced', 'arc-length': 'advanced', 'parametric-vector-calculus': 'advanced',
  'polar-calculus': 'advanced', 'series-convergence-tests': 'advanced', 'power-series-radius-of-convergence': 'advanced',
  'taylor-maclaurin-series': 'advanced',
};

function withDifficultyTier(units) {
  return units.map((unit) => (UNIT_TIERS[unit.id] ? { ...unit, tier: UNIT_TIERS[unit.id] } : unit));
}

export const PRE_ALGEBRA_UNITS = withDifficultyTier([...IMPORTED_UNITS, ...NEW_UNITS, ...SECONDARY_ALGEBRA_UNITS, ...ALGEBRA_COMPLETION_UNITS, ...KOREAN_HIGH2_UNITS, ...PRECALCULUS_UNITS, ...KOREAN_HIGH3_UNITS, ...AP_CALCULUS_UNITS]);

export const PRE_ALGEBRA_PROFILES = [
  { id: 'kr-middle-1', label: '중1 · 소인수분해·정수·문자와 식·좌표', labelEn: 'Grade 7 · Numbers, Expressions & Coordinates', description: '2022 개정 교육과정 중1 비기하 핵심 단원 연습', descriptionEn: 'Core non-geometry Grade 7 topics in Korea’s 2022 curriculum' },
  { id: 'kr-middle-2', label: '중2 · 식의 계산·부등식·연립방정식·일차함수', labelEn: 'Grade 8 · Expressions, Systems & Functions', description: '식의 계산·부등식·연립방정식·일차함수·확률 핵심 연습', descriptionEn: 'Expressions, inequalities, systems, linear functions and probability' },
  { id: 'kr-middle-3', label: '중3 · 제곱근·인수분해·이차방정식·이차함수', labelEn: 'Grade 9 · Radicals, Quadratics & Statistics', description: '제곱근·인수분해·이차방정식·이차함수·통계 핵심 연습', descriptionEn: 'Radicals, factoring, quadratics and data transformations' },
  { id: 'kr-high-1', label: '고1 · 공통수학 1·2 (다항식·방정식·함수·행렬)', labelEn: 'Grade 10 · Common Math 1–2 (Polynomials, Functions, Matrices)', description: '2022 개정 공통수학1·2 핵심 단원 연습 (다항식·방정식·집합·함수·행렬)', descriptionEn: 'Core practice for Korea Common Mathematics 1–2 (Polynomials, Sets, Functions, Matrices)' },
  { id: 'kr-high-2-algebra', label: '고2 · 대수 [구 수학Ⅰ] (지수·로그·삼각함수·수열)', labelEn: 'Grade 11 · Algebra [Classic Math I]', description: '2022 개정 일반 선택 [대수]: 지수·로그, 삼각함수, 수열', descriptionEn: 'Korea 2022 Algebra (General Elective): exponents, logarithms, trigonometry and sequences' },
  { id: 'kr-high-2-calculus-1', label: '고2 · 미적분Ⅰ [구 수학Ⅱ] (극한·연속·미적분)', labelEn: 'Grade 11 · Calculus I [Classic Math II]', description: '2022 개정 일반 선택 [미적분Ⅰ]: 극한·연속, 미분, 적분', descriptionEn: 'Korea 2022 Calculus I (General Elective): limits, continuity, derivatives and integrals' },
  { id: 'kr-high-2-probability-statistics', label: '고2 · 확률과 통계 (순열·조합·확률분포·통계)', labelEn: 'Grade 11 · Probability & Statistics', description: '2022 개정 일반 선택 [확률과 통계]: 경우의 수, 확률분포, 통계적 추정', descriptionEn: 'Korea 2022 Probability & Statistics (General Elective): counting, distributions and inference' },
  { id: 'kr-high-3-calculus-2', label: '고3 · 미적분Ⅱ [구 미적분] (초월함수 미적분·급수)', labelEn: 'Grade 12 · Calculus II [Classic Calculus]', description: '2022 개정 진로 선택 [미적분Ⅱ]: 수열의 극한, 여러 가지 미분법과 적분법', descriptionEn: 'Korea 2022 Calculus II (Career Elective): sequence limits, advanced differentiation and integration' },
  { id: 'kr-high-3-geometry', label: '고3 · 기하 (이차곡선·벡터·공간도형)', labelEn: 'Grade 12 · Geometry [Classic Geometry]', description: '2022 개정 진로 선택 [기하]: 이차곡선, 벡터, 공간도형과 공간좌표', descriptionEn: 'Korea 2022 Geometry (Career Elective): conics, vectors, spatial geometry and coordinates' },
  { id: 'pre-algebra', label: 'Pre-Algebra (Grade 6–8 대수 기초)', labelEn: 'Pre-Algebra (Grades 6–8 Foundations)', description: '미국 Grade 6~8 대수 준비 핵심 단원 연습', descriptionEn: 'Core non-geometry preparation across U.S. Grades 6–8' },
  { id: 'algebra-1', label: 'Algebra 1 (Grade 8–9 대수·함수)', labelEn: 'Algebra 1 (Grades 8–9 Expressions & Functions)', description: 'Common Core 대수·함수·모델링 핵심 단원 연습', descriptionEn: 'Common Core Algebra/Functions/Modeling core practice coverage' },
  { id: 'algebra-2', label: 'Algebra 2 (Grade 10–11 심화 대수·삼각함수)', labelEn: 'Algebra 2 (Grades 10–11 Advanced Topics)', description: '확장 대수·함수·통계·삼각함수 핵심 단원 연습', descriptionEn: 'Extended algebra, functions, statistics and trigonometry core practice' },
  { id: 'precalculus', label: 'Precalculus (Grade 11–12 미적분 선수)', labelEn: 'Precalculus (Grades 11–12 College Prep)', description: '다항·유리·지수·로그·삼각함수와 극좌표·매개변수·벡터', descriptionEn: 'Polynomial, rational, exponential, logarithmic and trigonometric functions with polar, parametric and vector topics' },
  { id: 'ap-calc-ab', label: 'AP Calculus AB (미적분 기초·적분 응용)', labelEn: 'AP Calculus AB (Intro & Applications)', description: '극한·미분·적분과 그 활용 (AP Calculus AB 범위)', descriptionEn: 'Limits, derivatives, integrals and their applications (AP Calculus AB scope)' },
  { id: 'ap-calc-bc', label: 'AP Calculus BC (심화 미적분·급수·극좌표)', labelEn: 'AP Calculus BC (Advanced & Series)', description: 'AB 전체 범위 + 급수·매개변수·극좌표·수치해법 (AP Calculus BC 범위)', descriptionEn: 'Everything in AB, plus series, parametric/polar calculus and numerical methods (AP Calculus BC scope)' },
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
