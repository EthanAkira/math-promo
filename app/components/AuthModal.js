'use client';

import { useState } from 'react';
import { useAuth } from '../auth';
import { useLanguage } from '../language';
import { tr } from '../i18n';

export default function AuthModal({ mode, onClose }) {
  const { language } = useLanguage();
  const { login, signup } = useAuth();
  const [activeMode, setActiveMode] = useState(mode === 'signup' ? 'signup' : 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [schoolType, setSchoolType] = useState('general');
  const [country, setCountry] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const result = activeMode === 'login'
        ? await login({ email, password })
        : await signup({ email, password, name, grade, schoolType, country });
      if (result.ok) {
        onClose();
      } else {
        setError(result.error || tr(language, 'authNetworkError'));
      }
    } catch {
      setError(tr(language, 'authNetworkError'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-modal-overlay" onClick={onClose} role="presentation">
      <div className="auth-modal" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
        <button type="button" className="auth-modal-close" onClick={onClose} aria-label={tr(language, 'authClose')}>&times;</button>

        <div className="auth-modal-tabs">
          <button type="button" className={activeMode === 'login' ? 'active' : ''} onClick={() => { setActiveMode('login'); setError(''); }}>{tr(language, 'authLogin')}</button>
          <button type="button" className={activeMode === 'signup' ? 'active' : ''} onClick={() => { setActiveMode('signup'); setError(''); }}>{tr(language, 'authSignup')}</button>
        </div>

        <form className="auth-modal-form" onSubmit={handleSubmit}>
          {activeMode === 'signup' ? (
            <label>
              <span>{tr(language, 'authName')}</span>
              <input type="text" value={name} onChange={(event) => setName(event.target.value)} required maxLength={60} />
            </label>
          ) : null}

          <label>
            <span>{tr(language, 'authEmail')}</span>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" />
          </label>

          <label>
            <span>{tr(language, 'authPassword')}</span>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} autoComplete={activeMode === 'login' ? 'current-password' : 'new-password'} />
            {activeMode === 'signup' ? <small>{tr(language, 'authPasswordHint')}</small> : null}
          </label>

          {activeMode === 'signup' ? (
            <>
              <label>
                <span>{tr(language, 'authGrade')}</span>
                <input type="text" value={grade} onChange={(event) => setGrade(event.target.value)} maxLength={20} />
              </label>
              <label>
                <span>{tr(language, 'authSchoolType')}</span>
                <select value={schoolType} onChange={(event) => setSchoolType(event.target.value)}>
                  <option value="general">{tr(language, 'authSchoolGeneral')}</option>
                  <option value="international">{tr(language, 'authSchoolInternational')}</option>
                </select>
              </label>
              <label>
                <span>{tr(language, 'authCountry')}</span>
                <input type="text" value={country} onChange={(event) => setCountry(event.target.value)} maxLength={60} />
              </label>
            </>
          ) : null}

          {error ? <p className="auth-modal-error">{error}</p> : null}

          <button type="submit" className="button button-primary" disabled={busy}>
            {busy ? tr(language, 'authLoading') : tr(language, activeMode === 'login' ? 'authSubmitLogin' : 'authSubmitSignup')}
          </button>

          <button type="button" className="auth-modal-switch" onClick={() => { setActiveMode(activeMode === 'login' ? 'signup' : 'login'); setError(''); }}>
            {tr(language, activeMode === 'login' ? 'authSwitchToSignup' : 'authSwitchToLogin')}
          </button>
        </form>
      </div>
    </div>
  );
}
