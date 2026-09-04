// 중3-2 "원의 성질" (원과 직선: 현의 수직이등분선·접선의 성질 / 원주각: 원주각의 성질·내접사각형·접현각).
// 참고: 중학수학 3-2 RPM 43~81쪽 (03 원과 직선, 04 원주각) — 문제 구조와 핵심 수학적 원리를 바탕으로 알고리즘화.
import { profileText } from './geometryProfiles.js';

const ri = (random, min, max) => Math.floor(random() * (max - min + 1)) + min;
const pick = (random, values) => values[ri(random, 0, values.length - 1)];
const tx = (profile, ko, en) => profileText(profile, { ko, en, 'zh-TW': en, 'zh-HK': en });
const make = (prompt, answer, diagram, explanation, extra = {}) => ({
  prompt,
  expression: '',
  answer: String(answer),
  answerSuffix: extra.answerSuffix || '',
  diagram,
  explanation,
  ...extra,
});
const choices = (ko, en = ko) => ko.map((label, index) => ({
  value: String(index + 1),
  label,
  labelEn: en[index] || label,
}));

// 피타고라스 정수쌍 [d, b, r] (d^2 + b^2 = r^2)
const PYTHAGOREAN_TRIPLES = [
  [3, 4, 5],
  [6, 8, 10],
  [5, 12, 13],
  [9, 12, 15],
  [8, 15, 17],
  [12, 16, 20],
  [7, 24, 25],
];

// ---------------------------------------------------------------------------
// 01. 현의 수직이등분선과 현의 길이
// ---------------------------------------------------------------------------

// 01-1: 원의 중심에서 현에 내린 수선은 현을 이등분한다 (피타고라스 정리)
function chordBisectorLength(random, profile) {
  const triple = pick(random, PYTHAGOREAN_TRIPLES);
  const [d, b, r] = random() < 0.5 ? [triple[0], triple[1], triple[2]] : [triple[1], triple[0], triple[2]];
  const chord = 2 * b;
  const variant = ri(random, 0, 2);

  if (variant === 0) {
    return make(
      tx(
        profile,
        `반지름의 길이가 ${r}cm인 원 O에서 현 AB에 내린 수선의 발을 M이라 하자. OM=${d}cm일 때, 현 AB(=x)의 길이를 구하세요.`,
        `In circle O with radius ${r} cm, let M be the foot of the perpendicular from center O to chord AB. If OM = ${d} cm, find the length of chord AB (=x).`
      ),
      chord,
      { kind: 'circle-chord', r, d, chord, target: 'chord', showTriangle: true },
      tx(
        profile,
        `직각삼각형 OAM에서 피타고라스 정리에 의해 AM = √(OA² - OM²) = √(${r}² - ${d}²) = ${b}cm입니다. 중심에서 현에 내린 수선은 현을 수직이등분하므로 AB = 2 × AM = 2 × ${b} = ${chord}cm입니다.`,
        `In right triangle OAM, by the Pythagorean theorem, AM = √(OA² - OM²) = √(${r}² - ${d}²) = ${b} cm. Since the perpendicular from the center bisects the chord, AB = 2 × ${b} = ${chord} cm.`
      ),
      { answerSuffix: 'cm' }
    );
  }

  if (variant === 1) {
    return make(
      tx(
        profile,
        `원 O에서 현 AB에 내린 수선의 발을 M이라 하자. OM=${d}cm, AB=${chord}cm일 때, 원 O의 반지름의 길이(=x)를 구하세요.`,
        `In circle O, let M be the foot of the perpendicular from center O to chord AB. If OM = ${d} cm and AB = ${chord} cm, find the radius OA (=x) of circle O.`
      ),
      r,
      { kind: 'circle-chord', r, d, chord, target: 'radius', showTriangle: true },
      tx(
        profile,
        `중심에서 현에 내린 수선은 현을 이등분하므로 AM = AB / 2 = ${b}cm입니다. 직각삼각형 OAM에서 피타고라스 정리에 의해 OA = √(OM² + AM²) = √(${d}² + ${b}²) = ${r}cm입니다.`,
        `The perpendicular from the center bisects the chord, so AM = AB / 2 = ${b} cm. In right triangle OAM, OA = √(OM² + AM²) = √(${d}² + ${b}²) = ${r} cm.`
      ),
      { answerSuffix: 'cm' }
    );
  }

  return make(
    tx(
      profile,
      `반지름의 길이가 ${r}cm인 원 O에서 길이가 ${chord}cm인 현 AB에 내린 수선의 발을 M이라 하자. 선분 OM(=x)의 길이를 구하세요.`,
      `In circle O with radius ${r} cm, let M be the foot of the perpendicular from center O to chord AB of length ${chord} cm. Find the length of OM (=x).`
    ),
    d,
    { kind: 'circle-chord', r, d, chord, target: 'distance', showTriangle: true },
    tx(
      profile,
      `AM = AB / 2 = ${b}cm이고, 직각삼각형 OAM에서 OM = √(OA² - AM²) = √(${r}² - ${b}²) = ${d}cm입니다.`,
      `AM = AB / 2 = ${b} cm. In right triangle OAM, OM = √(OA² - AM²) = √(${r}² - ${b}²) = ${d} cm.`
    ),
    { answerSuffix: 'cm' }
  );
}

