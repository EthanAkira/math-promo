import fs from 'fs';
import path from 'path';

function searchInDir(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const f of files) {
    const full = path.join(dir, f.name);
    if (f.isDirectory() && !['node_modules', '.next', '.git'].includes(f.name)) {
      searchInDir(full);
    } else if (f.isFile() && (f.name.endsWith('.json') || f.name.endsWith('.js') || f.name.endsWith('.mjs'))) {
      const content = fs.readFileSync(full, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (/dot/i.test(line) && !/dotIndicator|dotGrid|red-dot|\.dot\b|dotPlot|dot-plot/i.test(line)) {
          // If line contains numbers and dot, e.g. 0.1dot or \dot
          if (/\d.*dot|dot.*\d|label.*dot|choice.*dot|option.*dot/i.test(line)) {
            console.log(`${full}:${idx + 1} -> ${line.trim()}`);
          }
        }
      });
    }
  }
}

console.log("Searching for 'dot' issues in app...");
searchInDir('app');
