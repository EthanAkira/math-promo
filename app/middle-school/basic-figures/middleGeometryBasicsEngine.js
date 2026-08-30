import { profileText } from './geometryProfiles';

const ri = (random, min, max) => Math.floor(random() * (max - min + 1)) + min;
const pick = (random, values) => values[ri(random, 0, values.length - 1)];
const tx = (profile, ko, en) => profileText(profile, { ko, en, 'zh-TW': en, 'zh-HK': en });
const make = (prompt, answer, diagram, explanation, extra = {}) => ({ prompt, expression: '', answer: String(answer), answerSuffix: extra.answerSuffix || '', diagram, explanation, ...extra });
const choices = (ko, en = ko) => ko.map((label, index) => ({ value: String(index + 1), label, labelEn: en[index] || label }));
const MIDDLE_PROFILES = ['kr', 'international', 'amc', 'sg', 'tw', 'hk'];

function polygonDiagonals(random, profile) {
  const n = ri(random, 4, 12); const mode = ri(random, 0, 2);
  if (mode === 0) return make(tx(profile, `정${n}각형의 한 꼭짓점에서 그을 수 있는 대각선의 개수를 구하세요.`, `Find the number of diagonals from one vertex of a regular ${n}-gon.`), n - 3, { kind: 'polygon-basic', n, mode: 'vertex-diagonals' }, tx(profile, `자기 자신과 양옆의 두 꼭짓점을 제외하므로 ${n}−3=${n - 3}개입니다.`, `Exclude the vertex itself and its two neighbours: ${n}−3=${n - 3}.`));
  const total = n * (n - 3) / 2;
  if (mode === 1) return make(tx(profile, `${n}각형의 대각선의 총 개수를 구하세요.`, `Find the total number of diagonals in a ${n}-gon.`), total, { kind: 'polygon-basic', n, mode: 'all-diagonals' }, tx(profile, `각 꼭짓점에서 ${n - 3}개를 긋고 두 번씩 센 것이므로 ${n}(${n}−3)/2=${total}개입니다.`, `There are ${n}(${n}−3)/2=${total} diagonals.`));
  return make(tx(profile, `대각선의 개수가 ${total}개인 다각형의 변의 개수를 구하세요.`, `A polygon has ${total} diagonals. Find its number of sides.`), n, { kind: 'polygon-basic', n, mode: 'outline' }, tx(profile, `m(m−3)/2=${total}을 만족하는 자연수 m은 ${n}입니다.`, `Solve m(m−3)/2=${total}; m=${n}.`));
}

function polygonAngles(random, profile) {
  const n = ri(random, 3, 12); const mode = ri(random, 0, 4); const sum = (n - 2) * 180;
  if (mode === 0) return make(tx(profile, `${n}각형의 내각의 크기의 합을 구하세요.`, `Find the sum of the interior angles of a ${n}-gon.`), sum, { kind: 'polygon-basic', n, mode: 'outline' }, tx(profile, `한 꼭짓점에서 ${n - 2}개의 삼각형으로 나뉘므로 합은 (${n}−2)×180°=${sum}°입니다.`, `Triangulation gives (${n}−2)×180°=${sum}°.`), { answerSuffix: '°' });
  if (mode === 1) return make(tx(profile, `${n}각형의 외각의 크기의 합을 구하세요.`, `Find the sum of one exterior angle at each vertex of a ${n}-gon.`), 360, { kind: 'polygon-basic', n, mode: 'exterior' }, tx(profile, '한 방향으로 한 바퀴 회전하므로 외각의 합은 항상 360°입니다.', 'The exterior angles make one full turn, so their sum is 360°.'), { answerSuffix: '°' });
  const exterior = 360 / n;
  if (Number.isInteger(exterior) && mode <= 3) {
    const interior = 180 - exterior;
    return mode === 2
      ? make(tx(profile, `정${n}각형의 한 외각의 크기를 구하세요.`, `Find one exterior angle of a regular ${n}-gon.`), exterior, { kind: 'polygon-basic', n, mode: 'exterior' }, tx(profile, `360°÷${n}=${exterior}°입니다.`, `360°÷${n}=${exterior}°.`), { answerSuffix: '°' })
      : make(tx(profile, `정${n}각형의 한 내각의 크기를 구하세요.`, `Find one interior angle of a regular ${n}-gon.`), interior, { kind: 'polygon-basic', n, mode: 'interior' }, tx(profile, `180°−360°/${n}=${interior}°입니다.`, `180°−360°/${n}=${interior}°.`), { answerSuffix: '°' });
  }
  const valid = pick(random, [4, 5, 6, 8, 9, 10, 12]); const angle = 360 / valid;
  return make(tx(profile, `한 외각의 크기가 ${angle}°인 정다각형의 이름을 변의 개수로 답하세요.`, `A regular polygon has exterior angle ${angle}°. How many sides does it have?`), valid, { kind: 'polygon-basic', n: valid, mode: 'exterior' }, tx(profile, `변의 개수는 360°÷${angle}°=${valid}입니다.`, `The number of sides is 360°÷${angle}°=${valid}.`));
}

