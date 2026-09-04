'use client';

import { useEffect, useState } from 'react';
import { CSAT_SUBJECTS } from '../../examUnits';

const FILE_TYPE_LABELS = {
  problems: '문제지', solutions: '해설지', answers: '정답지',
  theory: '이론', variant_problem: '변형문제', related_problem: '관련문제', forecast: '예상문제', stats: '통계',
};
const ACCESS_TIER_LABELS = { free: '무료', premium: '프리미엄' };
const EXAM_TYPE_LABELS = { june: '6월 모의고사', sept: '9월 모의고사', nov: '대학수학능력시험(11월)', 'city-mock': '시교육청 학력평가' };
const EXAM_TYPES = ['june', 'sept', 'nov', 'city-mock'];
const GRADE_LABELS = { g1: '고1', g2: '고2', g3: '고3' };
// Track naming has changed across curricula (가형/나형, 확통/미적분/기하, 공통 …),
// so the variant is free text with a few suggestions rather than a fixed dropdown.
const VARIANT_SUGGESTIONS = ['공통', '확통', '미적분', '기하', '가형', '나형', '홀수형', '짝수형'];

function fileTypeLabel(type) {
  if (type.startsWith('solutions__')) return `해설지 (${type.slice('solutions__'.length)})`;
  return FILE_TYPE_LABELS[type] || type;
}

