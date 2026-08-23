'use client';

import { useState } from 'react';
import { useLanguage } from './language';

const ready = (label, href) => ({ label, href, ready: true });
const soon = (label) => ({ label, href: '#', ready: false });

const koreanStages = [
  ...Array.from({ length: 6 }, (_, index) => ({
    title: `초등학교 ${index + 1}학년`, subtitle: `Korean Grade ${index + 1}`,
    topics: [ready(`${index + 1}학년 수학 연습`, `/elementary/practice?grade=${index + 1}`)],
  })),
  { title: '중학교 1학년', subtitle: 'Korean Grade 7', topics: [
    ready('소수와 소인수분해', '/middle-school/prime-factorization'), ready('최대공약수와 최소공배수', '/middle-school/gcd-lcm'), ready('정수와 유리수', '/middle-school/integers-rationals'), ready('문자와 식', '/middle-school/algebra-basics.html?unit=expressions-review'), ready('일차방정식', '/middle-school/algebra-basics.html?unit=equations-review'), ready('좌표와 그래프', '/middle-school/coordinate-plane'), ready('정비례와 반비례', '/middle-school/proportion'),
  ] },
  { title: '중학교 2학년', subtitle: 'Korean Grade 8', topics: [soon('식의 계산'), soon('일차부등식'), soon('연립일차방정식'), soon('일차함수')] },
  { title: '중학교 3학년', subtitle: 'Korean Grade 9', topics: [soon('제곱근과 실수'), soon('인수분해'), soon('이차방정식'), soon('이차함수')] },
  { title: '고등학교', subtitle: 'Korean High School', topics: [soon('공통수학'), soon('대수'), soon('미적분'), soon('확률과 통계'), soon('기하')] },
];

const courseStages = [
  { title: 'Arithmetic & Foundations', subtitle: 'Number sense and operations', topics: [ready('Grades 1–6 Practice', '/elementary/practice'), ready('Fractions, Decimals & Ratios', '/elementary/practice?grade=6')] },
  { title: 'Pre-Algebra', subtitle: 'Prepare for symbolic algebra', topics: [ready('Primes & Prime Factorization', '/middle-school/prime-factorization'), ready('GCF & LCM', '/middle-school/gcd-lcm'), ready('Integers & Rational Numbers', '/middle-school/integers-rationals'), ready('Ratios & Proportions', '/middle-school/proportion')] },
  { title: 'Algebra 1', subtitle: 'Expressions, equations and graphs', topics: [ready('Algebraic Expressions', '/middle-school/algebra-basics.html?unit=expressions-review'), ready('Linear Equations', '/middle-school/algebra-basics.html?unit=equations-review'), ready('Coordinate Plane & Graphs', '/middle-school/coordinate-plane'), ready('Direct & Inverse Proportion', '/middle-school/proportion')] },
  { title: 'Geometry', subtitle: 'Shapes, measurement and proof', topics: [soon('Geometry Foundations'), soon('Congruence & Similarity'), soon('Coordinate Geometry')] },
  { title: 'Algebra 2', subtitle: 'Functions, polynomials and exponentials', topics: [soon('Polynomials & Factoring'), soon('Quadratic Functions'), soon('Exponential & Logarithmic Functions')] },
  { title: 'Precalculus & Calculus', subtitle: 'Advanced functions and change', topics: [soon('Trigonometry'), soon('Limits & Calculus'), soon('Sequences & Series')] },
  { title: 'Integrated Math I–III', subtitle: 'Alternative U.S. pathway', topics: [ready('Math I · Linear relationships', '/middle-school/algebra-basics.html?unit=equations-review'), soon('Math II · Geometry & quadratics'), soon('Math III · Advanced functions')] },
];

