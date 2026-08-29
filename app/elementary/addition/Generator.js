'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';

const LEVELS = [
  {
    id: 'one-digit', label: '1학년 · 한 자리 덧셈',
    description: '합이 18 이하인 한 자리 수 덧셈',
    make: (random) => [randomInt(random, 1, 9), randomInt(random, 1, 9)],
  },
  {
    id: 'two-digit-no-carry', label: '2학년 · 받아올림 없음',
    description: '두 자리 수와 한 자리 수, 받아올림 없음',
    make: (random) => {
      const ones = randomInt(random, 1, 8);
      return [randomInt(random, 1, 8) * 10 + ones, randomInt(random, 1, 9 - ones)];
    },
  },
  {
    id: 'two-digit-carry', label: '2~3학년 · 받아올림 있음',
    description: '두 자리 수와 한 자리 수, 받아올림 1번',
    make: (random) => {
      const ones = randomInt(random, 2, 9);
      return [randomInt(random, 1, 8) * 10 + ones, randomInt(random, 10 - ones, 9)];
    },
  },
  {
    id: 'three-digit', label: '3~4학년 · 세 자리 덧셈',
    description: '세 자리 수끼리 덧셈',
    make: (random) => [randomInt(random, 101, 899), randomInt(random, 101, 899)],
  },
];

const DEFAULT_LEVEL = 'two-digit-carry';
const PROBLEM_COUNT = 20;

function randomInt(random, min, max) {
  return Math.floor(random() * (max - min + 1)) + min;
}

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

function makeWorksheet(seed, levelId) {
  const level = LEVELS.find((item) => item.id === levelId) || LEVELS[0];
  const random = seededRandom(`${seed}:${levelId}`);
  return Array.from({ length: PROBLEM_COUNT }, (_, index) => {
    const [a, b] = level.make(random);
    return { id: index + 1, a, b, answer: a + b };
  });
}

function createSeed() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const values = new Uint32Array(8);
  window.crypto.getRandomValues(values);
  return Array.from(values, (value) => alphabet[value % alphabet.length]).join('');
}

function buildUrl(seed, levelId, view = 'problems') {
  const url = new URL(window.location.href);
  url.searchParams.set('sheet', seed);
  url.searchParams.set('level', levelId);
  if (view === 'answers') url.searchParams.set('view', 'answers');
  else url.searchParams.delete('view');
  return url.toString();
}

