// Rule-based (keyword/regex) topic classifier for individual AMC problems.
// NOT a real AI/LLM call — this repo has no LLM API wired in (see project memory).
// It is a transparent, deterministic heuristic over the parsed question text, ordered
// from most-specific to most-generic pattern so a problem mentioning both "circle" and
// "angle" lands in the more specific "circles" unit rather than the generic angles bucket.
// Admins can always override a problem's unit_id by re-running classification after fixing
// the source text, or (future) via a manual edit — this is a starting point, not a final say.

const RULES = [
  { subjectId: 'combinatorics-probability', unitId: 'probability', test: /\bprobability\b|\brandomly\b|확률/i },
  { subjectId: 'combinatorics-probability', unitId: 'permutations-combinations', test: /\bpermutation|\bcombination\b|순열|조합(?!과)/i },
  { subjectId: 'combinatorics-probability', unitId: 'counting', test: /how many (?:ways|different|distinct)|number of ways|경우의\s*수/i },

  { subjectId: 'number-theory', unitId: 'primes-factorization', test: /\bprime(?:s|\snumber)?\b|\bfactoriz|소수|소인수분해/i },
  { subjectId: 'number-theory', unitId: 'divisors-multiples', test: /\bdivisor|\bmultiple of|\bfactor of|\bLCM\b|\bGCF\b|\bgreatest common|\bleast common|약수|배수|최대공약수|최소공배수/i },
  { subjectId: 'number-theory', unitId: 'remainders-divisibility', test: /\bremainder|\bdivisible|나머지|나누어떨어/i },
  { subjectId: 'number-theory', unitId: 'bases-digits', test: /\bbase\s*\d|\bdigits?\b|자릿수|진법/i },

  { subjectId: 'geometry', unitId: 'circles', test: /\bcircle|\bcircumference|\bradius|\bdiameter|\bsector|\bcircular\b|원(?:의|과|에)|반지름|지름|부채꼴/i },
  { subjectId: 'geometry', unitId: 'solids', test: /\bcube\b|\bvolume\b|\bsurface area\b|\bcylinder|\bsphere|\bprism|\bpyramid|부피|겉넓이|육면체|원기둥|각기둥|구(?:의|를)/i },
  { subjectId: 'geometry', unitId: 'coordinate-geometry', test: /\bcoordinate|\bx-axis|\by-axis|\bordered pair|\(\s*-?\d+\s*,\s*-?\d+\s*\)|좌표평면|좌표\s*\(/i },
  { subjectId: 'geometry', unitId: 'triangles', test: /\btriangle|삼각형/i },
  { subjectId: 'geometry', unitId: 'quadrilaterals-polygons', test: /\bsquare\b|\brectangle|\bquadrilateral|\bpolygon|\bpentagon|\bhexagon|\boctagon|\bparallelogram|\btrapezoid|사각형|정사각형|직사각형|다각형|오각형|육각형|평행사변형|사다리꼴/i },
  { subjectId: 'geometry', unitId: 'angles-plane-figures', test: /\bangle|\bdegrees?\b|\bparallel\b|\bperpendicular\b|각도|평행선|수직/i },

  { subjectId: 'advanced', unitId: 'trigonometry', test: /\bsin\b|\bcos\b|\btan\b|\btrig\w*|삼각함수/i },
  { subjectId: 'advanced', unitId: 'complex-numbers', test: /\bcomplex number|\bimaginary\b|허수|복소수/i },

  { subjectId: 'algebra', unitId: 'sequences-patterns', test: /\bsequence\b|\bpattern\b|\barithmetic (?:sequence|progression)|\bgeometric (?:sequence|series)|수열|규칙/i },
  { subjectId: 'algebra', unitId: 'ratios-percent', test: /\bratio\b|\bpercent|\brate\b|비율|백분율|퍼센트/i },
  { subjectId: 'algebra', unitId: 'equations-inequalities', test: /\bequation\b|\bsolve for\b|\binequality\b|방정식|부등식/i },
  { subjectId: 'algebra', unitId: 'expressions-substitution', test: /\bexpression\b|\bsimplify\b|\bevaluate\b|대입|문자식/i },

  { subjectId: 'functions', unitId: 'function-properties', test: /\bfunction\b|f\s*\(\s*x\s*\)|함수/i },

  { subjectId: 'logic-word-problems', unitId: 'games-strategy', test: /\bgame\b|\bwins?\b|\bstrategy\b|게임|전략/i },
  { subjectId: 'logic-word-problems', unitId: 'word-problems', test: /\bspeed\b|\bdistance\b|\btravels?\b|\bages?\b|\bdollars?\b|\bcost\b|\bprice\b|나이|거리|속력|가격/i },
  { subjectId: 'logic-word-problems', unitId: 'logical-reasoning', test: /\bif and only if\b|\btrue or false\b|\bstatement\b|\bwhich of the following\b/i },
];

// Returns { subjectId, unitId } — falls back to the 'uncategorized' bucket if nothing matches.
export function classifyAmcProblem(questionText) {
  const text = String(questionText || '');
  for (const rule of RULES) {
    if (rule.test.test(text)) return { subjectId: rule.subjectId, unitId: rule.unitId };
  }
  return { subjectId: 'uncategorized', unitId: 'uncategorized' };
}
