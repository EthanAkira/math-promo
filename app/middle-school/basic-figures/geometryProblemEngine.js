import { profileText } from './geometryProfiles';

function randomInt(random, min, max) { return Math.floor(random() * (max - min + 1)) + min; }
function pick(random, values) { return values[randomInt(random, 0, values.length - 1)]; }
function text(profile, values) { return profileText(profile, values); }

function item(prompt, answer, diagram, extra = {}) {
  return { prompt, expression: '', answer: String(answer), answerSuffix: extra.answerSuffix || '', diagram, ...extra };
}

function numericChoices(answer, count) {
  const candidates = new Set([answer]);
  const offsets = [-30, -20, -10, 10, 20, 30, 40, -40, 50, -50, 60, -60];
  for (const offset of offsets) {
    const value = answer + offset;
    if (value > 0 && value < 180) candidates.add(value);
    if (candidates.size >= count) break;
  }
  return Array.from(candidates).sort((a, b) => a - b).slice(0, count).map((value, index) => ({ value: String(value), marker: String.fromCharCode(65 + index), label: `${value}°`, labelEn: `${value}°` }));
}

function localizedChoices(profile, values) {
  const localized = values[profile.locale] || values[profile.locale?.split('-')[0]] || values.en || values.ko;
  return localized.map((label, index) => ({ value: String(index + 1), label, labelEn: label }));
}

function visualAngle(random, profile) {
  const degree = pick(random, [25, 35, 45, 60, 75, 90, 110, 120, 135, 150]);
  const answer = degree < 90 ? 1 : degree === 90 ? 2 : degree < 180 ? 3 : 4;
  const labels = {
    ko: ['예각', '직각', '둔각', '평각'], en: ['acute angle', 'right angle', 'obtuse angle', 'straight angle'],
    'zh-TW': ['銳角', '直角', '鈍角', '平角'], 'zh-HK': ['銳角', '直角', '鈍角', '平角'],
  };
  const localized = labels[profile.locale] || labels.en;
  return item(text(profile, {
    ko: '그림에 나타난 각의 종류를 고르세요.', en: 'Classify the angle shown in the diagram.',
    'zh-TW': '選出圖中角的種類。', 'zh-HK': '選出圖中角的種類。',
  }), answer, { kind: 'angle', degrees: degree }, {
    choices: localized.map((label, index) => ({ value: String(index + 1), label, labelEn: label })),
    explanation: text(profile, { ko: `${degree}°는 ${localized[answer - 1]}의 범위에 해당합니다.`, en: `${degree}° is classified as an ${localized[answer - 1]}.`, 'zh-TW': `${degree}° 屬於${localized[answer - 1]}。`, 'zh-HK': `${degree}° 屬於${localized[answer - 1]}。` }),
  });
}

function intersectingAngles(random, profile) {
  const given = randomInt(random, 3, 15) * 10;
  return item(text(profile, {
    ko: '두 직선이 한 점에서 만납니다. 그림에서 x의 크기를 구하세요.',
    en: 'Two straight lines intersect. Find the value of x in the diagram.',
    'zh-TW': '兩直線相交，求圖中 x 的度數。', 'zh-HK': '兩直線相交，求圖中 x 的大小。',
  }), given, { kind: 'intersecting', given }, {
    answerSuffix: '°', choices: profile.id === 'amc' ? numericChoices(given, 5) : undefined,
    explanation: text(profile, { ko: `맞꼭지각의 크기는 같으므로 x=${given}°입니다.`, en: `Vertical angles are equal, so x = ${given}°.`, 'zh-TW': `對頂角相等，所以 x=${given}°。`, 'zh-HK': `對頂角相等，所以 x=${given}°。` }),
  });
}

function parallelAngles(random, profile) {
  const given = randomInt(random, 3, 8) * 10;
  const relation = profile.difficulty >= 3 && random() < 0.5 ? 'sameSide' : 'alternate';
  const answer = relation === 'sameSide' ? 180 - given : given;
  const relationName = relation === 'sameSide' ? profile.vocabulary.sameSide : profile.vocabulary.alternate;
  return item(text(profile, {
    ko: `그림에서 l∥m입니다. ${relationName}의 성질을 이용하여 x를 구하세요.`,
    en: `In the diagram, l ∥ m. Use ${relationName} to find x.`,
    'zh-TW': `圖中 l∥m，利用${relationName}的性質求 x。`,
    'zh-HK': `圖中 l∥m，利用${relationName}的性質求 x。`,
  }), answer, { kind: 'parallel', id: randomInt(random, 1000, 9999), given, relation }, {
    answerSuffix: '°', choices: profile.id === 'amc' ? numericChoices(answer, 5) : undefined,
    explanation: relation === 'sameSide'
      ? text(profile, { ko: `동측내각의 합은 180°이므로 x=180°-${given}°=${answer}°입니다.`, en: `Same-side interior angles sum to 180°, so x = 180° − ${given}° = ${answer}°.`, 'zh-TW': `同側內角和為 180°，所以 x=180°-${given}°=${answer}°。`, 'zh-HK': `同旁內角和為 180°，所以 x=180°-${given}°=${answer}°。` })
      : text(profile, { ko: `엇각의 크기는 같으므로 x=${given}°입니다.`, en: `Alternate angles are equal, so x = ${given}°.`, 'zh-TW': `內錯角相等，所以 x=${given}°。`, 'zh-HK': `內錯角相等，所以 x=${given}°。` }),
  });
}

function triangleAngles(random, profile) {
  const a = randomInt(random, 3, 7) * 10;
  const maxB = Math.min(8, 14 - a / 10);
  const b = randomInt(random, 3, maxB) * 10;
  const answer = 180 - a - b;
  return item(text(profile, {
    ko: '삼각형의 내각의 합을 이용하여 x의 크기를 구하세요.',
    en: 'Use the angle sum of a triangle to find x.',
    'zh-TW': '利用三角形內角和求 x。', 'zh-HK': '利用三角形內角和求 x。',
  }), answer, { kind: 'triangle', a, b }, {
    answerSuffix: '°', choices: profile.id === 'amc' ? numericChoices(answer, 5) : undefined,
    explanation: text(profile, { ko: `삼각형의 내각의 합은 180°이므로 x=180°-${a}°-${b}°=${answer}°입니다.`, en: `The angles of a triangle sum to 180°, so x = 180° − ${a}° − ${b}° = ${answer}°.`, 'zh-TW': `三角形內角和為 180°，所以 x=180°-${a}°-${b}°=${answer}°。`, 'zh-HK': `三角形內角和為 180°，所以 x=180°-${a}°-${b}°=${answer}°。` }),
  });
}

function solidRelations(random, profile) {
  const cases = [
    { edges: ['AB', 'EF'], answer: 1 },
    { edges: ['AB', 'BF'], answer: 2 },
    { edges: ['AB', 'FG'], answer: 3 },
    { edges: ['BC', 'FG'], answer: 1 },
    { edges: ['BC', 'BF'], answer: 2 },
    { edges: ['BC', 'EH'], answer: 3 },
  ];
  const selected = pick(random, cases);
  const labels = {
    ko: ['평행', '수직', '꼬인 위치'], en: ['parallel', 'perpendicular', 'skew'],
    'zh-TW': ['平行', '垂直', '歪斜'], 'zh-HK': ['平行', '垂直', '異面'],
  };
  const localized = labels[profile.locale] || labels.en;
  return item(text(profile, {
    ko: `직육면체에서 모서리 ${selected.edges[0]}와 모서리 ${selected.edges[1]}의 위치 관계를 고르세요.`,
    en: `In the cuboid, classify the relationship between edges ${selected.edges[0]} and ${selected.edges[1]}.`,
    'zh-TW': `在長方體中，判斷稜 ${selected.edges[0]} 與稜 ${selected.edges[1]} 的位置關係。`,
    'zh-HK': `在長方體中，判斷稜 ${selected.edges[0]} 與稜 ${selected.edges[1]} 的位置關係。`,
  }), selected.answer, { kind: 'solid', hidden: ['AB', 'BC', 'BF'], highlight: selected.edges }, {
    choices: localized.map((label, index) => ({ value: String(index + 1), label, labelEn: label })),
    explanation: text(profile, { ko: `두 모서리의 방향과 공통점을 확인하면 ${localized[selected.answer - 1]} 관계입니다.`, en: `Comparing their directions and whether they meet shows that the edges are ${localized[selected.answer - 1]}.`, 'zh-TW': `比較兩稜的方向及是否相交，可知它們為${localized[selected.answer - 1]}。`, 'zh-HK': `比較兩稜的方向及是否相交，可知它們為${localized[selected.answer - 1]}。` }),
  });
}

