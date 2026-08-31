// 중2-2 "삼각형과 사각형의 성질" (이등변삼각형 / 삼각형의 외심과 내심 / 평행사변형 / 여러 가지 사각형).
// 참고: 중학수학 2-2 RPM 01~04장 — 구조와 풀이 방식만 추출했고, 교재 원문·이미지·출판사명은
// 코드나 문제에 그대로 노출하지 않는다 (PRD_2022개정_수학교육과정_카테고리 §2.4/§9 정책과 동일).
import { profileText } from './geometryProfiles';

const ri = (random, min, max) => Math.floor(random() * (max - min + 1)) + min;
const pick = (random, values) => values[ri(random, 0, values.length - 1)];
const tx = (profile, ko, en) => profileText(profile, { ko, en, 'zh-TW': en, 'zh-HK': en });
const make = (prompt, answer, diagram, explanation, extra = {}) => ({ prompt, expression: '', answer: String(answer), answerSuffix: extra.answerSuffix || '', diagram, explanation, ...extra });
const choices = (ko, en = ko) => ko.map((label, index) => ({ value: String(index + 1), label, labelEn: en[index] || label }));
const MIDDLE_PROFILES = ['kr', 'international', 'amc', 'sg', 'tw', 'hk'];

// ---------------------------------------------------------------------------
// 01. 이등변삼각형
// ---------------------------------------------------------------------------

// 01-1: 밑각 정리 (AB=AC이면 ∠B=∠C) — 꼭지각 또는 밑각 중 하나를 구한다.
function isoscelesBaseAngle(random, profile) {
  if (random() < 0.5) {
    const baseAngle = ri(random, 40, 79);
    const apexAngle = 180 - 2 * baseAngle;
    return make(
      tx(profile, `△ABC가 AB=AC인 이등변삼각형이다. ∠B=${baseAngle}°일 때, ∠A(=x)의 크기를 구하세요.`, `In isosceles triangle ABC with AB=AC, ∠B=${baseAngle}°. Find ∠A (=x).`),
      apexAngle,
      { kind: 'isosceles-triangle', target: 'apex', apexAngle, baseAngle, showFoot: false },
      tx(profile, `이등변삼각형의 밑각은 같으므로 ∠C=${baseAngle}°이고, 세 각의 합이 180°이므로 x=180−2×${baseAngle}=${apexAngle}입니다.`, `Base angles are equal, so ∠C=${baseAngle}°; the angle sum gives x=180−2×${baseAngle}=${apexAngle}.`),
      { answerSuffix: '°' },
    );
  }
  const apexAngle = ri(random, 10, 70) * 2;
  const baseAngle = (180 - apexAngle) / 2;
  return make(
    tx(profile, `△ABC가 AB=AC인 이등변삼각형이다. ∠A=${apexAngle}°일 때, ∠B(=x)의 크기를 구하세요.`, `In isosceles triangle ABC with AB=AC, ∠A=${apexAngle}°. Find ∠B (=x).`),
    baseAngle,
    { kind: 'isosceles-triangle', target: 'base', apexAngle, baseAngle, showFoot: false },
    tx(profile, `세 각의 합이 180°이고 밑각이 같으므로 2x=180−${apexAngle}, x=${baseAngle}입니다.`, `The angle sum gives 2x=180−${apexAngle}, so x=${baseAngle}.`),
    { answerSuffix: '°' },
  );
}

// 01-2: 꼭지각의 이등분선(수선)은 밑변을 수직이등분한다 — BD 또는 BC를 구한다.
function isoscelesPerpendicularFoot(random, profile) {
  const half = ri(random, 3, 12);
  const full = half * 2;
  const diagramBase = { kind: 'isosceles-triangle', target: 'apex', apexAngle: 70, baseAngle: 55, showFoot: true, showAngles: false };
  if (random() < 0.5) {
    return make(
      tx(profile, `△ABC가 AB=AC인 이등변삼각형이고, 꼭짓점 A에서 BC에 내린 수선의 발을 D라 하자. BD=${half}cm일 때, BC(=x)의 길이를 구하세요.`, `In isosceles triangle ABC (AB=AC), D is the foot of the perpendicular from A to BC. If BD=${half} cm, find BC (=x).`),
      full,
      { ...diagramBase, lengthLabels: [{ position: 'BD', text: `${half}`, isTarget: false }, { position: 'BC', text: 'x', isTarget: true }] },
      tx(profile, `꼭지각의 이등분선(수선)은 밑변을 수직이등분하므로 DC=BD=${half}이고, BC=2×${half}=${full}입니다.`, `The perpendicular from the apex bisects the base, so DC=BD=${half} and BC=2×${half}=${full}.`),
      { answerSuffix: 'cm' },
    );
  }
  return make(
    tx(profile, `△ABC가 AB=AC인 이등변삼각형이고, 꼭짓점 A에서 BC에 내린 수선의 발을 D라 하자. BC=${full}cm일 때, BD(=x)의 길이를 구하세요.`, `In isosceles triangle ABC (AB=AC), D is the foot of the perpendicular from A to BC. If BC=${full} cm, find BD (=x).`),
    half,
    { ...diagramBase, lengthLabels: [{ position: 'BC', text: `${full}`, isTarget: false }, { position: 'BD', text: 'x', isTarget: true }] },
    tx(profile, `수선은 밑변을 수직이등분하므로 BD=BC÷2=${half}입니다.`, `The perpendicular bisects the base, so BD=BC÷2=${half}.`),
    { answerSuffix: 'cm' },
  );
}

