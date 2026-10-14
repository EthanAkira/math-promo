'use client';

import { useState, useMemo } from 'react';
import MathText from '../../components/MathText';
import mockCatalog from '../../data/csatGrade1NationalMockCatalog.json';
import { generateVariationForGrade1Mock } from '../grade1NationalMockGenerator';

const SESSIONS = [
  { key: 'all', label: '전체 보기', count: 358, icon: '📚' },
  { key: 'june', label: '6월 전국연합', count: 90, icon: '🌱' },
  { key: 'sept', label: '9월 전국연합', count: 91, icon: '🍂' },
  { key: 'nov', label: '11월 전국연합', count: 60, icon: '❄️' },
  { key: 'march_g2', label: '고2 3월(고1 전범위)', count: 117, icon: '🌸' },
];

const UNITS = [
  { id: 'all', label: '전체 단원' },
  { id: 'polynomial-ops', label: '다항식의 연산과 인수분해' },
  { id: 'equations-inequalities', label: '방정식과 부등식' },
  { id: 'coordinate-geometry-equations', label: '도형의 방정식' },
  { id: 'sets-propositions', label: '집합과 명제' },
  { id: 'functions-graphs', label: '함수와 그래프' },
  { id: 'permutations-combinations', label: '순열과 조합' },
];

