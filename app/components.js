'use client';

import { useState } from 'react';
import { useLanguage } from './language';
import { useAuth } from './auth';
import { LANGUAGES, tr } from './i18n';
import AuthModal from './components/AuthModal';

export function SiteHeader() {
  const { language, setLanguage } = useLanguage();
  const { user, status, logout } = useAuth();
  const [authMode, setAuthMode] = useState(null);

  return (
    <header className="site-header-academic">
      <div className="site-header-inner">
        <a href="/" className="site-brand-academic">
          <div className="brand-crest">
            <span className="crest-latin">DLL</span>
          </div>
          <div className="brand-text-wrap">
            <span className="brand-main font-display">매일 배움 연구소</span>
            <span className="brand-sub font-cinzel">DAILY LEARNING LAB</span>
          </div>
        </a>

        <nav className="site-nav-academic" aria-label="주요 메뉴">
          <a href="/#archive" className="nav-item">AMC</a>
          <a href="/csat.html" className="nav-item">{tr(language, 'navCsat')}</a>
          <a href="/coding" className="nav-item">{tr(language, 'navCoding')}</a>
          <a href="/notices" className="nav-item">{tr(language, 'navNotices')}</a>
          <a href="/contact" className="nav-item">{tr(language, 'navContact')}</a>
          <a href="/games.html" className="nav-item">{tr(language, 'restCorner')}</a>
          {user ? <a href="/dashboard" className="nav-item">{tr(language, 'authMyStats')}</a> : null}
        </nav>

        <div className="site-header-actions">
          <label className="language-picker-academic">
            <span className="sr-only">{tr(language, 'language')}</span>
            <select
              aria-label={tr(language, 'language')}
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
            >
              {LANGUAGES.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          {status === 'ready' ? (
            user ? (
              <div className="auth-header-actions">
                <span className="auth-header-name">{tr(language, 'authWelcome', { name: user.name })}</span>
                <button type="button" className="auth-header-btn" onClick={logout}>{tr(language, 'authLogout')}</button>
              </div>
            ) : (
              <div className="auth-header-actions">
                <button type="button" className="auth-header-btn" onClick={() => setAuthMode('login')}>{tr(language, 'authLogin')}</button>
                <button type="button" className="auth-header-btn auth-header-btn-primary" onClick={() => setAuthMode('signup')}>{tr(language, 'authSignup')}</button>
              </div>
            )
          ) : null}
        </div>
      </div>

      {authMode ? <AuthModal mode={authMode} onClose={() => setAuthMode(null)} /> : null}
    </header>
  );
}

export function TutorProfileDisclosure() {
  const { language } = useLanguage();
  return (
    <details className="profile-academic-card">
      <summary className="profile-summary">
        <div className="summary-left">
          <span className="summary-icon">🎓</span>
          <div>
            <strong className="summary-title font-display">{tr(language, 'aboutTutor')}</strong>
            <span className="summary-sub">{tr(language, 'lessons')}</span>
          </div>
        </div>
        <span className="summary-badge font-mono">Profile Details</span>
      </summary>

      <div className="profile-academic-body">
        <div className="profile-main-meta">
          <div className="profile-avatar-box">
            <span className="avatar-monogram font-cinzel">CK</span>
          </div>
          <div className="profile-heading-text">
            <span className="profile-role-tag font-mono">{tr(language, 'lessons')}</span>
            <h3 className="profile-name font-display">{tr(language, 'tutorName')}</h3>
            <p className="profile-degrees font-mono">{tr(language, 'degreeMech')}</p>
            {tr(language, 'degreeData') ? (
              <p className="profile-degrees font-mono">{tr(language, 'degreeData')}</p>
            ) : null}
          </div>
        </div>

        <div className="profile-narrative-box">
          <div className="narrative-section">
            <h4 className="narrative-label">Current Field & Experience</h4>
            <p className="narrative-text">{tr(language, 'tutorCurrent')}</p>
          </div>
          <div className="narrative-section" style={{ marginTop: 14 }}>
            <h4 className="narrative-label">Educational Philosophy</h4>
            <p className="narrative-text">{tr(language, 'tutorText')}</p>
          </div>
        </div>

        <div className="profile-footer-action">
          <a href="tel:01033470308" className="tutor-inquiry-btn">
            <span>📞</span> {tr(language, 'classInquiry')}
          </a>
        </div>
      </div>
    </details>
  );
}

export function TutorBanner() {
  return (
    <section style={{ maxWidth: 780, margin: '56px auto 0', padding: '0 20px' }}>
      <TutorProfileDisclosure />
    </section>
  );
}

export function SiteFooter() {
  const { language } = useLanguage();
  return (
    <footer className="site-footer-academic">
      <div className="footer-inner">
        <div className="footer-brand-section">
          <div className="footer-latin-motto font-cinzel">COGITO, ERGO SUM</div>
          <p className="footer-sub-motto">“나는 생각한다, 고로 존재한다” · 사유하는 수학, 깊이 있는 배움</p>
        </div>

        <nav className="footer-nav" aria-label="푸터 메뉴">
          <a href="/amc.html">AMC 8/10/12</a>
          <a href="/csat.html">{tr(language, 'navCsat')}</a>
          <a href="/coding">{tr(language, 'navCoding')}</a>
          <a href="/notices">{tr(language, 'navNotices')}</a>
          <a href="/contact">{tr(language, 'navContact')}</a>
          <a href="/games.html">{tr(language, 'restCorner')}</a>
        </nav>

        <div className="footer-divider-thin" />

        <div className="footer-bottom-info">
          <p className="footer-copy-text">
            © {new Date().getFullYear()} Daily Learning Lab (매일 배움 연구소) · All rights reserved.
          </p>
          <a
            href="https://www.instagram.com/algorythm_logarythm/"
            target="_blank"
            rel="noreferrer"
            className="footer-social-link font-mono"
          >
            Instagram · @algorythm_logarythm
          </a>
        </div>
      </div>
    </footer>
  );
}