function lineRaySegment(random, profile) {
  const types = ['segment', 'ray', 'line'];
  const selected = pick(random, types);
  const answer = types.indexOf(selected) + 1;
  const choices = localizedChoices(profile, {
    ko: ['선분 AB', '반직선 AB', '직선 AB'], en: ['segment AB', 'ray AB', 'line AB'],
    'zh-TW': ['線段 AB', '射線 AB', '直線 AB'], 'zh-HK': ['線段 AB', '射線 AB', '直線 AB'],
  });
  return item(text(profile, { ko: '그림이 나타내는 도형을 고르세요.', en: 'Choose the object represented by the diagram.', 'zh-TW': '選出圖中表示的幾何圖形。', 'zh-HK': '選出圖中表示的幾何圖形。' }), answer, { kind: 'line-type', type: selected }, {
    choices,
    explanation: text(profile, { ko: selected === 'segment' ? '양 끝이 두 점으로 정해져 있으므로 선분입니다.' : selected === 'ray' ? '한쪽 끝점에서 한 방향으로 계속 뻗으므로 반직선입니다.' : '양쪽으로 끝없이 뻗으므로 직선입니다.', en: selected === 'segment' ? 'It has two endpoints, so it is a segment.' : selected === 'ray' ? 'It starts at one endpoint and extends in one direction, so it is a ray.' : 'It extends without end in both directions, so it is a line.', 'zh-TW': selected === 'segment' ? '兩端都有端點，所以是線段。' : selected === 'ray' ? '從一個端點向一方延伸，所以是射線。' : '向兩方無限延伸，所以是直線。', 'zh-HK': selected === 'segment' ? '兩端都有端點，所以是線段。' : selected === 'ray' ? '從一個端點向一方延伸，所以是射線。' : '向兩方無限延伸，所以是直線。' }),
  });
}

function pointLinePlane(random, profile) {
  const askOutside = random() < 0.5;
  const points = [{ name: 'A', x: 68, y: 72 }, { name: 'B', x: 100, y: 85 }, { name: 'C', x: 142, y: 92 }, { name: 'D', x: 205, y: 104 }];
  const answer = askOutside ? 4 : 2;
  return item(text(profile, askOutside
    ? { ko: '평면 P 위에 있지 않은 점을 고르세요.', en: 'Choose the point that is not on plane P.', 'zh-TW': '選出不在平面 P 上的點。', 'zh-HK': '選出不在平面 P 上的點。' }
    : { ko: '직선 l 위에 있는 점을 고르세요.', en: 'Choose the point lying on line l.', 'zh-TW': '選出直線 l 上的點。', 'zh-HK': '選出直線 l 上的點。' }), answer, { kind: 'point-plane', points }, {
    choices: ['A', 'B', 'C', 'D'].map((label, index) => ({ value: String(index + 1), label, labelEn: label })),
    explanation: text(profile, askOutside
      ? { ko: '점 D는 평면을 나타내는 영역 밖에 있습니다.', en: 'Point D is outside the region representing plane P.', 'zh-TW': '點 D 位於表示平面 P 的區域之外。', 'zh-HK': '點 D 位於表示平面 P 的區域之外。' }
      : { ko: '점 B의 중심이 직선 l 위에 놓여 있습니다.', en: 'The centre of point B lies on line l.', 'zh-TW': '點 B 的中心位於直線 l 上。', 'zh-HK': '點 B 的中心位於直線 l 上。' }),
  });
}

function segmentPartition(random, profile) {
  const parts = random() < 0.5 ? 2 : 3;
  const unit = randomInt(random, 2, 8);
  const total = unit * parts;
  const askLong = parts === 3 && random() < 0.5;
  const answer = askLong ? unit * 2 : unit;
  const target = askLong ? 'MB' : 'AM';
  return item(text(profile, { ko: `선분 AB가 ${parts === 2 ? '두' : '세'} 등분되어 있습니다. ${target}의 길이를 구하세요.`, en: `Segment AB is divided into ${parts} equal parts. Find ${target}.`, 'zh-TW': `線段 AB 被${parts === 2 ? '二' : '三'}等分，求 ${target}。`, 'zh-HK': `線段 AB 被${parts === 2 ? '二' : '三'}等分，求 ${target}。` }), answer, { kind: 'partition', parts, total }, {
    answerSuffix: 'cm',
    explanation: text(profile, { ko: askLong ? `한 부분은 ${total}÷3=${unit}cm이고, MB는 두 부분이므로 ${unit}×2=${answer}cm입니다.` : `한 부분의 길이는 ${total}÷${parts}=${answer}cm입니다.`, en: askLong ? `One part is ${total} ÷ 3 = ${unit} cm, so MB = ${unit} × 2 = ${answer} cm.` : `One part is ${total} ÷ ${parts} = ${answer} cm.`, 'zh-TW': askLong ? `每一段為 ${total}÷3=${unit} cm，所以 MB=${unit}×2=${answer} cm。` : `每一段為 ${total}÷${parts}=${answer} cm。`, 'zh-HK': askLong ? `每一段為 ${total}÷3=${unit} cm，所以 MB=${unit}×2=${answer} cm。` : `每一段為 ${total}÷${parts}=${answer} cm。` }),
  });
}

function angleNotation(random, profile) {
  const pairs = [['A', 'B'], ['B', 'C'], ['C', 'D'], ['A', 'C']];
  const selected = pick(random, pairs);
  const labels = pairs.map(([a, b]) => `∠${a}O${b}`);
  const answer = pairs.findIndex(([a, b]) => a === selected[0] && b === selected[1]) + 1;
  return item(text(profile, { ko: '파란색 호로 표시한 각의 이름을 고르세요.', en: 'Choose the name of the angle marked by the blue arc.', 'zh-TW': '選出藍色圓弧所標示的角。', 'zh-HK': '選出藍色圓弧所標示的角。' }), answer, { kind: 'angle-notation', ends: selected }, {
    choices: labels.map((label, index) => ({ value: String(index + 1), label, labelEn: label })),
    explanation: text(profile, { ko: `각의 꼭짓점 O를 가운데에 쓰므로 이름은 ∠${selected[0]}O${selected[1]}입니다.`, en: `The vertex O is written in the middle, so the angle is ∠${selected[0]}O${selected[1]}.`, 'zh-TW': `角的頂點 O 寫在中間，所以是 ∠${selected[0]}O${selected[1]}。`, 'zh-HK': `角的頂點 O 寫在中間，所以是 ∠${selected[0]}O${selected[1]}。` }),
  });
}

function perpendicularDistance(random, profile) {
  const choices = ['PH', 'PQ', 'HQ'];
  return item(text(profile, { ko: '점 P와 직선 l 사이의 거리를 나타내는 선분을 고르세요.', en: 'Choose the segment representing the distance from P to line l.', 'zh-TW': '選出表示點 P 到直線 l 距離的線段。', 'zh-HK': '選出表示點 P 到直線 l 距離的線段。' }), 1, { kind: 'perpendicular' }, {
    choices: choices.map((label, index) => ({ value: String(index + 1), label, labelEn: label })),
    explanation: text(profile, { ko: '점과 직선 사이의 거리는 그 점에서 직선에 내린 수선 PH의 길이입니다.', en: 'The distance from a point to a line is the length of the perpendicular PH.', 'zh-TW': '點到直線的距離是垂線段 PH 的長度。', 'zh-HK': '點到直線的距離是垂線段 PH 的長度。' }),
  });
}

function linePlaneRelations(random, profile) {
  const cases = [
    { edge: 'EF', face: 'EFGH', answer: 1 },
    { edge: 'AB', face: 'EFGH', answer: 2 },
    { edge: 'AE', face: 'EFGH', answer: 3 },
  ];
  const selected = pick(random, cases);
  const choices = localizedChoices(profile, {
    ko: ['평면에 포함', '평면과 평행', '평면과 수직'], en: ['lies in the plane', 'parallel to the plane', 'perpendicular to the plane'],
    'zh-TW': ['包含在平面內', '與平面平行', '與平面垂直'], 'zh-HK': ['包含在平面內', '與平面平行', '與平面垂直'],
  });
  return item(text(profile, { ko: `직육면체에서 모서리 ${selected.edge}와 면 ${selected.face}의 위치 관계를 고르세요.`, en: `In the cuboid, classify edge ${selected.edge} relative to face ${selected.face}.`, 'zh-TW': `在長方體中，判斷稜 ${selected.edge} 與面 ${selected.face} 的位置關係。`, 'zh-HK': `在長方體中，判斷稜 ${selected.edge} 與面 ${selected.face} 的位置關係。` }), selected.answer, { kind: 'solid', hidden: ['AB', 'BC', 'BF'], highlight: [selected.edge], highlightFace: selected.face }, {
    choices,
    explanation: text(profile, { ko: `모서리와 면의 교점 및 방향을 확인하면 '${choices[selected.answer - 1].label}' 관계입니다.`, en: `Checking intersection and direction shows that the edge ${choices[selected.answer - 1].label}.`, 'zh-TW': `檢查交點與方向，可知該稜${choices[selected.answer - 1].label}。`, 'zh-HK': `檢查交點與方向，可知該稜${choices[selected.answer - 1].label}。` }),
  });
}

