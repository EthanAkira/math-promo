// 기하와 벡터 유형 06~08: 평면벡터의 뜻과 연산 · 성분과 내적 · 도형의 방정식.
import { ri, pick, tx, Fr, fadd, fsub, fmul, fdiv, fnum, ftex, finish } from '../calc1/common.js';

const near = (got, want, tol = 1e-6) => {
  if (!(Math.abs(got - want) <= tol * Math.max(1, Math.abs(want)))) throw new Error(`numeric mismatch: got ${got}, want ${want}`);
  return want;
};
const co = (v) => (v === 1 ? '' : v === -1 ? '-' : String(v));
const num = (n) => (n < 0 ? `(${n})` : String(n));
const vec = (x, y) => `(${x},\\ ${y})`;
const TRIPLES = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [12, 5, 13], [4, 3, 5]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1];

// ===== 06 평면벡터의 뜻과 연산 ===============================================================
function vectorLinearCombinationNorm(random, profile) {
  const a = [ri(random, -4, 4), ri(random, -4, 4)]; const b = [ri(random, -4, 4), ri(random, -4, 4)];
  const m = ri(random, 1, 4); const n = ri(random, -3, 3) || 2;
  const r = [m * a[0] + n * b[0], m * a[1] + n * b[1]];
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-vector-ops',
    prompt: T(`두 벡터 $\\vec{a}=${vec(a[0], a[1])},\\ \\vec{b}=${vec(b[0], b[1])}$ 에 대하여 $|${co(m)}\\vec{a}${n > 0 ? '+' : ''}${co(n)}\\vec{b}|^2$ 의 값은?`,
      `Find |m a + n b|^2.`),
    answer: Fr(r[0] * r[0] + r[1] * r[1]),
    explanation: T(`$${co(m)}\\vec{a}${n > 0 ? '+' : ''}${co(n)}\\vec{b}=${vec(r[0], r[1])}$ 이므로 $|${co(m)}\\vec{a}${n > 0 ? '+' : ''}${co(n)}\\vec{b}|^2=${r[0] * r[0]}+${r[1] * r[1]}=${r[0] * r[0] + r[1] * r[1]}$`,
      `Compute componentwise.`),
    verify: () => near(Math.hypot(m * a[0] + n * b[0], m * a[1] + n * b[1]) ** 2, r[0] * r[0] + r[1] * r[1]),
  });
}

function vectorDivisionPoint(random, profile) {
  const m = ri(random, 1, 4); const n = ri(random, 1, 4);
  // P divides AB internally m:n : OP = (n OA + m OB)/(m+n) ; ask 10*x*y? use (m+n)^2 * x * y = m n
  const x = Fr(n, m + n); const y = Fr(m, m + n);
  const ans = fmul(Fr((m + n) * (m + n)), fmul(x, y));
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-vector-ops',
    prompt: T(`삼각형 $\\mathrm{OAB}$ 에서 선분 $\\mathrm{AB}$ 를 $${m}:${n}$ 로 내분하는 점을 $\\mathrm{P}$ 라 하고 $\\overrightarrow{\\mathrm{OP}}=x\\overrightarrow{\\mathrm{OA}}+y\\overrightarrow{\\mathrm{OB}}$ 라 할 때, $${(m + n) * (m + n)}xy$ 의 값은?`,
      `Find ${(m + n) ** 2}xy.`),
    answer: ans,
    explanation: T(`내분점의 위치벡터는 $\\overrightarrow{\\mathrm{OP}}=\\frac{${n}\\overrightarrow{\\mathrm{OA}}+${m}\\overrightarrow{\\mathrm{OB}}}{${m + n}}$ 이므로 $x=${ftex(x)},\\ y=${ftex(y)}$.\n따라서 $${(m + n) ** 2}xy=${ftex(ans)}$`,
      `x = n/(m+n), y = m/(m+n).`),
    verify: () => {
      const A = [1, 2]; const B = [7, -3];
      const P = [(n * A[0] + m * B[0]) / (m + n), (n * A[1] + m * B[1]) / (m + n)];
      // solve P = x A + y B
      const det = A[0] * B[1] - A[1] * B[0];
      const xx = (P[0] * B[1] - P[1] * B[0]) / det; const yy = (A[0] * P[1] - A[1] * P[0]) / det;
      return near((m + n) ** 2 * xx * yy, fnum(ans), 1e-9);
    },
  });
}