function circleParts(random, profile) {
  const cases = [
    ['원의 중심과 원 위의 한 점을 이은 선분', '반지름', 'radius'],
    ['원의 중심을 지나며 양 끝점이 원 위에 있는 현', '지름', 'diameter'],
    ['원 위의 두 점을 이은 선분', '현', 'chord'],
    ['원 위의 두 점 사이의 원의 일부분', '호', 'arc'],
  ];
  const selected = pick(random, cases); const labels = ['반지름', '지름', '현', '호']; const labelsEn = ['radius', 'diameter', 'chord', 'arc'];
  return make(tx(profile, `${selected[0]}을 무엇이라 하는지 고르세요.`, `Choose the term for: ${selected[2]}.`), labels.indexOf(selected[1]) + 1, { kind: 'circle-parts', target: selected[2], rotation: ri(random, 0, 359) }, tx(profile, `정의에 따라 ${selected[1]}입니다.`, `By definition, it is the ${selected[2]}.`), { choices: choices(labels, labelsEn) });
}

function circleProportion(random, profile) {
  const thetaA = pick(random, [30, 45, 60, 90, 120]); const thetaB = pick(random, [30, 60, 90, 120, 150]); const valueA = pick(random, [4, 6, 8, 10, 12]); const answer = valueA * thetaB / thetaA;
  if (!Number.isInteger(answer) || thetaA === thetaB) return circleProportion(random, profile);
  const area = random() < 0.5;
  return make(tx(profile, `같은 원에서 중심각이 ${thetaA}°인 부채꼴의 ${area ? '넓이' : '호의 길이'}가 ${valueA}${area ? 'cm²' : 'cm'}입니다. 중심각이 ${thetaB}°인 부채꼴의 ${area ? '넓이' : '호의 길이'} x를 구하세요.`, `In the same circle, a ${thetaA}° sector has ${area ? 'area' : 'arc length'} ${valueA}. Find the corresponding value x for a ${thetaB}° sector.`), answer, { kind: 'circle-ratio', thetaA, thetaB, valueA, area }, tx(profile, `같은 원에서는 ${area ? '넓이' : '호의 길이'}가 중심각에 비례하므로 x=${valueA}×${thetaB}/${thetaA}=${answer}입니다.`, `The quantity is proportional to the central angle, so x=${valueA}×${thetaB}/${thetaA}=${answer}.`), { answerSuffix: area ? 'cm²' : 'cm' });
}

function annulusComposite(random, profile) {
  const inner = ri(random, 2, 6); const thickness = ri(random, 1, 4); const outer = inner + thickness; const area = outer * outer - inner * inner;
  return make(tx(profile, `안쪽 반지름이 ${inner}cm이고 띠의 두께가 ${thickness}cm인 원환의 넓이를 π의 배수로 구하세요.`, `Find the area of an annulus with inner radius ${inner} cm and thickness ${thickness} cm as a multiple of π.`), `${area}π`, { kind: 'annulus-basic', inner, outer }, tx(profile, `바깥 반지름은 ${outer}cm이고 넓이는 π(${outer}²−${inner}²)=${area}πcm²입니다.`, `The outer radius is ${outer}; area=π(${outer}²−${inner}²)=${area}π.`), { answerSuffix: 'cm²' });
}

function polyhedronCounts(random, profile) {
  const n = ri(random, 3, 9); const prism = random() < 0.5; const values = prism ? { faces: n + 2, vertices: 2 * n, edges: 3 * n } : { faces: n + 1, vertices: n + 1, edges: 2 * n }; const key = pick(random, ['faces', 'vertices', 'edges']); const ko = { faces: '면', vertices: '꼭짓점', edges: '모서리' }[key];
  return make(tx(profile, `${prism ? `${n}각기둥` : `${n}각뿔`}의 ${ko}의 개수를 구하세요.`, `Find the number of ${key} of a${prism ? ' prism' : ' pyramid'} with an ${n}-gon base.`), values[key], { kind: 'polyhedron-general', n, solid: prism ? 'prism' : 'pyramid' }, tx(profile, prism ? `${n}각기둥은 면 ${n + 2}개, 꼭짓점 ${2 * n}개, 모서리 ${3 * n}개입니다.` : `${n}각뿔은 면 ${n + 1}개, 꼭짓점 ${n + 1}개, 모서리 ${2 * n}개입니다.`, `Count the base faces, lateral faces, vertices and edges systematically.`));
}

function regularPolyhedra(random, profile) {
  const solids = [
    ['정사면체', 4, 3, 3, 'regular tetrahedron'], ['정육면체', 6, 4, 3, 'cube'], ['정팔면체', 8, 3, 4, 'regular octahedron'], ['정십이면체', 12, 5, 3, 'regular dodecahedron'], ['정이십면체', 20, 3, 5, 'regular icosahedron'],
  ]; const s = pick(random, solids); const mode = ri(random, 0, 2); const keys = mode === 0 ? ['면의 개수', 'number of faces', s[1]] : mode === 1 ? ['각 면의 변의 개수', 'sides on each face', s[2]] : ['한 꼭짓점에 모이는 면의 개수', 'faces meeting at one vertex', s[3]];
  return make(tx(profile, `${s[0]}의 ${keys[0]}를 구하세요.`, `Find the ${keys[1]} of a ${s[4]}.`), keys[2], { kind: 'regular-polyhedron', name: s[0], faces: s[1] }, tx(profile, `${s[0]}의 정의와 구성에 따라 정답은 ${keys[2]}입니다.`, `By the structure of a ${s[4]}, the answer is ${keys[2]}.`));
}

