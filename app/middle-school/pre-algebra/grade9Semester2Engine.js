// Korean Middle School Grade 9 Semester 2 (중3-2) Applied Problem Generators
// Based on thorough analysis of Korean curriculum 3-2 workbook problem types:
// Chapters:
//   01 삼각비 (Trigonometric Ratios)
//   02 삼각비의 활용 (Applications of Trigonometry)
//   03 원과 직선 (Circles and Lines)
//   04 원주각 (Inscribed Angles)
//   05 대푯값과 산포도 (Representative Values & Variation)
//   06 상관관계 (Scatter Plots & Correlation)
//   실력 UP+ (Advanced Challenge)
//   중3-2 전 범위 종합 실전 모의고사 (Capstone 25-Problem Exam)
// Absolutely NO brand names in user-facing labels or descriptions.

const ri = (random, min, max) => Math.floor(random() * (max - min + 1)) + min;
const pick = (random, values) => values[ri(random, 0, values.length - 1)];

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a || 1;
}

function fraction(n, d) {
  if (d === 0) return '0';
  const divisor = gcd(n, d);
  const sign = (n * d < 0) ? -1 : 1;
  const num = sign * Math.abs(n) / divisor;
  const den = Math.abs(d) / divisor;
  if (den === 1) return String(num);
  return `${num}/${den}`;
}

function fractionLatex(n, d) {
  if (d === 0) return '0';
  const divisor = gcd(n, d);
  const sign = (n * d < 0) ? '-' : '';
  const num = Math.abs(n) / divisor;
  const den = Math.abs(d) / divisor;
  if (den === 1) return `${sign}${num}`;
  return `${sign}\\frac{${num}}{${den}}`;
}

// Simplify sqrt(n) -> { outside: a, inside: b } where n = a^2 * b
function simplifyRadical(n) {
  if (n <= 0) return { outside: 0, inside: 0 };
  let outside = 1;
  let inside = n;
  for (let i = 2; i * i <= inside; i++) {
    while (inside % (i * i) === 0) {
      outside *= i;
      inside /= (i * i);
    }
  }
  return { outside, inside };
}

function radicalToString(outside, inside) {
  if (inside === 0) return '0';
  if (inside === 1) return String(outside);
  if (outside === 1) return `\\sqrt{${inside}}`;
  if (outside === -1) return `-\\sqrt{${inside}}`;
  return `${outside}\\sqrt{${inside}}`;
}

// =============================================================================
// Chapter 01: 삼각비 (Trigonometric Ratios)
// =============================================================================

// 1. [삼각비의 값] 직각삼각형 변의 길이와 삼각비
export function rpmG9S2TrigConcept(random) {
  const mode = pick(random, ['pythagorean-find-trig', 'given-one-find-other', 'given-ratio-find-side']);
  
  if (mode === 'pythagorean-find-trig') {
    // Pythagorean triples: (3, 4, 5), (5, 12, 13), (8, 15, 17), (7, 24, 25)
    const triple = pick(random, [
      { a: 3, b: 4, c: 5 },
      { a: 6, b: 8, c: 10 },
      { a: 5, b: 12, c: 13 },
      { a: 8, b: 15, c: 17 }
    ]);
    const { a, b, c } = triple;
    const ansNum = a + b;
    const ansDen = c;
    const ansFrac = fraction(ansNum, ansDen);
    const ansLatex = fractionLatex(ansNum, ansDen);
    return {
      prompt: `오른쪽과 같이 \\(\\angle C = 90^\\circ\\)인 직각삼각형 \\(ABC\\)에서 \\(\\overline{BC} = ${a}\\), \\(\\overline{AC} = ${b}\\)일 때, \\(\\sin A + \\cos A\\)의 값을 구하시오.`,
      promptEn: `In a right triangle \\(ABC\\) with \\(\\angle C = 90^\\circ\\), \\(BC = ${a}\\), and \\(AC = ${b}\\), find the value of \\(\\sin A + \\cos A\\).`,
      expression: `\\sin A = \\frac{${a}}{${c}}, \\quad \\cos A = \\frac{${b}}{${c}}`,
      answer: ansFrac,
      explanation: `피타고라스 정리에 의해 빗변 \\(\\overline{AB} = \\sqrt{${a}^2 + ${b}^2} = ${c}\\)입니다.\n기준각 \\(A\\)에 대하여:\n\\(\\sin A = \\frac{\\text{대변}}{\\text{빗변}} = ${fractionLatex(a, c)}\\), \\(\\cos A = \\frac{\\text{이웃변}}{\\text{빗변}} = ${fractionLatex(b, c)}\\)\n따라서 \\(\\sin A + \\cos A = ${fractionLatex(a, c)} + ${fractionLatex(b, c)} = ${ansLatex}\\)입니다.`,
      explanationEn: `By the Pythagorean theorem, \\(AB = \\sqrt{${a}^2 + ${b}^2} = ${c}\\).\nThen \\(\\sin A = ${fractionLatex(a, c)}\\) and \\(\\cos A = ${fractionLatex(b, c)}\\).\nThus \\(\\sin A + \\cos A = ${ansLatex}\\).`
    };
  }

  if (mode === 'given-one-find-other') {
    const pair = pick(random, [
      { sinA: [3, 5], cosA: [4, 5], tanA: [3, 4] },
      { sinA: [5, 13], cosA: [12, 13], tanA: [5, 12] },
      { sinA: [8, 17], cosA: [15, 17], tanA: [8, 15] }
    ]);
    const num = pair.sinA[0];
    const den = pair.sinA[1];
    const ans = fraction(pair.tanA[0], pair.tanA[1]);
    const ansLatex = fractionLatex(pair.tanA[0], pair.tanA[1]);
    return {
      prompt: `예각 \\(A\\)에 대하여 \\(\\sin A = ${fractionLatex(num, den)}\\)일 때, \\(\\tan A\\)의 값을 구하시오.`,
      promptEn: `For an acute angle \\(A\\), if \\(\\sin A = ${fractionLatex(num, den)}\\), find \\(\\tan A\\).`,
      expression: `\\sin A = ${fractionLatex(num, den)} \\implies \\text{대변} = ${num}, \\; \\text{빗변} = ${den}`,
      answer: ans,
      explanation: `\\(\\sin A = ${fractionLatex(num, den)}\\)이므로 빗변의 길이가 \\(${den}\\), 높이(대변)가 \\(${num}\\)인 직각삼각형을 그릴 수 있습니다.\n밑변의 길이는 피타고라스 정리에 의해 \\(\\sqrt{${den}^2 - ${num}^2} = \\sqrt{${den**2 - num**2}} = ${pair.tanA[1]}\\)입니다.\n따라서 \\(\\tan A = \\frac{\\text{높이}}{\\text{밑변}} = ${ansLatex}\\)입니다.`,
      explanationEn: `Since \\(\\sin A = ${fractionLatex(num, den)}\\), adjacent side = \\(\\sqrt{${den}^2 - ${num}^2} = ${pair.tanA[1]}\\).\nTherefore, \\(\\tan A = ${ansLatex}\\).`
    };
  }

  // given-ratio-find-side
  const mult = pick(random, [2, 3, 4, 5]);
  const c = 5 * mult;
  const a = 3 * mult;
  return {
    prompt: `\\(\\angle C = 90^\\circ\\)인 직각삼각형 \\(ABC\\)에서 \\(\\overline{AB} = ${c}\\)이고 \\(\\sin A = \\frac{3}{5}\\)일 때, 변 \\(\\overline{BC}\\)의 길이를 구하시오.`,
    promptEn: `In a right triangle \\(ABC\\) with \\(\\angle C = 90^\\circ\\), if \\(AB = ${c}\\) and \\(\\sin A = \\frac{3}{5}\\), find the length of \\(BC\\).`,
    expression: `\\overline{BC} = \\overline{AB} \\times \\sin A = ${c} \\times \\frac{3}{5} = ${a}`,
    answer: String(a),
    explanation: `\\(\\sin A = \\frac{\\overline{BC}}{\\overline{AB}}\\)이므로,\n\\(\\overline{BC} = \\overline{AB} \\times \\sin A = ${c} \\times \\frac{3}{5} = ${a}\\)입니다.`,
    explanationEn: `\\(BC = AB \\times \\sin A = ${c} \\times \\frac{3}{5} = ${a}\\).`
  };
}

// 2. [닮음을 이용한 삼각비] 직각삼각형의 꼭짓점에서 빗변에 내린 수선
export function rpmG9S2TrigSimilarity(random) {
  const triple = pick(random, [
    { a: 6, b: 8, c: 10 },
    { a: 9, b: 12, c: 15 },
    { a: 5, b: 12, c: 13 }
  ]);
  const { a, b, c } = triple; // a = BC, b = AC, c = AB

  return {
    prompt: `오른쪽과 같이 \\(\\angle A = 90^\\circ\\)인 직각삼각형 \\(ABC\\)의 꼭짓점 \\(A\\)에서 빗변 \\(\\overline{BC}\\)에 내린 수선의 발을 \\(D\\)라 하자.\n\\(\\overline{AB} = ${b}\\), \\(\\overline{AC} = ${a}\\)이고 \\(\\angle BAD = x\\), \\(\\angle CAD = y\\)일 때, \\(\\sin x + \\cos y\\)의 값을 구하시오.`,
    promptEn: `In a right triangle \\(ABC\\) with \\(\\angle A = 90^\\circ\\), let \\(D\\) be the foot of the perpendicular from \\(A\\) to \\(BC\\).\nIf \\(AB = ${b}\\), \\(AC = ${a}\\), \\(\\angle BAD = x\\), and \\(\\angle CAD = y\\), find the value of \\(\\sin x + \\cos y\\).`,
    expression: `x = \\angle C, \\quad y = \\angle B \\implies \\sin x = \\sin C = \\frac{${b}}{${c}}, \\quad \\cos y = \\cos B = \\frac{${b}}{${c}}`,
    answer: fraction(2 * b, c),
    explanation: `\\(\\triangle DBA \\sim \\triangle DAC \\sim \\triangle ABC\\) (AA 닮음)이므로:\n\\(\\angle BAD = x = \\angle C\\), \\(\\angle CAD = y = \\angle B\\)입니다.\n큰 직각삼각형 \\(ABC\\)에서 빗변 \\(\\overline{BC} = \\sqrt{${b}^2 + ${a}^2} = ${c}\\)이므로,\n\\(\\sin x = \\sin C = \\frac{\\overline{AB}}{\\overline{BC}} = ${fractionLatex(b, c)}\\)\n\\(\\cos y = \\cos B = \\frac{\\overline{AB}}{\\overline{BC}} = ${fractionLatex(b, c)}\\)\n따라서 \\(\\sin x + \\cos y = ${fractionLatex(b, c)} + ${fractionLatex(b, c)} = ${fractionLatex(2 * b, c)}\\)입니다.`,
    explanationEn: `Since \\(\\triangle DBA \\sim \\triangle ABC\\), \\(x = \\angle C\\) and \\(y = \\angle B\\).\nIn \\(\\triangle ABC\\), \\(BC = ${c}\\).\nThus \\(\\sin x + \\cos y = \\frac{${b}}{${c}} + \\frac{${b}}{${c}} = ${fractionLatex(2 * b, c)}\\).`
  };
}

// 3. [직선의 기울기와 삼각비] y = ax + b와 x축의 양의 방향이 이루는 각
export function rpmG9S2TrigLinearEqn(random) {
  const mode = pick(random, ['special-slope-angle', 'int-slope-trig', 'find-line-equation']);

  if (mode === 'special-slope-angle') {
    const angleChoice = pick(random, [
      { deg: 30, slope: '1/\\sqrt{3}', slopeText: '\\frac{\\sqrt{3}}{3}', m: '1/sqrt(3)' },
      { deg: 45, slope: '1', slopeText: '1', m: '1' },
      { deg: 60, slope: '\\sqrt{3}', slopeText: '\\sqrt{3}', m: 'sqrt(3)' }
    ]);
    const yInt = ri(random, 1, 6);
    return {
      prompt: `일차함수 \\(y = ${angleChoice.slopeText}x + ${yInt}\\)의 그래프가 \\(x\\)축의 양의 방향과 이루는 예각의 크기를 구하시오.`,
      promptEn: `Find the measure of the acute angle formed by the graph of \\(y = ${angleChoice.slopeText}x + ${yInt}\\) and the positive direction of the \\(x\\)-axis.`,
      expression: `\\tan \\alpha = ${angleChoice.slopeText} \\implies \\alpha = ${angleChoice.deg}^\\circ`,
      answer: `${angleChoice.deg}`,
      explanation: `일차함수의 그래프의 기울기는 \\(x\\)축의 양의 방향과 이루는 각 \\(\\alpha\\)의 탄젠트 값과 같습니다.\n기울기 \\(a = \\tan \\alpha = ${angleChoice.slopeText}\\)이므로, \\(\\alpha = ${angleChoice.deg}^\\circ\\)입니다.`,
      explanationEn: `The slope of the line equals \\(\\tan \\alpha\\). Since \\(\\tan \\alpha = ${angleChoice.slopeText}\\), \\(\\alpha = ${angleChoice.deg}^\\circ\\).`
    };
  }

  if (mode === 'int-slope-trig') {
    const m = pick(random, [2, 3]);
    return {
      prompt: `일차방정식 \\(${m}x - y + 4 = 0\\)의 그래프가 \\(x\\)축의 양의 방향과 이루는 각의 크기를 \\(\\alpha\\)라 할 때, \\(\\tan \\alpha\\)의 값을 구하시오.`,
      promptEn: `Let \\(\\alpha\\) be the angle formed by the line \\(${m}x - y + 4 = 0\\) and the positive \\(x\\)-axis. Find \\(\\tan \\alpha\\).`,
      expression: `y = ${m}x + 4 \\implies \\text{기울기} = ${m} \\implies \\tan \\alpha = ${m}`,
      answer: String(m),
      explanation: `주어진 일차방정식을 \\(y\\)에 관하여 정리하면 \\(y = ${m}x + 4\\)입니다.\n직선의 기울기는 \\(${m}\\)이고, 이는 \\(\\tan \\alpha\\)와 같으므로 \\(\\tan \\alpha = ${m}\\)입니다.`,
      explanationEn: `Rearranging gives \\(y = ${m}x + 4\\). The slope is \\(${m}\\), so \\(\\tan \\alpha = ${m}\\).`
    };
  }

  // find-line-equation: passes through (x0, y0) with 45 deg
  const x0 = ri(random, 1, 4);
  const y0 = ri(random, 2, 6);
  const b = y0 - x0;
  const bStr = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
  return {
    prompt: `점 \\((${x0}, ${y0})\\)을 지나고 \\(x\\)축의 양의 방향과 이루는 각의 크기가 \\(45^\\circ\\)인 직선의 \\(y\\)절편을 구하시오.`,
    promptEn: `Find the \\(y\\)-intercept of the line passing through \\((${x0}, ${y0})\\) and making a \\(45^\\circ\\) angle with the positive \\(x\\)-axis.`,
    expression: `\\text{기울기} = \\tan 45^\\circ = 1, \\quad y = 1 \\cdot (x - ${x0}) + ${y0} = x ${bStr}`,
    answer: String(b),
    explanation: `기울기는 \\(\\tan 45^\\circ = 1\\)입니다.\n점 \\((${x0}, ${y0})\\)을 지나는 직선의 방정식은:\n\\[ y - ${y0} = 1(x - ${x0}) \\implies y = x ${bStr} \\]\n따라서 \\(y\\)절편은 \\(${b}\\)입니다.`,
    explanationEn: `The slope is \\(\\tan 45^\\circ = 1\\). The line is \\(y = x ${bStr}\\), so the \\(y\\)-intercept is \\(${b}\\).`
  };
}