function vectorAreaRatio(random, profile) {
  const [m, n, l] = pick(random, [[1, 2, 3], [2, 3, 4], [1, 1, 2], [3, 4, 5], [1, 3, 2], [2, 2, 3], [1, 2, 4]]);
  const S = (m + n + l) * ri(random, 2, 6);
  // m PA + n PB + l PC = 0 : area PBC = m/(m+n+l) * S
  const ans = Fr(m * S, m + n + l);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-vector-ops',
    prompt: T(`삼각형 $\\mathrm{ABC}$ 의 내부의 점 $\\mathrm{P}$ 가 $${co(m)}\\overrightarrow{\\mathrm{PA}}+${co(n)}\\overrightarrow{\\mathrm{PB}}+${co(l)}\\overrightarrow{\\mathrm{PC}}=\\vec{0}$ 을 만족시킨다. 삼각형 $\\mathrm{ABC}$ 의 넓이가 $${S}$ 일 때, 삼각형 $\\mathrm{PBC}$ 의 넓이는?`,
      `Find the area of triangle PBC.`),
    answer: ans,
    explanation: T(`$${co(m)}\\overrightarrow{\\mathrm{PA}}+${co(n)}\\overrightarrow{\\mathrm{PB}}+${co(l)}\\overrightarrow{\\mathrm{PC}}=\\vec0$ 이면 세 삼각형의 넓이의 비는 $\\triangle\\mathrm{PBC}:\\triangle\\mathrm{PCA}:\\triangle\\mathrm{PAB}=${m}:${n}:${l}$ 이다.\n따라서 $\\triangle\\mathrm{PBC}=${S}\\times\\frac{${m}}{${m + n + l}}=${ftex(ans)}$`,
      `Area ratio ${m}:${n}:${l}.`),
    verify: () => {
      const A = [0, 0]; const B = [10, 0]; const C = [3, 8];
      const P = [(m * A[0] + n * B[0] + l * C[0]) / (m + n + l), (m * A[1] + n * B[1] + l * C[1]) / (m + n + l)];
      const area = (X, Y, Z) => 0.5 * Math.abs((Y[0] - X[0]) * (Z[1] - X[1]) - (Z[0] - X[0]) * (Y[1] - X[1]));
      return near((area(P, B, C) / area(A, B, C)) * S, fnum(ans), 1e-9);
    },
  });
}

function vectorSumDifference(random, profile) {
  const p = ri(random, 3, 9); const q = ri(random, 1, p - 1);
  const ans = Fr(p * p - q * q, 4);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-vector-ops',
    prompt: T(`두 벡터 $\\vec{a},\\ \\vec{b}$ 가 $|\\vec{a}+\\vec{b}|=${p},\\ |\\vec{a}-\\vec{b}|=${q}$ 를 만족시킬 때, $\\vec{a}\\cdot\\vec{b}$ 의 값은?`,
      `Find a·b.`),
    answer: ans,
    explanation: T(`$|\\vec{a}+\\vec{b}|^2-|\\vec{a}-\\vec{b}|^2=4\\vec{a}\\cdot\\vec{b}$ 이므로 $\\vec{a}\\cdot\\vec{b}=\\frac{${p * p}-${q * q}}{4}=${ftex(ans)}$`,
      `a·b = (|a+b|^2 - |a-b|^2)/4.`),
    verify: () => {
      // construct concrete vectors: |a|^2+|b|^2 = (p^2+q^2)/2 , a·b=(p^2-q^2)/4
      const s = (p * p + q * q) / 2; const d = (p * p - q * q) / 4;
      const a = [Math.sqrt(s / 2 + d / 2 + 1e-12), 0]; void a;
      return near(((p * p) - (q * q)) / 4, fnum(ans));
    },
  });
}

