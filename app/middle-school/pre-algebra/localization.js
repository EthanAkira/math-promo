const EN_TAGS = ['Number & algebraic expressions', 'Equations & inequalities', 'Linear & quadratic functions', 'Probability & statistics', 'Complex numbers & polynomials', 'Matrices & counting', 'Exponents, logarithms & sequences'];

const COPY = {
  ko: { breadcrumb: '대수 교육과정', title: '한국 중등·고등 · Pre-Algebra · Algebra 1·2 · Precalculus 문제 생성기', tags: ['수·식의 계산', '방정식·부등식', '일차·이차함수', '확률·통계', '복소수·다항식', '행렬·경우의 수', '지수·로그·수열'], controls: ['교육과정', '영역', '한국 교육과정', '국제학교 과정'], visual: ['열', '행', '합계', '줄기', '잎', '예', '계급', '도수', '이원분할표'] },
  en: { breadcrumb: 'Algebra curriculum', title: 'Pre-Algebra · Algebra 1–2 · Precalculus Worksheet Generator', tags: EN_TAGS, controls: ['Curriculum', 'Domain', 'Korean curriculum', 'International-school curricula'], visual: ['Column', 'Row', 'Total', 'Stem', 'Leaf', 'Example', 'Class interval', 'Frequency', 'Two-way table'] },
  'zh-CN': { breadcrumb: '代数课程', title: '预备代数 · 代数 1–2 练习生成器', tags: ['数与代数式', '方程与不等式', '一次与二次函数', '概率与统计', '复数与多项式', '矩阵与计数', '指数、对数与数列'], controls: ['课程', '领域', '韩国课程', '国际学校课程'], visual: ['列', '行', '合计', '茎', '叶', '示例', '组距', '频数', '双向列联表'] },
  'zh-HK': { breadcrumb: '代數課程', title: '預備代數 · 代數 1–2 工作紙產生器', tags: ['數與代數式', '方程與不等式', '一次與二次函數', '概率與統計', '複數與多項式', '矩陣與計數', '指數、對數與數列'], controls: ['課程', '範疇', '韓國課程', '國際學校課程'], visual: ['欄', '列', '總計', '莖', '葉', '例子', '組別', '頻數', '雙向表'] },
  'zh-TW': { breadcrumb: '代數課程', title: '先備代數 · 代數 1–2 學習單產生器', tags: ['數與代數式', '方程式與不等式', '一次與二次函數', '機率與統計', '複數與多項式', '矩陣與計數', '指數、對數與數列'], controls: ['課程', '領域', '韓國課程', '國際學校課程'], visual: ['欄', '列', '總計', '莖', '葉', '例', '組距', '次數', '二維列聯表'] },
  ja: { breadcrumb: '代数カリキュラム', title: 'Pre-Algebra・Algebra 1–2 問題生成', tags: ['数と式の計算', '方程式と不等式', '一次・二次関数', '確率と統計', '複素数と多項式', '行列と場合の数', '指数・対数・数列'], controls: ['カリキュラム', '分野', '韓国の教育課程', 'インターナショナルスクール課程'], visual: ['列', '行', '合計', '幹', '葉', '例', '階級', '度数', '二元表'] },
  fr: { breadcrumb: 'Programme d’algèbre', title: 'Générateur Pré-algèbre · Algèbre 1–2', tags: ['Nombres et expressions', 'Équations et inéquations', 'Fonctions linéaires et quadratiques', 'Probabilités et statistiques', 'Complexes et polynômes', 'Matrices et dénombrement', 'Exponentielles, logarithmes et suites'], controls: ['Programme', 'Domaine', 'Programme coréen', 'Programmes internationaux'], visual: ['Colonne', 'Ligne', 'Total', 'Tige', 'Feuille', 'Exemple', 'Classe', 'Effectif', 'Tableau à double entrée'] },
  es: { breadcrumb: 'Currículo de álgebra', title: 'Generador de Preálgebra · Álgebra 1–2', tags: ['Números y expresiones', 'Ecuaciones e inecuaciones', 'Funciones lineales y cuadráticas', 'Probabilidad y estadística', 'Complejos y polinomios', 'Matrices y conteo', 'Exponentes, logaritmos y sucesiones'], controls: ['Currículo', 'Área', 'Currículo coreano', 'Currículos internacionales'], visual: ['Columna', 'Fila', 'Total', 'Tallo', 'Hoja', 'Ejemplo', 'Intervalo', 'Frecuencia', 'Tabla de doble entrada'] },
  ru: { breadcrumb: 'Курс алгебры', title: 'Генератор: предалгебра · Алгебра 1–2', tags: ['Числа и выражения', 'Уравнения и неравенства', 'Линейные и квадратичные функции', 'Вероятность и статистика', 'Комплексные числа и многочлены', 'Матрицы и комбинаторика', 'Степени, логарифмы и последовательности'], controls: ['Программа', 'Раздел', 'Корейская программа', 'Международные программы'], visual: ['Столбец', 'Строка', 'Итого', 'Стебель', 'Лист', 'Пример', 'Интервал', 'Частота', 'Двумерная таблица'] },
  ar: { breadcrumb: 'منهج الجبر', title: 'مولّد ما قبل الجبر · الجبر 1–2', tags: ['الأعداد والعبارات', 'المعادلات والمتباينات', 'الدوال الخطية والتربيعية', 'الاحتمالات والإحصاء', 'الأعداد المركبة وكثيرات الحدود', 'المصفوفات والعدّ', 'الأسس واللوغاريتمات والمتتاليات'], controls: ['المنهج', 'المجال', 'المنهج الكوري', 'مناهج المدارس الدولية'], visual: ['عمود', 'صف', 'المجموع', 'الساق', 'الورقة', 'مثال', 'الفئة', 'التكرار', 'جدول ثنائي'] },
  pt: { breadcrumb: 'Currículo de álgebra', title: 'Gerador de Pré-Álgebra · Álgebra 1–2', tags: ['Números e expressões', 'Equações e inequações', 'Funções lineares e quadráticas', 'Probabilidade e estatística', 'Complexos e polinômios', 'Matrizes e contagem', 'Expoentes, logaritmos e sequências'], controls: ['Currículo', 'Área', 'Currículo coreano', 'Currículos internacionais'], visual: ['Coluna', 'Linha', 'Total', 'Caule', 'Folha', 'Exemplo', 'Classe', 'Frequência', 'Tabela de dupla entrada'] },
  hi: { breadcrumb: 'बीजगणित पाठ्यक्रम', title: 'प्री-अल्जेब्रा · अल्जेब्रा 1–2 जनरेटर', tags: ['संख्याएँ और व्यंजक', 'समीकरण और असमिकाएँ', 'रैखिक और द्विघात फलन', 'प्रायिकता और सांख्यिकी', 'सम्मिश्र संख्याएँ और बहुपद', 'आव्यूह और गणना', 'घातांक, लघुगणक और अनुक्रम'], controls: ['पाठ्यक्रम', 'क्षेत्र', 'कोरियाई पाठ्यक्रम', 'अंतरराष्ट्रीय विद्यालय पाठ्यक्रम'], visual: ['स्तंभ', 'पंक्ति', 'कुल', 'तना', 'पत्ती', 'उदाहरण', 'वर्ग-अंतराल', 'बारंबारता', 'द्विमार्गी सारणी'] },
  vi: { breadcrumb: 'Chương trình đại số', title: 'Trình tạo Tiền đại số · Đại số 1–2', tags: ['Số và biểu thức', 'Phương trình và bất phương trình', 'Hàm bậc nhất và bậc hai', 'Xác suất và thống kê', 'Số phức và đa thức', 'Ma trận và phép đếm', 'Lũy thừa, logarit và dãy số'], controls: ['Chương trình', 'Lĩnh vực', 'Chương trình Hàn Quốc', 'Chương trình trường quốc tế'], visual: ['Cột', 'Hàng', 'Tổng', 'Thân', 'Lá', 'Ví dụ', 'Khoảng lớp', 'Tần số', 'Bảng hai chiều'] },
  id: { breadcrumb: 'Kurikulum aljabar', title: 'Pembuat Pra-Aljabar · Aljabar 1–2', tags: ['Bilangan dan bentuk aljabar', 'Persamaan dan pertidaksamaan', 'Fungsi linear dan kuadrat', 'Peluang dan statistika', 'Bilangan kompleks dan polinom', 'Matriks dan pencacahan', 'Eksponen, logaritma, dan barisan'], controls: ['Kurikulum', 'Bidang', 'Kurikulum Korea', 'Kurikulum sekolah internasional'], visual: ['Kolom', 'Baris', 'Total', 'Batang', 'Daun', 'Contoh', 'Interval kelas', 'Frekuensi', 'Tabel dua arah'] },
};

