'use client';

import { Fragment, useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import { useLanguage } from '../language';
import { useAuth } from '../auth';
import ProblemScratchpad from '../components/ProblemScratchpad';
import { recordAttempts, syncAnswerEvents } from '../lib/submissions';
import { contentOf } from './content';
import { unitById } from './curriculum';

const SHEET_SIZE = 14;
const BLANK = '______';
const CLOZE_RE = /\[([^\]]+)\]/g;

function createSeed() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const values = new Uint32Array(8);
  window.crypto.getRandomValues(values);
  return Array.from(values, (v) => alphabet[v % alphabet.length]).join('');
}

function seededRandom(seedText) {
  let h = 2166136261;
  for (let i = 0; i < seedText.length; i += 1) { h ^= seedText.charCodeAt(i); h = Math.imul(h, 16777619); }
  let value = h >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let r = value;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled(list, rand) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i -= 1) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

// Same seed -> same worksheet. Items are drawn round-robin across lessons so every lesson is covered,
// then put back into lesson order; choices / word banks are shuffled per sheet.
function buildSheet(content, seed) {
  const rand = seededRandom(`${seed}`);
  const queues = content.lessons.map((lesson, li) => shuffled(lesson.items, rand).map((item) => ({ ...item, li })));
  const picked = [];
  for (let round = 0; picked.length < SHEET_SIZE; round += 1) {
    let any = false;
    for (const q of queues) {
      if (picked.length >= SHEET_SIZE) break;
      if (q[round]) { picked.push(q[round]); any = true; }
    }
    if (!any) break;
  }
  picked.sort((a, b) => a.li - b.li);
  return picked.map((item, idx) => ({
    ...item,
    id: idx + 1,
    blanks: item.kind === 'cz' ? [...item.text.matchAll(CLOZE_RE)].map((m) => m[1]) : undefined,
    choices: item.choices ? shuffled(item.choices, rand) : undefined,
    bank: item.kind === 'cz' ? shuffled([...item.text.matchAll(CLOZE_RE)].map((m) => m[1]), rand) : item.bank ? shuffled(item.bank, rand) : undefined,
  }));
}

const norm = (v) => String(v ?? '').toLowerCase().replace(/\s+/g, ' ').trim();
const isAuto = (item) => item.kind === 'mc' || item.kind === 'fb' || item.kind === 'tf' || item.kind === 'cz';
// One gradable cell per answer: a cloze passage has one per blank, every other auto item has one.
const cellsOf = (item, value) => (item.kind === 'cz'
  ? item.blanks.map((w, n) => ({ ok: norm(value?.[n]) === norm(w), has: hasValue(value?.[n]), text: value?.[n] }))
  : [{ ok: isRight(item, value), has: hasValue(value), text: value }]);
const isRight = (item, value) => (item.kind === 'tf' ? value === item.answer : norm(value) === norm(item.answer));
function hasValue(value) { return value !== undefined && value !== ''; }

function buildUrl(unitId, tab, seed, view) {
  const url = new URL(window.location.href);
  url.searchParams.set('unit', unitId);
  url.searchParams.set('tab', tab);
  if (tab === 'sheet') url.searchParams.set('sheet', seed); else url.searchParams.delete('sheet');
  if (tab === 'sheet' && view === 'answers') url.searchParams.set('view', 'answers'); else url.searchParams.delete('view');
  return url.toString();
}

