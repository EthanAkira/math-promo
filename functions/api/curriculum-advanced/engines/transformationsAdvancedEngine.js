// Server-only "advanced tier" companion to app/middle-school/basic-figures/transformationsEngine.js.
// Lives entirely under functions/ so it is never bundled into client JS — only reachable through
// functions/api/curriculum-advanced/generate.js after a subscription check. Each unit id here
// matches a free basic-figures unit id 1:1, but the problems compose two transformations (or ask
// the student to solve for a missing parameter) instead of applying a single transformation to a
// fixed shape, so this is a genuinely harder problem, not the same template with bigger numbers.
//
// `profile` is the same locale/style object as geometryProfiles.js (only `profile.locale` is read
// here); `tx(profile, ko, en)` mirrors that file's `profileText` so prompt/explanation resolve to
// the requesting profile's language, same as the free engines.
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

const TRIANGLES = [
  [[1, 1], [4, 1], [1, 3]],
  [[-3, 1], [-1, 1], [-3, 4]],
  [[1, -3], [4, -3], [1, -1]],
  [[-2, -3], [1, -3], [-2, -1]],
  [[2, 2], [2, 4], [4, 2]],
];
const LABELS = ['A', 'B', 'C'];
const fmt = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(2));
const fmtPoint = ([x, y]) => `(${fmt(x)}, ${fmt(y)})`;
const signed = (n) => (n >= 0 ? `+${n}` : `${n}`);

function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a || 1; }
function reduceFrac(n, d) { const g = gcd(n, d); return [n / g, d / g]; }
function fracLabel(n, d) { const [rn, rd] = reduceFrac(n, d); return rd === 1 ? String(rn) : `${rn}/${rd}`; }

// --- transform-translation: translate, then reflect (composition, not a single step) ---
function translationAdvanced(random, profile) {
  const shape = pick(random, TRIANGLES);
  const dx = pick(random, [-4, -3, -2, -1, 1, 2, 3, 4]);
  const dy = pick(random, [-4, -3, -2, -1, 1, 2, 3, 4]);
  const axis = pick(random, ['x-axis', 'y-axis']);
  const target = ri(random, 0, 2);
  const translated = shape.map(([x, y]) => [x + dx, y + dy]);
  const reflect = ([x, y]) => (axis === 'x-axis' ? [x, -y] : [-x, y]);
  const final = translated.map(reflect);
  const answerPoint = final[target];
  const axisKo = axis === 'x-axis' ? 'x축' : 'y축';

  return make(
    tx(profile,
      `삼각형 ${LABELS.join('')}을 x축으로 ${signed(dx)}, y축으로 ${signed(dy)}만큼 평행이동한 후, 다시 ${axisKo}에 대하여 대칭이동했습니다. 최종적으로 이동한 점 ${LABELS[target]}''의 좌표를 구하세요.`,
      `Triangle ${LABELS.join('')} is translated ${signed(dx)} along x and ${signed(dy)} along y, then reflected across the ${axis}. Find the coordinates of ${LABELS[target]}''.`),
    fmtPoint(answerPoint),
    { kind: 'coord-transform', points: shape, transformedPoints: final, labels: LABELS, mode: 'translation-then-reflection' },
    tx(profile,
      `먼저 평행이동: $(x, y) \\to (x${signed(dx)}, y${signed(dy)})$로 ${LABELS[target]}${fmtPoint(shape[target])} \\to ${fmtPoint(translated[target])}$. 이어서 ${axisKo} 대칭이동을 적용하면 ${LABELS[target]}''${fmtPoint(answerPoint)}$가 됩니다. 두 변환을 순서대로 적용해야 하며, 순서를 바꾸면 다른 결과가 나올 수 있습니다.`,
      `First the translation: $(x, y) \\to (x${signed(dx)}, y${signed(dy)})$ takes ${LABELS[target]}${fmtPoint(shape[target])} \\to ${fmtPoint(translated[target])}$. Then reflecting across the ${axis} gives ${LABELS[target]}''${fmtPoint(answerPoint)}$. The order matters — reversing it can give a different result.`)
  );
}

