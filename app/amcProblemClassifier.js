// Rule-based (keyword/regex) topic classifier for individual AMC problems.
// Deterministic heuristic over the parsed question text, ordered from most-specific
// to most-generic pattern so problems land in the appropriate sub-unit.

export function normalizeAmcText(raw) {
  if (!raw) return '';
  let t = String(raw);
  // Unfold typographic ligatures
  t = t.replace(/ﬀ/g, 'ff')
       .replace(/ﬁ/g, 'fi')
       .replace(/ﬂ/g, 'fl')
       .replace(/ﬃ/g, 'ffi')
       .replace(/ﬄ/g, 'ffl');

  // De-kern common spaced words from older PDF text extractions
  const deKern = [
    [/\bp\s+ositiv\s+e\b/gi, 'positive'],
    [/\bin\s+teger/gi, 'integer'],
    [/\bnu\s+mb\s*er/gi, 'number'],
    [/\bdi[f]{1,2}eren\s*t\b/gi, 'different'],
    [/\bho\s*w\s+man\s*y\b/gi, 'how many'],
    [/\bmin\s+utes\b/gi, 'minutes'],
    [/\bv\s+egetable\b/gi, 'vegetable'],
    [/\bJan\s+uary\b/gi, 'January'],
    [/\bFeb\s+ruary\b/gi, 'February'],
    [/\bab\s+ove\b/gi, 'above'],
    [/\bb\s+elo\s*w\b/gi, 'below'],
    [/\bb\s+oth\b/gi, 'both'],
    [/\breac\s+h\b/gi, 'reach'],
    [/\bheigh\s+t\b/gi, 'height'],
    [/\bligh\s+t\b/gi, 'light'],
    [/\bsc\s+ho\s*ol\b/gi, 'school'],
    [/\bteac\s+her/gi, 'teacher'],
    [/\bb\s+ough\s*t\b/gi, 'bought'],
    [/\bclim\s*b/gi, 'climb'],
    [/\bwa\s+ys\b/gi, 'ways'],
    [/\bcon\s+tains\b/gi, 'contains'],
    [/\bpro\s+duct\b/gi, 'product'],
    [/\bwhic\s*h\b/gi, 'which'],
    [/\bfollo\s*wing\b/gi, 'following'],
    [/\bda\s*y\b/gi, 'day'],
    [/\bda\s*yligh\s*t\b/gi, 'daylight'],
    [/\by\s+ello\s*w\b/gi, 'yellow'],
    [/\bbro\s*wn\b/gi, 'brown'],
    [/\bsho\s*ws\b/gi, 'shows'],
    [/\bmak\s+e\b/gi, 'make'],
    [/\bham\s+burger/gi, 'hamburger'],
    [/\bneigh\s*b\s*or/gi, 'neighbor'],
    [/\bfo\s*otball\b/gi, 'football'],
    [/\bmem\s+b\s*er/gi, 'member'],
    [/\bpla\s*ys?\b/gi, 'plays'],
    [/\bp\s+enc\S*\b/gi, 'pencil'],
    [/\bp\s+ound/gi, 'pound'],
    [/\bcoun\s+ted\b/gi, 'counted'],
    [/\bt\s*w\s*o\b/gi, 'two'],
    [/\bpartic\s+ular\b/gi, 'particular'],
    [/\beac\s*h\b/gi, 'each'],
    [/\bi\s+s\b/gi, 'is'],
    [/\bo\s*wns?\b/gi, 'owns'],
    [/\bev\s*ery\b/gi, 'every'],
    [/\bto\s*wn\b/gi, 'town'],
    [/\bsto\s*ol\b/gi, 'stool'],
    [/\bce\s*iling\b/gi, 'ceiling'],
    [/\bro\s*om\b/gi, 'room'],
  ];

  for (const [pat, rep] of deKern) {
    t = t.replace(pat, rep);
  }
  return t;
}

