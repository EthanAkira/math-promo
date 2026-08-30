'use client';

import { useState } from 'react';

const STAGES = ['catalogued', 'sourced', 'analyzed', 'implemented', 'validated', 'localized', 'published'];
const VALIDATION_STATES = ['not-validated', 'pending', 'passed', 'failed'];
const REVIEW_STATES = ['not-reviewed', 'pending', 'passed', 'failed'];
const LEVELS = ['foundation', 'standard', 'advanced', 'challenge'];

const initialRecord = {
  unitId: '',
  source: { type: 'uploaded-reference', reference: '', rights: 'user-provided-for-analysis' },
  problemType: 'generated-family',
  analysis: { fixedElements: '', variables: '', constraints: '', solutionRule: '', answerValidation: '100-seed property and determinism validation' },
  difficultyRules: { defaultLevel: 'standard', allowedLevels: LEVELS, factors: ['reasoningSteps', 'conceptCount', 'numberComplexity', 'conditionCount', 'visualInterpretation'] },
  evidenceStatus: 'sourced',
  validationStatus: 'not-validated',
  displayReviewStatus: 'not-reviewed',
};

export default function CurriculumEvidenceAdmin({ validationSummary, engineSummary }) {
  const [password, setPassword] = useState('');
  const [record, setRecord] = useState(initialRecord);
  const [records, setRecords] = useState([]);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const field = { width: '100%', padding: '9px 11px', border: '1px solid var(--paper-line)', borderRadius: 8, background: '#fff', font: 'inherit', boxSizing: 'border-box' };
  const label = { display: 'grid', gap: 5, fontSize: 12, fontWeight: 700, color: 'var(--chalk-green)' };

  function update(path, value) {
    setRecord((current) => {
      if (path.length === 1) return { ...current, [path[0]]: value };
      return { ...current, [path[0]]: { ...current[path[0]], [path[1]]: value } };
    });
  }

  async function request(action, nextRecord) {
    if (!password) { setStatus('관리자 비밀번호를 입력해주세요.'); return null; }
    setBusy(true);
    try {
      const response = await fetch('/api/curriculum/evidence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, action, record: nextRecord }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || '요청에 실패했습니다.');
      return data;
    } catch (error) {
      setStatus(error.message);
      return null;
    } finally {
      setBusy(false);
    }
  }

  async function loadRecords() {
    const data = await request('list');
    if (data) { setRecords(data.records || []); setStatus(`${data.records?.length || 0}개 증거 레코드를 불러왔습니다.`); }
  }

  async function saveRecord(event) {
    event.preventDefault();
    const payload = {
      ...record,
      analysis: {
        ...record.analysis,
        fixedElements: record.analysis.fixedElements.split('\n').filter(Boolean),
        variables: record.analysis.variables.split('\n').filter(Boolean),
        constraints: record.analysis.constraints.split('\n').filter(Boolean),
      },
    };
    const data = await request('upsert', payload);
    if (data) {
      setStatus(`저장했습니다. 공개 상태: ${data.record.visibility}`);
      setRecords((current) => [data.record, ...current.filter((item) => item.unitId !== data.record.unitId)]);
    }
  }

  return <>
    <p style={{ fontSize: 13, color: 'var(--ink-soft)' }}><a href="/">홈</a> / 교육과정 / 증거 관리</p>
    <h1 className="font-display" style={{ fontSize: 28, marginBottom: 8 }}>문제군 증거·검증 관리</h1>
    <p style={{ color: 'var(--ink-soft)' }}>출처, 문제 구조, 변수·제약, 풀이 규칙, 검증 및 표시 검수 상태를 기록합니다. 검증과 표시 검수를 모두 통과하지 않으면 서버가 자동으로 관리자 미리보기 상태로 저장합니다.</p>

    <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 10, margin: '24px 0' }}>
      <div style={{ padding: 16, border: '1px solid var(--paper-line)', borderRadius: 10, background: 'var(--card-bg)' }}><strong>자동 검증</strong><p>{validationSummary.status} · {validationSummary.passedSubjectCount}/{validationSummary.subjectCount} 과목</p><small>과목·프로필당 {validationSummary.seedCountPerSubject} seeds · 총 {validationSummary.generatedCount}문항</small></div>
      <div style={{ padding: 16, border: '1px solid var(--paper-line)', borderRadius: 10, background: 'var(--card-bg)' }}><strong>엔진 감사</strong><p>{engineSummary.profileCount} profiles</p><small>대수 {engineSummary.preAlgebraUnits} · 기하 {engineSummary.geometryUnits} · 비공개 초안 {engineSummary.hiddenDrafts}</small></div>
    </section>

    <form onSubmit={saveRecord} style={{ display: 'grid', gap: 14, padding: 20, border: '1px solid var(--paper-line)', borderRadius: 12, background: 'var(--card-bg)' }}>
      <label style={label}>관리자 비밀번호<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} style={field} required /></label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12 }}>
        <label style={label}>단원/문제군 ID<input value={record.unitId} onChange={(event) => update(['unitId'], event.target.value)} style={field} required /></label>
        <label style={label}>문제 유형<input value={record.problemType} onChange={(event) => update(['problemType'], event.target.value)} style={field} required /></label>
        <label style={label}>출처 유형<input value={record.source.type} onChange={(event) => update(['source', 'type'], event.target.value)} style={field} required /></label>
        <label style={label}>출처/업로드 참조<input value={record.source.reference} onChange={(event) => update(['source', 'reference'], event.target.value)} placeholder="예: csatfile:nov:2027:공통:problems" style={field} required /></label>
        <label style={label}>저작권·사용 근거<input value={record.source.rights} onChange={(event) => update(['source', 'rights'], event.target.value)} style={field} required /></label>
        <label style={label}>기본 난이도<select value={record.difficultyRules.defaultLevel} onChange={(event) => update(['difficultyRules', 'defaultLevel'], event.target.value)} style={field}>{LEVELS.map((item) => <option key={item}>{item}</option>)}</select></label>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12 }}>
        <label style={label}>고정 요소 · 한 줄에 하나<textarea rows="4" value={record.analysis.fixedElements} onChange={(event) => update(['analysis', 'fixedElements'], event.target.value)} style={field} required /></label>
        <label style={label}>변수 · 한 줄에 하나<textarea rows="4" value={record.analysis.variables} onChange={(event) => update(['analysis', 'variables'], event.target.value)} style={field} required /></label>
        <label style={label}>제약 · 한 줄에 하나<textarea rows="4" value={record.analysis.constraints} onChange={(event) => update(['analysis', 'constraints'], event.target.value)} style={field} required /></label>
      </div>
      <label style={label}>풀이 규칙<textarea rows="3" value={record.analysis.solutionRule} onChange={(event) => update(['analysis', 'solutionRule'], event.target.value)} style={field} required /></label>
      <label style={label}>정답 검증 방법<textarea rows="2" value={record.analysis.answerValidation} onChange={(event) => update(['analysis', 'answerValidation'], event.target.value)} style={field} required /></label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12 }}>
        <label style={label}>증거 단계<select value={record.evidenceStatus} onChange={(event) => update(['evidenceStatus'], event.target.value)} style={field}>{STAGES.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label style={label}>정답 검증<select value={record.validationStatus} onChange={(event) => update(['validationStatus'], event.target.value)} style={field}>{VALIDATION_STATES.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label style={label}>표시 검수<select value={record.displayReviewStatus} onChange={(event) => update(['displayReviewStatus'], event.target.value)} style={field}>{REVIEW_STATES.map((item) => <option key={item}>{item}</option>)}</select></label>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}><button className="button button-primary" disabled={busy}>저장</button><button type="button" className="button button-secondary" disabled={busy} onClick={loadRecords}>등록 목록 불러오기</button></div>
      {status ? <p style={{ margin: 0, fontWeight: 700 }}>{status}</p> : null}
    </form>

    <section style={{ marginTop: 28 }}><h2>등록된 증거 데이터</h2><div style={{ display: 'grid', gap: 8 }}>{records.map((item) => <div key={item.id} style={{ padding: 12, border: '1px solid var(--paper-line)', borderRadius: 8, background: 'var(--card-bg)' }}><strong>{item.unitId}</strong><span style={{ marginLeft: 8 }}>{item.evidenceStatus} · {item.validationStatus} · {item.displayReviewStatus} · {item.visibility}</span><small style={{ display: 'block', marginTop: 4 }}>{item.source.reference}</small></div>)}</div></section>
  </>;
}
