import { profileText } from './geometryProfiles';

const ri = (random, min, max) => Math.floor(random() * (max - min + 1)) + min;
const pick = (random, values) => values[ri(random, 0, values.length - 1)];
const tx = (profile, ko, en) => profileText(profile, { ko, en });
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const frac = (n, d) => { const g = gcd(n, d); return d / g === 1 ? String(n / g) : `${n / g}/${d / g}`; };
const make = (prompt, answer, diagram, explanation, extra = {}) => ({ prompt, promptEn: extra.promptEn, expression: extra.expression || '', expressionEn: extra.expressionEn, answer: String(answer), answerSuffix: extra.answerSuffix || '', diagram, explanation, choices: extra.choices });

function radians(random, profile) {
  const cases = [[30, 'π/6'], [45, 'π/4'], [60, 'π/3'], [90, 'π/2'], [120, '2π/3'], [135, '3π/4'], [150, '5π/6'], [180, 'π'], [225, '5π/4'], [270, '3π/2'], [300, '5π/3']];
  const [degree, answer] = pick(random, cases);
  return make(tx(profile, `${degree}°를 라디안으로 나타내세요.`, `Convert ${degree}° to radians.`), answer, { kind: 'angle', degrees: degree % 180 || 180, label: `${degree}°` }, tx(profile, `${degree}×π/180을 약분하면 ${answer}입니다.`, `${degree}×π/180 simplifies to ${answer}.`));
}

function rightTriangleTrig(random, profile) {
  const triples = [[3, 4, 5], [5, 12, 13], [7, 24, 25], [8, 15, 17]];
  const [opposite, adjacent, hypotenuse] = pick(random, triples);
  const mode = pick(random, ['sin', 'cos', 'tan']);
  const answer = mode === 'sin' ? frac(opposite, hypotenuse) : mode === 'cos' ? frac(adjacent, hypotenuse) : frac(opposite, adjacent);
  return make(tx(profile, `직각삼각형에서 표시된 각 θ에 대하여 ${mode} θ를 구하세요.`, `Find ${mode} θ for the marked angle in the right triangle.`), answer, { kind: 'trig-triangle', opposite, adjacent, hypotenuse, theta: true }, tx(profile, `${mode}의 정의에 대응하는 두 변의 비를 쓰면 ${answer}입니다.`, `Using the side-ratio definition of ${mode} gives ${answer}.`));
}

function sineCosineLaw(random, profile) {
  if (random() < 0.5) {
    const scale = ri(random, 2, 7);
    const answer = scale * 2;
    return make(tx(profile, '△ABC에서 ∠A=30°, ∠B=90°, a의 길이가 주어질 때 사인법칙으로 b를 구하세요.', 'In △ABC, ∠A=30° and ∠B=90°. Use the sine rule to find b.'), answer, { kind: 'oblique-triangle', sides: [scale, answer], angles: [30, 90], target: 'b' }, tx(profile, `a/sin30°=b/sin90°이므로 b=${scale}÷(1/2)=${answer}입니다.`, `Since a/sin30°=b/sin90°, b=${scale}÷(1/2)=${answer}.`), { expression: `a=${scale}` });
  }
  const triples = [[3, 4, 5], [5, 12, 13], [7, 24, 25], [8, 15, 17]];
  const [a, b, c] = pick(random, triples);
  const answer = frac(a * a + b * b - c * c, 2 * a * b);
  return make(tx(profile, '세 변의 길이가 주어진 삼각형에서 코사인법칙을 이용하여 끼인각 C의 cos C를 구하세요.', 'Use the cosine rule to find cos C from the three side lengths.'), answer, { kind: 'oblique-triangle', sides: [a, b, c], target: 'C' }, tx(profile, `cos C=(${a}²+${b}²−${c}²)/(2·${a}·${b})=${answer}입니다.`, `cos C=(${a}²+${b}²−${c}²)/(2·${a}·${b})=${answer}.`));
}

