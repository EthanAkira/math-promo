export const SAMPLE_CSAT_2024 = {
  id: 'csat-2024-math',
  title: '2024학년도 대학수학능력시험 수학영역',
  subtitle: '공통문항 (수학 I · 수학 II) 인터랙티브 실전/연습 문제 세트',
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
      explanation: '$\\sqrt[3]{24} = \\sqrt[3]{8 \\times 3} = 2 \\times 3^{\\frac{1}{3}}$ 이므로,\\n\\n$$2 \\times 3^{\\frac{1}{3}} \\times 3^{\\frac{2}{3}} = 2 \\times 3^{\\frac{1}{3} + \\frac{2}{3}} = 2 \\times 3^1 = 6$$\\n\\n따라서 정답은 ① $6$ 입니다.',
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
      explanation: '미분계수의 정의에 의해 구하는 값은 $f\'(2)$ 입니다.\\n\\n$$f\'(x) = 6x^2 - 5$$\\n\\n$$f\'(2) = 6 \\times (2)^2 - 5 = 24 - 5 = 19$$\\n\\n따라서 정답은 ③ $19$ 입니다.',
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
      explanation: '$\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}$ 이므로,\\n\\n$$\\cos\\theta \\times \\tan\\theta = \\cos\\theta \\times \\frac{\\sin\\theta}{\\cos\\theta} = \\sin\\theta$$\\n\\n주어진 조건에서 $\\sin\\theta = \\frac{1}{3}$ 이므로 구하는 값은 $\\frac{1}{3}$ 입니다.\\n\\n따라서 정답은 ③ $\\frac{1}{3}$ 입니다.',
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
      explanation: '등차수열의 공차를 $d$ 라 하면 $a_5 - a_3 = 2d = 6$ 이므로 $d = 3$ 입니다.\\n\\n일반항 $a_n = a_1 + (n-1)d = 2 + 3(n-1)$ 이므로,\\n\\n$$a_{10} = 2 + 3 \\times 9 = 2 + 27 = 29$$\\n\\n따라서 정답은 ② $29$ 입니다.',
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
      explanation: '$f\'(x) = 3x^2 - 6x - 9 = 3(x^2 - 2x - 3) = 3(x-3)(x+1)$ 이므로,\\n\\n$f\'(x) = 0$ 의 해는 $x = -1$ 또는 $x = 3$ 입니다.\\n\\n$3$차항의 계수가 양수이므로 $x = -1$ 에서 극댓값($a = -1$), $x = 3$ 에서 극솟값($b = 3$)을 갖습니다.\\n\\n따라서 $b - a = 3 - (-1) = 4$ 입니다.\\n\\n정답은 ③ $4$ 입니다.',
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
      explanation: 'We calculate step by step:\\n\\n$$(2023 - 202) \\times 3 - 2023 = 1821 \\times 3 - 2023 = 5463 - 2023 = 3440$$\\n\\nAlternatively, rewrite as:\\n$$3 \\times 2023 - 3 \\times 202 - 2023 = 2 \\times 2023 - 606 = 4046 - 606 = 3440$$\\n\\nTherefore, the correct answer is (A) $3440$.',
    },
    {
      id: 'amc-2023-02',
      number: 2,
      points: 6,
      unit: 'Geometry',
      type: 'multiple_choice',
      question: 'In the figure below, triangle $ABC$ is an equilateral triangle with side length $6$. Points $D, E, F$ are midpoints of sides $AB, BC, CA$ respectively. What is the area of triangle $DEF$?',
      figureSvg: `<svg width="240" height="180" viewBox="0 0 240 180" style="background:#fff;border-radius:8px;">
        <!-- Equilateral triangle ABC -->
        <polygon points="120,20 30,160 210,160" fill="#fdfbf7" stroke="#3b200c" stroke-width="2.5"/>
        <!-- Inner midpoint triangle DEF -->
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
      explanation: 'The area of an equilateral triangle with side length $s$ is given by:\\n\\n$$\\text{Area}(\\triangle ABC) = \\frac{\\sqrt{3}}{4} s^2 = \\frac{\\sqrt{3}}{4} \\times 6^2 = 9\\sqrt{3}$$\\n\\nSince $D, E, F$ are midpoints, $\\triangle DEF$ divides $\\triangle ABC$ into $4$ congruent smaller equilateral triangles.\\n\\n$$\\text{Area}(\\triangle DEF) = \\frac{1}{4} \\text{Area}(\\triangle ABC) = \\frac{9\\sqrt{3}}{4}$$\\n\\nTherefore, the correct answer is (A) $\\frac{9\\sqrt{3}}{4}$.',
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
      explanation: 'Finding the remainder modulo $10$ is equivalent to finding the units digit of $2^{2023}$.\\n\\nThe units digits of powers of $2$ repeat in a cycle of length $4$:\\n- $2^1 \\equiv 2$\\n- $2^2 \\equiv 4$\\n- $2^3 \\equiv 8$\\n- $2^4 \\equiv 6$\\n- $2^5 \\equiv 2 \\dots$\\n\\nDividing $2023$ by $4$ gives $2023 = 4 \\times 505 + 3$, so $2023 \\equiv 3 \\pmod 4$.\\n\\nThus, the units digit corresponds to the $3$rd power in the cycle, which is $8$.\\n\\nTherefore, the correct answer is (D) $8$.',
    },
  ],
};
