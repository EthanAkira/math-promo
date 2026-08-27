'use client';

import { useEffect, useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { useLanguage } from '../language';

const COPY = {
  ko: {
    home: '홈', hub: '수능 기출문제',
    empty: '아직 업로드된 자료가 없습니다. 문의하기를 통해 자료를 요청하거나 제안해주세요.',
    loading: '자료를 불러오는 중입니다...',
    error: '자료를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.',
    problems: '문제지', solutions: '해설지', answers: '정답지',
    download: '다운로드', upload: '자료 업로드', back: '목록으로',
    fileCount: (n) => `${n}개 파일`,
    textLoading: '내용을 불러오는 중입니다...',
    textError: '내용을 불러오지 못했습니다.',
    noFiles: '이 회차에는 아직 등록된 파일이 없습니다.',
  },
  en: {
    home: 'Home', hub: 'CSAT Archive',
    empty: 'No files uploaded yet. Feel free to request or suggest materials via Contact.',
    loading: 'Loading archive...',
    error: 'Could not load the archive. Please try again shortly.',
    problems: 'Problems', solutions: 'Solutions', answers: 'Answer Key',
    download: 'Download', upload: 'Upload materials', back: 'Back to list',
    fileCount: (n) => `${n} file${n === 1 ? '' : 's'}`,
    textLoading: 'Loading content...',
    textError: 'Could not load the content.',
    noFiles: 'No files for this session yet.',
  },
};

const FILE_ORDER = ['problems', 'solutions', 'answers'];

function fileKindFromName(filename) {
  const ext = (filename || '').split('.').pop().toLowerCase();
  if (ext === 'pdf') return 'pdf';
  if (ext === 'txt') return 'txt';
  return 'other';
}

// Tokenizes LaTeX math out of a line of text: $$block$$ or $inline$.
function tokenizeMath(text) {
  const tokens = [];
  const regex = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text))) {
    if (match.index > lastIndex) tokens.push({ type: 'text', value: text.slice(lastIndex, match.index) });
    tokens.push(match[1] !== undefined ? { type: 'block', value: match[1] } : { type: 'inline', value: match[2] });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) tokens.push({ type: 'text', value: text.slice(lastIndex) });
  return tokens;
}

function MathSpan({ token }) {
  if (token.type === 'text') return <>{token.value}</>;
  try {
    const html = katex.renderToString(token.value, { throwOnError: false, displayMode: token.type === 'block' });
    // eslint-disable-next-line react/no-danger
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  } catch {
    return <>{token.value}</>;
  }
}

// A "Problem N" (or "문제 N") line on its own starts a new problem section.
const PROBLEM_HEADING = /^(problem\s+\d+|문제\s*\d+)\b/i;

function ArticleBody({ text }) {
  const blocks = text.split(/\n\s*\n/).map((block) => block.trim()).filter(Boolean);
  return <div style={{ fontFamily: "'Gowun Batang', serif", fontSize: 17, color: 'var(--ink)' }}>
    {blocks.map((block, index) => {
      const [firstLine, ...rest] = block.split('\n');
      const isHeading = PROBLEM_HEADING.test(firstLine);
      const bodyText = isHeading ? rest.join('\n') : block;
      return <div key={index} style={{ marginTop: index === 0 ? 0 : 32 }}>
        {isHeading ? <h2 style={{ fontSize: 20, margin: '0 0 12px', paddingBottom: 8, borderBottom: '2px solid var(--paper-line)' }}>{firstLine}</h2> : null}
        {bodyText ? <p style={{ margin: 0, lineHeight: 1.9, whiteSpace: 'pre-line' }}>{tokenizeMath(bodyText).map((token, tokenIndex) => <MathSpan key={tokenIndex} token={token} />)}</p> : null}
      </div>;
    })}
  </div>;
}

function TxtArticle({ url, words }) {
  const [text, setText] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(url)
      .then((res) => { if (!res.ok) throw new Error('bad response'); return res.text(); })
      .then((value) => { if (!cancelled) setText(value); })
      .catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; };
  }, [url]);

  if (failed) return <p style={{ color: 'var(--red-pen)' }}>{words.textError}</p>;
  if (text === null) return <p style={{ color: 'var(--ink-soft)' }}>{words.textLoading}</p>;
  return <ArticleBody text={text} />;
}

