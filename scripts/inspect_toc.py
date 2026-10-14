import fitz
import pytesseract
from PIL import Image
import io
import sys

sys.stdout.reconfigure(encoding='utf-8')
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

DIR = "D:/고1 전국연합"

def full_page_ocr(pdf_name, page_idx):
    path = f"{DIR}/{pdf_name}"
    doc = fitz.open(path)
    page = doc[page_idx]
    pix = page.get_pixmap(dpi=150)
    img = Image.open(io.BytesIO(pix.tobytes("png")))
    text = pytesseract.image_to_string(img, lang='kor+eng')
    doc.close()
    return text

print("=== 고1 전국연합 6월 Page 1 & 2 ===")
print(full_page_ocr('고1 전국연합 6월.pdf', 0)[:500])
print("--- Page 2 ---")
print(full_page_ocr('고1 전국연합 6월.pdf', 1)[:500])

print("=== 해설.pdf Page 1 & 2 ===")
print(full_page_ocr('해설.pdf', 0)[:500])
print("--- Page 2 ---")
print(full_page_ocr('해설.pdf', 1)[:500])
