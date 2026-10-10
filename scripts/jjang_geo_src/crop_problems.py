"""geo_segments.json 의 영역으로 문항 이미지를 잘라 out/geo_problems/geo-TT-NN.png 로 저장한다.
리본(기출문제 맛보기 등) 색 띠와 아래쪽 여백은 자동으로 잘라낸다."""
import json, os
import numpy as np
import pymupdf
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'out')
PDF = r'D:/짱중요한 기하와벡터/기하와 벡터 문제.pdf'
DPI_SEG, DPI = 130, 150
K = DPI / DPI_SEG

os.makedirs(os.path.join(OUT, 'geo_problems'), exist_ok=True)
doc = pymupdf.open(PDF)
segs = json.load(open(os.path.join(OUT, 'geo_segments.json'), encoding='utf-8'))
pages = {}


def page(idx):
    if idx not in pages:
        pm = doc.load_page(idx).get_pixmap(dpi=DPI)
        pages[idx] = np.array(Image.frombytes('RGB', (pm.width, pm.height), pm.samples))
    return pages[idx]


total = 0
for s in segs:
    a = page(s['idx'])
    x0 = max(0, int((s['x0'] - 8) * K)); x1 = int((s['x1'] - 10) * K)
    y0 = max(0, int(s['y0'] * K)); y1 = min(a.shape[0], int(s['y1'] * K))
    box = a[y0:y1, x0:x1]
    mx = box.max(axis=2).astype(int); mn = box.min(axis=2).astype(int)
    sat = (mx - mn) > 28
    # first coloured band (ribbon) below the problem number row => cut there
    cut = None
    for y in range(int(70 * K / 1.15), box.shape[0]):
        if sat[y].mean() > 0.22:
            cut = y - 4
            break
    if cut:
        box = box[:cut]
    gray = box.min(axis=2)
    rows = np.where((gray < 200).sum(axis=1) > 0)[0]
    # ignore the stray vertical divider (very thin & tall): require rows with >2 dark pixels
    rows = np.where((gray < 200).sum(axis=1) > 2)[0]
    end = (rows.max() + 14) if len(rows) else box.shape[0]
    box = box[:min(end, box.shape[0])]
    im = Image.fromarray(box).convert('L')
    im = im.point(lambda v: 255 if v > 232 else v).convert('P', palette=Image.ADAPTIVE, colors=24)
    im.save(os.path.join(OUT, 'geo_problems', f"geo-{s['type']:02d}-{s['number']:02d}.png"), optimize=True)
    total += 1
print('saved', total)
