'use client';

import { useLanguage } from '../../language';
import { isNonKorean, tr } from '../../i18n';

export default function PreAlgebraIntro() {
  const { language } = useLanguage();
  const foreign = isNonKorean(language);
  return <>
    <p className="no-print" style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 6 }}><a href="/">{tr(language, 'home')}</a> / {tr(language, 'middle')} / Pre-Algebra</p>
    <h1 className="font-display" style={{ fontSize: 28, margin: '0 0 8px' }}>{foreign ? 'Pre-Algebra & Korea Middle School 1 Generator' : 'Pre‑Algebra · 한국 중1 통합 문제 생성기'}</h1>
    <p className="no-print" style={{ color: 'var(--ink-soft)', margin: '0 0 12px', maxWidth: 900 }}>{foreign ? 'Generate independent worksheets across numbers, arithmetic, expressions, equations, coordinates, proportional relationships and statistics. Diagrams, answers and explanations are generated from the same data.' : '수와 연산, 문자와 식, 좌표와 비례, 자료와 가능성의 독립적인 유사문제를 생성합니다. 수직선·좌표평면·표·그래프와 정답·해설이 하나의 문제 데이터에서 함께 만들어집니다.'}</p>
    <div className="no-print" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
      {['소인수분해·최대공약수', '정수·유리수', '분수·소수·백분율', '문자식·방정식·부등식', '좌표·정비례·반비례', '대푯값·도수분포'].map((label) => <span key={label} style={{ padding: '6px 10px', borderRadius: 999, background: '#edf6f5', color: '#245c59', fontSize: 12, fontWeight: 700 }}>{label}</span>)}
    </div>
  </>;
}
