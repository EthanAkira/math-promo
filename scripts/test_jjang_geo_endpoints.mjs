// 엔드포인트 스모크 테스트 (모의 D1): node scripts/test_jjang_endpoints.mjs
import { onRequestGet as catalogGet } from '../functions/api/jjang-geo/catalog.js';
import { onRequestGet as problemsGet } from '../functions/api/jjang-geo/problems.js';
import { onRequestGet as similarGet } from '../functions/api/jjang-geo/similar.js';
import { onRequestGet as assetGet } from '../functions/api/jjang-geo/asset.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const png = fs.readFileSync(path.join(here, 'jjang_geo_src', 'out', 'gsol', 'gsol-04.png')).toString('base64');

function fakeEnv({ subscribed }) {
  return {
    DB: {
      prepare(sql) {
        return {
          bind() { return this; },
          async first() {
            if (/FROM sessions/.test(sql)) return { id: 'u1', expires_at: Date.now() + 1e6 };
            if (/FROM user_subscriptions/.test(sql)) return subscribed ? { expires_at: null } : null;
            if (/FROM jjang_calc1_assets/.test(sql)) return { mime: 'image/png', data: png };
            return null;
          },
        };
      },
    },
  };
}
const req = (url, cookie = true) => new Request(`https://x.test${url}`, { headers: cookie ? { cookie: 'session=abc' } : {} });
let failed = 0;
const check = (name, cond) => { console.log(cond ? 'ok  ' : 'FAIL', name); if (!cond) failed += 1; };

const cat = await (await catalogGet()).json();
check('catalog 17 types', cat.types.length === 17);
check('catalog has no problem text', !JSON.stringify(cat).includes('question'));

let r = await problemsGet({ request: req('/api/jjang-geo/problems?type=1', false), env: fakeEnv({ subscribed: true }) });
check('problems 401 logged out', r.status === 401);
r = await problemsGet({ request: req('/api/jjang-geo/problems?type=1'), env: fakeEnv({ subscribed: false }) });
check('problems 403 unsubscribed', r.status === 403);
r = await problemsGet({ request: req('/api/jjang-geo/problems?type=1'), env: fakeEnv({ subscribed: true }) });
let d = await r.json();
check('problems ok type1 = 23', r.status === 200 && d.problems.length === 23);
check('기출 has source', d.problems.filter((p) => p.sectionCode === 'p').every((p) => p.source));
r = await problemsGet({ request: req('/api/jjang-geo/problems?type=5&section=p'), env: fakeEnv({ subscribed: true }) });
d = await r.json();
check('type5 기출 = 18 and stem images', d.problems.length === 18 && d.problems.every((p) => p.stemImage));
r = await problemsGet({ request: req('/api/jjang-geo/problems?type=99'), env: fakeEnv({ subscribed: true }) });
check('unknown type 404', r.status === 404);

for (let t = 1; t <= 17; t += 1) {
  r = await similarGet({ request: req(`/api/jjang-geo/similar?type=${t}&seed=abc&count=12`), env: fakeEnv({ subscribed: true }) });
  d = await r.json();
  const ok = r.status === 200 && d.problems.length === 12 && d.problems.every((p) => p.question && p.answer && p.explanation);
  check(`similar type ${t}`, ok);
  const r2 = await similarGet({ request: req(`/api/jjang-geo/similar?type=${t}&seed=abc&count=12`), env: fakeEnv({ subscribed: true }) });
  check(`similar type ${t} reproducible`, JSON.stringify((await r2.json()).problems) === JSON.stringify(d.problems));
}
r = await similarGet({ request: req('/api/jjang-geo/similar?type=3'), env: fakeEnv({ subscribed: false }) });
check('similar 403 unsubscribed', r.status === 403);

r = await assetGet({ request: req('/api/jjang-geo/asset?id=gsol-04'), env: fakeEnv({ subscribed: true }) });
check('asset png', r.status === 200 && r.headers.get('content-type') === 'image/png' && (await r.arrayBuffer()).byteLength > 1000);
r = await assetGet({ request: req('/api/jjang-geo/asset?id=../etc'), env: fakeEnv({ subscribed: true }) });
check('asset bad id 400', r.status === 400);
r = await assetGet({ request: req('/api/jjang-geo/asset?id=gsol-04'), env: fakeEnv({ subscribed: false }) });
check('asset 403 unsubscribed', r.status === 403);

console.log(failed ? `${failed} FAILED` : 'all passed');
process.exit(failed ? 1 : 0);
