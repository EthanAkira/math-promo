'use client';

import { useLanguage } from '../language';
import { tr } from '../i18n';

const TOP = [
  { href: '/amc', icon: '🏆', ko: 'AMC 8/10/12 경시대회', en: 'AMC 8/10/12 Competitions', descKo: '미국 수학 경시대회 기출과 단원별 연습, 한국 교육과정 연계.', descEn: 'AMC past papers and unit practice, mapped to the Korean curriculum.' },
  { href: '/csat', icon: '📝', ko: '수능·평가원 15개 단원', en: 'CSAT 15 Units', descKo: '수능·평가원 기출 분석, 단원별 문제와 출제 예측.', descEn: 'CSAT past-exam analysis, unit practice and forecasts.' },
];

// Same eleven views as the curriculum explorer on the home page; each deep-links to its tab.
const CURRICULUM = [
  { tab: 'korea', ko: '한국 교육과정', en: 'Korean Curriculum', subKo: '초1~고3 학년별 및 2022 개정 과목별', subEn: 'Grades 1–12 and 2022 revised subjects' },
  { tab: 'courses', ko: '국제학교 과정', en: 'International School Courses', subKo: 'Pre-Algebra · Algebra 1·2 · Precalculus', subEn: 'Pre-Algebra · Algebra 1·2 · Precalculus' },
  { tab: 'domains', ko: '수학 영역별', en: 'By Math Domain', subKo: '수와 연산, 대수, 기하, 확률·통계 등 개념 지도', subEn: 'Number, algebra, geometry, probability & statistics concept map' },
  { tab: 'usa', ko: '미국 교육과정', en: 'United States', subKo: '미국 Common Core · Grade 1~12 / AP Calculus', subEn: 'Common Core · Grade 1–12 / AP Calculus' },
  { tab: 'uk', ko: '영국 교육과정', en: 'United Kingdom', subKo: '영국 Key Stage 1~5 · GCSE / A-Level', subEn: 'Key Stage 1–5 · GCSE / A-Level' },
  { tab: 'australia', ko: '호주 교육과정', en: 'Australia', subKo: '호주 Foundation~Year 12 · VCE / HSC', subEn: 'Foundation–Year 12 · VCE / HSC' },
  { tab: 'malaysia', ko: '말레이시아 교육과정', en: 'Malaysia', subKo: '말레이시아 KSSR · Form 1~5 / SPM', subEn: 'KSSR · Form 1–5 / SPM' },
  { tab: 'singapore', ko: '싱가포르 교육과정', en: 'Singapore', subKo: '싱가포르 Primary 1~6 · Secondary / O-Level', subEn: 'Primary 1–6 · Secondary / O-Level' },
  { tab: 'hongkong', ko: '홍콩 교육과정', en: 'Hong Kong', subKo: '홍콩 P1~P6 · S1~S6 / HKDSE', subEn: 'P1–P6 · S1–S6 / HKDSE' },
  { tab: 'india', ko: '인도 교육과정', en: 'India', subKo: '인도 CBSE Class 1~12', subEn: 'CBSE Class 1–12' },
  { tab: 'other', ko: '기타 국가 교육과정', en: 'Other Countries', subKo: '일본 · 대만 · 베트남 · 캐나다 · 뉴질랜드', subEn: 'Japan · Taiwan · Vietnam · Canada · New Zealand' },
];

const QUICK = [
  { href: '/elementary/practice', ko: '🧮 초등 사고력 연산', en: '🧮 Elementary Mental Math' },
  { href: '/middle-school/pre-algebra', ko: '📐 중등 Pre-Algebra', en: '📐 Pre-Algebra' },
  { href: '/middle-school/basic-figures', ko: '🔷 기본도형', en: '🔷 Basic Figures' },
];

const cardStyle = { display: 'block', padding: 18, border: '1px solid var(--paper-line)', borderRadius: 10, textDecoration: 'none', color: 'var(--ink)' };

export default function MathHub() {
  const { language } = useLanguage();
  const ko = language === 'ko';
  return <>
    <p className="no-print" style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 6 }}><a href="/">{tr(language, 'home')}</a> / {ko ? '수학 영역' : 'Mathematics'}</p>
    <h1 className="font-display" style={{ fontSize: 26, margin: '0 0 8px' }}>{ko ? '수학 영역' : 'Mathematics'}</h1>
    <p style={{ color: 'var(--ink-soft)', margin: '0 0 24px' }}>{ko ? '공부하고 싶은 과정을 선택하세요.' : 'Choose a course to study.'}</p>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
      {TOP.map((s) => <a key={s.href} href={s.href} style={cardStyle}>
        <div style={{ fontSize: 28 }}>{s.icon}</div>
        <div className="font-display" style={{ fontSize: 17, margin: '6px 0' }}>{ko ? s.ko : s.en}</div>
        <div style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6 }}>{ko ? s.descKo : s.descEn}</div>
      </a>)}
    </div>

    <a href="/premium/calculus1" style={{ ...cardStyle, marginTop: 14, borderColor: '#6d28d9', background: '#faf5ff' }}>
      <div className="font-display" style={{ fontSize: 17, fontWeight: 700 }}>📈 {ko ? '미적분 유형별 기출·응용 문제' : 'Calculus: Past-Exam & Applied Problems by Type'} <span style={{ fontSize: 12, background: '#6d28d9', color: '#fff', padding: '2px 9px', borderRadius: 999, marginLeft: 6 }}>{ko ? '유료' : 'Premium'}</span></div>
      <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 4, lineHeight: 1.6 }}>{ko ? '고2 수학Ⅱ · 고3 미적분 17개 유형 — 기본·기출·예상문제, 해설, 유사문제 생성기' : 'Seventeen calculus unit types — basic, past-exam and forecast problems with solutions and a similar-problem generator.'}</div>
    </a>

    <h2 className="font-display" style={{ fontSize: 20, margin: '36px 0 6px' }}>{ko ? '일반 교과 (교육과정별)' : 'General Curriculum'}</h2>
    <p style={{ color: 'var(--ink-soft)', margin: '0 0 14px', fontSize: 14 }}>{ko ? '나라·학교 과정별로 단원과 문제를 찾아봅니다.' : 'Browse units and problems by country or school system.'}</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
      {CURRICULUM.map((c, i) => <a key={c.tab} href={`/?curriculumTab=${c.tab}#curriculum-title`} style={{ ...cardStyle, padding: '14px 16px', ...(i === 0 ? { background: 'var(--chalk-green, #1b4d3e)', color: '#fff', borderColor: 'transparent' } : {}) }}>
        <div className="font-display" style={{ fontSize: 16, fontWeight: 700 }}>{ko ? c.ko : c.en}</div>
        <div style={{ fontSize: 12.5, marginTop: 4, lineHeight: 1.5, opacity: i === 0 ? 0.9 : 1, color: i === 0 ? '#fff' : 'var(--ink-soft)' }}>{ko ? c.subKo : c.subEn}</div>
      </a>)}
    </div>

    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 28 }}>
      {QUICK.map((q) => <a key={q.href} href={q.href} className="button button-secondary">{ko ? q.ko : q.en}</a>)}
    </div>
  </>;
}
