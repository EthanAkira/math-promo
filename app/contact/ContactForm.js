'use client';

import { useState } from 'react';
import { useLanguage } from '../language';
import { tr } from '../i18n';

const CONTACT_EMAIL = 'akihide1980@gmail.com';

export default function ContactForm() {
  const { language } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState('question');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const [sent, setSent] = useState(false);

  const typeLabels = {
    bug: tr(language, 'formTypeBug'),
    suggestion: tr(language, 'formTypeSuggestion'),
    question: tr(language, 'formTypeQuestion'),
    other: tr(language, 'formTypeOther'),
  };

  function handleSubmit(event) {
    event.preventDefault();
    if (!message.trim()) {
      setError(true);
      setSent(false);
      return;
    }
    setError(false);

    const subject = `[매일 배움 연구소] ${typeLabels[type]}${name ? ` - ${name}` : ''}`;
    const bodyLines = [
      name ? `이름: ${name}` : null,
      email ? `이메일: ${email}` : null,
      `유형: ${typeLabels[type]}`,
      '',
      message,
    ].filter((line) => line !== null);

    const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;
    window.location.href = mailtoUrl;
    setSent(true);
  }

  return <>
    <p className="no-print" style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 6 }}><a href="/">{tr(language, 'home')}</a> / {tr(language, 'contactCrumb')}</p>
    <h1 className="font-display" style={{ fontSize: 26, margin: '0 0 8px' }}>{tr(language, 'contactTitle')}</h1>
    <p style={{ color: 'var(--ink-soft)', margin: '0 0 28px' }}>{tr(language, 'contactDesc')}</p>

    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16, padding: 24, background: 'var(--card-bg)', border: '1px solid var(--paper-line)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
      <label style={{ display: 'grid', gap: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--chalk-green)' }}>{tr(language, 'formName')}</span>
        <input type="text" value={name} onChange={(event) => setName(event.target.value)} style={{ padding: '10px 12px', border: '1px solid var(--paper-line)', borderRadius: 8, font: 'inherit' }} />
      </label>

      <label style={{ display: 'grid', gap: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--chalk-green)' }}>{tr(language, 'formEmail')}</span>
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} style={{ padding: '10px 12px', border: '1px solid var(--paper-line)', borderRadius: 8, font: 'inherit' }} />
      </label>

      <label style={{ display: 'grid', gap: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--chalk-green)' }}>{tr(language, 'formType')}</span>
        <select value={type} onChange={(event) => setType(event.target.value)} style={{ padding: '10px 12px', border: '1px solid var(--paper-line)', borderRadius: 8, font: 'inherit', background: '#fff' }}>
          <option value="question">{tr(language, 'formTypeQuestion')}</option>
          <option value="bug">{tr(language, 'formTypeBug')}</option>
          <option value="suggestion">{tr(language, 'formTypeSuggestion')}</option>
          <option value="other">{tr(language, 'formTypeOther')}</option>
        </select>
      </label>

      <label style={{ display: 'grid', gap: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--chalk-green)' }}>{tr(language, 'formMessage')}</span>
        <textarea value={message} onChange={(event) => { setMessage(event.target.value); setError(false); }} placeholder={tr(language, 'formMessagePlaceholder')} rows={6} style={{ padding: '10px 12px', border: `1px solid ${error ? 'var(--red-pen)' : 'var(--paper-line)'}`, borderRadius: 8, font: 'inherit', resize: 'vertical' }} />
        {error ? <span style={{ color: 'var(--red-pen)', fontSize: 12, fontWeight: 700 }}>{tr(language, 'formRequired')}</span> : null}
      </label>

      <button type="submit" className="button button-primary" style={{ justifySelf: 'start' }}>{tr(language, 'formSubmit')}</button>
      <p style={{ margin: 0, color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.6 }}>{tr(language, 'formHelp')}</p>
      {sent ? <p style={{ margin: 0, color: 'var(--chalk-green)', fontSize: 13, fontWeight: 700 }}>✓ {tr(language, 'formSent')}</p> : null}
    </form>

    <p style={{ marginTop: 18, color: 'var(--ink-soft)', fontSize: 13 }}>
      {tr(language, 'formDirectEmail')}: <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--red-pen)', fontWeight: 700 }}>{CONTACT_EMAIL}</a>
    </p>
  </>;
}
