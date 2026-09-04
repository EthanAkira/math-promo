// Complete Interactive Math Exam Datasets for CSAT & AMC

export const SAMPLE_CSAT_2024 = {
  id: 'csat-2024-math',
  title: '2024학년도 대학수학능력시험 수학영역',
  subtitle: '공통문항(수학 I · 수학 II) 및 선택문항 전체 인터랙티브 실전/연습 세트',
  examType: 'csat',
  year: 2024,
  problems: [
    {
      id: 'csat-2024-01',
      number: 1,
      points: 2,
      unit: '수학 I (지수와 로그)',
      type: 'multiple_choice',
      question: '$\\sqrt[3]{24} \\times 3^{\\frac{2}{3}}$ 의 값은?',
      choices: ['$6$', '$7$', '$8$', '$9$', '$10$'],
      correctAnswer: 0,
      explanation: '$\\sqrt[3]{24} = \\sqrt[3]{8 \\times 3} = 2 \\times 3^{\\frac{1}{3}}$ 이므로,\n\n$$2 \\times 3^{\\frac{1}{3}} \\times 3^{\\frac{2}{3}} = 2 \\times 3^{\\frac{1}{3} + \\frac{2}{3}} = 2 \\times 3^1 = 6$$\n\n따라서 정답은 ① $6$ 입니다.',
    },
    {
      id: 'csat-2024-02',
      number: 2,
      points: 2,
      unit: '수학 II (함수의 극한)',
      type: 'multiple_choice',
      question: '함수 $f(x) = 2x^3 - 5x + 3$ 에 대하여 $\\lim_{h \\to 0} \\frac{f(2+h) - f(2)}{h}$ 의 값은?',
      choices: ['$15$', '$17$', '$19$', '$21$', '$23$'],
      correctAnswer: 2,
      explanation: '미분계수의 정의에 의해 구하는 값은 $f\'(2)$ 입니다.\n\n$$f\'(x) = 6x^2 - 5$$\n\n$$f\'(2) = 6 \\times (2)^2 - 5 = 24 - 5 = 19$$\n\n따라서 정답은 ③ $19$ 입니다.',
    },
    {
      id: 'csat-2024-03',
      number: 3,
      points: 3,
      unit: '수학 I (삼각함수)',
      type: 'multiple_choice',
      question: '$\\theta$ 가 제 $2$ 사분면의 각이고 $\\sin\\theta = \\frac{1}{3}$ 일 때, $\\cos\\theta \\times \\tan\\theta$ 의 값은?',
      choices: ['$-\\frac{1}{3}$', '$-\\frac{\\sqrt{2}}{3}$', '$\\frac{1}{3}$', '$\\frac{\\sqrt{2}}{3}$', '$\\frac{2\\sqrt{2}}{3}$'],
      correctAnswer: 2,
      explanation: '$\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}$ 이므로,\n\n$$\\cos\\theta \\times \\tan\\theta = \\cos\\theta \\times \\frac{\\sin\\theta}{\\cos\\theta} = \\sin\\theta$$\n\n주어진 조건에서 $\\sin\\theta = \\frac{1}{3}$ 이므로 구하는 값은 $\\frac{1}{3}$ 입니다.\n\n따라서 정답은 ③ $\\frac{1}{3}$ 입니다.',
    },
    {
      id: 'csat-2024-04',
      number: 4,
      points: 3,
      unit: '수학 I (수열)',
      type: 'multiple_choice',
      question: '첫째항이 $2$ 인 등차수열 $\\{a_n\\}$ 에 대하여 $a_5 - a_3 = 6$ 일 때, $a_{10}$ 의 값은?',
      choices: ['$27$', '$29$', '$31$', '$33$', '$35$'],
      correctAnswer: 1,
      explanation: '등차수열의 공차를 $d$ 라 하면 $a_5 - a_3 = 2d = 6$ 이므로 $d = 3$ 입니다.\n\n일반항 $a_n = a_1 + (n-1)d = 2 + 3(n-1)$ 이므로,\n\n$$a_{10} = 2 + 3 \\times 9 = 2 + 27 = 29$$\n\n따라서 정답은 ② $29$ 입니다.',
    },
    {
      id: 'csat-2024-05',
      number: 5,
      points: 3,
      unit: '수학 II (도함수의 활용)',
      type: 'multiple_choice',
      question: '함수 $f(x) = x^3 - 3x^2 - 9x + 5$ 가 $x = a$ 에서 극대, $x = b$ 에서 극소일 때, $b - a$ 의 값은?',
      choices: ['$2$', '$3$', '$4$', '$5$', '$6$'],
      correctAnswer: 2,
      figureSvg: `<svg width="260" height="150" viewBox="-4 -20 8 40" style="background:#fff;border-radius:8px;">
        <line x1="-3.5" y1="0" x2="3.5" y2="0" stroke="#718096" stroke-width="0.15"/>
        <line x1="0" y1="-18" x2="0" y2="18" stroke="#718096" stroke-width="0.15"/>
        <path d="M -2.5 -18 C -1.5 25, 0 -15, 3.2 18" fill="none" stroke="#2a5c8a" stroke-width="0.35"/>
        <circle cx="-1" cy="10" r="0.25" fill="#c23b32"/>
        <text x="-1.8" y="12" font-size="1.8" fill="#c23b32">극대(a)</text>
        <circle cx="3" cy="-14" r="0.25" fill="#2a5c8a"/>
        <text x="2.2" y="-15" font-size="1.8" fill="#2a5c8a">극소(b)</text>
      </svg>`,
      explanation: '$f\'(x) = 3x^2 - 6x - 9 = 3(x-3)(x+1)$ 이므로,\n\n$f\'(x) = 0$ 의 해는 $x = -1$ 또는 $x = 3$ 입니다.\n\n$3$차항의 계수가 양수이므로 $x = -1$ 에서 극댓값($a = -1$), $x = 3$ 에서 극솟값($b = 3$)을 갖습니다.\n\n따라서 $b - a = 3 - (-1) = 4$ 입니다.\n\n정답은 ③ $4$ 입니다.',
    },
    {
      id: 'csat-2024-06',
      number: 6,
      points: 3,
      unit: '수학 I (지수와 로그)',
      type: 'multiple_choice',
      question: '$\\log_2 120 - \\log_2 15$ 의 값은?',
      choices: ['$1$', '$2$', '$3$', '$4$', '$5$'],
      correctAnswer: 2,
      explanation: '$$\\log_2 120 - \\log_2 15 = \\log_2 \\left(\\frac{120}{15}\\right) = \\log_2 8 = \\log_2 2^3 = 3$$\n\n따라서 정답은 ③ $3$ 입니다.',
    },
    {
      id: 'csat-2024-07',
      number: 7,
      points: 3,
      unit: '수학 II (정적분)',
      type: 'multiple_choice',
      question: '$\\int_{0}^{2} (3x^2 - 4x + 1) dx$ 의 값은?',
      choices: ['$1$', '$2$', '$3$', '$4$', '$5$'],
      correctAnswer: 1,
      explanation: '$$\\int_{0}^{2} (3x^2 - 4x + 1) dx = \\left[ x^3 - 2x^2 + x \\right]_0^2 = (8 - 8 + 2) - 0 = 2$$\n\n따라서 정답은 ② $2$ 입니다.',
    },
    {
      id: 'csat-2024-08',
      number: 8,
      points: 3,
      unit: '수학 I (수열의 합)',
      type: 'multiple_choice',
      question: '$\\sum_{k=1}^{10} (2k + 1)$ 의 값은?',
      choices: ['$110$', '$115$', '$120$', '$125$', '$130$'],
      correctAnswer: 2,
      explanation: '$$\\sum_{k=1}^{10} (2k + 1) = 2 \\times \\frac{10 \\times 11}{2} + 10 = 110 + 10 = 120$$\n\n따라서 정답은 ③ $120$ 입니다.',
    },
    {
      id: 'csat-2024-09',
      number: 9,
      points: 4,
      unit: '수학 II (함수의 연속)',
      type: 'multiple_choice',
      question: '함수 $f(x) = \\begin{cases} x^2 + ax + 3 & (x \\ge 1) \\\\ 2x + b & (x < 1) \\end{cases}$ 가 실수 전체의 집합에서 미분가능할 때, $a + b$ 의 값은?',
      choices: ['$1$', '$2$', '$3$', '$4$', '$5$'],
      correctAnswer: 1,
      explanation: '1. $x=1$ 에서 연속이어야 하므로:\n$$1 + a + 3 = 2(1) + b \\implies a - b = -2$$\n\n2. $x=1$ 에서 좌우 미분계수가 일치해야 하므로:\n$$f\'(1) = 2(1) + a = 2 \\implies a = 0$$\n\n따라서 $b = 2$ 이므로 $a + b = 0 + 2 = 2$ 입니다.\n\n정답은 ② $2$ 입니다.',
    },
    {
      id: 'csat-2024-10',
      number: 10,
      points: 4,
      unit: '수학 I (삼각함수의 활용)',
      type: 'multiple_choice',
      question: '반지름의 길이가 $4$ 인 원에 내접하는 삼각형 $ABC$ 에서 $\\angle A = 60^\\circ$ 일 때, 변 $BC$ 의 길이는?',
      choices: ['$2\\sqrt{3}$', '$3\\sqrt{3}$', '$4\\sqrt{3}$', '$6\\sqrt{3}$', '$8\\sqrt{3}$'],
      correctAnswer: 2,
      explanation: '사인법칙에 의하여 $\\frac{a}{\\sin A} = 2R$ 이므로,\n\n$$BC = a = 2R \\sin A = 2 \\times 4 \\times \\sin 60^\\circ = 8 \\times \\frac{\\sqrt{3}}{2} = 4\\sqrt{3}$$\n\n따라서 정답은 ③ $4\\sqrt{3}$ 입니다.',
    },
    {
      id: 'csat-2024-16',
      number: 16,
      points: 3,
      unit: '수학 I (지수방정식)',
      type: 'subjective',
      question: '방정식 $3^{2x-4} = \\frac{1}{27}$ 을 만족시키는 실수 $x$ 의 값을 구하시오.',
      choices: [],
      correctAnswer: 0.5,
      explanation: '$$3^{2x-4} = 3^{-3} \\implies 2x - 4 = -3 \\implies 2x = 1 \\implies x = \\frac{1}{2} = 0.5$$',
    },
    {
      id: 'csat-2024-17',
      number: 17,
      points: 3,
      unit: '수학 II (부정적분)',
      type: 'subjective',
      question: '함수 $f(x)$ 에 대하여 $f\'(x) = 3x^2 + 4x - 2$ 이고 $f(1) = 5$ 일 때, $f(2)$ 의 값을 구하시오.',
      choices: [],
      correctAnswer: 16,
      explanation: '$$f(x) = x^3 + 2x^2 - 2x + C$$\n$$f(1) = 1 + 2 - 2 + C = 1 + C = 5 \\implies C = 4$$\n\n따라서 $f(2) = 2^3 + 2(2^2) - 2(2) + 4 = 8 + 8 - 4 + 4 = 16$ 입니다.',
    },
  ],
};

