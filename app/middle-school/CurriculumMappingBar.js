'use client';

import React from 'react';
import Link from 'next/link';

export const CURRICULUM_MAPPINGS = {
  'prime-factorization': {
    intl: { labelKo: 'Pre-Algebra · Algebra 1', labelEn: 'Pre-Algebra · Algebra 1', detailKo: 'Primes & Prime Factorization', href: '/curriculum?tab=intl' },
    domain: { labelKo: '수와 연산 (Number & Operations)', labelEn: 'Number & Operations', detailKo: '자연수의 성질과 소인수', href: '/curriculum?tab=domain' },
    amc: { labelKo: 'AMC 8 Number Theory', labelEn: 'AMC 8 Number Theory', detailKo: '소인수분해 및 약수의 개수', href: '/amc/units?unit=primes-factorization' },
  },
  'gcd-lcm': {
    intl: { labelKo: 'Pre-Algebra · Algebra 1', labelEn: 'Pre-Algebra · Algebra 1', detailKo: 'Factors, Multiples & GCF/LCM', href: '/curriculum?tab=intl' },
    domain: { labelKo: '수와 연산 (Number & Operations)', labelEn: 'Number & Operations', detailKo: '최대공약수와 최소공배수 활용', href: '/curriculum?tab=domain' },
    amc: { labelKo: 'AMC 8 Number Theory', labelEn: 'AMC 8 Number Theory', detailKo: '최대공약수·최소공배수 및 주기성', href: '/amc/units?unit=gcd-lcm' },
  },
  'integers-rationals': {
    intl: { labelKo: 'Pre-Algebra (Grade 7~8)', labelEn: 'Pre-Algebra (Grade 7~8)', detailKo: 'Integers, Rational Numbers & Number Line', href: '/curriculum?tab=intl' },
    domain: { labelKo: '수와 연산 (Number & Operations)', labelEn: 'Number & Operations', detailKo: '정수와 유리수의 대소 및 사칙계산', href: '/curriculum?tab=domain' },
    amc: { labelKo: 'AMC 8 Arithmetic & Number Systems', labelEn: 'AMC 8 Arithmetic & Number Systems', detailKo: '부호 있는 수, 절댓값, 분수 연산', href: '/amc/units?unit=integers-rationals' },
  },
  'algebra-basics': {
    intl: { labelKo: 'Pre-Algebra · Algebra 1', labelEn: 'Pre-Algebra · Algebra 1', detailKo: 'Expressions & One-Variable Linear Equations', href: '/curriculum?tab=intl' },
    domain: { labelKo: '변화와 관계 · 대수 (Algebra)', labelEn: 'Algebra & Relationships', detailKo: '문자의 사용, 일차방정식과 실생활 모델링', href: '/curriculum?tab=domain' },
    amc: { labelKo: 'AMC 8 Algebra & Word Problems', labelEn: 'AMC 8 Algebra & Word Problems', detailKo: '일차방정식, 거리·속력·시간, 과부족', href: '/amc/units?unit=linear-equations' },
  },
  'coordinate-plane': {
    intl: { labelKo: 'Pre-Algebra · Algebra 1', labelEn: 'Pre-Algebra · Algebra 1', detailKo: 'Coordinate Geometry & Graph Interpretation', href: '/curriculum?tab=intl' },
    domain: { labelKo: '기하 & 함수 (Geometry & Coordinate Systems)', labelEn: 'Geometry & Coordinates', detailKo: '좌표평면, 사분면, 대칭과 도형의 넓이', href: '/curriculum?tab=domain' },
    amc: { labelKo: 'AMC 8 Coordinate Geometry', labelEn: 'AMC 8 Coordinate Geometry', detailKo: '격자점, 좌표평면 위 다각형 넓이', href: '/amc/units?unit=coordinate-geometry' },
  },
  'proportion': {
    intl: { labelKo: 'Pre-Algebra · Algebra 1', labelEn: 'Pre-Algebra · Algebra 1', detailKo: 'Ratios, Rates, Direct & Inverse Variation', href: '/curriculum?tab=intl' },
    domain: { labelKo: '함수 & 변화와 관계 (Functions & Proportionality)', labelEn: 'Functions & Relationships', detailKo: '정비례·반비례 관계식 및 쌍곡선 그래프', href: '/curriculum?tab=domain' },
    amc: { labelKo: 'AMC 8 Proportions & Pre-Algebra', labelEn: 'AMC 8 Proportions & Pre-Algebra', detailKo: '비율, 톱니바퀴, 정비례/반비례 응용', href: '/amc/units?unit=ratios-proportions' },
  },
};

export default function CurriculumMappingBar({ categoryKey, language = 'ko' }) {
  const mapping = CURRICULUM_MAPPINGS[categoryKey];
  if (!mapping) return null;

  const isKo = language === 'ko';

  return (
    <nav
      className="curriculum-mapping-bar no-print"
      aria-label={isKo ? '교육과정 상호 매핑' : 'Curriculum Cross-Mapping'}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        alignItems: 'center',
        padding: '10px 16px',
        margin: '0 0 16px',
        background: 'var(--card-bg, #fdfbf7)',
        border: '1px solid var(--border-soft, #e2ded5)',
        borderRadius: '8px',
        fontSize: '12px',
      }}
    >
      <span style={{ fontWeight: 700, color: 'var(--ink-soft, #6b675e)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        🔗 {isKo ? '교육과정 매핑' : 'Curriculum Map'}:
      </span>

      {/* 국제학교 매핑 */}
      <Link
        href={mapping.intl.href}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '4px 10px',
          background: 'color-mix(in srgb, #176b87 10%, transparent)',
          color: '#176b87',
          borderRadius: '20px',
          textDecoration: 'none',
          fontWeight: 600,
        }}
        title={mapping.intl.detailKo}
      >
        <span>🌐</span>
        <span>{isKo ? mapping.intl.labelKo : mapping.intl.labelEn}</span>
        <small style={{ opacity: 0.8, fontSize: '10px' }}>({mapping.intl.detailKo})</small>
      </Link>

      {/* 수학 영역 매핑 */}
      <Link
        href={mapping.domain.href}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '4px 10px',
          background: 'color-mix(in srgb, #2d6a4f 10%, transparent)',
          color: '#2d6a4f',
          borderRadius: '20px',
          textDecoration: 'none',
          fontWeight: 600,
        }}
        title={mapping.domain.detailKo}
      >
        <span>📐</span>
        <span>{isKo ? mapping.domain.labelKo : mapping.domain.labelEn}</span>
      </Link>

      {/* AMC 8 단원 매핑 */}
      <Link
        href={mapping.amc.href}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '4px 10px',
          background: 'color-mix(in srgb, #b0413e 10%, transparent)',
          color: '#b0413e',
          borderRadius: '20px',
          textDecoration: 'none',
          fontWeight: 600,
        }}
        title={mapping.amc.detailKo}
      >
        <span>🏆</span>
        <span>{isKo ? mapping.amc.labelKo : mapping.amc.labelEn}</span>
        <small style={{ opacity: 0.8, fontSize: '10px' }}>({mapping.amc.detailKo})</small>
      </Link>
    </nav>
  );
}
