import { SiteFooter, SiteHeader } from '../components';

export const metadata = {
  title: '대학수학능력시험 기출문제 | 매일 배움 연구소',
  description: '수능 수학 6월 모의고사, 9월 모의고사, 수능 기출문제를 연도별로 확인하고 다운로드하세요.',
};

const EXAM_TYPES = [
  { href: '/csat/june', icon: '🌱', title: '6월 모의고사', description: '고3 전국연합학력평가 · 매년 6월 시행' },
  { href: '/csat/sept', icon: '🍂', title: '9월 모의고사', description: '고3 전국연합학력평가 · 매년 9월 시행' },
  { href: '/csat/nov', icon: '🎓', title: '대학수학능력시험', description: '매년 11월 시행 · 본수능' },
];

export default function CsatHubPage() {
  return <><SiteHeader /><main style={{ maxWidth: 760, margin: '0 auto', padding: '0 20px' }}>
    <section style={{ padding: '56px 0 8px' }}>
      <p className="font-mono" style={{ margin: 0, fontSize: 13, color: 'var(--red-pen)', fontWeight: 700 }}>CSAT ARCHIVE</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <h1 className="font-display" style={{ margin: '10px 0 14px', fontSize: 'clamp(28px, 5vw, 38px)' }}>수능 기출문제</h1>
        <a href="/csat/admin" className="button button-primary" style={{ textDecoration: 'none', marginTop: 10 }}>자료 업로드</a>
      </div>
      <p style={{ fontSize: 16, color: 'var(--ink-soft)', maxWidth: 560 }}>수능 수학 6월·9월 모의고사와 11월 수능 기출문제를 연도별로 모아 미리보기와 다운로드를 제공합니다.</p>
    </section>

    <section style={{ marginTop: 24, marginBottom: 60 }}>
      <div className="game-card-grid">
        {EXAM_TYPES.map((item) => <a key={item.href} href={item.href} className="game-card">
          <span className="game-card-icon">{item.icon}</span>
          <h2>{item.title}</h2>
          <p>{item.description}</p>
        </a>)}
      </div>
    </section>
  </main><SiteFooter /></>;
}
