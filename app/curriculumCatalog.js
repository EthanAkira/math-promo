/**
 * 2022 개정 수학 교육과정 및 국제학교 과정 통합 카탈로그 데이터
 * PRD: 2022 개정 수학 교육과정 카테고리 재구성 (PRD_2022개정_수학교육과정_카테고리.md)
 */

export const CURRICULUM_COPY = {
  ko: {
    eyebrow: 'CURRICULUM MAP',
    title: '어떤 순서로 수학을 찾아볼까요?',
    description: '한국 교육과정(학년별/2022 개정 과목별), 국제학교 과정, 수학 영역별의 관점으로 체계적으로 탐색할 수 있습니다.',
    mainTabs: ['한국 교육과정', '국제학교 과정', '수학 영역별'],
    mainTabHelp: ['초1~고3 학년별 및 2022 개정 과목별', 'Pre-Algebra · Algebra 1·2 · Precalculus', '수와 연산, 대수, 기하, 확률·통계 등 개념 지도'],
    subViews: {
      byGrade: '학년별 보기 · 기존 분류',
      bySubject2022: '2022 개정 과목별 보기',
    },
    schoolLevels: {
      elementary: '초등학교',
      middle: '중학교',
      high: '고등학교',
    },
    officialTypes: {
      common: '공통 과목',
      'general-elective': '일반 선택',
      'career-elective': '진로 선택',
      'convergence-elective': '융합 선택',
      professional: '전문·심화 과목',
    },
    badges: {
      ready: '연습 가능',
      partial: '일부 가능',
      planned: '준비 중',
      open: '단원 펼쳐보기',
    },
    notices: {
      gradeLegacyNotice: '2022 개정은 2025학년도 고1부터 연차 적용됩니다. 2027학년도 수능(2026년 11월 시행)까지는 고1·고2와 고3이 서로 다른 교육과정을 쓰는 과도기라, 학년마다 아래 과목명이 다릅니다 — 각 학년 카드 안내문을 확인하세요.',
      subject2022Notice: '2022 개정 교육과정이 완전히 적용된 뒤의 공식 과목 체계(공통·일반 선택·진로 선택·융합 선택·전문)입니다. 2027학년도 수능까지는 현재 고3에게 아직 적용되지 않으며, 고3의 실제 응시 과목명은 "학년별 보기"에서 확인하세요.',
      intlNotice: '국제학교 및 해외 교육과정(Pre-Algebra, Algebra 1·2, Precalculus 등)의 독립 과정입니다. 한국 교육과정과 별도로 관리됩니다.',
      domainNotice: '학년과 교육과정을 넘어 수와 연산, 변화와 관계, 도형과 측정, 자료와 가능성 등의 수학 핵심 개념별로 탐색합니다.',
      bottomNote: '표시된 학년·과목은 탐색을 위한 대표 경로이며, 학교와 국가에 따라 단원 순서가 달라질 수 있습니다.',
    },
    labels: {
      revised2022: '2022 개정 대응',
      legacyName: '예전 분류',
      officialType: '공식 구분',
      targetGrade: '대표 학년',
      topicsCount: '{count}개 단원',
    },
  },
  en: {
    eyebrow: 'CURRICULUM MAP',
    title: 'Choose how you want to explore math',
    description: 'Browse by Korean curriculum (grades / 2022 subjects), international course sequence, or mathematical domain.',
    mainTabs: ['Korean Curriculum', 'Course Sequence', 'Math Domains'],
    mainTabHelp: ['Grades 1–12 & 2022 Revised Subjects', 'Pre-Algebra, Algebra 1–2, Precalculus', 'Concept strands across systems'],
    subViews: {
      byGrade: 'By Grade · Classic Names',
      bySubject2022: '2022 Revised Subjects',
    },
    schoolLevels: {
      elementary: 'Elementary School',
      middle: 'Middle School',
      high: 'High School',
    },
    officialTypes: {
      common: 'Common Subjects',
      'general-elective': 'General Electives',
      'career-elective': 'Career Electives',
      'convergence-elective': 'Convergence Electives',
      professional: 'Advanced & Specialized',
    },
    badges: {
      ready: 'Practice now',
      partial: 'Partial coverage',
      planned: 'Coming soon',
      open: 'Open topics',
    },
    notices: {
      gradeLegacyNotice: 'The 2022 revision phases in starting with students who entered grade 10 in the 2025 school year. Until the CSAT for the 2027 admission cycle (held Nov 2026), grade 10-11 and grade 12 students are on different curricula, so subject names differ by grade below — check each grade card’s note.',
      subject2022Notice: 'This is the official subject structure once the 2022 revision is fully in effect (Common / General Elective / Career Elective / Convergence / Advanced). It does not yet apply to today’s actual grade-12 students until the CSAT for the 2027 admission cycle — see "By Grade" for what grade 12 currently sits.',
      intlNotice: 'Independent progression for international school programs (Pre-Algebra, Algebra 1–2, Precalculus). Managed separately from national curricula.',
      domainNotice: 'Explore core mathematical concepts across grades: Number & Operations, Algebra, Geometry, Data & Probability.',
      bottomNote: 'These are reference pathways. Exact topic sequences vary by school, country, and syllabus.',
    },
    labels: {
      revised2022: '2022 Equivalent',
      legacyName: 'Classic Name',
      officialType: 'Official Track',
      targetGrade: 'Typical Grade',
      topicsCount: '{count} topics',
    },
  },
  'en-SG': {
    eyebrow: 'CURRICULUM MAP',
    title: 'Choose a Mathematics learning pathway',
    description: 'Browse the practice library by Korean levels/2022 subjects, international course sequence, or mathematical strands.',
    mainTabs: ['Korean Curriculum', 'Course Sequence', 'Mathematical Strands'],
    mainTabHelp: ['Primary, Secondary & Junior College', 'Pre-Algebra, Algebra 1–2 & beyond', 'Number, algebra, geometry and data'],
    subViews: {
      byGrade: 'By Level · Classic Tracks',
      bySubject2022: '2022 Revised Subjects',
    },
    schoolLevels: {
      elementary: 'Primary School',
      middle: 'Secondary School',
      high: 'Junior College / High School',
    },
    officialTypes: {
      common: 'Core Subjects',
      'general-elective': 'General Electives',
      'career-elective': 'Applied Electives',
      'convergence-elective': 'Interdisciplinary',
      professional: 'Advanced & Specialist',
    },
    badges: {
      ready: 'Practise now',
      partial: 'Partial coverage',
      planned: 'Coming soon',
      open: 'Open topics',
    },
    notices: {
      gradeLegacyNotice: 'Organised using familiar course names. Official 2022 syllabus titles and school schedules may differ.',
      subject2022Notice: 'Official 2022 Korean Curriculum structure for Core, Elective, Career, and Specialist subjects.',
      intlNotice: 'Independent sequence for international-school curricula (Pre-Algebra, Algebra 1–2, Precalculus).',
      domainNotice: 'Explore mathematical strands across levels: Number, Algebra, Geometry, Probability & Statistics.',
      bottomNote: 'These are reference pathways. Topic order may vary between MOE, international-school and other programmes.',
    },
    labels: {
      revised2022: '2022 Equivalent',
      legacyName: 'Classic Name',
      officialType: 'Official Track',
      targetGrade: 'Typical Level',
      topicsCount: '{count} topics',
    },
  },
  'zh-CN': {
    eyebrow: '课程地图',
    title: '您想按什么顺序学习数学？',
    description: '可按韩国教育课程（年级/2022修订科目）、国际学校课程顺序或数学领域浏览题库。',
    mainTabs: ['韩国教育课程', '国际学校课程', '数学领域'],
    mainTabHelp: ['小学至高中年级与2022新课程', '以预备代数、代数1·2为中心', '数与运算、代数、几何与概率'],
    subViews: {
      byGrade: '按年级 · 传统分类',
      bySubject2022: '2022修订科目分类',
    },
    schoolLevels: {
      elementary: '小学',
      middle: '初中',
      high: '高中',
    },
    officialTypes: {
      common: '必修/公统科目',
      'general-elective': '一般选修',
      'career-elective': '生涯选修',
      'convergence-elective': '融合选修',
      professional: '专业·进阶科目',
    },
    badges: {
      ready: '立即练习',
      partial: '部分可用',
      planned: '即将推出',
      open: '展开单元',
    },
    notices: {
      gradeLegacyNotice: '按熟悉的传统科目分类展示。现行2022修订科目名称及实际开课年级可能因学校安排而异。',
      subject2022Notice: '2022修订课程官方分类体系，涵盖公统、一般选修、生涯选修及融合选修。',
      intlNotice: '国际学校独立课程序列（Pre-Algebra、Algebra 1·2等），与韩国课程独立管理。',
      domainNotice: '跨越年级限制，按数与代数、几何与测量、数据与概率等核心概念学习。',
      bottomNote: '这些是便于浏览的参考路径；具体单元顺序因学校、国家和课程而异。',
    },
    labels: {
      revised2022: '2022对应科目',
      legacyName: '传统名称',
      officialType: '官方类别',
      targetGrade: '代表年级',
      topicsCount: '{count}个单元',
    },
  },
  'zh-HK': {
    eyebrow: '課程地圖',
    title: '選擇你的數學學習路徑',
    description: '可按韓國教育課程（年級/2022修訂科目）、國際學校課程次序或數學範疇瀏覽題庫。',
    mainTabs: ['韓國教育課程', '國際學校課程', '數學範疇'],
    mainTabHelp: ['小學至高中年級與2022新課程', '預備代數、代數1及2等課程', '數與代數、圖形、數據與概率'],
    subViews: {
      byGrade: '按年級 · 傳統分類',
      bySubject2022: '2022修訂科目分類',
    },
    schoolLevels: {
      elementary: '小學',
      middle: '中學',
      high: '高中',
    },
    officialTypes: {
      common: '必修/共通科目',
      'general-elective': '一般選修',
      'career-elective': '生涯選修',
      'convergence-elective': '融合選修',
      professional: '專業·進階科目',
    },
    badges: {
      ready: '立即練習',
      partial: '部分可用',
      planned: '即將推出',
      open: '展開課題',
    },
    notices: {
      gradeLegacyNotice: '按慣常的傳統科目分類呈現。現行2022修訂科目名稱及實際開課年級可能因學校編排而異。',
      subject2022Notice: '2022修訂課程官方分類體系，包含共通、一般選修、生涯選修及融合選修。',
      intlNotice: '國際學校獨立課程序列（Pre-Algebra、Algebra 1·2等），與韓國課程獨立管理。',
      domainNotice: '按數與代數、圖形與測量、數據與概率等核心概念跨年級探索。',
      bottomNote: '此處為方便瀏覽的參考路徑；實際課題次序會因各校課程而異。',
    },
    labels: {
      revised2022: '2022對應科目',
      legacyName: '傳統名稱',
      officialType: '官方類別',
      targetGrade: '代表年級',
      topicsCount: '{count}個課題',
    },
  },
  'zh-TW': {
    eyebrow: '課程地圖',
    title: '選擇你的數學學習路徑',
    description: '可依韓國教育課程（年級/2022課綱科目）、國際學校課程順序或數學領域瀏覽題庫。',
    mainTabs: ['韓國教育課程', '國際學校課程', '數學領域'],
    mainTabHelp: ['國小至高中年級與2022新課綱', '先備代數、代數1與2等課程', '數與量、代數、幾何與資料'],
    subViews: {
      byGrade: '依年級 · 傳統分類',
      bySubject2022: '2022課綱科目分類',
    },
    schoolLevels: {
      elementary: '國小',
      middle: '國中',
      high: '高中',
    },
    officialTypes: {
      common: '部定必修/共通科目',
      'general-elective': '一般選修',
      'career-elective': '生涯選修',
      'convergence-elective': '融合選修',
      professional: '專業·進階科目',
    },
    badges: {
      ready: '立即練習',
      partial: '部分可用',
      planned: '即將推出',
      open: '展開單元',
    },
    notices: {
      gradeLegacyNotice: '依熟悉的傳統科目分類呈現。現行2022課綱科目名稱與實際開設年級可能因學校編排而異。',
      subject2022Notice: '2022新課綱官方分類體系，涵蓋共通、一般選修、生涯選修與融合選修。',
      intlNotice: '國際學校獨立課程順序（Pre-Algebra、Algebra 1·2等），與韓國課綱獨立管理。',
      domainNotice: '跨越年級與體系，依數與量、代數、幾何、機率與統計等概念進行學習。',
      bottomNote: '此處為方便瀏覽的參考路徑；實際單元順序會因各校課程而異。',
    },
    labels: {
      revised2022: '2022對應科目',
      legacyName: '傳統名稱',
      officialType: '官方類別',
      targetGrade: '代表年級',
      topicsCount: '{count}個單元',
    },
  },
  ja: {
    eyebrow: 'カリキュラムマップ',
    title: 'どの順序で数学を探しますか？',
    description: '韓国の教育課程（学年別／2022改訂科目別）、国際課程、数学分野別の観点から探せます。',
    mainTabs: ['韓国の教育課程', '国際科目別', '数学分野別'],
    mainTabHelp: ['小1〜高3学年別および2022改訂科目', 'Pre-Algebra・Algebra 1/2・Precalculus', '数と計算、代数、幾何、確率統計など'],
    subViews: {
      byGrade: '学年別 · 従来分類',
      bySubject2022: '2022改訂科目別',
    },
    schoolLevels: {
      elementary: '小学校',
      middle: '中学校',
      high: '高等学校',
    },
    officialTypes: {
      common: '共通科目',
      'general-elective': '一般選択',
      'career-elective': '進路選択',
      'convergence-elective': '融合選択',
      professional: '専門・発展科目',
    },
    badges: {
      ready: 'すぐ学習',
      partial: '一部利用可',
      planned: '準備中',
      open: '単元を開く',
    },
    notices: {
      gradeLegacyNotice: '馴染みのある旧科目名で分類した画面です。現行の2022改訂科目名や実際の開講学年は学校によって異なる場合があります。',
      subject2022Notice: '2022改訂教育課程の公式科目区分です。共通、一般選択、進路選択、融合選択ごとに学べます。',
      intlNotice: 'インターナショナルスクール等の独立課程です（Pre-Algebra、Algebra 1・2など）。韓国課程とは独立して管理されます。',
      domainNotice: '学年を越えて、数と計算、変化と関係、図形と測定、資料と可能性などの数学の本質別に探求できます。',
      bottomNote: '学年・科目は代表的な案内です。実際の順序は学校やカリキュラムによって異なります。',
    },
    labels: {
      revised2022: '2022改訂対応',
      legacyName: '従来名',
      officialType: '公式区分',
      targetGrade: '代表学年',
      topicsCount: '{count}単元',
    },
  },
  fr: {
    eyebrow: 'CARTE DU PROGRAMME',
    title: 'Comment souhaitez-vous explorer les maths ?',
    description: 'Parcourez le programme coréen (par classe / matières 2022), les cours internationaux ou les domaines mathématiques.',
    mainTabs: ['Programme coréen', 'Parcours international', 'Domaines mathématiques'],
    mainTabHelp: ['Classes 1 à 12 & Réforme 2022', 'Pré-algèbre, Algèbre 1–2, Précalcul', 'Nombres, algèbre, géométrie et probabilités'],
    subViews: {
      byGrade: 'Par niveau · Noms classiques',
      bySubject2022: 'Matières réformées 2022',
    },
    schoolLevels: {
      elementary: 'École primaire',
      middle: 'Collège',
      high: 'Lycée',
    },
    officialTypes: {
      common: 'Tronc commun',
      'general-elective': 'Spécialités générales',
      'career-elective': 'Spécialités appliquées',
      'convergence-elective': 'Option interdisciplinaire',
      professional: 'Mathématiques expertes',
    },
    badges: {
      ready: 'S’exercer',
      partial: 'Partiel',
      planned: 'Bientôt',
      open: 'Ouvrir les thèmes',
    },
    notices: {
      gradeLegacyNotice: 'Classé selon les dénominations traditionnelles. Les dénominations officielles 2022 et le niveau réel peuvent varier selon les lycées.',
      subject2022Notice: 'Structure officielle du programme coréen 2022 : tronc commun, spécialités générales, appliquées et approfondies.',
      intlNotice: 'Progression indépendante pour les écoles internationales (Pré-algèbre, Algèbre 1–2, Précalcul).',
      domainNotice: 'Explorez par notions fondamentales : nombres et calcul, algèbre, géométrie, probabilités.',
      bottomNote: 'Ces parcours servent de repères ; l’ordre précis varie selon l’établissement et le pays.',
    },
    labels: {
      revised2022: 'Équivalent 2022',
      legacyName: 'Nom classique',
      officialType: 'Type officiel',
      targetGrade: 'Niveau type',
      topicsCount: '{count} thèmes',
    },
  },
  es: {
    eyebrow: 'MAPA CURRICULAR',
    title: '¿Cómo quieres explorar las matemáticas?',
    description: 'Consulta por currículo de Corea (cursos / materias 2022), secuencia internacional o áreas matemáticas.',
    mainTabs: ['Currículo coreano', 'Secuencia de materias', 'Áreas matemáticas'],
    mainTabHelp: ['Grados 1 a 12 y reforma 2022', 'Preálgebra, Álgebra 1–2, Precálculo', 'Números, álgebra, geometría y datos'],
    subViews: {
      byGrade: 'Por curso · Nombres clásicos',
      bySubject2022: 'Materias reformadas 2022',
    },
    schoolLevels: {
      elementary: 'Primaria',
      middle: 'Secundaria',
      high: 'Bachillerato',
    },
    officialTypes: {
      common: 'Materias comunes',
      'general-elective': 'Optativas generales',
      'career-elective': 'Optativas de itinerario',
      'convergence-elective': 'Optativas integradas',
      professional: 'Avanzadas y especializadas',
    },
    badges: {
      ready: 'Practicar ahora',
      partial: 'Parcial',
      planned: 'Próximamente',
      open: 'Abrir temas',
    },
    notices: {
      gradeLegacyNotice: 'Organizado con nombres tradicionales conocidos. Las denominaciones oficiales de 2022 y el curso real pueden variar según el centro.',
      subject2022Notice: 'Clasificación oficial del currículo coreano 2022 en materias comunes, optativas generales e itinerarios.',
      intlNotice: 'Secuencia independiente para programas internacionales (Preálgebra, Álgebra 1–2, Precálculo).',
      domainNotice: 'Explora conceptos transversales: aritmética, álgebra, geometría, probabilidad y estadística.',
      bottomNote: 'Son rutas orientativas; el orden exacto varía según la escuela, el país y el programa.',
    },
    labels: {
      revised2022: 'Equivalente 2022',
      legacyName: 'Nombre clásico',
      officialType: 'Tipo oficial',
      targetGrade: 'Curso habitual',
      topicsCount: '{count} temas',
    },
  },
  ru: {
    eyebrow: 'КАРТА ПРОГРАММЫ',
    title: 'Как вы хотите изучать математику?',
    description: 'Просматривайте по корейской программе (классы / предметы 2022), международным курсам или разделам.',
    mainTabs: ['Корейская программа', 'Последовательность курсов', 'Разделы математики'],
    mainTabHelp: ['1–12 классы и реформа 2022', 'Предалгебра, Алгебра 1–2, Матанализ', 'Числа, алгебра, геометрия, статистика'],
    subViews: {
      byGrade: 'По классам · Традиционные',
      bySubject2022: 'Предметы реформы 2022',
    },
    schoolLevels: {
      elementary: 'Начальная школа',
      middle: 'Средняя школа',
      high: 'Старшая школа',
    },
    officialTypes: {
      common: 'Базовые предметы',
      'general-elective': 'Общие курсы по выбору',
      'career-elective': 'Профильные курсы',
      'convergence-elective': 'Междисциплинарные',
      professional: 'Углубленные и спецкурсы',
    },
    badges: {
      ready: 'Начать',
      partial: 'Частично',
      planned: 'Скоро',
      open: 'Открыть темы',
    },
    notices: {
      gradeLegacyNotice: 'Классификация по привычным традиционным названиям. Официальные названия 2022 года и класс могут отличаться в школах.',
      subject2022Notice: 'Официальная структура корейской программы 2022 года: базовые, элективные и углубленные дисциплины.',
      intlNotice: 'Независимая траектория для международных программ (Предалгебра, Алгебра 1–2, Прекалькулус).',
      domainNotice: 'Изучайте сквозные понятия: арифметика, алгебра, геометрия, теория вероятностей.',
      bottomNote: 'Это ориентировочные маршруты; точный порядок зависит от школы, страны и программы.',
    },
    labels: {
      revised2022: 'Аналог 2022',
      legacyName: 'Традиционное имя',
      officialType: 'Статус',
      targetGrade: 'Типичный класс',
      topicsCount: '{count} тем',
    },
  },
  ar: {
    eyebrow: 'خريطة المنهج',
    title: 'كيف تريد استكشاف الرياضيات؟',
    description: 'تصفح حسب المنهج الكوري (الصفوف / مواد 2022)، أو تسلسل المقررات الدولي، أو مجالات الرياضيات.',
    mainTabs: ['المنهج الكوري', 'تسلسل المقررات', 'مجالات الرياضيات'],
    mainTabHelp: ['الصفوف 1-12 ومواد 2022 المعدلة', 'ما قبل الجبر والجبر 1 و2 وحساب التفاضل', 'الأعداد والجبر والهندسة والإحصاء'],
    subViews: {
      byGrade: 'حسب الصف · المسميات المعتادة',
      bySubject2022: 'مواد منهج 2022 المعدل',
    },
    schoolLevels: {
      elementary: 'المرحلة الابتدائية',
      middle: 'المرحلة المتوسطة',
      high: 'المرحلة الثانوية',
    },
    officialTypes: {
      common: 'المواد المشتركة',
      'general-elective': 'اختياري عام',
      'career-elective': 'اختياري مساري',
      'convergence-elective': 'اختياري تكاملي',
      professional: 'متقدم وتخصصي',
    },
    badges: {
      ready: 'تدرّب الآن',
      partial: 'متاح جزئيًا',
      planned: 'قريبًا',
      open: 'افتح الموضوعات',
    },
    notices: {
      gradeLegacyNotice: 'مبوبة بالأسماء التقليدية المألوفة. قد تختلف مسميات مواد 2022 والصف الفعلي حسب تنظيم المدرسة.',
      subject2022Notice: 'الهيكل الرسمي لمنهج 2022 الكوري: المواد الأساسية والاختيارية والتخصصية.',
      intlNotice: 'مسار مستقل لبرامج المدارس الدولية (ما قبل الجبر، الجبر 1 و2، وما قبل التفاضل).',
      domainNotice: 'استكشف المفاهيم المحورية عبر المراحل: الأعداد، الجبر، الهندسة، الاحتمالات والإحصاء.',
      bottomNote: 'هذه مسارات إرشادية، وقد يختلف الترتيب حسب المدرسة والدولة والبرنامج.',
    },
    labels: {
      revised2022: 'المقابل في 2022',
      legacyName: 'الاسم التقليدي',
      officialType: 'النوع الرسمي',
      targetGrade: 'الصف المعتاد',
      topicsCount: '{count} موضوعات',
    },
  },
  pt: {
    eyebrow: 'MAPA CURRICULAR',
    title: 'Como você quer explorar a matemática?',
    description: 'Navegue pelo currículo coreano (por ano / matérias 2022), sequência internacional ou áreas matemáticas.',
    mainTabs: ['Currículo coreano', 'Sequência de cursos', 'Áreas da matemática'],
    mainTabHelp: ['1.º ao 12.º ano e reforma 2022', 'Pré-Álgebra, Álgebra 1–2 e Pré-Cálculo', 'Números, álgebra, geometria e estatística'],
    subViews: {
      byGrade: 'Por ano · Nomes clássicos',
      bySubject2022: 'Matérias reformadas 2022',
    },
    schoolLevels: {
      elementary: 'Ensino Fundamental I',
      middle: 'Ensino Fundamental II',
      high: 'Ensino Médio',
    },
    officialTypes: {
      common: 'Matérias comuns',
      'general-elective': 'Eletivas gerais',
      'career-elective': 'Eletivas de itinerário',
      'convergence-elective': 'Eletivas integradas',
      professional: 'Avançadas e especializadas',
    },
    badges: {
      ready: 'Praticar agora',
      partial: 'Parcial',
      planned: 'Em breve',
      open: 'Abrir tópicos',
    },
    notices: {
      gradeLegacyNotice: 'Classificado com nomes tradicionais familiares. As designações de 2022 e o ano letivo real podem variar por escola.',
      subject2022Notice: 'Estrutura oficial do currículo coreano 2022 para matérias comuns, eletivas e especializadas.',
      intlNotice: 'Sequência independente para currículos de escolas internacionais (Pré-Álgebra, Álgebra 1–2).',
      domainNotice: 'Explore conceitos fundamentais: números e operações, álgebra, geometria, probabilidade.',
      bottomNote: 'São percursos de referência; a ordem exata varia conforme a escola, o país e o programa.',
    },
    labels: {
      revised2022: 'Equivalente 2022',
      legacyName: 'Nome clássico',
      officialType: 'Tipo oficial',
      targetGrade: 'Ano habitual',
      topicsCount: '{count} tópicos',
    },
  },
  hi: {
    eyebrow: 'पाठ्यक्रम मानचित्र',
    title: 'आप गणित को किस क्रम में देखना चाहते हैं?',
    description: 'कोरियाई पाठ्यक्रम (कक्षा/2022 विषय), अंतरराष्ट्रीय पाठ्यक्रम क्रम या गणितीय क्षेत्र के अनुसार देखें।',
    mainTabs: ['कोरियाई पाठ्यक्रम', 'पाठ्यक्रम क्रम', 'गणित के क्षेत्र'],
    mainTabHelp: ['कक्षा 1-12 और 2022 संशोधित विषय', 'प्री-अल्जेब्रा, अल्जेब्रा 1-2, प्रीकैलकुलस', 'संख्याएँ, बीजगणित, ज्यामिति और सांख्यिकी'],
    subViews: {
      byGrade: 'कक्षा अनुसार · पारंपरिक नाम',
      bySubject2022: '2022 संशोधित विषय',
    },
    schoolLevels: {
      elementary: 'प्राथमिक विद्यालय',
      middle: 'मध्य विद्यालय',
      high: 'उच्च विद्यालय',
    },
    officialTypes: {
      common: 'अनिवार्य विषय',
      'general-elective': 'सामान्य ऐच्छिक',
      'career-elective': 'कैरियर ऐच्छिक',
      'convergence-elective': 'समन्वित ऐच्छिक',
      professional: 'उन्नत एवं विशेषज्ञ',
    },
    badges: {
      ready: 'अभी अभ्यास करें',
      partial: 'आंशिक',
      planned: 'जल्द आ रहा है',
      open: 'विषय खोलें',
    },
    notices: {
      gradeLegacyNotice: 'पारंपरिक नामों से वर्गीकृत। आधिकारिक 2022 नाम और वास्तविक कक्षा स्कूल के अनुसार भिन्न हो सकते हैं।',
      subject2022Notice: '2022 कोरियाई पाठ्यक्रम की आधिकारिक संरचना: अनिवार्य, ऐच्छिक व उन्नत विषय।',
      intlNotice: 'अंतरराष्ट्रीय स्कूलों के लिए स्वतंत्र पाठ्यक्रम (प्री-अल्जेब्रा, अल्जेब्रा 1-2 आदि)।',
      domainNotice: 'संख्या, बीजगणित, ज्यामिति, प्रायिकता जैसे मूल सिद्धांतों के आधार पर सीखें।',
      bottomNote: 'ये मार्गदर्शक रास्ते हैं; वास्तविक क्रम स्कूल, देश और कार्यक्रम के अनुसार बदल सकता है।',
    },
    labels: {
      revised2022: '2022 समकक्ष',
      legacyName: 'पारंपरिक नाम',
      officialType: 'आधिकारिक प्रकार',
      targetGrade: 'मानक कक्षा',
      topicsCount: '{count} विषय',
    },
  },
  vi: {
    eyebrow: 'BẢN ĐỒ CHƯƠNG TRÌNH',
    title: 'Bạn muốn khám phá toán theo cách nào?',
    description: 'Xem theo chương trình Hàn Quốc (lớp / môn 2022), lộ trình quốc tế hoặc lĩnh vực toán học.',
    mainTabs: ['Chương trình Hàn Quốc', 'Lộ trình môn học', 'Lĩnh vực toán học'],
    mainTabHelp: ['Lớp 1–12 & Môn học sửa đổi 2022', 'Tiền đại số, Đại số 1–2, Tiền giải tích', 'Số học, đại số, hình học và xác suất'],
    subViews: {
      byGrade: 'Theo lớp · Tên truyền thống',
      bySubject2022: 'Môn học sửa đổi 2022',
    },
    schoolLevels: {
      elementary: 'Tiểu học',
      middle: 'Trung học cơ sở',
      high: 'Trung học phổ thông',
    },
    officialTypes: {
      common: 'Môn bắt buộc chung',
      'general-elective': 'Tự chọn chung',
      'career-elective': 'Tự chọn định hướng',
      'convergence-elective': 'Tự chọn tích hợp',
      professional: 'Chuyên sâu & nâng cao',
    },
    badges: {
      ready: 'Học ngay',
      partial: 'Một phần',
      planned: 'Sắp có',
      open: 'Mở chủ đề',
    },
    notices: {
      gradeLegacyNotice: 'Phân loại theo tên môn quen thuộc. Tên môn theo chương trình 2022 và lớp học thực tế có thể khác tùy trường.',
      subject2022Notice: 'Cấu trúc chính thức chương trình 2022 Hàn Quốc: môn chung, tự chọn chung, định hướng nghề và nâng cao.',
      intlNotice: 'Lộ trình độc lập cho trường quốc tế (Tiền đại số, Đại số 1–2, Tiền giải tích).',
      domainNotice: 'Khám phá các khái niệm cốt lõi: số & phép tính, đại số, hình học, xác suất thống kê.',
      bottomNote: 'Đây là các lộ trình tham khảo; thứ tự cụ thể tùy trường, quốc gia và chương trình.',
    },
    labels: {
      revised2022: 'Tương đương 2022',
      legacyName: 'Tên truyền thống',
      officialType: 'Loại môn',
      targetGrade: 'Lớp tiêu chuẩn',
      topicsCount: '{count} chủ đề',
    },
  },
  id: {
    eyebrow: 'PETA KURIKULUM',
    title: 'Bagaimana Anda ingin menjelajahi matematika?',
    description: 'Telusuri menurut kurikulum Korea (kelas / mata pelajaran 2022), urutan kursus internasional, atau bidang matematika.',
    mainTabs: ['Kurikulum Korea', 'Urutan Kursus', 'Bidang Matematika'],
    mainTabHelp: ['Kelas 1–12 & Pelajaran Revisi 2022', 'Pra-Aljabar, Aljabar 1–2, Pra-Kalkulus', 'Bilangan, aljabar, geometri, dan data'],
    subViews: {
      byGrade: 'Per Kelas · Nama Klasik',
      bySubject2022: 'Mata Pelajaran Revisi 2022',
    },
    schoolLevels: {
      elementary: 'Sekolah Dasar',
      middle: 'Sekolah Menengah Pertama',
      high: 'Sekolah Menengah Atas',
    },
    officialTypes: {
      common: 'Mata Pelajaran Wajib',
      'general-elective': 'Pilihan Umum',
      'career-elective': 'Pilihan Karir',
      'convergence-elective': 'Pilihan Integratif',
      professional: 'Lanjutan & Spesialis',
    },
    badges: {
      ready: 'Latihan sekarang',
      partial: 'Sebagian',
      planned: 'Segera hadir',
      open: 'Buka topik',
    },
    notices: {
      gradeLegacyNotice: 'Disusun berdasarkan nama kursus klasik yang familiar. Nama resmi revisi 2022 dan kelas aktual dapat berbeda antar sekolah.',
      subject2022Notice: 'Struktur resmi Kurikulum Korea 2022 untuk mata pelajaran umum, pilihan, dan lanjutan.',
      intlNotice: 'Urutan independen untuk sekolah internasional (Pra-Aljabar, Aljabar 1–2, Pra-Kalkulus).',
      domainNotice: 'Pelajari konsep inti: bilangan & operasi, aljabar, geometri, peluang & statistika.',
      bottomNote: 'Ini adalah jalur panduan; urutan tepat dapat berbeda menurut sekolah, negara, dan program.',
    },
    labels: {
      revised2022: 'Setara 2022',
      legacyName: 'Nama Klasik',
      officialType: 'Jenis Resmi',
      targetGrade: 'Kelas Umum',
      topicsCount: '{count} topik',
    },
  },
};

