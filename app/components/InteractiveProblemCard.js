'use client';

import { useState } from 'react';
import LatexMath from './LatexMath';
import NoteCanvas from './NoteCanvas';

const CHOICE_SYMBOLS = ['①', '②', '③', '④', '⑤'];

export default function InteractiveProblemCard({
  problem,
  userAnswer,
  onSelectAnswer,
  isExamMode = false,
  showResult = false,
  language = 'ko',
}) {
  const [scratchpadOpen, setScratchpadOpen] = useState(false);
  const [solutionOpen, setSolutionOpen] = useState(false);
  const [checkedInPractice, setCheckedInPractice] = useState(false);

  const {
    id,
    number,
    points,
    type = 'multiple_choice', // 'multiple_choice' | 'subjective'
    question,
    choices = [],
    figureSvg,
    figureUrl,
    correctAnswer, // 0-based index or string number
    explanation,
    unit,
  } = problem;

  const isAnswered = userAnswer !== undefined && userAnswer !== null && userAnswer !== '';
  const isCorrect = isAnswered && String(userAnswer) === String(correctAnswer);

  const displayResult = isExamMode ? showResult : checkedInPractice;

  return (
    <div
      id={`problem-${number}`}
      className="interactive-problem-card"
      style={{
        background: 'var(--card-bg, #ffffff)',
        border: '1px solid var(--paper-line, #e2d9c8)',
        borderRadius: '16px',
        padding: '24px 22px',
        marginBottom: '28px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        position: 'relative',
        transition: 'border-color 0.2s ease',
      }}
    >
      {/* Top Meta Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '14px',
          borderBottom: '1px solid var(--paper-line, #e2d9c8)',
          paddingBottom: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              fontSize: '18px',
              fontWeight: '900',
              color: 'var(--red-dark, #8f2a24)',
              fontFamily: "'Song Myung', serif",
            }}
          >
            {language === 'ko' ? `[문제 ${number}]` : `[Problem ${number}]`}
          </span>
          {points ? (
            <span
              style={{
                fontSize: '12px',
                fontWeight: '700',
                padding: '2px 8px',
                borderRadius: '999px',
                background: 'rgba(201, 154, 62, 0.15)',
                color: 'var(--gold, #a87926)',
                border: '1px solid rgba(201, 154, 62, 0.35)',
              }}
            >
              {points}점
            </span>
          ) : null}
          {unit ? (
            <span
              style={{
                fontSize: '12px',
                color: 'var(--ink-soft, #718096)',
                background: 'rgba(0,0,0,0.04)',
                padding: '2px 8px',
                borderRadius: '6px',
              }}
            >
              {unit}
            </span>
          ) : null}
        </div>

        {/* Action buttons: Scratchpad toggle */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setScratchpadOpen((v) => !v)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '13px',
              fontWeight: '600',
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid var(--gold, #c99a3e)',
              background: scratchpadOpen ? 'rgba(201, 154, 62, 0.2)' : 'transparent',
              color: 'var(--ink, #1f2733)',
              cursor: 'pointer',
            }}
          >
            <span>✍️</span>
            <span>{scratchpadOpen ? (language === 'ko' ? '필기장 닫기' : 'Hide Notes') : (language === 'ko' ? '태블릿 필기장' : 'Scratchpad')}</span>
          </button>
        </div>
      </div>

      {/* Question Body with LaTeX */}
      <div
        style={{
          fontSize: '16.5px',
          lineHeight: '1.85',
          color: 'var(--ink, #1f2733)',
          marginBottom: '18px',
          fontFamily: "'Gowun Batang', serif",
        }}
      >
        <LatexMath text={question} />
      </div>

      {/* SVG / Graphic Figure if available */}
      {figureSvg ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '18px 0',
            padding: '12px',
            background: '#faf7f0',
            borderRadius: '12px',
            border: '1px solid #e8decb',
          }}
          dangerouslySetInnerHTML={{ __html: figureSvg }}
        />
      ) : null}

      {figureUrl ? (
        <div style={{ textAlign: 'center', margin: '18px 0' }}>
          <img
            src={figureUrl}
            alt={`Figure for problem ${number}`}
            style={{ maxWidth: '100%', maxHeight: '280px', borderRadius: '8px' }}
          />
        </div>
      ) : null}

      {/* Multiple Choice Options or Subjective Input */}
      {type === 'multiple_choice' ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: choices.length <= 5 ? 'repeat(auto-fit, minmax(140px, 1fr))' : '1fr',
            gap: '10px',
            margin: '20px 0 14px',
          }}
        >
          {choices.map((choiceText, idx) => {
            const isSelected = String(userAnswer) === String(idx);
            let btnBg = 'rgba(255, 255, 255, 0.85)';
            let btnBorder = '1px solid var(--paper-line, #d8c9a8)';
            let textColor = 'var(--ink, #1f2733)';

            if (displayResult) {
              if (String(correctAnswer) === String(idx)) {
                btnBg = 'rgba(47, 110, 92, 0.15)';
                btnBorder = '2px solid #2f6e5c';
                textColor = '#1e5445';
              } else if (isSelected && !isCorrect) {
                btnBg = 'rgba(200, 40, 63, 0.12)';
                btnBorder = '2px solid #c8283f';
                textColor = '#9e1b2e';
              }
            } else if (isSelected) {
              btnBg = 'rgba(42, 92, 138, 0.12)';
              btnBorder = '2px solid var(--blue, #2a5c8a)';
              textColor = 'var(--blue, #2a5c8a)';
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectAnswer(problem.id || number, idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: btnBg,
                  border: btnBorder,
                  color: textColor,
                  fontSize: '15px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <span
                  style={{
                    fontSize: '16px',
                    fontWeight: isSelected ? '900' : '600',
                    color: isSelected ? 'var(--blue, #2a5c8a)' : 'var(--ink-soft, #718096)',
                  }}
                >
                  {CHOICE_SYMBOLS[idx] || `(${idx + 1})`}
                </span>
                <span style={{ flex: 1, lineHeight: 1.4 }}>
                  <LatexMath text={choiceText} />
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div style={{ margin: '20px 0 14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--ink, #1f2733)' }}>
            {language === 'ko' ? '정답 입력:' : 'Your Answer:'}
          </span>
          <input
            type="text"
            inputMode="numeric"
            placeholder={language === 'ko' ? '숫자 입력' : 'Enter number'}
            value={userAnswer || ''}
            onChange={(e) => onSelectAnswer(problem.id || number, e.target.value.trim())}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1.5px solid var(--paper-line, #d8c9a8)',
              fontSize: '16px',
              fontWeight: '700',
              width: '120px',
              textAlign: 'center',
            }}
          />
        </div>
      )}

      {/* Practice Mode Instant Check Button & Feedback */}
      {!isExamMode ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
            marginTop: '16px',
            borderTop: '1px dashed var(--paper-line, #e2d9c8)',
            paddingTop: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              disabled={!isAnswered}
              onClick={() => setCheckedInPractice(true)}
              style={{
                fontSize: '13.5px',
                fontWeight: '700',
                padding: '7px 16px',
                borderRadius: '8px',
                background: isAnswered ? 'var(--blue, #2a5c8a)' : '#cbd5e0',
                color: '#ffffff',
                border: 'none',
                cursor: isAnswered ? 'pointer' : 'not-allowed',
              }}
            >
              {language === 'ko' ? '정답 확인' : 'Check Answer'}
            </button>

            {checkedInPractice ? (
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: '800',
                  color: isCorrect ? '#2f6e5c' : '#c8283f',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {isCorrect
                  ? (language === 'ko' ? '🎉 정답입니다!' : '🎉 Correct!')
                  : (language === 'ko' ? `❌ 오답입니다. (정답: ${type === 'multiple_choice' ? CHOICE_SYMBOLS[correctAnswer] || correctAnswer + 1 : correctAnswer})` : `❌ Incorrect (Answer: ${correctAnswer})`)}
              </span>
            ) : null}
          </div>

          {explanation ? (
            <button
              type="button"
              onClick={() => setSolutionOpen((v) => !v)}
              style={{
                fontSize: '13px',
                fontWeight: '600',
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid var(--paper-line, #d8c9a8)',
                background: 'transparent',
                color: 'var(--ink-soft, #718096)',
                cursor: 'pointer',
              }}
            >
              {solutionOpen ? (language === 'ko' ? '해설 닫기 ▲' : 'Hide Solution ▲') : (language === 'ko' ? '해설 보기 ▼' : 'View Solution ▼')}
            </button>
          ) : null}
        </div>
      ) : null}

      {/* Explanation Drawer */}
      {solutionOpen || (isExamMode && showResult && explanation) ? (
        <div
          style={{
            marginTop: '16px',
            padding: '16px 18px',
            background: 'rgba(201, 154, 62, 0.08)',
            borderLeft: '4px solid var(--gold, #c99a3e)',
            borderRadius: '4px 10px 10px 4px',
            fontSize: '15px',
            lineHeight: '1.8',
            color: 'var(--ink, #1f2733)',
          }}
        >
          <div style={{ fontWeight: '800', color: 'var(--gold, #a87926)', marginBottom: '6px' }}>
            💡 {language === 'ko' ? '상세 해설' : 'Step-by-step Solution'}
          </div>
          <LatexMath text={explanation} />
        </div>
      ) : null}

      {/* Tablet Stylus NoteCanvas Layer */}
      {scratchpadOpen ? (
        <div style={{ marginTop: '16px' }}>
          <NoteCanvas storageKey={`problem_note_${id || number}`} open={scratchpadOpen} />
        </div>
      ) : null}
    </div>
  );
}
