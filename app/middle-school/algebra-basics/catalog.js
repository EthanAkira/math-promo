function randomInt(random, min, max) {
  return Math.floor(random() * (max - min + 1)) + min;
}

function pick(random, values) {
  return values[randomInt(random, 0, values.length - 1)];
}

function gcd(a, b) {
  let left = Math.abs(a);
  let right = Math.abs(b);
  while (right) [left, right] = [right, left % right];
  return left || 1;
}

function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b);
}

function rational(numerator, denominator = 1) {
  const sign = denominator < 0 ? -1 : 1;
  const common = gcd(numerator, denominator);
  return { n: numerator * sign / common, d: Math.abs(denominator) / common };
}

function rationalAdd(left, right) { return rational(left.n * right.d + right.n * left.d, left.d * right.d); }
function rationalSubtract(left, right) { return rational(left.n * right.d - right.n * left.d, left.d * right.d); }
function rationalMultiply(left, right) { return rational(left.n * right.n, left.d * right.d); }
function rationalDivide(left, right) { return rational(left.n * right.d, left.d * right.n); }
function rationalText(value) { return value.d === 1 ? String(value.n) : `${value.n}/${value.d}`; }

function rationalVariableTerm(value, variable = 'x') {
  if (value.n === value.d) return variable;
  if (value.n === -value.d) return `−${variable}`;
  return `${rationalText(value)}${variable}`;
}

function problem(prompt, expression, answer, extra = {}) {
  return { prompt, expression, answer: String(answer), ...extra };
}

function signedNumber(value) {
  return value < 0 ? `(${value})` : String(value);
}

function coefficientTerm(coefficient, variable = 'x') {
  if (coefficient === 0) return '';
  if (coefficient === 1) return variable;
  if (coefficient === -1) return `−${variable}`;
  return `${coefficient < 0 ? '−' : ''}${Math.abs(coefficient)}${variable}`;
}

function linearExpression(coefficient, constant) {
  const variable = coefficientTerm(coefficient);
  if (!variable) return String(constant);
  if (!constant) return variable;
  return `${variable} ${constant > 0 ? '+' : '−'} ${Math.abs(constant)}`;
}

function notation(random) {
  const variableA = pick(random, ['a', 'x', 'm']);
  const variableB = pick(random, ['b', 'y', 'n']);
  const coefficient = pick(random, [-6, -5, -4, 2, 3, 4, 5, 6]);
  const mode = randomInt(random, 0, 5);
  if (mode === 0) return problem('곱셈 기호 ×를 생략하여 나타내세요.', `${variableA} × ${variableB} × ${signedNumber(coefficient)}`, `${coefficient}${variableA}${variableB}`, { promptEn: 'Rewrite without the multiplication sign ×.' });
  if (mode === 1) return problem('곱셈 기호 ×를 생략하여 나타내세요.', `${variableA} × ${variableA} × ${Math.abs(coefficient)} × ${variableB}`, `${Math.abs(coefficient)}${variableA}^2${variableB}`, { promptEn: 'Rewrite without the multiplication sign ×.' });
  if (mode === 2) return problem('나눗셈 기호 ÷를 생략하여 나타내세요.', `${Math.abs(coefficient)} ÷ ${variableA}`, `${Math.abs(coefficient)}/${variableA}`, { promptEn: 'Rewrite without the division sign ÷.' });
  if (mode === 3) return problem('나눗셈 기호 ÷를 생략하여 나타내세요.', `(${variableA} + ${variableB}) ÷ ${Math.abs(coefficient)}`, `(${variableA}+${variableB})/${Math.abs(coefficient)}`, { promptEn: 'Rewrite without the division sign ÷.' });
  if (mode === 4) return problem('기호 ×, ÷를 생략하여 나타내세요.', `${variableA} × ${variableB} ÷ ${Math.abs(coefficient)}`, `${variableA}${variableB}/${Math.abs(coefficient)}`, { promptEn: 'Rewrite without × and ÷.' });
  return problem('곱셈 기호 ×를 사용하여 나타내세요.', `${Math.abs(coefficient)}${variableA}^2${variableB}`, `${Math.abs(coefficient)}×${variableA}×${variableA}×${variableB}`, { promptEn: 'Rewrite using the multiplication sign ×.' });
}

