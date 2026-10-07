'use client';

import { useLanguage } from '../language';

export default function WhyIllumiaLabSection() {
  const { language } = useLanguage();

  return (
    <section id="why-illumia" className="illumia-why-section-wrap" aria-label="Why ILLUMIA LAB">
      {/* -------------------------------------------------------------
          Section 4: Why ILLUMIA? (빛의 의미)
         ------------------------------------------------------------- */}
      <div className="why-illumia-grid">
        <div className="why-card why-illumia-card">
          <div className="why-card-header">
            <span className="why-eyebrow font-mono">✦ THE ESSENCE OF ILLUMIA</span>
            <h2 className="why-title font-display">
              Why ILLUMIA?
            </h2>
            <p className="why-latin-roots font-cormorant">
              lumen · illuminare · illuminatio
            </p>
          </div>

          <div className="why-card-content">
            <p className="why-narrative-lead">
              <strong>ILLUMIA</strong>는 라틴어의 <em>lumen</em>(빛), <em>illuminare</em>(비추다·밝히다), <em>illuminatio</em>(밝힘·깨우침)라는 어원적 의미에서 영감을 얻어 탄생한 현대적 브랜드명입니다.
            </p>
            <div className="why-quote-box">
              <span className="quote-light-icon">💡</span>
              <p className="quote-text font-display">
                “배움은 보이지 않던 것을 보이게 하고, 이해하지 못했던 것을 이해하게 합니다. ILLUMIA의 ‘빛’은 바로 그 순간을 상징합니다.”
              </p>
            </div>
            <p className="why-sub-text">
              어두운 방에서 물건을 더듬는 것이 단순 암기라면, 스위치를 켜고 방 전체의 구조를 환히 파악하는 것은 진정한 이해입니다. ILLUMIA LAB은 학생 각자의 마음에 그 밝은 빛을 밝히는 교육을 지향합니다.
            </p>
          </div>

          <div className="why-card-footer">
            <a href="/about#name" className="why-learn-more-link">
              <span>이름의 배경 자세히 보기</span>
              <span className="arrow">→</span>
            </a>
          </div>
        </div>

        {/* -------------------------------------------------------------
            Section 5: Why LAB? (배움의 실험실)
           ------------------------------------------------------------- */}
        <div className="why-card why-lab-card">
          <div className="why-card-header">
            <span className="why-eyebrow font-mono">✦ THE SPIRIT OF LAB</span>
            <h2 className="why-title font-display">
              Why LAB?
            </h2>
            <p className="why-lab-pillars font-mono">
              Experiment · Explore · Discover · Create
            </p>
          </div>

          <div className="why-card-content">
            <p className="why-narrative-lead">
              <strong>LAB</strong>은 Laboratory(실험실)의 본질을 확장하여, 지식을 일방적으로 주입받는 교실이 아닌 학생이 직접 질문하고 부딪치며 검증하는 <strong>‘배움의 실험실’</strong>을 의미합니다.
            </p>
            <div className="lab-pillars-grid">
              <div className="lab-pillar-item">
                <span className="pillar-num font-mono">01</span>
                <strong className="pillar-name">Experiment</strong>
                <span className="pillar-desc">실험하고 시도하기</span>
              </div>
              <div className="lab-pillar-item">
                <span className="pillar-num font-mono">02</span>
                <strong className="pillar-name">Explore</strong>
                <span className="pillar-desc">원리를 깊이 탐구하기</span>
              </div>
              <div className="lab-pillar-item">
                <span className="pillar-num font-mono">03</span>
                <strong className="pillar-name">Discover</strong>
                <span className="pillar-desc">스스로 발견하기</span>
              </div>
              <div className="lab-pillar-item">
                <span className="pillar-num font-mono">04</span>
                <strong className="pillar-name">Create</strong>
                <span className="pillar-desc">새로운 해법 만들기</span>
              </div>
            </div>
            <p className="why-sub-text">
              실수를 두려워하지 않고 다양한 풀이와 코드를 시도해볼 때, 학생은 수동적인 학습자에서 능동적인 탐구자로 거듭납니다.
            </p>
          </div>

          <div className="why-card-footer">
            <a href="/about#lab" className="why-learn-more-link">
              <span>LAB의 교육 철학 자세히 보기</span>
              <span className="arrow">→</span>
            </a>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          Section 6: Core Question (본질적 질문)
         ------------------------------------------------------------- */}
      <div className="illumia-core-question-banner">
        <div className="core-question-frame">
          <span className="frame-star left">✦</span>
          <div className="core-question-content">
            <span className="question-kicker font-mono">THE FUNDAMENTAL QUESTION</span>
            <blockquote className="core-question-quote font-display">
              “무엇을 외웠는가?”보다<br />
              <strong>“무엇을 이해하고 스스로 발견했는가?”</strong>
            </blockquote>
            <p className="core-question-author font-mono">
              — ILLUMIA LAB Educational Manifesto
            </p>
          </div>
          <span className="frame-star right">✦</span>
        </div>
      </div>

      {/* -------------------------------------------------------------
          Section 7: Final CTA (마무리 안내)
         ------------------------------------------------------------- */}
      <div className="illumia-final-cta-card">
        <div className="final-cta-inner">
          <div className="final-cta-crest font-cinzel">
            ILLUMIA LAB
          </div>
          <h3 className="final-cta-title font-cormorant">
            Where Learning Becomes Illumination.
          </h3>
          <p className="final-cta-korean font-display">
            배움이 깨달음으로 이어지는 곳.
          </p>
          <p className="final-cta-sub">
            초등 사고력 연산부터 중등 대수·도형, 수능 기출 분석, AMC 경시대회까지 지금 바로 탐구를 시작해보세요.
          </p>

          <div className="final-cta-buttons">
            <a href="#learning-areas" className="cta-btn-primary">
              <span>🚀 학습 시작하기</span>
            </a>
            <a href="/about" className="cta-btn-secondary">
              <span>🏛️ ILLUMIA LAB 소개 및 철학</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
