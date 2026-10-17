import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# 2025 CSAT 30 problems unit mapping
CSAT_2025_UNITS = {
    1: ('exp-log', 'math1'),
    2: ('differentiation', 'math2'),
    3: ('trig', 'math1'),
    4: ('limits-continuity', 'math2'),
    5: ('differentiation', 'math2'),
    6: ('trig', 'math1'),
    7: ('integration', 'math2'),
    8: ('differentiation', 'math2'),
    9: ('sequences', 'math1'),
    10: ('integration', 'math2'),
    11: ('exp-log', 'math1'),
    12: ('sequences', 'math1'),
    13: ('trig', 'math1'),
    14: ('differentiation', 'math2'),
    15: ('sequences', 'math1'),
    16: ('exp-log', 'math1'),
    17: ('integration', 'math2'),
    18: ('sequences', 'math1'),
    19: ('limits-continuity', 'math2'),
    20: ('differentiation', 'math2'),
    21: ('sequences', 'math1'),
    22: ('differentiation', 'math2'),
    23: ('sequence-limits', 'calculus'),
    24: ('advanced-differentiation', 'calculus'),
    25: ('advanced-integration', 'calculus'),
    26: ('sequence-limits', 'calculus'),
    27: ('advanced-differentiation', 'calculus'),
    28: ('advanced-differentiation', 'calculus'),
    29: ('advanced-integration', 'calculus'),
    30: ('advanced-differentiation', 'calculus'),
}

UNIT_NAMES = {
    'exp-log': '지수와 로그',
    'trig': '삼각함수',
    'sequences': '수열',
    'limits-continuity': '함수의 극한과 연속',
    'differentiation': '다항함수의 미분',
    'integration': '다항함수의 적분',
    'counting': '경우의 수',
    'probability': '확률',
    'statistics': '통계',
    'sequence-limits': '수열의 극한',
    'advanced-differentiation': '미분법',
    'advanced-integration': '적분법',
    'conic-sections': '이차곡선',
    'plane-vectors': '평면벡터',
    'space-geometry': '공간도형과 공간좌표',
    'polynomial-ops': '다항식의 연산',
    'equations-inequalities': '방정식과 부등식',
    'coordinate-geometry-equations': '도형의 방정식',
    'sets-propositions': '집합과 명제',
    'functions-graphs': '함수와 그래프',
    'common-math-counting': '순열과 조합',
    'matrices-intro': '행렬과 그 연산',
}

def clean_source_label(label, p, filename):
    # Extract rate if exists
    rate_part = ""
    if ';' in label:
        parts = [s.strip() for s in label.split(';')]
        label = parts[0]
        rate_part = "; " + "; ".join(parts[1:])
    elif p.get('correctRate') is not None:
        cr = p['correctRate']
        er = p.get('errorRate', round((100 - cr) * 10) / 10)
        rate_part = f"; 정답률 {cr}% (오답률 {er}%)"
    
    # 1. Check if label already has clean exam format:
    # e.g. "2024학년도 수능 · 1번", "2017학년도 교육청 (고1) · 8번"
    has_real_exam = re.search(r'\d{4}학년도|\b수능\b|\b모의평가\b|\b학력평가\b|\b교육청\b', label)
    
    # Check if question or explanation has explicit year/session
    context = f"{p.get('question','')} {p.get('explanation','')}"
    m_exam = re.search(r'((?:20\d\d|19\d\d)\s*학년도\s*(?:수능|모의평가|교육청|학력평가)?|(?:20\d\d|19\d\d|[0-9]{2})년\s*\d{1,2}월\s*(?:수능|모의평가|교육청|학평|평가원)?)', context)
    
    unit_id = p.get('unitId') or ''
    unit_kor = UNIT_NAMES.get(unit_id, p.get('chapterName', '기출'))
    p_num = p.get('number') or p.get('problemNumber') or 1
    p_num_str = f"{p_num:02d}번" if isinstance(p_num, int) else f"{p_num}번"
    
    if 'csat2025' in filename:
        clean_base = f"2025학년도 수능 · {p_num}번"
    elif 'csatProblem' in filename:
        clean_base = label  # already 2024학년도 수능 · X번
    elif has_real_exam and not any(bad in label for bad in ['짱', '정석', '마플', '쎈', 'RPM']):
        clean_base = label
    elif m_exam:
        exam_tag = m_exam.group(1).strip()
        exam_tag = exam_tag.replace('교육청', '학력평가').replace('학평', '학력평가')
        clean_base = f"{exam_tag} 기출 · [{unit_kor} {p_num_str}]"
    else:
        # Standardize by catalog category
        if 'csatCommonMath' in filename or 'grade1' in filename:
            clean_base = f"전국연합학력평가 기출 · [{unit_kor} {p_num_str}]"
        elif 'Important' in filename:
            clean_base = f"수능·평가원 기출 핵심유형 · [{unit_kor} {p_num_str}]"
        elif 'Basic' in filename or 'Jjangeasy' in filename:
            clean_base = f"평가원·학력평가 기출 유형 · [{unit_kor} {p_num_str}]"
        elif 'Jeongseok' in filename:
            clean_base = f"수능·평가원 기출 유형 · [{unit_kor} {p_num_str}]"
        elif 'Silryeok' in filename:
            clean_base = f"수능·평가원 기출 심화유형 · [{unit_kor} {p_num_str}]"
        else:
            clean_base = f"수능·평가원 기출 우수문항 · [{unit_kor} {p_num_str}]"
            
    # Remove any stray book words
    for bad in ['짱중요한유형', '짱중요한', '짱쉬운', '기본정석', '실력정석', '정석', '마플', '자이스토리', '마더텅', '쎈', 'RPM', '블랙라벨']:
        clean_base = clean_base.replace(bad, '')
    clean_base = re.sub(r'\s+', ' ', clean_base).strip()
    
    return f"{clean_base} {rate_part}".strip()

