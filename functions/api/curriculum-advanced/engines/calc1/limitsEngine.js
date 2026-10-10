// Calculus I applied problems, types 06-10: one-sided limits, undetermined coefficients, continuity,
// derivative coefficient / differentiability, tangent lines (수학Ⅱ). Built backward from chosen
// integer parameters; every generator ships an independent numeric `verify`.
import {
  ri, pick, tx, Fr, fadd, fsub, fmul, fdiv, fnum, ftex, fneg, finish, shuffle,
  P, pEval, pDer, pMul, polyTex, numeric,
} from './common.js';

const near = (got, want, tol = 1e-4) => {
  if (!(Math.abs(got - want) <= tol * Math.max(1, Math.abs(want)))) throw new Error(`numeric mismatch: got ${got}, want ${want}`);
  return want;
};
const co = (v) => (v === 1 ? '' : v === -1 ? '-' : String(v));
const lin = (p, q) => { // "px+q" text
  const a = p === 0 ? '' : `${co(p)}x`;
  const b = q === 0 ? '' : `${q > 0 && a ? '+' : ''}${q}`;
  return a + b || '0';
};
const quad = (p, q, r) => { // px^2+qx+r
  const a = p === 0 ? '' : `${co(p)}x^2`;
  const b = q === 0 ? '' : `${q > 0 && a ? '+' : ''}${co(q)}x`;
  const c = r === 0 ? '' : `${r > 0 && (a || b) ? '+' : ''}${r}`;
  return a + b + c || '0';
};
const num = (n) => (n < 0 ? `(${n})` : String(n));

// ===== 06 좌극한과 우극한 ===================================================================
function oneSidedPiecewise(random, profile) {
  const c = ri(random, -2, 3);
  const p1 = pick(random, [-1, 1, 2]);
  const q1 = ri(random, -4, 4);
  const p2 = pick(random, [-2, -1, 1, 2]);
  const q2 = ri(random, -5, 5);
  // f(x) = p1 x^2 + q1 x  (x >= c);  p2 x + q2  (x < c)
  const right = p1 * c * c + q1 * c;
  const left = p2 * c + q2;
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-one-sided',
    prompt: T(`함수 $f(x)=\\begin{cases}${quad(p1, q1, 0)} & (x\\ge${c})\\\\ ${lin(p2, q2)} & (x<${c})\\end{cases}$ 에 대하여 $\\lim_{x\\to${c}+}f(x)+\\lim_{x\\to${c}-}f(x)$ 의 값은?`,
      `For $f(x)$ piecewise defined as above, find $\\lim_{x\\to${c}+}f(x)+\\lim_{x\\to${c}-}f(x)$.`),
    answer: Fr(right + left),
    explanation: T(`우극한은 $x\\ge${c}$ 일 때의 식에 $x=${c}$ 를 대입하여 $\\lim_{x\\to${c}+}f(x)=${right}$, 좌극한은 $x<${c}$ 일 때의 식에서 $\\lim_{x\\to${c}-}f(x)=${left}$ 이다.\n따라서 합은 $${right}+(${left})=${right + left}$`,
      `Right limit ${right}, left limit ${left}; sum ${right + left}.`),
    verify: () => {
      const f = (x) => (x >= c ? p1 * x * x + q1 * x : p2 * x + q2);
      return near(f(c + 1e-9) + f(c - 1e-9), right + left, 1e-6);
    },
  });
}

function oneSidedAbs(random, profile) {
  const a = ri(random, -3, 3);
  const k = ri(random, 1, 5);
  const m = ri(random, 1, 3);
  // f(x) = m(x-a)(x+k)/|x-a|  -> right: m(a+k), left: -m(a+k)
  const R = m * (a + k);
  const T = (ko, en) => tx(profile, ko, en);
  const ans = fsub(Fr(R), Fr(-R));
  return finish(random, {
    tag: 'jc1-one-sided',
    prompt: T(`함수 $f(x)=\\frac{${co(m)}(x${a === 0 ? '' : a > 0 ? `-${a}` : `+${-a}`})(x+${k})}{|x${a === 0 ? '' : a > 0 ? `-${a}` : `+${-a}`}|}$ 에 대하여 $\\lim_{x\\to${a}+}f(x)-\\lim_{x\\to${a}-}f(x)$ 의 값은?`,
      `Evaluate $\\lim_{x\\to${a}+}f(x)-\\lim_{x\\to${a}-}f(x)$.`),
    answer: ans,
    explanation: T(`$x>${a}$ 이면 $|x-${a}|=x-${a}$ 이므로 $f(x)=${co(m)}(x+${k})$ → 우극한 $${R}$.\n$x<${a}$ 이면 $|x-${a}|=-(x-${a})$ 이므로 $f(x)=-${co(m)}(x+${k})$ → 좌극한 $${-R}$.\n따라서 $${R}-(${-R})=${2 * R}$`,
      `Right limit ${R}, left limit ${-R}, difference ${2 * R}.`),
    verify: () => {
      const f = (x) => (m * (x - a) * (x + k)) / Math.abs(x - a);
      return near(f(a + 1e-7) - f(a - 1e-7), 2 * R, 1e-5);
    },
  });
}

