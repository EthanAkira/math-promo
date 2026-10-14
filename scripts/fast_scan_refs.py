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

for fname in files:
    doc = fitz.open(f"{DIR}/{fname}")
    total = len(doc)
    # check pages: 1, 5, 10, 15, 20, last
    check_indices = [1, 5, 10, min(15, total-1), min(20, total-1), total-1]
    check_indices = sorted(list(set(check_indices)))
    print(f"=== {fname} ({total}p) ===", flush=True)
    for p in check_indices:
        page = doc[p]
        pix = page.get_pixmap(dpi=100)
        img = Image.open(io.BytesIO(pix.tobytes("png")))
        w, h = img.size
        crop_bottom = img.crop((0, int(h * 0.75), w, h))
        txt = pytesseract.image_to_string(crop_bottom, lang='kor+eng')
        m = re.findall(r'정답과\s*해설\s*pp?\.?\s*(\d+)\s*[-~]\s*(\d+)', txt)
        # also prob number on top
        crop_top = img.crop((0, 0, w, int(h * 0.15)))
        txt_top = pytesseract.image_to_string(crop_top, lang='kor+eng')
        p_nums = re.findall(r'\b(0\d\d|[1-9]\d\d)\b', txt_top)
        print(f"  Page {p+1:02d} (probs={p_nums[:3]}): ref={m}", flush=True)
    doc.close()
