import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/ocr_cache/silryeok_integral_yuje_raw.json', 'r', encoding='utf-8') as f:
    yuje_data = json.load(f)

# Sort descending by pdf_page (chapter 1 -> 16)
sorted_yuje = sorted(yuje_data, key=lambda x: x['pdf_page'], reverse=True)
full_yuje = "\n".join([p['full_text'] for p in sorted_yuje])

yuje_pattern = re.compile(r'(?:^|\n)\s*(\d{1,2})\s*[-–—]\s*(\d{1,2})\s*[\.|\)]\s*')
yuje_matches = list(yuje_pattern.finditer(full_yuje))

yuje_probs = {}
for i, m in enumerate(yuje_matches):
    ch = int(m.group(1))
    num = int(m.group(2))
    if not (1 <= ch <= 16):
        continue
    key = f"{ch}-{num}"
    start_pos = m.end()
    end_pos = yuje_matches[i+1].start() if i + 1 < len(yuje_matches) else len(full_yuje)
    expl = full_yuje[start_pos:end_pos].strip()
    if key not in yuje_probs or len(expl) > len(yuje_probs[key]):
        yuje_probs[key] = expl

print(f"Total Yuje problems parsed: {len(yuje_probs)}")

with open('scripts/ocr_cache/silryeok_integral_yeonseup_raw.json', 'r', encoding='utf-8') as f:
    yeonseup_data = json.load(f)

sorted_yeon = sorted(yeonseup_data, key=lambda x: x['pdf_page'], reverse=True)
full_yeon = "\n".join([p['full_text'] for p in sorted_yeon])

yeon_pattern = re.compile(r'(?:^|\n)\s*(\d{1,2})\s*[-–—]\s*(\d{1,2})\s*[\.|\)]\s*')
yeon_matches = list(yeon_pattern.finditer(full_yeon))

yeon_probs = {}
for i, m in enumerate(yeon_matches):
    ch = int(m.group(1))
    num = int(m.group(2))
    if not (1 <= ch <= 16):
        continue
    key = f"{ch}-{num}"
    start_pos = m.end()
    end_pos = yeon_matches[i+1].start() if i + 1 < len(yeon_matches) else len(full_yeon)
    expl = full_yeon[start_pos:end_pos].strip()
    if key not in yeon_probs or len(expl) > len(yeon_probs[key]):
        yeon_probs[key] = expl

print(f"Total Yeonseup problems parsed: {len(yeon_probs)}")

# Check max number per chapter in Yeonseup
for ch in range(1, 17):
    y_nums = [int(k.split('-')[1]) for k in yuje_probs if int(k.split('-')[0]) == ch]
    e_nums = [int(k.split('-')[1]) for k in yeon_probs if int(k.split('-')[0]) == ch]
    max_e = max(e_nums) if e_nums else 0
    print(f"Chapter {ch:02d}: 유제 {len(y_nums)}개, 연습문제 {len(e_nums)}개 (최대번호: {max_e})")