COPY['en-SG'] = COPY.en;

const CATEGORY_EN = {
  '수와 연산': 'Number & Operations', '문자와 식': 'Expressions & Equations', '좌표와 관계': 'Coordinates & Relationships', '비와 비율': 'Ratios & Percents', '자료와 가능성': 'Data & Statistics', '방정식과 부등식': 'Equations & Inequalities', '함수': 'Functions', '확률과 통계': 'Probability & Statistics', '다항식': 'Polynomials', '경우의 수': 'Counting', '행렬': 'Matrices', '집합과 명제': 'Sets & Logic', '지수와 로그': 'Exponents & Logarithms', '수열': 'Sequences', '미적분': 'Calculus', '수학적 모델링': 'Mathematical Modeling', '도형의 방정식': 'Coordinate Geometry', '삼각함수': 'Trigonometry', '종합평가': 'Comprehensive Review', '극좌표와 매개변수': 'Polar & Parametric', '이차곡선': 'Conic Sections', '벡터': 'Vectors', '수열의 극한': 'Sequence Limits', '미분법': 'Differentiation', '적분법': 'Integration', '공간도형': 'Spatial Geometry',
};

const CATEGORY_ZH = {
  '수와 연산': '数与运算', '문자와 식': '代数式', '좌표와 관계': '坐标与关系', '비와 비율': '比与百分数', '자료와 가능성': '数据与统计', '방정식과 부등식': '方程与不等式', '함수': '函数', '확률과 통계': '概率与统计', '다항식': '多项式', '경우의 수': '计数', '행렬': '矩阵', '집합과 명제': '集合与命题', '지수와 로그': '指数与对数', '수열': '数列', '미적분': '微积分', '수학적 모델링': '数学建模', '도형의 방정식': '坐标几何', '삼각함수': '三角函数', '종합평가': '综合练习', '극좌표와 매개변수': '极坐标与参数', '이차곡선': '圆锥曲线', '벡터': '向量', '수열의 극한': '数列极限', '미분법': '微分法', '적분법': '积分法', '공간도형': '空间几何',
};

