'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useLanguage } from '../language';
import { tr } from '../i18n';

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const PAGE_SIZE = 15;
const POPULAR_VIEWS = 50;

function formatDate(iso) {
  try {
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}.${m}.${day}`;
  } catch {
    return iso;
  }
}

function titleOf(message, fallback) {
  const firstLine = (message || '').split('\n')[0].trim();
  if (!firstLine) return fallback;
  return firstLine.length > 60 ? `${firstLine.slice(0, 60)}…` : firstLine;
}

const IMAGE_EXTENSION_RE = /\.(png|jpe?g|gif|webp|svg|bmp)$/i;

// Older posts (and any upload where the browser didn't report a MIME type) have no
// `contentType`, so fall back to sniffing the filename extension.
function isImageAttachment(attachment) {
  if (!attachment) return false;
  if (attachment.contentType) return attachment.contentType.startsWith('image/');
  return IMAGE_EXTENSION_RE.test(attachment.filename || '');
}

const fieldStyle = { padding: '10px 12px', border: '1px solid var(--paper-line)', borderRadius: 8, font: 'inherit' };
const labelStyle = { fontSize: 13, fontWeight: 700, color: 'var(--chalk-green)' };
const tableHeadStyle = { padding: '10px 8px', borderBottom: '2px solid var(--ink)', fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)', textAlign: 'left', whiteSpace: 'nowrap' };
const tableCellStyle = { padding: '10px 8px', borderBottom: '1px solid var(--paper-line)', fontSize: 13, verticalAlign: 'top' };
const tagStyle = { display: 'inline-block', marginLeft: 6, fontSize: 11, fontWeight: 700, color: 'var(--red-pen)', border: '1px solid var(--red-pen)', borderRadius: 4, padding: '1px 5px', verticalAlign: 'middle' };

export default function Board({ category, adminOnlyPost = false, allowReply = true, staticPosts = [], attachmentAccept = 'image/*', attachmentLabelKey = 'formImage', composerTitleKey }) {
  const { language } = useLanguage();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [view, setView] = useState('list'); // 'list' | 'compose' | 'detail'
  const [selectedPost, setSelectedPost] = useState(null);

  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [composeError, setComposeError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const [adminPassword, setAdminPassword] = useState('');
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const [replyDraft, setReplyDraft] = useState('');
  const [busy, setBusy] = useState(false);

  async function loadPosts() {
    setLoading(true);
    setLoadError(false);
    try {
      const res = await fetch(`/api/board/posts?category=${category}`);
      if (!res.ok) throw new Error('failed');
      const data = await res.json();
      setPosts(Array.isArray(data.posts) ? data.posts : []);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const combined = useMemo(() => {
    const merged = [...staticPosts, ...posts];
    return merged.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [staticPosts, posts]);

  const filtered = useMemo(() => {
    if (!query.trim()) return combined;
    const q = query.trim().toLowerCase();
    return combined.filter((post) => (post.message || '').toLowerCase().includes(q) || (post.name || '').toLowerCase().includes(q));
  }, [combined, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function numberFor(post) {
    const idx = combined.findIndex((item) => item.id === post.id);
    return combined.length - idx;
  }

  async function openDetail(post) {
    setSelectedPost(post);
    setView('detail');
    setReplyDraft('');
    setAdminError('');
    if (post.static) return;
    try {
      const res = await fetch(`/api/board/posts?id=${encodeURIComponent(post.id)}&view=1`);
      if (res.ok) {
        const data = await res.json();
        if (data.post) {
          setSelectedPost(data.post);
          setPosts((prev) => prev.map((item) => (item.id === data.post.id ? data.post : item)));
        }
      }
    } catch {
      // view-count tracking is best-effort
    }
  }

  function backToList() {
    setView('list');
    setSelectedPost(null);
  }

  function openCompose() {
    if (adminOnlyPost && !adminUnlocked) {
      setShowAdminLogin(true);
      return;
    }
    setComposeError('');
    setView('compose');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!message.trim()) {
      setComposeError(tr(language, 'formRequired'));
      return;
    }
    if (imageFile && imageFile.size > MAX_IMAGE_BYTES) {
      setComposeError(tr(language, 'boardUploadTooLarge'));
      return;
    }
    if (adminOnlyPost && !adminPassword) {
      setComposeError(tr(language, 'boardWrongPassword'));
      return;
    }
    setComposeError('');
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('category', category);
      formData.append('name', name);
      formData.append('message', message);
      if (adminOnlyPost) formData.append('password', adminPassword);
      if (imageFile) formData.append('image', imageFile);

      const res = await fetch('/api/board/posts', { method: 'POST', body: formData });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setComposeError(data.error === 'Incorrect password.' ? tr(language, 'boardWrongPassword') : tr(language, 'boardSubmitError'));
        setSubmitting(false);
        return;
      }
      setName('');
      setMessage('');
      setImageFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      await loadPosts();
      setPage(1);
      setView('list');
    } catch {
      setComposeError(tr(language, 'boardSubmitError'));
    } finally {
      setSubmitting(false);
    }
  }

  function unlockAdmin() {
    if (!adminPassword) return;
    setAdminUnlocked(true);
    setAdminError('');
    setShowAdminLogin(false);
  }

  function logoutAdmin() {
    setAdminUnlocked(false);
    setAdminPassword('');
    setAdminError('');
  }

  async function submitReply() {
    const text = replyDraft.trim();
    if (!text || !selectedPost) return;
    setBusy(true);
    try {
      const res = await fetch('/api/board/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword, id: selectedPost.id, reply: text }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setAdminError(tr(language, 'boardWrongPassword'));
        if (res.status === 401) setAdminUnlocked(false);
        return;
      }
      setSelectedPost(data.post);
      setReplyDraft('');
      await loadPosts();
    } catch {
      setAdminError(tr(language, 'boardSubmitError'));
    } finally {
      setBusy(false);
    }
  }

  async function deleteSelected() {
    if (!selectedPost || (typeof window !== 'undefined' && !window.confirm(tr(language, 'boardConfirmDelete')))) return;
    setBusy(true);
    try {
      const res = await fetch('/api/board/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword, id: selectedPost.id }),
      });
      if (!res.ok) {
        setAdminError(tr(language, 'boardWrongPassword'));
        if (res.status === 401) setAdminUnlocked(false);
        return;
      }
      await loadPosts();
      backToList();
    } catch {
      setAdminError(tr(language, 'boardSubmitError'));
    } finally {
      setBusy(false);
    }
  }

  const adminBox = <div className="no-print" style={{ margin: '18px 0', fontSize: 13 }}>
    {!adminUnlocked ? <>
      {(showAdminLogin || !adminOnlyPost) ? <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder={tr(language, 'boardAdminPasswordPlaceholder')} style={{ ...fieldStyle, maxWidth: 200 }} />
        <button type="button" onClick={unlockAdmin} className="button button-secondary">{tr(language, 'boardAdminLogin')}</button>
      </div> : <button type="button" onClick={() => setShowAdminLogin(true)} style={{ background: 'none', border: 'none', color: 'var(--ink-soft)', fontSize: 12, textDecoration: 'underline', cursor: 'pointer', padding: 0 }}>{tr(language, 'boardAdminLogin')}</button>}
    </> : <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
      <span style={{ color: 'var(--chalk-green)', fontWeight: 700 }}>{tr(language, 'boardAdmin')}</span>
      <button type="button" onClick={logoutAdmin} style={{ background: 'none', border: 'none', color: 'var(--ink-soft)', fontSize: 12, textDecoration: 'underline', cursor: 'pointer', padding: 0 }}>{tr(language, 'boardAdminLogout')}</button>
    </div>}
    {adminError ? <p style={{ color: 'var(--red-pen)', fontSize: 12, marginTop: 6 }}>{adminError}</p> : null}
  </div>;

  if (view === 'compose') {
    return <div>
      <form onSubmit={handleSubmit} className="no-print" style={{ display: 'grid', gap: 14, padding: 22, background: 'var(--card-bg)', border: '1px solid var(--paper-line)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
        <h2 style={{ margin: 0, fontSize: 16 }}>{tr(language, composerTitleKey || (adminOnlyPost ? 'boardNoticeComposerTitle' : 'boardQuestionComposerTitle'))}</h2>
        {adminOnlyPost ? <label style={{ display: 'grid', gap: 6 }}>
          <span style={labelStyle}>{tr(language, 'boardAdminPasswordPlaceholder')}</span>
          <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} style={fieldStyle} />
        </label> : <label style={{ display: 'grid', gap: 6 }}>
          <span style={labelStyle}>{tr(language, 'formName')}</span>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={fieldStyle} />
        </label>}
        <label style={{ display: 'grid', gap: 6 }}>
          <span style={labelStyle}>{tr(language, 'formMessage')}</span>
          <textarea value={message} onChange={(e) => { setMessage(e.target.value); setComposeError(''); }} placeholder={tr(language, 'formMessagePlaceholder')} rows={7} style={{ ...fieldStyle, border: `1px solid ${composeError ? 'var(--red-pen)' : 'var(--paper-line)'}`, resize: 'vertical' }} />
        </label>
        <label style={{ display: 'grid', gap: 6 }}>
          <span style={labelStyle}>{tr(language, attachmentLabelKey)}</span>
          <input ref={fileInputRef} type="file" accept={attachmentAccept} onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
        </label>
        {composeError ? <span style={{ color: 'var(--red-pen)', fontSize: 12, fontWeight: 700 }}>{composeError}</span> : null}
        <div style={{ display: 'flex', gap: 10 }}>
          <button type="submit" className="button button-primary" disabled={submitting}>{adminOnlyPost ? tr(language, 'boardSubmitNotice') : tr(language, 'boardSubmitQuestion')}</button>
          <button type="button" onClick={() => setView('list')} className="button button-secondary">{tr(language, 'boardCancel')}</button>
        </div>
      </form>
    </div>;
  }

  if (view === 'detail' && selectedPost) {
    const views = selectedPost.views || 0;
    return <div>
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <button type="button" onClick={backToList} className="button button-secondary">{`← ${tr(language, 'boardBackToList')}`}</button>
        {adminUnlocked && !selectedPost.static ? <button type="button" onClick={deleteSelected} disabled={busy} style={{ background: 'none', border: 'none', color: 'var(--ink-soft)', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}>{tr(language, 'boardDelete')}</button> : null}
      </div>

      <article style={{ padding: '24px 26px', background: 'var(--card-bg)', border: '1px solid var(--paper-line)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
        <h2 style={{ margin: '0 0 10px', fontSize: 19 }}>{titleOf(selectedPost.message, tr(language, 'boardNoTitle'))}</h2>
        <p className="font-mono" style={{ margin: '0 0 16px', color: 'var(--ink-soft)', fontSize: 12 }}>
          {selectedPost.name || tr(language, 'boardAnonymous')} · {formatDate(selectedPost.createdAt)} · {tr(language, 'boardViewsLabel')} {views}
        </p>
        <p style={{ margin: '0 0 14px', color: 'var(--ink)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{selectedPost.message}</p>
        {selectedPost.image ? (
          isImageAttachment(selectedPost.image) ? (
            <a href={`/api/board/file?key=${encodeURIComponent(selectedPost.image.key)}`} target="_blank" rel="noreferrer" style={{ display: 'inline-block' }}>
              <img src={`/api/board/file?key=${encodeURIComponent(selectedPost.image.key)}`} alt={tr(language, 'boardViewImage')} style={{ maxWidth: '100%', maxHeight: 400, borderRadius: 8, border: '1px solid var(--paper-line)' }} />
            </a>
          ) : (
            <a href={`/api/board/file?key=${encodeURIComponent(selectedPost.image.key)}`} target="_blank" rel="noreferrer" className="button button-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span>📎</span> {selectedPost.image.filename} · {tr(language, 'boardDownloadFile')}
            </a>
          )
        ) : null}

        {allowReply ? <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px dashed var(--paper-line)' }}>
          {selectedPost.reply ? <div>
            <p className="font-mono" style={{ margin: '0 0 6px', color: 'var(--chalk-green)', fontSize: 12, fontWeight: 700 }}>{tr(language, 'boardReplyLabel')} · {tr(language, 'boardAdmin')} · {formatDate(selectedPost.reply.createdAt)}</p>
            <p style={{ margin: 0, color: 'var(--ink)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{selectedPost.reply.message}</p>
          </div> : <p style={{ margin: 0, color: 'var(--ink-soft)', fontSize: 13 }}>{tr(language, 'boardNoReplyYet')}</p>}

          {adminUnlocked && !selectedPost.reply && !selectedPost.static ? <div className="no-print" style={{ display: 'grid', gap: 8, marginTop: 12 }}>
            <textarea value={replyDraft} onChange={(e) => setReplyDraft(e.target.value)} placeholder={tr(language, 'boardWriteReplyPlaceholder')} rows={3} style={{ ...fieldStyle, resize: 'vertical' }} />
            <button type="button" onClick={submitReply} disabled={busy} className="button button-secondary" style={{ justifySelf: 'start' }}>{tr(language, 'boardSubmitReply')}</button>
          </div> : null}
        </div> : null}
      </article>

      {adminBox}
    </div>;
  }

  return <div>
    <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
      <form onSubmit={(e) => { e.preventDefault(); setQuery(searchInput); setPage(1); }} style={{ display: 'flex', gap: 6 }}>
        <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder={tr(language, 'boardSearchPlaceholder')} style={{ ...fieldStyle, width: 200 }} />
        <button type="submit" className="button button-secondary">{tr(language, 'boardSearchButton')}</button>
      </form>
      <button type="button" onClick={openCompose} className="button button-primary">{tr(language, 'boardWriteNew')}</button>
    </div>

    {showAdminLogin && adminOnlyPost && !adminUnlocked ? adminBox : null}

    {loading ? <p style={{ color: 'var(--ink-soft)' }}>{tr(language, 'boardLoading')}</p> : null}
    {!loading && loadError ? <p style={{ color: 'var(--red-pen)' }}>{tr(language, 'boardSubmitError')}</p> : null}

    {!loading && !loadError ? <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ ...tableHeadStyle, width: 60, textAlign: 'center' }}>{tr(language, 'boardColNumber')}</th>
            <th style={tableHeadStyle}>{tr(language, 'boardColTitle')}</th>
            <th style={{ ...tableHeadStyle, width: 100 }}>{tr(language, 'boardColDate')}</th>
            <th style={{ ...tableHeadStyle, width: 100 }}>{tr(language, 'boardColAuthor')}</th>
            <th style={{ ...tableHeadStyle, width: 70, textAlign: 'right' }}>{tr(language, 'boardColViews')}</th>
          </tr>
        </thead>
        <tbody>
          {pageItems.length === 0 ? <tr><td colSpan={5} style={{ ...tableCellStyle, textAlign: 'center', color: 'var(--ink-soft)' }}>{query ? tr(language, 'boardNoResults') : tr(language, 'boardEmpty')}</td></tr> : null}
          {pageItems.map((post) => {
            const views = post.views || 0;
            return <tr key={post.id} onClick={() => openDetail(post)} style={{ cursor: 'pointer' }}>
              <td style={{ ...tableCellStyle, textAlign: 'center', color: 'var(--red-pen)', fontWeight: category === 'notice' ? 700 : 400 }}>{category === 'notice' ? tr(language, 'boardPinned') : numberFor(post)}</td>
              <td style={tableCellStyle}>
                <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{titleOf(post.message, tr(language, 'boardNoTitle'))}</span>
                {post.reply ? <span style={{ color: 'var(--red-pen)', fontWeight: 700, marginLeft: 4 }}>(1)</span> : null}
                {post.image ? <span style={tagStyle}>{tr(language, isImageAttachment(post.image) ? 'boardHasImage' : 'boardHasAttachment')}</span> : null}
                {views >= POPULAR_VIEWS ? <span style={tagStyle}>{tr(language, 'boardPopular')}</span> : null}
              </td>
              <td style={tableCellStyle}>{formatDate(post.createdAt)}</td>
              <td style={tableCellStyle}>{post.name || tr(language, 'boardAnonymous')}</td>
              <td style={{ ...tableCellStyle, textAlign: 'right' }}>{views}</td>
            </tr>;
          })}
        </tbody>
      </table>
    </div> : null}

    {!loading && !loadError && totalPages > 1 ? <div className="no-print" style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 18, alignItems: 'center' }}>
      <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage <= 1} className="button button-secondary">{tr(language, 'boardPrev')}</button>
      <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{currentPage} / {totalPages}</span>
      <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages} className="button button-secondary">{tr(language, 'boardNext')}</button>
    </div> : null}

    {!adminOnlyPost ? adminBox : null}
  </div>;
}
