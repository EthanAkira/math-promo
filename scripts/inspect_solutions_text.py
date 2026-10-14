import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/ocr_cache/yuje_haeseol_raw.json', 'r', encoding='utf-8') as f:
    yuje = json.load(f)

print("=== SAMPLE YUJE HAESEOL TEXT ===")
for item in yuje:
    txt = item['full_text']
    if '1-1.' in txt or '1-2.' in txt or '2-1.' in txt:
        p_no = item['pdf_page']
        print(f"--- Yuje Page {p_no} ---")
        lines = [l.strip() for l in txt.splitlines() if l.strip()]
        for l in lines[:15]:
            print(" ", l)
        print()

with open('scripts/ocr_cache/yeonseup_haeseol_raw.json', 'r', encoding='utf-8') as f:
    yeonseup = json.load(f)

print("=== SAMPLE YEONSEUP HAESEOL TEXT ===")
for item in yeonseup:
    txt = item['full_text']
    if '1-1.' in txt or '1-2.' in txt or '2-1.' in txt:
        p_no = item['pdf_page']
        print(f"--- Yeonseup Page {p_no} ---")
        lines = [l.strip() for l in txt.splitlines() if l.strip()]
        for l in lines[:15]:
            print(" ", l)
        print()
