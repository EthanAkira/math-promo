import pymupdf
import pytesseract
from PIL import Image
import io
import sys

sys.stdout.reconfigure(encoding='utf-8')
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

doc_main = pymupdf.open(r'D:/기본정석 미적분2 본문.pdf')
total = len(doc_main)

print("=== Scanning TOC Pages (around p348 ~ p355) ===")
for p_idx in range(total - 3, total - 12, -1):
    p = doc_main[p_idx]
    pix = p.get_pixmap(dpi=120)
    img = Image.open(io.BytesIO(pix.tobytes('png'))).rotate(180, expand=True)
    txt = pytesseract.image_to_string(img, lang='kor+eng')
    if '차례' in txt or '단원' in txt or '지수함수' in txt or '미분' in txt or '적분' in txt:
        print(f"--- Page {p_idx+1} ---")
        for line in txt.splitlines():
            if line.strip():
                print(" ", line.strip())

doc_main.close()
