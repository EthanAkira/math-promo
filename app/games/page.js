import { SiteFooter, SiteHeader } from '../components';

export const metadata = {
  title: '쉬어가는 코너 | 매일 배움 연구소',
  description: '스도쿠, 오목, 체스를 무료로 즐기는 쉬어가는 코너. 난이도를 골라 AI와 대결하거나 혼자 퍼즐을 풀어보세요.',
};

const GAMES = [
  { href: '/games/sudoku', icon: '🔢', title: '스도쿠', description: '난이도 4단계, 메모·힌트·자동 채점을 지원하는 9×9 스도쿠.' },
  { href: '/games/gomoku', icon: '⚫', title: '오목', description: 'AI 난이도 5단계, 흑/백 선택과 무르기를 지원하는 15×15 오목.' },
  { href: '/games/chess', icon: '♞', title: '체스', description: '캐슬링·앙파상·프로모션까지 지원하는 AI 대결 체스.' },
];

export default function GamesPage() {
  return <><SiteHeader /><main style={{ maxWidth: 760, margin: '0 auto', padding: '0 20px' }}>
    <section style={{ padding: '56px 0 8px' }}>
      <p className="font-mono" style={{ margin: 0, fontSize: 13, color: 'var(--red-pen)', fontWeight: 700 }}>REST CORNER</p>
      <h1 className="font-display" style={{ margin: '10px 0 14px', fontSize: 'clamp(28px, 5vw, 38px)' }}>쉬어가는 코너</h1>
      <p style={{ fontSize: 16, color: 'var(--ink-soft)', maxWidth: 560 }}>공부하다 잠깐 쉬어가는 무료 게임 코너입니다. 난이도를 고르고 AI와 대결하거나, 혼자 스도쿠를 풀어보세요.</p>
    </section>

    <section style={{ marginTop: 24, marginBottom: 60 }}>
      <div className="game-card-grid">
        {GAMES.map((game) => <a key={game.href} href={game.href} className="game-card">
          <span className="game-card-icon">{game.icon}</span>
          <h2>{game.title}</h2>
          <p>{game.description}</p>
        </a>)}
      </div>
    </section>
  </main><SiteFooter /></>;
}
