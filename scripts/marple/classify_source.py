# -*- coding: utf-8 -*-
import sys, re
sys.path.insert(0, 'scripts/marple')
from common import *
from collections import Counter
tags = load_json('tags2.json'); tags1 = {r['n']: r['tag'] for r in load_json('q_meta.json')}
t1 = load_json('topics.json'); t2 = load_json('topics2.json')
def hang(s): return re.sub(r'[^가-힣]', '', s)
def klass(texts):
    j = ' '.join(texts)
    h = hang(j)
    if '사관' in h or '사판' in h: return '사관'
    if '경찰' in h or '경칠' in h: return '경찰대'
    if '평가원' in h: return '평가원'
    if '교육청' in h: return '교육청'
    if '수능' in h: return '수능'
    return None
out = {}
for n in range(1, 1380):
    tg = [tags1.get(n, '')] + tags.get(str(n), [])
    k = klass(tg)
    sol = klass([t1[str(n)]] + t2[str(n)])
    out[n] = {'tag': k, 'sol': sol}
c = Counter((v['tag'], v['sol']) for v in out.values())
for k, v in sorted(c.items(), key=lambda x: -x[1]): print(k, v)
save_json('source_class.json', out)