function verbalExpression(random) {
  const mode = randomInt(random, 0, 5);
  const number = randomInt(random, 2, 9);
  const addend = randomInt(random, 2, 15);
  if (mode === 0) return problem(`한 개에 a원인 물건 ${number}개의 가격을 식으로 나타내세요.`, '', `${number}a`, { promptEn: `Write an expression for the price of ${number} items costing a won each.` });
  if (mode === 1) return problem('십의 자리 숫자가 a, 일의 자리 숫자가 b인 두 자리 자연수를 나타내세요.', '', '10a+b', { promptEn: 'Write the two-digit number with tens digit a and ones digit b.' });
  if (mode === 2) return problem(`시속 v km로 ${number}시간 동안 간 거리를 나타내세요.`, '', `${number}v`, { promptEn: `Write the distance traveled at v km/h for ${number} hours.` });
  if (mode === 3) return problem(`x의 ${number}배에 ${addend}를 더한 수를 나타내세요.`, '', `${number}x+${addend}`, { promptEn: `Write ${number} times x plus ${addend}.` });
  if (mode === 4) return problem(`1000원짜리 물건을 x% 할인한 가격을 나타내세요.`, '', `1000(1-x/100)`, { promptEn: 'Write the price after an x% discount from 1000 won.' });
  return problem(`가로가 x cm, 세로가 ${number} cm인 직사각형의 둘레를 나타내세요.`, '', `2x+${number * 2}`, { promptEn: `Write the perimeter of a rectangle with sides x cm and ${number} cm.` });
}

function expressionValue(random) {
  const mode = randomInt(random, 0, 4);
  const a = pick(random, [-6, -5, -4, -3, 2, 3, 4, 5, 6]);
  const b = pick(random, [-5, -4, -3, 2, 3, 4, 5]);
  if (mode === 0) {
    const coefficient = randomInt(random, 2, 5);
    const constant = randomInt(random, 1, 8);
    return problem(`a=${a}일 때, 식의 값을 구하세요.`, `${coefficient}a + ${constant}`, coefficient * a + constant, { promptEn: `Evaluate when a=${a}.` });
  }
  if (mode === 1) {
    const coefficient = randomInt(random, 2, 5);
    const constant = randomInt(random, 1, 8);
    return problem(`a=${a}일 때, 식의 값을 구하세요.`, `${coefficient}a + ${constant}`, coefficient * a + constant, { promptEn: `Evaluate when a=${a}.` });
  }
  if (mode === 2) return problem(`a=${a}, b=${b}일 때, 식의 값을 구하세요.`, `2a − b`, 2 * a - b, { promptEn: `Evaluate when a=${a} and b=${b}.` });
  if (mode === 3) return problem(`a=${a}, b=${b}일 때, 식의 값을 구하세요.`, `3a − b^2`, 3 * a - b ** 2, { promptEn: `Evaluate when a=${a} and b=${b}.` });
  return problem(`x=${a}, y=${b}일 때, 식의 값을 구하세요.`, `x^2 + 2y`, a ** 2 + 2 * b, { promptEn: `Evaluate when x=${a} and y=${b}.` });
}

function polynomialBasics(random) {
  const a = pick(random, [-5, -4, -3, 2, 3, 4, 5]);
  const b = pick(random, [-8, -6, -4, 3, 5, 7, 9]);
  const c = pick(random, [-7, -5, 2, 4, 6]);
  const expression = `${coefficientTerm(a, 'x^2')} ${b > 0 ? '+' : '−'} ${Math.abs(b)}x ${c > 0 ? '+' : '−'} ${Math.abs(c)}`;
  const mode = randomInt(random, 0, 3);
  if (mode === 0) return problem('다항식의 항의 개수를 구하세요.', expression, 3, { promptEn: 'Find the number of terms in the polynomial.' });
  if (mode === 1) return problem('다항식에서 x의 계수를 구하세요.', expression, b, { promptEn: 'Find the coefficient of x.' });
  if (mode === 2) return problem('다항식의 차수를 구하세요.', expression, 2, { promptEn: 'Find the degree of the polynomial.' });
  const isMonomial = random() < 0.5;
  return problem('다음 식이 단항식인지 고르세요.', isMonomial ? `${a}x^${randomInt(random, 1, 4)}` : expression, isMonomial ? '1' : '2', { kind: 'choice', choicesKo: ['① 단항식', '② 다항식'], choicesEn: ['① Monomial', '② Polynomial'], promptEn: 'Classify the expression.' });
}

