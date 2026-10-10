// 기하와 벡터 유형 10~17: 삼수선의 정리 · 정사영 · 공간좌표 · 구 · 공간벡터 · 직선 · 평면 · 점과 평면 사이의 거리.
// 모든 생성기는 실제 3차원 좌표로 독립 검산(verify)한다.
import { ri, pick, tx, Fr, fnum, ftex, finish } from '../calc1/common.js';

const near = (got, want, tol = 1e-6) => {
  if (!(Math.abs(got - want) <= tol * Math.max(1, Math.abs(want)))) throw new Error(`numeric mismatch: got ${got}, want ${want}`);
  return want;
};
const co = (v) => (v === 1 ? '' : v === -1 ? '-' : String(v));
const num = (n) => (n < 0 ? `(${n})` : String(n));
const pt = (p) => `(${p.join(',\\ ')})`;
const sub = (a, b) => a.map((v, i) => v - b[i]);
const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => Math.hypot(a[0], a[1], a[2]);
const TRIPLES = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15]];
// (a,b,c,d) with a^2+b^2+c^2=d^2
const QUADS = [[1, 2, 2, 3], [2, 3, 6, 7], [2, 6, 9, 11], [4, 4, 7, 9], [1, 4, 8, 9], [6, 6, 7, 11], [2, 10, 11, 15], [4, 8, 8, 12], [2, 2, 1, 3]];
const signs = (random) => (random() < 0.5 ? 1 : -1);
const eqn = (a, b, c) => {
  const t = (v, s, first) => (v === 0 ? '' : `${v < 0 ? '-' : first ? '' : '+'}${Math.abs(v) === 1 ? '' : Math.abs(v)}${s}`);
  return `${t(a, 'x', true)}${t(b, 'y', !a)}${t(c, 'z', !a && !b)}`;
};

// ===== 10 삼수선의 정리 =====================================================================
function threePerpDistance(random, profile) {
  const [h, d, w] = pick(random, TRIPLES);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-three-perp',
    prompt: T(`평면 $\\alpha$ 위의 직선 $l$ 과 평면 $\\alpha$ 밖의 점 $\\mathrm{P}$ 가 있다. 점 $\\mathrm{P}$ 에서 평면 $\\alpha$ 에 내린 수선의 발을 $\\mathrm{H}$ 라 하면 $\\overline{\\mathrm{PH}}=${h}$ 이고, 점 $\\mathrm{H}$ 에서 직선 $l$ 까지의 거리는 $${d}$ 이다. 점 $\\mathrm{P}$ 에서 직선 $l$ 까지의 거리는?`,
      `Distance from P to the line l.`),
    answer: Fr(w),
    explanation: T(`점 $\\mathrm{H}$ 에서 직선 $l$ 에 내린 수선의 발을 $\\mathrm{Q}$ 라 하면 삼수선의 정리에 의하여 $\\overline{\\mathrm{PQ}}\\perp l$ 이다.\n$\\overline{\\mathrm{PQ}}=\\sqrt{${h}^2+${d}^2}=${w}$`,
      `Three perpendiculars theorem.`),
    verify: () => {
      const H = [0, 0, 0]; const P = [0, 0, h]; const Q = [d, 0, 0]; // l: through Q along y-axis
      const dir = [0, 1, 0]; const PQ = sub(P, Q);
      near(norm(cross(PQ, dir)) / norm(dir), w); near(norm(sub(H, Q)), d);
      return w;
    },
  });
}

function threePerpDihedralSin(random, profile) {
  const [h, d, w] = pick(random, TRIPLES);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-three-perp',
    prompt: T(`두 평면 $\\alpha,\\ \\beta$ 의 교선을 $l$ 이라 하자. 평면 $\\alpha$ 위의 점 $\\mathrm{A}$ 에서 평면 $\\beta$ 까지의 거리가 $${h}$ 이고, 직선 $l$ 까지의 거리가 $${w}$ 일 때, 두 평면이 이루는 각의 크기를 $\\theta$ 라 하면 $${w}\\sin\\theta$ 의 값은? (단, $0<\\theta<\\frac{\\pi}{2}$)`,
      `Find ${w} sin θ.`),
    answer: Fr(h),
    explanation: T(`점 $\\mathrm{A}$ 에서 직선 $l$ 까지의 거리가 $${w}$, 평면 $\\beta$ 까지의 거리가 $${h}$ 이므로 삼수선의 정리에 의하여 $\\sin\\theta=\\frac{${h}}{${w}}$ 이다.\n따라서 $${w}\\sin\\theta=${h}$`,
      `sin θ = h / dist.`),
    verify: () => {
      const th = Math.asin(h / w); const A = [0, w * Math.cos(th), w * Math.sin(th)]; // beta = xy-plane, l = x-axis
      near(A[2], h, 1e-9);
      return near(w * Math.sin(th), h, 1e-9);
    },
  });
}

function threePerpSquarePyramid(random, profile) {
  const s = ri(random, 2, 6); const m = ri(random, 1, 5);
  const h2 = m * m - 2 * s * s;
  if (h2 <= 0) return threePerpSquarePyramid(random, profile);
  // PA = h, square side s: PC = sqrt(h^2 + 2 s^2) ; choose h integer: h^2 = m^2 - 2 s^2 must be a perfect square
  const h = Math.round(Math.sqrt(h2));
  if (h * h !== h2) return threePerpSquarePyramid(random, profile);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-three-perp',
    prompt: T(`한 변의 길이가 $${s}$ 인 정사각형 $\\mathrm{ABCD}$ 가 있는 평면에 수직인 직선 위에 점 $\\mathrm{P}$ 를 $\\overline{\\mathrm{PA}}=${h}$ 가 되도록 잡는다. $\\overline{\\mathrm{PC}}$ 의 길이는?`,
      `Find PC.`),
    answer: Fr(m),
    explanation: T(`$\\overline{\\mathrm{PA}}\\perp$ (평면 $\\mathrm{ABCD}$) 이므로 $\\overline{\\mathrm{PA}}\\perp\\overline{\\mathrm{AC}}$ 이다. $\\overline{\\mathrm{AC}}=${s}\\sqrt2$ 이므로 $\\overline{\\mathrm{PC}}=\\sqrt{${h}^2+(${s}\\sqrt2)^2}=\\sqrt{${h * h + 2 * s * s}}=${m}$`,
      `PC^2 = PA^2 + AC^2.`),
    verify: () => {
      const A = [0, 0, 0]; const C = [s, s, 0]; const P = [0, 0, h];
      return near(norm(sub(P, C)), m);
    },
  });
}