/**
 * 1. 한국 교육과정 - 학년별 인덱스 (초1 ~ 고3)
 */
const KOREAN_GRADE_STAGE_SEEDS = [
  // 초등학교
  ...Array.from({ length: 6 }, (_, index) => {
    const grade = index + 1;
    return {
      id: `kr-elem-${grade}`,
      level: 'elementary',
      title: `초등학교 ${grade}학년`,
      subtitle: `Korean Grade ${grade}`,
      availability: 'ready',
      topics: [
        { label: `${grade}학년 수학 연산·단원 연습`, href: `/elementary/practice?grade=${grade}`, ready: true, availability: 'ready' },
      ],
    };
  }),

  // 중학교 1학년
  {
    id: 'kr-middle-1-grade',
    level: 'middle',
    title: '중학교 1학년',
    subtitle: 'Korean Grade 7',
    availability: 'ready',
    topics: [
      { label: '중1 비기하 통합 생성기', href: '/middle-school/pre-algebra?profile=kr-middle-1', ready: true, availability: 'ready' },
      { label: '소수와 소인수분해', href: '/middle-school/prime-factorization', ready: true, availability: 'ready' },
      { label: '최대공약수와 최소공배수', href: '/middle-school/gcd-lcm', ready: true, availability: 'ready' },
      { label: '정수와 유리수', href: '/middle-school/integers-rationals', ready: true, availability: 'ready' },
      { label: '문자와 식', href: '/middle-school/algebra-basics.html?unit=expressions-review', ready: true, availability: 'ready' },
      { label: '일차방정식', href: '/middle-school/algebra-basics.html?unit=equations-review', ready: true, availability: 'ready' },
      { label: '좌표와 그래프', href: '/middle-school/coordinate-plane', ready: true, availability: 'ready' },
      { label: '정비례와 반비례', href: '/middle-school/proportion', ready: true, availability: 'ready' },
      { label: '기본 도형 (점·선·면·각)', href: '/middle-school/basic-figures?profile=kr&unit=visual-foundations', ready: true, availability: 'ready' },
      { label: '다각형과 내각·외각', href: '/middle-school/basic-figures?profile=kr&unit=polygon-angles-basic', ready: true, availability: 'ready' },
      { label: '원과 부채꼴', href: '/middle-school/basic-figures?profile=kr&unit=circle-sector-inverse-basic', ready: true, availability: 'ready' },
      { label: '다면체·회전체와 전개도', href: '/middle-school/basic-figures?profile=kr&unit=polyhedron-concepts-euler', ready: true, availability: 'ready' },
      { label: '입체도형의 겉넓이와 부피', href: '/middle-school/basic-figures?profile=kr&unit=expanded-solid-measures', ready: true, availability: 'ready' },
      { label: '자료의 정리와 해석 (도수분포표)', href: '/middle-school/pre-algebra?profile=kr-middle-1&unit=frequency-table', ready: true, availability: 'ready' },
    ],
  },

  // 중학교 2학년
  {
    id: 'kr-middle-2-grade',
    level: 'middle',
    title: '중학교 2학년',
    subtitle: 'Korean Grade 8',
    availability: 'ready',
    topics: [
      { label: '중2 대수·확률 통합 생성기', href: '/middle-school/pre-algebra?profile=kr-middle-2', ready: true, availability: 'ready' },
      { label: '유리수와 순환소수', href: '/middle-school/integers-rationals?unit=decimal-classification', ready: true, availability: 'ready' },
      { label: '식의 계산 (지수법칙·단항식·다항식·대입)', href: '/middle-school/pre-algebra?profile=kr-middle-2&unit=expression-calculation-review-2', ready: true, availability: 'ready' },
      { label: '일차부등식', href: '/middle-school/pre-algebra?profile=kr-middle-2&unit=linear-inequalities-2', ready: true, availability: 'ready' },
      { label: '연립일차방정식', href: '/middle-school/pre-algebra?profile=kr-middle-2&unit=systems-linear', ready: true, availability: 'ready' },
      { label: '일차함수와 그래프', href: '/middle-school/pre-algebra?profile=kr-middle-2&unit=linear-functions-2', ready: true, availability: 'ready' },
      { label: '도형의 성질 (삼각형·사각형)', href: '/middle-school/basic-figures?profile=kr&unit=isosceles-triangle-properties', ready: true, availability: 'ready' },
      { label: '도형의 닮음과 피타고라스 정리', href: '/middle-school/basic-figures?profile=kr&unit=similarity-conditions', ready: true, availability: 'ready' },
      { label: '확률과 그 기본 성질', href: '/middle-school/pre-algebra?profile=kr-middle-2&unit=probability-2', ready: true, availability: 'ready' },
    ],
  },

  // 중학교 3학년
  {
    id: 'kr-middle-3-grade',
    level: 'middle',
    title: '중학교 3학년',
    subtitle: 'Korean Grade 9',
    availability: 'ready',
    topics: [
      { label: '중3 대수·통계 통합 생성기', href: '/middle-school/pre-algebra?profile=kr-middle-3', ready: true, availability: 'ready' },
      { label: '제곱근과 실수', href: '/middle-school/pre-algebra?profile=kr-middle-3&unit=radicals-real-numbers', ready: true, availability: 'ready' },
      { label: '다항식의 곱셈과 인수분해', href: '/middle-school/pre-algebra?profile=kr-middle-3&unit=quadratic-equations', ready: true, availability: 'ready' },
      { label: '이차방정식', href: '/middle-school/pre-algebra?profile=kr-middle-3&unit=quadratic-equations', ready: true, availability: 'ready' },
      { label: '이차함수와 그래프', href: '/middle-school/pre-algebra?profile=kr-middle-3&unit=quadratic-functions', ready: true, availability: 'ready' },
      { label: '삼각비', href: '/middle-school/pre-algebra?profile=kr-middle-3&unit=middle3-trig-ratios-shared', ready: true, availability: 'ready' },
      { label: '원의 성질 종합 (원과 직선 · 원주각)', href: '/middle-school/basic-figures?profile=kr&unit=circle-properties-mixed', ready: true, availability: 'ready' },
      { label: '원과 직선 (현의 수직이등분선과 현의 길이)', href: '/middle-school/basic-figures?profile=kr&unit=circle-chord-properties', ready: true, availability: 'ready' },
      { label: '원의 접선의 성질과 접선의 길이', href: '/middle-school/basic-figures?profile=kr&unit=circle-tangent-properties', ready: true, availability: 'ready' },
      { label: '삼각형의 내접원과 외접사각형', href: '/middle-school/basic-figures?profile=kr&unit=circle-inscribed-circumscribed', ready: true, availability: 'ready' },
      { label: '원주각과 중심각의 성질', href: '/middle-school/basic-figures?profile=kr&unit=circle-inscribed-angles', ready: true, availability: 'ready' },
      { label: '원에 내접하는 사각형과 조건', href: '/middle-school/basic-figures?profile=kr&unit=circle-cyclic-quadrilaterals', ready: true, availability: 'ready' },
      { label: '접선과 현이 이루는 각 (접현각)', href: '/middle-school/basic-figures?profile=kr&unit=circle-tangent-chord-angles', ready: true, availability: 'ready' },
      { label: '대푯값과 산포도·상관관계', href: '/middle-school/pre-algebra?profile=kr-middle-3&unit=data-variation', ready: true, availability: 'ready' },
    ],
  },

  // 고등학교 1학년 (기존 분류: 수학(상)·수학(하) / 2022 개정: 공통수학1·공통수학2)
  {
    id: 'kr-high-1-grade',
    level: 'high',
    title: '고등학교 1학년',
    subtitle: 'Korean Grade 10 · 수학(상) · 수학(하)',
    availability: 'partial',
    notice: '2022 개정 대응: 공통수학1, 공통수학2 (공통 과목)',
    topics: [
      {
        label: '수학(상) · 공통수학1 (다항식·방정식·부등식·행렬)',
        href: '/middle-school/pre-algebra?profile=kr-high-1',
        ready: true,
        availability: 'partial',
        meta: { legacy: '수학(상)', revised2022: '공통수학1', officialType: '공통 과목' },
      },
      {
        label: '수학(하) · 공통수학2 (도형의 방정식·집합과 명제·함수)',
        href: '/middle-school/pre-algebra?profile=kr-high-1&unit=sets-logic',
        ready: true,
        availability: 'partial',
        meta: { legacy: '수학(하)', revised2022: '공통수학2', officialType: '공통 과목' },
      },
      {
        label: '고등 기하 기초 (좌표와 도형)',
        href: '/middle-school/basic-figures?profile=csat&unit=high-coordinate-geometry',
        ready: true,
        availability: 'ready',
      },
      { label: '공통수학2 · 도형의 평행이동', href: '/middle-school/basic-figures?profile=kr&unit=transform-translation', ready: true, availability: 'ready' },
      { label: '공통수학2 · 도형의 대칭이동', href: '/middle-school/basic-figures?profile=kr&unit=transform-reflection', ready: true, availability: 'ready' },
      { label: '공통수학2 · 도형의 회전이동', href: '/middle-school/basic-figures?profile=kr&unit=transform-rotation', ready: true, availability: 'ready' },
      { label: '공통수학2 · 닮음변환과 좌표', href: '/middle-school/basic-figures?profile=kr&unit=transform-dilation', ready: true, availability: 'ready' },
      { label: '공통수학2 · 명제와 진리표', href: '/middle-school/basic-figures?profile=kr&unit=logic-truth-tables', ready: true, availability: 'ready' },
      { label: '공통수학2 · 명제의 역·이·대우', href: '/middle-school/basic-figures?profile=kr&unit=logic-conditional-forms', ready: true, availability: 'ready' },
      { label: '공통수학2 · 삼단논법과 추론의 타당성', href: '/middle-school/basic-figures?profile=kr&unit=logic-detachment-syllogism', ready: true, availability: 'ready' },
      { label: '공통수학2 · 증명의 등식 성질(반사성·대칭성·이행성)', href: '/middle-school/basic-figures?profile=kr&unit=logic-segment-angle-properties', ready: true, availability: 'ready' },
    ],
  },

  // 고등학교 2학년 — 2025학년도 고1부터 2022 개정이 적용되어, 현재 고2는 이미 2022 개정(대수·미적분Ⅰ·확률과 통계)을 배운다.
  // 예전 2015 개정 이름(수학Ⅰ·수학Ⅱ)은 참고용 legacy 표기로만 남긴다.
  {
    id: 'kr-high-2-grade',
    level: 'high',
    title: '고등학교 2학년',
    subtitle: 'Korean Grade 11 · 대수 · 미적분Ⅰ · 확률과 통계 (2022 개정)',
    availability: 'partial',
    notice: '2025학년도 고1부터 2022 개정이 적용되어, 현재 고2는 2022 개정 과목(대수·미적분Ⅰ·확률과 통계)을 배웁니다. 이전 2015 개정 과목명(수학Ⅰ·수학Ⅱ)은 참고용입니다.',
    topics: [
      {
        label: '대수 (예전 2015 개정: 수학Ⅰ — 지수·로그, 삼각함수, 수열)',
        href: '/middle-school/pre-algebra?profile=kr-high-2-algebra',
        ready: true,
        availability: 'partial',
        meta: { legacy: '수학Ⅰ', revised2022: '대수', officialType: '일반 선택' },
      },
      { label: '거듭제곱과 거듭제곱근', href: '/middle-school/pre-algebra?profile=kr-high-2-algebra&unit=h1-real-nth-roots', ready: true, availability: 'ready' },
      { label: '지수법칙과 지수의 확장', href: '/middle-school/pre-algebra?profile=kr-high-2-algebra&unit=h1-integer-exponents', ready: true, availability: 'ready' },
      { label: '유리수·실수 지수식의 계산과 활용', href: '/middle-school/pre-algebra?profile=kr-high-2-algebra&unit=h1-rational-exponent-simplify', ready: true, availability: 'ready' },
      { label: '로그의 정의와 성질', href: '/middle-school/pre-algebra?profile=kr-high-2-algebra&unit=h1-log-definition', ready: true, availability: 'ready' },
      { label: '로그의 밑 변환과 계산', href: '/middle-school/pre-algebra?profile=kr-high-2-algebra&unit=h1-log-change-of-base', ready: true, availability: 'ready' },
      { label: '상용로그와 활용', href: '/middle-school/pre-algebra?profile=kr-high-2-algebra&unit=h1-common-log-basic', ready: true, availability: 'ready' },
      { label: '지수함수와 그래프', href: '/middle-school/pre-algebra?profile=kr-high-2-algebra&unit=h1-exponential-graph-properties', ready: true, availability: 'ready' },
      { label: '지수방정식과 지수부등식', href: '/middle-school/pre-algebra?profile=kr-high-2-algebra&unit=h1-exponential-equations-linear', ready: true, availability: 'ready' },
      { label: '로그함수와 그래프', href: '/middle-school/pre-algebra?profile=kr-high-2-algebra&unit=h1-log-graph-properties', ready: true, availability: 'ready' },
      { label: '로그방정식과 로그부등식', href: '/middle-school/pre-algebra?profile=kr-high-2-algebra&unit=h1-log-equations-same-base', ready: true, availability: 'ready' },
      { label: '일반각·호도법과 부채꼴', href: '/middle-school/pre-algebra?profile=kr-high-2-algebra&unit=h2-general-coterminal-angles', ready: true, availability: 'ready' },
      { label: '삼각함수의 정의·성질과 활용', href: '/middle-school/pre-algebra?profile=kr-high-2-algebra&unit=h2-point-trig-values', ready: true, availability: 'ready' },
      { label: '삼각함수의 그래프와 여러 가지 각', href: '/middle-school/pre-algebra?profile=kr-high-2-algebra&unit=h2-basic-trig-graph-properties', ready: true, availability: 'ready' },
      { label: '삼각방정식과 삼각부등식', href: '/middle-school/pre-algebra?profile=kr-high-2-algebra&unit=h2-basic-trig-equations', ready: true, availability: 'ready' },
      { label: '수열의 뜻과 등차수열', href: '/middle-school/pre-algebra?profile=kr-high-2-algebra&unit=sequence-patterns-general-term', ready: true, availability: 'ready' },
      { label: '등차중항·조화중항과 수 넣기', href: '/middle-school/pre-algebra?profile=kr-high-2-algebra&unit=arithmetic-harmonic-means', ready: true, availability: 'ready' },
      { label: '등차수열의 합과 부분합', href: '/middle-school/pre-algebra?profile=kr-high-2-algebra&unit=arithmetic-partial-sums', ready: true, availability: 'ready' },
      { label: '등비수열·등비중항과 합', href: '/middle-school/pre-algebra?profile=kr-high-2-algebra&unit=geometric-from-two-terms', ready: true, availability: 'ready' },
      { label: '등비수열의 활용 · 반복 변화·복리·적금', href: '/middle-school/pre-algebra?profile=kr-high-2-algebra&unit=compound-interest-annuities', ready: true, availability: 'ready' },
      { label: '시그마와 자연수의 거듭제곱의 합', href: '/middle-school/pre-algebra?profile=kr-high-2-algebra&unit=sigma-notation', ready: true, availability: 'ready' },
      { label: '부분분수·근호·로그의 망원합', href: '/middle-school/pre-algebra?profile=kr-high-2-algebra&unit=telescoping-rational-sums', ready: true, availability: 'ready' },
      { label: '군수열과 수열의 귀납적 정의', href: '/middle-school/pre-algebra?profile=kr-high-2-algebra&unit=grouped-sequences', ready: true, availability: 'ready' },
      { label: '수학적 귀납법 · 등식과 부등식의 증명', href: '/middle-school/pre-algebra?profile=kr-high-2-algebra&unit=induction-structure', ready: true, availability: 'ready' },
      {
        label: '미적분Ⅰ (예전 2015 개정: 수학Ⅱ — 함수의 극한·연속, 미분, 적분)',
        href: '/middle-school/pre-algebra?profile=kr-high-2-calculus-1',
        ready: true,
        availability: 'partial',
        meta: { legacy: '수학Ⅱ', revised2022: '미적분Ⅰ', officialType: '일반 선택' },
      },
      {
        label: '확률과 통계 (2015·2022 개정 동일 — 경우의 수, 확률, 통계적 추정)',
        href: '/middle-school/pre-algebra?profile=kr-high-2-probability-statistics',
        ready: true,
        availability: 'partial',
        meta: { legacy: '확률과 통계', revised2022: '확률과 통계', officialType: '일반 선택' },
      },
    ],
  },

  // 고등학교 3학년 — 2022 개정은 2025학년도 고1부터 연차 적용되므로, 2026-09 현재 고3은 아직 2022 개정 적용 이전 학년(2015 개정 마지막 세대)이다.
  // 따라서 이 학년 카드는 2015 개정 과목명(미적분·기하)을 실제 응시 과목명으로 그대로 유지하고, 2022 개정 이름(미적분Ⅱ·기하)은 참고용으로만 덧붙인다.
  // 2027학년도 수능(2026년 11월 시행)까지는 이 상태가 맞고, 이후 학년도부터는 전 학년이 2022 개정으로 통일된다.
  {
    id: 'kr-high-3-grade',
    level: 'high',
    title: '고등학교 3학년',
    subtitle: 'Korean Grade 12 · 미적분 · 기하 (2015 개정 · 2027학년도 수능까지)',
    availability: 'partial',
    notice: '2022 개정은 2025학년도 고1부터 연차 적용되어, 현재 고3은 아직 2015 개정 마지막 세대입니다. 2027학년도 수능(2026년 11월 시행)까지는 미적분·기하(2015 개정)로 응시하며, 2022 개정 이름(미적분Ⅱ·기하)은 다음 학년도부터 적용될 참고용 이름입니다.',
    topics: [
      {
        label: '미적분 (2022 개정: 미적분Ⅱ — 수열의 극한, 여러 가지 미분법·적분법)',
        href: '/middle-school/pre-algebra?profile=kr-high-3-calculus-2',
        ready: true,
        availability: 'partial',
        meta: { legacy: '미적분', revised2022: '미적분Ⅱ', officialType: '진로 선택' },
      },
      {
        label: '기하 (2022 개정: 기하 — 이차곡선, 평면벡터, 공간도형과 공간좌표)',
        href: '/middle-school/pre-algebra?profile=kr-high-3-geometry',
        ready: true,
        availability: 'partial',
        meta: { legacy: '기하', revised2022: '기하', officialType: '진로 선택' },
      },
      {
        label: '수능 수학 종합 연습 (실전 모의)',
        href: '/middle-school/basic-figures?profile=csat&unit=regional-geometry-mixed',
        ready: true,
        availability: 'ready',
      },
    ],
  },
];

