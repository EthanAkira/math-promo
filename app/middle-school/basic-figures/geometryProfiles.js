export const GEOMETRY_PROFILES = [
  {
    id: 'kr', locale: 'ko', label: '한국 교육과정', shortLabel: '한국',
    description: '중학교 내신형 · 개념 확인과 단계별 계산',
    difficulty: 2, choiceCount: 4, angleSymbol: '°', vocabulary: { alternate: '엇각', corresponding: '동위각', sameSide: '동측내각' },
  },
  {
    id: 'international', locale: 'en', label: 'International School', shortLabel: 'International',
    description: '국제학교(AP·IB·Cambridge 등 공통) 영어 수학 용어와 추론형 문항',
    difficulty: 3, choiceCount: 4, angleSymbol: '°', vocabulary: { alternate: 'alternate angles', corresponding: 'corresponding angles', sameSide: 'co-interior angles' },
  },
  {
    id: 'amc', locale: 'en', label: 'AMC', shortLabel: 'AMC',
    description: 'AMC 8 입문 수준 · 짧은 조건에서 여러 관계를 결합하는 객관식',
    difficulty: 4, choiceCount: 5, angleSymbol: '°', vocabulary: { alternate: 'alternate interior angles', corresponding: 'corresponding angles', sameSide: 'same-side interior angles' },
  },
  {
    id: 'sg', locale: 'en-SG', label: 'Singapore', shortLabel: 'Singapore',
    description: 'Singapore Secondary · 정확한 수학 용어와 단계적 문제 해결',
    difficulty: 3, choiceCount: 4, angleSymbol: '°', vocabulary: { alternate: 'alternate angles', corresponding: 'corresponding angles', sameSide: 'interior angles on the same side' },
  },
  {
    id: 'tw', locale: 'zh-TW', label: '臺灣', shortLabel: '臺灣',
    description: '臺灣國中課程 · 基本幾何、平行線與空間關係',
    difficulty: 3, choiceCount: 4, angleSymbol: '°', vocabulary: { alternate: '內錯角', corresponding: '同位角', sameSide: '同側內角' },
  },
  {
    id: 'hk', locale: 'zh-HK', label: '香港', shortLabel: '香港',
    description: '香港初中課程 · 基礎幾何、平行線及空間關係',
    difficulty: 3, choiceCount: 4, angleSymbol: '°', vocabulary: { alternate: '內錯角', corresponding: '同位角', sameSide: '同旁內角' },
  },
  {
    id: 'g12', locale: 'en', label: 'AP Precalculus & Calculus', shortLabel: 'AP',
    description: 'AP-style Grade 12 · trigonometry, conics, vectors, 3D geometry, calculus and statistics',
    difficulty: 5, choiceCount: 4, angleSymbol: '°', vocabulary: { alternate: 'alternate interior angles', corresponding: 'corresponding angles', sameSide: 'same-side interior angles' },
  },
  {
    id: 'ib', locale: 'en', label: 'IB Mathematics AA', shortLabel: 'IB AA',
    description: 'IB AA · non-right triangle trigonometry, vectors, calculus and data visualisation',
    difficulty: 5, choiceCount: 4, angleSymbol: '°', vocabulary: { alternate: 'alternate angles', corresponding: 'corresponding angles', sameSide: 'co-interior angles' },
  },
  {
    id: 'amc12', locale: 'en', label: 'AMC 12', shortLabel: 'AMC12',
    description: 'AMC 12 · advanced Euclidean, circle, coordinate and vector geometry without calculus',
    difficulty: 6, choiceCount: 5, angleSymbol: '°', vocabulary: { alternate: 'alternate interior angles', corresponding: 'corresponding angles', sameSide: 'same-side interior angles' },
  },
  {
    id: 'csat', locale: 'ko', label: '수능 기하', shortLabel: '수능 기하',
    description: '이차곡선·평면벡터·공간도형·공간좌표·정사영 중심',
    difficulty: 6, choiceCount: 5, angleSymbol: '°', vocabulary: { alternate: '엇각', corresponding: '동위각', sameSide: '동측내각' },
  },
];

export function findGeometryProfile(profileId) {
  return GEOMETRY_PROFILES.find((profile) => profile.id === profileId) || GEOMETRY_PROFILES[0];
}

export function profileText(profile, values) {
  return values[profile.locale] || values[profile.locale?.split('-')[0]] || values.en || values.ko;
}
