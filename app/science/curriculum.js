// International-school science (G1–G6) detailed curriculum.
// Topic scope follows the common core of NGSS / Cambridge Primary / IB PYP science,
// grouped into four strands. Each unit has two upload slots: textbook (tb) and workbook (wb).
// Board category for a slot: `science-${unit.id}-${kind}` (validated server-side by SCIENCE_CATEGORY_RE).
// To add/rename a unit, edit this file only — IDs must stay stable once files are uploaded.

export const SCIENCE_STRANDS = [
  { id: 'life', icon: '🌱', ko: '생명과학', en: 'Life Science' },
  { id: 'physical', icon: '⚡', ko: '물질·에너지(물리/화학)', en: 'Physical Science' },
  { id: 'earth', icon: '🌍', ko: '지구·우주과학', en: 'Earth & Space Science' },
  { id: 'inquiry', icon: '🔬', ko: '과학적 탐구', en: 'Scientific Inquiry' },
  { id: 'misc', icon: '📂', ko: '미분류', en: 'Unsorted' },
];

export const SCIENCE_KINDS = [
  { id: 'tb', icon: '📘', ko: '교과서 (Textbook)', en: 'Textbook' },
  { id: 'wb', icon: '📝', ko: '워크북·학습지 (Workbook)', en: 'Workbook / Worksheets' },
];

const U = (grade, slug, strand, ko, en, topicsKo) => ({ id: `g${grade}-${slug}`, grade, strand, ko, en, topicsKo });

