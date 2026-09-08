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
import {
  rpmMonoExponentSum,
  rpmMonoExponentProduct,
  rpmMonoExponentQuotient,
  rpmMonoExponentPowerProduct,
  rpmMonoExponentPowerQuotient,
  rpmMonoExponentEquationBase,
  rpmMonoExponentAddition,
  rpmMonoExponentSubstitution,
  rpmMonoExponentDigitsCount,
  rpmMonoMultBasic,
  rpmMonoDivBasic,
  rpmMonoMultDivMixed,
  rpmMonoMissingBox,
  rpmMonoGeometryApplication,
  rpmMonoExponentFactorOut,
  rpmMonoUnitsDigitCycle,
  rpmMonoAllTypesMixed,
  rpmMonoAdvancedSkillUp,
  rpmPolyCalcAddSubBasic,
  rpmPolyCalcQuadraticAddSub,
  rpmPolyCalcBracketsOrder,
  rpmPolyCalcWrongCalculation,
  rpmPolyCalcMonomialPolyMult,
  rpmPolyCalcMonomialPolyDiv,
  rpmPolyCalcFourOpsMixed,
  rpmPolyCalcMissingBox,
  rpmPolyCalcEvaluateValue,
  rpmPolyCalcSubExpression,
  rpmPolyCalcGeometryApplication,
  rpmPolyCalcAllMixed,
  rpmPolyCalcAdvancedSkillUp,
  rpmLinearIneqConceptIdentify,
  rpmLinearIneqTruthValue,
  rpmLinearIneqExpressSentence,
  rpmLinearIneqProperties,
  rpmLinearIneqRangeOfExpression,
  rpmLinearIneqIdentifyLinear,
  rpmLinearIneqSolveBasicNumberLine,
  rpmLinearIneqBrackets,
  rpmLinearIneqDecimalsFractions,
  rpmLinearIneqSameSolution,
  rpmLinearIneqGivenSolutionFindConstant,
  rpmLinearIneqNegativeCoeff,
  rpmLinearIneqIntegerSolutionsCondition,
  rpmLinearIneqAllTypesMixed,
  rpmLinearIneqAdvancedSkillUp,
  rpmIneqAppNumbers,
  rpmIneqAppCostCount,
  rpmIneqAppSavingsDeposit,
  rpmIneqAppAverageScore,
  rpmIneqAppPricingPlans,
  rpmIneqAppGroupDiscount,
  rpmIneqAppStoreComparison,
  rpmIneqAppCostPriceProfit,
  rpmIneqAppGeometry,
  rpmIneqAppSaltWaterEvaporateAdd,
  rpmIneqAppSpeedRoundTripTime,
  rpmIneqAppSpeedShoppingStation,
  rpmIneqAppSpeedChangeMidway,
  rpmIneqAppAllTypesMixed,
  rpmIneqAppAdvancedSkillUp,
  rpmSysLinearTwoVarsIdentify,
  rpmSysLinearNaturalPairs,
  rpmSysLinearGivenSolFindConstant,
  rpmSysLinearSystemSolutionConcept,
  rpmSysLinearGivenSolSystemConst,
  rpmSysLinearSubstitutionMethod,
  rpmSysLinearAdditionSubtractionMethod,
  rpmSysLinearParentheses,
  rpmSysLinearDecimalsFractions,
  rpmSysLinearABCForm,
  rpmSysLinearSatisfyOtherEquation,
  rpmSysLinearVariableRelation,
  rpmSysLinearTwoSystemsCommonSol,
  rpmSysLinearFaultyObservation,
  rpmSysLinearSpecialInfinitelyMany,
  rpmSysLinearSpecialNoSolution,
  rpmSysLinearRepeatingDecimals,
  rpmSysLinearAllTypesMixed,
  rpmSysLinearAdvancedSkillUp,
  rpmSysAppTwoDigitNumbers,
  rpmSysAppAges,
  rpmSysAppPriceQuantity,
  rpmSysAppScoresRockPaperScissors,
  rpmSysAppGeometry,
  rpmSysAppSpeedOppositeSameTrack,
  rpmSysAppSpeedRiverBoat,
  rpmSysAppSpeedTrainBridge,
  rpmSysAppSaltTwoSolutions,
  rpmSysAppSaltWaterEvaporateAdd,
  rpmSysAppAlloyMetals,
  rpmSysAppStudentPercentChange,
  rpmSysAppWorkRate,
  rpmSysAppCostPriceProfit,
  rpmSysAppAllTypesMixed,
  rpmSysAppAdvancedSkillUp,
  rpmLinearFuncConcept,
  rpmLinearFuncEvalValue,
  rpmLinearFuncIdentifyLinear,
  rpmLinearFuncPointOnGraph,
  rpmLinearFuncTranslationY,
  rpmLinearFuncIntercepts,
  rpmLinearFuncSlopeDefinition,
  rpmLinearFuncSlopeTwoPoints,
  rpmLinearFuncDrawQuadrants,
  rpmLinearFuncAxisTriangleArea,
  rpmLinearFuncSignProperties,
  rpmLinearFuncParallelLines,
  rpmLinearFuncCoincidentLines,
  rpmLinearFuncComprehensiveProperties,
  rpmLinearFuncAppTemperature,
  rpmLinearFuncAppWaterTank,
  rpmLinearFuncAppSpeedDistance,
  rpmLinearFuncAppMovingPoint,
  rpmLinearFuncAppGraphModeling,
  rpmLinearFuncUpTwoLinesArea,
  rpmLinearFuncUpQuadrantCondition,
  rpmLinearFuncAllTypesMixed,
  rpmLinearFuncAdvancedSkillUp,
  rpmLineEqnFormAxByC,
  rpmLineEqnPointOnLine,
  rpmLineEqnSignsProperties,
  rpmLineEqnParallelToAxes,
  rpmLineEqnFourLinesRectArea,
  rpmLineEqnFromSlopeYint,
  rpmLineEqnFromSlopePoint,
  rpmLineEqnFromTwoPoints,
  rpmLineEqnFromIntercepts,
  rpmLineEqnIntersectionAsSolution,
  rpmLineEqnIntersectionFindConst,
  rpmLineEqnLineThroughIntersection,
  rpmLineEqnThreeLinesOnePoint,
  rpmLineEqnSystemSolutionTypes,
  rpmLineEqnEnclosedTriangleArea,
  rpmLineEqnAppsRealLife,
  rpmLineEqnUpLineMeetsSegment,
  rpmLineEqnUpBisectTriangleArea,
  rpmLineEqnAllTypesMixed,
  rpmLineEqnAdvancedSkillUp,
  rpmGrade8SemesterOneFinalExam,
} from '../rpmAppliedEngine';


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

