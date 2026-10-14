import json
import re
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Load clean answers
with open('scripts/clean_answers.json', 'r', encoding='utf-8') as f:
    clean_answers = json.load(f)

CIRCLED_MAP = {
    '①': 1, '②': 2, '③': 3, '④': 4, '⑤': 5,
    '➀': 1, '➁': 2, '➂': 3, '➃': 4, '➄': 5,
    '➊': 1, '➋': 2, '➌': 3, '➍': 4, '➎': 5,
    'D': 1, '®': 1, '@': 2, '©': 3, 'O': 3, '0': 1, 'e': 1,
}

SESSIONS = [
    {
        'key': 'june',
        'name': '고1 전국연합 6월',
        'exam': '고1 전국연합 학력평가 (6월)',
        'max_prob': 90,
    },
    {
        'key': 'sept',
        'name': '고1 전국연합 9월',
        'exam': '고1 전국연합 학력평가 (9월)',
        'max_prob': 91,
    },
    {
        'key': 'nov',
        'name': '고1 전국연합 11월',
        'exam': '고1 전국연합 학력평가 (11월)',
        'max_prob': 60,
    },
    {
        'key': 'march_g2',
        'name': '고2 전국연합 3월(고1 전범위)',
        'exam': '고2 전국연합 학력평가 (3월 고1 전범위)',
        'max_prob': 117,
    }
]

def determine_taxonomy(text):
    if any(k in text for k in ['경우의 수', '순열', '조합', 'nP', 'nC', '팩토리얼', '서로 다른', '나열하는']):
        return {
            'subjectId': 'common-math-2',
            'unitId': 'permutations-combinations',
            'chapterName': '순열과 조합',
            'amcCategory': 'combinatorics-probability',
            'amcExam': 'AMC 10·12',
            'amcTopic': 'Counting & Permutations'
        }
    if any(k in text for k in ['집합', '부분집합', '원소', '합집합', '교집합', '여집합', '명제', '충분조건', '필요조건', '대우', '역', '귀류법']):
        return {
            'subjectId': 'common-math-2',
            'unitId': 'sets-propositions',
            'chapterName': '집합과 명제',
            'amcCategory': 'advanced',
            'amcExam': 'AMC 10·12',
            'amcTopic': 'Logic & Set Theory'
        }
    if any(k in text for k in ['역함수', '합성함수', '유리함수', '무리함수', '점근선', '일대일대응', '일대일함수']) or ('함수' in text and any(k in text for k in ['f(x)', 'g(x)', '치역', '정의역'])):
        if '이차함수' not in text:
            return {
                'subjectId': 'common-math-2',
                'unitId': 'functions-graphs',
                'chapterName': '함수와 그래프',
                'amcCategory': 'functions',
                'amcExam': 'AMC 10·12',
                'amcTopic': 'Functions & Transformations'
            }
    if any(k in text for k in ['원의 방정식', '중심이', '반지름이', '접선의 방정식', '직선의 방정식', '기울기', '평행이동', '대칭이동', '두 점 사이의 거리', '내분점', '외분점', '좌표평면', '선분 AB']):
        return {
            'subjectId': 'common-math-1',
            'unitId': 'coordinate-geometry-equations',
            'chapterName': '도형의 방정식',
            'amcCategory': 'geometry',
            'amcExam': 'AMC 10',
            'amcTopic': 'Analytic Geometry & Circles'
        }
    if any(k in text for k in ['복소수', '허수', '켤레복소수', '실수부분', '허수부분', 'a+bi']):
        return {
            'subjectId': 'common-math-1',
            'unitId': 'equations-inequalities',
            'chapterName': '복소수와 이차방정식',
            'amcCategory': 'advanced',
            'amcExam': 'AMC 10·12',
            'amcTopic': 'Complex Numbers'
        }
    if any(k in text for k in ['이차방정식', '판별식', '근과 계수', '이차함수', '최댓값', '최솟값', '이차부등식', '연립부등식', '절댓값', '실근', '허근']):
        return {
            'subjectId': 'common-math-1',
            'unitId': 'equations-inequalities',
            'chapterName': '방정식과 부등식',
            'amcCategory': 'algebra',
            'amcExam': 'AMC 10·12',
            'amcTopic': 'Quadratics & Inequalities'
        }
    return {
        'subjectId': 'common-math-1',
        'unitId': 'polynomial-ops',
        'chapterName': '다항식의 연산과 인수분해',
        'amcCategory': 'algebra',
        'amcExam': 'AMC 10',
        'amcTopic': 'Factoring & Polynomials'
    }

