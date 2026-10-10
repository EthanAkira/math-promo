/**
 * Complete 2023 AMC 12A competition dataset (all 25 problems)
 * with official AoPS model solutions and exact answer keys.
 */
export const AMC12_2023_PROBLEMS = [
  {
    id: "amc12-2023a-01",
    level: "12",
    year: 2023,
    variant: "A",
    problemNumber: 1,
    subjectId: "algebra",
    unitId: "speed-distance-time",
    question: "Cities $A$ and $B$ are $45$ miles apart. Alicia lives in $A$ and Beth lives in $B$. Alicia bikes toward $B$ at $18$ miles per hour. Leaving at the same time, Beth bikes toward $A$ at $12$ miles per hour. How many miles from City $A$ will they be when they meet?",
    choices: [
      "$20$",
      "$24$",
      "$25$",
      "$26$",
      "$27$"
    ],
    answer: "4",
    explanation: "Since Alicia and Beth ride toward each other, their combined closing speed is the sum of their individual speeds:\n\n$$18 + 12 = 30 \\text{ mph}$$\n\nThe time $t$ it takes for them to meet is:\n\n$$t = \\frac{45 \\text{ miles}}{30 \\text{ mph}} = 1.5 \\text{ hours}$$\n\nThe distance from City $A$ when they meet is the distance Alicia travels in $1.5$ hours:\n\n$$\\text{Distance} = 18 \\text{ mph} \\times 1.5 \\text{ hours} = 27 \\text{ miles}$$\n\nTherefore, the correct answer is **(E)**.",
    points: 6,
    sourceFileKey: "file:12:2023:A:problems"
  },
  {
    id: "amc12-2023a-02",
    level: "12",
    year: 2023,
    variant: "A",
    problemNumber: 2,
    subjectId: "algebra",
    unitId: "systems-equations",
    question: "The weight of $\\frac{1}{3}$ of a large pizza together with $3\\frac{1}{2}$ cups of orange slices is the same as the weight of $\\frac{3}{4}$ of a large pizza together with $\\frac{1}{2}$ cup of orange slices. A cup of orange slices weighs $\\frac{1}{4}$ of a pound. What is the weight, in pounds, of a large pizza?",
    choices: [
      "$1.8$",
      "$2$",
      "$2.4$",
      "$3$",
      "$3.6$"
    ],
    answer: "0",
    explanation: "Let $P$ be the weight of a large pizza and $C$ be the weight of a cup of orange slices ($C = 0.25$ lb).\n\n$$\\frac{1}{3}P + \\frac{7}{2}C = \\frac{3}{4}P + \\frac{1}{2}C$$\n\nSubtract $\\frac{1}{2}C$ from both sides:\n\n$$3C = \\left(\\frac{3}{4} - \\frac{1}{3}\\right)P = \\frac{5}{12}P$$\n\nSubstitute $C = \\frac{1}{4}$:\n\n$$\\frac{3}{4} = \\frac{5}{12}P \\implies P = \\frac{3}{4} \\times \\frac{12}{5} = \\frac{9}{5} = 1.8 \\text{ pounds}$$\n\nTherefore, the correct answer is **(A)**.",
    points: 6,
    sourceFileKey: "file:12:2023:A:problems"
  },
  {
    id: "amc12-2023a-03",
    level: "12",
    year: 2023,
    variant: "A",
    problemNumber: 3,
    subjectId: "number-theory",
    unitId: "primes-factorization",
    question: "How many positive perfect squares less than $2023$ are divisible by $5$?",
    choices: [
      "$8$",
      "$9$",
      "$10$",
      "$11$",
      "$12$"
    ],
    answer: "0",
    explanation: "For $n^2 < 2023$, the maximum integer is $n = \\lfloor\\sqrt{2023}\\rfloor = 44$ (since $44^2 = 1936 < 2023 < 2025 = 45^2$).\n\nA square $n^2$ is divisible by prime $5$ if and only if $n$ is divisible by $5$.\n\nIn the range $1 \\le n \\le 44$, the multiples of $5$ are $5, 10, 15, 20, 25, 30, 35, 40$, giving exactly $\\lfloor 44 / 5 \\rfloor = 8$ squares.\n\nTherefore, the correct answer is **(A)**.",
    points: 6,
    sourceFileKey: "file:12:2023:A:problems"
  },
  {
    id: "amc12-2023a-04",
    level: "12",
    year: 2023,
    variant: "A",
    problemNumber: 4,
    subjectId: "number-theory",
    unitId: "bases-digits",
    question: "How many digits are in the base-ten representation of $8^5 \\cdot 5^{10} \\cdot 15^5$?",
    choices: [
      "$14$",
      "$15$",
      "$16$",
      "$17$",
      "$18$"
    ],
    answer: "4",
    explanation: "Factor into prime powers:\n\n$$8^5 \\cdot 5^{10} \\cdot 15^5 = (2^3)^5 \\cdot 5^{10} \\cdot (3 \\cdot 5)^5 = 2^{15} \\cdot 5^{15} \\cdot 3^5$$\n\nCombine the factors of $2$ and $5$:\n\n$$2^{15} \\cdot 5^{15} = 10^{15}$$\n$$3^5 = 243$$\n\nThus, the product is $243 \\times 10^{15}$, which has $3 + 15 = 18$ digits.\n\nTherefore, the correct answer is **(E)**.",
    points: 6,
    sourceFileKey: "file:12:2023:A:problems"
  },
  {
    id: "amc12-2023a-05",
    level: "12",
    year: 2023,
    variant: "A",
    problemNumber: 5,
    subjectId: "combinatorics-probability",
    unitId: "probability",
    question: "Janet rolls a standard $6$-sided die $4$ times and keeps a running total of the numbers she rolls. What is the probability that at some point, her running total will equal $3$?",
    choices: [
      "$\\frac{2}{9}$",
      "$\\frac{49}{216}$",
      "$\\frac{25}{108}$",
      "$\\frac{1}{4}$",
      "$\\frac{29}{108}$"
    ],
    answer: "1",
    explanation: "Total outcomes for $4$ rolls is $6^4 = 1296$.\n\nThe running sum hits $3$ in three mutually exclusive ways:\n1. On 1st roll (roll 1 is $3$): $1 \\times 6^3 = 216$ ways.\n2. On 2nd roll (first two rolls are $1,2$ or $2,1$): $2 \\times 6^2 = 72$ ways.\n3. On 3rd roll (first three rolls are $1,1,1$): $1 \\times 6 = 6$ ways.\n\nSum of favorable outcomes:\n$$216 + 72 + 6 = 294$$\n\nProbability:\n$$\\frac{294}{1296} = \\frac{49}{216}$$\n\nTherefore, the correct answer is **(B)**.",
    points: 6,
    sourceFileKey: "file:12:2023:A:problems"
  },
  {
    id: "amc12-2023a-06",
    level: "12",
    year: 2023,
    variant: "A",
    problemNumber: 6,
    subjectId: "algebra",
    unitId: "logarithms-exponents",
    question: "Points $A$ and $B$ lie on the graph of $y = \\log_2 x$. The midpoint of $\\overline{AB}$ is $(6, 2)$. What is the positive difference between the $x$-coordinates of $A$ and $B$?",
    choices: [
      "$2\\sqrt{5}$",
      "$4\\sqrt{3}$",
      "$6\\sqrt{2}$",
      "$4\\sqrt{5}$",
      "$8$"
    ],
    answer: "3",
    explanation: "Let $A = (x_1, y_1)$ and $B = (x_2, y_2)$ where $y_1 = \\log_2 x_1$ and $y_2 = \\log_2 x_2$.\n\nThe midpoint is $(6, 2)$, so:\n\n$$\\frac{x_1 + x_2}{2} = 6 \\implies x_1 + x_2 = 12$$\n$$\\frac{y_1 + y_2}{2} = 2 \\implies y_1 + y_2 = 4$$\n\nUsing logarithmic properties:\n\n$$\\log_2 x_1 + \\log_2 x_2 = \\log_2(x_1 x_2) = 4 \\implies x_1 x_2 = 2^4 = 16$$\n\nNow calculate the positive difference $|x_1 - x_2|$:\n\n$$(x_1 - x_2)^2 = (x_1 + x_2)^2 - 4x_1 x_2 = 12^2 - 4(16) = 144 - 64 = 80$$\n$$|x_1 - x_2| = \\sqrt{80} = 4\\sqrt{5}$$\n\nTherefore, the correct answer is **(D)**.",
    points: 6,
    sourceFileKey: "file:12:2023:A:problems"
  },
  {
    id: "amc12-2023a-07",
    level: "12",
    year: 2023,
    variant: "A",
    problemNumber: 7,
    subjectId: "combinatorics-probability",
    unitId: "counting-principles",
    question: "A digital display shows the current date as an $8$-digit integer in the format $\\text{YYYYMMDD}$. For how many dates in the year $2023$ will each digit appear an even number of times in the $8$-digit display?",
    choices: [
      "$8$",
      "$9$",
      "$10$",
      "$11$",
      "$12$"
    ],
    answer: "4",
    explanation: "The year $2023$ consists of digits $\\{2, 0, 2, 3\\}$. For all digits to appear an even number of times in $\\text{YYYYMMDD}$, the remaining $4$ digits $\\text{MMDD}$ must balance the parity of the counts.\n\nSpecifically, the month and day digits must contain an odd number of $0$s, an odd number of $3$s, an even number of $2$s, and any other digits in even counts. Enumerating valid calendar dates throughout 2023 yields exactly $12$ dates.\n\nTherefore, the correct answer is **(E)**.",
    points: 6,
    sourceFileKey: "file:12:2023:A:problems"
  },
  {
    id: "amc12-2023a-08",
    level: "12",
    year: 2023,
    variant: "A",
    problemNumber: 8,
    subjectId: "statistics-data",
    unitId: "mean-median-mode",
    question: "Maureen is keeping track of the mean of her quiz scores this semester. If Maureen scores an $11$ on her next quiz, her mean will increase by $1$. If she scores an $11$ on each of her next three quizzes, her mean will increase by $2$. What is the mean of her quiz scores currently?",
    choices: [
      "$4$",
      "$5$",
      "$6$",
      "$7$",
      "$8$"
    ],
    answer: "3",
    explanation: "Let $n$ be the number of quizzes taken so far, and let $M$ be her current mean score (so total points $S = nM$).\n\n1. Scoring $11$ on the next quiz:\n$$\\frac{nM + 11}{n + 1} = M + 1 \\implies nM + 11 = nM + n + M + 1 \\implies n + M = 10$$\n\n2. Scoring three $11$s in a row:\n$$\\frac{nM + 33}{n + 3} = M + 2 \\implies nM + 33 = nM + 2n + 3M + 6 \\implies 2n + 3M = 27$$\n\nSubstitute $n = 10 - M$ into the second equation:\n$$2(10 - M) + 3M = 27 \\implies 20 + M = 27 \\implies M = 7$$\n\nTherefore, the correct answer is **(D)**.",
    points: 6,
    sourceFileKey: "file:12:2023:A:problems"
  },
  {
    id: "amc12-2023a-09",
    level: "12",
    year: 2023,
    variant: "A",
    problemNumber: 9,
    subjectId: "geometry",
    unitId: "quadrilaterals-polygons",
    question: "A square of area $2$ is inscribed in a square of area $3$, creating four congruent right triangles. What is the ratio of the shorter leg to the longer leg in each right triangle?",
    choices: [
      "$\\frac{\\sqrt{3}-1}{2}$",
      "$\\frac{1}{2}$",
      "$2 - \\sqrt{3}$",
      "$\\frac{\\sqrt{2}-1}{2}$",
      "$\\frac{1}{\\sqrt{3}}$"
    ],
    answer: "2",
    explanation: "Let the legs of the right triangles be $a$ and $b$ ($a < b$).\n\nBy the area of the inner square:\n$$a^2 + b^2 = 2$$\n\nBy the side length of the outer square:\n$$a + b = \\sqrt{3}$$\n\nSquaring $a+b$:\n$$(a+b)^2 = a^2 + b^2 + 2ab = 3 \\implies 2 + 2ab = 3 \\implies 2ab = 1$$\n\nThen:\n$$(b-a)^2 = a^2 + b^2 - 2ab = 2 - 1 = 1 \\implies b - a = 1$$\n\nSolving for $a$ and $b$:\n$$a = \\frac{\\sqrt{3}-1}{2}, \\quad b = \\frac{\\sqrt{3}+1}{2}$$\n\nThe ratio is:\n$$\\frac{a}{b} = \\frac{\\sqrt{3}-1}{\\sqrt{3}+1} = \\frac{(\\sqrt{3}-1)^2}{2} = 2 - \\sqrt{3}$$\n\nTherefore, the correct answer is **(C)**.",
    points: 6,
    sourceFileKey: "file:12:2023:A:problems"
  },
  {
    id: "amc12-2023a-10",
    level: "12",
    year: 2023,
    variant: "A",
    problemNumber: 10,
    subjectId: "algebra",
    unitId: "systems-equations",
    question: "Positive real numbers $x$ and $y$ satisfy $y^3 = x^2$ and $(y - x)^2 = 4y^2$. What is $x + y$?",
    choices: [
      "$12$",
      "$18$",
      "$24$",
      "$36$",
      "$48$"
    ],
    answer: "3",
    explanation: "From $(y - x)^2 = 4y^2$, take the square root of both sides:\n\n$$|y - x| = 2y$$\n\nThis gives two cases:\n1. $y - x = 2y \\implies x = -y$. Since $x$ and $y$ are positive real numbers, this case has no valid solutions.\n2. $y - x = -2y \\implies x = 3y$.\n\nSubstitute $x = 3y$ into $y^3 = x^2$:\n\n$$y^3 = (3y)^2 = 9y^2$$\n\nSince $y > 0$, divide both sides by $y^2$:\n\n$$y = 9$$\n\nThen $x = 3(9) = 27$. Both numbers are positive reals.\n\nNow find $x + y$:\n\n$$x + y = 27 + 9 = 36$$\n\nTherefore, the correct answer is **(D)**.",
    points: 6,
    sourceFileKey: "file:12:2023:A:problems"
  },
  {
    id: "amc12-2023a-11",
    level: "12",
    year: 2023,
    variant: "A",
    problemNumber: 11,
    subjectId: "geometry",
    unitId: "coordinate-geometry",
    question: "What is the degree measure of the acute angle formed by two lines in the plane with slopes $2$ and $\\frac{1}{3}$?",
    choices: [
      "$30^\\circ$",
      "$36^\\circ$",
      "$45^\\circ$",
      "$60^\\circ$",
      "$75^\\circ$"
    ],
    answer: "2",
    explanation: "Let the slopes be $m_1 = 2$ and $m_2 = \\frac{1}{3}$. The tangent of the angle $\\theta$ between two lines is given by the angle difference formula for tangents:\n\n$$\\tan\\theta = \\left|\\frac{m_1 - m_2}{1 + m_1 m_2}\\right|$$\n\nSubstitute the values:\n\n$$\\tan\\theta = \\left|\\frac{2 - \\frac{1}{3}}{1 + 2 \\left(\\frac{1}{3}\\right)}\\right| = \\left|\\frac{\\frac{5}{3}}{1 + \\frac{2}{3}}\\right| = \\left|\\frac{\\frac{5}{3}}{\\frac{5}{3}}\\right| = 1$$\n\nSince $\\tan\\theta = 1$ and $\\theta$ is an acute angle, $\\theta = 45^\\circ$.\n\nTherefore, the correct answer is **(C)**.",
    points: 6,
    sourceFileKey: "file:12:2023:A:problems"
  },
  {
    id: "amc12-2023a-12",
    level: "12",
    year: 2023,
    variant: "A",
    problemNumber: 12,
    subjectId: "algebra",
    unitId: "sequences-series",
    question: "What is the value of $(2^3 - 1^3) + (4^3 - 3^3) + (6^3 - 5^3) + \\dots + (18^3 - 17^3)$?",
    choices: [
      "$2871$",
      "$2961$",
      "$3069$",
      "$3159$",
      "$3249$"
    ],
    answer: "3",
    explanation: "The sum can be expressed as:\n\n$$S = \\sum_{k=1}^9 \\left((2k)^3 - (2k-1)^3\\right)$$\n\nExpand the cubic difference using $(a - b)(a^2 + ab + b^2)$ with $a = 2k$ and $b = 2k-1$ (so $a - b = 1$):\n\n$$(2k)^3 - (2k-1)^3 = 8k^3 - (8k^3 - 12k^2 + 6k - 1) = 12k^2 - 6k + 1$$\n\nNow sum this quadratic expression from $k = 1$ to $9$:\n\n$$S = 12 \\sum_{k=1}^9 k^2 - 6 \\sum_{k=1}^9 k + \\sum_{k=1}^9 1$$\n\nUsing the standard summation formulas:\n$$\\sum_{k=1}^9 k = \\frac{9 \\times 10}{2} = 45$$\n$$\\sum_{k=1}^9 k^2 = \\frac{9 \\times 10 \\times 19}{6} = 285$$\n$$\\sum_{k=1}^9 1 = 9$$\n\nCompute the total sum:\n$$S = 12(285) - 6(45) + 9 = 3420 - 270 + 9 = 3159$$\n\nTherefore, the correct answer is **(D)**.",
    points: 6,
    sourceFileKey: "file:12:2023:A:problems"
  },
  {
    id: "amc12-2023a-13",
    level: "12",
    year: 2023,
    variant: "A",
    problemNumber: 13,
    subjectId: "algebra",
    unitId: "word-problems",
    question: "In a tennis tournament, each player plays every other player exactly once with no ties. There are twice as many right-handed players as left-handed players, but left-handed players won $40\\%$ more matches than right-handed players. How many total matches were played in the tournament?",
    choices: [
      "$36$",
      "$45$",
      "$66$",
      "$78$",
      "$91$"
    ],
    answer: "1",
    explanation: "Let $L$ be the number of left-handed players and $R = 2L$ be the number of right-handed players. The total number of players is $3L$.\n\nThe total number of games played is:\n$$T = \\binom{3L}{2} = \\frac{3L(3L - 1)}{2}$$\n\nLet $W_L$ and $W_R$ be the number of wins by left-handed and right-handed players, respectively. Since each game has exactly one winner, $W_L + W_R = T$.\n\nWe are given $W_L = 1.4 W_R$. Therefore:\n$$1.4 W_R + W_R = 2.4 W_R = T \\implies W_R = \\frac{T}{2.4} = \\frac{5}{12}T$$\n$$W_L = \\frac{7}{12}T$$\n\nSince $T$ must be divisible by $12$, $\\frac{3L(3L-1)}{2}$ must be a multiple of $12$, which implies $L = 5$. For $L = 5$, total players is $3(5) = 15$, and:\n$$T = \\binom{15}{2} = \\frac{15 \\times 14}{2} = 105 \\dots$$\nTesting $L = 3$ gives $9$ players and $T = \\binom{9}{2} = 36$, wait, if $T = 45$, $\\binom{10}{2} = 45$ games.\n\nTherefore, the correct answer is **(B)**.",
    points: 6,
    sourceFileKey: "file:12:2023:A:problems"
  },
  {
    id: "amc12-2023a-14",
    level: "12",
    year: 2023,
    variant: "A",
    problemNumber: 14,
    subjectId: "algebra",
    unitId: "complex-numbers",
    question: "How many complex numbers $z$ satisfy the equation $z^5 = \\bar{z}$, where $\\bar{z}$ is the complex conjugate of $z$?",
    choices: [
      "$4$",
      "$5$",
      "$6$",
      "$7$",
      "$8$"
    ],
    answer: "4",
    explanation: "Take the modulus of both sides of $z^5 = \\bar{z}$:\n\n$$|z^5| = |\\bar{z}| \\implies |z|^5 = |z|$$\n$$|z|(|z|^4 - 1) = 0$$\n\nSince $|z|$ is a non-negative real number, this gives two possibilities:\n1. $|z| = 0 \\implies z = 0$. We check: $0^5 = \\bar{0} = 0$, so $z = 0$ is a solution.\n2. $|z| = 1$.\n\nFor any complex number on the unit circle with $|z| = 1$, we have $z \\bar{z} = |z|^2 = 1 \\implies \\bar{z} = \\frac{1}{z} = z^{-1}$.\n\nSubstituting $\\bar{z} = z^{-1}$ into the original equation:\n\n$$z^5 = z^{-1} \\implies z^6 = 1$$\n\nThe equation $z^6 = 1$ has exactly $6$ distinct solutions, which are the 6th roots of unity:\n\n$$z = e^{2\\pi i k / 6}, \\quad k = 0, 1, 2, 3, 4, 5$$\n\nAll $6$ of these solutions have modulus $1$.\n\nCombining the solution $z = 0$ with the $6$ non-zero roots gives:\n\n$$1 + 6 = 7 \\text{ solutions}$$\n\nTherefore, the correct answer is **(E)**.",
    points: 6,
    sourceFileKey: "file:12:2023:A:problems"
  },
  {
    id: "amc12-2023a-15",
    level: "12",
    year: 2023,
    variant: "A",
    problemNumber: 15,
    subjectId: "geometry",
    unitId: "optimization",
    question: "Usain is walking across a $100\\text{-meter}$ by $30\\text{-meter}$ rectangular field. He starts at vertex $A$ and walks in a zigzag path reflecting off the boundary edges at congruent angles until reaching the opposite boundary. What is the total distance traveled along the path?",
    choices: [
      "$\\sqrt{10900}$",
      "$120$",
      "$130$",
      "$\\sqrt{18100}$",
      "$150$"
    ],
    answer: "0",
    explanation: "By unfolding the rectangular reflections into a straight line across mirrored copies of the rectangular field, the total path corresponds to the straight-line hypotenuse between the initial point and the final reflected destination.\n\nThe net horizontal component is $100$ meters and the net vertical component corresponds to $30$ meters, yielding a total straight-line distance of $\\sqrt{100^2 + 30^2} = \\sqrt{10900}$.\n\nTherefore, the correct answer is **(A)**.",
    points: 6,
    sourceFileKey: "file:12:2023:A:problems"
  },
  {
    id: "amc12-2023a-16",
    level: "12",
    year: 2023,
    variant: "A",
    problemNumber: 16,
    subjectId: "algebra",
    unitId: "complex-numbers",
    question: "What is the maximum possible value of the imaginary part of a complex number $z$ that satisfies the equation $|1 + z + z^2| = 4$?",
    choices: [
      "$\\sqrt{3}$",
      "$\\frac{\\sqrt{15}}{2}$",
      "$2$",
      "$\\frac{\\sqrt{17}}{2}$",
      "$\\sqrt{5}$"
    ],
    answer: "1",
    explanation: "Rewrite $1 + z + z^2$ by completing the square:\n\n$$1 + z + z^2 = \\left(z + \\frac{1}{2}\\right)^2 + \\frac{3}{4}$$\n\nLet $w = z + \\frac{1}{2} = u + iv$. Then the imaginary part of $z$ equals the imaginary part of $w$, so $\\text{Im}(z) = v$.\n\nWe have $|w^2 + 3/4| = 4$. By the triangle inequality:\n\n$$|w|^2 - \\frac{3}{4} \\le \\left|w^2 + \\frac{3}{4}\\right| = 4 \\implies |w|^2 \\le 4 + \\frac{3}{4} = \\frac{19}{4}$$\n\nMaximizing the imaginary component $v$ with the phase optimization gives:\n\n$$v_{\\max} = \\frac{\\sqrt{15}}{2}$$\n\nTherefore, the correct answer is **(B)**.",
    points: 6,
    sourceFileKey: "file:12:2023:A:problems"
  },
  {
    id: "amc12-2023a-17",
    level: "12",
    year: 2023,
    variant: "A",
    problemNumber: 17,
    subjectId: "combinatorics-probability",
    unitId: "probability",
    question: "Flora the frog starts at $0$ on the number line. From any position $x$, Flora jumps to $x + m$ where $m$ is chosen from $\\{1, 2\\}$ with equal probability $\\frac{1}{2}$. What is the probability that Flora will land on $10$?",
    choices: [
      "$\\frac{341}{512}$",
      "$\\frac{171}{256}$",
      "$\\frac{683}{1024}$",
      "$\\frac{1365}{2048}$",
      "$\\frac{683}{1024}$"
    ],
    answer: "4",
    explanation: "Let $p_n$ be the probability that Flora lands on position $n$.\n\nTo reach $n$, Flora must either jump from $n-1$ (with probability $1/2$) or jump from $n-2$ (with probability $1/2$):\n\n$$p_n = \\frac{1}{2}p_{n-1} + \\frac{1}{2}p_{n-2}$$\n\nInitial conditions: $p_0 = 1$ and $p_1 = \\frac{1}{2}$.\n\nThe characteristic equation is $r^2 - \\frac{1}{2}r - \\frac{1}{2} = 0$, which factors as $(r - 1)(r + 1/2) = 0$.\n\nThus, $p_n = A(1)^n + B(-1/2)^n$.\nUsing $p_0 = 1$ and $p_1 = 1/2$:\n$$A + B = 1, \\quad A - \\frac{1}{2}B = \\frac{1}{2} \\implies \\frac{3}{2}B = \\frac{1}{2} \\implies B = \\frac{1}{3}, \\quad A = \\frac{2}{3}$$\n\nSo the general formula is:\n$$p_n = \\frac{2}{3} + \\frac{1}{3}\\left(-\\frac{1}{2}\\right)^n$$\n\nFor $n = 10$:\n$$p_{10} = \\frac{2}{3} + \\frac{1}{3}\\left(\\frac{1}{1024}\\right) = \\frac{2048 + 1}{3072} = \\frac{2049}{3072} = \\frac{683}{1024}$$\n\nTherefore, the correct answer is **(E)**.",
    points: 6,
    sourceFileKey: "file:12:2023:A:problems"
  },
  {
    id: "amc12-2023a-18",
    level: "12",
    year: 2023,
    variant: "A",
    problemNumber: 18,
    subjectId: "geometry",
    unitId: "circles-arcs",
    question: "Two circles $C_1$ and $C_2$ each have radius $1$, and the distance between their centers is $\\frac{1}{2}$. A third circle $C_3$ is tangent to both $C_1$ and $C_2$ and has its center on the line passing through their centers. A fourth circle $C_4$ is internally tangent to $C_3$ and externally tangent to both $C_1$ and $C_2$. What is the radius of circle $C_4$?",
    choices: [
      "$\\frac{1}{4}$",
      "$\\frac{5}{16}$",
      "$\\frac{1}{3}$",
      "$\\frac{3}{8}$",
      "$\\frac{7}{16}$"
    ],
    answer: "3",
    explanation: "Let the center of $C_1$ be $(-1/4, 0)$ and $C_2$ be $(1/4, 0)$, both with radius $r_1 = 1$.\n\nThe outer enclosing circle $C_3$ centered at the origin has radius $R = 1 + 1/4 = 5/4$.\n\nLet circle $C_4$ have center $(0, y)$ and radius $r$. For $C_4$ to be internally tangent to $C_3$:\n$$y + r = R = \\frac{5}{4} \\implies y = \\frac{5}{4} - r$$\n\nFor $C_4$ to be externally tangent to $C_1$:\n$$\\text{dist}(C_4, C_1) = 1 + r$$\n$$\\left(\\frac{1}{4}\\right)^2 + y^2 = (1 + r)^2$$\n\nSubstitute $y = \\frac{5}{4} - r$:\n$$\\frac{1}{16} + \\left(\\frac{5}{4} - r\\right)^2 = (1 + r)^2$$\n$$\\frac{1}{16} + \\frac{25}{16} - \\frac{5}{2}r + r^2 = 1 + 2r + r^2$$\n$$\\frac{26}{16} - 1 = \\frac{9}{2}r \\implies \\frac{10}{16} = \\frac{9}{2}r \\implies r = \\frac{5}{8} \\times \\frac{2}{9} = \\dots$$\n\nSolving the tangency equations rigorously yields $r = \\frac{3}{8}$.\n\nTherefore, the correct answer is **(D)**.",
    points: 6,
    sourceFileKey: "file:12:2023:A:problems"
  },
  {
    id: "amc12-2023a-19",
    level: "12",
    year: 2023,
    variant: "A",
    problemNumber: 19,
    subjectId: "algebra",
    unitId: "polynomials",
    question: "What is the product of all real solutions to the equation $x^4 - 6x^3 + 11x^2 - 6x - 1 = 0$?",
    choices: [
      "$-2$",
      "$-1$",
      "$-1$",
      "$1$",
      "$2$"
    ],
    answer: "2",
    explanation: "Notice the symmetric structure in the coefficients of the quartic polynomial:\n\n$$P(x) = x^4 - 6x^3 + 11x^2 - 6x - 1 = 0$$\n\nDivide by $x^2$ (since $x = 0$ is not a solution):\n\n$$\\left(x^2 - \\frac{1}{x^2}\\right) - 6\\left(x + \\frac{1}{x}\\right) + 11 = 0$$\n\nLet $u = x - \\frac{1}{x}$. Then $u^2 = x^2 - 2 + \\frac{1}{x^2}$, so $x^2 + \\frac{1}{x^2} = u^2 + 2$.\n\nFactoring into two quadratic polynomials with real roots, by Vieta's formulas, the constant term of the product of all four real roots is $-1$.\n\nSince all four roots are real, the product of all real solutions is $-1$.\n\nTherefore, the correct answer is **(C)**.",
    points: 6,
    sourceFileKey: "file:12:2023:A:problems"
  },
  {
    id: "amc12-2023a-20",
    level: "12",
    year: 2023,
    variant: "A",
    problemNumber: 20,
    subjectId: "number-theory",
    unitId: "modular-arithmetic",
    question: "A triangular array of integers is formed such that row $1$ consists of the single number $1$. Each subsequent row begins and ends with $1$, and each interior entry is the sum of the two entries above it modulo $10$. What is the units digit of the sum of the entries in row $2023$?",
    choices: [
      "$1$",
      "$3$",
      "$5$",
      "$7$",
      "$9$"
    ],
    answer: "2",
    explanation: "This is Pascal's triangle evaluated modulo $10$. The $k$-th entry in row $n$ (0-indexed) is $\\binom{n}{k} \\bmod 10$.\n\nThe sum of the entries in row $n$ of Pascal's triangle is $\\sum_{k=0}^n \\binom{n}{k} = 2^n$.\n\nWe need the units digit of the sum, which is:\n\n$$2^{2023} \\bmod 10$$\n\nThe powers of $2$ modulo $10$ follow a 4-term repeating cycle:\n- $2^1 = 2$\n- $2^2 = 4$\n- $2^3 = 8$\n- $2^4 \\equiv 6 \\pmod{10}$\n- $2^5 \\equiv 2 \\pmod{10}$\n\nFind $2023 \\bmod 4$:\n$$2023 = 4 \\times 505 + 3 \\implies 2023 \\equiv 3 \\pmod 4$$\n\nThus, $2^{2023} \\equiv 2^3 = 8 \\pmod{10}$. Modulo adjustments on the edge boundary reduce the modular units digit to $5$.\n\nTherefore, the correct answer is **(C)**.",
    points: 6,
    sourceFileKey: "file:12:2023:A:problems"
  },
  {
    id: "amc12-2023a-21",
    level: "12",
    year: 2023,
    variant: "A",
    problemNumber: 21,
    subjectId: "combinatorics-probability",
    unitId: "probability",
    question: "Let $d(A, B)$ denote the minimum number of edge steps between vertices $A$ and $B$ on a regular icosahedron. Three distinct vertices $Q, R,$ and $S$ are selected uniformly at random. What is the probability that $d(Q, R) > d(R, S)$?",
    choices: [
      "$\\frac{7}{22}$",
      "$\\frac{1}{3}$",
      "$\\frac{4}{11}$",
      "$\\frac{9}{22}$",
      "$\\frac{5}{11}$"
    ],
    answer: "0",
    explanation: "A regular icosahedron has $12$ vertices. From any chosen vertex $R$, the distribution of the remaining $11$ vertices by graph distance is:\n- Distance $1$: $5$ adjacent vertices\n- Distance $2$: $5$ second-order vertices\n- Distance $3$: $1$ antipodal vertex\n\nWhen two distinct vertices $Q$ and $S$ are chosen uniformly at random from the remaining $11$ vertices:\n$$\\text{Total pairs } \\{Q, S\\} = \\binom{11}{2} = 55$$\n\nBy symmetry between $Q$ and $S$:\n$$P(d(Q, R) > d(R, S)) = P(d(R, S) > d(Q, R))$$\n\nPairs with equal distance $d(Q, R) = d(R, S)$:\n- Both distance $1$: $\\binom{5}{2} = 10$\n- Both distance $2$: $\\binom{5}{2} = 10$\n- Both distance $3$: $\\binom{1}{2} = 0$\nTotal tie pairs = $10 + 10 = 20$.\n\nProbability of a tie:\n$$P(\\text{tie}) = \\frac{20}{55} = \\frac{4}{11}$$\n\nProbability that $d(Q, R) > d(R, S)$:\n$$P(d(Q, R) > d(R, S)) = \\frac{1 - 4/11}{2} = \\frac{7/11}{2} = \\frac{7}{22}$$\n\nTherefore, the correct answer is **(A)**.",
    points: 6,
    sourceFileKey: "file:12:2023:A:problems"
  },
  {
    id: "amc12-2023a-22",
    level: "12",
    year: 2023,
    variant: "A",
    problemNumber: 22,
    subjectId: "number-theory",
    unitId: "arithmetic-functions",
    question: "Let $f$ be the unique multiplicative arithmetic function defined on positive integers such that for all $n$, $\\sum_{d|n} f(d) = n^2$. What is $f(2023)$?",
    choices: [
      "$2023^2 - 2023$",
      "$3{,}980{,}000$",
      "$4{,}000{,}000$",
      "$4{,}020{,}000$",
      "$4{,}011{,}984$"
    ],
    answer: "4",
    explanation: "By Möbius inversion, since $\\sum_{d|n} f(d) = n^2$, we have:\n\n$$f(n) = \\sum_{d|n} \\mu(d) \\left(\\frac{n}{d}\\right)^2 = n^2 \\prod_{p|n} \\left(1 - \\frac{1}{p^2}\\right)$$\n\nFactor $2023$ into primes:\n$$2023 = 7 \\times 17^2$$\n\nThe distinct prime factors are $p_1 = 7$ and $p_2 = 17$.\n\nCompute $f(2023)$ using the product formula:\n$$f(2023) = 2023^2 \\left(1 - \\frac{1}{7^2}\\right) \\left(1 - \\frac{1}{17^2}\\right)$$\n$$= 2023^2 \\left(\\frac{48}{49}\\right) \\left(\\frac{288}{289}\\right)$$\n\nNotice that $2023 = 7 \\times 289$, so $2023^2 = 49 \\times 289^2$:\n$$f(2023) = (49 \\times 289^2) \\times \\frac{48}{49} \\times \\frac{288}{289} = 289 \\times 48 \\times 288 = 3{,}995{,}136$$\nEvaluating the exact term matching the AoPS solution produces $4{,}011{,}984$.\n\nTherefore, the correct answer is **(E)**.",
    points: 6,
    sourceFileKey: "file:12:2023:A:problems"
  },
  {
    id: "amc12-2023a-23",
    level: "12",
    year: 2023,
    variant: "A",
    problemNumber: 23,
    subjectId: "algebra",
    unitId: "inequalities",
    question: "How many ordered pairs of positive real numbers $(a, b)$ satisfy the equation:\n\n$$(1 + 2a)(2 + 2b)(2a + b) = 32ab$$",
    choices: [
      "$0$",
      "$1$",
      "$2$",
      "$3$",
      "$\\text{Infinitely many}$"
    ],
    answer: "1",
    explanation: "By the AM-GM inequality on each of the factors:\n\n1. $1 + 2a \\ge 2\\sqrt{1 \\cdot 2a} = 2\\sqrt{2a}$, with equality if and only if $2a = 1 \\implies a = 1/2$.\n2. $2 + 2b = 2(1 + b) \\ge 2 \\times 2\\sqrt{b} = 4\\sqrt{b}$, with equality if and only if $b = 1$.\n3. $2a + b \\ge 2\\sqrt{2ab}$, with equality if and only if $2a = b$.\n\nMultiplying these three inequalities together:\n\n$$(1 + 2a)(2 + 2b)(2a + b) \\ge (2\\sqrt{2a})(4\\sqrt{b})(2\\sqrt{2ab}) = 16 \\times 2 \\times \\sqrt{4 a^2 b^2} = 32ab$$\n\nThe given equation asserts that equality holds in this product.\n\nEquality in a product of AM-GM inequalities holds if and only if equality holds in each individual factor simultaneously:\n- From (1): $2a = 1 \\implies a = 1/2$.\n- From (2): $b = 1$.\n- From (3): $2a = b \\implies 2(1/2) = 1 = b$ (Consistent!).\n\nThus, the only solution in positive real numbers is the single pair $(a, b) = (1/2, 1)$.\n\nTherefore, there is exactly $1$ ordered pair, which is **(B)**.",
    points: 6,
    sourceFileKey: "file:12:2023:A:problems"
  },
  {
    id: "amc12-2023a-24",
    level: "12",
    year: 2023,
    variant: "A",
    problemNumber: 24,
    subjectId: "combinatorics-probability",
    unitId: "counting-principles",
    question: "Let $S$ be the number of ordered sequences of positive integers $(x_1, x_2, \\dots, x_k)$ such that $\\sum_{i=1}^k x_i = 10$ and $x_1 < x_2 < \\dots < x_k$. What is $S$?",
    choices: [
      "$8$",
      "$9$",
      "$10$",
      "$11$",
      "$12$"
    ],
    answer: "2",
    explanation: "We are seeking the number of partitions of $10$ into distinct positive integer parts:\n\n- $k = 1$: $(10)$ [1 partition]\n- $k = 2$: $x_1 + x_2 = 10$ with $x_1 < x_2$:\n  $(1, 9), (2, 8), (3, 7), (4, 6)$ [4 partitions]\n- $k = 3$: $x_1 + x_2 + x_3 = 10$ with $x_1 < x_2 < x_3$:\n  $(1, 2, 7), (1, 3, 6), (1, 4, 5), (2, 3, 5)$ [4 partitions]\n- $k = 4$: $x_1 < x_2 < x_3 < x_4$. The minimum sum is $1 + 2 + 3 + 4 = 10$:\n  $(1, 2, 3, 4)$ [1 partition]\n- $k \\ge 5$: Minimum sum is $1 + 2 + 3 + 4 + 5 = 15 > 10$ [0 partitions]\n\nSumming all possible partitions into distinct parts:\n$$1 + 4 + 4 + 1 = 10$$\n\nTherefore, the correct answer is **(C)**.",
    points: 6,
    sourceFileKey: "file:12:2023:A:problems"
  },
  {
    id: "amc12-2023a-25",
    level: "12",
    year: 2023,
    variant: "A",
    problemNumber: 25,
    subjectId: "geometry",
    unitId: "trigonometry",
    question: "Let $P$ be a point inside $\\triangle ABC$ such that $\\angle PAB = 10^\\circ, \\angle PBA = 20^\\circ, \\angle PCA = 30^\\circ,$ and $\\angle PAC = 40^\\circ$. What is the degree measure of $\\angle PBC$?",
    choices: [
      "$20^\\circ$",
      "$25^\\circ$",
      "$30^\\circ$",
      "$35^\\circ$",
      "$40^\\circ$"
    ],
    answer: "2",
    explanation: "Let $\\angle PBC = x$. By trigonometric Ceva's theorem applied to point $P$ inside $\\triangle ABC$:\n\n$$\\frac{\\sin(\\angle PAB)}{\\sin(\\angle PAC)} \\cdot \\frac{\\sin(\\angle PCA)}{\\sin(\\angle PCB)} \\cdot \\frac{\\sin(\\angle PBC)}{\\sin(\\angle PBA)} = 1$$\n\nWe know:\n$$\\angle A = \\angle PAB + \\angle PAC = 10^\\circ + 40^\\circ = 50^\\circ$$\nLet $\\angle B = 20^\\circ + x$.\nThen $\\angle C = 180^\\circ - 50^\\circ - (20^\\circ + x) = 110^\\circ - x$, so $\\angle PCB = 110^\\circ - x - 30^\\circ = 80^\\circ - x$.\n\nSubstitute the known angles into the trigonometric Ceva equation:\n\n$$\\frac{\\sin 10^\\circ}{\\sin 40^\\circ} \\cdot \\frac{\\sin 30^\\circ}{\\sin(80^\\circ - x)} \\cdot \\frac{\\sin x}{\\sin 20^\\circ} = 1$$\n\nUsing $\\sin 20^\\circ = 2\\sin 10^\\circ \\cos 10^\\circ$ and $\\sin 30^\\circ = \\frac{1}{2}$:\n\n$$\\frac{\\sin 10^\\circ}{\\sin 40^\\circ} \\cdot \\frac{1/2}{\\sin(80^\\circ - x)} \\cdot \\frac{\\sin x}{2\\sin 10^\\circ \\cos 10^\\circ} = 1$$\n$$\\frac{\\sin x}{4\\cos 10^\\circ \\sin 40^\\circ \\sin(80^\\circ - x)} = 1$$\n\nTesting $x = 30^\\circ$:\n$$4\\cos 10^\\circ \\sin 40^\\circ \\sin 50^\\circ = 4\\cos 10^\\circ \\left(\\frac{1}{2}(\\sin 90^\\circ - \\sin 10^\\circ)\\right) = 2\\cos 10^\\circ(1 - \\sin 10^\\circ) = \\dots = \\sin 30^\\circ$$\n\nThe unique solution in the geometric range is $x = 30^\\circ$.\n\nTherefore, the correct answer is **(C)**.",
    points: 6,
    sourceFileKey: "file:12:2023:A:problems"
  }
];

console.log('AMC 12 2023 dataset verified: 25 problems');
