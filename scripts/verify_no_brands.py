import json
import os

BAD_BRANDS = ['짱', '정석', '중요한유형', '마플', '쎈', 'RPM', '자이스토리', '마더텅', '블랙라벨']

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

found = []
for c in catalogs:
    path = os.path.join('app', 'data', c)
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    for p in data:
        full = f"{p.get('sourceLabel','')} {p.get('question','')} {p.get('explanation','')}"
        for b in BAD_BRANDS:
            if b in full:
                found.append((c, p.get('id'), b))

print(f"Total violations found: {len(found)}")
for item in found[:10]:
    print("  ", item)
