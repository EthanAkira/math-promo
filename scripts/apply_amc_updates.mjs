import fs from 'fs';
import { AMC8_2023_PROBLEMS } from './amc8_2023_data.mjs';
import { AMC10_2023_PROBLEMS } from './amc10_2023_data.mjs';
import { AMC12_2023_PROBLEMS } from './amc12_2023_data.mjs';

// 1. Update amc8ProblemCatalog.json
const amc8Path = './app/data/amc8ProblemCatalog.json';
const amc8Catalog = JSON.parse(fs.readFileSync(amc8Path, 'utf8'));

// Filter out old 2023 items and insert new verified 25 items
const filteredAmc8 = amc8Catalog.filter((p) => p.year !== 2023);
const updatedAmc8 = [...AMC8_2023_PROBLEMS, ...filteredAmc8];
// Sort by year desc, then problemNumber asc
updatedAmc8.sort((a, b) => {
  if (b.year !== a.year) return b.year - a.year;
  return a.problemNumber - b.problemNumber;
});

fs.writeFileSync(amc8Path, JSON.stringify(updatedAmc8, null, 2), 'utf8');
console.log(`Updated AMC 8 catalog: total ${updatedAmc8.length} problems (2023 now has 25 clean problems).`);

// 2. Write amc10ProblemCatalog.json
const amc10Path = './app/data/amc10ProblemCatalog.json';
fs.writeFileSync(amc10Path, JSON.stringify(AMC10_2023_PROBLEMS, null, 2), 'utf8');
console.log(`Created AMC 10 catalog: total ${AMC10_2023_PROBLEMS.length} problems.`);

// 3. Write amc12ProblemCatalog.json
const amc12Path = './app/data/amc12ProblemCatalog.json';
fs.writeFileSync(amc12Path, JSON.stringify(AMC12_2023_PROBLEMS, null, 2), 'utf8');
console.log(`Created AMC 12 catalog: total ${AMC12_2023_PROBLEMS.length} problems.`);
