'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const DIFFICULTIES = [
  { level: 1, label: '쉬움', remove: 36 },
  { level: 2, label: '보통', remove: 44 },
  { level: 3, label: '어려움', remove: 50 },
  { level: 4, label: '매우 어려움', remove: 55 },
];

function shuffle(values) {
  const copy = [...values];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function isValid(board, row, col, num) {
  for (let i = 0; i < 9; i += 1) {
    if (board[row][i] === num || board[i][col] === num) return false;
  }
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 3; r += 1) {
    for (let c = boxCol; c < boxCol + 3; c += 1) {
      if (board[r][c] === num) return false;
    }
  }
  return true;
}

function findEmpty(board) {
  for (let r = 0; r < 9; r += 1) {
    for (let c = 0; c < 9; c += 1) {
      if (board[r][c] === 0) return [r, c];
    }
  }
  return null;
}

function solveBoard(board) {
  const empty = findEmpty(board);
  if (!empty) return true;
  const [row, col] = empty;
  for (const num of shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num;
      if (solveBoard(board)) return true;
      board[row][col] = 0;
    }
  }
  return false;
}

function countSolutions(board, limit) {
  const empty = findEmpty(board);
  if (!empty) return 1;
  const [row, col] = empty;
  let count = 0;
  for (let num = 1; num <= 9; num += 1) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num;
      count += countSolutions(board, limit);
      board[row][col] = 0;
      if (count >= limit) return count;
    }
  }
  return count;
}

function generatePuzzle(removeCount) {
  const solution = Array.from({ length: 9 }, () => Array(9).fill(0));
  solveBoard(solution);
  const puzzle = solution.map((row) => [...row]);
  const cells = shuffle(Array.from({ length: 81 }, (_, i) => [Math.floor(i / 9), i % 9]));
  let removed = 0;
  for (const [row, col] of cells) {
    if (removed >= removeCount) break;
    const backup = puzzle[row][col];
    puzzle[row][col] = 0;
    const test = puzzle.map((r) => [...r]);
    if (countSolutions(test, 2) === 1) removed += 1;
    else puzzle[row][col] = backup;
  }
  return { puzzle, solution };
}

function emptyNotes() {
  return Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => new Set()));
}

