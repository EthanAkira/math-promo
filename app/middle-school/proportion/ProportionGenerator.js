'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import { PROPORTION_UNITS, findProportionUnit, localizeProportionUnit } from './catalog';
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

function makeProblems(seed, unit) {
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

function normalizeAnswer(value) {
  return String(value).toLowerCase().replace(/−/g, '-').replace(/\s*=\s*/g, '=').replace(/×/g, '').replace(/\s+/g, '').trim();
}

function buildUrl(seed, unitId, view = 'problems') {
  const url = new URL(window.location.href);
  url.searchParams.set('sheet', seed);
  url.searchParams.set('unit', unitId);
  if (view === 'answers') url.searchParams.set('view', 'answers');
  else url.searchParams.delete('view');
  return url.toString();
}

const ProportionText = MathText;

function ProportionGraphSvg({ graph }) {
  const width = 200;
  const height = 200;
  const margin = 20;
  const range = graph.range;
  const toX = (x) => width / 2 + (x / range) * (width / 2 - margin);
  const toY = (y) => height / 2 - (y / range) * (height / 2 - margin);
  let curveD;
  if (graph.mode === 'direct') {
    const slope = graph.a.n / graph.a.d;
    const xBound = slope === 0 ? range : Math.min(range, range / Math.abs(slope));
    curveD = `M${toX(-xBound)} ${toY(-slope * xBound)} L${toX(xBound)} ${toY(slope * xBound)}`;
  } else {
    const a = graph.a;
    const minX = Math.abs(a) / range;
    const steps = 26;
    const branch = Array.from({ length: steps + 1 }, (_, index) => {
      const x = minX + (range - minX) * (index / steps);
      return [x, a / x];
    });
    const posPath = branch.map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${toX(x)} ${toY(y)}`).join(' ');
    const negPath = branch.map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${toX(-x)} ${toY(-y)}`).join(' ');
    curveD = `${posPath} ${negPath}`;
  }
  const { x: px, y: py } = graph.point;
  return <svg className="generated-proportion-graph" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="정비례 또는 반비례 관계의 그래프">
    <line x1={margin} y1={toY(0)} x2={width - margin} y2={toY(0)} className="axis-line" />
    <line x1={toX(0)} y1={margin} x2={toX(0)} y2={height - margin} className="axis-line" />
    <path d={`M${width - margin} ${toY(0)} L${width - margin - 7} ${toY(0) - 4} L${width - margin - 7} ${toY(0) + 4} Z`} />
    <path d={`M${toX(0)} ${margin} L${toX(0) - 4} ${margin + 7} L${toX(0) + 4} ${margin + 7} Z`} />
    <path d={curveD} className="proportion-curve" fill="none" />
    <line x1={toX(px)} y1={toY(py)} x2={toX(px)} y2={toY(0)} className="guide-line" />
    <line x1={toX(px)} y1={toY(py)} x2={toX(0)} y2={toY(py)} className="guide-line" />
    <circle cx={toX(px)} cy={toY(py)} r="3.2" className="proportion-point" />
    <text x={toX(px)} y={toY(0) + 13} textAnchor="middle">{px}</text>
    <text x={toX(0) - 7} y={toY(py) + 3} textAnchor="end">{py}</text>
    <text x={toX(0) - 7} y={toY(0) + 12} textAnchor="middle">O</text>
    <text x={width - margin + 5} y={toY(0) - 5} textAnchor="middle">x</text>
    <text x={toX(0) + 8} y={margin + 3} textAnchor="middle">y</text>
  </svg>;
}

