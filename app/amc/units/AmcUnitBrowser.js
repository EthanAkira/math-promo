'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../auth';
import { useLanguage } from '../../language';
import { AMC_UNITS } from '../../examUnits';

const COPY = {
  ko: {
    home: '홈', hub: 'AMC 기출문제', title: '단원별 AMC 기출문제',
    intro: '단원을 선택하면 해당 단원으로 태그된 기출문제·기출변형(응용문제)·자세한 해설·이론 자료를 모아 볼 수 있습니다.',
    loading: '자료를 불러오는 중입니다...',
    error: '자료를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.',
    empty: '아직 이 단원으로 태그된 자료가 없습니다.',
    untagged: '아직 단원 태그가 없는 자료는 연도별 보기에서 확인할 수 있습니다.',
    byYear: '연도별로 보기',
    fileCount: (n) => `${n}개 자료`,
    checkingAuth: '접근 권한을 확인하는 중입니다...',
    needLoginTitle: '로그인이 필요합니다',
    needLoginDesc: '단원별 AMC 기출문제(기출변형·자세한 해설 포함)는 로그인 후 구독 회원만 볼 수 있습니다. 오른쪽 위 로그인 버튼으로 먼저 로그인해주세요.',
    needSubTitle: 'AMC 구독이 필요합니다',
    needSubDesc: '이 페이지는 AMC 구독 회원 전용입니다. 결제·구독 서비스는 준비 중이며, 이용을 원하시면 문의하기로 연락해주세요.',
    contactLink: '문의하기',
  },
  en: {
    home: 'Home', hub: 'AMC Archive', title: 'AMC Archive by Topic',
    intro: 'Pick a topic to see every problem set, variant problem, detailed solution, and theory sheet tagged with it.',
    loading: 'Loading archive...',
    error: 'Could not load the archive. Please try again shortly.',
    empty: 'No materials tagged with this topic yet.',
    untagged: 'Materials without a topic tag are still browsable by year.',
    byYear: 'Browse by year',
    fileCount: (n) => `${n} item${n === 1 ? '' : 's'}`,
    checkingAuth: 'Checking access...',
    needLoginTitle: 'Login required',
    needLoginDesc: 'The AMC archive by topic (including variant problems and detailed solutions) is available to logged-in subscribers only. Please log in using the button in the header.',
    needSubTitle: 'AMC subscription required',
    needSubDesc: 'This page is for AMC subscribers only. Paid subscriptions are coming soon — contact us if you would like access.',
    contactLink: 'Contact us',
  },
};

const FILE_TYPE_LABELS = {
  ko: {
    problems: '문제지', solutions: '해설지', answers: '정답지', theory: '이론',
    variant_problem: '변형문제', related_problem: '관련문제', forecast: '예상문제', stats: '통계',
  },
  en: {
    problems: 'Problems', solutions: 'Solutions', answers: 'Answer Key', theory: 'Theory',
    variant_problem: 'Variant problems', related_problem: 'Related problems', forecast: 'Forecast problems', stats: 'Statistics',
  },
};

function fileTypeLabel(type, language) {
  const labels = FILE_TYPE_LABELS[language] || FILE_TYPE_LABELS.en;
  if (type.startsWith('solutions__')) return `${labels.solutions} (${type.slice('solutions__'.length)})`;
  return labels[type] || type;
}

const LEVELS = ['8', '10', '12'];

