'use client';

import { useEffect, useState } from 'react';

const cardStyle = { padding: 18, border: '1px solid var(--paper-line)', borderRadius: 10, marginBottom: 20 };
const fieldStyle = { padding: '10px 12px', border: '1px solid var(--paper-line)', borderRadius: 8, font: 'inherit', width: '100%', boxSizing: 'border-box' };
const labelStyle = { fontSize: 13, fontWeight: 700, color: 'var(--chalk-green)', display: 'block', marginBottom: 4 };
const primaryButton = { padding: '10px 18px', border: 'none', borderRadius: 8, background: 'var(--red-pen)', color: 'var(--card-bg)', fontWeight: 700, cursor: 'pointer' };
const secondaryButton = { ...primaryButton, background: 'var(--card-bg)', color: 'var(--ink)', border: '1px solid var(--paper-line)' };
const errorStyle = { color: 'var(--red-pen)', fontSize: 13, marginTop: 8 };
const roleBadge = (role) => ({
  display: 'inline-block', marginLeft: 8, fontSize: 11, fontWeight: 700, borderRadius: 4, padding: '2px 6px',
  color: role === 'parent' ? 'var(--card-bg)' : 'var(--red-pen)',
  background: role === 'parent' ? 'var(--chalk-green)' : 'transparent',
  border: role === 'parent' ? 'none' : '1px solid var(--red-pen)',
});

function fmtExpire(expiresAt) {
  const mins = Math.max(0, Math.round((expiresAt - Date.now()) / 60000));
  return `${mins}분 안에 사용`;
}

function LoginForm({ onLoggedIn }) {
  const [step, setStep] = useState('phone'); // 'phone' | 'code'
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [devCode, setDevCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function requestOtp(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const res = await fetch('/api/guardian/request-otp', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '인증번호 요청에 실패했습니다.');
      if (data.devCode) setDevCode(data.devCode); // SMS 벤더 연동 전 임시 — 실제 발송 시작하면 사라짐
      setStep('code');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function verifyOtp(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const res = await fetch('/api/guardian/verify-otp', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '인증번호가 올바르지 않습니다.');
      onLoggedIn(data.guardian, data.students);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={cardStyle}>
      <h1 className="font-display" style={{ fontSize: 26, margin: '0 0 8px' }}>부모님/선생님 로그인</h1>
      <p style={{ color: 'var(--ink-soft)', margin: '0 0 16px' }}>전화번호로 인증번호를 받아 로그인합니다.</p>

      {step === 'phone' ? (
        <form onSubmit={requestOtp}>
          <label style={labelStyle} htmlFor="phone">휴대폰 번호</label>
          <input id="phone" style={fieldStyle} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01012345678" inputMode="numeric" required />
          <button type="submit" style={{ ...primaryButton, marginTop: 12 }} disabled={busy || !phone}>
            {busy ? '전송 중…' : '인증번호 받기'}
          </button>
        </form>
      ) : (
        <form onSubmit={verifyOtp}>
          {devCode ? (
            <p style={{ fontSize: 13, color: 'var(--red-pen)', margin: '0 0 10px' }}>
              (개발용) SMS 발송 업체 연동 전이라 인증번호를 여기 표시합니다: <strong>{devCode}</strong>
            </p>
          ) : null}
          <label style={labelStyle} htmlFor="code">인증번호 6자리</label>
          <input id="code" style={fieldStyle} value={code} onChange={(e) => setCode(e.target.value)} placeholder="123456" inputMode="numeric" maxLength={6} required />
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button type="submit" style={primaryButton} disabled={busy || code.length !== 6}>{busy ? '확인 중…' : '확인'}</button>
            <button type="button" style={secondaryButton} onClick={() => { setStep('phone'); setCode(''); setDevCode(''); }}>번호 다시 입력</button>
          </div>
        </form>
      )}
      {error ? <p style={errorStyle}>{error}</p> : null}
    </div>
  );
}

function AddStudentForm({ onAdded }) {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const res = await fetch('/api/guardian/students', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, grade }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '자녀 등록에 실패했습니다.');
      onAdded(data.students);
      setName('');
      setGrade('');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
      <div style={{ flex: '1 1 160px' }}>
        <label style={labelStyle} htmlFor="studentName">자녀 이름</label>
        <input id="studentName" style={fieldStyle} value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div style={{ flex: '1 1 100px' }}>
        <label style={labelStyle} htmlFor="studentGrade">학년(선택)</label>
        <input id="studentGrade" style={fieldStyle} value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="예: 초3" />
      </div>
      <button type="submit" style={primaryButton} disabled={busy || !name}>{busy ? '등록 중…' : '자녀 등록'}</button>
      {error ? <p style={errorStyle}>{error}</p> : null}
    </form>
  );
}

