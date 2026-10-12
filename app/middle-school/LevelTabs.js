'use client';

import { levelTabLabels } from './levels';

// 기본 / 응용 / 고난도 tabs, drawn exactly like the plain tabs of the other middle-school worksheet pages
// (no extra pill styling, so pre-algebra and basic-figures look the same as the reference pages).
export default function LevelTabs({ level, onChange, language, available }) {
  const labels = levelTabLabels(language);
  return (
    <div className="level-tabs no-print" role="tablist">
      {['basic', 'applied', 'expert'].map((lv) => (
        <button
          type="button"
          role="tab"
          key={lv}
          aria-selected={level === lv}
          className={`level-tab${level === lv ? ' active' : ''}`}
          disabled={available ? !available[lv] : false}
          onClick={() => onChange(lv)}
        >
          {labels[lv]}
        </button>
      ))}
    </div>
  );
}
