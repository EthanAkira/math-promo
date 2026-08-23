'use client';

import { useLanguage } from '../../language';
import { tr } from '../../i18n';

export default function IntegerRationalIntro() {
  const { language } = useLanguage();
  return <>
    <p className="no-print" style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 6 }}><a href="/">{tr(language, 'home')}</a> / {tr(language, 'middle')} / {tr(language, 'integerCrumb')}</p>
    <h1 className="font-display no-print" style={{ fontSize: 26, margin: '0 0 8px' }}>{tr(language, 'integerTitle')}</h1>
    <p className="no-print" style={{ color: 'var(--ink-soft)', margin: '0 0 28px' }}>{tr(language, 'middleDesc')}</p>
  </>;
}
