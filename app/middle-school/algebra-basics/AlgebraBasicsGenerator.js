'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import { ALGEBRA_UNITS, findAlgebraUnit, localizeAlgebraUnit } from './catalog';
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

function makeProblems(seed, unit) {
  const random = seededRandom(`${seed}:${unit.id}`);
  const used = new Set();
  return Array.from({ length: PROBLEM_COUNT }, (_, index) => {
    let item;
    let attempt = 0;
    do { item = unit.make(random); attempt += 1; } while (used.has(`${item.prompt}|${item.expression}`) && attempt < 100);
    used.add(`${item.prompt}|${item.expression}`);
    return { id: index + 1, ...item };
  });
}

function normalizeAnswer(value) {
  return String(value).toLowerCase().replace(/−/g, '-').replace(/[×*]/g, '').replace(/\s+/g, '').replace(/\+\-/g, '-').trim();
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

export default function AlgebraBasicsGenerator() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const foreign = isNonKorean(language);
  const [unitId, setUnitId] = useState(ALGEBRA_UNITS[0].id);
  const [seed, setSeed] = useState('PREVIEW1');
  const [view, setView] = useState('problems');
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialUnit = findAlgebraUnit(params.get('unit')).id;
    const initialSeed = (params.get('sheet') || createSeed()).toUpperCase();
    const initialView = params.get('view') === 'answers' ? 'answers' : 'problems';
    setUnitId(initialUnit); setSeed(initialSeed); setView(initialView);
    window.history.replaceState({}, '', buildUrl(initialSeed, initialUnit, initialView));
    setReady(true);
  }, []);

  const unit = findAlgebraUnit(unitId);
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

  function checkAnswers() {
    setChecked(true);
    recordAttempts(user, problems
      .filter((item) => answers[item.id] !== undefined && answers[item.id] !== '')
      .map((item) => ({
        grade: 'middle-1',
        unit: unit.id,
        problemType: item.kind === 'choice' ? 'mcq' : 'short',
        isCorrect: answersEquivalent(answers[item.id], item.answer),
        answer: answers[item.id],
      })));
  }

  const unitLabel = localizeAlgebraUnit(unit, language);
  const unitDescription = localizeAlgebraUnit(unit, language, 'description');

  return <div className="worksheet-app">
    <section className="worksheet-controls no-print" aria-label={tr(language, 'worksheetSettings')}><div><label htmlFor="algebra-unit">{tr(language, 'skill')}</label><select id="algebra-unit" value={unitId} onChange={(event) => chooseUnit(event.target.value)}>{ALGEBRA_UNITS.map((item) => <option key={item.id} value={item.id}>{localizeAlgebraUnit(item, language)}</option>)}</select><p>{unitDescription}</p></div><div className="control-actions"><button className="button button-secondary" onClick={() => window.print()}>{tr(language, 'printPdf')}</button><button className="button button-secondary" onClick={() => changeView(view === 'problems' ? 'answers' : 'problems')}>{tr(language, view === 'problems' ? 'answerKey' : 'worksheet')}</button><button className="button button-primary" onClick={() => reset(createSeed())}>{tr(language, 'newWorksheet')}</button></div></section>

    <div className={`worksheet-paper middle-worksheet ${view === 'answers' ? 'answer-sheet' : ''}`}>
      <header className="worksheet-heading"><div className="worksheet-brand"><span className="brand-mark">DAILY</span><strong>{tr(language, 'dailyLab')}</strong></div><div className="worksheet-title"><span>{tr(language, 'grade1Middle')}</span><h2>{unitLabel} {tr(language, view === 'answers' ? 'answerSheet' : 'worksheetWord')}</h2><p>{unitDescription}</p></div><div className="worksheet-identity"><div><span>{tr(language, 'worksheetId')}</span><strong>{seed}</strong><small>{tr(language, 'scanQr')}</small></div>{qrDataUrl ? <img src={qrDataUrl} alt={`Worksheet ${seed} QR code`} /> : null}</div></header>
      <div className="student-row"><span>{tr(language, 'name')}</span><i /><span>{tr(language, 'date')}</span><i /><span className="sheet-kind">{tr(language, view === 'answers' ? 'answers' : 'problems20')}</span></div>
      <section className="problem-grid word-problem-grid prime-problem-grid" aria-label={`${unitLabel} ${foreign ? 'problems' : '문제'}`}>
        {problems.map((item) => {
          const value = answers[item.id] || '';
          const isCorrect = answersEquivalent(value, item.answer);
          const prompt = foreign && item.promptEn ? item.promptEn : item.prompt;
          const choices = foreign ? item.choicesEn : item.choicesKo;
          const suffix = foreign ? (item.answerSuffixEn || (item.answerSuffix === '개' ? '' : item.answerSuffix)) : item.answerSuffix;
          return <article className="vertical-problem word-problem prime-problem" key={item.id}><span className="problem-number">{item.id}</span><div className="word-calculation"><p><MathText value={prompt} /></p>{item.expression ? <strong className="word-expression font-mono"><MathText value={item.expression} /></strong> : null}<div className="word-answer"><span>{tr(language, 'answer')}</span>{item.kind === 'choice' ? <div className="choice-answer">{view === 'answers' ? <strong>{choices[Number(item.answer) - 1]}</strong> : choices.map((choice, index) => <button type="button" key={choice} className={value === String(index + 1) ? 'selected' : ''} onClick={() => changeAnswer(item.id, String(index + 1))}>{choice}</button>)}</div> : <span className="inline-answer">{view === 'answers' ? <strong><MathText value={item.answer} /></strong> : <><input aria-label={`${tr(language, 'answer')} ${item.id}`} value={value} onChange={(event) => changeAnswer(item.id, event.target.value)} className={checked && value ? (isCorrect ? 'correct' : 'wrong') : ''} /><span className="print-answer-space" aria-hidden="true" /></>}</span>}{suffix ? <em>{suffix}</em> : null}</div></div>{checked && view === 'problems' && value ? <span className={`result-mark ${isCorrect ? 'correct' : 'wrong'}`}>{tr(language, isCorrect ? 'correct' : 'tryAgain')}</span> : null}</article>;
        })}
      </section>
      <footer className="worksheet-footer"><span className="worksheet-signature">Built &amp; Designed by Chae</span><span>{tr(language, 'dailyLab')}</span><span>{seed} · {tr(language, 'grade1Short')} · {unitLabel}</span></footer>
    </div>

    {view === 'problems' ? <section className="grading-panel no-print"><div><strong>{tr(language, 'solveTablet')}</strong><p>{foreign ? 'Use x for variables and / for fractions. Equivalent numerical answers are accepted.' : '문자는 x, 분수는 /를 사용해 입력하세요. 값이 같은 수는 정답으로 인정됩니다.'}</p></div><button className="button button-primary" onClick={checkAnswers}>{tr(language, 'checkAnswers')}</button>{checked ? <strong className="score">{tr(language, 'score', { count: correctCount })}</strong> : null}</section> : null}
  </div>;
}
