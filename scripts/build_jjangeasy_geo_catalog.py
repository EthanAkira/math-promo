# -*- coding: utf-8 -*-
"""
Build complete 짱쉬운 기하와 벡터 (Jjang Easy Geometry & Vectors) Problem Catalog
Combines:
- scripts/ocr_cache/jjangeasy_geo_solutions_raw.json (Answer & full solutions)
- scripts/ocr_cache/jjangeasy_geo_main_raw.json (Main text questions)

User Requirements:
1. 적절한 카테고리에 배치 (기하: 이차곡선 / 평면벡터 / 공간도형과 공간좌표)
2. 기본문제 배치 (tier: 'basic', section: '기본문제 (짱쉬운 유형별)')
3. 정답과 풀이 1:1 매칭
"""

import json
import re
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

TYPE_META = [
    {
        'type': 1, 'name': '포물선', 'startPage': 2, 'endPage': 3,
        'subjectId': 'geometry', 'unitId': 'conic-sections', 'subUnitId': 'parabola',
        'majorUnit': '이차곡선', 'middleUnit': '포물선', 'detailedType': '포물선의 정의와 방정식',
        'amcSubjectId': 'geometry', 'amcUnitId': 'conic-sections',
    },
    {
        'type': 2, 'name': '타원', 'startPage': 4, 'endPage': 6,
        'subjectId': 'geometry', 'unitId': 'conic-sections', 'subUnitId': 'ellipse',
        'majorUnit': '이차곡선', 'middleUnit': '타원', 'detailedType': '타원의 정의와 방정식',
        'amcSubjectId': 'geometry', 'amcUnitId': 'conic-sections',
    },
    {
        'type': 3, 'name': '쌍곡선', 'startPage': 7, 'endPage': 9,
        'subjectId': 'geometry', 'unitId': 'conic-sections', 'subUnitId': 'hyperbola',
        'majorUnit': '이차곡선', 'middleUnit': '쌍곡선', 'detailedType': '쌍곡선의 정의와 점근선',
        'amcSubjectId': 'geometry', 'amcUnitId': 'conic-sections',
    },
    {
        'type': 4, 'name': '음함수의 미분과 접선', 'startPage': 10, 'endPage': 12,
        'subjectId': 'geometry', 'unitId': 'conic-sections', 'subUnitId': 'conic-tangents',
        'majorUnit': '이차곡선', 'middleUnit': '접선', 'detailedType': '음함수 미분법을 이용한 접선의 방정식',
        'amcSubjectId': 'geometry', 'amcUnitId': 'conic-sections',
    },
    {
        'type': 5, 'name': '이차곡선의 접선', 'startPage': 13, 'endPage': 16,
        'subjectId': 'geometry', 'unitId': 'conic-sections', 'subUnitId': 'conic-tangents',
        'majorUnit': '이차곡선', 'middleUnit': '접선', 'detailedType': '기울기가 주어진 접선과 접점 공식',
        'amcSubjectId': 'geometry', 'amcUnitId': 'conic-sections',
    },
    {
        'type': 6, 'name': '평면벡터의 뜻과 연산', 'startPage': 17, 'endPage': 18,
        'subjectId': 'geometry', 'unitId': 'plane-vectors', 'subUnitId': 'vector-operations',
        'majorUnit': '평면벡터', 'middleUnit': '벡터의 연산', 'detailedType': '벡터의 덧셈·뺄셈과 실수배',
        'amcSubjectId': 'geometry', 'amcUnitId': 'vectors',
    },
    {
        'type': 7, 'name': '평면벡터의 성분과 크기', 'startPage': 19, 'endPage': 19,
        'subjectId': 'geometry', 'unitId': 'plane-vectors', 'subUnitId': 'vector-components',
        'majorUnit': '평면벡터', 'middleUnit': '벡터의 성분', 'detailedType': '위치벡터의 성분과 크기 계산',
        'amcSubjectId': 'geometry', 'amcUnitId': 'vectors',
    },
    {
        'type': 8, 'name': '평면벡터의 내적', 'startPage': 20, 'endPage': 21,
        'subjectId': 'geometry', 'unitId': 'plane-vectors', 'subUnitId': 'vector-dot-product',
        'majorUnit': '평면벡터', 'middleUnit': '벡터의 내적', 'detailedType': '두 평면벡터의 내적과 이루는 각',
        'amcSubjectId': 'geometry', 'amcUnitId': 'vectors',
    },
    {
        'type': 9, 'name': '공간도형과 위치 관계', 'startPage': 22, 'endPage': 23,
        'subjectId': 'geometry', 'unitId': 'space-geometry', 'subUnitId': 'spatial-relations',
        'majorUnit': '공간도형과 공간좌표', 'middleUnit': '공간도형', 'detailedType': '직선과 평면의 위치 관계와 꼬인 위치',
        'amcSubjectId': 'geometry', 'amcUnitId': 'space-geometry',
    },
    {
        'type': 10, 'name': '삼수선의 정리', 'startPage': 24, 'endPage': 24,
        'subjectId': 'geometry', 'unitId': 'space-geometry', 'subUnitId': 'three-perpendiculars',
        'majorUnit': '공간도형과 공간좌표', 'middleUnit': '공간도형', 'detailedType': '삼수선의 정리와 이면각의 크기',
        'amcSubjectId': 'geometry', 'amcUnitId': 'space-geometry',
    },
    {
        'type': 11, 'name': '정사영', 'startPage': 25, 'endPage': 27,
        'subjectId': 'geometry', 'unitId': 'space-geometry', 'subUnitId': 'orthogonal-projection',
        'majorUnit': '공간도형과 공간좌표', 'middleUnit': '공간도형', 'detailedType': '정사영의 길이와 넓이의 계산',
        'amcSubjectId': 'geometry', 'amcUnitId': 'space-geometry',
    },
    {
        'type': 12, 'name': '공간좌표와 대칭이동', 'startPage': 28, 'endPage': 29,
        'subjectId': 'geometry', 'unitId': 'space-geometry', 'subUnitId': 'spatial-coordinates',
        'majorUnit': '공간도형과 공간좌표', 'middleUnit': '공간좌표', 'detailedType': '좌표공간에서의 점의 좌표와 대칭이동',
        'amcSubjectId': 'geometry', 'amcUnitId': 'space-geometry',
    },
    {
        'type': 13, 'name': '선분의 내분점과 외분점', 'startPage': 30, 'endPage': 32,
        'subjectId': 'geometry', 'unitId': 'space-geometry', 'subUnitId': 'division-points',
        'majorUnit': '공간도형과 공간좌표', 'middleUnit': '공간좌표', 'detailedType': '공간에서 선분의 내분점·외분점과 무게중심',
        'amcSubjectId': 'geometry', 'amcUnitId': 'space-geometry',
    },
    {
        'type': 14, 'name': '구의 방정식', 'startPage': 33, 'endPage': 33,
        'subjectId': 'geometry', 'unitId': 'space-geometry', 'subUnitId': 'sphere-equations',
        'majorUnit': '공간도형과 공간좌표', 'middleUnit': '공간좌표', 'detailedType': '구의 방정식과 평면·축과의 관계',
        'amcSubjectId': 'geometry', 'amcUnitId': 'space-geometry',
    },
    {
        'type': 15, 'name': '공간벡터의 성분과 내적', 'startPage': 34, 'endPage': 37,
        'subjectId': 'geometry', 'unitId': 'space-geometry', 'subUnitId': 'spatial-vectors',
        'majorUnit': '공간도형과 공간좌표', 'middleUnit': '공간벡터', 'detailedType': '공간벡터의 성분 연산과 내적',
        'amcSubjectId': 'geometry', 'amcUnitId': 'vectors',
    },
    {
        'type': 16, 'name': '직선과 평면의 방정식', 'startPage': 38, 'endPage': 41,
        'subjectId': 'geometry', 'unitId': 'space-geometry', 'subUnitId': 'lines-planes-equations',
        'majorUnit': '공간도형과 공간좌표', 'middleUnit': '공간벡터', 'detailedType': '방향벡터·법선벡터와 직선·평면의 방정식',
        'amcSubjectId': 'geometry', 'amcUnitId': 'space-geometry',
    },
]