// 01-3: 직각삼각형의 합동 조건 (RHA/RHS) — 대응변의 길이를 구한다.
function rightTriangleCongruence(random, profile) {
  const hyp = ri(random, 8, 15);
  const useRHA = random() < 0.5;
  if (useRHA) {
    const angle = pick(random, [30, 35, 40, 50, 55, 60]);
    const side = ri(random, 3, 7);
    return make(
      tx(profile, `두 직각삼각형 ABC, DEF에서 ∠C=∠F=90°, AB=DE=${hyp}cm, ∠A=∠D=${angle}°이다. 두 삼각형이 합동일 때(RHA 합동), AC=${side}cm이면 DF의 길이를 구하세요.`, `Right triangles ABC and DEF have ∠C=∠F=90°, AB=DE=${hyp} cm, ∠A=∠D=${angle}°. Given they are congruent (RHA), AC=${side} cm — find DF.`),
      side,
      null,
      tx(profile, `빗변의 길이와 한 예각의 크기가 각각 같으므로 △ABC≡△DEF(RHA 합동)이고, 대응변 DF=AC=${side}입니다.`, `Equal hypotenuses and one equal acute angle give △ABC≡△DEF (RHA); the corresponding side DF=AC=${side}.`),
      { answerSuffix: 'cm' },
    );
  }
  const leg = ri(random, 3, Math.max(4, hyp - 2));
  return make(
    tx(profile, `두 직각삼각형 ABC, DEF에서 ∠C=∠F=90°, AB=DE=${hyp}cm, BC=EF=${leg}cm이다. 두 삼각형이 합동일 때(RHS 합동), AC=6cm이면 DF의 길이를 구하세요.`, `Right triangles ABC and DEF have ∠C=∠F=90°, AB=DE=${hyp} cm, BC=EF=${leg} cm. Given they are congruent (RHS), AC=6 cm — find DF.`),
    6,
    null,
    tx(profile, `빗변과 다른 한 변의 길이가 각각 같으므로 △ABC≡△DEF(RHS 합동)이고, 대응변 DF=AC=6입니다.`, `Equal hypotenuses and one equal leg give △ABC≡△DEF (RHS); the corresponding side DF=AC=6.`),
    { answerSuffix: 'cm' },
  );
}

// 01-4: 각의 이등분선의 성질 (각의 이등분선 위의 점은 두 변에서 같은 거리에 있다)
function angleBisectorDistance(random, profile) {
  const distance = ri(random, 3, 12);
  return make(
    tx(profile, `점 P가 ∠XOY의 이등분선 위의 점이고, P에서 OX까지의 거리가 ${distance}cm일 때, P에서 OY까지의 거리(=x)를 구하세요.`, `Point P lies on the bisector of ∠XOY. Its distance to OX is ${distance} cm. Find its distance to OY (=x).`),
    distance,
    null,
    tx(profile, `각의 이등분선 위의 점은 그 각을 이루는 두 변에서 같은 거리에 있으므로 x=${distance}입니다.`, `A point on an angle bisector is equidistant from both sides, so x=${distance}.`),
    { answerSuffix: 'cm' },
  );
}

// ---------------------------------------------------------------------------
// 02. 삼각형의 외심과 내심
// ---------------------------------------------------------------------------

// 02-1/02-2: 외심 O는 세 꼭짓점에서 같은 거리 → 세 개의 이등변삼각형(OAB,OBC,OCA)의 밑각의 합은 90°.
function circumcenterHalfAngles(random, profile) {
  let alpha = ri(random, 10, 35); let beta = ri(random, 10, 35);
  while (alpha + beta >= 85) { alpha = ri(random, 10, 35); beta = ri(random, 10, 35); }
  const gamma = 90 - alpha - beta;
  return make(
    tx(profile, `점 O가 △ABC의 외심일 때, ∠OAB=${alpha}°, ∠OBC=${beta}°이다. ∠OCA(=x)의 크기를 구하세요.`, `O is the circumcenter of △ABC. ∠OAB=${alpha}°, ∠OBC=${beta}°. Find ∠OCA (=x).`),
    gamma,
    { kind: 'triangle-center-angles', center: 'circumcenter', labels: [{ vertex: 'A', text: `${alpha}°`, isTarget: false }, { vertex: 'B', text: `${beta}°`, isTarget: false }, { vertex: 'C', text: 'x', isTarget: true }] },
    tx(profile, `외심은 세 꼭짓점에서 같은 거리에 있어 △OAB, △OBC, △OCA가 모두 이등변삼각형이 되고, 이 세 밑각의 합은 90°이므로 x=90−${alpha}−${beta}=${gamma}입니다.`, `OA=OB=OC makes each of △OAB, △OBC, △OCA isosceles; their base half-angles sum to 90°, so x=90−${alpha}−${beta}=${gamma}.`),
    { answerSuffix: '°' },
  );
}

