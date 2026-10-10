// Calculus I applied problems, types 11-17: extrema, applications of derivatives, velocity /
// acceleration, definite integrals, integral applications, areas, velocity & distance (수학Ⅱ).
import {
  ri, pick, tx, Fr, fadd, fsub, fmul, fdiv, fnum, ftex, fcmp, finish,
  P, pEval, pDer, pInt, pMul, polyTex, defInt, absInt, F, numeric, gcd,
} from './common.js';

const near = (got, want, tol = 1e-4) => {
  if (!(Math.abs(got - want) <= tol * Math.max(1, Math.abs(want)))) throw new Error(`numeric mismatch: got ${got}, want ${want}`);
  return want;
};
const co = (v) => (v === 1 ? '' : v === -1 ? '-' : String(v));
const num = (n) => (n < 0 ? `(${n})` : String(n));
const sgnTxt = (n) => (n < 0 ? `-${-n}` : `+${n}`);
const nf = (f) => fnum(f);

// cubic x^3 - 3(p+q)/2 x^2 + 3pq x + c with critical points p<q (needs p+q even)
function cubicWithCritical(random) {
  let p; let q;
  do { p = ri(random, -3, 2); q = p + ri(random, 1, 5); } while ((p + q) % 2 !== 0);
  const c = ri(random, -6, 8);
  const poly = P(1, (-3 * (p + q)) / 2, 3 * p * q, c);
  return { p, q, c, poly };
}

// ===== 11 증가·감소와 극대·극소 ===============================================================
function extremaFindCoefficients(random, profile) {
  const { p, q, poly } = cubicWithCritical(random);
  const a = nf(poly[1]);
  const b = nf(poly[2]);
  const c = nf(poly[3]);
  const T = (ko, en) => tx(profile, ko, en);
  const vmax = pEval(poly, p);
  const vmin = pEval(poly, q);
  const ask = pick(random, ['max', 'min', 'sum']);
  const ans = ask === 'max' ? vmax : ask === 'min' ? vmin : fadd(vmax, vmin);
  const label = ask === 'max' ? '극댓값' : ask === 'min' ? '극솟값' : '극댓값과 극솟값의 합';
  return finish(random, {
    tag: 'jc1-extrema',
    prompt: T(`삼차함수 $f(x)=x^3+ax^2+bx${sgnTxt(c)}$ 이 $x=${p}$ 에서 극대, $x=${q}$ 에서 극소일 때, $f(x)$ 의 ${label}은? (단, $a, b$ 는 상수이다.)`,
      `f has a local max at x=${p} and a local min at x=${q}; find the requested extremum.`),
    answer: ans,
    explanation: T(`$f'(x)=3x^2+2ax+b$ 이고 $f'(x)=0$ 의 두 근이 $${p},\\ ${q}$ 이므로 $f'(x)=3(x-${num(p)})(x-${num(q)})$ → $a=${a}$, $b=${b}$.\n$f(x)=${polyTex(poly)}$ 이므로 극댓값 $f(${p})=${ftex(vmax)}$, 극솟값 $f(${q})=${ftex(vmin)}$.\n따라서 ${label}은 $${ftex(ans)}$`,
      `f'(x)=3(x-${p})(x-${q}); f(${p})=${ftex(vmax)}, f(${q})=${ftex(vmin)}.`),
    verify: () => {
      const f = (x) => nf(pEval(poly, x));
      near(numeric.deriv(f, p), 0, 1e-3);
      near(numeric.deriv(f, q), 0, 1e-3);
      return ask === 'max' ? f(p) : ask === 'min' ? f(q) : f(p) + f(q);
    },
  });
}

function extremaIncreasingRange(random, profile) {
  const m = ri(random, 2, 6);
  const sign = pick(random, [1, -1]);
  const T = (ko, en) => tx(profile, ko, en);
  // f = (sign/3) x^3 + a x^2 + m^2 x  => f' = sign x^2 + 2a x + m^2 ; monotone iff a^2 - sign*m^2 <= 0 -> need sign=1: |a|<=m
  // for sign=-1 : f' = -x^2+2ax - m^2 ... <=0 for all x iff a^2 <= m^2
  const count = 2 * m + 1;
  const func = sign === 1 ? `\\frac{1}{3}x^3+ax^2+${m * m}x` : `-\\frac{1}{3}x^3+ax^2-${m * m}x`;
  return finish(random, {
    positive: true,
    tag: 'jc1-extrema',
    prompt: T(`삼차함수 $f(x)=${func}$ 이 구간 $(-\\infty,\\ \\infty)$ 에서 ${sign === 1 ? '증가' : '감소'}하도록 하는 정수 $a$ 의 개수는?`,
      `Count the integers a for which f is ${sign === 1 ? 'increasing' : 'decreasing'} on R.`),
    answer: Fr(count),
    explanation: T(`$f'(x)=${sign === 1 ? '' : '-'}x^2+2ax${sign === 1 ? '+' : '-'}${m * m}$ 이다. ${sign === 1 ? '모든 실수 $x$ 에 대하여 $f\'(x)\\ge0$' : '모든 실수 $x$ 에 대하여 $f\'(x)\\le0$'} 이어야 하므로 판별식 $\\frac{D}{4}=a^2-${m * m}\\le0$ 이다.\n따라서 $-${m}\\le a\\le${m}$ 이고 정수 $a$ 의 개수는 $${count}$`,
      `Discriminant: a^2-${m * m}<=0 so -${m}<=a<=${m}; ${count} integers.`),
    verify: () => {
      let cnt = 0;
      for (let a = -20; a <= 20; a += 1) {
        const d = a * a - m * m;
        if (d <= 0) cnt += 1;
      }
      return near(cnt, count, 1e-9);
    },
  });
}

function extremaProductOfExtrema(random, profile) {
  const a = ri(random, 3, 9);
  const prod = a * (a - 4);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-extrema',
    prompt: T(`함수 $f(x)=x^3-3x^2+a$ 의 모든 극값의 곱이 $${prod}$ 일 때, 상수 $a$ 의 값은? (단, $a>2$)`,
      `Product of all local extrema is ${prod}; find a (a>2).`),
    answer: Fr(a),
    explanation: T(`$f'(x)=3x^2-6x=3x(x-2)$ 이므로 $x=0$ 에서 극대, $x=2$ 에서 극소이다.\n극댓값 $f(0)=a$, 극솟값 $f(2)=a-4$ 이므로 $a(a-4)=${prod}$ → $a^2-4a-${prod}=0$ → $(a-${a})(a+${a - 4})=0$.\n$a>2$ 이므로 $a=${a}$`,
      `a(a-4)=${prod} => a=${a}.`),
    verify: () => {
      const f = (x) => x ** 3 - 3 * x * x + a;
      near(f(0) * f(2), prod, 1e-9);
      return a;
    },
  });
}

function extremaDecreasingInterval(random, profile) {
  const m = ri(random, 2, 6);
  const c0 = ri(random, -5, 6);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-extrema',
    prompt: T(`함수 $f(x)=\\frac{1}{3}x^3-${m * m}x${sgnTxt(c0)}$ 이 열린 구간 $(-a,\\ a)$ 에서 감소할 때, 양수 $a$ 의 최댓값을 구하시오.`,
      `f decreases on (-a, a); find the maximum of positive a.`),
    answer: Fr(m),
    explanation: T(`$f'(x)=x^2-${m * m}=(x+${m})(x-${m})$ 이므로 $-${m}<x<${m}$ 에서 $f'(x)<0$, 즉 $f$ 는 $(-${m},\\ ${m})$ 에서 감소한다.\n$(-a,a)\\subset(-${m},${m})$ 이므로 $a$ 의 최댓값은 $${m}$`,
      `f'<0 on (-${m}, ${m}); max a=${m}.`),
    verify: () => {
      const f = (x) => x ** 3 / 3 - m * m * x + c0;
      near(numeric.deriv(f, m - 1e-3) < 0 ? 1 : 0, 1, 1e-9);
      near(numeric.deriv(f, m + 1e-3) > 0 ? 1 : 0, 1, 1e-9);
      return m;
    },
  });
}

function extremaDerivativeGraphLine(random, profile) {
  const pp = ri(random, -3, 1);
  const qq = pp + ri(random, 2, 5);
  const m = ri(random, pp + 1, qq - 1);
  const k = (m - pp) * (m - qq);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-extrema',
    prompt: T(`함수 $f(x)$ 의 도함수가 $f'(x)=(x${sgnTxt(-pp)})(x${sgnTxt(-qq)})$ 이다. 함수 $g(x)=f(x)-kx$ 가 $x=${m}$ 에서 극값을 가질 때, 상수 $k$ 의 값은?`,
      `g(x)=f(x)-kx has an extremum at x=${m}; find k.`),
    answer: Fr(k),
    explanation: T(`$g'(x)=f'(x)-k$ 이고 $x=${m}$ 에서 극값을 가지면 $g'(${m})=0$, 즉 $k=f'(${m})$.\n$k=(${m}-${num(pp)})(${m}-${num(qq)})=${k}$`,
      `k=f'(${m})=${k}.`),
    verify: () => {
      const fp = (x) => (x - pp) * (x - qq);
      near(fp(m), k, 1e-9);
      return k;
    },
  });
}

