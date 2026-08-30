import { PRE_ALGEBRA_PROFILES, PRE_ALGEBRA_UNITS } from './middle-school/pre-algebra/catalog';
import { KOREAN_ELECTIVE_UNITS } from './middle-school/pre-algebra/koreanElectivesEngine';
import { BASIC_FIGURE_UNITS } from './middle-school/basic-figures/catalog';

function auditUnit(unit, engine) {
  const profileIds = [...new Set([...(unit.profiles || []), ...(unit.curriculumProfiles || [])])];
  return Object.freeze({
    id: unit.id,
    engine,
    category: unit.category || 'geometry',
    profileIds,
    implementationStatus: typeof unit.make === 'function' ? 'implemented' : 'catalogued',
    evidenceStatus: 'needs-audit',
    validationStatus: 'not-validated',
    localizationStatus: unit.en || unit.labels?.en ? 'ko-en-present' : 'needs-audit',
  });
}

const preAlgebraUnits = PRE_ALGEBRA_UNITS.map((unit) => auditUnit(unit, 'pre-algebra'));
const geometryUnits = BASIC_FIGURE_UNITS.map((unit) => auditUnit(unit, 'basic-figures'));

export const CURRICULUM_ENGINE_AUDIT = Object.freeze({
  auditedAt: '2026-08-30',
  policy: 'Implementation does not imply validation, localization, or publication approval.',
  profiles: PRE_ALGEBRA_PROFILES.map((profile) => Object.freeze({
    id: profile.id,
    unitIds: preAlgebraUnits.filter((unit) => unit.profileIds.includes(profile.id)).map((unit) => unit.id),
    evidenceStatus: 'needs-audit',
  })),
  engines: Object.freeze({
    'pre-algebra': preAlgebraUnits,
    'basic-figures': geometryUnits,
  }),
  disconnectedDrafts: KOREAN_ELECTIVE_UNITS.map((unit) => Object.freeze({
    id: unit.id,
    profileIds: unit.profiles || [],
    implementationStatus: typeof unit.make === 'function' ? 'implemented' : 'catalogued',
    evidenceStatus: 'needs-audit',
    visibility: 'draft-hidden',
    catalogConnected: false,
  })),
});

export function findEngineAuditUnit(unitId) {
  return [...preAlgebraUnits, ...geometryUnits].find((unit) => unit.id === unitId) || null;
}
