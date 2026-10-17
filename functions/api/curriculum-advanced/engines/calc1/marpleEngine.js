// Extra Calculus I generators for the 마플 수능기출 미적분Ⅰ book (server-only, same contract as the other calc1
// engines): function limits of rational / irrational expressions, a geometric-series sum, and the
// indefinite-integral unit that the jjang engines do not cover. Every generator is built backward from
// chosen integer parameters and ships an independent numeric `verify`.
import {
  ri, pick, tx, Fr, fadd, fsub, fmul, fdiv, fnum, ftex, finish,
  P, pEval, pDer, pInt, pMul, polyTex, F,
} from './common.js';

const near = (got, want, tol = 1e-4) => {
  if (!(Math.abs(got - want) <= tol * Math.max(1, Math.abs(want)))) throw new Error(`numeric mismatch: got ${got}, want ${want}`);
  return want;
};
const nf = (f) => fnum(f);
const lin = (a, b) => { // "x+b" / "x-b" with leading coefficient 1 or generic a
  const ax = a === 1 ? 'x' : a === -1 ? '-x' : `${a}x`;
  if (b === 0) return ax;
  return `${ax}${b > 0 ? '+' : '-'}${Math.abs(b)}`;
};
const sgn = (n) => (n < 0 ? `-${-n}` : `+${n}`);

// ===== 함수의 극한값 : 유리함수 / 무리함수 =======================================================
// lim_{x->a} c(x-a)(x+b) / ((x-a)(x+d)) written expanded so the student must factor.
function mpRationalLimit(random, profile) {
  const a = ri(random, -3, 4);
  let b = ri(random, -4, 5);
  let d = ri(random, -4, 5);
  while (a + d === 0) d = ri(random, -4, 5);
  if (b === d) b += 1;
  const c = pick(random, [1, 1, 2, 3]);
  const nume = pMul(P(1, -a), P(1, b)); // (x-a)(x+b)
  const deno = pMul(P(1, -a), P(1, d));
  const T = (ko, en) => tx(profile, ko, en);
  const val = Fr(c * (a + b), a + d);
  const numTxt = c === 1 ? polyTex(nume) : `${c}\\left(${polyTex(nume)}\\right)`;
  return finish(random, {
    tag: 'mp-func-limit',
    prompt: T(`$\\lim_{x\\to${a}}\\dfrac{${numTxt}}{${polyTex(deno)}}$ 의 값은?`, 'Find the limit.'),
    answer: val,
    explanation: T(`분자·분모를 인수분해하면 $\\dfrac{${c === 1 ? '' : `${c}`}(x${sgn(-a)})(x${sgn(b)})}{(x${sgn(-a)})(x${sgn(d)})}$ 이고 $x\\ne${a}$ 이므로 약분하면\n$\\lim_{x\\to${a}}\\dfrac{${c === 1 ? '' : c}(x${sgn(b)})}{x${sgn(d)}}=\\dfrac{${c * (a + b)}}{${a + d}}=${ftex(val)}$`, 'Factor and cancel.'),
    verify: () => {
      const f = (x) => (c * (x - a) * (x + b)) / ((x - a) * (x + d));
      return near((f(a + 1e-6) + f(a - 1e-6)) / 2, nf(val), 1e-4);
    },
  });
}

// lim_{x->a} (sqrt(x+k) - m)/(x-a)   (a+k = m^2)   or its reciprocal form
function mpIrrationalLimit(random, profile) {
  const m = ri(random, 1, 5);
  const a = ri(random, -3, 6);
  const k = m * m - a;
  const inv = random() < 0.4;
  const T = (ko, en) => tx(profile, ko, en);
  const kTxt = k === 0 ? 'x' : `x${k > 0 ? '+' : '-'}${Math.abs(k)}`;
  const den = a === 0 ? 'x' : `x${a > 0 ? '-' : '+'}${Math.abs(a)}`;
  const val = inv ? Fr(2 * m) : Fr(1, 2 * m);
  return finish(random, {
    tag: 'mp-func-limit',
    prompt: inv
      ? T(`$\\lim_{x\\to${a}}\\dfrac{${den}}{\\sqrt{${kTxt}}-${m}}$ 의 값은?`, 'Find the limit.')
      : T(`$\\lim_{x\\to${a}}\\dfrac{\\sqrt{${kTxt}}-${m}}{${den}}$ 의 값은?`, 'Find the limit.'),
    answer: val,
    explanation: T(`분모(또는 분자)의 무리식을 유리화한다. $\\sqrt{${kTxt}}-${m}$ 에 $\\sqrt{${kTxt}}+${m}$ 을 곱하면 $(${kTxt})-${m * m}=${den}$ 이므로\n${inv ? `$\\lim_{x\\to${a}}\\dfrac{${den}}{\\sqrt{${kTxt}}-${m}}=\\lim_{x\\to${a}}\\left(\\sqrt{${kTxt}}+${m}\\right)=${2 * m}$` : `$\\lim_{x\\to${a}}\\dfrac{\\sqrt{${kTxt}}-${m}}{${den}}=\\lim_{x\\to${a}}\\dfrac{1}{\\sqrt{${kTxt}}+${m}}=\\dfrac{1}{${2 * m}}$`}`, 'Rationalise.'),
    verify: () => {
      const f = inv ? (x) => (x - a) / (Math.sqrt(x + k) - m) : (x) => (Math.sqrt(x + k) - m) / (x - a);
      return near((f(a + 1e-5) + f(a - 1e-5)) / 2, nf(val), 1e-3);
    },
  });
}