// --- transform-reflection: two reflections across parallel lines = a translation ---
function reflectionAdvanced(random, profile) {
  const shape = pick(random, TRIANGLES);
  const vertical = random() < 0.5;
  const a = ri(random, -3, 3);
  const b = a + pick(random, [-4, -3, -2, 2, 3, 4]);
  const target = ri(random, 0, 2);
  const reflectOver = (line) => ([x, y]) => (vertical ? [2 * line - x, y] : [x, 2 * line - y]);
  const step1 = shape.map(reflectOver(a));
  const step2 = step1.map(reflectOver(b));
  const answerPoint = step2[target];
  const netShift = 2 * (b - a);
  const lineLabel = vertical ? 'x' : 'y';
  const askEquivalent = random() < 0.5;

  if (askEquivalent) {
    return make(
      tx(profile,
        `삼각형 ${LABELS.join('')}을 직선 ${lineLabel}=${a}에 대하여 대칭이동한 후, 다시 직선 ${lineLabel}=${b}에 대하여 대칭이동했습니다. 이 두 대칭이동을 합성한 것은 ${lineLabel}축 방향으로 얼마만큼 평행이동한 것과 같습니까? (부호를 포함하여 답하세요)`,
        `Triangle ${LABELS.join('')} is reflected across the line ${lineLabel}=${a}, then across ${lineLabel}=${b}. What single translation (along the ${lineLabel}-axis, with sign) is equivalent to this composition?`),
      netShift,
      { kind: 'coord-transform', points: shape, transformedPoints: step2, labels: LABELS, mode: 'reflection-composition' },
      tx(profile,
        `평행한 두 직선 ${lineLabel}=${a}, ${lineLabel}=${b}에 대해 순서대로 대칭이동하면 그 결과는 항상 ${lineLabel}축 방향으로 $2(${b}-${a})=${netShift}$만큼 평행이동한 것과 같습니다. 실제로 ${LABELS[target]}${fmtPoint(shape[target])} \\to ${LABELS[target]}''${fmtPoint(answerPoint)}$로, 차이가 정확히 ${netShift}임을 확인할 수 있습니다.`,
        `Reflecting across two parallel lines ${lineLabel}=${a} then ${lineLabel}=${b} is always equivalent to a translation of $2(${b}-${a})=${netShift}$ along the ${lineLabel}-axis. You can check this directly: ${LABELS[target]}${fmtPoint(shape[target])} \\to ${LABELS[target]}''${fmtPoint(answerPoint)}$, a shift of exactly ${netShift}.`)
    );
  }

  return make(
    tx(profile,
      `삼각형 ${LABELS.join('')}을 직선 ${lineLabel}=${a}에 대하여 대칭이동한 후, 다시 직선 ${lineLabel}=${b}에 대하여 대칭이동했습니다. 최종적으로 이동한 점 ${LABELS[target]}''의 좌표를 구하세요.`,
      `Triangle ${LABELS.join('')} is reflected across the line ${lineLabel}=${a}, then across ${lineLabel}=${b}. Find the coordinates of ${LABELS[target]}''.`),
    fmtPoint(answerPoint),
    { kind: 'coord-transform', points: shape, transformedPoints: step2, labels: LABELS, mode: 'reflection-composition' },
    tx(profile,
      `${LABELS[target]}${fmtPoint(shape[target])}$을 직선 ${lineLabel}=${a}에 대해 대칭이동하면 ${fmtPoint(step1[target])}$, 다시 ${lineLabel}=${b}에 대해 대칭이동하면 ${LABELS[target]}''${fmtPoint(answerPoint)}$가 됩니다. (참고: 이는 ${lineLabel}축 방향으로 ${netShift}만큼 평행이동한 것과 같습니다.)`,
      `Reflecting ${LABELS[target]}${fmtPoint(shape[target])}$ across ${lineLabel}=${a} gives ${fmtPoint(step1[target])}$, then reflecting across ${lineLabel}=${b} gives ${LABELS[target]}''${fmtPoint(answerPoint)}$. (This matches a translation of ${netShift} along the ${lineLabel}-axis.)`)
  );
}