export const SCIENCE_UNITS = [
  // ── G1
  U(1, 'plants', 'life', '식물과 식물이 필요한 것', 'Plants and Their Needs', '식물의 종류, 물·공기·빛·공간, 뿌리·줄기·잎·꽃'),
  U(1, 'animals', 'life', '동물과 동물이 필요한 것', 'Animals and Their Needs', '포유류·조류·파충류·곤충·어류, 먹이와 몸의 구조'),
  U(1, 'habitats', 'life', '서식지: 식물과 동물이 함께 사는 곳', 'Habitats: Plants and Animals Together', '초원·숲·연못·바다, 서로 돕는 생물'),
  U(1, 'body-senses', 'life', '우리 몸과 오감', 'My Body and Senses', '신체 부위, 다섯 가지 감각'),
  U(1, 'weather', 'earth', '날씨', 'Weather', '날씨 표현, 해의 따뜻함, 날씨 측정 도구'),
  U(1, 'seasons', 'earth', '계절', 'Seasons', '겨울·봄·여름·가을의 날씨와 햇빛, 동식물의 변화'),
  U(1, 'materials', 'physical', '고체·액체·기체', 'Solids, Liquids and Gases', '물질 설명하기, 질량, 고체/액체/기체의 성질'),
  U(1, 'light-sound', 'physical', '빛과 소리', 'Light and Sound', '광원, 그림자, 소리의 발생'),
  // ── G2
  U(2, 'plant-life', 'life', '식물의 한살이', 'Plant Life Cycles', '뿌리·줄기·잎, 꽃·열매·씨앗, 씨앗의 이동, 식물의 한살이와 적응'),
  U(2, 'animal-life', 'life', '동물의 한살이', 'Animal Life Cycles', '동물 분류, 포유류, 알에서 태어나는 동물, 동물의 생김새와 행동'),
  U(2, 'habitats', 'life', '서식지와 생물', 'Habitats and Living Things', '서식지 종류, 환경에 적응한 생물'),
  U(2, 'food-health', 'life', '음식과 건강한 몸', 'Food and Staying Healthy', '식품군, 운동, 위생'),
  U(2, 'matter', 'physical', '물질의 상태와 변화', 'States of Matter and Changes', '고체·액체·기체의 변화: 가열, 냉각, 섞기'),
  U(2, 'forces-motion', 'physical', '위치·운동·힘', 'Position, Motion and Forces', '위치, 거리, 빠르기, 밀기와 당기기, 마찰'),
  U(2, 'rocks-soil', 'earth', '암석과 흙', 'Rocks and Soil', '암석의 성질, 광물, 풍화, 흙의 구성'),
  U(2, 'resources', 'earth', '지구의 자원', "Earth's Natural Resources", '암석·흙·물·바람, 식물과 동물 자원, 연료, 태양 에너지'),
  U(2, 'water', 'earth', '물과 물의 순환', 'Water and the Water Cycle', '물의 이용, 증발·응결·강수'),
  // ── G3
  U(3, 'life-cycles-traits', 'life', '한살이와 유전 형질', 'Life Cycles and Traits', '생물의 한살이, 부모를 닮는 형질, 환경의 영향'),
  U(3, 'habitats-survival', 'life', '환경과 생존', 'Environments and Survival', '집단 생활, 적응, 서식지 변화'),
  U(3, 'fossils', 'life', '화석과 과거의 생물', 'Fossils and Past Life', '화석의 형성, 과거 환경 추론'),
  U(3, 'forces-magnets', 'physical', '힘과 자석', 'Forces and Magnets', '균형·불균형한 힘, 자석의 성질'),
  U(3, 'light-shadows', 'physical', '빛과 그림자', 'Light and Shadows', '빛의 직진, 반사, 그림자'),
  U(3, 'weather-climate', 'earth', '날씨와 기후', 'Weather and Climate', '날씨 측정, 기후 패턴, 자연재해'),
  U(3, 'inquiry-skills', 'inquiry', '과학 탐구 기초', 'Science Skills and Measurement', '관찰·측정·기록, 공정한 실험'),
  // ── G4
  U(4, 'food-chains', 'life', '먹이 사슬과 먹이 그물', 'Food Chains and Food Webs', '생산자·소비자·분해자'),
  U(4, 'structure-function', 'life', '생물의 구조와 기능', 'Structures and Functions', '동식물의 구조와 생존, 감각 기관과 정보 처리'),
  U(4, 'matter-changes', 'physical', '물질의 상태와 변화', 'States of Matter and Changes', '녹음·얼음·끓음·증발, 가역/비가역 변화'),
  U(4, 'energy', 'physical', '에너지의 전환', 'Energy and Its Transfer', '열·빛·소리·전기 에너지, 에너지 전환'),
  U(4, 'electricity', 'physical', '전기 회로', 'Electricity and Circuits', '전지·전구·스위치, 도체와 절연체'),
  U(4, 'waves', 'physical', '파동·소리·빛', 'Waves, Sound and Light', '진동과 소리의 높낮이, 빛의 반사·굴절'),
  U(4, 'earth-changes', 'earth', '지표의 변화', "Changes to Earth's Surface", '풍화·침식·퇴적, 지진·화산'),
  U(4, 'inquiry-skills', 'inquiry', '과학 탐구 방법', 'Investigations and Data', '가설 설정, 변인 통제, 그래프'),
  // ── G5
  U(5, 'human-body', 'life', '인체의 기관계', 'Human Body Systems', '소화·순환·호흡·배설'),
  U(5, 'plants-energy', 'life', '식물과 에너지 (광합성)', 'Plants and Energy: Photosynthesis', '광합성, 에너지의 흐름'),
  U(5, 'ecosystems', 'life', '생태계와 물질 순환', 'Ecosystems and Matter Cycling', '생태계 구성 요소, 환경 변화의 영향'),
  U(5, 'matter-properties', 'physical', '물질의 성질과 보존', 'Properties and Conservation of Matter', '입자 모형, 질량 보존, 성질로 분류'),
  U(5, 'mixtures-solutions', 'physical', '혼합물과 용액', 'Mixtures and Solutions', '혼합물 분리, 용해, 용액'),
  U(5, 'forces-gravity', 'physical', '중력과 힘', 'Gravity and Forces', '중력, 마찰, 단순 기계'),
  U(5, 'earth-systems', 'earth', '지구의 시스템', "Earth's Systems", '지권·수권·기권·생물권, 물의 분포'),
  U(5, 'space-systems', 'earth', '태양·지구·달', 'Sun, Earth and Moon', '자전과 공전, 달의 위상, 별의 밝기'),
  // ── G6
  U(6, 'cells', 'life', '세포', 'Cells', '세포의 구조, 동식물 세포, 현미경'),
  U(6, 'body-systems', 'life', '생물의 몸과 기관계', 'Organisms and Body Systems', '조직·기관·기관계, 항상성'),
  U(6, 'heredity-evolution', 'life', '유전과 진화 기초', 'Heredity and Natural Selection', '유전 형질, 변이, 자연선택'),
  U(6, 'atoms-elements', 'physical', '원자·원소·화합물', 'Atoms, Elements and Compounds', '원자 모형, 주기율표 맛보기'),
  U(6, 'chemical-changes', 'physical', '화학 변화', 'Chemical Reactions', '물리/화학 변화, 반응물과 생성물'),
  U(6, 'heat-energy', 'physical', '열과 에너지 전달', 'Heat and Energy Transfer', '전도·대류·복사, 운동·위치 에너지'),
  U(6, 'earth-structure', 'earth', '지구 내부와 판 구조', "Earth's Structure and Plate Tectonics", '지각 변동, 지진·화산, 암석 순환'),
  U(6, 'weather-solar', 'earth', '기상과 태양계', 'Weather Systems and the Solar System', '기단·기압, 행성과 태양계'),
  U(6, 'inquiry-skills', 'inquiry', '탐구 설계와 보고서', 'Experimental Design and Reporting', '실험 설계, 자료 분석, 결론 도출'),
];

// Per-grade catch-all so a file can be stored before its unit is decided.
for (let g = 1; g <= 6; g += 1) {
  SCIENCE_UNITS.push({ id: `g${g}-misc`, grade: g, strand: 'misc', ko: '미분류 / 종합', en: 'Unsorted / General', topicsKo: '단원 배치 전 자료, 종합 평가' });
}

export const SCIENCE_GRADES = [1, 2, 3, 4, 5, 6];

export const unitsOfGrade = (grade) => SCIENCE_UNITS.filter((u) => u.grade === Number(grade));
export const unitById = (id) => SCIENCE_UNITS.find((u) => u.id === id);
export const scienceCategory = (unitId, kind) => `science-${unitId}-${kind}`;
