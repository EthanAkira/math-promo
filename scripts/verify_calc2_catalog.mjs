import fs from 'fs';
import path from 'path';
import {
  ALL_CALCULUS2_IMPORTANT_GENERATORS,
  generateCalculus2ImportantProblem,
  generateCalculus2ImportantVariant,
  CALCULUS2_IMPORTANT_GENERATORS_BY_UNIT
} from '../app/csat/calculus2ImportantProblemGenerator.js';

console.log('=== Calculus 2 Important Catalog & Generator Verification ===');

// 1. Catalog Verification
const catalogPath = path.resolve('app/data/csatCalculus2ImportantCatalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));
console.log(`Total problems in catalog: ${catalog.length}`);

if (catalog.length !== 522) {
  throw new Error(`Expected 522 problems, got ${catalog.length}`);
}

const chapterDist = {};
for (const p of catalog) {
  chapterDist[p.chapter] = (chapterDist[p.chapter] || 0) + 1;
  if (!p.id || !p.question || !p.choices || p.choices.length !== 5 || !p.explanation) {
    throw new Error(`Invalid problem structure in ${p.id}`);
  }
  if (!p.subjectId || !p.unitId || !p.subUnitId || !p.amcSubjectId || !p.amcUnitId) {
    throw new Error(`Missing unit mappings in ${p.id}`);
  }
}
console.log('Chapter distribution (21 chapters):', chapterDist);
console.log('[PASS] All 522 problems in Calculus 2 Important Catalog verified successfully!');

// 2. Generator Verification
console.log('\nTesting 21 algorithmic problem generators...');
const unitKeys = Object.keys(CALCULUS2_IMPORTANT_GENERATORS_BY_UNIT);
for (const unitId of unitKeys) {
  for (let i = 0; i < 3; i++) {
    const prob = generateCalculus2ImportantProblem(unitId);
    if (!prob.question || !prob.choices || prob.choices.length !== 5 || !prob.explanation) {
      throw new Error(`Generator failed for unit ${unitId}`);
    }
  }
}
console.log(`[PASS] Successfully generated test problems across all ${unitKeys.length} units!`);

// 3. Variant Generator Verification
for (let i = 0; i < 10; i++) {
  const sample = catalog[Math.floor(Math.random() * catalog.length)];
  const variant = generateCalculus2ImportantVariant(sample);
  if (!variant.question || !variant.choices || variant.choices.length !== 5) {
    throw new Error(`Variant generator failed for ${sample.id}`);
  }
}
console.log('[PASS] Variant problem generation verified successfully!');

// 4. AMC High School Mapped Catalog Verification
const amcPath = path.resolve('app/data/amcHighSchoolMappedCatalog.json');
const amcCatalog = JSON.parse(fs.readFileSync(amcPath, 'utf-8'));
console.log(`\nAMC High School Mapped Catalog total items: ${amcCatalog.length}`);

const calc2AmcItems = amcCatalog.filter(it => it.id?.startsWith('jjangimportant-calc2-'));
console.log(`Calculus 2 items mapped in AMC catalog: ${calc2AmcItems.length}`);
if (calc2AmcItems.length !== 522) {
  throw new Error(`Expected 522 Calculus 2 items in AMC catalog, got ${calc2AmcItems.length}`);
}

console.log('[PASS] All verifications passed successfully with 100% integrity!');
