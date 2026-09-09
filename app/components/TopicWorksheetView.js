'use client';

import { useState, useMemo, useEffect } from 'react';
import InteractiveProblemCard from './InteractiveProblemCard';

export default function TopicWorksheetView({
  category = 'amc', // 'amc' | 'csat'
  subjectLabel = '',
  unit,
  problems = [],
  onBack,
  language = 'ko',
  onGenerateVariant,
  variantProblem,
  onCloseVariant,
  hideArchive = false,
  onShowArchive,
}) {
  // Page size (문항 수 선택): 5, 10, 15, 20, 0 (0 means All)
  const [pageSize, setPageSize] = useState(10);
  const [currentRound, setCurrentRound] = useState(1);
  const [mode, setMode] = useState('practice'); // 'practice' | 'study'
  const [userAnswers, setUserAnswers] = useState({});
  const [gradedRounds, setGradedRounds] = useState({});
  const [expandAllSolutions, setExpandAllSolutions] = useState(false);

  const totalCount = problems.length;

  // Calculate rounds
  const effectivePageSize = pageSize === 0 ? totalCount : pageSize;
  const totalRounds = totalCount > 0 ? Math.max(1, Math.ceil(totalCount / effectivePageSize)) : 1;

  // Clamp currentRound when pageSize changes
  useEffect(() => {
    if (currentRound > totalRounds) {
      setCurrentRound(1);
    }
  }, [totalRounds, currentRound]);

  // Problems for active round
  const activeProblems = useMemo(() => {
    if (totalCount === 0) return [];
    if (pageSize === 0) return problems;
    const start = (currentRound - 1) * pageSize;
    const end = Math.min(start + pageSize, totalCount);
    return problems.slice(start, end);
  }, [problems, currentRound, pageSize, totalCount]);

  const startIndex = pageSize === 0 ? 0 : (currentRound - 1) * pageSize;
  const endIndex = pageSize === 0 ? totalCount : Math.min(startIndex + pageSize, totalCount);

  // Round stats
  const isRoundGraded = Boolean(gradedRounds[currentRound]);
  const roundAnsweredCount = activeProblems.filter(
    (p) => userAnswers[p.id] !== undefined && userAnswers[p.id] !== null && userAnswers[p.id] !== ''
  ).length;

  const roundCorrectCount = activeProblems.filter((p) => {
    const userAns = userAnswers[p.id];
    const correct = p.answer !== undefined ? p.answer : p.correctAnswer;
    return userAns !== undefined && userAns !== null && String(userAns) === String(correct);
  }).length;

  const roundTotalPoints = activeProblems.reduce((sum, p) => sum + (p.points || (category === 'amc' ? 1 : 2)), 0);
  const roundEarnedPoints = activeProblems.reduce((sum, p) => {
    const userAns = userAnswers[p.id];
    const correct = p.answer !== undefined ? p.answer : p.correctAnswer;
    return String(userAns) === String(correct) ? sum + (p.points || (category === 'amc' ? 1 : 2)) : sum;
  }, 0);

  const handleSelectAnswer = (problemId, ans) => {
    setUserAnswers((prev) => ({ ...prev, [problemId]: ans }));
  };

  const handleGradeRound = () => {
    setGradedRounds((prev) => ({ ...prev, [currentRound]: true }));
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleResetRoundAnswers = () => {
    if (window.confirm(language === 'ko' ? '현재 회차의 답안을 초기화하시겠습니까?' : 'Reset answers for this round?')) {
      setUserAnswers((prev) => {
        const next = { ...prev };
        for (const p of activeProblems) {
          delete next[p.id];
        }
        return next;
      });
      setGradedRounds((prev) => {
        const next = { ...prev };
        delete next[currentRound];
        return next;
      });
    }
  };

  const handleNextRound = () => {
    if (currentRound < totalRounds) {
      setCurrentRound((r) => r + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevRound = () => {
    if (currentRound > 1) {
      setCurrentRound((r) => r - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="topic-worksheet-view" style={{ maxWidth: 1040, margin: '0 auto', paddingBottom: 80 }}>
      {/* 1. Breadcrumb & Return to Topics */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <p style={{ fontSize: 13, color: 'var(--ink-soft, #6b7280)', margin: 0 }}>
          <a href="/" style={{ color: 'var(--ink-soft)', textDecoration: 'none' }}>홈</a> /{' '}
          <a href={category === 'amc' ? '/amc.html' : '/csat.html'} style={{ color: 'var(--ink-soft)', textDecoration: 'none' }}>
            {category === 'amc' ? 'AMC 기출문제' : '수능 기출문제'}
          </a> /{' '}
          <button
            type="button"
            onClick={onBack}
            style={{ background: 'none', border: 'none', color: 'var(--ink-soft)', fontSize: 13, cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
          >
            단원별 기출문제
          </button> /{' '}
          <span style={{ fontWeight: 600, color: 'var(--ink, #111827)' }}>{unit?.label}</span>
        </p>

        <button
          type="button"
          onClick={onBack}
          className="button button-secondary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 14px',
            fontSize: 13,
            fontWeight: 700,
            borderRadius: 8,
            cursor: 'pointer',
          }}
        >
          <span>←</span>
          <span>{language === 'ko' ? '전체 단원 목록으로 돌아가기' : 'Back to Topic List'}</span>
        </button>
      </div>

      {/* 2. Top Worksheet Paper Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
          border: '1.5px solid var(--paper-line, #e5e7eb)',
          borderRadius: 16,
          padding: '24px 28px',
          marginBottom: 20,
          boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
              {subjectLabel && (
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    padding: '2px 10px',
                    borderRadius: 12,
                    background: category === 'amc' ? 'rgba(37, 99, 235, 0.1)' : 'rgba(147, 51, 234, 0.1)',
                    color: category === 'amc' ? '#1d4ed8' : '#7e22ce',
                    border: `1px solid ${category === 'amc' ? 'rgba(37, 99, 235, 0.25)' : 'rgba(147, 51, 234, 0.25)'}`,
                  }}
                >
                  {subjectLabel}
                </span>
              )}
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  padding: '2px 9px',
                  borderRadius: 12,
                  background: 'var(--paper-line, #e5e7eb)',
                  color: 'var(--ink, #374151)',
                }}
              >
                총 {totalCount}문항 수록
              </span>
            </div>

            <h1
              className="font-display"
              style={{
                fontSize: 26,
                margin: '0 0 6px',
                color: 'var(--ink, #111827)',
                letterSpacing: '-0.02em',
              }}
            >
              📝 {unit?.label}{' '}
              {unit?.labelEn && <span style={{ fontSize: 18, fontWeight: 500, color: 'var(--ink-soft)' }}>({unit.labelEn})</span>}
            </h1>

            <p style={{ color: 'var(--ink-soft, #4b5563)', margin: '0 0 10px', fontSize: 14 }}>
              {unit?.desc || (category === 'amc' ? '미국수학경시 AMC 8 역대 실전 기출 학습지' : '대학수학능력시험 실전 기출 학습지')}
            </p>

            {/* Curriculum Mapping Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
              {unit?.vol1Chapter && (
                <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 6, background: 'rgba(217, 119, 6, 0.12)', color: '#b45309', border: '1px solid rgba(217, 119, 6, 0.25)' }}>
                  📙 Vol 1: {unit.vol1Chapter}
                </span>
              )}
              {unit?.vol2Chapter && (
                <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 6, background: 'rgba(147, 51, 234, 0.12)', color: '#7e22ce', border: '1px solid rgba(147, 51, 234, 0.25)' }}>
                  📘 Vol 2: {unit.vol2Chapter}
                </span>
              )}
              {unit?.intlCourse && (
                <a
                  href={unit.intlCourse.href}
                  style={{ textDecoration: 'none', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 6, background: 'rgba(37, 99, 235, 0.08)', color: '#1d4ed8', border: '1px solid rgba(37, 99, 235, 0.2)' }}
                >
                  🌐 국제학교: {language === 'ko' ? unit.intlCourse.labelKo : unit.intlCourse.label} ↗
                </a>
              )}
              {unit?.domain && (
                <a
                  href={unit.domain.href}
                  style={{ textDecoration: 'none', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 6, background: 'rgba(16, 185, 129, 0.08)', color: '#047857', border: '1px solid rgba(16, 185, 129, 0.2)' }}
                >
                  📐 영역: {language === 'ko' ? unit.domain.labelKo : unit.domain.label} ↗
                </a>
              )}
              {unit?.revised2022 && (
                <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 6, background: 'rgba(99, 102, 241, 0.1)', color: '#4338ca', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
                  🏛️ 2022개정: {unit.revised2022}
                </span>
              )}
            </div>
          </div>

          {/* Action buttons: Algorithmic Variant Generator + Print Worksheet */}
          <div className="no-print" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {onGenerateVariant && (
              <button
                type="button"
                onClick={onGenerateVariant}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 14px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(79, 70, 229, 0.25)',
                }}
              >
                <span>✨</span>
                <span>{language === 'ko' ? '유사 문제 무한 생성' : 'Generate Similar Variant'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => window.print()}
              className="button button-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                fontSize: 13,
                fontWeight: 700,
                borderRadius: 8,
                cursor: 'pointer',
              }}
              title="현재 회차 문제지를 인쇄하거나 PDF로 저장합니다."
            >
              <span>🖨️</span>
              <span>{language === 'ko' ? '시험지 인쇄 / PDF' : 'Print Worksheet'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Generated Variant Section (if any) */}
      {variantProblem && (
        <div
          className="no-print"
          style={{
            background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(245, 158, 11, 0.06) 100%)',
            border: '2px dashed rgba(99, 102, 241, 0.35)',
            borderRadius: 16,
            padding: '20px 22px',
            marginBottom: 24,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: '#4338ca' }}>
                ✨ {language === 'ko' ? '실시간 생성된 유사 변형 문제' : 'Algorithmic Variant Problem'}
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '1px 6px', borderRadius: 10, background: '#4338ca', color: '#ffffff' }}>
                NEW
              </span>
            </div>
            <button
              type="button"
              onClick={onCloseVariant}
              style={{ fontSize: 13, background: 'none', border: 'none', color: 'var(--ink-soft)', cursor: 'pointer', fontWeight: 600 }}
            >
              {language === 'ko' ? '닫기 ✕' : 'Close ✕'}
            </button>
          </div>

          <InteractiveProblemCard
            problem={{
              ...variantProblem,
              examType: category,
              choiceMarkerType: category === 'amc' ? 'letters' : 'numbers',
              sourceLabel: language === 'ko' ? '알고리즘 유사 변형' : 'Algorithmic Variant',
            }}
            userAnswer={userAnswers[variantProblem.id] ?? null}
            onSelectAnswer={(ans) => handleSelectAnswer(variantProblem.id, ans)}
            isExamMode={false}
            showResult={false}
            language={language}
          />
        </div>
      )}

      {/* When arriving via the curriculum-tab AMC badge, the raw archived (always-English) problem
          list stays hidden by default — only the localized variant above is shown, plus an explicit,
          honestly-labeled opt-in to the English archive below. */}
      {hideArchive ? (
        <div
          className="no-print"
          style={{
            textAlign: 'center',
            padding: '18px 20px',
            background: 'var(--card-bg, #ffffff)',
            border: '1px dashed var(--paper-line, #d1d5db)',
            borderRadius: 14,
            color: 'var(--ink-soft)',
            fontSize: 13,
          }}
        >
          <p style={{ margin: '0 0 10px' }}>
            {language === 'ko'
              ? '실제 AMC 기출문제 원문은 대회 당시 발표된 영어 원문 그대로 보존되어 있습니다.'
              : 'The real archived AMC exam problems are kept exactly as originally published, in English.'}
          </p>
          <button
            type="button"
            onClick={onShowArchive}
            style={{ background: 'none', border: 'none', color: 'var(--primary, #2563eb)', fontSize: 13, fontWeight: 700, cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
          >
            {language === 'ko' ? `실제 기출문제 원문 보기 (영어, 총 ${totalCount}문항) →` : `View the original archived problems (English, ${totalCount} total) →`}
          </button>
        </div>
      ) : (
        <>
      {/* 3. Worksheet Controls Toolbar (문항 수 선택 & 회차별 분할 선택) */}
      <div
        className="no-print"
        style={{
          background: 'var(--card-bg, #ffffff)',
          border: '1px solid var(--paper-line, #e5e7eb)',
          borderRadius: 14,
          padding: '16px 20px',
          marginBottom: 24,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          display: 'grid',
          gap: 14,
        }}
      >
        {/* Control Row 1: 문항 수 선택 (Questions per Set / Page) */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink, #111827)' }}>
              📄 {language === 'ko' ? '한 화면 문항 수:' : 'Questions Per Sheet:'}
            </span>
            {[
              { size: 5, label: '5문항' },
              { size: 10, label: '10문항 (추천)' },
              { size: 15, label: '15문항' },
              { size: 20, label: '20문항' },
              { size: 0, label: '전체 (한 화면)' },
            ].map((opt) => {
              const active = pageSize === opt.size;
              return (
                <button
                  key={opt.size}
                  type="button"
                  onClick={() => {
                    setPageSize(opt.size);
                    setCurrentRound(1);
                  }}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: active ? 700 : 500,
                    border: active ? '1.5px solid var(--primary, #2563eb)' : '1px solid var(--paper-line, #d1d5db)',
                    background: active ? 'rgba(37, 99, 235, 0.08)' : 'var(--card-bg, #ffffff)',
                    color: active ? 'var(--primary, #2563eb)' : 'var(--ink, #374151)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* Mode switch: Practice vs Study Mode */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              type="button"
              onClick={() => setMode('practice')}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: mode === 'practice' ? 700 : 500,
                border: mode === 'practice' ? '1.5px solid #111827' : '1px solid var(--paper-line, #d1d5db)',
                background: mode === 'practice' ? '#111827' : 'transparent',
                color: mode === 'practice' ? '#ffffff' : 'var(--ink, #374151)',
                cursor: 'pointer',
              }}
            >
              ✏️ {language === 'ko' ? '실전 풀이 모드' : 'Practice Mode'}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('study');
                setExpandAllSolutions(true);
              }}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: mode === 'study' ? 700 : 500,
                border: mode === 'study' ? '1.5px solid #2563eb' : '1px solid var(--paper-line, #d1d5db)',
                background: mode === 'study' ? '#2563eb' : 'transparent',
                color: mode === 'study' ? '#ffffff' : 'var(--ink, #374151)',
                cursor: 'pointer',
              }}
            >
              📖 {language === 'ko' ? '해설 함께 보기' : 'Study with Solutions'}
            </button>
          </div>
        </div>

        {/* Control Row 2: 회차별 분할 선택바 (Round / Set Pagination) */}
        {totalRounds > 1 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
              paddingTop: 12,
              borderTop: '1px solid var(--paper-line, #e5e7eb)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink, #111827)', marginRight: 4 }}>
                🎯 {language === 'ko' ? '회차 선택:' : 'Round / Set:'}
              </span>
              {Array.from({ length: totalRounds }, (_, i) => i + 1).map((roundIdx) => {
                const active = currentRound === roundIdx;
                const rStart = (roundIdx - 1) * pageSize + 1;
                const rEnd = Math.min(roundIdx * pageSize, totalCount);
                const isGraded = Boolean(gradedRounds[roundIdx]);

                return (
                  <button
                    key={roundIdx}
                    type="button"
                    onClick={() => setCurrentRound(roundIdx)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: active ? 800 : 600,
                      border: active ? '2px solid var(--primary, #2563eb)' : '1px solid var(--paper-line, #d1d5db)',
                      background: active ? 'var(--primary, #2563eb)' : 'var(--card-bg, #ffffff)',
                      color: active ? '#ffffff' : 'var(--ink, #374151)',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      boxShadow: active ? '0 2px 6px rgba(37, 99, 235, 0.25)' : 'none',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>{roundIdx}회차</span>
                    <span style={{ fontSize: 11, opacity: active ? 0.9 : 0.65 }}>({rStart}~{rEnd}번)</span>
                    {isGraded && <span>✓</span>}
                  </button>
                );
              })}
            </div>

            {/* Prev / Next round controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                type="button"
                onClick={handlePrevRound}
                disabled={currentRound <= 1}
                className="button button-secondary"
                style={{
                  padding: '5px 10px',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: currentRound <= 1 ? 'not-allowed' : 'pointer',
                  opacity: currentRound <= 1 ? 0.5 : 1,
                }}
              >
                ◀ {language === 'ko' ? '이전 회차' : 'Prev Round'}
              </button>
              <button
                type="button"
                onClick={handleNextRound}
                disabled={currentRound >= totalRounds}
                className="button button-secondary"
                style={{
                  padding: '5px 10px',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: currentRound >= totalRounds ? 'not-allowed' : 'pointer',
                  opacity: currentRound >= totalRounds ? 0.5 : 1,
                }}
              >
                {language === 'ko' ? '다음 회차' : 'Next Round'} ▶
              </button>
            </div>
          </div>
        )}

        {/* Control Row 3: Current Round Status & Quick Tools */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 10,
            paddingTop: 10,
            borderTop: '1px solid var(--paper-line, #e5e7eb)',
            fontSize: 13,
            color: 'var(--ink-soft)',
          }}
        >
          <div>
            <span>
              {language === 'ko'
                ? `총 ${totalCount}문항 중 ${startIndex + 1}~${endIndex}번 풀이 중 (${currentRound}회차) · 완료: ${roundAnsweredCount}/${activeProblems.length}문항`
                : `Showing ${startIndex + 1}–${endIndex} of ${totalCount} (Round ${currentRound}) · Completed: ${roundAnsweredCount}/${activeProblems.length}`}
            </span>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => setExpandAllSolutions((v) => !v)}
              style={{ background: 'none', border: 'none', color: 'var(--primary, #2563eb)', fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: 0 }}
            >
              {expandAllSolutions ? (language === 'ko' ? '해설 모두 접기 ▲' : 'Collapse Solutions ▲') : (language === 'ko' ? '해설 모두 펼치기 ▼' : 'Expand All Solutions ▼')}
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={handleResetRoundAnswers}
              style={{ background: 'none', border: 'none', color: 'var(--ink-soft)', fontSize: 12, cursor: 'pointer', padding: 0 }}
            >
              {language === 'ko' ? '답안 초기화 ↺' : 'Reset ↺'}
            </button>
          </div>
        </div>
      </div>

      {/* 4. Problem-First Worksheet Cards (문제 본문 우선 & 출제 정보는 문제 옆에 배지로 배치) */}
      {activeProblems.length === 0 ? (
        <div style={{ padding: '48px 20px', textAlign: 'center', background: 'var(--card-bg)', border: '1px solid var(--paper-line)', borderRadius: 14 }}>
          <p style={{ color: 'var(--ink-soft)', margin: 0, fontSize: 15 }}>
            {language === 'ko' ? '이 단원에 등록된 문항이 없습니다.' : 'No problems available in this topic yet.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {activeProblems.map((problem, localIdx) => {
            const absoluteNumber = startIndex + localIdx + 1;
            const displaySource = problem.sourceLabel || (
              category === 'amc'
                ? `${problem.year} AMC ${problem.level || 8} · #${problem.problemNumber || absoluteNumber}`
                : `${problem.year || 2024}학년도 수능 · #${problem.problemNumber || problem.number || absoluteNumber}`
            );

            const isAmc = category === 'amc';
            const effectiveChoices = (problem.choices && problem.choices.length > 0)
              ? problem.choices
              : (isAmc ? ['(A)', '(B)', '(C)', '(D)', '(E)'] : []);
            const problemType = isAmc ? 'multiple_choice' : (effectiveChoices.length > 0 ? 'multiple_choice' : 'subjective');

            return (
              <div key={problem.id || `prob-${absoluteNumber}`}>
                <InteractiveProblemCard
                  problem={{
                    ...problem,
                    number: absoluteNumber, // Sequential problem number on the worksheet (01, 02, 03...)
                    points: problem.points || (category === 'amc' ? 1 : 2),
                    type: problemType,
                    question: problem.question,
                    choices: effectiveChoices,
                    correctAnswer: problem.answer !== undefined ? parseInt(problem.answer, 10) : problem.correctAnswer,
                    explanation: problem.explanation,
                    unit: unit?.label,
                    sourceLabel: displaySource, // 출제 정보가 문제 번호 옆에 배지로 배치
                    examType: category,
                    choiceMarkerType: category === 'amc' ? 'letters' : 'numbers',
                  }}
                  userAnswer={userAnswers[problem.id] ?? null}
                  onSelectAnswer={(ans) => handleSelectAnswer(problem.id, ans)}
                  isExamMode={false}
                  showResult={isRoundGraded}
                  language={language}
                  forceSolutionOpen={expandAllSolutions || mode === 'study'}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Round Completion & Scoring Bottom Bar */}
      {activeProblems.length > 0 && (
        <div
          className="no-print"
          style={{
            marginTop: 28,
            background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
            border: '1.5px solid var(--paper-line, #e5e7eb)',
            borderRadius: 16,
            padding: '22px 26px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--ink, #111827)' }}>
                🏁 {currentRound}회차 학습 완료 점검
              </span>
              <span style={{ fontSize: 12, fontWeight: 600, padding: '2px 8px', borderRadius: 10, background: 'var(--paper-line, #e5e7eb)', color: 'var(--ink-soft)' }}>
                {roundAnsweredCount}/{activeProblems.length} 문항 완료
              </span>
            </div>

            {isRoundGraded ? (
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: roundCorrectCount === activeProblems.length ? '#059669' : '#d97706' }}>
                🎉 채점 결과: {roundCorrectCount} / {activeProblems.length} 정답 (획득: {roundEarnedPoints} / {roundTotalPoints}점 · 정답률 {Math.round((roundCorrectCount / activeProblems.length) * 100)}%)
              </p>
            ) : (
              <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-soft)' }}>
                {language === 'ko'
                  ? '문제를 모두 풀고 "이번 회차 채점하기"를 누르면 정답과 오답이 한눈에 채점됩니다.'
                  : 'Click "Grade This Round" when done to review your score and solutions.'}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button
              type="button"
              onClick={handleGradeRound}
              style={{
                padding: '10px 20px',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 800,
                background: isRoundGraded ? '#059669' : 'var(--primary, #2563eb)',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
              }}
            >
              {isRoundGraded ? (language === 'ko' ? '다시 채점하기 ↺' : 'Re-grade ↺') : (language === 'ko' ? '이번 회차 채점하기 ✓' : 'Grade This Round ✓')}
            </button>

            {currentRound < totalRounds && (
              <button
                type="button"
                onClick={handleNextRound}
                style={{
                  padding: '10px 20px',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 800,
                  background: '#111827',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                }}
              >
                {language === 'ko' ? `다음 회차 (${currentRound + 1}회차) 풀기 ▶` : `Next Round (${currentRound + 1}) ▶`}
              </button>
            )}
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}