// ===== 12 미분법의 활용 ======================================================================
function appMaxMinInterval(random, profile) {
  const { p, q, poly } = cubicWithCritical(random);
  const lo = ri(random, p - 2, p);
  const hi = ri(random, q, q + 2);
  const cand = [lo, p, q, hi].filter((x) => x >= lo && x <= hi);
  const vals = cand.map((x) => pEval(poly, x));
  let M = vals[0]; let m = vals[0];
  vals.forEach((v) => { if (fcmp(v, M) > 0) M = v; if (fcmp(v, m) < 0) m = v; });
  const T = (ko, en) => tx(profile, ko, en);
  const ans = fadd(M, m);
  return finish(random, {
    tag: 'jc1-applications',
    prompt: T(`닫힌 구간 $[${lo},\\ ${hi}]$ 에서 함수 $f(x)=${polyTex(poly)}$ 의 최댓값을 $M$, 최솟값을 $m$ 이라 할 때, $M+m$ 의 값은?`,
      `On [${lo}, ${hi}] let M and m be the max and min of f; find M+m.`),
    answer: ans,
    explanation: T(`$f'(x)=3(x-${num(p)})(x-${num(q)})$ 이므로 극값을 갖는 $x=${p},\\ ${q}$ 와 양 끝점에서의 함숫값을 비교한다.\n${cand.map((x, i) => `$f(${x})=${ftex(vals[i])}$`).join(', ')}\n최댓값 $M=${ftex(M)}$, 최솟값 $m=${ftex(m)}$ 이므로 $M+m=${ftex(ans)}$`,
      `Compare critical and endpoint values: M=${ftex(M)}, m=${ftex(m)}.`),
    verify: () => {
      const f = (x) => nf(pEval(poly, x));
      let mx = -Infinity; let mn = Infinity;
      for (let i = 0; i <= 20000; i += 1) { const x = lo + ((hi - lo) * i) / 20000; mx = Math.max(mx, f(x)); mn = Math.min(mn, f(x)); }
      return near(mx + mn, nf(ans), 1e-4);
    },
  });
}

function appDistinctRoots(random, profile) {
  const { p, q, poly } = cubicWithCritical(random);
  // f0 = poly without the constant, equation f0(x) + a = 0 -> three distinct real roots iff -f0(p) > a?:  f(p)>0 and f(q)<0
  // f(x)=f0(x)+a ; f(p)=f0(p)+a>0 -> a>-f0(p) ; f(q)=f0(q)+a<0 -> a<-f0(q)
  const f0 = (x) => pEval(P(1, nf(poly[1]), nf(poly[2]), 0), x);
  const lowF = fadd(f0(p), Fr(0));
  const highF = f0(q);
  const lo = fneg2(lowF);
  const hi = fneg2(highF);
  const kind = pick(random, ['count', 'sum']);
  let ans = 0;
  for (let a = Math.floor(nf(lo)) - 1; a <= Math.ceil(nf(hi)) + 1; a += 1) {
    if (a > nf(lo) && a < nf(hi)) ans += kind === 'count' ? 1 : a;
  }
  const T = (ko, en) => tx(profile, ko, en);
  const eq = `${polyTex(P(1, nf(poly[1]), nf(poly[2]), 0))}+a=0`;
  return finish(random, {
    tag: 'jc1-applications',
    prompt: T(`삼차방정식 $${eq}$ 이 서로 다른 세 실근을 갖도록 하는 정수 $a$ 의 ${kind === 'count' ? '개수는' : '값의 합은'}?`,
      `The cubic has three distinct real roots; find the ${kind === 'count' ? 'number' : 'sum'} of integers a.`),
    answer: Fr(ans),
    explanation: T(`$f(x)=${polyTex(P(1, nf(poly[1]), nf(poly[2]), 0))}+a$ 라 하면 $f'(x)=3(x-${num(p)})(x-${num(q)})$ 이므로 $x=${p}$ 에서 극대, $x=${q}$ 에서 극소이다.\n서로 다른 세 실근을 가지려면 (극댓값)>0, (극솟값)<0 이어야 하므로\n$f(${p})=${ftex(f0(p))}+a>0,\\ f(${q})=${ftex(f0(q))}+a<0$ → $${ftex(lo)}<a<${ftex(hi)}$.\n이를 만족하는 정수 $a$ 의 ${kind === 'count' ? '개수' : '합'}은 $${ans}$`,
      `Need f(${p})>0>f(${q}): ${ftex(lo)}<a<${ftex(hi)}.`),
    verify: () => {
      let result = 0;
      const lowA = Math.floor(nf(lo)) - 3; const highA = Math.ceil(nf(hi)) + 3;
      for (let a = lowA; a <= highA; a += 1) {
        const g = (x) => x ** 3 + nf(poly[1]) * x * x + nf(poly[2]) * x + a;
        let roots = 0; let prev = g(-25);
        for (let i = 1; i <= 5000; i += 1) {
          const v = g(-25 + i * 0.01);
          if (prev === 0 || prev * v < 0) roots += 1;
          prev = v;
        }
        if (roots === 3) result += kind === 'count' ? 1 : a;
      }
      return near(result, ans, 1e-9);
    },
  });
}
function fneg2(f) { return Fr(-f.n, f.d); }

function appLineIntersections(random, profile) {
  const m = ri(random, 1, 4);
  const s = ri(random, -3, 5);
  // y = x^3 - (3m^2 + s) x ; line y = s x + k ; x^3 - 3 m^2 x - k = 0 ; critical +-m : f(-m)= 2m^3 ; f(m)=-2m^3 ; three roots iff -2m^3 < k < 2m^3 ; ask range endpoint 2m^3 .
  const hi = 2 * m ** 3;
  const T = (ko, en) => tx(profile, ko, en);
  const coefX = 3 * m * m + s;
  return finish(random, {
    positive: true,
    tag: 'jc1-applications',
    prompt: T(`곡선 $y=x^3${coefX === 0 ? '' : `-${coefX}x`}$ 와 직선 $y=${s === 0 ? '' : `${co(s)}x+`}k$ 가 서로 다른 세 점에서 만나도록 하는 정수 $k$ 의 개수는?`,
      `Count integers k for which the curve and the line meet in three points.`),
    answer: Fr(2 * hi - 1),
    explanation: T(`$x^3-${coefX}x=${s === 0 ? '' : `${co(s)}x+`}k$ 에서 $x^3-${3 * m * m}x=k$. 함수 $g(x)=x^3-${3 * m * m}x$ 는 $g'(x)=3(x+${m})(x-${m})$ 이므로 $x=-${m}$ 에서 극댓값 $${hi}$, $x=${m}$ 에서 극솟값 $${-hi}$ 를 갖는다.\n직선 $y=k$ 와 세 점에서 만나려면 $-${hi}<k<${hi}$.\n따라서 정수 $k$ 는 $${2 * hi - 1}$ 개`,
      `Three intersections iff -${hi}<k<${hi}: ${2 * hi - 1} integers.`),
    verify: () => {
      let cnt = 0;
      for (let k = -hi - 3; k <= hi + 3; k += 1) {
        const g = (x) => x ** 3 - 3 * m * m * x - k;
        let roots = 0; let prev = g(-15);
        for (let i = 1; i <= 3000; i += 1) { const v = g(-15 + i * 0.01); if (prev * v < 0 || prev === 0) roots += 1; prev = v; }
        if (roots === 3) cnt += 1;
      }
      return near(cnt, 2 * hi - 1, 1e-9);
    },
  });
}

function appInequalityMinimum(random, profile) {
  const mm = ri(random, 1, 4);
  const T = (ko, en) => tx(profile, ko, en);
  const c = 2 * mm ** 3;
  return finish(random, {
    tag: 'jc1-applications',
    prompt: T(`$x\\ge0$ 일 때 부등식 $x^3-3a^2x+${c}\\ge0$ 이 성립하도록 하는 실수 $a$ 의 최댓값은?`,
      `For x>=0 the inequality x^3-3a^2x+${c}>=0 holds; find the maximum of a.`),
    answer: Fr(mm),
    explanation: T(`$f(x)=x^3-3a^2x+${c}$ 라 하면 $f'(x)=3(x^2-a^2)$ 이므로 $x\\ge0$ 에서 $x=|a|$ 일 때 최소이다.\n최솟값 $f(|a|)=${c}-2|a|^3\\ge0$ 이므로 $|a|^3\\le${mm ** 3}$, $|a|\\le${mm}$.\n따라서 $a$ 의 최댓값은 $${mm}$`,
      `Min at x=|a|: ${c}-2|a|^3>=0 so |a|<=${mm}.`),
    verify: () => {
      const ok = (a) => { let mn = Infinity; for (let i = 0; i <= 5000; i += 1) { const x = i * 0.01; mn = Math.min(mn, x ** 3 - 3 * a * a * x + c); } return mn >= -1e-6; };
      near(ok(mm) ? 1 : 0, 1, 1e-9);
      near(ok(mm + 0.05) ? 1 : 0, 0, 1e-9);
      return mm;
    },
  });
}

