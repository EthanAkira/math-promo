// 중2-2 "도형의 닮음과 피타고라스 정리" (닮은 도형 / 평행선과 선분의 길이의 비 / 삼각형의 무게중심 / 피타고라스 정리).
// 참고: 중학수학 2-2 RPM 05~08장 — 구조와 풀이 방식만 추출했고, 교재 원문·이미지·출판사명은
// 코드나 문제에 그대로 노출하지 않는다 (PRD_2022개정_수학교육과정_카테고리 §2.4/§9 정책과 동일).
// 기존 geometryProblemEngine.js의 triangleSimilarity/triangleSimilarityRatios(2D 닮음비·넓이비·둘레비)와
// pythagoreanTheorem(기본 x 구하기·직사각형 대각선·간단한 직각삼각형 판별)은 이미 커버되어 있으므로
// 겹치지 않는 부분(닮음 조건 판별, 직각삼각형의 닮음, 입체도형의 닮음비, 평행선과 선분의 비,
// 삼각형의 무게중심, 심화 피타고라스 활용)만 새로 만든다.
import { profileText } from './geometryProfiles';

const ri = (random, min, max) => Math.floor(random() * (max - min + 1)) + min;
const pick = (random, values) => values[ri(random, 0, values.length - 1)];
const tx = (profile, ko, en) => profileText(profile, { ko, en, 'zh-TW': en, 'zh-HK': en });
const make = (prompt, answer, diagram, explanation, extra = {}) => ({ prompt, expression: '', answer: String(answer), answerSuffix: extra.answerSuffix || '', diagram, explanation, ...extra });
const choices = (ko, en = ko) => ko.map((label, index) => ({ value: String(index + 1), label, labelEn: en[index] || label }));
const MIDDLE_PROFILES = ['kr', 'international', 'amc', 'sg', 'tw', 'hk'];

// ---------------------------------------------------------------------------
// 05-4. 삼각형의 닮음 조건 (기존 congruence 판별과 같은 추상화 수준의 텍스트형 문제)
// ---------------------------------------------------------------------------

const SIMILARITY_SUFFICIENCY = [
  { ko: '세 쌍의 대응변의 길이의 비가 모두 같다.', en: 'All three pairs of corresponding sides have equal ratio.', sufficient: true },
  { ko: '두 쌍의 대응변의 길이의 비가 같고, 그 끼인각의 크기가 같다.', en: 'Two pairs of corresponding sides have equal ratio, with the included angle equal.', sufficient: true },
  { ko: '두 쌍의 대응각의 크기가 각각 같다.', en: 'Two pairs of corresponding angles are equal.', sufficient: true },
  { ko: '한 쌍의 대응변의 길이의 비만 같다.', en: 'Only one pair of corresponding sides has equal ratio.', sufficient: false },
  { ko: '한 쌍의 대응각의 크기만 같다.', en: 'Only one pair of corresponding angles is equal.', sufficient: false },
  { ko: '두 쌍의 대응변의 길이의 비가 같고, 끼인각이 아닌 다른 한 각이 같다.', en: 'Two pairs of corresponding sides have equal ratio, with a non-included angle equal.', sufficient: false },
];
function similaritySufficiency(random, profile) {
  const chosen = pick(random, SIMILARITY_SUFFICIENCY);
  return make(
    tx(profile, `두 삼각형에 대하여 다음 조건만으로 두 삼각형이 항상 닮음인지 판단하세요.\n"${chosen.ko}"`, `Decide whether the following condition alone always guarantees similarity.\n"${chosen.en}"`),
    chosen.sufficient ? 1 : 2,
    null,
    tx(profile, chosen.sufficient ? '닮음이 되는 세 가지 조건(SSS, SAS, AA) 중 하나입니다.' : '닮음 조건으로 충분하지 않습니다 (반례가 존재합니다).', chosen.sufficient ? 'This is one of the three similarity conditions (SSS, SAS, AA).' : 'This is not sufficient (a counterexample exists).'),
    { choices: choices(['항상 닮음이다', '항상 닮음인 것은 아니다'], ['Always similar', 'Not always similar']) },
  );
}