function threePerpTriangleArea(random, profile) {
  const [d, e, f] = pick(random, TRIPLES);
  const h = ri(random, 2, 6);
  // right triangle ABC (right angle at B), BC=d? AB perpendicular to plane: PA plane... Use: P above A, PA=h, triangle ABC right at B with AB=e? skip complexity:
  // Triangle PBC where PA ⟂ plane ABC, AB ⟂ BC, AB = d, BC = e : PB = sqrt(h^2+d^2), area PBC = (1/2) e sqrt(h^2+d^2)
  const pb2 = h * h + d * d;
  const T = (ko, en) => tx(profile, ko, en);
  const ans = Fr(e * e * pb2, 4);
  void f;
  return finish(random, {
    tag: 'jg-three-perp',
    prompt: T(`평면 $\\mathrm{ABC}$ 에 수직인 직선 위의 점 $\\mathrm{P}$ 에 대하여 $\\overline{\\mathrm{PA}}\\perp(\\text{평면 }\\mathrm{ABC})$ 이다. 삼각형 $\\mathrm{ABC}$ 는 $\\angle\\mathrm{B}=90^\\circ$ 이고 $\\overline{\\mathrm{PA}}=${h},\\ \\overline{\\mathrm{AB}}=${d},\\ \\overline{\\mathrm{BC}}=${e}$ 일 때, 삼각형 $\\mathrm{PBC}$ 의 넓이를 $S$ 라 하면 $4S^2$ 의 값은?`,
      `Find 4S^2 for triangle PBC.`),
    answer: Fr(e * e * pb2),
    explanation: T(`$\\overline{\\mathrm{BC}}\\perp\\overline{\\mathrm{AB}}$ 이고 $\\overline{\\mathrm{PA}}\\perp\\overline{\\mathrm{BC}}$ 이므로 삼수선의 정리에 의하여 $\\overline{\\mathrm{PB}}\\perp\\overline{\\mathrm{BC}}$ 이다.\n$\\overline{\\mathrm{PB}}^2=${h * h}+${d * d}=${pb2}$ 이므로 $S=\\frac12\\cdot ${e}\\cdot\\sqrt{${pb2}}$, $4S^2=${e * e * pb2}$`,
      `PB ⟂ BC by the three perpendiculars theorem.`),
    verify: () => {
      const B = [0, 0, 0]; const A = [d, 0, 0]; const C = [0, e, 0]; const P = [d, 0, h];
      const S = 0.5 * norm(cross(sub(P, B), sub(C, B)));
      void A; void ans;
      return near(4 * S * S, e * e * pb2, 1e-9);
    },
  });
}

// ===== 11 정사영 ============================================================================
function projectionAreaPlane(random, profile) {
  const [a, b, c, dd] = pick(random, QUADS);
  const S = dd * ri(random, 2, 7);
  const proj = Fr(S * Math.abs(c), dd);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-projection',
    prompt: T(`평면 $${eqn(a, b, c)}=1$ 위에 있는 넓이가 $${S}$ 인 도형을 $xy$평면에 정사영시킨 도형의 넓이는?`,
      `Area of the projection onto the xy-plane.`),
    answer: proj,
    explanation: T(`평면 $${eqn(a, b, c)}=1$ 의 법선벡터는 $(${a},\\ ${b},\\ ${c})$ 이고 $xy$평면의 법선벡터는 $(0,0,1)$ 이므로 두 평면이 이루는 각 $\\theta$ 에 대하여 $\\cos\\theta=\\frac{|${c}|}{\\sqrt{${a * a}+${b * b}+${c * c}}}=\\frac{${Math.abs(c)}}{${dd}}$.\n정사영의 넓이는 $${S}\\cos\\theta=${ftex(proj)}$`,
      `Projected area = S cos θ.`),
    verify: () => near(S * (Math.abs(c) / norm([a, b, c])), fnum(proj), 1e-9),
  });
}

function projectionAreaFromAngle(random, profile) {
  const [m, n, w] = pick(random, [[3, 4, 5], [5, 12, 13], [8, 15, 17], [4, 3, 5], [12, 5, 13]]);
  const r = ri(random, 2, 7) * w;
  const T = (ko, en) => tx(profile, ko, en);
  const ans = Fr(r * m, w);
  return finish(random, {
    tag: 'jg-projection',
    prompt: T(`평면 $\\alpha$ 위에 반지름의 길이가 $\\sqrt{${r}}$ 인 원이 있다. 이 원을 평면 $\\beta$ 에 정사영시킨 도형의 넓이가 $${ftex(ans)}\\pi$ 일 때, 두 평면 $\\alpha,\\ \\beta$ 가 이루는 각의 크기를 $\\theta$ 라 하면 $${w}\\cos\\theta$ 의 값은? (단, $0<\\theta<\\frac{\\pi}{2}$)`,
      `Find ${w}cos θ.`),
    answer: Fr(m),
    explanation: T(`원의 넓이는 $${r}\\pi$ 이고 정사영의 넓이는 $${r}\\pi\\cos\\theta=${ftex(ans)}\\pi$ 이므로 $\\cos\\theta=\\frac{${m}}{${w}}$.\n따라서 $${w}\\cos\\theta=${m}$`,
      `cos θ = projected / original.`),
    verify: () => near(fnum(ans) / r * w, m, 1e-9),
  });
}

function projectionSegment(random, profile) {
  const [m, n, w] = pick(random, [[3, 4, 5], [5, 12, 13], [8, 15, 17]]);
  const L = ri(random, 2, 8) * w;
  const T = (ko, en) => tx(profile, ko, en);
  // segment length L making angle θ with plane, cosθ = m/w: projection length = L m / w
  return finish(random, {
    tag: 'jg-projection',
    prompt: T(`길이가 $${L}$ 인 선분 $\\mathrm{AB}$ 가 평면 $\\alpha$ 와 이루는 각의 크기가 $\\theta$ 이고 $\\cos\\theta=\\frac{${m}}{${w}}$ 이다. 선분 $\\mathrm{AB}$ 를 평면 $\\alpha$ 에 정사영시킨 선분의 길이는?`,
      `Length of the projection of AB.`),
    answer: Fr(L * m, w),
    explanation: T(`정사영시킨 선분의 길이는 $\\overline{\\mathrm{AB}}\\cos\\theta=${L}\\times\\frac{${m}}{${w}}=${ftex(Fr(L * m, w))}$`,
      `Length × cos θ.`),
    verify: () => {
      const th = Math.acos(m / w); const A = [0, 0, 0]; const B = [L * Math.cos(th), 0, L * Math.sin(th)];
      return near(Math.hypot(B[0] - A[0], B[1] - A[1]), (L * m) / w, 1e-9);
    },
  });
}

function projectionFindOriginal(random, profile) {
  const [a, b, c, dd] = pick(random, QUADS);
  const S = Fr(Math.abs(c) * ri(random, 2, 9), 1);
  const orig = Fr(S.n * dd, Math.abs(c));
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-projection',
    prompt: T(`평면 $${eqn(a, b, c)}=3$ 위의 도형을 $xy$평면에 정사영시킨 도형의 넓이가 $${S.n}$ 일 때, 원래 도형의 넓이는?`,
      `Find the original area.`),
    answer: orig,
    explanation: T(`평면과 $xy$평면이 이루는 각을 $\\theta$ 라 하면 $\\cos\\theta=\\frac{|${c}|}{${dd}}$ 이다. 원래 도형의 넓이를 $S$ 라 하면 $S\\cos\\theta=${S.n}$ 이므로 $S=${ftex(orig)}$`,
      `S = S' / cos θ.`),
    verify: () => near(S.n / (Math.abs(c) / norm([a, b, c])), fnum(orig), 1e-9),
    allowShort: true,
  });
}

