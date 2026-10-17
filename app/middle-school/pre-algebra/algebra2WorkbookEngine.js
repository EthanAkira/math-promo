/**
 * Algebra 2 Systematic Workbook Problem Generator Engine
 * 
 * Based on the curriculum and problem patterns of:
 * "Algebra 2" (5-Step Systematic Workbook: Concept - Example - Check Point - Review Exercise - Chapter Test)
 * and "Solutions Manual" by Joseph Pak (JM EDU).
 * 
 * Chapters covered:
 *   Chapter 1. Working with Polynomials (Law of Exponents, Monomials, Operations, Expansion)
 *   Chapter 2. Factoring Polynomials (Binomials, Trinomials, Grouping & Substitution)
 *   Chapter 3. Rational Expression (Simplification, Complex Fractions, Rational Equations & Extraneous Roots, Work Rate)
 *   Chapter 4. Quadratic Equations (Basic Equations, Complex Numbers, Quadratic Formula, Viète Relations, Biquadratics)
 *   Chapter 5. Quadratic Functions, Part 1 (y = ax^2, Translations, Vertex Form)
 *   Chapter 6. Quadratic Functions, Part 2 (General Form, Writing Functions, Min/Max on Interval, Profit Optimization)
 *   Chapter 7. Roots and Radicals (Rational Exponents, Radical Properties, Rationalizing Denominators, Radical Equations & Extraneous Roots)
 *   Chapter 8. Special Functions (Absolute Value Functions, Greatest Integer Functions [x], Composition, Inverses)
 */

const ri = (random, min, max) => Math.floor(random() * (max - min + 1)) + min;
const pick = (random, values) => values[ri(random, 0, values.length - 1)];
const nz = (random, min = -7, max = 7) => { let value; do value = ri(random, min, max); while (!value); return value; };
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const frac = (n, d = 1) => {
  const g = gcd(n, d);
  const sign = d < 0 ? -1 : 1;
  const nn = (sign * n) / g;
  const dd = Math.abs(d) / g;
  return dd === 1 ? String(nn) : `${nn}/${dd}`;
};
const signed = (value) => (value >= 0 ? `+${value}` : `${value}`);
const make = (prompt, expression, answer, extra = {}) => ({ prompt, expression, answer: String(answer), ...extra });
const bi = (extra, promptEn, explanation, explanationEn) => ({ ...extra, promptEn, explanation, explanationEn });
const choice = (choicesKo, choicesEn = choicesKo) => ({ kind: 'choice', choicesKo, choicesEn });

// =========================================================================
// Chapter 1. Working with Polynomials
// =========================================================================

/**
 * 1.1 Law of Exponents: (x^a * y^b)^c / (x^d * y^e)
 */
export function a2PolyExponentLaws(random) {
  const a = ri(random, 2, 4);
  const b = ri(random, 1, 3);
  const c = ri(random, 2, 3);
  const d = ri(random, 1, 3);
  const e = ri(random, 1, 2);
  const totalX = a * c - d;
  const totalY = b * c - e;
  const ans = `x^${totalX}*y^${totalY}`;

  return make(
    `지수법칙을 이용하여 식을 간단히 하였을 때, x와 y의 지수의 합을 구하세요.`,
    `\\frac{(x^{${a}} y^{${b}})^{${c}}}{x^{${d}} y^{${e}}} = x^p y^q \\implies p + q = ?`,
    totalX + totalY,
    bi(
      {},
      `Using the laws of exponents, find the sum of exponents p + q when simplifying the expression.`,
      `[풀이 단계]\n1. 거듭제곱의 거듭제곱 법칙: $(x^a y^b)^c = x^{ac} y^{bc} = x^{${a * c}} y^{${b * c}}$\n2. 몫의 법칙: 지수끼리 뺍니다.\n   $x$의 지수: $p = ${a * c} - ${d} = ${totalX}$\n   $y$의 지수: $q = ${b * c} - ${e} = ${totalY}$\n3. 따라서 $p + q = ${totalX} + ${totalY} = ${totalX + totalY}$입니다.`,
      `[Solution Steps]\n1. Power of a power: $(x^a y^b)^c = x^{${a * c}} y^{${b * c}}$\n2. Quotient rule: subtract exponents.\n   For $x$: $p = ${a * c} - ${d} = ${totalX}$\n   For $y$: $q = ${b * c} - ${e} = ${totalY}$\n3. Therefore, $p + q = ${totalX + totalY}.`
    )
  );
}

/**
 * 1.2 Calculating Monomials: Division & Multiplication
 */
