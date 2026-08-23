'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import { findGrade, findUnit, GRADE_CATALOG, localizeGrade, localizeUnit } from './catalog';
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
  return Array.from({ length: PROBLEM_COUNT }, (_, index) => ({ id: index + 1, ...unit.make(random, index) }));
}

function normalizeAnswer(value) {
  return String(value).toLowerCase().replace(/×/g, 'x').replace(/\s*,\s*/g, ',').replace(/\s*:\s*/g, ':').replace(/\s+/g, ' ').trim();
}

function buildUrl(seed, gradeId, unitId, view = 'problems') {
  const url = new URL(window.location.href);
  url.searchParams.set('sheet', seed);
  url.searchParams.set('grade', gradeId);
  url.searchParams.set('unit', unitId);
  if (view === 'answers') url.searchParams.set('view', 'answers');
  else url.searchParams.delete('view');
  return url.toString();
}

function Fraction({ whole, numerator, denominator }) {
  return <span className="mixed-fraction">
    {whole ? <span className="whole-number">{whole}</span> : null}
    <span className="stacked-fraction" aria-label={`${whole ? `${whole} ` : ''}${numerator}/${denominator}`}>
      <span className="fraction-numerator">{numerator}</span>
      <span className="fraction-denominator">{denominator}</span>
    </span>
  </span>;
}

function MathText({ value }) {
  const text = String(value);
  const parts = text.split(/(\d+\s+\d+\/\d+|\d+\/\d+)/g);
  return <>{parts.map((part, index) => {
    const mixed = part.match(/^(\d+)\s+(\d+)\/(\d+)$/);
    if (mixed) return <Fraction key={`${part}-${index}`} whole={mixed[1]} numerator={mixed[2]} denominator={mixed[3]} />;
    const fraction = part.match(/^(\d+)\/(\d+)$/);
    if (fraction) return <Fraction key={`${part}-${index}`} numerator={fraction[1]} denominator={fraction[2]} />;
    return <span key={`${part}-${index}`}>{part}</span>;
  })}</>;
}

function ProblemBody({ problem, view, value, checked, onChange, language }) {
  const isCorrect = normalizeAnswer(value) === normalizeAnswer(problem.answer);
  const hasAnswer = value !== undefined && value !== '';
  const input = view === 'answers' ? <strong><MathText value={problem.answer} /></strong> : <>
    <input aria-label={language === 'en' ? `Answer ${problem.id}` : `${problem.id}번 답`} inputMode="text" value={value || ''} onChange={(event) => onChange(problem.id, event.target.value)} className={checked && hasAnswer ? (isCorrect ? 'correct' : 'wrong') : ''} />
    <span className="print-answer-space" aria-hidden="true" />
  </>;

  if (problem.kind === 'vertical') {
    return <div className="calculation font-mono">
      <span>{problem.a}</span><span className="second-number"><b>{problem.operator}</b>{problem.b}</span><span className="answer-line">{input}</span>
    </div>;
  }
  if (problem.kind === 'word') {
    const prompt = language === 'en' && problem.promptEn ? problem.promptEn : problem.prompt;
    const expression = language === 'en' && problem.expressionEn ? problem.expressionEn : problem.expression;
    return <div className="word-calculation">
      <p>{prompt}</p>
      {expression ? <strong className="word-expression font-mono"><MathText value={expression} /></strong> : null}
      <div className="word-answer"><span>{language === 'en' ? 'Answer' : '답'}</span>{input}{problem.answerSuffix ? <em>{problem.answerSuffix}</em> : null}</div>
    </div>;
  }
  const expression = language === 'en' ? problem.expression.replace('약수:', 'Factors of').replace('최대공약수:', 'GCF of').replace('최소공배수:', 'LCM of').replace(/의 (\d+)번째 배수/, ' — multiple #$1').replace('가장 간단한 비', 'simplest ratio').replace('기약분수', 'simplest form').replace('가분수', 'improper fraction').replace('대분수', 'mixed number') : problem.expression;
  return <div className="inline-calculation font-mono"><span><MathText value={expression} /></span><b>=</b><span className="inline-answer">{input}</span></div>;
}

