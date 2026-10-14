import pymupdf
import pytesseract
from PIL import Image
import io
import sys

sys.stdout.reconfigure(encoding='utf-8')
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

doc_main = pymupdf.open(r'D:/기본정석 미적분2 본문.pdf')
total = len(doc_main)
print(f"Total pages in main book: {total}")

print("=== Checking first few and last few pages of Main Book ===")
for idx in [0, 1, 5, total - 10, total - 5, total - 2, total - 1]:
    p = doc_main[idx]
    pix = p.get_pixmap(dpi=100)
    img = Image.open(io.BytesIO(pix.tobytes('png')))
    t0 = pytesseract.image_to_string(img, lang='kor+eng')
    t180 = pytesseract.image_to_string(img.rotate(180, expand=True), lang='kor+eng')
    l0 = [l.strip() for l in t0.splitlines() if l.strip()]
    l180 = [l.strip() for l in t180.splitlines() if l.strip()]
    print(f"Page {idx+1}:")
    print("  0 deg:  ", l0[:2])
    print("  180 deg:", l180[:2])

doc_main.close()