export const SAMPLE_AMC_8_FULL = {
  id: 'amc8-2024-full',
  title: '2024 AMC 8 (American Mathematics Competitions)',
  subtitle: 'Complete Interactive Problem Set with Figures & Solutions',
  examType: 'amc',
  year: 2024,
  problems: [
    {
      id: 'amc8-2024-01',
      number: 1,
      points: 1,
      unit: 'Arithmetic',
      type: 'multiple_choice',
      question: 'What is the value of $(20 + 24) \\div (20 - 24 + 6)$?',
      choices: ['$22$', '$24$', '$26$', '$44$', '$88$'],
      correctAnswer: 0,
      explanation: '$$(20 + 24) = 44$$\n$$(20 - 24 + 6) = 2$$\n$$\\frac{44}{2} = 22$$\n\nTherefore, the correct answer is (A) $22$.',
    },
    {
      id: 'amc8-2024-02',
      number: 2,
      points: 1,
      unit: 'Geometry',
      type: 'multiple_choice',
      question: 'A rectangle with perimeter $30$ has length twice its width. What is the area of the rectangle?',
      choices: ['$25$', '$50$', '$75$', '$100$', '$200$'],
      correctAnswer: 1,
      explanation: 'Let width be $w$, length be $2w$.\n$$2(w + 2w) = 6w = 30 \\implies w = 5, \\text{length} = 10$$\n$$\\text{Area} = 5 \\times 10 = 50$$\n\nTherefore, the correct answer is (B) $50$.',
    },
    {
      id: 'amc8-2024-03',
      number: 3,
      points: 1,
      unit: 'Number Theory',
      type: 'multiple_choice',
      question: 'What is the smallest prime number greater than $200$?',
      choices: ['$201$', '$203$', '$207$', '$209$', '$211$'],
      correctAnswer: 4,
      explanation: '- $201 = 3 \\times 67$\n- $203 = 7 \\times 29$\n- $207 = 9 \\times 23$\n- $209 = 11 \\times 19$\n- $211$ is not divisible by $2, 3, 5, 7, 11, 13$, so it is prime.\n\nTherefore, the correct answer is (E) $211$.',
    },
    {
      id: 'amc8-2024-04',
      number: 4,
      points: 1,
      unit: 'Algebra & Ratios',
      type: 'multiple_choice',
      question: 'If $3$ pens cost as much as $5$ pencils, how many pencils cost the same as $18$ pens?',
      choices: ['$20$', '$25$', '$30$', '$35$', '$40$'],
      correctAnswer: 2,
      explanation: '$$18 \\text{ pens} = 6 \\times (3 \\text{ pens}) = 6 \\times (5 \\text{ pencils}) = 30 \\text{ pencils}$$\n\nTherefore, the correct answer is (C) $30$.',
    },
    {
      id: 'amc8-2024-05',
      number: 5,
      points: 1,
      unit: 'Combinatorics',
      type: 'multiple_choice',
      question: 'How many two-digit positive integers have digits that sum to $9$?',
      choices: ['$7$', '$8$', '$9$', '$10$', '$11$'],
      correctAnswer: 2,
      explanation: 'The integers are $18, 27, 36, 45, 54, 63, 72, 81, 90$. There are $9$ such numbers.\n\nTherefore, the correct answer is (C) $9$.',
    },
  ],
};

