'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import { findGcdLcmUnit, GCD_LCM_BASIC_UNITS, RPM_GCD_LCM_APPLIED_UNITS, GCD_LCM_UNITS, localizeGcdLcmUnit } from './catalog';
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
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
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

function makeBasicProblems(seed, unit) {
  const random = seededRandom(`${seed}:${unit.id}`);
  const used = new Set();
  return Array.from({ length: PROBLEM_COUNT }, (_, index) => {
    let item;
    let attempt = 0;
    do {
      item = unit.make(random);
      attempt += 1;
    } while (used.has(`${item.prompt}|${item.expression}`) && attempt < 60);
    used.add(`${item.prompt}|${item.expression}`);
    return { id: index + 1, ...item };
  });
}

function makeAppliedProblems(seed, unit) {
  const appliedGenerator = findRpmAppliedGenerator(unit.id) || unit.make;
  if (!appliedGenerator) return makeBasicProblems(seed, unit);
  const random = seededRandom(`${seed}:${unit.id}:applied`);
  const used = new Set();
  return Array.from({ length: PROBLEM_COUNT }, (_, index) => {
    let item;
    let attempt = 0;
    do {
      item = appliedGenerator(random);
      attempt += 1;
    } while (used.has(`${item.prompt}|${item.expression}`) && attempt < 50);
    used.add(`${item.prompt}|${item.expression}`);
    return { id: index + 1, ...item };
  });
}

