'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import { findIntegerRationalUnit, INTEGER_RATIONAL_UNITS, localizeIntegerRationalUnit } from './catalog';
import { useLanguage } from '../../language';
import { isNonKorean, tr } from '../../i18n';

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

function makeProblems(seed, unit) {
  const random = seededRandom(`${seed}:${unit.id}`);
  const used = new Set();
  return Array.from({ length: PROBLEM_COUNT }, (_, index) => {
    let item;
    let attempt = 0;
    do { item = unit.make(random); attempt += 1; } while (used.has(`${item.prompt}|${item.expression}|${item.line ? `${item.line.min}:${item.line.step}:${item.line.value}` : ''}`) && attempt < 80);
    used.add(`${item.prompt}|${item.expression}|${item.line ? `${item.line.min}:${item.line.step}:${item.line.value}` : ''}`);
    return { id: index + 1, ...item };
  });
}

function normalizeAnswer(value) {
  return String(value).toLowerCase().replace(/−/g, '-').replace(/\s*([,<>≤≥=])\s*/g, '$1').replace(/\s+/g, '').trim();
}

function parseRationalAnswer(value) {
  const text = String(value).replace(/−/g, '-').replace(/\s+/g, '').trim();
  const fraction = text.match(/^([+-]?\d+)\/(\d+)$/);
  if (fraction && Number(fraction[2]) !== 0) return { n: Number(fraction[1]), d: Number(fraction[2]) };
  const decimal = text.match(/^([+-]?\d+)(?:\.(\d+))?$/);
  if (!decimal) return null;
  const places = decimal[2]?.length || 0;
  const denominator = 10 ** places;
  return { n: Math.round(Number(text) * denominator), d: denominator };
}

function answersEquivalent(left, right) {
  const parsedLeft = parseRationalAnswer(left);
  const parsedRight = parseRationalAnswer(right);
  if (parsedLeft && parsedRight) return parsedLeft.n * parsedRight.d === parsedRight.n * parsedLeft.d;
  return normalizeAnswer(left) === normalizeAnswer(right);
}

function buildUrl(seed, unitId, view = 'problems') {
  const url = new URL(window.location.href);
  url.searchParams.set('sheet', seed);
  url.searchParams.set('unit', unitId);
  if (view === 'answers') url.searchParams.set('view', 'answers');
  else url.searchParams.delete('view');
  return url.toString();
}

function RationalText({ value }) {
  const parts = String(value).split(/([+-]?\d+\/\d+|\^\d+)/g);
  return <>{parts.map((part, index) => {
    if (part.startsWith('^')) return <sup key={index}>{part.slice(1)}</sup>;
    const match = part.match(/^([+-]?)(\d+)\/(\d+)$/);
    if (!match) return <span key={index}>{part}</span>;
    return <span key={index} className="signed-fraction"><span>{match[1]}</span><span className="stacked-fraction"><span className="fraction-numerator">{match[2]}</span><span className="fraction-denominator">{match[3]}</span></span></span>;
  })}</>;
}

function NumberLine({ line }) {
  const width = 320;
  const left = 22;
  const right = width - 22;
  const count = Math.round((line.max - line.min) / line.step);
  const xFor = (value) => left + ((value - line.min) / (line.max - line.min)) * (right - left);
  const labelValues = new Set([line.min, 0, line.max]);
  return <svg className="generated-number-line" viewBox="0 0 320 78" role="img" aria-label={`점 ${line.label}의 위치를 나타낸 수직선`}>
    <line x1="12" y1="42" x2="308" y2="42" />
    <path d="M12 42 L20 38 L20 46 Z" /><path d="M308 42 L300 38 L300 46 Z" />
    {Array.from({ length: count + 1 }, (_, index) => {
      const value = line.min + index * line.step;
      const x = xFor(value);
      return <g key={index}><line x1={x} y1="36" x2={x} y2="48" />{labelValues.has(value) ? <text x={x} y="64">{value}</text> : null}</g>;
    })}
    <circle cx={xFor(line.value)} cy="42" r="4" /><text className="point-label" x={xFor(line.value)} y="28">{line.label}</text>
  </svg>;
}

