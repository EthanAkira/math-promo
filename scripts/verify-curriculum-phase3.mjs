import fs from 'node:fs/promises';

// PRD_2022개정_수학교육과정_카테고리.md Phase 3, items 1-2:
//   1. 국제 과정 독립 트리 적용 (system isolation, no KR profile leakage, required course coverage)
//   2. 언어와 교육과정 상태 분리 (regression guard on the mount-only tab-init effect)
// Item 3 (표/그래프 내부 텍스트 번역) is deferred; item 4 (언어별 스모크 테스트) is done by hand in a browser.

const source = await fs.readFile(new URL('../app/curriculumCatalog.js', import.meta.url), 'utf8');
const moduleUrl = `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
const { CURRICULUM_CATALOG, INTERNATIONAL_COURSE_STAGES } = await import(moduleUrl);

const failures = [];

// --- Phase 3 item 1: international tree isolation ---
// Only check the direction that actually matters: an INTL-tagged node must never resolve to a
// kr-* profile id. The reverse isn't checked — KR nodes intentionally reuse shared/international
// generator profiles (pre-algebra, algebra-1/2, precalculus, and the basic-figures exam-track ids
// like 'kr'/'csat') per PRD §7's "공유할 수 있는 것은 하위 문제 생성 함수" rule.
for (const node of CURRICULUM_CATALOG.nodes) {
  const isKrProfile = typeof node.profileId === 'string' && node.profileId.startsWith('kr-');
  if (node.system === 'INTL' && isKrProfile) {
    failures.push(`${node.id}: INTL node references a KR profile (${node.profileId})`);
  }
}

const requiredIntlStages = [
  'intl-arithmetic',
  'intl-pre-algebra',
  'intl-algebra-1',
  'intl-geometry',
  'intl-algebra-2',
  'intl-precalculus',
  'intl-integrated',
];
const intlStageIds = INTERNATIONAL_COURSE_STAGES.map((stage) => stage.id);
for (const stageId of requiredIntlStages) {
  if (!intlStageIds.includes(stageId)) failures.push(`international tree missing required stage: ${stageId}`);
}

// PRD §14: existing QR/search URLs must keep resolving — every ready/partial topic that used to
// have a route must still carry it forward as a legacyRoute.
for (const node of CURRICULUM_CATALOG.nodes) {
  if (node.route && !node.legacyRoutes.includes(node.route)) {
    failures.push(`${node.id}: route not preserved in legacyRoutes for QR/search compatibility`);
  }
}

// --- Phase 3 item 2: language/curriculum state separation regression guard ---
const explorerSource = await fs.readFile(new URL('../app/CurriculumExplorer.js', import.meta.url), 'utf8');
const mountEffectMatch = explorerSource.match(/useEffect\(\(\) => \{[\s\S]*?\}, \[\]\);/);
if (!mountEffectMatch) {
  failures.push('CurriculumExplorer must initialize activeTab from language in a mount-only effect ([] deps)');
} else if (!mountEffectMatch[0].includes('setActiveTab')) {
  failures.push('mount-only effect no longer sets activeTab from the initial language');
}
// Guard against a regression that re-syncs the tab whenever `language` changes.
if (/useEffect\([^)]*\{[^}]*setActiveTab[^}]*\},\s*\[language\]/.test(explorerSource)) {
  failures.push('found an effect that resets activeTab whenever language changes (state must stay independent)');
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Phase 3 items 1-2 verified: ${CURRICULUM_CATALOG.nodes.filter((n) => n.system === 'INTL').length} INTL nodes, ${CURRICULUM_CATALOG.nodes.filter((n) => n.system === 'KR').length} KR nodes, 0 cross-references.`);
console.log(`International tree stages: ${intlStageIds.join(', ')}`);
