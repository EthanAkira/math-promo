'use client';

import { useLanguage } from '../../language';
import { isNonKorean, tr } from '../../i18n';

export default function BasicFiguresIntro() {
  const { language } = useLanguage();
  const foreign = isNonKorean(language);
  return <>
    <p className="no-print" style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 6 }}><a href="/">{tr(language, 'home')}</a> / {foreign ? 'Geometry' : '도형·기하'}</p>
    <h1 className="font-display no-print" style={{ fontSize: 26, margin: '0 0 24px' }}>{foreign ? 'Geometry & Visual Mathematics Generator' : '도형·기하·시각화 문제 생성기'}</h1>
  </>;
}