function oneSidedFloor(random, profile) {
  const n = pick(random, [2, 3, 4]);
  const k = ri(random, -3, 4);
  const T = (ko, en) => tx(profile, ko, en);
  // f(x)=[nx]; left at k: nk-1, right nk
  const sum = 2 * n * k - 1;
  return finish(random, {
    tag: 'jc1-one-sided',
    prompt: T(`실수 $x$ 에 대하여 $[x]$ 는 $x$ 보다 크지 않은 최대의 정수이다. 함수 $f(x)=[${n}x]$ 에 대하여 $\\lim_{x\\to${k}-}f(x)+\\lim_{x\\to${k}+}f(x)$ 의 값은?`,
      `With $[x]$ the greatest integer, find $\\lim_{x\\to${k}-}[${n}x]+\\lim_{x\\to${k}+}[${n}x]$.`),
    answer: Fr(sum),
    explanation: T(`$x\\to${k}-$ 이면 $${n}x$ 는 $${n * k}$ 보다 작으면서 가까워지므로 $[${n}x]=${n * k - 1}$.\n$x\\to${k}+$ 이면 $[${n}x]=${n * k}$.\n따라서 합은 $${n * k - 1}+${num(n * k)}=${sum}$`,
      `Left ${n * k - 1}, right ${n * k}; sum ${sum}.`),
    verify: () => near(Math.floor(n * (k - 1e-9)) + Math.floor(n * (k + 1e-9)), sum, 1e-9),
  });
}

function limitExistsConstant(random, profile) {
  const c = ri(random, 1, 4);
  const p = pick(random, [1, 2, 3]);
  const q = ri(random, -3, 3);
  const a = ri(random, -4, 5);
  // f(x)= x^2 + a x (x<c), -x+b (x>=c)... use: left x^2 + a x ; right p x + b ; limit exists -> c^2+ac = pc+b
  const b = c * c + a * c - p * c;
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-one-sided',
    prompt: T(`함수 $f(x)=\\begin{cases}x^2${a >= 0 ? '+' : ''}${a === 0 ? '' : `${co(a)}x`} & (x<${c})\\\\ ${co(p)}x${b >= 0 ? '+' : ''}${b} & (x\\ge${c})\\end{cases}$ 에 대하여 $\\lim_{x\\to${c}}f(x)$ 가 존재할 때, 극한값을 구하시오.`,
      `$\\lim_{x\\to${c}}f(x)$ exists. Find its value.`),
    answer: Fr(c * c + a * c),
    explanation: T(`극한이 존재하려면 좌극한과 우극한이 같아야 한다.\n좌극한 $=${c * c}+${num(a * c)}=${c * c + a * c}$, 우극한 $=${p * c}+${num(b)}=${p * c + b}$ 으로 같다.\n따라서 극한값은 $${c * c + a * c}$`,
      `Both one-sided limits equal ${c * c + a * c}.`),
    verify: () => {
      const f = (x) => (x < c ? x * x + a * x : p * x + b);
      near(f(c - 1e-9), f(c + 1e-9), 1e-6);
      return f(c + 1e-9);
    },
  });
}

// ===== 07 미정계수 구하기 ====================================================================
function coeffFactorQuadratic(random, profile) {
  const c = ri(random, -3, 4);
  const m = ri(random, -4, 5);
  const a = m - c;
  const b = -c * m;
  const L = c + m;
  const T = (ko, en) => tx(profile, ko, en);
  const ask = pick(random, ['sum', 'prod']);
  const ans = ask === 'sum' ? a + b : a * b;
  return finish(random, {
    tag: 'jc1-coeff',
    prompt: T(`두 상수 $a, b$ 에 대하여 $\\lim_{x\\to${c}}\\frac{x^2+ax+b}{x${c === 0 ? '' : c > 0 ? `-${c}` : `+${-c}`}}=${L}$ 일 때, $${ask === 'sum' ? 'a+b' : 'ab'}$ 의 값은?`,
      `For constants $a,b$ with $\\lim_{x\\to${c}}\\frac{x^2+ax+b}{x-${c}}=${L}$, find $${ask === 'sum' ? 'a+b' : 'ab'}$.`),
    answer: Fr(ans),
    explanation: T(`$x\\to${c}$ 일 때 분모 $\\to0$ 이고 극한값이 존재하므로 분자 $\\to0$ 이어야 한다. 즉 $${c * c}+${num(a * c)}+b=0$ 에서 $b=${b}$.\n이때 분자 $=(x-${num(c)})(x+${num(m)})$ 이므로 극한값은 $${c}+${num(m)}=${L}$ 이고 $a=${a}$.\n따라서 $${ask === 'sum' ? 'a+b' : 'ab'}=${ans}$`,
      `Numerator must vanish: b=${b}; factoring gives a=${a}.`),
    verify: () => {
      const f = (x) => (x * x + a * x + b) / (x - c);
      near(f(c + 1e-6), L, 1e-4);
      return ans;
    },
  });
}

function coeffRadical(random, profile) {
  const t = ri(random, 1, 4);
  const c = ri(random, -3, 5);
  const a = t * t - c; // sqrt(x+a) -> t at x=c
  const bVal = Fr(1, 2 * t);
  const T = (ko, en) => tx(profile, ko, en);
  const ans = fadd(fmul(Fr(10), Fr(a)), fmul(Fr(4), bVal));
  return finish(random, {
    tag: 'jc1-coeff',
    prompt: T(`두 상수 $a, b$ 에 대하여 $\\lim_{x\\to${c}}\\frac{\\sqrt{x+a}-${t}}{x${c === 0 ? '' : c > 0 ? `-${c}` : `+${-c}`}}=b$ 일 때, $10a+4b$ 의 값을 구하시오.`,
      `Find $10a+4b$ given $\\lim_{x\\to${c}}\\frac{\\sqrt{x+a}-${t}}{x-${c}}=b$.`),
    answer: ans,
    explanation: T(`분모 $\\to0$ 이므로 분자도 $0$: $\\sqrt{${c}+a}=${t}$ 에서 $a=${a}$.\n분자를 유리화하면 $\\frac{(x+a)-${t * t}}{(x-${num(c)})(\\sqrt{x+a}+${t})}=\\frac{1}{\\sqrt{x+a}+${t}}\\to\\frac{1}{${2 * t}}$ 이므로 $b=${ftex(bVal)}$.\n따라서 $10a+4b=${10 * a}+${ftex(fmul(Fr(4), bVal))}=${ftex(ans)}$`,
      `a=${a}, b=1/${2 * t}.`),
    verify: () => {
      const f = (x) => (Math.sqrt(x + a) - t) / (x - c);
      near(f(c + 1e-7), fnum(bVal), 1e-4);
      return fnum(ans);
    },
  });
}

