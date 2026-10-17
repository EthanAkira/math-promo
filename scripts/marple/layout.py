# -*- coding: utf-8 -*-
import io, os, sys, re
sys.path.insert(0, os.path.dirname(__file__))
from common import *
import numpy as np, pymupdf
from PIL import Image
from scipy import ndimage

DPI = 150
_docs = {}

def render(pdf, p, dpi=DPI):
    d = _docs.get(pdf)
    if d is None:
        d = _docs[pdf] = pymupdf.open(pdf)
    pix = d[p].get_pixmap(dpi=dpi)
    return Image.open(io.BytesIO(pix.tobytes('png'))).convert('RGB').rotate(180, expand=True)

def find_divider(gray, default=None):
    """x of the dotted vertical line between the two columns (None if not found)."""
    H, W = gray.shape
    lo, hi = int(W * 0.42), int(W * 0.58)
    band = gray[int(H * 0.12):int(H * 0.9), lo:hi] < 205
    cnt = band.sum(axis=0).astype(float)
    k = np.ones(3) / 3
    sm = np.convolve(cnt, k, mode='same')
    i = int(sm.argmax())
    neigh = np.r_[sm[max(0, i - 8):max(0, i - 3)], sm[i + 4:i + 9]]
    if neigh.size and sm[i] > 3.0 * (neigh.mean() + 1) and sm[i] > 60:
        return lo + i
    return default

def content_extent(gray, x0, x1, y0, y1, gap=110, thr=190, min_ink=2):
    """Vertical extent [top, bottom] of the first contiguous ink cluster in the window
    (clusters closer than `gap` px merge). Returns (top, bottom, leftover_ink_rows)."""
    win = gray[y0:y1, x0:x1] < thr
    rows = win.sum(axis=1) >= min_ink
    ys = np.flatnonzero(rows)
    if ys.size == 0:
        return None
    top = ys[0]; bot = ys[0]; leftover = 0
    for y in ys[1:]:
        if y - bot <= gap and leftover == 0:
            bot = y
        else:
            leftover += 1
    return y0 + top, y0 + bot, leftover

def horiz_extent(gray, x0, x1, y0, y1, thr=190):
    win = gray[y0:y1, x0:x1] < thr
    cols = np.flatnonzero(win.sum(axis=0) >= 1)
    if cols.size == 0: return x0, x1
    runs = []; start = cols[0]; prev = cols[0]
    for c in cols[1:]:
        if c - prev > 14:
            runs.append((start, prev)); start = c
        prev = c
    runs.append((start, prev))
    # drop thin isolated slivers (dotted column divider, neighbouring-column edge)
    keep = [r for r in runs if r[1] - r[0] >= 8] or runs
    return x0 + keep[0][0], x0 + keep[-1][1]

def save_webp(img, path, quality=62):
    img.save(path, 'WEBP', quality=quality, method=6)

def strip_solid_blocks(gray, thr=215, se=(41, 17), grow=14):
    """Whiten big solid blobs (chapter side tabs, scanner shadow bands) that survive a
    large erosion; text strokes and figures never do."""
    mask = gray < thr
    core = ndimage.binary_erosion(mask, structure=np.ones(se))
    if not core.any():
        return gray
    blob = ndimage.binary_dilation(core, structure=np.ones((se[0] + grow, se[1] + grow)), iterations=1)
    blob &= (gray < 235)
    out = gray.copy()
    out[blob] = 255
    return out
