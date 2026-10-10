/**
 * AMC (American Mathematics Competitions) 영역별 출제 빈도 통계 & 이번 시험 적중 예상 문제 생성 엔진
 * (AMC Trend Forecast & Variant Problem Generation Engine)
 *
 * Covers AMC 8, AMC 10, and AMC 12:
 * - Domain Frequencies (Algebra, Geometry, Number Theory, Combinatorics, Advanced)
 * - 60+ Sub-topic Frequency Map (Average count & frequency rates)
 * - 25-Question Full Practice Exam Set Generator
 * - Algorithmic Forecast & Similar Problem Generation
 */

import { generateAmcVariantProblem } from './amcProblemGenerator.js';
import { findAmcFineUnit, AMC_FINE_SUBJECTS } from '../examUnits.js';

export const AMC_DOMAIN_FREQUENCIES = {
  8: {
    level: 'AMC 8',
    target: '중학교 2학년 이하 (Grade 8 and below)',
    duration: '40분 (40 Minutes)',
    totalQuestions: 25,
    domains: [
      { id: 'algebra', name: '대수 (Algebra)', count: '7~9문항', share: '32%', stars: 5, rate: '100% 매년 출제', topics: '일차방정식, 비와 비율, 속력·거리·시간, 패턴과 수열' },
      { id: 'geometry', name: '기하 (Geometry)', count: '6~8문항', share: '28%', stars: 5, rate: '100% 매년 출제', topics: '평면도형 넓이·둘레, 피타고라스 정리, 입체도형 부피' },
      { id: 'number-theory', name: '정수론 (Number Theory)', count: '4~5문항', share: '18%', stars: 4, rate: '100% 매년 출제', topics: '소인수분해, 약수·배수(GCD/LCM), 배수 판정법, 자릿수 주기' },
      { id: 'combinatorics-probability', name: '조합·확률 (Combinatorics)', count: '4~5문항', share: '16%', stars: 4, rate: '100% 매년 출제', topics: '경우의 수, 순열·조합 기초, 기댓값과 확률, 벤다이어그램' },
      { id: 'statistics-data', name: '통계·논리 (Stats & Logic)', count: '1~2문항', share: '6%', stars: 3, rate: '80% 선별 출제', topics: '평균·중앙값, 도수분포표, 참·거짓 논리 퍼즐' },
    ]
  },
  10: {
    level: 'AMC 10',
    target: '고등학교 1학년 이하 (Grade 10 and below)',
    duration: '75분 (75 Minutes)',
    totalQuestions: 25,
    domains: [
      { id: 'algebra', name: '대수 (Algebra)', count: '9~11문항', share: '40%', stars: 5, rate: '100% 매년 출제', topics: '이차방정식 판별식, 근과 계수(비에타), 다항식 인수분해, 부등식, 수열/급수' },
      { id: 'geometry', name: '기하 (Geometry)', count: '6~8문항', share: '28%', stars: 5, rate: '100% 매년 출제', topics: '원과 접선, 닮음비, 좌표기하, 삼각비, 다각형 성질, 입체기하' },
      { id: 'combinatorics-probability', name: '조합·확률 (Combinatorics)', count: '4~5문항', share: '18%', stars: 4, rate: '100% 매년 출제', topics: '복합 카운팅, 조건부확률, 이항정리, 포함-배제의 원리' },
      { id: 'number-theory', name: '정수론 (Number Theory)', count: '3~5문항', share: '14%', stars: 4, rate: '100% 매년 출제', topics: '모듈러 연산, 부정방정식(SFFT), 소수와 합성수, 진법 변환' },
    ]
  },
  12: {
    level: 'AMC 12',
    target: '고등학교 3학년 이하 (Grade 12 and below)',
    duration: '75분 (75 Minutes)',
    totalQuestions: 25,
    domains: [
      { id: 'advanced', name: '고등 대수·해석 (Adv. Algebra)', count: '11~13문항', share: '48%', stars: 5, rate: '100% 매년 출제', topics: '삼각함수와 덧셈정리, 지수·로그함수, 복소수와 극형식, 다항식의 근' },
      { id: 'geometry', name: '기하 (Geometry)', count: '5~6문항', share: '22%', stars: 5, rate: '100% 매년 출제', topics: '평면/입체기하, 삼각법 기하(사인·코사인법칙), 원과 방먁정리' },
      { id: 'combinatorics-probability', name: '조합·확률 (Combinatorics)', count: '4~5문항', share: '18%', stars: 4, rate: '100% 매년 출제', topics: '고급 확률과 기댓값, 대칭성과 불변량, 회전 순열, 점화식' },
      { id: 'number-theory', name: '정수론 (Number Theory)', count: '3~4문항', share: '12%', stars: 4, rate: '100% 매년 출제', topics: '페르마의 소정리, 오일러 피 함수, 중국인의 나머지 정리(CRT)' },
    ]
  }
};

