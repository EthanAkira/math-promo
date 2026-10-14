import sys
import pymupdf
import pytesseract
from PIL import Image
import io

sys.stdout.reconfigure(encoding='utf-8')
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# 1. Inspect first few pages of main book
doc_main = pymupdf.open(r'D:\기본정석 미적분 본문.pdf')
print("=== MAIN BOOK (First 8 pages) ===")
for pno in range(min(8, len(doc_main))):
    page = doc_main[pno]
    pix = page.get_pixmap(dpi=120)
    img = Image.open(io.BytesIO(pix.tobytes('png')))
    txt = pytesseract.image_to_string(img, lang='kor+eng')
    print(f"--- Page {pno+1} ---")
    lines = [line.strip() for line in txt.splitlines() if line.strip()]
    for line in lines[:8]:
        print("  ", line)

# 2. Inspect first few pages of Yuje haeseol
doc_yuje = pymupdf.open(r'D:\기본정석 미적분 유제 해설.pdf')
print("\n=== YUJE HAESEOL (First 5 pages) ===")
for pno in range(min(5, len(doc_yuje))):
    page = doc_yuje[pno]
    pix = page.get_pixmap(dpi=120)
    img = Image.open(io.BytesIO(pix.tobytes('png')))
    txt = pytesseract.image_to_string(img, lang='kor+eng')
    print(f"--- Page {pno+1} ---")
    lines = [line.strip() for line in txt.splitlines() if line.strip()]
    for line in lines[:8]:
        print("  ", line)

# 3. Inspect first few pages of Yeonseup haeseol
doc_yeonseup = pymupdf.open(r'D:\기본정석 미적분 연습문제 해설.pdf')
print("\n=== YEONSEUP HAESEOL (First 5 pages) ===")
for pno in range(min(5, len(doc_yeonseup))):
    page = doc_yeonseup[pno]
    pix = page.get_pixmap(dpi=120)
    img = Image.open(io.BytesIO(pix.tobytes('png')))
    txt = pytesseract.image_to_string(img, lang='kor+eng')
    print(f"--- Page {pno+1} ---")
    lines = [line.strip() for line in txt.splitlines() if line.strip()]
    for line in lines[:8]:
        print("  ", line)
