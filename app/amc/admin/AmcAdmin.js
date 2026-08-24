'use client';

import { useEffect, useState } from 'react';

const FILE_TYPE_LABELS = { problems: '문제지', solutions: '해설지', answers: '정답지' };

function variantOptions(level) {
  if (level === '8') return [{ id: 'AMC8', label: 'AMC 8' }];
  return [{ id: 'A', label: `AMC ${level}A` }, { id: 'B', label: `AMC ${level}B` }];
}

export default function AmcAdmin() {
  const [password, setPassword] = useState('');
  const [level, setLevel] = useState('8');
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [variantId, setVariantId] = useState('AMC8');
  const [fileType, setFileType] = useState('problems');
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [manifest, setManifest] = useState(null);

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
    form.append('file', file);

    try {
      const res = await fetch('/api/amc/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '업로드에 실패했습니다.');
      setStatus('업로드 완료했습니다.');
      setFile(null);
      loadManifest();
    } catch (error) {
      setStatus(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(entryLevel, entryYear, entryVariantId, entryFileType) {
    if (!password) { setStatus('삭제하려면 먼저 비밀번호를 입력해주세요.'); return; }
    if (!window.confirm(`${entryYear} AMC ${entryLevel} ${entryVariantId} ${FILE_TYPE_LABELS[entryFileType]}을(를) 삭제할까요?`)) return;

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

  const fieldStyle = { padding: '10px 12px', border: '1px solid var(--paper-line)', borderRadius: 8, font: 'inherit', background: '#fff' };
  const labelStyle = { fontSize: 13, fontWeight: 700, color: 'var(--chalk-green)' };

  return <>
    <p className="no-print" style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 6 }}><a href="/">홈</a> / <a href="/amc.html">AMC 기출문제</a> / 관리자 업로드</p>
    <h1 className="font-display" style={{ fontSize: 26, margin: '0 0 8px' }}>AMC 자료 업로드</h1>
    <p style={{ color: 'var(--ink-soft)', margin: '0 0 28px' }}>관리자 비밀번호로 연도별 문제지·해설지·정답지를 업로드하거나 삭제할 수 있습니다.</p>

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
            <option value="problems">문제지</option>
            <option value="solutions">해설지</option>
            <option value="answers">정답지</option>
          </select>
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
      {['8', '10', '12'].map((lvl) => (manifest?.[lvl] || []).map((entry) => entry.variants.map((variant) => <div key={`${lvl}-${entry.year}-${variant.id}`} style={{ padding: '12px 16px', background: 'var(--card-bg)', border: '1px solid var(--paper-line)', borderRadius: 8, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
        <strong>{entry.year} AMC {lvl}{variant.id !== 'AMC8' ? variant.id : ''}</strong>
        {Object.keys(variant.files).map((type) => <span key={type} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, background: 'var(--paper)', padding: '4px 10px', borderRadius: 999 }}>
          {FILE_TYPE_LABELS[type]}
          <button type="button" onClick={() => handleDelete(lvl, entry.year, variant.id, type)} disabled={busy} style={{ border: 'none', background: 'none', color: 'var(--red-pen)', fontWeight: 700, cursor: 'pointer', padding: 0 }}>✕</button>
        </span>)}
      </div>)))}
      {manifest && ['8', '10', '12'].every((lvl) => !(manifest[lvl] || []).length) ? <p style={{ color: 'var(--ink-soft)' }}>등록된 자료가 없습니다.</p> : null}
    </div>
  </>;
}