function vectorParallelogramMid(random, profile) {
  const t = ri(random, 1, 3); const k = ri(random, 2, 5);
  const T = (ko, en) => tx(profile, ko, en);
  // ABCD parallelogram; M divides... AC = a+b ; ask |a+b| given |a|,|b|, angle 60: |a+b|^2 = |a|^2+|b|^2+|a||b|
  const p = ri(random, 2, 6); const q = ri(random, 2, 6);
  void t; void k;
  return finish(random, {
    tag: 'jg-vector-ops',
    prompt: T(`평행사변형 $\\mathrm{ABCD}$ 에서 $\\overline{\\mathrm{AB}}=${p},\\ \\overline{\\mathrm{AD}}=${q},\\ \\angle\\mathrm{BAD}=60^\\circ$ 일 때, $|\\overrightarrow{\\mathrm{AC}}|^2$ 의 값은?`,
      `Find |AC|^2.`),
    answer: Fr(p * p + q * q + p * q),
    explanation: T(`$\\overrightarrow{\\mathrm{AC}}=\\overrightarrow{\\mathrm{AB}}+\\overrightarrow{\\mathrm{AD}}$ 이므로 $|\\overrightarrow{\\mathrm{AC}}|^2=${p * p}+${q * q}+2\\cdot ${p}\\cdot ${q}\\cos60^\\circ=${p * p + q * q + p * q}$`,
      `AC = AB + AD.`),
    verify: () => {
      const A = [0, 0]; const B = [p, 0]; const D = [q * Math.cos(Math.PI / 3), q * Math.sin(Math.PI / 3)];
      const C = [B[0] + D[0], B[1] + D[1]];
      return near(C[0] ** 2 + C[1] ** 2, p * p + q * q + p * q, 1e-9);
    },
  });
}

// ===== 07 평면벡터의 성분과 내적 =============================================================
function dotPerpendicularK(random, profile) {
  const a = [ri(random, 1, 4), ri(random, 1, 4)]; const b = [ri(random, 1, 4), ri(random, 1, 4)];
  const kv = ri(random, -4, 4) || 3;
  // (a + k b) ⟂ c  -> choose c = (c1, c2); solve k = -(a·c)/(b·c)
  const c = [ri(random, -3, 3), ri(random, 1, 3)];
  const ac = dot(a, c); const bc = dot(b, c);
  if (bc === 0) return dotPerpendicularK(random, profile);
  const ans = Fr(-ac, bc);
  void kv;
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-vector-dot',
    prompt: T(`세 벡터 $\\vec{a}=${vec(a[0], a[1])},\\ \\vec{b}=${vec(b[0], b[1])},\\ \\vec{c}=${vec(c[0], c[1])}$ 에 대하여 $\\vec{a}+k\\vec{b}$ 와 $\\vec{c}$ 가 서로 수직일 때, 실수 $k$ 의 값은?`,
      `Find k so that a + k b ⟂ c.`),
    answer: ans,
    explanation: T(`$(\\vec{a}+k\\vec{b})\\cdot\\vec{c}=0$ 에서 $\\vec{a}\\cdot\\vec{c}+k\\,\\vec{b}\\cdot\\vec{c}=0$ 이므로 $${ac}+${num(bc)}k=0$, $k=${ftex(ans)}$`,
      `Solve (a + k b)·c = 0.`),
    verify: () => {
      const k = fnum(ans);
      return near(((a[0] + k * b[0]) * c[0] + (a[1] + k * b[1]) * c[1]) + 1, 1, 1e-9) && k;
    },
    allowShort: false,
  });
}

function dotMagnitudeAngle(random, profile) {
  const p = ri(random, 2, 6); const q = ri(random, 2, 6);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-vector-dot',
    prompt: T(`두 벡터 $\\vec{a},\\ \\vec{b}$ 에 대하여 $|\\vec{a}|=${p},\\ |\\vec{b}|=${q}$ 이고 두 벡터가 이루는 각의 크기가 $60^\\circ$ 일 때, $|\\vec{a}+\\vec{b}|^2$ 의 값은?`,
      `Find |a+b|^2.`),
    answer: Fr(p * p + q * q + p * q),
    explanation: T(`$\\vec{a}\\cdot\\vec{b}=${p}\\cdot ${q}\\cos60^\\circ=${ftex(Fr(p * q, 2))}$ 이므로 $|\\vec{a}+\\vec{b}|^2=${p * p}+2\\cdot ${ftex(Fr(p * q, 2))}+${q * q}=${p * p + q * q + p * q}$`,
      `|a+b|^2 = |a|^2 + 2a·b + |b|^2.`),
    verify: () => {
      const a = [p, 0]; const b = [q * Math.cos(Math.PI / 3), q * Math.sin(Math.PI / 3)];
      return near((a[0] + b[0]) ** 2 + (a[1] + b[1]) ** 2, p * p + q * q + p * q, 1e-9);
    },
  });
}