// 구체적인 수치로 SSS/SAS/AA 중 어느 조건에 해당하는지 판별한다.
function similarityConditionName(random, profile) {
  const scale = pick(random, [2, 3]);
  const mode = pick(random, ['SSS', 'SAS', 'AA']);
  const optionsKo = ['SSS 닮음', 'SAS 닮음', 'AA 닮음', '닮음이 아니다'];
  const optionsEn = ['SSS similarity', 'SAS similarity', 'AA similarity', 'Not similar'];
  const answerIndex = { SSS: 1, SAS: 2, AA: 3 }[mode];
  if (mode === 'SSS') {
    const [a, b, c] = pick(random, [[3, 4, 5], [4, 5, 6], [5, 6, 7], [2, 3, 4]]);
    return make(
      tx(profile, `△ABC와 △DEF에서 AB:DE=BC:EF=CA:FD=${scale}:1이고, AB=${a * scale}, BC=${b * scale}, CA=${c * scale}, DE=${a}, EF=${b}, FD=${c}일 때, 두 삼각형이 닮음인 조건을 고르세요.`, `In △ABC and △DEF, AB:DE=BC:EF=CA:FD=${scale}:1 with AB=${a * scale}, BC=${b * scale}, CA=${c * scale}, DE=${a}, EF=${b}, FD=${c}. Choose the similarity condition.`),
      answerIndex,
      null,
      tx(profile, '세 쌍의 대응변의 길이의 비가 모두 같으므로 SSS 닮음입니다.', 'All three pairs of corresponding sides share the same ratio, so it is SSS similarity.'),
      { choices: choices(optionsKo, optionsEn) },
    );
  }
  if (mode === 'SAS') {
    const a = ri(random, 3, 6); const b = ri(random, 3, 6); const angle = pick(random, [40, 50, 60, 70, 80]);
    return make(
      tx(profile, `△ABC와 △DEF에서 AB=${a * scale}, AC=${b * scale}, ∠A=${angle}°이고 DE=${a}, DF=${b}, ∠D=${angle}°일 때, 두 삼각형이 닮음인 조건을 고르세요.`, `In △ABC and △DEF, AB=${a * scale}, AC=${b * scale}, ∠A=${angle}° and DE=${a}, DF=${b}, ∠D=${angle}°. Choose the similarity condition.`),
      answerIndex,
      null,
      tx(profile, '두 쌍의 대응변의 길이의 비가 같고 그 끼인각의 크기가 같으므로 SAS 닮음입니다.', 'Two pairs of corresponding sides share the same ratio with an equal included angle, so it is SAS similarity.'),
      { choices: choices(optionsKo, optionsEn) },
    );
  }
  const angleA = pick(random, [50, 60, 70, 80]); const angleB = pick(random, [40, 45, 55, 65]);
  return make(
    tx(profile, `△ABC와 △DEF에서 ∠A=∠D=${angleA}°, ∠B=∠E=${angleB}°일 때, 두 삼각형이 닮음인 조건을 고르세요.`, `In △ABC and △DEF, ∠A=∠D=${angleA}°, ∠B=∠E=${angleB}°. Choose the similarity condition.`),
    answerIndex,
    null,
    tx(profile, '두 쌍의 대응각의 크기가 각각 같으므로 AA 닮음입니다.', 'Two pairs of corresponding angles are equal, so it is AA similarity.'),
    { choices: choices(optionsKo, optionsEn) },
  );
}

// ---------------------------------------------------------------------------
// 05-5. 직각삼각형의 닮음 (빗변에 내린 수선의 발을 이용한 세 변의 관계, AD²=BD·DC 등)
// ---------------------------------------------------------------------------

const ALTITUDE_TRIPLES = [{ p: 3, q: 4, r: 5 }, { p: 6, q: 8, r: 10 }, { p: 5, q: 12, r: 13 }];
function rightTriangleAltitudeRelation(random, profile) {
  const { p, q, r } = pick(random, ALTITUDE_TRIPLES);
  const BD = p * p; const DC = q * q; const AD = p * q; const AB = p * r; const AC = q * r; const BC = r * r;
  const mode = pick(random, ['altitude', 'legAB', 'legAC']);
  if (mode === 'altitude') {
    return make(
      tx(profile, `∠A=90°인 직각삼각형 ABC의 꼭짓점 A에서 BC에 내린 수선의 발을 D라 하자. BD=${BD}, DC=${DC}일 때, AD(=x)의 길이를 구하세요.`, `In right triangle ABC (∠A=90°), D is the foot of the perpendicular from A to BC. BD=${BD}, DC=${DC}. Find AD (=x).`),
      AD,
      { kind: 'right-triangle-altitude', labels: { BD: { text: `${BD}`, isTarget: false }, DC: { text: `${DC}`, isTarget: false }, target: { isTarget: true } } },
      tx(profile, `직각삼각형에서 빗변에 내린 수선의 성질에 의해 AD²=BD×DC=${BD}×${DC}=${AD * AD}이므로 AD=${AD}입니다.`, `The altitude relation AD²=BD×DC=${BD}×${DC}=${AD * AD} gives AD=${AD}.`),
      { answerSuffix: 'cm' },
    );
  }
  if (mode === 'legAB') {
    return make(
      tx(profile, `∠A=90°인 직각삼각형 ABC의 꼭짓점 A에서 BC에 내린 수선의 발을 D라 하자. BD=${BD}, BC=${BC}일 때, AB(=x)의 길이를 구하세요.`, `In right triangle ABC (∠A=90°), D is the foot of the perpendicular from A to BC. BD=${BD}, BC=${BC}. Find AB (=x).`),
      AB,
      { kind: 'right-triangle-altitude', labels: { BD: { text: `${BD}`, isTarget: false }, BC: { text: `${BC}`, isTarget: false }, AB: { text: 'x', isTarget: true } } },
      tx(profile, `AB²=BD×BC=${BD}×${BC}=${AB * AB}이므로 AB=${AB}입니다.`, `AB²=BD×BC=${BD}×${BC}=${AB * AB}, so AB=${AB}.`),
      { answerSuffix: 'cm' },
    );
  }
  return make(
    tx(profile, `∠A=90°인 직각삼각형 ABC의 꼭짓점 A에서 BC에 내린 수선의 발을 D라 하자. DC=${DC}, BC=${BC}일 때, AC(=x)의 길이를 구하세요.`, `In right triangle ABC (∠A=90°), D is the foot of the perpendicular from A to BC. DC=${DC}, BC=${BC}. Find AC (=x).`),
    AC,
    { kind: 'right-triangle-altitude', labels: { DC: { text: `${DC}`, isTarget: false }, BC: { text: `${BC}`, isTarget: false }, AC: { text: 'x', isTarget: true } } },
    tx(profile, `AC²=DC×BC=${DC}×${BC}=${AC * AC}이므로 AC=${AC}입니다.`, `AC²=DC×BC=${DC}×${BC}=${AC * AC}, so AC=${AC}.`),
    { answerSuffix: 'cm' },
  );
}

