'use client';

import { useState } from 'react';

const labelStyle = { fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)' };
const fieldStyle = { width: '100%', padding: '9px 11px', border: '1px solid var(--paper-line)', borderRadius: 8, background: '#fff', font: 'inherit', boxSizing: 'border-box' };

function formatDate(ms) {
  if (!ms) return '-';
  return new Date(ms).toLocaleString('ko-KR');
}

function formatLabel(value) {
  return String(value || '').replace(/[-_:]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function DashboardAdmin() {
  const [password, setPassword] = useState('');
  const [students, setStudents] = useState(null);
  const [detailEmail, setDetailEmail] = useState(null);
  const [detail, setDetail] = useState(null);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  async function request(action, extra) {
    if (!password) { setStatus('관리자 비밀번호를 입력해주세요.'); return null; }
    setBusy(true);
    try {
      const res = await fetch('/api/dashboard/admin-stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, action, ...extra }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '요청에 실패했습니다.');
      return data;
    } catch (error) {
      setStatus(error.message);
      return null;
    } finally {
      setBusy(false);
    }
  }

  async function loadStudents() {
    const data = await request('list');
    if (data) { setStudents(data.students || []); setStatus(`학생 ${data.students?.length || 0}명을 불러왔습니다.`); }
  }

  async function openDetail(email) {
    if (detailEmail === email) { setDetailEmail(null); setDetail(null); return; }
    const data = await request('detail', { email });
    if (data) { setDetailEmail(email); setDetail(data); }
  }

  return <div style={{ display: 'grid', gap: 16 }}>
    <p style={{ color: 'var(--ink-soft)', margin: 0 }}>
      모든 학생의 채점 기록·단원별 정답률을 확인합니다. 각 학생 본인은 자신의 기록만 볼 수 있고(/dashboard), 이 화면은 관리자(선생님) 전용입니다.
    </p>

    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap', padding: 18, background: 'var(--card-bg)', border: '1px solid var(--paper-line)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
      <label style={{ display: 'grid', gap: 6, flex: '1 1 220px' }}>
        <span style={labelStyle}>관리자 비밀번호</span>
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} style={fieldStyle} />
      </label>
      <button type="button" className="button button-primary" disabled={busy} onClick={loadStudents}>{busy ? '불러오는 중...' : '학생 목록 불러오기'}</button>
      {status ? <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-soft)' }}>{status}</p> : null}
    </div>

    {students ? <div style={{ display: 'grid', gap: 8 }}>
      <h3 style={{ margin: 0, fontSize: 16 }}>학생 목록 ({students.length})</h3>
      {students.length === 0 ? <p style={{ color: 'var(--ink-soft)', fontSize: 14 }}>가입된 학생이 없습니다.</p> : <div style={{ display: 'grid', gap: 8 }}>
        {students.map((student) => <div key={student.id} style={{ background: 'var(--card-bg)', border: '1px solid var(--paper-line)', borderRadius: 8, overflow: 'hidden' }}>
          <button
            type="button"
            onClick={() => openDetail(student.email)}
            disabled={busy}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', font: 'inherit', flexWrap: 'wrap', gap: 8 }}
          >
            <span>
              <strong>{student.name}</strong> · {student.email}
              <span style={{ display: 'block', fontSize: 12, color: 'var(--ink-soft)' }}>
                {student.grade || '학년 미기재'} · 총 {student.total}문제 {student.accuracy != null ? `· 정답률 ${student.accuracy}%` : ''} · 최근 활동 {formatDate(student.lastSubmittedAt)}
              </span>
            </span>
            <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{detailEmail === student.email ? '접기 ▲' : '상세보기 ▼'}</span>
          </button>
          {detailEmail === student.email && detail ? <div style={{ padding: '0 16px 14px', display: 'grid', gap: 6 }}>
            {(!detail.stats || detail.stats.length === 0) ? <p style={{ color: 'var(--ink-soft)', fontSize: 13, margin: 0 }}>아직 채점 기록이 없습니다.</p> : detail.stats.map((row) => <div key={`${row.grade}:${row.unit}`} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--paper)', borderRadius: 6, fontSize: 13 }}>
              <span>{formatLabel(row.unit)} <span style={{ color: 'var(--ink-soft)' }}>({formatLabel(row.grade)})</span></span>
              <span>{row.correct}/{row.total} · {row.accuracy}%</span>
            </div>)}
          </div> : null}
        </div>)}
      </div>}
    </div> : null}
  </div>;
}
