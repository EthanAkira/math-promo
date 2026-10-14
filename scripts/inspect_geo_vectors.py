import pymupdf
import pytesseract
from PIL import Image
import io
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

files = [
    r'D:\실력정석 기하와벡터 본문.pdf',
    r'D:\실력정석 기하와벡터 유제 해설.pdf',
    r'D:\실력정석 기하와벡터 연습문제 해설.pdf'
]

print("=== Checking Geometry & Vectors Files ===")
for f in files:
    if os.path.exists(f):
        doc = pymupdf.open(f)
        print(f"Exists: {f} ({len(doc)} pages)")
        doc.close()
    else:
        print(f"NOT FOUND: {f}")

# Check TOC at the end of Main Book
doc_main = pymupdf.open(r'D:\실력정석 기하와벡터 본문.pdf')
total = len(doc_main)
print(f"\nChecking TOC in main book (last pages of {total})...")
for idx in range(total - 1, total - 7, -1):
    page = doc_main[idx]
    pix = page.get_pixmap(dpi=120)
    t180 = pytesseract.image_to_string(Image.open(io.BytesIO(pix.tobytes('png'))).rotate(180, expand=True), lang='kor+eng')
    if '차례' in t180 or '단원' in t180 or '포물선' in t180 or '타원' in t180 or '벡터' in t180:
        print(f"--- Page {idx+1} (TOC Candidate) ---")
        lines = [l.strip() for l in t180.splitlines() if l.strip()]
        for l in lines[:15]:
            print("  ", l)

doc_main.close()