function cloneNotes(notes) {
  return notes.map((row) => row.map((cell) => new Set(cell)));
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export default function SudokuBoard() {
  const [difficulty, setDifficulty] = useState(2);
  const [puzzle, setPuzzle] = useState(null);
  const [solution, setSolution] = useState(null);
  const [board, setBoard] = useState(null);
  const [fixed, setFixed] = useState(null);
  const [notes, setNotes] = useState(null);
  const [selected, setSelected] = useState(null);
  const [noteMode, setNoteMode] = useState(false);
  const [errors, setErrors] = useState(new Set());
  const [message, setMessage] = useState('퍼즐을 생성하고 있습니다...');
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [startedAt, setStartedAt] = useState(null);
  const [finishedSeconds, setFinishedSeconds] = useState(null);
  const [tick, setTick] = useState(0);
  const timerRef = useRef(null);

  const newGame = useCallback((level) => {
    setLoading(true);
    setMessage('퍼즐을 생성하고 있습니다...');
    setTimeout(() => {
      const config = DIFFICULTIES.find((item) => item.level === level) || DIFFICULTIES[1];
      const { puzzle: nextPuzzle, solution: nextSolution } = generatePuzzle(config.remove);
      setPuzzle(nextPuzzle);
      setSolution(nextSolution);
      setBoard(nextPuzzle.map((row) => [...row]));
      setFixed(nextPuzzle.map((row) => row.map((value) => value !== 0)));
      setNotes(emptyNotes());
      setErrors(new Set());
      setSelected(null);
      setNoteMode(false);
      setCompleted(false);
      setStartedAt(Date.now());
      setFinishedSeconds(null);
      setMessage('빈칸을 선택하고 숫자를 입력하세요.');
      setLoading(false);
    }, 30);
  }, []);

  useEffect(() => {
    newGame(2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (completed || loading) return undefined;
    timerRef.current = setInterval(() => setTick((value) => value + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [completed, loading]);

  const elapsedSeconds = completed && finishedSeconds !== null ? finishedSeconds : startedAt ? Math.floor((Date.now() - startedAt) / 1000) : 0;

  const canEditSelected = selected && fixed && !fixed[selected[0]][selected[1]];

  const checkCompletion = useCallback((nextBoard) => {
    const isDone = solution && nextBoard.every((row, r) => row.every((value, c) => value === solution[r][c]));
    if (isDone) {
      setCompleted(true);
      setFinishedSeconds(startedAt ? Math.floor((Date.now() - startedAt) / 1000) : 0);
      setErrors(new Set());
      setMessage('축하합니다! 스도쿠를 완성했습니다.');
    }
    return isDone;
  }, [solution, startedAt]);

  function removeNotesFromRelated(nextNotes, row, col, num) {
    for (let c = 0; c < 9; c += 1) nextNotes[row][c].delete(num);
    for (let r = 0; r < 9; r += 1) nextNotes[r][col].delete(num);
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r += 1) {
      for (let c = boxCol; c < boxCol + 3; c += 1) nextNotes[r][c].delete(num);
    }
  }

  function enterNumber(num) {
    if (completed || !canEditSelected) return;
    const [row, col] = selected;

    if (noteMode) {
      if (board[row][col] !== 0) return;
      const nextNotes = cloneNotes(notes);
      if (nextNotes[row][col].has(num)) nextNotes[row][col].delete(num);
      else nextNotes[row][col].add(num);
      setNotes(nextNotes);
      setMessage('메모를 입력했습니다.');
      return;
    }

    const nextBoard = board.map((r) => [...r]);
    nextBoard[row][col] = num;
    const nextNotes = cloneNotes(notes);
    nextNotes[row][col].clear();
    const nextErrors = new Set(errors);
    nextErrors.delete(`${row},${col}`);

    if (num === solution[row][col]) {
      removeNotesFromRelated(nextNotes, row, col, num);
      setMessage('숫자를 입력했습니다.');
    } else {
      setMessage('입력했습니다. 검사 버튼으로 확인할 수 있습니다.');
    }

    setBoard(nextBoard);
    setNotes(nextNotes);
    setErrors(nextErrors);
    checkCompletion(nextBoard);
  }

  function eraseSelected() {
    if (completed || !canEditSelected) return;
    const [row, col] = selected;
    const nextBoard = board.map((r) => [...r]);
    nextBoard[row][col] = 0;
    const nextNotes = cloneNotes(notes);
    nextNotes[row][col].clear();
    const nextErrors = new Set(errors);
    nextErrors.delete(`${row},${col}`);
    setBoard(nextBoard);
    setNotes(nextNotes);
    setErrors(nextErrors);
    setMessage('선택한 칸을 지웠습니다.');
  }

  function giveHint() {
    if (completed) return;
    const candidates = [];
    for (let r = 0; r < 9; r += 1) for (let c = 0; c < 9; c += 1) if (board[r][c] === 0) candidates.push([r, c]);
    if (!candidates.length) {
      setMessage('빈칸이 없습니다.');
      return;
    }
    const target = selected && board[selected[0]][selected[1]] === 0 ? selected : candidates[Math.floor(Math.random() * candidates.length)];
    const [row, col] = target;
    const value = solution[row][col];
    const nextBoard = board.map((r) => [...r]);
    nextBoard[row][col] = value;
    const nextNotes = cloneNotes(notes);
    nextNotes[row][col].clear();
    removeNotesFromRelated(nextNotes, row, col, value);
    const nextErrors = new Set(errors);
    nextErrors.delete(`${row},${col}`);
    setBoard(nextBoard);
    setNotes(nextNotes);
    setErrors(nextErrors);
    setSelected(target);
    setMessage(`힌트: 이 칸의 숫자는 ${value}입니다.`);
    checkCompletion(nextBoard);
  }

  function checkAnswers() {
    const nextErrors = new Set();
    let filled = 0;
    for (let r = 0; r < 9; r += 1) {
      for (let c = 0; c < 9; c += 1) {
        const value = board[r][c];
        if (value !== 0) filled += 1;
        if (value !== 0 && value !== solution[r][c]) nextErrors.add(`${r},${c}`);
      }
    }
    setErrors(nextErrors);
    if (nextErrors.size) setMessage(`틀린 칸이 ${nextErrors.size}개 있습니다.`);
    else if (filled < 81) setMessage('현재까지 입력한 숫자는 모두 맞습니다.');
    else checkCompletion(board);
  }

  function toggleNoteMode() {
    setNoteMode((value) => {
      const next = !value;
      setMessage(next ? '메모 모드를 켰습니다.' : '숫자 입력 모드로 변경했습니다.');
      return next;
    });
  }

  function relatedToSelected(row, col) {
    if (!selected) return false;
    const [sr, sc] = selected;
    return row === sr || col === sc || (Math.floor(row / 3) === Math.floor(sr / 3) && Math.floor(col / 3) === Math.floor(sc / 3));
  }

  useEffect(() => {
    function handleKey(event) {
      if (!board) return;
      if (event.key >= '1' && event.key <= '9') enterNumber(Number(event.key));
      else if (event.key === '0' || event.key === 'Backspace' || event.key === 'Delete') eraseSelected();
      else if (event.key.toLowerCase() === 'm') toggleNoteMode();
      else if (event.key.toLowerCase() === 'h') giveHint();
      else if (event.key.toLowerCase() === 'c') checkAnswers();
      else if (event.key.toLowerCase() === 'n') newGame(difficulty);
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board, notes, errors, selected, noteMode, completed, difficulty]);

  if (loading || !board) {
    return <div className="game-shell"><div className="game-board-wrap"><div className="sudoku-board sudoku-loading"><p>{message}</p></div></div></div>;
  }

  const selectedValue = selected ? board[selected[0]][selected[1]] : 0;

  return <div className="game-shell">
    <div className="game-board-wrap">
      <div className="sudoku-board">
        {board.map((row, r) => row.map((value, c) => {
          const isSelected = selected && selected[0] === r && selected[1] === c;
          const classes = ['sudoku-cell'];
          if (r % 3 === 0) classes.push('box-top');
          if (c % 3 === 0) classes.push('box-left');
          if (completed) classes.push('completed');
          else if (relatedToSelected(r, c)) classes.push('related');
          if (!completed && selectedValue !== 0 && value === selectedValue) classes.push('same-value');
          if (isSelected) classes.push('selected');
          if (value !== 0) {
            if (errors.has(`${r},${c}`)) classes.push('error-value');
            else if (fixed[r][c]) classes.push('given');
            else classes.push('user-value');
          }
          return <button type="button" key={`${r}-${c}`} className={classes.join(' ')} onClick={() => setSelected([r, c])} aria-label={`${r + 1}행 ${c + 1}열`}>
            {value !== 0 ? value : notes[r][c].size ? <span className="sudoku-notes">{Array.from({ length: 9 }, (_, i) => <span key={i}>{notes[r][c].has(i + 1) ? i + 1 : ''}</span>)}</span> : null}
          </button>;
        }))}
      </div>
    </div>

    <aside className="game-panel">
      <h1>스도쿠</h1>
      <p className="game-sub">난이도를 고르고 빈칸을 채워보세요.</p>
      <div className="game-timer">{formatTime(elapsedSeconds)}</div>
      <p className="game-message">{message}</p>

      <p className="game-section-label">난이도</p>
      <div className="game-btn-grid cols-2">
        {DIFFICULTIES.map((item) => <button type="button" key={item.level} className={`game-btn${difficulty === item.level ? ' active' : ''}`} onClick={() => { setDifficulty(item.level); newGame(item.level); }}>{item.label}</button>)}
      </div>

      <p className="game-section-label">숫자 입력{noteMode ? ' · 메모 모드' : ''}</p>
      <div className="game-btn-grid cols-3">
        {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => <button type="button" key={num} className="game-btn" onClick={() => enterNumber(num)}>{num}</button>)}
      </div>

      <div className="game-btn-grid cols-2">
        <button type="button" className={`game-btn${noteMode ? ' active' : ''}`} onClick={toggleNoteMode}>메모 [M]</button>
        <button type="button" className="game-btn" onClick={eraseSelected}>지우기 [0]</button>
        <button type="button" className="game-btn" onClick={giveHint}>힌트 [H]</button>
        <button type="button" className="game-btn" onClick={checkAnswers}>검사 [C]</button>
      </div>
      <div className="game-btn-grid cols-2">
        <button type="button" className="game-btn primary" style={{ gridColumn: '1 / -1' }} onClick={() => newGame(difficulty)}>새 게임 [N]</button>
      </div>

      <div className="game-help">
        숫자 키 1~9: 입력 · 0/Backspace: 지우기<br />M: 메모 · H: 힌트 · C: 검사 · N: 새 게임
      </div>
    </aside>
  </div>;
}
