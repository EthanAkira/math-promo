'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../../language';
import {
  ROWS, COLS, initialState, generateLegalMoves, applyMove, gameStatus, chooseAiMove,
  findGeneral, isInCheck, pieceColor, pieceType, JANGGI_DIFFICULTIES,
} from './janggiEngine';

const HANJA = {
  h: { G: '漢', A: '士', R: '車', C: '包', H: '馬', E: '象', S: '兵' },
  c: { G: '楚', A: '士', R: '車', C: '包', H: '馬', E: '象', S: '卒' },
};

const INITIAL_COUNTS = { G: 1, A: 2, R: 2, C: 2, H: 2, E: 2, S: 5 };
const PIECE_ORDER = ['R', 'C', 'H', 'E', 'A', 'S'];

const KO = {
  badge: '휴식 코너 · 전통 보드게임',
  title: '한국 장기',
  sub: '사람 vs AI · 초·한 대국',
  sideLabel: '진영 선택',
  sideHan: '한(漢) · 선공',
  sideCho: '초(楚) · 후공',
  diffLabel: 'AI 난이도',
  undo: '무르기 [R]',
  flip: '보드 회전 [F]',
  newGame: '새 대국 시작 [N]',
  progress: '진행 상황',
  turnCount: (n) => `${n}수 진행`,
  aiStatus: 'AI 상태',
  thinking: '수 계산 중...',
  waiting: '대기 중',
  tutorialBtn: '규칙 · 튜토리얼',
  yourTurn: '당신이 둘 차례입니다.',
  aiTurn: 'AI가 수를 계산하고 있습니다...',
  check: (name) => `⚠️ 장군! ${name}의 궁이 위협받고 있습니다.`,
  checkmate: (win) => `외통수(체크메이트)! ${win}`,
  noMoves: (win) => `둘 수 있는 수가 없습니다! ${win}`,
  youWin: '당신의 승리입니다! 🏆',
  aiWin: 'AI의 승리입니다.',
  turnName: (color) => (color === 'h' ? '한(漢)' : '초(楚)'),
  capturedBy: (color) => `${color === 'h' ? '한' : '초'}이(가) 잡은 기물`,
  tutorialTitle: '한국 장기 규칙 안내',
  tutorialIntro: '장기는 궁(장군)을 먼저 외통수로 몰면 이기는 2인용 보드게임입니다. 기물은 선(교차점) 위에 놓이고, 그 선을 따라 움직입니다.',
  pieceSectionTitle: '기물별 이동 방법',
  pieces: [
    { hanja: '漢·楚', name: '궁(장/General)', desc: '자신의 궁성(3×3) 안에서만 한 칸씩 이동합니다. 궁성에 그려진 대각선 위에서는 대각선으로도 이동할 수 있습니다.' },
    { hanja: '士', name: '사(Guard)', desc: '궁과 이동 방법이 같습니다. 궁성 밖으로는 나갈 수 없습니다.' },
    { hanja: '車', name: '차(Chariot)', desc: '상하좌우로 막힘없이 원하는 만큼 이동합니다(장기판의 룩). 궁성 대각선 위에서는 그 선을 따라 대각선 이동도 가능합니다.' },
    { hanja: '包', name: '포(Cannon)', desc: '반드시 기물 하나를 뛰어넘어야 이동할 수 있습니다. 포끼리는 서로 뛰어넘거나 잡을 수 없습니다. 궁성 대각선에서는 가운데를 넘어 반대편 모서리로 이동할 수 있습니다.' },
    { hanja: '馬', name: '마(Horse)', desc: '한 칸 직선으로 간 뒤 대각선으로 한 칸 더 이동합니다. 바로 앞(다리)에 기물이 있으면 그 방향으로 이동할 수 없습니다.' },
    { hanja: '象', name: '상(Elephant)', desc: '한 칸 직선 이동 후 대각선으로 두 칸 더 이동합니다(총 3칸). 다리 두 곳 중 하나라도 막히면 이동할 수 없습니다.' },
    { hanja: '兵·卒', name: '병/졸(Soldier)', desc: '앞 또는 좌우로 한 칸씩 이동합니다. 뒤로는 절대 이동할 수 없습니다.' },
  ],
  winSectionTitle: '승리 조건',
  winText: '상대의 궁이 외통수(어떤 수를 두어도 잡히는 상태)에 몰리면 승리합니다. 자신의 차례에 둘 수 있는 수가 하나도 없어도 패배합니다.',
  controlsSectionTitle: '조작 방법',
  controlsText: '기물을 클릭해 이동 가능한 위치를 확인하고, 원하는 칸을 클릭해 이동하세요.',
  startBtn: '대국 시작하기',
};

