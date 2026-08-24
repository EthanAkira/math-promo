'use client';

import { useLanguage } from './language';
import { LANGUAGES, tr } from './i18n';

export function SiteHeader() {
  const { language, setLanguage } = useLanguage();
  return <header style={{ borderBottom: '1px solid var(--paper-line)', background: 'rgba(244,242,236,0.9)', backdropFilter: 'blur(4px)', position: 'sticky', top: 0, zIndex: 10 }}>
    <div className="site-header-inner">
      <a href="/" className="font-display site-brand">매일 배움 연구소 <span aria-hidden="true">|</span> <strong>Daily Learning Lab</strong></a>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <label className="language-picker"><span className="sr-only">{tr(language, 'language')}</span><select aria-label={tr(language, 'language')} value={language} onChange={(event) => setLanguage(event.target.value)}>{LANGUAGES.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}</select></label>
      </div>
    </div>
  </header>;
}

export function TutorProfileDisclosure() {
  const { language } = useLanguage();
  return <details className="profile-disclosure"><summary>{tr(language, 'aboutTutor')}</summary><div className="profile-disclosure-body">
    <p style={{ margin: '0 0 6px', color: 'var(--red-pen)', fontWeight: 700 }}>{tr(language, 'lessons')}</p>
    <h2 className="font-display" style={{ fontSize: 23, margin: '0 0 12px' }}>{tr(language, 'tutorName')}</h2>
    <p style={{ margin: '0 0 5px', color: 'var(--ink-soft)' }}>{tr(language, 'degreeMech')}</p>
    <p style={{ margin: '0 0 15px', color: 'var(--ink-soft)' }}>{tr(language, 'degreeData')}</p>
    <p style={{ margin: '0 0 15px', color: 'var(--ink-soft)' }}>{tr(language, 'tutorCurrent')}</p>
    <p style={{ margin: '0 0 16px', color: 'var(--ink-soft)' }}>{tr(language, 'tutorText')}</p>
    <a href="tel:01033470308" style={{ display: 'inline-block', fontSize: 14, fontWeight: 700, color: 'var(--card-bg)', background: 'var(--red-pen)', padding: '10px 18px', borderRadius: 8, textDecoration: 'none' }}>{tr(language, 'classInquiry')}</a>
  </div></details>;
}

export function TutorBanner() {
  return <section style={{ maxWidth: 720, margin: '56px auto 0', padding: '0 20px' }}><TutorProfileDisclosure /></section>;
}

export function SiteFooter() {
  const { language } = useLanguage();
  return <footer style={{ marginTop: 64, borderTop: '1px solid var(--paper-line)', padding: '28px 20px 40px', textAlign: 'center', color: 'var(--ink-soft)', fontSize: 13 }}>
    <p style={{ margin: 0 }}>{tr(language, 'dailyLab')} · {tr(language, 'classInquiry')}</p>
    <nav style={{ marginTop: 10, display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
      <a href="/notices" style={{ color: 'var(--ink-soft)', textDecoration: 'none', fontWeight: 700 }}>{tr(language, 'navNotices')}</a>
      <a href="/contact" style={{ color: 'var(--ink-soft)', textDecoration: 'none', fontWeight: 700 }}>{tr(language, 'navContact')}</a>
      <a href="/games.html" style={{ color: 'var(--ink-soft)', textDecoration: 'none', fontWeight: 700 }}>{language === 'ko' ? '쉬어가는 코너' : 'Rest Corner'}</a>
    </nav>
    <a href="https://www.instagram.com/algorythm_logarythm/" target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: 12, color: 'var(--red-pen)', fontWeight: 700, textDecoration: 'none' }}>Instagram · @algorythm_logarythm</a>
  </footer>;
}
