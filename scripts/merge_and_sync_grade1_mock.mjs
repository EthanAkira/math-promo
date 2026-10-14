import fs from 'fs';
import path from 'path';

const catalogPath = path.resolve('app/data/csatGrade1NationalMockCatalog.json');
const amcCatalogPath = path.resolve('app/data/amcHighSchoolMappedCatalog.json');

const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
let amcCatalog = JSON.parse(fs.readFileSync(amcCatalogPath, 'utf8'));

console.log(`Initial Grade 1 Mock catalog: ${catalog.length} items`);
console.log(`Initial AMC High School catalog: ${amcCatalog.length} items`);

// AMC unit mappings
const amcUnitMap = {
  'polynomial-ops': { subjectId: 'algebra', unitId: 'polynomial-arithmetic', level: 10 },
  'equations-inequalities': { subjectId: 'algebra', unitId: 'quadratics-inequalities', level: 10 },
  'coordinate-geometry-equations': { subjectId: 'geometry', unitId: 'analytic-geometry-circles', level: 10 },
  'sets-propositions': { subjectId: 'advanced', unitId: 'logic-set-theory', level: 12 },
  'functions-graphs': { subjectId: 'functions', unitId: 'functions-transformations', level: 10 },
  'permutations-combinations': { subjectId: 'combinatorics-probability', unitId: 'counting-permutations', level: 12 }
};

// Filter out old mock items from amcCatalog if any
amcCatalog = amcCatalog.filter(item => !item.id.startsWith('amc-hs-mock-g1-'));

const newAmcItems = [];

catalog.forEach((item, idx) => {
  const amcConfig = amcUnitMap[item.unitId] || { subjectId: 'algebra', unitId: 'polynomial-arithmetic', level: 10 };
  
  // Format clean AMC item
  const amcItem = {
    id: `amc-hs-mock-g1-${item.sessionKey}-${String(item.problemNumber).padStart(3, '0')}`,
    level: amcConfig.level,
    year: `Mock-${item.sessionName.replace(/[^0-9월]/g, '')}`,
    variant: item.sessionKey === 'june' ? 'A' : (item.sessionKey === 'sept' ? 'B' : 'Main'),
    problemNumber: item.problemNumber,
    subjectId: amcConfig.subjectId,
    unitId: amcConfig.unitId,
    type: item.type,
    question: item.question,
    choices: item.choices && item.choices.length > 0 ? item.choices : [],
    answer: String(item.answer),
    correctAnswer: item.correctAnswer,
    explanation: item.explanation,
    points: item.points === 4 ? 6 : (item.points === 3 ? 4 : 2),
    tier: item.tier,
    sourceLabel: `전국연합 학평 · ${item.sourceLabel}`
  };
  
  newAmcItems.push(amcItem);
});

amcCatalog.push(...newAmcItems);

// Save amcCatalog
fs.writeFileSync(amcCatalogPath, JSON.stringify(amcCatalog, null, 2), 'utf8');
console.log(`Updated AMC High School catalog: ${amcCatalog.length} items (added ${newAmcItems.length} items)`);
