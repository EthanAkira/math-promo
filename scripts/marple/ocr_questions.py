# -*- coding: utf-8 -*-
"""OCR each cropped problem image (used only for points [N점] + keyword classification, never published)."""
import sys, os, re
sys.path.insert(0, os.path.dirname(__file__))
from layout import *
import pytesseract
from concurrent.futures import ProcessPoolExecutor
pytesseract.pytesseract.tesseract_cmd = TESS

def work(n):
    fn = cache_path(f'out/q/{n:04d}.webp')
    if not os.path.exists(fn): return n, None
    im = Image.open(fn).convert('L')
    im = im.resize((int(im.width * 1.6), int(im.height * 1.6)), Image.LANCZOS)
    return n, pytesseract.image_to_string(im, lang='kor+eng', config='--psm 6')

if __name__ == '__main__':
    out = {}
    with ProcessPoolExecutor(max_workers=6) as ex:
        for n, t in ex.map(work, range(1, 1380), chunksize=6):
            if t is not None: out[n] = t
    save_json('q_text.json', out)
    print(len(out))
