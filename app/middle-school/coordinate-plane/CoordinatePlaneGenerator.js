'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import { COORDINATE_UNITS, findCoordinateUnit, localizeCoordinateUnit } from './catalog';
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

function dedupeKey(item) {
  const planeKey = item.plane ? `${item.plane.points.map((point) => `${point.label}:${point.x}:${point.y}`).join(',')}|${item.plane.highlight}` : '';
  const graphKey = item.graph ? `${item.graph.arrive}:${item.graph.leave}:${item.graph.home}:${item.graph.distance}` : '';
  return `${item.prompt}|${item.expression}|${planeKey}|${graphKey}`;
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
  return String(value).toLowerCase().replace(/−/g, '-').replace(/[()]/g, '').replace(/\s*,\s*/g, ',').replace(/\s+/g, '').trim();
}

function buildUrl(seed, unitId, view = 'problems') {
  const url = new URL(window.location.href);
  url.searchParams.set('sheet', seed);
  url.searchParams.set('unit', unitId);
  if (view === 'answers') url.searchParams.set('view', 'answers');
  else url.searchParams.delete('view');
  return url.toString();
}

function CoordinatePlaneSvg({ plane }) {
  const size = 220;
  const range = 5;
  const margin = 18;
  const scale = (size - margin * 2) / (range * 2);
  const toX = (x) => margin + (x + range) * scale;
  const toY = (y) => size - margin - (y + range) * scale;
  const ticks = [];
  for (let value = -range; value <= range; value += 1) if (value !== 0) ticks.push(value);
  return <svg className="generated-coord-plane" viewBox={`0 0 ${size} ${size}`} role="img" aria-label="좌표평면">
    {ticks.map((value) => <g key={`grid${value}`}>
      <line x1={toX(value)} y1={margin} x2={toX(value)} y2={size - margin} className="grid-line" />
      <line x1={margin} y1={toY(value)} x2={size - margin} y2={toY(value)} className="grid-line" />
    </g>)}
    <line x1={margin} y1={toY(0)} x2={size - margin} y2={toY(0)} className="axis-line" />
    <line x1={toX(0)} y1={margin} x2={toX(0)} y2={size - margin} className="axis-line" />
    <path d={`M${size - margin} ${toY(0)} L${size - margin - 7} ${toY(0) - 4} L${size - margin - 7} ${toY(0) + 4} Z`} />
    <path d={`M${toX(0)} ${margin} L${toX(0) - 4} ${margin + 7} L${toX(0) + 4} ${margin + 7} Z`} />
    <text x={size - margin + 4} y={toY(0) - 5} textAnchor="middle">x</text>
    <text x={toX(0) + 9} y={margin + 3} textAnchor="middle">y</text>
    <text x={toX(0) - 7} y={toY(0) + 12} textAnchor="middle">O</text>
    {plane.points.map((point) => {
      const highlighted = plane.highlight === point.label;
      const anchorRight = point.x >= range - 1;
      return <g key={point.label}>
        <circle cx={toX(point.x)} cy={toY(point.y)} r="3.2" className={highlighted ? 'plane-point highlight' : 'plane-point'} />
        <text x={toX(point.x) + (anchorRight ? -7 : 7)} y={toY(point.y) - 6} textAnchor={anchorRight ? 'end' : 'start'} className={highlighted ? 'plane-label highlight' : 'plane-label'}>{point.label}</text>
      </g>;
    })}
  </svg>;
}

