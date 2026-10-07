// Canonical unit/topic taxonomies for the AMC and CSAT exam archives.
// Stored as the plain label string in archive_items.unit_tag, so these lists
// are additive: renaming an id here never breaks already-tagged files, and a
// pre-existing free-text tag that happens to match a label still filters correctly.

export const AMC_UNITS = [
  { id: 'algebra', label: '대수', labelEn: 'Algebra', description: '사칙연산·일차방정식·비와 비율·백분율·속력과 일률·수열과 규칙' },
  { id: 'number-theory', label: '정수론', labelEn: 'Number Theory', description: '소수와 소인수분해·약수와 배수·최대공약수와 최소공배수·나머지·자릿수 주기' },
  { id: 'geometry', label: '기하', labelEn: 'Geometry', description: '평면도형과 각도·삼각형·사각형과 다각형·원과 부채꼴·입체도형·좌표평면' },
  { id: 'combinatorics-probability', label: '경우의 수와 확률', labelEn: 'Counting & Probability', description: '합·곱의 법칙·순열과 조합·벤다이어그램·경로 찾기·수학적 확률' },
  { id: 'statistics-data', label: '통계와 자료 해석', labelEn: 'Statistics & Data Analysis', description: '평균·중앙값·최빈값·범위·막대그래프와 표 분석' },
  { id: 'logic-word-problems', label: '논리와 문제해결', labelEn: 'Logic & Problem Solving', description: '논리 추론·시계와 달력·게임 전략·암호산·실생활 문장제' },
  { id: 'functions', label: '함수', labelEn: 'Functions', description: '함수의 성질·규칙 연산과 함수값·그래프' },
  { id: 'advanced', label: '심화 경시 (AMC 10·12)', labelEn: 'Advanced (AMC 10/12)', description: '삼각함수·복소수·로그 등 고등 경시 주제' },
];

// `tier` ('basic'|'intermediate'|'advanced', displayed as 하/중/상) is hand-judged static
// metadata for the "종합 테스트 만들기" (core practice test) difficulty-ceiling filter — there is
// no per-problem difficulty signal anywhere in the generator or catalog data to derive this from
// automatically (see project_core_practice_test memory). Judged from each unit's own scope, not
// measured from real exam statistics.

