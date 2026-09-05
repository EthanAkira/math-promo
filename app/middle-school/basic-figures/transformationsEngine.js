// Coordinate transformations (translation, reflection, rotation, dilation) — Topic 11 of
// "The Essential Guide to Geometry" (Harim Yoo / Hermon House), D:\geometry. Structure and
// technique only, no source text/problems reproduced. This is standard international-school
// (Common Core / IB / AP) Geometry content that the site's basic-figures generator system
// did not previously cover at all — see project memory for why it was picked as the gap to fill.
import { profileText } from './geometryProfiles';

const ri = (random, min, max) => Math.floor(random() * (max - min + 1)) + min;
const pick = (random, values) => values[ri(random, 0, values.length - 1)];
const tx = (profile, ko, en) => profileText(profile, { ko, en });
const make = (prompt, answer, diagram, explanation, extra = {}) => ({
  prompt, promptEn: extra.promptEn, expression: extra.expression || '', expressionEn: extra.expressionEn,
  answer: String(answer), answerSuffix: extra.answerSuffix || '', diagram, explanation, choices: extra.choices,
});
const unit = (id, ko, en, koDesc, enDesc, generator, profiles) => ({ id, labels: { ko, en }, descriptions: { ko: koDesc, en: enDesc }, make: generator, profiles });

// Small triangle pool kept inside +-4 so the base shape reads cleanly on the shared grid;
// CoordTransformDiagram scales the viewport up automatically once the image (e.g. a x3 dilation) grows past that.
const TRIANGLES = [
  [[1, 1], [4, 1], [1, 3]],
  [[-3, 1], [-1, 1], [-3, 4]],
  [[1, -3], [4, -3], [1, -1]],
  [[-2, -3], [1, -3], [-2, -1]],
  [[2, 2], [2, 4], [4, 2]],
];

const fmt = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(1));
const fmtPoint = ([x, y]) => `(${fmt(x)}, ${fmt(y)})`;
const LABELS = ['A', 'B', 'C'];

function translation(random, profile) {
  const shape = pick(random, TRIANGLES);
  const dx = pick(random, [-4, -3, -2, -1, 1, 2, 3, 4]);
  const dy = pick(random, [-4, -3, -2, -1, 1, 2, 3, 4]);
  const target = ri(random, 0, 2);
  const transformed = shape.map(([x, y]) => [x + dx, y + dy]);
  const answerPoint = transformed[target];
  const dxStr = dx >= 0 ? `+${dx}` : `${dx}`;
  const dyStr = dy >= 0 ? `+${dy}` : `${dy}`;

  return make(
    tx(profile,
      `삼각형 ${LABELS.join('')}을 x축으로 ${dxStr}, y축으로 ${dyStr}만큼 평행이동했습니다. 점 ${LABELS[target]}'의 좌표를 구하세요.`,
      `Triangle ${LABELS.join('')} is translated ${dxStr} along the x-axis and ${dyStr} along the y-axis. Find the coordinates of ${LABELS[target]}'.`),
    fmtPoint(answerPoint),
    { kind: 'coord-transform', points: shape, transformedPoints: transformed, labels: LABELS, mode: 'translation' },
    tx(profile,
      `평행이동은 모든 점의 좌표에 같은 값을 더합니다: $(x, y) \\to (x${dxStr}, y${dyStr})$. ${LABELS[target]}${fmtPoint(shape[target])} $\\to$ ${LABELS[target]}'${fmtPoint(answerPoint)}`,
      `A translation adds the same amount to every point: $(x, y) \\to (x${dxStr}, y${dyStr})$. ${LABELS[target]}${fmtPoint(shape[target])} $\\to$ ${LABELS[target]}'${fmtPoint(answerPoint)}`)
  );
}

