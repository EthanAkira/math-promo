'use client';

import { useState, useEffect, useRef } from 'react';
import InteractiveProblemCard from './InteractiveProblemCard';

export default function InteractiveExamWorkspace({
  title,
  subtitle,
  problems = [],
  language = 'ko',
  onBack,
}) {
  const [mode, setMode] = useState('practice'); // 'practice' | 'exam'
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && !submitted) {
      interval = setInterval(() => setSecondsElapsed((s) => s + 1), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, submitted]);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleSelectAnswer = (problemId, answerIdx) => {
    setAnswers((prev) => ({ ...prev, [problemId]: answerIdx }));
  };

  const answeredCount = Object.keys(answers).filter(
    (k) => answers[k] !== undefined && answers[k] !== null && answers[k] !== ''
  ).length;

  const totalPoints = problems.reduce((acc, p) => acc + (p.points || 4), 0);
  const earnedPoints = problems.reduce((acc, p) => {
    const userAns = answers[p.id || p.number];
    return String(userAns) === String(p.correctAnswer) ? acc + (p.points || 4) : acc;
  }, 0);

  const correctCount = problems.filter(
    (p) => String(answers[p.id || p.number]) === String(p.correctAnswer)
  ).length;

  const handleSubmitExam = () => {
    if (answeredCount < problems.length) {
      const confirmSubmit = window.confirm(
        language === 'ko'
          ? `아직 풀지 않은 문제가 있습니다 (${answeredCount}/${problems.length} 완료). 제출하시겠습니까?`
          : `You have unanswered questions (${answeredCount}/${problems.length}). Submit anyway?`
      );
      if (!confirmSubmit) return;
    }
    setSubmitted(true);
    setIsTimerRunning(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToProblem = (num) => {
    const el = document.getElementById(`problem-${num}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="interactive-exam-workspace" style={{ maxWidth: '1080px', margin: '0 auto' }}>
      {/* Top Workspace Bar */}
      <div
        style={{
          position: 'sticky',
          top: '12px',
          zIndex: 30,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          border: '1.5px solid var(--paper-line, #d8c9a8)',
          borderRadius: '16px',
          padding: '14px 20px',
          marginBottom: '24px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              style={{
                fontSize: '13px',
                fontWeight: '700',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid var(--paper-line, #d8c9a8)',
                background: '#fcfaf6',
                cursor: 'pointer',
              }}
            >
              ← {language === 'ko' ? '목록으로' : 'Back'}
            </button>
          ) : null}
          <div>
            <h1 style={{ fontSize: '18px', margin: 0, fontWeight: '800', color: 'var(--ink, #1f2733)' }}>
              {title}
            </h1>
            {subtitle ? (
              <div style={{ fontSize: '12.5px', color: 'var(--ink-soft, #718096)' }}>{subtitle}</div>
            ) : null}
          </div>
        </div>

        {/* Mode Selector & Timer & Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Mode Switcher */}
          <div
            style={{
              display: 'flex',
              background: '#ede7db',
              padding: '3px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: '700',
            }}
          >
            <button
              type="button"
              onClick={() => {
                setMode('practice');
                setSubmitted(false);
              }}
              style={{
                padding: '5px 12px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                background: mode === 'practice' ? '#ffffff' : 'transparent',
                color: mode === 'practice' ? 'var(--blue, #2a5c8a)' : 'var(--ink-soft, #718096)',
                boxShadow: mode === 'practice' ? '0 2px 6px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              📖 {language === 'ko' ? '연습 모드' : 'Practice'}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('exam');
                setSubmitted(false);
              }}
              style={{
                padding: '5px 12px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                background: mode === 'exam' ? '#ffffff' : 'transparent',
                color: mode === 'exam' ? 'var(--red-dark, #8f2a24)' : 'var(--ink-soft, #718096)',
                boxShadow: mode === 'exam' ? '0 2px 6px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              ⏱️ {language === 'ko' ? '실전 모드' : 'Exam Test'}
            </button>
          </div>

          {/* Timer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#fbf8f2',
              border: '1px solid var(--paper-line, #d8c9a8)',
              padding: '5px 12px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '800',
              color: 'var(--ink, #1f2733)',
            }}
          >
            <span>⏱️</span>
            <span>{formatTime(secondsElapsed)}</span>
          </div>

          {/* Progress / Status */}
          <div style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--ink, #1f2733)' }}>
            {language === 'ko' ? '진행도:' : 'Progress:'}{' '}
            <span style={{ color: 'var(--blue, #2a5c8a)' }}>{answeredCount}</span> / {problems.length}
          </div>

          {mode === 'exam' && !submitted ? (
            <button
              type="button"
              onClick={handleSubmitExam}
              style={{
                fontSize: '13.5px',
                fontWeight: '800',
                padding: '7px 18px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, var(--red, #c23b32) 0%, var(--red-dark, #8f2a24) 100%)',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(194,59,50,0.3)',
              }}
            >
              {language === 'ko' ? '제출 및 채점하기' : 'Submit Exam'}
            </button>
          ) : null}
        </div>
      </div>

      {/* Exam Result Report Card (Shown upon submission in Exam Mode) */}
      {mode === 'exam' && submitted ? (
        <div
          style={{
            background: 'linear-gradient(145deg, #faf6ee 0%, #f0e6d2 100%)',
            border: '2px solid var(--gold, #c99a3e)',
            borderRadius: '18px',
            padding: '24px 28px',
            marginBottom: '32px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            textAlign: 'center',
          }}
        >
          <h2 style={{ fontSize: '24px', color: 'var(--ink, #1f2733)', margin: '0 0 10px', fontFamily: "'Song Myung', serif" }}>
            🏆 {language === 'ko' ? '시험 결과 성적표' : 'Exam Score Report'}
          </h2>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '28px',
              margin: '18px 0',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div style={{ fontSize: '13px', color: 'var(--ink-soft, #718096)', fontWeight: '700' }}>
                {language === 'ko' ? '총 득점' : 'Total Score'}
              </div>
              <div style={{ fontSize: '32px', fontWeight: '900', color: 'var(--red-dark, #8f2a24)' }}>
                {earnedPoints} <span style={{ fontSize: '18px', color: 'var(--ink-soft)' }}>/ {totalPoints}점</span>
              </div>
            </div>
            <div style={{ width: '1px', height: '40px', background: 'var(--paper-line, #d8c9a8)' }} />
            <div>
              <div style={{ fontSize: '13px', color: 'var(--ink-soft, #718096)', fontWeight: '700' }}>
                {language === 'ko' ? '정답률' : 'Accuracy'}
              </div>
              <div style={{ fontSize: '32px', fontWeight: '900', color: 'var(--blue, #2a5c8a)' }}>
                {Math.round((correctCount / (problems.length || 1)) * 100)}%
              </div>
            </div>
            <div style={{ width: '1px', height: '40px', background: 'var(--paper-line, #d8c9a8)' }} />
            <div>
              <div style={{ fontSize: '13px', color: 'var(--ink-soft, #718096)', fontWeight: '700' }}>
                {language === 'ko' ? '소요 시간' : 'Time Taken'}
              </div>
              <div style={{ fontSize: '26px', fontWeight: '900', color: 'var(--ink, #1f2733)' }}>
                {formatTime(secondsElapsed)}
              </div>
            </div>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--ink-soft, #718096)', margin: 0 }}>
            {language === 'ko'
              ? '아래 각 문제의 상세 해설과 정오답 결과를 확인하며 오답을 복습하세요.'
              : 'Review your correct/incorrect answers and detailed explanations below.'}
          </p>
        </div>
      ) : null}

      {/* Main Layout: Left Questions + Sticky OMR Quick Navigation */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 110px', gap: '24px', alignItems: 'start' }}>
        {/* Left: Problems List */}
        <div>
          {problems.map((problem) => (
            <InteractiveProblemCard
              key={problem.id || problem.number}
              problem={problem}
              userAnswer={answers[problem.id || problem.number]}
              onSelectAnswer={handleSelectAnswer}
              isExamMode={mode === 'exam'}
              showResult={submitted}
              language={language}
            />
          ))}
        </div>

        {/* Right: Sticky OMR Quick Navigation Bar */}
        <aside
          style={{
            position: 'sticky',
            top: '90px',
            background: 'var(--card-bg, #ffffff)',
            border: '1px solid var(--paper-line, #d8c9a8)',
            borderRadius: '14px',
            padding: '14px 10px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--ink-soft, #718096)', marginBottom: '10px' }}>
            OMR 빠른 이동
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            {problems.map((p) => {
              const isAns = answers[p.id || p.number] !== undefined && answers[p.id || p.number] !== null && answers[p.id || p.number] !== '';
              const isCorr = submitted && String(answers[p.id || p.number]) === String(p.correctAnswer);
              const isWrong = submitted && isAns && !isCorr;

              let btnBg = isAns ? 'var(--blue, #2a5c8a)' : '#f3ede2';
              let btnColor = isAns ? '#ffffff' : 'var(--ink, #1f2733)';

              if (submitted) {
                if (isCorr) {
                  btnBg = '#2f6e5c';
                  btnColor = '#ffffff';
                } else if (isWrong) {
                  btnBg = '#c8283f';
                  btnColor = '#ffffff';
                }
              }

              return (
                <button
                  key={p.number}
                  type="button"
                  onClick={() => scrollToProblem(p.number)}
                  style={{
                    padding: '6px 0',
                    borderRadius: '6px',
                    border: 'none',
                    background: btnBg,
                    color: btnColor,
                    fontSize: '12px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    transition: 'transform 0.1s ease',
                  }}
                  title={`문제 ${p.number}번으로 이동`}
                >
                  {p.number}
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}
