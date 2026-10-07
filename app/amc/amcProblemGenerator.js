/**
 * AMC 8 Algorithmic Similar Problem Generator Engine
 * 
 * Based on the curriculum and problem patterns of:
 * - "AMC 8 Preparation (Volume 1)" by mymathcounts.com:
 *     Chapter 1: Perimeter and Area
 *     Chapter 2: Patterns
 *     Chapter 3: Logical Reasoning
 *     Chapter 4: Operations with Fractions
 *     Chapter 5: Even and Odd
 *     Chapter 6: Word Problems related to Percentage
 * - "AMC 8 Preparation (Volume 2)" by mymathcounts.com:
 *     Chapter 7: Transformations
 *     Chapter 8: Consecutive Integers
 *     Chapter 9: Operations with Decimals
 *     Chapter 10: Sets and Venn Diagrams
 *     Chapter 11: Counting Techniques
 *     Chapter 12: Divisibility
 * - "AMC 8 Preparation (Volume 3)" by mymathcounts.com:
 *     Chapter 13: Geometric Visualization
 *     Chapter 14: Factors
 *     Chapter 15: Prime Numbers
 *     Chapter 16: Ratio, Rate and Proportion
 *     Chapter 17: Least Common Multiple and Greatest Common Factor
 *     Chapter 18: Solving Equations
 * - "AMC 8 Preparation (Volume 4)" by mymathcounts.com:
 *     Chapter 19: Special Symbols and Operations
 *     Chapter 20: Remainder
 *     Chapter 21: Sequences and Series
 *     Chapter 22: Functions
 *     Chapter 23: Pythagorean Theorem and Triangles
 *     Chapter 24: Probability
 * - "AMC 8 Preparation (Volume 5)" by mymathcounts.com:
 *     Chapter 25: Angles and Triangles
 *     Chapter 26: Rectangles and Squares
 *     Chapter 27: Similar Triangles
 *     Chapter 28: Trapezoids
 *     Chapter 29: Circles
 *     Chapter 30: Volumes
 * - And standard AMC 8 past competition topics (Geometry, Number Theory, Algebra, Combinatorics, Probability).
 */

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

function comb(n, k) {
  if (k < 0 || k > n) return 0;
  let result = 1;
  for (let i = 0; i < k; i += 1) {
    result = (result * (n - i)) / (i + 1);
  }
  return Math.round(result);
}

/**
 * Helper to build 5 unique choices given the correct answer and distractor generator
 */
function buildChoices(correctVal, distractorFunc) {
  const choices = new Set([correctVal]);
  let safety = 0;
  while (choices.size < 5 && safety < 50) {
    safety += 1;
    const distractor = distractorFunc(safety);
    if (distractor !== undefined && distractor !== null && distractor !== '') {
      choices.add(distractor);
    }
  }
  // Fallbacks if not enough
  let bump = 1;
  while (choices.size < 5) {
    if (typeof correctVal === 'number') {
      choices.add(correctVal + bump);
      if (choices.size < 5 && correctVal - bump > 0) choices.add(correctVal - bump);
    } else {
      choices.add(`${correctVal} + ${bump}`);
    }
    bump += 1;
  }
  const arr = Array.from(choices);
  // Shuffle
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const correctIdx = arr.indexOf(correctVal);
  return { choices: arr.map(String), correctIdx };
}

// =========================================================================
// UNIT GENERATORS
// =========================================================================

export const GENERATORS = {
  // -----------------------------------------------------------------------
  // 1. AREA & PERIMETER (Ch 1: Perimeter and Area)
  // -----------------------------------------------------------------------
  'area-perimeter': (lang) => {
    const variant = pickRandom(['four-rectangles', 'cut-corner-perimeter', 'shaded-ring', 'trapezoid-midsegment-area']);

    if (variant === 'trapezoid-midsegment-area') {
      // AMC 8 Prep Vol. 5 Ch.28 Trapezoids: Midsegment and Area Formula
      const a = randInt(2, 8) * 2;
      const b = a + randInt(2, 6) * 2;
      const m = (a + b) / 2;
      const h = randInt(4, 12);
      const correctAns = m * h;

      const { choices, correctIdx } = buildChoices(correctAns, (i) => {
        if (i === 1) return (a + b) * h; // forgot dividing by 2
        if (i === 2) return m * (h + 1);
        if (i === 3) return Math.round((a * b * h) / (a + b));
        return Math.max(1, correctAns + (i % 2 === 0 ? 6 : -6));
      });

      const question = lang === 'ko'
        ? `사다리꼴 $ABCD$에서 윗변 $AB$의 길이는 $${a}$, 아랫변 $CD$의 길이는 $${b}$이고, 두 밑변 사이의 높이는 $${h}$입니다. 두 빗변의 중점을 연결한 중점연결선(Midsegment)의 길이가 $m = ${m}$일 때, 이 사다리꼴의 넓이를 구하세요.`
        : `In trapezoid $ABCD$, base $AB$ has length $${a}$, base $CD$ has length $${b}$, and the height is $${h}$. If the midsegment connecting the midpoints of the non-parallel legs has length $m = ${m}$, find the area of the trapezoid.`;

      const explanation = lang === 'ko'
        ? `**[AMC 8 Prep Vol. 5 Ch.28 사다리꼴의 중점연결선과 넓이 공식]**\n\n사다리꼴의 중점연결선(중선, Midsegment)의 길이는 두 밑변 길이의 평균입니다:\n\n$$m = \\frac{a + b}{2} = \\frac{${a} + ${b}}{2} = ${m}$$\n\n사다리꼴의 넓이는 (중점연결선의 길이) $\\times$ (높이)로 직접 계산할 수 있습니다:\n\n$$\\text{Area} = \\frac{a + b}{2} \\times h = m \\times h = ${m} \\times ${h} = ${correctAns}$$\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} (${correctAns})** 입니다.`
        : `**[AMC 8 Prep Vol. 5 Ch.28 Trapezoid Midsegment and Area Formula]**\n\nThe midsegment of a trapezoid is the average of its parallel bases:\n\n$$m = \\frac{a + b}{2} = \\frac{${a} + ${b}}{2} = ${m}$$\n\nThe area of the trapezoid equals the midsegment times the height:\n\n$$\\text{Area} = m \\times h = ${m} \\times ${h} = ${correctAns}$$\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${correctAns})**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'four-rectangles') {
      // AMC 12 / AMC 8 Vol 1 Example 6:
      // Rectangle partitioned into 4 rectangles by two parallel segments.
      // Area a, b, c, d where a * d = b * c => d = (b * c) / a.
      const w1 = randInt(2, 6);
      const w2 = randInt(3, 7);
      const h1 = randInt(2, 5);
      const h2 = randInt(3, 8);
      const a = w1 * h1;
      const b = w2 * h1;
      const c = w1 * h2;
      const correctD = w2 * h2;

      const { choices, correctIdx } = buildChoices(correctD, (i) => {
        if (i === 1) return b + c - a;
        if (i === 2) return Math.round((b * c) / (a + 1));
        if (i === 3) return correctD + randInt(2, 6);
        return Math.max(1, correctD - randInt(2, 6));
      });

      const question = lang === 'ko'
        ? `직사각형이 가로와 세로에 평행한 두 선분에 의해 4개의 작은 직사각형으로 나누어졌습니다. 이 중 3개의 직사각형의 넓이가 각각 $${a}$, $${b}$, $${c}$일 때, 나머지 네 번째 직사각형의 넓이는 얼마입니까? (단, $${a}$와 $${b}$는 같은 행에 위치하고, $${a}$와 $${c}$는 같은 열에 위치합니다.)`
        : `A large rectangle is partitioned into four smaller rectangles by two lines parallel to its sides. Three of the resulting rectangles have areas $${a}$, $${b}$, and $${c}$, where the rectangles of area $${a}$ and $${b}$ share a row, and $${a}$ and $${c}$ share a column. What is the area of the fourth rectangle?`;

      const explanation = lang === 'ko'
        ? `**[AMC 8 Prep Vol. 1 Ch.1 핵심 공식: 직사각형 분할 성질]**\n\n두 직사각형이 같은 높이를 가질 때 넓이는 밑변의 길이에 비례합니다. 네 직사각형의 넓이를 좌상단 $A=${a}$, 우상단 $B=${b}$, 좌하단 $C=${c}$, 우하단 $D$라 두면 대각선 넓이의 곱이 서로 같습니다:\n\n$$A \\times D = B \\times C$$\n\n따라서\n\n$$${a} \\times D = ${b} \\times ${c} = ${b * c}$$\n\n$$D = \\frac{${b * c}}{${a}} = ${correctD}$$\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} ($${correctD}$)** 입니다.`
        : `**[AMC 8 Prep Vol. 1 Ch.1 Key Theorem: Partitioned Rectangle Property]**\n\nWhen a rectangle is split into four smaller rectangles by segments parallel to its edges, opposite diagonal areas have equal products:\n\n$$A \\times D = B \\times C$$\n\nSubstituting the given areas $A=${a}$, $B=${b}$, $C=${c}$:\n\n$$${a} \\times D = ${b} \\times ${c} = ${b * c} \\implies D = \\frac{${b * c}}{${a}} = ${correctD}$$\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${correctD})**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'cut-corner-perimeter') {
      // AMC 8 Prep Vol 1 Example 9:
      // Rectangle cut corner perimeter invariant
      const W = randInt(12, 25);
      const H = randInt(8, 18);
      const cutW = randInt(2, Math.floor(W / 2));
      const cutH = randInt(2, Math.floor(H / 2));
      const correctP = 2 * (W + H);

      const { choices, correctIdx } = buildChoices(correctP, (i) => {
        if (i === 1) return 2 * (W + H) - 2 * (cutW + cutH);
        if (i === 2) return 2 * (W + H) - (cutW + cutH);
        if (i === 3) return 2 * (W + H) + 2 * cutW;
        return correctP + randInt(2, 8);
      });

      const question = lang === 'ko'
        ? `가로 길이가 $${W}\\text{ cm}$, 세로 길이가 $${H}\\text{ cm}$인 직사각형의 한 모퉁이에서 가로 $${cutW}\\text{ cm}$, 세로 $${cutH}\\text{ cm}$인 직사각형 모양을 잘라냈습니다. 이렇게 만들어진 새로운 다각형의 둘레의 길이는 몇 $\\text{cm}$입니까?`
        : `A rectangle has width $${W}\\text{ cm}$ and height $${H}\\text{ cm}$. A smaller rectangle measuring $${cutW}\\text{ cm}$ by $${cutH}\\text{ cm}$ is cut out from one of its four corners. What is the perimeter, in centimeters, of the resulting polygon?`;

      const explanation = lang === 'ko'
        ? `**[AMC 8 Prep Vol. 1 Ch.1 모퉁이 절단 도형의 둘레 불변성]**\n\n모퉁이에서 잘려나간 두 변을 각각 바깥쪽 테두리로 평행이동하면 원래 직사각형의 둘레와 정확히 일치합니다.\n\n따라서 잘라낸 후 도형의 둘레는 원래 직사각형의 둘레와 같습니다:\n\n$$P = 2(W + H) = 2(${W} + ${H}) = 2 \\times ${W + H} = ${correctP}\\text{ cm}$$\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} ($${correctP}\\text{ cm}$)** 입니다.`
        : `**[AMC 8 Prep Vol. 1 Ch.1 Perimeter Invariance Under Corner Cut]**\n\nTranslating the two interior cut edges outward reconstitutes the original rectangle's boundary. Hence the perimeter is unchanged:\n\n$$P = 2(W + H) = 2(${W} + ${H}) = ${correctP}\\text{ cm}$$\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${correctP})**.`;

      return { question, choices, correctIdx, explanation };
    }

    // Shaded region between square and circle
    const r = randInt(3, 8);
    const side = 2 * r;
    const squareArea = side * side;
    const correctChoiceStr = `$${squareArea} - ${r * r}\\pi$`;

    const { choices, correctIdx } = buildChoices(correctChoiceStr, (i) => {
      if (i === 1) return `$${squareArea} - ${2 * r}\\pi$`;
      if (i === 2) return `$${squareArea / 2} - ${r * r}\\pi$`;
      if (i === 3) return `$${side} - ${r}\\pi$`;
      return `$${squareArea} - ${r * r * 2}\\pi$`;
    });

    const question = lang === 'ko'
      ? `한 변의 길이가 $${side}\\text{ cm}$인 정사각형 내부에 접하는 원이 있습니다. 정사각형의 내부에서 원의 외부를 제외한 색칠된 부분의 넓이는 얼마입니까?`
      : `A circle is inscribed in a square of side length $${side}\\text{ cm}$. What is the area of the region inside the square but outside the circle?`;

    const explanation = lang === 'ko'
      ? `**[AMC 8 Prep Vol. 1 Ch.1 원과 사각형의 차 영역]**\n\n정사각형의 넓이는 $S_{square} = ${side}^2 = ${squareArea}$ 입니다.\n\n원에 내접하는 반지름은 $r = \\frac{${side}}{2} = ${r}$ 이므로 원의 넓이는 $S_{circle} = \\pi r^2 = ${r * r}\\pi$ 입니다.\n\n따라서 색칠된 영역의 넓이는:\n\n$$S = ${squareArea} - ${r * r}\\pi$$\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} ($${squareArea} - ${r * r}\\pi$)** 입니다.`
      : `**[AMC 8 Prep Vol. 1 Ch.1 Inscribed Circle & Square Area Difference]**\n\nThe square has area $${side}^2 = ${squareArea}$. The inscribed circle has radius $r = ${r}$, so its area is $\\pi(${r})^2 = ${r * r}\\pi$.\n\nThe difference is $${squareArea} - ${r * r}\\pi$.\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]}**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // 2. TRIANGLES (Vol 1 Ch 1, Vol 4 Ch 23 & Vol 5 Ch 27)
  // -----------------------------------------------------------------------
  'triangles': (lang) => {
    const variant = pickRandom(['pythagorean-triple-area', 'inscribed-circle-radius', 'similar-triangles-parallel']);

    if (variant === 'similar-triangles-parallel') {
      // AMC 8 Prep Vol. 5 Ch.27: Similar Triangles - Parallel Segment Area Ratio
      const data = pickRandom([
        { m: 2, n: 1, sADE: 16, sTrap: 20 },
        { m: 1, n: 2, sADE: 5, sTrap: 40 },
        { m: 3, n: 2, sADE: 18, sTrap: 32 },
        { m: 2, n: 3, sADE: 12, sTrap: 63 },
        { m: 3, n: 1, sADE: 27, sTrap: 21 },
        { m: 1, n: 1, sADE: 10, sTrap: 30 },
      ]);
      const { m, n, sADE, sTrap } = data;
      const totalRatio = m + n;
      const mSq = m * m;
      const totSq = totalRatio * totalRatio;
      const trapParts = totSq - mSq;
      const totalArea = sADE + sTrap;

      const { choices, correctIdx } = buildChoices(sTrap, (i) => {
        if (i === 1) return totalArea;
        if (i === 2) return Math.round(sADE * (n / m));
        if (i === 3) return sTrap + 5;
        return Math.max(1, sTrap - 5);
      });

      const question = lang === 'ko'
        ? `삼각형 $ABC$의 변 $AB$ 위의 점 $D$와 변 $AC$ 위의 점 $E$를 잇는 선분 $DE$가 밑변 $BC$와 평행합니다. $AD : DB = ${m} : ${n}$이고 삼각형 $ADE$의 넓이가 $${sADE}$일 때, 사다리꼴 $DBCE$의 넓이는 얼마입니까?`
        : `In triangle $ABC$, segment $DE$ is parallel to $BC$, with $D$ on $AB$ and $E$ on $AC$. If $AD : DB = ${m} : ${n}$ and the area of triangle $ADE$ is $${sADE}$, what is the area of trapezoid $DBCE$?`;

      const explanation = lang === 'ko'
        ? `**[AMC 8 Prep Vol. 5 Ch.27 삼각형의 닮음과 넓이의 비]**\n\n$DE \\parallel BC$이므로 $\\triangle ADE \\sim \\triangle ABC$ (AA 닮음)입니다.\n\n닮음비는 대응변의 길이의 비이므로:\n\n$$\\frac{AD}{AB} = \\frac{${m}}{${m} + ${n}} = \\frac{${m}}{${totalRatio}}$$\n\n닮은 두 도형의 넓이의 비는 닮음비의 제곱에 비례합니다:\n\n$$\\frac{S_{\\triangle ADE}}{S_{\\triangle ABC}} = \\left(\\frac{${m}}{${totalRatio}}\\right)^2 = \\frac{${mSq}}{${totSq}}$$\n\n따라서 $\\triangle ABC$의 넓이는:\n\n$$S_{\\triangle ABC} = ${sADE} \\times \\frac{${totSq}}{${mSq}} = ${totalArea}$$\n\n사다리꼴 $DBCE$의 넓이는 전체 삼각형에서 위쪽 삼각형의 넓이를 뺀 것입니다:\n\n$$S_{DBCE} = S_{\\triangle ABC} - S_{\\triangle ADE} = ${totalArea} - ${sADE} = ${sTrap}$$\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} (${sTrap})** 입니다.`
        : `**[AMC 8 Prep Vol. 5 Ch.27 Similar Triangles: Area Ratio Principle]**\n\nSince $DE \\parallel BC$, $\\triangle ADE \\sim \\triangle ABC$ by AA similarity.\n\nThe ratio of similitude is:\n\n$$\\frac{AD}{AB} = \\frac{${m}}{${m} + ${n}} = \\frac{${m}}{${totalRatio}}$$\n\nThe ratio of their areas is the square of the ratio of similitude:\n\n$$\\frac{\\text{Area}(\\triangle ADE)}{\\text{Area}(\\triangle ABC)} = \\left(\\frac{${m}}{${totalRatio}}\\right)^2 = \\frac{${mSq}}{${totSq}}$$\n\nThus, $\\text{Area}(\\triangle ABC) = ${sADE} \\times \\frac{${totSq}}{${mSq}} = ${totalArea}$.\n\nThe area of trapezoid $DBCE$ is the difference:\n\n$$\\text{Area}(DBCE) = ${totalArea} - ${sADE} = ${sTrap}$$\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${sTrap})**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'inscribed-circle-radius') {
      // AMC 8 Prep Vol. 4 Ch.23: Inradius of right triangle r = (a + b - c) / 2
      const triple = pickRandom([
        [6, 8, 10, 2],
        [5, 12, 13, 2],
        [9, 12, 15, 3],
        [8, 15, 17, 3],
        [7, 24, 25, 3],
        [10, 24, 26, 4],
        [12, 16, 20, 4],
        [15, 20, 25, 5],
      ]);
      const [a, b, c, r] = triple;
      const askType = pickRandom(['radius', 'area']);

      if (askType === 'area') {
        const circleAreaStr = `$${r * r}\\pi$`;
        const { choices, correctIdx } = buildChoices(circleAreaStr, (i) => {
          if (i === 1) return `$${2 * r}\\pi$`;
          if (i === 2) return `$${r * r * 2}\\pi$`;
          if (i === 3) return `$${(r + 1) * (r + 1)}\\pi$`;
          return `$${Math.max(1, r - 1) * Math.max(1, r - 1)}\\pi$`;
        });

        const question = lang === 'ko'
          ? `세 변의 길이가 각각 $${a}\\text{ cm}$, $${b}\\text{ cm}$, $${c}\\text{ cm}$인 직각삼각형의 내접원의 넓이는 몇 $\\text{cm}^2$입니까?`
          : `A right triangle has side lengths $${a}\\text{ cm}$, $${b}\\text{ cm}$, and $${c}\\text{ cm}$. What is the area of its inscribed circle in square centimeters?`;

        const explanation = lang === 'ko'
          ? `**[AMC 8 Prep Vol. 4 Ch.23 직각삼각형과 내접원의 반지름]**\n\n직각삼각형의 두 직각변을 $a, b$, 빗변을 $c$라 할 때, 내접원의 반지름 $r$은 다음 공식으로 구합니다:\n\n$$r = \\frac{a + b - c}{2} = \\frac{${a} + ${b} - ${c}}{2} = \\frac{${a + b - c}}{2} = ${r}\\text{ cm}$$\n\n따라서 내접원의 넓이는:\n\n$$S = \\pi r^2 = \\pi (${r})^2 = ${r * r}\\pi\\text{ cm}^2$$\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} ($${r * r}\\pi\\text{ cm}^2$)** 입니다.`
          : `**[AMC 8 Prep Vol. 4 Ch.23 Inradius of a Right Triangle]**\n\nFor a right triangle with legs $a, b$ and hypotenuse $c$, the inradius $r$ is:\n\n$$r = \\frac{a + b - c}{2} = \\frac{${a} + ${b} - ${c}}{2} = ${r}\\text{ cm}$$\n\nThe area of the inscribed circle is:\n\n$$S = \\pi r^2 = ${r * r}\\pi\\text{ cm}^2$$\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${r * r}\\pi)**.`;

        return { question, choices, correctIdx, explanation };
      }

      const { choices, correctIdx } = buildChoices(r, (i) => {
        if (i === 1) return r + 1;
        if (i === 2) return Math.max(1, r - 1);
        if (i === 3) return r + 2;
        return r + 3;
      });

      const question = lang === 'ko'
        ? `세 변의 길이가 각각 $${a}\\text{ cm}$, $${b}\\text{ cm}$, $${c}\\text{ cm}$인 직각삼각형에 내접하는 원의 반지름 $r$의 길이는 몇 $\\text{cm}$입니까?`
        : `A right triangle has side lengths $${a}\\text{ cm}$, $${b}\\text{ cm}$, and $${c}\\text{ cm}$. What is the radius $r$ of the circle inscribed in this triangle in centimeters?`;

      const explanation = lang === 'ko'
        ? `**[AMC 8 Prep Vol. 4 Ch.23 직각삼각형과 내접원의 반지름 공식]**\n\n직각삼각형의 두 직각변 $a=${a}$, $b=${b}$와 빗변 $c=${c}$에 대하여 내접원의 반지름 $r$은:\n\n$$r = \\frac{a + b - c}{2} = \\frac{${a} + ${b} - ${c}}{2} = \\frac{${a + b - c}}{2} = ${r}\\text{ cm}$$\n\n(또는 삼각형 넓이 공식 $\\frac{1}{2}ab = \\frac{1}{2}r(a+b+c) \\implies r = \\frac{${a * b}}{${a + b + c}} = ${r}$)\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} ($${r}\\text{ cm}$)** 입니다.`
        : `**[AMC 8 Prep Vol. 4 Ch.23 Inradius of a Right Triangle]**\n\nFor a right triangle with legs $a=${a}$, $b=${b}$ and hypotenuse $c=${c}$, the inradius is given by:\n\n$$r = \\frac{a + b - c}{2} = \\frac{${a} + ${b} - ${c}}{2} = ${r}\\text{ cm}$$\n\n(Equivalently, Area = $\\frac{1}{2}ab = \\frac{1}{2}r(a+b+c) \\implies r = \\frac{${a * b}}{${a + b + c}} = ${r}$).\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${r})**.`;

      return { question, choices, correctIdx, explanation };
    }

    // Pythagorean triples
    const triple = pickRandom([
      [3, 4, 5],
      [5, 12, 13],
      [8, 15, 17],
      [6, 8, 10],
    ]);
    const k = randInt(1, 3);
    const leg1 = triple[0] * k;
    const leg2 = triple[1] * k;
    const hyp = triple[2] * k;
    const area = (leg1 * leg2) / 2;

    const { choices, correctIdx } = buildChoices(area, (i) => {
      if (i === 1) return leg1 * leg2;
      if (i === 2) return (leg1 * hyp) / 2;
      if (i === 3) return area + randInt(3, 10);
      return Math.max(1, area - randInt(2, 8));
    });

    const question = lang === 'ko'
      ? `빗변의 길이가 $${hyp}\\text{ cm}$이고 한 직각변의 길이가 $${leg1}\\text{ cm}$인 직각삼각형의 넓이는 몇 $\\text{cm}^2$입니까?`
      : `A right triangle has a hypotenuse of length $${hyp}\\text{ cm}$ and one leg of length $${leg1}\\text{ cm}$. What is the area of the triangle in square centimeters?`;

    const explanation = lang === 'ko'
      ? `**[AMC 8 Prep Vol. 1 Ch.1 & Vol. 4 Ch.23 피타고라스 정리와 직각삼각형의 넓이]**\n\n피타고라스 정리 $a^2 + b^2 = c^2$에 의해 다른 한 변의 길이를 구합니다:\n\n$$b = \\sqrt{${hyp}^2 - ${leg1}^2} = \\sqrt{${hyp * hyp} - ${leg1 * leg1}} = \\sqrt{${leg2 * leg2}} = ${leg2}$$\n\n직각삼각형의 넓이는 두 직각변의 곱의 절반이므로:\n\n$$A = \\frac{1}{2} \\times ${leg1} \\times ${leg2} = ${area}\\text{ cm}^2$$\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} ($${area}\\text{ cm}^2$)** 입니다.`
      : `**[AMC 8 Prep Vol. 1 Ch.1 & Vol. 4 Ch.23 Pythagorean Theorem & Right Triangle Area]**\n\nUsing the Pythagorean theorem $a^2 + b^2 = c^2$:\n\n$$b = \\sqrt{${hyp}^2 - ${leg1}^2} = \\sqrt{${hyp * hyp - leg1 * leg1}} = ${leg2}$$\n\nThe area of the right triangle is:\n\n$$A = \\frac{1}{2} \\times ${leg1} \\times ${leg2} = ${area}\\text{ cm}^2$$\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${area})**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // 3. COORDINATE GEOMETRY & PICK'S THEOREM (Ch 1: Perimeter and Area)
  // -----------------------------------------------------------------------
  'coordinate-geometry': (lang) => {
    // Pick's Theorem: Area = B/2 + I - 1
    const B = pickRandom([4, 6, 8, 10, 12]);
    const I = randInt(4, 18);
    const area = B / 2 + I - 1;

    const { choices, correctIdx } = buildChoices(area, (i) => {
      if (i === 1) return B / 2 + I;
      if (i === 2) return B + I - 1;
      if (i === 3) return area + 2;
      return Math.max(1, area - 2);
    });

    const question = lang === 'ko'
      ? `가로와 세로의 간격이 $1\\text{ unit}$인 정사각 격자판(Geoboard) 위에 다각형이 그려져 있습니다. 이 다각형의 둘레 위의 격자점 수가 $B = ${B}$개이고, 다각형 내부의 격자점 수가 $I = ${I}$개일 때, 픽의 정리(Pick's Theorem)를 이용하여 구한 다각형의 넓이는 얼마입니까?`
      : `A polygon is drawn on a unit square grid (geoboard). The polygon has $B = ${B}$ grid points on its boundary and $I = ${I}$ grid points in its interior. According to Pick's Theorem, what is the area of the polygon?`;

    const explanation = lang === 'ko'
      ? `**[AMC 8 Prep Vol. 1 Ch.1 픽의 정리 (Pick's Law)]**\n\n격자점 위의 단순 다각형의 넓이는 경계점의 수 $B$와 내부 격자점의 수 $I$에 의해 다음과 같이 결정됩니다:\n\n$$\\text{Area} = \\frac{B}{2} + I - 1$$\n\n주어진 값 $B = ${B}$, $I = ${I}$를 대입하면:\n\n$$\\text{Area} = \\frac{${B}}{2} + ${I} - 1 = ${B / 2} + ${I} - 1 = ${area}$$\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} ($${area}$)** 입니다.`
      : `**[AMC 8 Prep Vol. 1 Ch.1 Pick's Theorem]**\n\nFor any simple lattice polygon with $B$ boundary points and $I$ interior points:\n\n$$\\text{Area} = \\frac{B}{2} + I - 1$$\n\nSubstituting $B = ${B}$ and $I = ${I}$:\n\n$$\\text{Area} = \\frac{${B}}{2} + ${I} - 1 = ${area}$$\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${area})**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // 4. SEQUENCES & PATTERNS (Ch 2: Patterns)
  // -----------------------------------------------------------------------
  'sequences-patterns': (lang) => {
    const variant = pickRandom(['odd-sum', 'arithmetic-term', 'triangular', 'arithmetic-mean-terms']);

    if (variant === 'arithmetic-mean-terms') {
      const xTarget = randInt(2, 9);
      const c = randInt(3, 6);
      const a = randInt(1, c - 1);
      const diffCoeff = randInt(1, 3);
      const e = 2 * c - a - diffCoeff;
      const dVal = randInt(-5, 5);
      const bVal = randInt(-5, 5);
      const fVal = 2 * dVal - bVal + diffCoeff * xTarget;

      const t1 = `${a}x ${bVal >= 0 ? '+' : '-'} ${Math.abs(bVal)}`;
      const t2 = `${c}x ${dVal >= 0 ? '+' : '-'} ${Math.abs(dVal)}`;
      const t3 = `${e}x ${fVal >= 0 ? '+' : '-'} ${Math.abs(fVal)}`;

      const { choices, correctIdx } = buildChoices(xTarget, (i) => {
        if (i === 1) return xTarget + 1;
        if (i === 2) return xTarget - 1 || 5;
        if (i === 3) return xTarget + 2;
        return xTarget + randInt(3, 7) * (i % 2 === 0 ? 1 : -1);
      });

      const question = lang === 'ko'
        ? `어떤 등차수열의 연속한 세 항이 차례대로 $${t1}$, $${t2}$, $${t3}$일 때, $x$의 값을 구하세요.`
        : `If $${t1}$, $${t2}$, and $${t3}$ are three consecutive terms of an arithmetic sequence, find the value of $x$.`;

      const explanation = lang === 'ko'
        ? `**[The Essential Guide to Algebra 2 Topic 10.4 등차중항과 미지수]**\n\n등차수열에서 연속한 세 항 $A, B, C$ 사이에 등차중항 성질 $2B = A + C$가 성립합니다:\n\n$$2(${t2}) = (${t1}) + (${t3})$$\n\n전개하여 정리하면:\n$$${2 * c}x ${2 * dVal >= 0 ? '+' : '-'} ${Math.abs(2 * dVal)} = ${a + e}x ${bVal + fVal >= 0 ? '+' : '-'} ${Math.abs(bVal + fVal)}$$\n\n$$${2 * c - a - e}x = ${bVal + fVal - 2 * dVal} \\implies x = ${xTarget}$$\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} (${xTarget})** 입니다.`
        : `**[The Essential Guide to Algebra 2 Topic 10.4 Arithmetic Means]**\n\nFor three consecutive terms $A, B, C$ of an arithmetic sequence, $2B = A + C$:\n\n$$2(${t2}) = (${t1}) + (${t3})$$\n\nExpanding and solving for $x$:\n$$${2 * c}x ${2 * dVal >= 0 ? '+' : '-'} ${Math.abs(2 * dVal)} = ${a + e}x ${bVal + fVal >= 0 ? '+' : '-'} ${Math.abs(bVal + fVal)}$$\n\n$$${2 * c - a - e}x = ${bVal + fVal - 2 * dVal} \\implies x = ${xTarget}$$\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${xTarget})**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'odd-sum') {
      // Sum of first n odd integers = n^2
      const n = randInt(11, 25);
      const lastOdd = 2 * n - 1;
      const sum = n * n;

      const { choices, correctIdx } = buildChoices(sum, (i) => {
        if (i === 1) return n * (n + 1);
        if (i === 2) return (n - 1) * (n - 1);
        if (i === 3) return sum + 2 * n;
        return sum - 2 * n;
      });

      const question = lang === 'ko'
        ? `다음 연속한 홀수들의 합의 값은 얼마입니까?\n\n$$1 + 3 + 5 + 7 + \\dots + ${lastOdd}$$`
        : `What is the value of the following sum of consecutive odd integers?\n\n$$1 + 3 + 5 + 7 + \\dots + ${lastOdd}$$`;

      const explanation = lang === 'ko'
        ? `**[AMC 8 Prep Vol. 1 Ch.2 연속한 홀수의 합 패턴]**\n\n첫 번째 홀수부터 $n$번째 홀수까지의 합은 항상 $n^2$입니다:\n\n$$1 + 3 + 5 + \\dots + (2n-1) = n^2$$\n\n마지막 수 $2n - 1 = ${lastOdd}$ 에서 $2n = ${lastOdd + 1} \\implies n = ${n}$ 입니다.\n\n따라서 홀수의 개수는 $${n}$개이며, 합은:\n\n$$S = ${n}^2 = ${sum}$$\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} ($${sum}$)** 입니다.`
        : `**[AMC 8 Prep Vol. 1 Ch.2 Sum of First n Odd Integers Pattern]**\n\nThe sum of the first $n$ odd numbers is equal to $n^2$:\n\n$$1 + 3 + 5 + \\dots + (2n-1) = n^2$$\n\nHere $2n - 1 = ${lastOdd} \\implies n = ${n}$.\n\nThus, the sum is $${n}^2 = ${sum}$.\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${sum})**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'triangular') {
      // Triangular numbers T_n = n(n+1)/2
      const n = randInt(12, 30);
      const ans = (n * (n + 1)) / 2;

      const { choices, correctIdx } = buildChoices(ans, (i) => {
        if (i === 1) return n * n;
        if (i === 2) return ((n - 1) * n) / 2;
        if (i === 3) return ans + n;
        return ans - n;
      });

      const question = lang === 'ko'
        ? `바둑알을 1열에 1개, 2열에 2개, 3열에 3개, $\\dots$, $${n}$열에 $${n}$개 배열하여 정삼각형 모양을 만들었습니다. 사용된 바둑알은 모두 몇 개입니까? (즉, $1 + 2 + 3 + \\dots + ${n}$ 의 값)`
        : `Pennies are arranged in a triangular pattern: 1 penny in the 1st row, 2 in the 2nd row, 3 in the 3rd row, and so on up to $${n}$ pennies in the $${n}$th row. How many pennies are used in total? (i.e. $1 + 2 + 3 + \\dots + ${n}$)`;

      const explanation = lang === 'ko'
        ? `**[AMC 8 Prep Vol. 1 Ch.2 삼각수(Triangular Number) 공식]**\n\n$1$부터 $n$까지의 자연수의 합은 삼각수 공식으로 구합니다:\n\n$$T_n = \\frac{n(n+1)}{2}$$\n\n$n = ${n}$을 대입하면:\n\n$$T_{${n}} = \\frac{${n} \\times ${n + 1}}{2} = \\frac{${n * (n + 1)}}{2} = ${ans}$$\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} ($${ans}$)** 입니다.`
        : `**[AMC 8 Prep Vol. 1 Ch.2 Triangular Numbers]**\n\nThe sum of the first $n$ positive integers is given by Gauss's formula:\n\n$$T_n = \\frac{n(n+1)}{2}$$\n\nFor $n = ${n}$:\n\n$$T_{${n}} = \\frac{${n} \\times ${n + 1}}{2} = ${ans}$$\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${ans})**.`;

      return { question, choices, correctIdx, explanation };
    }

    // Arithmetic sequence term
    const a1 = randInt(3, 15);
    const d = randInt(3, 8);
    const n = randInt(20, 50);
    const an = a1 + (n - 1) * d;

    const { choices, correctIdx } = buildChoices(an, (i) => {
      if (i === 1) return a1 + n * d;
      if (i === 2) return a1 + (n - 2) * d;
      if (i === 3) return an + d;
      return an - d;
    });

    const question = lang === 'ko'
      ? `첫째항이 $${a1}$이고 공차가 $${d}$인 등차수열 $${a1}, ${a1 + d}, ${a1 + 2 * d}, ${a1 + 3 * d}, \\dots$ 에서 제$${n}$항($a_{${n}}$)의 값은 얼마입니까?`
      : `In the arithmetic sequence $${a1}, ${a1 + d}, ${a1 + 2 * d}, ${a1 + 3 * d}, \\dots$, what is the value of the $${n}$th term ($a_{${n}}$)?`;

    const explanation = lang === 'ko'
      ? `**[AMC 8 Prep Vol. 1 Ch.2 등차수열의 일반항]**\n\n첫째항이 $a_1$, 공차가 $d$인 등차수열의 일반항 공식은 다음과 같습니다:\n\n$$a_n = a_1 + (n-1)d$$\n\n주어진 값 $a_1 = ${a1}$, $d = ${d}$, $n = ${n}$을 대입하면:\n\n$$a_{${n}} = ${a1} + (${n} - 1) \\times ${d} = ${a1} + ${n - 1} \\times ${d} = ${a1} + ${(n - 1) * d} = ${an}$$\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} ($${an}$)** 입니다.`
      : `**[AMC 8 Prep Vol. 1 Ch.2 General Term of an Arithmetic Sequence]**\n\nThe $n$th term of an arithmetic sequence with first term $a_1$ and common difference $d$ is:\n\n$$a_n = a_1 + (n-1)d$$\n\nSubstituting $a_1 = ${a1}$, $d = ${d}$, $n = ${n}$:\n\n$$a_{${n}} = ${a1} + (${n}-1) \\times ${d} = ${an}$$\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${an})**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // 5. UNITS DIGIT & CYCLES (Ch 2: Patterns)
  // -----------------------------------------------------------------------
  'units-digit-cycles': (lang) => {
    const variant = pickRandom(['units-digit', 'last-two-digits']);

    if (variant === 'last-two-digits') {
      const exp = randInt(2021, 2035);
      const rem = exp % 4;
      const mod100Map = { 1: 7, 2: 49, 3: 43, 0: 1 };
      const ans = mod100Map[rem];

      const { choices, correctIdx } = buildChoices(ans, (i) => {
        const pool = [1, 7, 43, 49, 21, 9, 63, 81].filter((v) => v !== ans);
        return pool[i % pool.length];
      });

      const question = lang === 'ko'
        ? `$7^{${exp}}$ 을 $100$으로 나눈 나머지(끝 두 자리 수)를 구하세요.`
        : `Find the remainder when $7^{${exp}}$ is divided by $100$ (the last two digits).`;

      const explanation = lang === 'ko'
        ? `**[The Essential Guide to Competition Math: Number Theory Topic 5.1 & Topic 6 거듭제곱의 끝 두 자리(mod 100)]**\n\n$7$의 거듭제곱을 $100$으로 나눈 나머지를 차례로 구하면 다음과 같이 $4$개를 주기로 순환합니다:\n- $7^1 \\equiv 7 \\pmod{100}$\n- $7^2 \\equiv 49 \\pmod{100}$\n- $7^3 \\equiv 343 \\equiv 43 \\pmod{100}$\n- $7^4 \\equiv 301 \\equiv 1 \\pmod{100}$\n\n지수 $${exp}$를 주기 $4$로 나누면 $${exp} = 4 \\times ${Math.floor(exp / 4)} + ${rem}$ 이므로:\n\n$$7^{${exp}} \\equiv 7^{${rem === 0 ? 4 : rem}} \\equiv ${ans} \\pmod{100}$$\n\n따라서 구하는 나머지는 **$${ans}$** 입니다.\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} (${ans})** 입니다.`
        : `**[The Essential Guide to Competition Math: Number Theory Topic 5.1 & Topic 6 Powers mod 100]**\n\nComputing powers of $7$ modulo $100$ reveals a period of $4$:\n- $7^1 \\equiv 7 \\pmod{100}$\n- $7^2 \\equiv 49 \\pmod{100}$\n- $7^3 \\equiv 43 \\pmod{100}$\n- $7^4 \\equiv 1 \\pmod{100}$\n\nSince $${exp} = 4 \\times ${Math.floor(exp / 4)} + ${rem}$:\n\n$$7^{${exp}} \\equiv 7^{${rem === 0 ? 4 : rem}} \\equiv ${ans} \\pmod{100}$$\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${ans})**.`;

      return { question, choices, correctIdx, explanation };
    }

    const base = pickRandom([2, 3, 7, 8]);
    const exp = randInt(2020, 2035);
    const cycleMap = {
      2: [6, 2, 4, 8],
      3: [1, 3, 9, 7],
      7: [1, 7, 9, 3],
      8: [6, 8, 4, 2],
    };
    const remainder = exp % 4;
    const ans = cycleMap[base][remainder];

    const { choices, correctIdx } = buildChoices(ans, (i) => {
      const otherDigits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter((d) => d !== ans);
      return otherDigits[i % otherDigits.length];
    });

    const question = lang === 'ko'
      ? `$${base}^{${exp}}$ 의 일의 자리 숫자는 얼마입니까?`
      : `What is the units digit of $${base}^{${exp}}$?`;

    const cycleStr = base === 2 ? '2, 4, 8, 6' : base === 3 ? '3, 9, 7, 1' : base === 7 ? '7, 9, 3, 1' : '8, 4, 2, 6';

    const explanation = lang === 'ko'
      ? `**[The Essential Guide to Competition Math: Number Theory Topic 1.1 & Topic 5.1 일의 자리 주기성]**\n\n밑이 $${base}$일 때 거듭제곱의 일의 자리 숫자는 4개를 주기로 반복됩니다: **($${cycleStr}$)**\n\n지수 $${exp}$를 주기 $4$로 나눈 나머지를 구합니다:\n\n$$${exp} = 4 \\times ${Math.floor(exp / 4)} + ${remainder}$$\n\n나머지가 $${remainder}$이므로 일의 자리 숫자는 주기의 ${remainder === 0 ? '4번째' : remainder + '번째'} 숫자인 **$${ans}$** 입니다.\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} ($${ans}$)** 입니다.`
      : `**[The Essential Guide to Competition Math: Number Theory Topic 1.1 & Topic 5.1 Units Digit Power Cycles]**\n\nThe units digits of powers of $${base}$ repeat every 4 terms in the cycle: **($${cycleStr}$)**.\n\nDividing the exponent by 4:\n\n$$${exp} = 4 \\times ${Math.floor(exp / 4)} + ${remainder}$$\n\nSince the remainder is $${remainder}$, the units digit is **${ans}**.\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${ans})**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // 6. LOGICAL REASONING (Ch 3: Logical Reasoning)
  // -----------------------------------------------------------------------
  'logical-reasoning': (lang) => {
    // Climbing snail problem (Vol 1 Example 15)
    const H = randInt(25, 45);
    const climb = randInt(4, 7);
    const slip = randInt(2, climb - 1);
    const net = climb - slip;
    const daysBeforeLast = Math.ceil((H - climb) / net);
    const totalDays = daysBeforeLast + 1;

    const { choices, correctIdx } = buildChoices(totalDays, (i) => {
      if (i === 1) return Math.ceil(H / net);
      if (i === 2) return Math.floor(H / net);
      if (i === 3) return totalDays + 1;
      return Math.max(1, totalDays - 1);
    });

    const question = lang === 'ko'
      ? `달팽이가 깊이 $${H}\\text{ m}$인 우물 바닥에서 기어 올라가려고 합니다. 낮 동안에는 $${climb}\\text{ m}$를 기어 올라가지만, 밤에는 잠을 자는 동안 $${slip}\\text{ m}$를 미끄러져 내려옵니다. 달팽이가 우물 꼭대기에 처음으로 도달하는 것은 며칠째 낮입니까?`
      : `A snail is at the bottom of a well that is $${H}\\text{ meters}$ deep. Each day, the snail climbs up $${climb}\\text{ meters}$, but each night it slides down $${slip}\\text{ meters}$ while sleeping. On which day will the snail first reach the top of the well?`;

    const explanation = lang === 'ko'
      ? `**[AMC 8 Prep Vol. 1 Ch.3 논리적 문제해결: 마지막 날 도달 조건]**\n\n주의할 점은 달팽이가 꼭대기에 도달하면 다시 미끄러져 내려오지 않는다는 것입니다.\n\n1. 매일 순증가 높이는 $${climb} - ${slip} = ${net}\\text{ m}$ 입니다.\n2. 마지막 날 낮에 $${climb}\\text{ m}$를 올라가 우물 꼭대기($${H}\\text{ m}$)에 도달해야 하므로, 전날 밤까지 최소 $${H} - ${climb} = ${H - climb}\\text{ m}$ 이상에 도달해 있어야 합니다.\n3. $\\frac{${H - climb}}{${net}} = ${(H - climb) / net}$ 이므로, 올림하여 $${daysBeforeLast}$일 동안 매일 $${net}\\text{ m}$씩 올라가면 높이가 $${daysBeforeLast * net}\\text{ m}$가 됩니다.\n4. 그 다음 날인 제$${totalDays}$일 낮에 $${climb}\\text{ m}$를 올라가면 총 높이 $${daysBeforeLast * net + climb}\\text{ m} \\ge ${H}\\text{ m}$로 꼭대기에 도달합니다.\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} (${totalDays}일째)** 입니다.`
      : `**[AMC 8 Prep Vol. 1 Ch.3 Logic & Boundary Conditions]**\n\nOnce the snail reaches the top, it does not slip back down.\n\n1. Daily net progress is $${climb} - ${slip} = ${net}\\text{ m}$.\n2. Prior to the final climb of $${climb}\\text{ m}$, the snail needs to reach at least $${H} - ${climb} = ${H - climb}\\text{ m}$.\n3. This requires $\\lceil \\frac{${H - climb}}{${net}} \\rceil = ${daysBeforeLast}$ days.\n4. On day $${totalDays}$, climbing $${climb}\\text{ m}$ reaches $${daysBeforeLast * net + climb}\\text{ m} \\ge ${H}\\text{ m}$.\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${totalDays} days)**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // 7. CRYPTARITHMS & PUZZLES (Ch 3: Logical Reasoning)
  // -----------------------------------------------------------------------
  'cryptarithms-puzzles': (lang) => {
    // Two-digit alphametic AB + BA = CDC
    const diff = pickRandom([1, 3, 5, 7]);
    const A = (11 + diff) / 2;
    const B = 11 - A;
    const ans = A * B;

    const { choices, correctIdx } = buildChoices(ans, (i) => {
      if (i === 1) return (A + 1) * (B - 1);
      if (i === 2) return (A - 1) * (B + 1);
      if (i === 3) return ans + randInt(2, 5);
      return Math.max(1, ans - randInt(2, 5));
    });

    const question = lang === 'ko'
      ? `서로 다른 한 자리 숫자 $A, B, C, D$에 대하여 두 자리 수 $AB$와 $BA$의 합이 세 자리 수 $CDC$가 되었습니다.\n\n$$AB + BA = CDC$$\n\n만약 $A > B$이고 $A - B = ${diff}$ 라면, 두 숫자 $A$와 $B$의 곱 $A \\times B$의 값은 얼마입니까?`
      : `In the cryptarithm below, distinct digits $A, B, C, D$ satisfy the two-digit addition:\n\n$$AB + BA = CDC$$\n\nIf $A > B$ and $A - B = ${diff}$, what is the value of $A \\times B$?`;

    const explanation = lang === 'ko'
      ? `**[AMC 8 Prep Vol. 1 Ch.3 암호산(Cryptarithm) 자리올림 분석]**\n\n1. 두 자리 수 $AB = 10A + B$ 이고 $BA = 10B + A$ 이므로:\n\n$$AB + BA = 11(A + B)$$\n\n2. 두 개의 두 자리 수의 합은 최대 $99 + 99 = 198$ 이므로, 세 자리 수 $CDC$의 백의 자리 $C$는 반드시 **$1$** 이어야 합니다 ($C = 1$).\n3. 따라서 $CDC = 1D1$ 이며, $11(A + B) = 1D1$ 에서 $1D1$은 $11$의 배수여야 합니다. $11 \\times 11 = 121$ 이므로 $A + B = 11$ 이고 $D = 2$ 입니다.\n4. $A + B = 11$ 이고 $A - B = ${diff}$ 이므로 연립방정식을 풀면:\n\n$$2A = 11 + ${diff} = ${11 + diff} \\implies A = ${A}, \\quad B = ${B}$$\n\n5. 따라서 $A \\times B = ${A} \\times ${B} = ${ans}$ 입니다.\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} ($${ans}$)** 입니다.`
      : `**[AMC 8 Prep Vol. 1 Ch.3 Cryptarithm Carry & Base-10 Analysis]**\n\n1. Expanding place values: $AB + BA = (10A+B) + (10B+A) = 11(A+B)$.\n2. The sum of two two-digit numbers is at most $198$, so $C = 1$.\n3. Thus $CDC = 1D1$, which must be a multiple of $11$. The only multiple of $11$ of the form $1D1$ is $121 = 11 \\times 11$. Hence $A + B = 11$ and $D = 2$.\n4. Since $A + B = 11$ and $A - B = ${diff}$:\n   $$A = ${A}, \\quad B = ${B}$$\n5. The product is $A \\times B = ${ans}$.\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${ans})**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // 8. OPERATIONS WITH FRACTIONS & DECIMALS (Vol 1 Ch 4 & Vol 2 Ch 9)
  // -----------------------------------------------------------------------
  'arithmetic-operations': (lang) => {
    const variant = pickRandom(['telescoping', 'repeating-decimal']);

    if (variant === 'telescoping') {
      // Telescoping fraction product: (1 - 1/2)(1 - 1/3)...(1 - 1/n) = 1/n
      const n = randInt(15, 50);
      const correctFraction = `\\frac{1}{${n}}`;

      const { choices, correctIdx } = buildChoices(correctFraction, (i) => {
        if (i === 1) return `\\frac{1}{${n - 1}}`;
        if (i === 2) return `\\frac{2}{${n}}`;
        if (i === 3) return `\\frac{${n - 1}}{${n}}`;
        return `\\frac{1}{${n + 1}}`;
      });

      const question = lang === 'ko'
        ? `다음 분수의 곱셈 식을 간단히 계산한 값은 얼마입니까?\n\n$$\\left(1 - \\frac{1}{2}\\right)\\left(1 - \\frac{1}{3}\\right)\\left(1 - \\frac{1}{4}\\right) \\cdots \\left(1 - \\frac{1}{${n}}\\right)$$`
        : `What is the simplified value of the following product of fractions?\n\n$$\\left(1 - \\frac{1}{2}\\right)\\left(1 - \\frac{1}{3}\\right)\\left(1 - \\frac{1}{4}\\right) \\cdots \\left(1 - \\frac{1}{${n}}\\right)$$`;

      const explanation = lang === 'ko'
        ? `**[AMC 8 Prep Vol. 1 Ch.4 분수 망원급수(Telescoping Product)]**\n\n각 괄호 안의 식을 계산하면 분자와 분모가 연쇄적으로 약분됩니다:\n\n$$\\left(\\frac{1}{2}\\right) \\times \\left(\\frac{2}{3}\\right) \\times \\left(\\frac{3}{4}\\right) \\times \\cdots \\times \\left(\\frac{${n - 1}}{${n}}\\right)$$\n\n첫 번째 분수의 분자 $1$과 마지막 분수의 분모 $${n}$만 남고 중간의 모든 항이 약분되므로:\n\n$$S = \\frac{1}{${n}}$$\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} ($${correctFraction}$)** 입니다.`
        : `**[AMC 8 Prep Vol. 1 Ch.4 Telescoping Fraction Product]**\n\nSimplify each term in parentheses:\n\n$$\\left(\\frac{1}{2}\\right) \\left(\\frac{2}{3}\\right) \\left(\\frac{3}{4}\\right) \\cdots \\left(\\frac{${n - 1}}{${n}}\\right)$$\n\nNotice that the numerator of each term cancels with the denominator of the preceding term. Only the first numerator ($1$) and the last denominator ($${n}$) survive:\n\n$$S = \\frac{1}{${n}}$$\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]}**.`;

      return { question, choices, correctIdx, explanation };
    }

    // Repeating decimal to simplified fraction (Vol 2 Ch 9)
    const ab = randInt(12, 85);
    const g = gcd(ab, 99);
    const p = ab / g;
    const q = 99 / g;
    const sumPQ = p + q;

    const { choices, correctIdx } = buildChoices(sumPQ, (i) => {
      if (i === 1) return ab + 99;
      if (i === 2) return p + q + 10;
      if (i === 3) return p * q;
      return Math.max(1, sumPQ - 8);
    });

    const question = lang === 'ko'
      ? `순환소수 $0.\\overline{${ab < 10 ? '0' + ab : ab}}$를 서로소인 두 자연수 $p, q$에 대하여 기약분수 $\\frac{p}{q}$로 나타낼 때, 분모와 분자의 합 $p + q$의 값은 얼마입니까?`
      : `When the repeating decimal $0.\\overline{${ab < 10 ? '0' + ab : ab}}$ is written as a simplified fraction $\\frac{p}{q}$ in lowest terms (where $p$ and $q$ are relatively prime positive integers), what is the value of $p + q$?`;

    const explanation = lang === 'ko'
      ? `**[AMC 8 Prep Vol. 2 Ch.9 순환소수의 분수 변환 공식]**\n\n소수점 아래 $2$자리가 순환하는 순환소수 $x = 0.\\overline{${ab < 10 ? '0' + ab : ab}}$는 다음과 같이 분수로 바꿉니다:\n\n$$100x = ${ab}.\\overline{${ab < 10 ? '0' + ab : ab}}$$\n$$-x = 0.\\overline{${ab < 10 ? '0' + ab : ab}}$$\n$$99x = ${ab} \\implies x = \\frac{${ab}}{99}$$\n\n분자와 분모의 최대공약수 $\\gcd(${ab}, 99) = ${g}$로 약분하여 기약분수로 나타내면:\n\n$$\\frac{p}{q} = \\frac{${p}}{${q}}$$\n\n따라서 분모와 분자의 합은:\n\n$$p + q = ${p} + ${q} = ${sumPQ}$$\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} ($${sumPQ}$)** 입니다.`
      : `**[AMC 8 Prep Vol. 2 Ch.9 Converting Repeating Decimals to Fractions]**\n\nFor a two-digit repetend $x = 0.\\overline{${ab < 10 ? '0' + ab : ab}}$:\n\n$$100x - x = ${ab} \\implies 99x = ${ab} \\implies x = \\frac{${ab}}{99}$$\n\nReducing by the greatest common divisor $\\gcd(${ab}, 99) = ${g}$:\n\n$$\\frac{p}{q} = \\frac{${p}}{${q}}$$\n\nThe sum of the numerator and denominator is:\n\n$$p + q = ${p} + ${q} = ${sumPQ}$$\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${sumPQ})**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // 9. EVEN/ODD & DIVISIBILITY (Vol 1 Ch 5, Vol 2 Ch 12 & Vol 4 Ch 20)
  // -----------------------------------------------------------------------
  'remainders-divisibility': (lang) => {
    const variant = pickRandom(['parity-multiples', 'trailing-zeros', 'divisibility-digit', 'common-shortage', 'divisor-remainder-count']);

    if (variant === 'common-shortage') {
      // AMC 8 Prep Vol. 4 Ch.20: Remainder - common shortage CRT pattern
      const config = pickRandom([
        { a: 4, b: 5, c: 6, k: 1, L: 60 },
        { a: 3, b: 4, b2: 5, c: 5, k: 1, L: 60 },
        { a: 5, b: 6, c: 8, k: 1, L: 120 },
        { a: 6, b: 8, c: 9, k: 1, L: 72 },
        { a: 4, b: 6, c: 9, k: 2, L: 36 },
        { a: 6, b: 9, c: 15, k: 3, L: 90 },
      ]);
      const { a, b, c, k, L } = config;
      const r1 = a - k;
      const r2 = b - k;
      const r3 = c - k;
      const ans = L - k;

      const { choices, correctIdx } = buildChoices(ans, (i) => {
        if (i === 1) return L + k;
        if (i === 2) return L;
        if (i === 3) return ans - 5;
        return ans + 5 * i;
      });

      const question = lang === 'ko'
        ? `어떤 자연수 $N$을 $${a}$로 나누면 나머지가 $${r1}$이고, $${b}$로 나누면 나머지가 $${r2}$이며, $${c}$로 나누면 나머지가 $${r3}$입니다. 이러한 성질을 만족하는 가장 작은 양의 정수 $N$은 얼마입니까?`
        : `When a positive integer $N$ is divided by $${a}$, the remainder is $${r1}$; when divided by $${b}$, the remainder is $${r2}$; and when divided by $${c}$, the remainder is $${r3}$. What is the smallest positive integer $N$?`;

      const explanation = lang === 'ko'
        ? `**[AMC 8 Prep Vol. 4 Ch.20 나머지 정리와 공통 부족수]**\n\n각 나눗셈의 나머지를 관찰하면, 나누는 수에서 나머지를 뺀 차이가 모두 $${k}$로 일정합니다:\n\n$$${a} - ${r1} = ${k},\\quad ${b} - ${r2} = ${k},\\quad ${c} - ${r3} = ${k}$$\n\n따라서 $N$에 $${k}$를 더한 수 $(N + ${k})$는 $${a}, ${b}, ${c}$ 모두의 공배수가 됩니다.\n\n$$\\text{lcm}(${a}, ${b}, ${c}) = ${L}$$\n\n가장 작은 양의 정수 $N$을 구해야 하므로:\n\n$$N + ${k} = ${L} \\implies N = ${L} - ${k} = ${ans}$$\n\n(검산: $${ans} = ${a} \\times ${Math.floor(ans / a)} + ${r1}$, $${ans} = ${b} \\times ${Math.floor(ans / b)} + ${r2}$, $${ans} = ${c} \\times ${Math.floor(ans / c)} + ${r3}$)\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} ($${ans}$)** 입니다.`
        : `**[AMC 8 Prep Vol. 4 Ch.20 Chinese Remainder Theorem: Constant Shortage]**\n\nNotice that each divisor minus its remainder is constant: $${a} - ${r1} = ${k}$, $${b} - ${r2} = ${k}$, and $${c} - ${r3} = ${k}$.\n\nTherefore, $N + ${k}$ must be a common multiple of $${a}, ${b}$, and $${c}$:\n\n$$\\text{lcm}(${a}, ${b}, ${c}) = ${L}$$\n\nFor the smallest positive integer $N$:\n\n$$N + ${k} = ${L} \\implies N = ${L} - ${k} = ${ans}$$\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${ans})**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'divisor-remainder-count') {
      // AMC 8 Prep Vol. 4 Ch.20: Remainder - divisor condition (M = qk + r => qk = M - r, k > r)
      const data = pickRandom([
        { M: 51, r: 3, diff: 48, divisors: [1, 2, 3, 4, 6, 8, 12, 16, 24, 48], count: 7 },
        { M: 77, r: 5, diff: 72, divisors: [1, 2, 3, 4, 6, 8, 9, 12, 18, 24, 36, 72], count: 8 },
        { M: 64, r: 4, diff: 60, divisors: [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60], count: 8 },
        { M: 43, r: 3, diff: 40, divisors: [1, 2, 4, 5, 8, 10, 20, 40], count: 6 },
      ]);
      const { M, r, diff, divisors, count } = data;
      const validDivisors = divisors.filter((d) => d > r);

      const { choices, correctIdx } = buildChoices(count, (i) => {
        if (i === 1) return divisors.length; // forgot k > r
        if (i === 2) return count + 1;
        if (i === 3) return Math.max(1, count - 1);
        return count + 2;
      });

      const question = lang === 'ko'
        ? `$${M}$을 어떤 자연수 $k$로 나누었을 때 나머지가 $${r}$이 됩니다. 이러한 조건을 만족하는 자연수 $k$의 개수는 모두 몇 개입니까?`
        : `When $${M}$ is divided by a positive integer $k$, the remainder is $${r}$. How many such positive integers $k$ are there?`;

      const explanation = lang === 'ko'
        ? `**[AMC 8 Prep Vol. 4 Ch.20 나눗셈 정리와 제수의 조건]**\n\n나눗셈 정리에서 $${M} = qk + ${r}$ ($q$는 몫)으로 나타낼 수 있습니다. 이 식을 정리하면:\n\n$$qk = ${M} - ${r} = ${diff}$$\n\n따라서 $k$는 $${diff}$의 약수여야 합니다.\n\n이때 **가장 중요한 조건은 나머지가 나누는 수보다 작아야 하므로 $k > ${r}$** 이어야 합니다.\n\n$${diff}$의 모든 양의 약수는 $${divisors.join(', ')}$ (총 $${divisors.length}$개)입니다.\n이 중 $${r}$보다 큰 약수만 고르면:\n\n$$\\{${validDivisors.join(', ')}\\}$$\n\n총 **$${count}$개**입니다.\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} (${count}개)** 입니다.`
        : `**[AMC 8 Prep Vol. 4 Ch.20 Division Algorithm & Divisor Constraint]**\n\nBy the division algorithm, $${M} = qk + ${r}$, which means $qk = ${M} - ${r} = ${diff}$.\n\nThus $k$ must be a factor of $${diff}$. Furthermore, the remainder must be strictly less than the divisor, so **$k > ${r}$**.\n\nThe positive factors of $${diff}$ are $${divisors.join(', ')}$ (total $${divisors.length}$). Those strictly greater than $${r}$ are:\n\n$$\\{${validDivisors.join(', ')}\\}$$\n\nThere are **${count}** such integers.\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${count})**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'parity-multiples') {
      // Number of odd multiples of 3 between start and end (Vol 1 Ex 6)
      const start = randInt(10, 30);
      const end = randInt(start + 20, start + 60);
      let oddMult3 = 0;
      let evenMult3 = 0;
      for (let x = start; x <= end; x += 1) {
        if (x % 3 === 0) {
          if (x % 2 === 1) oddMult3 += 1;
          else evenMult3 += 1;
        }
      }

      const { choices, correctIdx } = buildChoices(oddMult3, (i) => {
        if (i === 1) return evenMult3;
        if (i === 2) return oddMult3 + evenMult3;
        if (i === 3) return oddMult3 + 2;
        return Math.max(1, oddMult3 - 2);
      });

      const question = lang === 'ko'
        ? `$${start}$ 부터 $${end}$ 까지의 정수 중에서 $3$의 배수이면서 홀수인 정수는 모두 몇 개입니까?`
        : `How many integers between $${start}$ and $${end}$ (inclusive) are odd multiples of $3$?`;

      const explanation = lang === 'ko'
        ? `**[AMC 8 Prep Vol. 1 Ch.5 홀짝성과 배수(Even and Odd)]**\n\n$3$의 배수이면서 홀수인 정수는 $3 \\times (\\text{홀수})$ 꼴입니다 (예: $3 \\times 1, 3 \\times 3, 3 \\times 5, \\dots$). 이는 공차가 $6$인 등차수열을 이룹니다.\n\n$${start}$ 이상 $${end}$ 이하의 홀수인 $3$의 배수를 확인하면 총 **$${oddMult3}$개**입니다.\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} (${oddMult3}개)** 입니다.`
        : `**[AMC 8 Prep Vol. 1 Ch.5 Parity & Multiples]**\n\nAn odd multiple of $3$ has the form $3 \\times (\\text{odd integer})$, which forms an arithmetic progression with common difference $6$.\n\nCounting the values in range $[${start}, ${end}]$ yields **${oddMult3}** numbers.\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${oddMult3})**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'trailing-zeros') {
      // Vol 2 Ch 12: Trailing zeros of N! using Legendre formula
      const N = pickRandom([30, 40, 50, 60, 75, 80, 100]);
      const zeros = Math.floor(N / 5) + Math.floor(N / 25);

      const { choices, correctIdx } = buildChoices(zeros, (i) => {
        if (i === 1) return Math.floor(N / 5);
        if (i === 2) return Math.floor(N / 10);
        if (i === 3) return zeros + 3;
        return Math.max(1, zeros - 3);
      });

      const question = lang === 'ko'
        ? `$${N}! = 1 \\times 2 \\times 3 \\times \\cdots \\times ${N}$ 의 계산 결과에서 맨 끝에 연속으로 붙어 있는 $0$의 개수는 모두 몇 개입니까?`
        : `How many trailing zeros are at the end of the number $${N}! = 1 \\times 2 \\times 3 \\times \\cdots \\times ${N}$?`;

      const explanation = lang === 'ko'
        ? `**[AMC 8 Prep Vol. 2 Ch.12 르장드르 공식과 끝자리 0의 개수]**\n\n자연수의 끝자리 $0$은 소인수 $10 = 2 \\times 5$의 개수에 의해 결정됩니다. $N!$에는 소인수 $2$가 소인수 $5$보다 훨씬 많으므로, 끝자리 $0$의 개수는 $N!$에 포함된 소인수 $5$의 지수와 정확히 일치합니다.\n\n르장드르 공식(Legendre's Formula):\n\n$$E_5(${N}!) = \\left\\lfloor \\frac{${N}}{5} \\right\\rfloor + \\left\\lfloor \\frac{${N}}{25} \\right\\rfloor = ${Math.floor(N / 5)} + ${Math.floor(N / 25)} = ${zeros}$$\n\n따라서 맨 끝에 연속으로 붙는 $0$의 개수는 **$${zeros}$개**입니다.\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} ($${zeros}$개)** 입니다.`
        : `**[AMC 8 Prep Vol. 2 Ch.12 Legendre's Formula for Trailing Zeros]**\n\nEach trailing zero is produced by a factor of $10 = 2 \\times 5$. In $N!$, factors of $2$ are far more abundant than factors of $5$, so the number of trailing zeros equals the exponent of $5$ in the prime factorization of $N!$.\n\nBy Legendre's Formula:\n\n$$E_5(${N}!) = \\left\\lfloor \\frac{${N}}{5} \\right\\rfloor + \\left\\lfloor \\frac{${N}}{25} \\right\\rfloor = ${Math.floor(N / 5)} + ${Math.floor(N / 25)} = ${zeros}$$\n\nThe number of trailing zeros is **${zeros}**.\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${zeros})**.`;

      return { question, choices, correctIdx, explanation };
    }

    // Missing digit divisible by 9
    const d1 = randInt(2, 9);
    const d2 = randInt(1, 9);
    const d3 = randInt(1, 9);
    const d4 = randInt(1, 9);
    const partialSum = d1 + d2 + d3 + d4;
    const mod = partialSum % 9;
    const missingDigit = mod === 0 ? 9 : 9 - mod;
    const totalSum = partialSum + missingDigit;

    const { choices, correctIdx } = buildChoices(missingDigit, (i) => {
      if (i === 1) return (missingDigit + 1) % 10;
      if (i === 2) return (missingDigit + 8) % 10;
      if (i === 3) return Math.min(9, missingDigit + 2);
      return Math.max(0, missingDigit - 2);
    });

    const question = lang === 'ko'
      ? `다섯 자리 자연수 $${d1}${d2}A${d3}${d4}$ 가 $9$의 배수일 때, 가운데 자리 숫자 $A$의 값은 얼마입니까?`
      : `The five-digit integer $${d1}${d2}A${d3}${d4}$ is a multiple of $9$. What is the digit $A$?`;

    const explanation = lang === 'ko'
      ? `**[AMC 8 Prep Vol. 2 Ch.12 9의 배수 판정법]**\n\n어떤 자연수가 $9$의 배수가 되기 위한 필요충분조건은 **모든 자릿수의 합이 $9$의 배수**가 되는 것입니다.\n\n자릿수의 합:\n\n$$${d1} + ${d2} + A + ${d3} + ${d4} = ${partialSum} + A$$\n\n$A$는 $0$부터 $9$ 사이의 한 자리 숫자이므로, $${partialSum} + A$가 $9$의 배수가 되는 값은:\n\n$$${partialSum} + A = ${totalSum} \\implies A = ${missingDigit}$$\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} ($${missingDigit}$)** 입니다.`
      : `**[AMC 8 Prep Vol. 2 Ch.12 Divisibility by 9 Rule]**\n\nAn integer is divisible by $9$ if and only if the sum of its digits is divisible by $9$.\n\nSum of digits:\n\n$$${d1} + ${d2} + A + ${d3} + ${d4} = ${partialSum} + A$$\n\nSince $A$ is a single digit ($0 \\le A \\le 9$), the only value making the sum a multiple of $9$ is:\n\n$$${partialSum} + A = ${totalSum} \\implies A = ${missingDigit}$$\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${missingDigit})**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // BASES & DIGITS (Essential Guide to Competition Math (Fundamentals) Topic 5:
  // Base Expression and Modular Expression / Chinese Remainder Theorem)
  // -----------------------------------------------------------------------
  'bases-digits': (lang) => {
    const variant = pickRandom(['to-base', 'from-base', 'digit-sum-base', 'crt-simple']);

    const toBase = (n, b) => {
      if (n === 0) return '0';
      const digits = [];
      let x = n;
      while (x > 0) {
        digits.unshift(x % b);
        x = Math.floor(x / b);
      }
      return digits.join('');
    };
    const fromBase = (str, b) => String(str).split('').reduce((acc, ch) => acc * b + Number(ch), 0);

    if (variant === 'to-base') {
      const base = pickRandom([2, 3, 4, 5, 6, 7, 8, 9]);
      const N = randInt(20, 200);
      const ans = toBase(N, base);

      const { choices, correctIdx } = buildChoices(ans, (i) => {
        if (i === 1) return toBase(N + 1, base);
        if (i === 2) return toBase(Math.max(1, N - 1), base);
        if (i === 3) return toBase(N, base === 9 ? 8 : base + 1);
        return toBase(N + i + 2, base);
      });

      const question = lang === 'ko'
        ? `십진법 수 $${N}$을 $${base}$진법으로 나타내세요.`
        : `Express the decimal number $${N}$ in base $${base}$.`;

      const explanation = lang === 'ko'
        ? `**[Essential Guide to Competition Math (Fundamentals) Topic 5.3 진법 변환]**\n\n$${N}$을 $${base}$로 계속 나누어 나머지를 거꾸로 읽으면 $${base}$진법 표현을 얻습니다:\n\n$$${N}_{10} = ${ans}_{${base}}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]}** 입니다.`
        : `**[Essential Guide to Competition Math (Fundamentals) Topic 5.3 Base Conversion]**\n\nRepeatedly divide $${N}$ by $${base}$ and read the remainders in reverse to get the base-$${base}$ representation:\n\n$$${N}_{10} = ${ans}_{${base}}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]}**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'from-base') {
      const base = pickRandom([2, 3, 4, 5, 6, 7, 8, 9]);
      const len = randInt(3, 4);
      const digits = [randInt(1, base - 1)];
      for (let k = 1; k < len; k += 1) digits.push(randInt(0, base - 1));
      const numeral = digits.join('');
      const ans = fromBase(numeral, base);

      const { choices, correctIdx } = buildChoices(ans, (i) => {
        if (i === 1) return fromBase(numeral, base + 1);
        if (i === 2) return ans + 1;
        if (i === 3) return Math.max(0, ans - 1);
        return ans + (i + 1) * 2;
      });

      const terms = digits.map((d, idx) => `${d}\\times ${base}^{${len - 1 - idx}}`).join(' + ');
      const question = lang === 'ko'
        ? `$${base}$진법으로 나타낸 수 $${numeral}_{${base}}$를 십진법으로 나타내세요.`
        : `Convert the base-$${base}$ numeral $${numeral}_{${base}}$ to decimal (base 10).`;

      const explanation = lang === 'ko'
        ? `**[Essential Guide to Competition Math (Fundamentals) Topic 5.3 진법 변환]**\n\n각 자리의 값에 자릿값($${base}$의 거듭제곱)을 곱하여 더합니다:\n\n$$${numeral}_{${base}} = ${terms} = ${ans}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]}** 입니다.`
        : `**[Essential Guide to Competition Math (Fundamentals) Topic 5.3 Base Conversion]**\n\nMultiply each digit by its place value (a power of $${base}$) and sum:\n\n$$${numeral}_{${base}} = ${terms} = ${ans}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]}**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'digit-sum-base') {
      const base = pickRandom([2, 3, 4, 5, 6, 7, 8, 9]);
      const N = randInt(30, 300);
      const rep = toBase(N, base);
      const ans = rep.split('').reduce((s, d) => s + Number(d), 0);

      const { choices, correctIdx } = buildChoices(ans, (i) => {
        if (i === 1) return ans + 1;
        if (i === 2) return Math.max(0, ans - 1);
        if (i === 3) return rep.length;
        return ans + i + 2;
      });

      const question = lang === 'ko'
        ? `십진법 수 $${N}$을 $${base}$진법으로 나타냈을 때, 각 자리 숫자의 합을 구하세요.`
        : `When the decimal number $${N}$ is written in base $${base}$, what is the sum of its digits?`;

      const explanation = lang === 'ko'
        ? `**[Essential Guide to Competition Math (Fundamentals) Topic 5.3 진법과 자릿수 합]**\n\n$${N}$을 $${base}$진법으로 나타내면 $${rep}_{${base}}$이므로, 각 자리 숫자의 합은\n\n$$${rep.split('').join(' + ')} = ${ans}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]}** 입니다.`
        : `**[Essential Guide to Competition Math (Fundamentals) Topic 5.3 Digit Sums in Other Bases]**\n\n$${N}$ in base $${base}$ is $${rep}_{${base}}$, so the digit sum is\n\n$$${rep.split('').join(' + ')} = ${ans}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]}**.`;

      return { question, choices, correctIdx, explanation };
    }

    // crt-simple: Chinese Remainder Theorem for two small coprime moduli
    const m1 = pickRandom([3, 4, 5]);
    let m2 = pickRandom([4, 5, 7, 9, 11]);
    while (gcd(m1, m2) !== 1) m2 = pickRandom([4, 5, 7, 9, 11]);
    const r1 = randInt(1, m1 - 1);
    const r2 = randInt(1, m2 - 1);
    let ans = 0;
    for (let x = 1; x <= m1 * m2; x += 1) {
      if (x % m1 === r1 && x % m2 === r2) { ans = x; break; }
    }

    const { choices, correctIdx } = buildChoices(ans, (i) => {
      if (i === 1) return ans + m1;
      if (i === 2) return ans + m2;
      if (i === 3) return Math.max(1, ans - Math.min(m1, m2));
      return ans + m1 * m2 + i;
    });

    const question = lang === 'ko'
      ? `$x$를 $${m1}$으로 나누면 나머지가 $${r1}$이고, $${m2}$로 나누면 나머지가 $${r2}$인 가장 작은 양의 정수 $x$를 구하세요.`
      : `Find the smallest positive integer $x$ such that $x$ leaves a remainder of $${r1}$ when divided by $${m1}$, and a remainder of $${r2}$ when divided by $${m2}$.`;

    const explanation = lang === 'ko'
      ? `**[Essential Guide to Competition Math (Fundamentals) Topic 5.2 중국인의 나머지 정리(CRT)]**\n\n$${m1}$과 $${m2}$는 서로소이므로, 두 조건을 동시에 만족하는 해는 $\\text{lcm}(${m1},${m2})=${m1 * m2}$를 주기로 유일하게 존재합니다. $x \\equiv ${r1} \\pmod{${m1}}$을 만족하는 수를 차례로 확인하여 $x \\equiv ${r2} \\pmod{${m2}}$도 만족하는 첫 값을 찾으면:\n\n$$x = ${ans}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]}** 입니다.`
      : `**[Essential Guide to Competition Math (Fundamentals) Topic 5.2 Chinese Remainder Theorem]**\n\nSince $${m1}$ and $${m2}$ are coprime, a unique solution exists modulo $\\text{lcm}(${m1},${m2})=${m1 * m2}$. Checking numbers $\\equiv ${r1} \\pmod{${m1}}$ in order until one is also $\\equiv ${r2} \\pmod{${m2}}$ gives:\n\n$$x = ${ans}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]}**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // 10. PERCENTAGES & FINANCE (Ch 6: Word Problems Related to Percentage)
  // -----------------------------------------------------------------------
  'percentages-money': (lang) => {
    const variant = pickRandom(['successive-discount', 'relation-percent']);
    if (variant === 'successive-discount') {
      const d1 = pickRandom([10, 20, 30]);
      const d2 = pickRandom([10, 20, 25]);
      const finalPct = Math.round((1 - d1 / 100) * (1 - d2 / 100) * 100);
      const totalDiscount = 100 - finalPct;

      const { choices, correctIdx } = buildChoices(`${totalDiscount}\\%`, (i) => {
        if (i === 1) return `${d1 + d2}\\%`;
        if (i === 2) return `${totalDiscount + 2}\\%`;
        // Guaranteed-fresh for every later retry, so a small (d1,d2) combo space never
        // forces the generic "value + N" text-concat fallback onto a percent choice.
        return `${totalDiscount - 2 - i}\\%`;
      });

      const question = lang === 'ko'
        ? `어떤 상품의 정가에서 먼저 $${d1}\\%$를 할인한 후, 특별 세일로 할인된 가격에서 추가로 $${d2}\\%$를 더 할인하였습니다. 이 상품의 최종 판매가는 원래 정가에서 총 몇 $\\%$ 할인된 것입니까?`
        : `An item is initially discounted by $${d1}\\%$ from its original price. During a clearance sale, the discounted price is reduced by an additional $${d2}\\%$. What is the single equivalent overall percentage discount from the original price?`;

      const explanation = lang === 'ko'
        ? `**[AMC 8 Prep Vol. 1 Ch.6 연속 할인율 계산]**\n\n원래 정가를 $100$원이라 하면:\n\n1. $${d1}\\%$ 할인 후 가격:\n   $$100 \\times (1 - 0.${d1 / 10}) = ${100 - d1}\\text{원}$$\n2. 추가로 $${d2}\\%$ 할인 후 최종 가격:\n   $$${100 - d1} \\times (1 - 0.${d2 / 10}) = ${finalPct}\\text{원}$$\n3. 따라서 원래 가격 $100$원에서 $${finalPct}$원이 되었으므로, 총 할인된 비율은:\n   $$100\\% - ${finalPct}\\% = ${totalDiscount}\\%$$\n\n(단순히 $${d1}\\% + ${d2}\\% = ${d1 + d2}\\%$ 로 더하면 안 됩니다!)\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} ($${totalDiscount}\\%$)** 입니다.`
        : `**[AMC 8 Prep Vol. 1 Ch.6 Successive Discounts]**\n\nLet the original price be $100$:\n\n1. After $${d1}\\%$ discount: $100 \\times (1 - ${d1 / 100}) = ${100 - d1}$.\n2. After secondary $${d2}\\%$ discount: $${100 - d1} \\times (1 - ${d2 / 100}) = ${finalPct}$.\n3. The net discount from $100$ is $100 - ${finalPct} = ${totalDiscount}\\%$.\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${totalDiscount}\\%)**.`;

      return { question, choices, correctIdx, explanation };
    }

    // Vol 1 Example 23: 20% of x equals 40% of y, then 40% of x equals what percent of y?
    const p1 = pickRandom([15, 20, 25]);
    const p2 = pickRandom([30, 40, 50]);
    const mult = pickRandom([2, 3]);
    const targetX = p1 * mult;
    const ansY = p2 * mult;

    const { choices, correctIdx } = buildChoices(`${ansY}\\%`, (i) => {
      if (i === 1) return `${p2}\\%`;
      if (i === 2) return `${p1 * mult}\\%`;
      if (i === 3) return `${ansY / 2}\\%`;
      // Guaranteed-fresh for every later retry.
      return `${ansY + 10 + i}\\%`;
    });

    const question = lang === 'ko'
      ? `양수 $x, y$에 대하여 $x$의 $${p1}\\%$가 $y$의 $${p2}\\%$와 같다고 합니다. 그렇다면 $x$의 $${targetX}\\%$는 $y$의 몇 $\\%$와 같습니까?`
      : `If $x > 0$ and $${p1}\\%$ of $x$ is equal to $${p2}\\%$ of $y$, then $${targetX}\\%$ of $x$ is equal to what percent of $y$?`;

    const explanation = lang === 'ko'
      ? `**[AMC 8 Prep Vol. 1 Ch.6 백분율 비례 관계]**\n\n주어진 조건:\n\n$$0.${p1} x = 0.${p2} y$$\n\n양변에 $${mult}$를 곱하면:\n\n$$${mult} \\times (0.${p1} x) = ${mult} \\times (0.${p2} y)$$\n\n$$0.${targetX} x = 0.${ansY} y$$\n\n따라서 $x$의 $${targetX}\\%$는 $y$의 **$${ansY}\\%$**와 같습니다.\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} ($${ansY}\\%$)** 입니다.`
      : `**[AMC 8 Prep Vol. 1 Ch.6 Percentage Proportions]**\n\nGiven that $0.${p1}x = 0.${p2}y$, multiply both sides by $${mult}$:\n\n$$${mult}(0.${p1}x) = ${mult}(0.${p2}y) \\implies 0.${targetX}x = 0.${ansY}y$$\n\nThus, $${targetX}\\%$ of $x$ is $${ansY}\\%$ of $y$.\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${ansY}\\%)**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // 11. RATIOS & RATES (Ch 6: Word Problems Related to Percentage)
  // -----------------------------------------------------------------------
  'ratios-percent': (lang) => {
    const variant = pickRandom(['continued-ratio', 'triangle-angles-ratio', 'algebraic-proportion', 'salt-mixture']);

    if (variant === 'continued-ratio') {
      // AMC 8 Prep Vol. 3 Ch.16 Section 3: Continued Ratio a:b:c
      const p = randInt(2, 4);
      const q = randInt(3, 5);
      const r = randInt(2, 4);
      const s = randInt(3, 6);
      const termA = p * r;
      const termB = q * r;
      const termC = q * s;
      const sumTerms = termA + termB + termC;
      const multiplier = randInt(4, 12);
      const totalAmount = sumTerms * multiplier;
      const shareC = termC * multiplier;
      const shareA = termA * multiplier;
      const diffCA = shareC - shareA;

      const { choices, correctIdx } = buildChoices(shareC, (i) => {
        if (i === 1) return shareA;
        if (i === 2) return termB * multiplier;
        if (i === 3) return diffCA;
        return shareC + randInt(5, 25) * (i % 2 === 0 ? 1 : -1);
      });

      const question = lang === 'ko'
        ? `과일 샐러드를 파인애플, 배, 복숭아를 섞어 만듭니다. 파인애플과 배의 무게비는 $${p} : ${q}$이고, 배와 복숭아의 무게비는 $${r} : ${s}$입니다. 전체 샐러드의 무게가 $${totalAmount}\\text{ g}$일 때, 사용된 복숭아의 무게는 몇 $\\text{g}$입니까?`
        : `A fruit salad is made by mixing pineapples, pears, and peaches. The ratio of pineapples to pears by weight is $${p} : ${q}$, and the ratio of pears to peaches is $${r} : ${s}$. If the total weight of the salad is $${totalAmount}\\text{ g}$, how many grams of peaches are in the salad?`;

      const explanation = lang === 'ko'
        ? `**[AMC 8 Prep Vol. 3 Ch.16 연비(Continued Ratio)와 비례배분]**\n\n공통 대상인 '배'의 비를 맞추어 세 과일의 연비를 구합니다:\n- 파인애플 : 배 $= ${p} : ${q} = (${p}\\times ${r}) : (${q}\\times ${r}) = ${termA} : ${termB}$\n- 배 : 복숭아 $= ${r} : ${s} = (${r}\\times ${q}) : (${s}\\times ${q}) = ${termB} : ${termC}$\n\n따라서 세 과일의 무게 연비는:\n$$\\text{파인애플} : \\text{배} : \\text{복숭아} = ${termA} : ${termB} : ${termC}$$\n\n전체 비의 합: $${termA} + ${termB} + ${termC} = ${sumTerms}$\n\n복숭아의 무게는 전체 $${totalAmount}\\text{ g}$ 중 $\\frac{${termC}}{${sumTerms}}$ 이므로:\n\n$$\\text{복숭아 무게} = ${totalAmount} \\times \\frac{${termC}}{${sumTerms}} = ${shareC}\\text{ g}$$\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} ($${shareC}\\text{ g}$)** 입니다.`
        : `**[AMC 8 Prep Vol. 3 Ch.16 Continued Ratio & Proportional Division]**\n\nScale the ratios so the common term (pears) has the same value:\n- Pineapples : Pears $= ${p} : ${q} = ${termA} : ${termB}$\n- Pears : Peaches $= ${r} : ${s} = ${termB} : ${termC}$\n\nThus the continued ratio is:\n$$\\text{Pineapples} : \\text{Pears} : \\text{Peaches} = ${termA} : ${termB} : ${termC}$$\n\nTotal ratio parts: $${termA} + ${termB} + ${termC} = ${sumTerms}$.\n\nThe weight of peaches is:\n\n$$\\text{Peaches} = ${totalAmount} \\times \\frac{${termC}}{${sumTerms}} = ${shareC}\\text{ g}$$\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${shareC}\\text{ g})**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'triangle-angles-ratio') {
      // AMC 8 Prep Vol. 3 Ch.16 Problem 1: Triangle angles in ratio a:b:c
      const triplets = [[2, 3, 5], [1, 2, 3], [2, 5, 8], [3, 4, 5], [1, 3, 5], [2, 3, 7]];
      const [a, b, c] = pickRandom(triplets);
      const totalParts = a + b + c;
      const degPerPart = 180 / totalParts;
      const angleMin = Math.round(a * degPerPart);
      const angleMax = Math.round(c * degPerPart);
      const diff = angleMax - angleMin;

      const { choices, correctIdx } = buildChoices(`${diff}^\\circ`, (i) => {
        if (i === 1) return `${angleMax}^\\circ`;
        if (i === 2) return `${angleMin}^\\circ`;
        if (i === 3) return `${Math.round(b * degPerPart)}^\\circ`;
        return `${Math.max(10, diff + randInt(5, 20) * (i % 2 === 0 ? 1 : -1))}^\\circ`;
      });

      const question = lang === 'ko'
        ? `어떤 삼각형의 세 내각의 크기의 비가 $${a} : ${b} : ${c}$입니다. 이 삼각형에서 가장 큰 각과 가장 작은 각의 크기의 차는 몇 도($^\\circ$)입니까?`
        : `The measures of the three interior angles of a triangle are in the ratio $${a} : ${b} : ${c}$. What is the positive difference in degrees ($^\\circ$) between the largest angle and the smallest angle?`;

      const explanation = lang === 'ko'
        ? `**[AMC 8 Prep Vol. 3 Ch.16 비례배분과 삼각형의 내각]**\n\n삼각형의 세 내각의 총합은 $180^\\circ$입니다.\n세 각의 비의 총합은 $${a} + ${b} + ${c} = ${totalParts}$ 이므로, 비 $1$에 해당하는 각도는:\n\n$$\\frac{180^\\circ}{${totalParts}} = ${degPerPart}^\\circ$$\n\n가장 큰 각은 $${c} \\times ${degPerPart}^\\circ = ${angleMax}^\\circ$ 이고,\n가장 작은 각은 $${a} \\times ${degPerPart}^\\circ = ${angleMin}^\\circ$ 입니다.\n\n두 각의 차는:\n\n$$${angleMax}^\\circ - ${angleMin}^\\circ = ${diff}^\\circ$$\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} ($${diff}^\\circ$)** 입니다.`
        : `**[AMC 8 Prep Vol. 3 Ch.16 Proportional Angles in a Triangle]**\n\nThe sum of angles in a triangle is $180^\\circ$.\nTotal parts $= ${a} + ${b} + ${c} = ${totalParts}$.\nEach part is worth $\\frac{180^\\circ}{${totalParts}} = ${degPerPart}^\\circ$.\n\nLargest angle $= ${c} \\times ${degPerPart}^\\circ = ${angleMax}^\\circ$, smallest angle $= ${a} \\times ${degPerPart}^\\circ = ${angleMin}^\\circ$.\n\nDifference: $${angleMax}^\\circ - ${angleMin}^\\circ = ${diff}^\\circ$.\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${diff}^\\circ)**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'algebraic-proportion') {
      // AMC 8 Prep Vol. 3 Ch.16 Problem 2: x/y = k, find (x-y)/(x+y) or y/(x+y)
      const k = randInt(2, 6);
      const isDiff = Math.random() < 0.5;
      const exprLatex = isDiff ? '\\frac{x - y}{x + y}' : '\\frac{y}{x + y}';
      const ansNum = isDiff ? (k - 1) : 1;
      const ansDen = k + 1;
      const g = gcd(ansNum, ansDen);
      const simpNum = ansNum / g;
      const simpDen = ansDen / g;
      const ansLatex = simpDen === 1 ? `${simpNum}` : `\\frac{${simpNum}}{${simpDen}}`;

      const { choices, correctIdx } = buildChoices(ansLatex, (i) => {
        if (i === 1) return `\\frac{${k}}{${k + 1}}`;
        if (i === 2) return `\\frac{${k + 1}}{${k}}`;
        if (i === 3) return `\\frac{${k - 1}}{${k}}`;
        return `\\frac{${simpNum + i}}{${simpDen + i}}`;
      });

      const question = lang === 'ko'
        ? `두 양수 $x, y$에 대하여 $\\frac{x}{y} = ${k}$ 일 때, $${exprLatex}$ 의 값은 얼마입니까?`
        : `If $x$ and $y$ are positive numbers such that $\\frac{x}{y} = ${k}$, what is the value of $${exprLatex}$?`;

      const explanation = lang === 'ko'
        ? `**[AMC 8 Prep Vol. 3 Ch.16 비례식의 성질(Componendo and Dividendo)]**\n\n분수식 $${exprLatex}$ 의 분자와 분모를 각각 $y$로 나눕니다:\n\n$$${exprLatex} = ${isDiff ? `\\frac{\\frac{x}{y} - 1}{\\frac{x}{y} + 1} = \\frac{${k} - 1}{${k} + 1} = \\frac{${ansNum}}{${ansDen}}` : `\\frac{1}{\\frac{x}{y} + 1} = \\frac{1}{${k} + 1} = \\frac{1}{${ansDen}}`}${g > 1 ? ` = ${ansLatex}` : ''}$$\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} ($${ansLatex}$)** 입니다.`
        : `**[AMC 8 Prep Vol. 3 Ch.16 Algebraic Proportions]**\n\nDivide the numerator and denominator by $y$:\n\n$$${exprLatex} = ${isDiff ? `\\frac{x/y - 1}{x/y + 1} = \\frac{${k} - 1}{${k} + 1} = ${ansLatex}` : `\\frac{1}{x/y + 1} = \\frac{1}{${k} + 1} = ${ansLatex}`}$$\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${ansLatex})**.`;

      return { question, choices, correctIdx, explanation };
    }

    // Mixture problem: V1 at C1% mixed with V2 at C2%
    const V1 = pickRandom([20, 30, 40]);
    const C1 = pickRandom([10, 20]);
    const V2 = pickRandom([30, 50, 60]);
    const C2 = pickRandom([30, 40]);
    const salt1 = (V1 * C1) / 100;
    const salt2 = (V2 * C2) / 100;
    const totalV = V1 + V2;
    const totalSalt = salt1 + salt2;
    const finalConc = Math.round((totalSalt / totalV) * 100 * 10) / 10;

    const { choices, correctIdx } = buildChoices(`${finalConc}\\%`, (i) => {
      if (i === 1) return `${(C1 + C2) / 2}\\%`;
      if (i === 2) return `${Math.round((finalConc + 2.5) * 10) / 10}\\%`;
      if (i === 3) return `${C2}\\%`;
      return `${Math.round((finalConc - 2.5 - i) * 10) / 10}\\%`;
    });

    const question = lang === 'ko'
      ? `$${C1}\\%$ 소금물 $${V1}\\text{ g}$과 $${C2}\\%$ 소금물 $${V2}\\text{ g}$을 섞었습니다. 완성된 혼합 소금물의 농도는 몇 $\\%$입니까?`
      : `A $${C1}\\%$ salt solution of mass $${V1}\\text{ g}$ is mixed with a $${C2}\\%$ salt solution of mass $${V2}\\text{ g}$. What is the concentration (percentage) of salt in the resulting mixture?`;

    const explanation = lang === 'ko'
      ? `**[AMC 8 Prep Vol. 1 Ch.6 & Vol. 3 Ch.16 소금물 농도 혼합 공식]**\n\n1. 첫 번째 소금물의 소금 양: $${V1} \\times \\frac{${C1}}{100} = ${salt1}\\text{ g}$\n2. 두 번째 소금물의 소금 양: $${V2} \\times \\frac{${C2}}{100} = ${salt2}\\text{ g}$\n3. 혼합물의 총 소금 양: $${salt1} + ${salt2} = ${totalSalt}\\text{ g}$\n4. 혼합물의 총 무게: $${V1} + ${V2} = ${totalV}\\text{ g}$\n\n따라서 혼합물의 농도는:\n\n$$\\text{농도} = \\frac{${totalSalt}}{${totalV}} \\times 100\\% = ${finalConc}\\%$$\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} ($${finalConc}\\%$)** 입니다.`
      : `**[AMC 8 Prep Vol. 1 Ch.6 & Vol. 3 Ch.16 Solution Mixture Formula]**\n\n1. Salt in first solution: $${V1} \\times ${C1 / 100} = ${salt1}\\text{ g}$.\n2. Salt in second solution: $${V2} \\times ${C2 / 100} = ${salt2}\\text{ g}$.\n3. Total salt: $${totalSalt}\\text{ g}$. Total mass: $${totalV}\\text{ g}$.\n4. Concentration: $\\frac{${totalSalt}}{${totalV}} \\times 100\\% = ${finalConc}\\%$.\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${finalConc}\\%)**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // 12. SPEED, DISTANCE & TIME
  // -----------------------------------------------------------------------
  'speed-distance-time': (lang) => {
    // Harmonic mean average speed: 2*v1*v2 / (v1 + v2)
    const v1 = pickRandom([30, 40, 60]);
    const v2 = pickRandom([20, 60, 120]);
    const avgSpeed = (2 * v1 * v2) / (v1 + v2);

    const { choices, correctIdx } = buildChoices(avgSpeed, (i) => {
      if (i === 1) return (v1 + v2) / 2;
      if (i === 2) return Math.round(avgSpeed + 4);
      if (i === 3) return Math.round(avgSpeed - 4);
      return Math.round((v1 + v2) / 2 - 2);
    });

    const question = lang === 'ko'
      ? `한 자동차가 A 도시에서 B 도시까지 갈 때는 시속 $${v1}\\text{ km/h}$로 달렸고, 같은 길을 되돌아올 때는 시속 $${v2}\\text{ km/h}$로 달렸습니다. 이 자동차의 왕복 평균 속력은 몇 $\\text{km/h}$입니까?`
      : `A car travels from City A to City B at an average speed of $${v1}\\text{ km/h}$, and returns along the same route at $${v2}\\text{ km/h}$. What was the average speed of the car for the entire round trip in $\\text{km/h}$?`;

    const explanation = lang === 'ko'
      ? `**[왕복 평균 속력과 조화평균]**\n\n왕복 거리를 $2d$라 두면, 갈 때 걸린 시간 $t_1 = \\frac{d}{${v1}}$, 올 때 걸린 시간 $t_2 = \\frac{d}{${v2}}$ 입니다.\n\n$$\\text{평균 속력} = \\frac{\\text{총 이동거리}}{\\text{총 소요시간}} = \\frac{2d}{\\frac{d}{${v1}} + \\frac{d}{${v2}}} = \\frac{2 \\times ${v1} \\times ${v2}}{${v1} + ${v2}}$$\n\n대입하여 계산하면:\n\n$$v_{avg} = \\frac{2 \\times ${v1} \\times ${v2}}{${v1 + v2}} = \\frac{${2 * v1 * v2}}{${v1 + v2}} = ${avgSpeed}\\text{ km/h}$$\n\n(단순 산술평균인 $\\frac{${v1} + ${v2}}{2} = ${(v1 + v2) / 2}\\text{ km/h}$ 가 아님에 유의하세요!)\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} ($${avgSpeed}\\text{ km/h}$)** 입니다.`
      : `**[Round-Trip Average Speed & Harmonic Mean]**\n\nAverage speed is total distance divided by total time:\n\n$$v_{avg} = \\frac{2d}{\\frac{d}{${v1}} + \\frac{d}{${v2}}} = \\frac{2 \\times ${v1} \\times ${v2}}{${v1} + ${v2}} = \\frac{${2 * v1 * v2}}{${v1 + v2}} = ${avgSpeed}\\text{ km/h}$$\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${avgSpeed})**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // 13. COUNTING & COMBINATIONS
  // -----------------------------------------------------------------------
  'permutations-combinations': (lang) => {
    const variant = pickRandom(['committee', 'stars-and-bars']);

    if (variant === 'committee') {
      const n = randInt(6, 9);
      const r = randInt(2, 3);
      let num = 1;
      let den = 1;
      for (let i = 0; i < r; i += 1) {
        num *= (n - i);
        den *= (i + 1);
      }
      const ans = num / den;

      const { choices, correctIdx } = buildChoices(ans, (i) => {
        if (i === 1) return num;
        if (i === 2) return ans + randInt(2, 6);
        if (i === 3) return Math.max(1, ans - randInt(2, 5));
        return ans * 2;
      });

      const question = lang === 'ko'
        ? `수학 동아리에 속한 $${n}$명의 학생 중에서 대표 $${r}$명을 선출하는 방법의 수는 모두 몇 가지입니까?`
        : `A math club has $${n}$ members. In how many different ways can a committee of $${r}$ members be chosen?`;

      const explanation = lang === 'ko'
        ? `**[조합(Combination) 기본 공식]**\n\n서로 다른 $n$명 중에서 순서에 상관없이 $r$명을 선택하는 조합의 수 $\\binom{n}{r}$:\n\n$$\\binom{${n}}{${r}} = \\frac{${n}!}{( ${n} - ${r} )! \\times ${r}!} = ${ans}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} ($${ans}$가지)** 입니다.`
        : `**[Combinations Formula]**\n\nChoosing $r$ elements from $n$ distinct elements without regard to order:\n\n$$\\binom{${n}}{${r}} = \\frac{${n}!}{(${n}-${r})! \\times ${r}!} = ${ans}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

      return { question, choices, correctIdx, explanation };
    }

    // stars-and-bars (combination allowing repetition), from
    // "The Essential Guide to Competition Math: Counting and Probability" Topic 2.4
    const k = randInt(3, 5); // number of variables
    const positive = Math.random() < 0.5; // xi >= 1 (positive) or xi >= 0 (nonnegative)
    const total = positive ? randInt(k + 3, k + 12) : randInt(4, 14);
    const binom = (a, b) => {
      if (b < 0 || b > a) return 0;
      let r = 1;
      for (let i = 0; i < b; i += 1) r = (r * (a - i)) / (i + 1);
      return Math.round(r);
    };
    const ans = positive ? binom(total - 1, k - 1) : binom(total + k - 1, k - 1);

    const { choices, correctIdx } = buildChoices(ans, (i) => {
      if (i === 1) return binom(total, k - 1);
      if (i === 2) return binom(total - 1, k);
      if (i === 3) return ans + randInt(2, 10);
      return Math.max(1, ans - randInt(2, 10));
    });

    const varNames = ['x_1', 'x_2', 'x_3', 'x_4', 'x_5'].slice(0, k).join(' + ');
    const condition = positive ? `x_1, x_2, \\ldots, x_${k} \\geq 1` : `x_1, x_2, \\ldots, x_${k} \\geq 0`;

    const question = lang === 'ko'
      ? `방정식 $${varNames} = ${total}$을 만족하는 정수해 $(x_1, x_2, \\ldots, x_${k})$의 개수를 구하시오. (단, ${condition})`
      : `Find the number of integer solutions $(x_1, x_2, \\ldots, x_${k})$ to $${varNames} = ${total}$, where $${condition}$.`;

    const explanation = positive
      ? (lang === 'ko'
        ? `**[Essential Guide to Competition Math (C&P) Topic 2.4 별과 막대 (Stars and Bars)]**\n\n$${k}$개의 양의 정수 변수의 합이 $${total}$이 되는 경우의 수는, 별 $${total}$개를 일렬로 놓고 그 사이 $${total - 1}$개의 틈 중 $${k - 1}$개를 골라 막대를 꽂는 것과 같습니다:\n\n$$\\binom{${total} - 1}{${k} - 1} = \\binom{${total - 1}}{${k - 1}} = ${ans}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} ($${ans}$가지)** 입니다.`
        : `**[Essential Guide to Competition Math (C&P) Topic 2.4 Stars and Bars]**\n\nWith $${k}$ positive-integer variables summing to $${total}$, line up $${total}$ stars and choose $${k - 1}$ of the $${total - 1}$ gaps between them for bars:\n\n$$\\binom{${total} - 1}{${k} - 1} = ${ans}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`)
      : (lang === 'ko'
        ? `**[Essential Guide to Competition Math (C&P) Topic 2.4 별과 막대 (0 이상 허용)]**\n\n$0$ 이상인 정수 변수 $${k}$개의 합이 $${total}$일 때는, 각 변수에 $1$씩 더해 양의 정수 문제로 바꿉니다 (합은 $${total} + ${k}$):\n\n$$\\binom{${total} + ${k} - 1}{${k} - 1} = ${ans}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} ($${ans}$가지)** 입니다.`
        : `**[Essential Guide to Competition Math (C&P) Topic 2.4 Stars and Bars (Nonnegative)]**\n\nFor $${k}$ nonnegative-integer variables summing to $${total}$, substitute $x_i' = x_i + 1$ to reduce to the positive case with sum $${total} + ${k}$:\n\n$$\\binom{${total} + ${k} - 1}{${k} - 1} = ${ans}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`);

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // 14. PROBABILITY
  // -----------------------------------------------------------------------
  'probability': (lang) => {
    const variant = pickRandom(['dice-sum', 'conditional', 'geometric', 'combinatorial', 'complementary-dice-product']);

    if (variant === 'complementary-dice-product') {
      // AMC 8 Prep Vol. 4 Ch.24: Complementary probability
      const condition = pickRandom(['even-product', 'at-least-one-white']);
      if (condition === 'even-product') {
        const ans = `\\frac{3}{4}`;

        const { choices, correctIdx } = buildChoices(ans, (i) => {
          if (i === 1) return `\\frac{1}{4}`; // both odd
          if (i === 2) return `\\frac{1}{2}`; // naive 50%
          if (i === 3) return `\\frac{5}{6}`;
          return `\\frac{2}{3}`;
        });

        const question = lang === 'ko'
          ? `서로 다른 두 개의 표준 주사위를 동시에 던질 때, 나오는 두 눈의 곱이 **짝수**일 확률은 얼마입니까?`
          : `When two fair standard six-sided dice are rolled simultaneously, what is the probability that the product of the two numbers rolled is **even**?`;

        const explanation = lang === 'ko'
          ? `**[AMC 8 Prep Vol. 4 Ch.24 여사건의 확률(Complementary Probability)]**\n\n두 수의 곱이 홀수가 되는 유일한 경우는 **두 수 모두 홀수**일 때뿐입니다:\n\n각 주사위에서 홀수 $\\{1, 3, 5\\}$가 나올 확률은 각각 $\\frac{3}{6} = \\frac{1}{2}$입니다.\n\n따라서 두 눈 모두 홀수일 확률은:\n\n$$P(\\text{두 수 모두 홀수}) = \\frac{1}{2} \\times \\frac{1}{2} = \\frac{1}{4}$$\n\n곱이 짝수일 사건은 위 사건의 여사건이므로:\n\n$$P(\\text{곱이 짝수}) = 1 - P(\\text{두 수 모두 홀수}) = 1 - \\frac{1}{4} = \\frac{3}{4}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} ($${ans}$)** 입니다.`
          : `**[AMC 8 Prep Vol. 4 Ch.24 Complementary Probability]**\n\nThe product of two integers is odd if and only if **both integers are odd**.\n\nThe probability of rolling an odd number $\\{1, 3, 5\\}$ on one die is $\\frac{3}{6} = \\frac{1}{2}$.\n\nThus, the probability that both dice show odd numbers is:\n\n$$P(\\text{both odd}) = \\frac{1}{2} \\times \\frac{1}{2} = \\frac{1}{4}$$\n\nThe product being even is the complement of this event:\n\n$$P(\\text{even product}) = 1 - \\frac{1}{4} = \\frac{3}{4}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

        return { question, choices, correctIdx, explanation };
      }

      // at least one white marble drawn without replacement
      const w = randInt(3, 6);
      const b = randInt(2, 5);
      const total = w + b;
      const bothBlueNumer = b * (b - 1);
      const totalDenom = total * (total - 1);
      const atLeastOneNumer = totalDenom - bothBlueNumer;
      const g = gcd(atLeastOneNumer, totalDenom);
      const num = atLeastOneNumer / g;
      const den = totalDenom / g;
      const ans = `\\frac{${num}}{${den}}`;

      const { choices, correctIdx } = buildChoices(ans, (i) => {
        if (i === 1) {
          const g1 = gcd(bothBlueNumer, totalDenom);
          return `\\frac{${bothBlueNumer / g1}}{${totalDenom / g1}}`; // both blue
        }
        if (i === 2) return `\\frac{${w}}{${total}}`; // single draw prob
        if (i === 3) {
          const g3 = gcd(num - 1, den);
          return `\\frac{${Math.max(1, num - 1) / g3}}{${den / g3}}`;
        }
        const gi = gcd(num, den + i);
        return `\\frac{${num / gi}}{${(den + i) / gi}}`;
      });

      const question = lang === 'ko'
        ? `주머니 속에 흰 구슬 $${w}$개와 파란 구슬 $${b}$개가 들어 있습니다. 이 주머니에서 구슬 $2$개를 임의로 동시에 꺼낼 때, **적어도 한 개가 흰 구슬**일 확률은 얼마입니까?`
        : `A bag contains $${w}$ white marbles and $${b}$ blue marbles. If two marbles are drawn at random without replacement, what is the probability that **at least one** marble is white?`;

      const explanation = lang === 'ko'
        ? `**[AMC 8 Prep Vol. 4 Ch.24 여사건의 확률: 적어도 하나(At least one)]**\n\n'적어도 하나가 흰 구슬'인 사건의 여사건은 '꺼낸 $2$개 모두 파란 구슬'인 사건입니다.\n\n전체 구슬은 $${w} + ${b} = ${total}$개입니다.\n$2$개 모두 파란 구슬일 확률:\n\n$$P(\\text{모두 파랑}) = \\frac{\\binom{${b}}{2}}{\\binom{${total}}{2}} = \\frac{${b} \\times ${b - 1}}{${total} \\times ${total - 1}} = \\frac{${bothBlueNumer}}{${totalDenom}}$$\n\n따라서 적어도 하나가 흰 구슬일 확률은:\n\n$$P(\\text{적어도 하나 흰색}) = 1 - \\frac{${bothBlueNumer}}{${totalDenom}} = \\frac{${atLeastOneNumer}}{${totalDenom}} = \\frac{${num}}{${den}}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} ($${ans}$)** 입니다.`
        : `**[AMC 8 Prep Vol. 4 Ch.24 Complementary Probability: At Least One]**\n\nThe complement of "at least one white marble" is "both marbles are blue".\n\nThere are $${total}$ marbles in total. The probability that both drawn marbles are blue is:\n\n$$P(\\text{both blue}) = \\frac{${b} \\times ${b - 1}}{${total} \\times ${total - 1}} = \\frac{${bothBlueNumer}}{${totalDenom}}$$\n\nUsing the complement rule:\n\n$$P(\\text{at least one white}) = 1 - \\frac{${bothBlueNumer}}{${totalDenom}} = \\frac{${num}}{${den}}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'combinatorial') {
      const n = randInt(8, 14);
      const r = randInt(3, Math.min(6, n - 2));
      const binom = (a, b) => {
        if (b < 0 || b > a) return 0;
        let result = 1;
        for (let k = 0; k < b; k += 1) result = (result * (a - k)) / (k + 1);
        return Math.round(result);
      };
      const numer = binom(n - 2, r - 2);
      const denom = binom(n, r);
      const g = gcd(numer, denom);
      const num = numer / g;
      const den = denom / g;
      const ans = `\\frac{${num}}{${den}}`;

      const { choices, correctIdx } = buildChoices(ans, (i) => {
        if (i === 1) {
          const alt = binom(n - 1, r - 1); // only conditioned on one specific person, not both
          const g1 = gcd(alt, denom);
          return `\\frac{${alt / g1}}{${denom / g1}}`;
        }
        if (i === 2) return `\\frac{2}{${n}}`; // naive guess
        const gi = gcd(num, den + i);
        return `\\frac{${num / gi}}{${(den + i) / gi}}`;
      });

      const question = lang === 'ko'
        ? `학생 $${n}$명 중에서 무작위로 $${r}$명을 뽑아 위원회를 구성합니다. 특정한 두 학생 A, B가 모두 위원회에 뽑힐 확률은 얼마입니까?`
        : `A committee of $${r}$ people is chosen at random from a group of $${n}$ people. What is the probability that two specific people, A and B, are both chosen?`;

      const explanation = lang === 'ko'
        ? `**[Essential Guide to Competition Math (Fundamentals) Topic 3.2 조합적 확률]**\n\n전체 경우의 수는 $\\binom{${n}}{${r}}$이고, A와 B가 모두 뽑히는 경우의 수는 나머지 $${n - 2}$명 중 $${r - 2}$명을 뽑는 $\\binom{${n - 2}}{${r - 2}}$입니다:\n\n$$P = \\frac{\\binom{${n - 2}}{${r - 2}}}{\\binom{${n}}{${r}}} = \\frac{${numer}}{${denom}} = ${ans}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]}** 입니다.`
        : `**[Essential Guide to Competition Math (Fundamentals) Topic 3.2 Combinatorial Probability]**\n\nThe total number of committees is $\\binom{${n}}{${r}}$, and the number with both A and B is $\\binom{${n - 2}}{${r - 2}}$ (choosing the rest from the remaining $${n - 2}$ people):\n\n$$P = \\frac{\\binom{${n - 2}}{${r - 2}}}{\\binom{${n}}{${r}}} = \\frac{${numer}}{${denom}} = ${ans}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]}**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'dice-sum') {
      const targetSum = pickRandom([7, 8, 9, 10]);
      let favorable = 0;
      for (let d1 = 1; d1 <= 6; d1 += 1) {
        for (let d2 = 1; d2 <= 6; d2 += 1) {
          if (d1 + d2 === targetSum) favorable += 1;
        }
      }
      const g = gcd(favorable, 36);
      const num = favorable / g;
      const den = 36 / g;
      const ans = `\\frac{${num}}{${den}}`;

      const { choices, correctIdx } = buildChoices(ans, (i) => {
        if (i === 1) {
          const g1 = gcd(num + 1, den);
          return `\\frac{${(num + 1) / g1}}{${den / g1}}`;
        }
        if (i === 2) {
          const g2 = gcd(Math.max(1, num - 1), den);
          return `\\frac{${Math.max(1, num - 1) / g2}}{${den / g2}}`;
        }
        // Guaranteed-fresh for every later retry: perturb the denominator by i so this
        // never repeats the same wrong fraction twice within the retry loop.
        const g3 = gcd(favorable, 36 + i);
        return `\\frac{${favorable / g3}}{${(36 + i) / g3}}`;
      });

      const question = lang === 'ko'
        ? `서로 다른 두 개의 주사위를 동시에 던질 때, 나오는 두 눈의 수의 합이 $${targetSum}$이 될 확률은 얼마입니까?`
        : `When two fair standard six-sided dice are rolled simultaneously, what is the probability that the sum of the numbers rolled is $${targetSum}$?`;

      const explanation = lang === 'ko'
        ? `**[주사위 확률과 표본공간]**\n\n두 주사위를 던질 때 나오는 모든 경우의 수는 $6 \\times 6 = 36$가지입니다.\n\n두 눈의 합이 $${targetSum}$이 되는 순서쌍 $(d_1, d_2)$의 개수는 총 $${favorable}$가지입니다.\n\n따라서 확률은:\n\n$$P = \\frac{${favorable}}{36} = \\frac{${num}}{${den}}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} ($${ans}$)** 입니다.`
        : `**[Dice Probability & Sample Space]**\n\nThe total number of outcomes when rolling two dice is $6 \\times 6 = 36$.\n\nThere are $${favorable}$ pairs $(d_1, d_2)$ that sum to $${targetSum}$.\n\nThus the probability is $\\frac{${favorable}}{36} = \\frac{${num}}{${den}}$.\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]}**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'conditional') {
      // Bag of colored items; given at least one drawn is the target color, find P(both target).
      // From "Essential Guide to Competition Math (C&P)" Topic 3.2 Conditional Probability.
      const otherColors = [randInt(1, 3), randInt(1, 3)];
      const m = randInt(3, 6); // target color count
      const other = otherColors[0] + otherColors[1];
      const totalItems = m + other;
      const c2 = (x) => (x * (x - 1)) / 2;
      const numer = c2(m);
      const denom = c2(m) + m * other; // = C(total,2) - C(other,2)
      const g = gcd(numer, denom);
      const num = numer / g;
      const den = denom / g;
      const ansStr = `\\frac{${num}}{${den}}`;

      const { choices, correctIdx } = buildChoices(ansStr, (i) => {
        if (i === 1) {
          const g1 = gcd(c2(m), c2(totalItems));
          return `\\frac{${c2(m) / g1}}{${c2(totalItems) / g1}}`; // forgot to condition on B at all
        }
        if (i === 2) return `\\frac{1}{${m}}`; // naive: 1/(number of green)
        // Guaranteed-fresh for every later retry: denominator grows with i, so this
        // never repeats the same wrong fraction twice within the retry loop.
        const gi = gcd(num, den + i);
        return `\\frac{${num / gi}}{${(den + i) / gi}}`;
      });

      const question = lang === 'ko'
        ? `가방에 빨간 구슬이 $${otherColors[0]}$개, 파란 구슬이 $${otherColors[1]}$개, 초록 구슬이 $${m}$개 들어 있습니다. 이 중 $2$개를 임의로 꺼낼 때, 적어도 하나가 초록 구슬이라는 조건 하에서 두 개 모두 초록 구슬일 확률은 얼마입니까?`
        : `A bag has $${otherColors[0]}$ red beads, $${otherColors[1]}$ blue beads, and $${m}$ green beads. If two beads are drawn at random, what is the probability that both are green, given that at least one of them is green?`;

      const explanation = lang === 'ko'
        ? `**[Essential Guide to Competition Math (C&P) Topic 3.2 조건부확률]**\n\n사건 $A$ = "둘 다 초록", 사건 $B$ = "적어도 하나가 초록"이라 하면, 전체 $${totalItems}$개 중 초록이 아닌 것은 $${other}$개이므로\n\n$$P(A|B) = \\frac{n(A)}{n(B)} = \\frac{\\binom{${m}}{2}}{\\binom{${totalItems}}{2} - \\binom{${other}}{2}} = \\frac{${c2(m)}}{${denom}} = ${ansStr}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]}** 입니다.`
        : `**[Essential Guide to Competition Math (C&P) Topic 3.2 Conditional Probability]**\n\nLet $A$ = "both green", $B$ = "at least one green". Out of $${totalItems}$ beads, $${other}$ are not green, so\n\n$$P(A|B) = \\frac{n(A)}{n(B)} = \\frac{\\binom{${m}}{2}}{\\binom{${totalItems}}{2} - \\binom{${other}}{2}} = \\frac{${c2(m)}}{${denom}} = ${ansStr}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]}**.`;

      return { question, choices, correctIdx, explanation };
    }

    // geometric probability: dart lands uniformly in a square, find P(within r of a corner)
    const S = randInt(6, 12);
    const r = randInt(2, S - 1);
    const rr = r * r;
    const ss = S * S;
    // Reduce every "Nπ/D" candidate to lowest terms first, so distractors that are
    // algebraically equal (e.g. forgetting to reduce) never appear as two different-
    // looking-but-numerically-identical choices.
    const piFrac = (n, d) => {
      const g = gcd(n, d);
      return `\\frac{${n / g}\\pi}{${d / g}}`;
    };
    const ansStr = piFrac(rr, 4 * ss);

    const { choices, correctIdx } = buildChoices(ansStr, (i) => {
      if (i === 1) return piFrac(rr, ss); // forgot the quarter-circle factor of 4
      if (i === 2) return piFrac(rr, 2 * ss); // used a semicircle instead of a quarter-circle
      if (i === 3) {
        const g = gcd(rr, 4 * ss);
        return `\\frac{${rr / g}}{${(4 * ss) / g}}`; // forgot the π entirely
      }
      // Guaranteed-fresh for every later retry: perturb the denominator by i so this
      // never repeats the same wrong fraction twice within the retry loop.
      return piFrac(rr, 4 * ss + i);
    });

    const question = lang === 'ko'
      ? `한 변의 길이가 $${S}$인 정사각형 안에 다트를 임의로 던집니다. 다트가 정사각형의 한 꼭짓점으로부터 거리 $${r}$ 이내에 떨어질 확률은 얼마입니까?`
      : `A dart is thrown uniformly at random inside a square with side length $${S}$. What is the probability that it lands within a distance of $${r}$ from one specific corner?`;

    const explanation = lang === 'ko'
      ? `**[Essential Guide to Competition Math (C&P) Topic 3.3 기하학적 확률]**\n\n한 꼭짓점에서 거리 $${r}$ 이내의 영역은 반지름 $${r}$인 사분원(넓이 $\\frac{\\pi \\cdot ${r}^2}{4}$)입니다. 기하학적 확률은 넓이의 비이므로:\n\n$$P = \\frac{\\frac{1}{4}\\pi ${r}^2}{${S}^2} = ${ansStr}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]}** 입니다.`
      : `**[Essential Guide to Competition Math (C&P) Topic 3.3 Geometric Probability]**\n\nThe region within distance $${r}$ of one corner is a quarter-circle of radius $${r}$ (area $\\frac{\\pi \\cdot ${r}^2}{4}$). Geometric probability is the ratio of areas:\n\n$$P = \\frac{\\frac{1}{4}\\pi ${r}^2}{${S}^2} = ${ansStr}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]}**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // 15. PRIMES & FACTORIZATION (The Essential Guide to Competition Math: Number Theory Topic 1.3)
  // -----------------------------------------------------------------------
  'primes-factorization': (lang) => {
    const variant = pickRandom(['prime-parity-sum', 'square-root-primality', 'prime-factor-count', 'largest-prime-factor', 'sum-of-prime-factors']);

    if (variant === 'prime-parity-sum') {
      // AMC 8 Prep Vol. 3 Ch.15 Prime Numbers: sum of two primes is odd => one must be 2
      const candidatePrimes = [31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83];
      const qPrime = pickRandom(candidatePrimes);
      const sumVal = 2 + qPrime; // odd sum
      const prodVal = 2 * qPrime;

      const { choices, correctIdx } = buildChoices(prodVal, (i) => {
        if (i === 1) return 3 * (sumVal - 3);
        if (i === 2) return prodVal + 6;
        if (i === 3) return prodVal - 6;
        return prodVal + randInt(4, 18) * (i % 2 === 0 ? 1 : -1);
      });

      const question = lang === 'ko'
        ? `두 소수 $p, q$의 합이 $${sumVal}$일 때, 두 소수의 곱 $p \\times q$의 값은 얼마입니까?`
        : `The sum of two prime numbers $p$ and $q$ is $${sumVal}$. What is their product $p \\times q$?`;

      const explanation = lang === 'ko'
        ? `**[AMC 8 Prep Vol. 3 Ch.15 소수의 유일한 짝수 성질과 홀짝성]**\n\n두 자연수의 합이 홀수($${sumVal}$)가 되려면 하나는 짝수이고 다른 하나는 홀수여야 합니다.\n\n소수 중에서 유일한 짝수는 **$2$** 뿐이므로, 두 소수 중 하나는 반드시 $2$입니다:\n\n$$p = 2, \\quad q = ${sumVal} - 2 = ${qPrime}$$\n\n($${qPrime}$ 또한 소수임을 확인)\n\n따라서 두 소수의 곱은:\n\n$$p \\times q = 2 \\times ${qPrime} = ${prodVal}$$\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} (${prodVal})** 입니다.`
        : `**[AMC 8 Prep Vol. 3 Ch.15 Prime Parity & The Unique Even Prime 2]**\n\nFor the sum of two integers to be odd ($${sumVal}$), one must be even and the other must be odd.\n\nSince $2$ is the only even prime number, one of the primes must be $2$:\n\n$$p = 2, \\quad q = ${sumVal} - 2 = ${qPrime}$$\n\n(We verify that $${qPrime}$ is indeed prime.)\n\nTherefore, their product is:\n\n$$p \\times q = 2 \\times ${qPrime} = ${prodVal}$$\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${prodVal})**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'square-root-primality') {
      // AMC 8 Prep Vol. 3 Ch.15 Theorem 3 (The Square Root Rule)
      const cases = [
        { A: 50, B: 600, lowVal: '7.07', highVal: '24.49', primes: [11, 13, 17, 19, 23], count: 5 },
        { A: 60, B: 500, lowVal: '7.75', highVal: '22.36', primes: [11, 13, 17, 19], count: 4 },
        { A: 40, B: 400, lowVal: '6.32', highVal: '20.00', primes: [7, 11, 13, 17, 19], count: 5 },
        { A: 100, B: 900, lowVal: '10.00', highVal: '30.00', primes: [11, 13, 17, 19, 23, 29], count: 6 },
        { A: 25, B: 250, lowVal: '5.00', highVal: '15.81', primes: [7, 11, 13], count: 3 },
      ];
      const selected = pickRandom(cases);
      const { A, B, primes, count } = selected;
      const primesStr = primes.join(', ');

      const { choices, correctIdx } = buildChoices(count, (i) => {
        if (i === 1) return count + 1;
        if (i === 2) return Math.max(1, count - 1);
        if (i === 3) return count + 2;
        return Math.max(1, count + i);
      });

      const question = lang === 'ko'
        ? `$\\sqrt{${A}}$ 보다 크고 $\\sqrt{${B}}$ 보다 작은 소수는 모두 몇 개입니까?`
        : `How many prime numbers are there between $\\sqrt{${A}}$ and $\\sqrt{${B}}$?`;

      const explanation = lang === 'ko'
        ? `**[AMC 8 Prep Vol. 3 Ch.15 제곱근 범위의 소수 판정]**\n\n주어진 제곱근 값의 범위를 근사치로 파악합니다:\n- $\\sqrt{${A}} \\approx ${selected.lowVal}$\n- $\\sqrt{${B}} \\approx ${selected.highVal}$\n\n따라서 구하는 소수는 $\\sqrt{${A}} < p < \\sqrt{${B}}$ 를 만족하는 소수들입니다:\n\n$$${primesStr}$$\n\n해당하는 소수는 총 **$${count}$개** 입니다.\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} ($${count}$개)** 입니다.`
        : `**[AMC 8 Prep Vol. 3 Ch.15 Primes in Square-Root Intervals]**\n\nEstimate the square root bounds:\n- $\\sqrt{${A}} \\approx ${selected.lowVal}$\n- $\\sqrt{${B}} \\approx ${selected.highVal}$\n\nThe primes satisfying $\\sqrt{${A}} < p < \\sqrt{${B}}$ are:\n\n$$${primesStr}$$\n\nThere are **${count}** such prime numbers in total.\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${count})**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'largest-prime-factor') {
      const items = [
        { N: 2021, factors: [43, 47], largest: 47, exp: '2021 = 43 \\times 47' },
        { N: 2022, factors: [2, 3, 337], largest: 337, exp: '2022 = 2 \\times 3 \\times 337' },
        { N: 2023, factors: [7, 17, 17], largest: 17, exp: '2023 = 7 \\times 17^2' },
        { N: 2024, factors: [2, 2, 2, 11, 23], largest: 23, exp: '2024 = 2^3 \\times 11 \\times 23' },
        { N: 1768, factors: [2, 2, 2, 13, 17], largest: 17, exp: '1768 = 2^3 \\times 13 \\times 17' },
        { N: 1260, factors: [2, 2, 3, 3, 5, 7], largest: 7, exp: '1260 = 2^2 \\times 3^2 \\times 5 \\times 7' },
        { N: 992, factors: [2, 2, 2, 2, 2, 31], largest: 31, exp: '992 = 2^5 \\times 31' },
      ];
      const item = pickRandom(items);
      const { N, largest, exp } = item;

      const { choices, correctIdx } = buildChoices(largest, (i) => {
        const primeDistractors = [7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53].filter((p) => p !== largest);
        return primeDistractors[i % primeDistractors.length];
      });

      const question = lang === 'ko'
        ? `자연수 $${N}$의 가장 큰 소인수를 구하세요.`
        : `Find the greatest prime factor of the positive integer $${N}$.`;

      const explanation = lang === 'ko'
        ? `**[The Essential Guide to Competition Math: Number Theory Topic 1.3 소인수분해와 최대 소인수]**\n\n자연수 $${N}$을 소인수분해하면 다음과 같습니다:\n\n$$${N} = ${exp}$$\n\n따라서 $${N}$의 소인수 중 가장 큰 것은 **$${largest}$** 입니다.\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} (${largest})** 입니다.`
        : `**[The Essential Guide to Competition Math: Number Theory Topic 1.3 Prime Factorization]**\n\nFactoring $${N}$ into primes:\n\n$$${N} = ${exp}$$\n\nThe greatest prime factor is **${largest}**.\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${largest})**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'sum-of-prime-factors') {
      const p1 = pickRandom([2, 3]);
      const p2 = pickRandom([5, 7]);
      const p3 = pickRandom([11, 13]);
      const N = p1 * p2 * p3;
      const ans = p1 + p2 + p3;

      const { choices, correctIdx } = buildChoices(ans, (i) => {
        if (i === 1) return ans + 2;
        if (i === 2) return Math.max(2, ans - 2);
        if (i === 3) return p1 * p2;
        return ans + i + 1;
      });

      const question = lang === 'ko'
        ? `자연수 $${N}$의 모든 서로 다른 소인수의 합을 구하세요.`
        : `Find the sum of all distinct prime factors of the integer $${N}$.`;

      const explanation = lang === 'ko'
        ? `**[The Essential Guide to Competition Math: Number Theory Topic 1.3 소인수의 합]**\n\n$${N}$을 소인수분해하면 $${N} = ${p1} \\times ${p2} \\times ${p3}$ 입니다.\n서로 다른 소인수는 $${p1}, ${p2}, ${p3}$ 이므로 그 합은:\n\n$$${p1} + ${p2} + ${p3} = ${ans}$$\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} (${ans})** 입니다.`
        : `**[The Essential Guide to Competition Math: Number Theory Topic 1.3 Sum of Distinct Prime Factors]**\n\nFactoring $${N}$ gives $${N} = ${p1} \\times ${p2} \\times ${p3}$.\nThe distinct prime factors are $${p1}, ${p2}, ${p3}$, and their sum is:\n\n$$${p1} + ${p2} + ${p3} = ${ans}$$\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${ans})**.`;

      return { question, choices, correctIdx, explanation };
    }

    // prime-factor-count
    const p = pickRandom([2, 3]);
    const q = pickRandom([5, 7]);
    const a = randInt(2, 3);
    const b = randInt(1, 2);
    const N = Math.pow(p, a) * Math.pow(q, b);
    const numDivisors = (a + 1) * (b + 1);

    const { choices, correctIdx } = buildChoices(numDivisors, (i) => {
      if (i === 1) return a * b;
      if (i === 2) return (a + 1) + (b + 1);
      if (i === 3) return numDivisors + 2;
      return Math.max(1, numDivisors - 2);
    });

    const question = lang === 'ko'
      ? `자연수 $${N}$의 양의 약수의 개수는 모두 몇 개입니까?`
      : `How many positive divisors does the integer $${N}$ have?`;

    const explanation = lang === 'ko'
      ? `**[The Essential Guide to Competition Math: Number Theory Topic 1.3 소인수분해와 약수의 개수]**\n\n자연수 $${N}$을 소인수분해하면:\n\n$$${N} = ${p}^{${a}} \\times ${q}^{${b}}$$\n\n약수의 개수 공식 $(a+1)(b+1)$에 의해:\n\n$$\\text{약수의 개수} = (${a} + 1) \\times (${b} + 1) = ${a + 1} \\times ${b + 1} = ${numDivisors}$$\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} ($${numDivisors}$개)** 입니다.`
      : `**[The Essential Guide to Competition Math: Number Theory Topic 1.3 Prime Factorization & Divisors]**\n\nFactoring $${N}$ into primes gives:\n\n$$${N} = ${p}^{${a}} \\times ${q}^{${b}}$$\n\nThe number of positive divisors is $(a+1)(b+1)$:\n\n$$(${a}+1)(${b}+1) = ${numDivisors}$$\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${numDivisors})**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // 16. SYMMETRY & TRANSFORMATIONS (Vol 2 Ch 7: Transformations)
  // -----------------------------------------------------------------------
  'symmetry-transformations': (lang) => {
    const variant = pickRandom(['cube-net-opposite', 'line-reflection', 'point-reflection', 'rotational-symmetry']);

    if (variant === 'cube-net-opposite') {
      // AMC 8 Prep Vol. 3 Ch.13 Section 2: 11 Nets of a Cube & Opposite Faces
      const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
      const targetFace = pickRandom(letters);
      const oppMap = { A: 'F', F: 'A', B: 'D', D: 'B', C: 'E', E: 'C' };
      const correctOpp = oppMap[targetFace];

      const { choices, correctIdx } = buildChoices(correctOpp, (i) => {
        const distractors = letters.filter(l => l !== correctOpp && l !== targetFace);
        return distractors[i % distractors.length];
      });

      const question = lang === 'ko'
        ? `정육면체의 전개도가 다음과 같이 주어졌습니다. 윗줄에 면 $A$, 가운뎃줄에 면 $B, C, D, E$가 왼쪽부터 차례로 이어져 있고, 아랫줄의 면 $C$ 바로 아래에 면 $F$가 붙어 있습니다.\n\n이 전개도를 접어서 정육면체를 만들 때, 면 **$${targetFace}$** 의 맞은편(평행한 면)에 오는 면은 어느 것입니까?`
        : `A net of a cube is given: the top row has face $A$ (attached above $C$), the middle row has faces $B, C, D, E$ in a line from left to right, and the bottom row has face $F$ attached directly below $C$.\n\nWhen this net is folded to form a cube, which face is opposite face **$${targetFace}$**?`;

      const explanation = lang === 'ko'
        ? `**[AMC 8 Prep Vol. 3 Ch.13 정육면체의 11가지 전개도와 맞은편 면 분석]**\n\n정육면체 1-4-1 전개도에서 마주보는(평행한) 두 면의 성질:\n1. 일직선상으로 연결된 4개의 면($B, C, D, E$)에서는 한 칸 건너뛴 면끼리 서로 마주봅니다:\n   - $B$의 맞은편은 $D$\n   - $C$의 맞은편은 $E$\n2. 양쪽으로 돌출된 면($A$와 $F$)끼리 접혀서 서로 마주봅니다:\n   - $A$의 맞은편은 $F$\n\n따라서 면 **$${targetFace}$** 의 맞은편 면은 **$${correctOpp}$** 입니다.\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} ($${correctOpp}$)** 입니다.`
        : `**[AMC 8 Prep Vol. 3 Ch.13 11 Nets of a Cube & Opposite Face Rules]**\n\nFor a standard 1-4-1 cube net:\n1. In the four-square horizontal strip ($B, C, D, E$), faces separated by one square are opposite:\n   - $B$ is opposite $D$\n   - $C$ is opposite $E$\n2. The two flap faces on opposite sides fold up to face each other:\n   - $A$ is opposite $F$\n\nTherefore, the face opposite **$${targetFace}$** is **$${correctOpp}$**.\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${correctOpp})**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'line-reflection') {
      const isXReflection = Math.random() < 0.5;
      const px = randInt(1, 8);
      const py = randInt(1, 8);

      if (isXReflection) {
        const lineA = randInt(px + 1, px + 5);
        const reflectedX = 2 * lineA - px;
        const reflectedY = py;
        const correctCoord = `(${reflectedX}, ${reflectedY})`;

        const { choices, correctIdx } = buildChoices(correctCoord, (i) => {
          if (i === 1) return `(${lineA + (lineA - px)}, ${py + 1})`;
          if (i === 2) return `(${reflectedX}, ${-py})`;
          if (i === 3) return `(${2 * lineA + px}, ${py})`;
          // Guaranteed-fresh for every later retry.
          return `(${reflectedX - 2 - i}, ${py})`;
        });

        const question = lang === 'ko'
          ? `좌표평면 위의 점 $P(${px}, ${py})$를 직선 $x = ${lineA}$에 대하여 대칭이동한 점 $P'$의 좌표는 무엇입니까?`
          : `Point $P(${px}, ${py})$ in the coordinate plane is reflected across the line $x = ${lineA}$ to point $P'$. What are the coordinates of $P'$?`;

        const explanation = lang === 'ko'
          ? `**[AMC 8 Prep Vol. 2 Ch.7 선대칭 변환 공식]**\n\n좌표평면 위의 점 $(x, y)$를 직선 $x = a$에 대하여 대칭이동한 점 $(x', y')$는:\n\n$$x' = 2a - x, \\quad y' = y$$\n\n주어진 점 $P(${px}, ${py})$와 직선 $x = ${lineA}$를 대입하면:\n\n$$x' = 2(${lineA}) - ${px} = ${2 * lineA} - ${px} = ${reflectedX}$$\n$$y' = ${py}$$\n\n따라서 대칭이동한 점 $P'$의 좌표는 $(${reflectedX}, ${reflectedY})$ 입니다.\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} ($${correctCoord}$)** 입니다.`
          : `**[AMC 8 Prep Vol. 2 Ch.7 Line Reflection Formula]**\n\nReflecting a point $(x, y)$ across a vertical line $x = a$ reflects only the $x$-coordinate across $a$ while the $y$-coordinate remains unchanged:\n\n$$x' = 2a - x, \\quad y' = y$$\n\nSubstituting $P(${px}, ${py})$ and $a = ${lineA}$:\n\n$$x' = 2(${lineA}) - ${px} = ${reflectedX}, \\quad y' = ${py}$$\n\nThus the reflected point is $(${reflectedX}, ${reflectedY})$.\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]}**.`;

        return { question, choices, correctIdx, explanation };
      } else {
        const lineB = randInt(py + 1, py + 5);
        const reflectedX = px;
        const reflectedY = 2 * lineB - py;
        const correctCoord = `(${reflectedX}, ${reflectedY})`;

        const { choices, correctIdx } = buildChoices(correctCoord, (i) => {
          if (i === 1) return `(${-px}, ${reflectedY})`;
          if (i === 2) return `(${px}, ${2 * lineB + py})`;
          if (i === 3) return `(${px + 1}, ${reflectedY})`;
          // Guaranteed-fresh for every later retry.
          return `(${px}, ${reflectedY - 2 - i})`;
        });

        const question = lang === 'ko'
          ? `좌표평면 위의 점 $P(${px}, ${py})$를 직선 $y = ${lineB}$에 대하여 대칭이동한 점 $P'$의 좌표는 무엇입니까?`
          : `Point $P(${px}, ${py})$ in the coordinate plane is reflected across the line $y = ${lineB}$ to point $P'$. What are the coordinates of $P'$?`;

        const explanation = lang === 'ko'
          ? `**[AMC 8 Prep Vol. 2 Ch.7 선대칭 변환 공식]**\n\n좌표평면 위의 점 $(x, y)$를 가로 직선 $y = b$에 대하여 대칭이동한 점 $(x', y')$는:\n\n$$x' = x, \\quad y' = 2b - y$$\n\n주어진 점 $P(${px}, ${py})$와 직선 $y = ${lineB}$를 대입하면:\n\n$$x' = ${px}$$\n$$y' = 2(${lineB}) - ${py} = ${2 * lineB} - ${py} = ${reflectedY}$$\n\n따라서 대칭이동한 점 $P'$의 좌표는 $(${reflectedX}, ${reflectedY})$ 입니다.\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} ($${correctCoord}$)** 입니다.`
          : `**[AMC 8 Prep Vol. 2 Ch.7 Line Reflection Formula]**\n\nReflecting a point $(x, y)$ across a horizontal line $y = b$ reflects only the $y$-coordinate across $b$:\n\n$$x' = x, \\quad y' = 2b - y$$\n\nSubstituting $P(${px}, ${py})$ and $b = ${lineB}$:\n\n$$x' = ${px}, \\quad y' = 2(${lineB}) - ${py} = ${reflectedY}$$\n\nThus the reflected point is $(${reflectedX}, ${reflectedY})$.\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]}**.`;

        return { question, choices, correctIdx, explanation };
      }
    }

    if (variant === 'rotational-symmetry') {
      const polygons = [
        { n: 5, ko: '정오각형', en: 'regular pentagon' },
        { n: 6, ko: '정육각형', en: 'regular hexagon' },
        { n: 8, ko: '정팔각형', en: 'regular octagon' },
        { n: 9, ko: '정구각형', en: 'regular nonagon' },
        { n: 10, ko: '정십각형', en: 'regular decagon' },
        { n: 12, ko: '정십이각형', en: 'regular dodecagon' },
      ];
      const poly = pickRandom(polygons);
      const angle = 360 / poly.n;
      const correctVal = `${angle}^\\circ`;

      const { choices, correctIdx } = buildChoices(correctVal, (i) => {
        if (i === 1) return `${Math.round(360 / (poly.n - 1))}^\\circ`;
        if (i === 2) return `${Math.round((180 * (poly.n - 2)) / poly.n)}^\\circ`;
        if (i === 3) return `${angle * 2}^\\circ`;
        // Guaranteed-fresh for every later retry (the small fixed polygon pool otherwise
        // makes these four formulas collide often for a handful of n values).
        return `${Math.max(5, angle - 15 - i)}^\\circ`;
      });

      const question = lang === 'ko'
        ? `${poly.ko}을 그 중심을 회전축으로 하여 회전시킬 때, 처음 도형과 완전히 겹쳐지도록 하는 최소의 양의 회전 각도는 몇 도($^\\circ$)입니까?`
        : `A ${poly.en} is rotated about its center. What is the smallest positive angle of rotation (in degrees) that maps the polygon onto itself?`;

      const explanation = lang === 'ko'
        ? `**[AMC 8 Prep Vol. 2 Ch.7 정다각형의 회전 대칭(Rotational Symmetry)]**\n\n변의 개수가 $n$개인 정다각형은 중심을 기준으로 한 바퀴($360^\\circ$)를 $n$등분한 각도만큼 회전할 때마다 원래 도형과 일치합니다:\n\n$$\\theta = \\frac{360^\\circ}{n}$$\n\n${poly.ko}은 $n = ${poly.n}$ 이므로:\n\n$$\\theta = \\frac{360^\\circ}{${poly.n}} = ${angle}^\\circ$$\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} ($${correctVal}$)** 입니다.`
        : `**[AMC 8 Prep Vol. 2 Ch.7 Rotational Symmetry of Regular Polygons]**\n\nA regular $n$-gon has rotational symmetry of order $n$. The smallest positive rotation angle mapping the figure onto itself is:\n\n$$\\theta = \\frac{360^\\circ}{n}$$\n\nFor a ${poly.en} ($n = ${poly.n}$):\n\n$$\\theta = \\frac{360^\\circ}{${poly.n}} = ${angle}^\\circ$$\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${correctVal})**.`;

      return { question, choices, correctIdx, explanation };
    }

    // Point reflection
    const px = randInt(1, 6);
    const py = randInt(1, 6);
    const cx = randInt(px + 1, px + 4);
    const cy = randInt(py + 1, py + 4);
    const rx = 2 * cx - px;
    const ry = 2 * cy - py;
    const correctCoord = `(${rx}, ${ry})`;

    const { choices, correctIdx } = buildChoices(correctCoord, (i) => {
      if (i === 1) return `(${cx + px}, ${cy + py})`;
      if (i === 2) return `(${rx}, ${-ry})`;
      if (i === 3) return `(${rx + 2}, ${ry - 1})`;
      // Guaranteed-fresh for every later retry.
      return `(${rx - 1 - i}, ${ry + 2})`;
    });

    const question = lang === 'ko'
      ? `좌표평면 위의 점 $P(${px}, ${py})$를 점 $C(${cx}, ${cy})$에 대하여 점대칭 이동한 점 $P'$의 좌표는 무엇입니까?`
      : `Point $P(${px}, ${py})$ is reflected through the point $C(${cx}, ${cy})$ to point $P'$. What are the coordinates of $P'$?`;

    const explanation = lang === 'ko'
      ? `**[AMC 8 Prep Vol. 2 Ch.7 점대칭 변환 공식]**\n\n점 $C(a, b)$는 선분 $PP'$의 중점이므로:\n\n$$\\frac{x + x'}{2} = a \\implies x' = 2a - x$$\n$$\\frac{y + y'}{2} = b \\implies y' = 2b - y$$\n\n주어진 값 $P(${px}, ${py})$, $C(${cx}, ${cy})$를 대입하면:\n\n$$x' = 2(${cx}) - ${px} = ${2 * cx} - ${px} = ${rx}$$\n$$y' = 2(${cy}) - ${py} = ${2 * cy} - ${py} = ${ry}$$\n\n따라서 $P'(${rx}, ${ry})$ 입니다.\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} ($${correctCoord}$)** 입니다.`
      : `**[AMC 8 Prep Vol. 2 Ch.7 Point Reflection Formula]**\n\nThe center of symmetry $C(a, b)$ is the midpoint of segment $PP'$:\n\n$$x' = 2a - x, \\quad y' = 2b - y$$\n\nWith $P(${px}, ${py})$ and $C(${cx}, ${cy})$:\n\n$$x' = 2(${cx}) - ${px} = ${rx}, \\quad y' = 2(${cy}) - ${py} = ${ry}$$\n\nThus $P' = (${rx}, ${ry})$.\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${correctCoord})**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // 17. CONSECUTIVE INTEGERS & EQUATIONS (Vol 2 Ch 8: Consecutive Integers)
  // -----------------------------------------------------------------------
  'equations-inequalities': (lang) => {
    const variant = pickRandom(['fraction-linear-equation', 'rational-cross-mult', 'consecutive-integers', 'consecutive-odd']);

    if (variant === 'fraction-linear-equation') {
      // AMC 8 Prep Vol. 3 Ch.18 Problem 4: Solving linear equations with fractions
      const b = pickRandom([2, 3]);
      const e = pickRandom([4, 5]);
      const L = lcm(b, e);
      const p1 = randInt(1, 4);
      const p2 = randInt(1, 4);
      const multB = randInt(3, 7);
      const xVal = multB * b - p1;
      const remE = (xVal - p2) % e;
      const adjP2 = p2 + remE;
      const K = (xVal + p1) / b - (xVal - adjP2) / e;

      const { choices, correctIdx } = buildChoices(xVal, (i) => {
        if (i === 1) return xVal + b;
        if (i === 2) return Math.max(1, xVal - e);
        if (i === 3) return xVal + 2;
        return xVal + randInt(3, 8) * (i % 2 === 0 ? 1 : -1);
      });

      const question = lang === 'ko'
        ? `다음 방정식을 만족하는 $x$의 값을 구하세요.\n\n$$\\frac{x + ${p1}}{${b}} = \\frac{x - ${adjP2}}{${e}} + ${K}$$`
        : `Find the value of $x$ that satisfies the equation:\n\n$$\\frac{x + ${p1}}{${b}} = \\frac{x - ${adjP2}}{${e}} + ${K}$$`;

      const explanation = lang === 'ko'
        ? `**[AMC 8 Prep Vol. 3 Ch.18 분수 계수 일차방정식 풀이]**\n\n양변에 분모의 최소공배수인 $${L}$을 곱하여 분수를 없앱니다:\n\n$$${L} \\times \\frac{x + ${p1}}{${b}} = ${L} \\times \\left(\\frac{x - ${adjP2}}{${e}} + ${K}\\right)$$\n$$${L / b}(x + ${p1}) = ${L / e}(x - ${adjP2}) + ${L * K}$$\n$$${L / b}x + ${(L / b) * p1} = ${L / e}x - ${(L / e) * adjP2} + ${L * K}$$\n\n동류항끼리 정리하면:\n\n$$(${L / b} - ${L / e})x = ${L * K - (L / e) * adjP2 - (L / b) * p1} \\implies ${L / b - L / e}x = ${(L / b - L / e) * xVal}$$\n$$x = ${xVal}$$\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} (${xVal})** 입니다.`
        : `**[AMC 8 Prep Vol. 3 Ch.18 Solving Linear Equations with Fractions]**\n\nMultiply both sides by $\\text{lcm}(${b}, ${e}) = ${L}$ to clear denominators:\n\n$$${L / b}(x + ${p1}) = ${L / e}(x - ${adjP2}) + ${L * K}$$\n\nExpanding and isolating $x$:\n\n$$(${L / b} - ${L / e})x = ${(L / b - L / e) * xVal} \\implies x = ${xVal}$$\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${xVal})**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'rational-cross-mult') {
      // AMC 8 Prep Vol. 3 Ch.18 Problem 5: (3x - 1)/(4x - 4) = 2/3
      const ans = -5;

      const { choices, correctIdx } = buildChoices(ans, (i) => {
        if (i === 1) return -3;
        if (i === 2) return -2;
        if (i === 3) return -7;
        return 3 + i;
      });

      const question = lang === 'ko'
        ? `다음 방정식을 만족하는 $x$의 값을 구하세요.\n\n$$\\frac{3x - 1}{4x - 4} = \\frac{2}{3}$$`
        : `Solve for $x$ in the equation:\n\n$$\\frac{3x - 1}{4x - 4} = \\frac{2}{3}$$`;

      const explanation = lang === 'ko'
        ? `**[AMC 8 Prep Vol. 3 Ch.18 대각선 곱을 이용한 유리방정식 풀이]**\n\n대각선 곱(Cross-multiplication) 성질 $\\frac{A}{B} = \\frac{C}{D} \\implies A \\times D = B \\times C$ 를 적용합니다:\n\n$$3(3x - 1) = 2(4x - 4)$$\n$$9x - 3 = 8x - 8$$\n\n$x$항과 상수항을 이항하여 정리하면:\n\n$$9x - 8x = -8 + 3 \\implies x = -5$$\n\n(분모 확인: $4(-5) - 4 = -24 \\neq 0$ 이므로 유효한 해입니다.)\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} (${ans})** 입니다.`
        : `**[AMC 8 Prep Vol. 3 Ch.18 Solving Rational Equations via Cross-Multiplication]**\n\nApply cross-multiplication:\n\n$$3(3x - 1) = 2(4x - 4)$$\n$$9x - 3 = 8x - 8$$\n$$9x - 8x = -8 + 3 \\implies x = -5$$\n\n(Checking denominator: $4(-5) - 4 = -24 \\neq 0$, so $x = -5$ is extraneous-free.)\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${ans})**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'consecutive-integers') {
      const k = pickRandom([5, 7, 9]);
      const start = randInt(11, 40);
      const median = start + (k - 1) / 2;
      const sum = k * median;
      const largest = start + k - 1;

      const { choices, correctIdx } = buildChoices(largest, (i) => {
        if (i === 1) return median;
        if (i === 2) return start;
        if (i === 3) return largest + 2;
        return Math.max(1, largest - 3);
      });

      const question = lang === 'ko'
        ? `연속하는 $${k}$개의 정수의 합이 $${sum}$입니다. 이 정수들 중 가장 큰 수는 얼마입니까?`
        : `The sum of $${k}$ consecutive integers is $${sum}$. What is the largest of these integers?`;

      const explanation = lang === 'ko'
        ? `**[AMC 8 Prep Vol. 2 Ch.8 연속한 정수의 합과 중앙값 성질]**\n\n연속하는 $k$개(홀수 개)의 정수의 합 $S$는 중앙값(Median)에 $k$를 곱한 것과 같습니다:\n\n$$\\text{중앙값} = \\frac{\\text{합}}{k} = \\frac{${sum}}{${k}} = ${median}$$\n\n총 $${k}$개의 정수 중 중앙값은 가운데에 위치하므로, 가장 큰 정수는 중앙값에서 $${(k - 1) / 2}$만큼 더 큰 수입니다:\n\n$$\\text{가장 큰 정수} = ${median} + \\frac{${k} - 1}{2} = ${median} + ${(k - 1) / 2} = ${largest}$$\n\n(검산: $${start} + ${start + 1} + \\dots + ${largest} = ${sum}$)\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} ($${largest}$)** 입니다.`
        : `**[AMC 8 Prep Vol. 2 Ch.8 Sum of Consecutive Integers & Median Property]**\n\nWhen adding an odd number ($k = ${k}$) of consecutive integers, their average is the exact middle integer (median):\n\n$$\\text{Median} = \\frac{\\text{Sum}}{k} = \\frac{${sum}}{${k}} = ${median}$$\n\nSince the median is in the middle of $${k}$ integers, the largest integer is:\n\n$$\\text{Largest} = ${median} + \\frac{${k}-1}{2} = ${median} + ${(k - 1) / 2} = ${largest}$$\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${largest})**.`;

      return { question, choices, correctIdx, explanation };
    }

    // Consecutive odd integers
    const k = pickRandom([3, 5, 7]);
    const startOdd = 2 * randInt(6, 25) + 1;
    const median = startOdd + (k - 1);
    const sum = k * median;
    const largest = startOdd + 2 * (k - 1);

    const { choices, correctIdx } = buildChoices(largest, (i) => {
      if (i === 1) return median;
      if (i === 2) return startOdd;
      if (i === 3) return largest + 4;
      return Math.max(1, largest - 4);
    });

    const question = lang === 'ko'
      ? `연속하는 $${k}$개의 홀수의 합이 $${sum}$입니다. 이 수들 중 가장 큰 홀수는 얼마입니까?`
      : `The sum of $${k}$ consecutive odd integers is $${sum}$. What is the largest of these integers?`;

    const explanation = lang === 'ko'
      ? `**[AMC 8 Prep Vol. 2 Ch.8 연속한 홀수의 합]**\n\n연속하는 홀수들은 $2$씩 증가하는 등차수열을 이룹니다. $${k}$개의 홀수의 중앙값은:\n\n$$\\text{중앙값} = \\frac{\\text{합}}{${k}} = \\frac{${sum}}{${k}} = ${median}$$\n\n가장 큰 홀수는 중앙값보다 ${(k - 1)} \\times 2 = ${2 * (k - 1)}$만큼 큽니다:\n\n$$\\text{가장 큰 홀수} = ${median} + ${2 * (k - 1)} = ${largest}$$\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} ($${largest}$)** 입니다.`
      : `**[AMC 8 Prep Vol. 2 Ch.8 Sum of Consecutive Odd Integers]**\n\nConsecutive odd numbers have a common difference of $2$. The median is:\n\n$$\\text{Median} = \\frac{${sum}}{${k}} = ${median}$$\n\nThe largest integer is $(k-1)$ steps of $2$ above the median:\n\n$$\\text{Largest} = ${median} + ${(k - 1) * 2} = ${largest}$$\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${largest})**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // 18. SETS & VENN DIAGRAMS (Vol 2 Ch 10: Sets and Venn Diagrams)
  // -----------------------------------------------------------------------
  'venn-sets': (lang) => {
    if (Math.random() < 0.35) {
      // triple-union: build 7 mutually exclusive regions directly so every derived count
      // (|A|, |B|, |C|, pairwise and triple intersections, union) is automatically consistent.
      const onlyA = randInt(8, 20);
      const onlyB = randInt(8, 20);
      const onlyC = randInt(8, 20);
      const ab = randInt(3, 8);
      const ac = randInt(3, 8);
      const bc = randInt(3, 8);
      const abc = randInt(1, 4);
      const A = onlyA + ab + ac + abc;
      const B = onlyB + ab + bc + abc;
      const C = onlyC + ac + bc + abc;
      const AB = ab + abc;
      const AC = ac + abc;
      const BC = bc + abc;
      const union = onlyA + onlyB + onlyC + ab + ac + bc + abc;

      const { choices, correctIdx } = buildChoices(union, (i) => {
        if (i === 1) return A + B + C; // forgot to subtract any overlaps at all
        if (i === 2) return A + B + C - AB - AC - BC; // forgot to add back the triple overlap
        if (i === 3) return union - abc;
        return union + i + 2;
      });

      const question = lang === 'ko'
        ? `어느 동아리 박람회에서 학생들의 관심사를 조사했습니다. 축구에 관심 있는 학생은 $${A}$명, 농구는 $${B}$명, 야구는 $${C}$명입니다. 축구와 농구 모두에 관심 있는 학생은 $${AB}$명, 축구와 야구 모두는 $${AC}$명, 농구와 야구 모두는 $${BC}$명이며, 세 가지 모두에 관심 있는 학생은 $${abc}$명입니다. 적어도 한 가지 운동에 관심 있는 학생은 모두 몇 명입니까?`
        : `At a club fair, $${A}$ students are interested in soccer, $${B}$ in basketball, and $${C}$ in baseball. $${AB}$ are interested in both soccer and basketball, $${AC}$ in both soccer and baseball, $${BC}$ in both basketball and baseball, and $${abc}$ in all three. How many students are interested in at least one of the three sports?`;

      const explanation = lang === 'ko'
        ? `**[Essential Guide to Competition Math (Fundamentals) Topic 1.2 세 집합의 포함배제의 원리]**\n\n$$|A\\cup B\\cup C| = |A|+|B|+|C| - |A\\cap B| - |A\\cap C| - |B\\cap C| + |A\\cap B\\cap C|$$\n\n$$= ${A}+${B}+${C} - ${AB} - ${AC} - ${BC} + ${abc} = ${union}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} ($${union}$명)** 입니다.`
        : `**[Essential Guide to Competition Math (Fundamentals) Topic 1.2 Three-Set Inclusion-Exclusion]**\n\n$$|A\\cup B\\cup C| = |A|+|B|+|C| - |A\\cap B| - |A\\cap C| - |B\\cap C| + |A\\cap B\\cap C|$$\n\n$$= ${A}+${B}+${C} - ${AB} - ${AC} - ${BC} + ${abc} = ${union}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${union})**.`;

      return { question, choices, correctIdx, explanation };
    }

    const total = randInt(40, 90);
    const neither = randInt(5, 15);
    const inUnion = total - neither;
    const both = randInt(8, 22);
    const onlyA = randInt(10, 25);
    const onlyB = inUnion - onlyA - both;
    const A = onlyA + both;
    const B = onlyB + both;

    const askBoth = Math.random() < 0.6;
    if (askBoth) {
      const { choices, correctIdx } = buildChoices(both, (i) => {
        if (i === 1) return A + B - total;
        if (i === 2) return Math.abs(A - B);
        if (i === 3) return both + 4;
        return Math.max(1, both - 4);
      });

      const question = lang === 'ko'
        ? `어느 학교의 학생 $${total}$명을 대상으로 조사한 결과, $${A}$명이 수학 동아리에 가입했고, $${B}$명이 과학 동아리에 가입했습니다. 두 동아리 중 어느 곳에도 가입하지 않은 학생이 $${neither}$명일 때, 두 동아리에 모두 가입한 학생은 몇 명입니까?`
        : `In a group of $${total}$ students, $${A}$ joined the Math Club and $${B}$ joined the Science Club. If $${neither}$ students joined neither club, how many students joined both clubs?`;

      const explanation = lang === 'ko'
        ? `**[AMC 8 Prep Vol. 2 Ch.10 벤다이어그램과 포함배제의 원리(PIE)]**\n\n1. 적어도 한 동아리에 가입한 학생 수 $|A \\cup B|$는 전체 학생 수에서 아무 곳에도 가입하지 않은 학생 수를 뺀 값입니다:\n\n$$|A \\cup B| = ${total} - ${neither} = ${inUnion}$$\n\n2. 두 집합의 포함배제 원리 공식:\n\n$$|A \\cup B| = |A| + |B| - |A \\cap B|$$\n\n3. 양쪽 모두 가입한 학생 수 $|A \\cap B|$는:\n\n$$|A \\cap B| = |A| + |B| - |A \\cup B| = ${A} + ${B} - ${inUnion} = ${A + B} - ${inUnion} = ${both}$$\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} ($${both}$명)** 입니다.`
        : `**[AMC 8 Prep Vol. 2 Ch.10 Principle of Inclusion-Exclusion (PIE)]**\n\n1. The number of students in at least one club is the total minus those in neither:\n\n$$|A \\cup B| = ${total} - ${neither} = ${inUnion}$$\n\n2. By the Principle of Inclusion-Exclusion:\n\n$$|A \\cup B| = |A| + |B| - |A \\cap B|$$\n\n3. Solving for the intersection $|A \\cap B|$ (both clubs):\n\n$$|A \\cap B| = ${A} + ${B} - ${inUnion} = ${both}$$\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${both})**.`;

      return { question, choices, correctIdx, explanation };
    } else {
      const exactlyOne = onlyA + onlyB;
      const { choices, correctIdx } = buildChoices(exactlyOne, (i) => {
        if (i === 1) return inUnion;
        if (i === 2) return both;
        if (i === 3) return exactlyOne + 5;
        return Math.max(1, exactlyOne - 5);
      });

      const question = lang === 'ko'
        ? `학생 $${total}$명 중 $${A}$명이 축구를 좋아하고, $${B}$명이 농구를 좋아합니다. 두 운동을 모두 좋아하지 않는 학생이 $${neither}$명이고, 두 운동을 모두 좋아하는 학생이 $${both}$명일 때, 두 운동 중 오직 한 가지만 좋아하는 학생은 몇 명입니까?`
        : `Among $${total}$ students, $${A}$ like soccer and $${B}$ like basketball. If $${neither}$ students like neither and $${both}$ students like both, how many students like exactly one of the two sports?`;

      const explanation = lang === 'ko'
        ? `**[AMC 8 Prep Vol. 2 Ch.10 집합의 대칭차(오직 하나만 속하는 원소)]**\n\n적어도 하나의 운동을 좋아하는 학생 수는 $${total} - ${neither} = ${inUnion}$명입니다.\n\n두 운동 중 오직 한 가지만 좋아하는 학생 수는 합집합에서 교집합(둘 다 좋아하는 학생)을 뺀 것과 같습니다:\n\n$$\\text{오직 한 가지만} = |A \\cup B| - |A \\cap B| = ${inUnion} - ${both} = ${exactlyOne}$$\n\n(또는 오직 축구만 $${A} - ${both} = ${onlyA}$명, 오직 농구만 $${B} - ${both} = ${onlyB}$명이므로 $${onlyA} + ${onlyB} = ${exactlyOne}$명)\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} ($${exactlyOne}$명)** 입니다.`
        : `**[AMC 8 Prep Vol. 2 Ch.10 Symmetric Difference]**\n\nThe number of students liking at least one sport is $${total} - ${neither} = ${inUnion}$.\n\nSubtracting those who like both gives the number who like exactly one:\n\n$$\\text{Exactly one} = |A \\cup B| - |A \\cap B| = ${inUnion} - ${both} = ${exactlyOne}$$\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${exactlyOne})**.`;

      return { question, choices, correctIdx, explanation };
    }
  },

  // -----------------------------------------------------------------------
  // 19. GRID PATHS & ROUTING (Vol 2 Ch 11: Counting Techniques)
  // -----------------------------------------------------------------------
  'paths-grids': (lang) => {
    const x1 = randInt(1, 3);
    const y1 = randInt(1, 3);
    const dx = randInt(1, 3);
    const dy = randInt(1, 3);
    const W = x1 + dx;
    const H = y1 + dy;

    const nCr = (n, r) => {
      if (r < 0 || r > n) return 0;
      if (r === 0 || r === n) return 1;
      let res = 1;
      for (let i = 1; i <= r; i += 1) {
        res = (res * (n - i + 1)) / i;
      }
      return Math.round(res);
    };

    const ways1 = nCr(x1 + y1, x1);
    const ways2 = nCr(dx + dy, dx);
    const totalPaths = ways1 * ways2;

    const { choices, correctIdx } = buildChoices(totalPaths, (i) => {
      if (i === 1) return nCr(W + H, W);
      if (i === 2) return ways1 + ways2;
      if (i === 3) return totalPaths + 6;
      return Math.max(1, totalPaths - 4);
    });

    const question = lang === 'ko'
      ? `가로 $${W}$칸, 세로 $${H}$칸 크기의 직사각형 격자판이 있습니다. 점 $A(0, 0)$에서 점 $B(${W}, ${H})$까지 오른쪽이나 위쪽으로만 이동하는 최단 경로 중, 반드시 중간 지점 $C(${x1}, ${y1})$를 거쳐 가는 경로의 수는 모두 몇 가지입니까?`
      : `On a rectangular grid of size $${W} \\times ${H}$, how many shortest paths from $A(0, 0)$ to $B(${W}, ${H})$ move only right and up, and pass through the checkpoint $C(${x1}, ${y1})$?`;

    const explanation = lang === 'ko'
      ? `**[AMC 8 Prep Vol. 2 Ch.11 격자 최단 경로와 곱의 법칙]**\n\n최단 경로는 반드시 오른쪽(R) 또는 위쪽(U)으로만 이동해야 합니다.\n\n1. **$A(0, 0) \\to C(${x1}, ${y1})$ 이동**: 총 $${x1 + y1}$번(오른쪽 $${x1}$번, 위쪽 $${y1}$번) 이동하므로 경우의 수는:\n\n$$\\binom{${x1 + y1}}{${x1}} = \\frac{${x1 + y1}!}{${x1}! ${y1}!} = ${ways1}$$\n\n2. **$C(${x1}, ${y1}) \\to B(${W}, ${H})$ 이동**: 오른쪽으로 $${dx}$칸, 위쪽으로 $${dy}$칸(총 $${dx + dy}$번) 이동하므로:\n\n$$\\binom{${dx + dy}}{${dx}} = \\frac{${dx + dy}!}{${dx}! ${dy}!} = ${ways2}$$\n\n3. 곱의 법칙에 의해 $C$를 거치는 전체 경로의 수는:\n\n$$\\text{전체 경로} = ${ways1} \\times ${ways2} = ${totalPaths}$$\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} ($${totalPaths}$가지)** 입니다.`
      : `**[AMC 8 Prep Vol. 2 Ch.11 Grid Paths & Multiplication Rule]**\n\nEvery shortest path moves only Right ($R$) and Up ($U$):\n\n1. From $A(0, 0)$ to $C(${x1}, ${y1})$: requires $${x1}$ Right and $${y1}$ Up moves:\n\n$$\\binom{${x1 + y1}}{${x1}} = ${ways1}$$\n\n2. From $C(${x1}, ${y1})$ to $B(${W}, ${H})$: requires $${dx}$ Right and $${dy}$ Up moves:\n\n$$\\binom{${dx + dy}}{${dx}} = ${ways2}$$\n\n3. By the multiplication principle:\n\n$$\\text{Total Paths} = ${ways1} \\times ${ways2} = ${totalPaths}$$\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${totalPaths})**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // 20. PERMUTATIONS & RESTRICTED ARRANGEMENTS (Vol 2 Ch 11: Counting Techniques)
  // -----------------------------------------------------------------------
  'permutations-arrangements': (lang) => {
    const N = randInt(5, 7);
    const fact = (num) => {
      let r = 1;
      for (let i = 2; i <= num; i += 1) r *= i;
      return r;
    };

    const variant = pickRandom(['together', 'not-together', 'repeated-letters']);

    if (variant === 'repeated-letters') {
      // Multinomial arrangements of a word with repeated letters,
      // from Essential Guide to Competition Math (C&P) Topic 2.3.
      const words = [
        { word: 'BANANA', counts: [3, 2, 1] }, // A,N,B
        { word: 'MISSISSIPPI', counts: [4, 4, 2, 1] }, // I,S,P,M
        { word: 'ALABAMA', counts: [4, 1, 1, 1] }, // A,L,B,M
        { word: 'STATISTICS', counts: [3, 3, 2, 1, 1] }, // S,T,I,A,C
      ];
      const chosen = pickRandom(words);
      const n = chosen.word.length;
      let denom = 1;
      for (const c of chosen.counts) denom *= fact(c);
      const correctAns = fact(n) / denom;

      const { choices, correctIdx } = buildChoices(correctAns, (i) => {
        if (i === 1) return fact(n);
        if (i === 2) return fact(n) / fact(Math.max(...chosen.counts));
        if (i === 3) return correctAns * 2;
        return Math.max(1, Math.round(correctAns / 2));
      });

      const question = lang === 'ko'
        ? `단어 $\\text{"${chosen.word}"}$에 있는 모든 알파벳을 한 번씩 사용하여 만들 수 있는 서로 다른 문자열의 개수는 몇 개입니까?`
        : `How many distinct arrangements are there of all the letters in the word "${chosen.word}"?`;

      const countsStr = chosen.counts.map((c) => `${c}!`).join(' \\times ');
      const explanation = lang === 'ko'
        ? `**[Essential Guide to Competition Math (C&P) Topic 2.3 반복이 있는 순열]**\n\n전체 $${n}$개의 문자를 나열하는 방법의 수 $${n}!$에서, 같은 문자끼리 서로 바꿔도 구분되지 않는 중복을 나누어 줍니다:\n\n$$\\frac{${n}!}{${countsStr}} = ${correctAns}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} ($${correctAns}$가지)** 입니다.`
        : `**[Essential Guide to Competition Math (C&P) Topic 2.3 Permutations with Repetition]**\n\nDivide the naive $${n}!$ arrangements by the internal arrangements of each repeated letter (which look identical):\n\n$$\\frac{${n}!}{${countsStr}} = ${correctAns}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${correctAns})**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'together') {
      const correctAns = fact(N - 1) * 2;
      const { choices, correctIdx } = buildChoices(correctAns, (i) => {
        if (i === 1) return fact(N);
        if (i === 2) return fact(N - 1);
        if (i === 3) return fact(N - 2) * 2;
        return correctAns + 48;
      });

      const question = lang === 'ko'
        ? `서로 다른 $${N}$권의 책을 책꽂이에 일렬로 꽂으려고 합니다. 이 중 수학책과 과학책 두 권이 반드시 서로 이웃하게 꽂히는 방법의 수는 모두 몇 가지입니까?`
        : `In how many ways can $${N}$ distinct books be arranged on a shelf if a specific math book and a specific science book must be placed adjacent to each other?`;

      const explanation = lang === 'ko'
        ? `**[AMC 8 Prep Vol. 2 Ch.11 이웃한 조건 순열: 묶음법(Tie-Together Method)]**\n\n1. 반드시 이웃해야 하는 수학책과 과학책을 하나의 묶음($1$권)으로 생각합니다.\n2. 그러면 전체 책은 묶음 $1$개와 나머지 책 $${N - 2}$권으로 총 **$${N - 1}$개의 대상**을 일렬로 나열하는 것과 같습니다:\n\n$$(${N} - 1)! = ${N - 1}! = ${fact(N - 1)}$$\n\n3. 묶음 내부에서 수학책과 과학책의 순서를 바꾸는 방법이 $2! = 2$가지이므로:\n\n$$\\text{경우의 수} = ${fact(N - 1)} \\times 2 = ${correctAns}$$\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} ($${correctAns}$가지)** 입니다.`
        : `**[AMC 8 Prep Vol. 2 Ch.11 The Tie-Together (Block) Method]**\n\n1. Treat the math book and science book as a single block.\n2. We now arrange $(${N} - 1)$ items (the block + the other $${N - 2}$ books):\n\n$$(${N} - 1)! = ${fact(N - 1)}$$\n\n3. The two books inside the block can be ordered in $2! = 2$ ways:\n\n$$\\text{Total} = ${fact(N - 1)} \\times 2 = ${correctAns}$$\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${correctAns})**.`;

      return { question, choices, correctIdx, explanation };
    } else {
      const togetherWays = fact(N - 1) * 2;
      const totalWays = fact(N);
      const correctAns = totalWays - togetherWays;

      const { choices, correctIdx } = buildChoices(correctAns, (i) => {
        if (i === 1) return togetherWays;
        if (i === 2) return totalWays;
        if (i === 3) return correctAns + 48;
        return Math.max(1, correctAns - 48);
      });

      const question = lang === 'ko'
        ? `서로 다른 $${N}$권의 책을 책꽂이에 일렬로 꽂을 때, 수학책과 과학책 두 권이 서로 이웃하지 않도록 꽂는 방법의 수는 모두 몇 가지입니까?`
        : `In how many ways can $${N}$ distinct books be arranged on a shelf such that a math book and a science book are NOT adjacent to each other?`;

      const explanation = lang === 'ko'
        ? `**[AMC 8 Prep Vol. 2 Ch.11 여사건을 이용한 순열 계산]**\n\n'이웃하지 않는 경우의 수'는 전체 순열의 수에서 '이웃하는 경우의 수'를 빼서 구합니다:\n\n1. 아무 조건 없이 $${N}$권을 나열하는 총 경우의 수:\n\n$$${N}! = ${totalWays}$$\n\n2. 두 권이 이웃하는 경우의 수 (묶음법):\n\n$$(${N} - 1)! \\times 2! = ${fact(N - 1)} \\times 2 = ${togetherWays}$$\n\n3. 이웃하지 않는 경우의 수:\n\n$$\\text{경우의 수} = ${totalWays} - ${togetherWays} = ${correctAns}$$\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} ($${correctAns}$가지)** 입니다.`
        : `**[AMC 8 Prep Vol. 2 Ch.11 Complementary Counting for Permutations]**\n\nSubtract the arrangements where the two books are adjacent from the total unrestricted arrangements:\n\n1. Total unrestricted arrangements: $${N}! = ${totalWays}$\n2. Arrangements where they are together: $(${N}-1)! \\times 2 = ${togetherWays}$\n3. Arrangements where they are not adjacent:\n\n$$${totalWays} - ${togetherWays} = ${correctAns}$$\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${correctAns})**.`;

      return { question, choices, correctIdx, explanation };
    }
  },

  // -----------------------------------------------------------------------
  // Added from "The Essential Guide to Prealgebra" (Harim Yoo / Hermon House),
  // a Korean-published AMC/boarding-school-prep textbook — structure and solving
  // technique only, no source text or problems reproduced verbatim.
  // -----------------------------------------------------------------------
  'counting': (lang) => {
    const variant = pickRandom(['inclusive-range', 'evenly-spaced', 'digit-count', 'casework-complements']);

    if (variant === 'casework-complements') {
      const sub = pickRandom(['at-least-one-flip', 'not-divisible', 'direct-casework']);

      if (sub === 'direct-casework') {
        // Direct case enumeration (not a complement): case on y = 1, 2, 3, ... and count how
        // many keep x = N - 2y a positive integer. Computed by an explicit loop, not a closed
        // formula, so there's no off-by-one risk to verify.
        const N = randInt(12, 30);
        let correctAns = 0;
        for (let y = 1; N - 2 * y >= 1; y += 1) correctAns += 1;

        const { choices, correctIdx } = buildChoices(correctAns, (i) => {
          if (i === 1) return correctAns + 1;
          if (i === 2) return Math.max(1, correctAns - 1);
          if (i === 3) return Math.floor(N / 2);
          return correctAns + i + 2;
        });

        const question = lang === 'ko'
          ? `$x + 2y = ${N}$을 만족하는 양의 정수 순서쌍 $(x, y)$는 모두 몇 개입니까?`
          : `How many ordered pairs of positive integers $(x, y)$ satisfy $x + 2y = ${N}$?`;

        const explanation = lang === 'ko'
          ? `**[Essential Guide to Competition Math (Fundamentals) Topic 1.1 경우 나누기(Casework)]**\n\n$y=1, 2, 3, \\ldots$로 경우를 나누어 $x=${N}-2y$가 양의 정수가 되는 $y$의 값을 세면 됩니다. $y$가 커질수록 $x$가 줄어들다가 $0$ 이하가 되면 멈추므로, 총 **$${correctAns}$가지**입니다.\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} ($${correctAns}$가지)** 입니다.`
          : `**[Essential Guide to Competition Math (Fundamentals) Topic 1.1 Casework]**\n\nCase on $y=1,2,3,\\ldots$: each gives $x=${N}-2y$, which stays a positive integer until it drops to $0$ or below. Counting these cases gives **${correctAns}** pairs.\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${correctAns})**.`;

        return { question, choices, correctIdx, explanation };
      }

      if (sub === 'at-least-one-flip') {
        const N = randInt(4, 8);
        const total = 2 ** N;
        const correctAns = total - 1;
        const { choices, correctIdx } = buildChoices(correctAns, (i) => {
          if (i === 1) return total;
          if (i === 2) return N * 2;
          if (i === 3) return correctAns - 2;
          return correctAns + randInt(2, 6);
        });

        const question = lang === 'ko'
          ? `공정한 동전을 $${N}$번 던질 때, 적어도 한 번은 앞면이 나오는 경우의 수는 모두 몇 가지입니까?`
          : `A fair coin is flipped $${N}$ times. In how many outcomes does at least one flip come up heads?`;

        const explanation = lang === 'ko'
          ? `**[Essential Guide to Competition Math (C&P) Topic 1.4 여사건(Complement)]**\n\n"적어도 하나"는 여사건("전부 뒷면")을 빼서 구하는 것이 빠릅니다. 전체 경우의 수는 $2^${N}=${total}$이고, 모두 뒷면인 경우는 $1$가지뿐이므로:\n\n$$2^${N} - 1 = ${correctAns}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} ($${correctAns}$가지)** 입니다.`
          : `**[Essential Guide to Competition Math (C&P) Topic 1.4 Complement Counting]**\n\nFor "at least one," it's fastest to subtract the complement ("all tails") from the total. Total outcomes: $2^${N}=${total}$; all-tails outcomes: $1$:\n\n$$2^${N} - 1 = ${correctAns}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${correctAns})**.`;

        return { question, choices, correctIdx, explanation };
      }

      const N = randInt(80, 300);
      const k = pickRandom([3, 4, 6, 7]);
      const divisibleCount = Math.floor(N / k);
      const correctAns = N - divisibleCount;
      const { choices, correctIdx } = buildChoices(correctAns, (i) => {
        if (i === 1) return divisibleCount;
        if (i === 2) return correctAns + 1;
        if (i === 3) return correctAns - 1;
        return correctAns + randInt(2, 5);
      });

      const question = lang === 'ko'
        ? `$1$부터 $${N}$까지의 정수 중에서 $${k}$의 배수가 아닌 것은 모두 몇 개입니까?`
        : `Among the integers from $1$ to $${N}$, how many are NOT multiples of $${k}$?`;

      const explanation = lang === 'ko'
        ? `**[Essential Guide to Competition Math (C&P) Topic 1.4 여사건(Complement)]**\n\n$${k}$의 배수의 개수는 $\\left\\lfloor \\frac{${N}}{${k}} \\right\\rfloor = ${divisibleCount}$개이므로, 배수가 아닌 것은 전체에서 이를 뺀\n\n$$${N} - ${divisibleCount} = ${correctAns}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} ($${correctAns}$개)** 입니다.`
        : `**[Essential Guide to Competition Math (C&P) Topic 1.4 Complement Counting]**\n\nThere are $\\left\\lfloor \\frac{${N}}{${k}} \\right\\rfloor = ${divisibleCount}$ multiples of $${k}$, so the non-multiples number\n\n$$${N} - ${divisibleCount} = ${correctAns}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${correctAns})**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'inclusive-range') {
      const a = randInt(20, 60);
      const b = a + randInt(80, 250);
      const correctAns = b - a + 1;
      const { choices, correctIdx } = buildChoices(correctAns, (i) => {
        if (i === 1) return b - a;
        if (i === 2) return b - a - 1;
        if (i === 3) return correctAns + randInt(2, 5);
        return Math.max(1, correctAns - randInt(2, 5));
      });

      const question = lang === 'ko'
        ? `$${a}$부터 $${b}$까지의 정수는 모두 몇 개입니까? (양 끝 값 포함)`
        : `How many integers are there from $${a}$ to $${b}$, inclusive?`;

      const explanation = lang === 'ko'
        ? `**[Essential Guide to Prealgebra Ch.14 1대1 대응 (1-to-1 Counting)]**\n\n$${a}, ${a + 1}, \\ldots, ${b}$를 $1, 2, \\ldots$과 1대1로 대응시키면, 구하는 개수는\n\n$$${b} - ${a} + 1 = ${correctAns}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} ($${correctAns}$개)** 입니다.`
        : `**[Essential Guide to Prealgebra Ch.14 1-to-1 Counting]**\n\nMatching $${a}, ${a + 1}, \\ldots, ${b}$ one-to-one with $1, 2, \\ldots$, the count is\n\n$$${b} - ${a} + 1 = ${correctAns}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${correctAns})**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'evenly-spaced') {
      const step = pickRandom([2, 3, 4, 5]);
      const start = step * randInt(3, 8);
      const end = start + step * randInt(30, 80);
      const gap = (end - start) / step;
      const correctAns = gap + 1;
      const { choices, correctIdx } = buildChoices(correctAns, (i) => {
        if (i === 1) return gap;
        if (i === 2) return correctAns + 1;
        if (i === 3) return correctAns - 1;
        return correctAns + randInt(2, 4);
      });

      const question = lang === 'ko'
        ? `$${start}, ${start + step}, ${start + 2 * step}, \\ldots, ${end}$처럼 $${step}$씩 커지는 수열이 있습니다. 이 수열의 항은 모두 몇 개입니까?`
        : `Consider the list $${start}, ${start + step}, ${start + 2 * step}, \\ldots, ${end}$, increasing by $${step}$ each time. How many terms are in this list?`;

      const explanation = lang === 'ko'
        ? `**[Essential Guide to Prealgebra Ch.14 등간격 1대1 대응]**\n\n각 항에서 $${start}$을 빼고 $${step}$으로 나누면 $0, 1, 2, \\ldots$과 1대1 대응됩니다:\n\n$$\\frac{${end} - ${start}}{${step}} + 1 = ${gap} + 1 = ${correctAns}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} ($${correctAns}$개)** 입니다.`
        : `**[Essential Guide to Prealgebra Ch.14 Evenly-Spaced 1-to-1 Counting]**\n\nSubtract $${start}$ from each term and divide by $${step}$ to match with $0, 1, 2, \\ldots$:\n\n$$\\frac{${end} - ${start}}{${step}} + 1 = ${correctAns}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${correctAns})**.`;

      return { question, choices, correctIdx, explanation };
    }

    // digit-count
    const digitsUpTo = (n) => {
      let total = 0;
      let digits = 1;
      let start = 1;
      while (start <= n) {
        const end = Math.min(n, start * 10 - 1);
        total += (end - start + 1) * digits;
        digits += 1;
        start *= 10;
      }
      return total;
    };
    const N = randInt(150, 600);
    const correctAns = digitsUpTo(N);
    const { choices, correctIdx } = buildChoices(correctAns, (i) => {
      if (i === 1) return N;
      if (i === 2) return correctAns - 9;
      if (i === 3) return correctAns + 9;
      return correctAns + randInt(3, 15);
    });

    const question = lang === 'ko'
      ? `$1$부터 $${N}$까지의 양의 정수를 모두 종이에 적을 때, 사용되는 숫자(0~9)는 모두 몇 개입니까?`
      : `When all the positive integers from $1$ to $${N}$ are written down, how many digits are used in total?`;

    const explanation = lang === 'ko'
      ? `**[Essential Guide to Prealgebra Ch.14 자릿수 세기]**\n\n자릿수별 구간으로 나누어 셉니다 ($1$~$9$는 $9$개 $\\times 1$자리, $10$~$99$는 $90$개 $\\times 2$자리, ...), $${N}$까지 누적하면\n\n$$\\text{총 숫자 개수} = ${correctAns}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} ($${correctAns}$개)** 입니다.`
      : `**[Essential Guide to Prealgebra Ch.14 Digit Counting]**\n\nSplit by digit-length blocks ($1$–$9$: $9 \\times 1$ digit, $10$–$99$: $90 \\times 2$ digits, ...) up to $${N}$:\n\n$$\\text{Total digits} = ${correctAns}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${correctAns})**.`;

    return { question, choices, correctIdx, explanation };
  },

  'angles-plane-figures': (lang) => {
    const variant = pickRandom(['parallel-transversal', 'triangle-angle-sum', 'angle-bisector', 'star-polygon-angles']);

    if (variant === 'star-polygon-angles') {
      // AMC 8 Prep Vol. 5 Ch.25: Angles and Triangles - 5-pointed Star Vertex Angles
      const configs = [
        { a: 28, b: 36, c: 42, d: 34, e: 40 },
        { a: 35, b: 30, c: 45, d: 35, e: 35 },
        { a: 32, b: 38, c: 40, d: 30, e: 40 },
        { a: 25, b: 40, c: 35, d: 45, e: 35 },
        { a: 36, b: 36, c: 36, d: 36, e: 36 },
        { a: 30, b: 42, c: 28, d: 44, e: 36 },
      ];
      const cfg = pickRandom(configs);
      const { a, b, c, d, e } = cfg;
      const ans = `${e}^\\circ`;

      const { choices, correctIdx } = buildChoices(ans, (i) => {
        if (i === 1) return `${e + 10}^\\circ`;
        if (i === 2) return `${Math.max(10, e - 10)}^\\circ`;
        if (i === 3) return `${e + 5}^\\circ`;
        return `${Math.max(10, e - 5)}^\\circ`;
      });

      const question = lang === 'ko'
        ? `오각별(5-pointed star) 모양의 도형에서 다섯 개의 뾰족한 꼭짓점 각의 크기가 각각 $\\angle A = ${a}^\\circ$, $\\angle B = ${b}^\\circ$, $\\angle C = ${c}^\\circ$, $\\angle D = ${d}^\\circ$, 그리고 $\\angle E$입니다. 이때 $\\angle E$의 크기는 몇 도입니까?`
        : `In a 5-pointed star, the measures of four of the vertex angles are $\\angle A = ${a}^\\circ$, $\\angle B = ${b}^\\circ$, $\\angle C = ${c}^\\circ$, and $\\angle D = ${d}^\\circ$. What is the measure of the fifth vertex angle $\\angle E$?`;

      const explanation = lang === 'ko'
        ? `**[AMC 8 Prep Vol. 5 Ch.25 오각별 다각형의 꼭짓점 각의 합과 외각 정리]**\n\n오각별의 꼭짓점 각들은 삼각형들의 외각 관계를 두 번 적용하면 삼각형 하나의 내각으로 모을 수 있습니다.\n\n일반적으로 임의의 오각별에서 다섯 꼭짓점 각의 총합은 항상 $180^\\circ$입니다:\n\n$$\\angle A + \\angle B + \\angle C + \\angle D + \\angle E = 180^\\circ$$\n\n주어진 네 각을 대입하면:\n\n$$${a}^\\circ + ${b}^\\circ + ${c}^\\circ + ${d}^\\circ + \\angle E = 180^\\circ$$\n$$${a + b + c + d}^\\circ + \\angle E = 180^\\circ \\implies \\angle E = 180^\\circ - ${a + b + c + d}^\\circ = ${e}^\\circ$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans})** 입니다.`
        : `**[AMC 8 Prep Vol. 5 Ch.25 Star Polygon Angles & Exterior Angle Theorem]**\n\nBy repeatedly applying the exterior angle theorem, the five point angles of any 5-pointed star sum to the interior angles of a single triangle ($180^\\circ$):\n\n$$\\angle A + \\angle B + \\angle C + \\angle D + \\angle E = 180^\\circ$$\n\nSubstituting the given angles:\n\n$$${a}^\\circ + ${b}^\\circ + ${c}^\\circ + ${d}^\\circ + \\angle E = 180^\\circ$$\n$$\\angle E = 180^\\circ - ${a + b + c + d}^\\circ = ${e}^\\circ$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'angle-bisector') {
      // Build AB, AC, BD, DC from a shared ratio r1:r2 so BD/DC = AB/AC holds by construction,
      // with scale1 > scale2 guaranteeing BC < AB + AC (a valid triangle) — verified, not assumed.
      let r1;
      let r2;
      let scale1;
      let scale2;
      let ab;
      let ac;
      let BD;
      let DC;
      let BCtotal;
      let attempts = 0;
      do {
        r1 = randInt(1, 5);
        r2 = randInt(1, 5);
        scale2 = randInt(2, 5);
        scale1 = scale2 + randInt(2, 5);
        ab = r1 * scale1;
        ac = r2 * scale1;
        BD = r1 * scale2;
        DC = r2 * scale2;
        BCtotal = BD + DC;
        attempts += 1;
      } while ((ab + ac <= BCtotal || ab + BCtotal <= ac || ac + BCtotal <= ab) && attempts < 30);

      const { choices, correctIdx } = buildChoices(BD, (i) => {
        if (i === 1) return DC;
        if (i === 2) return Math.round((BCtotal * ac) / (ab + ac));
        if (i === 3) return BD + 2;
        return Math.max(1, BD - 2 - i);
      });

      const question = lang === 'ko'
        ? `삼각형 $ABC$에서 $\\overline{AD}$가 $\\angle A$의 이등분선이고 $D$는 $\\overline{BC}$ 위에 있습니다. $AB=${ab}$, $AC=${ac}$, $BC=${BCtotal}$일 때, $BD$의 길이를 구하세요.`
        : `In triangle $ABC$, $\\overline{AD}$ bisects $\\angle A$ with $D$ on $\\overline{BC}$. If $AB=${ab}$, $AC=${ac}$, and $BC=${BCtotal}$, find $BD$.`;

      const explanation = lang === 'ko'
        ? `**[Essential Guide to Competition Math (Fundamentals) Topic 6.2 각의 이등분선 정리]**\n\n각의 이등분선 정리에 의해 $\\frac{BD}{DC}=\\frac{AB}{AC}=\\frac{${ab}}{${ac}}$입니다. $BD+DC=${BCtotal}$이므로 비례식을 풀면:\n\n$$BD = ${BCtotal} \\times \\frac{${ab}}{${ab}+${ac}} = ${BD}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]}** 입니다.`
        : `**[Essential Guide to Competition Math (Fundamentals) Topic 6.2 Angle Bisector Theorem]**\n\nBy the Angle Bisector Theorem, $\\frac{BD}{DC}=\\frac{AB}{AC}=\\frac{${ab}}{${ac}}$. Since $BD+DC=${BCtotal}$, solving the proportion gives:\n\n$$BD = ${BCtotal} \\times \\frac{${ab}}{${ab}+${ac}} = ${BD}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]}**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'parallel-transversal') {
      const given = randInt(30, 150);
      const relation = pickRandom(['corresponding', 'alternate', 'co-interior']);
      const correctAns = relation === 'co-interior' ? 180 - given : given;
      const relationKo = relation === 'corresponding' ? '동위각' : relation === 'alternate' ? '엇각' : '같은 쪽 내각(동측내각)';
      const relationEn = relation === 'corresponding' ? 'corresponding angle' : relation === 'alternate' ? 'alternate angle' : 'co-interior (same-side interior) angle';

      const { choices, correctIdx } = buildChoices(correctAns, (i) => {
        if (i === 1) return 180 - correctAns;
        if (i === 2) return given;
        if (i === 3) return correctAns + randInt(5, 15);
        return Math.max(1, correctAns - randInt(5, 15));
      });

      const question = lang === 'ko'
        ? `두 평행선이 한 직선(횡단선)과 만날 때 생기는 한 각의 크기가 $${given}^\\circ$입니다. 이 각의 ${relationKo}의 크기는 몇 도입니까?`
        : `Two parallel lines are cut by a transversal, forming an angle of $${given}^\\circ$. What is the measure of its ${relationEn}, in degrees?`;

      const explanation = relation === 'co-interior'
        ? (lang === 'ko'
          ? `**[Essential Guide to Prealgebra Ch.10 평행선과 각]**\n\n같은 쪽 내각(동측내각)은 서로 보각(합이 $180^\\circ$)입니다:\n\n$$180^\\circ - ${given}^\\circ = ${correctAns}^\\circ$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} ($${correctAns}^\\circ$)** 입니다.`
          : `**[Essential Guide to Prealgebra Ch.10 Angles & Parallel Lines]**\n\nCo-interior angles are supplementary:\n\n$$180^\\circ - ${given}^\\circ = ${correctAns}^\\circ$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${correctAns}°)**.`)
        : (lang === 'ko'
          ? `**[Essential Guide to Prealgebra Ch.10 평행선과 각]**\n\n두 평행선이 한 횡단선과 만날 때, ${relationKo}은 서로 크기가 같습니다:\n\n$$${correctAns}^\\circ$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} ($${correctAns}^\\circ$)** 입니다.`
          : `**[Essential Guide to Prealgebra Ch.10 Angles & Parallel Lines]**\n\nWhen two parallel lines are cut by a transversal, ${relationEn}s are congruent:\n\n$$${correctAns}^\\circ$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${correctAns}°)**.`);

      return { question, choices, correctIdx, explanation };
    }

    // triangle-angle-sum via ratio
    const ratioPool = [[2, 3, 4], [1, 2, 3], [3, 4, 5], [2, 5, 8], [1, 4, 5], [3, 5, 7], [2, 3, 7], [1, 3, 5], [4, 5, 6], [1, 2, 6]];
    const [r1, r2, r3] = pickRandom(ratioPool);
    const sum = r1 + r2 + r3;
    const x = 180 / sum;
    const angles = [r1 * x, r2 * x, r3 * x];
    const correctAns = Math.max(...angles);
    const sorted = [...angles].sort((a, b) => a - b);

    const { choices, correctIdx } = buildChoices(correctAns, (i) => {
      if (i === 1) return sorted[0];
      if (i === 2) return sorted[1];
      if (i === 3) return correctAns + randInt(5, 15);
      return Math.max(1, correctAns - randInt(5, 15));
    });

    const question = lang === 'ko'
      ? `어떤 삼각형의 세 내각의 크기의 비가 $${r1} : ${r2} : ${r3}$일 때, 가장 큰 내각의 크기는 몇 도입니까?`
      : `The three interior angles of a triangle are in the ratio $${r1} : ${r2} : ${r3}$. What is the measure of the largest angle, in degrees?`;

    const explanation = lang === 'ko'
      ? `**[Essential Guide to Prealgebra Ch.10 삼각형의 내각의 합]**\n\n비의 합 $${r1}+${r2}+${r3}=${sum}$ 등분으로 $180^\\circ$를 나누면 한 등분은 $\\frac{180^\\circ}{${sum}}=${x}^\\circ$입니다. 가장 큰 비율(${Math.max(r1, r2, r3)})의 각은\n\n$$${Math.max(r1, r2, r3)} \\times ${x}^\\circ = ${correctAns}^\\circ$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} ($${correctAns}^\\circ$)** 입니다.`
      : `**[Essential Guide to Prealgebra Ch.10 Triangle Angle Sum]**\n\nDividing $180^\\circ$ into $${r1}+${r2}+${r3}=${sum}$ parts gives $\\frac{180^\\circ}{${sum}}=${x}^\\circ$ per part. The largest angle (${Math.max(r1, r2, r3)} parts) is\n\n$$${Math.max(r1, r2, r3)} \\times ${x}^\\circ = ${correctAns}^\\circ$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${correctAns}°)**.`;

    return { question, choices, correctIdx, explanation };
  },

  'quadrilaterals-polygons': (lang) => {
    const variant = pickRandom(['british-flag-theorem', 'trapezoid-butterfly', 'cyclic-quadrilateral', 'angle-ratio']);

    if (variant === 'british-flag-theorem') {
      // AMC 8 Prep Vol. 5 Ch.26 Rectangles and Squares: British Flag Theorem AP^2 + PC^2 = BP^2 + PD^2
      const quadruples = [
        [1, 8, 4, 7],   // 1 + 64 = 16 + 49 = 65
        [2, 9, 6, 7],   // 4 + 81 = 36 + 49 = 85
        [3, 11, 7, 9],  // 9 + 121 = 49 + 81 = 130
        [5, 10, 2, 11], // 25 + 100 = 4 + 121 = 125
        [4, 13, 8, 11], // 16 + 169 = 64 + 121 = 185
        [6, 17, 10, 15], // 36 + 289 = 100 + 225 = 325
        [5, 15, 9, 13], // 25 + 225 = 81 + 169 = 250
        [7, 11, 1, 13], // 49 + 121 = 1 + 169 = 170
        [8, 9, 1, 12],  // 64 + 81 = 1 + 144 = 145
      ];
      const [ap, pc, bp, pd] = pickRandom(quadruples);
      const correctAns = pd;

      const { choices, correctIdx } = buildChoices(correctAns, (i) => {
        if (i === 1) return pd + 1;
        if (i === 2) return Math.max(1, pd - 1);
        if (i === 3) return pd + 2;
        return Math.max(1, pd - 2);
      });

      const question = lang === 'ko'
        ? `직사각형 $ABCD$의 내부(또는 평면 위)에 점 $P$가 있습니다. 점 $P$에서 각 꼭짓점까지의 거리가 $AP = ${ap}$, $PC = ${pc}$, $BP = ${bp}$일 때, $PD$의 길이를 구하세요.`
        : `Point $P$ lies inside rectangle $ABCD$. If the distances from $P$ to three vertices are $AP = ${ap}$, $PC = ${pc}$, and $BP = ${bp}$, find the length of $PD$.`;

      const explanation = lang === 'ko'
        ? `**[AMC 8 Prep Vol. 5 Ch.26 영국 국기 정리 (British Flag Theorem)]**\n\n직사각형 $ABCD$와 평면 위의 임의의 점 $P$에 대하여, 마주보는 꼭짓점까지의 거리의 제곱의 합은 서로 같습니다:\n\n$$AP^2 + PC^2 = BP^2 + PD^2$$\n\n주어진 수치를 대입하면:\n\n$$${ap}^2 + ${pc}^2 = ${bp}^2 + PD^2$$\n$$${ap * ap} + ${pc * pc} = ${bp * bp} + PD^2$$\n$$${ap * ap + pc * pc} = ${bp * bp} + PD^2 \\implies PD^2 = ${ap * ap + pc * pc - bp * bp} = ${pd * pd}$$\n\n따라서 $PD = \\sqrt{${pd * pd}} = ${correctAns}$ 입니다.\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} (${correctAns})** 입니다.`
        : `**[AMC 8 Prep Vol. 5 Ch.26 British Flag Theorem]**\n\nFor any point $P$ in the plane of rectangle $ABCD$, the sum of the squares of the distances to opposite vertices is invariant:\n\n$$AP^2 + PC^2 = BP^2 + PD^2$$\n\nSubstituting the given values:\n\n$$${ap}^2 + ${pc}^2 = ${bp}^2 + PD^2$$\n$$${ap * ap} + ${pc * pc} = ${bp * bp} + PD^2$$\n$$${ap * ap + pc * pc} = ${bp * bp} + PD^2 \\implies PD^2 = ${pd * pd} \\implies PD = ${correctAns}$$\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${correctAns})**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'trapezoid-butterfly') {
      // AMC 8 Prep Vol. 5 Ch.28 Trapezoids: Butterfly Theorem on Diagonals
      const pairs = [
        [1, 4],   // S1 = 1, S2 = 16, m=1, n=4 -> side = 4, total = 25
        [2, 3],   // S1 = 4, S2 = 9, m=2, n=3 -> side = 6, total = 25
        [2, 5],   // S1 = 4, S2 = 25, m=2, n=5 -> side = 10, total = 49
        [3, 4],   // S1 = 9, S2 = 16, m=3, n=4 -> side = 12, total = 49
        [3, 5],   // S1 = 9, S2 = 25, m=3, n=5 -> side = 15, total = 64
        [4, 5],   // S1 = 16, S2 = 25, m=4, n=5 -> side = 20, total = 81
        [1, 3],   // S1 = 1, S2 = 9, m=1, n=3 -> side = 3, total = 16
        [2, 4],   // S1 = 4, S2 = 16, m=2, n=4 -> side = 8, total = 36
      ];
      const [m, n] = pickRandom(pairs);
      const sTop = m * m;
      const sBottom = n * n;
      const sSide = m * n;
      const sTotal = (m + n) * (m + n);

      const { choices, correctIdx } = buildChoices(sTotal, (i) => {
        if (i === 1) return sTop + sBottom;
        if (i === 2) return sTop + sBottom + sSide;
        if (i === 3) return sTotal + 4;
        return Math.max(4, sTotal - 4);
      });

      const question = lang === 'ko'
        ? `사다리꼴 $ABCD$에서 윗변 $AB$와 아랫변 $CD$가 평행합니다. 두 대각선 $AC$와 $BD$가 점 $O$에서 만날 때, $\\triangle AOB$의 넓이는 $${sTop}$이고 $\\triangle COD$의 넓이는 $${sBottom}$입니다. 사다리꼴 $ABCD$ 전체의 넓이를 구하세요.`
        : `In trapezoid $ABCD$, bases $AB$ and $CD$ are parallel. Diagonals $AC$ and $BD$ intersect at point $O$. If the area of $\\triangle AOB$ is $${sTop}$ and the area of $\\triangle COD$ is $${sBottom}$, find the total area of trapezoid $ABCD$.`;

      const explanation = lang === 'ko'
        ? `**[AMC 8 Prep Vol. 5 Ch.28 사다리꼴 대각선 분할 넓이 정리 (Butterfly Theorem)]**\n\n$AB \\parallel CD$이므로 $\\triangle AOB \\sim \\triangle COD$이며, 닮음비는 $\\sqrt{${sTop}} : \\sqrt{${sBottom}} = ${m} : ${n}$입니다.\n\n대각선에 의해 나뉜 두 옆면 삼각형 $\\triangle AOD$와 $\\triangle BOC$의 넓이는 서로 같으며, 다음과 같습니다:\n\n$$S_{\\triangle AOD} = S_{\\triangle BOC} = \\sqrt{S_{\\triangle AOB} \\times S_{\\triangle COD}} = \\sqrt{${sTop} \\times ${sBottom}} = ${sSide}$$\n\n따라서 사다리꼴 전체의 넓이는:\n\n$$S_{ABCD} = (\\sqrt{S_{\\triangle AOB}} + \\sqrt{S_{\\triangle COD}})^2 = (${m} + ${n})^2 = ${sTotal}$$\n\n(또는 네 삼각형 넓이의 합: $${sTop} + ${sBottom} + ${sSide} + ${sSide} = ${sTotal}$)\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} (${sTotal})** 입니다.`
        : `**[AMC 8 Prep Vol. 5 Ch.28 Trapezoid Diagonal Butterfly Theorem]**\n\nSince $AB \\parallel CD$, $\\triangle AOB \\sim \\triangle COD$ with ratio of similarity $\\sqrt{${sTop}} : \\sqrt{${sBottom}} = ${m} : ${n}$.\n\nThe two lateral triangles have equal areas:\n\n$$S_{\\triangle AOD} = S_{\\triangle BOC} = \\sqrt{S_{\\triangle AOB} \\times S_{\\triangle COD}} = \\sqrt{${sTop} \\times ${sBottom}} = ${sSide}$$\n\nThus, the total area of trapezoid $ABCD$ is:\n\n$$S_{ABCD} = (\\sqrt{S_{\\triangle AOB}} + \\sqrt{S_{\\triangle COD}})^2 = (${m} + ${n})^2 = ${sTotal}$$\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${sTotal})**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'cyclic-quadrilateral') {
      // cyclic-quadrilateral: opposite angles of a cyclic quadrilateral are supplementary
      const angleA = randInt(50, 110);
      const angleB = randInt(60, 120);
      const angleC = 180 - angleA;
      const angleD = 180 - angleB;
      const askC = Math.random() < 0.5;
      const given = askC ? angleA : angleB;
      const ans = askC ? angleC : angleD;
      const givenLabel = askC ? 'A' : 'B';
      const targetLabel = askC ? 'C' : 'D';

      const { choices, correctIdx } = buildChoices(ans, (i) => {
        if (i === 1) return given;
        if (i === 2) return Math.max(1, 360 - given - ans);
        if (i === 3) return ans + randInt(5, 15);
        return Math.max(1, ans - randInt(5, 15) - i);
      });

      const question = lang === 'ko'
        ? `사각형 $ABCD$가 원에 내접합니다. $\\angle ${givenLabel} = ${given}^\\circ$일 때, $\\angle ${targetLabel}$의 크기를 구하세요.`
        : `Quadrilateral $ABCD$ is inscribed in a circle. If $\\angle ${givenLabel} = ${given}^\\circ$, find $\\angle ${targetLabel}$.`;

      const explanation = lang === 'ko'
        ? `**[Essential Guide to Competition Math (Fundamentals) Topic 7.1 원에 내접하는 사각형]**\n\n원에 내접하는 사각형의 마주보는 두 각의 크기의 합은 $180^\\circ$입니다:\n\n$$\\angle ${givenLabel} + \\angle ${targetLabel} = 180^\\circ \\implies \\angle ${targetLabel} = 180^\\circ - ${given}^\\circ = ${ans}^\\circ$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]}** 입니다.`
        : `**[Essential Guide to Competition Math (Fundamentals) Topic 7.1 Cyclic Quadrilaterals]**\n\nOpposite angles of a cyclic quadrilateral are supplementary:\n\n$$\\angle ${givenLabel} + \\angle ${targetLabel} = 180^\\circ \\implies \\angle ${targetLabel} = 180^\\circ - ${given}^\\circ = ${ans}^\\circ$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]}**.`;

      return { question, choices, correctIdx, explanation };
    }

    const pool = [[2, 3, 6], [2, 4, 4], [3, 3, 3], [2, 2, 2], [2, 2, 4]];
    const [p, q, r] = pickRandom(pool);
    const D = lcm(lcm(p, q), r);
    const N = D + D / p + D / q + D / r;
    const k = Math.round((360 * D) / N);
    const mB = k / p;
    const mC = k / q;
    const mD = k / r;
    const correctAns = k;

    const { choices, correctIdx } = buildChoices(correctAns, (i) => {
      if (i === 1) return mB;
      if (i === 2) return mC;
      if (i === 3) return mD;
      return Math.max(1, correctAns - randInt(10, 30));
    });

    const question = lang === 'ko'
      ? `사각형 $ABCD$의 네 내각이 $m\\angle A = ${p}\\,m\\angle B = ${q}\\,m\\angle C = ${r}\\,m\\angle D$를 만족합니다. $\\angle A$의 크기는 몇 도입니까?`
      : `In quadrilateral $ABCD$, the angles satisfy $m\\angle A = ${p}\\,m\\angle B = ${q}\\,m\\angle C = ${r}\\,m\\angle D$. What is the measure of $\\angle A$, in degrees?`;

    const degenerateNote = correctAns === 180
      ? (lang === 'ko' ? ' (참고: $\\angle A=180^\\circ$이면 세 꼭짓점이 일직선을 이루는 특수한 경우입니다.)' : ' (Note: $\\angle A=180^\\circ$ means three of the vertices are actually collinear — a degenerate case!)')
      : '';

    const explanation = lang === 'ko'
      ? `**[Essential Guide to Prealgebra Ch.12 사각형의 내각 비율]**\n\n$m\\angle A = k$라 하면 $m\\angle B=\\frac{k}{${p}}$, $m\\angle C=\\frac{k}{${q}}$, $m\\angle D=\\frac{k}{${r}}$입니다. 분모의 최소공배수 $\\text{lcm}(${p},${q},${r})=${D}$로 통분하고, 사각형의 내각의 합이 $360^\\circ$임을 이용하면\n\n$$k\\left(1+\\frac{1}{${p}}+\\frac{1}{${q}}+\\frac{1}{${r}}\\right) = 360^\\circ \\implies k = ${correctAns}^\\circ$$${degenerateNote}\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} ($${correctAns}^\\circ$)** 입니다.`
      : `**[Essential Guide to Prealgebra Ch.12 Angle Ratios in a Quadrilateral]**\n\nLet $m\\angle A = k$, so $m\\angle B=\\frac{k}{${p}}$, $m\\angle C=\\frac{k}{${q}}$, $m\\angle D=\\frac{k}{${r}}$. Using $\\text{lcm}(${p},${q},${r})=${D}$ as a common denominator and the $360^\\circ$ angle sum:\n\n$$k\\left(1+\\frac{1}{${p}}+\\frac{1}{${q}}+\\frac{1}{${r}}\\right) = 360^\\circ \\implies k = ${correctAns}^\\circ$$${degenerateNote}\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${correctAns}°)**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // CIRCLES & SECTORS (Essential Guide to Competition Math (Fundamentals)
  // Topic 7.2: Circles)
  // -----------------------------------------------------------------------
  'circles': (lang) => {
    const variant = pickRandom(['annulus-chord', 'intersecting-chords', 'sector-area', 'arc-length', 'inscribed-angle', 'tangent-length']);
    const fmtPi = (n, d) => {
      const g = gcd(n, d) || 1;
      const nn = n / g;
      const dd = d / g;
      return dd === 1 ? `${nn}\\pi` : `\\frac{${nn}\\pi}{${dd}}`;
    };

    if (variant === 'annulus-chord') {
      // AMC 8 Prep Vol. 5 Ch.29 Circles: Annulus area from tangent chord length (Mamikon / Pythagorean)
      const chordLen = pickRandom([6, 8, 10, 12, 14, 16, 18, 20]);
      const halfChord = chordLen / 2;
      const ringAreaCoeff = halfChord * halfChord;
      const ans = `${ringAreaCoeff}\\pi`;

      const { choices, correctIdx } = buildChoices(ans, (i) => {
        if (i === 1) return `${chordLen * chordLen}\\pi`;
        if (i === 2) return `${chordLen}\\pi`;
        if (i === 3) return `${ringAreaCoeff * 2}\\pi`;
        return `${Math.max(1, ringAreaCoeff - 10)}\\pi`;
      });

      const question = lang === 'ko'
        ? `중심이 같은 두 동심원이 있습니다. 큰 원의 현 $AB$가 작은 원에 접하며 그 길이가 $${chordLen}$일 때, 두 원 사이의 고리 모양 영역(환면, Annulus)의 넓이를 구하세요.`
        : `Two concentric circles have the same center. A chord $AB$ of the larger circle is tangent to the smaller circle and has length $${chordLen}$. What is the area of the ring (annulus) between the two circles?`;

      const explanation = lang === 'ko'
        ? `**[AMC 8 Prep Vol. 5 Ch.29 동심원과 현의 성질 (피타고라스 정리)]**\n\n큰 원의 반지름을 $R$, 작은 원의 반지름을 $r$이라 하면 구하는 고리의 넓이는 $\\pi R^2 - \\pi r^2 = \\pi (R^2 - r^2)$입니다.\n\n원의 중심에서 접점까지 내린 수선은 작은 원의 반지름 $r$이고, 접선인 현 $AB$를 수직이등분합니다. 따라서 직각삼각형에서:\n\n$$R^2 = r^2 + \\left(\\frac{${chordLen}}{2}\\right)^2 = r^2 + ${halfChord}^2$$\n$$R^2 - r^2 = ${halfChord}^2 = ${ringAreaCoeff}$$\n\n따라서 고리 모양 영역의 넓이는:\n\n$$\\text{넓이} = \\pi (R^2 - r^2) = ${ringAreaCoeff}\\pi$$\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} ($${ans}$)** 입니다.`
        : `**[AMC 8 Prep Vol. 5 Ch.29 Concentric Circles Tangent Chord Property]**\n\nLet $R$ and $r$ be the radii of the larger and smaller circles, respectively. The area of the ring is $\\pi R^2 - \\pi r^2 = \\pi (R^2 - r^2)$.\n\nThe radius $r$ to the point of tangency is perpendicular to chord $AB$ and bisects it into segments of length $${chordLen}/2 = ${halfChord}$. By the Pythagorean theorem:\n\n$$R^2 - r^2 = (${halfChord})^2 = ${ringAreaCoeff}$$\n\nThus, the area of the annulus is:\n\n$$\\text{Area} = \\pi (R^2 - r^2) = ${ringAreaCoeff}\\pi$$\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${ans})**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'intersecting-chords') {
      // AMC 8 Prep Vol. 5 Ch.29 Circles: Intersecting Chords Theorem AP * PB = CP * PD
      const chordConfigs = [
        { a: 3, b: 8, c: 4, d: 6 },
        { a: 4, b: 6, c: 3, d: 8 },
        { a: 4, b: 9, c: 6, d: 6 },
        { a: 2, b: 18, c: 4, d: 9 },
        { a: 6, b: 8, c: 4, d: 12 },
        { a: 5, b: 12, c: 6, d: 10 },
        { a: 5, b: 12, c: 4, d: 15 },
        { a: 8, b: 9, c: 6, d: 12 },
        { a: 4, b: 10, c: 5, d: 8 },
        { a: 3, b: 12, c: 4, d: 9 },
      ];
      const { a, b, c, d } = pickRandom(chordConfigs);
      const correctAns = d;

      const { choices, correctIdx } = buildChoices(correctAns, (i) => {
        if (i === 1) return d + 1;
        if (i === 2) return Math.max(1, d - 1);
        if (i === 3) return d + 2;
        return Math.max(1, d - 2);
      });

      const question = lang === 'ko'
        ? `원 내부의 점 $P$에서 두 현 $AB$와 $CD$가 서로 만납니다. $AP = ${a}$, $PB = ${b}$, $CP = ${c}$일 때, 선분 $PD$의 길이를 구하세요.`
        : `Two chords $AB$ and $CD$ intersect at point $P$ inside a circle. If $AP = ${a}$, $PB = ${b}$, and $CP = ${c}$, find the length of segment $PD$.`;

      const explanation = lang === 'ko'
        ? `**[AMC 8 Prep Vol. 5 Ch.29 원의 현과 방먁 정리 (Intersecting Chords Theorem)]**\n\n원 내부에서 두 현이 교차할 때, 원주각과 닮은 삼각형 성질에 의해 두 현의 선분 곱이 서로 같습니다:\n\n$$AP \\times PB = CP \\times PD$$\n\n주어진 선분의 길이를 대입하면:\n\n$$${a} \\times ${b} = ${c} \\times PD$$\n$$${a * b} = ${c} \\times PD \\implies PD = \\frac{${a * b}}{${c}} = ${d}$$\n\n따라서 $PD = ${correctAns}$ 입니다.\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} (${correctAns})** 입니다.`
        : `**[AMC 8 Prep Vol. 5 Ch.29 Intersecting Chords Theorem]**\n\nWhen two chords intersect inside a circle, the products of their segments are equal by similar triangles:\n\n$$AP \\times PB = CP \\times PD$$\n\nSubstituting the given values:\n\n$$${a} \\times ${b} = ${c} \\times PD \\implies ${a * b} = ${c} \\times PD \\implies PD = ${d}$$\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${correctAns})**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'sector-area') {
      const angle = pickRandom([30, 45, 60, 72, 90, 120, 135, 150, 180, 270]);
      const r = randInt(2, 12);
      const ans = fmtPi(angle * r * r, 360);

      const { choices, correctIdx } = buildChoices(ans, (i) => {
        if (i === 1) return fmtPi(angle * r, 360); // forgot to square the radius
        if (i === 2) return fmtPi(r * r, 1); // used the full circle, ignoring the sector angle
        if (i === 3) return fmtPi(angle * 4 * r * r, 360); // used diameter instead of radius
        return fmtPi(angle * r * r, 360 + i);
      });

      const question = lang === 'ko'
        ? `반지름이 $${r}$이고 중심각이 $${angle}^\\circ$인 부채꼴의 넓이를 구하세요.`
        : `Find the area of a sector with radius $${r}$ and central angle $${angle}^\\circ$.`;

      const explanation = lang === 'ko'
        ? `**[Essential Guide to Competition Math (Fundamentals) Topic 7.2 원과 부채꼴]**\n\n부채꼴의 넓이는 원 전체 넓이에서 중심각이 차지하는 비율만큼입니다:\n\n$$\\frac{${angle}}{360} \\times \\pi \\times ${r}^2 = ${ans}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]}** 입니다.`
        : `**[Essential Guide to Competition Math (Fundamentals) Topic 7.2 Circles & Sectors]**\n\nA sector's area is the fraction of the full circle's area given by its central angle:\n\n$$\\frac{${angle}}{360} \\times \\pi \\times ${r}^2 = ${ans}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]}**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'arc-length') {
      const angle = pickRandom([30, 45, 60, 72, 90, 120, 135, 150, 180, 270]);
      const r = randInt(2, 12);
      const ans = fmtPi(angle * r, 180);

      const { choices, correctIdx } = buildChoices(ans, (i) => {
        if (i === 1) return fmtPi(angle * r, 360); // dropped the factor of 2 from the circumference
        if (i === 2) return fmtPi(angle * r * r, 180); // squared the radius by mistake
        if (i === 3) return fmtPi(r, 1); // used the radius alone, ignoring the angle fraction
        return fmtPi(angle * r, 180 + i);
      });

      const question = lang === 'ko'
        ? `반지름이 $${r}$이고 중심각이 $${angle}^\\circ$인 부채꼴의 호의 길이를 구하세요.`
        : `Find the arc length of a sector with radius $${r}$ and central angle $${angle}^\\circ$.`;

      const explanation = lang === 'ko'
        ? `**[Essential Guide to Competition Math (Fundamentals) Topic 7.2 원과 부채꼴]**\n\n호의 길이는 원 전체 둘레에서 중심각이 차지하는 비율만큼입니다:\n\n$$\\frac{${angle}}{360} \\times 2\\pi \\times ${r} = ${ans}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]}** 입니다.`
        : `**[Essential Guide to Competition Math (Fundamentals) Topic 7.2 Circles & Sectors]**\n\nAn arc's length is the fraction of the full circumference given by its central angle:\n\n$$\\frac{${angle}}{360} \\times 2\\pi \\times ${r} = ${ans}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]}**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'inscribed-angle') {
      const inscribed = pickRandom([20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75]);
      const central = 2 * inscribed;
      const askCentral = Math.random() < 0.5;
      const given = askCentral ? inscribed : central;
      const ans = askCentral ? central : inscribed;

      const { choices, correctIdx } = buildChoices(ans, (i) => {
        if (i === 1) return given;
        if (i === 2) return askCentral ? 180 - central : 180 - inscribed;
        if (i === 3) return ans + randInt(5, 15);
        return Math.max(1, ans - 10 - i);
      });

      const question = askCentral
        ? (lang === 'ko'
          ? `원 위의 한 점에서 호 $AB$에 대해 만든 원주각이 $${given}^\\circ$일 때, 같은 호 $AB$에 대한 중심각의 크기는 몇 도입니까?`
          : `An inscribed angle subtending arc $AB$ measures $${given}^\\circ$. What is the measure of the central angle subtending the same arc?`)
        : (lang === 'ko'
          ? `호 $AB$에 대한 중심각이 $${given}^\\circ$일 때, 같은 호 $AB$에 대해 원 위의 한 점에서 만든 원주각(내접각)의 크기는 몇 도입니까?`
          : `The central angle subtending arc $AB$ measures $${given}^\\circ$. What is the measure of an inscribed angle subtending the same arc?`);

      const explanation = lang === 'ko'
        ? `**[Essential Guide to Competition Math (Fundamentals) Topic 7.2 원주각의 정리]**\n\n원주각의 정리에 의해, 같은 호에 대한 원주각은 중심각의 절반입니다:\n\n$$\\text{중심각} = 2 \\times \\text{원주각} \\implies ${askCentral ? `2 \\times ${given}^\\circ = ${ans}^\\circ` : `\\text{원주각} = \\frac{${given}^\\circ}{2} = ${ans}^\\circ`}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]}** 입니다.`
        : `**[Essential Guide to Competition Math (Fundamentals) Topic 7.2 Inscribed Angle Theorem]**\n\nBy the Inscribed Angle Theorem, an inscribed angle is half the central angle subtending the same arc:\n\n$$${askCentral ? `2 \\times ${given}^\\circ = ${ans}^\\circ` : `\\frac{${given}^\\circ}{2} = ${ans}^\\circ`}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]}**.`;

      return { question, choices, correctIdx, explanation };
    }

    // tangent-length: right triangle formed by the radius, tangent segment, and distance to center
    const triples = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [7, 24, 25], [10, 24, 26]];
    const [r, T, d] = pickRandom(triples);

    const { choices, correctIdx } = buildChoices(T, (i) => {
      if (i === 1) return d - r;
      if (i === 2) return d + r;
      if (i === 3) return r;
      return T + i + 1;
    });

    const question = lang === 'ko'
      ? `원의 중심 $O$로부터의 거리가 $${d}$인 점 $P$에서 원에 접선을 그었습니다. 원의 반지름이 $${r}$일 때, 접선의 길이(접점까지의 거리)를 구하세요.`
      : `Point $P$ is at distance $${d}$ from the center $O$ of a circle with radius $${r}$. A tangent line is drawn from $P$ to the circle. Find the length of the tangent segment (from $P$ to the point of tangency).`;

    const explanation = lang === 'ko'
      ? `**[Essential Guide to Competition Math (Fundamentals) Topic 7.2 원과 접선]**\n\n반지름은 접점에서 접선과 수직이므로, 반지름 $${r}$, 접선의 길이, 중심까지의 거리 $${d}$는 직각삼각형을 이룹니다:\n\n$$\\text{접선 길이} = \\sqrt{${d}^2 - ${r}^2} = ${T}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]}** 입니다.`
      : `**[Essential Guide to Competition Math (Fundamentals) Topic 7.2 Tangent Lines]**\n\nThe radius is perpendicular to the tangent at the point of tangency, forming a right triangle with the radius $${r}$, the tangent length, and the distance $${d}$ to the center:\n\n$$\\text{Tangent length} = \\sqrt{${d}^2 - ${r}^2} = ${T}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]}**.`;

    return { question, choices, correctIdx, explanation };
  },

  'solids': (lang) => {
    const variant = pickRandom(['space-diagonal', 'cylinder-scaling-ratio', 'cube-painted-slicing', 'polyhedron-euler', 'rect-prism', 'triangular-prism']);

    if (variant === 'space-diagonal') {
      // AMC 8 Prep Vol. 5 Ch.30 Volumes: Space Diagonal of a Rectangular Solid d = sqrt(a^2 + b^2 + c^2)
      const quadruples = [
        [2, 3, 6, 7],     // 4 + 9 + 36 = 49 -> 7
        [1, 4, 8, 9],     // 1 + 16 + 64 = 81 -> 9
        [4, 4, 7, 9],     // 16 + 16 + 49 = 81 -> 9
        [2, 6, 9, 11],    // 4 + 36 + 81 = 121 -> 11
        [6, 6, 7, 11],    // 36 + 36 + 49 = 121 -> 11
        [3, 4, 12, 13],   // 9 + 16 + 144 = 169 -> 13
        [2, 10, 11, 15],  // 4 + 100 + 121 = 225 -> 15
        [5, 10, 10, 15],  // 25 + 100 + 100 = 225 -> 15
        [8, 9, 12, 17],   // 64 + 81 + 144 = 289 -> 17
      ];
      const [a, b, c, d] = pickRandom(quadruples);
      const correctAns = d;

      const { choices, correctIdx } = buildChoices(correctAns, (i) => {
        if (i === 1) return d + 1;
        if (i === 2) return Math.max(1, d - 1);
        if (i === 3) return a + b + c;
        return Math.max(1, d + (i % 2 === 0 ? 2 : -2));
      });

      const question = lang === 'ko'
        ? `가로, 세로, 높이의 길이가 각각 $${a}$, $${b}$, $${c}$인 직육면체가 있습니다. 이 직육면체의 공간 대각선(가장 먼 두 꼭짓점 사이의 거리)의 길이를 구하세요.`
        : `A rectangular solid has length $${a}$, width $${b}$, and height $${c}$. Find the length of the space diagonal (the distance between the two farthest opposite vertices).`;

      const explanation = lang === 'ko'
        ? `**[AMC 8 Prep Vol. 5 Ch.30 직육면체의 공간 대각선 (Space Diagonal)]**\n\n가로 $a$, 세로 $b$, 높이 $c$인 직육면체의 공간 대각선 길이 $d$는 3차원 피타고라스 정리에 의해 다음과 같습니다:\n\n$$d = \\sqrt{a^2 + b^2 + c^2}$$\n\n주어진 수치를 대입하면:\n\n$$d = \\sqrt{${a}^2 + ${b}^2 + ${c}^2} = \\sqrt{${a * a} + ${b * b} + ${c * c}} = \\sqrt{${d * d}} = ${correctAns}$$\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} (${correctAns})** 입니다.`
        : `**[AMC 8 Prep Vol. 5 Ch.30 Rectangular Solid Space Diagonal]**\n\nFor a rectangular box with dimensions $a, b, c$, the space diagonal $d$ is given by the 3D Pythagorean theorem:\n\n$$d = \\sqrt{a^2 + b^2 + c^2}$$\n\nSubstituting the dimensions:\n\n$$d = \\sqrt{${a}^2 + ${b}^2 + ${c}^2} = \\sqrt{${a * a} + ${b * b} + ${c * c}} = \\sqrt{${d * d}} = ${correctAns}$$\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${correctAns})**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'cylinder-scaling-ratio') {
      // AMC 8 Prep Vol. 5 Ch.30 Volumes: Cylinder Volume Conservation
      const configs = [
        { r1: 4, h1: 12, r2: 2, h2: 48 },   // (4/2)^2 * 12 = 48
        { r1: 6, h1: 8, r2: 4, h2: 18 },    // (36/16) * 8 = 18
        { r1: 3, h1: 20, r2: 6, h2: 5 },    // (3/6)^2 * 20 = 5
        { r1: 4, h1: 24, r2: 8, h2: 6 },    // (4/8)^2 * 24 = 6
        { r1: 5, h1: 16, r2: 10, h2: 4 },   // (5/10)^2 * 16 = 4
        { r1: 6, h1: 5, r2: 3, h2: 20 },    // (6/3)^2 * 5 = 20
        { r1: 2, h1: 36, r2: 6, h2: 4 },    // (2/6)^2 * 36 = 4
        { r1: 4, h1: 9, r2: 6, h2: 4 },     // (16/36) * 9 = 4
      ];
      const { r1, h1, r2, h2 } = pickRandom(configs);
      const correctAns = h2;

      const { choices, correctIdx } = buildChoices(correctAns, (i) => {
        if (i === 1) return Math.round(h1 * (r1 / r2));
        if (i === 2) return h1;
        if (i === 3) return h2 + 2;
        return Math.max(1, h2 - 2);
      });

      const question = lang === 'ko'
        ? `밑면의 반지름이 $${r1}$인 원기둥 모양의 수조 $A$에 높이 $${h1}$만큼 물이 채워져 있습니다. 이 물을 모두 밑면의 반지름이 $${r2}$인 다른 원기둥 수조 $B$에 부었을 때, 수조 $B$에 채워지는 물의 높이를 구하세요. (단, 두 수조에서 물은 넘치지 않습니다.)`
        : `A cylindrical tank $A$ with base radius $${r1}$ is filled with water to a depth of $${h1}$. If all of this water is poured into a second cylindrical tank $B$ with base radius $${r2}$, what will be the depth of the water in tank $B$? (Assume no water spills.)`;

      const explanation = lang === 'ko'
        ? `**[AMC 8 Prep Vol. 5 Ch.30 원기둥의 부피와 액체 이동 (Conservation of Volume)]**\n\n원기둥의 부피 공식은 $V = \\pi r^2 h$입니다. 물의 전체 부피는 보존되므로:\n\n$$V_A = \\pi \\times ${r1}^2 \\times ${h1} = \\pi \\times ${r1 * r1} \\times ${h1} = ${r1 * r1 * h1}\\pi$$\n\n이 물을 반지름이 $${r2}$인 수조 $B$에 부었을 때의 높이를 $h_B$라 하면:\n\n$$\\pi \\times ${r2}^2 \\times h_B = ${r1 * r1 * h1}\\pi$$\n$$${r2 * r2} h_B = ${r1 * r1 * h1} \\implies h_B = \\frac{${r1 * r1 * h1}}{${r2 * r2}} = ${h2}$$\n\n따라서 수조 $B$의 물의 높이는 **$${correctAns}$** 입니다.\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} (${correctAns})** 입니다.`
        : `**[AMC 8 Prep Vol. 5 Ch.30 Cylinder Volume Conservation]**\n\nThe volume of a cylinder is $V = \\pi r^2 h$. Since the volume of water remains constant:\n\n$$V_A = \\pi \\times ${r1}^2 \\times ${h1} = ${r1 * r1 * h1}\\pi$$\n\nSetting this equal to the volume in cylinder $B$ with radius $${r2}$ and depth $h_B$:\n\n$$\\pi \\times ${r2}^2 \\times h_B = ${r1 * r1 * h1}\\pi \\implies ${r2 * r2} h_B = ${r1 * r1 * h1} \\implies h_B = ${h2}$$\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${correctAns})**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'cube-painted-slicing') {
      // AMC 8 Prep Vol. 3 Ch.13 Three-Dimensional Figures: Painted Cube Slicing
      const N = randInt(3, 6);
      const targetFaces = pickRandom([0, 1, 2, 3]);
      let ans = 0;
      let targetLabelKo = '';
      let targetLabelEn = '';
      let formulaKo = '';
      let formulaEn = '';

      if (targetFaces === 3) {
        ans = 8;
        targetLabelKo = '정확히 세 면';
        targetLabelEn = 'exactly 3 faces';
        formulaKo = '정육면체의 8개 꼭짓점(Corner)에 위치한 쌓기나무이므로 항상 $8$개입니다.';
        formulaEn = 'These are the corner cubes of the big cube, so there are always 8.';
      } else if (targetFaces === 2) {
        ans = 12 * (N - 2);
        targetLabelKo = '정확히 두 면';
        targetLabelEn = 'exactly 2 faces';
        formulaKo = `12개의 모서리(Edge)에서 꼭짓점을 제외한 부분에 위치하므로 $12 \\times (N - 2) = 12 \\times (${N} - 2) = ${ans}$개입니다.`;
        formulaEn = `Located along the 12 edges excluding the corners: $12 \\times (N - 2) = 12 \\times (${N} - 2) = ${ans}$.`;
      } else if (targetFaces === 1) {
        ans = 6 * Math.pow(N - 2, 2);
        targetLabelKo = '정확히 한 면';
        targetLabelEn = 'exactly 1 face';
        formulaKo = `6개의 겉면(Face) 중앙 부분에 위치하므로 $6 \\times (N - 2)^2 = 6 \\times (${N} - 2)^2 = ${ans}$개입니다.`;
        formulaEn = `Located in the interior of the 6 outer faces: $6 \\times (N - 2)^2 = 6 \\times (${N} - 2)^2 = ${ans}$.`;
      } else {
        ans = Math.pow(N - 2, 3);
        targetLabelKo = '어느 면도 칠해지지 않은(0면)';
        targetLabelEn = 'no painted faces (0 faces)';
        formulaKo = `겉면에 접하지 않는 안쪽 내부 정육면체이므로 $(N - 2)^3 = (${N} - 2)^3 = ${ans}$개입니다.`;
        formulaEn = `Located in the unpainted inner core of the cube: $(N - 2)^3 = (${N} - 2)^3 = ${ans}$.`;
      }

      const { choices, correctIdx } = buildChoices(ans, (i) => {
        if (i === 1) return targetFaces === 3 ? 12 : 8;
        if (i === 2) return 12 * (N - 2) + 2;
        if (i === 3) return 6 * Math.pow(N - 2, 2) + 4;
        return ans + randInt(4, 16) * (i % 2 === 0 ? 1 : -1);
      });

      const question = lang === 'ko'
        ? `한 변의 길이가 $${N}$인 정육면체의 겉면 전체를 빨간색으로 칠한 후, 한 변의 길이가 $1$인 작은 단위 정육면체 $${N * N * N}$개로 잘랐습니다. 이 작은 정육면체들 중 **${targetLabelKo}** 이 빨간색으로 칠해진 것은 모두 몇 개입니까?`
        : `A large cube of side length $${N}$ has all its exterior faces painted red. It is then cut into $${N * N * N}$ unit cubes ($1 \\times 1 \\times 1$). How many of these unit cubes have **${targetLabelEn}** painted red?`;

      const explanation = lang === 'ko'
        ? `**[AMC 8 Prep Vol. 3 Ch.13 정육면체 절단과 채색(Painted Cubes)]**\n\n$N \\times N \\times N$ 정육면체를 단위 정육면체로 자를 때 각 면의 페인트가 칠해진 개수 공식:\n- 3면 칠해진 정육면체: 꼭짓점 $= 8$개\n- 2면 칠해진 정육면체: 모서리 $= 12(N - 2)$개\n- 1면 칠해진 정육면체: 면 내부 $= 6(N - 2)^2$개\n- 0면 칠해진 정육면체: 내부 중심 $= (N - 2)^3$개\n\n$N = ${N}$ 일 때 ${targetLabelKo} 칠해진 개수는:\n${formulaKo}\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} (${ans}개)** 입니다.`
        : `**[AMC 8 Prep Vol. 3 Ch.13 Painted Cube Slicing Formulas]**\n\nWhen an $N \\times N \\times N$ painted cube is cut into unit cubes:\n- 3 faces painted: 8 corners\n- 2 faces painted: $12(N - 2)$ edge cubes\n- 1 face painted: $6(N - 2)^2$ face-interior cubes\n- 0 faces painted: $(N - 2)^3$ inner-core cubes\n\nFor $N = ${N}$ with ${targetLabelEn}:\n${formulaEn}\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${ans})**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'polyhedron-euler') {
      // AMC 8 Prep Vol. 3 Ch.13 Section 4: Euler's Formula V - E + F = 2
      const polyhedra = [
        { nameKo: '정십이면체', nameEn: 'regular dodecahedron', V: 20, E: 30, F: 12 },
        { nameKo: '정이십면체', nameEn: 'regular icosahedron', V: 12, E: 30, F: 20 },
        { nameKo: '정팔면체', nameEn: 'regular octahedron', V: 6, E: 12, F: 8 },
        { nameKo: '육각기둥', nameEn: 'hexagonal prism', V: 12, E: 18, F: 8 },
        { nameKo: '오각뿔', nameEn: 'pentagonal pyramid', V: 6, E: 10, F: 6 },
        { nameKo: '축구공 다면체(깎은 정이십면체)', nameEn: 'truncated icosahedron', V: 60, E: 90, F: 32 },
      ];
      const p = pickRandom(polyhedra);
      const ans = p.F;

      const { choices, correctIdx } = buildChoices(ans, (i) => {
        if (i === 1) return p.V;
        if (i === 2) return Math.round(p.E / 2);
        if (i === 3) return ans + 4;
        return Math.max(4, ans + (i % 2 === 0 ? 2 : -2));
      });

      const question = lang === 'ko'
        ? `어떤 볼록다면체(${p.nameKo})의 꼭짓점의 개수가 $V = ${p.V}$개이고 모서리의 개수가 $E = ${p.E}$개입니다. 오일러의 다면체 정리를 이용하여 이 다면체의 면의 개수($F$)를 구하세요.`
        : `A convex polyhedron (${p.nameEn}) has $V = ${p.V}$ vertices and $E = ${p.E}$ edges. Using Euler's formula for polyhedra, find the number of faces ($F$).`;

      const explanation = lang === 'ko'
        ? `**[AMC 8 Prep Vol. 3 Ch.13 오일러의 다면체 정리 (Euler's Polyhedral Formula)]**\n\n모든 볼록다면체에서 꼭짓점($V$), 모서리($E$), 면($F$) 사이에는 항상 다음 관계가 성립합니다:\n\n$$V - E + F = 2$$\n\n주어진 $V = ${p.V}$, $E = ${p.E}$를 대입하면:\n\n$$${p.V} - ${p.E} + F = 2 \\implies -${p.E - p.V} + F = 2$$\n$$F = 2 + ${p.E - p.V} = ${ans}$$\n\n따라서 면의 개수는 **$${ans}$개** 입니다.\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} (${ans}개)** 입니다.`
        : `**[AMC 8 Prep Vol. 3 Ch.13 Euler's Polyhedral Formula]**\n\nFor any convex polyhedron, Euler's formula states:\n\n$$V - E + F = 2$$\n\nSubstituting $V = ${p.V}$ and $E = ${p.E}$:\n\n$$${p.V} - ${p.E} + F = 2 \\implies F = 2 + ${p.E} - ${p.V} = ${ans}$$\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${ans})**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'rect-prism') {
      const l = randInt(3, 10);
      const w = randInt(3, 10);
      const h = randInt(3, 10);
      const correctAns = 2 * (l * w + w * h + l * h);

      const { choices, correctIdx } = buildChoices(correctAns, (i) => {
        if (i === 1) return l * w * h;
        if (i === 2) return 2 * (l * w) + 2 * (w * h);
        if (i === 3) return (l + w + h) * 2;
        return correctAns + randInt(4, 12);
      });

      const question = lang === 'ko'
        ? `가로 $${l}$, 세로 $${w}$, 높이 $${h}$인 직육면체의 겉넓이는 얼마입니까?`
        : `A rectangular box has dimensions $${l} \\times ${w} \\times ${h}$. What is its surface area?`;

      const explanation = lang === 'ko'
        ? `**[Essential Guide to Prealgebra Ch.13 입체도형의 겉넓이]**\n\n직육면체는 서로 합동인 세 쌍의 면(가로×세로, 세로×높이, 가로×높이)으로 이루어져 있습니다:\n\n$$S = 2(${l}\\times${w} + ${w}\\times${h} + ${l}\\times${h}) = ${correctAns}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} ($${correctAns}$)** 입니다.`
        : `**[Essential Guide to Prealgebra Ch.13 Surface Area via Nets]**\n\nA rectangular box has three congruent pairs of faces:\n\n$$S = 2(${l}\\times${w} + ${w}\\times${h} + ${l}\\times${h}) = ${correctAns}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${correctAns})**.`;

      return { question, choices, correctIdx, explanation };
    }

    // triangular-prism: right-triangle cross section (Pythagorean triple legs a,b, hyp c), prism length L
    const triples = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15]];
    const [a, b, c] = pickRandom(triples);
    const L = randInt(4, 12);
    const correctAns = a * b + (a + b + c) * L;

    const { choices, correctIdx } = buildChoices(correctAns, (i) => {
      if (i === 1) return a * b * L;
      if (i === 2) return (a + b + c) * L;
      if (i === 3) return a * b + (a + b) * L;
      return correctAns + randInt(6, 20);
    });

    const question = lang === 'ko'
      ? `직각을 낀 두 변의 길이가 $${a}$, $${b}$이고 빗변의 길이가 $${c}$인 직각삼각형을 밑면으로 하고, 높이(기둥의 길이)가 $${L}$인 삼각기둥의 겉넓이는 얼마입니까?`
      : `A triangular prism has a right-triangle base with legs $${a}$ and $${b}$ and hypotenuse $${c}$, and a prism length of $${L}$. What is its surface area?`;

    const explanation = lang === 'ko'
      ? `**[Essential Guide to Prealgebra Ch.13 삼각기둥의 겉넓이 (전개도 이용)]**\n\n두 밑면(합동인 직각삼각형)의 넓이 합과, 옆면 세 직사각형의 넓이 합을 더합니다:\n\n$$S = \\underbrace{${a}\\times${b}}_{\\text{두 밑면}} + \\underbrace{(${a}+${b}+${c})\\times${L}}_{\\text{옆면 세 개}} = ${correctAns}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} ($${correctAns}$)** 입니다.`
      : `**[Essential Guide to Prealgebra Ch.13 Triangular Prism Surface Area (Net Method)]**\n\nAdd the two congruent triangular base faces and the three rectangular lateral faces:\n\n$$S = \\underbrace{${a}\\times${b}}_{\\text{2 bases}} + \\underbrace{(${a}+${b}+${c})\\times${L}}_{\\text{3 lateral faces}} = ${correctAns}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${correctAns})**.`;

    return { question, choices, correctIdx, explanation };
  },

  'word-problems': (lang) => {
    const denomPool = [[2, 3, 4], [2, 3, 6], [3, 4, 6], [2, 4, 5], [3, 5, 6], [2, 5, 10]];
    const [d1, d2, d3] = pickRandom(denomPool);
    const L = lcm(lcm(d1, d2), d3);
    const shareUnits = [L / d1, L / d2, L / d3];
    const totalUnits = shareUnits.reduce((s, v) => s + v, 0);
    const perUnit = randInt(2, 8);
    const total = totalUnits * perUnit;
    const shares = shareUnits.map((u) => u * perUnit);
    const correctAns = Math.max(...shares);
    const sortedShares = [...shares].sort((a, b) => a - b);
    const maxUnit = Math.max(...shareUnits);

    const { choices, correctIdx } = buildChoices(correctAns, (i) => {
      if (i === 1) return sortedShares[0];
      if (i === 2) return sortedShares[1];
      if (i === 3) return Math.round(total / 3);
      return correctAns + randInt(5, 20);
    });

    const question = lang === 'ko'
      ? `세 형제가 $${total}$달러짜리 상품권을 $\\frac{1}{${d1}} : \\frac{1}{${d2}} : \\frac{1}{${d3}}$의 비로 나누어 가지려고 합니다. 이 중 가장 많이 받는 사람의 금액은 얼마입니까?`
      : `Three siblings split a $${total} gift card in the ratio $\\frac{1}{${d1}} : \\frac{1}{${d2}} : \\frac{1}{${d3}}$. What is the greatest amount, in dollars, that any of them receives?`;

    const explanation = lang === 'ko'
      ? `**[Essential Guide to Prealgebra Ch.7 역수 비 분배]**\n\n분수의 비는 분모의 최소공배수 $\\text{lcm}(${d1},${d2},${d3})=${L}$를 곱해 정수비로 바꿉니다:\n\n$$\\frac{1}{${d1}} : \\frac{1}{${d2}} : \\frac{1}{${d3}} = ${shareUnits[0]} : ${shareUnits[1]} : ${shareUnits[2]}$$\n\n비의 합은 $${totalUnits}$이고 전체 금액이 $${total}$이므로, 한 단위는 $${total} \\div ${totalUnits} = ${perUnit}$달러입니다. 가장 큰 비율(${maxUnit})을 가진 사람은\n\n$$${maxUnit} \\times ${perUnit} = ${correctAns}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} ($${correctAns}$달러)** 입니다.`
      : `**[Essential Guide to Prealgebra Ch.7 Splitting by Reciprocal Ratios]**\n\nMultiply each fraction by $\\text{lcm}(${d1},${d2},${d3})=${L}$ to convert to a whole-number ratio:\n\n$$\\frac{1}{${d1}} : \\frac{1}{${d2}} : \\frac{1}{${d3}} = ${shareUnits[0]} : ${shareUnits[1]} : ${shareUnits[2]}$$\n\nThe ratio parts sum to $${totalUnits}$, and the total is $${total}$, so one part is worth $${total} \\div ${totalUnits} = ${perUnit}$. The largest share (${maxUnit} parts) is\n\n$$${maxUnit} \\times ${perUnit} = ${correctAns}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} ($${correctAns})**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // COMPLEX NUMBERS (The Essential Guide to Algebra 1, Topic 9: Complex Number)
  // -----------------------------------------------------------------------
  'complex-numbers': (lang) => {
    const variant = pickRandom(['powers-of-i', 'real-product', 'expand-product']);

    if (variant === 'powers-of-i') {
      const n = pickRandom([randInt(50, 300), randInt(2000, 2030)]);
      const cycle = ['1', 'i', '-1', '-i'];
      const ans = cycle[n % 4];
      const choices = ['1', '-1', 'i', '-i', '0'];
      for (let idx = choices.length - 1; idx > 0; idx -= 1) {
        const j = Math.floor(Math.random() * (idx + 1));
        [choices[idx], choices[j]] = [choices[j], choices[idx]];
      }
      const correctIdx = choices.indexOf(ans);

      const question = lang === 'ko'
        ? `$i^{${n}}$의 값을 구하세요. (단, $i=\\sqrt{-1}$)`
        : `Find the value of $i^{${n}}$. (Here $i = \\sqrt{-1}$.)`;
      const explanation = lang === 'ko'
        ? `**[The Essential Guide to Algebra 1 Topic 9.1 거듭제곱의 주기성]**\n\n$i$의 거듭제곱은 $i^1=i,\\ i^2=-1,\\ i^3=-i,\\ i^4=1$을 주기로 4번마다 반복됩니다. $${n} = 4\\times${Math.floor(n / 4)} + ${n % 4}$이므로,\n\n$$i^{${n}} = i^{${n % 4}} = ${ans}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans})** 입니다.`
        : `**[The Essential Guide to Algebra 1 Topic 9.1 Periodicity of Powers of i]**\n\nPowers of $i$ repeat every 4 terms: $i^1=i,\\ i^2=-1,\\ i^3=-i,\\ i^4=1$. Since $${n} = 4\\times${Math.floor(n / 4)} + ${n % 4}$,\n\n$$i^{${n}} = i^{${n % 4}} = ${ans}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'real-product') {
      const a = pickRandom([2, 3, 4, 5, 6]);
      const A = pickRandom([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
      const c = -a * A;

      const { choices, correctIdx } = buildChoices(A, (i) => {
        if (i === 1) return -A;
        if (i === 2) return a - A;
        if (i === 3) return A + a;
        return A + (i % 2 === 0 ? i : -i);
      });

      const question = lang === 'ko'
        ? `$A$가 실수이고, 곱 $(${a}+i)(${c}+Ai)$가 실수일 때, $A$의 값을 구하세요.`
        : `Suppose $A$ is a real number, and the product $(${a}+i)(${c}+Ai)$ is a real number. Find $A$.`;
      const explanation = lang === 'ko'
        ? `**[The Essential Guide to Algebra 1 Topic 9.2 복소수의 곱셈]**\n\n$(${a}+i)(${c}+Ai) = (${a}\\times${c} - A) + (${a}A + ${c})i$이고, 이 값이 실수이려면 허수부가 $0$이어야 합니다:\n\n$$${a}A + ${c} = 0 \\implies A = ${A}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${A})** 입니다.`
        : `**[The Essential Guide to Algebra 1 Topic 9.2 Multiplying Complex Numbers]**\n\n$(${a}+i)(${c}+Ai) = (${a}\\times${c} - A) + (${a}A + ${c})i$, and for this to be real, the imaginary part must vanish:\n\n$$${a}A + ${c} = 0 \\implies A = ${A}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${A})**.`;

      return { question, choices, correctIdx, explanation };
    }

    // expand-product
    const p = randInt(-6, 6) || 2;
    const q = randInt(-6, 6) || 3;
    const r = randInt(-6, 6) || -2;
    const s = randInt(-6, 6) || 4;
    const re = p * r - q * s;
    const im = p * s + q * r;
    const fmt = (x, y) => {
      if (y === 0) return `${x}`;
      const sign = y > 0 ? '+' : '-';
      const yAbs = Math.abs(y);
      const yTerm = yAbs === 1 ? 'i' : `${yAbs}i`;
      return `${x} ${sign} ${yTerm}`;
    };
    const ans = fmt(re, im);

    const { choices, correctIdx } = buildChoices(ans, (i) => {
      if (i === 1) return fmt(p * r + q * s, im);
      if (i === 2) return fmt(re, p * s - q * r);
      if (i === 3) return fmt(re + q * s * 2, im);
      return fmt(re + (i - 3), im - (i - 3));
    });

    const p1 = fmt(p, q);
    const p2 = fmt(r, s);
    const question = lang === 'ko'
      ? `다음 곱을 $a+bi$ 꼴로 나타내세요: $(${p1})(${p2})$`
      : `Expand the following product into the form $a+bi$: $(${p1})(${p2})$`;
    const explanation = lang === 'ko'
      ? `**[The Essential Guide to Algebra 1 Topic 9.2 복소수의 곱셈]**\n\n분배법칙을 적용하고 $i^2=-1$을 사용합니다:\n\n$$(${p1})(${p2}) = (${p}\\times${r} - ${q}\\times${s}) + (${p}\\times${s} + ${q}\\times${r})i = ${ans}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans})** 입니다.`
      : `**[The Essential Guide to Algebra 1 Topic 9.2 Multiplying Complex Numbers]**\n\nDistribute and use $i^2=-1$:\n\n$$(${p1})(${p2}) = (${p}\\times${r} - ${q}\\times${s}) + (${p}\\times${s} + ${q}\\times${r})i = ${ans}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // FUNCTION PROPERTIES (The Essential Guide to Algebra 1 & Vol 4 Ch 22)
  // -----------------------------------------------------------------------
  'function-properties': (lang) => {
    const variant = pickRandom(['composition', 'arithmetic-combo', 'solve-for-input', 'greatest-integer-floor']);

    if (variant === 'greatest-integer-floor') {
      // AMC 8 Prep Vol. 4 Ch.22: Greatest Integer Function (Floor function [x] or \lfloor x \rfloor)
      const k = pickRandom([2, 3]);
      const pInt = randInt(2, 5);
      const pDec = pickRandom([0.3, 0.4, 0.7, 0.8]);
      const x1 = Number((pInt + pDec).toFixed(1));

      const nInt = randInt(1, 4);
      const nDec = pickRandom([0.2, 0.3, 0.6, 0.7]);
      const x2 = Number((-nInt - nDec).toFixed(1));

      const v1 = Math.floor(k * x1);
      const v2 = Math.floor(k * x2);
      const ans = v1 + v2;

      const { choices, correctIdx } = buildChoices(ans, (i) => {
        if (i === 1) return v1 + Math.trunc(k * x2); // truncation error for negative number
        if (i === 2) return ans + 1;
        if (i === 3) return ans - 1;
        return ans + 2 * (i % 2 === 0 ? 1 : -1);
      });

      const question = lang === 'ko'
        ? `실수 $x$에 대하여 $x$보다 크지 않은 최대의 정수를 $\\lfloor x \\rfloor$ (또는 $[x]$)라 정의하고, 함수 $f(x) = \\lfloor ${k}x \\rfloor$라 할 때, $f(${x1}) + f(${x2})$의 값은 얼마입니까?`
        : `For any real number $x$, let $\\lfloor x \\rfloor$ denote the greatest integer less than or equal to $x$. If $f(x) = \\lfloor ${k}x \\rfloor$, what is the value of $f(${x1}) + f(${x2})$?`;

      const kx1 = (k * x1).toFixed(1);
      const kx2 = (k * x2).toFixed(1);

      const explanation = lang === 'ko'
        ? `**[AMC 8 Prep Vol. 4 Ch.22 바닥함수(Greatest Integer Function) $\\lfloor x \\rfloor$]**\n\n$\\lfloor x \\rfloor$는 $x$ 이하의 정수 중 가장 큰 정수를 나타냅니다.\n\n1. $f(${x1})$ 계산:\n   $$${k} \\times ${x1} = ${kx1} \\implies \\lfloor ${kx1} \\rfloor = ${v1}$$\n\n2. $f(${x2})$ 계산 (음수 바닥함수 주의):\n   $$${k} \\times (${x2}) = ${kx2}$$\n   $-${Math.abs(v2)} \\le ${kx2} < -${Math.abs(v2) - 1}$ 이므로\n   $$\\lfloor ${kx2} \\rfloor = ${v2}$$\n   *(음수의 경우 소수점을 단순히 버리는 $-${Math.trunc(Math.abs(k * x2))}이 아니라, 더 작은 정수인 $${v2}$가 됨에 주의합니다.)*\n\n따라서 두 값의 합은:\n\n$$f(${x1}) + f(${x2}) = ${v1} + (${v2}) = ${ans}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans})** 입니다.`
        : `**[AMC 8 Prep Vol. 4 Ch.22 Greatest Integer Function $\\lfloor x \\rfloor$]**\n\nBy definition, $\\lfloor x \\rfloor$ is the largest integer that does not exceed $x$.\n\n1. For $f(${x1})$:\n   $$${k} \\times ${x1} = ${kx1} \\implies \\lfloor ${kx1} \\rfloor = ${v1}$$\n\n2. For $f(${x2})$ (note the negative argument):\n   $$${k} \\times (${x2}) = ${kx2} \\implies \\lfloor ${kx2} \\rfloor = ${v2}$$\n   *(For negative numbers, $\\lfloor -3.6 \\rfloor = -4$, not $-3$.)*\n\nSumming the two values:\n\n$$f(${x1}) + f(${x2}) = ${v1} + (${v2}) = ${ans}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'composition') {
      const a = pickRandom([2, 3, -2, -3, 4]);
      const b = randInt(-6, 6);
      const c = randInt(-6, 6);
      const n = randInt(-4, 4);
      const gVal = n * n + c;
      const ans = a * gVal + b;

      const { choices, correctIdx } = buildChoices(ans, (i) => {
        if (i === 1) { const fn = a * n + b; return fn * fn + c; }
        if (i === 2) return a * (n + c) + b;
        if (i === 3) return a * gVal - b;
        return ans + randInt(2, 8) * (i % 2 === 0 ? 1 : -1);
      });

      const question = lang === 'ko'
        ? `$f(x) = ${a}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)}$이고 $g(x) = x^2 ${c >= 0 ? '+' : '-'} ${Math.abs(c)}$일 때, $f(g(${n}))$의 값을 구하세요.`
        : `Let $f(x) = ${a}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)}$ and $g(x) = x^2 ${c >= 0 ? '+' : '-'} ${Math.abs(c)}$. Find $f(g(${n}))$.`;
      const explanation = lang === 'ko'
        ? `**[The Essential Guide to Algebra 1 Topic 12.3 합성함수]**\n\n먼저 안쪽 함수를 계산합니다: $g(${n}) = (${n})^2 ${c >= 0 ? '+' : '-'} ${Math.abs(c)} = ${gVal}$.\n\n이제 그 결과를 $f$에 대입합니다:\n\n$$f(g(${n})) = f(${gVal}) = ${a}\\times${gVal} ${b >= 0 ? '+' : '-'} ${Math.abs(b)} = ${ans}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans})** 입니다.`
        : `**[The Essential Guide to Algebra 1 Topic 12.3 Composition of Functions]**\n\nFirst evaluate the inner function: $g(${n}) = (${n})^2 ${c >= 0 ? '+' : '-'} ${Math.abs(c)} = ${gVal}$.\n\nNow substitute into $f$:\n\n$$f(g(${n})) = f(${gVal}) = ${a}\\times${gVal} ${b >= 0 ? '+' : '-'} ${Math.abs(b)} = ${ans}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'arithmetic-combo') {
      const a = randInt(-5, 5) || 2;
      const b = randInt(-6, 6);
      const c = randInt(-5, 5) || 3;
      const d = randInt(-6, 6);
      const n = randInt(-5, 5);
      const fVal = a * n + b;
      const gVal = c * n + d;
      const op = pickRandom(['+', '-', '*']);
      const ans = op === '+' ? fVal + gVal : op === '-' ? fVal - gVal : fVal * gVal;
      const opLabel = { '+': '(f+g)', '-': '(f-g)', '*': '(f \\cdot g)' }[op];

      const { choices, correctIdx } = buildChoices(ans, (i) => {
        if (i === 1) return fVal + gVal;
        if (i === 2) return fVal - gVal;
        if (i === 3) return fVal * gVal;
        return ans + randInt(2, 10) * (i % 2 === 0 ? 1 : -1);
      });

      const opSym = op === '*' ? '\\times' : op;
      const question = lang === 'ko'
        ? `$f(x) = ${a}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)}$이고 $g(x) = ${c}x ${d >= 0 ? '+' : '-'} ${Math.abs(d)}$일 때, $${opLabel}(${n})$의 값을 구하세요.`
        : `Let $f(x) = ${a}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)}$ and $g(x) = ${c}x ${d >= 0 ? '+' : '-'} ${Math.abs(d)}$. Find $${opLabel}(${n})$.`;
      const explanation = lang === 'ko'
        ? `**[The Essential Guide to Algebra 1 Topic 12.2 함수의 사칙연산]**\n\n$f(${n}) = ${fVal}$, $g(${n}) = ${gVal}$이므로,\n\n$$${opLabel}(${n}) = f(${n}) ${opSym} g(${n}) = ${fVal} ${opSym} ${gVal} = ${ans}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans})** 입니다.`
        : `**[The Essential Guide to Algebra 1 Topic 12.2 Function Arithmetic]**\n\nSince $f(${n}) = ${fVal}$ and $g(${n}) = ${gVal}$,\n\n$$${opLabel}(${n}) = f(${n}) ${opSym} g(${n}) = ${fVal} ${opSym} ${gVal} = ${ans}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

      return { question, choices, correctIdx, explanation };
    }

    // solve-for-input
    const a = pickRandom([2, 3, 4, 5, -2, -3]);
    const xTarget = randInt(-6, 6);
    const b = randInt(-8, 8);
    const k = a * xTarget + b;

    const { choices, correctIdx } = buildChoices(xTarget, (i) => {
      if (i === 1) return -xTarget;
      if (i === 2) return k;
      if (i === 3) return xTarget + b;
      return xTarget + (i % 2 === 0 ? i : -i);
    });

    const question = lang === 'ko'
      ? `$f(x) = ${a}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)}$일 때, $f(x) = ${k}$를 만족하는 $x$의 값을 구하세요.`
      : `If $f(x) = ${a}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)}$, find the value of $x$ such that $f(x) = ${k}$.`;
    const explanation = lang === 'ko'
      ? `**[The Essential Guide to Algebra 1 Topic 12.1 함수]**\n\n$${a}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)} = ${k}$를 $x$에 대해 풉니다:\n\n$$${a}x = ${k - b} \\implies x = ${xTarget}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${xTarget})** 입니다.`
      : `**[The Essential Guide to Algebra 1 Topic 12.1 Functions]**\n\nSolve $${a}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)} = ${k}$ for $x$:\n\n$$${a}x = ${k - b} \\implies x = ${xTarget}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${xTarget})**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // STATISTICS - CENTRAL TENDENCY & SPREAD (The Essential Guide to Algebra 1, Topic 15)
  // -----------------------------------------------------------------------
  'statistics-averages': (lang) => {
    const variant = pickRandom(['mean-shift', 'basic-central', 'spread']);

    if (variant === 'mean-shift') {
      let N = 10; let M = 80; let M2 = 83; let H = 95; let L = 0;
      let tries = 0;
      do {
        N = randInt(10, 22);
        M = randInt(70, 88);
        M2 = M + randInt(1, 5);
        H = randInt(92, 99);
        L = N * M - (N - 2) * M2 - H;
        tries += 1;
      } while ((L <= 0 || L >= M2 - 3 || L > H) && tries < 60);
      if (L <= 0) { N = 10; M = 80; M2 = 83; H = 95; L = 41; }

      const { choices, correctIdx } = buildChoices(L, (i) => {
        if (i === 1) return H - (M2 - M) * 2;
        if (i === 2) return M2 - (H - M2);
        if (i === 3) return L + (H - M2);
        return L + randInt(2, 9) * (i % 2 === 0 ? 1 : -1);
      });

      const question = lang === 'ko'
        ? `학생 $${N}$명의 시험 점수의 평균은 $${M}$점입니다. 이 중 가장 높은 점수와 가장 낮은 점수를 제외한 나머지 학생들의 평균은 $${M2}$점이 되었습니다. 가장 높은 점수가 $${H}$점이라면, 가장 낮은 점수는 몇 점입니까?`
        : `The mean score of $${N}$ students is $${M}$. When the highest and lowest scores are removed, the mean of the remaining scores becomes $${M2}$. If the highest score is $${H}$, what is the lowest score?`;
      const explanation = lang === 'ko'
        ? `**[The Essential Guide to Algebra 1 Topic 15.1 평균]**\n\n전체 합은 $${N}\\times${M}=${N * M}$이고, 최고점·최저점을 제외한 $${N - 2}$명의 합은 $${N - 2}\\times${M2}=${(N - 2) * M2}$입니다. 따라서\n\n$$\\text{최저점} = ${N * M} - ${(N - 2) * M2} - ${H} = ${L}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${L})** 입니다.`
        : `**[The Essential Guide to Algebra 1 Topic 15.1 Mean]**\n\nThe total sum is $${N}\\times${M}=${N * M}$, and the sum of the remaining $${N - 2}$ scores is $${N - 2}\\times${M2}=${(N - 2) * M2}$. So\n\n$$\\text{lowest score} = ${N * M} - ${(N - 2) * M2} - ${H} = ${L}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${L})**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'basic-central') {
      const base = randInt(1, 12);
      const vals = [base, base, base + 1, base + 4, base + 10];
      const mean = base + 3;
      const median = base + 1;
      const mode = base;
      const ask = pickRandom(['mean', 'median', 'mode']);
      const ans = ask === 'mean' ? mean : ask === 'median' ? median : mode;
      const askLabelKo = { mean: '평균', median: '중앙값', mode: '최빈값' }[ask];
      const askLabelEn = { mean: 'mean', median: 'median', mode: 'mode' }[ask];

      const { choices, correctIdx } = buildChoices(ans, (i) => {
        if (i === 1) return mean;
        if (i === 2) return median;
        if (i === 3) return mode;
        return ans + (i % 2 === 0 ? i : -i);
      });

      const listStr = `\\{${vals.join(', ')}\\}`;
      const question = lang === 'ko'
        ? `다음 자료의 ${askLabelKo}을(를) 구하세요: $${listStr}$`
        : `Find the ${askLabelEn} of the following data set: $${listStr}$`;
      const explanation = lang === 'ko'
        ? `**[The Essential Guide to Algebra 1 Topic 15.1 대푯값]**\n\n자료 $${listStr}$에서 평균 $=${mean}$, 중앙값$=${median}$, 최빈값$=${mode}$입니다.\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans})** 입니다.`
        : `**[The Essential Guide to Algebra 1 Topic 15.1 Measures of Central Tendency]**\n\nFor the data $${listStr}$: mean $=${mean}$, median $=${median}$, mode $=${mode}$.\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

      return { question, choices, correctIdx, explanation };
    }

    // spread: range or IQR of an arithmetic-sequence dataset
    const start = randInt(1, 15);
    const d = randInt(1, 6);
    const list = [start, start + d, start + 2 * d, start + 3 * d];
    const ask = pickRandom(['range', 'iqr']);
    const range = list[3] - list[0];
    const iqr = 2 * d;
    const ans = ask === 'range' ? range : iqr;
    const askLabelKo = ask === 'range' ? '범위(range)' : '사분위범위(IQR)';
    const askLabelEn = ask === 'range' ? 'range' : 'interquartile range (IQR)';
    const q1 = (list[0] + list[1]) / 2;
    const q3 = (list[2] + list[3]) / 2;

    const { choices, correctIdx } = buildChoices(ans, (i) => {
      if (i === 1) return ask === 'range' ? iqr : range;
      if (i === 2) return d;
      if (i === 3) return ans + d;
      return ans + randInt(1, 5) * (i % 2 === 0 ? 1 : -1);
    });

    const listStr = `\\{${list.join(', ')}\\}`;
    const question = lang === 'ko'
      ? `다음 자료의 ${askLabelKo}을(를) 구하세요: $${listStr}$`
      : `Find the ${askLabelEn} of the following data set: $${listStr}$`;
    const explanation = lang === 'ko'
      ? `**[The Essential Guide to Algebra 1 Topic 15.2 산포도]**\n\n범위는 최댓값$-$최솟값$=${list[3]}-${list[0]}=${range}$입니다. 사분위범위는 상위 절반의 중앙값($Q_3=${q3}$)에서 하위 절반의 중앙값($Q_1=${q1}$)을 뺀 값으로, $\\text{IQR}=${iqr}$입니다.\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans})** 입니다.`
      : `**[The Essential Guide to Algebra 1 Topic 15.2 Measures of Spread]**\n\nThe range is max $-$ min $=${list[3]}-${list[0]}=${range}$. The interquartile range is the median of the upper half ($Q_3=${q3}$) minus the median of the lower half ($Q_1=${q1}$), giving $\\text{IQR}=${iqr}$.\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // SYSTEMS OF EQUATIONS (The Essential Guide to Algebra 1, Topic 3: Two-Variable Equations)
  // -----------------------------------------------------------------------
  'systems-of-equations': (lang) => {
    const variant = pickRandom(['systems-word-problem', 'linear-elimination']);

    if (variant === 'systems-word-problem') {
      // AMC 8 Prep Vol. 3 Ch.18 Section 5: Systems of Linear Equations Word Problem
      const pricePen = randInt(2, 6);
      const priceBook = randInt(pricePen + 2, pricePen + 8);
      const a1 = 2, b1 = 3;
      const a2 = 3, b2 = 5;
      const cost1 = a1 * pricePen + b1 * priceBook;
      const cost2 = a2 * pricePen + b2 * priceBook;
      const targetItem = Math.random() < 0.5 ? 'pen' : 'book';
      const ans = targetItem === 'pen' ? pricePen : priceBook;

      const { choices, correctIdx } = buildChoices(`$${ans}`, (i) => {
        if (i === 1) return `$${targetItem === 'pen' ? priceBook : pricePen}`;
        if (i === 2) return `$${ans + 2}`;
        if (i === 3) return `$${Math.max(1, ans - 2)}`;
        return `$${ans + i + 1}`;
      });

      const question = lang === 'ko'
        ? `어떤 문구점에서 볼펜 $${a1}$자루와 공책 $${b1}$권의 가격은 $${cost1}달러이고, 같은 볼펜 $${a2}$자루와 공책 $${b2}$권의 가격은 $${cost2}달러입니다. 볼펜 $1$자루의 가격 $x$달러와 공책 $1$권의 가격 $y$달러 중, **${targetItem === 'pen' ? '볼펜 1자루의 가격' : '공책 1권의 가격'}** 은 얼마입니까?`
        : `At a bookstore, ${a1} pens and ${b1} notebooks cost $${cost1}, while ${a2} pens and ${b2} notebooks cost $${cost2}. What is the price of **${targetItem === 'pen' ? 'one pen' : 'one notebook'}**?`;

      const explanation = lang === 'ko'
        ? `**[AMC 8 Prep Vol. 3 Ch.18 연립방정식과 소거법(Elimination Method)]**\n\n볼펜의 가격을 $x$, 공책의 가격을 $y$라 두면 다음 연립방정식이 성립합니다:\n\n$$${a1}x + ${b1}y = ${cost1} \\quad \\cdots (1)$$\n$$${a2}x + ${b2}y = ${cost2} \\quad \\cdots (2)$$\n\n(1)식에 $3$을 곱하고 (2)식에 $2$를 곱하여 $x$를 소거합니다:\n\n$$6x + 9y = ${cost1 * 3}$$\n$$6x + 10y = ${cost2 * 2}$$\n\n두 식을 빼면:\n\n$$y = ${cost2 * 2} - ${cost1 * 3} = ${priceBook}$$\n\n이를 (1)식에 대입하면 $x = ${pricePen}$ 입니다.\n\n따라서 ${targetItem === 'pen' ? '볼펜 1자루' : '공책 1권'}의 가격은 **$${ans}달러** 입니다.\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} ($${ans})** 입니다.`
        : `**[AMC 8 Prep Vol. 3 Ch.18 Systems of Equations via Elimination]**\n\nLet $x$ be the price of a pen and $y$ the price of a notebook:\n\n$$${a1}x + ${b1}y = ${cost1} \\quad \\cdots (1)$$\n$$${a2}x + ${b2}y = ${cost2} \\quad \\cdots (2)$$\n\nMultiply (1) by 3 and (2) by 2 to eliminate $x$:\n\n$$6x + 9y = ${cost1 * 3}$$\n$$6x + 10y = ${cost2 * 2}$$\n\nSubtracting gives $y = ${priceBook}$, and substituting back gives $x = ${pricePen}$.\n\nThe price of ${targetItem === 'pen' ? 'one pen' : 'one notebook'} is **$${ans}**.\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} ($${ans})**.`;

      return { question, choices, correctIdx, explanation };
    }

    const x0 = randInt(-8, 8);
    const y0 = randInt(-8, 8);
    let a; let b; let d; let e;
    do {
      a = randInt(-6, 6) || 1;
      b = randInt(-6, 6) || 1;
      d = randInt(-6, 6) || 1;
      e = randInt(-6, 6) || 1;
    } while (a * e - b * d === 0);
    const c = a * x0 + b * y0;
    const f = d * x0 + e * y0;
    const ask = pickRandom(['x', 'y', 'sum']);
    const ans = ask === 'x' ? x0 : ask === 'y' ? y0 : x0 + y0;
    const askLabel = { x: '$x$', y: '$y$', sum: '$x+y$' }[ask];

    const { choices, correctIdx } = buildChoices(ans, (i) => {
      if (i === 1) return ask === 'sum' ? x0 - y0 : (ask === 'x' ? y0 : x0);
      if (i === 2) return -ans;
      if (i === 3) return ans + 5;
      return ans + randInt(2, 9) * (i % 2 === 0 ? 1 : -1);
    });

    const eq1 = `${a}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)}y = ${c}`;
    const eq2 = `${d}x ${e >= 0 ? '+' : '-'} ${Math.abs(e)}y = ${f}`;
    const question = lang === 'ko'
      ? `다음 연립방정식을 만족하는 ${askLabel}의 값을 구하세요.\n\n$$${eq1}$$\n$$${eq2}$$`
      : `Find the value of ${askLabel} that satisfies the system of equations.\n\n$$${eq1}$$\n$$${eq2}$$`;
    const explanation = lang === 'ko'
      ? `**[The Essential Guide to Algebra 1 Topic 3.2-3.3 대입과 소거]**\n\n두 식을 소거하여 풀면 $x=${x0}$, $y=${y0}$입니다.\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans})** 입니다.`
      : `**[The Essential Guide to Algebra 1 Topic 3.2-3.3 Substitution & Elimination]**\n\nSolving the system by elimination gives $x=${x0}$ and $y=${y0}$.\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // LINEAR GRAPHS & SLOPE (The Essential Guide to Algebra 1, Topic 5: Linear Graphs)
  // -----------------------------------------------------------------------
  'linear-graphs': (lang) => {
    const variant = pickRandom(['slope-two-points', 'perpendicular-slope', 'slope-yintercept-product']);

    if (variant === 'slope-yintercept-product') {
      const triplets = [
        { A: 2, B: 3, C: 18, prod: -4 },
        { A: 3, B: 2, C: 8, prod: -6 },
        { A: 2, B: 4, C: 16, prod: -2 },
        { A: 4, B: 3, C: 18, prod: -8 },
        { A: 3, B: 5, C: 25, prod: -3 },
        { A: 1, B: 2, C: 8, prod: -2 },
        { A: 3, B: 4, C: 16, prod: -3 },
      ];
      const { A, B, C, prod } = pickRandom(triplets);

      const { choices, correctIdx } = buildChoices(prod, (i) => {
        if (i === 1) return -prod;
        if (i === 2) return prod - 2;
        if (i === 3) return Math.round(C / B);
        return prod + randInt(2, 6) * (i % 2 === 0 ? 1 : -1);
      });

      const question = lang === 'ko'
        ? `직선의 방정식 $${A}x + ${B}y = ${C}$ 에 대하여, 이 직선의 기울기와 $y$절편의 곱을 구하세요.`
        : `For the linear equation $${A}x + ${B}y = ${C}$, find the product of the slope and the $y$-intercept.`;

      const yInt = C / B;

      const explanation = lang === 'ko'
        ? `**[The Essential Guide to Algebra 2 Topic 2.3 직선의 방정식과 기울기·절편]**\n\n방정식을 표준형($y = mx + b$)으로 변형합니다:\n$$${B}y = -${A}x + ${C} \\implies y = -\\frac{${A}}{${B}}x + ${yInt}$$\n\n- 기울기: $m = -\\frac{${A}}{${B}}$\n- $y$절편: $b = ${yInt}$\n\n따라서 두 값의 곱은:\n$$m \\times b = \\left(-\\frac{${A}}{${B}}\\right) \\times ${yInt} = ${prod}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${prod})** 입니다.`
        : `**[The Essential Guide to Algebra 2 Topic 2.3 Slope & Y-Intercept of a Line]**\n\nConvert into slope-intercept form ($y = mx + b$):\n$$${B}y = -${A}x + ${C} \\implies y = -\\frac{${A}}{${B}}x + ${yInt}$$\n\n- Slope: $m = -\\frac{${A}}{${B}}$\n- $y$-intercept: $b = ${yInt}$\n\nThe product is:\n$$m \\times b = \\left(-\\frac{${A}}{${B}}\\right) \\times ${yInt} = ${prod}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${prod})**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'slope-two-points') {
      const x1 = randInt(-8, 8);
      const y1 = randInt(-8, 8);
      const m = pickRandom([-4, -3, -2, -1, 1, 2, 3, 4]);
      const dx = pickRandom([1, 2, 3]);
      const x2 = x1 + dx;
      const y2 = y1 + m * dx;

      const { choices, correctIdx } = buildChoices(m, (i) => {
        if (i === 1) return -m;
        if (i === 2) return m + 1;
        if (i === 3) return m - 1;
        return m + (i % 2 === 0 ? i : -i);
      });

      const question = lang === 'ko'
        ? `두 점 $(${x1}, ${y1})$과 $(${x2}, ${y2})$를 지나는 직선의 기울기를 구하세요.`
        : `Find the slope of the line passing through the points $(${x1}, ${y1})$ and $(${x2}, ${y2})$.`;
      const explanation = lang === 'ko'
        ? `**[The Essential Guide to Algebra 1 Topic 5.3 기울기]**\n\n기울기는 $\\dfrac{y_2-y_1}{x_2-x_1} = \\dfrac{${y2}-(${y1})}{${x2}-(${x1})} = \\dfrac{${y2 - y1}}{${x2 - x1}} = ${m}$입니다.\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${m})** 입니다.`
        : `**[The Essential Guide to Algebra 1 Topic 5.3 Slope]**\n\nThe slope is $\\dfrac{y_2-y_1}{x_2-x_1} = \\dfrac{${y2}-(${y1})}{${x2}-(${x1})} = \\dfrac{${y2 - y1}}{${x2 - x1}} = ${m}$.\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${m})**.`;

      return { question, choices, correctIdx, explanation };
    }

    // perpendicular-slope
    const m = pickRandom([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]);
    const num = m < 0 ? 1 : -1;
    const den = Math.abs(m);
    const ans = `${num}/${den}`;

    const { choices, correctIdx } = buildChoices(ans, (i) => {
      if (i === 1) return `${-num}/${den}`;
      if (i === 2) return `${m}`;
      if (i === 3) return `${-m}`;
      return `${num}/${den + i}`;
    });

    const question = lang === 'ko'
      ? `기울기가 $${m}$인 직선에 수직인 직선의 기울기를 구하세요.`
      : `Find the slope of a line perpendicular to a line with slope $${m}$.`;
    const explanation = lang === 'ko'
      ? `**[The Essential Guide to Algebra 1 Topic 5.6 평행선과 수직선]**\n\n두 직선이 수직이면 기울기의 곱이 $-1$입니다. 따라서 수직인 직선의 기울기는 $-\\dfrac{1}{${m}} = ${ans}$입니다.\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans})** 입니다.`
      : `**[The Essential Guide to Algebra 1 Topic 5.6 Parallel & Perpendicular Lines]**\n\nPerpendicular lines have slopes whose product is $-1$, so the perpendicular slope is $-\\dfrac{1}{${m}} = ${ans}$.\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // FACTORING QUADRATICS (The Essential Guide to Algebra 1, Topics 7-8)
  // -----------------------------------------------------------------------
  'factoring-quadratics': (lang) => {
    const variant = pickRandom(['factor-monic', 'difference-of-squares']);

    if (variant === 'factor-monic') {
      const r = randInt(-9, 9) || 1;
      let s = randInt(-9, 9) || 2;
      while (s === r) s = randInt(-9, 9) || (r + 1);
      const b = -(r + s);
      const c = r * s;
      const larger = Math.max(r, s);

      const { choices, correctIdx } = buildChoices(larger, (i) => {
        if (i === 1) return Math.min(r, s);
        if (i === 2) return -larger;
        if (i === 3) return larger + 1;
        return larger + (i % 2 === 0 ? i : -i);
      });

      const bTerm = b === 0 ? '' : (b > 0 ? ` + ${b}x` : ` - ${Math.abs(b)}x`);
      const cTerm = c >= 0 ? ` + ${c}` : ` - ${Math.abs(c)}`;
      const question = lang === 'ko'
        ? `이차방정식 $x^2${bTerm}${cTerm} = 0$의 두 해 중 더 큰 값을 구하세요.`
        : `Find the larger of the two solutions to the quadratic equation $x^2${bTerm}${cTerm} = 0$.`;
      const explanation = lang === 'ko'
        ? `**[The Essential Guide to Algebra 1 Topic 7.2-7.3 인수분해]**\n\n좌변을 인수분해하면 $(x-(${r}))(x-(${s}))=0$이므로, 해는 $x=${r}$ 또는 $x=${s}$입니다. 더 큰 값은 $${larger}$입니다.\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${larger})** 입니다.`
        : `**[The Essential Guide to Algebra 1 Topic 7.2-7.3 Factoring]**\n\nFactoring the left side gives $(x-(${r}))(x-(${s}))=0$, so $x=${r}$ or $x=${s}$. The larger value is $${larger}$.\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${larger})**.`;

      return { question, choices, correctIdx, explanation };
    }

    // difference-of-squares
    const b = randInt(5, 40);
    const a = b + randInt(1, 6) * 2;
    const ans = a * a - b * b;

    const { choices, correctIdx } = buildChoices(ans, (i) => {
      if (i === 1) return (a - b) * (a + b - 2);
      if (i === 2) return a * a + b * b;
      if (i === 3) return (a + b) * (a + b);
      return ans + randInt(2, 20) * (i % 2 === 0 ? 1 : -1);
    });

    const question = lang === 'ko'
      ? `합차공식을 이용하여 $${a}^2 - ${b}^2$의 값을 구하세요.`
      : `Use the difference of squares to compute $${a}^2 - ${b}^2$.`;
    const explanation = lang === 'ko'
      ? `**[The Essential Guide to Algebra 1 Topic 8.2 합차공식]**\n\n$A^2-B^2=(A-B)(A+B)$이므로,\n\n$$${a}^2 - ${b}^2 = (${a}-${b})(${a}+${b}) = ${a - b}\\times${a + b} = ${ans}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans})** 입니다.`
      : `**[The Essential Guide to Algebra 1 Topic 8.2 Difference of Squares]**\n\nSince $A^2-B^2=(A-B)(A+B)$,\n\n$$${a}^2 - ${b}^2 = (${a}-${b})(${a}+${b}) = ${a - b}\\times${a + b} = ${ans}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // COMPLETING THE SQUARE & QUADRATIC FORMULA (The Essential Guide to Algebra 1, Topic 10)
  // -----------------------------------------------------------------------
  'completing-square': (lang) => {
    const variant = pickRandom(['complete-square-constant', 'quadratic-formula']);

    if (variant === 'complete-square-constant') {
      const p = randInt(-9, 9) || 1;
      const b = 2 * p;
      const c = randInt(-25, 25);
      const q = c - p * p;

      const { choices, correctIdx } = buildChoices(q, (i) => {
        if (i === 1) return c + p * p;
        if (i === 2) return -q;
        if (i === 3) return c;
        return q + randInt(2, 9) * (i % 2 === 0 ? 1 : -1);
      });

      const bTerm = b === 0 ? '' : (b > 0 ? ` + ${b}x` : ` - ${Math.abs(b)}x`);
      const cTerm = c >= 0 ? ` + ${c}` : ` - ${Math.abs(c)}`;
      const pTerm = p >= 0 ? `+ ${p}` : `- ${Math.abs(p)}`;
      const question = lang === 'ko'
        ? `$x^2${bTerm}${cTerm}$를 완전제곱식을 이용하여 $(x ${pTerm})^2 + q$ 꼴로 나타낼 때, $q$의 값을 구하세요.`
        : `Complete the square to write $x^2${bTerm}${cTerm}$ in the form $(x ${pTerm})^2 + q$. Find the value of $q$.`;
      const explanation = lang === 'ko'
        ? `**[The Essential Guide to Algebra 1 Topic 10.2 완전제곱식]**\n\n$x^2${bTerm} = (x ${pTerm})^2 - ${p * p}$이므로,\n\n$$x^2${bTerm}${cTerm} = (x ${pTerm})^2 - ${p * p}${cTerm} = (x ${pTerm})^2 + ${q}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${q})** 입니다.`
        : `**[The Essential Guide to Algebra 1 Topic 10.2 Completing the Square]**\n\n$x^2${bTerm} = (x ${pTerm})^2 - ${p * p}$, so\n\n$$x^2${bTerm}${cTerm} = (x ${pTerm})^2 - ${p * p}${cTerm} = (x ${pTerm})^2 + ${q}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${q})**.`;

      return { question, choices, correctIdx, explanation };
    }

    // quadratic-formula: larger root of a x^2+bx+c=0 built from clean integer roots
    const a = pickRandom([1, 2, 3]);
    const r = randInt(-6, 6) || 1;
    let s = randInt(-6, 6) || 2;
    while (s === r) s = randInt(-6, 6) || (r + 1);
    const b = -a * (r + s);
    const c = a * r * s;
    const larger = Math.max(r, s);

    const { choices, correctIdx } = buildChoices(larger, (i) => {
      if (i === 1) return Math.min(r, s);
      if (i === 2) return -larger;
      if (i === 3) return larger + a;
      return larger + (i % 2 === 0 ? i : -i);
    });

    const bTerm = b === 0 ? '' : (b > 0 ? ` + ${b}x` : ` - ${Math.abs(b)}x`);
    const cTerm = c >= 0 ? ` + ${c}` : ` - ${Math.abs(c)}`;
    const question = lang === 'ko'
      ? `근의 공식을 이용하여 $${a}x^2${bTerm}${cTerm} = 0$의 두 해 중 더 큰 값을 구하세요.`
      : `Use the quadratic formula to find the larger solution to $${a}x^2${bTerm}${cTerm} = 0$.`;
    const explanation = lang === 'ko'
      ? `**[The Essential Guide to Algebra 1 Topic 10.3 근의 공식]**\n\n$x=\\dfrac{-b\\pm\\sqrt{b^2-4ac}}{2a}$에 $a=${a}, b=${b}, c=${c}$를 대입하면 $x=${r}$ 또는 $x=${s}$를 얻습니다. 더 큰 값은 $${larger}$입니다.\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${larger})** 입니다.`
      : `**[The Essential Guide to Algebra 1 Topic 10.3 Quadratic Formula]**\n\nSubstituting $a=${a}, b=${b}, c=${c}$ into $x=\\dfrac{-b\\pm\\sqrt{b^2-4ac}}{2a}$ gives $x=${r}$ or $x=${s}$. The larger value is $${larger}$.\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${larger})**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // QUADRATIC VERTEX & OPTIMIZATION (The Essential Guide to Algebra 1, Topic 11.5)
  // -----------------------------------------------------------------------
  'quadratic-optimization': (lang) => {
    const a = pickRandom([1, 2, 3, -1, -2, -3]);
    const h = randInt(-8, 8);
    const k = randInt(-15, 15);
    const b = -2 * a * h;
    const c = a * h * h + k;
    const aLead = a === 1 ? '' : (a === -1 ? '-' : `${a}`);

    const { choices, correctIdx } = buildChoices(k, (i) => {
      if (i === 1) return c;
      if (i === 2) return -k;
      if (i === 3) return k + a;
      return k + randInt(2, 9) * (i % 2 === 0 ? 1 : -1);
    });

    const bTerm = b === 0 ? '' : (b > 0 ? ` + ${b}x` : ` - ${Math.abs(b)}x`);
    const cTerm = c >= 0 ? ` + ${c}` : ` - ${Math.abs(c)}`;
    const extremeKo = a > 0 ? '최솟값' : '최댓값';
    const extremeEn = a > 0 ? 'minimum value' : 'maximum value';
    const question = lang === 'ko'
      ? `이차함수 $y = ${aLead}x^2${bTerm}${cTerm}$의 ${extremeKo}을 구하세요.`
      : `Find the ${extremeEn} of the quadratic function $y = ${aLead}x^2${bTerm}${cTerm}$.`;
    const explanation = lang === 'ko'
      ? `**[The Essential Guide to Algebra 1 Topic 11.5 이차함수의 최대·최소]**\n\n완전제곱식으로 변형하면 $y = ${aLead}(x - (${h}))^2 + ${k}$이므로, 꼭짓점은 $(${h}, ${k})$입니다. $a${a > 0 ? '>0' : '<0'}$이므로 ${extremeKo}은 $${k}$입니다.\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${k})** 입니다.`
      : `**[The Essential Guide to Algebra 1 Topic 11.5 Quadratic Optimization]**\n\nCompleting the square gives $y = ${aLead}(x - (${h}))^2 + ${k}$, so the vertex is $(${h}, ${k})$. Since $a${a > 0 ? '>0' : '<0'}$, the ${extremeEn} is $${k}$.\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${k})**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // QUADRATIC INEQUALITIES & DISCRIMINANTS (The Essential Guide to Algebra 2, Topic 4.7-4.8)
  // -----------------------------------------------------------------------
  'quadratic-inequalities': (lang) => {
    const variant = pickRandom(['integer-solutions-count', 'always-positive-condition', 'double-root-discriminant']);

    if (variant === 'integer-solutions-count') {
      const r1 = randInt(-7, 2);
      const span = randInt(4, 12);
      const r2 = r1 + span;
      const b = -(r1 + r2);
      const c = r1 * r2;
      const bTerm = b === 0 ? '' : b > 0 ? ` + ${b === 1 ? '' : b}x` : ` - ${Math.abs(b) === 1 ? '' : Math.abs(b)}x`;
      const cTerm = c === 0 ? '' : c > 0 ? ` + ${c}` : ` - ${Math.abs(c)}`;

      const ans = span + 1;
      const { choices, correctIdx } = buildChoices(ans, (i) => {
        if (i === 1) return span;
        if (i === 2) return span - 1;
        if (i === 3) return span + 2;
        return ans + randInt(3, 6) * (i % 2 === 0 ? 1 : -1);
      });

      const question = lang === 'ko'
        ? `이차부등식 $x^2${bTerm}${cTerm} \\le 0$ 을 만족하는 정수 $x$의 개수를 구하세요.`
        : `How many integers $x$ satisfy the quadratic inequality $x^2${bTerm}${cTerm} \\le 0$?`;

      const explanation = lang === 'ko'
        ? `**[The Essential Guide to Algebra 2 Topic 4.7 이차부등식 (Quadratic Inequalities)]**\n\n좌변을 인수분해하면 $(x - (${r1}))(x - (${r2})) \\le 0$ 입니다.\n따라서 해는 $${r1} \\le x \\le ${r2}$ 이며, 이를 만족하는 정수 $x$의 개수는\n\n$$${r2} - (${r1}) + 1 = ${ans}\\text{개}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans})** 입니다.`
        : `**[The Essential Guide to Algebra 2 Topic 4.7 Quadratic Inequalities]**\n\nFactoring the left side gives $(x - (${r1}))(x - (${r2})) \\le 0$.\nTherefore, the solution set is $${r1} \\le x \\le ${r2}$. The number of integers in this range is\n\n$$${r2} - (${r1}) + 1 = ${ans}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'always-positive-condition') {
      const r1 = randInt(-5, -2);
      const r2 = randInt(1, 6);
      const span = r2 - r1;
      const m = r1 + r2;
      const n = -r1 * r2;
      const ans = span - 1;
      const { choices, correctIdx } = buildChoices(ans, (i) => {
        if (i === 1) return span;
        if (i === 2) return span + 1;
        if (i === 3) return Math.max(1, span - 2);
        return ans + randInt(2, 5) * (i % 2 === 0 ? 1 : -1);
      });

      const mCoeff = m === 1 ? 'k' : m === -1 ? '-k' : m !== 0 ? `${m}k` : '';
      const nCoeff = n > 0 ? `+ ${n}` : n < 0 ? `- ${Math.abs(n)}` : '';
      const constExp = `(${mCoeff} ${nCoeff})`.trim().replace(/\(\s*\+/, '(').replace(/\s+/g, ' ');

      const negMTerm = -m === 1 ? '+ k' : -m === -1 ? '- k' : -m > 0 ? `+ ${-m}k` : -m < 0 ? `- ${Math.abs(m)}k` : '';

      const question = lang === 'ko'
        ? `모든 실수 $x$에 대하여 이차부등식 $x^2 + 2kx + ${constExp} > 0$ 이 항상 성립하도록 하는 정수 $k$의 개수를 구하세요.`
        : `Find the number of integer values of $k$ for which the inequality $x^2 + 2kx + ${constExp} > 0$ holds for all real numbers $x$.`;

      const explanation = lang === 'ko'
        ? `**[The Essential Guide to Algebra 2 Topic 4.8 이차부등식과 판별식 (Definite Quadratics)]**\n\n이차항의 계수가 $1 > 0$이므로 모든 실수 $x$에 대해 성립하려면 판별식 $D < 0$이어야 합니다:\n\n$$\\frac{D}{4} = k^2 - ${constExp} = k^2 ${negMTerm} - ${n} < 0$$\n$$(k - (${r1}))(k - (${r2})) < 0 \\implies ${r1} < k < ${r2}$$\n\n따라서 이를 만족하는 정수 $k$는 $${r1 + 1}$부터 $${r2 - 1}$까지 총 **$${ans}$개**입니다.\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans})** 입니다.`
        : `**[The Essential Guide to Algebra 2 Topic 4.8 Quadratic Inequalities & Discriminants]**\n\nSince the coefficient of $x^2$ is positive ($1 > 0$), the quadratic is strictly positive for all real $x$ if and only if its discriminant $D < 0$:\n\n$$\\frac{D}{4} = k^2 - ${constExp} = k^2 ${negMTerm} - ${n} < 0$$\n$$(k - (${r1}))(k - (${r2})) < 0 \\implies ${r1} < k < ${r2}$$\n\nThus, the integer values of $k$ are from $${r1 + 1}$ to $${r2 - 1}$, giving **${ans}** integers.\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

      return { question, choices, correctIdx, explanation };
    }

    // double-root-discriminant
    const k1 = randInt(1, 6);
    const k2 = randInt(-6, -1);
    const A = k1 + k2;
    const B = -k1 * k2;
    const ans = k1;
    const { choices, correctIdx } = buildChoices(ans, (i) => {
      if (i === 1) return Math.abs(k2);
      if (i === 2) return k1 + 1;
      if (i === 3) return Math.abs(A) + 1;
      return ans + randInt(2, 5);
    });

    const aCoeff = A === 1 ? 'k' : A === -1 ? '-k' : A !== 0 ? `${A}k` : '';
    const bCoeff = B > 0 ? `+ ${B}` : B < 0 ? `- ${Math.abs(B)}` : '';
    const tailExp = `(${aCoeff} ${bCoeff})`.trim().replace(/\(\s*\+/, '(').replace(/\s+/g, ' ');
    const negATerm = -A === 1 ? '+ k' : -A === -1 ? '- k' : -A > 0 ? `+ ${-A}k` : -A < 0 ? `- ${Math.abs(A)}k` : '';

    const question = lang === 'ko'
      ? `이차방정식 $x^2 + 2kx + ${tailExp} = 0$ 이 중근(실근 하나)을 갖도록 하는 양수 $k$의 값을 구하세요.`
      : `Find the positive value of $k$ such that the quadratic equation $x^2 + 2kx + ${tailExp} = 0$ has a repeated real root (double root).`;

    const explanation = lang === 'ko'
      ? `**[The Essential Guide to Algebra 2 Topic 4.5 판별식과 근의 성질 (Discriminant)]**\n\n이차방정식이 중근을 가질 조건은 판별식 $D = 0$ 입니다:\n\n$$\\frac{D}{4} = k^2 - ${tailExp} = k^2 ${negATerm} - ${B} = 0$$\n$$(k - ${k1})(k - (${k2})) = 0 \\implies k = ${k1} \\text{ 또는 } k = ${k2}$$\n\n양수 $k$를 구하므로 정답은 **$${ans}$** 입니다.\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans})** 입니다.`
      : `**[The Essential Guide to Algebra 2 Topic 4.5 Discriminant and Nature of Roots]**\n\nFor a quadratic equation to have a repeated real root, its discriminant must equal $0$:\n\n$$\\frac{D}{4} = k^2 - ${tailExp} = k^2 ${negATerm} - ${B} = 0$$\n$$(k - ${k1})(k - (${k2})) = 0 \\implies k = ${k1} \\text{ or } k = ${k2}$$\n\nSince $k > 0$, the value is **${ans}**.\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // FUNCTION GRAPHS & TRANSFORMATIONS (The Essential Guide to Algebra 1, Topic 13)
  // -----------------------------------------------------------------------
  'function-transformations': (lang) => {
    const px = randInt(-6, 6);
    const py = randInt(-9, 9) || 1;
    const transform = pickRandom(['vshift', 'hshift', 'reflectX', 'reflectY', 'vscale', 'combo']);
    const kShift = randInt(1, 5) * pickRandom([1, -1]);
    const hShift = randInt(1, 5) * pickRandom([1, -1]);
    const scale = pickRandom([2, 3, -1, -2]);

    let newX = px; let newY = py; let rule = '';
    if (transform === 'vshift') {
      newY = py + kShift;
      rule = `y = f(x) ${kShift >= 0 ? '+' : '-'} ${Math.abs(kShift)}`;
    } else if (transform === 'hshift') {
      newX = px + hShift;
      rule = `y = f(x ${hShift >= 0 ? '-' : '+'} ${Math.abs(hShift)})`;
    } else if (transform === 'reflectX') {
      newY = -py;
      rule = 'y = -f(x)';
    } else if (transform === 'reflectY') {
      newX = -px;
      rule = 'y = f(-x)';
    } else if (transform === 'vscale') {
      newY = scale * py;
      rule = `y = ${scale}f(x)`;
    } else {
      newX = px + hShift;
      newY = py + kShift;
      rule = `y = f(x ${hShift >= 0 ? '-' : '+'} ${Math.abs(hShift)}) ${kShift >= 0 ? '+' : '-'} ${Math.abs(kShift)}`;
    }

    const ans = `(${newX}, ${newY})`;

    const { choices, correctIdx } = buildChoices(ans, (i) => {
      if (i === 1) return `(${px}, ${py})`;
      if (i === 2) return `(${-newX}, ${newY})`;
      if (i === 3) return `(${newX}, ${-newY})`;
      return `(${newX + i}, ${newY - i})`;
    });

    const question = lang === 'ko'
      ? `점 $(${px}, ${py})$가 함수 $y=f(x)$의 그래프 위에 있을 때, $${rule}$의 그래프 위에 반드시 있어야 하는 점을 구하세요.`
      : `If the point $(${px}, ${py})$ lies on the graph of $y=f(x)$, find a point that must lie on the graph of $${rule}$.`;
    const explanation = lang === 'ko'
      ? `**[The Essential Guide to Algebra 1 Topic 13.2 그래프의 변환]**\n\n주어진 변환 규칙을 $(${px},${py})$에 적용하면 $(${newX}, ${newY})$를 얻습니다.\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans})** 입니다.`
      : `**[The Essential Guide to Algebra 1 Topic 13.2 Graph Transformations]**\n\nApplying the given transformation rule to $(${px},${py})$ gives $(${newX}, ${newY})$.\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // POLYNOMIAL ARITHMETIC (The Essential Guide to Algebra 1, Topic 14)
  // -----------------------------------------------------------------------
  'polynomial-arithmetic': (lang) => {
    const variant = pickRandom(['remainder-theorem', 'coefficient-of-product']);

    const term = (c, deg) => {
      if (c === 0) return '';
      const sign = c > 0 ? '+' : '-';
      const abs = Math.abs(c);
      const varPart = deg === 0 ? '' : (deg === 1 ? 'x' : `x^${deg}`);
      const coeffPart = (abs === 1 && deg > 0) ? '' : `${abs}`;
      return ` ${sign} ${coeffPart}${varPart}`;
    };

    if (variant === 'remainder-theorem') {
      const a3 = randInt(-4, 4) || 1;
      const a2 = randInt(-6, 6);
      const a1 = randInt(-6, 6);
      const a0 = randInt(-9, 9);
      const k = randInt(-4, 4) || 1;
      const remainder = a3 * k ** 3 + a2 * k ** 2 + a1 * k + a0;

      const { choices, correctIdx } = buildChoices(remainder, (i) => {
        if (i === 1) return a3 * k ** 3 + a2 * k ** 2 + a1 * k - a0;
        if (i === 2) return a3 + a2 + a1 + a0;
        if (i === 3) return remainder + k;
        return remainder + randInt(2, 12) * (i % 2 === 0 ? 1 : -1);
      });

      const poly = `${a3}x^3${term(a2, 2)}${term(a1, 1)}${term(a0, 0)}`;
      const divisor = k >= 0 ? `x - ${k}` : `x + ${Math.abs(k)}`;
      const substituted = `${a3}(${k})^3${term(a2, 2).replace('x^2', `(${k})^2`)}${term(a1, 1).replace('x', `(${k})`)}${term(a0, 0)}`;

      const question = lang === 'ko'
        ? `다항식 $p(x) = ${poly}$를 $${divisor}$로 나눈 나머지를 구하세요.`
        : `Find the remainder when $p(x) = ${poly}$ is divided by $${divisor}$.`;
      const explanation = lang === 'ko'
        ? `**[The Essential Guide to Algebra 1 Topic 14.2 나머지 정리]**\n\n나머지 정리에 의해, $p(x)$를 $x-${k}$로 나눈 나머지는 $p(${k})$와 같습니다:\n\n$$p(${k}) = ${substituted} = ${remainder}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${remainder})** 입니다.`
        : `**[The Essential Guide to Algebra 1 Topic 14.2 Remainder Theorem]**\n\nBy the Remainder Theorem, the remainder when $p(x)$ is divided by $x-${k}$ equals $p(${k})$:\n\n$$p(${k}) = ${substituted} = ${remainder}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${remainder})**.`;

      return { question, choices, correctIdx, explanation };
    }

    // coefficient-of-product
    const a2 = randInt(-5, 5) || 1;
    const a1 = randInt(-6, 6);
    const a0 = randInt(-6, 6);
    const b1 = randInt(-5, 5) || 1;
    const b0 = randInt(-6, 6);
    const coeffX2 = a2 * b0 + a1 * b1;

    const { choices, correctIdx } = buildChoices(coeffX2, (i) => {
      if (i === 1) return a2 * b1;
      if (i === 2) return a1 * b0;
      if (i === 3) return a2 * b0 - a1 * b1;
      return coeffX2 + randInt(2, 9) * (i % 2 === 0 ? 1 : -1);
    });

    const p1 = `${a2}x^2${term(a1, 1)}${term(a0, 0)}`;
    const p2 = `${b1}x${term(b0, 0)}`;

    const question = lang === 'ko'
      ? `$(${p1})(${p2})$를 전개했을 때, $x^2$의 계수를 구하세요.`
      : `When $(${p1})(${p2})$ is expanded, find the coefficient of $x^2$.`;
    const explanation = lang === 'ko'
      ? `**[The Essential Guide to Algebra 1 Topic 14.1 다항식의 곱셈]**\n\n$x^2$항은 $(${a2}x^2)(${b0}) + (${a1}x)(${b1}x)$에서 나오므로, 계수는 $${a2}\\times${b0} + ${a1}\\times${b1} = ${coeffX2}$입니다.\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${coeffX2})** 입니다.`
      : `**[The Essential Guide to Algebra 1 Topic 14.1 Multiplying Polynomials]**\n\nThe $x^2$ term comes from $(${a2}x^2)(${b0}) + (${a1}x)(${b1}x)$, so the coefficient is $${a2}\\times${b0} + ${a1}\\times${b1} = ${coeffX2}$.\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${coeffX2})**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // RADICALS & RATIONAL EXPONENTS (The Essential Guide to Algebra 2, Topic 7)
  // -----------------------------------------------------------------------
  'radicals-exponents': (lang) => {
    const variant = pickRandom(['rational-exponent', 'simplify-radical']);

    if (variant === 'rational-exponent') {
      const n = randInt(2, 4);
      const q = randInt(2, 3);
      const b = n ** q;
      const p = randInt(1, 3);
      const ans = n ** p;

      const { choices, correctIdx } = buildChoices(ans, (i) => {
        if (i === 1) return n ** (q - p > 0 ? q - p : p);
        if (i === 2) return b - ans;
        if (i === 3) return ans + n;
        return ans + randInt(2, 8) * (i % 2 === 0 ? 1 : -1);
      });

      const question = lang === 'ko'
        ? `$${b}^{\\frac{${p}}{${q}}}$의 값을 구하세요.`
        : `Evaluate $${b}^{\\frac{${p}}{${q}}}$.`;
      const explanation = lang === 'ko'
        ? `**[The Essential Guide to Algebra 2 Topic 7.3 유리지수]**\n\n$${b}^{\\frac{${p}}{${q}}} = (\\sqrt[${q}]{${b}})^{${p}} = ${n}^{${p}} = ${ans}$입니다.\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans})** 입니다.`
        : `**[The Essential Guide to Algebra 2 Topic 7.3 Rational Exponents]**\n\n$${b}^{\\frac{${p}}{${q}}} = (\\sqrt[${q}]{${b}})^{${p}} = ${n}^{${p}} = ${ans}$.\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

      return { question, choices, correctIdx, explanation };
    }

    // simplify-radical: sqrt(k^2 * m) = k*sqrt(m), m squarefree
    const k = randInt(2, 6);
    const m = pickRandom([2, 3, 5, 6, 7, 10, 11, 13]);
    const N = k * k * m;
    const ans = `${k}\\sqrt{${m}}`;

    const { choices, correctIdx } = buildChoices(ans, (i) => {
      if (i === 1) return `${k}\\sqrt{${N}}`;
      if (i === 2) return `${k * m}\\sqrt{${m}}`;
      if (i === 3) return `${k + 1}\\sqrt{${m}}`;
      return `${k}\\sqrt{${m + i}}`;
    });

    const question = lang === 'ko'
      ? `$\\sqrt{${N}}$을 간단히 하세요.`
      : `Simplify $\\sqrt{${N}}$.`;
    const explanation = lang === 'ko'
      ? `**[The Essential Guide to Algebra 2 Topic 7.1 근호의 단순화]**\n\n$${N} = ${k}^2 \\times ${m}$이므로,\n\n$$\\sqrt{${N}} = \\sqrt{${k}^2\\times${m}} = ${k}\\sqrt{${m}}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans})** 입니다.`
      : `**[The Essential Guide to Algebra 2 Topic 7.1 Simplifying Radicals]**\n\nSince $${N} = ${k}^2 \\times ${m}$,\n\n$$\\sqrt{${N}} = \\sqrt{${k}^2\\times${m}} = ${k}\\sqrt{${m}}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // RATIONAL FUNCTIONS (The Essential Guide to Algebra 2, Topic 8)
  // -----------------------------------------------------------------------
  'rational-functions': (lang) => {
    const variant = pickRandom(['vertical-asymptotes', 'solve-rational-equation', 'oblique-asymptotes']);

    if (variant === 'oblique-asymptotes') {
      const a = pickRandom([1, 2, 3]);
      const d = pickRandom([-3, -2, -1, 1, 2, 3]);
      const k = randInt(-5, 5);
      const b = k - a * d;
      const c = randInt(1, 9);
      const ans = k;

      const { choices, correctIdx } = buildChoices(ans, (i) => {
        if (i === 1) return ans + a;
        if (i === 2) return -ans;
        if (i === 3) return b;
        return ans + randInt(2, 6) * (i % 2 === 0 ? 1 : -1);
      });

      const numerStr = `${a === 1 ? '' : a}x^2 ${b >= 0 ? '+' : '-'} ${Math.abs(b)}x ${c >= 0 ? '+' : '-'} ${Math.abs(c)}`;
      const denomStr = d >= 0 ? `x - ${d}` : `x + ${Math.abs(d)}`;

      const question = lang === 'ko'
        ? `유리함수 $f(x) = \\dfrac{${numerStr}}{${denomStr}}$ 의 사선점근선(oblique asymptote)의 $y$절편을 구하세요.`
        : `Find the $y$-intercept of the oblique (slant) asymptote of the rational function $f(x) = \\dfrac{${numerStr}}{${denomStr}}$.`;

      const slantLine = `${a === 1 ? '' : a}x ${k >= 0 ? '+' : '-'} ${Math.abs(k)}`;

      const explanation = lang === 'ko'
        ? `**[The Essential Guide to Algebra 2 Topic 8.4 사선점근선 (Oblique Asymptote)]**\n\n분자의 차수가 분모의 차수보다 $1$차수 높으므로 다항식 나눗셈을 통해 사선점근선을 구합니다:\n\n$$\\frac{${numerStr}}{${denomStr}} = (${slantLine}) + \\frac{R}{${denomStr}}$$\n\n따라서 사선점근선의 방정식은 $y = ${slantLine}$ 이며, $y$절편은 **$${ans}$** 입니다.\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans})** 입니다.`
        : `**[The Essential Guide to Algebra 2 Topic 8.4 Oblique Asymptotes]**\n\nSince the degree of the numerator is $1$ greater than the denominator, perform polynomial division:\n\n$$\\frac{${numerStr}}{${denomStr}} = (${slantLine}) + \\frac{R}{${denomStr}}$$\n\nThe equation of the oblique (slant) asymptote is $y = ${slantLine}$, so its $y$-intercept is **$${ans}$**.\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'vertical-asymptotes') {
      const h = randInt(-6, 6) || 1;
      let j = randInt(-6, 6) || 2;
      while (j === h) j = randInt(-6, 6) || (h + 1);
      const b = -(h + j);
      const c = h * j;
      let a = randInt(-8, 8);
      while (-a === h || -a === j) a = randInt(-8, 8);
      const ans = h + j;

      const { choices, correctIdx } = buildChoices(ans, (i) => {
        if (i === 1) return h * j;
        if (i === 2) return -ans;
        if (i === 3) return Math.max(h, j) - Math.min(h, j);
        return ans + randInt(2, 8) * (i % 2 === 0 ? 1 : -1);
      });

      const bTerm = b === 0 ? '' : (b > 0 ? ` + ${b}x` : ` - ${Math.abs(b)}x`);
      const cTerm = c >= 0 ? ` + ${c}` : ` - ${Math.abs(c)}`;
      const aTerm = a >= 0 ? `x + ${a}` : `x - ${Math.abs(a)}`;
      const question = lang === 'ko'
        ? `유리함수 $f(x) = \\dfrac{${aTerm}}{x^2${bTerm}${cTerm}}$의 모든 수직점근선의 $x$값의 합을 구하세요.`
        : `Find the sum of the $x$-values of all vertical asymptotes of $f(x) = \\dfrac{${aTerm}}{x^2${bTerm}${cTerm}}$.`;
      const explanation = lang === 'ko'
        ? `**[The Essential Guide to Algebra 2 Topic 8.4 수직점근선]**\n\n분모를 인수분해하면 $x^2${bTerm}${cTerm} = (x-(${h}))(x-(${j}))$이므로, 수직점근선은 $x=${h}$와 $x=${j}$입니다 (분자는 이 값들에서 $0$이 되지 않으므로 구멍이 아닙니다). 합은 $${h}+${j}=${ans}$입니다.\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans})** 입니다.`
        : `**[The Essential Guide to Algebra 2 Topic 8.4 Vertical Asymptotes]**\n\nFactoring the denominator gives $x^2${bTerm}${cTerm} = (x-(${h}))(x-(${j}))$, so the vertical asymptotes are $x=${h}$ and $x=${j}$ (the numerator doesn't vanish there, so these aren't holes). The sum is $${h}+${j}=${ans}$.\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

      return { question, choices, correctIdx, explanation };
    }

    // solve-rational-equation: k/(x-h) = m, solve for x
    const h = randInt(-8, 8);
    let xTarget = randInt(-8, 8);
    while (xTarget === h) xTarget = randInt(-8, 8);
    const m = pickRandom([2, 3, -2, -3, 4, -4]);
    const k = m * (xTarget - h);

    const { choices, correctIdx } = buildChoices(xTarget, (i) => {
      if (i === 1) return h;
      if (i === 2) return -xTarget;
      if (i === 3) return h - (xTarget - h);
      return xTarget + randInt(2, 7) * (i % 2 === 0 ? 1 : -1);
    });

    const hTerm = h >= 0 ? `x - ${h}` : `x + ${Math.abs(h)}`;
    const question = lang === 'ko'
      ? `방정식 $\\dfrac{${k}}{${hTerm}} = ${m}$을 만족하는 $x$의 값을 구하세요.`
      : `Solve $\\dfrac{${k}}{${hTerm}} = ${m}$ for $x$.`;
    const explanation = lang === 'ko'
      ? `**[The Essential Guide to Algebra 2 Topic 8.7 유리방정식]**\n\n양변에 $${hTerm}$을 곱하면 $${k} = ${m}(${hTerm})$이므로,\n\n$$${hTerm} = \\frac{${k}}{${m}} \\implies x = ${xTarget}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${xTarget})** 입니다.`
      : `**[The Essential Guide to Algebra 2 Topic 8.7 Solving Rational Equations]**\n\nMultiplying both sides by $${hTerm}$ gives $${k} = ${m}(${hTerm})$, so\n\n$$${hTerm} = \\frac{${k}}{${m}} \\implies x = ${xTarget}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${xTarget})**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // EXPONENTIAL & LOGARITHMIC EQUATIONS (The Essential Guide to Algebra 2, Topic 9)
  // -----------------------------------------------------------------------
  'exponential-logarithmic': (lang) => {
    const variant = pickRandom(['exponential-equation', 'log-equation']);

    if (variant === 'exponential-equation') {
      const a = pickRandom([2, 3, 5]);
      const E = randInt(0, 6);
      const rhs = a ** E;
      const p = randInt(1, 4);
      const xTarget = randInt(-5, 5);
      const q = E - p * xTarget;

      const { choices, correctIdx } = buildChoices(xTarget, (i) => {
        if (i === 1) return -xTarget;
        if (i === 2) return E;
        if (i === 3) return xTarget + p;
        return xTarget + randInt(2, 6) * (i % 2 === 0 ? 1 : -1);
      });

      const exponentExpr = `${p}x ${q >= 0 ? '+' : '-'} ${Math.abs(q)}`;
      const question = lang === 'ko'
        ? `방정식 $${a}^{${exponentExpr}} = ${rhs}$를 만족하는 $x$의 값을 구하세요.`
        : `Solve $${a}^{${exponentExpr}} = ${rhs}$ for $x$.`;
      const explanation = lang === 'ko'
        ? `**[The Essential Guide to Algebra 2 Topic 9.2 지수방정식]**\n\n$${rhs} = ${a}^{${E}}$이므로 밑이 같을 때 지수를 비교합니다:\n\n$$${p}x ${q >= 0 ? '+' : '-'} ${Math.abs(q)} = ${E} \\implies x = ${xTarget}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${xTarget})** 입니다.`
        : `**[The Essential Guide to Algebra 2 Topic 9.2 Exponential Equations]**\n\nSince $${rhs} = ${a}^{${E}}$, compare exponents (matching bases):\n\n$$${p}x ${q >= 0 ? '+' : '-'} ${Math.abs(q)} = ${E} \\implies x = ${xTarget}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${xTarget})**.`;

      return { question, choices, correctIdx, explanation };
    }

    // log-equation: log_a(x - h) = n, solve for x
    const a = pickRandom([2, 3, 5]);
    const n = randInt(1, 4);
    const h = randInt(-8, 8);
    const ans = a ** n + h;

    const { choices, correctIdx } = buildChoices(ans, (i) => {
      if (i === 1) return a ** n - h;
      if (i === 2) return a * n + h;
      if (i === 3) return h;
      return ans + randInt(2, 9) * (i % 2 === 0 ? 1 : -1);
    });

    const hTerm = h >= 0 ? `x - ${h}` : `x + ${Math.abs(h)}`;
    const question = lang === 'ko'
      ? `방정식 $\\log_{${a}}(${hTerm}) = ${n}$을 만족하는 $x$의 값을 구하세요.`
      : `Solve $\\log_{${a}}(${hTerm}) = ${n}$ for $x$.`;
    const explanation = lang === 'ko'
      ? `**[The Essential Guide to Algebra 2 Topic 9.4 로그방정식]**\n\n로그의 정의에 의해 $${hTerm} = ${a}^{${n}} = ${a ** n}$이므로,\n\n$$x = ${a ** n} ${h >= 0 ? '+' : '-'} ${Math.abs(h)} = ${ans}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans})** 입니다.`
      : `**[The Essential Guide to Algebra 2 Topic 9.4 Logarithmic Equations]**\n\nBy the definition of a logarithm, $${hTerm} = ${a}^{${n}} = ${a ** n}$, so\n\n$$x = ${a ** n} ${h >= 0 ? '+' : '-'} ${Math.abs(h)} = ${ans}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // GEOMETRIC SEQUENCES & SERIES (The Essential Guide to Algebra 2 & Vol 4 Ch 21)
  // -----------------------------------------------------------------------
  'geometric-series': (lang) => {
    const variant = pickRandom(['series-sum', 'nth-term', 'add-constant-geometric']);

    if (variant === 'add-constant-geometric') {
      // AMC 8 Prep Vol. 4 Ch.21: Adding constant to form geometric sequence (등비중항)
      const data = pickRandom([
        { p: 20, q: 50, s: 100, c: 25, t1: 45, t2: 75, t3: 125, ratio: '5/3' },
        { p: 10, q: 20, s: 35, c: 10, t1: 20, t2: 30, t3: 45, ratio: '3/2' },
        { p: 2, q: 14, s: 38, c: 10, t1: 12, t2: 24, t3: 48, ratio: '2' },
        { p: 3, q: 11, s: 35, c: 1, t1: 4, t2: 12, t3: 36, ratio: '3' },
        { p: 4, q: 10, s: 22, c: 2, t1: 6, t2: 12, t3: 24, ratio: '2' },
        { p: 12, q: 24, s: 42, c: 12, t1: 24, t2: 36, t3: 54, ratio: '3/2' },
      ]);
      const { p, q, s, c, t1, t2, t3 } = data;

      const { choices, correctIdx } = buildChoices(c, (i) => {
        if (i === 1) return c + 5;
        if (i === 2) return Math.max(1, c - 3);
        if (i === 3) return c + 10;
        return c + 2 * i;
      });

      const question = lang === 'ko'
        ? `세 수 $${p}$, $${q}$, $${s}$의 각 수에 동일한 양의 상수 $c$를 더했더니, 얻어진 세 수 $(${p}+c)$, $(${q}+c)$, $(${s}+c)$가 순서대로 등비수열을 이루었습니다. 더한 상수 $c$의 값은 얼마입니까?`
        : `When the same positive constant $c$ is added to each of the numbers $${p}$, $${q}$, and $${s}$, the resulting three numbers form a geometric sequence. What is the value of $c$?`;

      const explanation = lang === 'ko'
        ? `**[AMC 8 Prep Vol. 4 Ch.21 등비수열과 등비중항의 성질]**\n\n세 수 $A, B, C$가 등비수열을 이룰 때, 등비중항 성질 $B^2 = A \\times C$가 성립합니다.\n\n$$(${q} + c)^2 = (${p} + c)(${s} + c)$$\n\n양변을 전개하면:\n$$${q * q} + ${2 * q}c + c^2 = ${p * s} + (${p + s})c + c^2$$\n\n양변에서 $c^2$을 소거하고 일차방정식을 풀면:\n$$${q * q} + ${2 * q}c = ${p * s} + ${p + s}c$$\n$$${p + s - 2 * q}c = ${q * q - p * s} \\implies c = \\frac{${q * q - p * s}}{${p + s - 2 * q}} = ${c}$$\n\n(확인: $${p}+${c}=${t1}$, $${q}+${c}=${t2}$, $${s}+${c}=${t3}$ 은 공비가 일정한 등비수열입니다.)\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${c})** 입니다.`
        : `**[AMC 8 Prep Vol. 4 Ch.21 Geometric Mean Property]**\n\nIf three terms form a geometric sequence, the square of the middle term equals the product of the outer terms ($B^2 = AC$):\n\n$$(${q} + c)^2 = (${p} + c)(${s} + c)$$\n\nExpanding both sides:\n$$${q * q} + ${2 * q}c + c^2 = ${p * s} + (${p + s})c + c^2$$\n\nSubtracting $c^2$ and solving for $c$:\n$$${p + s - 2 * q}c = ${q * q - p * s} \\implies c = ${c}$$\n\n(Verification: $${t1}, ${t2}, ${t3}$ form a geometric sequence).\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${c})**.`;

      return { question, choices, correctIdx, explanation };
    }
    const a1 = randInt(1, 5);
    const r = pickRandom([2, 3, -2, -3]);
    const n = randInt(3, 5);

    if (variant === 'series-sum') {
      const sum = Math.round(a1 * (r ** n - 1) / (r - 1));

      const { choices, correctIdx } = buildChoices(sum, (i) => {
        if (i === 1) return a1 * r ** n;
        if (i === 2) return a1 * n;
        if (i === 3) return Math.round(a1 * (r ** (n - 1) - 1) / (r - 1));
        return sum + randInt(2, 15) * (i % 2 === 0 ? 1 : -1);
      });

      const question = lang === 'ko'
        ? `첫째항이 $${a1}$이고 공비가 $${r}$인 등비수열의 첫 $${n}$항의 합을 구하세요.`
        : `Find the sum of the first $${n}$ terms of a geometric sequence with first term $${a1}$ and common ratio $${r}$.`;
      const explanation = lang === 'ko'
        ? `**[The Essential Guide to Algebra 2 Topic 10.3 등비급수]**\n\n$S_n = \\dfrac{a_1(r^n-1)}{r-1} = \\dfrac{${a1}((${r})^{${n}}-1)}{${r}-1} = ${sum}$입니다.\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${sum})** 입니다.`
        : `**[The Essential Guide to Algebra 2 Topic 10.3 Geometric Series]**\n\n$S_n = \\dfrac{a_1(r^n-1)}{r-1} = \\dfrac{${a1}((${r})^{${n}}-1)}{${r}-1} = ${sum}$.\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${sum})**.`;

      return { question, choices, correctIdx, explanation };
    }

    // nth-term
    const term = a1 * r ** (n - 1);

    const { choices, correctIdx } = buildChoices(term, (i) => {
      if (i === 1) return a1 * r ** n;
      if (i === 2) return a1 * r ** (n - 2);
      if (i === 3) return a1 * n * r;
      return term + randInt(2, 12) * (i % 2 === 0 ? 1 : -1);
    });

    const question = lang === 'ko'
      ? `첫째항이 $${a1}$이고 공비가 $${r}$인 등비수열의 제 $${n}$항을 구하세요.`
      : `Find the $${n}$th term of a geometric sequence with first term $${a1}$ and common ratio $${r}$.`;
    const explanation = lang === 'ko'
      ? `**[The Essential Guide to Algebra 2 Topic 10.3 등비수열]**\n\n$a_n = a_1 \\cdot r^{n-1} = ${a1}\\times(${r})^{${n - 1}} = ${term}$입니다.\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${term})** 입니다.`
      : `**[The Essential Guide to Algebra 2 Topic 10.3 Geometric Sequences]**\n\n$a_n = a_1 \\cdot r^{n-1} = ${a1}\\times(${r})^{${n - 1}} = ${term}$.\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${term})**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // BINOMIAL THEOREM (The Essential Guide to Algebra 2, Topic 11.7)
  // -----------------------------------------------------------------------
  'binomial-theorem': (lang) => {
    const n = randInt(4, 7);
    const c = pickRandom([1, 2, 3, -1, -2]);
    const k = randInt(1, n - 1);
    const coeff = comb(n, k) * c ** (n - k);

    const { choices, correctIdx } = buildChoices(coeff, (i) => {
      if (i === 1) return comb(n, k) * c ** k;
      if (i === 2) return comb(n, n - k) * c ** k;
      if (i === 3) return comb(n, k);
      return coeff + randInt(2, 15) * (i % 2 === 0 ? 1 : -1);
    });

    const cTerm = c >= 0 ? `x + ${c}` : `x - ${Math.abs(c)}`;
    const question = lang === 'ko'
      ? `$(${cTerm})^{${n}}$의 전개식에서 $x^{${k}}$의 계수를 구하세요.`
      : `Find the coefficient of $x^{${k}}$ in the expansion of $(${cTerm})^{${n}}$.`;
    const explanation = lang === 'ko'
      ? `**[The Essential Guide to Algebra 2 Topic 11.7 이항정리]**\n\n이항정리에 의해 일반항은 $\\binom{${n}}{${n - k}}x^{${k}}${c}^{${n - k}}$이므로, 계수는\n\n$$\\binom{${n}}{${n - k}}\\times${c}^{${n - k}} = ${comb(n, k)}\\times${c ** (n - k)} = ${coeff}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${coeff})** 입니다.`
      : `**[The Essential Guide to Algebra 2 Topic 11.7 Binomial Theorem]**\n\nBy the Binomial Theorem, the general term is $\\binom{${n}}{${n - k}}x^{${k}}${c}^{${n - k}}$, so the coefficient is\n\n$$\\binom{${n}}{${n - k}}\\times${c}^{${n - k}} = ${comb(n, k)}\\times${c ** (n - k)} = ${coeff}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${coeff})**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // PROBABILITY DISTRIBUTIONS (The Essential Guide to Algebra 2, Topic 13)
  // -----------------------------------------------------------------------
  'probability-distributions': (lang) => {
    const variant = pickRandom(['binomial-probability', 'expected-value', 'conditional-probability']);

    if (variant === 'conditional-probability') {
      const r = pickRandom([3, 4, 5]);
      const b = pickRandom([2, 3, 4]);
      const total = r + b;
      const totalPairs = (total * (total - 1)) / 2;
      const bluePairs = (b * (b - 1)) / 2;
      const atLeastOneRed = totalPairs - bluePairs;
      const bothRed = (r * (r - 1)) / 2;
      const g = gcd(bothRed, atLeastOneRed);
      const numSimp = bothRed / g;
      const denSimp = atLeastOneRed / g;
      const ans = `${numSimp}/${denSimp}`;

      const { choices, correctIdx } = buildChoices(ans, (i) => {
        if (i === 1) return `${bothRed}/${totalPairs}`;
        if (i === 2) return `${atLeastOneRed}/${totalPairs}`;
        if (i === 3) return `${numSimp}/${denSimp + 1}`;
        const altNum = Math.max(1, numSimp + (i % 2 === 0 ? 1 : -1));
        const altDen = denSimp + (altNum >= denSimp ? 2 : 0);
        return `${altNum}/${altDen}`;
      });

      const question = lang === 'ko'
        ? `주머니 속에 빨간 구슬 $${r}$개와 파란 구슬 $${b}$개가 들어 있습니다. 이 주머니에서 구슬 $2$개를 동시에 꺼낼 때, 꺼낸 구슬 중 적어도 하나가 빨간 구슬인 것으로 알려졌습니다. 이때 두 구슬이 모두 빨간 구슬일 확률을 구하세요.`
        : `A bag contains $${r}$ red marbles and $${b}$ blue marbles. Two marbles are drawn simultaneously at random. Given that at least one of the drawn marbles is red, what is the probability that both marbles are red?`;

      const explanation = lang === 'ko'
        ? `**[The Essential Guide to Algebra 2 Topic 13.1 조건부 확률 (Conditional Probability)]**\n\n전체 $${total}$개 중 $2$개를 꺼내는 경우의 수는 $\\binom{${total}}{2} = ${totalPairs}$가지입니다.\n- 파란 구슬만 $2$개 나오는 경우의 수: $\\binom{${b}}{2} = ${bluePairs}$가지\n- 적어도 $1$개가 빨간 구슬인 경우의 수 ($P(B)$): $${totalPairs} - ${bluePairs} = ${atLeastOneRed}$가지\n- 두 구슬 모두 빨간 구슬인 경우의 수 ($P(A \\cap B)$): $\\binom{${r}}{2} = ${bothRed}$가지\n\n조건부 확률의 정의 $P(A|B) = \\dfrac{P(A \\cap B)}{P(B)}$ 에 의해:\n\n$$P = \\frac{${bothRed}}{${atLeastOneRed}} = ${ans}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans})** 입니다.`
        : `**[The Essential Guide to Algebra 2 Topic 13.1 Conditional Probability]**\n\nThe total number of ways to draw $2$ marbles from $${total}$ is $\\binom{${total}}{2} = ${totalPairs}$.\n- Ways to draw only blue marbles: $\\binom{${b}}{2} = ${bluePairs}$\n- Ways to draw at least one red marble ($P(B)$): $${totalPairs} - ${bluePairs} = ${atLeastOneRed}$\n- Ways to draw both red marbles ($P(A \\cap B)$): $\\binom{${r}}{2} = ${bothRed}$\n\nBy the conditional probability formula $P(A|B) = \\dfrac{P(A \\cap B)}{P(B)}$:\n\n$$P = \\frac{${bothRed}}{${atLeastOneRed}} = ${ans}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'binomial-probability') {
      const n = randInt(4, 6);
      const k = randInt(0, n);
      const numerator = comb(n, k);
      const denominator = 2 ** n;
      const g = gcd(numerator, denominator);
      const ans = `${numerator / g}/${denominator / g}`;

      const { choices, correctIdx } = buildChoices(ans, (i) => {
        if (i === 1) return `${comb(n, Math.max(0, k - 1))}/${denominator}`;
        if (i === 2) return `${numerator}/${denominator}`;
        if (i === 3) return `1/${denominator / g}`;
        return `${numerator / g}/${denominator / g + i}`;
      });

      const question = lang === 'ko'
        ? `공정한 동전을 $${n}$번 던질 때, 정확히 $${k}$번 앞면이 나올 확률을 구하세요.`
        : `A fair coin is flipped $${n}$ times. What is the probability of getting exactly $${k}$ heads?`;
      const explanation = lang === 'ko'
        ? `**[The Essential Guide to Algebra 2 Topic 13.2 이항분포]**\n\n$P(X=${k}) = \\binom{${n}}{${k}}\\left(\\dfrac{1}{2}\\right)^{${n}} = \\dfrac{${numerator}}{${denominator}} = ${ans}$입니다.\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans})** 입니다.`
        : `**[The Essential Guide to Algebra 2 Topic 13.2 Binomial Distribution]**\n\n$P(X=${k}) = \\binom{${n}}{${k}}\\left(\\dfrac{1}{2}\\right)^{${n}} = \\dfrac{${numerator}}{${denominator}} = ${ans}$.\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

      return { question, choices, correctIdx, explanation };
    }

    // expected-value: E[X] = np for X ~ Binomial(n, p_num/p_den)
    const pDen = pickRandom([2, 3, 4, 5]);
    let n = randInt(2, 6) * pDen;
    if (n > 40) n = pDen * 4;
    const pNum = randInt(1, pDen - 1);
    const ans = (n * pNum) / pDen;

    const { choices, correctIdx } = buildChoices(ans, (i) => {
      if (i === 1) return n;
      if (i === 2) return pNum;
      if (i === 3) return ans + pDen;
      return ans + randInt(2, 8) * (i % 2 === 0 ? 1 : -1);
    });

    const question = lang === 'ko'
      ? `확률변수 $X$가 이항분포 $B\\left(${n}, \\dfrac{${pNum}}{${pDen}}\\right)$를 따를 때, $X$의 기댓값 $E(X)$를 구하세요.`
      : `A random variable $X$ follows the binomial distribution $B\\left(${n}, \\dfrac{${pNum}}{${pDen}}\\right)$. Find the expected value $E(X)$.`;
    const explanation = lang === 'ko'
      ? `**[The Essential Guide to Algebra 2 Topic 13.2 이항분포의 기댓값]**\n\n이항분포 $B(n,p)$의 기댓값은 $E(X)=np$이므로,\n\n$$E(X) = ${n}\\times\\dfrac{${pNum}}{${pDen}} = ${ans}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans})** 입니다.`
      : `**[The Essential Guide to Algebra 2 Topic 13.2 Expected Value of Binomial Distribution]**\n\nFor a binomial distribution $B(n,p)$, $E(X)=np$, so\n\n$$E(X) = ${n}\\times\\dfrac{${pNum}}{${pDen}} = ${ans}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // GCD & LCM (The Essential Guide to Competition Math: Number Theory
  // Topic 2: Least Common Multiple and Greatest Common Divisor)
  // -----------------------------------------------------------------------
  'gcd-lcm': (lang) => {
    const variant = pickRandom(['lcm-fractions', 'meshing-gears', 'product-relation', 'euclidean-steps', 'lcm-word-problem', 'gcd-word-problem']);
    const coprimePairs = [[2, 3], [3, 4], [2, 5], [3, 5], [4, 5], [2, 7], [3, 7], [4, 7], [5, 6]];

    if (variant === 'lcm-fractions') {
      // AMC 8 Prep Vol. 3 Ch.17 Rule 4: LCM of fractions [a/b, c/d] = lcm(a, c) / gcd(b, d)
      const fracPairs = [
        { a: 9, b: 5, c: 4, d: 3, numLcm: 36, denGcd: 1, ans: 36 },
        { a: 6, b: 5, c: 8, d: 15, numLcm: 24, denGcd: 5, ans: '24/5' },
        { a: 3, b: 4, c: 5, d: 6, numLcm: 15, denGcd: 2, ans: '15/2' },
        { a: 7, b: 2, c: 5, d: 4, numLcm: 35, denGcd: 2, ans: '35/2' },
        { a: 4, b: 3, c: 6, d: 5, numLcm: 12, denGcd: 1, ans: 12 },
      ];
      const item = pickRandom(fracPairs);
      const { a, b, c, d, numLcm, denGcd } = item;
      const ansLatex = denGcd === 1 ? `${numLcm}` : `\\frac{${numLcm}}{${denGcd}}`;

      const { choices, correctIdx } = buildChoices(ansLatex, (i) => {
        if (i === 1) return denGcd === 1 ? `${numLcm * 2}` : `\\frac{${numLcm * 2}}{${denGcd}}`;
        if (i === 2) return denGcd === 1 ? `${numLcm - 6}` : `\\frac{${numLcm}}{${denGcd + 1}}`;
        if (i === 3) return `\\frac{${a * c}}{${b * d}}`;
        return denGcd === 1 ? `${numLcm + randInt(4, 12)}` : `\\frac{${numLcm + randInt(2, 6)}}{${denGcd}}`;
      });

      const question = lang === 'ko'
        ? `민수와 지우가 원형 트랙의 같은 출발선에서 동시에 같은 방향으로 달리기 시작했습니다. 민수는 한 바퀴를 도는 데 $\\frac{${a}}{${b}}$분이 걸리고, 지우는 한 바퀴를 도는 데 $\\frac{${c}}{${d}}$분이 걸립니다. 두 사람이 출발 후 처음으로 다시 출발선에서 만나는 시간은 몇 분 후입니까?`
        : `Alice and Bob start running in the same direction from the same starting point on a circular track. Alice completes a lap in $\\frac{${a}}{${b}}$ minutes, while Bob completes a lap in $\\frac{${c}}{${d}}$ minutes. How many minutes will elapse before they first meet again at the starting point?`;

      const explanation = lang === 'ko'
        ? `**[AMC 8 Prep Vol. 3 Ch.17 분수의 최소공배수(LCM of Fractions) 공식]**\n\n두 사람이 출발점에서 다시 만나는 시간은 두 랩 타임의 최소공배수입니다. 기약분수의 최소공배수 공식:\n\n$$\\text{lcm}\\left(\\frac{a}{b}, \\frac{c}{d}\\right) = \\frac{\\text{lcm}(a, c)}{\\gcd(b, d)}$$\n\n주어진 분수 $\\frac{${a}}{${b}}$와 $\\frac{${c}}{${d}}$에 적용하면:\n- 분자의 최소공배수: $\\text{lcm}(${a}, ${c}) = ${numLcm}$\n- 분모의 최대공약수: $\\gcd(${b}, ${d}) = ${denGcd}$\n\n따라서 처음으로 다시 만나는 시간은:\n\n$$\\text{lcm}\\left(\\frac{${a}}{${b}}, \\frac{${c}}{${d}}\\right) = \\frac{${numLcm}}{${denGcd}} = ${ansLatex}\\text{분}$$\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} ($${ansLatex}\\text{분}$)** 입니다.`
        : `**[AMC 8 Prep Vol. 3 Ch.17 LCM of Fractions Formula]**\n\nThe elapsed time until they meet again at the start is the LCM of their fractional lap times:\n\n$$\\text{lcm}\\left(\\frac{a}{b}, \\frac{c}{d}\\right) = \\frac{\\text{lcm}(a, c)}{\\gcd(b, d)}$$\n\nWith $\\frac{${a}}{${b}}$ and $\\frac{${c}}{${d}}$:\n- $\\text{lcm}(${a}, ${c}) = ${numLcm}$\n- $\\gcd(${b}, ${d}) = ${denGcd}$\n\nTherefore, they meet after:\n\n$$\\frac{\\text{lcm}(${a}, ${c})}{\\gcd(${b}, ${d})} = ${ansLatex}\\text{ minutes}$$\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${ansLatex})**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'meshing-gears') {
      // AMC 8 Prep Vol. 3 Ch.17 Problem 21: Meshing gears
      const n1 = pickRandom([12, 15, 18, 20]);
      const n2 = pickRandom([24, 28, 30, 32]);
      const L = lcm(n1, n2);
      const revsSmaller = L / Math.min(n1, n2);

      const { choices, correctIdx } = buildChoices(revsSmaller, (i) => {
        if (i === 1) return L / Math.max(n1, n2);
        if (i === 2) return revsSmaller + 1;
        if (i === 3) return Math.max(1, revsSmaller - 1);
        return revsSmaller + i + 1;
      });

      const question = lang === 'ko'
        ? `톱니 수가 각각 $${n1}$개, $${n2}$개인 두 톱니바퀴 A, B가 서로 맞물려 돌아가고 있습니다. 처음에 맞물려 있던 특정한 두 톱니가 다시 처음 위치에서 맞물릴 때까지, 작은 톱니바퀴는 최소 몇 바퀴 회전해야 합니까?`
        : `Two meshing gears A and B have $${n1}$ and $${n2}$ teeth, respectively. When the gears rotate, what is the minimum number of complete revolutions the smaller gear must make before the original pair of meshing teeth touch each other again?`;

      const explanation = lang === 'ko'
        ? `**[AMC 8 Prep Vol. 3 Ch.17 톱니바퀴 맞물림과 최소공배수]**\n\n처음 맞물렸던 톱니가 다시 만나려면 맞물려 지나간 총 톱니 수가 두 톱니 수의 최소공배수가 되어야 합니다:\n\n$$\\text{lcm}(${n1}, ${n2}) = ${L}\\text{개}$$\n\n작은 톱니바퀴(톱니 $${Math.min(n1, n2)}$개)의 회전수는:\n\n$$\\frac{\\text{lcm}(${n1}, ${n2})}{${Math.min(n1, n2)}} = \\frac{${L}}{${Math.min(n1, n2)}} = ${revsSmaller}\\text{바퀴}$$\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} (${revsSmaller}\\text{바퀴})** 입니다.`
        : `**[AMC 8 Prep Vol. 3 Ch.17 Meshing Gears & LCM]**\n\nThe marked teeth meet again when the total number of passing teeth equals $\\text{lcm}(${n1}, ${n2}) = ${L}$.\n\nThe number of revolutions of the smaller gear (${Math.min(n1, n2)} teeth) is:\n\n$$\\frac{${L}}{${Math.min(n1, n2)}} = ${revsSmaller}\\text{ revolutions}$$\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${revsSmaller})**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'product-relation') {
      const g = pickRandom([2, 3, 4, 5, 6]);
      const [m, n] = pickRandom(coprimePairs);
      const a = g * m;
      const b = g * n;
      const ans = g * m * n;

      const { choices, correctIdx } = buildChoices(ans, (i) => {
        if (i === 1) return a * b;
        if (i === 2) return g;
        if (i === 3) return ans + g;
        return Math.max(1, ans - g * (i - 3));
      });

      const question = lang === 'ko'
        ? `두 자연수 $${a}$와 $${b}$의 최대공약수가 $${g}$일 때, 두 수의 최소공배수를 구하세요.`
        : `Two positive integers $${a}$ and $${b}$ have greatest common divisor $${g}$. Find their least common multiple.`;

      const explanation = lang === 'ko'
        ? `**[The Essential Guide to Competition Math: Number Theory Topic 2.1 최대공약수와 최소공배수의 관계]**\n\n두 자연수 $a, b$에 대해 항상 $\\gcd(a,b)\\times\\text{lcm}(a,b) = a\\times b$가 성립합니다.\n\n$$\\text{lcm}(${a}, ${b}) = \\frac{${a}\\times ${b}}{${g}} = \\frac{${a * b}}{${g}} = ${ans}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans})** 입니다.`
        : `**[The Essential Guide to Competition Math: Number Theory Topic 2.1 GCD-LCM Product Relation]**\n\nFor any two positive integers $a, b$: $\\gcd(a,b)\\times\\text{lcm}(a,b) = a\\times b$.\n\n$$\\text{lcm}(${a}, ${b}) = \\frac{${a}\\times ${b}}{${g}} = \\frac{${a * b}}{${g}} = ${ans}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'euclidean-steps') {
      const g = pickRandom([2, 3, 4, 5, 6, 7]);
      const [m, n] = pickRandom(coprimePairs);
      const a = g * n;
      const b = g * m;

      const steps = [];
      let x = a;
      let y = b;
      while (y !== 0) {
        const q = Math.floor(x / y);
        const r = x % y;
        steps.push({ x, y, q, r });
        x = y;
        y = r;
      }
      const ans = x;

      const { choices, correctIdx } = buildChoices(ans, (i) => {
        if (i === 1) return b;
        if (i === 2) return ans * 2;
        if (i === 3) return ans + 1;
        return Math.max(1, ans - i + 3);
      });

      const stepsText = steps.map((s) => `$${s.x} = ${s.y}\\times ${s.q} + ${s.r}$`).join('\n\n');

      const question = lang === 'ko'
        ? `유클리드 호제법을 이용하여 두 자연수 $${a}$와 $${b}$의 최대공약수를 구하세요.`
        : `Use the Euclidean algorithm to find the greatest common divisor of $${a}$ and $${b}$.`;

      const explanation = lang === 'ko'
        ? `**[The Essential Guide to Competition Math: Number Theory Topic 2.2 유클리드 호제법]**\n\n나머지가 $0$이 될 때까지 나눗셈을 반복합니다:\n\n${stepsText}\n\n나머지가 $0$이 되기 직전의 나눗수가 최대공약수이므로, $\\gcd(${a}, ${b}) = ${ans}$ 입니다.\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans})** 입니다.`
        : `**[The Essential Guide to Competition Math: Number Theory Topic 2.2 Euclidean Algorithm]**\n\nRepeatedly divide until the remainder is $0$:\n\n${stepsText}\n\nThe last nonzero remainder (the final divisor) is the GCD: $\\gcd(${a}, ${b}) = ${ans}$.\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'lcm-word-problem') {
      const m = randInt(4, 12);
      let n = randInt(4, 12);
      while (n === m) n = randInt(4, 12);
      const g = gcd(m, n);
      const ans = lcm(m, n);

      const { choices, correctIdx } = buildChoices(ans, (i) => {
        if (i === 1) return m * n;
        if (i === 2) return Math.max(m, n);
        if (i === 3) return ans + g;
        return Math.max(1, ans - g * (i - 3));
      });

      const question = lang === 'ko'
        ? `두 신호등이 $t=0$에 동시에 깜빡였습니다. 첫 번째 신호등은 $${m}$초마다, 두 번째 신호등은 $${n}$초마다 깜빡입니다. 두 신호등이 다시 동시에 깜빡이는 것은 몇 초 후입니까?`
        : `Two traffic lights blink together at $t=0$. The first blinks every $${m}$ seconds and the second every $${n}$ seconds. After how many seconds will they blink together again?`;

      const explanation = lang === 'ko'
        ? `**[The Essential Guide to Competition Math: Number Theory Topic 2.3 최소공배수의 활용]**\n\n두 사건이 다시 동시에 일어나려면 경과 시간이 두 주기의 공배수여야 하므로, 답은 $${m}$과 $${n}$의 최소공배수입니다.\n\n$$\\gcd(${m},${n}) = ${g}, \\quad \\text{lcm}(${m},${n}) = \\frac{${m}\\times ${n}}{${g}} = ${ans}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans}초)** 입니다.`
        : `**[The Essential Guide to Competition Math: Number Theory Topic 2.3 LCM Applications]**\n\nBoth events recur together only after a time that is a common multiple of both periods, so the answer is $\\text{lcm}(${m},${n})$.\n\n$$\\gcd(${m},${n}) = ${g}, \\quad \\text{lcm}(${m},${n}) = \\frac{${m}\\times ${n}}{${g}} = ${ans}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans} seconds)**.`;

      return { question, choices, correctIdx, explanation };
    }

    // gcd-word-problem
    const amounts = [18, 24, 30, 36, 42, 48, 54];
    const p = pickRandom(amounts);
    let q = pickRandom(amounts);
    while (q === p) q = pickRandom(amounts);
    const ans = gcd(p, q);

    const { choices, correctIdx } = buildChoices(ans, (i) => {
      if (i === 1) return Math.min(p, q);
      if (i === 2) return ans * 2;
      if (i === 3) return ans + 3;
      return Math.max(1, ans - i + 3);
    });

    const question = lang === 'ko'
      ? `튤립 구근 $${p}$개와 수선화 구근 $${q}$개를 각각 남김없이 똑같은 개수씩 나누어 최대한 많은 선물 바구니를 만들려고 합니다. 만들 수 있는 선물 바구니는 최대 몇 개입니까?`
      : `A florist has $${p}$ tulip bulbs and $${q}$ daffodil bulbs and wants to make identical gift bags, splitting each type evenly with none left over. What is the greatest number of gift bags that can be made?`;

    const explanation = lang === 'ko'
      ? `**[The Essential Guide to Competition Math: Number Theory Topic 2.4 최대공약수의 활용]**\n\n두 종류의 구근을 남김없이 똑같이 나누는 최대 바구니 수는 두 수의 최대공약수입니다.\n\n$$\\gcd(${p}, ${q}) = ${ans}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans}개)** 입니다.`
      : `**[The Essential Guide to Competition Math: Number Theory Topic 2.4 GCD Applications]**\n\nThe greatest number of identical bags that split both quantities evenly is the GCD of the two quantities.\n\n$$\\gcd(${p}, ${q}) = ${ans}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // DIVISORS & MULTIPLES (The Essential Guide to Competition Math: Number
  // Theory Topic 3: Counting Divisors and More Arithmetic)
  // -----------------------------------------------------------------------
  'divisors-multiples': (lang) => {
    const variant = pickRandom(['smallest-int-with-k-divisors', 'divisors-not-multiples', 'divisor-count', 'divisor-sum', 'perfect-square-divisors']);

    if (variant === 'smallest-int-with-k-divisors') {
      // AMC 8 Prep Vol. 3 Ch.14 Skills: Smallest integer with k factors
      const cases = [
        { k: 6, ans: 12, expKo: '6 = (2+1)(1+1) \\implies 2^2 \\times 3^1 = 12', expEn: '6 = (2+1)(1+1) \\implies 2^2 \\times 3^1 = 12' },
        { k: 8, ans: 24, expKo: '8 = (3+1)(1+1) \\implies 2^3 \\times 3^1 = 24', expEn: '8 = (3+1)(1+1) \\implies 2^3 \\times 3^1 = 24' },
        { k: 10, ans: 48, expKo: '10 = (4+1)(1+1) \\implies 2^4 \\times 3^1 = 48', expEn: '10 = (4+1)(1+1) \\implies 2^4 \\times 3^1 = 48' },
        { k: 12, ans: 60, expKo: '12 = (2+1)(1+1)(1+1) \\implies 2^2 \\times 3^1 \\times 5^1 = 60', expEn: '12 = (2+1)(1+1)(1+1) \\implies 2^2 \\times 3^1 \\times 5^1 = 60' },
      ];
      const item = pickRandom(cases);
      const { k, ans, expKo, expEn } = item;

      const { choices, correctIdx } = buildChoices(ans, (i) => {
        if (i === 1) return ans + 6;
        if (i === 2) return Math.max(6, ans - 6);
        if (i === 3) return ans * 2;
        return ans + randInt(8, 20) * (i % 2 === 0 ? 1 : -1);
      });

      const question = lang === 'ko'
        ? `양의 약수의 개수가 정확히 $${k}$개인 가장 작은 자연수는 얼마입니까?`
        : `What is the smallest positive integer that has exactly $${k}$ positive divisors?`;

      const explanation = lang === 'ko'
        ? `**[AMC 8 Prep Vol. 3 Ch.14 약수의 개수와 최소 자연수 구하기]**\n\n자연수 $N$의 소인수분해가 $p_1^{a_1} p_2^{a_2} \\dots$ 일 때, 약수의 개수는 $(a_1 + 1)(a_2 + 1)\\dots$ 입니다.\n\n약수의 개수가 $${k}$개가 되도록 지수를 분해하고, 가장 작은 소수($2, 3, 5, \\dots$)에 큰 지수를 배정하면:\n\n$$${expKo}$$\n\n따라서 조건을 만족하는 가장 작은 자연수는 **$${ans}$** 입니다.\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} (${ans})** 입니다.`
        : `**[AMC 8 Prep Vol. 3 Ch.14 Smallest Integer with k Divisors]**\n\nThe number of divisors of $N = p_1^{a_1} p_2^{a_2}\\dots$ is $(a_1+1)(a_2+1)\\dots = ${k}$.\n\nAssign the largest exponents to the smallest primes ($2, 3, 5, \\dots$):\n\n$$${expEn}$$\n\nThe smallest positive integer is **${ans}**.\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${ans})**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'divisors-not-multiples') {
      // AMC 8 Prep Vol. 3 Ch.14 Problem 3: Probability that a factor of N is not a multiple of p
      const configs = [
        { N: 120, p: 5, factorsN: 16, nonMult: 8, pNum: 1, pDen: 2, pStr: '\\frac{1}{2}' },
        { N: 180, p: 5, factorsN: 18, nonMult: 12, pNum: 2, pDen: 3, pStr: '\\frac{2}{3}' },
        { N: 240, p: 5, factorsN: 20, nonMult: 10, pNum: 1, pDen: 2, pStr: '\\frac{1}{2}' },
        { N: 360, p: 5, factorsN: 24, nonMult: 12, pNum: 1, pDen: 2, pStr: '\\frac{1}{2}' },
        { N: 72, p: 3, factorsN: 12, nonMult: 4, pNum: 1, pDen: 3, pStr: '\\frac{1}{3}' },
      ];
      const item = pickRandom(configs);
      const { N, p, factorsN, nonMult, pStr } = item;

      const { choices, correctIdx } = buildChoices(pStr, (i) => {
        if (i === 1) return '\\frac{1}{4}';
        if (i === 2) return '\\frac{3}{4}';
        if (i === 3) return '\\frac{1}{5}';
        return `\\frac{1}{${i + 3}}`;
      });

      const question = lang === 'ko'
        ? `자연수 $${N}$의 모든 양의 약수 중 하나를 무작위로 고를 때, 그 약수가 $${p}$의 배수가 아닐 확률은 얼마입니까?`
        : `If one of the positive factors of $${N}$ is chosen at random, what is the probability that the chosen factor is NOT a multiple of $${p}$?`;

      const explanation = lang === 'ko'
        ? `**[AMC 8 Prep Vol. 3 Ch.14 특정 소인수의 배수가 아닌 약수의 개수와 확률]**\n\n1. 전체 $${N}$의 양의 약수의 개수는 $${factorsN}$개입니다.\n2. $${p}$의 배수가 아닌 약수는 소인수분해에서 소인수 $${p}$를 포함하지 않는($${p}^0$) 약수이므로 총 $${nonMult}$개입니다.\n\n따라서 구하는 확률은:\n\n$$P = \\frac{${nonMult}}{${factorsN}} = ${pStr}$$\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} ($${pStr}$)** 입니다.`
        : `**[AMC 8 Prep Vol. 3 Ch.14 Factors Not Multiples of a Prime]**\n\n1. Total positive factors of $${N}$: $${factorsN}$.\n2. Factors that are not multiples of $${p}$ (exponent of $${p}$ is 0): $${nonMult}$.\n\nThe probability is:\n\n$$P = \\frac{${nonMult}}{${factorsN}} = ${pStr}$$\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${pStr})**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'divisor-count') {
      const primePairs = [[2, 3], [2, 5], [2, 7], [3, 5], [3, 7], [2, 11], [3, 11], [5, 7]];
      const [p, q] = pickRandom(primePairs);
      const a = randInt(1, 4);
      const b = randInt(1, 3);
      const ans = (a + 1) * (b + 1);

      const { choices, correctIdx } = buildChoices(ans, (i) => {
        if (i === 1) return a * b;
        if (i === 2) return a + b;
        if (i === 3) return ans + 1;
        return Math.max(1, ans - i + 3);
      });

      const question = lang === 'ko'
        ? `자연수 $N = ${p}^{${a}} \\times ${q}^{${b}}$ 의 양의 약수의 개수를 구하세요.`
        : `How many positive divisors does $N = ${p}^{${a}} \\times ${q}^{${b}}$ have?`;

      const explanation = lang === 'ko'
        ? `**[The Essential Guide to Competition Math: Number Theory Topic 3.1 약수의 개수 공식]**\n\n$N = p^a \\times q^b$ 꼴로 소인수분해되면, 양의 약수의 개수는 $(a+1)(b+1)$입니다.\n\n$$(${a}+1)(${b}+1) = ${a + 1}\\times ${b + 1} = ${ans}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans}개)** 입니다.`
        : `**[The Essential Guide to Competition Math: Number Theory Topic 3.1 Divisor Counting Formula]**\n\nIf $N = p^a \\times q^b$ in prime factorization, the number of positive divisors is $(a+1)(b+1)$.\n\n$$(${a}+1)(${b}+1) = ${a + 1}\\times ${b + 1} = ${ans}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'divisor-sum') {
      const p = pickRandom([2, 3, 5]);
      const a = randInt(2, 4);
      let ans = 0;
      for (let k = 0; k <= a; k += 1) ans += p ** k;

      const { choices, correctIdx } = buildChoices(ans, (i) => {
        if (i === 1) return p ** a;
        if (i === 2) return ans + p;
        if (i === 3) return Math.max(1, ans - p);
        return ans + (i - 3) * 2;
      });

      const sumTerms = Array.from({ length: a + 1 }, (_, k) => `${p}^{${k}}`).join(' + ');

      const question = lang === 'ko'
        ? `$N = ${p}^{${a}}$ 의 모든 양의 약수의 합을 구하세요.`
        : `Find the sum of all positive divisors of $N = ${p}^{${a}}$.`;

      const explanation = lang === 'ko'
        ? `**[The Essential Guide to Competition Math: Number Theory Topic 3.1 약수의 합 공식]**\n\n$N = ${p}^{${a}}$ 의 양의 약수는 $${p}^0, ${p}^1, \\dots, ${p}^{${a}}$ 이므로, 약수의 합은\n\n$$${sumTerms} = ${ans}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans})** 입니다.`
        : `**[The Essential Guide to Competition Math: Number Theory Topic 3.1 Sum of Divisors Formula]**\n\nThe positive divisors of $N = ${p}^{${a}}$ are $${p}^0, ${p}^1, \\dots, ${p}^{${a}}$, so their sum is\n\n$$${sumTerms} = ${ans}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

      return { question, choices, correctIdx, explanation };
    }

    // perfect-square-divisors: odd divisor count <=> perfect square
    const base = randInt(4, 15);
    const square = base * base;

    const { choices, correctIdx } = buildChoices(square, (i) => {
      const offsets = [1, -1, 2, -2, 3, -3, 4, 5];
      return Math.max(2, square + offsets[(i - 1) % offsets.length]);
    });

    const question = lang === 'ko'
      ? `다음 정수 중에서 양의 약수의 개수가 홀수인 것은 무엇입니까?`
      : `Which of the following integers has an odd number of positive divisors?`;

    const explanation = lang === 'ko'
      ? `**[The Essential Guide to Competition Math: Number Theory Topic 3.1 약수 개수의 홀짝성]**\n\n어떤 자연수의 양의 약수는 보통 $d$와 $N/d$의 쌍으로 짝지어지는데, 완전제곱수는 $\\sqrt{N}$이 자기 자신과 짝지어져 하나 남기 때문에 약수의 개수가 홀수인 것은 완전제곱수일 때뿐입니다.\n\n$${square} = ${base}^2$ 은 완전제곱수이므로 약수의 개수가 홀수입니다.\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${square})** 입니다.`
      : `**[The Essential Guide to Competition Math: Number Theory Topic 3.1 Parity of Divisor Count]**\n\nDivisors normally pair up as $d$ and $N/d$, except a perfect square's $\\sqrt{N}$ pairs with itself, leaving one unpaired divisor — so a positive integer has an odd number of divisors if and only if it is a perfect square.\n\n$${square} = ${base}^2$ is a perfect square, so it has an odd number of divisors.\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${square})**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // MODULAR ARITHMETIC (The Essential Guide to Competition Math: Number
  // Theory Topic 5: Modular Arithmetic — Fermat's Little Theorem)
  // -----------------------------------------------------------------------
  'modular-arithmetic': (lang) => {
    const variant = pickRandom(['fermat-little-theorem', 'modular-product-remainder', 'linear-congruence', 'chinese-remainder-theorem']);

    const modPow = (base, exp, mod) => {
      let result = 1 % mod;
      let b = ((base % mod) + mod) % mod;
      for (let e = 0; e < exp; e += 1) result = (result * b) % mod;
      return result;
    };

    if (variant === 'chinese-remainder-theorem') {
      const pairs = [
        [5, 7], [5, 9], [7, 11], [4, 9], [3, 7], [4, 7]
      ];
      const [m1, m2] = pickRandom(pairs);
      const r1 = randInt(1, m1 - 1);
      const r2 = randInt(1, m2 - 1);
      const M = m1 * m2;
      let x0 = 0;
      for (let x = 1; x <= M; x += 1) {
        if (x % m1 === r1 && x % m2 === r2) {
          x0 = x;
          break;
        }
      }
      let ans = x0;
      while (ans < 100) ans += M;

      const { choices, correctIdx } = buildChoices(ans, (i) => {
        if (i === 1) return ans - M >= 100 ? ans - M : ans + M;
        if (i === 2) return ans + M;
        if (i === 3) return ans + 2;
        return ans + i * 5;
      });

      const question = lang === 'ko'
        ? `연립합동식 $\\begin{cases} n \\equiv ${r1} \\pmod{${m1}} \\\\ n \\equiv ${r2} \\pmod{${m2}} \\end{cases}$ 을 만족하는 가장 작은 세 자리 자연수 $n$을 구하세요.`
        : `Find the smallest three-digit positive integer $n$ satisfying the system $\\begin{cases} n \\equiv ${r1} \\pmod{${m1}} \\\\ n \\equiv ${r2} \\pmod{${m2}} \\end{cases}$.`;

      const explanation = lang === 'ko'
        ? `**[The Essential Guide to Competition Math: Number Theory Topic 5.2 & Topic 6 중국인의 나머지 정리(CRT)]**\n\n첫 번째 조건에서 $n = ${m1}k + ${r1}$ 로 둘 수 있습니다.\n이를 두 번째 조건에 대입하면:\n\n$$${m1}k + ${r1} \\equiv ${r2} \\pmod{${m2}}$$\n\n이를 만족하는 가장 작은 음이 아닌 정수 $k$를 구하여 대입하면 최소 양의 정수 해는 $n \\equiv ${x0} \\pmod{${M}}$ 입니다.\n세 자리 자연수($n \\ge 100$) 중 가장 작은 값을 찾기 위해 주기 $${M}$을 더하면:\n\n$$n = ${ans}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans})** 입니다.`
        : `**[The Essential Guide to Competition Math: Number Theory Topic 5.2 & Topic 6 Chinese Remainder Theorem]**\n\nFrom the first congruence, $n = ${m1}k + ${r1}$.\nSubstituting into the second congruence:\n\n$$${m1}k + ${r1} \\equiv ${r2} \\pmod{${m2}}$$\n\nSolving gives the base solution $n \\equiv ${x0} \\pmod{${M}}$.\nAdding multiples of the period $${M}$ until reaching three digits ($n \\ge 100$) yields:\n\n$$n = ${ans}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'fermat-little-theorem') {
      const p = pickRandom([5, 7, 11, 13, 17, 19]);
      const a = randInt(2, p - 1);
      const k = randInt(3, 8);
      const r = randInt(1, p - 2);
      const N = k * (p - 1) + r;
      const ans = modPow(a, r, p);

      const { choices, correctIdx } = buildChoices(ans, (i) => {
        if (i === 1) return r;
        if (i === 2) return (ans + 1) % p;
        if (i === 3) return Math.max(0, ans - 1);
        return (ans + i) % p;
      });

      const question = lang === 'ko'
        ? `$${a}^{${N}}$ 을 소수 $${p}$로 나눈 나머지를 구하세요.`
        : `Find the remainder when $${a}^{${N}}$ is divided by the prime $${p}$.`;

      const explanation = lang === 'ko'
        ? `**[The Essential Guide to Competition Math: Number Theory Topic 5.2 페르마의 소정리]**\n\n$p=${p}$가 소수이고 $\\gcd(${a},${p})=1$이므로 페르마의 소정리에 의해 $${a}^{${p - 1}} \\equiv 1 \\pmod{${p}}$입니다.\n\n$${N} = ${p - 1}\\times ${k} + ${r}$ 이므로\n\n$$${a}^{${N}} = \\left(${a}^{${p - 1}}\\right)^{${k}} \\times ${a}^{${r}} \\equiv 1^{${k}} \\times ${a}^{${r}} \\equiv ${ans} \\pmod{${p}}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans})** 입니다.`
        : `**[The Essential Guide to Competition Math: Number Theory Topic 5.2 Fermat's Little Theorem]**\n\nSince $p=${p}$ is prime and $\\gcd(${a},${p})=1$, Fermat's Little Theorem gives $${a}^{${p - 1}} \\equiv 1 \\pmod{${p}}$.\n\nSince $${N} = ${p - 1}\\times ${k} + ${r}$,\n\n$$${a}^{${N}} = \\left(${a}^{${p - 1}}\\right)^{${k}} \\times ${a}^{${r}} \\equiv 1^{${k}} \\times ${a}^{${r}} \\equiv ${ans} \\pmod{${p}}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'modular-product-remainder') {
      const m = pickRandom([6, 7, 8, 9, 11, 12]);
      const factorCount = 3;
      const bases = Array.from({ length: factorCount }, () => randInt(20, 90));
      const remainders = bases.map((x) => x % m);
      let ans = 1;
      remainders.forEach((r) => { ans = (ans * r) % m; });

      const { choices, correctIdx } = buildChoices(ans, (i) => {
        if (i === 1) return remainders[0];
        if (i === 2) return (ans + 1) % m;
        if (i === 3) return Math.max(0, ans - 1);
        return (ans + i) % m;
      });

      const productText = bases.join(' \\times ');
      const remainderText = remainders.map((r, idx) => `${bases[idx]} \\equiv ${r}`).join(', \\;');

      const question = lang === 'ko'
        ? `$${productText}$ 을 $${m}$으로 나눈 나머지를 구하세요.`
        : `Find the remainder when $${productText}$ is divided by $${m}$.`;

      const explanation = lang === 'ko'
        ? `**[The Essential Guide to Competition Math: Number Theory Topic 5.1 모듈러 연산의 곱셈 성질]**\n\n합동식은 곱셈에 대해 닫혀 있으므로, 각 인수를 $${m}$으로 나눈 나머지로 바꾸어 곱해도 전체 나머지는 같습니다.\n\n$$${remainderText} \\pmod{${m}}$$\n\n$$${remainders.join(' \\times ')} \\equiv ${ans} \\pmod{${m}}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans})** 입니다.`
        : `**[The Essential Guide to Competition Math: Number Theory Topic 5.1 Multiplicative Property of Congruences]**\n\nCongruence is preserved under multiplication, so each factor can be replaced by its remainder mod $${m}$ before multiplying.\n\n$$${remainderText} \\pmod{${m}}$$\n\n$$${remainders.join(' \\times ')} \\equiv ${ans} \\pmod{${m}}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

      return { question, choices, correctIdx, explanation };
    }

    // linear-congruence: solve a*x ≡ b (mod m) for smallest non-negative x
    const m = pickRandom([5, 7, 9, 11, 13]);
    const aChoices = Array.from({ length: m - 1 }, (_, idx) => idx + 1).filter((v) => gcd(v, m) === 1);
    const a = pickRandom(aChoices);
    const x0 = randInt(0, m - 1);
    const b = (a * x0) % m;

    const { choices, correctIdx } = buildChoices(x0, (i) => {
      if (i === 1) return b;
      if (i === 2) return (x0 + 1) % m;
      if (i === 3) return Math.max(0, x0 - 1);
      return (x0 + i) % m;
    });

    const question = lang === 'ko'
      ? `합동식 $${a}x \\equiv ${b} \\pmod{${m}}$ 을 만족하는 가장 작은 음이 아닌 정수 $x$를 구하세요.`
      : `Find the smallest non-negative integer $x$ satisfying $${a}x \\equiv ${b} \\pmod{${m}}$.`;

    const explanation = lang === 'ko'
      ? `**[The Essential Guide to Competition Math: Number Theory Topic 5.1 일차합동식]**\n\n$x=0,1,\\dots,${m - 1}$ 을 차례로 대입하면 $${a}\\times ${x0} = ${a * x0} \\equiv ${b} \\pmod{${m}}$ 이 성립하는 가장 작은 값은 $x=${x0}$ 입니다.\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${x0})** 입니다.`
      : `**[The Essential Guide to Competition Math: Number Theory Topic 5.1 Linear Congruences]**\n\nChecking $x=0,1,\\dots,${m - 1}$, the smallest value satisfying $${a}\\times ${x0} = ${a * x0} \\equiv ${b} \\pmod{${m}}$ is $x=${x0}$.\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${x0})**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // DIOPHANTINE EQUATIONS & SFFT (The Essential Guide to Competition Math:
  // Number Theory Topic 3.1 & Topic 6 Simon's Favorite Factoring Technique)
  // -----------------------------------------------------------------------
  'diophantine-equations': (lang) => {
    const variant = pickRandom(['sfft-xy-pairs', 'difference-of-squares-pairs', 'linear-diophantine']);

    if (variant === 'sfft-xy-pairs') {
      const a = randInt(2, 5);
      const b = randInt(2, 5);
      const K = pickRandom([12, 16, 18, 20, 24, 28, 30, 36]);
      const c = K - a * b;
      let posCount = 0;
      for (let d = 1; d <= K; d += 1) {
        if (K % d === 0) {
          const x = b + d;
          const y = a + Math.floor(K / d);
          if (x > 0 && y > 0) posCount += 1;
        }
      }
      const ans = posCount;

      const { choices, correctIdx } = buildChoices(ans, (i) => {
        if (i === 1) return ans + 1;
        if (i === 2) return Math.max(1, ans - 1);
        if (i === 3) return ans + 2;
        return ans + randInt(3, 5);
      });

      const cSign = c >= 0 ? ` = ${c}` : ` = -${Math.abs(c)}`;
      const eqStr = `xy - ${a}x - ${b}y${cSign}`;

      const question = lang === 'ko'
        ? `방정식 $${eqStr}$ 을 만족하는 양의 정수 순서쌍 $(x, y)$의 개수를 구하세요.`
        : `How many ordered pairs of positive integers $(x, y)$ satisfy the equation $${eqStr}$?`;

      const explanation = lang === 'ko'
        ? `**[The Essential Guide to Competition Math: Number Theory Topic 3.1 & Topic 6 Simon's Favorite Factoring Technique (SFFT)]**\n\n양변에 $${a} \\times ${b} = ${a * b}$를 더하여 좌변을 인수분해합니다:\n\n$$xy - ${a}x - ${b}y + ${a * b} = ${c} + ${a * b} = ${K}$$\n$$(x - ${b})(y - ${a}) = ${K}$$\n\n$x, y$가 양의 정수이므로 $x - ${b}$와 $y - ${a}$는 모두 양수이어야 하며, $x - ${b}$는 $${K}$의 양의 약수여야 합니다.\n$${K}$의 양의 약수의 개수가 $${ans}$개이므로, 각 약수마다 양의 정수 해 $(x, y)$가 유일하게 하나씩 대응됩니다.\n따라서 순서쌍의 개수는 **$${ans}$개**입니다.\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans}개)** 입니다.`
        : `**[The Essential Guide to Competition Math: Number Theory Topic 3.1 & Topic 6 Simon's Favorite Factoring Technique (SFFT)]**\n\nAdd $${a} \\times ${b} = ${a * b}$ to both sides to factor by grouping:\n\n$$xy - ${a}x - ${b}y + ${a * b} = ${c} + ${a * b} = ${K}$$\n$$(x - ${b})(y - ${a}) = ${K}$$\n\nSince $x, y > 0$, both factors must be positive divisors of $${K}$.\nSince $${K}$ has $${ans}$ positive divisors, there are **${ans}** ordered pairs $(x, y)$.\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'difference-of-squares-pairs') {
      const N = pickRandom([45, 60, 72, 84, 96, 105, 120, 144]);
      let count = 0;
      const solutions = [];
      for (let d1 = 1; d1 * d1 < N; d1 += 1) {
        if (N % d1 === 0) {
          const d2 = N / d1;
          if ((d1 + d2) % 2 === 0) {
            count += 1;
            solutions.push(`(${Math.floor((d1 + d2) / 2)}, ${Math.floor((d2 - d1) / 2)})`);
          }
        }
      }
      const ans = count;

      const { choices, correctIdx } = buildChoices(ans, (i) => {
        if (i === 1) return ans + 1;
        if (i === 2) return Math.max(1, ans - 1);
        if (i === 3) return ans + 2;
        return ans + randInt(3, 5);
      });

      const question = lang === 'ko'
        ? `방정식 $x^2 - y^2 = ${N}$ 을 만족하는 양의 정수 순서쌍 $(x, y)$의 개수를 구하세요.`
        : `How many ordered pairs of positive integers $(x, y)$ satisfy the equation $x^2 - y^2 = ${N}$?`;

      const explanation = lang === 'ko'
        ? `**[The Essential Guide to Competition Math: Number Theory Topic 1.2 & Topic 6 합차공식과 정수해]**\n\n좌변을 합차공식으로 인수분해하면 $(x - y)(x + y) = ${N}$ 입니다.\n$x, y$가 양의 정수이므로 $0 < x - y < x + y$ 이고, $(x - y) + (x + y) = 2x$ (짝수)이므로 두 인수의 홀짝성(Parity)이 같아야 합니다.\n$${N}$의 약수 쌍 $(d_1, d_2)$ 중 $d_1 < d_2$ 이고 $d_1, d_2$의 홀짝성이 일치하는 쌍을 찾으면 총 **$${ans}$개** (${solutions.join(', ')}) 입니다.\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans}개)** 입니다.`
        : `**[The Essential Guide to Competition Math: Number Theory Topic 1.2 & Topic 6 Difference of Squares & Parity]**\n\nFactoring gives $(x - y)(x + y) = ${N}$.\nFor positive integers $x, y$, we must have $0 < x - y < x + y$, and $(x - y) + (x + y) = 2x$ (an even sum), meaning $x - y$ and $x + y$ must share the same parity (both even or both odd).\nChecking factor pairs $(d_1, d_2)$ with $d_1 < d_2$ of the same parity yields **${ans}** pairs (${solutions.join(', ')}).\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

      return { question, choices, correctIdx, explanation };
    }

    // linear-diophantine: ax + by = c, smallest positive integer x
    const a = pickRandom([3, 5, 7, 11]);
    let b = pickRandom([4, 6, 8, 9, 13]);
    while (gcd(a, b) !== 1) b = pickRandom([4, 6, 8, 9, 13]);
    const xTrue = randInt(1, b - 1);
    const yTrue = randInt(1, 10);
    const c = a * xTrue + b * yTrue;
    const ans = xTrue;

    const { choices, correctIdx } = buildChoices(ans, (i) => {
      if (i === 1) return (ans + 1) % b || b;
      if (i === 2) return Math.max(1, ans - 1);
      if (i === 3) return ans + 2;
      return (ans + i) % b || 1;
    });

    const question = lang === 'ko'
      ? `방정식 $${a}x + ${b}y = ${c}$ 을 만족하는 양의 정수 해 $(x, y)$ 중 $x$의 최솟값을 구하세요.`
      : `Find the minimum possible value of $x$ for positive integers $(x, y)$ satisfying $${a}x + ${b}y = ${c}$.`;

    const explanation = lang === 'ko'
      ? `**[The Essential Guide to Competition Math: Number Theory Topic 2.3 베주 항등식과 일차 부정방정식]**\n\n양변을 법 $${b}$에 대해 정리하면:\n\n$$${a}x \\equiv ${c} \\equiv ${c % b} \\pmod{${b}}$$\n\n$x = 1, 2, \\dots, ${b - 1}$ 을 대입하여 $${a}x \\equiv ${c % b} \\pmod{${b}}$ 을 만족하는 가장 작은 양의 정수를 찾으면 $x = ${ans}$ 입니다.\n이때 $y = \\dfrac{${c} - ${a}(${ans})}{${b}} = ${yTrue} > 0$ 이므로 양의 정수 해가 됩니다.\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans})** 입니다.`
      : `**[The Essential Guide to Competition Math: Number Theory Topic 2.3 Bézout's Identity & Linear Diophantine]**\n\nReducing modulo $${b}$:\n\n$$${a}x \\equiv ${c % b} \\pmod{${b}}$$\n\nThe smallest positive integer solution is $x = ${ans}$, which gives $y = ${yTrue} > 0$.\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // POLYNOMIAL ZEROS & RATIONAL ROOT THEOREM (The Essential Guide to
  // Algebra 2 Topic 5: Polynomials and Polynomial Function / Topic 6:
  // Application of Polynomials)
  // -----------------------------------------------------------------------
  'polynomial-zeros': (lang) => {
    const variant = pickRandom(['rational-root-largest', 'polynomial-from-zeros', 'factor-theorem-check', 'descartes-rule-of-signs']);

    if (variant === 'descartes-rule-of-signs') {
      const signs = pickRandom([
        [1, -1, 1, -1, 1],
        [1, 1, -1, 1, -1],
        [1, -1, -1, 1, 1],
        [1, 1, 1, -1, -1],
        [1, -1, 1, 1, -1],
      ]);
      const coeffs = signs.map((s) => s * randInt(1, 5));
      let signChanges = 0;
      for (let i = 0; i < coeffs.length - 1; i += 1) {
        if ((coeffs[i] > 0 && coeffs[i + 1] < 0) || (coeffs[i] < 0 && coeffs[i + 1] > 0)) {
          signChanges += 1;
        }
      }
      const ans = signChanges;
      const polyTerms = [];
      for (let i = 0; i < coeffs.length; i += 1) {
        const pwr = coeffs.length - 1 - i;
        const c = coeffs[i];
        const sign = c > 0 ? (i === 0 ? '' : '+ ') : '- ';
        const absC = Math.abs(c) === 1 && pwr > 0 ? '' : Math.abs(c);
        const xPart = pwr === 0 ? '' : pwr === 1 ? 'x' : `x^${pwr}`;
        polyTerms.push(`${sign}${absC}${xPart}`);
      }
      const polyStr = polyTerms.join(' ');

      const { choices, correctIdx } = buildChoices(ans, (i) => {
        if (i === 1) return ans + 1;
        if (i === 2) return Math.max(0, ans - 1);
        if (i === 3) return ans + 2;
        return (ans + i) % 5;
      });

      const question = lang === 'ko'
        ? `다항식 $P(x) = ${polyStr}$ 에 대하여, 데카르트 부호 법칙(Descartes' Rule of Signs)을 적용했을 때 가질 수 있는 양의 실근의 **최대 개수**는 몇 개입니까?`
        : `According to Descartes' Rule of Signs, what is the maximum number of positive real roots for the polynomial $P(x) = ${polyStr}$?`;

      const explanation = lang === 'ko'
        ? `**[The Essential Guide to Algebra 2 Topic 6.6 데카르트 부호 법칙 (Descartes' Rule of Signs)]**\n\n다항식 $P(x)$의 양의 실근의 개수는 계수의 부호 변화(sign change) 횟수와 같거나 그보다 짝수만큼 적습니다.\n\n계수의 부호 배열:\n$$(${coeffs.map(c => c > 0 ? '+' : '-').join(', ')})$$\n\n부호가 바뀌는 횟수는 총 **$${ans}$회**입니다. 따라서 양의 실근의 최대 개수는 **$${ans}$개**입니다.\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans})** 입니다.`
        : `**[The Essential Guide to Algebra 2 Topic 6.6 Descartes' Rule of Signs]**\n\nThe number of positive real roots of $P(x)$ equals the number of sign changes in the coefficients, or is less by an even integer.\n\nSign sequence of the coefficients:\n$$(${coeffs.map(c => c > 0 ? '+' : '-').join(', ')})$$\n\nThere are **$${ans}$ sign changes**. Hence, the maximum number of positive real roots is **$${ans}$**.\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

      return { question, choices, correctIdx, explanation };
    }

    const fmtLinear = (c) => (c === 0 ? 'x' : c > 0 ? `x - ${c}` : `x + ${Math.abs(c)}`);
    const formatCubic = (b2, b1, b0) => {
      const terms = ['x^3'];
      if (b2 !== 0) terms.push(`${b2 > 0 ? '+' : '-'} ${Math.abs(b2) === 1 ? '' : Math.abs(b2)}x^2`);
      if (b1 !== 0) terms.push(`${b1 > 0 ? '+' : '-'} ${Math.abs(b1) === 1 ? '' : Math.abs(b1)}x`);
      if (b0 !== 0) terms.push(`${b0 > 0 ? '+' : '-'} ${Math.abs(b0)}`);
      return terms.join(' ');
    };

    if (variant === 'rational-root-largest') {
      const pool = [-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6];
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      const [r1, r2, r3] = shuffled.slice(0, 3);
      const b2 = -(r1 + r2 + r3);
      const b1 = r1 * r2 + r1 * r3 + r2 * r3;
      const b0 = -(r1 * r2 * r3);
      const ans = Math.max(r1, r2, r3);
      const roots = [r1, r2, r3];

      const { choices, correctIdx } = buildChoices(ans, (i) => {
        const sorted = [...roots].sort((a, c) => a - c);
        if (i === 1) return sorted[0];
        if (i === 2) return sorted[1];
        if (i === 3) return ans + 1;
        return ans - i + 3;
      });

      const polyStr = formatCubic(b2, b1, b0);
      const divisors = Array.from({ length: Math.abs(b0) || 1 }, (_, k) => k + 1).filter((d) => b0 % d === 0);
      const candidateList = divisors.flatMap((d) => [d, -d]).sort((a, c) => a - c).join(', ');

      const question = lang === 'ko'
        ? `방정식 $${polyStr} = 0$ 의 가장 큰 유리근을 구하세요.`
        : `Find the largest rational root of $${polyStr} = 0$.`;

      const explanation = lang === 'ko'
        ? `**[The Essential Guide to Algebra 2 Topic 6.5 유리근 정리]**\n\n최고차항의 계수가 $1$이므로 유리근 정리에 의해 가능한 유리근은 상수항 $${b0}$의 약수: $${candidateList}$ 뿐입니다.\n\n직접 대입하여 확인하면 $x = ${r1}, ${r2}, ${r3}$ 이 실제 근이므로, 가장 큰 유리근은 $${ans}$ 입니다.\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans})** 입니다.`
        : `**[The Essential Guide to Algebra 2 Topic 6.5 Rational Root Theorem]**\n\nSince the leading coefficient is $1$, the Rational Root Theorem restricts possible rational roots to divisors of the constant term $${b0}$: $${candidateList}$.\n\nTesting these candidates confirms $x = ${r1}, ${r2}, ${r3}$ are the actual roots, so the largest rational root is $${ans}$.\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'polynomial-from-zeros') {
      const nonzero = [-4, -3, -2, -1, 1, 2, 3, 4];
      const z1 = pickRandom(nonzero);
      let z2 = pickRandom(nonzero);
      while (z2 === z1) z2 = pickRandom(nonzero);
      const a = pickRandom([1, 2, 3]);
      const ans = -a * z1 * z1 * z2;

      const { choices, correctIdx } = buildChoices(ans, (i) => {
        if (i === 1) return a * z1 * z1 * z2;
        if (i === 2) return -z1 * z1 * z2;
        if (i === 3) return ans + a;
        return ans - a * (i - 3);
      });

      const question = lang === 'ko'
        ? `다항식 함수 $f(x)$가 $x = ${z1}$ (중복도 2), $x = ${z2}$ 를 근으로 갖고 최고차항의 계수가 $${a}$일 때, $f(x)$를 전개한 표준형에서 상수항을 구하세요.`
        : `A polynomial function $f(x)$ has zeros $x = ${z1}$ (with multiplicity 2) and $x = ${z2}$, with leading coefficient $${a}$. Find the constant term when $f(x)$ is written in standard form.`;

      const explanation = lang === 'ko'
        ? `**[The Essential Guide to Algebra 2 Topic 5.7 주어진 근으로 다항식 구성]**\n\n근이 주어지면 $f(x) = ${a}(x-(${z1}))^2(x-(${z2}))$ 로 쓸 수 있습니다.\n\n상수항은 $x=0$ 을 대입한 값이므로\n\n$$f(0) = ${a}(-${z1})^2(-${z2}) = ${a}\\times ${z1 * z1}\\times (${-z2}) = ${ans}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans})** 입니다.`
        : `**[The Essential Guide to Algebra 2 Topic 5.7 Constructing a Polynomial from Given Zeros]**\n\nGiven the zeros, $f(x) = ${a}(x-(${z1}))^2(x-(${z2}))$.\n\nThe constant term equals $f(0)$:\n\n$$f(0) = ${a}(-${z1})^2(-${z2}) = ${a}\\times ${z1 * z1}\\times (${-z2}) = ${ans}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

      return { question, choices, correctIdx, explanation };
    }

    // factor-theorem-check
    const cPool = [-4, -3, -2, -1, 1, 2, 3, 4];
    const c = pickRandom(cPool);
    const b = randInt(-2, 2);
    let e = randInt(3, 6);
    while (b * b - 4 * e >= 0) e += 1;

    const b2 = b - c;
    const b1 = e - b * c;
    const b0 = -e * c;
    const polyEval = (x) => x ** 3 + b2 * (x ** 2) + b1 * x + b0;

    const distractorPool = cPool.filter((k) => k !== c && polyEval(k) !== 0);
    const shuffledDistractors = [...distractorPool].sort(() => Math.random() - 0.5).slice(0, 4);
    const optionValues = [c, ...shuffledDistractors];
    for (let i = optionValues.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [optionValues[i], optionValues[j]] = [optionValues[j], optionValues[i]];
    }
    const choices = optionValues.map((v) => fmtLinear(v));
    const correctIdx = optionValues.indexOf(c);

    const polyStr = formatCubic(b2, b1, b0);

    const question = lang === 'ko'
      ? `인수정리를 이용하여 $f(x) = ${polyStr}$ 의 인수를 다음 중에서 고르세요.`
      : `Use the Factor Theorem to determine which of the following is a factor of $f(x) = ${polyStr}$.`;

    const explanation = lang === 'ko'
      ? `**[The Essential Guide to Algebra 2 Topic 6.3 인수정리]**\n\n인수정리에 의해 $f(k) = 0$ 이면 $(x-k)$ 는 $f(x)$의 인수입니다.\n\n$f(${c}) = ${polyEval(c)} = 0$ 이므로 $${fmtLinear(c)}$ 는 $f(x)$의 인수입니다. (다른 선택지는 대입해도 $0$이 되지 않습니다.)\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${fmtLinear(c)})** 입니다.`
      : `**[The Essential Guide to Algebra 2 Topic 6.3 The Factor Theorem]**\n\nBy the Factor Theorem, if $f(k) = 0$ then $(x-k)$ is a factor of $f(x)$.\n\n$f(${c}) = ${polyEval(c)} = 0$, so $${fmtLinear(c)}$ is a factor of $f(x)$. (The other choices do not give $0$ when substituted.)\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${fmtLinear(c)})**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // TRIGONOMETRY (The Essential Guide to Precalculus Topic 4: Trigonometric
  // Ratio, Topic 5: Trigonometric Functions, Topic 7.1: Law of Sines/Cosines)
  // -----------------------------------------------------------------------
  'trigonometry': (lang) => {
    const variant = pickRandom(['special-angle-ratio', 'trig-equation-solve', 'law-of-cosines-side', 'heron-area']);

    const ANGLE_TABLE = [
      { deg: 0, sin: '0', cos: '1', tan: '0' },
      { deg: 30, sin: '\\frac{1}{2}', cos: '\\frac{\\sqrt{3}}{2}', tan: '\\frac{\\sqrt{3}}{3}' },
      { deg: 45, sin: '\\frac{\\sqrt{2}}{2}', cos: '\\frac{\\sqrt{2}}{2}', tan: '1' },
      { deg: 60, sin: '\\frac{\\sqrt{3}}{2}', cos: '\\frac{1}{2}', tan: '\\sqrt{3}' },
      { deg: 90, sin: '1', cos: '0', tan: null },
      { deg: 120, sin: '\\frac{\\sqrt{3}}{2}', cos: '-\\frac{1}{2}', tan: '-\\sqrt{3}' },
      { deg: 135, sin: '\\frac{\\sqrt{2}}{2}', cos: '-\\frac{\\sqrt{2}}{2}', tan: '-1' },
      { deg: 150, sin: '\\frac{1}{2}', cos: '-\\frac{\\sqrt{3}}{2}', tan: '-\\frac{\\sqrt{3}}{3}' },
      { deg: 180, sin: '0', cos: '-1', tan: '0' },
      { deg: 210, sin: '-\\frac{1}{2}', cos: '-\\frac{\\sqrt{3}}{2}', tan: '\\frac{\\sqrt{3}}{3}' },
      { deg: 225, sin: '-\\frac{\\sqrt{2}}{2}', cos: '-\\frac{\\sqrt{2}}{2}', tan: '1' },
      { deg: 240, sin: '-\\frac{\\sqrt{3}}{2}', cos: '-\\frac{1}{2}', tan: '\\sqrt{3}' },
      { deg: 270, sin: '-1', cos: '0', tan: null },
      { deg: 300, sin: '-\\frac{\\sqrt{3}}{2}', cos: '\\frac{1}{2}', tan: '-\\sqrt{3}' },
      { deg: 315, sin: '-\\frac{\\sqrt{2}}{2}', cos: '\\frac{\\sqrt{2}}{2}', tan: '-1' },
      { deg: 330, sin: '-\\frac{1}{2}', cos: '\\frac{\\sqrt{3}}{2}', tan: '-\\frac{\\sqrt{3}}{3}' },
    ];

    if (variant === 'special-angle-ratio') {
      const ratioKey = pickRandom(['sin', 'cos', 'tan']);
      const candidates = ratioKey === 'tan' ? ANGLE_TABLE.filter((e) => e.tan !== null) : ANGLE_TABLE;
      const entry = pickRandom(candidates);
      const ans = entry[ratioKey];
      const ratioName = { sin: '\\sin', cos: '\\cos', tan: '\\tan' }[ratioKey];

      const uniqueDistractors = [...new Set(candidates.map((e) => e[ratioKey]).filter((v) => v !== ans))]
        .sort(() => Math.random() - 0.5);
      const { choices, correctIdx } = buildChoices(ans, (i) => uniqueDistractors[(i - 1) % uniqueDistractors.length]);

      const question = lang === 'ko'
        ? `$${ratioName} ${entry.deg}^\\circ$ 의 값을 구하세요.`
        : `Find the value of $${ratioName} ${entry.deg}^\\circ$.`;

      const explanation = lang === 'ko'
        ? `**[The Essential Guide to Precalculus Topic 4.1 삼각비의 기본]**\n\n$${entry.deg}^\\circ$ 는 표준각으로, 기준각과 사분면의 부호를 이용하면\n\n$$${ratioName} ${entry.deg}^\\circ = ${ans}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]}** 입니다.`
        : `**[The Essential Guide to Precalculus Topic 4.1 Basic Trig Ratios]**\n\n$${entry.deg}^\\circ$ is a standard angle. Using the reference angle and the quadrant sign rule,\n\n$$${ratioName} ${entry.deg}^\\circ = ${ans}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]}**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'trig-equation-solve') {
      const ratioKey = pickRandom(['sin', 'cos']);
      const refDeg = pickRandom([30, 45, 60]);
      const refVal = {
        30: { sin: '\\frac{1}{2}', cos: '\\frac{\\sqrt{3}}{2}' },
        45: { sin: '\\frac{\\sqrt{2}}{2}', cos: '\\frac{\\sqrt{2}}{2}' },
        60: { sin: '\\frac{\\sqrt{3}}{2}', cos: '\\frac{1}{2}' },
      }[refDeg][ratioKey];
      const sign = pickRandom([1, -1]);
      const kLatex = sign === 1 ? refVal : `-${refVal}`;

      let sol1;
      let sol2;
      let ans;
      if (ratioKey === 'sin') {
        if (sign === 1) { sol1 = refDeg; sol2 = 180 - refDeg; ans = 180; } else { sol1 = 180 + refDeg; sol2 = 360 - refDeg; ans = 540; }
      } else if (sign === 1) { sol1 = refDeg; sol2 = 360 - refDeg; ans = 360; } else { sol1 = 180 - refDeg; sol2 = 180 + refDeg; ans = 360; }
      const ratioName = ratioKey === 'sin' ? '\\sin' : '\\cos';

      const { choices, correctIdx } = buildChoices(ans, (i) => {
        if (i === 1) return sol1;
        if (i === 2) return sol2;
        if (i === 3) return ans + 90;
        return Math.max(0, ans - 90 * (i - 3));
      });

      const question = lang === 'ko'
        ? `$0^\\circ \\le x < 360^\\circ$ 에서 방정식 $${ratioName} x = ${kLatex}$ 을 만족하는 모든 $x$ 의 합을 구하세요.`
        : `Find the sum of all solutions $x$ with $0^\\circ \\le x < 360^\\circ$ satisfying $${ratioName} x = ${kLatex}$.`;

      const explanation = lang === 'ko'
        ? `**[The Essential Guide to Precalculus Topic 5.5 삼각방정식 풀이]**\n\n기준각은 $${refDeg}^\\circ$ 이고, ${ratioName} 값의 부호를 만족하는 사분면을 찾으면 $x = ${sol1}^\\circ$ 또는 $x = ${sol2}^\\circ$ 입니다.\n\n두 해의 합은 $${sol1} + ${sol2} = ${ans}$ 입니다.\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans}^\\circ)** 입니다.`
        : `**[The Essential Guide to Precalculus Topic 5.5 Solving Trigonometric Equations]**\n\nThe reference angle is $${refDeg}^\\circ$. Matching the sign of ${ratioName} to the correct quadrants gives $x = ${sol1}^\\circ$ or $x = ${sol2}^\\circ$.\n\nThe sum of the solutions is $${sol1} + ${sol2} = ${ans}$.\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans}°)**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'law-of-cosines-side') {
      const pool = [
        { a: 3, b: 8, C: 60, c: 7 }, { a: 5, b: 8, C: 60, c: 7 }, { a: 6, b: 16, C: 60, c: 14 }, { a: 9, b: 24, C: 60, c: 21 },
        { a: 3, b: 5, C: 120, c: 7 }, { a: 7, b: 8, C: 120, c: 13 }, { a: 5, b: 16, C: 120, c: 19 },
        { a: 3, b: 4, C: 90, c: 5 }, { a: 6, b: 8, C: 90, c: 10 }, { a: 5, b: 12, C: 90, c: 13 }, { a: 9, b: 12, C: 90, c: 15 }, { a: 8, b: 15, C: 90, c: 17 },
      ];
      const { a, b, C, c } = pickRandom(pool);
      const ans = c;
      const cosCLatex = { 60: '\\frac{1}{2}', 90: '0', 120: '-\\frac{1}{2}' }[C];

      const { choices, correctIdx } = buildChoices(ans, (i) => {
        if (i === 1) return a + b - c;
        if (i === 2) return Math.round(Math.sqrt(a * a + b * b));
        if (i === 3) return ans + 1;
        return Math.max(1, ans - i + 3);
      });

      const question = lang === 'ko'
        ? `삼각형 $ABC$ 에서 $a = ${a}$, $b = ${b}$, $\\angle C = ${C}^\\circ$ 일 때, 코사인 법칙을 이용하여 변 $c$ 의 길이를 구하세요.`
        : `In triangle $ABC$, $a = ${a}$, $b = ${b}$, and $\\angle C = ${C}^\\circ$. Use the Law of Cosines to find the length of side $c$.`;

      const explanation = lang === 'ko'
        ? `**[The Essential Guide to Precalculus Topic 7.1 코사인 법칙]**\n\n$$c^2 = a^2 + b^2 - 2ab\\cos C = ${a}^2 + ${b}^2 - 2(${a})(${b})\\left(${cosCLatex}\\right) = ${c * c}$$\n\n$$c = \\sqrt{${c * c}} = ${ans}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans})** 입니다.`
        : `**[The Essential Guide to Precalculus Topic 7.1 Law of Cosines]**\n\n$$c^2 = a^2 + b^2 - 2ab\\cos C = ${a}^2 + ${b}^2 - 2(${a})(${b})\\left(${cosCLatex}\\right) = ${c * c}$$\n\n$$c = \\sqrt{${c * c}} = ${ans}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

      return { question, choices, correctIdx, explanation };
    }

    // heron-area
    const pool = [
      { a: 3, b: 4, c: 5, area: 6 }, { a: 5, b: 5, c: 6, area: 12 }, { a: 5, b: 5, c: 8, area: 12 },
      { a: 6, b: 8, c: 10, area: 24 }, { a: 5, b: 12, c: 13, area: 30 }, { a: 9, b: 10, c: 17, area: 36 },
      { a: 10, b: 13, c: 13, area: 60 }, { a: 13, b: 14, c: 15, area: 84 }, { a: 4, b: 13, c: 15, area: 24 },
    ];
    const { a, b, c, area } = pickRandom(pool);
    const s = (a + b + c) / 2;
    const ans = area;

    const { choices, correctIdx } = buildChoices(ans, (i) => {
      if (i === 1) return Math.round(s);
      if (i === 2) return Math.round((a * b) / 2);
      if (i === 3) return ans + 6;
      return Math.max(1, ans - 6 * (i - 3));
    });

    const question = lang === 'ko'
      ? `세 변의 길이가 $${a}$, $${b}$, $${c}$ 인 삼각형의 넓이를 헤론의 공식을 이용하여 구하세요.`
      : `A triangle has side lengths $${a}$, $${b}$, and $${c}$. Find its area using Heron's Formula.`;

    const explanation = lang === 'ko'
      ? `**[The Essential Guide to Precalculus Topic 7.1 헤론의 공식]**\n\n반둘레 $s = \\dfrac{${a}+${b}+${c}}{2} = ${s}$ 이므로,\n\n$$\\text{넓이} = \\sqrt{s(s-a)(s-b)(s-c)} = \\sqrt{${s}(${s - a})(${s - b})(${s - c})} = ${ans}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans})** 입니다.`
      : `**[The Essential Guide to Precalculus Topic 7.1 Heron's Formula]**\n\nThe semi-perimeter is $s = \\dfrac{${a}+${b}+${c}}{2} = ${s}$, so\n\n$$\\text{Area} = \\sqrt{s(s-a)(s-b)(s-c)} = \\sqrt{${s}(${s - a})(${s - b})(${s - c})} = ${ans}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // TRIGONOMETRIC IDENTITIES (The Essential Guide to Precalculus Topic 6:
  // Sum/Difference Formula, Double-Angle Formula)
  // -----------------------------------------------------------------------
  'trig-identities': (lang) => {
    const variant = pickRandom(['sum-difference-value', 'double-angle-value', 'tan-double-angle']);

    if (variant === 'sum-difference-value') {
      const table = [
        { deg: 15, ratio: 'sin', decomp: '45^\\circ - 30^\\circ', formula: '\\sin 45^\\circ\\cos 30^\\circ - \\cos 45^\\circ\\sin 30^\\circ', value: '\\frac{\\sqrt{6}-\\sqrt{2}}{4}' },
        { deg: 15, ratio: 'cos', decomp: '45^\\circ - 30^\\circ', formula: '\\cos 45^\\circ\\cos 30^\\circ + \\sin 45^\\circ\\sin 30^\\circ', value: '\\frac{\\sqrt{6}+\\sqrt{2}}{4}' },
        { deg: 75, ratio: 'sin', decomp: '45^\\circ + 30^\\circ', formula: '\\sin 45^\\circ\\cos 30^\\circ + \\cos 45^\\circ\\sin 30^\\circ', value: '\\frac{\\sqrt{6}+\\sqrt{2}}{4}' },
        { deg: 75, ratio: 'cos', decomp: '45^\\circ + 30^\\circ', formula: '\\cos 45^\\circ\\cos 30^\\circ - \\sin 45^\\circ\\sin 30^\\circ', value: '\\frac{\\sqrt{6}-\\sqrt{2}}{4}' },
        { deg: 105, ratio: 'sin', decomp: '60^\\circ + 45^\\circ', formula: '\\sin 60^\\circ\\cos 45^\\circ + \\cos 60^\\circ\\sin 45^\\circ', value: '\\frac{\\sqrt{6}+\\sqrt{2}}{4}' },
        { deg: 105, ratio: 'cos', decomp: '60^\\circ + 45^\\circ', formula: '\\cos 60^\\circ\\cos 45^\\circ - \\sin 60^\\circ\\sin 45^\\circ', value: '\\frac{\\sqrt{2}-\\sqrt{6}}{4}' },
      ];
      const entry = pickRandom(table);
      const ratioName = entry.ratio === 'sin' ? '\\sin' : '\\cos';
      const ans = entry.value;

      const basePool = [
        '\\frac{\\sqrt{6}-\\sqrt{2}}{4}', '\\frac{\\sqrt{6}+\\sqrt{2}}{4}', '\\frac{\\sqrt{2}-\\sqrt{6}}{4}', '-\\frac{\\sqrt{6}+\\sqrt{2}}{4}',
        '\\frac{\\sqrt{3}}{2}', '\\frac{\\sqrt{2}}{2}', '\\frac{1}{2}', '-\\frac{\\sqrt{6}-\\sqrt{2}}{4}',
      ];
      const distractorPool = basePool.filter((v) => v !== ans);
      const { choices, correctIdx } = buildChoices(ans, (i) => distractorPool[(i - 1) % distractorPool.length]);

      const question = lang === 'ko'
        ? `삼각함수의 덧셈정리를 이용하여 $${ratioName} ${entry.deg}^\\circ$ 의 값을 구하세요.`
        : `Use the sum/difference formula to find the exact value of $${ratioName} ${entry.deg}^\\circ$.`;

      const explanation = lang === 'ko'
        ? `**[The Essential Guide to Precalculus Topic 6.1 삼각함수의 덧셈정리]**\n\n$${entry.deg}^\\circ = ${entry.decomp}$ 로 분해하면,\n\n$$${ratioName} ${entry.deg}^\\circ = ${entry.formula} = ${ans}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]}** 입니다.`
        : `**[The Essential Guide to Precalculus Topic 6.1 Sum and Difference Formulas]**\n\nDecomposing $${entry.deg}^\\circ = ${entry.decomp}$,\n\n$$${ratioName} ${entry.deg}^\\circ = ${entry.formula} = ${ans}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]}**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'double-angle-value') {
      const triples = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]];
      const [p, q, r] = pickRandom(triples);
      const quadrant = pickRandom(['I', 'II']);
      const cosSign = quadrant === 'I' ? 1 : -1;
      const ansNum = 2 * p * cosSign * q;
      const ansDen = r * r;
      const g = gcd(Math.abs(ansNum), ansDen);
      const ansNumR = ansNum / g;
      const ansDenR = ansDen / g;
      const ansLatex = ansNumR < 0 ? `-\\frac{${-ansNumR}}{${ansDenR}}` : `\\frac{${ansNumR}}{${ansDenR}}`;

      const { choices, correctIdx } = buildChoices(ansLatex, (i) => {
        if (i === 1) return ansNumR < 0 ? `\\frac{${-ansNumR}}{${ansDenR}}` : `-\\frac{${ansNumR}}{${ansDenR}}`;
        if (i === 2) return `\\frac{${p}}{${r}}`;
        if (i === 3) return `\\frac{${2 * p}}{${r}}`;
        return `\\frac{${Math.abs(ansNumR) + (i - 3)}}{${ansDenR}}`;
      });

      const quadLabel = quadrant === 'I' ? (lang === 'ko' ? '제1사분면' : 'Quadrant I') : (lang === 'ko' ? '제2사분면' : 'Quadrant II');
      const cosSignLatex = cosSign === 1 ? '' : '-';

      const question = lang === 'ko'
        ? `$\\theta$ 가 ${quadLabel}의 각이고 $\\sin\\theta = \\frac{${p}}{${r}}$ 일 때, $\\sin 2\\theta$ 의 값을 구하세요.`
        : `Angle $\\theta$ is in ${quadLabel} and $\\sin\\theta = \\frac{${p}}{${r}}$. Find the value of $\\sin 2\\theta$.`;

      const explanation = lang === 'ko'
        ? `**[The Essential Guide to Precalculus Topic 6.2 배각공식]**\n\n피타고라스 삼중수 $(${p},${q},${r})$ 에서 $\\cos\\theta = ${cosSignLatex}\\frac{${q}}{${r}}$ 입니다 (${quadLabel}이므로 코사인 부호에 유의).\n\n$$\\sin 2\\theta = 2\\sin\\theta\\cos\\theta = 2\\times\\frac{${p}}{${r}}\\times\\left(${cosSignLatex}\\frac{${q}}{${r}}\\right) = ${ansLatex}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]}** 입니다.`
        : `**[The Essential Guide to Precalculus Topic 6.2 Double-Angle Formula]**\n\nFrom the Pythagorean triple $(${p},${q},${r})$, $\\cos\\theta = ${cosSignLatex}\\frac{${q}}{${r}}$ (mind the sign in ${quadLabel}).\n\n$$\\sin 2\\theta = 2\\sin\\theta\\cos\\theta = 2\\times\\frac{${p}}{${r}}\\times\\left(${cosSignLatex}\\frac{${q}}{${r}}\\right) = ${ansLatex}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]}**.`;

      return { question, choices, correctIdx, explanation };
    }

    // tan-double-angle
    const pairs = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5]];
    const [p, q] = pickRandom(pairs);
    const numer = 2 * p * q;
    const denom = q * q - p * p;
    const g = gcd(Math.abs(numer), Math.abs(denom));
    const numR = numer / g;
    const denR = denom / g;
    const ansLatex = `\\frac{${numR}}{${denR}}`;

    const { choices, correctIdx } = buildChoices(ansLatex, (i) => {
      if (i === 1) return `\\frac{${p}}{${q}}`;
      if (i === 2) return `\\frac{${denR}}{${numR}}`;
      if (i === 3) return `-\\frac{${numR}}{${denR}}`;
      return `\\frac{${numR + (i - 3)}}{${denR}}`;
    });

    const question = lang === 'ko'
      ? `$\\tan\\theta = \\frac{${p}}{${q}}$ 일 때, 배각공식을 이용하여 $\\tan 2\\theta$ 의 값을 구하세요.`
      : `If $\\tan\\theta = \\frac{${p}}{${q}}$, use the double-angle formula to find $\\tan 2\\theta$.`;

    const explanation = lang === 'ko'
      ? `**[The Essential Guide to Precalculus Topic 6.2 탄젠트의 배각공식]**\n\n$$\\tan 2\\theta = \\frac{2\\tan\\theta}{1-\\tan^2\\theta} = \\frac{2\\times\\frac{${p}}{${q}}}{1-\\left(\\frac{${p}}{${q}}\\right)^2} = \\frac{${numer}}{${denom}} = ${ansLatex}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]}** 입니다.`
      : `**[The Essential Guide to Precalculus Topic 6.2 Tangent Double-Angle Formula]**\n\n$$\\tan 2\\theta = \\frac{2\\tan\\theta}{1-\\tan^2\\theta} = \\frac{2\\times\\frac{${p}}{${q}}}{1-\\left(\\frac{${p}}{${q}}\\right)^2} = \\frac{${numer}}{${denom}} = ${ansLatex}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]}**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // COMPLEX NUMBERS — POLAR FORM & DE MOIVRE'S THEOREM (The Essential Guide
  // to Precalculus Topic 7.7-7.9)
  // -----------------------------------------------------------------------
  'complex-numbers-polar': (lang) => {
    const variant = pickRandom(['de-moivre-power', 'modulus']);

    if (variant === 'de-moivre-power') {
      const pool = [
        { base: '1+i', r: '\\sqrt{2}', rSquared: 2, thetaDeg: 45, n: 4 },
        { base: '1+i', r: '\\sqrt{2}', rSquared: 2, thetaDeg: 45, n: 8 },
        { base: '1+i', r: '\\sqrt{2}', rSquared: 2, thetaDeg: 45, n: 2 },
        { base: '1-i', r: '\\sqrt{2}', rSquared: 2, thetaDeg: -45, n: 4 },
        { base: '1-i', r: '\\sqrt{2}', rSquared: 2, thetaDeg: -45, n: 2 },
        { base: '\\sqrt{3}+i', r: '2', rSquared: 4, thetaDeg: 30, n: 6 },
        { base: '\\sqrt{3}+i', r: '2', rSquared: 4, thetaDeg: 30, n: 3 },
        { base: '-1+i', r: '\\sqrt{2}', rSquared: 2, thetaDeg: 135, n: 4 },
        { base: '1+\\sqrt{3}i', r: '2', rSquared: 4, thetaDeg: 60, n: 3 },
        { base: '1+\\sqrt{3}i', r: '2', rSquared: 4, thetaDeg: 60, n: 6 },
      ];
      const entry = pickRandom(pool);
      const rPow = Math.round(Math.pow(entry.rSquared, entry.n / 2));
      const angle = (((entry.thetaDeg * entry.n) % 360) + 360) % 360;

      let ansLatex;
      if (angle === 0) ansLatex = `${rPow}`;
      else if (angle === 180) ansLatex = `${-rPow}`;
      else if (angle === 90) ansLatex = `${rPow}i`;
      else ansLatex = `-${rPow}i`;

      const shapes = [`${rPow}`, `${-rPow}`, `${rPow}i`, `-${rPow}i`];
      const otherShapes = shapes.filter((v) => v !== ansLatex);
      const { choices, correctIdx } = buildChoices(ansLatex, (i) => {
        if (i <= otherShapes.length) return otherShapes[i - 1];
        return `${rPow + (i - otherShapes.length)}`;
      });

      const question = lang === 'ko'
        ? `드무아브르 정리를 이용하여 $(${entry.base})^{${entry.n}}$ 의 값을 구하세요.`
        : `Use De Moivre's Theorem to find the value of $(${entry.base})^{${entry.n}}$.`;

      const explanation = lang === 'ko'
        ? `**[The Essential Guide to Precalculus Topic 7.9 드무아브르 정리]**\n\n$${entry.base} = ${entry.r}\\left(\\cos ${entry.thetaDeg}^\\circ + i\\sin ${entry.thetaDeg}^\\circ\\right)$ 이므로, 드무아브르 정리에 의해\n\n$$(${entry.base})^{${entry.n}} = ${entry.r}^{${entry.n}}\\left(\\cos(${entry.n}\\times ${entry.thetaDeg}^\\circ) + i\\sin(${entry.n}\\times ${entry.thetaDeg}^\\circ)\\right) = ${rPow}\\left(\\cos ${angle}^\\circ + i\\sin ${angle}^\\circ\\right) = ${ansLatex}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]}** 입니다.`
        : `**[The Essential Guide to Precalculus Topic 7.9 De Moivre's Theorem]**\n\nSince $${entry.base} = ${entry.r}\\left(\\cos ${entry.thetaDeg}^\\circ + i\\sin ${entry.thetaDeg}^\\circ\\right)$, De Moivre's Theorem gives\n\n$$(${entry.base})^{${entry.n}} = ${entry.r}^{${entry.n}}\\left(\\cos(${entry.n}\\times ${entry.thetaDeg}^\\circ) + i\\sin(${entry.n}\\times ${entry.thetaDeg}^\\circ)\\right) = ${rPow}\\left(\\cos ${angle}^\\circ + i\\sin ${angle}^\\circ\\right) = ${ansLatex}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]}**.`;

      return { question, choices, correctIdx, explanation };
    }

    // modulus
    const triples = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [7, 24, 25], [9, 12, 15], [20, 21, 29]];
    const [a, b, r] = pickRandom(triples);
    const signB = pickRandom([1, -1]);
    const ans = r;

    const { choices, correctIdx } = buildChoices(ans, (i) => {
      if (i === 1) return a + b;
      if (i === 2) return Math.max(1, Math.abs(a - b));
      if (i === 3) return ans + 2;
      return Math.max(1, ans - 2 * (i - 3));
    });

    const bLatex = signB === 1 ? `+ ${b}i` : `- ${b}i`;

    const question = lang === 'ko'
      ? `복소수 $z = ${a} ${bLatex}$ 의 절댓값 $|z|$ 를 구하세요.`
      : `Find the modulus $|z|$ of the complex number $z = ${a} ${bLatex}$.`;

    const explanation = lang === 'ko'
      ? `**[The Essential Guide to Precalculus Topic 7.7 복소수의 극형식]**\n\n$$|z| = \\sqrt{${a}^2 + ${b}^2} = \\sqrt{${a * a} + ${b * b}} = \\sqrt{${a * a + b * b}} = ${ans}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans})** 입니다.`
      : `**[The Essential Guide to Precalculus Topic 7.7 Polar Form of Complex Numbers]**\n\n$$|z| = \\sqrt{${a}^2 + ${b}^2} = \\sqrt{${a * a} + ${b * b}} = \\sqrt{${a * a + b * b}} = ${ans}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // EXPRESSIONS & SUBSTITUTION (AMC10 & AMC 8 Vol 4 Ch 19 Special Symbols)
  // -----------------------------------------------------------------------
  'expressions-substitution': (lang) => {
    const variant = pickRandom(['common-exponent-fraction', 'difference-of-squares', 'substitution-value', 'custom-operator']);

    if (variant === 'custom-operator') {
      // AMC 8 Prep Vol. 4 Ch.19: Special Symbols and Operations (정의된 연산 기호 a◇b)
      const opKind = pickRandom(['quotient-squares', 'harmonic-compound', 'determinant']);

      if (opKind === 'quotient-squares') {
        const b = pickRandom([2, 4, 6, 8]);
        const a = 3 * b;
        const ans = Math.round((a * a + b * b) / (a + b)); // = 2.5 * b, integer because b is even

        const { choices, correctIdx } = buildChoices(ans, (i) => {
          if (i === 1) return a - b;
          if (i === 2) return Math.round((a * a - b * b) / (a + b)); // a - b
          if (i === 3) return ans + 2;
          return Math.max(1, ans - 2);
        });

        const question = lang === 'ko'
          ? `두 양의 정수 $a, b$에 대하여 새로운 연산 기호 $\\diamondsuit$를 다음과 같이 정의합니다:\n\n$$a \\diamondsuit b = \\frac{a^2 + b^2}{a + b}$$\n\n이때 $${a} \\diamondsuit ${b}$의 값을 구하세요.`
          : `For positive integers $a$ and $b$, a new operation $\\diamondsuit$ is defined as:\n\n$$a \\diamondsuit b = \\frac{a^2 + b^2}{a + b}$$\n\nWhat is the value of $${a} \\diamondsuit ${b}$?`;

        const explanation = lang === 'ko'
          ? `**[AMC 8 Prep Vol. 4 Ch.19 정의된 연산 기호와 식의 계산]**\n\n주어진 연산 규칙 $a \\diamondsuit b = \\frac{a^2 + b^2}{a + b}$에 $a = ${a}$, $b = ${b}$를 대입합니다:\n\n$$${a} \\diamondsuit ${b} = \\frac{${a}^2 + ${b}^2}{${a} + ${b}} = \\frac{${a * a} + ${b * b}}{${a + b}} = \\frac{${a * a + b * b}}{${a + b}} = ${ans}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans})** 입니다.`
          : `**[AMC 8 Prep Vol. 4 Ch.19 Special Symbols and Operations]**\n\nSubstitute $a = ${a}$ and $b = ${b}$ into the definition $a \\diamondsuit b = \\frac{a^2 + b^2}{a + b}$:\n\n$$${a} \\diamondsuit ${b} = \\frac{${a}^2 + ${b}^2}{${a} + ${b}} = \\frac{${a * a} + ${b * b}}{${a + b}} = \\frac{${a * a + b * b}}{${a + b}} = ${ans}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

        return { question, choices, correctIdx, explanation };
      }

      if (opKind === 'harmonic-compound') {
        const x = 12;
        const y = 6;
        const xyRes = 4;
        const z = 4;
        const ans = 2;

        const { choices, correctIdx } = buildChoices(ans, (i) => {
          if (i === 1) return 4;
          if (i === 2) return 3;
          if (i === 3) return 1;
          return 5;
        });

        const question = lang === 'ko'
          ? `두 양의 실수 $x, y$에 대하여 연산 $\\star$가 $x \\star y = \\frac{xy}{x + y}$로 정의될 때, $(${x} \\star ${y}) \\star ${z}$의 값은 얼마입니까?`
          : `For positive real numbers $x$ and $y$, the operation $\\star$ is defined by $x \\star y = \\frac{xy}{x + y}$. What is the value of $(${x} \\star ${y}) \\star ${z}$?`;

        const explanation = lang === 'ko'
          ? `**[AMC 8 Prep Vol. 4 Ch.19 복합 정의 연산 기호]**\n\n괄호 안의 연산을 먼저 계산합니다:\n\n$$${x} \\star ${y} = \\frac{${x} \\times ${y}}{${x} + ${y}} = \\frac{72}{18} = ${xyRes}$$\n\n이제 그 결과와 $${z}$의 연산을 계산합니다:\n\n$$(${x} \\star ${y}) \\star ${z} = ${xyRes} \\star ${z} = \\frac{${xyRes} \\times ${z}}{${xyRes} + ${z}} = \\frac{16}{8} = ${ans}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans})** 입니다.`
          : `**[AMC 8 Prep Vol. 4 Ch.19 Special Symbols and Operations]**\n\nFirst evaluate the expression inside the parentheses:\n\n$$${x} \\star ${y} = \\frac{${x} \\times ${y}}{${x} + ${y}} = \\frac{72}{18} = ${xyRes}$$\n\nNow evaluate the outer operation with $${z}$:\n\n$$${xyRes} \\star ${z} = \\frac{${xyRes} \\times ${z}}{${xyRes} + ${z}} = \\frac{16}{8} = ${ans}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

        return { question, choices, correctIdx, explanation };
      }

      // determinant
      const a = randInt(3, 9);
      const b = randInt(2, 7);
      const c = randInt(2, 6);
      const d = randInt(3, 8);
      const ans = a * d - b * c;

      const { choices, correctIdx } = buildChoices(ans, (i) => {
        if (i === 1) return a * d + b * c;
        if (i === 2) return a * b - c * d;
        if (i === 3) return ans + 2;
        return ans - 2;
      });

      const question = lang === 'ko'
        ? `기호 $\\begin{vmatrix} p & q \\\\ r & s \\end{vmatrix}$가 $ps - qr$로 정의될 때, $\\begin{vmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{vmatrix}$의 값은 얼마입니까?`
        : `If the symbol $\\begin{vmatrix} p & q \\\\ r & s \\end{vmatrix}$ is defined as $ps - qr$, what is the value of $\\begin{vmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{vmatrix}$?`;

      const explanation = lang === 'ko'
        ? `**[AMC 8 Prep Vol. 4 Ch.19 행렬식 연산 기호 (Determinant)]**\n\n정의에 따라 대각선 성분의 곱의 차를 계산합니다:\n\n$$\\begin{vmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{vmatrix} = (${a} \\times ${d}) - (${b} \\times ${c}) = ${a * d} - ${b * c} = ${ans}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans})** 입니다.`
        : `**[AMC 8 Prep Vol. 4 Ch.19 Determinant Symbol Definition]**\n\nBy definition, multiply along the main diagonal and subtract the off-diagonal product:\n\n$$\\begin{vmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{vmatrix} = (${a} \\times ${d}) - (${b} \\times ${c}) = ${a * d} - ${b * c} = ${ans}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'common-exponent-fraction') {
      const b = pickRandom([2, 3, 4, 5, 6]);
      const n = randInt(1000, 3000);
      const ansNum = -1;
      const ansDen = b + 1;
      const ansLatex = `-\\frac{1}{${ansDen}}`;

      const { choices, correctIdx } = buildChoices(ansLatex, (i) => {
        if (i === 1) return `\\frac{1}{${ansDen}}`;
        if (i === 2) return `-\\frac{1}{${b - 1}}`;
        if (i === 3) return `-\\frac{${b}}{${ansDen}}`;
        return `-\\frac{1}{${ansDen + (i - 3)}}`;
      });

      const question = lang === 'ko'
        ? `$\\dfrac{${b}^{${n}} - ${b}^{${n + 1}}}{${b}^{${n + 2}} - ${b}^{${n}}}$ 의 값을 구하세요.`
        : `Find the value of $\\dfrac{${b}^{${n}} - ${b}^{${n + 1}}}{${b}^{${n + 2}} - ${b}^{${n}}}$.`;

      const explanation = lang === 'ko'
        ? `**[AMC10 기본서 이론편 Ch 2.1 공통인수로 묶기 (Grouping)]**\n\n분자와 분모에서 공통인수 $${b}^{${n}}$ 을 묶어내면\n\n$$\\frac{${b}^{${n}}(1-${b})}{${b}^{${n}}(${b}^2-1)} = \\frac{1-${b}}{${b}^2-1} = \\frac{-(${b}-1)}{(${b}-1)(${b}+1)} = -\\frac{1}{${b}+1} = ${ansLatex}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]}** 입니다.`
        : `**[AMC10 기본서 이론편 Ch 2.1 Grouping by Common Factor]**\n\nFactoring out the common power $${b}^{${n}}$ from numerator and denominator,\n\n$$\\frac{${b}^{${n}}(1-${b})}{${b}^{${n}}(${b}^2-1)} = \\frac{1-${b}}{${b}^2-1} = \\frac{-(${b}-1)}{(${b}-1)(${b}+1)} = -\\frac{1}{${b}+1} = ${ansLatex}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]}**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'difference-of-squares') {
      const N = randInt(500, 3000);
      const k = pickRandom([1, 2, 3, 4]);
      const M = N - k;
      const ans = k * (N + M);

      const { choices, correctIdx } = buildChoices(ans, (i) => {
        if (i === 1) return N + M;
        if (i === 2) return N * N - M * M - k;
        if (i === 3) return ans + 2 * k;
        return Math.max(1, ans - 2 * k * (i - 3));
      });

      const question = lang === 'ko'
        ? `제곱의 차 공식을 이용하여 $${N}^2 - ${M}^2$ 의 값을 구하세요.`
        : `Use the difference of squares formula to find the value of $${N}^2 - ${M}^2$.`;

      const explanation = lang === 'ko'
        ? `**[AMC10 기본서 이론편 Ch 2.1 곱셈공식 (Special Product): $a^2-b^2=(a+b)(a-b)$]**\n\n$$${N}^2 - ${M}^2 = (${N}+${M})(${N}-${M}) = (${N + M})(${k}) = ${ans}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans})** 입니다.`
        : `**[AMC10 기본서 이론편 Ch 2.1 Special Product: $a^2-b^2=(a+b)(a-b)$]**\n\n$$${N}^2 - ${M}^2 = (${N}+${M})(${N}-${M}) = (${N + M})(${k}) = ${ans}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

      return { question, choices, correctIdx, explanation };
    }

    // substitution-value
    const x = randInt(-6, 6) || 1;
    let y = randInt(-6, 6) || 1;
    while (y === x) y = randInt(-6, 6) || 1;
    const S = x + y;
    const P = x * y;
    const ans = S * S - 2 * P;

    const { choices, correctIdx } = buildChoices(ans, (i) => {
      if (i === 1) return S * S;
      if (i === 2) return S * S - P;
      if (i === 3) return ans + 4;
      return ans - 4 * (i - 3);
    });

    const question = lang === 'ko'
      ? `$x + y = ${S}$, $xy = ${P}$ 일 때, $x^2 + y^2$ 의 값을 구하세요.`
      : `If $x + y = ${S}$ and $xy = ${P}$, find the value of $x^2 + y^2$.`;

    const explanation = lang === 'ko'
      ? `**[AMC10 기본서 이론편 Ch 2.1 대입법과 식의 값]**\n\n$x^2+y^2 = (x+y)^2 - 2xy$ 이므로,\n\n$$x^2+y^2 = ${S}^2 - 2(${P}) = ${S * S} - ${2 * P} = ${ans}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans})** 입니다.`
      : `**[AMC10 기본서 이론편 Ch 2.1 Substitution and Expression Values]**\n\nSince $x^2+y^2 = (x+y)^2 - 2xy$,\n\n$$x^2+y^2 = ${S}^2 - 2(${P}) = ${S * S} - ${2 * P} = ${ans}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // WORK & RATES (The Essential Guide to Algebra 2, Topic 8.6 Word Problems)
  // -----------------------------------------------------------------------
  'work-rate': (lang) => {
    const variant = pickRandom(['together-pipes', 'together-workers', 'worker-leaves']);

    if (variant === 'together-pipes') {
      const isDrain = Math.random() < 0.5;
      if (isDrain) {
        const pairs = [
          [4, 6, 12],
          [6, 10, 15],
          [3, 6, 6],
          [4, 12, 6],
          [6, 8, 24],
          [10, 15, 30],
          [8, 12, 24],
        ];
        const [a, b, ans] = pickRandom(pairs);

        const { choices, correctIdx } = buildChoices(ans, (i) => {
          if (i === 1) return a + b;
          if (i === 2) return b - a;
          if (i === 3) return Math.round((a * b) / (a + b));
          return ans + randInt(2, 8) * (i % 2 === 0 ? 1 : -1);
        });

        const question = lang === 'ko'
          ? `어떤 물통에 수도관 A로는 물을 가득 채우는 데 $${a}$시간이 걸리고, 배수관 B로는 가득 찬 물을 모두 빼내는 데 $${b}$시간이 걸립니다. 빈 물통에 수도관 A와 배수관 B를 동시에 열어둘 때, 물통을 가득 채우는 데 걸리는 시간은 몇 시간입니까?`
          : `Pipe A can fill a tank in $${a}$ hours, while drain pipe B can completely empty the full tank in $${b}$ hours. If both pipes are opened simultaneously when the tank is empty, how many hours will it take to fill the tank completely?`;

        const explanation = lang === 'ko'
          ? `**[The Essential Guide to Algebra 2 Topic 8.6 유리방정식과 작업률 문제]**\n\n물통 전체의 용량을 $1$이라 하면:\n- 수도관 A의 1시간당 유입률: $\\dfrac{1}{${a}}$\n- 배수관 B의 1시간당 배출률: $\\dfrac{1}{${b}}$\n\n두 관을 동시에 열었을 때 1시간당 알짜 유입률은:\n$$\\frac{1}{${a}} - \\frac{1}{${b}} = \\frac{${b} - ${a}}{${a * b}} = \\frac{1}{${ans}}$$\n\n따라서 물통을 가득 채우는 데 걸리는 시간은 $${ans}$시간입니다.\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans})** 입니다.`
          : `**[The Essential Guide to Algebra 2 Topic 8.6 Rational Equations & Work-Rate Problems]**\n\nLet the total volume of the tank be $1$.\n- Rate of Pipe A: $\\dfrac{1}{${a}}$ per hour\n- Rate of Drain B: $\\dfrac{1}{${b}}$ per hour\n\nNet rate when both are open:\n$$\\frac{1}{${a}} - \\frac{1}{${b}} = \\frac{${b} - ${a}}{${a * b}} = \\frac{1}{${ans}}$$\n\nTherefore, it takes $${ans}$ hours to fill the tank completely.\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

        return { question, choices, correctIdx, explanation };
      } else {
        const pairs = [
          [3, 6, 2],
          [4, 12, 3],
          [6, 12, 4],
          [10, 15, 6],
          [12, 24, 8],
          [20, 30, 12],
          [15, 30, 10],
          [5, 20, 4],
        ];
        const [a, b, ans] = pickRandom(pairs);

        const { choices, correctIdx } = buildChoices(ans, (i) => {
          if (i === 1) return Math.round((a + b) / 2);
          if (i === 2) return a + b;
          if (i === 3) return b - a;
          return ans + randInt(2, 6) * (i % 2 === 0 ? 1 : -1);
        });

        const question = lang === 'ko'
          ? `수도관 A만 사용하면 수영장을 채우는 데 $${a}$시간이 걸리고, 수도관 B만 사용하면 $${b}$시간이 걸립니다. 두 수도관을 동시에 사용하여 빈 수영장을 가득 채우는 데 걸리는 시간은 몇 시간입니까?`
          : `Pipe A can fill a pool in $${a}$ hours, and Pipe B can fill it in $${b}$ hours alone. Working together, how many hours will it take to fill the empty pool?`;

        const explanation = lang === 'ko'
          ? `**[The Essential Guide to Algebra 2 Topic 8.6 유리방정식과 작업률 문제]**\n\n수영장 전체의 일의 양을 $1$이라 하면:\n- 수도관 A의 1시간 작업률: $\\dfrac{1}{${a}}$\n- 수도관 B의 1시간 작업률: $\\dfrac{1}{${b}}$\n\n두 수도관의 합산 작업률:\n$$\\frac{1}{${a}} + \\frac{1}{${b}} = \\frac{${b} + ${a}}{${a * b}} = \\frac{1}{${ans}}$$\n\n따라서 수영장을 채우는 데 걸리는 시간은 $${ans}$시간입니다.\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans})** 입니다.`
          : `**[The Essential Guide to Algebra 2 Topic 8.6 Rational Equations & Work-Rate Problems]**\n\nLet the total pool volume be $1$.\n- Rate of Pipe A: $\\dfrac{1}{${a}}$ per hour\n- Rate of Pipe B: $\\dfrac{1}{${b}}$ per hour\n\nCombined rate:\n$$\\frac{1}{${a}} + \\frac{1}{${b}} = \\frac{${b} + ${a}}{${a * b}} = \\frac{1}{${ans}}$$\n\nThus, it takes $${ans}$ hours to fill the pool.\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

        return { question, choices, correctIdx, explanation };
      }
    }

    const pairs = [
      { a: 6, b: 12, tTogether: 4 },
      { a: 10, b: 15, tTogether: 6 },
      { a: 12, b: 24, tTogether: 8 },
      { a: 20, b: 30, tTogether: 12 },
      { a: 4, b: 12, tTogether: 3 },
      { a: 8, b: 24, tTogether: 6 },
    ];
    const item = pickRandom(pairs);
    const { a, b, tTogether } = item;

    if (variant === 'worker-leaves') {
      const dCandidates = [];
      for (let cand = 1; cand < a; cand += 1) {
        const rem = (1 - cand / a) * tTogether;
        if (Number.isInteger(rem) && rem > 0) {
          dCandidates.push({ d: cand, remDays: rem });
        }
      }
      const chosen = dCandidates.length > 0 ? pickRandom(dCandidates) : { d: 2, remDays: Math.round((1 - 2 / a) * tTogether) };
      const { d, remDays } = chosen;

      const { choices, correctIdx } = buildChoices(remDays, (i) => {
        if (i === 1) return tTogether;
        if (i === 2) return a - d;
        if (i === 3) return remDays + d;
        return remDays + randInt(2, 6) * (i % 2 === 0 ? 1 : -1);
      });

      const question = lang === 'ko'
        ? `민호 혼자 하면 $${a}$일, 서연 혼자 하면 $${b}$일이 걸리는 프로젝트가 있습니다. 민호가 먼저 혼자서 $${d}$일 동안 작업한 후, 서연이가 합류하여 두 사람이 함께 작업하여 프로젝트를 완성했습니다. 두 사람이 함께 작업한 기간은 며칠입니까?`
        : `Alice can complete a project alone in $${a}$ days, and Bob can complete it alone in $${b}$ days. Alice works alone for the first $${d}$ days, after which Bob joins her and they work together until the project is finished. How many days did they work together?`;

      const explanation = lang === 'ko'
        ? `**[The Essential Guide to Algebra 2 Topic 8.6 작업률과 분수방정식]**\n\n전체 일의 양을 $1$이라 하면:\n- 민호의 하루 작업률: $\\dfrac{1}{${a}}$, 서연의 하루 작업률: $\\dfrac{1}{${b}}$\n- 민호가 $${d}$일 동안 한 일: $${d} \\times \\dfrac{1}{${a}} = \\dfrac{${d}}{${a}}$\n- 남은 일의 양: $1 - \\dfrac{${d}}{${a}} = \\dfrac{${a - d}}{${a}}$\n\n두 사람이 함께 일할 때의 하루 작업률:\n$$\\frac{1}{${a}} + \\frac{1}{${b}} = \\frac{1}{${tTogether}}$$\n\n남은 일을 두 사람이 함께 끝내는 데 걸린 일수:\n$$\\frac{\\frac{${a - d}}{${a}}}{\\frac{1}{${tTogether}}} = \\frac{${a - d}}{${a}} \\times ${tTogether} = ${remDays}\\text{일}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${remDays})** 입니다.`
        : `**[The Essential Guide to Algebra 2 Topic 8.6 Rational Equations & Work-Rate Problems]**\n\nLet the total work be $1$.\n- Alice's daily rate: $\\dfrac{1}{${a}}$, Bob's daily rate: $\\dfrac{1}{${b}}$\n- Work done by Alice in $${d}$ days: $${d} \\times \\dfrac{1}{${a}} = \\dfrac{${d}}{${a}}$\n- Remaining work: $1 - \\dfrac{${d}}{${a}} = \\dfrac{${a - d}}{${a}}$\n\nCombined daily rate:\n$$\\frac{1}{${a}} + \\frac{1}{${b}} = \\frac{1}{${tTogether}}$$\n\nDays working together to finish the remaining work:\n$$\\frac{\\frac{${a - d}}{${a}}}{\\frac{1}{${tTogether}}} = \\frac{${a - d}}{${a}} \\times ${tTogether} = ${remDays}\\text{ days}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${remDays})**.`;

      return { question, choices, correctIdx, explanation };
    }

    // together-workers
    const ans = tTogether;
    const { choices, correctIdx } = buildChoices(ans, (i) => {
      if (i === 1) return Math.round((a + b) / 2);
      if (i === 2) return a + b;
      if (i === 3) return b - a;
      return ans + randInt(2, 6) * (i % 2 === 0 ? 1 : -1);
    });

    const question = lang === 'ko'
      ? `기계 A는 어떤 작업을 끝내는 데 혼자서 $${a}$시간이 걸리고, 기계 B는 혼자서 $${b}$시간이 걸립니다. 두 기계를 동시에 가동하여 같은 작업을 완료하려면 몇 시간이 걸립니까?`
      : `Machine A can finish a job in $${a}$ hours alone, and Machine B takes $${b}$ hours alone. If both machines work simultaneously, how many hours will they take to complete the job?`;

    const explanation = lang === 'ko'
      ? `**[The Essential Guide to Algebra 2 Topic 8.6 작업률과 분수방정식]**\n\n전체 일의 양을 $1$로 두면, 두 기계의 시간당 작업률의 합은:\n$$\\frac{1}{${a}} + \\frac{1}{${b}} = \\frac{${b} + ${a}}{${a * b}} = \\frac{1}{${ans}}$$\n\n따라서 함께 작업할 때 걸리는 시간은 $${ans}$시간입니다.\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans})** 입니다.`
      : `**[The Essential Guide to Algebra 2 Topic 8.6 Rational Equations & Work-Rate Problems]**\n\nLetting the total work be $1$, the combined rate per hour is:\n$$\\frac{1}{${a}} + \\frac{1}{${b}} = \\frac{${b} + ${a}}{${a * b}} = \\frac{1}{${ans}}$$\n\nThus, together they take $${ans}$ hours.\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // AM-GM INEQUALITY (The Essential Guide to Algebra 2, Topic 10.4)
  // -----------------------------------------------------------------------
  'am-gm-inequality': (lang) => {
    const variant = pickRandom(['min-reciprocal-sum', 'max-product-given-sum', 'shifted-reciprocal']);

    if (variant === 'min-reciprocal-sum') {
      const pairs = [
        [1, 16, 8],
        [1, 25, 10],
        [1, 36, 12],
        [2, 18, 12],
        [2, 32, 16],
        [3, 12, 12],
        [3, 27, 18],
        [4, 9, 12],
        [4, 25, 20],
        [9, 16, 24],
      ];
      const [a, b, minVal] = pickRandom(pairs);
      const aStr = a === 1 ? 'x' : `${a}x`;

      const { choices, correctIdx } = buildChoices(minVal, (i) => {
        if (i === 1) return Math.round(minVal / 2);
        if (i === 2) return minVal + a;
        if (i === 3) return Math.round(Math.sqrt(a * b));
        return minVal + randInt(2, 8) * (i % 2 === 0 ? 1 : -1);
      });

      const question = lang === 'ko'
        ? `양수 $x > 0$에 대하여, $f(x) = ${aStr} + \\dfrac{${b}}{x}$의 최솟값을 구하세요.`
        : `For positive real $x > 0$, find the minimum value of $f(x) = ${aStr} + \\dfrac{${b}}{x}$.`;

      const explanation = lang === 'ko'
        ? `**[The Essential Guide to Algebra 2 Topic 10.4 산술·기하평균 부등식 (AM-GM Inequality)]**\n\n$${aStr} > 0$이고 $\\dfrac{${b}}{x} > 0$이므로, 산술-기하평균 부등식($\\dfrac{A+B}{2} \\ge \\sqrt{AB}$)에 의해:\n\n$$${aStr} + \\frac{${b}}{x} \\ge 2\\sqrt{(${aStr})\\left(\\frac{${b}}{x}\\right)} = 2\\sqrt{${a * b}} = 2(${Math.round(minVal / 2)}) = ${minVal}$$\n\n등호는 $${aStr} = \\dfrac{${b}}{x} \\iff x^2 = \\dfrac{${b}}{${a}}$일 때 성립합니다. 따라서 최솟값은 $${minVal}$입니다.\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${minVal})** 입니다.`
        : `**[The Essential Guide to Algebra 2 Topic 10.4 AM-GM Inequality]**\n\nSince $${aStr} > 0$ and $\\dfrac{${b}}{x} > 0$, by the AM-GM Inequality ($\\dfrac{A+B}{2} \\ge \\sqrt{AB}$):\n\n$$${aStr} + \\frac{${b}}{x} \\ge 2\\sqrt{(${aStr})\\left(\\frac{${b}}{x}\\right)} = 2\\sqrt{${a * b}} = 2(${Math.round(minVal / 2)}) = ${minVal}$$\n\nEquality holds when $${aStr} = \\dfrac{${b}}{x} \\iff x^2 = \\dfrac{${b}}{${a}}$. Thus, the minimum value is $${minVal}$.\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${minVal})**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'max-product-given-sum') {
      const halfS = randInt(4, 15);
      const S = 2 * halfS;
      const maxProd = halfS * halfS;

      const { choices, correctIdx } = buildChoices(maxProd, (i) => {
        if (i === 1) return (halfS - 1) * (halfS + 1);
        if (i === 2) return S * 2;
        if (i === 3) return maxProd - 4;
        return maxProd + randInt(2, 10) * (i % 2 === 0 ? 1 : -1);
      });

      const question = lang === 'ko'
        ? `두 양의 실수 $x, y$가 $x + y = ${S}$를 만족할 때, 곱 $xy$의 최댓값을 구하세요.`
        : `If $x$ and $y$ are positive real numbers such that $x + y = ${S}$, find the maximum value of $xy$.`;

      const explanation = lang === 'ko'
        ? `**[The Essential Guide to Algebra 2 Topic 10.4 산술·기하평균 부등식 (AM-GM Inequality)]**\n\n산술-기하평균 부등식에 의해:\n$$\\sqrt{xy} \\le \\frac{x+y}{2} = \\frac{${S}}{2} = ${halfS}$$\n\n양변을 제곱하면:\n$$xy \\le (${halfS})^2 = ${maxProd}$$\n\n등호는 $x = y = ${halfS}$일 때 성립하므로, $xy$의 최댓값은 $${maxProd}$입니다.\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${maxProd})** 입니다.`
        : `**[The Essential Guide to Algebra 2 Topic 10.4 AM-GM Inequality]**\n\nBy the AM-GM Inequality:\n$$\\sqrt{xy} \\le \\frac{x+y}{2} = \\frac{${S}}{2} = ${halfS}$$\n\nSquaring both sides:\n$$xy \\le (${halfS})^2 = ${maxProd}$$\n\nEquality holds when $x = y = ${halfS}$. Thus, the maximum value of $xy$ is $${maxProd}$.\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${maxProd})**.`;

      return { question, choices, correctIdx, explanation };
    }

    const c = randInt(1, 5);
    const k = pickRandom([4, 9, 16, 25, 36]);
    const sqrtK = Math.round(Math.sqrt(k));
    const ans = 2 * sqrtK - c;

    const { choices, correctIdx } = buildChoices(ans, (i) => {
      if (i === 1) return 2 * sqrtK;
      if (i === 2) return 2 * sqrtK + c;
      if (i === 3) return ans + 2;
      return ans + randInt(2, 6) * (i % 2 === 0 ? 1 : -1);
    });

    const question = lang === 'ko'
      ? `$x > -${c}$인 실수 $x$에 대하여, $x + \\dfrac{${k}}{x + ${c}}$의 최솟값을 구하세요.`
      : `For real $x > -${c}$, find the minimum value of $x + \\dfrac{${k}}{x + ${c}}$.`;

    const explanation = lang === 'ko'
      ? `**[The Essential Guide to Algebra 2 Topic 10.4 산술·기하평균 부등식의 치환]**\n\n식에 $${c}$를 더하고 빼서 분모와 형태를 맞춥니다:\n$$x + \\frac{${k}}{x+${c}} = (x+${c}) + \\frac{${k}}{x+${c}} - ${c}$$\n\n$x > -${c}$이므로 $x+${c} > 0$입니다. 산술-기하평균 부등식을 적용하면:\n$$(x+${c}) + \\frac{${k}}{x+${c}} \\ge 2\\sqrt{(x+${c})\\cdot\\frac{${k}}{x+${c}}} = 2\\sqrt{${k}} = ${2 * sqrtK}$$\n\n따라서 최솟값은:\n$$${2 * sqrtK} - ${c} = ${ans}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans})** 입니다.`
      : `**[The Essential Guide to Algebra 2 Topic 10.4 AM-GM Inequality with Substitution]**\n\nAdd and subtract $${c}$ to match the denominator:\n$$x + \\frac{${k}}{x+${c}} = (x+${c}) + \\frac{${k}}{x+${c}} - ${c}$$\n\nSince $x > -${c}$, $x+${c} > 0$. Applying the AM-GM inequality:\n$$(x+${c}) + \\frac{${k}}{x+${c}} \\ge 2\\sqrt{(x+${c})\\cdot\\frac{${k}}{x+${c}}} = 2\\sqrt{${k}} = ${2 * sqrtK}$$\n\nSubtracting $${c}$ gives the minimum value:\n$$${2 * sqrtK} - ${c} = ${ans}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // RADICAL EQUATIONS & EXTRANEOUS ROOTS (The Essential Guide to Algebra 2, Topic 7.4)
  // -----------------------------------------------------------------------
  'radical-equations': (lang) => {
    const variant = pickRandom(['extraneous-root-detection', 'single-radical-solve']);

    if (variant === 'extraneous-root-detection') {
      const cases = [
        { a: 2, b: 15, validRoot: 5, extraRoot: -3 },
        { a: 3, b: 10, validRoot: 5, extraRoot: -2 },
        { a: 4, b: 21, validRoot: 7, extraRoot: -3 },
        { a: 1, b: 12, validRoot: 4, extraRoot: -3 },
        { a: 2, b: 8,  validRoot: 4, extraRoot: -2 },
        { a: 5, b: 14, validRoot: 7, extraRoot: -2 },
      ];
      const item = pickRandom(cases);
      const { a, b, validRoot, extraRoot } = item;
      const aTerm = a === 1 ? 'x' : `${a}x`;

      const askExtraneous = Math.random() < 0.5;
      const ans = askExtraneous ? extraRoot : validRoot;

      const { choices, correctIdx } = buildChoices(ans, (i) => {
        if (i === 1) return askExtraneous ? validRoot : extraRoot;
        if (i === 2) return validRoot + extraRoot;
        if (i === 3) return -ans;
        return ans + randInt(2, 6) * (i % 2 === 0 ? 1 : -1);
      });

      const question = lang === 'ko'
        ? (askExtraneous
            ? `방정식 $\\sqrt{${aTerm} + ${b}} = x$의 양변을 제곱하여 얻은 이차방정식의 해 중, 원래 방정식을 만족하지 않는 **무연근(extraneous root)**은 얼마입니까?`
            : `무리방정식 $\\sqrt{${aTerm} + ${b}} = x$의 실수 해 $x$의 값을 구하세요.`)
        : (askExtraneous
            ? `When solving $\\sqrt{${aTerm} + ${b}} = x$ by squaring both sides, which solution of the resulting quadratic is an **extraneous root**?`
            : `Find the real solution $x$ to the radical equation $\\sqrt{${aTerm} + ${b}} = x$.`);

      const explanation = lang === 'ko'
        ? `**[The Essential Guide to Algebra 2 Topic 7.4 무리방정식과 무연근]**\n\n양변을 제곱하면:\n$$${aTerm} + ${b} = x^2 \\implies x^2 - ${a}x - ${b} = 0$$\n\n인수분해하면 $(x - ${validRoot})(x - (${extraRoot})) = 0$이므로 $x = ${validRoot}$ 또는 $x = ${extraRoot}$입니다.\n\n- $x = ${validRoot}$ 대입: $\\sqrt{${a}(${validRoot}) + ${b}} = \\sqrt{${validRoot * validRoot}} = ${validRoot}$ (참)\n- $x = ${extraRoot}$ 대입: 좌변 $\\sqrt{${a}(${extraRoot}) + ${b}} = \\sqrt{${extraRoot * extraRoot}} = ${Math.abs(extraRoot)}$, 우변 $x = ${extraRoot}$. 좌변 $\\ne$ 우변이므로 **$x = ${extraRoot}$는 무연근**입니다.\n\n따라서 구하는 답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans})** 입니다.`
        : `**[The Essential Guide to Algebra 2 Topic 7.4 Radical Equations & Extraneous Roots]**\n\nSquaring both sides:\n$$${aTerm} + ${b} = x^2 \\implies x^2 - ${a}x - ${b} = 0$$\n\nFactoring gives $(x - ${validRoot})(x - (${extraRoot})) = 0$, so $x = ${validRoot}$ or $x = ${extraRoot}$.\n\n- For $x = ${validRoot}$: $\\sqrt{${a}(${validRoot}) + ${b}} = ${validRoot}$ (Valid)\n- For $x = ${extraRoot}$: LHS $= \\sqrt{${a}(${extraRoot}) + ${b}} = ${Math.abs(extraRoot)}$, while RHS $= ${extraRoot}$. Since LHS $\\ne$ RHS, **$x = ${extraRoot}$ is an extraneous root**.\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

      return { question, choices, correctIdx, explanation };
    }

    const cases2 = [
      { p: 7, q: 7, xVal: 9 },
      { p: 5, q: 5, xVal: 4 },
      { p: 9, q: 9, xVal: 16 },
      { p: 8, q: 4, xVal: 1 },
      { p: 15, q: 5, xVal: 1 },
      { p: 16, q: 8, xVal: 1 },
      { p: 21, q: 7, xVal: 4 },
    ];
    const item2 = pickRandom(cases2);
    const { p, q, xVal } = item2;

    const { choices, correctIdx } = buildChoices(xVal, (i) => {
      if (i === 1) return xVal + p;
      if (i === 2) return Math.round(xVal / 2) || 2;
      if (i === 3) return q * q;
      return xVal + randInt(2, 8) * (i % 2 === 0 ? 1 : -1);
    });

    const question = lang === 'ko'
      ? `방정식 $\\sqrt{x + ${p}} + \\sqrt{x} = ${q}$을 만족하는 실수 $x$의 값을 구하세요.`
      : `Solve the equation $\\sqrt{x + ${p}} + \\sqrt{x} = ${q}$ for real $x$.`;

    const explanation = lang === 'ko'
      ? `**[The Essential Guide to Algebra 2 Topic 7.4 무리방정식 풀이]**\n\n$\\sqrt{x}$를 우변으로 이항하여 정리합니다:\n$$\\sqrt{x + ${p}} = ${q} - \\sqrt{x}$$\n\n양변을 제곱하면:\n$$x + ${p} = ${q * q} - ${2 * q}\\sqrt{x} + x$$\n\n양변에서 $x$를 소거하고 정리하면:\n$${2 * q}\\sqrt{x} = ${q * q - p} \\implies \\sqrt{x} = ${Math.round((q * q - p) / (2 * q))}$$\n\n양변을 다시 제곱하면 $x = ${xVal}$입니다.\n\n검산: $\\sqrt{${xVal + p}} + \\sqrt{${xVal}} = ${Math.round(Math.sqrt(xVal + p))} + ${Math.round(Math.sqrt(xVal))} = ${q}$ (성립)\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${xVal})** 입니다.`
      : `**[The Essential Guide to Algebra 2 Topic 7.4 Solving Radical Equations]**\n\nIsolate $\\sqrt{x + ${p}}$:\n$$\\sqrt{x + ${p}} = ${q} - \\sqrt{x}$$\n\nSquaring both sides:\n$$x + ${p} = ${q * q} - ${2 * q}\\sqrt{x} + x$$\n\nCancelling $x$ and solving for $\\sqrt{x}$:\n$${2 * q}\\sqrt{x} = ${q * q - p} \\implies \\sqrt{x} = ${Math.round((q * q - p) / (2 * q))}$$\n\nSquaring again gives $x = ${xVal}$.\n\nCheck: $\\sqrt{${xVal + p}} + \\sqrt{${xVal}} = ${q}$ (Valid).\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${xVal})**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // ABSOLUTE VALUE GRAPHS & REGIONS (The Essential Guide to Algebra 2, Topic 1.7 & 2.6)
  // -----------------------------------------------------------------------
  'absolute-value-graphs': (lang) => {
    const variant = pickRandom(['diamond-area', 'scaled-diamond-area', 'min-sum-abs']);

    if (variant === 'diamond-area') {
      const c = randInt(3, 10);
      const h = randInt(-5, 5);
      const k = randInt(-5, 5);
      const area = 2 * c * c;

      const { choices, correctIdx } = buildChoices(area, (i) => {
        if (i === 1) return c * c;
        if (i === 2) return 4 * c * c;
        if (i === 3) return Math.round(Math.PI * c * c);
        return area + randInt(4, 20) * (i % 2 === 0 ? 1 : -1);
      });

      const hPart = h === 0 ? '|x|' : (h > 0 ? `|x - ${h}|` : `|x + ${Math.abs(h)}|`);
      const kPart = k === 0 ? '|y|' : (k > 0 ? `|y - ${k}|` : `|y + ${Math.abs(k)}|`);

      const question = lang === 'ko'
        ? `좌표평면에서 부등식 $${hPart} + ${kPart} \\le ${c}$를 만족하는 영역의 넓이를 구하세요.`
        : `Find the area of the region in the coordinate plane defined by the inequality $${hPart} + ${kPart} \\le ${c}$.`;

      const explanation = lang === 'ko'
        ? `**[The Essential Guide to Algebra 2 Topic 1.7 & 2.6 절댓값 함수와 마름모 영역]**\n\n$|x - h| + |y - k| \\le c$가 나타내는 영역은 점 $(${h}, ${k})$를 중심으로 하고, 대각선의 길이가 $2c$인 정사각형(마름모)입니다.\n\n대각선의 길이가 각각 $2(${c}) = ${2 * c}$이므로, 마름모의 넓이는:\n$$\\text{Area} = \\frac{1}{2} \\times d_1 \\times d_2 = \\frac{1}{2} \\times ${2 * c} \\times ${2 * c} = 2(${c}^2) = ${area}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${area})** 입니다.`
        : `**[The Essential Guide to Algebra 2 Topic 1.7 & 2.6 Absolute Value Equations & Diamond Regions]**\n\nThe inequality $|x - h| + |y - k| \\le c$ represents a square (rhombus) centered at $(${h}, ${k})$ with horizontal and vertical diagonals of length $2c$.\n\nThe area is:\n$$\\text{Area} = \\frac{1}{2} d_1 d_2 = \\frac{1}{2} (2c)(2c) = 2c^2 = 2(${c}^2) = ${area}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${area})**.`;

      return { question, choices, correctIdx, explanation };
    }

    if (variant === 'scaled-diamond-area') {
      const pairs = [
        { a: 2, b: 3, K: 6, area: 12 },
        { a: 2, b: 5, K: 10, area: 20 },
        { a: 3, b: 4, K: 12, area: 24 },
        { a: 1, b: 2, K: 6, area: 36 },
        { a: 3, b: 5, K: 15, area: 30 },
      ];
      const item = pickRandom(pairs);
      const { a, b, K, area } = item;
      const aStr = a === 1 ? '|x|' : `|${a}x|`;
      const bStr = b === 1 ? '|y|' : `|${b}y|`;

      const { choices, correctIdx } = buildChoices(area, (i) => {
        if (i === 1) return area / 2;
        if (i === 2) return area * 2;
        if (i === 3) return K * K;
        return area + randInt(4, 16) * (i % 2 === 0 ? 1 : -1);
      });

      const question = lang === 'ko'
        ? `좌표평면에서 $${aStr} + ${bStr} \\le ${K}$가 둘러싸는 영역의 넓이를 구하세요.`
        : `Find the area of the region bounded by $${aStr} + ${bStr} \\le ${K}$ in the coordinate plane.`;

      const xIntercept = K / a;
      const yIntercept = K / b;

      const explanation = lang === 'ko'
        ? `**[The Essential Guide to Algebra 2 Topic 1.7 & 2.6 절댓값 함수 그래프]**\n\n영역의 경계는 네 개의 사분면에서 절편을 꼭짓점으로 갖는 마름모입니다:\n- $x$절편: $(\\pm ${xIntercept}, 0)$\n- $y$절편: $(0, \\pm ${yIntercept})$\n\n두 대각선의 길이는 $2(${xIntercept}) = ${2 * xIntercept}$와 $2(${yIntercept}) = ${2 * yIntercept}$입니다.\n$$\\text{Area} = \\frac{1}{2} \\times ${2 * xIntercept} \\times ${2 * yIntercept} = 2 \\times ${xIntercept} \\times ${yIntercept} = ${area}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${area})** 입니다.`
        : `**[The Essential Guide to Algebra 2 Topic 1.7 & 2.6 Absolute Value Graphs]**\n\nThe boundary forms a rhombus with intercepts as vertices:\n- $x$-intercepts: $(\\pm ${xIntercept}, 0)$\n- $y$-intercepts: $(0, \\pm ${yIntercept})$\n\nThe diagonal lengths are $2(${xIntercept}) = ${2 * xIntercept}$ and $2(${yIntercept}) = ${2 * yIntercept}$.\n$$\\text{Area} = \\frac{1}{2} \\times ${2 * xIntercept} \\times ${2 * yIntercept} = 2 \\times ${xIntercept} \\times ${yIntercept} = ${area}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${area})**.`;

      return { question, choices, correctIdx, explanation };
    }

    // min-sum-abs
    const a = randInt(1, 4);
    const b = a + randInt(2, 5);
    const c = b + randInt(2, 5);
    const minVal = c - a;

    const { choices, correctIdx } = buildChoices(minVal, (i) => {
      if (i === 1) return c - b;
      if (i === 2) return b - a;
      if (i === 3) return (c - a) * 2;
      return minVal + randInt(2, 6) * (i % 2 === 0 ? 1 : -1);
    });

    const question = lang === 'ko'
      ? `함수 $f(x) = |x - ${a}| + |x - ${b}| + |x - ${c}|$의 최솟값을 구하세요.`
      : `Find the minimum value of $f(x) = |x - ${a}| + |x - ${b}| + |x - ${c}|$.`;

    const explanation = lang === 'ko'
      ? `**[The Essential Guide to Algebra 2 Topic 1.7 & 2.6 절댓값 함수의 최솟값과 중앙값]**\n\n홀수 개의 절댓값의 합 $|x-a_1| + |x-a_2| + \\cdots + |x-a_n|$의 최솟값은 $x$가 중앙값(median)일 때 발생합니다.\n\n주어진 수 $${a} < ${b} < ${c}$의 중앙값은 $x = ${b}$입니다:\n$$f(${b}) = |${b} - ${a}| + |${b} - ${b}| + |${b} - ${c}| = (${b - a}) + 0 + (${c - b}) = ${c} - ${a} = ${minVal}$$\n\n따라서 최솟값은 $${minVal}$입니다.\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${minVal})** 입니다.`
      : `**[The Essential Guide to Algebra 2 Topic 1.7 & 2.6 Absolute Value Functions & Median Optimization]**\n\nThe sum of an odd number of absolute values $|x-a_1| + \\cdots + |x-a_n|$ is minimized at the median.\n\nFor $${a} < ${b} < ${c}$, the median is $x = ${b}$:\n$$f(${b}) = |${b} - ${a}| + |${b} - ${b}| + |${b} - ${c}| = (${b - a}) + 0 + (${c - b}) = ${c} - ${a} = ${minVal}$$\n\nThus, the minimum value is $${minVal}$.\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${minVal})**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // CHARTS & DATA ANALYSIS (AMC 8 / Pre-Algebra)
  // -----------------------------------------------------------------------
  'charts-data-analysis': (lang) => {
    const variant = pickRandom(['pie-chart-count', 'bar-chart-percent']);

    if (variant === 'pie-chart-count') {
      const N = pickRandom([120, 240, 360, 480, 600, 720]);
      const angle = pickRandom([30, 45, 60, 90, 120, 135, 150]);
      const count = (N * angle) / 360;

      const { choices, correctIdx } = buildChoices(count, (i) => {
        if (i === 1) return angle;
        if (i === 2) return Math.round((N * (angle + 30)) / 360);
        if (i === 3) return Math.round(count / 2);
        return count + randInt(3, 15) * (i % 2 === 0 ? 1 : -1);
      });

      const question = lang === 'ko'
        ? `전체 학생 $${N}$명을 대상으로 가장 좋아하는 운동을 조사하여 원그래프로 나타냈습니다. 축구를 선택한 학생 부분의 중심각의 크기가 $${angle}^\\circ$일 때, 축구를 선택한 학생은 모두 몇 명입니까?`
        : `A circle graph (pie chart) shows the favorite sport of all $${N}$ students in a school. If the central angle for soccer is $${angle}^\\circ$, how many students chose soccer?`;

      const explanation = lang === 'ko'
        ? `**[AMC 8 통계와 자료 해석: 원그래프]**\n\n원 전체의 중심각은 $360^\\circ$입니다. 따라서 축구를 선택한 학생의 비율은 $\\dfrac{${angle}^\\circ}{360^\\circ}$입니다:\n\n$$\\text{학생 수} = ${N} \\times \\frac{${angle}}{360} = ${count}\\text{명}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${count})** 입니다.`
        : `**[AMC 8 Statistics & Data Analysis: Circle Graph]**\n\nA full circle has $360^\\circ$. The fraction of students who chose soccer is $\\dfrac{${angle}^\\circ}{360^\\circ}$:\n\n$$\\text{Students} = ${N} \\times \\frac{${angle}}{360} = ${count}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${count})**.`;

      return { question, choices, correctIdx, explanation };
    }

    const f1 = randInt(4, 8);
    const f2 = randInt(6, 12);
    const f3 = randInt(8, 15);
    const f4 = randInt(5, 10);
    const total = f1 + f2 + f3 + f4;
    const targetCount = f3 + f4;

    const { choices, correctIdx } = buildChoices(targetCount, (i) => {
      if (i === 1) return f3;
      if (i === 2) return f1 + f2;
      if (i === 3) return total;
      return targetCount + randInt(2, 6) * (i % 2 === 0 ? 1 : -1);
    });

    const question = lang === 'ko'
      ? `어느 학급의 수학 쪽지시험 점수별 학생 수가 다음과 같습니다:\n- 60점: $${f1}$명\n- 70점: $${f2}$명\n- 80점: $${f3}$명\n- 90점: $${f4}$명\n\n80점 이상을 받은 학생은 모두 몇 명입니까?`
      : `The table shows the number of students who received each score on a quiz:\n- 60 points: $${f1}$ students\n- 70 points: $${f2}$ students\n- 80 points: $${f3}$ students\n- 90 points: $${f4}$ students\n\nHow many students scored at least 80 points?`;

    const explanation = lang === 'ko'
      ? `**[AMC 8 통계와 자료 해석: 도수분포표]**\n\n80점 이상을 받은 학생은 80점 학생 수와 90점 학생 수의 합입니다:\n\n$$${f3} + ${f4} = ${targetCount}\\text{명}$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${targetCount})** 입니다.`
      : `**[AMC 8 Statistics & Data Analysis: Frequency Table]**\n\nThe number of students scoring at least 80 is the sum of students scoring 80 and 90:\n\n$$${f3} + ${f4} = ${targetCount}$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${targetCount})**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // CLOCKS & CALENDARS (AMC 8 / Pre-Algebra)
  // -----------------------------------------------------------------------
  'clocks-calendars': (lang) => {
    const variant = pickRandom(['clock-angle', 'calendar-day']);

    if (variant === 'clock-angle') {
      const times = [
        { h: 3, m: 0, angle: 90 },
        { h: 3, m: 30, angle: 75 },
        { h: 2, m: 20, angle: 50 },
        { h: 4, m: 40, angle: 100 },
        { h: 8, m: 20, angle: 130 },
        { h: 9, m: 30, angle: 105 },
        { h: 1, m: 30, angle: 135 },
        { h: 5, m: 10, angle: 95 },
        { h: 7, m: 20, angle: 100 },
      ];
      const item = pickRandom(times);
      const { h, m, angle } = item;
      const mStr = m < 10 ? `0${m}` : `${m}`;
      const ans = `${angle}^\\circ`;

      const { choices, correctIdx } = buildChoices(ans, (i) => {
        if (i === 1) return `${180 - angle}^\\circ`;
        if (i === 2) return `${angle + 15}^\\circ`;
        if (i === 3) return `${angle - 15}^\\circ`;
        return `${angle + 5 * i}^\\circ`;
      });

      const question = lang === 'ko'
        ? `$${h}$시 $${mStr}$분에 시계의 시침과 분침이 이루는 작은 쪽의 각도는 몇 도입니까?`
        : `At $${h}:${mStr}$, what is the measure of the smaller angle between the hour hand and the minute hand of a clock?`;

      const hourAngle = 30 * h + 0.5 * m;
      const minAngle = 6 * m;

      const explanation = lang === 'ko'
        ? `**[AMC 8 시계와 각도 문제]**\n\n12시를 기준으로 한 각도:\n- 분침: $1$분에 $6^\\circ$씩 회전하므로 $${m}\\text{분} \\times 6^\\circ = ${minAngle}^\\circ$\n- 시침: $1$시간에 $30^\\circ$, $1$분에 $0.5^\\circ$씩 회전하므로 $30^\\circ \\times ${h} + 0.5^\\circ \\times ${m} = ${hourAngle}^\\circ$\n\n두 침이 이루는 각도:\n$$|${hourAngle}^\\circ - ${minAngle}^\\circ| = ${Math.abs(hourAngle - minAngle)}^\\circ$$\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans})** 입니다.`
        : `**[AMC 8 Clock Hands & Angles]**\n\nMeasured from the 12 o'clock position:\n- Minute hand moves $6^\\circ$ per minute: $${m} \\times 6^\\circ = ${minAngle}^\\circ$\n- Hour hand moves $30^\\circ$ per hour plus $0.5^\\circ$ per minute: $30^\\circ \\times ${h} + 0.5^\\circ \\times ${m} = ${hourAngle}^\\circ$\n\nThe angle between them is:\n$$|${hourAngle}^\\circ - ${minAngle}^\\circ| = ${angle}^\\circ$$\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

      return { question, choices, correctIdx, explanation };
    }

    const daysKo = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];
    const daysEn = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const startIdx = randInt(0, 6);
    const N = randInt(50, 200);
    const endIdx = (startIdx + N) % 7;

    const ansKo = daysKo[endIdx];
    const ansEn = daysEn[endIdx];
    const ans = lang === 'ko' ? ansKo : ansEn;

    const { choices, correctIdx } = buildChoices(ans, (i) => {
      const idx = (endIdx + i) % 7;
      return lang === 'ko' ? daysKo[idx] : daysEn[idx];
    });

    const question = lang === 'ko'
      ? `오늘이 **${daysKo[startIdx]}**일 때, 오늘로부터 $${N}$일 뒤는 무슨 요일입니까?`
      : `If today is **${daysEn[startIdx]}**, what day of the week will it be in $${N}$ days?`;

    const remainder = N % 7;
    const quotient = Math.floor(N / 7);

    const explanation = lang === 'ko'
      ? `**[AMC 8 달력과 모듈러 연산]**\n\n요일은 7일마다 반복됩니다:\n$$${N} = 7 \\times ${quotient} + ${remainder}$$\n\n따라서 $${N}$일 뒤의 요일은 ${daysKo[startIdx]}로부터 $${remainder}$일 뒤의 요일과 같습니다:\n$${remainder}$일 뒤는 **${ansKo}**입니다.\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ansKo})** 입니다.`
      : `**[AMC 8 Calendars & Modular Arithmetic]**\n\nThe days of the week repeat every 7 days:\n$$${N} = 7 \\times ${quotient} + ${remainder}$$\n\nThus, $${N}$ days from ${daysEn[startIdx]} is the same day of the week as $${remainder}$ days from ${daysEn[startIdx]}, which is **${ansEn}**.\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ansEn})**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // GAMES & STRATEGY (AMC 8 Preparation, Vol 1 Ch 3)
  // -----------------------------------------------------------------------
  'games-strategy': (lang) => {
    const k = pickRandom([3, 4, 5]);
    const rem = randInt(1, k);
    const m = randInt(3, 8);
    const N = m * (k + 1) + rem;
    const ans = rem;

    const { choices, correctIdx } = buildChoices(ans, (i) => {
      if (i === 1) return 1;
      if (i === 2) return k;
      if (i === 3) return (k + 1) - rem;
      return (ans + i) % (k + 1) || 1;
    });

    const question = lang === 'ko'
      ? `두 사람이 $${N}$개의 바둑돌을 가지고 게임을 합니다. 두 사람은 번갈아 가며 한 번에 $1$개 이상 $${k}$개 이하의 돌을 가져갈 수 있으며, 마지막 남은 돌을 가져가는 사람이 승리합니다. 선공(첫 번째 플레이어)이 반드시 승리하기 위해 첫 턴에 가져가야 하는 돌의 개수는 몇 개입니까?`
      : `Two players play a game with a pile of $${N}$ stones. On each turn, a player may take anywhere from $1$ to $${k}$ stones. The player who takes the last stone wins. To guarantee a win, how many stones must the first player take on their very first move?`;

    const explanation = lang === 'ko'
      ? `**[AMC 8 게임과 필승 전략: 님(Nim) 게임과 나머지]**\n\n두 플레이어가 한 라운드에 합쳐서 $${k + 1}$개의 돌을 가져갈 수 있습니다 (상대가 $x$개를 가져가면, 나는 $${k + 1} - x$개를 가져감).\n\n따라서 전체 돌의 개수를 $${k + 1}$로 나눈 나머지를 선공이 먼저 가져가면 필승 위치를 확보할 수 있습니다:\n$$${N} = ${m} \\times (${k + 1}) + ${rem}$$\n\n선공이 첫 번째 턴에 $${rem}$개의 돌을 가져가면, 남은 돌의 개수는 $${m} \\times ${k + 1} = ${m * (k + 1)}$개가 되어 이후 매 턴마다 합이 $${k + 1}$이 되도록 돌을 가져가 항상 마지막 돌을 가져갈 수 있습니다.\n\n정답은 **${['①', '②', '③', '④', '⑤'][correctIdx]} (${ans})** 입니다.`
      : `**[AMC 8 Winning Strategies: Nim & Modulo Invariants]**\n\nA pair of turns can always sum to $${k + 1}$ stones (if the opponent takes $x$, you take $${k + 1} - x$).\n\nDividing $${N}$ by $${k + 1}$ gives:\n$$${N} = ${m} \\times (${k + 1}) + ${rem}$$\n\nBy taking $${rem}$ stones on the first move, the first player leaves $${m * (k + 1)}$ stones (a multiple of $${k + 1}$). For every subsequent move of $x$ stones by the second player, the first player responds by taking $${k + 1} - x$ stones, guaranteeing the last stone.\n\nThe correct choice is **${['A', 'B', 'C', 'D', 'E'][correctIdx]} (${ans})**.`;

    return { question, choices, correctIdx, explanation };
  },
};

/**
 * Fallback generator for units that do not have a dedicated generator above.
 * Maps back to the subject's primary generator or builds a contextual problem.
 */
export function getGeneratorForUnit(unitId) {
  if (GENERATORS[unitId]) return GENERATORS[unitId];

  // Specific mappings for AMC fine units
  if (unitId.includes('work')) return GENERATORS['work-rate'];
  if (unitId.includes('am-gm')) return GENERATORS['am-gm-inequality'];
  if (unitId.includes('radical')) return GENERATORS['radical-equations'];
  if (unitId.includes('absolute-value')) return GENERATORS['absolute-value-graphs'];
  if (unitId.includes('quadratic-inequal')) return GENERATORS['quadratic-inequalities'];
  if (unitId.includes('diophantine') || unitId.includes('sfft')) return GENERATORS['diophantine-equations'];
  if (unitId.includes('clock') || unitId.includes('calendar')) return GENERATORS['clocks-calendars'];
  if (unitId.includes('game') || unitId.includes('strategy')) return GENERATORS['games-strategy'];
  if (unitId.includes('chart') || unitId.includes('data-analysis')) return GENERATORS['charts-data-analysis'];
  if (unitId.includes('symmetry') || unitId.includes('transform')) return GENERATORS['symmetry-transformations'];
  if (unitId.includes('equation') || unitId.includes('inequal') || unitId.includes('consecutive')) return GENERATORS['equations-inequalities'];
  if (unitId.includes('venn') || unitId.includes('set')) return GENERATORS['venn-sets'];
  if (unitId.includes('path') || unitId.includes('routing')) return GENERATORS['paths-grids'];
  if (unitId.includes('arrangement')) return GENERATORS['permutations-arrangements'];
  if (unitId.includes('triangle') || unitId.includes('angle')) return GENERATORS['triangles'];
  if (unitId.includes('circle') || unitId.includes('quadrilateral') || unitId.includes('solid')) return GENERATORS['area-perimeter'];
  if (unitId.includes('coordinate') || unitId.includes('grid')) return GENERATORS['coordinate-geometry'];
  if (unitId.includes('digit') || unitId.includes('base')) return GENERATORS['units-digit-cycles'];
  if (unitId.includes('sequence') || unitId.includes('pattern')) return GENERATORS['sequences-patterns'];
  if (unitId.includes('logic')) return GENERATORS['logical-reasoning'];
  if (unitId.includes('crypt') || unitId.includes('puzzle')) return GENERATORS['cryptarithms-puzzles'];
  if (unitId.includes('arithmetic') || unitId.includes('fraction') || unitId.includes('decimal') || unitId.includes('expression')) return GENERATORS['arithmetic-operations'];
  if (unitId.includes('prime') || unitId.includes('divisor') || unitId.includes('gcd')) return GENERATORS['primes-factorization'];
  if (unitId.includes('remainder') || unitId.includes('divisib')) return GENERATORS['remainders-divisibility'];
  if (unitId.includes('percent') || unitId.includes('money') || unitId.includes('interest')) return GENERATORS['percentages-money'];
  if (unitId.includes('ratio')) return GENERATORS['ratios-percent'];
  if (unitId.includes('speed') || unitId.includes('distance')) return GENERATORS['speed-distance-time'];
  if (unitId.includes('count') || unitId.includes('permutation') || unitId.includes('combination')) return GENERATORS['permutations-combinations'];
  if (unitId.includes('prob') || unitId.includes('dice') || unitId.includes('card')) return GENERATORS['probability'];
  if (unitId.includes('stat') || unitId.includes('average') || unitId.includes('mean')) return GENERATORS['statistics-averages'];

  // Default fallback: area-perimeter
  return GENERATORS['area-perimeter'];
}

/**
 * Main function to generate an interactive problem object for InteractiveProblemCard
 */
export function generateAmcVariantProblem(unit, language = 'en') {
  const unitId = typeof unit === 'string' ? unit : unit.id;
  const unitLabel = typeof unit === 'string' ? unit : (unit.labelEn || unit.label);
  const generator = getGeneratorForUnit(unitId);
  const result = generator(language);

  return {
    id: `gen-variant-${unitId}-${Date.now()}-${randInt(100, 999)}`,
    number: 'Variant',
    points: 1,
    type: 'multiple_choice',
    question: result.question,
    choices: result.choices,
    correctAnswer: result.correctIdx,
    explanation: result.explanation,
    unit: unitLabel,
    unitId,
    isGeneratedVariant: true,
  };
}
