import fs from 'fs';
import path from 'path';
import { generateJeongseokCalc2Problem, generateJeongseokCalc2Variant } from '../app/csat/jeongseokCalc2ProblemGenerator.js';

console.log('=== VERIFYING JEONGSEOK CALCULUS 2 INTEGRATION ===\n');

// 1. Verify Catalog JSON
const catalogPath = path.resolve('app/data/csatJeongseokCalc2Catalog.json');
if (!fs.existsSync(catalogPath)) {
  console.error('❌ FAIL: Catalog file not found at', catalogPath);
  process.exit(1);
}

const rawData = fs.readFileSync(catalogPath, 'utf-8');
const catalog = JSON.parse(rawData);

console.log(`✅ Catalog loaded successfully: ${catalog.length} problems total.`);

const basicProblems = catalog.filter(p => p.tier === 'basic');
const appliedProblems = catalog.filter(p => p.tier === 'applied');

console.log(` - 기본문제 (유제): ${basicProblems.length}문항`);
console.log(` - 응용문제 (연습문제): ${appliedProblems.length}문항`);

if (basicProblems.length === 0 || appliedProblems.length === 0) {
  console.error('❌ FAIL: Both basic and applied tiers must be populated!');
  process.exit(1);
}

// Check chapter coverage 1 ~ 23
const chapterCoverage = new Set();
for (const p of catalog) {
  if (!p.id || !p.chapter || !p.question || !p.explanation) {
    console.error('❌ FAIL: Problem missing required fields:', p.id);
    process.exit(1);
  }
  chapterCoverage.add(p.chapter);
}

console.log(`✅ Chapters covered: ${chapterCoverage.size}/23 chapters`);
if (chapterCoverage.size < 23) {
  console.error('❌ FAIL: Missing chapters in catalog! Expected 23, got', chapterCoverage.size);
  process.exit(1);
}

// 2. Verify Generator Engine
console.log('\n--- Testing Jeongseok Calc 2 Problem Generator Engine ---');
for (let ch = 1; ch <= 23; ch++) {
  const pBasic = generateJeongseokCalc2Problem(ch, { tier: 'basic' });
  const pApplied = generateJeongseokCalc2Problem(ch, { tier: 'applied' });
  
  if (!pBasic.choices || pBasic.choices.length !== 5 || !pBasic.explanation) {
    console.error(`❌ FAIL: Invalid basic generated problem for chapter ${ch}`);
    process.exit(1);
  }
  if (!pApplied.choices || pApplied.choices.length !== 5 || !pApplied.explanation) {
    console.error(`❌ FAIL: Invalid applied generated problem for chapter ${ch}`);
    process.exit(1);
  }
}
console.log('✅ All 23 chapters generate basic and applied problems correctly with 5 choices & explanations!');

// 3. Test Variant Generation from catalog items
console.log('\n--- Testing Variant Generation from catalog items ---');
const sampleYuje = basicProblems[0];
const sampleYeonseup = appliedProblems[0];

const variantYuje = generateJeongseokCalc2Variant(sampleYuje);
const variantYeonseup = generateJeongseokCalc2Variant(sampleYeonseup);

console.log(`✅ Variant Yuje: ${variantYuje.id} [${variantYuje.chapterName} - ${variantYuje.tier}]`);
console.log(`✅ Variant Yeonseup: ${variantYeonseup.id} [${variantYeonseup.chapterName} - ${variantYeonseup.tier}]`);

console.log('\n🎉 ALL CHECKS PASSED! Jeongseok Calculus 2 catalog & engine are fully verified and integrated.');