function coeffAlgebraLimits(random, profile) {
  // lim_{x->c} f(x)/(x-c)=B and lim_{x->inf} (f(x)-x^3)/x^2 = A with f cubic, leading 1. Ask f(k)-type.
  const A = ri(random, -9, 6);
  const c = ri(random, 1, 3);
  const B = ri(random, -9, 9);
  // f = x^3 + A x^2 + p x + q ; f(c)=0 ; f'(c)=B
  // f'(c) = 3c^2 + 2Ac + p = B -> p
  const p = B - 3 * c * c - 2 * A * c;
  const q = -(c ** 3 + A * c * c + p * c);
  const f = (x) => x ** 3 + A * x * x + p * x + q;
  const T = (ko, en) => tx(profile, ko, en);
  const ask = pick(random, [0, 2]);
  return finish(random, {
    tag: 'jc1-coeff',
    prompt: T(`다항함수 $f(x)$ 가 $\\lim_{x\\to\\infty}\\frac{f(x)-x^3}{x^2}=${A},\\ \\lim_{x\\to${c}}\\frac{f(x)}{x-${c}}=${B}$ 를 만족시킬 때, $f(${ask})$ 의 값을 구하시오.`,
      `A polynomial f satisfies the two limit conditions; find f(${ask}).`),
    answer: Fr(f(ask)),
    explanation: T(`첫째 조건에서 $f(x)=x^3+${num(A)}x^2+px+q$ ($f$ 는 삼차식이고 최고차항의 계수가 $1$) 로 놓는다.\n둘째 조건에서 분모 $\\to0$ 이므로 $f(${c})=0$, 극한값은 $f'(${c})=${B}$ 이다.\n$f'(${c})=${3 * c * c}+${num(2 * A * c)}+p=${B}$ → $p=${p}$, $f(${c})=0$ → $q=${q}$.\n따라서 $f(${ask})=${f(ask)}$`,
      `f(x)=x^3+${A}x^2+${p}x+${q}; f(${ask})=${f(ask)}.`),
    verify: () => {
      near((f(1e5) - 1e15) / 1e10, A, 1e-3);
      near(f(c + 1e-6) / 1e-6, B, 1e-3);
      return f(ask);
    },
    allowShort: false,
  });
}

function coeffQuadraticOverQuadratic(random, profile) {
  // lim_{x->c} (x^2 + a x + b)/(x^2 - m^2) with c=m : factor
  const m = ri(random, 1, 4);
  const r = ri(random, -4, 5);
  // numerator (x-m)(x-r) ; denominator x^2-m^2 -> limit = (m-r)/(2m)
  const a = -(m + r);
  const b = m * r;
  const L = Fr(m - r, 2 * m);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-coeff',
    prompt: T(`상수 $a, b$ 에 대하여 $\\lim_{x\\to${m}}\\frac{x^2${a >= 0 ? '+' : ''}${co(a)}x${b >= 0 ? '+' : ''}${b}}{x^2-${m * m}}=${ftex(L)}$ 일 때, $a-b$ 의 값은?`,
      `Find a-b.`),
    answer: Fr(a - b),
    explanation: T(`분모 $\\to0$ 이므로 분자 $x^2+ax+b$ 는 $(x-${m})$ 을 인수로 가져야 한다. 분자를 $(x-${m})(x-s)$ 로 놓으면 극한값은 $\\frac{${m}-s}{${2 * m}}=${ftex(L)}$ 이므로 $s=${r}$.\n따라서 $a=-(${m}+${num(r)})=${a}$, $b=${m}\\cdot ${num(r)}=${b}$ 이고 $a-b=${a - b}$`,
      `Factor numerator as (x-${m})(x-${r}).`),
    verify: () => {
      const f = (x) => (x * x + a * x + b) / (x * x - m * m);
      near(f(m + 1e-7), fnum(L), 1e-4);
      return a - b;
    },
  });
}

// ===== 08 함수의 연속 ======================================================================
function continuityOneParam(random, profile) {
  const c = ri(random, -2, 3);
  const p = pick(random, [-2, -1, 1, 2]);
  const q = ri(random, -5, 6);
  const r = pick(random, [-1, 1, 2]);
  const s = ri(random, -4, 4);
  // f = p x + q (x<=c) ; r x^2 + s x + a (x>c).  continuity: p c + q = r c^2 + s c + a
  const a = p * c + q - (r * c * c + s * c);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-continuity',
    prompt: T(`함수 $f(x)=\\begin{cases}${lin(p, q)} & (x\\le${c})\\\\ ${quad(r, s, 0)}${a >= 0 ? '+' : ''}a & (x>${c})\\end{cases}$ 가 실수 전체의 집합에서 연속일 때, 상수 $a$ 의 값은?`,
      `f is continuous on R; find a.`),
    answer: Fr(a),
    explanation: T(`$x=${c}$ 에서 연속이려면 $\\lim_{x\\to${c}-}f(x)=\\lim_{x\\to${c}+}f(x)=f(${c})$ 이어야 한다.\n$${p * c + q}=${r * c * c + s * c}+a$ 이므로 $a=${a}$`,
      `Matching at x=${c} gives a=${a}.`),
    verify: () => {
      const f = (x) => (x <= c ? p * x + q : r * x * x + s * x + a);
      near(f(c - 1e-9), f(c + 1e-9), 1e-6);
      return a;
    },
  });
}