function bearing(random, profile) {
  const bearing = pick(random, [30, 45, 60, 120, 135, 210, 300, 315]);
  const quadrant = bearing < 90 ? 'NE' : bearing < 180 ? 'SE' : bearing < 270 ? 'SW' : 'NW';
  return make(tx(profile, `북쪽을 0°로 하여 시계방향으로 ${bearing}°인 방위가 향하는 사분 방향을 쓰세요.`, `A bearing of ${bearing}° is measured clockwise from north. Give its quadrant direction.`), quadrant, { kind: 'bearing', bearing }, tx(profile, `${bearing}°는 ${quadrant} 사분면 방향에 있습니다.`, `${bearing}° lies in the ${quadrant} quadrant direction.`));
}

function circleTheorems(random, profile) {
  const mode = ri(random, 0, 2);
  if (mode === 0) {
    const arc = pick(random, [60, 80, 100, 120, 140, 160]);
    return make(tx(profile, '같은 호를 보는 원주각 x를 구하세요.', 'Find the inscribed angle x subtending the marked arc.'), arc / 2, { kind: 'circle-advanced', mode: 'inscribed', arc }, tx(profile, `원주각은 같은 호의 중심각의 절반이므로 x=${arc}°÷2=${arc / 2}°입니다.`, `An inscribed angle is half its intercepted arc, so x=${arc / 2}°.`), { answerSuffix: '°' });
  }
  if (mode === 1) {
    const a = ri(random, 2, 7); const b = ri(random, 2, 7); const c = a * b;
    return make(tx(profile, `원 안에서 두 현이 만납니다. 한 현의 두 부분이 ${a}, ${b}이고 다른 현의 한 부분이 1일 때 나머지 x를 구하세요.`, `Two chords intersect. One chord has parts ${a} and ${b}; the other has parts 1 and x. Find x.`), c, { kind: 'circle-advanced', mode: 'chords', values: [a, b, 1, c] }, tx(profile, `교차하는 현의 정리에 따라 ${a}×${b}=1×x이므로 x=${c}입니다.`, `By the intersecting-chords theorem, ${a}×${b}=1×x, so x=${c}.`));
  }
  const external = ri(random, 2, 6); const whole = external + ri(random, 3, 8); const square = external * whole; const tangent = Math.sqrt(square);
  if (!Number.isInteger(tangent)) return circleTheorems(random, profile);
  return make(tx(profile, `한 점에서 그은 접선의 길이를 x라 하자. 할선의 바깥 부분이 ${external}, 전체 길이가 ${whole}일 때 x를 구하세요.`, `A tangent has length x. A secant from the same point has external part ${external} and whole length ${whole}. Find x.`), tangent, { kind: 'circle-advanced', mode: 'tangent-secant', values: [external, whole, tangent] }, tx(profile, `점의 멱에 의해 x²=${external}×${whole}=${square}이므로 x=${tangent}입니다.`, `Power of a point gives x²=${external}×${whole}=${square}, so x=${tangent}.`));
}

function triangleCenters(random, profile) {
  const mode = ri(random, 0, 2);
  if (mode === 0) {
    const unit = ri(random, 2, 8);
    return make(tx(profile, `중선 AM 위의 무게중심 G에 대하여 GM=${unit}일 때 AG를 구하세요.`, `G is the centroid on median AM. If GM=${unit}, find AG.`), unit * 2, { kind: 'triangle-center', center: 'centroid', values: [unit * 2, unit] }, tx(profile, `무게중심은 중선을 2:1로 나누므로 AG=2GM=${unit * 2}입니다.`, `A centroid divides a median 2:1, so AG=2GM=${unit * 2}.`));
  }
  if (mode === 1) return make(tx(profile, '직각삼각형의 외심은 어느 선분의 중점인지 쓰세요.', 'In a right triangle, the circumcenter is the midpoint of which segment?'), tx(profile, '빗변', 'hypotenuse'), { kind: 'triangle-center', center: 'circumcenter' }, tx(profile, '직각삼각형의 외심은 빗변의 중점입니다.', 'The circumcenter of a right triangle is the midpoint of its hypotenuse.'));
  const distance = ri(random, 2, 9);
  return make(tx(profile, `내심 I에서 한 변까지의 거리가 ${distance}일 때 다른 두 변까지의 거리를 구하세요.`, `The distance from incenter I to one side is ${distance}. Find its distances to the other two sides.`), `${distance},${distance}`, { kind: 'triangle-center', center: 'incenter', value: distance }, tx(profile, `내심은 세 변에서 같은 거리에 있으므로 모두 ${distance}입니다.`, `The incenter is equidistant from all three sides, so both distances are ${distance}.`));
}

