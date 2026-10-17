# -*- coding: utf-8 -*-
"""Extra OCR variants of the solution-header topic text (for rows the first pass could not read)."""
import sys, os, re
sys.path.insert(0, os.path.dirname(__file__))
from layout import *
import pytesseract
from PIL import ImageOps
from concurrent.futures import ProcessPoolExecutor
pytesseract.pytesseract.tesseract_cmd = TESS

def work(n):
    im = Image.open(cache_path(f'out/sh/{n:04d}.png')).convert('L')
    outs = []
    for (x0, y0, x1, y1, mode) in ((95, 6, im.width - 120, 48, 'ac'), (110, 6, im.width - 140, 48, 'bin'), (80, 4, im.width - 100, 50, 'ac6')):
        row = im.crop((x0, y0, max(x0 + 100, x1), y1))
        if mode.startswith('ac'): row = ImageOps.autocontrast(row, cutoff=2)
        if mode == 'bin': row = row.point(lambda v: 255 if v > 165 else 0)
        row = row.resize((row.width * 4, row.height * 4), Image.LANCZOS)
        cfg = '--psm 6' if mode == 'ac6' else '--psm 7'
        outs.append(pytesseract.image_to_string(row, lang='kor+eng', config=cfg).strip().replace('\n', ' '))
    return n, outs

if __name__ == '__main__':
    out = {}
    with ProcessPoolExecutor(max_workers=6) as ex:
        for n, t in ex.map(work, range(1, 1380), chunksize=10):
            out[n] = t
    save_json('topics2.json', out)
    print(len(out))