// 4. [특수각의 삼각비와 각의 크기] 30°, 45°, 60° 복합 계산 및 방정식
export function rpmG9S2TrigSpecialAngles(random) {
  const mode = pick(random, ['arithmetic-eval', 'angle-equation']);

  if (mode === 'arithmetic-eval') {
    const type = pick(random, ['sin30-cos60', 'tan45-sin90', 'product-difference']);
    if (type === 'sin30-cos60') {
      return {
        prompt: `다음 식의 값을 계산하시오.\n\\[ \\sin 30^\\circ + \\cos 60^\\circ \\times \\tan 45^\\circ \\]`,
        promptEn: `Evaluate: \\(\\sin 30^\\circ + \\cos 60^\\circ \\times \\tan 45^\\circ\\).`,
        expression: `\\frac{1}{2} + \\frac{1}{2} \\times 1 = 1`,
        answer: '1',
        explanation: `\\(\\sin 30^\\circ = \\frac{1}{2}\\), \\(\\cos 60^\\circ = \\frac{1}{2}\\), \\(\\tan 45^\\circ = 1\\)을 대입하면:\n\\[ \\frac{1}{2} + \\frac{1}{2} \\times 1 = \\frac{1}{2} + \\frac{1}{2} = 1 \\]입니다.`,
        explanationEn: `Substituting the values: \\(\\frac{1}{2} + \\frac{1}{2} \\times 1 = 1\\).`
      };
    }
    if (type === 'tan45-sin90') {
      return {
        prompt: `다음 식의 값을 계산하시오.\n\\[ 2\\tan 45^\\circ - \\sqrt{3}\\tan 60^\\circ + 4\\sin 30^\\circ \\]`,
        promptEn: `Evaluate: \\(2\\tan 45^\\circ - \\sqrt{3}\\tan 60^\\circ + 4\\sin 30^\\circ\\).`,
        expression: `2(1) - \\sqrt{3}(\\sqrt{3}) + 4\\left(\\frac{1}{2}\\right) = 2 - 3 + 2 = 1`,
        answer: '1',
        explanation: `특수각의 삼각비 값을 대입하면:\n\\(2(1) - \\sqrt{3}(\\sqrt{3}) + 4\\left(\\frac{1}{2}\\right) = 2 - 3 + 2 = 1\\)입니다.`,
        explanationEn: `Substituting the values: \\(2(1) - 3 + 2 = 1\\).`
      };
    }
    return {
      prompt: `다음 식의 값을 계산하시오.\n\\[ (1 - \\sin 45^\\circ)(1 + \\cos 45^\\circ) \\]`,
      promptEn: `Evaluate: \\((1 - \\sin 45^\\circ)(1 + \\cos 45^\\circ)\\).`,
      expression: `\\left(1 - \\frac{\\sqrt{2}}{2}\\right)\\left(1 + \\frac{\\sqrt{2}}{2}\\right) = 1 - \\frac{2}{4} = \\frac{1}{2}`,
      answer: '1/2',
      explanation: `\\(\\sin 45^\\circ = \\cos 45^\\circ = \\frac{\\sqrt{2}}{2}\\)이므로 합차 공식에 의해:\n\\[ \\left(1 - \\frac{\\sqrt{2}}{2}\\right)\\left(1 + \\frac{\\sqrt{2}}{2}\\right) = 1^2 - \\left(\\frac{\\sqrt{2}}{2}\\right)^2 = 1 - \\frac{1}{2} = \\frac{1}{2} \\]입니다.`,
      explanationEn: `Using the difference of squares: \\(1 - (\\sqrt{2}/2)^2 = 1 - 1/2 = 1/2\\).`
    };
  }

  // angle-equation
  const eqType = pick(random, [
    { name: '\\cos', insideVal: '60', rhs: '\\frac{1}{2}', a: 2, b: 10, x: 25 },
    { name: '\\sin', insideVal: '30', rhs: '\\frac{1}{2}', a: 2, b: -10, x: 20 },
    { name: '\\tan', insideVal: '45', rhs: '1', a: 3, b: -15, x: 20 }
  ]);
  const bSign = eqType.b >= 0 ? `+ ${eqType.b}^\\circ` : `- ${Math.abs(eqType.b)}^\\circ`;
  return {
    prompt: `\\(0^\\circ < x < 45^\\circ\\)일 때, 다음 등식을 만족시키는 \\(x\\)의 크기를 구하시오.\n\\[ ${eqType.name}(${eqType.a}x ${bSign}) = ${eqType.rhs} \\]`,
    promptEn: `For \\(0^\\circ < x < 45^\\circ\\), find \\(x\\) satisfying \\(${eqType.name}(${eqType.a}x ${bSign}) = ${eqType.rhs}\\).`,
    expression: `${eqType.a}x ${bSign} = ${eqType.insideVal}^\\circ \\implies x = ${eqType.x}^\\circ`,
    answer: String(eqType.x),
    explanation: `\\(${eqType.name} ${eqType.insideVal}^\\circ = ${eqType.rhs}\\)이므로,\n\\[ ${eqType.a}x ${bSign} = ${eqType.insideVal}^\\circ \\]\n\\[ ${eqType.a}x = ${eqType.insideVal - eqType.b}^\\circ \\implies x = ${eqType.x}^\\circ \\]입니다.`,
    explanationEn: `Since \\(${eqType.name} ${eqType.insideVal}^\\circ = ${eqType.rhs}\\), \\(${eqType.a}x ${bSign} = ${eqType.insideVal}^\\circ\\), giving \\(x = ${eqType.x}^\\circ\\).`
  };
}

// 5. [사분원과 삼각비 표] 0°, 90° 삼각비 및 사분원/표 해석
export function rpmG9S2TrigQuadrantTable(random) {
  const mode = pick(random, ['zero-ninety-eval', 'quadrant-segment-choice', 'trig-table-calc']);

  if (mode === 'zero-ninety-eval') {
    return {
      prompt: `다음 식의 값을 계산하시오.\n\\[ \\sin 90^\\circ + \\cos 0^\\circ - \\tan 0^\\circ + \\cos 90^\\circ \\]`,
      promptEn: `Evaluate: \\(\\sin 90^\\circ + \\cos 0^\\circ - \\tan 0^\\circ + \\cos 90^\\circ\\).`,
      expression: `1 + 1 - 0 + 0 = 2`,
      answer: '2',
      explanation: `\\(0^\\circ\\)와 \\(90^\\circ\\)의 삼각비의 값:\n\\(\\sin 90^\\circ = 1\\), \\(\\cos 0^\\circ = 1\\), \\(\\tan 0^\\circ = 0\\), \\(\\cos 90^\\circ = 0\\)\n따라서 \\(1 + 1 - 0 + 0 = 2\\)입니다.`,
      explanationEn: `Using the boundary values: \\(1 + 1 - 0 + 0 = 2\\).`
    };
  }

  if (mode === 'quadrant-segment-choice') {
    return {
      prompt: `반지름의 길이가 1인 사분원에서 중심각의 크기가 \\(x\\)일 때, 다음 중 옳지 않은 것을 고르시오.`,
      promptEn: `In a unit quadrant with central angle \\(x\\), which statement is NOT correct?`,
      expression: `\\sin x = \\overline{AB}, \\quad \\cos x = \\overline{OB}, \\quad \\tan x = \\overline{CD}`,
      choices: [
        { value: '1', label: '\\sin x = \\overline{AB}' },
        { value: '2', label: '\\cos x = \\overline{OB}' },
        { value: '3', label: '\\tan x = \\overline{CD}' },
        { value: '4', label: '\\cos 0^\\circ = 0' },
        { value: '5', label: '\\sin 0^\\circ = 0' }
      ],
      answer: '4',
      explanation: `반지름이 1인 사분원에서:\n① \\(\\sin x = \\frac{\\overline{AB}}{\\overline{OA}} = \\overline{AB}\\) (참)\n② \\(\\cos x = \\frac{\\overline{OB}}{\\overline{OA}} = \\overline{OB}\\) (참)\n③ \\(\\tan x = \\frac{\\overline{CD}}{\\overline{OD}} = \\overline{CD}\\) (참)\n④ \\(\\cos 0^\\circ = 1\\)이므로 ④번은 옳지 않습니다.\n⑤ \\(\\sin 0^\\circ = 0\\) (참)`,
      explanationEn: `\\(\\cos 0^\\circ = 1\\), so statement ④ is false.`
    };
  }

  // trig-table-calc
  const angle = pick(random, [35, 40, 55, 65]);
  const tableData = {
    35: { sin: 0.5736, cos: 0.8192, tan: 0.7002 },
    40: { sin: 0.6428, cos: 0.7660, tan: 0.8391 },
    55: { sin: 0.8192, cos: 0.5736, tan: 1.4281 },
    65: { sin: 0.9063, cos: 0.4226, tan: 2.1445 }
  };
  const d = tableData[angle];
  const hyp = 100;
  const heightAns = Math.round(hyp * d.sin * 10) / 10;
  return {
    prompt: `삼각비 표에서 \\(\\sin ${angle}^\\circ = ${d.sin}\\), \\(\\cos ${angle}^\\circ = ${d.cos}\\)일 때, 빗변의 길이가 \\(${hyp}\\)이고 한 예각이 \\(${angle}^\\circ\\)인 직각삼각형의 높이(대변)의 길이를 구하시오.`,
    promptEn: `Given from the trig table that \\(\\sin ${angle}^\\circ = ${d.sin}\\), find the height of a right triangle with hypotenuse \\(${hyp}\\) and angle \\(${angle}^\\circ\\).`,
    expression: `\\text{높이} = ${hyp} \\times \\sin ${angle}^\\circ = ${hyp} \\times ${d.sin} = ${heightAns}`,
    answer: String(heightAns),
    explanation: `직각삼각형의 높이는 \\(\\text{빗변} \\times \\sin ${angle}^\\circ\\)입니다.\n따라서 \\(${hyp} \\times ${d.sin} = ${heightAns}\\)입니다.`,
    explanationEn: `Height = \\(${hyp} \\times \\sin ${angle}^\\circ = ${heightAns}\\).`
  };
}

// 6. [삼각비 대소 관계와 제곱근 식] sqrt((sin x - cos x)^2) 부호 판별
export function rpmG9S2TrigCompareRoots(random) {
  const range = pick(random, ['0-to-45', '45-to-90']);

  if (range === '0-to-45') {
    return {
      prompt: `\\(0^\\circ < x < 45^\\circ\\)일 때, 다음 식을 간단히 하시오.\n\\[ \\sqrt{(\\sin x - \\cos x)^2} + \\sqrt{(\\sin x + \\cos x)^2} \\]`,
      promptEn: `For \\(0^\\circ < x < 45^\\circ\\), simplify: \\(\\sqrt{(\\sin x - \\cos x)^2} + \\sqrt{(\\sin x + \\cos x)^2}\\).`,
      expression: `0^\\circ < x < 45^\\circ \\implies \\cos x > \\sin x > 0`,
      choices: [
        { value: '1', label: '2\\sin x' },
        { value: '2', label: '2\\cos x' },
        { value: '3', label: '0' },
        { value: '4', label: '-2\\sin x' },
        { value: '5', label: '1' }
      ],
      answer: '2',
      explanation: `\\(0^\\circ < x < 45^\\circ\\)일 때 \\(\\cos x > \\sin x > 0\\)이므로:\n\\(\\sin x - \\cos x < 0 \\implies \\sqrt{(\\sin x - \\cos x)^2} = -(\\sin x - \\cos x) = \\cos x - \\sin x\\)\n\\(\\sin x + \\cos x > 0 \\implies \\sqrt{(\\sin x + \\cos x)^2} = \\sin x + \\cos x\\)\n따라서 두 식을 더하면:\n\\((\\cos x - \\sin x) + (\\sin x + \\cos x) = 2\\cos x\\)입니다.`,
      explanationEn: `Since \\(\\cos x > \\sin x\\) for \\(0^\\circ < x < 45^\\circ\\), the expression simplifies to \\(2\\cos x\\).`
    };
  }

  return {
    prompt: `\\(45^\\circ < x < 90^\\circ\\)일 때, 다음 식을 간단히 하시오.\n\\[ \\sqrt{(\\sin x - \\cos x)^2} - \\sqrt{(\\cos x - \\sin x)^2} \\]`,
    promptEn: `For \\(45^\\circ < x < 90^\\circ\\), simplify: \\(\\sqrt{(\\sin x - \\cos x)^2} - \\sqrt{(\\cos x - \\sin x)^2}\\).`,
    expression: `\\sqrt{(\\sin x - \\cos x)^2} - \\sqrt{(\\cos x - \\sin x)^2} = (\\sin x - \\cos x) - (\\sin x - \\cos x) = 0`,
    answer: '0',
    explanation: `\\(45^\\circ < x < 90^\\circ\\)일 때 \\(\\sin x > \\cos x > 0\\)이므로:\n\\(\\sin x - \\cos x > 0\\)이고 \\(\\cos x - \\sin x < 0\\)입니다.\n따라서:\n\\(\\sqrt{(\\sin x - \\cos x)^2} = \\sin x - \\cos x\\)\n\\(\\sqrt{(\\cos x - \\sin x)^2} = -(\\cos x - \\sin x) = \\sin x - \\cos x\\)\n두 식의 차는 \\((\\sin x - \\cos x) - (\\sin x - \\cos x) = 0\\)입니다.`,
    explanationEn: `Both square roots equal \\(\\sin x - \\cos x\\), so their difference is 0.`
  };
}