function continuityAbsSplit(random, profile) {
  const cc = pick(random, [1, 2]);
  // f = x^2 + P x + Q (|x| > cc) ; -x^2 + a x + b (|x| <= cc). continuity at x=cc and x=-cc.
  const P1 = ri(random, -3, 3);
  const Q1 = ri(random, -3, 3);
  const g = (x) => x * x + P1 * x + Q1;
  // -c^2 + a c + b = g(c) ; -c^2 - a c + b = g(-c)
  const vR = g(cc);
  const vL = g(-cc);
  const aa = Fr(vR - vL, 2 * cc);
  const bb = Fr(vR + vL + 2 * cc * cc, 2);
  if (aa.d !== 1 || bb.d !== 1) return continuityAbsSplit(random, profile);
  const a = aa.n;
  const b = bb.n;
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-continuity',
    prompt: T(`함수 $f(x)=\\begin{cases}${quad(1, P1, Q1)} & (|x|>${cc})\\\\ -x^2+ax+b & (|x|\\le${cc})\\end{cases}$ 가 모든 실수 $x$ 에서 연속이 되도록 상수 $a, b$ 의 값을 정할 때, $a-b$ 의 값은?`,
      `Find a-b so that f is continuous everywhere.`),
    answer: Fr(a - b),
    explanation: T(`$x=${cc}$ 에서 $-${cc * cc}+${num(a * cc)}+b=${vR}$, $x=-${cc}$ 에서 $-${cc * cc}+${num(-a * cc)}+b=${vL}$.\n두 식을 연립하면 $a=${a}$, $b=${b}$ 이므로 $a-b=${a - b}$`,
      `Solve the two matching equations: a=${a}, b=${b}.`),
    verify: () => {
      const f = (x) => (Math.abs(x) > cc ? g(x) : -x * x + a * x + b);
      near(f(cc - 1e-9), f(cc + 1e-9), 1e-6);
      near(f(-cc + 1e-9), f(-cc - 1e-9), 1e-6);
      return a - b;
    },
  });
}

function continuityProduct(random, profile) {
  // f = x+p (x<=a), x^2+s x (x>a) ; g = x - w ; f g continuous. roots u,v of x+p = x^2+sx.
  let u; let v;
  do { u = ri(random, -4, 4); v = ri(random, -4, 4); } while (u === v);
  const s = 1 - (u + v); // x^2 + s x - x - p = x^2+(s-1)x-p = (x-u)(x-v) -> s-1 = -(u+v), p=-uv
  const p = -u * v;
  let w;
  do { w = ri(random, -6, 6); } while (w === u || w === v);
  const vals = [u, v, w];
  const prod = u * v * w;
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-continuity',
    prompt: T(`두 함수 $f(x)=\\begin{cases}x${p >= 0 ? '+' : ''}${p} & (x\\le a)\\\\ ${quad(1, s, 0)} & (x>a)\\end{cases},\\ g(x)=x-${num(w)}$ 에 대하여 함수 $f(x)g(x)$ 가 실수 전체의 집합에서 연속이 되도록 하는 모든 실수 $a$ 의 값의 곱을 구하시오.`,
      `Find the product of all a for which f(x)g(x) is continuous.`),
    answer: Fr(prod),
    explanation: T(`$f(x)g(x)$ 가 $x=a$ 에서 연속이려면 $\\lim_{x\\to a-}f g=\\lim_{x\\to a+}f g=f(a)g(a)$, 즉 $(a+${num(p)})(a-${num(w)})=(a^2+${num(s)}a)(a-${num(w)})$ 이어야 한다.\n$(a-${num(w)})\\{(a^2+${num(s - 1)}a)-${num(p)}\\}=0$ → $(a-${num(w)})(a-${num(u)})(a-${num(v)})=0$.\n따라서 $a=${u},\\ ${v},\\ ${w}$ 이고 곱은 $${prod}$`,
      `Roots ${u}, ${v}, ${w}; product ${prod}.`),
    verify: () => {
      let product = 1;
      for (const a of vals) {
        const left = (a + p) * (a - w);
        const right = (a * a + s * a) * (a - w);
        near(left, right, 1e-9);
        product *= a;
      }
      return product;
    },
    allowShort: false,
  });
}

function continuityGeometricLimit(random, profile) {
  const P2 = ri(random, 2, 6);
  const Q2 = ri(random, 2, 8);
  const a = P2 + Q2 - 1;
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-continuity',
    prompt: T(`함수 $f(x)=\\begin{cases}x+a & (x\\le1)\\\\ \\lim_{n\\to\\infty}\\frac{${P2}x^{n+1}+${Q2}x^n}{x^n+1} & (x>1)\\end{cases}$ 이 실수 전체의 집합에서 연속일 때, 상수 $a$ 의 값은?`,
      `f continuous; find a.`),
    answer: Fr(a),
    explanation: T(`$x>1$ 이면 $\\frac{${P2}x^{n+1}+${Q2}x^n}{x^n+1}=\\frac{${P2}x+${Q2}}{1+x^{-n}}\\to${P2}x+${Q2}$ 이다.\n$x=1$ 에서 연속이려면 $1+a=${P2}+${Q2}$ 이므로 $a=${a}$`,
      `For x>1 the limit is ${P2}x+${Q2}; continuity at 1 gives a=${a}.`),
    verify: () => {
      const g = (x) => { const n = 400; const r = x ** -n; return (P2 * x * 1 + Q2) / (1 + r); };
      near(g(1.5), 1.5 * P2 + Q2, 1e-6);
      near(1 + a, P2 * 1 + Q2, 1e-9);
      return a;
    },
  });
}

