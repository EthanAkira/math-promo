'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import { PROPORTION_UNITS, RPM_PROPORTION_APPLIED_UNITS, findProportionUnit, localizeProportionUnit } from './catalog';
import { findRpmAppliedGenerator } from '../rpmAppliedEngine';
import RpmDiagram from '../RpmDiagram';
import CurriculumMappingBar from '../CurriculumMappingBar';
import { useLanguage } from '../../language';
import { useAuth } from '../../auth';
import { isNonKorean, tr } from '../../i18n';
import MathText from '../../components/MathText';
import { recordAttempts } from '../../lib/submissions';

const PROBLEM_COUNT = 20;

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

function createSeed() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const values = new Uint32Array(8);
  window.crypto.getRandomValues(values);
  return Array.from(values, (value) => alphabet[value % alphabet.length]).join('');
}

function dedupeKey(item) {
  const graphKey = item.graph ? `${item.graph.mode}:${JSON.stringify(item.graph.a)}:${item.graph.point.x}:${item.graph.point.y}` : '';
  return `${item.prompt}|${item.expression}|${graphKey}`;
}

function makeBasicProblems(seed, unit) {
  const random = seededRandom(`${seed}:${unit.id}`);
  const used = new Set();
  return Array.from({ length: PROBLEM_COUNT }, (_, index) => {
    let item;
    let attempt = 0;
    let key;
    do { item = unit.make(random); key = dedupeKey(item); attempt += 1; } while (used.has(key) && attempt < 80);
    used.add(key);
    return { id: index + 1, ...item };
  });
}

function makeAppliedProblems(seed, unit) {
  const appliedGenerator = findRpmAppliedGenerator(unit.id);
  if (!appliedGenerator) return makeBasicProblems(seed, unit);
  const random = seededRandom(`${seed}:${unit.id}:applied`);
  const used = new Set();
  return Array.from({ length: PROBLEM_COUNT }, (_, index) => {
    let item;
    let attempt = 0;
    do {
      item = appliedGenerator(random);
      attempt += 1;
    } while (used.has(`${item.prompt}|${item.expression}`) && attempt < 60);
    used.add(`${item.prompt}|${item.expression}`);
    return { id: index + 1, ...item };
  });
}

function normalizeAnswer(value) {
  return String(value).toLowerCase().replace(/−/g, '-').replace(/\s*=\s*/g, '=').replace(/×/g, '').replace(/\s+/g, '').trim();
}

function buildUrl(seed, unitId, tier = 'basic', view = 'problems') {
  const url = new URL(window.location.href);
  url.searchParams.set('sheet', seed);
  url.searchParams.set('unit', unitId);
  if (tier === 'advanced') url.searchParams.set('tier', 'advanced');
  else url.searchParams.delete('tier');
  if (view === 'answers') url.searchParams.set('view', 'answers');
  else url.searchParams.delete('view');
  return url.toString();
}

const ProportionText = MathText;