function planePlaneRelations(random, profile) {
  const cases = [
    { faces: ['ABCD', 'EFGH'], answer: 1, highlightFace: 'EFGH' },
    { faces: ['ABCD', 'ABFE'], answer: 2, highlightFace: 'ABFE' },
    { faces: ['ABFE', 'BCGF'], answer: 2, highlightFace: 'BCGF' },
  ];
  const selected = pick(random, cases);
  const choices = localizedChoices(profile, { ko: ['평행', '수직'], en: ['parallel', 'perpendicular'], 'zh-TW': ['平行', '垂直'], 'zh-HK': ['平行', '垂直'] });
  return item(text(profile, { ko: `직육면체에서 면 ${selected.faces[0]}와 면 ${selected.faces[1]}의 위치 관계를 고르세요.`, en: `In the cuboid, classify faces ${selected.faces[0]} and ${selected.faces[1]}.`, 'zh-TW': `在長方體中，判斷面 ${selected.faces[0]} 與面 ${selected.faces[1]} 的位置關係。`, 'zh-HK': `在長方體中，判斷面 ${selected.faces[0]} 與面 ${selected.faces[1]} 的位置關係。` }), selected.answer, { kind: 'solid', hidden: ['AB', 'BC', 'BF'], highlightFace: selected.highlightFace }, {
    choices,
    explanation: text(profile, { ko: selected.answer === 1 ? '두 면은 만나지 않고 같은 방향으로 놓여 있으므로 평행합니다.' : '두 면은 한 모서리에서 만나며 직각을 이루므로 수직입니다.', en: selected.answer === 1 ? 'The faces do not meet and have the same direction, so they are parallel.' : 'The faces meet along an edge at a right angle, so they are perpendicular.', 'zh-TW': selected.answer === 1 ? '兩平面不相交且方向相同，所以平行。' : '兩平面沿一條稜相交成直角，所以垂直。', 'zh-HK': selected.answer === 1 ? '兩平面不相交且方向相同，所以平行。' : '兩平面沿一條稜相交成直角，所以垂直。' }),
  });
}

function solidElements(random, profile) {
  const solids = [
    { kind: 'tri-pyramid', ko: '삼각뿔', en: 'triangular pyramid', zh: '三角錐', values: { faces: 4, vertices: 4, edges: 6 } },
    { kind: 'tri-prism', ko: '삼각기둥', en: 'triangular prism', zh: '三角柱', values: { faces: 5, vertices: 6, edges: 9 } },
  ];
  const properties = [
    { key: 'faces', ko: '면', en: 'faces', zh: '面' },
    { key: 'vertices', ko: '꼭짓점', en: 'vertices', zh: '頂點' },
    { key: 'edges', ko: '모서리', en: 'edges', zh: '稜' },
  ];
  const solid = pick(random, solids); const property = pick(random, properties); const answer = solid.values[property.key];
  const solidName = profile.locale === 'ko' ? solid.ko : profile.locale?.startsWith('zh') ? solid.zh : solid.en;
  const propertyName = profile.locale === 'ko' ? property.ko : profile.locale?.startsWith('zh') ? property.zh : property.en;
  return item(text(profile, { ko: `그림과 같은 ${solidName}의 ${propertyName}의 개수를 구하세요.`, en: `How many ${propertyName} does the ${solidName} have?`, 'zh-TW': `求圖中${solidName}的${propertyName}數目。`, 'zh-HK': `求圖中${solidName}的${propertyName}數目。` }), answer, { kind: solid.kind }, {
    explanation: text(profile, { ko: `${solidName}의 ${propertyName}을 중복 없이 세면 ${answer}개입니다.`, en: `Counting each ${property.key === 'vertices' ? 'vertex' : property.key.slice(0, -1)} once gives ${answer}.`, 'zh-TW': `不重複地數出${solidName}的${propertyName}，共有 ${answer} 個。`, 'zh-HK': `不重複地數出${solidName}的${propertyName}，共有 ${answer} 個。` }),
  });
}

function parallelJudgement(random, profile) {
  const a = randomInt(random, 3, 8) * 10;
  const parallel = random() < 0.55;
  const b = parallel ? a : a + (a >= 80 ? -10 : 10);
  const choices = localizedChoices(profile, { ko: ['평행하다', '평행하지 않다'], en: ['parallel', 'not parallel'], 'zh-TW': ['平行', '不平行'], 'zh-HK': ['平行', '不平行'] });
  return item(text(profile, { ko: '표시된 두 각을 이용하여 l과 m이 평행한지 판단하세요.', en: 'Use the marked angles to decide whether l and m are parallel.', 'zh-TW': '利用所標示的兩角判斷 l 與 m 是否平行。', 'zh-HK': '利用所標示的兩角判斷 l 與 m 是否平行。' }), parallel ? 1 : 2, { kind: 'parallel-test', a, b }, {
    choices,
    explanation: text(profile, parallel
      ? { ko: `엇각의 크기가 ${a}°로 같으므로 l∥m입니다.`, en: `The alternate angles are both ${a}°, so l ∥ m.`, 'zh-TW': `內錯角同為 ${a}°，所以 l∥m。`, 'zh-HK': `內錯角同為 ${a}°，所以 l∥m。` }
      : { ko: `엇각의 크기 ${a}°와 ${b}°가 다르므로 l과 m은 평행하지 않습니다.`, en: `The alternate angles ${a}° and ${b}° are unequal, so l and m are not parallel.`, 'zh-TW': `內錯角 ${a}° 與 ${b}° 不相等，所以 l 與 m 不平行。`, 'zh-HK': `內錯角 ${a}° 與 ${b}° 不相等，所以 l 與 m 不平行。` }),
  });
}

function zigzagParallel(random, profile) {
  const a = randomInt(random, 3, 5) * 10;
  const b = randomInt(random, 3, 5) * 10;
  const answer = a + b;
  return item(text(profile, { ko: 'l∥m일 때, 꺾인 선이 만드는 각 x의 크기를 구하세요.', en: 'Given l ∥ m, find the angle x formed by the broken transversal.', 'zh-TW': '已知 l∥m，求折線所成的角 x。', 'zh-HK': '已知 l∥m，求折線所成的角 x。' }), answer, { kind: 'zigzag', a, b }, {
    answerSuffix: '°', choices: profile.id === 'amc' ? numericChoices(answer, 5) : undefined,
    explanation: text(profile, { ko: `꺾이는 점을 지나는 평행선을 그으면 엇각이 각각 ${a}°, ${b}°이므로 x=${a}°+${b}°=${answer}°입니다.`, en: `Draw a parallel through the vertex. The two alternate angles are ${a}° and ${b}°, so x = ${a}° + ${b}° = ${answer}°.`, 'zh-TW': `過折點作平行線，兩個內錯角分別為 ${a}°、${b}°，所以 x=${a}°+${b}°=${answer}°。`, 'zh-HK': `過折點作平行線，兩個內錯角分別為 ${a}°、${b}°，所以 x=${a}°+${b}°=${answer}°。` }),
  });
}

