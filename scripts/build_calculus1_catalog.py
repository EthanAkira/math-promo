# -*- coding: utf-8 -*-
"""
Build complete 15-chapter (374 problems) catalog for 짱쉬운 미적분 1 (Calculus 1 Basic & CSAT).
Matches 한국 수학 (수학Ⅱ, 미적분) & AMC 12 / Calculus categories.
"""

import json
import os

ANSWERS = {
    1: ['1', '3', '5', '4', '2', '4', '3', '5', '4', '2', '3', '3', '3', '5', '1', '1', '12', '2', '1', '3', '5', '3', '3', '3', '4', '2', '5', '4', '3', '2'],
    2: ['1', '3', '4', '4', '4', '3', '1', '3', '2', '14', '2', '5', '4', '2', '5', '2', '1', '5'],
    3: ['1', '4', '4', '3', '2', '5', '3', '5', '5', '5', '1', '4', '4', '2', '15', '4', '3', '5', '3', '3', '15', '1', '4', '1', '1', '1', '1', '1', '6', '3', '4'],
    4: ['3', '5', '4', '5', '1', '3', '2', '2', '18', '12', '5', '16', '4', '12', '5', '5', '1', '3'],
    5: ['4', '3', '2', '4', '1', '5', '4', '4', '5', '3', '27', '16', '30', '7', '3', '5', '3', '11', '4', '1', '3', '16', '3', '5', '4', '3', '3', '4', '2', '10', '16', '4'],
    6: ['1', '5', '5', '1', '3', '4', '2', '4', '2', '12', '5', '2', '1', '3', '2', '5', '5', '1'],
    7: ['5', '2', '5', '1', '4', '3', '3', '3', '2', '4', '4', '5', '1', '4', '5', '3', '1', '5', '2', '3', '5', '5', '5', '1', '2', '2', '3', '3'],
    8: ['2', '3', '13', '5', '3', '3', '4', '3', '5', '2', '11', '5', '1', '1', '11', '4', '4', '1', '5', '1', '3', '1', '2', '3', '5', '4', '1', '4', '0'],
    9: ['3', '3', '1', '3', '4', '10', '7', '3', '4', '1', '7', '21', '4', '24', '4', '25', '35', '19', '12', '41', '5', '12', '28', '25', '7', '5', '1', '2', '3', '34', '77', '5'],
    10: ['3', '2', '4', '3', '5', '5', '2', '1', '5', '1', '4', '3', '1', '17', '4', '3', '24', '21', '3', '12', '1', '4', '3', '1', '7', '3', '4', '5', '5', '5'],
    11: ['4', '4', '1', '3', '4', '1', '12', '12', '28', '13', '50', '2', '1', '2', '2', '4', '5', '5'],
    12: ['3', '2', '2', '2', '108', '3', '25', '14', '42', '2', '14', '22', '1', '3', '1', '1', '2', '4', '3'],
    13: ['3', '5', '8', '3', '1', '4', '18', '36', '1', '4', '1', '35', '2', '24', '2', '16', '1', '5', '1', '3', '2', '25', '18', '4', '3', '1', '4', '3', '1', '1', '2'],
    14: ['5', '3', '2', '4', '302', '3', '304', '3', '2', '17', '16', '121', '4', '2', '5', '4', '5', '2', '274'],
    15: ['4', '1', '1', '4', '3', '2', '3', '4', '8', '2', '3', '2', '4', '3', '3', '4', '36', '4', '4', '4', '9']
}

CHAPTER_META = [
    (1, '분수식의 극한값', 30, 'calculus', 'sequence-limits', 'algebra', 'sequences-patterns'),
    (2, '무리식의 극한값', 18, 'calculus', 'sequence-limits', 'algebra', 'radical-equations'),
    (3, '지수로 표현된 식의 극한값', 31, 'calculus', 'sequence-limits', 'algebra', 'exponential-logarithmic'),
    (4, '급수', 18, 'calculus', 'sequence-limits', 'algebra', 'sequences-patterns'),
    (5, '다항함수, 분수함수의 극한', 32, 'math2', 'limits-continuity', 'advanced', 'rational-functions'),
    (6, '무리함수의 극한', 18, 'math2', 'limits-continuity', 'advanced', 'radical-equations'),
    (7, '좌극한과 우극한', 28, 'math2', 'limits-continuity', 'functions', 'function-properties'),
    (8, '함수의 연속', 29, 'math2', 'limits-continuity', 'functions', 'function-properties'),
    (9, '미분계수 구하기', 32, 'math2', 'differentiation', 'advanced', 'polynomial-arithmetic'),
    (10, '미분계수의 정의', 30, 'math2', 'differentiation', 'advanced', 'polynomial-arithmetic'),
    (11, '접선의 방정식', 18, 'math2', 'differentiation', 'advanced', 'coordinate-geometry-equations'),
    (12, '극대와 극소', 19, 'math2', 'differentiation', 'advanced', 'quadratic-optimization'),
    (13, '정적분', 31, 'math2', 'integration', 'advanced', 'integration'),
    (14, '적분과 미분의 관계', 19, 'math2', 'integration', 'advanced', 'integration'),
    (15, '넓이', 21, 'math2', 'integration', 'advanced', 'integration'),
]

CIRCLED = ['①', '②', '③', '④', '⑤']

def make_problem(ch, num, q_text, correct_val, distractors, expl_text, source_tag=''):
    ans_key = ANSWERS[ch][num - 1]
    is_subjective = (len(distractors) == 0)
    meta = CHAPTER_META[ch - 1]

    if num <= 6:
        sec = '기본문제다지기'
        badge = '기본개념'
        pts = 2
    elif num <= 18:
        sec = '기출문제맛보기'
        badge = '학평기출' if source_tag else '수능기출'
        pts = 2 if num <= 10 else 3
    else:
        sec = '예상문제도전하기'
        badge = '실전예상'
        pts = 3

    if source_tag:
        src_label = f'{source_tag} · {num}번 [{badge}]'
    else:
        src_label = f'짱쉬운 미적분 1 {ch:02d}단원({meta[1]}) · {num}번 [{badge}]'

    if is_subjective:
        choices = []
        correct_ans = int(ans_key)
        ans_val = ans_key
    else:
        c_idx = int(ans_key) - 1
        choices = []
        d_ptr = 0
        for i in range(5):
            if i == c_idx:
                choices.append(f'${correct_val}$')
            else:
                choices.append(f'${distractors[d_ptr]}$')
                d_ptr += 1
        correct_ans = c_idx
        ans_val = str(c_idx)

    return {
        'id': f'jjangeasy-calc-{ch:02d}-{num:02d}',
        'chapter': ch,
        'chapterName': meta[1],
        'problemNumber': num,
        'number': num,
        'subjectId': meta[3],
        'unitId': meta[4],
        'amcSubjectId': meta[5],
        'amcUnitId': meta[6],
        'tier': 'basic',
        'grade': 'g3',
        'points': pts,
        'type': 'subjective' if is_subjective else 'multiple_choice',
        'section': sec,
        'sourceLabel': src_label,
        'question': q_text,
        'choices': choices,
        'answer': ans_val,
        'correctAnswer': correct_ans,
        'explanation': expl_text,
        'category': 'csat'
    }

print("Base generator helper defined.")
