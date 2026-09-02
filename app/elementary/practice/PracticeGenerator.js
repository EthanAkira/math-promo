'use client';

import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import { findGrade, findUnit, GRADE_CATALOG, localizeGrade, localizeUnit } from './catalog';
import { hasProblemVisual, ProblemVisual } from './ElementaryVisuals';
import { useLanguage } from '../../language';
import { useAuth } from '../../auth';
import { isNonKorean, tr } from '../../i18n';
import NoteCanvas from '../../components/NoteCanvas';
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

function makeProblems(seed, unit) {
  const random = seededRandom(`${seed}:${unit.id}`);
  const used = new Set();
  return Array.from({ length: PROBLEM_COUNT }, (_, index) => {
    let item;
    let key;
    let attempt = 0;
    do {
      item = unit.make(random, index);
      key = JSON.stringify([item.kind, item.prompt, item.expression, item.answer, item.a, item.b, item.operator]);
      attempt += 1;
    } while (used.has(key) && attempt < 100);
    used.add(key);
    return { id: index + 1, ...item };
  });
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

function ProblemBody({ problem, view, value, checked, onChange, language }) {
  const isCorrect = normalizeAnswer(value) === normalizeAnswer(problem.answer);
  const hasAnswer = value !== undefined && value !== '';
  const input = view === 'answers' ? <strong><MathText value={problem.answer} /></strong> : <>
    <input aria-label={isNonKorean(language) ? `Answer ${problem.id}` : `${problem.id}번 답`} inputMode="text" value={value || ''} onChange={(event) => onChange(problem.id, event.target.value)} className={checked && hasAnswer ? (isCorrect ? 'correct' : 'wrong') : ''} />
    <span className="print-answer-space" aria-hidden="true" />
  </>;

  if (problem.kind === 'vertical') {
    return <div className="calculation font-mono">
      <span>{problem.a}</span><span className="second-number"><b>{problem.operator}</b>{problem.b}</span><span className="answer-line">{input}</span>
    </div>;
  }
  if (problem.kind === 'word') {
    const prompt = isNonKorean(language) && problem.promptEn ? problem.promptEn : problem.prompt;
    const expression = isNonKorean(language) && problem.expressionEn ? problem.expressionEn : problem.expression;
    return <div className="word-calculation">
      <p>{prompt}</p>
      {hasProblemVisual(problem) ? <ProblemVisual item={problem} /> : null}
      {expression ? <strong className="word-expression font-mono"><MathText value={expression} /></strong> : null}
      <div className="word-answer"><span>{isNonKorean(language) ? 'Answer' : '답'}</span>{input}{problem.answerSuffix ? <em>{problem.answerSuffix}</em> : null}</div>
    </div>;
  }
  const expression = isNonKorean(language) ? problem.expression.replace('약수:', 'Factors of').replace('최대공약수:', 'GCF of').replace('최소공배수:', 'LCM of').replace(/의 (\d+)번째 배수/, ' — multiple #$1').replace('가장 간단한 비', 'simplest ratio').replace('기약분수', 'simplest form').replace('가분수', 'improper fraction').replace('대분수', 'mixed number') : problem.expression;
  return <div className="inline-calculation font-mono"><span><MathText value={expression} /></span><b>=</b><span className="inline-answer">{input}</span></div>;
}

export default function PracticeGenerator() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const en = isNonKorean(language);
  const [gradeId, setGradeId] = useState('1');
  const [unitId, setUnitId] = useState('g1-bonds');
  const [seed, setSeed] = useState('PREVIEW1');
  const [view, setView] = useState('problems');
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [ready, setReady] = useState(false);
  const [openNotes, setOpenNotes] = useState(() => new Set());

  const toggleNote = useCallback((problemId) => {
    setOpenNotes((current) => {
      const next = new Set(current);
      if (next.has(problemId)) next.delete(problemId); else next.add(problemId);
      return next;
    });
  }, []);

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
    setSeed(nextSeed); setGradeId(nextGrade); setUnitId(nextUnit); setView('problems'); setAnswers({}); setChecked(false); setOpenNotes(new Set());
    replaceUrl(nextSeed, nextGrade, nextUnit, 'problems');
  }

  function chooseGrade(nextGrade) {
    const nextUnit = findGrade(nextGrade).units[0].id;
    resetWork(createSeed(), nextGrade, nextUnit);
  }

  function chooseUnit(nextUnit) { resetWork(createSeed(), gradeId, nextUnit); }
  function changeView(nextView) { setView(nextView); setChecked(false); replaceUrl(seed, gradeId, unitId, nextView); }
  function handleAnswer(id, value) { if (!/^[0-9A-Za-z가-힣\s,/<>:=.\-]*$/.test(value)) return; setAnswers((current) => ({ ...current, [id]: value })); setChecked(false); }

  function checkAnswers() {
    setChecked(true);
    recordAttempts(user, problems
      .filter((problem) => answers[problem.id] !== undefined && answers[problem.id] !== '')
      .map((problem) => ({
        grade: gradeId,
        unit: unit.id,
        problemType: 'short',
        isCorrect: normalizeAnswer(answers[problem.id]) === normalizeAnswer(problem.answer),
        answer: answers[problem.id],
      })));
  }

  const gradeLabel = localizeGrade(grade, language);
  const unitLabel = localizeUnit(unit, language);
  const unitDescription = localizeUnit(unit, language, 'description');

  return <div className="worksheet-app">
    <section className="grade-tabs no-print" aria-label={en ? 'Select grade' : '학년 선택'}>
      {GRADE_CATALOG.map((item) => <button key={item.id} className={gradeId === item.id ? 'active' : ''} onClick={() => chooseGrade(item.id)}>{localizeGrade(item, language)}</button>)}
    </section>

    <section className="worksheet-controls no-print" aria-label={tr(language, 'worksheetSettings')}>
      <div><label htmlFor="practice-unit">{en ? `${gradeLabel} topic` : `${gradeLabel} 단원`}</label><select id="practice-unit" value={unitId} onChange={(event) => chooseUnit(event.target.value)}>{grade.units.map((item) => <option key={item.id} value={item.id}>{localizeUnit(item, language)}</option>)}</select><p>{unitDescription}</p></div>
      <div className="control-actions"><button className="button button-secondary" onClick={() => window.print()}>{tr(language, 'printPdf')}</button><button className="button button-secondary" onClick={() => changeView(view === 'problems' ? 'answers' : 'problems')}>{tr(language, view === 'problems' ? 'answerKey' : 'worksheet')}</button><button className="button button-primary" onClick={() => resetWork(createSeed())}>{tr(language, 'newWorksheet')}</button></div>
    </section>

    <div className={`worksheet-paper ${view === 'answers' ? 'answer-sheet' : ''}`}>
      <header className="worksheet-heading"><div className="worksheet-brand"><span className="brand-mark">DAILY</span><strong>{tr(language, 'dailyLab')}</strong></div><div className="worksheet-title"><span>{gradeLabel}</span><h2>{unitLabel} {tr(language, view === 'answers' ? 'answerSheet' : 'worksheetWord')}</h2><p>{unitDescription}</p></div><div className="worksheet-identity"><div><span>{tr(language, 'worksheetId')}</span><strong>{seed}</strong><small>{tr(language, 'scanQr')}</small></div>{qrDataUrl ? <img src={qrDataUrl} alt={`Worksheet ${seed} QR code`} /> : null}</div></header>
      <div className="student-row"><span>{tr(language, 'name')}</span><i /><span>{tr(language, 'date')}</span><i /><span className="sheet-kind">{tr(language, view === 'answers' ? 'answers' : 'problems20')}</span></div>
      <section className={`problem-grid ${problems.some((problem) => problem.kind === 'word') ? 'word-problem-grid' : ''}`} aria-label={`${unitLabel} ${en ? 'problems' : '문제'}`}>
        {problems.map((problem) => {
          const isCorrect = normalizeAnswer(answers[problem.id]) === normalizeAnswer(problem.answer);
          const hasAnswer = answers[problem.id] !== undefined && answers[problem.id] !== '';
          const noteOpen = view === 'problems' && openNotes.has(problem.id);
          const noteKey = `dll-note:${seed}:${unit.id}:${problem.id}`;
          return (
            <Fragment key={problem.id}>
              <article className={`vertical-problem ${problem.kind === 'inline' ? 'inline-problem' : ''} ${problem.kind === 'word' ? 'word-problem' : ''} ${hasProblemVisual(problem) ? 'graphic-problem' : ''}`}>
                <span className="problem-number">{problem.id}</span>
                <ProblemBody problem={problem} view={view} value={answers[problem.id]} checked={checked} onChange={handleAnswer} language={language} />
                {checked && view === 'problems' && hasAnswer ? <span className={`result-mark ${isCorrect ? 'correct' : 'wrong'}`}>{isCorrect ? (en ? 'Correct' : '맞았어요') : (en ? 'Try again' : '다시 풀기')}</span> : null}
                {view === 'problems' ? <button type="button" className="note-toggle no-print" onClick={() => toggleNote(problem.id)}>{tr(language, noteOpen ? 'noteToggleClose' : 'noteToggleOpen')}</button> : null}
              </article>
              {noteOpen ? <div className="note-canvas-slot no-print"><NoteCanvas storageKey={noteKey} open={noteOpen} /></div> : null}
            </Fragment>
          );
        })}
      </section>
      <footer className="worksheet-footer"><span className="worksheet-signature">Built &amp; Designed by Chae</span><span>{tr(language, 'dailyLab')}</span><span>{seed} · {gradeLabel} · {unitLabel}</span></footer>
    </div>

    {view === 'problems' ? <section className="grading-panel no-print"><div><strong>{tr(language, 'solveTablet')}</strong><p>{en ? 'Enter fractions as 7/3 or 2 1/3. Use R for a remainder.' : '분수는 7/3 또는 2 1/3, 나머지는 R로 입력하세요.'}</p></div><button className="button button-primary" onClick={checkAnswers}>{tr(language, 'checkAnswers')}</button>{checked ? <strong className="score">{tr(language, 'score', { count: correctCount })}</strong> : null}</section> : null}
  </div>;
}