/**
 * 2. 한국 고등학교 - 2022 개정 공식 과목 구분별 인덱스
 */
const KOREAN_2022_SUBJECT_STAGE_SEEDS = [
  // 공통 과목
  {
    id: 'kr-2022-common',
    officialType: 'common',
    title: '공통 과목',
    subtitle: 'Common Subjects · 고1 기본 이수',
    availability: 'partial',
    topics: [
      {
        label: '공통수학1 (다항식, 방정식과 부등식, 경우의 수, 행렬)',
        href: '/middle-school/pre-algebra?profile=kr-high-1',
        ready: true,
        availability: 'partial',
        meta: { legacy: '고1 수학(상)', grade: '고1', evidence: 'implemented' },
      },
      {
        label: '공통수학2 (도형의 방정식, 집합과 명제, 함수와 그래프)',
        href: '/middle-school/pre-algebra?profile=kr-high-1&unit=sets-logic',
        ready: true,
        availability: 'partial',
        meta: { legacy: '고1 수학(하)', grade: '고1', evidence: 'implemented' },
      },
      {
        label: '기본수학1 (기초 다항식·방정식과 부등식)',
        href: '#',
        ready: false,
        availability: 'planned',
        meta: { grade: '고1', evidence: 'catalogued' },
      },
      {
        label: '기본수학2 (기초 도형의 방정식·함수)',
        href: '#',
        ready: false,
        availability: 'planned',
        meta: { grade: '고1', evidence: 'catalogued' },
      },
    ],
  },

  // 일반 선택
  {
    id: 'kr-2022-general',
    officialType: 'general-elective',
    title: '일반 선택',
    subtitle: 'General Electives · 대수 · 미적분Ⅰ · 확률과 통계',
    availability: 'partial',
    topics: [
      {
        label: '대수 (지수와 로그, 삼각함수, 수열)',
        href: '/middle-school/pre-algebra?profile=kr-high-2-algebra',
        ready: true,
        availability: 'partial',
        meta: { legacy: '구 수학Ⅰ', grade: '고2 대표', evidence: 'implemented' },
      },
      { label: '대수 · 거듭제곱근과 지수의 확장', href: '/middle-school/pre-algebra?profile=kr-high-2-algebra&unit=h1-real-nth-roots', ready: true, availability: 'ready' },
      { label: '대수 · 지수식의 계산과 활용', href: '/middle-school/pre-algebra?profile=kr-high-2-algebra&unit=h1-rational-exponent-simplify', ready: true, availability: 'ready' },
      { label: '대수 · 로그의 성질과 밑의 변환', href: '/middle-school/pre-algebra?profile=kr-high-2-algebra&unit=h1-log-properties', ready: true, availability: 'ready' },
      { label: '대수 · 상용로그와 활용', href: '/middle-school/pre-algebra?profile=kr-high-2-algebra&unit=h1-common-log-basic', ready: true, availability: 'ready' },
      { label: '대수 · 지수함수와 그래프', href: '/middle-school/pre-algebra?profile=kr-high-2-algebra&unit=h1-exponential-graph-properties', ready: true, availability: 'ready' },
      { label: '대수 · 지수방정식과 지수부등식', href: '/middle-school/pre-algebra?profile=kr-high-2-algebra&unit=h1-exponential-equations-linear', ready: true, availability: 'ready' },
      { label: '대수 · 로그함수와 그래프', href: '/middle-school/pre-algebra?profile=kr-high-2-algebra&unit=h1-log-graph-properties', ready: true, availability: 'ready' },
      { label: '대수 · 로그방정식과 로그부등식', href: '/middle-school/pre-algebra?profile=kr-high-2-algebra&unit=h1-log-equations-same-base', ready: true, availability: 'ready' },
      { label: '대수 · 일반각·호도법과 부채꼴', href: '/middle-school/pre-algebra?profile=kr-high-2-algebra&unit=h2-general-coterminal-angles', ready: true, availability: 'ready' },
      { label: '대수 · 삼각함수의 정의·성질과 활용', href: '/middle-school/pre-algebra?profile=kr-high-2-algebra&unit=h2-point-trig-values', ready: true, availability: 'ready' },
      { label: '대수 · 삼각함수의 그래프와 여러 가지 각', href: '/middle-school/pre-algebra?profile=kr-high-2-algebra&unit=h2-basic-trig-graph-properties', ready: true, availability: 'ready' },
      { label: '대수 · 삼각방정식과 삼각부등식', href: '/middle-school/pre-algebra?profile=kr-high-2-algebra&unit=h2-basic-trig-equations', ready: true, availability: 'ready' },
      { label: '대수 · 수열의 뜻과 등차수열', href: '/middle-school/pre-algebra?profile=kr-high-2-algebra&unit=sequence-patterns-general-term', ready: true, availability: 'ready' },
      { label: '대수 · 등차수열의 합과 부분합', href: '/middle-school/pre-algebra?profile=kr-high-2-algebra&unit=arithmetic-partial-sums', ready: true, availability: 'ready' },
      { label: '대수 · 등비수열과 등비수열의 합', href: '/middle-school/pre-algebra?profile=kr-high-2-algebra&unit=geometric-partial-sums', ready: true, availability: 'ready' },
      { label: '대수 · 수열의 활용과 금융', href: '/middle-school/pre-algebra?profile=kr-high-2-algebra&unit=compound-interest-annuities', ready: true, availability: 'ready' },
      { label: '대수 · 시그마와 여러 가지 수열의 합', href: '/middle-school/pre-algebra?profile=kr-high-2-algebra&unit=sigma-notation', ready: true, availability: 'ready' },
      { label: '대수 · 군수열과 수열의 귀납적 정의', href: '/middle-school/pre-algebra?profile=kr-high-2-algebra&unit=grouped-sequences', ready: true, availability: 'ready' },
      { label: '대수 · 점화식의 변형과 일반항', href: '/middle-school/pre-algebra?profile=kr-high-2-algebra&unit=affine-recurrences', ready: true, availability: 'ready' },
      { label: '대수 · 수학적 귀납법', href: '/middle-school/pre-algebra?profile=kr-high-2-algebra&unit=induction-structure', ready: true, availability: 'ready' },
      {
        label: '미적분Ⅰ (함수의 극한과 연속, 미분, 적분)',
        href: '/middle-school/pre-algebra?profile=kr-high-2-calculus-1',
        ready: true,
        availability: 'partial',
        meta: { legacy: '구 수학Ⅱ', grade: '고2 대표', evidence: 'implemented' },
      },
      {
        label: '확률과 통계 (경우의 수, 확률, 확률분포, 통계적 추정)',
        href: '/middle-school/pre-algebra?profile=kr-high-2-probability-statistics',
        ready: true,
        availability: 'partial',
        meta: { legacy: '구 확률과 통계', grade: '고2 대표', evidence: 'implemented' },
      },
    ],
  },

  // 진로 선택 — '고3 대표'는 2022 개정이 완전히 적용된 뒤의 배정이다. 2027학년도 수능까지는
  // 실제 고3이 아직 2015 개정(미적분·기하)을 쓰므로, 여기 미적분Ⅱ는 그 세대에는 해당하지 않는다.
  {
    id: 'kr-2022-career',
    officialType: 'career-elective',
    title: '진로 선택',
    subtitle: 'Career Electives · 미적분Ⅱ · 기하 · 경제/AI/직무 수학',
    availability: 'partial',
    notice: '"고3 대표"는 2022 개정이 완전히 적용된 뒤(2028학년도 수능부터)의 배정 기준입니다. 2027학년도 수능까지 실제 고3은 아직 2015 개정 과목(미적분·기하)으로 응시합니다 — 지금 고3에게 맞는 이름은 "학년별 보기"를 확인하세요.',
    topics: [
      {
        label: '미적분Ⅱ (수열의 극한, 여러 가지 함수의 미분, 여러 가지 적분법)',
        href: '/middle-school/pre-algebra?profile=kr-high-3-calculus-2',
        ready: true,
        availability: 'partial',
        meta: { legacy: '구 미적분', grade: '고3 대표', evidence: 'implemented' },
      },
      {
        label: '기하 (이차곡선, 평면벡터, 공간도형과 공간벡터)',
        href: '/middle-school/pre-algebra?profile=kr-high-3-geometry',
        ready: true,
        availability: 'partial',
        meta: { legacy: '구 기하', grade: '고3 대표', evidence: 'implemented' },
      },
      {
        label: '경제 수학 (수와 경제, 함수와 경제, 미분과 경제, 금융과 경제)',
        href: '#',
        ready: false,
        availability: 'planned',
        meta: { grade: '고2·고3', evidence: 'catalogued' },
      },
      {
        label: '인공지능 수학 (AI와 수학, 자료 표현, 분류와 예측, 최적화)',
        href: '#',
        ready: false,
        availability: 'planned',
        meta: { grade: '고2·고3', evidence: 'catalogued' },
      },
      {
        label: '직무 수학 (직무 상황의 수와 연산, 변화와 관계, 자료 처리)',
        href: '#',
        ready: false,
        availability: 'planned',
        meta: { grade: '고2·고3', evidence: 'catalogued' },
      },
    ],
  },

  // 융합 선택
  {
    id: 'kr-2022-convergence',
    officialType: 'convergence-elective',
    title: '융합 선택',
    subtitle: 'Convergence Electives · 수학과 문화 · 실용 통계 · 수학과제 탐구',
    availability: 'planned',
    topics: [
      {
        label: '수학과 문화 (수학과 예술·사회·문화 맥락 탐구)',
        href: '#',
        ready: false,
        availability: 'planned',
        meta: { grade: '고2·고3', evidence: 'catalogued' },
      },
      {
        label: '실용 통계 (통계적 문제 해결, 자료 분석, 통계적 추론 활용)',
        href: '#',
        ready: false,
        availability: 'planned',
        meta: { grade: '고2·고3', evidence: 'catalogued' },
      },
      {
        label: '수학과제 탐구 (주제 선정, 수학적 탐구 활동, 결과 보고서)',
        href: '#',
        ready: false,
        availability: 'planned',
        meta: { grade: '고2·고3', evidence: 'catalogued' },
      },
    ],
  },

  // 전문·심화 과목 (접어두기 가능)
  {
    id: 'kr-2022-professional',
    officialType: 'professional',
    title: '전문·심화 과목',
    subtitle: 'Advanced & Specialized Courses · 과학고 및 심화 트랙',
    availability: 'planned',
    topics: [
      { label: '전문 수학 (고급 대수·미적분·기하 융합 모델링)', href: '#', ready: false, availability: 'planned' },
      { label: '이산 수학 (명제논리, 그래프 이론, 점화식과 조합)', href: '#', ready: false, availability: 'planned' },
      { label: '고급 대수 (복소수 극형식, 행렬식, 다항식 심화)', href: '#', ready: false, availability: 'planned' },
      { label: '고급 미적분 (초월함수 극한, 급수 수렴 판정, 편미분 기초)', href: '#', ready: false, availability: 'planned' },
      { label: '고급 기하 (공간좌표와 3차원 벡터, 사영기하 기초)', href: '#', ready: false, availability: 'planned' },
    ],
  },
];

