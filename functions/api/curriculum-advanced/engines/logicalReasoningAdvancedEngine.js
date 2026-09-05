// Server-only "advanced tier" companion to app/middle-school/basic-figures/logicalReasoningEngine.js.
// Lives entirely under functions/ so it is never bundled into client JS. Each unit id here matches
// a free basic-figures unit id 1:1, but the tasks require genuine extra reasoning (3-variable
// compound formulas, relationship recognition among 4 possibilities including "no relation", a
// 4-link chained syllogism with a converse-error/broken-link distractor, a 5-way property
// classification) instead of the same single-step template with different numbers.
//
// `profile` is the same locale/style object as geometryProfiles.js (only `profile.locale` is
// read here); `tx(profile, ko, en)` mirrors that file's `profileText` so prompt/explanation
// resolve to the requesting profile's language, same as the free engines.
const ri = (random, min, max) => Math.floor(random() * (max - min + 1)) + min;
const pick = (random, values) => values[ri(random, 0, values.length - 1)];
const tx = (profile, ko, en) => {
  const locale = profile?.locale || 'ko';
  if (locale === 'ko') return ko;
  return en || ko;
};
const make = (prompt, answer, diagram, explanation, extra = {}) => ({
  prompt, promptEn: extra.promptEn, expression: extra.expression || '', expressionEn: extra.expressionEn,
  answer: String(answer), answerSuffix: extra.answerSuffix || '', diagram, explanation, choices: extra.choices,
});

function shuffledIndex(random, keys, targetKey) {
  const shuffled = [...keys];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return { shuffled, answerIndex: shuffled.indexOf(targetKey) + 1 };
}

// --- logic-truth-tables: 3-variable compound formulas ---
const TT3_FORMULAS = [
  { sym: '(p \\land q) \\Rightarrow r', calc: (p, q, r) => !(p && q) || r },
  { sym: '(p \\lor q) \\land \\lnot r', calc: (p, q, r) => (p || q) && !r },
  { sym: 'p \\Rightarrow (q \\Rightarrow r)', calc: (p, q, r) => !p || !q || r },
  { sym: '(p \\Rightarrow q) \\land (q \\Rightarrow r)', calc: (p, q, r) => (!p || q) && (!q || r) },
  { sym: '(\\lnot p \\lor q) \\land r', calc: (p, q, r) => (!p || q) && r },
  { sym: '(p \\land \\lnot q) \\lor r', calc: (p, q, r) => (p && !q) || r },
];

function truthTablesAdvanced(random, profile) {
  const p = random() < 0.5;
  const q = random() < 0.5;
  const r = random() < 0.5;
  const f = pick(random, TT3_FORMULAS);
  const result = f.calc(p, q, r);

  return make(
    tx(profile,
      `$p$가 ${p ? '참(T)' : '거짓(F)'}, $q$가 ${q ? '참(T)' : '거짓(F)'}, $r$이 ${r ? '참(T)' : '거짓(F)'}일 때, $${f.sym}$의 진리값은 무엇입니까?`,
      `Given $p$ is ${p ? 'True' : 'False'}, $q$ is ${q ? 'True' : 'False'}, $r$ is ${r ? 'True' : 'False'}, what is the truth value of $${f.sym}$?`),
    result ? 'T' : 'F',
    null,
    tx(profile,
      `$p=${p ? 'T' : 'F'}$, $q=${q ? 'T' : 'F'}$, $r=${r ? 'T' : 'F'}$를 대입하면 $${f.sym} = ${result ? '참(T)' : '거짓(F)'}$입니다. 괄호 안쪽부터 순서대로 계산합니다.`,
      `Substituting $p=${p ? 'T' : 'F'}$, $q=${q ? 'T' : 'F'}$, $r=${r ? 'T' : 'F'}$ gives $${f.sym} = ${result ? 'True' : 'False'}$. Evaluate the innermost parentheses first.`),
    {
      choices: [
        { value: 'T', label: '참 (True)', labelEn: 'True' },
        { value: 'F', label: '거짓 (False)', labelEn: 'False' },
      ],
    }
  );
}