// 7. [삼각비 전 유형 종합]
export function rpmG9S2TrigRatiosAllMixed(random) {
  const pickFn = pick(random, [
    rpmG9S2TrigConcept,
    rpmG9S2TrigSimilarity,
    rpmG9S2TrigLinearEqn,
    rpmG9S2TrigSpecialAngles,
    rpmG9S2TrigQuadrantTable,
    rpmG9S2TrigCompareRoots
  ]);
  return pickFn(random);
}


// =============================================================================
// Chapter 02: 삼각비의 활용 (Applications of Trigonometry)
// =============================================================================

// 8. [삼각비 활용: 변의 길이] 일반 삼각형에서 수선의 발을 내려 변의 길이 구하기
export function rpmG9S2TrigAppsLength(random) {
  const mode = pick(random, ['two-sides-one-angle', 'one-side-two-angles']);

  if (mode === 'two-sides-one-angle') {
    return {
      prompt: `삼각형 \\(ABC\\)에서 \\(\\overline{AB} = 6\\sqrt{2}\\), \\(\\overline{BC} = 14\\), \\(\\angle B = 45^\\circ\\)일 때, 변 \\(\\overline{AC}\\)의 길이를 구하시오.`,
      promptEn: `In triangle \\(ABC\\), \\(AB = 6\\sqrt{2}\\), \\(BC = 14\\), and \\(\\angle B = 45^\\circ\\). Find the length of \\(AC\\).`,
      expression: `\\overline{AH} = 6\\sqrt{2}\\sin 45^\\circ = 6, \\quad \\overline{BH} = 6, \\quad \\overline{HC} = 14 - 6 = 8 \\implies \\overline{AC} = 10`,
      answer: '10',
      explanation: `꼭짓점 \\(A\\)에서 변 \\(\\overline{BC}\\)에 내린 수선의 발을 \\(H\\)라 하면:\n\\(\\overline{AH} = 6\\sqrt{2} \\times \\sin 45^\\circ = 6\\sqrt{2} \\times \\frac{\\sqrt{2}}{2} = 6\\)\n\\(\\overline{BH} = 6\\sqrt{2} \\times \\cos 45^\\circ = 6\\)\n\\(\\overline{HC} = \\overline{BC} - \\overline{BH} = 14 - 6 = 8\\)\n직각삼각형 \\(AHC\\)에서 피타고라스 정리에 의해:\n\\[ \\overline{AC} = \\sqrt{6^2 + 8^2} = \\sqrt{36 + 64} = 10 \\]입니다.`,
      explanationEn: `Dropping perpendicular \\(AH\\) to \\(BC\\) gives \\(AH = 6\\), \\(BH = 6\\), \\(HC = 8\\).\nThus \\(AC = \\sqrt{6^2 + 8^2} = 10\\).`
    };
  }

  // one-side-two-angles
  return {
    prompt: `삼각형 \\(ABC\\)에서 \\(\\overline{BC} = 12\\), \\(\\angle B = 60^\\circ\\), \\(\\angle C = 75^\\circ\\)일 때, 변 \\(\\overline{AC}\\)의 길이를 구하시오.`,
    promptEn: `In triangle \\(ABC\\), \\(BC = 12\\), \\(\\angle B = 60^\\circ\\), and \\(\\angle C = 75^\\circ\\). Find \\(AC\\).`,
    expression: `\\angle A = 180^\\circ - (60^\\circ + 75^\\circ) = 45^\\circ \\implies \\overline{AC} = 6\\sqrt{6}`,
    choices: [
      { value: '1', label: '6\\sqrt{3}' },
      { value: '2', label: '6\\sqrt{6}' },
      { value: '3', label: '12\\sqrt{2}' },
      { value: '4', label: '8\\sqrt{3}' },
      { value: '5', label: '12\\sqrt{3}' }
    ],
    answer: '2',
    explanation: `\\(\\angle A = 180^\\circ - (60^\\circ + 75^\\circ) = 45^\\circ\\)입니다.\n꼭짓점 \\(C\\)에서 변 \\(\\overline{AB}\\)에 내린 수선의 발을 \\(H\\)라 하면:\n\\(\\triangle BCH\\)에서 \\(\\overline{CH} = \\overline{BC} \\sin 60^\\circ = 12 \\times \\frac{\\sqrt{3}}{2} = 6\\sqrt{3}\\)\n\\(\\triangle ACH\\)에서 \\(\\angle A = 45^\\circ\\)이므로:\n\\[ \\overline{AC} = \\frac{\\overline{CH}}{\\sin 45^\\circ} = \\frac{6\\sqrt{3}}{\\frac{\\sqrt{2}}{2}} = \\frac{12\\sqrt{3}}{\\sqrt{2}} = 6\\sqrt{6} \\]입니다.`,
    explanationEn: `\\(\\angle A = 45^\\circ\\). Perpendicular \\(CH = 6\\sqrt{3}\\), so \\(AC = \\frac{6\\sqrt{3}}{\\sin 45^\\circ} = 6\\sqrt{6}\\).`
  };
}

// 9. [삼각비 활용: 높이와 실생활] 예각/둔각삼각형의 높이 공식
export function rpmG9S2TrigAppsHeight(random) {
  const mode = pick(random, ['acute-height', 'obtuse-height-tower']);

  if (mode === 'acute-height') {
    return {
      prompt: `어느 지면의 두 지점 \\(B, C\\) 사이의 거리가 \\(20\\)이고, \\(\\angle B = 45^\\circ\\), \\(\\angle C = 45^\\circ\\)인 삼각형 \\(ABC\\)의 높이 \\(h\\)를 구하시오.`,
      promptEn: `In triangle \\(ABC\\), \\(BC = 20\\), \\(\\angle B = 45^\\circ\\), and \\(\\angle C = 45^\\circ\\). Find the height \\(h\\) from \\(A\\) to \\(BC\\).`,
      expression: `h = \\frac{20}{2} = 10`,
      answer: '10',
      explanation: `\\(\\angle B = 45^\\circ\\), \\(\\angle C = 45^\\circ\\)이므로 \\(\\triangle ABC\\)는 \\(\\angle A = 90^\\circ\\)인 직각이등변삼각형입니다.\n꼭짓점 \\(A\\)에서 내린 수선은 밑변을 이등분하므로 높이 \\(h = \\frac{20}{2} = 10\\)입니다.`,
      explanationEn: `Since \\(\\triangle ABC\\) is an isosceles right triangle with hypotenuse 20, the height is \\(10\\).`
    };
  }

  // obtuse height: tower viewed from distance
  return {
    prompt: `송신탑의 높이를 측정하기 위해 지면 위의 지점 \\(A\\)에서 탑의 꼭대기를 올려본 각의 크기를 재었더니 \\(30^\\circ\\)였고, 탑을 향해 \\(300\\text{ m}\\) 걸어간 지점 \\(B\\)에서 올려본 각의 크기는 \\(60^\\circ\\)였다. 이 송신탑의 높이를 구하시오.`,
    promptEn: `From point \\(A\\), the angle of elevation to the top of a tower is \\(30^\\circ\\). Moving \\(300\\text{ m}\\) closer to \\(B\\), the angle of elevation is \\(60^\\circ\\). Find the height of the tower.`,
    expression: `h = \\frac{300}{\\frac{1}{\\tan 30^\\circ} - \\frac{1}{\\tan 60^\\circ}} = \\frac{300}{\\sqrt{3} - \\frac{\\sqrt{3}}{3}} = 150\\sqrt{3}`,
    choices: [
      { value: '1', label: '100\\sqrt{3}\\text{ m}' },
      { value: '2', label: '150\\sqrt{3}\\text{ m}' },
      { value: '3', label: '200\\sqrt{3}\\text{ m}' },
      { value: '4', label: '300\\text{ m}' },
      { value: '5', label: '300\\sqrt{3}\\text{ m}' }
    ],
    answer: '2',
    explanation: `탑의 높이를 \\(h\\)라 하면:\n지점 \\(A\\)에서 탑의 밑동까지의 거리는 \\(\\frac{h}{\\tan 30^\\circ} = h\\sqrt{3}\\)\n지점 \\(B\\)에서 탑의 밑동까지의 거리는 \\(\\frac{h}{\\tan 60^\\circ} = \\frac{h}{\\sqrt{3}}\\)입니다.\n두 지점 사이의 거리가 \\(300\\text{ m}\\)이므로:\n\\[ h\\sqrt{3} - \\frac{h}{\\sqrt{3}} = 300 \\implies \\frac{2h}{\\sqrt{3}} = 300 \\implies h = 150\\sqrt{3}\\text{ m} \\]입니다.`,
    explanationEn: `\\(h\\sqrt{3} - \\frac{h}{\\sqrt{3}} = 300 \\implies h = 150\\sqrt{3}\\text{ m}\\).`
  };
}

// 10. [삼각비 활용: 삼각형의 넓이] S = 1/2 ab sin C (예각, 둔각)
export function rpmG9S2TrigAppsTriArea(random) {
  const isObtuse = pick(random, [false, true]);

  if (!isObtuse) {
    const a = pick(random, [4, 6, 8, 10]);
    const b = pick(random, [6, 8, 12]);
    const angle = pick(random, [30, 45, 60]);
    let sinValStr = '';
    let areaLatex = '';
    if (angle === 30) {
      sinValStr = '\\frac{1}{2}';
      areaLatex = String((a * b) / 4);
    } else if (angle === 45) {
      sinValStr = '\\frac{\\sqrt{2}}{2}';
      const coeff = (a * b) / 4;
      areaLatex = `${coeff}\\sqrt{2}`;
    } else {
      sinValStr = '\\frac{\\sqrt{3}}{2}';
      const coeff = (a * b) / 4;
      areaLatex = `${coeff}\\sqrt{3}`;
    }

    return {
      prompt: `삼각형 \\(ABC\\)에서 \\(\\overline{AB} = ${a}\\), \\(\\overline{BC} = ${b}\\), \\(\\angle B = ${angle}^\\circ\\)일 때, \\(\\triangle ABC\\)의 넓이를 구하시오.`,
      promptEn: `In triangle \\(ABC\\), \\(AB = ${a}\\), \\(BC = ${b}\\), and \\(\\angle B = ${angle}^\\circ\\). Find the area of \\(\\triangle ABC\\).`,
      expression: `S = \\frac{1}{2} \\times ${a} \\times ${b} \\times \\sin ${angle}^\\circ = ${areaLatex}`,
      answer: String(areaLatex),
      explanation: `삼각형의 두 변과 그 끼인각이 주어졌을 때의 넓이 공식:\n\\[ S = \\frac{1}{2}ac \\sin B = \\frac{1}{2} \\times ${a} \\times ${b} \\times ${sinValStr} = ${areaLatex} \\]입니다.`,
      explanationEn: `Using the formula \\(S = \\frac{1}{2}ac \\sin B = ${areaLatex}\\).`
    };
  }

  // Obtuse angle
  const a = pick(random, [4, 6, 8]);
  const b = pick(random, [6, 10, 12]);
  const angle = pick(random, [120, 135, 150]);
  const supplement = 180 - angle;
  let sinValStr = '';
  let areaLatex = '';
  if (supplement === 30) {
    sinValStr = '\\frac{1}{2}';
    areaLatex = String((a * b) / 4);
  } else if (supplement === 45) {
    sinValStr = '\\frac{\\sqrt{2}}{2}';
    areaLatex = `${(a * b) / 4}\\sqrt{2}`;
  } else {
    sinValStr = '\\frac{\\sqrt{3}}{2}';
    areaLatex = `${(a * b) / 4}\\sqrt{3}`;
  }

  return {
    prompt: `삼각형 \\(ABC\\)에서 \\(\\overline{AB} = ${a}\\), \\(\\overline{BC} = ${b}\\), \\(\\angle B = ${angle}^\\circ\\)일 때, \\(\\triangle ABC\\)의 넓이를 구하시오.`,
    promptEn: `In triangle \\(ABC\\), \\(AB = ${a}\\), \\(BC = ${b}\\), and \\(\\angle B = ${angle}^\\circ\\). Find the area of \\(\\triangle ABC\\).`,
    expression: `S = \\frac{1}{2} \\times ${a} \\times ${b} \\times \\sin(180^\\circ - ${angle}^\\circ) = ${areaLatex}`,
    answer: String(areaLatex),
    explanation: `둔각삼각형의 넓이 공식:\n\\[ S = \\frac{1}{2}ac \\sin(180^\\circ - B) = \\frac{1}{2} \\times ${a} \\times ${b} \\times \\sin ${supplement}^\\circ = \\frac{1}{2} \\times ${a} \\times ${b} \\times ${sinValStr} = ${areaLatex} \\]입니다.`,
    explanationEn: `Using \\(S = \\frac{1}{2}ac \\sin(180^\\circ - B) = ${areaLatex}\\).`
  };
}