export const AMC_UNIT_FREQUENCY_MAP = {
  // Algebra & Pre-Algebra
  'arithmetic-operations': { count: 1.5, rate: '100%', stars: 5, tier: 'basic' },
  'equations-inequalities': { count: 2.0, rate: '100%', stars: 5, tier: 'basic' },
  'ratios-percent': { count: 1.8, rate: '100%', stars: 5, tier: 'basic' },
  'percentages-money': { count: 1.2, rate: '90%', stars: 4, tier: 'basic' },
  'speed-distance-time': { count: 1.5, rate: '95%', stars: 5, tier: 'intermediate' },
  'work-rate': { count: 1.0, rate: '80%', stars: 4, tier: 'intermediate' },
  'sequences-patterns': { count: 1.8, rate: '100%', stars: 5, tier: 'intermediate' },
  'expressions-substitution': { count: 1.2, rate: '90%', stars: 4, tier: 'basic' },
  'systems-of-equations': { count: 1.5, rate: '100%', stars: 5, tier: 'intermediate' },
  'linear-graphs': { count: 1.0, rate: '85%', stars: 4, tier: 'intermediate' },
  'radicals-exponents': { count: 1.5, rate: '100%', stars: 5, tier: 'intermediate' },
  'geometric-series': { count: 1.2, rate: '90%', stars: 4, tier: 'advanced' },

  // Number Theory
  'primes-factorization': { count: 1.8, rate: '100%', stars: 5, tier: 'basic' },
  'divisors-multiples': { count: 1.5, rate: '100%', stars: 5, tier: 'basic' },
  'gcd-lcm': { count: 1.2, rate: '90%', stars: 4, tier: 'basic' },
  'remainders-divisibility': { count: 1.5, rate: '100%', stars: 5, tier: 'intermediate' },
  'units-digit-cycles': { count: 1.2, rate: '90%', stars: 4, tier: 'intermediate' },
  'bases-digits': { count: 1.0, rate: '80%', stars: 4, tier: 'advanced' },
  'modular-arithmetic': { count: 1.5, rate: '95%', stars: 5, tier: 'advanced' },
  'diophantine-equations': { count: 1.2, rate: '90%', stars: 4, tier: 'advanced' },

  // Geometry
  'angles-plane-figures': { count: 1.4, rate: '95%', stars: 4, tier: 'intermediate' },
  'triangles': { count: 2.4, rate: '100%', stars: 5, tier: 'intermediate' },
  'quadrilaterals-polygons': { count: 1.6, rate: '100%', stars: 5, tier: 'intermediate' },
  'area-perimeter': { count: 2.2, rate: '100%', stars: 5, tier: 'intermediate' },
  'circles': { count: 1.8, rate: '100%', stars: 5, tier: 'advanced' },
  'solids': { count: 1.5, rate: '95%', stars: 4, tier: 'advanced' },
  'coordinate-geometry': { count: 1.6, rate: '100%', stars: 5, tier: 'advanced' },
  'symmetry-transformations': { count: 1.0, rate: '80%', stars: 3, tier: 'intermediate' },

  // Combinatorics & Probability
  'counting': { count: 1.8, rate: '100%', stars: 5, tier: 'basic' },
  'permutations-arrangements': { count: 1.5, rate: '95%', stars: 4, tier: 'intermediate' },
  'permutations-combinations': { count: 1.8, rate: '100%', stars: 5, tier: 'intermediate' },
  'venn-sets': { count: 1.2, rate: '90%', stars: 4, tier: 'basic' },
  'paths-grids': { count: 1.0, rate: '85%', stars: 4, tier: 'intermediate' },
  'probability': { count: 2.0, rate: '100%', stars: 5, tier: 'intermediate' },
  'binomial-theorem': { count: 1.2, rate: '85%', stars: 4, tier: 'advanced' },
  'probability-distributions': { count: 1.0, rate: '75%', stars: 3, tier: 'advanced' },

  // Statistics & Logic
  'statistics-averages': { count: 1.2, rate: '90%', stars: 4, tier: 'basic' },
  'charts-data-analysis': { count: 0.8, rate: '70%', stars: 3, tier: 'basic' },
  'logical-reasoning': { count: 1.0, rate: '80%', stars: 3, tier: 'intermediate' },
  'clocks-calendars': { count: 0.8, rate: '65%', stars: 3, tier: 'basic' },
  'games-strategy': { count: 0.8, rate: '60%', stars: 3, tier: 'advanced' },
  'cryptarithms-puzzles': { count: 0.8, rate: '60%', stars: 3, tier: 'intermediate' },
  'word-problems': { count: 1.5, rate: '95%', stars: 4, tier: 'intermediate' },

  // High School Advanced (AMC 10·12)
  'function-properties': { count: 1.5, rate: '100%', stars: 5, tier: 'intermediate' },
  'function-transformations': { count: 1.2, rate: '90%', stars: 4, tier: 'intermediate' },
  'trigonometry': { count: 2.2, rate: '100%', stars: 5, tier: 'advanced' },
  'trig-identities': { count: 1.8, rate: '100%', stars: 5, tier: 'advanced' },
  'complex-numbers': { count: 1.5, rate: '100%', stars: 5, tier: 'advanced' },
  'complex-numbers-polar': { count: 1.0, rate: '85%', stars: 4, tier: 'advanced' },
  'factoring-quadratics': { count: 1.5, rate: '100%', stars: 5, tier: 'basic' },
  'completing-square': { count: 1.5, rate: '100%', stars: 5, tier: 'intermediate' },
  'quadratic-optimization': { count: 1.6, rate: '100%', stars: 5, tier: 'intermediate' },
  'polynomial-arithmetic': { count: 1.4, rate: '95%', stars: 4, tier: 'intermediate' },
  'polynomial-zeros': { count: 1.8, rate: '100%', stars: 5, tier: 'advanced' },
  'rational-functions': { count: 1.0, rate: '80%', stars: 4, tier: 'intermediate' },
  'exponential-logarithmic': { count: 2.0, rate: '100%', stars: 5, tier: 'advanced' },
  'am-gm-inequality': { count: 1.2, rate: '90%', stars: 4, tier: 'advanced' },
  'radical-equations': { count: 1.0, rate: '80%', stars: 3, tier: 'intermediate' },
  'absolute-value-graphs': { count: 1.2, rate: '85%', stars: 4, tier: 'intermediate' },
  'quadratic-inequalities': { count: 1.4, rate: '95%', stars: 4, tier: 'intermediate' },
};

