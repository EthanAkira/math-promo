export const EVIDENCE_STAGES = Object.freeze([
  'catalogued',
  'sourced',
  'analyzed',
  'implemented',
  'validated',
  'localized',
  'published',
]);

export const DIFFICULTY_LEVELS = Object.freeze({
  foundation: { minScore: 0, maxScore: 29, maxReasoningSteps: 2, maxConcepts: 1 },
  standard: { minScore: 30, maxScore: 54, maxReasoningSteps: 4, maxConcepts: 2 },
  advanced: { minScore: 55, maxScore: 79, maxReasoningSteps: 7, maxConcepts: 4 },
  challenge: { minScore: 80, maxScore: 100, maxReasoningSteps: 12, maxConcepts: 7 },
});

const ADVANCED_CATEGORY_PATTERN = /미적분|기하|벡터|통계적 추정|행렬|복소수|삼각함수|calculus|geometry|vector/i;
const FOUNDATION_CATEGORY_PATTERN = /기초|수와 연산|소수|약수|정수|number|operation/i;

export function difficultyRuleForUnit(unit) {
  const text = `${unit.category || ''} ${unit.label || ''} ${unit.description || ''}`;
  const defaultLevel = ADVANCED_CATEGORY_PATTERN.test(text)
    ? 'advanced'
    : FOUNDATION_CATEGORY_PATTERN.test(text) ? 'foundation' : 'standard';
  return Object.freeze({
    defaultLevel,
    allowedLevels: ['foundation', 'standard', 'advanced', 'challenge'],
    factors: ['reasoningSteps', 'conceptCount', 'numberComplexity', 'symbolCount', 'conditionCount', 'visualInterpretation', 'branchCount'],
    levels: DIFFICULTY_LEVELS,
  });
}

export function analyzeProblemFamily(unit, engine, profileIds = []) {
  return Object.freeze({
    id: `${engine}:${unit.id}`,
    unitId: unit.id,
    engine,
    problemType: 'generated-family',
    source: {
      type: 'original-generator',
      reference: `app/${engine}/${unit.id}`,
      rights: 'original-implementation',
    },
    analysis: {
      fixedElements: ['prompt structure', 'solution rule', 'answer representation'],
      variables: ['seeded numeric parameters', 'problem variant', 'display representation'],
      constraints: ['defined answer', 'deterministic seed', 'valid choice index when multiple choice'],
      solutionRule: 'unit.make(random, profile) followed by engine finalization',
      answerValidation: 'determinism and property validation over at least 100 seeds per subject/profile',
    },
    profileIds,
    difficultyRules: difficultyRuleForUnit(unit),
    implementationStatus: typeof unit.make === 'function' ? 'implemented' : 'catalogued',
    validationStatus: 'automated-pending',
    displayReviewStatus: 'not-reviewed',
    evidenceStatus: typeof unit.make === 'function' ? 'implemented' : 'catalogued',
    visibility: 'admin-preview',
  });
}

export function validateEvidenceRecord(record) {
  const errors = [];
  if (!record?.unitId) errors.push('unitId is required');
  if (!record?.problemType) errors.push('problemType is required');
  if (!record?.source?.type) errors.push('source.type is required');
  if (!record?.source?.reference) errors.push('source.reference is required');
  if (!record?.source?.rights) errors.push('source.rights is required');
  for (const field of ['fixedElements', 'variables', 'constraints', 'solutionRule', 'answerValidation']) {
    if (!record?.analysis?.[field] || (Array.isArray(record.analysis[field]) && !record.analysis[field].length)) {
      errors.push(`analysis.${field} is required`);
    }
  }
  if (!EVIDENCE_STAGES.includes(record?.evidenceStatus)) errors.push('invalid evidenceStatus');
  if (!record?.difficultyRules?.allowedLevels?.length) errors.push('difficultyRules are required');
  return errors;
}

export function canPublishEvidence(record) {
  return validateEvidenceRecord(record).length === 0
    && EVIDENCE_STAGES.indexOf(record.evidenceStatus) >= EVIDENCE_STAGES.indexOf('localized')
    && record.validationStatus === 'passed'
    && record.displayReviewStatus === 'passed';
}
