'use client';

import { SiteHeader, SiteFooter, TutorProfileDisclosure } from './components';
import { useLanguage } from './language';
import { tr } from './i18n';
import CurriculumExplorer from './CurriculumExplorer';
import { GAMES_COPY } from './games/gamesCopy';

export default function HomePage() {
  const { language } = useLanguage();
  const G = GAMES_COPY[language] || GAMES_COPY.en;

  return <><SiteHeader /><main style={{ maxWidth: 1040, margin: '0 auto', padding: '0 20px' }}>
    <section style={{ padding: '56px 0 8px' }}>
      <p className="font-mono" style={{ margin: 0, fontSize: 13, color: 'var(--red-pen)', fontWeight: 700 }}>{tr(language, 'dailyLab')}</p>
      <h1 className="font-display" style={{ margin: '10px 0 14px', fontSize: 'clamp(28px, 5vw, 40px)', lineHeight: 1.35, whiteSpace: 'pre-line' }}>{tr(language, 'heroTitle')}</h1>
      <p style={{ fontSize: 16, color: 'var(--ink-soft)', maxWidth: 760, lineHeight: 1.65 }}>{tr(language, 'heroDescription')}</p>
    </section>

    <CurriculumExplorer />

    <section id="archive" style={{ marginTop: 54, scrollMarginTop: 90 }}>
      <p className="font-mono" style={{ margin: 0, color: 'var(--red-pen)', fontSize: 12, fontWeight: 700 }}>EXAM ARCHIVE</p>
      <h2 className="font-display" style={{ margin: '10px 0 10px', fontSize: 25 }}>{tr(language, 'examArchives')}</h2>
      <p style={{ margin: '0 0 20px', color: 'var(--ink-soft)', maxWidth: 560 }}>{tr(language, 'examArchivesDesc')}</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <h3 style={{ margin: 0, fontSize: 16, color: 'var(--chalk-green)' }}>{tr(language, 'amcArchive')}</h3>
        <a href="/amc/admin" className="button button-secondary" style={{ textDecoration: 'none', fontSize: 13 }}>{tr(language, 'uploadMaterials')}</a>
      </div>
      <p style={{ margin: '0 0 14px', color: 'var(--ink-soft)', maxWidth: 560, fontSize: 14 }}>{tr(language, 'amcArchiveDesc')}</p>
      <div className="game-card-grid" style={{ marginBottom: 30 }}>
        <a href="/amc/8" className="game-card"><span className="game-card-icon">🥉</span><h2>AMC 8</h2><p>{tr(language, 'amc8Level')}</p></a>
        <a href="/amc/10" className="game-card"><span className="game-card-icon">🥈</span><h2>AMC 10</h2><p>{tr(language, 'amc10Level')}</p></a>
        <a href="/amc/12" className="game-card"><span className="game-card-icon">🥇</span><h2>AMC 12</h2><p>{tr(language, 'amc12Level')}</p></a>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <h3 style={{ margin: 0, fontSize: 16, color: 'var(--chalk-green)' }}>{tr(language, 'csatArchive')}</h3>
        <a href="/csat/admin" className="button button-secondary" style={{ textDecoration: 'none', fontSize: 13 }}>{tr(language, 'uploadMaterials')}</a>
      </div>
      <div className="game-card-grid">
        <a href="/csat/june" className="game-card"><span className="game-card-icon">🌱</span><h2>{tr(language, 'csatJune')}</h2><p>{tr(language, 'csatJuneDesc')}</p></a>
        <a href="/csat/sept" className="game-card"><span className="game-card-icon">🍂</span><h2>{tr(language, 'csatSept')}</h2><p>{tr(language, 'csatSeptDesc')}</p></a>
        <a href="/csat/nov" className="game-card"><span className="game-card-icon">🎓</span><h2>{tr(language, 'csatNov')}</h2><p>{tr(language, 'csatNovDesc')}</p></a>
      </div>
    </section>

    <section id="games" style={{ marginTop: 40, scrollMarginTop: 90 }}>
      <p className="font-mono" style={{ margin: '0 0 6px', color: 'var(--chalk-green)', fontSize: 12, fontWeight: 700 }}>REST CORNER</p>
      <h2 className="font-display" style={{ margin: '0 0 10px', fontSize: 25 }}>{G.title}</h2>
      <p style={{ margin: '0 0 16px', color: 'var(--ink-soft)', maxWidth: 560 }}>{G.description}</p>
      <div className="game-card-grid">
        <a href="/games/sudoku" className="game-card"><span className="game-card-icon">🔢</span><h2>{G.games.sudoku.title}</h2><p>{G.games.sudoku.desc}</p></a>
        <a href="/games/gomoku" className="game-card"><span className="game-card-icon">⚫</span><h2>{G.games.gomoku.title}</h2><p>{G.games.gomoku.desc}</p></a>
        <a href="/games/chess" className="game-card"><span className="game-card-icon">♞</span><h2>{G.games.chess.title}</h2><p>{G.games.chess.desc}</p></a>
        <a href="/games/yutnori" className="game-card"><span className="game-card-icon">🎲</span><h2>{G.games.yutnori.title}</h2><p>{G.games.yutnori.desc}</p></a>
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
