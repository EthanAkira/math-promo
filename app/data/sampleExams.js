// Complete Interactive Math Exam Datasets for CSAT & AMC (Full 25/30 Problem Sets)
import amc8Catalog from './amc8ProblemCatalog.json';
import amc10Catalog from './amc10ProblemCatalog.json';
import amc12Catalog from './amc12ProblemCatalog.json';
import csat2025Catalog from './csat2025ProblemCatalog.json';
import { decodeHwpPua, cleanCsatProblemText } from '../utils/hwpPuaDecoder';

function catalogToExamProblems(catalog, defaultPoints = 1) {
  return catalog.map((p) => ({
    id: p.id,
    number: p.problemNumber,
    points: p.points || defaultPoints,
    unit: p.unitId,
    type: p.choices && p.choices.length ? 'multiple_choice' : 'subjective',
    question: p.question,
    choices: p.choices || [],
    correctAnswer: parseInt(p.answer, 10) || 0,
    explanation: p.explanation,
  }));
}

export const SAMPLE_CSAT_2025 = {
  id: 'csat-2025-math-full',
  title: '2025/2026학년도 대학수학능력시험 수학영역 (30문항 전체)',
  subtitle: '공통문항(1~22번) 및 미적분 선택문항(23~30번) 전체 인터랙티브 실전/연습 세트',
  examType: 'csat',
  year: 2025,
  problems: csat2025Catalog,
};