function monomialMultiplyDivide(random) {
  const a = pick(random, [-8, -6, -4, -3, 2, 3, 4, 6, 8]);
  const b = pick(random, [-6, -4, -3, -2, 2, 3, 4, 6]);
  const mode = randomInt(random, 0, 3);
  if (mode === 0) return problem('다음을 간단히 하세요.', `${a} × ${b}x`, `${a * b}x`, { promptEn: 'Simplify.' });
  if (mode === 1) return problem('다음을 간단히 하세요.', `${a}x × (${b})`, `${a * b}x`, { promptEn: 'Simplify.' });
  if (mode === 2) {
    const divisor = pick(random, [2, 3, 4, 5]);
    const coefficient = divisor * pick(random, [-6, -4, -3, 2, 3, 5, 6]);
    return problem('다음을 간단히 하세요.', `${coefficient}x ÷ ${divisor}`, `${coefficient / divisor}x`, { promptEn: 'Simplify.' });
  }
  const divisor = pick(random, [2, 3, 4, 5]);
  return problem('다음을 간단히 하세요.', `${a}x ÷ (${b}/${divisor})`, rationalVariableTerm(rational(a * divisor, b)), { promptEn: 'Simplify.' });
}

function simplifyLinear(random) {
  const mode = randomInt(random, 0, 2);
  if (mode === 0) {
    const a = randomInt(random, -12, 12);
    const b = randomInt(random, -12, 12);
    const coefficient = a + b;
    return problem('동류항을 계산하여 간단히 하세요.', `${coefficientTerm(a)} ${b >= 0 ? '+' : '−'} ${Math.abs(b)}x`, coefficientTerm(coefficient) || '0', { promptEn: 'Combine like terms.' });
  }
  if (mode === 1) {
    const a = pick(random, [-5, -3, 2, 3, 4, 5]);
    const b = pick(random, [-8, -5, 2, 4, 7]);
    const c = pick(random, [-6, -4, 3, 5, 8]);
    const d = pick(random, [-7, -3, 2, 4, 6]);
    return problem('다음 일차식을 간단히 하세요.', `${linearExpression(a, b)} ${c >= 0 ? '+' : '−'} ${Math.abs(c)}x ${d >= 0 ? '+' : '−'} ${Math.abs(d)}`, linearExpression(a + c, b + d).replaceAll(' ', ''), { promptEn: 'Simplify the linear expression.' });
  }
  const p = pick(random, [-4, -3, 2, 3, 4]);
  const q = pick(random, [-3, -2, 2, 3]);
  const b = randomInt(random, -6, 6);
  const d = randomInt(random, -6, 6);
  return problem('분배법칙을 이용하여 간단히 하세요.', `${p}(x ${b >= 0 ? '+' : '−'} ${Math.abs(b)}) ${q >= 0 ? '+' : '−'} ${Math.abs(q)}(x ${d >= 0 ? '+' : '−'} ${Math.abs(d)})`, linearExpression(p + q, p * b + q * d).replaceAll(' ', ''), { promptEn: 'Use the distributive property and simplify.' });
}

function equationIdentity(random) {
  const identity = random() < 0.5;
  const a = randomInt(random, 2, 6);
  const b = randomInt(random, 1, 8);
  const expression = identity ? `${a}x + ${b}x = ${a + b}x` : `${a}x + ${b} = ${randomInt(random, 10, 30)}`;
  return problem('다음 등식의 종류를 고르세요.', expression, identity ? '2' : '1', { kind: 'choice', choicesKo: ['① 방정식', '② 항등식'], choicesEn: ['① Equation', '② Identity'], promptEn: 'Classify the equality.' });
}

function oneStepEquation(random) {
  const root = randomInt(random, -12, 12);
  const mode = randomInt(random, 0, 3);
  if (mode === 0) {
    const addend = randomInt(random, -10, 10);
    return problem('등식의 성질을 이용하여 방정식을 푸세요.', `x ${addend >= 0 ? '+' : '−'} ${Math.abs(addend)} = ${root + addend}`, root, { promptEn: 'Solve using the properties of equality.' });
  }
  if (mode === 1) {
    const coefficient = pick(random, [-6, -5, -4, -3, 2, 3, 4, 5, 6]);
    return problem('등식의 성질을 이용하여 방정식을 푸세요.', `${coefficient}x = ${coefficient * root}`, root, { promptEn: 'Solve using the properties of equality.' });
  }
  if (mode === 2) {
    const divisor = randomInt(random, 2, 7);
    return problem('등식의 성질을 이용하여 방정식을 푸세요.', `x/${divisor} = ${root}`, root * divisor, { promptEn: 'Solve using the properties of equality.' });
  }
  const coefficient = pick(random, [2, 3, 4, 5]);
  const constant = randomInt(random, -8, 8);
  return problem('등식의 성질을 이용하여 방정식을 푸세요.', `${coefficient}x ${constant >= 0 ? '+' : '−'} ${Math.abs(constant)} = ${coefficient * root + constant}`, root, { promptEn: 'Solve using the properties of equality.' });
}