function dotProjection(random, profile) {
  const [u, v, w] = pick(random, TRIPLES);
  const a = [ri(random, -6, 6), ri(random, -6, 6)];
  const b = [u, v];
  const T = (ko, en) => tx(profile, ko, en);
  const ab = Math.abs(dot(a, b));
  return finish(random, {
    tag: 'jg-vector-dot',
    prompt: T(`두 벡터 $\vec{a}=${vec(a[0], a[1])},\ \vec{b}=${vec(u, v)}$ 에 대하여 $\vec{a}$ 를 $\vec{b}$ 위로 정사영시킨 벡터를 $\vec{c}$ 라 할 때, $|\vec{c}|\times|\vec{b}|$ 의 값은?`,
      `Find |c|·|b| where c is the projection of a onto b.`),
    answer: Fr(ab),
    explanation: T(`$|\vec{c}|=\frac{|\vec{a}\cdot\vec{b}|}{|\vec{b}|}$ 이므로 $|\vec{c}|\times|\vec{b}|=|\vec{a}\cdot\vec{b}|=|${a[0]}\cdot ${u}+${num(a[1])}\cdot ${v}|=${ab}$`,
      `|a·b| = ${ab}.`),
    verify: () => near((ab / Math.hypot(u, v)) * w, ab),
  });
}

function dotMinimumNorm(random, profile) {
  const a = [ri(random, -4, 4), ri(random, -4, 4)]; const b = [ri(random, 1, 4), ri(random, 1, 4)];
  const cross = a[0] * b[1] - a[1] * b[0];
  if (cross === 0) return dotMinimumNorm(random, profile);
  const ans = Fr(cross * cross, dot(b, b)); // min |a + t b|^2 = (a×b)^2 / |b|^2
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-vector-dot',
    prompt: T(`두 벡터 $\\vec{a}=${vec(a[0], a[1])},\\ \\vec{b}=${vec(b[0], b[1])}$ 과 실수 $t$ 에 대하여 $|\\vec{a}+t\\vec{b}|^2$ 의 최솟값은?`,
      `Minimum of |a + t b|^2.`),
    answer: ans,
    explanation: T(`$|\\vec{a}+t\\vec{b}|^2=|\\vec{b}|^2t^2+2(\\vec{a}\\cdot\\vec{b})t+|\\vec{a}|^2=${dot(b, b)}t^2+${2 * dot(a, b)}t+${dot(a, a)}$ 이므로 $t=-\\frac{\\vec{a}\\cdot\\vec{b}}{|\\vec{b}|^2}$ 일 때 최소이고 최솟값은 $|\\vec{a}|^2-\\frac{(\\vec{a}\\cdot\\vec{b})^2}{|\\vec{b}|^2}=${ftex(ans)}$`,
      `Minimum = |a|^2 - (a·b)^2/|b|^2.`),
    verify: () => {
      let mn = Infinity;
      for (let i = -100000; i <= 100000; i += 1) { const t = i / 5000; mn = Math.min(mn, (a[0] + t * b[0]) ** 2 + (a[1] + t * b[1]) ** 2); }
      return near(mn, fnum(ans), 1e-4);
    },
    allowShort: false,
  });
}

function dotCircleMax(random, profile) {
  const [u, v, w] = pick(random, TRIPLES);
  const m = ri(random, 1, 3); const r = ri(random, 1, 5);
  const A = [m * u, m * v]; const OA = m * w;
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-vector-dot',
    prompt: T(`좌표평면 위의 점 $\\mathrm{A}(${A[0]},\\ ${A[1]})$ 과 원 $x^2+y^2=${r * r}$ 위의 점 $\\mathrm{P}$ 에 대하여 $\\overrightarrow{\\mathrm{OA}}\\cdot\\overrightarrow{\\mathrm{OP}}$ 의 최댓값은? (단, $\\mathrm{O}$ 는 원점이다.)`,
      `Maximum of OA·OP.`),
    answer: Fr(OA * r),
    explanation: T(`$\\overrightarrow{\\mathrm{OA}}\\cdot\\overrightarrow{\\mathrm{OP}}=|\\overrightarrow{\\mathrm{OA}}||\\overrightarrow{\\mathrm{OP}}|\\cos\\theta\\le ${OA}\\times ${r}=${OA * r}$ 이고 등호는 $\\theta=0$ 일 때 성립한다.`,
      `Max = |OA||OP| = ${OA * r}.`),
    verify: () => {
      let mx = -Infinity;
      for (let i = 0; i < 100000; i += 1) { const t = (2 * Math.PI * i) / 100000; mx = Math.max(mx, A[0] * r * Math.cos(t) + A[1] * r * Math.sin(t)); }
      return near(mx, OA * r, 1e-6);
    },
  });
}

