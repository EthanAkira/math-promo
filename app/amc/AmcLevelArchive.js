'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '../language';

const COPY = {
  ko: {
    home: '홈', hub: 'AMC 기출문제',
    empty: '아직 업로드된 자료가 없습니다. 문의하기를 통해 자료를 요청하거나 제안해주세요.',
    loading: '자료를 불러오는 중입니다...',
    error: '자료를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.',
    problems: '문제지', solutions: '해설지', answers: '정답지',
    preview: '미리보기', download: '다운로드', upload: '자료 업로드',
  },
  en: {
    home: 'Home', hub: 'AMC Archive',
    empty: 'No files uploaded yet. Feel free to request or suggest materials via Contact.',
    loading: 'Loading archive...',
    error: 'Could not load the archive. Please try again shortly.',
    problems: 'Problems', solutions: 'Solutions', answers: 'Answer Key',
    preview: 'Preview', download: 'Download', upload: 'Upload materials',
  },
};

const FILE_ORDER = ['problems', 'solutions', 'answers'];

export default function AmcLevelArchive({ level, label, description }) {
  const { language } = useLanguage();
  const words = COPY[language] || COPY.en;
  const [manifest, setManifest] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let cancelled = false;
    fetch('/api/amc/manifest')
      .then((res) => { if (!res.ok) throw new Error('bad response'); return res.json(); })
      .then((data) => { if (!cancelled) { setManifest(data); setStatus('ready'); } })
      .catch(() => { if (!cancelled) setStatus('error'); });
    return () => { cancelled = true; };
  }, []);

  const years = manifest ? [...(manifest[level] || [])].sort((a, b) => b.year - a.year) : [];

  return <>
    <p className="no-print" style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 6 }}>
      <a href="/">{words.home}</a> / <a href="/amc.html">{words.hub}</a> / {label}
    </p>
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
      <h1 className="font-display" style={{ fontSize: 26, margin: 0 }}>{label}</h1>
      <a href="/amc/admin" className="button button-secondary" style={{ textDecoration: 'none' }}>{words.upload}</a>
    </div>
    <p style={{ color: 'var(--ink-soft)', margin: '0 0 28px' }}>{description}</p>

    {status === 'loading' ? <p style={{ color: 'var(--ink-soft)' }}>{words.loading}</p> : null}
    {status === 'error' ? <p style={{ color: 'var(--red-pen)' }}>{words.error}</p> : null}
    {status === 'ready' && years.length === 0 ? <p style={{ padding: 24, background: 'var(--card-bg)', border: '1px dashed var(--paper-line)', borderRadius: 'var(--radius)', color: 'var(--ink-soft)', textAlign: 'center' }}>{words.empty}</p> : null}

    <div style={{ display: 'grid', gap: 14 }}>
      {years.map((entry) => <article key={entry.year} style={{ padding: 20, background: 'var(--card-bg)', border: '1px solid var(--paper-line)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
        <h2 style={{ margin: '0 0 12px', fontSize: 18 }}>{entry.year}</h2>
        <div style={{ display: 'grid', gap: 10 }}>
          {entry.variants.map((variant) => <div key={variant.id} style={{ paddingTop: entry.variants.length > 1 ? 8 : 0, borderTop: entry.variants.length > 1 ? '1px solid var(--paper-line)' : 'none' }}>
            {entry.variants.length > 1 ? <p style={{ margin: '0 0 8px', fontWeight: 700, color: 'var(--chalk-green)' }}>{variant.label}</p> : null}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {FILE_ORDER.map((key) => {
                const fileEntry = variant.files[key];
                if (!fileEntry) return null;
                return <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', background: 'var(--paper)', borderRadius: 8, fontSize: 13 }}>
                  <span style={{ fontWeight: 700 }}>{words[key]}</span>
                  <a href={`/api/amc/file?key=${encodeURIComponent(fileEntry.key)}`} target="_blank" rel="noreferrer" style={{ color: 'var(--ink)', textDecoration: 'underline' }}>{words.preview}</a>
                  <a href={`/api/amc/file?key=${encodeURIComponent(fileEntry.key)}&download=1`} style={{ color: 'var(--red-pen)', fontWeight: 700, textDecoration: 'none' }}>{words.download}</a>
                </div>;
              })}
            </div>
          </div>)}
        </div>
      </article>)}
    </div>
  </>;
}