function linearEquation(random) {
  const root = randomInt(random, -10, 10);
  let leftCoefficient;
  let rightCoefficient;
  do {
    leftCoefficient = randomInt(random, -6, 7);
    rightCoefficient = randomInt(random, -6, 7);
  } while (leftCoefficient === rightCoefficient || leftCoefficient === 0);
  const leftConstant = randomInt(random, -12, 12);
  const rightConstant = (leftCoefficient - rightCoefficient) * root + leftConstant;
  return problem('일차방정식을 푸세요.', `${linearExpression(leftCoefficient, leftConstant)} = ${linearExpression(rightCoefficient, rightConstant)}`, root, { promptEn: 'Solve the linear equation.' });
}

function advancedEquation(random) {
  const root = randomInt(random, -8, 8);
  const mode = randomInt(random, 0, 2);
  if (mode === 0) {
    const p = pick(random, [2, 3, 4, 5]);
    const q = pick(random, [-3, -2, 2, 3]);
    const b = randomInt(random, -6, 6);
    const d = p * (root + b) - q * root;
    return problem('괄호가 있는 일차방정식을 푸세요.', `${p}(x ${b >= 0 ? '+' : '−'} ${Math.abs(b)}) = ${q}x ${d >= 0 ? '+' : '−'} ${Math.abs(d)}`, root, { promptEn: 'Solve the equation with parentheses.' });
  }
  if (mode === 1) {
    const a = pick(random, [2, 3, 4, 5, 6, 7, 8]);
    const c = pick(random, [1, 2, 3, 4, 5]);
    const b = (a - c) * root;
    return problem('소수가 있는 일차방정식을 푸세요.', `${a / 10}x = ${c / 10}x ${b >= 0 ? '+' : '−'} ${Math.abs(b / 10)}`, root, { promptEn: 'Solve the equation with decimals.' });
  }
  const denominator = randomInt(random, 2, 6);
  const addend = randomInt(random, -8, 8);
  return problem('분수가 있는 일차방정식을 푸세요.', `(x ${addend >= 0 ? '−' : '+'} ${Math.abs(addend)})/${denominator} = ${root}`, root * denominator + addend, { promptEn: 'Solve the equation with fractions.' });
}

function equationWordProblem(random) {
  const mode = randomInt(random, 0, 3);
  if (mode === 0) {
    const root = randomInt(random, 2, 12);
    const multiple = randomInt(random, 2, 6);
    const addend = (multiple - 1) * root;
    return problem(`어떤 수 x에 ${addend}을 더한 수는 x의 ${multiple}배와 같습니다. x를 구하세요.`, `x + ${addend} = ${multiple}x`, root, { promptEn: `A number x plus ${addend} equals ${multiple} times x. Find x.` });
  }
  if (mode === 1) {
    const root = randomInt(random, 3, 15);
    const difference = randomInt(random, 2, 8);
    const perimeter = 4 * root + 2 * difference;
    return problem(`세로가 x cm, 가로가 세로보다 ${difference}cm 긴 직사각형의 둘레가 ${perimeter}cm입니다. 세로를 구하세요.`, `2[x + (x + ${difference})] = ${perimeter}`, root, { answerSuffix: 'cm', promptEn: `A rectangle is x cm wide and ${difference} cm longer. Its perimeter is ${perimeter} cm. Find x.` });
  }
  if (mode === 2) {
    const root = randomInt(random, 2, 15);
    const price = pick(random, [100, 200, 300, 500]);
    const fixed = randomInt(random, 1, 8);
    const fixedPrice = pick(random, [100, 200, 500]);
    const total = root * price + fixed * fixedPrice;
    return problem(`한 개에 ${price}원인 물건 x개와 한 개에 ${fixedPrice}원인 물건 ${fixed}개를 사서 ${total}원을 냈습니다. x를 구하세요.`, `${price}x + ${fixed * fixedPrice} = ${total}`, root, { answerSuffix: '개', promptEn: `Find x from the total purchase price of ${total} won.` });
  }
  const root = randomInt(random, 4, 20);
  const subtract = randomInt(random, 2, root - 1);
  const multiple = randomInt(random, 2, 5);
  const result = multiple * (root - subtract);
  return problem(`어떤 수 x에서 ${subtract}를 뺀 것의 ${multiple}배가 ${result}입니다. x를 구하세요.`, `${multiple}(x − ${subtract}) = ${result}`, root, { promptEn: `Find x if ${multiple} times x minus ${subtract} equals ${result}.` });
}

