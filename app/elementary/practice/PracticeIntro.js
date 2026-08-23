'use client';

import { useLanguage } from '../../language';
import { tr } from '../../i18n';

export default function PracticeIntro() {
  const { language } = useLanguage();
  return <>
    <p className="no-print" style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 6 }}><a href="/">{tr(language, 'home')}</a> / {tr(language, 'elementary')} / {tr(language, 'topicElementary')}</p>
    <h1 className="font-display no-print" style={{ fontSize: 26, margin: '0 0 8px' }}>{tr(language, 'elementaryTitle')}</h1>
    <p className="no-print" style={{ color: 'var(--ink-soft)', margin: '0 0 28px' }}>{tr(language, 'elementaryDesc')}</p>
  </>;
}
