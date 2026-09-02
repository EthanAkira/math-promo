'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../language';

const LATIN_OUTCOME_NAMES = { backdo: 'Back-do', do: 'Do', gae: 'Gae', geol: 'Geol', yut: 'Yut', mo: 'Mo' };

// High-fidelity Web Audio Synthesizer
let sharedAudioCtx = null;
function ensureAudioCtx() {
  if (typeof window === 'undefined') return null;
  if (!sharedAudioCtx) {
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return null;
    sharedAudioCtx = new Ctor();
  }
  if (sharedAudioCtx.state === 'suspended') sharedAudioCtx.resume().catch(() => {});
  return sharedAudioCtx;
}

function playWoodTossSound() {
  const ctx = ensureAudioCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  const clicks = [
    { delay: 0.0, freq: 950, dur: 0.032, gain: 0.38 },
    { delay: 0.035, freq: 1180, dur: 0.028, gain: 0.30 },
    { delay: 0.08, freq: 760, dur: 0.038, gain: 0.32 },
    { delay: 0.14, freq: 1020, dur: 0.030, gain: 0.28 },
    { delay: 0.20, freq: 850, dur: 0.035, gain: 0.24 },
  ];
  clicks.forEach(({ delay, freq, dur, gain }) => {
    try {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + delay);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.35, now + delay + dur);
      gainNode.gain.setValueAtTime(0.001, now + delay);
      gainNode.gain.linearRampToValueAtTime(gain, now + delay + 0.003);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + delay + dur);
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(now + delay);
      osc.stop(now + delay + dur + 0.01);
    } catch {}
  });
}

function playMatLandSound(isBonus = false) {
  const ctx = ensureAudioCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  try {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(155, now);
    osc.frequency.exponentialRampToValueAtTime(38, now + 0.14);
    gainNode.gain.setValueAtTime(0.45, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);
  } catch {}
  try {
    const osc2 = ctx.createOscillator();
    const gainNode2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(540, now + 0.01);
    osc2.frequency.exponentialRampToValueAtTime(150, now + 0.07);
    gainNode2.gain.setValueAtTime(0.28, now + 0.01);
    gainNode2.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc2.connect(gainNode2);
    gainNode2.connect(ctx.destination);
    osc2.start(now + 0.01);
    osc2.stop(now + 0.09);
  } catch {}
  if (isBonus) {
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      try {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + 0.08 + i * 0.06);
        g.gain.setValueAtTime(0.001, now + 0.08 + i * 0.06);
        g.gain.linearRampToValueAtTime(0.22, now + 0.08 + i * 0.06 + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.08 + i * 0.06 + 0.2);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(now + 0.08 + i * 0.06);
        osc.stop(now + 0.08 + i * 0.06 + 0.22);
      } catch {}
    });
  }
}

function playCaptureSound() {
  const ctx = ensureAudioCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  try {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(360, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.24);
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.26);
  } catch {}
}

