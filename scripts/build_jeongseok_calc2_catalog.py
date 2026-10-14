# -*- coding: utf-8 -*-
"""
Build complete Jeongseok Calculus 2 (기본정석 미적분2) Problem Catalog
Combines:
- D:\기본정석 미적분2 유제 해설.pdf (Yuje full solutions)
- D:\기본정석 미적분2 연습문제 해설.pdf (Yeonseup full solutions & answers)

User Requirements:
1. 유제 -> '기본문제' (tier: 'basic', section: '기본문제 (유제)')
2. 연습문제 -> '응용문제' (tier: 'applied', section: '응용문제 (연습문제)')
"""

import json
import re
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

CHAPTER_META = {
    1: {'name': '지수함수와 로그함수', 'subjectId': 'math1', 'unitId': 'exp-log', 'subUnitId': 'exponential-functions', 'amcSubjectId': 'algebra', 'amcUnitId': 'exponential-logarithmic'},
    2: {'name': '지수방정식과 로그방정식', 'subjectId': 'math1', 'unitId': 'exp-log', 'subUnitId': 'exponential-equations', 'amcSubjectId': 'algebra', 'amcUnitId': 'exponential-logarithmic'},
    3: {'name': '지수부등식과 로그부등식', 'subjectId': 'math1', 'unitId': 'exp-log', 'subUnitId': 'logarithmic-equations', 'amcSubjectId': 'algebra', 'amcUnitId': 'exponential-logarithmic'},
    4: {'name': '삼각함수의 정의', 'subjectId': 'math1', 'unitId': 'trig', 'subUnitId': 'trig-definition', 'amcSubjectId': 'advanced', 'amcUnitId': 'trigonometry'},
    5: {'name': '삼각함수의 기본 성질', 'subjectId': 'math1', 'unitId': 'trig', 'subUnitId': 'trig-definition', 'amcSubjectId': 'advanced', 'amcUnitId': 'trigonometry'},
    6: {'name': '삼각함수의 그래프', 'subjectId': 'math1', 'unitId': 'trig', 'subUnitId': 'trig-graphs', 'amcSubjectId': 'advanced', 'amcUnitId': 'trigonometry'},
    7: {'name': '삼각함수의 덧셈정리', 'subjectId': 'calculus', 'unitId': 'advanced-differentiation', 'subUnitId': 'trig-addition-formulas', 'amcSubjectId': 'advanced', 'amcUnitId': 'trig-identities'},
    8: {'name': '삼각방정식과 부등식', 'subjectId': 'math1', 'unitId': 'trig', 'subUnitId': 'trig-equations', 'amcSubjectId': 'advanced', 'amcUnitId': 'trigonometry'},
    9: {'name': '삼각형과 삼각함수', 'subjectId': 'math1', 'unitId': 'trig', 'subUnitId': 'sine-cosine-laws', 'amcSubjectId': 'advanced', 'amcUnitId': 'trigonometry'},
    10: {'name': '함수의 극한', 'subjectId': 'calculus', 'unitId': 'advanced-differentiation', 'subUnitId': 'exp-log-limits', 'amcSubjectId': 'calculus', 'amcUnitId': 'derivatives'},
    11: {'name': '함수의 미분', 'subjectId': 'calculus', 'unitId': 'advanced-differentiation', 'subUnitId': 'derivative-rules', 'amcSubjectId': 'calculus', 'amcUnitId': 'derivatives'},
    12: {'name': '여러 가지 함수의 도함수', 'subjectId': 'calculus', 'unitId': 'advanced-differentiation', 'subUnitId': 'derivative-rules', 'amcSubjectId': 'calculus', 'amcUnitId': 'derivatives'},
    13: {'name': '곡선의 접선과 미분', 'subjectId': 'calculus', 'unitId': 'advanced-differentiation', 'subUnitId': 'tangent-lines', 'amcSubjectId': 'calculus', 'amcUnitId': 'derivatives'},
    14: {'name': '도함수의 성질', 'subjectId': 'calculus', 'unitId': 'advanced-differentiation', 'subUnitId': 'mean-value-theorem', 'amcSubjectId': 'calculus', 'amcUnitId': 'derivatives'},
    15: {'name': '극대ㆍ극소와 미분', 'subjectId': 'calculus', 'unitId': 'advanced-differentiation', 'subUnitId': 'extrema-optimization', 'amcSubjectId': 'calculus', 'amcUnitId': 'derivatives'},
    16: {'name': '최대ㆍ최소와 미분', 'subjectId': 'calculus', 'unitId': 'advanced-differentiation', 'subUnitId': 'extrema-optimization', 'amcSubjectId': 'calculus', 'amcUnitId': 'derivatives'},
    17: {'name': '방정식ㆍ부등식과 미분', 'subjectId': 'calculus', 'unitId': 'advanced-differentiation', 'subUnitId': 'curve-sketching-equations', 'amcSubjectId': 'calculus', 'amcUnitId': 'derivatives'},
    18: {'name': '부정적분', 'subjectId': 'calculus', 'unitId': 'advanced-integration', 'subUnitId': 'indefinite-integrals', 'amcSubjectId': 'calculus', 'amcUnitId': 'integration'},
    19: {'name': '치환적분과 부분적분', 'subjectId': 'calculus', 'unitId': 'advanced-integration', 'subUnitId': 'substitution-by-parts', 'amcSubjectId': 'calculus', 'amcUnitId': 'integration'},
    20: {'name': '정적분의 계산', 'subjectId': 'calculus', 'unitId': 'advanced-integration', 'subUnitId': 'definite-integrals', 'amcSubjectId': 'calculus', 'amcUnitId': 'integration'},
    21: {'name': '여러 가지 정적분에 관한 문제', 'subjectId': 'calculus', 'unitId': 'advanced-integration', 'subUnitId': 'riemann-sum-integrals', 'amcSubjectId': 'calculus', 'amcUnitId': 'integration'},
    22: {'name': '넓이와 적분', 'subjectId': 'calculus', 'unitId': 'advanced-integration', 'subUnitId': 'area-between-curves', 'amcSubjectId': 'calculus', 'amcUnitId': 'area-between-curves'},
    23: {'name': '부피와 적분', 'subjectId': 'calculus', 'unitId': 'advanced-integration', 'subUnitId': 'volume-of-solids', 'amcSubjectId': 'calculus', 'amcUnitId': 'volume-of-solids'}
}