export const SAMPLE_AMC_10_2023 = {
  id: 'amc10-2023a',
  title: '2023 AMC 10A (American Mathematics Competitions)',
  subtitle: 'Interactive Competition Practice Set with Step-by-Step Solutions',
  examType: 'amc',
  year: 2023,
  problems: [
    {
      id: 'amc-2023-01',
      number: 1,
      points: 6,
      unit: 'Algebra & Arithmetic',
      type: 'multiple_choice',
      question: 'What is the value of $(2023 - 202) \\times 3 - 2023$?',
      choices: ['$3440$', '$3441$', '$3442$', '$3443$', '$3444$'],
      correctAnswer: 0,
      explanation: 'We calculate step by step:\n\n$$(2023 - 202) \\times 3 - 2023 = 1821 \\times 3 - 2023 = 5463 - 2023 = 3440$$\n\nAlternatively, rewrite as:\n$$3 \\times 2023 - 3 \\times 202 - 2023 = 2 \\times 2023 - 606 = 4046 - 606 = 3440$$\n\nTherefore, the correct answer is (A) $3440$.',
    },
    {
      id: 'amc-2023-02',
      number: 2,
      points: 6,
      unit: 'Geometry',
      type: 'multiple_choice',
      question: 'In the figure below, triangle $ABC$ is an equilateral triangle with side length $6$. Points $D, E, F$ are midpoints of sides $AB, BC, CA$ respectively. What is the area of triangle $DEF$?',
      figureSvg: `<svg width="240" height="180" viewBox="0 0 240 180" style="background:#fff;border-radius:8px;">
        <polygon points="120,20 30,160 210,160" fill="#fdfbf7" stroke="#3b200c" stroke-width="2.5"/>
        <polygon points="75,90 165,90 120,160" fill="rgba(42,92,138,0.15)" stroke="#2a5c8a" stroke-width="2" stroke-dasharray="3 3"/>
        <text x="115" y="14" font-size="14" font-weight="bold" fill="#3b200c">A</text>
        <text x="12" y="168" font-size="14" font-weight="bold" fill="#3b200c">B</text>
        <text x="216" y="168" font-size="14" font-weight="bold" fill="#3b200c">C</text>
        <text x="45" y="90" font-size="12" font-weight="bold" fill="#2a5c8a">D</text>
        <text x="175" y="90" font-size="12" font-weight="bold" fill="#2a5c8a">F</text>
        <text x="115" y="176" font-size="12" font-weight="bold" fill="#2a5c8a">E</text>
      </svg>`,
      choices: ['$\\frac{9\\sqrt{3}}{4}$', '$\\frac{9\\sqrt{3}}{2}$', '$9\\sqrt{3}$', '$18\\sqrt{3}$', '$36\\sqrt{3}$'],
      correctAnswer: 0,
      explanation: 'The area of an equilateral triangle with side length $s$ is:\n\n$$\\text{Area}(\\triangle ABC) = \\frac{\\sqrt{3}}{4} s^2 = \\frac{\\sqrt{3}}{4} \\times 6^2 = 9\\sqrt{3}$$\n\nSince $D, E, F$ are midpoints, $\\triangle DEF$ divides $\\triangle ABC$ into $4$ congruent smaller equilateral triangles.\n\n$$\\text{Area}(\\triangle DEF) = \\frac{1}{4} \\text{Area}(\\triangle ABC) = \\frac{9\\sqrt{3}}{4}$$\n\nTherefore, the correct answer is (A) $\\frac{9\\sqrt{3}}{4}$.',
    },
    {
      id: 'amc-2023-03',
      number: 3,
      points: 6,
      unit: 'Number Theory',
      type: 'multiple_choice',
      question: 'What is the remainder when $2^{2023}$ is divided by $10$?',
      choices: ['$2$', '$4$', '$6$', '$8$', '$0$'],
      correctAnswer: 3,
      explanation: 'Finding the remainder modulo $10$ is equivalent to finding the units digit of $2^{2023}$.\n\nThe units digits of powers of $2$ repeat in a cycle of length $4$:\n$2^1=2, 2^2=4, 2^3=8, 2^4=16 \\dots$\n\nDividing $2023$ by $4$ gives $2023 = 4 \\times 505 + 3$, so $2023 \\equiv 3 \\pmod 4$.\n\nThus, the units digit corresponds to the $3$rd power in the cycle, which is $8$.\n\nTherefore, the correct answer is (D) $8$.',
    },
    {
      id: 'amc-2023-04',
      number: 4,
      points: 6,
      unit: 'Algebra & Equations',
      type: 'multiple_choice',
      question: 'If $x + y = 10$ and $x^2 + y^2 = 58$, what is the value of $xy$?',
      choices: ['$18$', '$21$', '$24$', '$27$', '$30$'],
      correctAnswer: 1,
      explanation: 'Using the identity $(x+y)^2 = x^2 + 2xy + y^2$:\n$$10^2 = 58 + 2xy \\implies 100 = 58 + 2xy \\implies 2xy = 42 \\implies xy = 21$$\n\nTherefore, the correct answer is (B) $21$.',
    },
    {
      id: 'amc-2023-05',
      number: 5,
      points: 6,
      unit: 'Combinatorics',
      type: 'multiple_choice',
      question: 'How many different $4$-letter arrangements can be made using the letters in the word $\\text{MATH}$?',
      choices: ['$12$', '$16$', '$20$', '$24$', '$32$'],
      correctAnswer: 3,
      explanation: 'The word $\\text{MATH}$ has $4$ distinct letters.\n$$4! = 4 \\times 3 \\times 2 \\times 1 = 24$$\n\nTherefore, the correct answer is (D) $24$.',
    },
    {
      id: 'amc-2023-06',
      number: 6,
      points: 6,
      unit: 'Geometry & Angles',
      type: 'multiple_choice',
      question: 'In a convex hexagon, the measures of five of the interior angles are $100^\\circ, 110^\\circ, 120^\\circ, 130^\\circ,$ and $140^\\circ$. What is the measure of the sixth angle?',
      choices: ['$100^\\circ$', '$110^\\circ$', '$120^\\circ$', '$130^\\circ$', '$140^\\circ$'],
      correctAnswer: 2,
      explanation: 'The sum of the interior angles of a hexagon ($n=6$) is $(6-2) \\times 180^\\circ = 720^\\circ$.\n$$\\text{Sum of 5 angles} = 100 + 110 + 120 + 130 + 140 = 600^\\circ$$\n$$\\text{Sixth angle} = 720^\\circ - 600^\\circ = 120^\\circ$$\n\nTherefore, the correct answer is (C) $120^\\circ$.',
    },
    {
      id: 'amc-2023-07',
      number: 7,
      points: 6,
      unit: 'Probability',
      type: 'multiple_choice',
      question: 'Two fair $6$-sided dice are rolled. What is the probability that the sum of the numbers rolled is a prime number?',
      choices: ['$\\frac{5}{12}$', '$\\frac{7}{18}$', '$\\frac{4}{9}$', '$\\frac{1}{2}$', '$\\frac{5}{9}$'],
      correctAnswer: 0,
      explanation: 'Possible sums that are prime are $2, 3, 5, 7, 11$.\n- Sum $2$: $(1,1)$ (1 way)\n- Sum $3$: $(1,2), (2,1)$ (2 ways)\n- Sum $5$: $(1,4), (2,3), (3,2), (4,1)$ (4 ways)\n- Sum $7$: $(1,6), (2,5), (3,4), (4,3), (5,2), (6,1)$ (6 ways)\n- Sum $11$: $(5,6), (6,5)$ (2 ways)\n\nTotal favorable outcomes $= 1 + 2 + 4 + 6 + 2 = 15$.\n$$\\text{Probability} = \\frac{15}{36} = \\frac{5}{12}$$\n\nTherefore, the correct answer is (A) $\\frac{5}{12}$.',
    },
  ],
};

