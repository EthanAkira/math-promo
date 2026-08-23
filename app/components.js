'use client';

import { useLanguage } from './language';

export function SiteHeader() {
  const { language, setLanguage } = useLanguage();
  const en = language === 'en';
  return <header style={{ borderBottom: '1px solid var(--paper-line)', background: 'rgba(244,242,236,0.9)', backdropFilter: 'blur(4px)', position: 'sticky', top: 0, zIndex: 10 }}>
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      <a href="/" className="font-display" style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)', textDecoration: 'none' }}>{en ? 'Daily Math ' : '매일 수학 '}<span style={{ color: 'var(--red-pen)' }}>{en ? 'Practice' : '연습장'}</span></a>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div role="group" aria-label="Language" style={{ display: 'flex', border: '1px solid var(--paper-line)', borderRadius: 999, padding: 2, background: 'var(--card-bg)' }}>
          {['ko', 'en'].map((item) => <button key={item} onClick={() => setLanguage(item)} aria-pressed={language === item} style={{ border: 0, borderRadius: 999, padding: '6px 9px', fontWeight: 700, cursor: 'pointer', background: language === item ? 'var(--ink)' : 'transparent', color: language === item ? 'white' : 'var(--ink-soft)' }}>{item === 'ko' ? '한국어' : 'EN'}</button>)}
        </div>
        <a href="tel:01033470308" style={{ fontSize: 14, fontWeight: 700, color: 'var(--card-bg)', background: 'var(--chalk-green)', padding: '9px 14px', borderRadius: 999, textDecoration: 'none', whiteSpace: 'nowrap' }}>{en ? 'Tutoring' : '과외 문의'}</a>
      </div>
    </div>
  </header>;
}

export function TutorBanner() {
  const { language } = useLanguage();
  const en = language === 'en';
  return <section style={{ maxWidth: 720, margin: '56px auto 0', padding: '0 20px' }}><div style={{ background: 'var(--chalk-green-soft)', border: '1px solid var(--chalk-green)', borderRadius: 'var(--radius)', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--chalk-green)' }}>{en ? 'When a concept still feels confusing' : '이 개념이 계속 헷갈린다면'}</p>
    <p style={{ margin: 0, fontSize: 16, color: 'var(--ink)' }}>{en ? 'I identify repeated error patterns and build a focused 1:1 practice plan.' : '반복해서 틀리는 오답 패턴을 확인하고 1:1 맞춤 연습 계획을 잡아드립니다.'}</p>
    <div><a href="tel:01033470308" style={{ display: 'inline-block', marginTop: 4, fontSize: 14, fontWeight: 700, color: 'var(--card-bg)', background: 'var(--red-pen)', padding: '10px 18px', borderRadius: 8, textDecoration: 'none' }}>{en ? 'Call 010-3347-0308 →' : '010-3347-0308 상담하기 →'}</a></div>
  </div></section>;
}

export function SiteFooter() {
  const { language } = useLanguage();
  return <footer style={{ marginTop: 64, borderTop: '1px solid var(--paper-line)', padding: '28px 20px 40px', textAlign: 'center', color: 'var(--ink-soft)', fontSize: 13 }}><p style={{ margin: 0 }}>{language === 'en' ? 'Daily Math Practice · Tutoring: Kim Chae-hoon · 010-3347-0308' : '매일 수학 연습장 · 과외 문의: 김채훈 · 010-3347-0308'}</p></footer>;
}
