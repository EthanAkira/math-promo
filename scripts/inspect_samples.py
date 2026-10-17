import sys
sys.stdout.reconfigure(encoding='utf-8')
import json

sample_ids = ['jjangeasy-calc-01-07', 'jjangeasy-calc-01-08', 'jjangimportant-math2-01-04', 'jjangimportant-calc2-01-07', 'jjangimportant-probstats-01-04']
files = ['csatCalculus1BasicCatalog.json', 'csatMath2ImportantCatalog.json', 'csatCalculus2ImportantCatalog.json', 'csatProbStatsImportantCatalog.json']

for fname in files:
    with open('app/data/' + fname, 'r', encoding='utf-8') as f:
        data = json.load(f)
    for p in data:
        if p.get('id') in sample_ids:
            print('='*50)
            print(f"[{p['id']}] {fname}")
            print('sourceLabel:', p.get('sourceLabel'))
            print('section:', p.get('section'))
            print('question:', repr(p.get('question')[:200]))
            print('explanation:', repr(p.get('explanation')[:200]))