// 01-2: 활꼴 / 깨진 원의 반지름 (r^2 = (r-h)^2 + b^2)
function sagittaBrokenPlate(random, profile) {
  const presets = [
    { b: 4, h: 2, r: 5 },
    { b: 6, h: 2, r: 10 },
    { b: 8, h: 4, r: 10 },
    { b: 12, h: 6, r: 15 },
    { b: 8, h: 2, r: 17 },
    { b: 12, h: 4, r: 20 },
    { b: 15, h: 5, r: 25 },
  ];
  const item = pick(random, presets);
  const chord = 2 * item.b;

  return make(
    tx(
      profile,
      `오른쪽 그림과 같이 원 모양의 깨진 접시의 일부가 있다. 현 AB의 수직이등분선과 호의 교점을 C라 할 때, AB=${chord}cm이고 CD=${item.h}cm이다. 원래 접시의 반지름의 길이(=x)를 구하세요.`,
      `As shown in the figure, a part of a circular broken plate is given. The perpendicular bisector of chord AB intersects the arc at C. If AB = ${chord} cm and CD = ${item.h} cm, find the radius (=x) of the original plate.`
    ),
    item.r,
    { kind: 'circle-sagitta', b: item.b, h: item.h, chord, r: item.r },
    tx(
      profile,
      `원래 접시의 반지름을 r이라 하면, 직각삼각형 OAD에서 AD = AB / 2 = ${item.b}cm이고 OD = r - ${item.h}cm입니다. 피타고라스 정리에 의해 r² = (r - ${item.h})² + ${item.b}² = r² - ${2 * item.h}r + ${item.h * item.h + item.b * item.b}이므로 ${2 * item.h}r = ${item.h * item.h + item.b * item.b}, 따라서 r = ${item.r}cm입니다.`,
      `Let r be the radius. In right triangle OAD, AD = AB / 2 = ${item.b} cm and OD = r - ${item.h} cm. By the Pythagorean theorem, r² = (r - ${item.h})² + ${item.b}², which gives ${2 * item.h}r = ${item.h * item.h + item.b * item.b}, so r = ${item.r} cm.`
    ),
    { answerSuffix: 'cm' }
  );
}

// 01-3: 원을 접었을 때의 현의 길이 (원의 중심에 닿도록 접음: OM = r/2)
function foldedCircleChord(random, profile) {
  const rHalf = ri(random, 2, 8);
  const r = rHalf * 2;
  const targetType = random() < 0.5 ? 'chord' : 'radius';

  if (targetType === 'chord') {
    return make(
      tx(
        profile,
        `반지름의 길이가 ${r}cm인 원 O에서 원주 위의 한 점이 원의 중심 O에 겹치도록 선분 AB를 접는 선으로 하여 접었다. 접힌 현 AB의 길이를 구하세요. (a√3 형태일 때 a의 값을 입력하세요)`,
        `In a circle O of radius ${r} cm, the circular edge is folded along chord AB so that an arc touches the center O. If AB = a√3 cm, find the value of a.`
      ),
      r,
      { kind: 'circle-folded', r, rHalf },
      tx(
        profile,
        `접은 호가 중심 O에 닿으므로 중심에서 현 AB까지의 거리는 OM = r / 2 = ${rHalf}cm입니다. 직각삼각형 OAM에서 AM = √(r² - (r/2)²) = √(${r}² - ${rHalf}²) = ${rHalf}√3cm입니다. 따라서 현 AB = 2 × AM = ${r}√3cm이므로 a = ${r}입니다.`,
        `Since the fold touches the center O, the perpendicular distance OM = r / 2 = ${rHalf} cm. In right triangle OAM, AM = √(r² - (r/2)²) = ${rHalf}√3 cm, so AB = ${r}√3 cm, giving a = ${r}.`
      ),
      { answerSuffix: '' }
    );
  }

  return make(
    tx(
      profile,
      `원 O의 원주 위의 한 점이 원의 중심 O에 겹치도록 선분 AB를 접는 선으로 하여 접었더니, 접힌 현 AB의 길이가 ${r}√3cm이었다. 원 O의 반지름의 길이를 구하세요.`,
      `A circular piece of paper is folded along chord AB so that a point on the circle touches center O. If the folded chord AB = ${r}√3 cm, find the radius of circle O.`
    ),
    r,
    { kind: 'circle-folded', r, rHalf },
    tx(
      profile,
      `현 AB = 2 × (√3/2)r = √3r이므로 √3r = ${r}√3에서 반지름 r = ${r}cm입니다.`,
      `Since the folded chord length is √3r, √3r = ${r}√3 yields r = ${r} cm.`
    ),
    { answerSuffix: 'cm' }
  );
}

// 01-4: 중심에서 같은 거리에 있는 두 현의 길이와 이등변삼각형
function equidistantChords(random, profile) {
  const variant = ri(random, 0, 1);
  if (variant === 0) {
    const chord = ri(random, 6, 18) * 2;
    const dist = ri(random, 4, 12);
    return make(
      tx(
        profile,
        `원 O에서 두 현 AB, CD에 내린 수선의 발을 각각 M, N이라 하자. OM = ON = ${dist}cm이고 AB = ${chord}cm일 때, 현 CD(=x)의 길이를 구하세요.`,
        `In circle O, M and N are feet of perpendiculars from center O to chords AB and CD respectively. If OM = ON = ${dist} cm and AB = ${chord} cm, find the length of chord CD (=x).`
      ),
      chord,
      { kind: 'circle-two-chords', chord, dist },
      tx(
        profile,
        `한 원에서 원의 중심으로부터 같은 거리에 있는 두 현의 길이는 서로 같으므로 CD = AB = ${chord}cm입니다.`,
        `Chords equidistant from the center of a circle are equal in length, so CD = AB = ${chord} cm.`
      ),
      { answerSuffix: 'cm' }
    );
  }

  const apexAngle = ri(random, 20, 50) * 2;
  const baseAngle = (180 - apexAngle) / 2;
  return make(
    tx(
      profile,
      `원 O에 내접하는 △ABC에서 원의 중심 O로부터 두 변 AB, AC에 내린 수선의 길이가 서로 같다. ∠A = ${apexAngle}°일 때, ∠B(=x)의 크기를 구하세요.`,
      `In triangle ABC inscribed in circle O, the perpendicular distances from center O to sides AB and AC are equal. If ∠A = ${apexAngle}°, find ∠B (=x).`
    ),
    baseAngle,
    { kind: 'circle-chords-triangle', apexAngle, baseAngle },
    tx(
      profile,
      `원의 중심에서 두 현 AB, AC에 이르는 거리가 같으므로 AB = AC인 이등변삼각형입니다. 따라서 ∠B = ∠C = (180° - ${apexAngle}°) / 2 = ${baseAngle}°입니다.`,
      `Since the chords AB and AC are equidistant from the center, AB = AC, so △ABC is isosceles. Thus ∠B = (180° - ${apexAngle}°) / 2 = ${baseAngle}°.`
    ),
    { answerSuffix: '°' }
  );
}