function olympiadGeometry(random, profile) {
  if (random() < 0.5) {
    const m = ri(random, 2, 6); const n = ri(random, 2, 6); const p = ri(random, 2, 6); const answer = frac(n * p, m);
    return make(tx(profile, `Ceva 정리를 만족하는 세 선분에 대해 (${m}/${n})·(${p}/x)·1=1일 때 x를 구하세요.`, `Concurrent cevians satisfy (${m}/${n})·(${p}/x)·1=1. Find x using Ceva's theorem.`), answer, { kind: 'ceva', ratios: [m, n, p] }, tx(profile, `Ceva 정리에 따라 ${m}·${p}=${n}x이므로 x=${answer}입니다.`, `Ceva's theorem gives ${m}·${p}=${n}x, hence x=${answer}.`));
  }
  const a = ri(random, 2, 6); const b = ri(random, 2, 6); const diagonal = Math.sqrt(a * a + b * b);
  if (!Number.isInteger(diagonal)) return olympiadGeometry(random, profile);
  return make(tx(profile, `가로 ${a}, 세로 ${b}인 직사각형은 원에 내접합니다. Ptolemy 정리를 이용해 대각선의 길이를 구하세요.`, `A ${a} by ${b} rectangle is cyclic. Use Ptolemy's theorem to find a diagonal.`), diagonal, { kind: 'circle-advanced', mode: 'cyclic-quad', values: [a, b, diagonal] }, tx(profile, `Ptolemy 정리에서 d²=${a}²+${b}²=${diagonal * diagonal}이므로 d=${diagonal}입니다.`, `Ptolemy gives d²=${a}²+${b}²=${diagonal * diagonal}, so d=${diagonal}.`));
}

function conics(random, profile) {
  const mode = pick(random, ['parabola', 'ellipse', 'hyperbola']);
  if (mode === 'parabola') {
    const p = ri(random, 1, 5);
    return make(tx(profile, `포물선 y²=${4 * p}x의 초점 좌표를 구하세요.`, `Find the focus of y²=${4 * p}x.`), `${p},0`, { kind: 'conic', mode, p }, tx(profile, `y²=4px와 비교하면 p=${p}이므로 초점은 (${p},0)입니다.`, `Comparing with y²=4px gives p=${p}, so the focus is (${p},0).`));
  }
  if (mode === 'ellipse') {
    const [a, b, c] = pick(random, [[5, 4, 3], [10, 8, 6], [13, 12, 5]]);
    return make(tx(profile, `타원 x²/${a * a}+y²/${b * b}=1의 두 초점 사이의 거리를 구하세요.`, `Find the distance between the foci of x²/${a * a}+y²/${b * b}=1.`), 2 * c, { kind: 'conic', mode, a, b }, tx(profile, `c²=a²−b²=${c * c}이므로 초점은 (±${c},0), 거리는 ${2 * c}입니다.`, `c²=a²−b²=${c * c}; the foci are (±${c},0), distance ${2 * c}.`));
  }
  const [a, b, c] = pick(random, [[3, 4, 5], [5, 12, 13], [8, 15, 17]]);
  return make(tx(profile, `쌍곡선 x²/${a * a}−y²/${b * b}=1의 초점의 양의 x좌표를 구하세요.`, `Find the positive x-coordinate of a focus of x²/${a * a}−y²/${b * b}=1.`), c, { kind: 'conic', mode, a, b }, tx(profile, `c²=a²+b²=${c * c}이므로 c=${c}입니다.`, `c²=a²+b²=${c * c}, so c=${c}.`));
}

