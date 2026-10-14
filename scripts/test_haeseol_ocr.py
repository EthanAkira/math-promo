import fitz
import pytesseract
from PIL import Image
import io
import sys

sys.stdout.reconfigure(encoding='utf-8')
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

doc = fitz.open("D:/고1 전국연합/해설.pdf")

# Page 24 is index 23, Page 25 is index 24
for p_idx in [23, 24]:
    page = doc[p_idx]
    pix = page.get_pixmap(dpi=150)
    img = Image.open(io.BytesIO(pix.tobytes("png")))
    txt = pytesseract.image_to_string(img, lang='kor+eng')
    print(f"=== RAW HAESEOL PAGE {p_idx+1} ===")
    print(txt[:1500])

doc.close()
