'use client';

import { useEffect, useState } from 'react';
import katex from 'katex';
import { useLanguage } from '../language';
import InteractiveExamWorkspace from '../components/InteractiveExamWorkspace';
import { getInteractiveProblems, clearCustomExams } from '../data/sampleExams';
import { extractTextFromPdf, parseExamText } from '../components/AiExamParser';

const COPY = {
  ko: {
    home: '홈', hub: 'AMC 기출문제',
    empty: '아직 업로드된 자료가 없습니다. 문의하기를 통해 자료를 요청하거나 제안해주세요.',
    loading: '자료를 불러오는 중입니다...',
    error: '자료를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.',
    problems: '문제지', solutions: '해설지', answers: '정답지',
    theory: '이론', variant_problem: '변형문제', related_problem: '관련문제', forecast: '예상문제', stats: '통계',
    download: '다운로드', upload: '자료 업로드', back: '목록으로',
    fileCount: (n) => `${n}개 파일`,
    textLoading: '내용을 불러오는 중입니다...',
    textError: '내용을 불러오지 못했습니다.',
    noFiles: '이 회차에는 아직 등록된 파일이 없습니다.',
    premiumLocked: '프리미엄 콘텐츠입니다. 구독 서비스 준비 중이니 곧 만나보실 수 있습니다.',
  },
  en: {
    home: 'Home', hub: 'AMC Archive',
    empty: 'No files uploaded yet. Feel free to request or suggest materials via Contact.',
    loading: 'Loading archive...',
    error: 'Could not load the archive. Please try again shortly.',
    problems: 'Problems', solutions: 'Solutions', answers: 'Answer Key',
    theory: 'Theory', variant_problem: 'Variant problems', related_problem: 'Related problems', forecast: 'Forecast problems', stats: 'Statistics',
    download: 'Download', upload: 'Upload materials', back: 'Back to list',
    fileCount: (n) => `${n} file${n === 1 ? '' : 's'}`,
    textLoading: 'Loading content...',
    textError: 'Could not load the content.',
    noFiles: 'No files for this session yet.',
    premiumLocked: 'This is premium content. Subscriptions are coming soon.',
  },
};

function fileTypeLabel(type, words) {
  if (type.startsWith('solutions__')) return `${words.solutions} (${type.slice('solutions__'.length)})`;
  return words[type] || type;
}

