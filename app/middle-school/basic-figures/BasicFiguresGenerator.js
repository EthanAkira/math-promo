'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import { findBasicFigureUnit, localizeBasicFigureUnit, BASIC_FIGURE_UNITS } from './catalog';
import GeometryDiagram from './GeometryDiagram';
import { findGeometryProfile, GEOMETRY_PROFILES } from './geometryProfiles';
import MathText from '../../components/MathText';
import { useLanguage } from '../../language';
import { useAuth } from '../../auth';
import { isNonKorean, tr } from '../../i18n';
import { recordAttempts } from '../../lib/submissions';

const PROBLEM_COUNT = 20;

// Pilot scope for the server-side "advanced tier" (functions/api/curriculum-advanced) — only
// these unit ids have advanced content today. This is just a routing list of ids, not the
// generation logic itself (that lives entirely under functions/ and is never bundled here).
const ADVANCED_UNIT_IDS = new Set([
  'transform-translation', 'transform-reflection', 'transform-rotation', 'transform-dilation', 'transform-dilation-area',
  'logic-truth-tables', 'logic-conditional-forms', 'logic-detachment-syllogism', 'logic-segment-angle-properties',
]);

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

function shuffle(random, values) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function asAmcChoice(item, random) {
  if (item.choices) return item;
  const answer = String(item.answer);
  let candidates = [answer];
  if (item.distractors?.length) {
    candidates.push(...item.distractors.map((distractor) => String(distractor.value)));
  } else if (/^-?\d+(?:\.\d+)?$/.test(answer)) {
    const value = Number(answer);
    candidates.push(String(value + 1), String(value - 1), String(value + 2), String(value - 2), String(value * 2));
  } else if (/^-?\d+\/\d+$/.test(answer)) {
    const [n, d] = answer.split('/').map(Number);
    candidates.push(`${d}/${n}`, `${n + 1}/${d}`, `${n}/${d + 1}`, `${n + d}/${d}`, '1');
  } else if (/^-?\d+,-?\d+$/.test(answer)) {
    const [a, b] = answer.split(',').map(Number);
    candidates.push(`${b},${a}`, `${-a},${b}`, `${a},${-b}`, `${-a},${-b}`, '0,0');
  } else if (answer.includes('π')) {
    const coefficient = Number(answer.replace('π', '')) || 1;
    candidates.push(`${coefficient + 1}π`, `${Math.max(1, coefficient - 1)}π`, `${coefficient * 2}π`, `${coefficient}π/2`, 'π');
  } else {
    candidates.push('0', '1', '2', 'not enough information', 'none');
  }
  const labels = shuffle(random, [...new Set(candidates)].slice(0, 5));
  while (labels.length < 5) labels.push(String(labels.length + 10));
  const answerIndex = labels.indexOf(answer) + 1;
  const diagnostics = Object.fromEntries((item.distractors || []).map((distractor) => [String(distractor.value), distractor.reason]));
  return {
    ...item,
    answer: String(answerIndex),
    originalAnswer: answer,
    answerSuffix: '',
    choiceDiagnostics: labels.map((label, index) => ({ marker: String.fromCharCode(65 + index), label, reason: diagnostics[label] || '' })),
    choices: labels.map((label, index) => ({ value: String(index + 1), marker: String.fromCharCode(65 + index), label, labelEn: label })),
  };
}

const DIFFICULTY_TIER_ORDER = { basic: 0, intermediate: 1, advanced: 2 };
const DIFFICULTY_TIER_LABELS = {
  basic: { ko: '하', en: 'Basic' },
  intermediate: { ko: '중', en: 'Intermediate' },
  advanced: { ko: '상', en: 'Advanced' },
};
function difficultyTierWithin(unitTier, ceiling) {
  if (!unitTier) return true;
  return DIFFICULTY_TIER_ORDER[unitTier] <= DIFFICULTY_TIER_ORDER[ceiling];
}

function makeCombinedProblems(seed, unitIds, difficultyCeiling, count, units, profile) {
  const eligibleUnits = units.filter((item) => unitIds.includes(item.id) && difficultyTierWithin(item.tier, difficultyCeiling));
  if (!eligibleUnits.length) return [];
  const random = seededRandom(`${seed}:core:${unitIds.join(',')}:${difficultyCeiling}:${count}:${profile.id}`);
  const used = new Set();
  const pool = [];
  let index = 0;
  let guard = 0;
  while (pool.length < count && guard < count * 25) {
    guard += 1;
    const unit = eligibleUnits[index % eligibleUnits.length];
    index += 1;
    let item = unit.make(random, profile);
    if (profile.id === 'amc12' || (profile.id === 'csat' && item.distractors?.length)) item = asAmcChoice(item, random);
    const uniquenessKey = `${unit.id}|${item.prompt}|${item.expression}|${JSON.stringify(item.diagram)}|${item.originalAnswer || item.answer}`;
    if (used.has(uniquenessKey) && guard < count * 20) continue;
    used.add(uniquenessKey);
    pool.push({ sourceUnitId: unit.id, sourceUnit: unit, ...item });
  }
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.map((item, position) => ({ id: position + 1, ...item }));
}

