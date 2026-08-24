const KNIGHT_OFFSETS = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
const KING_OFFSETS = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
const ROOK_DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const BISHOP_DIRS = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
const QUEEN_DIRS = [...ROOK_DIRS, ...BISHOP_DIRS];

export const PIECE_VALUES = { P: 100, N: 320, B: 330, R: 500, Q: 900, K: 20000 };

export function inBounds(r, c) {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
}

export function pieceColor(piece) {
  return piece ? piece[0] : null;
}

export function pieceType(piece) {
  return piece ? piece[1] : null;
}

function cloneBoard(board) {
  return board.map((row) => [...row]);
}

export function initialBoard() {
  const back = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'];
  const board = Array.from({ length: 8 }, () => Array(8).fill(null));
  for (let c = 0; c < 8; c += 1) {
    board[0][c] = `b${back[c]}`;
    board[1][c] = 'bP';
    board[6][c] = 'wP';
    board[7][c] = `w${back[c]}`;
  }
  return board;
}

export function initialState() {
  return {
    board: initialBoard(),
    turn: 'w',
    castlingRights: { wK: true, wQ: true, bK: true, bQ: true },
    enPassant: null,
  };
}

function stepMoves(board, r, c, color, offsets, push) {
  for (const [dr, dc] of offsets) {
    const nr = r + dr; const nc = c + dc;
    if (!inBounds(nr, nc)) continue;
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

function pawnMoves(board, r, c, color, enPassant, push) {
  const piece = board[r][c];
  const dir = color === 'w' ? -1 : 1;
  const startRow = color === 'w' ? 6 : 1;
  const promoRow = color === 'w' ? 0 : 7;
  const oneR = r + dir;

  if (inBounds(oneR, c) && !board[oneR][c]) {
    push({ from: [r, c], to: [oneR, c], piece, captured: null, promotion: oneR === promoRow });
    const twoR = r + dir * 2;
    if (r === startRow && !board[twoR][c]) push({ from: [r, c], to: [twoR, c], piece, captured: null, doubleStep: true });
  }

  for (const dc of [-1, 1]) {
    const nc = c + dc;
    if (!inBounds(oneR, nc)) continue;
    const target = board[oneR][nc];
    if (target && pieceColor(target) !== color) {
      push({ from: [r, c], to: [oneR, nc], piece, captured: target, promotion: oneR === promoRow });
    } else if (!target && enPassant && enPassant[0] === oneR && enPassant[1] === nc) {
      push({ from: [r, c], to: [oneR, nc], piece, captured: board[r][nc], enPassantCapture: true });
    }
  }
}

export function isAttacked(board, row, col, byColor) {
  const pawnRow = byColor === 'w' ? row + 1 : row - 1;
  for (const dc of [-1, 1]) {
    if (inBounds(pawnRow, col + dc) && board[pawnRow][col + dc] === `${byColor}P`) return true;
  }
  for (const [dr, dc] of KNIGHT_OFFSETS) {
    const nr = row + dr; const nc = col + dc;
    if (inBounds(nr, nc) && board[nr][nc] === `${byColor}N`) return true;
  }
  for (const [dr, dc] of KING_OFFSETS) {
    const nr = row + dr; const nc = col + dc;
    if (inBounds(nr, nc) && board[nr][nc] === `${byColor}K`) return true;
  }
  for (const [dr, dc] of ROOK_DIRS) {
    let nr = row + dr; let nc = col + dc;
    while (inBounds(nr, nc)) {
      const target = board[nr][nc];
      if (target) {
        if (pieceColor(target) === byColor && (pieceType(target) === 'R' || pieceType(target) === 'Q')) return true;
        break;
      }
      nr += dr; nc += dc;
    }
  }
  for (const [dr, dc] of BISHOP_DIRS) {
    let nr = row + dr; let nc = col + dc;
    while (inBounds(nr, nc)) {
      const target = board[nr][nc];
      if (target) {
        if (pieceColor(target) === byColor && (pieceType(target) === 'B' || pieceType(target) === 'Q')) return true;
        break;
      }
      nr += dr; nc += dc;
    }
  }
  return false;
}

export function findKing(board, color) {
  for (let r = 0; r < 8; r += 1) {
    for (let c = 0; c < 8; c += 1) {
      if (board[r][c] === `${color}K`) return [r, c];
    }
  }
  return null;
}

export function isInCheck(board, color) {
  const king = findKing(board, color);
  if (!king) return false;
  return isAttacked(board, king[0], king[1], color === 'w' ? 'b' : 'w');
}

function addCastlingMoves(board, color, rights, push) {
  const row = color === 'w' ? 7 : 0;
  const opp = color === 'w' ? 'b' : 'w';
  if (board[row][4] !== `${color}K`) return;
  if (isAttacked(board, row, 4, opp)) return;

  if (rights[`${color}K`] && !board[row][5] && !board[row][6] && board[row][7] === `${color}R`) {
    if (!isAttacked(board, row, 5, opp) && !isAttacked(board, row, 6, opp)) {
      push({ from: [row, 4], to: [row, 6], piece: `${color}K`, captured: null, castle: 'K' });
    }
  }
  if (rights[`${color}Q`] && !board[row][3] && !board[row][2] && !board[row][1] && board[row][0] === `${color}R`) {
    if (!isAttacked(board, row, 3, opp) && !isAttacked(board, row, 2, opp)) {
      push({ from: [row, 4], to: [row, 2], piece: `${color}K`, captured: null, castle: 'Q' });
    }
  }
}

export function generatePseudoMoves(state) {
  const { board, turn, enPassant, castlingRights } = state;
  const moves = [];
  const push = (move) => moves.push(move);

  for (let r = 0; r < 8; r += 1) {
    for (let c = 0; c < 8; c += 1) {
      const piece = board[r][c];
      if (!piece || pieceColor(piece) !== turn) continue;
      const type = pieceType(piece);
      if (type === 'P') pawnMoves(board, r, c, turn, enPassant, push);
      else if (type === 'N') stepMoves(board, r, c, turn, KNIGHT_OFFSETS, push);
      else if (type === 'B') slideMoves(board, r, c, turn, BISHOP_DIRS, push);
      else if (type === 'R') slideMoves(board, r, c, turn, ROOK_DIRS, push);
      else if (type === 'Q') slideMoves(board, r, c, turn, QUEEN_DIRS, push);
      else if (type === 'K') stepMoves(board, r, c, turn, KING_OFFSETS, push);
    }
  }
  addCastlingMoves(board, turn, castlingRights, push);
  return moves;
}

export function applyMove(state, move) {
  const board = cloneBoard(state.board);
  const [fr, fc] = move.from;
  const [tr, tc] = move.to;
  const piece = board[fr][fc];
  board[fr][fc] = null;

  if (move.enPassantCapture) board[fr][tc] = null;

  board[tr][tc] = move.promotion ? piece[0] + (move.promoteTo || 'Q') : piece;

  if (move.castle === 'K') { board[fr][5] = board[fr][7]; board[fr][7] = null; }
  if (move.castle === 'Q') { board[fr][3] = board[fr][0]; board[fr][0] = null; }

  const rights = { ...state.castlingRights };
  const color = piece[0];
  if (pieceType(piece) === 'K') { rights[`${color}K`] = false; rights[`${color}Q`] = false; }
  if ((fr === 7 && fc === 0) || (tr === 7 && tc === 0)) rights.wQ = false;
  if ((fr === 7 && fc === 7) || (tr === 7 && tc === 7)) rights.wK = false;
  if ((fr === 0 && fc === 0) || (tr === 0 && tc === 0)) rights.bQ = false;
  if ((fr === 0 && fc === 7) || (tr === 0 && tc === 7)) rights.bK = false;

  const enPassant = move.doubleStep ? [(fr + tr) / 2, fc] : null;

  return { board, castlingRights: rights, enPassant, turn: color === 'w' ? 'b' : 'w' };
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
  if (moves.length === 0) return check ? 'checkmate' : 'stalemate';
  return check ? 'check' : 'ongoing';
}

function evaluateBoard(board) {
  let score = 0;
  for (let r = 0; r < 8; r += 1) {
    for (let c = 0; c < 8; c += 1) {
      const piece = board[r][c];
      if (!piece) continue;
      const value = PIECE_VALUES[pieceType(piece)];
      const centerBonus = pieceType(piece) !== 'K' ? (3 - Math.min(Math.abs(r - 3.5), Math.abs(r - 4.5))) + (3 - Math.min(Math.abs(c - 3.5), Math.abs(c - 4.5))) : 0;
      score += (pieceColor(piece) === 'w' ? 1 : -1) * (value + centerBonus);
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
    if (isInCheck(state.board, state.turn)) return maximizing ? -100000 - depth : 100000 + depth;
    return 0;
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

export const CHESS_DIFFICULTIES = [
  { level: 1, label: '초급', depth: 1, randomTop: 5 },
  { level: 2, label: '쉬움', depth: 1, randomTop: 2 },
  { level: 3, label: '보통', depth: 2, randomTop: 2 },
  { level: 4, label: '어려움', depth: 2, randomTop: 1 },
  { level: 5, label: '매우 어려움', depth: 3, randomTop: 1 },
];

export function chooseAiMove(state, difficulty) {
  const config = CHESS_DIFFICULTIES.find((item) => item.level === difficulty) || CHESS_DIFFICULTIES[2];
  const moves = generateLegalMoves(state);
  if (!moves.length) return null;
  const maximizing = state.turn === 'w';
  const ordered = orderMoves(moves);
  const scored = ordered.map((move) => ({ move, value: minimax(applyMove(state, move), config.depth - 1, -Infinity, Infinity, !maximizing) }));
  scored.sort((a, b) => (maximizing ? b.value - a.value : a.value - b.value));
  const pool = scored.slice(0, Math.max(1, config.randomTop));
  const chosen = pool[Math.floor(Math.random() * pool.length)];
  return { ...chosen.move, promoteTo: 'Q' };
}