// 02-2: 외심에서 한 변에 대한 중심각은 그 변에 대한 원주각의 2배이다.
function circumcenterCentralAngle(random, profile) {
  const inscribed = ri(random, 20, 80);
  const central = inscribed * 2;
  const askCentral = random() < 0.5;
  if (askCentral) {
    return make(
      tx(profile, `점 O가 △ABC의 외심일 때, ∠BAC=${inscribed}°이다. ∠BOC(=x)의 크기를 구하세요.`, `O is the circumcenter of △ABC. ∠BAC=${inscribed}°. Find ∠BOC (=x).`),
      central,
      { kind: 'triangle-center-angles', center: 'circumcenter', labels: [{ vertex: 'A', text: `${inscribed}°`, isTarget: false }, { vertex: 'B', text: 'x', isTarget: true }] },
      tx(profile, `한 변에 대한 중심각의 크기는 그 변에 대한 원주각의 2배이므로 x=2×${inscribed}=${central}입니다.`, `A central angle is twice the inscribed angle on the same arc, so x=2×${inscribed}=${central}.`),
      { answerSuffix: '°' },
    );
  }
  return make(
    tx(profile, `점 O가 △ABC의 외심일 때, ∠BOC=${central}°이다. ∠BAC(=x)의 크기를 구하세요.`, `O is the circumcenter of △ABC. ∠BOC=${central}°. Find ∠BAC (=x).`),
    inscribed,
    { kind: 'triangle-center-angles', center: 'circumcenter', labels: [{ vertex: 'B', text: `${central}°`, isTarget: false }, { vertex: 'A', text: 'x', isTarget: true }] },
    tx(profile, `원주각의 크기는 같은 호에 대한 중심각의 절반이므로 x=${central}÷2=${inscribed}입니다.`, `An inscribed angle is half the central angle on the same arc, so x=${central}÷2=${inscribed}.`),
    { answerSuffix: '°' },
  );
}

// 02-3/02-4: 내심 I — △IBC에서 각의 합, 또는 ∠BIC=90°+∠A/2 공식.
function incenterTriangleSum(random, profile) {
  const ibc = ri(random, 15, 50); const icb = ri(random, 15, 50 - Math.max(0, ibc - 40));
  const angleAtI = 180 - ibc - icb;
  return make(
    tx(profile, `점 I가 △ABC의 내심일 때, ∠IBC=${ibc}°, ∠ICB=${icb}°이다. ∠BIC(=x)의 크기를 구하세요.`, `I is the incenter of △ABC. ∠IBC=${ibc}°, ∠ICB=${icb}°. Find ∠BIC (=x).`),
    angleAtI,
    { kind: 'triangle-center-angles', center: 'incenter', labels: [{ vertex: 'B', text: `${ibc}°`, isTarget: false }, { vertex: 'C', text: `${icb}°`, isTarget: false }, { vertex: 'A', text: 'x', isTarget: true }] },
    tx(profile, `△IBC에서 세 각의 합은 180°이므로 x=180−${ibc}−${icb}=${angleAtI}입니다.`, `The angles of △IBC sum to 180°, so x=180−${ibc}−${icb}=${angleAtI}.`),
    { answerSuffix: '°' },
  );
}

function incenterFormula(random, profile) {
  const angleA = ri(random, 20, 100);
  const angleBIC = 90 + angleA / 2;
  const askBIC = random() < 0.5 || !Number.isInteger(angleBIC);
  if (askBIC && Number.isInteger(angleBIC)) {
    return make(
      tx(profile, `점 I가 △ABC의 내심일 때, ∠A=${angleA}°이다. ∠BIC(=x)의 크기를 구하세요.`, `I is the incenter of △ABC. ∠A=${angleA}°. Find ∠BIC (=x).`),
      angleBIC,
      { kind: 'triangle-center-angles', center: 'incenter', labels: [{ vertex: 'A', text: `${angleA}°`, isTarget: false }, { vertex: 'B', text: 'x', isTarget: true }] },
      tx(profile, `내심에서 ∠BIC=90°+∠A/2이므로 x=90+${angleA}/2=${angleBIC}입니다.`, `For the incenter, ∠BIC=90°+∠A/2, so x=90+${angleA}/2=${angleBIC}.`),
      { answerSuffix: '°' },
    );
  }
  const evenA = angleA % 2 === 0 ? angleA : angleA + 1;
  const bic = 90 + evenA / 2;
  return make(
    tx(profile, `점 I가 △ABC의 내심일 때, ∠BIC=${bic}°이다. ∠A(=x)의 크기를 구하세요.`, `I is the incenter of △ABC. ∠BIC=${bic}°. Find ∠A (=x).`),
    evenA,
    { kind: 'triangle-center-angles', center: 'incenter', labels: [{ vertex: 'B', text: `${bic}°`, isTarget: false }, { vertex: 'A', text: 'x', isTarget: true }] },
    tx(profile, `∠BIC=90°+∠A/2이므로 ${bic}=90+x/2, x=${evenA}입니다.`, `From ∠BIC=90°+∠A/2: ${bic}=90+x/2, so x=${evenA}.`),
    { answerSuffix: '°' },
  );
}