export const SAMPLE_AMC_12_FULL = {
  id: 'amc12-2023a',
  title: '2023 AMC 12A (American Mathematics Competitions)',
  subtitle: 'Advanced Competition Problem Set with Comprehensive Solutions',
  examType: 'amc',
  year: 2023,
  problems: [
    {
      id: 'amc12-2023-01',
      number: 1,
      points: 6,
      unit: 'Complex Numbers & Algebra',
      type: 'multiple_choice',
      question: 'What is the value of $(1 + i)^8$ where $i = \\sqrt{-1}$?',
      choices: ['$8$', '$16$', '$16i$', '$-16$', '$16 - 16i$'],
      correctAnswer: 1,
      explanation: '$$(1 + i)^2 = 1 + 2i + i^2 = 2i$$\n$$(1 + i)^8 = ((1 + i)^2)^4 = (2i)^4 = 16 i^4 = 16 \\times 1 = 16$$\n\nTherefore, the correct answer is (B) $16$.',
    },
    {
      id: 'amc12-2023-02',
      number: 2,
      points: 6,
      unit: 'Logarithms',
      type: 'multiple_choice',
      question: 'If $\\log_2(\\log_3(\\log_4 x)) = 0$, what is the value of $x$?',
      choices: ['$4$', '$16$', '$64$', '$81$', '$256$'],
      correctAnswer: 2,
      explanation: '$$\\log_2(\\log_3(\\log_4 x)) = 0 \\implies \\log_3(\\log_4 x) = 2^0 = 1$$\n$$\\log_4 x = 3^1 = 3 \\implies x = 4^3 = 64$$\n\nTherefore, the correct answer is (C) $64$.',
    },
    {
      id: 'amc12-2023-03',
      number: 3,
      points: 6,
      unit: 'Trigonometry',
      type: 'multiple_choice',
      question: 'What is the value of $\\sin^2 15^\\circ + \\sin^2 75^\\circ$?',
      choices: ['$\\frac{1}{2}$', '$\\frac{\\sqrt{3}}{2}$', '$1$', '$\\frac{3}{2}$', '$2$'],
      correctAnswer: 2,
      explanation: 'Since $\\sin 75^\\circ = \\cos 15^\\circ$,\n$$\\sin^2 15^\\circ + \\sin^2 75^\\circ = \\sin^2 15^\\circ + \\cos^2 15^\\circ = 1$$\n\nTherefore, the correct answer is (C) $1$.',
    },
  ],
};

// Dynamic helper returning problem set for given level & exam
export function getInteractiveProblems(category, levelOrType) {
  if (typeof window !== 'undefined') {
    try {
      const customData = localStorage.getItem(`custom_exam_${levelOrType}`);
      if (customData) {
        const parsed = JSON.parse(customData);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
  }

  if (category === 'amc') {
    if (levelOrType === '8') return SAMPLE_AMC_8_FULL.problems;
    if (levelOrType === '12') return SAMPLE_AMC_12_FULL.problems;
    return SAMPLE_AMC_10_2023.problems;
  }

  return SAMPLE_CSAT_2024.problems;
}