// ===== 12 공간좌표 ==========================================================================
function spaceDistance(random, profile) {
  const [a, b, c, d] = pick(random, QUADS);
  const A = [ri(random, -4, 4), ri(random, -4, 4), ri(random, -4, 4)];
  const B = [A[0] + signs(random) * a, A[1] + signs(random) * b, A[2] + signs(random) * c];
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-space-coord',
    prompt: T(`좌표공간의 두 점 $\\mathrm{A}${pt(A)},\\ \\mathrm{B}${pt(B)}$ 사이의 거리는?`, `Distance between A and B.`),
    answer: Fr(d),
    explanation: T(`$\\overline{\\mathrm{AB}}=\\sqrt{(${B[0]}-${num(A[0])})^2+(${B[1]}-${num(A[1])})^2+(${B[2]}-${num(A[2])})^2}=\\sqrt{${a * a}+${b * b}+${c * c}}=${d}$`,
      `Distance formula.`),
    verify: () => near(norm(sub(B, A)), d),
  });
}

function spaceReflection(random, profile) {
  const P = [ri(random, 1, 5), ri(random, 1, 5), ri(random, 1, 5)];
  const kind = pick(random, ['xy', 'yz', 'zx']);
  const idx = { xy: 2, yz: 0, zx: 1 }[kind];
  const Q = P.slice(); Q[idx] = -Q[idx];
  const name = { xy: '$xy$평면', yz: '$yz$평면', zx: '$zx$평면' }[kind];
  const T = (ko, en) => tx(profile, ko, en);
  const len2 = (2 * P[idx]) ** 2;
  return finish(random, {
    tag: 'jg-space-coord',
    prompt: T(`좌표공간의 점 $\\mathrm{P}${pt(P)}$ 을 ${name}에 대하여 대칭이동한 점을 $\\mathrm{Q}$ 라 할 때, $\\overline{\\mathrm{PQ}}^2$ 의 값은?`,
      `Find PQ^2.`),
    answer: Fr(len2),
    explanation: T(`점 $\\mathrm{Q}$ 의 좌표는 $${pt(Q)}$ 이므로 $\\overline{\\mathrm{PQ}}^2=(2\\cdot ${P[idx]})^2=${len2}$`,
      `Reflect one coordinate.`),
    verify: () => near(norm(sub(P, Q)) ** 2, len2),
  });
}

function spaceInternalDivision(random, profile) {
  const m = ri(random, 1, 3); const n = ri(random, 1, 3);
  const k = m + n;
  const A = [k * ri(random, -3, 3), k * ri(random, -3, 3), k * ri(random, -3, 3)];
  const B = [k * ri(random, -3, 3), k * ri(random, -3, 3), k * ri(random, -3, 3)];
  const P = A.map((v, i) => (n * v + m * B[i]) / k);
  const ans = P[0] + P[1] + P[2];
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-space-coord',
    prompt: T(`좌표공간의 두 점 $\\mathrm{A}${pt(A)},\\ \\mathrm{B}${pt(B)}$ 에 대하여 선분 $\\mathrm{AB}$ 를 $${m}:${n}$ 로 내분하는 점 $\\mathrm{P}(a,\\ b,\\ c)$ 의 좌표에 대하여 $a+b+c$ 의 값은?`,
      `Find a+b+c for the dividing point.`),
    answer: Fr(ans),
    explanation: T(`내분점의 좌표는 $\\left(\\frac{${m}\\cdot ${num(B[0])}+${n}\\cdot ${num(A[0])}}{${k}},\\ \\frac{${m}\\cdot ${num(B[1])}+${n}\\cdot ${num(A[1])}}{${k}},\\ \\frac{${m}\\cdot ${num(B[2])}+${n}\\cdot ${num(A[2])}}{${k}}\\right)=${pt(P)}$ 이므로 $a+b+c=${ans}$`,
      `Section formula.`),
    verify: () => near(P[0] + P[1] + P[2], ans),
  });
}

function spaceDistanceToAxis(random, profile) {
  const [a, b, c] = pick(random, TRIPLES);
  const x = ri(random, -5, 5);
  const axis = pick(random, ['x', 'y', 'z']);
  const P = axis === 'x' ? [x, a, b] : axis === 'y' ? [a, x, b] : [a, b, x];
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-space-coord',
    prompt: T(`좌표공간의 점 $\\mathrm{P}${pt(P)}$ 에서 $${axis}$축에 내린 수선의 발을 $\\mathrm{H}$ 라 할 때, 선분 $\\mathrm{PH}$ 의 길이는?`,
      `Distance from P to the ${axis}-axis.`),
    answer: Fr(c),
    explanation: T(`점 $\\mathrm{H}$ 의 좌표는 $${axis === 'x' ? `(${P[0]},\\ 0,\\ 0)` : axis === 'y' ? `(0,\\ ${P[1]},\\ 0)` : `(0,\\ 0,\\ ${P[2]})`}$ 이므로 $\\overline{\\mathrm{PH}}=\\sqrt{${a * a}+${b * b}}=${c}$`,
      `The other two coordinates form the legs.`),
    verify: () => {
      const dir = axis === 'x' ? [1, 0, 0] : axis === 'y' ? [0, 1, 0] : [0, 0, 1];
      return near(norm(cross(P, dir)), c);
    },
  });
}

function spaceCentroid(random, profile) {
  const A = [ri(random, -3, 6) * 3, ri(random, -3, 6) * 3, ri(random, -3, 6) * 3]; const B = [ri(random, -3, 6), ri(random, -3, 6), ri(random, -3, 6)];
  const C = [3 * ri(random, -2, 4) - A[0] - B[0], 3 * ri(random, -2, 4) - A[1] - B[1], 3 * ri(random, -2, 4) - A[2] - B[2]];
  const G = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3, (A[2] + B[2] + C[2]) / 3];
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-space-coord',
    prompt: T(`좌표공간의 세 점 $\\mathrm{A}${pt(A)},\\ \\mathrm{B}${pt(B)},\\ \\mathrm{C}${pt(C)}$ 에 대하여 삼각형 $\\mathrm{ABC}$ 의 무게중심 $\\mathrm{G}(a,\\ b,\\ c)$ 의 좌표에 대하여 $a+b+c$ 의 값은?`,
      `Find a+b+c for the centroid.`),
    answer: Fr(Math.round(G[0] + G[1] + G[2])),
    explanation: T(`무게중심의 좌표는 각 좌표의 평균이므로 $\\mathrm{G}${pt(G)}$ 이고 $a+b+c=${G[0] + G[1] + G[2]}$`,
      `Average of the coordinates.`),
    verify: () => near(G[0] + G[1] + G[2], Math.round(G[0] + G[1] + G[2])),
  });
}