/**
 * 3. 국제학교 과정 인덱스 (International Courses)
 */
const INTERNATIONAL_COURSE_STAGE_SEEDS = [
  {
    id: 'intl-arithmetic',
    title: 'Arithmetic & Foundations',
    subtitle: 'Number sense and operations',
    availability: 'ready',
    topics: [
      { label: 'Grades 1–6 Operations Practice', href: '/elementary/practice', ready: true, availability: 'ready' },
      { label: 'Fractions, Decimals & Ratios', href: '/elementary/practice?grade=6', ready: true, availability: 'ready' },
    ],
  },
  {
    id: 'intl-pre-algebra',
    title: 'Pre-Algebra',
    subtitle: 'Prepare for symbolic algebra',
    availability: 'ready',
    topics: [
      { label: 'Pre-Algebra Core Practice Generator', href: '/middle-school/pre-algebra?profile=pre-algebra', ready: true, availability: 'ready' },
      { label: 'Primes & Prime Factorization', href: '/middle-school/prime-factorization', ready: true, availability: 'ready' },
      { label: 'GCF & LCM', href: '/middle-school/gcd-lcm', ready: true, availability: 'ready' },
      { label: 'Integers & Rational Numbers', href: '/middle-school/integers-rationals', ready: true, availability: 'ready' },
      { label: 'Ratios & Proportions', href: '/middle-school/proportion', ready: true, availability: 'ready' },
      { label: 'Statistics & Frequency Tables', href: '/middle-school/pre-algebra?profile=pre-algebra&unit=frequency-table', ready: true, availability: 'ready' },
    ],
  },
  {
    id: 'intl-algebra-1',
    title: 'Algebra 1',
    subtitle: 'Expressions, equations and graphs',
    availability: 'ready',
    topics: [
      { label: 'Algebra 1 Core Practice Generator', href: '/middle-school/pre-algebra?profile=algebra-1', ready: true, availability: 'ready' },
      { label: 'Linear Inequalities', href: '/middle-school/pre-algebra?profile=algebra-1&unit=linear-inequalities-2', ready: true, availability: 'ready' },
      { label: 'Systems of Linear Equations', href: '/middle-school/pre-algebra?profile=algebra-1&unit=systems-linear', ready: true, availability: 'ready' },
      { label: 'Linear Functions & Graphs', href: '/middle-school/pre-algebra?profile=algebra-1&unit=linear-functions-2', ready: true, availability: 'ready' },
      { label: 'Quadratic Functions', href: '/middle-school/pre-algebra?profile=algebra-1&unit=quadratic-functions', ready: true, availability: 'ready' },
      { label: 'Probability & Categorical Data', href: '/middle-school/pre-algebra?profile=algebra-1&unit=probability-2', ready: true, availability: 'ready' },
    ],
  },
  {
    id: 'intl-geometry',
    title: 'Geometry',
    subtitle: 'Shapes, measurement and proof',
    availability: 'ready',
    topics: [
      { label: 'Geometry Foundations (Points, Lines, Angles)', href: '/middle-school/basic-figures?unit=visual-foundations', ready: true, availability: 'ready' },
      { label: 'Truth Tables & Logical Statements', href: '/middle-school/basic-figures?profile=international&unit=logic-truth-tables', ready: true, availability: 'ready' },
      { label: 'Converse, Inverse & Contrapositive', href: '/middle-school/basic-figures?profile=international&unit=logic-conditional-forms', ready: true, availability: 'ready' },
      { label: 'Law of Detachment & Law of Syllogism', href: '/middle-school/basic-figures?profile=international&unit=logic-detachment-syllogism', ready: true, availability: 'ready' },
      { label: 'Algebraic & Geometric Proof Properties', href: '/middle-school/basic-figures?profile=international&unit=logic-segment-angle-properties', ready: true, availability: 'ready' },
      { label: 'Congruence & Similarity', href: '/middle-school/basic-figures?unit=triangle-congruence-similarity', ready: true, availability: 'ready' },
      { label: 'Isosceles Triangles & Right-Triangle Congruence', href: '/middle-school/basic-figures?unit=isosceles-triangle-properties', ready: true, availability: 'ready' },
      { label: 'Circumcenter & Incenter', href: '/middle-school/basic-figures?unit=triangle-circumcenter', ready: true, availability: 'ready' },
      { label: 'Parallelograms & Special Quadrilaterals', href: '/middle-school/basic-figures?unit=parallelogram-properties', ready: true, availability: 'ready' },
      { label: 'Similarity Conditions & Right-Triangle Similarity', href: '/middle-school/basic-figures?unit=similarity-conditions', ready: true, availability: 'ready' },
      { label: 'Segment Ratios, Midsegments & Centroids', href: '/middle-school/basic-figures?unit=parallel-line-segment-ratio', ready: true, availability: 'ready' },
      { label: 'Pythagorean Theorem Applications', href: '/middle-school/basic-figures?unit=pythagorean-applications', ready: true, availability: 'ready' },
      { label: 'Coordinate Geometry & Proofs', href: '/middle-school/basic-figures?unit=high-coordinate-geometry', ready: true, availability: 'ready' },
      { label: 'Circle Theorems & Chords', href: '/middle-school/basic-figures?profile=international&unit=circle-chord-properties', ready: true, availability: 'ready' },
      { label: 'Tangents & Circumscribed Polygons', href: '/middle-school/basic-figures?profile=international&unit=circle-tangent-properties', ready: true, availability: 'ready' },
      { label: 'Inscribed Angles & Cyclic Quadrilaterals', href: '/middle-school/basic-figures?profile=international&unit=circle-inscribed-angles', ready: true, availability: 'ready' },
      { label: 'Tangent-Chord Angles & Circle Geometry', href: '/middle-school/basic-figures?profile=international&unit=circle-tangent-chord-angles', ready: true, availability: 'ready' },
      { label: 'Translations', href: '/middle-school/basic-figures?profile=international&unit=transform-translation', ready: true, availability: 'ready' },
      { label: 'Reflections', href: '/middle-school/basic-figures?profile=international&unit=transform-reflection', ready: true, availability: 'ready' },
      { label: 'Rotations', href: '/middle-school/basic-figures?profile=international&unit=transform-rotation', ready: true, availability: 'ready' },
      { label: 'Dilations & Scale Factor', href: '/middle-school/basic-figures?profile=international&unit=transform-dilation', ready: true, availability: 'ready' },
      { label: 'Dilations & Area Ratio', href: '/middle-school/basic-figures?profile=international&unit=transform-dilation-area', ready: true, availability: 'ready' },
    ],
  },
  {
    id: 'intl-algebra-2',
    title: 'Algebra 2',
    subtitle: 'Functions, polynomials and exponentials',
    availability: 'ready',
    topics: [
      { label: 'Algebra 2 Core Practice Generator', href: '/middle-school/pre-algebra?profile=algebra-2', ready: true, availability: 'ready' },
      { label: 'Polynomials & Complex Numbers', href: '/middle-school/pre-algebra?profile=algebra-2&unit=complex-numbers', ready: true, availability: 'ready' },
      { label: 'Rational & Radical Functions', href: '/middle-school/pre-algebra?profile=algebra-2&unit=rational-radical-functions', ready: true, availability: 'ready' },
      { label: 'Exponential & Logarithmic Functions', href: '/middle-school/pre-algebra?profile=algebra-2&unit=exponential-equations', ready: true, availability: 'ready' },
      { label: 'Sequences & General Terms', href: '/middle-school/pre-algebra?profile=algebra-2&unit=sequence-patterns-general-term', ready: true, availability: 'ready' },
      { label: 'Arithmetic Sequences & Series', href: '/middle-school/pre-algebra?profile=algebra-2&unit=arithmetic-partial-sums', ready: true, availability: 'ready' },
      { label: 'Geometric Sequences & Series', href: '/middle-school/pre-algebra?profile=algebra-2&unit=geometric-partial-sums', ready: true, availability: 'ready' },
      { label: 'Compound Interest & Annuities', href: '/middle-school/pre-algebra?profile=algebra-2&unit=compound-interest-annuities', ready: true, availability: 'ready' },
      { label: 'Sigma & Power Sums', href: '/middle-school/pre-algebra?profile=algebra-2&unit=sigma-notation', ready: true, availability: 'ready' },
      { label: 'Telescoping & Arithmetic-Geometric Sums', href: '/middle-school/pre-algebra?profile=algebra-2&unit=telescoping-rational-sums', ready: true, availability: 'ready' },
      { label: 'Recursive Sequences', href: '/middle-school/pre-algebra?profile=algebra-2&unit=recursive-additive-sequences', ready: true, availability: 'ready' },
      { label: 'Mathematical Induction', href: '/middle-school/pre-algebra?profile=algebra-2&unit=induction-structure', ready: true, availability: 'ready' },
    ],
  },
  {
    id: 'intl-precalculus',
    title: 'Precalculus',
    subtitle: 'Advanced functions, trigonometry and vectors',
    availability: 'ready',
    topics: [
      { label: 'Precalculus Core Practice Generator', href: '/middle-school/pre-algebra?profile=precalculus', ready: true, availability: 'ready' },
      { label: 'Polynomial & Rational Functions', href: '/middle-school/pre-algebra?profile=precalculus&unit=precalc-rational-features', ready: true, availability: 'ready' },
      { label: 'Trigonometric Functions & Identities', href: '/middle-school/pre-algebra?profile=precalculus&unit=precalc-trig-graphs', ready: true, availability: 'ready' },
      { label: 'Polar & Parametric Functions', href: '/middle-school/pre-algebra?profile=precalculus&unit=precalc-polar-coordinates', ready: true, availability: 'ready' },
      { label: 'Vectors & Matrices', href: '/middle-school/pre-algebra?profile=precalculus&unit=precalc-vectors', ready: true, availability: 'ready' },
    ],
  },
  {
    id: 'intl-integrated',
    title: 'Integrated Math I–III',
    subtitle: 'Alternative U.S. high school pathway',
    availability: 'partial',
    topics: [
      { label: 'Math I · Linear Relationships & Data', href: '/middle-school/algebra-basics.html?unit=equations-review', ready: true, availability: 'ready' },
      { label: 'Math II · Geometry & Quadratics (Circles & Proofs)', href: '/middle-school/basic-figures?profile=international&unit=circle-properties-mixed', ready: true, availability: 'ready' },
      { label: 'Math III · Advanced Functions & Modeling', href: '#', ready: false, availability: 'planned' },
    ],
  },
];

