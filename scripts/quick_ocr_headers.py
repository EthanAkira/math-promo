import fitz
import pytesseract
from PIL import Image
import io
import sys

sys.stdout.reconfigure(encoding='utf-8')
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

DIR = "D:/고1 전국연합"

def get_header_text(pdf_name, page_idx):
    path = f"{DIR}/{pdf_name}"
    doc = fitz.open(path)
    page = doc[page_idx]
    # Render at 150 dpi
    pix = page.get_pixmap(dpi=150)
    img = Image.open(io.BytesIO(pix.tobytes("png")))
    # Crop top 25% for header/title
    w, h = img.size
    crop_header = img.crop((0, 0, w, int(h * 0.25)))
    text = pytesseract.image_to_string(crop_header, lang='kor+eng')
    doc.close()
    return text.strip().replace('\n', ' ')

for fname in ['고1 전국연합 6월.pdf', '고1 전국연합 9월.pdf', '고1 전국연합 11월.pdf', '고2 전국연합 3월(고1 전범위).pdf', '해설.pdf']:
    print(f"=== {fname} ===")
    for p in [0, 1, 8, 16, 24]:
        try:
            doc = fitz.open(f"{DIR}/{fname}")
            if p < len(doc):
                txt = get_header_text(fname, p)
                print(f"  Page {p+1}: {txt[:120]}")
            doc.close()
        except Exception as e:
            print(f"  Page {p+1}: Error {e}")