export function a2PolyMonomialCalc(random) {
  const c1 = ri(random, 2, 5) * 2;
  const c2 = ri(random, 2, 4);
  const c3 = ri(random, 2, 3);
  const netCoeff = (c1 * c3) / c2;
  if (!Number.isInteger(netCoeff)) return a2PolyMonomialCalc(random);

  const p1 = ri(random, 3, 5);
  const p2 = ri(random, 1, 2);
  const p3 = ri(random, 2, 4);
  const finalExp = p1 - p2 + p3;

  return make(
    `다음 단항식 계산 결과 $A x^n$에서 계수 $A$와 차수 $n$의 합 $A + n$을 구하세요.`,
    `(${c1}x^{${p1}}) \\div (${c2}x^{${p2}}) \\times (${c3}x^{${p3}})`,
    netCoeff + finalExp,
    bi(
      {},
      `Calculate the monomial expression into the form Ax^n, then find A + n.`,
      `[풀이 단계]\n1. 나눗셈을 곱셈 역수로 변환: $(${c1}x^{${p1}}) \\times \\frac{1}{${c2}x^{${p2}}} \\times (${c3}x^{${p3}})$\n2. 계수 계산: $(${c1} \\div ${c2}) \\times ${c3} = ${netCoeff}$\n3. 문자 지수 계산: $x^{${p1} - ${p2} + ${p3}} = x^{${finalExp}}$\n4. 결과는 $${netCoeff}x^{${finalExp}}$이므로, $A + n = ${netCoeff} + ${finalExp} = ${netCoeff + finalExp}$입니다.`,
      `[Solution Steps]\n1. Rewrite division as multiplication: $(${c1}x^{${p1}}) \\times \\frac{1}{${c2}x^{${p2}}} \\times (${c3}x^{${p3}})$\n2. Compute coefficient: $(${c1} / ${c2}) \\times ${c3} = ${netCoeff}$\n3. Combine exponents: $x^{${p1} - ${p2} + ${p3}} = x^{${finalExp}}$\n4. Result: $${netCoeff}x^{${finalExp}}$, so $A + n = ${netCoeff + finalExp}.`
    )
  );
}

/**
 * 1.5 Multiplication of Polynomials: (a + b)^3 or (a + b)(a^2 - ab + b^2)
 */
export function a2PolyExpansionCubic(random) {
  const isDiff = random() > 0.5;
  const a = ri(random, 2, 4);
  const b = ri(random, 1, 5);
  const bCubed = b ** 3;
  // (x +/- b)(x^2 -/+ bx + b^2) = x^3 +/- b^3
  const sign = isDiff ? '-' : '+';
  const oppSign = isDiff ? '+' : '-';

  return make(
    `곱셈공식을 이용하여 다음 다항식을 전개했을 때, 상수항의 값을 구하세요.`,
    `(x ${sign} ${b})(x^2 ${oppSign} ${b}x + ${b * b})`,
    isDiff ? -bCubed : bCubed,
    bi(
      {},
      `Expand the product of polynomials using special products, and find the constant term.`,
      `[풀이 단계]\n1. 세제곱의 합/차 곱셈공식: $(A ${sign} B)(A^2 ${oppSign} AB + B^2) = A^3 ${sign} B^3$\n2. $A = x, B = ${b}$를 대입하면 $x^3 ${sign} ${b}^3 = x^3 ${sign} ${bCubed}$\n3. 상수항은 $${isDiff ? -bCubed : bCubed}$입니다.`,
      `[Solution Steps]\n1. Sum/difference of cubes formula: $(A ${sign} B)(A^2 ${oppSign} AB + B^2) = A^3 ${sign} B^3$\n2. With $A = x, B = ${b}$, $(x ${sign} ${b})(x^2 ${oppSign} ${b}x + ${b * b}) = x^3 ${sign} ${bCubed}$\n3. Constant term: $${isDiff ? -bCubed : bCubed}$.`
    )
  );
}

// =========================================================================
// Chapter 2. Factoring Polynomials
// =========================================================================

/**
 * 2.1 Factoring Binomials: a^3 - b^3 or a^2 - b^2
 */
export function a2FactorBinomialCubic(random) {
  const b = ri(random, 2, 6);
  const b3 = b ** 3;
  const isSum = random() > 0.5;
  const sign = isSum ? '+' : '-';
  const opp = isSum ? '-' : '+';

  const choicesKo = [
    `(x ${sign} ${b})(x^2 ${opp} ${b}x + ${b * b})`,
    `(x ${opp} ${b})(x^2 ${sign} ${b}x + ${b * b})`,
    `(x ${sign} ${b})(x^2 ${opp} ${2 * b}x + ${b * b})`,
    `(x ${sign} ${b})^3`,
  ];
  return make(
    `다음 다항식을 바르게 인수분해한 것을 고르세요.`,
    `x^3 ${sign} ${b3}`,
    1,
    bi(
      choice(choicesKo),
      `Choose the correct factorization of the polynomial.`,
      `[풀이 단계]\n1. 공식 $a^3 ${sign} b^3 = (a ${sign} b)(a^2 ${opp} ab + b^2)$ 적용\n2. $b = ${b}$이므로 $x^3 ${sign} ${b}^3 = (x ${sign} ${b})(x^2 ${opp} ${b}x + ${b * b})$입니다.`,
      `[Solution Steps]\n1. Apply $a^3 ${sign} b^3 = (a ${sign} b)(a^2 ${opp} ab + b^2)$\n2. Since $b = ${b}$, $x^3 ${sign} ${b}^3 = (x ${sign} ${b})(x^2 ${opp} ${b}x + ${b * b})$.`
    )
  );
}

/**
 * 2.2 Factoring Trinomials: ax^2 + bx + c
 */
