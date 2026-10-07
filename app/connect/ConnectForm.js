'use client';

import { useEffect, useState } from 'react';

const fieldStyle = { padding: '10px 12px', border: '1px solid var(--paper-line)', borderRadius: 8, font: 'inherit', width: '100%', boxSizing: 'border-box', letterSpacing: 2, textAlign: 'center', fontSize: 20, textTransform: 'uppercase' };
const buttonStyle = { marginTop: 12, padding: '10px 18px', border: 'none', borderRadius: 8, background: 'var(--red-pen)', color: 'var(--card-bg)', fontWeight: 700, cursor: 'pointer', width: '100%' };
const errorStyle = { color: 'var(--red-pen)', fontSize: 13, marginTop: 8 };

export default function ConnectForm() {
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [connectedStudent, setConnectedStudent] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch('/api/connect/session', { credentials: 'same-origin' })
      .then((res) => res.json())
      .then((data) => setConnectedStudent(data.student || null))
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  async function submit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const res = await fetch('/api/connect/redeem', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '연결에 실패했습니다.');
      setConnectedStudent(data.student);
      setCode('');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <h1 className="font-display" style={{ fontSize: 26, margin: '0 0 8px' }}>기기 연결</h1>
      <p style={{ color: 'var(--ink-soft)', margin: '0 0 20px' }}>
        부모님 화면(/parent)에서 발급받은 연결 코드를 이 기기에 입력하면, 앞으로 이 기기에서 푸는 문제가
        자동으로 부모님/선생님 리포트에 기록됩니다.
      </p>

      {!checking && connectedStudent ? (
        <div style={{ padding: 16, border: '1px solid var(--paper-line)', borderRadius: 10, marginBottom: 20 }}>
          <p style={{ margin: 0, fontWeight: 700 }}>
            이 기기는 <span style={{ color: 'var(--red-pen)' }}>{connectedStudent.name}</span> 학생으로 연결돼 있습니다.
          </p>
          <p style={{ margin: '8px 0 0', fontSize: 13, color: 'var(--ink-soft)' }}>
            다른 학생 기기로 바꾸려면 새 연결 코드를 입력하세요.
          </p>
        </div>
      ) : null}

      <form onSubmit={submit}>
        <input
          style={fieldStyle}
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="연결 코드 8자리"
          maxLength={8}
          autoComplete="off"
          required
        />
        <button type="submit" style={buttonStyle} disabled={busy || code.trim().length === 0}>
          {busy ? '연결 중…' : '연결하기'}
        </button>
      </form>
      {error ? <p style={errorStyle}>{error}</p> : null}
    </>
  );
}
