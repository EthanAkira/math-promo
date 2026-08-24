'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../language';

const COPY = {
  ko: {
    home: '홈', hub: '쉬어가는 코너', crumbCurrent: '윷놀이',
    title: '윷 놀 이', subtitle: '전통 윷판 · 나 (홍) vs 컴퓨터 (청)',
    tutorialBtn: '튜토리얼 · 설명',
    introBadge: '시작하기 전에', introTitle: '윷놀이, 잠깐 알아볼까요?',
    introWhatTitle: '윷놀이란?',
    introWhat: '윷놀이는 네 개의 윷가락을 던져 나온 결과로 말 4개를 먼저 출발점으로 되돌아오게 하는 편이 이기는 한국의 전통 보드게임이에요. 설날부터 정월대보름까지 남녀노소가 함께 즐기며, 한 해의 운을 점치는 "윷점" 풍속과도 이어져 있어요. 결과 이름인 도·개·걸·윷·모는 각각 돼지·개·양·소·말을 상징한다고 전해지며, 동물이 커질수록 말이 움직이는 칸수도 커집니다.',
    introMathTitle: '윷놀이 속 수학 한 스푼',
    introMath: '윷가락 4개를 던진 결과는 이항분포를 따라요. 흥미롭게도 경우의 수가 가장 많은 "개"와 "걸"이 "도"보다 이론적으로 더 자주 나옵니다 (1 : 4 : 6 : 4 : 1). 한 번 던질 때 평균 이동 칸수는 약 2.31칸이에요.',
    introHowTitle: '놀이 방법 요약',
    introHow: [
      '젖혀진 개수 0개 → 모(5칸, 한 번 더) · 1개 → 도(1칸) · 2개 → 개(2칸) · 3개 → 걸(3칸) · 4개 → 윷(4칸, 한 번 더)',
      '모서리에서 대각선 지름길을 타면 훨씬 빨리 완주할 수 있어요.',
      '같은 편 말이 만나면 업어서 함께 움직이고, 상대 말을 잡으면 한 번 더 던져요.',
    ],
    introStart: '시작하기', closeBtn: '닫기',
    turnMe: '내 차례', turnComputer: '컴퓨터 차례',
    finished: (r, b) => `완주 ${r} : ${b}`,
    throwBtn: '윷 던지기', resetBtn: '새 게임',
    trayMe: '내 말 (대기)', trayComputer: '컴퓨터 말 (대기)',
    startLog: '윷을 던져 시작하세요.',
    bonusLog: (name) => `${name}! 한 번 더 던집니다.`,
    chooseMoveLog: '어떻게 이동할지 골라보세요.',
    computerMovingLog: '컴퓨터가 이동합니다...',
    captureLogMe: '상대 말을 잡았습니다! 한 번 더 던지세요.',
    captureLogComputer: '컴퓨터가 내 말을 잡았습니다!',
    yourTurnLog: '내 차례입니다. 윷을 던지세요.',
    noPieceLog: (label) => `${label}를 사용할 말이 없어 이번 사위는 넘어갑니다.`,
    pendingLabel: '남은 이동: ',
    backdoValue: '빽도(-1칸)',
    stepsValue: (v) => `${v}칸`,
    winTitleMe: '승리하셨습니다!', winTitleComputer: '컴퓨터 승리',
    winSubMe: '네 말이 모두 완주했습니다.', winSubComputer: '컴퓨터의 말이 모두 완주했습니다. 다음엔 이겨봐요!',
    playAgain: '다시 하기',
    moveModalTitle: (label) => `${label} — 어떤 말을 움직일까요?`,
    moveModalSubMulti: (n) => `이 사위를 먼저 사용하세요 (남은 사위 ${n}개 더 있음)`,
    moveModalSubSingle: '아래에서 원하는 이동을 선택하세요',
    enterMain: '새 말 출발하기', enterSubHome: '바로 완주합니다!',
    enterSub: (k) => `대기 중인 말이 ${k}번째 칸으로 나갑니다`,
    moveMainMulti: (k, n) => `${k}번째 칸의 말 ${n}개 (업힌 상태) 전진`,
    moveMainSingle: (k) => `${k}번째 칸의 말 전진`,
    moveSubHome: '출발점(대기)으로 되돌아갑니다', moveSubFinish: '완주합니다!',
    moveSubTo: (k) => `${k}번째 칸으로 이동합니다`,
    tagCapture: '🎯 상대 말 잡기!', tagMerge: '🤝 업기 (내 말과 합침)', tagFinish: '🏠 완주!',
    homeLabel: '날',
    outcomeNames: { backdo: '빽도', do: '도', gae: '개', geol: '걸', yut: '윷', mo: '모' },
  },
  en: {
    home: 'Home', hub: 'Rest Corner', crumbCurrent: 'Yutnori',
    title: 'Yutnori', subtitle: 'Traditional board · You (Red) vs Computer (Blue)',
    tutorialBtn: 'Tutorial & Rules',
    introBadge: 'Before you start', introTitle: 'A quick look at Yutnori',
    introWhatTitle: 'What is Yutnori?',
    introWhat: 'Yutnori is a traditional Korean board game: throw four wooden sticks and race four pieces around the board — the first side to bring all four home wins. Families of every age have played it together from New Year’s Day through the first full moon, and the throws were also read as a fortune-telling custom called "yutjeom". The result names Do, Gae, Geol, Yut, and Mo are said to represent a pig, dog, sheep, ox, and horse — the bigger the animal, the farther the piece moves.',
    introMathTitle: 'A spoonful of math',
    introMath: 'The outcome of throwing four sticks follows a binomial distribution. Interestingly, "Gae" and "Geol" have more combinations than "Do" and are theoretically more common (1 : 4 : 6 : 4 : 1). On average, a single throw moves a piece about 2.31 spaces.',
    introHowTitle: 'How to play',
    introHow: [
      '0 sticks flat → Mo (5 spaces, throw again) · 1 → Do (1 space) · 2 → Gae (2 spaces) · 3 → Geol (3 spaces) · 4 → Yut (4 spaces, throw again)',
      'Cutting across a diagonal shortcut at a corner gets a piece home much faster.',
      'Stack pieces on the same space to move them together, and capture an opponent’s piece to earn another throw.',
    ],
    introStart: 'Start playing', closeBtn: 'Close',
    turnMe: 'Your turn', turnComputer: "Computer's turn",
    finished: (r, b) => `Home ${r} : ${b}`,
    throwBtn: 'Throw the sticks', resetBtn: 'New game',
    trayMe: 'Your pieces (waiting)', trayComputer: "Computer's pieces (waiting)",
    startLog: 'Throw the sticks to begin.',
    bonusLog: (name) => `${name}! Throw again.`,
    chooseMoveLog: 'Choose how to move.',
    computerMovingLog: 'Computer is moving...',
    captureLogMe: 'You captured a piece! Throw again.',
    captureLogComputer: 'The computer captured your piece!',
    yourTurnLog: 'Your turn — throw the sticks.',
    noPieceLog: (label) => `No piece can use ${label}, so this throw is skipped.`,
    pendingLabel: 'Remaining throws: ',
    backdoValue: 'Back-do (-1 space)',
    stepsValue: (v) => `${v} space${v === 1 ? '' : 's'}`,
    winTitleMe: 'You win!', winTitleComputer: 'Computer wins',
    winSubMe: 'All of your pieces made it home.', winSubComputer: "All of the computer's pieces made it home. Try again!",
    playAgain: 'Play again',
    moveModalTitle: (label) => `${label} — which piece will you move?`,
    moveModalSubMulti: (n) => `Use this throw first (${n} more throw${n === 1 ? '' : 's'} left)`,
    moveModalSubSingle: 'Choose a move below',
    enterMain: 'Bring out a new piece', enterSubHome: 'It goes straight home!',
    enterSub: (k) => `A waiting piece enters at space ${k}`,
    moveMainMulti: (k, n) => `Move ${n} pieces stacked at space ${k}`,
    moveMainSingle: (k) => `Move the piece at space ${k}`,
    moveSubHome: 'It returns to the waiting area', moveSubFinish: 'It makes it home!',
    moveSubTo: (k) => `Moves to space ${k}`,
    tagCapture: '🎯 Capture!', tagMerge: '🤝 Stack (merge with your piece)', tagFinish: '🏠 Home!',
    homeLabel: 'Home',
    outcomeNames: { backdo: 'Back-do', do: 'Do', gae: 'Gae', geol: 'Geol', yut: 'Yut', mo: 'Mo' },
  },
};

