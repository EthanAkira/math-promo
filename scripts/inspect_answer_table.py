import fitz
import pytesseract
from PIL import Image
import io
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

path = "D:/고1 전국연합/해설.pdf"
doc = fitz.open(path)

print(f"Total pages in 해설.pdf: {len(doc)}")

for p_idx in range(1, 6): # Check pages 2 to 6
    page = doc[p_idx]
    pix = page.get_pixmap(dpi=150)
    img = Image.open(io.BytesIO(pix.tobytes("png")))
    txt = pytesseract.image_to_string(img, lang='kor+eng')
    print(f"=== 해설.pdf Page {p_idx+1} ===")
    lines = [l.strip() for l in txt.split('\n') if l.strip()]
    for line in lines[:15]:
        print(" ", line)
doc.close()