function circleAndSector(random, profile) {
  const variant = pick(random, ['circumference', 'arc', 'area', 'centralAngle', 'radiusFromCircumference']);
  const radius = variant === 'area' ? pick(random, [6, 12]) : pick(random, [3, 6, 9, 12]);
  const theta = pick(random, [60, 90, 120, 180]);
  let coefficient; let unit; let promptValues; let explanationValues;
  if (variant === 'centralAngle') {
    coefficient = (theta * 2 * radius) / 360;
    return item(text(profile, { ko: `반지름이 ${radius}cm이고 호의 길이가 ${coefficient}πcm인 부채꼴의 중심각 x를 구하세요.`, en: `A sector has radius ${radius} cm and arc length ${coefficient}π cm. Find its central angle x.`, 'zh-TW': `扇形半徑為 ${radius} cm、弧長為 ${coefficient}π cm，求圓心角 x。`, 'zh-HK': `扇形半徑為 ${radius} cm、弧長為 ${coefficient}π cm，求圓心角 x。` }), theta, { kind: 'circle-sector', radius, theta, showSector: true, unknownTheta: true, arcLabel: `${coefficient}π cm` }, {
      answerSuffix: '°',
      explanation: text(profile, { ko: `2π×${radius}×x/360=${coefficient}π이므로 x=${theta}°입니다.`, en: `Solve 2π × ${radius} × x/360 = ${coefficient}π to obtain x = ${theta}°.`, 'zh-TW': `由 2π×${radius}×x/360=${coefficient}π，得 x=${theta}°。`, 'zh-HK': `由 2π×${radius}×x/360=${coefficient}π，得 x=${theta}°。` }),
    });
  }
  if (variant === 'radiusFromCircumference') {
    coefficient = 2 * radius;
    return item(text(profile, { ko: `원의 둘레가 ${coefficient}πcm일 때 반지름 x를 구하세요.`, en: `The circumference is ${coefficient}π cm. Find the radius x.`, 'zh-TW': `圓周長為 ${coefficient}π cm，求半徑 x。`, 'zh-HK': `圓周界為 ${coefficient}π cm，求半徑 x。` }), radius, { kind: 'circle-sector', radius, theta, showSector: false, unknownRadius: true, circumferenceLabel: `C=${coefficient}π cm` }, {
      answerSuffix: 'cm',
      explanation: text(profile, { ko: `2πx=${coefficient}π이므로 x=${coefficient}÷2=${radius}cm입니다.`, en: `Since 2πx = ${coefficient}π, x = ${coefficient} ÷ 2 = ${radius} cm.`, 'zh-TW': `由 2πx=${coefficient}π，得 x=${coefficient}÷2=${radius} cm。`, 'zh-HK': `由 2πx=${coefficient}π，得 x=${coefficient}÷2=${radius} cm。` }),
    });
  }
  if (variant === 'circumference') {
    coefficient = 2 * radius; unit = 'cm';
    promptValues = { ko: '그림과 같은 원의 둘레를 구하세요.', en: 'Find the circumference of the circle.', 'zh-TW': '求圖中圓的周長。', 'zh-HK': '求圖中圓的周界。' };
    explanationValues = { ko: `원의 둘레는 2πr이므로 2×${radius}×π=${coefficient}π cm입니다.`, en: `C = 2πr = 2 × ${radius} × π = ${coefficient}π cm.`, 'zh-TW': `圓周長為 2πr=2×${radius}×π=${coefficient}π cm。`, 'zh-HK': `圓周界為 2πr=2×${radius}×π=${coefficient}π cm。` };
  } else if (variant === 'arc') {
    coefficient = (theta * 2 * radius) / 360; unit = 'cm';
    promptValues = { ko: '색칠한 부채꼴의 호의 길이를 구하세요.', en: 'Find the arc length of the shaded sector.', 'zh-TW': '求陰影扇形的弧長。', 'zh-HK': '求陰影扇形的弧長。' };
    explanationValues = { ko: `호의 길이는 2πr×${theta}/360이므로 ${coefficient}π cm입니다.`, en: `Arc length = 2πr × ${theta}/360 = ${coefficient}π cm.`, 'zh-TW': `弧長=2πr×${theta}/360=${coefficient}π cm。`, 'zh-HK': `弧長=2πr×${theta}/360=${coefficient}π cm。` };
  } else {
    coefficient = (theta * radius * radius) / 360; unit = 'cm²';
    promptValues = { ko: '색칠한 부채꼴의 넓이를 구하세요.', en: 'Find the area of the shaded sector.', 'zh-TW': '求陰影扇形的面積。', 'zh-HK': '求陰影扇形的面積。' };
    explanationValues = { ko: `부채꼴의 넓이는 πr²×${theta}/360이므로 ${coefficient}π cm²입니다.`, en: `Sector area = πr² × ${theta}/360 = ${coefficient}π cm².`, 'zh-TW': `扇形面積=πr²×${theta}/360=${coefficient}π cm²。`, 'zh-HK': `扇形面積=πr²×${theta}/360=${coefficient}π cm²。` };
  }
  return item(text(profile, promptValues), `${coefficient}π`, { kind: 'circle-sector', radius, theta, showSector: variant !== 'circumference' }, {
    answerSuffix: unit, explanation: text(profile, explanationValues),
  });
}

function triangleCongruence(random, profile) {
  const condition = pick(random, ['SSS', 'SAS', 'ASA']);
  const labels = condition === 'SSS' ? ['3', '4', '5'] : condition === 'SAS' ? ['4', '60°', '5'] : ['50°', '6', '70°'];
  const choices = ['SSS', 'SAS', 'ASA'];
  const answer = choices.indexOf(condition) + 1;
  return item(text(profile, { ko: '표시된 조건으로 두 삼각형이 합동일 때, 사용한 합동 조건을 고르세요.', en: 'Choose the congruence criterion shown by the markings.', 'zh-TW': '根據圖中的條件，選出三角形全等判定。', 'zh-HK': '根據圖中的條件，選出三角形全等判定。' }), answer, { kind: 'triangle-pair', mode: 'congruence', condition, labels }, {
    choices: choices.map((label, index) => ({ value: String(index + 1), label, labelEn: label })),
    explanation: text(profile, { ko: `서로 대응하는 요소가 ${condition} 조건을 만족하므로 두 삼각형은 합동입니다.`, en: `The corresponding parts satisfy the ${condition} congruence criterion.`, 'zh-TW': `對應元素符合 ${condition} 全等判定。`, 'zh-HK': `對應元素符合 ${condition} 全等判定。` }),
  });
}

function triangleSimilarity(random, profile) {
  const smallBase = randomInt(random, 2, 5);
  const smallHeight = randomInt(random, 3, 7);
  const scale = pick(random, [2, 3]);
  const largeBase = smallBase * scale; const answer = smallHeight * scale;
  return item(text(profile, { ko: '두 직각삼각형이 닮음일 때, 대응변 x의 길이를 구하세요.', en: 'The two right triangles are similar. Find the corresponding side x.', 'zh-TW': '兩直角三角形相似，求對應邊 x。', 'zh-HK': '兩直角三角形相似，求對應邊 x。' }), answer, { kind: 'triangle-pair', mode: 'similarity', smallBase, smallHeight, largeBase }, {
    explanation: text(profile, { ko: `닮음비는 ${largeBase}:${smallBase}=${scale}:1이므로 x=${smallHeight}×${scale}=${answer}입니다.`, en: `The scale factor is ${largeBase}/${smallBase} = ${scale}, so x = ${smallHeight} × ${scale} = ${answer}.`, 'zh-TW': `相似比為 ${largeBase}:${smallBase}=${scale}:1，所以 x=${smallHeight}×${scale}=${answer}。`, 'zh-HK': `相似比為 ${largeBase}:${smallBase}=${scale}:1，所以 x=${smallHeight}×${scale}=${answer}。` }),
  });
}

function triangleSimilarityRatios(random, profile) {
  const smallBase = randomInt(random, 2, 5); const smallHeight = randomInt(random, 2, 5); const scale = pick(random, [2, 3]);
  const largeBase = smallBase * scale; const largeHeight = smallHeight * scale; const asksArea = random() < 0.5;
  const answer = asksArea ? scale * scale : scale;
  return item(text(profile, asksArea
    ? { ko: '두 삼각형이 닮음일 때, 작은 삼각형에 대한 큰 삼각형의 넓이비를 구하세요.', en: 'The triangles are similar. Find the area ratio of the large triangle to the small triangle.', 'zh-TW': '兩三角形相似，求大三角形與小三角形的面積比。', 'zh-HK': '兩三角形相似，求大三角形與小三角形的面積比。' }
    : { ko: '두 삼각형이 닮음일 때, 작은 삼각형에 대한 큰 삼각형의 둘레비를 구하세요.', en: 'The triangles are similar. Find the perimeter ratio of the large triangle to the small triangle.', 'zh-TW': '兩三角形相似，求大三角形與小三角形的周長比。', 'zh-HK': '兩三角形相似，求大三角形與小三角形的周界比。' }), `${answer}:1`, { kind: 'triangle-pair', mode: 'similarity', smallBase, smallHeight, largeBase, largeHeight, showTarget: false }, {
    explanation: text(profile, asksArea
      ? { ko: `닮음비가 ${scale}:1이므로 넓이비는 ${scale}²:1²=${answer}:1입니다.`, en: `The scale factor is ${scale}:1, so the area ratio is ${scale}²:1² = ${answer}:1.`, 'zh-TW': `相似比為 ${scale}:1，所以面積比為 ${scale}²:1²=${answer}:1。`, 'zh-HK': `相似比為 ${scale}:1，所以面積比為 ${scale}²:1²=${answer}:1。` }
      : { ko: `닮은 도형의 둘레비는 닮음비와 같으므로 ${scale}:1입니다.`, en: `The perimeter ratio of similar figures equals the scale factor, so it is ${scale}:1.`, 'zh-TW': `相似圖形的周長比等於相似比，所以為 ${scale}:1。`, 'zh-HK': `相似圖形的周界比等於相似比，所以為 ${scale}:1。` }),
  });
}

