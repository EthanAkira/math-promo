import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

for fname in ['고1 전국연합 6월.pdf', '해설.pdf']:
    path = f"D:/고1 전국연합/{fname}"
    doc = fitz.open(path)
    print(f"=== {fname} ===")
    print(f"Total pages: {len(doc)}")
    p0 = doc[0]
    imgs = p0.get_images()
    print(f"Page 0 images: {len(imgs)}")
    for img in imgs:
        xref = img[0]
        bi = doc.extract_image(xref)
        print(f"  format={bi['ext']}, size={bi['width']}x{bi['height']}")
    doc.close()