export default function PracticeGenerator() {
  const { language } = useLanguage();
  const en = language === 'en';
  const [gradeId, setGradeId] = useState('1');
  const [unitId, setUnitId] = useState('g1-bonds');
  const [seed, setSeed] = useState('PREVIEW1');
  const [view, setView] = useState('problems');
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedGrade = params.get('grade');
    const initialGrade = GRADE_CATALOG.some((grade) => grade.id === requestedGrade) ? requestedGrade : '1';
    const grade = findGrade(initialGrade);
    const requestedUnit = params.get('unit');
    const initialUnit = grade.units.some((unit) => unit.id === requestedUnit) ? requestedUnit : grade.units[0].id;
    const initialSeed = (params.get('sheet') || createSeed()).toUpperCase();
    const initialView = params.get('view') === 'answers' ? 'answers' : 'problems';
    setGradeId(initialGrade); setUnitId(initialUnit); setSeed(initialSeed); setView(initialView);
    window.history.replaceState({}, '', buildUrl(initialSeed, initialGrade, initialUnit, initialView));
    setReady(true);
  }, []);

  const grade = findGrade(gradeId);
  const unit = findUnit(gradeId, unitId);
  const problems = useMemo(() => makeProblems(seed, unit), [seed, unit]);
  const correctCount = problems.filter((problem) => normalizeAnswer(answers[problem.id]) === normalizeAnswer(problem.answer)).length;

  useEffect(() => {
    if (!ready) return;
    QRCode.toDataURL(buildUrl(seed, gradeId, unitId, 'problems'), { width: 220, margin: 1, errorCorrectionLevel: 'M', color: { dark: '#1f2733', light: '#fffefb' } }).then(setQrDataUrl);
  }, [seed, gradeId, unitId, ready]);

  const replaceUrl = useCallback((nextSeed, nextGrade, nextUnit, nextView) => {
    window.history.replaceState({}, '', buildUrl(nextSeed, nextGrade, nextUnit, nextView));
  }, []);

  function resetWork(nextSeed, nextGrade = gradeId, nextUnit = unitId) {
    setSeed(nextSeed); setGradeId(nextGrade); setUnitId(nextUnit); setView('problems'); setAnswers({}); setChecked(false);
    replaceUrl(nextSeed, nextGrade, nextUnit, 'problems');
  }

  function chooseGrade(nextGrade) {
    const nextUnit = findGrade(nextGrade).units[0].id;
    resetWork(createSeed(), nextGrade, nextUnit);
  }

  function chooseUnit(nextUnit) { resetWork(createSeed(), gradeId, nextUnit); }
  function changeView(nextView) { setView(nextView); setChecked(false); replaceUrl(seed, gradeId, unitId, nextView); }
  function handleAnswer(id, value) { if (!/^[0-9A-Za-z\s,/<>:=.\-]*$/.test(value)) return; setAnswers((current) => ({ ...current, [id]: value })); setChecked(false); }

  const gradeLabel = localizeGrade(grade, language);
  const unitLabel = localizeUnit(unit, language);
  const unitDescription = localizeUnit(unit, language, 'description');

  return <div className="worksheet-app">
    <section className="grade-tabs no-print" aria-label={en ? 'Select grade' : '학년 선택'}>
      {GRADE_CATALOG.map((item) => <button key={item.id} className={gradeId === item.id ? 'active' : ''} onClick={() => chooseGrade(item.id)}>{localizeGrade(item, language)}</button>)}
    </section>

    <section className="worksheet-controls no-print" aria-label={en ? 'Worksheet settings' : '문제지 설정'}>
      <div><label htmlFor="practice-unit">{en ? `${gradeLabel} topic` : `${gradeLabel} 단원`}</label><select id="practice-unit" value={unitId} onChange={(event) => chooseUnit(event.target.value)}>{grade.units.map((item) => <option key={item.id} value={item.id}>{localizeUnit(item, language)}</option>)}</select><p>{unitDescription}</p></div>
      <div className="control-actions"><button className="button button-secondary" onClick={() => window.print()}>{en ? 'Print / PDF' : '인쇄 / PDF'}</button><button className="button button-secondary" onClick={() => changeView(view === 'problems' ? 'answers' : 'problems')}>{view === 'problems' ? (en ? 'Answer key' : '답지 보기') : (en ? 'Worksheet' : '문제지 보기')}</button><button className="button button-primary" onClick={() => resetWork(createSeed())}>{en ? 'New worksheet' : '새 문제지'}</button></div>
    </section>

    <div className={`worksheet-paper ${view === 'answers' ? 'answer-sheet' : ''}`}>
      <header className="worksheet-heading"><div className="worksheet-brand"><span className="brand-mark">{en ? 'DAILY' : '매일'}</span><strong>{en ? 'LEARNING LAB' : '배움 연구소'}</strong></div><div className="worksheet-title"><span>{gradeLabel}</span><h2>{unitLabel} {view === 'answers' ? (en ? 'Answer Key' : '정답지') : (en ? 'Worksheet' : '문제지')}</h2><p>{unitDescription}</p></div><div className="worksheet-identity"><div><span>{en ? 'Worksheet ID' : '문제지 번호'}</span><strong>{seed}</strong><small>{en ? 'Scan the QR code to reopen this exact worksheet.' : 'QR을 스캔하면 같은 문제를 다시 열 수 있어요.'}</small></div>{qrDataUrl ? <img src={qrDataUrl} alt={`Worksheet ${seed} QR code`} /> : null}</div></header>
      <div className="student-row"><span>{en ? 'Name' : '이름'}</span><i /><span>{en ? 'Date' : '날짜'}</span><i /><span className="sheet-kind">{view === 'answers' ? (en ? 'Answers' : '정답') : (en ? `${PROBLEM_COUNT} problems` : `${PROBLEM_COUNT}문제`)}</span></div>
      <section className={`problem-grid ${problems.some((problem) => problem.kind === 'word') ? 'word-problem-grid' : ''}`} aria-label={`${unitLabel} ${en ? 'problems' : '문제'}`}>
        {problems.map((problem) => { const isCorrect = normalizeAnswer(answers[problem.id]) === normalizeAnswer(problem.answer); const hasAnswer = answers[problem.id] !== undefined && answers[problem.id] !== ''; return <article className={`vertical-problem ${problem.kind === 'inline' ? 'inline-problem' : ''} ${problem.kind === 'word' ? 'word-problem' : ''}`} key={problem.id}><span className="problem-number">{problem.id}</span><ProblemBody problem={problem} view={view} value={answers[problem.id]} checked={checked} onChange={handleAnswer} language={language} />{checked && view === 'problems' && hasAnswer ? <span className={`result-mark ${isCorrect ? 'correct' : 'wrong'}`}>{isCorrect ? (en ? 'Correct' : '맞았어요') : (en ? 'Try again' : '다시 풀기')}</span> : null}</article>; })}
      </section>
      <footer className="worksheet-footer"><span>{en ? 'Daily Learning Lab' : '매일 배움 연구소'}</span><span>{seed} · {gradeLabel} · {unitLabel}</span></footer>
    </div>

    {view === 'problems' ? <section className="grading-panel no-print"><div><strong>{en ? 'Solve directly on a tablet' : '태블릿으로 바로 풀기'}</strong><p>{en ? 'Enter fractions as 7/3 or 2 1/3. Use R for a remainder.' : '분수는 7/3 또는 2 1/3, 나머지는 R로 입력하세요.'}</p></div><button className="button button-primary" onClick={() => setChecked(true)}>{en ? 'Check answers' : '채점하기'}</button>{checked ? <strong className="score">{en ? `${correctCount} of ${PROBLEM_COUNT} correct` : `${PROBLEM_COUNT}문제 중 ${correctCount}문제 정답`}</strong> : null}</section> : null}
  </div>;
}
