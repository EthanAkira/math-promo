'use client';

import { SiteHeader, SiteFooter, TutorProfileDisclosure } from './components';
import { useLanguage } from './language';

const groups = [
  { ko: '초등', en: 'Elementary', topics: [
    ['1~6학년 연산', 'Grades 1–6 Practice', '/elementary/practice', true],
    ['4학년 큰 수·분수·소수', 'Grade 4: Large Numbers, Fractions & Decimals', '/elementary/practice?grade=4&unit=g4-large-multiply', true],
    ['5학년 약수·분수·소수', 'Grade 5: Factors, Fractions & Decimals', '/elementary/practice?grade=5&unit=g5-factors-multiples', true],
    ['6학년 나눗셈·비율', 'Grade 6: Division & Ratios', '/elementary/practice?grade=6&unit=g6-fraction-divide', true],
    ['도형·측정', 'Geometry & Measurement', '#', false],
  ]},
  { ko: '중등', en: 'Middle School', topics: [['소수와 소인수분해', 'Primes & Prime Factorization', '/middle-school/prime-factorization', true], ['정수와 유리수', 'Integers & Rational Numbers', '#', false], ['일차방정식', 'Linear Equations', '#', false], ['인수분해', 'Factoring', '#', false]] },
  { ko: '고등', en: 'High School', topics: [['이차함수', 'Quadratic Functions', '#', false], ['수열', 'Sequences', '#', false], ['지수·로그', 'Exponents & Logarithms', '#', false]] },
];

export default function HomePage() {
  const { language } = useLanguage();
  const en = language === 'en';
  return <><SiteHeader /><main style={{ maxWidth: 760, margin: '0 auto', padding: '0 20px' }}>
    <section style={{ padding: '56px 0 8px' }}>
      <p className="font-mono" style={{ margin: 0, fontSize: 13, color: 'var(--red-pen)', fontWeight: 700 }}>{en ? 'DAILY LEARNING LAB' : '매일 배움 연구소'}</p>
      <h1 className="font-display" style={{ margin: '10px 0 14px', fontSize: 'clamp(28px, 5vw, 40px)', lineHeight: 1.35 }}>{en ? <>From math to coding,<br />a place to grow every day</> : <>수학부터 코딩까지,<br />매일 성장하는 학습 공간</>}</h1>
      <p style={{ fontSize: 16, color: 'var(--ink-soft)', maxWidth: 600 }}>{en ? 'Start with free randomized math worksheets for grades 1–6. More subjects, coding practice, and detailed lessons will be added step by step.' : '지금은 초등 1~6학년 무작위 수학 문제지를 무료로 제공합니다. 다른 과목과 코딩 실습, 자세한 풀이 콘텐츠도 차례로 추가됩니다.'}</p>
    </section>

    <section style={{ marginTop: 36 }}>{groups.map((group) => <div key={group.ko} style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: 14, color: 'var(--chalk-green)', marginBottom: 10 }}>{en ? group.en : group.ko}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 10 }}>{group.topics.map(([ko, english, href, ready]) => <a key={ko} href={href} aria-disabled={!ready} style={{ display: 'block', padding: 16, borderRadius: 'var(--radius)', background: ready ? 'var(--card-bg)' : 'transparent', border: '1px solid var(--paper-line)', boxShadow: ready ? 'var(--shadow)' : 'none', textDecoration: 'none', color: ready ? 'var(--ink)' : 'var(--ink-soft)', opacity: ready ? 1 : 0.55, pointerEvents: ready ? 'auto' : 'none', fontWeight: 600, fontSize: 15 }}>{en ? english : ko}{!ready && <span style={{ display: 'block', fontSize: 11, fontWeight: 500, marginTop: 4 }}>{en ? 'Coming soon' : '준비 중'}</span>}</a>)}</div>
    </div>)}</section>

    <section id="tutor" style={{ marginTop: 56, scrollMarginTop: 90 }}><TutorProfileDisclosure /></section>

    <section id="contact" style={{ margin: '32px 0 8px', scrollMarginTop: 90 }}><div style={{ border: '1px dashed var(--red-pen)', borderRadius: 'var(--radius)', padding: '22px 24px', textAlign: 'center' }}>
      <p style={{ margin: '0 0 10px', fontWeight: 600 }}>{en ? 'Class inquiry with Kim Chae-hoon' : '김채훈 선생님 수업 문의'}</p>
      <a href="tel:01033470308" style={{ display: 'inline-block', fontSize: 16, fontWeight: 800, color: 'var(--card-bg)', background: 'var(--red-pen)', padding: '11px 22px', borderRadius: 8, textDecoration: 'none' }}>{en ? 'Class inquiry · 010-3347-0308' : '수업 문의 · 010-3347-0308'}</a>
    </div></section>

    <section id="instagram" style={{ margin: '32px 0 8px', scrollMarginTop: 90 }}><div className="social-card">
      <div className="social-card-copy">
        <p className="font-mono" style={{ margin: '0 0 6px', color: 'var(--red-pen)', fontSize: 12, fontWeight: 700 }}>{en ? 'MATH & CODING ON INSTAGRAM' : '수학·코딩 인스타그램'}</p>
        <h2 className="font-display" style={{ margin: '0 0 10px', fontSize: 23 }}>@algorythm_logarythm</h2>
        <p style={{ margin: '0 0 18px', color: 'var(--ink-soft)' }}>{en ? 'Follow along for math explanations, coding records, and new learning content.' : '수학 풀이와 코딩 기록, 새로 올라오는 학습 콘텐츠를 인스타그램에서도 확인하세요.'}</p>
        <a href="https://www.instagram.com/algorythm_logarythm?igsi=NXFsc25lcTFoaWdj&amp;utm_source=qr" target="_blank" rel="noreferrer" style={{ display: 'inline-block', color: 'var(--card-bg)', background: 'var(--ink)', padding: '10px 17px', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>{en ? 'Open Instagram →' : '인스타그램 바로가기 →'}</a>
      </div>
      <a href="https://www.instagram.com/algorythm_logarythm?igsi=NXFsc25lcTFoaWdj&amp;utm_source=qr" target="_blank" rel="noreferrer" className="social-qr-link" aria-label={en ? 'Open @algorythm_logarythm on Instagram' : '인스타그램 @algorythm_logarythm 열기'}><img src="/instagram-qr.jpg" alt={en ? 'Instagram QR code for @algorythm_logarythm' : '인스타그램 @algorythm_logarythm QR 코드'} className="social-qr" /></a>
    </div></section>
  </main><SiteFooter /></>;
}