function ItemBody({ item, view, value, onChange, checked, ko }) {
  const answerView = view === 'answers';
  const right = isAuto(item) && item.kind !== 'cz' && hasValue(value) ? isRight(item, value) : null;
  const mark = checked && !answerView && right !== null
    ? <span className={`result-mark ${right ? 'correct' : 'wrong'}`}>{right ? (ko ? '맞았어요' : 'Correct') : (ko ? '다시 풀기' : 'Try again')}</span> : null;

  if (item.kind === 'mc') {
    return <div className="sci-body">
      <p className="sci-q">{item.q}</p>
      <div className="sci-choices" role="radiogroup" aria-label={item.q}>
        {item.choices.map((c, i) => {
          const on = answerView ? c === item.answer : value === c;
          return <button key={c} type="button" role="radio" aria-checked={on} disabled={answerView}
            className={`sci-choice${on ? ' on' : ''}`} onClick={() => onChange(item.id, c)}>
            <b>{String.fromCharCode(65 + i)}</b> {c}
          </button>;
        })}
      </div>
      {mark}
    </div>;
  }
  if (item.kind === 'tf') {
    return <div className="sci-body">
      <p className="sci-q">{item.q}</p>
      <div className="sci-choices" role="radiogroup" aria-label={item.q}>
        {[true, false].map((b) => {
          const on = answerView ? b === item.answer : value === b;
          return <button key={String(b)} type="button" role="radio" aria-checked={on} disabled={answerView}
            className={`sci-choice${on ? ' on' : ''}`} onClick={() => onChange(item.id, b)}>{b ? 'True' : 'False'}</button>;
        })}
      </div>
      {mark}
    </div>;
  }
  if (item.kind === 'cz') {
    const pieces = item.text.split(CLOZE_RE); // [text, blank, text, blank, ...]
    let n = -1;
    return <div className="sci-body">
      <p className="sci-q">{item.q}</p>
      {!answerView ? <p className="sci-bank">{ko ? '낱말 상자' : 'Word box'}: {item.bank.join('  ·  ')}</p> : null}
      <p className="sci-cloze">{pieces.map((piece, i) => {
        if (i % 2 === 0) return <Fragment key={i}>{piece}</Fragment>;
        n += 1; const idx = n;
        if (answerView) return <strong key={i} className="sci-fill">{piece}</strong>;
        const cur = value?.[idx];
        const cls = checked && hasValue(cur) ? (norm(cur) === norm(piece) ? ' sci-right' : ' sci-wrong') : '';
        return <input key={i} className={`sci-fill-input${cls}`} value={cur ?? ''} onChange={(e) => onChange(item.id, { ...(value || {}), [idx]: e.target.value })} aria-label={`blank ${idx + 1}`} autoCapitalize="none" autoComplete="off" spellCheck={false} />;
      })}</p>
    </div>;
  }
  if (item.kind === 'fb') {
    const parts = item.q.split(BLANK);
    const input = answerView
      ? <strong className="sci-fill">{item.answer}</strong>
      : <input className="sci-fill-input" value={value ?? ''} onChange={(e) => onChange(item.id, e.target.value)} aria-label="answer" autoCapitalize="none" autoComplete="off" spellCheck={false} />;
    return <div className="sci-body">
      <p className="sci-q">{parts.map((p, i) => <Fragment key={i}>{p}{i < parts.length - 1 ? input : null}</Fragment>)}</p>
      {item.bank && !answerView ? <p className="sci-bank">{ko ? '낱말 상자' : 'Word box'}: {item.bank.join('  ·  ')}</p> : null}
      {mark}
    </div>;
  }
  // sa / dr — written work, self-checked
  return <div className="sci-body">
    <p className="sci-q">{item.q}</p>
    {answerView
      ? <p className="sci-model"><b>{ko ? '예시 답' : 'Model answer'}:</b> {item.model}</p>
      : item.kind === 'sa'
        ? <>
          <textarea className="sci-textarea no-print" rows={2} value={value ?? ''} onChange={(e) => onChange(item.id, e.target.value)} aria-label="answer" />
          <div className="sci-lines" aria-hidden="true"><i /><i /></div>
        </>
        : <div className="sci-drawbox" aria-hidden="true" />}
  </div>;
}

