'use client';

import { SiteHeader, SiteFooter, TutorProfileDisclosure } from './components';
import { useLanguage } from './language';
import { tr } from './i18n';
import CurriculumExplorer from './CurriculumExplorer';

const MIDDLE_1_TOPICS = [
  ['topicPrime', '/middle-school/prime-factorization', true],
  ['topicGcd', '/middle-school/gcd-lcm', true],
  ['topicInteger', '/middle-school/integers-rationals', true],
  ['topicRationalOps', '/middle-school/integers-rationals?unit=rational-operations-review', true],
  ['topicAlgebra', '/middle-school/algebra-basics.html?unit=expressions-review', true],
  ['topicEquation', '/middle-school/algebra-basics.html?unit=equations-review', true],
  ['topicCoordinate', '/middle-school/coordinate-plane', true],
  ['topicProportion', '/middle-school/proportion', true],
];

const ELEMENTARY_GRADES = [
  ['topicGrade1', '/elementary/practice?grade=1', true],
  ['topicGrade2', '/elementary/practice?grade=2', true],
  ['topicGrade3', '/elementary/practice?grade=3', true],
  ['topicGrade4', '/elementary/practice?grade=4&unit=g4-large-multiply', true],
  ['topicGrade5', '/elementary/practice?grade=5&unit=g5-factors-multiples', true],
  ['topicGrade6', '/elementary/practice?grade=6&unit=g6-fraction-divide', true],
];

// Default view: worksheets grouped by topic area, independent of grade or curriculum.
const topicGroups = [
  { key: 'elementary', topics: [['topicElementary', '/elementary/practice', true], ...ELEMENTARY_GRADES.slice(3), ['topicGeometry', '#', false]] },
  { key: 'middle', topics: [...MIDDLE_1_TOPICS, ['topicFactoring', '#', false]] },
  { key: 'high', topics: [['topicQuadratic', '#', false], ['topicSequences', '#', false], ['topicLogs', '#', false]] },
];

