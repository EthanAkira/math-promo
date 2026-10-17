# -*- coding: utf-8 -*-
"""Read the 「정답 ⑤ / 정답 23」 box in every solution header -> answers_sol.json"""
import sys, os, re
sys.path.insert(0, os.path.dirname(__file__))
from layout import *
import crop_solutions as CS
from glyphs import ring_feature
import numpy as np, pytesseract
from PIL import Image
from scipy import ndimage
from concurrent.futures import ProcessPoolExecutor
pytesseract.pytesseract.tesseract_cmd = TESS
C = np.load(cache_path('ring_centroids.npz'))
CEN, DIG = C['c'], C['digits']

def read_box(args):
    """-> (n, {'crop': ndarray of the value region at 300dpi, 'ring': feature or None})"""
    n, p, x0, x1, top = args
    im = render(PDF_S, p, dpi=300).convert('L')
    row = im.crop((x0 * 2, top * 2, x1 * 2, (top + 38) * 2))      # above the header underline
    a = np.asarray(row) < 200
    lab, k = ndimage.label(ndimage.binary_dilation(a, iterations=2))
    boxes = []
    for sl in ndimage.find_objects(lab):
        h = sl[0].stop - sl[0].start; w = sl[1].stop - sl[1].start
        if 70 <= w <= 120 and 30 <= h <= 62:
            boxes.append(sl)
    if not boxes:
        return n, {'err': 'nobox'}
    sl = max(boxes, key=lambda s: s[1].stop)
    gx0 = sl[1].stop + 2
    crop = np.asarray(row)[:, gx0:]
    return n, {'crop': crop}

if __name__ == '__main__':
    pages = CS.merged_anchors()
    allp = sorted(pages)
    lx = sorted(a['x'] for v in pages.values() for a in v if a['x'] < 400)
    rx = sorted(a['x'] for v in pages.values() for a in v if a['x'] >= 400)
    defaults = {'l': lx[len(lx) // 2], 'r': rx[len(rx) // 2]}
    first = {}
    for p in allp:
        im_w = 1275
        cols = CS.page_columns(pages[p], im_w, defaults)
        for c in (0, 1):
            x0, x1, lst = cols[c]
            for a in lst:
                first[a['n']] = (a['n'], p, x0, x1, max(0, a['y'] - 10))
    res = {}
    with ProcessPoolExecutor(max_workers=6) as ex:
        for i, (n, r) in enumerate(ex.map(read_box, list(first.values()), chunksize=8)):
            res[n] = r
    np.savez_compressed(cache_path('sol_glyphs.npz'), **{str(n): v['crop'] for n, v in res.items() if 'crop' in v})
    print(len(res), 'nobox', sum(1 for v in res.values() if 'err' in v), [n for n, v in res.items() if 'err' in v][:30])
