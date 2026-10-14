import fs from 'fs';
import path from 'path';
import { GRADE1_MOCK_GENERATORS, generateVariationForGrade1Mock } from '../app/csat/grade1NationalMockGenerator.js';

console.log('=== Verifying Grade 1 National Mock Exam Catalog & Engine ===\n');

// 1. Verify Catalog
const catalogPath = path.resolve('app/data/csatGrade1NationalMockCatalog.json');
if (!fs.existsSync(catalogPath)) {
  console.error('FAIL: csatGrade1NationalMockCatalog.json not found!');
  process.exit(1);
}

const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
console.log(`✓ Catalog loaded: ${catalog.length} items`);

if (catalog.length !== 358) {
  console.error(`FAIL: Expected 358 items, got ${catalog.length}`);
  process.exit(1);
}

// Check session distribution
const sessionCounts = {};
const unitCounts = {};
const amcCounts = {};

catalog.forEach((item, idx) => {
  if (!item.id || !item.question || !item.answer || !item.explanation) {
    console.error(`FAIL: Item at index ${idx} is missing required fields!`, item);
    process.exit(1);
  }
  sessionCounts[item.sessionKey] = (sessionCounts[item.sessionKey] || 0) + 1;
  unitCounts[item.unitId] = (unitCounts[item.unitId] || 0) + 1;
  amcCounts[item.amcTopic] = (amcCounts[item.amcTopic] || 0) + 1;
});

console.log('\n--- Session Counts ---');
console.table(sessionCounts);

console.log('\n--- Unit Counts ---');
console.table(unitCounts);

console.log('\n--- AMC High School Topic Counts ---');
console.table(amcCounts);

// 2. Verify AMC Mapped Catalog
const amcCatalogPath = path.resolve('app/data/amcHighSchoolMappedCatalog.json');
const amcCatalog = JSON.parse(fs.readFileSync(amcCatalogPath, 'utf8'));
const mockG1AmcItems = amcCatalog.filter(i => i.id.startsWith('amc-hs-mock-g1-'));
console.log(`\n✓ AMC Mapped Catalog: Total ${amcCatalog.length} items, Mock G1 items: ${mockG1AmcItems.length}`);
if (mockG1AmcItems.length !== 358) {
  console.error(`FAIL: Expected 358 Mock G1 items in AMC catalog, got ${mockG1AmcItems.length}`);
  process.exit(1);
}

// 3. Test Generators
console.log('\n--- Testing Grade 1 Mock Generator Engine ---');
Object.entries(GRADE1_MOCK_GENERATORS).forEach(([typeKey, fn]) => {
  const prob = fn();
  if (!prob.question || !prob.answer || !prob.explanation || !prob.choices || prob.choices.length !== 5) {
    console.error(`FAIL: Generator ${typeKey} output invalid!`, prob);
    process.exit(1);
  }
  console.log(`✓ Generator [${typeKey}]: passed`);
});

// Test variation generator for a random catalog item
const sampleItem = catalog[15];
const sampleVariant = generateVariationForGrade1Mock(sampleItem);
if (!sampleVariant.question || !sampleVariant.answer || !sampleVariant.explanation) {
  console.error('FAIL: Variation generator produced invalid output!', sampleVariant);
  process.exit(1);
}
console.log(`✓ Variation generator for item [${sampleItem.id}]: passed`);

console.log('\n======================================================');
console.log(' ALL VERIFICATIONS PASSED SUCCESSFULLY! (100% PASS)');
console.log('======================================================\n');
