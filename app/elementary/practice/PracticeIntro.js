'use client';

import { useLanguage } from '../../language';

export default function PracticeIntro() {
  const { language } = useLanguage();
  const en = language === 'en';
  return <>
    <p className="no-print" style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 6 }}><a href="/">{en ? 'Home' : '홈'}</a> / {en ? 'Elementary / Grades 1–6' : '초등 / 1~6학년 연산'}</p>
    <h1 className="font-display no-print" style={{ fontSize: 26, margin: '0 0 8px' }}>{en ? 'Elementary Math Worksheet Generator' : '초등 1~6학년 수학 문제 생성기'}</h1>
    <p className="no-print" style={{ color: 'var(--ink-soft)', margin: '0 0 28px' }}>{en ? 'Choose a grade and topic to create a new random worksheet and its dedicated QR code.' : '학년과 단원을 고르면 매번 새로운 무작위 문제지와 전용 QR 코드가 만들어집니다.'}</p>
  </>;
}
