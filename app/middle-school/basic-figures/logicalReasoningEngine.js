// Mathematical Reasoning — Topic 3 of "The Essential Guide to Geometry" (Harim Yoo /
// Hermon House), D:\geometry: truth tables, conditional statement forms (converse/inverse/
// contrapositive), the Law of Detachment and Law of Syllogism, and the equality properties
// used to justify segment/angle proof steps. Structure and technique only, no source text or
// problems reproduced. Unlike every other basic-figures unit these are true/false or
// multiple-choice classification problems (no numeric answer, no diagram) — closest in shape
// to catalog.js's `termsOx` unit, which this reuses the choices-based pattern from.
import { profileText } from './geometryProfiles';

const ri = (random, min, max) => Math.floor(random() * (max - min + 1)) + min;
const pick = (random, values) => values[ri(random, 0, values.length - 1)];
const tx = (profile, ko, en) => profileText(profile, { ko, en });
const make = (prompt, answer, diagram, explanation, extra = {}) => ({
  prompt, promptEn: extra.promptEn, expression: extra.expression || '', expressionEn: extra.expressionEn,
  answer: String(answer), answerSuffix: extra.answerSuffix || '', diagram, explanation, choices: extra.choices,
});
const unit = (id, ko, en, koDesc, enDesc, generator, profiles) => ({ id, labels: { ko, en }, descriptions: { ko: koDesc, en: enDesc }, make: generator, profiles });

function shuffledIndex(random, keys, targetKey) {
  const shuffled = [...keys];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return { shuffled, answerIndex: shuffled.indexOf(targetKey) + 1 };
}

// --- 3.2 Truth Tables ---
const TT_FORMULAS = [
  { symKo: 'p \\land q', symEn: 'p \\land q', calc: (p, q) => p && q },
  { symKo: 'p \\lor q', symEn: 'p \\lor q', calc: (p, q) => p || q },
  { symKo: '\\lnot p \\lor q', symEn: '\\lnot p \\lor q', calc: (p, q) => !p || q },
  { symKo: '\\lnot p \\land q', symEn: '\\lnot p \\land q', calc: (p, q) => !p && q },
  { symKo: 'p \\lor \\lnot q', symEn: 'p \\lor \\lnot q', calc: (p, q) => p || !q },
  { symKo: 'p \\Rightarrow q', symEn: 'p \\Rightarrow q', calc: (p, q) => !p || q },
];

function truthTables(random, profile) {
  const p = random() < 0.5;
  const q = random() < 0.5;
  const f = pick(random, TT_FORMULAS);
  const result = f.calc(p, q);

  return make(
    tx(profile,
      `$p$가 ${p ? '참(T)' : '거짓(F)'}이고 $q$가 ${q ? '참(T)' : '거짓(F)'}일 때, $${f.symKo}$의 진리값은 무엇입니까?`,
      `Given $p$ is ${p ? 'True' : 'False'} and $q$ is ${q ? 'True' : 'False'}, what is the truth value of $${f.symEn}$?`),
    result ? 'T' : 'F',
    null,
    tx(profile,
      `$p=${p ? 'T' : 'F'}$, $q=${q ? 'T' : 'F'}$를 대입하면 $${f.symKo} = ${result ? '참(T)' : '거짓(F)'}$입니다.`,
      `Substituting $p=${p ? 'T' : 'F'}$, $q=${q ? 'T' : 'F'}$ gives $${f.symEn} = ${result ? 'True' : 'False'}$.`),
    { choices: [
      { value: 'T', label: '참 (True)', labelEn: 'True' },
      { value: 'F', label: '거짓 (False)', labelEn: 'False' },
    ] }
  );
}