// 02-3: 내접원의 접선의 길이 — 한 꼭짓점에서 내접원에 그은 두 접선의 길이는 같다.
function incenterTangentLength(random, profile) {
  const tangentA = ri(random, 3, 10);
  const tangentB = ri(random, 3, 10);
  const sideAB = tangentA + tangentB;
  return make(
    tx(profile, `점 I가 △ABC의 내접원의 중심이고 내접원이 AB, BC, CA와 각각 점 D, E, F에서 접한다. AD=${tangentA}cm, BD=${tangentB}cm일 때, AB(=x)의 길이를 구하세요.`, `The incircle of △ABC touches AB, BC, CA at D, E, F. AD=${tangentA} cm, BD=${tangentB} cm. Find AB (=x).`),
    sideAB,
    null,
    tx(profile, `한 꼭짓점에서 내접원에 그은 두 접선의 길이는 같으므로 AD, BD는 각각 AF, BE와 같고, AB=AD+DB=${tangentA}+${tangentB}=${sideAB}입니다.`, `Tangent segments from the same vertex are equal, so AB=AD+DB=${tangentA}+${tangentB}=${sideAB}.`),
    { answerSuffix: 'cm' },
  );
}

// ---------------------------------------------------------------------------
// 03. 평행사변형
// ---------------------------------------------------------------------------

// 03-1: 평행사변형의 성질 — 대각의 크기가 같고, 이웃한 두 각의 합은 180°이다.
function parallelogramAngles(random, profile) {
  const angleB = ri(random, 40, 130);
  const angleA = 180 - angleB;
  const askOpposite = random() < 0.5;
  if (askOpposite) {
    return make(
      tx(profile, `평행사변형 ABCD에서 ∠B=${angleB}°일 때, ∠D(=x)의 크기를 구하세요.`, `In parallelogram ABCD, ∠B=${angleB}°. Find ∠D (=x).`),
      angleB,
      { kind: 'quadrilateral', variant: 'parallelogram', showDiagonals: false, labels: [{ corner: 'B', text: `${angleB}°`, isTarget: false }, { corner: 'D', text: 'x', isTarget: true }] },
      tx(profile, `평행사변형의 대각의 크기는 같으므로 x=∠B=${angleB}입니다.`, `Opposite angles of a parallelogram are equal, so x=∠B=${angleB}.`),
      { answerSuffix: '°' },
    );
  }
  return make(
    tx(profile, `평행사변형 ABCD에서 ∠B=${angleB}°일 때, ∠A(=x)의 크기를 구하세요.`, `In parallelogram ABCD, ∠B=${angleB}°. Find ∠A (=x).`),
    angleA,
    { kind: 'quadrilateral', variant: 'parallelogram', showDiagonals: false, labels: [{ corner: 'B', text: `${angleB}°`, isTarget: false }, { corner: 'A', text: 'x', isTarget: true }] },
    tx(profile, `평행사변형의 이웃한 두 각의 크기의 합은 180°이므로 x=180−${angleB}=${angleA}입니다.`, `Consecutive angles of a parallelogram sum to 180°, so x=180−${angleB}=${angleA}.`),
    { answerSuffix: '°' },
  );
}

// 03-1: 평행사변형의 성질 — 대변의 길이가 같고, 두 대각선은 서로 다른 것을 이등분한다.
function parallelogramSidesDiagonals(random, profile) {
  if (random() < 0.5) {
    const side = ri(random, 5, 14);
    return make(
      tx(profile, `평행사변형 ABCD에서 AB=${side}cm일 때, CD(=x)의 길이를 구하세요.`, `In parallelogram ABCD, AB=${side} cm. Find CD (=x).`),
      side,
      { kind: 'quadrilateral', variant: 'parallelogram', showDiagonals: false, tickSides: [['A', 'B', 1], ['D', 'C', 1]], labels: [{ corner: 'A', text: `${side}`, isTarget: false }] },
      tx(profile, `평행사변형의 대변의 길이는 같으므로 x=AB=${side}입니다.`, `Opposite sides of a parallelogram are equal, so x=AB=${side}.`),
      { answerSuffix: 'cm' },
    );
  }
  const half = ri(random, 3, 10);
  return make(
    tx(profile, `평행사변형 ABCD의 두 대각선의 교점을 O라 하자. AO=${half}cm일 때, OC(=x)의 길이를 구하세요.`, `The diagonals of parallelogram ABCD meet at O. AO=${half} cm. Find OC (=x).`),
    half,
    { kind: 'quadrilateral', variant: 'parallelogram', showDiagonals: true, labels: [{ corner: 'A', text: `${half}`, isTarget: false }] },
    tx(profile, `평행사변형의 두 대각선은 서로 다른 것을 이등분하므로 x=AO=${half}입니다.`, `The diagonals of a parallelogram bisect each other, so x=AO=${half}.`),
    { answerSuffix: 'cm' },
  );
}