// Finer-grained taxonomy for PER-PROBLEM classification (not per-file like AMC_UNITS above).
// Used by amcProblemClassifier.js to tag individual problems extracted from uploaded AMC PDFs,
// and by the "단원별 AMC 기출문제" browser to group actual problems by granular topic.
export const AMC_FINE_SUBJECTS = [
  {
    id: 'algebra', label: '대수', labelEn: 'Algebra',
    description: '기초 연산부터 방정식, 비율, 속력, 수열까지 대수 영역 핵심 주제',
    units: [
      {
        id: 'arithmetic-operations', label: '사칙연산과 계산 법칙', labelEn: 'Arithmetic & Operations', desc: '분수·소수 계산, 연산 순서, 거듭제곱과 부호',
        tier: 'basic',
        vol1Chapter: 'Ch 4. Operations with Fractions (분수 사칙연산·번분수)',
        vol2Chapter: 'Ch 9. Operations with Decimals (소수 연산·순환소수)',
        vol4Chapter: 'Ch 19. Special Symbols and Operations (정의된 연산 규칙과 복합 계산)',
        intlCourse: { id: 'intl-arithmetic', label: 'Arithmetic', labelKo: '기초 산술 및 유리수 연산', href: '/curriculum#intl-arithmetic' },
        domain: { id: 'domain-numbers', label: 'Number & Operations', labelKo: '수와 연산', href: '/curriculum#domain-numbers' },
      },
      {
        id: 'equations-inequalities', label: '방정식과 부등식', labelEn: 'Equations & Inequalities', desc: '일차방정식, 연립방정식, 절댓값 방정식',
        tier: 'intermediate',
        vol2Chapter: 'Ch 8. Consecutive Integers (연속한 정수의 합·방정식)',
        vol3Chapter: 'Ch 18. Solving Equations (일차방정식·문자 계수 방정식·분수 방정식)',
        alg2Chapter: 'Topic 1.4-1.7 Linear Equations, Inequalities & Absolute Value (일차방정식·부등식·절댓값)',
        intlCourse: { id: 'intl-algebra-1', label: 'Algebra 1', labelKo: '대수 1 (일차방정식·부등식)', href: '/curriculum#intl-algebra-1' },
        domain: { id: 'domain-algebra', label: 'Algebra & Relations', labelKo: '변화와 관계 · 대수', href: '/curriculum#domain-algebra' },
      },
      {
        id: 'ratios-percent', label: '비·비례식과 백분율', labelEn: 'Ratios, Rates & Percent', desc: '비와 비율, 비례식, 정비례/반비례, 백분율',
        tier: 'basic',
        vol1Chapter: 'Ch 6. Word Problems related to Percentage (비와 비율)',
        vol3Chapter: 'Ch 16. Ratio, Rate and Proportion (연비 a:b:c·가비의 리·비례배분)',
        alg2Chapter: 'Topic 2.2 Direct Variation (정비례와 변화율)',
        intlCourse: { id: 'intl-pre-algebra', label: 'Pre-Algebra', labelKo: '비와 비율 (Ratios & Proportions)', href: '/curriculum#intl-pre-algebra' },
        domain: { id: 'domain-algebra', label: 'Algebra & Relations', labelKo: '변화와 관계 · 대수', href: '/curriculum#domain-algebra' },
      },
      {
        id: 'percentages-money', label: '백분율·할인과 이익', labelEn: 'Percentages & Finance', desc: '퍼센트 증감, 세금, 할인율, 원가와 정가',
        tier: 'intermediate',
        vol1Chapter: 'Ch 6. Word Problems related to Percentage (연속 할인·원가·마진)',
        intlCourse: { id: 'intl-pre-algebra', label: 'Pre-Algebra', labelKo: '백분율과 금융 수학', href: '/curriculum#intl-pre-algebra' },
        domain: { id: 'domain-modeling', label: 'Modeling & Problem Solving', labelKo: '수학적 모델링과 문제 해결', href: '/curriculum#domain-modeling' },
      },
      {
        id: 'speed-distance-time', label: '속력·거리·시간', labelEn: 'Speed, Distance & Time', desc: '평균 속력, 상대속력, 왕복 및 추격 문제',
        tier: 'intermediate',
        vol3Chapter: 'Ch 16. Ratio, Rate and Proportion (단위비율 Unit Rate·속력과 일률)',
        intlCourse: { id: 'intl-algebra-1', label: 'Algebra 1', labelKo: '속력·거리·시간 모델링', href: '/curriculum#intl-algebra-1' },
        domain: { id: 'domain-modeling', label: 'Modeling & Problem Solving', labelKo: '수학적 모델링과 문제 해결', href: '/curriculum#domain-modeling' },
      },
      {
        id: 'work-rate', label: '일의 양과 작업률', labelEn: 'Work & Rates', desc: '함께 일하기, 물통 채우기, 시간당 능률, 역수 방정식',
        tier: 'intermediate', amcLevel: 'AMC 10',
        vol3Chapter: 'Ch 16. Ratio, Rate and Proportion (작업률과 일의 양·수도관 물 채우기)',
        alg2Chapter: 'Topic 8.6 Word Problems (일의 양·작업률과 유리방정식 모델링)',
        intlCourse: { id: 'intl-algebra-1', label: 'Algebra 1', labelKo: '일의 양과 작업률', href: '/curriculum#intl-algebra-1' },
        domain: { id: 'domain-modeling', label: 'Modeling & Problem Solving', labelKo: '수학적 모델링과 문제 해결', href: '/curriculum#domain-modeling' },
      },
      {
        id: 'sequences-patterns', label: '수열과 규칙성', labelEn: 'Sequences & Patterns', desc: '등차수열, 계차수열, 수 배열과 패턴 규칙',
        tier: 'intermediate',
        vol1Chapter: 'Ch 2. Patterns (수열·홀수의 합·삼각수)',
        vol2Chapter: 'Ch 8. Consecutive Integers (연속 수열 합과 평균)',
        vol4Chapter: 'Ch 21. Sequences and Series (등차수열 일반항과 합·연속 정수 합)',
        alg2Chapter: 'Topic 10.1-10.2 & 10.5 Arithmetic Sequence & Difference Sequence (등차수열·계차수열)',
        intlCourse: { id: 'intl-algebra-2', label: 'Algebra 2', labelKo: '수열과 일반항 (Sequences & Series)', href: '/curriculum#intl-algebra-2' },
        domain: { id: 'domain-algebra', label: 'Algebra & Relations', labelKo: '변화와 관계 · 대수', href: '/curriculum#domain-algebra' },
      },
      {
        id: 'expressions-substitution', label: '식의 계산과 대입', labelEn: 'Expressions & Substitution', desc: '[AMC 10] 공통인수 묶기·곱셈공식을 이용한 식의 정리, 식의 값 구하기',
        tier: 'intermediate', amcLevel: 'AMC 10',
        vol1Chapter: 'Ch 4. Operations with Fractions (식의 대입과 수직선)',
        vol3Chapter: 'Ch 18. Solving Equations (가비의 리 비례방정식 식의 값 대입)',
        vol4Chapter: 'Ch 19. Special Symbols and Operations (새로운 연산 기호 a◇b와 식의 대입)',
        alg2Chapter: 'Topic 1.3 Algebraic Expressions (대수식 정리와 대입)',
        intlCourse: { id: 'intl-pre-algebra', label: 'Pre-Algebra', labelKo: '문자와 식의 계산', href: '/curriculum#intl-pre-algebra' },
        domain: { id: 'domain-algebra', label: 'Algebra & Relations', labelKo: '변화와 관계 · 대수', href: '/curriculum#domain-algebra' },
      },
      {
        id: 'systems-of-equations', label: '연립방정식', labelEn: 'Systems of Equations', desc: '두 변수 연립방정식의 대입·소거법과 활용 문제',
        tier: 'intermediate',
        vol3Chapter: 'Ch 18. Solving Equations (연립일차방정식·대칭 연립방정식)',
        alg2Chapter: 'Topic 3.1-3.5 System of Linear Equations (연립일차방정식과 삼원방정식)',
        intlCourse: { id: 'intl-algebra-1', label: 'Algebra 1', labelKo: '연립방정식 (Systems of Equations)', href: '/curriculum#intl-algebra-1' },
        domain: { id: 'domain-algebra', label: 'Algebra & Relations', labelKo: '변화와 관계 · 대수', href: '/curriculum#domain-algebra' },
      },
      {
        id: 'linear-graphs', label: '직선의 방정식과 기울기', labelEn: 'Linear Equations & Slope', desc: '기울기, 두 점을 지나는 직선, 평행선과 수직선',
        tier: 'intermediate',
        vol4Chapter: 'Ch 22. Functions (일차함수와 직선의 기울기)',
        alg2Chapter: 'Topic 2.3-2.4 Linear Function & Perpendicular/Parallel Lines (직선의 방정식과 수직·평행)',
        intlCourse: { id: 'intl-algebra-1', label: 'Algebra 1', labelKo: '직선의 방정식과 기울기', href: '/curriculum#intl-algebra-1' },
        domain: { id: 'domain-algebra', label: 'Algebra & Relations', labelKo: '변화와 관계 · 대수', href: '/curriculum#domain-algebra' },
      },
      {
        id: 'radicals-exponents', label: '근호와 유리지수', labelEn: 'Radicals & Rational Exponents', desc: '근호식의 단순화, 유리지수의 계산, 거듭제곱근의 성질',
        tier: 'intermediate', amcLevel: 'AMC 10',
        alg2Chapter: 'Topic 7.1-7.3 Radical Expression & Rational Exponents (무리식과 유리지수)',
        intlCourse: { id: 'intl-algebra-2', label: 'Algebra 2', labelKo: '근호와 유리지수', href: '/curriculum#intl-algebra-2' },
        domain: { id: 'domain-algebra', label: 'Algebra & Relations', labelKo: '변화와 관계 · 대수', href: '/curriculum#domain-algebra' },
      },
      {
        id: 'geometric-series', label: '등비수열과 급수', labelEn: 'Geometric Sequences & Series', desc: '일반항과 첫 n항의 합, 무한등비급수 공식, 등비중항',
        tier: 'intermediate', amcLevel: 'AMC 10·12',
        vol4Chapter: 'Ch 21. Sequences and Series (등비수열의 일반항·공비·등비중항)',
        alg2Chapter: 'Topic 10.3 Geometric Sequence and Series (등비수열과 무한등비급수)',
        intlCourse: { id: 'intl-algebra-2', label: 'Algebra 2', labelKo: '등비수열과 급수 (Geometric Series)', href: '/curriculum#intl-algebra-2' },
        domain: { id: 'domain-algebra', label: 'Algebra & Relations', labelKo: '변화와 관계 · 대수', href: '/curriculum#domain-algebra' },
      },
    ],
  },
  {
    id: 'number-theory', label: '정수론', labelEn: 'Number Theory',
    description: '소수, 약수, 배수, 나머지, 자릿수 분석 등 정수론 영역 핵심 주제',
    units: [
      {
        id: 'primes-factorization', label: '소수와 소인수분해', labelEn: 'Primes & Factorization', desc: '소수 판별, 소인수분해, 소인수의 합과 곱, 르장드르 공식',
        tier: 'basic',
        vol1Chapter: 'Ch 5. Even and Odd (소수와 2의 유일성)',
        vol2Chapter: 'Ch 12. Divisibility (소인수분해와 끝자리 0의 개수)',
        vol3Chapter: 'Ch 14. Factors & Ch 15. Prime numbers (소수 판정법·소수의 합과 유일 짝수 2·소수 인수분해 조건)',
        numTheoryChapter: 'Topic 1.3 Prime Factorization (소인수분해와 최대 소인수)',
        intlCourse: { id: 'intl-pre-algebra', label: 'Pre-Algebra', labelKo: '소수와 소인수분해', href: '/curriculum#intl-pre-algebra' },
        domain: { id: 'domain-numbers', label: 'Number & Operations', labelKo: '수와 연산', href: '/curriculum#domain-numbers' },
      },
      {
        id: 'divisors-multiples', label: '약수와 배수 (약수의 개수)', labelEn: 'Divisors & Multiples', desc: '약수의 개수와 총합, 완전제곱수 판정, 공약수와 공배수',
        tier: 'basic',
        vol1Chapter: 'Ch 5. Even and Odd (약수·배수 개수와 홀짝성)',
        vol2Chapter: 'Ch 12. Divisibility (배수의 성질과 약수 분석)',
        vol3Chapter: 'Ch 14. Factors (약수의 개수·완전제곱수 약수·홀수 약수·특정 배수 약수)',
        numTheoryChapter: 'Topic 1.1 & 3.1 Divisors & Counting Divisors (약수의 개수와 약수의 합 공식)',
        intlCourse: { id: 'intl-pre-algebra', label: 'Pre-Algebra', labelKo: '약수와 배수', href: '/curriculum#intl-pre-algebra' },
        domain: { id: 'domain-numbers', label: 'Number & Operations', labelKo: '수와 연산', href: '/curriculum#domain-numbers' },
      },
      {
        id: 'gcd-lcm', label: '최대공약수와 최소공배수', labelEn: 'GCD & LCM', desc: 'GCD·LCM 관계식, 유클리드 호제법, 주기성 및 순환 문제',
        tier: 'basic',
        vol3Chapter: 'Ch 17. Least Common Multiple & Greatest Common Factor (GCF·LCM 관계식·주기 일치·공통 나머지)',
        numTheoryChapter: 'Topic 2.1-2.4 GCD, LCM & Euclidean Algorithm (최대공약수, 최소공배수, 유클리드 호제법)',
        intlCourse: { id: 'intl-pre-algebra', label: 'Pre-Algebra', labelKo: '최대공약수와 최소공배수 (GCF & LCM)', href: '/curriculum#intl-pre-algebra' },
        domain: { id: 'domain-numbers', label: 'Number & Operations', labelKo: '수와 연산', href: '/curriculum#domain-numbers' },
      },
      {
        id: 'remainders-divisibility', label: '나머지와 배수 판정법', labelEn: 'Remainders & Divisibility', desc: '배수 판정법, 나눗셈 정리와 나머지, 르장드르 공식',
        tier: 'intermediate',
        vol1Chapter: 'Ch 5. Even and Odd (홀짝성 불변량·배수 판정법)',
        vol2Chapter: 'Ch 12. Divisibility (배수 판정법·나머지·자리수 합)',
        vol3Chapter: 'Ch 15. Prime numbers & Ch 17. LCM and GCF (공통 나머지와 LCM + r·제곱근 소수 판별)',
        vol4Chapter: 'Ch 20. Remainder (나눗셈 정리·중국인의 나머지 정리·합동식)',
        numTheoryChapter: 'Topic 1.1-1.2 Divisor, Remainders & Parity (나머지와 홀짝성 불변량)',
        intlCourse: { id: 'intl-pre-algebra', label: 'Pre-Algebra', labelKo: '배수 판정과 합동식 기초', href: '/curriculum#intl-pre-algebra' },
        domain: { id: 'domain-numbers', label: 'Number & Operations', labelKo: '수와 연산', href: '/curriculum#domain-numbers' },
      },
      {
        id: 'units-digit-cycles', label: '일의 자리와 거듭제곱 주기', labelEn: 'Units Digit & Cycles', desc: '거듭제곱 끝자리 주기성, 끝 두 자리(mod 100), 피사노 주기',
        tier: 'intermediate',
        vol1Chapter: 'Ch 2. Patterns (일의 자리 주기성·지수 주기)',
        numTheoryChapter: 'Topic 5.1 & Topic 6 Mixed Practice (거듭제곱 주기와 끝 두 자리)',
        intlCourse: { id: 'intl-pre-algebra', label: 'Pre-Algebra', labelKo: '자릿수 주기 패턴', href: '/curriculum#intl-pre-algebra' },
        domain: { id: 'domain-numbers', label: 'Number & Operations', labelKo: '수와 연산', href: '/curriculum#domain-numbers' },
      },
      {
        id: 'bases-digits', label: '자릿수 분석과 진법', labelEn: 'Digits & Number Bases', desc: '각 자리 숫자의 합, 십진법 자릿수 구조, n진법 상호 변환 및 자릿수 조건',
        tier: 'advanced',
        vol2Chapter: 'Ch 9. Operations with Decimals (소수 자릿수) / Ch 12 Divisibility',
        numTheoryChapter: 'Topic 4.1 Base-N Expression (진법 표현과 변환)',
        intlCourse: { id: 'intl-pre-algebra', label: 'Pre-Algebra', labelKo: '진법과 자릿수 체계', href: '/curriculum#intl-pre-algebra' },
        domain: { id: 'domain-numbers', label: 'Number & Operations', labelKo: '수와 연산', href: '/curriculum#domain-numbers' },
      },
      {
        id: 'modular-arithmetic', label: '모듈러 연산과 페르마의 소정리', labelEn: 'Modular Arithmetic & Fermat’s Little Theorem', desc: '합동식의 곱셈 성질, 페르마의 소정리, 일차합동식, 중국인의 나머지 정리(CRT)',
        tier: 'advanced',
        vol4Chapter: 'Ch 20. Remainder (일차합동식 ax ≡ b mod m)',
        numTheoryChapter: 'Topic 5.1-5.2 Modular Arithmetic, Fermat\'s Little Theorem & CRT (합동식과 중국인의 나머지 정리)',
        intlCourse: { id: 'intl-precalculus', label: 'Precalculus', labelKo: '모듈러 연산 (Modular Arithmetic)', href: '/curriculum#intl-precalculus' },
        domain: { id: 'domain-numbers', label: 'Number & Operations', labelKo: '수와 연산', href: '/curriculum#domain-numbers' },
      },
      {
        id: 'diophantine-equations', label: '부정방정식과 정수해 (SFFT)', labelEn: 'Diophantine Equations & SFFT', desc: '[AMC 10·12] Simon\'s Favorite Factoring Technique(SFFT), xy + ax + by = c 꼴의 정수해 순서쌍, 차의 제곱(x² - y² = k)',
        tier: 'advanced', amcLevel: 'AMC 10·12',
        numTheoryChapter: 'Topic 3.1 & Topic 6 SFFT & Integer Solutions (사이먼 인수분해 기법과 부정방정식)',
        intlCourse: { id: 'intl-algebra-2', label: 'Algebra 2', labelKo: '부정방정식과 정수해', href: '/curriculum#intl-algebra-2' },
        domain: { id: 'domain-numbers', label: 'Number & Operations', labelKo: '수와 연산', href: '/curriculum#domain-numbers' },
      },
    ],
  },
  {
    id: 'geometry', label: '기하', labelEn: 'Geometry',
    description: '각도, 삼각형, 사각형, 원, 입체도형, 좌표평면 등 기하 영역 핵심 주제',
    units: [
      {
        id: 'angles-plane-figures', label: '평면도형과 각도·평행선', labelEn: 'Angles & Plane Figures', desc: '맞꼭지각, 동위각, 엇각, 평행선 각도, 각의 이등분선 정리',
        tier: 'intermediate',
        vol5Chapter: 'Ch 25. Angles and triangles (외각 정리·별 다각형 각의 합 180°·맞꼭지각과 동위각)',
        intlCourse: { id: 'intl-geometry', label: 'Geometry', labelKo: '기하 기초 (Angles & Parallel Lines)', href: '/curriculum#intl-geometry' },
        domain: { id: 'domain-geometry', label: 'Geometry & Measurement', labelKo: '도형과 측정 · 기하', href: '/curriculum#domain-geometry' },
      },
      {
        id: 'triangles', label: '삼각형의 성질과 피타고라스', labelEn: 'Triangles & Pythagorean', desc: '이등변·정삼각형, 직각삼각형, 삼각부등식',
        tier: 'intermediate',
        vol1Chapter: 'Ch 1. Perimeter and Area (피타고라스 정리·헤론의 공식)',
        vol4Chapter: 'Ch 23. Pythagorean Theorem and Triangles (피타고라스 증명·특수 직각삼각형·내접원 r=(a+b-c)/2)',
        vol5Chapter: 'Ch 27. Similar triangles (삼각형 닮음 조건 AA/SAS·넓이비 k²·평행선 분할)',
        intlCourse: { id: 'intl-geometry', label: 'Geometry', labelKo: '삼각형과 피타고라스 정리', href: '/curriculum#intl-geometry' },
        domain: { id: 'domain-geometry', label: 'Geometry & Measurement', labelKo: '도형과 측정 · 기하', href: '/curriculum#domain-geometry' },
      },
      {
        id: 'quadrilaterals-polygons', label: '사각형과 다각형의 성질', labelEn: 'Quadrilaterals & Polygons', desc: '직사각형, 정사각형, 평행사변형, 다각형 내각·대각선, 원에 내접하는 사각형',
        tier: 'intermediate',
        vol1Chapter: 'Ch 1. Perimeter and Area (사각형 넓이 곱 ac=bd)',
        vol5Chapter: 'Ch 26. Rectangles and squares (영국 국기 정리 AP²+PC²=BP²+PD²) & Ch 28. Trapezoids (사다리꼴 대각선 분할 넓이·면적 이등분선)',
        intlCourse: { id: 'intl-geometry', label: 'Geometry', labelKo: '사각형과 다각형 (Quadrilaterals)', href: '/curriculum#intl-geometry' },
        domain: { id: 'domain-geometry', label: 'Geometry & Measurement', labelKo: '도형과 측정 · 기하', href: '/curriculum#domain-geometry' },
      },
      {
        id: 'area-perimeter', label: '도형의 넓이와 둘레', labelEn: 'Area & Perimeter', desc: '색칠한 부분의 넓이, 둘레 계산, 도형 자르기/붙이기',
        tier: 'intermediate',
        vol1Chapter: 'Ch 1. Perimeter and Area (둘레 불변성·도형 분할)',
        vol4Chapter: 'Ch 23. Pythagorean Theorem and Triangles (직각삼각형 결합 사각형 넓이)',
        vol5Chapter: 'Ch 26. Rectangles and squares & Ch 28. Trapezoids (직사각형·사다리꼴 분할 도형 넓이)',
        intlCourse: { id: 'intl-geometry', label: 'Geometry', labelKo: '넓이와 둘레 (Area & Perimeter)', href: '/curriculum#intl-geometry' },
        domain: { id: 'domain-geometry', label: 'Geometry & Measurement', labelKo: '도형과 측정 · 기하', href: '/curriculum#domain-geometry' },
      },
      {
        id: 'circles', label: '원과 부채꼴', labelEn: 'Circles & Sectors', desc: '원주율, 원의 둘레와 넓이, 부채꼴 호와 면적, 원주각·접선의 길이',
        tier: 'advanced',
        vol1Chapter: 'Ch 1. Perimeter and Area (원과 부채꼴·원주율)',
        vol5Chapter: 'Ch 29. Circles (현의 성질과 중심 거리·원주각과 중심각·방먁정리/동심원)',
        intlCourse: { id: 'intl-geometry', label: 'Geometry', labelKo: '원과 호의 성질 (Circles & Sectors)', href: '/curriculum#intl-geometry' },
        domain: { id: 'domain-geometry', label: 'Geometry & Measurement', labelKo: '도형과 측정 · 기하', href: '/curriculum#domain-geometry' },
      },
      {
        id: 'solids', label: '입체도형 (부피·겉넓이)', labelEn: 'Solids (Volume & Area)', desc: '직육면체, 정육면체, 원기둥, 부피와 겉넓이, 전개도',
        tier: 'intermediate',
        vol3Chapter: 'Ch 13. Geometric Visualization (입체도형 삼면도·전개도·오일러 다면체 정리 F+V=E+2)',
        vol5Chapter: 'Ch 30. Volumes (직육면체 공간대각선·원기둥 부피와 겉넓이·닮음 입체 부피비)',
        intlCourse: { id: 'intl-geometry', label: 'Geometry', labelKo: '입체도형의 측정 (Solids)', href: '/curriculum#intl-geometry' },
        domain: { id: 'domain-geometry', label: 'Geometry & Measurement', labelKo: '도형과 측정 · 기하', href: '/curriculum#domain-geometry' },
      },
      {
        id: 'coordinate-geometry', label: '좌표평면과 격자점', labelEn: 'Coordinate & Lattice', desc: '좌표, 중점, 기울기, 격자점 세기',
        tier: 'intermediate',
        vol1Chapter: 'Ch 1. Perimeter and Area (격자점과 픽의 정리 Pick\'s Law)',
        vol2Chapter: 'Ch 7. Transformations (좌표평면 대칭 변환)',
        intlCourse: { id: 'intl-geometry', label: 'Geometry', labelKo: '좌표기하와 격자점 (Pick\'s Law)', href: '/curriculum#intl-geometry' },
        domain: { id: 'domain-geometry', label: 'Geometry & Measurement', labelKo: '도형과 측정 · 기하', href: '/curriculum#domain-geometry' },
      },
      {
        id: 'symmetry-transformations', label: '대칭·회전과 공간지각', labelEn: 'Symmetry & Spatial Vision', desc: '선대칭, 점대칭, 회전체, 접기/펼치기',
        tier: 'intermediate',
        vol2Chapter: 'Ch 7. Transformations (선대칭·점대칭·회전 변환)',
        vol3Chapter: 'Ch 13. Geometric Visualization (쌓기나무 평면도 Base Plan·정육면체 맞은편 면 분석)',
        intlCourse: { id: 'intl-geometry', label: 'Geometry', labelKo: '대칭과 변환 (Transformations)', href: '/curriculum#intl-geometry' },
        domain: { id: 'domain-geometry', label: 'Geometry & Measurement', labelKo: '도형과 측정 · 기하', href: '/curriculum#domain-geometry' },
      },
    ],
  },
  {
    id: 'combinatorics-probability', label: '경우의 수와 확률', labelEn: 'Counting & Probability',
    description: '경우의 수 계산, 순열, 조합, 벤다이어그램, 확률 등 조합 영역 핵심 주제',
    units: [
      {
        id: 'counting', label: '경우의 수 (합·곱의 법칙)', labelEn: 'Counting Principles', desc: '수형도, 합의 법칙, 곱의 법칙, 체계적 나열, 여사건과 경우 나누기',
        tier: 'intermediate',
        vol2Chapter: 'Ch 11. Counting Techniques (합·곱의 법칙·증가수 Rising Numbers)',
        alg2Chapter: 'Topic 11.1 Fundamental Counting Principle (합과 곱의 법칙·경우 나누기)',
        intlCourse: { id: 'intl-algebra-1', label: 'Algebra 1', labelKo: '경우의 수 (Counting Principles)', href: '/curriculum#intl-algebra-1' },
        domain: { id: 'domain-data', label: 'Data & Probability', labelKo: '자료와 가능성 · 확률과 통계', href: '/curriculum#domain-data' },
      },
      {
        id: 'permutations-arrangements', label: '순열과 나열하기', labelEn: 'Permutations & Orderings', desc: '서로 다른 n개 중 r개 일렬 나열, 조건부 나열',
        tier: 'intermediate',
        vol2Chapter: 'Ch 11. Counting Techniques (순열·이웃한 나열 조건)',
        alg2Chapter: 'Topic 11.2 Permutation (순열과 조건부 나열)',
        intlCourse: { id: 'intl-algebra-2', label: 'Algebra 2', labelKo: '순열과 나열 (Permutations)', href: '/curriculum#intl-algebra-2' },
        domain: { id: 'domain-data', label: 'Data & Probability', labelKo: '자료와 가능성 · 확률과 통계', href: '/curriculum#domain-data' },
      },
      {
        id: 'permutations-combinations', label: '순열과 조합 (팀 선택)', labelEn: 'Combinations & Selection', desc: '대표 선출, 조 편성, 부분집합 선택, 별과 막대',
        tier: 'advanced',
        vol2Chapter: 'Ch 11. Counting Techniques (조합·대표 선출 공식)',
        alg2Chapter: 'Topic 11.3 Combination (조합과 대표 선출)',
        intlCourse: { id: 'intl-algebra-2', label: 'Algebra 2', labelKo: '조합과 대표 선출 (Combinations)', href: '/curriculum#intl-algebra-2' },
        domain: { id: 'domain-data', label: 'Data & Probability', labelKo: '자료와 가능성 · 확률과 통계', href: '/curriculum#domain-data' },
      },
      {
        id: 'venn-sets', label: '벤다이어그램과 집합', labelEn: 'Venn Diagrams & Sets', desc: '두/세 집합 교집합·합집합, 포함배제',
        tier: 'advanced',
        vol2Chapter: 'Ch 10. Sets and Venn Diagrams (집합과 벤다이어그램·포함배제)',
        intlCourse: { id: 'intl-pre-algebra', label: 'Pre-Algebra', labelKo: '집합과 벤다이어그램 (Venn Diagrams)', href: '/curriculum#intl-pre-algebra' },
        domain: { id: 'domain-data', label: 'Data & Probability', labelKo: '자료와 가능성 · 확률과 통계', href: '/curriculum#domain-data' },
      },
      {
        id: 'paths-grids', label: '경로 찾기와 격자길', labelEn: 'Grid Paths & Routing', desc: '최단거리 길찾기, 파스칼 삼각형 응용',
        tier: 'intermediate',
        vol2Chapter: 'Ch 11. Counting Techniques (최단 경로와 경유점)',
        intlCourse: { id: 'intl-algebra-2', label: 'Algebra 2', labelKo: '최단 경로와 격자길 (Grid Routing)', href: '/curriculum#intl-algebra-2' },
        domain: { id: 'domain-data', label: 'Data & Probability', labelKo: '자료와 가능성 · 확률과 통계', href: '/curriculum#domain-data' },
      },
      {
        id: 'probability', label: '확률 (주사위·동전·기하)', labelEn: 'Probability', desc: '주사위, 동전, 카드, 제비뽑기, 넓이의 비율, 조건부·조합적 확률',
        tier: 'advanced',
        vol4Chapter: 'Ch 24. Probability (여사건·합사건 P(A∪B)·복원 비복원 확률)',
        alg2Chapter: 'Topic 12.1-12.4 Probability & Tree Diagrams (확률과 수형도)',
        intlCourse: { id: 'intl-algebra-1', label: 'Algebra 1', labelKo: '기초 확률론 (Probability)', href: '/curriculum#intl-algebra-1' },
        domain: { id: 'domain-data', label: 'Data & Probability', labelKo: '자료와 가능성 · 확률과 통계', href: '/curriculum#domain-data' },
      },
      {
        id: 'binomial-theorem', label: '이항정리', labelEn: 'Binomial Theorem', desc: '이항계수, 전개식의 특정 항의 계수',
        tier: 'advanced',
        alg2Chapter: 'Topic 11.4 Binomial Theorem (이항정리와 파스칼 삼각형)',
        intlCourse: { id: 'intl-algebra-2', label: 'Algebra 2', labelKo: '이항정리 (Binomial Theorem)', href: '/curriculum#intl-algebra-2' },
        domain: { id: 'domain-data', label: 'Data & Probability', labelKo: '자료와 가능성 · 확률과 통계', href: '/curriculum#domain-data' },
      },
      {
        id: 'probability-distributions', label: '확률분포', labelEn: 'Probability Distributions', desc: '이항분포의 확률, 기댓값',
        tier: 'advanced',
        alg2Chapter: 'Topic 13.1-13.3 Probability Distribution (이항분포·정규분포)',
        intlCourse: { id: 'intl-precalculus', label: 'Precalculus', labelKo: '확률분포 (Probability Distributions)', href: '/curriculum#intl-precalculus' },
        domain: { id: 'domain-data', label: 'Data & Probability', labelKo: '자료와 가능성 · 확률과 통계', href: '/curriculum#domain-data' },
      },
    ],
  },
  {
    id: 'statistics-data', label: '통계와 자료 해석', labelEn: 'Statistics & Data',
    description: '대푯값, 평균, 중앙값, 자료 해석 등 통계 영역 핵심 주제',
    units: [
      {
        id: 'statistics-averages', label: '평균·중앙값·최빈값', labelEn: 'Mean, Median & Mode', desc: '산술평균, 가중평균, 중앙값 찾기, 대푯값',
        tier: 'basic',
        intlCourse: { id: 'intl-pre-algebra', label: 'Pre-Algebra', labelKo: '평균·중앙값·최빈값 (Center & Spread)', href: '/curriculum#intl-pre-algebra' },
        domain: { id: 'domain-data', label: 'Data & Probability', labelKo: '자료와 가능성 · 확률과 통계', href: '/curriculum#domain-data' },
      },
      {
        id: 'charts-data-analysis', label: '표와 그래프 해석', labelEn: 'Charts & Data Analysis', desc: '막대그래프, 꺾은선그래프, 원그래프, 표 분석',
        tier: 'basic',
        intlCourse: { id: 'intl-pre-algebra', label: 'Pre-Algebra', labelKo: '도수분포표와 차트 해석', href: '/curriculum#intl-pre-algebra' },
        domain: { id: 'domain-data', label: 'Data & Probability', labelKo: '자료와 가능성 · 확률과 통계', href: '/curriculum#domain-data' },
      },
    ],
  },
  {
    id: 'logic-word-problems', label: '논리와 문제해결', labelEn: 'Logic & Problem Solving',
    description: '논리 추론, 참·거짓 판별, 시계/달력, 게임 전략, 암호산 등 문제해결 영역',
    units: [
      {
        id: 'logical-reasoning', label: '논리적 추론과 참·거짓', labelEn: 'Logical Reasoning', desc: '진실/거짓말쟁이 문제, 명제 논리, 경우 따지기',
        tier: 'intermediate',
        vol1Chapter: 'Ch 3. Logical Reasoning (참·거짓 추론·달팽이 우물)',
        intlCourse: { id: 'intl-pre-algebra', label: 'Pre-Algebra', labelKo: '논리 추론과 비둘기집 원리', href: '/curriculum#intl-pre-algebra' },
        domain: { id: 'domain-modeling', label: 'Modeling & Problem Solving', labelKo: '수학적 모델링과 문제 해결', href: '/curriculum#domain-modeling' },
      },
      {
        id: 'clocks-calendars', label: '시계와 달력 문제', labelEn: 'Clocks & Calendars', desc: '시침과 분침이 이루는 각도, 요일 계산, 날짜 주기',
        tier: 'intermediate',
        vol4Chapter: 'Ch 20. Remainder (달력 요일 주기와 mod 7 연산)',
        intlCourse: { id: 'intl-pre-algebra', label: 'Pre-Algebra', labelKo: '시계 각도와 달력 주기', href: '/curriculum#intl-pre-algebra' },
        domain: { id: 'domain-modeling', label: 'Modeling & Problem Solving', labelKo: '수학적 모델링과 문제 해결', href: '/curriculum#domain-modeling' },
      },
      {
        id: 'games-strategy', label: '게임과 필승 전략', labelEn: 'Games & Strategy', desc: '동전 집기, 님 게임, 후수/선수 필승법',
        tier: 'advanced',
        vol1Chapter: 'Ch 3. Logical Reasoning / Ch 5 Even and Odd (램프 스위치·게임 전략)',
        intlCourse: { id: 'intl-pre-algebra', label: 'Pre-Algebra', labelKo: '게임 이론과 전략', href: '/curriculum#intl-pre-algebra' },
        domain: { id: 'domain-modeling', label: 'Modeling & Problem Solving', labelKo: '수학적 모델링과 문제 해결', href: '/curriculum#domain-modeling' },
      },
      {
        id: 'cryptarithms-puzzles', label: '암호산과 수학 퍼즐', labelEn: 'Cryptarithms & Puzzles', desc: '복면산, 마방진, 빈칸 채우기 퍼즐',
        tier: 'advanced',
        vol1Chapter: 'Ch 3. Logical Reasoning (복면산과 수학 퍼즐)',
        intlCourse: { id: 'intl-pre-algebra', label: 'Pre-Algebra', labelKo: '암호산과 정수 퍼즐', href: '/curriculum#intl-pre-algebra' },
        domain: { id: 'domain-modeling', label: 'Modeling & Problem Solving', labelKo: '수학적 모델링과 문제 해결', href: '/curriculum#domain-modeling' },
      },
      {
        id: 'word-problems', label: '실생활 문장제 (나이·금액)', labelEn: 'Word Problems', desc: '나이 문제, 금액 분배, 과부족 문제',
        tier: 'basic',
        vol1Chapter: 'Ch 6. Word Problems related to Percentage (실생활 문장제)',
        vol3Chapter: 'Ch 16. Ratio, Rate and Proportion / Ch 18. Solving Equations (비례배분·방정식 문장제)',
        intlCourse: { id: 'intl-algebra-1', label: 'Algebra 1', labelKo: '실생활 문장제와 일차방정식', href: '/curriculum#intl-algebra-1' },
        domain: { id: 'domain-modeling', label: 'Modeling & Problem Solving', labelKo: '수학적 모델링과 문제 해결', href: '/curriculum#domain-modeling' },
      },
    ],
  },
  {
    id: 'functions', label: '함수', labelEn: 'Functions',
    description: '함수의 정의, 함수값 계산, 합성함수, 일차함수 그래프',
    units: [
      {
        id: 'function-properties', label: '함수의 성질과 그래프', labelEn: 'Function Properties & Graphs', desc: 'f(x) 정의, 규칙에 따른 함수값 계산, 합성함수',
        tier: 'intermediate',
        vol4Chapter: 'Ch 22. Functions (함수의 정의·합성함수·바닥함수 floor)',
        alg2Chapter: 'Topic 2.1 Relations & Functions (함수의 정의와 합성함수)',
        intlCourse: { id: 'intl-algebra-1', label: 'Algebra 1', labelKo: '함수의 성질과 그래프', href: '/curriculum#intl-algebra-1' },
        domain: { id: 'domain-algebra', label: 'Algebra & Relations', labelKo: '변화와 관계 · 대수', href: '/curriculum#domain-algebra' },
      },
      {
        id: 'function-transformations', label: '함수의 그래프와 변환', labelEn: 'Function Graphs & Transformations', desc: '평행이동·대칭이동·확대축소가 그래프 위의 점에 미치는 영향',
        tier: 'advanced',
        alg2Chapter: 'Topic 2.5 Function Transformation (평행이동·대칭·확대축소)',
        intlCourse: { id: 'intl-algebra-2', label: 'Algebra 2', labelKo: '함수의 그래프와 변환', href: '/curriculum#intl-algebra-2' },
        domain: { id: 'domain-algebra', label: 'Algebra & Relations', labelKo: '변화와 관계 · 대수', href: '/curriculum#domain-algebra' },
      },
    ],
  },
  {
    id: 'advanced', label: '심화 주제 (AMC 10·12)', labelEn: 'Trig & Complex (AMC 10/12)',
    description: '삼각함수, 복소수 등 고등 경시 심화 주제',
    units: [
      {
        id: 'trigonometry', label: '삼각함수', labelEn: 'Trigonometry', desc: '[AMC 10·12] 특수각의 삼각비, 삼각방정식, 사인법칙·코사인법칙, 헤론의 공식',
        tier: 'advanced', amcLevel: 'AMC 10·12',
        intlCourse: { id: 'intl-precalculus', label: 'Precalculus', labelKo: '삼각함수 (Trigonometry)', href: '/curriculum#intl-precalculus' },
        domain: { id: 'domain-geometry', label: 'Geometry & Measurement', labelKo: '도형과 측정 · 기하', href: '/curriculum#domain-geometry' },
      },
      {
        id: 'trig-identities', label: '삼각함수의 덧셈정리', labelEn: 'Trigonometric Identities', desc: '[AMC 12] 삼각함수의 합·차공식, 배각공식을 이용한 삼각비 계산',
        tier: 'advanced', amcLevel: 'AMC 12',
        intlCourse: { id: 'intl-precalculus', label: 'Precalculus', labelKo: '삼각함수의 덧셈정리 (Trig Identities)', href: '/curriculum#intl-precalculus' },
        domain: { id: 'domain-geometry', label: 'Geometry & Measurement', labelKo: '도형과 측정 · 기하', href: '/curriculum#domain-geometry' },
      },
      {
        id: 'complex-numbers', label: '복소수', labelEn: 'Complex Numbers', desc: '[AMC 10·12] 허수 단위 i, 복소수의 연산과 켤레복소수',
        tier: 'advanced', amcLevel: 'AMC 10·12',
        alg2Chapter: 'Topic 4.3 Complex Numbers (허수단위와 복소수 연산)',
        intlCourse: { id: 'intl-algebra-2', label: 'Algebra 2', labelKo: '복소수 (Complex Numbers)', href: '/curriculum#intl-algebra-2' },
        domain: { id: 'domain-numbers', label: 'Number & Operations', labelKo: '수와 연산', href: '/curriculum#domain-numbers' },
      },
      {
        id: 'complex-numbers-polar', label: '복소수의 극형식과 드무아브르 정리', labelEn: 'Polar Form & De Moivre\'s Theorem', desc: '[AMC 12] 복소수의 극형식 변환, 드무아브르 정리를 이용한 거듭제곱 계산',
        tier: 'advanced', amcLevel: 'AMC 12',
        alg2Chapter: 'Topic 4.3 Complex Numbers & Polar Form (복소수와 극형식)',
        intlCourse: { id: 'intl-precalculus', label: 'Precalculus', labelKo: '복소수의 극형식과 드무아브르 정리', href: '/curriculum#intl-precalculus' },
        domain: { id: 'domain-numbers', label: 'Number & Operations', labelKo: '수와 연산', href: '/curriculum#domain-numbers' },
      },
      {
        id: 'factoring-quadratics', label: '이차식의 인수분해', labelEn: 'Factoring Quadratics', desc: '[AMC 10] 완전제곱식·합차공식을 이용한 이차식의 인수분해',
        tier: 'advanced', amcLevel: 'AMC 10',
        alg2Chapter: 'Topic 4.1-4.2 Quadratic Factoring (이차식 인수분해)',
        intlCourse: { id: 'intl-algebra-1', label: 'Algebra 1', labelKo: '이차식의 인수분해', href: '/curriculum#intl-algebra-1' },
        domain: { id: 'domain-algebra', label: 'Algebra & Relations', labelKo: '변화와 관계 · 대수', href: '/curriculum#domain-algebra' },
      },
      {
        id: 'completing-square', label: '완전제곱식과 근의 공식', labelEn: 'Completing the Square & Quadratic Formula', desc: '[AMC 10·12] 완전제곱식으로 변형하기, 근의 공식으로 방정식 풀기',
        tier: 'advanced', amcLevel: 'AMC 10·12',
        alg2Chapter: 'Topic 4.4-4.5 Completing the Square & Quadratic Formula (완전제곱식과 근의 공식)',
        intlCourse: { id: 'intl-algebra-2', label: 'Algebra 2', labelKo: '완전제곱식과 근의 공식', href: '/curriculum#intl-algebra-2' },
        domain: { id: 'domain-algebra', label: 'Algebra & Relations', labelKo: '변화와 관계 · 대수', href: '/curriculum#domain-algebra' },
      },
      {
        id: 'quadratic-optimization', label: '이차함수의 최대·최소', labelEn: 'Quadratic Vertex & Optimization', desc: '[AMC 10] 포물선의 꼭짓점을 이용한 최댓값·최솟값 문제',
        tier: 'advanced', amcLevel: 'AMC 10',
        alg2Chapter: 'Topic 4.6 Maximum & Minimum of Quadratic Function (이차함수 최대·최소)',
        intlCourse: { id: 'intl-algebra-2', label: 'Algebra 2', labelKo: '이차함수의 최대·최소', href: '/curriculum#intl-algebra-2' },
        domain: { id: 'domain-algebra', label: 'Algebra & Relations', labelKo: '변화와 관계 · 대수', href: '/curriculum#domain-algebra' },
      },
      {
        id: 'polynomial-arithmetic', label: '다항식의 연산', labelEn: 'Polynomial Arithmetic', desc: '[AMC 10·12] 다항식의 곱셈, 나머지 정리, 계수 비교',
        tier: 'advanced', amcLevel: 'AMC 10·12',
        alg2Chapter: 'Topic 5.1-5.3 & 6.1 Polynomials & Long Division (다항식 연산과 나눗셈)',
        intlCourse: { id: 'intl-algebra-2', label: 'Algebra 2', labelKo: '다항식의 연산', href: '/curriculum#intl-algebra-2' },
        domain: { id: 'domain-algebra', label: 'Algebra & Relations', labelKo: '변화와 관계 · 대수', href: '/curriculum#domain-algebra' },
      },
      {
        id: 'polynomial-zeros', label: '다항식의 근과 유리근 정리', labelEn: 'Polynomial Zeros & Rational Root Theorem', desc: '[AMC 12] 유리근 정리, 인수정리, 주어진 근으로 다항식 구성',
        tier: 'advanced', amcLevel: 'AMC 12',
        alg2Chapter: 'Topic 5.4 & 6.2-6.4 Factor Theorem & Rational Root Theorem (인수정리와 유리근 정리)',
        intlCourse: { id: 'intl-algebra-2', label: 'Algebra 2', labelKo: '다항식의 근과 유리근 정리', href: '/curriculum#intl-algebra-2' },
        domain: { id: 'domain-algebra', label: 'Algebra & Relations', labelKo: '변화와 관계 · 대수', href: '/curriculum#domain-algebra' },
      },
      {
        id: 'rational-functions', label: '유리함수', labelEn: 'Rational Functions', desc: '[AMC 12] 점근선, 유리방정식 풀이',
        tier: 'advanced', amcLevel: 'AMC 12',
        alg2Chapter: 'Topic 8.1-8.5 Rational Expressions & Graphs (유리식과 유리함수 점근선)',
        intlCourse: { id: 'intl-algebra-2', label: 'Algebra 2', labelKo: '유리함수 (Rational Functions)', href: '/curriculum#intl-algebra-2' },
        domain: { id: 'domain-algebra', label: 'Algebra & Relations', labelKo: '변화와 관계 · 대수', href: '/curriculum#domain-algebra' },
      },
      {
        id: 'exponential-logarithmic', label: '지수·로그 방정식', labelEn: 'Exponential & Logarithmic Equations', desc: '[AMC 10·12] 지수방정식과 로그방정식 풀이',
        tier: 'advanced', amcLevel: 'AMC 10·12',
        alg2Chapter: 'Topic 9.1-9.7 Exponential & Logarithmic Functions (지수·로그방정식)',
        intlCourse: { id: 'intl-precalculus', label: 'Precalculus', labelKo: '지수·로그 방정식', href: '/curriculum#intl-precalculus' },
        domain: { id: 'domain-algebra', label: 'Algebra & Relations', labelKo: '변화와 관계 · 대수', href: '/curriculum#domain-algebra' },
      },
      {
        id: 'am-gm-inequality', label: '산술·기하평균 부등식 (AM-GM)', labelEn: 'AM-GM Inequality', desc: '[AMC 10·12] 산술-기하평균 부등식을 활용한 대수 최솟값·최댓값 최적화',
        tier: 'advanced', amcLevel: 'AMC 10·12',
        alg2Chapter: 'Topic 10.4 Arithmetic & Geometric Mean (산술·기하평균 부등식과 최적화)',
        intlCourse: { id: 'intl-precalculus', label: 'Precalculus', labelKo: '산술·기하평균 (AM-GM)', href: '/curriculum#intl-precalculus' },
        domain: { id: 'domain-algebra', label: 'Algebra & Relations', labelKo: '변화와 관계 · 대수', href: '/curriculum#domain-algebra' },
      },
      {
        id: 'radical-equations', label: '무리방정식과 무연근', labelEn: 'Radical Equations & Extraneous Roots', desc: '[AMC 10·12] 제곱근을 포함한 방정식의 해법과 무연근(Extraneous Solution) 판별',
        tier: 'advanced', amcLevel: 'AMC 10·12',
        alg2Chapter: 'Topic 7.4 Solving Radical Equations (무리방정식 풀이와 무연근 검증)',
        intlCourse: { id: 'intl-algebra-2', label: 'Algebra 2', labelKo: '무리방정식 (Radical Equations)', href: '/curriculum#intl-algebra-2' },
        domain: { id: 'domain-algebra', label: 'Algebra & Relations', labelKo: '변화와 관계 · 대수', href: '/curriculum#domain-algebra' },
      },
      {
        id: 'absolute-value-graphs', label: '절댓값 함수와 그래프 영역', labelEn: 'Absolute Value Graphs & Regions', desc: '[AMC 10·12] 절댓값 함수 그래프의 꺾임점, 마름모 영역(|x| + |y| ≤ k) 넓이와 최적화',
        tier: 'advanced', amcLevel: 'AMC 10·12',
        alg2Chapter: 'Topic 1.7 & 2.6 Absolute Value Equations & Graphs (절댓값 방정식과 그래프)',
        intlCourse: { id: 'intl-algebra-2', label: 'Algebra 2', labelKo: '절댓값 함수와 영역', href: '/curriculum#intl-algebra-2' },
        domain: { id: 'domain-algebra', label: 'Algebra & Relations', labelKo: '변화와 관계 · 대수', href: '/curriculum#domain-algebra' },
      },
      {
        id: 'quadratic-inequalities', label: '이차부등식과 판별식', labelEn: 'Quadratic Inequalities & Discriminants', desc: '[AMC 10·12] 판별식 D와 근의 조건, 이차부등식의 해 영역 및 정수해 개수',
        tier: 'advanced', amcLevel: 'AMC 10·12',
        alg2Chapter: 'Topic 4.7-4.8 Quadratic Inequalities & Discriminant (이차부등식과 판별식)',
        intlCourse: { id: 'intl-algebra-2', label: 'Algebra 2', labelKo: '이차부등식과 판별식', href: '/curriculum#intl-algebra-2' },
        domain: { id: 'domain-algebra', label: 'Algebra & Relations', labelKo: '변화와 관계 · 대수', href: '/curriculum#domain-algebra' },
      },
    ],
  },
  {
    id: 'uncategorized', label: '미분류', labelEn: 'Uncategorized',
    units: [
      { id: 'uncategorized', label: '자동 분류 미확정', labelEn: 'Not yet classified' },
    ],
  },
];