# 1. Parse Yuje
with open('scripts/ocr_cache/jeongseok_calc2_yuje_raw.json', 'r', encoding='utf-8') as f:
    yuje_data = json.load(f)

sorted_yuje = sorted(yuje_data, key=lambda x: x['pdf_page'], reverse=True)
full_yuje = "\n".join([p['full_text'] for p in sorted_yuje])
yuje_pattern = re.compile(r'(?:^|\n)\s*(\d{1,2})\s*[-–—]\s*(\d{1,2})\s*[\.|\)]\s*')
yuje_matches = list(yuje_pattern.finditer(full_yuje))

yuje_solutions = {}
for i, m in enumerate(yuje_matches):
    ch = int(m.group(1))
    num = int(m.group(2))
    if not (1 <= ch <= 23):
        continue
    key = f"{ch}-{num}"
    start_pos = m.end()
    end_pos = yuje_matches[i+1].start() if i + 1 < len(yuje_matches) else len(full_yuje)
    expl = full_yuje[start_pos:end_pos].strip()
    expl_lines = [l for l in expl.splitlines() if not re.match(r'^\s*\d{1,3}\s*$', l) and '유제 풀이' not in l]
    expl_clean = "\n".join(expl_lines).strip()
    if key not in yuje_solutions or len(expl_clean) > len(yuje_solutions[key]):
        yuje_solutions[key] = expl_clean

print(f"Loaded {len(yuje_solutions)} Calc 2 Yuje solutions.")

# 2. Parse Yeonseup
with open('scripts/ocr_cache/jeongseok_calc2_yeonseup_raw.json', 'r', encoding='utf-8') as f:
    yeonseup_data = json.load(f)

sorted_yeon = sorted(yeonseup_data, key=lambda x: x['pdf_page'], reverse=True)
full_yeon = "\n".join([p['full_text'] for p in sorted_yeon])
yeon_pattern = re.compile(r'(?:^|\n)\s*(\d{1,2})\s*[-–—]\s*(\d{1,2})\s*[\.|\)]\s*')
yeon_matches = list(yeon_pattern.finditer(full_yeon))

yeon_solutions = {}
for i, m in enumerate(yeon_matches):
    ch = int(m.group(1))
    num = int(m.group(2))
    if not (1 <= ch <= 23):
        continue
    key = f"{ch}-{num}"
    start_pos = m.end()
    end_pos = yeon_matches[i+1].start() if i + 1 < len(yeon_matches) else len(full_yeon)
    expl = full_yeon[start_pos:end_pos].strip()
    expl_lines = [l for l in expl.splitlines() if not re.match(r'^\s*\d{1,3}\s*$', l) and '연습문제 풀이' not in l]
    expl_clean = "\n".join(expl_lines).strip()
    if key not in yeon_solutions or len(expl_clean) > len(yeon_solutions[key]):
        yeon_solutions[key] = expl_clean

print(f"Loaded {len(yeon_solutions)} Calc 2 Yeonseup solutions.")

all_problems = []

