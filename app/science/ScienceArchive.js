'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../language';
import { tr } from '../i18n';
import Board from '../board/Board';
import { contentOf } from './content';
import {
  SCIENCE_GRADES,
  SCIENCE_KINDS,
  SCIENCE_STRANDS,
  SCIENCE_UNITS,
  scienceCategory,
  unitById,
  unitsOfGrade,
} from './curriculum';

const ACCEPT = 'image/*,application/pdf,.zip,.docx,.pptx,.xlsx,.hwp';

const GRADE_METAS = {
  1: {
    titleKo: '자연 관찰과 오감 탐구',
    titleEn: 'Observation & Senses',
    theme: {
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.08)',
      border: 'rgba(16, 185, 129, 0.25)',
      gradient: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
      badgeBg: '#dcfce7',
      badgeText: '#15803d',
    },
    icons: '🌱 🐾 👂 ☀️',
    descKo: '식물과 동물의 필요조건, 서식지, 우리 몸과 오감, 날씨와 계절, 빛과 소리의 기초를 관찰합니다.',
    descEn: 'Observe plants, animals, habitats, body senses, weather, seasons, and light & sound basics.',
    highlights: ['식물과 동물', '우리 몸과 오감', '날씨와 계절', '고체·액체·기체', '빛과 소리'],
  },
  2: {
    titleKo: '생물의 한살이와 물질의 상태',
    titleEn: 'Life Cycles & Matter',
    theme: {
      color: '#0d9488',
      bg: 'rgba(13, 148, 136, 0.08)',
      border: 'rgba(13, 148, 136, 0.25)',
      gradient: 'linear-gradient(135deg, #115e59 0%, #0f766e 100%)',
      badgeBg: '#ccfbf1',
      badgeText: '#0f766e',
    },
    icons: '🦋 🪨 💧 🏃',
    descKo: '식물·동물의 한살이와 환경 적응, 물질의 상태 변화, 힘과 운동, 암석·흙 및 물의 순환을 탐구합니다.',
    descEn: 'Explore life cycles, adaptations, states of matter, forces & motion, rocks, soil, and water cycle.',
    highlights: ['식물·동물 한살이', '물질의 상태 변화', '위치와 힘', '암석과 흙', '물의 순환'],
  },
  3: {
    titleKo: '환경 적응과 지구 시스템',
    titleEn: 'Adaptations & Earth Systems',
    theme: {
      color: '#0284c7',
      bg: 'rgba(2, 132, 199, 0.08)',
      border: 'rgba(2, 132, 199, 0.25)',
      gradient: 'linear-gradient(135deg, #075985 0%, #0369a1 100%)',
      badgeBg: '#e0f2fe',
      badgeText: '#0369a1',
    },
    icons: '🦖 🧲 ☀️ 🌍',
    descKo: '육지·물 환경 적응, 유전 형질과 화석, 힘과 자석, 빛과 그림자, 지구·태양·달의 상호작용을 배웁니다.',
    descEn: 'Investigate land/water adaptations, traits, fossils, forces & magnets, and Earth-Sun-Moon systems.',
    highlights: ['생물군계와 적응', '화석과 고생물', '힘과 자석', '빛과 그림자', '지구·달·태양'],
  },
  4: {
    titleKo: '에너지의 전환과 지표 변화',
    titleEn: 'Energy Transfer & Earth Changes',
    theme: {
      color: '#4f46e5',
      bg: 'rgba(79, 70, 229, 0.08)',
      border: 'rgba(79, 70, 229, 0.25)',
      gradient: 'linear-gradient(135deg, #3730a3 0%, #4338ca 100%)',
      badgeBg: '#e0e7ff',
      badgeText: '#3730a3',
    },
    icons: '⚡ 🌊 🌋 🔋',
    descKo: '먹이 사슬과 생태계, 물질의 상태 변화, 전기 회로와 전자석, 파동과 빛, 암석 순환과 지표 변화를 다룹니다.',
    descEn: 'Study food chains, ecosystems, energy transfer, electricity, waves, rocks & minerals, and Earth dynamics.',
    highlights: ['먹이사슬과 생태계', '전기 회로와 전자석', '파동과 소리', '암석과 광물', '지진과 화산'],
  },
  5: {
    titleKo: '생명 시스템과 우주 탐사',
    titleEn: 'Living Systems & Space',
    theme: {
      color: '#7c3aed',
      bg: 'rgba(124, 58, 237, 0.08)',
      border: 'rgba(124, 58, 237, 0.25)',
      gradient: 'linear-gradient(135deg, #5b21b6 0%, #6d28d9 100%)',
      badgeBg: '#ede9fe',
      badgeText: '#5b21b6',
    },
    icons: '🧬 🪐 🧪 ⚙️',
    descKo: '세포와 인체 기관계, 광합성, 물질의 성질과 용액, 힘과 단순 기계, 지구의 물과 태양계의 운동을 탐구합니다.',
    descEn: 'Examine cells, body systems, photosynthesis, solutions, simple machines, Earth water, and solar system.',
    highlights: ['세포와 인체 기관계', '광합성과 호흡', '혼합물과 용액', '단순 기계', '태양계와 우주'],
  },
  6: {
    titleKo: '원자와 화학, 지구 판구조',
    titleEn: 'Atoms, Reactions & Earth Structure',
    theme: {
      color: '#be123c',
      bg: 'rgba(190, 18, 60, 0.08)',
      border: 'rgba(190, 18, 60, 0.25)',
      gradient: 'linear-gradient(135deg, #881337 0%, #9f1239 100%)',
      badgeBg: '#ffe4e6',
      badgeText: '#9f1239',
    },
    icons: '⚛️ 🔬 🌋 🧬',
    descKo: '원자와 화학 반응, 열과 에너지 전달, 지구 내부와 판 구조론, 유전과 진화, 심화 과학 탐구를 종합합니다.',
    descEn: 'Integrate atoms, chemical reactions, heat transfer, plate tectonics, heredity, and experimental design.',
    highlights: ['원자와 주기율표', '화학 변화와 반응', '열과 에너지 전달', '지구 판구조론', '유전과 자연선택'],
  },
};

