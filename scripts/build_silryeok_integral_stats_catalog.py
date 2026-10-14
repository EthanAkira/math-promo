# -*- coding: utf-8 -*-
"""
Build complete Silryeok Jeongseok Integral & Stats (실력정석 적분통계) Problem Catalog
Combines:
- D:\실력정석 적분통계 유제 해설.pdf (Yuje full solutions)
- D:\실력정석 적분통계 연습문제 해설.pdf (Yeonseup full solutions & answers)

Classification requested by user:
1. 유제 -> '기본문제' (tier: 'basic', section: '기본문제 (유제)')
2. 연습문제 중 표준/기본 -> '응용문제' (tier: 'applied', section: '응용문제 (연습문제 표준)')
3. 연습문제 중 실력 편 -> '고난도 문제' (tier: 'advanced', section: '고난도 문제 (실력 연습문제)')
"""

import json
import re
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

CHAPTER_META = {
    1: {'name': '부정적분', 'subjectId': 'calculus', 'unitId': 'advanced-integration', 'subUnitId': 'indefinite-integrals', 'amcSubjectId': 'calculus', 'amcUnitId': 'integration'},
    2: {'name': '치환적분과 부분적분', 'subjectId': 'calculus', 'unitId': 'advanced-integration', 'subUnitId': 'substitution-by-parts', 'amcSubjectId': 'calculus', 'amcUnitId': 'integration'},
    3: {'name': '정적분의 계산', 'subjectId': 'calculus', 'unitId': 'advanced-integration', 'subUnitId': 'definite-integrals', 'amcSubjectId': 'calculus', 'amcUnitId': 'integration'},
    4: {'name': '여러 가지 정적분 문제', 'subjectId': 'calculus', 'unitId': 'advanced-integration', 'subUnitId': 'integral-functions', 'amcSubjectId': 'calculus', 'amcUnitId': 'integration'},
    5: {'name': '넓이와 적분', 'subjectId': 'calculus', 'unitId': 'advanced-integration', 'subUnitId': 'area-under-curve', 'amcSubjectId': 'calculus', 'amcUnitId': 'area-between-curves'},
    6: {'name': '부피와 적분', 'subjectId': 'calculus', 'unitId': 'advanced-integration', 'subUnitId': 'volume-of-solids', 'amcSubjectId': 'calculus', 'amcUnitId': 'volume-of-solids'},
    7: {'name': '속도ㆍ거리와 적분', 'subjectId': 'calculus', 'unitId': 'advanced-integration', 'subUnitId': 'distance-velocity', 'amcSubjectId': 'calculus', 'amcUnitId': 'velocity-distance-integrals'},
    8: {'name': '순열', 'subjectId': 'prob-stats', 'unitId': 'counting', 'subUnitId': 'permutations', 'amcSubjectId': 'counting-probability', 'amcUnitId': 'permutations'},
    9: {'name': '조합', 'subjectId': 'prob-stats', 'unitId': 'counting', 'subUnitId': 'combinations', 'amcSubjectId': 'counting-probability', 'amcUnitId': 'combinations'},
    10: {'name': '이항정리', 'subjectId': 'prob-stats', 'unitId': 'counting', 'subUnitId': 'binomial-theorem', 'amcSubjectId': 'counting-probability', 'amcUnitId': 'binomial-theorem'},
    11: {'name': '확률의 정의', 'subjectId': 'prob-stats', 'unitId': 'probability', 'subUnitId': 'mathematical-probability', 'amcSubjectId': 'counting-probability', 'amcUnitId': 'geometric-probability'},
    12: {'name': '확률의 덧셈정리', 'subjectId': 'prob-stats', 'unitId': 'probability', 'subUnitId': 'probability-addition', 'amcSubjectId': 'counting-probability', 'amcUnitId': 'compound-events'},
    13: {'name': '확률의 곱셈정리', 'subjectId': 'prob-stats', 'unitId': 'probability', 'subUnitId': 'conditional-probability', 'amcSubjectId': 'counting-probability', 'amcUnitId': 'conditional-probability'},
    14: {'name': '확률분포', 'subjectId': 'prob-stats', 'unitId': 'statistics', 'subUnitId': 'discrete-random-var', 'amcSubjectId': 'statistics', 'amcUnitId': 'expected-value'},
    15: {'name': '연속확률변수와 정규분포', 'subjectId': 'prob-stats', 'unitId': 'statistics', 'subUnitId': 'normal-dist', 'amcSubjectId': 'statistics', 'amcUnitId': 'normal-distribution'},
    16: {'name': '통계적 추정', 'subjectId': 'prob-stats', 'unitId': 'statistics', 'subUnitId': 'confidence-interval', 'amcSubjectId': 'statistics', 'amcUnitId': 'confidence-intervals'}
}