const UNIT = 90, MARGIN = 45;
const grid = (c, r) => ({ x: MARGIN + c * UNIT, y: MARGIN + r * UNIT });
const NODES = {
  0: grid(5, 5), 1: grid(5, 4), 2: grid(5, 3), 3: grid(5, 2), 4: grid(5, 1), 5: grid(5, 0),
  6: grid(4, 0), 7: grid(3, 0), 8: grid(2, 0), 9: grid(1, 0), 10: grid(0, 0),
  11: grid(0, 1), 12: grid(0, 2), 13: grid(0, 3), 14: grid(0, 4), 15: grid(0, 5),
  16: grid(1, 5), 17: grid(2, 5), 18: grid(3, 5), 19: grid(4, 5),
  20: grid(4.1667, 0.8333), 21: grid(3.3333, 1.6667), 22: grid(2.5, 2.5),
  23: grid(1.6667, 3.3333), 24: grid(0.8333, 4.1667),
  25: grid(0.8333, 0.8333), 26: grid(1.6667, 1.6667),
  27: grid(3.3333, 3.3333), 28: grid(4.1667, 4.1667),
};
const CORNERS = [0, 5, 10, 15];
const CENTER = 22;
const OUTER_ORDER = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 0];
const DIAGONALS = [[5, 20], [20, 21], [21, 22], [22, 23], [23, 24], [24, 15], [10, 25], [25, 26], [26, 22], [22, 27], [27, 28], [28, 0]];
const PATH = [1, 2, 3, 4, 5, 20, 21, 22, 27, 28];
const nodeAt = (k) => PATH[k - 1];

const OUTCOMES = [
  { key: 'backdo', value: -1, flats: 0, weight: 3, special: true },
  { key: 'do', value: 1, flats: 1, weight: 35 },
  { key: 'gae', value: 2, flats: 2, weight: 28 },
  { key: 'geol', value: 3, flats: 3, weight: 20 },
  { key: 'yut', value: 4, flats: 4, weight: 10, bonus: true },
  { key: 'mo', value: 5, flats: 4, weight: 4, bonus: true, special: true },
];
function weightedPick() {
  const total = OUTCOMES.reduce((s, o) => s + o.weight, 0);
  let r = Math.random() * total;
  for (const o of OUTCOMES) {
    if (r < o.weight) return o;
    r -= o.weight;
  }
  return OUTCOMES[1];
}
function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }

const CSS = `
.yutnori-app{--ink:#1b1815;--ink2:#241f1a;--hanji:#f1e8d8;--hanji-line:#d8c9a8;--red:#c23b32;--red-dark:#8f2a24;--blue:#2a5c8a;--blue-dark:#1c3f5f;--gold:#c99a3e;--gold-soft:#e8cf95;--wood:#7a5230;font-family:'Noto Sans KR', sans-serif;}
.yutnori-app *{box-sizing:border-box;}
.yutnori-app .title-wrap{text-align:center;margin-bottom:14px;}
.yutnori-app h1{font-family:'Song Myung', serif;font-size:2.1rem;letter-spacing:0.15em;color:var(--red-dark);margin:0 0 4px;}
.yutnori-app .subtitle{font-size:0.78rem;color:var(--wood);letter-spacing:0.08em;}
.yutnori-app .layout{width:100%;max-width:920px;margin:0 auto;display:flex;flex-direction:column;align-items:center;gap:16px;}
.yutnori-app .board-card{background:linear-gradient(160deg, var(--hanji) 0%, #e9dfc7 100%);border-radius:18px;padding:18px;box-shadow:0 0 0 1px rgba(201,154,62,0.5) inset, 0 12px 32px rgba(0,0,0,0.12);width:100%;max-width:520px;}
.yutnori-app svg{width:100%;height:auto;display:block;}
.yutnori-app .edge-line{stroke:var(--wood);stroke-width:2.5;opacity:0.55;}
.yutnori-app .diag-line{stroke:var(--wood);stroke-width:2;opacity:0.4;stroke-dasharray:1 6;stroke-linecap:round;}
.yutnori-app .node-dot{fill:#fffaf0;stroke:var(--wood);stroke-width:1.6;}
.yutnori-app .node-dot.corner{fill:var(--gold-soft);stroke:var(--gold);stroke-width:2.2;}
.yutnori-app .node-dot.center{fill:var(--gold);stroke:var(--gold);}
.yutnori-app .piece{filter:drop-shadow(0 2px 3px rgba(0,0,0,0.35));}
.yutnori-app .piece-count{font-family:'Noto Sans KR',sans-serif;font-size:9px;font-weight:700;fill:#fff;pointer-events:none;}
.yutnori-app .panel{width:100%;max-width:520px;background:linear-gradient(160deg, #2a2319 0%, #1f1b15 100%);border:1px solid rgba(201,154,62,0.35);border-radius:16px;padding:16px 18px;}
.yutnori-app .turn-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
.yutnori-app .turn-badge{display:flex;align-items:center;gap:8px;font-weight:700;font-size:0.95rem;color:#fff8ec;}
.yutnori-app .turn-dot{width:14px;height:14px;border-radius:50%;box-shadow:0 0 8px currentColor;}
.yutnori-app .turn-dot.red{background:var(--red);color:var(--red);}
.yutnori-app .turn-dot.blue{background:var(--blue);color:var(--blue);}
.yutnori-app .score-mini{font-size:0.75rem;color:#b8a888;}
.yutnori-app .sticks-area{display:flex;justify-content:center;gap:10px;margin:14px 0 10px;min-height:78px;align-items:center;}
.yutnori-app .stick{width:16px;height:70px;border-radius:6px;background:linear-gradient(90deg,#e8d2a0,#c9a768 40%, #e8d2a0);border:1px solid #8a6a3a;position:relative;transition:transform .5s cubic-bezier(.34,1.56,.64,1);}
.yutnori-app .stick::before{content:'';position:absolute;inset:3px;border-radius:3px;background:repeating-linear-gradient(180deg, rgba(120,85,40,0.25) 0 2px, transparent 2px 6px);}
.yutnori-app .stick.flat{background:linear-gradient(90deg,#3a2c1e,#5a4530 40%, #3a2c1e);}
.yutnori-app .stick.flipping{animation:yn-flip 0.55s ease-in-out;}
@keyframes yn-flip{0%{transform:rotateY(0deg) translateY(0);}40%{transform:rotateY(540deg) translateY(-30px);}100%{transform:rotateY(1080deg) translateY(0);}}
.yutnori-app .result-text{text-align:center;font-family:'Song Myung', serif;font-size:1.5rem;color:var(--gold-soft);min-height:2rem;margin-bottom:10px;}
.yutnori-app .pending-row{text-align:center;font-size:0.82rem;color:#c9b98f;margin-bottom:10px;min-height:1.1rem;}
.yutnori-app .btn-row{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-bottom:14px;}
.yutnori-app button.main-btn{font-family:'Noto Sans KR', sans-serif;font-weight:700;font-size:0.95rem;padding:11px 26px;border-radius:999px;border:none;cursor:pointer;background:linear-gradient(160deg, var(--red) 0%, var(--red-dark) 100%);color:#fff8ec;box-shadow:0 6px 16px rgba(194,59,50,0.4);transition:transform .12s ease, box-shadow .12s ease;}
.yutnori-app button.main-btn:disabled{background:#4a4238;color:#8a8070;box-shadow:none;cursor:not-allowed;}
.yutnori-app button.main-btn:not(:disabled):hover{transform:translateY(-1px);}
.yutnori-app button.main-btn:not(:disabled):active{transform:translateY(1px);}
.yutnori-app button.reset-btn{font-family:'Noto Sans KR', sans-serif;font-size:0.8rem;padding:8px 16px;border-radius:999px;border:1px solid rgba(201,154,62,0.4);background:transparent;color:#c9b98f;cursor:pointer;}
.yutnori-app .trays{display:flex;justify-content:space-between;gap:14px;border-top:1px solid rgba(201,154,62,0.2);padding-top:12px;}
.yutnori-app .tray{flex:1;text-align:center;}
.yutnori-app .tray-label{font-size:0.72rem;color:#a99a80;margin-bottom:6px;letter-spacing:0.05em;}
.yutnori-app .tray-tokens{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;}
.yutnori-app .tray-token{width:20px;height:20px;border-radius:50%;border:2px solid #fff8ec;}
.yutnori-app .tray-token.red{background:var(--red);}
.yutnori-app .tray-token.blue{background:var(--blue);}
.yutnori-app .tray-token.home{opacity:0.35;border-style:dashed;}
.yutnori-app .log-box{margin-top:12px;font-size:0.74rem;color:#8a7c62;text-align:center;min-height:1rem;}
.yutnori-app .overlay{position:fixed;inset:0;background:rgba(10,8,6,0.82);display:none;align-items:center;justify-content:center;z-index:50;flex-direction:column;gap:18px;text-align:center;padding:20px;}
.yutnori-app .overlay.show{display:flex;}
.yutnori-app .overlay h2{font-family:'Song Myung', serif;font-size:2.2rem;color:var(--gold-soft);margin:0;}
.yutnori-app .overlay p{color:#c9b98f;margin:0;font-size:0.9rem;}
.yutnori-app .move-modal{position:fixed;inset:0;background:rgba(10,8,6,0.72);display:none;align-items:flex-end;justify-content:center;z-index:60;padding:0;}
.yutnori-app .move-modal.show{display:flex;}
.yutnori-app .move-modal-inner{width:100%;max-width:520px;background:linear-gradient(160deg, #2e2618 0%, #1f1b15 100%);border:1px solid rgba(201,154,62,0.5);border-bottom:none;border-radius:20px 20px 0 0;padding:20px 18px 26px;box-shadow:0 -10px 40px rgba(0,0,0,0.6);animation:yn-slideUp .25s ease-out;max-height:80vh;overflow-y:auto;}
@keyframes yn-slideUp{from{transform:translateY(30px);opacity:0;}to{transform:translateY(0);opacity:1;}}
.yutnori-app .move-modal-title{font-family:'Song Myung', serif;font-size:1.3rem;color:var(--gold-soft);text-align:center;margin-bottom:2px;}
.yutnori-app .move-modal-sub{text-align:center;font-size:0.78rem;color:#a99a80;margin-bottom:16px;}
.yutnori-app .move-option{width:100%;display:flex;flex-direction:column;align-items:flex-start;gap:2px;text-align:left;background:rgba(255,248,236,0.06);border:1.5px solid rgba(201,154,62,0.35);border-radius:14px;padding:12px 16px;margin-bottom:10px;cursor:pointer;color:#f1e8d8;font-family:'Noto Sans KR', sans-serif;transition:background .12s ease, transform .1s ease, border-color .12s ease;}
.yutnori-app .move-option:hover,.yutnori-app .move-option:active{background:rgba(201,154,62,0.16);border-color:var(--gold);transform:translateY(-1px);}
.yutnori-app .move-option .mo-main{font-weight:700;font-size:0.95rem;}
.yutnori-app .move-option .mo-sub{font-size:0.76rem;color:#c9b98f;}
.yutnori-app .move-option .mo-tag{display:inline-block;margin-top:4px;font-size:0.72rem;font-weight:700;padding:2px 8px;border-radius:999px;}
.yutnori-app .mo-tag.capture{background:rgba(194,59,50,0.25);color:#ff9d92;}
.yutnori-app .mo-tag.merge{background:rgba(42,92,138,0.28);color:#9cc4e8;}
.yutnori-app .mo-tag.finish{background:rgba(201,154,62,0.28);color:#f0d99a;}
.yutnori-app .tutorial-overlay{position:fixed;inset:0;background:rgba(10,8,6,0.82);display:flex;align-items:center;justify-content:center;z-index:70;padding:20px;}
.yutnori-app .tutorial-card{width:100%;max-width:560px;max-height:86vh;overflow-y:auto;background:linear-gradient(160deg, var(--hanji) 0%, #e9dfc7 100%);border-radius:18px;padding:28px 26px;box-shadow:0 0 0 1px rgba(201,154,62,0.5) inset, 0 20px 50px rgba(0,0,0,0.55);color:var(--ink2);}
.yutnori-app .tutorial-badge{margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:.05em;color:var(--red-dark);text-transform:uppercase;}
.yutnori-app .tutorial-card h2{font-family:'Song Myung', serif;font-size:1.5rem;margin:0 0 14px;color:var(--ink2);}
.yutnori-app .tutorial-card h3{font-size:0.95rem;margin:18px 0 6px;color:var(--red-dark);}
.yutnori-app .tutorial-card p{margin:0;font-size:0.9rem;line-height:1.7;color:var(--ink2);}
.yutnori-app .tutorial-card ul{margin:6px 0 0;padding-left:18px;font-size:0.87rem;line-height:1.7;color:var(--ink2);}
.yutnori-app .tutorial-card li{margin-bottom:4px;}
.yutnori-app .tutorial-card button.main-btn{margin-top:20px;width:100%;}
@media (max-width:480px){
  .yutnori-app h1{font-size:1.7rem;}
  .yutnori-app .stick{width:13px;height:58px;}
  .yutnori-app .tutorial-card{padding:20px 16px;}
}
`;