const STRAND_DESCRIPTIONS = {
  chemistry: {
    badge: '화학 (Chemistry)',
    summaryKo: '물질의 성질, 상태 변화, 용액과 혼합물, 원자·분자, 화학 반응',
    summaryEn: 'States of matter, mixtures, solutions, atoms, elements, and chemical reactions.',
    icon: '🧪',
    color: '#e11d48',
    bg: '#fff1f2',
    border: '#fecdd3',
  },
  physics: {
    badge: '물리 (Physics)',
    summaryKo: '힘과 운동, 마찰, 단순 기계, 빛과 소리, 전기·자기, 파동, 열과 에너지',
    summaryEn: 'Forces, motion, simple machines, light, sound, electricity, magnetism, and energy.',
    icon: '⚡',
    color: '#2563eb',
    bg: '#eff6ff',
    border: '#bfdbfe',
  },
  life: {
    badge: '생명과학 (Life Science)',
    summaryKo: '식물·동물, 서식지와 환경 적응, 생태계와 먹이사슬, 세포, 인체 기관계, 유전',
    summaryEn: 'Plants, animals, habitats, adaptations, ecosystems, cells, body systems, and heredity.',
    icon: '🌱',
    color: '#059669',
    bg: '#ecfdf5',
    border: '#a7f3d0',
  },
  earth: {
    badge: '지구과학 (Earth & Space)',
    summaryKo: '암석과 흙, 날씨와 기후, 물의 순환, 지표 변화, 지구의 자원, 태양계와 우주',
    summaryEn: 'Rocks, soil, weather, climate, water cycle, Earth dynamics, and solar system.',
    icon: '🌍',
    color: '#d97706',
    bg: '#fffbeb',
    border: '#fde68a',
  },
  inquiry: {
    badge: '과학 탐구 (Scientific Inquiry)',
    summaryKo: '관찰·측정, 가설 설정, 공정한 실험(변인 통제), 자료 해석 및 보고서 작성',
    summaryEn: 'Observation, hypothesis, fair testing, data analysis, and scientific reporting.',
    icon: '🔬',
    color: '#7c3aed',
    bg: '#f5f3ff',
    border: '#ddd6fe',
  },
};

