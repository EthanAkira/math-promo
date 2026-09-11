'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../auth';
import { useLanguage } from '../../language';
import { CSAT_SUBJECTS, csatUnitTagLabel, COMMON_MATH_SUBJECTS, commonMathUnitTagLabel } from '../../examUnits';
import TopicWorksheetView from '../../components/TopicWorksheetView';
import staticCsatCatalog from '../../data/csatProblemCatalog.json';

const COPY = {
  ko: {
    home: '홈',
    hub: '수능 기출문제',
    title: '단원별 수능 기출문제',
    subtitle: '수능 출제 범위인 수학Ⅰ·수학Ⅱ·확률과 통계·미적분·기하 다섯 과목을 세부 단원별 학습지로 풀어보고, 실시간 수식과 해설을 확인해보세요.',
    tabProblems: '✍️ 세부 단원별 문항 풀기',
    tabFiles: '📁 대단원별 파일 다운로드 (PDF)',
    allSubjects: '전체 과목',
    problemCount: (n) => `${n}문항`,
    totalProblemsCount: (n) => `총 ${n}문항 등록됨`,
    searchPlaceholder: '단원명, 키워드로 검색 (예: 지수, 미분, 적분, 삼각함수, 확률)...',
    loading: '자료를 불러오는 중입니다...',
    error: '자료를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.',
    empty: '아직 이 단원으로 등록된 기출문항이 없습니다.',
    emptyFiles: '아직 이 단원으로 태그된 자료가 없습니다.',
    untagged: '아직 단원 태그가 없는 자료는 시험 종류별 보기에서 확인할 수 있습니다.',
    byType: '시험 종류별로 보기',
    fileCount: (n) => `${n}개 자료`,
    memberNotice: '단원별 자료(기출변형·자세한 해설 포함)는 로그인 후 CSAT 구독 회원만 열람할 수 있습니다. 목록은 자유롭게 둘러보세요.',
    alertNeedLogin: '로그인이 필요한 서비스입니다. 오른쪽 위 로그인 버튼으로 먼저 로그인해주세요.',
    alertNeedSub: '구독이 필요한 서비스입니다. 결제·구독 서비스는 준비 중이며, 이용을 원하시면 문의하기로 연락해주세요.',
  },
  en: {
    home: 'Home',
    hub: 'CSAT Archive',
    title: 'CSAT Archive by Unit',
    subtitle: 'Practice all five CSAT math subjects (Math I, Math II, Probability & Statistics, Calculus, Geometry) as structured topic worksheets with step-by-step solutions.',
    tabProblems: '✍️ Practice by Unit (Worksheets)',
    tabFiles: '📁 Download by Subject (PDF)',
    allSubjects: 'All Subjects',
    problemCount: (n) => `${n} problem${n === 1 ? '' : 's'}`,
    totalProblemsCount: (n) => `${n} problems in catalog`,
    searchPlaceholder: 'Search unit, keywords (e.g. log, derivative, integral, trig, probability)...',
    loading: 'Loading archive...',
    error: 'Could not load the archive. Please try again shortly.',
    empty: 'No problems in this unit yet.',
    emptyFiles: 'No materials tagged with this unit yet.',
    untagged: 'Materials without a unit tag are still browsable by exam type.',
    byType: 'Browse by exam type',
    fileCount: (n) => `${n} item${n === 1 ? '' : 's'}`,
    memberNotice: 'Materials by unit (including variant problems and detailed solutions) are available to logged-in CSAT subscribers only. Feel free to browse the list.',
    alertNeedLogin: 'Login required. Please log in using the button in the header.',
    alertNeedSub: 'A subscription is required. Paid subscriptions are coming soon — contact us if you would like access.',
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
const GRADE_LABELS = { g1: '고1', g2: '고2', g3: '고3' };

function fileTypeLabel(type, language) {
  const labels = FILE_TYPE_LABELS[language] || FILE_TYPE_LABELS.en;
  if (type.startsWith('solutions__')) return `${labels.solutions} (${type.slice('solutions__'.length)})`;
  return labels[type] || type;
}

const TIER_ORDER = { basic: 0, intermediate: 1, advanced: 2 };
const TIER_LABELS = {
  basic: { ko: '하', en: 'Basic' },
  intermediate: { ko: '중', en: 'Intermediate' },
  advanced: { ko: '상', en: 'Advanced' },
};
function tierWithin(unitTier, ceiling) {
  if (!unitTier) return true;
  return TIER_ORDER[unitTier] <= TIER_ORDER[ceiling];
}

function shuffleArray(values) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

const SUBJECT_COLORS = {
  math1: { bg: 'rgba(59, 130, 246, 0.08)', border: '#3b82f6', text: '#1d4ed8' },
  math2: { bg: 'rgba(16, 185, 129, 0.08)', border: '#10b981', text: '#047857' },
  'prob-stats': { bg: 'rgba(168, 85, 247, 0.08)', border: '#a855f7', text: '#7e22ce' },
  calculus: { bg: 'rgba(245, 158, 11, 0.08)', border: '#f59e0b', text: '#b45309' },
  geometry: { bg: 'rgba(236, 72, 153, 0.08)', border: '#ec4899', text: '#be185d' },
};

export default function CsatUnitBrowser() {
  const { language } = useLanguage();
  const words = COPY[language] || COPY.en;
  const { user, status: authStatus } = useAuth();
  const [subStatus, setSubStatus] = useState('loading'); // loading | active | inactive
  const [manifest, setManifest] = useState(null);
  const [status, setStatus] = useState('loading');
  const [activeTab, setActiveTab] = useState('problems'); // 'problems' | 'files'
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFileUnit, setOpenFileUnit] = useState(null);
  const [selectedUnitId, setSelectedUnitId] = useState(null);

  // Core practice test (multi-unit, count- and difficulty-configurable) state
  const [coreSelectedUnitIds, setCoreSelectedUnitIds] = useState([]);
  const [coreTierCeiling, setCoreTierCeiling] = useState('advanced');
  const [coreCount, setCoreCount] = useState(20);
  const [coreProblems, setCoreProblems] = useState(null);

  // Sync selected unit with URL query
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const u = params.get('unit');
    if (u) setSelectedUnitId(u);

    const handlePopState = () => {
      const p = new URLSearchParams(window.location.search);
      setSelectedUnitId(p.get('unit'));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  function handleOpenWorksheet(unitId) {
    setSelectedUnitId(unitId);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('unit', unitId);
      window.history.pushState({}, '', url.toString());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function handleBackToCatalog() {
    setSelectedUnitId(null);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('unit');
      window.history.pushState({}, '', url.toString());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Auth check
  useEffect(() => {
    if (authStatus !== 'ready') return;
    if (!user) { setSubStatus('inactive'); return; }
    let cancelled = false;
    setSubStatus('loading');
    fetch('/api/subscriptions/status?subject=csat')
      .then((res) => res.json())
      .then((data) => { if (!cancelled) setSubStatus(data.active ? 'active' : 'inactive'); })
      .catch(() => { if (!cancelled) setSubStatus('inactive'); });
    return () => { cancelled = true; };
  }, [authStatus, user]);

  const entitled = authStatus === 'ready' && !!user && subStatus === 'active';

  // Fetch file manifest
  useEffect(() => {
    let cancelled = false;
    fetch('/api/csat/manifest')
      .then((res) => { if (!res.ok) throw new Error('bad response'); return res.json(); })
      .then((data) => { if (!cancelled) { setManifest(data); setStatus('ready'); } })
      .catch(() => { if (!cancelled) setStatus('error'); });
    return () => { cancelled = true; };
  }, []);

  // Group problems by unit
  const problemsByUnit = useMemo(() => {
    const map = new Map();
    for (const subject of CSAT_SUBJECTS) {
      for (const unit of subject.units) {
        map.set(unit.id, []);
      }
    }
    for (const p of staticCsatCatalog) {
      if (p.unitId && map.has(p.unitId)) {
        map.get(p.unitId).push(p);
      }
    }
    return map;
  }, []);

  const subjectCounts = useMemo(() => {
    const counts = {};
    for (const subject of CSAT_SUBJECTS) {
      let sum = 0;
      for (const unit of subject.units) {
        sum += (problemsByUnit.get(unit.id) || []).length;
      }
      counts[subject.id] = sum;
    }
    return counts;
  }, [problemsByUnit]);

  // Manifest items by tag (both the 고3 CSAT_SUBJECTS taxonomy and the 고1 COMMON_MATH_SUBJECTS one
  // share this map — a file's unit_tag string only ever matches one or the other).
  const itemsByTag = useMemo(() => {
    const map = new Map();
    for (const subject of CSAT_SUBJECTS) {
      for (const unit of subject.units) map.set(csatUnitTagLabel(subject, unit), []);
    }
    for (const subject of COMMON_MATH_SUBJECTS) {
      for (const unit of subject.units) map.set(commonMathUnitTagLabel(subject, unit), []);
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

  // 고1/고2 업로드는 /csat/june·/csat/sept가 아니라 각자의 학년별 아카이브 페이지로 연결해야 한다.
  function fileHref(examType, year, variant, file) {
    const grade = file.meta?.grade;
    if (grade === 'g1') return `/csat/grade1?examType=${examType}&year=${year}&variant=${variant.id}`;
    if (grade === 'g2') return `/csat/grade2?examType=${examType}&year=${year}&variant=${variant.id}`;
    return `/csat/${examType}?year=${year}&variant=${variant.id}`;
  }

  function toggleCoreUnit(unitId) {
    setCoreSelectedUnitIds((current) => (current.includes(unitId) ? current.filter((id) => id !== unitId) : [...current, unitId]));
  }

  function toggleCoreSubject(subject) {
    const idsInSubject = subject.units.map((unit) => unit.id);
    const allSelected = idsInSubject.every((id) => coreSelectedUnitIds.includes(id));
    setCoreSelectedUnitIds((current) => (allSelected
      ? current.filter((id) => !idsInSubject.includes(id))
      : [...new Set([...current, ...idsInSubject])]));
  }

  const allUnitsFlat = useMemo(() => CSAT_SUBJECTS.flatMap((subject) => subject.units.map((unit) => ({ ...unit, subjectId: subject.id }))), []);

  function generateCoreTest() {
    const eligibleUnits = allUnitsFlat.filter((unit) => coreSelectedUnitIds.includes(unit.id) && tierWithin(unit.tier, coreTierCeiling));
    const eligibleUnitIds = new Set(eligibleUnits.map((unit) => unit.id));
    const matching = staticCsatCatalog.filter((problem) => eligibleUnitIds.has(problem.unitId));
    setCoreProblems(shuffleArray(matching).slice(0, coreCount));
  }

  function handleItemClick(event) {
    if (entitled) return;
    event.preventDefault();
    if (authStatus !== 'ready' || subStatus === 'loading') return;
    window.alert(!user ? words.alertNeedLogin : words.alertNeedSub);
  }

  // Active Subject & Unit when worksheet is open
  const activeSubjectAndUnit = useMemo(() => {
    if (!selectedUnitId) return null;
    for (const subject of CSAT_SUBJECTS) {
      for (const unit of subject.units) {
        if (unit.id === selectedUnitId) {
          return { subject, unit };
        }
      }
    }
    return null;
  }, [selectedUnitId]);

  if (activeSubjectAndUnit) {
    const { subject, unit } = activeSubjectAndUnit;
    const unitProblems = problemsByUnit.get(unit.id) || [];
    return (
      <div style={{ maxWidth: 1040, margin: '0 auto', padding: '10px 0 60px' }}>
        <TopicWorksheetView
          category="csat"
          subjectLabel={`${subject.label} (${subject.revised2022 || ''})`}
          unit={{
            ...unit,
            revised2022: subject.revised2022,
          }}
          problems={unitProblems}
          onBack={handleBackToCatalog}
          language={language}
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1040, margin: '0 auto', paddingBottom: 60 }}>
      {/* Breadcrumb */}
      <p className="no-print" style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 6 }}>
        <a href="/">{words.home}</a> / <a href="/csat.html">{words.hub}</a> / {words.title}
      </p>

      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
        <div>
          <h1 className="font-display" style={{ fontSize: 26, margin: '0 0 6px' }}>{words.title}</h1>
          <p style={{ color: 'var(--ink-soft)', margin: 0, fontSize: 14 }}>{words.subtitle}</p>
        </div>
        <a href="/csat" className="button button-secondary" style={{ textDecoration: 'none', whiteSpace: 'nowrap' }}>
          {words.byType} →
        </a>
      </div>

      {!entitled ? (
        <div style={{ background: 'rgba(239, 68, 68, 0.07)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: 10, padding: '10px 14px', margin: '14px 0 18px', fontSize: 13, color: 'var(--red-pen, #dc2626)' }}>
          🔒 {words.memberNotice}
        </div>
      ) : null}

      {/* View Mode Switcher (Tab bar) */}
      <div style={{ display: 'flex', gap: 8, borderBottom: '2px solid var(--paper-line, #e5e7eb)', margin: '20px 0 20px' }}>
        <button
          type="button"
          onClick={() => setActiveTab('problems')}
          style={{
            padding: '10px 18px',
            fontSize: 15,
            fontWeight: 700,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderBottom: activeTab === 'problems' ? '3px solid var(--primary, #2563eb)' : '3px solid transparent',
            color: activeTab === 'problems' ? 'var(--primary, #2563eb)' : 'var(--ink-soft, #6b7280)',
            marginBottom: -2,
            transition: 'all 0.15s ease',
          }}
        >
          {words.tabProblems} <span style={{ fontSize: 12, fontWeight: 500, opacity: 0.85 }}>({staticCsatCatalog.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('files')}
          style={{
            padding: '10px 18px',
            fontSize: 15,
            fontWeight: 700,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderBottom: activeTab === 'files' ? '3px solid var(--primary, #2563eb)' : '3px solid transparent',
            color: activeTab === 'files' ? 'var(--primary, #2563eb)' : 'var(--ink-soft, #6b7280)',
            marginBottom: -2,
            transition: 'all 0.15s ease',
          }}
        >
          {words.tabFiles}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('core')}
          style={{
            padding: '10px 18px',
            fontSize: 15,
            fontWeight: 700,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderBottom: activeTab === 'core' ? '3px solid var(--primary, #2563eb)' : '3px solid transparent',
            color: activeTab === 'core' ? 'var(--primary, #2563eb)' : 'var(--ink-soft, #6b7280)',
            marginBottom: -2,
            transition: 'all 0.15s ease',
          }}
        >
          {language === 'ko' ? '🎯 종합 테스트 만들기' : '🎯 Core Practice Test'}
        </button>
      </div>

      {/* VIEW 3: CORE PRACTICE TEST (multi-unit, count- & difficulty-configurable, archive-pool based) */}
      {activeTab === 'core' && (
        coreProblems !== null ? (
          <div>
            <button type="button" className="button button-secondary" style={{ marginBottom: 12 }} onClick={() => setCoreProblems(null)}>
              ← {language === 'ko' ? '단원 선택으로 돌아가기' : 'Back to unit selection'}
            </button>
            {coreProblems.length < coreCount ? (
              <div style={{ background: 'rgba(217, 119, 6, 0.08)', border: '1px solid rgba(217, 119, 6, 0.25)', borderRadius: 10, padding: '10px 14px', margin: '0 0 16px', fontSize: 13, color: '#92400e' }}>
                {language === 'ko'
                  ? `선택한 조건에 맞는 기출문제 중 ${coreProblems.length}개를 찾았습니다 (요청: ${coreCount}개). CSAT 기출 아카이브는 단원당 문항 수가 제한적입니다 — 더 많은 단원을 선택하거나 난이도 상한을 올려보세요.`
                  : `Found ${coreProblems.length} archived problems matching your selection (requested: ${coreCount}). The CSAT archive has a limited number of tagged problems per unit — try selecting more units or raising the difficulty ceiling.`}
              </div>
            ) : null}
            <TopicWorksheetView
              category="csat"
              subjectLabel={language === 'ko' ? `${coreSelectedUnitIds.length}개 단원 선택` : `${coreSelectedUnitIds.length} units selected`}
              unit={{
                label: '종합 테스트',
                labelEn: 'Core Practice Test',
                desc: language === 'ko'
                  ? `${coreProblems.length}문항 · 난이도 ${TIER_LABELS[coreTierCeiling].ko}까지`
                  : `${coreProblems.length} problems · up to ${TIER_LABELS[coreTierCeiling].en}`,
              }}
              problems={coreProblems}
              onBack={() => setCoreProblems(null)}
              language={language}
            />
          </div>
        ) : (
          <div>
            <p style={{ color: 'var(--ink-soft)', fontSize: 14, margin: '0 0 16px' }}>
              {language === 'ko'
                ? '기말고사·모의고사 범위에 맞춰 여러 단원을 한 번에 선택하고, 문제 수와 난이도 상한을 지정해 종합 테스트를 만드세요. CSAT은 기출 아카이브 문항만 사용하므로, 조건에 맞는 문항이 요청 수보다 적을 수 있습니다.'
                : 'Select every unit covered by your final or mock-exam scope, then set a problem count and a difficulty ceiling. CSAT draws only from the archived catalog, so a narrow selection may return fewer problems than requested.'}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginBottom: 20 }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, margin: '0 0 6px', color: 'var(--ink)' }}>{language === 'ko' ? '난이도 상한' : 'Difficulty Ceiling'}</p>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['basic', 'intermediate', 'advanced'].map((tier) => (
                    <button type="button" key={tier} onClick={() => setCoreTierCeiling(tier)} style={{ padding: '7px 14px', borderRadius: 8, fontSize: 12.5, fontWeight: 700, border: coreTierCeiling === tier ? '1.5px solid #111827' : '1px solid var(--paper-line, #d1d5db)', background: coreTierCeiling === tier ? '#111827' : 'var(--card-bg, #fff)', color: coreTierCeiling === tier ? '#fff' : 'var(--ink)', cursor: 'pointer' }}>
                      {language === 'ko' ? `${TIER_LABELS[tier].ko}까지` : `Up to ${TIER_LABELS[tier].en}`}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, margin: '0 0 6px', color: 'var(--ink)' }}>{language === 'ko' ? '문제 수' : 'Problem Count'}</p>
                <input type="number" min={5} max={100} value={coreCount} onChange={(event) => setCoreCount(Math.min(100, Math.max(5, Number(event.target.value) || 20)))} style={{ width: 100, height: 34, borderRadius: 8, border: '1px solid var(--paper-line, #d1d5db)', padding: '0 10px', fontSize: 14 }} />
              </div>
              <div style={{ alignSelf: 'flex-end' }}>
                <button type="button" className="button button-primary" onClick={generateCoreTest} disabled={coreSelectedUnitIds.length === 0}
                  style={{ opacity: coreSelectedUnitIds.length === 0 ? 0.5 : 1, cursor: coreSelectedUnitIds.length === 0 ? 'not-allowed' : 'pointer' }}>
                  {language === 'ko' ? `테스트 생성 (${coreSelectedUnitIds.length}개 단원 선택됨)` : `Generate Test (${coreSelectedUnitIds.length} selected)`}
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gap: 16 }}>
              {CSAT_SUBJECTS.map((subject) => {
                const idsInSubject = subject.units.map((unit) => unit.id);
                const allSelected = idsInSubject.every((id) => coreSelectedUnitIds.includes(id));
                return (
                  <div key={subject.id} style={{ border: '1px solid var(--paper-line, #e5e7eb)', borderRadius: 12, padding: '14px 16px', background: 'var(--card-bg, #fff)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <strong style={{ fontSize: 14 }}>{subject.label} <span style={{ fontWeight: 500, fontSize: 12, color: 'var(--ink-soft)' }}>({language === 'en' ? subject.labelEn : `2022개정: ${subject.revised2022}`})</span></strong>
                      <button type="button" onClick={() => toggleCoreSubject(subject)} style={{ background: 'none', border: 'none', color: 'var(--primary, #2563eb)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                        {allSelected ? (language === 'ko' ? '전체 해제' : 'Deselect all') : (language === 'ko' ? '전체 선택' : 'Select all')}
                      </button>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {subject.units.map((unit) => {
                        const count = problemsByUnit.get(unit.id)?.length || 0;
                        const outOfRange = !tierWithin(unit.tier, coreTierCeiling);
                        return (
                          <label key={unit.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, border: '1px solid var(--paper-line, #d1d5db)', borderRadius: 7, padding: '5px 9px', fontSize: 12.5, cursor: 'pointer', background: '#fff', opacity: outOfRange ? 0.45 : 1 }}>
                            <input type="checkbox" checked={coreSelectedUnitIds.includes(unit.id)} onChange={() => toggleCoreUnit(unit.id)} style={{ margin: 0 }} />
                            <span>{unit.label} ({count})</span>
                            {unit.tier ? <em style={{ fontStyle: 'normal', fontSize: 10, padding: '1px 5px', borderRadius: 999, background: unit.tier === 'basic' ? '#e0f2e9' : unit.tier === 'intermediate' ? '#fef3c7' : '#fde2e2', color: unit.tier === 'basic' ? '#1a7a4c' : unit.tier === 'intermediate' ? '#92640a' : '#b91c1c' }}>{language === 'ko' ? TIER_LABELS[unit.tier].ko : TIER_LABELS[unit.tier].en}</em> : null}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )
      )}

      {/* VIEW 1: CSAT Topic Worksheets Browser */}
      {activeTab === 'problems' && (
        <div>
          {/* Subject Filter Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
            <button
              type="button"
              onClick={() => setSelectedSubject('all')}
              style={{
                padding: '5px 12px',
                borderRadius: 16,
                fontSize: 12,
                fontWeight: selectedSubject === 'all' ? 700 : 500,
                border: selectedSubject === 'all' ? '1.5px solid #111827' : '1px solid var(--paper-line, #e5e7eb)',
                background: selectedSubject === 'all' ? '#111827' : 'var(--card-bg, #ffffff)',
                color: selectedSubject === 'all' ? '#ffffff' : 'var(--ink, #374151)',
                cursor: 'pointer',
              }}
            >
              {words.allSubjects} ({staticCsatCatalog.length})
            </button>
            {CSAT_SUBJECTS.map((subject) => {
              const active = selectedSubject === subject.id;
              const count = subjectCounts[subject.id] || 0;
              const styleMeta = SUBJECT_COLORS[subject.id] || SUBJECT_COLORS.math1;
              return (
                <button
                  key={subject.id}
                  type="button"
                  onClick={() => setSelectedSubject(active ? 'all' : subject.id)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 16,
                    fontSize: 12,
                    fontWeight: active ? 700 : 500,
                    border: active ? `1.5px solid ${styleMeta.border}` : '1px solid var(--paper-line, #e5e7eb)',
                    background: active ? styleMeta.border : styleMeta.bg,
                    color: active ? '#ffffff' : styleMeta.text,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {subject.label} ({count})
                </button>
              );
            })}
          </div>

          {/* Search bar */}
          <div style={{ marginBottom: 20 }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={words.searchPlaceholder}
              style={{
                width: '100%',
                padding: '9px 14px',
                borderRadius: 8,
                border: '1px solid var(--paper-line, #d1d5db)',
                background: 'var(--card-bg, #ffffff)',
                fontSize: 13,
                color: 'var(--ink, #111827)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Subject Sections */}
          <div style={{ display: 'grid', gap: 24 }}>
            {CSAT_SUBJECTS.filter((subject) => {
              if (selectedSubject !== 'all' && selectedSubject !== subject.id) return false;
              return true;
            }).map((subject) => {
              const styleMeta = SUBJECT_COLORS[subject.id] || SUBJECT_COLORS.math1;
              const totalInSubject = subjectCounts[subject.id] || 0;

              return (
                <section
                  key={subject.id}
                  style={{
                    background: 'var(--card-bg, #ffffff)',
                    border: '1px solid var(--paper-line, #e5e7eb)',
                    borderRadius: 14,
                    padding: '20px 22px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  }}
                >
                  {/* Subject Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--paper-line, #e5e7eb)', paddingBottom: 12, marginBottom: 14 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: styleMeta.border }}></span>
                        <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: 'var(--ink, #111827)' }}>
                          {subject.label}{' '}
                          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-soft)' }}>
                            ({language === 'en' ? subject.labelEn : `2022개정: ${subject.revised2022}`})
                          </span>
                        </h2>
                        <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 10, background: styleMeta.bg, color: styleMeta.text, fontWeight: 600 }}>
                          {words.problemCount(totalInSubject)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Units List */}
                  <div style={{ display: 'grid', gap: 12 }}>
                    {subject.units.filter((unit) => {
                      if (!searchQuery) return true;
                      const q = searchQuery.toLowerCase().trim();
                      return unit.label.toLowerCase().includes(q) || (unit.labelEn || '').toLowerCase().includes(q);
                    }).map((unit) => {
                      const list = problemsByUnit.get(unit.id) || [];

                      return (
                        <div
                          key={unit.id}
                          style={{
                            border: '1px solid var(--paper-line, #e5e7eb)',
                            borderRadius: 12,
                            background: 'var(--card-bg, #ffffff)',
                            padding: '16px 20px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 14,
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <div style={{ flex: '1 1 340px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                              <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink, #111827)' }}>
                                {unit.label}
                              </span>
                              <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
                                ({unit.labelEn})
                              </span>
                              <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: 'var(--paper-line, #e5e7eb)', color: 'var(--ink, #374151)' }}>
                                {words.problemCount(list.length)}
                              </span>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8, alignItems: 'center' }}>
                              <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 6, background: 'rgba(99, 102, 241, 0.1)', color: '#4338ca', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
                                🏛️ 2022개정: {subject.revised2022}
                              </span>
                            </div>
                          </div>

                          {/* Action Button: Open Worksheet */}
                          <div>
                            <button
                              type="button"
                              onClick={() => handleOpenWorksheet(unit.id)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                                padding: '9px 18px',
                                borderRadius: 8,
                                fontSize: 13,
                                fontWeight: 700,
                                background: 'var(--primary, #2563eb)',
                                color: '#ffffff',
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
                              }}
                            >
                              <span>📝</span>
                              <span>{language === 'ko' ? `실전 학습지 풀기 (${list.length}문항) →` : `Open Worksheet (${list.length}) →`}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: PDF File Manifest Browser */}
      {activeTab === 'files' && (
        <div>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, margin: '0 0 16px' }}>{words.untagged}</p>
          {status === 'loading' ? <p style={{ color: 'var(--ink-soft)' }}>{words.loading}</p> : null}
          {status === 'error' ? <p style={{ color: 'var(--red-pen)' }}>{words.error}</p> : null}

          {status === 'ready' && (
            <div style={{ display: 'grid', gap: 24 }}>
              {CSAT_SUBJECTS.map((subject) => (
                <section key={subject.id}>
                  <h2 style={{ fontSize: 18, margin: '0 0 4px' }}>{subject.label}</h2>
                  <p style={{ fontSize: 12, color: 'var(--ink-soft)', margin: '0 0 10px' }}>2022개정: {subject.revised2022}</p>
                  <div style={{ display: 'grid', gap: 10 }}>
                    {subject.units.map((unit) => {
                      const tag = csatUnitTagLabel(subject, unit);
                      const items = itemsByTag.get(tag) || [];
                      const openKey = `${subject.id}-${unit.id}`;
                      const open = openFileUnit === openKey;
                      return (
                        <div key={unit.id} style={{ background: 'var(--card-bg)', border: '1px solid var(--paper-line)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
                          <button
                            type="button"
                            onClick={() => setOpenFileUnit(open ? null : openKey)}
                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '14px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', font: 'inherit' }}
                          >
                            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>{unit.label}</span>
                            <span style={{ fontSize: 12, color: 'var(--ink-soft)', whiteSpace: 'nowrap' }}>{words.fileCount(items.length)} {open ? '▲' : '▼'}</span>
                          </button>
                          {open ? (
                            <div style={{ padding: '0 20px 16px', display: 'grid', gap: 8 }}>
                              {items.length === 0 ? (
                                <p style={{ color: 'var(--ink-soft)', fontSize: 14, margin: 0 }}>{words.emptyFiles}</p>
                              ) : (
                                items.map(({ examType, year, variant, fileType, file }) => (
                                  <a
                                    key={`${examType}-${year}-${variant.id}-${fileType}`}
                                    href={fileHref(examType, year, variant, file)}
                                    onClick={handleItemClick}
                                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--paper)', borderRadius: 8, textDecoration: 'none', color: 'var(--ink)' }}
                                  >
                                    <span>{!entitled || file.meta?.accessTier === 'premium' ? '🔒 ' : ''}{year} {EXAM_TYPE_LABELS[examType]} · {variant.label}{file.meta?.grade === 'g1' || file.meta?.grade === 'g2' ? ` · ${GRADE_LABELS[file.meta.grade]}` : ''}</span>
                                    <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{fileTypeLabel(fileType, language)} →</span>
                                  </a>
                                ))
                              )}
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}

              {/* 고1 공통수학1·2: 고3 CSAT_SUBJECTS(수학Ⅰ·Ⅱ·확통·미적분·기하)와 출제 범위가 달라 별도 섹션으로 둔다. */}
              {COMMON_MATH_SUBJECTS.map((subject) => (
                <section key={subject.id}>
                  <h2 style={{ fontSize: 18, margin: '0 0 4px' }}>{subject.label} <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-soft)' }}>({language === 'ko' ? '고1 공통 과목' : 'Grade 10 Common Subject'})</span></h2>
                  <p style={{ fontSize: 12, color: 'var(--ink-soft)', margin: '0 0 10px' }}>2022개정: {subject.revised2022}</p>
                  <div style={{ display: 'grid', gap: 10 }}>
                    {subject.units.map((unit) => {
                      const tag = commonMathUnitTagLabel(subject, unit);
                      const items = itemsByTag.get(tag) || [];
                      const openKey = `${subject.id}-${unit.id}`;
                      const open = openFileUnit === openKey;
                      return (
                        <div key={unit.id} style={{ background: 'var(--card-bg)', border: '1px solid var(--paper-line)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
                          <button
                            type="button"
                            onClick={() => setOpenFileUnit(open ? null : openKey)}
                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '14px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', font: 'inherit' }}
                          >
                            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>{unit.label}</span>
                            <span style={{ fontSize: 12, color: 'var(--ink-soft)', whiteSpace: 'nowrap' }}>{words.fileCount(items.length)} {open ? '▲' : '▼'}</span>
                          </button>
                          {open ? (
                            <div style={{ padding: '0 20px 16px', display: 'grid', gap: 8 }}>
                              {items.length === 0 ? (
                                <p style={{ color: 'var(--ink-soft)', fontSize: 14, margin: 0 }}>{words.emptyFiles}</p>
                              ) : (
                                items.map(({ examType, year, variant, fileType, file }) => (
                                  <a
                                    key={`${examType}-${year}-${variant.id}-${fileType}`}
                                    href={fileHref(examType, year, variant, file)}
                                    onClick={handleItemClick}
                                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--paper)', borderRadius: 8, textDecoration: 'none', color: 'var(--ink)' }}
                                  >
                                    <span>{!entitled || file.meta?.accessTier === 'premium' ? '🔒 ' : ''}{year} {EXAM_TYPE_LABELS[examType]} · {variant.label}</span>
                                    <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{fileTypeLabel(fileType, language)} →</span>
                                  </a>
                                ))
                              )}
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
