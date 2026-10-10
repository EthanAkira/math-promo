'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../auth';
import MathText from '../../components/MathText';
import AuthModal from '../../components/AuthModal';

const CIRCLED = ['①', '②', '③', '④', '⑤'];
const SECTION_LABEL = { b: '기본', p: '기출', e: '예상' };
const GRADE_GROUPS = [
  { grade: 'g2', title: '고2 · 수학Ⅱ (2022 개정 미적분Ⅰ)', desc: '함수의 극한과 연속 · 미분 · 적분' },
  { grade: 'g3', title: '고3 · 미적분 (수열의 극한)', desc: '수열의 극한 · 급수 · 등비급수의 활용' },
];
// Which AMC / AP unit each type connects to (kept in sync with examUnits.js / the AMC archive).
const RELATED = {
  2: [{ label: 'AMC · 등비수열과 급수', href: '/amc/units?unit=geometric-series' }],
  3: [{ label: 'AMC · 등비수열과 급수', href: '/amc/units?unit=geometric-series' }],
  5: [{ label: 'AMC · 등비수열과 급수', href: '/amc/units?unit=geometric-series' }],
  1: [{ label: 'AMC · 수열과 규칙성', href: '/amc/units?unit=sequences-patterns' }],
};
const CSAT_LINK = { 'sequence-limits': '/csat/units?unit=sequence-limits', 'limits-continuity': '/csat/units?unit=limits-continuity', differentiation: '/csat/units?unit=differentiation', integration: '/csat/units?unit=integration' };

const cardStyle = { border: '1px solid var(--paper-line)', borderRadius: 10, padding: 16, background: 'var(--card-bg, #fff)' };
const chip = (active) => ({
  padding: '6px 14px', borderRadius: 999, border: '1px solid var(--paper-line)', cursor: 'pointer', fontSize: 13, fontWeight: 700,
  background: active ? '#1f2733' : '#fff', color: active ? '#fff' : 'var(--ink-soft)',
});

function normalizeShort(value) {
  return String(value ?? '').replace(/−/g, '-').replace(/\s+/g, '').trim();
}