export const RPM_MONOMIALS_APPLIED_UNITS = [
  { id: 'rpm-mono-exponent-sum', label: '[단항식 계산 01] 지수법칙 1 - 지수의 합', description: '밑이 같은 거듭제곱의 곱셈에서 지수의 합 공식 적용하기', en: ['Monomials Type 01: Product Rule (Exponent Sum)', 'Apply the exponent sum rule a^m × a^n = a^{m+n}'], make: (random) => rpmMonoExponentSum(random) },
  { id: 'rpm-mono-exponent-product', label: '[단항식 계산 02] 지수법칙 2 - 지수의 곱', description: '거듭제곱의 거듭제곱에서 지수의 곱 공식 및 대소 비교', en: ['Monomials Type 02: Power Rule (Exponent Product)', 'Apply (a^m)^n = a^{mn} and compare magnitudes of powers'], make: (random) => rpmMonoExponentProduct(random) },
  { id: 'rpm-mono-exponent-quotient', label: '[단항식 계산 03] 지수법칙 3 - 지수의 나눗셈', description: '밑이 같은 거듭제곱의 나눗셈에서 지수의 차 공식 적용하기', en: ['Monomials Type 03: Quotient Rule (Exponent Difference)', 'Apply exponent division rules for m > n, m = n, and m < n'], make: (random) => rpmMonoExponentQuotient(random) },
  { id: 'rpm-mono-exponent-power-product', label: '[단항식 계산 04] 지수법칙 4 - 곱의 거듭제곱', description: '단항식의 곱 전체의 거듭제곱을 전개하여 각 인수에 분배', en: ['Monomials Type 04: Power of a Product', 'Expand powers of monomial products (ab)^n = a^n b^n'], make: (random) => rpmMonoExponentPowerProduct(random) },
  { id: 'rpm-mono-exponent-power-quotient', label: '[단항식 계산 05] 지수법칙 5 - 몫의 거듭제곱', description: '분수 꼴 단항식의 거듭제곱에서 분모와 분자에 지수 분배', en: ['Monomials Type 05: Power of a Quotient', 'Apply power of quotients (b/a)^n = b^n / a^n'], make: (random) => rpmMonoExponentPowerQuotient(random) },
  { id: 'rpm-mono-exponent-equation-base', label: '[단항식 계산 06] 지수법칙 응용 - 밑을 같게 하는 지수방정식', description: '양변의 밑을 소인수분해하여 일치시킨 후 미지수 지수 구하기', en: ['Monomials Type 06: Exponential Equations via Common Base', 'Unify bases using prime powers to solve for unknown exponents'], make: (random) => rpmMonoExponentEquationBase(random) },
  { id: 'rpm-mono-exponent-addition', label: '[단항식 계산 07] 지수법칙 응용 - 거듭제곱의 덧셈식', description: '같은 거듭제곱의 덧셈을 곱셈으로 묶어 단일 거듭제곱으로 정리', en: ['Monomials Type 07: Repeated Addition of Powers', 'Convert repeated additions a^x + a^x into products k · a^x'], make: (random) => rpmMonoExponentAddition(random) },
  { id: 'rpm-mono-exponent-substitution', label: '[단항식 계산 08] 지수법칙 응용 - 문자를 사용한 식의 변형', description: '기본 거듭제곱을 문자로 치환하여 합성 거듭제곱을 표현하기', en: ['Monomials Type 08: Expression Substitution with Variables', 'Express composite powers in terms of given variables A and B'], make: (random) => rpmMonoExponentSubstitution(random) },
  { id: 'rpm-mono-exponent-digits-count', label: '[단항식 계산 09] 지수법칙 응용 - 몇 자리 자연수인가', description: '2와 5의 지수를 맞추어 10의 거듭제곱 형태로 자릿수 결정', en: ['Monomials Type 09: Number of Digits of Large Powers', 'Pair powers of 2 and 5 into 10^k to determine digit counts'], make: (random) => rpmMonoExponentDigitsCount(random) },
  { id: 'rpm-mono-mult-basic', label: '[단항식 계산 10] 단항식의 곱셈', description: '계수는 계수끼리, 문자는 문자끼리 지수법칙을 적용하여 곱셈', en: ['Monomials Type 10: Monomial Multiplication', 'Multiply monomial coefficients and apply exponent rules to variables'], make: (random) => rpmMonoMultBasic(random) },
  { id: 'rpm-mono-div-basic', label: '[단항식 계산 11] 단항식의 나눗셈', description: '분수 꼴 또는 역수의 곱셈으로 변환하여 단항식 나누기', en: ['Monomials Type 11: Monomial Division', 'Divide monomials via fraction forms or reciprocal multiplication'], make: (random) => rpmMonoDivBasic(random) },
  { id: 'rpm-mono-mult-div-mixed', label: '[단항식 계산 12] 단항식의 곱셈과 나눗셈 혼합', description: '거듭제곱을 먼저 풀고 역수 곱셈을 적용하여 혼합 연산 수행', en: ['Monomials Type 12: Mixed Monomial Operations', 'Handle powers first and convert divisions to reciprocal products'], make: (random) => rpmMonoMultDivMixed(random) },
  { id: 'rpm-mono-missing-box', label: '[단항식 계산 13] 단항식의 계산에서 □ 구하기', description: '등식의 성질을 이용하여 모르는 단항식 □를 역연산으로 도출', en: ['Monomials Type 13: Finding Unknown Monomial in Box', 'Isolate unknown box expression using inverse monomial operations'], make: (random) => rpmMonoMissingBox(random) },
  { id: 'rpm-mono-geometry-app', label: '[단항식 계산 14] 단항식의 계산 도형 활용', description: '삼각형, 직사각형, 원뿔, 원기둥의 넓이와 부피 공식에 적용', en: ['Monomials Type 14: Geometric Applications of Monomials', 'Compute lengths, areas, and volumes involving monomial dimensions'], make: (random) => rpmMonoGeometryApplication(random) },
  { id: 'rpm-mono-exponent-factor-out', label: '[단항식 계산 15] 지수법칙 심화 - 공통 거듭제곱 묶기', description: '지수의 덧셈식을 공통 인수로 묶어 미지수 방정식 해결', en: ['Monomials Type 15: Factoring Out Common Powers', 'Factor out common exponential terms to solve linear exponent equations'], make: (random) => rpmMonoExponentFactorOut(random) },
  { id: 'rpm-mono-units-digit-cycle', label: '[단항식 계산 16] 지수법칙 심화 - 일의 자리 숫자 규칙성', description: '거듭제곱의 일의 자리 숫자가 이루는 주기적 반복 규칙 발견', en: ['Monomials Type 16: Units Digit Periodicity in Powers', 'Find periodic cycles of terminal digits in large powers'], make: (random) => rpmMonoUnitsDigitCycle(random) },
  { id: 'rpm-mono-all-mixed', label: '[단원 실전 다지기] 단항식의 계산 전 유형 실전 종합', description: '지수법칙 5개 공식, 지수방정식, 자릿수, 단항식 연산 및 도형 전 유형 실전 혼합', en: ['Monomials Comprehensive Practice', 'Mixed applied practice across all monomial and exponent rule types'], make: (random) => rpmMonoAllTypesMixed(random) },
  { id: 'rpm-mono-advanced-skill-up', label: '[단원 최고수준] 단항식의 계산 실력 UP', description: '저장 매체 용량 계산, 복합 문자 변형, 입체도형 부피비 등 고난도 발전 문제', en: ['Monomials Advanced Challenge', 'High-level challenge problems: digital storage powers, 3D volume ratios'], make: (random) => rpmMonoAdvancedSkillUp(random) },
];

export const RPM_POLYNOMIALS_APPLIED_UNITS = [
  { id: 'rpm-poly-calc-add-sub-basic', label: '[다항식 계산 01] 다항식의 덧셈과 뺄셈', description: '괄호를 풀고 동류항끼리 모아서 일차 다항식 덧셈과 뺄셈 수행', en: ['Polynomials Type 01: Addition & Subtraction', 'Unfold parentheses and collect like terms for linear polynomials'], make: (random) => rpmPolyCalcAddSubBasic(random) },
  { id: 'rpm-poly-calc-quadratic-add-sub', label: '[다항식 계산 02] 이차식의 덧셈과 뺄셈', description: '이차항, 일차항, 상수항 동류항끼리 모아 이차 다항식 연산', en: ['Polynomials Type 02: Quadratic Addition & Subtraction', 'Group quadratic, linear, and constant like-terms correctly'], make: (random) => rpmPolyCalcQuadraticAddSub(random) },
  { id: 'rpm-poly-calc-brackets-order', label: '[다항식 계산 03] 괄호가 있는 다항식의 계산', description: '소괄호 → 중괄호 → 대괄호 순서로 단계별 전개 및 동류항 정리', en: ['Polynomials Type 03: Nested Brackets Order', 'Expand parentheses from innermost () to {} to [] systematically'], make: (random) => rpmPolyCalcBracketsOrder(random) },
  { id: 'rpm-poly-calc-wrong-calculation', label: '[다항식 계산 04] 잘못 계산한 식에서 바른 식 구하기', description: '잘못된 덧셈/뺄셈 연산 결과로부터 원래 다항식을 찾고 올바른 결과 계산', en: ['Polynomials Type 04: Reconstructing Miscalculated Polynomials', 'Recover initial polynomial from faulty operations and find correct result'], make: (random) => rpmPolyCalcWrongCalculation(random) },
  { id: 'rpm-poly-calc-monomial-mult', label: '[다항식 계산 05] 단항식과 다항식의 곱셈', description: '분배법칙을 활용하여 단항식을 다항식의 각 항에 전개하고 동류항 정리', en: ['Polynomials Type 05: Monomial × Polynomial Expansion', 'Distribute monomial over polynomial terms and combine like terms'], make: (random) => rpmPolyCalcMonomialPolyMult(random) },
  { id: 'rpm-poly-calc-monomial-div', label: '[다항식 계산 06] 다항식과 단항식의 나눗셈', description: '분수 꼴 또는 역수의 곱셈을 이용하여 다항식을 단항식으로 나누기', en: ['Polynomials Type 06: Polynomial ÷ Monomial Division', 'Divide each polynomial term by monomial divisor or multiply reciprocal'], make: (random) => rpmPolyCalcMonomialPolyDiv(random) },
  { id: 'rpm-poly-calc-four-ops-mixed', label: '[다항식 계산 07] 다항식의 사칙 혼합 계산', description: '거듭제곱, 괄호, 곱셈·나눗셈, 덧셈·뺄셈의 연산 순서에 맞춘 계산', en: ['Polynomials Type 07: Mixed Four Operations with Polynomials', 'Execute mixed operations following order: powers, brackets, mult/div, add/sub'], make: (random) => rpmPolyCalcFourOpsMixed(random) },
  { id: 'rpm-poly-calc-missing-box', label: '[다항식 계산 08] 다항식 계산에서 □ 구하기', description: '다항식의 나눗셈이나 곱셈식에서 빈칸 □에 알맞은 식 역연산', en: ['Polynomials Type 08: Finding Missing Polynomial in Box', 'Solve for missing polynomial in equations using inverse operations'], make: (random) => rpmPolyCalcMissingBox(random) },
  { id: 'rpm-poly-calc-evaluate-value', label: '[다항식 계산 09] 식의 대입과 식의 값 구하기', description: '복잡한 다항식을 최대한 간단히 정리한 후 미지수의 값을 대입하여 계산', en: ['Polynomials Type 09: Expression Simplification & Evaluation', 'Simplify algebraic expressions before substituting numerical values'], make: (random) => rpmPolyCalcEvaluateValue(random) },
  { id: 'rpm-poly-calc-sub-expression', label: '[다항식 계산 10] 한 문자에 대한 식으로 나타내기', description: 'A, B로 표현된 식을 먼저 정리한 뒤 대입하여 목표 문자의 식으로 표현', en: ['Polynomials Type 10: Substitution into Single Target Variables', 'Simplify expressions in terms of capital variables before polynomial substitution'], make: (random) => rpmPolyCalcSubExpression(random) },
  { id: 'rpm-poly-calc-geometry-app', label: '[다항식 계산 11] 다항식의 계산 도형 활용', description: '사다리꼴 넓이, 입체도형 부피 및 물 채우기 등 도형 공식 활용', en: ['Polynomials Type 11: Geometric Applications of Polynomials', 'Apply polynomial expressions to trapezoid areas and 3D container volumes'], make: (random) => rpmPolyCalcGeometryApplication(random) },
  { id: 'rpm-poly-calc-all-mixed', label: '[단원 실전 다지기] 다항식의 계산 전 유형 실전 종합', description: '괄호 전개, 단항식 곱셈·나눗셈, 사칙 혼합, 식의 대입 및 도형 활용 전 유형 종합', en: ['Polynomials Comprehensive Practice', 'Mixed applied practice across all polynomial operation types'], make: (random) => rpmPolyCalcAllMixed(random) },
  { id: 'rpm-poly-calc-advanced-skill-up', label: '[단원 최고수준] 다항식의 계산 실력 UP', description: '겹쳐진 색종이 띠의 넓이, 곱셈·나눗셈 역연산 연립식 등 최고난도 응용', en: ['Polynomials Advanced Challenge', 'High-level challenge problems: overlapping sheet strips, double-error corrections'], make: (random) => rpmPolyCalcAdvancedSkillUp(random) },
];

