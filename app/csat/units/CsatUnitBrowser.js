'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../../language';
import { CSAT_SUBJECTS, csatUnitTagLabel } from '../../examUnits';

const COPY = {
  ko: {
    home: '홈', hub: '수능 기출문제', title: '단원별 수능 기출문제',
    intro: '수능 출제 범위인 수학Ⅰ·수학Ⅱ·확률과 통계·미적분·기하 다섯 과목을 세부 단원으로 나눠, 해당 단원으로 태그된 기출문제·해설 자료를 모아 볼 수 있습니다.',
    loading: '자료를 불러오는 중입니다...',
    error: '자료를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.',
    empty: '아직 이 단원으로 태그된 자료가 없습니다.',
    untagged: '아직 단원 태그가 없는 자료는 시험 종류별 보기에서 확인할 수 있습니다.',
    byType: '시험 종류별로 보기',
    fileCount: (n) => `${n}개 자료`,
  },
  en: {
    home: 'Home', hub: 'CSAT Archive', title: 'CSAT Archive by Unit',
    intro: 'The five CSAT subjects (Math I, Math II, Probability & Statistics, Calculus, Geometry) are broken down into curriculum units so you can browse everything tagged with a unit at once.',
    loading: 'Loading archive...',
    error: 'Could not load the archive. Please try again shortly.',
    empty: 'No materials tagged with this unit yet.',
    untagged: 'Materials without a unit tag are still browsable by exam type.',
    byType: 'Browse by exam type',
    fileCount: (n) => `${n} item${n === 1 ? '' : 's'}`,
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

const EXAM_TYPE_LABELS = { june: '6월 모의고사', sept: '9월 모의고사', nov: '수능', 'city-mock': '학력평가' };
const EXAM_TYPES = ['june', 'sept', 'nov', 'city-mock'];

function fileTypeLabel(type, language) {
  const labels = FILE_TYPE_LABELS[language] || FILE_TYPE_LABELS.en;
  if (type.startsWith('solutions__')) return `${labels.solutions} (${type.slice('solutions__'.length)})`;
  return labels[type] || type;
}

export default function CsatUnitBrowser() {
  const { language } = useLanguage();
  const words = COPY[language] || COPY.en;
  const [manifest, setManifest] = useState(null);
  const [status, setStatus] = useState('loading');
  const [openUnit, setOpenUnit] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/csat/manifest')
      .then((res) => { if (!res.ok) throw new Error('bad response'); return res.json(); })
      .then((data) => { if (!cancelled) { setManifest(data); setStatus('ready'); } })
      .catch(() => { if (!cancelled) setStatus('error'); });
    return () => { cancelled = true; };
  }, []);

  const itemsByTag = useMemo(() => {
    const map = new Map();
    for (const subject of CSAT_SUBJECTS) {
      for (const unit of subject.units) map.set(csatUnitTagLabel(subject, unit), []);
    }
    if (!manifest) return map;
    for (const examType of EXAM_TYPES) {
      for (const entry of manifest[examType] || []) {
        for (const variant of entry.variants) {
          for (const [fileType, file] of Object.entries(variant.files)) {
            const tag = file.meta?.unitTag;
            if (tag && map.has(tag)) {
              map.get(tag).push({ examType, year: entry.year, variant, fileType, file });
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
      <a href="/">{words.home}</a> / <a href="/csat.html">{words.hub}</a> / {words.title}
    </p>
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
      <h1 className="font-display" style={{ fontSize: 26, margin: 0 }}>{words.title}</h1>
      <a href="/csat" className="button button-secondary" style={{ textDecoration: 'none' }}>{words.byType}</a>
    </div>
    <p style={{ color: 'var(--ink-soft)', margin: '0 0 8px' }}>{words.intro}</p>
    <p style={{ color: 'var(--ink-soft)', fontSize: 13, margin: '0 0 28px' }}>{words.untagged}</p>

    {status === 'loading' ? <p style={{ color: 'var(--ink-soft)' }}>{words.loading}</p> : null}
    {status === 'error' ? <p style={{ color: 'var(--red-pen)' }}>{words.error}</p> : null}

    {status === 'ready' ? CSAT_SUBJECTS.map((subject) => <section key={subject.id} style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: 18, margin: '0 0 4px' }}>{subject.label}</h2>
      <p style={{ fontSize: 12, color: 'var(--ink-soft)', margin: '0 0 10px' }}>2022개정: {subject.revised2022}</p>
      <div style={{ display: 'grid', gap: 10 }}>
        {subject.units.map((unit) => {
          const tag = csatUnitTagLabel(subject, unit);
          const items = itemsByTag.get(tag) || [];
          const openKey = `${subject.id}-${unit.id}`;
          const open = openUnit === openKey;
          return <div key={unit.id} style={{ background: 'var(--card-bg)', border: '1px solid var(--paper-line)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
            <button
              type="button"
              onClick={() => setOpenUnit(open ? null : openKey)}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '14px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', font: 'inherit' }}
            >
              <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>{unit.label}</span>
              <span style={{ fontSize: 12, color: 'var(--ink-soft)', whiteSpace: 'nowrap' }}>{words.fileCount(items.length)} {open ? '▲' : '▼'}</span>
            </button>
            {open ? <div style={{ padding: '0 20px 16px', display: 'grid', gap: 8 }}>
              {items.length === 0 ? <p style={{ color: 'var(--ink-soft)', fontSize: 14, margin: 0 }}>{words.empty}</p> : items.map(({ examType, year, variant, fileType, file }) => <a
                key={`${examType}-${year}-${variant.id}-${fileType}`}
                href={`/csat/${examType}?year=${year}&variant=${variant.id}`}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--paper)', borderRadius: 8, textDecoration: 'none', color: 'var(--ink)' }}
              >
                <span>{file.meta?.accessTier === 'premium' ? '🔒 ' : ''}{year} {EXAM_TYPE_LABELS[examType]} · {variant.label}</span>
                <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{fileTypeLabel(fileType, language)} →</span>
              </a>)}
            </div> : null}
          </div>;
        })}
      </div>
    </section>) : null}
  </>;
}