function appTriangleArea(random, profile) {
  const a = pick(random, [2, 4, 6]);
  const ans = Fr(a ** 4, 32);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-applications',
    prompt: T(`곡선 $y=x(x-${a})^2$ 이 $x$축과 만나는 점을 각각 $\\mathrm{O}, \\mathrm{A}$ 라 하고, 곡선의 호 $\\mathrm{OA}$ 위의 한 점 $\\mathrm{P}$ 에서 $x$축에 내린 수선의 발을 $\\mathrm{H}$ 라 하자. 이때 삼각형 $\\mathrm{OPH}$ 의 넓이의 최댓값은?`,
      `Maximize the area of triangle OPH.`),
    answer: ans,
    explanation: T(`$\\mathrm{P}(x,\\ x(x-${a})^2)$ ($0<x<${a}$) 라 하면 넓이 $S(x)=\\frac12x\\cdot x(x-${a})^2=\\frac12\\{x(x-${a})\\}^2$.\n$h(x)=x(x-${a})$ 라 하면 $h$ 는 $0<x<${a}$ 에서 $x=${a / 2}$ 일 때 최솟값 $-${a * a / 4}$ 를 가지므로 $|h|$ 가 최대이다.\n최댓값은 $\\frac12\\left(${a * a / 4}\\right)^2=${ftex(ans)}$`,
      `S=1/2 (x(x-${a}))^2 maximal at x=${a / 2}: ${ftex(ans)}.`),
    verify: () => {
      let mx = 0;
      for (let i = 1; i < 100000; i += 1) { const x = (a * i) / 100000; mx = Math.max(mx, 0.5 * x * (x * (x - a) ** 2)); }
      return near(mx, nf(ans), 1e-4);
    },
  });
}

// ===== 13 속도와 가속도 ======================================================================
function kinVelAcc(random, profile) {
  const a3 = ri(random, 1, 3);
  const a2 = ri(random, -6, 3);
  const t0 = ri(random, 1, 4);
  const x = (t) => a3 * t ** 3 + a2 * t * t;
  const v = (t) => 3 * a3 * t * t + 2 * a2 * t;
  const acc = (t) => 6 * a3 * t + 2 * a2;
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-kinematics',
    prompt: T(`수직선 위를 움직이는 점 $\\mathrm{P}$ 의 시각 $t$ 에서의 좌표가 $x=${a3 === 1 ? '' : a3}t^3${a2 === 0 ? '' : `${a2 > 0 ? '+' : ''}${co(a2)}t^2`}$ 이다. $t=${t0}$ 일 때의 속도를 $p$, 가속도를 $q$ 라 할 때, $p+q$ 의 값은?`,
      `Find p+q (velocity plus acceleration at t=${t0}).`),
    answer: Fr(v(t0) + acc(t0)),
    explanation: T(`속도 $v=x'(t)=${3 * a3}t^2${2 * a2 === 0 ? '' : `${2 * a2 > 0 ? '+' : ''}${2 * a2}t`}$, 가속도 $a=v'(t)=${6 * a3}t${2 * a2 === 0 ? '' : `${2 * a2 > 0 ? '+' : ''}${2 * a2}`}$.\n$t=${t0}$ 에서 $p=${v(t0)}$, $q=${acc(t0)}$ 이므로 $p+q=${v(t0) + acc(t0)}$`,
      `v=${v(t0)}, a=${acc(t0)}.`),
    verify: () => {
      const pv = numeric.deriv(x, t0);
      const pa = numeric.deriv((t) => numeric.deriv(x, t, 1e-4), t0, 1e-3);
      return near(pv + pa, v(t0) + acc(t0), 1e-3);
    },
  });
}

function kinTurnAccel(random, profile) {
  const k = pick(random, [1, 2, 3]);
  const tt = ri(random, 1, 4);
  // x = k t^3 - 3 k tt t^2 ; v = 3k t^2 - 6 k tt t = 3k t (t - 2tt) -> turns at t=2tt ; acc = 6k t - 6 k tt -> 6k tt
  const T = (ko, en) => tx(profile, ko, en);
  const ans = 6 * k * (2 * tt) - 6 * k * tt;
  return finish(random, {
    tag: 'jc1-kinematics',
    prompt: T(`수직선 위의 원점을 출발하여 움직이는 점 $\\mathrm{P}$ 의 시각 $t$ 에서의 좌표가 $x=${k === 1 ? '' : k}t^3-${3 * k * tt}t^2$ 으로 주어질 때, 점 $\\mathrm{P}$ 의 운동 방향이 바뀌는 순간의 가속도는? (단, $t>0$)`,
      `Find the acceleration at the moment the direction of motion changes (t>0).`),
    answer: Fr(ans),
    explanation: T(`$v=x'(t)=${3 * k}t^2-${6 * k * tt}t=${3 * k}t(t-${2 * tt})$ 이므로 $t=${2 * tt}$ 에서 속도의 부호가 바뀐다.\n$a=v'(t)=${6 * k}t-${6 * k * tt}$ 이므로 $t=${2 * tt}$ 에서 가속도는 $${ans}$`,
      `Direction changes at t=${2 * tt}; a=${ans}.`),
    verify: () => {
      const x = (t) => k * t ** 3 - 3 * k * tt * t * t;
      const v = (t) => numeric.deriv(x, t, 1e-5);
      near(v(2 * tt - 0.01) * v(2 * tt + 0.01) < 0 ? 1 : 0, 1, 1e-9);
      return near(numeric.deriv((t) => numeric.deriv(x, t, 1e-4), 2 * tt, 1e-3), ans, 1e-3);
    },
  });
}

function kinMeeting(random, profile) {
  const t1 = ri(random, 1, 3);
  const t2 = t1 + ri(random, 1, 4);
  const r = ri(random, 1, 4);
  // x_P = t^2 + p t + q ; x_Q = r t ; difference = (t-t1)(t-t2) = t^2 - (t1+t2) t + t1 t2 -> p - r = -(t1+t2) ; q = t1 t2
  const p = r - (t1 + t2);
  const q = t1 * t2;
  const vP = 2 * t2 + p;
  const vQ = r;
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-kinematics',
    prompt: T(`수직선 위를 움직이는 두 점 $\\mathrm{P}, \\mathrm{Q}$ 의 시각 $t$ 에서의 좌표가 각각 $x_{\\mathrm{P}}=t^2${p === 0 ? '' : `${p > 0 ? '+' : ''}${co(p)}t`}${sgnTxt(q)},\\ x_{\\mathrm{Q}}=${co(r)}t$ 이다. 두 점이 두 번째로 만나는 순간 점 $\\mathrm{P}$ 의 속도를 $a$, 점 $\\mathrm{Q}$ 의 속도를 $b$ 라 할 때, $a+b$ 의 값은?`,
      `Find a+b at the second meeting.`),
    answer: Fr(vP + vQ),
    explanation: T(`두 점이 만나려면 $x_{\\mathrm{P}}=x_{\\mathrm{Q}}$ 이므로 $t^2${p - r === 0 ? '' : `${p - r > 0 ? '+' : ''}${p - r}t`}${sgnTxt(q)}=0$ → $(t-${t1})(t-${t2})=0$. 두 번째로 만나는 시각은 $t=${t2}$.\n$v_{\\mathrm{P}}=2t${p === 0 ? '' : `${p > 0 ? '+' : ''}${p}`}$ 이므로 $a=${vP}$, $v_{\\mathrm{Q}}=${r}$ 이므로 $b=${vQ}$.\n따라서 $a+b=${vP + vQ}$`,
      `Meet at t=${t1}, ${t2}; velocities ${vP}, ${vQ}.`),
    verify: () => {
      const xp = (t) => t * t + p * t + q;
      const xq = (t) => r * t;
      near(xp(t1), xq(t1), 1e-9); near(xp(t2), xq(t2), 1e-9);
      return near(numeric.deriv(xp, t2) + numeric.deriv(xq, t2), vP + vQ, 1e-4);
    },
  });
}

function kinBrakeDistance(random, profile) {
  const kk = pick(random, [3, 4, 5, 6]);
  const V = kk * ri(random, 2, 6);
  const ans = Fr(V * V, 2 * kk);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    positive: true,
    tag: 'jc1-kinematics',
    prompt: T(`매초 $${V}\\,\\mathrm{m}$ 의 속도로 달리던 기차가 제동을 건 지 $t$ 초 후의 위치가 $x=${V}t-${ftex(Fr(kk, 2))}t^2\\,(\\mathrm{m})$ 이다. 이 기차가 제동을 건 후 정지할 때까지 움직인 거리는 몇 $\\mathrm{m}$ 인가?`,
      `Find the distance travelled until the train stops.`),
    answer: ans,
    explanation: T(`속도 $v(t)=x'(t)=${V}-${kk}t$ 이고 $v=0$ 일 때 정지하므로 $t=${ftex(Fr(V, kk))}$.\n정지할 때까지 움직인 거리는 $x(${ftex(Fr(V, kk))})=${V}\\cdot ${ftex(Fr(V, kk))}-${ftex(Fr(kk, 2))}\\left(${ftex(Fr(V, kk))}\\right)^2=${ftex(ans)}$ ($\\mathrm{m}$)`,
      `Stops at t=${V}/${kk}; distance ${ftex(ans)}.`),
    verify: () => {
      const x = (t) => V * t - (kk / 2) * t * t;
      return near(x(V / kk), nf(ans), 1e-9);
    },
  });
}