/**
 * 4. 수학 영역별 인덱스 (Math Domains)
 */
const DOMAIN_STAGE_SEEDS = [
  {
    id: 'domain-numbers',
    title: '수와 연산',
    subtitle: 'Number & Operations',
    availability: 'ready',
    topics: [
      { label: '초등 수 연산 (자연수·분수·소수)', href: '/elementary/practice', ready: true, availability: 'ready' },
      { label: '소수와 소인수분해', href: '/middle-school/prime-factorization', ready: true, availability: 'ready' },
      { label: '최대공약수와 최소공배수', href: '/middle-school/gcd-lcm', ready: true, availability: 'ready' },
      { label: '정수와 유리수의 사칙계산', href: '/middle-school/integers-rationals', ready: true, availability: 'ready' },
      { label: '제곱근과 실수', href: '/middle-school/pre-algebra?profile=kr-middle-3&unit=radicals-real-numbers', ready: true, availability: 'ready' },
      { label: '복소수와 이차방정식', href: '/middle-school/pre-algebra?profile=algebra-2&unit=complex-numbers', ready: true, availability: 'ready' },
    ],
  },
  {
    id: 'domain-algebra',
    title: '변화와 관계 · 대수',
    subtitle: 'Algebra, Relations & Change',
    availability: 'ready',
    topics: [
      { label: '문자와 식 · 일차방정식', href: '/middle-school/algebra-basics.html?unit=expressions-review', ready: true, availability: 'ready' },
      { label: '좌표평면과 그래프 · 정비례와 반비례', href: '/middle-school/coordinate-plane', ready: true, availability: 'ready' },
      { label: '연립일차방정식과 부등식', href: '/middle-school/pre-algebra?profile=kr-middle-2&unit=systems-linear', ready: true, availability: 'ready' },
      { label: '일차함수와 이차함수', href: '/middle-school/pre-algebra?profile=kr-middle-3&unit=quadratic-functions', ready: true, availability: 'ready' },
      { label: '다항식과 나머지정리 · 행렬', href: '/middle-school/pre-algebra?profile=kr-high-1', ready: true, availability: 'ready' },
      { label: '지수함수와 로그함수 · 수열', href: '/middle-school/pre-algebra?profile=kr-high-2-algebra', ready: true, availability: 'ready' },
      { label: '미분과 적분의 기초', href: '/middle-school/pre-algebra?profile=kr-high-2-calculus-1', ready: true, availability: 'ready' },
    ],
  },
  {
    id: 'domain-geometry',
    title: '도형과 측정 · 기하',
    subtitle: 'Geometry & Measurement',
    availability: 'ready',
    topics: [
      { label: '기본 도형 (점·선·면·각)', href: '/middle-school/basic-figures?profile=kr&unit=visual-foundations', ready: true, availability: 'ready' },
      { label: '수능/고등 기하 기초', href: '/middle-school/basic-figures?profile=csat&unit=high-coordinate-geometry', ready: true, availability: 'ready' },
      { label: '이차곡선과 평면벡터', href: '/middle-school/pre-algebra?profile=kr-high-3-geometry', ready: true, availability: 'ready' },
      { label: '평면도형과 입체도형의 성질', href: '/middle-school/basic-figures?profile=kr&unit=polygon-foundations-basic', ready: true, availability: 'ready' },
      { label: '삼각비와 삼각함수 도형 활용', href: '/middle-school/basic-figures?unit=radians-trig-ratios&profile=csat', ready: true, availability: 'ready' },
      { label: '원의 성질 (원과 직선 · 원주각과 접선)', href: '/middle-school/basic-figures?profile=kr&unit=circle-properties-mixed', ready: true, availability: 'ready' },
      { label: '원주각과 내접사각형', href: '/middle-school/basic-figures?profile=kr&unit=circle-cyclic-quadrilaterals', ready: true, availability: 'ready' },
      { label: '도형의 이동 (평행이동·대칭이동·회전이동·닮음변환)', href: '/middle-school/basic-figures?profile=kr&unit=transform-translation', ready: true, availability: 'ready' },
      { label: '명제와 진리표 · 역·이·대우', href: '/middle-school/basic-figures?profile=kr&unit=logic-truth-tables', ready: true, availability: 'ready' },
      { label: '삼단논법과 타당한 추론', href: '/middle-school/basic-figures?profile=kr&unit=logic-detachment-syllogism', ready: true, availability: 'ready' },
      { label: '도형 증명의 등식 성질 (반사성·대칭성·이행성)', href: '/middle-school/basic-figures?profile=kr&unit=logic-segment-angle-properties', ready: true, availability: 'ready' },
    ],
  },
  {
    id: 'domain-data',
    title: '자료와 가능성 · 확률과 통계',
    subtitle: 'Data & Probability',
    availability: 'ready',
    topics: [
      { label: '중1 줄기와 잎 그림 · 도수분포표', href: '/middle-school/pre-algebra?profile=kr-middle-1&unit=frequency-table', ready: true, availability: 'ready' },
      { label: '중2·Algebra 1 경우의 수와 확률', href: '/middle-school/pre-algebra?profile=kr-middle-2&unit=probability-2', ready: true, availability: 'ready' },
      { label: '중3 대푯값과 산포도 (평균·표준편차)', href: '/middle-school/pre-algebra?profile=kr-middle-3&unit=data-variation', ready: true, availability: 'ready' },
      { label: '고2 확률과 통계 (확률분포·통계적 추정)', href: '/middle-school/pre-algebra?profile=kr-high-2-probability-statistics', ready: true, availability: 'ready' },
      { label: 'Pre-Algebra 통계 기초 (중심과 산포)', href: '/middle-school/pre-algebra?profile=pre-algebra&unit=center-spread', ready: true, availability: 'ready' },
    ],
  },
  {
    id: 'domain-modeling',
    title: '수학적 모델링과 문제 해결',
    subtitle: 'Modeling & Problem Solving',
    availability: 'ready',
    topics: [
      { label: '비례 관계 실생활 모델링', href: '/middle-school/proportion', ready: true, availability: 'ready' },
      { label: '일차방정식 문장제 활용', href: '/middle-school/algebra-basics.html?unit=equation-word-problems', ready: true, availability: 'ready' },
      { label: '거리·속력·시간 실생활 문제', href: '/middle-school/algebra-basics.html?unit=distance-speed-time', ready: true, availability: 'ready' },
      { label: '함수와 그래프 모델링', href: '/middle-school/pre-algebra?profile=algebra-1&unit=quadratic-functions', ready: true, availability: 'ready' },
      { label: '자료 기반 통계 모델링', href: '#', ready: false, availability: 'planned' },
    ],
  },
];

