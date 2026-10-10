'use client';

import { useLanguage } from '../language';
import { tr } from '../i18n';
import Board from '../board/Board';
import { CODING_TRACKS, trackById } from './tracks';

// `track` omitted → /coding landing (track cards + legacy general board).
export default function CodingArchive({ track }) {
  const { language } = useLanguage();
  const ko = language === 'ko';
  const current = track ? trackById(track) : null;
  const name = (t) => (ko ? t.ko : t.en);

  return <>
    <p className="no-print" style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 6 }}>
      <a href="/">{tr(language, 'home')}</a> / {current ? <><a href="/coding">{tr(language, 'codingCrumb')}</a> / {name(current)}</> : tr(language, 'codingCrumb')}
    </p>
    <h1 className="font-display" style={{ fontSize: 26, margin: '0 0 8px' }}>{current ? `${current.icon} ${name(current)}` : tr(language, 'codingTitle')}</h1>
    <p style={{ color: 'var(--ink-soft)', margin: '0 0 20px' }}>{current ? (ko ? current.descKo : current.descEn) : tr(language, 'codingDesc')}</p>

    <nav className="no-print" aria-label="coding tracks" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '0 0 28px' }}>
      {CODING_TRACKS.map((t) => {
        const active = t.id === track;
        return <a key={t.id} href={`/coding/${t.id}`} className={active ? 'button' : 'button button-secondary'} aria-current={active ? 'page' : undefined}>{t.icon} {name(t)}</a>;
      })}
    </nav>

    {!current ? <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14, margin: '0 0 36px' }}>
      {CODING_TRACKS.map((t) => <a key={t.id} href={`/coding/${t.id}`} style={{ display: 'block', padding: 16, border: '1px solid var(--paper-line)', borderRadius: 10, textDecoration: 'none', color: 'var(--ink)' }}>
        <div style={{ fontSize: 26 }}>{t.icon}</div>
        <div className="font-display" style={{ fontSize: 17, margin: '6px 0' }}>{name(t)}</div>
        <div style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6 }}>{ko ? t.descKo : t.descEn}</div>
      </a>)}
    </div> : null}

    {!current ? <h2 className="font-display" style={{ fontSize: 18, margin: '0 0 12px' }}>{tr(language, 'boardCategory_coding')}</h2> : null}
    <Board
      key={current ? current.id : 'general'}
      category={current ? `coding-${current.id}` : 'coding'}
      adminOnlyPost
      allowReply={false}
      staticPosts={[]}
      attachmentAccept="image/*,application/pdf,.zip,.ipynb,.py,.java,.r,.rmd,.c,.h,.csv,.docx,.pptx,.xlsx"
      attachmentLabelKey="formAttachment"
      composerTitleKey="boardCodingComposerTitle"
    />
  </>;
}
