import { profileText } from './geometryProfiles';

const ri = (random, min, max) => Math.floor(random() * (max - min + 1)) + min;
const pick = (random, values) => values[ri(random, 0, values.length - 1)];
const tx = (profile, ko, en) => profileText(profile, { ko, en });
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const frac = (n, d) => { const g = gcd(n, d); return d / g === 1 ? String(n / g) : `${n / g}/${d / g}`; };

function challenge(profile, config) {
  const score = Math.min(100, 24 + config.steps.length * 10 + config.theorems.length * 6 + (config.choiceTrapCount || 0) * 2);
  return {
    prompt: tx(profile, config.promptKo, config.promptEn),
    promptEn: config.promptEn,
    expression: config.expression || '',
    expressionEn: config.expressionEn || config.expression || '',
    answer: String(config.answer),
    answerSuffix: config.answerSuffix || '',
    diagram: config.diagram,
    explanation: tx(profile, config.explanationKo, config.explanationEn),
    solutionSteps: config.steps.map(([ko, en]) => tx(profile, ko, en)),
    theorems: config.theorems.map(([ko, en]) => tx(profile, ko, en)),
    distractors: config.distractors.map(([value, koReason, enReason]) => ({ value: String(value), reason: tx(profile, koReason, enReason) })),
    difficulty: {
      level: score >= 82 ? tx(profile, '최상', 'Expert') : score >= 68 ? tx(profile, '상', 'Advanced') : tx(profile, '중상', 'Upper-intermediate'),
      score,
      estimatedMinutes: Math.max(2, Math.ceil(config.steps.length * 1.25)),
      reasoningSteps: config.steps.length,
    },
  };
}

function tangentPowerPythagorean(random, profile) {
  const base = pick(random, [[3, 4, 5], [5, 12, 13], [7, 24, 25], [8, 15, 17]]);
  const scale = ri(random, 1, 3);
  const [radius, tangent, distance] = base.map((value) => value * scale);
  return challenge(profile, {
    promptKo: `중심이 O이고 반지름이 ${radius}인 원 밖의 점 P에서 접선 PT를 그었습니다. OP=${distance}일 때 PT를 구하세요.`,
    promptEn: `A circle has center O and radius ${radius}. From external point P, PT is tangent and OP=${distance}. Find PT.`,
    answer: tangent,
    diagram: { kind: 'composite-circle', mode: 'tangent-radius', radius, tangent, distance },
    theorems: [['접선과 반지름의 수직', 'Radius perpendicular to tangent'], ['피타고라스 정리', 'Pythagorean theorem'], ['점의 멱', 'Power of a point']],
    steps: [
      ['접점 T에서 OT⊥PT이므로 △OPT는 직각삼각형입니다.', 'Since OT⊥PT at the tangent point, △OPT is right.'],
      [`PT²=OP²−OT²=${distance}²−${radius}²=${tangent * tangent}입니다.`, `PT²=OP²−OT²=${distance}²−${radius}²=${tangent * tangent}.`],
      [`길이는 양수이므로 PT=${tangent}입니다.`, `Length is positive, so PT=${tangent}.`],
    ],
    explanationKo: `접선-반지름의 수직 관계와 피타고라스 정리를 연결하면 PT=√(${distance}²−${radius}²)=${tangent}입니다.`,
    explanationEn: `Combine the tangent-radius perpendicular fact with Pythagoras: PT=√(${distance}²−${radius}²)=${tangent}.`,
    distractors: [[distance - radius, 'OP−r로 길이를 단순히 뺀 경우', 'Subtracting the radius directly'], [radius, '반지름을 답으로 선택한 경우', 'Choosing the radius'], [distance, '빗변 OP를 답으로 선택한 경우', 'Choosing the hypotenuse OP'], [distance + radius, '관련 길이를 잘못 더한 경우', 'Adding the given lengths']],
    choiceTrapCount: 4,
  });
}

