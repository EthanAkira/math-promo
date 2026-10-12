// Applied (paid) units are split into two worksheet tabs: 응용문제 (standard typed applied units) and
// 고난도 문제 (심화·발전·실력 UP, whole-unit mixes and exams). Decided from the unit label so every
// generator classifies the same way.
const EXPERT_LABEL = /(심화|발전|실력\s*UP|최고난도|단원 실전 다지기|종합|총괄|전 유형|혼합|모의)/;

export function appliedLevel(unit) {
  return EXPERT_LABEL.test(String(unit?.label ?? '')) ? 'expert' : 'applied';
}

export function unitsForLevel(units, level) {
  const filtered = units.filter((unit) => appliedLevel(unit) === level);
  return filtered.length ? filtered : units;
}

export function expertTabLabel(language) {
  return language === 'ko' ? '고난도 문제 🔒' : 'Challenge 🔒';
}