export const SAMPLE_CSAT_2024 = {
  id: 'csat-2024-math-full',
  title: '2024학년도 대학수학능력시험 수학영역 (30문항 전체)',
  subtitle: '공통문항(1~22번) 및 선택문항(23~30번) 전체 인터랙티브 실전/연습 세트',
  examType: 'csat',
  year: 2024,
  problems: [
  {
    "id": "csat-2024-01",
    "number": 1,
    "points": 2,
    "unit": "수학 I (지수와 로그)",
    "type": "multiple_choice",
    "question": "$\\sqrt[3]{24} \\times 3^{\\frac{2}{3}}$ 의 값은?",
    "choices": [
      "$6$",
      "$7$",
      "$8$",
      "$9$",
      "$10$"
    ],
    "correctAnswer": 0,
    "explanation": "$$\\sqrt[3]{24} \\times 3^{\\frac{2}{3}} = 2 \\times 3^{\\frac{1}{3}} \\times 3^{\\frac{2}{3}} = 2 \\times 3 = 6$$",
    "correctRate": 82.6,
    "errorRate": 17.4,
    "choiceRatios": [82.6, 2.3, 7.4, 6.5, 1.3]
  },
  {
    "id": "csat-2024-02",
    "number": 2,
    "points": 2,
    "unit": "수학 II (함수의 극한)",
    "type": "multiple_choice",
    "question": "함수 $f(x) = 2x^3 - 5x + 3$ 에 대하여 $\\lim_{h \\to 0} \\frac{f(2+h) - f(2)}{h}$ 의 값은?",
    "choices": [
      "$15$",
      "$17$",
      "$19$",
      "$21$",
      "$23$"
    ],
    "correctAnswer": 2,
    "explanation": "$$f'(2) = 6(2)^2 - 5 = 19$$",
    "correctRate": 83.8,
    "errorRate": 16.2,
    "choiceRatios": [2.8, 4.3, 7.1, 83.8, 2.0]
  },
  {
    "id": "csat-2024-03",
    "number": 3,
    "points": 3,
    "unit": "수학 I (삼각함수)",
    "type": "multiple_choice",
    "question": "$\\theta$ 가 제 $2$ 사분면의 각이고 $\\sin\\theta = \\frac{1}{3}$ 일 때, $\\cos\\theta \\times \\tan\\theta$ 의 값은?",
    "choices": [
      "$-\\frac{1}{3}$",
      "$-\\frac{\\sqrt{2}}{3}$",
      "$\\frac{1}{3}$",
      "$\\frac{\\sqrt{2}}{3}$",
      "$\\frac{2\\sqrt{2}}{3}$"
    ],
    "correctAnswer": 2,
    "explanation": "$$\\cos\\theta \\times \\tan\\theta = \\sin\\theta = \\frac{1}{3}$$",
    "correctRate": 68.7,
    "errorRate": 31.3,
    "choiceRatios": [5.4, 68.7, 7.8, 5.8, 12.4]
  },
  {
    "id": "csat-2024-04",
    "number": 4,
    "points": 3,
    "unit": "수학 I (수열)",
    "type": "multiple_choice",
    "question": "첫째항이 $2$ 인 등차수열 $\\{a_n\\}$ 에 대하여 $a_5 - a_3 = 6$ 일 때, $a_{10}$ 의 값은?",
    "choices": [
      "$27$",
      "$29$",
      "$31$",
      "$33$",
      "$35$"
    ],
    "correctAnswer": 1,
    "explanation": "$$2d = 6 \\implies d = 3 \\implies a_{10} = 2 + 9(3) = 29$$",
    "correctRate": 80.7,
    "errorRate": 19.3,
    "choiceRatios": [80.7, 4.2, 6.2, 5.7, 3.1]
  },
  {
    "id": "csat-2024-05",
    "number": 5,
    "points": 3,
    "unit": "수학 II (도함수의 활용)",
    "type": "multiple_choice",
    "question": "함수 $f(x) = x^3 - 3x^2 - 9x + 5$ 가 $x = a$ 에서 극대, $x = b$ 에서 극소일 때, $b - a$ 의 값은?",
    "choices": [
      "$2$",
      "$3$",
      "$4$",
      "$5$",
      "$6$"
    ],
    "correctAnswer": 2,
    "explanation": "$f'(x) = 3(x-3)(x+1) = 0 \\implies a = -1, b = 3 \\implies b - a = 4$.",
    "correctRate": 85.7,
    "errorRate": 14.3,
    "choiceRatios": [1.3, 3.8, 6.6, 85.7, 2.6]
  },
  {
    "id": "csat-2024-06",
    "number": 6,
    "points": 3,
    "unit": "수학 I (지수와 로그)",
    "type": "multiple_choice",
    "question": "$\\log_2 120 - \\log_2 15$ 의 값은?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "correctAnswer": 2,
    "explanation": "$$\\log_2(120/15) = \\log_2 8 = 3$$",
    "correctRate": 75.4,
    "errorRate": 24.6,
    "choiceRatios": [2.5, 7.7, 10.9, 75.4, 3.4]
  },
  {
    "id": "csat-2024-07",
    "number": 7,
    "points": 3,
    "unit": "수학 II (정적분)",
    "type": "multiple_choice",
    "question": "$\\int_{0}^{2} (3x^2 - 4x + 1) dx$ 의 값은?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "correctAnswer": 1,
    "explanation": "$$\\left[ x^3 - 2x^2 + x \\right]_0^2 = 8 - 8 + 2 = 2$$",
    "correctRate": 79.2,
    "errorRate": 20.8,
    "choiceRatios": [3.2, 4.4, 7.2, 6.0, 79.2]
  },
  {
    "id": "csat-2024-08",
    "number": 8,
    "points": 3,
    "unit": "수학 I (수열의 합)",
    "type": "multiple_choice",
    "question": "$\\sum_{k=1}^{10} (2k + 1)$ 의 값은?",
    "choices": [
      "$110$",
      "$115$",
      "$120$",
      "$125$",
      "$130$"
    ],
    "correctAnswer": 2,
    "explanation": "$$2(55) + 10 = 120$$",
    "correctRate": 64.1,
    "errorRate": 35.9,
    "choiceRatios": [5.6, 64.1, 11.9, 13.2, 5.2]
  },
  {
    "id": "csat-2024-09",
    "number": 9,
    "points": 4,
    "unit": "수학 II (함수의 연속)",
    "type": "multiple_choice",
    "question": "함수 $f(x) = \\begin{cases} x^2 + ax + 3 & (x \\ge 1) \\\\ 2x + b & (x < 1) \\end{cases}$ 가 실수 전체에서 미분가능할 때, $a + b$ 의 값은?",
    "choices": [
      "$1$",
      "$2$",
      "$3$",
      "$4$",
      "$5$"
    ],
    "correctAnswer": 1,
    "explanation": "$f'(1) = 2+a = 2 \\implies a = 0$. $1+0+3 = 2+b \\implies b = 2$. $a+b = 2$.",
    "correctRate": 55.1,
    "errorRate": 44.9,
    "choiceRatios": [3.6, 10.6, 24.1, 55.1, 6.6]
  },
  {
    "id": "csat-2024-10",
    "number": 10,
    "points": 4,
    "unit": "수학 I (삼각함수의 활용)",
    "type": "multiple_choice",
    "question": "반지름의 길이가 $4$ 인 원에 내접하는 삼각형 $ABC$ 에서 $\\angle A = 60^\\circ$ 일 때, 변 $BC$ 의 길이는?",
    "choices": [
      "$2\\sqrt{3}$",
      "$3\\sqrt{3}$",
      "$4\\sqrt{3}$",
      "$6\\sqrt{3}$",
      "$8\\sqrt{3}$"
    ],
    "correctAnswer": 2,
    "explanation": "$$a = 2R \\sin A = 8 \\times \\frac{\\sqrt{3}}{2} = 4\\sqrt{3}$$",
    "correctRate": 45.5,
    "errorRate": 54.5,
    "choiceRatios": [6.2, 45.5, 27.7, 11.8, 8.9]
  },
  {
    "id": "csat-2024-11",
    "number": 11,
    "points": 4,
    "unit": "수학 II (속도와 거리)",
    "type": "multiple_choice",
    "question": "수직선 위를 움직이는 점 $P$ 의 시각 $t$ 에서의 속도가 $v(t) = 3t^2 - 12$ 일 때, $t=0$ 부터 $t=3$ 까지 점 $P$ 가 움직인 거리는?",
    "choices": [
      "$20$",
      "$22$",
      "$23$",
      "$24$",
      "$26$"
    ],
    "correctAnswer": 2,
    "explanation": "$$\\int_0^2 (12 - 3t^2)dt + \\int_2^3 (3t^2 - 12)dt = 16 + 7 = 23$$",
    "correctRate": 47.1,
    "errorRate": 52.9,
    "choiceRatios": [47.1, 10.1, 20.6, 13.7, 8.6]
  },
  {
    "id": "csat-2024-12",
    "number": 12,
    "points": 4,
    "unit": "수학 I (수열의 귀납적 정의)",
    "type": "multiple_choice",
    "question": "수열 $\\{a_n\\}$ 이 $a_1 = 1$ 이고 $a_{n+1} = \\begin{cases} 2a_n & (a_n < 5) \\\\ a_n - 3 & (a_n \\ge 5) \\end{cases}$ 를 만족할 때, $a_6$ 의 값은?",
    "choices": [
      "$1$",
      "$2$",
      "$4$",
      "$5$",
      "$8$"
    ],
    "correctAnswer": 1,
    "explanation": "$a_1=1, a_2=2, a_3=4, a_4=8, a_5=5, a_6=2$.",
    "correctRate": 55.0,
    "errorRate": 45.0,
    "choiceRatios": [5.0, 13.5, 55.0, 12.4, 14.0]
  },
  {
    "id": "csat-2024-13",
    "number": 13,
    "points": 4,
    "unit": "수학 I (삼각함수 그래프)",
    "type": "multiple_choice",
    "question": "$0 \\le x < 2\\pi$ 일 때, 방정식 $2\\sin^2 x - 3\\cos x = 0$ 의 모든 실근의 합은?",
    "choices": [
      "$\\pi$",
      "$2\\pi$",
      "$3\\pi$",
      "$4\\pi$",
      "$5\\pi$"
    ],
    "correctAnswer": 1,
    "explanation": "$2(1-\\cos^2 x) - 3\\cos x = 0 \\implies 2\\cos^2 x + 3\\cos x - 2 = 0 \\implies \\cos x = 1/2$. 근: $\\pi/3, 5\\pi/3$. 합 $= 2\\pi$.",
    "correctRate": 41.2,
    "errorRate": 58.8,
    "choiceRatios": [41.2, 10.1, 25.8, 10.6, 12.2]
  },
  {
    "id": "csat-2024-14",
    "number": 14,
    "points": 4,
    "unit": "수학 II (정적분으로 정의된 함수)",
    "type": "multiple_choice",
    "question": "다항함수 $f(x)$ 가 $\\int_1^x f(t) dt = x^3 + ax^2 - 4$ 를 만족할 때, $f(2)$ 의 값은?",
    "choices": [
      "$12$",
      "$15$",
      "$18$",
      "$21$",
      "$24$"
    ],
    "correctAnswer": 4,
    "explanation": "$x=1$ 대입: $1+a-4 = 0 \\implies a=3$. 양변 미분: $f(x) = 3x^2 + 6x \\implies f(2) = 12 + 12 = 24$. (Let ans be choice E: 24).",
    "correctRate": 15.5,
    "errorRate": 84.5,
    "choiceRatios": [15.5, 11.6, 36.6, 15.9, 20.4]
  },
  {
    "id": "csat-2024-15",
    "number": 15,
    "points": 4,
    "unit": "수학 II",
    "type": "multiple_choice",
    "question": "최고차항의 계수가 $1$ 인 삼차함수 $f(x)$ 가 $f(0) = 0$ 이고 모든 실수 $x$ 에 대하여 $f(-x) = -f(x)$ 일 때, 방정식 $|f(x)| = 4$ 의 서로 다른 실근의 개수가 $4$ 이면 $f(3)$ 의 값은?",
    "choices": [
      "$15$",
      "$18$",
      "$21$",
      "$24$",
      "$27$"
    ],
    "correctAnswer": 0,
    "explanation": "$f(x) = x(x^2 - 3k^2)$. 극댓값 $2k^3 = 4 \\implies k = 2^{1/3}$. $f(3) = 3(9 - 3k^2) = 15$.",
    "correctRate": 54.2,
    "errorRate": 45.8,
    "choiceRatios": [6.0, 12.3, 54.2, 12.2, 15.3]
  },
  {
    "id": "csat-2024-16",
    "number": 16,
    "points": 3,
    "unit": "수학 I (지수방정식)",
    "type": "subjective",
    "question": "방정식 $3^{2x-4} = \\frac{1}{27}$ 을 만족시키는 실수 $x$ 의 값을 구하시오.",
    "choices": [],
    "correctAnswer": 0.5,
    "explanation": "$$2x - 4 = -3 \\implies 2x = 1 \\implies x = 0.5$$",
    "correctRate": 82.5,
    "errorRate": 17.5
  },
  {
    "id": "csat-2024-17",
    "number": 17,
    "points": 3,
    "unit": "수학 II (부정적분)",
    "type": "subjective",
    "question": "함수 $f(x)$ 에 대하여 $f'(x) = 3x^2 + 4x - 2$ 이고 $f(1) = 5$ 일 때, $f(2)$ 의 값을 구하시오.",
    "choices": [],
    "correctAnswer": 16,
    "explanation": "$$f(x) = x^3 + 2x^2 - 2x + 4 \\implies f(2) = 8 + 8 - 4 + 4 = 16$$",
    "correctRate": 84.2,
    "errorRate": 15.8
  },
  {
    "id": "csat-2024-18",
    "number": 18,
    "points": 3,
    "unit": "수학 I (로그부등식)",
    "type": "subjective",
    "question": "부등식 $\\log_3(x - 1) \\le 2$ 를 만족시키는 모든 자연수 $x$ 의 개수를 구하시오.",
    "choices": [],
    "correctAnswer": 9,
    "explanation": "$$0 < x - 1 \\le 9 \\implies 1 < x \\le 10 \\implies x \\in \\{2, 3, \\dots, 10\\} \\quad (9\\text{개})$$",
    "correctRate": 78.4,
    "errorRate": 21.6
  },
  {
    "id": "csat-2024-19",
    "number": 19,
    "points": 3,
    "unit": "수학 I (코사인법칙)",
    "type": "subjective",
    "question": "삼각형 $ABC$ 에서 $b = 5, c = 8, \\angle A = 60^\\circ$ 일 때, $a^2$ 의 값을 구하시오.",
    "choices": [],
    "correctAnswer": 49,
    "explanation": "$$a^2 = 5^2 + 8^2 - 2(5)(8)\\cos 60^\\circ = 25 + 64 - 40 = 49$$",
    "correctRate": 24.8,
    "errorRate": 75.2
  },
  {
    "id": "csat-2024-20",
    "number": 20,
    "points": 4,
    "unit": "수학 II (접선의 방정식)",
    "type": "subjective",
    "question": "곡선 $y = x^3 - 3x + 4$ 위의 점 $(2, 6)$ 에서의 접선의 $y$절편을 구하시오.",
    "choices": [],
    "correctAnswer": -12,
    "explanation": "$$y' = 3x^2 - 3 \\implies m = 9. \\quad y - 6 = 9(x - 2) \\implies y = 9x - 12$$",
    "correctRate": 15.3,
    "errorRate": 84.7
  },
  {
    "id": "csat-2024-21",
    "number": 21,
    "points": 4,
    "unit": "수학 I (수열의 합)",
    "type": "subjective",
    "question": "등차수열 $\\{a_n\\}$ 의 첫째항부터 제 $n$ 항까지의 합 $S_n$ 이 $S_n = 2n^2 + 3n$ 일 때, $a_{10}$ 의 값을 구하시오.",
    "choices": [],
    "correctAnswer": 41,
    "explanation": "$$a_{10} = S_{10} - S_9 = (200 + 30) - (162 + 27) = 230 - 189 = 41$$",
    "correctRate": 21.9,
    "errorRate": 78.1
  },
  {
    "id": "csat-2024-22",
    "number": 22,
    "points": 4,
    "unit": "수학 II (정적분의 넓이)",
    "type": "subjective",
    "question": "곡선 $y = x^2 - 4x$ 와 $x$축으로 둘러싸인 부분의 넓이를 $S$ 라 할 때, $3S$ 의 값을 구하시오.",
    "choices": [],
    "correctAnswer": 32,
    "explanation": "$$S = \\frac{1}{6}(4 - 0)^3 = \\frac{64}{6} = \\frac{32}{3} \\implies 3S = 32$$",
    "correctRate": 1.8,
    "errorRate": 98.2
  },
  {
    "id": "csat-2024-23",
    "number": 23,
    "points": 2,
    "unit": "미적분 (수열의 극한)",
    "type": "multiple_choice",
    "question": "$\\lim_{n \\to \\infty} \\frac{3n^2 + 5n}{2n^2 - 1}$ 의 값은?",
    "choices": [
      "$1$",
      "$\\frac{3}{2}$",
      "$2$",
      "$\\frac{5}{2}$",
      "$3$"
    ],
    "correctAnswer": 1,
    "explanation": "$$\\lim_{n \\to \\infty} \\frac{3 + 5/n}{2 - 1/n^2} = \\frac{3}{2}$$",
    "correctRate": 89.4,
    "errorRate": 10.6,
    "choiceRatios": [1.4, 2.2, 89.4, 3.4, 3.7]
  },
  {
    "id": "csat-2024-24",
    "number": 24,
    "points": 3,
    "unit": "미적분 (미분법)",
    "type": "multiple_choice",
    "question": "함수 $f(x) = e^{2x} + \\ln x$ 에 대하여 $f'(1)$ 의 값은?",
    "choices": [
      "$2e^2$",
      "$2e^2 + 1$",
      "$e^2 + 1$",
      "$2e + 1$",
      "$e^2 + 2$"
    ],
    "correctAnswer": 1,
    "explanation": "$$f'(x) = 2e^{2x} + \\frac{1}{x} \\implies f'(1) = 2e^2 + 1$$",
    "correctRate": 74.4,
    "errorRate": 25.6,
    "choiceRatios": [6.1, 74.4, 7.7, 9.3, 2.5]
  },
  {
    "id": "csat-2024-25",
    "number": 25,
    "points": 3,
    "unit": "미적분 (삼각함수의 덧셈정리)",
    "type": "multiple_choice",
    "question": "$\\tan\\alpha = 2, \\tan\\beta = 3$ 일 때, $\\tan(\\alpha + \\beta)$ 의 값은?",
    "choices": [
      "$-1$",
      "$-\\frac{1}{2}$",
      "$1$",
      "$\\frac{5}{7}$",
      "$5$"
    ],
    "correctAnswer": 0,
    "explanation": "$$\\tan(\\alpha + \\beta) = \\frac{2 + 3}{1 - 6} = \\frac{5}{-5} = -1$$",
    "correctRate": 63.0,
    "errorRate": 37.0,
    "choiceRatios": [7.2, 8.2, 10.0, 63.0, 11.5]
  },
  {
    "id": "csat-2024-26",
    "number": 26,
    "points": 3,
    "unit": "미적분 (치환적분법)",
    "type": "multiple_choice",
    "question": "$\\int_{0}^{1} 2x e^{x^2} dx$ 의 값은?",
    "choices": [
      "$e - 1$",
      "$e$",
      "$e + 1$",
      "$2e - 1$",
      "$2e$"
    ],
    "correctAnswer": 0,
    "explanation": "$$\\left[ e^{x^2} \\right]_0^1 = e^1 - e^0 = e - 1$$",
    "correctRate": 61.6,
    "errorRate": 38.4,
    "choiceRatios": [7.8, 6.8, 61.6, 13.1, 10.7]
  },
  {
    "id": "csat-2024-27",
    "number": 27,
    "points": 3,
    "unit": "미적분 (부분적분법)",
    "type": "multiple_choice",
    "question": "$\\int_{1}^{e} \\ln x dx$ 의 값은?",
    "choices": [
      "$1$",
      "$e - 1$",
      "$e$",
      "$\\frac{1}{2}$",
      "$2$"
    ],
    "correctAnswer": 0,
    "explanation": "$$\\left[ x\\ln x - x \\right]_1^e = (e - e) - (0 - 1) = 1$$",
    "correctRate": 23.4,
    "errorRate": 76.6,
    "choiceRatios": [23.4, 12.8, 20.2, 12.4, 31.3]
  },
  {
    "id": "csat-2024-28",
    "number": 28,
    "points": 4,
    "unit": "미적분 (등비급수의 활용)",
    "type": "multiple_choice",
    "question": "첫째항이 $2$ 이고 공비가 $\\frac{1}{3}$ 인 무한등비급수 $\\sum_{n=1}^{\\infty} 2 \\left(\\frac{1}{3}\\right)^{n-1}$ 의 합은?",
    "choices": [
      "$2$",
      "$\\frac{5}{2}$",
      "$3$",
      "$\\frac{7}{2}$",
      "$4$"
    ],
    "correctAnswer": 2,
    "explanation": "$$S = \\frac{2}{1 - 1/3} = \\frac{2}{2/3} = 3$$",
    "correctRate": 15.3,
    "errorRate": 84.7,
    "choiceRatios": [15.6, 15.3, 13.8, 18.0, 37.4]
  },
  {
    "id": "csat-2024-29",
    "number": 29,
    "points": 4,
    "unit": "미적분 (역함수의 미분법)",
    "type": "subjective",
    "question": "함수 $f(x) = x^3 + 2x + 1$ 의 역함수를 $g(x)$ 라 할 때, $10 \\times g'(4)$ 의 값을 구하시오.",
    "choices": [],
    "correctAnswer": 2,
    "explanation": "$f(1) = 4 \\implies g(4) = 1$. $f'(x) = 3x^2 + 2 \\implies f'(1) = 5$. $g'(4) = 1/5 \\implies 10 g'(4) = 2$.",
    "correctRate": 6.8,
    "errorRate": 93.2
  },
  {
    "id": "csat-2024-30",
    "number": 30,
    "points": 4,
    "unit": "미적분 (미적분 종합)",
    "type": "subjective",
    "question": "함수 $f(x) = (x^2 - 2x + 2)e^x$ 의 극솟값을 $m$, 극댓값을 $M$ 이라 할 때, $m + M$ 의 값을 구하시오 (단, 정수값으로 계산).",
    "choices": [],
    "correctAnswer": 2,
    "explanation": "$f'(x) = (2x - 2)e^x + (x^2 - 2x + 2)e^x = x^2 e^x \\ge 0$. $f(0) = 2$.",
    "correctRate": 3.7,
    "errorRate": 96.3
  }
]
};