function normalizeAnswer(value) {
  return String(value).toLowerCase().replace(/[×*]/g, 'x').replace(/\s*\^\s*/g, '^').replace(/\s*x\s*/g, 'x').replace(/\s*,\s*/g, ',').replace(/\s+/g, '').trim();
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

const PowerText = MathText;

export default function GcdLcmGenerator() {
  const { language } = useLanguage();
  const { user, status: authStatus } = useAuth();
  const foreign = isNonKorean(language);
  const [unitId, setUnitId] = useState(GCD_LCM_UNITS[0].id);
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
    const tierUnits = initialTier === 'advanced' ? RPM_GCD_LCM_APPLIED_UNITS : GCD_LCM_BASIC_UNITS;
    const requestedUnitId = params.get('unit');
    const matchedUnit = tierUnits.find((u) => u.id === requestedUnitId) || findGcdLcmUnit(requestedUnitId);
    const initialUnit = matchedUnit.id;
    const initialSeed = (params.get('sheet') || createSeed()).toUpperCase();
    const initialView = params.get('view') === 'answers' ? 'answers' : 'problems';
    setUnitId(initialUnit); setSeed(initialSeed); setTier(initialTier); setView(initialView);
    window.history.replaceState({}, '', buildUrl(initialSeed, initialUnit, initialTier, initialView));
    setReady(true);
  }, []);

  const currentUnits = tier === 'advanced' ? RPM_GCD_LCM_APPLIED_UNITS : GCD_LCM_BASIC_UNITS;
  const unit = findGcdLcmUnit(unitId);
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
    const nextUnits = nextTier === 'advanced' ? RPM_GCD_LCM_APPLIED_UNITS : GCD_LCM_BASIC_UNITS;
    const isCurrentValid = nextUnits.some((u) => u.id === unitId);
    const nextUnitId = isCurrentValid ? unitId : nextUnits[0].id;
    setTier(nextTier);
    setUnitId(nextUnitId);
    setAnswers({});
    setChecked(false);
    replaceUrl(seed, nextUnitId, nextTier, view);
  }

  function checkAnswers() {
    setChecked(true);
    recordAttempts(user, problems
      .filter((item) => answers[item.id] !== undefined && answers[item.id] !== '')
      .map((item) => ({
        grade: 'middle-1',
        unit: unit.id,
        problemType: 'short',
        isCorrect: normalizeAnswer(answers[item.id]) === normalizeAnswer(item.answer),
        answer: answers[item.id],
      })));
  }

  const unitLabel = localizeGcdLcmUnit(unit, language);
  const unitDescription = localizeGcdLcmUnit(unit, language, 'description');

  return <div className="worksheet-app">
    <CurriculumMappingBar categoryKey="gcd-lcm" language={language} />

    <section className="worksheet-controls no-print" aria-label={tr(language, 'worksheetSettings')}>
      <div>
        <label htmlFor="gcd-lcm-unit">{tr(language, 'skill')}</label>
        <select id="gcd-lcm-unit" value={unitId} onChange={(event) => chooseUnit(event.target.value)}>
          {currentUnits.map((item) => <option key={item.id} value={item.id}>{localizeGcdLcmUnit(item, language)}</option>)}
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
          const selectedChoice = item.choices?.find((choice) => choice.value === item.answer);
          return <article className="vertical-problem word-problem prime-problem" key={item.id}>
            <span className="problem-number">{item.id}</span>
            <div className="word-calculation">
              <p><MathText value={foreign && item.promptEn ? item.promptEn : item.prompt} /></p>
              {item.diagram ? <RpmDiagram diagram={item.diagram} /> : null}
              {item.expression ? <strong className="word-expression font-mono"><PowerText value={item.expression} /></strong> : null}
              {item.choices ? (
                <div className="choice-answer">
                  {view === 'answers' ? (
                    <strong><MathText value={selectedChoice ? `${selectedChoice.value}. ${foreign && selectedChoice.labelEn ? selectedChoice.labelEn : selectedChoice.label}` : item.answer} /></strong>
                  ) : (
                    item.choices.map((choice) => (
                      <button
                        type="button"
                        key={choice.value}
                        className={`${value === choice.value ? 'selected' : ''} ${checked && value === choice.value ? (isCorrect ? 'correct' : 'wrong') : ''}`}
                        onClick={() => changeAnswer(item.id, choice.value)}
                        aria-pressed={value === choice.value}
                      >
                        <span>{choice.value}</span><MathText value={foreign && choice.labelEn ? choice.labelEn : choice.label} />
                      </button>
                    ))
                  )}
                </div>
              ) : (
                <div className="word-answer">
                  <span>{tr(language, 'answer')}</span>
                  <span className="inline-answer">
                    {view === 'answers' ? <strong><PowerText value={item.answer} /></strong> : <>
                      <input
                        aria-label={`${tr(language, 'answer')} ${item.id}`}
                        value={value}
                        onChange={(event) => changeAnswer(item.id, event.target.value)}
                        className={checked && value ? (isCorrect ? 'correct' : 'wrong') : ''}
                      />
                      <span className="print-answer-space" aria-hidden="true" />
                    </>}
                  </span>
                  {item.answerSuffix ? <em>{item.answerSuffix}</em> : null}
                </div>
              )}
              {view === 'answers' && item.explanation ? (
                <p className="geometry-explanation" style={{ fontSize: '11px', marginTop: '6px', color: 'var(--ink-soft)' }}>
                  <b>{language === 'ko' ? '풀이' : 'Solution'}: </b><MathText value={item.explanation} />
                </p>
              ) : null}
            </div>
            {checked && view === 'problems' && value ? (
              <span className={`result-mark ${isCorrect ? 'correct' : 'wrong'}`}>{tr(language, isCorrect ? 'correct' : 'tryAgain')}</span>
            ) : null}
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
          <p>{foreign ? 'Separate multiple answers with commas. Use ^ for exponents.' : '답이 여러 개이면 쉼표로 구분하세요. 거듭제곱은 2^3처럼 입력합니다.'}</p>
        </div>
        <button className="button button-primary" onClick={checkAnswers}>{tr(language, 'checkAnswers')}</button>
        {checked ? <strong className="score">{tr(language, 'score', { count: correctCount })}</strong> : null}
      </section>
    ) : null}
  </div>;
}