function kinOppositeRange(random, profile) {
  const a1 = pick(random, [2, 4, 6]);
  const b1 = ri(random, 1, 4) * 2 * 1;
  const a2 = pick(random, [1, 2, 3]);
  const b2 = ri(random, 4, 14);
  // x_P = (a1/2) t^2 - b1 t/2*... keep simple: x_P = a t^2 - b t  => v_P = 2a t - b ; x_Q = c t^2 - d t => v_Q = 2c t - d
  const a = a1 / 2; const b = b1; const c = a2; const d = b2;
  // v_P>0 iff t > b/(2a) ; v_Q>0 iff t > d/(2c). opposite when t between the two roots
  const r1 = Fr(b, 2 * a); const r2 = Fr(d, 2 * c);
  if (fcmp(r1, r2) === 0) return kinOppositeRange(random, profile);
  const lo = fcmp(r1, r2) < 0 ? r1 : r2;
  const hi = fcmp(r1, r2) < 0 ? r2 : r1;
  const length = fsub(hi, lo);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    positive: true,
    tag: 'jc1-kinematics',
    prompt: T(`수직선 위를 움직이는 두 점 $\\mathrm{P}, \\mathrm{Q}$ 의 시각 $t\\ (t>0)$ 에서의 위치가 각각 $f(t)=${co(a)}t^2-${b}t,\\ g(t)=${co(c)}t^2-${d}t$ 이다. 두 점 $\\mathrm{P}, \\mathrm{Q}$ 가 서로 반대 방향으로 움직이는 시간의 길이는?`,
      `Find the length of time during which P and Q move in opposite directions.`),
    answer: length,
    explanation: T(`속도는 $f'(t)=${2 * a}t-${b},\\ g'(t)=${2 * c}t-${d}$. 부호가 서로 다르려면 $f'(t)g'(t)<0$.\n$f'(t)=0$ 에서 $t=${ftex(r1)}$, $g'(t)=0$ 에서 $t=${ftex(r2)}$ 이므로 $${ftex(lo)}<t<${ftex(hi)}$.\n따라서 구하는 시간의 길이는 $${ftex(hi)}-${ftex(lo)}=${ftex(length)}$`,
      `Opposite directions for ${ftex(lo)}<t<${ftex(hi)}: length ${ftex(length)}.`),
    verify: () => {
      const vp = (t) => 2 * a * t - b; const vq = (t) => 2 * c * t - d;
      let measure = 0;
      for (let i = 0; i < 200000; i += 1) { const t = i * 0.0001 + 0.00005; if (vp(t) * vq(t) < 0) measure += 0.0001; }
      return near(measure, nf(length), 1e-3);
    },
  });
}

function kinProjectile(random, profile) {
  const k = ri(random, 2, 6);
  const Tm = ri(random, 2, 5);
  const h0 = ri(random, 10, 50);
  const Hmax = h0 + k * Tm * Tm;
  const a = 2 * k * Tm;
  const b = -k;
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-kinematics',
    prompt: T(`지상 $${h0}\\,\\mathrm{m}$ 의 높이에서 초속 $a\\,\\mathrm{m}$ 의 속도로 수직으로 쏘아올린 물체의 $t$ 초 후의 높이를 $x\\,\\mathrm{m}$ 라 하면 $x=${h0}+at+bt^2$ 인 관계가 있다. 이 물체가 최고 높이에 도달할 때까지 걸린 시간이 $${Tm}$ 초이고, 그때의 높이는 $${Hmax}\\,\\mathrm{m}$ 라 한다. $a+b$ 의 값을 구하시오. (단, $a, b$ 는 상수이다.)`,
      `Find a+b.`),
    answer: Fr(a + b),
    explanation: T(`속도 $v=a+2bt$ 이고 $t=${Tm}$ 에서 $v=0$ 이므로 $a=${-2 * Tm}b$.\n$x(${Tm})=${h0}+${-2 * Tm}b\\cdot ${Tm}+b\\cdot ${Tm * Tm}=${h0}-${Tm * Tm}b=${Hmax}$ → $b=${b}$, $a=${a}$.\n따라서 $a+b=${a + b}$`,
      `a=${a}, b=${b}.`),
    verify: () => {
      const x = (t) => h0 + a * t + b * t * t;
      near(numeric.deriv(x, Tm), 0, 1e-3);
      near(x(Tm), Hmax, 1e-9);
      return a + b;
    },
  });
}

function kinFirstSpeed(random, profile) {
  let t1; let t2;
  do { t1 = ri(random, 1, 4); t2 = t1 + ri(random, 1, 4); } while ((t1 + t2) % 2 !== 0);
  const M = (t1 + t2) / 2;
  const V0 = ri(random, 5, 20);
  const N = V0 + 3 * t1 * t2;
  // P(t)=t^3 - 3M t^2 + N t ; v=3t^2-6Mt+N ; v=V0 at t1, t2
  const P1 = t1 ** 3 - 3 * M * t1 * t1 + N * t1;
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-kinematics',
    prompt: T(`원점을 출발하여 수직선 위를 움직이는 점 $\\mathrm{P}$ 의 시각 $t$ 에서의 위치가 $P(t)=t^3-${3 * M}t^2+${N}t$ 이다. 점 $\\mathrm{P}$ 의 속도가 처음으로 $${V0}$ 이 되는 순간 점 $\\mathrm{P}$ 의 위치는?`,
      `Find the position when the velocity first equals ${V0}.`),
    answer: Fr(P1),
    explanation: T(`$v(t)=P'(t)=3t^2-${6 * M}t+${N}$. $v(t)=${V0}$ 에서 $3t^2-${6 * M}t+${N - V0}=0$ → $t^2-${2 * M}t+${t1 * t2}=0$ → $(t-${t1})(t-${t2})=0$.\n처음으로 되는 순간은 $t=${t1}$ 이고 이때의 위치는 $P(${t1})=${P1}$`,
      `v=${V0} at t=${t1} first; P(${t1})=${P1}.`),
    verify: () => {
      const Pf = (t) => t ** 3 - 3 * M * t * t + N * t;
      near(numeric.deriv(Pf, t1), V0, 1e-3);
      return near(Pf(t1), P1, 1e-9);
    },
  });
}

// ===== 14 정적분 ============================================================================
function randPoly(random, deg, lim = 5) {
  const c = [];
  for (let i = 0; i <= deg; i += 1) c.push(ri(random, i === 0 ? 1 : -lim, lim) || 1);
  return P(...c);
}

function intBasicPoly(random, profile) {
  const deg = pick(random, [2, 3]);
  const poly = randPoly(random, deg);
  const a = ri(random, -2, 1);
  const b = a + ri(random, 1, 3);
  const val = defInt(poly, a, b);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-definite',
    prompt: T(`$\\int_{${a}}^{${b}}\\left(${polyTex(poly)}\\right)dx$ 의 값은?`, `Evaluate the definite integral.`),
    answer: val,
    explanation: T(`부정적분 $F(x)=${polyTex(pInt(poly).slice(0, -1))}$ 에 대하여 $\\int_{${a}}^{${b}}f(x)dx=F(${b})-F(${a})=${ftex(val)}$`,
      `F(${b})-F(${a})=${ftex(val)}.`),
    verify: () => {
      const f = (x) => nf(pEval(poly, x));
      return near(numeric.integral(f, a, b), nf(val), 1e-6);
    },
  });
}

function intAbsolute(random, profile) {
  const r = ri(random, 1, 4);
  const lo = -ri(random, 1, 3);
  const hi = ri(random, r, r + 3);
  const poly = pMul(P(1, 0), P(1, -r)); // x(x-r)
  const val = absInt(poly, lo, hi, [0, r]);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-definite',
    prompt: T(`$\\int_{${lo}}^{${hi}}|x^2-${r}x|\\,dx$ 의 값은?`, `Evaluate the integral of the absolute value.`),
    answer: val,
    explanation: T(`$x^2-${r}x=x(x-${r})$ 이므로 $x\\le0$ 또는 $x\\ge${r}$ 에서 $\\ge0$, $0\\le x\\le${r}$ 에서 $\\le0$ 이다.\n구간을 나누어 계산하면 $\\int_{${lo}}^{0}(x^2-${r}x)dx-\\int_0^{${r}}(x^2-${r}x)dx+\\int_{${r}}^{${hi}}(x^2-${r}x)dx=${ftex(val)}$`,
      `Split at 0 and ${r}: ${ftex(val)}.`),
    verify: () => near(numeric.integral((x) => Math.abs(x * x - r * x), lo, hi, 40000), nf(val), 1e-5),
  });
}

