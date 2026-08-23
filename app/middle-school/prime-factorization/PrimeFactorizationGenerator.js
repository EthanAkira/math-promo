'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import { findPrimeUnit, localizePrimeUnit, PRIME_UNITS } from './catalog';
import { useLanguage } from '../../language';
import { isNonKorean, tr } from '../../i18n';

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

function makeProblems(seed, unit) {
  const random = seededRandom(`${seed}:${unit.id}`);
  const used = new Set();
  return Array.from({ length: PROBLEM_COUNT }, (_, index) => {
    let item;
    let attempt = 0;
    do {
      item = unit.make(random);
      attempt += 1;
    } while (used.has(`${item.prompt}|${item.expression}`) && attempt < 40);
    used.add(`${item.prompt}|${item.expression}`);
    return { id: index + 1, ...item };
  });
}

function normalizeAnswer(value) {
  return String(value).toLowerCase().replace(/[×*]/g, 'x').replace(/\s*\^\s*/g, '^').replace(/\s*x\s*/g, 'x').replace(/\s*,\s*/g, ',').replace(/\s+/g, '').trim();
}

function buildUrl(seed, unitId, view = 'problems') {
  const url = new URL(window.location.href);
  url.searchParams.set('sheet', seed);
  url.searchParams.set('unit', unitId);
  if (view === 'answers') url.searchParams.set('view', 'answers');
  else url.searchParams.delete('view');
  return url.toString();
}

function PowerText({ value }) {
  const parts = String(value).split(/(\^\d+)/g);
  return <>{parts.map((part, index) => part.startsWith('^') ? <sup key={index}>{part.slice(1)}</sup> : <span key={index}>{part}</span>)}</>;
}

