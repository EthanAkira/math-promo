// International-school MIDDLE SCHOOL science (G7–G9) unit map.
// Structure follows the Cambridge Lower Secondary Science framework (Stage 7–9): the strands
// Biology, Chemistry, Physics, Earth & Space, Thinking & Working Scientifically and Science in Context.
// Each unit has two upload slots — textbook (tb) and workbook (wb) — stored through the shared
// board API under the category `science-${unit.id}-${kind}` (validated server-side, grades g1–g9).
// Study notes / worksheets are NOT written yet; this file is only the shell. IDs must stay stable
// once files are uploaded.

export const MIDDLE_GRADES = [7, 8, 9];

export const MIDDLE_STRANDS = [
  { id: 'biology', icon: '🧬', ko: '생물', en: 'Biology' },
  { id: 'chemistry', icon: '🧪', ko: '화학', en: 'Chemistry' },
  { id: 'physics', icon: '⚡', ko: '물리', en: 'Physics' },
  { id: 'earth', icon: '🌍', ko: '지구·우주', en: 'Earth & Space' },
  { id: 'inquiry', icon: '🔬', ko: '과학적 사고·탐구', en: 'Thinking & Working Scientifically' },
  { id: 'context', icon: '🌐', ko: '과학과 사회(맥락)', en: 'Science in Context' },
  { id: 'misc', icon: '📂', ko: '미분류', en: 'Unsorted' },
];

export const MIDDLE_KINDS = [
  { id: 'tb', icon: '📘', ko: '교과서 (Textbook)', en: 'Textbook' },
  { id: 'wb', icon: '📝', ko: '워크북·학습지 (Workbook)', en: 'Workbook / Worksheets' },
];

const U = (grade, slug, strand, ko, en, topicsKo) => ({ id: `g${grade}-${slug}`, grade, strand, ko, en, topicsKo });

