# -*- coding: utf-8 -*-
"""Pass 1: OCR every page (rotated 180deg, 150dpi) -> word boxes. Usage: ocr_pages.py q|s"""
import sys, io, os
sys.path.insert(0, os.path.dirname(__file__))
from common import *
import pymupdf, pytesseract
from PIL import Image
from concurrent.futures import ProcessPoolExecutor
pytesseract.pytesseract.tesseract_cmd = TESS
DPI = 150

def work(args):
    pdf, p = args
    doc = pymupdf.open(pdf)
    pix = doc[p].get_pixmap(dpi=DPI)
    im = Image.open(io.BytesIO(pix.tobytes('png'))).rotate(180, expand=True)
    d = pytesseract.image_to_data(im, lang='kor+eng', config='--psm 11', output_type=pytesseract.Output.DICT)
    words = []
    for i, t in enumerate(d['text']):
        t = t.strip()
        if t:
            words.append([t, d['left'][i], d['top'][i], d['width'][i], d['height'][i], int(float(d['conf'][i]))])
    return {'p': p, 'w': im.size[0], 'h': im.size[1], 'words': words}

if __name__ == '__main__':
    which = sys.argv[1]
    pdf = PDF_Q if which == 'q' else PDF_S
    n = len(pymupdf.open(pdf))
    out = f'ocr_{which}.json'
    res = [None] * n
    with ProcessPoolExecutor(max_workers=6) as ex:
        for i, r in enumerate(ex.map(work, [(pdf, p) for p in range(n)])):
            res[r['p']] = r
            if i % 20 == 0: print(which, i, '/', n, flush=True)
    save_json(out, res)
    print('done', out)
