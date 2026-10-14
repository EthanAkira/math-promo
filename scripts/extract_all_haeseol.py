import fitz
import pytesseract
from PIL import Image
import io
import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

DIR = "D:/고1 전국연합/해설.pdf"

RANGES = [
    ('june', 24, 44),
    ('sept', 45, 68),
    ('nov', 69, 85),
    ('march_g2', 86, 118)
]

os.makedirs('scripts/ocr_cache', exist_ok=True)

doc = fitz.open(DIR)
print(f"Haeseol PDF opened. Total pages: {len(doc)}")

for key, start_p, end_p in RANGES:
    cache_path = f'scripts/ocr_cache/{key}_haeseol.json'
    if os.path.exists(cache_path):
        print(f"[{key}] Cache exists, skipping.")
        continue
    
    print(f"[{key}] Starting OCR on haeseol pp. {start_p}-{end_p}...", flush=True)
    pages_data = []
    for p_idx in range(start_p - 1, end_p):
        page = doc[p_idx]
        pix = page.get_pixmap(dpi=130)
        img = Image.open(io.BytesIO(pix.tobytes("png")))
        txt = pytesseract.image_to_string(img, lang='kor+eng')
        pages_data.append({
            'page': p_idx + 1,
            'text': txt
        })
        if (p_idx + 1) % 5 == 0 or p_idx == end_p - 1:
            print(f"  [{key}] Processed page {p_idx+1}/{end_p}", flush=True)
    
    with open(cache_path, 'w', encoding='utf-8') as f:
        json.dump(pages_data, f, ensure_ascii=False, indent=2)
    print(f"[{key}] Saved to {cache_path}!", flush=True)

doc.close()
print("All haeseol OCR completed successfully!")
