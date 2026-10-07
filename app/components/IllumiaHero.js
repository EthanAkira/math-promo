'use client';

import { useLanguage } from '../language';
import { tr } from '../i18n';

export default function IllumiaHero() {
  const { language } = useLanguage();

  return (
    <section className="illumia-hero-section" aria-label="ILLUMIA LAB Hero">
      {/* Background radiant illumination effect */}
      <div className="illumia-hero-glow" aria-hidden="true" />

      <div className="illumia-hero-container">
        {/* Eyebrow Badge */}
        <div className="illumia-eyebrow-badge">
          <span className="illumia-star-icon">✦</span>
          <span className="font-mono">ILLUMIA LAB · LABORATORY OF LEARNING</span>
          <span className="illumia-star-icon">✦</span>
        </div>

        {/* Main Brand Title */}
        <div className="illumia-hero-brand-block">
          <h1 className="illumia-hero-brand font-cinzel">
            ILLUMIA LAB
          </h1>
          <div className="illumia-hero-brand-ko font-display">
            일루미아 랩
          </div>
        </div>

        {/* Grand Slogans */}
        <div className="illumia-slogans-box">
          <div className="illumia-slogan-en font-cormorant">
            Learn. Understand. Illuminate.
          </div>
          <p className="illumia-slogan-ko font-display">
            배우고, 이해하고, 스스로 밝혀 나가다.
          </p>
        </div>

        {/* Service Description */}
        <div className="illumia-service-desc">
          <p className="desc-lead">수학, 코딩 &amp; 데이터 사이언스를</p>
          <p className="desc-focus font-display">
            <strong>탐구하고, 이해하고, 직접 발견하는 학습 공간</strong>
          </p>
        </div>

        {/* Learning Philosophy Sequential Flow Banner */}
        <div className="illumia-philosophy-ribbon" aria-label="학습 철학 단계">
          <div className="ribbon-kicker font-mono">PHILOSOPHY OF ILLUMINATION</div>
          <div className="ribbon-steps-grid">
            <div className="ribbon-step">
              <span className="step-num">01</span>
              <span className="step-label-ko">배움</span>
              <span className="step-label-en font-cinzel">Learning</span>
            </div>
            <span className="step-arrow">→</span>
            <div className="ribbon-step">
              <span className="step-num">02</span>
              <span className="step-label-ko">지식</span>
              <span className="step-label-en font-cinzel">Knowledge</span>
            </div>
            <span className="step-arrow">→</span>
            <div className="ribbon-step">
              <span className="step-num">03</span>
              <span className="step-label-ko">지성</span>
              <span className="step-label-en font-cinzel">Intelligence</span>
            </div>
            <span className="step-arrow">→</span>
            <div className="ribbon-step">
              <span className="step-num">04</span>
              <span className="step-label-ko">분별</span>
              <span className="step-label-en font-cinzel">Discernment</span>
            </div>
            <span className="step-arrow">→</span>
            <div className="ribbon-step">
              <span className="step-num">05</span>
              <span className="step-label-ko">지혜</span>
              <span className="step-label-en font-cinzel">Wisdom</span>
            </div>
            <span className="step-arrow">→</span>
            <div className="ribbon-step highlight-illumination">
              <span className="step-num">06</span>
              <span className="step-label-ko">깨달음</span>
              <span className="step-label-en font-cinzel">Illumination</span>
            </div>
          </div>
        </div>

        {/* Primary and Secondary CTA Buttons */}
        <div className="illumia-hero-actions">
          <a href="#learning-areas" className="illumia-btn-primary">
            <span className="btn-icon">🚀</span>
            <span className="btn-text">학습 시작하기</span>
            <span className="btn-subtext font-mono">Start Learning</span>
          </a>
          <a href="/about" className="illumia-btn-secondary">
            <span className="btn-icon">✦</span>
            <span className="btn-text">ILLUMIA LAB 소개</span>
            <span className="btn-subtext font-mono">About the Lab</span>
          </a>
        </div>

        {/* Hallmarks Footer Bar */}
        <div className="illumia-hero-hallmarks">
          <div className="hallmark-item">
            <span className="hallmark-icon">📐</span>
            <div>
              <strong className="hallmark-title">핵심 탐구 영역</strong>
              <span className="hallmark-sub">수학 · 코딩 &amp; 데이터 사이언스</span>
            </div>
          </div>
          <div className="hallmark-divider" />
          <div className="hallmark-item">
            <span className="hallmark-icon">🔬</span>
            <div>
              <strong className="hallmark-title">배움의 실험실 (LAB)</strong>
              <span className="hallmark-sub">일방적 암기 대신 가설과 발견</span>
            </div>
          </div>
          <div className="hallmark-divider" />
          <div className="hallmark-item">
            <span className="hallmark-icon">💡</span>
            <div>
              <strong className="hallmark-title">지혜와 깨달음</strong>
              <span className="hallmark-sub">스스로 원리를 밝히는 통찰</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
