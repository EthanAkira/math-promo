import { latexToPlain } from '../app/utils/latexToPlain.js';

const tests = [
  '0.\\dot{1}',
  '0.\\dot{3}',
  '0.\\dot{0}0\\dot{1}',
  '2.\\dot{8}\\dot{2}',
  '0.1\\dot{2}3\\dot{4}',
  '\\dot{1}',
  '0.1dot',
  '1.\\dot{5}',
  '4.\\dot{3}',
];

for (const t of tests) {
  console.log(`${t}  ===>  ${latexToPlain(t)}`);
}
