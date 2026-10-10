'use client';

import { useLanguage } from '../language';
import { tr } from '../i18n';

const SECTIONS = [
  { href: '/amc', icon: '🏆', ko: 'AMC 8/10/12 경시대회', en: 'AMC 8/10/12 Competitions', descKo: '미국 수학 경시대회 기출과 단원별 연습, 한국 교육과정 연계.', descEn: 'AMC past papers and unit practice, mapped to the Korean curriculum.' },
  { href: '/csat', icon: '📝', ko: '수능·평가원 15개 단원', en: 'CSAT 15 Units', descKo: '수능·평가원 기출 분석, 단원별 문제와 출제 예측.', descEn: 'CSAT past-exam analysis, unit practice and forecasts.' },
  { href: '/middle-school/pre-algebra', icon: '📐', ko: '중등 Pre-Algebra & 기본도형', en: 'Middle School Pre-Algebra & Basic Figures', descKo: '정수·유리수, 일차식, 좌표평면부터 기본도형까지.', descEn: 'Integers, algebra basics, coordinate plane and basic figures.', extra: { href: '/middle-school/basic-figures', ko: '기본도형 바로가기', en: 'Go to Basic Figures' } },
  { href: '/elementary/practice', icon: '🧮', ko: '초등 사고력 연산', en: 'Elementary Mental Math', descKo: '초등 연산과 사고력 문제를 난이도별로 연습합니다.', descEn: 'Elementary arithmetic and reasoning practice by level.' },
];

export default function MathHub() {
  const { language } = useLanguage();
  const ko = language === 'ko';
  return <>
    <p className="no-print" style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 6 }}><a href="/">{tr(language, 'home')}</a> / {ko ? '수학 영역' : 'Mathematics'}</p>
    <h1 className="font-display" style={{ fontSize: 26, margin: '0 0 8px' }}>{ko ? '수학 영역' : 'Mathematics'}</h1>
    <p style={{ color: 'var(--ink-soft)', margin: '0 0 24px' }}>{ko ? '공부하고 싶은 과정을 선택하세요.' : 'Choose a course to study.'}</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
      {SECTIONS.map((s) => <div key={s.href} style={{ padding: 18, border: '1px solid var(--paper-line)', borderRadius: 10 }}>
        <a href={s.href} style={{ display: 'block', textDecoration: 'none', color: 'var(--ink)' }}>
          <div style={{ fontSize: 28 }}>{s.icon}</div>
          <div className="font-display" style={{ fontSize: 17, margin: '6px 0' }}>{ko ? s.ko : s.en}</div>
          <div style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6 }}>{ko ? s.descKo : s.descEn}</div>
        </a>
        {s.extra ? <a href={s.extra.href} className="button button-secondary" style={{ marginTop: 10, display: 'inline-block' }}>{ko ? s.extra.ko : s.extra.en}</a> : null}
      </div>)}
    </div>
  </>;
}