function vectors(random, profile) {
  const mode = ri(random, 0, 2);
  const vectors = pick(random, [[[3, 4], [1, 2]], [[5, 12], [-2, 3]], [[8, 15], [2, -1]]]);
  const [u, v] = vectors;
  if (mode === 0) return make(tx(profile, `벡터 u=(${u[0]},${u[1]})의 크기를 구하세요.`, `Find the magnitude of u=(${u[0]},${u[1]}).`), Math.sqrt(u[0] ** 2 + u[1] ** 2), { kind: 'vector', u }, tx(profile, `|u|=√(${u[0]}²+${u[1]}²)=${Math.sqrt(u[0] ** 2 + u[1] ** 2)}입니다.`, `|u|=√(${u[0]}²+${u[1]}²)=${Math.sqrt(u[0] ** 2 + u[1] ** 2)}.`));
  if (mode === 1) return make(tx(profile, `u=(${u}), v=(${v})일 때 u+v를 구하세요.`, `Given u=(${u}) and v=(${v}), find u+v.`), `${u[0] + v[0]},${u[1] + v[1]}`, { kind: 'vector', u, v }, tx(profile, '각 성분끼리 더합니다.', 'Add corresponding components.'));
  return make(tx(profile, `u=(${u}), v=(${v})일 때 내적 u·v를 구하세요.`, `Given u=(${u}) and v=(${v}), find u·v.`), u[0] * v[0] + u[1] * v[1], { kind: 'vector', u, v }, tx(profile, `u·v=${u[0]}·${v[0]}+${u[1]}·${v[1]}=${u[0] * v[0] + u[1] * v[1]}입니다.`, `u·v=${u[0]}·${v[0]}+${u[1]}·${v[1]}=${u[0] * v[0] + u[1] * v[1]}.`));
}

function spaceGeometry(random, profile) {
  const mode = ri(random, 0, 2);
  if (mode === 0) {
    const triple = pick(random, [[1, 2, 2, 3], [2, 3, 6, 7], [2, 6, 9, 11]]); const [x, y, z, answer] = triple;
    return make(tx(profile, `공간에서 O(0,0,0)과 P(${x},${y},${z}) 사이의 거리를 구하세요.`, `Find the distance from O(0,0,0) to P(${x},${y},${z}).`), answer, { kind: 'space-coordinate', point: [x, y, z] }, tx(profile, `OP=√(${x}²+${y}²+${z}²)=${answer}입니다.`, `OP=√(${x}²+${y}²+${z}²)=${answer}.`));
  }
  if (mode === 1) {
    const [w, d, h] = pick(random, [[3, 4, 5], [4, 6, 8], [5, 8, 10]]);
    return make(tx(profile, `가로 ${w}, 세로 ${d}, 높이 ${h}인 직육면체의 부피를 구하세요.`, `Find the volume of a cuboid with dimensions ${w}, ${d}, ${h}.`), w * d * h, { kind: 'space-coordinate', box: [w, d, h] }, tx(profile, `부피=${w}×${d}×${h}=${w * d * h}입니다.`, `Volume=${w}×${d}×${h}=${w * d * h}.`));
  }
  const length = ri(random, 3, 12); const angle = pick(random, [30, 60]);
  const answer = angle === 60 ? frac(length, 2) : length % 2 === 0 ? `${length / 2}√3` : `${length}√3/2`;
  return make(tx(profile, `길이 ${length}인 선분이 평면과 ${angle}°의 각을 이룰 때 평면 위 정사영의 길이를 구하세요.`, `A segment of length ${length} makes an angle of ${angle}° with a plane. Find the projection length on the plane.`), answer, { kind: 'space-coordinate', projection: [length, angle] }, tx(profile, `정사영의 길이는 ${length}cos${angle}°=${answer}입니다.`, `Projection length is ${length}cos${angle}°=${answer}.`));
}

function trigGraphs(random, profile) {
  const amplitude = ri(random, 1, 4); const periodFactor = pick(random, [1, 2, 3]);
  const periodCoefficient = frac(2, periodFactor);
  const period = periodCoefficient === '2' ? '2π' : periodCoefficient === '1' ? 'π' : `${periodCoefficient}π`;
  const askAmplitude = random() < 0.5;
  return make(tx(profile, `그래프 y=${amplitude}sin(${periodFactor}x)에서 ${askAmplitude ? '진폭' : '주기'}를 구하세요.`, `For y=${amplitude}sin(${periodFactor}x), find its ${askAmplitude ? 'amplitude' : 'period'}.`), askAmplitude ? amplitude : period, { kind: 'trig-graph', amplitude, periodFactor }, tx(profile, askAmplitude ? `sin 앞의 계수의 절댓값이 진폭이므로 ${amplitude}입니다.` : `주기는 2π/${periodFactor}=${period}입니다.`, askAmplitude ? `The amplitude is the absolute coefficient ${amplitude}.` : `The period is 2π/${periodFactor}=${period}.`));
}