// ---------------------------------------------------------------------------
// 02. 원의 접선의 성질과 응용
// ---------------------------------------------------------------------------

// 02-1: 원 밖의 한 점에서 그은 접선의 길이 (피타고라스 정리)
function tangentPythagoras(random, profile) {
  const triple = pick(random, PYTHAGOREAN_TRIPLES);
  const [r, pt, op] = [triple[0], triple[1], triple[2]];
  const variant = ri(random, 0, 1);

  if (variant === 0) {
    return make(
      tx(
        profile,
        `반지름의 길이가 ${r}cm인 원 O 밖의 한 점 P에서 원 O에 그은 접선의 접점을 T라 하자. OP = ${op}cm일 때, 접선 PT(=x)의 길이를 구하세요.`,
        `From an external point P, a tangent line touches circle O (radius ${r} cm) at T. If OP = ${op} cm, find the length of tangent PT (=x).`
      ),
      pt,
      { kind: 'circle-tangent-single', r, pt, op, target: 'tangent' },
      tx(
        profile,
        `원의 접선은 접점을 지나는 반지름에 수직이므로 ∠OTP = 90°입니다. 직각삼각형 OTP에서 피타고라스 정리에 의해 PT = √(OP² - OT²) = √(${op}² - ${r}²) = ${pt}cm입니다.`,
        `The tangent is perpendicular to the radius at the point of tangency (∠OTP = 90°). In right triangle OTP, PT = √(OP² - OT²) = √(${op}² - ${r}²) = ${pt} cm.`
      ),
      { answerSuffix: 'cm' }
    );
  }

  return make(
    tx(
      profile,
      `원 O 밖의 한 점 P에서 원 O에 그은 접선의 접점을 T라 하자. OT = ${r}cm, PT = ${pt}cm일 때, 선분 OP(=x)의 길이를 구하세요.`,
      `From an external point P, a tangent touches circle O at T. If radius OT = ${r} cm and tangent PT = ${pt} cm, find OP (=x).`
    ),
    op,
    { kind: 'circle-tangent-single', r, pt, op, target: 'hypotenuse' },
    tx(
      profile,
      `∠OTP = 90°이므로 직각삼각형 OTP에서 OP = √(OT² + PT²) = √(${r}² + ${pt}²) = ${op}cm입니다.`,
      `Since ∠OTP = 90°, in right triangle OTP, OP = √(OT² + PT²) = √(${r}² + ${pt}²) = ${op} cm.`
    ),
    { answerSuffix: 'cm' }
  );
}

// 02-2: 두 접선과 중심이 이루는 사각형의 각도 (∠P + ∠AOB = 180°)
function twoTangentsAngle(random, profile) {
  const angleP = ri(random, 30, 80);
  const angleAOB = 180 - angleP;

  const variant = ri(random, 0, 1);
  if (variant === 0) {
    return make(
      tx(
        profile,
        `원 O 밖의 점 P에서 원 O에 그은 두 접선의 접점을 각각 A, B라 하자. ∠APB = ${angleP}°일 때, 중심각 ∠AOB(=x)의 크기를 구하세요.`,
        `From an external point P, two tangents touch circle O at A and B. If ∠APB = ${angleP}°, find the central angle ∠AOB (=x).`
      ),
      angleAOB,
      { kind: 'circle-tangent-pair', angleP, angleAOB },
      tx(
        profile,
        `접선과 반지름은 수직이므로 ∠PAO = ∠PBO = 90°입니다. 사각형 APBO의 내각의 합은 360°이므로 ∠APB + ∠AOB = 180°입니다. 따라서 ∠AOB = 180° - ${angleP}° = ${angleAOB}°입니다.`,
        `Since ∠PAO = ∠PBO = 90°, the opposite angles sum to 180° (∠APB + ∠AOB = 180°). Thus ∠AOB = 180° - ${angleP}° = ${angleAOB}°.`
      ),
      { answerSuffix: '°' }
    );
  }

  return make(
    tx(
      profile,
      `원 O 밖의 점 P에서 원 O에 그은 두 접선의 접점을 각각 A, B라 하자. 중심각 ∠AOB = ${angleAOB}°일 때, ∠APB(=x)의 크기를 구하세요.`,
      `From an external point P, tangents touch circle O at A and B. If central angle ∠AOB = ${angleAOB}°, find ∠APB (=x).`
    ),
    angleP,
    { kind: 'circle-tangent-pair', angleP, angleAOB },
    tx(
      profile,
      `사각형 APBO에서 마주보는 두 각의 합이 180°이므로 ∠APB = 180° - ∠AOB = 180° - ${angleAOB}° = ${angleP}°입니다.`,
      `In quadrilateral APBO, ∠APB + ∠AOB = 180°, so ∠APB = 180° - ${angleAOB}° = ${angleP}°.`
    ),
    { answerSuffix: '°' }
  );
}

// 02-3: 접선의 응용 — 삼각형 둘레 (Perimeter of △PCD = 2 × PA)
function tangentTrianglePerimeter(random, profile) {
  const pa = ri(random, 6, 18);
  const perimeter = 2 * pa;

  return make(
    tx(
      profile,
      `오른쪽 그림에서 PA, PB는 원 O의 접선이고 두 점 A, B는 접점이다. 선분 CD는 원 O의 또 다른 접선이고 점 E는 접점이다. PA = ${pa}cm일 때, △PCD의 둘레의 길이(=x)를 구하세요.`,
      `In the figure, PA and PB are tangents to circle O at points A and B. Segment CD is tangent to circle O at E. If PA = ${pa} cm, find the perimeter of △PCD (=x).`
    ),
    perimeter,
    { kind: 'circle-tangent-triangle', pa, perimeter },
    tx(
      profile,
      `원 밖의 점에서 그은 두 접선의 길이는 같으므로 CA = CE, DB = DE이고 PA = PB = ${pa}cm입니다. △PCD의 둘레 = PC + CD + PD = PC + (CE + ED) + PD = (PC + CA) + (PD + DB) = PA + PB = 2 × ${pa} = ${perimeter}cm입니다.`,
      `By tangent properties, CA = CE, DB = DE and PA = PB = ${pa} cm. Perimeter of △PCD = PC + CD + PD = (PC + CA) + (PD + DB) = PA + PB = 2 × ${pa} = ${perimeter} cm.`
    ),
    { answerSuffix: 'cm' }
  );
}