function makeProblems(seed, unit, profile) {
  const random = seededRandom(`${seed}:${unit.id}:${profile.id}`);
  const used = new Set();
  return Array.from({ length: PROBLEM_COUNT }, (_, index) => {
    let item;
    let uniquenessKey;
    let attempt = 0;
    do {
      item = unit.make(random, profile);
      if (profile.id === 'amc12' || (profile.id === 'csat' && item.distractors?.length)) item = asAmcChoice(item, random);
      uniquenessKey = `${item.prompt}|${item.expression}|${JSON.stringify(item.diagram)}|${item.originalAnswer || item.answer}`;
      attempt += 1;
    } while (used.has(uniquenessKey) && attempt < 80);
    used.add(uniquenessKey);
    return { id: index + 1, ...item };
  });
}

function normalizeAnswer(value) {
  return String(value).toLowerCase().replace(/pi/g, 'π').replace(/[×*]/g, 'x').replace(/\s*\^\s*/g, '^').replace(/\s*x\s*/g, 'x').replace(/\s*,\s*/g, ',').replace(/[()]/g, '').replace(/\s+/g, '').trim();
}

function buildUrl(seed, unitId, profileId, view = 'problems') {
  const url = new URL(window.location.href);
  url.searchParams.set('sheet', seed);
  url.searchParams.set('unit', unitId);
  url.searchParams.set('profile', profileId);
  if (view === 'answers') url.searchParams.set('view', 'answers');
  else url.searchParams.delete('view');
  return url.toString();
}