// 직각삼각형의 닮음 관계: △ABC∽△DBA∽△DAC (AA 닮음) 여부 확인 (텍스트형).
function rightTriangleSimilarityChain(random, profile) {
  const target = pick(random, ['DBA', 'DAC', 'both']);
  const optionsKo = ['△DBA', '△DAC', '△DBA와 △DAC 모두'];
  const optionsEn = ['△DBA', '△DAC', 'Both △DBA and △DAC'];
  const answer = target === 'DBA' ? 1 : target === 'DAC' ? 2 : 3;
  return make(
    tx(profile, '∠A=90°인 직각삼각형 ABC에서 꼭짓점 A에서 BC에 내린 수선의 발을 D라 할 때, △ABC와 닮음인 삼각형을 모두 고르세요.', 'In right triangle ABC (∠A=90°) with D the foot of the altitude from A to BC, choose all triangles similar to △ABC.'),
    3,
    null,
    tx(profile, '공통각과 직각을 이용한 AA 닮음에 의해 △ABC∽△DBA∽△DAC이므로 두 삼각형 모두 닮음입니다.', 'By AA similarity using the shared angle and the right angle, △ABC∽△DBA∽△DAC, so both are similar to △ABC.'),
    { choices: choices(optionsKo, optionsEn) },
  );
}

// ---------------------------------------------------------------------------
// 05-1~05-3. 닮은 입체도형의 겉넓이의 비·부피의 비 (기존 2D 삼각형 닮음비 문제와 겹치지 않는 3D 부분)
// ---------------------------------------------------------------------------

function similarSolidsRatio(random, profile) {
  const scale = pick(random, [2, 3]);
  const solidKo = pick(random, ['원기둥', '삼각기둥', '직육면체']);
  const solidEn = { 원기둥: 'cylinders', 삼각기둥: 'triangular prisms', 직육면체: 'rectangular boxes' }[solidKo];
  const mode = pick(random, ['ratio', 'area', 'volume']);
  if (mode === 'ratio') {
    const askArea = random() < 0.5;
    const answer = askArea ? `${scale * scale}:1` : `${scale ** 3}:1`;
    return make(
      tx(profile, `닮음비가 ${scale}:1인 두 ${solidKo} A, B가 있다. A와 B의 ${askArea ? '겉넓이의 비' : '부피의 비'}를 구하세요.`, `Two similar ${solidEn} A and B have a scale factor of ${scale}:1. Find the ratio of their ${askArea ? 'surface areas' : 'volumes'}.`),
      answer,
      null,
      tx(profile, askArea ? `닮음비가 ${scale}:1인 도형의 겉넓이의 비는 닮음비의 제곱이므로 ${scale}²:1²=${answer}입니다.` : `닮음비가 ${scale}:1인 도형의 부피의 비는 닮음비의 세제곱이므로 ${scale}³:1³=${answer}입니다.`, askArea ? `The surface-area ratio is the square of the scale factor: ${scale}²:1²=${answer}.` : `The volume ratio is the cube of the scale factor: ${scale}³:1³=${answer}.`),
    );
  }
  const base = ri(random, 2, 12);
  if (mode === 'area') {
    const smallArea = base; const largeArea = base * scale * scale; const askLarge = random() < 0.5;
    const givenLabel = askLarge ? 'A' : 'B'; const targetLabel = askLarge ? 'B' : 'A';
    const givenValue = askLarge ? smallArea : largeArea; const answer = askLarge ? largeArea : smallArea;
    return make(
      tx(profile, `닮음비가 ${scale}:1인 두 ${solidKo} A, B의 겉넓이의 비가 A:B=1:${scale * scale}이고, ${givenLabel}의 겉넓이가 ${givenValue}cm²일 때, ${targetLabel}의 겉넓이(=x)를 구하세요.`, `Similar ${solidEn} A and B have surface-area ratio A:B=1:${scale * scale}. ${givenLabel}'s surface area is ${givenValue} cm². Find ${targetLabel}'s surface area (=x).`),
      answer,
      null,
      tx(profile, `겉넓이의 비는 닮음비의 제곱이므로 A:B=1:${scale * scale}이고, 이 비를 이용하면 x=${answer}입니다.`, `The surface-area ratio is the square of the scale factor (1:${scale * scale}), giving x=${answer}.`),
      { answerSuffix: 'cm²' },
    );
  }
  const smallVolume = base; const largeVolume = base * scale ** 3; const askLarge = random() < 0.5;
  const givenLabel = askLarge ? 'A' : 'B'; const targetLabel = askLarge ? 'B' : 'A';
  const givenValue = askLarge ? smallVolume : largeVolume; const answer = askLarge ? largeVolume : smallVolume;
  return make(
    tx(profile, `닮음비가 ${scale}:1인 두 ${solidKo} A, B의 부피의 비가 A:B=1:${scale ** 3}이고, ${givenLabel}의 부피가 ${givenValue}cm³일 때, ${targetLabel}의 부피(=x)를 구하세요.`, `Similar ${solidEn} A and B have volume ratio A:B=1:${scale ** 3}. ${givenLabel}'s volume is ${givenValue} cm³. Find ${targetLabel}'s volume (=x).`),
    answer,
    null,
    tx(profile, `부피의 비는 닮음비의 세제곱이므로 A:B=1:${scale ** 3}이고, 이 비를 이용하면 x=${answer}입니다.`, `The volume ratio is the cube of the scale factor (1:${scale ** 3}), giving x=${answer}.`),
    { answerSuffix: 'cm³' },
  );
}

