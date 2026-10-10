// 기하와 벡터 유형 01~05, 09: 포물선 · 타원 · 쌍곡선 · 음함수·매개변수 미분 · 이차곡선의 접선 · 속도와 가속도.
// 모든 생성기는 "깨끗한 정수 답"에서 거꾸로 문제를 만들고, 독립적인 수치 계산(verify)으로 정답을 검산한다.
import { ri, pick, tx, Fr, fadd, fsub, fmul, fdiv, fnum, ftex, finish, numeric } from '../calc1/common.js';

const near = (got, want, tol = 1e-6) => {
  if (!(Math.abs(got - want) <= tol * Math.max(1, Math.abs(want)))) throw new Error(`numeric mismatch: got ${got}, want ${want}`);
  return want;
};
const co = (v) => (v === 1 ? '' : v === -1 ? '-' : String(v));
const num = (n) => (n < 0 ? `(${n})` : String(n));
const shift = (v, s) => (s === 0 ? v : s > 0 ? `${v}-${s}` : `${v}+${-s}`); // (x - s)
// Pythagorean triples (a,b,c) and ellipse-friendly (a, b, c) with c^2 = a^2 - b^2
const TRIPLES = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [12, 16, 20], [7, 24, 25]];
const ELLIPSE = [[5, 4, 3], [10, 8, 6], [13, 12, 5], [17, 15, 8], [25, 24, 7], [15, 12, 9], [20, 16, 12], [5, 3, 4]];
const HYPER = [[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [8, 15, 17], [6, 8, 10], [9, 12, 15], [15, 8, 17]];

// ===== 01 포물선 ===========================================================================
function parabolaThroughPoint(random, profile) {
  const p = pick(random, [1, 2, 3]);
  const v = ri(random, -2, 3);
  const k = ri(random, -3, 3);
  const m = ri(random, 1, 4);
  const yA = k + 2 * p * m; // (y-k)^2 = 4p(x-v)  -> x = v + p m^2
  const a = v + p * m * m;
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-parabola',
    prompt: T(`초점이 $\\mathrm{F}(${v + p},\\ ${k})$ 이고 준선이 $x=${v - p}$ 인 포물선이 점 $\\mathrm{A}(a,\\ ${yA})$ 를 지날 때, $a$ 의 값은?`,
      `A parabola has focus F(${v + p}, ${k}) and directrix x=${v - p}; it passes through A(a, ${yA}). Find a.`),
    answer: Fr(a),
    explanation: T(`꼭짓점은 초점과 준선의 중점 $(${v},\\ ${k})$ 이고 $p=${p}$ 이므로 포물선의 방정식은 $(y${k === 0 ? '' : k > 0 ? `-${k}` : `+${-k}`})^2=${4 * p}(x${v === 0 ? '' : v > 0 ? `-${v}` : `+${-v}`})$ 이다.\n점 $(a,\\ ${yA})$ 를 대입하면 $${(yA - k) ** 2}=${4 * p}(a${v === 0 ? '' : v > 0 ? `-${v}` : `+${-v}`})$ 이므로 $a=${a}$`,
      `Vertex (${v}, ${k}), p=${p}.`),
    verify: () => {
      const dist = (x, y) => Math.hypot(x - (v + p), y - k) - Math.abs(x - (v - p));
      return near(Math.abs(dist(a, yA)) < 1e-9 ? a : NaN, a);
    },
  });
}

function parabolaFocalRatio(random, profile) {
  const p = ri(random, 1, 3);
  const t = pick(random, [2, 3, 4]); // A at parameter t: AF:BF = t^2 : 1
  const ans = Fr(2 * t, t * t - 1);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-parabola',
    prompt: T(`포물선 $y^2=${4 * p}x$ 의 초점 $\\mathrm{F}$ 를 지나고 기울기가 양수인 직선이 포물선과 만나는 두 점을 각각 $\\mathrm{A},\\ \\mathrm{B}$ 라 하자. $\\overline{\\mathrm{AF}}:\\overline{\\mathrm{BF}}=${t * t}:1$ 일 때, 직선 $\\mathrm{AB}$ 의 기울기는?`,
      `Find the slope of the focal chord with AF:BF = ${t * t}:1.`),
    answer: ans,
    explanation: T(`초점을 지나는 직선 위의 두 점을 $\\mathrm{A}(${p}s^2,\\ ${2 * p}s)$, $\\mathrm{B}(${p}u^2,\\ ${2 * p}u)$ 라 하면 $su=-1$ 이다. 포물선의 정의에 의하여 $\\overline{\\mathrm{AF}}=${p}(s^2+1)$, $\\overline{\\mathrm{BF}}=${p}(u^2+1)$ 이므로 $\\overline{\\mathrm{AF}}:\\overline{\\mathrm{BF}}=s^2:1$ 이고 $s=${t}$.\n기울기는 $\\frac{2}{s+u}=\\frac{2}{s-\\frac1s}=\\frac{2s}{s^2-1}=${ftex(ans)}$`,
      `With parameters s and u=-1/s, slope = 2s/(s^2-1).`),
    verify: () => {
      const s = t; const u = -1 / s;
      const A = [p * s * s, 2 * p * s]; const B = [p * u * u, 2 * p * u];
      const F = [p, 0];
      const af = Math.hypot(A[0] - F[0], A[1] - F[1]); const bf = Math.hypot(B[0] - F[0], B[1] - F[1]);
      near(af / bf, t * t);
      return near((A[1] - B[1]) / (A[0] - B[0]), fnum(ans));
    },
  });
}