function revolutionAndNets(random, profile) {
  if (random() < 0.45) {
    const nets = [['net-cylinder', '원기둥', 'cylinder'], ['net-cone', '원뿔', 'cone'], ['net-prism', '삼각기둥', 'triangular prism']]; const selected = pick(random, nets); const labels = ['원기둥', '원뿔', '삼각기둥']; const labelsEn = ['cylinder', 'cone', 'triangular prism'];
    return make(tx(profile, '그림의 전개도로 만들 수 있는 입체도형을 고르세요.', 'Choose the solid made by the net.'), labels.indexOf(selected[1]) + 1, { kind: 'net-basic', net: selected[0], shift: ri(random, -12, 12) }, tx(profile, `밑면과 옆면의 모양을 접으면 ${selected[1]}이 됩니다.`, `Folding the bases and lateral faces makes a ${selected[2]}.`), { choices: choices(labels, labelsEn) });
  }
  const shapes = [
    ['직사각형', '원기둥', 'cylinder'], ['직각삼각형', '원뿔', 'cone'], ['반원', '구', 'sphere'],
  ]; const s = pick(random, shapes); const labels = ['원기둥', '원뿔', '구']; const labelsEn = ['cylinder', 'cone', 'sphere'];
  return make(tx(profile, `${s[0]}을 한 변을 축으로 하여 한 바퀴 회전시킬 때 생기는 회전체를 고르세요.`, `Rotate a ${s[0]} once about the marked axis. Choose the solid formed.`), labels.indexOf(s[1]) + 1, { kind: 'revolution-basic', source: s[2] }, tx(profile, `회전한 각 점이 원을 그리므로 ${s[1]}이 만들어집니다.`, `The rotation forms a ${s[2]}.`), { choices: choices(labels, labelsEn) });
}

function prismCylinderMeasures(random, profile) {
  const cylinder = random() < 0.5; const volume = random() < 0.5;
  if (cylinder) { const r = ri(random, 2, 6); const h = ri(random, 4, 12); const coefficient = volume ? r * r * h : 2 * r * r + 2 * r * h; return make(tx(profile, `반지름 ${r}cm, 높이 ${h}cm인 원기둥의 ${volume ? '부피' : '겉넓이'}를 π의 배수로 구하세요.`, `Find the ${volume ? 'volume' : 'surface area'} of a cylinder with radius ${r} and height ${h}, as a multiple of π.`), `${coefficient}π`, { kind: 'measurement-solid', solid: 'cylinder', r, h }, tx(profile, volume ? `V=πr²h=${coefficient}πcm³입니다.` : `S=2πr²+2πrh=${coefficient}πcm²입니다.`, volume ? `V=πr²h=${coefficient}π.` : `S=2πr²+2πrh=${coefficient}π.`), { answerSuffix: volume ? 'cm³' : 'cm²' }); }
  const w = ri(random, 2, 8); const d = ri(random, 2, 8); const h = ri(random, 3, 12); const answer = volume ? w * d * h : 2 * (w * d + d * h + h * w);
  return make(tx(profile, `가로 ${w}cm, 세로 ${d}cm, 높이 ${h}cm인 직육면체의 ${volume ? '부피' : '겉넓이'}를 구하세요.`, `Find the ${volume ? 'volume' : 'surface area'} of a cuboid ${w} by ${d} by ${h}.`), answer, { kind: 'measurement-solid', solid: 'cuboid', w, d, h }, tx(profile, volume ? `V=${w}×${d}×${h}=${answer}cm³입니다.` : `S=2(${w}×${d}+${d}×${h}+${h}×${w})=${answer}cm²입니다.`, `Apply the ${volume ? 'volume' : 'surface-area'} formula to obtain ${answer}.`), { answerSuffix: volume ? 'cm³' : 'cm²' });
}

function pyramidConeMeasures(random, profile) {
  const cone = random() < 0.5;
  if (cone) { const r = ri(random, 2, 7); const h = ri(random, 3, 12) * 3; const coefficient = r * r * h / 3; return make(tx(profile, `밑면의 반지름 ${r}cm, 높이 ${h}cm인 원뿔의 부피를 π의 배수로 구하세요.`, `Find the volume of a cone with radius ${r} and height ${h}, as a multiple of π.`), `${coefficient}π`, { kind: 'measurement-solid', solid: 'cone', r, h }, tx(profile, `V=⅓πr²h=⅓π×${r}²×${h}=${coefficient}πcm³입니다.`, `V=⅓πr²h=${coefficient}π.`), { answerSuffix: 'cm³' }); }
  const base = ri(random, 3, 10); const height = ri(random, 2, 8) * 3; const answer = base * base * height / 3;
  return make(tx(profile, `밑면이 한 변 ${base}cm인 정사각형이고 높이가 ${height}cm인 사각뿔의 부피를 구하세요.`, `Find the volume of a square pyramid with base side ${base} and height ${height}.`), answer, { kind: 'measurement-solid', solid: 'pyramid', base, h: height }, tx(profile, `V=⅓×${base}²×${height}=${answer}cm³입니다.`, `V=⅓×${base}²×${height}=${answer}.`), { answerSuffix: 'cm³' });
}