export default function ProportionGenerator() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const foreign = isNonKorean(language);
  const [unitId, setUnitId] = useState(PROPORTION_UNITS[0].id);
  const [seed, setSeed] = useState('PREVIEW1');
  const [view, setView] = useState('problems');
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialUnit = findProportionUnit(params.get('unit')).id;
    const initialSeed = (params.get('sheet') || createSeed()).toUpperCase();
    const initialView = params.get('view') === 'answers' ? 'answers' : 'problems';
    setUnitId(initialUnit); setSeed(initialSeed); setView(initialView);
    window.history.replaceState({}, '', buildUrl(initialSeed, initialUnit, initialView));
    setReady(true);
  }, []);

  const unit = findProportionUnit(unitId);
  const problems = useMemo(() => makeProblems(seed, unit), [seed, unit]);
  const correctCount = problems.filter((item) => normalizeAnswer(answers[item.id]) === normalizeAnswer(item.answer)).length;

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
        isCorrect: normalizeAnswer(answers[item.id]) === normalizeAnswer(item.answer),
        answer: answers[item.id],
      })));
  }

  const unitLabel = localizeProportionUnit(unit, language);
  const unitDescription = localizeProportionUnit(unit, language, 'description');

  return <div className="worksheet-app">
    <section className="worksheet-controls no-print" aria-label={tr(language, 'worksheetSettings')}><div><label htmlFor="proportion-unit">{tr(language, 'skill')}</label><select id="proportion-unit" value={unitId} onChange={(event) => chooseUnit(event.target.value)}>{PROPORTION_UNITS.map((item) => <option key={item.id} value={item.id}>{localizeProportionUnit(item, language)}</option>)}</select><p>{unitDescription}</p></div><div className="control-actions"><button className="button button-secondary" onClick={() => window.print()}>{tr(language, 'printPdf')}</button><button className="button button-secondary" onClick={() => changeView(view === 'problems' ? 'answers' : 'problems')}>{tr(language, view === 'problems' ? 'answerKey' : 'worksheet')}</button><button className="button button-primary" onClick={() => reset(createSeed())}>{tr(language, 'newWorksheet')}</button></div></section>

    <div className={`worksheet-paper middle-worksheet ${view === 'answers' ? 'answer-sheet' : ''}`}>
      <header className="worksheet-heading"><div className="worksheet-brand"><span className="brand-mark">DAILY</span><strong>{tr(language, 'dailyLab')}</strong></div><div className="worksheet-title"><span>{tr(language, 'grade1Middle')}</span><h2>{unitLabel} {tr(language, view === 'answers' ? 'answerSheet' : 'worksheetWord')}</h2><p>{unitDescription}</p></div><div className="worksheet-identity"><div><span>{tr(language, 'worksheetId')}</span><strong>{seed}</strong><small>{tr(language, 'scanQr')}</small></div>{qrDataUrl ? <img src={qrDataUrl} alt={`Worksheet ${seed} QR code`} /> : null}</div></header>
      <div className="student-row"><span>{tr(language, 'name')}</span><i /><span>{tr(language, 'date')}</span><i /><span className="sheet-kind">{tr(language, view === 'answers' ? 'answers' : 'problems20')}</span></div>
      <section className="problem-grid word-problem-grid prime-problem-grid" aria-label={`${unitLabel} ${foreign ? 'problems' : '문제'}`}>
        {problems.map((item) => {
          const value = answers[item.id] || '';
          const isCorrect = normalizeAnswer(value) === normalizeAnswer(item.answer);
          const prompt = foreign && item.promptEn ? item.promptEn : item.prompt;
          const choices = foreign ? item.choicesEn : item.choicesKo;
          const graphic = item.kind === 'proportion-graph';
          return <article className={`vertical-problem word-problem prime-problem${graphic ? ' graphic-problem' : ''}`} key={item.id}>
            <span className="problem-number">{item.id}</span>
            <div className="word-calculation">
              <p>{prompt}</p>
              {item.expression ? <strong className="word-expression font-mono"><ProportionText value={item.expression} /></strong> : null}
              {item.kind === 'proportion-graph' ? <ProportionGraphSvg graph={item.graph} /> : null}
              <div className="word-answer">
                <span>{tr(language, 'answer')}</span>
                {item.kind === 'choice' ? <div className="choice-answer">{view === 'answers' ? <strong>{choices[Number(item.answer) - 1]}</strong> : choices.map((choice, index) => <button type="button" key={choice} className={value === String(index + 1) ? 'selected' : ''} onClick={() => changeAnswer(item.id, String(index + 1))}>{choice}</button>)}</div> : <span className="inline-answer">{view === 'answers' ? <strong><ProportionText value={item.answer} /></strong> : <><input aria-label={`${tr(language, 'answer')} ${item.id}`} value={value} onChange={(event) => changeAnswer(item.id, event.target.value)} className={checked && value ? (isCorrect ? 'correct' : 'wrong') : ''} /><span className="print-answer-space" aria-hidden="true" /></>}</span>}
                {item.answerSuffix && !foreign ? <em>{item.answerSuffix}</em> : null}
              </div>
            </div>
            {checked && view === 'problems' && value ? <span className={`result-mark ${isCorrect ? 'correct' : 'wrong'}`}>{tr(language, isCorrect ? 'correct' : 'tryAgain')}</span> : null}
          </article>;
        })}
      </section>
      <footer className="worksheet-footer"><span className="worksheet-signature">Built &amp; Designed by Chae</span><span>{tr(language, 'dailyLab')}</span><span>{seed} · {tr(language, 'grade1Short')} · {unitLabel}</span></footer>
    </div>

    {view === 'problems' ? <section className="grading-panel no-print"><div><strong>{tr(language, 'solveTablet')}</strong><p>{foreign ? 'Write equations as y=3x or y=6/x. Enter fractions as -3/4.' : '관계식은 y=3x, y=6/x처럼 입력하고, 분수는 -3/4처럼 입력하세요.'}</p></div><button className="button button-primary" onClick={checkAnswers}>{tr(language, 'checkAnswers')}</button>{checked ? <strong className="score">{tr(language, 'score', { count: correctCount })}</strong> : null}</section> : null}
  </div>;
}
