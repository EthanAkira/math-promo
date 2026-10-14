import { latexToPlain } from '../app/utils/latexToPlain.js';

// Let's also check if there are other files with "0.1dot" or "dot" in choices
import fs from 'fs';

function findExactMatches(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const f of files) {
    const full = dir + '/' + f.name;
    if (f.isDirectory() && !['node_modules', '.next', '.git'].includes(f.name)) {
      findExactMatches(full);
    } else if (f.isFile() && (f.name.endsWith('.js') || f.name.endsWith('.json'))) {
      const c = fs.readFileSync(full, 'utf8');
      if (c.includes('0.1dot') || c.includes('.1dot') || c.includes('1dot') || c.includes('dot}')) {
        console.log("Match in:", full);
        const lines = c.split('\n');
        lines.forEach((l, i) => {
          if (l.includes('0.1dot') || l.includes('.1dot') || l.includes('1dot') || l.includes('dot}')) {
            console.log(`  Line ${i+1}: ${l.trim().substring(0, 120)}`);
          }
        });
      }
    }
  }
}

findExactMatches('app');