const RULES = [
  // 1. Logic & Specialty Math Puzzles
  {
    subjectId: 'logic-word-problems',
    unitId: 'clocks-calendars',
    test: /\b(?:clock|hands?\s+of\s+a\s+clock|o'clock|calendar|days?\s+of\s+the\s+week|monday|tuesday|wednesday|thursday|friday|saturday|sunday|leap\s+year|sunrise|sunset|daylight|noon|midnight|january|february|march|april|may|june|july|august|september|october|november|december)\b|\b(?:hours?\s+and\s+\d+\s+min|\d+\s*(?:am|pm)\b|on\s+what\s+day|what\s+time\s+was\s+it)|시계|시침|분침|달력|요일|윤년/i,
  },
  {
    subjectId: 'logic-word-problems',
    unitId: 'cryptarithms-puzzles',
    test: /\b(?:cryptarithm|each\s+letter\s+represents|distinct\s+digits?|magic\s+square|digit\s+puzzle|alphametic|each\s+of\s+the\s+letters|represents\s+a\s+(?:diﬀerent|different)|placed\s+in\s+(?:one\s+of\s+the|each\s+of\s+the|the)|crossnumber|code\s+word|represents\s+the\s+ten\s+digits|multiplication\s+problem\s+below|different\s+digits?\.?\s*what\s+is\s+[a-z]\s*\+\s*[a-z]|letters?\s+[a-z].*represent\s+different\s+digits)\b|암호산|복면산|마방진/i,
  },
  {
    subjectId: 'logic-word-problems',
    unitId: 'games-strategy',
    test: /\b(?:game\b|player|wins?\s+the\s+game|winning\s+strategy|tournament|nim\b)\b|게임|승리|전략|토너먼트/i,
  },

  // 2. Specialized Number Theory
  {
    subjectId: 'number-theory',
    unitId: 'units-digit-cycles',
    test: /\b(?:units?\s*digits?|ones?\s*digits?|last\s*digits?|tens?\s*digits?|final\s*digits?)\b|일의\s*자리|십의\s*자리|끝자리|거듭제곱.*주기/i,
  },
  {
    subjectId: 'number-theory',
    unitId: 'gcd-lcm',
    test: /\b(?:greatest\s+common\s+divisor|least\s+common\s+multiple|\bGCD\b|\bGCF\b|\bLCM\b|greatest\s+common\s+factor)\b|최대공약수|최소공배수/i,
  },
  {
    subjectId: 'number-theory',
    unitId: 'primes-factorization',
    test: /\b(?:prime\s+numbers?|prime\s+factors?|prime\s+factorization|primes?)\b|\d+\s*[\^·]\s*\d+.*=\s*\d+|\d+\s*[a-z]\s*[·*]\s*\d+\s*[a-z]|소수(?!\s*점)|소인수|소인수분해/i,
  },
  {
    subjectId: 'number-theory',
    unitId: 'divisors-multiples',
    test: /\b(?:positive\s+divisors?|number\s+of\s+divisors|multiples?\s+of|factors?\s+of|how\s+many\s+divisors|divisors?|are\s+both\s+n\b|positive\s+integer\s+values\s+of\s+n)\b|약수(?:의\s*개수)?|배수|약수와\s*배수/i,
  },
  {
    subjectId: 'number-theory',
    unitId: 'remainders-divisibility',
    test: /\b(?:remainders?|divisible\s+by|divisibility|leaves\s+a\s+remainder|left\s+over)\b|나머지|배수\s*판정|나누어떨/i,
  },
  {
    subjectId: 'number-theory',
    unitId: 'bases-digits',
    test: /\b(?:base[- ]\d+|base\s+(?:two|eight|ten|sixteen)|binary|sum\s+of\s+the\s+digits|two-digit|three-digit|four-digit|five-digit|\d+-digit|digits?\s+of\s+a\s+number|digits?\s+of\s+\d+|how\s+many\s+digits|contain(?:s)?\s+the\s+digit|whole\s+numbers?\s+between\s+\d+.*contain|nonnegative\s+integers\s+can\s+be\s+written|replacing\s+each\s+occurrence\s+of\s+the\s+digit|use\s+the\s+four\s+digits|digits?\s+0\s*,\s*1|digits?\s+\d(?:\s*,\s*\d)+)\b|진법|자릿수|각\s*자리.*합/i,
  },

  // 3. Specialized Applied Word Problems & Rates
  {
    subjectId: 'algebra',
    unitId: 'speed-distance-time',
    test: /\b(?:miles\s+per\s+hour|\bmph\b|km\/h|speed\s+of|speed|travels?\s+at|average\s+speed|distance\s+between|head\s+start|overtake|milepost|bikers?|bicycl\w*|miles\s+traveled|walking|running|detour|straight-line\s+distance|spaced\s+along\s+one\s+side\s+of\s+a\s+straight\s+road)\b|속력|시속|거리.*시간|왕복|추격/i,
  },
  {
    subjectId: 'algebra',
    unitId: 'work-rate',
    test: /\b(?:working\s+together|rate\s+of\s+work|fill(?:s)?\s+a\s+(?:tank|pool)|empty(?:s)?\s+a\s+(?:tank|pool)|worker|job\s+takes|evaporates|gallons?|paint.*dimple|peel\w*\s+at\s+the\s+rate|laps?\s+in\s+\d+\s+minutes|lap\s+time|battery\s+will\s+last)\b|일의\s*양|작업률|물통|채우는/i,
  },
  {
    subjectId: 'algebra',
    unitId: 'percentages-money',
    test: /\b(?:percent|percentage|discount|sales\s+tax|profit|markup|cost\s+of|selling\s+price|interest\s+rate|invest(?:ment|ed)|loss|gain)\b|\d+\s*%/i,
  },

  // 4. Statistics & Data Analysis
  {
    subjectId: 'statistics-data',
    unitId: 'statistics-averages',
    test: /\b(?:mean\b|median\b|mode\b|average\s+score|average\s+age|average\s+of|average|averaged)\b|산술평균|중앙값|최빈값|대푯값|평균/i,
  },
  {
    subjectId: 'statistics-data',
    unitId: 'charts-data-analysis',
    test: /\b(?:bar\s+graph|pie\s+chart|pie\s+graph|line\s+graph|table\s+shows|histogram|chart\s+shows|data\s+in\s+the\s+table|graph\s+shows|graph\s+below|which\s+graph\s+illustrates|elevation)\b|막대그래프|꺾은선|도수분포표|원그래프|표.*분석/i,
  },

  // 5. Specialized Geometry
  {
    subjectId: 'geometry',
    unitId: 'circles',
    test: /\b(?:circles?|circumference|radius|radii|diameter|sectors?|semicircles?|tangent\s+to\s+the\s+circle|concentric)\b|원(?:의|과|에)|반지름|지름|부채꼴|원주/i,
  },
  {
    subjectId: 'geometry',
    unitId: 'solids',
    test: /\b(?:cub(?:e|es|ical)\b|cylinder|sphere|prism|pyramid|cone|volume|surface\s+area|rectangular\s+box|box\s+that\s+holds)\b|입체도형|부피|겉넓이|원기둥|각기둥|구(?:의\s*부피)|정육면체|직육면체/i,
  },
  {
    subjectId: 'geometry',
    unitId: 'coordinate-geometry',
    test: /\b(?:coordinates?|x-axis|y-axis|slope\s+of|midpoint|lattice\s+points?|xy-plane|curves?\s*x\^?2)\b|\(\s*-?\d+\s*,\s*-?\d+\s*\)|좌표평면|격자점|기울기|좌표/i,
  },
  {
    subjectId: 'geometry',
    unitId: 'symmetry-transformations',
    test: /\b(?:symmetr(?:y|ic)|reflection|rotation|folded|unfolded|net\s+of\s+(?:a|the)\s+cube|counterclockwise|clockwise|spinner\s+point)\b|대칭|선대칭|점대칭|회전|전개도|접었/i,
  },
  {
    subjectId: 'geometry',
    unitId: 'triangles',
    test: /\b(?:triangles?|hypotenuse|equilateral|isosceles|pythagor(?:ean)?|altitude\s+of\s+a\s+triangle)\b|삼각형|빗변|이등변|정삼각형|피타고라스/i,
  },
  {
    subjectId: 'geometry',
    unitId: 'quadrilaterals-polygons',
    test: /\b(?:squares?|rectangles?|rectangular|parallelograms?|trapezoids?|rhombus|polygons?|pentagons?|hexagons?|octagons?|diagonals?\s+of\s+a\s+polygon|geoboard|kites?|tiles?|quadrilaterals?)\b|사각형|직사각형|정사각형|평행사변형|사다리꼴|마름모|다각형|육각형|팔각형|대각선/i,
  },
  {
    subjectId: 'geometry',
    unitId: 'area-perimeter',
    test: /\b(?:area\s+of|perimeter\s+of|shaded\s+region|area\s+is|perimeter\s+is|larger\s+in\s+area|largest\s+area|square\s+inches\s+in\s+the\s+area|area\s+enclosed)\b|\bcm\b|넓이|둘레|색칠한\s*부분/i,
  },
  {
    subjectId: 'geometry',
    unitId: 'angles-plane-figures',
    test: /\b(?:angles?|degrees?|\b\d+\^?\\circ\b|parallel\s+lines?|perpendicular|transversal)\b|각도|내각|외각|평행선|수직/i,
  },

  // 6. Combinatorics, Venn Diagrams & Probability
  {
    subjectId: 'combinatorics-probability',
    unitId: 'venn-sets',
    test: /\b(?:venn\s+diagram|both\s+.*and|neither\s+.*nor|play\s+both|in\s+both|overlap|survey\s+of|owns?\s+a\s+car.*motorcycle.*both|wearing\s+both|neither)\b|벤다이어그램|모두|어느\s*쪽도|동시에.*참여/i,
  },
  {
    subjectId: 'combinatorics-probability',
    unitId: 'paths-grids',
    test: /\b(?:paths?\s+from|grid\s+of|walk\s+from|route\s+from|shortest\s+route|city\s+grid|start\s+finish)\b|경로|길찾기|격자길|최단\s*거리/i,
  },
  {
    subjectId: 'combinatorics-probability',
    unitId: 'permutations-arrangements',
    test: /\b(?:arrangements?|arranged\s+in\s+a\s+line|in\s+a\s+row|seating|permutations?|switched\s+seats|end\s+seat)\b|일렬로\s*나열|순서대로|순열/i,
  },
  {
    subjectId: 'combinatorics-probability',
    unitId: 'permutations-combinations',
    test: /\b(?:combinations?|chosen\s+from|select\s+\d+|team\s+of\s+\d+|committee|subsets?|each\s+team\s+plays|terms\s+that\s+include\s+all\s+four\s+variables)\b|조합|선택하는|대표.*선출|팀을\s*구성/i,
  },
  {
    subjectId: 'combinatorics-probability',
    unitId: 'probability',
    test: /\b(?:probability|randomly|odds\s+of|fair\s+coin|fair\s+die|dice|rolled|flipped|drawn\s+at\s+random)\b|확률|무작위|주사위|동전|제비뽑기/i,
  },
  {
    subjectId: 'combinatorics-probability',
    unitId: 'counting',
    test: /\b(?:how\s+many\s+(?:ways|different|distinct|possible)|number\s+of\s+(?:ways|possibilities)|how\s+many\s+rectangles|how\s+many\s+integers|how\s+many\s+whole\s+numbers)\b|경우의\s*수|방법의\s*수/i,
  },

  // 7. General Algebra & Functions
  {
    subjectId: 'algebra',
    unitId: 'sequences-patterns',
    test: /\b(?:sequences?|patterns?|arithmetic\s+progression|geometric\s+progression|consecutive\s+(?:odd|even|integers)|term\s+in\s+the\s+sequence|population|triples|doubles|bounce|bouncing|fewest\s+number\s+of\s+jumps)\b|수열|규칙성|패턴/i,
  },
  {
    subjectId: 'algebra',
    unitId: 'ratios-percent',
    test: /\b(?:ratios?\s+of|proportion(?:al)?|in\s+the\s+ratio|scale\s+factor|ratios?|traded\s+for|worth|exchange\s+rate|represents\s+\d+\s+kilometers|length\s+represents|how\s+many\s+pounds.*make.*hamburgers|two-thirds\s+of\s+the\s+people|two-thirds\s+of\s+the\s+boys)\b|비와\s*비율|비례식|비례배분|비율/i,
  },
  {
    subjectId: 'algebra',
    unitId: 'equations-inequalities',
    test: /\b(?:solve\s+for|equations?|inequality|system\s+of\s+equations|satisfies?\s+the\s+equation|solutions?\s+to|integer\s+solutions?|\\le|\\ge|<=|>=|< a < b < c|satisﬁes|satisfies)\b|[a-z]\s*=\s*\d.*and|방정식|부등식|연립방정식/i,
  },
  {
    subjectId: 'algebra',
    unitId: 'expressions-substitution',
    test: /\b(?:algebraic\s+expression|substitut|polynomial|factored|factor\s+the\s+expression|for\s+[a-z]\s*=\s*\d+|operation\s+[⊗\*∗⊕\^]|defined\s+for\s+all|if\s+a\s*bc\s*d)\b|[a-z]\s*[⊗\*∗⊕]\s*[a-z]|문자식|식의\s*값|대입/i,
  },
  {
    subjectId: 'algebra',
    unitId: 'arithmetic-operations',
    test: /value\s+of|\b(?:fraction|decimal|evaluate|calculate|order\s+of\s+operations|which\s+of\s+the\s+following\s+numbers?\s+is\s+(?:largest|smallest)|is\s+smallest|is\s+largest|reciprocal|product\s+of|sum\s+of|their\s+product\s+is\s+\d+\s+and\s+their\s+sum\s+is|triplet\s+of\s+numbers|sum\s+NOT\s+equal|correct\s+ordering\s+of\s+the\s+three\s+numbers|greatest\s+integer\s+less\s+than|question\s+mark\s+between|what\s+is\s+[a-z]\s*\+\s*[a-z])\b|[×·÷\+\-\*\/]\s*\d+\s*|[+*\/÷·-]\s*.*=|사칙연산|연산\s*순서|분수|소수의\s*계산|값은/i,
  },

  // 8. Functions & Advanced
  { subjectId: 'functions', unitId: 'function-properties', test: /\bfunctions?\b|[fgh]\s*\(\s*[a-z0-9]|함수/i },
  { subjectId: 'advanced', unitId: 'trigonometry', test: /\b(?:sin\b|cos\b|tan\b|trigonometr)\b|삼각비|삼각함수/i },
  { subjectId: 'advanced', unitId: 'complex-numbers', test: /\b(?:complex\s+numbers?|imaginary\s+unit)\b|복소수|허수/i },

  // 9. Logic & Word Problems Fallback
  {
    subjectId: 'logic-word-problems',
    unitId: 'logical-reasoning',
    test: /\b(?:liar|truth-teller|logically|deduc|must\s+be\s+true|which\s+of\s+the\s+following\s+statements|if\s+and\s+only\s+if|true\s+or\s+false|impossible|none\s+of\s+the\s+three\s+statements|eye\s+color|siblings?)\b|참과\s*거짓|논리|추론|반드시\s*참/i,
  },
  {
    subjectId: 'logic-word-problems',
    unitId: 'word-problems',
    test: /\b(?:years?\s+old|age\s+of|dollars?|\$\d+|cents?|spent|bought|shared\s+equally|price|cost|sisters?|brothers?|friends?|cash|money|cookies?|candies?|marbles?|pencils?|books?|score|jelly\s*beans?|heads\s+and\s+\d+\s+legs|taxi\s+fare|two-legged|coins?|nickels?|dimes?|quarters?|principals?|terms?|stamps?|oranges?|pears?|combined\s+weight|pounds?|neighbor|teachers?|light\s+bulb|stool|in\s+a\s+room)\b|나이\s*문제|금액|돈|사탕|과부족/i,
  },
];

// Returns { subjectId, unitId } — falls back to 'uncategorized' if nothing matches.
export function classifyAmcProblem(questionText) {
  const normalized = normalizeAmcText(questionText);
  for (const rule of RULES) {
    if (rule.test.test(normalized)) {
      return { subjectId: rule.subjectId, unitId: rule.unitId };
    }
  }
  return { subjectId: 'uncategorized', unitId: 'uncategorized' };
}