function ExamSection({ typeLabel, fileEntry, words }) {
  const kind = fileKindFromName(fileEntry.filename);
  const previewUrl = `/api/csat/file?key=${encodeURIComponent(fileEntry.key)}`;
  const downloadUrl = `${previewUrl}&download=1`;

  return <section style={{ marginBottom: 32 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
      <h2 style={{ fontSize: 18, margin: 0 }}>{typeLabel}</h2>
      <a href={downloadUrl} style={{ fontSize: 13, color: 'var(--red-pen)', fontWeight: 700, textDecoration: 'none' }}>{words.download}</a>
    </div>
    {kind === 'txt' ? <div style={{ padding: 24, background: 'var(--card-bg)', border: '1px solid var(--paper-line)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}><TxtArticle url={previewUrl} words={words} /></div> : null}
    {kind === 'pdf' ? <iframe src={previewUrl} title={typeLabel} style={{ width: '100%', height: '88vh', minHeight: 700, border: '1px solid var(--paper-line)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }} /> : null}
    {kind === 'other' ? <a href={downloadUrl} className="button button-secondary" style={{ textDecoration: 'none' }}>{words.download}</a> : null}
  </section>;
}

export default function CsatExamArchive({ examType, label, description }) {
  const { language } = useLanguage();
  const words = COPY[language] || COPY.en;
  const [manifest, setManifest] = useState(null);
  const [status, setStatus] = useState('loading');
  const [selectedKey, setSelectedKey] = useState(null);

  useEffect(() => {
    function syncFromUrl() {
      const params = new URLSearchParams(window.location.search);
      const year = params.get('year');
      const variant = params.get('variant');
      setSelectedKey(year && variant ? `${year}:${variant}` : null);
    }
    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/csat/manifest')
      .then((res) => { if (!res.ok) throw new Error('bad response'); return res.json(); })
      .then((data) => { if (!cancelled) { setManifest(data); setStatus('ready'); } })
      .catch(() => { if (!cancelled) setStatus('error'); });
    return () => { cancelled = true; };
  }, []);

  const years = manifest ? [...(manifest[examType] || [])].sort((a, b) => b.year - a.year) : [];

  function openEntry(year, variantId) {
    setSelectedKey(`${year}:${variantId}`);
    const url = new URL(window.location.href);
    url.searchParams.set('year', year);
    url.searchParams.set('variant', variantId);
    window.history.pushState({}, '', url.toString());
  }

  function closeEntry() {
    setSelectedKey(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('year');
    url.searchParams.delete('variant');
    window.history.pushState({}, '', url.toString());
  }

  let selectedEntry = null;
  let selectedVariant = null;
  if (selectedKey) {
    const [yearStr, variantId] = selectedKey.split(':');
    selectedEntry = years.find((entry) => String(entry.year) === yearStr);
    selectedVariant = selectedEntry && selectedEntry.variants.find((item) => item.id === variantId);
  }

  if (status === 'ready' && selectedEntry && selectedVariant) {
    const fileTypes = FILE_ORDER.filter((type) => selectedVariant.files[type]);
    return <>
      <p className="no-print" style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 6 }}>
        <a href="/">{words.home}</a> / <a href="/csat.html">{words.hub}</a> / <a href={`/csat/${examType}`} onClick={(event) => { event.preventDefault(); closeEntry(); }}>{label}</a> / {selectedEntry.year} {selectedVariant.label}
      </p>
      <button type="button" onClick={closeEntry} className="button button-secondary no-print" style={{ marginBottom: 16 }}>{words.back}</button>
      <h1 className="font-display" style={{ fontSize: 26, margin: '0 0 24px' }}>{selectedEntry.year} {selectedVariant.label}</h1>
      {fileTypes.length === 0 ? <p style={{ color: 'var(--ink-soft)' }}>{words.noFiles}</p> : fileTypes.map((type) => <ExamSection key={type} typeLabel={words[type]} fileEntry={selectedVariant.files[type]} words={words} />)}
    </>;
  }

  const sessions = years.flatMap((entry) => entry.variants.map((variant) => ({ year: entry.year, variant })));

  return <>
    <p className="no-print" style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 6 }}>
      <a href="/">{words.home}</a> / <a href="/csat.html">{words.hub}</a> / {label}
    </p>
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
      <h1 className="font-display" style={{ fontSize: 26, margin: 0 }}>{label}</h1>
      <a href="/csat/admin" className="button button-secondary" style={{ textDecoration: 'none' }}>{words.upload}</a>
    </div>
    <p style={{ color: 'var(--ink-soft)', margin: '0 0 28px' }}>{description}</p>

    {status === 'loading' ? <p style={{ color: 'var(--ink-soft)' }}>{words.loading}</p> : null}
    {status === 'error' ? <p style={{ color: 'var(--red-pen)' }}>{words.error}</p> : null}
    {status === 'ready' && sessions.length === 0 ? <p style={{ padding: 24, background: 'var(--card-bg)', border: '1px dashed var(--paper-line)', borderRadius: 'var(--radius)', color: 'var(--ink-soft)', textAlign: 'center' }}>{words.empty}</p> : null}

    <div style={{ display: 'grid', gap: 10 }}>
      {sessions.map(({ year, variant }) => <button
        type="button"
        key={`${year}-${variant.id}`}
        onClick={() => openEntry(year, variant.id)}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '16px 20px', background: 'var(--card-bg)', border: '1px solid var(--paper-line)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', cursor: 'pointer', textAlign: 'left', font: 'inherit' }}
      >
        <span style={{ fontSize: 17, fontWeight: 700, color: 'var(--ink)' }}>{year} {variant.label}</span>
        <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{words.fileCount(Object.keys(variant.files).length)} →</span>
      </button>)}
    </div>
  </>;
}