export function flattenAmcFineUnits() {
  return AMC_FINE_SUBJECTS.flatMap((subject) => subject.units.map((unit) => ({
    ...unit, subjectId: subject.id, subjectLabel: subject.label, subjectLabelEn: subject.labelEn,
  })));
}

export function findAmcFineUnit(unitId) {
  return flattenAmcFineUnits().find((unit) => unit.id === unitId) || null;
}

// Matches the site's existing 2015/2022 개정 교육과정 dual-naming convention
// (see app/curriculumCatalog.js) so the CSAT archive doesn't invent a separate scheme.
// `tier` here is judged relative to CSAT's own overall difficulty (all of it is
// college-entrance-exam level), not against AMC/regular-curriculum tiers.
export const CSAT_SUBJECTS = [
  {
    id: 'math1', label: '수학Ⅰ', labelEn: 'Math I', revised2022: '대수',
    units: [
      { id: 'exp-log', label: '지수함수와 로그함수', labelEn: 'Exponential & Logarithmic Functions', tier: 'intermediate' },
      { id: 'trig', label: '삼각함수', labelEn: 'Trigonometric Functions', tier: 'intermediate' },
      { id: 'sequences', label: '수열', labelEn: 'Sequences', tier: 'intermediate' },
    ],
  },
  {
    id: 'math2', label: '수학Ⅱ', labelEn: 'Math II', revised2022: '미적분Ⅰ',
    units: [
      { id: 'limits-continuity', label: '함수의 극한과 연속', labelEn: 'Limits & Continuity', tier: 'intermediate' },
      { id: 'differentiation', label: '미분', labelEn: 'Differentiation', tier: 'intermediate' },
      { id: 'integration', label: '적분', labelEn: 'Integration', tier: 'intermediate' },
    ],
  },
  {
    id: 'prob-stats', label: '확률과 통계', labelEn: 'Probability & Statistics', revised2022: '확률과 통계',
    units: [
      { id: 'counting', label: '경우의 수', labelEn: 'Counting Principles', tier: 'intermediate' },
      { id: 'probability', label: '확률', labelEn: 'Probability', tier: 'advanced' },
      { id: 'statistics', label: '통계', labelEn: 'Statistics', tier: 'intermediate' },
    ],
  },
  {
    id: 'calculus', label: '미적분', labelEn: 'Calculus', revised2022: '미적분Ⅱ',
    units: [
      { id: 'sequence-limits', label: '수열의 극한', labelEn: 'Limits of Sequences', tier: 'intermediate' },
      { id: 'advanced-differentiation', label: '여러 가지 미분법', labelEn: 'Advanced Differentiation', tier: 'advanced' },
      { id: 'advanced-integration', label: '여러 가지 적분법', labelEn: 'Advanced Integration', tier: 'advanced' },
    ],
  },
  {
    id: 'geometry', label: '기하', labelEn: 'Geometry', revised2022: '기하',
    units: [
      { id: 'conic-sections', label: '이차곡선', labelEn: 'Conic Sections', tier: 'advanced' },
      { id: 'plane-vectors', label: '평면벡터', labelEn: 'Plane Vectors', tier: 'intermediate' },
      { id: 'space-geometry', label: '공간도형과 공간좌표', labelEn: 'Solid Geometry & Space Coordinates', tier: 'advanced' },
    ],
  },
];