// 11. [삼각비 활용: 사각형 및 다각형의 넓이] 평행사변형, 사각형 대각선, 정다각형
export function rpmG9S2TrigAppsQuadArea(random) {
  const mode = pick(random, ['parallelogram', 'quad-diagonals', 'regular-polygon']);

  if (mode === 'parallelogram') {
    const a = pick(random, [5, 6, 8]);
    const b = pick(random, [8, 10, 12]);
    const angle = pick(random, [60, 120]);
    const ansCoeff = (a * b) / 2;
    const ansLatex = `${ansCoeff}\\sqrt{3}`;
    return {
      prompt: `평행사변형 \\(ABCD\\)에서 \\(\\overline{AB} = ${a}\\), \\(\\overline{BC} = ${b}\\), \\(\\angle B = ${angle}^\\circ\\)일 때, 평행사변형의 넓이를 구하시오.`,
      promptEn: `In parallelogram \\(ABCD\\), \\(AB = ${a}\\), \\(BC = ${b}\\), and \\(\\angle B = ${angle}^\\circ\\). Find the area.`,
      expression: `S = ${a} \\times ${b} \\times \\sin ${angle === 60 ? '60' : '(180 - 120)'}^\\circ = ${ansLatex}`,
      answer: ansLatex,
      explanation: `평행사변형의 넓이 공식은 \\(S = ab \\sin B\\) (둔각일 때 \\(ab \\sin(180^\\circ - B)\\))입니다.\n\\[ S = ${a} \\times ${b} \\times \\frac{\\sqrt{3}}{2} = ${ansLatex} \\]입니다.`,
      explanationEn: `Parallelogram area is \\(ab \\sin B = ${ansLatex}\\).`
    };
  }

  if (mode === 'quad-diagonals') {
    const p = pick(random, [6, 8, 10]);
    const q = pick(random, [8, 12, 14]);
    const angle = pick(random, [45, 60]);
    let ansLatex = '';
    if (angle === 45) {
      ansLatex = `${(p * q) / 4}\\sqrt{2}`;
    } else {
      ansLatex = `${(p * q) / 4}\\sqrt{3}`;
    }
    return {
      prompt: `사각형 \\(ABCD\\)의 두 대각선의 길이가 각각 \\(${p}\\), \\(${q}\\)이고 두 대각선이 이루는 예각의 크기가 \\(${angle}^\\circ\\)일 때, 사각형 \\(ABCD\\)의 넓이를 구하시오.`,
      promptEn: `In quadrilateral \\(ABCD\\), the diagonals have lengths \\(${p}\\) and \\(${q}\\) and intersect at an acute angle of \\(${angle}^\\circ\\). Find the area.`,
      expression: `S = \\frac{1}{2} \\times ${p} \\times ${q} \\times \\sin ${angle}^\\circ = ${ansLatex}`,
      answer: ansLatex,
      explanation: `두 대각선의 길이 \\(p, q\\)와 교각 \\(\\theta\\)가 주어졌을 때 사각형의 넓이:\n\\[ S = \\frac{1}{2}pq \\sin \\theta = \\frac{1}{2} \\times ${p} \\times ${q} \\times \\sin ${angle}^\\circ = ${ansLatex} \\]입니다.`,
      explanationEn: `Area of quadrilateral with diagonals is \\(\\frac{1}{2}pq \\sin \\theta = ${ansLatex}\\).`
    };
  }

  // regular hexagon of side length r
  const r = pick(random, [4, 6, 8]);
  const areaNum = 3 * r * r;
  const areaCoeff = areaNum / 2;
  const ansLatex = `${areaCoeff}\\sqrt{3}`;
  return {
    prompt: `한 변의 길이가 \\(${r}\\)인 정육각형의 넓이를 구하시오.`,
    promptEn: `Find the area of a regular hexagon with side length \\(${r}\\).`,
    expression: `S = 6 \\times \\left( \\frac{1}{2} \\times ${r} \\times ${r} \\times \\sin 60^\\circ \\right) = ${ansLatex}`,
    answer: ansLatex,
    explanation: `정육각형은 한 변의 길이가 \\(${r}\\)인 6개의 합동인 정삼각형으로 나뉩니다.\n정삼각형 1개의 넓이: \\(\\frac{1}{2} \\times ${r} \\times ${r} \\times \\sin 60^\\circ = \\frac{${r**2}}{2} \\times \\frac{\\sqrt{3}}{2} = \\frac{${r**2}\\sqrt{3}}{4}\\)\n정육각형의 넓이: \\(6 \\times \\frac{${r**2}\\sqrt{3}}{4} = ${ansLatex}\\)입니다.`,
    explanationEn: `A regular hexagon consists of 6 equilateral triangles: \\(6 \\times \\frac{\\sqrt{3}}{4}(${r}^2) = ${ansLatex}\\).`
  };
}

// 12. [삼각비의 활용 전 유형 종합]
export function rpmG9S2TrigAppsAllMixed(random) {
  const pickFn = pick(random, [
    rpmG9S2TrigAppsLength,
    rpmG9S2TrigAppsHeight,
    rpmG9S2TrigAppsTriArea,
    rpmG9S2TrigAppsQuadArea
  ]);
  return pickFn(random);
}


// =============================================================================
// Chapter 03: 원과 직선 (Circles and Lines)
// =============================================================================

// 13. [현의 수직이등분선과 중심거리] r^2 = d^2 + (L/2)^2
export function rpmG9S2CircleChordBisector(random) {
  const mode = pick(random, ['find-radius', 'find-chord', 'broken-plate-sagitta']);

  if (mode === 'find-radius') {
    const triple = pick(random, [
      { d: 3, half: 4, chord: 8, r: 5 },
      { d: 5, half: 12, chord: 24, r: 13 },
      { d: 8, half: 15, chord: 30, r: 17 }
    ]);
    return {
      prompt: `원 \\(O\\)에서 중심 \\(O\\)와 현 \\(\\overline{AB}\\) 사이의 거리가 \\(${triple.d}\\)이고, 현 \\(\\overline{AB}\\)의 길이가 \\(${triple.chord}\\)일 때, 원 \\(O\\)의 반지름의 길이를 구하시오.`,
      promptEn: `In circle \\(O\\), the distance from center \\(O\\) to chord \\(AB\\) is \\(${triple.d}\\), and \\(AB = ${triple.chord}\\). Find the radius.`,
      expression: `r = \\sqrt{${triple.d}^2 + \\left(\\frac{${triple.chord}}{2}\\right)^2} = ${triple.r}`,
      answer: String(triple.r),
      explanation: `원의 중심에서 현에 내린 수선은 현을 수직이등분하므로 현의 절반 길이는 \\(\\frac{${triple.chord}}{2} = ${triple.half}\\)입니다.\n직각삼각형에서 피타고라스 정리를 적용하면:\n\\[ r = \\sqrt{${triple.d}^2 + ${triple.half}^2} = \\sqrt{${triple.d**2 + triple.half**2}} = ${triple.r} \\]입니다.`,
      explanationEn: `The perpendicular bisects the chord to length ${triple.half}. By Pythagoras, \\(r = \\sqrt{${triple.d}^2 + ${triple.half}^2} = ${triple.r}\\).`
    };
  }

  if (mode === 'find-chord') {
    const triple = pick(random, [
      { r: 10, d: 6, half: 8, chord: 16 },
      { r: 13, d: 5, half: 12, chord: 24 },
      { r: 15, d: 9, half: 12, chord: 24 }
    ]);
    return {
      prompt: `반지름의 길이가 \\(${triple.r}\\)인 원 \\(O\\)에서 중심으로부터의 거리가 \\(${triple.d}\\)인 현 \\(\\overline{AB}\\)의 길이를 구하시오.`,
      promptEn: `In a circle of radius \\(${triple.r}\\), find the length of a chord \\(AB\\) at distance \\(${triple.d}\\) from the center.`,
      expression: `\\overline{AB} = 2 \\times \\sqrt{${triple.r}^2 - ${triple.d}^2} = ${triple.chord}`,
      answer: String(triple.chord),
      explanation: `원의 중심에서 현에 내린 수선의 발을 \\(M\\)이라 하면:\n\\(\\overline{AM} = \\sqrt{${triple.r}^2 - ${triple.d}^2} = \\sqrt{${triple.r**2 - triple.d**2}} = ${triple.half}\\)\n따라서 현 \\(\\overline{AB} = 2 \\times ${triple.half} = ${triple.chord}\\)입니다.`,
      explanationEn: `Half chord is \\(\\sqrt{${triple.r}^2 - ${triple.d}^2} = ${triple.half}\\), so chord = \\(${triple.chord}\\).`
    };
  }

  // broken-plate-sagitta
  const h = pick(random, [2, 3, 4]);
  const half = pick(random, [4, 6, 8]);
  const num = h * h + half * half;
  const rAns = num / (2 * h);
  const chordLen = 2 * half;
  return {
    prompt: `원 모양의 깨진 접시의 수막새 조각에서 현 \\(\\overline{AB} = ${chordLen}\\)이고, 선분 \\(\\overline{AB}\\)의 중점 \\(M\\)에서 원의 호까지의 거리가 \\(${h}\\)일 때, 원래 접시의 반지름의 길이를 구하시오.`,
    promptEn: `In a broken circular tile, chord \\(AB = ${chordLen}\\), and the height from the midpoint of \\(AB\\) to the arc is \\(${h}\\). Find the radius of the original circular tile.`,
    expression: `(r - ${h})^2 + ${half}^2 = r^2 \\implies r = ${rAns}`,
    answer: String(rAns),
    explanation: `원래 접시의 반지름을 \\(r\\)이라 하면 중심 \\(O\\)에서 현 \\(\\overline{AB}\\)까지의 거리는 \\(r - ${h}\\)입니다.\n피타고라스 정리에 의해:\n\\[ (r - ${h})^2 + ${half}^2 = r^2 \\]\n\\[ r^2 - ${2 * h}r + ${h * h} + ${half * half} = r^2 \\]\n\\[ ${2 * h}r = ${num} \\implies r = ${rAns} \\]입니다.`,
    explanationEn: `\\((r - ${h})^2 + ${half}^2 = r^2 \\implies r = ${rAns}\\).`
  };
}

// 14. [현의 길이와 중심 사이의 거리] OM = ON <=> AB = CD
export function rpmG9S2CircleChordDistance(random) {
  const mode = pick(random, ['equal-distance-chords', 'equilateral-inscribed']);

  if (mode === 'equal-distance-chords') {
    const angleA = pick(random, [40, 50, 70, 80]);
    const angleB = (180 - angleA) / 2;
    return {
      prompt: `원 \\(O\\)에서 두 현 \\(\\overline{AB}, \\overline{AC}\\)에 내린 수선의 발을 각각 \\(M, N\\)이라 하자.\n\\(\\overline{OM} = \\overline{ON}\\)이고 \\(\\angle A = ${angleA}^\\circ\\)일 때, \\(\\angle B\\)의 크기를 구하시오.`,
      promptEn: `In circle \\(O\\), perpendiculars from \\(O\\) to chords \\(AB\\) and \\(AC\\) have feet \\(M\\) and \\(N\\).\nIf \\(OM = ON\\) and \\(\\angle A = ${angleA}^\\circ\\), find \\(\\angle B\\).`,
      expression: `\\overline{OM} = \\overline{ON} \\implies \\overline{AB} = \\overline{AC} \\implies \\angle B = \\frac{180^\\circ - ${angleA}^\\circ}{2} = ${angleB}^\\circ`,
      answer: String(angleB),
      explanation: `원의 중심으로부터 같은 거리에 있는 두 현의 길이는 같으므로:\n\\(\\overline{OM} = \\overline{ON} \\implies \\overline{AB} = \\overline{AC}\\)\n따라서 \\(\\triangle ABC\\)는 이등변삼각형입니다.\n\\[ \\angle B = \\frac{180^\\circ - ${angleA}^\\circ}{2} = ${angleB}^\\circ \\]입니다.`,
      explanationEn: `Since \\(OM = ON\\), \\(AB = AC\\) and \\(\\triangle ABC\\) is isosceles. \\(\\angle B = ${angleB}^\\circ\\).`
    };
  }

  return {
    prompt: `원 \\(O\\)에서 세 현 \\(\\overline{AB}, \\overline{BC}, \\overline{CA}\\)에 내린 수선의 길이가 모두 같을 때, \\(\\triangle ABC\\)의 각 \\(\\angle A\\)의 크기를 구하시오.`,
    promptEn: `In circle \\(O\\), the perpendicular distances from center \\(O\\) to the three chords \\(AB, BC, CA\\) are all equal. Find \\(\\angle A\\).`,
    expression: `\\angle A = 60^\\circ`,
    answer: '60',
    explanation: `원의 중심에서 세 현까지의 거리가 모두 같으므로 세 현의 길이가 모두 같습니다 (\\(\\overline{AB} = \\overline{BC} = \\overline{CA}\\)).\n따라서 \\(\\triangle ABC\\)는 정삼각형이며, 모든 내각의 크기는 \\(60^\\circ\\)입니다.`,
    explanationEn: `Since the chords are equidistant from the center, \\(\\triangle ABC\\) is equilateral, so \\(\\angle A = 60^\\circ\\).`
  };
}

