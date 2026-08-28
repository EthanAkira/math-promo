'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import { useLanguage } from '../../language';
import { isNonKorean, tr } from '../../i18n';
import { PRE_ALGEBRA_PROFILES, finalizeGeneratedProblem, findPreAlgebraProfile, findPreAlgebraUnit, localizePreAlgebraUnit, unitsForProfile } from './catalog';
import { hasProblemVisual, MathText, ProblemVisual } from './PreAlgebraVisuals';

const PROBLEM_COUNT = 20;
const CATEGORY_EN = {
  '수와 연산': 'Number & Operations', '문자와 식': 'Expressions & Equations', '좌표와 관계': 'Coordinates & Relationships',
  '비와 비율': 'Ratios & Percents', '자료와 가능성': 'Data & Statistics', '방정식과 부등식': 'Equations & Inequalities',
  '함수': 'Functions', '확률과 통계': 'Probability & Statistics', '다항식': 'Polynomials', '경우의 수': 'Counting',
  '행렬': 'Matrices', '집합과 명제': 'Sets & Logic', '지수와 로그': 'Exponents & Logarithms', '수열': 'Sequences',
  '수학적 모델링': 'Mathematical Modeling',
  '도형의 방정식': 'Coordinate Geometry', '삼각함수': 'Trigonometry', '종합평가': 'Comprehensive Review',
};

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
    let key;
    let attempt = 0;
    do {
      item = finalizeGeneratedProblem(unit.make(random), unit);
      key = JSON.stringify([item.prompt, item.expression, item.answer, item.line, item.plane, item.graph, item.lines, item.point, item.table, item.stemLeaf, item.frequencyTable, item.matrices, item.data, item.mapping, item.points, item.cells, item.values, item.roots, item.mode]);
      attempt += 1;
    } while (used.has(key) && attempt < 100);
    used.add(key);
    return { id: index + 1, ...item };
  });
}

function normalize(value) {
  return String(value ?? '').toLowerCase().replace(/−/g, '-').replace(/[()]/g, '').replace(/\s*([,<>≤≥=:%])\s*/g, '$1').replace(/\s+/g, '').trim();
}

function numericValue(value) {
  const text = normalize(value).replace(/%$/, '');
  const match = text.match(/^([+-]?\d+)\/(\d+)$/);
  if (match && Number(match[2])) return Number(match[1]) / Number(match[2]);
  if (/^[+-]?\d+(?:\.\d+)?$/.test(text)) return Number(text);
  return null;
}

function equivalent(left, right) {
  const normalizedLeft = normalize(left);
  const normalizedRight = normalize(right);
  if (normalizedLeft === normalizedRight) return true;
  const leftNumber = numericValue(left);
  const rightNumber = numericValue(right);
  return leftNumber !== null && rightNumber !== null && Math.abs(leftNumber - rightNumber) < 1e-9;
}

function buildUrl(seed, profileId, unitId, view = 'problems') {
  const url = new URL(window.location.href);
  url.searchParams.set('sheet', seed);
  url.searchParams.set('profile', profileId);
  url.searchParams.set('unit', unitId);
  if (view === 'answers') url.searchParams.set('view', 'answers');
  else url.searchParams.delete('view');
  return url.toString();
}

