import sys
import os
import pymupdf
import pytesseract
from PIL import Image
import io
import json

sys.stdout.reconfigure(encoding='utf-8')
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def scan_pdf(pdf_path, cache_name):
    cache_path = f'scripts/ocr_cache/{cache_name}.json'
    if os.path.exists(cache_path):
        print(f"[{cache_name}] Cache exists, skipping.")
        with open(cache_path, 'r', encoding='utf-8') as f:
            return json.load(f)
            
    doc = pymupdf.open(pdf_path)
    total = len(doc)
    print(f"[{cache_name}] Starting OCR on {pdf_path} ({total} pages)...", flush=True)
    results = []
    
    for p_idx in range(total):
        page = doc[p_idx]
        pix = page.get_pixmap(dpi=120)
        img = Image.open(io.BytesIO(pix.tobytes("png"))).rotate(180, expand=True)
        txt = pytesseract.image_to_string(img, lang='kor+eng')
        results.append({
            'pdf_index': p_idx,
            'pdf_page': p_idx + 1,
            'text_len': len(txt),
            'full_text': txt
        })
        if (p_idx + 1) % 15 == 0 or p_idx == total - 1:
            print(f"  [{cache_name}] Processed {p_idx+1}/{total} pages...", flush=True)
            
    doc.close()
    with open(cache_path, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"[{cache_name}] Saved to {cache_path}!", flush=True)
    return results

os.makedirs('scripts/ocr_cache', exist_ok=True)
scan_pdf(r'D:\실력정석 기하와벡터 유제 해설.pdf', 'silryeok_geo_yuje_raw')
scan_pdf(r'D:\실력정석 기하와벡터 연습문제 해설.pdf', 'silryeok_geo_yeonseup_raw')
print("All geometry solution scans completed!")