// --- transform-rotation: two rotations about the origin compose into a single net rotation ---
function rotationAdvanced(random, profile) {
  const shape = pick(random, TRIANGLES);
  const target = ri(random, 0, 2);
  const angles = [90, 180, 270];
  let angle1 = pick(random, angles);
  let angle2 = pick(random, angles);
  while ((angle1 + angle2) % 360 === 0) angle2 = pick(random, angles);
  const rotate = (deg) => ([x, y]) => (deg === 90 ? [-y, x] : deg === 180 ? [-x, -y] : [y, -x]);
  const step1 = shape.map(rotate(angle1));
  const step2 = step1.map(rotate(angle2));
  const answerPoint = step2[target];
  const netAngle = (angle1 + angle2) % 360;
  const askEquivalent = random() < 0.5;

  if (askEquivalent) {
    return make(
      tx(profile,
        `삼각형 ${LABELS.join('')}을 원점을 중심으로 반시계 방향으로 ${angle1}° 회전이동한 후, 다시 ${angle2}° 회전이동했습니다. 이 두 회전이동을 합성한 것은 원점을 중심으로 몇 도 회전이동한 것과 같습니까? (0° 이상 360° 미만으로 답하세요)`,
        `Triangle ${LABELS.join('')} is rotated ${angle1}° counterclockwise about the origin, then rotated ${angle2}° more. What single rotation (0°–360°) about the origin is equivalent to this composition?`),
      netAngle,
      { kind: 'coord-transform', points: shape, transformedPoints: step2, labels: LABELS, mode: 'rotation-composition' },
      tx(profile,
        `원점을 중심으로 한 두 회전이동을 합성하면 회전각은 그대로 더해집니다: $${angle1}° + ${angle2}° = ${angle1 + angle2}° \\equiv ${netAngle}° \\pmod{360°}$.`,
        `Composing two rotations about the origin simply adds the angles: $${angle1}° + ${angle2}° = ${angle1 + angle2}° \\equiv ${netAngle}° \\pmod{360°}$.`)
    );
  }

  return make(
    tx(profile,
      `삼각형 ${LABELS.join('')}을 원점을 중심으로 반시계 방향으로 ${angle1}° 회전이동한 후, 다시 ${angle2}° 회전이동했습니다. 최종적으로 이동한 점 ${LABELS[target]}''의 좌표를 구하세요.`,
      `Triangle ${LABELS.join('')} is rotated ${angle1}° then ${angle2}° counterclockwise about the origin. Find the coordinates of ${LABELS[target]}''.`),
    fmtPoint(answerPoint),
    { kind: 'coord-transform', points: shape, transformedPoints: step2, labels: LABELS, mode: 'rotation-composition' },
    tx(profile,
      `${angle1}°와 ${angle2}° 회전을 합성하면 총 ${netAngle}° 회전과 같습니다. ${LABELS[target]}${fmtPoint(shape[target])}$을 원점을 중심으로 ${netAngle}° 회전하면 ${LABELS[target]}''${fmtPoint(answerPoint)}$가 됩니다.`,
      `Combining a ${angle1}° and a ${angle2}° rotation gives a net ${netAngle}° rotation. Rotating ${LABELS[target]}${fmtPoint(shape[target])}$ by ${netAngle}° about the origin gives ${LABELS[target]}''${fmtPoint(answerPoint)}$.`)
  );
}

// --- transform-dilation: two successive dilations; sometimes solve for the missing factor ---
function dilationAdvanced(random, profile) {
  const shape = pick(random, TRIANGLES);
  const target = ri(random, 0, 2);
  const k1 = pick(random, [2, 3]);
  const k2 = pick(random, [2, 3]);
  const step1 = shape.map(([x, y]) => [x * k1, y * k1]);
  const step2 = step1.map(([x, y]) => [x * k2, y * k2]);
  const askFactor = random() < 0.5;

  if (askFactor) {
    const finalPoint = step2[target];
    return make(
      tx(profile,
        `삼각형 ${LABELS.join('')}을 원점을 중심으로 배율 ${k1}로 확대한 후, 다시 원점을 중심으로 배율 $k$로 확대했더니 점 ${LABELS[target]}''의 좌표가 ${fmtPoint(finalPoint)}이 되었습니다. $k$의 값을 구하세요.`,
        `Triangle ${LABELS.join('')} is dilated from the origin by a factor of ${k1}, then by an unknown factor $k$, landing ${LABELS[target]}'' at ${fmtPoint(finalPoint)}. Find $k$.`),
      k2,
      { kind: 'coord-transform', points: shape, transformedPoints: step2, labels: LABELS, mode: 'dilation-composition' },
      tx(profile,
        `원점 중심 배율 ${k1} 닮음변환 후 ${LABELS[target]}${fmtPoint(shape[target])}$은 ${fmtPoint(step1[target])}$이 됩니다. 여기에 배율 $k$를 다시 적용해 ${fmtPoint(finalPoint)}$이 되었으므로, $k = \\dfrac{${fmt(finalPoint[0])}}{${fmt(step1[target][0])}} = ${k2}$.`,
        `After the factor-${k1} dilation, ${LABELS[target]}${fmtPoint(shape[target])}$ becomes ${fmtPoint(step1[target])}$. Applying $k$ to that lands it at ${fmtPoint(finalPoint)}$, so $k = \\dfrac{${fmt(finalPoint[0])}}{${fmt(step1[target][0])}} = ${k2}$.`)
    );
  }

  const answerPoint = step2[target];
  return make(
    tx(profile,
      `삼각형 ${LABELS.join('')}을 원점을 중심으로 배율 ${k1}로 확대한 후, 다시 원점을 중심으로 배율 ${k2}로 확대했습니다. 최종적으로 이동한 점 ${LABELS[target]}''의 좌표를 구하세요.`,
      `Triangle ${LABELS.join('')} is dilated from the origin by ${k1}, then by ${k2}. Find the coordinates of ${LABELS[target]}''.`),
    fmtPoint(answerPoint),
    { kind: 'coord-transform', points: shape, transformedPoints: step2, labels: LABELS, mode: 'dilation-composition' },
    tx(profile,
      `배율 ${k1}과 ${k2}를 연이어 적용하면 전체 배율은 $${k1} \\times ${k2} = ${k1 * k2}$입니다. ${LABELS[target]}${fmtPoint(shape[target])}$에 적용하면 ${LABELS[target]}''${fmtPoint(answerPoint)}$가 됩니다.`,
      `Applying factors ${k1} then ${k2} in a row gives a combined factor of $${k1} \\times ${k2} = ${k1 * k2}$. Applied to ${LABELS[target]}${fmtPoint(shape[target])}$, that gives ${LABELS[target]}''${fmtPoint(answerPoint)}$.`)
  );
}

