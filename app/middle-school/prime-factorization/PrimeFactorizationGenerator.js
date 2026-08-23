'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import { findPrimeUnit, localizePrimeUnit, PRIME_UNITS } from './catalog';
import { useLanguage } from '../../language';

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
  const en = language === 'en';
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
    <section className="worksheet-controls no-print" aria-label={en ? 'Worksheet settings' : '문제지 설정'}>
      <div><label htmlFor="prime-unit">{en ? 'Skill' : '문제 유형'}</label><select id="prime-unit" value={unitId} onChange={(event) => chooseUnit(event.target.value)}>{PRIME_UNITS.map((item) => <option key={item.id} value={item.id}>{localizePrimeUnit(item, language)}</option>)}</select><p>{unitDescription}</p></div>
      <div className="control-actions"><button className="button button-secondary" onClick={() => window.print()}>{en ? 'Print / PDF' : '인쇄 / PDF'}</button><button className="button button-secondary" onClick={() => changeView(view === 'problems' ? 'answers' : 'problems')}>{view === 'problems' ? (en ? 'Answer key' : '답지 보기') : (en ? 'Worksheet' : '문제지 보기')}</button><button className="button button-primary" onClick={() => reset(createSeed())}>{en ? 'New worksheet' : '새 문제지'}</button></div>
    </section>

    <div className={`worksheet-paper middle-worksheet ${view === 'answers' ? 'answer-sheet' : ''}`}>
      <header className="worksheet-heading"><div className="worksheet-brand"><span className="brand-mark">{en ? 'DAILY' : '매일'}</span><strong>{en ? 'LEARNING LAB' : '배움 연구소'}</strong></div><div className="worksheet-title"><span>{en ? 'Middle School 1' : '중학교 1학년'}</span><h2>{unitLabel} {view === 'answers' ? (en ? 'Answer Key' : '정답지') : (en ? 'Worksheet' : '문제지')}</h2><p>{unitDescription}</p></div><div className="worksheet-identity"><div><span>{en ? 'Worksheet ID' : '문제지 번호'}</span><strong>{seed}</strong><small>{en ? 'Scan to reopen this worksheet.' : 'QR을 스캔하면 같은 문제를 다시 열 수 있어요.'}</small></div>{qrDataUrl ? <img src={qrDataUrl} alt={`Worksheet ${seed} QR code`} /> : null}</div></header>
      <div className="student-row"><span>{en ? 'Name' : '이름'}</span><i /><span>{en ? 'Date' : '날짜'}</span><i /><span className="sheet-kind">{view === 'answers' ? (en ? 'Answers' : '정답') : (en ? '20 problems' : '20문제')}</span></div>
      <section className="problem-grid word-problem-grid prime-problem-grid" aria-label={`${unitLabel} ${en ? 'problems' : '문제'}`}>
        {problems.map((item) => {
          const value = answers[item.id] || '';
          const isCorrect = normalizeAnswer(value) === normalizeAnswer(item.answer);
          const selectedChoice = item.choices?.find((choice) => choice.value === item.answer);
          return <article className="vertical-problem word-problem prime-problem" key={item.id}><span className="problem-number">{item.id}</span><div className="word-calculation"><p>{en && item.promptEn ? item.promptEn : item.prompt}</p><strong className="word-expression font-mono"><PowerText value={item.expression} /></strong>{item.choices ? <div className="choice-answer">{view === 'answers' ? <strong>{selectedChoice.value}. {en ? selectedChoice.labelEn : selectedChoice.label}</strong> : item.choices.map((choice) => <button type="button" key={choice.value} className={`${value === choice.value ? 'selected' : ''} ${checked && value === choice.value ? (isCorrect ? 'correct' : 'wrong') : ''}`} onClick={() => changeAnswer(item.id, choice.value)} aria-pressed={value === choice.value}><span>{choice.value}</span>{en ? choice.labelEn : choice.label}</button>)}</div> : <div className="word-answer"><span>{en ? 'Answer' : '답'}</span><span className="inline-answer">{view === 'answers' ? <strong><PowerText value={item.answer} /></strong> : <><input aria-label={en ? `Answer ${item.id}` : `${item.id}번 답`} value={value} onChange={(event) => changeAnswer(item.id, event.target.value)} className={checked && value ? (isCorrect ? 'correct' : 'wrong') : ''} /><span className="print-answer-space" aria-hidden="true" /></>}</span>{item.answerSuffix ? <em>{item.answerSuffix}</em> : null}</div>}</div>{checked && view === 'problems' && value ? <span className={`result-mark ${isCorrect ? 'correct' : 'wrong'}`}>{isCorrect ? (en ? 'Correct' : '맞았어요') : (en ? 'Try again' : '다시 풀기')}</span> : null}</article>;
        })}
      </section>
      <footer className="worksheet-footer"><span>{en ? 'Daily Learning Lab' : '매일 배움 연구소'}</span><span>{seed} · {en ? 'Middle School 1' : '중1'} · {unitLabel}</span></footer>
    </div>

    {view === 'problems' ? <section className="grading-panel no-print"><div><strong>{en ? 'Solve directly on a tablet' : '태블릿으로 바로 풀기'}</strong><p>{en ? 'Use ^ for exponents, for example 2^3 x 5.' : '거듭제곱은 2^3 × 5처럼 입력하세요. 곱셈은 ×, x, * 모두 사용할 수 있습니다.'}</p></div><button className="button button-primary" onClick={() => setChecked(true)}>{en ? 'Check answers' : '채점하기'}</button>{checked ? <strong className="score">{en ? `${correctCount} of 20 correct` : `20문제 중 ${correctCount}문제 정답`}</strong> : null}</section> : null}
  </div>;
}