function reflection(random, profile) {
  const shape = pick(random, TRIANGLES);
  const axis = pick(random, ['x-axis', 'y-axis', 'y=x']);
  const target = ri(random, 0, 2);
  const reflect = ([x, y]) => (axis === 'x-axis' ? [x, -y] : axis === 'y-axis' ? [-x, y] : [y, x]);
  const transformed = shape.map(reflect);
  const answerPoint = transformed[target];
  const axisKo = axis === 'x-axis' ? 'x축' : axis === 'y-axis' ? 'y축' : '직선 $y=x$';
  const rule = axis === 'x-axis' ? '(x, y) \\to (x, -y)' : axis === 'y-axis' ? '(x, y) \\to (-x, y)' : '(x, y) \\to (y, x)';

  return make(
    tx(profile,
      `삼각형 ${LABELS.join('')}을 ${axisKo}에 대하여 대칭이동했습니다. 점 ${LABELS[target]}'의 좌표를 구하세요.`,
      `Triangle ${LABELS.join('')} is reflected across the ${axis}. Find the coordinates of ${LABELS[target]}'.`),
    fmtPoint(answerPoint),
    { kind: 'coord-transform', points: shape, transformedPoints: transformed, labels: LABELS, mode: 'reflection' },
    tx(profile,
      `${axisKo} 대칭은 $${rule}$입니다. ${LABELS[target]}${fmtPoint(shape[target])} $\\to$ ${LABELS[target]}'${fmtPoint(answerPoint)}`,
      `Reflecting across the ${axis} maps $${rule}$. ${LABELS[target]}${fmtPoint(shape[target])} $\\to$ ${LABELS[target]}'${fmtPoint(answerPoint)}`)
  );
}

function rotation(random, profile) {
  const shape = pick(random, TRIANGLES);
  const angle = pick(random, [90, 180, 270]);
  const target = ri(random, 0, 2);
  const rotate = ([x, y]) => (angle === 90 ? [-y, x] : angle === 180 ? [-x, -y] : [y, -x]);
  const transformed = shape.map(rotate);
  const answerPoint = transformed[target];
  const rule = angle === 90 ? '(x, y) \\to (-y, x)' : angle === 180 ? '(x, y) \\to (-x, -y)' : '(x, y) \\to (y, -x)';

  return make(
    tx(profile,
      `삼각형 ${LABELS.join('')}을 원점을 중심으로 시계 반대 방향으로 ${angle}° 회전이동했습니다. 점 ${LABELS[target]}'의 좌표를 구하세요.`,
      `Triangle ${LABELS.join('')} is rotated ${angle}° counterclockwise about the origin. Find the coordinates of ${LABELS[target]}'.`),
    fmtPoint(answerPoint),
    { kind: 'coord-transform', points: shape, transformedPoints: transformed, labels: LABELS, mode: 'rotation' },
    tx(profile,
      `원점을 중심으로 ${angle}° 회전하면 $${rule}$입니다. ${LABELS[target]}${fmtPoint(shape[target])} $\\to$ ${LABELS[target]}'${fmtPoint(answerPoint)}`,
      `Rotating ${angle}° about the origin maps $${rule}$. ${LABELS[target]}${fmtPoint(shape[target])} $\\to$ ${LABELS[target]}'${fmtPoint(answerPoint)}`)
  );
}

