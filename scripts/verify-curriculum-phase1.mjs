import fs from 'node:fs/promises';

const source = await fs.readFile(new URL('../app/curriculumCatalog.js', import.meta.url), 'utf8');
const moduleUrl = `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
const {
  CURRICULUM_CATALOG,
  LEGACY_PROFILE_COMPATIBILITY,
  KOREAN_GRADE_STAGES,
  KOREAN_2022_SUBJECT_STAGES,
} = await import(moduleUrl);

const requiredFields = [
  'system',
  'curriculumVersion',
  'schoolLevel',
  'representativeGrades',
  'officialType',
  'subject',
  'unitIds',
  'availability',
  'evidenceStatus',
  'labels',
];
const allowedAvailability = new Set(['hidden', 'planned', 'partial', 'ready']);
const allowedEvidence = new Set(['catalogued', 'sourced', 'analyzed', 'implemented', 'validated', 'localized', 'published']);
const failures = [];

for (const node of CURRICULUM_CATALOG.nodes) {
  for (const field of requiredFields) {
    if (!(field in node) || node[field] == null) failures.push(`${node.id}: missing ${field}`);
  }
  if (!['KR', 'INTL'].includes(node.system)) failures.push(`${node.id}: invalid system ${node.system}`);
  if (!allowedAvailability.has(node.availability)) failures.push(`${node.id}: invalid availability ${node.availability}`);
  if (!allowedEvidence.has(node.evidenceStatus)) failures.push(`${node.id}: invalid evidence ${node.evidenceStatus}`);
  if (!node.labels.ko || !node.labels.en) failures.push(`${node.id}: ko/en labels are required in Phase 1`);
  if (node.availability === 'planned' && node.route) failures.push(`${node.id}: planned topic must not have a public route`);
  if (node.evidenceStatus === 'catalogued' && node.availability === 'ready') failures.push(`${node.id}: catalogued-only topic cannot be ready`);
}

const duplicateIds = CURRICULUM_CATALOG.nodes
  .map((node) => node.id)
  .filter((id, index, ids) => ids.indexOf(id) !== index);
if (duplicateIds.length) failures.push(`duplicate ids: ${duplicateIds.join(', ')}`);

const duplicateCanonicalKeys = CURRICULUM_CATALOG.nodes
  .map((node) => node.canonicalKey)
  .filter((key, index, keys) => keys.indexOf(key) !== index);
if (duplicateCanonicalKeys.length) failures.push(`duplicate canonical keys: ${duplicateCanonicalKeys.join(', ')}`);

for (const entry of CURRICULUM_CATALOG.indexEntries) {
  const target = CURRICULUM_CATALOG.nodes.find((node) => node.indexEntryIds.includes(entry.id));
  if (!target) failures.push(`orphan index entry: ${entry.id}`);
}

const requiredLegacyProfiles = [
  'kr-high-1',
  'kr-high-2-algebra',
  'kr-high-2-calculus-1',
  'kr-high-2-probability-statistics',
  'kr-high-3-calculus-2',
  'kr-high-3-geometry',
  'pre-algebra',
  'algebra-1',
  'algebra-2',
  'precalculus',
];
for (const profileId of requiredLegacyProfiles) {
  if (!LEGACY_PROFILE_COMPATIBILITY[profileId]) failures.push(`missing legacy profile mapping: ${profileId}`);
}

const expectedGradeStageIds = [
  ...Array.from({ length: 6 }, (_, index) => `kr-elem-${index + 1}`),
  'kr-middle-1-grade',
  'kr-middle-2-grade',
  'kr-middle-3-grade',
  'kr-high-1-grade',
  'kr-high-2-grade',
  'kr-high-3-grade',
];
if (JSON.stringify(KOREAN_GRADE_STAGES.map((stage) => stage.id)) !== JSON.stringify(expectedGradeStageIds)) {
  failures.push('Phase 2 grade index must cover Korean grades 1–12 in order');
}

const expectedOfficialTypes = ['common', 'general-elective', 'career-elective', 'convergence-elective', 'professional'];
if (JSON.stringify(KOREAN_2022_SUBJECT_STAGES.map((stage) => stage.officialType)) !== JSON.stringify(expectedOfficialTypes)) {
  failures.push('Phase 2 official-subject index is incomplete or out of order');
}

const highSchoolCopy = KOREAN_GRADE_STAGES
  .filter((stage) => stage.level === 'high')
  .flatMap((stage) => [stage.title, stage.subtitle, ...stage.topics.map((topic) => topic.label)])
  .join(' ');
for (const requiredLabel of ['수학(상)', '수학(하)', '수학Ⅰ', '수학Ⅱ', '미적분', '기하']) {
  if (!highSchoolCopy.includes(requiredLabel)) failures.push(`Phase 2 missing classic high-school label: ${requiredLabel}`);
}
if (/Complete|전 영역/.test(highSchoolCopy)) failures.push('Phase 2 contains an unaudited completeness claim');

const explorerSource = await fs.readFile(new URL('../app/CurriculumExplorer.js', import.meta.url), 'utf8');
if (!explorerSource.includes("useState('grade')")) failures.push('Korean curriculum must default to the grade view');
for (const level of ['elementary', 'middle', 'high']) {
  if (!explorerSource.includes(`id: '${level}'`)) failures.push(`Phase 2 missing school-level group: ${level}`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

const summary = CURRICULUM_CATALOG.nodes.reduce((result, node) => {
  result[node.evidenceStatus] = (result[node.evidenceStatus] || 0) + 1;
  return result;
}, {});
console.log(`Curriculum Phases 1–2 verified: ${CURRICULUM_CATALOG.nodes.length} nodes`);
console.log(`Evidence status: ${JSON.stringify(summary)}`);
console.log(`Legacy profiles: ${Object.keys(LEGACY_PROFILE_COMPATIBILITY).length}`);
