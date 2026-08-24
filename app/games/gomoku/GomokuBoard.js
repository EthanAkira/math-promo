'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const BOARD_SIZE = 15;
const CELL = 34;
const MARGIN = 30;
const CANVAS_SIZE = MARGIN * 2 + CELL * (BOARD_SIZE - 1);

const EMPTY = 0;
const BLACK = 1;
const WHITE = 2;

const DIFFICULTIES = [
  { level: 1, label: '초급', radius: 1, limit: 8, randomness: 0.55 },
  { level: 2, label: '쉬움', radius: 1, limit: 10, randomness: 0.25 },
  { level: 3, label: '보통', radius: 2, limit: 14, randomness: 0.1 },
  { level: 4, label: '어려움', radius: 2, limit: 18, randomness: 0.03 },
  { level: 5, label: '매우 어려움', radius: 2, limit: 22, randomness: 0 },
];

function createBoard() {
  return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(EMPTY));
}

function inBounds(r, c) {
  return r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE;
}

function checkWin(board, row, col, stone) {
  const dirs = [[1, 0], [0, 1], [1, 1], [1, -1]];
  for (const [dr, dc] of dirs) {
    let count = 1;
    let r = row + dr; let c = col + dc;
    while (inBounds(r, c) && board[r][c] === stone) { count += 1; r += dr; c += dc; }
    r = row - dr; c = col - dc;
    while (inBounds(r, c) && board[r][c] === stone) { count += 1; r -= dr; c -= dc; }
    if (count >= 5) return true;
  }
  return false;
}

function patternValue(count, openEnds) {
  if (count >= 5) return 1000000;
  if (count === 4 && openEnds === 2) return 100000;
  if (count === 4 && openEnds === 1) return 20000;
  if (count === 3 && openEnds === 2) return 8000;
  if (count === 3 && openEnds === 1) return 1500;
  if (count === 2 && openEnds === 2) return 500;
  if (count === 2 && openEnds === 1) return 80;
  if (count === 1 && openEnds === 2) return 15;
  return 1;
}

function scoreDirection(board, row, col, stone, dr, dc) {
  let count = 1; let openEnds = 0;
  let r = row + dr; let c = col + dc;
  while (inBounds(r, c) && board[r][c] === stone) { count += 1; r += dr; c += dc; }
  if (inBounds(r, c) && board[r][c] === EMPTY) openEnds += 1;
  r = row - dr; c = col - dc;
  while (inBounds(r, c) && board[r][c] === stone) { count += 1; r -= dr; c -= dc; }
  if (inBounds(r, c) && board[r][c] === EMPTY) openEnds += 1;
  return patternValue(count, openEnds);
}

function scorePosition(board, row, col, stone) {
  const dirs = [[1, 0], [0, 1], [1, 1], [1, -1]];
  return dirs.reduce((sum, [dr, dc]) => sum + scoreDirection(board, row, col, stone, dr, dc), 0);
}

function generateCandidates(board, radius) {
  const set = new Set();
  for (let r = 0; r < BOARD_SIZE; r += 1) {
    for (let c = 0; c < BOARD_SIZE; c += 1) {
      if (board[r][c] === EMPTY) continue;
      for (let dr = -radius; dr <= radius; dr += 1) {
        for (let dc = -radius; dc <= radius; dc += 1) {
          const nr = r + dr; const nc = c + dc;
          if (inBounds(nr, nc) && board[nr][nc] === EMPTY) set.add(nr * BOARD_SIZE + nc);
        }
      }
    }
  }
  const center = Math.floor(BOARD_SIZE / 2);
  return [...set].map((v) => [Math.floor(v / BOARD_SIZE), v % BOARD_SIZE]).sort((a, b) => (Math.abs(a[0] - center) + Math.abs(a[1] - center)) - (Math.abs(b[0] - center) + Math.abs(b[1] - center)));
}

function isBoardEmpty(board) {
  return board.every((row) => row.every((v) => v === EMPTY));
}

function chooseAiMove(board, aiStone, humanStone, difficulty) {
  if (isBoardEmpty(board)) return [Math.floor(BOARD_SIZE / 2), Math.floor(BOARD_SIZE / 2)];

  for (const [r, c] of generateCandidates(board, 2)) {
    board[r][c] = aiStone;
    const win = checkWin(board, r, c, aiStone);
    board[r][c] = EMPTY;
    if (win) return [r, c];
  }
  for (const [r, c] of generateCandidates(board, 2)) {
    board[r][c] = humanStone;
    const win = checkWin(board, r, c, humanStone);
    board[r][c] = EMPTY;
    if (win) return [r, c];
  }

  const config = DIFFICULTIES.find((item) => item.level === difficulty) || DIFFICULTIES[2];
  const candidates = generateCandidates(board, config.radius);
  const center = Math.floor(BOARD_SIZE / 2);
  const scored = candidates.map(([r, c]) => {
    const centerBonus = 20 - (Math.abs(r - center) + Math.abs(c - center));
    const attack = scorePosition(board, r, c, aiStone);
    const defense = scorePosition(board, r, c, humanStone);
    return { score: attack * 1.08 + defense * 1.0 + centerBonus, move: [r, c] };
  });
  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, config.limit);
  if (!top.length) return null;
  if (config.randomness > 0 && Math.random() < config.randomness) {
    const n = Math.min(4, top.length);
    return top[Math.floor(Math.random() * n)].move;
  }
  return top[0].move;
}

