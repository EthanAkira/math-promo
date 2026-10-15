import {
  generateJjangeasyGeoProblem,
  generateJjangeasyGeoVariant,
  JJANGEASY_GEO_GENERATORS,
} from '../app/csat/jjangeasyGeoProblemGenerator.js';
import catalog from '../app/data/csatJjangeasyGeoCatalog.json' with { type: 'json' };

console.log('=== Jjangeasy Geo Verification ===');
console.log(`Catalog size: ${catalog.length} items`);

// Verify all 16 types
for (let t = 1; t <= 16; t++) {
  const prob = generateJjangeasyGeoProblem(t);
  console.log(`[Type ${t}] ${prob.chapterName}:`);
  console.log(`  Question: ${prob.question.slice(0, 60)}...`);
  console.log(`  Choices (${prob.choices.length}): ${prob.choices.join(', ')}`);
  console.log(`  Correct Index: ${prob.correctAnswer}, Answer: ${prob.answer}`);
  if (prob.choices.length !== 5) {
    throw new Error(`Type ${t} must have 5 choices`);
  }
}

// Verify variant generation from catalog item
const sample = catalog[10];
const variant = generateJjangeasyGeoVariant(sample);
console.log('\n[Sample Variant Test]');
console.log(`Source: ${sample.id} (${sample.chapterName})`);
console.log(`Variant: ${variant.id} (${variant.chapterName})`);
console.log(`Variant Question: ${variant.question}`);

console.log('\n✅ All Jjangeasy Geo generator checks passed successfully!');
