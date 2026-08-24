'use client';

import { useEffect, useState } from 'react';
import { initialState, generateLegalMoves, applyMove, gameStatus, chooseAiMove, findKing, CHESS_DIFFICULTIES } from './chessEngine';

const FILES = 'abcdefgh';

const GLYPHS = {
  w: { K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙' },
  b: { K: '♚', Q: '♛', R: '♜', B: '♝', N: '♞', P: '♟' },
};

const PROMOTION_LABELS = { Q: '퀸', R: '룩', B: '비숍', N: '나이트' };

function squareName(r, c) {
  return `${FILES[c]}${8 - r}`;
}

function statusMessage(status, turn, humanColor) {
  const turnName = turn === 'w' ? '백' : '흑';
  if (status === 'checkmate') return turn === humanColor ? '체크메이트! AI가 이겼습니다.' : '체크메이트! 당신이 이겼습니다!';
  if (status === 'stalemate') return '스테일메이트! 무승부입니다.';
  if (status === 'check') return `${turnName} 차례입니다. 체크!`;
  return turn === humanColor ? '당신의 차례입니다.' : 'AI 차례입니다.';
}

export default function ChessBoard() {
  const [history, setHistory] = useState(() => [initialState()]);
  const [humanColor, setHumanColor] = useState('w');
  const [difficulty, setDifficulty] = useState(3);
  const [selected, setSelected] = useState(null);
  const [lastMove, setLastMove] = useState(null);
  const [aiThinking, setAiThinking] = useState(false);
  const [pendingPromotion, setPendingPromotion] = useState(null);
  const [flipped, setFlipped] = useState(false);

  const state = history[history.length - 1];
  const status = gameStatus(state);
  const gameOver = status === 'checkmate' || status === 'stalemate';
  const message = statusMessage(status, state.turn, humanColor);
  const legalMoves = selected ? generateLegalMoves(state).filter((m) => m.from[0] === selected[0] && m.from[1] === selected[1]) : [];
  const checkedKingSquare = status === 'check' || status === 'checkmate' ? findKing(state.board, state.turn) : null;

  function commitMove(move) {
    const nextState = applyMove(state, move);
    setHistory((prev) => [...prev, nextState]);
    setLastMove({ from: move.from, to: move.to });
    setSelected(null);
  }

  function newGame(nextHumanColor = humanColor) {
    setHistory([initialState()]);
    setSelected(null);
    setLastMove(null);
    setAiThinking(false);
    setPendingPromotion(null);
    setFlipped(nextHumanColor === 'b');
  }

  function chooseHumanColor(color) {
    setHumanColor(color);
    newGame(color);
  }

  function undo() {
    if (aiThinking || pendingPromotion) return;
    setHistory((prev) => {
      if (prev.length <= 1) return prev;
      const steps = prev.length >= 3 ? 2 : 1;
      return prev.slice(0, prev.length - steps);
    });
    setSelected(null);
    setLastMove(null);
  }

  function handleSquareClick(r, c) {
    if (gameOver || aiThinking || pendingPromotion || state.turn !== humanColor) return;
    const piece = state.board[r][c];

    if (selected && selected[0] === r && selected[1] === c) {
      setSelected(null);
      return;
    }

    if (selected) {
      const move = legalMoves.find((m) => m.to[0] === r && m.to[1] === c);
      if (move) {
        if (move.promotion) setPendingPromotion(move);
        else commitMove(move);
        return;
      }
    }

    if (piece && piece[0] === humanColor) setSelected([r, c]);
    else setSelected(null);
  }

  function resolvePromotion(promoteTo) {
    if (!pendingPromotion) return;
    commitMove({ ...pendingPromotion, promoteTo });
    setPendingPromotion(null);
  }

  useEffect(() => {
    if (gameOver || pendingPromotion || state.turn === humanColor) return undefined;
    setAiThinking(true);
    const timer = setTimeout(() => {
      const move = chooseAiMove(state, difficulty);
      setAiThinking(false);
      if (move) commitMove(move);
    }, 280);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, humanColor, gameOver, pendingPromotion, difficulty]);

  useEffect(() => {
    function handleKey(event) {
      const key = event.key.toLowerCase();
      if (key === 'r') undo();
      else if (key === 'n') newGame(humanColor);
      else if (key >= '1' && key <= '5') setDifficulty(Number(key));
      else if (key === 'f') setFlipped((value) => !value);
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, aiThinking, pendingPromotion, humanColor]);

  const displayIndices = Array.from({ length: 8 }, (_, i) => i);
  const rowsOrder = flipped ? [...displayIndices].reverse() : displayIndices;
  const colsOrder = flipped ? [...displayIndices].reverse() : displayIndices;
  const fileLabels = flipped ? [...FILES].reverse() : [...FILES];
  const rankLabels = flipped ? [1, 2, 3, 4, 5, 6, 7, 8] : [8, 7, 6, 5, 4, 3, 2, 1];

  return <div className="game-shell">
    <div className="game-board-wrap">
      <div className="chess-board-frame">
        <div className="chess-rank-labels">{rankLabels.map((n) => <span key={n}>{n}</span>)}</div>
        <div className="chess-board">
          {rowsOrder.map((r) => colsOrder.map((c) => {
            const piece = state.board[r][c];
            const isLight = (r + c) % 2 === 0;
            const isSelected = selected && selected[0] === r && selected[1] === c;
            const isLegalTarget = legalMoves.some((m) => m.to[0] === r && m.to[1] === c);
            const isLastMove = lastMove && ((lastMove.from[0] === r && lastMove.from[1] === c) || (lastMove.to[0] === r && lastMove.to[1] === c));
            const isCheckedKing = checkedKingSquare && checkedKingSquare[0] === r && checkedKingSquare[1] === c;
            const classes = ['chess-square', isLight ? 'light' : 'dark'];
            if (isLastMove) classes.push('last-move');
            if (isSelected) classes.push('selected');
            if (isCheckedKing) classes.push('in-check');
            return <button type="button" key={`${r}-${c}`} className={classes.join(' ')} onClick={() => handleSquareClick(r, c)} aria-label={squareName(r, c)}>
              {piece ? <span className={`chess-piece ${piece[0] === 'w' ? 'white' : 'black'}`}>{GLYPHS[piece[0]][piece[1]]}</span> : null}
              {isLegalTarget ? <span className={`chess-hint${piece ? ' capture' : ''}`} /> : null}
            </button>;
          }))}
        </div>
        <div className="chess-file-labels">{fileLabels.map((f) => <span key={f}>{f}</span>)}</div>
      </div>

      {pendingPromotion ? <div className="chess-promotion">
        <p>승진할 기물을 선택하세요</p>
        <div className="game-btn-grid cols-4">
          {['Q', 'R', 'B', 'N'].map((type) => <button type="button" key={type} className="game-btn" onClick={() => resolvePromotion(type)}>
            <span className={`chess-piece ${humanColor === 'w' ? 'white' : 'black'}`}>{GLYPHS[humanColor][type]}</span> {PROMOTION_LABELS[type]}
          </button>)}
        </div>
      </div> : null}
    </div>

    <aside className="game-panel">
      <h1>체스</h1>
      <p className="game-sub">사람 대 AI · 표준 체스 규칙</p>
      <p className="game-message">{message}</p>

      <p className="game-section-label">기물 색</p>
      <div className="game-btn-grid cols-2">
        <button type="button" className={`game-btn${humanColor === 'w' ? ' active' : ''}`} onClick={() => chooseHumanColor('w')}>백으로 시작</button>
        <button type="button" className={`game-btn${humanColor === 'b' ? ' active' : ''}`} onClick={() => chooseHumanColor('b')}>흑으로 시작</button>
      </div>

      <p className="game-section-label">AI 난이도</p>
      <div className="game-btn-grid cols-2">
        {CHESS_DIFFICULTIES.map((item) => <button type="button" key={item.level} className={`game-btn${difficulty === item.level ? ' active' : ''}`} onClick={() => setDifficulty(item.level)}>{item.level}. {item.label}</button>)}
      </div>

      <div className="game-btn-grid cols-2">
        <button type="button" className="game-btn" onClick={undo}>무르기 [R]</button>
        <button type="button" className="game-btn" onClick={() => setFlipped((value) => !value)}>보드 뒤집기 [F]</button>
      </div>
      <div className="game-btn-grid cols-2">
        <button type="button" className="game-btn primary" style={{ gridColumn: '1 / -1' }} onClick={() => newGame(humanColor)}>새 게임 [N]</button>
      </div>

      <div className="game-stat-row"><span>현재 차례</span><span>{state.turn === 'w' ? '백' : '흑'}</span></div>
      <div className="game-stat-row"><span>진행된 수</span><span>{history.length - 1}</span></div>

      <div className="game-help">
        기물을 클릭한 뒤 이동할 칸을 클릭합니다.<br />R: 무르기 · N: 새 게임 · F: 보드 뒤집기 · 1~5: 난이도
      </div>
    </aside>
  </div>;
}
