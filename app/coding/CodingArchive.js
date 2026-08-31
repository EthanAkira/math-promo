'use client';

import { useLanguage } from '../language';
import { tr } from '../i18n';
import Board from '../board/Board';

export default function CodingArchive() {
  const { language } = useLanguage();

  return <>
    <p className="no-print" style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 6 }}><a href="/">{tr(language, 'home')}</a> / {tr(language, 'codingCrumb')}</p>
    <h1 className="font-display" style={{ fontSize: 26, margin: '0 0 8px' }}>{tr(language, 'codingTitle')}</h1>
    <p style={{ color: 'var(--ink-soft)', margin: '0 0 28px' }}>{tr(language, 'codingDesc')}</p>

    <Board
      category="coding"
      adminOnlyPost
      allowReply={false}
      staticPosts={[]}
      attachmentAccept="image/*,application/pdf,.zip,.ipynb,.py,.csv,.docx,.pptx,.xlsx"
      attachmentLabelKey="formAttachment"
      composerTitleKey="boardCodingComposerTitle"
    />
  </>;
}