// ---------------------------------------------------------------------------
// 06-1 / 06-3. 삼각형에서 평행선과 선분의 길이의 비, 세 평행선 사이의 선분의 길이의 비
// ---------------------------------------------------------------------------

function triangleParallelRatio(random, profile) {
  const AD = ri(random, 2, 6); const DBk = ri(random, 1, 4); const DB = DBk;
  const AE = ri(random, 2, 6);
  const EC = (AE * DB) / AD;
  if (!Number.isInteger(EC) || EC <= 0) return triangleParallelRatio(random, profile);
  const askEC = random() < 0.5;
  if (askEC) {
    return make(
      tx(profile, `△ABC에서 점 D, E는 각각 AB, AC 위의 점이고 DE∥BC이다. AD=${AD}, DB=${DB}, AE=${AE}일 때, EC(=x)의 길이를 구하세요.`, `In △ABC, D and E lie on AB and AC with DE∥BC. AD=${AD}, DB=${DB}, AE=${AE}. Find EC (=x).`),
      EC,
      { kind: 'triangle-parallel-segment', ratio: AD / (AD + DB), labels: { AD: { text: `${AD}`, isTarget: false }, DB: { text: `${DB}`, isTarget: false }, AE: { text: `${AE}`, isTarget: false }, EC: { text: 'x', isTarget: true } } },
      tx(profile, `DE∥BC이므로 AD:DB=AE:EC이고, ${AD}:${DB}=${AE}:x에서 x=${AE}×${DB}÷${AD}=${EC}입니다.`, `Since DE∥BC, AD:DB=AE:EC. Solving ${AD}:${DB}=${AE}:x gives x=${EC}.`),
    );
  }
  const BC = ri(random, 6, 15); const DE = (BC * AD) / (AD + DB);
  if (!Number.isInteger(DE) || DE <= 0) return triangleParallelRatio(random, profile);
  return make(
    tx(profile, `△ABC에서 점 D, E는 각각 AB, AC 위의 점이고 DE∥BC이다. AD=${AD}, AB=${AD + DB}, BC=${BC}일 때, DE(=x)의 길이를 구하세요.`, `In △ABC, D and E lie on AB and AC with DE∥BC. AD=${AD}, AB=${AD + DB}, BC=${BC}. Find DE (=x).`),
    DE,
    { kind: 'triangle-parallel-segment', ratio: AD / (AD + DB), labels: { AD: { text: `${AD}`, isTarget: false }, BC: { text: `${BC}`, isTarget: false }, DE: { text: 'x', isTarget: true } } },
    tx(profile, `DE∥BC이므로 AD:AB=DE:BC이고, ${AD}:${AD + DB}=x:${BC}에서 x=${BC}×${AD}÷${AD + DB}=${DE}입니다.`, `Since DE∥BC, AD:AB=DE:BC. Solving ${AD}:${AD + DB}=x:${BC} gives x=${DE}.`),
  );
}

function parallelLinesTransversalRatio(random, profile) {
  const p = ri(random, 2, 8); const q = ri(random, 2, 8); const r = ri(random, 2, 8);
  const x = (q * r) / p;
  if (!Number.isInteger(x) || x <= 0) return parallelLinesTransversalRatio(random, profile);
  return make(
    tx(profile, `l∥m∥n일 때, 그림에서 p=${p}, q=${q}, r=${r}이다. x의 값을 구하세요.`, `Given l∥m∥n with p=${p}, q=${q}, r=${r} as shown, find x.`),
    x,
    { kind: 'parallel-lines-transversal', labels: { p: { text: `${p}`, isTarget: false }, q: { text: `${q}`, isTarget: false }, r: { text: `${r}`, isTarget: false }, x: { text: 'x', isTarget: true } } },
    tx(profile, `평행선 사이에 있는 선분의 길이의 비는 같으므로 p:q=r:x이고, ${p}:${q}=${r}:x에서 x=${q}×${r}÷${p}=${x}입니다.`, `Parallel lines cut transversals proportionally, so p:q=r:x. Solving ${p}:${q}=${r}:x gives x=${x}.`),
  );
}

// ---------------------------------------------------------------------------
// 06-2. 삼각형의 각의 이등분선 (내각의 이등분선, 외각의 이등분선)
// ---------------------------------------------------------------------------

