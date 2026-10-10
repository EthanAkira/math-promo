'use client';

import PremiumBook from '../PremiumBook';

const CFG = {
  api: 'jjang-calc1',
  title: '미적분 유형별 기출·응용 문제',
  solPrefix: 'sol',
  solMax: 56,
  typeCount: 17,
  groups: [
    { grade: 'g2', title: '고2 · 수학Ⅱ (2022 개정 미적분Ⅰ)', desc: '함수의 극한과 연속 · 미분 · 적분' },
    { grade: 'g3', title: '고3 · 미적분 (수열의 극한)', desc: '수열의 극한 · 급수 · 등비급수의 활용' },
  ],
  // Which AMC / AP unit each type connects to (kept in sync with examUnits.js / the AMC archive).
  related: {
    1: [{ label: 'AMC · 수열과 규칙성', href: '/amc/units?unit=sequences-patterns' }],
    2: [{ label: 'AMC · 등비수열과 급수', href: '/amc/units?unit=geometric-series' }],
    3: [{ label: 'AMC · 등비수열과 급수', href: '/amc/units?unit=geometric-series' }],
    5: [{ label: 'AMC · 등비수열과 급수', href: '/amc/units?unit=geometric-series' }],
  },
  csatLinks: { 'sequence-limits': '/csat/units?unit=sequence-limits', 'limits-continuity': '/csat/units?unit=limits-continuity', differentiation: '/csat/units?unit=differentiation', integration: '/csat/units?unit=integration' },
};

export default function Calculus1Premium() {
  return <PremiumBook cfg={CFG} />;
}
