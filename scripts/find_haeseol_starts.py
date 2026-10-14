import fitz
import pytesseract
from PIL import Image
import io
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

doc = fitz.open("D:/고1 전국연합/해설.pdf")
print(f"Total pages: {len(doc)}", flush=True)

# Check every page for "001" or answer table pattern
for p in range(len(doc)):
    page = doc[p]
    pix = page.get_pixmap(dpi=90)
    img = Image.open(io.BytesIO(pix.tobytes("png")))
    txt = pytesseract.image_to_string(img, lang='kor+eng')
    
    # Check if page has problem '001' or quick answers
    has_001 = bool(re.search(r'\b001\b', txt))
    has_quick_ans = bool('빠른' in txt or ('001' in txt and '002' in txt and '003' in txt))
    
    # Title / header in top 20%
    w, h = img.size
    top_txt = pytesseract.image_to_string(img.crop((0, 0, w, int(h * 0.15))), lang='kor+eng').strip().replace('\n', ' ')
    
    if has_001 or has_quick_ans:
        print(f"Page {p+1:03d}: HAS_001={has_001}, QUICK={has_quick_ans} | Header: {top_txt[:80]}", flush=True)
doc.close()
