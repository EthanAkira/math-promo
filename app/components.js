'use client';

import { useLanguage } from './language';

export function SiteHeader() {
  const { language, setLanguage } = useLanguage();
  return <header style={{ borderBottom: '1px solid var(--paper-line)', background: 'rgba(244,242,236,0.9)', backdropFilter: 'blur(4px)', position: 'sticky', top: 0, zIndex: 10 }}>
    <div className="site-header-inner">
      <a href="/" className="font-display site-brand">매일 배움 연구소 <span aria-hidden="true">|</span> <strong>Daily Learning Lab</strong></a>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div role="group" aria-label="Language" style={{ display: 'flex', border: '1px solid var(--paper-line)', borderRadius: 999, padding: 2, background: 'var(--card-bg)' }}>
          {['ko', 'en'].map((item) => <button key={item} onClick={() => setLanguage(item)} aria-pressed={language === item} style={{ border: 0, borderRadius: 999, padding: '6px 9px', fontWeight: 700, cursor: 'pointer', background: language === item ? 'var(--ink)' : 'transparent', color: language === item ? 'white' : 'var(--ink-soft)' }}>{item === 'ko' ? '한국어' : 'EN'}</button>)}
        </div>
      </div>
    </div>
  </header>;
}

export function TutorProfileDisclosure() {
  const { language } = useLanguage();
  const en = language === 'en';
  return <details className="profile-disclosure"><summary>{en ? 'About the operator & tutor' : '운영자 및 선생님 소개'}</summary><div className="profile-disclosure-body">
    <p style={{ margin: '0 0 6px', color: 'var(--red-pen)', fontWeight: 700 }}>{en ? '1:1 MATH LESSONS' : '1:1 수학 수업'}</p>
    <h2 className="font-display" style={{ fontSize: 23, margin: '0 0 12px' }}>{en ? 'Kim Chae-hoon' : '김채훈'}</h2>
    <p style={{ margin: '0 0 5px', color: 'var(--ink-soft)' }}>{en ? 'B.S. in Mechanical Engineering, Korea University' : '고려대학교 기계공학 학사'}</p>
    <p style={{ margin: '0 0 15px', color: 'var(--ink-soft)' }}>{en ? 'B.S. in Data Science (Statistics), Korea University' : '고려대학교 데이터 사이언스(통계학) 학사'}</p>
    <p style={{ margin: '0 0 16px', color: 'var(--ink-soft)' }}>{en ? 'Lessons identify recurring mistakes and focus on the concepts and solution habits each student needs.' : '문제 풀이에서 반복되는 실수를 확인하고, 학생별로 필요한 개념과 풀이 습관을 중심으로 수업합니다.'}</p>
    <a href="tel:01033470308" style={{ display: 'inline-block', fontSize: 14, fontWeight: 700, color: 'var(--card-bg)', background: 'var(--red-pen)', padding: '10px 18px', borderRadius: 8, textDecoration: 'none' }}>{en ? 'Class inquiry · 010-3347-0308' : '수업 문의 · 010-3347-0308'}</a>
  </div></details>;
}

export function TutorBanner() {
  return <section style={{ maxWidth: 720, margin: '56px auto 0', padding: '0 20px' }}><TutorProfileDisclosure /></section>;
}

export function SiteFooter() {
  const { language } = useLanguage();
  const en = language === 'en';
  return <footer style={{ marginTop: 64, borderTop: '1px solid var(--paper-line)', padding: '28px 20px 40px', textAlign: 'center', color: 'var(--ink-soft)', fontSize: 13 }}><p style={{ margin: 0 }}>{en ? 'Daily Learning Lab · Class inquiry: Kim Chae-hoon · 010-3347-0308' : '매일 배움 연구소 · 수업 문의: 김채훈 · 010-3347-0308'}</p><a href="https://www.instagram.com/algorythm_logarythm/" target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: 8, color: 'var(--red-pen)', fontWeight: 700, textDecoration: 'none' }}>Instagram · @algorythm_logarythm</a></footer>;
}