function parallelSimilarityArea(random, profile) {
  const ratio = pick(random, [2, 3, 4]);
  const smallArea = pick(random, [3, 4, 5, 6, 8]);
  const trapezoidArea = smallArea * (ratio * ratio - 1);
  return challenge(profile, {
    promptKo: `△ABC에서 D는 AB 위, E는 AC 위에 있고 DE∥BC입니다. AD:AB=1:${ratio}, △ADE의 넓이가 ${smallArea}일 때 사각형 DBCE의 넓이를 구하세요.`,
    promptEn: `In △ABC, D lies on AB, E on AC, and DE∥BC. If AD:AB=1:${ratio} and [ADE]=${smallArea}, find the area of quadrilateral DBCE.`,
    answer: trapezoidArea,
    diagram: { kind: 'similarity-area', ratio, smallArea },
    theorems: [['평행선에 의한 닮음', 'Similarity from parallel lines'], ['닮은 도형의 넓이비', 'Area ratio of similar figures'], ['넓이의 가법성', 'Area subtraction']],
    steps: [
      ['DE∥BC이므로 △ADE∽△ABC입니다.', 'Since DE∥BC, △ADE∽△ABC.'],
      [`닮음비가 1:${ratio}이므로 넓이비는 1:${ratio * ratio}입니다.`, `The side ratio is 1:${ratio}, so the area ratio is 1:${ratio * ratio}.`],
      [`△ABC의 넓이는 ${smallArea}×${ratio * ratio}=${smallArea * ratio * ratio}입니다.`, `[ABC]=${smallArea}×${ratio * ratio}=${smallArea * ratio * ratio}.`],
      [`DBCE의 넓이는 ${smallArea * ratio * ratio}−${smallArea}=${trapezoidArea}입니다.`, `[DBCE]=${smallArea * ratio * ratio}−${smallArea}=${trapezoidArea}.`],
    ],
    explanationKo: `닮음비를 제곱하여 전체 삼각형 넓이를 구한 뒤 작은 삼각형을 빼면 ${trapezoidArea}입니다.`,
    explanationEn: `Square the similarity ratio to find the whole area, then subtract the small triangle to get ${trapezoidArea}.`,
    distractors: [[smallArea * ratio, '닮음비를 넓이에 그대로 적용한 경우', 'Using the linear ratio as an area ratio'], [smallArea * ratio * ratio, '전체 삼각형의 넓이에서 작은 삼각형을 빼지 않은 경우', 'Finding the whole triangle but not subtracting'], [smallArea * (ratio - 1), '길이의 차를 넓이에 적용한 경우', 'Applying the side difference to area'], [smallArea * (ratio * ratio + 1), '전체 넓이와 작은 넓이를 더한 경우', 'Adding the whole and small triangle areas']],
    choiceTrapCount: 4,
  });
}

function centroidVectorComposite(random, profile) {
  const base = pick(random, [[3, 4, 5], [5, 12, 13], [8, 15, 17]]);
  const scale = ri(random, 1, 3);
  const [p, q, magnitude] = base.map((value) => value * scale);
  return challenge(profile, {
    promptKo: `좌표평면에서 A(0,0), B(${3 * p},0), C(0,${3 * q})이고 G는 △ABC의 무게중심입니다. 벡터 OG의 크기를 구하세요.`,
    promptEn: `In the coordinate plane A(0,0), B(${3 * p},0), C(0,${3 * q}), and G is the centroid. Find |OG|.`,
    answer: magnitude,
    diagram: { kind: 'centroid-vector', p, q },
    theorems: [['무게중심 좌표', 'Centroid coordinates'], ['벡터의 성분', 'Vector components'], ['벡터의 크기', 'Vector magnitude']],
    steps: [
      [`G= ((${0}+${3 * p}+0)/3, (0+0+${3 * q})/3)=(${p},${q})입니다.`, `G=((${0}+${3 * p}+0)/3,(0+0+${3 * q})/3)=(${p},${q}).`],
      [`벡터 OG=(${p},${q})입니다.`, `Vector OG=(${p},${q}).`],
      [`|OG|=√(${p}²+${q}²)=${magnitude}입니다.`, `|OG|=√(${p}²+${q}²)=${magnitude}.`],
    ],
    explanationKo: `세 꼭짓점 좌표의 평균으로 G를 구하고 벡터의 크기 공식을 적용하면 ${magnitude}입니다.`,
    explanationEn: `Average the vertex coordinates, then apply the magnitude formula to get ${magnitude}.`,
    distractors: [[p + q, '벡터의 성분을 단순히 더한 경우', 'Adding components instead of finding magnitude'], [3 * magnitude, '무게중심 좌표를 3으로 나누지 않은 경우', 'Not dividing centroid coordinates by 3'], [Math.abs(q - p), '성분의 차만 계산한 경우', 'Taking only the difference of components'], [p * p + q * q, '제곱근을 취하지 않은 경우', 'Forgetting the square root']],
    choiceTrapCount: 4,
  });
}

