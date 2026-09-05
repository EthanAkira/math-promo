// Server-only registry mapping a basic-figures unit id to its "advanced tier" generator function.
// Only units listed here have advanced content; every id matches a free client-side unit id in
// app/middle-school/basic-figures/catalog.js so the same URL (?unit=...) works for both tiers —
// the tier switch happens client-side (see BasicFiguresGenerator.js), not via a different unit id.
import { TRANSFORMATIONS_ADVANCED_ENGINES } from './transformationsAdvancedEngine.js';
import { LOGICAL_REASONING_ADVANCED_ENGINES } from './logicalReasoningAdvancedEngine.js';

export const CURRICULUM_ADVANCED_ENGINES = {
  ...TRANSFORMATIONS_ADVANCED_ENGINES,
  ...LOGICAL_REASONING_ADVANCED_ENGINES,
};

export function findAdvancedGenerator(unitId) {
  return CURRICULUM_ADVANCED_ENGINES[unitId] || null;
}
