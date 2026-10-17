# -*- coding: utf-8 -*-
"""Read the quick-answer table (first pages of the 문제 PDF): number -> circled digit or integer.
Output answers_table.json {n: {'mc': d|None, 'num': str|None, 'score': float}}"""
import sys, os, re
sys.path.insert(0, os.path.dirname(__file__))
from layout import *
from glyphs import classify
import numpy as np

def main():
    ocr = load_json('ocr_q.json')
    res = {}
    glyph_crops = {}
    hicache = {}
    for p in range(0, 4):
        words = ocr[p]['words']
        cells = [w for w in words if re.fullmatch(r'\d{4}', w[0]) and 14 <= w[4] <= 20]
        small = [w for w in words if re.fullmatch(r'\d{1,4}', w[0]) and w[4] <= 14]
        im = render(PDF_Q, p).convert('L')
        g = np.asarray(im)
        # group cells into rows per half
        rows = {}
        for w in cells:
            half = 0 if w[1] < 640 else 1
            key = (half, round(w[2] / 8))
            # merge neighbouring y buckets
            for k in list(rows):
                if k[0] == half and abs(k[1] - round(w[2] / 8)) <= 1:
                    key = k; break
            rows.setdefault(key, []).append(w)
        xmin = {h: min((w[1] for w in cells if (0 if w[1] < 640 else 1) == h), default=None) for h in (0, 1)}
        for (half, _), lst in rows.items():
            xs0 = xmin[half]
            base = None
            for w in lst:
                col = round((w[1] - xs0) / 127)
                if 0 <= col <= 3:
                    base = int(w[0]) - col
                    break
            if base is None: continue
            y = int(np.mean([w[2] for w in lst])); h = 17
            for col in range(4):
                n = base + col
                x = xs0 + 127 * col
                # answer region: right of the number
                ax0, ax1 = x + 50, x + 120
                y0, y1 = y - 6, y + h + 8
                # subjective integer answers live in the small-word list
                sm = [w for w in small if ax0 - 6 <= w[1] <= ax1 and y0 <= w[2] + w[4] / 2 <= y1]
                crop = im.crop((ax0, y0, ax1 - 10, y1))
                ink = (np.asarray(crop) < 170).sum()
                if ink < 15:
                    continue   # empty cell (partial row)
                if sm:
                    txt = ''.join(w[0] for w in sorted(sm, key=lambda w: w[1]))
                    res[n] = {'mc': None, 'num': txt, 'score': 1.0, 'p': p}
                else:
                    d, sc = classify(crop)
                    hi = render(PDF_Q, p, dpi=300).convert('L') if p not in hicache else hicache[p]
                    hicache[p] = hi
                    glyph_crops[n] = np.asarray(hi.crop((ax0 * 2, y0 * 2, (ax1 - 10) * 2, y1 * 2)))
                    res[n] = {'mc': d, 'num': None, 'score': float(sc), 'p': p}
    save_json('answers_table.json', res)
    np.savez_compressed(cache_path('table_glyphs.npz'), **{str(k): v for k, v in glyph_crops.items()})
    nums = sorted(res)
    print(len(nums), 'missing', [n for n in range(1, 1380) if n not in res][:80])
    mc = sum(1 for v in res.values() if v['mc']); print('mc', mc, 'num', len(nums) - mc)
    low = [(n, round(v['score'], 2)) for n, v in res.items() if v['mc'] and v['score'] < 0.8]
    print('lowscore', len(low), low[:40])

if __name__ == '__main__':
    main()
