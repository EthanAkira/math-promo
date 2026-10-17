import json
import re

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

BAD_KEYWORDS = ['짱', '중요한유형', '짱쉬운', '짱중요', '정석', '기본정석', '실력정석', '쎈', '블랙라벨', '마더텅', '자이스토리']

for name in catalogs:
    path = 'app/data/' + name
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    total = len(data)
    with_rate = sum(1 for p in data if p.get('correctRate') is not None)
    
    bad_source = 0
    bad_question = 0
    bad_expl = 0
    samples = []
    
    for p in data:
        s = p.get('sourceLabel', '')
        q = p.get('question', '')
        e = p.get('explanation', '')
        
        has_bad_s = any(k in s for k in BAD_KEYWORDS)
        has_bad_q = any(k in q for k in BAD_KEYWORDS)
        has_bad_e = any(k in e for k in BAD_KEYWORDS)
        
        if has_bad_s:
            bad_source += 1
        if has_bad_q:
            bad_question += 1
        if has_bad_e:
            bad_expl += 1
            
        if (has_bad_s or has_bad_q or has_bad_e) and len(samples) < 2:
            samples.append({
                'id': p.get('id'),
                'sourceLabel': s,
                'q_snippet': q[:60],
                'e_snippet': e[:60],
            })
            
    print(f"[{name}] total={total}, rates={with_rate}/{total}, bad_source={bad_source}, bad_q={bad_question}, bad_e={bad_expl}")
    for smp in samples:
        print(f"   SAMPLE id={smp['id']}")
        print(f"     sourceLabel: {smp['sourceLabel']}")
        if any(k in smp['q_snippet'] for k in BAD_KEYWORDS):
            print(f"     q: {smp['q_snippet']}")
        if any(k in smp['e_snippet'] for k in BAD_KEYWORDS):
            print(f"     e: {smp['e_snippet']}")
