'use client';

import { useState, useEffect } from 'react';
import NoteCanvas from './NoteCanvas';

function loadMemo(key) {
  if (typeof window === 'undefined') return '';
  try { return window.localStorage.getItem(key) || ''; } catch { return ''; }
}
function saveMemo(key, value) {
  if (typeof window === 'undefined') return;
  try { window.localStorage.setItem(key, value); } catch { /* ignore */ }
}

/**
 * ProblemScratchpad
 * -----------------
 * 문제 카드 안에 삽입되는 태블릿 연습장 컴포넌트.
 * toggle 버튼 + NoteCanvas(손글씨 필기) + 최종 답 메모 입력란으로 구성.
 * forceOpen prop으로 상위(태블릿 모드 / 전체 토글)에서 일괄 제어 가능.
 */
export default function ProblemScratchpad({ problemId, seed, language = 'ko', forceOpen = undefined }) {
  const [userToggled, setUserToggled] = useState(null);

  useEffect(() => {
    setUserToggled(null);
  }, [forceOpen]);

  const open = userToggled !== null ? userToggled : (forceOpen !== undefined ? forceOpen : false);

  const storageKey = seed ? `ms_note_${seed}_${problemId}` : `note_${problemId}`;
  const memoKey = `${storageKey}_memo`;
  const [memo, setMemo] = useState('');

  useEffect(() => {
    if (open) setMemo(loadMemo(memoKey));
  }, [open, memoKey]);

  const handleMemo = (e) => {
    const val = e.target.value;
    setMemo(val);
    saveMemo(memoKey, val);
  };

  return (
    <div className="problem-scratchpad-wrap no-print">
      <button
        type="button"
        className={`problem-scratchpad-toggle${open ? ' open' : ''}`}
        onClick={() => setUserToggled(!open)}
        title={language === 'ko' ? '태블릿 연습장 열기/닫기' : 'Toggle scratchpad'}
      >
        <span>✍️</span>
        <span>{open ? (language === 'ko' ? '연습장 닫기' : 'Hide Scratchpad') : (language === 'ko' ? '연습장' : 'Scratchpad')}</span>
      </button>
      {open && (
        <div className="problem-scratchpad-panel">
          <NoteCanvas storageKey={storageKey} open={open} />
          <div className="problem-scratchpad-memo">
            <label className="problem-scratchpad-memo-label">
              {language === 'ko' ? '📝 내 답:' : '📝 My Answer:'}
            </label>
            <input
              type="text"
              className="problem-scratchpad-memo-input"
              value={memo}
              onChange={handleMemo}
              placeholder={language === 'ko' ? '답을 여기에 적어두세요' : 'Write your answer here'}
            />
          </div>
        </div>
      )}
    </div>
  );
}
