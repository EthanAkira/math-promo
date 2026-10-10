import fs from 'fs';

// Verify AMC 8, AMC 10, and AMC 12 Catalog Data
const amc8Path = './app/data/amc8ProblemCatalog.json';
const amc10Path = './app/data/amc10ProblemCatalog.json';
const amc12Path = './app/data/amc12ProblemCatalog.json';

const amc8 = JSON.parse(fs.readFileSync(amc8Path, 'utf8'));
const amc10 = JSON.parse(fs.readFileSync(amc10Path, 'utf8'));
const amc12 = JSON.parse(fs.readFileSync(amc12Path, 'utf8'));

console.log('=== AMC Catalog Summary ===');
console.log(`AMC 8 total problems:  ${amc8.length}`);
console.log(`AMC 10 total problems: ${amc10.length}`);
console.log(`AMC 12 total problems: ${amc12.length}`);

let totalErrors = 0;

function validateSet(name, list, expectedLength) {
  if (expectedLength && list.length !== expectedLength) {
    console.error(`[FAIL] ${name} count mismatch: expected ${expectedLength}, got ${list.length}`);
    totalErrors++;
    return;
  }
  let errCount = 0;
  for (let i = 0; i < list.length; i++) {
    const p = list[i];
    if (!p.id || !p.question || !Array.isArray(p.choices) || p.choices.length !== 5) {
      console.error(`[FAIL] ${name} item ${i + 1} (${p.id}): invalid choices or question structure`);
      errCount++;
    }
    const ans = parseInt(p.answer, 10);
    if (isNaN(ans) || ans < 0 || ans > 4) {
      console.error(`[FAIL] ${name} item ${i + 1} (${p.id}): answer index out of bounds [0..4]: ${p.answer}`);
      errCount++;
    }
    if (!p.explanation || p.explanation.length < 25) {
      console.error(`[FAIL] ${name} item ${i + 1} (${p.id}): empty or too short explanation`);
      errCount++;
    }
  }
  if (errCount === 0) {
    console.log(`[PASS] ${name} (${list.length} problems verified)`);
  } else {
    console.error(`[FAIL] ${name} had ${errCount} issues`);
    totalErrors += errCount;
  }
}

validateSet('2024 AMC 8', amc8.filter(p => p.year === 2024), 25);
validateSet('2023 AMC 8', amc8.filter(p => p.year === 2023), 25);
validateSet('2023 AMC 10A', amc10, 25);
validateSet('2023 AMC 12A', amc12, 25);

if (totalErrors === 0) {
  console.log('\nAll AMC official problem sets and explanations validated successfully!');
  process.exit(0);
} else {
  console.error(`\nValidation finished with ${totalErrors} errors.`);
  process.exit(1);
}