function parabolaFocalChordLength(random, profile) {
  const p = ri(random, 1, 4);
  const m = pick(random, [1, 2, 3]);
  const len = Fr(4 * p * (m * m + 1), m * m);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-parabola',
    prompt: T(`포물선 $y^2=${4 * p}x$ 의 초점을 지나고 기울기가 $${m}$ 인 직선이 포물선과 만나는 두 점을 $\\mathrm{A},\\ \\mathrm{B}$ 라 할 때, 선분 $\\mathrm{AB}$ 의 길이는?`,
      `Find the length of the focal chord with slope ${m}.`),
    answer: len,
    explanation: T(`직선 $y=${co(m)}(x-${p})$ 과 $y^2=${4 * p}x$ 를 연립하면 $${m * m}x^2-${2 * p * m * m + 4 * p}x+${p * p * m * m}=0$ 이므로 $x_1+x_2=${ftex(Fr(2 * p * m * m + 4 * p, m * m))}$.\n초점을 지나는 현이므로 $\\overline{\\mathrm{AB}}=x_1+x_2+2p=${ftex(len)}$`,
      `AB = x1 + x2 + 2p = ${ftex(len)}.`),
    verify: () => {
      // solve m^2 x^2 - (2p m^2 + 4p) x + p^2 m^2 = 0 independently
      const A = m * m; const B = -(2 * p * m * m + 4 * p); const C = p * p * m * m;
      const d = Math.sqrt(B * B - 4 * A * C);
      const x1 = (-B + d) / (2 * A); const x2 = (-B - d) / (2 * A);
      const y = (x) => m * (x - p);
      return near(Math.hypot(x1 - x2, y(x1) - y(x2)), fnum(len), 1e-6);
    },
  });
}

function parabolaLatusTriangle(random, profile) {
  const p = ri(random, 1, 6);
  const area = 2 * p * p;
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-parabola',
    prompt: T(`포물선 $y^2=4px\\ (p>0)$ 의 초점 $\\mathrm{F}$ 를 지나고 $x$축에 수직인 직선이 포물선과 만나는 두 점을 $\\mathrm{A},\\ \\mathrm{B}$ 라 하자. 삼각형 $\\mathrm{OAB}$ 의 넓이가 $${area}$ 일 때, 포물선의 초점과 준선 사이의 거리는? (단, $\\mathrm{O}$ 는 원점이다.)`,
      `Given the area of triangle OAB, find the distance between the focus and directrix.`),
    answer: Fr(2 * p),
    explanation: T(`$\\mathrm{A}(p,\\ 2p),\\ \\mathrm{B}(p,\\ -2p)$ 이므로 삼각형 $\\mathrm{OAB}$ 의 넓이는 $\\frac12\\times 4p\\times p=2p^2=${area}$ → $p=${p}$.\n초점 $(p,0)$ 과 준선 $x=-p$ 사이의 거리는 $2p=${2 * p}$`,
      `Area 2p^2 = ${area}; distance 2p = ${2 * p}.`),
    verify: () => {
      const A = [p, 2 * p]; const B = [p, -2 * p];
      near(0.5 * Math.abs(A[0] * B[1] - A[1] * B[0]), area, 1e-9);
      return 2 * p;
    },
  });
}

function parabolaMinSum(random, profile) {
  const p = ri(random, 1, 3);
  const b = ri(random, -3, 3);
  const a = Math.floor((b * b) / (4 * p)) + ri(random, 1, 4);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-parabola',
    prompt: T(`포물선 $y^2=${4 * p}x$ 의 초점을 $\\mathrm{F}$, 점 $\\mathrm{A}(${a},\\ ${b})$ 라 하자. 포물선 위의 점 $\\mathrm{P}$ 에 대하여 $\\overline{\\mathrm{PA}}+\\overline{\\mathrm{PF}}$ 의 최솟값은?`,
      `Minimum of PA + PF.`),
    answer: Fr(a + p),
    explanation: T(`점 $\\mathrm{P}$ 에서 준선 $x=-${p}$ 에 내린 수선의 발을 $\\mathrm{H}$ 라 하면 $\\overline{\\mathrm{PF}}=\\overline{\\mathrm{PH}}$ 이므로 $\\overline{\\mathrm{PA}}+\\overline{\\mathrm{PF}}=\\overline{\\mathrm{PA}}+\\overline{\\mathrm{PH}}\\ge$ (점 $\\mathrm{A}$ 와 준선 사이의 거리) $=${a}+${p}=${a + p}$.\n점 $\\mathrm{A}$ 가 포물선의 내부에 있으므로 등호가 성립한다.`,
      `Distance from A to the directrix: ${a + p}.`),
    verify: () => {
      let mn = Infinity;
      for (let i = -4000; i <= 4000; i += 1) {
        const y = i / 100; const x = (y * y) / (4 * p);
        mn = Math.min(mn, Math.hypot(x - a, y - b) + Math.hypot(x - p, y));
      }
      return near(mn, a + p, 1e-3);
    },
  });
}

// ===== 02 타원 ============================================================================
function ellipseTrianglePerimeter(random, profile) {
  const [a, b, c] = pick(random, ELLIPSE);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-ellipse',
    prompt: T(`타원 $\\frac{x^2}{${a * a}}+\\frac{y^2}{${b * b}}=1$ 의 두 초점을 $\\mathrm{F},\\ \\mathrm{F}'$ 이라 하고, 이 타원 위의 점 $\\mathrm{P}$ (단, 꼭짓점 제외) 에 대하여 삼각형 $\\mathrm{PFF}'$ 의 둘레의 길이는?`,
      `Perimeter of triangle PFF' for a point P on the ellipse.`),
    answer: Fr(2 * a + 2 * c),
    explanation: T(`타원의 정의에 의하여 $\\overline{\\mathrm{PF}}+\\overline{\\mathrm{PF}'}=2a=${2 * a}$ 이고, $c=\\sqrt{${a * a}-${b * b}}=${c}$ 이므로 $\\overline{\\mathrm{FF}'}=2c=${2 * c}$.\n따라서 둘레의 길이는 $${2 * a}+${2 * c}=${2 * a + 2 * c}$`,
      `2a + 2c = ${2 * a + 2 * c}.`),
    verify: () => {
      const t = 0.7; const P = [a * Math.cos(t), b * Math.sin(t)];
      const per = Math.hypot(P[0] - c, P[1]) + Math.hypot(P[0] + c, P[1]) + 2 * c;
      return near(per, 2 * a + 2 * c);
    },
  });
}

