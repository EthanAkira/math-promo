"""문제 PDF 쪽에서 문항 번호(굵은 파란 숫자)를 찾아 문항별 영역을 자른다.
출력: out/geo_problems/<type>-<NN>.png + out/geo_segments.json (type, number, page idx, box, section, sourceStrip)
"""
import json, os, sys
import numpy as np
import pymupdf
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
PDF = r'D:/짱중요한 기하와벡터/기하와 벡터 문제.pdf'
OUT = os.path.join(HERE, 'out')
os.makedirs(os.path.join(OUT, 'geo_problems'), exist_ok=True)
os.makedirs(os.path.join(OUT, 'strips'), exist_ok=True)

INTRO = {1: 98, 2: 92, 3: 86, 4: 80, 5: 74, 6: 68, 7: 64, 8: 58, 9: 54, 10: 50, 11: 44, 12: 36, 13: 30, 14: 24, 15: 18, 16: 12, 17: 6}
COUNTS = {1: 23, 2: 26, 3: 25, 4: 25, 5: 30, 6: 19, 7: 30, 8: 20, 9: 18, 10: 26, 11: 29, 12: 30, 13: 28, 14: 30, 15: 29, 16: 29, 17: 24}
DPI = 130

doc = pymupdf.open(PDF)


def pages_of(t):
    hi = INTRO[t] - 1
    lo = (INTRO[t + 1] + 1) if t < 17 else 2
    return [i for i in range(hi, lo - 1, -1) if i != 75]  # logical order = descending pdf index (75 = 읽을거리 page)


def render(idx):
    pm = doc.load_page(idx).get_pixmap(dpi=DPI)
    return np.array(Image.frombytes('RGB', (pm.width, pm.height), pm.samples))


def is_numblue(arr):
    r, g, b = arr[..., 0].astype(int), arr[..., 1].astype(int), arr[..., 2].astype(int)
    return (b > 150) & (b - r > 40) & (b - g > 25)


def find_columns(img):
    h, w, _ = img.shape
    # vertical divider near the middle; columns: left [margin, mid], right [mid, w-margin]
    mid = w // 2
    return [(int(w * 0.04), mid - 4), (mid + 4, int(w * 0.97))]


from scipy import ndimage as ndi