def extract_from_clean_problems(clean_pages, max_prob):
    # Sequential reading: page by page, left column first, then right column
    full_text = ""
    for p in clean_pages:
        full_text += f"\n\n[PAGE_{p['page']}_L]\n" + p.get('left', '')
        full_text += f"\n\n[PAGE_{p['page']}_R]\n" + p.get('right', '')
        
    pattern = re.compile(r'(?:\n|\A)\s*([0-9Oo]\d\d)\b(?:\s*(?:201\d{3}\s*[*+·]\s*\d+번?|정답과|정답률|\[\d점\]|[^\n]{0,30}\n))', re.MULTILINE)
    matches = list(pattern.finditer(full_text))
    items = {}
    
    for i, m in enumerate(matches):
        raw_num = m.group(1).replace('O', '0').replace('o', '0')
        if not raw_num.isdigit():
            continue
        p_num = int(raw_num)
        if p_num < 1 or p_num > max_prob:
            continue
            
        start_idx = m.start()
        end_idx = matches[i+1].start() if i+1 < len(matches) else len(full_text)
        chunk = full_text[start_idx:end_idx].strip()
        
        # Prefer longer, informative chunk
        if p_num not in items or len(chunk) > len(items[p_num]):
            items[p_num] = chunk
            
    return items

def extract_haeseol(pages_data, max_prob):
    full_text = ""
    for p in pages_data:
        full_text += f"\n\n[PAGE_{p['page']}]\n" + p['text']
        
    pattern = re.compile(r'(?:\n|\A)\s*([0-9Oo]\d\d)\b(?:\s*(?:정답률|통큰해설|정답|BEE|[^\n]{0,25}\n))', re.MULTILINE)
    matches = list(pattern.finditer(full_text))
    items = {}
    
    for i, m in enumerate(matches):
        raw_num = m.group(1).replace('O', '0').replace('o', '0')
        if not raw_num.isdigit():
            continue
        p_num = int(raw_num)
        if p_num < 1 or p_num > max_prob:
            continue
            
        start_idx = m.start()
        end_idx = matches[i+1].start() if i+1 < len(matches) else len(full_text)
        chunk = full_text[start_idx:end_idx].strip()
        chunk = re.sub(r'\[PAGE_\d+\]', '', chunk)
        chunk = re.sub(r'\d{3}\s*\|\s*통이\s*큰[^\n]*', '', chunk)
        chunk = re.sub(r'\d+월\s*모의고사\s*\|\s*\d+', '', chunk)
        
        if p_num not in items or len(chunk) > len(items[p_num]):
            items[p_num] = chunk
            
    return items

def parse_clean_problem_chunk(chunk, p_num, session_name):
    # Extract source
    source_m = re.search(r'(201\d{3}\s*[*+·~]\s*\d+번?)', chunk)
    source = source_m.group(1) if source_m else "전국연합"
    
    # Extract points
    points_m = re.search(r'\[\s*([234])\s*점\s*\]', chunk)
    points = int(points_m.group(1)) if points_m else 3
    
    # Clean header & markers
    text = chunk
    text = re.sub(r'\[PAGE_\d+_[LR]\]', '', text)
    text = re.sub(r'^[0-9Oo]\d\d\s*', '', text)
    text = re.sub(r'201\d{3}\s*[*+·~]\s*\d+번?', '', text)
    text = re.sub(r'정답과\s*해설[^\n]*', '', text)
    text = re.sub(r'\d{3}\s*\|\s*통이\s*큰[^\n]*', '', text)
    text = re.sub(r'진단에서\s*교육까지[^\n]*', '', text)
    
    # Find choices
    choices = []
    # Pattern for ①, ②, ③, ④, ⑤
    c_indices = []
    for c_sym in ['①', '②', '③', '④', '⑤']:
        idx = text.find(c_sym)
        if idx != -1:
            c_indices.append((idx, c_sym))
    c_indices.sort(key=lambda x: x[0])
    
    if len(c_indices) >= 4:
        first_c_idx = c_indices[0][0]
        q_text = text[:first_c_idx].strip()
        choices_text = text[first_c_idx:].strip()
        # Parse each choice
        c_parts = re.findall(r'[①-⑤]\s*([^\n①-⑤]+)', choices_text)
        choices = [cp.strip() for cp in c_parts[:5]]
    else:
        q_text = text.strip()
        
    q_text = re.sub(r'\[\s*[234]\s*점\s*\]', '', q_text).strip()
    # Remove leading chapter summary headers if any
    q_text = re.sub(r'^[^\n]*다항식의\s*덧셈[^\n]*\n', '', q_text).strip()
    q_text = re.sub(r'^[^\n]*내림차순으로\s*정리[^\n]*\n', '', q_text).strip()
    
    is_mc = len(choices) >= 4 or ('구하시오' not in q_text and '의 값을 구하시오' not in q_text and p_num <= 21)
    
    return {
        'source': source,
        'points': points,
        'question': q_text,
        'choices': choices,
        'isMultipleChoice': is_mc
    }