function ellipseRightAngleArea(random, profile) {
  const [a, b, c] = pick(random, [[5, 3, 4], [10, 6, 8], [13, 5, 12], [17, 8, 15], [25, 7, 24], [15, 9, 12], [20, 12, 16], [5, 4, 3]]);
  // right angle at P exists on the ellipse iff c >= b
  if (c < b) return ellipseRightAngleArea(random, profile);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-ellipse',
    prompt: T(`타원 $\\frac{x^2}{${a * a}}+\\frac{y^2}{${b * b}}=1$ 의 두 초점을 $\\mathrm{F},\\ \\mathrm{F}'$ 이라 하자. 타원 위의 점 $\\mathrm{P}$ 에 대하여 $\\angle\\mathrm{FPF}'=90^\\circ$ 일 때, 삼각형 $\\mathrm{PFF}'$ 의 넓이는?`,
      `Area of the right triangle PFF'.`),
    answer: Fr(b * b),
    explanation: T(`$\\overline{\\mathrm{PF}}=m,\\ \\overline{\\mathrm{PF}'}=n$ 이라 하면 $m+n=${2 * a}$, $m^2+n^2=(2c)^2=${4 * c * c}$ 이므로 $mn=\\frac{(m+n)^2-(m^2+n^2)}{2}=\\frac{${4 * a * a}-${4 * c * c}}{2}=${2 * b * b}$.\n넓이는 $\\frac12mn=${b * b}$`,
      `Area = b^2 = ${b * b}.`),
    verify: () => {
      // find P on the ellipse with right angle at P by scanning
      let best = null; let bestAbs = Infinity;
      for (let i = 0; i < 400000; i += 1) {
        const t = (Math.PI * 2 * i) / 400000; const P = [a * Math.cos(t), b * Math.sin(t)];
        const d = Math.abs((c - P[0]) * (-c - P[0]) + P[1] * P[1]);
        if (d < bestAbs) { bestAbs = d; best = P; }
      }
      const area = 0.5 * Math.abs(2 * c * best[1]);
      return near(area, b * b, 1e-3);
    },
  });
}

function ellipseFocalRatio(random, profile) {
  const [a, b, c] = pick(random, ELLIPSE);
  const m = ri(random, 1, 3); const n = m + ri(random, 1, 3);
  const pf0 = (2 * a * m) / (m + n);
  if ((2 * a * m) % (m + n) !== 0 || Math.abs(pf0 - (2 * a - pf0)) > 2 * c) return ellipseFocalRatio(random, profile);
  const pf = pf0;
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-ellipse',
    prompt: T(`타원 $\\frac{x^2}{${a * a}}+\\frac{y^2}{${b * b}}=1$ 의 두 초점을 $\\mathrm{F},\\ \\mathrm{F}'$ 이라 하자. 타원 위의 한 점 $\\mathrm{P}$ 에 대하여 $\\overline{\\mathrm{PF}}:\\overline{\\mathrm{PF}'}=${m}:${n}$ 일 때, $\\overline{\\mathrm{PF}}$ 의 길이는?`,
      `Find PF.`),
    answer: Fr(pf),
    explanation: T(`$\\overline{\\mathrm{PF}}+\\overline{\\mathrm{PF}'}=2a=${2 * a}$ 이고 비가 $${m}:${n}$ 이므로 $\\overline{\\mathrm{PF}}=${2 * a}\\times\\frac{${m}}{${m + n}}=${pf}$`,
      `PF = 2a·m/(m+n) = ${pf}.`),
    verify: () => {
      // exists a point with the ratio: |PF|-|PF'| varies in [-2c, 2c]
      const diff = pf - (2 * a - pf);
      if (Math.abs(diff) > 2 * c + 1e-9) throw new Error('ratio impossible');
      return near(pf + (2 * a - pf), 2 * a) && pf;
    },
  });
}

function ellipseFocusDistanceProduct(random, profile) {
  const [a, b, c] = pick(random, ELLIPSE);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-ellipse',
    prompt: T(`타원 $\\frac{x^2}{${a * a}}+\\frac{y^2}{${b * b}}=1$ 의 한 초점 $\\mathrm{F}$ 에서 타원 위의 점까지의 거리의 최댓값을 $M$, 최솟값을 $m$ 이라 할 때, $Mm$ 의 값은?`,
      `Find M·m.`),
    answer: Fr(b * b),
    explanation: T(`$c=${c}$ 이므로 최댓값 $M=a+c=${a + c}$, 최솟값 $m=a-c=${a - c}$ 이다.\n따라서 $Mm=(a+c)(a-c)=a^2-c^2=b^2=${b * b}$`,
      `M=a+c, m=a-c, Mm=b^2.`),
    verify: () => {
      let mx = -Infinity; let mn = Infinity;
      for (let i = 0; i < 200000; i += 1) { const t = (Math.PI * 2 * i) / 200000; const d = Math.hypot(a * Math.cos(t) - c, b * Math.sin(t)); mx = Math.max(mx, d); mn = Math.min(mn, d); }
      return near(mx * mn, b * b, 1e-3);
    },
  });
}

function ellipseFindConstant(random, profile) {
  const [a, b, c] = pick(random, ELLIPSE);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-ellipse',
    prompt: T(`두 점 $\\mathrm{F}(${c},\\ 0),\\ \\mathrm{F}'(-${c},\\ 0)$ 을 초점으로 하고 장축의 길이가 $${2 * a}$ 인 타원의 단축의 길이는?`,
      `Find the length of the minor axis.`),
    answer: Fr(2 * b),
    explanation: T(`장축의 길이가 $2a=${2 * a}$ 이므로 $a=${a}$, 초점이 $(\\pm${c},0)$ 이므로 $c=${c}$ 이다.\n$b^2=a^2-c^2=${a * a - c * c}$ 이므로 $b=${b}$ 이고 단축의 길이는 $2b=${2 * b}$`,
      `b^2 = a^2 - c^2 → 2b = ${2 * b}.`),
    verify: () => near(Math.sqrt(a * a - c * c) * 2, 2 * b),
  });
}

