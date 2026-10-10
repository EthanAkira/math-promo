'use client';

import { useState, useMemo } from 'react';
import { useLanguage } from '../../language';
import MathText from '../../components/MathText';
import {
  AMC_DOMAIN_FREQUENCIES,
  AMC_UNIT_FREQUENCY_MAP,
  AMC_KILLER_TOPICS,
  generateAmcForecastProblem,
  generateAmcForecastExamSet,
} from '../amcForecastEngine';
import { AMC_FINE_SUBJECTS } from '../../examUnits';

export default function AmcForecastWorkspace() {
  const { language } = useLanguage();
  const isKo = language === 'ko';

  const [selectedLevel, setSelectedLevel] = useState('8'); // '8' | '10' | '12'
  const [activeTab, setActiveTab] = useState('practice'); // 'practice' | 'frequency' | 'killers' | 'fullset'

  // Single Problem Practice State
  const [currentProblem, setCurrentProblem] = useState(() =>
    generateAmcForecastProblem({ level: '8', language: language || 'ko', number: 1 })
  );
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [isGraded, setIsGraded] = useState(false);
  const [genCount, setGenCount] = useState(1);

  // Full Exam Set State
  const [examSet, setExamSet] = useState(null);
  const [examAnswers, setExamAnswers] = useState({});
  const [examSubmitted, setExamSubmitted] = useState(false);

  // Frequency Data for current level
  const levelFreq = useMemo(() => AMC_DOMAIN_FREQUENCIES[selectedLevel], [selectedLevel]);

  function handleLevelChange(lvl) {
    setSelectedLevel(lvl);
    const newProb = generateAmcForecastProblem({ level: lvl, language, number: 1 });
    setCurrentProblem(newProb);
    setSelectedChoice(null);
    setIsGraded(false);
    setExamSet(null);
    setExamSubmitted(false);
  }

  function handleNewForecastProblem() {
    const nextProb = generateAmcForecastProblem({
      level: selectedLevel,
      language,
      number: currentProblem?.number ? (currentProblem.number % 25) + 1 : 1,
    });
    setCurrentProblem(nextProb);
    setSelectedChoice(null);
    setIsGraded(false);
    setGenCount((c) => c + 1);
  }

  function handleGenerateFullSet() {
    const full = generateAmcForecastExamSet(selectedLevel, { language });
    setExamSet(full);
    setExamAnswers({});
    setExamSubmitted(false);
    setActiveTab('fullset');
  }

  return (
    <div style={{ maxWidth: 1040, margin: '0 auto', padding: '32px 20px 80px' }}>
      {/* Header Banner */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--red-pen)', letterSpacing: '0.06em' }}>
            AMC OFFICIAL TREND & FORECAST LAB
          </span>
          <span style={{ fontSize: 11, background: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: 999, fontWeight: 600 }}>
            {isKo ? '2026-2027 시즌 대비' : 'Season 2026-2027'}
          </span>
        </div>
        <h1 className="font-display" style={{ margin: '0 0 10px', fontSize: 'clamp(26px, 4vw, 36px)', color: 'var(--ink)' }}>
          {isKo ? 'AMC 출제분석 & 적중 예상문제 연구실' : 'AMC Trend Analysis & Forecast Problem Lab'}
        </h1>
        <p style={{ margin: 0, fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
          {isKo
            ? '역대 AMC 8 · 10 · 12 기출 분석에 기반한 영역별 공식 출제 빈도 통계, 5대 킬러 유형 공략법 및 최신 출제 트렌드 반영 적중 예상 모의고사를 실시간으로 풀어보세요.'
            : 'Explore official frequency distributions across Algebra, Geometry, Number Theory, and Combinatorics. Practice full 25-question forecast mock exams.'}
        </p>
      </div>

      {/* Level Selector Tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 22, flexWrap: 'wrap' }}>
        {[
          { id: '8', icon: '🥉', title: 'AMC 8', desc: isKo ? '중2 이하 · 25문항 · 40분' : 'Grades 8 & below' },
          { id: '10', icon: '🥈', title: 'AMC 10', desc: isKo ? '고1 이하 · 25문항 · 75분' : 'Grades 10 & below' },
          { id: '12', icon: '🥇', title: 'AMC 12', desc: isKo ? '고3 이하 · 25문항 · 75분' : 'Grades 12 & below' },
        ].map((lvl) => {
          const active = selectedLevel === lvl.id;
          return (
            <button
              key={lvl.id}
              onClick={() => handleLevelChange(lvl.id)}
              style={{
                flex: '1 1 200px',
                padding: '12px 18px',
                borderRadius: 12,
                border: active ? '2px solid var(--primary, #2563eb)' : '1px solid var(--rule, #e5e7eb)',
                background: active ? 'var(--surface-primary, #eff6ff)' : 'var(--paper, #fff)',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ fontSize: 24 }}>{lvl.icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: active ? 'var(--primary, #2563eb)' : 'var(--ink)' }}>
                  {lvl.title}
                </div>
                <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{lvl.desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Sub Tabs */}
      <div style={{ display: 'flex', gap: 8, borderBottom: '2px solid var(--rule, #e5e7eb)', marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { id: 'practice', label: isKo ? '🎯 적중 예상문제 풀기' : '🎯 Practice Forecast Problem' },
          { id: 'fullset', label: isKo ? '📝 25문항 실전 모의고사' : '📝 25-Question Mock Set' },
          { id: 'frequency', label: isKo ? '📊 영역별 출제 빈도표' : '📊 Official Frequencies' },
          { id: 'killers', label: isKo ? '💡 5대 킬러 유형 분석' : '💡 Top 5 Killer Topics' },
        ].map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 18px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontWeight: active ? 700 : 500,
                fontSize: 14,
                color: active ? 'var(--primary, #2563eb)' : 'var(--ink-soft)',
                borderBottom: active ? '2px solid var(--primary, #2563eb)' : '2px solid transparent',
                marginBottom: -2,
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: Single Forecast Practice */}
      {activeTab === 'practice' && (
        <div style={{ background: 'var(--paper, #fff)', borderRadius: 14, border: '1px solid var(--rule, #e5e7eb)', padding: '24px 26px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ background: '#dbeafe', color: '#1e40af', padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700 }}>
                AMC {selectedLevel} #{currentProblem?.number || 1}
              </span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)' }}>
                {currentProblem?.unitName || '경시 단원'}
              </span>
              {currentProblem?.frequencyInfo && (
                <span style={{ background: '#fef3c7', color: '#92400e', fontSize: 11, padding: '2px 7px', borderRadius: 6, fontWeight: 600 }}>
                  출제 빈도 {currentProblem.frequencyInfo.rate}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                onClick={handleNewForecastProblem}
                className="button button-primary"
                style={{ fontSize: 13, padding: '6px 14px' }}
              >
                {isKo ? '✨ 새 예상문제 생성' : '✨ Next Forecast'}
              </button>
            </div>
          </div>

          {/* Question Text */}
          <div style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--ink)', marginBottom: 22 }}>
            <MathText text={currentProblem?.question || ''} />
          </div>

          {/* Choices */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 24 }}>
            {(currentProblem?.choices || []).map((ch, idx) => {
              const chNum = idx + 1;
              const isSelected = selectedChoice === chNum;
              const isCorrect = isGraded && chNum === currentProblem?.correctAnswer;
              const isWrong = isGraded && isSelected && chNum !== currentProblem?.correctAnswer;

              let bg = 'var(--paper, #fff)';
              let border = '1px solid var(--rule, #e5e7eb)';
              if (isSelected) {
                bg = '#eff6ff';
                border = '2px solid #2563eb';
              }
              if (isCorrect) {
                bg = '#dcfce7';
                border = '2px solid #16a34a';
              } else if (isWrong) {
                bg = '#fee2e2';
                border = '2px solid #dc2626';
              }

              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (!isGraded) setSelectedChoice(chNum);
                  }}
                  disabled={isGraded}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '11px 16px',
                    borderRadius: 10,
                    border,
                    background: bg,
                    cursor: isGraded ? 'default' : 'pointer',
                    textAlign: 'left',
                    fontSize: 15,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ fontWeight: 700, width: 22, color: 'var(--ink-soft)' }}>
                    {['①', '②', '③', '④', '⑤'][idx] || `(${chNum})`}
                  </span>
                  <div style={{ flex: 1 }}>
                    <MathText text={ch} />
                  </div>
                  {isCorrect && <span style={{ color: '#16a34a', fontWeight: 700, fontSize: 13 }}>정답 ✓</span>}
                  {isWrong && <span style={{ color: '#dc2626', fontWeight: 700, fontSize: 13 }}>오답 ✗</span>}
                </button>
              );
            })}
          </div>

          {/* Grading Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderTop: '1px solid var(--rule, #e5e7eb)', paddingTop: 18 }}>
            {!isGraded ? (
              <button
                type="button"
                onClick={() => setIsGraded(true)}
                disabled={selectedChoice === null}
                className="button button-primary"
                style={{ opacity: selectedChoice === null ? 0.5 : 1, padding: '8px 20px', fontSize: 14 }}
              >
                {isKo ? '정답 제출 및 채점' : 'Submit & Grade'}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNewForecastProblem}
                className="button button-secondary"
                style={{ padding: '8px 20px', fontSize: 14 }}
              >
                {isKo ? '다음 예상문제 풀기 →' : 'Next Problem →'}
              </button>
            )}

            {isGraded && (
              <span style={{ fontWeight: 700, fontSize: 15, color: selectedChoice === currentProblem?.correctAnswer ? '#16a34a' : '#dc2626' }}>
                {selectedChoice === currentProblem?.correctAnswer
                  ? (isKo ? '🎉 정답입니다!' : '🎉 Correct!')
                  : (isKo ? `아쉽습니다. 정답은 ${['①', '②', '③', '④', '⑤'][(currentProblem?.correctAnswer || 1) - 1]} 입니다.` : `Incorrect. Correct choice: #${currentProblem?.correctAnswer}`)}
              </span>
            )}
          </div>

          {/* Explanation Section */}
          {isGraded && currentProblem?.explanation && (
            <div style={{ marginTop: 22, padding: '16px 20px', borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#334155', marginBottom: 10 }}>
                📘 {isKo ? '단계별 상세 풀이' : 'Step-by-Step Solution'}
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.7, color: '#1e293b' }}>
                <MathText text={currentProblem.explanation} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Full 25-Question Exam Set */}
      {activeTab === 'fullset' && (
        <div>
          {!examSet ? (
            <div style={{ textAlign: 'center', padding: '48px 20px', background: 'var(--paper, #fff)', borderRadius: 14, border: '1px solid var(--rule, #e5e7eb)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📝</div>
              <h2 style={{ margin: '0 0 10px', fontSize: 22, color: 'var(--ink)' }}>
                AMC {selectedLevel} {isKo ? '25문항 실전 적중 모의고사' : '25-Question Forecast Exam Set'}
              </h2>
              <p style={{ margin: '0 0 24px', fontSize: 15, color: 'var(--ink-soft)', maxWidth: 520, marginInline: 'auto' }}>
                {isKo
                  ? `실전 시험 규격과 동일하게 ${selectedLevel === '8' ? '40분' : '75분'} 동안 25문항을 풀고, 자동 채점 및 문항별 세부 해설을 확인해보세요.`
                  : 'Experience the full exam condition. Standard 25 questions with balanced topics.'}
              </p>
              <button
                type="button"
                onClick={handleGenerateFullSet}
                className="button button-primary"
                style={{ fontSize: 15, padding: '10px 28px' }}
              >
                {isKo ? '시험지 실시간 생성 & 시작하기' : 'Generate & Start Full Exam'}
              </button>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: 20, color: 'var(--ink)' }}>{examSet.title}</h2>
                  <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 4 }}>
                    {isKo ? `총 25문항 · 제한 시간 ${examSet.timeMinutes}분` : `25 Questions · ${examSet.timeMinutes} mins`}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    onClick={handleGenerateFullSet}
                    className="button button-secondary"
                    style={{ fontSize: 13, padding: '6px 14px' }}
                  >
                    {isKo ? '🔄 다른 문제 세트 생성' : '🔄 New Set'}
                  </button>
                  {!examSubmitted && (
                    <button
                      type="button"
                      onClick={() => setExamSubmitted(true)}
                      className="button button-primary"
                      style={{ fontSize: 13, padding: '6px 16px' }}
                    >
                      {isKo ? '전체 답안 제출 및 채점' : 'Submit & Grade All'}
                    </button>
                  )}
                </div>
              </div>

              {/* 25 Problems List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {examSet.questions.map((q, qIdx) => {
                  const qNum = qIdx + 1;
                  const myAns = examAnswers[qNum];
                  const isCorrect = examSubmitted && myAns === q.correctAnswer;
                  const isWrong = examSubmitted && myAns !== undefined && myAns !== q.correctAnswer;

                  return (
                    <div
                      key={q.id || qIdx}
                      style={{
                        background: 'var(--paper, #fff)',
                        borderRadius: 12,
                        border: isCorrect ? '2px solid #16a34a' : (isWrong ? '2px solid #dc2626' : '1px solid var(--rule, #e5e7eb)'),
                        padding: '20px 22px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                        <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--primary, #2563eb)' }}>
                          문제 #{qNum} ({q.unitName || '기출 유형'})
                        </span>
                        {examSubmitted && (
                          <span style={{ fontWeight: 700, fontSize: 13, color: isCorrect ? '#16a34a' : '#dc2626' }}>
                            {isCorrect ? '✓ 정답 (6점)' : '✗ 오답'}
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: 15, lineHeight: 1.6, marginBottom: 16 }}>
                        <MathText text={q.question} />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                        {q.choices.map((c, cIdx) => {
                          const cNum = cIdx + 1;
                          const selected = myAns === cNum;
                          return (
                            <button
                              key={cIdx}
                              onClick={() => {
                                if (!examSubmitted) {
                                  setExamAnswers((prev) => ({ ...prev, [qNum]: cNum }));
                                }
                              }}
                              disabled={examSubmitted}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                padding: '8px 14px',
                                borderRadius: 8,
                                border: selected ? '2px solid #2563eb' : '1px solid #e5e7eb',
                                background: selected ? '#eff6ff' : '#fff',
                                textAlign: 'left',
                                cursor: examSubmitted ? 'default' : 'pointer',
                              }}
                            >
                              <span style={{ fontWeight: 600, fontSize: 13 }}>
                                {['①', '②', '③', '④', '⑤'][cIdx]}
                              </span>
                              <div style={{ flex: 1, fontSize: 14 }}>
                                <MathText text={c} />
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {examSubmitted && q.explanation && (
                        <div style={{ marginTop: 14, padding: '12px 14px', background: '#f8fafc', borderRadius: 8, fontSize: 13, color: '#334155' }}>
                          <strong>해설:</strong> <MathText text={q.explanation} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Domain Frequencies Table */}
      {activeTab === 'frequency' && (
        <div style={{ background: 'var(--paper, #fff)', borderRadius: 14, border: '1px solid var(--rule, #e5e7eb)', padding: '26px 28px' }}>
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ margin: '0 0 6px', fontSize: 20, color: 'var(--ink)' }}>
              AMC {selectedLevel} {isKo ? '공식 영역별 출제 빈도표' : 'Official Topic Frequency Table'}
            </h2>
            <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-soft)' }}>
              {levelFreq?.target} · {levelFreq?.duration} · {isKo ? '총 25문항 (문항당 6점 균등)' : '25 Questions (6 pts each)'}
            </p>
          </div>

          <div style={{ overflowX: 'auto', marginBottom: 28 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 16px' }}>{isKo ? '출제 영역' : 'Domain'}</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>{isKo ? '평균 출제' : 'Avg Count'}</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>{isKo ? '출제 비중' : 'Share'}</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>{isKo ? '출제 빈도' : 'Frequency'}</th>
                  <th style={{ padding: '12px 16px' }}>{isKo ? '주요 핵심 주제' : 'Core Topics'}</th>
                </tr>
              </thead>
              <tbody>
                {(levelFreq?.domains || []).map((dom) => (
                  <tr key={dom.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--ink)' }}>{dom.name}</td>
                    <td style={{ padding: '14px 16px', textAlign: 'center', fontWeight: 600, color: '#1d4ed8' }}>{dom.count}</td>
                    <td style={{ padding: '14px 16px', textAlign: 'center', fontWeight: 700 }}>{dom.share}</td>
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <span style={{ color: '#d97706', letterSpacing: 2 }}>{'★'.repeat(dom.stars)}</span>
                      <div style={{ fontSize: 11, color: '#64748b' }}>{dom.rate}</div>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#475569', fontSize: 13 }}>{dom.topics}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Subtopic Frequency Map Snippet */}
          <h3 style={{ margin: '0 0 12px', fontSize: 16, color: 'var(--ink)' }}>
            📌 {isKo ? '세부 단원별 상세 출제 지표' : 'Subtopic Frequency Indicators'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
            {Object.entries(AMC_UNIT_FREQUENCY_MAP).slice(0, 12).map(([unitKey, info]) => (
              <div key={unitKey} style={{ padding: '10px 14px', borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>{unitKey}</span>
                <span style={{ fontSize: 12, background: '#e0e7ff', color: '#3730a3', padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>
                  평균 {info.count}문항 ({info.rate})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Top 5 Killer Topics */}
      {activeTab === 'killers' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {AMC_KILLER_TOPICS.map((item) => (
            <div
              key={item.rank}
              style={{
                background: 'var(--paper, #fff)',
                borderRadius: 14,
                border: '1px solid var(--rule, #e5e7eb)',
                padding: '22px 24px',
                borderLeft: '4px solid #ef4444',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ background: '#fee2e2', color: '#991b1b', fontSize: 12, fontWeight: 800, padding: '2px 8px', borderRadius: 6 }}>
                  KILLER #{item.rank}
                </span>
                <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>{item.target}</span>
              </div>
              <h3 style={{ margin: '0 0 8px', fontSize: 18, color: 'var(--ink)' }}>{item.title}</h3>
              <p style={{ margin: '0 0 12px', fontSize: 14, color: '#334155', lineHeight: 1.6 }}>
                <strong>핵심 개념:</strong> {item.concept}
              </p>
              <div style={{ padding: '10px 14px', borderRadius: 8, background: '#fef2f2', border: '1px solid #fecaca', fontSize: 13, color: '#991b1b' }}>
                <strong>💡 공략 비법:</strong> {item.strategy}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
