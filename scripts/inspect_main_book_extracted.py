import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/ocr_cache/main_book_raw.json', 'r', encoding='utf-8') as f:
    main_pages = json.load(f)

print(f"Total main pages in cache: {len(main_pages)}")

# Sort pages in ascending book page order
# In our cache, book_page_est = total - pdf_index
sorted_pages = sorted(main_pages, key=lambda x: x['book_page_est'])

# Check for pattern [유제] 1-1 or 유제 1-1, and 연습문제 1-1 or 1. or 1-1
yuje_found = []
yeonseup_found = []

for page in sorted_pages:
    txt = page['text']
    b_p = page['book_page_est']
    # Search for Yuje
    # Patterns: [유제] 1-1, 유제 1-1, [유 제] 1-1 등
    y_matches = re.findall(r'(?:\[?\s*유\s*제\s*\]?)\s*(\d{1,2})\s*[-–—]\s*(\d{1,2})', txt)
    for ym in y_matches:
        yuje_found.append((int(ym[0]), int(ym[1]), b_p))
        
    # Search for Yeonseup
    # In Jeongseok, exercise section starts with '연습문제' and then lists problems like '1-1.', '1-2.' or '1.', '2.'
    if '연습문제' in txt:
        # Check problem numbers inside practice section
        e_matches = re.findall(r'(?:^|\n)\s*(\d{1,2})\s*[-–—]\s*(\d{1,2})\s*[\.|\)]', txt)
        for em in e_matches:
            yeonseup_found.append((int(em[0]), int(em[1]), b_p))

print(f"Unique Yuje markers found: {len(set((ch, num) for ch, num, _ in yuje_found))}")
print("Sample Yuje:", sorted(list(set((ch, num) for ch, num, _ in yuje_found)))[:20])

print(f"Unique Yeonseup markers found: {len(set((ch, num) for ch, num, _ in yeonseup_found))}")
print("Sample Yeonseup:", sorted(list(set((ch, num) for ch, num, _ in yeonseup_found)))[:20])
