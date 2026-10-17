# -*- coding: utf-8 -*-
"""Reconcile table answers with solution-header answers -> answers_final.json {n: {'mc':d}|{'num':str}, 'src':..}"""
import sys, os, re
sys.path.insert(0, os.path.dirname(__file__))
from layout import *
from glyphs import ring_feature
from scipy.cluster.vq import kmeans2
import numpy as np, pytesseract
from collections import Counter
from PIL import Image
pytesseract.pytesseract.tesseract_cmd = TESS
T = load_json('answers.json')
z = np.load(cache_path('sol_glyphs.npz'))
ns, X, other = [], [], []
for k in z.files:
    img = Image.fromarray(z[k])
    r = ring_feature(img)
    if r is None: other.append(int(k)); continue
    ns.append(int(k)); X.append(r[0].ravel())
X = np.array(X)
best = None
for seed in range(10):
    c, l = kmeans2(X, 5, minit='++', seed=seed)
    ine = ((X - c[l]) ** 2).sum()
    if best is None or ine < best[0]: best = (ine, c, l)
_, c, l = best
# map each solution cluster to a digit by majority of the table's circled digits
cmap = {}
for i in range(5):
    votes = Counter(T[str(n)]['mc'] for n, li in zip(ns, l) if li == i and str(n) in T and 'mc' in T[str(n)])
    cmap[i] = votes.most_common(1)[0][0]
    tot = sum(votes.values()); print('sol cluster', i, '->', cmap[i], dict(votes), 'purity', round(votes.most_common(1)[0][1] / tot, 3))
assert len(set(cmap.values())) == 5
S = {n: {'mc': cmap[int(li)]} for n, li in zip(ns, l)}
def ocr_num(arr):
    a = np.asarray(arr)[:72]
    ink = a < 150
    cols = np.flatnonzero(ink.sum(axis=0) >= 2)
    if cols.size == 0: return ''
    # first contiguous group of columns (the number), stop at a big gap
    end = cols[0]
    for c in cols[1:]:
        if c - end > 40: break
        end = c
    img = Image.fromarray(a[:, max(0, cols[0] - 10):end + 12])
    big = Image.new('L', (img.width + 60, img.height + 40), 255); big.paste(img, (30, 20))
    big = big.resize((big.width * 2, big.height * 2), Image.LANCZOS)
    return pytesseract.image_to_string(big, lang='eng', config='--psm 7 -c tessedit_char_whitelist=0123456789').strip()
for n in other:
    S[n] = {'num': ocr_num(z[str(n)])}
out = {}; conflicts = []
for n in range(1, 1380):
    s = S.get(n); t = T.get(str(n))
    if s is None and t is None: continue
    if s and 'mc' in s:
        if t and 'mc' in t and t['mc'] != s['mc']:
            conflicts.append((n, t, s)); out[n] = {'mc': t['mc'], 'src': 'table-over-sol'}
        else: out[n] = {'mc': s['mc'], 'src': 'sol'}
    elif s and 'num' in s and s['num']:
        out[n] = {'num': s['num'], 'src': 'sol'}
        if t and t.get('num') and t['num'] != s['num']: conflicts.append((n, t, s))
    elif t:
        out[n] = dict(t, src='table')
save_json('answers_final.json', out)
print(len(out), 'mc', sum(1 for v in out.values() if 'mc' in v), 'conflicts', len(conflicts)); print(conflicts[:40])