// Composite label ("수학Ⅰ · 지수함수와 로그함수") used as the stored unit_tag value,
// so the plain-string tag stays self-descriptive without a schema change.
export function csatUnitTagLabel(subject, unit) {
  return `${subject.label} · ${unit.label}`;
}

export function flattenCsatUnits() {
  return CSAT_SUBJECTS.flatMap((subject) => subject.units.map((unit) => ({
    value: csatUnitTagLabel(subject, unit),
    subjectId: subject.id,
    subjectLabel: subject.label,
    unitId: unit.id,
    unitLabel: unit.label,
  })));
}

// 고1 공통 과목(2022개정 공통수학1·공통수학2, 구 수학(상)·수학(하)) 단원 태그.
// 고1 학력평가(6월·9월)는 CSAT_SUBJECTS(수학Ⅰ·Ⅱ 등 고2~3 선택과목)가 아니라 이 범위를 출제하므로 별도 목록으로 둔다.
export const COMMON_MATH_SUBJECTS = [
  {
    id: 'common-math-1', label: '공통수학1', labelEn: 'Common Mathematics 1', revised2022: '공통수학1',
    units: [
      { id: 'polynomial-ops', label: '다항식의 연산', labelEn: 'Polynomial Operations', tier: 'basic' },
      { id: 'equations-inequalities', label: '방정식과 부등식', labelEn: 'Equations & Inequalities', tier: 'intermediate' },
      { id: 'common-math-counting', label: '경우의 수', labelEn: 'Counting Principles', tier: 'intermediate' },
      { id: 'matrices-intro', label: '행렬', labelEn: 'Matrices', tier: 'basic' },
    ],
  },
  {
    id: 'common-math-2', label: '공통수학2', labelEn: 'Common Mathematics 2', revised2022: '공통수학2',
    units: [
      { id: 'coordinate-geometry-equations', label: '도형의 방정식', labelEn: 'Equations of Figures', tier: 'intermediate' },
      { id: 'sets-propositions', label: '집합과 명제', labelEn: 'Sets & Propositions', tier: 'basic' },
      { id: 'functions-graphs', label: '함수와 그래프', labelEn: 'Functions & Graphs', tier: 'intermediate' },
    ],
  },
];

export function commonMathUnitTagLabel(subject, unit) {
  return `${subject.label} · ${unit.label}`;
}

export function flattenCommonMathUnits() {
  return COMMON_MATH_SUBJECTS.flatMap((subject) => subject.units.map((unit) => ({
    value: commonMathUnitTagLabel(subject, unit),
    subjectId: subject.id,
    subjectLabel: subject.label,
    unitId: unit.id,
    unitLabel: unit.label,
  })));
}
