import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/ocr_cache/main_book_raw.json', 'r', encoding='utf-8') as f:
    main_raw = json.load(f)

sorted_pages = sorted(main_raw, key=lambda x: x['book_page_est'])
full_main = "\n".join([p['text'] for p in sorted_pages])

# Find questions for Yuje: pattern looking for ch-num after 유제 or similar
# Also in Yeonseup: sections starting with '연습문제'

def find_yuje_question(ch, num):
    # Search for e.g. "1-1" or "유제 1-1" or "[유제] 1-1"
    patterns = [
        rf'(?:유\s*제|EAD|812|\[유제\])\s*{ch}\s*[-–—]\s*{num}\.?\s*([^\n]+(?:\n[^\n]+){{1,4}})',
        rf'(?:^|\n)\s*{ch}\s*[-–—]\s*{num}\.?\s*([^\n]+(?:\n[^\n]+){{1,4}})'
    ]
    for pat in patterns:
        m = re.search(pat, full_main)
        if m:
            snippet = m.group(1).strip()
            # cut before 답:
            snippet = re.split(r'(?:답\s*[:|;]?|Hw|Ew)', snippet)[0].strip()
            if len(snippet) > 10:
                return snippet
    return None

def find_yeonseup_question(ch, num):
    # Search for Yeonseup problems in main text
    pattern = rf'(?:연습문제\s*{ch}[\s\S]*?)(?:^|\n)\s*{ch}\s*[-–—]\s*{num}\s*[\.|\)]\s*([^\n]+(?:\n[^\n]+){{1,5}})'
    m = re.search(pattern, full_main)
    if m:
        snippet = m.group(1).strip()
        snippet = re.split(r'(?:^|\n)\s*\d{1,2}\s*[-–—]\s*\d{1,2}', snippet)[0].strip()
        if len(snippet) > 10:
            return snippet
    return None

print("Testing Yuje 1-1:", find_yuje_question(1, 1))
print("Testing Yuje 1-2:", find_yuje_question(1, 2))
print("Testing Yeonseup 1-1:", find_yeonseup_question(1, 1))
print("Testing Yeonseup 1-2:", find_yeonseup_question(1, 2))
print("Testing Yeonseup 1-3:", find_yeonseup_question(1, 3))
