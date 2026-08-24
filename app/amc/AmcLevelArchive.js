'use client';

import { useLanguage } from '../language';
import { AMC_ARCHIVE, fileKind } from './data';

const COPY = {
  ko: {
    home: '홈', hub: 'AMC 기출문제',
    empty: '아직 업로드된 자료가 없습니다. 문의하기를 통해 자료를 요청하거나 제안해주세요.',
    problems: '문제지', solutions: '해설지', answers: '정답지',
    preview: '미리보기', download: '다운로드',
  },
  en: {
    home: 'Home', hub: 'AMC Archive',
    empty: 'No files uploaded yet. Feel free to request or suggest materials via Contact.',
    problems: 'Problems', solutions: 'Solutions', answers: 'Answer Key',
    preview: 'Preview', download: 'Download',
  },
};

const FILE_ICONS = { pdf: '📄', txt: '📝', file: '📁' };
const FILE_ORDER = ['problems', 'solutions', 'answers'];

export default function AmcLevelArchive({ level, label, description }) {
  const { language } = useLanguage();
  const words = COPY[language] || COPY.en;
  const years = [...(AMC_ARCHIVE[level] || [])].sort((a, b) => b.year - a.year);

  return <>
    <p className="no-print" style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 6 }}>
      <a href="/">{words.home}</a> / <a href="/amc.html">{words.hub}</a> / {label}
    </p>
    <h1 className="font-display" style={{ fontSize: 26, margin: '0 0 8px' }}>{label}</h1>
    <p style={{ color: 'var(--ink-soft)', margin: '0 0 28px' }}>{description}</p>

    {years.length === 0 ? <p style={{ padding: 24, background: 'var(--card-bg)', border: '1px dashed var(--paper-line)', borderRadius: 'var(--radius)', color: 'var(--ink-soft)', textAlign: 'center' }}>{words.empty}</p> : null}

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
                const kind = fileKind(fileEntry.url);
                return <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', background: 'var(--paper)', borderRadius: 8, fontSize: 13 }}>
                  <span aria-hidden="true">{FILE_ICONS[kind]}</span>
                  <span style={{ fontWeight: 700 }}>{words[key]}</span>
                  <a href={fileEntry.url} target="_blank" rel="noreferrer" style={{ color: 'var(--ink)', textDecoration: 'underline' }}>{words.preview}</a>
                  <a href={fileEntry.url} download style={{ color: 'var(--red-pen)', fontWeight: 700, textDecoration: 'none' }}>{words.download}</a>
                </div>;
              })}
            </div>
          </div>)}
        </div>
      </article>)}
    </div>
  </>;
}
