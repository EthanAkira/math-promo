# -*- coding: utf-8 -*-
"""Assemble the 마플 수능기출 미적분Ⅰ catalog from the OCR/crop caches.
Outputs
  functions/api/marple-calc1/_data/catalog.js    server-side catalog (types + problems, NO images, NO text)
  app/data/csatMarpleCalc1Catalog.json           CSAT unit-browser entries (수능·평가원·교육청 기출 only)
  <cache>/sql/assets_NN.sql                      D1 INSERTs for every question / solution image (id mp-q-NNNN / mp-s-NNNN)
"""
import sys, os, re, json, base64
sys.path.insert(0, os.path.dirname(__file__))
from common import *

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))

# ---- type table -------------------------------------------------------------------------------
# no, id, name, subjectId, unitId, subUnitId, chapterName(for the CSAT detailed-type matcher), grade
TYPES = [
 (1, 'mp-seq-limit',   '수열의 극한의 계산',               'calculus', 'sequence-limits', 'sequence-limits', '수열의 극한', 'g3'),
 (2, 'mp-seq-apps',    '수열의 극한의 활용',               'calculus', 'sequence-limits', 'sequence-limits', '수열의 극한', 'g3'),
 (3, 'mp-geo-limit',   '등비수열의 극한',                  'calculus', 'sequence-limits', 'sequence-limits', '수열의 극한', 'g3'),
 (4, 'mp-series',      '급수와 수열의 극한값',             'calculus', 'sequence-limits', 'series',          '급수', 'g3'),
 (5, 'mp-geo-series',  '등비급수의 수렴과 계산',           'calculus', 'sequence-limits', 'series',          '급수', 'g3'),
 (6, 'mp-geo-apps',    '등비급수의 활용(도형)',            'calculus', 'sequence-limits', 'series',          '급수', 'g3'),
 (7, 'mp-func-limit',  '함수의 극한값과 좌극한·우극한',     'math2',    'limits-continuity', 'function-limits', '함수의 극한', 'g2'),
 (8, 'mp-coeff',       '극한과 미정계수·다항함수의 결정',   'math2',    'limits-continuity', 'function-limits', '함수의 극한', 'g2'),
 (9, 'mp-continuity',  '함수의 연속',                      'math2',    'limits-continuity', 'continuity',      '함수의 연속', 'g2'),
 (10,'mp-derivative',  '미분계수와 미분가능성',            'math2',    'differentiation',   'derivative',      '미분계수', 'g2'),
 (11,'mp-tangent',     '접선의 방정식',                    'math2',    'differentiation',   'tangent',         '접선', 'g2'),
 (12,'mp-extrema',     '증가·감소와 극대·극소',            'math2',    'differentiation',   'extrema',         '극대·극소', 'g2'),
 (13,'mp-applications','최대·최소와 방정식·부등식',        'math2',    'differentiation',   'extrema',         '극대·극소', 'g2'),
 (14,'mp-kinematics',  '속도와 가속도',                    'math2',    'differentiation',   'velocity',        '속도', 'g2'),
 (15,'mp-indefinite',  '부정적분',                         'math2',    'integration',       'indefinite',      '부정적분', 'g2'),
 (16,'mp-definite',    '정적분의 계산과 성질',             'math2',    'integration',       'definite',        '정적분', 'g2'),
 (17,'mp-integral-fn', '정적분으로 정의된 함수',           'math2',    'integration',       'definite',        '정적분', 'g2'),
 (18,'mp-area',        '정적분과 넓이',                    'math2',    'integration',       'area',            '넓이', 'g2'),
 (19,'mp-motion-dist', '속도와 거리(정적분의 활용)',       'math2',    'integration',       'velocity',        '속도와 거리', 'g2'),
]
TYPE_BY_NO = {t[0]: t for t in TYPES}

