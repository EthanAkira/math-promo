// Applied (paid) units are split into two worksheet tabs: 응용문제 (standard typed applied units) and
// 고난도 문제 (심화·발전·실력 UP, whole-unit mixes and exams). Decided from the unit label so every
// generator classifies the same way.
const EXPERT_LABEL = /(심화|발전|실력\s*UP|최고난도|단원 실전 다지기|종합|총괄|전 유형|혼합|모의)/;

export function appliedLevel(unit) {
  if (unit?.amcUnitId) return 'applied';
  return EXPERT_LABEL.test(String(unit?.label ?? '')) ? 'expert' : 'applied';
}

export function unitsForLevel(units, level) {
  const filtered = units.filter((unit) => appliedLevel(unit) === level);
  return filtered.length ? filtered : units;
}

export function expertTabLabel(language) {
  return language === 'ko' ? '고난도 문제 🔒' : 'Challenge 🔒';
}

// Level of any catalog unit (pre-algebra / basic-figures keep a hand-judged difficulty `tier`):
// applied-* units use the label rule above; others map basic→기본, intermediate→응용, advanced→고난도.
export function unitLevel(unit) {
  if (String(unit?.id ?? '').startsWith('applied-')) return appliedLevel(unit);
  if (unit?.tier === 'advanced') return 'expert';
  if (unit?.tier === 'intermediate') return 'applied';
  return 'basic';
}

export function levelTabLabels(language) {
  return language === 'ko'
    ? { basic: '기본 문제', applied: '응용문제', expert: '고난도 문제' }
    : { basic: 'Basic', applied: 'Applied', expert: 'Challenge' };
}