// lim_{x->inf} ( sqrt(m^2 x^2 + q x) - m x ) = q/(2m)
function mpInfinityLimit(random, profile) {
  const m = ri(random, 1, 4);
  const q = ri(random, 1, 9) * pick(random, [1, 1, -1]);
  const T = (ko, en) => tx(profile, ko, en);
  const val = Fr(q, 2 * m);
  const x2 = m * m === 1 ? 'x^2' : `${m * m}x^2`;
  const qx = q === 1 ? '+x' : q === -1 ? '-x' : q > 0 ? `+${q}x` : `${q}x`;
  const mx = m === 1 ? 'x' : `${m}x`;
  return finish(random, {
    tag: 'mp-func-limit',
    prompt: T(`$\\lim_{x\\to\\infty}\\left(\\sqrt{${x2}${qx}}-${mx}\\right)$ 의 값은?`, 'Find the limit.'),
    answer: val,
    explanation: T(`$\\infty-\\infty$ 꼴이므로 $\\sqrt{${x2}${qx}}+${mx}$ 를 곱하고 나누어 유리화하면\n$\\lim_{x\\to\\infty}\\dfrac{${q === 1 ? '' : q === -1 ? '-' : q}x}{\\sqrt{${x2}${qx}}+${mx}}=\\lim_{x\\to\\infty}\\dfrac{${q}}{\\sqrt{${m * m}${q > 0 ? '+' : '-'}\\frac{${Math.abs(q)}}{x}}+${m}}=\\dfrac{${q}}{${2 * m}}=${ftex(val)}$`, 'Rationalise.'),
    verify: () => {
      const x = 1e6;
      return near(Math.sqrt(m * m * x * x + q * x) - m * x, nf(val), 1e-3);
    },
  });
}

// ===== 등비급수의 합 : 두 등비급수의 합 ==============================================================
function mpGeometricSumPair(random, profile) {
  const pairs = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [1, 6], [5, 6]];
  const [r1, r2] = [pick(random, pairs), pick(random, pairs)];
  const sign = pick(random, [1, -1]);
  const c1 = ri(random, 1, 4);
  const c2 = ri(random, 1, 4);
  const s1 = fdiv(Fr(r1[0], r1[1]), Fr(r1[1] - r1[0], r1[1])); // r/(1-r)
  const s2 = fdiv(Fr(r2[0], r2[1]), Fr(r2[1] - r2[0], r2[1]));
  const sum = sign === 1 ? fadd(fmul(Fr(c1), s1), fmul(Fr(c2), s2)) : fsub(fmul(Fr(c1), s1), fmul(Fr(c2), s2));
  const T = (ko, en) => tx(profile, ko, en);
  const term = (c, r) => `${c === 1 ? '' : c}\\left(\\dfrac{${r[0]}}{${r[1]}}\\right)^n`;
  return finish(random, {
    tag: 'mp-geo-series',
    prompt: T(`$\\displaystyle\\sum_{n=1}^{\\infty}\\left\\{${term(c1, r1)}${sign === 1 ? '+' : '-'}${term(c2, r2)}\\right\\}$ 의 값은?`, 'Find the sum.'),
    answer: sum,
    explanation: T(`공비의 절댓값이 모두 $1$ 보다 작으므로 각각 수렴하고, 등비급수 $\\sum_{n=1}^{\\infty}ar^n=\\dfrac{ar}{1-r}$ 이다.\n첫째 급수: $${c1}\\cdot${ftex(s1)}$, 둘째 급수: $${c2}\\cdot${ftex(s2)}$\n따라서 합은 $${ftex(sum)}$`, 'Use a r/(1-r).'),
    verify: () => {
      let s = 0;
      for (let n = 1; n < 400; n += 1) s += c1 * (r1[0] / r1[1]) ** n + sign * c2 * (r2[0] / r2[1]) ** n;
      return near(s, nf(sum), 1e-6);
    },
  });
}

// ===== 부정적분 =====================================================================================
function randQuad(random) {
  return P(ri(random, 1, 4) * pick(random, [1, 1, -1]), ri(random, -4, 4), ri(random, -5, 5));
}
function antiderivativeAt(poly, x0, y0, x) {
  const anti = pInt(poly); // constant term 0
  const c = fsub(F(y0), pEval(anti, x0));
  return fadd(pEval(anti, x), c);
}

