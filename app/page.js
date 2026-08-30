'use client';

import { SiteHeader, SiteFooter, TutorProfileDisclosure } from './components';
import { useLanguage } from './language';
import { tr } from './i18n';
import DescartesHero from './DescartesHero';
import CurriculumExplorer from './CurriculumExplorer';
import { GAMES_COPY } from './games/gamesCopy';

export default function HomePage() {
  const { language } = useLanguage();
  const G = GAMES_COPY[language] || GAMES_COPY.en;

  return (
    <>
      <SiteHeader />
      <main className="main-content-wrap">
        {/* René Descartes Philosophical Hero Section */}
        <DescartesHero />

        {/* Multidimensional Curriculum Explorer */}
        <div className="content-divider">
          <span className="divider-line" />
          <span className="divider-emblem">✦ CURRICULUM & ARCHIVES ✦</span>
          <span className="divider-line" />
        </div>

        <CurriculumExplorer />

        {/* Global Exam Archives (AMC & CSAT) */}
        <section id="archive" className="academic-section-card">
          <div className="section-title-wrap">
            <span className="section-kicker">EXAMINATION ARCHIVES</span>
            <h2 className="section-main-title font-display">{tr(language, 'examArchives')}</h2>
            <p className="section-sub-desc">{tr(language, 'examArchivesDesc')}</p>
          </div>

          {/* AMC Section */}
          <div className="archive-subgroup">
            <div className="archive-subgroup-header">
              <div className="subgroup-title-box">
                <span className="subgroup-flag">🇺🇸</span>
                <div>
                  <h3 className="subgroup-title">{tr(language, 'amcArchive')}</h3>
                  <p className="subgroup-desc">{tr(language, 'amcArchiveDesc')}</p>
                </div>
              </div>
            </div>

            <div className="academic-card-grid">
              <a href="/amc/8" className="academic-item-card tier-bronze">
                <div className="card-badge-header">
                  <span className="academic-badge bronze">AMC 8</span>
                  <span className="seal-mark">🥉 Middle</span>
                </div>
                <h4 className="card-title font-cinzel">American Mathematics Contest 8</h4>
                <p className="card-description">{tr(language, 'amc8Level')}</p>
                <div className="card-action-footer">
                  <span className="action-text">Explore Archives →</span>
                </div>
              </a>

              <a href="/amc/10" className="academic-item-card tier-silver">
                <div className="card-badge-header">
                  <span className="academic-badge silver">AMC 10</span>
                  <span className="seal-mark">🥈 Grade 10</span>
                </div>
                <h4 className="card-title font-cinzel">American Mathematics Contest 10</h4>
                <p className="card-description">{tr(language, 'amc10Level')}</p>
                <div className="card-action-footer">
                  <span className="action-text">Explore Archives →</span>
                </div>
              </a>

              <a href="/amc/12" className="academic-item-card tier-gold">
                <div className="card-badge-header">
                  <span className="academic-badge gold">AMC 12</span>
                  <span className="seal-mark">🥇 High School</span>
                </div>
                <h4 className="card-title font-cinzel">American Mathematics Contest 12</h4>
                <p className="card-description">{tr(language, 'amc12Level')}</p>
                <div className="card-action-footer">
                  <span className="action-text">Explore Archives →</span>
                </div>
              </a>
            </div>
          </div>

          {/* CSAT Section */}
          <div className="archive-subgroup" style={{ marginTop: 36 }}>
            <div className="archive-subgroup-header">
              <div className="subgroup-title-box">
                <span className="subgroup-flag">🇰🇷</span>
                <div>
                  <h3 className="subgroup-title">{tr(language, 'csatArchive')}</h3>
                  <p className="subgroup-desc">한국 대학수학능력시험 및 한국교육과정평가원 모의평가 기출 아카이브</p>
                </div>
              </div>
            </div>

            <div className="academic-card-grid">
              <a href="/csat/june" className="academic-item-card csat-june">
                <div className="card-badge-header">
                  <span className="academic-badge navy">6월 모의평가</span>
                  <span className="seal-mark">KICE June</span>
                </div>
                <h4 className="card-title font-display">{tr(language, 'csatJune')}</h4>
                <p className="card-description">{tr(language, 'csatJuneDesc')}</p>
                <div className="card-action-footer">
                  <span className="action-text">문제 및 해설 보기 →</span>
                </div>
              </a>

              <a href="/csat/sept" className="academic-item-card csat-sept">
                <div className="card-badge-header">
                  <span className="academic-badge wine">9월 모의평가</span>
                  <span className="seal-mark">KICE Sept</span>
                </div>
                <h4 className="card-title font-display">{tr(language, 'csatSept')}</h4>
                <p className="card-description">{tr(language, 'csatSeptDesc')}</p>
                <div className="card-action-footer">
                  <span className="action-text">문제 및 해설 보기 →</span>
                </div>
              </a>

              <a href="/csat/nov" className="academic-item-card csat-nov">
                <div className="card-badge-header">
                  <span className="academic-badge burgundy">대학수학능력시험</span>
                  <span className="seal-mark">Official CSAT</span>
                </div>
                <h4 className="card-title font-display">{tr(language, 'csatNov')}</h4>
                <p className="card-description">{tr(language, 'csatNovDesc')}</p>
                <div className="card-action-footer">
                  <span className="action-text">본수능 기출 보기 →</span>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* Thought & Rest Corner */}
        <section id="games" className="academic-section-card" style={{ marginTop: 40, scrollMarginTop: 90 }}>
          <div className="section-title-wrap">
            <span className="section-kicker">CHAMBER OF REASON & PLAY</span>
            <h2 className="section-main-title font-display">{G.title}</h2>
            <p className="section-sub-desc">{G.description}</p>
          </div>

          <div className="academic-card-grid">
            <a href="/games/sudoku" className="academic-item-card rest-item">
              <div className="card-badge-header">
                <span className="game-symbol">🔢</span>
                <span className="game-tag">Logic & Deduction</span>
              </div>
              <h4 className="card-title font-display">{G.games.sudoku.title}</h4>
              <p className="card-description">{G.games.sudoku.desc}</p>
              <div className="card-action-footer">
                <span className="action-text">도전하기 →</span>
              </div>
            </a>

            <a href="/games/gomoku" className="academic-item-card rest-item">
              <div className="card-badge-header">
                <span className="game-symbol">⚫⚪</span>
                <span className="game-tag">Spatial Strategy</span>
              </div>
              <h4 className="card-title font-display">{G.games.gomoku.title}</h4>
              <p className="card-description">{G.games.gomoku.desc}</p>
              <div className="card-action-footer">
                <span className="action-text">도전하기 →</span>
              </div>
            </a>

            <a href="/games/chess" className="academic-item-card rest-item">
              <div className="card-badge-header">
                <span className="game-symbol">♞♚</span>
                <span className="game-tag">Classic Tactics</span>
              </div>
              <h4 className="card-title font-display">{G.games.chess.title}</h4>
              <p className="card-description">{G.games.chess.desc}</p>
              <div className="card-action-footer">
                <span className="action-text">도전하기 →</span>
              </div>
            </a>

            <a href="/games/yutnori" className="academic-item-card rest-item">
              <div className="card-badge-header">
                <span className="game-symbol">🎲🪵</span>
                <span className="game-tag">Probability & Flow</span>
              </div>
              <h4 className="card-title font-display">{G.games.yutnori.title}</h4>
              <p className="card-description">{G.games.yutnori.desc}</p>
              <div className="card-action-footer">
                <span className="action-text">도전하기 →</span>
              </div>
            </a>
          </div>
        </section>

        {/* Tutor Profile & Inquiry */}
        <section id="tutor" style={{ marginTop: 52, scrollMarginTop: 90 }}>
          <TutorProfileDisclosure />
        </section>

        {/* Contact Banner */}
        <section id="contact" style={{ margin: '32px 0 8px', scrollMarginTop: 90 }}>
          <div className="academic-inquiry-box">
            <div className="inquiry-icon-wrap">
              <span>✉️</span>
            </div>
            <div className="inquiry-copy">
              <h3 className="inquiry-title font-display">{tr(language, 'aboutTutor')}</h3>
              <p className="inquiry-desc">1:1 맞춤형 수학·코딩 강의 및 학습 방향 설계 문의</p>
            </div>
            <a href="tel:01033470308" className="inquiry-call-btn">
              {tr(language, 'classInquiry')}
            </a>
          </div>
        </section>

        {/* Instagram Social Banner */}
        <section id="instagram" style={{ margin: '32px 0 8px', scrollMarginTop: 90 }}>
          <div className="academic-social-card">
            <div className="social-card-content">
              <div className="social-kicker font-mono">MATHEMATICS & COMPUTATION · INSTAGRAM</div>
              <h3 className="social-title font-cinzel">@algorythm_logarythm</h3>
              <p className="social-desc">수학적 사유의 과정과 알고리즘, 새로운 학습 인사이트를 인스타그램에서 만나보세요.</p>
              <a
                href="https://www.instagram.com/algorythm_logarythm?igsi=NXFsc25lcTFoaWdj&amp;utm_source=qr"
                target="_blank"
                rel="noreferrer"
                className="social-btn"
              >
                <span>Instagram 방문하기</span> →
              </a>
            </div>
            <div className="social-qr-frame">
              <a
                href="https://www.instagram.com/algorythm_logarythm?igsi=NXFsc25lcTFoaWdj&amp;utm_source=qr"
                target="_blank"
                rel="noreferrer"
                className="social-qr-link"
                aria-label="Instagram @algorythm_logarythm"
              >
                <img
                  src="/instagram-qr.jpg"
                  alt="Instagram QR · @algorythm_logarythm"
                  className="social-qr-image"
                />
                <span className="qr-caption">Scan QR</span>
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