// 02-4: 동심원에서의 접선 — 고리 모양 영역의 넓이
function concentricCircleRing(random, profile) {
  const halfChord = ri(random, 3, 12);
  const fullChord = 2 * halfChord;
  const areaCoefficient = halfChord * halfChord;

  return make(
    tx(
      profile,
      `중심이 같은 두 원에서 큰 원의 현 AB가 작은 원에 접한다. AB = ${fullChord}cm일 때, 두 원 사이의 색칠한 고리 부분의 넓이를 구하세요. (kπ cm²일 때 k의 값을 입력하세요)`,
      `In two concentric circles, chord AB of the larger circle is tangent to the smaller circle. If AB = ${fullChord} cm, find the area of the ring between the circles. (Enter k if area is kπ cm²)`
    ),
    areaCoefficient,
    { kind: 'circle-concentric-ring', chord: fullChord, halfChord, areaCoefficient },
    tx(
      profile,
      `큰 원의 반지름을 R, 작은 원의 반지름을 r이라 하자. 현 AB가 작은 원에 접하므로 접점에서 현은 수직이등분됩니다. 따라서 직각삼각형에서 R² - r² = (${fullChord} / 2)² = ${halfChord}² = ${areaCoefficient}입니다. 고리의 넓이 = πR² - πr² = π(R² - r²) = ${areaCoefficient}π cm²이므로 k = ${areaCoefficient}입니다.`,
      `Let R and r be the radii of the larger and smaller circles. By the Pythagorean theorem, R² - r² = (AB / 2)² = ${halfChord}² = ${areaCoefficient}. The area of the ring is π(R² - r²) = ${areaCoefficient}π cm², so k = ${areaCoefficient}.`
    ),
    { answerSuffix: '' }
  );
}

// ---------------------------------------------------------------------------
// 03. 삼각형의 내접원과 외접사각형
// ---------------------------------------------------------------------------

// 03-1: 삼각형의 내접원과 접선 분할 (AD = s - a)
function incircleSegments(random, profile) {
  const x = ri(random, 3, 9);
  const y = ri(random, 3, 9);
  const z = ri(random, 3, 9);
  const c = x + y; // AB
  const a = y + z; // BC
  const b = z + x; // CA

  const variant = ri(random, 0, 1);
  if (variant === 0) {
    return make(
      tx(
        profile,
        `원 O가 △ABC의 내접원이고 세 점 D, E, F가 접점이다. AB = ${c}cm, BC = ${a}cm, CA = ${b}cm일 때, 선분 AD(=x)의 길이를 구하세요.`,
        `Circle O is inscribed in △ABC with tangency points D, E, F. If AB = ${c} cm, BC = ${a} cm, and CA = ${b} cm, find AD (=x).`
      ),
      x,
      { kind: 'circle-incircle-tri', a, b, c, x, y, z, target: 'AD' },
      tx(
        profile,
        `AD = AF = x, BD = BE = y, CE = CF = z라 두면, 삼각형의 반둘레 s = (${a} + ${b} + ${c}) / 2 = ${x + y + z}cm입니다. 따라서 AD = s - BC = ${x + y + z} - ${a} = ${x}cm입니다.`,
        `Let AD = AF = x. The semiperimeter is s = (${a} + ${b} + ${c}) / 2 = ${x + y + z} cm. Then AD = s - BC = ${x + y + z} - ${a} = ${x} cm.`
      ),
      { answerSuffix: 'cm' }
    );
  }

  return make(
    tx(
      profile,
      `원 O가 △ABC의 내접원이고 세 점 D, E, F가 접점이다. AB = ${c}cm, BC = ${a}cm, CA = ${b}cm일 때, 선분 BE(=x)의 길이를 구하세요.`,
      `Circle O is inscribed in △ABC with tangency points D, E, F. If AB = ${c} cm, BC = ${a} cm, and CA = ${b} cm, find BE (=x).`
    ),
    y,
    { kind: 'circle-incircle-tri', a, b, c, x, y, z, target: 'BE' },
    tx(
      profile,
      `반둘레 s = (${a} + ${b} + ${c}) / 2 = ${x + y + z}cm입니다. BE = s - CA = ${x + y + z} - ${b} = ${y}cm입니다.`,
      `The semiperimeter s = (${a} + ${b} + ${c}) / 2 = ${x + y + z} cm. BE = s - CA = ${x + y + z} - ${b} = ${y} cm.`
    ),
    { answerSuffix: 'cm' }
  );
}

// 03-2: 직각삼각형의 내접원의 반지름 (r = (a + b - c) / 2)
function rightTriangleInradius(random, profile) {
  const triple = pick(random, PYTHAGOREAN_TRIPLES);
  const [a, b, c] = [triple[0], triple[1], triple[2]];
  const r = (a + b - c) / 2;

  return make(
    tx(
      profile,
      `∠C = 90°인 직각삼각형 ABC에서 세 변의 길이가 BC = ${a}cm, CA = ${b}cm, AB = ${c}cm이다. 삼각형 ABC의 내접원의 반지름 r(=x)의 길이를 구하세요.`,
      `In right triangle ABC with ∠C = 90°, the sides are BC = ${a} cm, CA = ${b} cm, and hypotenuse AB = ${c} cm. Find the radius r (=x) of the inscribed circle.`
    ),
    r,
    { kind: 'circle-right-incircle', a, b, c, r },
    tx(
      profile,
      `직각삼각형의 내접원의 반지름 r은 r = (a + b - c) / 2 공식으로 구할 수 있습니다. r = (${a} + ${b} - ${c}) / 2 = ${2 * r} / 2 = ${r}cm입니다. (또는 넓이 관계 1/2 × ${a} × ${b} = 1/2 × r × (${a} + ${b} + ${c})에서 ${a * b / 2} = ${r * (a + b + c) / 2}, r = ${r}cm)`,
      `The inradius of a right triangle is r = (a + b - c) / 2 = (${a} + ${b} - ${c}) / 2 = ${r} cm.`
    ),
    { answerSuffix: 'cm' }
  );
}