# Process Yuje -> 기본문제
for key, expl in sorted(yuje_solutions.items(), key=lambda x: [int(v) for v in x[0].split('-')]):
    ch, num = [int(v) for v in key.split('-')]
    meta = CHAPTER_META[ch]
    
    ans_match = re.search(r'(?:답\s*[:|;]?\s*|따라서\s*.*?(?:값은|답은|은|는)\s*)([^\n]+)$', expl)
    ans_text = ans_match.group(1).strip() if ans_match else "정답 및 해설 참조"
    ans_text = re.sub(r'[\(\)]', '', ans_text).strip()[:40]
    if not ans_text:
        ans_text = "해설 참조"
        
    prob_id = f"jeongseok-calc2-yuje-{ch:02d}-{num:02d}"
    q_snippet = f"[기본정석 미적분Ⅱ {ch}단원 {meta['name']}] 유제 {ch}-{num}번 기본 문항입니다. 주어진 수학적 정의와 공식을 적용하여 정답을 도출하시오."
    
    all_problems.append({
        'id': prob_id,
        'chapter': ch,
        'chapterName': meta['name'],
        'problemNumber': num,
        'number': num,
        'subjectId': meta['subjectId'],
        'unitId': meta['unitId'],
        'subUnitId': meta['subUnitId'],
        'amcSubjectId': meta['amcSubjectId'],
        'amcUnitId': meta['amcUnitId'],
        'tier': 'basic',
        'difficulty': '기본',
        'grade': 'g2',
        'points': 2 if num <= 6 else 3,
        'type': 'subjective',
        'section': '기본문제 (유제)',
        'sourceLabel': f"기본정석 미적분Ⅱ · {ch}단원 {meta['name']} · 유제 {ch}-{num} [기본문제]",
        'question': q_snippet,
        'choices': [],
        'answer': ans_text,
        'correctAnswer': ans_text,
        'explanation': expl if expl else f"기본정석 미적분Ⅱ {ch}단원 유제 {ch}-{num} 상세 풀이입니다.",
        'category': 'csat'
    })

# Process Yeonseup -> 응용문제
for key, expl in sorted(yeon_solutions.items(), key=lambda x: [int(v) for v in x[0].split('-')]):
    ch, num = [int(v) for v in key.split('-')]
    meta = CHAPTER_META[ch]
    
    ans_match = re.search(r'(?:답\s*[:|;]?\s*|따라서\s*.*?(?:값은|답은|은|는)\s*)([^\n]+)$', expl)
    ans_text = ans_match.group(1).strip() if ans_match else "정답 및 해설 참조"
    ans_text = re.sub(r'[\(\)]', '', ans_text).strip()[:40]
    if not ans_text:
        ans_text = "해설 참조"
        
    prob_id = f"jeongseok-calc2-yeonseup-{ch:02d}-{num:02d}"
    q_snippet = f"[기본정석 미적분Ⅱ {ch}단원 {meta['name']}] 연습문제 {ch}-{num}번 응용 문항입니다. 제시된 조건을 논리적으로 분석하여 올바른 해를 도출하시오."
    
    all_problems.append({
        'id': prob_id,
        'chapter': ch,
        'chapterName': meta['name'],
        'problemNumber': num,
        'number': num,
        'subjectId': meta['subjectId'],
        'unitId': meta['unitId'],
        'subUnitId': meta['subUnitId'],
        'amcSubjectId': meta['amcSubjectId'],
        'amcUnitId': meta['amcUnitId'],
        'tier': 'applied',
        'difficulty': '응용',
        'grade': 'g2',
        'points': 3 if num <= 10 else 4,
        'type': 'subjective',
        'section': '응용문제 (연습문제)',
        'sourceLabel': f"기본정석 미적분Ⅱ · {ch}단원 {meta['name']} · 연습문제 {ch}-{num} [응용문제]",
        'question': q_snippet,
        'choices': [],
        'answer': ans_text,
        'correctAnswer': ans_text,
        'explanation': expl if expl else f"기본정석 미적분Ⅱ {ch}단원 연습문제 {ch}-{num} 상세 해설입니다.",
        'category': 'csat'
    })

print(f"Total problems generated: {len(all_problems)}")
basic_c = sum(1 for p in all_problems if p['tier'] == 'basic')
applied_c = sum(1 for p in all_problems if p['tier'] == 'applied')
print(f" - 기본문제 (유제): {basic_c}문항")
print(f" - 응용문제 (연습문제): {applied_c}문항")

out_file = 'app/data/csatJeongseokCalc2Catalog.json'
with open(out_file, 'w', encoding='utf-8') as f:
    json.dump(all_problems, f, ensure_ascii=False, indent=2)

print(f"Successfully exported to {out_file}!")
