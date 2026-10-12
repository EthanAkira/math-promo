'use client';

import { useCallback, useEffect, useState } from 'react';

// Shared "how many problems on this sheet" control for the middle-school worksheet generators.
// Every generator still builds its full 20-problem sheet (seeded by index, so the first N problems are
// identical whatever N is) and shows only the first `count` of them.
export const MIN_PROBLEMS = 5;
export const MAX_PROBLEMS = 20;
const STORAGE_KEY = 'math-worksheet-count';

let currentCount = MAX_PROBLEMS;
export function getProblemCount() { return currentCount; }

const clamp = (n) => Math.min(MAX_PROBLEMS, Math.max(MIN_PROBLEMS, Math.round(Number(n)) || MAX_PROBLEMS));

// Replace the standalone "20" in an i18n string ("20문제", "{count} of 20 correct") with the real count.
export function withCount(text, count) {
  return String(text).replace(/(?<!\d)20(?!\d)/g, String(count));
}

// Must be called before the generator's own mount effect so `getProblemCount()` is already correct when
// that effect builds the first URL / QR code. Priority: ?n= in the URL, then the last choice, then 20.
export function useProblemCount() {
  const [count, setCount] = useState(MAX_PROBLEMS);

  useEffect(() => {
    let next = MAX_PROBLEMS;
    try {
      const fromUrl = new URLSearchParams(window.location.search).get('n');
      if (fromUrl) next = clamp(fromUrl);
      else {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) next = clamp(stored);
      }
    } catch { /* storage may be unavailable */ }
    currentCount = next;
    setCount(next);
  }, []);

  const choose = useCallback((value) => {
    const next = clamp(value);
    currentCount = next;
    setCount(next);
    try { window.localStorage.setItem(STORAGE_KEY, String(next)); } catch { /* ignore */ }
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('n', String(next));
      window.history.replaceState({}, '', url.toString());
    } catch { /* ignore */ }
  }, []);

  return [count, choose];
}

export function ProblemCountSelect({ count, onChange, language }) {
  const ko = language === 'ko';
  const options = [];
  for (let n = MIN_PROBLEMS; n <= MAX_PROBLEMS; n += 1) options.push(n);
  return (
    <label className="problem-count-select no-print" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
      <span>{ko ? '문제 수' : 'Problems'}</span>
      <select value={count} onChange={(event) => onChange(event.target.value)} aria-label={ko ? '문제 수' : 'Number of problems'}>
        {options.map((n) => <option key={n} value={n}>{ko ? `${n}문제` : n}</option>)}
      </select>
    </label>
  );
}