// --- 3.2 Converse / Inverse / Contrapositive ---
// Each pair stores BOTH a declarative form (used as the "then"-clause; ends in ~다) and a
// conditional-clause form (used as the "if"-clause; ends in ~면) for the positive and negated
// version of the hypothesis/conclusion, since converse/inverse/contrapositive swap which one
// plays which grammatical role. Korean conditionals replace the final ~다 with ~(으)면
// (이다 -> 이면, 하다 -> 하면, 같다 -> 같으면, ...), so these can't be derived by string-pasting
// "이면" onto the declarative form without producing bad grammar (e.g. "같다이면").
const COND_PAIRS = [
  {
    hypDecl: '어떤 다각형이 삼각형이다', hypCond: '어떤 다각형이 삼각형이면',
    hypNegDecl: '어떤 다각형이 삼각형이 아니다', hypNegCond: '어떤 다각형이 삼각형이 아니면',
    hypEn: 'a polygon is a triangle', hypNegEn: 'a polygon is not a triangle',
    conclDecl: '그 다각형의 변은 3개이다', conclCond: '그 다각형의 변이 3개이면',
    conclNegDecl: '그 다각형의 변은 3개가 아니다', conclNegCond: '그 다각형의 변이 3개가 아니면',
    conclEn: 'the polygon has three sides', conclNegEn: 'the polygon does not have three sides',
  },
  {
    hypDecl: '두 각이 맞꼭지각이다', hypCond: '두 각이 맞꼭지각이면',
    hypNegDecl: '두 각이 맞꼭지각이 아니다', hypNegCond: '두 각이 맞꼭지각이 아니면',
    hypEn: 'two angles are vertical angles', hypNegEn: 'two angles are not vertical angles',
    conclDecl: '두 각의 크기는 같다', conclCond: '두 각의 크기가 같으면',
    conclNegDecl: '두 각의 크기는 같지 않다', conclNegCond: '두 각의 크기가 같지 않으면',
    conclEn: 'the angles are congruent', conclNegEn: 'the angles are not congruent',
  },
  {
    hypDecl: '어떤 삼각형이 정삼각형이다', hypCond: '어떤 삼각형이 정삼각형이면',
    hypNegDecl: '어떤 삼각형이 정삼각형이 아니다', hypNegCond: '어떤 삼각형이 정삼각형이 아니면',
    hypEn: 'a triangle is equilateral', hypNegEn: 'a triangle is not equilateral',
    conclDecl: '세 변의 길이가 모두 같다', conclCond: '세 변의 길이가 모두 같으면',
    conclNegDecl: '세 변의 길이가 모두 같지는 않다', conclNegCond: '세 변의 길이가 모두 같지 않으면',
    conclEn: 'all three sides are congruent', conclNegEn: 'not all three sides are congruent',
  },
  {
    hypDecl: '두 직선이 평행하다', hypCond: '두 직선이 평행하면',
    hypNegDecl: '두 직선이 평행하지 않다', hypNegCond: '두 직선이 평행하지 않으면',
    hypEn: 'two lines are parallel', hypNegEn: 'two lines are not parallel',
    conclDecl: '두 직선은 만나지 않는다', conclCond: '두 직선이 만나지 않으면',
    conclNegDecl: '두 직선은 만난다', conclNegCond: '두 직선이 만나면',
    conclEn: 'the two lines do not intersect', conclNegEn: 'the two lines intersect',
  },
  {
    hypDecl: '어떤 정수가 4의 배수이다', hypCond: '어떤 정수가 4의 배수이면',
    hypNegDecl: '어떤 정수가 4의 배수가 아니다', hypNegCond: '어떤 정수가 4의 배수가 아니면',
    hypEn: 'an integer is a multiple of 4', hypNegEn: 'an integer is not a multiple of 4',
    conclDecl: '그 정수는 2의 배수이다', conclCond: '그 정수가 2의 배수이면',
    conclNegDecl: '그 정수는 2의 배수가 아니다', conclNegCond: '그 정수가 2의 배수가 아니면',
    conclEn: 'the integer is a multiple of 2', conclNegEn: 'the integer is not a multiple of 2',
  },
];

