# -*- coding: utf-8 -*-
"""
Fast Parallel OCR Scanner for 짱쉬운 기하와 벡터:
- E:\짱쉬운 기하와벡터 정답과 풀이.pdf (41 pages)
- E:\짱쉬운 기하와벡터 본문.pdf (88 pages)
"""

import sys
import os
import pymupdf
import pytesseract
from PIL import Image
import io
import json
from concurrent.futures import ThreadPoolExecutor

sys.stdout.reconfigure(encoding='utf-8')
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def ocr_page(args):
    pdf_path, p_idx = args
    try:
        doc = pymupdf.open(pdf_path)
        page = doc[p_idx]
        pix = page.get_pixmap(dpi=120)
        img = Image.open(io.BytesIO(pix.tobytes("png"))).rotate(180, expand=True)
        txt = pytesseract.image_to_string(img, lang='kor+eng')
        doc.close()
        return {
            'pdf_index': p_idx,
            'pdf_page': p_idx + 1,
            'text_len': len(txt),
            'full_text': txt
        }
    except Exception as e:
        return {
            'pdf_index': p_idx,
            'pdf_page': p_idx + 1,
            'text_len': 0,
            'full_text': f"ERROR: {str(e)}"
        }

def scan_pdf_parallel(pdf_path, cache_name, max_workers=6):
    cache_path = f'scripts/ocr_cache/{cache_name}.json'
    if os.path.exists(cache_path):
        print(f"[{cache_name}] Cache exists ({cache_path}), skipping scan.")
        with open(cache_path, 'r', encoding='utf-8') as f:
            return json.load(f)

    doc = pymupdf.open(pdf_path)
    total = len(doc)
    doc.close()
    print(f"[{cache_name}] Starting parallel OCR on {pdf_path} ({total} pages) with {max_workers} workers...", flush=True)

    tasks = [(pdf_path, i) for i in range(total)]
    results = [None] * total

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        for res in executor.map(ocr_page, tasks):
            idx = res['pdf_index']
            results[idx] = res
            if (idx + 1) % 10 == 0 or idx == total - 1:
                print(f"  [{cache_name}] Completed page {idx+1}/{total}...", flush=True)

    with open(cache_path, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"[{cache_name}] Successfully saved {len(results)} pages to {cache_path}!", flush=True)
    return results

if __name__ == '__main__':
    os.makedirs('scripts/ocr_cache', exist_ok=True)
    ans_path = r'E:\짱쉬운 기하와벡터 정답과 풀이.pdf'
    main_path = r'E:\짱쉬운 기하와벡터 본문.pdf'

    print("=== Scanning 짱쉬운 기하와벡터 PDFs ===", flush=True)
    scan_pdf_parallel(ans_path, 'jjangeasy_geo_solutions_raw', max_workers=6)
    scan_pdf_parallel(main_path, 'jjangeasy_geo_main_raw', max_workers=6)
    print("All scans complete!", flush=True)