export const MIDDLE_UNITS = [
  // ── G7 (Stage 7)
  U(7, 'cells-organisms', 'biology', '세포와 생물체', 'Cells and Organisms', '세포 구조, 조직·기관·기관계, 현미경, 단세포·다세포 생물'),
  U(7, 'plants-humans', 'biology', '식물과 사람의 생명 활동', 'Plants and Humans as Organisms', '광합성, 소화, 호흡, 영양소, 식물의 구조'),
  U(7, 'ecosystems', 'biology', '생태계와 환경', 'Ecosystems and Environment', '먹이 그물, 서식지와 적응, 인간의 영향'),
  U(7, 'classification-variation', 'biology', '분류와 변이', 'Classification and Variation', '분류 체계, 이분 검색표, 개체 간 변이'),
  U(7, 'particles-states', 'chemistry', '입자 모형과 물질의 상태', 'Particle Model and States of Matter', '고체·액체·기체, 상태 변화, 확산'),
  U(7, 'elements-compounds', 'chemistry', '원소·화합물·혼합물', 'Elements, Compounds and Mixtures', '원자와 분자, 순물질과 혼합물, 분리 방법'),
  U(7, 'material-changes', 'chemistry', '물질의 변화', 'Material Changes', '물리 변화와 화학 변화, 연소, 산과 알칼리 입문'),
  U(7, 'forces-motion', 'physics', '힘과 운동', 'Forces and Motion', '힘의 종류, 속력, 중력, 마찰, 힘의 표현'),
  U(7, 'energy', 'physics', '에너지', 'Energy', '에너지의 형태와 전환, 열의 이동, 에너지 자원'),
  U(7, 'sound-light', 'physics', '소리와 빛', 'Sound and Light', '소리의 발생과 전달, 빛의 반사·굴절'),
  U(7, 'earth-rocks', 'earth', '지구의 구조와 암석', "Earth's Structure and Rocks", '지구 내부, 암석의 순환, 풍화와 침식'),
  U(7, 'earth-sun-moon', 'earth', '지구·태양·달과 태양계', 'Earth, Sun, Moon and the Solar System', '자전과 공전, 계절, 달의 위상, 태양계'),
  U(7, 'working-scientifically', 'inquiry', '과학적 사고와 탐구', 'Thinking and Working Scientifically', '질문과 가설, 변인 통제, 자료 기록·분석, 결론'),
  U(7, 'science-in-context', 'context', '과학과 사회', 'Science in Context', '과학자의 일, 과학과 기술, 과학이 사회에 미치는 영향'),
  // ── G8 (Stage 8)
  U(8, 'photosynthesis-respiration', 'biology', '광합성과 호흡', 'Photosynthesis and Respiration', '광합성과 세포 호흡, 기체 교환, 에너지'),
  U(8, 'reproduction-growth', 'biology', '생식과 성장', 'Reproduction and Growth', '식물과 사람의 생식, 사춘기, 임신과 발생'),
  U(8, 'inheritance', 'biology', '유전', 'Inheritance and Variation', 'DNA와 유전자, 형질의 유전, 변이의 원인'),
  U(8, 'ecology-cycles', 'biology', '생태와 물질 순환', 'Ecology and Cycles', '탄소·물 순환, 먹이 사슬과 에너지, 환경 변화'),
  U(8, 'periodic-table', 'chemistry', '주기율표', 'The Periodic Table', '원자 구조, 금속과 비금속, 주기율표의 규칙성'),
  U(8, 'chemical-reactions', 'chemistry', '화학 반응', 'Chemical Reactions', '반응물과 생성물, 단어 반응식, 질량 보존, 연소'),
  U(8, 'acids-alkalis', 'chemistry', '산과 알칼리', 'Acids, Alkalis and Reactivity', 'pH, 중화 반응, 금속의 반응성'),
  U(8, 'electricity-magnetism', 'physics', '전기와 자기', 'Electricity and Magnetism', '전류·전압·저항, 회로, 자석과 전자석'),
  U(8, 'thermal-physics', 'physics', '열과 온도', 'Thermal Physics', '온도와 열, 전도·대류·복사, 열팽창'),
  U(8, 'forces-pressure', 'physics', '힘과 압력', 'Forces and Pressure', '압력, 부력, 알짜힘, 속도-시간 그래프'),
  U(8, 'light-optics', 'physics', '빛과 광학', 'Light and Optics', '반사 법칙, 굴절, 렌즈, 색'),
  U(8, 'atmosphere-climate', 'earth', '대기와 기후 변화', 'Atmosphere and Climate Change', '대기의 구성, 온실 효과, 기후 변화'),
  U(8, 'rocks-soil-resources', 'earth', '암석·토양과 자원', 'Rocks, Soil and Resources', '암석의 종류, 토양, 재생·비재생 자원'),
  U(8, 'working-scientifically', 'inquiry', '과학적 사고와 탐구', 'Thinking and Working Scientifically', '실험 설계, 자료 분석, 그래프, 오차와 신뢰도'),
  U(8, 'science-in-context', 'context', '과학과 사회', 'Science in Context', '과학적 논쟁, 기술 발전, 지속 가능성'),
  // ── G9 (Stage 9)
  U(9, 'human-health', 'biology', '사람의 건강과 몸', 'Human Body Systems and Health', '소화·순환·호흡, 질병과 면역, 건강한 생활'),
  U(9, 'evolution', 'biology', '진화와 자연선택', 'Evolution and Natural Selection', '변이와 자연선택, 화석 증거, 멸종'),
  U(9, 'genes-biotech', 'biology', '유전자와 생명공학', 'Genes and Biotechnology', '선택 교배, 유전 공학, 생명 윤리'),
  U(9, 'sustainability', 'biology', '생태계와 지속 가능성', 'Ecosystems and Sustainability', '개체군, 생물 다양성, 인간 활동과 보전'),
  U(9, 'atomic-bonding', 'chemistry', '원자 구조와 화학 결합', 'Atomic Structure and Bonding', '원자 모형, 이온 결합, 공유 결합, 물질의 성질'),
  U(9, 'reaction-rates', 'chemistry', '반응 속도와 에너지', 'Rates of Reaction and Energy Changes', '반응 속도에 영향을 주는 요인, 발열·흡열 반응'),
  U(9, 'carbon-materials', 'chemistry', '탄소 화합물과 재료', 'Carbon Compounds and Materials', '연료, 고분자, 재활용과 물질 순환'),
  U(9, 'motion-forces', 'physics', '운동과 힘', 'Motion and Forces', '속력·가속도, 뉴턴의 운동 법칙, 운동량 입문'),
  U(9, 'energy-resources', 'physics', '에너지와 전력', 'Energy, Work and Power', '일과 에너지, 효율, 전력, 에너지 자원'),
  U(9, 'waves-em', 'physics', '파동과 전자기파', 'Waves and the Electromagnetic Spectrum', '파동의 성질, 소리, 전자기파 스펙트럼'),
  U(9, 'electromagnetism', 'physics', '전자기와 회로', 'Electromagnetism and Circuits', '직렬·병렬 회로, 전자기 유도, 발전기와 변압기'),
  U(9, 'plate-tectonics', 'earth', '판 구조론', 'Plate Tectonics', '판의 경계, 지진과 화산, 지각 변동'),
  U(9, 'space-universe', 'earth', '우주와 별', 'Space and the Universe', '별의 일생, 은하, 우주의 크기와 탐사'),
  U(9, 'earth-resources', 'earth', '지구의 자원과 환경', "Earth's Resources and the Environment", '자원 이용, 오염, 지속 가능한 발전'),
  U(9, 'working-scientifically', 'inquiry', '과학적 사고와 탐구', 'Thinking and Working Scientifically', '가설 검증, 변인 통제, 자료 평가, 보고서 작성'),
  U(9, 'science-in-context', 'context', '과학과 사회', 'Science in Context', '과학과 윤리, 과학 직업, 사회적 쟁점'),
];

// Per-grade catch-all so a file can be stored before its unit is decided.
MIDDLE_GRADES.forEach((g) => {
  MIDDLE_UNITS.push({ id: `g${g}-misc`, grade: g, strand: 'misc', ko: '미분류 / 종합', en: 'Unsorted / General', topicsKo: '단원 배치 전 자료, 종합 평가' });
});

export const middleUnitsOfGrade = (grade) => MIDDLE_UNITS.filter((u) => u.grade === Number(grade));
export const middleUnitById = (id) => MIDDLE_UNITS.find((u) => u.id === id);
export const middleCategory = (unitId, kind) => `science-${unitId}-${kind}`;