export default function AmcUnitBrowser() {
  const { language } = useLanguage();
  const words = COPY[language] || COPY.en;
  const { user, status: authStatus } = useAuth();
  const [subStatus, setSubStatus] = useState('loading'); // loading | active | inactive
  const [manifest, setManifest] = useState(null);
  const [status, setStatus] = useState('loading');
  const [openUnit, setOpenUnit] = useState(null);

  useEffect(() => {
    if (authStatus !== 'ready') return;
    if (!user) { setSubStatus('inactive'); return; }
    let cancelled = false;
    setSubStatus('loading');
    fetch('/api/subscriptions/status?subject=amc')
      .then((res) => res.json())
      .then((data) => { if (!cancelled) setSubStatus(data.active ? 'active' : 'inactive'); })
      .catch(() => { if (!cancelled) setSubStatus('inactive'); });
    return () => { cancelled = true; };
  }, [authStatus, user]);

  const entitled = authStatus === 'ready' && !!user && subStatus === 'active';

  useEffect(() => {
    if (!entitled) return;
    let cancelled = false;
    fetch('/api/amc/manifest')
      .then((res) => { if (!res.ok) throw new Error('bad response'); return res.json(); })
      .then((data) => { if (!cancelled) { setManifest(data); setStatus('ready'); } })
      .catch(() => { if (!cancelled) setStatus('error'); });
    return () => { cancelled = true; };
  }, [entitled]);

  const itemsByUnit = useMemo(() => {
    const map = new Map(AMC_UNITS.map((unit) => [unit.label, []]));
    if (!manifest) return map;
    for (const level of LEVELS) {
      for (const entry of manifest[level] || []) {
        for (const variant of entry.variants) {
          for (const [fileType, file] of Object.entries(variant.files)) {
            const tag = file.meta?.unitTag;
            if (tag && map.has(tag)) {
              map.get(tag).push({ level, year: entry.year, variant, fileType, file });
            }
          }
        }
      }
    }
    for (const list of map.values()) list.sort((a, b) => b.year - a.year);
    return map;
  }, [manifest]);

  return <>
    <p className="no-print" style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 6 }}>
      <a href="/">{words.home}</a> / <a href="/amc.html">{words.hub}</a> / {words.title}
    </p>
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
      <h1 className="font-display" style={{ fontSize: 26, margin: 0 }}>{words.title}</h1>
      <a href="/amc" className="button button-secondary" style={{ textDecoration: 'none' }}>{words.byYear}</a>
    </div>
    <p style={{ color: 'var(--ink-soft)', margin: '0 0 8px' }}>{words.intro}</p>

    {authStatus !== 'ready' || subStatus === 'loading' ? <p style={{ color: 'var(--ink-soft)' }}>{words.checkingAuth}</p> : null}

    {authStatus === 'ready' && !user ? <div style={{ padding: 28, textAlign: 'center', background: 'var(--card-bg)', border: '1px dashed var(--paper-line)', borderRadius: 'var(--radius)', color: 'var(--ink-soft)' }}>
      <p style={{ fontWeight: 700, color: 'var(--ink)', margin: '0 0 6px' }}>{words.needLoginTitle}</p>
      <p style={{ margin: 0 }}>{words.needLoginDesc}</p>
    </div> : null}

    {authStatus === 'ready' && user && subStatus === 'inactive' ? <div style={{ padding: 28, textAlign: 'center', background: 'var(--card-bg)', border: '1px dashed var(--paper-line)', borderRadius: 'var(--radius)', color: 'var(--ink-soft)' }}>
      <p style={{ fontWeight: 700, color: 'var(--ink)', margin: '0 0 6px' }}>🔒 {words.needSubTitle}</p>
      <p style={{ margin: '0 0 12px' }}>{words.needSubDesc}</p>
      <a href="/contact" className="button button-secondary" style={{ textDecoration: 'none' }}>{words.contactLink}</a>
    </div> : null}

    {entitled ? <>
    <p style={{ color: 'var(--ink-soft)', fontSize: 13, margin: '0 0 28px' }}>{words.untagged}</p>

    {status === 'loading' ? <p style={{ color: 'var(--ink-soft)' }}>{words.loading}</p> : null}
    {status === 'error' ? <p style={{ color: 'var(--red-pen)' }}>{words.error}</p> : null}

    {status === 'ready' ? <div style={{ display: 'grid', gap: 10 }}>
      {AMC_UNITS.map((unit) => {
        const items = itemsByUnit.get(unit.label) || [];
        const open = openUnit === unit.id;
        return <div key={unit.id} style={{ background: 'var(--card-bg)', border: '1px solid var(--paper-line)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
          <button
            type="button"
            onClick={() => setOpenUnit(open ? null : unit.id)}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', font: 'inherit' }}
          >
            <span>
              <span style={{ fontSize: 17, fontWeight: 700, color: 'var(--ink)' }}>{unit.label}</span>
              <span style={{ display: 'block', fontSize: 13, color: 'var(--ink-soft)', marginTop: 2 }}>{unit.description}</span>
            </span>
            <span style={{ fontSize: 12, color: 'var(--ink-soft)', whiteSpace: 'nowrap' }}>{words.fileCount(items.length)} {open ? '▲' : '▼'}</span>
          </button>
          {open ? <div style={{ padding: '0 20px 16px', display: 'grid', gap: 8 }}>
            {items.length === 0 ? <p style={{ color: 'var(--ink-soft)', fontSize: 14, margin: 0 }}>{words.empty}</p> : items.map(({ level, year, variant, fileType, file }) => <a
              key={`${level}-${year}-${variant.id}-${fileType}`}
              href={`/amc/${level}?year=${year}&variant=${variant.id}`}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--paper)', borderRadius: 8, textDecoration: 'none', color: 'var(--ink)' }}
            >
              <span>{file.meta?.accessTier === 'premium' ? '🔒 ' : ''}{year} AMC {level}{variant.id !== 'AMC8' ? variant.id : ''} · {variant.label}</span>
              <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{fileTypeLabel(fileType, language)} →</span>
            </a>)}
          </div> : null}
        </div>;
      })}
    </div> : null}
    </> : null}
  </>;
}
