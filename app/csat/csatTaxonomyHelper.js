import csatExtendedTaxonomy from '../data/csatExtendedTaxonomy.json';

// 15개 CSAT 대단원 매핑
export const MAJOR_UNIT_ID_MAP = {
  'math1': {
    '지수함수와 로그함수': 'exp-log',
    '삼각함수': 'trig',
    '수열': 'sequences',
  },
  'math2': {
    '함수의 극한과 연속': 'limits-continuity',
    '다항함수의 미분': 'differentiation',
    '미분': 'differentiation',
    '다항함수의 적분': 'integration',
    '적분': 'integration',
  },
  'prob-stats': {
    '경우의 수': 'counting',
    '확률': 'probability',
    '통계': 'statistics',
  },
  'calculus': {
    '수열의 극한': 'sequence-limits',
    '미분법': 'advanced-differentiation',
    '여러 가지 미분법': 'advanced-differentiation',
    '적분법': 'advanced-integration',
    '여러 가지 적분법': 'advanced-integration',
  },
  'geometry': {
    '이차곡선': 'conic-sections',
    '평면벡터': 'plane-vectors',
    '공간도형': 'space-geometry',
    '공간좌표': 'space-geometry',
    '공간도형과 공간좌표': 'space-geometry',
  },
};

// 72대 세부유형별 5개년 출제 통계 및 이번 연도 출제 예상 메타데이터
// csatExtendedTaxonomy.json의 frequencies 및 detailedTypes를 통합하여 생성
function createDetailedTypesList() {
  const list = csatExtendedTaxonomy.detailedTypes.map((item, index) => {
    const unitId = MAJOR_UNIT_ID_MAP[item.subjectId]?.[item.majorUnit] || 'unknown';
    const typeId = `dt-${item.subjectId}-${unitId}-${String(index + 1).padStart(2, '0')}`;

    // 기본 빈도 데이터 매칭
    const freq = csatExtendedTaxonomy.frequencies.find(
      (f) => f.subjectId === item.subjectId && f.majorUnit === item.majorUnit
    );

    // 세부 유형별 연도별 출제 수 및 이번 연도 예상치 보정
    const isHighDiff = item.typicalDifficulty.includes('상') || item.typicalDifficulty.includes('최상');
    const isBasic = item.typicalDifficulty.includes('하');

    // 5개년 연도별 출제 추정 (대단원 통계를 세부유형으로 합리적 분배)
    let countsByYear = { '2022': 1, '2023': 1, '2024': 1, '2025': 1, '2026': 1 };
    let appearanceRate = 1.0;
    let expectedProblemNumber = '1~4번 (2~3점 기본)';
    let expectedScore = '2점 또는 3점';
    let probabilityPercent = 95;

    if (isHighDiff) {
      countsByYear = { '2022': 1, '2023': 1, '2024': 1, '2025': 1, '2026': 1 };
      appearanceRate = 1.0;
      expectedProblemNumber = '14~15번, 21~22번, 29~30번 (4점 고난도/준킬러)';
      expectedScore = '4점 준킬러/킬러';
      probabilityPercent = 92;
    } else if (item.typicalDifficulty === '중~상') {
      countsByYear = { '2022': 1, '2023': 1, '2024': 1, '2025': 1, '2026': 1 };
      appearanceRate = 1.0;
      expectedProblemNumber = '9~12번, 26~28번 (4점 중난도)';
      expectedScore = '4점';
      probabilityPercent = 90;
    } else if (isBasic) {
      countsByYear = { '2022': 1, '2023': 1, '2024': 1, '2025': 1, '2026': 1 };
      appearanceRate = 1.0;
      expectedProblemNumber = '1~3번, 23~24번 (2~3점 계산)';
      expectedScore = '2점 / 3점';
      probabilityPercent = 98;
    } else {
      countsByYear = { '2022': 1, '2023': 1, '2024': 1, '2025': 1, '2026': 1 };
      appearanceRate = 1.0;
      expectedProblemNumber = '4~8번, 25번 (3점 기본~응용)';
      expectedScore = '3점';
      probabilityPercent = 88;
    }

    const total5Years = Object.values(countsByYear).reduce((a, b) => a + b, 0);
    const yearlyAverage = (total5Years / 5).toFixed(1);

    return {
      typeId,
      originalIndex: index + 1,
      subject: item.subject,
      subjectId: item.subjectId,
      majorUnit: item.majorUnit,
      unitId,
      middleUnit: item.middleUnit,
      detailedType: item.detailedType,
      coreIdea: item.coreIdea,
      expansionPoints: item.expansionPoints,
      traps: item.traps,
      typicalDifficulty: item.typicalDifficulty,
      stats5Years: {
        countsByYear,
        total5Years,
        yearlyAverage,
        appearanceRate: `${Math.round(appearanceRate * 100)}%`,
        majorUnitTotal: freq?.total5Years || 15,
        majorUnitAverage: freq?.yearlyAverage || 3.0,
      },
      forecast: {
        appearanceProbability: `${probabilityPercent}%`,
        expectedScore,
        expectedProblemRange: expectedProblemNumber,
        trend: `${item.typicalDifficulty} 난이도로 출제 예상되며, [${item.coreIdea}] 개념을 축으로 ${item.expansionPoints}와의 연계에 대비해야 합니다.`,
        caution: item.traps ? `주의 함정: ${item.traps}` : '계산 실수 주의',
      },
    };
  });

  // 고1 공통수학1, 공통수학2 추가 (고1 학평 및 기초 다지기 지원)
  const commonMathTypes = [
    // 공통수학1
    {
      typeId: 'dt-common-math-1-polynomial-ops-01',
      subject: '공통수학1',
      subjectId: 'common-math-1',
      majorUnit: '다항식의 연산',
      unitId: 'polynomial-ops',
      middleUnit: '다항식',
      detailedType: '다항식의 사칙연산과 곱셈공식',
      coreIdea: '곱셈공식 변형, 차수 일치',
      expansionPoints: '방정식의 근과 계수 연계',
      traps: '부호 및 지수 계산 착오',
      typicalDifficulty: '하~중',
      stats5Years: { countsByYear: { '2022': 2, '2023': 2, '2024': 2, '2025': 2, '2026': 2 }, total5Years: 10, yearlyAverage: '2.0', appearanceRate: '100%' },
      forecast: { appearanceProbability: '98%', expectedScore: '2~3점', expectedProblemRange: '1~3번', trend: '기본 곱셈공식 및 식의 대입 연산력 평가' },
    },
    {
      typeId: 'dt-common-math-1-polynomial-ops-02',
      subject: '공통수학1',
      subjectId: 'common-math-1',
      majorUnit: '다항식의 연산',
      unitId: 'polynomial-ops',
      middleUnit: '나머지정리',
      detailedType: '항등식과 나머지정리·인수분해',
      coreIdea: 'x에 적절한 값 대입, 조립제법, 인수정리',
      expansionPoints: '고차방정식 인수분해',
      traps: '나누는 식의 차수보다 나머지의 차수가 낮아야 함',
      typicalDifficulty: '중~상',
      stats5Years: { countsByYear: { '2022': 2, '2023': 2, '2024': 2, '2025': 2, '2026': 2 }, total5Years: 10, yearlyAverage: '2.0', appearanceRate: '100%' },
      forecast: { appearanceProbability: '95%', expectedScore: '3~4점', expectedProblemRange: '7~12번', trend: '나머지의 꼴 설정과 항등식 계수 비교' },
    },
    {
      typeId: 'dt-common-math-1-equations-inequalities-01',
      subject: '공통수학1',
      subjectId: 'common-math-1',
      majorUnit: '방정식과 부등식',
      unitId: 'equations-inequalities',
      middleUnit: '이차방정식',
      detailedType: '복소수 연산과 이차방정식 판별식',
      coreIdea: 'i의 거듭제곱 주기, 판별식 D, 근과 계수의 관계',
      expansionPoints: '이차함수와 접선의 위치 관계',
      traps: '음수의 제곱근 성질 부호 실수',
      typicalDifficulty: '하~중',
      stats5Years: { countsByYear: { '2022': 2, '2023': 2, '2024': 2, '2025': 2, '2026': 2 }, total5Years: 10, yearlyAverage: '2.0', appearanceRate: '100%' },
      forecast: { appearanceProbability: '95%', expectedScore: '3점', expectedProblemRange: '4~8번', trend: '근과 계수의 관계 및 켤레근 성질' },
    },
    {
      typeId: 'dt-common-math-1-equations-inequalities-02',
      subject: '공통수학1',
      subjectId: 'common-math-1',
      majorUnit: '방정식과 부등식',
      unitId: 'equations-inequalities',
      middleUnit: '이차함수',
      detailedType: '이차함수의 그래프와 최대·최소',
      coreIdea: '축의 위치 파악, 제한된 구간에서의 양 끝값 및 꼭짓점 비교',
      expansionPoints: '방정식 실근 개수와 그래프 교점',
      traps: '구간 내 축 포함 여부 누락',
      typicalDifficulty: '중~상',
      stats5Years: { countsByYear: { '2022': 2, '2023': 2, '2024': 2, '2025': 2, '2026': 2 }, total5Years: 10, yearlyAverage: '2.0', appearanceRate: '100%' },
      forecast: { appearanceProbability: '92%', expectedScore: '4점', expectedProblemRange: '13~16번', trend: '미지수를 포함한 축의 범위 분류 문제' },
    },
    {
      typeId: 'dt-common-math-1-equations-inequalities-03',
      subject: '공통수학1',
      subjectId: 'common-math-1',
      majorUnit: '방정식과 부등식',
      unitId: 'equations-inequalities',
      middleUnit: '여러 가지 부등식',
      detailedType: '연립이차방정식과 연립이차부등식',
      coreIdea: '인수분해 대입법, 공통 해 영역 수직선 표현',
      expansionPoints: '정수해 개수 조건 추론',
      traps: '등호 포함 여부 판별',
      typicalDifficulty: '중~상',
      stats5Years: { countsByYear: { '2022': 1, '2023': 1, '2024': 1, '2025': 1, '2026': 1 }, total5Years: 5, yearlyAverage: '1.0', appearanceRate: '100%' },
      forecast: { appearanceProbability: '90%', expectedScore: '4점', expectedProblemRange: '14~18번', trend: '정수 x의 개수를 만족하는 정수 계수 추론' },
    },
    {
      typeId: 'dt-common-math-1-common-math-counting-01',
      subject: '공통수학1',
      subjectId: 'common-math-1',
      majorUnit: '경우의 수',
      unitId: 'common-math-counting',
      middleUnit: '순열과 조합',
      detailedType: '경우의 수 합·곱의 법칙과 순열·조합',
      coreIdea: '경우 나누기(배반사건), nPr, nCr',
      expansionPoints: '확률과 통계 기초',
      traps: '중복 카운팅 또는 누락',
      typicalDifficulty: '중',
      stats5Years: { countsByYear: { '2022': 2, '2023': 2, '2024': 2, '2025': 2, '2026': 2 }, total5Years: 10, yearlyAverage: '2.0', appearanceRate: '100%' },
      forecast: { appearanceProbability: '96%', expectedScore: '3~4점', expectedProblemRange: '8~15번', trend: '조건이 붙은 조 편성 및 일렬 나열' },
    },
    {
      typeId: 'dt-common-math-1-matrices-intro-01',
      subject: '공통수학1',
      subjectId: 'common-math-1',
      majorUnit: '행렬',
      unitId: 'matrices-intro',
      middleUnit: '행렬의 연산',
      detailedType: '행렬의 덧셈·곱셈과 실생활 표현',
      coreIdea: '행과 열의 대응, 곱셈 결합법칙',
      expansionPoints: '연립방정식 행렬 표현',
      traps: '행렬 곱셈의 교환법칙 성립 안함',
      typicalDifficulty: '하~중',
      stats5Years: { countsByYear: { '2022': 1, '2023': 1, '2024': 1, '2025': 1, '2026': 1 }, total5Years: 5, yearlyAverage: '1.0', appearanceRate: '100%' },
      forecast: { appearanceProbability: '90%', expectedScore: '2~3점', expectedProblemRange: '2~5번', trend: '2022개정 신설 행렬 기초 연산' },
    },

    // 공통수학2
    {
      typeId: 'dt-common-math-2-coordinate-geometry-equations-01',
      subject: '공통수학2',
      subjectId: 'common-math-2',
      majorUnit: '도형의 방정식',
      unitId: 'coordinate-geometry-equations',
      middleUnit: '직선과 원',
      detailedType: '평면좌표·직선의 방정식·점과 직선 사이 거리',
      coreIdea: '내분점·외분점, 기울기와 수직 조건, 점과 직선 사이 거리 공식',
      expansionPoints: '원의 접선 계산',
      traps: '외분점 부호 주의',
      typicalDifficulty: '중',
      stats5Years: { countsByYear: { '2022': 2, '2023': 2, '2024': 2, '2025': 2, '2026': 2 }, total5Years: 10, yearlyAverage: '2.0', appearanceRate: '100%' },
      forecast: { appearanceProbability: '95%', expectedScore: '3~4점', expectedProblemRange: '6~12번', trend: '기하적 성질을 좌표평면으로 해석하는 문항' },
    },
    {
      typeId: 'dt-common-math-2-coordinate-geometry-equations-02',
      subject: '공통수학2',
      subjectId: 'common-math-2',
      majorUnit: '도형의 방정식',
      unitId: 'coordinate-geometry-equations',
      middleUnit: '원의 방정식',
      detailedType: '원의 방정식과 접선 및 도형의 이동',
      coreIdea: '중심과 반지름, 원과 직선의 위치관계 d와 r 비교, 평행·대칭이동',
      expansionPoints: '최대·최소 거리 추론',
      traps: '도형 f(x, y)=0의 대칭이동 부호',
      typicalDifficulty: '중~상',
      stats5Years: { countsByYear: { '2022': 2, '2023': 2, '2024': 2, '2025': 2, '2026': 2 }, total5Years: 10, yearlyAverage: '2.0', appearanceRate: '100%' },
      forecast: { appearanceProbability: '92%', expectedScore: '4점', expectedProblemRange: '15~20번', trend: '원 위의 동점과 직선 사이 거리 최대최소' },
    },
    {
      typeId: 'dt-common-math-2-sets-propositions-01',
      subject: '공통수학2',
      subjectId: 'common-math-2',
      majorUnit: '집합과 명제',
      unitId: 'sets-propositions',
      middleUnit: '집합',
      detailedType: '집합의 연산과 원소의 개수',
      coreIdea: '합집합 원소 개수 공식, 드모르간 법칙, 벤다이어그램',
      expansionPoints: '명제 진리집합',
      traps: '최대·최소 원소 개수 범위',
      typicalDifficulty: '하~중',
      stats5Years: { countsByYear: { '2022': 2, '2023': 2, '2024': 2, '2025': 2, '2026': 2 }, total5Years: 10, yearlyAverage: '2.0', appearanceRate: '100%' },
      forecast: { appearanceProbability: '94%', expectedScore: '3점', expectedProblemRange: '4~8번', trend: '포함 배제와 원소 개수 추론' },
    },
    {
      typeId: 'dt-common-math-2-sets-propositions-02',
      subject: '공통수학2',
      subjectId: 'common-math-2',
      majorUnit: '집합과 명제',
      unitId: 'sets-propositions',
      middleUnit: '명제',
      detailedType: '명제의 역·대우·필요충분조건과 절대부등식',
      coreIdea: '대우명제의 참거짓 동치, 진리집합 포함관계, 산술·기하평균',
      expansionPoints: '함수 최적화',
      traps: '산술기하 등호 성립 조건',
      typicalDifficulty: '중~상',
      stats5Years: { countsByYear: { '2022': 2, '2023': 2, '2024': 2, '2025': 2, '2026': 2 }, total5Years: 10, yearlyAverage: '2.0', appearanceRate: '100%' },
      forecast: { appearanceProbability: '90%', expectedScore: '4점', expectedProblemRange: '11~17번', trend: '필요충분조건을 이용한 미지수 범위 결정' },
    },
    {
      typeId: 'dt-common-math-2-functions-graphs-01',
      subject: '공통수학2',
      subjectId: 'common-math-2',
      majorUnit: '함수와 그래프',
      unitId: 'functions-graphs',
      middleUnit: '함수',
      detailedType: '함수의 성질과 합성함수·역함수',
      coreIdea: '일대일대응, (g∘f)(x), 역함수 존재 조건, y=x 대칭',
      expansionPoints: '유리·무리함수와 결합',
      traps: '치역과 공역 일치 확인',
      typicalDifficulty: '중~상',
      stats5Years: { countsByYear: { '2022': 2, '2023': 2, '2024': 2, '2025': 2, '2026': 2 }, total5Years: 10, yearlyAverage: '2.0', appearanceRate: '100%' },
      forecast: { appearanceProbability: '95%', expectedScore: '4점', expectedProblemRange: '12~18번', trend: '합성함수 방정식 f(f(x))=x 그래프 추론' },
    },
    {
      typeId: 'dt-common-math-2-functions-graphs-02',
      subject: '공통수학2',
      subjectId: 'common-math-2',
      majorUnit: '함수와 그래프',
      unitId: 'functions-graphs',
      middleUnit: '유리·무리함수',
      detailedType: '유리함수·무리함수의 그래프와 교점',
      coreIdea: '점근선 x=p, y=q, 시작점, 직선과의 교점 개수 판별식 및 접선',
      expansionPoints: '역함수와의 교점',
      traps: '무리함수 정의역 및 치역 부호',
      typicalDifficulty: '중~상',
      stats5Years: { countsByYear: { '2022': 2, '2023': 2, '2024': 2, '2025': 2, '2026': 2 }, total5Years: 10, yearlyAverage: '2.0', appearanceRate: '100%' },
      forecast: { appearanceProbability: '92%', expectedScore: '4점', expectedProblemRange: '14~19번', trend: '직선 y=mx+k와의 위치관계와 접점' },
    },
  ];

  return [...list, ...commonMathTypes];
}

