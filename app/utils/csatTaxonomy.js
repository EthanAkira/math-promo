import csatTaxonomyData from '../data/csatExtendedTaxonomy.json';

export { csatTaxonomyData };

/**
 * Returns the entire extended CSAT taxonomy database.
 */
export function getCsatTaxonomy() {
  return csatTaxonomyData;
}

/**
 * Subject ID to Korean label mapping
 */
export const CSAT_SUBJECT_LABELS = {
  math1: '수학Ⅰ',
  math2: '수학Ⅱ',
  'prob-stats': '확률과 통계',
  calculus: '미적분',
  geometry: '기하',
};

/**
 * Subject Korean label to ID mapping
 */
export const CSAT_SUBJECT_IDS = {
  '수학Ⅰ': 'math1',
  '수학Ⅱ': 'math2',
  '확률과 통계': 'prob-stats',
  '미적분': 'calculus',
  '기하': 'geometry',
};

/**
 * Returns 5-year frequency statistics filtered by subject
 */
export function getFrequenciesBySubject(subjectId) {
  if (!subjectId || subjectId === 'all') return csatTaxonomyData.frequencies;
  return csatTaxonomyData.frequencies.filter((f) => f.subjectId === subjectId);
}

/**
 * Returns 72 detailed question types filtered by subject and optionally major unit
 */
export function getDetailedTypes(subjectId = 'all', majorUnit = null) {
  return csatTaxonomyData.detailedTypes.filter((t) => {
    if (subjectId !== 'all' && t.subjectId !== subjectId) return false;
    if (majorUnit && !t.majorUnit.includes(majorUnit)) return false;
    return true;
  });
}

/**
 * Returns high-difficulty representative case study items (2024~2026)
 */
export function getHighDifficultyCases(filter = {}) {
  return csatTaxonomyData.highDifficultyCases.filter((c) => {
    if (filter.subjectId && c.subjectId !== filter.subjectId) return false;
    if (filter.year && c.year !== Number(filter.year)) return false;
    if (filter.section && c.section !== filter.section) return false;
    return true;
  });
}

/**
 * Returns difficulty and accuracy rate criteria
 */
export function getDifficultyCriteria() {
  return csatTaxonomyData.difficultyCriteria;
}

/**
 * Returns this year's predicted question distribution and core forecast archetypes
 */
