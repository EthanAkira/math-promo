'use client';

import { useState, useMemo } from 'react';
import { useLanguage } from '../../language';
import MathText from '../../components/MathText';
import { syncAnswerEvents } from '../../lib/submissions';
import {
  getCsatTaxonomy,
  getPredictedDistribution,
  getFrequenciesBySubject,
  getDetailedTypes,
  getHighDifficultyCases,
  getDifficultyCriteria,
  CSAT_SUBJECT_LABELS,
} from '../../utils/csatTaxonomy';
import {
  generateCsatForecastProblem,
  generateCsatSimilarProblem,
  generateCsatForecastExamSet,
} from '../csatForecastEngine';

export default function CsatForecastWorkspace() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('forecast'); // 'forecast' | 'frequency' | 'taxonomy' | 'cases'
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [searchTaxonomy, setSearchTaxonomy] = useState('');

  // Forecast Problem Practice State
  const [currentProblem, setCurrentProblem] = useState(() =>
    generateCsatForecastProblem({ subjectId: 'math1', number: 1 })
  );
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [isGraded, setIsGraded] = useState(false);
  const [generationCount, setGenerationCount] = useState(1);

  // Predictions and Taxonomy data
  const prediction = useMemo(() => getPredictedDistribution(2026), []);
  const frequencies = useMemo(() => getFrequenciesBySubject(selectedSubject), [selectedSubject]);
  const detailedTypes = useMemo(() => getDetailedTypes(selectedSubject), [selectedSubject]);
  const highDifficultyCases = useMemo(() => getHighDifficultyCases(selectedSubject !== 'all' ? { subjectId: selectedSubject } : {}), [selectedSubject]);
  const criteria = useMemo(() => getDifficultyCriteria(), []);

  // Handlers
  function handleGenerateNewForecast(subj = selectedSubject) {
    const nextSubj = subj === 'all' ? 'math1' : subj;
    const newProb = generateCsatForecastProblem({ subjectId: nextSubj, number: currentProblem.number });
    setCurrentProblem(newProb);
    setSelectedChoice(null);
    setIsGraded(false);
    setGenerationCount((c) => c + 1);
  }

  function handleGenerateSimilar() {
    const similar = generateCsatSimilarProblem(currentProblem);
    setCurrentProblem(similar);
    setSelectedChoice(null);
    setIsGraded(false);
    setGenerationCount((c) => c + 1);
  }

  function handleSelectTypeForProblem(type) {
    const prob = generateCsatForecastProblem({ subjectId: type.subjectId, number: 1 });
    setCurrentProblem({
      ...prob,
      subject: type.subject,
      subjectId: type.subjectId,
      majorUnit: type.majorUnit,
      middleUnit: type.middleUnit,
      detailedType: type.detailedType,
      coreIdea: type.coreIdea,
      traps: type.traps,
    });
    setSelectedChoice(null);
    setIsGraded(false);
    setActiveTab('forecast');
    window.scrollTo({ top: 400, behavior: 'smooth' });
  }

  return (
    <div style={{ maxWidth: 1040, margin: '0 auto', padding: '24px 20px 80px' }}>
      {/* Breadcrumb */}
      <p className="no-print" style={{ fontSize: 13, color: 'var(--ink-soft, #6b7280)', marginBottom: 12 }}>
        <a href="/" style={{ color: 'var(--ink-soft)', textDecoration: 'none' }}>홈</a> /{' '}
        <a href="/csat" style={{ color: 'var(--ink-soft)', textDecoration: 'none' }}>수능 기출문제</a> /{' '}
        <span style={{ fontWeight: 700, color: 'var(--ink, #111827)' }}>수능 출제분석 & 2026/2027 출제 예측실</span>
      </p>

      {/* Hero Header */}
      <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: 16, padding: '28px 32px', color: '#ffffff', marginBottom: 28, boxShadow: '0 8px 24px rgba(15, 23, 42, 0.15)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(59, 130, 246, 0.25)', border: '1px solid rgba(59, 130, 246, 0.5)', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, color: '#93c5fd', marginBottom: 12 }}>
          <span>🎯 CSAT FORECAST & VARIANT ENGINE</span>
        </div>
        <h1 className="font-display" style={{ margin: '0 0 10px', fontSize: 'clamp(24px, 4vw, 32px)', color: '#ffffff', letterSpacing: '-0.02em' }}>
          수능 수학 출제 빈도·난도 분석 & 이번 년도 출제 예측
        </h1>
        <p style={{ margin: 0, fontSize: 15, color: '#cbd5e1', maxWidth: 800, lineHeight: 1.6 }}>
          최근 5개년(2022~2026) 수능 전 문항 출제 통계와 72대 세부유형 사전, 킬러/준킬러 복합개념 분석 데이터를 영구 보관하고, 이를 활용하여 이번 년도 출제 예상 문항과 유사 변형 문제를 무한 생성합니다.
        </p>

        {/* Feature Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 18 }}>
          <span style={{ background: 'rgba(255,255,255,0.1)', padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
            📊 5개년 전 문항 출제 빈도율 100%
          </span>
          <span style={{ background: 'rgba(255,255,255,0.1)', padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
            📑 72대 세부유형 & 대표 함정 사전
          </span>
          <span style={{ background: 'rgba(255,255,255,0.1)', padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
            ⚡ 실시간 기출예상·유사변형 생성엔진
          </span>
          <span style={{ background: 'rgba(255,255,255,0.1)', padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
            🏛️ 2022~2026 EBS 고난도 복합개념 매핑
          </span>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div style={{ display: 'flex', gap: 8, borderBottom: '2px solid var(--paper-line, #e5e7eb)', marginBottom: 24, overflowX: 'auto', paddingBottom: 2 }}>
        <button
          type="button"
          onClick={() => setActiveTab('forecast')}
          style={{
            padding: '11px 18px',
            fontSize: 15,
            fontWeight: 700,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderBottom: activeTab === 'forecast' ? '3px solid var(--primary, #2563eb)' : '3px solid transparent',
            color: activeTab === 'forecast' ? 'var(--primary, #2563eb)' : 'var(--ink-soft, #6b7280)',
            marginBottom: -2,
            whiteSpace: 'nowrap',
          }}
        >
          🔮 이번 년도 출제 예측 & 예상문제 풀이
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('frequency')}
          style={{
            padding: '11px 18px',
            fontSize: 15,
            fontWeight: 700,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderBottom: activeTab === 'frequency' ? '3px solid var(--primary, #2563eb)' : '3px solid transparent',
            color: activeTab === 'frequency' ? 'var(--primary, #2563eb)' : 'var(--ink-soft, #6b7280)',
            marginBottom: -2,
            whiteSpace: 'nowrap',
          }}
        >
          📈 최근 5개년 출제 빈도 통계
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('taxonomy')}
          style={{
            padding: '11px 18px',
            fontSize: 15,
            fontWeight: 700,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderBottom: activeTab === 'taxonomy' ? '3px solid var(--primary, #2563eb)' : '3px solid transparent',
            color: activeTab === 'taxonomy' ? 'var(--primary, #2563eb)' : 'var(--ink-soft, #6b7280)',
            marginBottom: -2,
            whiteSpace: 'nowrap',
          }}
        >
          📖 72대 세부유형 사전 ({detailedTypes.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('cases')}
          style={{
            padding: '11px 18px',
            fontSize: 15,
            fontWeight: 700,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderBottom: activeTab === 'cases' ? '3px solid var(--primary, #2563eb)' : '3px solid transparent',
            color: activeTab === 'cases' ? 'var(--primary, #2563eb)' : 'var(--ink-soft, #6b7280)',
            marginBottom: -2,
            whiteSpace: 'nowrap',
          }}
        >
          🏆 고난도 대표문항 복합개념 분석 ({highDifficultyCases.length})
        </button>
      </div>

      {/* Subject Filter Pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
        <button
          type="button"
          onClick={() => setSelectedSubject('all')}
          style={{
            padding: '6px 14px',
            borderRadius: 20,
            fontSize: 13,
            fontWeight: selectedSubject === 'all' ? 700 : 500,
            border: selectedSubject === 'all' ? '1.5px solid #1e293b' : '1px solid var(--paper-line, #e2e8f0)',
            background: selectedSubject === 'all' ? '#1e293b' : '#ffffff',
            color: selectedSubject === 'all' ? '#ffffff' : '#475569',
            cursor: 'pointer',
          }}
        >
          전체 과목
        </button>
        {Object.entries(CSAT_SUBJECT_LABELS).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setSelectedSubject(id);
              if (activeTab === 'forecast') handleGenerateNewForecast(id);
            }}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: selectedSubject === id ? 700 : 500,
              border: selectedSubject === id ? '1.5px solid #2563eb' : '1px solid var(--paper-line, #e2e8f0)',
              background: selectedSubject === id ? '#2563eb' : '#ffffff',
              color: selectedSubject === id ? '#ffffff' : '#475569',
              cursor: 'pointer',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: 이번 년도 출제 예측 & 기출예상문제 풀이                             */}
      {/* ========================================================================= */}
      {activeTab === 'forecast' && (
        <div style={{ display: 'grid', gap: 24 }}>
          {/* Prediction Briefing Box */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14, padding: '20px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px', color: '#0f172a' }}>
                  🔮 이번 년도(2026/2027) 수능 출제 예측 분석 레이더
                </h2>
                <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
                  최근 5년간 100% 빈도로 반복 출제된 필수 단원과 EBS 최신 고난도 변별 트렌드를 반영한 정밀 예측입니다.
                </p>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 10px', background: '#dbeafe', color: '#1d4ed8', borderRadius: 6 }}>
                공통 22문항 + 선택 8문항 구조
              </span>
            </div>

            {/* Differentiator Archetypes Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 12 }}>
              {prediction.highDiscriminatorPredictions.slice(0, 4).map((item, idx) => (
                <div key={idx} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '14px 16px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <strong style={{ fontSize: 14, color: '#1e293b' }}>{item.targetNumber}</strong>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#dc2626', background: '#fee2e2', padding: '2px 6px', borderRadius: 4 }}>
                      {item.forecastRatio}
                    </span>
                  </div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: '#2563eb', marginBottom: 4 }}>
                    {item.subject} · {item.detailedType}
                  </div>
                  <p style={{ fontSize: 12, color: '#475569', margin: '0 0 6px', lineHeight: 1.5 }}>
                    💡 <strong>핵심 발상:</strong> {item.coreIdea}
                  </p>
                  <p style={{ fontSize: 11.5, color: '#b91c1c', margin: 0 }}>
                    ⚠️ <strong>함정:</strong> {item.traps}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Problem Solving Workspace */}
          <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 14, padding: '24px 28px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
            {/* Problem Meta Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: 14, marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: currentProblem.isVariant ? '#fef3c7' : '#dbeafe', color: currentProblem.isVariant ? '#92400e' : '#1e40af' }}>
                    {currentProblem.isVariant ? '⚡ 기출 유사 변형 문제' : '🔮 이번 년도 수능 기출예상문제'}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                    {currentProblem.subject} · {currentProblem.majorUnit} &gt; {currentProblem.detailedType}
                  </span>
                  <span style={{ fontSize: 11, padding: '2px 7px', borderRadius: 4, background: '#f1f5f9', color: '#475569', fontWeight: 600 }}>
                    구조난도: {currentProblem.structuralTier || 'C'} ({currentProblem.points || 4}점)
                  </span>
                </div>
              </div>

              {/* Action Buttons: New Forecast & Similar Variant */}
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  onClick={handleGenerateSimilar}
                  className="button button-secondary"
                  style={{ fontSize: 13, padding: '7px 14px', borderRadius: 8, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  title="현재 문제의 논리 구조를 유지하면서 수치와 조건을 변형한 유사 문제를 생성합니다"
                >
                  <span>⚡</span>
                  <span>유사 문제 변형 생성</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleGenerateNewForecast()}
                  className="button button-primary"
                  style={{ fontSize: 13, padding: '7px 14px', borderRadius: 8, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <span>🔄</span>
                  <span>새 기출예상문제</span>
                </button>
              </div>
            </div>

            {/* Forecast Rationale Notification */}
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '8px 14px', marginBottom: 16, fontSize: 12.5, color: '#166534', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>📊</span>
              <span><strong>출제 예측 근거:</strong> {currentProblem.forecastRationale || '최근 5개년 수능 출제 빈도 100% 핵심 단원 반영 문항'}</span>
            </div>

            {/* Problem Body */}
            <div style={{ fontSize: 17, color: '#0f172a', lineHeight: 1.8, marginBottom: 24 }}>
              <MathText value={currentProblem.question} />
            </div>

            {/* Multiple Choice Options */}
            <div style={{ display: 'grid', gap: 10, marginBottom: 24 }}>
              {currentProblem.choices.map((choice, cIdx) => {
                const isSelected = selectedChoice === cIdx;
                const isCorrect = isGraded && cIdx === currentProblem.correctAnswer;
                const isWrong = isGraded && isSelected && !isCorrect;

                let bg = '#ffffff';
                let border = '#cbd5e1';
                let textCol = '#1e293b';
                if (isSelected) { bg = '#eff6ff'; border = '#2563eb'; }
                if (isCorrect) { bg = '#ecfdf5'; border = '#10b981'; textCol = '#047857'; }
                if (isWrong) { bg = '#fef2f2'; border = '#ef4444'; textCol = '#b91c1c'; }

                return (
                  <button
                    key={cIdx}
                    type="button"
                    onClick={() => { if (!isGraded) setSelectedChoice(cIdx); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      width: '100%',
                      padding: '12px 18px',
                      background: bg,
                      border: `1.5px solid ${border}`,
                      borderRadius: 10,
                      cursor: isGraded ? 'default' : 'pointer',
                      textAlign: 'left',
                      fontSize: 15,
                      color: textCol,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span style={{ width: 24, height: 24, borderRadius: '50%', background: isSelected ? '#2563eb' : '#f1f5f9', color: isSelected ? '#fff' : '#64748b', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                      {['①', '②', '③', '④', '⑤'][cIdx]}
                    </span>
                    <span style={{ flex: 1 }}>
                      <MathText value={choice} />
                    </span>
                    {isCorrect && <span style={{ fontSize: 13, fontWeight: 700, color: '#059669' }}>✓ 정답</span>}
                    {isWrong && <span style={{ fontSize: 13, fontWeight: 700, color: '#dc2626' }}>✕ 오답</span>}
                  </button>
                );
              })}
            </div>

            {/* Grading Button */}
            {!isGraded ? (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedChoice === null) {
                      window.alert('답안을 선택해주세요.');
                      return;
                    }
                    setIsGraded(true);
                    syncAnswerEvents([{
                      grade: currentProblem.subject,
                      unit: currentProblem.majorUnit,
                      isCorrect: selectedChoice === currentProblem.correctAnswer,
                    }]);
                  }}
                  className="button button-primary"
                  style={{ padding: '10px 24px', fontSize: 15, fontWeight: 700, borderRadius: 8, cursor: 'pointer' }}
                >
                  채점하기
                </button>
              </div>
            ) : (
              /* Solution and Analysis Box */
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px 22px', marginTop: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 18 }}>{selectedChoice === currentProblem.correctAnswer ? '🎉' : '💡'}</span>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: selectedChoice === currentProblem.correctAnswer ? '#059669' : '#b91c1c' }}>
                    {selectedChoice === currentProblem.correctAnswer ? '정답입니다!' : `오답입니다 (정답: ${['①', '②', '③', '④', '⑤'][currentProblem.correctAnswer]})`}
                  </h3>
                </div>

                {/* Step-by-Step LaTeX Solution */}
                <div style={{ marginBottom: 16 }}>
                  <strong style={{ fontSize: 14, color: '#1e293b' }}>📝 단계별 상세 해설:</strong>
                  <div style={{ fontSize: 15, color: '#334155', lineHeight: 1.8, marginTop: 8, whiteSpace: 'pre-line', background: '#ffffff', padding: '14px 16px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                    <MathText value={currentProblem.explanation} />
                  </div>
                </div>

                {/* Taxonomy Insights: Core Idea & Trap */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
                  <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '12px 14px' }}>
                    <strong style={{ fontSize: 13, color: '#1d4ed8' }}>💡 수능 핵심 내용 / 풀이 발상:</strong>
                    <p style={{ fontSize: 13, color: '#1e3a8a', margin: '4px 0 0', lineHeight: 1.5 }}>
                      {currentProblem.coreIdea}
                    </p>
                  </div>
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '12px 14px' }}>
                    <strong style={{ fontSize: 13, color: '#b91c1c' }}>⚠️ 수능 대표 함정 (주의사항):</strong>
                    <p style={{ fontSize: 13, color: '#991b1b', margin: '4px 0 0', lineHeight: 1.5 }}>
                      {currentProblem.traps}
                    </p>
                  </div>
                </div>

                {/* Next Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
                  <button
                    type="button"
                    onClick={handleGenerateSimilar}
                    className="button button-secondary"
                    style={{ fontSize: 13, padding: '8px 16px', borderRadius: 8, cursor: 'pointer' }}
                  >
                    ⚡ 같은 유형 유사 문제 다시 풀기
                  </button>
                  <button
                    type="button"
                    onClick={() => handleGenerateNewForecast()}
                    className="button button-primary"
                    style={{ fontSize: 13, padding: '8px 16px', borderRadius: 8, cursor: 'pointer' }}
                  >
                    다음 예상문제 풀기 →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: 최근 5개년 출제 빈도 통계                                         */}
      {/* ========================================================================= */}
      {activeTab === 'frequency' && (
        <div>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '18px 20px', marginBottom: 20 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 6px', color: '#0f172a' }}>
              📊 최근 5개년(2022~2026학년도) 수능 수학 출제 빈도표
            </h2>
            <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
              현행 공통+선택과목 체제 5개년간 대단원별 출제 문항 수, 연평균, 출제율(1.0=100%)을 기록한 공인 통계 데이터입니다.
            </p>
          </div>

          <div style={{ overflowX: 'auto', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', borderBottom: '1.5px solid #cbd5e1', color: '#1e293b' }}>
                  <th style={{ padding: '12px 14px' }}>과목</th>
                  <th style={{ padding: '12px 14px' }}>대단원</th>
                  <th style={{ padding: '12px 10px', textAlign: 'center' }}>2022</th>
                  <th style={{ padding: '12px 10px', textAlign: 'center' }}>2023</th>
                  <th style={{ padding: '12px 10px', textAlign: 'center' }}>2024</th>
                  <th style={{ padding: '12px 10px', textAlign: 'center' }}>2025</th>
                  <th style={{ padding: '12px 10px', textAlign: 'center' }}>2026</th>
                  <th style={{ padding: '12px 12px', textAlign: 'center' }}>5년합계</th>
                  <th style={{ padding: '12px 12px', textAlign: 'center' }}>연평균</th>
                  <th style={{ padding: '12px 12px', textAlign: 'center' }}>출제율</th>
                  <th style={{ padding: '12px 16px' }}>분석 메모</th>
                </tr>
              </thead>
              <tbody>
                {frequencies.map((f, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a' }}>{f.subject}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: '#2563eb' }}>{f.majorUnit}</td>
                    <td style={{ padding: '12px 10px', textAlign: 'center' }}>{f.countsByYear['2022']}</td>
                    <td style={{ padding: '12px 10px', textAlign: 'center' }}>{f.countsByYear['2023']}</td>
                    <td style={{ padding: '12px 10px', textAlign: 'center' }}>{f.countsByYear['2024']}</td>
                    <td style={{ padding: '12px 10px', textAlign: 'center' }}>{f.countsByYear['2025']}</td>
                    <td style={{ padding: '12px 10px', textAlign: 'center' }}>{f.countsByYear['2026']}</td>
                    <td style={{ padding: '12px 12px', textAlign: 'center', fontWeight: 700, color: '#0f172a' }}>{f.total5Years}</td>
                    <td style={{ padding: '12px 12px', textAlign: 'center', fontWeight: 700, color: '#059669' }}>{f.yearlyAverage}문항</td>
                    <td style={{ padding: '12px 12px', textAlign: 'center' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: '#dcfce7', color: '#166534' }}>
                        {(f.appearanceRate * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#64748b', fontSize: 12 }}>{f.memo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Difficulty Standard Table */}
          <div style={{ marginTop: 28, background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px 24px' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 12px', color: '#0f172a' }}>
              🎯 정답률 구간별 자동 난도 & 구조난도(A~E) 판정 기준
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
              <div>
                <strong style={{ fontSize: 13, color: '#334155' }}>[정답률 구간 기준]</strong>
                <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
                  {criteria.rateBands.map((band, bIdx) => (
                    <div key={bIdx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#f8fafc', borderRadius: 6, fontSize: 12 }}>
                      <span style={{ fontWeight: 700, color: '#1e293b' }}>{band.range} ({band.autoDifficulty})</span>
                      <span style={{ color: '#64748b' }}>{band.recommendation}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <strong style={{ fontSize: 13, color: '#334155' }}>[구조난도(A~E) 판정 기준]</strong>
                <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
                  {criteria.structuralTiers.map((tier, tIdx) => (
                    <div key={tIdx} style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: 6, fontSize: 12 }}>
                      <strong style={{ color: '#2563eb' }}>{tier.name}:</strong> <span style={{ color: '#475569' }}>{tier.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: 72대 세부유형 사전 (Taxonomy Browser)                              */}
      {/* ========================================================================= */}
      {activeTab === 'taxonomy' && (
        <div>
          {/* Search bar */}
          <div style={{ marginBottom: 20 }}>
            <input
              type="text"
              value={searchTaxonomy}
              onChange={(e) => setSearchTaxonomy(e.target.value)}
              placeholder="세부유형명, 핵심 발상, 함정 검색 (예: 지수로그, 삼차함수, 사인법칙, 정규분포, 벡터 등)..."
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 10,
                border: '1.5px solid #cbd5e1',
                fontSize: 14,
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'grid', gap: 14 }}>
            {detailedTypes.filter((t) => {
              if (!searchTaxonomy) return true;
              const q = searchTaxonomy.toLowerCase().trim();
              return (
                t.detailedType.toLowerCase().includes(q) ||
                t.majorUnit.toLowerCase().includes(q) ||
                t.coreIdea.toLowerCase().includes(q) ||
                t.traps.toLowerCase().includes(q)
              );
            }).map((type, idx) => (
              <div
                key={idx}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 12,
                  padding: '18px 20px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                  display: 'grid',
                  gap: 10,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: '#eff6ff', color: '#1d4ed8' }}>
                      {type.subject} &gt; {type.majorUnit}
                    </span>
                    <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#0f172a' }}>
                      {type.detailedType}
                    </h3>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 6px', borderRadius: 4, background: '#f1f5f9', color: '#64748b' }}>
                      통상 난도: {type.typicalDifficulty}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelectTypeForProblem(type)}
                    style={{
                      background: 'none',
                      border: '1px solid #2563eb',
                      color: '#2563eb',
                      padding: '6px 12px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    이 유형 예상문제 풀기 →
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 10, fontSize: 13 }}>
                  <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: 8 }}>
                    <strong style={{ color: '#1e293b' }}>💡 핵심 내용 / 풀이 발상:</strong>
                    <p style={{ margin: '4px 0 0', color: '#475569' }}>{type.coreIdea}</p>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: 8 }}>
                    <strong style={{ color: '#7c3aed' }}>🚀 고난도 확장 포인트:</strong>
                    <p style={{ margin: '4px 0 0', color: '#475569' }}>{type.expansionPoints}</p>
                  </div>
                  <div style={{ background: '#fff1f2', padding: '10px 12px', borderRadius: 8 }}>
                    <strong style={{ color: '#e11d48' }}>⚠️ 대표 함정:</strong>
                    <p style={{ margin: '4px 0 0', color: '#9f1239' }}>{type.traps}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: 고난도 대표문항 복합개념 분석                                     */}
      {/* ========================================================================= */}
      {activeTab === 'cases' && (
        <div style={{ display: 'grid', gap: 16 }}>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '18px 20px' }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 6px', color: '#0f172a' }}>
              🏆 최근 수능(2024~2026) 최고 변별력 킬러/준킬러 문항 복합개념 분석
            </h2>
            <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
              실제 수능 15번, 21번, 22번, 29번, 30번에서 등급을 가른 핵심 발상과 복합개념의 결합 방식을 심층 분석합니다.
            </p>
          </div>

          <div style={{ display: 'grid', gap: 14 }}>
            {highDifficultyCases.map((c, idx) => (
              <div
                key={idx}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 12,
                  padding: '18px 22px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, padding: '3px 10px', borderRadius: 6, background: '#1e293b', color: '#ffffff' }}>
                      {c.year}학년도 {c.subject} {c.problemNumber}번 ({c.section})
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#2563eb' }}>
                      {c.majorUnit} &gt; {c.detailedType}
                    </span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: '#fee2e2', color: '#b91c1c' }}>
                    {c.ebsDifficulty}
                  </span>
                </div>

                <p style={{ fontSize: 14, color: '#1e293b', margin: '0 0 10px', lineHeight: 1.6 }}>
                  📋 <strong>문항 요구 내용:</strong> {c.requiredContent}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', fontSize: 12.5 }}>
                  <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '4px 10px', borderRadius: 6, fontWeight: 600 }}>
                    🔗 복합개념: {c.complexConcepts}
                  </span>
                  {c.sourceUrl && (
                    <a
                      href={c.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#64748b', textDecoration: 'underline', fontSize: 12, marginLeft: 'auto' }}
                    >
                      EBS 공식 분석 문서 보기 ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
