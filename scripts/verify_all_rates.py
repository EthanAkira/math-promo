import sys
sys.stdout.reconfigure(encoding='utf-8')
import json
import glob

files = glob.glob('app/data/csat*.json')

total = 0
with_rates = 0
without_rates = 0

for fpath in sorted(files):
    with open(fpath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    if not isinstance(data, list):
        continue
    c_with = sum(1 for p in data if p.get('correctRate') is not None and p.get('errorRate') is not None)
    c_without = len(data) - c_with
    total += len(data)
    with_rates += c_with
    without_rates += c_without
    print(f"{fpath}: total {len(data)}, with rates: {c_with}, without: {c_without}")
    if c_with > 0:
        p0 = data[0]
        pid = p0.get('id')
        src = p0.get('sourceLabel')
        cr = p0.get('correctRate')
        er = p0.get('errorRate')
        print(f"   Sample: [{pid}] '{src}' | cr: {cr}%, er: {er}%")

print('==================================================')
print(f"TOTAL PROBLEMS: {total}, WITH RATES: {with_rates} ({(with_rates/total)*100:.1f}%), WITHOUT: {without_rates}")
