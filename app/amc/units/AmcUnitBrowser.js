'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../auth';
import { useLanguage } from '../../language';
import { AMC_UNITS, AMC_FINE_SUBJECTS } from '../../examUnits';
import InteractiveProblemCard from '../../components/InteractiveProblemCard';

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
    memberNotice: '단원별 자료(기출변형·자세한 해설 포함)는 로그인 후 AMC 구독 회원만 열람할 수 있습니다. 목록은 자유롭게 둘러보세요.',
    alertNeedLogin: '로그인이 필요한 서비스입니다. 오른쪽 위 로그인 버튼으로 먼저 로그인해주세요.',
    alertNeedSub: '구독이 필요한 서비스입니다. 결제·구독 서비스는 준비 중이며, 이용을 원하시면 문의하기로 연락해주세요.',
    byFileTitle: '파일 단위로 보기 (문제지·해설지 등)',
    byProblemTitle: '문항 단위로 보기 (세부 단원, 자동 분류)',
    byProblemIntro: '업로드된 문제지에서 실제 문항을 추출해 더 세부적인 단원으로 자동 분류한 목록입니다. 규칙 기반 자동 분류라 완벽하지 않을 수 있습니다.',
    problemsLoading: '문항 자료를 불러오는 중입니다...',
    problemsEmpty: '아직 이 단원으로 분류된 문항이 없습니다.',
    problemCount: (n) => `${n}문항`,
    problemLabel: (level, year, num) => `AMC ${level} ${year} · ${num}번`,
    collapse: '접기',
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
    memberNotice: 'Materials by topic (including variant problems and detailed solutions) are available to logged-in AMC subscribers only. Feel free to browse the list.',
    alertNeedLogin: 'Login required. Please log in using the button in the header.',
    alertNeedSub: 'A subscription is required. Paid subscriptions are coming soon — contact us if you would like access.',
    byFileTitle: 'By File (problem sets, solutions, etc.)',
    byProblemTitle: 'By Individual Problem (fine-grained, auto-classified)',
    byProblemIntro: 'Individual problems extracted from uploaded problem sets, auto-classified into finer topics. This is rule-based, not a true AI read, so it may not be perfect.',
    problemsLoading: 'Loading problems...',
    problemsEmpty: 'No problems classified under this topic yet.',
    problemCount: (n) => `${n} problem${n === 1 ? '' : 's'}`,
    problemLabel: (level, year, num) => `AMC ${level} ${year} · #${num}`,
    collapse: 'Collapse',
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
  const [problems, setProblems] = useState(null);
  const [problemsStatus, setProblemsStatus] = useState('loading');
  const [openFineUnit, setOpenFineUnit] = useState(null);
  const [expandedProblemId, setExpandedProblemId] = useState(null);

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
    let cancelled = false;
    fetch('/api/amc/manifest')
      .then((res) => { if (!res.ok) throw new Error('bad response'); return res.json(); })
      .then((data) => { if (!cancelled) { setManifest(data); setStatus('ready'); } })
      .catch(() => { if (!cancelled) setStatus('error'); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/amc/problems')
      .then((res) => { if (!res.ok) throw new Error('bad response'); return res.json(); })
      .then((data) => { if (!cancelled) { setProblems(data.problems || []); setProblemsStatus('ready'); } })
      .catch(() => { if (!cancelled) setProblemsStatus('error'); });
    return () => { cancelled = true; };
  }, []);

  const problemsByFineUnit = useMemo(() => {
    const map = new Map();
    for (const subject of AMC_FINE_SUBJECTS) {
      for (const unit of subject.units) map.set(unit.id, []);
    }
    if (!problems) return map;
    for (const problem of problems) {
      if (problem.unitId && map.has(problem.unitId)) map.get(problem.unitId).push(problem);
    }
    for (const list of map.values()) list.sort((a, b) => (b.year - a.year) || (a.problemNumber - b.problemNumber));
    return map;
  }, [problems]);

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

  return <>
    <p className="no-print" style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 6 }}>
      <a href="/">{words.home}</a> / <a href="/amc.html">{words.hub}</a> / {words.title}
    </p>
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
      <h1 className="font-display" style={{ fontSize: 26, margin: 0 }}>{words.title}</h1>
      <a href="/amc" className="button button-secondary" style={{ textDecoration: 'none' }}>{words.byYear}</a>
    </div>
    <p style={{ color: 'var(--ink-soft)', margin: '0 0 8px' }}>{words.intro}</p>
    {!entitled ? <p style={{ color: 'var(--red-pen)', fontSize: 13, margin: '0 0 8px' }}>🔒 {words.memberNotice}</p> : null}
    <p style={{ color: 'var(--ink-soft)', fontSize: 13, margin: '0 0 28px' }}>{words.untagged}</p>

    <h2 style={{ fontSize: 18, margin: '0 0 10px' }}>{words.byFileTitle}</h2>

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
              onClick={handleItemClick}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--paper)', borderRadius: 8, textDecoration: 'none', color: 'var(--ink)' }}
            >
              <span>{!entitled || file.meta?.accessTier === 'premium' ? '🔒 ' : ''}{year} AMC {level}{variant.id !== 'AMC8' ? variant.id : ''} · {variant.label}</span>
              <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{fileTypeLabel(fileType, language)} →</span>
            </a>)}
          </div> : null}
        </div>;
      })}
    </div> : null}

    <h2 style={{ fontSize: 18, margin: '40px 0 4px' }}>{words.byProblemTitle}</h2>
    <p style={{ color: 'var(--ink-soft)', fontSize: 13, margin: '0 0 16px' }}>{words.byProblemIntro}</p>

    {problemsStatus === 'loading' ? <p style={{ color: 'var(--ink-soft)' }}>{words.problemsLoading}</p> : null}
    {problemsStatus === 'error' ? <p style={{ color: 'var(--red-pen)' }}>{words.error}</p> : null}

    {problemsStatus === 'ready' ? <div style={{ display: 'grid', gap: 24 }}>
      {AMC_FINE_SUBJECTS.filter((subject) => subject.id !== 'uncategorized').map((subject) => {
        const subjectTotal = subject.units.reduce((sum, unit) => sum + (problemsByFineUnit.get(unit.id)?.length || 0), 0);
        if (subjectTotal === 0) return null;
        return <section key={subject.id}>
          <h3 style={{ fontSize: 16, margin: '0 0 8px' }}>{subject.label} <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--ink-soft)' }}>({words.problemCount(subjectTotal)})</span></h3>
          <div style={{ display: 'grid', gap: 8 }}>
            {subject.units.map((unit) => {
              const list = problemsByFineUnit.get(unit.id) || [];
              if (list.length === 0) return null;
              const openKey = `${subject.id}-${unit.id}`;
              const open = openFineUnit === openKey;
              return <div key={unit.id} style={{ background: 'var(--card-bg)', border: '1px solid var(--paper-line)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
                <button
                  type="button"
                  onClick={() => setOpenFineUnit(open ? null : openKey)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '12px 18px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', font: 'inherit' }}
                >
                  <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>{unit.label}</span>
                  <span style={{ fontSize: 12, color: 'var(--ink-soft)', whiteSpace: 'nowrap' }}>{words.problemCount(list.length)} {open ? '▲' : '▼'}</span>
                </button>
                {open ? <div style={{ padding: '0 18px 14px', display: 'grid', gap: 8 }}>
                  {list.length === 0 ? <p style={{ color: 'var(--ink-soft)', fontSize: 14, margin: 0 }}>{words.problemsEmpty}</p> : list.map((problem) => {
                    const isOpen = expandedProblemId === problem.id;
                    return <div key={problem.id}>
                      <button
                        type="button"
                        onClick={() => handleProblemClick(problem)}
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '10px 14px', background: 'var(--paper)', borderRadius: 8, border: 'none', cursor: 'pointer', textAlign: 'left', font: 'inherit', color: 'var(--ink)' }}
                      >
                        <span>{!entitled ? '🔒 ' : ''}{words.problemLabel(problem.level, problem.year, problem.problemNumber)}</span>
                        <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{isOpen ? words.collapse : '→'}</span>
                      </button>
                      {isOpen && entitled ? <div style={{ marginTop: 8 }}>
                        <InteractiveProblemCard
                          problem={{
                            id: problem.id,
                            number: problem.problemNumber,
                            points: problem.points,
                            type: problem.choices?.length ? 'multiple_choice' : 'subjective',
                            question: problem.question,
                            choices: problem.choices || [],
                            correctAnswer: problem.answer,
                            explanation: problem.explanation,
                          }}
                          userAnswer={null}
                          onSelectAnswer={() => {}}
                          isExamMode={false}
                          showResult={false}
                          language={language}
                        />
                      </div> : null}
                    </div>;
                  })}
                </div> : null}
              </div>;
            })}
          </div>
        </section>;
      })}
    </div> : null}
  </>;
}