// ===== 03 쌍곡선 ===========================================================================
function hyperbolaFocalDifference(random, profile) {
  const [a, b, c] = pick(random, HYPER);
  const pf2 = c - a + ri(random, 1, 6);
  const pf = 2 * a + pf2; // P on the right branch: PF - PF' = 2a, F' is the left focus
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-hyperbola',
    prompt: T(`쌍곡선 $\\frac{x^2}{${a * a}}-\\frac{y^2}{${b * b}}=1$ 의 두 초점을 $\\mathrm{F}(c,0),\\ \\mathrm{F}'(-c,0)$ ($c>0$) 이라 하자. 이 쌍곡선의 오른쪽 가지 위의 점 $\\mathrm{P}$ 에 대하여 $\\overline{\\mathrm{PF}'}=${pf}$ 일 때, $\\overline{\\mathrm{PF}}$ 의 길이는?`,
      `Find PF.`),
    answer: Fr(pf - 2 * a),
    explanation: T(`쌍곡선의 정의에 의하여 $|\\overline{\\mathrm{PF}'}-\\overline{\\mathrm{PF}}|=2a=${2 * a}$ 이다. 점 $\\mathrm{P}$ 가 오른쪽 가지 위에 있으므로 $\\overline{\\mathrm{PF}'}>\\overline{\\mathrm{PF}}$ 이다.\n$\\overline{\\mathrm{PF}}=${pf}-${2 * a}=${pf - 2 * a}$`,
      `PF = PF' - 2a.`),
    verify: () => {
      // on the right branch PF' = e x + a  (focal-radius formula) -> locate P, then measure both distances
      const x = ((pf - a) * a) / c;
      const y = b * Math.sqrt((x * x) / (a * a) - 1);
      near(Math.hypot(x + c, y), pf, 1e-9);
      return near(Math.hypot(x - c, y), pf - 2 * a, 1e-9);
    },
  });
}

function hyperbolaAsymptote(random, profile) {
  const [a, b, c] = pick(random, HYPER);
  const T = (ko, en) => tx(profile, ko, en);
  const g = (x, y) => { const d = (u, v) => (v === 0 ? u : d(v, u % v)); return d(x, y); };
  const gg = g(a, b);
  return finish(random, {
    tag: 'jg-hyperbola',
    prompt: T(`쌍곡선 $\\frac{x^2}{a^2}-\\frac{y^2}{b^2}=1$ 의 점근선의 방정식이 $y=\\pm${b / gg === 1 ? '' : `\\frac{${b / gg}}{${a / gg}}`}${b / gg === 1 && a / gg === 1 ? '' : ''}x$ 이고 두 초점 사이의 거리가 $${2 * c}$ 일 때, $a+b$ 의 값은? (단, $a>0,\\ b>0$)`,
      `Find a+b.`),
    answer: Fr(a + b),
    explanation: T(`점근선의 기울기가 $\\frac{b}{a}=\\frac{${b / gg}}{${a / gg}}$ 이므로 $a=${a / gg}k,\\ b=${b / gg}k$ 로 놓는다. 두 초점 사이의 거리가 $2c=${2 * c}$ 이므로 $c=${c}$, $c^2=a^2+b^2$ 에서 $k^2(${(a / gg) ** 2}+${(b / gg) ** 2})=${c * c}$ → $k=${gg}$ 이다.\n따라서 $a=${a},\\ b=${b}$ 이고 $a+b=${a + b}$`,
      `a=${a}, b=${b}.`),
    verify: () => { near(Math.hypot(a, b), c); return a + b; },
  });
}

function hyperbolaRightAngleArea(random, profile) {
  const [a, b, c] = pick(random, HYPER);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-hyperbola',
    prompt: T(`쌍곡선 $\\frac{x^2}{${a * a}}-\\frac{y^2}{${b * b}}=1$ 의 두 초점을 $\\mathrm{F},\\ \\mathrm{F}'$ 이라 하자. 쌍곡선 위의 점 $\\mathrm{P}$ 에 대하여 $\\angle\\mathrm{FPF}'=90^\\circ$ 일 때, 삼각형 $\\mathrm{PFF}'$ 의 넓이는?`,
      `Area of the right triangle.`),
    answer: Fr(b * b),
    explanation: T(`$\\overline{\\mathrm{PF}}=m,\\ \\overline{\\mathrm{PF}'}=n$ 이라 하면 $|m-n|=2a=${2 * a}$, $m^2+n^2=(2c)^2=${4 * c * c}$ 이므로 $mn=\\frac{(m^2+n^2)-(m-n)^2}{2}=\\frac{${4 * c * c}-${4 * a * a}}{2}=${2 * b * b}$.\n넓이는 $\\frac12mn=${b * b}$`,
      `Area = b^2 = ${b * b}.`),
    verify: () => {
      let best = null; let bestAbs = Infinity;
      for (let x = a; x < 60; x += 0.0004) {
        const y = b * Math.sqrt((x * x) / (a * a) - 1);
        const d = Math.abs((c - x) * (-c - x) + y * y);
        if (d < bestAbs) { bestAbs = d; best = [x, y]; }
      }
      return near(0.5 * 2 * c * best[1], b * b, 1e-2);
    },
  });
}