function ProportionGraphSvg({ graph }) {
  const size = 220;
  const padding = 22;
  const extent = 5;
  const mapX = (x) => padding + ((x + extent) / (extent * 2)) * (size - padding * 2);
  const mapY = (y) => padding + ((extent - y) / (extent * 2)) * (size - padding * 2);
  const originX = mapX(0);
  const originY = mapY(0);
  const ticks = [-4, -2, 2, 4];
  const px = mapX(graph.point.x);
  const py = mapY(graph.point.y);

  let pathD = '';
  if (graph.mode === 'direct') {
    const slope = graph.a.n / graph.a.d;
    const x1 = -4.5;
    const y1 = slope * x1;
    const x2 = 4.5;
    const y2 = slope * x2;
    pathD = `M ${mapX(x1)} ${mapY(y1)} L ${mapX(x2)} ${mapY(y2)}`;
  } else {
    const k = graph.a.n / graph.a.d;
    const branch1 = [];
    const branch2 = [];
    for (let x = 0.8; x <= 4.8; x += 0.2) {
      const y = k / x;
      if (Math.abs(y) <= 5) branch1.push(`${mapX(x).toFixed(1)} ${mapY(y).toFixed(1)}`);
    }
    for (let x = -4.8; x <= -0.8; x += 0.2) {
      const y = k / x;
      if (Math.abs(y) <= 5) branch2.push(`${mapX(x).toFixed(1)} ${mapY(y).toFixed(1)}`);
    }
    pathD = `${branch1.length ? `M ${branch1.join(' L ')}` : ''} ${branch2.length ? `M ${branch2.join(' L ')}` : ''}`;
  }

  return <svg className="proportion-graph-svg generated-geometry" viewBox={`0 0 ${size} ${size}`} role="img" aria-label="정비례 또는 반비례 그래프">
    {ticks.map((tick) => <g key={tick}>
      <line x1={mapX(tick)} y1={padding} x2={mapX(tick)} y2={size - padding} stroke="var(--ink-soft)" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.35" />
      <line x1={padding} y1={mapY(tick)} x2={size - padding} y2={mapY(tick)} stroke="var(--ink-soft)" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.35" />
    </g>)}
    <line x1={padding} y1={originY} x2={size - 8} y2={originY} stroke="var(--ink)" strokeWidth="1.6" />
    <path d={`M ${size - 8} ${originY} L ${size - 15} ${originY - 3} L ${size - 15} ${originY + 3} Z`} fill="var(--ink)" />
    <text x={size - 6} y={originY - 6} fontSize="11" fontWeight="700">x</text>
    <line x1={originX} y1={size - padding} x2={originX} y2={8} stroke="var(--ink)" strokeWidth="1.6" />
    <path d={`M ${originX} 8 L ${originX - 3} 15 L ${originX + 3} 15 Z`} fill="var(--ink)" />
    <text x={originX + 6} y={12} fontSize="11" fontWeight="700">y</text>
    <text x={originX - 10} y={originY + 14} fontSize="11">O</text>
    <path d={pathD} fill="none" stroke="#176b87" strokeWidth="2.2" strokeLinecap="round" />
    <line x1={px} y1={originY} x2={px} y2={py} stroke="var(--ink-soft)" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
    <line x1={originX} y1={py} x2={px} y2={py} stroke="var(--ink-soft)" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
    <circle cx={px} cy={py} r="4" fill="var(--red-pen)" />
    <text x={px + 6} y={py - 6} fontSize="10" fontWeight="700">({graph.point.x}, {graph.point.y})</text>
  </svg>;
}