function continuityPeriodic(random, profile) {
  const u = ri(random, -5, 6);
  // f(x+2)=f(x); f = a x + u (-1<=x<0); 3x^2+2a x + b (0<=x<1). continuity at 0: b=u ; at 1: 3+2a+b = f(-1)= -a+u => a=-1
  const ans = u - 1;
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-continuity',
    prompt: T(`함수 $f(x)$ 는 모든 실수 $x$ 에 대하여 $f(x+2)=f(x)$ 를 만족시키고 $f(x)=\\begin{cases}ax${u >= 0 ? '+' : ''}${u} & (-1\\le x<0)\\\\ 3x^2+2ax+b & (0\\le x<1)\\end{cases}$ 이다. $f(x)$ 가 실수 전체의 집합에서 연속일 때, 두 상수 $a, b$ 의 합 $a+b$ 의 값은?`,
      `f is 2-periodic and continuous; find a+b.`),
    answer: Fr(ans),
    explanation: T(`$x=0$ 에서 연속: $\\lim_{x\\to0-}(ax+${num(u)})=${u}=f(0)=b$ → $b=${u}$.\n주기가 $2$ 이므로 $x=1$ 에서의 연속은 $\\lim_{x\\to1-}f(x)=f(1)=f(-1)$: $3+2a+b=-a+${num(u)}$ → $3a=-3$, $a=-1$.\n따라서 $a+b=${ans}$`,
      `b=${u}, a=-1.`),
    verify: () => {
      const a = -1; const b = u;
      const f = (x) => { let y = x; while (y >= 1) y -= 2; while (y < -1) y += 2; return y < 0 ? a * y + u : 3 * y * y + 2 * a * y + b; };
      near(f(1 - 1e-9), f(1 + 1e-9 - 2 + 2), 1e-6);
      near(f(-1e-9), f(1e-9), 1e-6);
      return a + b;
    },
  });
}

// ===== 09 미분계수와 미분가능성 =================================================================
function derivDefinitionLimit(random, profile) {
  const deg = pick(random, [2, 3]);
  const co2 = ri(random, 1, 3);
  const co1 = ri(random, -6, 6);
  const co0 = ri(random, -5, 5);
  const poly = deg === 2 ? P(co2, co1, co0) : P(1, co2, co1, co0);
  const at = ri(random, -2, 3);
  const d1 = pEval(pDer(poly), at);
  const k = ri(random, 1, 4);
  const m = ri(random, 1, 4);
  const n = ri(random, 1, 4);
  const T = (ko, en) => tx(profile, ko, en);
  const tex = polyTex(poly);
  const ans = fdiv(fmul(Fr(k + m), d1), Fr(n));
  return finish(random, {
    tag: 'jc1-derivative',
    prompt: T(`함수 $f(x)=${tex}$ 에 대하여 $\\lim_{h\\to0}\\frac{f(${at}+${k === 1 ? '' : k}h)-f(${at}-${m === 1 ? '' : m}h)}{${n === 1 ? '' : n}h}$ 의 값은?`,
      `Evaluate the difference quotient limit for f(x)=${tex}.`),
    answer: ans,
    explanation: T(`$f'(x)=${polyTex(pDer(poly))}$ 이므로 $f'(${at})=${ftex(d1)}$.\n$\\frac{f(${at}+${k}h)-f(${at}-${m}h)}{${n}h}=\\frac{f(${at}+${k}h)-f(${at})}{${n}h}+\\frac{f(${at})-f(${at}-${m}h)}{${n}h}$ 이고 극한은 $\\frac{${k}+${m}}{${n}}f'(${at})$ 이다.\n따라서 $\\frac{${k + m}}{${n}}\\cdot ${ftex(d1)}=${ftex(ans)}$`,
      `Equals (k+m)/n * f'(${at}) = ${ftex(ans)}.`),
    verify: () => {
      const f = (x) => fnum(pEval(poly, x));
      const h = 1e-6;
      return near((f(at + k * h) - f(at - m * h)) / (n * h), fnum(ans), 1e-4);
    },
    allowShort: true,
  });
}

function differentiableCubicQuadratic(random, profile) {
  const c2 = pick(random, [1, 2, 3]);
  const c0 = ri(random, -3, 3);
  const V = c2 + c0;
  const D = 2 * c2;
  // right: x^3 + a x^2 + b x at x=1 ; a = D-V-2 ; b = V-1-a
  const a = D - V - 2;
  const b = V - 1 - a;
  const ask = pick(random, ['prod', 'sum']);
  const ans = ask === 'prod' ? a * b : a + b;
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-derivative',
    prompt: T(`함수 $f(x)=\\begin{cases}x^3+ax^2+bx & (x\\ge1)\\\\ ${co(c2)}x^2${c0 >= 0 ? '+' : ''}${c0} & (x<1)\\end{cases}$ 이 모든 실수 $x$ 에서 미분가능하도록 상수 $a, b$ 의 값을 정할 때, ${ask === 'prod' ? '$ab$' : '$a+b$'} 의 값은?`,
      `f differentiable everywhere; find ${ask === 'prod' ? 'ab' : 'a+b'}.`),
    answer: Fr(ans),
    explanation: T(`$x=1$ 에서 연속: $1+a+b=${V}$. 미분계수가 같아야 하므로 $3+2a+b=${D}$.\n두 식에서 $a=${a}$, $b=${b}$ 이므로 ${ask === 'prod' ? '$ab$' : '$a+b$'}$=${ans}$`,
      `Continuity and equal derivative at 1: a=${a}, b=${b}.`),
    verify: () => {
      const f = (x) => (x >= 1 ? x ** 3 + a * x * x + b * x : c2 * x * x + c0);
      near(f(1 - 1e-9), f(1 + 1e-9), 1e-6);
      const dl = (f(1) - f(1 - 1e-6)) / 1e-6;
      const dr = (f(1 + 1e-6) - f(1)) / 1e-6;
      near(dl, dr, 1e-4);
      return ans;
    },
    allowShort: true,
  });
}

