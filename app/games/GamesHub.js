'use client';

import { useLanguage } from '../language';
import { GAMES_COPY } from './gamesCopy';

function YutIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <defs>
        <linearGradient id="hubYutBack" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3b1d0e" />
          <stop offset="45%" stopColor="#8c5529" />
          <stop offset="100%" stopColor="#2e1408" />
        </linearGradient>
        <linearGradient id="hubYutFront" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#cfae70" />
          <stop offset="45%" stopColor="#fff8eb" />
          <stop offset="100%" stopColor="#bf9954" />
        </linearGradient>
      </defs>
      {/* Stick 1 (curved bark, rotated left) */}
      <rect x="13" y="2" width="6" height="28" rx="3" fill="url(#hubYutBack)" stroke="#261005" strokeWidth="0.8" transform="rotate(-25 16 16)" />
      {/* Stick 2 (flat belly, rotated right) */}
      <g transform="rotate(25 16 16)">
        <rect x="13" y="2" width="6" height="28" rx="3" fill="url(#hubYutFront)" stroke="#805d26" strokeWidth="0.8" />
        <circle cx="16" cy="8" r="1.1" fill="#3b1d0e" />
        <text x="16" y="18" textAnchor="middle" fill="#b8261c" fontSize="6.5" fontFamily="'Song Myung', serif" fontWeight="900">✕</text>
        <circle cx="16" cy="24" r="1.1" fill="#3b1d0e" />
      </g>
    </svg>
  );
}

const ICONS = { sudoku: '🔢', gomoku: '⚫', chess: '♞', yutnori: <YutIcon />, janggi: '象' };
const ORDER = ['sudoku', 'gomoku', 'chess', 'yutnori', 'janggi'];

export default function GamesHub() {
  const { language } = useLanguage();
  const G = GAMES_COPY[language] || GAMES_COPY.en;

  return <>
    <section style={{ padding: '56px 0 8px' }}>
      <p className="font-mono" style={{ margin: 0, fontSize: 13, color: 'var(--red-pen)', fontWeight: 700 }}>REST CORNER</p>
      <h1 className="font-display" style={{ margin: '10px 0 14px', fontSize: 'clamp(28px, 5vw, 38px)' }}>{G.title}</h1>
      <p style={{ fontSize: 16, color: 'var(--ink-soft)', maxWidth: 560 }}>{G.description}</p>
    </section>

    <section style={{ marginTop: 24, marginBottom: 60 }}>
      <div className="game-card-grid">
        {ORDER.map((key) => <a key={key} href={`/games/${key}`} className="game-card">
          <span className="game-card-icon">{ICONS[key]}</span>
          <h2>{G.games[key].title}</h2>
          <p>{G.games[key].desc}</p>
        </a>)}
      </div>
    </section>
  </>;
}
