'use client';

import { useState } from 'react';
import { useLanguage } from '../language';

export default function PhilosophyFlowSection() {
  const { language } = useLanguage();
  const [activeStage, setActiveStage] = useState(5); // default to 6th stage (Illumination)

  const stages = [
    {
      step: '01',
      titleKo: '배움',
      titleEn: 'Learning',
      sanskrit: 'Vidyā (비디야)',
      latin: 'Discit / Studere',
      coreKo: '호기심과 질문의 시작',
      coreEn: 'Awakening of Curiosity & Inquiry',
      descKo: '배움은 자신이 모른다는 사실을 겸허히 인정하고, 세상과 문제에 대해 진지한 질문을 던지는 데서 출발합니다. 주입받는 것이 아니라 질문하는 능력이 배움의 씨앗입니다.',
      descEn: 'Learning begins with humble recognition of the unknown and genuine questions directed at the world and problems.',
      quoteKo: '“모르는 것을 아는 척하지 않고, 왜 그런지 질문하는 것에서 진정한 배움이 시작된다.”',
      quoteEn: '“True learning begins when we acknowledge what we do not know and ask why.”',
    },
    {
      step: '02',
      titleKo: '지식',
      titleEn: 'Knowledge',
      sanskrit: 'Jñāna (즈냐나)',
      latin: 'Scientia',
      coreKo: '개념과 원리의 체계적 정립',
      coreEn: 'Systematic Grasp of Concepts & Principles',
      descKo: '질문을 통해 탐색한 사실과 규칙을 체계적인 개념 틀로 구조화합니다. 단순한 정보 파편이 아니라 서로 연결될 수 있는 탄탄한 학문적 기초가 됩니다.',
      descEn: 'Structuring discovered facts and rules into coherent mental frameworks that form the bedrock of understanding.',
      quoteKo: '“정리되지 않은 정보는 짐이지만, 체계화된 개념은 든든한 날개가 된다.”',
      quoteEn: '“Unstructured information is a burden; organized concepts become wings.”',
    },
    {
      step: '03',
      titleKo: '지성',
      titleEn: 'Intelligence',
      sanskrit: 'Buddhi (붓디) / Medhā',
      latin: 'Intellectus / Ingenium',
      coreKo: '유연한 사고와 개념 간의 연결',
      coreEn: 'Flexible Reasoning & Conceptual Synthesis',
      descKo: '단일 개념을 넘어 서로 다른 영역의 원리들을 자유자재로 연결하고 추론하는 지적 능력입니다. 새로운 형태의 문제를 마주했을 때 당황하지 않고 가설을 세웁니다.',
      descEn: 'The intellectual capacity to synthesize concepts across domains, forming hypotheses when confronted with novel challenges.',
      quoteKo: '“지성은 여러 개념 사이의 숨겨진 다리를 찾아내는 유연한 사유의 힘이다.”',
      quoteEn: '“Intelligence is the agile power to discover hidden bridges between concepts.”',
    },
    {
      step: '04',
      titleKo: '분별',
      titleEn: 'Discernment',
      sanskrit: 'Viveka (비베카)',
      latin: 'Discretio',
      coreKo: '핵심과 본질을 꿰뚫어 보는 안목',
      coreEn: 'Piercing Insight into Core Truths',
      descKo: '문제의 겉모습이나 복잡한 곁가지에 현혹되지 않고, 문제 해결의 결정적 핵심 조건과 숨은 법칙을 날카롭게 분별해내는 통찰의 단계입니다.',
      descEn: 'Discerning the essential conditions and underlying laws of a problem without being misled by superficial complexities.',
      quoteKo: '“중요한 것과 중요하지 않은 것을 가려낼 수 있을 때, 복잡한 문제는 단순해진다.”',
      quoteEn: '“When one separates the essential from the trivial, complex problems become simple.”',
    },
    {
      step: '05',
      titleKo: '지혜',
      titleEn: 'Wisdom',
      sanskrit: 'Prajñā (프라즈냐)',
      latin: 'Sapientia',
      coreKo: '복합 문제를 스스로 해결하는 통섭',
      coreEn: 'Integrated Mastery & Independent Resolution',
      descKo: '축적된 지성과 분별력을 실제 문제와 삶의 상황에 조화롭게 적용하는 역량입니다. 어떤 조건에서도 최적의 접근 경로를 스스로 찾아내어 돌파합니다.',
      descEn: 'Harmoniously applying discernment and intelligence to real-world and competition problems, navigating to optimal solutions.',
      quoteKo: '“지혜는 아는 것을 넘어, 바른 방향으로 사유를 실천하는 힘이다.”',
      quoteEn: '“Wisdom is the power not merely to know, but to direct thought toward the right path.”',
    },
    {
      step: '06',
      titleKo: '깨달음',
      titleEn: 'Illumination',
      sanskrit: 'Bodhi (보디)',
      latin: 'Illuminatio',
      coreKo: '보이지 않던 것을 환히 밝히는 통찰',
      coreEn: 'Radiant Enlightenment & Total Clarity',
      descKo: 'ILLUMIA LAB이 지향하는 최고의 지향점입니다. 배움과 사유의 여정을 거쳐, 마침내 모든 인과관계와 수학적·자연적 원리가 빛처럼 한순간에 눈앞에 환히 밝혀지는 경지입니다.',
      descEn: 'The apex of ILLUMIA LAB. Through deep exploration, all causal principles and structures illuminate in a sudden flash of clarity.',
      quoteKo: '“배움은 보이지 않던 것을 보이게 하고, 이해하지 못했던 것을 스스로 밝혀내는 빛이다.”',
      quoteEn: '“Learning is the light that reveals what was hidden and illuminates understanding.”',
    },
  ];

  const current = stages[activeStage];

  return (
    <section id="philosophy" className="illumia-section-wrap philosophy-section" aria-label="학습 철학">
      <div className="section-head-box">
        <div className="section-kicker font-mono">LEARNING PHILOSOPHY</div>
        <h2 className="section-title font-display">
          배움에서 깨달음으로의 여정
        </h2>
        <p className="section-subtitle">
          Learning → Knowledge → Intelligence → Discernment → Wisdom → Illumination
        </p>
      </div>

      {/* 6 Stage Interactive Timeline */}
      <div className="philosophy-timeline-container">
        <div className="timeline-steps-track">
          {stages.map((st, idx) => {
            const isActive = idx === activeStage;
            return (
              <button
                key={st.step}
                type="button"
                className={`timeline-step-btn ${isActive ? 'is-active' : ''} ${idx === 5 ? 'is-illumination' : ''}`}
                onClick={() => setActiveStage(idx)}
                aria-pressed={isActive}
              >
                <div className="step-circle font-cinzel">
                  {st.step}
                </div>
                <div className="step-texts">
                  <span className="step-title-ko">{st.titleKo}</span>
                  <span className="step-title-en font-cinzel">{st.titleEn}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Stage Spotlight Card */}
        <div className="philosophy-spotlight-card">
          <div className="spotlight-header">
            <div className="spotlight-badges">
              <span className="spotlight-step-tag font-mono">STAGE {current.step} / 06</span>
              <span className="spotlight-lang-tag font-mono">라틴어: {current.latin}</span>
              <span className="spotlight-lang-tag font-mono">산스크리트: {current.sanskrit}</span>
            </div>
            <div className="spotlight-title-group">
              <h3 className="spotlight-title font-display">
                {current.titleKo} <span className="font-cinzel">({current.titleEn})</span>
              </h3>
              <p className="spotlight-core font-mono">
                {language === 'ko' ? current.coreKo : current.coreEn}
              </p>
            </div>
          </div>

          <div className="spotlight-body">
            <p className="spotlight-desc">
              {language === 'ko' ? current.descKo : current.descEn}
            </p>

            <blockquote className="spotlight-quote font-cormorant">
              {language === 'ko' ? current.quoteKo : current.quoteEn}
            </blockquote>
          </div>

          <div className="spotlight-footer">
            <div className="step-selector-dots">
              {stages.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  className={`dot-btn ${dotIdx === activeStage ? 'is-active' : ''}`}
                  onClick={() => setActiveStage(dotIdx)}
                  aria-label={`단계 ${dotIdx + 1} 선택`}
                />
              ))}
            </div>
            <span className="spotlight-hint font-mono">
              클릭하여 6단계 철학의 의미를 탐구해보세요
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