export default function BasicFiguresGenerator() {
  const { language } = useLanguage();
  const { user, status: authStatus } = useAuth();
  const foreign = isNonKorean(language);
  const [unitId, setUnitId] = useState('visual-foundations');
  const [profileId, setProfileId] = useState('kr');
  const [seed, setSeed] = useState('PREVIEW1');
  const [view, setView] = useState('problems');
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [ready, setReady] = useState(false);
  const [tier, setTier] = useState('basic');
  const [advancedSubStatus, setAdvancedSubStatus] = useState('loading');
  const [advancedProblems, setAdvancedProblems] = useState(null);
  const [advancedState, setAdvancedState] = useState('idle');
  const [mode, setMode] = useState('single');
  const [coreSelectedUnitIds, setCoreSelectedUnitIds] = useState([]);
  const [coreDifficultyCeiling, setCoreDifficultyCeiling] = useState('advanced');
  const [coreCount, setCoreCount] = useState(20);
  const [coreSeed, setCoreSeed] = useState('');
  const [coreAnswers, setCoreAnswers] = useState({});
  const [coreChecked, setCoreChecked] = useState(false);
  const [coreView, setCoreView] = useState('problems');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialProfile = findGeometryProfile(params.get('profile')).id;
    const requestedUnit = findBasicFigureUnit(params.get('unit'));
    const initialUnit = !requestedUnit.profiles || requestedUnit.profiles.includes(initialProfile) ? requestedUnit.id : 'visual-foundations';
    const initialSeed = (params.get('sheet') || createSeed()).toUpperCase();
    const initialView = params.get('view') === 'answers' ? 'answers' : 'problems';
    setUnitId(initialUnit); setProfileId(initialProfile); setSeed(initialSeed); setView(initialView);
    window.history.replaceState({}, '', buildUrl(initialSeed, initialUnit, initialProfile, initialView));
    setReady(true);
  }, []);

  const unit = findBasicFigureUnit(unitId);
  const profile = findGeometryProfile(profileId);
  const availableUnits = useMemo(() => BASIC_FIGURE_UNITS.filter((item) => !item.profiles || item.profiles.includes(profileId)), [profileId]);
  const basicProblems = useMemo(() => makeProblems(seed, unit, profile), [seed, unit, profile]);
  const hasAdvancedContent = ADVANCED_UNIT_IDS.has(unitId);
  const coreCategories = useMemo(() => [...new Set(availableUnits.map((item) => item.category).filter(Boolean))], [availableUnits]);

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
    const idsInCategory = availableUnits.filter((item) => item.category === categoryName).map((item) => item.id);
    const allSelected = idsInCategory.every((id) => coreSelectedUnitIds.includes(id));
    setCoreSelectedUnitIds((current) => (allSelected
      ? current.filter((id) => !idsInCategory.includes(id))
      : [...new Set([...current, ...idsInCategory])]));
    setCoreChecked(false);
  }
  const coreProblems = useMemo(
    () => (coreSeed ? makeCombinedProblems(coreSeed, coreSelectedUnitIds, coreDifficultyCeiling, coreCount, availableUnits, profile) : []),
    [coreSeed, coreSelectedUnitIds, coreDifficultyCeiling, coreCount, availableUnits, profile],
  );
  const coreCorrectCount = coreProblems.filter((item) => normalizeAnswer(coreAnswers[item.id]) === normalizeAnswer(item.answer)).length;
  function regenerateCore() { setCoreSeed(createSeed()); setCoreAnswers({}); setCoreChecked(false); setCoreView('problems'); }
  function changeCoreAnswer(id, value) { setCoreAnswers((current) => ({ ...current, [id]: value })); setCoreChecked(false); }
  function checkCoreAnswers() {
    setCoreChecked(true);
    recordAttempts(user, coreProblems
      .filter((item) => coreAnswers[item.id] !== undefined && coreAnswers[item.id] !== '')
      .map((item) => ({
        grade: profileId,
        unit: item.sourceUnitId,
        problemType: item.choices ? 'mcq' : 'short',
        isCorrect: normalizeAnswer(coreAnswers[item.id]) === normalizeAnswer(item.answer),
        answer: coreAnswers[item.id],
      })));
  }

  // Subscription check for the separate 'curriculum-advanced' subject, mirroring the AMC/CSAT
  // archive's login+subscription gating pattern (app/amc/units/AmcUnitBrowser.js).
  useEffect(() => {
    if (authStatus !== 'ready') return;
    if (!user) { setAdvancedSubStatus('inactive'); return; }
    let cancelled = false;
    setAdvancedSubStatus('loading');
    fetch('/api/subscriptions/status?subject=curriculum-advanced')
      .then((res) => res.json())
      .then((data) => { if (!cancelled) setAdvancedSubStatus(data.active ? 'active' : 'inactive'); })
      .catch(() => { if (!cancelled) setAdvancedSubStatus('inactive'); });
    return () => { cancelled = true; };
  }, [authStatus, user]);

  const advancedEntitled = authStatus === 'ready' && !!user && advancedSubStatus === 'active';

  // Advanced-tier problems are generated server-side (functions/api/curriculum-advanced/generate.js)
  // and fetched only once the viewer is confirmed entitled — unlike basicProblems above, this is
  // never computed client-side, so the generation logic itself is never exposed to the browser.
  useEffect(() => {
    if (tier !== 'advanced' || !advancedEntitled || !hasAdvancedContent) return;
    let cancelled = false;
    setAdvancedState('loading');
    const params = new URLSearchParams({ unit: unitId, profile: profileId, seed });
    fetch(`/api/curriculum-advanced/generate?${params.toString()}`)
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (cancelled) return;
        if (!ok || !Array.isArray(data.problems)) { setAdvancedState('error'); return; }
        setAdvancedProblems(data.problems);
        setAdvancedState('ready');
      })
      .catch(() => { if (!cancelled) setAdvancedState('error'); });
    return () => { cancelled = true; };
  }, [tier, advancedEntitled, hasAdvancedContent, unitId, profileId, seed]);

  const showingAdvanced = tier === 'advanced' && advancedState === 'ready' && advancedProblems;
  const problems = showingAdvanced ? advancedProblems : basicProblems;
  const correctCount = problems.filter((item) => normalizeAnswer(answers[item.id]) === normalizeAnswer(item.answer)).length;

  useEffect(() => {
    if (!ready) return;
    QRCode.toDataURL(buildUrl(seed, unitId, profileId), { width: 220, margin: 1, errorCorrectionLevel: 'M', color: { dark: '#1f2733', light: '#fffefb' } }).then(setQrDataUrl);
  }, [seed, unitId, profileId, ready]);

  function chooseTier(nextTier) {
    if (nextTier === tier) return;
    if (nextTier === 'advanced') {
      if (authStatus !== 'ready' || advancedSubStatus === 'loading') return;
      if (!user) { window.alert(tr(language, 'advancedAlertNeedLogin')); return; }
      if (advancedSubStatus !== 'active') { window.alert(tr(language, 'advancedAlertNeedSub')); return; }
      if (!hasAdvancedContent) { window.alert(tr(language, 'advancedNotReady')); return; }
    }
    setTier(nextTier); setAnswers({}); setChecked(false);
  }

  const replaceUrl = useCallback((nextSeed, nextUnit, nextProfile, nextView) => {
    window.history.replaceState({}, '', buildUrl(nextSeed, nextUnit, nextProfile, nextView));
  }, []);

  function reset(nextSeed, nextUnit = unitId, nextProfile = profileId) {
    setSeed(nextSeed); setUnitId(nextUnit); setProfileId(nextProfile); setView('problems'); setAnswers({}); setChecked(false);
    setTier('basic'); setAdvancedState('idle'); setAdvancedProblems(null);
    replaceUrl(nextSeed, nextUnit, nextProfile, 'problems');
  }

  function chooseUnit(nextUnit) { reset(createSeed(), nextUnit); }
  function chooseProfile(nextProfile) {
    const nextUnit = BASIC_FIGURE_UNITS.find((item) => item.id === unitId && (!item.profiles || item.profiles.includes(nextProfile)))?.id || 'visual-foundations';
    reset(createSeed(), nextUnit, nextProfile);
  }
  function changeView(nextView) { setView(nextView); setChecked(false); replaceUrl(seed, unitId, profileId, nextView); }
  function changeAnswer(id, value) { setAnswers((current) => ({ ...current, [id]: value })); setChecked(false); }

  function checkAnswers() {
    setChecked(true);
    recordAttempts(user, problems
      .filter((item) => answers[item.id] !== undefined && answers[item.id] !== '')
      .map((item) => ({
        grade: profileId,
        unit: unit.id,
        problemType: item.choices ? 'mcq' : 'short',
        isCorrect: normalizeAnswer(answers[item.id]) === normalizeAnswer(item.answer),
        answer: answers[item.id],
      })));
  }

  const contentLocale = profile.locale;
  const unitLabel = localizeBasicFigureUnit(unit, contentLocale);
  const unitDescription = localizeBasicFigureUnit(unit, contentLocale, 'description');

  const koreanProfiles = GEOMETRY_PROFILES.filter((item) => ['kr', 'csat'].includes(item.id));
  const internationalProfiles = GEOMETRY_PROFILES.filter((item) => !['kr', 'csat'].includes(item.id));

  return <div className="worksheet-app">
    <section className="worksheet-controls no-print" aria-label={tr(language, 'worksheetSettings')}>
      <div className="control-group control-group-profile">
        <label htmlFor="geometry-profile">{language === 'ko' ? '교육과정 · 시험' : 'Curriculum · exam'}</label>
        <select id="geometry-profile" value={profileId} onChange={(event) => chooseProfile(event.target.value)}>
          <optgroup label={language === 'ko' ? '🇰🇷 한국 교육과정 (중등 · 고등)' : '🇰🇷 Korea Curricula (Middle & High)'}>
            {koreanProfiles.map((item) => <option key={item.id} value={item.id}>{language === 'ko' ? item.label : (item.labelEn || item.label)}</option>)}
          </optgroup>
          <optgroup label={language === 'ko' ? '🌐 국제학교 및 경시대회' : '🌐 International & Competitions'}>
            {internationalProfiles.map((item) => <option key={item.id} value={item.id}>{language === 'ko' ? item.label : (item.labelEn || item.label)}</option>)}
          </optgroup>
        </select>
      </div>
      {mode === 'single' ? <div className="control-group control-group-skill">
        <label htmlFor="basic-figures-unit">{tr(language, 'skill')}</label>
        <select id="basic-figures-unit" value={unitId} onChange={(event) => chooseUnit(event.target.value)}>
          {availableUnits.map((item) => <option key={item.id} value={item.id}>{localizeBasicFigureUnit(item, contentLocale)}</option>)}
        </select>
      </div> : null}
      <div className="control-group control-group-mode">
        <label>{language === 'ko' ? '생성 방식' : 'Mode'}</label>
        <div className="mode-toggle">
          <button type="button" className={mode === 'single' ? 'active' : ''} onClick={() => setMode('single')}>{language === 'ko' ? '단원별 연습' : 'By Unit'}</button>
          <button type="button" className={mode === 'core' ? 'active' : ''} onClick={() => setMode('core')}>{language === 'ko' ? '종합 테스트 만들기' : 'Core Practice Test'}</button>
        </div>
      </div>
      {mode === 'core' ? <div className="control-group control-group-core-tier">
        <label>{language === 'ko' ? '난이도 상한' : 'Difficulty Ceiling'}</label>
        <div className="difficulty-toggle">
          {['basic', 'intermediate', 'advanced'].map((difficultyTier) => (
            <button type="button" key={difficultyTier} className={coreDifficultyCeiling === difficultyTier ? 'active' : ''} onClick={() => { setCoreDifficultyCeiling(difficultyTier); setCoreChecked(false); }}>
              {language === 'ko' ? `${DIFFICULTY_TIER_LABELS[difficultyTier].ko}까지` : `Up to ${DIFFICULTY_TIER_LABELS[difficultyTier].en}`}
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
      {coreCategories.map((categoryName) => {
        const unitsInCategory = availableUnits.filter((item) => item.category === categoryName);
        const allSelected = unitsInCategory.every((item) => coreSelectedUnitIds.includes(item.id));
        return <div className="core-unit-category" key={categoryName}>
          <div className="core-unit-category-header">
            <strong>{categoryName}</strong>
            <button type="button" className="button-link" onClick={() => toggleCoreCategory(categoryName)}>{allSelected ? (language === 'ko' ? '전체 해제' : 'Deselect all') : (language === 'ko' ? '전체 선택' : 'Select all')}</button>
          </div>
          <div className="core-unit-list">
            {unitsInCategory.map((item) => {
              const outOfRange = !difficultyTierWithin(item.tier, coreDifficultyCeiling);
              return <label key={item.id} className={`core-unit-checkbox${outOfRange ? ' out-of-range' : ''}`}>
                <input type="checkbox" checked={coreSelectedUnitIds.includes(item.id)} onChange={() => toggleCoreUnit(item.id)} />
                <span>{localizeBasicFigureUnit(item, contentLocale)}</span>
                {item.tier ? <em className={`difficulty-tag difficulty-${item.tier}`}>{language === 'ko' ? DIFFICULTY_TIER_LABELS[item.tier].ko : DIFFICULTY_TIER_LABELS[item.tier].en}</em> : null}
              </label>;
            })}
          </div>
        </div>;
      })}
    </section> : null}

    {mode === 'single' ? <div className="tier-toggle no-print" role="tablist" aria-label={tr(language, 'tierAdvanced')}>
      <button type="button" role="tab" aria-selected={tier === 'basic'} className={`tier-tab${tier === 'basic' ? ' active' : ''}`} onClick={() => chooseTier('basic')}>{tr(language, 'tierBasic')}</button>
      <button type="button" role="tab" aria-selected={tier === 'advanced'} className={`tier-tab${tier === 'advanced' ? ' active' : ''}`} onClick={() => chooseTier('advanced')}>{tr(language, 'tierAdvanced')}</button>
    </div> : null}

    {mode === 'single' ? (tier === 'advanced' && advancedState !== 'ready' ? (
      <div className="advanced-status no-print">
        {advancedState === 'error' ? tr(language, 'advancedError') : tr(language, 'advancedLoading')}
      </div>
    ) : <div className={`worksheet-paper middle-worksheet ${view === 'answers' ? 'answer-sheet' : ''}`}>
      <header className="worksheet-heading"><div className="worksheet-brand"><span className="brand-mark">DAILY</span><strong>{tr(language, 'dailyLab')}</strong></div><div className="worksheet-title"><span>{profile.shortLabel}</span><h2>{unitLabel} {tr(language, view === 'answers' ? 'answerSheet' : 'worksheetWord')}</h2><p>{unitDescription}</p></div><div className="worksheet-identity"><div><span>{tr(language, 'worksheetId')}</span><strong>{seed}</strong><small>{tr(language, 'scanQr')}</small></div>{qrDataUrl ? <img src={qrDataUrl} alt={`Worksheet ${seed} QR code`} /> : null}</div></header>
      <div className="student-row"><span>{tr(language, 'name')}</span><i /><span>{tr(language, 'date')}</span><i /><span className="sheet-kind">{tr(language, view === 'answers' ? 'answers' : 'problems20')}</span></div>
      <section className="problem-grid word-problem-grid prime-problem-grid" aria-label={`${unitLabel} ${foreign ? 'problems' : '문제'}`}>
        {problems.map((item) => {
          const value = answers[item.id] || '';
          const isCorrect = normalizeAnswer(value) === normalizeAnswer(item.answer);
          const selectedChoice = item.choices?.find((choice) => choice.value === item.answer);
          const localizedForeign = contentLocale !== 'ko';
          const promptText = localizedForeign && item.promptEn ? item.promptEn : item.prompt;
          const expressionText = localizedForeign && item.expressionEn ? item.expressionEn : item.expression;
          const graphic = Boolean(item.diagram);
          return <article className={`vertical-problem word-problem prime-problem${graphic ? ' graphic-problem geometry-problem' : ''}`} key={item.id}><span className="problem-number">{item.id}</span><div className="word-calculation">{item.difficulty ? <div className="difficulty-strip"><span>{contentLocale === 'ko' ? '난이도' : 'Difficulty'} {item.difficulty.level}</span><span>{item.difficulty.score}/100</span><span>{item.difficulty.reasoningSteps} {contentLocale === 'ko' ? '단계' : 'steps'}</span><span>≈{item.difficulty.estimatedMinutes} min</span></div> : null}<p><MathText value={promptText} /></p>{item.diagram ? <GeometryDiagram diagram={item.diagram} /> : null}{expressionText ? <strong className="word-expression font-mono"><MathText value={expressionText} /></strong> : null}{item.choices ? <div className="choice-answer">{view === 'answers' ? <strong>{selectedChoice?.marker || selectedChoice?.value}. <MathText value={localizedForeign ? selectedChoice?.labelEn : selectedChoice?.label} /></strong> : item.choices.map((choice) => <button type="button" key={choice.value} className={`${value === choice.value ? 'selected' : ''} ${checked && value === choice.value ? (isCorrect ? 'correct' : 'wrong') : ''}`} onClick={() => changeAnswer(item.id, choice.value)} aria-pressed={value === choice.value}><span>{choice.marker || choice.value}</span><MathText value={localizedForeign ? choice.labelEn : choice.label} /></button>)}</div> : <div className="word-answer"><span>{tr(language, 'answer')}</span><span className="inline-answer">{view === 'answers' ? <strong><MathText value={item.answer} /></strong> : <><input aria-label={`${tr(language, 'answer')} ${item.id}`} value={value} onChange={(event) => changeAnswer(item.id, event.target.value)} className={checked && value ? (isCorrect ? 'correct' : 'wrong') : ''} /><span className="print-answer-space" aria-hidden="true" /></>}</span>{item.answerSuffix ? <em>{item.answerSuffix}</em> : null}</div>}{view === 'answers' && item.explanation ? <p className="geometry-explanation"><b>{contentLocale === 'ko' ? '풀이' : contentLocale.startsWith('zh') ? '解說' : 'Solution'}</b><MathText value={item.explanation} /></p> : null}{view === 'answers' && item.solutionSteps?.length ? <ol className="geometry-solution-steps">{item.solutionSteps.map((step, index) => <li key={index}><MathText value={step} /></li>)}</ol> : null}{view === 'answers' && item.theorems?.length ? <p className="geometry-theorems"><b>{contentLocale === 'ko' ? '결합 개념' : 'Combined ideas'}</b>{item.theorems.join(' · ')}</p> : null}{view === 'answers' && item.choiceDiagnostics?.some((entry) => entry.reason) ? <details className="choice-diagnostics"><summary>{contentLocale === 'ko' ? '오답선지 진단' : 'Distractor diagnostics'}</summary>{item.choiceDiagnostics.filter((entry) => entry.reason).map((entry) => <p key={`${entry.marker}-${entry.label}`}><b>{entry.marker}. {entry.label}</b> — <MathText value={entry.reason} /></p>)}</details> : null}</div>{checked && view === 'problems' && value ? <span className={`result-mark ${isCorrect ? 'correct' : 'wrong'}`}>{tr(language, isCorrect ? 'correct' : 'tryAgain')}</span> : null}</article>;
        })}
      </section>
      <footer className="worksheet-footer"><span className="worksheet-signature">Built &amp; Designed by Chae</span><span>{tr(language, 'dailyLab')}</span><span>{seed} · {profile.shortLabel} · {unitLabel}</span></footer>
    </div>) : null}

    {mode === 'single' && (tier === 'basic' || showingAdvanced) && view === 'problems' ? <section className="grading-panel no-print"><div><strong>{tr(language, 'solveTablet')}</strong><p>{foreign ? 'Choose an option or type your numeric answer, then check.' : '객관식은 보기를 고르고, 주관식은 숫자만 입력하세요.'}</p></div><button className="button button-primary" onClick={checkAnswers}>{tr(language, 'checkAnswers')}</button>{checked ? <strong className="score">{tr(language, 'score', { count: correctCount })}</strong> : null}</section> : null}

    {mode === 'core' ? (coreProblems.length === 0 ? <p className="core-empty-notice no-print">{language === 'ko'
      ? '선택한 단원과 난이도 상한에 해당하는 문제를 만들 수 없습니다. 단원을 하나 이상 선택하세요.'
      : 'No problems can be generated for the selected units and difficulty ceiling. Select at least one unit.'}</p> : <div className={`worksheet-paper middle-worksheet ${coreView === 'answers' ? 'answer-sheet' : ''}`}>
      <header className="worksheet-heading"><div className="worksheet-brand"><span className="brand-mark">DAILY</span><strong>{tr(language, 'dailyLab')}</strong></div><div className="worksheet-title"><span>{profile.shortLabel}</span><h2>{language === 'ko' ? '종합 테스트' : 'Core Practice Test'} {tr(language, coreView === 'answers' ? 'answerSheet' : 'worksheetWord')}</h2><p>{language === 'ko' ? `${coreSelectedUnitIds.length}개 단원 · ${coreProblems.length}문항 · 난이도 ${DIFFICULTY_TIER_LABELS[coreDifficultyCeiling].ko}까지` : `${coreSelectedUnitIds.length} units · ${coreProblems.length} problems · up to ${DIFFICULTY_TIER_LABELS[coreDifficultyCeiling].en}`}</p></div><div className="worksheet-identity"><div><span>{tr(language, 'worksheetId')}</span><strong>{coreSeed}</strong></div></div></header>
      <div className="student-row"><span>{tr(language, 'name')}</span><i /><span>{tr(language, 'date')}</span><i /><span className="sheet-kind">{language === 'ko' ? `${coreProblems.length}문항` : `${coreProblems.length} problems`}</span></div>
      <section className="problem-grid word-problem-grid prime-problem-grid" aria-label={language === 'ko' ? '종합 테스트 문제' : 'core practice problems'}>
        {coreProblems.map((item) => {
          const value = coreAnswers[item.id] || '';
          const isCorrect = normalizeAnswer(value) === normalizeAnswer(item.answer);
          const selectedChoice = item.choices?.find((choice) => choice.value === item.answer);
          const localizedForeign = contentLocale !== 'ko';
          const promptText = localizedForeign && item.promptEn ? item.promptEn : item.prompt;
          const expressionText = localizedForeign && item.expressionEn ? item.expressionEn : item.expression;
          const graphic = Boolean(item.diagram);
          const sourceLabel = localizeBasicFigureUnit(item.sourceUnit, contentLocale);
          return <article className={`vertical-problem word-problem prime-problem${graphic ? ' graphic-problem geometry-problem' : ''}`} key={item.id}><span className="problem-number">{item.id}</span><div className="word-calculation"><p className="core-source-unit">{sourceLabel}</p><p><MathText value={promptText} /></p>{item.diagram ? <GeometryDiagram diagram={item.diagram} /> : null}{expressionText ? <strong className="word-expression font-mono"><MathText value={expressionText} /></strong> : null}{item.choices ? <div className="choice-answer">{coreView === 'answers' ? <strong>{selectedChoice?.marker || selectedChoice?.value}. <MathText value={localizedForeign ? selectedChoice?.labelEn : selectedChoice?.label} /></strong> : item.choices.map((choice) => <button type="button" key={choice.value} className={`${value === choice.value ? 'selected' : ''} ${coreChecked && value === choice.value ? (isCorrect ? 'correct' : 'wrong') : ''}`} onClick={() => changeCoreAnswer(item.id, choice.value)} aria-pressed={value === choice.value}><span>{choice.marker || choice.value}</span><MathText value={localizedForeign ? choice.labelEn : choice.label} /></button>)}</div> : <div className="word-answer"><span>{tr(language, 'answer')}</span><span className="inline-answer">{coreView === 'answers' ? <strong><MathText value={item.answer} /></strong> : <><input aria-label={`${tr(language, 'answer')} ${item.id}`} value={value} onChange={(event) => changeCoreAnswer(item.id, event.target.value)} className={coreChecked && value ? (isCorrect ? 'correct' : 'wrong') : ''} /><span className="print-answer-space" aria-hidden="true" /></>}</span>{item.answerSuffix ? <em>{item.answerSuffix}</em> : null}</div>}{coreView === 'answers' && item.explanation ? <p className="geometry-explanation"><b>{contentLocale === 'ko' ? '풀이' : contentLocale.startsWith('zh') ? '解說' : 'Solution'}</b><MathText value={item.explanation} /></p> : null}</div>{coreChecked && coreView === 'problems' && value ? <span className={`result-mark ${isCorrect ? 'correct' : 'wrong'}`}>{tr(language, isCorrect ? 'correct' : 'tryAgain')}</span> : null}</article>;
        })}
      </section>
      <footer className="worksheet-footer"><span className="worksheet-signature">Built &amp; Designed by Chae</span><span>{tr(language, 'dailyLab')}</span><span>{coreSeed} · {profile.shortLabel}</span></footer>
    </div>) : null}

    {mode === 'core' && coreView === 'problems' && coreProblems.length > 0 ? <section className="grading-panel no-print"><div><strong>{tr(language, 'solveTablet')}</strong><p>{foreign ? 'Choose an option or type your numeric answer, then check.' : '객관식은 보기를 고르고, 주관식은 숫자만 입력하세요.'}</p></div><button className="button button-primary" onClick={checkCoreAnswers}>{tr(language, 'checkAnswers')}</button>{coreChecked ? <strong className="score">{tr(language, 'score', { count: coreCorrectCount })}</strong> : null}</section> : null}
    <style jsx global>{`
      .difficulty-strip { display:flex; flex-wrap:wrap; gap:5px; margin:0 0 7px; }
      .difficulty-strip span { padding:3px 7px; border-radius:999px; background:#fff2d8; color:#7c4a08; border:1px solid #e7bd79; font-size:10px; font-weight:800; }
      .geometry-solution-steps { margin:8px 0 0; padding:8px 10px 8px 30px; border-left:3px solid #5b8db8; background:#f3f7fc; font-size:12px; line-height:1.55; }
      .geometry-solution-steps li + li { margin-top:4px; }
      .geometry-theorems { margin:7px 0 0; font-size:11px; color:#475569; }.geometry-theorems b { margin-right:7px; color:#245c59; }
      .choice-diagnostics { margin-top:8px; padding:7px 9px; background:#fff8ec; border:1px solid #edcf9d; font-size:11px; }
      .choice-diagnostics summary { cursor:pointer; font-weight:800; color:#805216; }.choice-diagnostics p { margin:5px 0 0; line-height:1.45; }
      @media print { .choice-diagnostics { display:block; }.choice-diagnostics summary { display:none; } }
      .tier-toggle { display:flex; gap:8px; margin:0 0 14px; }
      .tier-tab { padding:8px 16px; border-radius:999px; border:1px solid var(--paper-line); background:#fff; font-weight:700; font-size:13px; cursor:pointer; color:var(--ink-soft); }
      .tier-tab.active { background:#1f2733; color:#fff; border-color:#1f2733; }
      .advanced-status { padding:40px 20px; text-align:center; color:var(--ink-soft); background:var(--card-bg); border:1px solid var(--paper-line); border-radius:var(--radius); }
      @media print { .tier-toggle { display:none; } }
      .control-group-mode { flex: 1; min-width: 220px; }
      .mode-toggle, .difficulty-toggle { display: flex; gap: 6px; height: 44px; }
      .mode-toggle button, .difficulty-toggle button { flex: 1; border: 1px solid var(--paper-line, #d1d5db); background: var(--card-bg, #f3f4f6); border-radius: 8px; font-size: 12.5px; font-weight: 600; cursor: pointer; color: var(--ink-soft, #4b5563); padding: 0 8px; }
      .mode-toggle button.active, .difficulty-toggle button.active { background: #1f2733; border-color: #1f2733; color: #fff; }
      .control-group-core-count input { width: 100%; height: 44px; box-sizing: border-box; border: 1px solid var(--paper-line, #d1d5db); border-radius: 8px; padding: 0 12px; font-size: 14px; }
      .core-unit-picker { margin: 4px 0 16px; padding: 14px 16px; border: 1px solid var(--paper-line, #d1d5db); border-radius: 10px; background: var(--card-bg, #f9fafb); }
      .core-unit-picker-hint { margin: 0 0 10px; font-size: 12.5px; color: var(--ink-soft, #4b5563); }
      .core-unit-category { margin-bottom: 10px; }
      .core-unit-category-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
      .core-unit-category-header strong { font-size: 13px; }
      .button-link { background: none; border: none; color: #245c59; font-size: 12px; font-weight: 600; cursor: pointer; padding: 0; }
      .core-unit-list { display: flex; flex-wrap: wrap; gap: 6px; }
      .core-unit-checkbox { display: inline-flex; align-items: center; gap: 5px; border: 1px solid var(--paper-line, #d1d5db); border-radius: 7px; padding: 5px 9px; font-size: 12.5px; cursor: pointer; background: #fff; }
      .core-unit-checkbox.out-of-range { opacity: 0.45; }
      .core-unit-checkbox input { margin: 0; }
      .difficulty-tag { font-style: normal; font-size: 10px; padding: 1px 5px; border-radius: 999px; }
      .difficulty-tag.difficulty-basic { background: #e0f2e9; color: #1a7a4c; }
      .difficulty-tag.difficulty-intermediate { background: #fef3c7; color: #92640a; }
      .difficulty-tag.difficulty-advanced { background: #fde2e2; color: #b91c1c; }
      .core-source-unit { margin: 0 0 4px; font-size: 11px; color: var(--ink-soft, #4b5563); font-weight: 600; }
      .core-empty-notice { padding: 20px; text-align: center; color: var(--ink-soft, #4b5563); border: 1px dashed var(--paper-line, #d1d5db); border-radius: 10px; }
    `}</style>
  </div>;
}