export default function CsatAdmin() {
  const [password, setPassword] = useState('');
  const [examType, setExamType] = useState('june');
  const [grade, setGrade] = useState('g3');
  const [issuer, setIssuer] = useState('');
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [variantId, setVariantId] = useState('공통');
  const [variantLabel, setVariantLabel] = useState('공통');
  const [fileType, setFileType] = useState('problems');
  const [solutionMethod, setSolutionMethod] = useState('');
  const [unitTag, setUnitTag] = useState('');
  const [accessTier, setAccessTier] = useState('free');
  const [sourceItemId, setSourceItemId] = useState('');
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [manifest, setManifest] = useState(null);
  const [movingKey, setMovingKey] = useState(null);
  const [moveTarget, setMoveTarget] = useState(null);

  function loadManifest() {
    fetch('/api/csat/manifest').then((res) => res.json()).then(setManifest).catch(() => {});
  }

  useEffect(() => { loadManifest(); }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!file) { setStatus('파일을 선택해주세요.'); return; }
    if (!password) { setStatus('비밀번호를 입력해주세요.'); return; }
    if (!variantId.trim()) { setStatus('회차(트랙)를 입력해주세요.'); return; }

    setBusy(true);
    setStatus('업로드 중...');
    const form = new FormData();
    form.append('password', password);
    form.append('examType', examType);
    form.append('year', year);
    form.append('variantId', variantId.trim());
    form.append('variantLabel', (variantLabel || variantId).trim());
    form.append('fileType', fileType);
    if (grade) form.append('grade', grade);
    if (examType === 'city-mock' && issuer.trim()) form.append('issuer', issuer.trim());
    if (fileType === 'solutions' && solutionMethod.trim()) form.append('solutionMethod', solutionMethod.trim());
    if (unitTag.trim()) form.append('unitTag', unitTag.trim());
    form.append('accessTier', accessTier);
    if (sourceItemId.trim()) form.append('sourceItemId', sourceItemId.trim());
    form.append('file', file);

    try {
      const res = await fetch('/api/csat/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '업로드에 실패했습니다.');
      setStatus('업로드 완료했습니다.');
      setFile(null);
      setSolutionMethod('');
      setUnitTag('');
      setSourceItemId('');
      loadManifest();
    } catch (error) {
      setStatus(error.message);
    } finally {
      setBusy(false);
    }
  }

  function entryKey(entryExamType, entryYear, entryVariantId, entryFileType) {
    return `${entryExamType}-${entryYear}-${entryVariantId}-${entryFileType}`;
  }

  function startMove(entryExamType, entryYear, entryVariantId, entryFileType) {
    setMovingKey(entryKey(entryExamType, entryYear, entryVariantId, entryFileType));
    setMoveTarget({ examType: entryExamType, year: String(entryYear), variantId: entryVariantId, variantLabel: '', fileType: entryFileType });
  }

  function cancelMove() {
    setMovingKey(null);
    setMoveTarget(null);
  }

  async function handleMove(entryExamType, entryYear, entryVariantId, entryFileType) {
    if (!password) { setStatus('이동하려면 먼저 비밀번호를 입력해주세요.'); return; }
    if (!moveTarget) return;
    if (!moveTarget.variantId.trim()) { setStatus('이동할 회차(트랙)를 입력해주세요.'); return; }

    setBusy(true);
    setStatus('이동 중...');
    try {
      const res = await fetch('/api/csat/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password, examType: entryExamType, year: entryYear, variantId: entryVariantId, fileType: entryFileType,
          to: { examType: moveTarget.examType, year: moveTarget.year, variantId: moveTarget.variantId.trim(), variantLabel: moveTarget.variantLabel.trim(), fileType: moveTarget.fileType },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '이동에 실패했습니다.');
      setStatus('이동했습니다.');
      cancelMove();
      loadManifest();
    } catch (error) {
      setStatus(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(entryExamType, entryYear, entryVariantId, entryFileType) {
    if (!password) { setStatus('삭제하려면 먼저 비밀번호를 입력해주세요.'); return; }
    if (!window.confirm(`${entryYear} ${EXAM_TYPE_LABELS[entryExamType]} ${entryVariantId} ${fileTypeLabel(entryFileType)}을(를) 삭제할까요?`)) return;

    setBusy(true);
    try {
      const res = await fetch('/api/csat/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, examType: entryExamType, year: entryYear, variantId: entryVariantId, fileType: entryFileType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '삭제에 실패했습니다.');
      setStatus('삭제했습니다.');
      loadManifest();
    } catch (error) {
      setStatus(error.message);
    } finally {
      setBusy(false);
    }
  }

  const fieldStyle = { padding: '10px 12px', border: '1px solid var(--paper-line)', borderRadius: 8, font: 'inherit', background: '#fff' };
  const labelStyle = { fontSize: 13, fontWeight: 700, color: 'var(--chalk-green)' };

  return <>
    <p className="no-print" style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 6 }}><a href="/">홈</a> / <a href="/csat.html">수능 기출문제</a> / 관리자 업로드</p>
    <h1 className="font-display" style={{ fontSize: 26, margin: '0 0 8px' }}>수능 자료 업로드</h1>
    <p style={{ color: 'var(--ink-soft)', margin: '0 0 28px' }}>관리자 비밀번호로 연도별 문제지·해설지·정답지를 업로드하거나 삭제할 수 있습니다. 회차(트랙)는 연도마다 이름이 달라질 수 있어 직접 입력합니다 (예: 확통/미적분/기하, 가형/나형, 공통).</p>

    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16, padding: 24, background: 'var(--card-bg)', border: '1px solid var(--paper-line)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', marginBottom: 32 }}>
      <label style={{ display: 'grid', gap: 6 }}>
        <span style={labelStyle}>관리자 비밀번호</span>
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} style={fieldStyle} required />
      </label>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16 }}>
        <label style={{ display: 'grid', gap: 6 }}>
          <span style={labelStyle}>시험 종류</span>
          <select value={examType} onChange={(event) => setExamType(event.target.value)} style={fieldStyle}>
            {EXAM_TYPES.map((type) => <option key={type} value={type}>{EXAM_TYPE_LABELS[type]}</option>)}
          </select>
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span style={labelStyle}>학년</span>
          <select value={grade} onChange={(event) => setGrade(event.target.value)} style={fieldStyle}>
            <option value="g1">고1</option>
            <option value="g2">고2</option>
            <option value="g3">고3</option>
          </select>
        </label>

        {examType === 'city-mock' ? <label style={{ display: 'grid', gap: 6 }}>
          <span style={labelStyle}>주관 교육청</span>
          <input type="text" value={issuer} onChange={(event) => setIssuer(event.target.value)} placeholder="예: 서울, 경기, 인천" style={fieldStyle} />
        </label> : null}

        <label style={{ display: 'grid', gap: 6 }}>
          <span style={labelStyle}>연도</span>
          <input type="number" value={year} onChange={(event) => setYear(event.target.value)} min="1993" max="2100" style={fieldStyle} required />
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span style={labelStyle}>회차/트랙 ID</span>
          <input type="text" list="csat-variant-suggestions" value={variantId} onChange={(event) => setVariantId(event.target.value)} placeholder="예: 확통, 미적분, 기하, 공통" style={fieldStyle} required />
          <datalist id="csat-variant-suggestions">
            {VARIANT_SUGGESTIONS.map((item) => <option key={item} value={item} />)}
          </datalist>
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span style={labelStyle}>회차/트랙 표시명</span>
          <input type="text" value={variantLabel} onChange={(event) => setVariantLabel(event.target.value)} placeholder="목록에 보일 이름 (비우면 ID 사용)" style={fieldStyle} />
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span style={labelStyle}>파일 종류</span>
          <select value={fileType} onChange={(event) => setFileType(event.target.value)} style={fieldStyle}>
            <option value="problems">문제지 (기출)</option>
            <option value="solutions">해설지 (풀이)</option>
            <option value="answers">정답지</option>
            <option value="theory">이론</option>
            <option value="variant_problem">변형문제</option>
            <option value="related_problem">관련문제</option>
            <option value="forecast">예상문제</option>
            <option value="stats">통계</option>
          </select>
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span style={labelStyle}>접근 등급</span>
          <select value={accessTier} onChange={(event) => setAccessTier(event.target.value)} style={fieldStyle}>
            <option value="free">무료</option>
            <option value="premium">프리미엄</option>
          </select>
        </label>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
        {fileType === 'solutions' ? <label style={{ display: 'grid', gap: 6 }}>
          <span style={labelStyle}>풀이 방법 (같은 문제에 여러 풀이법을 올릴 때 구분)</span>
          <input type="text" value={solutionMethod} onChange={(event) => setSolutionMethod(event.target.value)} placeholder="예: 대수적 풀이" style={fieldStyle} />
        </label> : null}
        <label style={{ display: 'grid', gap: 6 }}>
          <span style={labelStyle}>단원 태그 (선택)</span>
          <select value={unitTag} onChange={(event) => setUnitTag(event.target.value)} style={fieldStyle}>
            <option value="">단원 없음</option>
            {CSAT_SUBJECTS.map((subject) => <optgroup key={subject.id} label={`${subject.label} (2022개정: ${subject.revised2022})`}>
              {subject.units.map((unit) => <option key={unit.id} value={`${subject.label} · ${unit.label}`}>{unit.label}</option>)}
            </optgroup>)}
          </select>
        </label>
        <label style={{ display: 'grid', gap: 6 }}>
          <span style={labelStyle}>원본 문제 ID (변형·관련·예상 문제일 때)</span>
          <input type="text" value={sourceItemId} onChange={(event) => setSourceItemId(event.target.value)} placeholder="선택 사항" style={fieldStyle} />
        </label>
      </div>

      <label style={{ display: 'grid', gap: 6 }}>
        <span style={labelStyle}>파일 (PDF 또는 TXT)</span>
        <input type="file" accept=".pdf,.txt" onChange={(event) => setFile(event.target.files[0] || null)} style={fieldStyle} required />
      </label>

      <button type="submit" className="button button-primary" disabled={busy} style={{ justifySelf: 'start' }}>업로드</button>
      {status ? <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: status.includes('완료') || status.includes('삭제') ? 'var(--chalk-green)' : 'var(--red-pen)' }}>{status}</p> : null}
    </form>

    <h2 style={{ fontSize: 18, margin: '0 0 12px' }}>현재 등록된 자료</h2>
    <div style={{ display: 'grid', gap: 10 }}>
      {EXAM_TYPES.map((type) => (manifest?.[type] || []).map((entry) => entry.variants.map((variant) => <div key={`${type}-${entry.year}-${variant.id}`} style={{ padding: '12px 16px', background: 'var(--card-bg)', border: '1px solid var(--paper-line)', borderRadius: 8, display: 'grid', gap: 8 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
          <strong>{entry.year} {EXAM_TYPE_LABELS[type]} {variant.label}</strong>
          {Object.keys(variant.files).map((fkey) => {
            const meta = variant.files[fkey].meta;
            return <span key={fkey} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, background: 'var(--paper)', padding: '4px 10px', borderRadius: 999 }}>
              {fileTypeLabel(fkey)}
              {meta?.unitTag ? <em style={{ fontStyle: 'normal', color: 'var(--ink-soft)' }}>· {meta.unitTag}</em> : null}
              {meta?.grade ? <em style={{ fontStyle: 'normal', color: 'var(--ink-soft)' }}>· {GRADE_LABELS[meta.grade]}</em> : null}
              {meta?.accessTier === 'premium' ? <em style={{ fontStyle: 'normal', color: 'var(--red-pen)', fontWeight: 700 }}>🔒 {ACCESS_TIER_LABELS.premium}</em> : null}
              <button type="button" onClick={() => startMove(type, entry.year, variant.id, fkey)} disabled={busy} style={{ border: 'none', background: 'none', color: 'var(--chalk-green)', fontWeight: 700, cursor: 'pointer', padding: 0 }}>이동</button>
              <button type="button" onClick={() => handleDelete(type, entry.year, variant.id, fkey)} disabled={busy} style={{ border: 'none', background: 'none', color: 'var(--red-pen)', fontWeight: 700, cursor: 'pointer', padding: 0 }}>✕</button>
            </span>;
          })}
        </div>
        {Object.keys(variant.files).map((fkey) => movingKey === entryKey(type, entry.year, variant.id, fkey) && moveTarget ? <div key={`move-${fkey}`} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 8, padding: 12, background: 'var(--paper)', borderRadius: 8 }}>
          <label style={{ display: 'grid', gap: 4, fontSize: 12 }}>
            <span>이동할 시험 종류</span>
            <select value={moveTarget.examType} onChange={(event) => setMoveTarget((prev) => ({ ...prev, examType: event.target.value }))} style={fieldStyle}>
              {EXAM_TYPES.map((t) => <option key={t} value={t}>{EXAM_TYPE_LABELS[t]}</option>)}
            </select>
          </label>
          <label style={{ display: 'grid', gap: 4, fontSize: 12 }}>
            <span>이동할 연도</span>
            <input type="number" value={moveTarget.year} onChange={(event) => setMoveTarget((prev) => ({ ...prev, year: event.target.value }))} style={fieldStyle} />
          </label>
          <label style={{ display: 'grid', gap: 4, fontSize: 12 }}>
            <span>이동할 회차/트랙 ID</span>
            <input type="text" list="csat-variant-suggestions" value={moveTarget.variantId} onChange={(event) => setMoveTarget((prev) => ({ ...prev, variantId: event.target.value }))} style={fieldStyle} />
          </label>
          <label style={{ display: 'grid', gap: 4, fontSize: 12 }}>
            <span>표시명 (선택)</span>
            <input type="text" value={moveTarget.variantLabel} onChange={(event) => setMoveTarget((prev) => ({ ...prev, variantLabel: event.target.value }))} placeholder="비우면 ID 사용" style={fieldStyle} />
          </label>
          <label style={{ display: 'grid', gap: 4, fontSize: 12 }}>
            <span>이동할 파일 종류</span>
            <select value={moveTarget.fileType} onChange={(event) => setMoveTarget((prev) => ({ ...prev, fileType: event.target.value }))} style={fieldStyle}>
              {!['problems', 'solutions', 'answers', 'theory', 'variant_problem', 'related_problem', 'forecast', 'stats'].includes(moveTarget.fileType)
                ? <option value={moveTarget.fileType}>{fileTypeLabel(moveTarget.fileType)} (현재 값 유지)</option> : null}
              <option value="problems">문제지 (기출)</option>
              <option value="solutions">해설지 (풀이)</option>
              <option value="answers">정답지</option>
              <option value="theory">이론</option>
              <option value="variant_problem">변형문제</option>
              <option value="related_problem">관련문제</option>
              <option value="forecast">예상문제</option>
              <option value="stats">통계</option>
            </select>
          </label>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            <button type="button" className="button button-primary" disabled={busy} onClick={() => handleMove(type, entry.year, variant.id, fkey)}>적용</button>
            <button type="button" className="button button-secondary" disabled={busy} onClick={cancelMove}>취소</button>
          </div>
        </div> : null)}
      </div>)))}
      {manifest && EXAM_TYPES.every((type) => !(manifest[type] || []).length) ? <p style={{ color: 'var(--ink-soft)' }}>등록된 자료가 없습니다.</p> : null}
    </div>
  </>;
}
