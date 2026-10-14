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

def scan_main_book(pdf_path):
    cache_path = 'scripts/ocr_cache/main_book_raw.json'
    if os.path.exists(cache_path):
        print("Main book cache exists, loading...")
        with open(cache_path, 'r', encoding='utf-8') as f:
            return json.load(f)
            
    doc = pymupdf.open(pdf_path)
    total = len(doc)
    print(f"Scanning Main Book ({total} pages)...", flush=True)
    results = []
    
    # We rotate 180 degrees. Also remember PDF is scanned in reverse order!
    # PDF page 238 is the beginning (p1), PDF page 1 is the end (p240).
    for p_idx in range(total):
        page = doc[p_idx]
        pix = page.get_pixmap(dpi=120)
        img = Image.open(io.BytesIO(pix.tobytes("png"))).rotate(180, expand=True)
        txt = pytesseract.image_to_string(img, lang='kor+eng')
        
        results.append({
            'pdf_index': p_idx,
            'pdf_page': p_idx + 1,
            # Book page number in logical order: reverse of scan order
            'book_page_est': total - p_idx,
            'text_len': len(txt),
            'text': txt
        })
        if (p_idx + 1) % 20 == 0 or p_idx == total - 1:
            print(f"  Processed {p_idx+1}/{total} pages...", flush=True)
            
    doc.close()
    with open(cache_path, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print("Main book scan complete and cached!", flush=True)
    return results

scan_main_book(r'D:\기본정석 미적분 본문.pdf')