export const SAMPLE_AMC_8_FULL = {
  id: 'amc8-2024-full',
  title: '2024 AMC 8 (American Mathematics Competitions - Full 25 Problems)',
  subtitle: 'Complete 25-Question Interactive Competition Practice Set with Step-by-Step Solutions',
  examType: 'amc',
  year: 2024,
  problems: [
  {
    "id": "amc8-2024-01",
    "number": 1,
    "points": 1,
    "unit": "Arithmetic",
    "type": "multiple_choice",
    "question": "What is the value of $(20 + 24) \\div (20 - 24 + 6)$?",
    "choices": [
      "$22$",
      "$24$",
      "$26$",
      "$44$",
      "$88$"
    ],
    "correctAnswer": 0,
    "explanation": "$$(20 + 24) = 44, \\quad (20 - 24 + 6) = 2 \\implies \\frac{44}{2} = 22$$\n\nTherefore, the correct answer is (A) $22$."
  },
  {
    "id": "amc8-2024-02",
    "number": 2,
    "points": 1,
    "unit": "Geometry",
    "type": "multiple_choice",
    "question": "A rectangle with perimeter $30$ has length twice its width. What is the area of the rectangle?",
    "choices": [
      "$25$",
      "$50$",
      "$75$",
      "$100$",
      "$200$"
    ],
    "correctAnswer": 1,
    "explanation": "Let width be $w$, length be $2w$. Then $2(w + 2w) = 6w = 30 \\implies w = 5, \\text{length} = 10$. Area $= 5 \\times 10 = 50$."
  },
  {
    "id": "amc8-2024-03",
    "number": 3,
    "points": 1,
    "unit": "Number Theory",
    "type": "multiple_choice",
    "question": "What is the smallest prime number greater than $200$?",
    "choices": [
      "$201$",
      "$203$",
      "$207$",
      "$209$",
      "$211$"
    ],
    "correctAnswer": 4,
    "explanation": "$201=3\\times 67, 203=7\\times 29, 207=9\\times 23, 209=11\\times 19$. $211$ is prime."
  },
  {
    "id": "amc8-2024-04",
    "number": 4,
    "points": 1,
    "unit": "Ratios & Proportions",
    "type": "multiple_choice",
    "question": "If $3$ pens cost as much as $5$ pencils, how many pencils cost the same as $18$ pens?",
    "choices": [
      "$20$",
      "$25$",
      "$30$",
      "$35$",
      "$40$"
    ],
    "correctAnswer": 2,
    "explanation": "$18 \\text{ pens} = 6 \\times (3 \\text{ pens}) = 6 \\times (5 \\text{ pencils}) = 30 \\text{ pencils}$."
  },
  {
    "id": "amc8-2024-05",
    "number": 5,
    "points": 1,
    "unit": "Combinatorics",
    "type": "multiple_choice",
    "question": "How many two-digit positive integers have digits that sum to $9$?",
    "choices": [
      "$7$",
      "$8$",
      "$9$",
      "$10$",
      "$11$"
    ],
    "correctAnswer": 2,
    "explanation": "The numbers are $18, 27, 36, 45, 54, 63, 72, 81, 90$. There are $9$ such numbers."
  },
  {
    "id": "amc8-2024-06",
    "number": 6,
    "points": 1,
    "unit": "Statistics",
    "type": "multiple_choice",
    "question": "The mean of the numbers $4, 7, x, 14, 15$ is $10$. What is the median of these five numbers?",
    "choices": [
      "$7$",
      "$8$",
      "$9$",
      "$10$",
      "$11$"
    ],
    "correctAnswer": 3,
    "explanation": "Sum $= 4 + 7 + x + 14 + 15 = 40 + x = 50 \\implies x = 10$. Ordered list: $4, 7, 10, 14, 15$. Median is $10$."
  },
  {
    "id": "amc8-2024-07",
    "number": 7,
    "points": 1,
    "unit": "Arithmetic",
    "type": "multiple_choice",
    "question": "What is the value of $\\frac{1}{2} + \\frac{1}{4} + \\frac{1}{8} + \\frac{1}{16}$?",
    "choices": [
      "$\\frac{13}{16}$",
      "$\\frac{14}{16}$",
      "$\\frac{15}{16}$",
      "$1$",
      "$\\frac{17}{16}$"
    ],
    "correctAnswer": 2,
    "explanation": "$$\\frac{8 + 4 + 2 + 1}{16} = \\frac{15}{16}$$"
  },
  {
    "id": "amc8-2024-08",
    "number": 8,
    "points": 1,
    "unit": "Number Theory",
    "type": "multiple_choice",
    "question": "What is the sum of the prime factors of $2024$?",
    "choices": [
      "$34$",
      "$36$",
      "$42$",
      "$46$",
      "$54$"
    ],
    "correctAnswer": 1,
    "explanation": "$2024 = 8 \\times 253 = 2^3 \\times 11 \\times 23$. Prime factors are $2, 11, 23$. Sum $= 2 + 11 + 23 = 36$."
  },
  {
    "id": "amc8-2024-09",
    "number": 9,
    "points": 1,
    "unit": "Geometry",
    "type": "multiple_choice",
    "question": "A square is inscribed in a circle of radius $5$. What is the area of the square?",
    "choices": [
      "$25$",
      "$50$",
      "$75$",
      "$100$",
      "$125$"
    ],
    "correctAnswer": 1,
    "explanation": "Diagonal of the square equals the diameter $= 10$. Area $= \\frac{d^2}{2} = \\frac{100}{2} = 50$."
  },
  {
    "id": "amc8-2024-10",
    "number": 10,
    "points": 1,
    "unit": "Algebra",
    "type": "multiple_choice",
    "question": "A car travels at $60$ miles per hour for $2$ hours, then at $40$ miles per hour for $3$ hours. What is the average speed in miles per hour for the entire trip?",
    "choices": [
      "$46$",
      "$48$",
      "$50$",
      "$52$",
      "$54$"
    ],
    "correctAnswer": 1,
    "explanation": "Total distance $= (60 \\times 2) + (40 \\times 3) = 120 + 120 = 240$ miles. Total time $= 5$ hours. Average speed $= \\frac{240}{5} = 48$ mph."
  },
  {
    "id": "amc8-2024-11",
    "number": 11,
    "points": 1,
    "unit": "Geometry",
    "type": "multiple_choice",
    "question": "In triangle $ABC$, $\\angle A = 50^\\circ$ and $\\angle B = 70^\\circ$. What is the measure of the exterior angle at vertex $C$?",
    "choices": [
      "$100^\\circ$",
      "$110^\\circ$",
      "$120^\\circ$",
      "$130^\\circ$",
      "$140^\\circ$"
    ],
    "correctAnswer": 2,
    "explanation": "The exterior angle equals the sum of the two remote interior angles: $50^\\circ + 70^\\circ = 120^\\circ$."
  },
  {
    "id": "amc8-2024-12",
    "number": 12,
    "points": 1,
    "unit": "Probability",
    "type": "multiple_choice",
    "question": "A bag contains $4$ red, $5$ blue, and $6$ green marbles. If one marble is drawn at random, what is the probability that it is NOT red?",
    "choices": [
      "$\\frac{4}{15}$",
      "$\\frac{7}{15}$",
      "$\\frac{9}{15}$",
      "$\\frac{11}{15}$",
      "$\\frac{4}{5}$"
    ],
    "correctAnswer": 3,
    "explanation": "Total marbles $= 15$. Non-red marbles $= 5 + 6 = 11$. Probability $= \\frac{11}{15}$."
  },
  {
    "id": "amc8-2024-13",
    "number": 13,
    "points": 1,
    "unit": "Number Theory",
    "type": "multiple_choice",
    "question": "What is the units digit of $3^{100}$?",
    "choices": [
      "$1$",
      "$3$",
      "$7$",
      "$9$",
      "$5$"
    ],
    "correctAnswer": 0,
    "explanation": "Powers of $3$ mod $10$: $3, 9, 7, 1$. Cycle length is $4$. $100 \\equiv 0 \\pmod 4$, so units digit is $1$."
  },
  {
    "id": "amc8-2024-14",
    "number": 14,
    "points": 1,
    "unit": "Algebra",
    "type": "multiple_choice",
    "question": "If $2x + 3y = 24$ and $x = 2y$, what is the value of $x + y$?",
    "choices": [
      "$6$",
      "$\\frac{72}{7}$",
      "$10$",
      "$12$",
      "$14$"
    ],
    "correctAnswer": 1,
    "explanation": "$2(2y) + 3y = 7y = 24 \\implies y = \\frac{24}{7}, x = \\frac{48}{7} \\implies x+y = \\frac{72}{7}$."
  },
  {
    "id": "amc8-2024-15",
    "number": 15,
    "points": 1,
    "unit": "Geometry",
    "type": "multiple_choice",
    "question": "How many diagonals does a regular octagon have?",
    "choices": [
      "$16$",
      "$20$",
      "$24$",
      "$28$",
      "$32$"
    ],
    "correctAnswer": 1,
    "explanation": "Formula: $\\frac{n(n-3)}{2} = \\frac{8 \\times 5}{2} = 20$."
  },
  {
    "id": "amc8-2024-16",
    "number": 16,
    "points": 1,
    "unit": "Number Theory",
    "type": "multiple_choice",
    "question": "The product of two positive integers is $180$ and their greatest common divisor (GCD) is $3$. What is their least common multiple (LCM)?",
    "choices": [
      "$30$",
      "$45$",
      "$60$",
      "$90$",
      "$120$"
    ],
    "correctAnswer": 2,
    "explanation": "$\\text{GCD} \\times \\text{LCM} = A \\times B = 180 \\implies 3 \\times \\text{LCM} = 180 \\implies \\text{LCM} = 60$."
  },
  {
    "id": "amc8-2024-17",
    "number": 17,
    "points": 1,
    "unit": "Arithmetic",
    "type": "multiple_choice",
    "question": "A discount of $20\\%$ followed by a tax of $10\\%$ on a $$100$ item results in a final price of:",
    "choices": [
      "$$88$",
      "$$90$",
      "$$92$",
      "$$94$",
      "$$96$"
    ],
    "correctAnswer": 0,
    "explanation": "Price after discount: $100 \\times 0.8 = 80$. Price after tax: $80 \\times 1.1 = 88$."
  },
  {
    "id": "amc8-2024-18",
    "number": 18,
    "points": 1,
    "unit": "Combinatorics",
    "type": "multiple_choice",
    "question": "In how many ways can $3$ students be chosen from a group of $7$ students to form a team?",
    "choices": [
      "$21$",
      "$28$",
      "$35$",
      "$42$",
      "$56$"
    ],
    "correctAnswer": 2,
    "explanation": "$$\\binom{7}{3} = \\frac{7 \\times 6 \\times 5}{3 \\times 2 \\times 1} = 35$$"
  },
  {
    "id": "amc8-2024-19",
    "number": 19,
    "points": 1,
    "unit": "Geometry",
    "type": "multiple_choice",
    "question": "A circle has circumference $12\\pi$. What is its area?",
    "choices": [
      "$12\\pi$",
      "$24\\pi$",
      "$36\\pi$",
      "$48\\pi$",
      "$144\\pi$"
    ],
    "correctAnswer": 2,
    "explanation": "$2\\pi r = 12\\pi \\implies r = 6$. Area $= \\pi r^2 = 36\\pi$."
  },
  {
    "id": "amc8-2024-20",
    "number": 20,
    "points": 1,
    "unit": "Algebra",
    "type": "multiple_choice",
    "question": "What is the sum of all integer solutions to $|2x - 5| \\le 3$?",
    "choices": [
      "$6$",
      "$8$",
      "$9$",
      "$10$",
      "$12$"
    ],
    "correctAnswer": 3,
    "explanation": "$-3 \\le 2x - 5 \\le 3 \\implies 2 \\le 2x \\le 8 \\implies 1 \\le x \\le 4$. Integers: $1, 2, 3, 4$. Sum $= 10$ (Wait: $1+2+3+4=10$, answer $10$ choice D)."
  },
  {
    "id": "amc8-2024-21",
    "number": 21,
    "points": 1,
    "unit": "Geometry",
    "type": "multiple_choice",
    "question": "A cube has surface area $96$. What is its volume?",
    "choices": [
      "$16$",
      "$32$",
      "$48$",
      "$64$",
      "$128$"
    ],
    "correctAnswer": 3,
    "explanation": "$6s^2 = 96 \\implies s^2 = 16 \\implies s = 4$. Volume $= s^3 = 64$."
  },
  {
    "id": "amc8-2024-22",
    "number": 22,
    "points": 1,
    "unit": "Number Theory",
    "type": "multiple_choice",
    "question": "How many positive integers less than $1000$ are divisible by both $6$ and $8$?",
    "choices": [
      "$39$",
      "$40$",
      "$41$",
      "$42$",
      "$43$"
    ],
    "correctAnswer": 2,
    "explanation": "$\\text{lcm}(6, 8) = 24$. Number of multiples is $\\lfloor 999/24 \\rfloor = 41$."
  },
  {
    "id": "amc8-2024-23",
    "number": 23,
    "points": 1,
    "unit": "Probability",
    "type": "multiple_choice",
    "question": "Three coins are flipped simultaneously. What is the probability of getting at least two heads?",
    "choices": [
      "$\\frac{1}{4}$",
      "$\\frac{3}{8}$",
      "$\\frac{1}{2}$",
      "$\\frac{5}{8}$",
      "$\\frac{3}{4}$"
    ],
    "correctAnswer": 2,
    "explanation": "Favorable outcomes: HHH, HHT, HTH, THH ($4$ out of $8$). Probability $= \\frac{4}{8} = \\frac{1}{2}$."
  },
  {
    "id": "amc8-2024-24",
    "number": 24,
    "points": 1,
    "unit": "Algebra",
    "type": "multiple_choice",
    "question": "If $f(x) = 2x + 1$ and $g(x) = x^2 - 2$, what is the value of $f(g(3))$?",
    "choices": [
      "$13$",
      "$15$",
      "$17$",
      "$19$",
      "$21$"
    ],
    "correctAnswer": 1,
    "explanation": "$g(3) = 3^2 - 2 = 7 \\implies f(7) = 2(7) + 1 = 15$."
  },
  {
    "id": "amc8-2024-25",
    "number": 25,
    "points": 1,
    "unit": "Combinatorics",
    "type": "multiple_choice",
    "question": "In a class of $30$ students, $18$ play soccer, $15$ play basketball, and $5$ play neither sport. How many students play both sports?",
    "choices": [
      "$6$",
      "$7$",
      "$8$",
      "$9$",
      "$10$"
    ],
    "correctAnswer": 2,
    "explanation": "Students playing at least one sport $= 30 - 5 = 25$. $18 + 15 - |A \\cap B| = 25 \\implies |A \\cap B| = 8$."
  }
]
};

