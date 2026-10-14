import fitz
import pytesseract
from PIL import Image
import io
import re
import sys
from concurrent.futures import ProcessPoolExecutor

sys.stdout.reconfigure(encoding='utf-8')
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

DIR = "D:/고1 전국연합"

files = [
    '고1 전국연합 6월.pdf',
    '고1 전국연합 9월.pdf',
    '고1 전국연합 11월.pdf',
    '고2 전국연합 3월(고1 전범위).pdf'
]

# Let's inspect the first and last page of each PDF to see problem number range
for fname in files:
    path = f"{DIR}/{fname}"
    doc = fitz.open(path)
    total_pages = len(doc)
    
    # OCR page 2 (index 1) and last page (index total_pages - 1)
    print(f"=== {fname} (Total Pages: {total_pages}) ===")
    for p_idx in [1, 2, total_pages - 2, total_pages - 1]:
        if 0 <= p_idx < total_pages:
            page = doc[p_idx]
            pix = page.get_pixmap(dpi=120)
            img = Image.open(io.BytesIO(pix.tobytes("png")))
            txt = pytesseract.image_to_string(img, lang='kor+eng')
            
            # Find numbers like 001, 002 or 089, etc. and sources like 201606*01
            prob_nums = re.findall(r'\b(0\d\d|[1-9]\d\d)\b', txt)
            sources = re.findall(r'(\d{4,6}\s*[*+·]\s*\d{1,2}번?)', txt)
            print(f"  Page {p_idx+1}: prob_nums={prob_nums[:8]}, sources={sources[:5]}")
    doc.close()
