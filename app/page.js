'use client';

import { SiteHeader, SiteFooter } from './components';
import { useLanguage } from './language';

const groups = [
  { ko: '초등', en: 'Elementary', topics: [
    ['1~6학년 연산', 'Grades 1–6 Practice', '/elementary/practice', true],
    ['4학년 큰 수·분수·소수', 'Grade 4: Large Numbers, Fractions & Decimals', '/elementary/practice?grade=4&unit=g4-large-multiply', true],
    ['5학년 약수·분수·소수', 'Grade 5: Factors, Fractions & Decimals', '/elementary/practice?grade=5&unit=g5-factors-multiples', true],
    ['6학년 나눗셈·비율', 'Grade 6: Division & Ratios', '/elementary/practice?grade=6&unit=g6-fraction-divide', true],
    ['도형·측정', 'Geometry & Measurement', '#', false],
  ]},
  { ko: '중등', en: 'Middle School', topics: [['정수와 유리수', 'Integers & Rational Numbers', '#', false], ['일차방정식', 'Linear Equations', '#', false], ['인수분해', 'Factoring', '#', false]] },
  { ko: '고등', en: 'High School', topics: [['이차함수', 'Quadratic Functions', '#', false], ['수열', 'Sequences', '#', false], ['지수·로그', 'Exponents & Logarithms', '#', false]] },
];

export default function HomePage() {
  const { language } = useLanguage();
  const en = language === 'en';
  return <><SiteHeader /><main style={{ maxWidth: 760, margin: '0 auto', padding: '0 20px' }}>
    <section style={{ padding: '56px 0 8px' }}>
      <p className="font-mono" style={{ margin: 0, fontSize: 13, color: 'var(--red-pen)', fontWeight: 700 }}>{en ? 'FREE · NO SIGN-UP REQUIRED' : '무료 · 회원가입 없이 바로 풀기'}</p>
      <h1 className="font-display" style={{ margin: '10px 0 14px', fontSize: 'clamp(28px, 5vw, 40px)', lineHeight: 1.35 }}>{en ? <>A fresh worksheet every day<br />for grades 1 through 6</> : <>매일 새 문제로 풀어보는<br />초등 1~6학년 수학 연습장</>}</h1>
      <p style={{ fontSize: 16, color: 'var(--ink-soft)', maxWidth: 600 }}>{en ? 'Generate a new randomized worksheet instantly. Solve on an iPad, print it, scan its QR code to reopen it, or create the matching answer key.' : '학년과 단원을 고르면 무작위 문제지가 즉시 생성됩니다. 아이패드에서 풀고, 인쇄하고, 전용 QR로 같은 문제지와 답지를 다시 열 수 있습니다.'}</p>
    </section>

    <section style={{ marginTop: 36 }}>{groups.map((group) => <div key={group.ko} style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: 14, color: 'var(--chalk-green)', marginBottom: 10 }}>{en ? group.en : group.ko}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 10 }}>{group.topics.map(([ko, english, href, ready]) => <a key={ko} href={href} aria-disabled={!ready} style={{ display: 'block', padding: 16, borderRadius: 'var(--radius)', background: ready ? 'var(--card-bg)' : 'transparent', border: '1px solid var(--paper-line)', boxShadow: ready ? 'var(--shadow)' : 'none', textDecoration: 'none', color: ready ? 'var(--ink)' : 'var(--ink-soft)', opacity: ready ? 1 : 0.55, pointerEvents: ready ? 'auto' : 'none', fontWeight: 600, fontSize: 15 }}>{en ? english : ko}{!ready && <span style={{ display: 'block', fontSize: 11, fontWeight: 500, marginTop: 4 }}>{en ? 'Coming soon' : '준비 중'}</span>}</a>)}</div>
    </div>)}</section>

    <section id="tutor" style={{ marginTop: 56, scrollMarginTop: 90 }}><div style={{ background: 'var(--card-bg)', border: '1px solid var(--paper-line)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', padding: 28 }}>
      <p style={{ margin: '0 0 6px', color: 'var(--red-pen)', fontWeight: 700 }}>{en ? '1:1 MATH TUTORING' : '1:1 수학 과외'}</p>
      <h2 className="font-display" style={{ fontSize: 24, margin: '0 0 12px' }}>{en ? 'Tutor: Kim Chae-hoon' : '가르치는 사람: 김채훈'}</h2>
      <p style={{ margin: '0 0 6px', color: 'var(--ink-soft)' }}>{en ? 'B.S. in Mechanical Engineering, Korea University' : '고려대학교 기계공학 학사'}</p>
      <p style={{ margin: '0 0 16px', color: 'var(--ink-soft)' }}>{en ? 'B.S. in Data Science (Statistics), Korea University' : '고려대학교 데이터 사이언스(통계학) 학사'}</p>
      <p style={{ margin: 0, color: 'var(--ink-soft)' }}>{en ? 'Practice data helps identify recurring mistakes, then lessons focus on the concepts and solution habits each student needs.' : '문제 풀이에서 반복되는 실수를 확인하고, 학생별로 필요한 개념과 풀이 습관을 중심으로 수업합니다.'}</p>
    </div></section>

    <section id="contact" style={{ margin: '32px 0 8px', scrollMarginTop: 90 }}><div style={{ border: '1px dashed var(--red-pen)', borderRadius: 'var(--radius)', padding: '22px 24px', textAlign: 'center' }}>
      <p style={{ margin: '0 0 10px', fontWeight: 600 }}>{en ? 'Tutoring inquiry with Kim Chae-hoon' : '김채훈 선생님 과외 상담'}</p>
      <a href="tel:01033470308" style={{ display: 'inline-block', fontSize: 16, fontWeight: 800, color: 'var(--card-bg)', background: 'var(--red-pen)', padding: '11px 22px', borderRadius: 8, textDecoration: 'none' }}>{en ? 'Call 010-3347-0308' : '010-3347-0308 전화 문의'}</a>
    </div></section>
  </main><SiteFooter /></>;
}
