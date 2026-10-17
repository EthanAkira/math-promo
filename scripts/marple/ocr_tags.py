# -*- coding: utf-8 -*-
"""Multi-variant OCR of the source tag line (「2016학년도 06월 평가원  계산능력」) at the top of each problem image."""
import sys, os, re
sys.path.insert(0, os.path.dirname(__file__))
from layout import *
import pytesseract
from PIL import ImageOps
from concurrent.futures import ProcessPoolExecutor
pytesseract.pytesseract.tesseract_cmd = TESS

def work(n):
    fn = cache_path(f'out/q/{n:04d}.webp')
    if not os.path.exists(fn): return n, None
    im = Image.open(fn).convert('L')
    outs = []
    band = im.crop((78, 8, min(im.width, 560), 44))
    for mode in ('ac', 'bin', 'raw'):
        b = band
        if mode == 'ac': b = ImageOps.autocontrast(b, cutoff=3)
        if mode == 'bin': b = b.point(lambda v: 255 if v > 170 else 0)
        b = b.resize((b.width * 4, b.height * 4), Image.LANCZOS)
        outs.append(pytesseract.image_to_string(b, lang='kor+eng', config='--psm 7').strip().replace('\n', ' '))
    return n, outs

if __name__ == '__main__':
    out = {}
    with ProcessPoolExecutor(max_workers=6) as ex:
        for n, t in ex.map(work, range(1, 1380), chunksize=8):
            if t is not None: out[n] = t
    save_json('tags2.json', out)
    print(len(out))