function distanceSpeedTime(random) {
  const outwardSpeed = pick(random, [2, 3, 4, 5, 6]);
  let returnSpeed;
  do returnSpeed = pick(random, [3, 4, 5, 6, 8]); while (returnSpeed === outwardSpeed);
  const distance = lcm(outwardSpeed, returnSpeed) * randomInt(random, 1, 4);
  const totalTime = distance / outwardSpeed + distance / returnSpeed;
  return problem(`두 지점 사이를 갈 때 시속 ${outwardSpeed}km, 올 때 시속 ${returnSpeed}km로 이동하여 모두 ${totalTime}시간이 걸렸습니다. 두 지점 사이의 거리를 구하세요.`, `x/${outwardSpeed} + x/${returnSpeed} = ${totalTime}`, distance, { answerSuffix: 'km', promptEn: `A round trip at ${outwardSpeed} km/h and ${returnSpeed} km/h took ${totalTime} hours. Find the one-way distance.` });
}

function concentration(random) {
  const evaporation = random() < 0.5;
  if (evaporation) {
    const [before, after] = pick(random, [[8, 10], [6, 10], [5, 8], [10, 20]]);
    const mass = after * randomInt(random, 10, 40);
    const evaporated = mass - mass * before / after;
    return problem(`농도 ${before}%인 소금물 ${mass}g에서 물을 증발시켜 농도 ${after}%로 만들었습니다. 증발시킨 물의 양을 구하세요.`, `${before}/100 × ${mass} = ${after}/100 × (${mass} − x)`, evaporated, { answerSuffix: 'g', promptEn: `Water evaporates from ${mass} g of ${before}% salt solution until it is ${after}%. Find the evaporated water.` });
  }
  const [before, after] = pick(random, [[8, 5], [10, 8], [12, 6], [15, 10]]);
  const mass = after * randomInt(random, 10, 35);
  const water = mass * before / after - mass;
  return problem(`농도 ${before}%인 소금물 ${mass}g에 물을 넣어 농도 ${after}%로 만들려고 합니다. 넣을 물의 양을 구하세요.`, `${before}/100 × ${mass} = ${after}/100 × (${mass} + x)`, water, { answerSuffix: 'g', promptEn: `Add water to ${mass} g of ${before}% salt solution to make it ${after}%. Find the water added.` });
}

const expressionReview = [notation, verbalExpression, expressionValue, polynomialBasics, monomialMultiplyDivide, simplifyLinear];
const equationReview = [equationIdentity, oneStepEquation, linearEquation, advancedEquation, equationWordProblem, distanceSpeedTime, concentration];

export const ALGEBRA_UNITS = [
  { id: 'notation', label: '곱셈·나눗셈 기호의 생략', description: '문자식에서 ×와 ÷를 생략하는 방법', en: ['Omitting × and ÷', 'Rewrite algebraic expressions without multiplication and division signs'], make: notation },
  { id: 'verbal-expressions', label: '문자를 사용한 식', description: '수량 관계를 문자를 사용한 식으로 나타내기', en: ['Writing algebraic expressions', 'Translate quantities and relationships into expressions'], make: verbalExpression },
  { id: 'expression-values', label: '식의 값', description: '문자에 수를 대입하여 식의 값 구하기', en: ['Evaluating expressions', 'Substitute values and evaluate expressions'], make: expressionValue },
  { id: 'polynomial-basics', label: '다항식과 일차식', description: '항·계수·차수와 단항식·다항식 구분하기', en: ['Polynomials & linear expressions', 'Identify terms, coefficients, degree and monomials'], make: polynomialBasics },
  { id: 'monomial-multiply-divide', label: '일차식의 수의 곱셈·나눗셈', description: '단항식에 수를 곱하거나 나누어 간단히 하기', en: ['Multiplying & dividing monomials', 'Simplify products and quotients of monomials'], make: monomialMultiplyDivide },
  { id: 'simplify-linear', label: '일차식의 덧셈·뺄셈', description: '동류항과 분배법칙을 이용하여 일차식 정리하기', en: ['Simplifying linear expressions', 'Combine like terms and use the distributive property'], make: simplifyLinear },
  { id: 'expressions-review', label: '문자와 식 종합', description: '문자식의 표현·대입·다항식·일차식 계산 종합', en: ['Expressions review', 'Mixed practice with algebraic expressions'], make: (random) => pick(random, expressionReview)(random) },
  { id: 'equation-identity', label: '방정식과 항등식', description: '방정식과 항등식의 뜻을 구분하기', en: ['Equations & identities', 'Distinguish equations from identities'], make: equationIdentity },
  { id: 'equality-properties', label: '등식의 성질', description: '등식의 성질을 이용한 한 단계 방정식', en: ['Properties of equality', 'Solve one-step equations'], make: oneStepEquation },
  { id: 'linear-equations', label: '일차방정식 기본 풀이', description: '이항하여 ax+b=cx+d 꼴의 방정식 풀기', en: ['Basic linear equations', 'Solve equations of the form ax+b=cx+d'], make: linearEquation },
  { id: 'advanced-linear-equations', label: '괄호·소수·분수 일차방정식', description: '괄호와 소수·분수가 포함된 방정식 풀기', en: ['Equations with parentheses, decimals & fractions', 'Solve multi-step linear equations'], make: advancedEquation },
  { id: 'equation-word-problems', label: '일차방정식 문장제', description: '문장을 방정식으로 나타내고 미지수 구하기', en: ['Linear-equation word problems', 'Model word problems with equations'], make: equationWordProblem },
  { id: 'distance-speed-time', label: '거리·속력·시간 문제', description: '거리=속력×시간 관계를 방정식으로 해결하기', en: ['Distance, speed & time', 'Solve travel problems with linear equations'], make: distanceSpeedTime },
  { id: 'concentration', label: '농도 문제', description: '소금의 양이 일정한 관계로 농도 문제 해결하기', en: ['Concentration problems', 'Solve salt-solution problems with equations'], make: concentration },
  { id: 'equations-review', label: '일차방정식 종합', description: '기본 풀이부터 문장제·속력·농도까지 종합', en: ['Linear equations review', 'Mixed practice from basic equations to applications'], make: (random) => pick(random, equationReview)(random) },
];