function buildForms(pair) {
  return {
    conditional: { ko: `${pair.hypCond}, ${pair.conclDecl}.`, en: `If ${pair.hypEn}, then ${pair.conclEn}.` },
    converse: { ko: `${pair.conclCond}, ${pair.hypDecl}.`, en: `If ${pair.conclEn}, then ${pair.hypEn}.` },
    inverse: { ko: `${pair.hypNegCond}, ${pair.conclNegDecl}.`, en: `If ${pair.hypNegEn}, then ${pair.conclNegEn}.` },
    contrapositive: { ko: `${pair.conclNegCond}, ${pair.hypNegDecl}.`, en: `If ${pair.conclNegEn}, then ${pair.hypNegEn}.` },
  };
}

const FORM_LABELS = {
  converse: { ko: '역 (Converse)', en: 'converse' },
  inverse: { ko: '이 (Inverse)', en: 'inverse' },
  contrapositive: { ko: '대우 (Contrapositive)', en: 'contrapositive' },
};

function conditionalForms(random, profile) {
  const pair = pick(random, COND_PAIRS);
  const forms = buildForms(pair);
  const targetKey = pick(random, ['converse', 'inverse', 'contrapositive']);
  const { shuffled, answerIndex } = shuffledIndex(random, ['conditional', 'converse', 'inverse', 'contrapositive'], targetKey);
  const choices = shuffled.map((key, index) => ({ value: String(index + 1), label: forms[key].ko, labelEn: forms[key].en }));

  return make(
    tx(profile,
      `다음 조건문의 ${FORM_LABELS[targetKey].ko}을 고르세요.\n\n"${forms.conditional.ko}"`,
      `Choose the ${FORM_LABELS[targetKey].en} of the conditional statement below.\n\n"${forms.conditional.en}"`),
    String(answerIndex),
    null,
    tx(profile,
      targetKey === 'converse' ? `역(converse)은 가정 $p$와 결론 $q$를 서로 바꾼 문장입니다: "${forms.converse.ko}"`
        : targetKey === 'inverse' ? `이(inverse)는 가정과 결론을 각각 부정한 문장입니다: "${forms.inverse.ko}"`
          : `대우(contrapositive)는 가정과 결론을 바꾼 뒤 각각 부정한 문장입니다: "${forms.contrapositive.ko}"`,
      targetKey === 'converse' ? `The converse swaps the hypothesis $p$ and conclusion $q$: "${forms.converse.en}"`
        : targetKey === 'inverse' ? `The inverse negates both the hypothesis and the conclusion: "${forms.inverse.en}"`
          : `The contrapositive swaps the hypothesis and conclusion, then negates both: "${forms.contrapositive.en}"`),
    { choices }
  );
}

// --- 3.3 Law of Detachment / Law of Syllogism ---
// pCond/qCond hold the ~면 conditional-clause form; pDecl/qDecl/rDecl hold the plain ~다
// declarative form used when the statement stands alone as a premise or conclusion.
const CHAINS = [
  {
    pDecl: '어떤 다각형이 정사각형이다', pCond: '어떤 다각형이 정사각형이면', pEn: 'a polygon is a square',
    qDecl: '그 다각형은 직사각형이다', qCond: '그 다각형이 직사각형이면', qEn: 'the polygon is a rectangle',
    rDecl: '그 다각형은 평행사변형이다', rEn: 'the polygon is a parallelogram',
  },
  {
    pDecl: '어떤 정수가 8의 배수이다', pCond: '어떤 정수가 8의 배수이면', pEn: 'an integer is a multiple of 8',
    qDecl: '그 정수는 4의 배수이다', qCond: '그 정수가 4의 배수이면', qEn: 'the integer is a multiple of 4',
    rDecl: '그 정수는 2의 배수이다', rEn: 'the integer is a multiple of 2',
  },
  {
    pDecl: '한 삼각형이 정삼각형이다', pCond: '한 삼각형이 정삼각형이면', pEn: 'a triangle is equilateral',
    qDecl: '그 삼각형은 이등변삼각형이다', qCond: '그 삼각형이 이등변삼각형이면', qEn: 'the triangle is isosceles',
    rDecl: '그 삼각형의 두 밑각의 크기가 같다', rEn: 'the triangle has two congruent base angles',
  },
];

