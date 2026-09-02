// Janggi (Korean chess) rules engine — pure functions over a plain state object.
// Board: 9 columns (0-8) x 10 rows (0-9). Row 0 = Cho's back rank (top), row 9 = Han's back rank (bottom).
// Piece strings: `${color}${type}` — color 'h' (Han) | 'c' (Cho); type G,A,R,C,H,E,S.

export const COLS = 9;
export const ROWS = 10;

export const PIECE_VALUES = { G: 100000, A: 300, R: 1300, C: 700, H: 500, E: 300, S: 200 };

const ORTHO_DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]];

const HORSE_MOVES = [
  { dest: [-2, -1], leg: [-1, 0] }, { dest: [-2, 1], leg: [-1, 0] },
  { dest: [2, -1], leg: [1, 0] }, { dest: [2, 1], leg: [1, 0] },
  { dest: [-1, -2], leg: [0, -1] }, { dest: [1, -2], leg: [0, -1] },
  { dest: [-1, 2], leg: [0, 1] }, { dest: [1, 2], leg: [0, 1] },
];

const ELEPHANT_MOVES = [
  { leg1: [-1, 0], leg2: [-2, -1], dest: [-3, -2] }, { leg1: [-1, 0], leg2: [-2, 1], dest: [-3, 2] },
  { leg1: [1, 0], leg2: [2, -1], dest: [3, -2] }, { leg1: [1, 0], leg2: [2, 1], dest: [3, 2] },
  { leg1: [0, -1], leg2: [-1, -2], dest: [-2, -3] }, { leg1: [0, -1], leg2: [1, -2], dest: [2, -3] },
  { leg1: [0, 1], leg2: [-1, 2], dest: [-2, 3] }, { leg1: [0, 1], leg2: [1, 2], dest: [2, 3] },
];

// Each palace diagonal is an ordered 3-point line: corner -> center -> corner.
const CHO_PALACE = { rowMin: 0, rowMax: 2, colMin: 3, colMax: 5 };
const HAN_PALACE = { rowMin: 7, rowMax: 9, colMin: 3, colMax: 5 };
const PALACES = { c: CHO_PALACE, h: HAN_PALACE };
const PALACE_DIAGONALS = [
  [[0, 3], [1, 4], [2, 5]],
  [[0, 5], [1, 4], [2, 3]],
  [[7, 3], [8, 4], [9, 5]],
  [[7, 5], [8, 4], [9, 3]],
];

export function inBounds(r, c) {
  return r >= 0 && r < ROWS && c >= 0 && c < COLS;
}

export function pieceColor(piece) {
  return piece ? piece[0] : null;
}

export function pieceType(piece) {
  return piece ? piece[1] : null;
}

function inPalace(color, r, c) {
  const p = PALACES[color];
  return r >= p.rowMin && r <= p.rowMax && c >= p.colMin && c <= p.colMax;
}

function diagonalLineAt(r, c) {
  return PALACE_DIAGONALS.find((line) => line.some(([lr, lc]) => lr === r && lc === c)) || null;
}

function cloneBoard(board) {
  return board.map((row) => [...row]);
}

// Traditional Janggi lets each player choose, before the game starts, whether Horse or Elephant
// stands closer to the center on their left pair and their right pair (a real rule called 포진 —
// e.g. 원앙마 has both horses inside; 외상 has both elephants inside; the two are independently
// mixable). 'HE' = Horse then Elephant reading outward-to-inward is NOT it — reading left-to-right
// in board-column order: 'HE' puts Horse at the outer slot, Elephant at the inner slot; 'EH' is the
// reverse. Left pair sits between the corner Chariot and the left Advisor; right pair mirrors it.
export const DEFAULT_FORMATION = { left: 'HE', right: 'EH' };

function buildBackRow(formation = DEFAULT_FORMATION) {
  const left = formation.left === 'EH' ? ['E', 'H'] : ['H', 'E'];
  const right = formation.right === 'EH' ? ['E', 'H'] : ['H', 'E'];
  return ['R', left[0], left[1], 'A', null, 'A', right[0], right[1], 'R'];
}

