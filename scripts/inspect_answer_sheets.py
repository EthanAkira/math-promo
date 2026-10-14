import fitz
import pytesseract
from PIL import Image
import io
import sys

sys.stdout.reconfigure(encoding='utf-8')
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

doc = fitz.open("D:/고1 전국연합/해설.pdf")

pages_to_check = [
    ('6월', [23, 24]), # 0-indexed: Page 24, 25
    ('9월', [44, 45]), # Page 45, 46
    ('11월', [68, 69]), # Page 69, 70
    ('고2 3월', [85, 86]) # Page 86, 87
]

for label, p_list in pages_to_check:
    print(f"\n==================== {label} ====================")
    for p in p_list:
        page = doc[p]
        pix = page.get_pixmap(dpi=150)
        img = Image.open(io.BytesIO(pix.tobytes("png")))
        txt = pytesseract.image_to_string(img, lang='kor+eng')
        print(f"--- 해설.pdf Page {p+1} ({label}) ---")
        lines = [l.strip() for l in txt.split('\n') if l.strip()]
        for line in lines[:20]:
            print(" ", line)
doc.close()