export const RPM_LINEAR_INEQUALITIES_APPLIED_UNITS = [
  { id: 'rpm-linear-ineq-concept-identify', label: '[일차부등식 01] 부등식의 뜻과 식별', description: '부등호(>, <, ≥, ≤)를 사용한 식과 등식·다항식 구별하기', en: ['Linear Inequalities Type 01: Concept & Identification', 'Distinguish inequalities with >, <, ≥, ≤ from equations and polynomials'], make: (random) => rpmLinearIneqConceptIdentify(random) },
  { id: 'rpm-linear-ineq-truth-value', label: '[일차부등식 02] 부등식의 참, 거짓 판별', description: '주어진 미지수 값을 부등식에 대입하여 참과 거짓 판정하기', en: ['Linear Inequalities Type 02: Truth Value of Inequalities', 'Substitute given values into inequalities to determine truth value'], make: (random) => rpmLinearIneqTruthValue(random) },
  { id: 'rpm-linear-ineq-express-sentence', label: '[일차부등식 03] 문장을 부등식으로 나타내기', description: '미만, 이하, 초과, 이상, 크지 않다 등의 표현을 부등식으로 표현하기', en: ['Linear Inequalities Type 03: Translating Phrases into Inequalities', 'Translate verbal phrases (at least, at most, exceeds) into inequality statements'], make: (random) => rpmLinearIneqExpressSentence(random) },
  { id: 'rpm-linear-ineq-properties', label: '[일차부등식 04] 부등식의 기본 성질', description: '양변에 같은 수를 더하거나 빼거나 곱하거나 나눌 때 부등호 방향 변화 파악', en: ['Linear Inequalities Type 04: Properties of Inequalities', 'Apply addition, subtraction, and multiplication/division by positive or negative numbers'], make: (random) => rpmLinearIneqProperties(random) },
  { id: 'rpm-linear-ineq-range-of-expression', label: '[일차부등식 05] 일차식의 값의 범위 구하기', description: 'x의 범위가 주어졌을 때 ax + b 꼴 일차식의 최댓값과 최솟값 범위 구하기', en: ['Linear Inequalities Type 05: Range of Linear Expressions', 'Determine range of ax + b given the interval of x'], make: (random) => rpmLinearIneqRangeOfExpression(random) },
  { id: 'rpm-linear-ineq-identify-linear', label: '[일차부등식 06] 일차부등식의 식별', description: '모든 항을 좌변으로 이항하여 정리했을 때 ax + b > 0 꼴이 되는 일차부등식 찾기', en: ['Linear Inequalities Type 06: Identifying Linear Inequalities', 'Identify first-degree linear inequalities by moving all terms to one side'], make: (random) => rpmLinearIneqIdentifyLinear(random) },
  { id: 'rpm-linear-ineq-solve-basic-number-line', label: '[일차부등식 07] 일차부등식의 풀이와 수직선 표현', description: '일차부등식의 해를 구하고 수직선 위에 올바르게 나타내기', en: ['Linear Inequalities Type 07: Solving & Number Line Representation', 'Solve simple linear inequalities and plot solution set on the real number line'], make: (random) => rpmLinearIneqSolveBasicNumberLine(random) },
  { id: 'rpm-linear-ineq-brackets', label: '[일차부등식 08] 괄호가 있는 일차부등식의 풀이', description: '분배법칙으로 괄호를 전개하고 동류항을 정리하여 일차부등식 풀기', en: ['Linear Inequalities Type 08: Inequalities with Parentheses', 'Expand parentheses via distributive property and solve linear inequalities'], make: (random) => rpmLinearIneqBrackets(random) },
  { id: 'rpm-linear-ineq-decimals-fractions', label: '[일차부등식 09] 계수가 소수 또는 분수인 일차부등식', description: '양변에 10의 거듭제곱이나 분모의 최소공배수를 곱하여 정수 계수로 고쳐 풀기', en: ['Linear Inequalities Type 09: Decimal & Fraction Coefficients', 'Clear decimals and denominators to solve linear inequalities'], make: (random) => rpmLinearIneqDecimalsFractions(random) },
  { id: 'rpm-linear-ineq-same-solution', label: '[일차부등식 10] 해가 서로 같은 두 일차부등식', description: '두 일차부등식의 해가 서로 같을 때 미지의 상수 구하기', en: ['Linear Inequalities Type 10: Two Inequalities with the Same Solution', 'Find unknown constants when two linear inequalities share identical solution sets'], make: (random) => rpmLinearIneqSameSolution(random) },
  { id: 'rpm-linear-ineq-given-solution-find-constant', label: '[일차부등식 11] 부등식의 해가 주어졌을 때 상수 구하기', description: '부등식의 해가 x > k 또는 x < k로 주어졌을 때 미지수의 계수나 상수항 구하기', en: ['Linear Inequalities Type 11: Finding Unknown Constant from Given Solution', 'Determine constant or coefficient matching a given inequality solution boundary'], make: (random) => rpmLinearIneqGivenSolutionFindConstant(random) },
  { id: 'rpm-linear-ineq-negative-coeff', label: '[일차부등식 12] 계수가 음수인 문자를 포함한 부등식', description: '문자 계수의 부호에 주의하여 양변을 나눌 때 부등호 방향 결정하기', en: ['Linear Inequalities Type 12: Solving with Variable Negative Coefficients', 'Carefully handle inequality direction reversal when dividing by variable coefficients'], make: (random) => rpmLinearIneqNegativeCoeff(random) },
  { id: 'rpm-linear-ineq-integer-solutions-condition', label: '[일차부등식 13] 자연수 또는 정수 해의 개수 조건', description: '부등식을 만족하는 자연수 해의 개수가 정해져 있을 때 상수의 범위 구하기', en: ['Linear Inequalities Type 13: Conditions on Number of Integer Solutions', 'Find constant boundary conditions given count of integer or natural number solutions'], make: (random) => rpmLinearIneqIntegerSolutionsCondition(random) },
  { id: 'rpm-linear-ineq-all-types-mixed', label: '[단원 실전 다지기] 일차부등식 전 유형 실전 종합', description: '부등식 성질, 괄호·소수·분수 계산, 해의 조건 등 일차부등식 전 유형 종합', en: ['Linear Inequalities Comprehensive Practice', 'Mixed practice across all linear inequality concepts and problem types'], make: (random) => rpmLinearIneqAllTypesMixed(random) },
  { id: 'rpm-linear-ineq-advanced-skill-up', label: '[단원 최고수준] 일차부등식 실력 UP', description: '자연수 해의 개수 경계조건 분석 및 복합 매개변수 최고난도 응용', en: ['Linear Inequalities Advanced Challenge', 'High-level challenge problems: boundary condition analysis on integer solutions'], make: (random) => rpmLinearIneqAdvancedSkillUp(random) },
];

export const RPM_INEQUALITY_APPS_APPLIED_UNITS = [
  { id: 'rpm-ineq-app-numbers', label: '[일차부등식 활용 01] 수에 대한 문제', description: '연속하는 세 정수/홀수/짝수의 합 조건 및 두 수의 차 부등식 세우기', en: ['Inequality Applications Type 01: Number Problems', 'Solve problems involving consecutive integers, sums and differences using inequalities'], make: (random) => rpmIneqAppNumbers(random) },
  { id: 'rpm-ineq-app-cost-count', label: '[일차부등식 활용 02] 가격과 개수에 대한 문제', description: '두 종류의 물건을 묶어 살 때 총 예산 한도 내에서 최대 개수 구하기', en: ['Inequality Applications Type 02: Price and Quantity', 'Maximize quantity of items purchased under a strict budget constraint'], make: (random) => rpmIneqAppCostCount(random) },
  { id: 'rpm-ineq-app-savings-deposit', label: '[일차부등식 활용 03] 예금액에 대한 문제', description: '매달 일정 금액을 저축할 때 한 사람의 예금액이 더 많아지는 시점 구하기', en: ['Inequality Applications Type 03: Savings and Deposits', 'Calculate after how many months one savings account exceeds another'], make: (random) => rpmIneqAppSavingsDeposit(random) },
  { id: 'rpm-ineq-app-average-score', label: '[일차부등식 활용 04] 평균 점수에 대한 문제', description: '목표 평균 점수를 달성하기 위해 마지막 시험에서 받아야 할 최저 점수 구하기', en: ['Inequality Applications Type 04: Average Scores', 'Determine minimum final test score required to achieve target average'], make: (random) => rpmIneqAppAverageScore(random) },
  { id: 'rpm-ineq-app-pricing-plans', label: '[일차부등식 활용 05] 요금제 선택에 대한 문제', description: '기본요금과 사용량 추가요금이 다른 두 요금제 중 유리한 조건 찾기', en: ['Inequality Applications Type 05: Pricing Plans Comparison', 'Compare monthly plan tiers with different base rates and per-unit usage costs'], make: (random) => rpmIneqAppPricingPlans(random) },
  { id: 'rpm-ineq-app-group-discount', label: '[일차부등식 활용 06] 단체 할인권 구매 문제', description: '입장 인원보다 많은 단체권을 사는 것이 개별 구매보다 유리한 최소 인원 구하기', en: ['Inequality Applications Type 06: Group Discount Tickets', 'Find minimum group size where buying a group discount ticket is cheaper than individual tickets'], make: (random) => rpmIneqAppGroupDiscount(random) },
  { id: 'rpm-ineq-app-store-comparison', label: '[일차부등식 활용 07] 동네 상점과 대형 할인점(인터넷) 비교', description: '교통비나 배송비를 고려할 때 대형 매장이나 인터넷 구매가 유리한 개수 구하기', en: ['Inequality Applications Type 07: Store vs Online Comparison', 'Determine break-even quantity when accounting for travel fare or shipping fees'], make: (random) => rpmIneqAppStoreComparison(random) },
  { id: 'rpm-ineq-app-cost-price-profit', label: '[일차부등식 활용 08] 원가·정가와 이익에 대한 문제', description: '원가에 이익을 붙여 정가를 정하고 할인하여 판매할 때 목표 이익 달성 부등식', en: ['Inequality Applications Type 08: Cost, Price & Profit', 'Formulate profit inequalities with markups, discount percentages, and minimum margins'], make: (random) => rpmIneqAppCostPriceProfit(random) },
  { id: 'rpm-ineq-app-geometry', label: '[일차부등식 활용 09] 도형에 대한 문제', description: '삼각형 세 변의 길이 조건, 사다리꼴 넓이 조건 등 도형 부등식 세우기', en: ['Inequality Applications Type 09: Geometric Applications', 'Apply inequalities to triangle inequality theorem, perimeter and trapezoid areas'], make: (random) => rpmIneqAppGeometry(random) },
  { id: 'rpm-ineq-app-salt-water-evaporate-add', label: '[일차부등식 활용 10] 소금물에 물을 증발시키거나 더 넣기', description: '물을 더 붓거나 증발시켜 목표 농도 이하/이상이 되도록 하는 물의 양 구하기', en: ['Inequality Applications Type 10: Diluting or Evaporating Salt Solutions', 'Calculate water added or evaporated to meet target concentration bounds'], make: (random) => rpmIneqAppSaltWaterEvaporateAdd(random) },
  { id: 'rpm-ineq-app-speed-round-trip-time', label: '[일차부등식 활용 11] 거·속·시 - 왕복 시간 조건', description: '갈 때와 올 때의 속력이 다를 때 정해진 총 시간 내에 다녀올 수 있는 최대 거리', en: ['Inequality Applications Type 11: Round-Trip Travel Time', 'Find maximum round-trip distance achievable within allotted time at differing speeds'], make: (random) => rpmIneqAppSpeedRoundTripTime(random) },
  { id: 'rpm-ineq-app-speed-shopping-station', label: '[일차부등식 활용 12] 거·속·시 - 물건 사 오기 및 역 대기 시간', description: '열차 출발 전 남은 시간 동안 상점에서 물건을 사고 올 수 있는 최대 거리 구하기', en: ['Inequality Applications Type 12: Station Shopping & Waiting Time', 'Calculate maximum reachable distance for shopping before scheduled train departure'], make: (random) => rpmIneqAppSpeedShoppingStation(random) },
  { id: 'rpm-ineq-app-speed-change-midway', label: '[일차부등식 활용 13] 거·속·시 - 도중에 속력이 바뀌는 경우', description: '도중에 걷다가 뛰었을 때 목표 시간 내에 도착하기 위해 뛰어야 하는 최소 거리', en: ['Inequality Applications Type 13: Mid-Route Speed Changes', 'Find minimum distance ran to reach destination within target time limit'], make: (random) => rpmIneqAppSpeedChangeMidway(random) },
  { id: 'rpm-ineq-app-all-types-mixed', label: '[단원 실전 다지기] 일차부등식의 활용 전 유형 실전 종합', description: '가격, 예금, 할인율, 원가·정가, 거속시, 농도 등 일차부등식 활용 전 유형 종합', en: ['Inequality Applications Comprehensive Practice', 'Mixed practice across all linear inequality word problem types'], make: (random) => rpmIneqAppAllTypesMixed(random) },
  { id: 'rpm-ineq-app-advanced-skill-up', label: '[단원 최고수준] 일차부등식의 활용 실력 UP', description: '단체 할인권 역전, 긴 의자/텐트 배정 문제 등 최고난도 실생활 응용', en: ['Inequality Applications Advanced Challenge', 'High-level challenge word problems: bench seating and ticket optimization'], make: (random) => rpmIneqAppAdvancedSkillUp(random) },
];