function angleBisectorTheorem(random, profile) {
  const external = random() < 0.5;
  if (!external) {
    const AB = ri(random, 4, 10); const AC = ri(random, 4, 10);
    const BD = ri(random, 2, 8);
    const DC = (BD * AC) / AB;
    if (!Number.isInteger(DC) || DC <= 0) return angleBisectorTheorem(random, profile);
    return make(
      tx(profile, `△ABC에서 AD가 ∠A의 이등분선이고 D는 BC 위의 점이다. AB=${AB}, AC=${AC}, BD=${BD}일 때, DC(=x)의 길이를 구하세요.`, `In △ABC, AD bisects ∠A with D on BC. AB=${AB}, AC=${AC}, BD=${BD}. Find DC (=x).`),
      DC,
      null,
      tx(profile, `내각의 이등분선의 성질에 의해 AB:AC=BD:DC이므로 ${AB}:${AC}=${BD}:x에서 x=${AC}×${BD}÷${AB}=${DC}입니다.`, `The angle bisector theorem gives AB:AC=BD:DC. Solving ${AB}:${AC}=${BD}:x gives x=${DC}.`),
      { answerSuffix: 'cm' },
    );
  }
  // 외각의 이등분선: D는 BC의 연장선 위에 있고 BD:CD=AB:AC, BD-CD=BC.
  // AB=m, AC=n(m>n), BC=k(m-n)이 되도록 잡으면 CD=kn, BD=km으로 항상 깔끔한 정수가 된다.
  const n = ri(random, 3, 6); const m = n + ri(random, 1, 4); const k = ri(random, 2, 5);
  const BC = k * (m - n); const CD = k * n; const BD = k * m;
  const askBD = random() < 0.5;
  const prompt = tx(profile, `△ABC에서 AB≠AC이고 ∠A의 외각의 이등분선이 직선 BC와 만나는 점을 D라 하자(D는 BC의 연장선 위에 있다). AB=${m}, AC=${n}, BC=${BC}일 때, ${askBD ? 'BD' : 'CD'}(=x)의 길이를 구하세요.`, `In △ABC (AB≠AC), the external bisector of ∠A meets line BC at D on the extension of BC. AB=${m}, AC=${n}, BC=${BC}. Find ${askBD ? 'BD' : 'CD'} (=x).`);
  return make(
    prompt,
    askBD ? BD : CD,
    null,
    tx(profile, `외각의 이등분선의 성질에 의해 BD:CD=AB:AC=${m}:${n}이고 BD−CD=BC=${BC}이므로 연립하면 CD=${CD}, BD=${BD}이고 x=${askBD ? BD : CD}입니다.`, `The external bisector theorem gives BD:CD=AB:AC=${m}:${n} with BD−CD=BC=${BC}; solving gives CD=${CD}, BD=${BD}, so x=${askBD ? BD : CD}.`),
    { answerSuffix: 'cm' },
  );
}

// ---------------------------------------------------------------------------
// 06-4/07-2. 사다리꼴의 두 변의 중점을 연결한 선분의 성질 (AD∥BC, MN=(AD+BC)/2)
// ---------------------------------------------------------------------------

function trapezoidMidsegment(random, profile) {
  const AD = ri(random, 3, 10) * 2; const BC = ri(random, AD / 2 + 1, 20) * 2;
  const MN = (AD + BC) / 2;
  const target = pick(random, ['MN', 'BC']);
  if (target === 'MN') {
    return make(
      tx(profile, `사다리꼴 ABCD에서 AD∥BC이고 M, N은 각각 AB, DC의 중점이다. AD=${AD}, BC=${BC}일 때, MN(=x)의 길이를 구하세요.`, `In trapezoid ABCD with AD∥BC, M and N are the midpoints of AB and DC. AD=${AD}, BC=${BC}. Find MN (=x).`),
      MN,
      { kind: 'trapezoid-midsegment', labels: { AD: { text: `${AD}`, isTarget: false }, BC: { text: `${BC}`, isTarget: false }, MN: { text: 'x', isTarget: true } } },
      tx(profile, `사다리꼴의 두 변의 중점을 연결한 선분의 길이는 두 밑변의 길이의 합의 절반이므로 x=(${AD}+${BC})÷2=${MN}입니다.`, `The midsegment of a trapezoid equals half the sum of the parallel sides, so x=(${AD}+${BC})÷2=${MN}.`),
      { answerSuffix: 'cm' },
    );
  }
  return make(
    tx(profile, `사다리꼴 ABCD에서 AD∥BC이고 M, N은 각각 AB, DC의 중점이다. AD=${AD}, MN=${MN}일 때, BC(=x)의 길이를 구하세요.`, `In trapezoid ABCD with AD∥BC, M and N are the midpoints of AB and DC. AD=${AD}, MN=${MN}. Find BC (=x).`),
    BC,
    { kind: 'trapezoid-midsegment', labels: { AD: { text: `${AD}`, isTarget: false }, MN: { text: `${MN}`, isTarget: false }, BC: { text: 'x', isTarget: true } } },
    tx(profile, `MN=(AD+BC)÷2이므로 ${MN}=(${AD}+x)÷2에서 x=${MN * 2}−${AD}=${BC}입니다.`, `Since MN=(AD+BC)÷2, solving ${MN}=(${AD}+x)÷2 gives x=${BC}.`),
    { answerSuffix: 'cm' },
  );
}

// ---------------------------------------------------------------------------
// 07-1. 삼각형의 두 변의 중점을 연결한 선분의 성질 (MN∥BC, MN=BC/2)
// ---------------------------------------------------------------------------

function triangleMidsegment(random, profile) {
  const BC = ri(random, 4, 14) * 2; const MN = BC / 2;
  const askMN = random() < 0.5;
  if (askMN) {
    return make(
      tx(profile, `△ABC에서 M, N은 각각 AB, AC의 중점이다. BC=${BC}일 때, MN(=x)의 길이를 구하세요.`, `In △ABC, M and N are the midpoints of AB and AC. BC=${BC}. Find MN (=x).`),
      MN,
      { kind: 'triangle-parallel-segment', ratio: 0.5, labels: { BC: { text: `${BC}`, isTarget: false }, DE: { text: 'x', isTarget: true } } },
      tx(profile, `삼각형의 두 변의 중점을 연결한 선분의 길이는 나머지 한 변의 길이의 절반이므로 x=${BC}÷2=${MN}입니다.`, `The segment joining two midpoints is half the third side, so x=${BC}÷2=${MN}.`),
      { answerSuffix: 'cm' },
    );
  }
  return make(
    tx(profile, `△ABC에서 M, N은 각각 AB, AC의 중점이다. MN=${MN}일 때, BC(=x)의 길이를 구하세요.`, `In △ABC, M and N are the midpoints of AB and AC. MN=${MN}. Find BC (=x).`),
    BC,
    { kind: 'triangle-parallel-segment', ratio: 0.5, labels: { DE: { text: `${MN}`, isTarget: false }, BC: { text: 'x', isTarget: true } } },
    tx(profile, `MN=BC÷2이므로 x=BC=${MN}×2=${BC}입니다.`, `Since MN=BC÷2, x=BC=${MN}×2=${BC}.`),
    { answerSuffix: 'cm' },
  );
}