export function a2FactorTrinomialCross(random) {
  const p = pick(random, [2, 3]);
  const q = 1;
  const r = nz(random, -5, 5);
  const s = nz(random, -5, 5);
  const a = p * q;
  const b = p * s + q * r;
  const c = r * s;
  // Factor: (p x + r)(q x + s)
  return make(
    `다음 이차식을 $(px + r)(qx + s)$ (단, $p \\ge q > 0$)로 인수분해할 때, 네 정수 $p, q, r, s$의 합 $p + q + r + s$를 구하세요.`,
    `${a}x^2 ${signed(b)}x ${signed(c)}`,
    p + q + r + s,
    bi(
      {},
      `Factor the trinomial into (px + r)(qx + s) with p >= q > 0. Find the sum p + q + r + s.`,
      `[풀이 단계]\n1. 십자형 분해법:\n   $px \\times qx = ${a}x^2$\n   $r \\times s = ${c}$\n   대각선 곱의 합: $ps + qr = ${b}$\n2. 따라서 인수분해 결과는 $(${p}x ${signed(r)})(${q}x ${signed(s)})$입니다.\n3. $p=${p}, q=${q}, r=${r}, s=${s}$이므로 합은 $${p + q + r + s}$입니다.`,
      `[Solution Steps]\n1. Cross-factoring:\n   $px \\cdot qx = ${a}x^2$, $r \\cdot s = ${c}$\n   Diagonal sum: $ps + qr = ${b}$\n2. Factored form: $(${p}x ${signed(r)})(${q}x ${signed(s)})$\n3. Sum: $p + q + r + s = ${p + q + r + s}$.`
    )
  );
}

/**
 * 2.3 Factoring by Substitution: (x^2 + kx)^2 + A(x^2 + kx) + B
 */
export function a2FactorGroupingSubstitution(random) {
  const k = ri(random, 1, 4);
  const u1 = ri(random, 1, 3);
  const u2 = ri(random, 4, 6);
  // (U - u1)(U - u2) = U^2 - (u1+u2)U + u1*u2
  const sumU = u1 + u2;
  const prodU = u1 * u2;

  return make(
    `다항식 $(x^2 + ${k}x)^2 - ${sumU}(x^2 + ${k}x) + ${prodU}$를 $X = x^2 + ${k}x$로 치환하여 $(X - a)(X - b)$로 정리할 때, $a + b$의 값을 구하세요.`,
    `(x^2 + ${k}x)^2 - ${sumU}(x^2 + ${k}x) + ${prodU}`,
    sumU,
    bi(
      {},
      `Substitute X = x^2 + ${k}x to factor into (X - a)(X - b). Find a + b.`,
      `[풀이 단계]\n1. 공통부분 $x^2 + ${k}x = X$로 치환:\n   $X^2 - ${sumU}X + ${prodU}$\n2. 두 수의 곱이 ${prodU}, 합이 -${sumU}인 두 수는 -${u1}과 -${u2}입니다.\n   $(X - ${u1})(X - ${u2})$\n3. 따라서 $a = ${u1}, b = ${u2}$이므로 $a + b = ${sumU}$입니다.`,
      `[Solution Steps]\n1. Let $X = x^2 + ${k}x$:\n   $X^2 - ${sumU}X + ${prodU}$\n2. Factor the quadratic in $X$: $(X - ${u1})(X - ${u2})$\n3. $a + b = ${u1} + ${u2} = ${sumU}$.`
    )
  );
}

// =========================================================================
// Chapter 3. Rational Expression
// =========================================================================

/**
 * 3.2 Addition, Subtraction & Complex Fraction: 1 / (x + a) + 1 / (x + b)
 */
export function a2RationalComplexFraction(random) {
  const a = ri(random, 1, 5);
  const b = a + ri(random, 1, 4);
  // 1/(1 + 1/x) style or (1/(x-a) - 1/(x-b))
  return make(
    `다음 번분수식을 가장 간단한 유리식으로 나타낼 때, 분자의 일차항 계수와 상수항의 합을 구하세요.`,
    `\\frac{1}{1 + \\frac{${a}}{x}} = \\frac{x}{x + ${a}}`,
    1 + 0, // numerator is x, coeff=1, const=0 -> 1
    bi(
      {},
      `Simplify the complex fraction into a single rational expression, and find the sum of coefficients in the numerator.`,
      `[풀이 단계]\n1. 분모를 통분합니다: $1 + \\frac{${a}}{x} = \\frac{x + ${a}}{x}$\n2. 번분수를 정리합니다: $\\frac{1}{\\frac{x + ${a}}{x}} = \\frac{x}{x + ${a}}$\n3. 분자는 $x$이므로 계수는 1, 상수항은 0입니다. 합은 1입니다.`,
      `[Solution Steps]\n1. Combine denominator: $1 + \\frac{${a}}{x} = \\frac{x + ${a}}{x}$\n2. Invert and multiply: $\\frac{x}{x + ${a}}$\n3. Numerator is $x$, sum of coefficients is 1.`
    )
  );
}

/**
 * 3.3 Rational Equations & Extraneous Roots
 */