// 03-3: 원에 외접하는 사각형의 성질 (대변의 합 AB + CD = AD + BC)
function circumscribedQuadrilateral(random, profile) {
  const ab = ri(random, 5, 15);
  const cd = ri(random, 5, 15);
  const sum = ab + cd;
  const ad = ri(random, 4, sum - 3);
  const bc = sum - ad;

  const variant = ri(random, 0, 1);
  if (variant === 0) {
    return make(
      tx(
        profile,
        `사각형 ABCD가 원 O에 외접한다. AB = ${ab}cm, CD = ${cd}cm, AD = ${ad}cm일 때, 변 BC(=x)의 길이를 구하세요.`,
        `Quadrilateral ABCD is circumscribed around circle O. If AB = ${ab} cm, CD = ${cd} cm, and AD = ${ad} cm, find BC (=x).`
      ),
      bc,
      { kind: 'circle-circumscribed-quad', ab, cd, ad, bc, target: 'BC' },
      tx(
        profile,
        `원에 외접하는 사각형은 마주 보는 두 쌍의 대변의 길이의 합이 서로 같습니다. AB + CD = AD + BC 이므로 ${ab} + ${cd} = ${ad} + x, ${sum} = ${ad} + x, x = ${bc}cm입니다.`,
        `For a circumscribed quadrilateral, the sums of opposite sides are equal: AB + CD = AD + BC. Thus ${ab} + ${cd} = ${ad} + x, so x = ${bc} cm.`
      ),
      { answerSuffix: 'cm' }
    );
  }

  const perimeter = 2 * sum;
  return make(
    tx(
      profile,
      `사각형 ABCD가 원 O에 외접한다. AB = ${ab}cm, CD = ${cd}cm일 때, 사각형 ABCD의 둘레의 길이(=x)를 구하세요.`,
      `Quadrilateral ABCD is circumscribed around circle O. If AB = ${ab} cm and CD = ${cd} cm, find the perimeter of quadrilateral ABCD (=x).`
    ),
    perimeter,
    { kind: 'circle-circumscribed-quad', ab, cd, ad, bc, target: 'perimeter' },
    tx(
      profile,
      `원에 외접하는 사각형에서 AB + CD = AD + BC = ${sum}cm입니다. 따라서 둘레 = (AB + CD) + (AD + BC) = 2 × ${sum} = ${perimeter}cm입니다.`,
      `In a circumscribed quadrilateral, AB + CD = AD + BC = ${sum} cm. The perimeter is 2 × (AB + CD) = ${perimeter} cm.`
    ),
    { answerSuffix: 'cm' }
  );
}

// ---------------------------------------------------------------------------
// 04. 원주각의 성질과 크기
// ---------------------------------------------------------------------------

// 04-1: 원주각과 중심각 (중심각 = 2 × 원주각)
function inscribedAndCentralAngle(random, profile) {
  const inscribed = ri(random, 25, 75);
  const central = 2 * inscribed;
  const variant = ri(random, 0, 1);

  if (variant === 0) {
    return make(
      tx(
        profile,
        `원 O에서 호 AB에 대한 원주각 ∠APB = ${inscribed}°일 때, 중심각 ∠AOB(=x)의 크기를 구하세요.`,
        `In circle O, the inscribed angle subtended by arc AB is ∠APB = ${inscribed}°. Find the central angle ∠AOB (=x).`
      ),
      central,
      { kind: 'circle-inscribed-central', inscribed, central, target: 'central' },
      tx(
        profile,
        `한 호에 대한 중심각의 크기는 그 호에 대한 원주각의 크기의 2배이므로 ∠AOB = 2 × ∠APB = 2 × ${inscribed}° = ${central}°입니다.`,
        `The central angle is twice the inscribed angle subtending the same arc: ∠AOB = 2 × ∠APB = 2 × ${inscribed}° = ${central}°.`
      ),
      { answerSuffix: '°' }
    );
  }

  return make(
    tx(
      profile,
      `원 O에서 호 AB에 대한 중심각 ∠AOB = ${central}°일 때, 원주각 ∠APB(=x)의 크기를 구하세요.`,
      `In circle O, the central angle subtended by arc AB is ∠AOB = ${central}°. Find the inscribed angle ∠APB (=x).`
    ),
    inscribed,
    { kind: 'circle-inscribed-central', inscribed, central, target: 'inscribed' },
    tx(
      profile,
      `한 호에 대한 원주각의 크기는 그 호에 대한 중심각의 크기의 1/2이므로 ∠APB = 1/2 × ∠AOB = ${central}° / 2 = ${inscribed}°입니다.`,
      `The inscribed angle is half the central angle subtending the same arc: ∠APB = 1/2 × ∠AOB = ${inscribed}°.`
    ),
    { answerSuffix: '°' }
  );
}

