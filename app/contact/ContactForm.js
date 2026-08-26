'use client';

import { useLanguage } from '../language';
import { tr } from '../i18n';
import Board from '../board/Board';

const CONTACT_EMAIL = 'akihide1980@gmail.com';

export default function ContactForm() {
  const { language } = useLanguage();

  return <>
    <p className="no-print" style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 6 }}><a href="/">{tr(language, 'home')}</a> / {tr(language, 'contactCrumb')}</p>
    <h1 className="font-display" style={{ fontSize: 26, margin: '0 0 8px' }}>{tr(language, 'contactTitle')}</h1>
    <p style={{ color: 'var(--ink-soft)', margin: '0 0 20px' }}>{tr(language, 'contactDesc')}</p>

    <Board category="contact" allowReply staticPosts={[]} />

    <p style={{ marginTop: 24, color: 'var(--ink-soft)', fontSize: 13 }}>
      {tr(language, 'formDirectEmail')}: <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--red-pen)', fontWeight: 700 }}>{CONTACT_EMAIL}</a>
    </p>
  </>;
}