// 03-2: 평행사변형이 되는 조건 (5가지 중 하나가 아닌 것 찾기, MCQ)
const PARALLELOGRAM_CONDITIONS = [
  { ko: '두 쌍의 대변이 각각 평행하다.', en: 'Both pairs of opposite sides are parallel.', valid: true },
  { ko: '두 쌍의 대변의 길이가 각각 같다.', en: 'Both pairs of opposite sides are equal.', valid: true },
  { ko: '두 쌍의 대각의 크기가 각각 같다.', en: 'Both pairs of opposite angles are equal.', valid: true },
  { ko: '두 대각선이 서로 다른 것을 이등분한다.', en: 'The diagonals bisect each other.', valid: true },
  { ko: '한 쌍의 대변이 평행하고 그 길이가 같다.', en: 'One pair of opposite sides is parallel and equal in length.', valid: true },
  { ko: '두 대각선의 길이가 서로 같다.', en: 'The diagonals are equal in length.', valid: false },
  { ko: '한 쌍의 대변이 평행하고 다른 한 쌍의 대변의 길이가 같다.', en: 'One pair of opposite sides is parallel and the other pair is merely equal (not necessarily parallel).', valid: false },
];
function parallelogramCondition(random, profile) {
  const chosen = pick(random, PARALLELOGRAM_CONDITIONS);
  return make(
    tx(profile, `□ABCD에서 다음 설명이 평행사변형이 되는 조건인지 판단하세요.\n"${chosen.ko}"`, `Decide whether the following makes ABCD a parallelogram.\n"${chosen.en}"`),
    chosen.valid ? 1 : 2,
    null,
    tx(profile, chosen.valid ? '평행사변형이 되는 다섯 가지 조건 중 하나입니다.' : '평행사변형이 되는 조건이 아닙니다 (반례가 존재합니다).', chosen.valid ? 'This is one of the five standard parallelogram conditions.' : 'This is not sufficient (a counterexample exists).'),
    { choices: choices(['조건이다', '조건이 아니다'], ['It is a valid condition', 'It is not a valid condition']) },
  );
}

// 03-3: 평행사변형과 넓이 — 대각선으로 나뉜 네 삼각형의 넓이 관계.
function parallelogramArea(random, profile) {
  const triangleArea = ri(random, 4, 15);
  const askHalf = random() < 0.5;
  if (askHalf) {
    return make(
      tx(profile, `평행사변형 ABCD에서 두 대각선의 교점을 O라 하자. △ABO의 넓이가 ${triangleArea}cm²일 때, △ABC의 넓이(=x)를 구하세요.`, `The diagonals of parallelogram ABCD meet at O. The area of △ABO is ${triangleArea} cm². Find the area of △ABC (=x).`),
      triangleArea * 2,
      { kind: 'quadrilateral', variant: 'parallelogram', showDiagonals: true, labels: [{ corner: 'A', text: `${triangleArea}`, isTarget: false }] },
      tx(profile, `대각선 BD는 평행사변형을 넓이가 같은 두 삼각형으로 나누므로 △ABC=2×△ABO=${triangleArea * 2}입니다.`, `Diagonal BD splits the parallelogram into two equal-area triangles, so △ABC=2×△ABO=${triangleArea * 2}.`),
      { answerSuffix: 'cm²' },
    );
  }
  return make(
    tx(profile, `평행사변형 ABCD에서 두 대각선의 교점을 O라 하자. △ABO의 넓이가 ${triangleArea}cm²일 때, □ABCD의 넓이(=x)를 구하세요.`, `The diagonals of parallelogram ABCD meet at O. The area of △ABO is ${triangleArea} cm². Find the area of □ABCD (=x).`),
    triangleArea * 4,
    { kind: 'quadrilateral', variant: 'parallelogram', showDiagonals: true, labels: [{ corner: 'A', text: `${triangleArea}`, isTarget: false }] },
    tx(profile, `두 대각선은 평행사변형을 넓이가 같은 네 삼각형으로 나누므로 □ABCD=4×△ABO=${triangleArea * 4}입니다.`, `The diagonals split the parallelogram into four equal-area triangles, so □ABCD=4×△ABO=${triangleArea * 4}.`),
    { answerSuffix: 'cm²' },
  );
}

// ---------------------------------------------------------------------------
// 04. 여러 가지 사각형
// ---------------------------------------------------------------------------