function TripGraphSvg({ graph }) {
  const width = 320;
  const height = 150;
  const marginLeft = 32;
  const marginRight = 16;
  const marginTop = 16;
  const marginBottom = 28;
  const maxTime = graph.home + 15;
  const maxDist = graph.distance + 1;
  const toX = (time) => marginLeft + (time / maxTime) * (width - marginLeft - marginRight);
  const toY = (dist) => height - marginBottom - (dist / maxDist) * (height - marginTop - marginBottom);
  const pathPoints = [[0, 0], [graph.arrive, graph.distance], [graph.leave, graph.distance], [graph.home, 0]];
  const pathD = pathPoints.map(([time, dist], index) => `${index === 0 ? 'M' : 'L'}${toX(time)} ${toY(dist)}`).join(' ');
  return <svg className="generated-trip-graph" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="이동 거리와 시간의 관계 그래프">
    <line x1={marginLeft} y1={height - marginBottom} x2={width - marginRight} y2={height - marginBottom} className="axis-line" />
    <line x1={marginLeft} y1={marginTop} x2={marginLeft} y2={height - marginBottom} className="axis-line" />
    <path d={`M${width - marginRight} ${height - marginBottom} L${width - marginRight - 7} ${height - marginBottom - 4} L${width - marginRight - 7} ${height - marginBottom + 4} Z`} />
    <path d={`M${marginLeft} ${marginTop} L${marginLeft - 4} ${marginTop + 7} L${marginLeft + 4} ${marginTop + 7} Z`} />
    {[graph.arrive, graph.leave].map((time) => <line key={`guide${time}`} x1={toX(time)} y1={toY(graph.distance)} x2={toX(time)} y2={toY(0)} className="guide-line" />)}
    <line x1={toX(0)} y1={toY(graph.distance)} x2={toX(graph.arrive)} y2={toY(graph.distance)} className="guide-line" />
    <path d={pathD} className="trip-line" fill="none" />
    {[graph.arrive, graph.leave, graph.home].map((time) => <text key={`label${time}`} x={toX(time)} y={height - marginBottom + 13} textAnchor="middle">{time}</text>)}
    <text x={marginLeft - 6} y={toY(graph.distance) + 3} textAnchor="end">{graph.distance}</text>
    <text x={marginLeft - 4} y={marginTop - 3} textAnchor="middle">y</text>
    <text x={width - marginRight + 4} y={height - marginBottom - 5} textAnchor="middle">x</text>
  </svg>;
}