function conicVectorComposite(random, profile) {
  const base = pick(random, [[5, 4, 3], [13, 12, 5]]);
  const scale = ri(random, 1, 3);
  const [a, b, c] = base.map((value) => value * scale);
  const answer = b * b - c * c;
  return challenge(profile, {
    promptKo: `타원 x²/${a * a}+y²/${b * b}=1의 두 초점을 F₁, F₂라 하고 P=(0,${b})라 하자. 벡터 PF₁·PF₂를 구하세요.`,
    promptEn: `For the ellipse x²/${a * a}+y²/${b * b}=1, let the foci be F₁,F₂ and P=(0,${b}). Find PF₁·PF₂.`,
    answer,
    diagram: { kind: 'conic-vector', a, b, c },
    theorems: [['타원의 초점 관계', 'Ellipse focal relation'], ['벡터의 성분', 'Vector components'], ['벡터의 내적', 'Dot product']],
    steps: [
      [`c²=a²−b²=${a * a}−${b * b}=${c * c}이므로 F₁=(−${c},0), F₂=(${c},0)입니다.`, `c²=a²−b²=${c * c}, so F₁=(−${c},0), F₂=(${c},0).`],
      [`PF₁=(−${c},−${b}), PF₂=(${c},−${b})입니다.`, `PF₁=(−${c},−${b}) and PF₂=(${c},−${b}).`],
      [`내적은 −${c * c}+${b * b}=${answer}입니다.`, `Their dot product is −${c * c}+${b * b}=${answer}.`],
    ],
    explanationKo: `타원의 초점을 구한 뒤 두 벡터의 성분 내적을 계산하면 ${answer}입니다.`,
    explanationEn: `Find the ellipse foci and then take the component dot product to obtain ${answer}.`,
    distractors: [[b * b + c * c, '첫 성분의 부호를 무시한 경우', 'Ignoring the negative first component'], [2 * c, '두 초점 사이의 거리만 구한 경우', 'Finding only the focal distance'], [a * a, '타원 관계식의 a²을 그대로 선택한 경우', 'Choosing a² from the ellipse equation'], [-answer, '내적의 부호를 반대로 계산한 경우', 'Reversing the sign of the dot product']],
    choiceTrapCount: 4,
  });
}

function spaceProjectionComposite(random, profile) {
  const base = pick(random, [[3, 4, 5, 12, 13], [5, 12, 13, 84, 85]]);
  const scale = ri(random, 1, 3);
  const [width, depth, baseDiagonal, height, spaceDiagonal] = base.map((value) => value * scale);
  const answer = frac(baseDiagonal, spaceDiagonal);
  return challenge(profile, {
    promptKo: `가로 ${width}, 세로 ${depth}, 높이 ${height}인 직육면체에서 밑면의 한 꼭짓점 O와 맞은편 위 꼭짓점 P를 이은 선분이 밑면과 이루는 각을 θ라 하자. cosθ를 구하세요.`,
    promptEn: `A cuboid has dimensions ${width}, ${depth}, ${height}. Its space diagonal OP makes angle θ with the base plane. Find cosθ.`,
    answer,
    diagram: { kind: 'space-projection-composite', width, depth, height, baseDiagonal, spaceDiagonal },
    theorems: [['밑면의 피타고라스 정리', 'Pythagoras on the base'], ['공간 대각선', 'Space diagonal'], ['정사영과 코사인', 'Projection and cosine']],
    steps: [
      [`OP의 밑면 위 정사영 길이는 √(${width}²+${depth}²)=${baseDiagonal}입니다.`, `The projection of OP on the base is √(${width}²+${depth}²)=${baseDiagonal}.`],
      [`공간 대각선 OP=√(${baseDiagonal}²+${height}²)=${spaceDiagonal}입니다.`, `The space diagonal is OP=√(${baseDiagonal}²+${height}²)=${spaceDiagonal}.`],
      [`cosθ=정사영 길이/OP=${baseDiagonal}/${spaceDiagonal}=${answer}입니다.`, `cosθ=projection/OP=${baseDiagonal}/${spaceDiagonal}=${answer}.`],
    ],
    explanationKo: `밑면 대각선을 먼저 구한 뒤 그것을 공간 대각선의 정사영으로 사용하면 cosθ=${answer}입니다.`,
    explanationEn: `Find the base diagonal first and use it as the projection of the space diagonal: cosθ=${answer}.`,
    distractors: [[frac(height, spaceDiagonal), 'sinθ와 cosθ를 바꾼 경우', 'Confusing sine and cosine'], [frac(width, spaceDiagonal), '밑면 대각선 대신 가로만 사용한 경우', 'Using only the width as the projection'], [spaceDiagonal, '공간 대각선 자체를 답으로 선택한 경우', 'Choosing the space diagonal itself'], [frac(baseDiagonal, height), '빗변을 높이로 잘못 둔 경우', 'Using the height as the hypotenuse']],
    choiceTrapCount: 4,
  });
}

