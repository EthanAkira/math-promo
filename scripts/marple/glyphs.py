# -*- coding: utf-8 -*-
"""Circled-digit (① … ⑤) recogniser: binarise a small crop, normalise, correlate with font-rendered templates."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage

CIRC = '①②③④⑤'
SZ = 32

def _norm(binimg):
    """binimg: 2-D bool array of ink. Crop to bbox, pad to square, resize SZxSZ."""
    ys, xs = np.nonzero(binimg)
    if ys.size == 0: return None
    crop = binimg[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    h, w = crop.shape; s = max(h, w)
    sq = np.zeros((s, s), bool); sq[(s - h) // 2:(s - h) // 2 + h, (s - w) // 2:(s - w) // 2 + w] = crop
    im = Image.fromarray((sq * 255).astype(np.uint8)).resize((SZ, SZ), Image.LANCZOS)
    a = np.asarray(im).astype(float) / 255
    return ndimage.gaussian_filter(a, 0.8)

def _templates():
    t = {}
    for fname in ('malgun.ttf', 'batang.ttc', 'gulim.ttc', 'arialuni.ttf'):
        path = 'C:/Windows/Fonts/' + fname
        if not os.path.exists(path): continue
        font = ImageFont.truetype(path, 64)
        for i, ch in enumerate(CIRC):
            im = Image.new('L', (120, 120), 0)
            ImageDraw.Draw(im).text((20, 20), ch, font=font, fill=255)
            b = np.asarray(im) > 128
            n = _norm(b)
            if n is not None and b.sum() > 200:
                t.setdefault(i + 1, []).append(n)
    return t
TEMPL = _templates()

def classify(gray_crop, thr=170):
    """-> (digit 1..5 or None, score, is_circle_like). gray_crop: PIL 'L' image containing ONE circled digit."""
    a = np.asarray(gray_crop) < thr
    blob = a
    nm = _norm(blob)
    if nm is None: return None, 0.0
    best = (None, -1.0)
    for d, ts in TEMPL.items():
        for t in ts:
            c = np.corrcoef(nm.ravel(), t.ravel())[0, 1]
            if c > best[1]: best = (d, c)
    return best

def ring_feature(gray_crop, thr=170, lo=26, hi=50):
    """Find the circle blob (14-24px, ~square) in a crop; return its normalised interior+ring array or None."""
    a = np.asarray(gray_crop) < thr
    if a.size == 0: return None
    lab, n = ndimage.label(a, structure=np.ones((3, 3)))
    best = None
    for i, sl in enumerate(ndimage.find_objects(lab)):
        h = sl[0].stop - sl[0].start; w = sl[1].stop - sl[1].start
        if lo <= h <= hi and lo <= w <= hi and abs(h - w) <= 6:
            area = (lab[sl] == i + 1).sum()
            if area < 0.55 * h * w:     # a ring, not a filled blob
                best = (sl, h, w); break
    if best is None: return None
    sl = best[0]
    box = a[sl]
    return _norm(box), (sl[0].start, sl[1].start)