// 15. [원의 접선의 성질과 접선의 길이] PA = PB 및 동심원 접선
export function rpmG9S2CircleTangentLength(random) {
  const mode = pick(random, ['tangent-length-pythagoras', 'tangent-quad-area', 'concentric-ring-area']);

  if (mode === 'tangent-length-pythagoras') {
    const triple = pick(random, [
      { r: 5, pt: 12, po: 13 },
      { r: 8, pt: 15, po: 17 },
      { r: 7, pt: 24, po: 25 }
    ]);
    return {
      prompt: `원 밖의 점 \\(P\\)에서 원 \\(O\\)에 그은 접선의 접점을 \\(T\\)라 하자.\n원 \\(O\\)의 반지름의 길이가 \\(${triple.r}\\)이고 \\(\\overline{PO} = ${triple.po}\\)일 때, 접선의 길이 \\(\\overline{PT}\\)를 구하시오.`,
      promptEn: `From an external point \\(P\\), tangent to circle \\(O\\) touches at \\(T\\).\nIf the radius is \\(${triple.r}\\) and \\(PO = ${triple.po}\\), find \\(PT\\).`,
      expression: `\\overline{PT} = \\sqrt{${triple.po}^2 - ${triple.r}^2} = ${triple.pt}`,
      answer: String(triple.pt),
      explanation: `접선은 접점을 지나는 반지름에 수직이므로 \\(\\angle PTO = 90^\\circ\\)입니다.\n직각삼각형 \\(PTO\\)에서 피타고라스 정리에 의해:\n\\[ \\overline{PT} = \\sqrt{${triple.po}^2 - ${triple.r}^2} = \\sqrt{${triple.po**2 - triple.r**2}} = ${triple.pt} \\]입니다.`,
      explanationEn: `\\(\\angle PTO = 90^\\circ\\), so \\(PT = \\sqrt{${triple.po}^2 - ${triple.r}^2} = ${triple.pt}\\).`
    };
  }

  if (mode === 'tangent-quad-area') {
    const triple = pick(random, [
      { r: 6, pt: 8, po: 10, area: 48 },
      { r: 5, pt: 12, po: 13, area: 60 }
    ]);
    return {
      prompt: `원 밖의 점 \\(P\\)에서 원 \\(O\\)에 그은 두 접선의 접점을 \\(A, B\\)라 하자.\n원 \\(O\\)의 반지름의 길이가 \\(${triple.r}\\)이고 \\(\\overline{PA} = ${triple.pt}\\)일 때, 사각형 \\(APBO\\)의 넓이를 구하시오.`,
      promptEn: `From point \\(P\\), two tangents to circle \\(O\\) touch at \\(A\\) and \\(B\\).\nIf the radius is \\(${triple.r}\\) and \\(PA = ${triple.pt}\\), find the area of quadrilateral \\(APBO\\).`,
      expression: `\\text{Area} = 2 \\times \\left( \\frac{1}{2} \\times ${triple.r} \\times ${triple.pt} \\right) = ${triple.area}`,
      answer: String(triple.area),
      explanation: `사각형 \\(APBO\\)는 합동인 두 직각삼각형 \\(\\triangle PAO\\)와 \\(\\triangle PBO\\)로 이루어져 있습니다.\n\\[ \\text{넓이} = 2 \\times \\left( \\frac{1}{2} \\times \\overline{OA} \\times \\overline{PA} \\right) = 2 \\times \\left( \\frac{1}{2} \\times ${triple.r} \\times ${triple.pt} \\right) = ${triple.area} \\]입니다.`,
      explanationEn: `Quadrilateral \\(APBO\\) consists of two right triangles: \\(2 \\times \\frac{1}{2}(${triple.r})(${triple.pt}) = ${triple.area}\\).`
    };
  }

  // concentric-ring-area
  const halfChord = pick(random, [4, 6, 8, 10]);
  const chordLen = 2 * halfChord;
  const ringArea = halfChord * halfChord;
  return {
    prompt: `중심이 같은 두 동심원에서 큰 원의 현 \\(\\overline{AB}\\)가 작은 원에 접한다.\n현 \\(\\overline{AB}\\)의 길이가 \\(${chordLen}\\)일 때, 두 원 사이의 색칠한 부분(원환)의 넓이를 구하시오. (단, \\(\\pi\\)는 기호로 표기하시오)`,
    promptEn: `In two concentric circles, a chord \\(AB\\) of the outer circle is tangent to the inner circle.\nIf \\(AB = ${chordLen}\\), find the area of the ring between the two circles.`,
    expression: `\\text{Area} = \\pi(R^2 - r^2) = \\pi \\left(\\frac{${chordLen}}{2}\\right)^2 = ${ringArea}\\pi`,
    choices: [
      { value: '1', label: `${ringArea / 2}\\pi` },
      { value: '2', label: `${ringArea}\\pi` },
      { value: '3', label: `${ringArea * 2}\\pi` },
      { value: '4', label: `${chordLen}\\pi` },
      { value: '5', label: `${ringArea * 4}\\pi` }
    ],
    answer: '2',
    explanation: `큰 원의 반지름을 \\(R\\), 작은 원의 반지름을 \\(r\\)이라 하면,\n접선과 반지름은 수직이므로 피타고라스 정리에 의해:\n\\[ R^2 - r^2 = \\left(\\frac{\\overline{AB}}{2}\\right)^2 = ${halfChord}^2 = ${ringArea} \\]\n따라서 원환의 넓이는 \\(\\pi R^2 - \\pi r^2 = \\pi (R^2 - r^2) = ${ringArea}\\pi\\)입니다.`,
    explanationEn: `Ring area is \\(\\pi(R^2 - r^2) = \\pi (${halfChord}^2) = ${ringArea}\\pi\\).`
  };
}

// 16. [삼각형 내접원 및 외접사각형] AB + CD = AD + BC & r = (a+b-c)/2
export function rpmG9S2CircleCircumQuad(random) {
  const mode = pick(random, ['circumscribed-quad-side', 'right-tri-inradius', 'triangle-circumscribed-tangent']);

  if (mode === 'circumscribed-quad-side') {
    const ab = ri(random, 8, 14);
    const cd = ri(random, 10, 16);
    const ad = ri(random, 6, 12);
    const bc = ab + cd - ad;
    return {
      prompt: `원 \\(O\\)에 외접하는 사각형 \\(ABCD\\)에서 \\(\\overline{AB} = ${ab}\\), \\(\\overline{CD} = ${cd}\\), \\(\\overline{AD} = ${ad}\\)일 때, 변 \\(\\overline{BC}\\)의 길이를 구하시오.`,
      promptEn: `In quadrilateral \\(ABCD\\) circumscribed about circle \\(O\\), \\(AB = ${ab}\\), \\(CD = ${cd}\\), and \\(AD = ${ad}\\). Find \\(BC\\).`,
      expression: `\\overline{AB} + \\overline{CD} = \\overline{AD} + \\overline{BC} \\implies ${ab} + ${cd} = ${ad} + \\overline{BC} \\implies \\overline{BC} = ${bc}`,
      answer: String(bc),
      explanation: `원에 외접하는 사각형은 두 쌍의 대변의 길이의 합이 서로 같습니다:\n\\[ \\overline{AB} + \\overline{CD} = \\overline{AD} + \\overline{BC} \\]\n\\[ ${ab} + ${cd} = ${ad} + \\overline{BC} \\implies ${ab + cd} = ${ad} + \\overline{BC} \\implies \\overline{BC} = ${bc} \\]입니다.`,
      explanationEn: `Sum of opposite sides is equal: \\(${ab} + ${cd} = ${ad} + BC \\implies BC = ${bc}\\).`
    };
  }

  if (mode === 'right-tri-inradius') {
    const triple = pick(random, [
      { a: 6, b: 8, c: 10, r: 2 },
      { a: 5, b: 12, c: 13, r: 2 },
      { a: 8, b: 15, c: 17, r: 3 },
      { a: 9, b: 12, c: 15, r: 3 }
    ]);
    return {
      prompt: `세 변의 길이가 각각 \\(${triple.a}, ${triple.b}, ${triple.c}\\)인 직각삼각형의 내접원의 반지름의 길이를 구하시오.`,
      promptEn: `Find the inradius of a right triangle with side lengths \\(${triple.a}, ${triple.b}, ${triple.c}\\).`,
      expression: `r = \\frac{${triple.a} + ${triple.b} - ${triple.c}}{2} = ${triple.r}`,
      answer: String(triple.r),
      explanation: `직각삼각형의 두 직교변을 \\(a, b\\), 빗변을 \\(c\\)라 할 때 내접원의 반지름 \\(r\\)은:\n\\[ r = \\frac{a + b - c}{2} = \\frac{${triple.a} + ${triple.b} - ${triple.c}}{2} = ${triple.r} \\]입니다.`,
      explanationEn: `Inradius \\(r = \\frac{a + b - c}{2} = ${triple.r}\\).`
    };
  }

  // triangle-circumscribed-tangent
  const ad = ri(random, 4, 8);
  const bd = ri(random, 4, 8);
  const ce = ri(random, 5, 9);
  const perimeter = 2 * (ad + bd + ce);
  return {
    prompt: `삼각형 \\(ABC\\)의 세 변이 원 \\(O\\)와 점 \\(D, E, F\\)에서 접한다.\n\\(\\overline{BD} = ${bd}\\), \\(\\overline{CE} = ${ce}\\)이고 \\(\\triangle ABC\\)의 둘레의 길이가 \\(${perimeter}\\)일 때, 선분 \\(\\overline{AD}\\)의 길이를 구하시오.`,
    promptEn: `Circle \\(O\\) is inscribed in triangle \\(ABC\\) touching sides at \\(D, E, F\\).\nIf \\(BD = ${bd}\\), \\(CE = ${ce}\\), and perimeter is \\(${perimeter}\\), find \\(AD\\).`,
    expression: `2(\\overline{AD} + ${bd} + ${ce}) = ${perimeter} \\implies \\overline{AD} = ${ad}`,
    answer: String(ad),
    explanation: `원 밖의 한 점에서 그은 두 접선의 길이는 같으므로:\n\\(\\overline{AF} = \\overline{AD}\\), \\(\\overline{BE} = \\overline{BD} = ${bd}\\), \\(\\overline{CF} = \\overline{CE} = ${ce}\\)\n삼각형의 둘레: \\(2(\\overline{AD} + ${bd} + ${ce}) = ${perimeter}\\)\n\\[ \\overline{AD} + ${bd + ce} = ${perimeter / 2} \\implies \\overline{AD} = ${ad} \\]입니다.`,
    explanationEn: `Perimeter is \\(2(AD + BD + CE) = ${perimeter} \\implies AD = ${ad}\\).`
  };
}

// 17. [원과 직선 전 유형 종합]
export function rpmG9S2CircleLinesAllMixed(random) {
  const pickFn = pick(random, [
    rpmG9S2CircleChordBisector,
    rpmG9S2CircleChordDistance,
    rpmG9S2CircleTangentLength,
    rpmG9S2CircleCircumQuad
  ]);
  return pickFn(random);
}


// =============================================================================
// Chapter 04: 원주각과 그 성질 (Inscribed Angles & Properties)
// =============================================================================

// 18. [원주각과 중심각, 호의 비례] angle(APB) = 1/2 angle(AOB)
export function rpmG9S2AngleCentralRatio(random) {
  const mode = pick(random, ['central-to-inscribed', 'inscribed-to-central', 'arc-ratio-angles']);

  if (mode === 'central-to-inscribed') {
    const central = pick(random, [80, 100, 110, 120, 140]);
    const inscribed = central / 2;
    return {
      prompt: `오른쪽 그림과 같이 원 \\(O\\)에서 호 \\(AB\\)에 대한 중심각의 크기가 \\(${central}^\\circ\\)일 때, 호 \\(AB\\)에 대한 원주각 \\(\\angle APB\\)의 크기를 구하시오.`,
      promptEn: `In circle \\(O\\), if the central angle for arc \\(AB\\) is \\(${central}^\\circ\\), find the inscribed angle \\(\\angle APB\\).`,
      expression: `\\angle APB = \\frac{1}{2} \\angle AOB = \\frac{${central}^\\circ}{2} = ${inscribed}^\\circ`,
      answer: String(inscribed),
      explanation: `한 호에 대한 원주각의 크기는 그 호에 대한 중심각의 크기의 반입니다.\n\\[ \\angle APB = \\frac{1}{2} \\angle AOB = \\frac{${central}^\\circ}{2} = ${inscribed}^\\circ \\]입니다.`,
      explanationEn: `The inscribed angle is half the central angle: \\(\\frac{${central}^\\circ}{2} = ${inscribed}^\\circ\\).`
    };
  }

  if (mode === 'inscribed-to-central') {
    const inscribed = ri(random, 35, 65);
    const central = inscribed * 2;
    return {
      prompt: `원 \\(O\\) 위의 점 \\(P\\)에 대하여 \\(\\angle APB = ${inscribed}^\\circ\\)일 때, 중심각 \\(\\angle AOB\\)의 크기를 구하시오.`,
      promptEn: `In circle \\(O\\), if inscribed angle \\(\\angle APB = ${inscribed}^\\circ\\), find central angle \\(\\angle AOB\\).`,
      expression: `\\angle AOB = 2 \\times \\angle APB = 2 \\times ${inscribed}^\\circ = ${central}^\\circ`,
      answer: String(central),
      explanation: `중심각의 크기는 원주각의 크기의 2배입니다.\n\\[ \\angle AOB = 2 \\times ${inscribed}^\\circ = ${central}^\\circ \\]입니다.`,
      explanationEn: `The central angle is twice the inscribed angle: \\(2 \\times ${inscribed}^\\circ = ${central}^\\circ\\).`
    };
  }

  // arc-ratio-angles
  const ratio = pick(random, [
    { p: 2, q: 3, r: 4, sum: 9 },
    { p: 3, q: 4, r: 5, sum: 12 },
    { p: 1, q: 2, r: 3, sum: 6 }
  ]);
  const totalDeg = 180;
  const unitDeg = totalDeg / ratio.sum;
  const angleA = ratio.q * unitDeg;
  return {
    prompt: `원 \\(O\\) 위의 세 점 \\(A, B, C\\)에 대하여 세 호의 길이의 비가 \\(\\text{호 } AB : \\text{호 } BC : \\text{호 } CA = ${ratio.p} : ${ratio.q} : ${ratio.r}\\)일 때, \\(\\angle A\\)의 크기를 구하시오.`,
    promptEn: `On circle \\(O\\), arc lengths have ratio \\(AB : BC : CA = ${ratio.p} : ${ratio.q} : ${ratio.r}\\). Find \\(\\angle A\\).`,
    expression: `\\angle A = 180^\\circ \\times \\frac{${ratio.q}}{${ratio.sum}} = ${angleA}^\\circ`,
    answer: String(angleA),
    explanation: `원 전체에 대한 원주각의 총합은 \\(180^\\circ\\)이며, 원주각의 크기는 호의 길이에 정비례합니다.\n\\(\\angle A\\)는 대호 \\(BC\\)에 대한 원주각이므로:\n\\[ \\angle A = 180^\\circ \\times \\frac{${ratio.q}}{${ratio.p} + ${ratio.q} + ${ratio.r}} = 180^\\circ \\times \\frac{${ratio.q}}{${ratio.sum}} = ${angleA}^\\circ \\]입니다.`,
    explanationEn: `The inscribed angle is proportional to the opposite arc: \\(180^\\circ \\times \\frac{${ratio.q}}{${ratio.sum}} = ${angleA}^\\circ\\).`
  };
}

// 19. [반원에 대한 원주각과 직각] 지름에 대한 원주각 = 90°
export function rpmG9S2AngleDiameterRight(random) {
  const angleA = ri(random, 25, 65);
  const angleB = 90 - angleA;
  return {
    prompt: `선분 \\(\\overline{AB}\\)가 원 \\(O\\)의 지름이고 원 위의 점 \\(C\\)에 대하여 \\(\\angle BAC = ${angleA}^\\circ\\)일 때, \\(\\angle ABC\\)의 크기를 구하시오.`,
    promptEn: `Segment \\(AB\\) is a diameter of circle \\(O\\), and \\(C\\) is on the circle. If \\(\\angle BAC = ${angleA}^\\circ\\), find \\(\\angle ABC\\).`,
    expression: `\\angle ACB = 90^\\circ \\implies \\angle ABC = 90^\\circ - ${angleA}^\\circ = ${angleB}^\\circ`,
    answer: String(angleB),
    explanation: `반원에 대한 원주각의 크기는 \\(90^\\circ\\)이므로 \\(\\angle ACB = 90^\\circ\\)입니다.\n삼각형 \\(ABC\\)의 내각의 총합은 \\(180^\\circ\\)이므로:\n\\[ \\angle ABC = 180^\\circ - (90^\\circ + ${angleA}^\\circ) = 90^\\circ - ${angleA}^\\circ = ${angleB}^\\circ \\]입니다.`,
    explanationEn: `Since \\(AB\\) is a diameter, \\(\\angle ACB = 90^\\circ\\), so \\(\\angle ABC = 90^\\circ - ${angleA}^\\circ = ${angleB}^\\circ\\).`
  };
}