function cosineAreaComposite(random, profile) {
  const [baseA, baseB, cBase, areaCoefficient] = pick(random, [[5, 8, 7, 10], [3, 8, 7, 6], [8, 15, 13, 30]]);
  const scale = ri(random, 1, 3);
  const a = baseA * scale; const b = baseB * scale; const angle = 60; const c = cBase * scale; const area = `${areaCoefficient * scale * scale}√3`;
  return challenge(profile, {
    promptKo: `△ABC에서 AB=${a}, AC=${b}, ∠A=${angle}°입니다. 먼저 BC를 구한 뒤 △ABC의 넓이를 구하세요.`,
    promptEn: `In △ABC, AB=${a}, AC=${b}, and ∠A=${angle}°. Find BC, then find the area of △ABC. Enter the area.`,
    answer: area,
    diagram: { kind: 'trig-composite', a, b, angle, c },
    theorems: [['코사인법칙', 'Cosine rule'], ['삼각형의 넓이 공식', 'Trigonometric area formula'], ['정확한 근호값', 'Exact radical values']],
    steps: [
      [`BC²=${a}²+${b}²−2·${a}·${b}cos${angle}°=${c * c}이므로 BC=${c}입니다.`, `BC²=${a}²+${b}²−2·${a}·${b}cos${angle}°=${c * c}, so BC=${c}.`],
      [`넓이=1/2·AB·AC·sinA입니다.`, `Area=1/2·AB·AC·sinA.`],
      [`따라서 넓이는 1/2·${a}·${b}·√3/2=${area}입니다.`, `Thus the area is 1/2·${a}·${b}·√3/2=${area}.`],
    ],
    explanationKo: `코사인법칙으로 세 번째 변을 확인하고, 두 변과 끼인각의 넓이 공식을 적용하면 ${area}입니다.`,
    explanationEn: `Use the cosine rule for the third side, then the included-angle area formula to get ${area}.`,
    distractors: [[`${a * b}√3`, '넓이 공식의 1/2을 빠뜨린 경우', 'Omitting the 1/2 in the area formula'], [`${a + b}√3`, '두 변을 곱하지 않고 더한 경우', 'Adding rather than multiplying the sides'], [c, '중간 결과인 BC를 최종 답으로 선택한 경우', 'Choosing the intermediate side BC'], [`${a * b / 2}`, 'sin60°를 1로 처리한 경우', 'Treating sin60° as 1']],
    choiceTrapCount: 4,
  });
}

const amcMixed = (random, profile) => pick(random, [tangentPowerPythagorean, parallelSimilarityArea, centroidVectorComposite, cosineAreaComposite])(random, profile);
const csatMixed = (random, profile) => pick(random, [centroidVectorComposite, conicVectorComposite, spaceProjectionComposite, cosineAreaComposite])(random, profile);
const g12Mixed = (random, profile) => pick(random, [tangentPowerPythagorean, parallelSimilarityArea, centroidVectorComposite, conicVectorComposite, spaceProjectionComposite, cosineAreaComposite])(random, profile);

const unit = (id, ko, en, koDesc, enDesc, generator, profiles) => ({ id, labels: { ko, en }, descriptions: { ko: koDesc, en: enDesc }, make: generator, profiles, advancedAssessment: true });

export const ADVANCED_GEOMETRY_CHALLENGE_UNITS = [
  unit('amc12-multi-theorem', 'AMC12 복합정리 기하', 'AMC 12 multi-theorem geometry', '접선·닮음·벡터·삼각법을 3단계 이상 결합', 'Three-plus-step combinations of tangency, similarity, vectors and trigonometry', amcMixed, ['amc12']),
  unit('csat-geometry-reasoning', '수능 기하 고난도 추론', 'CSAT advanced geometry reasoning', '이차곡선·벡터·공간 정사영을 결합한 단계형 문항', 'Multi-step conic, vector and spatial-projection problems', csatMixed, ['csat']),
  unit('g12-geometry-challenge', 'G12·IB 기하 챌린지', 'G12 & IB geometry challenge', '삼각법·좌표·벡터·공간기하의 복합 응용', 'Composite applications of trigonometry, coordinates, vectors and 3D geometry', g12Mixed, ['g12', 'ib']),
  unit('tangent-power-challenge', '접선·점의 멱·피타고라스', 'Tangency, power & Pythagoras', '접선과 반지름의 수직 관계를 이용한 복합 계산', 'Combine tangent-radius perpendicularity, power and Pythagoras', tangentPowerPythagorean, ['amc12', 'g12', 'ib']),
  unit('similarity-area-challenge', '평행선·닮음·넓이비', 'Parallel lines, similarity & area', '평행선으로 닮음을 찾고 넓이비와 넓이 차 계산', 'Use parallel-line similarity, squared ratios and area subtraction', parallelSimilarityArea, ['amc12', 'g12', 'ib']),
  unit('conic-vector-challenge', '이차곡선·벡터 내적', 'Conics & vector dot products', '초점 좌표와 벡터 내적을 결합', 'Combine focal coordinates with vector dot products', conicVectorComposite, ['csat', 'g12', 'ib']),
  unit('space-projection-challenge', '공간 대각선·정사영·삼각비', 'Space diagonal, projection & trigonometry', '두 번의 피타고라스와 정사영 각 계산', 'Use nested Pythagoras and projection-angle trigonometry', spaceProjectionComposite, ['csat', 'g12', 'ib']),
];