export default function ScienceStudy() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const ko = language === 'ko';
  const [unitId, setUnitId] = useState(null);
  const [tab, setTab] = useState('notes');
  const [seed, setSeed] = useState('PREVIEW1');
  const [view, setView] = useState('problems');
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const [tabletMode, setTabletMode] = useState(false);
  const [qr, setQr] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const u = q.get('unit');
    const t = q.get('tab') === 'sheet' ? 'sheet' : 'notes';
    const s = (q.get('sheet') || createSeed()).toUpperCase();
    const v = q.get('view') === 'answers' ? 'answers' : 'problems';
    setUnitId(u); setTab(t); setSeed(s); setView(v);
    if (u) window.history.replaceState({}, '', buildUrl(u, t, s, v));
    setReady(true);
  }, []);

  const unit = unitId ? unitById(unitId) : null;
  const content = unitId ? contentOf(unitId) : null;
  const items = useMemo(() => (content ? buildSheet(content, `${unitId}:${seed}`) : []), [content, unitId, seed]);

  useEffect(() => {
    if (!ready || !unitId) return;
    QRCode.toDataURL(buildUrl(unitId, tab, seed, 'problems'), { width: 220, margin: 1, errorCorrectionLevel: 'M', color: { dark: '#1f2733', light: '#fffefb' } }).then(setQr).catch(() => {});
  }, [ready, unitId, tab, seed]);

  if (!ready) return null;
  if (!unit || !content) {
    return <p>{ko ? '학습 자료가 아직 준비되지 않은 단원입니다.' : 'No study material for this unit yet.'} <a href="/science">{ko ? '과학 홈으로' : 'Back to Science'}</a></p>;
  }

  const sync = (nextTab, nextSeed, nextView) => window.history.replaceState({}, '', buildUrl(unitId, nextTab, nextSeed, nextView));
  const changeTab = (t) => { setTab(t); setChecked(false); sync(t, seed, 'problems'); setView('problems'); };
  const newSheet = () => { const s = createSeed(); setSeed(s); setView('problems'); setAnswers({}); setChecked(false); sync('sheet', s, 'problems'); };
  const changeView = (v) => { setView(v); setChecked(false); sync('sheet', seed, v); };
  const onChange = (id, value) => { setAnswers((a) => ({ ...a, [id]: value })); setChecked(false); };

  const auto = items.filter(isAuto);
  const cells = auto.flatMap((it) => cellsOf(it, answers[it.id]));
  const correct = cells.filter((c) => c.has && c.ok).length;
  const check = () => {
    setChecked(true);
    const entries = auto.flatMap((it) => cellsOf(it, answers[it.id]).filter((c) => c.has).map((c) => ({
      grade: `science-g${unit.grade}`, unit: unit.id, problemType: it.kind === 'mc' || it.kind === 'tf' ? 'mcq' : 'short',
      isCorrect: c.ok, answer: String(c.text),
    })));
    recordAttempts(user, entries);
    syncAnswerEvents(entries);
  };

  const name = ko ? unit.ko : unit.en;

  return <div className="worksheet-app sci-app">
    <p className="no-print" style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 6 }}>
      <a href="/">{ko ? '홈' : 'Home'}</a> / <a href="/science">{ko ? '과학' : 'Science'}</a> / <a href={`/science/g${unit.grade}?unit=${unit.id}`}>G{unit.grade}</a> / {name}
    </p>

    <section className="worksheet-controls no-print" aria-label="science study controls">
      <div role="tablist" style={{ display: 'flex', flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        <button type="button" role="tab" aria-selected={tab === 'notes'} className={tab === 'notes' ? 'button' : 'button button-secondary'} onClick={() => changeTab('notes')}>📘 {ko ? '학습 내용' : 'Study Notes'}</button>
        <button type="button" role="tab" aria-selected={tab === 'sheet'} className={tab === 'sheet' ? 'button' : 'button button-secondary'} onClick={() => changeTab('sheet')}>📝 {ko ? '연습 학습지' : 'Practice Worksheet'}</button>
      </div>
      <div className="control-actions">
        {tab === 'sheet' ? <>
          <button type="button" className={`button button-secondary tablet-toggle-btn${tabletMode ? ' active' : ''}`} onClick={() => setTabletMode((v) => !v)}>
            ✍️ {tabletMode ? (ko ? '태블릿 모드 ON' : 'Tablet Mode ON') : (ko ? '태블릿·펜슬 필기' : 'Tablet / Pencil')}
          </button>
          <button type="button" className="button button-secondary" onClick={() => changeView(view === 'problems' ? 'answers' : 'problems')}>{view === 'problems' ? (ko ? '정답지' : 'Answer Key') : (ko ? '학습지' : 'Worksheet')}</button>
          <button type="button" className="button button-primary" onClick={newSheet}>{ko ? '새 학습지' : 'New Worksheet'}</button>
        </> : null}
        <button type="button" className="button button-secondary" onClick={() => window.print()}>{ko ? '인쇄 / PDF' : 'Print / PDF'}</button>
      </div>
    </section>

    <div className={`worksheet-paper sci-paper ${view === 'answers' && tab === 'sheet' ? 'answer-sheet' : ''}`}>
      <header className="worksheet-heading">
        <div className="worksheet-brand"><span className="brand-mark">DAILY</span><strong>{ko ? '매일 배움 연구소' : 'Daily Learning Lab'}</strong></div>
        <div className="worksheet-title">
          <span>Science · Grade {unit.grade}</span>
          <h2>{unit.en}{tab === 'sheet' ? (view === 'answers' ? ' — Answer Key' : ' — Worksheet') : ' — Study Notes'}</h2>
          <p>{ko ? unit.ko : content.intro}</p>
        </div>
        <div className="worksheet-identity">
          <div><span>{tab === 'sheet' ? (ko ? '학습지 번호' : 'Worksheet ID') : (ko ? '단원' : 'Unit')}</span><strong>{tab === 'sheet' ? seed : unit.id}</strong><small>{ko ? 'QR로 다시 열기' : 'Scan to open online'}</small></div>
          {qr ? <img src={qr} alt="QR code" /> : null}
        </div>
      </header>

      {tab === 'notes' ? <div className="sci-notes">
        <p className="sci-intro">{content.intro}</p>
        {content.lessons.map((lesson, li) => <section key={lesson.id} className="sci-lesson">
          <h3>{lesson.icon} Lesson {li + 1} · {lesson.title} <small>{lesson.ko}</small></h3>
          <ul className="sci-ideas">{lesson.ideas.map((t) => <li key={t}>{t}</li>)}</ul>
          <table className="sci-vocab"><thead><tr><th>{ko ? '낱말' : 'Word'}</th><th>{ko ? '뜻' : 'Meaning'}</th></tr></thead>
            <tbody>{lesson.vocab.map(([term, k, def]) => <tr key={term}><td><b>{term}</b> <small>{k}</small></td><td>{def}</td></tr>)}</tbody></table>
        </section>)}
        <p className="no-print" style={{ marginTop: 18 }}>
          <button type="button" className="button button-primary" onClick={() => changeTab('sheet')}>📝 {ko ? '연습 학습지 풀기' : 'Practice with a worksheet'}</button>
        </p>
      </div> : <>
        <div className="student-row"><span>{ko ? '이름' : 'Name'}</span><i /><span>{ko ? '날짜' : 'Date'}</span><i /><span className="sheet-kind">{items.length} {ko ? '문항' : 'questions'}</span></div>
        <ol className="sci-items" aria-label="questions">
          {items.map((item) => <li key={item.id} className={`sci-item${item.kind === 'cz' ? ' sci-wide' : ''}`}>
            <span className="problem-number">{item.id}</span>
            <ItemBody item={item} view={view} value={answers[item.id]} onChange={onChange} checked={checked} ko={ko} />
            {view === 'problems' && (item.kind === 'dr' || item.kind === 'sa') ? <ProblemScratchpad problemId={item.id} seed={`science:${unitId}:${seed}`} language={language} forceOpen={item.kind === 'dr' ? true : tabletMode} /> : null}
            {view === 'problems' && item.kind !== 'dr' && item.kind !== 'sa' && tabletMode ? <ProblemScratchpad problemId={item.id} seed={`science:${unitId}:${seed}`} language={language} forceOpen /> : null}
          </li>)}
        </ol>
      </>}
      <footer className="worksheet-footer"><span className="worksheet-signature">Built &amp; Designed by Chae</span><span>{ko ? '매일 배움 연구소' : 'Daily Learning Lab'}</span><span>{tab === 'sheet' ? seed : 'notes'} · G{unit.grade} · {unit.en}</span></footer>
    </div>

    {tab === 'sheet' && view === 'problems' ? <section className="grading-panel no-print">
      <div>
        <strong>{ko ? '태블릿·펜슬로 풀기' : 'Solve on a tablet'}</strong>
        <p>{ko ? '객관식은 눌러서 고르고, 빈칸은 영어 단어로 쓰세요. 서술·그림 문제는 ✍️ 연습장에 펜슬로 쓰고 정답지로 스스로 확인합니다.' : 'Tap to choose, type one word for blanks. For written and drawing questions use the ✍️ pad with your pencil, then compare with the answer key.'}</p>
      </div>
      <button type="button" className="button button-primary" onClick={check}>{ko ? '채점하기' : 'Check answers'}</button>
      {checked ? <strong className="score">{ko ? `자동 채점 ${cells.length}칸 중 ${correct}칸 정답` : `${correct} of ${cells.length} auto-graded answers correct`}</strong> : null}
    </section> : null}
  </div>;
}