// ---------------------------------------------------------------------------
// 07-3~07-5. 삼각형의 중선(넓이 이등분), 무게중심(2:1), 무게중심과 넓이 비
// ---------------------------------------------------------------------------

function triangleMedianArea(random, profile) {
  const half = ri(random, 4, 20);
  const askWhole = random() < 0.5;
  if (askWhole) {
    return make(
      tx(profile, `△ABC에서 AD가 중선일 때, △ABD의 넓이가 ${half}cm²이다. △ABC의 넓이(=x)를 구하세요.`, `AD is a median of △ABC. The area of △ABD is ${half} cm². Find the area of △ABC (=x).`),
      half * 2,
      { kind: 'triangle-centroid', highlight: 'GAB' },
      tx(profile, `중선은 삼각형의 넓이를 이등분하므로 △ABC=2×△ABD=${half * 2}입니다.`, `A median bisects the triangle's area, so △ABC=2×△ABD=${half * 2}.`),
      { answerSuffix: 'cm²' },
    );
  }
  return make(
    tx(profile, `△ABC에서 AD가 중선일 때, △ABC의 넓이가 ${half * 2}cm²이다. △ABD의 넓이(=x)를 구하세요.`, `AD is a median of △ABC. The area of △ABC is ${half * 2} cm². Find the area of △ABD (=x).`),
    half,
    { kind: 'triangle-centroid', highlight: 'GAB' },
    tx(profile, `중선은 삼각형의 넓이를 이등분하므로 x=△ABC÷2=${half}입니다.`, `A median bisects the triangle's area, so x=△ABC÷2=${half}.`),
    { answerSuffix: 'cm²' },
  );
}

function centroidMedianRatio(random, profile) {
  const short = ri(random, 2, 12);
  const askLong = random() < 0.5;
  if (askLong) {
    return make(
      tx(profile, `점 G가 △ABC의 무게중심이고 중선 AM 위에 있다. GM=${short}cm일 때, AG(=x)의 길이를 구하세요.`, `G is the centroid of △ABC on median AM. GM=${short} cm. Find AG (=x).`),
      short * 2,
      { kind: 'triangle-centroid', labels: { GM: { text: `${short}`, isTarget: false }, AG: { text: 'x', isTarget: true } } },
      tx(profile, `무게중심은 중선을 꼭짓점으로부터 2:1로 나누므로 AG=2×GM=${short * 2}입니다.`, `The centroid divides a median 2:1 from the vertex, so AG=2×GM=${short * 2}.`),
      { answerSuffix: 'cm' },
    );
  }
  return make(
    tx(profile, `점 G가 △ABC의 무게중심이고 중선 AM 위에 있다. AM=${short * 3}cm일 때, AG(=x)의 길이를 구하세요.`, `G is the centroid of △ABC on median AM. AM=${short * 3} cm. Find AG (=x).`),
    short * 2,
    { kind: 'triangle-centroid', labels: { AG: { text: 'x', isTarget: true } } },
    tx(profile, `무게중심은 중선을 꼭짓점에서부터 2:1로 나누므로 AG=AM×⅔=${short * 3}×⅔=${short * 2}입니다.`, `The centroid divides the median 2:1 from the vertex, so AG=AM×2/3=${short * 2}.`),
    { answerSuffix: 'cm' },
  );
}

function centroidAreaRatio(random, profile) {
  const whole = ri(random, 2, 10) * 6;
  const mode = pick(random, ['third', 'sixth']);
  if (mode === 'third') {
    return make(
      tx(profile, `점 G가 △ABC의 무게중심이고 △ABC의 넓이가 ${whole}cm²일 때, △GAB의 넓이(=x)를 구하세요.`, `G is the centroid of △ABC, with area ${whole} cm². Find the area of △GAB (=x).`),
      whole / 3,
      { kind: 'triangle-centroid', highlight: 'GAB' },
      tx(profile, `무게중심은 삼각형을 넓이가 같은 세 삼각형 GAB, GBC, GCA로 나누므로 x=${whole}÷3=${whole / 3}입니다.`, `The centroid splits the triangle into three equal-area triangles GAB, GBC, GCA, so x=${whole}÷3=${whole / 3}.`),
      { answerSuffix: 'cm²' },
    );
  }
  const sixth = whole / 6;
  return make(
    tx(profile, `점 G가 △ABC의 무게중심이고 △ABC의 넓이가 ${whole}cm²일 때, 세 중선으로 나뉜 6개의 작은 삼각형 중 하나의 넓이(=x)를 구하세요.`, `G is the centroid of △ABC, with area ${whole} cm². The three medians divide it into 6 small triangles. Find the area of one of them (=x).`),
    sixth,
    { kind: 'triangle-centroid', highlight: 'GAB' },
    tx(profile, `세 중선으로 나뉜 6개의 작은 삼각형은 넓이가 모두 같으므로 x=${whole}÷6=${sixth}입니다.`, `The six small triangles formed by the three medians all have equal area, so x=${whole}÷6=${sixth}.`),
    { answerSuffix: 'cm²' },
  );
}