export function findAlgebraUnit(unitId) {
  return ALGEBRA_ALL_UNITS.find((unit) => unit.id === unitId) || ALGEBRA_UNITS[0];
}

export function localizeAlgebraUnit(unit, language, field = 'label') {
  if (language === 'ko') return unit[field];
  return localizeRegionalUnit(unit.id, language, unit.en[field === 'label' ? 0 : 1], field);
}
import { localizeRegionalUnit } from '../../regionalCatalog';
import {
  rpmAlgNotationSigns,
  rpmAlgVerbalUnitsCost,
  rpmAlgVerbalFigures,
  rpmAlgVerbalSpeedConcentration,
  rpmAlgEvalBasicNegative,
  rpmAlgEvalFractionReciprocal,
  rpmAlgEvalRealWorld,
  rpmAlgPolyTermsDegree,
  rpmAlgLinearIdentify,
  rpmAlgMonomialMultDiv,
  rpmAlgLikeTerms,
  rpmAlgLinearAddSub,
  rpmAlgLinearBrackets,
  rpmAlgFractionalLinear,
  rpmAlgLinearConditionParam,
  rpmAlgSubstituteExpression,
  rpmAlgUnknownBoxPoly,
  rpmAlgCorrectPolyCalc,
  rpmAlgGeometryShadedArea,
  rpmAlgNegPowerLinear,
  rpmAlgMagicSquarePyramid,
  rpmAlgCostProfitComplex,
  rpmAlgMultiVarComplexEval,
  rpmAlgAllTypesMixed,
} from '../rpmAppliedEngine';

export const ALGEBRA_BASIC_UNITS = ALGEBRA_UNITS;

