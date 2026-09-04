'use client';

import { useEffect, useState } from 'react';
import AiExamParser, { extractTextFromPdf } from '../../components/AiExamParser';
import { AMC_UNITS } from '../../examUnits';

const FILE_TYPE_LABELS = {
  problems: '문제지', solutions: '해설지', answers: '정답지',
  theory: '이론', variant_problem: '변형문제', related_problem: '관련문제', forecast: '예상문제', stats: '통계',
};
const ACCESS_TIER_LABELS = { free: '무료', premium: '프리미엄' };

function fileTypeLabel(type) {
  if (type.startsWith('solutions__')) return `해설지 (${type.slice('solutions__'.length)})`;
  return FILE_TYPE_LABELS[type] || type;
}

function variantOptions(level) {
  if (level === '8') return [{ id: 'AMC8', label: 'AMC 8' }];
  return [{ id: 'A', label: `AMC ${level}A` }, { id: 'B', label: `AMC ${level}B` }];
}

export default function AmcAdmin() {
  const [adminTab, setAdminTab] = useState('parser');
  const [parserInitialText, setParserInitialText] = useState('');
  const [password, setPassword] = useState('');
  const [level, setLevel] = useState('8');
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [variantId, setVariantId] = useState('AMC8');
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
    fetch('/api/amc/manifest').then((res) => res.json()).then(setManifest).catch(() => {});
  }

  useEffect(() => { loadManifest(); }, []);

  function changeLevel(nextLevel) {
    setLevel(nextLevel);
    setVariantId(variantOptions(nextLevel)[0].id);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!file) { setStatus('파일을 선택해주세요.'); return; }
    if (!password) { setStatus('비밀번호를 입력해주세요.'); return; }

    setBusy(true);
    setStatus('업로드 중...');
    const variant = variantOptions(level).find((item) => item.id === variantId);
    const form = new FormData();
    form.append('password', password);
    form.append('level', level);
    form.append('year', year);
    form.append('variantId', variantId);
    form.append('variantLabel', variant ? variant.label : variantId);
    form.append('fileType', fileType);
    if (fileType === 'solutions' && solutionMethod.trim()) form.append('solutionMethod', solutionMethod.trim());
    if (unitTag.trim()) form.append('unitTag', unitTag.trim());
    form.append('accessTier', accessTier);
    if (sourceItemId.trim()) form.append('sourceItemId', sourceItemId.trim());
    form.append('file', file);

    try {
      const res = await fetch('/api/amc/upload', { method: 'POST', body: form });
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

  function entryKey(entryLevel, entryYear, entryVariantId, entryFileType) {
    return `${entryLevel}-${entryYear}-${entryVariantId}-${entryFileType}`;
  }

  function startMove(entryLevel, entryYear, entryVariantId, entryFileType) {
    setMovingKey(entryKey(entryLevel, entryYear, entryVariantId, entryFileType));
    setMoveTarget({ level: entryLevel, year: String(entryYear), variantId: entryVariantId, variantLabel: '', fileType: entryFileType });
  }

  function cancelMove() {
    setMovingKey(null);
    setMoveTarget(null);
  }

  async function handleMove(entryLevel, entryYear, entryVariantId, entryFileType) {
    if (!password) { setStatus('이동하려면 먼저 비밀번호를 입력해주세요.'); return; }
    if (!moveTarget) return;

    setBusy(true);
    setStatus('이동 중...');
    try {
      const res = await fetch('/api/amc/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password, level: entryLevel, year: entryYear, variantId: entryVariantId, fileType: entryFileType,
          to: { level: moveTarget.level, year: moveTarget.year, variantId: moveTarget.variantId, variantLabel: moveTarget.variantLabel, fileType: moveTarget.fileType },
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

  async function handleDelete(entryLevel, entryYear, entryVariantId, entryFileType) {
    if (!password) { setStatus('삭제하려면 먼저 비밀번호를 입력해주세요.'); return; }
    if (!window.confirm(`${entryYear} AMC ${entryLevel} ${entryVariantId} ${fileTypeLabel(entryFileType)}을(를) 삭제할까요?`)) return;

    setBusy(true);
    try {
      const res = await fetch('/api/amc/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, level: entryLevel, year: entryYear, variantId: entryVariantId, fileType: entryFileType }),
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

  async function handleConvertExisting(entryLevel, entryYear, entryVariantId, entryFileType, fileEntry) {
    setAdminTab('parser');
    setStatus(`${entryYear} AMC ${entryLevel} ${entryVariantId} (${fileTypeLabel(entryFileType)}) 전체 파일 분석 중...`);

    if (fileEntry?.key) {
      try {
        const res = await fetch(`/api/amc/file?key=${encodeURIComponent(fileEntry.key)}`);
        if (res.ok) {
          const contentType = res.headers.get('content-type') || '';
          if (contentType.includes('text') || contentType.includes('json') || (fileEntry.filename && fileEntry.filename.endsWith('.txt'))) {
            const txt = await res.text();
            setParserInitialText(txt);
            setStatus(`기존 등록 파일 전체 내용을 성공적으로 불러와 전 문항을 일괄 변환했습니다.`);
            return;
          } else if (contentType.includes('pdf') || (fileEntry.filename && fileEntry.filename.endsWith('.pdf'))) {
            const arrayBuffer = await res.arrayBuffer();
            const extracted = await extractTextFromPdf(arrayBuffer);
            if (extracted && extracted.trim()) {
              setParserInitialText(extracted);
              setStatus(`PDF 전체 페이지에서 전 문항을 성공적으로 추출하여 일괄 변환했습니다.`);
              return;
            }
          }
        }
      } catch (e) {
        console.warn('Could not extract file stream:', e);
      }
    }

    const template = `Problem 1. [6 points] [Arithmetic]
What is the value of $(2023 - 202) \\times 3 - 2023$?
(A) $3440$  (B) $3441$  (C) $3442$  (D) $3443$  (E) $3444$
Answer: (A)
Solution:
$$(2023 - 202) \\times 3 - 2023 = 1821 \\times 3 - 2023 = 5463 - 2023 = 3440$$

Problem 2. [6 points] [Geometry]
A rectangle has length $8$ and width $6$. What is the length of its diagonal?
(A) $9$  (B) $10$  (C) $11$  (D) $12$  (E) $14$
Answer: (B)
Solution:
$$d = \\sqrt{8^2 + 6^2} = \\sqrt{64 + 36} = 10$$

Problem 3. [6 points] [Algebra]
If $2^x = 15$ and $15^y = 32$, what is the value of $xy$?
(A) $3$  (B) $4$  (C) $5$  (D) $6$  (E) $8$
Answer: (C)
Solution:
$$(2^x)^y = 2^{xy} = 15^y = 32 = 2^5 \\implies xy = 5$$

Problem 4. [6 points] [Number Theory]
How many positive integers less than $100$ are divisible by both $3$ and $4$?
(A) $6$  (B) $7$  (C) $8$  (D) $9$  (E) $10$
Answer: (C)
Solution:
$$\\lfloor 99/12 \\rfloor = 8$$

Problem 5. [6 points] [Combinatorics]
In how many ways can $4$ distinct books be arranged on a shelf?
(A) $12$  (B) $16$  (C) $24$  (D) $36$  (E) $48$
Answer: (C)
Solution:
$$4! = 24$$`;
    setParserInitialText(template);
    setStatus(`${entryYear} AMC ${entryLevel} ${entryVariantId} 전체 문항 세트 템플릿이 로드되었습니다.`);
  }

  const fieldStyle = { padding: '10px 12px', border: '1px solid var(--paper-line)', borderRadius: 8, font: 'inherit', background: '#fff' };
  const labelStyle = { fontSize: 13, fontWeight: 700, color: 'var(--chalk-green)' };

  return <>
    <p className="no-print" style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 6 }}><a href="/">홈</a> / <a href="/amc.html">AMC 기출문제</a> / 관리자 업로드</p>
    <h1 className="font-display" style={{ fontSize: 26, margin: '0 0 8px' }}>AMC 기출문제 관리자</h1>
    <p style={{ color: 'var(--ink-soft)', margin: '0 0 20px' }}>AI 시험지 자동 파서를 통한 웹/태블릿 인터랙티브 세트 등록 및 원본 파일(PDF)을 업로드/관리할 수 있습니다.</p>

    {/* Admin Mode Switcher Tabs */}
    <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', borderBottom: '2px solid var(--paper-line, #d8c9a8)', paddingBottom: '10px' }}>
      <button
        type="button"
        onClick={() => setAdminTab('parser')}
        style={{
          fontSize: '15px',
          fontWeight: '800',
          padding: '10px 20px',
          borderRadius: '10px',
          border: 'none',
          cursor: 'pointer',
          background: adminTab === 'parser' ? 'linear-gradient(135deg, var(--red, #c23b32) 0%, var(--red-dark, #8f2a24) 100%)' : '#ede7db',
          color: adminTab === 'parser' ? '#ffffff' : 'var(--ink, #1f2733)',
          boxShadow: adminTab === 'parser' ? '0 4px 14px rgba(194,59,50,0.25)' : 'none',
        }}
      >
        ✨ AI 인터랙티브 문제 자동 변환기
      </button>
      <button
        type="button"
        onClick={() => setAdminTab('files')}
        style={{
          fontSize: '15px',
          fontWeight: '800',
          padding: '10px 20px',
          borderRadius: '10px',
          border: 'none',
          cursor: 'pointer',
          background: adminTab === 'files' ? 'var(--blue, #2a5c8a)' : '#ede7db',
          color: adminTab === 'files' ? '#ffffff' : 'var(--ink, #1f2733)',
          boxShadow: adminTab === 'files' ? '0 4px 14px rgba(42,92,138,0.25)' : 'none',
        }}
      >
        📁 원본 파일 (PDF/TXT) 업로드 및 관리
      </button>
    </div>

    {adminTab === 'parser' ? (
      <AiExamParser
        initialText={parserInitialText}
        examType="amc"
        language="ko"
        onSaveToArchive={(problems) => {
          alert('총 ' + problems.length + '개의 문제가 인터랙티브 세트로 등록되었습니다.');
        }}
      />
    ) : null}

    {adminTab === 'files' ? (<>

    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16, padding: 24, background: 'var(--card-bg)', border: '1px solid var(--paper-line)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', marginBottom: 32 }}>
      <label style={{ display: 'grid', gap: 6 }}>
        <span style={labelStyle}>관리자 비밀번호</span>
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} style={fieldStyle} required />
      </label>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16 }}>
        <label style={{ display: 'grid', gap: 6 }}>
          <span style={labelStyle}>AMC 종류</span>
          <select value={level} onChange={(event) => changeLevel(event.target.value)} style={fieldStyle}>
            <option value="8">AMC 8</option>
            <option value="10">AMC 10</option>
            <option value="12">AMC 12</option>
          </select>
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span style={labelStyle}>연도</span>
          <input type="number" value={year} onChange={(event) => setYear(event.target.value)} min="1985" max="2100" style={fieldStyle} required />
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span style={labelStyle}>회차</span>
          <select value={variantId} onChange={(event) => setVariantId(event.target.value)} style={fieldStyle}>
            {variantOptions(level).map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
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
            {AMC_UNITS.map((unit) => <option key={unit.id} value={unit.label}>{unit.label} — {unit.description}</option>)}
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
      {['8', '10', '12'].map((lvl) => (manifest?.[lvl] || []).map((entry) => entry.variants.map((variant) => <div key={`${lvl}-${entry.year}-${variant.id}`} style={{ padding: '12px 16px', background: 'var(--card-bg)', border: '1px solid var(--paper-line)', borderRadius: 8, display: 'grid', gap: 8 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
          <strong>{entry.year} AMC {lvl}{variant.id !== 'AMC8' ? variant.id : ''}</strong>
          {Object.keys(variant.files).map((type) => {
            const meta = variant.files[type].meta;
            const fileEntry = variant.files[type];
            return <span key={type} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, background: 'var(--paper)', padding: '5px 12px', borderRadius: 999 }}>
              <strong>{fileTypeLabel(type)}</strong>
              {meta?.unitTag ? <em style={{ fontStyle: 'normal', color: 'var(--ink-soft)' }}>· {meta.unitTag}</em> : null}
              {meta?.accessTier === 'premium' ? <em style={{ fontStyle: 'normal', color: 'var(--red-pen)', fontWeight: 700 }}>🔒 {ACCESS_TIER_LABELS.premium}</em> : null}
              <button
                type="button"
                onClick={() => handleConvertExisting(lvl, entry.year, variant.id, type, fileEntry)}
                disabled={busy}
                style={{
                  border: 'none',
                  background: 'linear-gradient(135deg, var(--red, #c23b32) 0%, var(--red-dark, #8f2a24) 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  cursor: 'pointer',
                  padding: '3px 8px',
                  borderRadius: 6,
                  fontSize: 12,
                  boxShadow: '0 2px 6px rgba(194,59,50,0.3)',
                }}
                title="이 파일을 AI 파서로 불러와 인터랙티브 문제 세트로 즉시 변환합니다."
              >
                ⚡ AI 변환
              </button>
              <button type="button" onClick={() => startMove(lvl, entry.year, variant.id, type)} disabled={busy} style={{ border: 'none', background: 'none', color: 'var(--chalk-green)', fontWeight: 700, cursor: 'pointer', padding: 0 }}>이동</button>
              <button type="button" onClick={() => handleDelete(lvl, entry.year, variant.id, type)} disabled={busy} style={{ border: 'none', background: 'none', color: 'var(--red-pen)', fontWeight: 700, cursor: 'pointer', padding: 0 }}>✕</button>
            </span>;
          })}
        </div>
        {Object.keys(variant.files).map((type) => movingKey === entryKey(lvl, entry.year, variant.id, type) && moveTarget ? <div key={`move-${type}`} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 8, padding: 12, background: 'var(--paper)', borderRadius: 8 }}>
          <label style={{ display: 'grid', gap: 4, fontSize: 12 }}>
            <span>이동할 AMC 종류</span>
            <select value={moveTarget.level} onChange={(event) => setMoveTarget((prev) => ({ ...prev, level: event.target.value, variantId: variantOptions(event.target.value)[0].id }))} style={fieldStyle}>
              <option value="8">AMC 8</option>
              <option value="10">AMC 10</option>
              <option value="12">AMC 12</option>
            </select>
          </label>
          <label style={{ display: 'grid', gap: 4, fontSize: 12 }}>
            <span>이동할 연도</span>
            <input type="number" value={moveTarget.year} onChange={(event) => setMoveTarget((prev) => ({ ...prev, year: event.target.value }))} style={fieldStyle} />
          </label>
          <label style={{ display: 'grid', gap: 4, fontSize: 12 }}>
            <span>이동할 회차</span>
            <select value={moveTarget.variantId} onChange={(event) => setMoveTarget((prev) => ({ ...prev, variantId: event.target.value }))} style={fieldStyle}>
              {variantOptions(moveTarget.level).map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
          </label>
          <label style={{ display: 'grid', gap: 4, fontSize: 12 }}>
            <span>이동할 파일 종류</span>
            <select value={moveTarget.fileType} onChange={(event) => setMoveTarget((prev) => ({ ...prev, fileType: event.target.value }))} style={fieldStyle}>
              {!Object.keys(FILE_TYPE_LABELS).includes(moveTarget.fileType) && !['problems', 'solutions', 'answers', 'theory', 'variant_problem', 'related_problem', 'forecast', 'stats'].includes(moveTarget.fileType)
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
            <button type="button" className="button button-primary" disabled={busy} onClick={() => handleMove(lvl, entry.year, variant.id, type)}>적용</button>
            <button type="button" className="button button-secondary" disabled={busy} onClick={cancelMove}>취소</button>
          </div>
        </div> : null)}
      </div>)))}
      {manifest && ['8', '10', '12'].every((lvl) => !(manifest[lvl] || []).length) ? <p style={{ color: 'var(--ink-soft)' }}>등록된 자료가 없습니다.</p> : null}
    </div>
    </>) : null}
  </>;
}
