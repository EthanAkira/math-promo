'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import { findIntegerRationalUnit, INTEGER_RATIONAL_UNITS, localizeIntegerRationalUnit } from './catalog';
import { useLanguage } from '../../language';

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

function buildUrl(seed, unitId, view = 'problems') {
  const url = new URL(window.location.href);
  url.searchParams.set('sheet', seed);
  url.searchParams.set('unit', unitId);
  if (view === 'answers') url.searchParams.set('view', 'answers');
  else url.searchParams.delete('view');
  return url.toString();
}

function RationalText({ value }) {
  const parts = String(value).split(/([+-]?\d+\/\d+)/g);
  return <>{parts.map((part, index) => {
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
  const en = language === 'en';
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

  const unitLabel = localizeIntegerRationalUnit(unit, language);
  const unitDescription = localizeIntegerRationalUnit(unit, language, 'description');

  return <div className="worksheet-app">
    <section className="worksheet-controls no-print" aria-label={en ? 'Worksheet settings' : '문제지 설정'}><div><label htmlFor="integer-rational-unit">{en ? 'Skill' : '문제 유형'}</label><select id="integer-rational-unit" value={unitId} onChange={(event) => chooseUnit(event.target.value)}>{INTEGER_RATIONAL_UNITS.map((item) => <option key={item.id} value={item.id}>{localizeIntegerRationalUnit(item, language)}</option>)}</select><p>{unitDescription}</p></div><div className="control-actions"><button className="button button-secondary" onClick={() => window.print()}>{en ? 'Print / PDF' : '인쇄 / PDF'}</button><button className="button button-secondary" onClick={() => changeView(view === 'problems' ? 'answers' : 'problems')}>{view === 'problems' ? (en ? 'Answer key' : '답지 보기') : (en ? 'Worksheet' : '문제지 보기')}</button><button className="button button-primary" onClick={() => reset(createSeed())}>{en ? 'New worksheet' : '새 문제지'}</button></div></section>

    <div className={`worksheet-paper middle-worksheet ${view === 'answers' ? 'answer-sheet' : ''}`}>
      <header className="worksheet-heading"><div className="worksheet-brand"><span className="brand-mark">{en ? 'DAILY' : '매일'}</span><strong>{en ? 'LEARNING LAB' : '배움 연구소'}</strong></div><div className="worksheet-title"><span>{en ? 'Middle School 1' : '중학교 1학년'}</span><h2>{unitLabel} {view === 'answers' ? (en ? 'Answer Key' : '정답지') : (en ? 'Worksheet' : '문제지')}</h2><p>{unitDescription}</p></div><div className="worksheet-identity"><div><span>{en ? 'Worksheet ID' : '문제지 번호'}</span><strong>{seed}</strong><small>{en ? 'Scan to reopen this worksheet.' : 'QR을 스캔하면 같은 문제를 다시 열 수 있어요.'}</small></div>{qrDataUrl ? <img src={qrDataUrl} alt={`Worksheet ${seed} QR code`} /> : null}</div></header>
      <div className="student-row"><span>{en ? 'Name' : '이름'}</span><i /><span>{en ? 'Date' : '날짜'}</span><i /><span className="sheet-kind">{view === 'answers' ? (en ? 'Answers' : '정답') : (en ? '20 problems' : '20문제')}</span></div>
      <section className="problem-grid word-problem-grid prime-problem-grid" aria-label={`${unitLabel} ${en ? 'problems' : '문제'}`}>
        {problems.map((item) => {
          const value = answers[item.id] || '';
          const isCorrect = normalizeAnswer(value) === normalizeAnswer(item.answer);
          return <article className="vertical-problem word-problem prime-problem" key={item.id}><span className="problem-number">{item.id}</span><div className="word-calculation"><p>{item.prompt}</p>{item.kind === 'number-line' ? <NumberLine line={item.line} /> : item.expression ? <strong className="word-expression font-mono"><RationalText value={item.expression} /></strong> : null}<div className="word-answer"><span>{en ? 'Answer' : '답'}</span><span className="inline-answer">{view === 'answers' ? <strong><RationalText value={item.answer} /></strong> : <><input aria-label={en ? `Answer ${item.id}` : `${item.id}번 답`} value={value} onChange={(event) => changeAnswer(item.id, event.target.value)} className={checked && value ? (isCorrect ? 'correct' : 'wrong') : ''} /><span className="print-answer-space" aria-hidden="true" /></>}</span>{item.answerSuffix ? <em>{item.answerSuffix}</em> : null}</div></div>{checked && view === 'problems' && value ? <span className={`result-mark ${isCorrect ? 'correct' : 'wrong'}`}>{isCorrect ? (en ? 'Correct' : '맞았어요') : (en ? 'Try again' : '다시 풀기')}</span> : null}</article>;
        })}
      </section>
      <footer className="worksheet-footer"><span>{en ? 'Daily Learning Lab' : '매일 배움 연구소'}</span><span>{seed} · {en ? 'Middle School 1' : '중1'} · {unitLabel}</span></footer>
    </div>

    {view === 'problems' ? <section className="grading-panel no-print"><div><strong>{en ? 'Solve directly on a tablet' : '태블릿으로 바로 풀기'}</strong><p>{en ? 'Separate multiple answers with commas. Fractions may be entered as -3/4.' : '답이 여러 개이면 쉼표로 구분하고, 분수는 -3/4처럼 입력하세요.'}</p></div><button className="button button-primary" onClick={() => setChecked(true)}>{en ? 'Check answers' : '채점하기'}</button>{checked ? <strong className="score">{en ? `${correctCount} of 20 correct` : `20문제 중 ${correctCount}문제 정답`}</strong> : null}</section> : null}
  </div>;
}
