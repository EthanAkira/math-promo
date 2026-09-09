'use client';

import { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import { useAuth } from '../../auth';
import { useLanguage } from '../../language';
import { AMC_UNITS, AMC_FINE_SUBJECTS } from '../../examUnits';
import InteractiveProblemCard from '../../components/InteractiveProblemCard';
import TopicWorksheetView from '../../components/TopicWorksheetView';
import staticAmc8Catalog from '../../data/amc8ProblemCatalog.json';
import { generateAmcVariantProblem } from '../amcProblemGenerator';

// --- Seeded worksheet generation (same pattern as the Korean-curriculum generator pages:
// a random 8-char seed drives a deterministic PRNG so a printed/QR-scanned URL reproduces the
// exact same problem set) ---
const AMC_SHEET_SIZE = 20;

function hashSeed(text) {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) { hash ^= text.charCodeAt(index); hash = Math.imul(hash, 16777619); }
  return hash >>> 0;
}

function seededRandom(seedText) {
  let value = hashSeed(seedText);
  return function next() {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function createSheetSeed() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const values = new Uint32Array(8);
  window.crypto.getRandomValues(values);
  return Array.from(values, (value) => alphabet[value % alphabet.length]).join('');
}

// Generates up to AMC_SHEET_SIZE unique-by-question-text variant problems for a unit, driven by a
// seeded PRNG (the AMC generators call Math.random() internally rather than accepting an injected
// random function, so it's temporarily swapped in for the duration of this call and restored after
// — never left patched, and never reused across concurrent calls since this runs synchronously).
// If the generator only has a few distinct shapes, fewer than AMC_SHEET_SIZE unique problems may
// come out — that's fine, the sheet is just shorter, never padded with duplicates.
function makeAmcVariantSheet(seed, unit, language) {
  const originalRandom = Math.random;
  Math.random = seededRandom(`${seed}:${unit.id}:${language}`);
  try {
    const used = new Set();
    const problems = [];
    let guard = 0;
    while (problems.length < AMC_SHEET_SIZE && guard < AMC_SHEET_SIZE * 15) {
      guard += 1;
      const item = generateAmcVariantProblem(unit, language);
      if (used.has(item.question)) continue;
      used.add(item.question);
      problems.push({
        ...item,
        id: `${unit.id}-sheet-${problems.length + 1}`,
        sourceLabel: language === 'ko' ? '알고리즘 유사 변형' : 'Algorithmic Variant',
      });
    }
    return problems;
  } finally {
    Math.random = originalRandom;
  }
}

function buildAmcSheetUrl(unitId, seed) {
  const url = new URL(window.location.href);
  url.searchParams.set('unit', unitId);
  url.searchParams.set('variant', '1');
  url.searchParams.set('sheet', seed);
  return url.toString();
}

const COPY = {
  ko: {
    home: '홈',
    hub: 'AMC 기출문제',
    title: '단원별 AMC 기출문제',
    subtitle: '1998년부터 2024년까지 전체 AMC 8 기출문제(435문항)를 세분화된 단원별로 학습하고, KaTeX 수식과 해설을 실시간으로 확인해보세요.',
    loading: '자료를 불러오는 중입니다...',
    error: '자료를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.',
    empty: '아직 이 단원으로 태그된 자료가 없습니다.',
    untagged: '연도별 전체 시험지는 상단 "연도별로 보기" 버튼에서 확인할 수 있습니다.',
    byYear: '연도별로 보기',
    fileCount: (n) => `${n}개 자료`,
    memberNotice: '단원별 자료(기출변형·자세한 해설 포함)는 로그인 후 AMC 구독 회원만 열람할 수 있습니다. 목록은 자유롭게 둘러보세요.',
    alertNeedLogin: '로그인이 필요한 서비스입니다. 오른쪽 위 로그인 버튼으로 먼저 로그인해주세요.',
    alertNeedSub: '구독이 필요한 서비스입니다. 결제·구독 서비스는 준비 중이며, 이용을 원하시면 문의하기로 연락해주세요.',
    tabProblems: '✍️ 세부 단원별 문항 풀기',
    tabFiles: '📁 대단원별 파일 다운로드 (PDF)',
    byProblemIntro: '미국수학경시대회(AMC 8) 1998~2024년 435개 전 문항을 34개 세부 경시 주제로 정밀 분류했습니다. 단원을 펼쳐 문항을 직접 풀고 해설을 확인하세요.',
    searchPlaceholder: '연도, 문항 번호, 키워드로 검색 (예: 2024, #5, 소수, 넓이, 속력)...',
    expandAll: '모두 펼치기',
    collapseAll: '모두 접기',
    allDomains: '전체 분야',
    problemCount: (n) => `${n}문항`,
    totalProblemsCount: (n) => `총 ${n}문항 등록됨`,
    noProblemsFound: '선택한 조건에 일치하는 문항이 없습니다.',
    problemLabel: (level, year, num) => `${year}년 AMC ${level} · ${num}번`,
    collapse: '접기',
    open: '풀기 / 해설',
    levelAll: '전체 레벨',
    level8: 'AMC 8 (435문항)',
    level10: 'AMC 10',
    level12: 'AMC 12',
  },
  en: {
    home: 'Home',
    hub: 'AMC Archive',
    title: 'AMC Archive by Topic',
    subtitle: 'Practice all 435 AMC 8 competition problems from 1998 to 2024 organized into 34 fine-grained topics with step-by-step solutions.',
    loading: 'Loading archive...',
    error: 'Could not load the archive. Please try again shortly.',
    empty: 'No materials tagged with this topic yet.',
    untagged: 'Full exam booklets are browsable by year via the top button.',
    byYear: 'Browse by Year',
    fileCount: (n) => `${n} item${n === 1 ? '' : 's'}`,
    memberNotice: 'Materials by topic (including variant problems and solutions) are available to logged-in subscribers. Feel free to explore the catalog.',
    alertNeedLogin: 'Login required. Please log in using the button in the header.',
    alertNeedSub: 'A subscription is required. Please contact us for access.',
    tabProblems: '✍️ Practice by Topic (435+ Problems)',
    tabFiles: '📁 Download by Subject (PDF)',
    byProblemIntro: '435 full competition problems from AMC 8 (1998–2024) classified into 34 standard competition math topics. Expand any topic to solve interactively.',
    searchPlaceholder: 'Search year, problem #, or keywords (e.g. 2024, #5, prime, area, speed)...',
    expandAll: 'Expand All',
    collapseAll: 'Collapse All',
    allDomains: 'All Domains',
    problemCount: (n) => `${n} problem${n === 1 ? '' : 's'}`,
    totalProblemsCount: (n) => `${n} problems in catalog`,
    noProblemsFound: 'No problems match your search filter.',
    problemLabel: (level, year, num) => `${year} AMC ${level} · #${num}`,
    collapse: 'Collapse',
    open: 'Solve / Solution',
    levelAll: 'All Levels',
    level8: 'AMC 8 (435 Problems)',
    level10: 'AMC 10',
    level12: 'AMC 12',
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

const DOMAIN_COLORS = {
  algebra: { bg: 'rgba(59, 130, 246, 0.08)', border: '#3b82f6', text: '#1d4ed8' },
  'number-theory': { bg: 'rgba(245, 158, 11, 0.08)', border: '#f59e0b', text: '#b45309' },
  geometry: { bg: 'rgba(16, 185, 129, 0.08)', border: '#10b981', text: '#047857' },
  'combinatorics-probability': { bg: 'rgba(168, 85, 247, 0.08)', border: '#a855f7', text: '#7e22ce' },
  'statistics-data': { bg: 'rgba(14, 165, 233, 0.08)', border: '#0ea5e9', text: '#0369a1' },
  'logic-word-problems': { bg: 'rgba(236, 72, 153, 0.08)', border: '#ec4899', text: '#be185d' },
  functions: { bg: 'rgba(99, 102, 241, 0.08)', border: '#6366f1', text: '#4338ca' },
  advanced: { bg: 'rgba(249, 115, 22, 0.08)', border: '#f97316', text: '#c2410c' },
  uncategorized: { bg: 'rgba(107, 114, 128, 0.08)', border: '#6b7280', text: '#4b5563' },
};

export default function AmcUnitBrowser() {
  const { language } = useLanguage();
  const words = COPY[language] || COPY.en;
  const { user, status: authStatus } = useAuth();
  const [subStatus, setSubStatus] = useState('loading');
  const [manifest, setManifest] = useState(null);
  const [status, setStatus] = useState('loading');
  const [activeTab, setActiveTab] = useState('problems'); // 'problems' | 'files'

  // Level & Domain Filters
  const [selectedLevel, setSelectedLevel] = useState('8'); // '8' default for AMC 8
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Problem Catalog State (initialized immediately with 435 static AMC 8 questions)
  const [problems, setProblems] = useState(staticAmc8Catalog);
  const [problemsStatus, setProblemsStatus] = useState('ready');

  // UI accordion state
  const [openUnits, setOpenUnits] = useState(() => new Set());
  const [expandedProblemId, setExpandedProblemId] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [openFileUnit, setOpenFileUnit] = useState(null);
  const [generatedVariants, setGeneratedVariants] = useState({});
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [variantOnlyMode, setVariantOnlyMode] = useState(false);
  const [variantSheet, setVariantSheet] = useState([]);
  const [variantSheetQr, setVariantSheetQr] = useState('');

  // Core practice test (multi-unit, count- and difficulty-configurable) state
  const [coreSelectedUnitIds, setCoreSelectedUnitIds] = useState([]);
  const [coreTierCeiling, setCoreTierCeiling] = useState('advanced');
  const [coreCount, setCoreCount] = useState(20);
  const [coreProblems, setCoreProblems] = useState([]);

  // Sync selected unit with URL query parameter
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

  // A deep link with ?variant=1 (used by the curriculum-tab AMC badge) should land directly on a
  // freshly generated, language-matched 20-problem practice worksheet — like a regular Korean
  // curriculum worksheet — NOT the raw archived past AMC exam text, which is kept verbatim in its
  // original English regardless of site language and would otherwise be the first thing a
  // Korean-language visitor sees after clicking through. The sheet is seeded (?sheet=) so the QR
  // code below reproduces the exact same 20 (or fewer, if the generator ran out of unique shapes)
  // problems when scanned.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const u = params.get('unit');
    if (!u || params.get('variant') !== '1') return;
    const found = AMC_FINE_SUBJECTS.flatMap((subject) => subject.units).find((unit) => unit.id === u);
    if (!found) return;
    const seed = (params.get('sheet') || createSheetSeed()).toUpperCase();
    if (params.get('sheet') !== seed) {
      window.history.replaceState({}, '', buildAmcSheetUrl(u, seed));
    }
    setVariantSheet(makeAmcVariantSheet(seed, found, language));
    setVariantOnlyMode(true);
  }, [language]);

  // Regenerate the QR code whenever the active seeded sheet changes.
  useEffect(() => {
    if (typeof window === 'undefined' || !variantOnlyMode || !selectedUnitId) { setVariantSheetQr(''); return; }
    const params = new URLSearchParams(window.location.search);
    const seed = params.get('sheet');
    if (!seed) return;
    QRCode.toDataURL(buildAmcSheetUrl(selectedUnitId, seed), { width: 200, margin: 1, errorCorrectionLevel: 'M', color: { dark: '#1f2733', light: '#fffefb' } }).then(setVariantSheetQr);
  }, [variantOnlyMode, variantSheet, selectedUnitId]);

  // Auth check
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

  // Fetch file manifest
  useEffect(() => {
    let cancelled = false;
    fetch('/api/amc/manifest')
      .then((res) => { if (!res.ok) throw new Error('bad response'); return res.json(); })
      .then((data) => { if (!cancelled) { setManifest(data); setStatus('ready'); } })
      .catch(() => { if (!cancelled) setStatus('error'); });
    return () => { cancelled = true; };
  }, []);

  // Fetch problems from D1 and merge with static catalog
  useEffect(() => {
    let cancelled = false;
    fetch('/api/amc/problems')
      .then((res) => {
        if (!res.ok) throw new Error('bad response');
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        const apiList = data.problems || [];
        if (apiList.length === 0) return;

        // Merge API problems with static catalog using canonical key to prevent duplicate entries
        const getProblemKey = (p) => `${p.level || 8}-${p.year}-${(p.variant || '').toLowerCase()}-${Number(p.problemNumber || p.number || 0)}`;
        const mergedMap = new Map();
        for (const p of staticAmc8Catalog) {
          mergedMap.set(getProblemKey(p), p);
        }
        for (const p of apiList) {
          const key = getProblemKey(p);
          const existing = mergedMap.get(key);
          if (!existing) {
            mergedMap.set(key, p);
          } else {
            const bestChoices = (Array.isArray(p.choices) && p.choices.length >= 5)
              ? p.choices
              : (Array.isArray(existing.choices) && existing.choices.length >= 5 ? existing.choices : (p.choices || existing.choices || []));
            const bestQuestion = (p.question && p.question.trim().length > (existing.question || '').trim().length)
              ? p.question
              : (existing.question || p.question);
            const bestExplanation = (p.explanation && p.explanation.trim().length > (existing.explanation || '').trim().length)
              ? p.explanation
              : (existing.explanation || p.explanation);
            mergedMap.set(key, {
              ...existing,
              ...p,
              id: existing.id || p.id,
              choices: bestChoices,
              question: bestQuestion,
              explanation: bestExplanation,
            });
          }
        }

        const merged = Array.from(mergedMap.values());
        setProblems(merged);
        setProblemsStatus('ready');
      })
      .catch(() => {
        // Static catalog is already loaded as fallback
        if (!cancelled) setProblemsStatus('ready');
      });
    return () => { cancelled = true; };
  }, []);

  // Filtered problems based on Level and Search Query
  const filteredProblems = useMemo(() => {
    if (!problems) return [];
    const q = searchQuery.trim().toLowerCase();
    const cleanQ = q.replace(/^#/, '');

    return problems.filter((p) => {
      // Level filter
      if (selectedLevel !== 'all' && String(p.level) !== selectedLevel) return false;

      // Search query filter
      if (!q) return true;

      const qYearMatch = String(p.year) === q;
      const qNumMatch = String(p.problemNumber) === cleanQ || `${p.problemNumber}번` === q;
      const qTextMatch = (p.question || '').toLowerCase().includes(q);
      const qSubjMatch = (p.subjectId || '').toLowerCase().includes(q);
      const qUnitMatch = (p.unitId || '').toLowerCase().includes(q);

      return qYearMatch || qNumMatch || qTextMatch || qSubjMatch || qUnitMatch;
    });
  }, [problems, selectedLevel, searchQuery]);

  // Group problems by fine unit
  const problemsByFineUnit = useMemo(() => {
    const map = new Map();
    for (const subject of AMC_FINE_SUBJECTS) {
      for (const unit of subject.units) {
        map.set(unit.id, []);
      }
    }
    for (const p of filteredProblems) {
      if (p.unitId && map.has(p.unitId)) {
        map.get(p.unitId).push(p);
      }
    }
    for (const list of map.values()) {
      list.sort((a, b) => (b.year - a.year) || (a.problemNumber - b.problemNumber));
    }
    return map;
  }, [filteredProblems]);

  // Problem counts per subject domain
  const subjectCounts = useMemo(() => {
    const counts = {};
    for (const subject of AMC_FINE_SUBJECTS) {
      let sum = 0;
      for (const unit of subject.units) {
        sum += (problemsByFineUnit.get(unit.id) || []).length;
      }
      counts[subject.id] = sum;
    }
    return counts;
  }, [problemsByFineUnit]);

  // Total active problem count
  const totalFilteredCount = useMemo(() => {
    return filteredProblems.length;
  }, [filteredProblems]);

  // Only an active search query should ever hide a subject/unit for having 0 matching
  // problems — a real-catalog count of 0 from the level filter alone must not, since the
  // per-unit generator works regardless of how many past-exam problems are classified.
  const hasActiveSearch = searchQuery.trim().length > 0;

  // File manifest items by unit
  const itemsByUnit = useMemo(() => {
    const map = new Map(AMC_UNITS.map((unit) => [unit.label, []]));
    if (!manifest) return map;
    for (const level of ['8', '10', '12']) {
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

  // Toggle unit expansion
  function toggleUnit(unitKey) {
    setOpenUnits((prev) => {
      const next = new Set(prev);
      if (next.has(unitKey)) next.delete(unitKey);
      else next.add(unitKey);
      return next;
    });
  }

  function handleExpandAll() {
    const allKeys = new Set();
    for (const subject of AMC_FINE_SUBJECTS) {
      for (const unit of subject.units) {
        allKeys.add(`${subject.id}-${unit.id}`);
      }
    }
    setOpenUnits(allKeys);
  }

  function handleCollapseAll() {
    setOpenUnits(new Set());
  }

  function handleItemClick(event) {
    if (entitled) return;
    event.preventDefault();
    if (authStatus !== 'ready' || subStatus === 'loading') return;
    window.alert(!user ? words.alertNeedLogin : words.alertNeedSub);
  }

  function handleProblemClick(problem) {
    if (!entitled) {
      if (authStatus !== 'ready' || subStatus === 'loading') return;
      window.alert(!user ? words.alertNeedLogin : words.alertNeedSub);
      return;
    }
    setExpandedProblemId((current) => (current === problem.id ? null : problem.id));
  }

  function handleGenerateVariant(openKey, unit) {
    const variant = generateAmcVariantProblem(unit, language);
    setGeneratedVariants((prev) => ({ ...prev, [openKey]: variant }));
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

  function generateCoreTest() {
    const eligibleUnits = AMC_FINE_SUBJECTS
      .flatMap((subject) => subject.units)
      .filter((unit) => coreSelectedUnitIds.includes(unit.id) && tierWithin(unit.tier, coreTierCeiling));
    if (!eligibleUnits.length) { setCoreProblems([]); return; }
    const pool = [];
    let index = 0;
    while (pool.length < coreCount) {
      const unit = eligibleUnits[index % eligibleUnits.length];
      index += 1;
      pool.push(generateAmcVariantProblem(unit, language));
    }
    setCoreProblems(shuffleArray(pool));
  }

  function handleOpenWorksheet(unitId) {
    setSelectedUnitId(unitId);
    setVariantOnlyMode(false);
    setVariantSheet([]);
    setVariantSheetQr('');
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('unit', unitId);
      window.history.pushState({}, '', url.toString());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function handleBackToCatalog() {
    setSelectedUnitId(null);
    setVariantOnlyMode(false);
    setVariantSheet([]);
    setVariantSheetQr('');
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('unit');
      window.history.pushState({}, '', url.toString());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  const activeSubjectAndUnit = useMemo(() => {
    if (!selectedUnitId) return null;
    for (const subject of AMC_FINE_SUBJECTS) {
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
    const unitProblems = problemsByFineUnit.get(unit.id) || [];
    return (
      <div style={{ maxWidth: 1040, margin: '0 auto', padding: '10px 0 60px' }}>
        <TopicWorksheetView
          category="amc"
          subjectLabel={language === 'en' ? subject.labelEn : subject.label}
          unit={unit}
          problems={variantOnlyMode ? variantSheet : unitProblems}
          onBack={handleBackToCatalog}
          language={language}
          onGenerateVariant={() => handleGenerateVariant(unit.id, unit)}
          variantProblem={variantOnlyMode ? null : generatedVariants[unit.id]}
          sheetQrDataUrl={variantOnlyMode ? variantSheetQr : ''}
          onCloseVariant={() => handleCloseVariant(unit.id)}
          hideArchive={variantOnlyMode}
          onShowArchive={() => setVariantOnlyMode(false)}
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1040, margin: '0 auto', paddingBottom: 60 }}>
      {/* Breadcrumb */}
      <p className="no-print" style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 6 }}>
        <a href="/">{words.home}</a> / <a href="/amc.html">{words.hub}</a> / {words.title}
      </p>

      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
        <div>
          <h1 className="font-display" style={{ fontSize: 26, margin: '0 0 6px' }}>{words.title}</h1>
          <p style={{ color: 'var(--ink-soft)', margin: 0, fontSize: 14 }}>{words.subtitle}</p>
        </div>
        <a href="/amc" className="button button-secondary" style={{ textDecoration: 'none', whiteSpace: 'nowrap' }}>
          {words.byYear} →
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
          {words.tabProblems} <span style={{ fontSize: 12, fontWeight: 500, opacity: 0.85 }}>({totalFilteredCount})</span>
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

      {/* ======================================================== */}
      {/* VIEW 1: FINE-GRAINED PROBLEM BROWSER (PRIMARY)           */}
      {/* ======================================================== */}
      {activeTab === 'problems' && (
        <div>
          {/* Level Switcher */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)', marginRight: 4 }}>레벨:</span>
            {[
              { id: '8', label: words.level8 },
              { id: '10', label: words.level10 },
              { id: '12', label: words.level12 },
              { id: 'all', label: words.levelAll },
            ].map((lvl) => {
              const active = selectedLevel === lvl.id;
              return (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setSelectedLevel(lvl.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 20,
                    fontSize: 13,
                    fontWeight: active ? 700 : 500,
                    border: active ? '1.5px solid var(--primary, #2563eb)' : '1px solid var(--paper-line, #d1d5db)',
                    background: active ? 'var(--primary, #2563eb)' : 'var(--card-bg, #ffffff)',
                    color: active ? '#ffffff' : 'var(--ink, #111827)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {lvl.label}
                </button>
              );
            })}
          </div>

          {/* Domain Filter Pills */}
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
              {words.allDomains} ({totalFilteredCount})
            </button>
            {AMC_FINE_SUBJECTS.filter((s) => s.id !== 'uncategorized').map((subject) => {
              const active = selectedSubject === subject.id;
              const count = subjectCounts[subject.id] || 0;
              const styleMeta = DOMAIN_COLORS[subject.id] || DOMAIN_COLORS.algebra;
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
                  {language === 'en' ? subject.labelEn : subject.label} ({count})
                </button>
              );
            })}
          </div>

          {/* Search & Expand Toolbar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ flex: '1 1 300px', position: 'relative' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={words.searchPlaceholder}
                style={{
                  width: '100%',
                  padding: '9px 34px 9px 12px',
                  borderRadius: 8,
                  border: '1px solid var(--paper-line, #d1d5db)',
                  background: 'var(--card-bg, #ffffff)',
                  fontSize: 13,
                  color: 'var(--ink, #111827)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    fontSize: 14,
                    color: 'var(--ink-soft)',
                    cursor: 'pointer',
                  }}
                >
                  ✕
                </button>
              ) : null}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                onClick={handleExpandAll}
                className="button button-secondary"
                style={{ padding: '6px 12px', fontSize: 12, cursor: 'pointer' }}
              >
                {words.expandAll}
              </button>
              <button
                type="button"
                onClick={handleCollapseAll}
                className="button button-secondary"
                style={{ padding: '6px 12px', fontSize: 12, cursor: 'pointer' }}
              >
                {words.collapseAll}
              </button>
            </div>
          </div>

          {/* Problem List */}
          {problemsStatus === 'loading' ? <p style={{ color: 'var(--ink-soft)' }}>{words.loading}</p> : null}

          {/* A real-catalog problem count of 0 only means no PAST EXAM problems have been
              classified yet for the selected level (currently true for every AMC 10/12 unit,
              since only AMC 8 has been classified) — it does NOT mean the topic itself is
              unavailable, since every unit's "유사 문제 생성" generator works independent of the
              real catalog. So only the search box hides subjects/units on a 0 count; the level
              filter alone must never hide a topic the generator can still serve. */}
          {hasActiveSearch && totalFilteredCount === 0 ? (
            <div style={{ padding: '36px 20px', textAlign: 'center', background: 'var(--card-bg)', border: '1px solid var(--paper-line)', borderRadius: 12 }}>
              <p style={{ color: 'var(--ink-soft)', margin: 0, fontSize: 14 }}>{words.noProblemsFound}</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 24 }}>
              {AMC_FINE_SUBJECTS.filter((subject) => {
                if (subject.id === 'uncategorized') return false;
                if (selectedSubject !== 'all' && selectedSubject !== subject.id) return false;
                if (hasActiveSearch) return (subjectCounts[subject.id] || 0) > 0;
                return true;
              }).map((subject) => {
                const totalInSubject = subjectCounts[subject.id] || 0;
                const domainStyle = DOMAIN_COLORS[subject.id] || DOMAIN_COLORS.algebra;

                return (
                  <section key={subject.id} style={{ background: 'var(--card-bg, #ffffff)', border: '1px solid var(--paper-line, #e5e7eb)', borderRadius: 14, padding: '20px 22px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                    {/* Subject Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--paper-line, #e5e7eb)', paddingBottom: 12, marginBottom: 14 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ width: 10, height: 10, borderRadius: '50%', background: domainStyle.border }}></span>
                          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: 'var(--ink, #111827)' }}>
                            {language === 'en' ? subject.labelEn : subject.label}
                          </h2>
                          <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 10, background: domainStyle.bg, color: domainStyle.text, fontWeight: 600 }}>
                            {words.problemCount(totalInSubject)}
                          </span>
                        </div>
                        <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--ink-soft)' }}>
                          {subject.description}
                        </p>
                      </div>
                    </div>

                    {/* Fine Unit Cards */}
                    <div style={{ display: 'grid', gap: 12 }}>
                      {subject.units.map((unit) => {
                        const list = problemsByFineUnit.get(unit.id) || [];
                        if (hasActiveSearch && list.length === 0) return null;

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
                              <span style={{ display: 'block', fontSize: 13, color: 'var(--ink-soft)', marginTop: 4 }}>
                                {unit.desc}
                              </span>

                              {/* Curriculum Mapping Badges (Volume 1, Volume 2, International Math, Domains) */}
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8, alignItems: 'center' }}>
                                {unit.vol1Chapter && (
                                  <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 6, background: 'rgba(217, 119, 6, 0.12)', color: '#b45309', border: '1px solid rgba(217, 119, 6, 0.25)' }}>
                                    📙 Vol 1: {unit.vol1Chapter}
                                  </span>
                                )}
                                {unit.vol2Chapter && (
                                  <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 6, background: 'rgba(147, 51, 234, 0.12)', color: '#7e22ce', border: '1px solid rgba(147, 51, 234, 0.25)' }}>
                                    📘 Vol 2: {unit.vol2Chapter}
                                  </span>
                                )}
                                {unit.intlCourse && (
                                  <a
                                    href={unit.intlCourse.href}
                                    style={{ textDecoration: 'none', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 6, background: 'rgba(37, 99, 235, 0.08)', color: '#1d4ed8', border: '1px solid rgba(37, 99, 235, 0.2)' }}
                                    title="국제학교 과정 커리큘럼 보기"
                                  >
                                    🌐 국제학교: {language === 'ko' ? unit.intlCourse.labelKo : unit.intlCourse.label} ↗
                                  </a>
                                )}
                                {unit.domain && (
                                  <a
                                    href={unit.domain.href}
                                    style={{ textDecoration: 'none', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 6, background: 'rgba(16, 185, 129, 0.08)', color: '#047857', border: '1px solid rgba(16, 185, 129, 0.2)' }}
                                    title="수학 영역별 커리큘럼 보기"
                                  >
                                    📐 영역: {language === 'ko' ? unit.domain.labelKo : unit.domain.label} ↗
                                  </a>
                                )}
                              </div>
                            </div>

                            {/* Action Buttons: Open Worksheet View & Generate Variant */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                              {list.length > 0 && (
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
                              )}

                              <button
                                type="button"
                                onClick={() => {
                                  handleGenerateVariant(unit.id, unit);
                                  handleOpenWorksheet(unit.id);
                                }}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 4,
                                  padding: list.length > 0 ? '8px 12px' : '9px 18px',
                                  borderRadius: 8,
                                  fontSize: list.length > 0 ? 12 : 13,
                                  fontWeight: list.length > 0 ? 600 : 700,
                                  background: list.length > 0 ? 'rgba(79, 70, 229, 0.08)' : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                                  color: list.length > 0 ? '#4338ca' : '#ffffff',
                                  border: list.length > 0 ? '1px solid rgba(79, 70, 229, 0.2)' : 'none',
                                  cursor: 'pointer',
                                  boxShadow: list.length > 0 ? 'none' : '0 2px 6px rgba(79, 70, 229, 0.25)',
                                }}
                              >
                                <span>✨</span>
                                <span>
                                  {list.length > 0
                                    ? (language === 'ko' ? '유사 문제' : 'Variant')
                                    : (language === 'ko'
                                      ? `이 레벨은 기출문제 준비 중 · 유사 문제로 학습하기 →`
                                      : `No archived problems for this level yet — practice with generated variants →`)}
                                </span>
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
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 3: CORE PRACTICE TEST (multi-unit, count- & difficulty-configurable) */}
      {/* ======================================================== */}
      {activeTab === 'core' && (
        coreProblems.length > 0 ? (
          <div>
            <button type="button" className="button button-secondary" style={{ marginBottom: 12 }} onClick={() => setCoreProblems([])}>
              ← {language === 'ko' ? '단원 선택으로 돌아가기' : 'Back to unit selection'}
            </button>
            <TopicWorksheetView
              category="amc"
              subjectLabel={language === 'ko' ? `${coreSelectedUnitIds.length}개 단원 선택` : `${coreSelectedUnitIds.length} units selected`}
              unit={{
                label: '종합 테스트',
                labelEn: 'Core Practice Test',
                desc: language === 'ko'
                  ? `${coreProblems.length}문항 · 난이도 ${TIER_LABELS[coreTierCeiling].ko}까지`
                  : `${coreProblems.length} problems · up to ${TIER_LABELS[coreTierCeiling].en}`,
              }}
              problems={coreProblems}
              onBack={() => setCoreProblems([])}
              language={language}
            />
          </div>
        ) : (
          <div>
            <p style={{ color: 'var(--ink-soft)', fontSize: 14, margin: '0 0 16px' }}>
              {language === 'ko'
                ? '기말고사·MAP 시험 범위에 맞춰 여러 단원을 한 번에 선택하고, 문제 수와 난이도 상한을 지정해 종합 테스트를 만드세요.'
                : 'Select every unit covered by your final or MAP test scope, then set a problem count and a difficulty ceiling to build one combined test.'}
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
              {AMC_FINE_SUBJECTS.filter((subject) => subject.id !== 'uncategorized').map((subject) => {
                const idsInSubject = subject.units.map((unit) => unit.id);
                const allSelected = idsInSubject.every((id) => coreSelectedUnitIds.includes(id));
                return (
                  <div key={subject.id} style={{ border: '1px solid var(--paper-line, #e5e7eb)', borderRadius: 12, padding: '14px 16px', background: 'var(--card-bg, #fff)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <strong style={{ fontSize: 14 }}>{language === 'en' ? subject.labelEn : subject.label}</strong>
                      <button type="button" onClick={() => toggleCoreSubject(subject)} style={{ background: 'none', border: 'none', color: 'var(--primary, #2563eb)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                        {allSelected ? (language === 'ko' ? '전체 해제' : 'Deselect all') : (language === 'ko' ? '전체 선택' : 'Select all')}
                      </button>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {subject.units.map((unit) => {
                        const outOfRange = !tierWithin(unit.tier, coreTierCeiling);
                        return (
                          <label key={unit.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, border: '1px solid var(--paper-line, #d1d5db)', borderRadius: 7, padding: '5px 9px', fontSize: 12.5, cursor: 'pointer', background: '#fff', opacity: outOfRange ? 0.45 : 1 }}>
                            <input type="checkbox" checked={coreSelectedUnitIds.includes(unit.id)} onChange={() => toggleCoreUnit(unit.id)} style={{ margin: 0 }} />
                            <span>{language === 'en' ? unit.labelEn : unit.label}</span>
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

      {/* ======================================================== */}
      {/* VIEW 2: FILE-BASED ARCHIVE VIEW                          */}
      {/* ======================================================== */}
      {activeTab === 'files' && (
        <div>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, margin: '0 0 16px' }}>{words.untagged}</p>
          {status === 'loading' ? <p style={{ color: 'var(--ink-soft)' }}>{words.loading}</p> : null}
          {status === 'error' ? <p style={{ color: 'var(--red-pen)' }}>{words.error}</p> : null}

          {status === 'ready' && (
            <div style={{ display: 'grid', gap: 10 }}>
              {AMC_UNITS.map((unit) => {
                const items = itemsByUnit.get(unit.label) || [];
                const open = openFileUnit === unit.id;
                return (
                  <div
                    key={unit.id}
                    style={{
                      background: 'var(--card-bg)',
                      border: '1px solid var(--paper-line)',
                      borderRadius: 'var(--radius)',
                      boxShadow: 'var(--shadow)',
                      overflow: 'hidden',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFileUnit(open ? null : unit.id)}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        padding: '16px 20px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        font: 'inherit',
                      }}
                    >
                      <span>
                        <span style={{ fontSize: 17, fontWeight: 700, color: 'var(--ink)' }}>{unit.label}</span>
                        <span style={{ display: 'block', fontSize: 13, color: 'var(--ink-soft)', marginTop: 2 }}>{unit.description}</span>
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--ink-soft)', whiteSpace: 'nowrap' }}>
                        {words.fileCount(items.length)} {open ? '▲' : '▼'}
                      </span>
                    </button>
                    {open && (
                      <div style={{ padding: '0 20px 16px', display: 'grid', gap: 8 }}>
                        {items.length === 0 ? (
                          <p style={{ color: 'var(--ink-soft)', fontSize: 14, margin: 0 }}>{words.empty}</p>
                        ) : (
                          items.map(({ level, year, variant, fileType, file }) => (
                            <a
                              key={`${level}-${year}-${variant.id}-${fileType}`}
                              href={`/amc/${level}?year=${year}&variant=${variant.id}`}
                              onClick={handleItemClick}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '10px 14px',
                                background: 'var(--paper)',
                                borderRadius: 8,
                                textDecoration: 'none',
                                color: 'var(--ink)',
                              }}
                            >
                              <span>{!entitled || file.meta?.accessTier === 'premium' ? '🔒 ' : ''}{year} AMC {level}{variant.id !== 'AMC8' ? variant.id : ''} · {variant.label}</span>
                              <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{fileTypeLabel(fileType, language)} →</span>
                            </a>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
