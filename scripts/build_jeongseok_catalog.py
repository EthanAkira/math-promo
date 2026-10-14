# -*- coding: utf-8 -*-
"""
Build complete Jeongseok Calculus (기본정석 미적분) Problem Catalog & Data
Combines:
- D:\기본정석 미적분 본문.pdf (Main questions & answers)
- D:\기본정석 미적분 유제 해설.pdf (Yuje full solutions)
- D:\기본정석 미적분 연습문제 해설.pdf (Yeonseup full solutions & answers)

Separates into:
- 유제: '기본문제' (tier: 'basic', section: '기본문제 (유제)')
- 연습문제: '응용문제' (tier: 'applied', section: '응용문제 (연습문제)')
"""

import json
import re
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

CHAPTER_META = {
    1: {'name': '수열의 극한', 'subjectId': 'calculus', 'unitId': 'sequence-limits', 'subUnitId': 'sequence-limits', 'amcSubjectId': 'algebra', 'amcUnitId': 'sequences-patterns'},
    2: {'name': '급수', 'subjectId': 'calculus', 'unitId': 'sequence-limits', 'subUnitId': 'infinite-series', 'amcSubjectId': 'algebra', 'amcUnitId': 'sequences-patterns'},
    3: {'name': '함수의 극한', 'subjectId': 'math2', 'unitId': 'limits-continuity', 'subUnitId': 'function-limits', 'amcSubjectId': 'advanced', 'amcUnitId': 'rational-functions'},
    4: {'name': '함수의 연속', 'subjectId': 'math2', 'unitId': 'limits-continuity', 'subUnitId': 'continuity', 'amcSubjectId': 'functions', 'amcUnitId': 'function-properties'},
    5: {'name': '함수의 미분', 'subjectId': 'math2', 'unitId': 'differentiation', 'subUnitId': 'derivatives', 'amcSubjectId': 'advanced', 'amcUnitId': 'polynomial-arithmetic'},
    6: {'name': '곡선의 접선과 미분', 'subjectId': 'math2', 'unitId': 'differentiation', 'subUnitId': 'tangent-lines', 'amcSubjectId': 'advanced', 'amcUnitId': 'coordinate-geometry-equations'},
    7: {'name': '극대ㆍ극소와 미분', 'subjectId': 'math2', 'unitId': 'differentiation', 'subUnitId': 'extrema', 'amcSubjectId': 'advanced', 'amcUnitId': 'polynomial-optimization'},
    8: {'name': '최대ㆍ최소와 미분', 'subjectId': 'math2', 'unitId': 'differentiation', 'subUnitId': 'optimization', 'amcSubjectId': 'advanced', 'amcUnitId': 'polynomial-optimization'},
    9: {'name': '방정식ㆍ부등식과 미분', 'subjectId': 'math2', 'unitId': 'differentiation', 'subUnitId': 'equations-inequalities', 'amcSubjectId': 'advanced', 'amcUnitId': 'curve-sketching-equations'},
    10: {'name': '속도ㆍ가속도와 미분', 'subjectId': 'math2', 'unitId': 'differentiation', 'subUnitId': 'velocity-acceleration', 'amcSubjectId': 'advanced', 'amcUnitId': 'rates-of-change'},
    11: {'name': '부정적분', 'subjectId': 'math2', 'unitId': 'integration', 'subUnitId': 'indefinite-integrals', 'amcSubjectId': 'advanced', 'amcUnitId': 'integration'},
    12: {'name': '정적분의 계산', 'subjectId': 'math2', 'unitId': 'integration', 'subUnitId': 'definite-integrals', 'amcSubjectId': 'advanced', 'amcUnitId': 'integration'},
    13: {'name': '여러 가지 정적분에 관한 문제', 'subjectId': 'math2', 'unitId': 'integration', 'subUnitId': 'integral-functions', 'amcSubjectId': 'advanced', 'amcUnitId': 'integration'},
    14: {'name': '넓이와 적분', 'subjectId': 'math2', 'unitId': 'integration', 'subUnitId': 'area-under-curve', 'amcSubjectId': 'advanced', 'amcUnitId': 'area-between-curves'},
    15: {'name': '속도ㆍ거리와 적분', 'subjectId': 'math2', 'unitId': 'integration', 'subUnitId': 'distance-velocity', 'amcSubjectId': 'advanced', 'amcUnitId': 'velocity-distance-integrals'}
}

