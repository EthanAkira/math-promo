# -*- coding: utf-8 -*-
"""Cut every numbered problem out of the 문제 PDF -> CACHE/out/q/NNNN.webp + q_meta.json"""
import sys, os, re, json
sys.path.insert(0, os.path.dirname(__file__))
from layout import *
import pytesseract
from concurrent.futures import ProcessPoolExecutor
pytesseract.pytesseract.tesseract_cmd = TESS
OUT = cache_path('out/q'); os.makedirs(OUT, exist_ok=True)

def merged_anchors():
    a = load_json('anchors_q.json'); r = load_json('anchors_q_relaxed.json')
    pages = {}
    have = set()
    for pg in a:
        for x in pg['anchors']:
            if pg['p'] >= 4 and re.fullmatch(r'\d{4}', x['text']) and 1 <= int(x['text']) <= 1379:
                pages.setdefault(pg['p'], []).append(dict(x, n=int(x['text']))); have.add(int(x['text']))
    for pg in r:
        for x in pg['anchors']:
            t = x['text']
            if pg['p'] >= 4 and re.fullmatch(r'\d{4}', t) and 1 <= int(t) <= 1379 and int(t) not in have:
                pages.setdefault(pg['p'], []).append(dict(x, n=int(t))); have.add(int(t))
    return pages

def read_tag(im, a, W, divider):
    x0 = a['x'] + a['w'] + 8
    x1 = min(W - 5, x0 + 520) if a['x'] < divider - 100 else W - 5
    if a['x'] < divider - 100: x1 = min(x1, divider - 4)
    crop = im.crop((x0, a['y'] - 6, x1, a['y'] + a['h'] + 8)).convert('L')
    crop = crop.resize((crop.width * 3, crop.height * 3), Image.LANCZOS)
    return pytesseract.image_to_string(crop, lang='kor+eng', config='--psm 7').strip().replace('\n', ' ')

def work(args):
    p, anchors, setwords, setnums = args
    im = render(PDF_Q, p)
    W, H = im.size
    gray = strip_solid_blocks(np.asarray(im.convert('L')))
    div = find_divider(gray) or int(W * 0.5)
    bottom_limit = H - 145
    cols = {0: [], 1: []}
    for a in anchors:
        cols[0 if a['x'] < div - 60 else 1].append(a)
    rmin = min((a['x'] for a in cols[1]), default=None)
    lmin = min((a['x'] for a in cols[0]), default=None)
    r_x0 = (rmin - 28) if rmin is not None else div + 6
    l_x1 = (rmin - 34) if rmin is not None else int(W * 0.5) - 40
    l_x0 = max(0, lmin - 40) if lmin is not None else 0
    results = []
    for c in (0, 1):
        lst = sorted(cols[c], key=lambda a: a['y'])
        if not lst: continue
        cx0 = l_x0 if c == 0 else r_x0
        cx1 = l_x1 if c == 0 else W - 70
        # shared-stem (세트형) headers living in this column
        heads = [w for w in setwords if cx0 <= w[1] <= cx1]
        for i, a in enumerate(lst):
            top = max(0, a['y'] - 10)
            nxt = lst[i + 1]['y'] - 10 if i + 1 < len(lst) else bottom_limit
            # a 세트형 header between this anchor and the next one belongs to the next problem
            for hw in heads:
                if a['y'] < hw[2] < (lst[i + 1]['y'] if i + 1 < len(lst) else 99999):
                    nxt = min(nxt, hw[2] - 30)
            ext = content_extent(gray, cx0, cx1, top, max(top + 20, nxt), gap=330, min_ink=3)
            bot = (ext[1] + 14) if ext else top + a['h'] + 20
            bot = min(bot, nxt if nxt > top + 20 else bot)
            pieces = []
            # preface: a 세트형 header directly above this anchor (or the previous one's)
            pre = None
            for hw in heads:
                prev_y = lst[i - 1]['y'] if i > 0 else 150
                if prev_y < hw[2] < a['y']:
                    pre = (max(150, hw[2] - 30), a['y'] - 10)
            if pre is None and i > 0:
                # second member of a set: re-use the stem above the previous anchor
                for hw in heads:
                    pprev_y = lst[i - 2]['y'] if i > 1 else 150
                    if pprev_y < hw[2] < lst[i - 1]['y']:
                        # only if the header's printed range mentions this number
                        near = [int(w[0]) for w in setnums if abs(w[2] - hw[2]) < 40]
                        if a['n'] in near:
                            pre = (max(150, hw[2] - 30), lst[i - 1]['y'] - 10)
            if pre:
                pieces.append((pre[0], pre[1]))
            pieces.append((top, bot))
            xa, xb = horiz_extent(gray, cx0, cx1, top, bot)
            xa = max(cx0, xa - 14); xb = min(cx1, xb + 14)
            if pre:
                pa, pb = horiz_extent(gray, cx0, cx1, pre[0], pre[1])
                xa = min(xa, max(cx0, pa - 14)); xb = max(xb, min(cx1, pb + 14))
            hs = [b - t for t, b in pieces]
            canvas = Image.new('L', (xb - xa, sum(hs)), 255)
            yy = 0
            g = Image.fromarray(gray)
            for (t, b) in pieces:
                canvas.paste(g.crop((xa, t, xb, b)), (0, yy)); yy += b - t
            fn = f"{a['n']:04d}.webp"
            save_webp(canvas, os.path.join(OUT, fn))
            tag = read_tag(im, a, W, div)
            results.append({'n': a['n'], 'p': p, 'col': c, 'y': a['y'], 'x': a['x'], 'w': canvas.width, 'h': canvas.height,
                            'leftover': (ext[2] if ext else 0), 'tag': tag, 'set': bool(pre), 'bytes': os.path.getsize(os.path.join(OUT, fn))})
    return results

setwords_numbers = {}
if __name__ == '__main__':
    pages = merged_anchors()
    ocr = load_json('ocr_q.json')
    sw = {}
    for pg in ocr:
        sw[pg['p']] = [w for w in pg['words'] if '세트' in w[0]]
        setwords_numbers[pg['p']] = [w for w in pg['words'] if re.fullmatch(r'\d{4}', w[0])]
    jobs = [(p, pages[p], sw.get(p, []), setwords_numbers.get(p, [])) for p in sorted(pages)]
    allres = []
    with ProcessPoolExecutor(max_workers=6) as ex:
        for i, r in enumerate(ex.map(work, jobs)):
            allres += r
            if i % 40 == 0: print(i, len(jobs), flush=True)
    allres.sort(key=lambda r: r['n'])
    save_json('q_meta.json', allres)
    print('problems', len(allres), 'MB', sum(r['bytes'] for r in allres) / 1e6)