function hyperbolaVertexDistance(random, profile) {
  const [a, b, c] = pick(random, HYPER);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-hyperbola',
    prompt: T(`중심이 원점이고 한 초점이 $(${c},\\ 0)$ 이며 주축의 길이가 $${2 * a}$ 인 쌍곡선의 $b^2$ 의 값은? (단, 쌍곡선의 방정식은 $\\frac{x^2}{a^2}-\\frac{y^2}{b^2}=1$)`,
      `Find b^2.`),
    answer: Fr(b * b),
    explanation: T(`주축의 길이가 $2a=${2 * a}$ 이므로 $a=${a}$, 초점이 $(${c},0)$ 이므로 $c=${c}$.\n$b^2=c^2-a^2=${c * c}-${a * a}=${b * b}$`,
      `b^2 = c^2 - a^2.`),
    verify: () => near(c * c - a * a, b * b),
  });
}

function hyperbolaFocusAsymptoteDistance(random, profile) {
  const [a, b, c] = pick(random, HYPER);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-hyperbola',
    prompt: T(`쌍곡선 $\\frac{x^2}{${a * a}}-\\frac{y^2}{${b * b}}=1$ 의 한 초점에서 한 점근선에 이르는 거리는?`,
      `Distance from a focus to an asymptote.`),
    answer: Fr(b),
    explanation: T(`초점 $(${c},0)$ 과 점근선 $${b}x-${a}y=0$ 사이의 거리는 $\\frac{|${b}\\cdot ${c}|}{\\sqrt{${b * b}+${a * a}}}=\\frac{${b * c}}{${c}}=${b}$ 이다.`,
      `The distance equals b.`),
    verify: () => near(Math.abs(b * c) / Math.hypot(a, b), b),
  });
}

// ===== 04 음함수 · 매개변수 =================================================================
function paramSlope(random, profile) {
  const a = ri(random, 1, 4); const b = ri(random, -4, 4); const c = ri(random, 1, 4); const d = ri(random, -4, 4);
  const t0 = ri(random, 1, 3);
  const dx = 2 * a * t0 + b; const dy = 3 * c * t0 * t0 + d;
  if (dx === 0) return paramSlope(random, profile);
  const T = (ko, en) => tx(profile, ko, en);
  const ans = Fr(dy, dx);
  return finish(random, {
    tag: 'jg-implicit-param',
    prompt: T(`매개변수 $t\\ (t>0)$ 으로 나타내어진 곡선 $x=${co(a)}t^2${b === 0 ? '' : `${b > 0 ? '+' : ''}${co(b)}t`},\\ y=${co(c)}t^3${d === 0 ? '' : `${d > 0 ? '+' : ''}${co(d)}t`}$ 에서 $t=${t0}$ 에 대응하는 점에서의 접선의 기울기는?`,
      `Find the slope of the tangent at t=${t0}.`),
    answer: ans,
    explanation: T(`$\\frac{dx}{dt}=${2 * a}t${b === 0 ? '' : `${b > 0 ? '+' : ''}${b}`},\\ \\frac{dy}{dt}=${3 * c}t^2${d === 0 ? '' : `${d > 0 ? '+' : ''}${d}`}$ 이므로 $\\frac{dy}{dx}=\\frac{dy/dt}{dx/dt}$.\n$t=${t0}$ 일 때 $\\frac{${dy}}{${dx}}=${ftex(ans)}$`,
      `dy/dx = (dy/dt)/(dx/dt) = ${ftex(ans)}.`),
    verify: () => {
      const x = (t) => a * t * t + b * t; const y = (t) => c * t ** 3 + d * t;
      return near(numeric.deriv(y, t0) / numeric.deriv(x, t0), fnum(ans), 1e-4);
    },
  });
}

function implicitSlope(random, profile) {
  const x0 = ri(random, 1, 3); const y0 = ri(random, 1, 3);
  const k = pick(random, [1, 2, 3]);
  // x^2 + k x y + y^2 = C ; dy/dx = -(2x + k y)/(k x + 2y)
  const C = x0 * x0 + k * x0 * y0 + y0 * y0;
  const num_ = -(2 * x0 + k * y0); const den = k * x0 + 2 * y0;
  const ans = Fr(num_, den);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-implicit-param',
    prompt: T(`곡선 $x^2${k === 1 ? '+xy' : `+${k}xy`}+y^2=${C}$ 위의 점 $(${x0},\\ ${y0})$ 에서의 접선의 기울기는?`,
      `Find the slope of the tangent at (${x0}, ${y0}).`),
    answer: ans,
    explanation: T(`양변을 $x$ 에 대하여 미분하면 $2x+${k}y+${k}x\\frac{dy}{dx}+2y\\frac{dy}{dx}=0$ 이므로 $\\frac{dy}{dx}=-\\frac{2x+${k}y}{${k}x+2y}$.\n$(${x0},\\ ${y0})$ 에서 $-\\frac{${2 * x0 + k * y0}}{${den}}=${ftex(ans)}$`,
      `Implicit differentiation: ${ftex(ans)}.`),
    verify: () => {
      // slope by solving for y near the point
      const yOf = (x) => { // solve y^2 + k x y + x^2 - C = 0 for the root near y0
        const disc = k * k * x * x - 4 * (x * x - C);
        const r1 = (-k * x + Math.sqrt(disc)) / 2; const r2 = (-k * x - Math.sqrt(disc)) / 2;
        return Math.abs(r1 - y0) < Math.abs(r2 - y0) ? r1 : r2;
      };
      return near(numeric.deriv(yOf, x0, 1e-5), fnum(ans), 1e-4);
    },
  });
}