const EN = {
  badge: 'Rest Corner · Traditional Board Game',
  title: 'Janggi (Korean Chess)',
  sub: 'Human vs AI · Han vs Cho',
  sideLabel: 'Choose your side',
  sideHan: 'Han (漢) · Moves first',
  sideCho: 'Cho (楚) · Moves second',
  diffLabel: 'AI difficulty',
  undo: 'Undo [R]',
  flip: 'Flip board [F]',
  newGame: 'New game [N]',
  progress: 'Progress',
  turnCount: (n) => `${n} moves played`,
  aiStatus: 'AI status',
  thinking: 'Thinking...',
  waiting: 'Waiting',
  tutorialBtn: 'Rules & Tutorial',
  yourTurn: 'Your move.',
  aiTurn: 'AI is calculating its move...',
  check: (name) => `⚠️ Check! ${name}'s general is under attack.`,
  checkmate: (win) => `Checkmate! ${win}`,
  noMoves: (win) => `No legal moves! ${win}`,
  youWin: 'You win! 🏆',
  aiWin: 'The AI wins.',
  turnName: (color) => (color === 'h' ? 'Han (漢)' : 'Cho (楚)'),
  capturedBy: (color) => `Captured by ${color === 'h' ? 'Han' : 'Cho'}`,
  tutorialTitle: 'How to play Janggi',
  tutorialIntro: 'Janggi is a two-player board game where the goal is to checkmate the opponent\'s general. Pieces sit on the intersections of the lines (points), not inside the squares, and move along those lines.',
  pieceSectionTitle: 'How each piece moves',
  pieces: [
    { hanja: '漢·楚', name: 'General', desc: 'Moves one point at a time, staying inside its own 3x3 palace. May also move diagonally along the palace\'s drawn diagonal lines.' },
    { hanja: '士', name: 'Guard', desc: 'Moves exactly like the general and can never leave the palace.' },
    { hanja: '車', name: 'Chariot', desc: 'Slides any distance horizontally or vertically, like a chess rook. While on a palace diagonal line, it may also slide along that diagonal.' },
    { hanja: '包', name: 'Cannon', desc: 'Must jump over exactly one piece to move or capture, and can never jump over or capture another cannon. On a palace diagonal it may jump over the center point to the opposite corner.' },
    { hanja: '馬', name: 'Horse', desc: 'Moves one point orthogonally, then one point diagonally outward. Blocked if the point directly in that first direction ("the leg") is occupied.' },
    { hanja: '象', name: 'Elephant', desc: 'Moves one point orthogonally, then two points diagonally outward (3 points total). Blocked if either of the two points along the way is occupied.' },
    { hanja: '兵·卒', name: 'Soldier', desc: 'Moves one point forward or sideways. Can never move backward.' },
  ],
  winSectionTitle: 'How to win',
  winText: 'Checkmate the opponent\'s general — trap it so every move still leaves it under attack. A player who has no legal move at all also loses.',
  controlsSectionTitle: 'Controls',
  controlsText: 'Click a piece to see its legal moves, then click a highlighted point to move there.',
  startBtn: 'Start the game',
};

const COPY = { ko: KO, en: EN };

function squareLabel(r, c) {
  return `${String.fromCharCode(97 + c)}${ROWS - r}`;
}

function PalaceLines({ x0, y0, x1, y1, x2, y2 }) {
  return <g className="jg-palace-lines">
    <line x1={x0} y1={y0} x2={x2} y2={y2} />
    <line x1={x1} y1={y0} x2={x0} y2={y2} />
  </g>;
}

function JanggiPiece({ piece, size }) {
  const color = pieceColor(piece);
  const type = pieceType(piece);
  const ring = color === 'h' ? 'var(--jg-han)' : 'var(--jg-cho)';
  return <g className="jg-piece-group">
    <circle r={size} className="jg-piece-disc" stroke={ring} />
    <circle r={size - 4} className="jg-piece-disc-inner" stroke={ring} />
    <text className="jg-piece-glyph" fill={ring}>{HANJA[color][type]}</text>
  </g>;
}