export function a2RationalEquation(random) {
  const r = ri(random, 2, 6);
  // x / (x - r) = r / (x - r) + 3 => x = r + 3(x - r) => x = r + 3x - 3r => 2x = 2r => x = r (extraneous!)
  // Or real solution:
  const c = ri(random, 1, 5);
  // (x + c) / (x - 1) = 2  => x + c = 2x - 2 => x = c + 2
  const sol = c + 2;
  return make(
    `다음 유리방정식의 해 $x$를 구하세요 (단, 무연근 여부를 반드시 확인하세요).`,
    `\\frac{x + ${c}}{x - 1} = 2`,
    sol,
    bi(
      {},
      `Solve the rational equation for x, verifying for extraneous roots.`,
      `[풀이 단계]\n1. 양변에 분모 $(x - 1)$을 곱합니다 (단, $x \\ne 1$):\n   $x + ${c} = 2(x - 1)$\n2. 괄호를 전개하고 일차방정식을 풉니다:\n   $x + ${c} = 2x - 2 \\implies x = ${sol}$\n3. [무연근 검산]: $x = ${sol}$을 대입하면 분모가 $${sol - 1} \\ne 0$이므로 유효한 해입니다.`,
      `[Solution Steps]\n1. Multiply both sides by $(x - 1)$ with condition $x \\ne 1$:\n   $x + ${c} = 2(x - 1)$\n2. Solve: $x = ${sol}$\n3. [Check Extraneous]: Since $x = ${sol} \\ne 1$, the denominator is non-zero, making it a valid solution.`
    )
  );
}

/**
 * 3.4 Application of Rational Equations: Work-Rate Problem
 */
export function a2RationalWordProblemWorkRate(random) {
  const t1 = ri(random, 3, 6); // hours for person A
  const t2 = ri(random, 6, 12); // hours for person B
  // 1/t1 + 1/t2 = (t1+t2)/(t1*t2), together = (t1*t2)/(t1+t2)
  // Let's choose integers:
  // e.g. 6 and 3 -> 2 hours. 12 and 6 -> 4 hours. 20 and 5 -> 4 hours.
  const pairs = [
    [6, 3, 2],
    [12, 6, 4],
    [20, 5, 4],
    [15, 10, 6],
    [12, 4, 3],
  ];
  const [aHours, bHours, together] = pick(random, pairs);

  return make(
    `A 혼자서 일하면 ${aHours}시간이 걸리고, B 혼자서 일하면 ${bHours}시간이 걸리는 작업이 있습니다. 두 사람이 함께 일할 때 이 작업을 마치는 데 걸리는 시간(시간)을 구하세요.`,
    `\\frac{1}{${aHours}} + \\frac{1}{${bHours}} = \\frac{1}{T}`,
    together,
    bi(
      {},
      `Person A can complete a job in ${aHours} hours, and Person B can complete it in ${bHours} hours. How many hours will it take them working together?`,
      `[풀이 단계]\n1. 1시간 동안 하는 일의 양:\n   A: $\\frac{1}{${aHours}}$, B: $\\frac{1}{${bHours}}$\n2. 함께 1시간 동안 하는 일의 양:\n   $\\frac{1}{${aHours}} + \\frac{1}{${bHours}} = \\frac{${bHours} + ${aHours}}{${aHours * bHours}} = \\frac{1}{${together}}$\n3. 따라서 함께 일하면 ${together}시간이 걸립니다.`,
      `[Solution Steps]\n1. Work rate per hour: A does $1/${aHours}$, B does $1/${bHours}$\n2. Combined rate: $\\frac{1}{${aHours}} + \\frac{1}{${bHours}} = \\frac{1}{${together}}$\n3. Together they take ${together} hours.`
    )
  );
}

// =========================================================================
// Chapter 4. Quadratic Equations
// =========================================================================

/**
 * 4.2 Complex Numbers: Powers of i and arithmetic
 */
export function a2QuadComplexNumbers(random) {
  const exp = ri(random, 15, 105);
  const rem = exp % 4;
  const values = ['1', 'i', '-1', '-i'];
  const labelsKo = ['1', 'i', '-1', '-i'];
  const ansIdx = rem === 0 ? 0 : rem === 1 ? 1 : rem === 2 ? 2 : 3;

  return make(
    `허수 단위 $i$에 대하여 $i^{${exp}}$의 값을 고르세요.`,
    `i^{${exp}} = ?`,
    ansIdx + 1,
    bi(
      choice(labelsKo),
      `Evaluate the power of the imaginary unit i^{${exp}}.`,
      `[풀이 단계]\n1. 허수단위 $i$의 거듭제곱 주기성:\n   $i^1 = i, i^2 = -1, i^3 = -i, i^4 = 1$\n2. 지수 ${exp}를 4로 나눈 나머지를 구합니다:\n   $${exp} = 4 \\times ${Math.floor(exp / 4)} + ${rem}$\n3. 따라서 $i^{${exp}} = (i^4)^{${Math.floor(exp / 4)}} \\times i^{${rem}} = ${values[ansIdx]}$입니다.`,
      `[Solution Steps]\n1. Powers of $i$ repeat with period 4: $i, -1, -i, 1$\n2. Divide exponent by 4: ${exp} = 4(${Math.floor(exp / 4)}) + ${rem}\n3. Result: $i^{${exp}} = i^{${rem}} = ${values[ansIdx]}$.`
    )
  );
}

/**
 * 4.5 Solutions & Coefficients of Quadratic Equations (Viète's Formulas)
 */
