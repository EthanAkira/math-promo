// 미적분 I 유형별 기출 카탈로그 빌드 (서버 전용 데이터 생성).
//   node scripts/build_jjang_calc1_catalog.mjs            -> 검증 + out/specs.json (그림 자르기 명세) 생성
//   node scripts/build_jjang_calc1_catalog.mjs --write    -> 그림(out/figs/*.png)과 해설(out/expl/*.json)을 합쳐 최종 카탈로그 작성
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { ANSWER_KEY, EXPECTED_COUNTS } from './jjang_calc1_src/answerKey.mjs';
import { solPageFor } from './jjang_calc1_src/solPages.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(here, 'jjang_calc1_src');
const outDir = path.join(srcDir, 'out');
fs.mkdirSync(outDir, { recursive: true });

export const TYPES = {
  1: { id: 'jc1-seq-limit', name: '수열의 극한', unit: 'sequence-limits', subject: 'calculus', grade: 'g3' },
  2: { id: 'jc1-geo-limit', name: '등비수열의 극한', unit: 'sequence-limits', subject: 'calculus', grade: 'g3' },
  3: { id: 'jc1-series', name: '급수', unit: 'sequence-limits', subject: 'calculus', grade: 'g3' },
  4: { id: 'jc1-graph-limit', name: '그래프를 이용한 수열의 극한', unit: 'sequence-limits', subject: 'calculus', grade: 'g3' },
  5: { id: 'jc1-geo-apps', name: '등비급수의 활용', unit: 'sequence-limits', subject: 'calculus', grade: 'g3' },
  6: { id: 'jc1-one-sided', name: '좌극한과 우극한', unit: 'limits-continuity', subject: 'math2', grade: 'g2' },
  7: { id: 'jc1-coeff', name: '미정계수 구하기', unit: 'limits-continuity', subject: 'math2', grade: 'g2' },
  8: { id: 'jc1-continuity', name: '함수의 연속', unit: 'limits-continuity', subject: 'math2', grade: 'g2' },
  9: { id: 'jc1-derivative', name: '미분계수와 미분가능성', unit: 'differentiation', subject: 'math2', grade: 'g2' },
  10: { id: 'jc1-tangent', name: '접선의 방정식', unit: 'differentiation', subject: 'math2', grade: 'g2' },
  11: { id: 'jc1-extrema', name: '증가·감소와 극대·극소', unit: 'differentiation', subject: 'math2', grade: 'g2' },
  12: { id: 'jc1-applications', name: '미분법의 활용', unit: 'differentiation', subject: 'math2', grade: 'g2' },
  13: { id: 'jc1-kinematics', name: '속도와 가속도', unit: 'differentiation', subject: 'math2', grade: 'g2' },
  14: { id: 'jc1-definite', name: '정적분', unit: 'integration', subject: 'math2', grade: 'g2' },
  15: { id: 'jc1-integral-fn', name: '정적분의 응용', unit: 'integration', subject: 'math2', grade: 'g2' },
  16: { id: 'jc1-area', name: '넓이', unit: 'integration', subject: 'math2', grade: 'g2' },
  17: { id: 'jc1-motion-dist', name: '속도와 거리', unit: 'integration', subject: 'math2', grade: 'g2' },
};
const SECTION = { b: '기본문제', p: '기출문제', e: '예상문제' };
const POINTS = { b: 3, p: 3, e: 3 };