const QUADRILATERAL_VARIANTS = [
  { id: 'rectangle', ko: '직사각형', en: 'rectangle', rightAngleCorners: ['A', 'B', 'C', 'D'], diagonalsEqual: true, diagonalsPerp: false, tickSides: [] },
  { id: 'rhombus', ko: '마름모', en: 'rhombus', rightAngleCorners: [], diagonalsEqual: false, diagonalsPerp: true, tickSides: [['A', 'B', 1], ['B', 'C', 1], ['C', 'D', 1], ['D', 'A', 1]] },
  { id: 'square', ko: '정사각형', en: 'square', rightAngleCorners: ['A', 'B', 'C', 'D'], diagonalsEqual: true, diagonalsPerp: true, tickSides: [['A', 'B', 1], ['B', 'C', 1], ['C', 'D', 1], ['D', 'A', 1]] },
];

// 04-1~04-3: 직사각형·마름모·정사각형의 대각선의 길이를 이용한 문제.
function quadrilateralDiagonalHalf(random, profile) {
  const variant = pick(random, QUADRILATERAL_VARIANTS);
  const half = ri(random, 3, 12);
  const diagram = { kind: 'quadrilateral', variant: variant.id, showDiagonals: true, rightAngleCorners: variant.rightAngleCorners, tickSides: variant.tickSides, labels: [{ corner: 'A', text: `${half}`, isTarget: false }] };
  if (variant.diagonalsEqual) {
    return make(
      tx(profile, `□ABCD가 ${tx(profile, variant.ko, variant.en)}이고 두 대각선의 교점이 O이다. AO=${half}cm일 때, BO(=x)의 길이를 구하세요.`, `Quadrilateral ABCD is a ${variant.en}, with diagonals meeting at O. If AO=${half} cm, find BO (=x).`),
      half,
      diagram,
      tx(profile, `${variant.ko}의 두 대각선은 길이가 같고 서로 다른 것을 이등분하므로 x=AO=${half}입니다.`, `In a ${variant.en}, the diagonals are equal and bisect each other, so x=AO=${half}.`),
      { answerSuffix: 'cm' },
    );
  }
  return make(
    tx(profile, `□ABCD가 ${tx(profile, variant.ko, variant.en)}이고 두 대각선의 교점이 O이다. AO=${half}cm일 때, OC(=x)의 길이를 구하세요.`, `Quadrilateral ABCD is a ${variant.en}, with diagonals meeting at O. If AO=${half} cm, find OC (=x).`),
    half,
    diagram,
    tx(profile, `${variant.ko}의 두 대각선은 서로 다른 것을 이등분하므로 x=AO=${half}입니다.`, `In a ${variant.en}, the diagonals bisect each other, so x=AO=${half}.`),
    { answerSuffix: 'cm' },
  );
}

// 04-1~04-3: 대각선이 만드는 이등변삼각형의 밑각을 이용한 각도 문제.
// 정사각형은 대각선이 꼭지각을 정확히 45°로 이등분해 각이 고정되므로(자유 변수가 없음) 제외한다.
const DIAGONAL_ANGLE_VARIANTS = QUADRILATERAL_VARIANTS.filter((item) => item.id !== 'square');
function quadrilateralDiagonalAngle(random, profile) {
  const variant = pick(random, DIAGONAL_ANGLE_VARIANTS);
  // 대각선 AC가 만든 삼각형 ABC 또는 ACD는 이등변삼각형(직사각형: OA=OB=OC=OD, 마름모: 대각선이 대각을 이등분)
  const given = ri(random, 20, 70);
  let x;
  let explanationKo; let explanationEn;
  if (variant.diagonalsPerp && !variant.rightAngleCorners.length) {
    // 마름모: 대각선은 꼭지각을 이등분 + 대각선끼리 수직 → 삼각형 AOB에서 각 계산
    x = 90 - given;
    explanationKo = `마름모의 두 대각선은 서로 수직이므로 △AOB에서 x=90−${given}=${x}입니다.`;
    explanationEn = `The diagonals of a rhombus are perpendicular, so in △AOB, x=90−${given}=${x}.`;
  } else {
    // 직사각형/정사각형: OA=OB(반대각선의 절반)이므로 △OAB는 이등변삼각형
    x = given;
    explanationKo = `직사각형(정사각형)의 두 대각선은 길이가 같고 서로 이등분하므로 OA=OB가 되어 △OAB는 이등변삼각형이고, x=${given}입니다.`;
    explanationEn = `Equal, bisecting diagonals give OA=OB, so △OAB is isosceles and x=${given}.`;
  }
  return make(
    tx(profile, `□ABCD가 ${tx(profile, variant.ko, variant.en)}이고 두 대각선의 교점이 O이다. ∠OAB=${given}°일 때, ∠OBA(=x)의 크기를 구하세요.`, `Quadrilateral ABCD is a ${variant.en}, with diagonals meeting at O. ∠OAB=${given}°. Find ∠OBA (=x).`),
    x,
    { kind: 'quadrilateral', variant: variant.id, showDiagonals: true, rightAngleCorners: variant.rightAngleCorners, tickSides: variant.tickSides, labels: [{ corner: 'A', text: `${given}°`, isTarget: false }, { corner: 'B', text: 'x', isTarget: true }] },
    tx(profile, explanationKo, explanationEn),
    { answerSuffix: '°' },
  );
}