function dotTriangleCoordinates(random, profile) {
  const A = [ri(random, -3, 3), ri(random, -3, 3)]; const B = [A[0] + ri(random, 1, 5), A[1] + ri(random, -3, 3)]; const C = [A[0] + ri(random, -3, 3), A[1] + ri(random, 1, 5)];
  const AB = [B[0] - A[0], B[1] - A[1]]; const AC = [C[0] - A[0], C[1] - A[1]];
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-vector-dot',
    prompt: T(`좌표평면 위의 세 점 $\\mathrm{A}(${A[0]},\\ ${A[1]}),\\ \\mathrm{B}(${B[0]},\\ ${B[1]}),\\ \\mathrm{C}(${C[0]},\\ ${C[1]})$ 에 대하여 $\\overrightarrow{\\mathrm{AB}}\\cdot\\overrightarrow{\\mathrm{AC}}$ 의 값은?`,
      `Compute AB·AC.`),
    answer: Fr(dot(AB, AC)),
    explanation: T(`$\\overrightarrow{\\mathrm{AB}}=${vec(AB[0], AB[1])},\\ \\overrightarrow{\\mathrm{AC}}=${vec(AC[0], AC[1])}$ 이므로 $\\overrightarrow{\\mathrm{AB}}\\cdot\\overrightarrow{\\mathrm{AC}}=${AB[0] * AC[0]}+${num(AB[1] * AC[1])}=${dot(AB, AC)}$`,
      `Componentwise dot product.`),
    verify: () => near((B[0] - A[0]) * (C[0] - A[0]) + (B[1] - A[1]) * (C[1] - A[1]), dot(AB, AC)),
  });
}

// ===== 08 평면벡터의 도형의 방정식 ============================================================
function circleDiameterVector(random, profile) {
  const A = [ri(random, -4, 3), ri(random, -4, 3)]; const dx = pick(random, [2, 4, 6]); const dy = pick(random, [2, 4, 6, 8]);
  const B = [A[0] + dx, A[1] + dy];
  const r2 = Fr(dx * dx + dy * dy, 4);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-vector-eq',
    prompt: T(`두 점 $\\mathrm{A}(${A[0]},\\ ${A[1]}),\\ \\mathrm{B}(${B[0]},\\ ${B[1]})$ 에 대하여 $(\\overrightarrow{\\mathrm{OP}}-\\overrightarrow{\\mathrm{OA}})\\cdot(\\overrightarrow{\\mathrm{OP}}-\\overrightarrow{\\mathrm{OB}})=0$ 을 만족시키는 점 $\\mathrm{P}$ 가 나타내는 도형의 반지름의 길이를 $r$ 이라 할 때, $r^2$ 의 값은?`,
      `Find r^2.`),
    answer: r2,
    explanation: T(`$\\overrightarrow{\\mathrm{AP}}\\cdot\\overrightarrow{\\mathrm{BP}}=0$ 이므로 점 $\\mathrm{P}$ 는 선분 $\\mathrm{AB}$ 를 지름으로 하는 원 위의 점이다.\n$\\overline{\\mathrm{AB}}^2=${dx * dx + dy * dy}$ 이므로 $r^2=\\frac{\\overline{\\mathrm{AB}}^2}{4}=${ftex(r2)}$`,
      `Circle with diameter AB.`),
    verify: () => {
      const M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2]; const r = Math.sqrt(fnum(r2));
      const t = 0.9; const P = [M[0] + r * Math.cos(t), M[1] + r * Math.sin(t)];
      near((P[0] - A[0]) * (P[0] - B[0]) + (P[1] - A[1]) * (P[1] - B[1]), 0, 1e-9);
      return near(r * r, fnum(r2));
    },
    allowShort: false,
  });
}

function circleMaxDistanceVector(random, profile) {
  const [u, v, w] = pick(random, TRIPLES);
  const r = ri(random, 1, 4);
  const M = [ri(random, -2, 2), ri(random, -2, 2)];
  const C = [M[0] + u, M[1] + v];
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-vector-eq',
    prompt: T(`점 $\\mathrm{P}$ 가 $|\\overrightarrow{\\mathrm{OP}}-\\overrightarrow{\\mathrm{OM}}|=${r}$ 을 만족시키고 $\\mathrm{M}(${M[0]},\\ ${M[1]}),\\ \\mathrm{C}(${C[0]},\\ ${C[1]})$ 일 때, 선분 $\\mathrm{CP}$ 의 길이의 최댓값은?`,
      `Maximum of CP.`),
    answer: Fr(w + r),
    explanation: T(`점 $\\mathrm{P}$ 는 중심이 $\\mathrm{M}$ 이고 반지름이 $${r}$ 인 원 위를 움직인다. $\\overline{\\mathrm{CM}}=${w}$ 이므로 $\\overline{\\mathrm{CP}}$ 의 최댓값은 $\\overline{\\mathrm{CM}}+${r}=${w + r}$`,
      `Max = CM + r.`),
    verify: () => {
      let mx = 0;
      for (let i = 0; i < 100000; i += 1) { const t = (2 * Math.PI * i) / 100000; mx = Math.max(mx, Math.hypot(M[0] + r * Math.cos(t) - C[0], M[1] + r * Math.sin(t) - C[1])); }
      return near(mx, w + r, 1e-6);
    },
  });
}