function implicitCubic(random, profile) {
  const x0 = ri(random, 1, 3); const y0 = ri(random, 1, 3);
  // x^3 + y^3 = C  -> dy/dx = -x^2 / y^2
  const C = x0 ** 3 + y0 ** 3;
  const ans = Fr(-x0 * x0, y0 * y0);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-implicit-param',
    prompt: T(`곡선 $x^3+y^3=${C}$ 위의 점 $(${x0},\\ ${y0})$ 에서의 접선의 방정식을 $y=mx+n$ 이라 할 때, $${y0 * y0}(m+n)$ 의 값은?`,
      `Find ${y0 * y0}(m+n).`),
    answer: fmul(Fr(y0 * y0), fadd(ans, fsub(Fr(y0), fmul(ans, Fr(x0))))),
    explanation: T(`양변을 미분하면 $3x^2+3y^2\\frac{dy}{dx}=0$ 이므로 $\\frac{dy}{dx}=-\\frac{x^2}{y^2}$. $(${x0},\\ ${y0})$ 에서 $m=${ftex(ans)}$.\n$n=${y0}-m\\cdot ${x0}=${ftex(fsub(Fr(y0), fmul(ans, Fr(x0))))}$ 이므로 $${y0 * y0}(m+n)=${ftex(fmul(Fr(y0 * y0), fadd(ans, fsub(Fr(y0), fmul(ans, Fr(x0))))))}$`,
      `m = -x0^2/y0^2.`),
    verify: () => {
      const m = -(x0 * x0) / (y0 * y0); const n = y0 - m * x0;
      const yOf = (x) => Math.cbrt(C - x ** 3);
      near(numeric.deriv(yOf, x0, 1e-5), m, 1e-4);
      return near(y0 * y0 * (m + n), fnum(fmul(Fr(y0 * y0), fadd(ans, fsub(Fr(y0), fmul(ans, Fr(x0)))))), 1e-6);
    },
    allowShort: false,
  });
}

function paramTangentIntercept(random, profile) {
  const t0 = ri(random, 1, 3);
  const k = ri(random, 1, 3);
  // x = t^2, y = k t^3 : slope = 3k t/2
  const x0 = t0 * t0; const y0 = k * t0 ** 3; const m = Fr(3 * k * t0, 2);
  const yint = fsub(Fr(y0), fmul(m, Fr(x0)));
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-implicit-param',
    prompt: T(`매개변수 $t\\ (t>0)$ 으로 나타내어진 곡선 $x=t^2,\\ y=${co(k)}t^3$ 위의 $t=${t0}$ 에 대응하는 점에서의 접선의 $y$절편은?`,
      `Find the y-intercept of the tangent at t=${t0}.`),
    answer: yint,
    explanation: T(`$\\frac{dy}{dx}=\\frac{${3 * k}t^2}{2t}=\\frac{${3 * k}t}{2}$ 이므로 $t=${t0}$ 에서의 기울기는 $${ftex(m)}$, 접점은 $(${x0},\\ ${y0})$.\n접선의 방정식 $y-${y0}=${ftex(m)}(x-${x0})$ 에서 $y$절편은 $${ftex(yint)}$`,
      `Tangent y-intercept ${ftex(yint)}.`),
    verify: () => {
      const x = (t) => t * t; const y = (t) => k * t ** 3;
      const slope = numeric.deriv(y, t0) / numeric.deriv(x, t0);
      return near(y(t0) - slope * x(t0), fnum(yint), 1e-4);
    },
  });
}

// ===== 05 이차곡선의 접선 ===================================================================
function parabolaTangentAtPoint(random, profile) {
  const p = ri(random, 1, 4); const s = pick(random, [1, 2, 3, -1, -2, -3]);
  const x1 = p * s * s; const y1 = 2 * p * s;
  // tangent: y1 y = 2p (x + x1) -> x-intercept = -x1
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-conic-tangent',
    prompt: T(`포물선 $y^2=${4 * p}x$ 위의 점 $(${x1},\\ ${y1})$ 에서의 접선이 $x$축과 만나는 점의 $x$좌표를 $a$, $y$축과 만나는 점의 $y$좌표를 $b$ 라 할 때, $a+b$ 의 값은?`,
      `Find a+b for the tangent intercepts.`),
    answer: Fr(-x1 + (2 * p * x1) / y1),
    explanation: T(`접선의 방정식은 $${y1}y=${2 * p}(x+${x1})$ 이다. $y=0$ 이면 $x=-${x1}$ 이므로 $a=${-x1}$, $x=0$ 이면 $y=\\frac{${2 * p * x1}}{${y1}}$ 이므로 $b=${ftex(Fr(2 * p * x1, y1))}$.\n따라서 $a+b=${ftex(Fr(-x1 + (2 * p * x1) / y1))}$`,
      `Tangent: y1·y = 2p(x+x1).`),
    verify: () => {
      const f = (x) => (x >= 0 ? Math.sqrt(4 * p * x) * Math.sign(y1) : NaN);
      const slope = numeric.deriv(f, x1, 1e-5);
      const b = y1 - slope * x1; const a = x1 - y1 / slope;
      return near(a + b, -x1 + (2 * p * x1) / y1, 1e-4);
    },
  });
}

function ellipseTangentArea(random, profile) {
  const [a, b] = pick(random, [[5, 3], [5, 4], [10, 6], [13, 5], [10, 8]]);
  // pick a rational point on the ellipse: (a cosθ, b sinθ) with 3-4-5
  const [cs, sn] = pick(random, [[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13]]).slice(0, 2);
  const h = Math.hypot(cs, sn);
  const x1 = Fr(a * cs, h); const y1 = Fr(b * sn, h);
  const xi = fdiv(Fr(a * a), x1); const yi = fdiv(Fr(b * b), y1);
  const area = fdiv(fmul(xi, yi), Fr(2));
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-conic-tangent',
    prompt: T(`타원 $\\frac{x^2}{${a * a}}+\\frac{y^2}{${b * b}}=1$ 위의 제1사분면의 점 $\\mathrm{P}\\left(${ftex(x1)},\\ ${ftex(y1)}\\right)$ 에서의 접선과 $x$축, $y$축으로 둘러싸인 삼각형의 넓이는?`,
      `Area of the triangle cut by the tangent.`),
    answer: area,
    explanation: T(`접선의 방정식은 $\\frac{${ftex(x1)}x}{${a * a}}+\\frac{${ftex(y1)}y}{${b * b}}=1$ 이므로 $x$절편은 $${ftex(xi)}$, $y$절편은 $${ftex(yi)}$.\n넓이는 $\\frac12\\times ${ftex(xi)}\\times ${ftex(yi)}=${ftex(area)}$`,
      `Intercepts ${ftex(xi)}, ${ftex(yi)}.`),
    verify: () => {
      const X = fnum(x1); const Y = fnum(y1);
      near((X * X) / (a * a) + (Y * Y) / (b * b), 1, 1e-9);
      const f = (x) => b * Math.sqrt(1 - (x * x) / (a * a));
      const m = numeric.deriv(f, X, 1e-6);
      const xInt = X - Y / m; const yInt = Y - m * X;
      return near(0.5 * Math.abs(xInt * yInt), fnum(area), 1e-4);
    },
    allowShort: false,
  });
}