export default function PreAlgebraGenerator() {
  const { language } = useLanguage();
  const foreign = isNonKorean(language);
  const [profileId, setProfileId] = useState('kr-middle-1');
  const [unitId, setUnitId] = useState('prime-composite');
  const [seed, setSeed] = useState('PREVIEW1');
  const [view, setView] = useState('problems');
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialProfile = findPreAlgebraProfile(params.get('profile')).id;
    const initialUnitObject = findPreAlgebraUnit(params.get('unit'), initialProfile);
    const initialUnit = initialUnitObject.id;
    const initialSeed = (params.get('sheet') || createSeed()).toUpperCase();
    const initialView = params.get('view') === 'answers' ? 'answers' : 'problems';
    setProfileId(initialProfile); setUnitId(initialUnit); setCategory(initialUnitObject.category); setSeed(initialSeed); setView(initialView);
    window.history.replaceState({}, '', buildUrl(initialSeed, initialProfile, initialUnit, initialView));
    setReady(true);
  }, []);

  const profile = findPreAlgebraProfile(profileId);
  const units = useMemo(() => unitsForProfile(profileId), [profileId]);
  const categories = useMemo(() => [...new Set(units.map((item) => item.category))], [units]);
  const unit = findPreAlgebraUnit(unitId, profileId);
  const [category, setCategory] = useState('수와 연산');
  const visibleUnits = useMemo(() => units.filter((item) => item.category === category), [units, category]);
  const problems = useMemo(() => makeProblems(seed, unit), [seed, unit]);
  const correctCount = problems.filter((item) => equivalent(answers[item.id], item.answer)).length;

  useEffect(() => {
    if (!ready) return;
    QRCode.toDataURL(buildUrl(seed, profileId, unitId), { width: 220, margin: 1, errorCorrectionLevel: 'M', color: { dark: '#1f2733', light: '#fffefb' } }).then(setQrDataUrl);
  }, [seed, profileId, unitId, ready]);

  const replaceUrl = useCallback((nextSeed, nextProfile, nextUnit, nextView) => window.history.replaceState({}, '', buildUrl(nextSeed, nextProfile, nextUnit, nextView)), []);
  function reset(nextSeed, nextProfile = profileId, nextUnit = unitId) {
    setSeed(nextSeed); setProfileId(nextProfile); setUnitId(nextUnit); setView('problems'); setAnswers({}); setChecked(false);
    replaceUrl(nextSeed, nextProfile, nextUnit, 'problems');
  }
  function chooseProfile(nextProfile) {
    const nextUnits = unitsForProfile(nextProfile);
    const nextCategory = nextUnits[0].category;
    setCategory(nextCategory);
    reset(createSeed(), nextProfile, nextUnits[0].id);
  }
  function chooseCategory(nextCategory) {
    const nextUnit = units.find((item) => item.category === nextCategory);
    setCategory(nextCategory);
    reset(createSeed(), profileId, nextUnit.id);
  }
  function chooseUnit(nextUnit) { reset(createSeed(), profileId, nextUnit); }
  function changeView(nextView) { setView(nextView); setChecked(false); replaceUrl(seed, profileId, unitId, nextView); }
  function changeAnswer(id, value) { setAnswers((current) => ({ ...current, [id]: value })); setChecked(false); }

  const unitLabel = localizePreAlgebraUnit(unit, language);
  const unitDescription = localizePreAlgebraUnit(unit, language, 'description');
  const profileLabel = foreign ? profile.labelEn : profile.label;

  return <div className="worksheet-app pre-algebra-app">
    <section className="worksheet-controls pre-algebra-controls no-print" aria-label={tr(language, 'worksheetSettings')}>
      <div><label htmlFor="pre-algebra-profile">{foreign ? 'Curriculum' : '교육과정'}</label><select id="pre-algebra-profile" value={profileId} onChange={(event) => chooseProfile(event.target.value)}>{PRE_ALGEBRA_PROFILES.map((item) => <option key={item.id} value={item.id}>{foreign ? item.labelEn : item.label}</option>)}</select><p>{foreign ? profile.descriptionEn : profile.description}</p></div>
      <div><label htmlFor="pre-algebra-category">{foreign ? 'Domain' : '영역'}</label><select id="pre-algebra-category" value={category} onChange={(event) => chooseCategory(event.target.value)}>{categories.map((item) => <option key={item} value={item}>{foreign ? CATEGORY_EN[item] : item}</option>)}</select></div>
      <div><label htmlFor="pre-algebra-unit">{tr(language, 'skill')}</label><select id="pre-algebra-unit" value={unitId} onChange={(event) => chooseUnit(event.target.value)}>{visibleUnits.map((item) => <option key={item.id} value={item.id}>{localizePreAlgebraUnit(item, language)}</option>)}</select><p>{unitDescription}</p></div>
      <div className="control-actions"><button className="button button-secondary" onClick={() => window.print()}>{tr(language, 'printPdf')}</button><button className="button button-secondary" onClick={() => changeView(view === 'problems' ? 'answers' : 'problems')}>{tr(language, view === 'problems' ? 'answerKey' : 'worksheet')}</button><button className="button button-primary" onClick={() => reset(createSeed())}>{tr(language, 'newWorksheet')}</button></div>
    </section>

    <div className={`worksheet-paper middle-worksheet ${view === 'answers' ? 'answer-sheet' : ''}`}>
      <header className="worksheet-heading"><div className="worksheet-brand"><span className="brand-mark">DAILY</span><strong>{tr(language, 'dailyLab')}</strong></div><div className="worksheet-title"><span>{profileLabel}</span><h2>{unitLabel} {tr(language, view === 'answers' ? 'answerSheet' : 'worksheetWord')}</h2><p>{unitDescription}</p></div><div className="worksheet-identity"><div><span>{tr(language, 'worksheetId')}</span><strong>{seed}</strong><small>{tr(language, 'scanQr')}</small></div>{qrDataUrl ? <img src={qrDataUrl} alt={`Worksheet ${seed} QR code`} /> : null}</div></header>
      <div className="student-row"><span>{tr(language, 'name')}</span><i /><span>{tr(language, 'date')}</span><i /><span className="sheet-kind">{tr(language, view === 'answers' ? 'answers' : 'problems20')}</span></div>
      <section className="problem-grid word-problem-grid prime-problem-grid" aria-label={`${unitLabel} ${foreign ? 'problems' : '문제'}`}>
        {problems.map((item) => {
          const value = answers[item.id] || '';
          const isCorrect = equivalent(value, item.answer);
          const prompt = foreign && item.promptEn ? item.promptEn : item.prompt;
          const expression = foreign && item.expressionEn ? item.expressionEn : item.expression;
          const choices = foreign ? item.choicesEn : item.choicesKo;
          return <article className={`vertical-problem word-problem prime-problem${hasProblemVisual(item) ? ' graphic-problem' : ''}`} key={item.id}>
            <span className="problem-number">{item.id}</span><div className="word-calculation"><p>{prompt}</p>
              {expression ? <strong className="word-expression font-mono"><MathText value={expression} /></strong> : null}
              <ProblemVisual item={item} />
              <div className="word-answer"><span>{tr(language, 'answer')}</span>{item.kind === 'choice' && choices ? <div className="choice-answer">{view === 'answers' ? <strong>{choices[Number(item.answer) - 1]}</strong> : choices.map((choice, index) => <button type="button" key={`${choice}-${index}`} className={value === String(index + 1) ? 'selected' : ''} onClick={() => changeAnswer(item.id, String(index + 1))}>{choice}</button>)}</div> : <span className="inline-answer">{view === 'answers' ? <strong><MathText value={item.answer} /></strong> : <><input aria-label={`${tr(language, 'answer')} ${item.id}`} value={value} onChange={(event) => changeAnswer(item.id, event.target.value)} className={checked && value ? (isCorrect ? 'correct' : 'wrong') : ''} /><span className="print-answer-space" aria-hidden="true" /></>}</span>}{item.answerSuffix && !foreign ? <em>{item.answerSuffix}</em> : null}</div>
              {view === 'answers' ? <p className="generated-explanation"><strong>{foreign ? 'Why: ' : '풀이: '}</strong>{foreign ? item.explanationEn : item.explanation}</p> : null}
            </div>{checked && view === 'problems' && value ? <span className={`result-mark ${isCorrect ? 'correct' : 'wrong'}`}>{tr(language, isCorrect ? 'correct' : 'tryAgain')}</span> : null}
          </article>;
        })}
      </section>
      <footer className="worksheet-footer"><span>{tr(language, 'dailyLab')}</span><span>{seed} · {profileLabel} · {unitLabel}</span></footer>
    </div>

    {view === 'problems' ? <section className="grading-panel no-print"><div><strong>{tr(language, 'solveTablet')}</strong><p>{foreign ? 'Fractions: 3/4 · Coordinates: 2,-3 · Inequalities: x<=4' : '분수는 3/4, 좌표는 2,-3, 부등식은 x<=4처럼 입력할 수 있습니다.'}</p></div><button className="button button-primary" onClick={() => setChecked(true)}>{tr(language, 'checkAnswers')}</button>{checked ? <strong className="score">{tr(language, 'score', { count: correctCount })}</strong> : null}</section> : null}

    <style jsx global>{`
      .pre-algebra-controls { grid-template-columns: minmax(190px,.8fr) minmax(150px,.55fr) minmax(240px,1fr) auto; align-items: end; }
      .pre-algebra-controls > div { min-width: 0; }
      .pre-algebra-controls select { width: 100%; }
      .generated-math-table { border-collapse: collapse; margin: 12px auto; min-width: 210px; text-align: center; background: #fff; }
      .generated-math-table th,.generated-math-table td { border: 1.5px solid #64748b; padding: 6px 12px; }
      .generated-math-table th { background: #eef5ff; }
      .generated-stem-leaf { width: 220px; margin: 12px auto; padding: 10px 14px; border: 1.5px solid #64748b; background: #fff; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
      .generated-stem-leaf > div:not(.stem-key) { display: grid; grid-template-columns: 42px 1fr; line-height: 1.8; }
      .generated-stem-leaf strong { border-right: 2px solid #334155; text-align: center; }
      .generated-stem-leaf span { padding-left: 12px; word-spacing: 8px; }
      .generated-stem-leaf small { display: block; margin-top: 7px; color: #64748b; }
      .stem-key { font-size: 12px; color: #64748b; margin-bottom: 4px; }
      .generated-algebra-graph,.generated-system-graph,.generated-probability,.generated-venn,.generated-data-bars { display: block; width: min(100%,260px); height: auto; margin: 10px auto; }
      .generated-algebra-graph polyline,.generated-system-graph polyline { stroke-width: 2.2; }
      .generated-probability line,.generated-probability circle,.generated-venn rect { stroke: #334155; stroke-width: 1.5; }
      .probability-first { fill: #f6c98f; stroke: #9a5a19; }.probability-second { fill: #9fd7e5; stroke: #25657a; }
      .venn-a { fill: rgba(245,158,11,.3); stroke: #b96a08; }.venn-b { fill: rgba(14,165,233,.25); stroke: #176b8b; }
      .generated-data-bars rect { fill: #79b8b3; stroke: #245c59; }.generated-data-bars text,.generated-probability text,.generated-venn text { font-size: 11px; fill: #1f2937; }
      .generated-matrix-operation { display: flex; align-items: center; justify-content: center; gap: 14px; margin: 14px auto; }
      .matrix-wrap { display: grid; grid-template-columns: repeat(2,34px); gap: 5px; padding: 5px 10px; border-left: 2px solid #334155; border-right: 2px solid #334155; text-align: center; font-family: ui-monospace,monospace; }
      .generated-explanation { margin: 8px 0 0; padding: 8px 10px; border-left: 3px solid #66a3a0; background: #f3faf9; color: #334155; font-size: 12px; line-height: 1.55; }
      @media (max-width: 900px) { .pre-algebra-controls { grid-template-columns: 1fr 1fr; } .pre-algebra-controls .control-actions { grid-column: 1 / -1; } }
      @media (max-width: 600px) { .pre-algebra-controls { grid-template-columns: 1fr; } .pre-algebra-controls .control-actions { grid-column: auto; } }
      @media print { .generated-explanation { break-inside: avoid; } }
    `}</style>
  </div>;
}