// f'(x) = polynomial, f(a) = b  ->  f(c)
function mpIndefiniteFind(random, profile) {
  const deriv = randQuad(random);
  const a = ri(random, -2, 2);
  const b = ri(random, -5, 6);
  let c = ri(random, -3, 3);
  if (c === a) c += 1;
  const val = antiderivativeAt(deriv, a, b, c);
  const T = (ko, en) => tx(profile, ko, en);
  const curve = random() < 0.5;
  const anti = pInt(deriv);
  return finish(random, {
    tag: 'mp-indefinite',
    prompt: curve
      ? T(`곡선 $y=f(x)$ 위의 임의의 점 $(x,y)$ 에서의 접선의 기울기가 $${polyTex(deriv)}$ 이고 이 곡선이 점 $(${a},${b})$ 를 지날 때, $f(${c})$ 의 값은?`, 'Find f(c).')
      : T(`다항함수 $f(x)$ 에 대하여 $f'(x)=${polyTex(deriv)}$, $f(${a})=${b}$ 일 때, $f(${c})$ 의 값은?`, 'Find f(c).'),
    answer: val,
    explanation: T(`$f(x)=\\int f'(x)\\,dx=${polyTex(anti)}+C$ (단, $C$ 는 적분상수) 이다.\n$f(${a})=${b}$ 에서 $C=${ftex(fsub(F(b), pEval(anti, a)))}$ 이므로 $f(${c})=${ftex(val)}$`, 'Integrate and use the condition.'),
    verify: () => {
      const f = (x) => nf(pEval(anti, x)) + (b - nf(pEval(anti, a)));
      const h = 1e-5;
      near((f(0.7 + h) - f(0.7 - h)) / (2 * h), nf(pEval(deriv, 0.7)), 1e-6);
      near(f(a), b, 1e-9);
      return f(c);
    },
  });
}

// F(x) = ax^3+bx^2+cx+C is an antiderivative of f  ->  f(k)
function mpIndefiniteFromAntiderivative(random, profile) {
  const A = ri(random, 1, 3) * pick(random, [1, -1]);
  const B = ri(random, -4, 4);
  const C = ri(random, -5, 5);
  const k = ri(random, -2, 3);
  const Fx = P(A, B, C, 0);
  const f = pDer(Fx);
  const val = pEval(f, k);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'mp-indefinite',
    prompt: T(`함수 $f(x)$ 의 한 부정적분이 $F(x)=${polyTex(Fx)}$ 일 때, $f(${k})$ 의 값은?`, 'Find f(k).'),
    answer: val,
    explanation: T(`$F'(x)=f(x)$ 이므로 $f(x)=${polyTex(f)}$ 이고 $f(${k})=${ftex(val)}$`, 'Differentiate F.'),
    verify: () => {
      const G = (x) => nf(pEval(Fx, x));
      const h = 1e-5;
      return near((G(k + h) - G(k - h)) / (2 * h), nf(val), 1e-6);
    },
  });
}

// ∫ f(x) dx = x f(x) - q(x)  ->  f'(x) = q'(x)/x ; with f(0)=c0 find f(t)
function mpIndefiniteSelfReference(random, profile) {
  // choose f(x) = p x^2 + r x + s  (so q'(x) = x f'(x) = 2p x^2 + r x),  q(x) = (2p/3) x^3 + (r/2) x^2
  const p = ri(random, 1, 3) * pick(random, [1, -1]);
  const r = ri(random, -3, 3);
  const s = ri(random, -4, 5);
  const t = ri(random, 1, 3);
  const q = P(Fr(2 * p, 3), Fr(r, 2), 0, 0);
  const f = P(p, r, s);
  const val = pEval(f, t);
  const T = (ko, en) => tx(profile, ko, en);
  const qTxt = polyTex(q);
  return finish(random, {
    tag: 'mp-indefinite',
    prompt: T(`다항함수 $f(x)$ 가 $\\displaystyle\\int f(x)\\,dx=xf(x)-\\left(${qTxt}\\right)$ 를 만족시키고 $f(0)=${s}$ 일 때, $f(${t})$ 의 값은?`, 'Find f(t).'),
    answer: val,
    explanation: T(`양변을 $x$ 에 대하여 미분하면 $f(x)=f(x)+xf'(x)-\\left(${polyTex(pDer(q))}\\right)$ 이므로 $xf'(x)=${polyTex(pDer(q))}$.\n따라서 $f'(x)=${polyTex(pDer(f))}$, $f(x)=${polyTex(f.slice(0, 2).concat([F(0)]))}+C$ 이고 $f(0)=${s}$ 에서 $f(x)=${polyTex(f)}$.\n$f(${t})=${ftex(val)}$`, 'Differentiate both sides.'),
    verify: () => {
      // d/dx [x f - q] must equal f  <=>  x f' = q'
      const lhs = pMul(P(1, 0), pDer(f));
      const rhs = pDer(q);
      for (let x = -2; x <= 2; x += 0.5) near(nf(pEval(lhs, x)), nf(pEval(rhs, x)), 1e-9);
      return nf(val);
    },
  });
}

export const MARPLE_ENGINES = {
  'mp-func-limit': [mpRationalLimit, mpIrrationalLimit, mpInfinityLimit],
  'mp-geo-series': [mpGeometricSumPair],
  'mp-indefinite': [mpIndefiniteFind, mpIndefiniteFromAntiderivative, mpIndefiniteSelfReference],
};