export default function HomePage() {
  const { language } = useLanguage();

  return <><SiteHeader /><main style={{ maxWidth: 1040, margin: '0 auto', padding: '0 20px' }}>
    <section style={{ padding: '56px 0 8px' }}>
      <p className="font-mono" style={{ margin: 0, fontSize: 13, color: 'var(--red-pen)', fontWeight: 700 }}>{tr(language, 'dailyLab')}</p>
      <h1 className="font-display" style={{ margin: '10px 0 14px', fontSize: 'clamp(28px, 5vw, 40px)', lineHeight: 1.35, whiteSpace: 'pre-line' }}>{tr(language, 'heroTitle')}</h1>
      <p style={{ fontSize: 16, color: 'var(--ink-soft)', maxWidth: 600 }}>{tr(language, 'heroDescription')}</p>
    </section>

    <CurriculumExplorer />

    <section style={{ marginTop: 54 }}>
      <p className="font-mono" style={{ margin: '0 0 6px', color: 'var(--red-pen)', fontSize: 12, fontWeight: 700 }}>QUICK PRACTICE</p>
      <h2 className="font-display" style={{ margin: '0 0 22px', fontSize: 25 }}>{language === 'ko' ? '빠른 문제 선택' : 'Quick practice'}</h2>
      {topicGroups.map((group) => <div key={group.key} style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 14, color: 'var(--chalk-green)', marginBottom: 10 }}>{tr(language, group.key)}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 10 }}>{group.topics.map(([key, href, ready]) => <a key={key} href={href} aria-disabled={!ready} style={{ display: 'block', padding: 16, borderRadius: 'var(--radius)', background: ready ? 'var(--card-bg)' : 'transparent', border: '1px solid var(--paper-line)', boxShadow: ready ? 'var(--shadow)' : 'none', textDecoration: 'none', color: ready ? 'var(--ink)' : 'var(--ink-soft)', opacity: ready ? 1 : 0.55, pointerEvents: ready ? 'auto' : 'none', fontWeight: 600, fontSize: 15 }}>{tr(language, key)}{!ready && <span style={{ display: 'block', fontSize: 11, fontWeight: 500, marginTop: 4 }}>{tr(language, 'comingSoon')}</span>}</a>)}</div>
      </div>)}
    </section>

    <section id="amc" style={{ marginTop: 40, scrollMarginTop: 90 }}>
      <p className="font-mono" style={{ margin: '0 0 6px', color: 'var(--red-pen)', fontSize: 12, fontWeight: 700 }}>AMC ARCHIVE</p>
      <h2 className="font-display" style={{ margin: '0 0 10px', fontSize: 25 }}>{language === 'ko' ? 'AMC 기출문제' : 'AMC Archive'}</h2>
      <p style={{ margin: '0 0 16px', color: 'var(--ink-soft)', maxWidth: 560 }}>{language === 'ko' ? 'AMC 8·10·12 기출문제를 연도별로 모아 미리보기와 다운로드를 제공합니다.' : 'AMC 8, 10, and 12 past exams by year, with preview and download.'}</p>
      <div className="game-card-grid">
        <a href="/amc/8" className="game-card"><span className="game-card-icon">🥉</span><h2>AMC 8</h2><p>{language === 'ko' ? '중학생 이하 대상' : 'Middle school and below'}</p></a>
        <a href="/amc/10" className="game-card"><span className="game-card-icon">🥈</span><h2>AMC 10</h2><p>{language === 'ko' ? '10학년 이하 대상 · A/B' : '10th grade and below · A/B'}</p></a>
        <a href="/amc/12" className="game-card"><span className="game-card-icon">🥇</span><h2>AMC 12</h2><p>{language === 'ko' ? '12학년 이하 대상 · A/B' : '12th grade and below · A/B'}</p></a>
      </div>
    </section>

    <section id="games" style={{ marginTop: 40, scrollMarginTop: 90 }}>
      <p className="font-mono" style={{ margin: '0 0 6px', color: 'var(--chalk-green)', fontSize: 12, fontWeight: 700 }}>REST CORNER</p>
      <h2 className="font-display" style={{ margin: '0 0 10px', fontSize: 25 }}>{language === 'ko' ? '쉬어가는 코너' : 'Rest Corner'}</h2>
      <p style={{ margin: '0 0 16px', color: 'var(--ink-soft)', maxWidth: 560 }}>{language === 'ko' ? '공부하다 잠깐 쉬어갈 수 있는 무료 게임입니다. 스도쿠, 오목, 체스를 AI와 함께 즐겨보세요.' : 'Free games for a short study break: Sudoku, Gomoku, and Chess against an AI.'}</p>
      <div className="game-card-grid">
        <a href="/games/sudoku" className="game-card"><span className="game-card-icon">🔢</span><h2>{language === 'ko' ? '스도쿠' : 'Sudoku'}</h2><p>{language === 'ko' ? '난이도 4단계 · 메모 · 힌트' : '4 difficulty levels, notes & hints'}</p></a>
        <a href="/games/gomoku" className="game-card"><span className="game-card-icon">⚫</span><h2>{language === 'ko' ? '오목' : 'Gomoku'}</h2><p>{language === 'ko' ? 'AI 난이도 5단계 · 무르기' : '5 AI levels, undo support'}</p></a>
        <a href="/games/chess" className="game-card"><span className="game-card-icon">♞</span><h2>{language === 'ko' ? '체스' : 'Chess'}</h2><p>{language === 'ko' ? '캐슬링 · 앙파상 · 프로모션' : 'Castling, en passant, promotion'}</p></a>
      </div>
    </section>

    <section id="tutor" style={{ marginTop: 56, scrollMarginTop: 90 }}><TutorProfileDisclosure /></section>

    <section id="contact" style={{ margin: '32px 0 8px', scrollMarginTop: 90 }}><div style={{ border: '1px dashed var(--red-pen)', borderRadius: 'var(--radius)', padding: '22px 24px', textAlign: 'center' }}>
      <p style={{ margin: '0 0 10px', fontWeight: 600 }}>{tr(language, 'aboutTutor')}</p>
      <a href="tel:01033470308" style={{ display: 'inline-block', fontSize: 16, fontWeight: 800, color: 'var(--card-bg)', background: 'var(--red-pen)', padding: '11px 22px', borderRadius: 8, textDecoration: 'none' }}>{tr(language, 'classInquiry')}</a>
    </div></section>

    <section id="instagram" style={{ margin: '32px 0 8px', scrollMarginTop: 90 }}><div className="social-card">
      <div className="social-card-copy">
        <p className="font-mono" style={{ margin: '0 0 6px', color: 'var(--red-pen)', fontSize: 12, fontWeight: 700 }}>MATH & CODING · INSTAGRAM</p>
        <h2 className="font-display" style={{ margin: '0 0 10px', fontSize: 23 }}>@algorythm_logarythm</h2>
        <a href="https://www.instagram.com/algorythm_logarythm?igsi=NXFsc25lcTFoaWdj&amp;utm_source=qr" target="_blank" rel="noreferrer" style={{ display: 'inline-block', color: 'var(--card-bg)', background: 'var(--ink)', padding: '10px 17px', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>Instagram →</a>
      </div>
      <a href="https://www.instagram.com/algorythm_logarythm?igsi=NXFsc25lcTFoaWdj&amp;utm_source=qr" target="_blank" rel="noreferrer" className="social-qr-link" aria-label="Instagram @algorythm_logarythm"><img src="/instagram-qr.jpg" alt="Instagram QR · @algorythm_logarythm" className="social-qr" /></a>
    </div></section>
  </main><SiteFooter /></>;
}