// ---------------------------------------------------------------------------
// 08-3~08-5. 삼각형의 변의 길이와 각의 크기 사이의 관계, 사각형의 대각선 관계, 세 반원 사이의 관계
// ---------------------------------------------------------------------------

function triangleClassifyBySides(random, profile) {
  const kind = pick(random, ['acute', 'right', 'obtuse']);
  const base = pick(random, [
    { acute: [5, 6, 7], right: [3, 4, 5], obtuse: [4, 5, 7] },
    { acute: [6, 7, 8], right: [6, 8, 10], obtuse: [5, 7, 9] },
    { acute: [7, 8, 9], right: [9, 12, 15], obtuse: [4, 6, 8] },
  ]);
  const [a, b, c] = base[kind];
  const lhs = a * a + b * b; const rhs = c * c;
  const optionsKo = ['예각삼각형', '직각삼각형', '둔각삼각형'];
  const optionsEn = ['acute triangle', 'right triangle', 'obtuse triangle'];
  const answer = { acute: 1, right: 2, obtuse: 3 }[kind];
  const relation = kind === 'acute' ? '>' : kind === 'right' ? '=' : '<';
  return make(
    tx(profile, `세 변의 길이가 ${a}, ${b}, ${c}인 삼각형은 어떤 삼각형인지 고르세요.`, `Classify the triangle with side lengths ${a}, ${b}, ${c}.`),
    answer,
    null,
    tx(profile, `가장 긴 변의 제곱과 나머지 두 변의 제곱의 합을 비교하면 ${a}²+${b}²=${lhs}${relation}${c}²=${rhs}이므로 ${optionsKo[answer - 1]}입니다.`, `Comparing ${a}²+${b}²=${lhs} with ${c}²=${rhs} (${lhs}${relation}${rhs}) gives ${answer === 1 ? 'an' : 'a'} ${optionsEn[answer - 1]}.`),
    { choices: choices(optionsKo, optionsEn) },
  );
}

// 두 대각선이 직교하는 사각형에서 AB²+CD²=BC²+AD² (텍스트형 응용)
// [AB, CD, BC, AD] quadruples satisfying AB²+CD²=BC²+AD² (perpendicular-diagonal quadrilateral relation).
const PERPENDICULAR_DIAGONAL_QUADRUPLES = [[1, 8, 4, 7], [2, 9, 6, 7], [1, 7, 5, 5], [2, 11, 10, 5], [4, 7, 1, 8], [6, 7, 2, 9]];
function perpendicularDiagonalsRelation(random, profile) {
  const quad = pick(random, PERPENDICULAR_DIAGONAL_QUADRUPLES);
  const keys = ['AB', 'CD', 'BC', 'AD'];
  const targetIndex = ri(random, 0, 3);
  const known = keys.map((key, index) => (index === targetIndex ? null : `${key}=${quad[index]}`)).filter(Boolean).join(', ');
  const target = keys[targetIndex]; const answer = quad[targetIndex];
  const [AB, CD, BC, AD] = quad;
  return make(
    tx(profile, `□ABCD에서 두 대각선 AC, BD가 서로 수직으로 만난다. ${known}일 때, ${target}(=x)의 길이를 구하세요.`, `In quadrilateral ABCD, diagonals AC and BD are perpendicular. ${known}. Find ${target} (=x).`),
    answer,
    null,
    tx(profile, `두 대각선이 직교하는 사각형에서는 AB²+CD²=BC²+AD²이 성립합니다. ${AB}²+${CD}²=${AB * AB + CD * CD}=${BC}²+${AD}²이므로 x=${answer}입니다.`, `For a quadrilateral with perpendicular diagonals, AB²+CD²=BC²+AD². Since ${AB}²+${CD}²=${AB * AB + CD * CD}=${BC}²+${AD}², x=${answer}.`),
    { answerSuffix: 'cm' },
  );
}