// 04-4: 등변사다리꼴 (AD∥BC) — 밑각이 같고, 두 대각선의 길이가 같다.
function isoscelesTrapezoid(random, profile) {
  if (random() < 0.5) {
    const angleB = ri(random, 50, 130);
    return make(
      tx(profile, `□ABCD가 AD∥BC인 등변사다리꼴일 때, ∠B=${angleB}°이면 ∠C(=x)의 크기를 구하세요.`, `Quadrilateral ABCD is an isosceles trapezoid with AD∥BC. If ∠B=${angleB}°, find ∠C (=x).`),
      angleB,
      { kind: 'quadrilateral', variant: 'trapezoid', showDiagonals: false, labels: [{ corner: 'B', text: `${angleB}°`, isTarget: false }, { corner: 'C', text: 'x', isTarget: true }] },
      tx(profile, `등변사다리꼴은 밑각의 크기가 같으므로 x=∠B=${angleB}입니다.`, `The base angles of an isosceles trapezoid are equal, so x=∠B=${angleB}.`),
      { answerSuffix: '°' },
    );
  }
  const diagonal = ri(random, 6, 15);
  return make(
    tx(profile, `□ABCD가 AD∥BC인 등변사다리꼴일 때, AC=${diagonal}cm이면 BD(=x)의 길이를 구하세요.`, `Quadrilateral ABCD is an isosceles trapezoid with AD∥BC. If AC=${diagonal} cm, find BD (=x).`),
    diagonal,
    { kind: 'quadrilateral', variant: 'trapezoid', showDiagonals: true, labels: [{ corner: 'A', text: `${diagonal}`, isTarget: false }] },
    tx(profile, `등변사다리꼴의 두 대각선의 길이는 같으므로 x=AC=${diagonal}입니다.`, `The diagonals of an isosceles trapezoid are equal, so x=AC=${diagonal}.`),
    { answerSuffix: 'cm' },
  );
}

// 04-5: 여러 가지 사각형 사이의 포함 관계 (O/X)
const QUADRILATERAL_HIERARCHY = [
  { ko: '직사각형은 평행사변형이다.', en: 'A rectangle is a parallelogram.', valid: true },
  { ko: '마름모는 평행사변형이다.', en: 'A rhombus is a parallelogram.', valid: true },
  { ko: '정사각형은 직사각형이다.', en: 'A square is a rectangle.', valid: true },
  { ko: '정사각형은 마름모이다.', en: 'A square is a rhombus.', valid: true },
  { ko: '등변사다리꼴은 평행사변형이다.', en: 'An isosceles trapezoid is a parallelogram.', valid: false },
  { ko: '직사각형은 마름모이다.', en: 'A rectangle is a rhombus.', valid: false },
  { ko: '마름모는 직사각형이다.', en: 'A rhombus is a rectangle.', valid: false },
  { ko: '평행사변형은 직사각형이다.', en: 'A parallelogram is a rectangle.', valid: false },
];
function quadrilateralHierarchy(random, profile) {
  const chosen = pick(random, QUADRILATERAL_HIERARCHY);
  return make(
    tx(profile, `다음 설명이 옳은지 판단하세요.\n"${chosen.ko}"`, `Decide whether the following statement is true.\n"${chosen.en}"`),
    chosen.valid ? 1 : 2,
    null,
    tx(profile, chosen.valid ? '사각형의 포함 관계상 참인 설명입니다.' : '사각형의 포함 관계상 거짓인 설명입니다 (역은 성립하지 않습니다).', chosen.valid ? 'This is true given the hierarchy of quadrilaterals.' : 'This is false — the converse does not hold.'),
    { choices: choices(['참 (O)', '거짓 (X)'], ['True', 'False']) },
  );
}

// 04-6: 사각형의 각 변의 중점을 연결하여 만든 사각형
const MIDPOINT_QUADRILATERALS = [
  { source: '평행사변형', sourceEn: 'parallelogram', result: '평행사변형', resultEn: 'parallelogram' },
  { source: '직사각형', sourceEn: 'rectangle', result: '마름모', resultEn: 'rhombus' },
  { source: '마름모', sourceEn: 'rhombus', result: '직사각형', resultEn: 'rectangle' },
  { source: '정사각형', sourceEn: 'square', result: '정사각형', resultEn: 'square' },
  { source: '등변사다리꼴', sourceEn: 'isosceles trapezoid', result: '마름모', resultEn: 'rhombus' },
  { source: '사각형', sourceEn: 'general quadrilateral', result: '평행사변형', resultEn: 'parallelogram' },
];
function midpointQuadrilateral(random, profile) {
  const chosen = pick(random, MIDPOINT_QUADRILATERALS);
  const wrongOptions = MIDPOINT_QUADRILATERALS.map((item) => item.result).filter((value, index, arr) => arr.indexOf(value) === index && value !== chosen.result);
  const decoy = pick(random, wrongOptions);
  const correctFirst = random() < 0.5;
  const options = correctFirst ? [chosen.result, decoy] : [decoy, chosen.result];
  const optionsEn = correctFirst ? [chosen.resultEn, MIDPOINT_QUADRILATERALS.find((item) => item.result === decoy)?.resultEn || decoy] : [MIDPOINT_QUADRILATERALS.find((item) => item.result === decoy)?.resultEn || decoy, chosen.resultEn];
  return make(
    tx(profile, `${chosen.source}의 각 변의 중점을 연결하여 만든 사각형은 무엇인지 고르세요.`, `Choose the quadrilateral formed by connecting the midpoints of a ${chosen.sourceEn}'s sides.`),
    correctFirst ? 1 : 2,
    null,
    tx(profile, `${chosen.source}의 변의 중점을 연결하면 ${chosen.result}이 만들어집니다.`, `Connecting the midpoints of a ${chosen.sourceEn}'s sides gives a ${chosen.resultEn}.`),
    { choices: choices(options, optionsEn) },
  );
}