// --- logic-conditional-forms: recognize the relationship between two GIVEN statements
// (converse / inverse / contrapositive / no relation), rather than construct one named form ---
const COND_PAIRS_ADV = [
  {
    hypDecl: '어떤 수가 6의 배수이다', hypCond: '어떤 수가 6의 배수이면',
    hypNegDecl: '어떤 수가 6의 배수가 아니다', hypNegCond: '어떤 수가 6의 배수가 아니면',
    hypEn: 'a number is a multiple of 6', hypNegEn: 'a number is not a multiple of 6',
    conclDecl: '그 수는 3의 배수이다', conclCond: '그 수가 3의 배수이면',
    conclNegDecl: '그 수는 3의 배수가 아니다', conclNegCond: '그 수가 3의 배수가 아니면',
    conclEn: 'the number is a multiple of 3', conclNegEn: 'the number is not a multiple of 3',
  },
  {
    hypDecl: '어떤 사각형의 두 대각선이 서로를 수직이등분한다', hypCond: '어떤 사각형의 두 대각선이 서로를 수직이등분하면',
    hypNegDecl: '어떤 사각형의 두 대각선이 서로를 수직이등분하지 않는다', hypNegCond: '어떤 사각형의 두 대각선이 서로를 수직이등분하지 않으면',
    hypEn: "a quadrilateral's diagonals bisect each other perpendicularly", hypNegEn: "a quadrilateral's diagonals do not bisect each other perpendicularly",
    conclDecl: '그 사각형은 마름모이다', conclCond: '그 사각형이 마름모이면',
    conclNegDecl: '그 사각형은 마름모가 아니다', conclNegCond: '그 사각형이 마름모가 아니면',
    conclEn: 'the quadrilateral is a rhombus', conclNegEn: 'the quadrilateral is not a rhombus',
  },
  {
    hypDecl: '한 삼각형의 세 내각의 크기가 모두 같다', hypCond: '한 삼각형의 세 내각의 크기가 모두 같으면',
    hypNegDecl: '한 삼각형의 세 내각의 크기가 모두 같지는 않다', hypNegCond: '한 삼각형의 세 내각의 크기가 모두 같지 않으면',
    hypEn: 'all three interior angles of a triangle are equal', hypNegEn: 'not all three interior angles of a triangle are equal',
    conclDecl: '그 삼각형은 정삼각형이다', conclCond: '그 삼각형이 정삼각형이면',
    conclNegDecl: '그 삼각형은 정삼각형이 아니다', conclNegCond: '그 삼각형이 정삼각형이 아니면',
    conclEn: 'the triangle is equilateral', conclNegEn: 'the triangle is not equilateral',
  },
  {
    hypDecl: '두 직선이 한 횡단선과 이루는 동위각의 크기가 같다', hypCond: '두 직선이 한 횡단선과 이루는 동위각의 크기가 같으면',
    hypNegDecl: '두 직선이 한 횡단선과 이루는 동위각의 크기가 같지 않다', hypNegCond: '두 직선이 한 횡단선과 이루는 동위각의 크기가 같지 않으면',
    hypEn: 'two lines cut by a transversal have equal corresponding angles', hypNegEn: 'two lines cut by a transversal do not have equal corresponding angles',
    conclDecl: '두 직선은 평행하다', conclCond: '두 직선이 평행하면',
    conclNegDecl: '두 직선은 평행하지 않다', conclNegCond: '두 직선이 평행하지 않으면',
    conclEn: 'the two lines are parallel', conclNegEn: 'the two lines are not parallel',
  },
];

function buildForms(pair) {
  return {
    conditional: { ko: `${pair.hypCond} ${pair.conclDecl}.`, en: `If ${pair.hypEn}, then ${pair.conclEn}.` },
    converse: { ko: `${pair.conclCond} ${pair.hypDecl}.`, en: `If ${pair.conclEn}, then ${pair.hypEn}.` },
    inverse: { ko: `${pair.hypNegCond} ${pair.conclNegDecl}.`, en: `If ${pair.hypNegEn}, then ${pair.conclNegEn}.` },
    contrapositive: { ko: `${pair.conclNegCond} ${pair.hypNegDecl}.`, en: `If ${pair.conclNegEn}, then ${pair.hypNegEn}.` },
  };
}