/**
 * Phase 1 canonical curriculum registry.
 *
 * The seed trees above preserve the existing navigation copy and ordering. Every
 * visible topic is normalized here before it is exposed to the UI, so future
 * category changes can target this registry without touching a generator.
 */
const VIEW_DEFINITIONS = [
  { id: 'kr-grade', system: 'KR', stages: KOREAN_GRADE_STAGE_SEEDS },
  { id: 'kr-subject-2022', system: 'KR', schoolLevel: 'high', stages: KOREAN_2022_SUBJECT_STAGE_SEEDS },
  { id: 'intl-course', system: 'INTL', stages: INTERNATIONAL_COURSE_STAGE_SEEDS },
  { id: 'domain', system: null, stages: DOMAIN_STAGE_SEEDS },
];

const OFFICIAL_TYPE_CODES = {
  '공통 과목': 'common',
  '일반 선택': 'general-elective',
  '진로 선택': 'career-elective',
  '융합 선택': 'convergence-elective',
  '전문·심화 과목': 'professional',
};

function queryValue(href, key) {
  if (!href || href === '#') return null;
  try {
    return new URL(href, 'https://curriculum.local').searchParams.get(key);
  } catch {
    return null;
  }
}

function representativeGrades(stage, topic) {
  const gradeText = topic.meta?.grade || '';
  const explicit = gradeText.match(/\d+/g)?.map((value) => {
    const grade = Number(value);
    if (gradeText.includes('고')) return grade + 9;
    if (gradeText.includes('중')) return grade + 6;
    return grade;
  });
  if (explicit?.length) return explicit;
  const elementary = stage.id.match(/^kr-elem-(\d+)$/);
  if (elementary) return [Number(elementary[1])];
  const middle = stage.id.match(/^kr-middle-(\d+)-grade$/);
  if (middle) return [Number(middle[1]) + 6];
  const high = stage.id.match(/^kr-high-(\d+)-grade$/);
  if (high) return [Number(high[1]) + 9];
  return [];
}