function sphereMeasures(random, profile) {
  const r = ri(random, 2, 15); const surface = random() < 0.5; const coefficient = surface ? 4 * r * r : 4 * r * r * r; const answer = surface ? `${coefficient}π` : `${coefficient}π/3`;
  return make(tx(profile, `반지름이 ${r}cm인 구의 ${surface ? '겉넓이' : '부피'}를 구하세요.`, `Find the ${surface ? 'surface area' : 'volume'} of a sphere of radius ${r}.`), answer, { kind: 'measurement-solid', solid: 'sphere', r }, tx(profile, surface ? `S=4πr²=4π×${r}²=${answer}cm²입니다.` : `V=4/3πr³=4/3π×${r}³=${answer}cm³입니다.`, `Apply the sphere ${surface ? 'surface-area' : 'volume'} formula.`), { answerSuffix: surface ? 'cm²' : 'cm³' });
}

function solidRatios(random, profile) {
  const type = random() < 0.5 ? 'cone' : 'pyramid';
  return make(tx(profile, `밑넓이와 높이가 각각 같은 ${type === 'cone' ? '원기둥과 원뿔' : '각기둥과 각뿔'}의 부피의 비를 ${type === 'cone' ? '원기둥:원뿔' : '각기둥:각뿔'}로 나타내세요.`, `A prism/cylinder and matching pyramid/cone have the same base area and height. Find their volume ratio.`), '3:1', { kind: 'solid-ratio', solid: type }, tx(profile, '뿔의 부피는 대응하는 기둥 부피의 1/3이므로 비는 3:1입니다.', 'A pyramid or cone has one third the volume of the matching prism or cylinder, so the ratio is 3:1.'));
}

function polygonFoundations(random, profile) {
  const n = ri(random, 3, 12); const mode = ri(random, 0, 2);
  if (mode === 0) return make(tx(profile, `한 꼭짓점에서 만나는 두 변이 이루는 각을 무엇이라 하는지 고르세요.`, 'Choose the name of the angle formed by two adjacent sides at a vertex.'), 1, { kind: 'polygon-basic', n, mode: 'interior' }, tx(profile, '다각형의 안쪽에 생기는 각이므로 내각입니다.', 'It is the interior angle of the polygon.'), { choices: choices(['내각', '외각', '중심각', '맞꼭지각'], ['interior angle', 'exterior angle', 'central angle', 'vertical angle']) });
  if (mode === 1) return make(tx(profile, `${n}각형의 변의 개수와 꼭짓점의 개수의 합을 구하세요.`, `Find the sum of the numbers of sides and vertices of an ${n}-gon.`), 2 * n, { kind: 'polygon-basic', n, mode: 'outline' }, tx(profile, `${n}각형은 변과 꼭짓점이 각각 ${n}개이므로 합은 ${2 * n}개입니다.`, `An ${n}-gon has ${n} sides and ${n} vertices, so the sum is ${2 * n}.`));
  const regular = random() < 0.5;
  return make(tx(profile, regular ? '모든 변의 길이와 모든 내각의 크기가 각각 같은 다각형을 무엇이라 하는지 고르세요.' : '모든 변의 길이만 같으면 항상 정다각형인지 판단하세요.', regular ? 'Choose the name of a polygon whose sides and interior angles are all equal.' : 'Decide whether equal side lengths alone always make a polygon regular.'), regular ? 1 : 2, { kind: 'polygon-basic', n, mode: 'outline' }, tx(profile, regular ? '정다각형은 모든 변의 길이와 모든 내각의 크기가 각각 같습니다.' : '변의 길이뿐 아니라 모든 내각의 크기도 같아야 정다각형입니다.', regular ? 'This is the definition of a regular polygon.' : 'A regular polygon must have both equal sides and equal interior angles.'), { choices: choices(regular ? ['정다각형', '부채꼴', '다면체', '회전체'] : ['항상 그렇다', '항상 그렇지는 않다'], regular ? ['regular polygon', 'sector', 'polyhedron', 'solid of revolution'] : ['always true', 'not always true']) });
}

function triangleInteriorExterior(random, profile) {
  const a = ri(random, 3, 7) * 10; const b = ri(random, 3, Math.min(8, 14 - a / 10)) * 10; const exterior = random() < 0.5; const answer = exterior ? a + b : 180 - a - b;
  return make(tx(profile, exterior ? '삼각형의 두 원격 내각을 이용하여 외각 x의 크기를 구하세요.' : '삼각형의 내각의 합을 이용하여 x의 크기를 구하세요.', exterior ? 'Use the two remote interior angles to find exterior angle x.' : 'Use the triangle angle sum to find x.'), answer, { kind: 'triangle-exterior-basic', a, b, exterior }, tx(profile, exterior ? `삼각형의 한 외각은 두 원격 내각의 합이므로 x=${a}+${b}=${answer}°입니다.` : `x=180°−${a}°−${b}°=${answer}°입니다.`, exterior ? `An exterior angle equals the sum of the two remote interior angles: ${answer}°.` : `x=180°−${a}°−${b}°=${answer}°.`), { answerSuffix: '°' });
}

