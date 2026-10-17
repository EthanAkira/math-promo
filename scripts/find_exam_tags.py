import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

files = [
    'csatMath2ImportantCatalog.json',
    'csatProbStatsImportantCatalog.json',
    'csatCalculus2ImportantCatalog.json',
    'csatCommonMathProblemCatalog.json',
    'csatCalculus1BasicCatalog.json',
    'csatJjangeasyGeoCatalog.json',
]

pattern = re.compile(r'((?:20\d\d|19\d\d)\s*학년도[^;\n]{0,30}|(?:20\d\d|19\d\d|[0-9]{2})년\s*\d{1,2}월[^;\n]{0,30}|수능|평가원|교육청|학평|모의평가)')

for fname in files:
    with open('app/data/' + fname, 'r', encoding='utf-8') as f:
        data = json.load(f)
    found = 0
    samples = []
    for p in data:
        full = f"{p.get('sourceLabel','')} {p.get('section','')} {p.get('question','')} {p.get('explanation','')}"
        m = pattern.search(full)
        if m:
            found += 1
            if len(samples) < 3:
                samples.append((p.get('id'), m.group(0), p.get('sourceLabel','')))
    print(f"{fname}: {found}/{len(data)} has exam pattern")
    for s in samples:
        print(f"   {s[0]} -> matched: '{s[1]}' | current source: '{s[2]}'")
