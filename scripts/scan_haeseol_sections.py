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

print(f"Scanning 해설.pdf ({len(doc)} pages)...")

# Let's inspect headers / titles across pages to identify boundaries
# We can sample every 2-3 pages, or check page headers
results = []
for p in range(len(doc)):
    page = doc[p]
    # Check top 20%
    pix = page.get_pixmap(dpi=100)
    img = Image.open(io.BytesIO(pix.tobytes("png")))
    w, h = img.size
    top_img = img.crop((0, 0, w, int(h * 0.2)))
    txt = pytesseract.image_to_string(top_img, lang='kor+eng').strip().replace('\n', ' ')
    
    # Check if there are keywords or answer table pattern
    is_ans_table = bool(re.search(r'001.*002.*003', txt) or '빠른정답' in txt or '정답' in txt and ('①' in txt or '②' in txt or '③' in txt))
    
    if is_ans_table or any(k in txt for k in ['6월', '9월', '11월', '3월', '전국연합', '다항식', '방정식', '부등식', '함수', '도형']):
        print(f"P.{p+1:03d}: {txt[:100]}")
doc.close()