function rulerCompassConstruction(random, profile) {
  const mode = pick(random, ['segment', 'angle', 'parallel']);
  if (mode === 'segment') {
    const choices = localizedChoices(profile, {
      ko: ['컴퍼스', '눈금 없는 자', '각도기'], en: ['compass', 'unmarked straightedge', 'protractor'],
      'zh-TW': ['圓規', '無刻度直尺', '量角器'], 'zh-HK': ['圓規', '無刻度直尺', '量角器'],
    });
    return item(text(profile, {
      ko: '선분 AB의 길이를 반직선 PX 위에 옮겨 점 Q를 정할 때 사용하는 도구를 고르세요.',
      en: 'Choose the tool used to transfer the length AB onto ray PX and locate Q.',
      'zh-TW': '把線段 AB 的長度移到射線 PX 上以定出 Q，應使用哪一種工具？',
      'zh-HK': '把線段 AB 的長度移到射線 PX 上以定出 Q，應使用哪一種工具？',
    }), 1, { kind: 'construction', mode }, {
      choices,
      explanation: text(profile, { ko: '컴퍼스의 폭을 AB로 고정하고 P를 중심으로 호를 그리면 같은 길이 PQ를 옮길 수 있습니다.', en: 'Set the compass width to AB and draw an arc centred at P; its intersection gives PQ = AB.', 'zh-TW': '把圓規張開至 AB，以 P 為圓心畫弧，即可得到 PQ=AB。', 'zh-HK': '把圓規張開至 AB，以 P 為圓心畫弧，即可得到 PQ=AB。' }),
    });
  }
  if (mode === 'angle') {
    const choices = localizedChoices(profile, {
      ko: ['두 각의 크기가 같다', '두 변의 길이가 모두 같다', '두 각의 합이 180°이다'],
      en: ['the two angles are equal', 'all side lengths are equal', 'the two angles sum to 180°'],
      'zh-TW': ['兩角相等', '所有邊長相等', '兩角和為 180°'], 'zh-HK': ['兩角相等', '所有邊長相等', '兩角和為 180°'],
    });
    return item(text(profile, { ko: '자와 컴퍼스로 ∠AOB를 ∠XPY에 옮긴 결과로 옳은 것을 고르세요.', en: 'After copying ∠AOB to ∠XPY with straightedge and compass, choose the true statement.', 'zh-TW': '用直尺和圓規把 ∠AOB 複製成 ∠XPY，選出正確敘述。', 'zh-HK': '用直尺和圓規把 ∠AOB 複製成 ∠XPY，選出正確敘述。' }), 1, { kind: 'construction', mode }, {
      choices,
      explanation: text(profile, { ko: '같은 반지름의 호와 같은 현의 길이를 옮겼으므로 ∠AOB=∠XPY입니다.', en: 'Equal-radius arcs and the same chord length reproduce the angle, so ∠AOB = ∠XPY.', 'zh-TW': '使用等半徑的弧並移取相同弦長，所以 ∠AOB=∠XPY。', 'zh-HK': '使用等半徑的弧並移取相同弦長，所以 ∠AOB=∠XPY。' }),
    });
  }
  const choices = localizedChoices(profile, {
    ko: ['엇각의 크기가 같다', '이웃한 두 각의 크기가 같다', '동측내각의 크기가 같다'],
    en: ['alternate angles are equal', 'adjacent angles are equal', 'same-side interior angles are equal'],
    'zh-TW': ['內錯角相等', '相鄰角相等', '同側內角相等'], 'zh-HK': ['內錯角相等', '相鄰角相等', '同旁內角相等'],
  });
  return item(text(profile, { ko: '점을 지나며 직선 l과 평행한 직선을 작도할 때 이용한 성질을 고르세요.', en: 'Choose the property used to construct a line through the point parallel to l.', 'zh-TW': '作一條通過指定點且平行於 l 的直線時，使用了哪一個性質？', 'zh-HK': '作一條通過指定點且平行於 l 的直線時，使用了哪一個性質？' }), 1, { kind: 'construction', mode }, {
    choices,
    explanation: text(profile, { ko: '한 횡단선이 만드는 엇각을 같게 작도하면 두 직선은 평행합니다.', en: 'If a transversal forms equal alternate angles, the two lines are parallel.', 'zh-TW': '若截線所成的內錯角相等，兩直線平行。', 'zh-HK': '若截線所成的內錯角相等，兩直線平行。' }),
  });
}

function triangleSideAngleRelation(random, profile) {
  const sides = pick(random, [[5, 6, 7], [6, 8, 9], [7, 8, 10], [5, 7, 8]]); // a=BC, b=CA, c=AB
  const mode = pick(random, ['oppositeSide', 'oppositeAngle', 'largestAngle']);
  const labels = ['A', 'B', 'C'];
  if (mode === 'oppositeSide') {
    const vertex = pick(random, labels); const opposite = { A: 'BC', B: 'CA', C: 'AB' }[vertex];
    return item(text(profile, { ko: `△ABC에서 ∠${vertex}의 대변을 고르세요.`, en: `In △ABC, choose the side opposite ∠${vertex}.`, 'zh-TW': `在 △ABC 中，選出 ∠${vertex} 的對邊。`, 'zh-HK': `在 △ABC 中，選出 ∠${vertex} 的對邊。` }), ['BC', 'CA', 'AB'].indexOf(opposite) + 1, { kind: 'triangle-relation', sides, highlightAngle: vertex }, {
      choices: ['BC', 'CA', 'AB'].map((label, index) => ({ value: String(index + 1), label, labelEn: label })),
      explanation: text(profile, { ko: `꼭짓점 ${vertex}와 마주 보는 변은 ${opposite}입니다.`, en: `The side across from vertex ${vertex} is ${opposite}.`, 'zh-TW': `與頂點 ${vertex} 相對的邊是 ${opposite}。`, 'zh-HK': `與頂點 ${vertex} 相對的邊是 ${opposite}。` }),
    });
  }
  if (mode === 'oppositeAngle') {
    const side = pick(random, ['BC', 'CA', 'AB']); const vertex = { BC: 'A', CA: 'B', AB: 'C' }[side];
    return item(text(profile, { ko: `△ABC에서 변 ${side}의 대각을 고르세요.`, en: `In △ABC, choose the angle opposite side ${side}.`, 'zh-TW': `在 △ABC 中，選出邊 ${side} 的對角。`, 'zh-HK': `在 △ABC 中，選出邊 ${side} 的對角。` }), labels.indexOf(vertex) + 1, { kind: 'triangle-relation', sides, highlightSide: side }, {
      choices: labels.map((label, index) => ({ value: String(index + 1), label: `∠${label}`, labelEn: `∠${label}` })),
      explanation: text(profile, { ko: `변 ${side}와 마주 보는 꼭짓점은 ${vertex}이므로 대각은 ∠${vertex}입니다.`, en: `The vertex across from ${side} is ${vertex}, so the opposite angle is ∠${vertex}.`, 'zh-TW': `邊 ${side} 所對的頂點是 ${vertex}，所以對角是 ∠${vertex}。`, 'zh-HK': `邊 ${side} 所對的頂點是 ${vertex}，所以對角是 ∠${vertex}。` }),
    });
  }
  const largestSideIndex = sides.indexOf(Math.max(...sides)); const vertex = ['A', 'B', 'C'][largestSideIndex];
  return item(text(profile, { ko: '세 변의 길이가 표시된 △ABC에서 가장 큰 각을 고르세요.', en: 'Choose the largest angle in △ABC from the labelled side lengths.', 'zh-TW': '根據所標邊長，選出 △ABC 中最大的角。', 'zh-HK': '根據所標邊長，選出 △ABC 中最大的角。' }), labels.indexOf(vertex) + 1, { kind: 'triangle-relation', sides, showLengths: true }, {
    choices: labels.map((label, index) => ({ value: String(index + 1), label: `∠${label}`, labelEn: `∠${label}` })),
    explanation: text(profile, { ko: `삼각형에서 가장 긴 변의 대각이 가장 큽니다. 가장 긴 변의 길이는 ${sides[largestSideIndex]}이고 그 대각은 ∠${vertex}입니다.`, en: `The largest angle is opposite the longest side. The longest side is ${sides[largestSideIndex]}, opposite ∠${vertex}.`, 'zh-TW': `三角形中最長邊所對的角最大；最長邊為 ${sides[largestSideIndex]}，其對角是 ∠${vertex}。`, 'zh-HK': `三角形中最長邊所對的角最大；最長邊為 ${sides[largestSideIndex]}，其對角是 ∠${vertex}。` }),
  });
}

function triangleInequality(random, profile) {
  const valid = random() < 0.55;
  const a = randomInt(random, 3, 8); const b = randomInt(random, 3, 8);
  const c = valid ? randomInt(random, Math.abs(a - b) + 1, a + b - 1) : a + b + randomInt(random, 0, 2);
  const lengths = [a, b, c].sort((x, y) => x - y);
  const choices = localizedChoices(profile, { ko: ['삼각형을 만들 수 있다', '삼각형을 만들 수 없다'], en: ['a triangle can be formed', 'a triangle cannot be formed'], 'zh-TW': ['可以構成三角形', '不能構成三角形'], 'zh-HK': ['可以構成三角形', '不能構成三角形'] });
  return item(text(profile, { ko: '그림의 세 선분을 변으로 하는 삼각형을 만들 수 있는지 판단하세요.', en: 'Decide whether the three segments can form a triangle.', 'zh-TW': '判斷圖中三條線段能否構成三角形。', 'zh-HK': '判斷圖中三條線段能否構成三角形。' }), valid ? 1 : 2, { kind: 'segment-set', lengths }, {
    choices,
    explanation: text(profile, valid
      ? { ko: `가장 긴 변 ${lengths[2]}보다 나머지 두 변의 합 ${lengths[0]}+${lengths[1]}=${lengths[0] + lengths[1]}가 크므로 삼각형을 만들 수 있습니다.`, en: `${lengths[0]} + ${lengths[1]} = ${lengths[0] + lengths[1]} is greater than the longest side ${lengths[2]}, so a triangle can be formed.`, 'zh-TW': `${lengths[0]}+${lengths[1]}=${lengths[0] + lengths[1]} 大於最長邊 ${lengths[2]}，所以可以構成三角形。`, 'zh-HK': `${lengths[0]}+${lengths[1]}=${lengths[0] + lengths[1]} 大於最長邊 ${lengths[2]}，所以可以構成三角形。` }
      : { ko: `나머지 두 변의 합 ${lengths[0]}+${lengths[1]}=${lengths[0] + lengths[1]}가 가장 긴 변 ${lengths[2]}보다 크지 않으므로 삼각형을 만들 수 없습니다.`, en: `${lengths[0]} + ${lengths[1]} = ${lengths[0] + lengths[1]} is not greater than the longest side ${lengths[2]}, so no triangle can be formed.`, 'zh-TW': `${lengths[0]}+${lengths[1]}=${lengths[0] + lengths[1]} 不大於最長邊 ${lengths[2]}，所以不能構成三角形。`, 'zh-HK': `${lengths[0]}+${lengths[1]}=${lengths[0] + lengths[1]} 不大於最長邊 ${lengths[2]}，所以不能構成三角形。` }),
  });
}

