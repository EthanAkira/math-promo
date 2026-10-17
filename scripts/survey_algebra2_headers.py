import fitz
import pytesseract
from PIL import Image
import io
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')
pytesseract.pytesseract.tesseract_cmd = r'C:/Program Files/Tesseract-OCR/tesseract.exe'

files = [
    ('algebra2-0.pdf', 'E:/algebra2-0.pdf'),
    ('algebra2-1.pdf', 'E:/algebra2-1.pdf'),
    ('algebra2-2.pdf', 'E:/algebra2-2.pdf'),
    ('algebra2 -  풀이.pdf', 'E:/algebra2 -  풀이.pdf')
]

for name, path in files:
    doc = fitz.open(path)
    total_pages = len(doc)
    print(f"\n=======================================================")
    print(f"FILE: {name} (Total {total_pages} pages)")
    
    # Check first 3 pages and last 2 pages, and a few middle pages
    test_pages = [0, 1, 2, total_pages // 2, total_pages - 1]
    for p_idx in test_pages:
        page = doc[p_idx]
        pix = page.get_pixmap(dpi=120)
        img = Image.open(io.BytesIO(pix.tobytes('png'))).rotate(180)
        text = pytesseract.image_to_string(img, lang='eng+kor')
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        header = lines[0] if lines else 'EMPTY'
        footer = lines[-1] if lines else 'EMPTY'
        print(f"  [Page {p_idx+1}] Header: {header[:60]} | Footer: {footer[:60]}")
        # print first few lines
        for l in lines[:5]:
            print(f"     | {l}")
    doc.close()