export const RPM_SYSTEMS_LINEAR_APPLIED_UNITS = [
  { id: 'rpm-sys-linear-two-vars-identify', label: '[연립일차방정식 01] 미지수가 2개인 일차방정식 식별', description: '미지수가 2개이고 각 미지수의 차수가 1인 일차방정식 골라내기', en: ['Systems Type 01: Identifying Two-Variable Linear Equations', 'Identify linear equations in two variables (ax + by + c = 0)'], make: (random) => rpmSysLinearTwoVarsIdentify(random) },
  { id: 'rpm-sys-linear-natural-pairs', label: '[연립일차방정식 02] 일차방정식의 자연수 해의 순서쌍', description: '미지수가 자연수일 때 일차방정식을 만족하는 순서쌍 (x, y)의 개수 구하기', en: ['Systems Type 02: Natural Number Solution Pairs', 'Find all ordered pairs (x, y) of natural numbers satisfying ax + by = c'], make: (random) => rpmSysLinearNaturalPairs(random) },
  { id: 'rpm-sys-linear-given-sol-find-constant', label: '[연립일차방정식 03] 해가 주어졌을 때 일차방정식의 상수 구하기', description: '순서쌍 (p, q)가 일차방정식의 해일 때 미지의 계수나 상수항 대입하여 구하기', en: ['Systems Type 03: Finding Constants from Single Equation Solution', 'Substitute given solution pair to determine unknown coefficient or constant'], make: (random) => rpmSysLinearGivenSolFindConstant(random) },
  { id: 'rpm-sys-linear-system-solution-concept', label: '[연립일차방정식 04] 연립일차방정식과 그 해의 뜻', description: '두 일차방정식을 동시에 만족하는 공통해 (x, y)의 개념 파악하기', en: ['Systems Type 04: Concept of System Solutions', 'Identify common solution pairs satisfying both linear equations simultaneously'], make: (random) => rpmSysLinearSystemSolutionConcept(random) },
  { id: 'rpm-sys-linear-given-sol-system-const', label: '[연립일차방정식 05] 연립방정식의 해가 주어질 때 상수 구하기', description: '공통해 (x, y)를 연립방정식의 각 식에 대입하여 미지수 a, b 구하기', en: ['Systems Type 05: Finding System Constants from Solution', 'Substitute common solution pair into system to solve for parameters a and b'], make: (random) => rpmSysLinearGivenSolSystemConst(random) },
  { id: 'rpm-sys-linear-substitution-method', label: '[연립일차방정식 06] 대입법을 이용한 연립방정식의 풀이', description: '한 식을 한 문자에 대하여 정리한 후 다른 식에 대입하여 연립방정식 풀기', en: ['Systems Type 06: Substitution Method', 'Solve systems by isolating one variable and substituting into the other equation'], make: (random) => rpmSysLinearSubstitutionMethod(random) },
  { id: 'rpm-sys-linear-addition-subtraction-method', label: '[연립일차방정식 07] 가감법을 이용한 연립방정식의 풀이', description: '양변에 적당한 수를 곱하여 계수의 절댓값을 같게 맞춘 후 더하거나 빼서 소거하기', en: ['Systems Type 07: Elimination Method (Addition/Subtraction)', 'Eliminate variables by multiplying equations and adding or subtracting'], make: (random) => rpmSysLinearAdditionSubtractionMethod(random) },
  { id: 'rpm-sys-linear-parentheses', label: '[연립일차방정식 08] 괄호가 있는 연립방정식의 풀이', description: '분배법칙을 이용하여 괄호를 풀고 동류항을 정리한 후 연립방정식 풀기', en: ['Systems Type 08: Systems with Parentheses', 'Expand grouping parentheses and simplify like terms before solving the system'], make: (random) => rpmSysLinearParentheses(random) },
  { id: 'rpm-sys-linear-decimals-fractions', label: '[연립일차방정식 09] 계수가 소수 또는 분수인 연립방정식', description: '10의 거듭제곱이나 분모의 최소공배수를 곱하여 정수 계수로 바꾼 후 풀기', en: ['Systems Type 09: Decimal & Fraction Coefficients', 'Clear decimals and denominators to transform systems into integer form'], make: (random) => rpmSysLinearDecimalsFractions(random) },
  { id: 'rpm-sys-linear-abc-form', label: '[연립일차방정식 10] A = B = C 꼴의 연립방정식의 풀이', description: '세 식 중 가장 간단한 식을 두 번 선택하여 두 개의 연립방정식으로 나누어 풀기', en: ['Systems Type 10: Systems of the Form A = B = C', 'Break cyclic tripartite equalities A = B = C into standard system pairs'], make: (random) => rpmSysLinearABCForm(random) },
  { id: 'rpm-sys-linear-satisfy-other-equation', label: '[연립일차방정식 11] 연립방정식의 해가 다른 일차식을 만족할 때', description: '미지의 상수가 없는 식과 추가 조건식을 먼저 연립하여 해를 구한 뒤 상수 대입', en: ['Systems Type 11: System Solutions Satisfying an Additional Equation', 'Pair parameter-free equations first to solve for (x, y), then determine constant'], make: (random) => rpmSysLinearSatisfyOtherEquation(random) },
  { id: 'rpm-sys-linear-variable-relation', label: '[연립일차방정식 12] 해에 대한 조건이 주어질 때 (x, y의 관계식)', description: 'x의 값이 y의 k배이거나 x - y = d 조건이 주어졌을 때 연립방정식 풀기', en: ['Systems Type 12: Conditions on Solutions (Variable Relations)', 'Incorporate given relations like x = ky or x - y = d to solve systems with constants'], make: (random) => rpmSysLinearVariableRelation(random) },
  { id: 'rpm-sys-linear-two-systems-common-sol', label: '[연립일차방정식 13] 두 연립방정식의 해가 서로 같을 때', description: '네 식 중 미지의 상수가 없는 두 식을 골라 연립하여 푼 후 상수를 구하기', en: ['Systems Type 13: Two Systems with Identical Solutions', 'Select the two parameter-free equations from both systems to resolve common solution'], make: (random) => rpmSysLinearTwoSystemsCommonSol(random) },
  { id: 'rpm-sys-linear-faulty-observation', label: '[연립일차방정식 14] 계수를 잘못 보고 푼 연립방정식', description: '잘못 본 계수 대신 바르게 본 다른 식에 해를 대입하여 올바른 관계 복원하기', en: ['Systems Type 14: Reconstructing Misread Coefficients', 'Identify correctly viewed equation to extract partial solutions and reconstruct constants'], make: (random) => rpmSysLinearFaultyObservation(random) },
  { id: 'rpm-sys-linear-special-infinitely-many', label: '[연립일차방정식 15] 해가 무수히 많은 연립방정식', description: "계수의 비가 a/a' = b/b' = c/c'로 모두 일치하여 두 직선이 일치하는 조건", en: ['Systems Type 15: Systems with Infinitely Many Solutions', "Apply coefficient ratio proportionality a/a' = b/b' = c/c' for coincident lines"], make: (random) => rpmSysLinearSpecialInfinitelyMany(random) },
  { id: 'rpm-sys-linear-special-no-solution', label: '[연립일차방정식 16] 해가 없는 연립방정식 (평행 조건)', description: "계수의 비가 a/a' = b/b' ≠ c/c'로 두 직선이 평행하여 교점이 없는 조건", en: ['Systems Type 16: Inconsistent Systems (No Solution)', "Identify parallel line conditions where a/a' = b/b' ≠ c/c'"], make: (random) => rpmSysLinearSpecialNoSolution(random) },
  { id: 'rpm-sys-linear-repeating-decimals', label: '[연립일차방정식 17] 순환소수를 포함한 연립방정식', description: '계수에 포함된 순환소수를 먼저 기약분수로 변환한 후 연립방정식 풀기', en: ['Systems Type 17: Systems with Repeating Decimals', 'Convert repeating decimal coefficients to irreducible fractions before solving'], make: (random) => rpmSysLinearRepeatingDecimals(random) },
  { id: 'rpm-sys-linear-all-types-mixed', label: '[단원 실전 다지기] 연립일차방정식 전 유형 실전 종합', description: '대입법·가감법, 복잡한 계수, 해의 조건 및 특수한 해 전 유형 종합', en: ['Systems of Equations Comprehensive Practice', 'Mixed practice covering all algebraic system solving techniques and special cases'], make: (random) => rpmSysLinearAllTypesMixed(random) },
  { id: 'rpm-sys-linear-advanced-skill-up', label: '[단원 최고수준] 연립일차방정식 실력 UP', description: '상수가 교차하는 대칭형 연립방정식 및 최고난도 미정계수 결정 문제', en: ['Systems of Equations Advanced Challenge', 'High-level challenge problems: symmetric system manipulations and parameter constraints'], make: (random) => rpmSysLinearAdvancedSkillUp(random) },
];

