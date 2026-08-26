'use client';

import { useLanguage } from '../language';
import { tr } from '../i18n';
import Board from '../board/Board';
import { NOTICES, localizeNotice } from './data';

export default function NoticesList() {
  const { language } = useLanguage();
  const staticPosts = NOTICES.map((notice) => ({
    id: notice.id,
    static: true,
    name: null,
    message: `${localizeNotice(notice, language, 'title')}\n\n${localizeNotice(notice, language, 'body')}`,
    image: null,
    createdAt: `${notice.date}T00:00:00.000Z`,
    reply: null,
  }));

  return <>
    <p className="no-print" style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 6 }}><a href="/">{tr(language, 'home')}</a> / {tr(language, 'noticesCrumb')}</p>
    <h1 className="font-display" style={{ fontSize: 26, margin: '0 0 8px' }}>{tr(language, 'noticesTitle')}</h1>
    <p style={{ color: 'var(--ink-soft)', margin: '0 0 28px' }}>{tr(language, 'noticesDesc')}</p>

    <Board category="notice" adminOnlyPost allowReply={false} staticPosts={staticPosts} />
  </>;
}