# (start, end, type no, topic name) -- named 유형 blocks of the book (verified against the solution-header OCR)
NAMED = [
 (1,9,1,'극한의 기본 성질'),(10,29,1,'∞/∞ 꼴의 극한'),(30,41,1,'수열의 일반항과 합의 극한'),(42,55,1,'치환을 이용한 수열의 극한'),
 (56,68,1,'∞−∞ 꼴의 극한'),(69,76,1,'극한의 미정계수 결정'),(77,83,1,'소수부분의 극한값 계산'),(84,92,1,'수열의 극한의 대소 관계'),
 (93,101,1,'수열의 극한의 진위판단'),(102,107,2,'∞/∞ 꼴 극한의 활용'),(108,114,2,'길이에 관한 수열의 극한 활용'),
 (115,123,2,'넓이에 관한 수열의 극한 활용'),(124,134,2,'원의 성질에 관한 수열의 극한 활용'),
 (135,155,3,'등비수열의 극한'),(156,165,3,'등비수열의 일반항과 합의 극한'),(166,168,3,'r^n을 포함한 식의 극한'),
 (169,175,3,'등비수열의 극한의 활용'),(176,183,3,'무한히 반복되는 도형의 극한의 활용'),(184,186,3,'점화식과 등비수열의 극한'),
 (233,263,4,'급수와 수열의 극한값 사이의 관계'),(264,272,4,'급수와 수열의 진위판단'),(273,292,4,'급수의 계산'),
 (293,295,4,'합과 일반항의 급수 계산'),(296,305,4,'급수의 활용'),
 (318,328,5,'등비급수의 수렴조건'),(329,368,5,'등비급수의 계산'),
 (369,372,6,'길이에 관한 등비급수의 활용'),(373,396,6,'넓이에 관한 등비급수의 활용'),(397,404,6,'개수가 일정하게 증가하는 등비급수의 넓이'),
 (441,456,7,'함수의 극한값'),(457,468,7,'그래프에서의 우극한과 좌극한'),(469,478,7,'함수의 극한의 기본 성질'),
 (479,497,7,'유리함수의 극한 계산'),(498,512,7,'무리함수의 극한 계산'),(513,517,7,'극한값의 활용'),
 (518,532,8,'함수의 극한과 미정계수 결정'),(533,552,8,'극한에서 다항함수의 결정'),(553,563,7,'함수의 극한의 활용'),(564,579,7,'그래프를 활용한 함수의 극한'),
 (623,635,9,'함수의 극한과 연속성 이해'),(636,647,9,'연속함수의 미정계수 결정'),(648,649,9,'극한을 포함한 함수의 연속'),
 (650,659,9,'그래프로 주어진 함수의 연속'),(660,661,9,'주기성과 연속성'),(662,689,9,'곱이 연속일 조건'),
 (690,696,9,'그래프로 주어진 합성함수의 연속'),(697,703,9,'두 그래프의 교점에서 연속의 활용'),(704,708,9,'최대·최소 정리와 사잇값 정리'),
 (727,736,10,'미분계수와 평균변화율'),(737,772,10,'미분계수를 이용한 극한값 계산'),(773,781,10,'미분가능'),
 (782,796,10,'미분가능과 미정계수 결정'),(797,798,10,'미분가능과 연속성'),(799,815,10,'미분법의 공식'),(816,834,10,'곱의 미분법'),
 (835,836,10,'미분을 이용한 다항식의 나머지'),
 (870,877,11,'접선의 기울기와 미분계수'),(878,893,11,'접점이 주어진 접선'),(897,907,11,'기울기가 주어진 접선'),
 (908,915,11,'곡선 밖의 점이 주어진 경우의 접선'),(916,916,11,'곡선과 직선이 접할 때 미정계수 결정'),(917,921,11,'접선의 방정식의 활용'),
 (945,952,12,'다항함수의 증가·감소 조건'),(953,965,12,'다항함수의 극대와 극소'),(966,973,12,'극대·극소와 미정계수 결정'),
 (974,977,12,'삼차함수의 극값 조건'),(978,986,12,'도함수의 그래프와 극값'),(987,996,12,'도함수 그래프의 활용'),
 (997,1001,12,'두 다항함수의 도함수 활용'),(1002,1013,12,'대칭성을 갖는 함수의 극대·극소'),(1014,1018,12,'절댓값을 포함한 함수의 미분가능'),
 (1019,1029,13,'다항함수의 최대·최소'),(1030,1035,13,'최대·최소의 활용'),(1066,1070,13,'방정식과 미분'),(1071,1073,13,'부등식과 미분'),
 (1074,1086,14,'속도와 가속도'),(1087,1091,14,'시간에 대한 넓이의 변화율'),
 (1099,1106,15,'부정적분의 정의'),(1107,1109,15,'부정적분의 성질'),(1110,1116,15,'도함수에서 부정적분 구하기'),(1117,1119,15,'부정적분과 도함수'),
 (1120,1134,16,'다항함수의 정적분 계산'),(1135,1142,16,'적분구간이 같은 경우 정적분의 계산'),(1143,1145,16,'절댓값 기호가 있는 정적분의 계산'),
 (1146,1150,16,'정적분을 포함한 식'),(1151,1161,16,'대칭을 이용한 정적분의 계산'),(1162,1166,16,'평행이동을 이용한 정적분의 계산'),(1167,1173,16,'주기함수의 정적분'),
 (1210,1214,17,'정적분으로 표시된 함수의 극한'),(1215,1217,17,'적분구간이 상수인 경우의 함수 결정'),(1218,1224,17,'적분구간이 변수인 정적분의 미분'),
 (1225,1231,17,'적분구간이 변수인 함수의 결정'),(1232,1234,17,'적분변수가 t일 때는 상수로 취급'),(1235,1243,17,'정적분으로 정의된 함수의 그래프 추정'),
 (1244,1247,17,'정적분으로 나타내는 다항함수의 극값'),(1248,1249,17,'정적분에 관한 부등식의 성질'),(1250,1265,17,'정적분과 급수'),
 (1266,1271,17,'정적분과 구분구적법의 활용'),(1272,1276,17,'도형에서 정적분과 급수의 활용'),
 (1297,1304,18,'좌표축과 곡선 사이의 넓이'),(1310,1313,18,'좌표축과 곡선 사이의 넓이의 활용'),(1314,1322,18,'두 곡선 사이의 넓이'),
 (1327,1329,18,'두 곡선 사이의 넓이가 서로 같은 경우'),(1330,1337,18,'역함수로 표현된 정적분의 계산'),
 (1338,1353,19,'속도와 위치의 변화량'),
]
# unnamed (수능 / 평가원 / 교육청 / 사관 / 경찰대 기출, 세트형) blocks: default type per chapter + keyword refinement
MIXED_DEFAULT = [
 (187,232,1),(306,317,4),(405,440,5),(580,622,7),(709,726,9),(837,869,10),(894,896,11),(922,944,11),
 (1036,1065,12),(1092,1098,14),(1174,1209,16),(1277,1296,17),(1305,1309,18),(1323,1326,18),(1354,1379,16),
]
ORIGINS = ['평가원', '교육청', '수능', '사관', '경찰대']
HARD_BLOCKS = [(217,232),(439,440),(868,869),(943,944),(1057,1065),(1201,1209),(1374,1379)]


