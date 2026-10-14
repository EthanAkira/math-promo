/**
 * 고1 전국연합 학력평가 기출 변형 문제 생성 엔진
 * (Grade 1 National Mock Exam Problem Generator)
 *
 * 지원 시험:
 * - 고1 전국연합 6월
 * - 고1 전국연합 9월
 * - 고1 전국연합 11월
 * - 고2 전국연합 3월 (고1 전범위)
 *
 * 핵심 15대 빈출 기출 알고리즘 유형:
 * 01. 다항식의 덧셈·뺄셈 및 전개식
 * 02. 곱셈공식의 변형과 직육면체 응용
 * 03. 항등식과 나머지정리
 * 04. 인수분해와 복잡한 식의 인수분해
 * 05. 복소수의 연산과 켤레복소수
 * 06. 이차방정식의 판별식과 근과 계수의 관계
 * 07. 이차함수의 그래프와 최대·최소
 * 08. 여러 가지 방정식 (연립방정식)
 * 09. 이차부등식과 연립부등식
 * 10. 평면좌표 (내분점·외분점·거리)
 * 11. 직선의 방정식과 점과 직선 사이의 거리
 * 12. 원의 방정식과 접선
 * 13. 집합의 연산과 명제의 참·거짓
 * 14. 합성함수와 역함수, 유리·무리함수
 * 15. 순열과 조합의 실생활 응용
 */

function pickRandom(arr, rng = Math.random) {
  return arr[Math.floor(rng() * arr.length)];
}

function randInt(min, max, rng = Math.random) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function randNonZero(min, max, rng = Math.random) {
  let val = 0;
  while (val === 0) {
    val = randInt(min, max, rng);
  }
  return val;
}

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

function buildChoices(correctVal, distractorFunc, rng = Math.random) {
  const choices = new Set([correctVal]);
  let safety = 0;
  while (choices.size < 5 && safety < 80) {
    safety++;
    const cand = distractorFunc(correctVal, rng);
    if (cand !== undefined && cand !== null && cand !== '') {
      choices.add(cand);
    }
  }
  const fallbackOffsets = [-2, -1, 1, 2, 3, 4, 5, -3];
  let offIdx = 0;
  while (choices.size < 5 && offIdx < fallbackOffsets.length) {
    if (typeof correctVal === 'number') {
      choices.add(correctVal + fallbackOffsets[offIdx]);
    } else {
      choices.add(`${correctVal} (${offIdx + 1})`);
    }
    offIdx++;
  }

  const arr = Array.from(choices);
  arr.sort(() => rng() - 0.5);
  const correctIdx = arr.indexOf(correctVal) + 1;
  return { choices: arr.map(v => String(v)), correctIdx };
}