function calculusVisuals(random, profile) {
  const mode = ri(random, 0, 2);
  if (mode === 0) {
    const a = ri(random, 1, 4); const x = ri(random, -3, 3); const slope = 2 * a * x;
    return make(tx(profile, `곡선 y=${a}x² 위에서 x=${x}인 점의 접선 기울기를 구하세요.`, `Find the tangent slope to y=${a}x² at x=${x}.`), slope, { kind: 'function-graph', mode: 'tangent', a, x, slope }, tx(profile, `y'=${2 * a}x이므로 x=${x}에서 기울기는 ${slope}입니다.`, `y'=${2 * a}x, so the slope at x=${x} is ${slope}.`));
  }
  if (mode === 1) {
    const b = ri(random, 2, 8); const h = ri(random, 2, 8); const area = b * h / 2;
    return make(tx(profile, `0≤x≤${b}에서 직선 그래프 아래 삼각형의 높이가 ${h}일 때 넓이를 구하세요.`, `On 0≤x≤${b}, the triangular region under the line has height ${h}. Find its area.`), area, { kind: 'function-graph', mode: 'area', b, h }, tx(profile, `삼각형 넓이는 ${b}×${h}÷2=${area}입니다.`, `The triangular area is ${b}×${h}÷2=${area}.`));
  }
  const radius = ri(random, 2, 7); const height = ri(random, 2, 9);
  return make(tx(profile, `높이 ${height}, 밑면의 반지름 ${radius}인 원기둥 회전체의 부피를 π의 배수로 구하세요.`, `Find the volume of a cylinder of radius ${radius} and height ${height} as a multiple of π.`), `${radius * radius * height}π`, { kind: 'function-graph', mode: 'revolution', radius, height }, tx(profile, `V=πr²h=π·${radius}²·${height}=${radius * radius * height}π입니다.`, `V=πr²h=π·${radius}²·${height}=${radius * radius * height}π.`));
}

function statisticsVisuals(random, profile) {
  if (random() < 0.5) {
    const q1 = ri(random, 2, 8); const median = q1 + ri(random, 2, 5); const q3 = median + ri(random, 2, 5);
    return make(tx(profile, '상자그림에서 사분위범위 IQR을 구하세요.', 'Find the interquartile range (IQR) from the box plot.'), q3 - q1, { kind: 'box-plot', values: [q1 - 2, q1, median, q3, q3 + 3] }, tx(profile, `IQR=Q3−Q1=${q3}−${q1}=${q3 - q1}입니다.`, `IQR=Q3−Q1=${q3}−${q1}=${q3 - q1}.`));
  }
  const positive = random() < 0.5;
  const points = Array.from({ length: 8 }, (_, i) => [i + 1, positive ? i + ri(random, 1, 3) : 10 - i + ri(random, -1, 1)]);
  return make(tx(profile, '산점도에 나타난 상관관계를 양의 상관관계 또는 음의 상관관계로 쓰세요.', 'Classify the scatter plot as positive or negative correlation.'), tx(profile, positive ? '양의 상관관계' : '음의 상관관계', positive ? 'positive' : 'negative'), { kind: 'scatter', points }, tx(profile, positive ? 'x가 증가할수록 y도 대체로 증가합니다.' : 'x가 증가할수록 y는 대체로 감소합니다.', positive ? 'As x increases, y generally increases.' : 'As x increases, y generally decreases.'));
}

const unit = (id, ko, en, koDesc, enDesc, generator, profiles) => ({ id, labels: { ko, en }, descriptions: { ko: koDesc, en: enDesc }, make: generator, profiles });

