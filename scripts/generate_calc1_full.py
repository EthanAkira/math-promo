# -*- coding: utf-8 -*-
import json
import os

from build_calculus1_catalog import ANSWERS, CHAPTER_META, make_problem

def build_all_problems():
    problems = []

    # -------------------------------------------------------------
    # Chapter 1: 분수식의 극한값 (30 problems)
    # -------------------------------------------------------------
    ch1_data = [
        # 1..6: 기본문제다지기
        (1, r"\lim_{n \to \infty} \frac{2}{n}\text{의 값은?}", "0", ["\\frac{1}{2}", "1", "2", "4"], r"$$\lim_{n \to \infty} \frac{2}{n} = 0$$이므로 정답은 ①입니다.", ""),
        (2, r"\lim_{n \to \infty} \frac{4n-1}{n^2+2n}\text{의 값은?}", "0", ["-1", "-\\frac{1}{4}", "\\frac{1}{4}", "1"], r"분모의 최고차항 $n^2$으로 분모, 분자를 나누면 $$\lim_{n \to \infty} \frac{\frac{4}{n}-\frac{1}{n^2}}{1+\frac{2}{n}} = \frac{0}{1} = 0$$입니다.", ""),
        (3, r"\lim_{n \to \infty} \frac{3n+1}{n-3}\text{의 값은?}", "3", ["\\frac{1}{3}", "\\frac{1}{2}", "1", "2"], r"$$\lim_{n \to \infty} \frac{3n+1}{n-3} = \lim_{n \to \infty} \frac{3+\frac{1}{n}}{1-\frac{3}{n}} = \frac{3}{1} = 3$$입니다.", ""),
        (4, r"\lim_{n \to \infty} \frac{n-1}{2n+1}\text{의 값은?}", "\\frac{1}{2}", ["-2", "-\\frac{1}{2}", "\\frac{1}{4}", "1"], r"$$\lim_{n \to \infty} \frac{n-1}{2n+1} = \frac{1}{2}$$입니다.", ""),
        (5, r"\lim_{n \to \infty} \frac{n^2+2}{3n^2+3}\text{의 값은?}", "\\frac{1}{3}", ["0", "\\frac{2}{3}", "\\frac{3}{2}", "3"], r"최고차항의 계수의 비이므로 $$\lim_{n \to \infty} \frac{n^2+2}{3n^2+3} = \frac{1}{3}$$입니다.", ""),
        (6, r"\lim_{n \to \infty} \frac{2n^2+1}{3n^2-5n}\text{의 값은?}", "\\frac{2}{3}", ["\\frac{1}{6}", "\\frac{1}{4}", "\\frac{1}{3}", "\\frac{3}{2"], r"$$\lim_{n \to \infty} \frac{2n^2+1}{3n^2-5n} = \frac{2}{3}$$입니다.", ""),
        # 7..18: 기출문제맛보기
        (7, r"\lim_{n \to \infty} \frac{3n}{2n+1}\text{의 값은?}", "\\frac{3}{2}", ["\\frac{1}{2}", "1", "2", "\\frac{5}{2}"], r"최고차항의 계수의 비에 의해 $\frac{3}{2}$입니다.", "2012학년도 모의평가"),
        (8, r"\lim_{n \to \infty} \frac{5n^2+1}{3n^2-1}\text{의 값은?}", "\\frac{5}{3}", ["\\frac{1}{3}", "\\frac{2}{3}", "1", "\\frac{4}{3}"], r"$$\lim_{n \to \infty} \frac{5n^2+1}{3n^2-1} = \frac{5}{3}$$", "2013학년도 수능"),
        (9, r"\lim_{n \to \infty} \frac{4n^2+6}{n^2+3n}\text{의 값은?}", "4", ["1", "2", "3", "5"], r"$$\lim_{n \to \infty} \frac{4n^2+6}{n^2+3n} = \frac{4}{1} = 4$$", "2015학년도 수능"),
        (10, r"\lim_{n \to \infty} \frac{8n^2+1}{3n^2-2}\text{의 값은?}", "\\frac{8}{3}", ["2", "\\frac{10}{3}", "4", "\\frac{14}{3}"], r"$$\lim_{n \to \infty} \frac{8n^2+1}{3n^2-2} = \frac{8}{3}$$", "2017학년도 모의평가"),
        (11, r"\lim_{n \to \infty} \frac{7n^2-n}{2n^2+3}\text{의 값은?}", "\\frac{7}{2}", ["\\frac{5}{2}", "3", "4", "\\frac{9}{2}"], r"$$\lim_{n \to \infty} \frac{7n^2-n}{2n^2+3} = \frac{7}{2}$$", "2017학년도 모의평가"),
        (12, r"\lim_{n \to \infty} \frac{3n^2+5}{n^2+2n}\text{의 값을 구하시오.}", "3", [], r"$$\lim_{n \to \infty} \frac{3n^2+5}{n^2+2n} = 3$$", "2015학년도 모의평가"),
        (13, r"\lim_{n \to \infty} \frac{3n^2+5}{2n^2+n}\text{의 값은?}", "\\frac{3}{2}", ["\\frac{1}{2}", "1", "2", "\\frac{5}{2}"], r"$$\lim_{n \to \infty} \frac{3n^2+5}{2n^2+n} = \frac{3}{2}$$", "2016학년도 수능"),
        (14, r"\lim_{n \to \infty} \frac{5n^3+1}{n^3+3}\text{의 값은?}", "5", ["1", "2", "3", "4"], r"$$\lim_{n \to \infty} \frac{5n^3+1}{n^3+3} = 5$$", "2017학년도 수능"),
        (15, r"\lim_{n \to \infty} \frac{n^3+2}{8n^3+5}\text{의 값은?}", "\\frac{1}{8}", ["\\frac{1}{4}", "\\frac{3}{8}", "\\frac{1}{2}", "\\frac{5}{8}"], r"$$\lim_{n \to \infty} \frac{n^3+2}{8n^3+5} = \frac{1}{8}$$", "2018학년도 수능"),
        (16, r"\lim_{n \to \infty} \frac{(n+1)(3n-1)}{2n^2+1}\text{의 값은?}", "\\frac{3}{2}", ["\\frac{1}{2}", "1", "2", "\\frac{5}{2}"], r"분자를 전개하면 $3n^2+2n-1$이므로 극한값은 $\frac{3}{2}$입니다.", "2017학년도 모의평가"),
        (17, r"\lim_{n \to \infty} \frac{an^2+bn+7}{3n+1} = 4\text{일 때, } a+b\text{의 값을 구하시오. (단, } a, b\text{는 상수)}", "12", [], r"극한값이 $4$로 수렴하므로 최고차항의 차수가 같아야 합니다. 따라서 $a=0$, $\frac{b}{3}=4 \implies b=12$. $a+b=12$", "2014학년도 수능"),
        (18, r"\text{수열 } \{a_n\}\text{의 첫째항부터 제}n\text{항까지의 합 } S_n\text{이 } S_n=2n^2-n\text{일 때, } \lim_{n \to \infty} \frac{n a_n}{S_n}\text{의 값은?}", "2", ["1", "\\frac{3}{2}", "\\frac{5}{2}", "3"], r"$a_n = S_n - S_{n-1} = 4n-3$이므로 $$\lim_{n \to \infty} \frac{n(4n-3)}{2n^2-n} = \frac{4}{2} = 2$$입니다.", "2016학년도 모의평가"),
        # 19..30: 예상문제도전하기
        (19, r"\lim_{n \to \infty} \frac{2n-3}{3n+5}\text{의 값은?}", "\\frac{2}{3}", ["\\frac{1}{3}", "1", "\\frac{4}{3}", "\\frac{5}{3}"], r"최고차항 계수의 비에 의해 $\frac{2}{3}$입니다.", ""),
        (20, r"\lim_{n \to \infty} \frac{5n^2-2n}{2n^2+1}\text{의 값은?}", "\\frac{5}{2}", ["1", "2", "3", "\\frac{7}{2}"], r"극한값은 $\frac{5}{2}$입니다.", ""),
        (21, r"\lim_{n \to \infty} \frac{6n^2+5}{n^2-3n}\text{의 값은?}", "6", ["2", "3", "4", "5"], r"극한값은 $\frac{6}{1} = 6$입니다.", ""),
        (22, r"\lim_{n \to \infty} \frac{4n^3+1}{3n^3-2n}\text{의 값은?}", "\\frac{4}{3}", ["\\frac{1}{3}", "\\frac{2}{3}", "\\frac{5}{3}", "2"], r"극한값은 $\frac{4}{3}$입니다.", ""),
        (23, r"\lim_{n \to \infty} \frac{(2n+1)(n-2)}{3n^2+5}\text{의 값은?}", "\\frac{2}{3}", ["\\frac{1}{3}", "1", "\\frac{4}{3}", "\\frac{5}{3}"], r"분자는 $2n^2-3n-2$이므로 극한값은 $\frac{2}{3}$입니다.", ""),
        (24, r"\lim_{n \to \infty} \frac{1+2+3+\cdots+n}{2n^2}\text{의 값은?}", "\\frac{1}{4}", ["\\frac{1}{8}", "\\frac{1}{6}", "\\frac{1}{2}", "1"], r"분자는 $\frac{n(n+1)}{2} = \frac{n^2+n}{2}$이므로 준식은 $\lim_{n \to \infty} \frac{n^2+n}{4n^2} = \frac{1}{4}$입니다.", ""),
        (25, r"\lim_{n \to \infty} \frac{1^2+2^2+\cdots+n^2}{2n^3+1}\text{의 값은?}", "\\frac{1}{6}", ["\\frac{1}{12}", "\\frac{1}{8}", "\\frac{1}{4}", "\\frac{1}{3}"], r"분자는 $\frac{n(n+1)(2n+1)}{6} = \frac{2n^3+\cdots}{6} = \frac{n^3}{3}+\cdots$이므로 $\lim \frac{n^3/3}{2n^3} = \frac{1}{6}$입니다.", ""),
        (26, r"\lim_{n \to \infty} \frac{an^2+3n-1}{2n^2+5} = 3\text{을 만족시키는 상수 } a\text{의 값은?}", "6", ["2", "4", "8", "10"], r"$\frac{a}{2} = 3 \implies a = 6$입니다.", ""),
        (27, r"\lim_{n \to \infty} \frac{an+5}{2n-1} = 4\text{일 때, 상수 } a\text{의 값은?}", "8", ["2", "4", "6", "10"], r"$\frac{a}{2} = 4 \implies a = 8$입니다.", ""),
        (28, r"\lim_{n \to \infty} \frac{3n^2-bn}{an^2+4} = \frac{1}{2}\text{일 때, 상수 } a\text{의 값은?}", "6", ["2", "3", "4", "5"], r"$\frac{3}{a} = \frac{1}{2} \implies a = 6$입니다.", ""),
        (29, r"\text{수열 } \{a_n\}\text{의 합 } S_n = 3n^2+2n\text{일 때, } \lim_{n \to \infty} \frac{a_n}{n}\text{의 값은?}", "6", ["2", "3", "4", "5"], r"$a_n = S_n - S_{n-1} = 6n-1$이므로 $\lim \frac{6n-1}{n} = 6$입니다.", ""),
        (30, r"\text{두 수열 } \{a_n\}, \{b_n\}\text{에 대하여 } \lim_{n \to \infty} a_n = 2, \lim_{n \to \infty} b_n = 3\text{일 때, } \lim_{n \to \infty} \frac{a_n b_n + 4}{a_n + b_n}\text{의 값은?}", "2", ["1", "3", "4", "5"], r"$$\frac{2 \times 3 + 4}{2 + 3} = \frac{10}{5} = 2$$입니다.", "")
    ]
    for p in ch1_data:
        problems.append(make_problem(1, p[0], p[1], p[2], p[3], p[4], p[5]))

    return problems

if __name__ == '__main__':
    p1 = build_all_problems()
    print(f"Chapter 1 built: {len(p1)} problems")