function congruenceMapping(random, profile) {
  const sides = [randomInt(random, 4, 7), randomInt(random, 5, 9), randomInt(random, 6, 10)];
  const angles = [randomInt(random, 4, 7) * 10, randomInt(random, 4, 7) * 10]; angles.push(180 - angles[0] - angles[1]);
  const askSide = random() < 0.6; const index = randomInt(random, 0, 2);
  const answer = askSide ? sides[index] : angles[index];
  const source = askSide ? ['AB', 'BC', 'CA'][index] : [`∠A`, `∠B`, `∠C`][index];
  const target = askSide ? ['DE', 'EF', 'FD'][index] : [`∠D`, `∠E`, `∠F`][index];
  return item(text(profile, { ko: `△ABC≡△DEF이고 ${source}=${answer}${askSide ? 'cm' : '°'}일 때, ${target}의 값을 구하세요.`, en: `Given △ABC ≡ △DEF and ${source} = ${answer}${askSide ? ' cm' : '°'}, find ${target}.`, 'zh-TW': `已知 △ABC≡△DEF 且 ${source}=${answer}${askSide ? ' cm' : '°'}，求 ${target}。`, 'zh-HK': `已知 △ABC≡△DEF 且 ${source}=${answer}${askSide ? ' cm' : '°'}，求 ${target}。` }), answer, { kind: 'congruence-mapping', sides, angles, index, askSide }, {
    answerSuffix: askSide ? 'cm' : '°',
    explanation: text(profile, { ko: `합동식의 대응 순서는 A↔D, B↔E, C↔F입니다. 따라서 ${source}와 ${target}은 서로 대응하여 값이 같습니다.`, en: `The congruence order gives A↔D, B↔E and C↔F. Thus ${source} corresponds to ${target}, so their measures are equal.`, 'zh-TW': `依全等式的順序 A↔D、B↔E、C↔F，因此 ${source} 與 ${target} 對應且數值相等。`, 'zh-HK': `依全等式的順序 A↔D、B↔E、C↔F，因此 ${source} 與 ${target} 對應且數值相等。` }),
  });
}

function congruenceSufficiency(random, profile) {
  const condition = pick(random, ['SSS', 'SAS', 'ASA', 'SSA', 'AAA']); const sufficient = ['SSS', 'SAS', 'ASA'].includes(condition);
  const choices = localizedChoices(profile, { ko: ['항상 합동이다 (O)', '합동이라고 할 수 없다 (X)'], en: ['always congruent', 'not necessarily congruent'], 'zh-TW': ['必定全等（O）', '不一定全等（X）'], 'zh-HK': ['必定全等（O）', '不一定全等（X）'] });
  return item(text(profile, { ko: `두 삼각형에 ${condition} 조건이 주어졌습니다. 이 조건만으로 두 삼각형이 항상 합동인지 판단하세요.`, en: `Two triangles satisfy ${condition}. Decide whether this condition alone guarantees congruence.`, 'zh-TW': `兩三角形符合 ${condition} 條件，判斷僅憑此條件是否必定全等。`, 'zh-HK': `兩三角形符合 ${condition} 條件，判斷僅憑此條件是否必定全等。` }), sufficient ? 1 : 2, { kind: 'triangle-pair', mode: 'congruence', condition, labels: condition.split('') }, {
    choices,
    explanation: text(profile, sufficient
      ? { ko: `${condition}은 삼각형의 합동을 결정하는 충분조건입니다.`, en: `${condition} is a valid triangle congruence criterion.`, 'zh-TW': `${condition} 是三角形全等的充分判定。`, 'zh-HK': `${condition} 是三角形全等的充分判定。` }
      : condition === 'AAA'
        ? { ko: 'AAA는 모양만 결정하고 크기는 결정하지 않으므로 닮음은 보장하지만 합동은 보장하지 않습니다.', en: 'AAA fixes the shape but not the size, so it guarantees similarity, not congruence.', 'zh-TW': 'AAA 只決定形狀而不決定大小，因此保證相似但不保證全等。', 'zh-HK': 'AAA 只決定形狀而不決定大小，因此保證相似但不保證全等。' }
        : { ko: 'SSA만으로는 삼각형이 하나로 결정되지 않는 경우가 있으므로 합동을 보장할 수 없습니다.', en: 'SSA can produce more than one triangle, so congruence is not guaranteed.', 'zh-TW': 'SSA 有時可形成不止一個三角形，因此不保證全等。', 'zh-HK': 'SSA 有時可形成不止一個三角形，因此不保證全等。' }),
  });
}

function pythagoreanTheorem(random, profile) {
  const [a0, b0, c0] = pick(random, [[3,4,5],[5,12,13],[8,15,17],[7,24,25]]);
  const scale = random() < 0.7 ? 1 : 2; const a = a0 * scale; const b = b0 * scale; const c = c0 * scale;
  const variant = pick(random, ['missingSide', 'missingSide', 'rectangleDiagonal', 'converse']);
  if (variant === 'rectangleDiagonal') {
    return item(text(profile, { ko: `가로 ${b}cm, 세로 ${a}cm인 직사각형의 대각선 x의 길이를 구하세요.`, en: `Find the diagonal x of a rectangle ${b} cm by ${a} cm.`, 'zh-TW': `求長 ${b} cm、寬 ${a} cm 的長方形對角線 x。`, 'zh-HK': `求長 ${b} cm、闊 ${a} cm 的長方形對角線 x。` }), c, { kind: 'rectangle-diagonal', width: b, height: a, diagonal: c }, {
      answerSuffix: 'cm', explanation: text(profile, { ko: `대각선은 직각삼각형의 빗변이므로 x=√(${a}²+${b}²)=${c}cm입니다.`, en: `The diagonal is the hypotenuse, so x = √(${a}² + ${b}²) = ${c} cm.`, 'zh-TW': `對角線是直角三角形的斜邊，所以 x=√(${a}²+${b}²)=${c} cm。`, 'zh-HK': `對角線是直角三角形的斜邊，所以 x=√(${a}²+${b}²)=${c} cm。` }),
    });
  }
  if (variant === 'converse') {
    const right = random() < 0.5; const sides = right ? [a0, b0, c0] : pick(random, [[3,4,6],[5,6,8],[5,12,14]]);
    const choices = localizedChoices(profile, { ko: ['직각삼각형이다', '직각삼각형이 아니다'], en: ['right triangle', 'not a right triangle'], 'zh-TW': ['是直角三角形', '不是直角三角形'], 'zh-HK': ['是直角三角形', '不是直角三角形'] });
    const [p, q, r] = sides;
    return item(text(profile, { ko: '세 변의 길이가 표시된 삼각형이 직각삼각형인지 판단하세요.', en: 'Decide whether the triangle with the labelled side lengths is a right triangle.', 'zh-TW': '判斷標示三邊長的三角形是否為直角三角形。', 'zh-HK': '判斷標示三邊長的三角形是否為直角三角形。' }), right ? 1 : 2, { kind: 'triangle-relation', sides, showLengths: true }, {
      choices, explanation: text(profile, { ko: `${p}²+${q}²=${p * p + q * q}, ${r}²=${r * r}이므로 ${right ? '두 값이 같아 직각삼각형입니다.' : '두 값이 달라 직각삼각형이 아닙니다.'}`, en: `${p}² + ${q}² = ${p * p + q * q} and ${r}² = ${r * r}; therefore it is ${right ? '' : 'not '}a right triangle.`, 'zh-TW': `${p}²+${q}²=${p * p + q * q}，${r}²=${r * r}，所以${right ? '是' : '不是'}直角三角形。`, 'zh-HK': `${p}²+${q}²=${p * p + q * q}，${r}²=${r * r}，所以${right ? '是' : '不是'}直角三角形。` }),
    });
  }
  const unknown = pick(random, ['a', 'b', 'c']); const answer = { a, b, c }[unknown];
  const known = unknown === 'c' ? `${a}²+${b}²=x²` : unknown === 'a' ? `x²+${b}²=${c}²` : `${a}²+x²=${c}²`;
  return item(text(profile, { ko: '직각삼각형에서 피타고라스 정리를 이용하여 x를 구하세요.', en: 'Use the Pythagorean theorem to find x.', 'zh-TW': '利用畢氏定理求直角三角形中的 x。', 'zh-HK': '利用畢氏定理求直角三角形中的 x。' }), answer, { kind: 'right-triangle', a, b, c, unknown }, {
    explanation: text(profile, { ko: `${known}에 값을 대입하고 양의 제곱근을 취하면 x=${answer}입니다.`, en: `Substitute into ${known} and take the positive square root to get x = ${answer}.`, 'zh-TW': `代入 ${known} 並取正平方根，得 x=${answer}。`, 'zh-HK': `代入 ${known} 並取正平方根，得 x=${answer}。` }),
  });
}

