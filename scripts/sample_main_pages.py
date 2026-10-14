import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/ocr_cache/main_book_raw.json', 'r', encoding='utf-8') as f:
    pages = json.load(f)

# Sort ascending by book order: total - pdf_index
sorted_pages = sorted(pages, key=lambda x: x['book_page_est'])

# Book pages 1 ~ 20 (Chapter 1)
print("=== CHAPTER 1 SAMPLE PAGES ===")
for p in sorted_pages:
    b_p = p['book_page_est']
    if 5 <= b_p <= 20:
        print(f"\n--- Book Page {b_p} (PDF page {p['pdf_page']}) ---")
        lines = [l.strip() for l in p['text'].splitlines() if l.strip()]
        for l in lines[:10]:
            print("  ", l)
