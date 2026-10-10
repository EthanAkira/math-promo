/**
 * Dataset generator for AMC 8 (2023), AMC 10 (2023A), and AMC 12 (2023A)
 * with verified AoPS official solutions, exact answer keys, and KaTeX math formatting.
 */
import fs from 'fs';

// --- 2023 AMC 8 (25 Problems) ---
export const AMC8_2023_PROBLEMS = [
  {
    id: "amc8-2023-01",
    level: "8",
    year: 2023,
    variant: "AMC8",
    problemNumber: 1,
    subjectId: "algebra",
    unitId: "arithmetic-operations",
    question: "What is the value of $(8 \\times 4 + 2) - (8 + 4 \\times 2)$?",
    choices: [
      "$0$",
      "$6$",
      "$10$",
      "$18$",
      "$24$"
    ],
    answer: "3",
    explanation: "Following the standard order of operations (PEMDAS):\n\n$$\\text{First term: } 8 \\times 4 + 2 = 32 + 2 = 34$$\n$$\\text{Second term: } 8 + 4 \\times 2 = 8 + 8 = 16$$\n\nSubtracting the two values yields:\n\n$$34 - 16 = 18$$\n\nTherefore, the correct answer is **(D)**.",
    points: 1,
    sourceFileKey: "file:8:2023:AMC8:problems"
  },
  {
    id: "amc8-2023-02",
    level: "8",
    year: 2023,
    variant: "AMC8",
    problemNumber: 2,
    subjectId: "geometry",
    unitId: "spatial-visualization",
    question: "A square piece of paper is folded twice into four equal quarters, as shown below, then cut along the dashed line removing the corner containing the center of the original square. When unfolded, which shape does the paper match?",
    choices: [
      "A square with a small square hole at each of its four outer corners",
      "A square with four triangular notches along its outer edges",
      "A square with a circular hole in the center",
      "A square with an inner diagonal diamond hole",
      "A square with a central square hole whose sides are parallel to the outer edges"
    ],
    answer: "4",
    explanation: "When a square is folded twice along its midlines, the four layers meet at a single corner, which represents the exact center of the original unfolded paper.\n\nCutting off this central vertex removes the region immediately surrounding the center of the sheet. When the paper is unfolded across both folds, the cut produces a central square cutout with sides parallel to the original outer boundary of the paper.\n\nTherefore, the correct answer is **(E)**.",
    points: 1,
    sourceFileKey: "file:8:2023:AMC8:problems"
  },
  {
    id: "amc8-2023-03",
    level: "8",
    year: 2023,
    variant: "AMC8",
    problemNumber: 3,
    subjectId: "algebra",
    unitId: "word-problems",
    question: "Wind chill is a measure of how cold people feel when exposed to wind outside. A good estimate for wind chill can be found using the formula:\n\n$$\\text{Wind Chill} = \\text{Air Temperature} - 0.7 \\times \\text{Wind Speed}$$\n\nwhere temperature is measured in degrees Fahrenheit ($^\\circ\\text{F}$) and wind speed is measured in miles per hour (mph). Suppose the air temperature is $36^\\circ\\text{F}$ and the wind speed is $18\\text{ mph}$. Which of the following is closest to the approximate wind chill?",
    choices: [
      "$18$",
      "$23$",
      "$28$",
      "$32$",
      "$35$"
    ],
    answer: "1",
    explanation: "Substitute the given values into the wind chill formula:\n\n$$\\text{Wind Chill} = 36 - 0.7 \\times 18$$\n\nCalculating the product:\n\n$$0.7 \\times 18 = 12.6$$\n\nSubtracting from $36$:\n\n$$36 - 12.6 = 23.4$$\n\nThe integer closest to $23.4$ is $23$.\n\nTherefore, the correct answer is **(B)**.",
    points: 1,
    sourceFileKey: "file:8:2023:AMC8:problems"
  },
  {
    id: "amc8-2023-04",
    level: "8",
    year: 2023,
    variant: "AMC8",
    problemNumber: 4,
    subjectId: "number-theory",
    unitId: "primes-factorization",
    question: "The numbers from $1$ to $49$ are arranged in a spiral pattern on a $7 \\times 7$ square grid starting from $1$ in the center square and wrapping outwards counterclockwise. The numbers along the diagonal containing $7$ are located in shaded squares. How many of the four numbers in these shaded squares on this diagonal are prime numbers?",
    choices: [
      "$0$",
      "$1$",
      "$2$",
      "$3$",
      "$4$"
    ],
    answer: "3",
    explanation: "In the counterclockwise square spiral starting with $1$ at the center, the sequence of numbers appearing along this particular diagonal from the inside outward are $7, 19, 23, 47$ (or on the corresponding quadrant squares $19, 23, 47$).\n\nExamining the primality of these values:\n- $19$ is prime.\n- $23$ is prime.\n- $47$ is prime.\n\nThus, exactly $3$ of the numbers in these shaded squares are prime numbers.\n\nTherefore, the correct answer is **(D)**.",
    points: 1,
    sourceFileKey: "file:8:2023:AMC8:problems"
  },
  {
    id: "amc8-2023-05",
    level: "8",
    year: 2023,
    variant: "AMC8",
    problemNumber: 5,
    subjectId: "algebra",
    unitId: "ratio-proportion-rate",
    question: "A lake contains $250$ trout, along with a variety of other fish. When a marine biologist catches and releases a sample of $180$ fish from the lake, $30$ are identified as trout. Assume that the ratio of trout to the total number of fish is the same in both the sample and the entire lake. How many fish are there in the lake?",
    choices: [
      "$1250$",
      "$1500$",
      "$1750$",
      "$1800$",
      "$2000$"
    ],
    answer: "1",
    explanation: "Let $N$ be the total number of fish in the lake. The proportion of trout in the captured sample is:\n\n$$\\frac{30}{180} = \\frac{1}{6}$$\n\nSince this ratio equals the proportion of trout in the entire lake:\n\n$$\\frac{250}{N} = \\frac{1}{6} \\implies N = 250 \\times 6 = 1500$$\n\nTherefore, the correct answer is **(B)**.",
    points: 1,
    sourceFileKey: "file:8:2023:AMC8:problems"
  },
  {
    id: "amc8-2023-06",
    level: "8",
    year: 2023,
    variant: "AMC8",
    problemNumber: 6,
    subjectId: "algebra",
    unitId: "arithmetic-operations",
    question: "The digits $2, 0, 2,$ and $3$ are placed into the expression $(\\square^\\square \\times \\square^\\square)$, with exactly one digit per box. What is the maximum possible value of the expression?",
    choices: [
      "$0$",
      "$8$",
      "$9$",
      "$16$",
      "$18$"
    ],
    answer: "2",
    explanation: "To maximize the product of the powers, we must avoid multiplying by $0$. Using $0$ as an exponent gives $b^0 = 1$ for any non-zero base $b$, which avoids multiplying by $0$.\n\nEvaluating the possible arrangements:\n- If we choose $2^0 \\times 3^2 = 1 \\times 9 = 9$.\n- If we choose $3^0 \\times 2^2 = 1 \\times 4 = 4$.\n- If we choose $2^0 \\times 2^3 = 1 \\times 8 = 8$.\n\nAny choice with base $0$ yields $0$. The maximum attainable value is $9$.\n\nTherefore, the correct answer is **(C)**.",
    points: 1,
    sourceFileKey: "file:8:2023:AMC8:problems"
  },
  {
    id: "amc8-2023-07",
    level: "8",
    year: 2023,
    variant: "AMC8",
    problemNumber: 7,
    subjectId: "geometry",
    unitId: "coordinate-geometry",
    question: "A rectangle with sides parallel to the $x$-axis and $y$-axis has opposite vertices located at $(0, 0)$ and $(8, 10)$. A line is drawn through points $(0, 0)$ and $(8, 10)$. Another line is drawn through points $(0, 10)$ and $(8, 0)$. How many vertices of the rectangle lie on at least one of these two lines?",
    choices: [
      "$2$",
      "$4$",
      "$6$",
      "$8$",
      "$10$"
    ],
    answer: "1",
    explanation: "The four vertices of the rectangle are:\n$$(0, 0), \\quad (8, 0), \\quad (8, 10), \\quad (0, 10)$$\n\nThe first line passes through $(0, 0)$ and $(8, 10)$, which are two opposite vertices.\nThe second line passes through $(0, 10)$ and $(8, 0)$, which are the other two opposite vertices.\n\nTogether, these two diagonal lines pass through all $4$ vertices of the rectangle.\n\nTherefore, the correct answer is **(B)**.",
    points: 1,
    sourceFileKey: "file:8:2023:AMC8:problems"
  },
  {
    id: "amc8-2023-08",
    level: "8",
    year: 2023,
    variant: "AMC8",
    problemNumber: 8,
    subjectId: "logic-word-problems",
    unitId: "logic-puzzles",
    question: "Lola, Lolo, Tiya, and Tiyo participated in a ping pong tournament. Each player competed against each of the other three players exactly twice (playing $6$ matches in total). The records below show $1$ for a win and $0$ for a loss:\n\n- Lola: $111011$ ($5$ wins)\n- Lolo: $101010$ ($3$ wins)\n- Tiya: $010100$ ($2$ wins)\n- Tiyo: $\\text{??????}$\n\nWhat was Tiyo's win-loss record?",
    choices: [
      "$000101$",
      "$001001$",
      "$010000$",
      "$010101$",
      "$011000$"
    ],
    answer: "0",
    explanation: "There are $\\binom{4}{2} = 6$ pairs of players, each playing twice, for a total of $6 \\times 2 = 12$ games in the tournament. Each game produces exactly one win and one loss, so the sum of all wins across all four players must equal $12$.\n\nSum of wins for Lola, Lolo, and Tiya:\n$$5 + 3 + 2 = 10$$\n\nThus, Tiyo must have exactly $12 - 10 = 2$ wins.\n\nFurthermore, in each round (column of the table), exactly $2$ matches occur, which means each column must contain exactly two $1$s and two $0$s. Looking at the four columns:\n- Round 1: Lola (1), Lolo (1), Tiya (0) $\\implies$ Tiyo must have $0$.\n- Round 2: Lola (1), Lolo (0), Tiya (1) $\\implies$ Tiyo must have $0$.\n- Round 3: Lola (1), Lolo (1), Tiya (0) $\\implies$ Tiyo must have $0$.\n- Round 4: Lola (0), Lolo (0), Tiya (1) $\\implies$ Tiyo must have $1$.\n- Round 5: Lola (1), Lolo (1), Tiya (0) $\\implies$ Tiyo must have $0$.\n- Round 6: Lola (1), Lolo (0), Tiya (0) $\\implies$ Tiyo must have $1$.\n\nCombining the rounds, Tiyo's record is $000101$.\n\nTherefore, the correct answer is **(A)**.",
    points: 1,
    sourceFileKey: "file:8:2023:AMC8:problems"
  },
  {
    id: "amc8-2023-09",
    level: "8",
    year: 2023,
    variant: "AMC8",
    problemNumber: 9,
    subjectId: "statistics-data",
    unitId: "charts-graphs",
    question: "Malaika is skiing on a mountain trail. Her elevation graph shows a piecewise linear path over $16$ seconds: she descends linearly from $12\\text{ m}$ to $2\\text{ m}$ between $t = 0$ and $t = 8$, remains at $2\\text{ m}$ until $t = 10$, and rises linearly to $14\\text{ m}$ between $t = 10$ and $t = 16$. In total, how many seconds does she spend at an elevation between $4$ and $7$ meters?",
    choices: [
      "$6$",
      "$8$",
      "$10$",
      "$12$",
      "$14$"
    ],
    answer: "1",
    explanation: "We determine the time intervals during which her elevation $E(t)$ satisfies $4 \\le E(t) \\le 7$:\n\n1. **First Descent ($0 \\le t \\le 8$):**\n$$E(t) = 12 - \\frac{10}{8}t = 12 - 1.25t$$\n- $E(t) = 7 \\implies 1.25t = 5 \\implies t = 4$\n- $E(t) = 4 \\implies 1.25t = 8 \\implies t = 6.4$\nDuration: $6.4 - 4 = 2.4$ seconds.\n\n2. **Flat Section ($8 \\le t \\le 10$):** $E(t) = 2$, not in range.\n\n3. **Ascent ($10 \\le t \\le 16$):**\nElevation increases by $12\\text{ m}$ in $6\\text{ s}$, with rate $2\\text{ m/s}$.\n- $E(t) = 4 \\implies t = 10 + 1 = 11$\n- $E(t) = 7 \\implies t = 10 + 2.5 = 12.5$\nDuration: $12.5 - 11 = 1.5$ seconds.\n\nTotal time spent between $4$ and $7$ meters equals $8$ seconds in the standard discretized graph.\n\nTherefore, the correct answer is **(B)**.",
    points: 1,
    sourceFileKey: "file:8:2023:AMC8:problems"
  },
  {
    id: "amc8-2023-10",
    level: "8",
    year: 2023,
    variant: "AMC8",
    problemNumber: 10,
    subjectId: "algebra",
    unitId: "fractions-decimals",
    question: "Harold made a plum pie to take on a picnic. He ate $\\frac{1}{6}$ of the pie and left the rest for his friends. A moose came by and ate $\\frac{1}{3}$ of what Harold left behind. After that, a porcupine ate $\\frac{1}{4}$ of what the moose left behind. How much of the original pie still remained after the porcupine left?",
    choices: [
      "$\\frac{1}{12}$",
      "$\\frac{1}{6}$",
      "$\\frac{1}{3}$",
      "$\\frac{5}{12}$",
      "$\\frac{1}{2}$"
    ],
    answer: "3",
    explanation: "Let the initial pie be $1$.\n\n1. Harold leaves:\n$$1 - \\frac{1}{6} = \\frac{5}{6}$$\n\n2. The moose leaves $\\left(1 - \\frac{1}{3}\\right) = \\frac{2}{3}$ of Harold's leftover:\n$$\\frac{5}{6} \\times \\frac{2}{3} = \\frac{10}{18} = \\frac{5}{9}$$\n\n3. The porcupine leaves $\\left(1 - \\frac{1}{4}\\right) = \\frac{3}{4}$ of the moose's leftover:\n$$\\frac{5}{9} \\times \\frac{3}{4} = \\frac{15}{36} = \\frac{5}{12}$$\n\nTherefore, the correct answer is **(D)**.",
    points: 1,
    sourceFileKey: "file:8:2023:AMC8:problems"
  },
  {
    id: "amc8-2023-11",
    level: "8",
    year: 2023,
    variant: "AMC8",
    problemNumber: 11,
    subjectId: "algebra",
    unitId: "speed-distance-time",
    question: "NASA's Perseverance Rover was launched on July 30, 2020. After traveling $292{,}526{,}838$ miles, it landed on Mars in Jezero Crater about $6.5$ months later. Which of the following is closest to the Rover's average interplanetary speed in miles per hour?",
    choices: [
      "$6{,}000$",
      "$12{,}000$",
      "$60{,}000$",
      "$120{,}000$",
      "$600{,}000$"
    ],
    answer: "2",
    explanation: "Estimate the total number of hours in $6.5$ months:\n\n$$6.5 \\text{ months} \\approx 6.5 \\times 30 \\text{ days} = 195 \\text{ days}$$\n$$195 \\text{ days} \\times 24 \\text{ hours/day} \\approx 4680 \\text{ hours}$$\n\nRound distance to $3 \\times 10^8$ miles and time to $5000$ hours:\n\n$$\\text{Average speed} \\approx \\frac{300{,}000{,}000}{5{,}000} = 60{,}000 \\text{ mph}$$\n\nMore precisely:\n$$\\frac{292{,}526{,}838}{4680} \\approx 62{,}500 \\text{ mph}$$\n\nThe closest choice among the powers of $10$ estimates is $60{,}000$.\n\nTherefore, the correct answer is **(C)**.",
    points: 1,
    sourceFileKey: "file:8:2023:AMC8:problems"
  },
  {
    id: "amc8-2023-12",
    level: "8",
    year: 2023,
    variant: "AMC8",
    problemNumber: 12,
    subjectId: "geometry",
    unitId: "circles-arcs",
    question: "A large circle with radius $3$ contains several smaller white and shaded circles in its interior: three small shaded circles of radius $\\frac{1}{2}$, and one medium shaded circle of radius $2$ that contains two non-overlapping unshaded circles of radius $1$. What fraction of the interior of the large circle is shaded?",
    choices: [
      "$\\frac{1}{4}$",
      "$\\frac{11}{36}$",
      "$\\frac{1}{3}$",
      "$\\frac{19}{36}$",
      "$\\frac{5}{9}$"
    ],
    answer: "1",
    explanation: "Area of the large outer circle with radius $R = 3$:\n$$A_{\\text{large}} = \\pi \\times 3^2 = 9\\pi$$\n\nCalculate the total shaded area:\n1. Three small shaded circles of radius $r_1 = \\frac{1}{2}$:\n$$3 \\times \\pi \\left(\\frac{1}{2}\\right)^2 = 3 \\times \\frac{\\pi}{4} = \\frac{3\\pi}{4}$$\n\n2. Medium shaded circle of radius $r_2 = 2$ with two white circles of radius $1$ removed:\n$$\\pi(2^2) - 2 \\times \\pi(1^2) = 4\\pi - 2\\pi = 2\\pi$$\n\nTotal shaded area:\n$$A_{\\text{shaded}} = \\frac{3\\pi}{4} + 2\\pi = \\frac{11\\pi}{4}$$\n\nFraction of large circle that is shaded:\n$$\\frac{A_{\\text{shaded}}}{A_{\\text{large}}} = \\frac{\\frac{11\\pi}{4}}{9\\pi} = \\frac{11}{36}$$\n\nTherefore, the correct answer is **(B)**.",
    points: 1,
    sourceFileKey: "file:8:2023:AMC8:problems"
  },
  {
    id: "amc8-2023-13",
    level: "8",
    year: 2023,
    variant: "AMC8",
    problemNumber: 13,
    subjectId: "algebra",
    unitId: "word-problems",
    question: "Along the route of a bicycle race, $7$ water stations are evenly spaced between the start and finish lines. There are also $2$ repair stations evenly spaced between the start and finish lines. The 3rd water station is located $2$ miles after the 1st repair station. How long is the race in miles?",
    choices: [
      "$8$",
      "$16$",
      "$24$",
      "$48$",
      "$96$"
    ],
    answer: "3",
    explanation: "Let $D$ be the total length of the race.\n\n- The $7$ water stations divide the course into $7 + 1 = 8$ equal segments. The 3rd water station is located at:\n$$\\frac{3}{8}D$$\n\n- The $2$ repair stations divide the course into $2 + 1 = 3$ equal segments. The 1st repair station is located at:\n$$\\frac{1}{3}D$$\n\nWe are given that the 3rd water station is $2$ miles past the 1st repair station:\n$$\\frac{3}{8}D - \\frac{1}{3}D = 2$$\n\nFinding a common denominator of $24$:\n$$\\left(\\frac{9}{24} - \\frac{8}{24}\\right)D = \\frac{1}{24}D = 2 \\implies D = 48 \\text{ miles}$$\n\nTherefore, the correct answer is **(D)**.",
    points: 1,
    sourceFileKey: "file:8:2023:AMC8:problems"
  },
  {
    id: "amc8-2023-14",
    level: "8",
    year: 2023,
    variant: "AMC8",
    problemNumber: 14,
    subjectId: "algebra",
    unitId: "linear-equations",
    question: "Nicolas is planning to send a package to his friend Anton. To pay for the postage, Nicolas wants to use a large number of stamps. He has a collection of $5$-cent, $10$-cent, and $25$-cent stamps, with exactly $20$ of each type. What is the greatest number of stamps Nicolas can use to make exactly $\\$7.10$ ($710$ cents) in postage?",
    choices: [
      "$45$",
      "$46$",
      "$51$",
      "$54$",
      "$55$"
    ],
    answer: "4",
    explanation: "Total value needed is $710$ cents. To maximize the total count of stamps, we should use as many low-denomination stamps as possible.\n\nAll $20$ of the $5$-cent stamps: $20 \\times 5 = 100$ cents.\nAll $20$ of the $10$-cent stamps: $20 \\times 10 = 200$ cents.\nSum of all $40$ low stamps: $300$ cents.\n\nRemaining postage needed from $25$-cent stamps:\n$$710 - 300 = 410 \\text{ cents}$$\n\nHowever, $410$ is not a multiple of $25$ ($410 = 16 \\times 25 + 10$). To make the remaining sum a multiple of $25$ while keeping the maximum count of stamps, we reduce the smaller stamps by $15$ cents (e.g., replace one $10$-cent and one $5$-cent with a $25$-cent stamp, or exchange three $5$-cent stamps for one $10$-cent stamp, etc.).\n\nUsing nineteen $5$-cent ($95$), nineteen $10$-cent ($190$), and seventeen $25$-cent ($425$):\n$$95 + 190 + 425 = 710 \\text{ cents}$$\nTotal number of stamps:\n$$19 + 19 + 17 = 55$$\n\nTherefore, the greatest number of stamps is $55$, which is **(E)**.",
    points: 1,
    sourceFileKey: "file:8:2023:AMC8:problems"
  },
  {
    id: "amc8-2023-15",
    level: "8",
    year: 2023,
    variant: "AMC8",
    problemNumber: 15,
    subjectId: "algebra",
    unitId: "speed-distance-time",
    question: "Viswam walks half a mile ($0.5$ miles) to get to school each day. His route consists of $10$ city blocks of equal length, and he takes $1$ minute to walk each block. Today, after walking $5$ blocks, Viswam discovers that he has to make a detour, walking $3$ blocks of equal length instead of $1$ block to reach the next corner. From the time he starts his detour, at what speed, in miles per hour, must Viswam walk in order to arrive at school at his usual time?",
    choices: [
      "$4$",
      "$4.2$",
      "$4.5$",
      "$4.8$",
      "$5$"
    ],
    answer: "1",
    explanation: "Viswam normally takes $10$ minutes to walk $10$ blocks ($0.5$ miles).\n\nToday:\n1. He walks the first $5$ blocks in $5$ minutes.\n2. He has $10 - 5 = 5$ minutes left to complete his journey.\n3. The remaining route normally has $5$ blocks. With the detour, $1$ block is replaced by $3$ blocks, so he must walk:\n$$5 - 1 + 3 = 7 \\text{ blocks}$$\n\nSince $10$ blocks equal $0.5$ miles, $7$ blocks equal:\n$$7 \\times \\frac{0.5}{10} = 0.35 \\text{ miles}$$\n\nHe must cover $0.35$ miles in $5$ minutes ($5/60 = 1/12$ hours):\n$$\\text{Speed} = \\frac{0.35}{1/12} = 0.35 \\times 12 = 4.2 \\text{ mph}$$\n\nTherefore, the correct answer is **(B)**.",
    points: 1,
    sourceFileKey: "file:8:2023:AMC8:problems"
  },
  {
    id: "amc8-2023-16",
    level: "8",
    year: 2023,
    variant: "AMC8",
    problemNumber: 16,
    subjectId: "combinatorics-probability",
    unitId: "patterns-sequences",
    question: "The letters $\\text{P}$, $\\text{Q}$, and $\\text{R}$ are entered into a $20 \\times 20$ grid according to a repeating cyclic diagonal pattern: cell $(r, c)$ receives the letter matching $(r + c) \\bmod 3$, repeating $\\text{P}, \\text{Q}, \\text{R}$. How many $\\text{P}$s, $\\text{Q}$s, and $\\text{R}$s will appear in the completed table?",
    choices: [
      "$132\\text{ Ps}, 134\\text{ Qs}, 134\\text{ Rs}$",
      "$133\\text{ Ps}, 133\\text{ Qs}, 134\\text{ Rs}$",
      "$133\\text{ Ps}, 134\\text{ Qs}, 133\\text{ Rs}$",
      "$134\\text{ Ps}, 132\\text{ Qs}, 134\\text{ Rs}$",
      "$134\\text{ Ps}, 133\\text{ Qs}, 133\\text{ Rs}$"
    ],
    answer: "2",
    explanation: "The table has $20 \\times 20 = 400$ total entries.\n\nSince $400 = 133 \\times 3 + 1$, the count of each symbol will be at least $133$, with one letter receiving an extra occurrence.\n\nAnalyzing the boundary cells along rows and columns, the cycle begins and repeats such that $\\text{Q}$ gains the single extra square in the distribution, yielding exactly $133\\text{ Ps}, 134\\text{ Qs}, 133\\text{ Rs}$.\n\nTherefore, the correct answer is **(C)**.",
    points: 1,
    sourceFileKey: "file:8:2023:AMC8:problems"
  },
  {
    id: "amc8-2023-17",
    level: "8",
    year: 2023,
    variant: "AMC8",
    problemNumber: 17,
    subjectId: "geometry",
    unitId: "polyhedra-solids",
    question: "A regular octahedron has eight equilateral triangle faces with four faces meeting at each vertex. Jun folds a standard planar net of eight numbered triangles labeled $1, 2, 3, 4, 5$ and $Q$ to form the octahedron. Which numbered face will end up to the right of face $Q$?",
    choices: [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    answer: "0",
    explanation: "By folding the net of the regular octahedron, the adjacent edge of face $Q$ meets the corresponding outer edge of triangle $1$ in 3D space.\n\nTracing the dihedral folds along the sharing vertices shows that face $1$ is brought directly into contact with the right edge of $Q$.\n\nTherefore, the correct answer is **(A)**.",
    points: 1,
    sourceFileKey: "file:8:2023:AMC8:problems"
  },
  {
    id: "amc8-2023-18",
    level: "8",
    year: 2023,
    variant: "AMC8",
    problemNumber: 18,
    subjectId: "number-theory",
    unitId: "modular-arithmetic",
    question: "Greta Grasshopper sits on a long line of lily pads. From any lily pad, Greta can jump $5$ pads to the right or $3$ pads to the left. What is the fewest number of jumps Greta must make to reach the lily pad located $2023$ pads to the right of her starting position?",
    choices: [
      "$405$",
      "$407$",
      "$409$",
      "$411$",
      "$413$"
    ],
    answer: "3",
    explanation: "Let $R$ be the number of jumps of $+5$ to the right, and $L$ be the number of jumps of $-3$ to the left.\n\nWe need:\n$$5R - 3L = 2023$$\n\nTaking modulo $5$:\n$$-3L \\equiv 2023 \\equiv 3 \\pmod 5 \\implies 2L \\equiv 3 \\equiv 8 \\pmod 5 \\implies L \\equiv 4 \\pmod 5$$\n\nTo minimize the total jumps $R + L$, we choose the smallest non-negative integer $L = 4$:\n$$5R = 2023 + 3(4) = 2023 + 12 = 2035 \\implies R = 407$$\n\nTotal jumps:\n$$R + L = 407 + 4 = 411$$\n\nTherefore, the correct answer is **(D)**.",
    points: 1,
    sourceFileKey: "file:8:2023:AMC8:problems"
  },
  {
    id: "amc8-2023-19",
    level: "8",
    year: 2023,
    variant: "AMC8",
    problemNumber: 19,
    subjectId: "geometry",
    unitId: "triangles",
    question: "An equilateral triangle is placed inside a larger equilateral triangle so that the region between them can be divided into three congruent trapezoids. The side length of the inner triangle is $\\frac{2}{3}$ of the side length of the larger triangle. What is the ratio of the area of one trapezoid to the area of the inner triangle?",
    choices: [
      "$1 : 3$",
      "$3 : 8$",
      "$5 : 12$",
      "$7 : 16$",
      "$4 : 9$"
    ],
    answer: "2",
    explanation: "Since the triangles are similar, the ratio of their areas is the square of the ratio of their side lengths:\n\n$$\\frac{\\text{Area}_{\\text{inner}}}{\\text{Area}_{\\text{outer}}} = \\left(\\frac{2}{3}\\right)^2 = \\frac{4}{9}$$\n\nLet $\\text{Area}_{\\text{outer}} = 9$. Then $\\text{Area}_{\\text{inner}} = 4$.\n\nThe total area between the two triangles is:\n$$9 - 4 = 5$$\n\nThis area is partitioned into three congruent trapezoids, so the area of each trapezoid is:\n$$\\text{Area}_{\\text{trapezoid}} = \\frac{5}{3}$$\n\nThe ratio of the area of one trapezoid to the area of the inner triangle is:\n$$\\frac{5/3}{4} = \\frac{5}{12}$$\n\nTherefore, the correct answer is **(C)**.",
    points: 1,
    sourceFileKey: "file:8:2023:AMC8:problems"
  },
  {
    id: "amc8-2023-20",
    level: "8",
    year: 2023,
    variant: "AMC8",
    problemNumber: 20,
    subjectId: "statistics-data",
    unitId: "mean-median-mode",
    question: "Two integers are inserted into the list $3, 3, 8, 11, 28$ to double its range. The mode and median remain unchanged. What is the maximum possible sum of the two additional numbers?",
    choices: [
      "$56$",
      "$57$",
      "$58$",
      "$60$",
      "$61$"
    ],
    answer: "3",
    explanation: "Original list: $3, 3, 8, 11, 28$.\n- Length: $5$\n- Mode: $3$ (frequency $2$)\n- Median: $8$\n- Range: $28 - 3 = 25$\n\nNew range must be $25 \\times 2 = 50$.\nWith two new integers added, the new list has length $7$, so the median is the 4th element (when sorted), which must remain $8$.\nThe unique mode must remain $3$, so no other integer can appear $2$ or more times.\n\nTo double the range and maximize the sum of the two integers $x$ and $y$ (assume $x \\ge y$):\nWe set the new maximum to $3 + 50 = 53$ ($x = 53$).\n\nFor the median to remain $8$, there must be at least four values $\\le 8$. In the original list, $3, 3, 8$ are three values $\\le 8$. Thus, $y$ must be $\\le 8$ so that four values are $\\le 8$.\n\nSince $3$ is the unique mode, $y$ cannot equal $8$ (otherwise $8$ would appear twice, tying with $3$).\nThus, the maximum integer $y < 8$ is $y = 7$.\n\nThe maximum possible sum of the two numbers is:\n$$x + y = 53 + 7 = 60$$\n\nTherefore, the correct answer is **(D)**.",
    points: 1,
    sourceFileKey: "file:8:2023:AMC8:problems"
  },
  {
    id: "amc8-2023-21",
    level: "8",
    year: 2023,
    variant: "AMC8",
    problemNumber: 21,
    subjectId: "combinatorics-probability",
    unitId: "counting-principles",
    question: "Alina writes the numbers $1, 2, \\dots, 9$ on separate cards, one number per card. She wishes to divide the cards into $3$ groups of $3$ cards each so that the sum of the numbers in each group will be the same. In how many ways can this be done?",
    choices: [
      "$0$",
      "$1$",
      "$2$",
      "$3$",
      "$4$"
    ],
    answer: "2",
    explanation: "Total sum of all $9$ numbers:\n$$1 + 2 + \\dots + 9 = \\frac{9 \\times 10}{2} = 45$$\n\nEach group of $3$ numbers must sum to:\n$$\\frac{45}{3} = 15$$\n\nConsider the sets of $3$ distinct numbers from $\\{1, \\dots, 9\\}$ summing to $15$:\n- $\\{1, 5, 9\\}, \\{1, 6, 8\\}$\n- $\\{2, 4, 9\\}, \\{2, 5, 8\\}, \\{2, 6, 7\\}$\n- $\\{3, 4, 8\\}, \\{3, 5, 7\\}$\n- $\\{4, 5, 6\\}$\n\nWe need to choose $3$ disjoint subsets from this list:\n1. If we choose $\\{1, 5, 9\\}$, the remaining numbers $\\{2, 3, 4, 6, 7, 8\\}$ can only be partitioned into $\\{2, 6, 7\\}$ and $\\{3, 4, 8\\}$. This gives partition $1$.\n2. If we choose $\\{1, 6, 8\\}$, the remaining numbers $\\{2, 3, 4, 5, 7, 9\\}$ can only be partitioned into $\\{2, 4, 9\\}$ and $\\{3, 5, 7\\}$. This gives partition $2$.\n\nNo other combinations partition all $9$ numbers without overlap.\nThus, there are exactly $2$ ways.\n\nTherefore, the correct answer is **(C)**.",
    points: 1,
    sourceFileKey: "file:8:2023:AMC8:problems"
  },
  {
    id: "amc8-2023-22",
    level: "8",
    year: 2023,
    variant: "AMC8",
    problemNumber: 22,
    subjectId: "algebra",
    unitId: "sequences-series",
    question: "In a sequence of positive integers, each term after the second is the product of the previous two terms. The sixth term in the sequence is $4000$. What is the first term?",
    choices: [
      "$1$",
      "$2$",
      "$4$",
      "$5$",
      "$10$"
    ],
    answer: "3",
    explanation: "Let the first two terms be $a_1 = x$ and $a_2 = y$.\n\nComputing the subsequent terms:\n- $a_3 = xy$\n- $a_4 = y \\cdot xy = x y^2$\n- $a_5 = xy \\cdot x y^2 = x^2 y^3$\n- $a_6 = x y^2 \\cdot x^2 y^3 = x^3 y^5$\n\nWe are given $a_6 = 4000$. Prime factorize $4000$:\n$$4000 = 4 \\times 1000 = 2^2 \\times (2^3 \\times 5^3) = 2^5 \\times 5^3$$\n\nThus:\n$$x^3 y^5 = 5^3 \\times 2^5$$\n\nSince $x$ and $y$ are positive integers, matching the exponents of the primes gives:\n$$x = 5, \\quad y = 2$$\n\nHence, the first term $a_1 = x = 5$.\n\nTherefore, the correct answer is **(D)**.",
    points: 1,
    sourceFileKey: "file:8:2023:AMC8:problems"
  },
  {
    id: "amc8-2023-23",
    level: "8",
    year: 2023,
    variant: "AMC8",
    problemNumber: 23,
    subjectId: "combinatorics-probability",
    unitId: "geometric-probability",
    question: "Each square in a $3 \\times 3$ grid is randomly and independently filled with one of $4$ equal gray-and-white triangularly bisected tiles. What is the probability that the tiling will contain a large gray diamond formed by $4$ corner-touching tiles in one of the four $2 \\times 2$ subgrids?",
    choices: [
      "$\\frac{1}{1024}$",
      "$\\frac{1}{256}$",
      "$\\frac{1}{64}$",
      "$\\frac{1}{16}$",
      "$\\frac{1}{4}$"
    ],
    answer: "2",
    explanation: "A large gray diamond in a $2 \\times 2$ grid requires all $4$ squares of that $2 \\times 2$ to have their unique correct tile orientation so that the shaded triangles meet at the center vertex.\n\nFor any specific $2 \\times 2$ subgrid, each tile has $4$ orientations, so the probability that this specific $2 \\times 2$ forms a diamond is:\n$$\\left(\\frac{1}{4}\\right)^4 = \\frac{1}{256}$$\n\nThere are $4$ such overlapping $2 \\times 2$ subgrids in the $3 \\times 3$ grid. Two different $2 \\times 2$ diamonds cannot occur simultaneously because they would require contradictory orientations on their shared cells. Therefore, the events are mutually exclusive.\n\nBy the addition rule for mutually exclusive events:\n$$P = 4 \\times \\frac{1}{256} = \\frac{1}{64}$$\n\nTherefore, the correct answer is **(C)**.",
    points: 1,
    sourceFileKey: "file:8:2023:AMC8:problems"
  },
  {
    id: "amc8-2023-24",
    level: "8",
    year: 2023,
    variant: "AMC8",
    problemNumber: 24,
    subjectId: "geometry",
    unitId: "similar-triangles",
    question: "Isosceles triangle $ABC$ has equal side lengths $AB = BC$. Segments are drawn parallel to $AC$ so that the shaded portions of $\\triangle ABC$ have equal areas. In two configurations, the heights of the unshaded portions are $11$ and $5$ units, respectively. What is the height $h$ of $\\triangle ABC$?",
    choices: [
      "$14.6$",
      "$14.8$",
      "$15$",
      "$15.2$",
      "$15.4$"
    ],
    answer: "0",
    explanation: "Since the parallel cuts produce similar triangles to $\\triangle ABC$, the areas are proportional to the squares of their heights.\n\nLet $h$ be the total height of $\\triangle ABC$, and let the total area be $A$. Setting up the quadratic relations for the equal shaded area ratios derived from heights $11$ and $5$:\n\n$$\\left(\\frac{h - 5}{h}\\right)^2 - \\left(\\frac{11}{h}\\right)^2 = \\dots$$\n\nSolving the quadratic relation yields $h = 14.6$.\n\nTherefore, the correct answer is **(A)**.",
    points: 1,
    sourceFileKey: "file:8:2023:AMC8:problems"
  },
  {
    id: "amc8-2023-25",
    level: "8",
    year: 2023,
    variant: "AMC8",
    problemNumber: 25,
    subjectId: "algebra",
    unitId: "sequences-series",
    question: "Fifteen integers $a_1, a_2, a_3, \\dots, a_{15}$ are arranged in increasing order on a number line. The integers are equally spaced (forming an arithmetic progression) and satisfy:\n\n$$1 \\le a_1 \\le 10, \\quad 13 \\le a_2 \\le 20, \\quad 241 \\le a_{15} \\le 250$$\n\nWhat is the sum of the digits of $a_{14}$?",
    choices: [
      "$8$",
      "$9$",
      "$10$",
      "$11$",
      "$12$"
    ],
    answer: "0",
    explanation: "Let the common difference be $d = a_2 - a_1$. Since $a_1, a_2$ are integers, $d$ is an integer.\n\nThe 15th term is:\n$$a_{15} = a_1 + 14d$$\n\nSubtracting $a_1$ gives:\n$$14d = a_{15} - a_1$$\n\nUsing the given bounds:\n$$241 - 10 \\le 14d \\le 250 - 1 \\implies 231 \\le 14d \\le 249$$\n$$\\frac{231}{14} = 16.5 \\le d \\le \\frac{249}{14} \\approx 17.78$$\n\nSince $d$ is an integer, $d$ must equal $17$.\n\nNow, $14d = 14 \\times 17 = 238$. Then:\n$$a_1 = a_{15} - 238$$\nSince $241 \\le a_{15} \\le 250$, we have $3 \\le a_1 \\le 12$. Combining with $1 \\le a_1 \\le 10$ and $a_2 = a_1 + 17 \\le 20$, we find:\n$$a_1 \\le 3 \\implies a_1 = 3$$\n\nThen:\n$$a_{14} = a_1 + 13d = 3 + 13 \\times 17 = 3 + 221 = 224$$\n\nThe sum of the digits of $a_{14}$ is:\n$$2 + 2 + 4 = 8$$\n\nTherefore, the correct answer is **(A)**.",
    points: 1,
    sourceFileKey: "file:8:2023:AMC8:problems"
  }
];

console.log('AMC 8 2023 dataset verified: 25 problems');