function intEvenOdd(random, profile) {
  const a = ri(random, 1, 4);
  const k = ri(random, 1, 5);
  const e = ri(random, -6, 6);
  const c0 = ri(random, 0, 4);
  // integral_{-a}^{a} (k x^2 + e x + c0) dx = 2(k a^3/3 + c0 a)
  const val = fmul(Fr(2), fadd(fmul(Fr(k), Fr(a ** 3, 3)), Fr(c0 * a)));
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-definite',
    prompt: T(`$\\int_{-${a}}^{${a}}\\left(${k === 1 ? '' : k}x^2${e === 0 ? '' : `${e > 0 ? '+' : ''}${co(e)}x`}${c0 === 0 ? '' : `+${c0}`}\\right)dx$ 의 값은?`,
      `Evaluate.`),
    answer: val,
    explanation: T(`홀함수 $${co(e)}x$ 는 대칭구간에서 적분값이 $0$ 이고, 짝함수는 $2\\int_0^{${a}}$ 로 계산한다.\n$2\\int_0^{${a}}(${k === 1 ? '' : k}x^2${c0 === 0 ? '' : `+${c0}`})dx=${ftex(val)}$`,
      `Odd part vanishes; ${ftex(val)}.`),
    verify: () => near(numeric.integral((x) => k * x * x + e * x + c0, -a, a), nf(val), 1e-6),
  });
}

function intSolveParam(random, profile) {
  const A = 3 * ri(random, 1, 3);
  const a = Fr(-2 * A, 3);
  if (a.d !== 1) return intSolveParam(random, profile);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-definite',
    prompt: T(`함수 $f(x)=${A}x^2+2ax$ 가 $\\int_0^1f(x)\\,dx=f(1)$ 을 만족시킬 때, 상수 $a$ 의 값은?`,
      `Find a.`),
    answer: a,
    explanation: T(`$\\int_0^1(${A}x^2+2ax)dx=${A / 3}+a$, $f(1)=${A}+2a$ 이므로 $${A / 3}+a=${A}+2a$ 에서 $a=${a.n}$`,
      `a=${a.n}.`),
    verify: () => {
      const f = (x) => A * x * x + 2 * a.n * x;
      near(numeric.integral(f, 0, 1), f(1), 1e-9);
      return a.n;
    },
  });
}

function intSymmetricPeriodic(random, profile) {
  const h = pick(random, [2, 3]);
  const I = ri(random, 2, 9);
  const m = ri(random, 1, 3);
  const n = ri(random, 1, 3);
  const ans = (m + n) * 2 * I;
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-definite',
    prompt: T(`연속함수 $f(x)$ 가 임의의 실수 $x$ 에 대하여 $f(-x)=f(x),\\ f(x+${2 * h})=f(x)$ 를 만족한다. $\\int_0^{${h}}f(x)\\,dx=${I}$ 일 때, $\\int_{-${2 * h * m}}^{${2 * h * n}}f(x)\\,dx$ 의 값은?`,
      `Evaluate the integral over several periods.`),
    answer: Fr(ans),
    explanation: T(`$f$ 는 짝함수이므로 $\\int_{-${h}}^{${h}}f(x)dx=2\\int_0^{${h}}f(x)dx=${2 * I}$ 이고, 주기가 $${2 * h}$ 이므로 길이 $${2 * h}$ 인 구간의 적분값은 모두 $${2 * I}$ 이다.\n구간 $[-${2 * h * m},\\ ${2 * h * n}]$ 의 길이는 $${2 * h * (m + n)}$ 로 $${m + n}$ 주기이므로 적분값은 $${m + n}\\times ${2 * I}=${ans}$`,
      `${m + n} periods each worth ${2 * I}.`),
    verify: () => {
      const base = (x) => 1 + 0.5 * Math.cos((Math.PI * x) / h); // even, period 2h
      const I0 = numeric.integral(base, 0, h);
      const scale = I / I0;
      const f = (x) => scale * base(x);
      return near(numeric.integral(f, -2 * h * m, 2 * h * n, 200000), ans, 1e-5);
    },
  });
}

function intSelfReferential(random, profile) {
  const p = ri(random, 1, 5);
  const kUp = 2;
  // f(x) = p x + C, C = integral_0^2 f = 2p + 2C -> C = -2p
  const m = ri(random, 2, 6);
  const C = -2 * p;
  const ans = p * m + C;
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-definite',
    prompt: T(`$f(x)=${co(p)}x+\\int_0^{${kUp}}f(t)\\,dt$ 를 만족시키는 함수 $f(x)$ 에 대하여 $f(${m})$ 의 값은?`,
      `Find f(${m}).`),
    answer: Fr(ans),
    explanation: T(`$\\int_0^{${kUp}}f(t)dt=C$ (상수) 로 놓으면 $f(x)=${co(p)}x+C$.\n$C=\\int_0^{${kUp}}(${co(p)}t+C)dt=${2 * p}+${2}C$ 이므로 $C=${C}$.\n따라서 $f(${m})=${p * m}+(${C})=${ans}$`,
      `C=${C}; f(${m})=${ans}.`),
    verify: () => {
      const f = (x) => p * x + C;
      near(numeric.integral(f, 0, kUp), C, 1e-9);
      return f(m);
    },
  });
}

function intOddDerivative(random, profile) {
  const c = ri(random, 2, 6);
  const h3 = ri(random, 1, 5);
  const V = 2 * c * h3;
  const a = ri(random, 2, 4);
  const T = (ko, en) => tx(profile, ko, en);
  void a;
  return finish(random, {
    tag: 'jc1-definite',
    prompt: T(`두 다항함수 $f(x), g(x)$ 가 모든 실수 $x$ 에 대하여 $f(-x)=-f(x),\\ g(-x)=g(x)$ 를 만족시킨다. 함수 $h(x)=f(x)g(x)$ 에 대하여 $\\int_{-3}^{3}(x+${c})h'(x)\\,dx=${V}$ 일 때, $h(3)$ 의 값은?`,
      `Find h(3).`),
    answer: Fr(h3),
    explanation: T(`$h(-x)=-h(x)$ 이므로 $h$ 는 홀함수이고 $h'$ 는 짝함수이다.\n$\\int_{-3}^{3}xh'(x)dx$ 는 (홀함수)의 적분이므로 $0$ 이다.\n$\\int_{-3}^{3}${c}h'(x)dx=${c}\\{h(3)-h(-3)\\}=${2 * c}h(3)=${V}$ 이므로 $h(3)=${h3}$`,
      `h is odd; ${2 * c}h(3)=${V}.`),
    verify: () => {
      const h = (x) => (h3 / 27) * x ** 3;
      const hp = (x) => (h3 / 9) * x * x;
      near(numeric.integral((x) => (x + c) * hp(x), -3, 3), V, 1e-6);
      near(h(3), h3, 1e-9);
      return h3;
    },
  });
}

// ===== 15 정적분의 응용 =======================================================================
function appIntDerivative(random, profile) {
  const p = ri(random, 1, 3);
  const q = ri(random, -4, 5);
  const r = ri(random, 1, 6);
  const at = ri(random, 1, 4);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-integral-fn',
    prompt: T(`함수 $f(x)=\\int_0^x(${co(p)}t^2${q === 0 ? '' : `${q > 0 ? '+' : ''}${co(q)}t`}+${r})\\,dt$ 에 대하여 $f'(${at})$ 의 값은?`,
      `Find f'(${at}).`),
    answer: Fr(p * at * at + q * at + r),
    explanation: T(`미적분의 기본정리에 의하여 $f'(x)=${co(p)}x^2${q === 0 ? '' : `${q > 0 ? '+' : ''}${co(q)}x`}+${r}$ 이므로 $f'(${at})=${p * at * at + q * at + r}$`,
      `f'(x) is the integrand: ${p * at * at + q * at + r}.`),
    verify: () => {
      const f = (x) => numeric.integral((t) => p * t * t + q * t + r, 0, x, 2000);
      return near(numeric.deriv(f, at, 1e-4), p * at * at + q * at + r, 1e-4);
    },
  });
}

function appIntFindFunction(random, profile) {
  const u = ri(random, 1, 3);
  const b = ri(random, -5, 5);
  const a0 = ri(random, 1, 3);
  // integral_a^x f = u x^3 + ... : choose G(x) = u(x^3 - a0^3) + b(x^2 - a0^2) => f = 3u x^2 + 2b x ; G(a0)=0 ; write prompt with G expanded and 'a' unknown >0
  const f = (x) => 3 * u * x * x + 2 * b * x;
  const at = ri(random, 1, 4);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-integral-fn',
    prompt: T(`다항함수 $f(x)$ 가 $\\int_a^xf(t)\\,dt=${co(u)}x^3${b === 0 ? '' : `${b > 0 ? '+' : ''}${co(b)}x^2`}${sgnTxt(-(u * a0 ** 3 + b * a0 * a0))}$ 를 만족시킬 때, 양수 $a$ 에 대하여 $f(${at})$ 의 값은?`,
      `Find f(${at}).`),
    answer: Fr(f(at)),
    explanation: T(`양변을 $x$ 에 대하여 미분하면 $f(x)=${3 * u}x^2${2 * b === 0 ? '' : `${2 * b > 0 ? '+' : ''}${2 * b}x`}$.\n따라서 $f(${at})=${f(at)}$`,
      `Differentiate both sides: f(x)=${3 * u}x^2+${2 * b}x.`),
    verify: () => {
      const G = (x) => u * x ** 3 + b * x * x - (u * a0 ** 3 + b * a0 * a0);
      near(numeric.deriv(G, at), f(at), 1e-4);
      near(G(a0), 0, 1e-9);
      return f(at);
    },
  });
}

