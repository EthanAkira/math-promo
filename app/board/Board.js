'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../language';
import { tr } from '../i18n';

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return iso;
  }
}

const fieldStyle = { padding: '10px 12px', border: '1px solid var(--paper-line)', borderRadius: 8, font: 'inherit' };
const labelStyle = { fontSize: 13, fontWeight: 700, color: 'var(--chalk-green)' };

export default function Board({ category, adminOnlyPost = false, allowReply = true, staticPosts = [] }) {
  const { language } = useLanguage();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [composeError, setComposeError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const [adminPassword, setAdminPassword] = useState('');
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminError, setAdminError] = useState('');

  const [replyDrafts, setReplyDrafts] = useState({});
  const [busyId, setBusyId] = useState(null);

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
  }

  function logoutAdmin() {
    setAdminUnlocked(false);
    setAdminPassword('');
    setAdminError('');
  }

  async function submitReply(postId) {
    const replyText = (replyDrafts[postId] || '').trim();
    if (!replyText) return;
    setBusyId(postId);
    try {
      const res = await fetch('/api/board/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword, id: postId, reply: replyText }),
      });
      if (!res.ok) {
        setAdminError(tr(language, 'boardWrongPassword'));
        if (res.status === 401) setAdminUnlocked(false);
        return;
      }
      setReplyDrafts((prev) => ({ ...prev, [postId]: '' }));
      await loadPosts();
    } catch {
      setAdminError(tr(language, 'boardSubmitError'));
    } finally {
      setBusyId(null);
    }
  }

  async function deletePost(postId) {
    if (typeof window !== 'undefined' && !window.confirm(tr(language, 'boardConfirmDelete'))) return;
    setBusyId(postId);
    try {
      const res = await fetch('/api/board/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword, id: postId }),
      });
      if (!res.ok) {
        setAdminError(tr(language, 'boardWrongPassword'));
        if (res.status === 401) setAdminUnlocked(false);
        return;
      }
      await loadPosts();
    } catch {
      setAdminError(tr(language, 'boardSubmitError'));
    } finally {
      setBusyId(null);
    }
  }

  const combined = [...staticPosts, ...posts].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  return <>
    {!adminOnlyPost && <form onSubmit={handleSubmit} className="no-print" style={{ display: 'grid', gap: 14, padding: 22, marginBottom: 28, background: 'var(--card-bg)', border: '1px solid var(--paper-line)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
      <h2 style={{ margin: 0, fontSize: 16 }}>{tr(language, 'boardQuestionComposerTitle')}</h2>
      <label style={{ display: 'grid', gap: 6 }}>
        <span style={labelStyle}>{tr(language, 'formName')}</span>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={fieldStyle} />
      </label>
      <label style={{ display: 'grid', gap: 6 }}>
        <span style={labelStyle}>{tr(language, 'formMessage')}</span>
        <textarea value={message} onChange={(e) => { setMessage(e.target.value); setComposeError(''); }} placeholder={tr(language, 'formMessagePlaceholder')} rows={5} style={{ ...fieldStyle, border: `1px solid ${composeError ? 'var(--red-pen)' : 'var(--paper-line)'}`, resize: 'vertical' }} />
      </label>
      <label style={{ display: 'grid', gap: 6 }}>
        <span style={labelStyle}>{tr(language, 'formImage')}</span>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
      </label>
      {composeError ? <span style={{ color: 'var(--red-pen)', fontSize: 12, fontWeight: 700 }}>{composeError}</span> : null}
      <button type="submit" className="button button-primary" disabled={submitting} style={{ justifySelf: 'start' }}>{tr(language, 'boardSubmitQuestion')}</button>
    </form>}

    <details className="no-print" style={{ marginBottom: 24 }} open={adminUnlocked}>
      <summary style={{ cursor: 'pointer', fontSize: 13, color: 'var(--ink-soft)', fontWeight: 700 }}>{adminUnlocked ? tr(language, 'boardAdmin') : tr(language, 'boardAdminLogin')}</summary>
      {!adminUnlocked ? <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder={tr(language, 'boardAdminPasswordPlaceholder')} style={{ ...fieldStyle, maxWidth: 220 }} />
        <button type="button" onClick={unlockAdmin} className="button button-secondary">{tr(language, 'boardAdminLogin')}</button>
      </div> : <div style={{ marginTop: 10 }}>
        <button type="button" onClick={logoutAdmin} className="button button-secondary">{tr(language, 'boardAdminLogout')}</button>
      </div>}
      {adminError ? <p style={{ color: 'var(--red-pen)', fontSize: 12, marginTop: 8 }}>{adminError}</p> : null}
    </details>

    {adminOnlyPost && adminUnlocked && <form onSubmit={handleSubmit} className="no-print" style={{ display: 'grid', gap: 14, padding: 22, marginBottom: 28, background: 'var(--card-bg)', border: '1px solid var(--paper-line)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
      <h2 style={{ margin: 0, fontSize: 16 }}>{tr(language, 'boardNoticeComposerTitle')}</h2>
      <label style={{ display: 'grid', gap: 6 }}>
        <span style={labelStyle}>{tr(language, 'formMessage')}</span>
        <textarea value={message} onChange={(e) => { setMessage(e.target.value); setComposeError(''); }} placeholder={tr(language, 'formMessagePlaceholder')} rows={5} style={{ ...fieldStyle, border: `1px solid ${composeError ? 'var(--red-pen)' : 'var(--paper-line)'}`, resize: 'vertical' }} />
      </label>
      <label style={{ display: 'grid', gap: 6 }}>
        <span style={labelStyle}>{tr(language, 'formImage')}</span>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
      </label>
      {composeError ? <span style={{ color: 'var(--red-pen)', fontSize: 12, fontWeight: 700 }}>{composeError}</span> : null}
      <button type="submit" className="button button-primary" disabled={submitting} style={{ justifySelf: 'start' }}>{tr(language, 'boardSubmitNotice')}</button>
    </form>}

    {loading ? <p style={{ color: 'var(--ink-soft)' }}>{tr(language, 'boardLoading')}</p> : null}
    {!loading && loadError ? <p style={{ color: 'var(--red-pen)' }}>{tr(language, 'boardSubmitError')}</p> : null}
    {!loading && !loadError && combined.length === 0 ? <p style={{ color: 'var(--ink-soft)' }}>{tr(language, 'boardEmpty')}</p> : null}

    <div style={{ display: 'grid', gap: 14 }}>
      {combined.map((post) => <article key={post.id} style={{ padding: '20px 22px', background: 'var(--card-bg)', border: '1px solid var(--paper-line)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
          <p className="font-mono" style={{ margin: '0 0 8px', color: 'var(--red-pen)', fontSize: 12, fontWeight: 700 }}>
            {post.name || tr(language, 'boardAnonymous')} · {formatDate(post.createdAt)}
          </p>
          {adminUnlocked && !post.static && <button type="button" onClick={() => deletePost(post.id)} disabled={busyId === post.id} className="no-print" style={{ background: 'none', border: 'none', color: 'var(--ink-soft)', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}>{tr(language, 'boardDelete')}</button>}
        </div>
        <p style={{ margin: '0 0 10px', color: 'var(--ink)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{post.message}</p>
        {post.image ? <a href={`/api/board/file?key=${encodeURIComponent(post.image.key)}`} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginBottom: 10 }}>
          <img src={`/api/board/file?key=${encodeURIComponent(post.image.key)}`} alt={tr(language, 'boardViewImage')} style={{ maxWidth: '100%', maxHeight: 260, borderRadius: 8, border: '1px solid var(--paper-line)' }} />
        </a> : null}

        {allowReply ? <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px dashed var(--paper-line)' }}>
          {post.reply ? <div>
            <p className="font-mono" style={{ margin: '0 0 6px', color: 'var(--chalk-green)', fontSize: 12, fontWeight: 700 }}>{tr(language, 'boardReplyLabel')} · {tr(language, 'boardAdmin')} · {formatDate(post.reply.createdAt)}</p>
            <p style={{ margin: 0, color: 'var(--ink)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{post.reply.message}</p>
          </div> : <p style={{ margin: 0, color: 'var(--ink-soft)', fontSize: 13 }}>{tr(language, 'boardNoReplyYet')}</p>}

          {adminUnlocked && !post.reply && !post.static ? <div className="no-print" style={{ display: 'grid', gap: 8, marginTop: 10 }}>
            <textarea value={replyDrafts[post.id] || ''} onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [post.id]: e.target.value }))} placeholder={tr(language, 'boardWriteReplyPlaceholder')} rows={3} style={{ ...fieldStyle, resize: 'vertical' }} />
            <button type="button" onClick={() => submitReply(post.id)} disabled={busyId === post.id} className="button button-secondary" style={{ justifySelf: 'start' }}>{tr(language, 'boardSubmitReply')}</button>
          </div> : null}
        </div> : null}
      </article>)}
    </div>
  </>;
}
