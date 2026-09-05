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
    const variant = pickRandom(['four-rectangles', 'cut-corner-perimeter', 'shaded-ring']);
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
  // 2. TRIANGLES (Ch 1: Perimeter and Area)
  // -----------------------------------------------------------------------
  'triangles': (lang) => {
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
      ? `**[AMC 8 Prep Vol. 1 Ch.1 피타고라스 정리와 직각삼각형의 넓이]**\n\n피타고라스 정리 $a^2 + b^2 = c^2$에 의해 다른 한 변의 길이를 구합니다:\n\n$$b = \\sqrt{${hyp}^2 - ${leg1}^2} = \\sqrt{${hyp * hyp} - ${leg1 * leg1}} = \\sqrt{${leg2 * leg2}} = ${leg2}$$\n\n직각삼각형의 넓이는 두 직각변의 곱의 절반이므로:\n\n$$A = \\frac{1}{2} \\times ${leg1} \\times ${leg2} = ${area}\\text{ cm}^2$$\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} ($${area}\\text{ cm}^2$)** 입니다.`
      : `**[AMC 8 Prep Vol. 1 Ch.1 Pythagorean Theorem & Right Triangle Area]**\n\nUsing the Pythagorean theorem $a^2 + b^2 = c^2$:\n\n$$b = \\sqrt{${hyp}^2 - ${leg1}^2} = \\sqrt{${hyp * hyp - leg1 * leg1}} = ${leg2}$$\n\nThe area of the right triangle is:\n\n$$A = \\frac{1}{2} \\times ${leg1} \\times ${leg2} = ${area}\\text{ cm}^2$$\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${area})**.`;

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
    const variant = pickRandom(['odd-sum', 'arithmetic-term', 'triangular']);
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
      ? `**[AMC 8 Prep Vol. 1 Ch.2 거듭제곱의 일의 자리 주기성]**\n\n밑이 $${base}$일 때 거듭제곱의 일의 자리 숫자는 4개를 주기로 반복됩니다: **($${cycleStr}$)**\n\n지수 $${exp}$를 주기 $4$로 나눈 나머지를 구합니다:\n\n$$${exp} = 4 \\times ${Math.floor(exp / 4)} + ${remainder}$$\n\n나머지가 $${remainder}$이므로 일의 자리 숫자는 주기의 ${remainder === 0 ? '4번째' : remainder + '번째'} 숫자인 **$${ans}$** 입니다.\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} ($${ans}$)** 입니다.`
      : `**[AMC 8 Prep Vol. 1 Ch.2 Units Digit Power Cycles]**\n\nThe units digits of powers of $${base}$ repeat every 4 terms in the cycle: **($${cycleStr}$)**.\n\nDividing the exponent by 4:\n\n$$${exp} = 4 \\times ${Math.floor(exp / 4)} + ${remainder}$$\n\nSince the remainder is $${remainder}$, the units digit is **${ans}**.\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${ans})**.`;

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
  // 8. OPERATIONS WITH FRACTIONS (Ch 4: Operations with Fractions)
  // -----------------------------------------------------------------------
  'arithmetic-operations': (lang) => {
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
  },

  // -----------------------------------------------------------------------
  // 9. EVEN AND ODD (Ch 5: Even and Odd)
  // -----------------------------------------------------------------------
  'remainders-divisibility': (lang) => {
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
        if (i === 3) return `${totalDiscount - 2}\\%`;
        return `${100 - (d1 + d2)}\\%`;
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
      return `${ansY + 10}\\%`;
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
      if (i === 3) return `${Math.round((finalConc - 2.5) * 10) / 10}\\%`;
      return `${C2}\\%`;
    });

    const question = lang === 'ko'
      ? `$${C1}\\%$ 소금물 $${V1}\\text{ g}$과 $${C2}\\%$ 소금물 $${V2}\\text{ g}$을 섞었습니다. 완성된 혼합 소금물의 농도는 몇 $\\%$입니까?`
      : `A $${C1}\\%$ salt solution of mass $${V1}\\text{ g}$ is mixed with a $${C2}\\%$ salt solution of mass $${V2}\\text{ g}$. What is the concentration (percentage) of salt in the resulting mixture?`;

    const explanation = lang === 'ko'
      ? `**[AMC 8 Prep Vol. 1 Ch.6 소금물 농도 혼합 공식]**\n\n1. 첫 번째 소금물의 소금 양: $${V1} \\times \\frac{${C1}}{100} = ${salt1}\\text{ g}$\n2. 두 번째 소금물의 소금 양: $${V2} \\times \\frac{${C2}}{100} = ${salt2}\\text{ g}$\n3. 혼합물의 총 소금 양: $${salt1} + ${salt2} = ${totalSalt}\\text{ g}$\n4. 혼합물의 총 무게: $${V1} + ${V2} = ${totalV}\\text{ g}$\n\n따라서 혼합물의 농도는:\n\n$$\\text{농도} = \\frac{${totalSalt}}{${totalV}} \\times 100\\% = ${finalConc}\\%$$\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} ($${finalConc}\\%$)** 입니다.`
      : `**[AMC 8 Prep Vol. 1 Ch.6 Solution Mixture Formula]**\n\n1. Salt in first solution: $${V1} \\times ${C1 / 100} = ${salt1}\\text{ g}$.\n2. Salt in second solution: $${V2} \\times ${C2 / 100} = ${salt2}\\text{ g}$.\n3. Total salt: $${totalSalt}\\text{ g}$. Total mass: $${totalV}\\text{ g}$.\n4. Concentration: $\\frac{${totalSalt}}{${totalV}} \\times 100\\% = ${finalConc}\\%$.\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${finalConc}\\%)**.`;

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
      ? `**[조합(Combination) 기본 공식]**\n\n서로 다른 $n$명 중에서 순서에 상관없이 $r$명을 선택하는 조합의 수 $\\binom{n}{r}$:\n\n$$\\binom{${n}}{${r}} = \\frac{${n}!}{( ${n} - ${r} )! \\times ${r}!} = ${ans}$$\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} ($${ans}$가지)** 입니다.`
      : `**[Combinations Formula]**\n\nChoosing $r$ elements from $n$ distinct elements without regard to order:\n\n$$\\binom{${n}}{${r}} = \\frac{${n}!}{(${n}-${r})! \\times ${r}!} = ${ans}$$\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${ans})**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // 14. PROBABILITY
  // -----------------------------------------------------------------------
  'probability': (lang) => {
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
      if (i === 1) return `\\frac{${num + 1}}{${den}}`;
      if (i === 2) return `\\frac{${Math.max(1, num - 1)}}{${den}}`;
      if (i === 3) return `\\frac{1}{${targetSum}}`;
      return `\\frac{${num}}{${den + 2}}`;
    });

    const question = lang === 'ko'
      ? `서로 다른 두 개의 주사위를 동시에 던질 때, 나오는 두 눈의 수의 합이 $${targetSum}$이 될 확률은 얼마입니까?`
      : `When two fair standard six-sided dice are rolled simultaneously, what is the probability that the sum of the numbers rolled is $${targetSum}$?`;

    const explanation = lang === 'ko'
      ? `**[주사위 확률과 표본공간]**\n\n두 주사위를 던질 때 나오는 모든 경우의 수는 $6 \\times 6 = 36$가지입니다.\n\n두 눈의 합이 $${targetSum}$이 되는 순서쌍 $(d_1, d_2)$의 개수는 총 $${favorable}$가지입니다.\n\n따라서 확률은:\n\n$$P = \\frac{${favorable}}{36} = \\frac{${num}}{${den}}$$\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} ($${ans}$)** 입니다.`
      : `**[Dice Probability & Sample Space]**\n\nThe total number of outcomes when rolling two dice is $6 \\times 6 = 36$.\n\nThere are $${favorable}$ pairs $(d_1, d_2)$ that sum to $${targetSum}$.\n\nThus the probability is $\\frac{${favorable}}{36} = \\frac{${num}}{${den}}$.\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]}**.`;

    return { question, choices, correctIdx, explanation };
  },

  // -----------------------------------------------------------------------
  // 15. PRIMES & FACTORIZATION
  // -----------------------------------------------------------------------
  'primes-factorization': (lang) => {
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
      ? `**[소인수분해와 약수의 개수 공식]**\n\n자연수 $${N}$을 소인수분해하면:\n\n$$${N} = ${p}^{${a}} \\times ${q}^{${b}}$$\n\n약수의 개수 공식 $(a+1)(b+1)$에 의해:\n\n$$\\text{약수의 개수} = (${a} + 1) \\times (${b} + 1) = ${a + 1} \\times ${b + 1} = ${numDivisors}$$\n\n정답은 **${['①','②','③','④','⑤'][correctIdx]} ($${numDivisors}$개)** 입니다.`
      : `**[Prime Factorization & Number of Divisors]**\n\nFactoring $${N}$ into primes gives:\n\n$$${N} = ${p}^{${a}} \\times ${q}^{${b}}$$\n\nThe number of positive divisors is $(a+1)(b+1)$:\n\n$$(${a}+1)(${b}+1) = ${numDivisors}$$\n\nThe correct choice is **${['A','B','C','D','E'][correctIdx]} (${numDivisors})**.`;

    return { question, choices, correctIdx, explanation };
  },
};

/**
 * Fallback generator for units that do not have a dedicated generator above.
 * Maps back to the subject's primary generator or builds a contextual problem.
 */
export function getGeneratorForUnit(unitId) {
  if (GENERATORS[unitId]) return GENERATORS[unitId];

  // Subject-based fallbacks
  if (unitId.includes('triangle') || unitId.includes('angle')) return GENERATORS['triangles'];
  if (unitId.includes('circle')) return GENERATORS['area-perimeter'];
  if (unitId.includes('coordinate') || unitId.includes('grid')) return GENERATORS['coordinate-geometry'];
  if (unitId.includes('digit') || unitId.includes('base')) return GENERATORS['units-digit-cycles'];
  if (unitId.includes('sequence') || unitId.includes('pattern')) return GENERATORS['sequences-patterns'];
  if (unitId.includes('logic') || unitId.includes('game') || unitId.includes('clock')) return GENERATORS['logical-reasoning'];
  if (unitId.includes('crypt') || unitId.includes('puzzle')) return GENERATORS['cryptarithms-puzzles'];
  if (unitId.includes('arithmetic') || unitId.includes('fraction') || unitId.includes('expression')) return GENERATORS['arithmetic-operations'];
  if (unitId.includes('prime') || unitId.includes('divisor') || unitId.includes('gcd')) return GENERATORS['primes-factorization'];
  if (unitId.includes('remainder') || unitId.includes('divisib')) return GENERATORS['remainders-divisibility'];
  if (unitId.includes('percent') || unitId.includes('money') || unitId.includes('rate')) return GENERATORS['percentages-money'];
  if (unitId.includes('ratio')) return GENERATORS['ratios-percent'];
  if (unitId.includes('speed') || unitId.includes('distance') || unitId.includes('work')) return GENERATORS['speed-distance-time'];
  if (unitId.includes('count') || unitId.includes('permutation') || unitId.includes('combination')) return GENERATORS['permutations-combinations'];
  if (unitId.includes('prob') || unitId.includes('dice') || unitId.includes('card')) return GENERATORS['probability'];

  // Default fallback: area-perimeter
  return GENERATORS['area-perimeter'];
}

/**
 * Main function to generate an interactive problem object for InteractiveProblemCard
 */
export function generateAmcVariantProblem(unit, language = 'ko') {
  const unitId = typeof unit === 'string' ? unit : unit.id;
  const unitLabel = typeof unit === 'string' ? unit : (language === 'en' ? unit.labelEn : unit.label);
  const generator = getGeneratorForUnit(unitId);
  const result = generator(language);

  return {
    id: `gen-variant-${unitId}-${Date.now()}-${randInt(100, 999)}`,
    number: language === 'ko' ? '유사 변형' : 'Variant',
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
