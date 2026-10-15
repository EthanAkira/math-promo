import fs from 'fs';
import { generateSilryeokMath1Problem, generateSilryeokMath1Variant } from '../app/csat/silryeokMath1ProblemGenerator.js';

console.log('=== Verifying Silryeok Math 1 Problem Generator ===');

// Test generating a problem for each chapter across all 3 tiers
for (let ch = 1; ch <= 17; ch++) {
  for (const tier of ['basic', 'applied', 'advanced']) {
    const p = generateSilryeokMath1Problem(ch, { tier });
    if (!p.question || !p.explanation || !p.choices || p.choices.length !== 5) {
      throw new Error(`Failed on Ch ${ch} tier ${tier}: invalid problem object`);
    }
  }
}
console.log('All 17 chapters generated successfully across basic, applied, and advanced tiers!');

// Test variant generator with a sample problem from catalog
const catalog = JSON.parse(fs.readFileSync('app/data/csatSilryeokMath1Catalog.json', 'utf-8'));
console.log(`Loaded catalog with ${catalog.length} problems.`);

const basicSample = catalog.find(p => p.tier === 'basic');
const appliedSample = catalog.find(p => p.tier === 'applied');
const advancedSample = catalog.find(p => p.tier === 'advanced');

console.log('Testing Basic Variant:', generateSilryeokMath1Variant(basicSample).sourceLabel);
console.log('Testing Applied Variant:', generateSilryeokMath1Variant(appliedSample).sourceLabel);
console.log('Testing Advanced Variant:', generateSilryeokMath1Variant(advancedSample).sourceLabel);

console.log('Verification PASSED!');
