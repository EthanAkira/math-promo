"""해설 PDF 쪽을 이미지로 저장한다.  printed page N  ==  pdf index N + 3  (표지·정답표 2쪽 제외).
사용: python render_solutions.py   ->  out/sol/sol-NN.png  (회색조 팔레트 PNG)
"""
import os
import pymupdf
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
PDF = r'D:/짱중요한 미적분 1/짱중요한 미적분 1해설.pdf'
OUT = os.path.join(HERE, 'out', 'sol')
os.makedirs(OUT, exist_ok=True)
doc = pymupdf.open(PDF)
FIRST, LAST = 1, doc.page_count - 4   # printed pages 1..56

for n in range(FIRST, LAST + 1):
    idx = n + 3
    if idx >= doc.page_count:
        break
    pm = doc.load_page(idx).get_pixmap(dpi=120)
    im = Image.frombytes('RGB', (pm.width, pm.height), pm.samples).convert('L')
    im = im.point(lambda v: 255 if v > 238 else v).convert('P', palette=Image.ADAPTIVE, colors=32)
    im.save(os.path.join(OUT, f'sol-{n:02d}.png'), optimize=True)
print('saved', len(os.listdir(OUT)))

# 정답표 두 쪽도 보관 (관리자 확인용, 서버 데이터 build 에서 정답 대조에 이미 사용됨)