const STAR_POINTS = [[3, 3], [3, 11], [7, 7], [11, 3], [11, 11]];

function boardToScreen(row, col) {
  return [MARGIN + col * CELL, MARGIN + row * CELL];
}

export default function GomokuBoard() {
  const canvasRef = useRef(null);
  const [board, setBoard] = useState(createBoard);
  const [humanStone, setHumanStone] = useState(BLACK);
  const [currentTurn, setCurrentTurn] = useState(BLACK);
  const [difficulty, setDifficulty] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [history, setHistory] = useState([]);
  const [lastMove, setLastMove] = useState(null);
  const [hover, setHover] = useState(null);
  const [aiThinking, setAiThinking] = useState(false);
  const [message, setMessage] = useState('당신은 흑입니다. 먼저 두세요.');

  const aiStone = humanStone === BLACK ? WHITE : BLACK;

  const resetGame = useCallback((nextHumanStone = humanStone) => {
    setBoard(createBoard());
    setCurrentTurn(BLACK);
    setGameOver(false);
    setHistory([]);
    setLastMove(null);
    setHover(null);
    setAiThinking(false);
    if (nextHumanStone === BLACK) setMessage('당신은 흑입니다. 먼저 두세요.');
    else setMessage('당신은 백입니다. AI가 먼저 둡니다.');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function placeStone(row, col, stone) {
    if (board[row][col] !== EMPTY) return;
    const nextBoard = board.map((r) => [...r]);
    nextBoard[row][col] = stone;

    setBoard(nextBoard);
    setHistory((prevHistory) => [...prevHistory, { row, col, stone }]);
    setLastMove([row, col]);

    if (checkWin(nextBoard, row, col, stone)) {
      setGameOver(true);
      setMessage(stone === humanStone ? '게임 종료: 당신이 이겼습니다!' : '게임 종료: AI가 이겼습니다.');
    } else if (nextBoard.every((r) => r.every((v) => v !== EMPTY))) {
      setGameOver(true);
      setMessage('게임 종료: 무승부입니다.');
    } else {
      const nextTurn = stone === BLACK ? WHITE : BLACK;
      setCurrentTurn(nextTurn);
      setMessage(nextTurn === humanStone ? '당신의 차례입니다.' : 'AI 차례입니다.');
    }
  }

  function handleBoardClick(row, col) {
    if (gameOver || aiThinking || currentTurn !== humanStone || board[row][col] !== EMPTY) return;
    placeStone(row, col, humanStone);
  }

  useEffect(() => {
    if (gameOver || currentTurn !== aiStone) return undefined;
    setAiThinking(true);
    setMessage('AI가 수를 계산하고 있습니다...');
    const timer = setTimeout(() => {
      const boardCopy = board.map((r) => [...r]);
      const move = chooseAiMove(boardCopy, aiStone, humanStone, difficulty);
      setAiThinking(false);
      if (move) placeStone(move[0], move[1], aiStone);
    }, 260);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTurn, gameOver]);

  function undoTurn() {
    if (aiThinking || !history.length) return;
    const steps = history.length >= 2 ? 2 : 1;
    const nextHistory = history.slice(0, -steps);
    const nextBoard = createBoard();
    nextHistory.forEach(({ row, col, stone }) => { nextBoard[row][col] = stone; });
    setBoard(nextBoard);
    setHistory(nextHistory);
    setLastMove(nextHistory.length ? [nextHistory[nextHistory.length - 1].row, nextHistory[nextHistory.length - 1].col] : null);
    setGameOver(false);
    setCurrentTurn(humanStone);
    setMessage(nextHistory.length || humanStone === BLACK ? '이전 수를 되돌렸습니다.' : 'AI가 먼저 둡니다.');
  }

  function chooseHumanStone(stone) {
    if (aiThinking) return;
    setHumanStone(stone);
    resetGame(stone);
  }

  useEffect(() => {
    function handleKey(event) {
      if (event.key.toLowerCase() === 'r') undoTurn();
      else if (event.key.toLowerCase() === 'n') resetGame(humanStone);
      else if (event.key >= '1' && event.key <= '5') setDifficulty(Number(event.key));
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, aiThinking, humanStone]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_SIZE * dpr;
    canvas.height = CANVAS_SIZE * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.fillStyle = '#deb878';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    ctx.strokeStyle = '#37231e';
    ctx.lineWidth = 1.4;
    for (let i = 0; i < BOARD_SIZE; i += 1) {
      const pos = MARGIN + i * CELL;
      ctx.beginPath(); ctx.moveTo(MARGIN, pos); ctx.lineTo(CANVAS_SIZE - MARGIN, pos); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(pos, MARGIN); ctx.lineTo(pos, CANVAS_SIZE - MARGIN); ctx.stroke();
    }

    ctx.fillStyle = '#37231e';
    STAR_POINTS.forEach(([r, c]) => {
      const [x, y] = boardToScreen(r, c);
      ctx.beginPath(); ctx.arc(x, y, 3.4, 0, Math.PI * 2); ctx.fill();
    });

    if (hover && !gameOver && !aiThinking && currentTurn === humanStone && board[hover[0]][hover[1]] === EMPTY) {
      const [x, y] = boardToScreen(hover[0], hover[1]);
      ctx.strokeStyle = '#1c68b4';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(x, y, CELL / 2 - 4, 0, Math.PI * 2); ctx.stroke();
    }

    for (let r = 0; r < BOARD_SIZE; r += 1) {
      for (let c = 0; c < BOARD_SIZE; c += 1) {
        const stone = board[r][c];
        if (stone === EMPTY) continue;
        const [x, y] = boardToScreen(r, c);
        const radius = CELL / 2 - 3;
        if (stone === BLACK) {
          const gradient = ctx.createRadialGradient(x - 5, y - 5, 1, x, y, radius);
          gradient.addColorStop(0, '#5a5a5a');
          gradient.addColorStop(1, '#141414');
          ctx.fillStyle = gradient;
        } else {
          const gradient = ctx.createRadialGradient(x - 5, y - 5, 1, x, y, radius);
          gradient.addColorStop(0, '#ffffff');
          gradient.addColorStop(1, '#d8d8d8');
          ctx.fillStyle = gradient;
          ctx.strokeStyle = '#8b8b8b';
        }
        ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
        if (stone === WHITE) ctx.stroke();
      }
    }

    if (lastMove) {
      const [x, y] = boardToScreen(lastMove[0], lastMove[1]);
      ctx.fillStyle = '#c8283f';
      ctx.beginPath(); ctx.arc(x, y, 4.5, 0, Math.PI * 2); ctx.fill();
    }
  }, [board, hover, lastMove, gameOver, aiThinking, currentTurn, humanStone]);

  function positionFromEvent(event) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scale = CANVAS_SIZE / rect.width;
    const x = (event.clientX - rect.left) * scale;
    const y = (event.clientY - rect.top) * scale;
    const col = Math.round((x - MARGIN) / CELL);
    const row = Math.round((y - MARGIN) / CELL);
    if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) return null;
    return [row, col];
  }

  return <div className="game-shell">
    <div className="game-board-wrap">
      <canvas
        ref={canvasRef}
        className="gomoku-canvas"
        style={{ width: CANVAS_SIZE, maxWidth: '90vw' }}
        onMouseMove={(event) => setHover(positionFromEvent(event))}
        onMouseLeave={() => setHover(null)}
        onClick={(event) => { const pos = positionFromEvent(event); if (pos) handleBoardClick(pos[0], pos[1]); }}
      />
    </div>

    <aside className="game-panel">
      <h1>오목</h1>
      <p className="game-sub">15 × 15 오목판 · 사람 대 AI</p>
      <p className="game-message">{message}</p>

      <p className="game-section-label">돌 색</p>
      <div className="game-btn-grid cols-2">
        <button type="button" className={`game-btn${humanStone === BLACK ? ' active' : ''}`} onClick={() => chooseHumanStone(BLACK)}>흑으로 시작</button>
        <button type="button" className={`game-btn${humanStone === WHITE ? ' active' : ''}`} onClick={() => chooseHumanStone(WHITE)}>백으로 시작</button>
      </div>

      <p className="game-section-label">AI 난이도</p>
      <div className="game-btn-grid cols-2">
        {DIFFICULTIES.map((item) => <button type="button" key={item.level} className={`game-btn${difficulty === item.level ? ' active' : ''}`} onClick={() => setDifficulty(item.level)}>{item.level}. {item.label}</button>)}
      </div>

      <div className="game-btn-grid cols-2">
        <button type="button" className="game-btn" onClick={undoTurn}>무르기 [R]</button>
        <button type="button" className="game-btn primary" onClick={() => resetGame(humanStone)}>새 게임 [N]</button>
      </div>

      <div className="game-stat-row"><span>현재 차례</span><span>{currentTurn === BLACK ? '흑' : '백'}</span></div>
      <div className="game-stat-row"><span>진행된 수</span><span>{history.length}</span></div>

      <div className="game-help">
        교차점을 클릭해 돌을 놓습니다.<br />R: 무르기 · N: 새 게임 · 1~5: 난이도
      </div>
    </aside>
  </div>;
}