export default function ScienceArchive({ grade }) {
  const { language } = useLanguage();
  const ko = language === 'ko';
  const name = (o) => (ko ? o.ko : o.en);
  const units = grade ? unitsOfGrade(grade) : [];
  const [unitId, setUnitId] = useState(null);
  const [kind, setKind] = useState('tb');
  const [counts, setCounts] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMainTab, setActiveMainTab] = useState('grades'); // 'grades' | 'strands' | 'study'
  const [activeStrandFilter, setActiveStrandFilter] = useState('all'); // 'all' | 'chemistry' | 'physics' | 'life' | 'earth' | 'inquiry'

  // Deep link
  useEffect(() => {
    if (!grade) return;
    const q = new URLSearchParams(window.location.search);
    const u = q.get('unit');
    if (u && units.some((x) => x.id === u)) setUnitId(u);
    if (q.get('kind') === 'wb') setKind('wb');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grade]);

  // Fetch file counts
  useEffect(() => {
    if (!grade) return undefined;
    let cancelled = false;
    fetch(`/api/board/posts?prefix=science-g${grade}-`)
      .then((r) => (r.ok ? r.json() : { posts: [] }))
      .then((d) => {
        if (cancelled) return;
        const next = {};
        (d.posts || []).forEach((p) => {
          next[p.category] = (next[p.category] || 0) + 1;
        });
        setCounts(next);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [grade, unitId, kind]);

  const select = (id, k = kind) => {
    setUnitId(id);
    setKind(k);
    try {
      window.history.replaceState(null, '', `?unit=${id}&kind=${k}`);
    } catch {}
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        const el = document.getElementById('science-board');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  };

  const movableOptions = useMemo(
    () =>
      SCIENCE_UNITS.flatMap((u) =>
        SCIENCE_KINDS.map((k) => ({
          value: scienceCategory(u.id, k.id),
          label: `G${u.grade} · ${name(u)} · ${ko ? k.ko.split(' ')[0] : k.en.split(' ')[0]}`,
        }))
      ),
    [ko] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const unit = unitId ? unitById(unitId) : null;

  // All non-misc units
  const allRegularUnits = useMemo(() => SCIENCE_UNITS.filter((u) => u.strand !== 'misc'), []);

  // Filtered units by search query
  const filteredUnits = useMemo(() => {
    if (!searchQuery.trim()) return allRegularUnits;
    const q = searchQuery.toLowerCase().trim();
    return allRegularUnits.filter((u) =>
      u.ko.toLowerCase().includes(q) ||
      u.en.toLowerCase().includes(q) ||
      (u.topicsKo && u.topicsKo.toLowerCase().includes(q))
    );
  }, [searchQuery, allRegularUnits]);

  // Total interactive study units count
  const studyUnitsCount = useMemo(() => allRegularUnits.filter((u) => contentOf(u.id)).length, [allRegularUnits]);

  // Active strands list (excluding 'misc')
  const coreStrands = useMemo(() => SCIENCE_STRANDS.filter((s) => s.id !== 'misc'), []);

  return (
    <div style={{ color: 'var(--ink, #0f172a)' }}>
      {/* Breadcrumb Navigation */}
      <nav className="no-print" aria-label="breadcrumb" style={{ fontSize: 13, color: 'var(--ink-soft, #64748b)', marginBottom: 16 }}>
        <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>{tr(language, 'home')}</a>
        {' / '}
        {grade ? (
          <>
            <a href="/science" style={{ textDecoration: 'none', color: 'inherit' }}>
              {ko ? '국제학교 과학' : 'Science'}
            </a>
            {' / '}
            <strong style={{ color: 'var(--ink, #0f172a)' }}>Grade {grade}</strong>
          </>
        ) : (
          <strong style={{ color: 'var(--ink, #0f172a)' }}>{ko ? '국제학교 과학 (G1–G6)' : 'Science Hub'}</strong>
        )}
      </nav>

      {/* ─────────────────────────────────────────────────────────────
          1. HERO BANNER
      ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          background: grade && GRADE_METAS[grade]
            ? GRADE_METAS[grade].theme.gradient
            : 'linear-gradient(135deg, #0b1329 0%, #064e3b 50%, #1e1b4b 100%)',
          color: '#ffffff',
          borderRadius: 20,
          padding: '36px 32px 32px',
          marginBottom: 32,
          boxShadow: '0 12px 36px rgba(11, 19, 41, 0.25)',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.12)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -60,
            right: -60,
            width: 240,
            height: 240,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 800,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                padding: '4px 12px',
                borderRadius: 20,
                background: 'rgba(255, 255, 255, 0.18)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(8px)',
              }}
            >
              🔬 NGSS · Cambridge Primary · IB PYP Curriculum
            </span>
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 700,
                padding: '4px 12px',
                borderRadius: 20,
                background: 'rgba(56, 189, 248, 0.2)',
                color: '#7dd3fc',
                border: '1px solid rgba(125, 211, 252, 0.3)',
              }}
            >
              ✨ 화학 · 물리 · 생명과학 · 지구과학 4대 핵심 영역
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(24px, 3.8vw, 34px)',
              fontWeight: 800,
              margin: '0 0 12px',
              letterSpacing: '-0.02em',
              lineHeight: 1.25,
            }}
          >
            {grade ? (
              <>
                <span style={{ color: '#6ee7b7' }}>Grade {grade}</span> ·{' '}
                {ko ? GRADE_METAS[grade]?.titleKo : GRADE_METAS[grade]?.titleEn}
              </>
            ) : (
              ko ? '국제학교 과학 탐구 연구소 & 단원별 아카이브' : 'International Science Lab & Curriculum Archive'
            )}
          </h1>

          <p
            style={{
              fontSize: 14.5,
              color: 'rgba(255, 255, 255, 0.85)',
              margin: '0 0 24px',
              maxWidth: 820,
              lineHeight: 1.65,
            }}
          >
            {grade ? (
              ko ? GRADE_METAS[grade]?.descKo : GRADE_METAS[grade]?.descEn
            ) : (
              ko
                ? 'G1부터 G6까지, [화학 🧪 · 물리 ⚡ · 생명과학 🌱 · 지구과학 🌍] 4대 핵심 영역을 아우르는 단원별 교과서, 워크북 자료와 실시간 인터랙티브 온라인 학습지를 제공합니다.'
                : 'Explore unit-based textbooks, workbooks, and interactive online worksheets spanning Chemistry, Physics, Life Science, and Earth & Space Science across G1–G6.'
            )}
          </p>

          {/* Quick Stats Bar in Hero */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: 12,
              paddingTop: 18,
              borderTop: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            <div style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: 10, padding: '10px 14px' }}>
              <div style={{ fontSize: 11.5, color: '#94a3b8', fontWeight: 600 }}>🎓 커리큘럼 범위</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', marginTop: 2 }}>G1 ~ G6 전과정</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: 10, padding: '10px 14px' }}>
              <div style={{ fontSize: 11.5, color: '#94a3b8', fontWeight: 600 }}>🧪 4대 순수 과학</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', marginTop: 2 }}>화학·물리·생명·지구</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: 10, padding: '10px 14px' }}>
              <div style={{ fontSize: 11.5, color: '#94a3b8', fontWeight: 600 }}>📚 총 정규 단원</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', marginTop: 2 }}>57개 탐구 단원</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: 10, padding: '10px 14px' }}>
              <div style={{ fontSize: 11.5, color: '#94a3b8', fontWeight: 600 }}>📝 온라인 학습지</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#38bdf8', marginTop: 2 }}>즉석 채점 &amp; QR 인쇄</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. GRADE QUICK NAV PILLS
      ───────────────────────────────────────────────────────────── */}
      <nav
        className="no-print"
        aria-label="science grades switcher"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 26,
          overflowX: 'auto',
          paddingBottom: 6,
        }}
      >
        <a
          href="/science"
          style={{
            padding: '8px 16px',
            borderRadius: 24,
            fontSize: 13,
            fontWeight: 700,
            textDecoration: 'none',
            background: !grade ? '#0f172a' : '#ffffff',
            color: !grade ? '#ffffff' : '#334155',
            border: !grade ? '1.5px solid #0f172a' : '1px solid #cbd5e1',
            whiteSpace: 'nowrap',
            boxShadow: !grade ? '0 2px 8px rgba(15, 23, 42, 0.15)' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          🔬 {ko ? '전체 학년 허브' : 'All Grades Hub'}
        </a>

        {SCIENCE_GRADES.map((g) => {
          const active = g === Number(grade);
          const meta = GRADE_METAS[g];
          return (
            <a
              key={g}
              href={`/science/g${g}`}
              style={{
                padding: '8px 16px',
                borderRadius: 24,
                fontSize: 13,
                fontWeight: 700,
                textDecoration: 'none',
                background: active ? meta?.theme.color || '#2563eb' : '#ffffff',
                color: active ? '#ffffff' : '#334155',
                border: active ? `1.5px solid ${meta?.theme.color || '#2563eb'}` : '1px solid #cbd5e1',
                whiteSpace: 'nowrap',
                boxShadow: active ? '0 2px 8px rgba(0, 0, 0, 0.15)' : 'none',
                transition: 'all 0.15s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>Grade {g}</span>
              <span
                style={{
                  fontSize: 11,
                  padding: '1px 6px',
                  borderRadius: 10,
                  background: active ? 'rgba(255, 255, 255, 0.25)' : '#f1f5f9',
                  color: active ? '#ffffff' : '#64748b',
                }}
              >
                {unitsOfGrade(g).filter((u) => u.strand !== 'misc').length}단원
              </span>
            </a>
          );
        })}
      </nav>

      {/* ─────────────────────────────────────────────────────────────
          3. MAIN HUB VIEW (when grade is undefined)
      ───────────────────────────────────────────────────────────── */}
      {!grade ? (
        <div>
          {/* Search bar & View Tabs */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 16,
              padding: '18px 20px',
              marginBottom: 28,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 14,
            }}
          >
            {/* View Mode Switcher */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setActiveMainTab('grades')}
                style={{
                  padding: '8px 16px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: activeMainTab === 'grades' ? '#0f172a' : '#f1f5f9',
                  color: activeMainTab === 'grades' ? '#ffffff' : '#475569',
                  transition: 'all 0.15s',
                }}
              >
                🎓 {ko ? '학년별 로드맵 (G1–G6)' : 'By Grade'}
              </button>
              <button
                type="button"
                onClick={() => setActiveMainTab('strands')}
                style={{
                  padding: '8px 16px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: activeMainTab === 'strands' ? '#0f172a' : '#f1f5f9',
                  color: activeMainTab === 'strands' ? '#ffffff' : '#475569',
                  transition: 'all 0.15s',
                }}
              >
                🧬 {ko ? '4대 핵심 영역별 보기 (화학·물리·생명·지구)' : 'By 4 Strands (Chem·Phys·Life·Earth)'}
              </button>
              <button
                type="button"
                onClick={() => setActiveMainTab('study')}
                style={{
                  padding: '8px 16px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: activeMainTab === 'study' ? '#0f172a' : '#f1f5f9',
                  color: activeMainTab === 'study' ? '#ffffff' : '#475569',
                  transition: 'all 0.15s',
                }}
              >
                📖 {ko ? `인터랙티브 학습지 수록 (${studyUnitsCount}개)` : `Interactive (${studyUnitsCount})`}
              </button>
            </div>

            {/* Keyword Search Input */}
            <div style={{ flex: '1 1 260px', maxWidth: 380 }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={ko ? '단원명, 탐구 키워드 검색 (예: 화학변화, 전기, 세포, 암석)...' : 'Search topic, keyword (e.g. chemical, circuit, cell, rock)...'}
                style={{
                  width: '100%',
                  padding: '9px 14px',
                  borderRadius: 10,
                  border: '1.5px solid #cbd5e1',
                  fontSize: 13,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Search Result Banner if query is active */}
          {searchQuery.trim() && (
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                padding: '14px 18px',
                marginBottom: 24,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 13.5, color: '#334155' }}>
                🔍 &ldquo;<strong>{searchQuery}</strong>&rdquo; 검색 결과: 총 <strong>{filteredUnits.length}개</strong> 단원 발견
              </span>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}
              >
                검색 초기화 ✕
              </button>
            </div>
          )}

          {/* TAB 1: GRADES GRID VIEW */}
          {activeMainTab === 'grades' && !searchQuery.trim() && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: 40 }}>
              {SCIENCE_GRADES.map((g) => {
                const list = unitsOfGrade(g).filter((u) => u.strand !== 'misc');
                const meta = GRADE_METAS[g];
                const withStudyCount = list.filter((u) => contentOf(u.id)).length;

                return (
                  <div
                    key={g}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: 16,
                      padding: '24px',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                      position: 'relative',
                    }}
                  >
                    <div>
                      {/* Top Header of Grade Card */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: 800,
                              padding: '4px 10px',
                              borderRadius: 8,
                              background: meta?.theme.bg,
                              color: meta?.theme.color,
                              border: `1px solid ${meta?.theme.border}`,
                            }}
                          >
                            Grade {g}
                          </span>
                          <span style={{ fontSize: 16 }}>{meta?.icons.split(' ')[0]}</span>
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>
                          총 {list.length}개 단원
                        </span>
                      </div>

                      {/* Grade Title */}
                      <h2 style={{ fontSize: 19, fontWeight: 800, margin: '0 0 8px', color: '#0f172a' }}>
                        {ko ? meta?.titleKo : meta?.titleEn}
                      </h2>

                      {/* Grade Description */}
                      <p style={{ fontSize: 13, color: '#475569', margin: '0 0 16px', lineHeight: 1.6 }}>
                        {ko ? meta?.descKo : meta?.descEn}
                      </p>

                      {/* Key Topic Pills */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
                        {meta?.highlights.map((h) => (
                          <span
                            key={h}
                            style={{
                              fontSize: 11.5,
                              padding: '3px 8px',
                              borderRadius: 6,
                              background: '#f8fafc',
                              color: '#334155',
                              border: '1px solid #e2e8f0',
                              fontWeight: 500,
                            }}
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div style={{ display: 'flex', gap: 8, paddingTop: 14, borderTop: '1px solid #f1f5f9' }}>
                      <a
                        href={`/science/g${g}`}
                        style={{
                          flex: 1,
                          textAlign: 'center',
                          padding: '10px 14px',
                          borderRadius: 8,
                          fontSize: 13,
                          fontWeight: 700,
                          textDecoration: 'none',
                          background: meta?.theme.color || '#0f172a',
                          color: '#ffffff',
                          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        단원 자료실 둘러보기 →
                      </a>
                      {withStudyCount > 0 && (
                        <a
                          href={`/science/g${g}`}
                          title="온라인 학습지 수록 단원"
                          style={{
                            padding: '10px 12px',
                            borderRadius: 8,
                            fontSize: 13,
                            fontWeight: 700,
                            textDecoration: 'none',
                            background: '#f1f5f9',
                            color: '#0f172a',
                            border: '1px solid #cbd5e1',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          <span>📖</span>
                          <span style={{ fontSize: 11.5 }}>학습지 {withStudyCount}개</span>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: STRANDS EXPLORER VIEW (화학, 물리, 생명과학, 지구과학 4대 핵심 영역) */}
          {activeMainTab === 'strands' && !searchQuery.trim() && (
            <div>
              {/* 4대 핵심 영역 대시보드 요약 카드 4종 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginBottom: 24 }}>
                {coreStrands.filter((s) => s.id !== 'inquiry').map((strand) => {
                  const strandUnits = allRegularUnits.filter((u) => u.strand === strand.id);
                  const isSelected = activeStrandFilter === strand.id;
                  const meta = STRAND_DESCRIPTIONS[strand.id];

                  return (
                    <button
                      key={strand.id}
                      type="button"
                      onClick={() => setActiveStrandFilter(isSelected ? 'all' : strand.id)}
                      style={{
                        textAlign: 'left',
                        padding: '18px 20px',
                        borderRadius: 14,
                        border: isSelected ? `2.5px solid ${meta?.color || strand.color}` : `1.5px solid ${meta?.border || '#e2e8f0'}`,
                        background: isSelected ? meta?.bg || '#f8fafc' : '#ffffff',
                        cursor: 'pointer',
                        boxShadow: isSelected ? '0 4px 16px rgba(0,0,0,0.06)' : '0 2px 6px rgba(0,0,0,0.02)',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span style={{ fontSize: 28 }}>{strand.icon}</span>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 800,
                            padding: '3px 8px',
                            borderRadius: 12,
                            background: meta?.color || '#0f172a',
                            color: '#ffffff',
                          }}
                        >
                          {strandUnits.length}개 단원
                        </span>
                      </div>
                      <h3 style={{ fontSize: 17, fontWeight: 800, margin: '0 0 6px', color: '#0f172a' }}>
                        {name(strand)}
                      </h3>
                      <p style={{ fontSize: 12, color: '#475569', margin: 0, lineHeight: 1.5 }}>
                        {ko ? meta?.summaryKo : meta?.summaryEn}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* 4대 영역 탭 필터 바 */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
                <button
                  type="button"
                  onClick={() => setActiveStrandFilter('all')}
                  style={{
                    padding: '7px 14px',
                    borderRadius: 20,
                    fontSize: 12.5,
                    fontWeight: 700,
                    border: activeStrandFilter === 'all' ? '1.5px solid #0f172a' : '1px solid #cbd5e1',
                    background: activeStrandFilter === 'all' ? '#0f172a' : '#ffffff',
                    color: activeStrandFilter === 'all' ? '#ffffff' : '#334155',
                    cursor: 'pointer',
                  }}
                >
                  🌐 전체 영역 모아보기 ({allRegularUnits.length})
                </button>
                {coreStrands.map((strand) => {
                  const strandUnits = allRegularUnits.filter((u) => u.strand === strand.id);
                  const active = activeStrandFilter === strand.id;
                  return (
                    <button
                      key={strand.id}
                      type="button"
                      onClick={() => setActiveStrandFilter(strand.id)}
                      style={{
                        padding: '7px 14px',
                        borderRadius: 20,
                        fontSize: 12.5,
                        fontWeight: 700,
                        border: active ? `1.5px solid ${strand.color}` : '1px solid #cbd5e1',
                        background: active ? strand.color : '#ffffff',
                        color: active ? '#ffffff' : '#334155',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                      }}
                    >
                      <span>{strand.icon}</span>
                      <span>{name(strand)} ({strandUnits.length})</span>
                    </button>
                  );
                })}
              </div>

              {/* Detailed Strands Sections */}
              <div style={{ display: 'grid', gap: 26, marginBottom: 40 }}>
                {coreStrands.filter((s) => activeStrandFilter === 'all' || s.id === activeStrandFilter).map((strand) => {
                  const strandUnits = allRegularUnits.filter((u) => u.strand === strand.id);
                  const meta = STRAND_DESCRIPTIONS[strand.id];

                  return (
                    <section
                      key={strand.id}
                      style={{
                        background: '#ffffff',
                        border: `1.5px solid ${meta?.border || '#e2e8f0'}`,
                        borderRadius: 18,
                        padding: '24px 26px',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 18, borderBottom: '1px solid #f1f5f9', paddingBottom: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span style={{ fontSize: 32 }}>{strand.icon}</span>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: '#0f172a' }}>
                                {name(strand)}
                              </h2>
                              <span style={{ fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: meta?.color || '#0f172a', color: '#ffffff' }}>
                                {strandUnits.length}개 단원
                              </span>
                            </div>
                            <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>
                              {ko ? meta?.summaryKo : meta?.summaryEn}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 14 }}>
                        {strandUnits.map((u) => (
                          <div
                            key={u.id}
                            style={{
                              border: '1px solid #e2e8f0',
                              borderRadius: 12,
                              padding: '14px 16px',
                              background: '#f8fafc',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                            }}
                          >
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                <span style={{ fontSize: 11.5, fontWeight: 800, padding: '2px 8px', borderRadius: 6, background: '#e2e8f0', color: '#334155' }}>
                                  Grade {u.grade}
                                </span>
                                {contentOf(u.id) ? (
                                  <span style={{ fontSize: 11, fontWeight: 700, color: '#059669', background: '#dcfce7', padding: '2px 6px', borderRadius: 6 }}>
                                    ✨ 학습지 수록
                                  </span>
                                ) : (
                                  <span style={{ fontSize: 11, color: '#64748b' }}>교과서/워크북</span>
                                )}
                              </div>
                              <div style={{ fontWeight: 800, fontSize: 15, color: '#0f172a', margin: '6px 0 4px' }}>
                                {name(u)}
                              </div>
                              <div style={{ fontSize: 12.5, color: '#64748b', lineHeight: 1.5, marginBottom: 12 }}>
                                {u.topicsKo}
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: 6, paddingTop: 8, borderTop: '1px solid #e2e8f0' }}>
                              <a
                                href={`/science/g${u.grade}?unit=${u.id}`}
                                style={{
                                  flex: 1,
                                  textAlign: 'center',
                                  padding: '7px 10px',
                                  borderRadius: 6,
                                  fontSize: 12,
                                  fontWeight: 700,
                                  textDecoration: 'none',
                                  background: '#ffffff',
                                  color: meta?.color || '#2563eb',
                                  border: `1px solid ${meta?.color || '#2563eb'}`,
                                }}
                              >
                                자료실 보기 →
                              </a>
                              {contentOf(u.id) && (
                                <a
                                  href={`/science/study?unit=${u.id}`}
                                  style={{
                                    padding: '7px 12px',
                                    borderRadius: 6,
                                    fontSize: 12,
                                    fontWeight: 700,
                                    textDecoration: 'none',
                                    background: meta?.color || '#2563eb',
                                    color: '#ffffff',
                                  }}
                                >
                                  📖 문제 풀기
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: INTERACTIVE STUDY UNITS OR SEARCH RESULTS */}
          {(activeMainTab === 'study' || searchQuery.trim()) && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14, marginBottom: 40 }}>
              {(searchQuery.trim() ? filteredUnits : allRegularUnits.filter((u) => contentOf(u.id))).map((u) => {
                const hasStudy = Boolean(contentOf(u.id));
                const strand = SCIENCE_STRANDS.find((s) => s.id === u.strand);

                return (
                  <div
                    key={u.id}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: 12,
                      padding: '16px',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <span style={{ fontSize: 11.5, fontWeight: 800, padding: '2px 8px', borderRadius: 6, background: '#f1f5f9', color: '#1e293b' }}>
                            Grade {u.grade}
                          </span>
                          {strand && (
                            <span style={{ fontSize: 11, fontWeight: 700, color: strand.color }}>
                              {strand.icon} {name(strand)}
                            </span>
                          )}
                        </div>
                        {hasStudy && (
                          <span style={{ fontSize: 11, fontWeight: 700, color: '#059669', background: '#dcfce7', padding: '2px 6px', borderRadius: 6 }}>
                            ✨ 인터랙티브
                          </span>
                        )}
                      </div>
                      <h3 style={{ fontSize: 15, fontWeight: 700, margin: '6px 0', color: '#0f172a' }}>
                        {name(u)}
                      </h3>
                      <p style={{ fontSize: 12.5, color: '#64748b', margin: '0 0 14px', lineHeight: 1.5 }}>
                        {u.topicsKo}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: 6, paddingTop: 10, borderTop: '1px solid #f1f5f9' }}>
                      {hasStudy && (
                        <a
                          href={`/science/study?unit=${u.id}`}
                          style={{
                            flex: 1,
                            textAlign: 'center',
                            padding: '8px 12px',
                            borderRadius: 6,
                            fontSize: 12.5,
                            fontWeight: 700,
                            textDecoration: 'none',
                            background: '#059669',
                            color: '#ffffff',
                          }}
                        >
                          📖 학습지 풀기
                        </a>
                      )}
                      <a
                        href={`/science/g${u.grade}?unit=${u.id}`}
                        style={{
                          flex: 1,
                          textAlign: 'center',
                          padding: '8px 12px',
                          borderRadius: 6,
                          fontSize: 12.5,
                          fontWeight: 700,
                          textDecoration: 'none',
                          background: '#f8fafc',
                          color: '#334155',
                          border: '1px solid #cbd5e1',
                        }}
                      >
                        자료 보기
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              4. LEARNING FEATURES SHOWCASE CARDS
          ───────────────────────────────────────────────────────────── */}
          <section
            style={{
              background: 'linear-gradient(180deg, #f8fafc 0%, #edf2f7 100%)',
              borderRadius: 20,
              padding: '32px 28px',
              border: '1px solid #e2e8f0',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 8px', color: '#0f172a' }}>
                🌟 국제학교 과학 연구소의 3대 학습 시스템
              </h2>
              <p style={{ fontSize: 13.5, color: '#64748b', margin: 0 }}>
                화학 · 물리 · 생명과학 · 지구과학 4대 핵심 영역의 개념 습득부터 인터랙티브 퀴즈, 오프라인 인쇄용 워크시트까지 완벽하게 지원합니다.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              <div style={{ background: '#ffffff', borderRadius: 14, padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>📘</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px', color: '#0f172a' }}>
                  이중언어 개념 정리 &amp; 필수 어휘
                </h3>
                <p style={{ fontSize: 13, color: '#64748b', margin: 0, lineHeight: 1.6 }}>
                  국제학교 교과서에 등장하는 핵심 과학 용어를 영문과 한글로 정확히 비교 학습하여 어휘력과 개념 이해를 동시에 다집니다.
                </p>
              </div>

              <div style={{ background: '#ffffff', borderRadius: 14, padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>✍️</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px', color: '#0f172a' }}>
                  실시간 자동 채점 인터랙티브 퀴즈
                </h3>
                <p style={{ fontSize: 13, color: '#64748b', margin: 0, lineHeight: 1.6 }}>
                  객관식, 빈칸 채우기, O/X 등 다양한 문항 유형을 웹에서 직접 풀고 즉석에서 정답 여부와 맞춤 피드백을 확인할 수 있습니다.
                </p>
              </div>

              <div style={{ background: '#ffffff', borderRadius: 14, padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>🖨️</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px', color: '#0f172a' }}>
                  QR 코드 연동 인쇄용 실전 워크시트
                </h3>
                <p style={{ fontSize: 13, color: '#64748b', margin: 0, lineHeight: 1.6 }}>
                  인쇄 버튼 하나로 깔끔한 종이 시험지로 출력할 수 있으며, 워크시트 상단의 고유 QR 코드로 즉시 스마트폰 정답지를 확인합니다.
                </p>
              </div>
            </div>
          </section>
        </div>
      ) : (
        /* ─────────────────────────────────────────────────────────────
            5. GRADE SPECIFIC VIEW (when grade is 1~6)
        ───────────────────────────────────────────────────────────── */
        <div>
          {/* Grade Units Section by Strands (화학, 물리, 생명과학, 지구과학 순) */}
          <div style={{ display: 'grid', gap: 24 }}>
            {coreStrands.map((s) => {
              const list = units.filter((u) => u.strand === s.id);
              if (!list.length) return null;
              const meta = STRAND_DESCRIPTIONS[s.id];

              return (
                <section
                  key={s.id}
                  style={{
                    background: '#ffffff',
                    border: `1.5px solid ${meta?.border || '#e2e8f0'}`,
                    borderRadius: 16,
                    padding: '22px 24px',
                    boxShadow: '0 3px 10px rgba(0, 0, 0, 0.02)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, borderBottom: '1px solid #f1f5f9', paddingBottom: 10 }}>
                    <span style={{ fontSize: 22 }}>{s.icon}</span>
                    <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#0f172a' }}>
                      {name(s)}
                    </h2>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#ffffff', background: meta?.color || '#2563eb', padding: '1px 8px', borderRadius: 10 }}>
                      {list.length}개 단원
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
                    {list.map((u) => {
                      const active = u.id === unitId;
                      const tbCount = counts[scienceCategory(u.id, 'tb')] || 0;
                      const wbCount = counts[scienceCategory(u.id, 'wb')] || 0;
                      const hasStudy = Boolean(contentOf(u.id));

                      return (
                        <div
                          key={u.id}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 8,
                            border: active ? `2px solid ${meta?.color || '#2563eb'}` : '1px solid #e2e8f0',
                            borderRadius: 12,
                            background: active ? meta?.bg || 'rgba(37, 99, 235, 0.03)' : '#f8fafc',
                            padding: 14,
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => select(u.id)}
                            aria-pressed={active}
                            style={{
                              textAlign: 'left',
                              font: 'inherit',
                              cursor: 'pointer',
                              background: 'none',
                              border: 'none',
                              padding: 0,
                              color: 'inherit',
                            }}
                          >
                            <div style={{ fontWeight: 800, fontSize: 14.5, color: '#0f172a' }}>
                              {name(u)}
                            </div>
                            <div style={{ fontSize: 12, color: '#64748b', margin: '4px 0 8px', lineHeight: 1.5 }}>
                              {u.topicsKo}
                            </div>
                            <div style={{ display: 'flex', gap: 6, fontSize: 11.5, fontWeight: 600 }}>
                              <span style={{ padding: '2px 6px', borderRadius: 4, background: '#e0f2fe', color: '#0369a1' }}>
                                📘 교과서 {tbCount}
                              </span>
                              <span style={{ padding: '2px 6px', borderRadius: 4, background: '#fef3c7', color: '#b45309' }}>
                                📝 워크북 {wbCount}
                              </span>
                            </div>
                          </button>

                          {hasStudy && (
                            <a
                              href={`/science/study?unit=${u.id}`}
                              style={{
                                textAlign: 'center',
                                padding: '7px 10px',
                                borderRadius: 6,
                                fontSize: 12,
                                fontWeight: 700,
                                textDecoration: 'none',
                                background: meta?.color || '#059669',
                                color: '#ffffff',
                                marginTop: 4,
                              }}
                            >
                              📖 온라인 학습지 풀기 →
                            </a>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>

          {/* Unit Materials Board Container */}
          {unit ? (
            <section
              id="science-board"
              style={{
                marginTop: 32,
                padding: '24px',
                background: '#ffffff',
                border: '1.5px solid #0f172a',
                borderRadius: 16,
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.05)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
                <div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>
                    Grade {unit.grade} · {unit.topicsKo}
                  </span>
                  <h2 style={{ fontSize: 22, fontWeight: 800, margin: '4px 0 0', color: '#0f172a' }}>
                    {name(unit)} 자료실
                  </h2>
                </div>
                {contentOf(unit.id) && (
                  <a
                    href={`/science/study?unit=${unit.id}`}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 700,
                      textDecoration: 'none',
                      background: '#059669',
                      color: '#ffffff',
                    }}
                  >
                    📖 이 단원 실전 학습지 풀기 →
                  </a>
                )}
              </div>

              {/* Kind Selector Tabs (Textbook vs Workbook) */}
              <div role="tablist" className="no-print" style={{ display: 'flex', gap: 8, margin: '0 0 16px', flexWrap: 'wrap' }}>
                {SCIENCE_KINDS.map((k) => (
                  <button
                    key={k.id}
                    type="button"
                    role="tab"
                    aria-selected={k.id === kind}
                    onClick={() => select(unit.id, k.id)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: k.id === kind ? '1.5px solid #0f172a' : '1px solid #cbd5e1',
                      background: k.id === kind ? '#0f172a' : '#ffffff',
                      color: k.id === kind ? '#ffffff' : '#334155',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <span>{k.icon}</span>
                    <span>{name(k)}</span>
                    <span
                      style={{
                        fontSize: 11,
                        padding: '1px 6px',
                        borderRadius: 10,
                        background: k.id === kind ? 'rgba(255, 255, 255, 0.2)' : '#f1f5f9',
                        color: k.id === kind ? '#ffffff' : '#64748b',
                      }}
                    >
                      {counts[scienceCategory(unit.id, k.id)] || 0}
                    </span>
                  </button>
                ))}
              </div>

              <Board
                key={scienceCategory(unit.id, kind)}
                category={scienceCategory(unit.id, kind)}
                adminOnlyPost
                allowReply={false}
                staticPosts={[]}
                attachmentAccept={ACCEPT}
                attachmentLabelKey="formAttachment"
                composerTitleKey="boardCodingComposerTitle"
                movableOptions={movableOptions}
              />
            </section>
          ) : (
            <div
              style={{
                marginTop: 24,
                padding: '24px',
                textAlign: 'center',
                background: '#f8fafc',
                borderRadius: 12,
                border: '1px dashed #cbd5e1',
                color: '#64748b',
                fontSize: 14,
              }}
            >
              👆 {ko ? '위의 단원 카드를 클릭하면 교과서 및 워크북 자료실이 열립니다.' : 'Select a unit above to view its textbook and workbook materials.'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