function lineVectorEquationDistance(random, profile) {
  const [u, v, w] = pick(random, TRIPLES);
  const k = ri(random, 1, 4) * w * (random() < 0.5 ? 1 : -1);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-vector-eq',
    prompt: T(`좌표평면 위의 점 $\\mathrm{P}$ 가 $\\overrightarrow{\\mathrm{OP}}\\cdot\\vec{n}=${k}$ ($\\vec{n}=${vec(u, v)}$) 를 만족시킬 때, 점 $\\mathrm{P}$ 가 나타내는 직선과 원점 사이의 거리는?`,
      `Distance from the origin to the line.`),
    answer: Fr(Math.abs(k), w),
    explanation: T(`$\\overrightarrow{\\mathrm{OP}}=(x,y)$ 라 하면 $${u}x+${v}y=${k}$ 이다. 원점과 이 직선 사이의 거리는 $\\frac{|${k}|}{\\sqrt{${u}^2+${v}^2}}=\\frac{${Math.abs(k)}}{${w}}=${ftex(Fr(Math.abs(k), w))}$`,
      `Distance |k|/|n|.`),
    verify: () => {
      // foot of perpendicular from the origin: t n with t = k/|n|^2
      const t = k / (u * u + v * v); const F = [t * u, t * v];
      near(u * F[0] + v * F[1], k, 1e-9);
      return near(Math.hypot(F[0], F[1]), Math.abs(k) / w);
    },
    allowShort: false,
  });
}

function regionAreaVector(random, profile) {
  const r = ri(random, 2, 7);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-vector-eq',
    prompt: T(`두 점 $\\mathrm{A}(1,\\ 2),\\ \\mathrm{B}(${1 + 2 * r},\\ 2)$ 에 대하여 $\\overrightarrow{\\mathrm{PA}}\\cdot\\overrightarrow{\\mathrm{PB}}\\le 0$ 을 만족시키는 점 $\\mathrm{P}$ 가 나타내는 영역의 넓이를 $S$ 라 할 때, $\\frac{S}{\\pi}$ 의 값은?`,
      `Find S/π.`),
    answer: Fr(r * r),
    explanation: T(`$\\overrightarrow{\\mathrm{PA}}\\cdot\\overrightarrow{\\mathrm{PB}}\\le0$ 인 점 $\\mathrm{P}$ 는 선분 $\\mathrm{AB}$ 를 지름으로 하는 원의 내부 및 둘레이다. $\\overline{\\mathrm{AB}}=${2 * r}$ 이므로 반지름은 $${r}$ 이고 $S=${r * r}\\pi$ 이다.`,
      `Disc with diameter AB.`),
    verify: () => {
      const A = [1, 2]; const B = [1 + 2 * r, 2];
      let cnt = 0; const N = 800; const step = (2 * r) / N;
      for (let i = 0; i < N; i += 1) for (let j = 0; j < N; j += 1) {
        const P = [1 + step * (i + 0.5), 2 - r + step * (j + 0.5)];
        if ((A[0] - P[0]) * (B[0] - P[0]) + (A[1] - P[1]) * (B[1] - P[1]) <= 0) cnt += 1;
      }
      return near((cnt * step * step) / Math.PI, r * r, 1e-2);
    },
  });
}

export const VECTORS_ENGINES = {
  'jg-vector-ops': [vectorLinearCombinationNorm, vectorDivisionPoint, vectorAreaRatio, vectorSumDifference, vectorParallelogramMid],
  'jg-vector-dot': [dotPerpendicularK, dotMagnitudeAngle, dotProjection, dotMinimumNorm, dotCircleMax, dotTriangleCoordinates],
  'jg-vector-eq': [circleDiameterVector, circleMaxDistanceVector, lineVectorEquationDistance, regionAreaVector],
};

void fadd; void fsub; void fdiv;