/**
 * 5대 고난도 킬러 유형 분석 (High-Difficulty Killer Cases)
 */
export const AMC_KILLER_TOPICS = [
  {
    rank: 1,
    title: "부정방정식과 사이먼 인수분해 기법 (SFFT)",
    target: "AMC 10 #18~24, AMC 12 #16~22",
    concept: "xy + ax + by = c 형태를 (x + b)(y + a) = c + ab로 강제 인수분해하여 정수 약수 쌍을 구하는 유형",
    strategy: "공통 계수 곱하기 → 양변에 ab 더하기 → 정수 근 순서쌍과 약수의 부호(음수 포함) 전수 조사"
  },
  {
    rank: 2,
    title: "원과 방먁정리 & 삼각법 기하 융합",
    target: "AMC 10 #20~25, AMC 12 #18~24",
    concept: "원에 내접하는 사각형(브라마굽타, 톨레미 정리) 및 사인·코사인법칙 결합",
    strategy: "원의 중심과 접선 수직성 파악 → 할선-접선 방먁 정리(PA·PB = PT²) → 제2코사인법칙으로 미지수 소거"
  },
  {
    rank: 3,
    title: "복소수의 극형식과 드무아브르 정리 (De Moivre's)",
    target: "AMC 12 #17~25",
    concept: "z = r(cos θ + i sin θ) 변환을 통한 고차 거듭제곱 z^n 및 단위근 1의 거듭제곱근 합",
    strategy: "오일러 공식 z = r e^{iθ} 활용 → 회전 대칭성과 단위원을 활용한 기하학적 해석"
  },
  {
    rank: 4,
    title: "모듈러 연산과 페르마의 소정리 & 중국인의 나머지 정리 (CRT)",
    target: "AMC 10 #19~24, AMC 12 #15~22",
    concept: "a^{p-1} ≡ 1 (mod p) 및 연립일차합동식을 이용한 끝 두 자리 또는 거대한 수의 나머지 계산",
    strategy: "소인수분해로 법을 분할(mod 100 = mod 4 × mod 25) → CRT로 복원하여 끝자리 산출"
  },
  {
    rank: 5,
    title: "대칭성과 포함-배제의 원리를 이용한 복합 카운팅",
    target: "AMC 8 #22~25, AMC 10 #18~23, AMC 12 #16~21",
    concept: "원순열, 입체도형 면 색칠하기(번사이드 보조정리 기초), 조건부 포함-배제",
    strategy: "전체 경우의 수에서 여사건 제외 → 대칭 그룹(회전·반사)으로 나누어 중복 카운트 방지"
  }
];