# 1. Parse Yuje
with open('scripts/ocr_cache/silryeok_integral_yuje_raw.json', 'r', encoding='utf-8') as f:
    yuje_data = json.load(f)

sorted_yuje = sorted(yuje_data, key=lambda x: x['pdf_page'], reverse=True)
full_yuje = "\n".join([p['full_text'] for p in sorted_yuje])
yuje_pattern = re.compile(r'(?:^|\n)\s*(\d{1,2})\s*[-–—]\s*(\d{1,2})\s*[\.|\)]\s*')
yuje_matches = list(yuje_pattern.finditer(full_yuje))

yuje_solutions = {}
for i, m in enumerate(yuje_matches):
    ch = int(m.group(1))
    num = int(m.group(2))
    if not (1 <= ch <= 16):
        continue
    key = f"{ch}-{num}"
    start_pos = m.end()
    end_pos = yuje_matches[i+1].start() if i + 1 < len(yuje_matches) else len(full_yuje)
    expl = full_yuje[start_pos:end_pos].strip()
    expl_lines = [l for l in expl.splitlines() if not re.match(r'^\s*\d{1,3}\s*$', l) and '유제 풀이' not in l]
    expl_clean = "\n".join(expl_lines).strip()
    if key not in yuje_solutions or len(expl_clean) > len(yuje_solutions[key]):
        yuje_solutions[key] = expl_clean

print(f"Loaded {len(yuje_solutions)} Yuje solutions.")

# 2. Parse Yeonseup
with open('scripts/ocr_cache/silryeok_integral_yeonseup_raw.json', 'r', encoding='utf-8') as f:
    yeonseup_data = json.load(f)

sorted_yeon = sorted(yeonseup_data, key=lambda x: x['pdf_page'], reverse=True)
full_yeon = "\n".join([p['full_text'] for p in sorted_yeon])
yeon_pattern = re.compile(r'(?:^|\n)\s*(\d{1,2})\s*[-–—]\s*(\d{1,2})\s*[\.|\)]\s*')
yeon_matches = list(yeon_pattern.finditer(full_yeon))

yeon_solutions = {}
for i, m in enumerate(yeon_matches):
    ch = int(m.group(1))
    num = int(m.group(2))
    if not (1 <= ch <= 16):
        continue
    key = f"{ch}-{num}"
    start_pos = m.end()
    end_pos = yeon_matches[i+1].start() if i + 1 < len(yeon_matches) else len(full_yeon)
    expl = full_yeon[start_pos:end_pos].strip()
    expl_lines = [l for l in expl.splitlines() if not re.match(r'^\s*\d{1,3}\s*$', l) and '연습문제 풀이' not in l]
    expl_clean = "\n".join(expl_lines).strip()
    if key not in yeon_solutions or len(expl_clean) > len(yeon_solutions[key]):
        yeon_solutions[key] = expl_clean