async function load() {
  const problems = [];
  const specs = [];
  const problemsMissing = [];
  for (const [typeNo, meta] of Object.entries(TYPES)) {
    const file = path.join(srcDir, `type${String(typeNo).padStart(2, '0')}.mjs`);
    if (!fs.existsSync(file)) { problemsMissing.push(typeNo); continue; }
    const rows = (await import(pathToFileURL(file).href)).default;
    const key = ANSWER_KEY[typeNo];
    if (rows.length !== EXPECTED_COUNTS[typeNo]) throw new Error(`type ${typeNo}: ${rows.length} problems, expected ${EXPECTED_COUNTS[typeNo]}`);
    rows.forEach((row, index) => {
      const [sec, source, text, choices, fig, mode] = row;
      const n = index + 1;
      const k = key[index];
      if ((k.kind === 'mc') !== Array.isArray(choices)) throw new Error(`type ${typeNo} #${n}: answer kind ${k.kind} vs choices ${Array.isArray(choices)}`);
      if (Array.isArray(choices) && choices.length !== 5) throw new Error(`type ${typeNo} #${n}: need 5 choices`);
      if (Array.isArray(choices) && (k.value < 1 || k.value > 5)) throw new Error(`type ${typeNo} #${n}: bad choice answer`);
      if (sec === 'p' && !source) throw new Error(`type ${typeNo} #${n}: 기출 without source`);
      const id = `jc1-${String(typeNo).padStart(2, '0')}-${String(n).padStart(2, '0')}`;
      const examYearMatch = source ? source.match(/^(\d{4})학년도\s*(.+)$/) : null;
      problems.push({
        id,
        typeNo: Number(typeNo),
        typeId: meta.id,
        typeName: meta.name,
        number: n,
        section: SECTION[sec],
        sectionCode: sec,
        source: source || null,
        examYear: examYearMatch ? Number(examYearMatch[1]) : null,
        examKind: examYearMatch ? examYearMatch[2] : null,
        subjectId: meta.subject,
        unitId: meta.unit,
        grade: meta.grade,
        points: POINTS[sec],
        kind: k.kind === 'mc' ? 'mcq' : 'short',
        question: text,
        choices: choices || null,
        answer: String(k.value),
        figure: null,
        stemIsImage: mode === 'stem',
        explanation: null,
      });
      if (fig) specs.push({ id, spec: fig });
    });
  }
  return { problems, specs, problemsMissing };
}

const { problems, specs, problemsMissing } = await load();
fs.writeFileSync(path.join(outDir, 'specs.json'), JSON.stringify(specs, null, 1));
console.log(`problems=${problems.length} figures=${specs.length} missingTypes=[${problemsMissing.join(',')}]`);

if (process.argv.includes('--write')) {
  const figDir = path.join(outDir, 'figs');
  const solDir = path.join(outDir, 'sol');
  const root = path.join(here, '..');
  const dataDir = path.join(root, 'functions', 'api', 'jjang-calc1', '_data');
  fs.mkdirSync(dataDir, { recursive: true });

  const catalog = problems.map((p) => {
    const fig = path.join(figDir, `${p.id}.png`);
    const out = { ...p, figure: fs.existsSync(fig) ? `fig-${p.id}` : null, solPage: solPageFor(p.typeNo, p.number) };
    delete out.explanation;
    return out;
  });
  const typeList = Object.entries(TYPES).map(([no, t]) => ({
    no: Number(no), ...t,
    counts: ['b', 'p', 'e'].map((c) => problems.filter((p) => p.typeNo === Number(no) && p.sectionCode === c).length),
  }));
  const body = `// generated by scripts/build_jjang_calc1_catalog.mjs --write\nexport default ${JSON.stringify({ types: typeList, problems: catalog })};\n`;
  fs.writeFileSync(path.join(dataDir, 'catalog.js'), body);

  // --- D1 asset SQL (chunked) ---
  const assets = [];
  for (const p of catalog) {
    if (!p.figure) continue;
    assets.push([p.figure, fs.readFileSync(path.join(figDir, `${p.id}.png`)).toString('base64')]);
  }
  for (const f of fs.readdirSync(solDir).sort()) {
    const m = f.match(/^sol-(\d+)\.png$/);
    if (m) assets.push([`sol-${m[1]}`, fs.readFileSync(path.join(solDir, f)).toString('base64')]);
  }
  const sqlDir = path.join(outDir, 'sql');
  fs.rmSync(sqlDir, { recursive: true, force: true });
  fs.mkdirSync(sqlDir, { recursive: true });
  let chunk = []; let size = 0; let n = 0;
  const flush = () => {
    if (!chunk.length) return;
    fs.writeFileSync(path.join(sqlDir, `assets-${String(n).padStart(2, '0')}.sql`), chunk.join('\n') + '\n');
    n += 1; chunk = []; size = 0;
  };
  for (const [id, b64] of assets) {
    const stmt = `INSERT OR REPLACE INTO jjang_calc1_assets (id, mime, data) VALUES ('${id}', 'image/png', '${b64}');`;
    if (size + stmt.length > 900000 && chunk.length) flush();
    chunk.push(stmt); size += stmt.length;
  }
  flush();
  console.log(`catalog: ${catalog.length} problems, ${typeList.length} types; assets: ${assets.length} -> ${n} sql files`);
}