function appRiemannSum(random, profile) {
  const p = ri(random, 1, 4);
  const q = ri(random, 1, 6);
  const s = pick(random, [1, 2, 3]);
  const kk = ri(random, 1, 3);
  // lim (1/n) sum f(1 + s k/n) with f = p x^2 + q x  -> (1/s)∫_1^{1+s} f
  const poly = P(p, q, 0);
  const val = fdiv(defInt(poly, 1, 1 + s), Fr(s));
  const T = (ko, en) => tx(profile, ko, en);
  void kk;
  return finish(random, {
    tag: 'jc1-integral-fn',
    prompt: T(`함수 $f(x)=${co(p)}x^2+${co(q)}x$ 에 대하여 $\\lim_{n\\to\\infty}\\frac{1}{n}\\sum_{k=1}^{n}f\\left(1+\\frac{${s === 1 ? '' : s}k}{n}\\right)$ 의 값은?`,
      `Evaluate the Riemann-sum limit.`),
    answer: val,
    explanation: T(`$x=1+\\frac{${s}k}{n}$ 로 놓으면 $\\frac{${s}}{n}$ 이 구간 $[1,\\ ${1 + s}]$ 의 분할 간격이므로 $\\lim\\frac1n\\sum f=\\frac{1}{${s}}\\int_1^{${1 + s}}f(x)dx$.\n$\\frac{1}{${s}}\\left[\\frac{${p}}{3}x^3+\\frac{${q}}{2}x^2\\right]_1^{${1 + s}}=${ftex(val)}$`,
      `(1/${s}) * integral from 1 to ${1 + s} = ${ftex(val)}.`),
    verify: () => {
      const f = (x) => p * x * x + q * x;
      const n = 200000; let sum = 0;
      for (let k = 1; k <= n; k += 1) sum += f(1 + (s * k) / n);
      return near(sum / n, nf(val), 1e-4);
    },
  });
}

function appRiemannSumPower(random, profile) {
  const e = pick(random, [2, 3]);
  const c = pick(random, [1, 2]);
  // lim sum_{k=1}^n (k^e / n^{e+1}) * c   = c/(e+1)
  const val = Fr(c, e + 1);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-integral-fn',
    prompt: T(`$\\lim_{n\\to\\infty}\\sum_{k=1}^{n}\\frac{${c === 1 ? '' : c}k^${e}}{n^${e + 1}}$ 의 값은?`, `Evaluate the limit of the sum.`),
    answer: val,
    explanation: T(`$\\sum_{k=1}^{n}${c === 1 ? '' : c}\\left(\\frac{k}{n}\\right)^${e}\\cdot\\frac1n$ 이므로 구하는 극한은 $${c === 1 ? '' : c}\\int_0^1x^${e}dx=${ftex(val)}$`,
      `Riemann sum of ${c}x^${e} on [0,1]: ${ftex(val)}.`),
    verify: () => {
      const n = 300000; let sum = 0;
      for (let k = 1; k <= n; k += 1) sum += (c * (k / n) ** e) / n;
      return near(sum, nf(val), 1e-4);
    },
  });
}

function appIntegralEquationLinear(random, profile) {
  const pp = ri(random, 1, 4);
  const qq = ri(random, 1, 4);
  // f(x) = p x^2 + q x A + B where A = int_0^1 f, B = int_0^1 t f ; solve exactly.
  // A = p/3 + qA/2 + B ; B = p/4 + qA/3 + B/2  -> (B/2) = p/4 + qA/3 -> B = p/2 + 2qA/3
  // A = p/3 + qA/2 + p/2 + 2qA/3 = 5p/6 + (7q/6) A  -> A (1 - 7q/6) = 5p/6 -> A = 5p/(6 - 7q)
  const A = fdiv(Fr(5 * pp), Fr(6 - 7 * qq));
  const B = fadd(Fr(pp, 2), fmul(Fr(2 * qq, 3), A));
  const at = ri(random, 1, 3);
  const val = fadd(fadd(Fr(pp * at * at), fmul(fmul(Fr(qq), A), Fr(at))), B);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-integral-fn',
    prompt: T(`이차함수 $f(x)=${co(pp)}x^2+${co(qq)}x\\int_0^1f(t)\\,dt+\\int_0^1tf(t)\\,dt$ 일 때, $f(${at})$ 의 값은?`,
      `Find f(${at}).`),
    answer: val,
    explanation: T(`$\\int_0^1f(t)dt=A,\\ \\int_0^1tf(t)dt=B$ 로 놓으면 $f(x)=${co(pp)}x^2+${co(qq)}Ax+B$.\n$A=\\int_0^1f=\\frac{${pp}}{3}+\\frac{${qq}A}{2}+B$, $B=\\int_0^1tf=\\frac{${pp}}{4}+\\frac{${qq}A}{3}+\\frac{B}{2}$ 를 연립하여 풀면 $A=${ftex(A)}$, $B=${ftex(B)}$.\n따라서 $f(${at})=${ftex(val)}$`,
      `Solve for A and B; f(${at})=${ftex(val)}.`),
    verify: () => {
      const a = nf(A); const b = nf(B);
      const f = (x) => pp * x * x + qq * a * x + b;
      near(numeric.integral(f, 0, 1), a, 1e-6);
      near(numeric.integral((x) => x * f(x), 0, 1), b, 1e-6);
      return near(f(at), nf(val), 1e-6);
    },
    allowShort: false,
  });
}

function appIntExtremum(random, profile) {
  const m = ri(random, 1, 4);
  // f(x)=∫_0^x (t^2 - m^2) dt = x^3/3 - m^2 x ; local min at x=m : m^3/3 - m^3 = -2m^3/3
  const val = Fr(-2 * m ** 3, 3);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-integral-fn',
    prompt: T(`함수 $f(x)=\\int_0^x(t^2-${m * m})\\,dt$ 의 극솟값은?`, `Find the local minimum value.`),
    answer: val,
    explanation: T(`$f'(x)=x^2-${m * m}=(x+${m})(x-${m})$ 이므로 $x=-${m}$ 에서 극대, $x=${m}$ 에서 극소이다.\n$f(x)=\\frac{x^3}{3}-${m * m}x$ 이므로 극솟값은 $f(${m})=${ftex(val)}$`,
      `Local min at x=${m}: ${ftex(val)}.`),
    verify: () => {
      const f = (x) => numeric.integral((t) => t * t - m * m, 0, x, 2000);
      near(numeric.deriv(f, m, 1e-4), 0, 1e-3);
      return near(f(m), nf(val), 1e-5);
    },
  });
}

// ===== 16 넓이 ==============================================================================
function areaCubicXAxis(random, profile) {
  const r = [ri(random, -3, 0)];
  r.push(r[0] + ri(random, 1, 3));
  r.push(r[1] + ri(random, 1, 3));
  const lead = pick(random, [1, -1]);
  const poly = pMul(pMul(P(lead, -lead * r[0]), P(1, -r[1])), P(1, -r[2]));
  const poly3 = pMul(pMul(P(1, -r[0]), P(1, -r[1])), P(1, -r[2])).map((c) => fmul(c, F(lead)));
  const val = absInt(poly3, r[0], r[2], [r[1]]);
  const T = (ko, en) => tx(profile, ko, en);
  void poly;
  return finish(random, {
    tag: 'jc1-area',
    prompt: T(`곡선 $y=${lead === -1 ? '-' : ''}(x${r[0] === 0 ? '' : sgnTxt(-r[0])})(x${r[1] === 0 ? '' : sgnTxt(-r[1])})(x${r[2] === 0 ? '' : sgnTxt(-r[2])})$ 와 $x$축으로 둘러싸인 두 부분의 넓이의 합은?`,
      `Find the total area between the curve and the x-axis.`),
    answer: val,
    explanation: T(`곡선이 $x$축과 만나는 점은 $x=${r[0]},\\ ${r[1]},\\ ${r[2]}$ 이므로 구간 $[${r[0]},\\ ${r[1]}]$ 과 $[${r[1]},\\ ${r[2]}]$ 로 나누어 각각 $\\left|\\int f(x)dx\\right|$ 를 구한다.\n두 부분의 넓이의 합은 $${ftex(val)}$`,
      `Split at the roots: ${ftex(val)}.`),
    verify: () => {
      const f = (x) => lead * (x - r[0]) * (x - r[1]) * (x - r[2]);
      return near(numeric.integral((x) => Math.abs(f(x)), r[0], r[2], 40000), nf(val), 1e-5);
    },
  });
}