function pickRandom(arr, rng = Math.random) {
  return arr[Math.floor(rng() * arr.length)];
}

/**
 * Generates an algorithmic forecast problem for a given level and unit.
 */
export function generateAmcForecastProblem(options = {}) {
  const level = options.level || '8';
  const rng = options.rng || Math.random;
  const lang = options.language || 'ko';

  let unitId = options.unitId;
  if (!unitId) {
    if (level === '8') {
      unitId = pickRandom([
        'arithmetic-operations', 'equations-inequalities', 'ratios-percent',
        'speed-distance-time', 'primes-factorization', 'triangles',
        'area-perimeter', 'counting', 'probability', 'statistics-averages'
      ], rng);
    } else if (level === '10') {
      unitId = pickRandom([
        'equations-inequalities', 'systems-of-equations', 'diophantine-equations',
        'triangles', 'circles', 'coordinate-geometry', 'permutations-combinations',
        'probability', 'factoring-quadratics', 'quadratic-optimization'
      ], rng);
    } else {
      unitId = pickRandom([
        'trigonometry', 'trig-identities', 'complex-numbers', 'complex-numbers-polar',
        'exponential-logarithmic', 'modular-arithmetic', 'diophantine-equations',
        'circles', 'geometric-series', 'probability-distributions'
      ], rng);
    }
  }

  const unitObj = findAmcFineUnit(unitId) || { id: unitId, label: '경시 핵심 문제' };
  const rawProb = generateAmcVariantProblem(unitObj, lang);
  const freqInfo = AMC_UNIT_FREQUENCY_MAP[unitId] || { count: 1.5, rate: '100%', stars: 5, tier: 'intermediate' };

  return {
    ...rawProb,
    id: `amc-forecast-${level}-${unitId}-${Math.floor(rng() * 90000 + 10000)}`,
    examLevel: `AMC ${level}`,
    unitId,
    unitName: unitObj.label || unitId,
    frequencyInfo: freqInfo,
    number: options.number || 1,
    isForecast: true,
  };
}

