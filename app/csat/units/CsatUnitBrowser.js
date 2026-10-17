'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../auth';
import { useLanguage } from '../../language';
import { CSAT_SUBJECTS, csatUnitTagLabel, COMMON_MATH_SUBJECTS, commonMathUnitTagLabel } from '../../examUnits';
import TopicWorksheetView from '../../components/TopicWorksheetView';
import staticCsatCatalog from '../../data/csatProblemCatalog.json';
import csat2025Catalog from '../../data/csat2025ProblemCatalog.json';
import csatCommonMathCatalog from '../../data/csatCommonMathProblemCatalog.json';
import csatCalculus1Catalog from '../../data/csatCalculus1BasicCatalog.json';
import csatMath2ImportantCatalog from '../../data/csatMath2ImportantCatalog.json';
import csatProbStatsImportantCatalog from '../../data/csatProbStatsImportantCatalog.json';
import csatCalculus2ImportantCatalog from '../../data/csatCalculus2ImportantCatalog.json';
import csatGrade1NationalMockCatalog from '../../data/csatGrade1NationalMockCatalog.json';
import csatJeongseokCatalog from '../../data/csatJeongseokCalculusCatalog.json';
import csatSilryeokIntegralStatsCatalog from '../../data/csatSilryeokIntegralStatsCatalog.json';
import csatSilryeokGeoVectorsCatalog from '../../data/csatSilryeokGeoVectorsCatalog.json';
import csatJeongseokCalc2Catalog from '../../data/csatJeongseokCalc2Catalog.json';
import csatSilryeokMath1Catalog from '../../data/csatSilryeokMath1Catalog.json';
import csatSilryeokMath2Catalog from '../../data/csatSilryeokMath2Catalog.json';
import csatJjangeasyGeoCatalog from '../../data/csatJjangeasyGeoCatalog.json';
import { csatMarpleCalc1Catalog, fetchMarpleSimilarProblem, MARPLE_CALC1_ID_PREFIX } from '../marpleCalc1Catalog';
import { enrichProblemsListWithRates } from '../../utils/csatRates';
import { generateCommonMathVariant } from '../commonMathProblemGenerator';
import { generateCalculus1Variant } from '../calculus1ProblemGenerator';
import { generateMath2ImportantVariant } from '../math2ImportantProblemGenerator';
import { generateProbStatsImportantVariant } from '../probStatsImportantProblemGenerator';
import { generateCalculus2ImportantVariant } from '../calculus2ImportantProblemGenerator';
import { generateVariationForGrade1Mock } from '../grade1NationalMockGenerator';
import { generateJeongseokCalculusVariant } from '../jeongseokCalculusProblemGenerator';
import { generateSilryeokIntegralStatsVariant } from '../silryeokIntegralStatsProblemGenerator';
import { generateSilryeokGeoVariant } from '../silryeokGeoVectorsProblemGenerator';
import { generateJeongseokCalc2Variant } from '../jeongseokCalc2ProblemGenerator';
import { generateSilryeokMath1Variant } from '../silryeokMath1ProblemGenerator';
import { generateSilryeokMath2Variant } from '../silryeokMath2ProblemGenerator';
import { generateJjangeasyGeoVariant } from '../jjangeasyGeoProblemGenerator';
import { generateCsatSimilarProblem } from '../csatForecastEngine';
import {
  ALL_DETAILED_TYPES,
  getDetailedTypesByUnitId,
  getMiddleUnitsGrouped,
  matchProblemToDetailedType,
} from '../csatTaxonomyHelper';

const combinedStaticCatalog = [
  ...csat2025Catalog,
  ...staticCsatCatalog,
  ...csatCommonMathCatalog,
  ...csatCalculus1Catalog,
  ...csatMath2ImportantCatalog,
  ...csatProbStatsImportantCatalog,
  ...csatCalculus2ImportantCatalog,
  ...csatGrade1NationalMockCatalog,
  ...csatJeongseokCatalog,
  ...csatSilryeokIntegralStatsCatalog,
  ...csatSilryeokGeoVectorsCatalog,
  ...csatJeongseokCalc2Catalog,
  ...csatSilryeokMath1Catalog,
  ...csatSilryeokMath2Catalog,
  ...csatJjangeasyGeoCatalog,
  ...csatMarpleCalc1Catalog,
];

