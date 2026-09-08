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
  rpmEqIdentityEquation,
  rpmEqRootSubstitute,
  rpmEqIdentityDistinguish,
  rpmEqIdentityCondition,
  rpmEqPropertiesEquality,
  rpmEqSolveUsingProperties,
  rpmEqTranspositionRule,
  rpmEqLinearDefIdentify,
  rpmEqBracketsExpand,
  rpmEqDecimalCoef,
  rpmEqFractionCoef,
  rpmEqMixedDecimalFraction,
  rpmEqProportionCrossMult,
  rpmEqRootGivenParam,
  rpmEqTwoEqsSameRoot,
  rpmEqSpecialRoots,
  rpmEqRootIntegerNatural,
  rpmEqRootRatioMultiple,
  rpmEqMistakenCoef,
  rpmEqCommonRootSystems,
  rpmEqAllTypesMixed,
  rpmAppNumberRelations,
  rpmAppConsecutiveNumbers,
  rpmAppDigitValues,
  rpmAppAgeProblems,
  rpmAppSavingsAllowance,
  rpmAppFixedTotalCount,
  rpmAppGeometryFigures,
  rpmAppExcessDeficitItems,
  rpmAppPercentChangeStudents,
  rpmAppTotalFractionReading,
  rpmAppSpeedRoundtripCourses,
  rpmAppSpeedTimeDifference,
  rpmAppSpeedCatchupDelay,
  rpmAppSpeedTracksOpposite,
  rpmAppSaltWaterEvaporateAdd,
  rpmAppSaltAddSalt,
  rpmAppSaltTwoSolutionsMix,
  rpmAppCostPriceProfitDiscount,
  rpmAppWorkDoneCollaborative,
  rpmAppExcessDeficitBenches,
  rpmAppTrainBridgeTunnel,
  rpmAppAdmissionRatioSystem,
  rpmAppSaltExchangeReplace,
  rpmAppSpeedMidwayDelay,
  rpmAppClockHandsAngle,
  rpmAppAllTypesMixed,
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

  // 06 일차방정식의 풀이 세부 응용 유형 (RPM 1-1 p.94~103)
  { id: 'rpm-eq-identity-equation', label: '[방정식 풀이 유형 01] 등식과 방정식의 판별', description: '등식의 뜻과 기호 = 사용 여부 판별 및 문장제 등식 세우기', en: ['Equations Type 01: Identifying Equations', 'Identify equations and translate verbal statements into equations'], make: rpmEqIdentityEquation },
  { id: 'rpm-eq-root-substitute', label: '[방정식 풀이 유형 02] 방정식의 해 판별과 수 대입', description: '주어진 수가 일차방정식의 참인 해인지 대입하여 판별하기', en: ['Equations Type 02: Checking Solutions by Substitution', 'Determine whether a given number is a solution by substitution'], make: rpmEqRootSubstitute },
  { id: 'rpm-eq-identity-distinguish', label: '[방정식 풀이 유형 03] 방정식과 항등식의 구분', description: '미지수의 값에 따라 참/거짓이 갈리는 방정식과 항상 참인 항등식 구분하기', en: ['Equations Type 03: Equations vs Identities', 'Distinguish conditional linear equations from algebraic identities'], make: rpmEqIdentityDistinguish },
  { id: 'rpm-eq-identity-condition', label: '[방정식 풀이 유형 04] 항등식이 되는 미지수 조건', description: '모든 x에 대하여 항상 참인 항등식이 되도록 미정계수 결정하기', en: ['Equations Type 04: Conditions for an Identity', 'Find undetermined coefficients such that the equation is an identity'], make: rpmEqIdentityCondition },
  { id: 'rpm-eq-properties-equality', label: '[방정식 풀이 유형 05] 등식의 성질 참·거짓 판별', description: '양변에 같은 수를 더하고, 빼고, 곱하고, 0이 아닌 수로 나누는 성질 판별', en: ['Equations Type 05: Properties of Equality', 'Determine true and false statements using properties of equality'], make: rpmEqPropertiesEquality },
  { id: 'rpm-eq-solve-using-properties', label: '[방정식 풀이 유형 06] 등식의 성질을 이용한 방정식의 단계별 풀이', description: '방정식을 푸는 각 단계에서 적용된 등식의 성질(덧셈/뺄셈/곱셈/나눗셈) 추론', en: ['Equations Type 06: Step-by-Step Solving via Properties', 'Identify the specific property of equality applied at each step'], make: rpmEqSolveUsingProperties },
  { id: 'rpm-eq-transposition-rule', label: '[방정식 풀이 유형 07] 이항의 원리와 ax=b 꼴 변형', description: '부호를 바꾸어 다른 변으로 옮기는 이항과 ax=b 표준형 변형', en: ['Equations Type 07: Transposition & ax=b Form', 'Apply transposition of terms and simplify to ax=b form'], make: rpmEqTranspositionRule },
  { id: 'rpm-eq-linear-def-identify', label: '[방정식 풀이 유형 08] 일차방정식의 뜻과 일차방정식이 될 조건', description: '정리했을 때 (일차식)=0 꼴이 되는 일차방정식 판별 및 계수 조건 구하기', en: ['Equations Type 08: Definition of Linear Equation', 'Identify linear equations and determine conditions for nonzero linear coefficients'], make: rpmEqLinearDefIdentify },
  { id: 'rpm-eq-brackets-expand', label: '[방정식 풀이 유형 09] 괄호가 있는 일차방정식의 풀이', description: '분배법칙을 이용하여 괄호를 풀고 동류항을 모아 방정식 풀기', en: ['Equations Type 09: Equations with Parentheses', 'Expand parentheses using the distributive law and solve linear equations'], make: rpmEqBracketsExpand },
  { id: 'rpm-eq-decimal-coef', label: '[방정식 풀이 유형 10] 계수가 소수인 일차방정식의 풀이', description: '양변에 10, 100 등의 거듭제곱을 곱하여 정수 계수로 고쳐 풀기', en: ['Equations Type 10: Equations with Decimal Coefficients', 'Multiply by powers of 10 to clear decimals and solve'], make: rpmEqDecimalCoef },
  { id: 'rpm-eq-fraction-coef', label: '[방정식 풀이 유형 11] 계수가 분수인 일차방정식의 풀이', description: '양변에 분모의 최소공배수를 곱하여 분수를 없앤 후 풀기', en: ['Equations Type 11: Equations with Fractional Coefficients', 'Multiply by the LCM of denominators to clear fractions and solve'], make: rpmEqFractionCoef },
  { id: 'rpm-eq-mixed-decimal-fraction', label: '[방정식 풀이 유형 12] 소수와 분수가 혼합된 일차방정식의 풀이', description: '소수를 분수로 고치거나 공통 거듭제곱을 곱하여 복합 계수 방정식 풀기', en: ['Equations Type 12: Mixed Decimal & Fraction Coefficients', 'Convert decimals to fractions or multiply by common multiples to solve'], make: rpmEqMixedDecimalFraction },
  { id: 'rpm-eq-proportion-cross-mult', label: '[방정식 풀이 유형 13] 비례식으로 주어진 일차방정식의 풀이', description: '외항의 곱은 내항의 곱과 같음을 이용하여 비례식을 방정식으로 전환 풀기', en: ['Equations Type 13: Equations with Proportions', 'Solve linear equations given as proportions using cross-multiplication'], make: rpmEqProportionCrossMult },
  { id: 'rpm-eq-root-given-param', label: '[방정식 풀이 유형 14] 일차방정식의 해가 주어진 경우', description: '주어진 해(x의 값)를 방정식에 대입하여 미지수(상수 a)의 값 구하기', en: ['Equations Type 14: Finding Unknowns Given the Root', 'Substitute the known solution to solve for an unknown constant'], make: rpmEqRootGivenParam },
  { id: 'rpm-eq-two-eqs-same-root', label: '[방정식 풀이 유형 15] 두 일차방정식의 해가 서로 같은 경우', description: '계수가 완성된 일차방정식에서 해를 구한 후 다른 식에 대입하여 상수 구하기', en: ['Equations Type 15: Two Equations with the Same Root', 'Find the common solution from one equation and substitute into the other'], make: rpmEqTwoEqsSameRoot },
  { id: 'rpm-eq-special-roots', label: '[방정식 풀이 유형 16] 특수한 해를 갖는 일차방정식 (해 무수히 많음/해 없음)', description: '0×x=0 꼴의 모든 수(해 무수히 많음)와 0×x=k(k≠0) 꼴의 해 없음 판별', en: ['Equations Type 16: Special Solutions (Infinite or No Solutions)', 'Analyze equations with infinitely many solutions (0x=0) or no solutions (0x=k)'], make: rpmEqSpecialRoots },
  { id: 'rpm-eq-root-integer-natural', label: '[방정식 풀이 유형 17] 해의 조건(자연수, 정수, 음수)이 주어진 경우', description: '해 x = (a식)이 자연수 또는 음의 정수가 되도록 하는 상수 조건 찾기', en: ['Equations Type 17: Integer & Natural Number Solutions', 'Find constant values such that the solution is a natural number or integer'], make: rpmEqRootIntegerNatural },
  { id: 'rpm-eq-root-ratio-multiple', label: '[방정식 풀이 심화 18] 해의 비와 배수 관계', description: '한 일차방정식의 해가 다른 방정식 해의 m배이거나 두 해의 비가 주어질 때', en: ['Equations Advanced 18: Solution Multiples and Ratios', 'Solve systems where one equation\'s root is a multiple or in fixed ratio to another'], make: rpmEqRootRatioMultiple },
  { id: 'rpm-eq-mistaken-coef', label: '[방정식 풀이 심화 19] 계수를 잘못 보고 푼 일차방정식', description: '특정 계수나 상수항을 잘못 보고 얻은 해로부터 올바른 해 역추적하기', en: ['Equations Advanced 19: Incorrect Coefficients & Rectification', 'Trace back the correct solution from an erroneously perceived coefficient'], make: rpmEqMistakenCoef },
  { id: 'rpm-eq-common-root-systems', label: '[방정식 풀이 발전 20] 공통해를 공유하는 복합 일차방정식 시스템', description: '여러 미지수를 포함한 복수 방정식들이 동일한 해를 공유할 때 복합 연계 풀이', en: ['Equations Challenge 20: Complex Equations Sharing Common Roots', 'Solve multi-parameter linear systems sharing an identical common root'], make: rpmEqCommonRootSystems },
  { id: 'rpm-eq-all-types-mixed', label: '[단원 실전 다지기] 매일 일차방정식 풀이 종합', description: '등식의 성질부터 특수해·심화 조건까지 일차방정식 풀이 전 유형 실전 평가', en: ['Daily Linear Equations Comprehensive', 'Comprehensive mixed evaluation covering all linear equation solving types'], make: rpmEqAllTypesMixed },

  // 07 일차방정식의 활용 세부 응용 유형 (RPM 1-1 p.106~117)
  { id: 'rpm-app-number-relations', label: '[방정식 활용 유형 01] 수량 관계와 잘못 계산한 수', description: '어떤 수의 배수와 합차 관계식 및 잘못 계산한 식에서 바른 수 구하기', en: ['Word Problems Type 01: Number Relations & Errors', 'Solve number relation problems and find original numbers from erroneous calculations'], make: rpmAppNumberRelations },
  { id: 'rpm-app-consecutive-numbers', label: '[방정식 활용 유형 02] 연속하는 세 자연수·홀수·짝수', description: '연속하는 세 수의 합과 대소 비교 조건을 이용한 수 구하기', en: ['Word Problems Type 02: Consecutive Integers', 'Solve for consecutive integers, odd numbers, or even numbers from sums and conditions'], make: rpmAppConsecutiveNumbers },
  { id: 'rpm-app-digit-values', label: '[방정식 활용 유형 03] 자릿수와 두 자리 자연수', description: '십의 자리와 일의 자리 숫자를 바꾼 수와 처음 수의 관계식', en: ['Word Problems Type 03: Two-Digit Numbers & Reversals', 'Equations relating original two-digit numbers and reversed digit numbers'], make: rpmAppDigitValues },
  { id: 'rpm-app-age-problems', label: '[방정식 활용 유형 04] 나이에 대한 문제', description: '현재 부모와 자녀의 나이의 합과 n년 후 나이 배수 관계', en: ['Word Problems Type 04: Age Problems', 'Solve for current ages from age sums and future multiple relationships'], make: rpmAppAgeProblems },
  { id: 'rpm-app-savings-allowance', label: '[방정식 활용 유형 05] 예금액과 소지금의 변화', description: '매달/매일 일정 금액을 저축하거나 소비할 때의 금액 배수 관계', en: ['Word Problems Type 05: Savings & Spending', 'Calculate months or days until savings or remaining money reach a specific multiple'], make: rpmAppSavingsAllowance },
  { id: 'rpm-app-fixed-total-count', label: '[방정식 활용 유형 06] 개수의 합이 일정한 문제 (물건 구입)', description: '단가가 다른 두 물건의 총 개수, 지불 금액과 거스름돈', en: ['Word Problems Type 06: Fixed Item Total Count & Cost', 'Determine item counts given unit prices, total purchases, and change received'], make: rpmAppFixedTotalCount },
  { id: 'rpm-app-geometry-figures', label: '[방정식 활용 유형 07] 도형의 둘레와 넓이의 변화', description: '직사각형의 가로와 세로 길이를 늘이거나 줄였을 때의 둘레와 넓이', en: ['Word Problems Type 07: Geometric Perimeters & Areas', 'Model variations in rectangle dimensions, perimeter, and area using linear equations'], make: rpmAppGeometryFigures },
  { id: 'rpm-app-excess-deficit-items', label: '[방정식 활용 유형 08] 과부족 문제 (물건 분배)', description: '학생들에게 물건을 나누어 줄 때 남거나 부족한 개수 관계', en: ['Word Problems Type 08: Excess & Deficit in Distribution', 'Solve distribution problems where sharing items yields remainders and deficits'], make: rpmAppExcessDeficitItems },
  { id: 'rpm-app-percent-change-students', label: '[방정식 활용 유형 09] 학생 수의 증가와 감소', description: '작년 학생 수를 기준으로 남녀 증감률을 적용한 올해 학생 수 구하기', en: ['Word Problems Type 09: Percentage Changes in Students', 'Calculate current enrollment using baseline data and male/female percentage shifts'], make: rpmAppPercentChangeStudents },
  { id: 'rpm-app-total-fraction-reading', label: '[방정식 활용 유형 10] 전체의 양과 분수 (독서·분량)', description: '날짜별로 전체의 분수만큼 읽고 남은 쪽수로 전체 쪽수 구하기', en: ['Word Problems Type 10: Fractions of a Whole (Reading)', 'Find total book pages from fractional daily reading portions and remaining pages'], make: rpmAppTotalFractionReading },
  { id: 'rpm-app-speed-roundtrip-courses', label: '[방정식 활용 유형 11] 거리·속력·시간 (왕복 및 코스 변화)', description: '갈 때와 올 때의 속력이나 경로가 다른 왕복 이동 문제', en: ['Word Problems Type 11: Travel Roundtrips & Path Shifts', 'Solve travel time and distance equations for variable uphill/downhill courses'], make: rpmAppSpeedRoundtripCourses },
  { id: 'rpm-app-speed-time-difference', label: '[방정식 활용 유형 12] 거리·속력·시간 (시간 차 발생)', description: '서로 다른 속력으로 달렸을 때 도착 시간 차이를 이용한 거리 구하기', en: ['Word Problems Type 12: Speed & Arrival Time Differences', 'Compute distance between points from time differentials caused by varying speeds'], make: rpmAppSpeedTimeDifference },
  { id: 'rpm-app-speed-catchup-delay', label: '[방정식 활용 유형 13] 거리·속력·시간 (추격과 따라잡기)', description: '늦게 출발하여 더 빠른 속력으로 뒤쫓아가 만나는 시간과 거리', en: ['Word Problems Type 13: Pursuit & Catchup Problems', 'Model delayed departure and faster pursuit to find catchup times and distances'], make: rpmAppSpeedCatchupDelay },
  { id: 'rpm-app-speed-tracks-opposite', label: '[방정식 활용 유형 14] 거리·속력·시간 (마주보기·트랙 둘레)', description: '양 끝에서 마주 보고 걷거나 호수 둘레를 반대 방향으로 도는 경우', en: ['Word Problems Type 14: Moving Toward Each Other & Tracks', 'Solve meeting point and circular track problems moving in opposite directions'], make: rpmAppSpeedTracksOpposite },
  { id: 'rpm-app-salt-water-evaporate-add', label: '[방정식 활용 유형 15] 소금물의 농도 (물 증발·추가)', description: '물을 증발시키거나 더 넣을 때 소금의 양 불변 법칙을 이용한 풀이', en: ['Word Problems Type 15: Concentration (Dilution & Evaporation)', 'Calculate water addition or evaporation preserving total solute quantity'], make: rpmAppSaltWaterEvaporateAdd },
  { id: 'rpm-app-salt-add-salt', label: '[방정식 활용 유형 16] 소금물의 농도 (소금 더 넣기)', description: '소금을 더 넣어 농도를 높일 때 소금과 소금물 전체의 동시 증가', en: ['Word Problems Type 16: Concentration (Adding Pure Solute)', 'Find amount of pure salt required to raise solution concentration'], make: rpmAppSaltAddSalt },
  { id: 'rpm-app-salt-two-solutions-mix', label: '[방정식 활용 유형 17] 소금물의 농도 (두 소금물 섞기)', description: '농도가 다른 두 소금물을 섞어 목표 농도를 만드는 소금의 양 보존 법칙', en: ['Word Problems Type 17: Mixing Two Solutions', 'Compute quantities needed when combining solutions of differing percentages'], make: rpmAppSaltTwoSolutionsMix },
  { id: 'rpm-app-cost-price-profit-discount', label: '[방정식 활용 유형 18] 원가·정가·할인과 이익', description: '원가에 이익을 붙여 정가를 정하고 할인 판매하여 남긴 이익 관계', en: ['Word Problems Type 18: Cost, Markup, Discount & Profit', 'Model commercial pricing, percentage markups, promotional discounts, and profits'], make: rpmAppCostPriceProfitDiscount },
  { id: 'rpm-app-work-done-collaborative', label: '[방정식 활용 유형 19] 일에 대한 문제 (전체 일 1과 협동)', description: '혼자 일하다가 함께 마무리하는 작업의 날수와 작업량 계산', en: ['Word Problems Type 19: Work Done & Collaboration', 'Equations for individual work rates, solo shifts, and collaborative completions'], make: rpmAppWorkDoneCollaborative },
  { id: 'rpm-app-excess-deficit-benches', label: '[방정식 활용 유형 20] 긴 의자 문제 (빈 의자와 마지막 의자)', description: '의자당 착석 인원에 따른 남은 인원과 빈 의자 조건으로 학생 수 구하기', en: ['Word Problems Type 20: Bench Seating Constraints', 'Solve for benches and students given spare occupants and empty seating conditions'], make: rpmAppExcessDeficitBenches },
  { id: 'rpm-app-train-bridge-tunnel', label: '[방정식 활용 유형 21] 열차의 철교·터널 완전 통과', description: '열차의 길이와 속력을 고려하여 터널과 다리를 완전히 통과하는 문제', en: ['Word Problems Type 21: Trains Crossing Bridges & Tunnels', 'Account for train length when completely clearing tunnels and bridges at constant speed'], make: rpmAppTrainBridgeTunnel },
  { id: 'rpm-app-admission-ratio-system', label: '[방정식 활용 심화 22] 시험 지원자·합격자·불합격자 비율', description: '지원자, 합격자, 불합격자의 남녀 비율 연계 방정식 풀이', en: ['Word Problems Advanced 22: Admission Ratios & Outcomes', 'Multi-ratio system connecting applicants, admitted students, and rejected candidates'], make: rpmAppAdmissionRatioSystem },
  { id: 'rpm-app-salt-exchange-replace', label: '[방정식 활용 심화 23] 소금물 퍼내기·치환 및 맞교환', description: '소금물을 퍼내고 물을 붓거나 두 그릇 사이의 소금물 맞교환 농도', en: ['Word Problems Advanced 23: Solution Replacement & Vessel Swapping', 'Model multi-stage decanting, water replenishment, and cross-vessel mixing'], make: rpmAppSaltExchangeReplace },
  { id: 'rpm-app-speed-midway-delay', label: '[방정식 활용 심화 24] 도중 속력 변경과 지연 열차', description: '도중에 고장 등으로 감속하여 지연 도착했을 때 정속 주행 거리 구하기', en: ['Word Problems Advanced 24: Mid-Route Speed Reductions & Delays', 'Solve for normal-speed distance when a vehicle decelerates and arrives delayed'], make: rpmAppSpeedMidwayDelay },
  { id: 'rpm-app-clock-hands-angle', label: '[방정식 활용 발전 25] 시계 시침과 분침의 각도와 시각', description: '시침과 분침이 일치하거나 반대 방향으로 일직선을 이루는 시각 구하기', en: ['Word Problems Challenge 25: Clock Hands Angles & Exact Times', 'Calculate exact fractional minutes when hour and minute hands align or oppose at 180°'], make: rpmAppClockHandsAngle },
  { id: 'rpm-app-all-types-mixed', label: '[단원 실전 다지기] 매일 일차방정식 활용 종합', description: '수량, 자릿수, 나이, 예금, 도형, 과부족, 증감, 속력, 농도, 원가, 일, 시계 등 전 유형 종합', en: ['Daily Applied Linear Equations Comprehensive', 'Comprehensive mixed practice covering all linear equation word problem types'], make: rpmAppAllTypesMixed },
];

export const ALGEBRA_ALL_UNITS = [...ALGEBRA_UNITS, ...RPM_ALGEBRA_APPLIED_UNITS];