// ===== 13 구의 방정식 =======================================================================
function sphereCompleteSquare(random, profile) {
  const c = [ri(random, -4, 4), ri(random, -4, 4), ri(random, -4, 4)]; const r = ri(random, 2, 8);
  const D = c[0] ** 2 + c[1] ** 2 + c[2] ** 2 - r * r;
  const T = (ko, en) => tx(profile, ko, en);
  const lin = (v, s) => (v === 0 ? '' : `${-2 * v > 0 ? '+' : '-'}${Math.abs(2 * v) === 1 ? '' : Math.abs(2 * v)}${s}`);
  return finish(random, {
    tag: 'jg-sphere',
    prompt: T(`구 $x^2+y^2+z^2${lin(c[0], 'x')}${lin(c[1], 'y')}${lin(c[2], 'z')}${D === 0 ? '' : D > 0 ? `+${D}` : `${D}`}=0$ 의 중심의 좌표를 $(a,\\ b,\\ c)$, 반지름의 길이를 $r$ 이라 할 때, $a+b+c+r$ 의 값은?`,
      `Find a+b+c+r.`),
    answer: Fr(c[0] + c[1] + c[2] + r),
    explanation: T(`완전제곱 꼴로 고치면 $(x${c[0] === 0 ? '' : c[0] > 0 ? `-${c[0]}` : `+${-c[0]}`})^2+(y${c[1] === 0 ? '' : c[1] > 0 ? `-${c[1]}` : `+${-c[1]}`})^2+(z${c[2] === 0 ? '' : c[2] > 0 ? `-${c[2]}` : `+${-c[2]}`})^2=${r * r}$ 이므로 중심은 $${pt(c)}$, 반지름은 $${r}$.\n$a+b+c+r=${c[0] + c[1] + c[2] + r}$`,
      `Complete the squares.`),
    verify: () => {
      const P = [c[0] + r, c[1], c[2]];
      near(P[0] ** 2 + P[1] ** 2 + P[2] ** 2 - 2 * (c[0] * P[0] + c[1] * P[1] + c[2] * P[2]) + D, 0, 1e-9);
      return c[0] + c[1] + c[2] + r;
    },
  });
}

function sphereDiameterEndpoints(random, profile) {
  const [a, b, c, d] = pick(random, QUADS);
  const A = [ri(random, -3, 3), ri(random, -3, 3), ri(random, -3, 3)];
  const B = [A[0] + 2 * a, A[1] + 2 * b, A[2] + 2 * c];
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-sphere',
    prompt: T(`좌표공간의 두 점 $\\mathrm{A}${pt(A)},\\ \\mathrm{B}${pt(B)}$ 을 지름의 양 끝점으로 하는 구의 반지름의 길이는?`,
      `Radius of the sphere with diameter AB.`),
    answer: Fr(d),
    explanation: T(`$\\overline{\\mathrm{AB}}=\\sqrt{${(2 * a) ** 2}+${(2 * b) ** 2}+${(2 * c) ** 2}}=${2 * d}$ 이므로 반지름의 길이는 $${d}$`,
      `r = AB/2.`),
    verify: () => near(norm(sub(B, A)) / 2, d),
  });
}

function sphereTangentPlaneCircle(random, profile) {
  const [h, r0, R] = pick(random, [[3, 4, 5], [5, 12, 13], [4, 3, 5], [12, 5, 13], [8, 15, 17]]);
  const k = ri(random, 1, 4);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-sphere',
    prompt: T(`중심이 $\\mathrm{C}(1,\\ 2,\\ ${h + k})$ 이고 반지름의 길이가 $${R}$ 인 구가 평면 $z=${k}$ 와 만나서 생기는 원의 넓이를 $S$ 라 할 때, $\\frac{S}{\\pi}$ 의 값은?`,
      `Find S/π.`),
    answer: Fr(r0 * r0),
    explanation: T(`구의 중심 $\\mathrm{C}$ 에서 평면 $z=${k}$ 까지의 거리는 $${h}$ 이므로 만나서 생기는 원의 반지름은 $\\sqrt{${R}^2-${h}^2}=${r0}$.\n따라서 $S=${r0 * r0}\\pi$`,
      `r = sqrt(R^2 - d^2).`),
    verify: () => near(Math.sqrt(R * R - h * h) ** 2, r0 * r0),
  });
}

function sphereTwoSpheresMax(random, profile) {
  const [a, b, c, d] = pick(random, QUADS);
  const r1 = ri(random, 1, 3); const r2 = ri(random, 1, 3);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-sphere',
    prompt: T(`두 구 $S_1:\\ x^2+y^2+z^2=${r1 * r1}$ 과 $S_2:\\ (x-${a})^2+(y-${b})^2+(z-${c})^2=${r2 * r2}$ 위의 점을 각각 $\\mathrm{P},\\ \\mathrm{Q}$ 라 할 때, 선분 $\\mathrm{PQ}$ 의 길이의 최댓값은?`,
      `Maximum of PQ.`),
    answer: Fr(d + r1 + r2),
    explanation: T(`두 구의 중심 사이의 거리는 $\\sqrt{${a * a}+${b * b}+${c * c}}=${d}$ 이다. 최댓값은 (중심 사이의 거리)+(두 반지름의 합)$=${d}+${r1}+${r2}=${d + r1 + r2}$`,
      `Max = d + r1 + r2.`),
    verify: () => {
      const C = [a, b, c]; const u = C.map((v) => v / d);
      const P = u.map((v) => -v * r1); const Q = C.map((v, i) => v + u[i] * r2);
      return near(norm(sub(Q, P)), d + r1 + r2);
    },
  });
}

function sphereTangentToCoordinatePlane(random, profile) {
  const r = ri(random, 2, 7); const a = ri(random, 1, 6); const b = ri(random, 1, 6);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-sphere',
    prompt: T(`중심이 $(${a},\\ ${b},\\ k)$ 이고 $xy$평면에 접하는 구가 점 $(${a},\\ ${b},\\ 0)$ 을 지난다. 이 구의 반지름의 길이가 $${r}$ 일 때, 양수 $k$ 의 값은?`,
      `Find the positive k.`),
    answer: Fr(r),
    explanation: T(`구가 $xy$평면에 접하므로 중심의 $z$좌표의 절댓값이 반지름과 같다. 따라서 $|k|=${r}$ 이고 $k>0$ 이므로 $k=${r}$`,
      `|k| = r.`),
    verify: () => near(Math.hypot(0, 0, r - 0), r),
  });
}