export const RPM_SYSTEMS_APPS_APPLIED_UNITS = [
  { id: 'rpm-sys-app-two-digit-numbers', label: '[연립방정식 활용 01] 두 자리 자연수에 대한 문제', description: '십의 자리와 일의 자리 숫자를 바꾸어 만든 수와 처음 수의 관계 연립방정식', en: ['Systems Apps Type 01: Two-Digit Number Problems', 'Form systems for two-digit numbers with reversed digits and sum/difference relations'], make: (random) => rpmSysAppTwoDigitNumbers(random) },
  { id: 'rpm-sys-app-ages', label: '[연립방정식 활용 02] 나이에 대한 문제', description: '현재 나이의 관계와 몇 년 후 나이의 배수 관계를 이용한 연립방정식', en: ['Systems Apps Type 02: Age Word Problems', 'Set up systems comparing current ages and projected future age multiples'], make: (random) => rpmSysAppAges(random) },
  { id: 'rpm-sys-app-price-quantity', label: '[연립방정식 활용 03] 가격과 개수에 대한 문제', description: '두 종류의 물건 가격과 총 개수, 총 결제 금액을 이용한 연립방정식', en: ['Systems Apps Type 03: Price and Quantity Systems', 'Solve for individual counts and costs given combined totals'], make: (random) => rpmSysAppPriceQuantity(random) },
  { id: 'rpm-sys-app-scores-rock-paper-scissors', label: '[연립방정식 활용 04] 가위바위보와 시험 점수 문제', description: '이긴 횟수와 진 횟수의 계단 오르기/점수 득실 관계를 이용한 연립방정식', en: ['Systems Apps Type 04: Rock-Paper-Scissors & Point Systems', 'Model win/loss steps and scoring rules with paired two-variable equations'], make: (random) => rpmSysAppScoresRockPaperScissors(random) },
  { id: 'rpm-sys-app-geometry', label: '[연립방정식 활용 05] 도형의 둘레와 넓이에 대한 문제', description: '직사각형의 둘레, 가로와 세로의 길이 변화에 따른 넓이 연립방정식', en: ['Systems Apps Type 05: Geometric Perimeter & Area Systems', 'Form equations from rectangle perimeters, dimension adjustments and areas'], make: (random) => rpmSysAppGeometry(random) },
  { id: 'rpm-sys-app-speed-opposite-same-track', label: '[연립방정식 활용 06] 거·속·시 - 둘레 트랙 마주보고/같은 방향 달리기', description: '호수 둘레를 반대 방향으로 돌 때(거리의 합=한 바퀴)와 같은 방향으로 돌 때(거리의 차=한 바퀴)', en: ['Systems Apps Type 06: Circular Track Motion (Opposite & Same Directions)', 'Solve closed-track speed problems using sum of distances and difference of distances'], make: (random) => rpmSysAppSpeedOppositeSameTrack(random) },
  { id: 'rpm-sys-app-speed-river-boat', label: '[연립방정식 활용 07] 거·속·시 - 강물을 거슬러 오르내리는 배의 속력', description: '강물을 따라 내려갈 때(정지 속력+강물 속력)와 거슬러 올라갈 때(정지 속력-강물 속력)', en: ['Systems Apps Type 07: River Current & Boat Speed', 'Model downstream (speed + current) and upstream (speed - current) boat travel'], make: (random) => rpmSysAppSpeedRiverBoat(random) },
  { id: 'rpm-sys-app-speed-train-bridge', label: '[연립방정식 활용 08] 거·속·시 - 기차가 철교나 터널을 완전히 통과하기', description: '철교를 완전히 통과할 때 이동 거리 = (철교 길이) + (기차 길이) 관계식', en: ['Systems Apps Type 08: Train Passing Bridges & Tunnels', 'Account for train length: total travel distance = bridge length + train length'], make: (random) => rpmSysAppSpeedTrainBridge(random) },
  { id: 'rpm-sys-app-salt-two-solutions', label: '[연립방정식 활용 09] 농도가 다른 두 소금물을 섞는 문제', description: '두 소금물을 섞을 때 총 소금물의 양과 소금의 양 보존 법칙 연립방정식', en: ['Systems Apps Type 09: Mixing Two Salt Solutions', 'Apply mass conservation for total solution and dissolved solute in mixture systems'], make: (random) => rpmSysAppSaltTwoSolutions(random) },
  { id: 'rpm-sys-app-salt-water-evaporate-add', label: '[연립방정식 활용 10] 소금물에 물을 넣거나 증발시키는 문제', description: '물을 더 넣거나 증발시켜 서로 다른 두 농도를 만드는 연립방정식', en: ['Systems Apps Type 10: Adding Water & Evaporation in Salt Solutions', 'Formulate two-state concentration adjustments via water addition and evaporation'], make: (random) => rpmSysAppSaltWaterEvaporateAdd(random) },
  { id: 'rpm-sys-app-alloy-metals', label: '[연립방정식 활용 11] 합금 속 금속의 포함 비율 문제', description: '두 종류의 합금 A, B를 녹여 원하는 비율의 구리와 아연 합금 만들기', en: ['Systems Apps Type 11: Alloy Metal Proportions', 'Calculate required masses of alloys A and B to produce target metal blends'], make: (random) => rpmSysAppAlloyMetals(random) },
  { id: 'rpm-sys-app-student-percent-change', label: '[연립방정식 활용 12] 전체 학생 수의 증가·감소율 문제', description: '작년 남학생/여학생 수 기준 증감률과 올해 총 학생 수 변화 연립방정식', en: ['Systems Apps Type 12: Percentage Increase/Decrease in Student Population', 'Set up base-year population equations using percentage changes for boys and girls'], make: (random) => rpmSysAppStudentPercentChange(random) },
  { id: 'rpm-sys-app-work-rate', label: '[연립방정식 활용 13] 일의 양에 대한 문제', description: '전체 일의 양을 1로 두고 하루 동안 하는 일의 양을 미지수로 세우는 연립방정식', en: ['Systems Apps Type 13: Work Rate Problems', 'Assign total work = 1 and solve for individual daily work completion rates'], make: (random) => rpmSysAppWorkRate(random) },
  { id: 'rpm-sys-app-cost-price-profit', label: '[연립방정식 활용 14] 두 제품의 원가와 정가, 총 이익 문제', description: '두 제품 A, B의 원가 합과 각각의 이익률을 적용한 총 이익 연립방정식', en: ['Systems Apps Type 14: Two-Product Cost, Markup & Total Profit', 'Solve for individual cost prices of two goods given combined cost and total profit'], make: (random) => rpmSysAppCostPriceProfit(random) },
  { id: 'rpm-sys-app-all-types-mixed', label: '[단원 실전 다지기] 연립일차방정식의 활용 전 유형 실전 종합', description: '수, 나이, 도형, 속력(트랙/강물/기차), 농도, 증감률, 일의 양 전 유형 실전 종합', en: ['Systems Applications Comprehensive Practice', 'Mixed practice across all word problem models using linear systems'], make: (random) => rpmSysAppAllTypesMixed(random) },
  { id: 'rpm-sys-app-advanced-skill-up', label: '[단원 최고수준] 연립일차방정식의 활용 실력 UP', description: '기차 길이와 터널 속 보이지 않는 시간, 복합 농도 역추적 최고난도 응용', en: ['Systems Applications Advanced Challenge', 'High-level challenge word problems: hidden train durations and dual-reaction mixtures'], make: (random) => rpmSysAppAdvancedSkillUp(random) },
];