function formatFactor(variable, value) {
  if (value === 0) return variable;
  return `(${variable}${value > 0 ? '-' : '+'}${Math.abs(value)})`;
}

function coordinateGeometry(random, profile) {
  const variant = pick(random, ['midpoint', 'slope', 'distance', 'circle', 'division', 'lineEquation']);
  if (variant === 'midpoint') {
    const a = [randomInt(random, -2, 0) * 2, randomInt(random, -2, 0) * 2];
    const b = [a[0] + randomInt(random, 1, 2) * 2, a[1] + randomInt(random, 1, 2) * 2];
    const answer = `${(a[0] + b[0]) / 2},${(a[1] + b[1]) / 2}`;
    return item(text(profile, { ko: '좌표평면에서 선분 AB의 중점 좌표를 x,y 꼴로 구하세요.', en: 'Find the midpoint of AB in the form x,y.', 'zh-TW': '求線段 AB 的中點坐標，以 x,y 表示。', 'zh-HK': '求線段 AB 的中點坐標，以 x,y 表示。' }), answer, { kind: 'coordinate-geometry', a, b }, { explanation: text(profile, { ko: `중점은 두 좌표의 평균이므로 (${answer})입니다.`, en: `Average the x- and y-coordinates to obtain (${answer}).`, 'zh-TW': `分別取 x、y 坐標的平均，得 (${answer})。`, 'zh-HK': `分別取 x、y 坐標的平均，得 (${answer})。` }) });
  }
  if (variant === 'slope') {
    const dx = 2; const slope = pick(random, [-2, -1, 1, 2]); const a = [randomInt(random, -4, 0), slope > 0 ? randomInt(random, -4, 0) : randomInt(random, 0, 4)]; const b = [a[0] + dx, a[1] + slope * dx];
    return item(text(profile, { ko: '두 점 A, B를 지나는 직선의 기울기를 구하세요.', en: 'Find the slope of the line through A and B.', 'zh-TW': '求通過 A、B 兩點的直線斜率。', 'zh-HK': '求通過 A、B 兩點的直線斜率。' }), slope, { kind: 'coordinate-geometry', a, b }, { explanation: text(profile, { ko: `기울기=(y의 변화량)/(x의 변화량)=${b[1] - a[1]}/${b[0] - a[0]}=${slope}입니다.`, en: `Slope = change in y / change in x = ${b[1] - a[1]}/${b[0] - a[0]} = ${slope}.`, 'zh-TW': `斜率=y 的變化量/x 的變化量=${b[1] - a[1]}/${b[0] - a[0]}=${slope}。`, 'zh-HK': `斜率=y 的變化量/x 的變化量=${b[1] - a[1]}/${b[0] - a[0]}=${slope}。` }) });
  }
  if (variant === 'distance') {
    const a = [-2, -2]; const swapped = random() < 0.5; const b = swapped ? [2, 1] : [1, 2];
    return item(text(profile, { ko: '좌표평면에서 두 점 A, B 사이의 거리를 구하세요.', en: 'Find the distance between A and B.', 'zh-TW': '求坐標平面上 A、B 兩點的距離。', 'zh-HK': '求坐標平面上 A、B 兩點的距離。' }), 5, { kind: 'coordinate-geometry', a, b }, { explanation: text(profile, { ko: 'x좌표와 y좌표의 차가 3, 4이므로 거리는 √(3²+4²)=5입니다.', en: 'The coordinate differences are 3 and 4, so the distance is √(3² + 4²) = 5.', 'zh-TW': '坐標差為 3、4，所以距離為 √(3²+4²)=5。', 'zh-HK': '坐標差為 3、4，所以距離為 √(3²+4²)=5。' }) });
  }
  if (variant === 'division') {
    const [m, n] = pick(random, [[1, 2], [2, 1]]); const directionY = random() < 0.5 ? 1 : -1;
    const a = [randomInt(random, -4, -2), randomInt(random, -1, 1)]; const b = [a[0] + m + n, a[1] + directionY * (m + n)];
    const p = [a[0] + m, a[1] + directionY * m]; const answer = `${p[0]},${p[1]}`;
    return item(text(profile, { ko: `점 P가 선분 AB를 AP:PB=${m}:${n}으로 내분할 때 P의 좌표를 x,y 꼴로 구하세요.`, en: `Point P divides AB internally in the ratio AP:PB = ${m}:${n}. Find P in the form x,y.`, 'zh-TW': `點 P 以 AP:PB=${m}:${n} 內分線段 AB，求 P 的坐標，以 x,y 表示。`, 'zh-HK': `點 P 以 AP:PB=${m}:${n} 內分線段 AB，求 P 的坐標，以 x,y 表示。` }), answer, { kind: 'coordinate-geometry', a, b, p }, {
      explanation: text(profile, { ko: `내분점 공식 P=((nA+mB)/(m+n))을 적용하면 P=(${answer})입니다.`, en: `Using P = (nA + mB)/(m+n) gives P = (${answer}).`, 'zh-TW': `使用內分點公式 P=(nA+mB)/(m+n)，得 P=(${answer})。`, 'zh-HK': `使用內分點公式 P=(nA+mB)/(m+n)，得 P=(${answer})。` }),
    });
  }
  if (variant === 'lineEquation') {
    const slope = pick(random, [-2, -1, 1, 2]); const intercept = randomInt(random, -2, 2); const a = [-1, intercept - slope]; const b = [1, intercept + slope];
    const slopeTerm = slope === 1 ? 'x' : slope === -1 ? '-x' : `${slope}x`; const interceptTerm = intercept === 0 ? '' : `${intercept > 0 ? '+' : ''}${intercept}`; const answer = `y=${slopeTerm}${interceptTerm}`;
    return item(text(profile, { ko: '두 점 A, B를 지나는 직선의 방정식을 y=mx+b 꼴로 구하세요.', en: 'Find the equation of the line through A and B in the form y=mx+b.', 'zh-TW': '求通過 A、B 的直線方程式，以 y=mx+b 表示。', 'zh-HK': '求通過 A、B 的直線方程式，以 y=mx+b 表示。' }), answer, { kind: 'coordinate-geometry', a, b }, {
      explanation: text(profile, { ko: `기울기는 ${slope}이고 y절편은 ${intercept}이므로 직선의 방정식은 ${answer}입니다.`, en: `The slope is ${slope} and the y-intercept is ${intercept}, so the equation is ${answer}.`, 'zh-TW': `斜率為 ${slope}，y 截距為 ${intercept}，所以方程式為 ${answer}。`, 'zh-HK': `斜率為 ${slope}，y 截距為 ${intercept}，所以方程式為 ${answer}。` }),
    });
  }
  const center = [randomInt(random, -2, 2), randomInt(random, -2, 2)]; const radius = pick(random, [2, 3]);
  const a = [center[0] + radius, center[1]]; const b = [center[0], center[1] + radius];
  const expression = `${formatFactor('x', center[0])}² + ${formatFactor('y', center[1])}² = ${radius * radius}`;
  return item(text(profile, { ko: '주어진 원의 방정식에서 반지름을 구하세요.', en: 'Find the radius from the equation of the circle.', 'zh-TW': '由圓的方程式求半徑。', 'zh-HK': '由圓的方程式求半徑。' }), radius, { kind: 'coordinate-geometry', a, b, circle: { center, radius } }, { expression, explanation: text(profile, { ko: `표준형 (x-a)²+(y-b)²=r²과 비교하면 r²=${radius * radius}이므로 r=${radius}입니다.`, en: `Compare with (x-a)²+(y-b)²=r². Since r²=${radius * radius}, r=${radius}.`, 'zh-TW': `與標準式 (x-a)²+(y-b)²=r² 比較，r²=${radius * radius}，所以 r=${radius}。`, 'zh-HK': `與標準式 (x-a)²+(y-b)²=r² 比較，r²=${radius * radius}，所以 r=${radius}。` }) });
}

const foundationGenerators = [lineRaySegment, pointLinePlane, segmentPartition];
const visualGenerators = [angleNotation, visualAngle, intersectingAngles, perpendicularDistance];
const spatialGenerators = [solidElements, solidRelations, linePlaneRelations, planePlaneRelations];
const parallelGenerators = [parallelAngles, parallelJudgement, zigzagParallel];
const constructionGenerators = [rulerCompassConstruction];
const triangleRelationGenerators = [triangleSideAngleRelation, triangleInequality];
const similarityGenerators = [triangleCongruence, congruenceMapping, congruenceSufficiency, triangleSimilarity, triangleSimilarityRatios];
const advancedGenerators = [circleAndSector, ...similarityGenerators, pythagoreanTheorem, coordinateGeometry];
const regionalGenerators = [...foundationGenerators, ...visualGenerators, ...constructionGenerators, ...triangleRelationGenerators, ...spatialGenerators, ...parallelGenerators, triangleAngles, ...advancedGenerators];