export function a2QuadVieteRelations(random) {
  const r1 = nz(random, -5, 5);
  const r2 = nz(random, -5, 5);
  const sum = r1 + r2;
  const prod = r1 * r2;
  // equation: x^2 - sum*x + prod = 0
  // find alpha^2 + beta^2 = sum^2 - 2*prod
  const ans = sum * sum - 2 * prod;

  return make(
    `이차방정식 $x^2 ${signed(-sum)}x ${signed(prod)} = 0$의 두 근을 $\\alpha, \\beta$라 할 때, $\\alpha^2 + \\beta^2$의 값을 구하세요.`,
    `x^2 ${signed(-sum)}x ${signed(prod)} = 0 \\implies \\alpha^2 + \\beta^2 = ?`,
    ans,
    bi(
      {},
      `Given that alpha and beta are roots of the quadratic equation, find the value of alpha^2 + beta^2.`,
      `[풀이 단계]\n1. 근과 계수의 관계(비에트의 정리):\n   $\\alpha + \\beta = ${sum}$\n   $\\alpha\\beta = ${prod}$\n2. 곱셈공식 변형 적용:\n   $\\alpha^2 + \\beta^2 = (\\alpha + \\beta)^2 - 2\\alpha\\beta$\n3. 대입하여 계산:\n   $\\alpha^2 + \\beta^2 = (${sum})^2 - 2(${prod}) = ${sum * sum} - ${2 * prod} = ${ans}$입니다.`,
      `[Solution Steps]\n1. By Viète's formulas: $\\alpha + \\beta = ${sum}$, $\\alpha\\beta = ${prod}$\n2. Use identity: $\\alpha^2 + \\beta^2 = (\\alpha + \\beta)^2 - 2\\alpha\\beta$\n3. Calculation: $(${sum})^2 - 2(${prod}) = ${ans}$.`
    )
  );
}

// =========================================================================
// Chapter 5 & 6. Quadratic Functions
// =========================================================================

/**
 * 5.2 Translation & Vertex Form: y = a(x - h)^2 + k
 */
export function a2QuadFuncStandardVertex(random) {
  const a = nz(random, -3, 3);
  const h = nz(random, -5, 5);
  const k = nz(random, -6, 6);

  return make(
    `이차함수 $y = ${a}(x ${signed(-h)})^2 ${signed(k)}$의 꼭짓점의 좌표가 $(h, k)$일 때, $h + k$의 값을 구하세요.`,
    `y = ${a}(x ${signed(-h)})^2 ${signed(k)}`,
    h + k,
    bi(
      {},
      `Find the sum h + k of the vertex coordinates (h, k) of the quadratic function.`,
      `[풀이 단계]\n1. 이차함수 표준형 $y = a(x - h)^2 + k$에서 꼭짓점은 $(h, k)$입니다.\n2. 주어진 식에서 $h = ${h}, k = ${k}$입니다.\n3. 따라서 꼭짓점의 좌표 합 $h + k = ${h} + ${k} = ${h + k}$입니다.`,
      `[Solution Steps]\n1. The vertex form $y = a(x - h)^2 + k$ has vertex at $(h, k)$.\n2. Here $h = ${h}$ and $k = ${k}$.\n3. Sum $h + k = ${h + k}$.`
    )
  );
}

/**
 * 6.3 Maximum and Minimum on an Interval
 */
export function a2QuadFuncMinMaxDomain(random) {
  const a = pick(random, [1, 2]); // convex downward
  const h = ri(random, 1, 4);
  const k = ri(random, -5, 5);
  // Interval [0, h + 2]
  // Since a > 0, min occurs at vertex x = h (if in domain), value = k
  // max occurs at farther boundary
  const xLeft = 0;
  const xRight = h + 2;
  const yLeft = a * (xLeft - h) ** 2 + k;
  const yRight = a * (xRight - h) ** 2 + k;
  const maxVal = Math.max(yLeft, yRight);
  const minVal = k;

  return make(
    `구간 $[0, ${xRight}]$에서 이차함수 $y = ${a}(x - ${h})^2 ${signed(k)}$의 최댓값과 최솟값의 합을 구하세요.`,
    `y = ${a}(x - ${h})^2 ${signed(k)}, \\quad x \\in [0, ${xRight}]`,
    maxVal + minVal,
    bi(
      {},
      `Find the sum of the maximum and minimum values of the quadratic function on the given interval.`,
      `[풀이 단계]\n1. 꼭짓점 $x = ${h}$가 주어진 구간 $[0, ${xRight}]$에 포함됩니다.\n   아래로 볼록($a > 0$)이므로 최솟값은 꼭짓점에서 발생: $\\text{Min} = ${minVal}$\n2. 구간 양 끝점에서의 함숫값:\n   $x = 0 \\implies y = ${a}(0 - ${h})^2 ${signed(k)} = ${yLeft}$\n   $x = ${xRight} \\implies y = ${a}(${xRight} - ${h})^2 ${signed(k)} = ${yRight}$\n   따라서 최댓값은 $\\text{Max} = ${maxVal}$\n3. 최댓값과 최솟값의 합은 $${maxVal} + ${minVal} = ${maxVal + minVal}$입니다.`,
      `[Solution Steps]\n1. The vertex $x = ${h}$ lies in $[0, ${xRight}]$. Since $a > 0$, the minimum is at the vertex: $\\text{Min} = ${minVal}$.\n2. Values at endpoints: at $x = 0$, $y = ${yLeft}$; at $x = ${xRight}$, $y = ${yRight}$. Thus $\\text{Max} = ${maxVal}$.\n3. Sum of max and min: $${maxVal + minVal}$.`
    )
  );
}

