import sys
import os
import pymupdf
import pytesseract
from PIL import Image
import io
import json
import re

sys.stdout.reconfigure(encoding='utf-8')
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def scan_pdf_headers(pdf_path, name):
    doc = pymupdf.open(pdf_path)
    total = len(doc)
    print(f"Scanning {name} ({total} pages)...")
    results = []
    for p_idx in range(total):
        page = doc[p_idx]
        pix = page.get_pixmap(dpi=120)
        img = Image.open(io.BytesIO(pix.tobytes("png"))).rotate(180, expand=True)
        txt = pytesseract.image_to_string(img, lang='kor+eng')
        # find problem numbers like '1-1', '1-2', '15-3', etc.
        prob_matches = re.findall(r'(\b\d{1,2}\s*[-–—]\s*\d{1,2}\b)', txt)
        # find chapter keywords
        ch_matches = re.findall(r'(\d{1,2})\s*\.\s*([가-힣\s·ㆍ]+)', txt)
        lines = [l.strip() for l in txt.splitlines() if l.strip()]
        first_lines = lines[:4] if lines else []
        results.append({
            'pdf_index': p_idx,
            'pdf_page': p_idx + 1,
            'text_len': len(txt),
            'first_lines': first_lines,
            'found_probs': list(set(prob_matches))[:10],
            'full_text': txt
        })
        if (p_idx + 1) % 10 == 0 or p_idx == total - 1:
            print(f"  Processed {p_idx+1}/{total} pages...", flush=True)
    doc.close()
    return results

os.makedirs('scripts/ocr_cache', exist_ok=True)

# Scan Yuje Haeseol
yuje_data = scan_pdf_headers(r'D:\기본정석 미적분 유제 해설.pdf', '유제 해설')
with open('scripts/ocr_cache/yuje_haeseol_raw.json', 'w', encoding='utf-8') as f:
    json.dump(yuje_data, f, ensure_ascii=False, indent=2)

# Scan Yeonseup Haeseol
yeonseup_data = scan_pdf_headers(r'D:\기본정석 미적분 연습문제 해설.pdf', '연습문제 해설')
with open('scripts/ocr_cache/yeonseup_haeseol_raw.json', 'w', encoding='utf-8') as f:
    json.dump(yeonseup_data, f, ensure_ascii=False, indent=2)

print("Scan of solution files complete!")
