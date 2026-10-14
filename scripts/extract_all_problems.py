import fitz
import pytesseract
from PIL import Image
import io
import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

DIR = "D:/고1 전국연합"

TASKS = [
    ('june', '고1 전국연합 6월.pdf'),
    ('sept', '고1 전국연합 9월.pdf'),
    ('nov', '고1 전국연합 11월.pdf'),
    ('march_g2', '고2 전국연합 3월(고1 전범위).pdf')
]

os.makedirs('scripts/ocr_cache', exist_ok=True)

for key, fname in TASKS:
    cache_path = f'scripts/ocr_cache/{key}_problems.json'
    if os.path.exists(cache_path):
        print(f"[{key}] Cache exists, skipping.")
        continue
    
    doc = fitz.open(f"{DIR}/{fname}")
    total_pages = len(doc)
    print(f"[{key}] Starting OCR on {fname} ({total_pages} pages)...", flush=True)
    
    pages_data = []
    for p_idx in range(total_pages):
        page = doc[p_idx]
        pix = page.get_pixmap(dpi=130)
        img = Image.open(io.BytesIO(pix.tobytes("png")))
        txt = pytesseract.image_to_string(img, lang='kor+eng')
        pages_data.append({
            'page': p_idx + 1,
            'text': txt
        })
        if (p_idx + 1) % 5 == 0 or p_idx == total_pages - 1:
            print(f"  [{key}] Processed {p_idx+1}/{total_pages} pages", flush=True)
    doc.close()
    
    with open(cache_path, 'w', encoding='utf-8') as f:
        json.dump(pages_data, f, ensure_ascii=False, indent=2)
    print(f"[{key}] Saved to {cache_path}!", flush=True)

print("All problem PDFs OCR completed successfully!")
