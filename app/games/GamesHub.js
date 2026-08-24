'use client';

import { useLanguage } from '../language';
import { GAMES_COPY } from './gamesCopy';

const ICONS = { sudoku: '🔢', gomoku: '⚫', chess: '♞', yutnori: '🎲' };
const ORDER = ['sudoku', 'gomoku', 'chess', 'yutnori'];

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
