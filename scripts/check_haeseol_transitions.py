import fitz
import pytesseract
from PIL import Image
import io
import sys

sys.stdout.reconfigure(encoding='utf-8')
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

path = "D:/고1 전국연합/해설.pdf"
doc = fitz.open(path)

# Pages to inspect (1-indexed converted to 0-indexed)
test_pages = [1, 2, 28, 29, 30, 48, 49, 50, 72, 73, 74, 88, 89, 90]

for p in test_pages:
    if 0 <= p < len(doc):
        page = doc[p]
        pix = page.get_pixmap(dpi=120)
        img = Image.open(io.BytesIO(pix.tobytes("png")))
        # Top 30% of the page
        w, h = img.size
        crop_top = img.crop((0, 0, w, int(h * 0.35)))
        txt = pytesseract.image_to_string(crop_top, lang='kor+eng').strip().replace('\n', ' ')
        print(f"Page {p+1:03d}: {txt[:120]}", flush=True)

doc.close()
