import { GRADE_CATALOG } from './elementary/practice/catalog';
import { PRIME_UNITS } from './middle-school/prime-factorization/catalog';
import { GCD_LCM_UNITS } from './middle-school/gcd-lcm/catalog';
import { INTEGER_RATIONAL_UNITS } from './middle-school/integers-rationals/catalog';
import { ALGEBRA_UNITS } from './middle-school/algebra-basics/catalog';
import { COORDINATE_UNITS } from './middle-school/coordinate-plane/catalog';
import { PROPORTION_UNITS } from './middle-school/proportion/catalog';
import { PRE_ALGEBRA_PROFILES, finalizeGeneratedProblem, unitsForProfile } from './middle-school/pre-algebra/catalog';
import { BASIC_FIGURE_UNITS } from './middle-school/basic-figures/catalog';
import { GEOMETRY_PROFILES } from './middle-school/basic-figures/geometryProfiles';
import { difficultyRuleForUnit } from './problemEvidence';

function hashSeed(text) {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededRandom(seedText) {
  let value = hashSeed(seedText);
  return function next() {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function hasInvalidNumber(value) {
  if (typeof value === 'number') return !Number.isFinite(value);
  if (!value || typeof value !== 'object') return false;
  return Object.values(value).some(hasInvalidNumber);
}

function stableProblemValue(item) {
  return JSON.stringify(item, (key, value) => (typeof value === 'function' ? undefined : value));
}

function difficultyMetadata(item, unit) {
  const expression = String(item.expression || '');
  const prompt = String(item.prompt || '');
  const reasoningSteps = Math.max(1, item.solutionSteps?.length || (expression.match(/[+−\-×÷=]/g)?.length || 0) + 1);
  const conceptCount = Math.max(1, item.theorems?.length || 1);
  const numberComplexity = Math.min(20, (expression.match(/\d+/g)?.join('').length || 0));
  const symbolCount = Math.min(12, (expression.match(/[π√^/]/g)?.length || 0));
  const conditionCount = Math.min(8, (prompt.match(/,|이고|이며|when|if|given/gi)?.length || 0));
  const visualInterpretation = item.diagram || item.table || item.frequencyTable || item.stemLeaf ? 1 : 0;
  const branchCount = Math.max(1, item.choices?.length || 1);
  const score = Math.min(100, reasoningSteps * 8 + conceptCount * 7 + numberComplexity + symbolCount * 2 + conditionCount * 3 + visualInterpretation * 10 + Math.min(10, branchCount));
  const level = score < 30 ? 'foundation' : score < 55 ? 'standard' : score < 80 ? 'advanced' : 'challenge';
  return { level, score, reasoningSteps, conceptCount, numberComplexity, symbolCount, conditionCount, visualInterpretation, branchCount, rule: difficultyRuleForUnit(unit) };
}

function validateProblem(item, unit) {
  const errors = [];
  if (!item || typeof item !== 'object') return ['generator did not return an object'];
  const answer = String(item.answer ?? '').trim();
  if (!answer) errors.push('answer is empty');
  const hasStructuredExpression = item.kind === 'vertical'
    && Number.isFinite(item.a)
    && Number.isFinite(item.b)
    && Boolean(item.operator);
  if (!String(item.prompt || '').trim() && !String(item.expression || '').trim() && !hasStructuredExpression) errors.push('prompt and expression are both empty');
  if (hasInvalidNumber(item) || /(?:NaN|undefined|Infinity)/.test(stableProblemValue(item))) errors.push('problem contains an invalid value');
  if (item.choices?.length) {
    const values = item.choices.map((choice, index) => String(choice.value ?? index + 1));
    if (!values.includes(answer) && !(Number(answer) >= 1 && Number(answer) <= item.choices.length)) errors.push('choice answer is out of range');
  }
  const difficulty = difficultyMetadata(item, unit);
  if (!difficulty.rule.allowedLevels.includes(difficulty.level)) errors.push(`difficulty ${difficulty.level} is outside the unit rule`);
  return errors;
}

function generateTwice(subjectId, unit, profile, seed, finalize) {
  const make = () => {
    const random = seededRandom(`${subjectId}:${unit.id}:${seed}`);
    const raw = unit.make(random, profile);
    return finalize ? finalize(raw, unit) : raw;
  };
  return [make(), make()];
}

function subjectDefinitions() {
  const elementary = GRADE_CATALOG.map((grade) => ({ id: `elementary-grade-${grade.id}`, engine: 'elementary/practice', units: grade.units }));
  const standalone = [
    ['prime-factorization', PRIME_UNITS],
    ['gcd-lcm', GCD_LCM_UNITS],
    ['integers-rationals', INTEGER_RATIONAL_UNITS],
    ['algebra-basics', ALGEBRA_UNITS],
    ['coordinate-plane', COORDINATE_UNITS],
    ['proportion', PROPORTION_UNITS],
  ].map(([id, units]) => ({ id, engine: `middle-school/${id}`, units }));
  const algebra = PRE_ALGEBRA_PROFILES.map((profile) => ({
    id: `pre-algebra:${profile.id}`,
    engine: 'middle-school/pre-algebra',
    profile,
    units: unitsForProfile(profile.id),
    finalize: finalizeGeneratedProblem,
  }));
  const geometry = GEOMETRY_PROFILES.map((profile) => ({
    id: `basic-figures:${profile.id}`,
    engine: 'middle-school/basic-figures',
    profile,
    units: BASIC_FIGURE_UNITS.filter((unit) => !unit.profiles || unit.profiles.includes(profile.id)),
  }));
  return [...elementary, ...standalone, ...algebra, ...geometry];
}

export function runCurriculumSeedValidation(seedCount = 100) {
  const subjects = [];
  let generatedCount = 0;
  for (const subject of subjectDefinitions()) {
    const failures = [];
    if (!subject.units.length) failures.push('subject has no units');
    for (let seedIndex = 0; seedIndex < seedCount && subject.units.length; seedIndex += 1) {
      const unit = subject.units[seedIndex % subject.units.length];
      try {
        const [first, second] = generateTwice(subject.id, unit, subject.profile, `AUTO${seedIndex + 1}`, subject.finalize);
        generatedCount += 1;
        const errors = validateProblem(first, unit);
        if (stableProblemValue(first) !== stableProblemValue(second)) errors.push('same seed is not deterministic');
        if (errors.length && failures.length < 20) failures.push(`${unit.id} seed ${seedIndex + 1}: ${errors.join(', ')}`);
      } catch (error) {
        if (failures.length < 20) failures.push(`${unit.id} seed ${seedIndex + 1}: ${error.message}`);
      }
    }
    subjects.push({ id: subject.id, engine: subject.engine, seedCount, unitCount: subject.units.length, status: failures.length ? 'failed' : 'passed', failures });
  }
  const failedSubjects = subjects.filter((subject) => subject.status === 'failed');
  return Object.freeze({
    generatedAt: 'build-time',
    seedCountPerSubject: seedCount,
    subjectCount: subjects.length,
    generatedCount,
    passedSubjectCount: subjects.length - failedSubjects.length,
    failedSubjectCount: failedSubjects.length,
    status: failedSubjects.length ? 'failed' : 'passed',
    subjects,
  });
}

export function assertCurriculumSeedValidation(seedCount = 100) {
  const report = runCurriculumSeedValidation(seedCount);
  if (report.status === 'failed') {
    const details = report.subjects.filter((subject) => subject.status === 'failed').map((subject) => `${subject.id}: ${subject.failures.join(' | ')}`).join('\n');
    throw new Error(`Curriculum seed validation failed\n${details}`);
  }
  return report;
}