/**
 * Generates a full 25-question AMC practice exam set tailored to official distributions.
 */
export function generateAmcForecastExamSet(level = '8', options = {}) {
  const lang = options.language || 'ko';
  const rng = options.rng || Math.random;

  const unitsForExam = [];
  if (level === '8') {
    // 25 questions distribution: ~8 Algebra, ~7 Geometry, ~4 Number Theory, ~4 Combinatorics, ~2 Stats
    const alg = ['arithmetic-operations', 'equations-inequalities', 'ratios-percent', 'percentages-money', 'speed-distance-time', 'work-rate', 'sequences-patterns', 'expressions-substitution'];
    const geo = ['angles-plane-figures', 'triangles', 'quadrilaterals-polygons', 'area-perimeter', 'circles', 'solids', 'coordinate-geometry'];
    const num = ['primes-factorization', 'divisors-multiples', 'gcd-lcm', 'remainders-divisibility'];
    const comb = ['counting', 'permutations-arrangements', 'venn-sets', 'probability'];
    const stat = ['statistics-averages', 'charts-data-analysis'];
    
    unitsForExam.push(...alg.slice(0, 8), ...geo.slice(0, 7), ...num.slice(0, 4), ...comb.slice(0, 4), ...stat.slice(0, 2));
  } else if (level === '10') {
    // 25 questions: ~10 Algebra, ~7 Geometry, ~5 Combinatorics, ~3 Number Theory
    const alg = ['equations-inequalities', 'systems-of-equations', 'linear-graphs', 'radicals-exponents', 'factoring-quadratics', 'completing-square', 'quadratic-optimization', 'polynomial-arithmetic', 'quadratic-inequalities', 'sequences-patterns'];
    const geo = ['triangles', 'quadrilaterals-polygons', 'area-perimeter', 'circles', 'solids', 'coordinate-geometry', 'angles-plane-figures'];
    const comb = ['counting', 'permutations-combinations', 'paths-grids', 'probability', 'binomial-theorem'];
    const num = ['primes-factorization', 'remainders-divisibility', 'diophantine-equations'];
    
    unitsForExam.push(...alg.slice(0, 10), ...geo.slice(0, 7), ...comb.slice(0, 5), ...num.slice(0, 3));
  } else {
    // AMC 12: ~12 Advanced/Algebra, ~6 Geometry, ~4 Combinatorics, ~3 Number Theory
    const adv = ['trigonometry', 'trig-identities', 'complex-numbers', 'complex-numbers-polar', 'exponential-logarithmic', 'am-gm-inequality', 'polynomial-zeros', 'geometric-series', 'factoring-quadratics', 'quadratic-optimization', 'functions', 'radical-equations'];
    const geo = ['triangles', 'circles', 'solids', 'coordinate-geometry', 'area-perimeter', 'quadrilaterals-polygons'];
    const comb = ['permutations-combinations', 'probability', 'probability-distributions', 'binomial-theorem'];
    const num = ['modular-arithmetic', 'diophantine-equations', 'primes-factorization'];
    
    unitsForExam.push(...adv.slice(0, 12), ...geo.slice(0, 6), ...comb.slice(0, 4), ...num.slice(0, 3));
  }

  // Generate 25 problems
  const questions = [];
  for (let idx = 0; idx < 25; idx++) {
    const uId = unitsForExam[idx] || 'arithmetic-operations';
    const prob = generateAmcForecastProblem({ level, unitId: uId, number: idx + 1, language: lang, rng });
    questions.push(prob);
  }

  return {
    level,
    title: `${lang === 'ko' ? '2026-2027 시즌 대비' : 'Season 2026-2027'} AMC ${level} ${lang === 'ko' ? '전국 적중 모의고사' : 'Full Forecast Mock Exam'}`,
    totalQuestions: 25,
    timeMinutes: level === '8' ? 40 : 75,
    questions,
  };
}
