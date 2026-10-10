import fs from 'fs';
import path from 'path';
import {
  ALL_PROBSTATS_IMPORTANT_GENERATORS,
  generateProbStatsImportantProblem,
  generateProbStatsImportantVariant,
  PROBSTATS_IMPORTANT_GENERATORS_BY_UNIT
} from '../app/csat/probStatsImportantProblemGenerator.js';

console.log('=== Probability & Statistics Important Catalog & Generator Verification ===');

// 1. Catalog Verification
const catalogPath = path.resolve('app/data/csatProbStatsImportantCatalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));
console.log(`Total problems in catalog: ${catalog.length}`);

if (catalog.length !== 440) {
  throw new Error(`Expected 440 problems, got ${catalog.length}`);
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
console.log('Chapter distribution:', chapterDist);
console.log('[PASS] All 440 problems in Probability & Statistics Important Catalog verified successfully!');

// 2. Generator Verification
console.log('\nTesting 18 algorithmic problem generators...');
const unitKeys = Object.keys(PROBSTATS_IMPORTANT_GENERATORS_BY_UNIT);
for (const unitId of unitKeys) {
  for (let i = 0; i < 5; i++) {
    const prob = generateProbStatsImportantProblem(unitId);
    if (!prob.question || !prob.choices || prob.choices.length !== 5 || !prob.explanation) {
      throw new Error(`Generator failed for unit ${unitId}`);
    }
  }
}
console.log(`[PASS] Successfully generated test problems across all ${unitKeys.length} units!`);

// 3. Variant Generator Verification
for (let i = 0; i < 10; i++) {
  const sample = catalog[Math.floor(Math.random() * catalog.length)];
  const variant = generateProbStatsImportantVariant(sample);
  if (!variant.question || !variant.choices || variant.choices.length !== 5) {
    throw new Error(`Variant generator failed for ${sample.id}`);
  }
}
console.log('[PASS] Variant problem generation verified successfully!');

// 4. AMC High School Mapped Catalog Verification
const amcPath = path.resolve('app/data/amcHighSchoolMappedCatalog.json');
const amcCatalog = JSON.parse(fs.readFileSync(amcPath, 'utf-8'));
console.log(`\nAMC High School Mapped Catalog total items: ${amcCatalog.length}`);
if (amcCatalog.length < 1900) {
  throw new Error(`AMC High School Mapped Catalog expected >= 1900, got ${amcCatalog.length}`);
}
console.log('[PASS] AMC High School Mapped Catalog integrity verified successfully!');

console.log('\n=== All Probability & Statistics Important checks passed! ===');
