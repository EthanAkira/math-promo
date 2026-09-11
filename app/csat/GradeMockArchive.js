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

    <CsatExamArchive
      key={examType}
      examType={examType}
      gradeFilter={grade}
      label={`${label} · ${words[examType]}`}
      description={description}
    />
  </>;
}
