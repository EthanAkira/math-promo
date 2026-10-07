import { GENERATORS } from '../app/amc/amcProblemGenerator.js';

console.log('Testing all AMC problem generators...');

let errorCount = 0;
let totalDraws = 0;

for (const [unitId, gen] of Object.entries(GENERATORS)) {
  for (let i = 0; i < 30; i += 1) {
    for (const lang of ['ko', 'en']) {
      totalDraws += 1;
      try {
        const prob = gen(lang);
        if (!prob) throw new Error('Returned empty problem');
        if (!prob.question || typeof prob.question !== 'string') throw new Error('Missing question text');
        if (!Array.isArray(prob.choices) || prob.choices.length !== 5) {
          throw new Error(`Expected 5 choices, got ${prob.choices?.length}`);
        }
        if (typeof prob.correctIdx !== 'number' || prob.correctIdx < 0 || prob.correctIdx > 4) {
          throw new Error(`Invalid correctIdx: ${prob.correctIdx}`);
        }
        if (!prob.explanation || typeof prob.explanation !== 'string') throw new Error('Missing explanation');
        if (prob.question.includes('NaN') || prob.question.includes('undefined')) {
          throw new Error(`NaN/undefined in question: ${prob.question}`);
        }
        if (prob.explanation.includes('NaN') || prob.explanation.includes('undefined')) {
          throw new Error(`NaN/undefined in explanation: ${prob.explanation}`);
        }
      } catch (err) {
        errorCount += 1;
        console.error(`[FAIL] unitId=${unitId}, lang=${lang}, draw=${i}: ${err.message}`);
      }
    }
  }
}

console.log(`\nResults: ${totalDraws} total draws across ${Object.keys(GENERATORS).length} units.`);
if (errorCount === 0) {
  console.log('✅ ALL TESTS PASSED WITH 0 ERRORS!');
} else {
  console.error(`❌ ${errorCount} ERRORS FOUND!`);
  process.exit(1);
}