function sectorInverseMeasures(random, profile) {
  const radius = pick(random, [4, 6, 8, 10, 12]); const theta = pick(random, [45, 60, 90, 120, 180]); const mode = ri(random, 0, 2);
  const arcCoefficient = 2 * radius * theta / 360; const areaCoefficient = radius * radius * theta / 360;
  if (!Number.isInteger(arcCoefficient) || !Number.isInteger(areaCoefficient)) return sectorInverseMeasures(random, profile);
  if (mode === 0) return make(tx(profile, `반지름이 ${radius}cm이고 호의 길이가 ${arcCoefficient}πcm인 부채꼴의 넓이를 π의 배수로 구하세요.`, `A sector has radius ${radius} cm and arc length ${arcCoefficient}π cm. Find its area as a multiple of π.`), `${areaCoefficient}π`, { kind: 'circle-sector', radius, theta, showSector: true, arcLabel: `${arcCoefficient}π cm` }, tx(profile, `부채꼴의 넓이는 1/2×반지름×호의 길이이므로 ${areaCoefficient}πcm²입니다.`, `Sector area is one half of radius times arc length, giving ${areaCoefficient}π.`), { answerSuffix: 'cm²' });
  if (mode === 1) return make(tx(profile, `반지름이 ${radius}cm이고 넓이가 ${areaCoefficient}πcm²인 부채꼴의 중심각 x를 구하세요.`, `A sector has radius ${radius} cm and area ${areaCoefficient}π cm². Find its central angle x.`), theta, { kind: 'circle-sector', radius, theta, showSector: true, unknownTheta: true }, tx(profile, `π×${radius}²×x/360=${areaCoefficient}π이므로 x=${theta}°입니다.`, `Solve π×${radius}²×x/360=${areaCoefficient}π to obtain ${theta}°.`), { answerSuffix: '°' });
  return make(tx(profile, `반지름이 ${radius}cm이고 중심각이 ${theta}°인 부채꼴의 둘레를 a+bπcm 꼴로 나타낼 때 a+b를 구하세요.`, `The perimeter of a sector of radius ${radius} cm and angle ${theta}° is a+bπ cm. Find a+b.`), 2 * radius + arcCoefficient, { kind: 'circle-sector', radius, theta, showSector: true }, tx(profile, `둘레는 두 반지름과 호의 합이므로 ${2 * radius}+${arcCoefficient}πcm이고 a+b=${2 * radius + arcCoefficient}입니다.`, `Perimeter = ${2 * radius}+${arcCoefficient}π, so a+b=${2 * radius + arcCoefficient}.`));
}

function annularSectorMeasures(random, profile) {
  const theta = pick(random, [90, 180]); const inner = ri(random, 2, 6); const outer = inner + ri(random, 2, 5); const areaCoefficient = (outer * outer - inner * inner) * theta / 360;
  if (!Number.isInteger(areaCoefficient)) return annularSectorMeasures(random, profile);
  const perimeterPi = (outer + inner) * theta / 180; const straight = 2 * (outer - inner); const area = random() < 0.55;
  return area
    ? make(tx(profile, `중심각이 ${theta}°이고 두 반지름이 ${inner}cm, ${outer}cm인 고리 모양 부채꼴의 넓이를 구하세요.`, `Find the area of an annular sector with angle ${theta}° and radii ${inner} cm and ${outer} cm.`), `${areaCoefficient}π`, { kind: 'annular-sector-basic', theta, inner, outer }, tx(profile, `π(${outer}²−${inner}²)×${theta}/360=${areaCoefficient}πcm²입니다.`, `π(${outer}²−${inner}²)×${theta}/360=${areaCoefficient}π.`), { answerSuffix: 'cm²' })
    : make(tx(profile, `중심각이 ${theta}°이고 두 반지름이 ${inner}cm, ${outer}cm인 고리 모양 부채꼴의 둘레를 a+bπcm 꼴로 나타낼 때 a+b를 구하세요.`, `The perimeter of the annular sector is a+bπ cm. Find a+b.`), straight + perimeterPi, { kind: 'annular-sector-basic', theta, inner, outer }, tx(profile, `두 호와 두 직선 부분의 합은 ${straight}+${perimeterPi}πcm이므로 a+b=${straight + perimeterPi}입니다.`, `Adding both arcs and both radial segments gives ${straight}+${perimeterPi}π.`));
}