const RELATION_LABELS = {
  converse: { ko: '역 (Converse)', en: 'Converse' },
  inverse: { ko: '이 (Inverse)', en: 'Inverse' },
  contrapositive: { ko: '대우 (Contrapositive)', en: 'Contrapositive' },
  none: { ko: '아무 관계 아님 (서로 다른 명제)', en: 'No relation (unrelated statements)' },
};

function conditionalFormsAdvanced(random, profile) {
  const baseIndex = ri(random, 0, COND_PAIRS_ADV.length - 1);
  const basePair = COND_PAIRS_ADV[baseIndex];
  const forms = buildForms(basePair);
  const noRelation = random() < 0.35;

  let secondStatement;
  let correctKey;
  if (noRelation) {
    const others = COND_PAIRS_ADV.filter((_, index) => index !== baseIndex);
    const otherPair = pick(random, others);
    secondStatement = buildForms(otherPair).conditional;
    correctKey = 'none';
  } else {
    correctKey = pick(random, ['converse', 'inverse', 'contrapositive']);
    secondStatement = forms[correctKey];
  }

  const { shuffled, answerIndex } = shuffledIndex(random, ['converse', 'inverse', 'contrapositive', 'none'], correctKey);
  const choices = shuffled.map((key, index) => ({ value: String(index + 1), label: RELATION_LABELS[key].ko, labelEn: RELATION_LABELS[key].en }));

  return make(
    tx(profile,
      `다음 두 문장의 관계를 고르세요.\n\n문장 1: "${forms.conditional.ko}"\n문장 2: "${secondStatement.ko}"`,
      `Decide the relationship between the two statements below.\n\nStatement 1: "${forms.conditional.en}"\nStatement 2: "${secondStatement.en}"`),
    String(answerIndex),
    null,
    tx(profile,
      correctKey === 'none'
        ? '두 문장은 서로 다른 명제에서 나온 것으로, 가정과 결론이 전혀 겹치지 않습니다. 따라서 역·이·대우 중 어느 관계도 아닙니다.'
        : correctKey === 'converse'
          ? '문장 2는 문장 1의 가정과 결론을 서로 바꾼 것이므로 역(converse) 관계입니다.'
          : correctKey === 'inverse'
            ? '문장 2는 문장 1의 가정과 결론을 각각 부정한 것이므로 이(inverse) 관계입니다.'
            : '문장 2는 문장 1의 가정과 결론을 바꾼 뒤 각각 부정한 것이므로 대우(contrapositive) 관계입니다.',
      correctKey === 'none'
        ? "The two statements come from unrelated propositions — their hypotheses and conclusions don't overlap at all, so it's none of converse/inverse/contrapositive."
        : correctKey === 'converse'
          ? 'Statement 2 swaps the hypothesis and conclusion of statement 1, so it is the converse.'
          : correctKey === 'inverse'
            ? 'Statement 2 negates both the hypothesis and conclusion of statement 1, so it is the inverse.'
            : 'Statement 2 swaps and negates both the hypothesis and conclusion of statement 1, so it is the contrapositive.'),
    { choices }
  );
}

// --- logic-detachment-syllogism: a 4-link chain (p->q->r->s), testing whether a candidate
// conclusion follows validly via two applications of the Law of Syllogism, a converse-error, or
// a broken link (a missing middle premise) ---
const CHAINS4 = [
  {
    pDecl: '어떤 사각형이 정사각형이다', pCond: '어떤 사각형이 정사각형이면', pEn: 'a quadrilateral is a square',
    qDecl: '그 사각형은 마름모이다', qCond: '그 사각형이 마름모이면', qEn: 'the quadrilateral is a rhombus',
    rDecl: '그 사각형은 평행사변형이다', rCond: '그 사각형이 평행사변형이면', rEn: 'the quadrilateral is a parallelogram',
    sDecl: '그 사각형은 사다리꼴이다', sCond: '그 사각형이 사다리꼴이면', sEn: 'the quadrilateral is a trapezoid',
  },
  {
    pDecl: '어떤 정수가 24의 배수이다', pCond: '어떤 정수가 24의 배수이면', pEn: 'an integer is a multiple of 24',
    qDecl: '그 정수는 12의 배수이다', qCond: '그 정수가 12의 배수이면', qEn: 'the integer is a multiple of 12',
    rDecl: '그 정수는 6의 배수이다', rCond: '그 정수가 6의 배수이면', rEn: 'the integer is a multiple of 6',
    sDecl: '그 정수는 3의 배수이다', sCond: '그 정수가 3의 배수이면', sEn: 'the integer is a multiple of 3',
  },
  {
    pDecl: '어떤 수가 자연수이다', pCond: '어떤 수가 자연수이면', pEn: 'a number is a natural number',
    qDecl: '그 수는 정수이다', qCond: '그 수가 정수이면', qEn: 'the number is an integer',
    rDecl: '그 수는 유리수이다', rCond: '그 수가 유리수이면', rEn: 'the number is a rational number',
    sDecl: '그 수는 실수이다', sCond: '그 수가 실수이면', sEn: 'the number is a real number',
  },
];