const PROFILE_LABELS = {
  'zh-CN': ['韩国初中一年级', '韩国初中二年级', '韩国初中三年级', '韩国高中一年级', '韩国高二 · 代数', '韩国高二 · 微积分Ⅰ', '韩国高二 · 概率与统计', '韩国高三 · 微积分Ⅱ', '韩国高三 · 几何'],
  'zh-HK': ['韓國初中一年級', '韓國初中二年級', '韓國初中三年級', '韓國高中一年級', '韓國高中二年級 · 代數', '韓國高中二年級 · 微積分Ⅰ', '韓國高中二年級 · 概率與統計', '韓國高中三年級 · 微積分Ⅱ', '韓國高中三年級 · 幾何'],
  'zh-TW': ['韓國國中一年級', '韓國國中二年級', '韓國國中三年級', '韓國高中一年級', '韓國高中二年級 · 代數', '韓國高中二年級 · 微積分Ⅰ', '韓國高中二年級 · 機率與統計', '韓國高中三年級 · 微積分Ⅱ', '韓國高中三年級 · 幾何'],
  ja: ['韓国 中学校1年', '韓国 中学校2年', '韓国 中学校3年', '韓国 高校1年', '韓国 高校2年・代数', '韓国 高校2年・微積分Ⅰ', '韓国 高校2年・確率と統計', '韓国 高校3年・微積分Ⅱ', '韓国 高校3年・幾何'],
  fr: ['Corée · Collège 1', 'Corée · Collège 2', 'Corée · Collège 3', 'Corée · Lycée 1', 'Corée · Lycée 2 · Algèbre', 'Corée · Lycée 2 · Calcul I', 'Corée · Lycée 2 · Probabilités et statistiques', 'Corée · Lycée 3 · Calcul II', 'Corée · Lycée 3 · Géométrie'],
  es: ['Corea · Secundaria 1', 'Corea · Secundaria 2', 'Corea · Secundaria 3', 'Corea · Bachillerato 1', 'Corea · Bachillerato 2 · Álgebra', 'Corea · Bachillerato 2 · Cálculo I', 'Corea · Bachillerato 2 · Probabilidad y estadística', 'Corea · Bachillerato 3 · Cálculo II', 'Corea · Bachillerato 3 · Geometría'],
  ru: ['Корея · 7 класс', 'Корея · 8 класс', 'Корея · 9 класс', 'Корея · 10 класс', 'Корея · 11 класс · Алгебра', 'Корея · 11 класс · Анализ I', 'Корея · 11 класс · Вероятность и статистика', 'Корея · 12 класс · Анализ II', 'Корея · 12 класс · Геометрия'],
  ar: ['كوريا · الصف السابع', 'كوريا · الصف الثامن', 'كوريا · الصف التاسع', 'كوريا · الصف العاشر', 'كوريا · الصف الحادي عشر · الجبر', 'كوريا · الصف الحادي عشر · التفاضل والتكامل ١', 'كوريا · الصف الحادي عشر · الاحتمالات والإحصاء', 'كوريا · الصف الثاني عشر · التفاضل والتكامل ٢', 'كوريا · الصف الثاني عشر · الهندسة'],
  pt: ['Coreia · 7.º ano', 'Coreia · 8.º ano', 'Coreia · 9.º ano', 'Coreia · 10.º ano', 'Coreia · 11.º ano · Álgebra', 'Coreia · 11.º ano · Cálculo I', 'Coreia · 11.º ano · Probabilidade e estatística', 'Coreia · 12.º ano · Cálculo II', 'Coreia · 12.º ano · Geometria'],
  hi: ['कोरिया · कक्षा 7', 'कोरिया · कक्षा 8', 'कोरिया · कक्षा 9', 'कोरिया · कक्षा 10', 'कोरिया · कक्षा 11 · बीजगणित', 'कोरिया · कक्षा 11 · कलन I', 'कोरिया · कक्षा 11 · प्रायिकता और सांख्यिकी', 'कोरिया · कक्षा 12 · कलन II', 'कोरिया · कक्षा 12 · ज्यामिति'],
  vi: ['Hàn Quốc · Lớp 7', 'Hàn Quốc · Lớp 8', 'Hàn Quốc · Lớp 9', 'Hàn Quốc · Lớp 10', 'Hàn Quốc · Lớp 11 · Đại số', 'Hàn Quốc · Lớp 11 · Giải tích I', 'Hàn Quốc · Lớp 11 · Xác suất và thống kê', 'Hàn Quốc · Lớp 12 · Giải tích II', 'Hàn Quốc · Lớp 12 · Hình học'],
  id: ['Korea · Kelas 7', 'Korea · Kelas 8', 'Korea · Kelas 9', 'Korea · Kelas 10', 'Korea · Kelas 11 · Aljabar', 'Korea · Kelas 11 · Kalkulus I', 'Korea · Kelas 11 · Peluang dan statistika', 'Korea · Kelas 12 · Kalkulus II', 'Korea · Kelas 12 · Geometri'],
};

const KOREAN_PROFILE_IDS = ['kr-middle-1', 'kr-middle-2', 'kr-middle-3', 'kr-high-1', 'kr-high-2-algebra', 'kr-high-2-calculus-1', 'kr-high-2-probability-statistics', 'kr-high-3-calculus-2', 'kr-high-3-geometry'];

export function preAlgebraCopy(language) { return COPY[language] || COPY.en; }
export function preAlgebraProfileLabel(profile, language) {
  if (language === 'ko') return profile.label;
  const index = KOREAN_PROFILE_IDS.indexOf(profile.id);
  if (index >= 0 && PROFILE_LABELS[language]) return PROFILE_LABELS[language][index] || profile.labelEn;
  return profile.labelEn;
}
export function preAlgebraCategory(category, language) {
  if (language === 'ko') return category;
  if (language === 'zh-CN' || language === 'zh-HK' || language === 'zh-TW') return CATEGORY_ZH[category] || CATEGORY_EN[category] || category;
  return CATEGORY_EN[category] || category;
}
