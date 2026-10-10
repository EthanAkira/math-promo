'use client';

import PremiumBook from '../PremiumBook';

const CFG = {
  api: 'jjang-geo',
  title: '기하와 벡터 유형별 기출·응용 문제',
  solPrefix: 'gsol',
  solMax: 71,
  typeCount: 17,
  groups: [
    { grade: 'g3', title: '고3 · 기하 (이차곡선 · 평면벡터)', desc: '포물선 · 타원 · 쌍곡선 · 이차곡선의 접선 · 평면벡터 (유형 1~3, 5~8)' },
    { grade: 'g3b', title: '고3 · 기하 (미분 활용 · 공간도형과 공간좌표)', desc: '음함수·매개변수 미분 · 속도와 가속도 · 삼수선의 정리 · 정사영 · 공간좌표 · 구 · 공간벡터 · 직선과 평면' },
  ],
  related: {},
  csatLinks: { 'conic-sections': '/csat/units?unit=conic-sections', 'plane-vectors': '/csat/units?unit=plane-vectors', 'space-geometry': '/csat/units?unit=space-geometry', 'advanced-differentiation': '/csat/units?unit=advanced-differentiation' },
};

export default function GeometryPremium() {
  return <PremiumBook cfg={CFG} />;
}