function polyhedronConcepts(random, profile) {
  const n = ri(random, 3, 8); const prism = random() < 0.5; const vertices = prism ? 2 * n : n + 1; const edges = prism ? 3 * n : 2 * n; const faces = prism ? n + 2 : n + 1; const mode = ri(random, 0, 2); const solid = prism ? 'prism' : 'pyramid'; const name = `${n}각${prism ? '기둥' : '뿔'}`;
  if (mode === 0) return make(tx(profile, `${name}에서 꼭짓점의 수 V, 모서리의 수 E, 면의 수 F에 대하여 V−E+F의 값을 구하세요.`, `For this ${n}-gonal ${solid}, find V−E+F.`), 2, { kind: 'polyhedron-general', n, solid }, tx(profile, `${vertices}−${edges}+${faces}=2로 오일러의 다면체 정리를 만족합니다.`, `${vertices}−${edges}+${faces}=2 by Euler's polyhedron formula.`));
  if (mode === 1) return make(tx(profile, `${name}의 꼭짓점이 ${vertices}개이고 모서리가 ${edges}개일 때 면의 개수를 구하세요.`, `The solid has ${vertices} vertices and ${edges} edges. Find its number of faces.`), faces, { kind: 'polyhedron-general', n, solid }, tx(profile, `V−E+F=2에서 F=2−${vertices}+${edges}=${faces}입니다.`, `Euler's formula gives F=2−${vertices}+${edges}=${faces}.`));
  return make(tx(profile, prism ? `${name}의 두 밑면은 서로 평행하고 합동인지 판단하세요.` : `${name}의 옆면은 모두 삼각형인지 판단하세요.`, prism ? `Decide whether the two bases of an ${n}-gonal prism are parallel and congruent.` : `Decide whether every lateral face of an ${n}-gonal pyramid is a triangle.`), 1, { kind: 'polyhedron-general', n, solid }, tx(profile, '입체도형의 정의에 따라 옳은 설명입니다.', 'This follows from the definition of the solid.'), { choices: choices(['옳다', '옳지 않다'], ['true', 'false']) });
}

function revolutionProperties(random, profile) {
  const cases = [
    { source: 'cylinder', plane: '회전축에 수직인', answer: 1, ko: '원', en: 'circle' },
    { source: 'cylinder', plane: '회전축을 포함하는', answer: 2, ko: '직사각형', en: 'rectangle' },
    { source: 'cone', plane: '회전축에 수직인', answer: 1, ko: '원', en: 'circle' },
    { source: 'cone', plane: '회전축을 포함하는', answer: 3, ko: '이등변삼각형', en: 'isosceles triangle' },
    { source: 'sphere', plane: '중심을 지나는', answer: 1, ko: '원', en: 'circle' },
  ]; const selected = pick(random, cases); const names = { cylinder: '원기둥', cone: '원뿔', sphere: '구' };
  return make(tx(profile, `${names[selected.source]}을 ${selected.plane} 평면으로 잘랐을 때 생기는 단면의 모양을 고르세요.`, `Choose the cross-section made by the stated plane.`), selected.answer, { kind: 'revolution-section-basic', source: selected.source, plane: selected.plane }, tx(profile, `회전축과 자르는 평면의 위치를 생각하면 단면은 ${selected.ko}입니다.`, `The cross-section is a ${selected.en}.`), { choices: choices(['원', '직사각형', '이등변삼각형', '사다리꼴'], ['circle', 'rectangle', 'isosceles triangle', 'trapezoid']) });
}

function metricNets(random, profile) {
  const mode = ri(random, 0, 2);
  if (mode === 0) { const r = ri(random, 2, 7); const h = ri(random, 4, 12); const coefficient = 2 * r * h; return make(tx(profile, `반지름 ${r}cm, 높이 ${h}cm인 원기둥의 전개도에서 직사각형의 넓이를 구하세요.`, `In the net of a cylinder with radius ${r} cm and height ${h} cm, find the rectangle's area.`), `${coefficient}π`, { kind: 'net-basic', net: 'net-cylinder', r, h, metric: true }, tx(profile, `직사각형의 가로는 밑면의 둘레 2πr=${2 * r}π이고 세로는 ${h}이므로 넓이는 ${coefficient}πcm²입니다.`, `The rectangle is ${2 * r}π by ${h}, so its area is ${coefficient}π.`), { answerSuffix: 'cm²' }); }
  if (mode === 1) { const r = ri(random, 2, 7); const slant = ri(random, r + 2, r + 8); const coefficient = r * slant; return make(tx(profile, `밑면의 반지름이 ${r}cm이고 모선이 ${slant}cm인 원뿔의 옆넓이를 구하세요.`, `Find the lateral area of a cone with radius ${r} cm and slant height ${slant} cm.`), `${coefficient}π`, { kind: 'net-basic', net: 'net-cone', r, slant, metric: true }, tx(profile, `전개한 부채꼴의 호는 밑면의 둘레와 같고 옆넓이는 πrl=${coefficient}πcm²입니다.`, `The sector arc equals the base circumference, and lateral area is πrl=${coefficient}π.`), { answerSuffix: 'cm²' }); }
  const length = ri(random, 4, 10); const answer = 12 * length;
  return make(tx(profile, `밑면이 변의 길이 3cm, 4cm, 5cm인 직각삼각형이고 기둥의 높이가 ${length}cm인 삼각기둥의 옆넓이를 구하세요.`, `A triangular prism has a 3-4-5 base and length ${length} cm. Find its lateral area.`), answer, { kind: 'net-basic', net: 'net-prism', baseSides: [3, 4, 5], h: length, metric: true }, tx(profile, `옆넓이는 밑면의 둘레×높이=(3+4+5)×${length}=${answer}cm²입니다.`, `Lateral area = base perimeter × prism length = ${answer}.`), { answerSuffix: 'cm²' });
}

