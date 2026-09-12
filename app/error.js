'use client';

import { useEffect } from 'react';

export default function GlobalErrorPage({ error, reset }) {
  useEffect(() => {
    console.error('App runtime error caught by error boundary:', error);
  }, [error]);

  const handleClearCacheAndReload = () => {
    try {
      if (typeof window !== 'undefined') {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && (k.startsWith('custom_exam_') || k.startsWith('problem_note_'))) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach((k) => localStorage.removeItem(k));
      }
    } catch (e) {}
    window.location.reload();
  };

  return (
    <main style={{ maxWidth: 640, margin: '80px auto', padding: '32px 24px', textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--ink, #1f2733)', margin: '0 0 12px' }}>
        화면을 불러오는 중 일시적인 오류가 발생했습니다
      </h1>
      <p style={{ fontSize: 15, color: 'var(--ink-soft, #718096)', lineHeight: 1.6, margin: '0 0 24px' }}>
        페이지 로드 또는 문제 데이터를 처리하는 과정에서 예외가 발생했습니다.<br />
        아래 버튼을 눌러 다시 시도하거나, 임시 캐시를 초기화한 뒤 새로고침해 보세요.
      </p>

      {error?.message ? (
        <pre style={{
          padding: '12px 16px',
          background: '#f8f5f0',
          border: '1px solid #e2d9c8',
          borderRadius: 8,
          fontSize: 13,
          color: '#8f2a24',
          textAlign: 'left',
          overflowX: 'auto',
          marginBottom: 24,
          maxHeight: 120,
        }}>
          {error.message}
        </pre>
      ) : null}

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            padding: '10px 20px',
            borderRadius: 8,
            border: 'none',
            background: 'var(--blue, #2a5c8a)',
            color: '#fff',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          🔄 다시 시도
        </button>
        <button
          type="button"
          onClick={handleClearCacheAndReload}
          style={{
            padding: '10px 20px',
            borderRadius: 8,
            border: '1px solid #d8c9a8',
            background: '#fff',
            color: '#8f2a24',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          🧹 임시 캐시 초기화 후 새로고침
        </button>
        <a
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '10px 20px',
            borderRadius: 8,
            border: '1px solid #d8c9a8',
            background: '#ede7db',
            color: '#1f2733',
            fontSize: 14,
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          🏠 홈으로
        </a>
      </div>
    </main>
  );
}