// 20. [원에 내접하는 사각형과 조건] 대각의 합 180°, 외각 = 내대각
export function rpmG9S2AngleCyclicQuad(random) {
  const mode = pick(random, ['opposite-angles-sum', 'exterior-interior-opposite', 'always-cyclic-quad-choice']);

  if (mode === 'opposite-angles-sum') {
    const angleA = ri(random, 70, 115);
    const angleC = 180 - angleA;
    return {
      prompt: `원 \\(O\\)에 내접하는 사각형 \\(ABCD\\)에서 \\(\\angle A = ${angleA}^\\circ\\)일 때, 마주 보는 각 \\(\\angle C\\)의 크기를 구하시오.`,
      promptEn: `In a cyclic quadrilateral \\(ABCD\\), if \\(\\angle A = ${angleA}^\\circ\\), find \\(\\angle C\\).`,
      expression: `\\angle A + \\angle C = 180^\\circ \\implies \\angle C = 180^\\circ - ${angleA}^\\circ = ${angleC}^\\circ`,
      answer: String(angleC),
      explanation: `원에 내접하는 사각형의 한 쌍의 대각의 크기의 합은 \\(180^\\circ\\)입니다.\n\\[ \\angle C = 180^\\circ - \\angle A = 180^\\circ - ${angleA}^\\circ = ${angleC}^\\circ \\]입니다.`,
      explanationEn: `Opposite angles in a cyclic quadrilateral sum to \\(180^\\circ\\): \\(\\angle C = 180^\\circ - ${angleA}^\\circ = ${angleC}^\\circ\\).`
    };
  }

  if (mode === 'exterior-interior-opposite') {
    const extAngle = ri(random, 65, 110);
    return {
      prompt: `원 \\(O\\)에 내접하는 사각형 \\(ABCD\\)의 꼭짓점 \\(C\\)에서의 외각의 크기가 \\(${extAngle}^\\circ\\)일 때, 그 내대각인 \\(\\angle A\\)의 크기를 구하시오.`,
      promptEn: `In cyclic quadrilateral \\(ABCD\\), the exterior angle at \\(C\\) is \\(${extAngle}^\\circ\\). Find \\(\\angle A\\).`,
      expression: `\\angle A = ${extAngle}^\\circ`,
      answer: String(extAngle),
      explanation: `원에 내접하는 사각형에서 한 외각의 크기는 그와 이웃하는 내각에 대한 대각(내대각)의 크기와 같습니다.\n따라서 \\(\\angle A = ${extAngle}^\\circ\\)입니다.`,
      explanationEn: `An exterior angle of a cyclic quadrilateral equals its interior opposite angle, so \\(\\angle A = ${extAngle}^\\circ\\).`
    };
  }

  // always-cyclic-quad-choice
  return {
    prompt: `다음 중 항상 원에 내접하는 사각형을 모두 고르면? (정답 2개)`,
    promptEn: `Which of the following quadrilaterals are ALWAYS cyclic? (Select 2)`,
    expression: `\\text{등변사다리꼴, 직사각형, 정사각형}`,
    choices: [
      { value: '1', label: '평행사변형' },
      { value: '2', label: '마름모' },
      { value: '3', label: '등변사다리꼴' },
      { value: '4', label: '직사각형' },
      { value: '5', label: '일반 사다리꼴' }
    ],
    answer: '3, 4',
    explanation: `사각형이 원에 내접하려면 대각의 크기의 합이 \\(180^\\circ\\)이어야 합니다.\n- 등변사다리꼴: 밑각이 같으므로 대각의 합이 항상 \\(180^\\circ\\) (항상 내접)\n- 직사각형: 네 내각이 모두 \\(90^\\circ\\)이므로 대각의 합이 항상 \\(180^\\circ\\) (항상 내접)\n- 평행사변형, 마름모는 직각이 아닌 이상 대각의 합이 \\(180^\\circ\\)가 되지 않습니다.`,
    explanationEn: `Isosceles trapezoids and rectangles always have opposite angles summing to \\(180^\\circ\\).`
  };
}

// 21. [접선과 현이 이루는 각 (접현각)] angle(BAT) = angle(BCA)
export function rpmG9S2AngleTangentChord(random) {
  const mode = pick(random, ['basic-tangent-chord', 'tangent-chord-triangle']);

  if (mode === 'basic-tangent-chord') {
    const angle = ri(random, 40, 75);
    return {
      prompt: `직선 \\(PT\\)가 원 \\(O\\)에 점 \\(T\\)에서 접하고 선분 \\(\\overline{TA}\\)가 현일 때, \\(\\angle PTA = ${angle}^\\circ\\)이다. 호 \\(TA\\)에 대한 원주각 \\(\\angle TBA\\)의 크기를 구하시오.`,
      promptEn: `Line \\(PT\\) is tangent to circle \\(O\\) at \\(T\\), and \\(TA\\) is a chord with \\(\\angle PTA = ${angle}^\\circ\\). Find \\(\\angle TBA\\).`,
      expression: `\\angle TBA = \\angle PTA = ${angle}^\\circ`,
      answer: String(angle),
      explanation: `접선과 현이 이루는 각의 성질(접현각)에 의해:\n원의 접선과 그 접점을 지나는 현이 이루는 각의 크기는 그 각의 내부에 있는 호에 대한 원주각의 크기와 같습니다.\n\\[ \\angle TBA = \\angle PTA = ${angle}^\\circ \\]입니다.`,
      explanationEn: `By the tangent-chord theorem, the angle between the tangent and chord equals the inscribed angle subtending that chord: \\(${angle}^\\circ\\).`
    };
  }

  // tangent-chord-triangle
  const angTangent = ri(random, 40, 60);
  const angC = angTangent;
  const angA = ri(random, 50, 70);
  const angB = 180 - (angA + angC);
  return {
    prompt: `직선 \\(TT'\\)이 원 \\(O\\)에 점 \\(A\\)에서 접하고 원 위에 두 점 \\(B, C\\)가 있다.\n\\(\\angle TAB = ${angTangent}^\\circ\\), \\(\\angle BAC = ${angA}^\\circ\\)일 때, \\(\\angle ABC\\)의 크기를 구하시오.`,
    promptEn: `Line \\(TT'\\) is tangent to circle \\(O\\) at \\(A\\). If \\(\\angle TAB = ${angTangent}^\\circ\\) and \\(\\angle BAC = ${angA}^\\circ\\), find \\(\\angle ABC\\).`,
    expression: `\\angle ACB = \\angle TAB = ${angTangent}^\\circ \\implies \\angle ABC = 180^\\circ - (${angA}^\\circ + ${angTangent}^\\circ) = ${angB}^\\circ`,
    answer: String(angB),
    explanation: `접현각의 성질에 의해 \\(\\angle ACB = \\angle TAB = ${angTangent}^\\circ\\)입니다.\n삼각형 \\(ABC\\)의 내각의 합은 \\(180^\\circ\\)이므로:\n\\[ \\angle ABC = 180^\\circ - (\\angle BAC + \\angle ACB) = 180^\\circ - (${angA}^\\circ + ${angTangent}^\\circ) = ${angB}^\\circ \\]입니다.`,
    explanationEn: `\\(\\angle ACB = \\angle TAB = ${angTangent}^\\circ\\). Then \\(\\angle ABC = 180^\\circ - (${angA}^\\circ + ${angTangent}^\\circ) = ${angB}^\\circ\\).`
  };
}

// 22. [원주각 전 유형 종합]
export function rpmG9S2InscribedAnglesAllMixed(random) {
  const pickFn = pick(random, [
    rpmG9S2AngleCentralRatio,
    rpmG9S2AngleDiameterRight,
    rpmG9S2AngleCyclicQuad,
    rpmG9S2AngleTangentChord
  ]);
  return pickFn(random);
}


// =============================================================================
// Chapter 05: 대푯값과 산포도 (Representative Values & Variation)
// =============================================================================

// 23. [평균, 중앙값, 최빈값과 변량 역산]
export function rpmG9S2StatsMeanMedianMode(random) {
  const mode = pick(random, ['find-missing-mean', 'find-median', 'combined-mean-median']);

  if (mode === 'find-missing-mean') {
    const meanTarget = ri(random, 7, 12);
    const count = 5;
    const vals = [ri(random, 5, 14), ri(random, 5, 14), ri(random, 5, 14), ri(random, 5, 14)];
    const sumKnown = vals.reduce((a, b) => a + b, 0);
    const xAns = meanTarget * count - sumKnown;
    return {
      prompt: `다음 5개의 변량의 평균이 \\(${meanTarget}\\)일 때, \\(x\\)의 값을 구하시오.\n\\[ ${vals.join(', ')}, \\; x \\]`,
      promptEn: `If the mean of the 5 numbers \\(${vals.join(', ')}, x\\) is \\(${meanTarget}\\), find \\(x\\).`,
      expression: `\\frac{${vals.join(' + ')} + x}{5} = ${meanTarget} \\implies x = ${xAns}`,
      answer: String(xAns),
      explanation: `평균은 변량의 총합을 변량의 개수로 나눈 값입니다:\n\\[ \\frac{${sumKnown} + x}{5} = ${meanTarget} \\implies ${sumKnown} + x = ${meanTarget * count} \\implies x = ${xAns} \\]입니다.`,
      explanationEn: `Mean = \\(\\frac{${sumKnown} + x}{5} = ${meanTarget} \\implies x = ${xAns}\\).`
    };
  }

  if (mode === 'find-median') {
    const raw = [ri(random, 2, 8), ri(random, 5, 12), ri(random, 10, 18), ri(random, 12, 22), ri(random, 20, 30)];
    const sorted = [...raw].sort((a, b) => a - b);
    const medianAns = sorted[2];
    return {
      prompt: `다음 5개의 자료의 중앙값을 구하시오.\n\\[ ${raw.join(', ')} \\]`,
      promptEn: `Find the median of the 5 values: \\(${raw.join(', ')}\\).`,
      expression: `\\text{정렬}: ${sorted.join(', ')} \\implies \\text{중앙값} = ${medianAns}`,
      answer: String(medianAns),
      explanation: `변량을 작은 값부터 크기순으로 나열하면:\n\\[ ${sorted.join(', ')} \\]\n변량이 5개(홀수개)이므로 중앙값은 3번째 값인 \\(${medianAns}\\)입니다.`,
      explanationEn: `Arranging in order: \\(${sorted.join(', ')}\\). The median is the 3rd value, \\(${medianAns}\\).`
    };
  }

  // combined-mean-median
  const targetMedian = ri(random, 9, 14);
  const xVal = 2 * targetMedian - 8;
  return {
    prompt: `작은 수부터 차례로 나열된 4개의 변량 \\(4, 8, x, 18\\)의 중앙값이 \\(${targetMedian}\\)일 때, \\(x\\)의 값을 구하시오.`,
    promptEn: `The 4 values \\(4, 8, x, 18\\) are in ascending order. If their median is \\(${targetMedian}\\), find \\(x\\).`,
    expression: `\\frac{8 + x}{2} = ${targetMedian} \\implies x = ${xVal}`,
    answer: String(xVal),
    explanation: `짝수 개의 변량이 주어졌을 때 중앙값은 가운데 두 변량의 평균입니다:\n\\[ \\frac{8 + x}{2} = ${targetMedian} \\implies 8 + x = ${2 * targetMedian} \\implies x = ${xVal} \\]입니다.`,
    explanationEn: `Median of 4 values is \\(\\frac{8 + x}{2} = ${targetMedian} \\implies x = ${xVal}\\).`
  };
}

// 24. [편차의 성질과 분산·표준편차] sum(dev) = 0 & V = sum(dev^2)/n
export function rpmG9S2StatsVarianceDeviation(random) {
  const mode = pick(random, ['deviation-sum-zero', 'calc-variance-basic', 'linear-transform-stats']);

  if (mode === 'deviation-sum-zero') {
    const d1 = ri(random, -4, -1);
    const d2 = ri(random, -3, 0);
    const d3 = ri(random, 1, 3);
    const d4 = ri(random, 1, 4);
    const d5 = -(d1 + d2 + d3 + d4);
    return {
      prompt: `어느 5명의 학생의 국어 점수에 대한 편차가 각각 \\(${d1}, ${d2}, ${d3}, ${d4}, x\\)일 때, \\(x\\)의 값을 구하시오.`,
      promptEn: `The deviations of 5 students are \\(${d1}, ${d2}, ${d3}, ${d4}, x\\). Find \\(x\\).`,
      expression: `(${d1}) + (${d2}) + (${d3}) + (${d4}) + x = 0 \\implies x = ${d5}`,
      answer: String(d5),
      explanation: `편차의 총합은 항상 0입니다:\n\\[ (${d1}) + (${d2}) + (${d3}) + (${d4}) + x = 0 \\]\n\\[ ${d1 + d2 + d3 + d4} + x = 0 \\implies x = ${d5} \\]입니다.`,
      explanationEn: `The sum of deviations is always 0, so \\(x = ${d5}\\).`
    };
  }

  if (mode === 'calc-variance-basic') {
    const m = ri(random, 6, 12);
    const vals = [m - 2, m - 1, m, m + 1, m + 2];
    return {
      prompt: `다음 5개의 변량의 분산을 구하시오.\n\\[ ${vals.join(', ')} \\]`,
      promptEn: `Find the variance of the 5 numbers: \\(${vals.join(', ')}\\).`,
      expression: `\\text{평균} = ${m}, \\quad \\text{편차}: -2, -1, 0, 1, 2 \\implies \\text{분산} = \\frac{4 + 1 + 0 + 1 + 4}{5} = 2`,
      answer: '2',
      explanation: `변량의 평균은 \\(${m}\\)입니다.\n각 변량의 편차는 \\(-2, -1, 0, 1, 2\\)입니다.\n분산은 (편차의 제곱의 평균)이므로:\n\\[ \\frac{(-2)^2 + (-1)^2 + 0^2 + 1^2 + 2^2}{5} = \\frac{4 + 1 + 0 + 1 + 4}{5} = \\frac{10}{5} = 2 \\]입니다.`,
      explanationEn: `Mean is ${m}, deviations are \\(-2, -1, 0, 1, 2\\), so variance is \\(\\frac{10}{5} = 2\\).`
    };
  }

  // linear-transform-stats: y = a x + b
  const meanX = ri(random, 10, 25);
  const stdX = ri(random, 2, 5);
  const a = ri(random, 2, 4);
  const b = ri(random, 1, 10);
  const newStd = a * stdX;

  return {
    prompt: `어느 변량 \\(X\\)의 평균이 \\(${meanX}\\)이고 표준편차가 \\(${stdX}\\)일 때, 새로운 변량 \\(Y = ${a}X + ${b}\\)의 표준편차를 구하시오.`,
    promptEn: `The mean of \\(X\\) is \\(${meanX}\\) and the standard deviation is \\(${stdX}\\). Find the standard deviation of \\(Y = ${a}X + ${b}\\).`,
    expression: `\\sigma(Y) = |${a}| \\times \\sigma(X) = ${a} \\times ${stdX} = ${newStd}`,
    answer: String(newStd),
    explanation: `변량 \\(X\\)에 대하여 \\(Y = aX + b\\)일 때, 표준편차의 성질:\n\\[ \\sigma(Y) = |a| \\times \\sigma(X) \\]\n\\[ \\sigma(Y) = ${a} \\times ${stdX} = ${newStd} \\]입니다. (상수 \\(b\\)를 더하는 것은 산포도(퍼짐 정도)에 영향을 주지 않습니다.)`,
    explanationEn: `\\(\\sigma(aX + b) = |a| \\sigma(X) = ${a} \\times ${stdX} = ${newStd}\\).`
  };
}

