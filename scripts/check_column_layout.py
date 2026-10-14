import fitz
from PIL import Image
import io
import sys

sys.stdout.reconfigure(encoding='utf-8')

doc = fitz.open("D:/고1 전국연합/고1 전국연합 6월.pdf")
p = doc[1]
pix = page_pix = p.get_pixmap(dpi=100)
img = Image.open(io.BytesIO(pix.tobytes("png")))
w, h = img.size
print(f"Page size at 100dpi: {w} x {h}")
doc.close()
