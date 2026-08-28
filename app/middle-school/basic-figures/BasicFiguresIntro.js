'use client';

import { useLanguage } from '../../language';
import { isNonKorean, tr } from '../../i18n';

export default function BasicFiguresIntro() {
  const { language } = useLanguage();
  const foreign = isNonKorean(language);
  return <>
    <p className="no-print" style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 6 }}><a href="/">{tr(language, 'home')}</a> / {foreign ? 'Geometry' : '도형·기하'}</p>
    <h1 className="font-display no-print" style={{ fontSize: 26, margin: '0 0 8px' }}>{foreign ? 'Geometry & Visual Mathematics Generator' : '도형·기하·시각화 문제 생성기'}</h1>
    <p className="no-print" style={{ color: 'var(--ink-soft)', margin: '0 0 28px' }}>{foreign ? 'Generate reproducible diagram-based worksheets from middle-school foundations through G12, AMC 12, IB and Korean CSAT geometry.' : '중등 기본 도형부터 G12·IB·AMC12·수능 기하와 미적분·통계 시각화까지 문제·SVG·정답·해설을 함께 생성합니다.'}</p>
  </>;
}