const COPY = {
  ko: {
    home: '홈',
    hub: '수능 기출문제',
    title: '단원별·세부유형별 수능 기출 분석 및 실전 문제풀이',
    subtitle: '수능 수학(수학Ⅰ·수학Ⅱ·확률과 통계·미적분·기하 및 공통수학)을 72대 세부 유형 트리로 세분화하여, 5개년 역대 출제 통계, 이번 연도 출제 예상, 핵심 발상과 함정 포인트를 분석하고 실시간 학습지 및 알고리즘 변형 문제를 무한 생성합니다.',
    tabDetailedTypes: '📚 세부 단원 & 72대 세부유형별 분석·풀기',
    tabForecastSummary: '📊 5개년 출제 통계 & 이번 연도 출제 예상 총괄표',
    tabFiles: '📁 대단원별 파일 다운로드 (PDF)',
    tabCore: '🎯 맞춤 종합 테스트 만들기',
    allSubjects: '전체 과목',
    problemCount: (n) => `${n}문항`,
    totalProblemsCount: (n) => `총 ${n}문항 등록됨`,
    searchPlaceholder: '단원명, 세부유형, 핵심발상(예: 지수함수 그래프, 삼차함수 극값, 귀납적 정의, 조건부확률, 치환적분)...',
    loading: '자료를 불러오는 중입니다...',
    error: '자료를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.',
    empty: '아직 이 세부유형으로 등록된 문항이 없습니다.',
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
    title: 'CSAT Archive by Sub-Unit & 72 Detailed Types',
    subtitle: 'Explore CSAT math categorized into 72 granular problem types, complete with 5-year trend statistics, 2026/2027 forecast, core ideas, traps, and infinite algorithmic problem generation.',
    tabDetailedTypes: '📚 Granular Units & 72 Detailed Types',
    tabForecastSummary: '📊 5-Year Statistics & Exam Forecast Table',
    tabFiles: '📁 Download by Subject (PDF)',
    tabCore: '🎯 Core Practice Test',
    allSubjects: 'All Subjects',
    problemCount: (n) => `${n} problem${n === 1 ? '' : 's'}`,
    totalProblemsCount: (n) => `${n} problems in catalog`,
    searchPlaceholder: 'Search unit, detailed types, core ideas (e.g. exponential graph, cubic extrema, induction, conditional prob)...',
    loading: 'Loading archive...',
    error: 'Could not load the archive. Please try again shortly.',
    empty: 'No problems in this detailed type yet.',
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
  'common-math-1': { bg: 'rgba(20, 184, 166, 0.08)', border: '#14b8a6', text: '#0f766e' },
  'common-math-2': { bg: 'rgba(99, 102, 241, 0.08)', border: '#6366f1', text: '#4338ca' },
};

const ALL_SUBJECT_GROUPS = [...CSAT_SUBJECTS, ...COMMON_MATH_SUBJECTS];

export default function CsatUnitBrowser() {
  const { language } = useLanguage();
  const words = COPY[language] || COPY.en;
  const { user, status: authStatus } = useAuth();
  const [subStatus, setSubStatus] = useState('loading');
  const [manifest, setManifest] = useState(null);
  const [status, setStatus] = useState('loading');
  const [activeTab, setActiveTab] = useState('detailed'); // 'detailed' | 'forecast' | 'core' | 'files'
  const [problems, setProblems] = useState(() => enrichProblemsListWithRates(combinedStaticCatalog));
  const [variantProblem, setVariantProblem] = useState(null);

  const [selectedSubject, setSelectedSubject] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFileUnit, setOpenFileUnit] = useState(null);
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [selectedTypeId, setSelectedTypeId] = useState(null);
  const [expandedUnits, setExpandedUnits] = useState(() => {
    // 기본적으로 첫 몇 개 대단원은 펼쳐둔다
    return { 'exp-log': true, 'trig': true, 'sequences': true, 'limits-continuity': true };
  });

  // Core practice test state
  const [coreSelectedUnitIds, setCoreSelectedUnitIds] = useState([]);
  const [coreTierCeiling, setCoreTierCeiling] = useState('advanced');
  const [coreCount, setCoreCount] = useState(20);
  const [coreProblems, setCoreProblems] = useState(null);

  function toggleUnitExpand(unitId) {
    setExpandedUnits((prev) => ({ ...prev, [unitId]: !prev[unitId] }));
  }

  function handleGenerateVariant(unitId, candidateProblem = null) {
    const candidate = candidateProblem || problems.find((p) => p.unitId === unitId) || { unitId };
    let generated;
    if (candidate?.id?.startsWith(MARPLE_CALC1_ID_PREFIX)) {
      // 마플 수능기출 미적분Ⅰ: similar problems are generated server-side for subscribers
      fetchMarpleSimilarProblem(candidate).then(setVariantProblem).catch((err) => {
        if (typeof window === 'undefined') return;
        if (err.message === 'login_required') window.alert(COPY[language]?.alertNeedLogin || COPY.ko.alertNeedLogin);
        else if (err.message === 'subscription_required') window.alert(COPY[language]?.alertNeedSub || COPY.ko.alertNeedSub);
        else window.alert('유사문제를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
      });
      return;
    }
    if (candidate?.id?.startsWith('mock-g1-')) {
      generated = generateVariationForGrade1Mock(candidate);
    } else if (candidate?.id?.startsWith('jjangimportant-calc2-') || (candidate?.subUnitId && [
      'exponential-functions', 'logarithmic-functions', 'exponential-equations',
      'logarithmic-equations', 'exp-log-applications', 'trig-definition',
      'trig-graphs', 'trig-addition-formulas', 'trig-synthesis', 'trig-equations',
      'exp-log-limits', 'trig-limits', 'trig-limit-geometry', 'derivative-rules',
      'tangent-lines', 'extrema-optimization', 'curve-sketching-equations',
      'substitution-by-parts', 'riemann-sum-integrals', 'area-between-curves', 'volume-of-solids'
    ].includes(candidate.subUnitId))) {
      generated = generateCalculus2ImportantVariant(candidate);
    } else if (candidate?.id?.startsWith('jjangimportant-probstats-') || (candidate?.subUnitId && [
      'permutations', 'circular-permutations', 'grid-paths', 'combinations',
      'duplicate-combinations', 'partitions', 'binomial-theorem', 'probability-addition',
      'mathematical-probability', 'conditional-probability', 'independent-trials',
      'discrete-random-var', 'binomial-dist', 'continuous-random-var', 'normal-dist',
      'sample-mean-dist', 'confidence-interval', 'population-proportion'
    ].includes(candidate.subUnitId))) {
      generated = generateProbStatsImportantVariant(candidate);
    } else if (candidate?.id?.startsWith('jjangimportant-math2-') || (candidate?.subUnitId && [
      'set-operations', 'set-cardinality', 'propositions-truth-sets',
      'conditions-logic', 'inequalities-proof', 'composite-functions',
      'inverse-functions', 'rational-functions', 'radical-functions',
      'arithmetic-sequences', 'geometric-sequences', 'sequence-means',
      'sigma-sum', 'various-sequences', 'inductive-definition',
      'exponents-logs', 'exponents-logs-application'
    ].includes(candidate.subUnitId))) {
      generated = generateMath2ImportantVariant(candidate);
    } else if (unitId && (unitId.startsWith('polynomial') || unitId.startsWith('equation') || unitId.startsWith('coordinate') || unitId.startsWith('set') || unitId.startsWith('function') || unitId.startsWith('common-math'))) {
      generated = generateCommonMathVariant(candidate);
    } else if (candidate?.id?.startsWith('jeongseok-calc-')) {
      generated = generateJeongseokCalculusVariant(candidate);
    } else if (candidate?.id?.startsWith('jeongseok-calc2-')) {
      generated = generateJeongseokCalc2Variant(candidate);
    } else if (candidate?.id?.startsWith('silryeok-intstat-')) {
      generated = generateSilryeokIntegralStatsVariant(candidate);
    } else if (candidate?.id?.startsWith('silryeok-geo-')) {
      generated = generateSilryeokGeoVariant(candidate);
    } else if (candidate?.id?.startsWith('silryeok-math1-')) {
      generated = generateSilryeokMath1Variant(candidate);
    } else if (candidate?.id?.startsWith('silryeok-math2-')) {
      generated = generateSilryeokMath2Variant(candidate);
    } else if (candidate?.id?.startsWith('jjangeasy-geo-')) {
      generated = generateJjangeasyGeoVariant(candidate);
    } else if (unitId && (unitId === 'sequence-limits' || unitId === 'limits-continuity' || unitId === 'differentiation' || unitId === 'integration' || candidate?.id?.startsWith('jjangeasy-calc-'))) {
      generated = generateCalculus1Variant(candidate);
    } else {
      let subjId = candidate.subjectId;
      if (!subjId) {
        for (const s of ALL_SUBJECT_GROUPS) {
          if (s.units.some((u) => u.id === unitId)) {
            subjId = s.id;
            break;
          }
        }
      }
      generated = generateCsatSimilarProblem(candidate, { subjectId: subjId });
    }
    setVariantProblem(generated);
  }

  // URL query sync
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const u = params.get('unit');
    const t = params.get('type');
    if (u) setSelectedUnitId(u);
    if (t) setSelectedTypeId(t);

    const handlePopState = () => {
      const p = new URLSearchParams(window.location.search);
      setSelectedUnitId(p.get('unit'));
      setSelectedTypeId(p.get('type'));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  function handleOpenWorksheet(unitId, typeId = null) {
    setSelectedUnitId(unitId);
    setSelectedTypeId(typeId);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('unit', unitId);
      if (typeId) url.searchParams.set('type', typeId);
      else url.searchParams.delete('type');
      window.history.pushState({}, '', url.toString());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function handleBackToCatalog() {
    setSelectedUnitId(null);
    setSelectedTypeId(null);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('unit');
      url.searchParams.delete('type');
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

  const TEMPORARY_OPEN_ACCESS = true;
  const entitled = TEMPORARY_OPEN_ACCESS || (authStatus === 'ready' && !!user && subStatus === 'active');

  // Fetch file manifest
  useEffect(() => {
    let cancelled = false;
    fetch('/api/csat/manifest')
      .then((res) => { if (!res.ok) throw new Error('bad response'); return res.json(); })
      .then((data) => { if (!cancelled) { setManifest(data); setStatus('ready'); } })
      .catch(() => { if (!cancelled) setStatus('error'); });
    return () => { cancelled = true; };
  }, []);

  // Fetch classified problems from D1 and merge with static catalog
  useEffect(() => {
    let cancelled = false;
    fetch('/api/csat/problems')
      .then((res) => (res.ok ? res.json() : []))
      .then((d1Problems) => {
        if (cancelled || !Array.isArray(d1Problems) || d1Problems.length === 0) return;
        setProblems((prev) => {
          const staticIds = new Set(prev.map((p) => p.id));
          const additions = [];
          for (const item of d1Problems) {
            if (!item?.id || staticIds.has(item.id)) continue;
            let finalSubjectId = item.subjectId;
            if (!finalSubjectId) {
              for (const subject of CSAT_SUBJECTS) {
                if (subject.units.some((u) => u.id === item.unitId)) {
                  finalSubjectId = subject.id;
                  break;
                }
              }
            }
            additions.push({
              id: item.id,
              year: item.year,
              examType: item.examType,
              subjectId: finalSubjectId,
              unitId: item.unitId,
              subUnitId: item.subUnitId || item.chapter,
              number: item.number,
              points: item.points,
              question: item.question,
              choices: item.choices || [],
              answer: item.answer,
              explanation: item.explanation,
              type: item.type || (Array.isArray(item.choices) && item.choices.length > 0 ? 'multiple_choice' : 'short_answer'),
              sourceLabel: item.sourceLabel || `${item.year || ''} ${EXAM_TYPE_LABELS[item.examType] || ''} ${item.number ? item.number + '번' : ''}`.trim(),
            });
          }
          return enrichProblemsListWithRates([...prev, ...additions]);
        });
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // Map problems by unitId
  const problemsByUnit = useMemo(() => {
    const map = new Map();
    for (const p of problems) {
      if (!p.unitId) continue;
      if (!map.has(p.unitId)) map.set(p.unitId, []);
      map.get(p.unitId).push(p);
    }
    return map;
  }, [problems]);

  // Group problems by Detailed Type ID within each unit
  const problemsByDetailedType = useMemo(() => {
    const map = new Map();
    ALL_DETAILED_TYPES.forEach((dt) => map.set(dt.typeId, []));

    for (const p of problems) {
      const unitDts = getDetailedTypesByUnitId(p.unitId);
      if (unitDts.length > 0) {
        const matched = matchProblemToDetailedType(p, unitDts);
        if (matched) {
          if (!map.has(matched.typeId)) map.set(matched.typeId, []);
          map.get(matched.typeId).push(p);
        }
      }
    }
    return map;
  }, [problems]);

  // Subject totals count
  const subjectCounts = useMemo(() => {
    const counts = {};
    for (const subject of ALL_SUBJECT_GROUPS) {
      let sum = 0;
      for (const unit of subject.units) {
        sum += (problemsByUnit.get(unit.id) || []).length;
      }
      counts[subject.id] = sum;
    }
    return counts;
  }, [problemsByUnit]);

  // Manifest items by tag
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
    const matching = problems.filter((problem) => eligibleUnitIds.has(problem.unitId));
    setCoreProblems(shuffleArray(matching).slice(0, coreCount));
  }

  function handleItemClick(event) {
    if (TEMPORARY_OPEN_ACCESS || entitled) return;
    event.preventDefault();
    if (authStatus !== 'ready' || subStatus === 'loading') return;
    window.alert(!user ? words.alertNeedLogin : words.alertNeedSub);
  }

  // Active Subject & Unit when worksheet is open
  const activeSubjectAndUnit = useMemo(() => {
    if (!selectedUnitId) return null;
    for (const subject of ALL_SUBJECT_GROUPS) {
      for (const unit of subject.units) {
        if (unit.id === selectedUnitId) {
          const detailedType = selectedTypeId ? ALL_DETAILED_TYPES.find((t) => t.typeId === selectedTypeId) : null;
          return { subject, unit, detailedType };
        }
      }
    }
    return null;
  }, [selectedUnitId, selectedTypeId]);

  // VIEW: Individual Worksheet View
  if (activeSubjectAndUnit) {
    const { subject, unit, detailedType } = activeSubjectAndUnit;
    let targetProblems = problemsByUnit.get(unit.id) || [];
    if (detailedType) {
      targetProblems = problemsByDetailedType.get(detailedType.typeId) || [];
      if (targetProblems.length === 0) {
        // Fallback to unit problems if zero matched
        targetProblems = problemsByUnit.get(unit.id) || [];
      }
    }

    return (
      <div style={{ maxWidth: 1040, margin: '0 auto', padding: '10px 0 60px' }}>
        {/* Detailed Type / Unit Briefing Header Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          color: '#ffffff',
          borderRadius: 14,
          padding: '22px 26px',
          marginBottom: 20,
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
            <button
              type="button"
              onClick={handleBackToCatalog}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#ffffff',
                borderRadius: 8,
                padding: '6px 14px',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ← {language === 'ko' ? '세부 유형 목록으로 돌아가기' : 'Back to Unit Tree'}
            </button>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20, background: 'rgba(59, 130, 246, 0.3)', color: '#93c5fd', fontWeight: 700, border: '1px solid rgba(147, 197, 253, 0.4)' }}>
                {subject.label} · {unit.label}
              </span>
              {detailedType && (
                <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20, background: 'rgba(16, 185, 129, 0.3)', color: '#6ee7b7', fontWeight: 700, border: '1px solid rgba(110, 231, 183, 0.4)' }}>
                  세부유형: {detailedType.middleUnit} &gt; {detailedType.detailedType}
                </span>
              )}
            </div>
          </div>

          <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 10px', letterSpacing: '-0.02em' }}>
            {detailedType ? detailedType.detailedType : unit.label}
            <span style={{ fontSize: 16, fontWeight: 500, color: '#94a3b8', marginLeft: 10 }}>
              ({targetProblems.length}문항 실전 수록)
            </span>
          </h1>

          {detailedType && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14, marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255, 255, 255, 0.15)' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '12px 14px', borderRadius: 10 }}>
                <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, marginBottom: 4 }}>📊 5개년 역대 출제 통계</div>
                <div style={{ fontSize: 13, color: '#f8fafc', lineHeight: 1.5 }}>
                  <strong>5개년 {detailedType.stats5Years.total5Years}문항</strong> 출제 (출제율 <strong>{detailedType.stats5Years.appearanceRate}</strong> · 연평균 {detailedType.stats5Years.yearlyAverage}문항)
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>
                    연도별: &apos;22({detailedType.stats5Years.countsByYear['2022']}) &apos;23({detailedType.stats5Years.countsByYear['2023']}) &apos;24({detailedType.stats5Years.countsByYear['2024']}) &apos;25({detailedType.stats5Years.countsByYear['2025']}) &apos;26({detailedType.stats5Years.countsByYear['2026']})
                  </div>
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '12px 14px', borderRadius: 10 }}>
                <div style={{ fontSize: 12, color: '#fbbf24', fontWeight: 700, marginBottom: 4 }}>🎯 이번 연도 수능 출제 예상</div>
                <div style={{ fontSize: 13, color: '#f8fafc', lineHeight: 1.5 }}>
                  출제 확률 <strong>{detailedType.forecast.appearanceProbability}</strong> · 예상 배점 <strong>{detailedType.forecast.expectedScore}</strong>
                  <div style={{ fontSize: 11, color: '#cbd5e1', marginTop: 3 }}>
                    예상 문항 번호 대역: <strong>{detailedType.forecast.expectedProblemRange}</strong>
                  </div>
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '12px 14px', borderRadius: 10 }}>
                <div style={{ fontSize: 12, color: '#38bdf8', fontWeight: 600, marginBottom: 4 }}>💡 핵심 발상 &amp; 빈출 함정</div>
                <div style={{ fontSize: 12, color: '#f8fafc', lineHeight: 1.5 }}>
                  <div><strong>핵심 공식/발상:</strong> {detailedType.coreIdea}</div>
                  {detailedType.traps && <div style={{ color: '#fca5a5', marginTop: 3 }}><strong>⚠️ 주의 함정:</strong> {detailedType.traps}</div>}
                </div>
              </div>
            </div>
          )}
        </div>

        <TopicWorksheetView
          category="csat"
          subjectLabel={`${subject.label} (${subject.revised2022 || ''})`}
          unit={{
            ...unit,
            label: detailedType ? `${unit.label} · ${detailedType.detailedType}` : unit.label,
            revised2022: subject.revised2022,
          }}
          problems={targetProblems}
          onBack={handleBackToCatalog}
          language={language}
          onGenerateVariant={() => handleGenerateVariant(unit.id, targetProblems[0])}
          variantProblem={variantProblem}
          onCloseVariant={() => setVariantProblem(null)}
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 0 60px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24, textAlign: 'center' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 10px', color: 'var(--ink, #111827)', letterSpacing: '-0.02em' }}>
          {words.title}
        </h1>
        <p style={{ fontSize: 14, color: 'var(--ink-soft, #4b5563)', margin: '0 auto', maxWidth: 860, lineHeight: 1.6 }}>
          {words.subtitle}
        </p>
      </div>

      {/* Main Tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '2px solid var(--paper-line, #e5e7eb)', marginBottom: 24, overflowX: 'auto' }}>
        <button
          type="button"
          onClick={() => setActiveTab('detailed')}
          style={{
            padding: '11px 20px',
            fontSize: 15,
            fontWeight: 700,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderBottom: activeTab === 'detailed' ? '3px solid var(--primary, #2563eb)' : '3px solid transparent',
            color: activeTab === 'detailed' ? 'var(--primary, #2563eb)' : 'var(--ink-soft, #6b7280)',
            marginBottom: -2,
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap',
          }}
        >
          {words.tabDetailedTypes}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('forecast')}
          style={{
            padding: '11px 20px',
            fontSize: 15,
            fontWeight: 700,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderBottom: activeTab === 'forecast' ? '3px solid var(--primary, #2563eb)' : '3px solid transparent',
            color: activeTab === 'forecast' ? 'var(--primary, #2563eb)' : 'var(--ink-soft, #6b7280)',
            marginBottom: -2,
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap',
          }}
        >
          {words.tabForecastSummary}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('core')}
          style={{
            padding: '11px 20px',
            fontSize: 15,
            fontWeight: 700,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderBottom: activeTab === 'core' ? '3px solid var(--primary, #2563eb)' : '3px solid transparent',
            color: activeTab === 'core' ? 'var(--primary, #2563eb)' : 'var(--ink-soft, #6b7280)',
            marginBottom: -2,
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap',
          }}
        >
          {words.tabCore}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('files')}
          style={{
            padding: '11px 20px',
            fontSize: 15,
            fontWeight: 700,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderBottom: activeTab === 'files' ? '3px solid var(--primary, #2563eb)' : '3px solid transparent',
            color: activeTab === 'files' ? 'var(--primary, #2563eb)' : 'var(--ink-soft, #6b7280)',
            marginBottom: -2,
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap',
          }}
        >
          {words.tabFiles}
        </button>
      </div>

      {/* VIEW 1: 72 DETAILED PROBLEM TYPES BROWSER */}
      {activeTab === 'detailed' && (
        <div>
          {/* Subject Filter Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
            <button
              type="button"
              onClick={() => setSelectedSubject('all')}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                fontSize: 12.5,
                fontWeight: selectedSubject === 'all' ? 700 : 500,
                border: selectedSubject === 'all' ? '1.5px solid #111827' : '1px solid var(--paper-line, #e5e7eb)',
                background: selectedSubject === 'all' ? '#111827' : 'var(--card-bg, #ffffff)',
                color: selectedSubject === 'all' ? '#ffffff' : 'var(--ink, #374151)',
                cursor: 'pointer',
              }}
            >
              {words.allSubjects} ({problems.length})
            </button>
            {ALL_SUBJECT_GROUPS.map((subject) => {
              const active = selectedSubject === subject.id;
              const count = subjectCounts[subject.id] || 0;
              const styleMeta = SUBJECT_COLORS[subject.id] || SUBJECT_COLORS.math1;
              return (
                <button
                  key={subject.id}
                  type="button"
                  onClick={() => setSelectedSubject(active ? 'all' : subject.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 20,
                    fontSize: 12.5,
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
          <div style={{ marginBottom: 22 }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={words.searchPlaceholder}
              style={{
                width: '100%',
                padding: '11px 16px',
                borderRadius: 10,
                border: '1.5px solid var(--paper-line, #d1d5db)',
                background: 'var(--card-bg, #ffffff)',
                fontSize: 14,
                color: 'var(--ink, #111827)',
                outline: 'none',
                boxSizing: 'border-box',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
              }}
            />
          </div>

          {/* Subject Sections with Granular 72 Types Tree */}
          <div style={{ display: 'grid', gap: 26 }}>
            {ALL_SUBJECT_GROUPS.filter((subject) => {
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
                    borderRadius: 16,
                    padding: '22px 24px',
                    boxShadow: '0 3px 12px rgba(0,0,0,0.03)',
                  }}
                >
                  {/* Subject Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--paper-line, #e5e7eb)', paddingBottom: 14, marginBottom: 18 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ width: 12, height: 12, borderRadius: '50%', background: styleMeta.border }}></span>
                        <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: 'var(--ink, #111827)' }}>
                          {subject.label}{' '}
                          <span style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--ink-soft)' }}>
                            ({language === 'en' ? subject.labelEn : `2022개정: ${subject.revised2022}`})
                          </span>
                        </h2>
                        <span style={{ fontSize: 12, padding: '2px 10px', borderRadius: 12, background: styleMeta.bg, color: styleMeta.text, fontWeight: 700 }}>
                          {words.problemCount(totalInSubject)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Units List */}
                  <div style={{ display: 'grid', gap: 18 }}>
                    {subject.units.filter((unit) => {
                      if (!searchQuery) return true;
                      const q = searchQuery.toLowerCase().trim();
                      const matchUnit = unit.label.toLowerCase().includes(q) || (unit.labelEn || '').toLowerCase().includes(q);
                      const matchTypes = getDetailedTypesByUnitId(unit.id).some((dt) =>
                        dt.detailedType.toLowerCase().includes(q) ||
                        dt.middleUnit.toLowerCase().includes(q) ||
                        dt.coreIdea.toLowerCase().includes(q)
                      );
                      return matchUnit || matchTypes;
                    }).map((unit) => {
                      const list = problemsByUnit.get(unit.id) || [];
                      const middleGroups = getMiddleUnitsGrouped(unit.id);
                      const isExpanded = expandedUnits[unit.id] ?? true;

                      return (
                        <div
                          key={unit.id}
                          style={{
                            border: '1px solid var(--paper-line, #e5e7eb)',
                            borderRadius: 14,
                            background: '#fafbfc',
                            padding: '18px 20px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.015)',
                          }}
                        >
                          {/* Unit Title Bar */}
                          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: isExpanded ? 16 : 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                              <button
                                type="button"
                                onClick={() => toggleUnitExpand(unit.id)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  fontSize: 16,
                                  color: 'var(--ink)',
                                  padding: 0,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 6,
                                }}
                              >
                                <span style={{ fontSize: 13, color: '#64748b' }}>{isExpanded ? '▼' : '▶'}</span>
                                <span style={{ fontSize: 17, fontWeight: 800, color: '#0f172a' }}>{unit.label}</span>
                              </button>
                              <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>({unit.labelEn})</span>
                              <span style={{ fontSize: 11.5, fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: '#e2e8f0', color: '#334155' }}>
                                {words.problemCount(list.length)}
                              </span>
                            </div>

                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                              <button
                                type="button"
                                onClick={() => handleOpenWorksheet(unit.id)}
                                style={{
                                  padding: '7px 14px',
                                  borderRadius: 8,
                                  fontSize: 12.5,
                                  fontWeight: 700,
                                  background: '#ffffff',
                                  color: 'var(--primary, #2563eb)',
                                  border: '1.5px solid var(--primary, #2563eb)',
                                  cursor: 'pointer',
                                }}
                              >
                                대단원 전체 풀기 ({list.length}) →
                              </button>
                              <button
                                type="button"
                                onClick={() => toggleUnitExpand(unit.id)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#64748b',
                                  fontSize: 12,
                                  cursor: 'pointer',
                                  fontWeight: 600,
                                }}
                              >
                                {isExpanded ? '세부유형 접기 ▲' : `세부유형 펼치기 (${middleGroups.reduce((acc, g) => acc + g.types.length, 0)}개) ▼`}
                              </button>
                            </div>
                          </div>

                          {/* Expanded: Sub-units (중단원) & Detailed Types Grid */}
                          {isExpanded && (
                            <div style={{ display: 'grid', gap: 14, paddingTop: 12, borderTop: '1px dashed #cbd5e1' }}>
                              {middleGroups.map(({ middleUnit, types }) => (
                                <div
                                  key={middleUnit}
                                  style={{
                                    background: '#ffffff',
                                    borderRadius: 12,
                                    padding: '14px 16px',
                                    border: '1px solid #e2e8f0',
                                  }}
                                >
                                  {/* Sub-unit / Middle Unit Header */}
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                                    <span style={{ fontSize: 14 }}>📌</span>
                                    <strong style={{ fontSize: 14, color: '#1e293b' }}>중단원: {middleUnit}</strong>
                                    <span style={{ fontSize: 11, color: '#64748b' }}>({types.length}개 세부유형)</span>
                                  </div>

                                  {/* Detailed Problem Types Cards */}
                                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10 }}>
                                    {types.map((dt) => {
                                      const dtProblems = problemsByDetailedType.get(dt.typeId) || [];

                                      return (
                                        <div
                                          key={dt.typeId}
                                          style={{
                                            border: '1px solid #e2e8f0',
                                            borderRadius: 10,
                                            padding: '12px 14px',
                                            background: '#f8fafc',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            transition: 'border-color 0.15s ease',
                                          }}
                                        >
                                          <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6, marginBottom: 6 }}>
                                              <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
                                                {dt.detailedType}
                                              </span>
                                              <span style={{
                                                fontSize: 10.5,
                                                fontWeight: 700,
                                                padding: '2px 6px',
                                                borderRadius: 6,
                                                background: dt.typicalDifficulty.includes('상') ? '#fee2e2' : dt.typicalDifficulty.includes('중') ? '#fef3c7' : '#e0f2fe',
                                                color: dt.typicalDifficulty.includes('상') ? '#b91c1c' : dt.typicalDifficulty.includes('중') ? '#92400e' : '#0369a1',
                                                whiteSpace: 'nowrap',
                                              }}>
                                                난이도: {dt.typicalDifficulty}
                                              </span>
                                            </div>

                                            {/* 5-Year Stat & Forecast Badge */}
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
                                              <span style={{ fontSize: 10.5, fontWeight: 600, padding: '2px 6px', borderRadius: 4, background: 'rgba(16, 185, 129, 0.12)', color: '#047857' }}>
                                                📊 5개년 출제율 {dt.stats5Years.appearanceRate}
                                              </span>
                                              <span style={{ fontSize: 10.5, fontWeight: 600, padding: '2px 6px', borderRadius: 4, background: 'rgba(245, 158, 11, 0.12)', color: '#b45309' }}>
                                                🎯 예상 {dt.forecast.appearanceProbability}
                                              </span>
                                            </div>

                                            {/* Core Idea snippet */}
                                            <div style={{ fontSize: 12, color: '#475569', marginBottom: 4 }}>
                                              💡 <strong>핵심:</strong> {dt.coreIdea}
                                            </div>
                                            {dt.traps && (
                                              <div style={{ fontSize: 11, color: '#ef4444', marginBottom: 8 }}>
                                                ⚠️ {dt.traps}
                                              </div>
                                            )}
                                          </div>

                                          {/* Action Buttons */}
                                          <div style={{ display: 'flex', gap: 6, marginTop: 8, paddingTop: 8, borderTop: '1px solid #e2e8f0' }}>
                                            <button
                                              type="button"
                                              onClick={() => handleOpenWorksheet(unit.id, dt.typeId)}
                                              style={{
                                                flex: 1,
                                                padding: '7px 10px',
                                                borderRadius: 6,
                                                fontSize: 12,
                                                fontWeight: 700,
                                                background: '#2563eb',
                                                color: '#ffffff',
                                                border: 'none',
                                                cursor: 'pointer',
                                              }}
                                            >
                                              유형 풀기 ({dtProblems.length || list.length}제) →
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => handleGenerateVariant(unit.id, dtProblems[0] || list[0])}
                                              title="알고리즘 유사/변형문제 즉시 생성"
                                              style={{
                                                padding: '7px 10px',
                                                borderRadius: 6,
                                                fontSize: 12,
                                                fontWeight: 600,
                                                background: '#f1f5f9',
                                                color: '#334155',
                                                border: '1px solid #cbd5e1',
                                                cursor: 'pointer',
                                              }}
                                            >
                                              ⚡ 변형
                                            </button>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
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

      {/* VIEW 2: 5-YEAR STATISTICS & FORECAST SUMMARY TABLE */}
      {activeTab === 'forecast' && (
        <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 6px', color: '#0f172a' }}>
              📊 수능 수학 72대 세부유형 역대 5개년 출제 통계 &amp; 2026/2027 수능 출제 예측 총괄표
            </h2>
            <p style={{ fontSize: 13.5, color: '#64748b', margin: 0 }}>
              평가원 본수능 2022~2026학년도 현행 체제 실측 데이터를 기반으로 산출된 72대 세부유형의 빈도와 이번 연도 출제 예상 지표입니다.
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #cbd5e1', color: '#334155' }}>
                  <th style={{ padding: '10px 12px', fontWeight: 700 }}>과목</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700 }}>대단원 &gt; 중단원</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700 }}>세부유형명</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700, textAlign: 'center' }}>5개년 출제수</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700, textAlign: 'center' }}>출제율</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700, textAlign: 'center' }}>난이도</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700, textAlign: 'center' }}>올해 예상</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700 }}>핵심 발상 &amp; 함정 포인트</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700, textAlign: 'center' }}>실전 풀기</th>
                </tr>
              </thead>
              <tbody>
                {ALL_DETAILED_TYPES.map((dt) => {
                  const dtProblems = problemsByDetailedType.get(dt.typeId) || [];
                  return (
                    <tr key={dt.typeId} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background 0.15s' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap' }}>
                        {dt.subject}
                      </td>
                      <td style={{ padding: '10px 12px', color: '#475569', whiteSpace: 'nowrap' }}>
                        {dt.majorUnit} &gt; {dt.middleUnit}
                      </td>
                      <td style={{ padding: '10px 12px', fontWeight: 700, color: '#0f172a' }}>
                        {dt.detailedType}
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 600 }}>
                        {dt.stats5Years.total5Years}문항
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                        <span style={{ padding: '2px 6px', borderRadius: 4, background: '#dcfce7', color: '#15803d', fontSize: 11.5, fontWeight: 700 }}>
                          {dt.stats5Years.appearanceRate}
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                        <span style={{
                          padding: '2px 6px',
                          borderRadius: 4,
                          fontSize: 11.5,
                          fontWeight: 700,
                          background: dt.typicalDifficulty.includes('상') ? '#fee2e2' : dt.typicalDifficulty.includes('중') ? '#fef3c7' : '#e0f2fe',
                          color: dt.typicalDifficulty.includes('상') ? '#b91c1c' : dt.typicalDifficulty.includes('중') ? '#92400e' : '#0369a1',
                        }}>
                          {dt.typicalDifficulty}
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                        <span style={{ padding: '2px 6px', borderRadius: 4, background: '#fef3c7', color: '#b45309', fontSize: 11.5, fontWeight: 700 }}>
                          {dt.forecast.appearanceProbability}
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px', color: '#475569', fontSize: 12 }}>
                        <div>💡 {dt.coreIdea}</div>
                        {dt.traps && <div style={{ color: '#ef4444' }}>⚠️ {dt.traps}</div>}
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <button
                          type="button"
                          onClick={() => handleOpenWorksheet(dt.unitId, dt.typeId)}
                          style={{
                            padding: '5px 10px',
                            borderRadius: 6,
                            fontSize: 11.5,
                            fontWeight: 700,
                            background: '#2563eb',
                            color: '#ffffff',
                            border: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          문제 풀기 ({dtProblems.length || '풀기'})
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: CORE PRACTICE TEST (종합 맞춤 테스트 만들기) */}
      {activeTab === 'core' && (
        coreProblems !== null ? (
          <div>
            <button type="button" className="button button-secondary" style={{ marginBottom: 12 }} onClick={() => setCoreProblems(null)}>
              ← {language === 'ko' ? '단원 선택으로 돌아가기' : 'Back to unit selection'}
            </button>
            {coreProblems.length < coreCount ? (
              <div style={{ background: 'rgba(217, 119, 6, 0.08)', border: '1px solid rgba(217, 119, 6, 0.25)', borderRadius: 10, padding: '10px 14px', margin: '0 0 16px', fontSize: 13, color: '#92400e' }}>
                {language === 'ko'
                  ? `선택한 조건에 맞는 기출문제 중 ${coreProblems.length}개를 찾았습니다 (요청: ${coreCount}개).`
                  : `Found ${coreProblems.length} archived problems matching your selection (requested: ${coreCount}).`}
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
                ? '기말고사·모의고사 범위에 맞춰 여러 단원을 한 번에 선택하고, 문제 수와 난이도 상한을 지정해 종합 테스트를 만드세요.'
                : 'Select every unit covered by your final or mock-exam scope, then set a problem count and a difficulty ceiling.'}
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

      {/* VIEW 4: PDF FILE MANIFEST BROWSER */}
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
                                    <span>{!TEMPORARY_OPEN_ACCESS && (!entitled || file.meta?.accessTier === 'premium') ? '🔒 ' : ''}{year} {EXAM_TYPE_LABELS[examType]} · {variant.label}{file.meta?.grade === 'g1' || file.meta?.grade === 'g2' ? ` · ${GRADE_LABELS[file.meta.grade]}` : ''}</span>
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
                                    <span>{!TEMPORARY_OPEN_ACCESS && (!entitled || file.meta?.accessTier === 'premium') ? '🔒 ' : ''}{year} {EXAM_TYPE_LABELS[examType]} · {variant.label}</span>
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