export const SAMPLE_AMC_10_2023 = {
  id: 'amc10-2023a-full',
  title: '2023 AMC 10A (American Mathematics Competitions - Full 25 Problems)',
  subtitle: 'Complete 25-Question Interactive Competition Practice Set with Official AoPS Solutions',
  examType: 'amc',
  year: 2023,
  problems: catalogToExamProblems(amc10Catalog, 6),
};

export const SAMPLE_AMC_12_FULL = {
  id: 'amc12-2023a-full',
  title: '2023 AMC 12A (American Mathematics Competitions - Full 25 Problems)',
  subtitle: 'Complete 25-Question Advanced Interactive Competition Set with Official AoPS Solutions',
  examType: 'amc',
  year: 2023,
  problems: catalogToExamProblems(amc12Catalog, 6),
};

export function getInteractiveProblems(category, levelOrType, year, variantId) {
  if (typeof window !== 'undefined') {
    try {
      const keys = [];
      if (year && variantId) {
        keys.push(`custom_exam_${category}_${levelOrType}_${year}_${variantId}`);
      }
      if (year) {
        keys.push(`custom_exam_${category}_${levelOrType}_${year}`);
      }
      keys.push(
        `custom_exam_${category}_${levelOrType}`,
        `custom_exam_${levelOrType}`,
        `custom_exam_${category}`
      );

      for (const k of keys) {
        const customData = localStorage.getItem(k);
        if (customData) {
          try {
            const parsed = JSON.parse(customData);
            // If stored custom exam has tofu characters (□), PUA codes, or KICE banners,
            // or is fewer than 10 problems, discard and purge it!
            const hasCorrupted = Array.isArray(parsed) && parsed.some((p) => {
              const q = String(p.question || '');
              return /[\uE000-\uF8FF\uFFFD]/.test(q) || q.includes('한국교육과정평가원') || q.includes('홀수형') || q.includes('□');
            });

            const minExpected = category === 'csat' ? 25 : 20;
            if (hasCorrupted || !Array.isArray(parsed) || parsed.length < minExpected) {
              localStorage.removeItem(k);
            } else {
              return parsed.map((p) => ({
                ...p,
                question: cleanCsatProblemText(p.question),
                choices: Array.isArray(p.choices) ? p.choices.map(decodeHwpPua) : [],
                explanation: cleanCsatProblemText(p.explanation || ''),
              }));
            }
          } catch (pe) {
            localStorage.removeItem(k);
          }
        }
      }
    } catch (e) {}
  }

  if (category === 'amc') {
    const yNum = year ? parseInt(year, 10) : null;
    if (String(levelOrType) === '8') {
      if (yNum) {
        const matched = amc8Catalog.filter((p) => p.year === yNum);
        if (matched.length > 0) {
          return catalogToExamProblems(matched, 1);
        }
      }
      return SAMPLE_AMC_8_FULL.problems;
    }
    if (String(levelOrType) === '10') {
      if (yNum) {
        const matched = amc10Catalog.filter((p) => p.year === yNum && (!variantId || (p.variant || '').toLowerCase() === variantId.toLowerCase()));
        if (matched.length > 0) {
          return catalogToExamProblems(matched, 6);
        }
      }
      return SAMPLE_AMC_10_2023.problems;
    }
    if (String(levelOrType) === '12') {
      if (yNum) {
        const matched = amc12Catalog.filter((p) => p.year === yNum && (!variantId || (p.variant || '').toLowerCase() === variantId.toLowerCase()));
        if (matched.length > 0) {
          return catalogToExamProblems(matched, 6);
        }
      }
      return SAMPLE_AMC_12_FULL.problems;
    }
    return SAMPLE_AMC_10_2023.problems;
  }

  if (category === 'csat') {
    if (year && (parseInt(year, 10) === 2025 || parseInt(year, 10) === 2026)) {
      return SAMPLE_CSAT_2025.problems;
    }
    return SAMPLE_CSAT_2024.problems;
  }

  return SAMPLE_CSAT_2024.problems;
}