function ProblemCard({ item, index, mode, onShowSolution }) {
  const [picked, setPicked] = useState(null);
  const [typed, setTyped] = useState('');
  const [graded, setGraded] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const isMcq = item.kind === 'mcq';
  const answerText = isMcq ? CIRCLED[Number(item.answer) - 1] : item.answer;
  const correct = graded && (isMcq ? picked === Number(item.answer) : normalizeShort(typed) === normalizeShort(item.answer));
  const stemSrc = item.stemImage ? `/api/jjang-calc1/asset?id=${item.stemImage}` : null;
  const figureSrc = item.figure ? `/api/jjang-calc1/asset?id=${item.figure}` : null;

  return (
    <article style={{ ...cardStyle, marginBottom: 14 }}>
      <header style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 10 }}>
        <strong className="font-display" style={{ fontSize: 17 }}>{mode === 'stored' ? item.number : index + 1}.</strong>
        {mode === 'stored' ? <span style={{ fontSize: 12, fontWeight: 800, padding: '2px 8px', borderRadius: 999, background: item.sectionCode === 'p' ? '#fde2e2' : item.sectionCode === 'e' ? '#e0ecff' : '#e8f5ec', color: item.sectionCode === 'p' ? '#b91c1c' : item.sectionCode === 'e' ? '#1d4ed8' : '#166534' }}>{item.section}</span> : <span style={{ fontSize: 12, fontWeight: 800, padding: '2px 8px', borderRadius: 999, background: '#f3e8ff', color: '#6d28d9' }}>유사문제</span>}
        {item.source ? <span style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>📌 {item.source}</span> : null}
      </header>

      {stemSrc ? <img src={stemSrc} alt={`${item.number}번 문제`} style={{ maxWidth: '100%', display: 'block', margin: '0 auto 10px' }} /> : (
        <div style={{ lineHeight: 1.9, whiteSpace: 'pre-wrap', fontSize: 15.5 }}><MathText value={item.question} /></div>
      )}
      {figureSrc ? <img src={figureSrc} alt="문제 그림" style={{ maxWidth: '100%', maxHeight: 280, display: 'block', margin: '10px auto' }} /> : null}

      {isMcq ? <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 8, marginTop: 12 }}>
        {item.choices.map((choice, ci) => {
          const chosen = picked === ci + 1;
          const isAnswer = graded && Number(item.answer) === ci + 1;
          return <button type="button" key={ci} disabled={graded} onClick={() => setPicked(ci + 1)} style={{
            textAlign: 'left', padding: '8px 12px', borderRadius: 8, cursor: graded ? 'default' : 'pointer', fontSize: 15,
            border: `2px solid ${isAnswer ? '#16a34a' : chosen ? '#1f2733' : 'var(--paper-line)'}`,
            background: isAnswer ? '#f0fdf4' : chosen ? '#eef2f7' : '#fff',
          }}>{CIRCLED[ci]} <MathText value={choice} /></button>;
        })}
      </div> : <div style={{ marginTop: 12 }}>
        <input value={typed} disabled={graded} onChange={(e) => setTyped(e.target.value)} placeholder="답 입력 (정수)" style={{ padding: '8px 12px', borderRadius: 8, border: '2px solid var(--paper-line)', fontSize: 15, width: 160 }} />
      </div>}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12, alignItems: 'center' }}>
        {!graded ? <button type="button" className="button" disabled={isMcq ? picked === null : !typed.trim()} onClick={() => setGraded(true)}>채점</button> : <>
          <strong style={{ color: correct ? '#16a34a' : '#dc2626' }}>{correct ? '정답입니다 ✓' : `오답입니다 — 정답: ${answerText}`}</strong>
          <button type="button" className="button button-secondary" onClick={() => { setGraded(false); setPicked(null); setTyped(''); setShowExplanation(false); }}>다시 풀기</button>
        </>}
        {graded && mode === 'stored' && item.solPage ? <button type="button" className="button button-secondary" onClick={() => onShowSolution(item.solPage, item)}>📖 해설 보기 (원문 {item.solPage}쪽)</button> : null}
        {graded && mode === 'similar' ? <button type="button" className="button button-secondary" onClick={() => setShowExplanation((v) => !v)}>{showExplanation ? '해설 닫기' : '📖 해설 보기'}</button> : null}
      </div>
      {graded && mode === 'similar' && showExplanation ? <div style={{ marginTop: 10, padding: 12, background: 'var(--paper-soft, #faf7f0)', borderRadius: 8, lineHeight: 1.9, whiteSpace: 'pre-wrap', fontSize: 14.5 }}><MathText value={item.explanation} /></div> : null}
    </article>
  );
}