export function initialBoard(formations = {}) {
  const board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  const backC = buildBackRow(formations.c);
  backC.forEach((type, c) => { if (type) board[0][c] = `c${type}`; });
  board[1][4] = 'cG';
  board[2][1] = 'cC';
  board[2][7] = 'cC';
  [0, 2, 4, 6, 8].forEach((c) => { board[3][c] = 'cS'; });

  const backH = buildBackRow(formations.h);
  backH.forEach((type, c) => { if (type) board[9][c] = `h${type}`; });
  board[8][4] = 'hG';
  board[7][1] = 'hC';
  board[7][7] = 'hC';
  [0, 2, 4, 6, 8].forEach((c) => { board[6][c] = 'hS'; });
  return board;
}

export function initialState(formations) {
  return { board: initialBoard(formations), turn: 'h' };
}

function stepMoves(board, r, c, color, offsets, push) {
  for (const [dr, dc] of offsets) {
    const nr = r + dr; const nc = c + dc;
    if (!inBounds(nr, nc)) continue;
    const target = board[nr][nc];
    if (!target || pieceColor(target) !== color) push({ from: [r, c], to: [nr, nc], piece: board[r][c], captured: target || null });
  }
}

function palaceStepMoves(board, r, c, color, push) {
  stepMoves(board, r, c, color, ORTHO_DIRS.filter(([dr, dc]) => inPalace(color, r + dr, c + dc)), push);
  const line = diagonalLineAt(r, c);
  if (!line) return;
  const idx = line.findIndex(([lr, lc]) => lr === r && lc === c);
  const neighborIdxs = idx === 1 ? [0, 2] : [1];
  for (const ni of neighborIdxs) {
    const [nr, nc] = line[ni];
    if (!inPalace(color, nr, nc)) continue;
    const target = board[nr][nc];
    if (!target || pieceColor(target) !== color) push({ from: [r, c], to: [nr, nc], piece: board[r][c], captured: target || null });
  }
}

function slideMoves(board, r, c, color, dirs, push) {
  for (const [dr, dc] of dirs) {
    let nr = r + dr; let nc = c + dc;
    while (inBounds(nr, nc)) {
      const target = board[nr][nc];
      if (!target) {
        push({ from: [r, c], to: [nr, nc], piece: board[r][c], captured: null });
      } else {
        if (pieceColor(target) !== color) push({ from: [r, c], to: [nr, nc], piece: board[r][c], captured: target });
        break;
      }
      nr += dr; nc += dc;
    }
  }
}

function slideAlongLine(board, line, idx, color, push, r, c) {
  const dirs = idx === 1 ? [-1, 1] : [idx === 0 ? 1 : -1];
  for (const step of dirs) {
    let i = idx + step;
    while (i >= 0 && i <= 2) {
      const [nr, nc] = line[i];
      const target = board[nr][nc];
      if (!target) {
        push({ from: [r, c], to: [nr, nc], piece: board[r][c], captured: null });
      } else {
        if (pieceColor(target) !== color) push({ from: [r, c], to: [nr, nc], piece: board[r][c], captured: target });
        break;
      }
      i += step;
    }
  }
}

function rookMoves(board, r, c, color, push) {
  slideMoves(board, r, c, color, ORTHO_DIRS, push);
  const line = diagonalLineAt(r, c);
  if (!line) return;
  const idx = line.findIndex(([lr, lc]) => lr === r && lc === c);
  slideAlongLine(board, line, idx, color, push, r, c);
}

function cannonScan(board, r, c, color, dr, dc, push) {
  let nr = r + dr; let nc = c + dc;
  while (inBounds(nr, nc) && !board[nr][nc]) { nr += dr; nc += dc; }
  if (!inBounds(nr, nc)) return;
  const screen = board[nr][nc];
  if (pieceType(screen) === 'C') return;
  nr += dr; nc += dc;
  while (inBounds(nr, nc)) {
    const target = board[nr][nc];
    if (!target) {
      push({ from: [r, c], to: [nr, nc], piece: board[r][c], captured: null });
    } else {
      if (pieceColor(target) !== color && pieceType(target) !== 'C') push({ from: [r, c], to: [nr, nc], piece: board[r][c], captured: target });
      break;
    }
    nr += dr; nc += dc;
  }
}