export default function Grade1NationalMockWorkspace() {
  const [selectedSession, setSelectedSession] = useState('all');
  const [selectedUnit, setSelectedUnit] = useState('all');
  const [selectedPoints, setSelectedPoints] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openExplanations, setOpenExplanations] = useState({});
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [variantProblems, setVariantProblems] = useState({});
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

  // Filter items
  const filteredProblems = useMemo(() => {
    return mockCatalog.filter((item) => {
      if (selectedSession !== 'all' && item.sessionKey !== selectedSession) return false;
      if (selectedUnit !== 'all' && item.unitId !== selectedUnit) return false;
      if (selectedPoints !== 'all' && item.points !== Number(selectedPoints)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchQ = item.question?.toLowerCase().includes(q);
        const matchExp = item.explanation?.toLowerCase().includes(q);
        const matchSrc = item.sourceLabel?.toLowerCase().includes(q);
        const matchNum = String(item.number).includes(q);
        if (!matchQ && !matchExp && !matchSrc && !matchNum) return false;
      }
      return true;
    });
  }, [selectedSession, selectedUnit, selectedPoints, searchQuery]);

  const totalPages = Math.ceil(filteredProblems.length / PAGE_SIZE) || 1;
  const paginatedProblems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredProblems.slice(start, start + PAGE_SIZE);
  }, [filteredProblems, page]);

  function toggleExplanation(id) {
    setOpenExplanations((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function handleSelectAnswer(problemId, choiceIdx) {
    setSelectedAnswers((prev) => ({ ...prev, [problemId]: choiceIdx }));
  }

  function handleGenerateVariant(item) {
    const variant = generateVariationForGrade1Mock(item);
    setVariantProblems((prev) => ({
      ...prev,
      [item.id]: {
        ...variant,
        originalId: item.id,
        createdAt: Date.now(),
      },
    }));
    // Open explanation for variant when created
    setOpenExplanations((prev) => ({ ...prev, [`variant-${item.id}`]: false }));
  }

  return (
    <div style={{ marginTop: 24, marginBottom: 48 }}>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1f2733 0%, #2e3a4e 100%)',
          color: '#ffffff',
          borderRadius: 16,
          padding: '28px 24px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          marginBottom: 24,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 24 }}>🏛️</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b', letterSpacing: '0.05em' }}>
            시·도교육청 주관 고1 전국연합 학력평가 공식 기출 데이터베이스
          </span>
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 10px 0', color: '#ffffff' }}>
          고1 전국연합 기출문제 & 정답·해설 풀이 연구실
        </h2>
        <p style={{ margin: 0, fontSize: 14, color: '#cbd5e1', lineHeight: 1.6, maxWidth: 840 }}>
          <strong>고1 6월</strong>(90문항) · <strong>9월</strong>(91문항) · <strong>11월</strong>(60문항) · <strong>고2 3월(고1 전범위)</strong>(117문항)
          총 <strong>358문항</strong>의 기출문제 원문, 공식 정답, 단계별 <strong>통큰해설</strong>이 1:1로 매칭되어 있습니다.
          실시간 풀이 후 바로 해설을 확인하고, <strong>유사 변형 문제</strong>를 알고리즘으로 무한 생성하여 취약 유형을 마스터해보세요.
        </p>
      </div>

      {/* Session Tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        {SESSIONS.map((s) => {
          const active = selectedSession === s.key;
          return (
            <button
              key={s.key}
              onClick={() => {
                setSelectedSession(s.key);
                setPage(1);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '9px 16px',
                borderRadius: 10,
                border: active ? '1px solid #c23b32' : '1px solid #e2e8f0',
                background: active ? '#c23b32' : '#ffffff',
                color: active ? '#ffffff' : '#334155',
                fontSize: 14,
                fontWeight: active ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{s.icon}</span>
              <span>{s.label}</span>
              <span
                style={{
                  fontSize: 12,
                  padding: '2px 6px',
                  borderRadius: 12,
                  background: active ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                  color: active ? '#ffffff' : '#64748b',
                  fontWeight: 600,
                }}
              >
                {s.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter Toolbar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          padding: 16,
          background: '#f8fafc',
          borderRadius: 12,
          border: '1px solid #e2e8f0',
          marginBottom: 20,
          alignItems: 'center',
        }}
      >
        {/* Unit Selector */}
        <select
          value={selectedUnit}
          onChange={(e) => {
            setSelectedUnit(e.target.value);
            setPage(1);
          }}
          style={{
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid #cbd5e1',
            background: '#ffffff',
            fontSize: 13,
            fontWeight: 500,
            color: '#1e293b',
          }}
        >
          {UNITS.map((u) => (
            <option key={u.id} value={u.id}>
              {u.label}
            </option>
          ))}
        </select>

        {/* Points Selector */}
        <select
          value={selectedPoints}
          onChange={(e) => {
            setSelectedPoints(e.target.value);
            setPage(1);
          }}
          style={{
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid #cbd5e1',
            background: '#ffffff',
            fontSize: 13,
            fontWeight: 500,
            color: '#1e293b',
          }}
        >
          <option value="all">배점 전체</option>
          <option value="2">2점 문항 (기본개념)</option>
          <option value="3">3점 문항 (핵심유형)</option>
          <option value="4">4점 문항 (킬러·준킬러)</option>
        </select>

        {/* Search Input */}
        <div style={{ flex: 1, minWidth: 200 }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="문항 번호, 출처, 수식 키워드 검색..."
            style={{
              width: '100%',
              padding: '8px 14px',
              borderRadius: 8,
              border: '1px solid #cbd5e1',
              fontSize: 13,
              background: '#ffffff',
            }}
          />
        </div>

        <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>
          총 {filteredProblems.length}문항
        </div>
      </div>

      {/* Problem Cards Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {paginatedProblems.map((item) => {
          const isExpOpen = !!openExplanations[item.id];
          const userAns = selectedAnswers[item.id];
          const variant = variantProblems[item.id];
          const isVariantExpOpen = !!openExplanations[`variant-${item.id}`];

          return (
            <div
              key={item.id}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 14,
                padding: '24px 22px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                position: 'relative',
              }}
            >
              {/* Card Header Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: '#c23b32',
                    background: '#fef2f2',
                    padding: '3px 8px',
                    borderRadius: 6,
                  }}
                >
                  #{String(item.number).padStart(3, '0')}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#1e293b',
                    background: '#f1f5f9',
                    padding: '3px 8px',
                    borderRadius: 6,
                  }}
                >
                  {item.sourceLabel}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: item.points === 4 ? '#b91c1c' : item.points === 3 ? '#b45309' : '#15803d',
                    background: item.points === 4 ? '#fee2e2' : item.points === 3 ? '#fef3c7' : '#dcfce7',
                    padding: '3px 8px',
                    borderRadius: 6,
                  }}
                >
                  {item.points}점
                </span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#0369a1',
                    background: '#e0f2fe',
                    padding: '3px 8px',
                    borderRadius: 6,
                  }}
                >
                  {item.chapterName}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#475569',
                    background: '#f8fafc',
                    padding: '3px 6px',
                    borderRadius: 6,
                    border: '1px solid #e2e8f0',
                  }}
                >
                  {item.amcExam} 매핑: {item.amcTopic}
                </span>
                {item.accuracyRate && (
                  <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 'auto' }}>
                    정답률: {item.accuracyRate}%
                  </span>
                )}
              </div>

              {/* Question Text */}
              <div
                style={{
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: '#1e293b',
                  marginBottom: 16,
                  whiteSpace: 'pre-wrap',
                }}
              >
                <MathText value={item.question} />
              </div>

              {/* Choices (Multiple Choice) */}
              {item.type === 'multiple_choice' && item.choices && item.choices.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8, marginBottom: 16 }}>
                  {item.choices.map((choice, cIdx) => {
                    const cNum = cIdx + 1;
                    const isSelected = userAns === cNum;
                    const isCorrect = item.correctAnswer === cNum;
                    const showCorrectness = isExpOpen;

                    let bg = '#f8fafc';
                    let border = '#e2e8f0';
                    let textColor = '#334155';

                    if (showCorrectness) {
                      if (isCorrect) {
                        bg = '#ecfdf5';
                        border = '#10b981';
                        textColor = '#065f46';
                      } else if (isSelected) {
                        bg = '#fef2f2';
                        border = '#ef4444';
                        textColor = '#991b1b';
                      }
                    } else if (isSelected) {
                      bg = '#eff6ff';
                      border = '#3b82f6';
                      textColor = '#1d4ed8';
                    }

                    return (
                      <button
                        key={cIdx}
                        onClick={() => handleSelectAnswer(item.id, cNum)}
                        style={{
                          textAlign: 'left',
                          padding: '8px 12px',
                          borderRadius: 8,
                          border: `1px solid ${border}`,
                          background: bg,
                          color: textColor,
                          fontSize: 13,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <span style={{ fontWeight: 700, minWidth: 16 }}>{['①', '②', '③', '④', '⑤'][cIdx]}</span>
                        <span style={{ flex: 1 }}>
                          <MathText value={choice} />
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', paddingTop: 8, borderTop: '1px solid #f1f5f9' }}>
                <button
                  onClick={() => toggleExplanation(item.id)}
                  style={{
                    padding: '7px 14px',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    background: isExpOpen ? '#1e293b' : '#ffffff',
                    color: isExpOpen ? '#ffffff' : '#334155',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <span>{isExpOpen ? '📖 해설 접기' : '📖 정답 & 통큰해설 보기'}</span>
                </button>

                <button
                  onClick={() => handleGenerateVariant(item)}
                  style={{
                    padding: '7px 14px',
                    borderRadius: 8,
                    border: 'none',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: '#ffffff',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    boxShadow: '0 2px 6px rgba(217,119,6,0.25)',
                  }}
                >
                  <span>⚡ 이 유형 유사 문제 생성</span>
                </button>

                {isExpOpen && (
                  <span style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 700, color: '#16a34a' }}>
                    공식 정답: {item.answer}번
                  </span>
                )}
              </div>

              {/* Detailed Explanation Panel */}
              {isExpOpen && (
                <div
                  style={{
                    marginTop: 16,
                    padding: 16,
                    borderRadius: 10,
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: '#334155',
                  }}
                >
                  <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ color: '#c23b32' }}>💡</span>
                    <span>공식 정답 및 단계별 통큰해설</span>
                  </div>
                  <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                    <MathText value={item.explanation} />
                  </div>
                </div>
              )}

              {/* Variant Problem Card (Generated) */}
              {variant && (
                <div
                  style={{
                    marginTop: 20,
                    padding: 18,
                    borderRadius: 12,
                    background: '#fffbeb',
                    border: '2px dashed #f59e0b',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <span style={{ fontSize: 16 }}>⚡</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#b45309' }}>
                      실시간 알고리즘 생성 유사 변형 문제
                    </span>
                    <span style={{ fontSize: 11, background: '#fef3c7', color: '#92400e', padding: '2px 6px', borderRadius: 6, fontWeight: 700 }}>
                      NEW VARIANT
                    </span>
                  </div>

                  <div style={{ fontSize: 14, lineHeight: 1.7, color: '#1f2937', marginBottom: 14, whiteSpace: 'pre-wrap' }}>
                    <MathText value={variant.question} />
                  </div>

                  {variant.choices && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 8, marginBottom: 12 }}>
                      {variant.choices.map((c, cIdx) => (
                        <div
                          key={cIdx}
                          style={{
                            padding: '6px 10px',
                            background: '#ffffff',
                            borderRadius: 6,
                            border: '1px solid #fde68a',
                            fontSize: 13,
                          }}
                        >
                          <span style={{ fontWeight: 700, marginRight: 6 }}>{['①', '②', '③', '④', '⑤'][cIdx]}</span>
                          <MathText value={c} />
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button
                      onClick={() => toggleExplanation(`variant-${item.id}`)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 6,
                        border: '1px solid #d97706',
                        background: isVariantExpOpen ? '#d97706' : '#ffffff',
                        color: isVariantExpOpen ? '#ffffff' : '#b45309',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {isVariantExpOpen ? '변형 문제 해설 닫기' : '변형 문제 정답 & 풀이 보기'}
                    </button>
                    {isVariantExpOpen && (
                      <span style={{ fontSize: 12, fontWeight: 800, color: '#047857' }}>
                        정답: {variant.answer}번
                      </span>
                    )}
                  </div>

                  {isVariantExpOpen && (
                    <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: '#ffffff', border: '1px solid #fef3c7', fontSize: 13, lineHeight: 1.6 }}>
                      <MathText value={variant.explanation} />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 28 }}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              fontSize: 13,
              cursor: page === 1 ? 'not-allowed' : 'pointer',
              color: page === 1 ? '#94a3b8' : '#1e293b',
            }}
          >
            이전
          </button>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b', margin: '0 8px' }}>
            {page} / {totalPages} 페이지
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              fontSize: 13,
              cursor: page === totalPages ? 'not-allowed' : 'pointer',
              color: page === totalPages ? '#94a3b8' : '#1e293b',
            }}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}
