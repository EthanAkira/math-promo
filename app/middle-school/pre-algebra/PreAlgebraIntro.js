'use client';

import { useLanguage } from '../../language';
import { tr } from '../../i18n';
import { preAlgebraCopy } from './localization';

export default function PreAlgebraIntro() {
  const { language } = useLanguage();
  const copy = preAlgebraCopy(language);
  return <>
    <p className="no-print" style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 6 }}><a href="/">{tr(language, 'home')}</a> / {copy.breadcrumb}</p>
    <h1 className="font-display" style={{ fontSize: 28, margin: '0 0 12px' }}>{copy.title}</h1>
    <div className="no-print" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
      {copy.tags.map((label) => <span key={label} style={{ padding: '6px 10px', borderRadius: 999, background: '#edf6f5', color: '#245c59', fontSize: 12, fontWeight: 700 }}>{label}</span>)}
    </div>
  </>;
}
