import fitz
import pytesseract
from PIL import Image
import io
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')
pytesseract.pytesseract.tesseract_cmd = r'C:/Program Files/Tesseract-OCR/tesseract.exe'
os.makedirs('tmp/toc_preview', exist_ok=True)

files = ['algebra2-0.pdf', 'algebra2-1.pdf', 'algebra2-2.pdf', 'algebra2 -  풀이.pdf']

for fname in files:
    path = f'E:/{fname}'
    doc = fitz.open(path)
    print('=============================================')
    print('FILE:', fname, f'({len(doc)} pages)')
    # examine first 6 pages
    for p in range(min(6, len(doc))):
        page = doc[p]
        pix = page.get_pixmap(dpi=150)
        img = Image.open(io.BytesIO(pix.tobytes('png')))
        # OCR
        text = pytesseract.image_to_string(img, lang='eng+kor')
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        if lines:
            print(f'--- PAGE {p+1} ---')
            print('\n'.join(lines[:20]))
            safe_name = fname.replace(' ', '_').replace('.pdf', '')
            img.save(f'tmp/toc_preview/{safe_name}_p{p+1}.png')
    doc.close()