export function getPredictedDistribution(targetYear = 2026) {
  const commonSubjects = [
    {
      subjectId: 'math1',
      subjectName: '수학Ⅰ',
      totalProblems: 11,
      units: [
        { majorUnit: '지수함수와 로그함수', expectedCount: 4, appearanceRate: '100%', keyPoints: '지수법칙, 지수로그 그래프 교점·거리·넓이, 방정식·부등식' },
        { majorUnit: '삼각함수', expectedCount: 3, appearanceRate: '100%', keyPoints: '삼각함수 그래프·주기성, 사인법칙·코사인법칙 도형 복합' },
        { majorUnit: '수열', expectedCount: 4, appearanceRate: '100%', keyPoints: '등차·등비수열 합, 시그마 계산, 귀납적 정의 규칙성 추론(15번 핵심)' },
      ],
    },
    {
      subjectId: 'math2',
      subjectName: '수학Ⅱ',
      totalProblems: 11,
      units: [
        { majorUnit: '함수의 극한과 연속', expectedCount: 2, appearanceRate: '100%', keyPoints: '0/0 꼴 미정계수 결정, 연속성과 사잇값 정리, 극한 존재 조건' },
        { majorUnit: '다항함수의 미분', expectedCount: 5, appearanceRate: '100%', keyPoints: '접선의 방정식, 삼차·사차함수 그래프 개형 추론(22번 핵심), 도함수 부호와 극값' },
        { majorUnit: '다항함수의 적분', expectedCount: 4, appearanceRate: '100%', keyPoints: '정적분 계산, 정적분으로 정의된 함수, 곡선 사이의 넓이와 역함수 적분' },
      ],
    },
  ];

  const electiveSubjects = [
    {
      subjectId: 'prob-stats',
      subjectName: '확률과 통계',
      totalProblems: 8,
      units: [
        { majorUnit: '경우의 수', expectedCount: 2, keyPoints: '중복순열, 같은 것이 있는 순열, 중복조합(H)과 방정식 정수해' },
        { majorUnit: '확률', expectedCount: 3, keyPoints: '조건부확률, 독립과 종속, 독립시행의 확률' },
        { majorUnit: '통계', expectedCount: 3, keyPoints: '이산확률변수 평균·분산, 이항분포, 정규분포 표준화 및 모평균 추정(29·30번 핵심)' },
      ],
    },
    {
      subjectId: 'calculus',
      subjectName: '미적분',
      totalProblems: 8,
      units: [
        { majorUnit: '수열의 극한', expectedCount: 2, keyPoints: '등비수열의 극한, 급수의 수렴·발산, 등비급수 도형 활용' },
        { majorUnit: '미분법', expectedCount: 2, keyPoints: '지수·로그·삼각함수 미분, 합성함수·역함수 미분, 극대·극소와 변곡점(30번 핵심)' },
        { majorUnit: '적분법', expectedCount: 4, keyPoints: '치환적분법, 부분적분법, 정적분과 급수, 입체도형 부피' },
      ],
    },
    {
      subjectId: 'geometry',
      subjectName: '기하',
      totalProblems: 8,
      units: [
        { majorUnit: '이차곡선', expectedCount: 3, keyPoints: '포물선·타원·쌍곡선 정의와 초점, 접선의 방정식(29번 핵심)' },
        { majorUnit: '평면벡터', expectedCount: 2, keyPoints: '벡터 연산, 위치벡터, 벡터의 내적과 기하학적 최적화(30번 핵심)' },
        { majorUnit: '공간도형과 공간좌표', expectedCount: 3, keyPoints: '삼수선 정리, 이면각과 정사영, 구의 방정식과 점과 평면 사이 거리' },
      ],
    },
  ];

  const highDiscriminatorPredictions = [
    {
      targetNumber: '공통 15번 (객관식 킬러/준킬러)',
      subject: '수학Ⅰ (수열)',
      detailedType: '귀납적 정의·규칙성 추론 & 경우분류',
      forecastRatio: '출제 확률 99%',
      coreIdea: 'a_{n+1}이 조건에 따라 나뉘는 점화식에서 역방향 추적 또는 첫째항 a_1의 후보를 정수 조건으로 분류하여 모든 가능한 값의 합을 구함.',
      traps: '분류된 경우 중 모순(정수 조건 위배 등)이 생기는 케이스를 놓치거나 계산 누락.',
      recentCases: '2024 수능 15번, 2025 수능 22번',
    },
    {
      targetNumber: '공통 21번 (단답형 준킬러)',
      subject: '수학Ⅰ (지수·로그 / 삼각함수)',
      detailedType: '지수·로그 그래프 교점·기하량 또는 사인·코사인 복합',
      forecastRatio: '출제 확률 95%',
      coreIdea: '지수·로그 곡선과 직선(기울기 -1 또는 1)의 교점 대칭성을 이용해 길이·넓이 관계식을 세워 밑과 미정계수 결정.',
      traps: '역함수 대칭축(y=x)과 평행이동량의 불일치 시 좌표 계산 착오.',
      recentCases: '2026 수능 22번 (지수로그 교점·로그식 최상위 변별), 2025 수능 21번',
    },
    {
      targetNumber: '공통 22번 (단답형 최고 변별 문항)',
      subject: '수학Ⅱ (다항함수의 미분과 적분)',
      detailedType: '삼차함수 도함수 부호 추론 & 절댓값/극값 조건 함수 복원',
      forecastRatio: '출제 확률 98%',
      coreIdea: '조건 f\'(x) 또는 |f(x)-t|의 미분가능성/극값 조건을 통해 삼차함수 최고차항 부호와 접점 위치를 단계별로 압축.',
      traps: '접하는 경우 이외에 변곡점 또는 교점에서의 기울기 부호 역전 케이스 간과.',
      recentCases: '2024 수능 22번, 2025 수능 21·22번',
    },
    {
      targetNumber: '선택 30번 (확률과 통계)',
      subject: '확률과 통계 (통계 / 확률)',
      detailedType: '정규분포 표준화 연립 역추론 또는 복합 조건부확률',
      forecastRatio: '출제 확률 92%',
      coreIdea: '두 확률변수 X, Y의 평균과 분산이 다를 때, 대칭성과 표준화 z-score의 비례 관계를 연립하여 미지수 결정.',
      traps: 'P(X <= a) = P(Y >= b)에서 대칭 중심 부호 반전 누락.',
      recentCases: '2024 수능 30번, 2025 수능 29번',
    },
    {
      targetNumber: '선택 30번 (미적분)',
      subject: '미적분 (미분법 & 적분법)',
      detailedType: '합성함수·초월함수 미분과 극대·극소 조건 & 정적분 결합',
      forecastRatio: '출제 확률 96%',
      coreIdea: '겉함수와 속함수의 도함수 연쇄법칙으로 극값 후보를 구하고, 주기성과 점근선을 종합해 그래프 개형 결정.',
      traps: '속함수의 치역이 겉함수의 정의역으로 제한되는 범위 조건 미고려.',
      recentCases: '2024 수능 30번, 2025 수능 30번',
    },
    {
      targetNumber: '선택 30번 (기하)',
      subject: '기하 (평면벡터 & 공간도형)',
      detailedType: '벡터 내적의 기하적 최적화(자취) & 삼수선 정리',
      forecastRatio: '출제 확률 94%',
      coreIdea: '중점 또는 원 중심을 시점으로 벡터를 분해(OA = OC + CA)하여 상수 항과 변수 항의 방향 일치로 최댓값/최솟값 유도.',
      traps: '동점이 원주 위를 움직일 때 반지름과 중심 거리의 삼각부등식 범위 오판.',
      recentCases: '2025 수능 30번, 2026 수능 30번',
    },
  ];

  return {
    targetYear,
    commonSubjects,
    electiveSubjects,
    highDiscriminatorPredictions,
    summary: {
      totalCommon: 22,
      totalElective: 8,
      grandTotal: 30,
      totalPoints: 100,
    },
  };
}