def keyword_type(n, text, default):
    t = re.sub(r'\s+', '', text or '')
    has = lambda *ws: any(w in t for w in ws)
    if n <= 440:
        if has('급수', '\\sum', 'Σ', '무한등비'):
            return 5 if has('등비') else 4
        if has('넓이', '길이', '정사각형', '원의', '삼각형'):
            return 6 if n > 232 else 2
        if has('등비', 'r^n'):
            return 3
        return default
    if n <= 726:
        if has('연속'):
            return 9
        return default
    if n <= 1098:
        if has('접선', '접하'): return 11
        if has('속도', '가속도', '위치'): return 14
        if has('극대', '극소', '극값', '증가', '감소'): return 12
        if has('최댓값', '최솟값', '실근', '서로다른'): return 13
        if has('미분가능', '미분계수', '평균변화율'): return 10
        return default
    if has('넓이'): return 18
    if has('속도', '거리', '위치', '움직'): return 19
    if has('부정적분') and not has('dt', '넓이'): return 15
    if has('dt', '구분구적', 'Σ', 'sum'): return 17
    return default


def in_ranges(n, rs):
    return any(a <= n <= b for a, b in rs)


def points_from(text):
    if not text:
        return None
    tail = text[-160:]
    m = (re.findall(r'[\[\(【]\s*([2-5])\s*(?:점|저|전|젊)', tail)
         or re.findall(r'([2-5])\s*점\s*[\]\)]', tail)
         or re.findall(r'[\[\(【]\s*([2-5])\s*[aA8]', tail))
    return int(m[-1]) if m else None