export const RPM_LINEAR_FUNCTIONS_APPLIED_UNITS = [
  { id: 'rpm-linear-func-concept', label: '[일차함수 01] 함수의 뜻과 식별', description: 'x의 값 하나에 y의 값이 오직 하나씩 대응하는 함수 관계 판별하기', en: ['Linear Functions Type 01: Function Definition & Identification', 'Identify function relationships where each input x maps to exactly one output y'], make: (random) => rpmLinearFuncConcept(random) },
  { id: 'rpm-linear-func-eval-value', label: '[일차함수 02] 함숫값 f(a) 구하기', description: '일차함수 f(x) = ax + b에서 주어진 x값에 대한 함숫값 및 선형 결합 계산', en: ['Linear Functions Type 02: Evaluating Function Values', 'Calculate function values f(a) and linear combinations like pf(a) + qf(b)'], make: (random) => rpmLinearFuncEvalValue(random) },
  { id: 'rpm-linear-func-identify-linear', label: '[일차함수 03] 일차함수의 뜻과 식별', description: '정리했을 때 y = ax + b (a ≠ 0) 꼴이 되는 일차함수 식별하기', en: ['Linear Functions Type 03: Identifying Linear Functions', 'Distinguish linear functions in the form y = ax + b (a ≠ 0) from others'], make: (random) => rpmLinearFuncIdentifyLinear(random) },
  { id: 'rpm-linear-func-point-on-graph', label: '[일차함수 04] 일차함수 그래프 위의 점', description: '점 (p, q)를 식에 대입하여 그래프 위의 점 판별 및 미지수 구하기', en: ['Linear Functions Type 04: Points on the Graph', 'Substitute coordinates (p, q) into linear equations to verify or find unknowns'], make: (random) => rpmLinearFuncPointOnGraph(random) },
  { id: 'rpm-linear-func-translation-y', label: '[일차함수 05] 일차함수 그래프의 평행이동', description: 'y = ax의 그래프를 y축 방향으로 b만큼 평행이동한 y = ax + b 식 구하기', en: ['Linear Functions Type 05: Vertical Translations', 'Translate graphs along the y-axis to obtain y = ax + b'], make: (random) => rpmLinearFuncTranslationY(random) },
  { id: 'rpm-linear-func-intercepts', label: '[일차함수 06] 일차함수 그래프의 x절편, y절편', description: 'x절편(y=0일 때 x값)과 y절편(x=0일 때 y값) 구하기 및 성질 파악', en: ['Linear Functions Type 06: x- and y-Intercepts', 'Find x-intercept (y = 0) and y-intercept (x = 0) of linear functions'], make: (random) => rpmLinearFuncIntercepts(random) },
  { id: 'rpm-linear-func-slope-definition', label: '[일차함수 07] 기울기의 뜻과 증가량', description: '기울기 = (y의 증가량)/(x의 증가량) = a 공식을 이용한 증가량 계산', en: ['Linear Functions Type 07: Slope Definition & Rate of Change', 'Apply slope formula m = Δy / Δx to determine coordinate changes'], make: (random) => rpmLinearFuncSlopeDefinition(random) },
  { id: 'rpm-linear-func-slope-two-points', label: '[일차함수 08] 두 점을 지나는 일차함수의 기울기', description: '서로 다른 두 점 (x1, y1), (x2, y2)를 지나는 직선의 기울기 구하기', en: ['Linear Functions Type 08: Slope Through Two Points', 'Calculate slope m = (y2 - y1) / (x2 - x1) from two given points'], make: (random) => rpmLinearFuncSlopeTwoPoints(random) },
  { id: 'rpm-linear-func-draw-quadrants', label: '[일차함수 09] 그래프 그리기와 지나는 사분면', description: '기울기와 y절편의 부호를 바탕으로 그래프가 지나지 않는 사분면 판별', en: ['Linear Functions Type 09: Graphing & Quadrants', 'Determine which quadrants the graph passes through based on slope and intercept signs'], make: (random) => rpmLinearFuncDrawQuadrants(random) },
  { id: 'rpm-linear-func-axis-triangle-area', label: '[일차함수 10] 그래프와 좌표축으로 둘러싸인 넓이', description: '직선과 x축, y축으로 둘러싸인 직각삼각형의 넓이 = 1/2 × |x절편| × |y절편|', en: ['Linear Functions Type 10: Area Enclosed with Axes', 'Calculate triangle area enclosed by axes: 1/2 × |x-int| × |y-int|'], make: (random) => rpmLinearFuncAxisTriangleArea(random) },
  { id: 'rpm-linear-func-sign-properties', label: '[일차함수 11] y = ax + b의 성질 (부호 판별)', description: '그래프의 모양(오른쪽 위/아래)과 y절편 위치로부터 a, b의 부호 판별', en: ['Linear Functions Type 11: Sign Properties of a and b', 'Determine signs of parameters a and b from graph direction and axis intersection'], make: (random) => rpmLinearFuncSignProperties(random) },
  { id: 'rpm-linear-func-parallel-lines', label: '[일차함수 12] 서로 평행한 두 일차함수의 그래프', description: '기울기가 같고 y절편이 다른 두 직선의 평행 조건 (a = c, b ≠ d) 활용', en: ['Linear Functions Type 12: Parallel Lines Conditions', 'Apply parallel condition: equal slopes and distinct y-intercepts (a = c, b ≠ d)'], make: (random) => rpmLinearFuncParallelLines(random) },
  { id: 'rpm-linear-func-coincident-lines', label: '[일차함수 13] 일치하는 두 일차함수의 그래프', description: '기울기와 y절편이 모두 같아 두 직선이 완전히 포개어지는 일치 조건 (a = c, b = d)', en: ['Linear Functions Type 13: Coincident Lines Conditions', 'Apply coincident condition: equal slopes and equal y-intercepts (a = c, b = d)'], make: (random) => rpmLinearFuncCoincidentLines(random) },
  { id: 'rpm-linear-func-comprehensive-properties', label: '[일차함수 14] 일차함수의 성질 종합 판정', description: '기울기, 절편, 증가/감소 방향, 사분면 등 일차함수 성질 참/거짓 판정', en: ['Linear Functions Type 14: Comprehensive Property Verification', 'Verify true/false statements regarding slope, intercepts, variation, and quadrants'], make: (random) => rpmLinearFuncComprehensiveProperties(random) },
  { id: 'rpm-linear-func-app-temperature', label: '[일차함수 활용 15] 온도와 길이', description: '일정한 비율로 식는 물의 온도 또는 타들어가는 양초 길이의 일차함수 모델링', en: ['Linear Functions Apps Type 15: Temperature & Length', 'Model temperature cooling and burning candle lengths using linear functions'], make: (random) => rpmLinearFuncAppTemperature(random) },
  { id: 'rpm-linear-func-app-water-tank', label: '[일차함수 활용 16] 물의 양', description: '물탱크에 일정한 속도로 물을 채우거나 뺄 때 경과 시간과 물의 양 관계', en: ['Linear Functions Apps Type 16: Water Tank Rates', 'Model water tank filling and draining rates over time with linear functions'], make: (random) => rpmLinearFuncAppWaterTank(random) },
  { id: 'rpm-linear-func-app-speed-distance', label: '[일차함수 활용 17] 속력, 거리, 시간', description: '시속 v로 목적지를 향해 이동할 때 남은 거리와 경과 시간의 일차함수 모델링', en: ['Linear Functions Apps Type 17: Speed, Distance & Time', 'Model remaining travel distance over time at constant speed using linear functions'], make: (random) => rpmLinearFuncAppSpeedDistance(random) },
  { id: 'rpm-linear-func-app-moving-point', label: '[일차함수 활용 18] 도형 위를 움직이는 동점 P', description: '직사각형이나 사다리꼴의 변 위를 일정한 속력으로 움직이는 점에 따른 넓이 변화', en: ['Linear Functions Apps Type 18: Moving Points on Figures', 'Model changing triangle areas generated by moving point P along polygon boundaries'], make: (random) => rpmLinearFuncAppMovingPoint(random) },
  { id: 'rpm-linear-func-app-graph-modeling', label: '[일차함수 활용 19] 그래프가 주어진 경우의 모델링', description: '실생활 상황의 그래프에서 절편과 기울기를 찾아 관계식 세우기', en: ['Linear Functions Apps Type 19: Modeling from Given Graphs', 'Extract slope and intercepts from empirical line graphs to determine equations'], make: (random) => rpmLinearFuncAppGraphModeling(random) },
  { id: 'rpm-linear-func-up-two-lines-area', label: '[유형 UP 20] 두 일차함수 그래프와 축으로 둘러싸인 넓이', description: '두 직선의 교점과 x절편(또는 y절편)으로 이루어진 삼각형의 넓이 계산', en: ['Linear Functions Type 20 (UP): Triangle Area Between Two Lines and Axis', 'Calculate enclosed triangle area from two lines intersecting with a coordinate axis'], make: (random) => rpmLinearFuncUpTwoLinesArea(random) },
  { id: 'rpm-linear-func-up-quadrant-condition', label: '[유형 UP 21] 특정 사분면을 지나지 않을 조건', description: '미지의 상수를 포함한 직선이 주어진 사분면을 지나지 않도록 하는 범위 결정', en: ['Linear Functions Type 21 (UP): Quadrant Avoidance Constraints', 'Determine parameter bounds for a line to avoid passing through a specified quadrant'], make: (random) => rpmLinearFuncUpQuadrantCondition(random) },
  { id: 'rpm-linear-func-all-types-mixed', label: '[단원 실전 다지기] 일차함수와 그 그래프 전 유형 실전 종합', description: '함수 개념, 평행이동, 절편·기울기, 사분면, 평행·일치, 실생활 활용 전 유형 종합', en: ['Linear Functions Comprehensive Practice', 'Mixed practice across all linear function concepts, representations, and word problems'], make: (random) => rpmLinearFuncAllTypesMixed(random) },
  { id: 'rpm-linear-func-advanced-skill-up', label: '[단원 최고수준] 일차함수와 그 그래프 실력 UP', description: '평행선 사이의 절편 거리 제약 및 고난도 매개변수 결정 심화 문제', en: ['Linear Functions Advanced Challenge', 'High-level challenge problems: parallel intercept distances and complex parameters'], make: (random) => rpmLinearFuncAdvancedSkillUp(random) },
];

