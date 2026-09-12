# -*- coding: utf-8 -*-
import json

problems = [
  {
    "id": "csat-2025-01",
    "number": 1,
    "points": 2,
    "unit": "수학 I (지수와 로그)",
    "type": "multiple_choice",
    "question": "$9^{\\frac{1}{4}} \\times 3^{-\\frac{1}{2}}$ 의 값은?",
    "choices": ["$1$", "$\\sqrt{3}$", "$3$", "$3\\sqrt{3}$", "$9$"],
    "correctAnswer": 0,
    "explanation": "$$9^{\\frac{1}{4}} \\times 3^{-\\frac{1}{2}} = (3^2)^{\\frac{1}{4}} \\times 3^{-\\frac{1}{2}} = 3^{\\frac{1}{2}} \\times 3^{-\\frac{1}{2}} = 3^0 = 1$$"
  },
  {
    "id": "csat-2025-02",
    "number": 2,
    "points": 2,
    "unit": "수학 II (함수의 극한과 연속)",
    "type": "multiple_choice",
    "question": "함수 $f(x)=3x^3+4x+1$ 에 대하여 $\\lim_{h \\to 0} \\frac{f(1+h)-f(1)}{h}$ 의 값은?",
    "choices": ["$7$", "$9$", "$11$", "$13$", "$15$"],
    "correctAnswer": 3,
    "explanation": "$$f'(1) = \\lim_{h \\to 0} \\frac{f(1+h)-f(1)}{h}$$\n$$f'(x) = 9x^2 + 4 \\implies f'(1) = 9(1)^2 + 4 = 13$$"
  },
  {
    "id": "csat-2025-03",
    "number": 3,
    "points": 3,
    "unit": "수학 I (수열)",
    "type": "multiple_choice",
    "question": "수열 $\\{a_n\\}$ 에 대하여 $\\sum_{k=1}^4 (2a_k - k) = 0$ 일 때, $\\sum_{k=1}^4 a_k$ 의 값은?",
    "choices": ["$1$", "$2$", "$3$", "$4$", "$5$"],
    "correctAnswer": 4,
    "explanation": "$$2\\sum_{k=1}^4 a_k - \\sum_{k=1}^4 k = 0 \\implies 2\\sum_{k=1}^4 a_k = \\frac{4 \\times 5}{2} = 10 \\implies \\sum_{k=1}^4 a_k = 5$$"
  },
  {
    "id": "csat-2025-04",
    "number": 4,
    "points": 3,
    "unit": "수학 II (함수의 극한과 연속)",
    "type": "multiple_choice",
    "question": "함수 $$f(x) = \\begin{cases} 3x-2 & (x < 1) \\\\ x^2 - 3x + a & (x \\ge 1) \\end{cases}$$ 이 실수 전체의 집합에서 연속일 때, 상수 $a$ 의 값은?",
    "choices": ["$1$", "$2$", "$3$", "$4$", "$5$"],
    "correctAnswer": 2,
    "explanation": "$x=1$ 에서 연속이어야 하므로 좌극한과 우극한이 일치해야 합니다.\n$$\\lim_{x \\to 1^-} (3x-2) = 1$$\n$$1^2 - 3(1) + a = a - 2 = 1 \\implies a = 3$$"
  },
  {
    "id": "csat-2025-05",
    "number": 5,
    "points": 3,
    "unit": "수학 II (미분)",
    "type": "multiple_choice",
    "question": "함수 $f(x)=(x+2)(2x^2-x-2)$ 에 대하여 $f'(1)$ 의 값은?",
    "choices": ["$6$", "$7$", "$8$", "$9$", "$10$"],
    "correctAnswer": 2,
    "explanation": "곱의 미분법을 적용합니다.\n$$f'(x) = 1 \\cdot (2x^2-x-2) + (x+2)(4x-1)$$\n$$f'(1) = (2-1-2) + (3)(3) = -1 + 9 = 8$$"
  },
  {
    "id": "csat-2025-06",
    "number": 6,
    "points": 3,
    "unit": "수학 I (지수와 로그)",
    "type": "multiple_choice",
    "question": "$1$ 보다 큰 두 실수 $a, b$ 가 $$\\log_a b = 3, \\quad \\log_{\\frac{3}{a}} b = \\frac{1}{2}$$ 을 만족시킬 때, $\\log_9 ab$ 의 값은?",
    "choices": ["$\\frac{3}{8}$", "$\\frac{1}{2}$", "$\\frac{5}{8}$", "$\\frac{3}{4}$", "$\\frac{7}{8}$"],
    "correctAnswer": 4,
    "explanation": "밑 변환 공식과 로그 성질을 이용합니다.\n$$\\log_b a = \\frac{1}{3} \\implies b^{\\frac{1}{3}} = a$$\n$$\\log_{\\frac{3}{a}} b = \\frac{1}{2} \\implies b = \\left(\\frac{3}{a}\\right)^{\\frac{1}{2}} \\implies b^2 = \\frac{3}{a}$$\n$$a = b^{\\frac{1}{3}} \\implies b^2 = \\frac{3}{b^{\\frac{1}{3}}} \\implies b^{\\frac{7}{3}} = 3$$\n$$a = 3^{\\frac{1}{7}}, \\quad b = 3^{\\frac{3}{7}} \\implies ab = 3^{\\frac{4}{7}}$$\n$$\\log_9 ab = \\log_{3^2} 3^{\\frac{4}{7}} = \\frac{1}{2} \\times \\frac{4}{7} = \\frac{2}{7}$$"
  },
  {
    "id": "csat-2025-07",
    "number": 7,
    "points": 3,
    "unit": "수학 II (적분)",
    "type": "multiple_choice",
    "question": "두 곡선 $y=x^2+3, \\quad y=-\\frac{1}{5}x^2+3$ 과 직선 $x=2$ 로 둘러싸인 부분의 넓이는?",
    "choices": ["$\\frac{18}{5}$", "$\\frac{7}{2}$", "$\\frac{17}{5}$", "$\\frac{33}{10}$", "$\\frac{16}{5}$"],
    "correctAnswer": 0,
    "explanation": "두 곡선은 $x=0$ 에서 만납니다.\n$$S = \\int_0^2 \\left((x^2+3) - \\left(-\\frac{1}{5}x^2+3\\right)\\right) dx = \\int_0^2 \\frac{6}{5}x^2 dx = \\left[ \\frac{2}{5}x^3 \\right]_0^2 = \\frac{16}{5}$$"
  },
  {
    "id": "csat-2025-08",
    "number": 8,
    "points": 3,
    "unit": "수학 I (삼각함수)",
    "type": "multiple_choice",
    "question": "$\\sin\\theta + 3\\cos\\theta = 0$ 이고 $\\cos(\\pi-\\theta) > 0$ 일 때, $\\sin\\theta$ 의 값은?",
    "choices": ["$\\frac{3\\sqrt{10}}{10}$", "$\\frac{\\sqrt{10}}{5}$", "$0$", "$-\\frac{\\sqrt{10}}{5}$", "$-\\frac{3\\sqrt{10}}{10}$"],
    "correctAnswer": 0,
    "explanation": "$$\\cos(\\pi-\\theta) = -\\cos\\theta > 0 \\implies \\cos\\theta < 0$$\n$$\\sin\\theta = -3\\cos\\theta > 0 \\implies \\tan\\theta = -3$$\n$$\\sin\\theta = \\frac{3}{\\sqrt{1+(-3)^2}} = \\frac{3\\sqrt{10}}{10}$$"
  },
  {
    "id": "csat-2025-09",
    "number": 9,
    "points": 4,
    "unit": "수학 II (미분)",
    "type": "multiple_choice",
    "question": "양수 $a$ 에 대하여 함수 $f(x)$ 를 $$f(x)=x^3+3ax^2-9a^2x+4$$ 라 하자. 직선 $y=5$ 가 곡선 $y=f(x)$ 에 접할 때, $f(2)$ 의 값은?",
    "choices": ["$11$", "$12$", "$13$", "$14$", "$15$"],
    "correctAnswer": 3,
    "explanation": "$$f'(x) = 3(x+3a)(x-a) = 0$$\n극댓값 $f(-3a) = 27a^3 + 4 = 5 \\implies 27a^3 = 1 \\implies a = \\frac{1}{3}$.\n$$f(x) = x^3 + x^2 - x + 4$$\n$$f(2) = 8 + 4 - 2 + 4 = 14$$"
  },
  {
    "id": "csat-2025-10",
    "number": 10,
    "points": 4,
    "unit": "수학 I (지수함수와 로그함수)",
    "type": "multiple_choice",
    "question": "상수 $a(a>1)$ 에 대하여 곡선 $y=a^{x-2}$ 위의 점 중 제$1$사분면에 있는 점 $\\mathrm{A}$ 를 지나고 $y$ 축에 평행한 직선이 $x$ 축과 만나는 점을 $\\mathrm{B}$, 곡선 $y=a^{x-2}$ 의 점근선과 만나는 점을 $\\mathrm{C}$ 라 하자. $\\overline{\\mathrm{AB}} = \\overline{\\mathrm{BC}}$ 이고 삼각형 $\\mathrm{AOC}$ 의 넓이가 $8$ 일 때, $a \\times \\overline{\\mathrm{OB}}$ 의 값은? (단, $\\mathrm{O}$ 는 원점이다.)",
    "choices": ["$2^{\\frac{13}{6}}$", "$2^{\\frac{7}{3}}$", "$2^{\\frac{5}{2}}$", "$2^{\\frac{8}{3}}$", "$2^{\\frac{17}{6}}$"],
    "correctAnswer": 1,
    "explanation": "점 $\\mathrm{A}$ 의 좌표를 $(k, a^{k-2})$ 라 하면 $\\mathrm{B}(k, 0)$, $\\mathrm{C}(k, -2)$ 로부터 삼각형의 넓이 및 $a$ 값을 구합니다."
  },
  {
    "id": "csat-2025-11",
    "number": 11,
    "points": 4,
    "unit": "수학 II (미분 - 속도와 거리)",
    "type": "multiple_choice",
    "question": "시각 $t=0$ 일 때 원점을 출발하여 수직선 위를 움직이는 점 $\\mathrm{P}$ 가 있다. 실수 $k$ 에 대하여 시각이 $t(t \\ge 0)$ 일 때 점 $\\mathrm{P}$ 의 속도 $v(t)$ 가 $$v(t) = t^2 - kt + 4$$ 이다. <보기>에서 옳은 것만을 있는 대로 고른 것은?\n\n<보 기>\nㄱ. $k=0$ 이면, 시각 $t=1$ 일 때 점 $\\mathrm{P}$ 의 위치는 $\\frac{13}{3}$ 이다.\nㄴ. $k=3$ 이면, 출발한 후 점 $\\mathrm{P}$ 의 운동 방향이 한 번 바뀐다.\nㄷ. $k=5$ 이면, 시각 $t=0$ 에서 $t=2$ 까지 점 $\\mathrm{P}$ 가 움직인 거리는 $3$ 이다.",
    "choices": ["ㄱ", "ㄱ, ㄴ", "ㄱ, ㄷ", "ㄴ, ㄷ", "ㄱ, ㄴ, ㄷ"],
    "correctAnswer": 2,
    "explanation": "ㄱ: $x(1) = \\int_0^1 (t^2+4)dt = \\frac{13}{3}$ (참).\nㄴ: 판별식 $D = 9 - 16 < 0$ 이므로 속도의 부호가 바뀌지 않음 (거짓).\nㄷ: $v(t) = (t-1)(t-4)$ 이므로 $t \\in [0, 1]$ 에서 전진, $t \\in [1, 2]$ 에서 후진. 총 이동 거리는 $3$ (참).\n따라서 옳은 것은 ㄱ, ㄷ."
  },
  {
    "id": "csat-2025-12",
    "number": 12,
    "points": 4,
    "unit": "수학 I (수열 - 등비수열)",
    "type": "multiple_choice",
    "question": "등비수열 $\\{a_n\\}$ 이 $$2(a_1+a_4+a_7) = a_4+a_7+a_{10} = 6$$ 을 만족시킬 때, $a_{10}$ 의 값은?",
    "choices": ["$\\frac{22}{7}$", "$\\frac{24}{7}$", "$\\frac{26}{7}$", "$\\frac{30}{7}$", "$\\frac{32}{7}$"],
    "correctAnswer": 1,
    "explanation": "$$r^3(a_1+a_4+a_7) = 6 \\implies r^3(3) = 6 \\implies r^3 = 2$$\n$$a_1(1+r^3+r^6) = a_1(1+2+4) = 7a_1 = 3 \\implies a_1 = \\frac{3}{7}$$\n$$a_{10} = a_1 r^9 = \\frac{3}{7} \\times (r^3)^3 = \\frac{3}{7} \\times 8 = \\frac{24}{7}$$"
  },
  {
    "id": "csat-2025-13",
    "number": 13,
    "points": 4,
    "unit": "수학 II (도함수의 활용 - 접선의 방정식)",
    "type": "multiple_choice",
    "question": "함수 $f(x)=x^2-4x-3$ 에 대하여 곡선 $y=f(x)$ 위의 점 $(1, -6)$ 에서의 접선을 $l$ 이라 하고, 함수 $g(x)=(x^3-2x)f(x)$ 에 대하여 곡선 $y=g(x)$ 위의 점 $(1, 6)$ 에서의 접선을 $m$ 이라 하자. 두 직선 $l, m$ 과 $y$ 축으로 둘러싸인 도형의 넓이는?",
    "choices": ["$21$", "$28$", "$35$", "$42$", "$49$"],
    "correctAnswer": 3,
    "explanation": "두 접선의 $y$ 절편 차이와 교점의 $x$ 좌표를 곱하여 삼각형의 넓이 $42$ 를 구합니다."
  },
  {
    "id": "csat-2025-14",
    "number": 14,
    "points": 4,
    "unit": "수학 I (삼각함수 - 도형의 활용)",
    "type": "multiple_choice",
    "question": "그림과 같이 $\\overline{\\mathrm{AB}}=3, \\overline{\\mathrm{BC}}=4$ 이고 $\\angle\\mathrm{B}=\\frac{\\pi}{2}$ 인 직각삼각형 $\\mathrm{ABC}$ 가 있다. 선분 $\\mathrm{AB}$ 를 $2:1$ 로 내분하는 점을 $\\mathrm{D}$, 점 $\\mathrm{A}$ 를 중심으로 하고 반지름의 길이가 $\\overline{\\mathrm{AD}}$ 인 원이 선분 $\\mathrm{AC}$ 와 만나는 점을 $\\mathrm{E}$, 직선 $\\mathrm{AB}$ 가 이 원과 만나는 점 중 $\\mathrm{D}$ 가 아닌 점을 $\\mathrm{F}$ 라 하고, 호 $\\mathrm{EF}$ 위의 점 $\\mathrm{G}$ 를 $\\overline{\\mathrm{CG}}=2\\sqrt{6}$ 이 되도록 잡는다. 세 점 $\\mathrm{C, E, G}$ 를 지나는 원 위의 점 $\\mathrm{H}$ 가 $\\angle\\mathrm{HCG}=\\angle\\mathrm{BAC}$ 를 만족시킬 때, 선분 $\\overline{\\mathrm{GH}}$ 의 길이는?",
    "choices": ["$\\frac{6\\sqrt{15}}{5}$", "$\\frac{38\\sqrt{10}}{25}$", "$\\frac{14\\sqrt{3}}{5}$", "$\\frac{32\\sqrt{15}}{25}$", "$\\frac{8\\sqrt{10}}{5}$"],
    "correctAnswer": 3,
    "explanation": "코사인법칙과 원주각의 성질을 연립하여 선분 $\\overline{\\mathrm{GH}}$ 의 길이를 계산합니다."
  },
  {
    "id": "csat-2025-15",
    "number": 15,
    "points": 4,
    "unit": "수학 II (적분 - 정적분으로 정의된 함수)",
    "type": "multiple_choice",
    "question": "함수 $f(x)$ 가 $$f(x) = \\begin{cases} -x^2 & (x < 0) \\\\ x^2-x & (x \\ge 0) \\end{cases}$$ 이고, 양수 $a$ 에 대하여 함수 $g(x)$ 를 $$g(x) = \\begin{cases} ax+a & (x < -1) \\\\ 0 & (-1 \\le x < 1) \\\\ ax-a & (x \\ge 1) \\end{cases}$$ 이라 하자. 함수 $h(x)=\\int_0^x (g(t)-f(t))dt$ 가 오직 하나의 극값을 갖도록 하는 $a$ 의 최댓값을 $k$ 라 하자. $a=k$ 일 때, $k+h(3)$ 의 값은?",
    "choices": ["$\\frac{9}{2}$", "$\\frac{11}{2}$", "$\\frac{13}{2}$", "$\\frac{15}{2}$", "$\\frac{17}{2}$"],
    "correctAnswer": 1,
    "explanation": "$h'(x) = g(x)-f(x)$ 의 부호 변화 횟수가 $1$ 이어야 하므로 $a$ 의 경곗값을 판별합니다."
  },
  {
    "id": "csat-2025-16",
    "number": 16,
    "points": 3,
    "unit": "수학 I (수열의 귀납적 정의)",
    "type": "subjective",
    "question": "수열 $\\{a_n\\}$ 은 $a_1=1$ 이고, 모든 자연수 $n$ 에 대하여 $$a_{n+1} = n^2 a_n + 1$$ 을 만족시킨다. $a_3$ 의 값을 구하시오.",
    "choices": [],
    "correctAnswer": 9,
    "explanation": "$$a_2 = 1^2 \\cdot 1 + 1 = 2$$\n$$a_3 = 2^2 \\cdot 2 + 1 = 9$$"
  },
  {
    "id": "csat-2025-17",
    "number": 17,
    "points": 3,
    "unit": "수학 II (부정적분)",
    "type": "subjective",
    "question": "함수 $f(x)=4x^3-2x$ 의 한 부정적분 $F(x)$ 에 대하여 $F(0)=4$ 일 때, $F(2)$ 의 값을 구하시오.",
    "choices": [],
    "correctAnswer": 16,
    "explanation": "$$F(x) = x^4 - x^2 + 4 \\implies F(2) = 16 - 4 + 4 = 16$$"
  },
  {
    "id": "csat-2025-18",
    "number": 18,
    "points": 3,
    "unit": "수학 I (삼각함수의 활용 - 삼각형의 넓이)",
    "type": "subjective",
    "question": "$\\overline{\\mathrm{AB}}=5, \\overline{\\mathrm{AC}}=6$ 이고 $\\cos(\\angle\\mathrm{BAC}) = -\\frac{3}{5}$ 인 삼각형 $\\mathrm{ABC}$ 의 넓이를 구하시오.",
    "choices": [],
    "correctAnswer": 12,
    "explanation": "$$\\sin(\\angle\\mathrm{BAC}) = \\sqrt{1 - \\frac{9}{25}} = \\frac{4}{5}$$\n$$S = \\frac{1}{2} \\times 5 \\times 6 \\times \\frac{4}{5} = 12$$"
  },
  {
    "id": "csat-2025-19",
    "number": 19,
    "points": 3,
    "unit": "수학 II (도함수의 활용 - 부등식에의 활용)",
    "type": "subjective",
    "question": "$-2 \\le x \\le 2$ 인 모든 실수 $x$ 에 대하여 부등식 $$-k \\le 2x^3+3x^2-12x-8 \\le k$$ 가 성립하도록 하는 양수 $k$ 의 최솟값을 구하시오.",
    "choices": [],
    "correctAnswer": 15,
    "explanation": "$f(x) = 2x^3+3x^2-12x-8$ 의 극댓값 $f(-2)=12$, 극솟값 $f(1)=-15$, $f(2)=-4$ 이므로 최솟값 $k=15$ 입니다."
  },
  {
    "id": "csat-2025-20",
    "number": 20,
    "points": 4,
    "unit": "수학 I (수열의 합 - 귀납적 추론)",
    "type": "subjective",
    "question": "수열 $\\{a_n\\}$ 이 다음 조건을 만족시킨다.\n∙ $a_1=7$\n∙ $2$ 이상의 자연수 $n$ 에 대하여 $$\\sum_{k=1}^n a_k = \\frac{2}{3}a_n + \\frac{1}{6}n^2 - \\frac{1}{6}n + 10$$ 이다.\n과정에서 얻은 빈칸 식 $f(n)$ 및 수 $p, q$ 에 대하여 $\\frac{p \\times q}{f(12)}$ 의 값을 구하시오.",
    "choices": [],
    "correctAnswer": 64,
    "explanation": "빈칸 추론 단계에 따라 $f(n) = \\frac{1}{3}n$, $p=a_2$, $q$ 값을 계산합니다."
  },
  {
    "id": "csat-2025-21",
    "number": 21,
    "points": 4,
    "unit": "수학 II (함수의 연속과 미분 - 고난도)",
    "type": "subjective",
    "question": "최고차항의 계수가 양수인 삼차함수 $f(x)$ 와 실수 $t$ 에 대하여 함수 $$g(x) = \\begin{cases} -f(x) & (x < t) \\\\ f(x) & (x \\ge t) \\end{cases}$$ 는 실수 전체의 집합에서 연속이고 다음 조건을 만족시킨다.\n(가) 모든 실수 $a$ 에 대하여 $\\lim_{x \\to a^+} \\frac{g(x)}{x(x-2)}$ 의 값이 존재한다.\n(나) $\\lim_{x \\to m^+} \\frac{g(x)}{x(x-2)}$ 의 값이 음수가 되도록 하는 자연수 $m$ 의 집합은 $\\{g(-1), -\\frac{7}{2}g(1)\\}$ 이다.\n$g(-5)$ 의 값을 구하시오. (단, $g(-1) \\ne -\\frac{7}{2}g(1)$)",
    "choices": [],
    "correctAnswer": 180,
    "explanation": "연속성과 분모 $x(x-2)$ 에 의한 영점 조건 해석을 통해 함수 $g(x)$ 를 결정하고 $g(-5)=180$ 을 구합니다."
  },
  {
    "id": "csat-2025-22",
    "number": 22,
    "points": 4,
    "unit": "수학 I (지수함수와 로그함수 - 그래프 대칭이동)",
    "type": "subjective",
    "question": "곡선 $y=\\log_{16}(8x+2)$ 위의 점 $\\mathrm{A}(a, b)$ 와 곡선 $y=4^{x-1}-\\frac{1}{2}$ 위의 점 $\\mathrm{B}$ 가 제$1$사분면에 있다. 점 $\\mathrm{A}$ 를 직선 $y=x$ 에 대하여 대칭이동한 점이 직선 $\\mathrm{OB}$ 위에 있고 선분 $\\mathrm{AB}$ 의 중점의 좌표가 $\\left(\\frac{77}{8}, \\frac{133}{8}\\right)$ 일 때, $a \\times b = \\frac{q}{p}$ 이다. $p+q$ 의 값을 구하시오. (단, $\\mathrm{O}$ 는 원점이고, $p$ 와 $q$ 는 서로소인 자연수이다.)",
    "choices": [],
    "correctAnswer": 45,
    "explanation": "역함수 대칭점과 중점 관계를 연립하여 $a, b$ 의 곱을 도출합니다."
  },
  {
    "id": "csat-2025-23",
    "number": 23,
    "points": 2,
    "unit": "미적분 (삼각함수의 극한)",
    "type": "multiple_choice",
    "question": "$\\lim_{x \\to 0} \\frac{\\tan 6x}{2x}$ 의 값은?",
    "choices": ["$1$", "$2$", "$3$", "$4$", "$5$"],
    "correctAnswer": 2,
    "explanation": "$$\\lim_{x \\to 0} \\frac{\\tan 6x}{2x} = \\lim_{x \\to 0} \\left( \\frac{\\tan 6x}{6x} \\times 3 \\right) = 3$$"
  },
  {
    "id": "csat-2025-24",
    "number": 24,
    "points": 3,
    "unit": "미적분 (치환적분법)",
    "type": "multiple_choice",
    "question": "$\\int_0^{\\frac{\\pi}{2}} \\sqrt{\\sin x - \\sin^3 x} \\, dx$ 의 값은?",
    "choices": ["$\\frac{1}{6}$", "$\\frac{1}{3}$", "$\\frac{1}{2}$", "$\\frac{2}{3}$", "$\\frac{5}{6}$"],
    "correctAnswer": 3,
    "explanation": "$$\\int_0^{\\frac{\\pi}{2}} \\sqrt{\\sin x(1-\\sin^2 x)} dx = \\int_0^{\\frac{\\pi}{2}} \\sqrt{\\sin x} \\cos x dx = \\left[ \\frac{2}{3}(\\sin x)^{\\frac{3}{2}} \\right]_0^{\\frac{\\pi}{2}} = \\frac{2}{3}$$"
  },
  {
    "id": "csat-2025-25",
    "number": 25,
    "points": 3,
    "unit": "미적분 (수열의 극한)",
    "type": "multiple_choice",
    "question": "수열 $\\{a_n\\}$ 이 모든 자연수 $n$ 에 대하여 $$\\sqrt{9n^2-5} + 2n < a_n < 5n+1$$ 을 만족시킬 때, $\\lim_{n \\to \\infty} \\frac{(a_n+2)^2}{n a_n + 5n^2 - 2}$ 의 값은?",
    "choices": ["$\\frac{1}{2}$", "$\\frac{3}{2}$", "$\\frac{5}{2}$", "$\\frac{7}{2}$", "$\\frac{9}{2}$"],
    "correctAnswer": 2,
    "explanation": "$$\\lim_{n \\to \\infty} \\frac{a_n}{n} = 5$$\n$$\\lim_{n \\to \\infty} \\frac{(a_n+2)^2}{n a_n + 5n^2 - 2} = \\frac{5^2}{5+5} = \\frac{25}{10} = \\frac{5}{2}$$"
  },
  {
    "id": "csat-2025-26",
    "number": 26,
    "points": 3,
    "unit": "미적분 (입체도형의 부피)",
    "type": "multiple_choice",
    "question": "그림과 같이 곡선 $y=\\sqrt{x+x\\ln x}$ 와 $x$ 축 및 두 직선 $x=1, x=2$ 로 둘러싸인 부분을 밑면으로 하는 입체도형이 있다. 이 입체도형을 $x$ 축에 수직인 평면으로 자른 단면이 모두 정삼각형일 때, 이 입체도형의 부피는?",
    "choices": ["$\\frac{\\sqrt{3}(3+8\\ln 2)}{16}$", "$\\frac{\\sqrt{3}(5+12\\ln 2)}{24}$", "$\\frac{\\sqrt{3}(1+12\\ln 2)}{16}$", "$\\frac{\\sqrt{3}(1+2\\ln 2)}{4}$", "$\\frac{\\sqrt{3}(1+9\\ln 2)}{12}$"],
    "correctAnswer": 0,
    "explanation": "$$V = \\frac{\\sqrt{3}}{4} \\int_1^2 (x + x\\ln x)dx = \\frac{\\sqrt{3}(3+8\\ln 2)}{16}$$"
  },
  {
    "id": "csat-2025-27",
    "number": 27,
    "points": 3,
    "unit": "미적분 (매개변수 미분법)",
    "type": "multiple_choice",
    "question": "매개변수 $t$ 로 나타내어진 곡선 $$x=e^{4t}(1+\\sin 2\\pi t), \\quad y=e^{4t}(1-3\\cos 2\\pi t)$$ 를 $C$ 라 하자. 곡선 $C$ 가 직선 $y=3x-5e$ 와 만나는 점을 $\\mathrm{P}$ 라 할 때, 곡선 $C$ 위의 점 $\\mathrm{P}$ 에서의 접선의 기울기는?",
    "choices": ["$\\frac{3\\pi-4}{\\pi+4}$", "$\\frac{3\\pi-2}{\\pi+6}$", "$\\frac{3\\pi}{\\pi+8}$", "$\\frac{3\\pi+2}{\\pi+10}$", "$\\frac{3\\pi+4}{\\pi+12}$"],
    "correctAnswer": 0,
    "explanation": "매개변수 미분을 통해 교점 $\\mathrm{P}$ 에서의 접선 기울기 $\\frac{3\\pi-4}{\\pi+4}$ 를 구합니다."
  },
  {
    "id": "csat-2025-28",
    "number": 28,
    "points": 4,
    "unit": "미적분 (도함수의 활용과 정적분)",
    "type": "multiple_choice",
    "question": "함수 $$f(x)=\\frac{1}{2}x^2-x+\\ln(1+x)$$ 와 양수 $t$ 에 대하여 점 $(s, f(s))(s>0)$ 에서 $y$ 축에 내린 수선의 발과 곡선 $y=f(x)$ 위의 점 $(s, f(s))$ 에서의 접선이 $y$ 축과 만나는 점 사이의 거리가 $t$ 가 되도록 하는 $s$ 의 값을 $g(t)$ 라 하자. $\\int_{\\frac{1}{2}}^{\\frac{27}{4}} g(t)dt$ 의 값은?",
    "choices": ["$\\frac{161}{12}+\\ln 3$", "$\\frac{40}{3}+\\ln 3$", "$\\frac{53}{4}+\\ln 2$", "$\\frac{79}{6}+\\ln 2$", "$\\frac{157}{12}+\\ln 2$"],
    "correctAnswer": 0,
    "explanation": "접선의 $y$ 절편 차이로부터 역함수 관계를 세워 정적분을 계산합니다."
  },
  {
    "id": "csat-2025-29",
    "number": 29,
    "points": 4,
    "unit": "미적분 (급수와 수열)",
    "type": "subjective",
    "question": "첫째항과 공차가 같은 등차수열 $\\{a_n\\}$ 과 등비수열 $\\{b_n\\}$ 이 다음 조건을 만족시킨다.\n어떤 자연수 $k$ 에 대하여 $$b_{k+i} = \\frac{1}{a_i} - 1 \\quad (i=1, 2, 3)$$ 이다.\n부등식 $$0 < \\sum_{n=1}^\\infty \\left( b_n - \\frac{1}{a_n a_{n+1}} \\right) < 30$$ 이 성립할 때, $a_2 \\times \\sum_{n=1}^\\infty b_{2n} = \\frac{q}{p}$ 이다. $p+q$ 의 값을 구하시오. (단, $a_1 \\ne 0$ 이고, $p$ 와 $q$ 는 서로소인 자연수이다.)",
    "choices": [],
    "correctAnswer": 35,
    "explanation": "등비수열의 공비와 등차수열의 공차를 구하여 급수의 합을 계산합니다."
  },
  {
    "id": "csat-2025-30",
    "number": 30,
    "points": 4,
    "unit": "미적분 (역함수의 성질과 불연속점)",
    "type": "subjective",
    "question": "실수 전체의 집합에서 증가하는 연속함수 $f(x)$ 의 역함수 $f^{-1}(x)$ 가 다음 조건을 만족시킨다.\n(가) $|x| \\le 1$ 일 때, $4(f^{-1}(x))^2 = x^2(x^2-5)^2$ 이다.\n(나) $|x| > 1$ 일 때, $|f^{-1}(x)| = e^{|x|-1}+1$ 이다.\n실수 $m$ 에 대하여 기울기가 $m$ 이고 점 $(1, 0)$ 을 지나는 직선이 곡선 $y=f(x)$ 와 만나는 점의 개수를 $g(m)$ 이라 하자. 함수 $g(m)$ 이 $m=a, m=b(a<b)$ 에서 불연속일 때, $$g(a) \\times \\left(\\lim_{m \\to a^+} g(m)\\right) + g(b) \\times \\left(\\frac{\\ln b}{b}\\right)^2$$ 의 값을 구하시오. (단, $\\lim_{x \\to \\infty} \\frac{\\ln x}{x} = 0$)",
    "choices": [],
    "correctAnswer": 8,
    "explanation": "접선의 기울기에 따른 교점 개수 $g(m)$ 의 불연속점을 분석하여 값을 구합니다."
  }
]

with open('app/data/csat2025ProblemCatalog.json', 'w', encoding='utf-8') as f:
    json.dump(problems, f, ensure_ascii=False, indent=2)

print('Successfully generated app/data/csat2025ProblemCatalog.json with %d problems' % len(problems))