const domainStages = [
  { title: '수와 연산', subtitle: 'Number & Operations', topics: [ready('초등 수 연산', '/elementary/practice'), ready('소수와 소인수분해', '/middle-school/prime-factorization'), ready('최대공약수와 최소공배수', '/middle-school/gcd-lcm'), ready('정수와 유리수', '/middle-school/integers-rationals')] },
  { title: '변화와 관계', subtitle: 'Algebra, Relations & Change', topics: [ready('문자와 식', '/middle-school/algebra-basics.html?unit=expressions-review'), ready('일차방정식', '/middle-school/algebra-basics.html?unit=equations-review'), ready('좌표와 그래프', '/middle-school/coordinate-plane'), ready('정비례와 반비례', '/middle-school/proportion')] },
  { title: '도형과 측정', subtitle: 'Geometry & Measurement', topics: [soon('기본 도형'), soon('평면도형과 입체도형'), soon('합동과 닮음'), soon('삼각비')] },
  { title: '자료와 가능성', subtitle: 'Data & Probability', topics: [soon('자료의 정리와 해석'), soon('확률'), soon('통계')] },
  { title: '수학적 모델링과 문제 해결', subtitle: 'Modeling & Problem Solving', topics: [ready('비례 관계 문제', '/middle-school/proportion'), ready('일차방정식 활용', '/middle-school/algebra-basics.html?unit=equation-word-problems'), ready('거리·속력·시간', '/middle-school/algebra-basics.html?unit=distance-speed-time'), soon('자료 기반 모델링')] },
];

const copy = {
  ko: { eyebrow: 'CURRICULUM MAP', title: '어떤 순서로 수학을 찾아볼까요?', description: '같은 문제를 한국 학년, 국제 과목 과정, 수학 영역의 세 가지 관점으로 펼쳐볼 수 있습니다.', tabs: ['한국 학년별', '국제 과목별', '수학 영역별'], tabHelp: ['2022 개정 교육과정의 학년 흐름', 'Pre-Algebra · Algebra 1·2 중심 과정', '학년과 문화권을 넘는 개념 지도'], available: '바로 학습', coming: '준비 중', open: '단원 펼쳐보기', note: '표시된 학년·과목은 탐색을 위한 대표 경로이며, 학교와 국가에 따라 단원 순서가 달라질 수 있습니다.' },
  en: { eyebrow: 'CURRICULUM MAP', title: 'Choose how you want to explore math', description: 'Browse the same practice library by Korean grade, international course sequence, or mathematical domain.', tabs: ['Korean Grades', 'Course Sequence', 'Math Domains'], tabHelp: ['Grade-by-grade Korean pathway', 'Pre-Algebra, Algebra 1–2 and beyond', 'A concept map that works across systems'], available: 'Practice now', coming: 'Coming soon', open: 'Open topics', note: 'These are practical navigation pathways. Exact topic order varies by school, country, and program.' },
};

const modes = [{ id: 'korea', stages: koreanStages }, { id: 'courses', stages: courseStages }, { id: 'domains', stages: domainStages }];

export default function CurriculumExplorer() {
  const { language } = useLanguage();
  const [mode, setMode] = useState('korea');
  const words = copy[language] || copy.en;
  const selectedIndex = modes.findIndex((item) => item.id === mode);
  const selected = modes[selectedIndex];

  return <section className="curriculum-explorer" aria-labelledby="curriculum-title">
    <div className="curriculum-heading"><p className="font-mono">{words.eyebrow}</p><h2 id="curriculum-title" className="font-display">{words.title}</h2><p>{words.description}</p></div>
    <div className="curriculum-tabs" role="tablist" aria-label={words.title}>
      {modes.map((item, index) => <button key={item.id} type="button" role="tab" aria-selected={mode === item.id} aria-controls={`curriculum-${item.id}`} id={`curriculum-tab-${item.id}`} className={mode === item.id ? 'active' : ''} onClick={() => setMode(item.id)}><strong>{words.tabs[index]}</strong><span>{words.tabHelp[index]}</span></button>)}
    </div>
    <div className="curriculum-panel" id={`curriculum-${selected.id}`} role="tabpanel" aria-labelledby={`curriculum-tab-${selected.id}`}>
      <div className="curriculum-stage-grid">
        {selected.stages.map((stage, index) => {
          const readyCount = stage.topics.filter((topic) => topic.ready).length;
          return <details className="curriculum-stage" key={stage.title} open={index === 0}>
            <summary><span><strong>{stage.title}</strong><small>{stage.subtitle}</small></span><span className={readyCount ? 'curriculum-count ready' : 'curriculum-count'}>{readyCount ? `${readyCount} ${words.available}` : words.coming}</span><span className="sr-only">{words.open}</span></summary>
            <div className="curriculum-topic-list">{stage.topics.map((topic) => topic.ready ? <a href={topic.href} key={topic.label}>{topic.label}<span>{words.available} →</span></a> : <span className="disabled" key={topic.label}>{topic.label}<small>{words.coming}</small></span>)}</div>
          </details>;
        })}
      </div>
      <p className="curriculum-note">{words.note}</p>
    </div>
  </section>;
}
