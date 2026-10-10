# -*- coding: utf-8 -*-
"""
Builds AMC High School & CSAT Mapped Catalog (amcHighSchoolMappedCatalog.json)
Maps Korean CSAT, Common Math (짱쉬운 공통수학), and Calculus 1 (짱쉬운 미적분 1)
into AMC 10/12 topic categories (Functions, Advanced, Algebra, Geometry).
"""

import json
import os

def load_json(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def normalize_problem(p, u_id, s_id, level, source_prefix, idx):
    choices = p.get('choices', []) or []
    is_mc = len(choices) == 5
    
    c_ans = p.get('correctAnswer')
    raw_ans = p.get('answer', '')
    
    if is_mc:
        c_idx = 0
        if isinstance(c_ans, int) and 0 <= c_ans <= 4:
            c_idx = c_ans
        elif isinstance(c_ans, str) and c_ans.isdigit() and 0 <= int(c_ans) <= 4:
            c_idx = int(c_ans)
        elif isinstance(raw_ans, str) and raw_ans.isdigit() and 0 <= int(raw_ans) <= 4:
            c_idx = int(raw_ans)
        elif isinstance(raw_ans, str) and raw_ans in ['①', '②', '③', '④', '⑤']:
            c_idx = ['①', '②', '③', '④', '⑤'].index(raw_ans)
        else:
            c_idx = 0
            
        final_answer = str(c_idx)
        final_correct_answer = c_idx
        prob_type = 'multiple_choice'
    else:
        final_correct_answer = str(raw_ans or c_ans or '')
        final_answer = str(final_correct_answer)
        prob_type = 'subjective'
        choices = []

    expl = p.get('explanation') or p.get('solution') or ''
    if not expl or len(expl.strip()) < 3:
        if is_mc:
            ans_text = choices[final_correct_answer] if 0 <= final_correct_answer < len(choices) else ''
            expl = f"**[정답 및 풀이]**\n\n문제의 조건을 만족하는 정답은 **{['①', '②', '③', '④', '⑤'][final_correct_answer]} ({ans_text})** 입니다."
        else:
            expl = f"**[정답 및 풀이]**\n\n문제의 조건을 만족하는 정답은 **{final_answer}** 입니다."

    q_text = p.get('question', '').strip()
    p_id = p.get('id', f"{idx}")

    return {
        'id': f"amc-hs-{p_id}",
        'level': level,
        'year': p.get('year', 'Basic'),
        'variant': 'A',
        'problemNumber': idx,
        'subjectId': s_id,
        'unitId': u_id,
        'type': prob_type,
        'question': q_text,
        'choices': choices,
        'answer': final_answer,
        'correctAnswer': final_correct_answer,
        'explanation': expl,
        'points': 6,
        'tier': p.get('tier', 'basic'),
        'sourceLabel': f"{source_prefix} · {p.get('chapterName', '') or p.get('sourceLabel', '')}",
    }

def main():
    common_math = load_json('app/data/csatCommonMathProblemCatalog.json')
    csat = load_json('app/data/csatProblemCatalog.json')
    calc1 = load_json('app/data/csatCalculus1BasicCatalog.json')

    mapped_problems = []
    
    # 1. Map Common Math (짱쉬운 공통수학 상·하 748문항)
    for p in common_math:
        name = p.get('chapterName', '') or ''
        u_id = None
        s_id = 'advanced'
        level = 10
        
        if '다항식의 연산' in name or '곱셈공식' in name or '항등식' in name:
            u_id = 'polynomial-arithmetic'
            s_id = 'advanced'
            level = 10
        elif '인수분해' in name:
            u_id = 'factoring-quadratics'
            s_id = 'advanced'
            level = 10
        elif '나머지정리' in name or '고차방정식' in name:
            u_id = 'polynomial-zeros'
            s_id = 'advanced'
            level = 12
        elif '복소수의 연산' in name:
            u_id = 'complex-numbers'
            s_id = 'advanced'
            level = 10
        elif '복소수의 거듭제곱' in name:
            u_id = 'complex-numbers-polar'
            s_id = 'advanced'
            level = 12
        elif '이차방정식과 판별식' in name or '근과 계수' in name:
            u_id = 'completing-square'
            s_id = 'advanced'
            level = 10
        elif '이차함수의 활용' in name:
            u_id = 'quadratic-optimization'
            s_id = 'advanced'
            level = 10
        elif '연립방정식' in name:
            u_id = 'systems-of-equations'
            s_id = 'algebra'
            level = 10
        elif '일차부등식' in name:
            u_id = 'absolute-value-graphs'
            s_id = 'advanced'
            level = 10
        elif '이차부등식' in name:
            u_id = 'quadratic-inequalities'
            s_id = 'advanced'
            level = 10
        elif '직선의 방정식' in name:
            u_id = 'linear-graphs'
            s_id = 'algebra'
            level = 10
        elif '평면좌표' in name:
            u_id = 'coordinate-geometry'
            s_id = 'geometry'
            level = 10
        elif '도형의이동' in name:
            u_id = 'function-transformations'
            s_id = 'functions'
            level = 10
        elif '함수의뜻' in name or '합성함수' in name:
            u_id = 'function-properties'
            s_id = 'functions'
            level = 10
        elif '유리함수' in name:
            u_id = 'rational-functions'
            s_id = 'advanced'
            level = 12
        elif '무리함수' in name:
            u_id = 'radical-equations'
            s_id = 'advanced'
            level = 10
        elif '원의방정식' in name or '원과직선' in name:
            u_id = 'circles'
            s_id = 'geometry'
            level = 10
        elif '집합' in name:
            u_id = 'venn-sets'
            s_id = 'combinatorics-probability'
            level = 10
        elif '명제' in name or '조건' in name:
            u_id = 'logical-reasoning'
            s_id = 'logic-word-problems'
            level = 10
        elif '경우의수' in name or '순열' in name or '조합' in name:
            u_id = 'permutations-combinations'
            s_id = 'combinatorics-probability'
            level = 10

        if u_id:
            prob = normalize_problem(p, u_id, s_id, level, '공통수학/국제학교 매칭', len(mapped_problems) + 1)
            mapped_problems.append(prob)

    # 2. Map CSAT Problems (수능 기출)
    for p in csat:
        u_orig = p.get('unitId', '')
        u_id = None
        s_id = 'advanced'
        level = 12
        
        if u_orig == 'exp-log':
            u_id = 'exponential-logarithmic'
        elif u_orig == 'trig':
            u_id = 'trigonometry'
        elif u_orig == 'advanced-differentiation':
            u_id = 'trig-identities'
        elif u_orig == 'sequences':
            u_id = 'geometric-series'
            s_id = 'algebra'
        elif u_orig == 'counting':
            u_id = 'binomial-theorem'
            s_id = 'combinatorics-probability'
        elif u_orig == 'probability':
            u_id = 'probability-distributions'
            s_id = 'combinatorics-probability'
        elif u_orig == 'statistics':
            u_id = 'probability-distributions'
            s_id = 'statistics-data'
            
        if u_id:
            prob = normalize_problem(p, u_id, s_id, level, '수능/평가원 기출 매칭', len(mapped_problems) + 1)
            mapped_problems.append(prob)

    # 3. Map Calculus 1 (짱쉬운 미적분 1 374문항)
    for p in calc1:
        ch = p.get('chapter', 0)
        u_id = None
        s_id = 'advanced'
        level = 12
        
        if ch in [1, 2, 3]:
            u_id = 'radicals-exponents'
            s_id = 'algebra'
        elif ch == 4:
            u_id = 'geometric-series'
            s_id = 'algebra'
        elif ch == 5:
            u_id = 'rational-functions'
            s_id = 'advanced'
        elif ch == 6:
            u_id = 'radical-equations'
            s_id = 'advanced'
        elif ch in [7, 8]:
            u_id = 'function-properties'
            s_id = 'functions'
        elif ch in [9, 10, 11, 12]:
            u_id = 'quadratic-optimization'
            s_id = 'advanced'
            
        if u_id:
            prob = normalize_problem(p, u_id, s_id, level, '미적분 1 기본기출 매칭', len(mapped_problems) + 1)
            mapped_problems.append(prob)

    # 4. Add High-Quality Seed Curated Sets for the remaining AMC topics
    seeds = [
        # am-gm-inequality
        ('am-gm-inequality', 'advanced', 10, '양수 $x > 0$에 대하여 $x + \\frac{16}{x}$의 최솟값을 구하세요.', ['$6$', '$8$', '$10$', '$12$', '$16$'], 1, '산술-기하평균 부등식(AM-GM)에 의해\n$$x + \\frac{16}{x} \\ge 2\\sqrt{16} = 8$$\n등호는 $x = 4$일 때 성립합니다.'),
        ('am-gm-inequality', 'advanced', 10, '양수 $x > 0$에 대하여 $4x + \\frac{9}{x}$의 최솟값을 구하세요.', ['$10$', '$12$', '$14$', '$15$', '$18$'], 1, '산술-기하평균 부등식(AM-GM)에 의해\n$$4x + \\frac{9}{x} \\ge 2\\sqrt{36} = 12$$\n등호는 $4x = 9/x \\implies x = 3/2$일 때 성립합니다.'),
        ('am-gm-inequality', 'advanced', 10, '양수 $a, b > 0$에 대하여 $(a + b)\\left(\\frac{1}{a} + \\frac{1}{b}\\right)$의 최솟값을 구하세요.', ['$2$', '$3$', '$4$', '$5$', '$6$'], 2, '전개하면 $2 + \\left(\\frac{a}{b} + \\frac{b}{a}\\right) \\ge 2 + 2 = 4$입니다.'),
        ('am-gm-inequality', 'advanced', 10, '양수 $x, y > 0$에 대하여 $xy = 18$일 때, $2x + y$의 최솟값을 구하세요.', ['$8$', '$10$', '$12$', '$14$', '$16$'], 2, 'AM-GM에 의해 $2x + y \\ge 2\\sqrt{2xy} = 2\\sqrt{36} = 12$입니다.'),
        ('am-gm-inequality', 'advanced', 10, '양수 $x > 1$에 대하여 $x + \\frac{4}{x - 1}$의 최솟값을 구하세요.', ['$3$', '$4$', '$5$', '$6$', '$7$'], 2, '$$(x-1) + \\frac{4}{x-1} + 1 \\ge 2\\sqrt{4} + 1 = 5$$'),
        
        # binomial-theorem
        ('binomial-theorem', 'combinatorics-probability', 10, '$(x + 2)^5$ 의 전개식에서 $x^3$ 의 계수를 구하세요.', ['$20$', '$30$', '$40$', '$50$', '$80$'], 2, '일반항은 $\\binom{5}{3} x^3 (2)^2 = 10 \\times 4 x^3 = 40x^3$ 입니다. 따라서 계수는 $40$입니다.'),
        ('binomial-theorem', 'combinatorics-probability', 10, '$(2x - 1)^6$ 의 전개식에서 $x^2$ 의 계수를 구하세요.', ['$45$', '$60$', '$75$', '$80$', '$90$'], 1, '일반항 $\\binom{6}{2} (2x)^2 (-1)^4 = 15 \\times 4 \\times 1 = 60$ 입니다.'),
        ('binomial-theorem', 'combinatorics-probability', 10, '$\\sum_{k=0}^{6} \\binom{6}{k} = \\binom{6}{0} + \\binom{6}{1} + \\dots + \\binom{6}{6}$ 의 값을 구하세요.', ['$32$', '$48$', '$64$', '$96$', '$128$'], 2, '이항계수의 성질에 의해 $\\sum_{k=0}^n \\binom{n}{k} = 2^n$ 이므로 $2^6 = 64$ 입니다.'),
        ('binomial-theorem', 'combinatorics-probability', 10, '$(x^2 + \\frac{1}{x})^6$ 의 전개식에서 상수항을 구하세요.', ['$10$', '$15$', '$20$', '$25$', '$30$'], 1, '일반항 $\\binom{6}{k} (x^2)^{6-k} (x^{-1})^k = \\binom{6}{k} x^{12-3k}$. 상수항은 $12-3k = 0 \\implies k = 4$ 일 때 $\\binom{6}{4} = 15$ 입니다.'),
        ('binomial-theorem', 'combinatorics-probability', 10, '$(3x - 1)^4$ 의 전개식에서 모든 계수의 합을 구하세요.', ['$8$', '$16$', '$32$', '$64$', '$81$'], 1, '모든 계수의 합은 $x=1$ 을 대입한 값입니다: $(3(1) - 1)^4 = 2^4 = 16$.'),

        # probability-distributions
        ('probability-distributions', 'combinatorics-probability', 12, '확률변수 $X$ 가 이항분포 $B\\left(20, \\frac{1}{2}\\right)$ 를 따를 때, 평균 $E(X)$ 를 구하세요.', ['$5$', '$8$', '$10$', '$12$', '$15$'], 2, '이항분포의 평균 공식 $E(X) = np = 20 \\times \\frac{1}{2} = 10$ 입니다.'),
        ('probability-distributions', 'combinatorics-probability', 12, '확률변수 $X$ 가 이항분포 $B\\left(100, \\frac{1}{5}\\right)$ 를 따를 때, 분산 $V(X)$ 를 구하세요.', ['$12$', '$14$', '$16$', '$18$', '$20$'], 2, '$V(X) = np(1-p) = 100 \\times \\frac{1}{5} \\times \\frac{4}{5} = 16$ 입니다.'),
        ('probability-distributions', 'combinatorics-probability', 12, '확률변수 $X$ 에 대하여 $E(X) = 4, V(X) = 3$ 일 때, $E(2X + 5)$ 의 값을 구하세요.', ['$11$', '$12$', '$13$', '$14$', '$15$'], 2, '$E(2X + 5) = 2E(X) + 5 = 2(4) + 5 = 13$ 입니다.'),
        ('probability-distributions', 'combinatorics-probability', 12, '확률변수 $X$ 에 대하여 $V(X) = 2$ 일 때, $V(3X - 4)$ 의 값을 구하세요.', ['$12$', '$14$', '$18$', '$20$', '$22$'], 2, '$V(aX + b) = a^2 V(X)$ 이므로 $V(3X - 4) = 3^2 \\times 2 = 18$ 입니다.'),
        ('probability-distributions', 'combinatorics-probability', 12, '한 개의 주사위를 $3$번 던질 때, $1$의 눈이 나오는 횟수를 $X$라 하자. $P(X = 1)$ 의 값을 구하세요.', ['$\\frac{25}{72}$', '$\\frac{25}{216}$', '$\\frac{75}{216}$', '$\\frac{1}{6}$', '$\\frac{5}{36}$'], 0, '독립시행의 확률에 의해 $\\binom{3}{1} \\left(\\frac{1}{6}\\right)^1 \\left(\\frac{5}{6}\\right)^2 = 3 \\times \\frac{25}{216} = \\frac{75}{216} = \\frac{25}{72}$ 입니다.'),

        # paths-grids
        ('paths-grids', 'combinatorics-probability', 10, '가로 $4$칸, 세로 $3$칸 크기의 직사각형 격자판에서 좌하단 점 $A$에서 우상단 점 $B$까지 가는 최단 경로의 수를 구하세요.', ['$24$', '$30$', '$35$', '$42$', '$56$'], 2, '가로 방향 $4$번, 세로 방향 $3$번 이동하므로 최단 경로 수는 $\\binom{4+3}{3} = \\binom{7}{3} = \\frac{7 \\times 6 \\times 5}{6} = 35$ 입니다.'),
        ('paths-grids', 'combinatorics-probability', 10, '가로 $3$칸, 세로 $3$칸 크기의 정사각형 격자판에서 좌하단에서 우상단까지 가는 최단 경로의 수를 구하세요.', ['$15$', '$18$', '$20$', '$24$', '$30$'], 2, '$\\binom{3+3}{3} = \\binom{6}{3} = 20$ 입니다.'),
        ('paths-grids', 'combinatorics-probability', 10, '가로 $5$칸, 세로 $2$칸 크기의 격자판에서 $A$에서 $B$까지 가는 최단 경로의 수를 구하세요.', ['$18$', '$21$', '$25$', '$28$', '$35$'], 1, '$\\binom{5+2}{2} = \\binom{7}{2} = 21$ 입니다.'),
        ('paths-grids', 'combinatorics-probability', 10, '점 $A(0,0)$에서 점 $B(3,3)$으로 갈 때, 점 $P(1,2)$를 반드시 거쳐가는 최단 경로의 수를 구하세요.', ['$6$', '$8$', '$9$', '$10$', '$12$'], 2, '$A \\to P$ 경로는 $\\binom{1+2}{1} = 3$가지, $P \\to B$ 경로는 $\\binom{2+1}{1} = 3$가지이므로 $3 \\times 3 = 9$가지입니다.'),

        # modular-arithmetic
        ('modular-arithmetic', 'number-theory', 12, '$3^{20}$ 을 $7$ 로 나눈 나머지를 구하세요.', ['$1$', '$2$', '$3$', '$4$', '$5$'], 1, '페르마의 소정리에 의해 $3^6 \\equiv 1 \\pmod 7$ 입니다. $20 = 6 \\times 3 + 2$ 이므로 $3^{20} \\equiv (3^6)^3 \\times 3^2 \\equiv 1 \\times 9 \\equiv 2 \\pmod 7$ 입니다.'),
        ('modular-arithmetic', 'number-theory', 12, '$7^{50}$ 의 일의 자리 숫자를 구하세요.', ['$1$', '$3$', '$5$', '$7$', '$9$'], 4, '$7^1 = 7, 7^2 = 9, 7^3 = 3, 7^4 = 1$ 로 주기는 $4$ 입니다. $50 \\equiv 2 \\pmod 4$ 이므로 일의 자리는 $7^2 \\equiv 9$ 입니다.'),
        ('modular-arithmetic', 'number-theory', 12, '연립합동식 $x \\equiv 2 \\pmod 3$, $x \\equiv 3 \\pmod 5$ 를 만족하는 가장 작은 양의 정수 $x$ 를 구하세요.', ['$5$', '$8$', '$11$', '$13$', '$17$'], 1, '$x = 3k + 2$. $3k + 2 \\equiv 3 \\pmod 5 \\implies 3k \\equiv 1 \\equiv 6 \\pmod 5 \\implies k \\equiv 2 \\pmod 5$. 따라서 $x = 3(2) + 2 = 8$ 입니다.'),
        ('modular-arithmetic', 'number-theory', 12, '일차합동식 $3x \\equiv 2 \\pmod 5$ 를 만족하는 $0 \\le x < 5$ 인 $x$ 의 값을 구하세요.', ['$1$', '$2$', '$3$', '$4$', '$0$'], 3, '$3x \\equiv 2 \\equiv 12 \\pmod 5 \\implies x \\equiv 4 \\pmod 5$ 입니다.'),

        # diophantine-equations
        ('diophantine-equations', 'number-theory', 10, '방정식 $xy + 2x - 3y = 11$ 을 만족하는 양의 정수 순서쌍 $(x, y)$ 의 개수를 구하세요.', ['$1$', '$2$', '$3$', '$4$', '$5$'], 1, '사이먼 인수분해 기법(SFFT)을 적용합니다:\n$$(x - 3)(y + 2) + 6 = 11 \\implies (x - 3)(y + 2) = 5$$\n$y + 2 \\ge 3$ 이고 $5$ 는 소수이므로 $y + 2 = 5, x - 3 = 1 \\implies (x, y) = (4, 3)$ 으로 $1$개입니다.'),
        ('diophantine-equations', 'number-theory', 10, '방정식 $x^2 - y^2 = 21$ 을 만족하는 양의 정수 순서쌍 $(x, y)$ 의 개수를 구하세요.', ['$1$', '$2$', '$3$', '$4$', '$5$'], 1, '$(x - y)(x + y) = 21$. $21 = 1 \\times 21$ 또는 $3 \\times 7$.\n$(x-y, x+y) = (1, 21) \\implies (11, 10)$, $(3, 7) \\implies (5, 2)$ 로 $2$개입니다.'),
        ('diophantine-equations', 'number-theory', 10, '방정식 $2x + 5y = 31$ 을 만족하는 양의 정수 해 $(x, y)$ 의 개수를 구하세요.', ['$1$', '$2$', '$3$', '$4$', '$5$'], 2, '$5y = 31 - 2x$. $5y < 31 \\implies y \\in \\{1, 2, 3, 4, 5, 6\\}$. $31 - 5y$ 가 짝수여야 하므로 $y$ 는 홀수: $y = 1, 3, 5$ 일 때 각각 $x = 13, 8, 3$ 으로 $3$개입니다.'),

        # systems-of-equations
        ('systems-of-equations', 'algebra', 10, '연립방정식 $\\begin{cases} 2x + 3y = 13 \\\\ x - y = 4 \\end{cases}$ 를 만족하는 $x$ 의 값을 구하세요.', ['$3$', '$4$', '$5$', '$6$', '$7$'], 2, '두 번째 식에서 $x = y + 4$ 를 첫 번째 식에 대입하면 $2(y + 4) + 3y = 13 \\implies 5y = 5 \\implies y = 1, x = 5$ 입니다.'),
        ('systems-of-equations', 'algebra', 10, '연립방정식 $\\begin{cases} x + y = 7 \\\\ xy = 12 \\end{cases}$ 에서 $x > y$ 일 때, $x - y$ 의 값을 구하세요.', ['$1$', '$2$', '$3$', '$4$', '$5$'], 0, '이차방정식 $t^2 - 7t + 12 = 0 \\implies (t - 3)(t - 4) = 0$. $x > y$ 이므로 $x = 4, y = 3$. $x - y = 1$ 입니다.'),
        ('systems-of-equations', 'algebra', 10, '연립방정식 $\\begin{cases} 3x + 2y = 16 \\\\ 2x + 3y = 14 \\end{cases}$ 의 해를 구하여 $x + y$ 의 값을 구하세요.', ['$5$', '$6$', '$7$', '$8$', '$9$'], 1, '두 식을 변변 더하면 $5x + 5y = 30 \\implies x + y = 6$ 입니다.'),

        # linear-graphs
        ('linear-graphs', 'algebra', 10, '두 점 $A(1, 2)$와 $B(3, 8)$을 지나는 직선의 기울기를 구하세요.', ['$2$', '$3$', '$4$', '$5$', '$6$'], 1, '기울기 $m = \\frac{8 - 2}{3 - 1} = \\frac{6}{2} = 3$ 입니다.'),
        ('linear-graphs', 'algebra', 10, '직선 $2x - 3y + 6 = 0$ 의 $y$절편을 구하세요.', ['$1$', '$2$', '$3$', '$4$', '$-2$'], 1, '$x = 0$ 을 대입하면 $-3y + 6 = 0 \\implies y = 2$ 입니다.'),
        ('linear-graphs', 'algebra', 10, '직선 $y = 2x + 1$ 에 평행하고 점 $(1, 5)$를 지나는 직선의 $y$절편을 구하세요.', ['$1$', '$2$', '$3$', '$4$', '$5$'], 2, '평행하므로 기울기는 $2$ 입니다. $y - 5 = 2(x - 1) \\implies y = 2x + 3$. $y$절편은 $3$ 입니다.'),
        ('linear-graphs', 'algebra', 10, '직선 $y = -\\frac{1}{3}x + 2$ 에 수직인 직선의 기울기를 구하세요.', ['$-3$', '$-\\frac{1}{3}$', '$\\frac{1}{3}$', '$2$', '$3$'], 4, '수직인 두 직선의 기울기의 곱은 $-1$ 이므로 $m \\times \\left(-\\frac{1}{3}\\right) = -1 \\implies m = 3$ 입니다.'),

        # radicals-exponents
        ('radicals-exponents', 'algebra', 10, '$27^{\\frac{2}{3}}$ 의 값을 구하세요.', ['$3$', '$6$', '$9$', '$12$', '$18$'], 2, '$27^{\\frac{2}{3}} = (3^3)^{\\frac{2}{3}} = 3^2 = 9$ 입니다.'),
        ('radicals-exponents', 'algebra', 10, '$16^{\\frac{3}{4}}$ 의 값을 구하세요.', ['$4$', '$6$', '$8$', '$10$', '$12$'], 2, '$16^{\\frac{3}{4}} = (2^4)^{\\frac{3}{4}} = 2^3 = 8$ 입니다.'),
        ('radicals-exponents', 'algebra', 10, '$\\sqrt[3]{54} \\div \\sqrt[3]{2}$ 의 값을 구하세요.', ['$2$', '$3$', '$4$', '$6$', '$9$'], 1, '$$\\sqrt[3]{\\frac{54}{2}} = \\sqrt[3]{27} = 3$$'),
        ('radicals-exponents', 'algebra', 10, '$\\sqrt{8} + \\sqrt{18}$ 을 단순화한 값을 구하세요.', ['$4\\sqrt{2}$', '$5\\sqrt{2}$', '$6\\sqrt{2}$', '$7\\sqrt{2}$', '$10$'], 1, '$$\\sqrt{8} + \\sqrt{18} = 2\\sqrt{2} + 3\\sqrt{2} = 5\\sqrt{2}$$'),

        # geometric-series
        ('geometric-series', 'algebra', 10, '첫째항이 $2$이고 공비가 $3$인 등비수열의 제 $5$항을 구하세요.', ['$54$', '$108$', '$162$', '$243$', '$486$'], 2, '일반항 $a_n = a r^{n-1} = 2 \\times 3^{5-1} = 2 \\times 81 = 162$ 입니다.'),
        ('geometric-series', 'algebra', 10, '첫째항이 $3$이고 공비가 $2$인 등비수열의 첫째항부터 제 $4$항까지의 합을 구하세요.', ['$30$', '$35$', '$40$', '$45$', '$48$'], 3, '$$S_4 = \\frac{3(2^4 - 1)}{2 - 1} = 3(16 - 1) = 45$$'),
        ('geometric-series', 'algebra', 10, '세 양수 $2, x, 18$ 이 이 순서대로 등비수열을 이룰 때, $x$ 의 값을 구하세요.', ['$4$', '$6$', '$8$', '$9$', '$10$'], 1, '등비중항에 의해 $x^2 = 2 \\times 18 = 36 \\implies x = 6$ 입니다.'),
        ('geometric-series', 'algebra', 12, '첫째항이 $4$이고 공비가 $\\frac{1}{3}$인 무한등비급수의 합 $\\sum_{n=1}^\\infty a_n$ 을 구하세요.', ['$4$', '$5$', '$6$', '$7$', '$8$'], 2, '$$S = \\frac{a}{1 - r} = \\frac{4}{1 - 1/3} = \\frac{4}{2/3} = 6$$'),
    ]

    for (u_id, s_id, lvl, q, chs, ans_idx, expl) in seeds:
        mapped_problems.append({
            'id': f"amc-hs-seed-{u_id}-{len(mapped_problems) + 1}",
            'level': lvl,
            'year': 'Basic',
            'variant': 'A',
            'problemNumber': len(mapped_problems) + 1,
            'subjectId': s_id,
            'unitId': u_id,
            'type': 'multiple_choice',
            'question': q,
            'choices': chs,
            'answer': str(ans_idx),
            'correctAnswer': ans_idx,
            'explanation': expl,
            'points': 6,
            'tier': 'intermediate',
            'sourceLabel': '한국 수능/AMC 10·12 표준 기출 템플릿',
        })

    print(f"Total mapped problems collected: {len(mapped_problems)}")

    out_path = 'app/data/amcHighSchoolMappedCatalog.json'
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(mapped_problems, f, ensure_ascii=False, indent=2)

    print(f"Successfully saved {len(mapped_problems)} items to {out_path}!")

    # Summary by unit
    u_counts = {}
    for p in mapped_problems:
        u_counts[p['unitId']] = u_counts.get(p['unitId'], 0) + 1
    
    print("\nUnit counts in amcHighSchoolMappedCatalog:")
    for u, cnt in sorted(u_counts.items(), key=lambda x: -x[1]):
        print(f"  {u}: {cnt}문항")

if __name__ == '__main__':
    main()