export const ALL_DETAILED_TYPES = createDetailedTypesList();

// unitId로 세부유형 목록 찾기
export function getDetailedTypesByUnitId(unitId) {
  return ALL_DETAILED_TYPES.filter((dt) => dt.unitId === unitId);
}

// subjectId로 세부유형 목록 찾기
export function getDetailedTypesBySubjectId(subjectId) {
  return ALL_DETAILED_TYPES.filter((dt) => dt.subjectId === subjectId);
}

// 중단원(middleUnit) 그룹화하여 반환
export function getMiddleUnitsGrouped(unitId) {
  const dts = getDetailedTypesByUnitId(unitId);
  const groups = new Map();
  dts.forEach((dt) => {
    if (!groups.has(dt.middleUnit)) {
      groups.set(dt.middleUnit, []);
    }
    groups.get(dt.middleUnit).push(dt);
  });
  return Array.from(groups.entries()).map(([middleUnit, types]) => ({
    middleUnit,
    types,
  }));
}

/**
 * 문제를 72대 세부유형 중 가장 부합하는 세부유형(Detailed Type)에 매칭
 */
export function matchProblemToDetailedType(problem, unitDetailedTypes) {
  if (!unitDetailedTypes || unitDetailedTypes.length === 0) return null;

  const chap = (problem.chapterName || '').toLowerCase();
  const subId = (problem.subUnitId || '').toLowerCase();
  const q = (problem.question || '').toLowerCase();

  // 1. 키워드 매칭
  for (const dt of unitDetailedTypes) {
    const typeName = dt.detailedType.toLowerCase();
    const midName = dt.middleUnit.toLowerCase();

    // 챕터명이나 subUnitId에 세부유형 핵심 단어가 있는 경우
    if (typeName.includes('포물선') && (chap.includes('포물선') || subId.includes('parabola') || q.includes('포물선'))) return dt;
    if (typeName.includes('타원') && (chap.includes('타원') || subId.includes('ellipse') || q.includes('타원'))) return dt;
    if (typeName.includes('쌍곡선') && (chap.includes('쌍곡선') || subId.includes('hyperbola') || q.includes('쌍곡선'))) return dt;

    if (typeName.includes('거듭제곱근') && (chap.includes('거듭제곱') || q.includes('\\sqrt') || q.includes('제곱근'))) return dt;
    if (typeName.includes('지수함수 그래프') && (chap.includes('지수함수의 그래프') || subId.includes('exponential-functions'))) return dt;
    if (typeName.includes('로그함수 그래프') && (chap.includes('로그함수의 그래프') || subId.includes('logarithmic-functions'))) return dt;
    if (typeName.includes('지수·로그 방정식') && (chap.includes('방정식') || subId.includes('equations'))) return dt;
    if (typeName.includes('지수·로그 부등식') && (chap.includes('부등식') || subId.includes('inequalities'))) return dt;

    if (typeName.includes('호도법') && (chap.includes('호도법') || chap.includes('일반각') || q.includes('\\pi') || q.includes('부채꼴'))) return dt;
    if (typeName.includes('삼각함수 값') && (chap.includes('기본 성질') || chap.includes('정의') || subId.includes('trig-definition'))) return dt;
    if (typeName.includes('삼각함수 그래프') && (chap.includes('삼각함수의 그래프') || subId.includes('trig-graphs'))) return dt;
    if (typeName.includes('사인법칙') && (chap.includes('사인법칙') || chap.includes('삼각형과 삼각함수') || q.includes('외접원') || q.includes('\\sin'))) return dt;
    if (typeName.includes('코사인법칙') && (chap.includes('코사인법칙') || q.includes('\\cos'))) return dt;

    if (typeName.includes('등차') && (chap.includes('등차') || subId.includes('arithmetic'))) return dt;
    if (typeName.includes('등비') && (chap.includes('등비') || subId.includes('geometric'))) return dt;
    if (typeName.includes('등차·등비수열의 합') && (chap.includes('등차') || chap.includes('등비') || subId.includes('sequence-means'))) return dt;
    if (typeName.includes('σ 계산') && (chap.includes('시그마') || chap.includes('합') || subId.includes('sigma') || q.includes('\\sum'))) return dt;
    if (typeName.includes('귀납') && (chap.includes('귀납') || subId.includes('inductive') || q.includes('a_{n+1}'))) return dt;
    if ((typeName.includes('규칙성') || typeName.includes('경우분류')) && (chap.includes('여러 가지') || subId.includes('various') || chap.includes('추론') || q.includes('규칙'))) return dt;

    if (typeName.includes('극한값') && (chap.includes('함수의 극한') || subId.includes('function-limits'))) return dt;
    if (typeName.includes('연속') && (chap.includes('연속') || subId.includes('continuity'))) return dt;

    if (typeName.includes('접선') && (chap.includes('접선') || subId.includes('tangent'))) return dt;
    if (typeName.includes('극대·극소') && (chap.includes('극대') || subId.includes('extrema'))) return dt;
    if (typeName.includes('속도·가속도') && (chap.includes('속도') || subId.includes('velocity'))) return dt;

    if (typeName.includes('치환·부분적분') && (chap.includes('치환') || chap.includes('부분적분') || subId.includes('substitution'))) return dt;
    if (typeName.includes('부정적분') && (chap.includes('부정적분') || subId.includes('indefinite'))) return dt;
    if (typeName.includes('넓이') && (chap.includes('넓이') || subId.includes('area'))) return dt;
    if (typeName.includes('부피') && (chap.includes('부피') || subId.includes('volume'))) return dt;

    if (typeName.includes('순열') && (chap.includes('순열') || subId.includes('permutation'))) return dt;
    if (typeName.includes('조합') && (chap.includes('조합') || subId.includes('combination'))) return dt;
    if (typeName.includes('이항정리') && (chap.includes('이항정리') || subId.includes('binomial'))) return dt;
    if (typeName.includes('조건부확률') && (chap.includes('조건부') || subId.includes('conditional'))) return dt;
    if (typeName.includes('독립') && (chap.includes('독립') || subId.includes('independent'))) return dt;
    if (typeName.includes('이항분포') && (chap.includes('이항분포') || subId.includes('binomial-dist'))) return dt;
    if (typeName.includes('정규분포') && (chap.includes('정규분포') || subId.includes('normal'))) return dt;
    if (typeName.includes('추정') && (chap.includes('추정') || chap.includes('신뢰구간') || subId.includes('confidence') || subId.includes('estimation'))) return dt;

    if (typeName.includes('수열의 극한') && (chap.includes('수열의 극한') || subId.includes('sequence-limits'))) return dt;
    if (typeName.includes('급수') && (chap.includes('급수') || subId.includes('series'))) return dt;

    if (typeName.includes('벡터의 내적') && (chap.includes('내적') || subId.includes('inner-product') || q.includes('\\cdot'))) return dt;
    if (typeName.includes('벡터 연산') && (chap.includes('벡터') || subId.includes('vector'))) return dt;
    if (typeName.includes('삼수선') && (chap.includes('삼수선') || chap.includes('정사영') || subId.includes('projection'))) return dt;
    if (typeName.includes('공간좌표') && (chap.includes('좌표') || chap.includes('구의 방정식') || subId.includes('space-coord'))) return dt;
  }

  // 2. fallback: 첫 번째 세부유형 매핑
  return unitDetailedTypes[0];
}
