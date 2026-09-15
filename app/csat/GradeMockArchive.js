'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '../language';
import CsatExamArchive from './CsatArchive';

const COPY = {
  ko: {
    home: '홈', hub: '수능 기출문제',
    june: '6월 모의고사', sept: '9월 모의고사',
  },
  en: {
    home: 'Home', hub: 'CSAT Archive',
    june: 'June Mock Exam', sept: 'September Mock Exam',
  },
};

const GRADE_LABEL = { g1: { ko: '고1', en: 'Grade 10' }, g2: { ko: '고2', en: 'Grade 11' } };

// 고1·고2는 평가원이 아니라 시·도교육청이 주관하는 전국연합학력평가(6월·9월)만 있고 11월 수능은 없으므로,
// 기존 /csat/june·/csat/sept 페이지를 그대로 재사용하되 gradeFilter로 걸러 별도 페이지처럼 보여준다.
export default function GradeMockArchive({ grade, label, description }) {
  const { language } = useLanguage();
  const words = COPY[language] || COPY.en;
  const gradeLabel = (GRADE_LABEL[grade] || GRADE_LABEL.g1)[language] || (GRADE_LABEL[grade] || GRADE_LABEL.g1).en;
  const [examType, setExamType] = useState('june');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get('examType');
    if (requested === 'june' || requested === 'sept') setExamType(requested);
  }, []);

  function switchExamType(next) {
    setExamType(next);
    const url = new URL(window.location.href);
    url.searchParams.set('examType', next);
    url.searchParams.delete('year');
    url.searchParams.delete('variant');
    window.history.pushState({}, '', url.toString());
  }

  return <>
    <p className="no-print" style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 6 }}>
      <a href="/">{words.home}</a> / <a href="/csat.html">{words.hub}</a> / {label}
    </p>

    <div className="no-print" style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
      {['june', 'sept'].map((type) => <button
        key={type}
        type="button"
        onClick={() => switchExamType(type)}
        style={{
          fontSize: 14, fontWeight: 800, padding: '9px 18px', borderRadius: 10, border: 'none', cursor: 'pointer',
          background: examType === type ? 'linear-gradient(135deg, var(--red, #c23b32) 0%, var(--red-dark, #8f2a24) 100%)' : '#ede7db',
          color: examType === type ? '#ffffff' : 'var(--ink, #1f2733)',
        }}
      >
        {type === 'june' ? '🌱' : '🍂'} {words[type]}
      </button>)}
    </div>

    <div className="no-print" style={{ background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.06) 0%, rgba(99, 102, 241, 0.08) 100%)', border: '1px solid rgba(37, 99, 235, 0.2)', borderRadius: 12, padding: '14px 18px', marginBottom: 20, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
      <div>
        <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 14, color: '#1d4ed8' }}>
          ✍️ {grade === 'g1' ? '고1 공통수학1(수학(상)) 단원별 기본 기출문제 바로 풀기' : '고2 모의고사 대비 필수 기본기 단원별 문제 바로 풀기'}
        </p>
        <p style={{ margin: 0, fontSize: 12.5, color: 'var(--ink-soft)' }}>
          {grade === 'g1'
            ? '다항식의 연산, 방정식과 부등식, 도형의 방정식 365문항을 단원별 실전 학습지로 풀어보세요.'
            : '수학Ⅰ, 수학Ⅱ 및 공통수학 전 단원 핵심 기출문제를 단원별로 학습할 수 있습니다.'}
        </p>
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <a href="/csat/units?unit=polynomial-ops" className="button button-secondary" style={{ textDecoration: 'none', fontSize: 12, padding: '6px 12px' }}>
          다항식의 연산 →
        </a>
        <a href="/csat/units?unit=equations-inequalities" className="button button-secondary" style={{ textDecoration: 'none', fontSize: 12, padding: '6px 12px' }}>
          방정식과 부등식 →
        </a>
        <a href="/csat/units?unit=coordinate-geometry-equations" className="button button-secondary" style={{ textDecoration: 'none', fontSize: 12, padding: '6px 12px' }}>
          도형의 방정식 →
        </a>
      </div>
    </div>

    <CsatExamArchive
      key={examType}
      examType={examType}
      gradeFilter={grade}
      label={`${label} · ${words[examType]}`}
      description={description}
    />
  </>;
}