function cannonPalaceJump(board, r, c, color, push) {
  const line = diagonalLineAt(r, c);
  if (!line) return;
  const idx = line.findIndex(([lr, lc]) => lr === r && lc === c);
  if (idx === 1) return;
  const [midR, midC] = line[1];
  const screen = board[midR][midC];
  if (!screen || pieceType(screen) === 'C') return;
  const [dr2, dc2] = line[idx === 0 ? 2 : 0];
  const target = board[dr2][dc2];
  if (!target || (pieceColor(target) !== color && pieceType(target) !== 'C')) {
    push({ from: [r, c], to: [dr2, dc2], piece: board[r][c], captured: target || null });
  }
}

function cannonMoves(board, r, c, color, push) {
  for (const [dr, dc] of ORTHO_DIRS) cannonScan(board, r, c, color, dr, dc, push);
  cannonPalaceJump(board, r, c, color, push);
}

function horseMoves(board, r, c, color, push) {
  for (const { dest, leg } of HORSE_MOVES) {
    const legR = r + leg[0]; const legC = c + leg[1];
    if (inBounds(legR, legC) && board[legR][legC]) continue;
    const nr = r + dest[0]; const nc = c + dest[1];
    if (!inBounds(nr, nc)) continue;
    const target = board[nr][nc];
    if (!target || pieceColor(target) !== color) push({ from: [r, c], to: [nr, nc], piece: board[r][c], captured: target || null });
  }
}

function elephantMoves(board, r, c, color, push) {
  for (const { leg1, leg2, dest } of ELEPHANT_MOVES) {
    const l1r = r + leg1[0]; const l1c = c + leg1[1];
    if (!inBounds(l1r, l1c) || board[l1r][l1c]) continue;
    const l2r = r + leg2[0]; const l2c = c + leg2[1];
    if (!inBounds(l2r, l2c) || board[l2r][l2c]) continue;
    const nr = r + dest[0]; const nc = c + dest[1];
    if (!inBounds(nr, nc)) continue;
    const target = board[nr][nc];
    if (!target || pieceColor(target) !== color) push({ from: [r, c], to: [nr, nc], piece: board[r][c], captured: target || null });
  }
}

function soldierMoves(board, r, c, color, push) {
  const forward = color === 'h' ? -1 : 1;
  const dests = [[r + forward, c], [r, c - 1], [r, c + 1]];
  for (const [nr, nc] of dests) {
    if (!inBounds(nr, nc)) continue;
    const target = board[nr][nc];
    if (!target || pieceColor(target) !== color) push({ from: [r, c], to: [nr, nc], piece: board[r][c], captured: target || null });
  }
}

export function generatePseudoMoves(state) {
  const { board, turn } = state;
  const moves = [];
  const push = (move) => moves.push(move);
  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < COLS; c += 1) {
      const piece = board[r][c];
      if (!piece || pieceColor(piece) !== turn) continue;
      const type = pieceType(piece);
      if (type === 'G' || type === 'A') palaceStepMoves(board, r, c, turn, push);
      else if (type === 'R') rookMoves(board, r, c, turn, push);
      else if (type === 'C') cannonMoves(board, r, c, turn, push);
      else if (type === 'H') horseMoves(board, r, c, turn, push);
      else if (type === 'E') elephantMoves(board, r, c, turn, push);
      else if (type === 'S') soldierMoves(board, r, c, turn, push);
    }
  }
  return moves;
}

function generalAdvisorAttacks(board, row, col, byColor) {
  for (const [dr, dc] of ORTHO_DIRS) {
    const sr = row + dr; const sc = col + dc;
    if (!inBounds(sr, sc)) continue;
    const p = board[sr][sc];
    if (p && pieceColor(p) === byColor && (pieceType(p) === 'G' || pieceType(p) === 'A') && inPalace(byColor, sr, sc) && inPalace(byColor, row, col)) return true;
  }
  const line = diagonalLineAt(row, col);
  if (line) {
    const idx = line.findIndex(([lr, lc]) => lr === row && lc === col);
    const neighborIdxs = idx === 1 ? [0, 2] : [1];
    for (const ni of neighborIdxs) {
      const [sr, sc] = line[ni];
      const p = board[sr][sc];
      if (p && pieceColor(p) === byColor && (pieceType(p) === 'G' || pieceType(p) === 'A')) return true;
    }
  }
  return false;
}