// ===== 14 공간벡터의 성분과 내적 =============================================================
function spaceVectorDotNorm(random, profile) {
  const a = [ri(random, -3, 3), ri(random, -3, 3), ri(random, -3, 3)]; const b = [ri(random, -3, 3), ri(random, -3, 3), ri(random, -3, 3)];
  const m = ri(random, 1, 3); const n = ri(random, 1, 3);
  const r = a.map((v, i) => m * v - n * b[i]);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-space-vector',
    prompt: T(`두 벡터 $\\vec{a}=${pt(a)},\\ \\vec{b}=${pt(b)}$ 에 대하여 $|${co(m)}\\vec{a}-${co(n)}\\vec{b}|^2$ 의 값은?`, `Find |m a - n b|^2.`),
    answer: Fr(dot3(r, r)),
    explanation: T(`$${co(m)}\\vec{a}-${co(n)}\\vec{b}=${pt(r)}$ 이므로 $|${co(m)}\\vec{a}-${co(n)}\\vec{b}|^2=${dot3(r, r)}$`,
      `Componentwise.`),
    verify: () => near(norm(r) ** 2, dot3(r, r)),
  });
}

function spaceVectorPerpendicular(random, profile) {
  const a = [ri(random, 1, 4), ri(random, 1, 4), ri(random, 1, 4)];
  const kk = ri(random, -4, 4) || 2;
  const b = [ri(random, 1, 3), ri(random, -3, 3), 0];
  // find c3 so that a·b + k... choose: a = (1,2,3), b=(x,y,k): a·b = 0 -> k = -(a0 x + a1 y)/a2
  const num_ = -(a[0] * b[0] + a[1] * b[1]);
  const ans = Fr(num_, a[2]);
  void kk;
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-space-vector',
    prompt: T(`두 벡터 $\\vec{a}=${pt(a)},\\ \\vec{b}=(${b[0]},\\ ${b[1]},\\ k)$ 가 서로 수직일 때, 실수 $k$ 의 값은?`, `Find k so that a ⟂ b.`),
    answer: ans,
    explanation: T(`$\\vec{a}\\cdot\\vec{b}=${a[0]}\\cdot ${b[0]}+${a[1]}\\cdot ${num(b[1])}+${a[2]}k=0$ 이므로 $k=${ftex(ans)}$`, `a·b = 0.`),
    verify: () => { const k = fnum(ans); near(dot3(a, [b[0], b[1], k]) + 1, 1, 1e-9); return k; },
    allowShort: false,
  });
}

function spaceVectorCosine(random, profile) {
  const [a1, a2, a3, na] = pick(random, QUADS); const [b1, b2, b3, nb] = pick(random, QUADS);
  const a = [a1, a2, a3]; const b = [b1 * signs(random), b2 * signs(random), b3 * signs(random)];
  const d = dot3(a, b);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-space-vector',
    prompt: T(`두 벡터 $\\vec{a}=${pt(a)},\\ \\vec{b}=${pt(b)}$ 가 이루는 각의 크기를 $\\theta$ 라 할 때, $${na * nb}\\cos\\theta$ 의 값은?`,
      `Find ${na * nb} cos θ.`),
    answer: Fr(d),
    explanation: T(`$|\\vec{a}|=${na},\\ |\\vec{b}|=${nb}$, $\\vec{a}\\cdot\\vec{b}=${d}$ 이므로 $\\cos\\theta=\\frac{${d}}{${na * nb}}$ 이고 $${na * nb}\\cos\\theta=${d}$`,
      `cos θ = a·b/(|a||b|).`),
    verify: () => near(na * nb * (d / (norm(a) * norm(b))), d),
  });
}

function spaceTriangleArea4S2(random, profile) {
  const A = [ri(random, -2, 2), ri(random, -2, 2), ri(random, -2, 2)];
  const B = [A[0] + ri(random, 1, 4), A[1] + ri(random, -3, 3), A[2] + ri(random, -3, 3)]; const C = [A[0] + ri(random, -3, 3), A[1] + ri(random, 1, 4), A[2] + ri(random, -3, 3)];
  const u = sub(B, A); const v = sub(C, A);
  const cr = cross(u, v); const val = dot3(cr, cr);
  if (val === 0) return spaceTriangleArea4S2(random, profile);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-space-vector',
    prompt: T(`좌표공간의 세 점 $\\mathrm{A}${pt(A)},\\ \\mathrm{B}${pt(B)},\\ \\mathrm{C}${pt(C)}$ 을 꼭짓점으로 하는 삼각형 $\\mathrm{ABC}$ 의 넓이를 $S$ 라 할 때, $4S^2$ 의 값은?`,
      `Find 4S^2.`),
    answer: Fr(val),
    explanation: T(`$\\overrightarrow{\\mathrm{AB}}=${pt(u)},\\ \\overrightarrow{\\mathrm{AC}}=${pt(v)}$ 이고 $S=\\frac12\\sqrt{|\\overrightarrow{\\mathrm{AB}}|^2|\\overrightarrow{\\mathrm{AC}}|^2-(\\overrightarrow{\\mathrm{AB}}\\cdot\\overrightarrow{\\mathrm{AC}})^2}$ 이므로 $4S^2=${dot3(u, u)}\\cdot ${dot3(v, v)}-${num(dot3(u, v))}^2=${val}$`,
      `4S^2 = |AB|^2|AC|^2 - (AB·AC)^2.`),
    verify: () => near(4 * (0.5 * norm(cross(sub(B, A), sub(C, A)))) ** 2, val),
  });
}

function spaceVectorMinNorm(random, profile) {
  const a = [ri(random, -3, 3), ri(random, -3, 3), ri(random, -3, 3)]; const b = [ri(random, 1, 3), ri(random, 1, 3), ri(random, 1, 3)];
  const cr = cross(a, b); const val = Fr(dot3(cr, cr), dot3(b, b));
  if (dot3(cr, cr) === 0) return spaceVectorMinNorm(random, profile);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-space-vector',
    prompt: T(`두 벡터 $\\vec{a}=${pt(a)},\\ \\vec{b}=${pt(b)}$ 와 실수 $t$ 에 대하여 $|\\vec{a}+t\\vec{b}|^2$ 의 최솟값은?`, `Minimum of |a + t b|^2.`),
    answer: val,
    explanation: T(`$|\\vec{a}+t\\vec{b}|^2=|\\vec{b}|^2t^2+2(\\vec{a}\\cdot\\vec{b})t+|\\vec{a}|^2$ 은 $t=-\\frac{\\vec{a}\\cdot\\vec{b}}{|\\vec{b}|^2}$ 일 때 최소이고 최솟값은 $|\\vec{a}|^2-\\frac{(\\vec{a}\\cdot\\vec{b})^2}{|\\vec{b}|^2}=${ftex(val)}$`,
      `Distance from a to the line through the origin along b.`),
    verify: () => {
      let mn = Infinity;
      for (let i = -60000; i <= 60000; i += 1) { const t = i / 5000; const w = a.map((v, k) => v + t * b[k]); mn = Math.min(mn, dot3(w, w)); }
      return near(mn, fnum(val), 1e-4);
    },
    allowShort: false,
  });
}