function SolutionViewer({ page, item, onClose }) {
  const [current, setCurrent] = useState(page);
  const clamp = (n) => Math.min(56, Math.max(1, n));
  return (
    <div role="dialog" aria-label="해설" style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,.65)', zIndex: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 14, overflow: 'auto' }}>
      <div style={{ background: '#fff', borderRadius: 10, padding: 12, maxWidth: 860, width: '100%' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
          <strong>{item ? `${item.typeLabel || ''} ${item.number}번 해설` : '해설'}</strong>
          <span style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>이 문제가 수록된 해설 쪽입니다. 풀이가 이어지면 다음 쪽을 확인하세요.</span>
          <span style={{ flex: 1 }} />
          <button type="button" className="button button-secondary" onClick={() => setCurrent(clamp(current - 1))}>◀ 이전 쪽</button>
          <span className="font-mono" style={{ fontSize: 13 }}>{current}쪽</span>
          <button type="button" className="button button-secondary" onClick={() => setCurrent(clamp(current + 1))}>다음 쪽 ▶</button>
          <button type="button" className="button" onClick={onClose}>닫기</button>
        </div>
        <img src={`/api/jjang-calc1/asset?id=sol-${String(current).padStart(2, '0')}`} alt={`해설 ${current}쪽`} style={{ width: '100%', display: 'block' }} />
      </div>
    </div>
  );
}

export default function Calculus1Premium() {
  const { user, status: authStatus } = useAuth();
  const [authMode, setAuthMode] = useState(null);
  const [types, setTypes] = useState([]);
  const [sub, setSub] = useState('loading'); // loading | active | inactive
  const [typeNo, setTypeNo] = useState(null);
  const [mode, setMode] = useState('stored'); // stored | similar
  const [section, setSection] = useState('all');
  const [stored, setStored] = useState(null);
  const [similar, setSimilar] = useState(null);
  const [seed, setSeed] = useState(() => Math.random().toString(36).slice(2, 10));
  const [state, setState] = useState('idle');
  const [viewer, setViewer] = useState(null);

  useEffect(() => {
    fetch('/api/jjang-calc1/catalog').then((r) => r.json()).then((d) => setTypes(d.types || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (authStatus !== 'ready') return;
    if (!user) { setSub('inactive'); return; }
    fetch('/api/subscriptions/status?subject=curriculum-advanced').then((r) => r.json()).then((d) => setSub(d.active ? 'active' : 'inactive')).catch(() => setSub('inactive'));
  }, [authStatus, user]);

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get('type');
    if (param && Number(param) >= 1 && Number(param) <= 17) setTypeNo(Number(param));
  }, []);

  const entitled = sub === 'active';
  const currentType = useMemo(() => types.find((t) => t.no === typeNo) || null, [types, typeNo]);

  useEffect(() => {
    if (!entitled || !typeNo) return undefined;
    let cancelled = false;
    setState('loading');
    const url = mode === 'stored' ? `/api/jjang-calc1/problems?type=${typeNo}` : `/api/jjang-calc1/similar?type=${typeNo}&seed=${seed}&count=10`;
    fetch(url).then(async (r) => {
      const d = await r.json().catch(() => ({}));
      if (cancelled) return;
      if (!r.ok) { setState('error'); return; }
      if (mode === 'stored') setStored(d.problems); else setSimilar(d.problems);
      setState('ready');
    }).catch(() => { if (!cancelled) setState('error'); });
    return () => { cancelled = true; };
  }, [entitled, typeNo, mode, seed]);

  const shown = useMemo(() => {
    if (mode === 'similar') return similar || [];
    return (stored || []).filter((p) => section === 'all' || p.sectionCode === section);
  }, [mode, stored, similar, section]);

  function chooseType(no) {
    setTypeNo(no); setSection('all'); setStored(null); setSimilar(null);
    try { const u = new URL(window.location.href); u.searchParams.set('type', String(no)); window.history.replaceState(null, '', u); } catch { /* ignore */ }
  }

  const gate = authStatus === 'ready' && !entitled && sub !== 'loading';

  return <>
    <p className="no-print" style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 6 }}><a href="/">홈</a> / <a href="/math">수학 영역</a> / 미적분 유형별 기출·응용</p>
    <h1 className="font-display" style={{ fontSize: 26, margin: '0 0 6px' }}>미적분 유형별 기출·응용 문제 <span style={{ fontSize: 13, verticalAlign: 'middle', background: '#6d28d9', color: '#fff', padding: '3px 10px', borderRadius: 999 }}>유료</span></h1>
    <p style={{ color: 'var(--ink-soft)', margin: '0 0 20px', lineHeight: 1.7 }}>수능·모의평가 기출 문제를 17개 유형으로 묶고, 유형마다 기본문제·기출문제·예상문제와 해설을 제공합니다. 기출문제에는 출제 연도·시험 정보가 함께 표시되며, 원할 때 같은 유형의 유사문제를 새로 생성할 수 있습니다.</p>

    {gate ? <div style={{ ...cardStyle, borderColor: '#6d28d9', marginBottom: 20 }}>
      <strong>{user ? '이 콘텐츠는 유료 구독 회원 전용입니다.' : '로그인 후 이용할 수 있는 유료 콘텐츠입니다.'}</strong>
      <p style={{ margin: '6px 0 12px', fontSize: 14, color: 'var(--ink-soft)' }}>{user ? '구독이 활성화되면 아래 유형의 문제·해설·유사문제 생성기를 모두 사용할 수 있습니다. 구독은 관리자에게 문의해 주세요.' : '계정에 로그인하면 구독 상태를 확인합니다.'}</p>
      {!user ? <div style={{ display: 'flex', gap: 8 }}><button type="button" className="button" onClick={() => setAuthMode('login')}>로그인</button><button type="button" className="button button-secondary" onClick={() => setAuthMode('signup')}>회원가입</button></div> : <a className="button" href="/contact">구독 문의</a>}
    </div> : null}

    {GRADE_GROUPS.map((group) => <section key={group.grade} style={{ marginBottom: 22 }}>
      <h2 className="font-display" style={{ fontSize: 18, margin: '0 0 2px' }}>{group.title}</h2>
      <p style={{ margin: '0 0 10px', fontSize: 13, color: 'var(--ink-soft)' }}>{group.desc}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 10 }}>
        {types.filter((t) => t.grade === group.grade).map((t) => <button type="button" key={t.no} onClick={() => chooseType(t.no)} style={{ ...cardStyle, textAlign: 'left', cursor: 'pointer', borderColor: typeNo === t.no ? '#6d28d9' : 'var(--paper-line)', boxShadow: typeNo === t.no ? '0 0 0 2px #6d28d933' : 'none' }}>
          <div className="font-mono" style={{ fontSize: 12, color: '#6d28d9', fontWeight: 800 }}>유형 {String(t.no).padStart(2, '0')}</div>
          <div className="font-display" style={{ fontSize: 15.5, margin: '2px 0 6px' }}>{t.name}</div>
          <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>기본 {t.counts[0]} · 기출 {t.counts[1]} · 예상 {t.counts[2]}</div>
        </button>)}
      </div>
    </section>)}

    {currentType ? <section style={{ marginTop: 8 }}>
      <h2 className="font-display" style={{ fontSize: 21, margin: '0 0 6px' }}>유형 {String(currentType.no).padStart(2, '0')} · {currentType.name}</h2>
      <div className="no-print" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '0 0 14px', fontSize: 13 }}>
        {CSAT_LINK[currentType.unit] ? <a href={CSAT_LINK[currentType.unit]} style={{ color: '#b91c1c', fontWeight: 700 }}>수능 단원별 문제 →</a> : null}
        {(RELATED[currentType.no] || []).map((r) => <a key={r.href} href={r.href} style={{ color: '#1d4ed8', fontWeight: 700 }}>{r.label} →</a>)}
      </div>

      <div className="no-print" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
        <button type="button" style={chip(mode === 'stored')} onClick={() => setMode('stored')}>📚 기출·기본·예상 문제</button>
        <button type="button" style={chip(mode === 'similar')} onClick={() => setMode('similar')}>⚡ 유사문제 생성</button>
        {mode === 'stored' ? <>
          <span style={{ width: 8 }} />
          {['all', 'b', 'p', 'e'].map((s) => <button type="button" key={s} style={chip(section === s)} onClick={() => setSection(s)}>{s === 'all' ? '전체' : SECTION_LABEL[s]}</button>)}
        </> : <button type="button" className="button" onClick={() => { setSimilar(null); setSeed(Math.random().toString(36).slice(2, 10)); }}>🔄 새 유사문제 10개</button>}
      </div>

      {!entitled ? <div style={{ ...cardStyle, color: 'var(--ink-soft)' }}>구독 회원이 되면 이 유형의 문제와 해설을 볼 수 있습니다.</div>
        : state === 'loading' ? <div style={{ ...cardStyle, textAlign: 'center' }}>불러오는 중…</div>
        : state === 'error' ? <div style={{ ...cardStyle, textAlign: 'center' }}>문제를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</div>
        : shown.map((item, i) => <ProblemCard key={item.id} item={{ ...item, typeLabel: `유형 ${currentType.no}` }} index={i} mode={mode} onShowSolution={(p, it) => setViewer({ page: p, item: it })} />)}
    </section> : <p style={{ color: 'var(--ink-soft)' }}>위에서 공부할 유형을 선택하세요.</p>}

    {viewer ? <SolutionViewer page={viewer.page} item={viewer.item} onClose={() => setViewer(null)} /> : null}
    {authMode ? <AuthModal mode={authMode} onClose={() => setAuthMode(null)} /> : null}
  </>;
}
