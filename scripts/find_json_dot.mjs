import fs from 'fs';
import path from 'path';

function searchData(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const f of files) {
    const full = path.join(dir, f.name);
    if (f.isFile() && f.name.endsWith('.json')) {
      const content = fs.readFileSync(full, 'utf8');
      if (content.includes('dot')) {
        const matches = content.match(/[^"\n]{0,40}dot[^"\n]{0,40}/gi);
        if (matches) {
          const filtered = matches.filter(m => !/dotIndicator|dotGrid|red-dot/i.test(m));
          if (filtered.length > 0) {
            console.log('JSON match in:', full, filtered.slice(0, 5));
          }
        }
      }
    }
  }
}

searchData('app/data');