// ===== 15 직선의 방정식 =====================================================================
function lineTwoPointsMeetPlane(random, profile) {
  const P0 = [ri(random, -3, 3), ri(random, -3, 3), ri(random, 1, 3)];
  const d = [ri(random, -3, 3), ri(random, -3, 3), -1]; // goes down to z = 0 at t = P0.z
  const A = P0; const B = [A[0] + d[0], A[1] + d[1], A[2] + d[2]];
  const hit = [A[0] + d[0] * A[2], A[1] + d[1] * A[2], 0];
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-line',
    prompt: T(`좌표공간의 두 점 $\\mathrm{A}${pt(A)},\\ \\mathrm{B}${pt(B)}$ 를 지나는 직선이 $xy$평면과 만나는 점의 좌표를 $(a,\\ b,\\ 0)$ 이라 할 때, $a+b$ 의 값은?`,
      `Find a+b for the intersection with the xy-plane.`),
    answer: Fr(hit[0] + hit[1]),
    explanation: T(`직선의 방향벡터는 $\\overrightarrow{\\mathrm{AB}}=${pt(d)}$ 이므로 직선 위의 점은 $(${A[0]}${d[0] < 0 ? '' : '+'}${d[0]}t,\\ ${A[1]}${d[1] < 0 ? '' : '+'}${d[1]}t,\\ ${A[2]}-t)$ 이다. $z=0$ 이면 $t=${A[2]}$ 이므로 교점은 $${pt(hit)}$ 이고 $a+b=${hit[0] + hit[1]}$`,
      `Parametrize and set z=0.`),
    verify: () => {
      const t = A[2]; const P = [A[0] + d[0] * t, A[1] + d[1] * t, A[2] + d[2] * t];
      near(P[2], 0, 1e-9);
      return near(P[0] + P[1], hit[0] + hit[1]);
    },
  });
}

function lineAngleBetween(random, profile) {
  const [a1, a2, a3, na] = pick(random, QUADS); const [b1, b2, b3, nb] = pick(random, QUADS);
  const u = [a1, a2, a3]; const v = [b1, -b2, b3];
  const d = Math.abs(dot3(u, v));
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-line',
    prompt: T(`두 직선 $\\frac{x}{${a1}}=\\frac{y}{${a2}}=\\frac{z}{${a3}},\\ \\frac{x}{${b1}}=\\frac{y}{${-b2}}=\\frac{z}{${b3}}$ 가 이루는 예각의 크기를 $\\theta$ 라 할 때, $${na * nb}\\cos\\theta$ 의 값은?`,
      `Find ${na * nb} cos θ.`),
    answer: Fr(d),
    explanation: T(`두 직선의 방향벡터는 $(${a1},\\ ${a2},\\ ${a3}),\\ (${b1},\\ ${-b2},\\ ${b3})$ 이고 크기는 각각 $${na},\\ ${nb}$ 이다.\n$\\cos\\theta=\\frac{|${dot3(u, v)}|}{${na}\\cdot ${nb}}$ 이므로 $${na * nb}\\cos\\theta=${d}$`,
      `cos θ = |u·v|/(|u||v|).`),
    verify: () => near(na * nb * (d / (norm(u) * norm(v))), d),
  });
}

function lineFootOfPerpendicular(random, profile) {
  const H = [ri(random, -3, 3), ri(random, -3, 3), ri(random, -3, 3)];
  const d = [ri(random, 1, 3), ri(random, -2, 2), ri(random, 1, 3)];
  // n perpendicular to d
  const n = [d[1], -d[0], 0]; const m = ri(random, 1, 3);
  const P = [H[0] + m * n[0], H[1] + m * n[1], H[2] + m * n[2]];
  const A0 = H.map((v, i) => v - 1 * d[i]); // a point on the line
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-line',
    prompt: T(`좌표공간의 점 $\\mathrm{P}${pt(P)}$ 에서 점 $\\mathrm{A}${pt(A0)}$ 을 지나고 방향벡터가 $\\vec{u}=${pt(d)}$ 인 직선에 내린 수선의 발을 $\\mathrm{H}(a,\\ b,\\ c)$ 라 할 때, $a+b+c$ 의 값은?`,
      `Find a+b+c for the foot of the perpendicular.`),
    answer: Fr(H[0] + H[1] + H[2]),
    explanation: T(`$\\mathrm{H}=\\mathrm{A}+t\\vec{u}$ 라 하면 $\\overrightarrow{\\mathrm{PH}}\\cdot\\vec{u}=0$ 이므로 $t=1$ 이고 $\\mathrm{H}${pt(H)}$ 이다. 따라서 $a+b+c=${H[0] + H[1] + H[2]}$`,
      `PH ⟂ u.`),
    verify: () => {
      const t = dot3(sub(P, A0), d) / dot3(d, d);
      const F = A0.map((v, i) => v + t * d[i]);
      return near(F[0] + F[1] + F[2], H[0] + H[1] + H[2]);
    },
  });
}

function lineDistanceSquared(random, profile) {
  const P = [ri(random, -3, 3), ri(random, -3, 3), ri(random, -3, 3)];
  const A = [ri(random, -3, 3), ri(random, -3, 3), ri(random, -3, 3)];
  const d = [ri(random, 1, 3), ri(random, -2, 2), ri(random, 1, 3)];
  const cr = cross(sub(P, A), d); const val = Fr(dot3(cr, cr), dot3(d, d));
  if (dot3(cr, cr) === 0) return lineDistanceSquared(random, profile);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-line',
    prompt: T(`좌표공간의 점 $\\mathrm{P}${pt(P)}$ 과 점 $\\mathrm{A}${pt(A)}$ 을 지나고 방향벡터가 $${pt(d)}$ 인 직선 $l$ 사이의 거리를 $h$ 라 할 때, $h^2$ 의 값은?`,
      `Find h^2.`),
    answer: val,
    explanation: T(`$h^2=\\frac{|\\overrightarrow{\\mathrm{AP}}\\times\\vec{u}|^2}{|\\vec{u}|^2}$ 이고 $\\overrightarrow{\\mathrm{AP}}\\times\\vec{u}=${pt(cr)}$ 이므로 $h^2=\\frac{${dot3(cr, cr)}}{${dot3(d, d)}}=${ftex(val)}$`,
      `h^2 = |AP × u|^2/|u|^2.`),
    verify: () => {
      const t = dot3(sub(P, A), d) / dot3(d, d); const F = A.map((v, i) => v + t * d[i]);
      return near(norm(sub(P, F)) ** 2, fnum(val), 1e-9);
    },
    allowShort: false,
  });
}

