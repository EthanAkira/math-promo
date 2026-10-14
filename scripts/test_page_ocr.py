import fitz
import pytesseract
from PIL import Image
import io
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

doc = fitz.open("D:/고1 전국연합/고1 전국연합 6월.pdf")

# Test page 2 (index 1)
page = doc[1]
pix = page.get_pixmap(dpi=150)
img = Image.open(io.BytesIO(pix.tobytes("png")))
txt = pytesseract.image_to_string(img, lang='kor+eng')

print("=== RAW TEXT OF PAGE 2 ===")
print(txt)

doc.close()