function expandedSolidMeasures(random, profile) {
  const mode = ri(random, 0, 2);
  if (mode === 0) { const length = ri(random, 4, 12); const volume = 6 * length; const surface = 12 + 12 * length; const askVolume = random() < 0.5; return make(tx(profile, `밑면이 3cm, 4cm, 5cm인 직각삼각형이고 높이가 ${length}cm인 삼각기둥의 ${askVolume ? '부피' : '겉넓이'}를 구하세요.`, `Find the ${askVolume ? 'volume' : 'surface area'} of a triangular prism with a 3-4-5 base and length ${length}.`), askVolume ? volume : surface, { kind: 'measurement-solid', solid: 'triangular-prism', sides: [3, 4, 5], h: length }, tx(profile, askVolume ? `밑넓이는 3×4÷2=6이므로 부피는 6×${length}=${volume}cm³입니다.` : `겉넓이는 2×6+(3+4+5)×${length}=${surface}cm²입니다.`, askVolume ? `Base area is 6, so volume is ${volume}.` : `Surface area is 2×6+12×${length}=${surface}.`), { answerSuffix: askVolume ? 'cm³' : 'cm²' }); }
  if (mode === 1) { const r = ri(random, 2, 7); const slant = ri(random, r + 2, r + 9); const coefficient = r * r + r * slant; return make(tx(profile, `밑면의 반지름이 ${r}cm이고 모선이 ${slant}cm인 원뿔의 겉넓이를 구하세요.`, `Find the total surface area of a cone with radius ${r} and slant height ${slant}.`), `${coefficient}π`, { kind: 'measurement-solid', solid: 'cone', r, slant }, tx(profile, `밑넓이와 옆넓이의 합은 πr²+πrl=${coefficient}πcm²입니다.`, `Total area = πr²+πrl=${coefficient}π.`), { answerSuffix: 'cm²' }); }
  const outer = ri(random, 5, 9); const inner = ri(random, 2, outer - 2); const h = pick(random, [3, 6, 9]); const coefficient = h * (outer * outer + outer * inner + inner * inner) / 3;
  return make(tx(profile, `두 밑면의 반지름이 ${outer}cm, ${inner}cm이고 높이가 ${h}cm인 원뿔대의 부피를 구하세요.`, `Find the volume of a conical frustum with radii ${outer}, ${inner} and height ${h}.`), `${coefficient}π`, { kind: 'measurement-solid', solid: 'frustum', outer, inner, h }, tx(profile, `V=1/3πh(R²+Rr+r²)=${coefficient}πcm³입니다.`, `V=⅓πh(R²+Rr+r²)=${coefficient}π.`), { answerSuffix: 'cm³' });
}

function hemisphereAndSphere(random, profile) {
  const r = ri(random, 2, 9); const mode = ri(random, 0, 2);
  if (mode === 0) return make(tx(profile, `반지름이 ${r}cm인 반구의 밑면을 포함한 겉넓이를 구하세요.`, `Find the total surface area of a hemisphere of radius ${r} cm, including its base.`), `${3 * r * r}π`, { kind: 'measurement-solid', solid: 'hemisphere', r }, tx(profile, `곡면 2πr²과 밑면 πr²의 합은 3πr²=${3 * r * r}πcm²입니다.`, `Curved area 2πr² plus base πr² gives ${3 * r * r}π.`), { answerSuffix: 'cm²' });
  if (mode === 1) return make(tx(profile, `반지름이 ${r}cm인 반구의 부피를 구하세요.`, `Find the volume of a hemisphere of radius ${r} cm.`), `${2 * r * r * r}π/3`, { kind: 'measurement-solid', solid: 'hemisphere', r }, tx(profile, `구 부피의 절반이므로 V=2/3πr³=${2 * r * r * r}π/3cm³입니다.`, `A hemisphere has half the volume of a sphere: 2πr³/3.`), { answerSuffix: 'cm³' });
  const scale = pick(random, [2, 3, 4]);
  return make(tx(profile, `두 구의 반지름의 비가 1:${scale}일 때 작은 구와 큰 구의 부피의 비를 구하세요.`, `Two spheres have radii in the ratio 1:${scale}. Find their volume ratio.`), `1:${scale ** 3}`, { kind: 'solid-ratio', solid: 'sphere', scale }, tx(profile, `구의 부피는 반지름의 세제곱에 비례하므로 1³:${scale}³=1:${scale ** 3}입니다.`, `Sphere volumes scale with the cube of the radius, giving 1:${scale ** 3}.`));
}

const unit = (id, ko, en, koDescription, enDescription, makeUnit) => ({ id, labels: { ko, en }, descriptions: { ko: koDescription, en: enDescription }, profiles: MIDDLE_PROFILES, make: makeUnit });

