import esbuild from 'esbuild';
const r = await esbuild.build({ entryPoints: ['app/science/content/index.js'], bundle: true, write: false, format: 'esm', platform: 'node', logLevel: 'silent' });
const { SCIENCE_CONTENT } = await import(`data:text/javascript;base64,${Buffer.from(r.outputFiles[0].text).toString('base64')}`);
const cur = await esbuild.build({ entryPoints: ['app/science/curriculum.js'], bundle: true, write: false, format: 'esm', platform: 'node', logLevel: 'silent' });
const { SCIENCE_UNITS } = await import(`data:text/javascript;base64,${Buffer.from(cur.outputFiles[0].text).toString('base64')}`);
let bad = 0; const err = (m) => { bad++; console.error('✗', m); };
const ids = new Set(SCIENCE_UNITS.map((u) => u.id));
if (ids.size !== SCIENCE_UNITS.length) err('duplicate unit id');
for (const [uid, c] of Object.entries(SCIENCE_CONTENT)) {
  if (!ids.has(uid)) err(`content for unknown unit ${uid}`);
  let n = 0;
  for (const l of c.lessons) for (const it of l.items) {
    n++; const w = `${uid}/${l.id}: ${it.q}`;
    if (it.kind === 'mc') { if (!it.choices.includes(it.answer)) err(`${w} answer not in choices`); if (new Set(it.choices).size !== it.choices.length) err(`${w} dup choices`); }
    if (it.kind === 'fb') { if (!it.q.includes('______')) err(`${w} no blank`); if (it.bank && !it.bank.includes(it.answer)) err(`${w} answer not in bank`); }
    if (it.kind === 'cz' && !/\[[^\]]+\]/.test(it.text)) err(`${w} cloze has no [blank]`);
    if (it.kind === 'tf' && typeof it.answer !== 'boolean') err(`${w} tf answer`);
    if ((it.kind === 'sa' || it.kind === 'dr') && !it.model) err(`${w} no model`);
  }
  console.log(uid, c.lessons.length, 'lessons,', n, 'items');
}
if (bad) process.exit(1); console.log('science content OK');
