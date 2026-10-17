import sys
sys.stdout.reconfigure(encoding='utf-8')
import json
import glob
import re

files = glob.glob('app/data/csat*.json')

with open('app/data/csatRateDatabase.json', 'r', encoding='utf-8') as f:
    rates_db = json.load(f)

# Let's inspect all keys across all years in rates_db
print("=== csatRateDatabase.json Structure ===")
for yr in sorted(rates_db.keys()):
    exams = rates_db[yr]
    for etype in exams:
        subs = list(exams[etype].keys())
        print(f"Year {yr} / {etype}: {subs}")

print("\n=== Inspecting files for exam patterns ===")
for fpath in files:
    with open(fpath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    if not isinstance(data, list):
        continue
    
    exam_patterns_found = []
    for item in data:
        # Check sourceLabel, question, explanation, title, etc.
        text = f"{item.get('sourceLabel', '')} {item.get('title', '')} {item.get('chapterName', '')}"
        m = re.search(r'(\d{4})학년도|\b(20\d{2})\b', text)
        if m:
            exam_patterns_found.append((item.get('id'), text))
    
    print(f"{fpath}: {len(exam_patterns_found)} items have year patterns (total {len(data)})")
    if exam_patterns_found[:3]:
        for pid, t in exam_patterns_found[:3]:
            print(f"   [{pid}] {t}")