const REASONING_CHOICES = [
  { value: 'detachment', label: '전건 긍정법 (Law of Detachment)', labelEn: 'Law of Detachment' },
  { value: 'syllogism', label: '삼단논법 (Law of Syllogism)', labelEn: 'Law of Syllogism' },
  { value: 'invalid', label: '어느 법칙도 아님 (타당하지 않은 추론)', labelEn: 'Neither (not a valid argument)' },
];

const cap = (text) => text.charAt(0).toUpperCase() + text.slice(1);

function lawOfDetachmentSyllogism(random, profile) {
  const chain = pick(random, CHAINS);
  const mode = pick(random, ['detachment', 'syllogism', 'invalid']);
  const pImpliesQ = { ko: `${chain.pCond} ${chain.qDecl}`, en: `If ${chain.pEn}, then ${chain.qEn}.` };
  const qImpliesR = { ko: `${chain.qCond} ${chain.rDecl}`, en: `If ${chain.qEn}, then ${chain.rEn}.` };

  let premise1;
  let premise2;
  let conclusion;
  if (mode === 'detachment') {
    premise1 = pImpliesQ;
    premise2 = { ko: `${chain.pDecl}`, en: `${cap(chain.pEn)}.` };
    conclusion = { ko: `${chain.qDecl}`, en: `${cap(chain.qEn)}.` };
  } else if (mode === 'syllogism') {
    premise1 = pImpliesQ;
    premise2 = qImpliesR;
    conclusion = { ko: `${chain.pCond} ${chain.rDecl}`, en: `If ${chain.pEn}, then ${chain.rEn}.` };
  } else {
    // Affirming the consequent — a classic invalid form: premise (2) only affirms q, not p.
    premise1 = pImpliesQ;
    premise2 = { ko: `${chain.qDecl}`, en: `${cap(chain.qEn)}.` };
    conclusion = { ko: `${chain.pDecl}`, en: `${cap(chain.pEn)}.` };
  }

  return make(
    tx(profile,
      `다음 논증이 전건 긍정법(Law of Detachment), 삼단논법(Law of Syllogism), 둘 다 아님(타당하지 않음) 중 무엇에 해당하는지 고르세요.\n\n(1) ${premise1.ko}\n(2) ${premise2.ko}\n(3) 따라서, ${conclusion.ko}`,
      `Decide whether the argument below is an example of the Law of Detachment, the Law of Syllogism, or neither.\n\n(1) ${premise1.en}\n(2) ${premise2.en}\n(3) Therefore, ${conclusion.en}`),
    mode,
    null,
    tx(profile,
      mode === 'detachment' ? '(2)가 (1)의 가정을 그대로 만족시키므로, (1)의 결론을 이끌어내는 전건 긍정법입니다.'
        : mode === 'syllogism' ? '(1)의 결론과 (2)의 가정이 일치하므로, 두 조건문을 이어붙이는 삼단논법입니다.'
          : '(2)는 (1)의 결론을 긍정할 뿐 가정을 긍정하지 않았습니다. 이는 결론에서 가정을 이끌어낼 수 없는 "후건 긍정의 오류"로, 타당하지 않은 추론입니다.',
      mode === 'detachment' ? 'Statement (2) affirms the hypothesis of (1) exactly, so (3) validly follows by the Law of Detachment.'
        : mode === 'syllogism' ? 'The conclusion of (1) matches the hypothesis of (2), so the two conditionals chain together by the Law of Syllogism.'
          : 'Statement (2) only affirms the conclusion of (1), not its hypothesis — this is the invalid "affirming the consequent" fallacy, so (3) does not validly follow.'),
    { choices: REASONING_CHOICES }
  );
}

// --- 3.4-3.6 Equality/Congruence properties used to justify segment & angle proof steps ---
const PROPERTY_LABELS = {
  reflexive: { ko: '반사성 (Reflexive Property)', en: 'Reflexive Property' },
  symmetric: { ko: '대칭성 (Symmetric Property)', en: 'Symmetric Property' },
  transitive: { ko: '이행성 (Transitive Property)', en: 'Transitive Property' },
  addition: { ko: '덧셈 성질 (Addition Postulate)', en: 'Addition Postulate' },
};