const FILE_ORDER = ['problems', 'solutions', 'answers', 'theory', 'variant_problem', 'related_problem', 'forecast', 'stats'];

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
  const isPremium = fileEntry.meta?.accessTier === 'premium';
  const kind = fileKindFromName(fileEntry.filename);
  const previewUrl = `/api/amc/file?key=${encodeURIComponent(fileEntry.key)}`;
  const downloadUrl = `${previewUrl}&download=1`;

  return <section style={{ marginBottom: 32 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
      <h2 style={{ fontSize: 18, margin: 0 }}>{isPremium ? '🔒 ' : ''}{typeLabel}</h2>
      {isPremium ? null : <a href={downloadUrl} style={{ fontSize: 13, color: 'var(--red-pen)', fontWeight: 700, textDecoration: 'none' }}>{words.download}</a>}
    </div>
    {isPremium ? <div style={{ padding: 32, textAlign: 'center', background: 'var(--card-bg)', border: '1px dashed var(--paper-line)', borderRadius: 'var(--radius)', color: 'var(--ink-soft)' }}>{words.premiumLocked}</div> : <>
      {kind === 'txt' ? <div style={{ padding: 24, background: 'var(--card-bg)', border: '1px solid var(--paper-line)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}><TxtArticle url={previewUrl} words={words} /></div> : null}
      {kind === 'pdf' ? <iframe src={previewUrl} title={typeLabel} style={{ width: '100%', height: '88vh', minHeight: 700, border: '1px solid var(--paper-line)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }} /> : null}
      {kind === 'other' ? <a href={downloadUrl} className="button button-secondary" style={{ textDecoration: 'none' }}>{words.download}</a> : null}
    </>}
  </section>;
}

export default function AmcLevelArchive({ level, label, description }) {
  const { language } = useLanguage();
  const words = COPY[language] || COPY.en;
  const [manifest, setManifest] = useState(null);
  const [status, setStatus] = useState('loading');
  const [selectedKey, setSelectedKey] = useState(null);
  const [viewMode, setViewMode] = useState('interactive');
  const [interactiveProblems, setInteractiveProblems] = useState(null);
  const [loadingInteractive, setLoadingInteractive] = useState(false);

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
    // Automatically purge any stale snippets with < 10 problems from previous test sessions
    try {
      ['custom_exam_8', 'custom_exam_10', 'custom_exam_12', 'custom_exam_amc', 'custom_exam_csat'].forEach((k) => {
        const item = localStorage.getItem(k);
        if (item) {
          const parsed = JSON.parse(item);
          if (Array.isArray(parsed) && parsed.length < 10) {
            localStorage.removeItem(k);
          }
        }
      });
    } catch (e) {}
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/amc/manifest')
      .then((res) => { if (!res.ok) throw new Error('bad response'); return res.json(); })
      .then((data) => { if (!cancelled) { setManifest(data); setStatus('ready'); } })
      .catch(() => { if (!cancelled) setStatus('error'); });
    return () => { cancelled = true; };
  }, []);

  const years = manifest ? [...(manifest[level] || [])].sort((a, b) => b.year - a.year) : [];

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
    selectedEntry = years.find((entry) => String(entry.year) === yearStr) || { year: parseInt(yearStr) || 2023, variants: [] };
    selectedVariant = (selectedEntry && selectedEntry.variants.find((item) => item.id === variantId)) || { id: variantId, label: 'Competition Set (Interactive)', files: {} };
  }

  useEffect(() => {
    if (!selectedEntry || !selectedVariant) return;

    // 1. Initial check: cached session problems in localStorage or fallback 25 problems
    const current = getInteractiveProblems('amc', level, selectedEntry.year, selectedVariant.id);
    setInteractiveProblems(current);

    // 2. If problem file exists in session and not yet cached for this session, extract & parse
    const problemFile = selectedVariant.files?.problems || selectedVariant.files?.variant_problem;
    const sessionKey = `custom_exam_amc_${level}_${selectedEntry.year}_${selectedVariant.id}`;
    let isAlreadyCached = false;
    try {
      isAlreadyCached = !!localStorage.getItem(sessionKey);
    } catch (e) {}

    if (problemFile?.key && !isAlreadyCached) {
      let cancelled = false;
      setLoadingInteractive(true);
      fetch(`/api/amc/file?key=${encodeURIComponent(problemFile.key)}`)
        .then((res) => {
          if (!res.ok) throw new Error('Could not fetch file');
          return res.arrayBuffer();
        })
        .then(async (ab) => {
          let extracted = '';
          try {
            extracted = await extractTextFromPdf(ab);
          } catch (e) {}
          let parsed = [];
          if (extracted && extracted.trim()) {
            parsed = parseExamText(extracted);
          }
          if (!cancelled) {
            if (parsed.length >= 10) {
              try {
                localStorage.setItem(sessionKey, JSON.stringify(parsed));
                localStorage.setItem(`custom_exam_amc_${level}`, JSON.stringify(parsed));
              } catch (e) {}
              setInteractiveProblems(parsed);
            }
            setLoadingInteractive(false);
          }
        })
        .catch(() => {
          if (!cancelled) setLoadingInteractive(false);
        });

      return () => { cancelled = true; };
    }
  }, [level, selectedEntry?.year, selectedVariant?.id, selectedVariant?.files?.problems?.key]);

  if (status === 'ready' && selectedEntry && selectedVariant) {
    const allTypes = Object.keys(selectedVariant.files);
    const fileTypes = [
      ...FILE_ORDER.filter((type) => allTypes.includes(type)),
      ...allTypes.filter((type) => type.startsWith('solutions__')),
    ];
    return <>
      <p className="no-print" style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 6 }}>
        <a href="/">{words.home}</a> / <a href="/amc.html">{words.hub}</a> / <a href={`/amc/${level}`} onClick={(event) => { event.preventDefault(); closeEntry(); }}>{label}</a> / {selectedEntry.year} {selectedVariant.label}
      </p>
      <button type="button" onClick={closeEntry} className="button button-secondary no-print" style={{ marginBottom: 16 }}>{words.back}</button>
      <h1 className="font-display" style={{ fontSize: 26, margin: '0 0 16px' }}>{selectedEntry.year} {selectedVariant.label}</h1>

      {/* Mode Switch Tabs: Interactive Solving vs Original PDF */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '2px solid var(--paper-line, #d8c9a8)', paddingBottom: '10px' }}>
        <button
          type="button"
          onClick={() => setViewMode('interactive')}
          style={{
            fontSize: '15px',
            fontWeight: '800',
            padding: '9px 18px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            background: viewMode === 'interactive' ? 'linear-gradient(135deg, var(--red, #c23b32) 0%, var(--red-dark, #8f2a24) 100%)' : '#ede7db',
            color: viewMode === 'interactive' ? '#ffffff' : 'var(--ink, #1f2733)',
            boxShadow: viewMode === 'interactive' ? '0 4px 14px rgba(194,59,50,0.25)' : 'none',
          }}
        >
          ✍️ {language === 'ko' ? '웹/태블릿으로 풀기 (인터랙티브)' : 'Solve on Web/Tablet'}
        </button>
        <button
          type="button"
          onClick={() => setViewMode('files')}
          style={{
            fontSize: '15px',
            fontWeight: '800',
            padding: '9px 18px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            background: viewMode === 'files' ? 'var(--blue, #2a5c8a)' : '#ede7db',
            color: viewMode === 'files' ? '#ffffff' : 'var(--ink, #1f2733)',
            boxShadow: viewMode === 'files' ? '0 4px 14px rgba(42,92,138,0.25)' : 'none',
          }}
        >
          📄 {language === 'ko' ? '기출 PDF/파일 뷰어' : 'PDF / File Viewer'}
        </button>
        <button
          type="button"
          onClick={() => {
            clearCustomExams('amc', level, selectedEntry?.year, selectedVariant?.id);
            const refreshed = getInteractiveProblems('amc', level, selectedEntry?.year, selectedVariant?.id);
            setInteractiveProblems(refreshed);
          }}
          style={{
            fontSize: '13px',
            fontWeight: '600',
            padding: '9px 14px',
            borderRadius: '10px',
            border: '1px solid #d8c9a8',
            cursor: 'pointer',
            background: '#faf7f2',
            color: '#666',
            marginLeft: 'auto',
          }}
          title="기출 기본 25문항으로 초기화"
        >
          🔄 {language === 'ko' ? '기본 25문항 복원' : 'Reset 25Q'}
        </button>
      </div>

      {loadingInteractive ? (
        <div style={{ padding: '12px 18px', marginBottom: '16px', background: '#fdf3d7', border: '1px solid #e0c885', borderRadius: '8px', fontSize: '14px', color: '#8a6508' }}>
          ⏳ 등록된 PDF 원본 시험지에서 전 문항(25문항)을 인터랙티브 문제 세트로 분석·불러오는 중입니다...
        </div>
      ) : null}

      {viewMode === 'interactive' ? (
        <InteractiveExamWorkspace
          title={`${selectedEntry.year} ${selectedVariant.label}`}
          subtitle={language === 'ko' ? 'LaTeX 수식 · SVG 기하 도형 · 태블릿 펜슬 필기장 지원' : 'KaTeX Math · SVG Diagrams · Tablet Stylus Scratchpad'}
          problems={interactiveProblems || getInteractiveProblems('amc', level, selectedEntry?.year, selectedVariant?.id)}
          language={language}
        />
      ) : (
        fileTypes.length === 0 ? <p style={{ color: 'var(--ink-soft)' }}>{words.noFiles}</p> : fileTypes.map((type) => <ExamSection key={type} typeLabel={fileTypeLabel(type, words)} fileEntry={selectedVariant.files[type]} words={words} />)
      )}
    </>;
  }

    const defaultSessions = [
    { year: 2023, variant: { id: 'A', label: 'Competition A', files: {} } },
    { year: 2023, variant: { id: 'B', label: 'Competition B', files: {} } },
  ];
  const manifestSessions = years.flatMap((entry) => entry.variants.map((variant) => ({ year: entry.year, variant })));
  const sessions = manifestSessions.length > 0 ? manifestSessions : defaultSessions;

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
