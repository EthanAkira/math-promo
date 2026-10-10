"""그림/문제 이미지 자르기. specs.json 의 "쌍시작쪽:L|R:x0,y0,x1,y1" (쌍 이미지 표시좌표, 가로 2000 기준)를 PDF 원본 좌표로 변환해 PNG 로 저장한다.
사용: python crop_figures.py [id접두어]   (기본: 전체)
"""
import json, sys, os
import pymupdf
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
PDF = r'D:/짱중요한 미적분 1/짱중요한 미적분 1묹제.pdf'
OUT = os.path.join(HERE, 'out', 'figs')
os.makedirs(OUT, exist_ok=True)
DPI_REF = 125   # 좌표를 잡은 미리보기 해상도
DPI_OUT = 170   # 실제 저장 해상도

prefix = sys.argv[1] if len(sys.argv) > 1 else ''
specs = json.load(open(os.path.join(HERE, 'out', 'specs.json'), encoding='utf-8'))
doc = pymupdf.open(PDF)
cache = {}

def page_img(idx):
    if idx not in cache:
        pm = doc.load_page(idx).get_pixmap(dpi=DPI_OUT)
        cache[idx] = Image.frombytes('RGB', (pm.width, pm.height), pm.samples)
    return cache[idx]

def crop_one(spec):
    start, side, box = spec.split(':')
    start = int(start)
    x0, y0, x1, y1 = [float(v) for v in box.split(',')]
    left = page_img(start)
    right = page_img(start + 1)
    comp_w = left.width + right.width            # 쌍 이미지의 실제 폭 (DPI_OUT 기준)
    f = comp_w / 2000.0                          # 표시좌표 -> 실제 픽셀
    X0, Y0, X1, Y1 = x0 * f, y0 * f, x1 * f, y1 * f
    page = left if side == 'L' else right
    if side == 'R':
        X0 -= left.width
        X1 -= left.width
    X0, X1 = max(0, X0), min(page.width, X1)
    Y0, Y1 = max(0, Y0), min(page.height, Y1)
    return page.crop((int(X0), int(Y0), int(X1), int(Y1))).convert('L')

for item in specs:
    if not item['id'].startswith(prefix):
        continue
    parts = [crop_one(part) for part in item['spec'].split(';')]   # ';' 로 여러 영역을 세로로 이어 붙인다
    width = max(p.width for p in parts)
    height = sum(p.height for p in parts) + 6 * (len(parts) - 1)
    crop = Image.new('L', (width, height), 255)
    y = 0
    for part in parts:
        crop.paste(part, (0, y))
        y += part.height + 6
    # 회색조 + 팔레트 압축 (용량 절감)
    crop = crop.point(lambda v: 255 if v > 235 else v).convert('P', palette=Image.ADAPTIVE, colors=24)
    crop.save(os.path.join(OUT, item['id'] + '.png'), optimize=True)
print('saved', len([s for s in specs if s['id'].startswith(prefix)]))
