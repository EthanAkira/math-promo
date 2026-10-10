"""답지 PDF 쪽을 이미지로 저장한다.  인쇄 쪽 p  ==  pdf index 74 - p  (p = 1..71).
출력: out/gsol/gsol-NN.png"""
import os
import pymupdf
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
PDF = r'D:/짱중요한 기하와벡터/답지.pdf'
OUT = os.path.join(HERE, 'out', 'gsol')
os.makedirs(OUT, exist_ok=True)
doc = pymupdf.open(PDF)
for p in range(1, 72):
    idx = 74 - p
    pm = doc.load_page(idx).get_pixmap(dpi=120)
    im = Image.frombytes('RGB', (pm.width, pm.height), pm.samples).convert('L')
    im = im.point(lambda v: 255 if v > 238 else v).convert('P', palette=Image.ADAPTIVE, colors=32)
    im.save(os.path.join(OUT, f'gsol-{p:02d}.png'), optimize=True)
print('saved', len(os.listdir(OUT)))