const TANGENT_COMBOS = [];
[[2, 1], [3, 2], [4, 3], [5, 3], [5, 4], [3, 1], [4, 2], [5, 2], [6, 3], [5, 1], [6, 4], [7, 4], [8, 6]].forEach(([a, b]) => {
  for (let m = 1; m <= 8; m += 1) {
    const r2 = a * a * m * m - b * b;
    const r = Math.round(Math.sqrt(r2));
    if (r2 > 0 && r * r === r2) TANGENT_COMBOS.push([a, b, m, r]);
  }
});

function hyperbolaTangentSlope(random, profile) {
  const [a, b, m, r] = pick(random, TANGENT_COMBOS);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-conic-tangent',
    prompt: T(`쌍곡선 $\frac{x^2}{${a * a}}-\frac{y^2}{${b * b}}=1$ 에 접하고 기울기가 $${m}$ 인 두 접선의 $y$절편을 각각 $p,\ q$ 라 할 때, $p-q$ 의 값은? (단, $p>q$)`,
      `Find p-q.`),
    answer: Fr(2 * r),
    explanation: T(`기울기가 $${m}$ 인 접선의 방정식은 $y=${m}x\pm\sqrt{${a * a}\cdot ${m * m}-${b * b}}=${m}x\pm ${r}$ 이다.
따라서 $p=${r},\ q=${-r}$ 이고 $p-q=${2 * r}$`,
      `Tangents y = mx ± sqrt(a²m² - b²).`),
    verify: () => {
      const A = 1 / (a * a) - (m * m) / (b * b); const B = -(2 * m * r) / (b * b); const C = -(r * r) / (b * b) - 1;
      near(B * B - 4 * A * C, 0, 1e-9);
      return 2 * r;
    },
  });
}

function ellipseDirectorCircle(random, profile) {
  const [a, b] = pick(random, [[3, 2], [4, 3], [5, 3], [5, 4], [6, 4], [7, 5]]);
  const T = (ko, en) => tx(profile, ko, en);
  const k = a * a + b * b;
  return finish(random, {
    tag: 'jg-conic-tangent',
    prompt: T(`타원 $\\frac{x^2}{${a * a}}+\\frac{y^2}{${b * b}}=1$ 에 그은 서로 수직인 두 접선의 교점이 그리는 도형의 방정식이 $x^2+y^2=k$ 일 때, $k$ 의 값은?`,
      `Find k for the director circle.`),
    answer: Fr(k),
    explanation: T(`기울기가 $m$ 인 접선은 $y=mx\\pm\\sqrt{${a * a}m^2+${b * b}}$ 이고, 서로 수직인 두 접선의 교점의 자취는 반지름이 $\\sqrt{a^2+b^2}$ 인 원이다.\n따라서 $k=${a * a}+${b * b}=${k}$`,
      `k = a^2 + b^2.`),
    verify: () => {
      // intersection of tangents with slope m and -1/m
      const m = 0.8; const c1 = Math.sqrt(a * a * m * m + b * b); const m2 = -1 / m; const c2 = Math.sqrt(a * a * m2 * m2 + b * b);
      // y = m x + c1 and y = m2 x + c2
      const x = (c2 - c1) / (m - m2); const y = m * x + c1;
      return near(x * x + y * y, k, 1e-9);
    },
  });
}

// ===== 09 속도와 가속도 (평면 운동) ===========================================================
function speedAtTime(random, profile) {
  const [u, v, w] = pick(random, TRIPLES);
  const t0 = ri(random, 1, 3);
  // x = A t^2 + B t with x'(t0) = u ; y = C t^2 + D t with y'(t0) = v  (choose A=C=1 -> B = u-2 t0, D = v-2 t0)
  const A = 1; const B = u - 2 * t0; const C = 1; const D = v - 2 * t0;
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-velocity',
    prompt: T(`좌표평면 위를 움직이는 점 $\\mathrm{P}$ 의 시각 $t\\ (t>0)$ 에서의 위치 $(x,\\ y)$ 가 $x=t^2${B === 0 ? '' : `${B > 0 ? '+' : ''}${co(B)}t`},\\ y=t^2${D === 0 ? '' : `${D > 0 ? '+' : ''}${co(D)}t`}$ 이다. $t=${t0}$ 일 때, 점 $\\mathrm{P}$ 의 속력은?`,
      `Find the speed at t=${t0}.`),
    answer: Fr(w),
    explanation: T(`$\\frac{dx}{dt}=2t${B === 0 ? '' : `${B > 0 ? '+' : ''}${B}`},\\ \\frac{dy}{dt}=2t${D === 0 ? '' : `${D > 0 ? '+' : ''}${D}`}$ 이므로 $t=${t0}$ 에서 $\\left(\\frac{dx}{dt},\\ \\frac{dy}{dt}\\right)=(${u},\\ ${v})$.\n속력은 $\\sqrt{${u}^2+${v}^2}=${w}$`,
      `Speed = sqrt(x'^2 + y'^2) = ${w}.`),
    verify: () => {
      const x = (t) => A * t * t + B * t; const y = (t) => C * t * t + D * t;
      return near(Math.hypot(numeric.deriv(x, t0), numeric.deriv(y, t0)), w, 1e-4);
    },
  });
}