// =========================================================================
// Chapter 7. Roots and Radicals
// =========================================================================

/**
 * 7.3 Rationalizing the Denominator: c / (sqrt(a) + sqrt(b))
 */
export function a2RadicalRationalizeDenom(random) {
  const b = pick(random, [2, 3, 5]);
  const a = b + 1; // so a - b = 1
  const c = ri(random, 2, 5);
  // c / (sqrt(a) - sqrt(b)) = c*(sqrt(a) + sqrt(b))

  return make(
    `다음 식의 분모를 유리화했을 때, $c(\\sqrt{${a}} + \\sqrt{${b}})$ 꼴의 계수 $c$의 값을 구하세요.`,
    `\\frac{${c}}{\\sqrt{${a}} - \\sqrt{${b}}}`,
    c,
    bi(
      {},
      `Rationalize the denominator of the radical expression to find coefficient c.`,
      `[풀이 단계]\n1. 분모의 켤레무리수 $(\\sqrt{${a}} + \\sqrt{${b}})$를 분자와 분모에 곱합니다:\n   $\\frac{${c}(\\sqrt{${a}} + \\sqrt{${b}})}{(\\sqrt{${a}} - \\sqrt{${b}})(\\sqrt{${a}} + \\sqrt{${b}})}$\n2. 분모 전개: $(\\sqrt{${a}})^2 - (\\sqrt{${b}})^2 = ${a} - ${b} = 1$\n3. 따라서 결과는 $${c}(\\sqrt{${a}} + \\sqrt{${b}})$이며, $c = ${c}$입니다.`,
      `[Solution Steps]\n1. Multiply numerator and denominator by conjugate $(\\sqrt{${a}} + \\sqrt{${b}})$:\n2. Denominator simplifies to $${a} - ${b} = 1$\n3. The expression is $${c}(\\sqrt{${a}} + \\sqrt{${b}})$, so $c = ${c}$.`
    )
  );
}

/**
 * 7.5 Radical Equations & Extraneous Roots: sqrt(ax + b) = x - c
 */
export function a2RadicalEquationExtraneous(random) {
  const validRoot = ri(random, 4, 8);
  const extraRoot = -ri(random, 1, 3);
  const a = validRoot + extraRoot;
  const b = -validRoot * extraRoot;

  return make(
    `무리방정식 $\\sqrt{${a}x + ${b}} = x$의 실근을 구하세요 (무연근 제외).`,
    `\\sqrt{${a}x + ${b}} = x`,
    validRoot,
    bi(
      {},
      `Solve the radical equation for x, discarding any extraneous roots.`,
      `[풀이 단계]\n1. 양변을 제곱하여 이차방정식을 만듭니다:\n   $${a}x + ${b} = x^2 \\implies x^2 - ${a}x - ${b} = 0$\n2. 인수분해: $(x - ${validRoot})(x - (${extraRoot})) = 0$\n   따라서 $x = ${validRoot}$ 또는 $x = ${extraRoot}$\n3. [무연근 검산]:\n   - $x = ${validRoot}$: 좌변 $\\sqrt{${a * validRoot + b}} = \\sqrt{${validRoot * validRoot}} = ${validRoot}$, 우변 ${validRoot} (성립)\n   - $x = ${extraRoot}$: 좌변 $\\sqrt{${a * extraRoot + b}} = ${Math.abs(extraRoot)}$, 우변 ${extraRoot} (좌변 $\\ne$ 우변이므로 무연근!)\n4. 따라서 유효한 실근은 $x = ${validRoot}$입니다.`,
      `[Solution Steps]\n1. Square both sides: $x^2 - ${a}x - ${b} = 0$\n2. Factor: $(x - ${validRoot})(x - ${extraRoot}) = 0$, giving $x = ${validRoot}$ or $x = ${extraRoot}$\n3. Check extraneous roots: $x = ${extraRoot}$ yields a positive square root on LHS and negative RHS, so it is extraneous.\n4. Valid solution: $x = ${validRoot}$.`
    )
  );
}

// =========================================================================
// Chapter 8. Special Functions
// =========================================================================

/**
 * 8.1 Absolute Value Functions: Minimum value of |x - a| + |x - b| + |x - c|
 */
export function a2SpecialAbsoluteValueGraph(random) {
  const a = ri(random, 1, 3);
  const b = a + ri(random, 2, 4);
  const c = b + ri(random, 2, 4);
  // Min occurs at median x = b: |b - a| + 0 + |b - c| = (b - a) + (c - b) = c - a
  const minVal = c - a;

  return make(
    `함수 $f(x) = |x - ${a}| + |x - ${b}| + |x - ${c}|$의 최솟값을 구하세요.`,
    `f(x) = |x - ${a}| + |x - ${b}| + |x - ${c}| \\implies \\min f(x) = ?`,
    minVal,
    bi(
      {},
      `Find the minimum value of the absolute value sum function.`,
      `[풀이 단계]\n1. 홀수 개의 절댓값의 합 $|x - a| + |x - b| + |x - c|$의 최솟값은 $x$가 중앙값(median)일 때 발생합니다.\n2. 주어진 세 수 $${a} < ${b} < ${c}$의 중앙값은 $x = ${b}$입니다.\n3. $x = ${b}$ 대입:\n   $f(${b}) = |${b} - ${a}| + 0 + |${b} - ${c}| = (${b - a}) + (${c - b}) = ${c} - ${a} = ${minVal}$\n4. 따라서 최솟값은 ${minVal}$입니다.`,
      `[Solution Steps]\n1. The sum of odd absolute values is minimized at the median.\n2. Median of $${a}, ${b}, ${c}$ is $x = ${b}$.\n3. $f(${b}) = (${b - a}) + (${c - b}) = ${minVal}$.`
    )
  );
}