export default function PrimeFactorizationGenerator() {
  const { language } = useLanguage();
  const foreign = isNonKorean(language);
  const [unitId, setUnitId] = useState(PRIME_UNITS[0].id);
  const [seed, setSeed] = useState('PREVIEW1');
  const [view, setView] = useState('problems');
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialUnit = findPrimeUnit(params.get('unit')).id;
    const initialSeed = (params.get('sheet') || createSeed()).toUpperCase();
    const initialView = params.get('view') === 'answers' ? 'answers' : 'problems';
    setUnitId(initialUnit); setSeed(initialSeed); setView(initialView);
    window.history.replaceState({}, '', buildUrl(initialSeed, initialUnit, initialView));
    setReady(true);
  }, []);

  const unit = findPrimeUnit(unitId);
  const problems = useMemo(() => makeProblems(seed, unit), [seed, unit]);
  const correctCount = problems.filter((item) => normalizeAnswer(answers[item.id]) === normalizeAnswer(item.answer)).length;

  useEffect(() => {
    if (!ready) return;
    QRCode.toDataURL(buildUrl(seed, unitId), { width: 220, margin: 1, errorCorrectionLevel: 'M', color: { dark: '#1f2733', light: '#fffefb' } }).then(setQrDataUrl);
  }, [seed, unitId, ready]);

  const replaceUrl = useCallback((nextSeed, nextUnit, nextView) => {
    window.history.replaceState({}, '', buildUrl(nextSeed, nextUnit, nextView));
  }, []);

  function reset(nextSeed, nextUnit = unitId) {
    setSeed(nextSeed); setUnitId(nextUnit); setView('problems'); setAnswers({}); setChecked(false);
    replaceUrl(nextSeed, nextUnit, 'problems');
  }

  function chooseUnit(nextUnit) { reset(createSeed(), nextUnit); }
  function changeView(nextView) { setView(nextView); setChecked(false); replaceUrl(seed, unitId, nextView); }
  function changeAnswer(id, value) { setAnswers((current) => ({ ...current, [id]: value })); setChecked(false); }

  const unitLabel = localizePrimeUnit(unit, language);
  const unitDescription = localizePrimeUnit(unit, language, 'description');

  return <div className="worksheet-app">
    <section className="worksheet-controls no-print" aria-label={tr(language, 'worksheetSettings')}>
      <div><label htmlFor="prime-unit">{tr(language, 'skill')}</label><select id="prime-unit" value={unitId} onChange={(event) => chooseUnit(event.target.value)}>{PRIME_UNITS.map((item) => <option key={item.id} value={item.id}>{localizePrimeUnit(item, language)}</option>)}</select><p>{unitDescription}</p></div>
      <div className="control-actions"><button className="button button-secondary" onClick={() => window.print()}>{tr(language, 'printPdf')}</button><button className="button button-secondary" onClick={() => changeView(view === 'problems' ? 'answers' : 'problems')}>{tr(language, view === 'problems' ? 'answerKey' : 'worksheet')}</button><button className="button button-primary" onClick={() => reset(createSeed())}>{tr(language, 'newWorksheet')}</button></div>
    </section>

    <div className={`worksheet-paper middle-worksheet ${view === 'answers' ? 'answer-sheet' : ''}`}>
      <header className="worksheet-heading"><div className="worksheet-brand"><span className="brand-mark">DAILY</span><strong>{tr(language, 'dailyLab')}</strong></div><div className="worksheet-title"><span>{tr(language, 'grade1Middle')}</span><h2>{unitLabel} {tr(language, view === 'answers' ? 'answerSheet' : 'worksheetWord')}</h2><p>{unitDescription}</p></div><div className="worksheet-identity"><div><span>{tr(language, 'worksheetId')}</span><strong>{seed}</strong><small>{tr(language, 'scanQr')}</small></div>{qrDataUrl ? <img src={qrDataUrl} alt={`Worksheet ${seed} QR code`} /> : null}</div></header>
      <div className="student-row"><span>{tr(language, 'name')}</span><i /><span>{tr(language, 'date')}</span><i /><span className="sheet-kind">{tr(language, view === 'answers' ? 'answers' : 'problems20')}</span></div>
      <section className="problem-grid word-problem-grid prime-problem-grid" aria-label={`${unitLabel} ${foreign ? 'problems' : '문제'}`}>
        {problems.map((item) => {
          const value = answers[item.id] || '';
          const isCorrect = normalizeAnswer(value) === normalizeAnswer(item.answer);
          const selectedChoice = item.choices?.find((choice) => choice.value === item.answer);
          return <article className="vertical-problem word-problem prime-problem" key={item.id}><span className="problem-number">{item.id}</span><div className="word-calculation"><p>{foreign && item.promptEn ? item.promptEn : item.prompt}</p><strong className="word-expression font-mono"><PowerText value={item.expression} /></strong>{item.choices ? <div className="choice-answer">{view === 'answers' ? <strong>{selectedChoice.value}. {foreign ? selectedChoice.labelEn : selectedChoice.label}</strong> : item.choices.map((choice) => <button type="button" key={choice.value} className={`${value === choice.value ? 'selected' : ''} ${checked && value === choice.value ? (isCorrect ? 'correct' : 'wrong') : ''}`} onClick={() => changeAnswer(item.id, choice.value)} aria-pressed={value === choice.value}><span>{choice.value}</span>{foreign ? choice.labelEn : choice.label}</button>)}</div> : <div className="word-answer"><span>{tr(language, 'answer')}</span><span className="inline-answer">{view === 'answers' ? <strong><PowerText value={item.answer} /></strong> : <><input aria-label={`${tr(language, 'answer')} ${item.id}`} value={value} onChange={(event) => changeAnswer(item.id, event.target.value)} className={checked && value ? (isCorrect ? 'correct' : 'wrong') : ''} /><span className="print-answer-space" aria-hidden="true" /></>}</span>{item.answerSuffix ? <em>{item.answerSuffix}</em> : null}</div>}</div>{checked && view === 'problems' && value ? <span className={`result-mark ${isCorrect ? 'correct' : 'wrong'}`}>{tr(language, isCorrect ? 'correct' : 'tryAgain')}</span> : null}</article>;
        })}
      </section>
      <footer className="worksheet-footer"><span>{tr(language, 'dailyLab')}</span><span>{seed} · {tr(language, 'grade1Short')} · {unitLabel}</span></footer>
    </div>

    {view === 'problems' ? <section className="grading-panel no-print"><div><strong>{tr(language, 'solveTablet')}</strong><p>{foreign ? 'Use ^ for exponents, for example 2^3 × 5.' : '거듭제곱은 2^3 × 5처럼 입력하세요. 곱셈은 ×, x, * 모두 사용할 수 있습니다.'}</p></div><button className="button button-primary" onClick={() => setChecked(true)}>{tr(language, 'checkAnswers')}</button>{checked ? <strong className="score">{tr(language, 'score', { count: correctCount })}</strong> : null}</section> : null}
  </div>;
}