function accelerationMagnitude(random, profile) {
  const [u, v, w] = pick(random, [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17]]);
  const T = (ko, en) => tx(profile, ko, en);
  // x = (u/2) t^2 ... need integer: use x = u t^2 /2? choose even u,v: scale by 2
  const A = u; const C = v;
  const ax = 2 * A; const ay = 2 * C; const mag = Math.hypot(ax, ay);
  return finish(random, {
    tag: 'jg-velocity',
    prompt: T(`좌표평면 위를 움직이는 점 $\\mathrm{P}$ 의 시각 $t$ 에서의 위치 $(x,\\ y)$ 가 $x=${co(A)}t^2+t,\\ y=${co(C)}t^2-2t$ 이다. 점 $\\mathrm{P}$ 의 가속도의 크기는?`,
      `Magnitude of the acceleration.`),
    answer: Fr(Math.round(mag)),
    explanation: T(`$\\frac{d^2x}{dt^2}=${ax},\\ \\frac{d^2y}{dt^2}=${ay}$ 이므로 가속도의 크기는 $\\sqrt{${ax}^2+${ay}^2}=${Math.round(mag)}$`,
      `|a| = sqrt(x''^2 + y''^2).`),
    verify: () => {
      const x = (t) => A * t * t + t; const y = (t) => C * t * t - 2 * t;
      const d2 = (f) => (f(1 + 1e-3) - 2 * f(1) + f(1 - 1e-3)) / 1e-6;
      return near(Math.hypot(d2(x), d2(y)), Math.round(mag), 1e-4);
    },
  });
}

function minimumSpeedTime(random, profile) {
  const k = ri(random, 1, 4); const t1 = ri(random, 1, 4);
  // x = t^2 - 2 k t ... speed^2 = (2t - 2k)^2 + (2t-... ) choose y = t^2 - 2 m t -> speed^2 = 4(t-k)^2 + 4 (t-m)^2 minimal at t = (k+m)/2
  const m = k + 2 * t1; const tmin = (k + m) / 2;
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jg-velocity',
    prompt: T(`좌표평면 위를 움직이는 점 $\\mathrm{P}$ 의 시각 $t\\ (t>0)$ 에서의 위치 $(x,\\ y)$ 가 $x=t^2-${2 * k}t,\\ y=t^2-${2 * m}t$ 이다. 점 $\\mathrm{P}$ 의 속력이 최소가 되는 시각 $t$ 의 값은?`,
      `Find the time at which the speed is minimal.`),
    answer: Fr(tmin),
    explanation: T(`$\\frac{dx}{dt}=2t-${2 * k},\\ \\frac{dy}{dt}=2t-${2 * m}$ 이므로 속력의 제곱은 $(2t-${2 * k})^2+(2t-${2 * m})^2$ 이고, 이 이차식은 $t=\\frac{${k}+${m}}{2}=${tmin}$ 에서 최소이다.`,
      `Minimum at t=(k+m)/2.`),
    verify: () => {
      let best = 0; let bv = Infinity;
      for (let i = 1; i <= 200000; i += 1) { const t = i / 10000; const s = (2 * t - 2 * k) ** 2 + (2 * t - 2 * m) ** 2; if (s < bv) { bv = s; best = t; } }
      return near(best, tmin, 1e-3);
    },
  });
}

function distanceTraveledParam(random, profile) {
  const k = ri(random, 1, 3);
  // x = k t^2, y = 2k t^3/3 *... use x = t^3/3? choose x = (2/3) t^{3/2}... simpler: x=t^2, y=(2/3)(... ) use curve x=t^2/2? known: x = t^3, y = 3t^2/2... speed = sqrt(9t^4+9t^2)=3t sqrt(t^2+1) -> integral closed form
  // Use x = t^2, y = t^3 - 3t ... instead: speed constant: x = 3t, y = 4t -> distance 5 per unit time
  const [u, v, w] = pick(random, TRIPLES);
  const len = ri(random, 2, 5);
  const T = (ko, en) => tx(profile, ko, en);
  void k;
  return finish(random, {
    tag: 'jg-velocity',
    prompt: T(`좌표평면 위를 움직이는 점 $\\mathrm{P}$ 의 시각 $t$ 에서의 위치 $(x,\\ y)$ 가 $x=${u}t+1,\\ y=${v}t-2$ 이다. $t=0$ 에서 $t=${len}$ 까지 점 $\\mathrm{P}$ 가 움직인 거리는?`,
      `Distance travelled between t=0 and t=${len}.`),
    answer: Fr(w * len),
    explanation: T(`$\\frac{dx}{dt}=${u},\\ \\frac{dy}{dt}=${v}$ 이므로 속력은 $\\sqrt{${u}^2+${v}^2}=${w}$ 로 일정하다.\n따라서 움직인 거리는 $${w}\\times ${len}=${w * len}$`,
      `Constant speed ${w}; distance ${w * len}.`),
    verify: () => near(numeric.integral(() => Math.hypot(u, v), 0, len), w * len, 1e-9),
  });
}

export const CONICS_ENGINES = {
  'jg-parabola': [parabolaThroughPoint, parabolaFocalRatio, parabolaFocalChordLength, parabolaLatusTriangle, parabolaMinSum],
  'jg-ellipse': [ellipseTrianglePerimeter, ellipseRightAngleArea, ellipseFocalRatio, ellipseFocusDistanceProduct, ellipseFindConstant],
  'jg-hyperbola': [hyperbolaFocalDifference, hyperbolaAsymptote, hyperbolaRightAngleArea, hyperbolaVertexDistance, hyperbolaFocusAsymptoteDistance],
  'jg-implicit-param': [paramSlope, implicitSlope, implicitCubic, paramTangentIntercept],
  'jg-conic-tangent': [parabolaTangentAtPoint, ellipseTangentArea, hyperbolaTangentSlope, ellipseDirectorCircle],
  'jg-velocity': [speedAtTime, accelerationMagnitude, minimumSpeedTime, distanceTraveledParam],
};

void fsub; void fadd; void fmul; void fdiv;