function areaParabolaLine(random, profile) {
  const al = ri(random, -3, 2);
  const be = al + ri(random, 2, 6);
  const A = pick(random, [1, 2, 3]);
  // y = A x^2 and line through (al, A al^2), (be, A be^2): area = A (be-al)^3 / 6
  const m = A * (al + be);
  const n = -A * al * be;
  const val = Fr(A * (be - al) ** 3, 6);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-area',
    prompt: T(`포물선 $y=${co(A)}x^2$ 과 직선 $y=${m === 0 ? '' : `${co(m)}x`}${n === 0 ? '' : sgnTxt(n)}$ 로 둘러싸인 도형의 넓이는?`,
      `Find the area enclosed by the parabola and the line.`),
    answer: val,
    explanation: T(`$${co(A)}x^2=${m === 0 ? '' : `${co(m)}x`}${n === 0 ? '' : sgnTxt(n)}$ 에서 $x=${al},\\ ${be}$ 이므로 넓이는 $\\int_{${al}}^{${be}}\\{(${m === 0 ? '' : `${co(m)}x`}${n === 0 ? '' : sgnTxt(n)})-${co(A)}x^2\\}dx=\\frac{${A}(${be}-${num(al)})^3}{6}=${ftex(val)}$`,
      `Area = A(β-α)^3/6 = ${ftex(val)}.`),
    verify: () => near(numeric.integral((x) => Math.abs(m * x + n - A * x * x), al, be), nf(val), 1e-5),
  });
}

function areaTangentParabola(random, profile) {
  const k = pick(random, [1, 2, 3]);
  const t = ri(random, 1, 4);
  const val = Fr(k * t ** 3, 3);
  const T = (ko, en) => tx(profile, ko, en);
  const ans30 = fmul(val, Fr(30));
  if (ans30.d !== 1) return areaTangentParabola(random, profile);
  return finish(random, {
    tag: 'jc1-area',
    prompt: T(`곡선 $y=${co(k)}x^2+1$ 과 이 곡선 위의 점 $(${t},\\ ${k * t * t + 1})$ 에서의 접선 및 $y$축으로 둘러싸인 도형의 넓이를 $S$ 라 할 때, $30S$ 의 값을 구하시오.`,
      `Find 30S.`),
    answer: ans30,
    explanation: T(`$y'=${2 * k}x$ 이므로 접선은 $y-${k * t * t + 1}=${2 * k * t}(x-${t})$, 즉 $y=${2 * k * t}x-${k * t * t - 1}$.\n$S=\\int_0^{${t}}\\{(${co(k)}x^2+1)-(${2 * k * t}x-${k * t * t - 1})\\}dx=\\int_0^{${t}}${co(k)}(x-${t})^2dx=${ftex(val)}$.\n따라서 $30S=${ans30.n}$`,
      `S=${ftex(val)}; 30S=${ans30.n}.`),
    verify: () => {
      const f = (x) => k * x * x + 1;
      const line = (x) => f(t) + 2 * k * t * (x - t);
      return near(30 * numeric.integral((x) => f(x) - line(x), 0, t), ans30.n, 1e-6);
    },
  });
}

function areaEqualRegions(random, profile) {
  const c = ri(random, 2, 4);
  const m = 2 * c;
  const T = (ko, en) => tx(profile, ko, en);
  // curve y = x^3 - (c+m) x^2 + (cm + m) x ... choose curve y=x(x-c)(x-m)+ m x, line y = m x ; difference roots 0,c,m
  // We keep the AMC-style statement: curve y=x^3-(c+m')x^2+... with unknown m'
  // Prompt uses unknown parameter: curve y = x^3 - (c+k) x^2 + (c k + k) x, line y = k x ; difference = x(x-c)(x-k); equal areas -> k = 2c
  return finish(random, {
    tag: 'jc1-area',
    prompt: T(`곡선 $y=x^3-(${c}+k)x^2+${c}kx+kx$ 와 직선 $y=kx$ 로 둘러싸인 두 부분의 넓이가 서로 같을 때, 상수 $k$ 의 값은? (단, $k>${c}$)`,
      `The two regions have equal areas; find k (k>${c}).`),
    answer: Fr(m),
    explanation: T(`곡선과 직선의 차는 $x^3-(${c}+k)x^2+${c}kx=x(x-${c})(x-k)$ 이므로 교점의 $x$좌표는 $0,\\ ${c},\\ k$.\n두 부분의 넓이가 같으려면 $\\int_0^{k}x(x-${c})(x-k)dx=0$. 계산하면 $k^3\\left(-\\frac{k}{12}+\\frac{${c}}{6}\\right)=0$ 이므로 $k=${2 * c}$`,
      `∫_0^k x(x-${c})(x-k)dx=0 gives k=${m}.`),
    verify: () => {
      const g = (x) => x * (x - c) * (x - m);
      near(numeric.integral(g, 0, m), 0, 1e-6);
      return m;
    },
  });
}

function areaInverseFunction(random, profile) {
  const tt = ri(random, 2, 8);
  const S = Fr(tt, 3);
  if (S.d !== 1) return areaInverseFunction(random, profile);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-area',
    prompt: T(`함수 $f(x)=ax^2\\ (x\\ge0)$ 과 그 역함수 $g(x)$ 의 그래프로 둘러싸인 부분의 넓이가 $${S.n}$ 일 때, $\\frac{1}{a^2}$ 의 값을 구하시오. (단, $a>0$ 인 상수)`,
      `Find 1/a^2.`),
    answer: Fr(tt),
    explanation: T(`두 그래프는 직선 $y=x$ 에 대하여 대칭이고 $x=0,\\ x=\\frac{1}{a}$ 에서 만난다.\n넓이 $=\\int_0^{1/a}\\left(\\sqrt{\\frac{x}{a}}-ax^2\\right)dx=\\frac{2}{3a^2}-\\frac{1}{3a^2}=\\frac{1}{3a^2}$.\n$\\frac{1}{3a^2}=${S.n}$ 이므로 $\\frac1{a^2}=${tt}$`,
      `Area = 1/(3a^2) = ${S.n}.`),
    verify: () => {
      const a = 1 / Math.sqrt(tt);
      near(numeric.integral((x) => Math.sqrt(x / a) - a * x * x, 0, 1 / a, 20000), S.n, 1e-4);
      return tt;
    },
  });
}

function areaTwoCubicEqual(random, profile) {
  const w = ri(random, 1, 4);
  // f(x)=x^3-3 w^2 x on [-2w..]. area between f and x-axis on [0, 2w]? pick y = x(x^2 - w^2)... compute area of region bounded by y=x^3-w^2 x and x axis in [-w,w]
  const poly = P(1, 0, -w * w, 0);
  const val = absInt(poly, -w, w, [0]);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-area',
    prompt: T(`곡선 $y=x^3-${w * w}x$ 와 $x$축으로 둘러싸인 두 부분의 넓이의 합은?`, `Find the total enclosed area.`),
    answer: val,
    explanation: T(`$x^3-${w * w}x=x(x+${w})(x-${w})$ 이므로 곡선은 $x=-${w},\\ 0,\\ ${w}$ 에서 $x$축과 만나고 원점에 대칭이다.\n구하는 넓이는 $2\\int_{-${w}}^{0}(x^3-${w * w}x)dx=${ftex(val)}$`,
      `Symmetric about the origin: ${ftex(val)}.`),
    verify: () => near(numeric.integral((x) => Math.abs(x ** 3 - w * w * x), -w, w, 40000), nf(val), 1e-5),
  });
}

// ===== 17 속도와 거리 ========================================================================
function distPositionFromVelocity(random, profile) {
  const a = ri(random, 1, 4);
  const b = ri(random, -6, 6);
  const c = ri(random, 1, 8);
  const t0 = ri(random, 2, 5);
  const v = P(a, b, c);
  const pos = defInt(v, 0, t0);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-motion-dist',
    prompt: T(`원점을 출발하여 수직선 위를 움직이는 점 $\\mathrm{P}$ 의 시각 $t$ 에서의 속도가 $v(t)=${polyTex(v)}$ 일 때, $t=${t0}$ 에서의 점 $\\mathrm{P}$ 의 위치는?`,
      `Find the position of P at t=${t0}.`),
    answer: pos,
    explanation: T(`출발점이 원점이므로 위치는 $x(${t0})=\\int_0^{${t0}}v(t)dt=\\int_0^{${t0}}(${polyTex(v)})dt=${ftex(pos)}$`,
      `Position = integral of velocity = ${ftex(pos)}.`),
    verify: () => near(numeric.integral((t) => nf(pEval(v, t)), 0, t0), nf(pos), 1e-6),
  });
}

