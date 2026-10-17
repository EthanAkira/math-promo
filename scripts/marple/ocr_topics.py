# -*- coding: utf-8 -*-
"""OCR the topic name in every solution header (「0008 ▶ 극한의 기본 성질 [정답]」) -> topics.json"""
import sys, os, re
sys.path.insert(0, os.path.dirname(__file__))
from layout import *
import pytesseract
from concurrent.futures import ProcessPoolExecutor
pytesseract.pytesseract.tesseract_cmd = TESS

def work(n):
    im = Image.open(cache_path(f'out/sh/{n:04d}.png')).convert('L')
    row = im.crop((95, 8, max(200, im.width - 130), 46))
    row = row.resize((row.width * 3, row.height * 3), Image.LANCZOS)
    t = pytesseract.image_to_string(row, lang='kor+eng', config='--psm 7').strip().replace('\n', ' ')
    return n, t

if __name__ == '__main__':
    out = {}
    with ProcessPoolExecutor(max_workers=6) as ex:
        for n, t in ex.map(work, range(1, 1380), chunksize=10):
            out[n] = t
    save_json('topics.json', out)
    print(len(out))