// 04-7: 평행선과 넓이 — 밑변의 비를 이용한 삼각형의 넓이 비.
function parallelAreaRatio(random, profile) {
  const ratioLeft = ri(random, 1, 4); const ratioRight = ri(random, 1, 4);
  const totalArea = (ratioLeft + ratioRight) * ri(random, 2, 8);
  const areaLeft = (totalArea * ratioLeft) / (ratioLeft + ratioRight);
  const areaRight = totalArea - areaLeft;
  const askLeft = random() < 0.5;
  return make(
    tx(profile, `△ABC의 넓이가 ${totalArea}cm²이고 BP:PC=${ratioLeft}:${ratioRight}일 때, ${askLeft ? '△ABP' : '△APC'}의 넓이(=x)를 구하세요.`, `The area of △ABC is ${totalArea} cm² and BP:PC=${ratioLeft}:${ratioRight}. Find the area of ${askLeft ? '△ABP' : '△APC'} (=x).`),
    askLeft ? areaLeft : areaRight,
    null,
    tx(profile, `높이가 같은 두 삼각형의 넓이의 비는 밑변의 길이의 비와 같으므로 ${askLeft ? '△ABP' : '△APC'}=${totalArea}×${askLeft ? ratioLeft : ratioRight}/${ratioLeft + ratioRight}=${askLeft ? areaLeft : areaRight}입니다.`, `Triangles with equal height have areas proportional to their bases, so the area is ${totalArea}×${askLeft ? ratioLeft : ratioRight}/${ratioLeft + ratioRight}=${askLeft ? areaLeft : areaRight}.`),
    { answerSuffix: 'cm²' },
  );
}

const ISOSCELES_GENERATORS = [isoscelesBaseAngle, isoscelesBaseAngle, isoscelesPerpendicularFoot, rightTriangleCongruence, angleBisectorDistance];
const CIRCUMCENTER_GENERATORS = [circumcenterHalfAngles, circumcenterHalfAngles, circumcenterCentralAngle];
const INCENTER_GENERATORS = [incenterTriangleSum, incenterTriangleSum, incenterFormula, incenterTangentLength];
const PARALLELOGRAM_GENERATORS = [parallelogramAngles, parallelogramSidesDiagonals, parallelogramCondition, parallelogramArea];
const SPECIAL_QUADRILATERAL_GENERATORS = [quadrilateralDiagonalHalf, quadrilateralDiagonalAngle, isoscelesTrapezoid, quadrilateralHierarchy, midpointQuadrilateral, parallelAreaRatio];

const unit = (id, ko, en, koDescription, enDescription, generators) => ({
  id,
  labels: { ko, en },
  descriptions: { ko: koDescription, en: enDescription },
  profiles: MIDDLE_PROFILES,
  make: (random, profile) => pick(random, generators)(random, profile),
});

export const TRIANGLE_QUADRILATERAL_UNITS = [
  unit('isosceles-triangle-properties', '이등변삼각형', 'Isosceles triangles', '밑각 정리, 수직이등분선, 직각삼각형의 합동 조건', 'Base angle theorem, perpendicular bisector, RHA/RHS congruence', ISOSCELES_GENERATORS),
  unit('triangle-circumcenter', '삼각형의 외심', 'Triangle circumcenter', '외심의 성질과 각도 활용', 'Circumcenter properties and angle applications', CIRCUMCENTER_GENERATORS),
  unit('triangle-incenter', '삼각형의 내심', 'Triangle incenter', '내심의 성질과 각도·접선의 길이 활용', 'Incenter properties, angle formula and tangent lengths', INCENTER_GENERATORS),
  unit('parallelogram-properties', '평행사변형', 'Parallelograms', '평행사변형의 성질, 되는 조건, 넓이', 'Parallelogram properties, conditions and area', PARALLELOGRAM_GENERATORS),
  unit('special-quadrilaterals', '여러 가지 사각형', 'Special quadrilaterals', '직사각형·마름모·정사각형·등변사다리꼴과 사각형 사이의 관계', 'Rectangles, rhombi, squares, isosceles trapezoids and their relationships', SPECIAL_QUADRILATERAL_GENERATORS),
];