export default function ProportionGenerator() {
  const { language } = useLanguage();
  const { user, status: authStatus } = useAuth();
  const foreign = isNonKorean(language);
  const [unitId, setUnitId] = useState(PROPORTION_UNITS[0].id);
  const [seed, setSeed] = useState('PREVIEW1');
  const [tier, setTier] = useState('basic');
  const [view, setView] = useState('problems');
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [ready, setReady] = useState(false);
  const [advancedSubStatus, setAdvancedSubStatus] = useState('unknown');

  useEffect(() => {
    if (authStatus !== 'ready') return;
    if (!user) { setAdvancedSubStatus('inactive'); return; }
    let cancelled = false;
    setAdvancedSubStatus('loading');
    fetch('/api/subscriptions/status?subject=curriculum-advanced')
      .then((res) => res.json())
      .then((data) => { if (!cancelled) setAdvancedSubStatus(data.active ? 'active' : 'inactive'); })
      .catch(() => { if (!cancelled) setAdvancedSubStatus('inactive'); });
    return () => { cancelled = true; };
  }, [authStatus, user]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialTier = params.get('tier') === 'advanced' ? 'advanced' : 'basic';
    const tierUnits = initialTier === 'advanced' ? RPM_PROPORTION_APPLIED_UNITS : PROPORTION_UNITS;
    const requestedUnitId = params.get('unit');
    const matchedUnit = tierUnits.find((u) => u.id === requestedUnitId) || findProportionUnit(requestedUnitId);
    const initialUnit = matchedUnit.id;
    const initialSeed = (params.get('sheet') || createSeed()).toUpperCase();
    const initialView = params.get('view') === 'answers' ? 'answers' : 'problems';
    setUnitId(initialUnit); setSeed(initialSeed); setTier(initialTier); setView(initialView);
    window.history.replaceState({}, '', buildUrl(initialSeed, initialUnit, initialTier, initialView));
    setReady(true);
  }, []);

  const currentUnits = tier === 'advanced' ? RPM_PROPORTION_APPLIED_UNITS : PROPORTION_UNITS;
  const unit = findProportionUnit(unitId);
  const basicProblems = useMemo(() => makeBasicProblems(seed, unit), [seed, unit]);
  const appliedProblems = useMemo(() => makeAppliedProblems(seed, unit), [seed, unit]);

  const problems = tier === 'advanced' ? appliedProblems : basicProblems;
  const correctCount = problems.filter((item) => normalizeAnswer(answers[item.id]) === normalizeAnswer(item.answer)).length;

  useEffect(() => {
    if (!ready) return;
    QRCode.toDataURL(buildUrl(seed, unitId, tier), { width: 220, margin: 1, errorCorrectionLevel: 'M', color: { dark: '#1f2733', light: '#fffefb' } }).then(setQrDataUrl);
  }, [seed, unitId, tier, ready]);

  const replaceUrl = useCallback((nextSeed, nextUnit, nextTier, nextView) => {
    window.history.replaceState({}, '', buildUrl(nextSeed, nextUnit, nextTier, nextView));
  }, []);

  function reset(nextSeed, nextUnit = unitId, nextTier = tier) {
    setSeed(nextSeed); setUnitId(nextUnit); setTier(nextTier); setView('problems'); setAnswers({}); setChecked(false);
    replaceUrl(nextSeed, nextUnit, nextTier, 'problems');
  }

  function chooseUnit(nextUnit) { reset(createSeed(), nextUnit, tier); }
  function changeView(nextView) { setView(nextView); setChecked(false); replaceUrl(seed, unitId, tier, nextView); }
  function changeAnswer(id, value) { setAnswers((current) => ({ ...current, [id]: value })); setChecked(false); }

  function chooseTier(nextTier) {
    if (nextTier === tier) return;
    if (nextTier === 'advanced') {
      if (authStatus !== 'ready' || advancedSubStatus === 'loading') return;
      if (!user) { window.alert(tr(language, 'advancedAlertNeedLogin')); return; }
      if (advancedSubStatus !== 'active') { window.alert(tr(language, 'advancedAlertNeedSub')); return; }
    }
    const targetUnits = nextTier === 'advanced' ? RPM_PROPORTION_APPLIED_UNITS : PROPORTION_UNITS;
    const nextUnit = targetUnits.some((u) => u.id === unitId) ? unitId : targetUnits[0].id;
    setTier(nextTier); setUnitId(nextUnit); setAnswers({}); setChecked(false);
    replaceUrl(seed, nextUnit, nextTier, view);
  }

  function checkAnswers() {
    setChecked(true);
    recordAttempts(user, problems
      .filter((item) => answers[item.id] !== undefined && answers[item.id] !== '')
      .map((item) => ({
        grade: 'middle-1',
        unit: unit.id,
        problemType: item.kind === 'choice' ? 'mcq' : 'short',
        isCorrect: normalizeAnswer(answers[item.id]) === normalizeAnswer(item.answer),
        answer: answers[item.id],
      })));
  }

  const unitLabel = localizeProportionUnit(unit, language);
  const unitDescription = localizeProportionUnit(unit, language, 'description');

  return <div className="worksheet-app">
    <CurriculumMappingBar categoryKey="proportion" language={language} />

    <section className="worksheet-controls no-print" aria-label={tr(language, 'worksheetSettings')}>
      <div>
        <label htmlFor="proportion-unit">{tr(language, 'skill')}</label>
        <select id="proportion-unit" value={unitId} onChange={(event) => chooseUnit(event.target.value)}>
          {currentUnits.map((item) => <option key={item.id} value={item.id}>{localizeProportionUnit(item, language)}</option>)}
        </select>
        <p>{unitDescription}</p>
      </div>
      <div className="control-actions">
        <button className="button button-secondary" onClick={() => window.print()}>{tr(language, 'printPdf')}</button>
        <button className="button button-secondary" onClick={() => changeView(view === 'problems' ? 'answers' : 'problems')}>{tr(language, view === 'problems' ? 'answerKey' : 'worksheet')}</button>
        <button className="button button-primary" onClick={() => reset(createSeed())}>{tr(language, 'newWorksheet')}</button>
      </div>
    </section>

    <div className="tier-toggle no-print" role="tablist" aria-label={tr(language, 'tierAdvanced')}>
      <button type="button" role="tab" aria-selected={tier === 'basic'} className={`tier-tab${tier === 'basic' ? ' active' : ''}`} onClick={() => chooseTier('basic')}>
        {tr(language, 'tierBasic')}
      </button>
      <button type="button" role="tab" aria-selected={tier === 'advanced'} className={`tier-tab${tier === 'advanced' ? ' active' : ''}`} onClick={() => chooseTier('advanced')}>
        {tr(language, 'tierAdvanced')}
      </button>
    </div>

    <div className={`worksheet-paper middle-worksheet ${view === 'answers' ? 'answer-sheet' : ''}`}>
      <header className="worksheet-heading">
        <div className="worksheet-brand">
          <span className="brand-mark">DAILY</span>
          <strong>{tr(language, 'dailyLab')}</strong>
        </div>
        <div className="worksheet-title">
          <span>{tr(language, 'grade1Middle')} · {tier === 'advanced' ? (language === 'ko' ? '응용문제' : 'Applied') : (language === 'ko' ? '기본문제' : 'Basic')}</span>
          <h2>{unitLabel} {tr(language, view === 'answers' ? 'answerSheet' : 'worksheetWord')}</h2>
          <p>{unitDescription}</p>
        </div>
        <div className="worksheet-identity">
          <div>
            <span>{tr(language, 'worksheetId')}</span>
            <strong>{seed}</strong>
            <small>{tr(language, 'scanQr')}</small>
          </div>
          {qrDataUrl ? <img src={qrDataUrl} alt={`Worksheet ${seed} QR code`} /> : null}
        </div>
      </header>
      <div className="student-row">
        <span>{tr(language, 'name')}</span><i />
        <span>{tr(language, 'date')}</span><i />
        <span className="sheet-kind">{tr(language, view === 'answers' ? 'answers' : 'problems20')}</span>
      </div>
      <section className="problem-grid word-problem-grid prime-problem-grid" aria-label={`${unitLabel} ${foreign ? 'problems' : '문제'}`}>
        {problems.map((item) => {
          const value = answers[item.id] || '';
          const isCorrect = normalizeAnswer(value) === normalizeAnswer(item.answer);
          const prompt = foreign && item.promptEn ? item.promptEn : item.prompt;
          const choices = foreign ? item.choicesEn : item.choicesKo;
          const graphic = Boolean(item.diagram || item.kind === 'proportion-graph');
          return <article className={`vertical-problem word-problem prime-problem${graphic ? ' graphic-problem' : ''}`} key={item.id}>
            <span className="problem-number">{item.id}</span>
            <div className="word-calculation">
              <p><MathText value={prompt} /></p>
              {item.diagram ? <RpmDiagram diagram={item.diagram} /> : null}
              {item.expression ? <strong className="word-expression font-mono"><ProportionText value={item.expression} /></strong> : null}
              {!item.diagram && item.kind === 'proportion-graph' ? <ProportionGraphSvg graph={item.graph} /> : null}
              <div className="word-answer">
                <span>{tr(language, 'answer')}</span>
                {item.kind === 'choice' ? (
                  <div className="choice-answer">
                    {view === 'answers' ? <strong><MathText value={choices[Number(item.answer) - 1]} /></strong> : choices.map((choice, index) => (
                      <button type="button" key={choice} className={value === String(index + 1) ? 'selected' : ''} onClick={() => changeAnswer(item.id, String(index + 1))}><MathText value={choice} /></button>
                    ))}
                  </div>
                ) : (
                  <span className="inline-answer">
                    {view === 'answers' ? <strong><ProportionText value={item.answer} /></strong> : <>
                      <input
                        aria-label={`${tr(language, 'answer')} ${item.id}`}
                        value={value}
                        onChange={(event) => changeAnswer(item.id, event.target.value)}
                        className={checked && value ? (isCorrect ? 'correct' : 'wrong') : ''}
                      />
                      <span className="print-answer-space" aria-hidden="true" />
                    </>}
                  </span>
                )}
                {item.answerSuffix && !foreign ? <em>{item.answerSuffix}</em> : null}
              </div>
              {view === 'answers' && item.explanation ? (
                <p className="geometry-explanation" style={{ fontSize: '11px', marginTop: '6px', color: 'var(--ink-soft)' }}>
                  <b>{language === 'ko' ? '풀이' : 'Solution'}: </b><MathText value={item.explanation} />
                </p>
              ) : null}
            </div>
            {checked && view === 'problems' && value ? <span className={`result-mark ${isCorrect ? 'correct' : 'wrong'}`}>{tr(language, isCorrect ? 'correct' : 'tryAgain')}</span> : null}
          </article>;
        })}
      </section>
      <footer className="worksheet-footer">
        <span className="worksheet-signature">Built &amp; Designed by Chae</span>
        <span>{tr(language, 'dailyLab')}</span>
        <span>{seed} · {tr(language, 'grade1Short')} · {unitLabel}</span>
      </footer>
    </div>

    {view === 'problems' ? (
      <section className="grading-panel no-print">
        <div>
          <strong>{tr(language, 'solveTablet')}</strong>
          <p>{foreign ? 'Write equations as y=3x or y=6/x. Enter fractions as -3/4.' : '관계식은 y=3x, y=6/x처럼 입력하고, 분수는 -3/4처럼 입력하세요.'}</p>
        </div>
        <button className="button button-primary" onClick={checkAnswers}>{tr(language, 'checkAnswers')}</button>
        {checked ? <strong className="score">{tr(language, 'score', { count: correctCount })}</strong> : null}
      </section>
    ) : null}
  </div>;
}