function dilation(random, profile) {
  const shape = pick(random, TRIANGLES);
  const k = pick(random, [2, 3]); // kept to clean integer scale factors so every image point is a nice integer
  const target = ri(random, 0, 2);
  const transformed = shape.map(([x, y]) => [x * k, y * k]);
  const answerPoint = transformed[target];

  return make(
    tx(profile,
      `삼각형 ${LABELS.join('')}을 원점을 중심으로 배율 ${k}로 확대(닮음변환)했습니다. 점 ${LABELS[target]}'의 좌표를 구하세요.`,
      `Triangle ${LABELS.join('')} is dilated from the origin by a scale factor of ${k}. Find the coordinates of ${LABELS[target]}'.`),
    fmtPoint(answerPoint),
    { kind: 'coord-transform', points: shape, transformedPoints: transformed, labels: LABELS, mode: 'dilation' },
    tx(profile,
      `원점 중심 배율 ${k} 닮음변환은 $(x, y) \\to (${k}x, ${k}y)$입니다. ${LABELS[target]}${fmtPoint(shape[target])} $\\to$ ${LABELS[target]}'${fmtPoint(answerPoint)}`,
      `A dilation of scale factor ${k} about the origin maps $(x, y) \\to (${k}x, ${k}y)$. ${LABELS[target]}${fmtPoint(shape[target])} $\\to$ ${LABELS[target]}'${fmtPoint(answerPoint)}`)
  );
}

function dilationAreaRatio(random, profile) {
  const shape = pick(random, TRIANGLES);
  const num = pick(random, [2, 3, 4, 1, 1, 1]);
  const den = num === 1 ? pick(random, [2, 3, 4]) : 1;
  const k = num / den;
  const kLabel = den === 1 ? String(num) : `${num}/${den}`;
  const ratioNum = num * num;
  const ratioDen = den * den;
  const ratioLabel = ratioDen === 1 ? String(ratioNum) : `${ratioNum}/${ratioDen}`;
  const transformed = shape.map(([x, y]) => [x * k, y * k]);

  return make(
    tx(profile,
      `도형을 닮음비 ${kLabel}로 닮음변환했을 때, 변환된 도형의 넓이는 원래 도형의 넓이의 몇 배입니까?`,
      `A figure is dilated by a scale factor of ${kLabel}. The area of the image is how many times the area of the original figure?`),
    ratioLabel,
    { kind: 'coord-transform', points: shape, transformedPoints: transformed, labels: LABELS, mode: 'dilation' },
    tx(profile,
      `닮음비가 $${kLabel}$이면 넓이의 비는 (닮음비)$^2 = ${ratioLabel}$입니다.`,
      `If the scale factor is $${kLabel}$, the area ratio is (scale factor)$^2 = ${ratioLabel}$.`)
  );
}

export const TRANSFORMATIONS_UNITS = [
  unit(
    'transform-translation', '평행이동 (Translation)', 'Translation',
    '주어진 벡터만큼 평행이동한 점의 좌표 구하기', 'Find coordinates after translating a shape by a vector',
    translation, ['kr', 'international', 'sg', 'tw', 'hk']
  ),
  unit(
    'transform-reflection', '대칭이동 (Reflection)', 'Reflection',
    'x축, y축, 직선 y=x에 대한 대칭이동으로 점의 좌표 구하기', 'Reflect a shape across the x-axis, y-axis, or the line y=x',
    reflection, ['kr', 'international', 'sg', 'tw', 'hk']
  ),
  unit(
    'transform-rotation', '회전이동 (Rotation)', 'Rotation',
    '원점을 중심으로 90°, 180°, 270° 회전이동한 점의 좌표 구하기', 'Rotate a shape 90°, 180°, or 270° about the origin',
    rotation, ['kr', 'international', 'sg', 'tw', 'hk']
  ),
  unit(
    'transform-dilation', '닮음변환 - 좌표 (Dilation)', 'Dilation (Coordinates)',
    '원점을 중심으로 배율만큼 확대·축소한 점의 좌표 구하기', 'Find coordinates after dilating a shape from the origin by a scale factor',
    dilation, ['kr', 'international', 'sg', 'tw', 'hk']
  ),
  unit(
    'transform-dilation-area', '닮음변환과 넓이의 비', 'Dilation & Area Ratio',
    '닮음비의 제곱이 넓이의 비가 되는 성질 적용하기', 'Apply the rule that the area ratio equals the square of the scale factor',
    dilationAreaRatio, ['kr', 'international', 'sg', 'tw', 'hk', 'amc']
  ),
];