function derivRiemannLimit(random, profile) {
  const p = pick(random, [1, 2, 3]);
  const q = ri(random, -8, 8);
  const r = ri(random, -5, 5);
  const at = ri(random, -3, 5);
  const L = 2 * p * at + q;
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-derivative',
    prompt: T(`함수 $f(x)=${quad(p, q, r)}$ 에 대하여 $\\lim_{n\\to\\infty}n\\left\\{f\\left(a+\\frac{1}{n}\\right)-f(a)\\right\\}=${L}$ 일 때, 상수 $a$ 의 값은?`,
      `Find a.`),
    answer: Fr(at),
    explanation: T(`$h=\\frac1n$ 로 놓으면 $\\lim_{n\\to\\infty}n\\{f(a+\\tfrac1n)-f(a)\\}=\\lim_{h\\to0}\\frac{f(a+h)-f(a)}{h}=f'(a)$.\n$f'(x)=${lin(2 * p, q)}$ 이므로 $f'(a)=${2 * p}a+${num(q)}=${L}$ 에서 $a=${at}$`,
      `The limit equals f'(a); solve ${2 * p}a+${q}=${L}.`),
    verify: () => {
      const f = (x) => p * x * x + q * x + r;
      const n = 1e6;
      near(n * (f(at + 1 / n) - f(at)), L, 1e-4);
      return at;
    },
  });
}

function derivProductRule(random, profile) {
  const F0 = ri(random, -4, 6);
  const G0 = ri(random, -4, 6);
  const u = ri(random, -5, 7);
  const v = ri(random, -5, 7);
  const c = ri(random, -2, 4);
  const T = (ko, en) => tx(profile, ko, en);
  const ans = u * G0 + v * F0;
  return finish(random, {
    tag: 'jc1-derivative',
    prompt: T(`다항함수 $f(x), g(x)$ 가 $\\lim_{x\\to${c}}\\frac{f(x)${F0 < 0 ? `+${-F0}` : `-${F0}`}}{x${c === 0 ? '' : c > 0 ? `-${c}` : `+${-c}`}}=${u},\\ \\lim_{x\\to${c}}\\frac{g(x)${G0 < 0 ? `+${-G0}` : `-${G0}`}}{x${c === 0 ? '' : c > 0 ? `-${c}` : `+${-c}`}}=${v}$ 를 만족시킬 때, 함수 $y=f(x)g(x)$ 의 $x=${c}$ 에서의 미분계수는?`,
      `Find (fg)'(${c}).`),
    answer: Fr(ans),
    explanation: T(`조건에서 $f(${c})=${F0},\\ f'(${c})=${u},\\ g(${c})=${G0},\\ g'(${c})=${v}$ 이다.\n$(fg)'(${c})=f'(${c})g(${c})+f(${c})g'(${c})=${num(u)}\\cdot ${num(G0)}+${num(F0)}\\cdot ${num(v)}=${ans}$`,
      `Product rule gives ${ans}.`),
    verify: () => {
      const f = (x) => F0 + u * (x - c);
      const g = (x) => G0 + v * (x - c);
      return near(numeric.deriv((x) => f(x) * g(x), c), ans, 1e-4);
    },
  });
}

function derivEvenFunction(random, profile) {
  // f even: f'(-x) = -f'(x). lim_{x->-s} (f(x^2) - f(s^2))/(f(x) - f(-s)) = f'(s^2)*2x / f'(-s) at x=-s = f'(s^2)(-2s)/(-f'(s)) = 2 s f'(s^2)/f'(s)
  const s = pick(random, [2, 3]);
  const alpha = pick(random, [-3, -2, 2, 3, 4, 5]); // f'(s)
  const mult = ri(random, 1, 3);
  const beta = alpha * mult; // f'(s^2), chosen so result is integer-ish
  const ans = fdiv(Fr(2 * s * beta), Fr(alpha));
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-derivative',
    prompt: T(`함수 $f(x)$ 의 그래프는 $y$축에 대하여 대칭이고, $f'(${s})=${alpha},\\ f'(${s * s})=${beta}$ 일 때, $\\lim_{x\\to-${s}}\\frac{f(x^2)-f(${s * s})}{f(x)-f(-${s})}$ 의 값은?`,
      `f is even with f'(${s})=${alpha}, f'(${s * s})=${beta}; evaluate the limit.`),
    answer: ans,
    explanation: T(`그래프가 $y$축에 대하여 대칭이므로 $f(-x)=f(x)$, 미분하면 $f'(-x)=-f'(x)$ 이므로 $f'(-${s})=${-alpha}$.\n$\\frac{f(x^2)-f(${s * s})}{x+${s}}\\div\\frac{f(x)-f(-${s})}{x+${s}}$ 에서 분자는 $x^2-${s * s}=(x+${s})(x-${s})$ 이므로\n극한 $=\\frac{f'(${s * s})\\cdot(-${2 * s})}{f'(-${s})}=\\frac{${beta}\\cdot(-${2 * s})}{${-alpha}}=${ftex(ans)}$`,
      `Chain rule with f'(-s)=-f'(s): ${ftex(ans)}.`),
    verify: () => {
      // independent check: even polynomial f = A x^2 + B x^4 with the prescribed derivatives
      const det = 2 * s * 4 * s ** 6 - 4 * s ** 3 * 2 * s * s;
      const A = (alpha * 4 * s ** 6 - 4 * s ** 3 * beta) / det;
      const B = (2 * s * beta - alpha * 2 * s * s) / det;
      const f = (x) => A * x * x + B * x ** 4;
      near(numeric.deriv(f, s), alpha, 1e-5);
      const h = 1e-6;
      const x = -s + h;
      return near((f(x * x) - f(s * s)) / (f(x) - f(-s)), fnum(ans), 1e-3);
    },
  });
}