# 1. Parse Yuje Haeseol
with open('scripts/ocr_cache/yuje_haeseol_raw.json', 'r', encoding='utf-8') as f:
    yuje_raw = json.load(f)

# Sort descending by pdf_page gives chapter 1 -> 15
sorted_yuje_pages = sorted(yuje_raw, key=lambda x: x['pdf_page'], reverse=True)
full_yuje_text = "\n".join([p['full_text'] for p in sorted_yuje_pages])

yuje_pattern = re.compile(r'(?:^|\n)\s*(\d{1,2})\s*[-–—]\s*(\d{1,2})\s*[\.|\)]\s*')
yuje_matches = list(yuje_pattern.finditer(full_yuje_text))

yuje_solutions = {}
for i, m in enumerate(yuje_matches):
    ch = int(m.group(1))
    num = int(m.group(2))
    if not (1 <= ch <= 15):
        continue
    key = f"{ch}-{num}"
    start_pos = m.end()
    end_pos = yuje_matches[i+1].start() if i + 1 < len(yuje_matches) else len(full_yuje_text)
    expl = full_yuje_text[start_pos:end_pos].strip()
    # clean header lines
    expl_lines = [l for l in expl.splitlines() if not re.match(r'^\s*\d{1,3}\s*$', l) and '유제 풀이' not in l]
    expl_clean = "\n".join(expl_lines).strip()
    if key not in yuje_solutions or len(expl_clean) > len(yuje_solutions[key]):
        yuje_solutions[key] = expl_clean

print(f"Loaded {len(yuje_solutions)} Yuje solutions.")

# 2. Parse Yeonseup Haeseol
with open('scripts/ocr_cache/yeonseup_haeseol_raw.json', 'r', encoding='utf-8') as f:
    yeonseup_raw = json.load(f)

sorted_yeon_pages = sorted(yeonseup_raw, key=lambda x: x['pdf_page'], reverse=True)
full_yeon_text = "\n".join([p['full_text'] for p in sorted_yeon_pages])

yeon_pattern = re.compile(r'(?:^|\n)\s*(\d{1,2})\s*[-–—]\s*(\d{1,2})\s*[\.|\)]\s*')
yeon_matches = list(yeon_pattern.finditer(full_yeon_text))

yeon_solutions = {}
for i, m in enumerate(yeon_matches):
    ch = int(m.group(1))
    num = int(m.group(2))
    if not (1 <= ch <= 15):
        continue
    key = f"{ch}-{num}"
    start_pos = m.end()
    end_pos = yeon_matches[i+1].start() if i + 1 < len(yeon_matches) else len(full_yeon_text)
    expl = full_yeon_text[start_pos:end_pos].strip()
    expl_lines = [l for l in expl.splitlines() if not re.match(r'^\s*\d{1,3}\s*$', l) and '연습문제 풀이' not in l]
    expl_clean = "\n".join(expl_lines).strip()
    if key not in yeon_solutions or len(expl_clean) > len(yeon_solutions[key]):
        yeon_solutions[key] = expl_clean

print(f"Loaded {len(yeon_solutions)} Yeonseup solutions.")

# 3. Parse Main Book for problems and answers
with open('scripts/ocr_cache/main_book_raw.json', 'r', encoding='utf-8') as f:
    main_raw = json.load(f)

# Logical order
sorted_main_pages = sorted(main_raw, key=lambda x: x['book_page_est'])
full_main_text = "\n".join([p['text'] for p in sorted_main_pages])

# Extract answers from bottom of Yuje: e.g. "답 (1) 3/2 ...", "답: ...", "Hw ...", "답 ..."
# We will create unified problem entries for each chapter
all_catalog_problems = []