export const RPM_LINEAR_EQUATIONS_GRAPHS_APPLIED_UNITS = [
  { id: 'rpm-line-eqn-form-ax-by-c', label: '[직선의 방정식 01] 일차방정식 ax + by + c = 0의 그래프', description: '일차방정식을 y = -a/b x - c/b 꼴로 변형하여 기울기와 x, y절편 구하기', en: ['Line Equations Type 01: Standard Form ax + by + c = 0', 'Transform general linear equation into slope-intercept form to find slope and intercepts'], make: (random) => rpmLineEqnFormAxByC(random) },
  { id: 'rpm-line-eqn-point-on-line', label: '[직선의 방정식 02] 일차방정식의 그래프 위의 점', description: '점 (p, q)의 좌표를 ax + by + c = 0에 대입하여 미지의 계수 구하기', en: ['Line Equations Type 02: Points on the Line', 'Substitute point coordinates (p, q) into standard equations to solve for unknown coefficients'], make: (random) => rpmLineEqnPointOnLine(random) },
  { id: 'rpm-line-eqn-signs-properties', label: '[직선의 방정식 03] 계수의 부호와 그래프의 개형', description: 'ab, bc의 부호 조건으로부터 직선의 기울기와 y절편의 부호를 판정하고 개형 그리기', en: ['Line Equations Type 03: Coefficient Signs & Graph Trajectory', 'Deduce slope and intercept signs from ab and bc products to plot line trajectories'], make: (random) => rpmLineEqnSignsProperties(random) },
  { id: 'rpm-line-eqn-parallel-to-axes', label: '[직선의 방정식 04] 좌표축에 평행한 직선의 방정식', description: 'x축에 평행한 직선(y = q, 기울기 0)과 y축에 평행한 직선(x = p, 기울기 없음)', en: ['Line Equations Type 04: Lines Parallel to Coordinate Axes', 'Form equations for horizontal lines y = q and vertical lines x = p'], make: (random) => rpmLineEqnParallelToAxes(random) },
  { id: 'rpm-line-eqn-four-lines-rect-area', label: '[직선의 방정식 05] 축에 평행한 네 직선으로 둘러싸인 넓이', description: 'x = p1, x = p2, y = q1, y = q2로 둘러싸인 직사각형의 넓이 계산', en: ['Line Equations Type 05: Area Enclosed by Four Axis-Parallel Lines', 'Compute rectangular area enclosed by x = p1, x = p2, y = q1, and y = q2'], make: (random) => rpmLineEqnFourLinesRectArea(random) },
  { id: 'rpm-line-eqn-from-slope-yint', label: '[직선의 방정식 06] 기울기와 y절편이 주어질 때', description: '기울기 m과 y절편 n을 이용하여 직선의 방정식 y = mx + n 완성하기', en: ['Line Equations Type 06: Given Slope and y-Intercept', 'Construct line equation y = mx + n from specified slope and y-intercept'], make: (random) => rpmLineEqnFromSlopeYint(random) },
  { id: 'rpm-line-eqn-from-slope-point', label: '[직선의 방정식 07] 기울기와 한 점이 주어질 때', description: '기울기 m과 한 점 (x1, y1)을 이용하여 y - y1 = m(x - x1) 식 세우기', en: ['Line Equations Type 07: Given Slope and a Point', 'Form line equation y - y1 = m(x - x1) from slope and coordinates of a point'], make: (random) => rpmLineEqnFromSlopePoint(random) },
  { id: 'rpm-line-eqn-from-two-points', label: '[직선의 방정식 08] 서로 다른 두 점이 주어질 때', description: '두 점 (x1, y1), (x2, y2)로부터 기울기를 먼저 구하고 직선의 방정식 완성하기', en: ['Line Equations Type 08: Line Through Two Distinct Points', 'Calculate slope from two points and determine full equation of the line'], make: (random) => rpmLineEqnFromTwoPoints(random) },
  { id: 'rpm-line-eqn-from-intercepts', label: '[직선의 방정식 09] x절편과 y절편이 주어질 때', description: '두 점 (a, 0), (0, b)를 지나는 직선의 기울기와 방정식 구하기', en: ['Line Equations Type 09: Given x- and y-Intercepts', 'Determine line equation and slope from known intercepts (a, 0) and (0, b)'], make: (random) => rpmLineEqnFromIntercepts(random) },
  { id: 'rpm-line-eqn-intersection-as-solution', label: '[직선의 방정식 10] 연립방정식의 해와 두 직선의 교점', description: '두 일차방정식 그래프의 교점의 좌표는 연립방정식의 유일한 해와 같음을 활용', en: ['Line Equations Type 10: System Solutions as Line Intersections', 'Equate coordinates of geometric line intersections with algebraic system solutions'], make: (random) => rpmLineEqnIntersectionAsSolution(random) },
  { id: 'rpm-line-eqn-intersection-find-const', label: '[직선의 방정식 11] 교점의 좌표를 이용한 미지수 구하기', description: '두 직선의 교점의 x좌표나 y좌표가 주어질 때 연립하여 미지의 상수 결정', en: ['Line Equations Type 11: Finding Parameters from Intersection Coordinates', 'Determine unknown system coefficients using partial intersection coordinate information'], make: (random) => rpmLineEqnIntersectionFindConst(random) },
  { id: 'rpm-line-eqn-line-through-intersection', label: '[직선의 방정식 12] 두 직선의 교점을 지나는 직선', description: '두 직선의 교점을 구한 후 평행 조건이나 추가 점 조건을 만족하는 직선 구하기', en: ['Line Equations Type 12: Line Passing Through an Intersection', 'Find intersection of two lines and construct a new line satisfying slope or point conditions'], make: (random) => rpmLineEqnLineThroughIntersection(random) },
  { id: 'rpm-line-eqn-three-lines-one-point', label: '[직선의 방정식 13] 세 직선이 한 점에서 만날 조건', description: '두 직선의 교점의 좌표를 나머지 한 직선의 식에 대입하여 미지의 상수 구하기', en: ['Line Equations Type 13: Three Lines Concurrent at One Point', 'Intersect two parameter-free lines and substitute coordinates into third line'], make: (random) => rpmLineEqnThreeLinesOnePoint(random) },
  { id: 'rpm-line-eqn-system-solution-types', label: '[직선의 방정식 14] 해의 개수와 두 직선의 위치 관계', description: '한 점에서 만남(해 1개), 평행(해 없음), 일치(해 무수히 많음)의 계수비 조건 판별', en: ['Line Equations Type 14: System Solution Counts & Line Geometries', 'Classify intersection counts (unique, none, infinite) using coefficient proportionality ratios'], make: (random) => rpmLineEqnSystemSolutionTypes(random) },
  { id: 'rpm-line-eqn-enclosed-triangle-area', label: '[직선의 방정식 15] 두 직선과 좌표축으로 둘러싸인 넓이', description: '두 직선의 교점과 x절편(또는 y절편)으로 이루어진 삼각형의 밑변과 높이로 넓이 계산', en: ['Line Equations Type 15: Area Enclosed by Two Lines and an Axis', 'Compute triangle area formed by intersection point and intercepts along coordinate axes'], make: (random) => rpmLineEqnEnclosedTriangleArea(random) },
  { id: 'rpm-line-eqn-apps-real-life', label: '[직선의 방정식 활용 16] 직선의 방정식의 실생활 활용', description: '두 물탱크의 잔여 수량 그래프 등 교점의 의미(동일 시점)를 활용한 문제 해결', en: ['Line Equations Apps Type 16: Real-Life Systems Modeling', 'Solve real-world comparison problems (water volume, savings) using intersection points'], make: (random) => rpmLineEqnAppsRealLife(random) },
  { id: 'rpm-line-eqn-up-line-meets-segment', label: '[유형 UP 17] 직선과 선분이 만날 조건', description: '고정점을 지나는 직선이 선분 AB와 만나기 위한 기울기의 최대/최솟값 범위 구하기', en: ['Line Equations Type 17 (UP): Line Intersecting a Line Segment', 'Find slope bounds for a line through a fixed point to intersect line segment AB'], make: (random) => rpmLineEqnUpLineMeetsSegment(random) },
  { id: 'rpm-line-eqn-up-bisect-triangle-area', label: '[유형 UP 18] 삼각형의 넓이를 이등분하는 직선', description: '원점을 지나는 직선이 축과 만나는 직각삼각형의 넓이를 이등분할 때 대변의 중점 통과', en: ['Line Equations Type 18 (UP): Line Bisecting Triangle Area', 'Determine slope of line through origin passing through midpoint of hypotenuse to bisect area'], make: (random) => rpmLineEqnUpBisectTriangleArea(random) },
  { id: 'rpm-line-eqn-all-types-mixed', label: '[단원 실전 다지기] 일차함수와 일차방정식 전 유형 실전 종합', description: '일차방정식 그래프, 축 평행선, 직선 구하기, 교점과 연립방정식, 넓이 전 유형 종합', en: ['Line Equations Comprehensive Practice', 'Mixed applied practice across all linear equation graphs and intersection systems'], make: (random) => rpmLineEqnAllTypesMixed(random) },
  { id: 'rpm-line-eqn-advanced-skill-up', label: '[단원 최고수준] 일차함수와 일차방정식 실력 UP', description: '세 직선이 삼각형을 이루지 않을 조건(평행 또는 한 점 일치) 등 최고난도 응용', en: ['Line Equations Advanced Challenge', 'High-level challenge problems: non-triangle conditions for three lines (parallelism or concurrency)'], make: (random) => rpmLineEqnAdvancedSkillUp(random) },
];

export const RPM_GRADE8_FINAL_MOCK_UNITS = [
  { id: 'rpm-grade8-semester-one-final-exam', label: '[중2-1 최종총괄] 중학 2-1 전 범위 최종 실전 총괄 모의고사', description: '유리수와 순환소수, 식의 계산, 일차부등식, 연립일차방정식, 일차함수와 그래프 전 범위 총괄 평가 (RPM p.152~167)', en: ['Grade 8-1 Comprehensive Final Examination', 'Ultimate comprehensive mock exam covering all chapters of Grade 8 Semester 1 (Rational Decimals, Monomials, Polynomials, Inequalities, Linear Systems, Linear Functions)'], make: (random) => rpmGrade8SemesterOneFinalExam(random) },
];