// 25. [평균과 분산을 이용한 식의 값] x + y, x^2 + y^2, xy
export function rpmG9S2StatsSumOfSquares(random) {
  return {
    prompt: `두 변량 \\(x, y\\)의 평균이 \\(5\\)이고 분산이 \\(4\\)일 때, \\(xy\\)의 값을 구하시오.`,
    promptEn: `The two numbers \\(x, y\\) have mean \\(5\\) and variance \\(4\\). Find the value of \\(xy\\).`,
    expression: `x + y = 10, \\quad \\frac{x^2 + y^2}{2} - 5^2 = 4 \\implies x^2 + y^2 = 58 \\implies xy = 21`,
    answer: '21',
    explanation: `평균이 5이므로:\n\\(\\frac{x + y}{2} = 5 \\implies x + y = 10\\)\n분산이 4이므로 (분산 = 제곱의 평균 - 평균의 제곱):\n\\(\\frac{x^2 + y^2}{2} - 5^2 = 4 \\implies \\frac{x^2 + y^2}{2} = 29 \\implies x^2 + y^2 = 58\\)\n곱셈 공식의 변형에 의해:\n\\[ xy = \\frac{(x + y)^2 - (x^2 + y^2)}{2} = \\frac{10^2 - 58}{2} = \\frac{42}{2} = 21 \\]입니다.`,
    explanationEn: `\\(x + y = 10\\) and \\(x^2 + y^2 = 2(4 + 25) = 58\\). Thus \\(xy = \\frac{100 - 58}{2} = 21\\).`
  };
}

// 26. [대푯값과 산포도 전 유형 종합]
export function rpmG9S2StatsVariationAllMixed(random) {
  const pickFn = pick(random, [
    rpmG9S2StatsMeanMedianMode,
    rpmG9S2StatsVarianceDeviation,
    rpmG9S2StatsSumOfSquares
  ]);
  return pickFn(random);
}


// =============================================================================
// Chapter 06: 상관관계 (Scatter Plots & Correlation)
// =============================================================================

// 27. [산점도와 상관관계 판별] 양/음/상관관계 없음 및 강약
export function rpmG9S2ScatterDirection(random) {
  const item = pick(random, [
    {
      pairs: '여름철 기온과 에어컨 사용 시간',
      type: '양의 상관관계',
      typeEn: 'Positive correlation',
      reason: '기온이 올라갈수록 에어컨 사용 시간도 대체로 증가합니다.'
    },
    {
      pairs: '자동차의 주행 속력과 목적지까지 걸리는 시간',
      type: '음의 상관관계',
      typeEn: 'Negative correlation',
      reason: '주행 속력이 빨라질수록 걸리는 시간은 대체로 감소합니다.'
    },
    {
      pairs: '학생의 시력과 수학 성적',
      type: '상관관계가 없다',
      typeEn: 'No correlation',
      reason: '시력과 수학 성적 사이에는 일정한 증가·감소 경향이 없습니다.'
    },
    {
      pairs: '산의 해발 고도와 기온',
      type: '음의 상관관계',
      typeEn: 'Negative correlation',
      reason: '산의 고도가 높아질수록 기온은 대체로 낮아집니다.'
    }
  ]);

  return {
    prompt: `다음 두 변량 사이의 상관관계를 바르게 말한 것을 고르시오.\n\\[ \\text{「${item.pairs}」} \\]`,
    promptEn: `Choose the correct correlation for: "${item.pairs}".`,
    expression: `\\text{${item.pairs}} \\implies \\text{${item.type}}`,
    choices: [
      { value: '1', label: '양의 상관관계' },
      { value: '2', label: '음의 상관관계' },
      { value: '3', label: '상관관계가 없다' }
    ],
    answer: item.type === '양의 상관관계' ? '1' : item.type === '음의 상관관계' ? '2' : '3',
    explanation: `${item.pairs}:\n${item.reason}\n따라서 **${item.type}**입니다.`,
    explanationEn: `${item.reason} Thus it has ${item.typeEn}.`
  };
}

// 28. [산점도의 영역 해석과 비율 분석] y = x 대각선, 백분율(%) 계산
export function rpmG9S2ScatterRegionAnalysis(random) {
  const countHigher = pick(random, [6, 7, 8, 9, 10]);
  const total = 20;
  const pct = (countHigher / total) * 100;

  return {
    prompt: `어느 반 학생 20명의 1차 시험 점수(\\(x\\)점)와 2차 시험 점수(\\(y\\)점)를 나타낸 산점도에서 직선 \\(y = x\\)의 위쪽에 있는 점의 개수가 \\(${countHigher}\\)개였다.\n2차 시험 점수가 1차 시험 점수보다 높은 학생은 전체의 몇 \\(\\%\\)인지 구하시오.`,
    promptEn: `In a scatter plot of 20 students' Test 1 and Test 2 scores, \\(${countHigher}\\) points lie above the line \\(y = x\\). What percentage of students scored higher on Test 2 than Test 1?`,
    expression: `\\frac{${countHigher}}{${total}} \\times 100\\% = ${pct}\\%`,
    answer: `${pct}`,
    explanation: `직선 \\(y = x\\)의 위쪽에 있는 점은 \\(y > x\\), 즉 2차 시험 점수가 1차 시험 점수보다 높은 학생을 나타냅니다.\n해당 학생 수가 \\(${countHigher}\\)명이므로 전체 20명에 대한 백분율은:\n\\[ \\frac{${countHigher}}{${total}} \\times 100\\% = ${pct}\\% \\]입니다.`,
    explanationEn: `Points above \\(y = x\\) satisfy \\(y > x\\). The percentage is \\(\\frac{${countHigher}}{20} \\times 100\\% = ${pct}\\%\\).`
  };
}

// 29. [상관관계 전 유형 종합]
export function rpmG9S2ScatterCorrelationAllMixed(random) {
  const pickFn = pick(random, [
    rpmG9S2ScatterDirection,
    rpmG9S2ScatterRegionAnalysis
  ]);
  return pickFn(random);
}


// =============================================================================
// 단원 최고수준 심화 (실력 UP+)
// =============================================================================

export function rpmG9S2AdvancedSkillUp(random) {
  const mode = pick(random, ['cube-space-trig', 'circle-tangent-similarity-adv', 'stats-simultaneous-adv']);

  if (mode === 'cube-space-trig') {
    return {
      prompt: `한 모서리의 길이가 6인 정육면체 \\(ABCD-EFGH\\)에서 대각선 \\(\\overline{CE}\\)와 밑면의 대각선 \\(\\overline{EG}\\)가 이루는 각의 크기를 \\(x\\)라 할 때, \\(\\cos x\\)의 값을 구하시오.`,
      promptEn: `In a cube \\(ABCD-EFGH\\) with edge length 6, let \\(x\\) be the angle between diagonal \\(CE\\) and base diagonal \\(EG\\). Find \\(\\cos x\\).`,
      expression: `\\overline{EG} = 6\\sqrt{2}, \\quad \\overline{CE} = 6\\sqrt{3} \\implies \\cos x = \\frac{6\\sqrt{2}}{6\\sqrt{3}} = \\frac{\\sqrt{6}}{3}`,
      choices: [
        { value: '1', label: '\\frac{1}{3}' },
        { value: '2', label: '\\frac{\\sqrt{2}}{3}' },
        { value: '3', label: '\\frac{\\sqrt{3}}{3}' },
        { value: '4', label: '\\frac{\\sqrt{6}}{3}' },
        { value: '5', label: '\\frac{2\\sqrt{2}}{3}' }
      ],
      answer: '4',
      explanation: `정육면체의 한 모서리의 길이를 \\(a = 6\\)이라 하면:\n밑면의 대각선 \\(\\overline{EG} = 6\\sqrt{2}\\)\n정육면체의 대각선 \\(\\overline{CE} = \\sqrt{6^2 + (6\\sqrt{2})^2} = \\sqrt{36 + 72} = \\sqrt{108} = 6\\sqrt{3}\\)\n\\(\\triangle CGE\\)는 \\(\\angle CGE = 90^\\circ\\)인 직각삼각형이므로:\n\\[ \\cos x = \\frac{\\overline{EG}}{\\overline{CE}} = \\frac{6\\sqrt{2}}{6\\sqrt{3}} = \\frac{\\sqrt{2}}{\\sqrt{3}} = \\frac{\\sqrt{6}}{3} \\]입니다.`,
      explanationEn: `\\(\\cos x = \\frac{EG}{CE} = \\frac{6\\sqrt{2}}{6\\sqrt{3}} = \\frac{\\sqrt{6}}{3}\\).`
    };
  }

  if (mode === 'circle-tangent-similarity-adv') {
    const pt = 6;
    const pa = 4;
    const pb = (pt * pt) / pa;
    const ab = pb - pa;
    return {
      prompt: `원 밖의 점 \\(P\\)에서 원에 그은 접선의 접점을 \\(T\\)라 하고, 점 \\(P\\)를 지나는 할선이 원과 만나는 두 점을 \\(A, B\\)라 하자.\n\\(\\overline{PT} = 6\\), \\(\\overline{PA} = 4\\)일 때, 선분 \\(\\overline{AB}\\)의 길이를 구하시오.`,
      promptEn: `From \\(P\\), tangent touches at \\(T\\) and secant meets circle at \\(A, B\\).\nIf \\(PT = 6\\) and \\(PA = 4\\), find \\(AB\\).`,
      expression: `\\overline{PT}^2 = \\overline{PA} \\times \\overline{PB} \\implies 36 = 4 \\times \\overline{PB} \\implies \\overline{PB} = 9 \\implies \\overline{AB} = 5`,
      answer: String(ab),
      explanation: `접선과 할선의 성질 (또는 \\(\\triangle PTA \\sim \\triangle PBT\\) AA 닮음)에 의해:\n\\[ \\overline{PT}^2 = \\overline{PA} \\times \\overline{PB} \\]\n\\[ 6^2 = 4 \\times \\overline{PB} \\implies 36 = 4 \\times \\overline{PB} \\implies \\overline{PB} = 9 \\]\n따라서 \\(\\overline{AB} = \\overline{PB} - \\overline{PA} = 9 - 4 = 5\\)입니다.`,
      explanationEn: `By tangent-secant theorem, \\(PT^2 = PA \\times PB \\implies 36 = 4 \\times PB \\implies PB = 9\\). Thus \\(AB = 5\\).`
    };
  }

  // stats-simultaneous-adv
  return {
    prompt: `5개의 변량 \\(3, 5, 7, x, y\\)의 평균이 \\(6\\)이고 분산이 \\(2.8\\)일 때, \\(xy\\)의 값을 구하시오.`,
    promptEn: `The 5 numbers \\(3, 5, 7, x, y\\) have mean \\(6\\) and variance \\(2.8\\). Find \\(xy\\).`,
    expression: `x + y = 15, \\quad x^2 + y^2 = 111 \\implies xy = \\frac{225 - 111}{2} = 57`,
    answer: '57',
    explanation: `평균이 6이므로:\n\\(\\frac{3 + 5 + 7 + x + y}{5} = 6 \\implies 15 + x + y = 30 \\implies x + y = 15\\)\n분산이 2.8이므로:\n\\(\\frac{3^2 + 5^2 + 7^2 + x^2 + y^2}{5} - 6^2 = 2.8\\)\n\\(\\frac{83 + x^2 + y^2}{5} = 38.8 \\implies 83 + x^2 + y^2 = 194 \\implies x^2 + y^2 = 111\\)\n곱셈 공식의 변형에 의해:\n\\[ xy = \\frac{(x + y)^2 - (x^2 + y^2)}{2} = \\frac{15^2 - 111}{2} = \\frac{225 - 111}{2} = \\frac{114}{2} = 57 \\]입니다.`,
    explanationEn: `\\(x + y = 15\\), \\(x^2 + y^2 = 111\\), giving \\(xy = \\frac{225 - 111}{2} = 57\\).`
  };
}


// =============================================================================
// 중3-2 전 범위 종합 실전 모의고사 (25문항 Capstone)
// =============================================================================

export function rpmGrade9SemesterTwoFinalExam(random) {
  const pool = [
    rpmG9S2TrigConcept,
    rpmG9S2TrigSimilarity,
    rpmG9S2TrigLinearEqn,
    rpmG9S2TrigSpecialAngles,
    rpmG9S2TrigQuadrantTable,
    rpmG9S2TrigCompareRoots,
    rpmG9S2TrigAppsLength,
    rpmG9S2TrigAppsHeight,
    rpmG9S2TrigAppsTriArea,
    rpmG9S2TrigAppsQuadArea,
    rpmG9S2CircleChordBisector,
    rpmG9S2CircleChordDistance,
    rpmG9S2CircleTangentLength,
    rpmG9S2CircleCircumQuad,
    rpmG9S2AngleCentralRatio,
    rpmG9S2AngleDiameterRight,
    rpmG9S2AngleCyclicQuad,
    rpmG9S2AngleTangentChord,
    rpmG9S2StatsMeanMedianMode,
    rpmG9S2StatsVarianceDeviation,
    rpmG9S2StatsSumOfSquares,
    rpmG9S2ScatterDirection,
    rpmG9S2ScatterRegionAnalysis,
    rpmG9S2AdvancedSkillUp
  ];

  const chosenGenerator = pick(random, pool);
  return chosenGenerator(random);
}


