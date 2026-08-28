'use client';

import { useLanguage } from '../../language';
import { isNonKorean, tr } from '../../i18n';

export default function PreAlgebraIntro() {
  const { language } = useLanguage();
  const foreign = isNonKorean(language);
  return <>
    <p className="no-print" style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 6 }}><a href="/">{tr(language, 'home')}</a> / Algebra Curriculum</p>
    <h1 className="font-display" style={{ fontSize: 28, margin: '0 0 8px' }}>{foreign ? 'Pre-Algebra · Algebra 1–2 Worksheet Engine' : '한국 중1·2·3·고1 · Algebra 1·2 문제 생성기'}</h1>
    <p className="no-print" style={{ color: 'var(--ink-soft)', margin: '0 0 12px', maxWidth: 900 }}>{foreign ? 'One shared concept engine maps topics across Pre-Algebra, Algebra 1–2 and Korean Grades 7–10 without duplicating generators. Problems, graphs, answers and explanations use the same seeded data.' : '겹치는 개념은 하나의 공통 생성기로 재사용하고, 한국 중1·2·3·고1과 Pre‑Algebra·Algebra 1·2의 단원 체계에 맞게 분류합니다. 문제·함수 그래프·표·정답·해설은 같은 시드 데이터에서 함께 생성됩니다.'}</p>
    <div className="no-print" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
      {['수·식의 계산', '방정식·부등식', '일차·이차함수', '확률·통계', '복소수·다항식', '행렬·경우의 수', '지수·로그·수열'].map((label) => <span key={label} style={{ padding: '6px 10px', borderRadius: 999, background: '#edf6f5', color: '#245c59', fontSize: 12, fontWeight: 700 }}>{label}</span>)}
    </div>
  </>;
}