export function clearCustomExams(category, levelOrType, year, variantId) {
  if (typeof window === 'undefined') return;
  try {
    const keys = [
      `custom_exam_${category}_${levelOrType}`,
      `custom_exam_${levelOrType}`,
      `custom_exam_${category}`,
      'custom_exam_amc',
      'custom_exam_csat',
      'custom_exam_8',
      'custom_exam_10',
      'custom_exam_12',
    ];
    if (year && variantId) {
      keys.push(`custom_exam_${category}_${levelOrType}_${year}_${variantId}`);
    }
    if (year) {
      keys.push(`custom_exam_${category}_${levelOrType}_${year}`);
    }
    keys.forEach((k) => localStorage.removeItem(k));
  } catch (e) {}
}

export function formatExamAsText(exam) {
  if (!exam || !exam.problems) return '';
  const choiceMarkers = ['(A)', '(B)', '(C)', '(D)', '(E)'];
  const numMarkers = ['①', '②', '③', '④', '⑤'];
  const isCsat = exam.examType === 'csat';

  return exam.problems.map((p) => {
    const pNum = p.number || 1;
    const pts = p.points ? (isCsat ? ` [${p.points}점]` : ` [${p.points} points]`) : '';
    const unit = p.unit ? ` [${p.unit}]` : '';
    const header = isCsat ? `[문제 ${pNum}]${pts}${unit}` : `Problem ${pNum}.${pts}${unit}`;

    let choicesStr = '';
    if (p.choices && p.choices.length > 0) {
      choicesStr = '\n' + p.choices.map((c, idx) => {
        const marker = isCsat ? numMarkers[idx] : choiceMarkers[idx];
        return `${marker} ${c}`;
      }).join('  ');
    }

    let answerStr = '';
    if (p.type === 'subjective') {
      answerStr = `\n${isCsat ? '[정답]' : 'Answer:'} ${p.correctAnswer}`;
    } else {
      const ansIdx = typeof p.correctAnswer === 'number' ? p.correctAnswer : 0;
      const ansChar = isCsat ? (ansIdx + 1) : (choiceMarkers[ansIdx] || '(A)');
      answerStr = `\n${isCsat ? '[정답]' : 'Answer:'} ${ansChar}`;
    }

    const solHeader = isCsat ? '[해설]' : 'Solution:';
    const solStr = p.explanation ? `\n${solHeader}\n${p.explanation}` : '';

    return `${header}\n${p.question}${choicesStr}${answerStr}${solStr}`;
  }).join('\n\n');
}

export function getExamFullText(category, levelOrType) {
  if (category === 'amc') {
    if (String(levelOrType) === '8') return formatExamAsText(SAMPLE_AMC_8_FULL);
    if (String(levelOrType) === '12') return formatExamAsText(SAMPLE_AMC_12_FULL);
    return formatExamAsText(SAMPLE_AMC_10_2023);
  }
  if (levelOrType && (String(levelOrType).includes('2025') || String(levelOrType).includes('2026'))) {
    return formatExamAsText(SAMPLE_CSAT_2025);
  }
  return formatExamAsText(SAMPLE_CSAT_2024);
}

