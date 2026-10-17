# -*- coding: utf-8 -*-
"""Cut every numbered solution out of the 풀이와 정답 PDF (stitching solutions that run over to the next
column / page) -> CACHE/out/s/NNNN.webp, CACHE/out/sh/NNNN.png (header row), s_meta.json"""
import sys, os, re, json
sys.path.insert(0, os.path.dirname(__file__))
from layout import *
import pytesseract
from concurrent.futures import ProcessPoolExecutor
pytesseract.pytesseract.tesseract_cmd = TESS
OUT = cache_path('out/s'); HDR = cache_path('out/sh')
os.makedirs(OUT, exist_ok=True); os.makedirs(HDR, exist_ok=True)
TOP_LIMIT = 158

def merged_anchors():
    a = load_json('anchors_s.json'); r = load_json('anchors_s_relaxed.json')
    pages = {}; have = set()
    for src in (a, r):
        for pg in src:
            for x in pg['anchors']:
                t = x['text']
                if re.fullmatch(r'\d{4}', t) and 1 <= int(t) <= 1379 and int(t) not in have:
                    pages.setdefault(pg['p'], []).append(dict(x, n=int(t))); have.add(int(t))
    return pages

def page_columns(anchors, W, defaults):
    """-> {col: (x0, x1, [anchors sorted by y])} for col 0 and 1 using anchors or global defaults."""
    cols = {0: [], 1: []}
    for a in anchors:
        cols[0 if a['x'] < W * 0.5 - 60 else 1].append(a)
    rmin = min((a['x'] for a in cols[1]), default=None)
    lmin = min((a['x'] for a in cols[0]), default=None)
    if rmin is None: rmin = defaults['r']
    if lmin is None: lmin = defaults['l']
    res = {}
    res[0] = (max(0, lmin - 40), rmin - 34, sorted(cols[0], key=lambda a: a['y']))
    res[1] = (rmin - 28, W - 70, sorted(cols[1], key=lambda a: a['y']))
    return res

def work(args):
    """Return per-column raw material: segments (anchor n -> (page,col,x0,x1,top,bot)) and head fragments."""
    p, anchors, defaults = args
    im = render(PDF_S, p)
    W, H = im.size
    gray = strip_solid_blocks(np.asarray(im.convert('L')))
    bottom_limit = H - 145
    cols = page_columns(anchors, W, defaults)
    out = []
    for c in (0, 1):
        x0, x1, lst = cols[c]
        rec = {'p': p, 'col': c, 'x0': x0, 'x1': x1, 'anchors': [], 'head': None, 'W': W, 'H': H}
        first_y = lst[0]['y'] - 10 if lst else bottom_limit
        # fragment above the first anchor (continuation of the previous solution)
        if first_y - TOP_LIMIT > 20:
            ext = content_extent(gray, x0, x1, TOP_LIMIT, first_y, gap=330, min_ink=3)
            if ext:
                rec['head'] = {'top': int(ext[0]), 'bot': int(min(ext[1] + 12, first_y)), 'reach': bool(ext[1] >= first_y - 40)}
        for i, a in enumerate(lst):
            top = max(0, a['y'] - 10)
            nxt = lst[i + 1]['y'] - 10 if i + 1 < len(lst) else bottom_limit
            ext = content_extent(gray, x0, x1, top, max(top + 20, nxt), gap=330, min_ink=3)
            bot = int(ext[1] + 12) if ext else top + a['h'] + 20
            bot = min(bot, nxt) if nxt > top + 20 else bot
            rec['anchors'].append({'n': a['n'], 'y': int(a['y']), 'x': int(a['x']), 'w': int(a['w']), 'h': int(a['h']), 'top': int(top), 'bot': int(bot),
                                   'reach': bool(bot >= bottom_limit - 70), 'last': i + 1 == len(lst)})
        out.append(rec)
    return out

def render_piece(p, x0, x1, top, bot):
    im = render(PDF_S, p)
    gray = strip_solid_blocks(np.asarray(im.convert('L')))
    xa, xb = horiz_extent(gray, x0, x1, top, bot)
    xa = max(x0, xa - 14); xb = min(x1, xb + 14)
    return Image.fromarray(gray).crop((xa, top, xb, bot)), im

def assemble(job):
    n, pieces, hdr = job   # pieces: [(p,x0,x1,top,bot)]
    imgs = [render_piece(*pc)[0] for pc in pieces]
    Wc = max(i.width for i in imgs); Hc = sum(i.height for i in imgs)
    canvas = Image.new('L', (Wc, Hc), 255); y = 0
    for i in imgs:
        canvas.paste(i, (0, y)); y += i.height
    fn = os.path.join(OUT, f'{n:04d}.webp'); save_webp(canvas, fn)
    # header row crop (for the answer box / topic OCR): whole header line of first piece
    p, x0, x1, top, bot = pieces[0]
    im = render(PDF_S, p)
    row = im.convert('L').crop((x0, top, x1, min(bot, top + hdr)))
    row.save(os.path.join(HDR, f'{n:04d}.png'))
    return {'n': n, 'w': canvas.width, 'h': canvas.height, 'pieces': len(pieces), 'bytes': os.path.getsize(fn)}

if __name__ == '__main__':
    pages = merged_anchors()
    allp = sorted(pages)
    lo, hi = allp[0], allp[-1]
    # defaults for anchor-less columns: median anchor x
    lx = sorted(a['x'] for v in pages.values() for a in v if a['x'] < 400)
    rx = sorted(a['x'] for v in pages.values() for a in v if a['x'] >= 400)
    defaults = {'l': lx[len(lx) // 2], 'r': rx[len(rx) // 2]}
    jobs = [(p, pages.get(p, []), defaults) for p in range(lo, hi + 1)]
    recs = []
    with ProcessPoolExecutor(max_workers=6) as ex:
        for i, r in enumerate(ex.map(work, jobs)):
            recs += r
            if i % 60 == 0: print('seg', i, len(jobs), flush=True)
    # reading order: pdf page descending, left col then right col
    recs.sort(key=lambda r: (-r['p'], r['col']))
    pieces = {}      # n -> [(p,x0,x1,top,bot)]
    last = None      # previous problem number + whether it ran to the bottom of its column
    order_notes = []
    for r in recs:
        if r['head'] and last is not None and last[1]:
            pieces[last[0]].append((r['p'], r['x0'], r['x1'], r['head']['top'], r['head']['bot']))
            # a fragment that itself runs to the column bottom keeps the chain alive
            last = (last[0], r['head']['reach'])
        elif r['head']:
            order_notes.append(('orphan-head', r['p'], r['col']))
        for a in r['anchors']:
            pieces.setdefault(a['n'], []).append((r['p'], r['x0'], r['x1'], a['top'], a['bot']))
            last = (a['n'], a['reach'] and a['last'])
    print('orphan heads', len(order_notes), order_notes[:20])
    jobs2 = [(n, pc, 60) for n, pc in sorted(pieces.items())]
    metas = []
    with ProcessPoolExecutor(max_workers=6) as ex:
        for i, m in enumerate(ex.map(assemble, jobs2)):
            metas.append(m)
            if i % 200 == 0: print('asm', i, len(jobs2), flush=True)
    save_json('s_meta.json', metas)
    print('solutions', len(metas), 'MB', sum(m['bytes'] for m in metas) / 1e6, 'multi', sum(1 for m in metas if m['pieces'] > 1))