export const GRADE1_MOCK_GENERATORS = {
  // 1. 다항식 연산
  'poly-ops': (rng = Math.random) => {
    const a = randInt(2, 4, rng);
    const b = randNonZero(-3, 3, rng);
    const c = randInt(1, 5, rng);
    const d = randInt(1, 3, rng);
    const e = randNonZero(-3, 3, rng);
    const f = randNonZero(-4, 4, rng);

    const signB = b >= 0 ? `+ ${b}xy` : `- ${Math.abs(b)}xy`;
    const signC = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`;
    const signE = e >= 0 ? `+ ${e}xy` : `- ${Math.abs(e)}xy`;
    const signF = f >= 0 ? `+ ${f}` : `- ${Math.abs(f)}`;

    const coeffX2 = a - d;
    const coeffXY = b - e;
    const constTerm = c - f;

    const termX2 = coeffX2 === 0 ? '' : (coeffX2 === 1 ? 'x^2' : (coeffX2 === -1 ? '-x^2' : `${coeffX2}x^2`));
    const termXY = coeffXY === 0 ? '' : (coeffXY > 0 ? (coeffXY === 1 ? '+ xy' : `+ ${coeffXY}xy`) : (coeffXY === -1 ? '- xy' : `- ${Math.abs(coeffXY)}xy`));
    const termC = constTerm === 0 ? '' : (constTerm > 0 ? `+ ${constTerm}` : `- ${Math.abs(constTerm)}`);

    let correctExpr = `${termX2} ${termXY} ${termC}`.trim();
    if (correctExpr.startsWith('+ ')) correctExpr = correctExpr.slice(2);
    if (!correctExpr) correctExpr = '0';

    const question = `두 다항식\n$$A = ${a}x^2 ${signB} ${signC}, \\quad B = ${d}x^2 ${signE} ${signF}$$\n에 대하여 $A - B$를 간단히 한 것은?`;

    const { choices, correctIdx } = buildChoices(
      `$${correctExpr}$`,
      (val, r) => {
        const offX = randInt(-1, 2, r);
        const offY = randInt(-2, 2, r);
        const offC = randInt(-2, 2, r);
        const rx = coeffX2 + offX;
        const ry = coeffXY + offY;
        const rc = constTerm + offC;
        const tx = rx === 0 ? '' : `${rx}x^2`;
        const ty = ry === 0 ? '' : (ry > 0 ? `+ ${ry}xy` : `- ${Math.abs(ry)}xy`);
        const tc = rc === 0 ? '' : (rc > 0 ? `+ ${rc}` : `- ${Math.abs(rc)}`);
        let expr = `${tx} ${ty} ${tc}`.trim();
        if (expr.startsWith('+ ')) expr = expr.slice(2);
        return `$${expr || '0'}$`;
      },
      rng
    );

    return {
      type: 'multiple_choice',
      subjectId: 'common-math-1',
      unitId: 'polynomial-ops',
      chapterName: '다항식의 연산과 인수분해',
      points: 2,
      tier: 'basic',
      question,
      choices,
      answer: String(correctIdx),
      correctAnswer: correctIdx,
      explanation: `동류항끼리 모아서 정리하면:\n$$A - B = (${a}x^2 ${signB} ${signC}) - (${d}x^2 ${signE} ${signF})$$\n$$= (${a} - ${d})x^2 + (${b} - (${e}))xy + (${c} - (${f})) = ${correctExpr}$$\n따라서 정답은 ${correctIdx}번입니다.`
    };
  },

  // 2. 곱셈공식 변형 (직육면체 모서리와 겉넓이)
  'cuboid-surface': (rng = Math.random) => {
    const a = randInt(2, 5, rng);
    const b = randInt(2, 5, rng);
    const c = randInt(2, 5, rng);

    const sumEdges = 4 * (a + b + c);
    const sumSq = a * a + b * b + c * c;
    const surfaceArea = 2 * (a * b + b * c + c * a);

    const question = `모든 모서리의 길이의 합이 $${sumEdges}$이고, 대각선의 길이가 $\\sqrt{${sumSq}}$인 직육면체의 겉넓이는?`;

    const { choices, correctIdx } = buildChoices(
      surfaceArea,
      (val, r) => val + randInt(-8, 8, r) * 2,
      rng
    );

    return {
      type: 'multiple_choice',
      subjectId: 'common-math-1',
      unitId: 'polynomial-ops',
      chapterName: '다항식의 연산과 인수분해',
      points: 3,
      tier: 'medium',
      question,
      choices: choices.map(c => `$${c}$`),
      answer: String(correctIdx),
      correctAnswer: correctIdx,
      explanation: `직육면체의 가로, 세로, 높이를 각각 $a, b, c$라 하면\n모든 모서리의 길이의 합이 $${sumEdges}$이므로 $4(a+b+c) = ${sumEdges} \\implies a+b+c = ${a+b+c}$\n대각선의 길이가 $\\sqrt{${sumSq}}$이므로 $a^2+b^2+c^2 = ${sumSq}$\n곱셈 공식의 변형에 의해:\n$$(a+b+c)^2 = a^2+b^2+c^2 + 2(ab+bc+ca)$$\n$$${(a+b+c)**2} = ${sumSq} + 2(ab+bc+ca)$$\n따라서 겉넓이 $2(ab+bc+ca) = ${(a+b+c)**2} - ${sumSq} = ${surfaceArea}$입니다.`
    };
  },

  // 3. 나머지정리와 인수정리
  'remainder-theorem': (rng = Math.random) => {
    const a = randInt(1, 3, rng);
    const k = randInt(1, 4, rng);
    const r = randInt(2, 9, rng);
    const q1 = randInt(1, 3, rng);
    const c = randInt(-5, 5, rng);

    // f(x) = x^3 + a*x^2 + b*x + c
    // f(k) = r
    // Let's ask: f(x)를 (x - k)로 나눈 나머지가 r일 때 b의 값 구하기
    const b = randInt(-4, 4, rng);
    const fAtK = k**3 + a*(k**2) + b*k + c;

    const question = `다항식 $f(x) = x^3 + ${a}x^2 + ax + ${c}$를 $x - ${k}$로 나눈 나머지가 $${fAtK}$일 때, 상수 $a$의 값은?`;

    // k^3 + a*k^2 + a*k + c = fAtK => a*(k^2 + k) = fAtK - k^3 - c
    const correctVal = a;

    const { choices, correctIdx } = buildChoices(
      correctVal,
      (val, r) => val + randInt(-3, 3, r),
      rng
    );

    return {
      type: 'multiple_choice',
      subjectId: 'common-math-1',
      unitId: 'polynomial-ops',
      chapterName: '다항식의 연산과 인수분해',
      points: 3,
      tier: 'medium',
      question,
      choices: choices.map(c => `$${c}$`),
      answer: String(correctIdx),
      correctAnswer: correctIdx,
      explanation: `나머지정리에 의하여 $f(${k}) = ${fAtK}$입니다.\n$$f(${k}) = ${k}^3 + a \\cdot ${k}^2 + a \\cdot ${k} + ${c} = ${k**3 + c} + ${k**2 + k}a = ${fAtK}$$\n$$${k**2 + k}a = ${fAtK - k**3 - c} \\implies a = ${correctVal}$$\n따라서 정답은 ${correctIdx}번입니다.`
    };
  },

  // 4. 복소수 연산과 켤레복소수
  'complex-numbers': (rng = Math.random) => {
    const a = randInt(1, 4, rng);
    const b = randInt(1, 4, rng);
    const z1 = `${a} + ${b}i`;
    const z2 = `${a} - ${b}i`;
    const ans = a*a + b*b;

    const question = `복소수 $z = ${a} + ${b}i$에 대하여 $z \\bar{z}$의 값은? (단, $i = \\sqrt{-1}$이고, $\\bar{z}$는 $z$의 켤레복소수이다.)`;

    const { choices, correctIdx } = buildChoices(
      ans,
      (val, r) => val + randInt(-6, 6, r),
      rng
    );

    return {
      type: 'multiple_choice',
      subjectId: 'common-math-1',
      unitId: 'equations-inequalities',
      chapterName: '복소수와 이차방정식',
      points: 2,
      tier: 'basic',
      question,
      choices: choices.map(c => `$${c}$`),
      answer: String(correctIdx),
      correctAnswer: correctIdx,
      explanation: `$\\bar{z} = ${a} - ${b}i$이므로\n$$z \\bar{z} = (${a} + ${b}i)(${a} - ${b}i) = ${a}^2 - (${b}i)^2 = ${a*a} - (-${b*b}) = ${ans}$$\n따라서 정답은 ${correctIdx}번입니다.`
    };
  },

  // 5. 이차방정식 근과 계수의 관계
  'quad-roots': (rng = Math.random) => {
    const p = randNonZero(-5, 5, rng);
    const q = randNonZero(-6, 6, rng);

    // x^2 - p*x + q = 0 => alpha + beta = p, alpha * beta = q
    // Find alpha^2 + beta^2 = p^2 - 2q
    const correctVal = p * p - 2 * q;

    const signP = -p >= 0 ? `+ ${-p}` : `- ${p}`;
    const signQ = q >= 0 ? `+ ${q}` : `- ${Math.abs(q)}`;

    const question = `이차방정식 $x^2 ${signP}x ${signQ} = 0$의 두 근을 $\\alpha, \\beta$라 할 때, $\\alpha^2 + \\beta^2$의 값은?`;

    const { choices, correctIdx } = buildChoices(
      correctVal,
      (val, r) => val + randInt(-8, 8, r),
      rng
    );

    return {
      type: 'multiple_choice',
      subjectId: 'common-math-1',
      unitId: 'equations-inequalities',
      chapterName: '방정식과 부등식',
      points: 3,
      tier: 'medium',
      question,
      choices: choices.map(c => `$${c}$`),
      answer: String(correctIdx),
      correctAnswer: correctIdx,
      explanation: `근과 계수의 관계에 의하여:\n$$\\alpha + \\beta = ${p}, \\quad \\alpha\\beta = ${q}$$\n곱셈 공식의 변형에 의하여:\n$$\\alpha^2 + \\beta^2 = (\\alpha + \\beta)^2 - 2\\alpha\\beta = (${p})^2 - 2(${q}) = ${p*p} - (${2*q}) = ${correctVal}$$\n따라서 정답은 ${correctIdx}번입니다.`
    };
  },

  // 6. 이차함수의 최대·최소
  'quad-max-min': (rng = Math.random) => {
    const h = randInt(1, 4, rng);
    const k = randInt(-3, 6, rng);
    const a = randInt(1, 2, rng);

    // f(x) = a*(x-h)^2 + k on [0, h+2]
    // Minimum at x=h is k
    // Maximum at x=h+2 or x=0
    const f0 = a * (0 - h)**2 + k;
    const fEnd = a * (h + 2 - h)**2 + k;
    const maxVal = Math.max(f0, fEnd);
    const minVal = k;
    const sumVal = maxVal + minVal;

    const bTerm = -2 * a * h;
    const cTerm = a * h * h + k;
    const signB = bTerm >= 0 ? `+ ${bTerm}` : `- ${Math.abs(bTerm)}`;
    const signC = cTerm >= 0 ? `+ ${cTerm}` : `- ${Math.abs(cTerm)}`;

    const question = `닫힌구간 $[0, ${h + 2}]$에서 이차함수 $f(x) = ${a === 1 ? '' : a}x^2 ${signB}x ${signC}$의 최댓값을 $M$, 최솟값을 $m$이라 할 때, $M + m$의 값은?`;

    const { choices, correctIdx } = buildChoices(
      sumVal,
      (val, r) => val + randInt(-6, 6, r),
      rng
    );

    return {
      type: 'multiple_choice',
      subjectId: 'common-math-1',
      unitId: 'equations-inequalities',
      chapterName: '방정식과 부등식',
      points: 3,
      tier: 'medium',
      question,
      choices: choices.map(c => `$${c}$`),
      answer: String(correctIdx),
      correctAnswer: correctIdx,
      explanation: `이차함수를 표준형으로 변형하면:\n$$f(x) = ${a === 1 ? '' : a}(x - ${h})^2 + ${k}$$\n꼭짓점의 좌표는 $(${h}, ${k})$이며, $x = ${h}$는 구간 $[0, ${h + 2}]$에 포함됩니다.\n- 최솟값 $m = f(${h}) = ${minVal}$\n- 경곗값: $f(0) = ${f0}$, $f(${h + 2}) = ${fEnd}$\n따라서 최댓값 $M = ${maxVal}$이므로\n$$M + m = ${maxVal} + (${minVal}) = ${sumVal}$$\n따라서 정답은 ${correctIdx}번입니다.`
    };
  },

  // 7. 평면좌표 선분의 내분점
  'coord-section': (rng = Math.random) => {
    const x1 = randInt(-4, 2, rng);
    const y1 = randInt(-3, 4, rng);
    const m = randInt(1, 3, rng);
    const n = randInt(1, 3, rng);
    const mult = randInt(1, 3, rng);

    // Let P = (px, py)
    const px = randInt(-2, 5, rng);
    const py = randInt(-2, 5, rng);

    // P = (m*x2 + n*x1)/(m+n) => m*x2 = (m+n)*px - n*x1
    const x2 = ((m + n) * px - n * x1) / m;
    const y2 = ((m + n) * py - n * y1) / m;

    if (!Number.isInteger(x2) || !Number.isInteger(y2)) {
      return GRADE1_MOCK_GENERATORS['coord-section'](rng);
    }

    const correctAns = px + py;

    const question = `좌표평면 위의 두 점 $A(${x1}, ${y1})$, $B(${x2}, ${y2})$를 $${m} : ${n}$으로 내분하는 점 $P$의 좌표가 $(a, b)$일 때, $a + b$의 값은?`;

    const { choices, correctIdx } = buildChoices(
      correctAns,
      (val, r) => val + randInt(-4, 4, r),
      rng
    );

    return {
      type: 'multiple_choice',
      subjectId: 'common-math-1',
      unitId: 'coordinate-geometry-equations',
      chapterName: '도형의 방정식',
      points: 2,
      tier: 'basic',
      question,
      choices: choices.map(c => `$${c}$`),
      answer: String(correctIdx),
      correctAnswer: correctIdx,
      explanation: `내분점 공식에 의하여 점 $P(a, b)$의 좌표는:\n$$a = \\frac{${m} \\times (${x2}) + ${n} \\times (${x1})}{${m} + ${n}} = \\frac{${m * x2 + n * x1}}{${m + n}} = ${px}$$\n$$b = \\frac{${m} \\times (${y2}) + ${n} \\times (${y1})}{${m} + ${n}} = \\frac{${m * y2 + n * y1}}{${m + n}} = ${py}$$\n따라서 $a + b = ${px} + (${py}) = ${correctAns}$입니다.`
    };
  },

  // 8. 직선의 방정식과 점과 직선 사이의 거리
  'line-dist': (rng = Math.random) => {
    // 3x + 4y + c = 0, point (x0, y0), distance d = |3x0 + 4y0 + c| / 5
    const a = 3;
    const b = 4;
    const x0 = randInt(-2, 4, rng);
    const y0 = randInt(-2, 4, rng);
    const dist = randInt(1, 5, rng);

    // |3*x0 + 4*y0 + c| = 5 * dist
    const valInside = 3 * x0 + 4 * y0;
    const c1 = 5 * dist - valInside;
    const c2 = -5 * dist - valInside;
    const c = randInt(0, 1, rng) === 0 ? c1 : c2;

    const signC = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`;
    const question = `점 $(${x0}, ${y0})$과 직선 $3x + 4y ${signC} = 0$ 사이의 거리는?`;

    const { choices, correctIdx } = buildChoices(
      dist,
      (val, r) => Math.max(1, val + randInt(-3, 3, r)),
      rng
    );

    return {
      type: 'multiple_choice',
      subjectId: 'common-math-1',
      unitId: 'coordinate-geometry-equations',
      chapterName: '도형의 방정식',
      points: 3,
      tier: 'medium',
      question,
      choices: choices.map(c => `$${c}$`),
      answer: String(correctIdx),
      correctAnswer: correctIdx,
      explanation: `점과 직선 사이의 거리 공식에 의하여:\n$$d = \\frac{|3(${x0}) + 4(${y0}) ${signC}|}{\\sqrt{3^2 + 4^2}} = \\frac{|${3*x0 + 4*y0 + c}|}{5} = \\frac{${Math.abs(3*x0 + 4*y0 + c)}}{5} = ${dist}$$\n따라서 정답은 ${correctIdx}번입니다.`
    };
  },

  // 9. 원의 방정식과 중심/반지름
  'circle-eq': (rng = Math.random) => {
    const a = randInt(-3, 4, rng);
    const b = randInt(-3, 4, rng);
    const r = randInt(2, 6, rng);
    const r2 = r * r;

    // x^2 + y^2 - 2ax - 2by + a^2 + b^2 - r^2 = 0
    const A = -2 * a;
    const B = -2 * b;
    const C = a * a + b * b - r2;
    const signA = A >= 0 ? `+ ${A}x` : `- ${Math.abs(A)}x`;
    const signB = B >= 0 ? `+ ${B}y` : `- ${Math.abs(B)}y`;
    const signC = C >= 0 ? `+ ${C}` : `- ${Math.abs(C)}`;
    const termA = A !== 0 ? signA : '';
    const termB = B !== 0 ? signB : '';

    const question = `원 $x^2 + y^2 ${termA} ${termB} ${signC} = 0$의 중심의 좌표를 $(p, q)$, 반지름의 길이를 $R$이라 할 때, $p + q + R$의 값은?`;

    const ans = a + b + r;

    const { choices, correctIdx } = buildChoices(
      ans,
      (val, rand) => val + randInt(-4, 4, rand),
      rng
    );

    return {
      type: 'multiple_choice',
      subjectId: 'common-math-1',
      unitId: 'coordinate-geometry-equations',
      chapterName: '도형의 방정식',
      points: 3,
      tier: 'medium',
      question,
      choices: choices.map(c => `$${c}$`),
      answer: String(correctIdx),
      correctAnswer: correctIdx,
      explanation: `주어진 원의 방정식을 표준형으로 변형하면:\n$$(x - ${a})^2 + (y - ${b})^2 = ${r2} = ${r}^2$$\n따라서 중심 $(p, q) = (${a}, ${b})$, 반지름 $R = ${r}$이므로\n$$p + q + R = ${a} + (${b}) + ${r} = ${ans}$$\n따라서 정답은 ${correctIdx}번입니다.`
    };
  },

  // 10. 합성함수와 역함수
  'functions-composite': (rng = Math.random) => {
    const a = randInt(2, 4, rng);
    const b = randInt(-3, 5, rng);
    const c = randInt(1, 3, rng);
    const d = randInt(-4, 4, rng);
    const xVal = randInt(1, 4, rng);

    // f(x) = ax + b, g(x) = cx + d
    // (f \circ g)(xVal) = f(c*xVal + d) = a*(c*xVal + d) + b
    const gVal = c * xVal + d;
    const fogVal = a * gVal + b;

    const signB = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
    const signD = d >= 0 ? `+ ${d}` : `- ${Math.abs(d)}`;

    const question = `두 일차함수 $f(x) = ${a}x ${signB}$, $g(x) = ${c}x ${signD}$에 대하여 $(f \\circ g)(${xVal})$의 값은?`;

    const { choices, correctIdx } = buildChoices(
      fogVal,
      (val, r) => val + randInt(-6, 6, r),
      rng
    );

    return {
      type: 'multiple_choice',
      subjectId: 'common-math-2',
      unitId: 'functions-graphs',
      chapterName: '함수와 그래프',
      points: 2,
      tier: 'basic',
      question,
      choices: choices.map(c => `$${c}$`),
      answer: String(correctIdx),
      correctAnswer: correctIdx,
      explanation: `합성함수의 정의에 의하여:\n$$g(${xVal}) = ${c} \\times ${xVal} ${signD} = ${gVal}$$\n$$(f \\circ g)(${xVal}) = f(g(${xVal})) = f(${gVal}) = ${a} \\times ${gVal} ${signB} = ${fogVal}$$\n따라서 정답은 ${correctIdx}번입니다.`
    };
  },

  // 11. 순열과 조합
  'perm-comb': (rng = Math.random) => {
    const n = randInt(5, 8, rng);
    const r = randInt(2, 3, rng);

    // Combination n C r
    let num = 1;
    let den = 1;
    for (let i = 0; i < r; i++) {
      num *= (n - i);
      den *= (i + 1);
    }
    const nCr = num / den;

    const question = `어느 동아리 회원 $${n}$명 중에서 대표 $${r}$명을 선출하는 경우의 수는?`;

    const { choices, correctIdx } = buildChoices(
      nCr,
      (val, rand) => val + randInt(-6, 6, rand) * 2,
      rng
    );

    return {
      type: 'multiple_choice',
      subjectId: 'common-math-2',
      unitId: 'permutations-combinations',
      chapterName: '순열과 조합',
      points: 3,
      tier: 'medium',
      question,
      choices: choices.map(c => `$${c}$`),
      answer: String(correctIdx),
      correctAnswer: correctIdx,
      explanation: `서로 다른 $${n}$명 중 순서에 상관없이 $${r}$명을 택하는 조합의 수이므로:\n$$_nC_r = _{${n}}C_{${r}} = \\frac{${n}!}{(n - ${r})! \\times ${r}!} = ${nCr}$$\n따라서 정답은 ${correctIdx}번입니다.`
    };
  }
};