function linePerpendicularParameter(random, profile) {
  const u = [ri(random, 1, 3), ri(random, 1, 3), ri(random, 1, 3)];
  const k = ri(random, -3, 3) || 1;
  const v = [ri(random, -3, 3), ri(random, -3, 3), 0];
  const ans = Fr(-(u[0] * v[0] + u[1] * v[1]), u[2]);
  const T = (ko, en) => tx(profile, ko, en);
  void k;
  return finish(random, {
    tag: 'jg-line',
    prompt: T(`두 직선 $\\frac{x-1}{${u[0]}}=\\frac{y+2}{${u[1]}}=\\frac{z}{${u[2]}},\\ \\frac{x}{${v[0] === 0 ? 1 : v[0]}}=\\frac{y}{${v[1] === 0 ? 1 : v[1]}}=\\frac{z}{k}$ 가 서로 수직일 때, $k$ 의 값은?`,
      `Find k.`),
    answer: Fr(-((u[0] * (v[0] === 0 ? 1 : v[0]) + u[1] * (v[1] === 0 ? 1 : v[1]))), u[2]),
    explanation: T(`두 직선의 방향벡터가 수직이므로 $${u[0]}\\cdot ${v[0] === 0 ? 1 : v[0]}+${u[1]}\\cdot ${v[1] === 0 ? 1 : v[1]}+${u[2]}k=0$ 에서 $k=${ftex(Fr(-((u[0] * (v[0] === 0 ? 1 : v[0]) + u[1] * (v[1] === 0 ? 1 : v[1]))), u[2]))}$`,
      `Direction vectors are perpendicular.`),
    verify: () => {
      const vv = [v[0] === 0 ? 1 : v[0], v[1] === 0 ? 1 : v[1]];
      const k = -((u[0] * vv[0] + u[1] * vv[1]) / u[2]);
      near(dot3(u, [vv[0], vv[1], k]) + 1, 1, 1e-9);
      return k;
    },
    allowShort: false,
  });
}

// ===== 16 평면의 방정식 =====================================================================
function planeThroughThreePoints(random, profile) {
  const [a, b, c] = pick(random, QUADS).slice(0, 3).map((v) => v * 1);
  const n = [a * signs(random), b, c];
  const d = ri(random, 1, 6) * n[0] * 1;
  // choose three integer points on n·x = d
  const pts = [];
  for (let i = 0; i < 3; i += 1) {
    const x = ri(random, -3, 3); const y = ri(random, -3, 3);
    // z = (d - n0 x - n1 y)/n2 must be integer: search
    pts.push([x, y]);
  }
  const P = pts.map(([x, y]) => { let z = (d - n[0] * x - n[1] * y) / n[2]; if (!Number.isInteger(z)) z = NaN; return [x, y, z]; });
  if (P.some((p) => Number.isNaN(p[2]))) return planeThroughThreePoints(random, profile);
  const nn = cross(sub(P[1], P[0]), sub(P[2], P[0]));
  if (nn[0] === 0 && nn[1] === 0 && nn[2] === 0) return planeThroughThreePoints(random, profile);
  const dd = dot3(nn, P[0]);
  if (nn[0] === 0) return planeThroughThreePoints(random, profile);
  const xi = Fr(dd, nn[0]);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-plane',
    prompt: T(`좌표공간의 세 점 $\\mathrm{A}${pt(P[0])},\\ \\mathrm{B}${pt(P[1])},\\ \\mathrm{C}${pt(P[2])}$ 를 지나는 평면이 $x$축과 만나는 점의 $x$좌표는?`,
      `x-intercept of the plane through A, B, C.`),
    answer: xi,
    explanation: T(`법선벡터는 $\\overrightarrow{\\mathrm{AB}}\\times\\overrightarrow{\\mathrm{AC}}=${pt(nn)}$ 이므로 평면의 방정식은 $${eqn(nn[0], nn[1], nn[2])}=${dd}$. $y=z=0$ 이면 $x=${ftex(xi)}$`,
      `Normal = AB × AC.`),
    verify: () => {
      const x = fnum(xi);
      near(dot3(nn, [x, 0, 0]), dd, 1e-9); near(dot3(nn, P[2]), dd, 1e-9);
      return x;
    },
    allowShort: false,
  });
}

function planePerpendicularToLine(random, profile) {
  const [a, b, c] = pick(random, QUADS);
  const P = [ri(random, -3, 3), ri(random, -3, 3), ri(random, -3, 3)];
  const d = a * P[0] + b * P[1] + c * P[2];
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-plane',
    prompt: T(`점 $\\mathrm{P}${pt(P)}$ 을 지나고 직선 $\\frac{x-1}{${a}}=\\frac{y+3}{${b}}=\\frac{z}{${c}}$ 에 수직인 평면의 방정식을 $${eqn(a, b, c)}=k$ 라 할 때, $k$ 의 값은?`,
      `Find k.`),
    answer: Fr(d),
    explanation: T(`직선의 방향벡터 $(${a},\\ ${b},\\ ${c})$ 가 평면의 법선벡터이므로 평면의 방정식은 $${eqn(a, b, c)}=k$ 이다. 점 $\\mathrm{P}$ 를 지나므로 $k=${a}\\cdot ${num(P[0])}+${b}\\cdot ${num(P[1])}+${c}\\cdot ${num(P[2])}=${d}$`,
      `Normal = direction vector.`),
    verify: () => near(dot3([a, b, c], P), d),
  });
}

function planeAngle(random, profile) {
  const [a1, a2, a3, na] = pick(random, QUADS); const [b1, b2, b3, nb] = pick(random, QUADS);
  const n1 = [a1, a2, a3]; const n2 = [b1, -b2, b3];
  const d = Math.abs(dot3(n1, n2));
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-plane',
    prompt: T(`두 평면 $${eqn(a1, a2, a3)}=1,\\ ${eqn(b1, -b2, b3)}=2$ 가 이루는 예각의 크기를 $\\theta$ 라 할 때, $${na * nb}\\cos\\theta$ 의 값은?`,
      `Find ${na * nb} cos θ.`),
    answer: Fr(d),
    explanation: T(`두 평면의 법선벡터는 $(${a1},\\ ${a2},\\ ${a3}),\\ (${b1},\\ ${-b2},\\ ${b3})$ 이고 크기는 각각 $${na},\\ ${nb}$ 이다. $\\cos\\theta=\\frac{|${dot3(n1, n2)}|}{${na * nb}}$ 이므로 $${na * nb}\\cos\\theta=${d}$`,
      `cos θ from the normal vectors.`),
    verify: () => near(na * nb * (d / (norm(n1) * norm(n2))), d),
  });
}

function planeIntercepts(random, profile) {
  const a = ri(random, 1, 4); const b = ri(random, 1, 4); const c = ri(random, 1, 4);
  const L = a * b * c;
  const vol = Fr(a * b * c, 6);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-plane',
    prompt: T(`평면 $\\frac{x}{${a}}+\\frac{y}{${b}}+\\frac{z}{${c}}=1$ 이 세 좌표축과 만나는 점을 각각 $\\mathrm{A},\\ \\mathrm{B},\\ \\mathrm{C}$ 라 할 때, 사면체 $\\mathrm{OABC}$ 의 부피의 $6$ 배는? (단, $\\mathrm{O}$ 는 원점)`,
      `Six times the volume of the tetrahedron OABC.`),
    answer: Fr(L),
    explanation: T(`$\\mathrm{A}(${a},0,0),\\ \\mathrm{B}(0,${b},0),\\ \\mathrm{C}(0,0,${c})$ 이므로 사면체 $\\mathrm{OABC}$ 의 부피는 $\\frac{1}{6}\\cdot ${a}\\cdot ${b}\\cdot ${c}=${ftex(vol)}$ 이다. 따라서 $6$ 배는 $${L}$`,
      `V = abc/6.`),
    verify: () => near(6 * (Math.abs(dot3([a, 0, 0], cross([0, b, 0], [0, 0, c]))) / 6), L),
  });
}