// 직각삼각형의 세 변을 지름으로 하는 반원 사이의 관계: 두 다리 위의 반원의 넓이의 합 = 빗변 위의 반원의 넓이
function rightTriangleSemicircleAreas(random, profile) {
  const legAreaA = ri(random, 6, 30); const legAreaB = ri(random, 6, 30);
  const target = pick(random, ['hyp', 'legA', 'legB']);
  const hypArea = legAreaA + legAreaB;
  if (target === 'hyp') {
    return make(
      tx(profile, `∠C=90°인 직각삼각형 ABC의 세 변을 각각 지름으로 하는 반원을 그렸다. 변 BC, CA 위의 반원의 넓이가 각각 ${legAreaA}cm², ${legAreaB}cm²일 때, 빗변 AB 위의 반원의 넓이(=x)를 구하세요.`, `Semicircles are drawn on each side of right triangle ABC (∠C=90°) as diameter. The semicircles on BC and CA have areas ${legAreaA} cm² and ${legAreaB} cm². Find the area of the semicircle on AB (=x).`),
      hypArea,
      { kind: 'right-triangle-semicircles', labels: { BC: { text: `${legAreaA}`, isTarget: false }, CA: { text: `${legAreaB}`, isTarget: false }, AB: { text: 'x', isTarget: true } } },
      tx(profile, `직각삼각형의 두 직각변 위의 반원의 넓이의 합은 빗변 위의 반원의 넓이와 같으므로 x=${legAreaA}+${legAreaB}=${hypArea}입니다.`, `The sum of the semicircle areas on the two legs equals the semicircle area on the hypotenuse, so x=${legAreaA}+${legAreaB}=${hypArea}.`),
      { answerSuffix: 'cm²' },
    );
  }
  const known = target === 'legA' ? legAreaB : legAreaA;
  const answer = target === 'legA' ? legAreaA : legAreaB;
  return make(
    tx(profile, `∠C=90°인 직각삼각형 ABC의 세 변을 각각 지름으로 하는 반원을 그렸다. 빗변 AB 위의 반원의 넓이가 ${hypArea}cm², ${target === 'legA' ? '변 CA' : '변 BC'} 위의 반원의 넓이가 ${known}cm²일 때, ${target === 'legA' ? '변 BC' : '변 CA'} 위의 반원의 넓이(=x)를 구하세요.`, `Semicircles are drawn on each side of right triangle ABC (∠C=90°) as diameter. The semicircle on AB has area ${hypArea} cm² and the semicircle on ${target === 'legA' ? 'CA' : 'BC'} has area ${known} cm². Find the area of the semicircle on ${target === 'legA' ? 'BC' : 'CA'} (=x).`),
    answer,
    { kind: 'right-triangle-semicircles', labels: { AB: { text: `${hypArea}`, isTarget: false }, [target === 'legA' ? 'CA' : 'BC']: { text: `${known}`, isTarget: false }, [target === 'legA' ? 'BC' : 'CA']: { text: 'x', isTarget: true } } },
    tx(profile, `두 직각변 위의 반원의 넓이의 합이 빗변 위의 반원의 넓이와 같으므로 x=${hypArea}−${known}=${answer}입니다.`, `Since the two leg semicircle areas sum to the hypotenuse semicircle area, x=${hypArea}−${known}=${answer}.`),
    { answerSuffix: 'cm²' },
  );
}

const SIMILARITY_CONDITION_GENERATORS = [similaritySufficiency, similarityConditionName, similarityConditionName];
const RIGHT_TRIANGLE_SIMILARITY_GENERATORS = [rightTriangleAltitudeRelation, rightTriangleAltitudeRelation, rightTriangleSimilarityChain];
const SIMILAR_SOLIDS_GENERATORS = [similarSolidsRatio];
const PARALLEL_LINE_RATIO_GENERATORS = [triangleParallelRatio, parallelLinesTransversalRatio, angleBisectorTheorem];
const MIDSEGMENT_GENERATORS = [triangleMidsegment, trapezoidMidsegment];
const CENTROID_GENERATORS = [triangleMedianArea, centroidMedianRatio, centroidAreaRatio];
const PYTHAGOREAN_APPLICATION_GENERATORS = [triangleClassifyBySides, perpendicularDiagonalsRelation, rightTriangleSemicircleAreas];

const unit = (id, ko, en, koDescription, enDescription, generators) => ({
  id,
  labels: { ko, en },
  descriptions: { ko: koDescription, en: enDescription },
  profiles: MIDDLE_PROFILES,
  make: (random, profile) => pick(random, generators)(random, profile),
});

export const TRIANGLE_SIMILARITY_UNITS = [
  unit('similarity-conditions', '삼각형의 닮음 조건', 'Triangle similarity conditions', 'SSS·SAS·AA 닮음 조건 판별하기', 'Identify SSS, SAS and AA similarity conditions', SIMILARITY_CONDITION_GENERATORS),
  unit('right-triangle-similarity', '직각삼각형의 닮음', 'Right-triangle similarity', '빗변에 내린 수선을 이용한 세 변의 관계 구하기', 'Use the altitude to the hypotenuse to relate the three sides', RIGHT_TRIANGLE_SIMILARITY_GENERATORS),
  unit('similar-solids-ratio', '닮은 도형에서 넓이·부피의 비', 'Similar solids: area & volume ratio', '닮은 입체도형의 겉넓이의 비와 부피의 비 구하기', 'Find surface-area and volume ratios of similar solids', SIMILAR_SOLIDS_GENERATORS),
  unit('parallel-line-segment-ratio', '평행선과 선분의 길이의 비', 'Parallel lines and segment ratios', '삼각형에서 평행선, 세 평행선, 각의 이등분선을 이용한 선분의 비 구하기', 'Use parallel lines, three parallel lines and angle bisectors to find segment ratios', PARALLEL_LINE_RATIO_GENERATORS),
  unit('midsegment-theorem', '삼각형과 사다리꼴의 중점연결정리', 'Midsegment theorem', '삼각형과 사다리꼴에서 두 변의 중점을 연결한 선분의 성질 구하기', 'Use the midsegment theorem in triangles and trapezoids', MIDSEGMENT_GENERATORS),
  unit('triangle-centroid-median', '삼각형의 무게중심', 'Triangle centroid', '중선, 무게중심의 성질과 무게중심에 의한 넓이의 비 구하기', 'Use medians, the centroid, and centroid area ratios', CENTROID_GENERATORS),
  unit('pythagorean-applications', '피타고라스 정리의 활용', 'Pythagorean theorem applications', '변의 길이로 삼각형 분류하기, 대각선의 관계, 세 반원 사이의 넓이 관계 구하기', 'Classify triangles by side length, use perpendicular-diagonal relations and semicircle area relations', PYTHAGOREAN_APPLICATION_GENERATORS),
];
