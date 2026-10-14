import fitz
import pytesseract
from PIL import Image
import io
import json
import os
import sys
from concurrent.futures import ProcessPoolExecutor

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

def process_page(args):
    pdf_path, p_idx = args
    doc = fitz.open(pdf_path)
    page = doc[p_idx]
    pix = page.get_pixmap(dpi=140)
    img = Image.open(io.BytesIO(pix.tobytes("png")))
    w, h = img.size
    
    # Left and right columns
    left_img = img.crop((0, 0, int(w * 0.5), h))
    right_img = img.crop((int(w * 0.5), 0, w, h))
    
    txt_l = pytesseract.image_to_string(left_img, lang='kor+eng')
    txt_r = pytesseract.image_to_string(right_img, lang='kor+eng')
    doc.close()
    
    return {
        'page': p_idx + 1,
        'left': txt_l,
        'right': txt_r,
        'text': txt_l + "\n\n" + txt_r
    }

if __name__ == '__main__':
    for key, fname in TASKS:
        out_file = f'scripts/ocr_cache/{key}_problems_clean.json'
        pdf_path = f"{DIR}/{fname}"
        doc = fitz.open(pdf_path)
        total_pages = len(doc)
        doc.close()
        
        print(f"[{key}] Processing {fname} ({total_pages} pages) in parallel...", flush=True)
        args_list = [(pdf_path, p) for p in range(total_pages)]
        
        with ProcessPoolExecutor(max_workers=4) as executor:
            results = list(executor.map(process_page, args_list))
            
        with open(out_file, 'w', encoding='utf-8') as f:
            json.dump(results, f, ensure_ascii=False, indent=2)
            
        print(f"[{key}] Saved clean 2-column OCR to {out_file}!", flush=True)

    print("All 4 exams 2-column OCR completed successfully!")