function RedeemInviteForm({ onRedeemed }) {
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const res = await fetch('/api/guardian/redeem-invite', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '코드 연결에 실패했습니다.');
      onRedeemed(data.students);
      setCode('');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
      <div style={{ flex: 1 }}>
        <label style={labelStyle} htmlFor="inviteCode">선생님으로 초대받으셨다면 코드 입력</label>
        <input id="inviteCode" style={fieldStyle} value={code} onChange={(e) => setCode(e.target.value)} placeholder="초대 코드 8자리" maxLength={8} />
      </div>
      <button type="submit" style={secondaryButton} disabled={busy || !code}>{busy ? '연결 중…' : '연결하기'}</button>
      {error ? <p style={errorStyle}>{error}</p> : null}
    </form>
  );
}

function JoinCodeButton({ studentId, purpose, label }) {
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function issue() {
    setError('');
    setBusy(true);
    try {
      const res = await fetch('/api/guardian/join-code', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, purpose }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '코드 발급에 실패했습니다.');
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <button type="button" style={secondaryButton} onClick={issue} disabled={busy}>{busy ? '발급 중…' : label}</button>
      {result ? (
        <p style={{ marginTop: 8, fontSize: 14 }}>
          코드: <strong style={{ letterSpacing: 2, fontSize: 18, color: 'var(--red-pen)' }}>{result.code}</strong>
          {' '}<span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>({fmtExpire(result.expiresAt)})</span>
        </p>
      ) : null}
      {error ? <p style={errorStyle}>{error}</p> : null}
    </div>
  );
}

function FeedbackForm({ studentId, onSubmitted }) {
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const res = await fetch('/api/report/feedback', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, comment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '코멘트 등록에 실패했습니다.');
      setComment('');
      onSubmitted();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} style={{ marginTop: 12 }}>
      <label style={labelStyle} htmlFor="feedback">코멘트 남기기</label>
      <textarea id="feedback" style={{ ...fieldStyle, minHeight: 70, resize: 'vertical' }} value={comment} onChange={(e) => setComment(e.target.value)} maxLength={500} placeholder="이번 주 학습에 대한 한마디" />
      <button type="submit" style={{ ...primaryButton, marginTop: 8 }} disabled={busy || !comment.trim()}>{busy ? '등록 중…' : '코멘트 남기기'}</button>
      {error ? <p style={errorStyle}>{error}</p> : null}
    </form>
  );
}

function ReportView({ studentId }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch(`/api/report/summary?studentId=${studentId}`, { credentials: 'same-origin' })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.error || '리포트를 불러오지 못했습니다.');
        setReport(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [studentId, reloadKey]);

  if (loading) return <p style={{ color: 'var(--ink-soft)' }}>리포트를 불러오는 중…</p>;
  if (error) return <p style={errorStyle}>{error}</p>;
  if (!report) return null;

  const { progress, weakUnits, studyTime, recentFeedback } = report;

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 12 }}>
        <div>
          <p style={labelStyle}>이번 주 정답률</p>
          <p style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>
            {progress.thisWeek.accuracy === null ? '—' : `${progress.thisWeek.accuracy}%`}
            <span style={{ fontSize: 13, color: 'var(--ink-soft)', fontWeight: 400 }}> ({progress.thisWeek.total}문제)</span>
          </p>
        </div>
        <div>
          <p style={labelStyle}>지난 주 정답률</p>
          <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--ink-soft)' }}>
            {progress.lastWeek.accuracy === null ? '—' : `${progress.lastWeek.accuracy}%`}
            <span style={{ fontSize: 13, fontWeight: 400 }}> ({progress.lastWeek.total}문제)</span>
          </p>
        </div>
        <div>
          <p style={labelStyle}>이번 주 학습 시간</p>
          <p style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>{studyTime.totalMinutes}분</p>
        </div>
      </div>

      {weakUnits.length > 0 ? (
        <div style={{ marginBottom: 12 }}>
          <p style={labelStyle}>취약 단원 (최근 30일)</p>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {weakUnits.map((u) => (
              <li key={u.unit} style={{ fontSize: 14 }}>{u.unit} — 정답률 {u.accuracy}% ({u.total}문제 중 {u.correct}개)</li>
            ))}
          </ul>
        </div>
      ) : (
        <p style={{ fontSize: 13, color: 'var(--ink-soft)' }}>취약 단원을 판단할 만큼 데이터가 아직 충분하지 않습니다.</p>
      )}

      {recentFeedback.length > 0 ? (
        <div style={{ marginBottom: 4 }}>
          <p style={labelStyle}>최근 코멘트</p>
          {recentFeedback.map((f, i) => (
            <p key={i} style={{ fontSize: 13, margin: '0 0 6px', color: 'var(--ink-soft)' }}>
              <strong style={{ color: 'var(--ink)' }}>{f.guardianName || (f.role === 'teacher' ? '선생님' : '부모님')}</strong>: {f.comment}
            </p>
          ))}
        </div>
      ) : null}

      <FeedbackForm studentId={studentId} onSubmitted={() => setReloadKey((k) => k + 1)} />
    </div>
  );
}

