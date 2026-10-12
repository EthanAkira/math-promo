import { generateAmcVariantProblem } from '../amc/amcProblemGenerator';
import { amcMappingsFor } from './practiceLinks';

// AMC-style practice used to be a separate link. It is now one more unit inside the 응용문제 level:
// each AMC unit's algorithmic generator is wrapped so the worksheet pages can treat it like any other
// applied unit ({ id, label, description, en, make(random) }).
//
// The AMC generators call Math.random() internally, so `random` (the sheet's seeded PRNG) is swapped in
// for the duration of one synchronous call and restored right after.
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateWith(random, amcUnit, language) {
  const original = Math.random;
  Math.random = random;
  try {
    return generateAmcVariantProblem(amcUnit, language);
  } finally {
    Math.random = original;
  }
}

const clean = (text) => String(text ?? '').replace(/\*\*/g, '');

export function amcAppliedUnit(amcUnitId, label, labelEn) {
  const amcUnit = { id: amcUnitId, label, labelEn: labelEn || label };
  return {
    id: `applied-amc-${amcUnitId}`,
    label: `[AMC 스타일] ${label} 응용`,
    description: `미국수학경시대회(AMC) 스타일의 ${label} 응용 문제 (객관식)`,
    en: [`[AMC Style] ${labelEn || label} Applied`, `AMC-style multiple-choice applied problems on ${labelEn || label}`],
    amcUnitId,
    make(random) {
      // The ko and en versions are generated from the same seed so they describe the same problem.
      const seed = Math.floor(random() * 2147483647);
      const ko = generateWith(mulberry32(seed), amcUnit, 'ko');
      const en = generateWith(mulberry32(seed), amcUnit, 'en');
      const labelsKo = ko.choices.map(clean);
      const labelsEn = en.choices.map(clean);
      return {
        prompt: clean(ko.question),
        promptEn: clean(en.question),
        expression: '',
        choices: labelsKo.map((text, index) => ({ value: String(index + 1), label: text, labelEn: labelsEn[index] ?? text })),
        answer: String(ko.correctAnswer + 1),
        explanation: clean(ko.explanation),
        explanationEn: clean(en.explanation),
      };
    },
  };
}

// For catalogs whose units are many and individually mapped (pre-algebra, basic-figures): one AMC applied
// unit per distinct AMC unit, filed under the category/profiles of the first catalog unit it was linked from.
export function amcUnitsForPath(path, baseUnits) {
  const byAmc = new Map();
  amcMappingsFor(path).forEach(({ unitId, amcUnitId }) => {
    const base = baseUnits.find((unit) => unit.id === unitId);
    if (!base) return;
    const existing = byAmc.get(amcUnitId);
    if (existing) {
      if (base.profiles && existing.profiles) existing.profiles = [...new Set([...existing.profiles, ...base.profiles])];
      return;
    }
    byAmc.set(amcUnitId, {
      ...amcAppliedUnit(amcUnitId, String(base.label).replace(/^\[[^\]]+\]\s*/, ''), base.en?.[0]),
      category: base.category,
      profiles: base.profiles ? [...base.profiles] : undefined,
      tier: 'intermediate',
    });
  });
  return [...byAmc.values()];
}