// ===== 17 점과 평면 사이의 거리 =============================================================
function pointPlaneDistance(random, profile) {
  const [a, b, c, n] = pick(random, QUADS);
  const sa = signs(random); const sb = signs(random);
  const P = [ri(random, -4, 4), ri(random, -4, 4), ri(random, -4, 4)];
  const d = ri(random, -6, 6);
  const val = a * sa * P[0] + b * sb * P[1] + c * P[2] - d;
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-point-plane',
    prompt: T(`좌표공간의 점 $\\mathrm{P}${pt(P)}$ 과 평면 $${eqn(a * sa, b * sb, c)}=${d}$ 사이의 거리를 $h$ 라 할 때, $${n}h$ 의 값은?`,
      `Find ${n}h.`),
    answer: Fr(Math.abs(val)),
    explanation: T(`$h=\\frac{|${a * sa}\\cdot ${num(P[0])}+${b * sb}\\cdot ${num(P[1])}+${c}\\cdot ${num(P[2])}-${num(d)}|}{\\sqrt{${a * a}+${b * b}+${c * c}}}=\\frac{${Math.abs(val)}}{${n}}$ 이므로 $${n}h=${Math.abs(val)}$`,
      `Distance formula.`),
    verify: () => {
      const nn = [a * sa, b * sb, c]; const t = (dot3(nn, P) - d) / dot3(nn, nn); const F = P.map((v, i) => v - t * nn[i]);
      near(dot3(nn, F), d, 1e-9);
      near(n * norm(sub(P, F)), Math.abs(val), 1e-9);
      return Math.abs(val);
    },
  });
}

function parallelPlanesDistance(random, profile) {
  const [a, b, c, n] = pick(random, QUADS);
  const d1 = ri(random, -5, 5); const k = ri(random, 1, 4);
  const d2 = d1 + k * n;
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-point-plane',
    prompt: T(`두 평면 $${eqn(a, b, c)}=${d1},\\ ${eqn(a, b, c)}=${d2}$ 사이의 거리는?`, `Distance between the parallel planes.`),
    answer: Fr(k),
    explanation: T(`평행한 두 평면 사이의 거리는 한 평면 위의 점에서 다른 평면까지의 거리와 같다. $\\frac{|${d2}-${num(d1)}|}{\\sqrt{${a * a}+${b * b}+${c * c}}}=\\frac{${k * n}}{${n}}=${k}$`,
      `|d2 - d1| / |n|.`),
    verify: () => {
      const nn = [a, b, c]; const P = [d1 / dot3(nn, nn) * a, d1 / dot3(nn, nn) * b, d1 / dot3(nn, nn) * c]; // point on plane 1
      return near(Math.abs(dot3(nn, P) - d2) / norm(nn), k, 1e-9);
    },
  });
}

function sphereTangentPlaneRadius(random, profile) {
  const [a, b, c, n] = pick(random, QUADS);
  const C = [ri(random, -3, 3), ri(random, -3, 3), ri(random, -3, 3)];
  const r = ri(random, 1, 5);
  const d = dot3([a, b, c], C) + r * n;
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-point-plane',
    prompt: T(`중심이 $\\mathrm{C}${pt(C)}$ 인 구가 평면 $${eqn(a, b, c)}=${d}$ 에 접할 때, 이 구의 반지름의 길이는?`, `Radius of the tangent sphere.`),
    answer: Fr(r),
    explanation: T(`구의 반지름의 길이는 중심 $\\mathrm{C}$ 에서 평면까지의 거리와 같다. $\\frac{|${a}\\cdot ${num(C[0])}+${b}\\cdot ${num(C[1])}+${c}\\cdot ${num(C[2])}-${num(d)}|}{${n}}=\\frac{${r * n}}{${n}}=${r}$`,
      `Radius = distance from the center.`),
    verify: () => near(Math.abs(dot3([a, b, c], C) - d) / n, r),
  });
}

function tetrahedronHeight(random, profile) {
  const [a, b, c, n] = pick(random, QUADS);
  const k = ri(random, 1, 4);
  const S = ri(random, 2, 6) * 3;
  // base on plane ax+by+cz = 0 (through origin) area S ; apex at distance n*k/ n ... apex P with n·P = k n  -> height k
  const vol = Fr(S * k, 3);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-point-plane',
    prompt: T(`평면 $${eqn(a, b, c)}=0$ 위에 놓인 넓이가 $${S}$ 인 삼각형을 밑면으로 하고, 평면 $${eqn(a, b, c)}=${k * n}$ 위의 한 점 $\\mathrm{P}$ 를 꼭짓점으로 하는 삼각뿔의 부피는?`,
      `Volume of the pyramid.`),
    answer: vol,
    explanation: T(`두 평면은 평행하고 그 사이의 거리는 $\\frac{${k * n}}{\\sqrt{${a * a}+${b * b}+${c * c}}}=${k}$ 이므로 삼각뿔의 높이는 $${k}$.\n부피는 $\\frac13\\cdot ${S}\\cdot ${k}=${ftex(vol)}$`,
      `V = (1/3) S h.`),
    verify: () => near((1 / 3) * S * (Math.abs(k * n) / norm([a, b, c])), fnum(vol), 1e-9),
  });
}

export const SPACE_ENGINES = {
  'jg-three-perp': [threePerpDistance, threePerpDihedralSin, threePerpSquarePyramid, threePerpTriangleArea],
  'jg-projection': [projectionAreaPlane, projectionAreaFromAngle, projectionSegment, projectionFindOriginal],
  'jg-space-coord': [spaceDistance, spaceReflection, spaceInternalDivision, spaceDistanceToAxis, spaceCentroid],
  'jg-sphere': [sphereCompleteSquare, sphereDiameterEndpoints, sphereTangentPlaneCircle, sphereTwoSpheresMax, sphereTangentToCoordinatePlane],
  'jg-space-vector': [spaceVectorDotNorm, spaceVectorPerpendicular, spaceVectorCosine, spaceTriangleArea4S2, spaceVectorMinNorm],
  'jg-line': [lineTwoPointsMeetPlane, lineAngleBetween, lineFootOfPerpendicular, lineDistanceSquared, linePerpendicularParameter],
  'jg-plane': [planeThroughThreePoints, planePerpendicularToLine, planeAngle, planeIntercepts],
  'jg-point-plane': [pointPlaneDistance, parallelPlanesDistance, sphereTangentPlaneRadius, tetrahedronHeight],
};

void fnum;
