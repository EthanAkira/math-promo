import sys
sys.stdout.reconfigure(encoding='utf-8')
import json
import glob
import re

files = glob.glob('app/data/csat*.json')

source_patterns = {}

for fpath in files:
    with open(fpath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    if not isinstance(data, list):
        continue
    
    for item in data:
        src = item.get('sourceLabel', '')
        # Check if src has year or exam keywords
        if any(w in src for w in ['수능', '모의평가', '전국연합', '학평', '교육청', '평가원', '201', '202']):
            prefix = src.split(';')[0].strip()
            # simplify pattern
            source_patterns.setdefault(fpath, []).append((item.get('id'), prefix, item.get('correctRate')))

for fpath, items in source_patterns.items():
    print(f"=== {fpath} ({len(items)} items with exam info) ===")
    with_rate = sum(1 for _, _, r in items if r is not None)
    without_rate = len(items) - with_rate
    print(f"   With rate: {with_rate}, Without rate: {without_rate}")
    for pid, prefix, r in items[:5]:
        print(f"     [{pid}] '{prefix}' (rate: {r})")
