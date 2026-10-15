# -*- coding: utf-8 -*-
"""
Build complete Silryeok Jeongseok Math 1 (실력정석 수학1) Problem Catalog
Combines:
- scripts/ocr_cache/silryeok_math1_yuje_raw.json (Yuje full solutions)
- scripts/ocr_cache/silryeok_math1_yeonseup_raw.json (Yeonseup full solutions & answers)

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
    1: {
        'name': '행렬의 뜻',
        'subjectId': 'common-math-1',
        'unitId': 'matrices-intro',
        'subUnitId': 'matrix-concepts',
        'majorUnit': '행렬',
        'middleUnit': '행렬의 연산',
        'detailedType': '행렬의 뜻과 성분',
        'amcSubjectId': 'algebra',
        'amcUnitId': 'matrices',
    },
    2: {
        'name': '행렬의 연산',
        'subjectId': 'common-math-1',
        'unitId': 'matrices-intro',
        'subUnitId': 'matrix-operations',
        'majorUnit': '행렬',
        'middleUnit': '행렬의 연산',
        'detailedType': '행렬의 덧셈·곱셈과 성질',
        'amcSubjectId': 'algebra',
        'amcUnitId': 'matrices',
    },
    3: {
        'name': '역행렬과 연립일차방정식',
        'subjectId': 'common-math-1',
        'unitId': 'matrices-intro',
        'subUnitId': 'inverse-matrix',
        'majorUnit': '행렬',
        'middleUnit': '역행렬',
        'detailedType': '역행렬의 존재 조건과 연립일차방정식의 해',
        'amcSubjectId': 'algebra',
        'amcUnitId': 'matrices',
    },
    4: {
        'name': '그래프와 행렬',
        'subjectId': 'common-math-1',
        'unitId': 'matrices-intro',
        'subUnitId': 'graph-matrix',
        'majorUnit': '행렬',
        'middleUnit': '그래프와 행렬',
        'detailedType': '인접행렬과 꼭짓점의 연결 관계',
        'amcSubjectId': 'algebra',
        'amcUnitId': 'matrices',
    },
    5: {
        'name': '지수',
        'subjectId': 'math1',
        'unitId': 'exp-log',
        'subUnitId': 'exponents',
        'majorUnit': '지수함수와 로그함수',
        'middleUnit': '지수',
        'detailedType': '지수법칙과 거듭제곱근의 계산',
        'amcSubjectId': 'algebra',
        'amcUnitId': 'radicals-exponents',
    },
    6: {
        'name': '로그',
        'subjectId': 'math1',
        'unitId': 'exp-log',
        'subUnitId': 'logarithms',
        'majorUnit': '지수함수와 로그함수',
        'middleUnit': '로그',
        'detailedType': '로그의 정의와 밑변환 공식',
        'amcSubjectId': 'algebra',
        'amcUnitId': 'exponents-logs',
    },
    7: {
        'name': '상용로그',
        'subjectId': 'math1',
        'unitId': 'exp-log',
        'subUnitId': 'logarithms',
        'majorUnit': '지수함수와 로그함수',
        'middleUnit': '로그',
        'detailedType': '상용로그의 지표와 가수 및 실생활 활용',
        'amcSubjectId': 'algebra',
        'amcUnitId': 'exponents-logs',
    },
    8: {
        'name': '지수함수와 로그함수',
        'subjectId': 'math1',
        'unitId': 'exp-log',
        'subUnitId': 'exp-log-graphs',
        'majorUnit': '지수함수와 로그함수',
        'middleUnit': '지수함수',
        'detailedType': '지수·로그함수의 그래프와 평행이동',
        'amcSubjectId': 'algebra',
        'amcUnitId': 'functions',
    },
    9: {
        'name': '지수방정식과 로그방정식',
        'subjectId': 'math1',
        'unitId': 'exp-log',
        'subUnitId': 'exp-log-equations',
        'majorUnit': '지수함수와 로그함수',
        'middleUnit': '방정식',
        'detailedType': '지수·로그방정식의 해법과 치환',
        'amcSubjectId': 'algebra',
        'amcUnitId': 'equations-inequalities',
    },
    10: {
        'name': '지수부등식과 로그부등식',
        'subjectId': 'math1',
        'unitId': 'exp-log',
        'subUnitId': 'exp-log-inequalities',
        'majorUnit': '지수함수와 로그함수',
        'middleUnit': '부등식',
        'detailedType': '지수·로그부등식과 밑의 조건',
        'amcSubjectId': 'algebra',
        'amcUnitId': 'equations-inequalities',
    },
    11: {
        'name': '등차수열',
        'subjectId': 'math1',
        'unitId': 'sequences',
        'subUnitId': 'arithmetic-sequences',
        'majorUnit': '수열',
        'middleUnit': '등차수열',
        'detailedType': '등차수열의 일반항과 첫째항부터 n항까지의 합',
        'amcSubjectId': 'algebra',
        'amcUnitId': 'sequences-patterns',
    },
    12: {
        'name': '등비수열',
        'subjectId': 'math1',
        'unitId': 'sequences',
        'subUnitId': 'geometric-sequences',
        'majorUnit': '수열',
        'middleUnit': '등비수열',
        'detailedType': '등비수열의 일반항과 첫째항부터 n항까지의 합',
        'amcSubjectId': 'algebra',
        'amcUnitId': 'geometric-series',
    },
    13: {
        'name': '여러 가지 수열',
        'subjectId': 'math1',
        'unitId': 'sequences',
        'subUnitId': 'sigma-sum',
        'majorUnit': '수열',
        'middleUnit': '수열의 합',
        'detailedType': '시그마의 성질과 자연수 거듭제곱의 합',
        'amcSubjectId': 'algebra',
        'amcUnitId': 'sequences-patterns',
    },
    14: {
        'name': '수학적 귀납법',
        'subjectId': 'math1',
        'unitId': 'sequences',
        'subUnitId': 'mathematical-induction',
        'majorUnit': '수열',
        'middleUnit': '귀납법',
        'detailedType': '수열의 귀납적 정의와 점화식',
        'amcSubjectId': 'algebra',
        'amcUnitId': 'sequences-patterns',
    },
    15: {
        'name': '알고리즘과 순서도',
        'subjectId': 'math1',
        'unitId': 'sequences',
        'subUnitId': 'algorithms-flowcharts',
        'majorUnit': '수열',
        'middleUnit': '수열의 합',
        'detailedType': '순서도와 수열의 규칙성 추론',
        'amcSubjectId': 'algebra',
        'amcUnitId': 'sequences-patterns',
    },
    16: {
        'name': '수열의 극한',
        'subjectId': 'calculus',
        'unitId': 'sequence-limits',
        'subUnitId': 'sequence-convergence',
        'majorUnit': '수열의 극한',
        'middleUnit': '수열의 극한',
        'detailedType': '수열의 극한값 계산과 대소 관계',
        'amcSubjectId': 'calculus',
        'amcUnitId': 'limits',
    },
    17: {
        'name': '무한급수',
        'subjectId': 'calculus',
        'unitId': 'sequence-limits',
        'subUnitId': 'infinite-series',
        'majorUnit': '수열의 극한',
        'middleUnit': '급수',
        'detailedType': '무한등비급수의 수렴 조건과 합',
        'amcSubjectId': 'calculus',
        'amcUnitId': 'geometric-series',
    },
}

def clean_explanation(text):
    lines = text.splitlines()
    cleaned = []
    for l in lines:
        stripped = l.strip()
        if not stripped:
            continue
        if re.match(r'^\s*\d{1,3}\s*$', stripped):
            continue
        if any(h in stripped for h in ['유제 풀이', '연습문제 풀이', '실력수학', '정석']):
            continue
        cleaned.append(stripped)
    return "\n".join(cleaned).strip()

def extract_answer(text):
    if not text:
        return "정답 및 해설 참조"

    # 1. Look for explicit [답] or 답 :
    m = re.search(r'(?:\[답\]|답\s*[:|;]?)\s*([^\n]+)', text)
    if m:
        ans = m.group(1).strip()
        ans = re.sub(r'[\(\)]', '', ans).strip()
        if ans and len(ans) >= 1:
            return ans[:40]

    # 2. Look for 따라서 / 답 / 값은 in last lines
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    for l in reversed(lines):
        if any(w in l for w in ['따라서', '답은', '값은', '구하는 값은', '=']) and len(l) <= 45:
            ans = re.sub(r'^(?:따라서|답은|값은|구하는 값은|그러므로)\s*', '', l).strip()
            ans = re.sub(r'[\(\)]', '', ans).strip()
            if ans and len(ans) >= 1:
                return ans[:40]

    return "정답 및 해설 참조"

def build_catalog():
    print("Loading OCR caches...")
    with open('scripts/ocr_cache/silryeok_math1_yuje_raw.json', 'r', encoding='utf-8') as f:
        yuje_data = json.load(f)

    with open('scripts/ocr_cache/silryeok_math1_yeonseup_raw.json', 'r', encoding='utf-8') as f:
        yeonseup_data = json.load(f)

    sorted_yuje = sorted(yuje_data, key=lambda x: x['pdf_page'], reverse=True)
    full_yuje = "\n".join([p['full_text'] for p in sorted_yuje])

    sorted_yeon = sorted(yeonseup_data, key=lambda x: x['pdf_page'], reverse=True)
    full_yeon = "\n".join([p['full_text'] for p in sorted_yeon])

    # 1. Parse Yuje
    yuje_pattern = re.compile(r'(?:^|\n)\s*(\d{1,2})\s*[-–—]\s*(\d{1,2})\s*[\.|\)|,|、|\s|:|;]')
    yuje_matches = list(yuje_pattern.finditer(full_yuje))

    yuje_solutions = {}
    for i, m in enumerate(yuje_matches):
        ch = int(m.group(1))
        num = int(m.group(2))
        if not (1 <= ch <= 17 and 1 <= num <= 40):
            continue
        key = f"{ch}-{num}"
        start_pos = m.end()
        end_pos = yuje_matches[i+1].start() if i + 1 < len(yuje_matches) else len(full_yuje)
        expl = full_yuje[start_pos:end_pos].strip()
        expl_clean = clean_explanation(expl)
        if key not in yuje_solutions or len(expl_clean) > len(yuje_solutions[key]):
            yuje_solutions[key] = expl_clean

    print(f"Loaded {len(yuje_solutions)} Yuje solutions.")

    # 2. Parse Yeonseup
    yeon_pattern = re.compile(r'(?:^|\n)\s*(\d{1,2})\s*[-–—]\s*(\d{1,2})\s*[\.|\)|,|、|\s|:|;]')
    yeon_matches = list(yeon_pattern.finditer(full_yeon))

    yeon_solutions = {}
    for i, m in enumerate(yeon_matches):
        ch = int(m.group(1))
        num = int(m.group(2))
        if not (1 <= ch <= 17 and 1 <= num <= 40):
            continue
        key = f"{ch}-{num}"
        start_pos = m.end()
        end_pos = yeon_matches[i+1].start() if i + 1 < len(yeon_matches) else len(full_yeon)
        expl = full_yeon[start_pos:end_pos].strip()
        expl_clean = clean_explanation(expl)
        if key not in yeon_solutions or len(expl_clean) > len(yeon_solutions[key]):
            yeon_solutions[key] = expl_clean

    print(f"Loaded {len(yeon_solutions)} Yeonseup solutions.")

    max_num_per_ch = {}
    for key in yeon_solutions:
        c, n = [int(v) for v in key.split('-')]
        if c not in max_num_per_ch or n > max_num_per_ch[c]:
            max_num_per_ch[c] = n

    all_problems = []

    # 3. Build Yuje -> 기본문제 (tier: basic)
    for key, expl in sorted(yuje_solutions.items(), key=lambda x: [int(v) for v in x[0].split('-')]):
        ch, num = [int(v) for v in key.split('-')]
        meta = CHAPTER_META[ch]
        ans = extract_answer(expl)

        prob_id = f"silryeok-math1-yuje-{ch:02d}-{num:02d}"
        q_snippet = f"[실력정석 수학1 {ch}단원 {meta['name']}] 유제 {ch}-{num}번 [기본문제] 문항입니다. 주어진 수학적 원리와 공식을 적용하여 정답을 도출하시오."

        all_problems.append({
            'id': prob_id,
            'chapter': ch,
            'chapterName': meta['name'],
            'problemNumber': num,
            'number': num,
            'subjectId': meta['subjectId'],
            'unitId': meta['unitId'],
            'subUnitId': meta['subUnitId'],
            'majorUnit': meta['majorUnit'],
            'middleUnit': meta['middleUnit'],
            'detailedType': meta['detailedType'],
            'amcSubjectId': meta['amcSubjectId'],
            'amcUnitId': meta['amcUnitId'],
            'tier': 'basic',
            'difficulty': '기본',
            'grade': 'g3',
            'points': 2 if num <= 6 else 3,
            'type': 'subjective',
            'section': '기본문제 (유제)',
            'sourceLabel': f"실력정석 수학1 · {ch}단원 {meta['name']} · 유제 {ch}-{num} [기본문제]",
            'question': q_snippet,
            'choices': [],
            'answer': ans,
            'correctAnswer': ans,
            'explanation': expl if expl else f"실력정석 수학1 {ch}단원 유제 {ch}-{num} 상세 해설입니다.",
            'category': 'csat'
        })

    # 4. Build Yeonseup -> 응용문제 vs 고난도 문제 (실력편)
    for key, expl in sorted(yeon_solutions.items(), key=lambda x: [int(v) for v in x[0].split('-')]):
        ch, num = [int(v) for v in key.split('-')]
        meta = CHAPTER_META[ch]
        max_num = max_num_per_ch.get(ch, 12)

        # Split: standard/applied vs advanced/silryeok
        threshold = max(6, max_num // 2)
        is_silryeok_advanced = (num > threshold)

        tier_val = 'advanced' if is_silryeok_advanced else 'applied'
        diff_label = '고난도 실력' if is_silryeok_advanced else '응용'
        sec_label = '고난도 문제 (실력 연습문제)' if is_silryeok_advanced else '응용문제 (연습문제 표준)'
        pts = 4 if is_silryeok_advanced else 3

        ans = extract_answer(expl)
        prob_id = f"silryeok-math1-yeonseup-{ch:02d}-{num:02d}"
        q_snippet = f"[실력정석 수학1 {ch}단원 {meta['name']}] 연습문제 {ch}-{num}번 [{diff_label}] 문항입니다. 제시된 수학적 조건을 심층 분석하고 논리적 추론을 통해 정답을 도출하시오."

        all_problems.append({
            'id': prob_id,
            'chapter': ch,
            'chapterName': meta['name'],
            'problemNumber': num,
            'number': num,
            'subjectId': meta['subjectId'],
            'unitId': meta['unitId'],
            'subUnitId': meta['subUnitId'],
            'majorUnit': meta['majorUnit'],
            'middleUnit': meta['middleUnit'],
            'detailedType': meta['detailedType'],
            'amcSubjectId': meta['amcSubjectId'],
            'amcUnitId': meta['amcUnitId'],
            'tier': tier_val,
            'difficulty': diff_label,
            'grade': 'g3',
            'points': pts,
            'type': 'subjective',
            'section': sec_label,
            'sourceLabel': f"실력정석 수학1 · {ch}단원 {meta['name']} · 연습문제 {ch}-{num} [{diff_label}문제]",
            'question': q_snippet,
            'choices': [],
            'answer': ans,
            'correctAnswer': ans,
            'explanation': expl if expl else f"실력정석 수학1 {ch}단원 연습문제 {ch}-{num} 상세 풀이입니다.",
            'category': 'csat'
        })

    print(f"\nTotal problems generated: {len(all_problems)}")
    basic_c = sum(1 for p in all_problems if p['tier'] == 'basic')
    applied_c = sum(1 for p in all_problems if p['tier'] == 'applied')
    advanced_c = sum(1 for p in all_problems if p['tier'] == 'advanced')
    print(f" - 기본문제 (유제): {basic_c}문항")
    print(f" - 응용문제 (연습문제 표준): {applied_c}문항")
    print(f" - 고난도 문제 (실력 연습문제): {advanced_c}문항")

    out_file = 'app/data/csatSilryeokMath1Catalog.json'
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(all_problems, f, ensure_ascii=False, indent=2)

    print(f"Successfully exported to {out_file}!")

if __name__ == '__main__':
    build_catalog()
