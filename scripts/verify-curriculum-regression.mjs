import esbuild from 'esbuild';
import { fileURLToPath } from 'node:url';

// PRD_2022개정_수학교육과정_카테고리.md Phase 5 item 4: run the full regression suite before
// every deploy. app/curriculumValidation.js uses extensionless relative imports across many
// catalog files (Next.js resolves these via webpack), which plain `node` cannot load directly —
// esbuild bundles the whole graph into one self-contained module first.
const entry = fileURLToPath(new URL('../app/curriculumValidation.js', import.meta.url));
const result = await esbuild.build({
  entryPoints: [entry],
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'node',
  target: 'node18',
  logLevel: 'silent',
});

const moduleUrl = `data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`;
const { assertCurriculumSeedValidation } = await import(moduleUrl);

try {
  const report = assertCurriculumSeedValidation(100);
  console.log(`Curriculum regression passed: ${report.subjectCount} subjects, ${report.generatedCount} problems generated (100 seeds/subject).`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