function rookAttacks(board, row, col, byColor) {
  for (const [dr, dc] of ORTHO_DIRS) {
    let nr = row + dr; let nc = col + dc;
    while (inBounds(nr, nc)) {
      const target = board[nr][nc];
      if (target) {
        if (pieceColor(target) === byColor && pieceType(target) === 'R') return true;
        break;
      }
      nr += dr; nc += dc;
    }
  }
  const line = diagonalLineAt(row, col);
  if (line) {
    const idx = line.findIndex(([lr, lc]) => lr === row && lc === col);
    const dirs = idx === 1 ? [-1, 1] : [idx === 0 ? 1 : -1];
    for (const step of dirs) {
      let i = idx + step;
      while (i >= 0 && i <= 2) {
        const [nr, nc] = line[i];
        const target = board[nr][nc];
        if (target) {
          if (pieceColor(target) === byColor && pieceType(target) === 'R') return true;
          break;
        }
        i += step;
      }
    }
  }
  return false;
}

function cannonAttacksDir(board, row, col, byColor, dr, dc) {
  let nr = row + dr; let nc = col + dc;
  while (inBounds(nr, nc) && !board[nr][nc]) { nr += dr; nc += dc; }
  if (!inBounds(nr, nc)) return false;
  if (pieceType(board[nr][nc]) === 'C') return false;
  nr += dr; nc += dc;
  while (inBounds(nr, nc) && !board[nr][nc]) { nr += dr; nc += dc; }
  if (!inBounds(nr, nc)) return false;
  const attacker = board[nr][nc];
  return pieceColor(attacker) === byColor && pieceType(attacker) === 'C';
}

function cannonAttacks(board, row, col, byColor) {
  for (const [dr, dc] of ORTHO_DIRS) if (cannonAttacksDir(board, row, col, byColor, dr, dc)) return true;
  const line = diagonalLineAt(row, col);
  if (line) {
    const idx = line.findIndex(([lr, lc]) => lr === row && lc === col);
    if (idx !== 1) {
      const [midR, midC] = line[1];
      const screen = board[midR][midC];
      if (screen && pieceType(screen) !== 'C') {
        const [or, oc] = line[idx === 0 ? 2 : 0];
        const attacker = board[or][oc];
        if (attacker && pieceColor(attacker) === byColor && pieceType(attacker) === 'C') return true;
      }
    }
  }
  return false;
}

function horseAttacks(board, row, col, byColor) {
  for (const { dest, leg } of HORSE_MOVES) {
    const sr = row - dest[0]; const sc = col - dest[1];
    if (!inBounds(sr, sc)) continue;
    const source = board[sr][sc];
    if (!source || pieceColor(source) !== byColor || pieceType(source) !== 'H') continue;
    const legR = sr + leg[0]; const legC = sc + leg[1];
    if (inBounds(legR, legC) && board[legR][legC]) continue;
    return true;
  }
  return false;
}

function elephantAttacks(board, row, col, byColor) {
  for (const { leg1, leg2, dest } of ELEPHANT_MOVES) {
    const sr = row - dest[0]; const sc = col - dest[1];
    if (!inBounds(sr, sc)) continue;
    const source = board[sr][sc];
    if (!source || pieceColor(source) !== byColor || pieceType(source) !== 'E') continue;
    const l1r = sr + leg1[0]; const l1c = sc + leg1[1];
    if (!inBounds(l1r, l1c) || board[l1r][l1c]) continue;
    const l2r = sr + leg2[0]; const l2c = sc + leg2[1];
    if (!inBounds(l2r, l2c) || board[l2r][l2c]) continue;
    return true;
  }
  return false;
}

function soldierAttacks(board, row, col, byColor) {
  const forward = byColor === 'h' ? -1 : 1;
  const sources = [[row - forward, col], [row, col - 1], [row, col + 1]];
  for (const [sr, sc] of sources) {
    if (!inBounds(sr, sc)) continue;
    if (board[sr][sc] === `${byColor}S`) return true;
  }
  return false;
}