export const CORE_GEOMETRY_UNITS = [
  {
    id: 'visual-foundations',
    labels: { ko: '점·선·면과 선분', en: 'Points, lines and planes', 'zh-TW': '點、線、面與線段', 'zh-HK': '點、線、面與線段' },
    descriptions: { ko: '직선·반직선·선분, 점의 위치와 선분의 등분을 그림으로 연습하기', en: 'Practise lines, rays, segments, point positions and equal partitions', 'zh-TW': '練習直線、射線、線段、點的位置與等分', 'zh-HK': '練習直線、射線、線段、點的位置與等分' },
    make: (random, profile) => pick(random, foundationGenerators)(random, profile),
  },
  {
    id: 'visual-angles',
    labels: { ko: '그림으로 보는 각', en: 'Angles from diagrams', 'zh-TW': '圖形中的角', 'zh-HK': '圖形中的角' },
    descriptions: { ko: '각의 종류와 맞꼭지각을 실제 그림으로 연습하기', en: 'Classify angles and use vertical angles in diagrams', 'zh-TW': '從圖形判斷角與對頂角', 'zh-HK': '從圖形判斷角與對頂角' },
    make: (random, profile) => pick(random, visualGenerators)(random, profile),
  },
  {
    id: 'perpendicular-distance',
    labels: { ko: '수직·수선과 거리', en: 'Perpendiculars and distance', 'zh-TW': '垂直、垂線與距離', 'zh-HK': '垂直、垂線與距離' },
    descriptions: { ko: '수선의 발과 점에서 직선까지의 거리 이해하기', en: 'Identify the foot of a perpendicular and point-to-line distance', 'zh-TW': '理解垂足與點到直線的距離', 'zh-HK': '理解垂足與點到直線的距離' },
    make: perpendicularDistance,
  },
  {
    id: 'parallel-lines',
    labels: { ko: '평행선과 각', en: 'Parallel lines and angles', 'zh-TW': '平行線與角', 'zh-HK': '平行線與角' },
    descriptions: { ko: '동위각·엇각·동측내각을 그림으로 계산하기', en: 'Use corresponding, alternate and co-interior angles', 'zh-TW': '利用同位角、內錯角及同側內角', 'zh-HK': '利用同位角、內錯角及同旁內角' },
    make: (random, profile) => pick(random, parallelGenerators)(random, profile),
  },
  {
    id: 'triangle-angles',
    labels: { ko: '삼각형의 각', en: 'Angles in triangles', 'zh-TW': '三角形的角', 'zh-HK': '三角形的角' },
    descriptions: { ko: '삼각형의 내각 관계를 이용한 계산', en: 'Use angle relationships in triangles', 'zh-TW': '運用三角形內角關係', 'zh-HK': '運用三角形內角關係' },
    make: triangleAngles,
  },
  {
    id: 'ruler-compass-construction',
    labels: { ko: '자와 컴퍼스 작도', en: 'Straightedge and compass', 'zh-TW': '直尺與圓規作圖', 'zh-HK': '直尺與圓規作圖' },
    descriptions: { ko: '같은 선분·각을 옮기고 평행선을 작도하는 원리 이해하기', en: 'Copy segments and angles and construct parallel lines', 'zh-TW': '理解複製線段、角及作平行線的原理', 'zh-HK': '理解複製線段、角及作平行線的原理' },
    make: rulerCompassConstruction,
  },
  {
    id: 'triangle-side-angle-relations',
    labels: { ko: '삼각형의 변·각과 성립 조건', en: 'Triangle sides, angles and existence', 'zh-TW': '三角形的邊角與成立條件', 'zh-HK': '三角形的邊角與成立條件' },
    descriptions: { ko: '대변·대각 관계, 변과 각의 대소, 삼각형 부등식 판단하기', en: 'Use opposite side-angle relations and the triangle inequality', 'zh-TW': '運用對邊對角關係與三角不等式', 'zh-HK': '運用對邊對角關係與三角不等式' },
    make: (random, profile) => pick(random, triangleRelationGenerators)(random, profile),
  },
  {
    id: 'circle-sector',
    labels: { ko: '원과 부채꼴', en: 'Circles and sectors', 'zh-TW': '圓與扇形', 'zh-HK': '圓與扇形' },
    descriptions: { ko: '원의 둘레·반지름과 부채꼴의 호·넓이·중심각을 순방향과 역방향으로 계산하기', en: 'Solve circumference, radius, arc, sector area and central-angle problems in both directions', 'zh-TW': '正向與反向計算圓周、半徑、弧長、扇形面積及圓心角', 'zh-HK': '正向與反向計算圓周、半徑、弧長、扇形面積及圓心角' },
    make: circleAndSector,
  },
  {
    id: 'triangle-congruence-similarity',
    labels: { ko: '삼각형의 합동과 닮음', en: 'Triangle congruence and similarity', 'zh-TW': '三角形全等與相似', 'zh-HK': '三角形全等與相似' },
    descriptions: { ko: '합동 조건·대응 관계와 닮음의 대응변·둘레비·넓이비 구하기', en: 'Use congruence correspondence and similarity side, perimeter and area ratios', 'zh-TW': '判斷全等對應，並求相似圖形的對應邊、周長比及面積比', 'zh-HK': '判斷全等對應，並求相似圖形的對應邊、周界比及面積比' },
    make: (random, profile) => pick(random, similarityGenerators)(random, profile),
  },
  {
    id: 'pythagorean-theorem',
    labels: { ko: '피타고라스 정리', en: 'Pythagorean theorem', 'zh-TW': '畢氏定理', 'zh-HK': '畢氏定理' },
    descriptions: { ko: '미지변·직사각형 대각선 계산과 피타고라스 정리의 역 판별하기', en: 'Find missing sides and rectangle diagonals and use the converse theorem', 'zh-TW': '求未知邊與長方形對角線，並使用畢氏定理逆命題判斷', 'zh-HK': '求未知邊與長方形對角線，並使用畢氏定理逆命題判斷' },
    make: pythagoreanTheorem,
  },
  {
    id: 'high-coordinate-geometry',
    labels: { ko: '고등 좌표기하', en: 'High-school coordinate geometry', 'zh-TW': '高中坐標幾何', 'zh-HK': '高中坐標幾何' },
    descriptions: { ko: '중점·내분점·기울기·거리·직선과 원의 방정식 연습하기', en: 'Practise midpoint, section formula, slope, distance, line and circle equations', 'zh-TW': '練習中點、內分點、斜率、距離、直線及圓的方程式', 'zh-HK': '練習中點、內分點、斜率、距離、直線及圓的方程式' },
    make: coordinateGeometry,
  },
  {
    id: 'solid-elements',
    labels: { ko: '각뿔·각기둥의 구성 요소', en: 'Faces, vertices and edges', 'zh-TW': '錐體與柱體的組成', 'zh-HK': '錐體與柱體的組成' },
    descriptions: { ko: '삼각뿔과 삼각기둥의 면·꼭짓점·모서리 개수 구하기', en: 'Count faces, vertices and edges of pyramids and prisms', 'zh-TW': '計算三角錐與三角柱的面、頂點及稜', 'zh-HK': '計算三角錐與三角柱的面、頂點及稜' },
    make: solidElements,
  },
  {
    id: 'solid-relations',
    labels: { ko: '공간도형의 위치 관계', en: 'Relationships in three dimensions', 'zh-TW': '空間中的位置關係', 'zh-HK': '空間中的位置關係' },
    descriptions: { ko: '직선·평면·두 평면의 평행·수직·꼬인 위치 판별하기', en: 'Classify lines, line-plane and plane-plane relationships', 'zh-TW': '判斷直線、直線與平面、兩平面的位置關係', 'zh-HK': '判斷直線、直線與平面、兩平面的位置關係' },
    make: (random, profile) => pick(random, spatialGenerators)(random, profile),
  },
  {
    id: 'regional-geometry-mixed',
    labels: { ko: '지역별 도형 종합', en: 'Regional geometry review', 'zh-TW': '地區課程幾何綜合', 'zh-HK': '地區課程幾何綜合' },
    descriptions: { ko: '선택한 교육과정의 언어·난이도·문항 형식으로 구성', en: 'Uses the selected curriculum language, difficulty and question style', 'zh-TW': '依所選課程的語言、難度與題型出題', 'zh-HK': '按所選課程的語言、難度及題型出題' },
    make: (random, profile) => {
      const pool = profile.id === 'amc' ? [...regionalGenerators, parallelAngles, triangleAngles] : regionalGenerators;
      return pick(random, pool)(random, profile);
    },
  },
];

export function localizeCoreUnit(unit, profile, field = 'label') {
  return profileText(profile, field === 'label' ? unit.labels : unit.descriptions);
}