export default function CoordinatePlaneGenerator() {
  const { language } = useLanguage();
  const foreign = isNonKorean(language);
  const [unitId, setUnitId] = useState(COORDINATE_UNITS[0].id);
  const [seed, setSeed] = useState('PREVIEW1');
  const [view, setView] = useState('problems');
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialUnit = findCoordinateUnit(params.get('unit')).id;
    const initialSeed = (params.get('sheet') || createSeed()).toUpperCase();
    const initialView = params.get('view') === 'answers' ? 'answers' : 'problems';
    setUnitId(initialUnit); setSeed(initialSeed); setView(initialView);
    window.history.replaceState({}, '', buildUrl(initialSeed, initialUnit, initialView));
    setReady(true);
  }, []);

  const unit = findCoordinateUnit(unitId);
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

  const unitLabel = localizeCoordinateUnit(unit, language);
  const unitDescription = localizeCoordinateUnit(unit, language, 'description');

  return <div className="worksheet-app">
    <section className="worksheet-controls no-print" aria-label={tr(language, 'worksheetSettings')}><div><label htmlFor="coordinate-unit">{tr(language, 'skill')}</label><select id="coordinate-unit" value={unitId} onChange={(event) => chooseUnit(event.target.value)}>{COORDINATE_UNITS.map((item) => <option key={item.id} value={item.id}>{localizeCoordinateUnit(item, language)}</option>)}</select><p>{unitDescription}</p></div><div className="control-actions"><button className="button button-secondary" onClick={() => window.print()}>{tr(language, 'printPdf')}</button><button className="button button-secondary" onClick={() => changeView(view === 'problems' ? 'answers' : 'problems')}>{tr(language, view === 'problems' ? 'answerKey' : 'worksheet')}</button><button className="button button-primary" onClick={() => reset(createSeed())}>{tr(language, 'newWorksheet')}</button></div></section>

    <div className={`worksheet-paper middle-worksheet ${view === 'answers' ? 'answer-sheet' : ''}`}>
      <header className="worksheet-heading"><div className="worksheet-brand"><span className="brand-mark">DAILY</span><strong>{tr(language, 'dailyLab')}</strong></div><div className="worksheet-title"><span>{tr(language, 'grade1Middle')}</span><h2>{unitLabel} {tr(language, view === 'answers' ? 'answerSheet' : 'worksheetWord')}</h2><p>{unitDescription}</p></div><div className="worksheet-identity"><div><span>{tr(language, 'worksheetId')}</span><strong>{seed}</strong><small>{tr(language, 'scanQr')}</small></div>{qrDataUrl ? <img src={qrDataUrl} alt={`Worksheet ${seed} QR code`} /> : null}</div></header>
      <div className="student-row"><span>{tr(language, 'name')}</span><i /><span>{tr(language, 'date')}</span><i /><span className="sheet-kind">{tr(language, view === 'answers' ? 'answers' : 'problems20')}</span></div>
      <section className="problem-grid word-problem-grid prime-problem-grid" aria-label={`${unitLabel} ${foreign ? 'problems' : '문제'}`}>
        {problems.map((item) => {
          const value = answers[item.id] || '';
          const isCorrect = normalizeAnswer(value) === normalizeAnswer(item.answer);
          const prompt = foreign && item.promptEn ? item.promptEn : item.prompt;
          const choices = foreign ? item.choicesEn : item.choicesKo;
          return <article className="vertical-problem word-problem prime-problem" key={item.id}>
            <span className="problem-number">{item.id}</span>
            <div className="word-calculation">
              <p>{prompt}</p>
              {item.kind === 'coordinate-plane' ? <CoordinatePlaneSvg plane={item.plane} /> : null}
              {item.kind === 'trip-graph' ? <TripGraphSvg graph={item.graph} /> : null}
              <div className="word-answer">
                <span>{tr(language, 'answer')}</span>
                {item.kind === 'choice' ? <div className="choice-answer">{view === 'answers' ? <strong>{choices[Number(item.answer) - 1]}</strong> : choices.map((choice, index) => <button type="button" key={choice} className={value === String(index + 1) ? 'selected' : ''} onClick={() => changeAnswer(item.id, String(index + 1))}>{choice}</button>)}</div> : <span className="inline-answer">{view === 'answers' ? <strong>{item.answer}</strong> : <><input aria-label={`${tr(language, 'answer')} ${item.id}`} value={value} onChange={(event) => changeAnswer(item.id, event.target.value)} className={checked && value ? (isCorrect ? 'correct' : 'wrong') : ''} /><span className="print-answer-space" aria-hidden="true" /></>}</span>}
                {item.answerSuffix && !foreign ? <em>{item.answerSuffix}</em> : null}
              </div>
            </div>
            {checked && view === 'problems' && value ? <span className={`result-mark ${isCorrect ? 'correct' : 'wrong'}`}>{tr(language, isCorrect ? 'correct' : 'tryAgain')}</span> : null}
          </article>;
        })}
      </section>
      <footer className="worksheet-footer"><span>{tr(language, 'dailyLab')}</span><span>{seed} · {tr(language, 'grade1Short')} · {unitLabel}</span></footer>
    </div>

    {view === 'problems' ? <section className="grading-panel no-print"><div><strong>{tr(language, 'solveTablet')}</strong><p>{foreign ? 'Write a coordinate as (x, y). For a labeled point, type its letter.' : '좌표는 (x, y) 형태로 입력하고, 점의 기호를 물으면 알파벳을 입력하세요.' }</p></div><button className="button button-primary" onClick={() => setChecked(true)}>{tr(language, 'checkAnswers')}</button>{checked ? <strong className="score">{tr(language, 'score', { count: correctCount })}</strong> : null}</section> : null}
  </div>;
}
