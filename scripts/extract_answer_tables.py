import fitz
import pytesseract
from PIL import Image
import io
import re
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

doc = fitz.open("D:/고1 전국연합/해설.pdf")

CIRCLED_MAP = {
    '①': 1, '②': 2, '③': 3, '④': 4, '⑤': 5,
    '➀': 1, '➁': 2, '➂': 3, '➃': 4, '➄': 5,
    '➊': 1, '➋': 2, '➌': 3, '➍': 4, '➎': 5,
    'D': 1, '®': 1, '@': 2, '©': 3, 'O': 3, '0': 1, 'e': 1,
}

def parse_answer_page(p_num):
    page = doc[p_num - 1]
    pix = page.get_pixmap(dpi=200)
    img = Image.open(io.BytesIO(pix.tobytes("png")))
    txt = pytesseract.image_to_string(img, lang='kor+eng')
    return txt

print("Parsing answer tables...")

# Let's save the OCR text of key answer pages
ans_pages = {
    'june': [24],
    'sept': [45],
    'nov': [69],
    'march_g2': [85, 86]
}

ans_data = {}
for sess, p_list in ans_pages.items():
    full_txt = ""
    for p in p_list:
        full_txt += f"\n--- Page {p} ---\n" + parse_answer_page(p)
    ans_data[sess] = full_txt

with open('scripts/extracted_answer_tables.json', 'w', encoding='utf-8') as f:
    json.dump(ans_data, f, ensure_ascii=False, indent=2)

print("Saved extracted_answer_tables.json successfully!")
doc.close()