function derivIntegralDefinition(random, profile) {
  const val = ri(random, 2, 9);
  const d = ri(random, 2, 12);
  const ans = val + d;
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-derivative',
    prompt: T(`다항함수 $f(x)$ 가 $\\lim_{x\\to1}\\frac{f(x)-${val}}{x-1}=${d}$ 를 만족시킨다. $g(x)=xf(x)$ 라 할 때, $g'(1)$ 의 값을 구하시오.`,
      `Find g'(1) for g(x)=x f(x).`),
    answer: Fr(ans),
    explanation: T(`조건에서 $f(1)=${val}$, $f'(1)=${d}$. $g'(x)=f(x)+xf'(x)$ 이므로 $g'(1)=f(1)+f'(1)=${val}+${d}=${ans}$`,
      `g'(1)=f(1)+f'(1)=${ans}.`),
    verify: () => {
      const f = (x) => val + d * (x - 1) + 3 * (x - 1) ** 2;
      return near(numeric.deriv((x) => x * f(x), 1), ans, 1e-4);
    },
  });
}

// ===== 10 접선의 방정식 =====================================================================
function tangentCubicLine(random, profile) {
  const a3 = pick(random, [1, 2, -1, -2]);
  const a2 = ri(random, -4, 4);
  const a1 = ri(random, -6, 6);
  const a0 = ri(random, -5, 5);
  const poly = P(a3, a2, a1, a0);
  const x0 = ri(random, -2, 3);
  const y0 = pEval(poly, x0);
  const m = pEval(pDer(poly), x0);
  const b = fsub(y0, fmul(m, Fr(x0)));
  const T = (ko, en) => tx(profile, ko, en);
  const ask = pick(random, [0, 1]);
  const ans = ask === 0 ? fsub(m, b) : fadd(fmul(Fr(10), m), b);
  return finish(random, {
    tag: 'jc1-tangent',
    prompt: T(`곡선 $y=${polyTex(poly)}$ 위의 $x=${x0}$ 인 점에서의 접선의 방정식을 $y=ax+b$ 라 할 때, ${ask === 0 ? '$a-b$' : '$10a+b$'} 의 값을 구하시오. (단, $a, b$ 는 상수이다.)`,
      `Tangent at x=${x0} is y=ax+b; find ${ask === 0 ? 'a-b' : '10a+b'}.`),
    answer: ans,
    explanation: T(`$y'=${polyTex(pDer(poly))}$ 이므로 $x=${x0}$ 에서의 기울기 $a=${ftex(m)}$, 접점은 $(${x0},\\ ${ftex(y0)})$.\n접선: $y-${num(y0.n)}=${num(m.n)}(x-${num(x0)})$ → $b=${ftex(b)}$.\n따라서 ${ask === 0 ? '$a-b$' : '$10a+b$'}$=${ftex(ans)}$`,
      `a=${ftex(m)}, b=${ftex(b)}.`),
    verify: () => {
      const f = (x) => fnum(pEval(poly, x));
      const slope = numeric.deriv(f, x0);
      const bb = f(x0) - slope * x0;
      return near(ask === 0 ? slope - bb : 10 * slope + bb, fnum(ans), 1e-4);
    },
  });
}

function tangentThroughPoint(random, profile) {
  const pp = ri(random, -3, 2);
  const t = ri(random, -1, 3);
  const aa = ri(random, -6, 14);
  // y = x^3 + p x^2 + a ; tangent at x=t passes (X, Y)
  const X = ri(random, -10, 0);
  const f0 = (x) => x ** 3 + pp * x * x;
  const f0d = (x) => 3 * x * x + 2 * pp * x;
  const Y = f0(t) + aa + f0d(t) * (X - t);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-tangent',
    prompt: T(`곡선 $y=x^3${pp === 0 ? '' : `${pp > 0 ? '+' : ''}${co(pp)}x^2`}+a$ 위의 점 $(${t},\\ ${f0(t) + aa})$ 에서의 접선이 점 $(${X},\\ ${Y})$ 를 지날 때, 상수 $a$ 의 값을 구하시오.`,
      `The tangent at the given point passes through (${X}, ${Y}); find a.`),
    answer: Fr(aa),
    explanation: T(`$y'=3x^2${pp === 0 ? '' : `${2 * pp > 0 ? '+' : ''}${2 * pp}x`}$ 이므로 $x=${t}$ 에서의 기울기는 $${f0d(t)}$.\n접선: $y-${num(f0(t) + aa)}=${num(f0d(t))}(x-${num(t)})$ 이 점 $(${X},\\ ${Y})$ 를 지나므로\n$${Y}-${num(f0(t) + aa)}=${num(f0d(t))}(${X}-${num(t)})$ 에서 $a=${aa}$`,
      `Substitute (${X}, ${Y}) into the tangent line: a=${aa}.`),
    verify: () => {
      const f = (x) => x ** 3 + pp * x * x + aa;
      const m = numeric.deriv(f, t);
      near(f(t) + m * (X - t), Y, 1e-4);
      return aa;
    },
  });
}