def clean_explanation(text):
    lines = text.splitlines()
    cleaned = []
    for l in lines:
        stripped = l.strip()
        if not stripped:
            continue
        if re.match(r'^\s*\d{1,3}\s*$', stripped):
            continue
        if any(h in stripped for h in ['정답 및 풀이', '짱쉬운', '기하와벡터', '정답과 풀이']):
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

    # 2. Look for therefore/answer keywords in the last 4 lines
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    for l in reversed(lines[-4:]):
        if any(w in l for w in ['따라서', '답은', '값은', '구하는', '=']) and len(l) <= 45:
            ans = re.sub(r'^(?:따라서|답은|값은|구하는 값은|구하는 식은|그러므로)\s*', '', l).strip()
            ans = re.sub(r'[\(\)]', '', ans).strip()
            if ans and len(ans) >= 1:
                return ans[:40]

    return "정답 및 해설 참조"

def build_catalog():
    print("Loading 짱쉬운 기하와벡터 OCR caches...")
    with open('scripts/ocr_cache/jjangeasy_geo_solutions_raw.json', 'r', encoding='utf-8') as f:
        sol_pages = json.load(f)

    with open('scripts/ocr_cache/jjangeasy_geo_main_raw.json', 'r', encoding='utf-8') as f:
        main_pages = json.load(f)

    # Scans are reversed, sort back-to-front
    sorted_sols = sorted(sol_pages, key=lambda x: x['pdf_page'], reverse=True)
    sorted_main = sorted(main_pages, key=lambda x: x['pdf_page'], reverse=True)
    full_main = "\n".join([p['full_text'] for p in sorted_main])

    all_problems = []

    for meta in TYPE_META:
        t_id = meta['type']
        t_name = meta['name']
        s_p = meta['startPage']
        e_p = meta['endPage']

        # Combine text for this type
        chunk = "\n".join([sorted_sols[p - 1]['full_text'] for p in range(s_p, e_p + 1)])

        # Split into individual problems: 01, 02, ...
        splits = re.split(r'(?:^|\n)\s*(\d{2})\s+', chunk)
        type_probs = {}

        for j in range(1, len(splits), 2):
            num = int(splits[j])
            body = splits[j + 1].strip()
            if 1 <= num <= 40 and len(body) > 15:
                expl_clean = clean_explanation(body)
                if num not in type_probs or len(expl_clean) > len(type_probs[num]):
                    type_probs[num] = expl_clean

        print(f"Type {t_id:02d} {t_name}: {len(type_probs)} problems parsed.")

        for num in sorted(type_probs.keys()):
            expl = type_probs[num]
            ans = extract_answer(expl)

            # Try to match question text from main book
            # Look for e.g. "01 ..." in main text
            q_match = re.search(rf'(?:^|\n)\s*{num:02d}\s+([^\n]+(?:\n[^\n]+){{1,4}})', full_main)
            if q_match:
                q_text = q_match.group(1).strip()
                # Clean up options (1) (2) (3)
                q_text = re.split(r'(?:^|\n)\s*①|\n\s*@1|\n\s*01', q_text)[0].strip()
            else:
                q_text = ""

            if len(q_text) < 15:
                q_text = f"[짱쉬운 기하와 벡터 유형 {t_id:02d} {t_name}] {num}번 기본 문제입니다. 주어진 기하학적 조건과 공식을 활용하여 정답을 도출하시오."
            else:
                q_text = f"[짱쉬운 기하와 벡터 유형 {t_id:02d} {t_name}] {num}번: {q_text}"

            prob_id = f"jjangeasy-geo-{t_id:02d}-{num:02d}"

            all_problems.append({
                'id': prob_id,
                'typeId': t_id,
                'chapter': t_id,
                'chapterName': f"유형 {t_id:02d}. {t_name}",
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
                'section': '기본문제 (짱쉬운 유형별)',
                'sourceLabel': f"짱쉬운 기하와 벡터 · 유형 {t_id:02d} {t_name} · {num}번 [기본문제]",
                'question': q_text,
                'choices': [],
                'answer': ans,
                'correctAnswer': ans,
                'explanation': expl if expl else f"짱쉬운 기하와 벡터 유형 {t_id:02d} {num}번 상세 풀이입니다.",
                'category': 'csat'
            })

    print(f"\nTotal 짱쉬운 기하와 벡터 problems generated: {len(all_problems)}")
    out_file = 'app/data/csatJjangeasyGeoCatalog.json'
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(all_problems, f, ensure_ascii=False, indent=2)

    print(f"Successfully exported to {out_file}!")

if __name__ == '__main__':
    build_catalog()
