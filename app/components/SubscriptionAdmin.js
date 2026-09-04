'use client';

import { useState } from 'react';

const labelStyle = { fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)' };
const fieldStyle = { width: '100%', padding: '9px 11px', border: '1px solid var(--paper-line)', borderRadius: 8, background: '#fff', font: 'inherit', boxSizing: 'border-box' };
const SUBJECT_LABELS = { amc: 'AMC', csat: '수능(CSAT)' };
const DURATION_OPTIONS = [
  { value: '', label: '무기한(평생)' },
  { value: '30', label: '30일' },
  { value: '90', label: '90일' },
  { value: '180', label: '180일' },
  { value: '365', label: '365일' },
];

function formatDate(ms) {
  if (!ms) return '-';
  return new Date(ms).toLocaleDateString('ko-KR');
}

export default function SubscriptionAdmin({ defaultSubject = 'amc' }) {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState(defaultSubject);
  const [durationDays, setDurationDays] = useState('');
  const [subscriptions, setSubscriptions] = useState(null);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  async function request(action, extra) {
    if (!password) { setStatus('관리자 비밀번호를 입력해주세요.'); return null; }
    setBusy(true);
    try {
      const res = await fetch('/api/subscriptions/admin', {
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

  async function loadList() {
    const data = await request('list');
    if (data) { setSubscriptions(data.subscriptions || []); setStatus(`구독 회원 ${data.subscriptions?.length || 0}명을 불러왔습니다.`); }
  }

  async function handleGrant(event) {
    event.preventDefault();
    if (!email.trim()) { setStatus('이메일을 입력해주세요.'); return; }
    const data = await request('grant', { email: email.trim(), subject, durationDays: durationDays || null });
    if (data) {
      setSubscriptions(data.subscriptions || []);
      setStatus(`${data.user.email}님에게 ${SUBJECT_LABELS[subject]} 구독 권한을 부여했습니다.`);
      setEmail('');
    }
  }

  async function handleRevoke(row) {
    if (!window.confirm(`${row.email}님의 ${SUBJECT_LABELS[row.subject]} 구독 권한을 해제할까요?`)) return;
    const data = await request('revoke', { email: row.email, subject: row.subject });
    if (data) { setSubscriptions(data.subscriptions || []); setStatus(`${row.email}님의 ${SUBJECT_LABELS[row.subject]} 구독 권한을 해제했습니다.`); }
  }

  return <div style={{ display: 'grid', gap: 16 }}>
    <p style={{ color: 'var(--ink-soft)', margin: 0 }}>
      허가한 학생·학부모의 이메일(가입 계정)에 과목별 구독 권한을 직접 부여/해제합니다. 결제 없이 관리자가 수동으로 승인하는 방식입니다.
    </p>

    <form onSubmit={handleGrant} style={{ display: 'grid', gap: 14, padding: 20, background: 'var(--card-bg)', border: '1px solid var(--paper-line)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
      <label style={{ display: 'grid', gap: 6 }}>
        <span style={labelStyle}>관리자 비밀번호</span>
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} style={fieldStyle} required />
      </label>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
        <label style={{ display: 'grid', gap: 6 }}>
          <span style={labelStyle}>학생/학부모 이메일 (가입 계정)</span>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} style={fieldStyle} placeholder="student@example.com" required />
        </label>
        <label style={{ display: 'grid', gap: 6 }}>
          <span style={labelStyle}>과목</span>
          <select value={subject} onChange={(event) => setSubject(event.target.value)} style={fieldStyle}>
            <option value="amc">AMC</option>
            <option value="csat">수능(CSAT)</option>
          </select>
        </label>
        <label style={{ display: 'grid', gap: 6 }}>
          <span style={labelStyle}>이용 기간</span>
          <select value={durationDays} onChange={(event) => setDurationDays(event.target.value)} style={fieldStyle}>
            {DURATION_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button type="submit" className="button button-primary" disabled={busy}>{busy ? '처리 중...' : '구독 권한 부여'}</button>
        <button type="button" className="button button-secondary" onClick={loadList} disabled={busy}>구독 회원 목록 불러오기</button>
      </div>

      {status ? <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-soft)' }}>{status}</p> : null}
    </form>

    {subscriptions ? <div style={{ display: 'grid', gap: 8 }}>
      <h3 style={{ margin: 0, fontSize: 16 }}>현재 구독 회원 ({subscriptions.length})</h3>
      {subscriptions.length === 0 ? <p style={{ color: 'var(--ink-soft)', fontSize: 14 }}>아직 구독 권한을 부여받은 회원이 없습니다.</p> : <div style={{ display: 'grid', gap: 8 }}>
        {subscriptions.map((row) => <div key={`${row.user_id}-${row.subject}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--paper)', borderRadius: 8, flexWrap: 'wrap', gap: 8 }}>
          <span>
            <strong>{row.name}</strong> · {row.email} · {SUBJECT_LABELS[row.subject]}
            <span style={{ display: 'block', fontSize: 12, color: 'var(--ink-soft)' }}>
              시작 {formatDate(row.started_at)} · 만료 {row.expires_at ? formatDate(row.expires_at) : '무기한'}
            </span>
          </span>
          <button type="button" className="button button-secondary" onClick={() => handleRevoke(row)} disabled={busy}>해제</button>
        </div>)}
      </div>}
    </div> : null}
  </div>;
}
