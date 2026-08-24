import { SiteFooter, SiteHeader } from '../components';

export const metadata = {
  title: 'AMC 기출문제 | 매일 배움 연구소',
  description: 'AMC 8, AMC 10, AMC 12 기출문제와 해설, 정답을 연도별로 확인하고 다운로드하세요.',
};

const LEVELS = [
  { href: '/amc/8', icon: '🥉', title: 'AMC 8', description: '중학생 이하 대상 · 25문항 · 40분' },
  { href: '/amc/10', icon: '🥈', title: 'AMC 10', description: '10학년 이하 대상 · 25문항 · 75분 · A/B' },
  { href: '/amc/12', icon: '🥇', title: 'AMC 12', description: '12학년 이하 대상 · 25문항 · 75분 · A/B' },
];

export default function AmcHubPage() {
  return <><SiteHeader /><main style={{ maxWidth: 760, margin: '0 auto', padding: '0 20px' }}>
    <section style={{ padding: '56px 0 8px' }}>
      <p className="font-mono" style={{ margin: 0, fontSize: 13, color: 'var(--red-pen)', fontWeight: 700 }}>AMC ARCHIVE</p>
      <h1 className="font-display" style={{ margin: '10px 0 14px', fontSize: 'clamp(28px, 5vw, 38px)' }}>AMC 기출문제</h1>
      <p style={{ fontSize: 16, color: 'var(--ink-soft)', maxWidth: 560 }}>AMC 8·10·12 기출문제를 연도별로 모아 미리보기와 다운로드를 제공합니다.</p>
    </section>

    <section style={{ marginTop: 24, marginBottom: 60 }}>
      <div className="game-card-grid">
        {LEVELS.map((level) => <a key={level.href} href={level.href} className="game-card">
          <span className="game-card-icon">{level.icon}</span>
          <h2>{level.title}</h2>
          <p>{level.description}</p>
        </a>)}
      </div>
    </section>
  </main><SiteFooter /></>;
}