export function isAttacked(board, row, col, byColor) {
  return generalAdvisorAttacks(board, row, col, byColor)
    || rookAttacks(board, row, col, byColor)
    || cannonAttacks(board, row, col, byColor)
    || horseAttacks(board, row, col, byColor)
    || elephantAttacks(board, row, col, byColor)
    || soldierAttacks(board, row, col, byColor);
}

export function findGeneral(board, color) {
  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < COLS; c += 1) {
      if (board[r][c] === `${color}G`) return [r, c];
    }
  }
  return null;
}

export function isInCheck(board, color) {
  const general = findGeneral(board, color);
  if (!general) return false;
  return isAttacked(board, general[0], general[1], color === 'h' ? 'c' : 'h');
}

export function applyMove(state, move) {
  const board = cloneBoard(state.board);
  const [fr, fc] = move.from;
  const [tr, tc] = move.to;
  const piece = board[fr][fc];
  board[fr][fc] = null;
  board[tr][tc] = piece;
  return { board, turn: state.turn === 'h' ? 'c' : 'h' };
}

function isMoveLegal(state, move) {
  const next = applyMove(state, move);
  return !isInCheck(next.board, state.turn);
}

export function generateLegalMoves(state) {
  return generatePseudoMoves(state).filter((move) => isMoveLegal(state, move));
}

export function gameStatus(state) {
  const moves = generateLegalMoves(state);
  const check = isInCheck(state.board, state.turn);
  if (moves.length === 0) return check ? 'checkmate' : 'no-moves';
  return check ? 'check' : 'ongoing';
}

function evaluateBoard(board) {
  let score = 0;
  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < COLS; c += 1) {
      const piece = board[r][c];
      if (!piece) continue;
      const value = PIECE_VALUES[pieceType(piece)];
      score += (pieceColor(piece) === 'h' ? 1 : -1) * value;
    }
  }
  return score;
}

function orderMoves(moves) {
  return [...moves].sort((a, b) => (b.captured ? PIECE_VALUES[pieceType(b.captured)] : 0) - (a.captured ? PIECE_VALUES[pieceType(a.captured)] : 0));
}

function minimax(state, depth, alpha, beta, maximizing) {
  const moves = generateLegalMoves(state);
  if (moves.length === 0) {
    if (isInCheck(state.board, state.turn)) return maximizing ? -1000000 - depth : 1000000 + depth;
    return maximizing ? -900000 - depth : 900000 + depth;
  }
  if (depth === 0) return evaluateBoard(state.board);

  const ordered = orderMoves(moves);
  if (maximizing) {
    let best = -Infinity;
    for (const move of ordered) {
      const value = minimax(applyMove(state, move), depth - 1, alpha, beta, false);
      best = Math.max(best, value);
      alpha = Math.max(alpha, value);
      if (beta <= alpha) break;
    }
    return best;
  }
  let best = Infinity;
  for (const move of ordered) {
    const value = minimax(applyMove(state, move), depth - 1, alpha, beta, true);
    best = Math.min(best, value);
    beta = Math.min(beta, value);
    if (beta <= alpha) break;
  }
  return best;
}

export const JANGGI_DIFFICULTIES = [
  { level: 1, label: '초급', depth: 1, randomTop: 6 },
  { level: 2, label: '쉬움', depth: 1, randomTop: 3 },
  { level: 3, label: '보통', depth: 2, randomTop: 2 },
  { level: 4, label: '어려움', depth: 2, randomTop: 1 },
  { level: 5, label: '매우 어려움', depth: 3, randomTop: 1 },
];

export function chooseAiMove(state, difficulty) {
  const config = JANGGI_DIFFICULTIES.find((item) => item.level === difficulty) || JANGGI_DIFFICULTIES[2];
  const moves = generateLegalMoves(state);
  if (!moves.length) return null;
  const maximizing = state.turn === 'h';
  const ordered = orderMoves(moves);
  const scored = ordered.map((move) => ({ move, value: minimax(applyMove(state, move), config.depth - 1, -Infinity, Infinity, !maximizing) }));
  scored.sort((a, b) => (maximizing ? b.value - a.value : a.value - b.value));
  const pool = scored.slice(0, Math.max(1, config.randomTop));
  const chosen = pool[Math.floor(Math.random() * pool.length)];
  return chosen.move;
}