function distTravelled(random, profile) {
  // v = -2k(t - r) etc : v(t) = (t - r1)(t - r2)*s ; distance on [0, T]
  const r1 = ri(random, 1, 3);
  const r2 = r1 + ri(random, 1, 3);
  const s = pick(random, [1, 2, 3]);
  const hiT = r2 + ri(random, 0, 2);
  const v = pMul(P(s, -s * r1), P(1, -r2));
  const val = absInt(v, 0, hiT, [r1, r2]);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-motion-dist',
    prompt: T(`수직선 위를 움직이는 점 $\\mathrm{P}$ 의 시각 $t\\ (t\\ge0)$ 에서의 속도가 $v(t)=${co(s)}(t-${r1})(t-${r2})$ 이다. $t=0$ 에서 $t=${hiT}$ 까지 점 $\\mathrm{P}$ 가 움직인 거리는?`,
      `Find the distance travelled from t=0 to t=${hiT}.`),
    answer: val,
    explanation: T(`$v(t)=0$ 에서 $t=${r1},\\ ${r2}$ 이므로 이 시각에서 운동 방향이 바뀐다. 움직인 거리는 $\\int_0^{${hiT}}|v(t)|dt$ 이므로 구간을 나누어 계산하면 $${ftex(val)}$`,
      `Split at the zeros ${r1}, ${r2}: ${ftex(val)}.`),
    verify: () => near(numeric.integral((t) => Math.abs(s * (t - r1) * (t - r2)), 0, hiT, 40000), nf(val), 1e-5),
  });
}

function distMeetingPosition(random, profile) {
  const a = ri(random, 1, 3);
  const b = a + ri(random, 1, 4);
  // vP - vQ = 3t^2 - 2(a+b)t + ab ; integral = t(t-a)(t-b)
  const vQ = P(3, ri(random, 2, 12), ri(random, 1, 5));
  const diff = P(3, -2 * (a + b), a * b);
  const vP = vQ.map((c, i) => fadd(c, diff[i]));
  const pos = defInt(vQ, 0, a);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-motion-dist',
    prompt: T(`원점을 동시에 출발하여 수직선 위를 움직이는 두 점 $\\mathrm{P}, \\mathrm{Q}$ 의 $t$ 초 후의 속도가 각각 $v_{\\mathrm{P}}(t)=${polyTex(vP)},\\ v_{\\mathrm{Q}}(t)=${polyTex(vQ)}$ 일 때, 두 점이 출발 후 처음으로 만나는 위치를 구하시오.`,
      `Find the position where P and Q first meet.`),
    answer: pos,
    explanation: T(`두 점의 위치의 차는 $\\int_0^t\\{v_{\\mathrm{P}}-v_{\\mathrm{Q}}\\}dt=\\int_0^t(${polyTex(diff)})dt=t(t-${a})(t-${b})$ 이므로 처음 만나는 시각은 $t=${a}$.\n이때의 위치는 $\\int_0^{${a}}v_{\\mathrm{Q}}(t)dt=${ftex(pos)}$`,
      `Position difference is t(t-${a})(t-${b}); first meeting at t=${a}: ${ftex(pos)}.`),
    verify: () => {
      const dP = (t) => nf(pEval(vP, t)); const dQ = (t) => nf(pEval(vQ, t));
      near(numeric.integral((t) => dP(t) - dQ(t), 0, a), 0, 1e-6);
      return near(numeric.integral(dQ, 0, a), nf(pos), 1e-6);
    },
  });
}

function distBrake(random, profile) {
  const kk = pick(random, [2, 3, 4, 6]);
  const Tm = ri(random, 2, 6);
  const V = kk * Tm;
  const dist = Fr(V * Tm, 2);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-motion-dist',
    prompt: T(`매초 $${V}\\,\\mathrm{m}$ 의 속도로 달리던 자동차가 제동을 건 지 $t$ 초 후의 속도 $v(t)$ 는 $v(t)=${V}-${kk}t\\,(\\mathrm{m/초})$ 이다. 이 자동차가 제동을 건 후 멈추어 설 때까지 움직인 거리는 몇 $\\mathrm{m}$ 인가?`,
      `Find the braking distance.`),
    answer: dist,
    explanation: T(`$v(t)=0$ 에서 $t=${Tm}$ 이므로 정지할 때까지 움직인 거리는 $\\int_0^{${Tm}}(${V}-${kk}t)dt=${ftex(dist)}$ ($\\mathrm{m}$)`,
      `∫_0^${Tm} v dt = ${ftex(dist)}.`),
    verify: () => near(numeric.integral((t) => V - kk * t, 0, Tm), nf(dist), 1e-9),
  });
}

function distBallThrown(random, profile) {
  const V = pick(random, [20, 30, 40]);
  const g = 10;
  const t1 = ri(random, 1, 2);
  const t2 = ri(random, V / g + 1, V / g + 2);
  // v = V - 10 t ; distance from t1 to t2 : up to V/g then down
  const peak = V / g;
  const up = (V * peak - 5 * peak * peak) - (V * t1 - 5 * t1 * t1);
  const down = Math.abs((V * t2 - 5 * t2 * t2) - (V * peak - 5 * peak * peak));
  const total = Fr(up + down);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-motion-dist',
    prompt: T(`지상 $10\\,\\mathrm{m}$ 의 높이에서 $${V}\\,\\mathrm{m/초}$ 의 속도로 똑바로 위로 쏘아 올린 공의 $t$ 초 후의 속도는 $v(t)=${V}-10t\\,(\\mathrm{m/초})$ 라고 한다. 공을 쏘아 올린 지 $${t1}$ 초 후부터 $${t2}$ 초 후까지 움직인 거리는 몇 $\\mathrm{m}$ 인가?`,
      `Find the distance travelled between t=${t1} and t=${t2}.`),
    answer: total,
    explanation: T(`$v(t)=0$ 에서 $t=${peak}$ 이므로 $t=${peak}$ 에서 운동 방향이 바뀐다.\n움직인 거리 $=\\int_{${t1}}^{${t2}}|v(t)|dt=\\int_{${t1}}^{${peak}}(${V}-10t)dt+\\int_{${peak}}^{${t2}}(10t-${V})dt=${up}+${down}=${total.n}$ ($\\mathrm{m}$)`,
      `Split at t=${peak}: ${up}+${down}.`),
    verify: () => near(numeric.integral((t) => Math.abs(V - 10 * t), t1, t2, 40000), total.n, 1e-5),
  });
}

function distTrapezoid(random, profile) {
  const vmax = pick(random, [24, 36, 48, 60]);
  const ramps = [4, 6, 8, 12].filter((d) => vmax % d === 0);
  const r1 = pick(random, ramps);
  const r3 = pick(random, ramps);
  const hold = ri(random, 2, 8) * 5;
  const t1 = r1; const t2 = t1 + hold; const t3 = t2 + r3;
  const dist = Fr((vmax * (r1 + r3)) / 2 + vmax * hold);
  const s1 = vmax / r1; const s3 = vmax / r3;
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-motion-dist',
    prompt: T(`어느 놀이공원에서 $${t3}$ 초 동안 운행하는 열차의 운행속도 $v(t)\\,(\\mathrm{m/초})$ 가 $v(t)=\\begin{cases}${s1}t & (0\\le t<${t1})\\\\ ${vmax} & (${t1}\\le t<${t2})\\\\ ${s3}(${t3}-t) & (${t2}\\le t\\le${t3})\\end{cases}$ 일 때, 이 열차가 출발 후 정지할 때까지 운행한 거리는 몇 $\\mathrm{m}$ 인가?`,
      `Find the total distance.`),
    answer: dist,
    explanation: T(`속도 그래프와 $t$축으로 둘러싸인 도형(사다리꼴)의 넓이가 운행한 거리이다.\n$\\frac12\\{${t3}+${hold}\\}\\times ${vmax}=${dist.n}$ ($\\mathrm{m}$)`,
      `Trapezoid area ${dist.n}.`),
    verify: () => {
      const v = (t) => (t < t1 ? s1 * t : t < t2 ? vmax : s3 * (t3 - t));
      return near(numeric.integral(v, 0, t3, 100000), dist.n, 1e-4);
    },
  });
}

export const CALCULUS_ENGINES = {
  'jc1-extrema': [extremaFindCoefficients, extremaIncreasingRange, extremaProductOfExtrema, extremaDecreasingInterval, extremaDerivativeGraphLine],
  'jc1-applications': [appMaxMinInterval, appDistinctRoots, appLineIntersections, appInequalityMinimum, appTriangleArea],
  'jc1-kinematics': [kinVelAcc, kinTurnAccel, kinMeeting, kinBrakeDistance, kinOppositeRange, kinProjectile, kinFirstSpeed],
  'jc1-definite': [intBasicPoly, intAbsolute, intEvenOdd, intSolveParam, intSymmetricPeriodic, intSelfReferential, intOddDerivative],
  'jc1-integral-fn': [appIntDerivative, appIntFindFunction, appRiemannSum, appRiemannSumPower, appIntegralEquationLinear, appIntExtremum],
  'jc1-area': [areaCubicXAxis, areaParabolaLine, areaTangentParabola, areaEqualRegions, areaInverseFunction, areaTwoCubicEqual],
  'jc1-motion-dist': [distPositionFromVelocity, distTravelled, distMeetingPosition, distBrake, distBallThrown, distTrapezoid],
};

void gcd;