// 04-2: 한 호에 대한 원주각의 성질과 삼각형의 외각
function sameArcInscribedAngles(random, profile) {
  const angle1 = ri(random, 20, 50);
  const angle2 = ri(random, 20, 50);
  const exterior = angle1 + angle2;

  return make(
    tx(
      profile,
      `원 O 위의 네 점 A, B, C, D에 대하여 두 현 AC, BD의 교점을 P라 하자. ∠BAC = ${angle1}°, ∠ACD = ${angle2}°일 때, 교각 ∠APB(=x)의 크기를 구하세요.`,
      `Points A, B, C, D lie on circle O, and chords AC and BD intersect at P. If ∠BAC = ${angle1}° and ∠ACD = ${angle2}°, find ∠APB (=x).`
    ),
    exterior,
    { kind: 'circle-same-arc', angle1, angle2, exterior },
    tx(
      profile,
      `호 AD에 대한 원주각의 크기는 같으므로 ∠ABD = ∠ACD = ${angle2}°입니다. △ABP에서 한 외각의 크기는 이웃하지 않는 두 내각의 크기의 합과 같으므로 ∠APB = ∠BAC + ∠ABD = ${angle1}° + ${angle2}° = ${exterior}°입니다.`,
      `Inscribed angles subtending arc AD are equal, so ∠ABD = ∠ACD = ${angle2}°. In △ABP, the exterior angle ∠APB = ∠BAC + ∠ABD = ${angle1}° + ${angle2}° = ${exterior}°.`
    ),
    { answerSuffix: '°' }
  );
}

// 04-3: 반원에 대한 원주각 (지름에 대한 원주각 = 90°)
function diameterInscribedAngle(random, profile) {
  const angleA = ri(random, 20, 70);
  const angleB = 90 - angleA;

  return make(
    tx(
      profile,
      `선분 AB가 원 O의 지름이고 점 C는 원 위의 점이다. ∠BAC = ${angleA}°일 때, ∠ABC(=x)의 크기를 구하세요.`,
      `Segment AB is the diameter of circle O, and C is a point on the circle. If ∠BAC = ${angleA}°, find ∠ABC (=x).`
    ),
    angleB,
    { kind: 'circle-diameter-angle', angleA, angleB },
    tx(
      profile,
      `반원(지름)에 대한 원주각의 크기는 90°이므로 ∠ACB = 90°입니다. 직각삼각형 ABC에서 세 내각의 합은 180°이므로 ∠ABC = 90° - ∠BAC = 90° - ${angleA}° = ${angleB}°입니다.`,
      `The angle inscribed in a semicircle is 90° (∠ACB = 90°). In right triangle ABC, ∠ABC = 90° - ${angleA}° = ${angleB}°.`
    ),
    { answerSuffix: '°' }
  );
}

// 04-4: 원주각의 크기와 호의 길이의 정비례
function arcLengthProportion(random, profile) {
  const angle1 = ri(random, 15, 45);
  const ratio = ri(random, 2, 4);
  const angle2 = angle1 * ratio;
  const arc1 = ri(random, 3, 8);
  const arc2 = arc1 * ratio;

  const variant = ri(random, 0, 1);
  if (variant === 0) {
    return make(
      tx(
        profile,
        `원 O에서 호 AB에 대한 원주각이 ${angle1}°이고 호 AB의 길이가 ${arc1}cm이다. 호 CD에 대한 원주각이 ${angle2}°일 때, 호 CD의 길이(=x)를 구하세요.`,
        `In circle O, the inscribed angle for arc AB is ${angle1}° with arc length ${arc1} cm. If the inscribed angle for arc CD is ${angle2}°, find the length of arc CD (=x).`
      ),
      arc2,
      { kind: 'circle-arc-ratio', angle1, angle2, arc1, arc2, target: 'arc' },
      tx(
        profile,
        `한 원에서 호의 길이는 그 호에 대한 원주각의 크기에 정비례합니다. 호 AB : 호 CD = ${angle1}° : ${angle2}° = 1 : ${ratio}이므로 호 CD = ${arc1} × ${ratio} = ${arc2}cm입니다.`,
        `Arc lengths are directly proportional to their inscribed angles: arc CD = arc AB × (${angle2} / ${angle1}) = ${arc1} × ${ratio} = ${arc2} cm.`
      ),
      { answerSuffix: 'cm' }
    );
  }

  return make(
    tx(
      profile,
      `원 O에서 호 AB = ${arc1}cm에 대한 원주각이 ${angle1}°이다. 호 CD = ${arc2}cm에 대한 원주각(=x)의 크기를 구하세요.`,
      `In circle O, arc AB = ${arc1} cm subtends an inscribed angle of ${angle1}°. Find the inscribed angle (=x) subtended by arc CD = ${arc2} cm.`
    ),
    angle2,
    { kind: 'circle-arc-ratio', angle1, angle2, arc1, arc2, target: 'angle' },
    tx(
      profile,
      `원주각의 크기는 호의 길이에 정비례하므로 x = ${angle1}° × (${arc2} / ${arc1}) = ${angle2}°입니다.`,
      `The inscribed angle is proportional to arc length: x = ${angle1}° × (${arc2} / ${arc1}) = ${angle2}°.`
    ),
    { answerSuffix: '°' }
  );
}

// ---------------------------------------------------------------------------
// 05. 원에 내접하는 사각형과 조건
// ---------------------------------------------------------------------------

// 05-1: 원에 내접하는 사각형의 대각의 합 (∠A + ∠C = 180°)
function cyclicQuadOpposite(random, profile) {
  const angleA = ri(random, 70, 120);
  const angleC = 180 - angleA;
  const angleB = ri(random, 65, 115);
  const angleD = 180 - angleB;

  return make(
    tx(
      profile,
      `사각형 ABCD가 원에 내접하고 ∠A = ${angleA}°, ∠B = ${angleB}°이다. ∠C(=x)의 크기를 구하세요.`,
      `Quadrilateral ABCD is inscribed in a circle. If ∠A = ${angleA}° and ∠B = ${angleB}°, find ∠C (=x).`
    ),
    angleC,
    { kind: 'circle-cyclic-quad', angleA, angleB, angleC, angleD, target: 'C' },
    tx(
      profile,
      `원에 내접하는 사각형에서 한 쌍의 대각의 크기의 합은 180°입니다. ∠A + ∠C = 180°이므로 ∠C = 180° - ${angleA}° = ${angleC}°입니다.`,
      `Opposite angles of a cyclic quadrilateral sum to 180°: ∠A + ∠C = 180°, so ∠C = 180° - ${angleA}° = ${angleC}°.`
    ),
    { answerSuffix: '°' }
  );
}

