'use client';

import PremiumBook from '../PremiumBook';

const CFG = {
  api: 'marple-calc1',
  title: '마플 수능기출 미적분Ⅰ 유형별 문제집',
  subjects: ['csat', 'curriculum-advanced'],
  typeCount: 19,
  sections: [
    { code: 'p', label: '유형별 기출' },
    { code: 'h', label: '고난도(사관학교·경찰대 기출)' },
  ],
  intro: '「마플 수능기출 미적분Ⅰ」(2017) 1,367문항을 19개 유형으로 재배치했습니다. 수능·평가원·교육청 기출은 “유형별 기출”에, 사관학교·경찰대 기출과 고난도 문제는 “고난도”에 담았고, 문항은 원문 그대로(변형 없이) 이미지로 보여 주며 풀이 이미지와 정답·채점을 함께 제공합니다. 원하면 같은 유형의 유사문제를 새로 생성해 풀어 볼 수 있습니다.',
  groups: [
    { grade: 'g3', title: '미적분 · 수열의 극한', desc: '수열의 극한 · 급수 · 등비급수의 활용' },
    { grade: 'g2', title: '수학Ⅱ(2022 개정 미적분Ⅰ) · 함수의 극한과 연속 · 미분 · 적분', desc: '극한·연속 → 미분계수·접선·극값·속도 → 부정적분·정적분·넓이' },
  ],
  related: {},
  csatLinks: { 'sequence-limits': '/csat/units?unit=sequence-limits', 'limits-continuity': '/csat/units?unit=limits-continuity', differentiation: '/csat/units?unit=differentiation', integration: '/csat/units?unit=integration' },
};

export default function MarpleCalc1Premium() {
  return <PremiumBook cfg={CFG} />;
}
