'use client';

import { useLanguage } from '../language';

export default function LearningAreasSection() {
  const { language } = useLanguage();

  const areas = [
    {
      id: 'math',
      badge: 'Core Exploration',
      badgeColor: 'gold',
      symbol: '∑',
      titleKo: '수학 (Mathematics)',
      titleEn: 'Mathematics & Proof',
      descKo: '초등 사고력 연산부터 중등 기본도형·대수, 수능 기출 분석, AMC 8/10/12 글로벌 경시대회까지 체계적인 수학적 사유와 직관을 훈련합니다.',
      descEn: 'From elementary arithmetic and middle school algebra to Korean CSAT archives and AMC 8/10/12 contest mastery.',
      links: [
        { label: 'AMC 8/10/12 경시대회', href: '/amc' },
        { label: '수능·평가원 15개 단원', href: '/csat' },
        { label: '중등 Pre-Algebra & 기본도형', href: '/middle-school/pre-algebra' },
        { label: '초등 사고력 연산', href: '/elementary/practice' },
      ],
      primaryHref: '/amc',
      primaryLabel: '수학 탐구 시작 →',
    },
    {
      id: 'science',
      badge: 'Discovery & Experiments',
      badgeColor: 'blue',
      symbol: '⚛',
      titleKo: '과학 (Science)',
      titleEn: 'Natural Principles & Experiments',
      descKo: '자연계의 물리적·화학적 법칙을 수학적 모델과 사고 실험으로 검증합니다. 단순 암기를 넘어 현상의 원인과 결과를 직접 추론합니다.',
      descEn: 'Investigating laws of physics, chemistry, and nature through mathematical modeling, thought experiments, and causal inquiry.',
      links: [
        { label: '물리·기하학적 모델링', href: '/middle-school/basic-figures' },
        { label: '과학적 가설과 데이터 추론', href: '/coding' },
        { label: '자연계 수열과 패턴 탐구', href: '/amc/units' },
      ],
      primaryHref: '#philosophy',
      primaryLabel: '과학 탐구실 둘러보기 →',
    },
    {
      id: 'coding',
      badge: 'Interactive Computation',
      badgeColor: 'emerald',
      symbol: '⟨/⟩',
      titleKo: '코딩 & 알고리즘 (Coding)',
      titleEn: 'Computation & Algorithms',
      descKo: '수학적 논리와 알고리즘을 컴퓨터 언어로 구현합니다. 컴퓨팅 사고력을 기르고 인터랙티브 시뮬레이션을 통해 복잡한 문제를 해결합니다.',
      descEn: 'Bridging mathematical logic and computer algorithms through interactive coding, simulations, and problem-solving.',
      links: [
        { label: '알고리즘 문제 해결 Lab', href: '/coding' },
        { label: '인터랙티브 캔버스 시각화', href: '/coding' },
        { label: '수학 생성 엔진 분석', href: '/amc/units' },
      ],
      primaryHref: '/coding',
      primaryLabel: '코딩 Lab 시작하기 →',
    },
    {
      id: 'challenges',
      badge: 'Reason & Play',
      badgeColor: 'amber',
      symbol: '♟',
      titleKo: '사고력 게임 & 퍼즐 (Challenges)',
      titleEn: 'Strategic Games & Deduction',
      descKo: '오목, 장기, 체스, 스도쿠, 윷놀이 등 수학적 확률과 공간 전략을 직접 플레이하며 수읽기와 집중력을 기르는 지적 유희의 공간입니다.',
      descEn: 'Stimulating strategic reasoning, spatial foresight, and probability through Sudoku, Gomoku, Chess, Janggi, and Yutnori.',
      links: [
        { label: '스도쿠 (논리적 연역)', href: '/games/sudoku' },
        { label: '오목 & 체스 (공간 수읽기)', href: '/games/gomoku' },
        { label: '전통 윷놀이 (확률 시뮬레이션)', href: '/games/yutnori' },
        { label: '고전 장기 (전술적 사고)', href: '/games/janggi' },
      ],
      primaryHref: '/games',
      primaryLabel: '사고력 게임 도전 →',
    },
  ];

  return (
    <section id="learning-areas" className="illumia-section-wrap" aria-label="학습 영역">
      <div className="section-head-box">
        <div className="section-kicker font-mono">EXPLORATION DOMAINS</div>
        <h2 className="section-title font-display">
          핵심 학습 및 탐구 영역
        </h2>
        <p className="section-subtitle">
          단순한 공식 암기를 넘어, 자연과 기호와 논리의 세계를 직접 탐구하고 이해하는 배움의 장
        </p>
      </div>

      <div className="learning-areas-grid">
        {areas.map((area) => (
          <div key={area.id} className={`area-card area-${area.id}`}>
            <div className="area-card-header">
              <span className={`area-badge badge-${area.badgeColor} font-mono`}>
                {area.badge}
              </span>
              <div className="area-symbol-circle font-cinzel">
                {area.symbol}
              </div>
            </div>

            <div className="area-card-body">
              <h3 className="area-card-title font-display">
                {language === 'ko' ? area.titleKo : area.titleEn}
              </h3>
              <p className="area-card-desc">
                {language === 'ko' ? area.descKo : area.descEn}
              </p>

              <div className="area-sublinks">
                {area.links.map((link, idx) => (
                  <a key={idx} href={link.href} className="sublink-item">
                    <span className="sublink-bullet">◈</span>
                    <span>{link.label}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="area-card-footer">
              <a href={area.primaryHref} className="area-action-btn">
                <span>{area.primaryLabel}</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