export const MIDDLE_GEOMETRY_BASIC_UNITS = [
  unit('polygon-foundations-basic', '다각형의 뜻과 정다각형', 'Polygon foundations', '다각형의 구성 요소와 정다각형의 정의·판별', 'Definitions and classification of polygons and regular polygons', polygonFoundations),
  unit('polygon-diagonals-basic', '다각형과 대각선', 'Polygons and diagonals', '다각형의 뜻과 한 꼭짓점·전체 대각선 개수', 'Classify polygons and count diagonals', polygonDiagonals),
  unit('polygon-angles-basic', '다각형의 내각과 외각', 'Interior and exterior angles', '내각의 합·외각의 합·정다각형의 한 각', 'Interior sums, exterior sums and regular polygons', polygonAngles),
  unit('triangle-interior-exterior-basic', '삼각형의 내각과 외각', 'Triangle interior and exterior angles', '삼각형의 내각의 합과 외각 정리', 'Use triangle interior sums and the exterior-angle theorem', triangleInteriorExterior),
  unit('circle-parts-basic', '원·호·현·부채꼴의 뜻', 'Circle parts', '반지름·지름·현·호의 정의 확인', 'Identify radii, diameters, chords and arcs', circleParts),
  unit('circle-sector-proportion', '중심각과 호·부채꼴의 비례', 'Central-angle proportions', '같은 원에서 중심각과 호의 길이·넓이의 비례', 'Use proportional arc lengths and sector areas', circleProportion),
  unit('circle-sector-inverse-basic', '부채꼴의 호·넓이·둘레 역문제', 'Inverse sector measures', '호의 길이·넓이·둘레에서 중심각과 다른 양 구하기', 'Find missing sector measures in reverse and perimeter problems', sectorInverseMeasures),
  unit('annulus-composite-circle', '원환과 합성 원도형', 'Annuli and composite circles', '큰 원과 작은 원의 넓이 차 계산', 'Find areas of annuli and composite circles', annulusComposite),
  unit('annular-sector-measures', '고리 모양 부채꼴', 'Annular sectors', '두 동심원의 호로 이루어진 도형의 넓이와 둘레', 'Area and perimeter of sectors between concentric circles', annularSectorMeasures),
  unit('polyhedron-counts-general', '각기둥·각뿔의 구성 요소', 'Prism and pyramid elements', 'n각기둥과 n각뿔의 면·꼭짓점·모서리', 'Count faces, vertices and edges of prisms and pyramids', polyhedronCounts),
  unit('polyhedron-concepts-euler', '다면체의 성질과 오일러 관계', 'Polyhedron properties and Euler relation', '각기둥·각뿔의 정의와 V−E+F 관계', 'Definitions of prisms and pyramids and Euler relation', polyhedronConcepts),
  unit('regular-polyhedra-basic', '정다면체의 성질', 'Regular polyhedra', '다섯 정다면체의 면과 꼭짓점 구조', 'Explore the five regular polyhedra', regularPolyhedra),
  unit('solids-revolution-nets', '회전체와 전개도', 'Solids of revolution and nets', '평면도형을 회전해 생기는 입체와 단면', 'Identify solids formed by rotation', revolutionAndNets),
  unit('solids-revolution-sections', '회전체의 성질과 단면', 'Cross-sections of solids of revolution', '회전축과 자르는 평면에 따른 단면 판별', 'Identify cross-sections from the cutting plane', revolutionProperties),
  unit('metric-solid-nets', '입체도형 전개도의 길이와 넓이', 'Metric solid nets', '원기둥·원뿔·삼각기둥 전개도 계산', 'Calculate lengths and areas from cylinder, cone and prism nets', metricNets),
  unit('prism-cylinder-measures', '기둥의 겉넓이와 부피', 'Prism and cylinder measures', '직육면체·원기둥의 겉넓이와 부피', 'Surface area and volume of prisms and cylinders', prismCylinderMeasures),
  unit('pyramid-cone-measures', '뿔의 부피', 'Pyramid and cone volume', '각뿔·원뿔 부피의 1/3 관계', 'Volumes of pyramids and cones', pyramidConeMeasures),
  unit('expanded-solid-measures', '삼각기둥·원뿔·원뿔대의 측정', 'Extended solid measures', '삼각기둥 겉넓이·부피, 원뿔 겉넓이, 원뿔대 부피', 'Triangular prisms, cone surface area and frustum volume', expandedSolidMeasures),
  unit('sphere-measures-basic', '구의 겉넓이와 부피', 'Sphere surface area and volume', '반지름으로 구의 겉넓이와 부피 계산', 'Calculate sphere surface area and volume', sphereMeasures),
  unit('hemisphere-sphere-ratios', '반구와 구의 비', 'Hemispheres and sphere ratios', '반구의 겉넓이·부피와 구의 닮음비', 'Hemisphere measures and sphere volume ratios', hemisphereAndSphere),
  unit('solid-volume-ratios', '기둥과 뿔의 부피비', 'Prism-to-pyramid volume ratios', '밑넓이와 높이가 같은 기둥·뿔의 부피 비교', 'Compare matching prism/pyramid and cylinder/cone volumes', solidRatios),
];