export default function Generator() {
  const [levelId, setLevelId] = useState(DEFAULT_LEVEL);
  const [seed, setSeed] = useState('PREVIEW1');
  const [view, setView] = useState('problems');
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedLevel = params.get('level');
    const initialLevel = LEVELS.some((level) => level.id === requestedLevel) ? requestedLevel : DEFAULT_LEVEL;
    const initialSeed = (params.get('sheet') || createSeed()).toUpperCase();
    const initialView = params.get('view') === 'answers' ? 'answers' : 'problems';
    setLevelId(initialLevel);
    setSeed(initialSeed);
    setView(initialView);
    window.history.replaceState({}, '', buildUrl(initialSeed, initialLevel, initialView));
    setReady(true);
  }, []);

  const problems = useMemo(() => makeWorksheet(seed, levelId), [seed, levelId]);
  const level = LEVELS.find((item) => item.id === levelId) || LEVELS[0];
  const correctCount = problems.filter((problem) => Number(answers[problem.id]) === problem.answer).length;

  useEffect(() => {
    if (!ready) return;
    QRCode.toDataURL(buildUrl(seed, levelId, 'problems'), {
      width: 220, margin: 1, errorCorrectionLevel: 'M',
      color: { dark: '#1f2733', light: '#fffefb' },
    }).then(setQrDataUrl);
  }, [seed, levelId, ready]);

  const updateUrl = useCallback((nextSeed, nextLevel, nextView) => {
    window.history.replaceState({}, '', buildUrl(nextSeed, nextLevel, nextView));
  }, []);

  function resetWork(nextSeed, nextLevel = levelId) {
    setSeed(nextSeed);
    setLevelId(nextLevel);
    setView('problems');
    setAnswers({});
    setChecked(false);
    updateUrl(nextSeed, nextLevel, 'problems');
  }

  function changeView(nextView) {
    setView(nextView);
    setChecked(false);
    updateUrl(seed, levelId, nextView);
  }

  function handleAnswer(problemId, value) {
    if (!/^\d*$/.test(value)) return;
    setAnswers((current) => ({ ...current, [problemId]: value }));
    setChecked(false);
  }

  return (
    <div className="worksheet-app">
      <section className="worksheet-controls no-print" aria-label="문제지 설정">
        <div>
          <label htmlFor="addition-level">문제 유형</label>
          <select id="addition-level" value={levelId} onChange={(event) => resetWork(createSeed(), event.target.value)}>
            {LEVELS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
          <p>{level.description}</p>
        </div>
        <div className="control-actions">
          <button className="button button-secondary" onClick={() => window.print()}>인쇄 / PDF</button>
          <button className="button button-secondary" onClick={() => changeView(view === 'problems' ? 'answers' : 'problems')}>
            {view === 'problems' ? '답지 보기' : '문제지 보기'}
          </button>
          <button className="button button-primary" onClick={() => resetWork(createSeed())}>새 문제지</button>
        </div>
      </section>

      <div className={`worksheet-paper ${view === 'answers' ? 'answer-sheet' : ''}`}>
        <header className="worksheet-heading">
          <div className="worksheet-brand"><span className="brand-mark">매일</span><strong>배움 연구소</strong></div>
          <div className="worksheet-title">
            <span>{level.label}</span><h2>{view === 'answers' ? '덧셈 정답지' : '덧셈 문제지'}</h2><p>{level.description}</p>
          </div>
          <div className="worksheet-identity">
            <div><span>문제지 번호</span><strong>{seed}</strong><small>QR을 스캔하면 같은 문제를 다시 열 수 있어요.</small></div>
            {qrDataUrl ? <img src={qrDataUrl} alt={`문제지 ${seed} QR 코드`} /> : null}
          </div>
        </header>

        <div className="student-row"><span>이름</span><i /><span>날짜</span><i /><span className="sheet-kind">{view === 'answers' ? '정답' : '20문제'}</span></div>

        <section className="problem-grid" aria-label="덧셈 문제">
          {problems.map((problem) => {
            const isCorrect = Number(answers[problem.id]) === problem.answer;
            const hasAnswer = answers[problem.id] !== undefined && answers[problem.id] !== '';
            return (
              <article className="vertical-problem" key={problem.id}>
                <span className="problem-number">{problem.id}</span>
                <div className="calculation font-mono">
                  <span>{problem.a}</span>
                  <span className="second-number"><b>+</b>{problem.b}</span>
                  <span className="answer-line">
                    {view === 'answers' ? <strong>{problem.answer}</strong> : <>
                      <input aria-label={`${problem.id}번 답`} inputMode="numeric" pattern="[0-9]*" value={answers[problem.id] || ''}
                        onChange={(event) => handleAnswer(problem.id, event.target.value)}
                        className={checked && hasAnswer ? (isCorrect ? 'correct' : 'wrong') : ''} />
                      <span className="print-answer-space" aria-hidden="true" />
                    </>}
                  </span>
                </div>
                {checked && view === 'problems' && hasAnswer ? <span className={`result-mark ${isCorrect ? 'correct' : 'wrong'}`}>{isCorrect ? '맞았어요' : '다시 풀기'}</span> : null}
              </article>
            );
          })}
        </section>

        <footer className="worksheet-footer"><span className="worksheet-signature">Built &amp; Designed by Chae</span><span>매일 배움 연구소</span><span>{seed} · {view === 'answers' ? '정답지' : '문제지'}</span></footer>
      </div>

      {view === 'problems' ? <section className="grading-panel no-print">
        <div><strong>태블릿으로 바로 풀기</strong><p>답 칸을 누르면 숫자 키보드가 열립니다. Apple Pencil의 손글씨 입력도 사용할 수 있어요.</p></div>
        <button className="button button-primary" onClick={() => setChecked(true)}>채점하기</button>
        {checked ? <strong className="score">{PROBLEM_COUNT}문제 중 {correctCount}문제 정답</strong> : null}
      </section> : null}
    </div>
  );
}
