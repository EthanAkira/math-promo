import fitz
import pytesseract
from PIL import Image
import io
import sys

sys.stdout.reconfigure(encoding='utf-8')
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

doc = fitz.open("D:/고1 전국연합/고1 전국연합 6월.pdf")
page = doc[1] # Page 2
pix = page.get_pixmap(dpi=150)
img = Image.open(io.BytesIO(pix.tobytes("png")))
w, h = img.size

# Split left and right column
left_col = img.crop((0, 0, int(w * 0.5), h))
right_col = img.crop((int(w * 0.5), 0, w, h))

txt_left = pytesseract.image_to_string(left_col, lang='kor+eng')
txt_right = pytesseract.image_to_string(right_col, lang='kor+eng')

print("=== LEFT COLUMN ===")
print(txt_left)
print("\n=== RIGHT COLUMN ===")
print(txt_right)

doc.close()
