import { SiteFooter, SiteHeader } from '../components';

export const metadata = {
  title: '대학수학능력시험 기출문제 | 매일 배움 연구소',
  description: '수능 수학 6월 모의고사, 9월 모의고사, 수능 기출문제를 연도별로 확인하고 다운로드하세요.',
};

const EXAM_TYPES = [
  { href: '/csat/forecast', icon: '🔮', title: '수능 출제분석 & 출제 예측실', description: '최근 5개년 빈도 통계 · 72대 세부유형 사전 기반 이번 년도 출제 예측 및 기출예상·유사문제 생성' },
  { href: '/csat/units', icon: '📝', title: '단원별 기출·기본 문제', description: '공통수학1·2(상·하) 기본 748문항 및 수능·모의고사 단원별 문제은행' },
  { href: '/csat/june', icon: '🌱', title: '6월 모의고사', description: '고3 전국연합학력평가 · 매년 6월 시행' },
  { href: '/csat/sept', icon: '🍂', title: '9월 모의고사', description: '고3 전국연합학력평가 · 매년 9월 시행' },
  { href: '/csat/nov', icon: '🎓', title: '대학수학능력시험', description: '매년 11월 시행 · 본수능' },
  { href: '/csat/city-mock', icon: '🏫', title: '시교육청 학력평가', description: '서울·경기·인천 등 시·도교육청 주관 학력평가' },
  { href: '/csat/grade1', icon: '1️⃣', title: '고1 전국연합학력평가', description: '시·도교육청 주관 · 공통수학1·2(상·하) 기본 748문항 수록' },
  { href: '/csat/grade2', icon: '2️⃣', title: '고2 전국연합학력평가', description: '시·도교육청 주관 · 매년 6월·9월 시행' },
];

export default function CsatHubPage() {
  return <><SiteHeader /><main style={{ maxWidth: 760, margin: '0 auto', padding: '0 20px' }}>
    <section style={{ padding: '56px 0 8px' }}>
      <p className="font-mono" style={{ margin: 0, fontSize: 13, color: 'var(--red-pen)', fontWeight: 700 }}>CSAT ARCHIVE & FORECAST</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <h1 className="font-display" style={{ margin: '10px 0 14px', fontSize: 'clamp(28px, 5vw, 38px)' }}>수능 기출문제</h1>
        <div style={{ display: 'flex', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
          <a href="/csat/forecast" className="button button-primary" style={{ textDecoration: 'none', background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)' }}>🔮 이번 년도 출제 예측</a>
          <a href="/csat/units" className="button button-secondary" style={{ textDecoration: 'none' }}>단원별로 보기</a>
          <a href="/csat/admin" className="button button-secondary" style={{ textDecoration: 'none' }}>자료 업로드</a>
        </div>
      </div>
      <p style={{ fontSize: 16, color: 'var(--ink-soft)', maxWidth: 560 }}>수능 수학 6월·9월 모의고사와 11월 수능 기출문제를 연도별로 모아 미리보기와 다운로드를 제공합니다.</p>
    </section>

    {/* Featured Banner for CSAT Forecast & Analysis */}
    <section style={{ margin: '18px 0 24px' }}>
      <a
        href="/csat/forecast"
        style={{
          display: 'block',
          textDecoration: 'none',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          border: '1.5px solid #334155',
          borderRadius: 14,
          padding: '20px 24px',
          color: '#ffffff',
          boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 700, background: '#2563eb', color: '#ffffff', padding: '2px 8px', borderRadius: 4 }}>
            NEW · 출제분석 DB 확장판 탑재
          </span>
          <span style={{ fontSize: 13, color: '#93c5fd', fontWeight: 600 }}>
            분석실 바로가기 →
          </span>
        </div>
        <h2 style={{ fontSize: 19, fontWeight: 700, margin: '0 0 6px', color: '#ffffff' }}>
          🔮 2026/2027 수능 수학 출제 예측 및 기출예상·유사문제 생성실
        </h2>
        <p style={{ fontSize: 14, color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
          최근 5개년 출제 빈도율 100% 통계와 72대 세부유형 사전, 킬러/준킬러 복합개념 분석을 바탕으로 이번 년도 출제 예상 문항과 유사 변형 문제를 실시간으로 확인하고 풀어보세요.
        </p>
      </a>
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
