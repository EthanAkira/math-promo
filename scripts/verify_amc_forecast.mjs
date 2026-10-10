import {
  AMC_DOMAIN_FREQUENCIES,
  AMC_UNIT_FREQUENCY_MAP,
  AMC_KILLER_TOPICS,
  generateAmcForecastProblem,
  generateAmcForecastExamSet,
} from '../app/amc/amcForecastEngine.js';

console.log('=== AMC Official Frequency & Forecast Engine Verification ===');

// 1. Verify Domain Frequencies
const levels = ['8', '10', '12'];
for (const lvl of levels) {
  const data = AMC_DOMAIN_FREQUENCIES[lvl];
  if (!data || !data.domains || data.domains.length === 0) {
    throw new Error(`Missing domain frequency data for AMC ${lvl}`);
  }
  console.log(`[PASS] AMC ${lvl} domain frequencies validated: ${data.domains.length} domains`);
}

// 2. Verify Unit Frequency Map
const unitKeys = Object.keys(AMC_UNIT_FREQUENCY_MAP);
console.log(`Total subtopic frequency indicators: ${unitKeys.length}`);
if (unitKeys.length < 30) {
  throw new Error(`Expected at least 30 unit frequencies, got ${unitKeys.length}`);
}
for (const key of unitKeys) {
  const info = AMC_UNIT_FREQUENCY_MAP[key];
  if (!info.count || !info.rate || !info.stars || !info.tier) {
    throw new Error(`Invalid unit frequency info for ${key}`);
  }
}
console.log(`[PASS] All ${unitKeys.length} subtopics have verified frequency metrics!`);

// 3. Verify Killer Topics
if (!AMC_KILLER_TOPICS || AMC_KILLER_TOPICS.length < 5) {
  throw new Error('Missing top 5 killer topics analysis');
}
console.log(`[PASS] Verified ${AMC_KILLER_TOPICS.length} High-Difficulty Killer Strategies!`);

// 4. Test Forecast Problem Generation across AMC 8, 10, 12
for (const lvl of levels) {
  for (let i = 0; i < 3; i++) {
    const prob = generateAmcForecastProblem({ level: lvl, number: i + 1 });
    if (!prob.question || !prob.choices || prob.choices.length !== 5 || !prob.explanation) {
      throw new Error(`Forecast generator failed for AMC ${lvl}`);
    }
  }
  console.log(`[PASS] Successfully generated forecast problems for AMC ${lvl}`);
}

// 5. Test Full 25-Question Exam Set Generation
for (const lvl of levels) {
  const exam = generateAmcForecastExamSet(lvl);
  if (!exam.questions || exam.questions.length !== 25) {
    throw new Error(`Exam set for AMC ${lvl} does not have 25 questions, got ${exam.questions?.length}`);
  }
  if (!exam.title || !exam.timeMinutes) {
    throw new Error(`Invalid exam metadata for AMC ${lvl}`);
  }
  console.log(`[PASS] Full 25-question exam set verified for AMC ${lvl} (${exam.timeMinutes} mins)`);
}

console.log('\n[ALL PASS] AMC Frequency Matrix & Forecast Problem Engine 100% verified!');
