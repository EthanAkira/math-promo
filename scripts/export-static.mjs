import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const serverAppDir = path.join(rootDir, '.next', 'server', 'app');
const staticDir = path.join(rootDir, '.next', 'static');
const publicDir = path.join(rootDir, 'public');
const outDir = path.join(rootDir, 'out');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 1. Copy public assets to out
if (fs.existsSync(publicDir)) {
  copyDirRecursive(publicDir, outDir);
}

// 2. Copy static chunks to out/_next/static
const outNextStaticDir = path.join(outDir, '_next', 'static');
if (fs.existsSync(staticDir)) {
  copyDirRecursive(staticDir, outNextStaticDir);
}

// 3. Copy all compiled HTML and routes from .next/server/app
function processServerApp(dir, relPath = '') {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const itemRel = path.join(relPath, entry.name);
    if (entry.isDirectory()) {
      processServerApp(fullPath, itemRel);
    } else if (entry.name.endsWith('.html')) {
      const targetPath = path.join(outDir, itemRel);
      const targetDir = path.dirname(targetPath);
      if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
      fs.copyFileSync(fullPath, targetPath);

      // Also create index.html inside the route directory (e.g. out/games.html -> out/games/index.html)
      const baseName = entry.name.replace(/\.html$/, '');
      if (baseName !== 'index' && baseName !== '_not-found') {
        const routeSubdir = path.join(outDir, relPath, baseName);
        if (!fs.existsSync(routeSubdir)) fs.mkdirSync(routeSubdir, { recursive: true });
        fs.copyFileSync(fullPath, path.join(routeSubdir, 'index.html'));
      }
    } else if (entry.name.endsWith('.txt') || entry.name.endsWith('.xml') || entry.name.endsWith('.json') || entry.name.endsWith('.rsc')) {
      const targetPath = path.join(outDir, itemRel);
      const targetDir = path.dirname(targetPath);
      if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
      fs.copyFileSync(fullPath, targetPath);
    }
  }
}
processServerApp(serverAppDir);

// 4. Copy root yutnori.html to out/yutnori.html
const rootYutnori = path.join(rootDir, 'yutnori.html');
if (fs.existsSync(rootYutnori)) {
  fs.copyFileSync(rootYutnori, path.join(outDir, 'yutnori.html'));
}

console.log('Successfully generated full static export in out/ folder!');