// 05-2: 원에 내접하는 사각형의 한 외각 = 내대각
function cyclicQuadExterior(random, profile) {
  const angleA = ri(random, 75, 125);
  const angleC = 180 - angleA;

  return make(
    tx(
      profile,
      `사각형 ABCD가 원에 내접하고 꼭짓점 C에서의 외각을 ∠DCE라 하자. ∠A = ${angleA}°일 때, 외각 ∠DCE(=x)의 크기를 구하세요.`,
      `Quadrilateral ABCD is cyclic. Let ∠DCE be the exterior angle at vertex C. If ∠A = ${angleA}°, find ∠DCE (=x).`
    ),
    angleA,
    { kind: 'circle-cyclic-exterior', angleA, angleC },
    tx(
      profile,
      `원에 내접하는 사각형의 한 외각의 크기는 그 외각에 이웃한 내각에 대한 대각(내대각)의 크기와 같습니다. 따라서 ∠DCE = ∠A = ${angleA}°입니다.`,
      `An exterior angle of a cyclic quadrilateral equals its interior opposite angle: ∠DCE = ∠A = ${angleA}°.`
    ),
    { answerSuffix: '°' }
  );
}

// 05-3: 네 점이 한 원 위에 있을 조건 (원주각 조건: ∠ACB = ∠ADB)
function concyclicCondition(random, profile) {
  const angle = ri(random, 30, 75);

  return make(
    tx(
      profile,
      `두 점 C, D가 직선 AB에 대하여 같은 쪽에 있다. 네 점 A, B, C, D가 한 원 위에 있기 위한 ∠ADB(=x)의 크기를 구하세요. (단, ∠ACB = ${angle}°이다)`,
      `Points C and D lie on the same side of line AB. Find ∠ADB (=x) such that points A, B, C, and D are concyclic, given ∠ACB = ${angle}°.`
    ),
    angle,
    { kind: 'circle-concyclic-four', angle },
    tx(
      profile,
      `네 점 A, B, C, D가 한 원 위에 있으려면 현 AB에 대한 원주각의 크기가 같아야 하므로 ∠ADB = ∠ACB = ${angle}°이어야 합니다.`,
      `For four points to be concyclic, the inscribed angles subtended by AB must be equal: ∠ADB = ∠ACB = ${angle}°.`
    ),
    { answerSuffix: '°' }
  );
}

// ---------------------------------------------------------------------------
// 06. 접선과 현이 이루는 각 (접현각)
// ---------------------------------------------------------------------------

// 06-1: 접선과 현이 이루는 각의 기본 정리 (∠BAT = ∠BCA)
function tangentChordAngle(random, profile) {
  const angle = ri(random, 35, 75);
  const thirdAngle = ri(random, 30, 180 - angle - 30);
  const otherAngle = 180 - angle - thirdAngle;

  const variant = ri(random, 0, 1);
  if (variant === 0) {
    return make(
      tx(
        profile,
        `직선 TT'이 원 O 위의 점 A에서의 접선이다. 원 위의 점 C에 대하여 ∠BCA = ${angle}°일 때, 접선과 현 AB가 이루는 예각 ∠BAT(=x)의 크기를 구하세요.`,
        `Line TT' is tangent to circle O at point A. For a point C on the circle, ∠BCA = ${angle}°. Find the angle ∠BAT (=x) between the tangent and chord AB.`
      ),
      angle,
      { kind: 'circle-tangent-chord', angle, otherAngle },
      tx(
        profile,
        `원의 접선과 그 접점을 지나는 현이 이루는 각의 크기는 그 각의 내부에 있는 호에 대한 원주각의 크기와 같으므로 ∠BAT = ∠BCA = ${angle}°입니다.`,
        `The angle between a tangent and a chord equals the inscribed angle subtended by that chord: ∠BAT = ∠BCA = ${angle}°.`
      ),
      { answerSuffix: '°' }
    );
  }

  return make(
    tx(
      profile,
      `직선 TT'이 점 A에서 원 O에 접한다. 접선과 현 AB가 이루는 각 ∠BAT = ${angle}°일 때, 호 AB에 대한 원주각 ∠BCA(=x)의 크기를 구하세요.`,
      `Line TT' is tangent to circle O at A. If ∠BAT = ${angle}°, find the inscribed angle ∠BCA (=x) subtended by chord AB.`
    ),
    angle,
    { kind: 'circle-tangent-chord', angle, otherAngle },
    tx(
      profile,
      `접현각 정리에 의해 원주각 ∠BCA = ∠BAT = ${angle}°입니다.`,
      `By the alternate segment theorem, inscribed angle ∠BCA = ∠BAT = ${angle}°.`
    ),
    { answerSuffix: '°' }
  );
}

// 06-2: 지름과 접현각의 결합 (지름에 대한 90° 원주각과 접현각)
function tangentChordDiameter(random, profile) {
  const chordAngle = ri(random, 25, 65);
  const otherAcute = 90 - chordAngle;

  return make(
    tx(
      profile,
      `직선 AT가 점 A에서 원 O에 접하고, 선분 AB는 원 O의 지름이다. 원 위의 점 C에 대하여 ∠CAT = ${chordAngle}°일 때, ∠ABC(=x)의 크기를 구하세요.`,
      `Line AT is tangent to circle O at A, and segment AB is a diameter. For point C on the circle, ∠CAT = ${chordAngle}°. Find ∠ABC (=x).`
    ),
    chordAngle,
    { kind: 'circle-tangent-diameter', chordAngle, otherAcute },
    tx(
      profile,
      `접현각 정리에 의해 접선과 현 AC가 이루는 각 ∠CAT는 호 AC에 대한 원주각 ∠ABC와 같습니다. 따라서 ∠ABC = ∠CAT = ${chordAngle}°입니다.`,
      `By the alternate segment theorem, the angle between tangent AT and chord AC equals the inscribed angle ∠ABC subtended by arc AC, so ∠ABC = ${chordAngle}°.`
    ),
    { answerSuffix: '°' }
  );
}

