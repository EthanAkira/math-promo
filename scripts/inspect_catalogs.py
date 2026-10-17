import json

files = [
    'csatCalculus2ImportantCatalog.json',
    'csatMath2ImportantCatalog.json',
    'csatJjangeasyGeoCatalog.json',
    'csatProbStatsImportantCatalog.json',
    'csatCommonMathProblemCatalog.json',
    'csatCalculus1BasicCatalog.json',
    'csatJeongseokCalc2Catalog.json',
    'csatJeongseokCalculusCatalog.json',
    'csatSilryeokGeoVectorsCatalog.json',
    'csatSilryeokIntegralStatsCatalog.json',
    'csatSilryeokMath1Catalog.json',
    'csatSilryeokMath2Catalog.json',
]

for f in files:
    path = 'app/data/' + f
    try:
        with open(path, 'r', encoding='utf-8') as fp:
            data = json.load(fp)
        print(f"=== {f} (total: {len(data)}) ===")
        for p in data[:2]:
            print(f"  id: {p.get('id')}")
            print(f"  sourceLabel: {p.get('sourceLabel')}")
            print(f"  year: {p.get('year')}, examType: {p.get('examType')}, number: {p.get('number')}, problemNumber: {p.get('problemNumber')}")
            print(f"  correctRate: {p.get('correctRate')}, errorRate: {p.get('errorRate')}")
            print(f"  q: {p.get('question','')[:80]}")
    except Exception as e:
        print(f"Error {f}: {e}")