export default function ParentDashboard() {
  const [loadingSession, setLoadingSession] = useState(true);
  const [guardian, setGuardian] = useState(null);
  const [students, setStudents] = useState([]);
  const [activeStudentId, setActiveStudentId] = useState(null);

  useEffect(() => {
    fetch('/api/guardian/session', { credentials: 'same-origin' })
      .then((res) => res.json())
      .then((data) => {
        setGuardian(data.guardian || null);
        setStudents(data.students || []);
        if (data.students && data.students.length > 0) setActiveStudentId(data.students[0].id);
      })
      .catch(() => {})
      .finally(() => setLoadingSession(false));
  }, []);

  function handleLoggedIn(g, s) {
    setGuardian(g);
    setStudents(s || []);
    if (s && s.length > 0) setActiveStudentId(s[0].id);
  }

  function handleStudentsUpdated(s) {
    setStudents(s);
    if (!activeStudentId && s.length > 0) setActiveStudentId(s[0].id);
  }

  async function logout() {
    await fetch('/api/guardian/logout', { method: 'POST', credentials: 'same-origin' });
    setGuardian(null);
    setStudents([]);
    setActiveStudentId(null);
  }

  if (loadingSession) return <p style={{ color: 'var(--ink-soft)' }}>불러오는 중…</p>;
  if (!guardian) return <LoginForm onLoggedIn={handleLoggedIn} />;

  const activeStudent = students.find((s) => s.id === activeStudentId) || null;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 className="font-display" style={{ fontSize: 26, margin: 0 }}>부모님/선생님 리포트</h1>
        <button type="button" style={secondaryButton} onClick={logout}>로그아웃</button>
      </div>

      <div style={cardStyle}>
        <RedeemInviteForm onRedeemed={handleStudentsUpdated} />
        <div style={{ height: 1, background: 'var(--paper-line)', margin: '16px 0' }} />
        <AddStudentForm onAdded={handleStudentsUpdated} />
      </div>

      {students.length === 0 ? (
        <p style={{ color: 'var(--ink-soft)' }}>연결된 학생이 아직 없습니다. 위에서 자녀를 등록하거나 초대 코드를 입력하세요.</p>
      ) : (
        <>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            {students.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveStudentId(s.id)}
                style={{ ...(s.id === activeStudentId ? primaryButton : secondaryButton), padding: '8px 14px' }}
              >
                {s.name}
                <span style={roleBadge(s.role)}>{s.role === 'parent' ? '부모' : '선생님'}</span>
              </button>
            ))}
          </div>

          {activeStudent ? (
            <div style={cardStyle}>
              <h2 style={{ fontSize: 18, margin: '0 0 4px' }}>{activeStudent.name}{activeStudent.grade ? ` · ${activeStudent.grade}` : ''}</h2>

              {activeStudent.role === 'parent' ? (
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', margin: '12px 0' }}>
                  <JoinCodeButton studentId={activeStudent.id} purpose="device" label="기기 연결 코드 발급" />
                  <JoinCodeButton studentId={activeStudent.id} purpose="teacher-invite" label="선생님 초대 코드 발급" />
                </div>
              ) : null}

              <ReportView studentId={activeStudent.id} />
            </div>
          ) : null}
        </>
      )}
    </>
  );
}