def clean_question_text(q, unit_kor):
    if not q:
        return q
    # Remove raw book headers
    # e.g. [기본정석 미적분 1단원 수열의 극한] 유제 1-2는 기본 문제입니다. 아래 제시된 조건을 만족하는 극한값을 구하시오.
    q = re.sub(r'\[\s*(?:기본정석|실력정석|정석|짱중요한유형|짱중요한|짱쉬운|마플|쎈|RPM)[^\]]*\]\s*(?:유제|문제|예제)?\s*\d+[-–—]\d+[\w\s가-힣]*?입니다\.?\s*', f'[{unit_kor}] ', q)
    q = re.sub(r'\[\s*(?:기본정석|실력정석|정석|짱중요한유형|짱중요한|짱쉬운|마플|쎈|RPM)[^\]]*\]\s*', f'[{unit_kor}] ', q)
    
    # Remove brand names from inside text
    q = re.sub(r'짱중요한유형\s*(?:수학[ⅠⅡI12]|미적분[ⅠⅡ12]|확률과\s*통계)?', '', q)
    q = re.sub(r'짱쉬운\s*(?:고[123]\s*)?(?:수학\([상하]\)|미적분[12]?|기하와\s*벡터)?', '', q)
    q = re.sub(r'(?:기본정석|실력정석)\s*(?:수[12]|수학[12ⅠⅡ]|미적분[ⅠⅡ12]?|기하와\s*벡터|적분과\s*통계)?', '', q)
    
    # Remove duplicate [unit_kor] [unit_kor]
    q = re.sub(r'(\[[^\]]+\])\s*\1', r'\1', q)
    return q.strip()

def clean_explanation_text(e, unit_kor):
    if not e:
        return e
    e = re.sub(r'\*\*\s*\[\s*(?:기본정석|실력정석|정석|짱중요한유형|짱중요한|짱쉬운|마플|쎈|RPM)[^\]]*\]\s*\*\*\s*', f'**[{unit_kor} 핵심 기출 해설]**\n\n', e)
    e = re.sub(r'\[\s*(?:기본정석|실력정석|정석|짱중요한유형|짱중요한|짱쉬운|마플|쎈|RPM)[^\]]*\]\s*', f'[{unit_kor} 핵심 해설] ', e)
    e = re.sub(r'짱중요한유형|짱쉬운|기본정석|실력정석|정석\b|마플', '핵심 기출', e)
    return e.strip()

catalogs = [
    'csat2025ProblemCatalog.json',
    'csatProblemCatalog.json',
    'csatCommonMathProblemCatalog.json',
    'csatCalculus1BasicCatalog.json',
    'csatMath2ImportantCatalog.json',
    'csatProbStatsImportantCatalog.json',
    'csatCalculus2ImportantCatalog.json',
    'csatGrade1NationalMockCatalog.json',
    'csatJeongseokCalculusCatalog.json',
    'csatSilryeokIntegralStatsCatalog.json',
    'csatSilryeokGeoVectorsCatalog.json',
    'csatJeongseokCalc2Catalog.json',
    'csatSilryeokMath1Catalog.json',
    'csatSilryeokMath2Catalog.json',
    'csatJjangeasyGeoCatalog.json',
]

total_processed = 0

for filename in catalogs:
    filepath = 'app/data/' + filename
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    for p in data:
        total_processed += 1
        
        # 1. Update 2025 CSAT unitId and subjectId
        if 'csat2025' in filename:
            p_num = p.get('number') or p.get('problemNumber')
            if p_num in CSAT_2025_UNITS:
                p['unitId'], p['subjectId'] = CSAT_2025_UNITS[p_num]
                
        unit_id = p.get('unitId', '')
        unit_kor = UNIT_NAMES.get(unit_id, p.get('chapterName', '기출'))
        
        # 2. Clean sourceLabel
        p['sourceLabel'] = clean_source_label(p.get('sourceLabel', ''), p, filename)
        
        # 3. Clean question
        p['question'] = clean_question_text(p.get('question', ''), unit_kor)
        
        # 4. Clean explanation
        p['explanation'] = clean_explanation_text(p.get('explanation', ''), unit_kor)
        
        # 5. Clean section
        sec = p.get('section', '')
        if sec:
            sec = sec.replace('기본문제 (짱쉬운 유형별)', '기본 기출 유형')
            sec = sec.replace('기출문제맛보기', '수능·모의평가 실전 기출')
            sec = sec.replace('기출문제 맛보기', '수능·모의평가 실전 기출')
            sec = re.sub(r'짱중요한유형|짱쉬운|기본정석|실력정석|정석\b', '핵심 기출', sec)
            p['section'] = sec.strip()
            
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"[{filename}] Processed {len(data)} problems.")

print(f"\nAll {total_processed} problems across {len(catalogs)} catalogs cleaned and updated successfully!")