export const ADVANCED_GEOMETRY_UNITS = [
  unit('radians-trig-ratios', '라디안·삼각비·방위각', 'Radians, trigonometric ratios & bearings', '각도와 라디안 변환, 직각삼각형의 삼각비와 방위각', 'Radians, right-triangle ratios and bearings', (r, p) => pick(r, [radians, rightTriangleTrig, bearing])(r, p), ['g12', 'ib', 'amc12', 'csat']),
  unit('sine-cosine-laws', '사인법칙·코사인법칙', 'Sine & cosine rules', '비직각삼각형의 변과 각 계산', 'Solve non-right triangles', sineCosineLaw, ['g12', 'ib', 'amc12', 'csat']),
  unit('advanced-circle-theorems', '원의 고급 성질·점의 멱', 'Advanced circle theorems & power of a point', '원주각, 현, 접선, 할선과 점의 멱', 'Inscribed angles, chords, tangents, secants and power of a point', circleTheorems, ['g12', 'ib', 'amc12', 'csat']),
  unit('triangle-centers', '삼각형의 중심', 'Triangle centers', '무게중심, 내심, 외심의 성질', 'Centroid, incenter and circumcenter properties', triangleCenters, ['g12', 'ib', 'amc12', 'csat']),
  unit('olympiad-geometry', 'Ceva·Ptolemy 복합기하', 'Ceva & Ptolemy geometry', '비율과 원에 내접하는 사각형을 결합한 고난도 추론', 'Advanced ratio and cyclic-quadrilateral reasoning', olympiadGeometry, ['amc12']),
  unit('conic-sections', '이차곡선', 'Conic sections', '포물선·타원·쌍곡선의 초점과 방정식', 'Foci and equations of parabolas, ellipses and hyperbolas', conics, ['g12', 'ib', 'csat']),
  unit('plane-vectors', '평면벡터', 'Plane vectors', '벡터의 성분, 크기, 합과 내적', 'Components, magnitude, addition and dot product', vectors, ['g12', 'ib', 'amc12', 'csat']),
  unit('space-geometry-coordinates', '공간도형·공간좌표·정사영', '3D geometry, coordinates & projection', '공간 거리, 입체의 부피, 평면 위 정사영', 'Spatial distance, solid volume and orthogonal projection', spaceGeometry, ['g12', 'ib', 'csat']),
  unit('trigonometric-graphs', '삼각함수 그래프', 'Trigonometric graphs', '사인 그래프의 진폭과 주기', 'Amplitude and period of sine graphs', trigGraphs, ['g12', 'ib', 'csat']),
  unit('calculus-geometry-visuals', '미적분 그래프·접선·넓이·회전체', 'Calculus graphs, tangents, area & solids', '미분 기울기, 정적분 넓이와 회전체 부피', 'Derivative slopes, integral area and solids of revolution', calculusVisuals, ['g12', 'ib', 'csat']),
  unit('statistics-visuals', '확률·통계 시각화', 'Statistics visualisation', '상자그림과 산점도의 수치·관계 해석', 'Interpret box plots and scatter plots', statisticsVisuals, ['g12', 'ib', 'amc12', 'csat']),
  unit('amc12-geometry-mixed', 'AMC12 고난도 기하 종합', 'AMC 12 advanced geometry review', '원의 성질, 삼각형 중심, 정리, 벡터를 결합한 종합', 'Mixed circle, triangle-center, theorem and vector problems', (r, p) => pick(r, [circleTheorems, triangleCenters, olympiadGeometry, vectors, sineCosineLaw])(r, p), ['amc12']),
  unit('csat-geometry-mixed', '수능 기하 종합', 'Korean CSAT geometry review', '이차곡선, 평면벡터, 공간좌표와 정사영 종합', 'Mixed conics, vectors, 3D coordinates and projection', (r, p) => pick(r, [conics, vectors, spaceGeometry])(r, p), ['csat']),
  unit('g12-visual-mixed', 'G12 수학 시각화 종합', 'G12 mathematics visual review', '삼각함수, 미적분, 통계 그래프 종합', 'Mixed trigonometry, calculus and statistics visuals', (r, p) => pick(r, [trigGraphs, calculusVisuals, statisticsVisuals])(r, p), ['g12', 'ib']),
];