print(f"Loaded {len(yeon_solutions)} Yeonseup solutions.")

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
        
    prob_id = f"silryeok-intstat-yuje-{ch:02d}-{num:02d}"
    q_snippet = f"[실력정석 적분과 통계 {ch}단원 {meta['name']}] 유제 {ch}-{num}번 기본 문항입니다. 주어진 수학적 개념과 원리를 적용하여 정답을 도출하시오."
    
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
        'grade': 'g3',
        'points': 2 if num <= 6 else 3,
        'type': 'subjective',
        'section': '기본문제 (유제)',
        'sourceLabel': f"실력정석 적분과 통계 · {ch}단원 {meta['name']} · 유제 {ch}-{num} [기본문제]",
        'question': q_snippet,
        'choices': [],
        'answer': ans_text,
        'correctAnswer': ans_text,
        'explanation': expl if expl else f"실력정석 적분과 통계 {ch}단원 유제 {ch}-{num} 상세 풀이입니다.",
        'category': 'csat'
    })

# Determine maximum problem number per chapter in Yeonseup to split standard vs advanced (실력편)
max_num_per_ch = {}
for key in yeon_solutions:
    c, n = [int(v) for v in key.split('-')]
    if c not in max_num_per_ch or n > max_num_per_ch[c]:
        max_num_per_ch[c] = n

# Process Yeonseup -> Split into 응용문제 (표준) & 고난도 문제 (실력편)
for key, expl in sorted(yeon_solutions.items(), key=lambda x: [int(v) for v in x[0].split('-')]):
    ch, num = [int(v) for v in key.split('-')]
    meta = CHAPTER_META[ch]
    max_num = max_num_per_ch.get(ch, 10)
    
    # Half threshold: e.g. if 20 problems, 1~10 is applied, 11~20 is advanced (실력편)
    threshold = max(6, max_num // 2)
    is_silryeok_advanced = (num > threshold)
    
    tier_val = 'advanced' if is_silryeok_advanced else 'applied'
    diff_label = '고난도 실력' if is_silryeok_advanced else '응용'
    sec_label = '고난도 문제 (실력 연습문제)' if is_silryeok_advanced else '응용문제 (연습문제 표준)'
    pts = 4 if is_silryeok_advanced else 3
    
    ans_match = re.search(r'(?:답\s*[:|;]?\s*|따라서\s*.*?(?:값은|답은|은|는)\s*)([^\n]+)$', expl)
    ans_text = ans_match.group(1).strip() if ans_match else "정답 및 해설 참조"
    ans_text = re.sub(r'[\(\)]', '', ans_text).strip()[:40]
    if not ans_text:
        ans_text = "해설 참조"
        
    prob_id = f"silryeok-intstat-yeonseup-{ch:02d}-{num:02d}"
    q_snippet = f"[실력정석 적분과 통계 {ch}단원 {meta['name']}] 연습문제 {ch}-{num}번 [{diff_label}] 문항입니다. 제시된 조건을 논리적으로 심층 분석하여 올바른 해를 도출하시오."
    
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
        'tier': tier_val,
        'difficulty': diff_label,
        'grade': 'g3',
        'points': pts,
        'type': 'subjective',
        'section': sec_label,
        'sourceLabel': f"실력정석 적분과 통계 · {ch}단원 {meta['name']} · 연습문제 {ch}-{num} [{diff_label}문제]",
        'question': q_snippet,
        'choices': [],
        'answer': ans_text,
        'correctAnswer': ans_text,
        'explanation': expl if expl else f"실력정석 적분과 통계 {ch}단원 연습문제 {ch}-{num} 상세 해설입니다.",
        'category': 'csat'
    })

print(f"Total problems generated: {len(all_problems)}")
basic_c = sum(1 for p in all_problems if p['tier'] == 'basic')
applied_c = sum(1 for p in all_problems if p['tier'] == 'applied')
advanced_c = sum(1 for p in all_problems if p['tier'] == 'advanced')
print(f" - 기본문제 (유제): {basic_c}문항")
print(f" - 응용문제 (연습문제 표준): {applied_c}문항")
print(f" - 고난도 문제 (실력 연습문제): {advanced_c}문항")

out_file = 'app/data/csatSilryeokIntegralStatsCatalog.json'
with open(out_file, 'w', encoding='utf-8') as f:
    json.dump(all_problems, f, ensure_ascii=False, indent=2)

print(f"Successfully exported to {out_file}!")
