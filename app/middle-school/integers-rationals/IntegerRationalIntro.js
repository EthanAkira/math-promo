'use client';

import { useLanguage } from '../../language';

export default function IntegerRationalIntro() {
  const { language } = useLanguage();
  const en = language === 'en';
  return <>
    <p className="no-print" style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 6 }}><a href="/">{en ? 'Home' : '홈'}</a> / {en ? 'Middle School / Integers & Rational Numbers' : '중등 / 정수와 유리수'}</p>
    <h1 className="font-display no-print" style={{ fontSize: 26, margin: '0 0 8px' }}>{en ? 'Integers & Rational Numbers Worksheet Generator' : '중등 정수와 유리수 문제 생성기'}</h1>
    <p className="no-print" style={{ color: 'var(--ink-soft)', margin: '0 0 28px' }}>{en ? 'Choose a skill to generate a new 20-question worksheet and answer key.' : '유형을 고르면 새로운 20문제 문제지와 정답지가 자동으로 만들어집니다.'}</p>
  </>;
}