function tangentCommonPoint(random, profile) {
  const d = ri(random, -6, 4);
  const b = d + 2;
  const a = 2 * b - 3;
  const T = (ko, en) => tx(profile, ko, en);
  const ask = pick(random, ['a+b', 'ab']);
  const ans = ask === 'a+b' ? a + b : a * b;
  return finish(random, {
    tag: 'jc1-tangent',
    prompt: T(`두 곡선 $f(x)=x^3+ax,\\ g(x)=bx^2${d >= 0 ? '+' : ''}${d}$ 가 $x=1$ 인 점에서 같은 직선에 접하도록 하는 상수 $a, b$ 에 대하여 $${ask}$ 의 값은?`,
      `Two curves are tangent to the same line at x=1; find ${ask}.`),
    answer: Fr(ans),
    explanation: T(`$x=1$ 에서 접하므로 $f(1)=g(1)$, $f'(1)=g'(1)$.\n$1+a=b+${num(d)}$, $3+a=2b$ 에서 $a=${a}$, $b=${b}$.\n따라서 $${ask}=${ans}$`,
      `a=${a}, b=${b}.`),
    verify: () => {
      const f = (x) => x ** 3 + a * x;
      const g = (x) => b * x * x + d;
      near(f(1), g(1), 1e-9);
      near(numeric.deriv(f, 1), numeric.deriv(g, 1), 1e-4);
      return ans;
    },
  });
}

function tangentPerpendicular(random, profile) {
  const m = pick(random, [2, 3, 4, 5]);
  const x0 = ri(random, 1, 3);
  const k = ri(random, 1, 3);
  // y = x^3 - a x + b at (x0, y0); slope = 3 x0^2 - a = m -> a ; y0 = x0^3 - a x0 + b
  const a = 3 * x0 * x0 - m;
  const y0 = ri(random, -3, 6);
  const b = y0 - x0 ** 3 + a * x0;
  const T = (ko, en) => tx(profile, ko, en);
  void k;
  return finish(random, {
    tag: 'jc1-tangent',
    prompt: T(`곡선 $y=x^3${a === 0 ? '' : `${-a > 0 ? '+' : ''}${co(-a)}x`}+b$ 위의 점 $(${x0},\\ ${y0})$ 에서의 접선과 수직인 직선의 기울기가 $-\\frac{1}{${m}}$ 일 때, 상수 $b$ 의 값은?`,
      `Find b.`),
    answer: Fr(b),
    explanation: T(`접선의 기울기를 $s$ 라 하면 수직인 직선의 기울기는 $-\\frac{1}{s}=-\\frac{1}{${m}}$ 이므로 $s=${m}$.\n$y'=3x^2${a === 0 ? '' : `${-a > 0 ? '+' : ''}${-a}`}$ 이고 $y'(${x0})=${m}$ 이다.\n점 $(${x0},\\ ${y0})$ 가 곡선 위의 점이므로 $${y0}=${x0 ** 3}+(${-a})\\cdot ${x0}+b$ 에서 $b=${b}$`,
      `Slope ${m}; b=${b}.`),
    verify: () => {
      const f = (x) => x ** 3 - a * x + b;
      near(numeric.deriv(f, x0), m, 1e-4);
      near(f(x0), y0, 1e-9);
      return b;
    },
  });
}

function tangentAreaTriangle(random, profile) {
  const kNum = pick(random, [1, 2, 3]);
  const kDen = pick(random, [1, 2, 4]);
  const k = Fr(kNum, kDen);
  const t = pick(random, [1, 2, 3, 4]);
  // y = k x^2 ; tangent at (t, k t^2): y = 2 k t x - k t^2 ; x-intercept t/2 ; y-intercept -k t^2 ; area = (1/2)(t/2)(k t^2) = k t^3/4
  const area = fmul(k, Fr(t ** 3, 4));
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-tangent',
    prompt: T(`포물선 $y=${ftex(k)}x^2$ 위의 점 $(${t},\\ ${ftex(fmul(k, Fr(t * t)))})$ 에서의 접선과 $x$축, $y$축으로 둘러싸인 삼각형의 넓이는?`,
      `Find the area of the triangle formed by the tangent and the axes.`),
    answer: area,
    explanation: T(`$y'=${ftex(fmul(k, Fr(2)))}x$ 이므로 기울기는 $${ftex(fmul(k, Fr(2 * t)))}$, 접선: $y=${ftex(fmul(k, Fr(2 * t)))}x-${ftex(fmul(k, Fr(t * t)))}$.\n$x$절편 $\\frac{${t}}{2}$, $y$절편 $-${ftex(fmul(k, Fr(t * t)))}$ 이므로 넓이는 $\\frac12\\cdot\\frac{${t}}{2}\\cdot ${ftex(fmul(k, Fr(t * t)))}=${ftex(area)}$`,
      `Area ${ftex(area)}.`),
    verify: () => {
      const f = (x) => fnum(k) * x * x;
      const m = numeric.deriv(f, t);
      const xi = t - f(t) / m;
      const yi = f(t) - m * t;
      return near(0.5 * Math.abs(xi) * Math.abs(yi), fnum(area), 1e-4);
    },
  });
}

export const LIMITS_ENGINES = {
  'jc1-one-sided': [oneSidedPiecewise, oneSidedAbs, oneSidedFloor, limitExistsConstant],
  'jc1-coeff': [coeffFactorQuadratic, coeffRadical, coeffAlgebraLimits, coeffQuadraticOverQuadratic],
  'jc1-continuity': [continuityOneParam, continuityAbsSplit, continuityProduct, continuityGeometricLimit, continuityPeriodic],
  'jc1-derivative': [derivDefinitionLimit, differentiableCubicQuadratic, derivRiemannLimit, derivProductRule, derivEvenFunction, derivIntegralDefinition],
  'jc1-tangent': [tangentCubicLine, tangentThroughPoint, tangentCommonPoint, tangentPerpendicular, tangentAreaTriangle],
};

// keep tree-shaking quiet about helpers used only in some generators
void shuffle; void fneg; void pMul;