// =============================================================================
// Catalog Export Definitions
// =============================================================================

export const APPLIED_G9S2_TRIG_RATIOS_UNITS = [
  { id: 'applied-g9s2-trig-concept', label: '[응용] 직각삼각형에서의 삼각비의 값', description: '피타고라스 정리와 삼각비 정의를 이용한 식의 값 계산', en: ['Trigonometric Ratios in Right Triangles', 'Using Pythagoras and definitions to evaluate trig expressions'], make: (r) => rpmG9S2TrigConcept(r) },
  { id: 'applied-g9s2-trig-similarity', label: '[응용] 닮음과 직각삼각형 수선에서의 삼각비', description: '직각의 꼭짓점에서 수선을 내릴 때 생기는 닮음 삼각비', en: ['Trigonometric Ratios via Similar Triangles', 'Trig values using altitude from right angle and similar triangles'], make: (r) => rpmG9S2TrigSimilarity(r) },
  { id: 'applied-g9s2-trig-linear-eqn', label: '[응용] 직선의 기울기와 삼각비의 관계', description: '직선이 x축과 이루는 각과 기울기 tan alpha의 활용', en: ['Line Slopes and Trigonometric Ratios', 'Relating slope to tan alpha and line equations'], make: (r) => rpmG9S2TrigLinearEqn(r) },
  { id: 'applied-g9s2-trig-special-angles', label: '[응용] 특수각의 삼각비와 각의 크기', description: '30°, 45°, 60° 삼각비 복합 사칙연산 및 삼각방정식', en: ['Special Angles Trig Calculations', 'Arithmetic with 30-45-60 degrees and angle equations'], make: (r) => rpmG9S2TrigSpecialAngles(r) },
  { id: 'applied-g9s2-trig-quadrant-table', label: '[응용] 사분원과 0°, 90° 삼각비의 값', description: '단위 사분원에서의 선분 길이와 삼각비 표의 활용', en: ['Unit Quadrant and Boundary Trig Values', 'Evaluating 0 and 90 degree values and trig tables'], make: (r) => rpmG9S2TrigQuadrantTable(r) },
  { id: 'applied-g9s2-trig-compare-roots', label: '[응용] 삼각비의 대소 관계와 제곱근 식 계산', description: '각의 크기에 따른 삼각비 대소 비교와 근호 식 간소화', en: ['Trig Inequalities & Radical Simplification', 'Ordering trig values and simplifying square roots'], make: (r) => rpmG9S2TrigCompareRoots(r) },
  { id: 'applied-g9s2-trig-ratios-all-mixed', label: '[응용] 삼각비의 값과 성질 세부 유형 실전', description: '삼각비 전 유형 종합 실전 다지기', en: ['Trigonometric Ratios Comprehensive Practice', 'Mixed applied practice across all trig ratio types'], make: (r) => rpmG9S2TrigRatiosAllMixed(r) },
];

export const APPLIED_G9S2_TRIG_APPS_UNITS = [
  { id: 'applied-g9s2-trig-apps-length', label: '[응용] 일반 삼각형 변의 길이와 높이', description: '두 변과 끼인각, 한 변과 양 끝각을 알 때의 변의 길이', en: ['Side Lengths in General Triangles', 'Using dropped altitudes and special angles to find sides'], make: (r) => rpmG9S2TrigAppsLength(r) },
  { id: 'applied-g9s2-trig-apps-height', label: '[응용] 삼각형의 높이와 실생활 활용', description: '예각·둔각 삼각형의 높이 공식 및 탑·건물의 높이', en: ['Heights & Real-World Modeling', 'Formulas for acute/obtuse triangle heights and elevation angles'], make: (r) => rpmG9S2TrigAppsHeight(r) },
  { id: 'applied-g9s2-trig-apps-tri-area', label: '[응용] 삼각형의 넓이(예각·둔각)', description: 'S = 1/2 ab sin C 공식을 이용한 넓이와 미지수 계산', en: ['Triangle Area via Sine', 'Area formulas for acute and obtuse triangles'], make: (r) => rpmG9S2TrigAppsTriArea(r) },
  { id: 'applied-g9s2-trig-apps-quad-area', label: '[응용] 사각형 및 다각형의 넓이', description: '평행사변형, 두 대각선과 사각형, 정다각형의 넓이', en: ['Quadrilateral and Polygon Areas', 'Parallelogram, diagonal quadrilateral, and regular polygon areas'], make: (r) => rpmG9S2TrigAppsQuadArea(r) },
  { id: 'applied-g9s2-trig-apps-all-mixed', label: '[응용] 삼각비의 활용(길이·넓이) 세부 유형 실전', description: '삼각비의 활용 전 유형 종합 실전 다지기', en: ['Trig Applications Comprehensive Practice', 'Mixed applied practice on lengths and areas using trigonometry'], make: (r) => rpmG9S2TrigAppsAllMixed(r) },
];

export const APPLIED_G9S2_CIRCLE_LINES_UNITS = [
  { id: 'applied-g9s2-circle-chord-bisector', label: '[응용] 현의 수직이등분선과 중심거리', description: '원의 중심에서 현에 내린 수선과 반지름 피타고라스 계산', en: ['Perpendicular Bisector of Chords', 'Center-to-chord distances and radius calculations'], make: (r) => rpmG9S2CircleChordBisector(r) },
  { id: 'applied-g9s2-circle-chord-distance', label: '[응용] 현의 길이와 중심 사이 거리', description: '중심에서 같은 거리에 있는 두 현의 길이와 성질', en: ['Chord Lengths and Center Distances', 'Equidistant chords and inscribed triangle properties'], make: (r) => rpmG9S2CircleChordDistance(r) },
  { id: 'applied-g9s2-circle-tangent-length', label: '[응용] 원의 접선의 성질과 접선의 길이', description: '원 밖의 점에서 그은 두 접선의 길이와 동심원 현 접선', en: ['Circle Tangent Properties & Lengths', 'Tangents from external points and concentric circle chords'], make: (r) => rpmG9S2CircleTangentLength(r) },
  { id: 'applied-g9s2-circle-circum-quad', label: '[응용] 삼각형의 내접원과 외접사각형', description: '내접원의 반지름 및 외접사각형의 대변의 합', en: ['Inscribed Circles and Circumscribed Quads', 'Right triangle inradius and quad opposite side sums'], make: (r) => rpmG9S2CircleCircumQuad(r) },
  { id: 'applied-g9s2-circle-lines-all-mixed', label: '[응용] 원과 직선(현·접선) 세부 유형 실전', description: '원과 직선 전 유형 종합 실전 다지기', en: ['Circles and Lines Comprehensive Practice', 'Mixed applied practice across all circle and line types'], make: (r) => rpmG9S2CircleLinesAllMixed(r) },
];

export const APPLIED_G9S2_INSCRIBED_ANGLES_UNITS = [
  { id: 'applied-g9s2-angle-central-ratio', label: '[응용] 원주각과 중심각의 크기 관계', description: '원주각은 중심각의 1/2 및 호의 길이와의 비례', en: ['Inscribed Angles & Central Angles', 'Inscribed angle theorem and arc proportionality'], make: (r) => rpmG9S2AngleCentralRatio(r) },
  { id: 'applied-g9s2-angle-diameter-right', label: '[응용] 반원에 대한 원주각과 직각삼각형', description: '지름에 대한 원주각 90°를 활용한 각도 계산', en: ['Inscribed Angles on Diameters', 'Right angles subtended by semicircles'], make: (r) => rpmG9S2AngleDiameterRight(r) },
  { id: 'applied-g9s2-angle-cyclic-quad', label: '[응용] 원에 내접하는 사각형과 네 점의 조건', description: '대각의 합 180°, 외각과 내대각, 네 점이 한 원 위에 있을 조건', en: ['Cyclic Quadrilaterals & Concyclic Points', 'Opposite angles summing to 180 degrees and concyclic conditions'], make: (r) => rpmG9S2AngleCyclicQuad(r) },
  { id: 'applied-g9s2-angle-tangent-chord', label: '[응용] 접선과 현이 이루는 각(접현각)', description: '접현각 정리와 삼각형의 각도 계산', en: ['Tangent-Chord Theorem', 'Angles between tangents and chords and inscribed triangles'], make: (r) => rpmG9S2AngleTangentChord(r) },
  { id: 'applied-g9s2-inscribed-angles-all-mixed', label: '[응용] 원주각과 그 성질 세부 유형 실전', description: '원주각 전 유형 종합 실전 다지기', en: ['Inscribed Angles Comprehensive Practice', 'Mixed applied practice across all inscribed angle types'], make: (r) => rpmG9S2InscribedAnglesAllMixed(r) },
];

export const APPLIED_G9S2_STATS_VARIATION_UNITS = [
  { id: 'applied-g9s2-stats-mean-median-mode', label: '[응용] 평균, 중앙값, 최빈값과 변량의 역산', description: '대푯값이 주어졌을 때 미지수 변량 구하기', en: ['Mean, Median, Mode & Unknowns', 'Solving for unknown data points using representative values'], make: (r) => rpmG9S2StatsMeanMedianMode(r) },
  { id: 'applied-g9s2-stats-variance-deviation', label: '[응용] 편차의 성질과 분산·표준편차', description: '편차의 합은 0, 편차 제곱의 평균과 선형 변환 산포도', en: ['Deviations, Variance & Standard Deviation', 'Zero deviation sum rule, variance calculation, and linear shifts'], make: (r) => rpmG9S2StatsVarianceDeviation(r) },
  { id: 'applied-g9s2-stats-sum-of-squares', label: '[응용] 평균과 분산을 이용한 식의 값 계산', description: '평균과 분산으로부터 제곱의 합 및 두 변량의 곱 구하기', en: ['Evaluating Expressions via Mean & Variance', 'Finding sum of squares and products from variance'], make: (r) => rpmG9S2StatsSumOfSquares(r) },
  { id: 'applied-g9s2-stats-variation-all-mixed', label: '[응용] 대푯값과 산포도 세부 유형 실전', description: '대푯값과 산포도 전 유형 종합 실전 다지기', en: ['Representative Values & Variation Comprehensive Practice', 'Mixed applied practice across all statistics and variation types'], make: (r) => rpmG9S2StatsVariationAllMixed(r) },
];

export const APPLIED_G9S2_SCATTER_CORRELATION_UNITS = [
  { id: 'applied-g9s2-scatter-direction', label: '[응용] 산점도와 상관관계의 판별', description: '양의 상관관계, 음의 상관관계, 상관관계 없음의 실생활 판별', en: ['Scatter Plots & Correlation Types', 'Identifying positive, negative, and null correlations'], make: (r) => rpmG9S2ScatterDirection(r) },
  { id: 'applied-g9s2-scatter-region-analysis', label: '[응용] 산점도의 영역 해석과 비율 분석', description: '직선 y = x 기준 위/아래 영역과 특정 조건 만족 학생 백분율', en: ['Scatter Plot Region Analysis', 'Interpreting points around y = x and calculating percentages'], make: (r) => rpmG9S2ScatterRegionAnalysis(r) },
  { id: 'applied-g9s2-scatter-correlation-all-mixed', label: '[응용] 상관관계와 산점도 분석 세부 유형 실전', description: '산점도와 상관관계 전 유형 종합 실전 다지기', en: ['Correlation & Scatter Plots Comprehensive Practice', 'Mixed applied practice on scatter plots and correlation analysis'], make: (r) => rpmG9S2ScatterCorrelationAllMixed(r) },
];

export const APPLIED_G9S2_ADVANCED_SKILL_UP_UNITS = [
  { id: 'applied-g9s2-advanced-skill-up', label: '[단원 최고수준] 중3-2 최고수준 심화 (실력 UP+)', description: '입체도형 공간 대각선 삼각비, 접현각·원주각 융합, 평균-분산 연립 심화', en: ['Grade 9 Semester 2 Advanced Challenge', 'Challenging problems: cube space trigonometry, tangent-secant similarity, simultaneous statistics'], make: (r) => rpmG9S2AdvancedSkillUp(r) },
];

export const APPLIED_GRADE9_SEMESTER_TWO_FINAL_MOCK_UNITS = [
  { id: 'applied-grade9-semester-two-final-exam', label: '[중3-2 총괄] 중3-2 전 범위 종합 실전 모의고사 (25문항)', description: '삼각비, 삼각비의 활용, 원과 직선, 원주각, 대푯값과 산포도, 상관관계 전 범위 실전 총괄 모의고사', en: ['Grade 9 Semester 2 Capstone Exam', 'Comprehensive 25-problem exam covering all Grade 9 Semester 2 units'], make: (r) => rpmGrade9SemesterTwoFinalExam(r) },
];

export const ALL_GRADE9_SEMESTER2_APPLIED_UNITS = [
  ...APPLIED_G9S2_TRIG_RATIOS_UNITS,
  ...APPLIED_G9S2_TRIG_APPS_UNITS,
  ...APPLIED_G9S2_CIRCLE_LINES_UNITS,
  ...APPLIED_G9S2_INSCRIBED_ANGLES_UNITS,
  ...APPLIED_G9S2_STATS_VARIATION_UNITS,
  ...APPLIED_G9S2_SCATTER_CORRELATION_UNITS,
  ...APPLIED_G9S2_ADVANCED_SKILL_UP_UNITS,
  ...APPLIED_GRADE9_SEMESTER_TWO_FINAL_MOCK_UNITS,
];

const GRADE9_S2_APPLIED_MAP = {
  ...Object.fromEntries(ALL_GRADE9_SEMESTER2_APPLIED_UNITS.map((u) => [u.id, u.make])),
  ...Object.fromEntries(ALL_GRADE9_SEMESTER2_APPLIED_UNITS.map((u) => [u.id.replace('applied-', 'rpm-'), u.make])),
};

export function findGrade9Semester2Generator(unitId) {
  return GRADE9_S2_APPLIED_MAP[unitId] || null;
}
