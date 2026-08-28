'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import { findBasicFigureUnit, localizeBasicFigureUnit, BASIC_FIGURE_UNITS } from './catalog';
import GeometryDiagram from './GeometryDiagram';
import { findGeometryProfile, GEOMETRY_PROFILES } from './geometryProfiles';
import { useLanguage } from '../../language';
import { isNonKorean, tr } from '../../i18n';

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
  if (/^-?\d+(?:\.\d+)?$/.test(answer)) {
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
  return { ...item, answer: String(answerIndex), answerSuffix: '', choices: labels.map((label, index) => ({ value: String(index + 1), marker: String.fromCharCode(65 + index), label, labelEn: label })) };
}

function makeProblems(seed, unit, profile) {
  const random = seededRandom(`${seed}:${unit.id}:${profile.id}`);
  const used = new Set();
  return Array.from({ length: PROBLEM_COUNT }, (_, index) => {
    let item;
    let attempt = 0;
    do {
      item = unit.make(random, profile);
      if (profile.id === 'amc12') item = asAmcChoice(item, random);
      attempt += 1;
    } while (used.has(`${item.prompt}|${item.expression}|${JSON.stringify(item.diagram)}|${item.answer}`) && attempt < 40);
    used.add(`${item.prompt}|${item.expression}|${JSON.stringify(item.diagram)}|${item.answer}`);
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
  const foreign = isNonKorean(language);
  const [unitId, setUnitId] = useState('visual-foundations');
  const [profileId, setProfileId] = useState('kr');
  const [seed, setSeed] = useState('PREVIEW1');
  const [view, setView] = useState('problems');
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [ready, setReady] = useState(false);

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
  const problems = useMemo(() => makeProblems(seed, unit, profile), [seed, unit, profile]);
  const correctCount = problems.filter((item) => normalizeAnswer(answers[item.id]) === normalizeAnswer(item.answer)).length;

  useEffect(() => {
    if (!ready) return;
    QRCode.toDataURL(buildUrl(seed, unitId, profileId), { width: 220, margin: 1, errorCorrectionLevel: 'M', color: { dark: '#1f2733', light: '#fffefb' } }).then(setQrDataUrl);
  }, [seed, unitId, profileId, ready]);

  const replaceUrl = useCallback((nextSeed, nextUnit, nextProfile, nextView) => {
    window.history.replaceState({}, '', buildUrl(nextSeed, nextUnit, nextProfile, nextView));
  }, []);

  function reset(nextSeed, nextUnit = unitId, nextProfile = profileId) {
    setSeed(nextSeed); setUnitId(nextUnit); setProfileId(nextProfile); setView('problems'); setAnswers({}); setChecked(false);
    replaceUrl(nextSeed, nextUnit, nextProfile, 'problems');
  }

  function chooseUnit(nextUnit) { reset(createSeed(), nextUnit); }
  function chooseProfile(nextProfile) {
    const nextUnit = BASIC_FIGURE_UNITS.find((item) => item.id === unitId && (!item.profiles || item.profiles.includes(nextProfile)))?.id || 'visual-foundations';
    reset(createSeed(), nextUnit, nextProfile);
  }
  function changeView(nextView) { setView(nextView); setChecked(false); replaceUrl(seed, unitId, profileId, nextView); }
  function changeAnswer(id, value) { setAnswers((current) => ({ ...current, [id]: value })); setChecked(false); }

  const contentLocale = profile.locale;
  const unitLabel = localizeBasicFigureUnit(unit, contentLocale);
  const unitDescription = localizeBasicFigureUnit(unit, contentLocale, 'description');

  return <div className="worksheet-app">
    <section className="worksheet-controls no-print" aria-label={tr(language, 'worksheetSettings')}>
      <div><label htmlFor="geometry-profile">{language === 'ko' ? '교육과정 · 시험' : 'Curriculum · exam'}</label><select id="geometry-profile" value={profileId} onChange={(event) => chooseProfile(event.target.value)}>{GEOMETRY_PROFILES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select><p>{profile.description}</p></div>
      <div><label htmlFor="basic-figures-unit">{tr(language, 'skill')}</label><select id="basic-figures-unit" value={unitId} onChange={(event) => chooseUnit(event.target.value)}>{availableUnits.map((item) => <option key={item.id} value={item.id}>{localizeBasicFigureUnit(item, contentLocale)}</option>)}</select><p>{unitDescription}</p></div>
      <div className="control-actions"><button className="button button-secondary" onClick={() => window.print()}>{tr(language, 'printPdf')}</button><button className="button button-secondary" onClick={() => changeView(view === 'problems' ? 'answers' : 'problems')}>{tr(language, view === 'problems' ? 'answerKey' : 'worksheet')}</button><button className="button button-primary" onClick={() => reset(createSeed())}>{tr(language, 'newWorksheet')}</button></div>
    </section>

    <div className={`worksheet-paper middle-worksheet ${view === 'answers' ? 'answer-sheet' : ''}`}>
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
          return <article className={`vertical-problem word-problem prime-problem${graphic ? ' graphic-problem geometry-problem' : ''}`} key={item.id}><span className="problem-number">{item.id}</span><div className="word-calculation"><p>{promptText}</p>{item.diagram ? <GeometryDiagram diagram={item.diagram} /> : null}{expressionText ? <strong className="word-expression font-mono">{expressionText}</strong> : null}{item.choices ? <div className="choice-answer">{view === 'answers' ? <strong>{selectedChoice?.marker || selectedChoice?.value}. {localizedForeign ? selectedChoice?.labelEn : selectedChoice?.label}</strong> : item.choices.map((choice) => <button type="button" key={choice.value} className={`${value === choice.value ? 'selected' : ''} ${checked && value === choice.value ? (isCorrect ? 'correct' : 'wrong') : ''}`} onClick={() => changeAnswer(item.id, choice.value)} aria-pressed={value === choice.value}><span>{choice.marker || choice.value}</span>{localizedForeign ? choice.labelEn : choice.label}</button>)}</div> : <div className="word-answer"><span>{tr(language, 'answer')}</span><span className="inline-answer">{view === 'answers' ? <strong>{item.answer}</strong> : <><input aria-label={`${tr(language, 'answer')} ${item.id}`} value={value} onChange={(event) => changeAnswer(item.id, event.target.value)} className={checked && value ? (isCorrect ? 'correct' : 'wrong') : ''} /><span className="print-answer-space" aria-hidden="true" /></>}</span>{item.answerSuffix ? <em>{item.answerSuffix}</em> : null}</div>}{view === 'answers' && item.explanation ? <p className="geometry-explanation"><b>{contentLocale === 'ko' ? '풀이' : contentLocale.startsWith('zh') ? '解說' : 'Solution'}</b>{item.explanation}</p> : null}</div>{checked && view === 'problems' && value ? <span className={`result-mark ${isCorrect ? 'correct' : 'wrong'}`}>{tr(language, isCorrect ? 'correct' : 'tryAgain')}</span> : null}</article>;
        })}
      </section>
      <footer className="worksheet-footer"><span>{tr(language, 'dailyLab')}</span><span>{seed} · {profile.shortLabel} · {unitLabel}</span></footer>
    </div>

    {view === 'problems' ? <section className="grading-panel no-print"><div><strong>{tr(language, 'solveTablet')}</strong><p>{foreign ? 'Choose an option or type your numeric answer, then check.' : '객관식은 보기를 고르고, 주관식은 숫자만 입력하세요.'}</p></div><button className="button button-primary" onClick={() => setChecked(true)}>{tr(language, 'checkAnswers')}</button>{checked ? <strong className="score">{tr(language, 'score', { count: correctCount })}</strong> : null}</section> : null}
  </div>;
}