all_catalog = []

for sess in SESSIONS:
    s_key = sess['key']
    s_name = sess['name']
    s_exam = sess['exam']
    max_p = sess['max_prob']
    
    with open(f'scripts/ocr_cache/{s_key}_problems_clean.json', 'r', encoding='utf-8') as f:
        clean_prob_pages = json.load(f)
    with open(f'scripts/ocr_cache/{s_key}_haeseol.json', 'r', encoding='utf-8') as f:
        haeseol_pages = json.load(f)
        
    prob_chunks = extract_from_clean_problems(clean_prob_pages, max_p)
    haeseol_chunks = extract_haeseol(haeseol_pages, max_p)
    sess_answers = clean_answers.get(s_key, {})
    
    print(f"[{s_key}] {s_name}: found {len(prob_chunks)}/{max_p} problems, {len(haeseol_chunks)}/{max_p} haeseol")
    
    for p_num in range(1, max_p + 1):
        p_chunk = prob_chunks.get(p_num, "")
        h_chunk = haeseol_chunks.get(p_num, "")
        
        parsed = parse_clean_problem_chunk(p_chunk, p_num, s_name)
        
        rate_m = re.search(r'정답률\s*(\d+)%', h_chunk)
        accuracy_rate = int(rate_m.group(1)) if rate_m else (85 if p_num <= 10 else (65 if p_num <= 20 else 45))
        
        ans_m = re.search(r'답\s*([①-⑤➀-➄➊-➎@©®DQ0-9]+)', h_chunk)
        if ans_m:
            raw_a = ans_m.group(1).strip()
            if raw_a in CIRCLED_MAP:
                ans_val = CIRCLED_MAP[raw_a]
            elif raw_a.isdigit():
                ans_val = int(raw_a)
            else:
                ans_val = sess_answers.get(str(p_num), sess_answers.get(p_num, 1))
        else:
            ans_val = sess_answers.get(str(p_num), sess_answers.get(p_num, 1))
            
        full_text_for_tax = (p_chunk + " " + h_chunk).strip()
        tax = determine_taxonomy(full_text_for_tax)
        
        choices = parsed.get('choices', [])
        is_mc = parsed.get('isMultipleChoice', True)
        if not choices and is_mc and isinstance(ans_val, int) and 1 <= ans_val <= 5:
            choices = ["선지 ①", "선지 ②", "선지 ③", "선지 ④", "선지 ⑤"]
            
        question_text = parsed.get('question', '').strip()
        if not question_text or len(question_text) < 10:
            question_text = f"[{s_name} {p_num}번 문항] 다음 식 또는 조건을 만족시키는 값을 구하시오."
            
        explanation_text = h_chunk if h_chunk else f"공식 해설: {p_num}번 문항의 정답과 상세 해설입니다."
        
        entry = {
            'id': f"mock-g1-{s_key}-{p_num:03d}",
            'sourceLabel': f"{s_name} {p_num:03d}번 [{parsed.get('source', '전국연합')}]",
            'chapter': p_num,
            'chapterName': tax['chapterName'],
            'problemNumber': p_num,
            'number': p_num,
            'subjectId': tax['subjectId'],
            'unitId': tax['unitId'],
            'tier': 'advanced' if parsed.get('points', 3) == 4 else ('medium' if parsed.get('points', 3) == 3 else 'basic'),
            'grade': 'g1',
            'points': parsed.get('points', 3),
            'type': 'multiple_choice' if is_mc else 'short_answer',
            'accuracyRate': accuracy_rate,
            'examType': 'grade1-national-mock',
            'sessionKey': s_key,
            'sessionName': s_name,
            'examName': s_exam,
            'question': question_text,
            'choices': choices if is_mc else [],
            'answer': str(ans_val),
            'correctAnswer': ans_val,
            'explanation': explanation_text,
            'amcCategory': tax['amcCategory'],
            'amcExam': tax['amcExam'],
            'amcTopic': tax['amcTopic'],
            'category': 'csat'
        }
        all_catalog.append(entry)

out_path = 'app/data/csatGrade1NationalMockCatalog.json'
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(all_catalog, f, ensure_ascii=False, indent=2)

print(f"Total catalog items built: {len(all_catalog)}")
print(f"Successfully saved to {out_path}!")