// --- transform-dilation-area: combined area ratio of two dilations, or solve for a missing factor ---
function dilationAreaAdvanced(random, profile) {
  const k1n = pick(random, [1, 2, 3]);
  const k1d = k1n === 1 ? pick(random, [1, 2, 3]) : 1;
  const k2n = pick(random, [1, 2, 3]);
  const k2d = k2n === 1 ? pick(random, [1, 2, 3]) : 1;
  const combinedN = k1n * k2n;
  const combinedD = k1d * k2d;
  const areaN = combinedN * combinedN;
  const areaD = combinedD * combinedD;
  const k1Label = fracLabel(k1n, k1d);
  const k2Label = fracLabel(k2n, k2d);
  const areaLabel = fracLabel(areaN, areaD);
  const askFactor = random() < 0.5 && k2n !== k2d; // exclude the trivial r=1 case

  if (askFactor) {
    return make(
      tx(profile,
        `도형을 닮음비 ${k1Label}로 닮음변환한 후, 다시 닮음비 $r$로 닮음변환했더니 처음 도형 넓이의 ${areaLabel}배가 되었습니다. $r$의 값을 구하세요. (단, $r > 0$)`,
        `A figure is dilated by a factor of ${k1Label}, then by an unknown factor $r$, and the final area is ${areaLabel} times the original. Find $r$ (r > 0).`),
      k2Label,
      null,
      tx(profile,
        `전체 닮음비를 $R$이라 하면 넓이의 비는 $R^2 = ${areaLabel}$이므로 $R = ${fracLabel(combinedN, combinedD)}$. 이미 적용한 닮음비가 ${k1Label}이므로 $r = R \\div ${k1Label} = ${k2Label}$.`,
        `If the overall scale factor is $R$, the area ratio is $R^2 = ${areaLabel}$, so $R = ${fracLabel(combinedN, combinedD)}$. Since the first factor applied was ${k1Label}, $r = R \\div ${k1Label} = ${k2Label}$.`)
    );
  }

  return make(
    tx(profile,
      `도형을 닮음비 ${k1Label}로 닮음변환한 후, 다시 닮음비 ${k2Label}로 닮음변환했습니다. 최종 도형의 넓이는 처음 도형 넓이의 몇 배입니까?`,
      `A figure is dilated by ${k1Label}, then by ${k2Label}. What is the area of the final figure as a multiple of the original?`),
    areaLabel,
    null,
    tx(profile,
      `두 닮음변환을 합성한 전체 닮음비는 $${k1Label} \\times ${k2Label} = ${fracLabel(combinedN, combinedD)}$이므로, 넓이의 비는 그 제곱인 $${areaLabel}$입니다.`,
      `Composing the two dilations gives an overall scale factor of $${k1Label} \\times ${k2Label} = ${fracLabel(combinedN, combinedD)}$, so the area ratio is its square, $${areaLabel}$.`)
  );
}

export const TRANSFORMATIONS_ADVANCED_ENGINES = {
  'transform-translation': translationAdvanced,
  'transform-reflection': reflectionAdvanced,
  'transform-rotation': rotationAdvanced,
  'transform-dilation': dilationAdvanced,
  'transform-dilation-area': dilationAreaAdvanced,
};
