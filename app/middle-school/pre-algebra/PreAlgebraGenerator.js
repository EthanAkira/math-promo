'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import { useLanguage } from '../../language';
import { useAuth } from '../../auth';
import { isNonKorean, tr } from '../../i18n';
import { finalizeGeneratedProblem, findPreAlgebraProfile, findPreAlgebraUnit, localizePreAlgebraUnit, unitsForProfile } from './catalog';
import { recordAttempts } from '../../lib/submissions';
import { preAlgebraCategory, preAlgebraCopy, preAlgebraProfileLabel } from './localization';
import { hasProblemVisual, MathText, ProblemVisual } from './PreAlgebraVisuals';

const PROBLEM_COUNT = 20;

const TIER_ORDER = { basic: 0, intermediate: 1, advanced: 2 };
const TIER_LABELS = {
  basic: { ko: '하', en: 'Basic' },
  intermediate: { ko: '중', en: 'Intermediate' },
  advanced: { ko: '상', en: 'Advanced' },
};
function tierWithin(unitTier, ceiling) {
  if (!unitTier) return true;
  return TIER_ORDER[unitTier] <= TIER_ORDER[ceiling];
}

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

function makeCombinedProblems(seed, unitIds, tierCeiling, count, units) {
  const eligibleUnits = units.filter((item) => unitIds.includes(item.id) && tierWithin(item.tier, tierCeiling));
  if (!eligibleUnits.length) return [];
  const random = seededRandom(`${seed}:core:${unitIds.join(',')}:${tierCeiling}:${count}`);
  const used = new Set();
  const pool = [];
  let index = 0;
  let guard = 0;
  while (pool.length < count && guard < count * 25) {
    guard += 1;
    const unit = eligibleUnits[index % eligibleUnits.length];
    index += 1;
    const item = finalizeGeneratedProblem(unit.make(random), unit);
    const key = JSON.stringify([unit.id, item.prompt, item.expression, item.answer]);
    if (used.has(key) && guard < count * 20) continue;
    used.add(key);
    pool.push({ sourceUnitId: unit.id, sourceUnitLabel: unit.label, sourceUnitLabelEn: unit.en?.[0] || unit.label, ...item });
  }
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.map((item, position) => ({ id: position + 1, ...item }));
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
  const { user } = useAuth();
  const foreign = isNonKorean(language);
  const copy = preAlgebraCopy(language);
  const [profileId, setProfileId] = useState('kr-middle-1');
  const [unitId, setUnitId] = useState('prime-composite');
  const [seed, setSeed] = useState('PREVIEW1');
  const [view, setView] = useState('problems');
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState('single');
  const [coreSelectedUnitIds, setCoreSelectedUnitIds] = useState([]);
  const [coreTierCeiling, setCoreTierCeiling] = useState('advanced');
  const [coreCount, setCoreCount] = useState(20);
  const [coreSeed, setCoreSeed] = useState('');
  const [coreAnswers, setCoreAnswers] = useState({});
  const [coreChecked, setCoreChecked] = useState(false);
  const [coreView, setCoreView] = useState('problems');

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
    if (!coreSeed) setCoreSeed(createSeed());
  }, [coreSeed]);
  useEffect(() => {
    setCoreSelectedUnitIds([]);
  }, [profileId]);
  function toggleCoreUnit(id) {
    setCoreSelectedUnitIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
    setCoreChecked(false);
  }
  function toggleCoreCategory(categoryName) {
    const idsInCategory = units.filter((item) => item.category === categoryName).map((item) => item.id);
    const allSelected = idsInCategory.every((id) => coreSelectedUnitIds.includes(id));
    setCoreSelectedUnitIds((current) => (allSelected
      ? current.filter((id) => !idsInCategory.includes(id))
      : [...new Set([...current, ...idsInCategory])]));
    setCoreChecked(false);
  }
  const coreProblems = useMemo(
    () => (coreSeed ? makeCombinedProblems(coreSeed, coreSelectedUnitIds, coreTierCeiling, coreCount, units) : []),
    [coreSeed, coreSelectedUnitIds, coreTierCeiling, coreCount, units],
  );
  const coreCorrectCount = coreProblems.filter((item) => equivalent(coreAnswers[item.id], item.answer)).length;
  function regenerateCore() { setCoreSeed(createSeed()); setCoreAnswers({}); setCoreChecked(false); setCoreView('problems'); }
  function changeCoreAnswer(id, value) { setCoreAnswers((current) => ({ ...current, [id]: value })); setCoreChecked(false); }
  function checkCoreAnswers() {
    setCoreChecked(true);
    recordAttempts(user, coreProblems
      .filter((item) => coreAnswers[item.id] !== undefined && coreAnswers[item.id] !== '')
      .map((item) => ({
        grade: profileId,
        unit: item.sourceUnitId,
        problemType: item.kind === 'choice' ? 'mcq' : 'short',
        isCorrect: equivalent(coreAnswers[item.id], item.answer),
        answer: coreAnswers[item.id],
      })));
  }

  useEffect(() => {
    if (!ready) return;
    QRCode.toDataURL(buildUrl(seed, profileId, unitId), { width: 220, margin: 1, errorCorrectionLevel: 'M', color: { dark: '#1f2733', light: '#fffefb' } }).then(setQrDataUrl);
  }, [seed, profileId, unitId, ready]);

  const replaceUrl = useCallback((nextSeed, nextProfile, nextUnit, nextView) => window.history.replaceState({}, '', buildUrl(nextSeed, nextProfile, nextUnit, nextView)), []);
  function reset(nextSeed, nextProfile = profileId, nextUnit = unitId) {
    setSeed(nextSeed); setProfileId(nextProfile); setUnitId(nextUnit); setView('problems'); setAnswers({}); setChecked(false);
    replaceUrl(nextSeed, nextProfile, nextUnit, 'problems');
  }
  function chooseCategory(nextCategory) {
    const nextUnit = units.find((item) => item.category === nextCategory);
    setCategory(nextCategory);
    reset(createSeed(), profileId, nextUnit.id);
  }
  function chooseUnit(nextUnit) { reset(createSeed(), profileId, nextUnit); }
  function changeView(nextView) { setView(nextView); setChecked(false); replaceUrl(seed, profileId, unitId, nextView); }
  function changeAnswer(id, value) { setAnswers((current) => ({ ...current, [id]: value })); setChecked(false); }

  function checkAnswers() {
    setChecked(true);
    recordAttempts(user, problems
      .filter((item) => answers[item.id] !== undefined && answers[item.id] !== '')
      .map((item) => ({
        grade: profileId,
        unit: unit.id,
        problemType: item.kind === 'choice' ? 'mcq' : 'short',
        isCorrect: equivalent(answers[item.id], item.answer),
        answer: answers[item.id],
      })));
  }

  const unitLabel = localizePreAlgebraUnit(unit, language);
  const unitDescription = localizePreAlgebraUnit(unit, language, 'description');
  const profileLabel = preAlgebraProfileLabel(profile, language);

  return <div className="worksheet-app pre-algebra-app">
    <section className="worksheet-controls pre-algebra-controls no-print" aria-label={tr(language, 'worksheetSettings')}>
      {/* A full cross-curriculum "jump to any subject" dropdown here duplicated the job the
          curriculum explorer already does to get you to this specific profile in the first
          place — landing on e.g. Algebra 1 and immediately being offered a from-scratch pick
          across Korea Middle/High + every international course read as two competing paths to
          the same choice. This is now a plain label; switching subjects goes through /curriculum
          (the one place that job belongs), while Domain/Skill below still switch freely within
          the current subject. */}
      <div className="control-group control-group-profile">
        <label>{copy.controls[0]}</label>
        <div className="current-profile-badge">
          <strong>{profileLabel}</strong>
          <a href="/curriculum">{language === 'ko' ? '다른 과정 보기 ↗' : 'Other curricula ↗'}</a>
        </div>
      </div>
      <div className="control-group control-group-mode">
        <label>{language === 'ko' ? '생성 방식' : 'Mode'}</label>
        <div className="mode-toggle">
          <button type="button" className={mode === 'single' ? 'active' : ''} onClick={() => setMode('single')}>{language === 'ko' ? '단원별 연습' : 'By Unit'}</button>
          <button type="button" className={mode === 'core' ? 'active' : ''} onClick={() => setMode('core')}>{language === 'ko' ? '종합 테스트 만들기' : 'Core Practice Test'}</button>
        </div>
      </div>
      {mode === 'single' ? <>
      <div className="control-group control-group-domain">
        <label htmlFor="pre-algebra-category">{copy.controls[1]}</label>
        <select id="pre-algebra-category" value={category} onChange={(event) => chooseCategory(event.target.value)}>
          {categories.map((item) => <option key={item} value={item}>{preAlgebraCategory(item, language)}</option>)}
        </select>
      </div>
      <div className="control-group control-group-skill">
        <label htmlFor="pre-algebra-unit">{tr(language, 'skill')}</label>
        <select id="pre-algebra-unit" value={unitId} onChange={(event) => chooseUnit(event.target.value)}>
          {visibleUnits.map((item) => <option key={item.id} value={item.id}>{localizePreAlgebraUnit(item, language)}</option>)}
        </select>
      </div>
      </> : null}
      {mode === 'core' ? <div className="control-group control-group-core-tier">
        <label>{language === 'ko' ? '난이도 상한' : 'Difficulty Ceiling'}</label>
        <div className="tier-toggle">
          {['basic', 'intermediate', 'advanced'].map((tier) => (
            <button type="button" key={tier} className={coreTierCeiling === tier ? 'active' : ''} onClick={() => { setCoreTierCeiling(tier); setCoreChecked(false); }}>
              {language === 'ko' ? `${TIER_LABELS[tier].ko}까지` : `Up to ${TIER_LABELS[tier].en}`}
            </button>
          ))}
        </div>
      </div> : null}
      {mode === 'core' ? <div className="control-group control-group-core-count">
        <label htmlFor="core-count">{language === 'ko' ? '문제 수' : 'Problem Count'}</label>
        <input id="core-count" type="number" min={5} max={100} value={coreCount} onChange={(event) => { const next = Number(event.target.value) || 20; setCoreCount(Math.min(100, Math.max(5, next))); setCoreChecked(false); }} />
      </div> : null}
      <div className="control-actions">
        <button className="button button-secondary" onClick={() => window.print()}>{tr(language, 'printPdf')}</button>
        {mode === 'single' ? <>
          <button className="button button-secondary" onClick={() => changeView(view === 'problems' ? 'answers' : 'problems')}>{tr(language, view === 'problems' ? 'answerKey' : 'worksheet')}</button>
          <button className="button button-primary" onClick={() => reset(createSeed())}>{tr(language, 'newWorksheet')}</button>
        </> : <>
          <button className="button button-secondary" onClick={() => setCoreView(coreView === 'problems' ? 'answers' : 'problems')}>{tr(language, coreView === 'problems' ? 'answerKey' : 'worksheet')}</button>
          <button className="button button-primary" onClick={regenerateCore}>{language === 'ko' ? '테스트 생성' : 'Generate Test'}</button>
        </>}
      </div>
    </section>

    {mode === 'core' ? <section className="core-unit-picker no-print" aria-label={language === 'ko' ? '단원 선택' : 'Select units'}>
      <p className="core-unit-picker-hint">{language === 'ko'
        ? `시험 범위에 해당하는 단원을 모두 선택하세요. 현재 ${coreSelectedUnitIds.length}개 단원 선택됨.`
        : `Select every unit that's in scope for the test. ${coreSelectedUnitIds.length} unit(s) selected.`}</p>
      {categories.map((categoryName) => {
        const unitsInCategory = units.filter((item) => item.category === categoryName);
        const allSelected = unitsInCategory.every((item) => coreSelectedUnitIds.includes(item.id));
        return <div className="core-unit-category" key={categoryName}>
          <div className="core-unit-category-header">
            <strong>{preAlgebraCategory(categoryName, language)}</strong>
            <button type="button" className="button-link" onClick={() => toggleCoreCategory(categoryName)}>{allSelected ? (language === 'ko' ? '전체 해제' : 'Deselect all') : (language === 'ko' ? '전체 선택' : 'Select all')}</button>
          </div>
          <div className="core-unit-list">
            {unitsInCategory.map((item) => {
              const outOfRange = !tierWithin(item.tier, coreTierCeiling);
              return <label key={item.id} className={`core-unit-checkbox${outOfRange ? ' out-of-range' : ''}`}>
                <input type="checkbox" checked={coreSelectedUnitIds.includes(item.id)} onChange={() => toggleCoreUnit(item.id)} />
                <span>{localizePreAlgebraUnit(item, language)}</span>
                {item.tier ? <em className={`tier-tag tier-${item.tier}`}>{language === 'ko' ? TIER_LABELS[item.tier].ko : TIER_LABELS[item.tier].en}</em> : null}
              </label>;
            })}
          </div>
        </div>;
      })}
    </section> : null}

    {mode === 'single' ? <div className={`worksheet-paper middle-worksheet ${view === 'answers' ? 'answer-sheet' : ''}`}>
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
            <span className="problem-number">{item.id}</span><div className="word-calculation"><p><MathText value={prompt} /></p>
              {expression ? <strong className="word-expression font-mono"><MathText value={expression} /></strong> : null}
              <ProblemVisual item={item} language={language} />
              <div className="word-answer"><span>{tr(language, 'answer')}</span>{item.kind === 'choice' && choices ? <div className="choice-answer">{view === 'answers' ? <strong>{choices[Number(item.answer) - 1]}</strong> : choices.map((choice, index) => <button type="button" key={`${choice}-${index}`} className={value === String(index + 1) ? 'selected' : ''} onClick={() => changeAnswer(item.id, String(index + 1))}>{choice}</button>)}</div> : <span className="inline-answer">{view === 'answers' ? <strong><MathText value={item.answer} /></strong> : <><input aria-label={`${tr(language, 'answer')} ${item.id}`} value={value} onChange={(event) => changeAnswer(item.id, event.target.value)} className={checked && value ? (isCorrect ? 'correct' : 'wrong') : ''} /><span className="print-answer-space" aria-hidden="true" /></>}</span>}{item.answerSuffix && !foreign ? <em>{item.answerSuffix}</em> : null}</div>
              {view === 'answers' ? <p className="generated-explanation"><strong>{foreign ? 'Why: ' : '풀이: '}</strong><MathText value={foreign ? item.explanationEn : item.explanation} /></p> : null}
            </div>{checked && view === 'problems' && value ? <span className={`result-mark ${isCorrect ? 'correct' : 'wrong'}`}>{tr(language, isCorrect ? 'correct' : 'tryAgain')}</span> : null}
          </article>;
        })}
      </section>
      <footer className="worksheet-footer"><span className="worksheet-signature">Built &amp; Designed by Chae</span><span>{tr(language, 'dailyLab')}</span><span>{seed} · {profileLabel} · {unitLabel}</span></footer>
    </div> : null}

    {mode === 'core' ? (coreProblems.length === 0 ? <p className="core-empty-notice no-print">{language === 'ko'
      ? '선택한 단원과 난이도 상한에 해당하는 문제를 만들 수 없습니다. 단원을 하나 이상 선택하세요.'
      : 'No problems can be generated for the selected units and difficulty ceiling. Select at least one unit.'}</p> : <div className={`worksheet-paper middle-worksheet ${coreView === 'answers' ? 'answer-sheet' : ''}`}>
      <header className="worksheet-heading"><div className="worksheet-brand"><span className="brand-mark">DAILY</span><strong>{tr(language, 'dailyLab')}</strong></div><div className="worksheet-title"><span>{profileLabel}</span><h2>{language === 'ko' ? '종합 테스트' : 'Core Practice Test'} {tr(language, coreView === 'answers' ? 'answerSheet' : 'worksheetWord')}</h2><p>{language === 'ko' ? `${coreSelectedUnitIds.length}개 단원 · ${coreProblems.length}문항 · 난이도 ${TIER_LABELS[coreTierCeiling].ko}까지` : `${coreSelectedUnitIds.length} units · ${coreProblems.length} problems · up to ${TIER_LABELS[coreTierCeiling].en}`}</p></div><div className="worksheet-identity"><div><span>{tr(language, 'worksheetId')}</span><strong>{coreSeed}</strong></div></div></header>
      <div className="student-row"><span>{tr(language, 'name')}</span><i /><span>{tr(language, 'date')}</span><i /><span className="sheet-kind">{language === 'ko' ? `${coreProblems.length}문항` : `${coreProblems.length} problems`}</span></div>
      <section className="problem-grid word-problem-grid prime-problem-grid" aria-label={language === 'ko' ? '종합 테스트 문제' : 'core practice problems'}>
        {coreProblems.map((item) => {
          const value = coreAnswers[item.id] || '';
          const isCorrect = equivalent(value, item.answer);
          const prompt = foreign && item.promptEn ? item.promptEn : item.prompt;
          const expression = foreign && item.expressionEn ? item.expressionEn : item.expression;
          const choices = foreign ? item.choicesEn : item.choicesKo;
          return <article className={`vertical-problem word-problem prime-problem${hasProblemVisual(item) ? ' graphic-problem' : ''}`} key={item.id}>
            <span className="problem-number">{item.id}</span><div className="word-calculation">
              <p className="core-source-unit">{foreign ? item.sourceUnitLabelEn : item.sourceUnitLabel}</p>
              <p><MathText value={prompt} /></p>
              {expression ? <strong className="word-expression font-mono"><MathText value={expression} /></strong> : null}
              <ProblemVisual item={item} language={language} />
              <div className="word-answer"><span>{tr(language, 'answer')}</span>{item.kind === 'choice' && choices ? <div className="choice-answer">{coreView === 'answers' ? <strong>{choices[Number(item.answer) - 1]}</strong> : choices.map((choice, index) => <button type="button" key={`${choice}-${index}`} className={value === String(index + 1) ? 'selected' : ''} onClick={() => changeCoreAnswer(item.id, String(index + 1))}>{choice}</button>)}</div> : <span className="inline-answer">{coreView === 'answers' ? <strong><MathText value={item.answer} /></strong> : <><input aria-label={`${tr(language, 'answer')} ${item.id}`} value={value} onChange={(event) => changeCoreAnswer(item.id, event.target.value)} className={coreChecked && value ? (isCorrect ? 'correct' : 'wrong') : ''} /><span className="print-answer-space" aria-hidden="true" /></>}</span>}{item.answerSuffix && !foreign ? <em>{item.answerSuffix}</em> : null}</div>
              {coreView === 'answers' ? <p className="generated-explanation"><strong>{foreign ? 'Why: ' : '풀이: '}</strong><MathText value={foreign ? item.explanationEn : item.explanation} /></p> : null}
            </div>{coreChecked && coreView === 'problems' && value ? <span className={`result-mark ${isCorrect ? 'correct' : 'wrong'}`}>{tr(language, isCorrect ? 'correct' : 'tryAgain')}</span> : null}
          </article>;
        })}
      </section>
      <footer className="worksheet-footer"><span className="worksheet-signature">Built &amp; Designed by Chae</span><span>{tr(language, 'dailyLab')}</span><span>{coreSeed} · {profileLabel}</span></footer>
    </div>) : null}

    {mode === 'single' && view === 'problems' ? <section className="grading-panel no-print"><div><strong>{tr(language, 'solveTablet')}</strong><p>{foreign ? 'Fractions: 3/4 · Coordinates: 2,-3 · Inequalities: x<=4' : '분수는 3/4, 좌표는 2,-3, 부등식은 x<=4처럼 입력할 수 있습니다.'}</p></div><button className="button button-primary" onClick={checkAnswers}>{tr(language, 'checkAnswers')}</button>{checked ? <strong className="score">{tr(language, 'score', { count: correctCount })}</strong> : null}</section> : null}
    {mode === 'core' && coreView === 'problems' && coreProblems.length > 0 ? <section className="grading-panel no-print"><div><strong>{tr(language, 'solveTablet')}</strong><p>{foreign ? 'Fractions: 3/4 · Coordinates: 2,-3 · Inequalities: x<=4' : '분수는 3/4, 좌표는 2,-3, 부등식은 x<=4처럼 입력할 수 있습니다.'}</p></div><button className="button button-primary" onClick={checkCoreAnswers}>{tr(language, 'checkAnswers')}</button>{coreChecked ? <strong className="score">{tr(language, 'score', { count: coreCorrectCount })}</strong> : null}</section> : null}

    <style jsx global>{`
      .pre-algebra-controls { display: flex; align-items: flex-start; gap: 16px; }
      .pre-algebra-controls .control-group-profile { flex: 1.2; min-width: 220px; }
      .pre-algebra-controls .control-group-domain { flex: 0.85; min-width: 140px; }
      .pre-algebra-controls .control-group-skill { flex: 1.35; min-width: 220px; }
      .pre-algebra-controls .control-actions { margin-top: 26px; flex-shrink: 0; }
      .pre-algebra-controls select { width: 100%; }
      .current-profile-badge { display: flex; align-items: center; justify-content: space-between; gap: 10px; width: 100%; height: 44px; padding: 0 14px; box-sizing: border-box; border: 1px solid var(--paper-line, #d1d5db); border-radius: 9px; background: var(--paper, #f3f4f6); }
      .current-profile-badge strong { font-size: 14px; color: var(--ink, #111827); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .current-profile-badge a { flex-shrink: 0; font-size: 12px; font-weight: 600; color: var(--chalk-green, #245c59); text-decoration: none; }
      .current-profile-badge a:hover { text-decoration: underline; }
      .control-group-mode { flex: 1; min-width: 220px; }
      .mode-toggle, .tier-toggle { display: flex; gap: 6px; height: 44px; }
      .mode-toggle button, .tier-toggle button { flex: 1; border: 1px solid var(--paper-line, #d1d5db); background: var(--paper, #f3f4f6); border-radius: 8px; font-size: 12.5px; font-weight: 600; cursor: pointer; color: var(--ink-soft, #4b5563); padding: 0 8px; }
      .mode-toggle button.active, .tier-toggle button.active { background: var(--chalk-green, #245c59); border-color: var(--chalk-green, #245c59); color: #fff; }
      .control-group-core-count input { width: 100%; height: 44px; box-sizing: border-box; border: 1px solid var(--paper-line, #d1d5db); border-radius: 8px; padding: 0 12px; font-size: 14px; }
      .core-unit-picker { margin: 4px 0 16px; padding: 14px 16px; border: 1px solid var(--paper-line, #d1d5db); border-radius: 10px; background: var(--paper, #f9fafb); }
      .core-unit-picker-hint { margin: 0 0 10px; font-size: 12.5px; color: var(--ink-soft, #4b5563); }
      .core-unit-category { margin-bottom: 10px; }
      .core-unit-category-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
      .core-unit-category-header strong { font-size: 13px; }
      .button-link { background: none; border: none; color: var(--chalk-green, #245c59); font-size: 12px; font-weight: 600; cursor: pointer; padding: 0; }
      .core-unit-list { display: flex; flex-wrap: wrap; gap: 6px; }
      .core-unit-checkbox { display: inline-flex; align-items: center; gap: 5px; border: 1px solid var(--paper-line, #d1d5db); border-radius: 7px; padding: 5px 9px; font-size: 12.5px; cursor: pointer; background: #fff; }
      .core-unit-checkbox.out-of-range { opacity: 0.45; }
      .core-unit-checkbox input { margin: 0; }
      .tier-tag { font-style: normal; font-size: 10px; padding: 1px 5px; border-radius: 999px; }
      .tier-tag.tier-basic { background: #e0f2e9; color: #1a7a4c; }
      .tier-tag.tier-intermediate { background: #fef3c7; color: #92640a; }
      .tier-tag.tier-advanced { background: #fde2e2; color: #b91c1c; }
      .core-source-unit { margin: 0 0 4px; font-size: 11px; color: var(--ink-soft, #4b5563); font-weight: 600; }
      .core-empty-notice { padding: 20px; text-align: center; color: var(--ink-soft, #4b5563); border: 1px dashed var(--paper-line, #d1d5db); border-radius: 10px; }
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
      @media (max-width: 1060px) {
        .pre-algebra-controls { flex-wrap: wrap; }
        .pre-algebra-controls .control-group-profile,
        .pre-algebra-controls .control-group-domain,
        .pre-algebra-controls .control-group-skill { flex: 1 1 calc(33.333% - 12px); min-width: 180px; }
        .pre-algebra-controls .control-actions { margin-top: 8px; width: 100%; justify-content: flex-end; }
      }
      @media (max-width: 768px) {
        .pre-algebra-controls { flex-direction: column; align-items: stretch; gap: 12px; }
        .pre-algebra-controls .control-group-profile,
        .pre-algebra-controls .control-group-domain,
        .pre-algebra-controls .control-group-skill { width: 100%; min-width: 0; }
        .pre-algebra-controls .control-actions { margin-top: 6px; width: 100%; justify-content: stretch; }
        .pre-algebra-controls .control-actions .button { flex: 1 1 110px; }
      }
      @media print { .generated-explanation { break-inside: avoid; } }
    `}</style>
  </div>;
}