def main():
    qmeta = {r['n']: r for r in load_json('q_meta.json')}
    smeta = {r['n']: r for r in load_json('s_meta.json')}
    ans = {int(k): v for k, v in load_json('answers_final.json').items()}
    src = {int(k): v for k, v in load_json('source_class.json').items()}
    qtext = {int(k): v for k, v in load_json('q_text.json').items()}
    named = {}
    for a, b, tno, name in NAMED:
        for n in range(a, b + 1):
            named[n] = (tno, name)
    problems = []
    skipped = []
    for n in range(1, 1380):
        if n not in qmeta or n not in smeta or n not in ans:
            skipped.append(n)
            continue
        if n in named:
            tno, topic = named[n]
        else:
            d = next((t for a, b, t in MIXED_DEFAULT if a <= n <= b), None)
            if d is None:
                skipped.append(n)
                continue
            tno = keyword_type(n, qtext.get(n, ''), d)
            topic = None
        s = src[n]
        cls = s['tag'] or s['sol']
        military = cls in ('사관', '경찰대')
        hard = military or in_ranges(n, HARD_BLOCKS)
        a = ans[n]
        mc = 'mc' in a
        pts = points_from(qtext.get(n, ''))
        label = {'사관': '사관학교 기출', '경찰대': '경찰대 기출', '평가원': '평가원 기출', '교육청': '교육청 기출', '수능': '수능 기출'}.get(cls)
        problems.append({
            'id': f'mp-{n:04d}', 'typeNo': tno, 'number': n,
            'section': '고난도' if hard else '기출', 'sectionCode': 'h' if hard else 'p',
            'source': f'마플 수능기출 미적분Ⅰ {n:04d}번' + (f' · {label}' if label else ''),
            'origin': cls or None, 'topic': topic,
            'kind': 'mcq' if mc else 'short', 'answer': str(a['mc'] if mc else a['num']),
            'points': pts, 'stemImage': f'mp-q-{n:04d}', 'solImage': f'mp-s-{n:04d}',
        })
    types = []
    for t in TYPES:
        no = t[0]
        ps = [p for p in problems if p['typeNo'] == no]
        types.append({'no': no, 'id': t[1], 'name': t[2], 'subject': t[3], 'unit': t[4], 'grade': t[7],
                      'counts': [sum(1 for p in ps if p['sectionCode'] == 'p'), sum(1 for p in ps if p['sectionCode'] == 'h')]})
    cat = {'types': types, 'problems': problems}
    out = os.path.join(ROOT, 'functions/api/marple-calc1/_data')
    os.makedirs(out, exist_ok=True)
    with open(os.path.join(out, 'catalog.js'), 'w', encoding='utf-8') as f:
        f.write('// generated by scripts/marple/build_catalog.py -- metadata + answers only; images live in D1 (mp-q-NNNN / mp-s-NNNN)\n')
        f.write('export default ' + json.dumps(cat, ensure_ascii=False, separators=(',', ':')) + ';\n')
    # CSAT unit-browser entries: only the 수능/평가원/교육청 (+unlabelled) 기출. 사관/경찰대/고난도 go to the 고난도 section.
    unit_major = {'sequence-limits': '수열의 극한', 'limits-continuity': '함수의 극한과 연속', 'differentiation': '미분', 'integration': '적분'}
    topics = []
    rows = []
    for p in problems:
        if p['sectionCode'] != 'p':
            continue
        if p['topic'] and p['topic'] not in topics:
            topics.append(p['topic'])
        rows.append([p['number'], p['typeNo'], 0 if p['kind'] == 'mcq' else 1, int(p['answer']), p['points'] or 0,
                     topics.index(p['topic']) if p['topic'] else -1, ORIGINS.index(p['origin']) if p['origin'] in ORIGINS else -1])
    csat = {'types': [[t[0], t[2], t[3], t[4], t[5], t[6], t[7], unit_major[t[4]]] for t in TYPES], 'topics': topics, 'origins': ORIGINS, 'rows': rows}
    with open(os.path.join(ROOT, 'app/data/csatMarpleCalc1Catalog.json'), 'w', encoding='utf-8') as f:
        json.dump(csat, f, ensure_ascii=False, separators=(',', ':'))
    # D1 asset SQL
    sqld = cache_path('sql')
    os.makedirs(sqld, exist_ok=True)
    for fn in os.listdir(sqld):
        os.remove(os.path.join(sqld, fn))
    state = {'buf': [], 'size': 0, 'part': 0}

    def flush():
        if state['buf']:
            with open(os.path.join(sqld, f"assets_{state['part']:02d}.sql"), 'w', encoding='utf-8') as f:
                f.write('\n'.join(state['buf']) + '\n')
            state['part'] += 1
            state['buf'] = []
            state['size'] = 0

    for p in problems:
        for kind, key in (('q', p['stemImage']), ('s', p['solImage'])):
            path = cache_path(f"out/{kind}/{p['number']:04d}.webp")
            b64 = base64.b64encode(open(path, 'rb').read()).decode()
            # D1 rejects statements over ~100KB (SQLITE_TOOBIG): long images go in as INSERT + appended UPDATEs
            CH = 80_000
            parts = [b64[i:i + CH] for i in range(0, len(b64), CH)] or ['']
            stmts = [f"INSERT OR REPLACE INTO jjang_calc1_assets (id, mime, data) VALUES ('{key}', 'image/webp', '{parts[0]}');"]
            for extra in parts[1:]:
                stmts.append(f"UPDATE jjang_calc1_assets SET data = data || '{extra}' WHERE id = '{key}';")
            for stmt in stmts:
                state['buf'].append(stmt)
                state['size'] += len(stmt)
            if state['size'] > 1_200_000:
                flush()
    flush()
    from collections import Counter
    print('problems', len(problems), 'skipped', len(skipped), skipped)
    print('types', sorted(Counter(p['typeNo'] for p in problems).items()))
    print('sections', Counter(p['sectionCode'] for p in problems), 'csat', len(rows), 'sql parts', state['part'])
    print('mc', sum(1 for p in problems if p['kind'] == 'mcq'), 'pts', Counter(p['points'] for p in problems))


if __name__ == '__main__':
    main()