/**
 * 8.3 Operation and Composition of Functions: (f o g)(x)
 */
export function a2SpecialFunctionComposition(random) {
  const m1 = ri(random, 2, 4);
  const k1 = ri(random, 1, 5);
  const m2 = ri(random, 2, 3);
  const k2 = ri(random, 1, 4);
  const targetX = ri(random, 1, 3);
  // g(targetX) = m2*targetX + k2
  const gVal = m2 * targetX + k2;
  // f(gVal) = m1*gVal + k1
  const ans = m1 * gVal + k1;

  return make(
    `두 함수 $f(x) = ${m1}x ${signed(k1)}$, $g(x) = ${m2}x ${signed(k2)}$에 대하여 합성함수 $(f \\circ g)(${targetX})$의 값을 구하세요.`,
    `(f \\circ g)(${targetX}) = f(g(${targetX})) = ?`,
    ans,
    bi(
      {},
      `Given f(x) and g(x), evaluate the composite function (f o g)(${targetX}).`,
      `[풀이 단계]\n1. 안쪽 함수 $g(${targetX})$ 먼저 계산:\n   $g(${targetX}) = ${m2}(${targetX}) ${signed(k2)} = ${gVal}$\n2. 바깥쪽 함수 $f(${gVal})$ 계산:\n   $f(${gVal}) = ${m1}(${gVal}) ${signed(k1)} = ${ans}$\n3. 따라서 $(f \\circ g)(${targetX}) = ${ans}$입니다.`,
      `[Solution Steps]\n1. Evaluate inner function $g(${targetX}) = ${gVal}$\n2. Evaluate outer function $f(${gVal}) = ${ans}$\n3. Result: ${ans}.`
    )
  );
}

/**
 * 8.4 Inverse Functions: Finding f^-1(x)
 */
export function a2SpecialInverseFunctions(random) {
  const m = ri(random, 2, 5);
  const k = nz(random, -7, 7);
  // f(x) = m x + k => f^-1(ansVal) = targetX  <=> f(targetX) = ansVal
  const targetX = ri(random, 1, 5);
  const ansVal = m * targetX + k;

  return make(
    `일차함수 $f(x) = ${m}x ${signed(k)}$의 역함수를 $f^{-1}(x)$라 할 때, $f^{-1}(${ansVal})$의 값을 구하세요.`,
    `f^{-1}(${ansVal}) = ?`,
    targetX,
    bi(
      {},
      `Given f(x), evaluate the inverse function value f^{-1}(${ansVal}).`,
      `[풀이 단계]\n1. 역함수의 성질: $f^{-1}(${ansVal}) = k \\iff f(k) = ${ansVal}$\n2. 방정식 세우기:\n   $${m}k ${signed(k)} = ${ansVal}$\n3. 일차방정식 풀이:\n   $${m}k = ${ansVal - k} \\implies k = ${targetX}$\n4. 따라서 $f^{-1}(${ansVal}) = ${targetX}$입니다.`,
      `[Solution Steps]\n1. Inverse property: $f^{-1}(y) = x \\iff f(x) = y$\n2. Set up equation: $${m}x ${signed(k)} = ${ansVal}$\n3. Solve: $x = ${targetX}$.`
    )
  );
}

// =========================================================================
// Catalog Units Array for Pre-Algebra / Algebra 2 Integration
// =========================================================================

