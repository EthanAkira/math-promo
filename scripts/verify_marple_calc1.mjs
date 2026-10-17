// 마플 수능기출 미적분Ⅰ 카탈로그/생성기 무결성 검사: node scripts/verify_marple_calc1.mjs
import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const shared = await import(pathToFileURL(path.join(root, 'functions/api/marple-calc1/_shared.js')).href);
const { CATALOG, GENERATORS, seededRandom } = shared;
const csat = JSON.parse(fs.readFileSync(path.join(root, 'app/data/csatMarpleCalc1Catalog.json'), 'utf8'));

const errors = [];
const fail = (m) => errors.push(m);

const ids = new Set();
for (const p of CATALOG.problems) {
  if (ids.has(p.id)) fail(`duplicate id ${p.id}`);
  ids.add(p.id);
  if (!CATALOG.types.some((t) => t.no === p.typeNo)) fail(`${p.id}: unknown type ${p.typeNo}`);
  if (p.kind === 'mcq' && !/^[1-5]$/.test(p.answer)) fail(`${p.id}: bad mcq answer ${p.answer}`);
  if (p.kind === 'short' && !/^\d{1,3}$/.test(p.answer)) fail(`${p.id}: bad short answer ${p.answer}`);
  if (!/^mp-q-\d{4}$/.test(p.stemImage) || !/^mp-s-\d{4}$/.test(p.solImage)) fail(`${p.id}: bad image ids`);
  if (!['p', 'h'].includes(p.sectionCode)) fail(`${p.id}: bad section`);
}
for (const t of CATALOG.types) {
  const n = CATALOG.problems.filter((p) => p.typeNo === t.no);
  if (n.length === 0) fail(`type ${t.no} has no problems`);
  if (t.counts[0] + t.counts[1] !== n.length) fail(`type ${t.no} counts mismatch`);
  const gens = GENERATORS[t.id];
  if (!gens || gens.length < 3) fail(`type ${t.id} has fewer than 3 generators`);
  else {
    const random = seededRandom(`verify:${t.id}`);
    for (let i = 0; i < 60; i += 1) {
      const item = gens[i % gens.length](random, { locale: 'ko' });
      if (!item.prompt || !item.explanation || /undefined|NaN/.test(item.prompt + item.explanation)) fail(`${t.id}: bad generated text`);
    }
  }
}
// 사관학교·경찰대 기출은 고난도(h)에만, CSAT 브라우저에는 기출(p)만 들어간다.
for (const p of CATALOG.problems) {
  if (['사관', '경찰대'].includes(p.origin) && p.sectionCode !== 'h') fail(`${p.id}: military problem outside 고난도`);
}
const pCount = CATALOG.problems.filter((p) => p.sectionCode === 'p').length;
if (csat.rows.length !== pCount) fail(`csat rows ${csat.rows.length} != p problems ${pCount}`);
if (CATALOG.problems.length < 1300) fail(`only ${CATALOG.problems.length} problems`);

if (errors.length) {
  console.error(errors.slice(0, 30).join('\n'));
  console.error(`FAILED (${errors.length})`);
  process.exit(1);
}
console.log(`marple-calc1 OK: ${CATALOG.problems.length} problems, ${CATALOG.types.length} types, ${csat.rows.length} CSAT rows`);
