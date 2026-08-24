'use client';

import { useLanguage } from '../language';
import { tr } from '../i18n';
import { NOTICES, localizeNotice } from './data';

export default function NoticesList() {
  const { language } = useLanguage();
  const sorted = [...NOTICES].sort((a, b) => (a.date < b.date ? 1 : -1));

  return <>
    <p className="no-print" style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 6 }}><a href="/">{tr(language, 'home')}</a> / {tr(language, 'noticesCrumb')}</p>
    <h1 className="font-display" style={{ fontSize: 26, margin: '0 0 8px' }}>{tr(language, 'noticesTitle')}</h1>
    <p style={{ color: 'var(--ink-soft)', margin: '0 0 28px' }}>{tr(language, 'noticesDesc')}</p>

    <div style={{ display: 'grid', gap: 14 }}>
      {sorted.map((notice) => <article key={notice.id} style={{ padding: '20px 22px', background: 'var(--card-bg)', border: '1px solid var(--paper-line)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
        <p className="font-mono" style={{ margin: '0 0 8px', color: 'var(--red-pen)', fontSize: 12, fontWeight: 700 }}>{notice.date}</p>
        <h2 style={{ margin: '0 0 8px', fontSize: 18 }}>{localizeNotice(notice, language, 'title')}</h2>
        <p style={{ margin: 0, color: 'var(--ink-soft)', lineHeight: 1.7 }}>{localizeNotice(notice, language, 'body')}</p>
      </article>)}
    </div>
  </>;
}
