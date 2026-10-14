import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/ocr_cache/yuje_haeseol_raw.json', 'r', encoding='utf-8') as f:
    yuje = json.load(f)

print('=== YUJE HAESEOL (First 15 pages with problems) ===')
yuje_probs_all = set()
for item in yuje:
    txt = item['full_text']
    probs = re.findall(r'(\d{1,2}\s*[-–—]\s*\d{1,2})\.', txt)
    for p in probs:
        p_clean = re.sub(r'\s+', '', p).replace('–', '-').replace('—', '-')
        yuje_probs_all.add(p_clean)

print(f"Total unique Yuje numbers found: {len(yuje_probs_all)}")
sorted_yuje = sorted(list(yuje_probs_all), key=lambda x: [int(v) for v in x.split('-')])
print("Sample Yuje numbers:", sorted_yuje[:25])
print("Sample Yuje numbers end:", sorted_yuje[-25:])

with open('scripts/ocr_cache/yeonseup_haeseol_raw.json', 'r', encoding='utf-8') as f:
    yeonseup = json.load(f)

print('\n=== YEONSEUP HAESEOL ===')
yeonseup_probs_all = set()
for item in yeonseup:
    txt = item['full_text']
    probs = re.findall(r'(\d{1,2}\s*[-–—]\s*\d{1,2})\.', txt)
    for p in probs:
        p_clean = re.sub(r'\s+', '', p).replace('–', '-').replace('—', '-')
        yeonseup_probs_all.add(p_clean)

print(f"Total unique Yeonseup numbers found: {len(yeonseup_probs_all)}")
sorted_yeon = sorted(list(yeonseup_probs_all), key=lambda x: [int(v) for v in x.split('-')])
print("Sample Yeonseup numbers:", sorted_yeon[:25])
print("Sample Yeonseup numbers end:", sorted_yeon[-25:])