const SOURCE_GROUPS = [
  ['수와 연산', ['pre-algebra', 'kr-middle-1'], PRIME_BASIC_UNITS],
  ['수와 연산', ['pre-algebra', 'kr-middle-1'], GCD_LCM_BASIC_UNITS],
  ['수와 연산', ['pre-algebra', 'kr-middle-1'], INTEGER_RATIONAL_UNITS],
  ['유리수와 순환소수', ['pre-algebra', 'kr-middle-2'], RPM_RATIONAL_DECIMALS_APPLIED_UNITS],
  ['단항식의 계산', ['pre-algebra', 'kr-middle-2', 'algebra-1'], RPM_MONOMIALS_APPLIED_UNITS],
  ['다항식의 계산', ['pre-algebra', 'kr-middle-2', 'algebra-1'], RPM_POLYNOMIALS_APPLIED_UNITS],
  ['일차부등식', ['pre-algebra', 'kr-middle-2', 'algebra-1'], RPM_LINEAR_INEQUALITIES_APPLIED_UNITS],
  ['일차부등식의 활용', ['pre-algebra', 'kr-middle-2', 'algebra-1'], RPM_INEQUALITY_APPS_APPLIED_UNITS],
  ['연립일차방정식', ['pre-algebra', 'kr-middle-2', 'algebra-1'], RPM_SYSTEMS_LINEAR_APPLIED_UNITS],
  ['연립일차방정식의 활용', ['pre-algebra', 'kr-middle-2', 'algebra-1'], RPM_SYSTEMS_APPS_APPLIED_UNITS],
  ['일차함수와 그래프', ['pre-algebra', 'kr-middle-2', 'algebra-1'], RPM_LINEAR_FUNCTIONS_APPLIED_UNITS],
  ['일차함수와 일차방정식', ['pre-algebra', 'kr-middle-2', 'algebra-1'], RPM_LINEAR_EQUATIONS_GRAPHS_APPLIED_UNITS],
  ['중2-1 총괄 모의고사', ['pre-algebra', 'kr-middle-2'], RPM_GRADE8_FINAL_MOCK_UNITS],
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

  // RPM 2-1 Chapter 02 단항식의 계산
  'rpm-mono-exponent-sum': 'basic',
  'rpm-mono-exponent-product': 'basic',
  'rpm-mono-exponent-quotient': 'basic',
  'rpm-mono-exponent-power-product': 'basic',
  'rpm-mono-exponent-power-quotient': 'basic',
  'rpm-mono-exponent-equation-base': 'intermediate',
  'rpm-mono-exponent-addition': 'intermediate',
  'rpm-mono-exponent-substitution': 'intermediate',
  'rpm-mono-exponent-digits-count': 'intermediate',
  'rpm-mono-mult-basic': 'basic',
  'rpm-mono-div-basic': 'basic',
  'rpm-mono-mult-div-mixed': 'intermediate',
  'rpm-mono-missing-box': 'intermediate',
  'rpm-mono-geometry-app': 'intermediate',
  'rpm-mono-exponent-factor-out': 'intermediate',
  'rpm-mono-units-digit-cycle': 'intermediate',
  'rpm-mono-all-mixed': 'advanced',
  'rpm-mono-advanced-skill-up': 'advanced',

  // RPM 2-1 Chapter 03 다항식의 계산
  'rpm-poly-calc-add-sub-basic': 'basic',
  'rpm-poly-calc-quadratic-add-sub': 'basic',
  'rpm-poly-calc-brackets-order': 'intermediate',
  'rpm-poly-calc-wrong-calculation': 'intermediate',
  'rpm-poly-calc-monomial-mult': 'basic',
  'rpm-poly-calc-monomial-div': 'intermediate',
  'rpm-poly-calc-four-ops-mixed': 'intermediate',
  'rpm-poly-calc-missing-box': 'intermediate',
  'rpm-poly-calc-evaluate-value': 'intermediate',
  'rpm-poly-calc-sub-expression': 'intermediate',
  'rpm-poly-calc-geometry-app': 'intermediate',
  'rpm-poly-calc-all-mixed': 'advanced',
  'rpm-poly-calc-advanced-skill-up': 'advanced',

  // RPM 2-1 Chapter 04 일차부등식
  'rpm-linear-ineq-concept-identify': 'basic',
  'rpm-linear-ineq-truth-value': 'basic',
  'rpm-linear-ineq-express-sentence': 'basic',
  'rpm-linear-ineq-properties': 'basic',
  'rpm-linear-ineq-range-of-expression': 'intermediate',
  'rpm-linear-ineq-identify-linear': 'basic',
  'rpm-linear-ineq-solve-basic-number-line': 'basic',
  'rpm-linear-ineq-brackets': 'intermediate',
  'rpm-linear-ineq-decimals-fractions': 'intermediate',
  'rpm-linear-ineq-same-solution': 'intermediate',
  'rpm-linear-ineq-given-solution-find-constant': 'intermediate',
  'rpm-linear-ineq-negative-coeff': 'intermediate',
  'rpm-linear-ineq-integer-solutions-condition': 'intermediate',
  'rpm-linear-ineq-all-types-mixed': 'advanced',
  'rpm-linear-ineq-advanced-skill-up': 'advanced',

  // RPM 2-1 Chapter 05 일차부등식의 활용
  'rpm-ineq-app-numbers': 'intermediate',
  'rpm-ineq-app-cost-count': 'intermediate',
  'rpm-ineq-app-savings-deposit': 'intermediate',
  'rpm-ineq-app-average-score': 'intermediate',
  'rpm-ineq-app-pricing-plans': 'intermediate',
  'rpm-ineq-app-group-discount': 'intermediate',
  'rpm-ineq-app-store-comparison': 'intermediate',
  'rpm-ineq-app-cost-price-profit': 'intermediate',
  'rpm-ineq-app-geometry': 'intermediate',
  'rpm-ineq-app-salt-water-evaporate-add': 'intermediate',
  'rpm-ineq-app-speed-round-trip-time': 'intermediate',
  'rpm-ineq-app-speed-shopping-station': 'intermediate',
  'rpm-ineq-app-speed-change-midway': 'intermediate',
  'rpm-ineq-app-all-types-mixed': 'advanced',
  'rpm-ineq-app-advanced-skill-up': 'advanced',

  // RPM 2-1 Chapter 06 연립일차방정식
  'rpm-sys-linear-two-vars-identify': 'basic',
  'rpm-sys-linear-natural-pairs': 'basic',
  'rpm-sys-linear-given-sol-find-constant': 'basic',
  'rpm-sys-linear-system-solution-concept': 'basic',
  'rpm-sys-linear-given-sol-system-const': 'intermediate',
  'rpm-sys-linear-substitution-method': 'basic',
  'rpm-sys-linear-addition-subtraction-method': 'basic',
  'rpm-sys-linear-parentheses': 'intermediate',
  'rpm-sys-linear-decimals-fractions': 'intermediate',
  'rpm-sys-linear-abc-form': 'intermediate',
  'rpm-sys-linear-satisfy-other-equation': 'intermediate',
  'rpm-sys-linear-variable-relation': 'intermediate',
  'rpm-sys-linear-two-systems-common-sol': 'intermediate',
  'rpm-sys-linear-faulty-observation': 'intermediate',
  'rpm-sys-linear-special-infinitely-many': 'intermediate',
  'rpm-sys-linear-special-no-solution': 'intermediate',
  'rpm-sys-linear-repeating-decimals': 'intermediate',
  'rpm-sys-linear-all-types-mixed': 'advanced',
  'rpm-sys-linear-advanced-skill-up': 'advanced',

  // RPM 2-1 Chapter 07 연립일차방정식의 활용
  'rpm-sys-app-two-digit-numbers': 'intermediate',
  'rpm-sys-app-ages': 'intermediate',
  'rpm-sys-app-price-quantity': 'intermediate',
  'rpm-sys-app-scores-rock-paper-scissors': 'intermediate',
  'rpm-sys-app-geometry': 'intermediate',
  'rpm-sys-app-speed-opposite-same-track': 'intermediate',
  'rpm-sys-app-speed-river-boat': 'intermediate',
  'rpm-sys-app-speed-train-bridge': 'intermediate',
  'rpm-sys-app-salt-two-solutions': 'intermediate',
  'rpm-sys-app-salt-water-evaporate-add': 'intermediate',
  'rpm-sys-app-alloy-metals': 'intermediate',
  'rpm-sys-app-student-percent-change': 'intermediate',
  'rpm-sys-app-work-rate': 'intermediate',
  'rpm-sys-app-cost-price-profit': 'intermediate',
  'rpm-sys-app-all-types-mixed': 'advanced',
  'rpm-sys-app-advanced-skill-up': 'advanced',

  // RPM 2-1 Chapter 08 일차함수와 그 그래프
  'rpm-linear-func-concept': 'basic',
  'rpm-linear-func-eval-value': 'basic',
  'rpm-linear-func-identify-linear': 'basic',
  'rpm-linear-func-point-on-graph': 'basic',
  'rpm-linear-func-translation-y': 'basic',
  'rpm-linear-func-intercepts': 'basic',
  'rpm-linear-func-slope-definition': 'basic',
  'rpm-linear-func-slope-two-points': 'basic',
  'rpm-linear-func-draw-quadrants': 'intermediate',
  'rpm-linear-func-axis-triangle-area': 'intermediate',
  'rpm-linear-func-sign-properties': 'intermediate',
  'rpm-linear-func-parallel-lines': 'intermediate',
  'rpm-linear-func-coincident-lines': 'intermediate',
  'rpm-linear-func-comprehensive-properties': 'intermediate',
  'rpm-linear-func-app-temperature': 'intermediate',
  'rpm-linear-func-app-water-tank': 'intermediate',
  'rpm-linear-func-app-speed-distance': 'intermediate',
  'rpm-linear-func-app-moving-point': 'intermediate',
  'rpm-linear-func-app-graph-modeling': 'intermediate',
  'rpm-linear-func-up-two-lines-area': 'intermediate',
  'rpm-linear-func-up-quadrant-condition': 'intermediate',
  'rpm-linear-func-all-types-mixed': 'advanced',
  'rpm-linear-func-advanced-skill-up': 'advanced',

  // RPM 2-1 Chapter 09 일차함수와 일차방정식의 관계
  'rpm-line-eqn-form-ax-by-c': 'basic',
  'rpm-line-eqn-point-on-line': 'basic',
  'rpm-line-eqn-signs-properties': 'intermediate',
  'rpm-line-eqn-parallel-to-axes': 'basic',
  'rpm-line-eqn-four-lines-rect-area': 'intermediate',
  'rpm-line-eqn-from-slope-yint': 'basic',
  'rpm-line-eqn-from-slope-point': 'basic',
  'rpm-line-eqn-from-two-points': 'basic',
  'rpm-line-eqn-from-intercepts': 'basic',
  'rpm-line-eqn-intersection-as-solution': 'basic',
  'rpm-line-eqn-intersection-find-const': 'intermediate',
  'rpm-line-eqn-line-through-intersection': 'intermediate',
  'rpm-line-eqn-three-lines-one-point': 'intermediate',
  'rpm-line-eqn-system-solution-types': 'intermediate',
  'rpm-line-eqn-enclosed-triangle-area': 'intermediate',
  'rpm-line-eqn-apps-real-life': 'intermediate',
  'rpm-line-eqn-up-line-meets-segment': 'intermediate',
  'rpm-line-eqn-up-bisect-triangle-area': 'intermediate',
  'rpm-line-eqn-all-types-mixed': 'advanced',
  'rpm-line-eqn-advanced-skill-up': 'advanced',

  // RPM 2-1 최종총괄 모의고사 (p.152~167)
  'rpm-grade8-semester-one-final-exam': 'advanced',



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
