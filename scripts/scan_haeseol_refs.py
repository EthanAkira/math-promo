import fitz
import pytesseract
from PIL import Image
import io
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

DIR = "D:/고1 전국연합"

files = [
    '고1 전국연합 6월.pdf',
    '고1 전국연합 9월.pdf',
    '고1 전국연합 11월.pdf',
    '고2 전국연합 3월(고1 전범위).pdf'
]

# Scan problem PDFs for "정답과 해설 pp.X-Y"
for fname in files:
    doc = fitz.open(f"{DIR}/{fname}")
    print(f"\n==================== {fname} ({len(doc)} pages) ====================")
    found_pages = []
    for p in range(len(doc)):
        page = doc[p]
        pix = page.get_pixmap(dpi=100)
        img = Image.open(io.BytesIO(pix.tobytes("png")))
        # Check bottom 20%
        w, h = img.size
        crop_bottom = img.crop((0, int(h * 0.75), w, h))
        txt = pytesseract.image_to_string(crop_bottom, lang='kor+eng')
        m = re.findall(r'정답과\s*해설\s*pp?\.?\s*(\d+)\s*[-~]\s*(\d+)', txt)
        if m:
            found_pages.append((p + 1, m))
        # Also check problem numbers on this page
        # Top 15%
        crop_top = img.crop((0, 0, w, int(h * 0.15)))
        txt_top = pytesseract.image_to_string(crop_top, lang='kor+eng')
        p_nums = re.findall(r'\b(0\d\d|[1-9]\d\d)\b', txt_top)
        if p == 1 or p == len(doc) - 2 or p == len(doc) - 1:
            print(f"  Page {p+1} (probs={p_nums[:5]}): {m}")
    print(f"  All haeseol page refs found in {fname}: {found_pages[:10]}")
    doc.close()