export default function YutnoriGame() {
  const { language } = useLanguage();
  const words = COPY[language] || COPY.en;
  const wordsRef = useRef(words);
  const rootRef = useRef(null);
  const destroyedRef = useRef(false);
  const applyLanguageRef = useRef(() => {});
  const [tutorialOpen, setTutorialOpen] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    destroyedRef.current = false;

    const svg = root.querySelector('#yn-board');
    const throwBtnEl = root.querySelector('#yn-throwBtn');
    const resetBtnEl = root.querySelector('#yn-resetBtn');
    const resultTextEl = root.querySelector('#yn-resultText');
    const pendingRowEl = root.querySelector('#yn-pendingRow');
    const turnTextEl = root.querySelector('#yn-turnText');
    const turnBadgeEl = root.querySelector('#yn-turnBadge');
    const scoreMiniEl = root.querySelector('#yn-scoreMini');
    const sticksAreaEl = root.querySelector('#yn-sticksArea');
    const redTrayEl = root.querySelector('#yn-redTray');
    const blueTrayEl = root.querySelector('#yn-blueTray');
    const logBoxEl = root.querySelector('#yn-logBox');
    const overlayEl = root.querySelector('#yn-overlay');
    const overlayTitleEl = root.querySelector('#yn-overlayTitle');
    const overlaySubEl = root.querySelector('#yn-overlaySub');
    const overlayResetEl = root.querySelector('#yn-overlayReset');
    const moveModalEl = root.querySelector('#yn-moveModal');
    const moveModalTitleEl = root.querySelector('#yn-moveModalTitle');
    const moveModalSubEl = root.querySelector('#yn-moveModalSub');
    const moveModalOptionsEl = root.querySelector('#yn-moveModalOptions');

    let homeLabelEl = null;

    function svgElNS(tag, attrs) {
      const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
      for (const k in attrs) el.setAttribute(k, attrs[k]);
      return el;
    }

    function drawStaticBoard() {
      svg.innerHTML = '';
      const pts = OUTER_ORDER.map((id) => `${NODES[id].x},${NODES[id].y}`).join(' ');
      svg.appendChild(svgElNS('polyline', { points: pts, class: 'edge-line', fill: 'none' }));
      DIAGONALS.forEach(([a, b]) => {
        svg.appendChild(svgElNS('line', { x1: NODES[a].x, y1: NODES[a].y, x2: NODES[b].x, y2: NODES[b].y, class: 'diag-line' }));
      });
      Object.keys(NODES).forEach((id) => {
        id = +id;
        const n = NODES[id];
        let cls = 'node-dot';
        let r = 6;
        if (id === CENTER) { cls += ' center'; r = 10; }
        else if (CORNERS.includes(id)) { cls += ' corner'; r = 9; }
        svg.appendChild(svgElNS('circle', { cx: n.x, cy: n.y, r, class: cls, 'data-node': id }));
      });
      homeLabelEl = svgElNS('text', { x: NODES[0].x, y: NODES[0].y - 16, 'text-anchor': 'middle', fill: '#8a6a3a', 'font-size': 11, 'font-family': "'Noto Sans KR',sans-serif", 'font-weight': 700 });
      homeLabelEl.textContent = wordsRef.current.homeLabel;
      svg.appendChild(homeLabelEl);
    }
    drawStaticBoard();

    function freshPieces() { return [0, 1, 2, 3].map((i) => ({ id: i, k: 0 })); }
    let state = {
      turn: 'red',
      pieces: { red: freshPieces(), blue: freshPieces() },
      pending: [],
      gameOver: false,
      busy: false,
    };

    function log(msg) { logBoxEl.textContent = msg; }

    function buildSticks() {
      sticksAreaEl.innerHTML = '';
      for (let i = 0; i < 4; i++) {
        const s = document.createElement('div');
        s.className = 'stick';
        s.id = 'yn-stick' + i;
        sticksAreaEl.appendChild(s);
      }
    }
    buildSticks();

    function animateThrow(outcome) {
      return new Promise((resolve) => {
        const flatsCount = outcome.flats;
        const idxs = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
        const flatSet = new Set(idxs.slice(0, flatsCount));
        for (let i = 0; i < 4; i++) {
          const el = root.querySelector('#yn-stick' + i);
          el.classList.remove('flat');
          el.classList.add('flipping');
        }
        setTimeout(() => {
          for (let i = 0; i < 4; i++) {
            const el = root.querySelector('#yn-stick' + i);
            el.classList.remove('flipping');
            if (flatSet.has(i)) el.classList.add('flat');
          }
          resolve();
        }, 560);
      });
    }

    function oppColor(color) { return color === 'red' ? 'blue' : 'red'; }
    function piecesAtK(color, k) { return state.pieces[color].filter((p) => p.k === k); }
    function homeCount(color) { return state.pieces[color].filter((p) => p.k === 11).length; }
    function offCount(color) { return state.pieces[color].filter((p) => p.k === 0).length; }

    function checkWin(color) {
      if (homeCount(color) === 4) {
        state.gameOver = true;
        const T = wordsRef.current;
        overlayTitleEl.textContent = color === 'red' ? T.winTitleMe : T.winTitleComputer;
        overlaySubEl.textContent = color === 'red' ? T.winSubMe : T.winSubComputer;
        overlayEl.classList.add('show');
        return true;
      }
      return false;
    }

    function applyMove(color, pieceK, value) {
      const group = piecesAtK(color, pieceK);
      let newK = pieceK + value;
      if (newK < 0) newK = 0;
      if (newK > 11) newK = 11;
      let captured = false;
      group.forEach((p) => { p.k = newK; });
      if (newK >= 1 && newK <= 10) {
        const oppC = oppColor(color);
        const hits = piecesAtK(oppC, newK);
        if (hits.length > 0) { hits.forEach((h) => { h.k = 0; }); captured = true; }
      }
      return { newK, captured, count: group.length };
    }

    function enterPiece(color, value) {
      const p = state.pieces[color].find((pp) => pp.k === 0);
      if (!p) return null;
      const newK = Math.max(0, Math.min(11, value));
      p.k = newK;
      let captured = false;
      if (newK >= 1 && newK <= 10) {
        const oppC = oppColor(color);
        const hits = piecesAtK(oppC, newK);
        if (hits.length > 0) { hits.forEach((h) => { h.k = 0; }); captured = true; }
      }
      return { newK, captured };
    }

    function renderTrays() {
      redTrayEl.innerHTML = '';
      blueTrayEl.innerHTML = '';
      for (let i = 0; i < offCount('red'); i++) {
        const t = document.createElement('div');
        t.className = 'tray-token red';
        redTrayEl.appendChild(t);
      }
      for (let i = 0; i < homeCount('red'); i++) {
        const t = document.createElement('div');
        t.className = 'tray-token red home';
        redTrayEl.appendChild(t);
      }
      for (let i = 0; i < offCount('blue'); i++) {
        const t = document.createElement('div');
        t.className = 'tray-token blue';
        blueTrayEl.appendChild(t);
      }
      for (let i = 0; i < homeCount('blue'); i++) {
        const t = document.createElement('div');
        t.className = 'tray-token blue home';
        blueTrayEl.appendChild(t);
      }
    }

    function updateHeader() {
      const T = wordsRef.current;
      turnTextEl.textContent = state.turn === 'red' ? T.turnMe : T.turnComputer;
      turnBadgeEl.querySelector('.turn-dot').className = 'turn-dot ' + state.turn;
      scoreMiniEl.textContent = T.finished(homeCount('red'), homeCount('blue'));
      if (state.pending.length > 0) {
        pendingRowEl.textContent = T.pendingLabel + state.pending.map((v) => (v < 0 ? T.outcomeNames.backdo : v)).join(', ');
      } else {
        pendingRowEl.textContent = ' ';
      }
      throwBtnEl.disabled = state.busy || state.gameOver || state.turn !== 'red' || state.pending.length > 0;
    }

    function render() {
      svg.querySelectorAll('.piece-group').forEach((e) => e.remove());
      ['red', 'blue'].forEach((color) => {
        const byK = {};
        state.pieces[color].forEach((p) => {
          if (p.k >= 1 && p.k <= 10) {
            byK[p.k] = byK[p.k] || [];
            byK[p.k].push(p);
          }
        });
        Object.keys(byK).forEach((k) => {
          k = +k;
          const node = NODES[nodeAt(k)];
          const group = byK[k];
          const g = svgElNS('g', { class: 'piece-group' });
          const ox = color === 'red' ? -6 : 6;
          const cx = node.x + ox, cy = node.y - 4;
          const circle = svgElNS('circle', {
            cx, cy, r: 11,
            fill: color === 'red' ? 'var(--red)' : 'var(--blue)',
            stroke: '#fff8ec', 'stroke-width': 2,
            class: 'piece',
          });
          circle.style.fill = color === 'red' ? '#c23b32' : '#2a5c8a';
          g.appendChild(circle);
          if (group.length > 1) {
            const t = svgElNS('text', { x: cx, y: cy + 3, 'text-anchor': 'middle', class: 'piece-count' });
            t.textContent = group.length;
            g.appendChild(t);
          }
          svg.appendChild(g);
        });
      });
      renderTrays();
      updateHeader();
    }

    function valueLabel(v) {
      const T = wordsRef.current;
      return v < 0 ? T.backdoValue : T.stepsValue(v);
    }

    async function doThrow(color) {
      if (destroyedRef.current) return;
      state.busy = true;
      updateHeader();
      const outcome = weightedPick();
      resultTextEl.textContent = ' ';
      await animateThrow(outcome);
      if (destroyedRef.current) return;
      const T = wordsRef.current;
      const name = T.outcomeNames[outcome.key];
      resultTextEl.textContent = `${name} (${outcome.value})`;
      state.pending.push(outcome.value);
      if (outcome.bonus) {
        log(T.bonusLog(name));
        state.busy = false;
        updateHeader();
        await sleep(color === 'red' ? 500 : 600);
        if (destroyedRef.current) return;
        return doThrow(color);
      }
      state.busy = false;
      log(color === 'red' ? T.chooseMoveLog : T.computerMovingLog);
      updateHeader();
      render();
      if (color === 'blue') {
        await sleep(700);
        if (destroyedRef.current) return;
        await computerResolveMoves();
      } else {
        await sleep(300);
        if (destroyedRef.current) return;
        showMoveModal();
      }
      return undefined;
    }

    function handleThrowClick() {
      if (throwBtnEl.disabled) return;
      doThrow('red');
    }
    throwBtnEl.addEventListener('click', handleThrowClick);

    function getMoveOptions(color, value) {
      const T = wordsRef.current;
      const oppC = oppColor(color);
      const options = [];
      if (offCount(color) > 0 && value > 0) {
        const newK = Math.min(11, value);
        const mergeCount = piecesAtK(color, newK).length;
        const captureCount = (newK >= 1 && newK <= 10) ? piecesAtK(oppC, newK).length : 0;
        options.push({
          type: 'enter',
          main: T.enterMain,
          sub: newK === 11 ? T.enterSubHome : T.enterSub(newK),
          tag: captureCount > 0 ? 'capture' : (mergeCount > 0 ? 'merge' : (newK === 11 ? 'finish' : null)),
        });
      }
      const seen = new Set();
      state.pieces[color].forEach((p) => {
        if (p.k >= 1 && p.k <= 10 && !seen.has(p.k)) {
          seen.add(p.k);
          const fromK = p.k;
          let newK = fromK + value;
          if (newK < 0) newK = 0;
          if (newK > 11) newK = 11;
          const groupSize = piecesAtK(color, fromK).length;
          const mergeCount = newK >= 1 ? piecesAtK(color, newK).length : 0;
          const captureCount = (newK >= 1 && newK <= 10) ? piecesAtK(oppC, newK).length : 0;
          const main = groupSize > 1 ? T.moveMainMulti(fromK, groupSize) : T.moveMainSingle(fromK);
          let sub;
          if (newK === 0) sub = T.moveSubHome;
          else if (newK === 11) sub = T.moveSubFinish;
          else sub = T.moveSubTo(newK);
          let tag = null;
          if (captureCount > 0) tag = 'capture';
          else if (mergeCount > 0) tag = 'merge';
          else if (newK === 11) tag = 'finish';
          options.push({ type: 'move', k: fromK, main, sub, tag });
        }
      });
      return options;
    }

    function showMoveModal() {
      if (state.pending.length === 0 || state.turn !== 'red' || state.gameOver) return;
      const T = wordsRef.current;
      const value = state.pending[0];
      const options = getMoveOptions('red', value);
      if (options.length === 0) {
        state.pending.shift();
        log(T.noPieceLog(valueLabel(value)));
        finishOneMove(false);
        return;
      }
      moveModalTitleEl.textContent = T.moveModalTitle(valueLabel(value));
      moveModalSubEl.textContent = state.pending.length > 1 ? T.moveModalSubMulti(state.pending.length - 1) : T.moveModalSubSingle;
      moveModalOptionsEl.innerHTML = '';
      const TAG_LABEL = { capture: T.tagCapture, merge: T.tagMerge, finish: T.tagFinish };
      options.forEach((opt) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'move-option';
        btn.innerHTML = `
          <span class="mo-main">${opt.main}</span>
          <span class="mo-sub">${opt.sub}</span>
          ${opt.tag ? `<span class="mo-tag ${opt.tag}">${TAG_LABEL[opt.tag]}</span>` : ''}
        `;
        btn.addEventListener('click', () => selectMoveOption(opt));
        moveModalOptionsEl.appendChild(btn);
      });
      moveModalEl.classList.add('show');
    }

    function hideMoveModal() { moveModalEl.classList.remove('show'); }

    async function selectMoveOption(opt) {
      hideMoveModal();
      const value = state.pending.shift();
      state.busy = true;
      updateHeader();
      let res;
      if (opt.type === 'enter') res = enterPiece('red', value);
      else res = applyMove('red', opt.k, value);
      await sleep(200);
      if (destroyedRef.current) return;
      state.busy = false;
      render();
      if (checkWin('red')) return;
      if (res && res.captured) {
        log(wordsRef.current.captureLogMe);
        state.pending = [];
        updateHeader();
        return;
      }
      finishOneMove(true);
    }

    function finishOneMove(rendered) {
      if (!rendered) render();
      if (checkWin('red')) return;
      if (state.pending.length === 0) {
        state.turn = 'blue';
        resultTextEl.textContent = ' ';
        updateHeader();
        setTimeout(() => { if (!destroyedRef.current) doThrow('blue'); }, 700);
      } else {
        updateHeader();
        setTimeout(() => { if (!destroyedRef.current) showMoveModal(); }, 250);
      }
    }

    function chooseComputerMove(value) {
      const color = 'blue', oppC = 'red';
      const options = [];
      if (offCount(color) > 0) {
        const newK = Math.max(0, Math.min(11, value));
        let score = newK;
        if (newK >= 1 && newK <= 10 && piecesAtK(oppC, newK).length > 0) score += 100;
        if (newK === 11) score += 20;
        options.push({ type: 'enter', score });
      }
      const seen = new Set();
      state.pieces[color].forEach((p) => {
        if (p.k >= 1 && p.k <= 10 && !seen.has(p.k)) {
          seen.add(p.k);
          let newK = p.k + value;
          if (newK < 0) newK = 0;
          if (newK > 11) newK = 11;
          let score = newK * 2;
          if (newK >= 1 && newK <= 10 && piecesAtK(oppC, newK).length > 0) score += 100;
          if (newK === 11) score += 30;
          if (newK === 0 && value < 0) score -= 10;
          options.push({ type: 'move', k: p.k, score });
        }
      });
      if (options.length === 0) return { type: 'enter' };
      options.sort((a, b) => b.score - a.score);
      return options[0];
    }

    async function computerResolveMoves() {
      while (state.pending.length > 0) {
        const value = state.pending.shift();
        const best = chooseComputerMove(value);
        state.busy = true;
        updateHeader();
        let res;
        if (best.type === 'enter') res = enterPiece('blue', value);
        else res = applyMove('blue', best.k, value);
        await sleep(500);
        if (destroyedRef.current) return;
        state.busy = false;
        render();
        if (checkWin('blue')) return;
        if (res && res.captured) {
          log(wordsRef.current.captureLogComputer);
          state.pending = [];
          await sleep(400);
          if (destroyedRef.current) return;
          await doThrow('blue');
          return;
        }
        updateHeader();
        await sleep(300);
        if (destroyedRef.current) return;
      }
      log(wordsRef.current.yourTurnLog);
      state.turn = 'red';
      updateHeader();
      render();
    }

    function resetGame() {
      state = {
        turn: 'red',
        pieces: { red: freshPieces(), blue: freshPieces() },
        pending: [],
        gameOver: false,
        busy: false,
      };
      resultTextEl.textContent = ' ';
      log(wordsRef.current.startLog);
      buildSticks();
      overlayEl.classList.remove('show');
      hideMoveModal();
      render();
    }
    resetBtnEl.addEventListener('click', resetGame);
    overlayResetEl.addEventListener('click', resetGame);

    applyLanguageRef.current = function applyLanguage() {
      const T = wordsRef.current;
      if (homeLabelEl) homeLabelEl.textContent = T.homeLabel;
      updateHeader();
    };

    log(wordsRef.current.startLog);
    render();

    return () => {
      destroyedRef.current = true;
      throwBtnEl.removeEventListener('click', handleThrowClick);
      resetBtnEl.removeEventListener('click', resetGame);
      overlayResetEl.removeEventListener('click', resetGame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    wordsRef.current = words;
    applyLanguageRef.current();
  }, [words]);

  return (
    <div className="yutnori-app" ref={rootRef}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Song+Myung&family=Noto+Sans+KR:wght@400;500;700;900&display=swap" rel="stylesheet" />

      <p className="no-print" style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 18 }}>
        <a href="/">{words.home}</a> / <a href="/games.html">{words.hub}</a> / {words.crumbCurrent}
      </p>

      <div className="title-wrap">
        <h1>{words.title}</h1>
        <div className="subtitle">{words.subtitle}</div>
      </div>

      <div className="layout">
        <div className="board-card">
          <svg id="yn-board" viewBox="0 0 600 600" />
        </div>

        <div className="panel">
          <div className="turn-row">
            <div className="turn-badge" id="yn-turnBadge">
              <span className="turn-dot red" />
              <span id="yn-turnText" />
            </div>
            <div className="score-mini" id="yn-scoreMini" />
          </div>

          <div className="sticks-area" id="yn-sticksArea" />
          <div className="result-text" id="yn-resultText">{' '}</div>
          <div className="pending-row" id="yn-pendingRow">{' '}</div>

          <div className="btn-row">
            <button type="button" className="main-btn" id="yn-throwBtn">{words.throwBtn}</button>
            <button type="button" className="reset-btn" id="yn-resetBtn">{words.resetBtn}</button>
            <button type="button" className="reset-btn" onClick={() => setTutorialOpen(true)}>{words.tutorialBtn}</button>
          </div>

          <div className="trays">
            <div className="tray">
              <div className="tray-label">{words.trayMe}</div>
              <div className="tray-tokens" id="yn-redTray" />
            </div>
            <div className="tray">
              <div className="tray-label">{words.trayComputer}</div>
              <div className="tray-tokens" id="yn-blueTray" />
            </div>
          </div>

          <div className="log-box" id="yn-logBox">{' '}</div>
        </div>
      </div>

      <div className="overlay" id="yn-overlay">
        <h2 id="yn-overlayTitle" />
        <p id="yn-overlaySub" />
        <button type="button" className="main-btn" id="yn-overlayReset">{words.playAgain}</button>
      </div>

      <div className="move-modal" id="yn-moveModal">
        <div className="move-modal-inner">
          <div className="move-modal-title" id="yn-moveModalTitle" />
          <div className="move-modal-sub" id="yn-moveModalSub" />
          <div id="yn-moveModalOptions" />
        </div>
      </div>

      {tutorialOpen ? (
        <div className="tutorial-overlay" role="dialog" aria-modal="true" aria-label={words.introTitle}>
          <div className="tutorial-card">
            <p className="tutorial-badge">{words.introBadge}</p>
            <h2>{words.introTitle}</h2>
            <h3>{words.introWhatTitle}</h3>
            <p>{words.introWhat}</p>
            <h3>{words.introMathTitle}</h3>
            <p>{words.introMath}</p>
            <h3>{words.introHowTitle}</h3>
            <ul>{words.introHow.map((line, i) => <li key={i}>{line}</li>)}</ul>
            <button
              type="button"
              className="main-btn"
              onClick={() => { setHasStarted(true); setTutorialOpen(false); }}
            >
              {hasStarted ? words.closeBtn : words.introStart}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