const VALIDITY_CHOICES = [
  { value: 'valid', label: '타당함 (삼단논법을 두 번 적용)', labelEn: 'Valid (Law of Syllogism applied twice)' },
  { value: 'invalid', label: '타당하지 않음', labelEn: 'Not valid' },
];

function detachmentSyllogismAdvanced(random, profile) {
  const chain = pick(random, CHAINS4);
  const mode = pick(random, ['valid-double', 'converse-error', 'broken-link']);
  const pq = { ko: `${chain.pCond} ${chain.qDecl}`, en: `If ${chain.pEn}, then ${chain.qEn}.` };
  const qr = { ko: `${chain.qCond} ${chain.rDecl}`, en: `If ${chain.qEn}, then ${chain.rEn}.` };
  const rs = { ko: `${chain.rCond} ${chain.sDecl}`, en: `If ${chain.rEn}, then ${chain.sEn}.` };
  const ps = { ko: `${chain.pCond} ${chain.sDecl}`, en: `If ${chain.pEn}, then ${chain.sEn}.` };
  const sp = { ko: `${chain.sCond} ${chain.pDecl}`, en: `If ${chain.sEn}, then ${chain.pEn}.` };

  let premises;
  let conclusion;
  let isValid;
  let whyKo;
  let whyEn;
  if (mode === 'valid-double') {
    premises = [pq, qr, rs];
    conclusion = ps;
    isValid = true;
    whyKo = `(1)과 (2)를 삼단논법으로 결합하면 "${chain.pCond} ${chain.rDecl}"를 얻고, 이를 다시 (3)과 결합하면 결론 "${ps.ko}"가 타당하게 도출됩니다.`;
    whyEn = `Chaining (1) and (2) gives "if ${chain.pEn}, then ${chain.rEn}", and chaining that with (3) validly yields the conclusion.`;
  } else if (mode === 'converse-error') {
    premises = [pq, qr, rs];
    conclusion = sp;
    isValid = false;
    whyKo = `세 전제를 연결하면 "${chain.pCond} ${chain.sDecl}"까지만 타당하게 도출됩니다. 제시된 결론은 이것의 역(가정과 결론을 바꾼 것)이므로 타당하지 않습니다.`;
    whyEn = `Chaining all three premises only validly yields "if ${chain.pEn}, then ${chain.sEn}." The stated conclusion is the converse of that, so it does not follow.`;
  } else {
    premises = [pq, rs];
    conclusion = ps;
    isValid = false;
    whyKo = `삼단논법을 적용하려면 "${chain.qCond} ${chain.rDecl}"라는 중간 전제가 필요한데 주어지지 않았습니다. (1)의 결론과 (2)의 가정이 서로 다른 조건이라 연결되지 않으므로, 결론이 타당하게 도출되지 않습니다.`;
    whyEn = `Applying the Law of Syllogism here needs the missing middle premise "if ${chain.qEn}, then ${chain.rEn}." Without it, (1)'s conclusion and (2)'s hypothesis don't match up, so the conclusion does not follow.`;
  }

  const premiseLinesKo = premises.map((premise, index) => `(${index + 1}) ${premise.ko}`).join('\n');
  const premiseLinesEn = premises.map((premise, index) => `(${index + 1}) ${premise.en}`).join('\n');
  const conclusionLineKo = `(${premises.length + 1}) 따라서, ${conclusion.ko}`;
  const conclusionLineEn = `(${premises.length + 1}) Therefore, ${conclusion.en}`;

  return make(
    tx(profile,
      `다음 논증이 주어진 전제로부터 타당하게 도출되는지 판단하세요.\n\n${premiseLinesKo}\n${conclusionLineKo}`,
      `Decide whether the argument below validly follows from the given premises.\n\n${premiseLinesEn}\n${conclusionLineEn}`),
    isValid ? 'valid' : 'invalid',
    null,
    tx(profile, whyKo, whyEn),
    { choices: VALIDITY_CHOICES }
  );
}