function segmentAngleProperties(random, profile) {
  const useAngle = random() < 0.5;
  const labels = useAngle ? ['\\angle A', '\\angle B', '\\angle C'] : ['\\overline{AB}', '\\overline{CD}', '\\overline{EF}'];
  const propertyKey = pick(random, ['reflexive', 'symmetric', 'transitive']);
  const statement = propertyKey === 'reflexive'
    ? `${labels[0]} \\cong ${labels[0]}`
    : propertyKey === 'symmetric'
      ? `${labels[0]} \\cong ${labels[1]} \\text{이면 } ${labels[1]} \\cong ${labels[0]}`
      : `${labels[0]} \\cong ${labels[1]} \\text{이고 } ${labels[1]} \\cong ${labels[2]} \\text{이면 } ${labels[0]} \\cong ${labels[2]}`;
  const statementEn = propertyKey === 'reflexive'
    ? `${labels[0]} \\cong ${labels[0]}`
    : propertyKey === 'symmetric'
      ? `\\text{If } ${labels[0]} \\cong ${labels[1]} \\text{, then } ${labels[1]} \\cong ${labels[0]}`
      : `\\text{If } ${labels[0]} \\cong ${labels[1]} \\text{ and } ${labels[1]} \\cong ${labels[2]} \\text{, then } ${labels[0]} \\cong ${labels[2]}`;

  const { shuffled, answerIndex } = shuffledIndex(random, ['reflexive', 'symmetric', 'transitive', 'addition'], propertyKey);
  const choices = shuffled.map((key, index) => ({ value: String(index + 1), label: PROPERTY_LABELS[key].ko, labelEn: PROPERTY_LABELS[key].en }));

  return make(
    tx(profile, `다음 등식(합동)의 성질은 무엇입니까?\n\n$${statement}$`, `Which property justifies the statement below?\n\n$${statementEn}$`),
    String(answerIndex),
    null,
    tx(profile,
      `${PROPERTY_LABELS[propertyKey].ko}은 "$${statement}$" 형태의 관계를 나타냅니다.`,
      `The ${PROPERTY_LABELS[propertyKey].en} describes a relationship of the form "$${statementEn}$".`),
    { choices }
  );
}

export const LOGICAL_REASONING_UNITS = [
  unit(
    'logic-truth-tables', '진리표와 조건문 (Truth Tables)', 'Truth Tables',
    '$p, q$의 참·거짓으로 논리곱·논리합·조건문의 진리값 구하기', 'Evaluate conjunctions, disjunctions, and conditionals from the truth values of p and q',
    truthTables, ['kr', 'international', 'sg', 'tw', 'hk']
  ),
  unit(
    'logic-conditional-forms', '역·이·대우 (Converse, Inverse, Contrapositive)', 'Converse, Inverse & Contrapositive',
    '조건문의 역, 이, 대우 문장 구별하기', 'Identify the converse, inverse, or contrapositive of a conditional statement',
    conditionalForms, ['kr', 'international', 'sg', 'tw', 'hk']
  ),
  unit(
    'logic-detachment-syllogism', '전건 긍정법과 삼단논법', 'Law of Detachment & Law of Syllogism',
    '주어진 논증이 어떤 연역 법칙을 사용하는지, 혹은 타당하지 않은지 판별하기', 'Classify an argument as the Law of Detachment, the Law of Syllogism, or an invalid inference',
    lawOfDetachmentSyllogism, ['kr', 'international', 'sg', 'tw', 'hk']
  ),
  unit(
    'logic-segment-angle-properties', '증명의 등식 성질 (반사성·대칭성·이행성)', 'Equality Properties in Proofs',
    '선분·각의 합동을 증명할 때 사용하는 반사성, 대칭성, 이행성 판별하기', 'Identify the reflexive, symmetric, or transitive property used to justify a segment/angle proof step',
    segmentAngleProperties, ['kr', 'international', 'sg', 'tw', 'hk']
  ),
];
