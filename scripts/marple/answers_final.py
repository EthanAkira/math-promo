# -*- coding: utf-8 -*-
"""Combine ring-glyph clustering (circled digits) + digit OCR (integer answers) -> answers.json
Cluster->digit mapping was verified by eye on a montage (centroid order from kmeans seed run)."""
import sys, os, re
sys.path.insert(0, os.path.dirname(__file__))
from layout import *
from glyphs import ring_feature
from scipy.cluster.vq import kmeans2
import numpy as np, pytesseract
from PIL import Image
pytesseract.pytesseract.tesseract_cmd = TESS
z = np.load(cache_path('table_glyphs.npz'))
at = load_json('answers_table.json')
ns, X, nonring = [], [], []
for k in z.files:
    r = ring_feature(Image.fromarray(z[k]))
    if r is None: nonring.append(int(k)); continue
    ns.append(int(k)); X.append(r[0].ravel())
X = np.array(X)
best = None
for seed in range(10):
    c, l = kmeans2(X, 5, minit='++', seed=seed)
    ine = ((X - c[l]) ** 2).sum()
    if best is None or ine < best[0]: best = (ine, c, l)
_, c, l = best
# label clusters from template-free prior: identify by the montage-verified glyph shapes using the font templates
from glyphs import TEMPL
def lab(cent):
    sc = {}
    for d, ts in TEMPL.items():
        sc[d] = max(np.corrcoef(cent, t.ravel())[0, 1] for t in ts)
    return max(sc, key=sc.get), sc
mapping = {}
for i in range(5):
    d, sc = lab(c[i]); mapping[i] = d
    print('cluster', i, '->', d, {k: round(v, 2) for k, v in sc.items()})
print('distinct', len(set(mapping.values())))
np.savez(cache_path('ring_centroids.npz'), c=c, digits=np.array([mapping[i] for i in range(5)]))
out = {}
for n, li in zip(ns, l):
    out[n] = {'mc': mapping[int(li)]}
for n in nonring:
    v = at[str(n)]
    txt = v.get('num')
    arr = z[str(n)]
    im = Image.fromarray(arr)
    t2 = pytesseract.image_to_string(im.resize((im.width * 2, im.height * 2)), lang='eng', config='--psm 7 -c tessedit_char_whitelist=0123456789-/').strip()
    out[n] = {'num': t2 or txt, 'num_small': txt}
for n, v in at.items():
    n = int(n)
    if n not in out and v.get('num'): out[n] = {'num': v['num']}
save_json('answers.json', out)
print(len(out), 'mc', sum(1 for v in out.values() if 'mc' in v))