function playFinishSound() {
  const ctx = ensureAudioCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
    try {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.09);
      gainNode.gain.setValueAtTime(0.001, now + i * 0.09);
      gainNode.gain.linearRampToValueAtTime(0.25, now + i * 0.09 + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.32);
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(now + i * 0.09);
      osc.stop(now + i * 0.09 + 0.34);
    } catch {}
  });
}

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
    outcomeNames: LATIN_OUTCOME_NAMES,
  },
  'zh-CN': {
    home: '首页', hub: '休息角', crumbCurrent: '尤茨诺利',
    title: '尤茨诺利', subtitle: '传统棋盘游戏 · 你（红方）对战电脑（蓝方）',
    tutorialBtn: '教程与规则',
    introBadge: '开始之前', introTitle: '先来了解一下尤茨诺利',
    introWhatTitle: '什么是尤茨诺利？',
    introWhat: '尤茨诺利（掷柶游戏）是韩国的传统棋盘游戏：投掷四根木棍，根据结果让四枚棋子绕盘前进，最先让四枚棋子都回到起点的一方获胜。从农历新年到正月十五，全家老少都会一起玩，掷出的结果还曾被用来占卜新年运势，这一习俗叫"윷占（掷柶占）"。도（Do）、개（Gae）、걸（Geol）、윷（Yut）、모（Mo）这几个结果名称据说分别代表猪、狗、羊、牛、马——动物越大，棋子前进的步数也越多。',
    introMathTitle: '尤茨诺利里的一点数学',
    introMath: '投掷四根木棍的结果服从二项分布。有趣的是，组合数最多的"개（Gae）"和"걸（Geol）"在理论上比"도（Do）"更常出现（比例为1∶4∶6∶4∶1）。平均每投一次，棋子大约前进2.31步。',
    introHowTitle: '玩法简介',
    introHow: [
      '仰面朝上的木棍数：0根→모(5步，再投一次)·1根→도(1步)·2根→개(2步)·3根→걸(3步)·4根→윷(4步，再投一次)',
      '在拐角处走对角线捷径，能更快回到终点。',
      '同一方的棋子相遇可以叠在一起同行，吃掉对方棋子还能再投一次。',
    ],
    introStart: '开始游戏', closeBtn: '关闭',
    turnMe: '轮到你了', turnComputer: '轮到电脑了',
    finished: (r, b) => `到达 ${r} : ${b}`,
    throwBtn: '投掷木棍', resetBtn: '新游戏',
    trayMe: '我方棋子（等待中）', trayComputer: '电脑棋子（等待中）',
    startLog: '投掷木棍开始游戏吧。',
    bonusLog: (name) => `${name}！可以再投一次。`,
    chooseMoveLog: '请选择要移动的棋子。',
    computerMovingLog: '电脑正在移动……',
    captureLogMe: '你吃掉了对方的棋子！再投一次。',
    captureLogComputer: '电脑吃掉了你的棋子！',
    yourTurnLog: '轮到你了，投掷木棍吧。',
    noPieceLog: (label) => `没有棋子可以使用${label}，本次投掷作废。`,
    pendingLabel: '剩余步数：',
    backdoValue: '倒退一步(-1)',
    stepsValue: (v) => `${v}步`,
    winTitleMe: '你赢了！', winTitleComputer: '电脑获胜',
    winSubMe: '你的棋子全部到达终点。', winSubComputer: '电脑的棋子全部到达终点，再接再厉！',
    playAgain: '再玩一次',
    moveModalTitle: (label) => `${label} — 要移动哪枚棋子？`,
    moveModalSubMulti: (n) => `请先用掉这个步数（还剩 ${n} 个）`,
    moveModalSubSingle: '请选择下面的移动方式',
    enterMain: '派出新棋子', enterSubHome: '直接到达终点！',
    enterSub: (k) => `等待中的棋子进入第 ${k} 格`,
    moveMainMulti: (k, n) => `第 ${k} 格的 ${n} 枚棋子（叠在一起）前进`,
    moveMainSingle: (k) => `第 ${k} 格的棋子前进`,
    moveSubHome: '返回等待区', moveSubFinish: '到达终点！',
    moveSubTo: (k) => `移动到第 ${k} 格`,
    tagCapture: '🎯 吃子！', tagMerge: '🤝 叠子（与我方棋子合并）', tagFinish: '🏠 到达终点！',
    homeLabel: '终点',
    outcomeNames: LATIN_OUTCOME_NAMES,
  },
  fr: {
    home: 'Accueil', hub: 'Coin détente', crumbCurrent: 'Yutnori',
    title: 'Yutnori', subtitle: 'Plateau traditionnel · Vous (Rouge) contre l’ordinateur (Bleu)',
    tutorialBtn: 'Tutoriel et règles',
    introBadge: 'Avant de commencer', introTitle: 'Un aperçu du Yutnori',
    introWhatTitle: 'Qu’est-ce que le Yutnori ?',
    introWhat: 'Le Yutnori est un jeu de plateau traditionnel coréen : on lance quatre bâtonnets de bois et on fait avancer quatre pions sur le plateau — le premier camp à ramener ses quatre pions au départ gagne. Les familles de tous âges y jouent ensemble du Nouvel An lunaire jusqu’à la première pleine lune, et les lancers servaient aussi à un rite divinatoire appelé « yutjeom ». Les noms des résultats — Do, Gae, Geol, Yut et Mo — représenteraient un cochon, un chien, un mouton, un bœuf et un cheval : plus l’animal est grand, plus le pion avance loin.',
    introMathTitle: 'Une pincée de mathématiques',
    introMath: 'Le résultat du lancer de quatre bâtonnets suit une loi binomiale. Fait amusant : « Gae » et « Geol » ont plus de combinaisons possibles que « Do » et sortent donc théoriquement plus souvent (1 : 4 : 6 : 4 : 1). En moyenne, un lancer fait avancer un pion d’environ 2,31 cases.',
    introHowTitle: 'Comment jouer',
    introHow: [
      '0 bâtonnet à plat → Mo (5 cases, relancez) · 1 → Do (1 case) · 2 → Gae (2 cases) · 3 → Geol (3 cases) · 4 → Yut (4 cases, relancez)',
      'Couper par un raccourci en diagonale à un coin permet de rentrer beaucoup plus vite.',
      'Empilez vos pions sur la même case pour les déplacer ensemble, et capturez un pion adverse pour rejouer.',
    ],
    introStart: 'Commencer à jouer', closeBtn: 'Fermer',
    turnMe: 'À vous de jouer', turnComputer: "Tour de l'ordinateur",
    finished: (r, b) => `Rentrés ${r} : ${b}`,
    throwBtn: 'Lancer les bâtonnets', resetBtn: 'Nouvelle partie',
    trayMe: 'Vos pions (en attente)', trayComputer: "Pions de l'ordinateur (en attente)",
    startLog: 'Lancez les bâtonnets pour commencer.',
    bonusLog: (name) => `${name} ! Relancez.`,
    chooseMoveLog: 'Choisissez votre déplacement.',
    computerMovingLog: "L'ordinateur joue...",
    captureLogMe: 'Vous avez capturé un pion ! Relancez.',
    captureLogComputer: "L'ordinateur a capturé votre pion !",
    yourTurnLog: 'À vous — lancez les bâtonnets.',
    noPieceLog: (label) => `Aucun pion ne peut utiliser ${label}, ce lancer est ignoré.`,
    pendingLabel: 'Lancers restants : ',
    backdoValue: 'Back-do (-1 case)',
    stepsValue: (v) => `${v} case${v === 1 ? '' : 's'}`,
    winTitleMe: 'Vous avez gagné !', winTitleComputer: "L'ordinateur gagne",
    winSubMe: 'Tous vos pions sont rentrés.', winSubComputer: "Tous les pions de l'ordinateur sont rentrés. Retentez votre chance !",
    playAgain: 'Rejouer',
    moveModalTitle: (label) => `${label} — quel pion voulez-vous déplacer ?`,
    moveModalSubMulti: (n) => `Utilisez d’abord ce lancer (encore ${n} lancer${n === 1 ? '' : 's'})`,
    moveModalSubSingle: 'Choisissez un déplacement ci-dessous',
    enterMain: 'Faire entrer un nouveau pion', enterSubHome: 'Il rentre directement !',
    enterSub: (k) => `Un pion en attente entre à la case ${k}`,
    moveMainMulti: (k, n) => `Déplacer les ${n} pions empilés à la case ${k}`,
    moveMainSingle: (k) => `Déplacer le pion à la case ${k}`,
    moveSubHome: 'Il retourne dans la zone d’attente', moveSubFinish: 'Il rentre !',
    moveSubTo: (k) => `Se déplace à la case ${k}`,
    tagCapture: '🎯 Capture !', tagMerge: '🤝 Empiler (fusion avec votre pion)', tagFinish: '🏠 Rentré !',
    homeLabel: 'Maison',
    outcomeNames: LATIN_OUTCOME_NAMES,
  },
  es: {
    home: 'Inicio', hub: 'Rincón de descanso', crumbCurrent: 'Yutnori',
    title: 'Yutnori', subtitle: 'Tablero tradicional · Tú (Rojo) contra la computadora (Azul)',
    tutorialBtn: 'Tutorial y reglas',
    introBadge: 'Antes de empezar', introTitle: 'Un vistazo rápido al Yutnori',
    introWhatTitle: '¿Qué es el Yutnori?',
    introWhat: 'El Yutnori es un juego de mesa tradicional coreano: se lanzan cuatro palos de madera y se mueven cuatro fichas por el tablero — gana el primer bando que lleve sus cuatro fichas de vuelta al inicio. Familias de todas las edades lo juegan juntas desde el Año Nuevo lunar hasta la primera luna llena, y los lanzamientos también se usaban para un ritual adivinatorio llamado "yutjeom". Se dice que los nombres de los resultados —Do, Gae, Geol, Yut y Mo— representan un cerdo, un perro, una oveja, un buey y un caballo: cuanto más grande el animal, más avanza la ficha.',
    introMathTitle: 'Una pizca de matemáticas',
    introMath: 'El resultado de lanzar cuatro palos sigue una distribución binomial. Curiosamente, "Gae" y "Geol" tienen más combinaciones posibles que "Do" y, en teoría, salen con más frecuencia (1 : 4 : 6 : 4 : 1). En promedio, cada lanzamiento avanza una ficha unas 2.31 casillas.',
    introHowTitle: 'Cómo se juega',
    introHow: [
      '0 palos boca arriba → Mo (5 casillas, tira otra vez) · 1 → Do (1 casilla) · 2 → Gae (2 casillas) · 3 → Geol (3 casillas) · 4 → Yut (4 casillas, tira otra vez)',
      'Tomar el atajo diagonal en una esquina permite llegar a la meta mucho más rápido.',
      'Apila tus fichas en la misma casilla para moverlas juntas, y captura una ficha rival para tirar otra vez.',
    ],
    introStart: 'Empezar a jugar', closeBtn: 'Cerrar',
    turnMe: 'Tu turno', turnComputer: 'Turno de la computadora',
    finished: (r, b) => `Meta ${r} : ${b}`,
    throwBtn: 'Lanzar los palos', resetBtn: 'Nueva partida',
    trayMe: 'Tus fichas (en espera)', trayComputer: 'Fichas de la computadora (en espera)',
    startLog: 'Lanza los palos para comenzar.',
    bonusLog: (name) => `¡${name}! Tira otra vez.`,
    chooseMoveLog: 'Elige cómo mover.',
    computerMovingLog: 'La computadora está moviendo...',
    captureLogMe: '¡Capturaste una ficha! Tira otra vez.',
    captureLogComputer: '¡La computadora capturó tu ficha!',
    yourTurnLog: 'Tu turno: lanza los palos.',
    noPieceLog: (label) => `Ninguna ficha puede usar ${label}, así que este lanzamiento se pierde.`,
    pendingLabel: 'Lanzamientos restantes: ',
    backdoValue: 'Back-do (-1 casilla)',
    stepsValue: (v) => `${v} casilla${v === 1 ? '' : 's'}`,
    winTitleMe: '¡Ganaste!', winTitleComputer: 'Gana la computadora',
    winSubMe: 'Todas tus fichas llegaron a la meta.', winSubComputer: '¡Todas las fichas de la computadora llegaron a la meta. Inténtalo de nuevo!',
    playAgain: 'Jugar de nuevo',
    moveModalTitle: (label) => `${label} — ¿qué ficha quieres mover?`,
    moveModalSubMulti: (n) => `Usa primero este lanzamiento (quedan ${n} más)`,
    moveModalSubSingle: 'Elige un movimiento abajo',
    enterMain: 'Sacar una ficha nueva', enterSubHome: '¡Llega directo a la meta!',
    enterSub: (k) => `Una ficha en espera entra en la casilla ${k}`,
    moveMainMulti: (k, n) => `Mueve las ${n} fichas apiladas en la casilla ${k}`,
    moveMainSingle: (k) => `Mueve la ficha en la casilla ${k}`,
    moveSubHome: 'Vuelve a la zona de espera', moveSubFinish: '¡Llega a la meta!',
    moveSubTo: (k) => `Se mueve a la casilla ${k}`,
    tagCapture: '🎯 ¡Captura!', tagMerge: '🤝 Apilar (se une a tu ficha)', tagFinish: '🏠 ¡Meta!',
    homeLabel: 'Casa',
    outcomeNames: LATIN_OUTCOME_NAMES,
  },
  ja: {
    home: 'ホーム', hub: '息抜きコーナー', crumbCurrent: 'ユンノリ',
    title: 'ユンノリ', subtitle: '伝統盤ゲーム · あなた（赤）対 コンピューター（青）',
    tutorialBtn: 'チュートリアル・説明',
    introBadge: '始める前に', introTitle: 'ユンノリってどんな遊び？',
    introWhatTitle: 'ユンノリとは？',
    introWhat: 'ユンノリは、4本の木の棒（ユッ）を投げた結果でコマを4つ進め、先に4つとも出発点に戻したほうが勝ちという韓国の伝統的なボードゲームです。旧正月から正月十五夜（大보름）まで、老若男女が一緒に楽しみ、出た目でその年の運勢を占う「ユッ占い」という風習にも使われてきました。도（ド）・개（ケ）・걸（コル）・윷（ユッ）・모（モ）という結果の名前は、それぞれ豚・犬・羊・牛・馬を表すと言われ、動物が大きいほどコマが進むマス数も増えます。',
    introMathTitle: 'ユンノリに隠れた数学',
    introMath: '4本の棒を投げた結果は二項分布に従います。面白いことに、組み合わせの数が最も多い「개（ケ）」と「걸（コル）」は、理論上「도（ド）」よりも出やすいのです（比は1：4：6：4：1）。1回投げると、平均して約2.31マス進みます。',
    introHowTitle: '遊び方の要約',
    introHow: [
      '表になった棒の数：0本→모(5マス、もう一度)・1本→도(1マス)・2本→개(2マス)・3本→걸(3マス)・4本→윷(4マス、もう一度)',
      '角の近道（対角線）を通ると、ずっと早くゴールできます。',
      '自分のコマ同士が同じマスに来たら重ねて一緒に進め、相手のコマを捕まえるともう一度投げられます。',
    ],
    introStart: '始める', closeBtn: '閉じる',
    turnMe: 'あなたの番', turnComputer: 'コンピューターの番',
    finished: (r, b) => `ゴール ${r} : ${b}`,
    throwBtn: 'ユッを投げる', resetBtn: '新しいゲーム',
    trayMe: '自分のコマ（待機中）', trayComputer: 'コンピューターのコマ（待機中）',
    startLog: 'ユッを投げて始めましょう。',
    bonusLog: (name) => `${name}！もう一度投げられます。`,
    chooseMoveLog: 'どのコマを動かすか選んでください。',
    computerMovingLog: 'コンピューターが移動中...',
    captureLogMe: '相手のコマを捕まえました！もう一度投げてください。',
    captureLogComputer: 'コンピューターがあなたのコマを捕まえました！',
    yourTurnLog: 'あなたの番です。ユッを投げてください。',
    noPieceLog: (label) => `${label}を使えるコマがないため、この目はスキップされます。`,
    pendingLabel: '残りの手番: ',
    backdoValue: 'ペクド（-1マス）',
    stepsValue: (v) => `${v}マス`,
    winTitleMe: '勝利しました！', winTitleComputer: 'コンピューターの勝ち',
    winSubMe: 'あなたのコマが全てゴールしました。', winSubComputer: 'コンピューターのコマが全てゴールしました。次は頑張りましょう！',
    playAgain: 'もう一度遊ぶ',
    moveModalTitle: (label) => `${label} — どのコマを動かしますか？`,
    moveModalSubMulti: (n) => `まずこの目を使ってください（あと${n}個残っています）`,
    moveModalSubSingle: '下から移動を選んでください',
    enterMain: '新しいコマを出す', enterSubHome: 'そのままゴールです！',
    enterSub: (k) => `待機中のコマが${k}マス目に出ます`,
    moveMainMulti: (k, n) => `${k}マス目のコマ${n}個（重なった状態）が進みます`,
    moveMainSingle: (k) => `${k}マス目のコマが進みます`,
    moveSubHome: '待機エリアに戻ります', moveSubFinish: 'ゴールです！',
    moveSubTo: (k) => `${k}マス目に移動します`,
    tagCapture: '🎯 相手のコマを捕まえる！', tagMerge: '🤝 重ねる（自分のコマと合体）', tagFinish: '🏠 ゴール！',
    homeLabel: 'ゴール',
    outcomeNames: LATIN_OUTCOME_NAMES,
  },
  ru: {
    home: 'Главная', hub: 'Уголок отдыха', crumbCurrent: 'Ют-нори',
    title: 'Ют-нори', subtitle: 'Традиционная доска · Вы (Красные) против компьютера (Синие)',
    tutorialBtn: 'Обучение и правила',
    introBadge: 'Перед началом', introTitle: 'Коротко о Ют-нори',
    introWhatTitle: 'Что такое Ют-нори?',
    introWhat: 'Ют-нори — традиционная корейская настольная игра: бросают четыре деревянные палочки и передвигают по доске четыре фишки — побеждает тот, кто первым вернёт все четыре фишки домой. В неё играют всей семьёй с Нового года по лунному календарю до первого полнолуния, а броски также использовались для гадания на удачу в новом году — обычай «ютджом». Считается, что названия результатов — До, Гэ, Гёль, Ют и Мо — означают свинью, собаку, овцу, быка и лошадь: чем крупнее животное, тем дальше движется фишка.',
    introMathTitle: 'Немного математики',
    introMath: 'Результат броска четырёх палочек подчиняется биномиальному распределению. Интересно, что у «Гэ» и «Гёль» больше сочетаний, чем у «До», поэтому теоретически они выпадают чаще (1 : 4 : 6 : 4 : 1). В среднем один бросок продвигает фишку примерно на 2,31 клетки.',
    introHowTitle: 'Как играть',
    introHow: [
      '0 палочек плоской стороной вверх → Мо (5 клеток, бросок ещё раз) · 1 → До (1 клетка) · 2 → Гэ (2 клетки) · 3 → Гёль (3 клетки) · 4 → Ют (4 клетки, бросок ещё раз)',
      'Срезав путь по диагонали на углу, можно вернуться домой гораздо быстрее.',
      'Сложите свои фишки на одной клетке, чтобы двигать их вместе, а захват фишки соперника даёт ещё один бросок.',
    ],
    introStart: 'Начать игру', closeBtn: 'Закрыть',
    turnMe: 'Ваш ход', turnComputer: 'Ход компьютера',
    finished: (r, b) => `Дома ${r} : ${b}`,
    throwBtn: 'Бросить палочки', resetBtn: 'Новая игра',
    trayMe: 'Ваши фишки (в ожидании)', trayComputer: 'Фишки компьютера (в ожидании)',
    startLog: 'Бросьте палочки, чтобы начать.',
    bonusLog: (name) => `${name}! Бросок ещё раз.`,
    chooseMoveLog: 'Выберите, как ходить.',
    computerMovingLog: 'Компьютер ходит...',
    captureLogMe: 'Вы захватили фишку! Бросьте ещё раз.',
    captureLogComputer: 'Компьютер захватил вашу фишку!',
    yourTurnLog: 'Ваш ход — бросьте палочки.',
    noPieceLog: (label) => `Нет фишки, которая может использовать ${label}, поэтому этот бросок пропускается.`,
    pendingLabel: 'Осталось бросков: ',
    backdoValue: 'Бэк-до (-1 клетка)',
    stepsValue: (v) => `${v} кл.`,
    winTitleMe: 'Вы выиграли!', winTitleComputer: 'Компьютер выиграл',
    winSubMe: 'Все ваши фишки дома.', winSubComputer: 'Все фишки компьютера дома. Попробуйте ещё раз!',
    playAgain: 'Играть снова',
    moveModalTitle: (label) => `${label} — какую фишку передвинуть?`,
    moveModalSubMulti: (n) => `Сначала используйте этот бросок (осталось ещё ${n})`,
    moveModalSubSingle: 'Выберите ход ниже',
    enterMain: 'Вывести новую фишку', enterSubHome: 'Она сразу приходит домой!',
    enterSub: (k) => `Фишка в ожидании выходит на клетку ${k}`,
    moveMainMulti: (k, n) => `Передвинуть ${n} фишки, стоящие на клетке ${k}`,
    moveMainSingle: (k) => `Передвинуть фишку на клетке ${k}`,
    moveSubHome: 'Возвращается в зону ожидания', moveSubFinish: 'Она приходит домой!',
    moveSubTo: (k) => `Переходит на клетку ${k}`,
    tagCapture: '🎯 Захват!', tagMerge: '🤝 Сложить (объединить с вашей фишкой)', tagFinish: '🏠 Дома!',
    homeLabel: 'Дом',
    outcomeNames: LATIN_OUTCOME_NAMES,
  },
  ar: {
    home: 'الرئيسية', hub: 'ركن الاستراحة', crumbCurrent: 'يوت نوري',
    title: 'يوت نوري', subtitle: 'لوحة تقليدية · أنت (أحمر) ضد الكمبيوتر (أزرق)',
    tutorialBtn: 'الشرح والقواعد',
    introBadge: 'قبل أن تبدأ', introTitle: 'نظرة سريعة على يوت نوري',
    introWhatTitle: 'ما هي لعبة يوت نوري؟',
    introWhat: 'يوت نوري لعبة لوحية كورية تقليدية: تُرمى أربع عصي خشبية ثم تُحرَّك أربع قطع على اللوحة — يفوز الفريق الذي يعيد قطعه الأربع إلى نقطة البداية أولًا. تلعبها العائلات من كل الأعمار معًا من رأس السنة القمرية وحتى أول بدر، وكانت نتائج الرمي تُستخدم أيضًا في تقليد للتنبؤ بالحظ يُسمى "يوتجيوم". يُقال إن أسماء النتائج—دو وغيه وغيول ويوت ومو—تمثل خنزيرًا وكلبًا وخروفًا وثورًا وحصانًا؛ فكلما كبر الحيوان، تحركت القطعة مسافة أبعد.',
    introMathTitle: 'لمسة من الرياضيات',
    introMath: 'تتبع نتيجة رمي العصي الأربع التوزيع ذا الحدين. والمثير أن "غيه" و"غيول" لهما احتمالات تركيب أكثر من "دو"، فيظهران نظريًا أكثر (1 : 4 : 6 : 4 : 1). في المتوسط، تُحرّك الرمية الواحدة القطعة نحو 2.31 خانة.',
    introHowTitle: 'ملخص طريقة اللعب',
    introHow: [
      '0 عصا مقلوبة ← مو (5 خانات، ارمِ مرة أخرى) · 1 ← دو (خانة واحدة) · 2 ← غيه (خانتان) · 3 ← غيول (3 خانات) · 4 ← يوت (4 خانات، ارمِ مرة أخرى)',
      'اختصار الزاوية القطرية عند الركن يوصلك إلى البيت أسرع بكثير.',
      'كدّس قطعك في نفس الخانة لتتحرك معًا، وأسر قطعة الخصم يمنحك رمية أخرى.',
    ],
    introStart: 'ابدأ اللعب', closeBtn: 'إغلاق',
    turnMe: 'دورك', turnComputer: 'دور الكمبيوتر',
    finished: (r, b) => `وصل ${r} : ${b}`,
    throwBtn: 'ارمِ العصي', resetBtn: 'لعبة جديدة',
    trayMe: 'قطعك (في الانتظار)', trayComputer: 'قطع الكمبيوتر (في الانتظار)',
    startLog: 'ارمِ العصي لتبدأ.',
    bonusLog: (name) => `${name}! ارمِ مرة أخرى.`,
    chooseMoveLog: 'اختر كيف تتحرك.',
    computerMovingLog: 'الكمبيوتر يتحرك...',
    captureLogMe: 'أسرت قطعة! ارمِ مرة أخرى.',
    captureLogComputer: 'أسر الكمبيوتر قطعتك!',
    yourTurnLog: 'دورك — ارمِ العصي.',
    noPieceLog: (label) => `لا توجد قطعة يمكنها استخدام ${label}، لذا يُتخطى هذا الرمي.`,
    pendingLabel: 'الرميات المتبقية: ',
    backdoValue: 'باك-دو (-1 خانة)',
    stepsValue: (v) => `${v} خانة`,
    winTitleMe: 'لقد فزت!', winTitleComputer: 'فاز الكمبيوتر',
    winSubMe: 'وصلت جميع قطعك إلى البيت.', winSubComputer: 'وصلت جميع قطع الكمبيوتر إلى البيت. حاول مرة أخرى!',
    playAgain: 'العب مرة أخرى',
    moveModalTitle: (label) => `${label} — أي قطعة تريد تحريكها؟`,
    moveModalSubMulti: (n) => `استخدم هذا الرمي أولًا (تبقّى ${n} رميات أخرى)`,
    moveModalSubSingle: 'اختر حركة أدناه',
    enterMain: 'أخرج قطعة جديدة', enterSubHome: 'تصل إلى البيت مباشرة!',
    enterSub: (k) => `تدخل قطعة منتظرة عند الخانة ${k}`,
    moveMainMulti: (k, n) => `حرّك ${n} قطع مكدّسة عند الخانة ${k}`,
    moveMainSingle: (k) => `حرّك القطعة عند الخانة ${k}`,
    moveSubHome: 'تعود إلى منطقة الانتظار', moveSubFinish: 'تصل إلى البيت!',
    moveSubTo: (k) => `تنتقل إلى الخانة ${k}`,
    tagCapture: '🎯 أسر!', tagMerge: '🤝 تكديس (اندماج مع قطعتك)', tagFinish: '🏠 وصلت!',
    homeLabel: 'المنزل',
    outcomeNames: LATIN_OUTCOME_NAMES,
  },
  pt: {
    home: 'Início', hub: 'Cantinho de descanso', crumbCurrent: 'Yutnori',
    title: 'Yutnori', subtitle: 'Tabuleiro tradicional · Você (Vermelho) contra o computador (Azul)',
    tutorialBtn: 'Tutorial e regras',
    introBadge: 'Antes de começar', introTitle: 'Um resumo do Yutnori',
    introWhatTitle: 'O que é o Yutnori?',
    introWhat: 'O Yutnori é um jogo de tabuleiro tradicional coreano: você lança quatro varetas de madeira e move quatro peças pelo tabuleiro — vence quem trouxer as quatro peças de volta ao início primeiro. Famílias de todas as idades jogam juntas do Ano Novo lunar até a primeira lua cheia, e os lançamentos também eram usados num costume de adivinhação chamado "yutjeom". Diz-se que os nomes dos resultados — Do, Gae, Geol, Yut e Mo — representam um porco, um cão, uma ovelha, um boi e um cavalo: quanto maior o animal, mais a peça avança.',
    introMathTitle: 'Uma pitada de matemática',
    introMath: 'O resultado de lançar quatro varetas segue uma distribuição binomial. Curiosamente, "Gae" e "Geol" têm mais combinações do que "Do" e, teoricamente, saem com mais frequência (1 : 4 : 6 : 4 : 1). Em média, cada lançamento avança uma peça cerca de 2,31 casas.',
    introHowTitle: 'Como jogar',
    introHow: [
      '0 varetas viradas → Mo (5 casas, jogue de novo) · 1 → Do (1 casa) · 2 → Gae (2 casas) · 3 → Geol (3 casas) · 4 → Yut (4 casas, jogue de novo)',
      'Cortar caminho pela diagonal num canto leva a peça para casa muito mais rápido.',
      'Empilhe suas peças na mesma casa para movê-las juntas, e capture uma peça adversária para jogar de novo.',
    ],
    introStart: 'Começar a jogar', closeBtn: 'Fechar',
    turnMe: 'Sua vez', turnComputer: 'Vez do computador',
    finished: (r, b) => `Em casa ${r} : ${b}`,
    throwBtn: 'Lançar as varetas', resetBtn: 'Novo jogo',
    trayMe: 'Suas peças (aguardando)', trayComputer: 'Peças do computador (aguardando)',
    startLog: 'Lance as varetas para começar.',
    bonusLog: (name) => `${name}! Jogue de novo.`,
    chooseMoveLog: 'Escolha como mover.',
    computerMovingLog: 'O computador está jogando...',
    captureLogMe: 'Você capturou uma peça! Jogue de novo.',
    captureLogComputer: 'O computador capturou sua peça!',
    yourTurnLog: 'Sua vez — lance as varetas.',
    noPieceLog: (label) => `Nenhuma peça pode usar ${label}, então este lançamento é ignorado.`,
    pendingLabel: 'Lançamentos restantes: ',
    backdoValue: 'Back-do (-1 casa)',
    stepsValue: (v) => `${v} casa${v === 1 ? '' : 's'}`,
    winTitleMe: 'Você venceu!', winTitleComputer: 'O computador venceu',
    winSubMe: 'Todas as suas peças chegaram em casa.', winSubComputer: 'Todas as peças do computador chegaram em casa. Tente de novo!',
    playAgain: 'Jogar de novo',
    moveModalTitle: (label) => `${label} — qual peça você vai mover?`,
    moveModalSubMulti: (n) => `Use este lançamento primeiro (mais ${n} restante${n === 1 ? '' : 's'})`,
    moveModalSubSingle: 'Escolha um movimento abaixo',
    enterMain: 'Colocar uma peça nova', enterSubHome: 'Ela vai direto para casa!',
    enterSub: (k) => `Uma peça em espera entra na casa ${k}`,
    moveMainMulti: (k, n) => `Mover as ${n} peças empilhadas na casa ${k}`,
    moveMainSingle: (k) => `Mover a peça na casa ${k}`,
    moveSubHome: 'Ela volta para a área de espera', moveSubFinish: 'Ela chega em casa!',
    moveSubTo: (k) => `Move para a casa ${k}`,
    tagCapture: '🎯 Captura!', tagMerge: '🤝 Empilhar (junta com sua peça)', tagFinish: '🏠 Em casa!',
    homeLabel: 'Casa',
    outcomeNames: LATIN_OUTCOME_NAMES,
  },
  hi: {
    home: 'होम', hub: 'विश्राम कोना', crumbCurrent: 'युत्नोरी',
    title: 'युत्नोरी', subtitle: 'पारंपरिक बोर्ड · आप (लाल) बनाम कंप्यूटर (नीला)',
    tutorialBtn: 'ट्यूटोरियल और नियम',
    introBadge: 'शुरू करने से पहले', introTitle: 'युत्नोरी को थोड़ा जानें',
    introWhatTitle: 'युत्नोरी क्या है?',
    introWhat: 'युत्नोरी एक पारंपरिक कोरियाई बोर्ड गेम है: चार लकड़ी की छड़ियाँ फेंकी जाती हैं और नतीजे के अनुसार बोर्ड पर चार मोहरे आगे बढ़ते हैं — जो पक्ष पहले अपने चारों मोहरे वापस घर ले आए, वह जीतता है। यह खेल हर उम्र के परिवार लूनर नववर्ष से पहली पूर्णिमा तक साथ मिलकर खेलते हैं, और फेंक के नतीजों से "युत्जोम" नाम की एक भाग्य-कथन परंपरा भी जुड़ी है। नतीजों के नाम—दो, गे, गोल, युत और मो—क्रमशः सुअर, कुत्ता, भेड़, बैल और घोड़े को दर्शाते बताए जाते हैं; जानवर जितना बड़ा, मोहरा उतना ही आगे बढ़ता है।',
    introMathTitle: 'युत्नोरी में छिपा गणित',
    introMath: 'चार छड़ियाँ फेंकने का नतीजा द्विपद बंटन का पालन करता है। दिलचस्प बात यह है कि सबसे ज़्यादा संयोजनों वाले "गे" और "गोल", "दो" से सैद्धांतिक रूप से अधिक बार आते हैं (1 : 4 : 6 : 4 : 1)। एक फेंक में औसतन मोहरा लगभग 2.31 खाने आगे बढ़ता है।',
    introHowTitle: 'खेलने का तरीका',
    introHow: [
      '0 छड़ी सीधी → मो (5 खाने, दोबारा फेंकें) · 1 → दो (1 खाना) · 2 → गे (2 खाने) · 3 → गोल (3 खाने) · 4 → युत (4 खाने, दोबारा फेंकें)',
      'कोने पर तिरछा शॉर्टकट लेने से मोहरा बहुत तेज़ी से घर पहुँच जाता है।',
      'एक ही खाने में अपने मोहरे मिलें तो साथ चल सकते हैं, और प्रतिद्वंद्वी का मोहरा पकड़ने पर दोबारा फेंकने का मौका मिलता है।',
    ],
    introStart: 'खेलना शुरू करें', closeBtn: 'बंद करें',
    turnMe: 'आपकी बारी', turnComputer: 'कंप्यूटर की बारी',
    finished: (r, b) => `घर पहुँचे ${r} : ${b}`,
    throwBtn: 'छड़ियाँ फेंकें', resetBtn: 'नया खेल',
    trayMe: 'आपके मोहरे (प्रतीक्षा में)', trayComputer: 'कंप्यूटर के मोहरे (प्रतीक्षा में)',
    startLog: 'शुरू करने के लिए छड़ियाँ फेंकें।',
    bonusLog: (name) => `${name}! दोबारा फेंकें।`,
    chooseMoveLog: 'चुनें कि कैसे चलना है।',
    computerMovingLog: 'कंप्यूटर चल रहा है...',
    captureLogMe: 'आपने मोहरा पकड़ लिया! दोबारा फेंकें।',
    captureLogComputer: 'कंप्यूटर ने आपका मोहरा पकड़ लिया!',
    yourTurnLog: 'आपकी बारी — छड़ियाँ फेंकें।',
    noPieceLog: (label) => `${label} के लिए कोई मोहरा नहीं है, इसलिए यह फेंक छोड़ी जा रही है।`,
    pendingLabel: 'बाकी फेंकें: ',
    backdoValue: 'बैक-दो (-1 खाना)',
    stepsValue: (v) => `${v} खाना`,
    winTitleMe: 'आप जीत गए!', winTitleComputer: 'कंप्यूटर जीता',
    winSubMe: 'आपके सभी मोहरे घर पहुँच गए।', winSubComputer: 'कंप्यूटर के सभी मोहरे घर पहुँच गए। फिर कोशिश करें!',
    playAgain: 'फिर से खेलें',
    moveModalTitle: (label) => `${label} — कौन-सा मोहरा चलाएँगे?`,
    moveModalSubMulti: (n) => `पहले यह फेंक इस्तेमाल करें (${n} और बाकी हैं)`,
    moveModalSubSingle: 'नीचे से एक चाल चुनें',
    enterMain: 'नया मोहरा भेजें', enterSubHome: 'यह सीधे घर पहुँच जाता है!',
    enterSub: (k) => `प्रतीक्षारत मोहरा खाना ${k} पर आता है`,
    moveMainMulti: (k, n) => `खाना ${k} पर जमा ${n} मोहरे आगे बढ़ें`,
    moveMainSingle: (k) => `खाना ${k} पर मोहरा आगे बढ़े`,
    moveSubHome: 'यह प्रतीक्षा क्षेत्र में लौटता है', moveSubFinish: 'यह घर पहुँच जाता है!',
    moveSubTo: (k) => `खाना ${k} पर जाता है`,
    tagCapture: '🎯 मोहरा पकड़ा!', tagMerge: '🤝 जमाना (आपके मोहरे से मिलना)', tagFinish: '🏠 घर पहुँचा!',
    homeLabel: 'घर',
    outcomeNames: LATIN_OUTCOME_NAMES,
  },
  vi: {
    home: 'Trang chủ', hub: 'Góc thư giãn', crumbCurrent: 'Yutnori',
    title: 'Yutnori', subtitle: 'Bàn cờ truyền thống · Bạn (Đỏ) đấu với máy tính (Xanh)',
    tutorialBtn: 'Hướng dẫn & luật chơi',
    introBadge: 'Trước khi bắt đầu', introTitle: 'Tìm hiểu nhanh về Yutnori',
    introWhatTitle: 'Yutnori là gì?',
    introWhat: 'Yutnori là trò chơi cờ bàn truyền thống của Hàn Quốc: tung bốn thanh gỗ rồi di chuyển bốn quân cờ quanh bàn cờ — bên nào đưa cả bốn quân về đích trước sẽ thắng. Các gia đình mọi lứa tuổi cùng chơi từ Tết Nguyên Đán đến rằm tháng Giêng, và kết quả tung còn được dùng để xem vận may đầu năm qua tục "yutjeom". Tên các kết quả — Do, Gae, Geol, Yut và Mo — được cho là tượng trưng cho lợn, chó, cừu, bò và ngựa: con vật càng lớn, quân cờ càng đi được xa.',
    introMathTitle: 'Một chút toán học trong Yutnori',
    introMath: 'Kết quả tung bốn thanh gỗ tuân theo phân phối nhị thức. Thú vị là "Gae" và "Geol" có nhiều tổ hợp hơn "Do" nên về lý thuyết xuất hiện thường xuyên hơn (1 : 4 : 6 : 4 : 1). Trung bình mỗi lần tung, quân cờ di chuyển khoảng 2,31 ô.',
    introHowTitle: 'Tóm tắt cách chơi',
    introHow: [
      '0 thanh ngửa → Mo (5 ô, tung lại) · 1 → Do (1 ô) · 2 → Gae (2 ô) · 3 → Geol (3 ô) · 4 → Yut (4 ô, tung lại)',
      'Đi tắt theo đường chéo ở góc giúp về đích nhanh hơn nhiều.',
      'Chồng các quân cùng phe lên nhau để đi cùng lúc, và bắt được quân đối phương thì được tung thêm lượt.',
    ],
    introStart: 'Bắt đầu chơi', closeBtn: 'Đóng',
    turnMe: 'Lượt của bạn', turnComputer: 'Lượt của máy tính',
    finished: (r, b) => `Về đích ${r} : ${b}`,
    throwBtn: 'Tung que', resetBtn: 'Ván mới',
    trayMe: 'Quân của bạn (đang chờ)', trayComputer: 'Quân của máy tính (đang chờ)',
    startLog: 'Tung que để bắt đầu.',
    bonusLog: (name) => `${name}! Được tung lại.`,
    chooseMoveLog: 'Chọn cách di chuyển.',
    computerMovingLog: 'Máy tính đang đi...',
    captureLogMe: 'Bạn đã bắt được một quân! Tung lại nào.',
    captureLogComputer: 'Máy tính đã bắt quân của bạn!',
    yourTurnLog: 'Đến lượt bạn — hãy tung que.',
    noPieceLog: (label) => `Không có quân nào dùng được ${label}, nên lượt này bị bỏ qua.`,
    pendingLabel: 'Số lượt còn lại: ',
    backdoValue: 'Back-do (-1 ô)',
    stepsValue: (v) => `${v} ô`,
    winTitleMe: 'Bạn đã thắng!', winTitleComputer: 'Máy tính thắng',
    winSubMe: 'Tất cả quân của bạn đã về đích.', winSubComputer: 'Tất cả quân của máy tính đã về đích. Chơi lại nhé!',
    playAgain: 'Chơi lại',
    moveModalTitle: (label) => `${label} — bạn muốn di chuyển quân nào?`,
    moveModalSubMulti: (n) => `Dùng lượt này trước (còn ${n} lượt nữa)`,
    moveModalSubSingle: 'Chọn một nước đi bên dưới',
    enterMain: 'Đưa quân mới ra', enterSubHome: 'Về đích luôn!',
    enterSub: (k) => `Một quân đang chờ vào ô ${k}`,
    moveMainMulti: (k, n) => `Di chuyển ${n} quân đang chồng ở ô ${k}`,
    moveMainSingle: (k) => `Di chuyển quân ở ô ${k}`,
    moveSubHome: 'Quay lại khu vực chờ', moveSubFinish: 'Về đích!',
    moveSubTo: (k) => `Di chuyển đến ô ${k}`,
    tagCapture: '🎯 Bắt quân!', tagMerge: '🤝 Chồng quân (gộp với quân của bạn)', tagFinish: '🏠 Về đích!',
    homeLabel: 'Nhà',
    outcomeNames: LATIN_OUTCOME_NAMES,
  },
  id: {
    home: 'Beranda', hub: 'Sudut Istirahat', crumbCurrent: 'Yutnori',
    title: 'Yutnori', subtitle: 'Papan tradisional · Anda (Merah) vs Komputer (Biru)',
    tutorialBtn: 'Tutorial & Aturan',
    introBadge: 'Sebelum mulai', introTitle: 'Sekilas tentang Yutnori',
    introWhatTitle: 'Apa itu Yutnori?',
    introWhat: 'Yutnori adalah permainan papan tradisional Korea: lempar empat tongkat kayu, lalu gerakkan empat bidak mengelilingi papan — pihak yang pertama membawa keempat bidaknya kembali ke rumah menang. Keluarga dari segala usia memainkannya bersama dari Tahun Baru Imlek hingga bulan purnama pertama, dan hasil lemparan juga digunakan untuk tradisi meramal peruntungan yang disebut "yutjeom". Nama-nama hasil — Do, Gae, Geol, Yut, dan Mo — konon melambangkan babi, anjing, domba, sapi, dan kuda: makin besar hewannya, makin jauh bidak bergerak.',
    introMathTitle: 'Sedikit matematika di balik Yutnori',
    introMath: 'Hasil lemparan empat tongkat mengikuti distribusi binomial. Menariknya, "Gae" dan "Geol" memiliki lebih banyak kombinasi daripada "Do" sehingga secara teori lebih sering muncul (1 : 4 : 6 : 4 : 1). Rata-rata, satu lemparan menggerakkan bidak sekitar 2,31 kotak.',
    introHowTitle: 'Ringkasan cara bermain',
    introHow: [
      '0 tongkat menghadap datar → Mo (5 kotak, lempar lagi) · 1 → Do (1 kotak) · 2 → Gae (2 kotak) · 3 → Geol (3 kotak) · 4 → Yut (4 kotak, lempar lagi)',
      'Memotong jalan lewat diagonal di sudut membuat bidak sampai rumah jauh lebih cepat.',
      'Tumpuk bidak sepihak di kotak yang sama agar bergerak bersama, dan menangkap bidak lawan memberi lemparan tambahan.',
    ],
    introStart: 'Mulai bermain', closeBtn: 'Tutup',
    turnMe: 'Giliran Anda', turnComputer: 'Giliran komputer',
    finished: (r, b) => `Sampai ${r} : ${b}`,
    throwBtn: 'Lempar tongkat', resetBtn: 'Permainan baru',
    trayMe: 'Bidak Anda (menunggu)', trayComputer: 'Bidak komputer (menunggu)',
    startLog: 'Lempar tongkat untuk mulai.',
    bonusLog: (name) => `${name}! Lempar lagi.`,
    chooseMoveLog: 'Pilih cara bergerak.',
    computerMovingLog: 'Komputer sedang bergerak...',
    captureLogMe: 'Anda menangkap bidak lawan! Lempar lagi.',
    captureLogComputer: 'Komputer menangkap bidak Anda!',
    yourTurnLog: 'Giliran Anda — lempar tongkat.',
    noPieceLog: (label) => `Tidak ada bidak yang bisa memakai ${label}, jadi lemparan ini dilewati.`,
    pendingLabel: 'Lemparan tersisa: ',
    backdoValue: 'Back-do (-1 kotak)',
    stepsValue: (v) => `${v} kotak`,
    winTitleMe: 'Anda menang!', winTitleComputer: 'Komputer menang',
    winSubMe: 'Semua bidak Anda sudah sampai rumah.', winSubComputer: 'Semua bidak komputer sudah sampai rumah. Coba lagi!',
    playAgain: 'Main lagi',
    moveModalTitle: (label) => `${label} — bidak mana yang ingin digerakkan?`,
    moveModalSubMulti: (n) => `Gunakan lemparan ini dulu (masih ada ${n} lagi)`,
    moveModalSubSingle: 'Pilih langkah di bawah',
    enterMain: 'Keluarkan bidak baru', enterSubHome: 'Langsung sampai rumah!',
    enterSub: (k) => `Bidak yang menunggu masuk di kotak ${k}`,
    moveMainMulti: (k, n) => `Gerakkan ${n} bidak yang menumpuk di kotak ${k}`,
    moveMainSingle: (k) => `Gerakkan bidak di kotak ${k}`,
    moveSubHome: 'Kembali ke area tunggu', moveSubFinish: 'Sampai rumah!',
    moveSubTo: (k) => `Bergerak ke kotak ${k}`,
    tagCapture: '🎯 Menangkap!', tagMerge: '🤝 Menumpuk (gabung dengan bidak Anda)', tagFinish: '🏠 Sampai rumah!',
    homeLabel: 'Rumah',
    outcomeNames: LATIN_OUTCOME_NAMES,
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

const DIAG_NEXT = { 20: 21, 21: 22, 23: 24, 24: 15, 25: 26, 26: 22, 27: 28, 28: 0 };
function nextOptions(node) {
  if (node === 5) return [{ tag: 'outer', next: 6 }, { tag: 'diagonal', next: 20 }];
  if (node === 10) return [{ tag: 'outer', next: 11 }, { tag: 'diagonal', next: 25 }];
  if (node === CENTER) return [{ tag: 'toward15', next: 23 }, { tag: 'toward0', next: 27 }];
  if (node in DIAG_NEXT) return [{ tag: 'diagonal', next: DIAG_NEXT[node] }];
  if (node === 19) return [{ tag: 'outer', next: 0 }];
  if (node >= 0 && node <= 18) return [{ tag: 'outer', next: node + 1 }];
  return [];
}

function pickDefaultOption(node, predecessor, options) {
  if (node === CENTER) {
    const tag = predecessor === 26 ? 'toward0' : 'toward15';
    return options.find((opt) => opt.tag === tag) || options[0];
  }
  return options.find((opt) => opt.tag === 'outer') || options[0];
}

function enumeratePaths(startNode, steps) {
  let frontier = [{ node: startNode, path: [], forkChoices: [] }];
  for (let i = 0; i < steps; i++) {
    const next = [];
    frontier.forEach((item) => {
      if (item.node === 0 && item.path.length > 0) { next.push(item); return; }
      const options = nextOptions(item.node);
      const isChoiceMoment = options.length > 1 && i === 0;
      const chosen = isChoiceMoment
        ? options
        : [options.length > 1
          ? pickDefaultOption(item.node, item.path.length >= 2 ? item.path[item.path.length - 2] : startNode, options)
          : options[0]];
      chosen.forEach((opt) => {
        next.push({
          node: opt.next,
          path: [...item.path, opt.next],
          forkChoices: isChoiceMoment ? [...item.forkChoices, opt.tag] : item.forkChoices,
        });
      });
    });
    frontier = next;
  }
  const seen = new Set();
  return frontier
    .map((item) => ({ finished: item.node === 0, node: item.node === 0 ? 'home' : item.node, path: item.path, forkChoices: item.forkChoices }))
    .filter((item) => {
      const key = `${item.finished ? 'F' : item.node}|${item.path.join(',')}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

const FORK_LABELS = {
  ko: { outer: '바깥 테두리', diagonal: '대각선 지름길', toward15: '반대편 모서리 방향', toward0: '출발점 방향 지름길' },
  en: { outer: 'outer rim', diagonal: 'diagonal shortcut', toward15: 'toward the far corner', toward0: 'shortcut to the start corner' },
};
function routeHint(language, forkChoices) {
  if (!forkChoices || forkChoices.length === 0) return '';
  const dict = FORK_LABELS[language] || FORK_LABELS.en;
  return ` (${forkChoices.map((tag) => dict[tag] || tag).join(' · ')})`;
}

const OUTCOMES = [
  { key: 'backdo', value: -1, flats: 1, backdoStick: true, weight: 3, special: true },
  { key: 'do', value: 1, flats: 1, backdoStick: false, weight: 35 },
  { key: 'gae', value: 2, flats: 2, weight: 28 },
  { key: 'geol', value: 3, flats: 3, weight: 20 },
  { key: 'yut', value: 4, flats: 4, weight: 10, bonus: true },
  { key: 'mo', value: 5, flats: 0, weight: 4, bonus: true, special: true },
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
.yutnori-app{--ink:#1b1815;--ink2:#241f1a;--hanji:#f5edd9;--hanji-line:#d8c9a8;--red:#c23b32;--red-dark:#8f2a24;--blue:#2a5c8a;--blue-dark:#1c3f5f;--gold:#c99a3e;--gold-soft:#e8cf95;--wood:#6d431c;font-family:'Noto Sans KR', sans-serif;}
.yutnori-app *{box-sizing:border-box;}
.yutnori-app .title-wrap{text-align:center;margin-bottom:12px;}
.yutnori-app h1{font-family:'Song Myung', serif;font-size:2.2rem;letter-spacing:0.18em;color:var(--red-dark);margin:0 0 2px;text-shadow:0 1px 2px rgba(0,0,0,0.1);}
.yutnori-app .subtitle{font-size:0.82rem;color:var(--wood);letter-spacing:0.08em;font-weight:600;}

/* ========== ONE-VIEW SIDE-BY-SIDE LAYOUT ========== */
.yutnori-app .layout{
  width:100%;
  max-width:1180px;
  margin:0 auto;
  display:grid;
  grid-template-columns:1.08fr 1fr;
  align-items:start;
  gap:24px;
}

@media (max-width: 880px) {
  .yutnori-app .layout{
    grid-template-columns:1fr;
    max-width:540px;
  }
}

/* ========== 1. 전통 윷놀이 말판 (TRADITIONAL YUT MALPAN) ========== */
.yutnori-app .board-card{
  position:relative;
  background:
    radial-gradient(ellipse at center, rgba(255,248,232,0.96) 0%, rgba(240,227,201,0.92) 100%),
    repeating-linear-gradient(45deg, #c79e56 0px, #b2863e 4px, #c79e56 8px, #9e752f 12px);
  border:10px solid #4a2810;
  border-radius:26px;
  padding:18px;
  box-shadow:inset 0 0 32px rgba(45,22,6,0.35), 0 16px 40px rgba(0,0,0,0.4);
}
.yutnori-app .board-card::before{
  content:'';
  position:absolute;
  inset:6px;
  border:2.5px solid #8e5820;
  border-radius:18px;
  pointer-events:none;
}
.yutnori-app .board-card::after{
  content:'';
  position:absolute;
  inset:10px;
  border:1px dashed rgba(100,50,15,0.4);
  border-radius:14px;
  pointer-events:none;
}

.yutnori-app .board-inner{
  position:relative;
  background:linear-gradient(145deg, #faf3e5 0%, #eee1c4 100%);
  border:2px solid #b38647;
  border-radius:12px;
  padding:12px;
  box-shadow:inset 0 0 24px rgba(110,70,25,0.18), 0 4px 14px rgba(0,0,0,0.15);
  z-index:2;
}

.yutnori-app svg{width:100%;height:auto;display:block;}

/* 윷판 말판 길 (Paths) */
.yutnori-app .edge-line{
  stroke:#3b200c;
  stroke-width:4.5;
  stroke-linecap:round;
  stroke-linejoin:round;
  filter:drop-shadow(0 1px 2px rgba(0,0,0,0.25));
}
.yutnori-app .diag-line{
  stroke:#4a2a11;
  stroke-width:3.2;
  stroke-dasharray:4 8;
  stroke-linecap:round;
  opacity:0.75;
}

/* 윷판 말판 밭/점 (Traditional Nodes) */
.yutnori-app .node-ring{
  fill:#fffcf3;
  stroke:#422209;
  stroke-width:2.4;
  filter:drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}
.yutnori-app .node-ring.corner{
  fill:#fce6a8;
  stroke:#7d4512;
  stroke-width:3.2;
}
.yutnori-app .node-ring.center{
  fill:#f5ba38;
  stroke:#8a241c;
  stroke-width:3.8;
}
.yutnori-app .node-inner-dot{
  fill:#522c0d;
  pointer-events:none;
}
.yutnori-app .node-inner-dot.center{
  fill:#b8261c;
}

.yutnori-app .node-text{
  font-family:'Song Myung', serif;
  font-weight:900;
  fill:#7d4512;
  text-anchor:middle;
  dominant-baseline:central;
  pointer-events:none;
}

/* 말 (Game pieces) */
.yutnori-app .piece{filter:drop-shadow(0 5px 8px rgba(0,0,0,0.55));cursor:pointer;transition:transform .15s ease;}
.yutnori-app .piece:hover{transform:scale(1.18);}
.yutnori-app .piece-count{font-family:'Noto Sans KR',sans-serif;font-size:10px;font-weight:900;fill:#fff;pointer-events:none;}

/* ========== 2. 조작 패널 & 윷 던짐판 ========== */
.yutnori-app .panel{
  width:100%;
  background:linear-gradient(160deg, #2a2217 0%, #1a150f 100%);
  border:1.5px solid rgba(201,154,62,0.45);
  border-radius:22px;
  padding:20px 22px;
  box-shadow:0 14px 36px rgba(0,0,0,0.35);
  display:flex;
  flex-direction:column;
  gap:13px;
}
.yutnori-app .turn-row{display:flex;align-items:center;justify-content:space-between;}
.yutnori-app .turn-badge{display:flex;align-items:center;gap:8px;font-weight:700;font-size:1rem;color:#fff8ec;}
.yutnori-app .turn-dot{width:15px;height:15px;border-radius:50%;box-shadow:0 0 12px currentColor;}
.yutnori-app .turn-dot.red{background:var(--red);color:var(--red);}
.yutnori-app .turn-dot.blue{background:var(--blue);color:var(--blue);}
.yutnori-app .score-mini{font-size:0.85rem;color:#d4c49f;font-weight:700;}

/* 윷 던짐 멍석 깔개 (STRAW MAT THROW PAD) */
.yutnori-app .mats-container{
  position:relative;
  margin:2px 0 4px;
  border-radius:18px;
  padding:24px 14px 20px;
  background:
    repeating-linear-gradient(45deg, #caa05b 0px, #b88d44 3px, #caa05b 6px, #9e752f 9px),
    repeating-linear-gradient(-45deg, rgba(0,0,0,0.15) 0px, transparent 3px, rgba(0,0,0,0.22) 6px);
  border:6px solid #5a3411;
  box-shadow:inset 0 0 28px rgba(30,12,3,0.85), 0 10px 24px rgba(0,0,0,0.5);
  perspective:1000px;
}
.yutnori-app .mats-container::before{
  content:'';
  position:absolute;
  inset:0;
  background:radial-gradient(ellipse at center, rgba(255,235,180,0.22) 0%, rgba(0,0,0,0.35) 100%);
  pointer-events:none;
}
.yutnori-app .mats-container::after{
  content:'';
  position:absolute;
  inset:4px;
  border:1.5px dashed rgba(75,45,15,0.6);
  border-radius:12px;
  pointer-events:none;
}

/* ========== 3. 3D REALISTIC WOODEN YUT STICKS ========== */
.yutnori-app .sticks-area{
  display:flex;
  justify-content:center;
  align-items:center;
  gap:18px;
  min-height:124px;
  position:relative;
  perspective:1000px;
  transform-style:preserve-3d;
  z-index:2;
}
.yutnori-app .stick{
  width:26px;
  height:106px;
  border-radius:13px;
  position:relative;
  transform-style:preserve-3d;
  transition:transform 0.4s cubic-bezier(0.2, 1.2, 0.4, 1);
  box-shadow:0 10px 22px rgba(0,0,0,0.55);
  cursor:default;
}

/* 윷 등 (Round curved bark - 둥근 밤나무 껍질 면) */
.yutnori-app .stick .stick-back{
  position:absolute;
  inset:0;
  border-radius:13px;
  background:linear-gradient(90deg, #1c0c04 0%, #44210c 14%, #7d481b 45%, #b07438 50%, #7d481b 55%, #44210c 86%, #160803 100%);
  border:1px solid #331707;
  backface-visibility:hidden;
  overflow:hidden;
}
.yutnori-app .stick .stick-back::before{
  content:'';
  position:absolute;
  inset:0;
  background:repeating-linear-gradient(180deg, rgba(15,7,3,0.5) 0px 2px, transparent 2px 8px);
  opacity:0.75;
}
.yutnori-app .stick .stick-back::after{
  content:'';
  position:absolute;
  top:0; bottom:0; left:38%; width:24%;
  background:linear-gradient(90deg, transparent, rgba(255,230,180,0.3), transparent);
}

/* 윷 배 (Flat belly - 깎아낸 밝은 원목 속살 면) */
.yutnori-app .stick .stick-front{
  position:absolute;
  inset:0;
  border-radius:13px;
  background:linear-gradient(90deg, #caa565 0%, #fef7e9 32%, #ffffff 50%, #fef7e9 68%, #ba924d 100%);
  border:1px solid #8f6a30;
  transform:rotateY(180deg);
  backface-visibility:hidden;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:space-evenly;
  overflow:hidden;
}
.yutnori-app .stick .stick-front::before{
  content:'';
  position:absolute;
  inset:0;
  background:repeating-linear-gradient(180deg, rgba(140,100,40,0.18) 0 2px, transparent 2px 10px);
  pointer-events:none;
}
.yutnori-app .stick .wood-dot{
  width:6.5px;
  height:6.5px;
  border-radius:50%;
  background:radial-gradient(circle, #381f0b 0%, #73451c 70%, transparent 100%);
  opacity:0.95;
  box-shadow:inset 0 1px 2px rgba(0,0,0,0.6);
}
.yutnori-app .stick .backdo-mark{
  font-family:'Song Myung', serif;
  font-size:17px;
  font-weight:900;
  color:#b8261c;
  line-height:1;
  text-shadow:0 0 3px rgba(255,180,180,0.7);
  transform:scale(1.3);
}

/* 윷 토스 물리 애니메이션 */
.yutnori-app .stick.toss-flat-0 { animation: tossFlat0 0.65s cubic-bezier(0.2, 0.8, 0.3, 1) forwards; }
.yutnori-app .stick.toss-flat-1 { animation: tossFlat1 0.70s cubic-bezier(0.2, 0.8, 0.3, 1) forwards; }
.yutnori-app .stick.toss-flat-2 { animation: tossFlat2 0.68s cubic-bezier(0.2, 0.8, 0.3, 1) forwards; }
.yutnori-app .stick.toss-flat-3 { animation: tossFlat3 0.73s cubic-bezier(0.2, 0.8, 0.3, 1) forwards; }

.yutnori-app .stick.toss-round-0 { animation: tossRound0 0.65s cubic-bezier(0.2, 0.8, 0.3, 1) forwards; }
.yutnori-app .stick.toss-round-1 { animation: tossRound1 0.70s cubic-bezier(0.2, 0.8, 0.3, 1) forwards; }
.yutnori-app .stick.toss-round-2 { animation: tossRound2 0.68s cubic-bezier(0.2, 0.8, 0.3, 1) forwards; }
.yutnori-app .stick.toss-round-3 { animation: tossRound3 0.73s cubic-bezier(0.2, 0.8, 0.3, 1) forwards; }

@keyframes tossFlat0 {
  0% { transform: translateY(0) rotateX(0deg) rotateZ(0deg) scale(1); }
  40% { transform: translateY(-90px) rotateX(540deg) rotateZ(-26deg) scale(1.26); }
  75% { transform: translateY(4px) rotateX(900deg) rotateZ(6deg) scale(0.96); }
  90% { transform: translateY(-8px) rotateX(900deg) rotateZ(-3deg) scale(1.02); }
  100% { transform: translateY(0) rotateY(180deg) rotateZ(-6deg) scale(1); }
}
@keyframes tossFlat1 {
  0% { transform: translateY(0) rotateX(0deg) rotateZ(0deg) scale(1); }
  45% { transform: translateY(-100px) rotateX(720deg) rotateZ(28deg) scale(1.30); }
  75% { transform: translateY(5px) rotateX(900deg) rotateZ(-8deg) scale(0.95); }
  90% { transform: translateY(-9px) rotateX(900deg) rotateZ(4deg) scale(1.03); }
  100% { transform: translateY(0) rotateY(180deg) rotateZ(8deg) scale(1); }
}
@keyframes tossFlat2 {
  0% { transform: translateY(0) rotateX(0deg) rotateZ(0deg) scale(1); }
  42% { transform: translateY(-85px) rotateX(540deg) rotateZ(-20deg) scale(1.24); }
  75% { transform: translateY(4px) rotateX(900deg) rotateZ(10deg) scale(0.97); }
  90% { transform: translateY(-7px) rotateX(900deg) rotateZ(-2deg) scale(1.02); }
  100% { transform: translateY(0) rotateY(180deg) rotateZ(-4deg) scale(1); }
}
@keyframes tossFlat3 {
  0% { transform: translateY(0) rotateX(0deg) rotateZ(0deg) scale(1); }
  48% { transform: translateY(-105px) rotateX(720deg) rotateZ(24deg) scale(1.32); }
  75% { transform: translateY(6px) rotateX(900deg) rotateZ(-12deg) scale(0.94); }
  90% { transform: translateY(-10px) rotateX(900deg) rotateZ(6deg) scale(1.04); }
  100% { transform: translateY(0) rotateY(180deg) rotateZ(5deg) scale(1); }
}

@keyframes tossRound0 {
  0% { transform: translateY(0) rotateX(0deg) rotateZ(0deg) scale(1); }
  40% { transform: translateY(-90px) rotateX(720deg) rotateZ(-24deg) scale(1.26); }
  75% { transform: translateY(4px) rotateX(1080deg) rotateZ(8deg) scale(0.96); }
  90% { transform: translateY(-8px) rotateX(1080deg) rotateZ(-4deg) scale(1.02); }
  100% { transform: translateY(0) rotateY(0deg) rotateZ(5deg) scale(1); }
}
@keyframes tossRound1 {
  0% { transform: translateY(0) rotateX(0deg) rotateZ(0deg) scale(1); }
  45% { transform: translateY(-100px) rotateX(900deg) rotateZ(26deg) scale(1.30); }
  75% { transform: translateY(5px) rotateX(1080deg) rotateZ(-10deg) scale(0.95); }
  90% { transform: translateY(-9px) rotateX(1080deg) rotateZ(5deg) scale(1.03); }
  100% { transform: translateY(0) rotateY(0deg) rotateZ(-7deg) scale(1); }
}
@keyframes tossRound2 {
  0% { transform: translateY(0) rotateX(0deg) rotateZ(0deg) scale(1); }
  42% { transform: translateY(-85px) rotateX(720deg) rotateZ(-18deg) scale(1.24); }
  75% { transform: translateY(4px) rotateX(1080deg) rotateZ(12deg) scale(0.97); }
  90% { transform: translateY(-7px) rotateX(1080deg) rotateZ(-3deg) scale(1.02); }
  100% { transform: translateY(0) rotateY(0deg) rotateZ(4deg) scale(1); }
}
@keyframes tossRound3 {
  0% { transform: translateY(0) rotateX(0deg) rotateZ(0deg) scale(1); }
  48% { transform: translateY(-105px) rotateX(900deg) rotateZ(20deg) scale(1.32); }
  75% { transform: translateY(6px) rotateX(1080deg) rotateZ(-14deg) scale(0.94); }
  90% { transform: translateY(-10px) rotateX(1080deg) rotateZ(7deg) scale(1.04); }
  100% { transform: translateY(0) rotateY(0deg) rotateZ(-5deg) scale(1); }
}

.yutnori-app .result-text{text-align:center;font-family:'Song Myung', serif;font-size:1.65rem;color:var(--gold-soft);min-height:2.1rem;margin:2px 0 0;text-shadow:0 2px 4px rgba(0,0,0,0.5);}
.yutnori-app .pending-row{text-align:center;font-size:0.85rem;color:#d4c49f;min-height:1.1rem;font-weight:600;}
.yutnori-app .btn-row{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;}
.yutnori-app button.main-btn{font-family:'Noto Sans KR', sans-serif;font-weight:700;font-size:1rem;padding:11px 28px;border-radius:999px;border:none;cursor:pointer;background:linear-gradient(160deg, var(--red) 0%, var(--red-dark) 100%);color:#fff8ec;box-shadow:0 6px 18px rgba(194,59,50,0.45);transition:transform .12s ease, box-shadow .12s ease;}
.yutnori-app button.main-btn:disabled{background:#4a4238;color:#8a8070;box-shadow:none;cursor:not-allowed;}
.yutnori-app button.main-btn:not(:disabled):hover{transform:translateY(-2px);box-shadow:0 8px 22px rgba(194,59,50,0.55);}
.yutnori-app button.main-btn:not(:disabled):active{transform:translateY(1px);}
.yutnori-app button.reset-btn{font-family:'Noto Sans KR', sans-serif;font-size:0.82rem;font-weight:600;padding:8px 16px;border-radius:999px;border:1px solid rgba(201,154,62,0.45);background:rgba(255,248,236,0.05);color:#c9b98f;cursor:pointer;transition:all .12s ease;}
.yutnori-app button.reset-btn:hover{background:rgba(201,154,62,0.15);border-color:var(--gold);color:#fff;}

/* 알 상태 (PIECE TRAYS) */
.yutnori-app .trays{display:flex;justify-content:space-between;gap:12px;border-top:1px solid rgba(201,154,62,0.25);padding-top:10px;}
.yutnori-app .tray{flex:1;text-align:center;background:rgba(0,0,0,0.25);padding:8px 6px;border-radius:10px;border:1px solid rgba(201,154,62,0.15);}
.yutnori-app .tray-label{font-size:0.75rem;color:#b8a888;margin-bottom:6px;letter-spacing:0.05em;font-weight:700;}
.yutnori-app .tray-tokens{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;}
.yutnori-app .tray-token{width:20px;height:20px;border-radius:50%;border:2px solid #fff8ec;box-shadow:0 2px 4px rgba(0,0,0,0.3);}
.yutnori-app .tray-token.red{background:var(--red);}
.yutnori-app .tray-token.blue{background:var(--blue);}
.yutnori-app .tray-token.home{opacity:0.35;border-style:dashed;}

/* 한눈에 보는 가이드 카드 (SIDE RULES SUMMARY) */
.yutnori-app .side-rules{
  background:rgba(255,248,236,0.04);
  border:1px solid rgba(201,154,62,0.2);
  border-radius:10px;
  padding:10px 12px;
  font-size:0.75rem;
  color:#c9b98f;
  line-height:1.5;
}
.yutnori-app .side-rules summary{
  cursor:pointer;
  font-weight:700;
  color:var(--gold-soft);
  outline:none;
}
.yutnori-app .side-rules ul{
  margin:6px 0 0;
  padding-left:16px;
}
.yutnori-app .side-rules li{
  margin-bottom:2px;
}

.yutnori-app .log-box{font-size:0.78rem;color:#a99a80;text-align:center;min-height:1.1rem;background:rgba(0,0,0,0.2);padding:6px 10px;border-radius:8px;}
.yutnori-app .overlay{position:fixed;inset:0;background:rgba(10,8,6,0.85);display:none;align-items:center;justify-content:center;z-index:50;flex-direction:column;gap:18px;text-align:center;padding:20px;backdrop-filter:blur(3px);}
.yutnori-app .overlay.show{display:flex;}
.yutnori-app .overlay h2{font-family:'Song Myung', serif;font-size:2.4rem;color:var(--gold-soft);margin:0;}
.yutnori-app .overlay p{color:#c9b98f;margin:0;font-size:0.95rem;}
.yutnori-app .move-modal{position:fixed;inset:0;background:rgba(10,8,6,0.75);display:none;align-items:flex-end;justify-content:center;z-index:60;padding:0;backdrop-filter:blur(2px);}
.yutnori-app .move-modal.show{display:flex;}
.yutnori-app .move-modal-inner{width:100%;max-width:540px;background:linear-gradient(160deg, #302619 0%, #1c1813 100%);border:1.5px solid rgba(201,154,62,0.6);border-bottom:none;border-radius:22px 22px 0 0;padding:22px 20px 28px;box-shadow:0 -12px 48px rgba(0,0,0,0.7);animation:yn-slideUp .25s ease-out;max-height:82vh;overflow-y:auto;}
@keyframes yn-slideUp{from{transform:translateY(30px);opacity:0;}to{transform:translateY(0);opacity:1;}}
.yutnori-app .move-modal-title{font-family:'Song Myung', serif;font-size:1.4rem;color:var(--gold-soft);text-align:center;margin-bottom:4px;}
.yutnori-app .move-modal-sub{text-align:center;font-size:0.8rem;color:#a99a80;margin-bottom:18px;}
.yutnori-app .move-option{width:100%;display:flex;flex-direction:column;align-items:flex-start;gap:3px;text-align:left;background:rgba(255,248,236,0.07);border:1.5px solid rgba(201,154,62,0.4);border-radius:14px;padding:12px 16px;margin-bottom:10px;cursor:pointer;color:#f1e8d8;font-family:'Noto Sans KR', sans-serif;transition:background .12s ease, transform .1s ease, border-color .12s ease;}
.yutnori-app .move-option:hover,.yutnori-app .move-option:active{background:rgba(201,154,62,0.2);border-color:var(--gold);transform:translateY(-1px);}
.yutnori-app .move-option .mo-main{font-weight:700;font-size:0.95rem;}
.yutnori-app .move-option .mo-sub{font-size:0.76rem;color:#c9b98f;}
.yutnori-app .move-option .mo-tag{display:inline-block;margin-top:4px;font-size:0.72rem;font-weight:700;padding:2px 8px;border-radius:999px;}
.yutnori-app .mo-tag.capture{background:rgba(194,59,50,0.3);color:#ff9d92;border:1px solid rgba(194,59,50,0.5);}
.yutnori-app .mo-tag.merge{background:rgba(42,92,138,0.35);color:#9cc4e8;border:1px solid rgba(42,92,138,0.5);}
.yutnori-app .mo-tag.finish{background:rgba(201,154,62,0.35);color:#f0d99a;border:1px solid rgba(201,154,62,0.5);}
.yutnori-app .tutorial-overlay{position:fixed;inset:0;background:rgba(10,8,6,0.85);display:flex;align-items:center;justify-content:center;z-index:70;padding:20px;backdrop-filter:blur(3px);}
.yutnori-app .tutorial-card{width:100%;max-width:580px;max-height:88vh;overflow-y:auto;background:linear-gradient(160deg, var(--hanji) 0%, #ebdec5 100%);border-radius:20px;padding:30px 28px;box-shadow:0 0 0 1px rgba(201,154,62,0.5) inset, 0 24px 60px rgba(0,0,0,0.6);color:var(--ink2);}
.yutnori-app .tutorial-badge{margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:.05em;color:var(--red-dark);text-transform:uppercase;}
.yutnori-app .tutorial-card h2{font-family:'Song Myung', serif;font-size:1.6rem;margin:0 0 14px;color:var(--ink2);}
.yutnori-app .tutorial-card h3{font-size:0.98rem;margin:18px 0 6px;color:var(--red-dark);}
.yutnori-app .tutorial-card p{margin:0;font-size:0.92rem;line-height:1.75;color:var(--ink2);}
.yutnori-app .tutorial-card ul{margin:6px 0 0;padding-left:18px;font-size:0.9rem;line-height:1.75;color:var(--ink2);}
.yutnori-app .tutorial-card li{margin-bottom:5px;}
.yutnori-app .tutorial-card button.main-btn{margin-top:22px;width:100%;}
@media (max-width:480px){
  .yutnori-app h1{font-size:1.8rem;}
  .yutnori-app .stick{width:22px;height:90px;}
  .yutnori-app .mats-container{padding:16px 8px;}
  .yutnori-app .tutorial-card{padding:22px 18px;}
}
`;

export default function YutnoriGame() {
  const handleThrowClickRef = useRef(() => {});
  const resetGameRef = useRef(() => {});
  const { language } = useLanguage();
  const words = COPY[language] || COPY.en;
  const wordsRef = useRef(words);
  const languageRef = useRef(language);
  const rootRef = useRef(null);
  const destroyedRef = useRef(false);
  const applyLanguageRef = useRef(() => {});
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [hasStarted, setHasStarted] = useState(true);

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
      
      // 1. Board decorative background grid & lines
      const pts = OUTER_ORDER.map((id) => `${NODES[id].x},${NODES[id].y}`).join(' ');
      svg.appendChild(svgElNS('polyline', { points: pts, class: 'edge-line', fill: 'none' }));
      DIAGONALS.forEach(([a, b]) => {
        svg.appendChild(svgElNS('line', { x1: NODES[a].x, y1: NODES[a].y, x2: NODES[b].x, y2: NODES[b].y, class: 'diag-line' }));
      });

      // 2. Traditional Nodes (말판의 밭 / 참먹 / 방)
      Object.keys(NODES).forEach((id) => {
        id = +id;
        const n = NODES[id];
        const g = svgElNS('g', { class: 'node-group', 'data-node': id });

        if (id === CENTER) {
          // 중앙 방 (Center Room)
          const outerRing = svgElNS('circle', { cx: n.x, cy: n.y, r: 16, class: 'node-ring center' });
          const innerRing = svgElNS('circle', { cx: n.x, cy: n.y, r: 11, fill: 'none', stroke: '#8a241c', 'stroke-width': 1.5 });
          const dot = svgElNS('circle', { cx: n.x, cy: n.y, r: 4.5, class: 'node-inner-dot center' });
          g.appendChild(outerRing);
          g.appendChild(innerRing);
          g.appendChild(dot);
        } else if (CORNERS.includes(id)) {
          // 4대 모서리 (Corners)
          const outerRing = svgElNS('circle', { cx: n.x, cy: n.y, r: 13, class: 'node-ring corner' });
          const innerRing = svgElNS('circle', { cx: n.x, cy: n.y, r: 8.5, fill: 'none', stroke: '#7d4512', 'stroke-width': 1.2 });
          const dot = svgElNS('circle', { cx: n.x, cy: n.y, r: 3.5, class: 'node-inner-dot' });
          g.appendChild(outerRing);
          g.appendChild(innerRing);
          g.appendChild(dot);
        } else {
          // 일반 밭 (Regular Nodes)
          const ring = svgElNS('circle', { cx: n.x, cy: n.y, r: 9, class: 'node-ring' });
          const dot = svgElNS('circle', { cx: n.x, cy: n.y, r: 3, class: 'node-inner-dot' });
          g.appendChild(ring);
          g.appendChild(dot);
        }
        svg.appendChild(g);
      });

      // 3. 출발 및 골(날) 전통 낙관 표식
      const homeBadge = svgElNS('g', { class: 'home-badge' });
      const rect = svgElNS('rect', { x: NODES[0].x - 22, y: NODES[0].y + 16, width: 44, height: 20, rx: 6, fill: '#8f2a24', stroke: '#fff8ec', 'stroke-width': 1.5 });
      homeLabelEl = svgElNS('text', { x: NODES[0].x, y: NODES[0].y + 30, 'text-anchor': 'middle', fill: '#fff8ec', 'font-size': 11, 'font-family': "'Song Myung', serif", 'font-weight': 900 });
      homeLabelEl.textContent = wordsRef.current.homeLabel;
      homeBadge.appendChild(rect);
      homeBadge.appendChild(homeLabelEl);
      svg.appendChild(homeBadge);
    }
    drawStaticBoard();

    function freshPieces() { return [0, 1, 2, 3].map((i) => ({ id: i, node: null, path: [] })); }
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
      const initTilts = [-4, 3, -2, 4];
      for (let i = 0; i < 4; i++) {
        const s = document.createElement('div');
        s.className = 'stick';
        s.id = 'yn-stick' + i;
        s.style.transform = 'rotateY(0deg) rotateZ(' + initTilts[i] + 'deg)';
        
        // 윷 등 (Back - 둥근 밤나무 껍질)
        const back = document.createElement('div');
        back.className = 'stick-back';
        s.appendChild(back);

        // 윷 배 (Front - 깎아낸 원목 속살)
        const front = document.createElement('div');
        front.className = 'stick-front';
        
        if (i === 0) {
          const dot1 = document.createElement('div'); dot1.className = 'wood-dot';
          const mark = document.createElement('div'); mark.className = 'backdo-mark'; mark.textContent = '✕';
          const dot2 = document.createElement('div'); dot2.className = 'wood-dot';
          front.appendChild(dot1);
          front.appendChild(mark);
          front.appendChild(dot2);
        } else {
          for (let d = 0; d < 3; d++) {
            const dot = document.createElement('div'); dot.className = 'wood-dot';
            front.appendChild(dot);
          }
        }
        s.appendChild(front);
        sticksAreaEl.appendChild(s);
      }
    }
    buildSticks();

    function animateThrow(outcome) {
      return new Promise((resolve) => {
        if (!root.querySelector('#yn-stick0')) {
          buildSticks();
        }
        
        playWoodTossSound();

        const flatsCount = outcome.flats;
        let flatSet;
        if (outcome.key === 'backdo') {
          flatSet = new Set([0]);
        } else if (flatsCount === 1) {
          const nonBackdoIdxs = [1, 2, 3].sort(() => Math.random() - 0.5);
          flatSet = new Set([nonBackdoIdxs[0]]);
        } else {
          const idxs = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
          flatSet = new Set(idxs.slice(0, flatsCount));
        }

        for (let i = 0; i < 4; i++) {
          const el = root.querySelector('#yn-stick' + i);
          if (el) {
            el.style.transform = '';
            const isFlat = flatSet.has(i);
            el.className = 'stick ' + (isFlat ? 'toss-flat-' + i : 'toss-round-' + i);
          }
        }

        setTimeout(() => {
          playMatLandSound(outcome.bonus);

          for (let i = 0; i < 4; i++) {
            const el = root.querySelector('#yn-stick' + i);
            if (el) {
              const isFlat = flatSet.has(i);
              const rotZ = (Math.random() * 26 - 13).toFixed(1);
              const transX = (Math.random() * 10 - 5).toFixed(1);
              const transY = (Math.random() * 6 - 3).toFixed(1);

              el.className = 'stick';
              el.style.transform = (isFlat ? 'rotateY(180deg)' : 'rotateY(0deg)') + 
                ' rotateZ(' + rotZ + 'deg) translate(' + transX + 'px, ' + transY + 'px)';
            }
          }
          resolve();
        }, 680);
      });
    }

    function oppColor(color) { return color === 'red' ? 'blue' : 'red'; }
    function piecesAtNode(color, node) { return state.pieces[color].filter((p) => p.node === node); }
    function onBoardPieces(color) { return state.pieces[color].filter((p) => p.node !== null && p.node !== 'home'); }
    function homeCount(color) { return state.pieces[color].filter((p) => p.node === 'home').length; }
    function offCount(color) { return state.pieces[color].filter((p) => p.node === null).length; }

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

    function resolveCapture(color, node) {
      if (node === null || node === 'home') return false;
      const oppC = oppColor(color);
      const hits = piecesAtNode(oppC, node);
      if (hits.length === 0) return false;
      hits.forEach((h) => { h.node = null; h.path = []; });
      playCaptureSound();
      return true;
    }

    function commitMove(color, fromNode, result) {
      const group = piecesAtNode(color, fromNode);
      const landedNode = result.finished ? 'home' : result.node;
      group.forEach((p) => {
        p.path = [...p.path, ...result.path];
        p.node = landedNode;
      });
      const captured = resolveCapture(color, landedNode);
      if (landedNode === 'home') playFinishSound();
      render();
      return { node: landedNode, captured, count: group.length, finished: landedNode === 'home' };
    }

    function commitEnter(color, result) {
      const p = state.pieces[color].find((pp) => pp.node === null);
      if (!p) return null;
      const landedNode = result.finished ? 'home' : result.node;
      p.path = [...result.path];
      p.node = landedNode;
      const captured = resolveCapture(color, landedNode);
      if (landedNode === 'home') playFinishSound();
      render();
      return { node: landedNode, captured, finished: landedNode === 'home' };
    }

    function commitBackdo(color, fromNode) {
      const group = piecesAtNode(color, fromNode);
      let landedNode = null;
      group.forEach((p) => {
        const newPath = p.path.slice(0, -1);
        p.path = newPath;
        p.node = newPath.length > 0 ? newPath[newPath.length - 1] : null;
        landedNode = p.node;
      });
      const captured = resolveCapture(color, landedNode);
      render();
      return { node: landedNode, captured, count: group.length };
    }

    function render() {
      if (!svg.querySelector('.edge-line')) {
        drawStaticBoard();
      }
      if (!root.querySelector('#yn-stick0')) {
        buildSticks();
      }
      svg.querySelectorAll('.piece-group').forEach((e) => e.remove());

      ['red', 'blue'].forEach((color) => {
        const byNode = {};
        state.pieces[color].forEach((p) => {
          if (p.node !== null && p.node !== 'home') {
            byNode[p.node] = byNode[p.node] || [];
            byNode[p.node].push(p);
          }
        });
        Object.keys(byNode).forEach((nodeId) => {
          nodeId = +nodeId;
          const node = NODES[nodeId];
          const group = byNode[nodeId];
          const g = svgElNS('g', { class: 'piece-group' });
          const ox = color === 'red' ? -6 : 6;
          const cx = node.x + ox;
          const cy = node.y - 4;
          const circ = svgElNS('circle', {
            cx, cy, r: 11.5,
            fill: color === 'red' ? '#c23b32' : '#2a5c8a',
            stroke: '#fff8ec',
            'stroke-width': 2.2,
            class: 'piece',
          });
          g.appendChild(circ);
          if (group.length > 1) {
            const txt = svgElNS('text', {
              x: cx, y: cy + 3.5,
              'text-anchor': 'middle',
              class: 'piece-count',
            });
            txt.textContent = group.length;
            g.appendChild(txt);
          }
          svg.appendChild(g);
        });
      });

      turnTextEl.textContent = state.turn === 'red' ? wordsRef.current.turnMe : wordsRef.current.turnComputer;
      turnBadgeEl.querySelector('.turn-dot').className = 'turn-dot ' + state.turn;

      scoreMiniEl.textContent = wordsRef.current.finished(homeCount('red'), homeCount('blue'));

      throwBtnEl.disabled = state.busy || state.gameOver || state.turn !== 'red' || state.pending.length > 0;

      redTrayEl.innerHTML = '';
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

      blueTrayEl.innerHTML = '';
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

      if (state.pending.length > 0) {
        pendingRowEl.textContent = wordsRef.current.pendingLabel + state.pending.map((v) => (v < 0 ? wordsRef.current.outcomeNames.backdo : v)).join(', ');
      } else {
        pendingRowEl.textContent = '\u00A0';
      }
    }

    async function doThrow(color) {
      if (destroyedRef.current) return undefined;
      ensureAudioCtx();
      state.busy = true;
      render();

      const outcome = weightedPick();
      resultTextEl.textContent = '\u00A0';

      await animateThrow(outcome);
      if (destroyedRef.current) return undefined;

      const T = wordsRef.current;
      const name = T.outcomeNames[outcome.key];
      resultTextEl.textContent = `${name} (${outcome.value})`;

      state.pending.push(outcome.value);
      render();

      if (outcome.bonus) {
        log(T.bonusLog(name));
        await sleep(color === 'red' ? 500 : 600);
        if (destroyedRef.current) return undefined;
        return doThrow(color);
      }

      state.busy = false;
      render();

      log(color === 'red' ? T.chooseMoveLog : T.computerMovingLog);

      if (color === 'blue') {
        await sleep(700);
        if (destroyedRef.current) return undefined;
        await computerResolveMoves();
      } else {
        await sleep(300);
        if (destroyedRef.current) return undefined;
        showMoveModal();
      }
      return undefined;
    }

    function handleThrowClick() {
      if (throwBtnEl && throwBtnEl.disabled) return;
      doThrow('red');
    }
    handleThrowClickRef.current = handleThrowClick;
    throwBtnEl.addEventListener('click', handleThrowClick);

    function stepsAt(color, node) {
      const p = state.pieces[color].find((pp) => pp.node === node);
      return p ? p.path.length : 0;
    }

    function getMoveOptions(color, value) {
      const T = wordsRef.current;
      const lang = languageRef.current;
      const oppC = oppColor(color);
      const options = [];
      if (offCount(color) > 0 && value > 0) {
        enumeratePaths(0, value).forEach((result) => {
          const landedNode = result.finished ? 'home' : result.node;
          const mergeCount = result.finished ? 0 : piecesAtNode(color, landedNode).length;
          const captureCount = result.finished ? 0 : piecesAtNode(oppC, landedNode).length;
          options.push({
            type: 'enter',
            main: T.enterMain,
            sub: (result.finished ? T.enterSubHome : T.enterSub(result.path.length)) + routeHint(lang, result.forkChoices),
            tag: captureCount > 0 ? 'capture' : (mergeCount > 0 ? 'merge' : (result.finished ? 'finish' : null)),
            commit: () => commitEnter(color, result),
          });
        });
      }
      const seenNodes = new Set();
      onBoardPieces(color).forEach((p) => {
        if (seenNodes.has(p.node)) return;
        seenNodes.add(p.node);
        const fromNode = p.node;
        const groupSize = piecesAtNode(color, fromNode).length;
        const fromSteps = stepsAt(color, fromNode);

        if (value < 0) {
          const newPath = p.path.slice(0, -1);
          const newNode = newPath.length > 0 ? newPath[newPath.length - 1] : null;
          const mergeCount = newNode !== null ? piecesAtNode(color, newNode).length : 0;
          const captureCount = newNode !== null ? piecesAtNode(oppC, newNode).length : 0;
          const main = groupSize > 1 ? T.moveMainMulti(fromSteps, groupSize) : T.moveMainSingle(fromSteps);
          const sub = newNode === null ? T.moveSubHome : T.moveSubTo(newPath.length);
          let tag = null;
          if (captureCount > 0) tag = 'capture';
          else if (mergeCount > 0) tag = 'merge';
          options.push({ type: 'move', main, sub, tag, commit: () => commitBackdo(color, fromNode) });
          return;
        }

        enumeratePaths(fromNode, value).forEach((result) => {
          const landedNode = result.finished ? 'home' : result.node;
          const newSteps = fromSteps + result.path.length;
          const mergeCount = result.finished ? 0 : piecesAtNode(color, landedNode).length;
          const captureCount = result.finished ? 0 : piecesAtNode(oppC, landedNode).length;
          const main = groupSize > 1 ? T.moveMainMulti(fromSteps, groupSize) : T.moveMainSingle(fromSteps);
          const sub = (result.finished ? T.moveSubFinish : T.moveSubTo(newSteps)) + routeHint(lang, result.forkChoices);
          let tag = null;
          if (captureCount > 0) tag = 'capture';
          else if (mergeCount > 0) tag = 'merge';
          else if (result.finished) tag = 'finish';
          options.push({ type: 'move', main, sub, tag, commit: () => commitMove(color, fromNode, result) });
        });
      });
      return options;
    }

    function valueLabel(v) {
      const T = wordsRef.current;
      return v < 0 ? T.backdoValue : T.stepsValue(v);
    }

    function finishOneMove(rendered) {
      if (checkWin('red')) return;
      if (state.pending.length === 0) {
        state.turn = 'blue';
        render();
        resultTextEl.textContent = '\u00A0';
        setTimeout(() => {
          if (!destroyedRef.current) doThrow('blue');
        }, 700);
      } else {
        setTimeout(() => {
          if (!destroyedRef.current) showMoveModal();
        }, 250);
      }
    }

    function showMoveModal() {
      if (state.pending.length === 0 || state.turn !== 'red' || state.gameOver) return;
      const T = wordsRef.current;
      const value = state.pending[0];
      const options = getMoveOptions('red', value);

      if (options.length === 0) {
        state.pending.shift();
        render();
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
        const main = document.createElement('span');
        main.className = 'mo-main';
        main.textContent = opt.main;
        const sub = document.createElement('span');
        sub.className = 'mo-sub';
        sub.textContent = opt.sub;
        btn.appendChild(main);
        btn.appendChild(sub);
        if (opt.tag) {
          const tag = document.createElement('span');
          tag.className = 'mo-tag ' + opt.tag;
          tag.textContent = TAG_LABEL[opt.tag];
          btn.appendChild(tag);
        }
        btn.addEventListener('click', async () => {
          moveModalEl.classList.remove('show');
          state.pending.shift();
          render();
          const res = opt.commit();
          await sleep(200);
          if (destroyedRef.current) return;
          if (checkWin('red')) return;
          if (res && res.captured) {
            log(wordsRef.current.captureLogMe);
            state.pending = [];
            render();
            return;
          }
          finishOneMove(true);
        });
        moveModalOptionsEl.appendChild(btn);
      });
      moveModalEl.classList.add('show');
    }

    function chooseComputerMove(value) {
      const color = 'blue', oppC = 'red';
      const candidates = [];
      if (offCount(color) > 0 && value > 0) {
        enumeratePaths(0, value).forEach((result) => {
          const landedNode = result.finished ? 'home' : result.node;
          let score = result.path.length;
          if (!result.finished && piecesAtNode(oppC, landedNode).length > 0) score += 100;
          if (result.finished) score += 20;
          candidates.push({ score, commit: () => commitEnter(color, result) });
        });
      }
      const seenNodes = new Set();
      onBoardPieces(color).forEach((p) => {
        if (seenNodes.has(p.node)) return;
        seenNodes.add(p.node);
        const fromNode = p.node;
        if (value < 0) {
          const newPath = p.path.slice(0, -1);
          const newNode = newPath.length > 0 ? newPath[newPath.length - 1] : null;
          let score = newPath.length * 2;
          if (newNode !== null && piecesAtNode(oppC, newNode).length > 0) score += 100;
          if (newNode === null) score -= 10;
          candidates.push({ score, commit: () => commitBackdo(color, fromNode) });
          return;
        }
        enumeratePaths(fromNode, value).forEach((result) => {
          const landedNode = result.finished ? 'home' : result.node;
          const newSteps = p.path.length + result.path.length;
          let score = newSteps * 2;
          if (!result.finished && piecesAtNode(oppC, landedNode).length > 0) score += 100;
          if (result.finished) score += 30;
          candidates.push({ score, commit: () => commitMove(color, fromNode, result) });
        });
      });
      if (candidates.length === 0) return null;
      candidates.sort((a, b) => b.score - a.score);
      return candidates[0];
    }

    async function computerResolveMoves() {
      while (state.pending.length > 0) {
        const value = state.pending.shift();
        render();
        const best = chooseComputerMove(value);
        if (!best) continue;
        const res = best.commit();
        await sleep(500);
        if (destroyedRef.current) return;
        if (checkWin('blue')) return;
        if (res && res.captured) {
          log(wordsRef.current.captureLogComputer);
          state.pending = [];
          render();
          await sleep(400);
          if (destroyedRef.current) return;
          await doThrow('blue');
          return;
        }
        await sleep(300);
        if (destroyedRef.current) return;
      }
      log(wordsRef.current.yourTurnLog);
      state.turn = 'red';
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
      overlayEl.classList.remove('show');
      moveModalEl.classList.remove('show');
      resultTextEl.textContent = '\u00A0';
      pendingRowEl.textContent = '\u00A0';
      log(wordsRef.current.startLog);
      buildSticks();
      render();
    }
    resetGameRef.current = resetGame;
    resetBtnEl.addEventListener('click', resetGame);
    overlayResetEl.addEventListener('click', resetGame);

    applyLanguageRef.current = () => {
      const T = wordsRef.current;
      if (homeLabelEl) homeLabelEl.textContent = T.homeLabel;
      render();
      if (!state.busy && state.pending.length === 0) {
        log(state.turn === 'red' ? T.yourTurnLog : T.computerMovingLog);
      }
    };

    log(wordsRef.current.startLog);
    render();

    return () => {
      destroyedRef.current = true;
      throwBtnEl.removeEventListener('click', handleThrowClick);
      resetBtnEl.removeEventListener('click', resetGame);
      overlayResetEl.removeEventListener('click', resetGame);
    };
  }, []);

  useEffect(() => {
    wordsRef.current = words;
    languageRef.current = language;
    applyLanguageRef.current();
  }, [words, language]);

  return (
    <div className="yutnori-app" ref={rootRef}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Song+Myung&family=Noto+Sans+KR:wght@400;500;700;900&display=swap" rel="stylesheet" />

      <p className="no-print" style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 12 }}>
        <a href="/">{words.home}</a> / <a href="/games.html">{words.hub}</a> / {words.crumbCurrent}
      </p>

      <div className="title-wrap">
        <h1>{words.title}</h1>
        <div className="subtitle">{words.subtitle}</div>
      </div>

      <div className="layout">
        {/* LEFT: 전통 윷놀이 말판 (TRADITIONAL BOARD) */}
        <div className="board-card">
          <div className="board-inner">
            <svg id="yn-board" viewBox="0 0 600 600" />
          </div>
        </div>

        {/* RIGHT: 한눈에 보는 조작 패널 & 3D 윷가락 & 알 상태 (SIDE PANEL) */}
        <div className="panel">
          <div className="turn-row">
            <div className="turn-badge" id="yn-turnBadge">
              <span className="turn-dot red" />
              <span id="yn-turnText" />
            </div>
            <div className="score-mini" id="yn-scoreMini" />
          </div>

          {/* 윷 던짐판 (THROUGH MAT) & 3D 윷가락 */}
          <div className="mats-container">
            <div className="sticks-area" id="yn-sticksArea" />
          </div>

          <div className="result-text" id="yn-resultText">{' '}</div>
          <div className="pending-row" id="yn-pendingRow">{' '}</div>

          <div className="btn-row">
            <button type="button" className="main-btn" id="yn-throwBtn" onClick={() => handleThrowClickRef.current()}>{words.throwBtn}</button>
            <button type="button" className="reset-btn" id="yn-resetBtn" onClick={() => resetGameRef.current()}>{words.resetBtn}</button>
            <button type="button" className="reset-btn" onClick={() => setTutorialOpen(true)}>{words.tutorialBtn}</button>
          </div>

          {/* 알 상태 (PIECE TRAYS) */}
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

          {/* 한눈에 보는 윷놀이 규칙 요약 (SIDE RULES) */}
          <details className="side-rules" open>
            <summary>📜 {words.introHowTitle}</summary>
            <ul>
              {words.introHow.map((line, i) => <li key={i}>{line}</li>)}
            </ul>
          </details>

          <div className="log-box" id="yn-logBox">{' '}</div>
        </div>
      </div>

      <div className="overlay" id="yn-overlay">
        <h2 id="yn-overlayTitle" />
        <p id="yn-overlaySub" />
        <button type="button" className="main-btn" id="yn-overlayReset" onClick={() => resetGameRef.current()}>{words.playAgain}</button>
      </div>

      <div className="move-modal" id="yn-moveModal">
        <div className="move-modal-inner">
          <div className="move-modal-title" id="yn-moveModalTitle" />
          <div className="move-modal-sub" id="yn-moveModalSub" />
          <div id="yn-moveModalOptions" />
        </div>
      </div>

      {tutorialOpen ? (
        <div className="tutorial-overlay" role="dialog" aria-modal="true" aria-label={words.introTitle} onClick={(e) => { if (e.target === e.currentTarget) { setHasStarted(true); setTutorialOpen(false); } }}>
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