def detect_numbers_all(img, relaxed=False):
    """Bold two-digit problem numbers, found by stroke thickness (survives 3x3 erosion), per column.
    Works whether the scan printed them blue or black, and for any horizontal page offset."""
    h, w, _ = img.shape
    gray = img.astype(int).min(axis=2)
    ink = gray < (195 if relaxed else 165)
    er = ndi.binary_erosion(ink, structure=np.ones((3, 3)))
    lab, n = ndi.label(ndi.binary_dilation(er, structure=np.ones((3, 3))))
    objs = ndi.find_objects(lab)
    mid = w // 2
    cands = []
    for k, sl in enumerate(objs):
        y0, y1 = sl[0].start, sl[0].stop
        x0, x1 = sl[1].start, sl[1].stop
        if (11 if relaxed else 13) <= y1 - y0 <= 34 and 6 <= x1 - x0 <= 40 and int(h * 0.077) < y0 < int(h * 0.93):
            cands.append((x0, y0, x1, y1))
    result = {0: [], 1: []}
    for ci in (0, 1):
        col = [c for c in cands if (c[0] < mid - 10) == (ci == 0) and (ci == 1 or c[0] < mid) and (ci == 0 or c[0] > mid)]
        if not col:
            continue
        bins = {}
        for c in col:
            bins.setdefault(c[0] // 8, []).append(c)
        # the left edge shared by the most bold glyphs = where problem numbers start
        best = max(bins.items(), key=lambda kv: len(kv[1]) + (len(bins.get(kv[0] + 1, [])) + len(bins.get(kv[0] - 1, []))))
        L = int(np.median([c[0] for c in best[1]]))
        left = [c for c in col if abs(c[0] - L) <= (22 if relaxed else 12)]
        left.sort(key=lambda c: c[1])
        runs = []
        for c in left:
            if runs and c[1] - runs[-1][0] < 30:
                runs[-1][1] = max(runs[-1][1], c[3])
            else:
                runs.append([c[1], c[3]])
        result[ci] = [(a, b) for a, b in runs if b - a >= 14]
        result[ci + 2] = L
    return result


def detect_numbers(img, x0, x1):
    raise NotImplementedError


def ribbons(img, x0, x1):
    """y ranges of coloured ribbons (wide coloured band) in a column."""
    r, g, b = img[..., 0].astype(int), img[..., 1].astype(int), img[..., 2].astype(int)
    sat = (np.max(img, axis=2).astype(int) - np.min(img, axis=2).astype(int)) > 40
    h = img.shape[0]
    out = []
    cur = None
    for y in range(int(h * 0.05), int(h * 0.93)):
        row = sat[y, x0 + 20:x1 - 20]
        hit = row.sum() > (x1 - x0) * 0.35
        if hit:
            cur = [y, y] if cur is None else [cur[0], y]
        elif cur is not None:
            out.append(tuple(cur)); cur = None
    if cur is not None:
        out.append(tuple(cur))
    res = []
    for y0, y1 in out:
        if y1 - y0 < 12:
            continue
        seg = img[y0:y1 + 1, x0 + 20:x1 - 20].reshape(-1, 3).astype(int)
        m = seg[(seg.max(axis=1) - seg.min(axis=1)) > 40].mean(axis=0)
        res.append((y0, y1, tuple(int(v) for v in m)))
    return res


def classify(color):
    r, g, b = color
    if g > r + 20 and b > r + 20 and g > 120:   # teal / cyan  -> 예상
        return 'e'
    if r > 110 and b > 130 and g < r - 10:      # purple      -> 기출
        return 'p'
    return 'b'                                   # lavender    -> 기본


# pages whose problem numbers are printed in black (scan processed differently): positions measured by hand
MANUAL = {
    70: [(0, 135), (0, 405), (0, 780), (0, 1090), (1, 130), (1, 565), (1, 1090)],
    16: [(0, 133), (0, 872), (1, 140), (1, 645), (1, 1010)],
    40: [(0, 128), (0, 757), (1, 130), (1, 630)],
    42: [(0, 128), (0, 733), (1, 132), (1, 775)],
}


def clean(nums):
    # drop ribbon-text false hits: a real problem is always far taller than 90px
    out = []
    for i, r in enumerate(nums):
        if i + 1 < len(nums) and nums[i + 1][0] - r[0] < 90:
            continue
        out.append(r)
    return out


segments = []
report = []
for t in range(1, 18):
    expected = COUNTS[t]
    found = []   # (pdf_idx, col, y0, y1(next boundary), ribbon_before)
    for relaxed in (False, True):
      found = []
      for idx in pages_of(t):
          img = render(idx)
          h = img.shape[0]
          cols = find_columns(img)
          allnums = detect_numbers_all(img, relaxed)
          for ci, (x0, x1) in enumerate(cols):
              nums = clean(allnums[ci])
              rib = ribbons(img, x0, x1)
              for k, (ny0, ny1) in enumerate(nums):
                  nxt = nums[k + 1][0] if k + 1 < len(nums) else int(h * 0.93)
                  # stop before a ribbon that sits between this problem and the next
                  end = nxt - 8
                  for ry0, ry1, rc in rib:
                      if ny1 < ry0 < nxt:
                          end = min(end, ry0 - 4)
                  # section = colour of the closest ribbon above this number (within the column), else inherit
                  above = [(ry1, rc) for ry0, ry1, rc in rib if ry1 < ny0 and ny0 - ry1 < 120]
                  sec = classify(max(above)[1]) if above else None
                  found.append({'idx': idx, 'col': ci, 'x0': x0, 'x1': x1, 'y0': ny0 - 14, 'y1': end, 'sec': sec})
      if len(found) == expected:
        break
    status = 'OK' if len(found) == expected else f'MISMATCH found={len(found)} expected={expected}'
    report.append((t, status))
    cur_sec = 'b'
    for n, f in enumerate(found, start=1):
        if f['sec']:
            cur_sec = f['sec']
        f['sec'] = cur_sec
        f['type'] = t
        f['number'] = n
        segments.append(f)

for t, s in report:
    print(t, s)
json.dump(segments, open(os.path.join(OUT, 'geo_segments.json'), 'w'), ensure_ascii=False)
print('segments', len(segments))