/**
 * Generates a variation problem for a given catalog item.
 */
export function generateVariationForGrade1Mock(problemItem, rng = Math.random) {
  const uId = problemItem.unitId || 'polynomial-ops';
  
  if (uId === 'permutations-combinations') {
    return GRADE1_MOCK_GENERATORS['perm-comb'](rng);
  }
  if (uId === 'functions-graphs') {
    return GRADE1_MOCK_GENERATORS['functions-composite'](rng);
  }
  if (uId === 'coordinate-geometry-equations') {
    const genKey = pickRandom(['coord-section', 'line-dist', 'circle-eq'], rng);
    return GRADE1_MOCK_GENERATORS[genKey](rng);
  }
  if (uId === 'equations-inequalities') {
    const genKey = pickRandom(['complex-numbers', 'quad-roots', 'quad-max-min'], rng);
    return GRADE1_MOCK_GENERATORS[genKey](rng);
  }
  
  // Default polynomial ops
  const genKey = pickRandom(['poly-ops', 'cuboid-surface', 'remainder-theorem'], rng);
  return GRADE1_MOCK_GENERATORS[genKey](rng);
}

/**
 * Random generator by session key
 */
export function getRandomGrade1NationalMockProblem(sessionKey = 'all', rng = Math.random) {
  const allKeys = Object.keys(GRADE1_MOCK_GENERATORS);
  const chosenKey = pickRandom(allKeys, rng);
  const prob = GRADE1_MOCK_GENERATORS[chosenKey](rng);
  return {
    ...prob,
    sessionKey,
    examType: 'grade1-national-mock-variation'
  };
}