export default function IntegerRationalGenerator() {
  const { language } = useLanguage();
  const foreign = isNonKorean(language);
  const [unitId, setUnitId] = useState(INTEGER_RATIONAL_UNITS[0].id);
  const [seed, setSeed] = useState('PREVIEW1');
  const [view, setView] = useState('problems');
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialUnit = findIntegerRationalUnit(params.get('unit')).id;
    const initialSeed = (params.get('sheet') || createSeed()).toUpperCase();
    const initialView = params.get('view') === 'answers' ? 'answers' : 'problems';
    setUnitId(initialUnit); setSeed(initialSeed); setView(initialView);
    window.history.replaceState({}, '', buildUrl(initialSeed, initialUnit, initialView));
    setReady(true);
  }, []);

  const unit = findIntegerRationalUnit(unitId);
  const problems = useMemo(() => makeProblems(seed, unit), [seed, unit]);
  const correctCount = problems.filter((item) => answersEquivalent(answers[item.id], item.answer)).length;

  useEffect(() => {
    if (!ready) return;
    QRCode.toDataURL(buildUrl(seed, unitId), { width: 220, margin: 1, errorCorrectionLevel: 'M', color: { dark: '#1f2733', light: '#fffefb' } }).then(setQrDataUrl);
  }, [seed, unitId, ready]);

  const replaceUrl = useCallback((nextSeed, nextUnit, nextView) => window.history.replaceState({}, '', buildUrl(nextSeed, nextUnit, nextView)), []);
  function reset(nextSeed, nextUnit = unitId) { setSeed(nextSeed); setUnitId(nextUnit); setView('problems'); setAnswers({}); setChecked(false); replaceUrl(nextSeed, nextUnit, 'problems'); }
  function chooseUnit(nextUnit) { reset(createSeed(), nextUnit); }
  function changeView(nextView) { setView(nextView); setChecked(false); replaceUrl(seed, unitId, nextView); }
  function changeAnswer(id, value) { setAnswers((current) => ({ ...current, [id]: value })); setChecked(false); }

  const unitLabel = localizeIntegerRationalUnit(unit, language);
  const unitDescription = localizeIntegerRationalUnit(unit, language, 'description');

  return <div className="worksheet-app">
    <section className="worksheet-controls no-print" aria-label={tr(language, 'worksheetSettings')}><div><label htmlFor="integer-rational-unit">{tr(language, 'skill')}</label><select id="integer-rational-unit" value={unitId} onChange={(event) => chooseUnit(event.target.value)}>{INTEGER_RATIONAL_UNITS.map((item) => <option key={item.id} value={item.id}>{localizeIntegerRationalUnit(item, language)}</option>)}</select><p>{unitDescription}</p></div><div className="control-actions"><button className="button button-secondary" onClick={() => window.print()}>{tr(language, 'printPdf')}</button><button className="button button-secondary" onClick={() => changeView(view === 'problems' ? 'answers' : 'problems')}>{tr(language, view === 'problems' ? 'answerKey' : 'worksheet')}</button><button className="button button-primary" onClick={() => reset(createSeed())}>{tr(language, 'newWorksheet')}</button></div></section>

    <div className={`worksheet-paper middle-worksheet ${view === 'answers' ? 'answer-sheet' : ''}`}>
      <header className="worksheet-heading"><div className="worksheet-brand"><span className="brand-mark">DAILY</span><strong>{tr(language, 'dailyLab')}</strong></div><div className="worksheet-title"><span>{tr(language, 'grade1Middle')}</span><h2>{unitLabel} {tr(language, view === 'answers' ? 'answerSheet' : 'worksheetWord')}</h2><p>{unitDescription}</p></div><div className="worksheet-identity"><div><span>{tr(language, 'worksheetId')}</span><strong>{seed}</strong><small>{tr(language, 'scanQr')}</small></div>{qrDataUrl ? <img src={qrDataUrl} alt={`Worksheet ${seed} QR code`} /> : null}</div></header>
      <div className="student-row"><span>{tr(language, 'name')}</span><i /><span>{tr(language, 'date')}</span><i /><span className="sheet-kind">{tr(language, view === 'answers' ? 'answers' : 'problems20')}</span></div>
      <section className="problem-grid word-problem-grid prime-problem-grid" aria-label={`${unitLabel} ${foreign ? 'problems' : '문제'}`}>
        {problems.map((item) => {
          const value = answers[item.id] || '';
          const isCorrect = answersEquivalent(value, item.answer);
          const prompt = foreign && item.promptEn ? item.promptEn : item.prompt;
          const expression = foreign && item.expressionEn ? item.expressionEn : item.expression;
          return <article className="vertical-problem word-problem prime-problem" key={item.id}><span className="problem-number">{item.id}</span><div className="word-calculation"><p>{prompt}</p>{item.kind === 'number-line' ? <NumberLine line={item.line} /> : expression ? <strong className="word-expression font-mono"><RationalText value={expression} /></strong> : null}<div className="word-answer"><span>{tr(language, 'answer')}</span><span className="inline-answer">{view === 'answers' ? <strong><RationalText value={item.answer} /></strong> : <><input aria-label={`${tr(language, 'answer')} ${item.id}`} value={value} onChange={(event) => changeAnswer(item.id, event.target.value)} className={checked && value ? (isCorrect ? 'correct' : 'wrong') : ''} /><span className="print-answer-space" aria-hidden="true" /></>}</span>{item.answerSuffix && !foreign ? <em>{item.answerSuffix}</em> : null}</div></div>{checked && view === 'problems' && value ? <span className={`result-mark ${isCorrect ? 'correct' : 'wrong'}`}>{tr(language, isCorrect ? 'correct' : 'tryAgain')}</span> : null}</article>;
        })}
      </section>
      <footer className="worksheet-footer"><span>{tr(language, 'dailyLab')}</span><span>{seed} · {tr(language, 'grade1Short')} · {unitLabel}</span></footer>
    </div>

    {view === 'problems' ? <section className="grading-panel no-print"><div><strong>{tr(language, 'solveTablet')}</strong><p>{foreign ? 'Separate multiple answers with commas. Enter fractions as -3/4.' : '답이 여러 개이면 쉼표로 구분하고, 분수는 -3/4처럼 입력하세요.'}</p></div><button className="button button-primary" onClick={() => setChecked(true)}>{tr(language, 'checkAnswers')}</button>{checked ? <strong className="score">{tr(language, 'score', { count: correctCount })}</strong> : null}</section> : null}
  </div>;
}
