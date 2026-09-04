'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../auth';
import { useLanguage } from '../language';
import { tr } from '../i18n';
import { COUNTRIES, isKorea } from '../countries';

// Grade choices depend on school type + country: a Korean general-school signup gets the
// familiar 초/중/고 breakdown, everything else (international schools, or any other country)
// falls back to a generic Grade 1-12 list since we don't have every country's own school
// system mapped — see project memory for the discussion behind this scope.
function buildGradeGroups(schoolType, country, language) {
  if (schoolType === 'general' && isKorea(country)) {
    return [
      { label: language === 'ko' ? '초등학교' : 'Elementary', items: Array.from({ length: 6 }, (_, i) => (language === 'ko' ? `초등학교 ${i + 1}학년` : `Elementary Grade ${i + 1}`)) },
      { label: language === 'ko' ? '중학교' : 'Middle School', items: Array.from({ length: 3 }, (_, i) => (language === 'ko' ? `중학교 ${i + 1}학년` : `Middle School Grade ${i + 1}`)) },
      { label: language === 'ko' ? '고등학교' : 'High School', items: Array.from({ length: 3 }, (_, i) => (language === 'ko' ? `고등학교 ${i + 1}학년` : `High School Grade ${i + 1}`)) },
    ];
  }
  return [{ label: null, items: Array.from({ length: 12 }, (_, i) => (language === 'ko' ? `${i + 1}학년 (Grade ${i + 1})` : `Grade ${i + 1}`)) }];
}

export default function AuthModal({ mode, onClose }) {
  const { language } = useLanguage();
  const { login, signup } = useAuth();
  const [activeMode, setActiveMode] = useState(mode === 'signup' ? 'signup' : 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [grade, setGrade] = useState('');
  const [schoolType, setSchoolType] = useState('general');
  const [country, setCountry] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const gradeGroups = useMemo(() => buildGradeGroups(schoolType, country, language), [schoolType, country, language]);

  useEffect(() => {
    const allValues = gradeGroups.flatMap((group) => group.items);
    if (grade && !allValues.includes(grade)) setGrade('');
  }, [gradeGroups]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const result = activeMode === 'login'
        ? await login({ email, password })
        : await signup({ email, password, name, birthDate, grade, schoolType, country });
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
            <div className="auth-modal-form-grid">
              <label>
                <span>{tr(language, 'authName')}</span>
                <input type="text" value={name} onChange={(event) => setName(event.target.value)} required maxLength={60} />
              </label>
              <label>
                <span>{tr(language, 'authBirthDate')}</span>
                <input type="date" value={birthDate} onChange={(event) => setBirthDate(event.target.value)} required max={new Date().toISOString().slice(0, 10)} />
              </label>
            </div>
          ) : null}
          {activeMode === 'signup' ? <small style={{ marginTop: -6 }}>{tr(language, 'authBirthDateHint')}</small> : null}

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
            <div className="auth-modal-form-grid">
              <label>
                <span>{tr(language, 'authSchoolType')}</span>
                <select value={schoolType} onChange={(event) => setSchoolType(event.target.value)}>
                  <option value="general">{tr(language, 'authSchoolGeneral')}</option>
                  <option value="international">{tr(language, 'authSchoolInternational')}</option>
                </select>
              </label>
              <label>
                <span>{tr(language, 'authCountry')}</span>
                <input type="text" list="auth-country-options" value={country} onChange={(event) => setCountry(event.target.value)} maxLength={60} placeholder={language === 'ko' ? '입력하면 목록이 나타납니다' : 'Start typing to see suggestions'} />
                <datalist id="auth-country-options">
                  {COUNTRIES.map((c) => <option key={c.ko} value={language === 'ko' ? c.ko : c.en} />)}
                </datalist>
              </label>
              <label>
                <span>{tr(language, 'authGrade')}</span>
                <select value={grade} onChange={(event) => setGrade(event.target.value)}>
                  <option value="">{language === 'ko' ? '선택 안 함' : 'Not specified'}</option>
                  {gradeGroups.map((group) => group.label ? (
                    <optgroup key={group.label} label={group.label}>
                      {group.items.map((item) => <option key={item} value={item}>{item}</option>)}
                    </optgroup>
                  ) : group.items.map((item) => <option key={item} value={item}>{item}</option>))}
                </select>
              </label>
            </div>
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