// --- logic-segment-angle-properties: 5-way classification (adds Addition Postulate and
// Substitution Property as genuine correct-answer cases, not only distractors) ---
const PROPERTY_LABELS = {
  reflexive: { ko: '반사성 (Reflexive Property)', en: 'Reflexive Property' },
  symmetric: { ko: '대칭성 (Symmetric Property)', en: 'Symmetric Property' },
  transitive: { ko: '이행성 (Transitive Property)', en: 'Transitive Property' },
  addition: { ko: '덧셈 성질 (Addition Postulate)', en: 'Addition Postulate' },
  substitution: { ko: '대입 성질 (Substitution Property)', en: 'Substitution Property' },
};
const PROPERTY_KEYS = Object.keys(PROPERTY_LABELS);

function segmentAnglePropertiesAdvanced(random, profile) {
  const useAngle = random() < 0.5;
  const labels = useAngle ? ['\\angle A', '\\angle B', '\\angle C'] : ['\\overline{AB}', '\\overline{CD}', '\\overline{EF}'];
  const key = pick(random, PROPERTY_KEYS);

  let statement;
  if (key === 'reflexive') {
    statement = `${labels[0]} \\cong ${labels[0]}`;
  } else if (key === 'symmetric') {
    statement = `\\text{If } ${labels[0]} \\cong ${labels[1]} \\text{, then } ${labels[1]} \\cong ${labels[0]}`;
  } else if (key === 'transitive') {
    statement = `\\text{If } ${labels[0]} \\cong ${labels[1]} \\text{ and } ${labels[1]} \\cong ${labels[2]} \\text{, then } ${labels[0]} \\cong ${labels[2]}`;
  } else if (key === 'addition') {
    statement = useAngle
      ? '\\text{If point } C \\text{ is interior to } \\angle ABD \\text{, then } m\\angle ABC + m\\angle CBD = m\\angle ABD'
      : '\\text{If point } B \\text{ is on } \\overline{AC} \\text{, then } AB + BC = AC';
  } else {
    statement = `\\text{If } ${labels[0]} \\cong ${labels[1]} \\text{ and } ${labels[1]} = 5 \\text{, then } ${labels[0]} = 5`;
  }

  const distractorPool = PROPERTY_KEYS.filter((candidate) => candidate !== key);
  const distractors = [];
  const pool = [...distractorPool];
  while (distractors.length < 3 && pool.length) {
    const index = ri(random, 0, pool.length - 1);
    distractors.push(pool.splice(index, 1)[0]);
  }
  const { shuffled, answerIndex } = shuffledIndex(random, [key, ...distractors], key);
  const choices = shuffled.map((candidateKey, index) => ({ value: String(index + 1), label: PROPERTY_LABELS[candidateKey].ko, labelEn: PROPERTY_LABELS[candidateKey].en }));

  return make(
    tx(profile,
      `다음 등식(합동)의 성질은 무엇입니까?\n\n$${statement}$`,
      `Which property justifies the statement below?\n\n$${statement}$`),
    String(answerIndex),
    null,
    tx(profile,
      `${PROPERTY_LABELS[key].ko}은 "$${statement}$" 형태의 관계를 나타냅니다.`,
      `The ${PROPERTY_LABELS[key].en} describes a relationship of the form "$${statement}$".`),
    { choices }
  );
}

export const LOGICAL_REASONING_ADVANCED_ENGINES = {
  'logic-truth-tables': truthTablesAdvanced,
  'logic-conditional-forms': conditionalFormsAdvanced,
  'logic-detachment-syllogism': detachmentSyllogismAdvanced,
  'logic-segment-angle-properties': segmentAnglePropertiesAdvanced,
};