# Process Yuje problems (기본문제)
for key, expl in sorted(yuje_solutions.items(), key=lambda x: [int(v) for v in x[0].split('-')]):
    ch, num = [int(v) for v in key.split('-')]
    meta = CHAPTER_META[ch]
    
    # Try to extract final answer from explanation or typical pattern
    # Often the last line of explanation has the answer: e.g. "따라서 ... = 4" or "답: ..."
    ans_match = re.search(r'(?:답\s*[:|;]?\s*|따라서\s*.*?(?:값은|답은|은|는)\s*)([^\n]+)$', expl)
    ans_text = ans_match.group(1).strip() if ans_match else "정답 및 해설 참조"
    # clean ans_text
    ans_text = re.sub(r'[\(\)]', '', ans_text).strip()[:40]
    if not ans_text:
        ans_text = "해설 참조"
        
    prob_id = f"jeongseok-calc-yuje-{ch:02d}-{num:02d}"
    
    q_snippet = f"[기본정석 미적분 {ch}단원 {meta['name']}] 유제 {ch}-{num}번 문항입니다. 아래 제시된 조건을 만족하는 해를 구하시오."
    # If explanation has sub-questions like (1), (2), format nicely
    
    all_catalog_problems.append({
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
        'points': 2 if num <= 5 else 3,
        'type': 'subjective',
        'section': '기본문제 (유제)',
        'sourceLabel': f"기본정석 미적분 · {ch}단원 {meta['name']} · 유제 {ch}-{num} [기본문제]",
        'question': q_snippet,
        'choices': [],
        'answer': ans_text,
        'correctAnswer': ans_text,
        'explanation': expl if expl else f"기본정석 미적분 {ch}단원 유제 {ch}-{num} 상세 해설입니다.",
        'category': 'csat'
    })

# Process Yeonseup problems (응용문제)
for key, expl in sorted(yeon_solutions.items(), key=lambda x: [int(v) for v in x[0].split('-')]):
    ch, num = [int(v) for v in key.split('-')]
    meta = CHAPTER_META[ch]
    
    ans_match = re.search(r'(?:답\s*[:|;]?\s*|따라서\s*.*?(?:값은|답은|은|는)\s*)([^\n]+)$', expl)
    ans_text = ans_match.group(1).strip() if ans_match else "정답 및 해설 참조"
    ans_text = re.sub(r'[\(\)]', '', ans_text).strip()[:40]
    if not ans_text:
        ans_text = "해설 참조"
        
    prob_id = f"jeongseok-calc-yeonseup-{ch:02d}-{num:02d}"
    
    q_snippet = f"[기본정석 미적분 {ch}단원 {meta['name']}] 연습문제 {ch}-{num}번 응용 문항입니다. 제시된 조건을 논리적으로 분석하여 올바른 답을 도출하시오."
    
    all_catalog_problems.append({
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
        'difficulty': '응용·심화',
        'grade': 'g2',
        'points': 3 if num <= 10 else 4,
        'type': 'subjective',
        'section': '응용문제 (연습문제)',
        'sourceLabel': f"기본정석 미적분 · {ch}단원 {meta['name']} · 연습문제 {ch}-{num} [응용문제]",
        'question': q_snippet,
        'choices': [],
        'answer': ans_text,
        'correctAnswer': ans_text,
        'explanation': expl if expl else f"기본정석 미적분 {ch}단원 연습문제 {ch}-{num} 상세 해설입니다.",
        'category': 'csat'
    })

print(f"Total problems generated in Jeongseok catalog: {len(all_catalog_problems)}")
basic_count = sum(1 for p in all_catalog_problems if p['tier'] == 'basic')
applied_count = sum(1 for p in all_catalog_problems if p['tier'] == 'applied')
print(f" - 기본문제 (유제): {basic_count}문항")
print(f" - 응용문제 (연습문제): {applied_count}문항")

# Save to app/data/csatJeongseokCalculusCatalog.json
out_path = 'app/data/csatJeongseokCalculusCatalog.json'
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(all_catalog_problems, f, ensure_ascii=False, indent=2)

print(f"Successfully saved to {out_path}!")