// 06-3: 두 원에서 접선과 현이 이루는 각과 평행선
function twoCirclesTangentChord(random, profile) {
  const angle1 = ri(random, 45, 80);

  return make(
    tx(
      profile,
      `두 원이 점 T에서 외접하고, 점 T를 지나는 두 직선이 두 원과 만나는 점을 각각 A, B 및 C, D라 하자. ∠BAT = ${angle1}°일 때, 엇각에 위치한 ∠CDT(=x)의 크기를 구하세요.`,
      `Two circles touch externally at T. Two lines through T intersect the circles at A, B and C, D. If ∠BAT = ${angle1}°, find ∠CDT (=x).`
    ),
    angle1,
    { kind: 'circle-two-circles-tangent', angle1 },
    tx(
      profile,
      `점 T에서의 공통접선을 그으면 접현각과 맞꼭지각의 성질에 의해 ∠BAT = ∠CDT = ${angle1}°입니다. (이에 따라 엇각의 크기가 같으므로 선분 AB와 CD는 서로 평행합니다)`,
      `Drawing the common tangent at T, by the alternate segment theorem and vertical angles, ∠BAT = ∠CDT = ${angle1}°. (Hence AB ∥ CD)`
    ),
    { answerSuffix: '°' }
  );
}

// ---------------------------------------------------------------------------
// 유닛 생성 헬퍼
// ---------------------------------------------------------------------------
function unit(id, label, enLabel, description, enDesc, generators, profiles = ['kr', 'international', 'amc', 'sg', 'tw', 'hk', 'csat', 'amc12']) {
  return {
    id,
    label,
    description,
    en: [enLabel, enDesc],
    profiles,
    make: (random, profile) => pick(random, generators)(random, profile),
  };
}

export const CIRCLE_PROPERTIES_UNITS = [
  unit(
    'circle-chord-properties',
    '현의 수직이등분선과 현의 길이',
    'Chords & Perpendicular Bisectors',
    '원의 중심에서 현에 내린 수선, 현의 길이, 활꼴과 깨진 원의 반지름, 접은 원의 현',
    'Perpendicular from center to chord, chord length, sagitta, broken circular plate, and folded circle chords',
    [chordBisectorLength, sagittaBrokenPlate, foldedCircleChord, equidistantChords]
  ),
  unit(
    'circle-tangent-properties',
    '원의 접선의 성질과 접선의 길이',
    'Tangents & Tangent Segments',
    '원 밖의 점에서 그은 두 접선의 길이, 중심각과 접선각의 관계, 접선으로 둘러싸인 삼각형의 둘레, 동심원 고리 넓이',
    'Tangent segments from an external point, angles between tangents, perimeter of tangent triangles, and concentric ring areas',
    [tangentPythagoras, twoTangentsAngle, tangentTrianglePerimeter, concentricCircleRing]
  ),
  unit(
    'circle-inscribed-circumscribed',
    '삼각형의 내접원과 외접사각형',
    'Inscribed & Circumscribed Polygons',
    '삼각형의 내접원과 접선 분할, 직각삼각형 내접원 반지름, 원에 외접하는 사각형의 대변의 합과 사다리꼴',
    'Incircle segment division, right triangle inradius, circumscribed quadrilaterals and trapezoids',
    [incircleSegments, rightTriangleInradius, circumscribedQuadrilateral]
  ),
  unit(
    'circle-inscribed-angles',
    '원주각과 중심각의 성질',
    'Inscribed Angles & Central Angles',
    '원주각과 중심각의 1:2 관계, 한 호에 대한 원주각, 반원과 지름에 대한 원주각, 원주각과 호의 길이의 정비례',
    'Inscribed vs central angles, angles subtending the same arc, angles inscribed in semicircles, arc proportionality',
    [inscribedAndCentralAngle, sameArcInscribedAngles, diameterInscribedAngle, arcLengthProportion]
  ),
  unit(
    'circle-cyclic-quadrilaterals',
    '원에 내접하는 사각형과 조건',
    'Cyclic Quadrilaterals & Concyclic Points',
    '내접사각형의 대각의 합 180°, 외각과 내대각의 관계, 네 점이 한 원 위에 있을 조건',
    'Opposite angle sum 180° in cyclic quads, exterior angles equal interior opposite, concyclic conditions',
    [cyclicQuadOpposite, cyclicQuadExterior, concyclicCondition]
  ),
  unit(
    'circle-tangent-chord-angles',
    '접선과 현이 이루는 각 (접현각)',
    'Tangent-Chord Angles (Alternate Segment)',
    '접선과 현이 이루는 접현각 정리, 지름과 접현각의 결합, 두 원과 공통접선에서의 각과 평행선',
    'Alternate segment theorem, tangent-chord with diameter, two tangent circles with common tangent line',
    [tangentChordAngle, tangentChordDiameter, twoCirclesTangentChord]
  ),
  unit(
    'circle-properties-mixed',
    '중3 원의 성질 종합 실전',
    'Circle Properties Comprehensive Review',
    '원과 직선(현·접선·내접원)부터 원주각(중심각·내접사각형·접현각)까지 알피엠 핵심 유형 총정리',
    'Comprehensive practice covering chords, tangents, incircles, inscribed angles, cyclic quads, and tangent-chord theorems',
    [
      chordBisectorLength,
      sagittaBrokenPlate,
      foldedCircleChord,
      equidistantChords,
      tangentPythagoras,
      twoTangentsAngle,
      tangentTrianglePerimeter,
      concentricCircleRing,
      incircleSegments,
      rightTriangleInradius,
      circumscribedQuadrilateral,
      inscribedAndCentralAngle,
      sameArcInscribedAngles,
      diameterInscribedAngle,
      arcLengthProportion,
      cyclicQuadOpposite,
      cyclicQuadExterior,
      concyclicCondition,
      tangentChordAngle,
      tangentChordDiameter,
      twoCirclesTangentChord,
    ]
  ),
];