function schoolLevelFor(view, stage) {
  if (view.schoolLevel) return view.schoolLevel;
  if (stage.level) return stage.level;
  if (view.id === 'intl-course') return stage.id === 'intl-arithmetic' ? 'elementary' : 'secondary';
  return 'cross-level';
}

function systemFor(view, href) {
  if (view.system) return view.system;
  return queryValue(href, 'profile')?.startsWith('kr-') ? 'KR' : 'INTL';
}

function subjectFor(stage, topic) {
  return queryValue(topic.href, 'profile')
    || topic.meta?.revised2022
    || stage.id.replace(/^(kr-2022|kr-|intl-|domain-)/, '');
}

function unitIdsFor(topic) {
  const explicitUnit = queryValue(topic.href, 'unit');
  if (explicitUnit) return [explicitUnit];
  if (!topic.href || topic.href === '#') return [];
  return [topic.href.split('?')[0].replace(/^\//, '')];
}

const AUTOMATED_VALIDATION_ROUTE_PREFIXES = [
  '/elementary/practice',
  '/middle-school/prime-factorization',
  '/middle-school/gcd-lcm',
  '/middle-school/integers-rationals',
  '/middle-school/algebra-basics',
  '/middle-school/coordinate-plane',
  '/middle-school/proportion',
  '/middle-school/pre-algebra',
  '/middle-school/basic-figures',
];

function hasAutomatedValidationRoute(topic) {
  return Boolean(topic.href && AUTOMATED_VALIDATION_ROUTE_PREFIXES.some((prefix) => topic.href.startsWith(prefix)));
}

function evidenceFor(topic) {
  if (!topic.ready || topic.availability === 'planned') return 'catalogued';
  if (topic.meta?.evidence === 'catalogued') return 'catalogued';
  return hasAutomatedValidationRoute(topic) ? 'validated' : 'implemented';
}

function normalizeNode(view, stage, topic, topicIndex) {
  const system = systemFor(view, topic.href);
  const officialType = stage.officialType
    || OFFICIAL_TYPE_CODES[topic.meta?.officialType]
    || (system === 'KR' ? 'common' : 'course');
  const id = `${view.id}:${stage.id}:${topicIndex + 1}`;
  const labelIsEnglish = view.id === 'intl-course';
  const evidenceStatus = evidenceFor(topic);
  const visibility = ['validated', 'localized', 'published'].includes(evidenceStatus) ? 'public' : 'admin-preview';
  return Object.freeze({
    id,
    nodeType: 'topic',
    viewIds: [view.id],
    system,
    curriculumVersion: system === 'KR' ? '2022' : 'international',
    schoolLevel: schoolLevelFor(view, stage),
    representativeGrades: representativeGrades(stage, topic),
    officialType,
    subject: subjectFor(stage, topic),
    parentId: `${view.id}:${stage.id}`,
    labels: labelIsEnglish ? { en: topic.label, ko: topic.label } : { ko: topic.label, en: topic.label },
    route: topic.href === '#' || visibility !== 'public' ? null : topic.href,
    legacyRoutes: topic.href && topic.href !== '#' ? [topic.href] : [],
    profileId: queryValue(topic.href, 'profile'),
    unitIds: unitIdsFor(topic),
    availability: topic.availability || (topic.ready ? 'ready' : 'planned'),
    evidenceStatus,
    validationStatus: evidenceStatus === 'validated' ? 'passed' : 'not-validated',
    visibility,
    meta: topic.meta || {},
    legacyView: topic,
  });
}

const INDEX_ENTRIES = VIEW_DEFINITIONS.flatMap((view) => (
  view.stages.flatMap((stage) => stage.topics.map((topic, topicIndex) => normalizeNode(view, stage, topic, topicIndex)))
));

function canonicalKey(node) {
  if (node.route) return `${node.system}:${node.route}`;
  return `${node.system}:${node.officialType}:${node.subject}:${node.labels.ko}`;
}

const groupedEntries = new Map();
for (const entry of INDEX_ENTRIES) {
  const key = canonicalKey(entry);
  const entries = groupedEntries.get(key) || [];
  entries.push(entry);
  groupedEntries.set(key, entries);
}

const CATALOG_NODES = [...groupedEntries.entries()].map(([key, entries], index) => {
  const primary = entries[0];
  return Object.freeze({
    ...primary,
    id: `curriculum:${index + 1}`,
    canonicalKey: key,
    viewIds: [...new Set(entries.flatMap((entry) => entry.viewIds))],
    parentIds: [...new Set(entries.map((entry) => entry.parentId))],
    representativeGrades: [...new Set(entries.flatMap((entry) => entry.representativeGrades))],
    unitIds: [...new Set(entries.flatMap((entry) => entry.unitIds))],
    legacyRoutes: [...new Set(entries.flatMap((entry) => entry.legacyRoutes))],
    aliases: Object.freeze(Object.fromEntries(entries.map((entry) => [entry.viewIds[0], entry.labels]))),
    indexEntryIds: entries.map((entry) => entry.id),
    legacyView: undefined,
  });
});

export const LEGACY_PROFILE_COMPATIBILITY = Object.freeze({
  'kr-high-1': { subjects: ['common-math-1', 'common-math-2'], legacyRoute: '/middle-school/pre-algebra?profile=kr-high-1' },
  'kr-high-2-algebra': { subjects: ['algebra'], legacyRoute: '/middle-school/pre-algebra?profile=kr-high-2-algebra' },
  'kr-high-2-calculus-1': { subjects: ['calculus-1'], legacyRoute: '/middle-school/pre-algebra?profile=kr-high-2-calculus-1' },
  'kr-high-2-probability-statistics': { subjects: ['probability-statistics'], legacyRoute: '/middle-school/pre-algebra?profile=kr-high-2-probability-statistics' },
  'kr-high-3-calculus-2': { subjects: ['calculus-2'], legacyRoute: '/middle-school/pre-algebra?profile=kr-high-3-calculus-2' },
  'kr-high-3-geometry': { subjects: ['geometry'], legacyRoute: '/middle-school/pre-algebra?profile=kr-high-3-geometry' },
  'pre-algebra': { subjects: ['pre-algebra'], legacyRoute: '/middle-school/pre-algebra?profile=pre-algebra' },
  'algebra-1': { subjects: ['algebra-1'], legacyRoute: '/middle-school/pre-algebra?profile=algebra-1' },
  'algebra-2': { subjects: ['algebra-2'], legacyRoute: '/middle-school/pre-algebra?profile=algebra-2' },
  precalculus: { subjects: ['precalculus'], legacyRoute: '/middle-school/pre-algebra?profile=precalculus' },
});

export const CURRICULUM_CATALOG = Object.freeze({
  schemaVersion: 1,
  nodes: CATALOG_NODES,
  nodesById: Object.freeze(Object.fromEntries(CATALOG_NODES.map((node) => [node.id, node]))),
  indexEntries: INDEX_ENTRIES,
  legacyProfileCompatibility: LEGACY_PROFILE_COMPATIBILITY,
  engineAuditModule: './curriculumEngineAudit.js',
});

function projectStages(viewId, seeds) {
  const nodes = INDEX_ENTRIES.filter((node) => node.viewIds.includes(viewId));
  return seeds.map((stage) => ({
    ...stage,
    topics: nodes
      .filter((node) => node.parentId === `${viewId}:${stage.id}`)
      .map((node) => ({
        ...node.legacyView,
        ready: node.visibility === 'public' && node.legacyView.ready,
        href: node.visibility === 'public' ? node.legacyView.href : '#',
        catalogId: node.id,
        evidenceStatus: node.evidenceStatus,
        unitIds: node.unitIds,
      })),
  }));
}

// Backward-compatible projections consumed by CurriculumExplorer.
export const KOREAN_GRADE_STAGES = projectStages('kr-grade', KOREAN_GRADE_STAGE_SEEDS);
export const KOREAN_2022_SUBJECT_STAGES = projectStages('kr-subject-2022', KOREAN_2022_SUBJECT_STAGE_SEEDS);
export const INTERNATIONAL_COURSE_STAGES = projectStages('intl-course', INTERNATIONAL_COURSE_STAGE_SEEDS);
export const DOMAIN_STAGES = projectStages('domain', DOMAIN_STAGE_SEEDS);
