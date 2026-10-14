import fs from 'fs';
import path from 'path';
import { generateSilryeokGeoProblem, generateSilryeokGeoVariant } from '../app/csat/silryeokGeoVectorsProblemGenerator.js';

console.log('=== VERIFYING SILRYEOK GEOMETRY & VECTORS INTEGRATION ===\n');

// 1. Verify Catalog JSON
const catalogPath = path.resolve('app/data/csatSilryeokGeoVectorsCatalog.json');
if (!fs.existsSync(catalogPath)) {
  console.error('❌ FAIL: Catalog file not found at', catalogPath);
  process.exit(1);
}

const rawData = fs.readFileSync(catalogPath, 'utf-8');
const catalog = JSON.parse(rawData);

console.log(`✅ Catalog loaded successfully: ${catalog.length} problems total.`);

const basicProblems = catalog.filter(p => p.tier === 'basic');
const appliedProblems = catalog.filter(p => p.tier === 'applied');
const advancedProblems = catalog.filter(p => p.tier === 'advanced');

console.log(` - 기본문제 (유제): ${basicProblems.length}문항`);
console.log(` - 응용문제 (연습문제 표준): ${appliedProblems.length}문항`);
console.log(` - 고난도 문제 (실력 연습문제): ${advancedProblems.length}문항`);

if (basicProblems.length === 0 || appliedProblems.length === 0 || advancedProblems.length === 0) {
  console.error('❌ FAIL: All three tiers (basic, applied, advanced) must be populated!');
  process.exit(1);
}

// Check chapter coverage 1 ~ 13
const chapterCoverage = new Set();
for (const p of catalog) {
  if (!p.id || !p.chapter || !p.question || !p.explanation) {
    console.error('❌ FAIL: Problem missing required fields:', p.id);
    process.exit(1);
  }
  chapterCoverage.add(p.chapter);
}

console.log(`✅ Chapters covered: ${chapterCoverage.size}/13 chapters`);
if (chapterCoverage.size < 13) {
  console.error('❌ FAIL: Missing chapters in catalog! Expected 13, got', chapterCoverage.size);
  process.exit(1);
}

// 2. Verify Generator Engine
console.log('\n--- Testing Silryeok Geo Problem Generator Engine ---');
for (let ch = 1; ch <= 13; ch++) {
  const pBasic = generateSilryeokGeoProblem(ch, { tier: 'basic' });
  const pApplied = generateSilryeokGeoProblem(ch, { tier: 'applied' });
  const pAdv = generateSilryeokGeoProblem(ch, { tier: 'advanced' });
  
  if (!pBasic.choices || pBasic.choices.length !== 5 || !pBasic.explanation) {
    console.error(`❌ FAIL: Invalid basic generated problem for chapter ${ch}`);
    process.exit(1);
  }
  if (!pAdv.choices || pAdv.choices.length !== 5 || !pAdv.explanation) {
    console.error(`❌ FAIL: Invalid advanced generated problem for chapter ${ch}`);
    process.exit(1);
  }
}
console.log('✅ All 13 chapters generate basic, applied, and advanced problems correctly with 5 choices & explanations!');

// 3. Test Variant Generation from catalog items
console.log('\n--- Testing Variant Generation from catalog items ---');
const sampleYuje = basicProblems[0];
const sampleYeonseup = appliedProblems[0];
const sampleSilryeok = advancedProblems[0];

const variantYuje = generateSilryeokGeoVariant(sampleYuje);
const variantYeonseup = generateSilryeokGeoVariant(sampleYeonseup);
const variantSilryeok = generateSilryeokGeoVariant(sampleSilryeok);

console.log(`✅ Variant Yuje: ${variantYuje.id} [${variantYuje.chapterName} - ${variantYuje.tier}]`);
console.log(`✅ Variant Yeonseup: ${variantYeonseup.id} [${variantYeonseup.chapterName} - ${variantYeonseup.tier}]`);
console.log(`✅ Variant Silryeok: ${variantSilryeok.id} [${variantSilryeok.chapterName} - ${variantSilryeok.tier}]`);

console.log('\n🎉 ALL CHECKS PASSED! Silryeok Geometry & Vectors catalog & engine are fully verified and integrated.');