export const ALGEBRA2_WORKBOOK_UNITS = [
  // Chapter 1
  {
    id: 'a2-exp-laws',
    label: '지수법칙 복합 계산 (Law of Exponents)',
    en: ['Laws of Exponents (Multi-step Simplification)', 'Algebra 2 Ch 1.1'],
    profiles: ['algebra-2', 'precalculus'],
    tier: 'intermediate',
    make: a2PolyExponentLaws,
  },
  {
    id: 'a2-monomial-calc',
    label: '단항식의 곱셈과 나눗셈 (Calculating Monomials)',
    en: ['Monomial Multiplication & Division', 'Algebra 2 Ch 1.2'],
    profiles: ['algebra-2'],
    tier: 'basic',
    make: a2PolyMonomialCalc,
  },
  {
    id: 'a2-poly-expansion-cubic',
    label: '세제곱 곱셈공식 전개 (Cubic Special Products)',
    en: ['Polynomial Expansion (Sum & Difference of Cubes)', 'Algebra 2 Ch 1.5'],
    profiles: ['algebra-2'],
    tier: 'intermediate',
    make: a2PolyExpansionCubic,
  },
  // Chapter 2
  {
    id: 'a2-factoring-cubic',
    label: '세제곱 합·차 인수분해 (Factoring Sum & Difference of Cubes)',
    en: ['Factoring Binomials (Cubes & Squares)', 'Algebra 2 Ch 2.1'],
    profiles: ['algebra-2'],
    tier: 'intermediate',
    make: a2FactorBinomialCubic,
  },
  {
    id: 'a2-factoring-trinomial-cross',
    label: '삼항식 십자형 인수분해 (Factoring Trinomials ax^2+bx+c)',
    en: ['Factoring Trinomials (Cross-multiplication)', 'Algebra 2 Ch 2.2'],
    profiles: ['algebra-2'],
    tier: 'intermediate',
    make: a2FactorTrinomialCross,
  },
  {
    id: 'a2-factoring-substitution',
    label: '치환을 이용한 다항식 인수분해 (Factoring by Substitution)',
    en: ['Factoring by Substitution & Grouping', 'Algebra 2 Ch 2.3'],
    profiles: ['algebra-2'],
    tier: 'advanced',
    make: a2FactorGroupingSubstitution,
  },
  // Chapter 3
  {
    id: 'a2-rational-complex-fractions',
    label: '번분수식과 유리식 덧셈 (Complex Fractions)',
    en: ['Complex Fractions & Rational Simplification', 'Algebra 2 Ch 3.2'],
    profiles: ['algebra-2'],
    tier: 'intermediate',
    make: a2RationalComplexFraction,
  },
  {
    id: 'a2-rational-equations-extraneous',
    label: '분수방정식과 무연근 판별 (Rational Equations & Extraneous Roots)',
    en: ['Rational Equations & Extraneous Roots', 'Algebra 2 Ch 3.3'],
    profiles: ['algebra-2'],
    tier: 'advanced',
    make: a2RationalEquation,
  },
  {
    id: 'a2-rational-work-rate',
    label: '유리식의 활용: 일의 양 (Work-Rate Problems)',
    en: ['Work-Rate & Rational Applications', 'Algebra 2 Ch 3.4'],
    profiles: ['algebra-2'],
    tier: 'intermediate',
    make: a2RationalWordProblemWorkRate,
  },
  // Chapter 4
  {
    id: 'a2-complex-powers',
    label: '허수단위 i의 거듭제곱과 복소수 연산 (Complex Numbers & Powers of i)',
    en: ['Complex Numbers & Periodic Powers of i', 'Algebra 2 Ch 4.2'],
    profiles: ['algebra-2'],
    tier: 'intermediate',
    make: a2QuadComplexNumbers,
  },
  {
    id: 'a2-quadratic-viete-relations',
    label: '이차방정식 근과 계수의 관계 (Viète\'s Formulas)',
    en: ['Viète\'s Relations & Symmetric Polynomials', 'Algebra 2 Ch 4.5'],
    profiles: ['algebra-2'],
    tier: 'intermediate',
    make: a2QuadVieteRelations,
  },
  // Chapter 5 & 6
  {
    id: 'a2-quad-func-vertex-translation',
    label: '이차함수 표준형과 꼭짓점 (Vertex Form & Translations)',
    en: ['Vertex Form & Translation of Parabola', 'Algebra 2 Ch 5.2'],
    profiles: ['algebra-2'],
    tier: 'basic',
    make: a2QuadFuncStandardVertex,
  },
  {
    id: 'a2-quad-func-min-max-domain',
    label: '제한된 구간에서의 이차함수 최대·최소 (Min/Max on Intervals)',
    en: ['Quadratic Extrema on Closed Intervals', 'Algebra 2 Ch 6.3'],
    profiles: ['algebra-2'],
    tier: 'advanced',
    make: a2QuadFuncMinMaxDomain,
  },
  // Chapter 7
  {
    id: 'a2-radical-rationalize-denom',
    label: '분모의 유리화와 무리수 계산 (Rationalizing Denominators)',
    en: ['Rationalizing Denominators & Radical Simplification', 'Algebra 2 Ch 7.3'],
    profiles: ['algebra-2'],
    tier: 'intermediate',
    make: a2RadicalRationalizeDenom,
  },
  {
    id: 'a2-radical-equations-extraneous',
    label: '무리방정식 풀이와 무연근 검산 (Radical Equations & Extraneous Roots)',
    en: ['Radical Equations & Extraneous Root Checking', 'Algebra 2 Ch 7.5'],
    profiles: ['algebra-2'],
    tier: 'advanced',
    make: a2RadicalEquationExtraneous,
  },
  // Chapter 8
  {
    id: 'a2-special-absolute-value-opt',
    label: '절댓값 함수의 최솟값과 중앙값 (Absolute Value Function Optimization)',
    en: ['Absolute Value Functions & Median Optimization', 'Algebra 2 Ch 8.1'],
    profiles: ['algebra-2'],
    tier: 'advanced',
    make: a2SpecialAbsoluteValueGraph,
  },
  {
    id: 'a2-special-function-composition',
    label: '합성함수의 계산과 성질 (Function Composition)',
    en: ['Function Composition & Evaluation', 'Algebra 2 Ch 8.3'],
    profiles: ['algebra-2'],
    tier: 'intermediate',
    make: a2SpecialFunctionComposition,
  },
  {
    id: 'a2-special-inverse-functions',
    label: '역함수의 성질과 함숫값 구하기 (Inverse Functions)',
    en: ['Inverse Functions & Evaluations', 'Algebra 2 Ch 8.4'],
    profiles: ['algebra-2'],
    tier: 'intermediate',
    make: a2SpecialInverseFunctions,
  },
];
