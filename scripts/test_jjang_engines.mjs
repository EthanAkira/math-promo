// 스트레스 테스트: node scripts/test_jjang_engines.mjs [seedsPerGenerator]
// 각 생성기를 많은 시드로 실행해 (1) 예외 없음 (2) verify()의 독립 수치검산이 정답과 일치 (3) 보기 중복/누락 없음 (4) 한글/영문 모두 생성 가능 을 확인한다.
import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'functions', 'api', 'curriculum-advanced', 'engines', process.env.ENGINE_DIR || 'calc1');
const N = Number(process.argv[2]) || 300;

function mulberry(seed) {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let total = 0;
let failures = 0;
const report = {};
for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('Engine.js'))) {
  const mod = await import(pathToFileURL(path.join(dir, file)).href);
  const tables = Object.values(mod).filter((v) => v && typeof v === 'object');
  for (const table of tables) {
    for (const [typeId, gens] of Object.entries(table)) {
      gens.forEach((gen, gi) => {
        for (let s = 0; s < N; s += 1) {
          for (const locale of ['ko', 'en']) {
            total += 1;
            const key = `${typeId}#${gi}:${gen.name}`;
            try {
              const p = gen(mulberry(s * 7919 + gi), { locale });
              if (!p.prompt || /undefined|NaN|\[object/.test(p.prompt + p.explanation)) throw new Error('bad text');
              if (p.kind === 'mcq') {
                if (new Set(p.choices).size !== p.choices.length || p.choices.length !== 5) throw new Error('choices ' + JSON.stringify(p.choices));
                const idx = Number(p.answer);
                if (!(idx >= 1 && idx <= 5)) throw new Error('answer idx');
              }
              const chk = p._check;
              if (!chk) throw new Error('no _check');
              const got = chk.verify();
              if (!(Math.abs(got - chk.expected) <= 1e-6 * Math.max(1, Math.abs(chk.expected)))) throw new Error(`verify ${got} vs ${chk.expected}`);
              if (p.kind === 'mcq') {
                // MCQ correct choice text must evaluate to expected (only for plain rational choices)
                const txt = p.choices[Number(p.answer) - 1];
                const m = txt.match(/^(-?)\\frac\{(\d+)\}\{(\d+)\}$/);
                const v = m ? (m[1] ? -1 : 1) * Number(m[2]) / Number(m[3]) : /^-?\d+$/.test(txt) ? Number(txt) : null;
                if (v !== null && Math.abs(v - chk.expected) > 1e-9) throw new Error(`choice ${txt} != ${chk.expected}`);
              } else if (Math.abs(Number(p.answer) - chk.expected) > 1e-9) throw new Error(`short ${p.answer} != ${chk.expected}`);
            } catch (e) {
              failures += 1;
              report[key] = report[key] || { n: 0, msg: String(e.message).slice(0, 140), seed: s, locale };
              report[key].n += 1;
            }
          }
        }
      });
    }
  }
}
console.log(`runs=${total} failures=${failures}`);
for (const [k, v] of Object.entries(report)) console.log(k, JSON.stringify(v));
process.exit(failures ? 1 : 0);
