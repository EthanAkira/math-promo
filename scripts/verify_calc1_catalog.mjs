import fs from 'fs';

const catalogPath = './app/data/csatCalculus1BasicCatalog.json';
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

console.log('=== Calculus 1 Basic Catalog Verification ===');
console.log(`Total problems: ${catalog.length}`);

if (catalog.length !== 374) {
  console.error(`[FAIL] Expected 374 problems, got ${catalog.length}`);
  process.exit(1);
}

let errors = 0;
const chapterCounts = {};

for (let i = 0; i < catalog.length; i++) {
  const p = catalog[i];
  chapterCounts[p.chapter] = (chapterCounts[p.chapter] || 0) + 1;

  if (!p.id || !p.id.startsWith('jjangeasy-calc-')) {
    console.error(`[FAIL] Problem ${i + 1} has invalid id: ${p.id}`);
    errors++;
  }
  if (!p.question || p.question.trim().length === 0) {
    console.error(`[FAIL] Problem ${p.id} has empty question`);
    errors++;
  }
  if (p.type === 'multiple_choice') {
    if (!Array.isArray(p.choices) || p.choices.length !== 5) {
      console.error(`[FAIL] Problem ${p.id} does not have 5 choices`);
      errors++;
    }
    if (typeof p.correctAnswer !== 'number' || p.correctAnswer < 0 || p.correctAnswer > 4) {
      console.error(`[FAIL] Problem ${p.id} has invalid correctAnswer: ${p.correctAnswer}`);
      errors++;
    }
  } else if (p.type === 'subjective') {
    if (!p.answer && p.correctAnswer === undefined) {
      console.error(`[FAIL] Subjective problem ${p.id} missing answer`);
      errors++;
    }
  }
  if (!p.explanation || p.explanation.trim().length === 0) {
    console.error(`[FAIL] Problem ${p.id} missing explanation`);
    errors++;
  }
  if (!p.subjectId || !p.unitId) {
    console.error(`[FAIL] Problem ${p.id} missing subjectId or unitId`);
    errors++;
  }
  if (!p.amcSubjectId || !p.amcUnitId) {
    console.error(`[FAIL] Problem ${p.id} missing amcSubjectId or amcUnitId`);
    errors++;
  }
}

console.log('Chapter distribution:', chapterCounts);

if (errors === 0) {
  console.log('[PASS] All 374 problems in Calculus 1 Basic Catalog verified successfully!');
} else {
  console.error(`[FAIL] Found ${errors} validation errors.`);
  process.exit(1);
}
