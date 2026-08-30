'use client';

import { useLanguage } from './language';
import { tr } from './i18n';

export default function DescartesHero() {
  const { language } = useLanguage();

  return (
    <section className="descartes-hero-section" aria-label="데카르트 사유의 철학 및 수학적 기초">
      {/* Upper Philosophical Quote Banner */}
      <div className="descartes-quote-banner">
        <div className="descartes-banner-top">
          <div className="descartes-eyebrow-tag">
            <span className="emblem-star">✦</span>
            <span>{tr(language, 'descartesEyebrow')}</span>
            <span className="emblem-star">✦</span>
          </div>
          <div className="descartes-heritage-tags">
            <span className="heritage-badge">{tr(language, 'descartesBadgeCoord')}</span>
            <span className="heritage-badge gold">{tr(language, 'descartesBadgeMethod')}</span>
          </div>
        </div>

        <div className="descartes-hero-main-grid">
          {/* Left / Top: Portrait & Identity Plate */}
          <div className="descartes-portrait-column">
            <div className="descartes-frame-outer">
              <div className="descartes-frame-inner">
                <img
                  src="/descartes.jpg"
                  alt="René Descartes Portrait (Frans Hals workshop, Musée du Louvre)"
                  className="descartes-image"
                />
                <div className="descartes-vignette" />
              </div>
              <div className="descartes-frame-plaque">
                <strong className="plaque-name">{tr(language, 'descartesAuthorName')}</strong>
                <span className="plaque-lifespan">{tr(language, 'descartesAuthorLifespan')}</span>
                <span className="plaque-role">{tr(language, 'descartesAuthorRole')}</span>
              </div>
            </div>
          </div>

          {/* Right / Body: The Great Latin Maxim & Explanation */}
          <div className="descartes-content-column">
            <div className="descartes-quote-card">
              <div className="latin-quote-header">
                <span className="quote-mark-open">“</span>
                <h1 className="latin-maxim font-cinzel">
                  {tr(language, 'descartesQuoteLatin')}
                </h1>
                <span className="quote-mark-close">”</span>
              </div>

              <div className="quote-translation-bar">
                <h2 className="quote-meaning-ko font-display">
                  {tr(language, 'descartesQuoteTranslation')}
                </h2>
                <span className="quote-french">
                  ({tr(language, 'descartesQuoteFrench')}, 1637)
                </span>
              </div>

              <div className="descartes-narrative">
                <h3 className="narrative-heading">
                  <span className="gold-bullet">◈</span> {tr(language, 'descartesOriginHeading')}
                </h3>
                <p className="narrative-lead">
                  {tr(language, 'descartesMeaningLead')}
                </p>
                <p className="narrative-math">
                  {tr(language, 'descartesMathLead')}
                </p>
                <div className="philosophy-manifesto">
                  <span className="manifesto-icon">🏛️</span>
                  <p>{tr(language, 'descartesPhilosophyCore')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* The 4 Methodic Rules for Mathematical Problem Solving */}
        <div className="descartes-rules-container">
          <div className="rules-section-header">
            <h3 className="rules-title font-display">
              <span className="rule-badge-icon">📜</span> {tr(language, 'descartesRulesTitle')}
            </h3>
            <p className="rules-subtitle">{tr(language, 'descartesRulesSubtitle')}</p>
          </div>

          <div className="descartes-rules-grid">
            <div className="rule-card">
              <div className="rule-card-header">
                <span className="rule-roman">{tr(language, 'descartesRule1Num')}</span>
                <h4 className="rule-name">{tr(language, 'descartesRule1Name')}</h4>
              </div>
              <p className="rule-desc">{tr(language, 'descartesRule1Text')}</p>
            </div>

            <div className="rule-card">
              <div className="rule-card-header">
                <span className="rule-roman">{tr(language, 'descartesRule2Num')}</span>
                <h4 className="rule-name">{tr(language, 'descartesRule2Name')}</h4>
              </div>
              <p className="rule-desc">{tr(language, 'descartesRule2Text')}</p>
            </div>

            <div className="rule-card">
              <div className="rule-card-header">
                <span className="rule-roman">{tr(language, 'descartesRule3Num')}</span>
                <h4 className="rule-name">{tr(language, 'descartesRule3Name')}</h4>
              </div>
              <p className="rule-desc">{tr(language, 'descartesRule3Text')}</p>
            </div>

            <div className="rule-card">
              <div className="rule-card-header">
                <span className="rule-roman">{tr(language, 'descartesRule4Num')}</span>
                <h4 className="rule-name">{tr(language, 'descartesRule4Name')}</h4>
              </div>
              <p className="rule-desc">{tr(language, 'descartesRule4Text')}</p>
            </div>
          </div>

          {/* Golden Quote Ribbon */}
          <div className="descartes-ribbon-quote font-cormorant">
            <p className="ribbon-text">{tr(language, 'descartesQuoteExtra')}</p>
            <span className="ribbon-source">{tr(language, 'descartesQuoteSource')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