export const RPM_ALGEBRA_APPLIED_UNITS = [
  { id: 'rpm-alg-notation-signs', label: '[문자와 식 유형 01] 곱셈과 나눗셈 기호의 생략과 거듭제곱', description: '곱셈과 나눗셈 기호의 생략 규칙과 거듭제곱 표현 익히기', en: ['Expressions Type 01: Omitting Signs & Powers', 'Practice omitting multiplication and division signs and writing powers'], make: rpmAlgNotationSigns },
  { id: 'rpm-alg-verbal-units-cost', label: '[문자와 식 유형 02] 문자를 사용한 식 (자연수, 단위, 금액, 할인)', description: '자릿수 표현, 단위 변환, 정가·할인액 문장제 표현', en: ['Expressions Type 02: Real-world Expressions & Cost', 'Expressions for digits, units, pricing, and discounts'], make: rpmAlgVerbalUnitsCost },
  { id: 'rpm-alg-verbal-figures', label: '[문자와 식 유형 03] 문자를 사용한 식 (도형의 둘레와 넓이)', description: '다각형의 둘레와 넓이 공식을 문자로 표현하기', en: ['Expressions Type 03: Perimeter & Area Expressions', 'Formulas for geometric shapes using algebraic variables'], make: rpmAlgVerbalFigures },
  { id: 'rpm-alg-verbal-speed-concentration', label: '[문자와 식 유형 04] 문자를 사용한 식 (속력·거리·시간 및 농도)', description: '속력·거리·시간 관계식 및 소금물 농도 공식 표현', en: ['Expressions Type 04: Speed, Distance, Time & Solutions', 'Formulate speed, distance, time, and salt solution concentrations'], make: rpmAlgVerbalSpeedConcentration },
  { id: 'rpm-alg-eval-basic-negative', label: '[문자와 식 유형 05] 식의 값 구하기 (음수 대입과 거듭제곱 부호)', description: '음수 대입 시 괄호 사용과 거듭제곱의 부호 판별', en: ['Expressions Type 05: Evaluating with Negatives & Powers', 'Evaluate algebraic expressions with negative values and exponents'], make: rpmAlgEvalBasicNegative },
  { id: 'rpm-alg-eval-fraction-reciprocal', label: '[문자와 식 유형 06] 분수를 분모에 대입하여 식의 값 구하기', description: '분모에 분수가 올 때 나눗셈으로 바꾸어 역수 곱하기', en: ['Expressions Type 06: Evaluating with Reciprocal Fractions', 'Evaluate expressions where fractions are in denominators'], make: rpmAlgEvalFractionReciprocal },
  { id: 'rpm-alg-eval-real-world', label: '[문자와 식 유형 07] 식의 값의 실생활 활용 (과학 공식 및 물리량)', description: '기온, 소리의 속력, 제동거리 등 과학 공식에 대입하기', en: ['Expressions Type 07: Real-world Science Formula Evaluation', 'Evaluate scientific and physical formulas with given quantities'], make: rpmAlgEvalRealWorld },
  { id: 'rpm-alg-poly-terms-degree', label: '[문자와 식 유형 08] 다항식의 항, 상수항, 계수와 차수', description: '다항식의 기본 용어 분석 및 차수·계수 종합 판별', en: ['Expressions Type 08: Terms, Coefficients & Degree', 'Identify terms, constants, coefficients, and degree of polynomials'], make: rpmAlgPolyTermsDegree },
  { id: 'rpm-alg-linear-identify', label: '[문자와 식 유형 09] 일차식의 식별과 분모 문자 함정', description: '일차식인 것 고르기와 분모에 문자가 있는 분수식 함정 구별', en: ['Expressions Type 09: Identifying Linear Expressions', 'Distinguish true linear expressions from non-polynomials'], make: rpmAlgLinearIdentify },
  { id: 'rpm-alg-monomial-mult-div', label: '[문자와 식 유형 10] 일차식과 수의 곱셈·나눗셈', description: '분배법칙과 역수를 이용한 일차식과 수의 곱셈과 나눗셈', en: ['Expressions Type 10: Linear Expression Multiplication & Division', 'Multiply and divide linear expressions by numbers'], make: rpmAlgMonomialMultDiv },
  { id: 'rpm-alg-like-terms', label: '[문자와 식 유형 11] 동류항의 판별과 동류항 성립 조건', description: '문자와 차수가 같은 동류항 판별 및 미지수 차수 맞추기', en: ['Expressions Type 11: Like Terms & Degree Conditions', 'Identify like terms and solve for exponents making terms like'], make: rpmAlgLikeTerms },
  { id: 'rpm-alg-linear-add-sub', label: '[문자와 식 유형 12] 일차식의 덧셈과 뺄셈 (동류항 모으기)', description: '동류항끼리 묶어 ax+b 꼴로 간단히 정리하기', en: ['Expressions Type 12: Adding & Subtracting Linear Expressions', 'Combine like terms into simplified linear form'], make: rpmAlgLinearAddSub },
  { id: 'rpm-alg-linear-brackets', label: '[문자와 식 유형 13] 괄호가 있는 일차식의 계산 (소/중/대괄호)', description: '소괄호, 중괄호, 대괄호 순서로 분배법칙을 풀어 정리하기', en: ['Expressions Type 13: Linear Expressions with Nested Brackets', 'Expand and simplify expressions with parentheses and brackets'], make: rpmAlgLinearBrackets },
  { id: 'rpm-alg-fractional-linear', label: '[문자와 식 유형 14] 분수 꼴인 일차식의 덧셈과 뺄셈 (통분 연산)', description: '분모의 최소공배수로 통분하고 분자 괄호 부호 주의하여 계산', en: ['Expressions Type 14: Fractional Linear Expressions', 'Add and subtract fractional linear expressions by finding common denominators'], make: rpmAlgFractionalLinear },
  { id: 'rpm-alg-linear-condition-param', label: '[문자와 식 유형 15] 일차식이 되도록 하는 미지수 조건', description: '식 정리 후 2차항이 소거되어 일차식이 될 조건 찾기', en: ['Expressions Type 15: Conditions for a Linear Expression', 'Find parameter values that eliminate higher degree terms'], make: rpmAlgLinearConditionParam },
  { id: 'rpm-alg-substitute-expression', label: '[문자와 식 유형 16] 문자에 일차식을 대입하기', description: 'A, B 대신 주어진 일차식을 괄호로 대입하여 식 정리하기', en: ['Expressions Type 16: Substituting Expressions for Variables', 'Substitute algebraic expressions into other linear forms'], make: rpmAlgSubstituteExpression },
  { id: 'rpm-alg-unknown-box-poly', label: '[문자와 식 유형 17] □ 안에 알맞은 일차식 구하기', description: '다항식 연산에서 빈칸이나 네모에 들어갈 일차식 역산하기', en: ['Expressions Type 17: Finding the Unknown Box Expression', 'Solve for an unknown algebraic term inside a box'], make: rpmAlgUnknownBoxPoly },
  { id: 'rpm-alg-correct-poly-calc', label: '[문자와 식 유형 18] 바르게 계산한 일차식 구하기', description: '잘못 계산한 식에서 원래 다항식을 구하고 바르게 계산하기', en: ['Expressions Type 18: Finding the Corrected Expression', 'Deduce original expression from calculation errors and recalculate'], make: rpmAlgCorrectPolyCalc },
  { id: 'rpm-alg-geometry-shaded-area', label: '[문자와 식 유형 19] 도형에서의 일차식 활용 (둘레와 색칠한 넓이)', description: '직사각형, 사다리꼴 등에서 색칠한 부분의 넓이와 둘레를 일차식으로 나타내기', en: ['Expressions Type 19: Geometric Linear Applications & Shaded Area', 'Calculate shaded area and perimeter using linear algebraic expressions'], make: rpmAlgGeometryShadedArea },
  { id: 'rpm-alg-neg-power-linear', label: '[문자와 식 유형 20] (-1)^n 거듭제곱이 포함된 일차식의 계산', description: 'n이 짝수 또는 홀수일 때 (-1)^n의 부호를 결정하여 일차식 풀기', en: ['Expressions Type 20: Linear Expressions with Powers of -1', 'Simplify expressions with (-1)^n based on odd/even parity'], make: rpmAlgNegPowerLinear },
  { id: 'rpm-alg-magic-square-pyramid', label: '[문자와 식 심화 21] 일차식 마방진과 다항식 피라미드 퍼즐', description: '행/열/대각선의 합이 같은 마방진 및 인접 두 식을 더하는 피라미드 퍼즐', en: ['Expressions Advanced 21: Linear Magic Squares & Pyramids', 'Solve algebraic magic squares and polynomial addition pyramids'], make: rpmAlgMagicSquarePyramid },
  { id: 'rpm-alg-cost-profit-complex', label: '[문자와 식 발전 22] 원가·정가·할인가·이익 복합 문장제', description: '원가, 정가, 할인 판매가, 판매 이익 사이의 관계를 문자로 정밀하게 나타내기', en: ['Expressions Challenge 22: Cost, List Price & Profit Word Problems', 'Advanced algebraic modeling for pricing, markups, and profits'], make: rpmAlgCostProfitComplex },
  { id: 'rpm-alg-multi-var-complex-eval', label: '[문자와 식 발전 23] 다중 문자 분수식의 고난도 대입 식의 값', description: '문자가 여러 개인 분수식에서 역수 또는 비례식을 변형하여 식의 값 구하기', en: ['Expressions Challenge 23: Multi-Variable Complex Fraction Evaluation', 'Evaluate advanced fractional expressions with reciprocal substitutions'], make: rpmAlgMultiVarComplexEval },
  { id: 'rpm-alg-all-types-mixed', label: '[단원 실전 다지기] 매일 문자와 식 종합', description: '문자의 사용과 식의 계산 전 유형을 아우르는 매일 실전 종합 모의평가', en: ['Daily Expressions Comprehensive', 'Comprehensive mixed practice covering all expression types'], make: rpmAlgAllTypesMixed },
];

export const ALGEBRA_ALL_UNITS = [...ALGEBRA_UNITS, ...RPM_ALGEBRA_APPLIED_UNITS];
