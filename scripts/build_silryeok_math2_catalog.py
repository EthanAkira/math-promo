# -*- coding: utf-8 -*-
"""
Build complete Silryeok Jeongseok Math 2 (실력정석 수학2) Problem Catalog
Combines:
- scripts/ocr_cache/silryeok_math2_yuje_raw.json (Yuje full solutions)
- scripts/ocr_cache/silryeok_math2_yeonseup_raw.json (Yeonseup full solutions & answers)

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
        'name': '방정식',
        'subjectId': 'common-math-1',
        'unitId': 'equations-inequalities',
        'subUnitId': 'fractional-irrational-eq',
        'majorUnit': '방정식과 부등식',
        'middleUnit': '방정식',
        'detailedType': '분수·무리방정식과 무연근',
        'amcSubjectId': 'algebra',
        'amcUnitId': 'equations-inequalities',
    },
    2: {
        'name': '부등식',
        'subjectId': 'common-math-1',
        'unitId': 'equations-inequalities',
        'subUnitId': 'fractional-inequalities',
        'majorUnit': '방정식과 부등식',
        'middleUnit': '부등식',
        'detailedType': '고차·분수부등식의 해법과 경계값',
        'amcSubjectId': 'algebra',
        'amcUnitId': 'equations-inequalities',
    },
    3: {
        'name': '삼각함수의 덧셈정리',
        'subjectId': 'calculus',
        'unitId': 'advanced-differentiation',
        'subUnitId': 'trig-addition-formulas',
        'majorUnit': '미분법',
        'middleUnit': '삼각함수의 덧셈정리',
        'detailedType': '삼각함수의 덧셈정리와 합성',
        'amcSubjectId': 'advanced',
        'amcUnitId': 'trig-identities',
    },
    4: {
        'name': '삼각함수의 공식과 방정식',
        'subjectId': 'calculus',
        'unitId': 'advanced-differentiation',
        'subUnitId': 'trig-equations',
        'majorUnit': '미분법',
        'middleUnit': '삼각함수',
        'detailedType': '배각·반각 공식과 삼각방정식',
        'amcSubjectId': 'advanced',
        'amcUnitId': 'trig-identities',
    },
    5: {
        'name': '함수의 극한',
        'subjectId': 'calculus',
        'unitId': 'advanced-differentiation',
        'subUnitId': 'transcendental-limits',
        'majorUnit': '미분법',
        'middleUnit': '함수의 극한',
        'detailedType': '지수·로그·삼각함수의 극한과 미정계수',
        'amcSubjectId': 'calculus',
        'amcUnitId': 'limits',
    },
    6: {
        'name': '함수의 연속',
        'subjectId': 'math2',
        'unitId': 'limits-continuity',
        'subUnitId': 'continuity-theorems',
        'majorUnit': '함수의 극한과 연속',
        'middleUnit': '함수의 연속',
        'detailedType': '연속성의 판정 및 중간값의 정리',
        'amcSubjectId': 'calculus',
        'amcUnitId': 'limits',
    },
    7: {
        'name': '변화율과 도함수',
        'subjectId': 'calculus',
        'unitId': 'advanced-differentiation',
        'subUnitId': 'derivative-rules',
        'majorUnit': '미분법',
        'middleUnit': '여러 가지 미분법',
        'detailedType': '몫의 미분법과 합성함수 미분법',
        'amcSubjectId': 'calculus',
        'amcUnitId': 'derivatives',
    },
    8: {
        'name': '여러 가지 함수의 도함수',
        'subjectId': 'calculus',
        'unitId': 'advanced-differentiation',
        'subUnitId': 'transcendental-derivatives',
        'majorUnit': '미분법',
        'middleUnit': '초월함수의 도함수',
        'detailedType': '삼각·지수·로그함수의 도함수 및 매개변수·음함수 미분',
        'amcSubjectId': 'calculus',
        'amcUnitId': 'derivatives',
    },
    9: {
        'name': '곡선의 접선과 미분',
        'subjectId': 'calculus',
        'unitId': 'advanced-differentiation',
        'subUnitId': 'tangent-lines',
        'majorUnit': '미분법',
        'middleUnit': '도함수의 활용',
        'detailedType': '접선의 방정식과 법선의 기울기',
        'amcSubjectId': 'calculus',
        'amcUnitId': 'derivatives',
    },
    10: {
        'name': '평균값의 정리',
        'subjectId': 'calculus',
        'unitId': 'advanced-differentiation',
        'subUnitId': 'mean-value-theorem',
        'majorUnit': '미분법',
        'middleUnit': '도함수의 성질',
        'detailedType': '롤의 정리와 평균값 정리의 응용',
        'amcSubjectId': 'calculus',
        'amcUnitId': 'derivatives',
    },
    11: {
        'name': '극대ㆍ극소와 미분',
        'subjectId': 'calculus',
        'unitId': 'advanced-differentiation',
        'subUnitId': 'extrema-inflection',
        'majorUnit': '미분법',
        'middleUnit': '도함수의 활용',
        'detailedType': '이계도함수, 극값 판정 및 변곡점과 그래프 개형',
        'amcSubjectId': 'calculus',
        'amcUnitId': 'derivatives',
    },
    12: {
        'name': '최대ㆍ최소와 미분',
        'subjectId': 'calculus',
        'unitId': 'advanced-differentiation',
        'subUnitId': 'optimization-applications',
        'majorUnit': '미분법',
        'middleUnit': '도함수의 활용',
        'detailedType': '초월함수의 최대·최소와 실생활 최적화',
        'amcSubjectId': 'calculus',
        'amcUnitId': 'derivatives',
    },
    13: {
        'name': '방정식ㆍ부등식과 미분',
        'subjectId': 'calculus',
        'unitId': 'advanced-differentiation',
        'subUnitId': 'curve-sketching-equations',
        'majorUnit': '미분법',
        'middleUnit': '도함수의 활용',
        'detailedType': '도함수를 이용한 실근의 개수 및 부등식 증명',
        'amcSubjectId': 'calculus',
        'amcUnitId': 'derivatives',
    },
    14: {
        'name': '속도ㆍ가속도와 미분',
        'subjectId': 'calculus',
        'unitId': 'advanced-differentiation',
        'subUnitId': 'velocity-acceleration',
        'majorUnit': '미분법',
        'middleUnit': '도함수의 활용',
        'detailedType': '시각 t에 대한 속도·가속도와 평면 운동',
        'amcSubjectId': 'calculus',
        'amcUnitId': 'derivatives',
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
    print("Loading Math 2 OCR caches...")
    with open('scripts/ocr_cache/silryeok_math2_yuje_raw.json', 'r', encoding='utf-8') as f:
        yuje_data = json.load(f)

    with open('scripts/ocr_cache/silryeok_math2_yeonseup_raw.json', 'r', encoding='utf-8') as f:
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
        if not (1 <= ch <= 14 and 1 <= num <= 40):
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
        if not (1 <= ch <= 14 and 1 <= num <= 40):
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

        prob_id = f"silryeok-math2-yuje-{ch:02d}-{num:02d}"
        q_snippet = f"[실력정석 수학2 {ch}단원 {meta['name']}] 유제 {ch}-{num}번 [기본문제] 문항입니다. 주어진 수학적 원리와 공식을 적용하여 정확한 해를 구하시오."

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
            'sourceLabel': f"실력정석 수학2 · {ch}단원 {meta['name']} · 유제 {ch}-{num} [기본문제]",
            'question': q_snippet,
            'choices': [],
            'answer': ans,
            'correctAnswer': ans,
            'explanation': expl if expl else f"실력정석 수학2 {ch}단원 유제 {ch}-{num} 상세 풀이입니다.",
            'category': 'csat'
        })

    # 4. Build Yeonseup -> 응용문제 vs 고난도 문제 (실력편)
    for key, expl in sorted(yeon_solutions.items(), key=lambda x: [int(v) for v in x[0].split('-')]):
        ch, num = [int(v) for v in key.split('-')]
        meta = CHAPTER_META[ch]
        max_num = max_num_per_ch.get(ch, 12)

        # Split standard vs advanced
        threshold = max(3, max_num // 2)
        is_silryeok_advanced = (num > threshold)

        tier_val = 'advanced' if is_silryeok_advanced else 'applied'
        diff_label = '고난도 실력' if is_silryeok_advanced else '응용'
        sec_label = '고난도 문제 (실력 연습문제)' if is_silryeok_advanced else '응용문제 (연습문제 표준)'
        pts = 4 if is_silryeok_advanced else 3

        ans = extract_answer(expl)
        prob_id = f"silryeok-math2-yeonseup-{ch:02d}-{num:02d}"
        q_snippet = f"[실력정석 수학2 {ch}단원 {meta['name']}] 연습문제 {ch}-{num}번 [{diff_label}] 문항입니다. 제시된 수학적 조건을 심층 분석하고 엄밀한 수학적 전개를 통하여 정답을 도출하시오."

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
            'sourceLabel': f"실력정석 수학2 · {ch}단원 {meta['name']} · 연습문제 {ch}-{num} [{diff_label}문제]",
            'question': q_snippet,
            'choices': [],
            'answer': ans,
            'correctAnswer': ans,
            'explanation': expl if expl else f"실력정석 수학2 {ch}단원 연습문제 {ch}-{num} 상세 해설입니다.",
            'category': 'csat'
        })

    print(f"\nTotal problems generated: {len(all_problems)}")
    basic_c = sum(1 for p in all_problems if p['tier'] == 'basic')
    applied_c = sum(1 for p in all_problems if p['tier'] == 'applied')
    advanced_c = sum(1 for p in all_problems if p['tier'] == 'advanced')
    print(f" - 기본문제 (유제): {basic_c}문항")
    print(f" - 응용문제 (연습문제 표준): {applied_c}문항")
    print(f" - 고난도 문제 (실력 연습문제): {advanced_c}문항")

    out_file = 'app/data/csatSilryeokMath2Catalog.json'
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(all_problems, f, ensure_ascii=False, indent=2)

    print(f"Successfully exported to {out_file}!")

if __name__ == '__main__':
    build_catalog()
