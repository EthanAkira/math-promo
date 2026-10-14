import pymupdf
import pytesseract
from PIL import Image
import io
import sys

sys.stdout.reconfigure(encoding='utf-8')
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

doc_main = pymupdf.open(r'D:/기본정석 미적분2 본문.pdf')

for p_idx in [354, 353]:
    p = doc_main[p_idx]
    pix = p.get_pixmap(dpi=120)
    img = Image.open(io.BytesIO(pix.tobytes('png'))).rotate(180, expand=True)
    txt = pytesseract.image_to_string(img, lang='kor+eng')
    print(f"--- Page {p_idx+1} ---")
    for line in txt.splitlines():
        if line.strip():
            print(" ", line.strip())

doc_main.close()