export default function JanggiGame() {
  const { language } = useLanguage();
  const T = COPY[language] || COPY.en;

  const [history, setHistory] = useState(() => [initialState()]);
  const [humanColor, setHumanColor] = useState('h');
  const [difficulty, setDifficulty] = useState(3);
  const [selected, setSelected] = useState(null);
  const [lastMove, setLastMove] = useState(null);
  const [aiThinking, setAiThinking] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [tutorialOpen, setTutorialOpen] = useState(true);

  const state = history[history.length - 1];
  const status = gameStatus(state);
  const gameOver = status === 'checkmate' || status === 'no-moves';
  const legalMoves = useMemo(
    () => (selected ? generateLegalMoves(state).filter((m) => m.from[0] === selected[0] && m.from[1] === selected[1]) : []),
    [state, selected],
  );
  const checkedGeneralSquare = status === 'check' || status === 'checkmate' ? findGeneral(state.board, state.turn) : null;

  const captured = useMemo(() => {
    const counts = { h: {}, c: {} };
    for (const row of state.board) for (const p of row) {
      if (!p) continue;
      const c = pieceColor(p); const t = pieceType(p);
      counts[c][t] = (counts[c][t] || 0) + 1;
    }
    const byHan = [];
    const byCho = [];
    PIECE_ORDER.forEach((type) => {
      const lostCho = INITIAL_COUNTS[type] - (counts.c[type] || 0);
      for (let i = 0; i < lostCho; i += 1) byHan.push({ type, color: 'c' });
      const lostHan = INITIAL_COUNTS[type] - (counts.h[type] || 0);
      for (let i = 0; i < lostHan; i += 1) byCho.push({ type, color: 'h' });
    });
    return { byHan, byCho };
  }, [state.board]);

  function commitMove(move) {
    const next = applyMove(state, move);
    setHistory((prev) => [...prev, next]);
    setLastMove({ from: move.from, to: move.to });
    setSelected(null);
  }

  function newGame(nextHumanColor = humanColor) {
    setHistory([initialState()]);
    setSelected(null);
    setLastMove(null);
    setAiThinking(false);
    setFlipped(nextHumanColor === 'c');
  }

  function chooseSide(color) {
    setHumanColor(color);
    newGame(color);
  }

  function undo() {
    if (aiThinking) return;
    setHistory((prev) => {
      if (prev.length <= 1) return prev;
      const steps = prev.length >= 3 ? 2 : 1;
      return prev.slice(0, prev.length - steps);
    });
    setSelected(null);
    setLastMove(null);
  }

  function handlePointClick(r, c) {
    if (gameOver || aiThinking || state.turn !== humanColor) return;
    const piece = state.board[r][c];
    if (selected && selected[0] === r && selected[1] === c) { setSelected(null); return; }
    if (selected) {
      const move = legalMoves.find((m) => m.to[0] === r && m.to[1] === c);
      if (move) { commitMove(move); return; }
    }
    if (piece && pieceColor(piece) === humanColor) setSelected([r, c]);
    else setSelected(null);
  }

  useEffect(() => {
    if (gameOver || state.turn === humanColor || tutorialOpen) return undefined;
    setAiThinking(true);
    const timer = setTimeout(() => {
      const move = chooseAiMove(state, difficulty);
      setAiThinking(false);
      if (move) commitMove(move);
    }, 320);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, humanColor, gameOver, difficulty, tutorialOpen]);

  useEffect(() => {
    function handleKey(event) {
      const key = event.key.toLowerCase();
      if (key === 'r') undo();
      else if (key === 'n') newGame(humanColor);
      else if (key >= '1' && key <= '5') setDifficulty(Number(key));
      else if (key === 'f') setFlipped((v) => !v);
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, aiThinking, humanColor]);

  const UNIT = 52;
  const MARGIN = 40;
  const width = MARGIN * 2 + UNIT * (COLS - 1);
  const height = MARGIN * 2 + UNIT * (ROWS - 1);
  const px = (c) => MARGIN + (flipped ? COLS - 1 - c : c) * UNIT;
  const py = (r) => MARGIN + (flipped ? ROWS - 1 - r : r) * UNIT;

  const rowsOrder = [...Array(ROWS).keys()];
  const colsOrder = [...Array(COLS).keys()];

  function statusMessage() {
    const winnerIsHuman = state.turn !== humanColor;
    if (status === 'checkmate') return T.checkmate(winnerIsHuman ? T.youWin : T.aiWin);
    if (status === 'no-moves') return T.noMoves(winnerIsHuman ? T.youWin : T.aiWin);
    if (status === 'check') return T.check(T.turnName(state.turn));
    return state.turn === humanColor ? T.yourTurn : T.aiTurn;
  }

  const topCaptured = flipped === (humanColor === 'c') ? captured.byHan : captured.byCho;
  const bottomCaptured = flipped === (humanColor === 'c') ? captured.byCho : captured.byHan;
  const topColor = flipped ? 'h' : 'c';
  const bottomColor = flipped ? 'c' : 'h';

  return <div className="janggi-app">
    <div className="game-shell jg-shell">
      <div className="game-board-wrap">
        <div className="jg-captured-bar">
          <span className="jg-captured-label">{T.capturedBy(topColor)}</span>
          <div className="jg-captured-list">
            {topCaptured.length === 0 ? <span className="jg-no-captured">-</span> : topCaptured.map((p, i) => (
              <span key={`t${i}`} className="jg-captured-item" style={{ color: p.color === 'h' ? 'var(--jg-han)' : 'var(--jg-cho)' }}>{HANJA[p.color][p.type]}</span>
            ))}
          </div>
        </div>

        <svg className="jg-board" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="janggi board">
          <rect x="0" y="0" width={width} height={height} className="jg-board-bg" rx="10" />
          <rect x={MARGIN} y={MARGIN} width={UNIT * (COLS - 1)} height={UNIT * (ROWS - 1)} className="jg-river-band" />
          {Array.from({ length: ROWS }, (_, r) => <line key={`h${r}`} x1={px(0)} y1={py(r)} x2={px(COLS - 1)} y2={py(r)} className="jg-grid-line" />)}
          {Array.from({ length: COLS }, (_, c) => <line key={`v${c}`} x1={px(c)} y1={py(0)} x2={px(c)} y2={py(ROWS - 1)} className="jg-grid-line" />)}
          <PalaceLines x0={px(3)} y0={py(0)} x1={px(5)} y1={py(0)} x2={px(5)} y2={py(2)} />
          <PalaceLines x0={px(3)} y0={py(7)} x1={px(5)} y1={py(7)} x2={px(5)} y2={py(9)} />

          {rowsOrder.map((r) => colsOrder.map((c) => {
            const piece = state.board[r][c];
            const isSelected = selected && selected[0] === r && selected[1] === c;
            const isTarget = legalMoves.some((m) => m.to[0] === r && m.to[1] === c);
            const isLastMove = lastMove && ((lastMove.from[0] === r && lastMove.from[1] === c) || (lastMove.to[0] === r && lastMove.to[1] === c));
            const isCheckedGeneral = checkedGeneralSquare && checkedGeneralSquare[0] === r && checkedGeneralSquare[1] === c;
            return <g key={`${r}-${c}`} transform={`translate(${px(c)},${py(r)})`} className="jg-point" onClick={() => handlePointClick(r, c)} role="button" aria-label={squareLabel(r, c)}>
              <circle r={UNIT / 2 - 2} className="jg-hit-target" />
              {isLastMove ? <circle r="6" className="jg-last-move-mark" /> : null}
              {isSelected ? <circle r={UNIT / 2 - 6} className="jg-selected-ring" /> : null}
              {isCheckedGeneral ? <circle r={UNIT / 2 - 4} className="jg-check-ring" /> : null}
              {piece ? <JanggiPiece piece={piece} size={UNIT / 2 - 6} /> : null}
              {isTarget ? <circle r={piece ? UNIT / 2 - 4 : 7} className={piece ? 'jg-capture-hint' : 'jg-move-hint'} /> : null}
            </g>;
          }))}
        </svg>

        <div className="jg-captured-bar">
          <span className="jg-captured-label">{T.capturedBy(bottomColor)}</span>
          <div className="jg-captured-list">
            {bottomCaptured.length === 0 ? <span className="jg-no-captured">-</span> : bottomCaptured.map((p, i) => (
              <span key={`b${i}`} className="jg-captured-item" style={{ color: p.color === 'h' ? 'var(--jg-han)' : 'var(--jg-cho)' }}>{HANJA[p.color][p.type]}</span>
            ))}
          </div>
        </div>
      </div>

      <aside className="game-panel jg-panel">
        <div className="game-panel-header">
          <div className="game-badge jg-badge">{T.badge}</div>
          <h1>{T.title}</h1>
          <p className="game-sub">{T.sub}</p>
        </div>

        <div className={`game-message-box jg-message-box ${status === 'check' ? 'warning' : gameOver ? 'highlight' : ''}`}>
          <div className="turn-indicator">
            <span className={`jg-turn-dot ${state.turn === 'h' ? 'han' : 'cho'}`} />
            <strong>{T.turnName(state.turn)}</strong>
          </div>
          <p className="game-message-text">{statusMessage()}</p>
        </div>

        <div className="panel-section">
          <p className="game-section-label">{T.sideLabel}</p>
          <div className="game-btn-grid cols-2">
            <button type="button" className={`game-btn jg-side-btn ${humanColor === 'h' ? 'active' : ''}`} onClick={() => chooseSide('h')}>{T.sideHan}</button>
            <button type="button" className={`game-btn jg-side-btn ${humanColor === 'c' ? 'active' : ''}`} onClick={() => chooseSide('c')}>{T.sideCho}</button>
          </div>
        </div>

        <div className="panel-section">
          <p className="game-section-label">{T.diffLabel}</p>
          <div className="game-btn-grid cols-2">
            {JANGGI_DIFFICULTIES.map((item) => (
              <button type="button" key={item.level} className={`game-btn diff-btn ${difficulty === item.level ? 'active' : ''}`} onClick={() => setDifficulty(item.level)}>
                <span className="diff-num">{item.level}</span><span className="diff-name">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="panel-section actions">
          <div className="game-btn-grid cols-2">
            <button type="button" className="game-btn secondary" onClick={undo}>↩ {T.undo}</button>
            <button type="button" className="game-btn secondary" onClick={() => setFlipped((v) => !v)}>🔄 {T.flip}</button>
          </div>
          <button type="button" className="game-btn secondary full-width" onClick={() => setTutorialOpen(true)}>📖 {T.tutorialBtn}</button>
          <button type="button" className="game-btn primary full-width" onClick={() => newGame(humanColor)}>⚡ {T.newGame}</button>
        </div>

        <div className="game-stats-card">
          <div className="game-stat-row"><span>{T.progress}</span><strong>{T.turnCount(history.length - 1)}</strong></div>
          <div className="game-stat-row"><span>{T.aiStatus}</span><strong className={aiThinking ? 'thinking' : ''}>{aiThinking ? T.thinking : T.waiting}</strong></div>
        </div>
      </aside>
    </div>

    {tutorialOpen ? <div className="jg-tutorial-overlay" role="dialog" aria-modal="true" aria-label={T.tutorialTitle}>
      <div className="jg-tutorial-card">
        <h2>{T.tutorialTitle}</h2>
        <p className="jg-tutorial-intro">{T.tutorialIntro}</p>
        <h3>{T.pieceSectionTitle}</h3>
        <div className="jg-piece-guide">
          {T.pieces.map((p) => <div key={p.name} className="jg-piece-guide-row">
            <span className="jg-piece-guide-glyph">{p.hanja}</span>
            <div><strong>{p.name}</strong><p>{p.desc}</p></div>
          </div>)}
        </div>
        <h3>{T.winSectionTitle}</h3>
        <p>{T.winText}</p>
        <h3>{T.controlsSectionTitle}</h3>
        <p>{T.controlsText}</p>
        <button type="button" className="game-btn primary full-width jg-tutorial-close" onClick={() => setTutorialOpen(false)}>{T.startBtn}</button>
      </div>
    </div> : null}

    <style dangerouslySetInnerHTML={{ __html: CSS }} />
  </div>;
}

const CSS = `
.janggi-app{--jg-han:#1f6b3a;--jg-cho:#b0382a;--jg-wood:#dcb578;--jg-wood-dark:#b98a4c;--jg-board-bg:#eecf95;--jg-river:rgba(255,255,255,0.14);font-family:'Noto Sans KR', sans-serif;}
.janggi-app .jg-shell{display:flex;gap:24px;flex-wrap:wrap;align-items:flex-start;justify-content:center;}
.janggi-app .jg-board{width:100%;max-width:480px;display:block;margin:0 auto;filter:drop-shadow(0 10px 24px rgba(0,0,0,0.28));}
.janggi-app .jg-board-bg{fill:var(--jg-board-bg);stroke:var(--jg-wood-dark);stroke-width:3;}
.janggi-app .jg-river-band{fill:var(--jg-river);pointer-events:none;}
.janggi-app .jg-grid-line{stroke:var(--jg-wood-dark);stroke-width:1.4;}
.janggi-app .jg-palace-lines line{stroke:var(--jg-wood-dark);stroke-width:1.4;}
.janggi-app .jg-point{cursor:pointer;}
.janggi-app .jg-hit-target{fill:transparent;}
.janggi-app .jg-piece-disc{r:20;fill:#fbf3df;stroke-width:2.6;}
.janggi-app .jg-piece-disc-inner{fill:none;stroke-width:1;opacity:0.55;}
.janggi-app .jg-piece-glyph{font-size:19px;font-weight:800;text-anchor:middle;dominant-baseline:central;font-family:'Noto Serif KR','Song Myung',serif;}
.janggi-app .jg-selected-ring{fill:none;stroke:#2a5c8a;stroke-width:3;}
.janggi-app .jg-check-ring{fill:none;stroke:#c23b32;stroke-width:3;stroke-dasharray:4 3;}
.janggi-app .jg-last-move-mark{fill:#2a5c8a;opacity:0.55;}
.janggi-app .jg-move-hint{fill:rgba(42,92,138,0.55);}
.janggi-app .jg-capture-hint{fill:none;stroke:#c23b32;stroke-width:3;}
.janggi-app .jg-captured-bar{display:flex;align-items:center;gap:10px;max-width:480px;margin:0 auto;padding:6px 4px;flex-wrap:wrap;}
.janggi-app .jg-captured-label{font-size:11px;color:var(--ink-soft, #766f63);white-space:nowrap;}
.janggi-app .jg-captured-list{display:flex;flex-wrap:wrap;gap:4px;min-height:22px;}
.janggi-app .jg-captured-item{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:50%;background:#fbf3df;font-size:13px;font-weight:800;border:1.4px solid currentColor;}
.janggi-app .jg-no-captured{font-size:12px;color:var(--ink-soft, #999);}
.janggi-app .jg-badge{background:linear-gradient(135deg,#8f2a24,#1f6b3a);color:#fff;}
.janggi-app .jg-turn-dot{display:inline-block;width:12px;height:12px;border-radius:50%;margin-right:6px;}
.janggi-app .jg-turn-dot.han{background:var(--jg-han);}
.janggi-app .jg-turn-dot.cho{background:var(--jg-cho);}
.janggi-app .jg-side-btn.active{background:linear-gradient(135deg,#8f2a24,#1f6b3a);color:#fff;border-color:transparent;}
.janggi-app .jg-tutorial-overlay{position:fixed;inset:0;background:rgba(20,14,8,0.78);display:flex;align-items:center;justify-content:center;z-index:80;padding:20px;}
.janggi-app .jg-tutorial-card{width:100%;max-width:640px;max-height:86vh;overflow-y:auto;background:linear-gradient(160deg,#fbf3df 0%,#eedfbf 100%);border-radius:18px;padding:28px 26px;box-shadow:0 20px 50px rgba(0,0,0,0.5);color:#241f1a;}
.janggi-app .jg-tutorial-card h2{font-family:'Song Myung',serif;font-size:1.5rem;margin:0 0 10px;}
.janggi-app .jg-tutorial-card h3{font-size:1rem;margin:20px 0 8px;color:#8f2a24;}
.janggi-app .jg-tutorial-intro{margin:0;font-size:0.92rem;line-height:1.7;}
.janggi-app .jg-tutorial-card p{margin:0;font-size:0.9rem;line-height:1.65;}
.janggi-app .jg-piece-guide-row{display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-top:1px solid rgba(0,0,0,0.08);}
.janggi-app .jg-piece-guide-row:first-child{border-top:none;}
.janggi-app .jg-piece-guide-glyph{flex:none;width:38px;height:38px;border-radius:50%;background:#fff;border:2px solid #b98a4c;display:flex;align-items:center;justify-content:center;font-weight:800;font-family:'Noto Serif KR',serif;}
.janggi-app .jg-piece-guide-row strong{display:block;margin-bottom:2px;}
.janggi-app .jg-piece-guide-row p{margin:0;font-size:0.87rem;color:#4a4238;}
.janggi-app .jg-tutorial-close{margin-top:22px;}
@media (max-width:720px){
  .janggi-app .jg-shell{flex-direction:column;align-items:stretch;}
}
`;
