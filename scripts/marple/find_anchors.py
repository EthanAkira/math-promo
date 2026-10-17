# -*- coding: utf-8 -*-
"""Pass 2: locate the magenta 4-digit problem numbers on every page and read them.
Usage: find_anchors.py q|s   ->  anchors_<q|s>.json  [{p,x,y,w,h,text,conf}]"""
import sys, io, os, re
sys.path.insert(0, os.path.dirname(__file__))
from common import *
import numpy as np, pymupdf, pytesseract
from PIL import Image
from scipy import ndimage
from concurrent.futures import ProcessPoolExecutor
pytesseract.pytesseract.tesseract_cmd = TESS
DPI = 150

def render(pdf, p):
    doc = pymupdf.open(pdf)
    pix = doc[p].get_pixmap(dpi=DPI)
    return Image.open(io.BytesIO(pix.tobytes('png'))).convert('RGB').rotate(180, expand=True)

def work(args):
    pdf, p = args
    im = render(pdf, p)
    a = np.asarray(im).astype(int)
    R, G, B = a[..., 0], a[..., 1], a[..., 2]
    RELAX = os.environ.get('RELAX') == '1'
    mask = ((R - G > 22) & (R > 90) & (B > 40) & (B < R + 10)) if RELAX else ((R - G > 45) & (R > 110) & (B > 50) & (B < R))
    big = ndimage.binary_dilation(mask, structure=np.ones((3, 9)))
    lab, n = ndimage.label(big)
    out = []
    for i, sl in enumerate(ndimage.find_objects(lab)):
        ys, xs = sl
        h = ys.stop - ys.start; w = xs.stop - xs.start
        w -= 8; h -= 2   # undo dilation
        if not ((42 <= w <= 100 and 18 <= h <= 40) if RELAX else (50 <= w <= 84 and 20 <= h <= 36)): continue
        x0 = xs.start + 4; y0 = ys.start + 1
        crop = im.crop((x0 - 6, y0 - 6, x0 + w + 6, y0 + h + 6)).convert('L')
        crop = crop.resize((crop.width * 3, crop.height * 3), Image.LANCZOS)
        d = pytesseract.image_to_data(crop, lang='eng', config='--psm 7 -c tessedit_char_whitelist=0123456789', output_type=pytesseract.Output.DICT)
        txt = ''.join(t for t in d['text'] if t.strip())
        confs = [int(float(c)) for t, c in zip(d['text'], d['conf']) if t.strip()]
        out.append({'p': p, 'x': x0, 'y': y0, 'w': w, 'h': h, 'text': txt, 'conf': min(confs) if confs else -1})
    return {'p': p, 'W': im.size[0], 'H': im.size[1], 'anchors': out}

if __name__ == '__main__':
    which = sys.argv[1]
    pdf = PDF_Q if which == 'q' else PDF_S
    n = len(pymupdf.open(pdf))
    pages = [None] * n
    with ProcessPoolExecutor(max_workers=6) as ex:
        for i, r in enumerate(ex.map(work, [(pdf, p) for p in range(n)])):
            pages[r['p']] = r
            if i % 40 == 0: print(which, i, flush=True)
    save_json(f'anchors_{which}{"_relaxed" if os.environ.get("RELAX")=="1" else ""}.json', pages)
    print('done')
